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

router.get("/:id/update", (req, res) => {
    Patient
        .findById(req.params.id)
        .then(patient => res.render("patients/update", {patient: patient, formMethod: "put"}))
        .catch(err => {
            console.error(err);
            res.status(500).json({message: "Internal server error"});
        });
});

router.get("/create", (req, res) => {
    res.render("patients/create", {patient: {}, formMethod: "post"});
});

router.post("/", (req, res) => {
    let patientData = new Patient(req.body);
    patientData.save((err, patient) => {
        console.log(err);
        if (err) {
            res.render("patients/create", {message: "Sorry, your request was invalid..."});
        }
        else {
            req.flash("successMessage", "Patient successfully created!");
            res.redirect(201, `/patients/${patient.id}`);
        }
    })
})

router.put("/:id", (req, res) => {
    if  (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
        res.render("patients/update", {message: "Sorry, the request path id and the request body id values must match..."});
    };

    Patient.findByIdAndUpdate(req.params.id, req.body, {new: true}, function(err) {
        if (err) {
            res.render("patients/update", {message: "Something went wrong, patient data was not updated..."})
        }
        else {
            req.flash("successMessage", "Patient successfully updated!");
            res.redirect(204, `/patients/${res.id}`);
        };
    });
});

router.delete("/:id", (req, res) => {
    Patient.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            res.render("patients/index", {message: "Something went wrong, patient was not deleted..."});
        }
        else {
            req.flash("successMessage", "Patient successfully deleted!");
            res.redirect(204, "/patients/index");
        }
    })
})

module.exports = router;



