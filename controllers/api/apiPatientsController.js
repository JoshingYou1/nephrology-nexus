'use strict';

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const passport = require('passport');

const {labResultsSvc} = require('../../services/lab-results');
const jwtAuth = passport.authenticate('jwt', {session: false});

router.get('/:patientId/lab-results', jwtAuth, function(req, res) {
    labResultsSvc.getAllLabResultsByPatientChronologically(req.params.patientId)
        .then(function(labResults) {
            res.json(labResults);
        })
})

module.exports = router;

