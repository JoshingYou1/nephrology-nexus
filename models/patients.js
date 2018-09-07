"use strict";

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const patientSchema = mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    dateOfBirth: {type: String, required: true},
    gender: {type: String, required: true},
    socialSecurityNumber: {type: String, required: true},
    address: {
        street: {type: String},
        city: {type: String},
        state: {type: String},
        zipCode: {type: Number}
    },
    phoneNumbers: {
        home: {type: String},
        cell: {type: String},
        work: {type: String}
    }
});

patientSchema.virtual("addressString").get(function() {
    return `${this.address.street}\n
            ${this.address.city}, ${this.address.state} ${this.address.zipCode}`;
});

patientSchema.virtual("phoneNumbersString").get(function() {
    return `Home: ${this.phoneNumbers.home}\n
            Cell: ${this.phoneNumbers.cell}\n
            Work: ${this.phoneNumbers.work}`;
});

patientSchema.methods.serialize = function() {
    return {
        id: this._id,
        firstName: this.firstName,
        lastName: this.lastName,
        dateOfBirth: this.dateOfBirth,
        gender: this.gender,
        socialSecurityNumber: this.socialSecurityNumber,
        address: this.addressString,
        phoneNumbers: this.phoneNumbersString
    };
};

const Patient = mongoose.model("Patient", patientSchema);

module.exports = {Patient};