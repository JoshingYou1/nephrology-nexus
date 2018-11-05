'use strict';

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const {LabResults} = require('../models/lab-results');
const {Patient} = require('../models/patients');
const {isAuthenticated} = require('../strategies/auth');
const {labResultsSvc} = require('../services/lab-results');

router.get('/', isAuthenticated, function(req, res) {
    let vm = {};
    Patient
        .findById(req.patientId)
        .populate('clinic')
        .then(function(patient) {
            vm.patientId = req.patientId;
            vm.clinicId = req.clinicId;
            vm.patient = patient;
            vm.clinic = patient.clinic;
            vm.successMessage = req.flash('successMessage');
            vm.errorMessage = req.flash('errorMessage');

            labResultsSvc.getAllLabResultsByPatientChronologically(req.patientId)
                .then(function(results) {
                    vm.results = results;
                    res.render('lab-results/index', vm);
                })
                .catch(function(err) {
                    console.log(err);
                    req.flash('errorMessage', 'Internal server error');
                    res.redirect('/');
                });
        });
});

router.get('/show/:id', isAuthenticated, function(req, res) {
    let vm ={};
    Patient
        .findById(req.patientId)
        .populate('clinic')
        .then(function(patient) {
            vm.patientId = req.patientId;
            vm.clinicId = req.clinicId;
            vm.patient = patient;
            vm.clinic = patient.clinic;
            vm.successMessage = req.flash('successMessage');
    
            LabResults
                .findById(req.params.id)
                .populate('patient')
                .then(function(result) {
                    vm.result = result;
                    res.render('lab-results/show', vm)
                })
                .catch(function(err) {
                    console.log(err);
                    req.flash('errorMessage', 'Internal server error');
                    res.redirect('/');
                });
        });
});

router.get('/update/:id', isAuthenticated, function(req, res) {
    let vm = {};
    LabResults
        .findById(req.params.id)
        .populate('patient')
        .then(function(result) {
            vm.result = result;
            vm.clinicId = req.clinicId;
            vm.patientId = req.patientId;
            vm.successMessage = req.flash('successMessage');
            vm.errorMessage = req.flash('errorMessage');
            res.render('lab-results/update', {formMethod: 'PUT', ...vm});
        })
        .catch(function(err) {
            console.log(err);
            req.flash('errorMessage', 'Internal server error');
            res.redirect('/');
        });
});

router.get('/create', isAuthenticated, function(req, res) {
    let vm = {};
    vm.clinicId = req.clinicId;
    vm.patientId = req.patientId;
    res.render('lab-results/create', {result: null, formMethod: 'POST', ...vm});
});

router.post('/', isAuthenticated, function(req, res) {
    let labResultsData = new LabResults(req.body);
    labResultsData._id = new mongoose.Types.ObjectId();
    let vm = {};
    labResultsData
        .save(function(err, result) {
            if (err) {
                vm.clinicId = req.clinicId;
                vm.patientId = req.clinicId;
                console.log(err);
                res.render('lab-results/create', {message: 'Sorry, your request was invalid.', formMethod: 'POST', ...vm});
            }
            else {
                Patient
                    .findByIdAndUpdate(result.patient, { $push: {labResults: result._id}})
                    .then(function(p) {
                        req.flash('successMessage', `Lab results successfully created for ${p.patientName}!`);
                        res.redirect(`/clinics/${req.clinicId}/patients/${result.patient._id}/lab-results`);
                    })
                    .catch(function(err) {
                        console.error(err);
                        res.status(500).json({message: 'Internal server error'});
                    });
            }
    });
});

router.put('/:id', isAuthenticated, function(req, res) {
    let vm = {};
    if  (!(req.params.id && req.body._id && req.params.id === req.body._id)) {
        LabResults
            .findById(req.params.id)
            .populate('patient')
            .then(function(result) {
                vm.result = result;
                vm.clinicId = req.clinicId;
                vm.patientId = req.patientId;
                res.render('lab-results/update', {result: result, formMethod: 'PUT', ...vm,
                    errorMessage: 'Sorry, the request path id and the request body id values must match.'});
            })
            .catch(function(err) {
                console.error(err);
                res.status(500).json({message: 'Internal server error'});
            });
    }

    LabResults
        .findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true})
        .then(function() {
            req.flash('successMessage', 'Lab results successfully updated!');
            res.redirect(`/clinics/${req.clinicId}/patients/${req.patientId}/lab-results/show/${req.params.id}`);
        })
        .catch(function(err) {
            console.error(err);
            res.status(500).json({message: 'Internal server error'});
        });
});

router.delete('/:id', isAuthenticated, function(req, res) {
    let vm = {};
    LabResults
        .remove({_id: req.params.id}, function(err) {
            if (err) {
                LabResults
                    .findById(req.params.id)
                    .populate('patient')
                    .then(function(result) {
                        vm.result = result;
                        res.render('lab-results/show', {errorMessage: 'Sorry, something went wrong. Lab results could not be deleted.', ...vm})
                    })
                    .catch(function(err) {
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