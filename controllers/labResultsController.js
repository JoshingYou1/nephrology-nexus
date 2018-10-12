"use strict";

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const {LabResults} = require('../models/lab-results');
const {Patient} = require('../models/patients');
const {isAuthenticated} = require('../strategies/auth');
const {labResultsSvc} = require('../services/lab-results');

router.get('/', isAuthenticated, (req, res) => {
    let vm = {};
    Patient
        .findById(req.patientId)
        .populate('clinic')
        .then(patient => {
            vm.patientId = req.patientId;
            vm.clinicId = req.clinicId;
            vm.patient = patient;
            vm.clinic = patient.clinic;

            labResultsSvc.getAllLabResultsByPatientChronologically(req.patientId)
                .then(results => {
                    vm.results = results;
                    console.log('results:', results);
                    res.render('lab-results/index', vm);
                })
                .catch(err => {
                    console.log(err);
                    req.flash('errorMessage', 'Internal server error');
                    res.redirect('/');
                });
        });
});

router.get('/show/:id', isAuthenticated, (req, res) => {
    let vm ={};
    Patient
        .findById(req.patientId)
        .populate('clinic')
        .then(function(patient) {
            vm.patientId = req.patientId;
            vm.clinicId = req.clinicId;
            vm.patient = patient;
            vm.clinic = patient.clinic;
    
            LabResults
                .findById(req.params.id)
                .populate('patient')
                .then(result => {
                    vm.result = result;
                    let successMessage = req.flash('successMessage');
                    res.render('lab-results/show', {successMessage: successMessage, ...vm})
                })
                .catch(err => {
                    console.log(err);
                    req.flash('errorMessage', 'Internal server error');
                    res.redirect('/');
                });
        });
});

router.get('/update/:id', isAuthenticated, (req, res) => {
    LabResults
        .findById(req.params.id)
        .populate('patient')
        .then(result => {
            res.render("lab-results/update", {result: result, formMethod: 'PUT', clinicId: req.clinicId, patientId: req.patientId,
                successMessage: req.flash('successMessage')});
        })
        .catch(err => {
            console.log(err);
            req.flash('errorMessage', 'Internal server error');
            res.redirect('/');
        });
});

router.get('/create', isAuthenticated, (req, res) => {
    res.render('lab-results/create', {result: null, formMethod: 'POST', patientId: req.patientId, clinicId: req.clinicId});
});

router.post('/', isAuthenticated, (req, res) => {
    let labResultsData = new LabResults(req.body);
    labResultsData._id = new mongoose.Types.ObjectId();
    labResultsData
        .save((err, result) => {
            if (err) {
                console.log(err);
                res.render('lab-results/create', {message: 'Sorry, your request was invalid.', formMethod: 'POST',
                    clinicId: req.clinicId, patientId: req.patientId});
            }
            else {
                Patient
                    .findByIdAndUpdate(result.patient, { $push: {labResults: result._id}})
                    .then(function(p) {
                        req.flash('successMessage', `Lab results successfully created for ${p.patientName}!`);
                        res.redirect(`/clinics/${req.clinicId}/patients/show/${result.patient._id}`);
                    })
                    .catch(err => {
                        console.error(err);
                        res.status(500).json({message: "Internal server error"});
                    });
            }
    });
});

router.put('/:id', isAuthenticated, (req, res) => {
    if  (!(req.params.id && req.body._id && req.params.id === req.body._id)) {
        LabResults
            .findById(req.params.id)
            .populate('patient')
            .then(result => {
                console.log('formatDate:', result.formatDate);
                res.render("lab-results/update", {result: result, formMethod: 'PUT', clinicId: req.clinicId, patientId: req.patientId,
                    errorMessage: 'Sorry, the request path id and the request body id values must match.'});
            })
            .catch(err => {
                console.error(err);
                res.status(500).json({message: "Internal server error"});
            });
    }

    LabResults
        .findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true})
        .then(() => {
            req.flash('successMessage', 'Lab results successfully updated!');
            res.redirect(`/clinics/${req.clinicId}/patients/${req.patientId}/lab-results/show/${req.params.id}`);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({message: "Internal server error"});
        });
});

router.delete('/:id', isAuthenticated, (req, res) => {
    LabResults
        .remove({_id: req.params.id}, err => {
            if (err) {
                LabResults
                    .findById(req.params.id)
                    .populate('patient')
                    .then(result => {
                        res.render('lab-results/show', {result: result,
                            errorMessage: 'Sorry, something went wrong. Lab results could not be deleted.'})
                    })
                    .catch(err => {
                        console.log(err);
                        req.flash('errorMessage', 'Internal server error');
                        res.redirect('/');
                });
            }
            else {
                req.flash('successMessage', 'Lab results successfully deleted!');
                res.redirect(`/clinics/${req.clinicId}/patients/show/${req.patientId}`);
            }
    });
});
module.exports = router;