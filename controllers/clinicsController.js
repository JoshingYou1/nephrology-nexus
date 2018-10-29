"use strict";

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const {Clinic} = require("../models/clinics");
const {isAuthenticated} = require('../strategies/auth');
const {clinicsSvc} = require('../services/clinics');

router.get('/', isAuthenticated, (req, res) => {
    clinicsSvc.getAllClinicsAlphabetically()
        .then(clinics => {
            let errorMessage = req.flash('errorMessage');
            let successMessage = req.flash('successMessage');
            res.render('clinics/index', {clinics: clinics, errorMessage: errorMessage, successMessage: successMessage});
        })
        .catch(err => {
            console.log(err);
            res.redirect('/');
        });
});

router.get("/show/:id", isAuthenticated, (req, res) => {
    Clinic
        .findById(req.params.id)
        .populate({path: 'patients', options: {sort: {'name.lastName': 1}}})
        .then(clinic => {
            console.log('clinic:', clinic);
            let successMessage = req.flash('successMessage');
            let errorMessage = req.flash('errorMessage');
            res.render('clinics/show', {clinic: clinic, successMessage: successMessage, errorMessage: errorMessage});
        })
        .catch(err => {
            console.log(err);
            res.redirect('/');
        });
});

router.get("/update/:id", isAuthenticated, (req, res) => {
    Clinic
        .findById(req.params.id)
        .populate('patients')
        .then(clinic => {
            res.render("clinics/update", {clinic: clinic, formMethod: 'PUT', successMessage: req.flash('successMessage'),
                errorMessage: req.flash('errorMessage')});
        })
        .catch(err => {
            console.log(err);
            res.redirect("/");
        });
});

router.get('/create', isAuthenticated, (req, res) => {
    res.render('clinics/create', {clinic: null, formMethod: 'POST'});
});

router.post('/', isAuthenticated, (req, res) => {
    let clinicData = new Clinic(req.body);
    clinicData._id = new mongoose.Types.ObjectId();
    clinicData
        .save((err, clinic) => {
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

router.put('/:id', isAuthenticated, (req, res) => {
    if  (!(req.params.id && req.body._id && req.params.id === req.body._id)) {
        Clinic
            .findById(req.params.id)
            .populate('patients')
            .then(clinic => {
                res.render('clinics/update', {clinic: clinic, formMethod: 'PUT',
                    errorMessage: 'Sorry, the request path id and the request body id values must match.'});
            })
            .catch(err => {
                console.error(err);
                res.status(500).json({message: "Internal server error"});
            });
    }

    Clinic
        .findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true})
        .then(() => {
            console.log('Clinic put success!');
            req.flash('successMessage', 'Clinic successfully updated!');
            res.redirect(`/clinics/show/${req.params.id}`);
        })
        .catch(err => {
            console.log('Clinic put failed');
            console.log(err);

            Clinic
                .findById(req.params.id)
                .populate('patients')
                .then(clinic => {
                    res.render('clinics/update', {clinic: clinic,
                            formMethod: 'PUT', errorMessage: 'Sorry, something went wrong. Clinic data could not be updated.'});
                })
                .catch(err => {
                    console.error(err);
                    res.status(500).json({message: "Internal server error"});
                });
        });
});

router.delete('/:id', isAuthenticated, (req, res) => {
    Clinic
        .findById(req.params.id)
        .populate('patients')
        .then(clinic => {
            clinic.remove((err, removedClinic) => {
                console.log('removedClinic:', removedClinic);
                if (err) {
                    console.log('deleteErr:', err);
                    res.render('clinics/show', {clinic: clinic, message: 'Sorry, something went wrong. Clinic could not be deleted.'});
                }
                else {
                    req.flash('successMessage', 'Clinic successfully deleted!');
                    res.redirect('/clinics');
                }
            })
            .catch(err => {
                console.log(err);
                req.flash('errorMessage', 'Internal server error');
                res.redirect('/');
            });
        });
});

module.exports = router;