// // core
// import dotenv from "dotenv"
// import express from "express";

// // Multipart forms (multer)
// import multer from 'multer'
// import multerS3 from 'multer-s3'

// // AWS
// import { Upload } from "@aws-sdk/lib-storage";
// import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
// import { CompleteMultipartUploadCommand, ListBucketsCommandOutput, S3 } from "@aws-sdk/client-s3";
// import { S3Client, PutObjectCommand, S3ClientConfig, PutObjectCommandInput } from "@aws-sdk/client-s3";


// // Dynamo
// import { DynamoDB } from "@aws-sdk/client-dynamodb"; // ES6 import

// // ULID
// import { monotonicFactory, ULID } from 'ulid'
// const uuid = monotonicFactory();



// // routing
// const router = express.Router();


// // s3 + config
// dotenv.config();
// const AWS_REGION = 'ap-south-1'; // process.env.AWS_REGION

// const s3Configuration: S3ClientConfig =
// {
//     credentials:{
//         accessKeyId: process.env.AWS_ID,
//         secretAccessKey: process.env.AWS_SECRET
//     },
//     region: AWS_REGION
// }

// const s3 = new S3(s3Configuration);




// // dynamo + config

// const dynamoConfig = {}
// const ddbClient = new DynamoDB(dynamoConfig);
// // const ddbDocClient = DynamoDBDocument.from(ddbClient)





// // not ideal -> signed url and client side is cleaner
// const storage = multer.memoryStorage() // store uploaded files in memory while we operate on them
// const upload = multer({storage, limits:{ fileSize:12000000 }})




// // path, handler (upload is multer() + using storage engine)
// router.post('/file', upload.single('file'), async (req, res, next) => {
//       // tslint:disable-next-line:no-console
//       // process input for dynamo + S3 here.

//       try{
//         const awsUpload = new Upload({
//             client: s3,
//             params: {
//                 Bucket: process.env.S3_BUCKET,
//                 Key: req.file.originalname, // original filename
//                 Body: req.file.buffer // file contents as an in memory buffer
//             }
//         })   ;

//         await awsUpload.done()
//       } catch (error) {
//             // tslint:disable-next-line:no-console
//             console.log(error);
//       }


//       // step 1: upload the file to an S3 URL

//       // step 2: insert the URL + comments into dynamo

//       // step 3: return 200 + Dynamo details if all succeed

//           // how to handle if S3 works but dynamo doesn't?

//   })



// router.get('/tst', async(req,res,next)=>{
//     let out;
//     s3.listBuckets((err:Error,data:ListBucketsCommandOutput)=>{
//         if (err){
//             res.send("ERROR");
//         }else{
//             out = data.Buckets.length;
//         }
//     })
//     res.send("ok" + out)
// })





// router.get('/dynamo', async(req,res,next)=>
// {
//     const fID:string = uuid();
//     res.send(fID)
//     // ok, now do this:
//         // try to insert into 'uploads' THIS uuid
//         // if fail, fail.
// })












// // PRE SIGNED S3 URLS
// // router.get('/presign', async (req,res)=>{


// //     const input : PutObjectCommandInput = {
// //         Bucket: process.env.S3_BUCKET,
// //         Key: 'key2.jpeg',
// //         ContentType: 'image/jpeg'
// //     }

// //     const command = new PutObjectCommand(input);
// //     const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

// //     res.send(url)

// // })


// // export this router to use in our index.js

// export default router;
