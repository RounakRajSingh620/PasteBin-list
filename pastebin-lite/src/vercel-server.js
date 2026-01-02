require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("src/views"));

app.use("/api/healthz", require("./routes/health"));
app.use("/api/pastes", require("./routes/pastes"));
app.use("/api/pastes", require("./routes/pasteFetch"));
app.use("/p", require("./routes/pasteView"));

// IMPORTANT: no app.listen() here
module.exports = app;
