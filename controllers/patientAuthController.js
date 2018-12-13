'use strict';

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const {JWT_SECRET, JWT_EXPIRY} = require('../config');
const passport = require('passport');
const {patientStrategy, jwtStrategy} = require('../strategies/authPatient');

passport.use('patientLogin', patientStrategy);
passport.use('jwt', jwtStrategy);

const patientAuth = passport.authenticate('patientLogin', {session: false});
const jwtAuth = passport.authenticate('jwt', {session: false})

const createAuthToken = function(patient) {
    return jwt.sign({patient}, JWT_SECRET, {
        subject: patient.username,
        expiresIn: JWT_EXPIRY,
        algorithm: 'HS256'
    });
};

router.post('/login', patientAuth, function(req, res) {
    const authToken = createAuthToken(req.patient.serialize());
    res.json({
        authToken
    });
});

router.post('/refresh', jwtAuth, function(req, res) {
    const authToken = createAuthToken(req.patient);
    res.json({
        authToken
    });
});

module.exports = router;

