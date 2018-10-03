'use strict';

const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const passport = require('passport');
const bodyParser = require('body-parser');
const LocalStrategy = require('passport-local').Strategy;
mongoose.Promise = global.Promise;

const {protectLogin, isAuthenticated} = require('../strategies/auth');

router.get('/login', protectLogin, (req, res) => {
    const message = req.flash('message');
    console.log('message:', message);
    res.render('users/login', { message: message});
});

router.get('/register', protectLogin, (req, res) => {
    const usernameUniqueError = req.flash('usernameUniqueError');
    const message = req.flash('message');
    console.log('message:', message);
    res.render('users/register', {usernameUniqueError: usernameUniqueError, message: message});
});

router.get('/logout', isAuthenticated, (req, res) => {
    req.logout();
    req.flash('message', 'You have been successfully logged out!');
    res.redirect('/users/login');
});

router.post('/register', passport.authenticate('local-register', {successRedirect: '/clinics', failureRedirect: '/users/register',
    failureFlash: true}))

router.post('/login', passport.authenticate('local-login', {successRedirect: '/clinics', failureRedirect: '/users/login', failureFlash: true}));

module.exports = router;