"use strict";

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const patientSchema = mongoose.Schema({
    firstName: {type: String, required: true},
    middleName: String,
    lastName: {type: String, required: true},
    dateOfBirth: {type: String, required: true},
    gender: {type: String, required: true},
    socialSecurityNumber: {type: Number, required: true},
    address: {
        street: {type: String},
        city: {type: String},
        state: {type: String},
        zipcode: {type: Number}
    },
    phoneNumbers: {
        home: {type: String},
        cell: {type: String},
        work: {type: String}
    }
});

patientSchema.virtual("addressString").get(function() {
    return `Street: ${this.address.street}\n
            Address: ${this.address.city}\n
            State: ${this.address.state}\n
            Zipcode: ${this.address.zipcode}`;
});

patientSchema.virtual("phoneNumbersString").get(function() {
    return `Home: ${this.phoneNumbers.home}\n
            Cell: ${this.phoneNumbers.cell}\n
            Work: ${this.phoneNumbers.work}`;
});

patientSchema.methods.serialize() = function() {
    return {
        id: this._id,
        firstName: this.firstName,
        middleName: this.middleName,
        lastName: this.lastName,
        dateOfBirth: this.dateOfBirth,
        gender: this.gender,
        socialSecurityNumber: this.socialSecurityNumber,
        address: this.addressString,
        phoneNumbers: this.phoneNumbersString
    };
};

const clinicSchema = mongoose.Schema({
    name: {type: String, required: true},
    address: {
        street: {type: String},
        city: {type: String},
        state: {type: String},
        zipcode: {type: Number}
    },
    phoneNumber: {type: String, required: true},
    faxNumber: {type: String, required: true},
    clinicManager: {type: String, required: true}
});

clinicSchema.virtual("addressString").get(function() {
    return `Street: ${this.address.street}\n
            City: ${this.address.city}\n
            State: ${this.address.state}\n
            Zipcode: ${this.address.zipcode}`;
});

clinicSchema.methods.serialize() = function() {
    return {
        id: this._id,
        name: this.name,
        address: this.addressString,
        phoneNumber: this.phoneNumber,
        faxNumber: this.faxNumber,
        clinicManager: this.clinicManager
    };
};

const labResultsSchema = mongoose.Schema({
    hematology: {
        wbcCount: {type: Number},
        rbcCount: {type: Number},
        hemoglobin: {type: Number},
        hematocrit: {type: Number},
        plateletCount: {type: Number}
    },
    chemistry: {
        bun: {type: Number},
        creatinine: {type: Number},
        sodium: {type: Number},
        potassium: {type: Number},
        calcium: {type: Number},
        phosphorus: {type: Number},
        albumin: {type: Number},
        glucose: {type: Number},
        iron: {type: Number},
        cholesterol: {type: Number},
        triglycerides: {type: Number}
    }
});

labResultsSchema.virtual("hematologyString").get(function() {
    return `WBC Count: ${this.hematology.wbcCount}\n
            RBC Count: ${this.hematology.rbcCount}\n
            Hemoglobin: ${this.hematology.hemoglobin}\n
            Hematocrit: ${this.hematology.hematocrit}\n
            Platelet Count: ${this.hematology.plateletCount}`;
});

labResultsSchema.virtual("chemistryString").get(function() {
    return `BUN: ${this.chemistry.bun}\n
            Creatinine: ${this.chemistry.creatinine}\n
            Sodium: ${this.chemistry.sodium}\n
            Potassium: ${this.chemistry.potassium}\n
            Calcium: ${this.chemistry.calcium}\n
            Phosporus: ${this.chemistry.phosphorus}\n
            Albumin: ${this.chemistry.albumin}\n
            Glucose: ${this.chemistry.glucose}\n
            Iron: ${this.chemistry.iron}\n
            Cholesterol${this.chemistry.cholesterol}\n
            Triglycerides: ${this.chemistry.triglycerides}`
});

const Patient = mongoose.model("Patient", patientSchema);
const Clinic = mongoose.model("Clinic", clinicSchema);
const LabResults = mongoose.model("LabResults", labResultsSchema);

module.exports = {Patient, Clinic, LabResults};