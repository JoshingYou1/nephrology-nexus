'use strict';

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const passport = require('passport');
const bodyParser = require('body-parser');
const {Doctor} = require('../../models/api/doctors')
const jwtAuth = passport.authenticate('jwt', {session: false});
const {doctorsSvc} = require('../../services/doctors');
const {Patient} = require('../../models/patients');

router.get('/', function(req, res) {
    doctorsSvc.getAllDoctorsByPatientChronologically(req.patientId)
        .then(function(doctors) {
            res.json(doctors);
        });
});

router.post('/', jwtAuth, bodyParser.json(), function(req, res) {
    if (typeof Number(req.body.address.zipCode) !== 'number') {
        return res.status(400).json({
            message: 'Incorrect field type',
            reason: 'ValidationError',
            location: 'address.zipCode'
        });
    }
    let doctorData = new Doctor(req.body);
    doctorData._id = new mongoose.Types.ObjectId();
    doctorData.patients = [mongoose.Types.ObjectId(req.patientId)];
    doctorData
        .save(function(err, doctor) {
            if (err) {
                console.log(err);
            }
            Patient
                .update({_id: req.patientId}, {$push: {doctors: doctor}})
                .then(() => {
                res.status(201).json(doctor);
            });
        });
    return res.status(204);
});

router.put('/:id', jwtAuth, bodyParser.json(), function(req,res) {
    if (!(req.params.id && req.body._id && req.params.id === req.body._id)) {
        res.status(400).json({
          error: 'Request path id and request body id values must match'
        });
    }

    if (typeof Number(req.body.address.zipCode) !== 'number') {
        return res.status(400).json({
            message: 'Incorrect field type',
            reason: 'ValidationError',
            location: 'address.zipCode'
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
            res.status(200).json(updatedDoctor);
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