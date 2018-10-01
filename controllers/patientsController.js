"use strict";

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const {Patient} = require("../models/patients");
const {Clinic} = require('../models/clinics');
const {patientsSvc} = require('../services/patients');

router.get("/", (req, res) => {
    patientsSvc.getAllPatientsByClinicAlphabetically(req.clinicId)
        .then(patients => {
            console.log(patients);
            res.render("patients/index", {patients: patients, clinicId: req.clinicId})
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({message: "Internal server error"});
        });
});

router.get("/show/:id", (req, res) => {
    Patient
        .findById(req.params.id)
        .populate({path: 'labResults', options: {sort: {date: 1}}})
        .populate('clinic')
        .then(patient => {
            let successMessage = req.flash('successMessage');
            console.log('patient.labResults:', patient.labResults);
            res.render("patients/show", {patient: patient, clinicId: req.clinicId, successMessage: successMessage})
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({message: "Internal server error"});
        });
});

router.get("/update/:id", (req, res) => {
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
    res.render("patients/create", {patient: null, formMethod: 'POST', clinicId: req.clinicId});
});

router.post("/", (req, res) => {
    console.log('post:')
    let patientData = new Patient(req.body);
    patientData._id = new mongoose.Types.ObjectId();
    patientData
        .save((err, patient) => {
            if (err) {
                console.log(err);
                res.render("patients/create", {message: "Sorry, your request was invalid."});
            }
            else {
                Clinic
                    .findByIdAndUpdate(patient.clinic, {$push: {patients: patient._id}})
                    .then(c => {
                        req.flash("successMessage", `Patient successfully created and added to the ${c.name} patient list!`);
                        res.redirect(`/clinics/${patient.clinic._id}/patients/show/${patient._id}`);
                        res.finished = true;
                        res.end();
                    })
                    .catch(err => {
                        console.error(err);
                        res.status(500).json({message: "Internal server error"});
                    });
            }
    });
});

router.put("/:id", (req, res) => {
    if  (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
        Patient
            .findById(req.params.id)
            .populate('labResults')
            .populate('clinic')
            .then(patient => {
                res.render("patients/update", {patient: patient, formMethod: 'PUT',
                    errorMessage: "Sorry, the request path id and the request body id values must match.", clinicId: req.clinicId});
            })
            .catch(err => {
                console.error(err);
                res.status(500).json({message: "Internal server error"});
            });
    }

    Patient
        .findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true})
        .then(() => {
            req.flash('successMessage', 'Patient successfully updated!');
            res.redirect(`/clinics/${req.clinicId}/patients/show/${req.params.id}`);
            res.finished = true;
            res.end();
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({message: "Internal server error"});
        });

});

router.delete("/:id", (req, res) => {
    Patient
        .findByIdAndRemove(req.params.id, err => {
            if (err) {
                Patient
                    .findById(req.params.id)
                    .populate('labResults')
                    .populate('clinic')
                    .then(patient => {
                        res.render("patients/index", {patient: patient, clinicId: req.clinicId, message: "Sorry, something went wrong. Patient could not be deleted."});
                    })
                    .catch(err => {
                        console.log(err);
                        req.flash('errorMessage', 'Internal server error');
                        res.redirect('/');
                });
        }
            else {
                req.flash("successMessage", "Patient successfully deleted!");
                res.redirect(`/clinics/${req.clinicId}/patients`);
                res.finished = true;
                res.end();
            }
    });
});

module.exports = router;



