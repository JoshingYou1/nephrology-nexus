'use strict';

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const passport = require('passport');
const bodyParser = require('body-parser');
const {Doctor} = require('../../models/doctors')
const jwtAuth = passport.authenticate('jwt', {session: false});

router.post('/', jwtAuth, function(req, res) {
    if (typeof req.body.name.firstName !== 'string') {
        return res.status(400).json({
            message: 'Incorrect field type',
            reason: 'ValidationError',
            location: 'name.firstName'
        });
    }
    // else if () {

    // }
    let doctorData = new Doctor(req.body);
    doctorData._id = new mongoose.Types.ObjectId();
    doctorData
        .save(function(err, doctor) {
            if (err) {
                console.log(err);
            }
            res.status(201).json(doctor);
        });
    return res.status(204);
});

router.put('/:id', jwtAuth, bodyParser.json(), function(req,res) {
    if (!(req.params.id && req.body._id && req.params.id === req.body._id)) {
        res.status(400).json({
          error: 'Request path id and request body id values must match'
        });
    }

    if (typeof req.body.name.firstName !== 'string') {
        return res.status(400).json({
            message: 'Incorrect field type',
            reason: 'ValidationError',
            location: 'name.firstName'
        });
    }

    const updated = {};
    const updateableFields = ['name', 'practice', 'company', 'address', 'phoneNumber', 'faxNumber'];
    updateableFields.forEach(field => {
        if (field in req.body) {
        updated[field] = req.body[field];
        }
    });

    Doctor
        .findByIdAndUpdate(req.params.id, { $set: updated }, { new: true })
        .then(updatedDoctor => {
            res.status(204).end();
        })
        .catch(err => {
            res.status(500).json({ message: 'Something went wrong' });
        });

    return res.status(204);
});

router.delete('/:id', jwtAuth, bodyParser.json(), function(req,res) {
    Doctor
      .findByIdAndRemove(req.params.id)
      .then(() => {
        res.status(204).json({ message: 'Doctor successfully deleted' });
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong' });
      });
  });

module.exports = router;