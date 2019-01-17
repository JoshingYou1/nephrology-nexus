'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const {Appointment} = require('../models/appointments');

function getAllAppointmentsByPatientChronologically(patientId) {
    return Appointment.find({patient: patientId}).sort({'date': 1});
}

const appointmentsSvc = {
    getAllAppointmentsByPatientChronologically: getAllAppointmentsByPatientChronologically
}

module.exports = {appointmentsSvc};