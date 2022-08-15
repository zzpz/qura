// core
import dotenv from "dotenv"
import express from "express";


export const router = express.Router();

// config

dotenv.config();


// database access
import * as db from "../db/dynamo";
const dbclient = db.ddbDocClient // todo: remove




// Dynamo
import {GetCommandOutput} from '@aws-sdk/lib-dynamodb'

// ULID
import { monotonicFactory} from 'ulid'
import { TransactionCanceledException } from "@aws-sdk/client-dynamodb";
const uuid = monotonicFactory();



// upload (put) a new file that we haven't seen before
// this should not work e.g. it is not available as an endpoint.
router.post('/createFile', async (req,res,next) =>{

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
})


// take a provided file + comments and consolidate them into a new(latest) details of that file
// TODO: (up to 20?)
router.get('/consolidate', async(req,res,next) =>{

    let out;

    try{
    const fID :string = "1234";
    const fileData: GetCommandOutput = await db.getCurrentFileDetails(fID)
    let lastComment:string;
    const comments: Record<string,any>[] = []

    if(fileData.Item){ // found matching file details with this fID
        const currentVer: number = fileData.Item.version
        const nextVer: number = currentVer + 1
        lastComment = fileData.Item.lastComment
        out = fileData.Item
        await db.optimisticTransactWrite(fileData.Item.fileID,currentVer,nextVer,fileData.Item,comments,lastComment);
        res.send(`{next_val :${JSON.stringify({nextVer,lastComment},null,2)}`);
    }else{
        out = "item not found"
        res.send('consolidate problems right here')
    }

    }catch (err){

        // not good :TODO
        if(err instanceof TransactionCanceledException){
            // tslint:disable-next-line:no-console
            console.log("TRANSCANCEL: \n" + JSON.stringify(err.CancellationReasons,null,2))
            if (err.CancellationReasons[0].Code === "ConditionalCheckFailed"){
                res.send("Return Item did not meet conditions" + JSON.stringify(out,null,2) + "\n" +                 err.$response.statusCode
                )
            } // else if [1]  else for all comments?
        }else{
            next(err)
        }
    }
})


// make a comment against a file ID TODO
router.get("/comment", async(req,res,next)=>{
    let out;

    const commentID = uuid() // create a comment ID for insert and return this ID later on insert

    // request params
    const fileID = '1234'
    const comment = `comment: ${uuid()}`
    const currentVersion = 2
    const username = `USER_${db.randomnum(5)}`;
    const reason:null = null;

    try {
        const status:string = 'pending'

        const Item = {
            fileID,
            commentID,
            currentVersion,
            comment,
            commentor: username,
            status,
            reason
        }

        const awsres = await (db.createCommentForFile(Item))
        out=Item
        res.send(JSON.stringify(out,null,2))



    } catch (error) {
        next(error)
    }
})


// get the details of a file
router.get('/file', async(req,res,next) =>{

    const file:undefined = undefined

    // req params
    const fileID = file||'1234'

    try{
        // get the latest comment ID from reading the file
        const details = await db.getCurrentFileDetails(fileID);
        let commentID:string
        if(details){
            commentID = details.Item.lastComment
        }else{
            res.send("can't find this file in /file")
        }

        let comments;
        comments = await db.queryFileComments(fileID,commentID)


        res.send(JSON.stringify(comments,null,2))

        // return all comments above that

    }catch(error){
        next(error)

    }
})



export default router;