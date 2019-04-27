'use strict';

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const {JWT_SECRET, JWT_EXPIRY} = require('../../config');
const passport = require('passport');

const patientAuth = passport.authenticate('patientLogin', {session: false});
const jwtAuth = passport.authenticate('jwt', {session: false});

const createAuthToken = function(user) {
    console.log('user', user);
    return jwt.sign({user}, JWT_SECRET, {
        subject: user.username,
        expiresIn: JWT_EXPIRY,
        algorithm: 'HS256'
    });
};

router.post('/login', patientAuth, function(req, res) {
    const authToken = createAuthToken(req.user.serialize());
    res.json({
        authToken
    });
});

router.post('/refresh', jwtAuth, function(req, res) {
    const authToken = createAuthToken(req.user);
    res.json({
        authToken
    });
});

module.exports = router;

