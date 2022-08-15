// // util
// import * as util from "./util"

// // dynamoose
// import * as dynamoose from "dynamoose";
// import { Schema } from "dynamoose/dist/Schema";
// import {Document} from "dynamoose/dist/Document";
// import Transaction from "dynamoose/dist/Transaction";


// const mooseConfig = {
//     accessKeyId: process.env.AWS_ID,
//     secretAccessKey: process.env.AWS_SECRET,
//     region: process.env.AWS_REGION='ap-south-1',
//     tls: true,
// }

// // Create new DynamoDB instance
// // Set DynamoDB instance to the Dynamoose DDB instance
// const ddb = new dynamoose.aws.sdk.DynamoDB(mooseConfig);
// dynamoose.aws.ddb.set(ddb);
// // If you are running Dynamoose in an environment that has an IAM role attached to it (ex. Lambda or EC2), you do not need to do any additional configuration so long as your IAM role has appropriate permissions to access DynamoDB.




// // schame for the table (detail

// const detailSchema: Schema = new dynamoose.Schema({
//     "fileID": {
//         type : String,
//         hashKey: true
//     },
//     "sortKey" : {
//         type :String,
//         rangeKey: true
//     },
//     "description" : String,
//     "fileURL" : String,
//     "version": {
//         type: Number,
//         default: () => 0,
//         validate: () => true // always valid
//     },
//     "lastActionedComment": String // empty on creation
//     },
//     {
//         saveUnknown: true,
//         timestamps:true
//     }
//     )


// // const historySchema: Schema = new dynamoose.Schema({
// //     "fileID": {"type" : String,
// // hashKey: true},
// //     "sortKey" : {type :String,
// //     "rangeKey": true},
// //     "description" : String,
// //     "fileUrl" : String,
// //     // other
// //     "version": {
// //         type: Number,
// //         default: () => 0,
// //         validate: () => true // always valid
// //     }
// // },
// // {saveUnknown :true,
// // timestamps:true
// // }
// // )

// const commentSchema: Schema = new dynamoose.Schema({
//     "fileID": {
//         "type" : String,
//         hashKey: true
//     },
//     "sortKey" : {
//         type :String,  // COMMENT_v0_commentID
//         rangeKey: true
//     },
//     "comment" : String,
//     "status" : String,
//     "appliedToVersion" : {
//         type:Number,
//         default : () =>0,
//         validate: ()=> true}
//     },
//     {
//         saveUnknown: true,
//         timestamps:true
//     })



// // Strongly typed models can be passed to a model for type checking

// export class Detail extends Document {
//     fileID: string
//     sortKey: string
//     description: string
//     fileURL: string
//     version: number
//     lastActionedComment : string
// }

// export class Comment extends Document {
//     fileID: string
//     sortKey: string
//     comment: string
//     status: string
//     appliedToVersion: number
// }

// export class History extends Detail {

// }


// // Model
// // The Model object represents a table in DynamoDB (we use a single table design)
// export const DetailModel = dynamoose.model<Detail>("project1_singleTable",detailSchema)
// export const CommentModel = dynamoose.model<Comment>("project1_singleTable",commentSchema)




// // TRANSACTIONS FOR UPDATING THE DETAILS


// export async function getDetail(fileID:string) {
//     // get the current version of the file with ID fileID
//     return DetailModel.get({fileID,sortKey:"details",
// },{return:"document",consistent:true })
// }



// // Create Transaction with condition attached
// function makeCommentUpdateTrans(comment:Comment,currentVer:number){
//     const commentVersLTEDetailVer = new dynamoose.Condition("sortKey").beginsWith(`COMMENT_v${currentVer}`)
//     return CommentModel.transaction.update(comment,{status:comment.status,appliedToVersion:comment.appliedToVersion},{return:"document",condition:commentVersLTEDetailVer}) // key, update with, conditions
// }


// export async function createConsolidateTrans(newfileDetail:Detail, comments:Comment[]) {

//     const detailVersionMatches = new dynamoose.Condition().where("version").eq(1)

//     // create a history transaction here
//     // HISTORY->
//     // HistoryModel.transaction.create({fileID:"1234",sortKey:`HISTORY_v${newfileDetail.version}`}, newfileDetail)

//     const currentVer = 1;

//     const transactions: any[] = []
//     comments.forEach(comment => {
//         const commentVersLTEDetailVer = new dynamoose.Condition("sortKey").beginsWith(`COMMENT_v${currentVer}`)
//         const comTrans = makeCommentUpdateTrans(comment,newfileDetail.version);
//         transactions.push(comTrans)
//     })


//     return dynamoose.transaction(
//         [

//         DetailModel.transaction.condition({fileID:"1234",sortKey:"details"}, detailVersionMatches),
//         DetailModel.transaction.update({fileID:"1234",sortKey:"details"},{version:1,description:"hardcoded"}, {return:"request"}), // <-- condition here?
//                 // ...transactions,
//         ]
//     )
// }


// // CREATE HISTORY using:-->
// // ConditionExpression : "attribute_not_exists(fID)", // == there DNE a file ID with this version
// //                         // ExpressionAttributeValues: {
// //                         //     ":nextVersion" : nextVersion
// //                         // },
// //                         Item: {
// //                             "fID" :fileID, // hash
// //                             "version": nextVersion, // range
// //                             "comments" : comment,
// //                             "previousVer":currentVersion
// //                         }