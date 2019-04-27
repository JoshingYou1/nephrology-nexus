'use strict';

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const passport = require('passport');
const {Appointment} = require('../../models/api/appointments');
const bodyParser = require('body-parser');
const {appointmentsSvc} = require('../../services/appointments');
const jwtAuth = passport.authenticate('jwt', {session: false});
const moment = require('moment');


router.get('/', jwtAuth, function(req, res) {
    appointmentsSvc.getAllAppointmentsByPatientChronologically(req.patientId)
        .then(function(appointments) {
            res.json(appointments);
        });
});

router.post('/', jwtAuth, bodyParser.json(), function(req, res) {
    if (!moment.isDate(new Date(req.body.date))) {
        console.log('req.body.date', req.body.date);
        return res.status(400).json({
            message: 'Incorrect field type',
            reason: 'ValidationError',
            location: 'date'
        });
    }
    else if (typeof Number(req.body.address.zipCode) !== 'number') {
        console.log('req.body.address.zipCode', req.body.address.zipCode);
        return res.status(400).json({
            message: 'Incorrect field type',
            reason: 'ValidationError',
            location: 'address.zipCode'
        });
    }
    else {
        console.log(req.body);
    }
    
    let appointmentData = new Appointment(req.body);
    appointmentData._id = new mongoose.Types.ObjectId();
    appointmentData.patient = mongoose.Types.ObjectId(req.patientId);
    appointmentData
        .save(function(err, appointment) {
            if (err) {
                res.status(400).json(err);
                console.log(err);
            }
            res.status(201).json(appointment);
        });
    return res.status(204);
});

router.put('/:id', jwtAuth, bodyParser.json(), function(req,res) {
    if (!(req.params.id && req.body._id && req.params.id === req.body._id)) {
        res.status(400).json({
          error: 'Request path id and request body id values must match'
        });
    }

    if (!moment.isDate(new Date(req.body.date))) {
        console.log('req.body.date', req.body.date);
        return res.status(400).json({
            message: 'Incorrect field type',
            reason: 'ValidationError',
            location: 'date'
        });
    }
    else if (typeof Number(req.body.address.zipCode) !== 'number') {
        console.log('req.body.address.zipCode', req.body.address.zipCode);
        return res.status(400).json({
            message: 'Incorrect field type',
            reason: 'ValidationError',
            location: 'address.zipCode'
        });
    }
    else {
        console.log(req.body);
    }

    const updated = {};
    const updateableFields = ['description', 'date', 'time', 'with', 'title', 'where', 'address', 'phoneNumber'];
    updateableFields.forEach(field => {
        if (field in req.body) {
        updated[field] = req.body[field];
        }
    });

    Appointment
        .findByIdAndUpdate(req.params.id, { $set: updated }, { new: true })
        .then(updatedAppointment => {
            res.status(200).json(updatedAppointment);
        })
        .catch(err => {
            res.status(500).json({ message: 'Something went wrong' });
        });

    return res.status(204);
});

router.delete('/:id', jwtAuth, bodyParser.json(), function(req,res) {
    Appointment
      .findByIdAndRemove(req.params.id)
      .then(() => {
        res.status(204).json({ message: 'Appointment successfully deleted' });
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong' });
      });
  });

module.exports = router;