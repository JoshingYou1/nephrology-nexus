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

labResultsSchema.virtual('formatHtml5Date').get(function()  {
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

labResultsSchema.virtual('formatDate').get(function()  {
    let day = this.date.getDate();
    if (day < 10) {
        day = `0${day}`
    }
    let month = this.date.getMonth() + 1;
    if (month < 10) {
        month = `0${month}`;
    }
    const year = this.date.getFullYear();
    return `${month}/${day}/${year}`;
})

const LabResults = mongoose.model("LabResults", labResultsSchema);

module.exports = {LabResults};