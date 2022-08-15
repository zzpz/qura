// core
import dotenv from "dotenv"
import express from "express";

// Multipart forms (multer)
import multer from 'multer'
import multerS3 from 'multer-s3'

// AWS
import { Upload } from "@aws-sdk/lib-storage";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { CompleteMultipartUploadCommand, ListBucketsCommandOutput, PutObjectRequest, S3 } from "@aws-sdk/client-s3";
import { S3Client, PutObjectCommand, S3ClientConfig, PutObjectCommandInput } from "@aws-sdk/client-s3";

import * as db from "../db/dynamo"

// ULID
import { monotonicFactory, ULID } from 'ulid'
const uuid = monotonicFactory();



// routing
const router = express.Router();


// s3 + config
dotenv.config();
const AWS_REGION = 'ap-south-1'; // process.env.AWS_REGION

const s3Configuration: S3ClientConfig =
{
    credentials:{
        accessKeyId: process.env.AWS_ID,
        secretAccessKey: process.env.AWS_SECRET
    },
    region: AWS_REGION
}

const s3 = new S3(s3Configuration);

const s3Client = new S3Client(s3Configuration);





// dynamo + config


// not ideal -> signed url and client side is cleaner
const storage = multer.memoryStorage() // store uploaded files in memory while we operate on them
const upload = multer({storage, limits:{ fileSize:12000000 }})




// path, handler (upload is multer() + using storage engine of memory)
router.post('/file', upload.single('file'), async (req, res, next) => {
      // tslint:disable-next-line:no-console
      // process input for dynamo + S3 here.

      // tslint:disable-next-line:no-console
      log(req.file,"FILE INPUT:")
      const fileKey = uuid()

      const putRequest: PutObjectRequest =   {
            Bucket: process.env.S3_BUCKET,
            Key: fileKey,
            // Body: req.file.buffer, must be a stream
            ContentType: req.file.mimetype,
            ContentDisposition: "inline",
            ContentEncoding: req.file.encoding,
            ContentLength: req.file.size,
            Metadata:{
            myMetaDataField: req.file.originalname
        }
      }

        const putCommandInput:PutObjectCommandInput = {
            ...putRequest,
            Body: req.file.buffer,
        }


      try{
        // insert a record into uploads table --> functionally acts as a queue, I hate it. but it provides consistency
        //
        const uploadRecorded =  await db.createNewFile(fileKey,req.body.description,req.file.originalname)
        log('Created upload entry')

        // NOW ->  go upload it to S3

        // uploadFileToS3()
        const uploaded = await s3Client.send(new PutObjectCommand(putCommandInput));

        // needs work around the metadata --> fairly sure I need to use a specific library

                // const s3Uploaded = new Upload({
                //     client: s3,
                //     params: {
                //         Bucket: process.env.S3_BUCKET,
                //         Key: fileKey,
                //         Body: req.file.buffer,
                //         ContentType: req.file.mimetype,
                //         ContentDisposition: "inline",
                //         ContentEncoding: req.file.encoding,
                //         ContentLength: req.file.size,
                //         Metadata:{
                //             myMetaDataField: req.file.originalname
                //         }
                //     }
                // })

                // const uploadedFile = await s3Uploaded.done() // uploaded it or errored?

        log("uploaded to s3")
        // NOW --> it exists in the s3bucket AND it exists IN the uploads table--> make a new detail using DB.makeDetail(fileID) and the TTL on the uploads table will remove it
        // if it failed to upload we will not have a record inserted into primary table (drain queue but only 1 item is drained)

        // get item
        // put item with those details if not exists

        const out = await db.drainUploadsTableSingleFile(fileKey)
        log("copied from uploads into details")

        res.send(fileKey)



      } catch (error) {
            // tslint:disable-next-line:no-console
            log(error);
            next(error);
      }


      // step 1: upload the file to an S3 URL

      // step 2: insert the URL + comments into dynamo

      // step 3: return 200 + Dynamo details if all succeed

          // how to handle if S3 works but dynamo doesn't?

  })



router.get('/tst', async(req,res,next)=>{
    let out;
    s3.listBuckets((err:Error,data:ListBucketsCommandOutput)=>{
        if (err){
            res.send("ERROR");
        }else{
            out = data.Buckets.length;
        }
    })
    res.send("ok" + out)
})



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


//overrides the linting for now
function log(param:any,pre?:string){
    if(pre){
            // tslint:disable-next-line:no-console
        console.log(`####\n${pre}\n####`)
    // tslint:disable-next-line:no-console
        console.log(param)
    }else{
    // tslint:disable-next-line:no-console
        console.log(param);
    }
}
export default router;
