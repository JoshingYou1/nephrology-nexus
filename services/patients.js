'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const {Patient} = require('../models/patients');

function getAllPatientsByClinicAlphabetically(clinicId) {
    return Patient.find({clinic: clinicId}).sort({'name.lastName': 1});
}

const patientsSvc = {
    getAllPatientsByClinicAlphabetically: getAllPatientsByClinicAlphabetically
}

module.exports = {patientsSvc};