const start = require("./start");
const { MONGODB_URI } = require("./mongodb-url");
const { SESSION_SECRET } = require("./session-secret");
module.exports = { start, MONGODB_URI, SESSION_SECRET };
