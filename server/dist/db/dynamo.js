"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateFileURL = exports.browseFiles = exports.queryFileComments = exports.drainUploadsTableSingleFile = exports.randomnum = exports.createCommentForFile = exports.createNewFile = exports.optimisticTransactWrite = exports.getCurrentFileDetails = exports.ddbDocClient = exports.uuid = void 0;
// core
const dotenv_1 = __importDefault(require("dotenv"));
// Dynamo
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
// ULID  + UTIL FUNCTION
const ulid_1 = require("ulid");
exports.uuid = (0, ulid_1.monotonicFactory)();
// config
dotenv_1.default.config();
const clientConfig = {
    credentials: {
        accessKeyId: process.env.AWS_ID,
        secretAccessKey: process.env.AWS_SECRET
    },
    region: process.env.AWS_REGION,
    tls: true,
};
// marshalling config for ddbDocClient
const marshallOptions = {
    // Whether to automatically convert empty strings, blobs, and sets to `null`.
    convertEmptyValues: false,
    // Whether to remove undefined values while marshalling.
    removeUndefinedValues: false,
    // Whether to convert typeof object to map attribute.
    convertClassInstanceToMap: false, // false, by default.
};
const unmarshallOptions = {
    // Whether to return numbers as a string instead of converting them to native JavaScript numbers.
    wrapNumbers: false, // false, by default.
};
const translateConfig = { marshallOptions, unmarshallOptions };
const client = new client_dynamodb_1.DynamoDBClient(clientConfig);
exports.ddbDocClient = lib_dynamodb_1.DynamoDBDocument.from(client, translateConfig); // TODO: remove export
async function getCurrentFileDetails(fileID, sortKey = "details") {
    const tableName = process.env.SINGLE_TABLE;
    return exports.ddbDocClient.get({
        TableName: tableName,
        Key: { fileID, sortKey },
        // ProjectionExpression: //get all
        ConsistentRead: true
    });
}
exports.getCurrentFileDetails = getCurrentFileDetails;
// take a single file (returned from dynamo)
// use the as read version and attempt to increment
// if it has been altered between these two transactions then it will fail with TransactionCanceledException[0] == ConditionalCheckFailed and no entries will be updated
async function optimisticTransactWrite(fileID, currentVersion, nextVersion, fileData, comments, latestComment, newlastcomm, newDescription) {
    // try{} catch(err) {}
    const description = newDescription || `${currentVersion} -> ${nextVersion}: this was updated`;
    const tableName = process.env.SINGLE_TABLE;
    const sk = `HISTORY_v${currentVersion}`;
    const latest = latestComment;
    const newlastComment = newlastcomm || '01GA2XF0M95M1VT5GA8BAFAKTW'; // max(commentID) in comments[]
    const item = { ...fileData };
    let oldDesc = fileData?.description;
    if (!oldDesc) {
        oldDesc = 'no previous description';
    }
    // tslint:disable-next-line:no-console
    console.log("consolidating item: \n" + JSON.stringify(item));
    // up to 25 items per transaction
    //
    const args = {
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
                    ExpressionAttributeValues: {
                        ":incr": 1,
                        ":currentVersion": item.version,
                        ":newlastComment": newlastComment,
                        ":description": description
                    },
                }
            },
            {
                Put: {
                    TableName: tableName,
                    ConditionExpression: "attribute_not_exists(sortKey)",
                    // ExpressionAttributeNames: {
                    //     ":fid":"fileID"
                    // },
                    Item: {
                        fileID,
                        "sortKey": sk,
                        // "description": oldDesc,
                        version: item.version + 1,
                        description: oldDesc,
                        lastComment: item.lastComment
                        // previousVer:currentVersion
                    }
                }
            },
            //                {...Updatecomments}
            // TODO: update the oldLATESTCOMMENT? --> update ALL OF THEM here and limit to only 20 comments at a time updated?
        ]
    };
    return exports.ddbDocClient.transactWrite(args);
}
exports.optimisticTransactWrite = optimisticTransactWrite;
async function createNewFile(fileKey, desc, originalname) {
    const TableName = process.env.UPLOAD_TABLE;
    const fileID = fileKey;
    const version = 0;
    const created = new Date();
    const expiry = new Date();
    expiry.setTime(created.getTime() + 60 * 5 * 1000); // add 5 mins
    const expires = expiry.getTime() + '';
    const createdAt = created.toISOString();
    const fileURL = fileKey;
    // const fileURL = fileID+".jpg" //fileID as key? 'filename1234.jpg'
    const title = originalname || 'Title';
    const description = originalname + ":" + desc || "";
    const putCommand = {
        TableName,
        Item: {
            fileID,
            sortKey: "details",
            version,
            fileURL,
            title,
            description,
            lastComment: "-",
            createdAt,
            expires // we will use this as a TTL
        }
    };
    return exports.ddbDocClient.put(putCommand);
}
exports.createNewFile = createNewFile;
async function createCommentForFile(item, userName, fileData) {
    // allow a user to create a comment against a provided file
    // fileID:string,currentVersion:number,comment:string
    // assumptions:
    // fileID is provided
    // fileVer is provided
    // username is provided/calculated
    // when we create it the fileID EXISTS --> non-existing files will be inserted currently
    // fID :  {VERSION}{TYPE(comment/value)}{commentID}
    const tableName = process.env.COMMENTS_TABLE;
    // insert (fileID|commentID|comment|version|status='pending'|createdAt|updatedAt)
    // testing inputs
    const Item = item;
    // end testing inputs
    const ConditionExpression = "attribute_not_exists(commentID)";
    const args = {
        TableName: tableName,
        ConditionExpression: "attribute_not_exists(fileID)",
        Item
    };
    // tslint:disable-next-line:no-console
    console.log("args: " + JSON.stringify(args, null, 2));
    return exports.ddbDocClient.put(args); // cannot return the item
}
exports.createCommentForFile = createCommentForFile;
// for generating random user ID's during testing
function randomnum(max) {
    return Math.floor(Math.random() * max);
}
exports.randomnum = randomnum;
async function drainUploadsTableSingleFile(fileID) {
    const uploadTableName = process.env.UPLOAD_TABLE;
    const detailTableName = process.env.SINGLE_TABLE;
    const hashKey = "fileID";
    try {
        // write a new file if uploadTable has an existing entry exists for this ID, then delete the previous id
        // else cancel the transaction
        const args = {
            TableName: uploadTableName,
            KeyConditionExpression: "#hashKey = :fileID",
            ExpressionAttributeValues: {
                ":fileID": fileID
            },
            ExpressionAttributeNames: { "#hashKey": "fileID" }
        };
        const queryOutput = await exports.ddbDocClient.query(args);
        // this seems wrong
        if (queryOutput.Count !== 1) {
            throw new Error("query failed in drain upload single");
        }
        else {
            // fileID, dateADDED(TTL), description, fileURL, sortKey, version
            const { expires, ...Item } = queryOutput.Items[0];
            const putArgs = {
                TableName: detailTableName,
                ConditionExpression: "attribute_not_exists(#hashKey)",
                ExpressionAttributeNames: {
                    "#hashKey": hashKey
                },
                // ExpressionAttributeValues: {
                //     ":fileID" : fileID
                // },
                Item // the item
            };
            return exports.ddbDocClient.put(putArgs);
        }
    }
    catch (err) {
        // throw?
        // return a promise that won't resolve?
        // tslint:disable-next-line:no-console
        console.log(err);
        throw new Error("throwing error here"); // this does nothing
    }
}
exports.drainUploadsTableSingleFile = drainUploadsTableSingleFile;
async function queryFileComments(fileID, commentID) {
    const tableName = process.env.COMMENTS_TABLE;
    const args = {
        TableName: tableName,
        // indexName <--- NEED AN INDEX or this gets big
        // Limit: 20,
        ConsistentRead: true,
        KeyConditionExpression: "fileID = :fileID AND commentID >:commentID",
        ExpressionAttributeValues: {
            ":fileID": fileID,
            ":commentID": commentID,
            ":status": "pending"
        },
        FilterExpression: "#s = :status",
        ExpressionAttributeNames: {
            "#s": "status"
        }
    };
    return exports.ddbDocClient.query(args);
}
exports.queryFileComments = queryFileComments;
async function browseFiles() {
    const IndexName = 'sortKey-fileID-index';
    const tableName = process.env.SINGLE_TABLE;
    const args = {
        TableName: tableName,
        IndexName,
        KeyConditionExpression: "sortKey = :details",
        ExpressionAttributeValues: {
            ":details": "details"
        }
    };
    return exports.ddbDocClient.query(args);
}
exports.browseFiles = browseFiles;
// util
async function generateFileURL(fileKey) {
    /// take a given file and give me the relevant S3/cloudfront file path
}
exports.generateFileURL = generateFileURL;
//# sourceMappingURL=dynamo.js.map