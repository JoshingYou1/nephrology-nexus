"use strict";

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const flash = require("req-flash");
const session = require("express-session");
const bodyParser = require("body-parser");
mongoose.Promise = global.Promise;


module.exports = router;