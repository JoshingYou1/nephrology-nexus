"use strict";

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

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

const LabResults = mongoose.model("LabResults", labResultsSchema);

module.exports = {LabResults};