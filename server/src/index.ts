import * as config from "./config"; // config
import express from "express";

import path from "path";
import sdkroute from "./routes/dynamo"
import s3Router from "./routes/s3"
import JWTRouter from "./auth/auth"





// port
const port = config.port;

// app + routes
const app = express();
app.use('/api', sdkroute)
app.use('/upload',s3Router)
app.use('/jwt',JWTRouter)

// serve the react app
const root = path.resolve(__dirname, '../../client','build')
app.use(express.static(root));



// define a route handler for the default home page
app.get('/upload', (req, res) => {
    res.send(`
      <h2>file upload</h2>
      <a href="/comment">  /comment</a>
      <form action="/upload/file" enctype="multipart/form-data" method="post">
        <div>Description: <input type="text" name="description" /></div>
        <div>File: <input type="file" name="file" /></div>
        <input type="submit" value="Upload" />
      </form>

    `);
  });

  app.get('/comment', (req, res) => {
    res.send(`
      <h2>make comment</h2>
      <a href="/">  /upload/file</a>
      <form action="/api/comment" enctype="multipart/form-data" method="post">
        <div>FileID: <input type="text" name="fileID" /></div>
        <div>Comment: <input type="text" name="comment" /></div>
        <input type="submit" value="Upload" />
      </form>
    `);
  });

app.get("*", (req, res) => {
  res.sendFile('index.html', { root });
})

// start the Express server
app.listen( port, () => {
	// tslint:disable-next-line:no-console
    console.log( `server started at -  http://localhost:${ port }` );
} );
