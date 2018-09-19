"use strict";

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const patientSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
    firstName: {type: String, required: true},
    lastName: {type: String, required: true}
    },
    dateOfBirth: {type: String, required: true},
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
    labResults: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LabResults'
    }]
});

patientSchema.virtual("patientName").get(function() {
    return `${this.name.lastName}, ${this.name.firstName}`;
})

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
        name: this.patientName,
        dateOfBirth: this.dateOfBirth,
        gender: this.gender,
        socialSecurityNumber: this.socialSecurityNumber,
        address: this.addressString,
        phoneNumbers: this.phoneNumbersString
    };
};

const Patient = mongoose.model("Patient", patientSchema);

module.exports = {Patient};