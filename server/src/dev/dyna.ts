// import * as db from "../db/models"


// // core
// import express from "express";
// import { STATUS_CODES } from "http";
// const router = express.Router(); // routing



// router.get('/getdetails/:fileID', async(req,res,next) =>{


//     const fID = req.params.fileID || '01G9SF3TKRQQ02T1ZRD87BEJYJ'


//     // const fID = '01G9SF3TKRQQ02T1ZR'

//     // async await

//     try{
//         const detail:db.Detail = (await db.getDetail(fID))
//         if(!detail?.fileID){
//             // no fileID
//             res.sendStatus(404) // file not found
//         }
//         res.send(detail.toJSON())
//     } catch (err) {
//         // do things here
//         next(err)
//     }
// })




// router.get('/consolidate', async(req,res,next)=>{

//     // req.body.file => f
//     // req.body.comments => coms

//     const ver:number = 0
//     const newDesc:string =  `NEW DESCRIPTION VERSION ${ver}`
//     const f:db.Detail = new db.DetailModel( {fileID:'1234',sortKey:'details', description: newDesc, version:ver})
//     const coms: db.Comment[] = [
//         new db.CommentModel({
//             fileID:`${f.fileID}`,
//             sortKey:`COMMENT_v${f.version}_${1}`,
//             status: 'accepted',
//             appliedToVersion: f.version
//         }),
//         new db.CommentModel({
//             fileID:`${f.fileID}`,
//             sortKey:`COMMENT_v${f.version}_${2}`,
//             status: 'accepted',
//             appliedToVersion: f.version
//         }),
//     ]



//     try{
//         const detail:db.Detail = (await db.getDetail(f.fileID))
//         if(!detail?.fileID){
//             res.sendStatus(404) // file DNE
//         }

//         const trans = (await db.createConsolidateTrans(f,coms))

//         res.send(trans)

//         // for now pretend it is a valid request



//     }catch(err){
//         // do things here
//         next(err)
//     }

//     // take the provided fileID + NEW_description + CURRENT_version
//         // validate it is current (e.g. you're not trying to consolidate an outdated detail)  alternative is to up the version by one and *assume* it is ok to do so

//     // conditions -  comment version <= current version of fileDetails. comment being consolidated is not actioned

//     // take the provided commentID's + status

//     // update the fileID details to be the new 'description' increment the version by 1
//     // update the provided comments

//     // return the new Detail


// })

// // detail:Detail
// async function optimisticWrite(fileDetail:db.Detail, comments:db.Comment[]){
//     // for now all inputs considered valid
//     // happy path
//     return db.createConsolidateTrans(fileDetail,comments)
// }


// export default router;