'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const {Clinic} = require('../models/clinics');

function getAllClinicsAlphabetically() {
    return Clinic.find().sort({name: 1});
}
const clinicsSvc = {
    getAllClinicsAlphabetically: getAllClinicsAlphabetically
}

module.exports = {clinicsSvc};