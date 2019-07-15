'use strict';

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const {Patient} = require('../models/patients');
const {Clinic} = require('../models/clinics');
const {patientsSvc} = require('../services/patients');
const {isAuthenticated} = require('../strategies/auth');

router.get('/', isAuthenticated, function(req, res) {
    let vm = {};
    Clinic
        .findById(req.clinicId)
        .then(function(clinic) {
            vm.clinic = clinic;
            vm.clinicId = req.clinicId;
            
            patientsSvc.getAllPatientsByClinicAlphabetically(req.clinicId)
                .then(function(patients) {
                    vm.patients = patients;
                    res.render('patients/index', vm);
                })
                .catch(function(err) {
                    console.error(err);
                    res.status(500).json({message: 'Internal server error'});
                });
        });
});

router.get('/show/:id', isAuthenticated, function(req, res) {
    let vm = {};
    Patient
        .findById(req.params.id)
        .populate('clinic')
        .then(function(patient) {
            vm.patient = patient;
            vm.clinicId = req.clinicId;
            vm.successMessage = req.flash('successMessage');
            res.render("patients/show", vm);
        })
        .catch(function(err) {
            console.error(err);
            res.status(500).json({message: 'Internal server error'});
        });
});

router.get('/update/:id', isAuthenticated, function(req, res) {
    let vm = {};
    Patient
        .findById(req.params.id)
        .populate('clinic')
        .then(function(patient) {
            vm.patient = patient;
            vm.clinicId = req.clinicId;
            res.render('patients/update', {formMethod: 'PUT', ...vm});
        })
        .catch(function(err) {
            console.error(err);
            res.status(500).json({message: 'Internal server error'});
        });
});

router.get('/create', isAuthenticated, function(req, res) {
    let vm = {};
    vm.clinicId = req.clinicId;
    res.render('patients/create', {patient: null, formMethod: 'POST', ...vm});
});

router.post('/', isAuthenticated, function(req, res) {
    let patientData = new Patient(req.body);
    patientData._id = new mongoose.Types.ObjectId();
    let vm = {};
    patientData
        .save(function(err, patient) {
            if (err) {
                vm.clinicId = req.clinicId;
                console.log(err);
                res.render('patients/create', {message: 'Sorry, your request was invalid.', formMethod: 'POST', ...vm});
            }
            else {
                Clinic
                    .findByIdAndUpdate(patient.clinic, {$push: {patients: patient._id}})
                    .then(function(c) {
                        req.flash('successMessage', `Patient successfully created and added to the ${c.name} patient list!`);
                        res.redirect(`/clinics/${patient.clinic._id}/patients/show/${patient._id}`);
                    })
                    .catch(function(err) {
                        console.error(err);
                        res.status(500).json({message: 'Internal server error'});
                    });
            }
    });
});

router.put('/:id', isAuthenticated, function(req, res) {
    let vm = {};
    if  (!(req.params.id && req.body._id && req.params.id === req.body._id)) {
        Patient
            .findById(req.params.id)
            .populate('clinic')
            .then(function(patient) {
                vm.patient = patient;
                vm.clinicId = req.clinicId;
                res.render('patients/update', {errorMessage: 'Sorry, the request path id and the request body id values must match.',
                formMethod: 'PUT', ...vm});
            })
            .catch(function(err) {
                console.error(err);
                res.status(500).json({message: 'Internal server error'});
            });
    }

    Patient
        .findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true})
        .then(function(patient) {
            patient.password = req.body.password;
            patient.save(function() {
                req.flash('successMessage', 'Patient successfully updated!');
                res.redirect(`/clinics/${req.clinicId}/patients/show/${req.params.id}`);
            })
        })
        .catch(function(err) {
            console.error(err);
            res.status(500).json({message: 'Internal server error'});
        });

});

router.delete('/:id', isAuthenticated, function(req, res) {
    let vm = {};
    Patient
        .remove({_id: req.params.id}, function(err) {
            if (err) {
                Patient
                    .findById(req.params.id)
                    .populate('clinic')
                    .then(function(patient) {
                        vm.patient = patient;
                        vm.clinicId = req.clinicId;
                        res.render('patients/show', {message: 'Sorry, something went wrong. Patient could not be deleted.', ...vm});
                    })
                    .catch(function(err) {
                        console.log(err);
                        req.flash('errorMessage', 'Internal server error');
                        res.redirect('/');
                });
        }
            else {
                req.flash('successMessage', 'Patient successfully deleted!');
                res.redirect(`/clinics/${req.clinicId}/patients`);
            }
    });
});

module.exports = router;



