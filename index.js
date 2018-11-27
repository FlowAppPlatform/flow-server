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

app.listen(1801, () => console.log("Listening on port 1801"));
