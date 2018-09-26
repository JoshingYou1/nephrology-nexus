"use strict";

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bodyParser = require('body-parser');

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
        });
});

router.get('/show/:id', (req, res) => {
    LabResults
        .findById(req.params.id)
        .populate('patients')
        .then(result => {
            res.render('lab-results/show', {result: result, successMessage: req.flash('successMessage')})
        })
        .catch(err => {
            console.log(err);
            req.flash('errorMessage', 'Internal server error');
            res.redirect('/');
        });
});

router.get('/update/:id', (req, res) => {
    LabResults
        .findById(req.params.id)
        .populate('patients')
        .then(result => {
            console.log('formatDate:', result.formatDate);
            res.render("lab-results/update", {result: result, formMethod: 'PUT', clinicId: req.clinicId, patientId: req.patientId,
                successMessage: req.flash('successMessage')});
        })
        .catch(err => {
            console.log(err);
            req.flash('errorMessage', 'Internal server error');
            res.redirect('/');
        });
});

router.get('/create', (req, res) => {
    res.render('lab-results/create', {result: null, formMethod: 'POST', patientId: req.patientId, clinicId: req.clinicId});
});

router.post('/', (req, res) => {
    let labResultsData = new LabResults(req.body);
    labResultsData._id = new mongoose.Types.ObjectId();
    labResultsData.save((err, result) => {
        if (err) {
            console.log(err);
            res.render('lab-results/create', {message: 'Sorry, your request was invalid.', formMethod: 'POST',
                clinicId: req.clinicId, patientId: req.patientId});
        }
        else {
            Patient.findByIdAndUpdate(result.patient, { $push: {labResults: result._id}}).then(function(p) {
                req.flash('successMessage', `Lab results successfully created for ${p.patientName}!`);
                res.redirect(`/clinics/${req.clinicId}/patients/${result.patient._id}/lab-results/show/${result._id}`);
            });
        };
    });
});

router.put('/:id', (req, res) => {
    if  (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
        res.render('lab-results/update', {message: 'Sorry, the request path id and the request body id values must match.'});
    };
    LabResults.findByIdAndUpdate(req.params.id, req.body, {new: true}, (err, p) => {
        if (err) {
            console.log(err);
            res.render('lab-results/update', {message: 'Sorry, something went wrong. Lab results data could not be updated.',
                formMethod: 'PUT', clinicId: req.clinicId, patientId: req.patientId});
        }
        else {
            req.flash('successMessage', `Lab results successfully updated for ${p.patientName}!`);
            res.redirect(`/clinics/${req.clinicId}/patients/${result.patient._id}/lab-results/show/${res._id}`);
        };
    });
});

router.delete('/:id', (req, res) => {
    LabResults.findByIdAndRemove(req.params.id, err => {
        if (err) {
            res.render('lab-results/index', {message: 'Sorry, something went wrong. Lab results could not be deleted.'});
        }
        else {
            req.flash('successMessage', 'Lab results successfully deleted!');
            res.redirect(`/clinics/${req.params.clinicId}/patients/${req.params.patientId}/lab-results`);
        };
    });
});
module.exports = router;