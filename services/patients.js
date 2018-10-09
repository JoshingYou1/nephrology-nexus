'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const {Patient} = require('../models/patients');

function getAllPatientsByClinicAlphabetically(clinicId) {
    console.log('in getAllPatientsByClinicAlphabetically');
    return Patient.find({clinic: clinicId}).sort({'name.lastName': 1});
}

const patientsSvc = {
    getAllPatientsByClinicAlphabetically: getAllPatientsByClinicAlphabetically
}

module.exports = {patientsSvc};