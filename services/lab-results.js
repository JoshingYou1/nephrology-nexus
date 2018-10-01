'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const {LabResults} = require('../models/lab-results');

function getAllLabResultsByPatientChronologically() {
    return LabResults.find({clinic: clinicId}).sort({'name.lastName': 1});
}