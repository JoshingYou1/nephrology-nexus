"use strict";

const express = require("express");
const router = express.Router();

const {Patient} = require("./models");

const app = express();

app.use(morgan("common"));
app.use(express.json());

