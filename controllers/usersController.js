'use strict';

const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const passport = require('passport');
const bodyParser = require('body-parser');
const LocalStrategy = require('passport-local').Strategy;
mongoose.Promise = global.Promise;

const {protectLogin, isAuthenticated} = require('../strategies/auth');

router.get('/login', protectLogin, function(req, res) {
    let vm = {};
    vm.message = req.flash('message');
    res.render('users/login', vm);
});

router.get('/register', protectLogin, function(req, res) {
    let vm = {};
    vm.message = req.flash('message');
    vm.errorMessage = req.flash('errorMessage');
    res.render('users/register', vm);
});

router.get('/logout', isAuthenticated, function(req, res) {
    req.logout();
    req.flash('message', 'You have been successfully logged out!');
    res.redirect('/users/login');
});

router.post('/register', passport.authenticate('local-register', {successRedirect: '/clinics', failureRedirect: '/users/register',
    failureFlash: true}))

router.post('/login', passport.authenticate('local-login', {successRedirect: '/clinics', failureRedirect: '/users/login', failureFlash: true}));

module.exports = router;