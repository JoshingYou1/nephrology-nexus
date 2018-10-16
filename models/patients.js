"use strict";

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const {LabResults} = require('./lab-results');


const patientSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
    firstName: {type: String, required: true},
    lastName: {type: String, required: true}
    },
    dateOfBirth: {type: Date, required: true},
    gender: {type: String, required: true},
    socialSecurityNumber: {type: String, required: true},
    address: {
        street: {type: String, required: true},
        city: {type: String, required: true},
        state: {type: String, required: true},
        zipCode: {type: Number, required: true}
    },
    phoneNumbers: {
        home: {type: String},
        cell: {type: String},
        work: {type: String}
    },
    clinic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Clinic'
    },
    labResults: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LabResults'
    }]
});

patientSchema.pre('remove', function(next) {
    console.log('We in here');
    LabResults.deleteMany({_id: {$in: this.labResults}}).exec();
    next();
})

patientSchema.virtual("patientName").get(function() {
    return `${this.name.lastName}, ${this.name.firstName}`;
});

patientSchema.virtual("formatSsn").get(function() {
    return `${this.socialSecurityNumber[0]}${this.socialSecurityNumber[1]}${this.socialSecurityNumber[2]}-${this.socialSecurityNumber[3]}${this.socialSecurityNumber[4]}-${this.socialSecurityNumber[5]}${this.socialSecurityNumber[6]}${this.socialSecurityNumber[7]}${this.socialSecurityNumber[8]}`;
});

patientSchema.virtual('formatHtml5BirthDate').get(function()  {
    let day = this.dateOfBirth.getDate();
    if (day < 10) {
        day = `0${day}`
    }
    let month = this.dateOfBirth.getMonth() + 1;
    if (month < 10) {
        month = `0${month}`;
    }
    const year = this.dateOfBirth.getFullYear();
    return `${year}-${month}-${day}`;
});

patientSchema.virtual('formatBirthDate').get(function()  {
    let day = this.dateOfBirth.getDate();
    if (day < 10) {
        day = `0${day}`
    }
    let month = this.dateOfBirth.getMonth() + 1;
    if (month < 10) {
        month = `0${month}`;
    }
    const year = this.dateOfBirth.getFullYear();
    return `${month}/${day}/${year}`;
});

const Patient = mongoose.model("Patient", patientSchema);

module.exports = {Patient};