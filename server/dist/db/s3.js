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
// Multipart forms (multer)
const multer_1 = __importDefault(require("multer"));
// AWS
const lib_storage_1 = require("@aws-sdk/lib-storage");
const client_s3_1 = require("@aws-sdk/client-s3");
const db = __importStar(require("./dynamo"));
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
// dynamo + config
// not ideal -> signed url and client side is cleaner
const storage = multer_1.default.memoryStorage(); // store uploaded files in memory while we operate on them
const upload = (0, multer_1.default)({ storage, limits: { fileSize: 12000000 } });
// path, handler (upload is multer() + using storage engine of memory)
router.post('/file', upload.single('file'), async (req, res, next) => {
    // tslint:disable-next-line:no-console
    // process input for dynamo + S3 here.
    const fileKey = uuid();
    try {
        // insert a record into uploads table --> functionally acts as a queue, I hate it. but it provides consistency
        //
        const uploadRecorded = await db.createNewFile(fileKey, req.body.description, req.file.originalname);
        // NOW ->  go upload it to S3
        const s3Uploaded = new lib_storage_1.Upload({
            client: s3,
            params: {
                Bucket: process.env.S3_BUCKET,
                Key: req.file.originalname,
                Body: req.file.buffer
            }
        });
        const uploadedFile = await s3Uploaded.done(); // uploaded it
        // NOW --> it exists in the s3bucket AND it exists IN the uploads table--> make a new detail using DB.makeDetail(fileID) and the TTL on the uploads table will remove it
        // if it failed to upload we will not have a record inserted into primary table (drain queue but only 1 item is drained)
        // get item
        // put item with those details if not exists
        const out = await db.drainUploadsTableSingleFile(fileKey);
        res.send(out);
    }
    catch (error) {
        // tslint:disable-next-line:no-console
        console.log(error);
    }
    // step 1: upload the file to an S3 URL
    // step 2: insert the URL + comments into dynamo
    // step 3: return 200 + Dynamo details if all succeed
    // how to handle if S3 works but dynamo doesn't?
});
router.get('/tst', async (req, res, next) => {
    let out;
    s3.listBuckets((err, data) => {
        if (err) {
            res.send("ERROR");
        }
        else {
            out = data.Buckets.length;
        }
    });
    res.send("ok" + out);
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
exports.default = router;
//# sourceMappingURL=s3.js.map