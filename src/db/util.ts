// ULID
import { monotonicFactory, ULID } from 'ulid'
const uuid = monotonicFactory();

// dotenv
import dotenv from "dotenv"
dotenv.config() // makes env config vars available


export {uuid};