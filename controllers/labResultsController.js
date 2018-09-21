"use strict";

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const flash = require('req-flash');
const session = require('express-session');
const bodyParser = require('body-parser');

const {LabResults} = require('../models/lab-results');

router.get('/', (req, res) => {
    LabResults
        .find()
        .then(labResults => {
            res.render('lab-results/index', {labResults: labResults});
        })
        .catch(err => {
            console.log(err);
            req.flash('errorMessage', 'Internal server error');
            res.redirect(500, '/');
        });
});

router.get('/show/:id', (req, res) => {
    LabResults
        .findById(req.params.id)
        .populate('patients')
        .then(result => {
            res.render('lab-results/show', {result: result});
        })
        .catch(err => {
            console.log(err);
            req.flash('errorMessage', 'Internal server error');
            res.redirect(500, '/');
        });
});

router.get('/update/:id', (req, res) => {
    LabResults
        .findById(req.params.id)
        .then(result => {
            res.render("lab-results/update", {result: result, formMethod: "put"});
        })
        .catch(err => {
            console.log(err);
            req.flash('errorMessage', 'Internal server error');
            res.redirect(500, '/');
        });
});

router.get('/create', (req, res) => {
    res.render('lab-results/create', {result: null, formMethod: 'post'});
});

router.post('/', (req, res) => {
    let labResultsData = new LabResults(req.body);
    labResultsData.save((err, result) => {
        if (err) {
            res.render('lab-results/create', {message: 'Sorry, your request was invalid.'});
        }
        else {
            req.flash('successMessage', 'Lab results successfully created!');
            res.redirect(201, `/clinics/${result.patient.clinic._id}/patients/${result.patient._id}/lab-results/show/${result._id}`);
        };
    });
});

router.put('/:id', (req, res) => {
    if  (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
        res.render('lab-results/update', {message: 'Sorry, the request path id and the request body id values must match.'});
    };
    LabResults.findByIdAndUpdate(req.params.id, req.body, {new: true}, err => {
        if (err) {
            res.render('lab-results/update', {message: 'Sorry, something went wrong. Lab results data could not be updated.'});
        }
        else {
            req.flash('successMessage', 'Lab results successfully updated!');
            res.redirect(204, `/clinics/${result.patient.clinic._id}/patients/${result.patient._id}/lab-results/show/${res._id}`);
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
            res.redirect(204, `/clinics/${req.params.clinicId}/patients/${req.params.patientId}/lab-results`);
        };
    });
});
module.exports = router;