// core
import dotenv from "dotenv"

// Dynamo
import {DynamoDBClientConfig, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {DynamoDBDocument, TransactWriteCommandInput, PutCommandInput, QueryCommandInput} from '@aws-sdk/lib-dynamodb'

// ULID  + UTIL FUNCTION
import { monotonicFactory} from 'ulid'
export const uuid = monotonicFactory();

// config
dotenv.config();
const clientConfig : DynamoDBClientConfig = {
    credentials:{
        accessKeyId: process.env.AWS_ID,
        secretAccessKey: process.env.AWS_SECRET
    },
    region: process.env.AWS_REGION,
    tls: true,
}

// marshalling config for ddbDocClient
const marshallOptions = {
    // Whether to automatically convert empty strings, blobs, and sets to `null`.
    convertEmptyValues: false, // false, by default.
    // Whether to remove undefined values while marshalling.
    removeUndefinedValues: false, // false, by default.
    // Whether to convert typeof object to map attribute.
    convertClassInstanceToMap: false, // false, by default.
  };

  const unmarshallOptions = {
    // Whether to return numbers as a string instead of converting them to native JavaScript numbers.
    wrapNumbers: false, // false, by default.
  };

const translateConfig = { marshallOptions, unmarshallOptions };
const client:DynamoDBClient = new DynamoDBClient(clientConfig);
export const ddbDocClient: DynamoDBDocument =  DynamoDBDocument.from(client, translateConfig); // TODO: remove export


export async function getCurrentFileDetails(fileID:string,sortKey:string="details"){
    const tableName = process.env.SINGLE_TABLE

    return ddbDocClient.get({
        TableName: tableName,
        Key:{fileID,sortKey},
        // ProjectionExpression: //get all
        ConsistentRead: true
    })
}


// take a single file (returned from dynamo)
// use the as read version and attempt to increment
// if it has been altered between these two transactions then it will fail with TransactionCanceledException[0] == ConditionalCheckFailed and no entries will be updated
export async function optimisticTransactWrite(fileID:string,currentVersion:number,nextVersion:number,fileData?:Record<string,any>,comments?:Record<string,any>[],latestComment?:string,newlastcomm?:string,newDescription?:string) {


    // try{} catch(err) {}

    const description = newDescription || `${currentVersion} -> ${nextVersion}: this was updated`
    const tableName = process.env.SINGLE_TABLE
    const sk = `HISTORY_v${currentVersion}`


    const latest = latestComment;

    const newlastComment = newlastcomm || '01GA2XF0M95M1VT5GA8BAFAKTW' // max(commentID) in comments[]

    const item = {...fileData}

    let oldDesc = fileData?.description
    if(!oldDesc){oldDesc = 'no previous description'}

    // tslint:disable-next-line:no-console
    console.log("consolidating item: \n" + JSON.stringify(item))


    // up to 25 items per transaction
    //

    const args:TransactWriteCommandInput = {
            TransactItems: [
                {
                    Update: {
                        TableName: tableName,
                        Key: {
                            fileID,
                            sortKey: "details"
                        },
                        ConditionExpression: "version = :currentVersion AND lastComment < :newlastComment",
                        UpdateExpression: "ADD version :incr SET description = :description, lastComment= :newlastComment",
                        // ExpressionAttributeNames:{
                        //     "#c" :"comment"
                        // },
                        ExpressionAttributeValues:{
                            ":incr" : 1,
                            ":currentVersion": item.version,
                            ":newlastComment" : newlastComment,
                            ":description" : description
                        },
                    }
                },
                {
                    Put: {
                        TableName: tableName,
                        ConditionExpression : "attribute_not_exists(sortKey)", // == there DNE a {fileID,sortKey} composite key matching this item
                        // ExpressionAttributeNames: {
                        //     ":fid":"fileID"
                        // },
                        Item: {
                             fileID, // hash
                            "sortKey" : sk,
                            // "description": oldDesc,
                            version: item.version+1, // range
                            description: oldDesc,
                            lastComment: item.lastComment
                            // previousVer:currentVersion
                        }
                    }
                },
                //                {...Updatecomments}
                // TODO: update the oldLATESTCOMMENT? --> update ALL OF THEM here and limit to only 20 comments at a time updated?
            ]
        }
        return ddbDocClient.transactWrite(args)
}


export async function createNewFile(fileKey:string,desc:string,originalname:string){
    const TableName = process.env.UPLOAD_TABLE
    const fileID = fileKey
    const version = 0


    const created = new Date();
    const expiry = new Date();
    expiry.setTime(created.getTime() + 60*5*1000 ) // add 5 mins

    const expires:string = expiry.getTime()+'';
    const createdAt:string = created.toISOString();


    const fileURL = fileKey
    // const fileURL = fileID+".jpg" //fileID as key? 'filename1234.jpg'
    const title = originalname || 'Title'
    const description = originalname + ":" + desc || ""

    const putCommand:PutCommandInput = {
        TableName,
        Item: {
            fileID,
            sortKey : "details",
            version,
            fileURL,
            title,
            description,
            lastComment: "-",
            createdAt,
            expires // we will use this as a TTL
        }
    }


    return ddbDocClient.put(putCommand)
}


export async function createCommentForFile(item:Record<string,any>,userName?:string,fileData?:Record<string,any>,) {
    // allow a user to create a comment against a provided file

    // fileID:string,currentVersion:number,comment:string


    // assumptions:
    // fileID is provided
    // fileVer is provided
    // username is provided/calculated
    // when we create it the fileID EXISTS --> non-existing files will be inserted currently
    // fID :  {VERSION}{TYPE(comment/value)}{commentID}
    const tableName = process.env.COMMENTS_TABLE

    // insert (fileID|commentID|comment|version|status='pending'|createdAt|updatedAt)

    // testing inputs
    const Item = item


    // end testing inputs

    const  ConditionExpression:string = "attribute_not_exists(commentID)"

    const args:PutCommandInput = {
        TableName : tableName,
        ConditionExpression: "attribute_not_exists(fileID)", // == there DNE a {fileID,sortKey} composite key matching this item
        Item
    }

    // tslint:disable-next-line:no-console
    console.log("args: " + JSON.stringify(args,null,2))

    return ddbDocClient.put(args) // cannot return the item

}


// for generating random user ID's during testing
export function randomnum(max:number) {
    return Math.floor(Math.random() * max);
}


export async function drainUploadsTableSingleFile(fileID:string) {
    const uploadTableName = process.env.UPLOAD_TABLE
    const detailTableName = process.env.SINGLE_TABLE
    const hashKey = "fileID"

    try{

        // write a new file if uploadTable has an existing entry exists for this ID, then delete the previous id
        // else cancel the transaction

    const args:QueryCommandInput = {
        TableName:uploadTableName,
        KeyConditionExpression: "#hashKey = :fileID",
        ExpressionAttributeValues: {
            ":fileID" : fileID
        },
        ExpressionAttributeNames: {"#hashKey" : "fileID"}
    }

    const queryOutput = await ddbDocClient.query(args)


    // this seems wrong
    if(queryOutput.Count !== 1){
        throw new Error("query failed in drain upload single")

    } else{

        // fileID, dateADDED(TTL), description, fileURL, sortKey, version
        const {expires,...Item} = queryOutput.Items[0]

    const putArgs: PutCommandInput = {
        TableName:detailTableName,
        ConditionExpression: "attribute_not_exists(#hashKey)", // FileID item does not exist with 'details' sortkey
        ExpressionAttributeNames: {
            "#hashKey" : hashKey
        },
        // ExpressionAttributeValues: {
        //     ":fileID" : fileID
        // },
        Item // the item
    }

    return ddbDocClient.put(putArgs)
    }

    }catch(err){
        // throw?
        // return a promise that won't resolve?
        // tslint:disable-next-line:no-console
        console.log(err);
        throw new Error("throwing error here") // this does nothing

    }


}

export async function queryFileComments(fileID:string,commentID:string){
    const tableName = process.env.COMMENTS_TABLE


    const args:QueryCommandInput = {
        TableName:tableName,
        // indexName <--- NEED AN INDEX or this gets big
        // Limit: 20,
        ConsistentRead:true,
        KeyConditionExpression: "fileID = :fileID AND commentID >:commentID", // status as a key probably the solution here
        ExpressionAttributeValues : {
            ":fileID" : fileID,
            ":commentID": commentID,
            ":status" : "pending"
        },
        FilterExpression: "#s = :status",
        ExpressionAttributeNames: {
            "#s": "status"
        }

    }

    return ddbDocClient.query(args)
}


export async function browseFiles(){

    const IndexName = 'sortKey-fileID-index'

    const tableName = process.env.SINGLE_TABLE
    const args:QueryCommandInput={
        TableName:tableName,
        IndexName,
        KeyConditionExpression: "sortKey = :details",
        ExpressionAttributeValues: {
            ":details": "details"
        }
    }

    return ddbDocClient.query(args)
}

// util
export async function generateFileURL(fileKey:string){ // just return a signedURL?

    /// take a given file and give me the relevant S3/cloudfront file path

}
