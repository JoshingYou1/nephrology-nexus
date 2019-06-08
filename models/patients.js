'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
let bcrypt = require('bcryptjs');
const {LabResults} = require('./lab-results');


const patientSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
    firstName: {type: String, required: true},
    lastName: {type: String, required: true}
    },
    dateOfBirth: {type: Date, required: true},
    sex: {type: String, required: true},
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
    primaryInsurance: {
        insuranceCompany: {type: String, required: true},
        nameOfCardHolder: {
            firstName: {type: String, required: true},
            lastName: {type: String, required: true}
        },
        policyNumber: {type: Number, required: true},
        dateOfBirthOfCardHolder: {type: String, required: true},
        socialSecurityNumberOfCardHolder: {type: String, required: true}
    },
    secondaryInsurance: {
        insuranceCompany: {type: String},
        nameOfCardHolder: {
            firstName: {type: String},
            lastName: {type: String}
        },
        policyNumber: {type: Number},
        dateOfBirthOfCardHolder: {type: String},
        socialSecurityNumberOfCardHolder: {type: String}
    },
    treatmentDays: {type: String},
    treatmentTime: {type: String},
    clinic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Clinic'
    },
    labResults: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LabResults'
    }],
    appointments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment'
    }],
    doctors: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor'
    }],
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    } 
});

patientSchema.methods.serialize = function() {
    return {
        id: this._id,
        username: this.username
    };
}

patientSchema.methods.validatePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

patientSchema.methods.hashPassword = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(11), null);
};

patientSchema.pre('remove', function(next) {
    LabResults.deleteMany({_id: {$in: this.labResults}}).exec();
    next();
})

patientSchema.virtual('patientName').get(function() {
    return `${this.name.lastName}, ${this.name.firstName}`;
});

patientSchema.virtual('formatSsn').get(function() {
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

patientSchema.virtual('emptyHomePhoneValue').get(function() {
    return this.phoneNumbers.home ? this.phoneNumbers.home : 'N/A';
});

patientSchema.virtual('emptyCellPhoneValue').get(function() {
    return this.phoneNumbers.cell ? this.phoneNumbers.cell : 'N/A';
});

patientSchema.virtual('emptyWorkPhoneValue').get(function() {
    return this.phoneNumbers.work ? this.phoneNumbers.work : 'N/A';
});

const Patient = mongoose.model('Patient', patientSchema);

module.exports = {Patient};