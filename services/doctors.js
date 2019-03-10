'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const {Doctor} = require('../models/doctors');

function getAllDoctorsByPatientChronologically(patientId) {
    return Doctor.find({'patients': {$in: [patientId]}}).sort({'name.lastName': 1});
}

const doctorsSvc = {
    getAllDoctorsByPatientChronologically: getAllDoctorsByPatientChronologically
};

module.exports = {doctorsSvc};