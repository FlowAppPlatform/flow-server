const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const controller = require("./controller");
const cors = require("cors");

const app = express();

app.use(logger());
app.options("*", cors());
app.use(cors());

app.use(bodyParser.json());

app.post("/", controller);

module.exports = app;