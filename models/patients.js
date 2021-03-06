'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
let bcrypt = require('bcryptjs');
const {LabResults} = require('./lab-results');
const SALT_WORK_FACTOR = 10;


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
        dateOfBirthOfCardHolder: {type: Date, required: true},
        socialSecurityNumberOfCardHolder: {type: String, required: true}
    },
    secondaryInsurance: {
        insuranceCompany: {type: String},
        nameOfCardHolder: {
            firstName: {type: String},
            lastName: {type: String}
        },
        policyNumber: {type: Number},
        dateOfBirthOfCardHolder: {type: Date},
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
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

patientSchema.pre('save', function (next) {
    const patient = this;
    if (patient.password === undefined) {
        return next();
    }
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) {
            console.log(err);
        }
        bcrypt.hash(patient.password, salt, function (err, hash) {
            if (err) {
                console.log(err);
            }
            patient.password = hash;
            next();
        });
    });
});

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

patientSchema.virtual('formatPrimaryInsuranceSsn').get(function() {
    return `${this.primaryInsurance.socialSecurityNumberOfCardHolder[0]}${this.primaryInsurance.socialSecurityNumberOfCardHolder[1]}${this.primaryInsurance.socialSecurityNumberOfCardHolder[2]}-${this.primaryInsurance.socialSecurityNumberOfCardHolder[3]}${this.primaryInsurance.socialSecurityNumberOfCardHolder[4]}-${this.primaryInsurance.socialSecurityNumberOfCardHolder[5]}${this.primaryInsurance.socialSecurityNumberOfCardHolder[6]}${this.primaryInsurance.socialSecurityNumberOfCardHolder[7]}${this.primaryInsurance.socialSecurityNumberOfCardHolder[8]}`;
});

patientSchema.virtual('formatSecondaryInsuranceSsn').get(function() {
    return `${this.secondaryInsurance.socialSecurityNumberOfCardHolder[0]}${this.secondaryInsurance.socialSecurityNumberOfCardHolder[1]}${this.secondaryInsurance.socialSecurityNumberOfCardHolder[2]}-${this.secondaryInsurance.socialSecurityNumberOfCardHolder[3]}${this.secondaryInsurance.socialSecurityNumberOfCardHolder[4]}-${this.secondaryInsurance.socialSecurityNumberOfCardHolder[5]}${this.secondaryInsurance.socialSecurityNumberOfCardHolder[6]}${this.secondaryInsurance.socialSecurityNumberOfCardHolder[7]}${this.secondaryInsurance.socialSecurityNumberOfCardHolder[8]}`;
});

patientSchema.virtual('formatHtml5BirthDate').get(function()  {
    let day = this.dateOfBirth.getUTCDate();
    if (day < 10) {
        day = `0${day}`
    }
    let month = this.dateOfBirth.getUTCMonth() + 1;
    if (month < 10) {
        month = `0${month}`;
    }
    const year = this.dateOfBirth.getUTCFullYear();
    return `${year}-${month}-${day}`;
});

patientSchema.virtual('formatBirthDate').get(function()  {
    let day = this.dateOfBirth.getUTCDate();
    if (day < 10) {
        day = `0${day}`
    }
    let month = this.dateOfBirth.getUTCMonth() + 1;
    if (month < 10) {
        month = `0${month}`;
    }
    const year = this.dateOfBirth.getUTCFullYear();
    return `${month}/${day}/${year}`;
});

patientSchema.virtual('formatHtml5PrimaryInsuranceBirthDate').get(function()  {
    let day = this.primaryInsurance.dateOfBirthOfCardHolder.getUTCDate();
    if (day < 10) {
        day = `0${day}`
    }
    let month = this.primaryInsurance.dateOfBirthOfCardHolder.getUTCMonth() + 1;
    if (month < 10) {
        month = `0${month}`;
    }
    const year = this.primaryInsurance.dateOfBirthOfCardHolder.getUTCFullYear();
    return `${year}-${month}-${day}`;
});

patientSchema.virtual('formatPrimaryInsuranceBirthDate').get(function()  {
    let day = this.primaryInsurance.dateOfBirthOfCardHolder.getUTCDate();
    if (day < 10) {
        day = `0${day}`
    }
    let month = this.primaryInsurance.dateOfBirthOfCardHolder.getUTCMonth() + 1;
    if (month < 10) {
        month = `0${month}`;
    }
    const year = this.primaryInsurance.dateOfBirthOfCardHolder.getUTCFullYear();
    return `${month}/${day}/${year}`;
});

patientSchema.virtual('formatHtml5SecondaryInsuranceBirthDate').get(function()  {
    let day = this.secondaryInsurance.dateOfBirthOfCardHolder.getUTCDate();
    if (day < 10) {
        day = `0${day}`
    }
    let month = this.secondaryInsurance.dateOfBirthOfCardHolder.getUTCMonth() + 1;
    if (month < 10) {
        month = `0${month}`;
    }
    const year = this.secondaryInsurance.dateOfBirthOfCardHolder.getUTCFullYear();
    return `${year}-${month}-${day}`;
});

patientSchema.virtual('formatSecondaryInsuranceBirthDate').get(function()  {
    let day = this.secondaryInsurance.dateOfBirthOfCardHolder.getUTCDate();
    if (day < 10) {
        day = `0${day}`
    }
    let month = this.secondaryInsurance.dateOfBirthOfCardHolder.getUTCMonth() + 1;
    if (month < 10) {
        month = `0${month}`;
    }
    const year = this.secondaryInsurance.dateOfBirthOfCardHolder.getUTCFullYear();
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