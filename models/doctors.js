'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const doctorSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        firstName: {type: String},
        lastName: {type: String}
    },
    practice: {type: String},
    company: {type: String},
    address: {
        street: {type: String},
        city: {type: String},
        state: {type: String},
        zipCode: {type: Number}
    },
    phoneNumber: {type: String},
    faxNumber: {type: String},
    patients: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient'
    }]
});

const Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = {Doctor};