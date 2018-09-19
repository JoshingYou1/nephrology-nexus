"use strict";

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const flash = require("req-flash");
const session = require("express-session");
const bodyParser = require("body-parser");
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
            res.redirect(500, "/");
        });
});

router.get("/:id", (req, res) => {
    Clinic
        .findById(req.params.id)
        .then(clinic => {
            res.render("clinics/show", {clinic: clinic});
        })
        .catch(err => {
            console.log(err);
            req.flash("errorMessage", "Internal server error");
            res.redirect(500, "/");
        });
});

router.get("/:id/update", (req, res) => {
    Clinic
        .findById(req.params.id)
        .then(clinic => {
            res.render("clinics/update", {clinic: clinic, formMethod: "put"});
        })
        .catch(err => {
            console.log(err);
            req.flash("errorMessage", "Internal server error");
            res.redirect(500, "/");
        });
});

router.get('/create', (req, res) => {
    res.render('clinics/create', {clinic: null, formMethod: 'post'});
});

router.post('/', (req, res) => {
    let clinicData = new Clinic(req.body);
    clinicData.save((err, clinic) => {
        if (err) {
            res.render('clinics/create', {message: 'Sorry, your request was invalid.'});
        }
        else {
            req.flash('successMessage', 'Clinic successfully created!');
            res.redirect(201, `/clinics/show/${clinic._id}`);
        };
    });
});

router.put('/:id', (req, res) => {
    if  (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
        res.render('clinics/update', {message: 'Sorry, the request path id and the request body id values must match.'});
    };
    Clinic.findByIdAndUpdate(req.params.id, req.body, {new: true}, err => {
        if (err) {
            res.render('clinics/update', {message: 'Sorry, something went wrong. Clinic data could not be updated.'});
        }
        else {
            req.flash('successMessage', 'Clinic successfully updated!');
            res.redirect(204, `/clinics/update/${res._id}`);
        };
    });
});

router.delete('/:id', (req, res) => {
    Clinic.findByIdAndRemove(req.params.id, err => {
        if (err) {
            res.render('clinics/index', {message: 'Sorry, something went wrong. Clinic could not be deleted.'});
        }
        else {
            req.flash('successMessage', 'Clinic successfully deleted!');
            res.redirect(204, '/clinics/index');
        };
    });
});

module.exports = router;