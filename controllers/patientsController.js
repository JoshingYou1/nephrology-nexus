"use strict";

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const config = require('../config');

const {Patient} = require("../models/patients");

router.get("/", (req, res) => {
    console.log('config:', config.DATABASE_URL);
    Patient
        .find({clinic: req.clinicId})
        .then(patients => {
            console.log(patients);
            res.render("patients/index", {patients: patients, clinicId: req.clinicId})
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
        .populate('clinic')
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
    console.log('req.params:', req.params.id);
    Patient
        .findById(req.params.id)
        .populate('labResults')
        .populate('clinic')
        .then(patient => {
            res.render("patients/update", {patient: patient, formMethod: "put", clinicId: req.clinicId})
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({message: "Internal server error"});
        });
});

router.get("/create", (req, res) => {
    console.log(req.params);
    res.render("patients/create", {patient: null, formMethod: "post", clinicId: req.clinicId});
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
            res.redirect(201, `/clinics/${patient.clinic._id}/patients/show/${patient._id}`);
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
            res.redirect(204, `/clinics/${patient.clinic._id}/patients/show/${res._id}`);
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
            res.redirect(204, `/clinics/${req.params.clinicId}/patients`);
        };
    });
});

module.exports = router;



