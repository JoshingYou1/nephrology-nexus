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

appointmentSchema.virtual('formatHtml5Date').get(function()  {
    let day = this.date.getDate();
    if (day < 10) {
        day = `0${day}`
    }
    let month = this.date.getMonth() + 1;
    if (month < 10) {
        month = `0${month}`;
    }
    const year = this.date.getFullYear();
    return `${year}-${month}-${day}`;
})

appointmentSchema.methods.serialize = function() {
    return {
        id: this._id,
        description: this.description,
        date: this.formatHtml5Date,
        // date: this.date,
        time: this.time,
        with: this.with,
        title: this.title,
        where: this.where,
        address: this.address,
        phoneNumber: this.phoneNumber,
        patient: this.patient

    };
}

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = {Appointment};