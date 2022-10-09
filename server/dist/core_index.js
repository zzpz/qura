// import dotenv from "dotenv";
// import express from "express";
// import path from "path";
// import uploadRouter  from "./routes/uploads"
// import dynamoRouter from "./routes/dynamo"
// // initialise config
// dotenv.config();
// // app + routes
// const app = express();
// app.use('/upload', uploadRouter)
// app.use('/dynamo',dynamoRouter)
// // port
// const port = process.env.SERVER_PORT;
// // define a route handler for the default home page
// app.get('/', (req, res) => {
//     res.send(`
//       <h2>With <code>"express"</code> npm package</h2>
//       <form action="/api/upload" enctype="multipart/form-data" method="post">
//         <div>Text field title: <input type="text" name="title" /></div>
//         <div>File: <input type="file" name="someExpressFiles" multiple="multiple" /></div>
//         <input type="submit" value="Upload" />
//       </form>
//     `);
//   });
// // start the Express server
// app.listen( port, () => {
// 	// tslint:disable-next-line:no-console
//     console.log( `server started at -  http://localhost:${ port }` );
// } );
//# sourceMappingURL=core_index.js.map