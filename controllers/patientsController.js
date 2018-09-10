"use strict";

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const flash = require("req-flash");
const session = require("express-session");
const bodyParser = require("body-parser");
mongoose.Promise = global.Promise;

const {Patient} = require("../models/patients");

router.get("/", (req, res) => {
    Patient
        .find()
        .then(patients => {
            console.log(patients);
            res.render("patients/index", {patients: patients})
    })
        .catch(
            err => {
                console.error(err);
                res.status(500).json({message: "Internal server error"});
            });
});

router.get("/:id", (req, res) => {
    Patient
        .findById(req.params.id)
        .then(patient => res.render("patients/show", {patient: patient, successMessage: req.flash("successMessage")}))
        .catch(err => {
            console.error(err);
            res.status(500).json({message: "Internal server error"});
        });
});

router.post("/", (req, res) => {
    console.log(req.body);
    let patientData = new Patient(req.body);
    patientData.save((err, patient) => {
        console.log(err);
        if (err) {
            res.render("patients/create", {message: "Sorry, your request was invalid..."});
        }
        else {
            req.flash("successMessage", "Patient successfully created!");
            res.redirect(`/patients/${patient.id}`);
        }
    })
})

router.put("/:id", (req, res) => {
    if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
        req.flash("errorMessage", "Something went wrong, patient data could not be updated...");
        res.redirect(`/patients/${res.id}`);
    }
})

module.exports = router;



