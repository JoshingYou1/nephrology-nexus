"use strict";

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const {LabResults} = require('../models/lab-results');
const {Patient} = require('../models/patients');

router.get('/', (req, res) => {
    LabResults
        .find()
        .then(labResults => {
            res.render('lab-results/index', {labResults: labResults, patientId: req.patientId, clinicId: req.clinicId});
        })
        .catch(err => {
            console.log(err);
            req.flash('errorMessage', 'Internal server error');
            res.redirect('/');
            res.finished = true;
            res.end();
        });
});

router.get('/show/:id', (req, res) => {
    LabResults
        .findById(req.params.id)
        .populate('patients')
        .then(result => {
            let successMessage = req.flash('successMessage');
            res.render('lab-results/show', {result: result, clinicId: req.clinicId,
                    patientId: req.patientId, successMessage: successMessage})
        })
        .catch(err => {
            console.log(err);
            req.flash('errorMessage', 'Internal server error');
            res.redirect('/');
            res.finished = true;
            res.end();
        });
});

router.get('/update/:id', (req, res) => {
    LabResults
        .findById(req.params.id)
        .populate('patients')
        .then(result => {
            res.render("lab-results/update", {result: result, formMethod: 'PUT', clinicId: req.clinicId, patientId: req.patientId,
                successMessage: req.flash('successMessage')});
        })
        .catch(err => {
            console.log(err);
            req.flash('errorMessage', 'Internal server error');
            res.redirect('/');
            res.finished = true;
            res.end();
        });
});

router.get('/create', (req, res) => {
    res.render('lab-results/create', {result: null, formMethod: 'POST', patientId: req.patientId, clinicId: req.clinicId});
});

router.post('/', (req, res) => {
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

router.put('/:id', (req, res) => {
    if  (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
        LabResults
            .findById(req.params.id)
            .populate('patients')
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
            res.finished = true;
            res.end();
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({message: "Internal server error"});
        });
});

router.delete('/:id', (req, res) => {
    LabResults
        .findByIdAndRemove(req.params.id, err => {
            if (err) {
                LabResults
                    .findById(req.params.id)
                    .populate('patients')
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
                res.finished = true;
                res.end();
            }
    });
});
module.exports = router;