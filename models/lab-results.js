"use strict";

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const labResultsSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    date: {type: Date, required: true},
    hematology: {
        wbcCount: {type: Number, required: true},
        rbcCount: {type: Number, required: true},
        hemoglobin: {type: Number, required: true},
        hematocrit: {type: Number, required: true},
        plateletCount: {type: Number, required: true}
    },
    chemistry: {
        bun: {type: Number, required: true},
        creatinine: {type: Number, required: true},
        sodium: {type: Number, required: true},
        potassium: {type: Number, required: true},
        calcium: {type: Number, required: true},
        phosphorus: {type: Number, required: true},
        albumin: {type: Number, required: true},
        glucose: {type: Number, required: true},
        iron: {type: Number, required: true},
        cholesterol: {type: Number, required: true},
        triglycerides: {type: Number, required: true}
    },
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient'
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
            Cholesterol: ${this.chemistry.cholesterol}\n
            Triglycerides: ${this.chemistry.triglycerides}`
});

const LabResults = mongoose.model("LabResults", labResultsSchema);

labResultsSchema.methods.serialize = function() {
    return {
        id: this._id,
        date: this.date,
        hematology: this.hematologyString,
        chemistry: this.chemistryString
    };
};

module.exports = {LabResults};