"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uuid = void 0;
// ULID
const ulid_1 = require("ulid");
const uuid = (0, ulid_1.monotonicFactory)();
exports.uuid = uuid;
// dotenv
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // makes env config vars available
//# sourceMappingURL=util.js.map