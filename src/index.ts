import * as config from "./config"; // config
import express from "express";
// import apiRouter from "./routes/dyna"
import sdkroute from "./routes/dynamo"
import s3Router from "./routes/s3"




// port
const port = config.port;

// app + routes
const app = express();
app.use('/api', sdkroute)
app.use('/upload',s3Router)

// define a route handler for the default home page
app.get('/', (req, res) => {
    res.send(`
      <h2>With <code>"express"</code> npm package</h2>
      <form action="/api/upload" enctype="multipart/form-data" method="post">
        <div>Text field title: <input type="text" name="title" /></div>
        <div>File: <input type="file" name="someExpressFiles" multiple="multiple" /></div>
        <input type="submit" value="Upload" />
      </form>
    `);
  });



// start the Express server
app.listen( port, () => {
	// tslint:disable-next-line:no-console
    console.log( `server started at -  http://localhost:${ port }` );
} );
