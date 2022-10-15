"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config = __importStar(require("./config")); // config
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const dynamo_1 = __importDefault(require("./routes/dynamo"));
const s3_1 = __importDefault(require("./routes/s3"));
const auth_1 = __importDefault(require("./auth/auth"));
// port
const port = config.port;
// app + routes
const app = (0, express_1.default)();
app.use('/api', dynamo_1.default);
app.use('/upload', s3_1.default);
app.use('/jwt', auth_1.default);
// serve the react app
const root = path_1.default.resolve(__dirname, '../../client', 'build');
app.use(express_1.default.static(root));
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
});
// start the Express server
app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`server started at -  http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map