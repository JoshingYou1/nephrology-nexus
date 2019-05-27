'use strict';

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const passport = require('passport');
const {Patient} = require('../../models/patients');
const {Doctor} = require('../../models/api/doctors');
const {Appointment} = require('../../models/api/appointments');

const {labResultsSvc} = require('../../services/lab-results');
const jwtAuth = passport.authenticate('jwt', {session: false});

router.get('/', jwtAuth, function(req, res) {
    Patient
        .findById(req.patientId)
        .populate('clinic')
        // .populate('doctors')
        .then(function(patient) {
            res.json(patient);
        });
});

router.get('/lab-results', jwtAuth, function(req, res) {
    labResultsSvc.getAllLabResultsByPatientChronologically(req.patientId)
        .then(function(labResults) {
            res.json(labResults);
        });
});

router.put('/', jwtAuth, function(req, res) {
    if (!(req.patientId && req.body._id && req.patientId === req.body._id)) {
        res.status(400).json({
          error: 'Request path id and request body id values must match'
        });
    }

    const updated = {};
    const updateableFields = ['socialSecurityNumber', 'address', 'phoneNumbers'];
    updateableFields.forEach(field => {
        if (field in req.body) {
        updated[field] = req.body[field];
        }
    });

    Patient
        .findByIdAndUpdate(req.patientId, { $set: updated }, { new: true })
        .populate('clinic')
        .then(updatedPatient => {
            res.status(200).json(updatedPatient);
        })
        .catch(err => {
            res.status(500).json({ message: 'Something went wrong' });
        });

    return res.status(204);
})

module.exports = router;

