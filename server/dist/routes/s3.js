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
// core
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
// Multipart forms (multer) --> config
const multer_1 = __importDefault(require("multer"));
const client_s3_1 = require("@aws-sdk/client-s3");
const client_s3_2 = require("@aws-sdk/client-s3");
const db = __importStar(require("../db/dynamo"));
// ULID
const ulid_1 = require("ulid");
const uuid = (0, ulid_1.monotonicFactory)();
// routing
const router = express_1.default.Router();
// s3 + config
dotenv_1.default.config();
const AWS_REGION = 'ap-south-1'; // process.env.AWS_REGION
const s3Configuration = {
    credentials: {
        accessKeyId: process.env.AWS_ID,
        secretAccessKey: process.env.AWS_SECRET
    },
    region: AWS_REGION
};
const s3 = new client_s3_1.S3(s3Configuration);
const s3Client = new client_s3_2.S3Client(s3Configuration);
// dynamo + config
// not ideal -> signed url and client side is cleaner
const storage = multer_1.default.memoryStorage(); // store uploaded files in memory while we operate on them
const upload = (0, multer_1.default)({ storage, limits: { fileSize: 12000000 } });
// path, handler (upload is multer() + using storage engine of memory)
router.post('/file', upload.single('file'), async (req, res, next) => {
    // process input for dynamo + S3 here.
    // tslint:disable-next-line:no-console
    log(req.file, "FILE INPUT:");
    const fileKey = uuid();
    const title = req.body.title || null;
    const putRequest = {
        Bucket: process.env.S3_BUCKET,
        Key: fileKey,
        // Body: req.file.buffer, must be a stream
        ContentType: req.file.mimetype,
        ContentDisposition: "inline",
        ContentEncoding: req.file.encoding,
        ContentLength: req.file.size,
        Metadata: {
            myMetaDataField: req.file.originalname
        }
    };
    const putCommandInput = {
        ...putRequest,
        Body: req.file.buffer,
    };
    try {
        // insert a record into uploads table --> functionally acts as a queue, I hate it. but it provides consistency
        //
        const uploadRecorded = await db.createNewFile(fileKey, req.body.description, req.file.originalname, title);
        log('Created upload entry');
        // NOW ->  go upload it to S3
        // uploadFileToS3()
        const uploaded = await s3Client.send(new client_s3_2.PutObjectCommand(putCommandInput));
        // needs work around the metadata
        // const uploadedFile = await s3Uploaded.done() // uploaded it or errored?
        log("uploaded to s3");
        // NOW --> it exists in the s3bucket AND it exists IN the uploads table--> make a new detail using DB.makeDetail(fileID) and the TTL on the uploads table will remove it
        // if it failed to upload we will not have a record inserted into primary table (drain queue but only 1 item is drained)
        // get item
        // put item with those details if not exists
        const out = await db.drainUploadsTableSingleFile(fileKey);
        log("copied from uploads into details");
        res.send(fileKey);
    }
    catch (error) {
        // tslint:disable-next-line:no-console
        log(error);
        next(error);
    }
    // step 1: upload the file to an S3 URL
    // step 2: insert the URL + comments into dynamo
    // step 3: return 200 + Dynamo details if all succeed
    // how to handle if S3 works but dynamo doesn't?
});
// PRE SIGNED S3 URLS
// router.get('/presign', async (req,res)=>{
//     const input : PutObjectCommandInput = {
//         Bucket: process.env.S3_BUCKET,
//         Key: 'key2.jpeg',
//         ContentType: 'image/jpeg'
//     }
//     const command = new PutObjectCommand(input);
//     const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
//     res.send(url)
// })
// export this router to use in our index.js
// overrides the linting for now
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
exports.default = router;
//# sourceMappingURL=s3.js.map