"use strict";

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
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

router.get("/show/:id", (req, res) => {
    Patient
        .findById(req.params.id)
        .populate('labResults')
        .then(patient => {
            console.log('patient.labResults:', patient.labResults);
            res.render("patients/show", {patient: patient})
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({message: "Internal server error"});
        });
});

router.get("/update/:id", (req, res) => {
    Patient
        .findById(req.params.id)
        .then(patient => {
            res.render("patients/update", {patient: patient, formMethod: "put"})
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({message: "Internal server error"});
        });
});

router.get("/create", (req, res) => {
    res.render("patients/create", {patient: null, formMethod: "post"});
});

router.post("/", (req, res) => {
    let patientData = new Patient(req.body);
    patientData.save((err, patient) => {
        console.log(err);
        if (err) {
            res.render("patients/create", {message: "Sorry, your request was invalid."});
        }
        else {
            req.flash("successMessage", "Patient successfully created!");
            res.redirect(201, `/patients/show/${patient._id}`);
        };
    });
});

router.put("/:id", (req, res) => {
    if  (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
        res.render("patients/update", {message: "Sorry, the request path id and the request body id values must match."});
    };

    Patient.findByIdAndUpdate(req.params.id, req.body, {new: true}, err => {
        if (err) {
            res.render("patients/update", {message: "Sorry, something went wrong. Patient data could not be updated."})
        }
        else {
            req.flash("successMessage", "Patient successfully updated!");
            res.redirect(204, `/patients/update/${res._id}`);
        };
    });
});

router.delete("/:id", (req, res) => {
    Patient.findByIdAndRemove(req.params.id, err => {
        if (err) {
            res.render("patients/index", {message: "Sorry, something went wrong. Patient could not be deleted."});
        }
        else {
            req.flash("successMessage", "Patient successfully deleted!");
            res.redirect(204, "/patients/index");
        };
    });
});

module.exports = router;



