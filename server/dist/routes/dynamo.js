"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
// core
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
// CONFIG --> multer
const multer_1 = __importDefault(require("multer"));
// not ideal -> signed url and client side is cleaner
const storage = multer_1.default.memoryStorage(); // store uploaded files in memory while we operate on them
const upload = (0, multer_1.default)({ storage, limits: { fileSize: 12000000 } });
exports.router = express_1.default.Router();
// config
dotenv_1.default.config();
// database access
const db = __importStar(require("../db/dynamo"));
const dbclient = db.ddbDocClient; // todo: remove
// ULID
const ulid_1 = require("ulid");
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const uuid = (0, ulid_1.monotonicFactory)();
// upload (put) a new file that we haven't seen before
// this should not work e.g. it is not available as an endpoint.
exports.router.post('/createFile', async (req, res, next) => {
    res.sendStatus(410); // GONE
    // const TableName = process.env.UPLOAD_TABLE='project1_uploads'
    // let out;
    // const fID:string = uuid(); // generate a new ID
    // try {
    //     out = await db.ddbDocClient.put({
    //         TableName,
    //         Item: {
    //             fID,
    //             version: 1,
    //             fUrl: 'filename234.jpg'
    //         }
    //     })
    // } catch (error) {
    //     // tslint:disable-next-line:no-console
    //     console.log(error)
    // }
    // res.send(out);
});
// take a provided file + comments and consolidate them into a new(latest) details of that file
// TODO: (up to 20?)
exports.router.post('/consolidate/:fileID', upload.none(), async (req, res, next) => {
    let out;
    try {
        const fID = req.params?.fileID || "1234";
        const fileData = await db.getCurrentFileDetails(fID);
        let lastComment;
        const newLastComment = req.body.newlastcomment;
        const comments = [JSON.parse(req.body.comments)] || [];
        const newDescription = req.body?.new_description || null;
        const newTitle = req.body?.new_title || null;
        if (fileData.Item) { // found matching file details with this fID
            const currentVer = fileData.Item.version;
            log(currentVer, "CURRENTVERISON");
            const nextVer = currentVer + 1;
            lastComment = fileData.Item.lastComment;
            out = fileData.Item;
            await db.optimisticTransactWrite(fileData.Item.fileID, currentVer, nextVer, fileData.Item, comments, lastComment, newLastComment, newDescription, newTitle);
            res.send(`{next_val :${JSON.stringify({ nextVer, lastComment }, null, 2)}`);
            log("consolidated: " + fID);
        }
        else {
            out = "item not found";
            res.send('consolidate problems right here');
        }
    }
    catch (err) {
        // not good :TODO
        if (err instanceof client_dynamodb_1.TransactionCanceledException) {
            // tslint:disable-next-line:no-console
            console.log("TRANSCANCEL: \n" + JSON.stringify(err.CancellationReasons, null, 2));
            if (err.CancellationReasons[0].Code === "ConditionalCheckFailed") {
                res.send("Return Item did not meet conditions" + JSON.stringify(out, null, 2) + "\n" + err.$response.statusCode);
            } // else if [1]  else for all comments?
        }
        else {
            next(err);
        }
    }
});
// make a comment against a file ID TODO
exports.router.post("/comment", upload.none(), async (req, res, next) => {
    let out;
    log(req.body);
    const commentID = uuid(); // create a comment ID for insert and return this ID later on insert
    // request params
    const fileID = req.body.fileID;
    const comment = req.body.comment;
    log(fileID);
    log(comment);
    // TODO: THIS IS NOT GOOD? - mostly for demoing
    const currentVersion = req.body.currentVersion || (await db.getCurrentFileDetails(fileID)).Item.version;
    const username = `USER_${db.randomnum(5)}`;
    const reason = null;
    try {
        const status = 'pending';
        const Item = {
            fileID,
            commentID,
            currentVersion,
            comment,
            commentor: username,
            status,
            reason
        };
        log(Item);
        const awsres = await (db.createCommentForFile(Item));
        out = Item;
        res.send(JSON.stringify(out, null, 2));
    }
    catch (error) {
        next(error);
    }
});
// get the details of a file
exports.router.get('/file/:fileID/details', async (req, res, next) => {
    const file = undefined;
    // req params
    const fileID = req.params?.fileID;
    try {
        // get the latest comment ID from reading the file
        const details = await db.getCurrentFileDetails(fileID);
        if (details) {
            res.send(details.Item);
        }
        else {
            res.send("can't find this file in /file");
        }
    }
    catch (error) {
        next(error);
    }
});
// get the comments of a file that have not been actioned
exports.router.get('/file/:fileID', async (req, res, next) => {
    const file = undefined;
    // req params
    const fileID = req.params?.fileID;
    try {
        // get the latest comment ID from reading the file
        const details = await db.getCurrentFileDetails(fileID);
        let commentID;
        if (details) {
            commentID = details.Item.lastComment;
        }
        else {
            res.send("can't find this file in /file");
        }
        let comments;
        comments = await db.queryFileComments(fileID, commentID);
        res.send(JSON.stringify(comments, null, 2));
        // return all comments above that
    }
    catch (error) {
        next(error);
    }
});
exports.router.get('/browse', async (req, res, next) => {
    try {
        const files = await db.browseFiles();
        if (files.Items) {
            res.send(files);
        }
        else {
            res.send("no files found");
        }
    }
    catch (error) {
        next(error);
    }
});
// UTIL
function log(param, pre) {
    if (pre) {
        // tslint:disable-next-line:no-console
        console.log(`####\n${pre}\n####`);
        // tslint:disable-next-line:no-console
        console.log(param);
    }
    else {
        // tslint:disable-next-line:no-console
        console.log(param);
    }
}
exports.default = exports.router;
//# sourceMappingURL=dynamo.js.map