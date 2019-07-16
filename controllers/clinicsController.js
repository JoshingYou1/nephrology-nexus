'use strict';

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const {Clinic} = require('../models/clinics');
const {isAuthenticated} = require('../strategies/auth');
const {clinicsSvc} = require('../services/clinics');

router.get('/', isAuthenticated, function(req, res) {
    let vm = {};
    clinicsSvc.getAllClinicsAlphabetically()
        .then(function(clinics) {
            vm.clinics = clinics;
            vm.successMessage = req.flash('successMessage');
            vm.errorMessage = req.flash('errorMessage');

            res.render('clinics/index', vm);
        })
        .catch(function(err) {
            console.log(err);
            res.redirect('/');
        });
});

router.get('/show/:id', isAuthenticated, function(req, res) {
    let vm = {};
    Clinic
        .findById(req.params.id)
        .populate({path: 'patients', options: {sort: {'name.lastName': 1}}})
        .then(function(clinic) {
            vm.clinic = clinic;
            vm.successMessage = req.flash('successMessage');
            vm.errorMessage = req.flash('errorMessage');
            res.render('clinics/show', vm);
        })
        .catch(function(err) {
            console.log(err);
            res.redirect('/');
        });
});

router.get('/update/:id', isAuthenticated, function(req, res) {
    let vm = {};
    Clinic
        .findById(req.params.id)
        .populate('patients')
        .then(function(clinic) {
            vm.clinic = clinic;
            vm.successMessage = req.flash('successMessage');
            vm.errorMessage = req.flash('errorMessage');
            res.render('clinics/update', {formMethod: 'PUT', ...vm});
        })
        .catch(function(err) {
            console.log(err);
            res.redirect('/');
        });
});

router.get('/create', isAuthenticated, function(req, res) {
    res.render('clinics/create', {clinic: null, formMethod: 'POST'});
});

router.post('/', isAuthenticated, function(req, res) {
    let clinicData = new Clinic(req.body);
    clinicData._id = new mongoose.Types.ObjectId();
    clinicData
        .save(function(err, clinic) {
            if (err) {
                console.log(err);
                res.render('clinics/create', {message: 'Sorry, your request was invalid.', formMethod: 'POST'});
            }
            else {
                req.flash('successMessage', 'Clinic successfully created!');
                res.redirect(`/clinics/show/${clinic._id}`);
            }
    });
});

router.put('/:id', isAuthenticated, function(req, res) {
    if  (!(req.params.id && req.body._id && req.params.id === req.body._id)) {
        let vm = {};
        Clinic
            .findById(req.params.id)
            .populate('patients')
            .then(function(clinic) {
                vm.clinic = clinic;
                res.render('clinics/update', {formMethod: 'PUT', ...vm,
                    errorMessage: 'Sorry, the request path id and the request body id values must match.'});
            })
            .catch(function(err) {
                console.error(err);
                res.status(500).json({message: 'Internal server error'});
            });
    }

    Clinic
        .findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true})
        .then(function() {
            req.flash('successMessage', 'Clinic successfully updated!');
            res.redirect(`/clinics/show/${req.params.id}`);
        })
        .catch(function(err) {
            console.log(err);

            Clinic
                .findById(req.params.id)
                .populate('patients')
                .then(function(clinic) {
                    vm.clinic = clinic;
                    res.render('clinics/update', {formMethod: 'PUT', ...vm,
                        errorMessage: 'Sorry, something went wrong. Clinic data could not be updated.'});
                })
                .catch(function(err) {
                    console.error(err);
                    res.status(500).json({message: 'Internal server error'});
                });
        });
});

router.delete('/:id', isAuthenticated, function(req, res) {
    let vm = {};
    Clinic
        .findById(req.params.id)
        .populate('patients')
        .then(function(clinic) {
            vm.clinic = clinic;
            clinic.remove(function(err) {
                if (err) {
                    res.render('clinics/show', {...vm, message: 'Sorry, something went wrong. Clinic could not be deleted.'});
                }
                else {
                    req.flash('successMessage', 'Clinic successfully deleted!');
                    res.redirect('/clinics');
                }
            })
            .catch(function(err) {
                console.log(err);
                req.flash('errorMessage', 'Internal server error');
                res.redirect('/');
            });
        });
});

module.exports = router;