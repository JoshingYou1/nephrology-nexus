"use strict";

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const {Patient} = require("../models/patients");

router.get("/", (req, res) => {
    Patient
        .find()
        .then(patients => res.render("/views/patients/index", {patients: patients}))
        .catch(
            err => {
                console.error(err);
                res.status(500).json({message: "Internal server error"});
            });
});

router.get("/:id", (req, res) => {
    Patient
        .findById(req.params.id)
        .then(patients => res.render("/views/patients/index", {patients: patients}))
        .catch(err => {
            console.error(err);
            res.status(500).json({message: "Internal server error"});
        });
});

module.exports = router;



