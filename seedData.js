'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const config = require('./config');
mongoose.connect(config.DATABASE_URL);
console.log(config.DATABASE_URL);
const co = require('co');

const {Patient} = require('./models/patients');
const {Clinic} = require('./models/clinics');
const {LabResults} = require('./models/lab-results');

mongoose.set('debug', true);

function getIds() {
    let arr = [];
    for (let i = 0; i < 5; i++) {
        arr.push(new mongoose.Types.ObjectId());
    }
    return arr;
}

const patientsIdArray = getIds();
const clinicsIdArray = getIds();
const labResultsIdArray = getIds();

const patients = [
    new Patient({
        _id: patientsIdArray[0],
        name: {
            firstName: 'Robert',
            lastName: 'Jones'
        },
        dateOfBirth: '05/12/1968',
        sex: 'Male',
        socialSecurityNumber: '127371989',
        address: {
            street: '123 International Drive',
            city: 'Jacksonville',
            state: 'FL',
            zipCode: '39190'
        },
        phoneNumbers: {
            home: '904-223-1223',
            cell: '904-212-3312',
            work: null
        },
        labResults: [
            labResultsIdArray[0]
        ],
        clinic: clinicsIdArray[0]
    }),
    new Patient({
        _id: patientsIdArray[1],
        name: {
            firstName: 'Betty',
            lastName: 'Crocker'
        },
        dateOfBirth: '08/02/1951',
        sex: 'Female',
        socialSecurityNumber: '380748274',
        address: {
            street: '456 Colonial Drive',
            city: 'Orange Park',
            state: 'FL',
            zipCode: '38271'
        },
        phoneNumbers: {
            home: '904-923-0092',
            cell: null,
            work: null
        },
        labResults: [
            labResultsIdArray[1]
        ],
        clinic: clinicsIdArray[0]
    }),
    new Patient({
        _id: patientsIdArray[2],
        name: {
            firstName: 'Michael',
            lastName: 'Williams'
        },
        dateOfBirth: '02/17/1974',
        sex: 'Male',
        socialSecurityNumber: '002385372',
        address: {
            street: '798 Wallaby Way',
            city: 'Jacksonville',
            state: 'FL',
            zipCode: '39123'
        },
        phoneNumbers: {
            home: '904-828-8211',
            cell: '904-912-9233',
            work: '904-903-1283'
        },
        labResults: [
            labResultsIdArray[2]
        ],
        clinic: clinicsIdArray[1]
    }),
    new Patient({
        _id: patientsIdArray[3],
        name: {
            firstName: 'Meredith',
            lastName: 'Edwards'
        },
        dateOfBirth: '03/09/1948',
        sex: 'Female',
        socialSecurityNumber: '378472109',
        address: {
            street: '932 Long Leaf Road',
            city: 'Jacksonville',
            state: 'FL',
            zipCode: '30919'
        },
        phoneNumbers: {
            home: '904-021-8774',
            cell: '904-875-9239',
            work: null
        },
        labResults: [
            labResultsIdArray[3]
        ],
        clinic: clinicsIdArray[2]
    }),
    new Patient({
        _id: patientsIdArray[4],
        name: {
            firstName: 'David',
            lastName: 'Baker'
        },
        dateOfBirth: '11/30/1943',
        sex: 'Male',
        socialSecurityNumber: '938848321',
        address: {
            street: '22 West Monument Road',
            city: 'Jacksonville',
            state: 'FL',
            zipCode: '32932'
        },
        phoneNumbers: {
            home: null,
            cell: null,
            work: null
        },
        labResults: [
            labResultsIdArray[4]
        ],
        clinic: clinicsIdArray[3]
    })
]

const clinics = [
    {
        _id: clinicsIdArray[0],
        name: 'North Florida Dialysis',
        address: {
            street: '21 Maple Street',
            city: 'Jacksonville',
            state: 'FL',
            zipCode: '32034'
        },
        phoneNumber: '904-293-7502',
        faxNumber: '904-293-9342',
        clinicManager: {
            firstName: 'Sally',
            lastName: 'Simpson'
        },
        patients: [
            patients[0]._id,
            patients[1]._id
        ]
    },
    {
        _id: clinicsIdArray[1],
        name: 'First Coast Dialysis',
        address: {
            street: '847 Jefferson Lane',
            city: 'Jacksonville',
            state: 'FL',
            zipCode: '37462'
        },
        phoneNumber: '904-838-3848',
        faxNumber: '904-838-9833',
        clinicManager: {
            firstName: 'Rich',
            lastName: 'Paul'
        },
        patients: [
            patients[2]._id
        ]
    },
    {
        _id: clinicsIdArray[2],
        name: 'Dialysis, Inc.',
        address: {
            street: '3 Washington Street',
            city: 'Orange Park',
            state: 'FL',
            zipCode: '38721'
        },
        phoneNumber: '904-129-7734',
        faxNumber: '904-129-1028',
        clinicManager: {
            firstName: 'Jack',
            lastName: 'Johnson'
        },
        patients: [
            patients[3]._id
        ]
    },
    {
        _id: clinicsIdArray[3],
        name: 'Duval Dialysis Center',
        address: {
            street: '23 West Sunset Road',
            city: 'Jacksonville',
            state: 'FL',
            zipCode: '34531'
        },
        phoneNumber: '904-933-2344',
        faxNumber: '904-933-2938',
        clinicManager: {
            firstName: 'Mary',
            lastName: 'Maxwell'
        },
        patients: [
            patients[4]._id
        ]
    },
    {
        _id: clinicsIdArray[4],
        name: 'East Jacksonville Dialysis',
        address: {
            street: '37 Beaches Boulevard',
            city: 'Jacksonville',
            state: 'FL',
            zipCode: '30923'
        },
        phoneNumber: '904-453-2553',
        faxNumber: '904-453-9212',
        clinicManager: {
            firstName: 'Jerry',
            lastName: 'McNabb'
        }
    }
]

const labResults = [
    new LabResults({
        _id: labResultsIdArray[0],
        date: '05/23/2012',
        hematology: {
            wbcCount: 5.97,
            rbcCount: 4.28,
            hemoglobin: 11.1,
            hematocrit: 33.8,
            plateletCount: 207
        },
        chemistry: {
            bun: 44,
            creatinine: 8.42,
            sodium: 137,
            potassium: 4.1,
            calcium: 10.3,
            phosphorus: 4.6,
            albumin: 4.2,
            glucose: 184,
            iron: 67,
            cholesterol: 194,
            triglycerides: 439
        },
        patient: patientsIdArray[0]
    }),
    new LabResults({
        _id: labResultsIdArray[1],
        date: '07/02/2012',
        hematology: {
            wbcCount: 7.32,
            rbcCount: 5.76,
            hemoglobin: 14.8,
            hematocrit: 44.4,
            plateletCount: 362
        },
        chemistry: {
            bun: 5,
            creatinine: 6.93,
            sodium: 123,
            potassium: 3.7,
            calcium: 7.5,
            phosphorus: 2.9,
            albumin: 5.4,
            glucose: 97,
            iron: 132,
            cholesterol: 152,
            triglycerides: 65
        },
        patient: patientsIdArray[1]
    }),
    new LabResults({
        _id: labResultsIdArray[2],
        date: '11/15/2012',
        hematology: {
            wbcCount: 7.87,
            rbcCount: 4.55,
            hemoglobin: 10.8,
            hematocrit: 44.1,
            plateletCount: 244
        },
        chemistry: {
            bun: 23,
            creatinine: 5.98,
            sodium: 168,
            potassium: 4.9,
            calcium: 7.4,
            phosphorus: 3.1,
            albumin: 2.9,
            glucose: 154,
            iron: 187,
            cholesterol: 43,
            triglycerides: 65
        },
        patient: patientsIdArray[2]
    }),
    new LabResults({
        _id: labResultsIdArray[3],
        date: '09/29/2012',
        hematology: {
            wbcCount: 9.65,
            rbcCount: 3.98,
            hemoglobin: 15.8,
            hematocrit: 47.4,
            plateletCount: 335
        },
        chemistry: {
            bun: 23,
            creatinine: 3.76,
            sodium: 96,
            potassium: 3.2,
            calcium: 9.8,
            phosphorus: 2.9,
            albumin: 5.1,
            glucose: 143,
            iron: 231,
            cholesterol: 253,
            triglycerides: 54
        },
        patient: patientsIdArray[3]
    }),
    new LabResults({
        _id: labResultsIdArray[4],
        date: '6/19/2012',
        hematology: {
            wbcCount: 6.42,
            rbcCount: 4.79,
            hemoglobin: 10.6,
            hematocrit: 29.4,
            plateletCount: 193
        },
        chemistry: {
            bun: 39,
            creatinine: 8.87,
            sodium: 121,
            potassium: 4.8,
            calcium: 11.1,
            phosphorus: 5.2,
            albumin: 5.1,
            glucose: 134,
            iron: 79,
            cholesterol: 210,
            triglycerides: 186
        },
        patient: patientsIdArray[4]
    })
]

exec()
    .then(function() {
        console.log('Successfully ran program');
        process.exit(0);
    })
    .catch(function(error) {
        console.error(`Error: ${error}\n${error.stack}`);
    });

function exec() {
    return co(function* () {
        const db = mongoose.createConnection(config.DATABASE_URL);
        const patient = db.model('Patient', Patient.schema);
        // clear the patients collection
        console.log('Removing patients collection');
        yield patient.remove();
    
        //make clinic schema for this db connection
        const clinic = db.model('Clinic', Clinic.schema);
        // clear the clinics collection
        console.log('Removing clinics collection');
        yield clinic.remove();
        //make lab results schema for this db connection
        const labResult = db.model('LabResults', LabResults.schema);
        // clear the lab results collection
        console.log('Removing lab results collection');
        yield labResult.remove();
    
        // seed the patient data
        console.log('Seeding patients..');
        yield patient.insertMany(patients).then(() => ({ ok: 1 }));
        console.log('Patients successfully imported!');
        // seed the clinic data
        console.log('Seeding clinics..');
        yield clinic.insertMany(clinics).then(() => ({ ok: 1 }));
        console.log('Clinics successfully imported!');
         // seed the lab results
        console.log('Seeding lab results..');
        yield labResult.insertMany(labResults).then(() => ({ ok: 1 }));
        console.log('Lab results successfully imported!');
    
        console.log('~Data successfully imported~');
    });
}

