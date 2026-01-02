const serverless = require("serverless-http");
const app = require("../src/vercel-server");

module.exports = serverless(app);
