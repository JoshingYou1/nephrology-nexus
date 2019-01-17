'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const appointmentSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    description: {type: String},
    date: {type: Date},
    time: {type: String},
    with: {type: String},
    title: {type: String},
    where: {type: String},
    address: {
        street: {type: String},
        city: {type: String},
        state: {type: String},
        zipCode: {type: Number}
    },
    phoneNumber: {type: String},
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient'
    }
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = {Appointment};