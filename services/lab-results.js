'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const {LabResults} = require('../models/lab-results');

function getAllLabResultsByPatientChronologically() {
    return LabResults.find({patient: patientId}).sort({'name.lastName': 1});
}