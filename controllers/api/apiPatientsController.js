'use strict';

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const passport = require('passport');
const {Patient} = require('../../models/patients');
const {Doctor} = require('../../models/doctors');
const {Appointment} = require('../../models/appointments');

const {labResultsSvc} = require('../../services/lab-results');
const jwtAuth = passport.authenticate('jwt', {session: false});

router.get('/', jwtAuth, function(req, res) {
    Patient
        .findById(req.patientId)
        .populate('clinic')
        .populate('doctors')
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

router.put('/:id', jwtAuth, function(req, res) {
    if (!(req.params.id && req.body._id && req.params.id === req.body._id)) {
        res.status(400).json({
          error: 'Request path id and request body id values must match'
        });
    }

    if (typeof req.body.socialSecurityNumber !== 'string') {
        return res.status(400).json({
            message: 'Incorrect field type',
            reason: 'ValidationError',
            location: 'socialSecurityNumber'
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
        .findByIdAndUpdate(req.params.id, { $set: updated }, { new: true })
        .then(updatedPatient => {
            res.status(204).end();
        })
        .catch(err => {
            res.status(500).json({ message: 'Something went wrong' });
        });

    return res.status(204);
})

module.exports = router;

