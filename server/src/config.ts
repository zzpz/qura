// config
import dotenv from "dotenv"
dotenv.config();

const port = process.env.SERVER_PORT  // all of our variables should be imported here in this file from process not env file.

export {port}