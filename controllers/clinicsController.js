"use strict";

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const {Clinic} = require("../models/clinics");

router.get("/", (req, res) => {
    Clinic
        .find()
        .then(clinics => {
            res.render("clinics/index", {clinics: clinics});
        })
        .catch(err => {
            console.log(err);
            req.flash("errorMessage", "Internal server error");
            res.redirect("/");
            res.finished = true;
            res.end();
        });
});

router.get("/show/:id", (req, res) => {
    Clinic
        .findById(req.params.id)
        .populate('patients')
        .then(clinic => {
            let successMessage = req.flash('successMessage');
            res.render("clinics/show", {clinic: clinic, successMessage: successMessage})
        })
        .catch(err => {
            console.log(err);
            req.flash('errorMessage', 'Internal server error');
            res.redirect('/');
            res.finished = true;
            res.end();
        });
});

// router.get("/:id", (req, res) => {
//     Clinic
//         .findById(req.params.id)
//         .then(clinic => {
//             res.render("clinics/show", {clinic: clinic});
//         })
//         .catch(err => {
//             console.log(err);
//             req.flash("errorMessage", "Internal server error");
//             res.redirect("/");
//         });
// });

router.get("/update/:id", (req, res) => {
    Clinic
        .findById(req.params.id)
        .populate('patients')
        .then(clinic => {
            res.render("clinics/update", {clinic: clinic, formMethod: 'PUT', successMessage: req.flash('successMessage')});
        })
        .catch(err => {
            console.log(err);
            req.flash("errorMessage", "Internal server error");
            res.redirect("/");
            res.finished = true;
            res.end();
        });
});

router.get('/create', (req, res) => {
    res.render('clinics/create', {clinic: null, formMethod: 'POST'});
});

router.post('/', (req, res) => {
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

router.put('/:id', (req, res) => {
    if  (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
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
    };
    Clinic
        .findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true})
        .then(() => {
            req.flash('successMessage', 'Clinic successfully updated!');
            res.redirect(`/clinics/show/${req.params.id}`);
            res.finished = true;
            res.end();
        })
        .catch(err => {
            console.log(err);
            res.render('clinics/update', {errorMessage: 'Sorry, something went wrong. Clinic data could not be updated.'});
        });
});

router.delete('/:id', (req, res) => {
    Clinic.findByIdAndRemove(req.params.id, err => {
        if (err) {
            Clinic
                .findById(req.params.id)
                .populate('clinics')
                .then(clinic => {
                res.render('clinics/index', {clinic: clinic, message: 'Sorry, something went wrong. Clinic could not be deleted.'});
                })
                .catch(err => {
                    console.log(err);
                    req.flash('errorMessage', 'Internal server error');
                    res.redirect('/');
            });
        }
        else {
            req.flash('successMessage', 'Clinic successfully deleted!');
            res.redirect('/clinics/index');
            res.finished = true;
            res.end()
        }
    });
});

module.exports = router;