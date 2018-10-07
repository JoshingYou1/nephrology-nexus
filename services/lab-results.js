'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const {LabResults} = require('../models/lab-results');

function getAllLabResultsByPatientChronologically(patientId) {
    return LabResults.find({patient: patientId}).sort({'date': 1});
}

const labResultsSvc = {
    getAllLabResultsByPatientChronologically: getAllLabResultsByPatientChronologically
}

module.exports = {labResultsSvc};