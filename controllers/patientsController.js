"use strict";

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

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
            let successMessage = req.flash('successMessage');
            console.log(successMessage);
            console.log('patient.labResults:', patient.labResults);
            res.render("patients/show", {patient: patient, successMessage: successMessage})
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
            res.render("patients/update", {patient: patient, formMethod: 'PUT', clinicId: req.clinicId});
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({message: "Internal server error"});
        });
});

router.get("/create", (req, res) => {
    console.log(req.params);
    res.render("patients/create", {patient: null, formMethod: 'POST', clinicId: req.clinicId});
});

router.post("/", (req, res) => {
    console.log('post:')
    let patientData = new Patient(req.body);
    patientData.save((err, patient) => {
        if (err) {
            console.log(err);
            res.render("patients/create", {message: "Sorry, your request was invalid."});
        }
        else {
            req.flash("successMessage", "Patient successfully created!");
            res.redirect(`/clinics/${patient.clinic._id}/patients/show/${patient._id}`);
        };
    });
});

router.put("/:id", (req, res) => {
    console.log('put:', req.body.id);
    if  (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
        Patient
            .findById(req.params.id)
            .populate('labResults')
            .populate('clinic')
            .then(patient => {
                res.render("patients/update", {patient: patient,
                    errorMessage: "Sorry, the request path id and the request body id values must match.", clinicId: req.clinicId,
                    formMethod: 'PUT'});
            })
            .catch(err => {
                console.error(err);
                res.status(500).json({message: "Internal server error"});
            });
    }

    Patient.findByIdAndUpdate(req.params.id, {$set: req.body})
        .then(() => {
            req.flash('successMessage', 'Patient successfully updated!');
            res.redirect(`/clinics/${req.clinicId}/patients/show/${req.params.id}`);
            res.finished = true;
            res.end();
        });

});

router.delete("/:id", (req, res) => {
    Patient.findByIdAndRemove(req.params.id, err => {
        if (err) {
            res.render("patients/index", {message: "Sorry, something went wrong. Patient could not be deleted."});
        }
        else {
            req.flash("successMessage", "Patient successfully deleted!");
            res.redirect(`/clinics/${req.params.clinicId}/patients`);
        };
    });
});

module.exports = router;



