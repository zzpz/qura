// // core
// import dotenv from "dotenv"
// import express from "express";
// import * as dynamoose from "dynamoose";
// const mooseConfig = {
//     accessKeyId: process.env.AWS_ID,
//     secretAccessKey: process.env.AWS_SECRET,
//     region: process.env.AWS_REGION,
//     tls: true,
// }
// // Create new DynamoDB instance
// const ddb = new dynamoose.aws.sdk.DynamoDB(mooseConfig);
// // Set DynamoDB instance to the Dynamoose DDB instance
// dynamoose.aws.ddb.set(ddb);
// // If you are running Dynamoose in an environment that has an IAM role attached to it (ex. Lambda or EC2), you do not need to do any additional configuration so long as your IAM role has appropriate permissions to access DynamoDB.
// // schema
// const detailSchema = new dynamoose.Schema({
//     "fileID": {"type" : String,
// hashKey: true},
//     "sortKey" : {type :String,
//     "rangeKey": true},
//     "description" : String,
//     "fileURL" : String,
//     "version": {
//         type: Number,
//         default: () => 0,
//         validate: () => true // always valid
//     }
//     },
//     {
//         saveUnknown: true,
//         timestamps:true
//     }
//     )
// const historySchema = new dynamoose.Schema({
//     "fileID": {"type" : String,
// hashKey: true},
//     "sortKey" : {type :String,
//     "rangeKey": true},
//     "description" : String,
//     "fileUrl" : String,
//     // other
//     "version": {
//         type: Number,
//         default: () => 0,
//         validate: () => true // always valid
//     }
// },
// {saveUnknown :true,
// timestamps:true
// }
// )
// // Model
// const Detail = dynamoose.model("project1_singleTable",detailSchema)
// // INSTANCE
// const myDetails = new Detail({
//     fileId: 'tst',
//     sortKey: 'sort',
//     details: 'this is the details',
//     url: 'this is the url'
// })
// // CONDITIONS
// const detailBeginsWith = new dynamoose.Condition("fileID").beginsWith('01G9SF3TK');
// // tslint:disable-next-line:no-console
// console.log(myDetails.fileID); // 1
// export default myDetails
//# sourceMappingURL=dyna2.js.map