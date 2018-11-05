const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
mongoose.Promise = global.Promise;

const {User} = require('../models/users');

const localStrategy = new LocalStrategy({usernameField: 'username', passwordField: 'password', passReqToCallback: true},
    function(req, username, password, done) {
        User.findOne({username: username}, function(err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                req.flash('message', 'Username does not exist');
                return done(null, false);
            }
            if (!user.validatePassword(password)) {
                req.flash('message', 'Incorrect password');
                return done(null, false);
            }
            return done(null, user);
        });

});

const registerStrategy = new LocalStrategy({usernameField: 'username', passwordField: 'password', passReqToCallback: true},
    function(req, username, password, done) {
        const requiredFields = ['firstName', 'lastName', 'username', 'password'];
        const missingFields = requiredFields.filter(field => !(field in req.body));

        if (missingFields.length) {
            req.flash('message', `Missing field(s) for ${missingFields.join(', ')}`);
            return done(null, false);
        }

        const stringFields = ['firstName', 'lastName', 'username', 'password'];
        const nonStringFields = stringFields.filter(field => field in req.body && typeof req.body[field] !== 'string');

        if (nonStringFields.length) {
            req.flash('message', `Incorrect field type: expected a string for ${nonStringFields.join(', ')}`);
            return done(null, false);
        }

        const explicityTrimmedFields = ['username', 'password'];
        const nonTrimmedFields = explicityTrimmedFields.filter(field => req.body[field].trim() !== req.body[field]);

        if (nonTrimmedFields.length) {
            req.flash('message', `Cannot have white space at the beginning or end of ${nonTrimmedFields.join(', ')}`);
            return done(null, false);
        }

        const sizedFields = {
            username: {
                min: 2,
                max: 72
            },
            password: {
                min: 2,
                max: 72
            }
        };

        const fieldsTooSmall = Object.keys(sizedFields).filter(field =>
                'min' in sizedFields[field] && req.body[field].trim().length < sizedFields[field].min);

        if (fieldsTooSmall.length) {
            req.flash('message', `The following field(s) must be at least 2 characters long: ${fieldsTooSmall.join(', ')}`);
            return done(null, false);
        }
        
        const fieldsTooLarge = Object.keys(sizedFields).filter(field =>
                'max' in sizedFields[field] && req.body[field].trim().length > sizedFields[field].max);

        if (fieldsTooLarge.length) {
            req.flash('message', `These fields must be at most 72 characters long: ${fieldsTooLarge.join(', ')}`);
            return done(null, false);
        }

        User.findOne({username: username}, function(err, user) {
            if (err) {
                return done(err);
            }
            if (user) {
                req.flash('errorMessage', `Username ${username} already exists`);
                return done(null, false);
            }

            let newUser = new User(req.body);
            newUser._id = new mongoose.Types.ObjectId();
            newUser.password = newUser.hashPassword(req.body.password);

            newUser.save(function(err) {
                if (err) {
                    return done(err);
                }
                return done(null, newUser);
            });
        });
});

const isAuthenticated = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();  
    }
    res.redirect('/users/login');
};

const protectLogin = function(req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect('/clinics');
}


module.exports = {localStrategy, registerStrategy, isAuthenticated, protectLogin};
