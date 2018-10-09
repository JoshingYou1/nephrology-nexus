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
console.log('patientsId[0]:', patientsIdArray[0]);
const clinicsIdArray = getIds();
const labResultsIdArray = getIds();
console.log('labResultsId[0]:', labResultsIdArray[0]);

const patients = [
    new Patient({
        _id: patientsIdArray[0],
        name: {
            firstName: "Random",
            lastName: "Jones"
        },
        dateOfBirth: "05/12/1968",
        gender: "Male",
        socialSecurityNumber: "127-37-1989",
        address: {
            street: "123 International Drive",
            city: "Jacksonville",
            state: "Florida",
            zipCode: "39190"
        },
        phoneNumbers: {
            home: "904-223-1223",
            cell: "904-212-3312",
            work: null
        },
        labResults: [
            labResultsIdArray[0]
        ],
        clinic: clinicsIdArray[0]
    }),
]

const clinics = [
    {
        _id: clinicsIdArray[0],
        name: "Random Dialysis Center",
        address: {
            street: "21 Maple Street",
            city: "Jacksonville",
            state: "Florida",
            zipCode: "32034"
        },
        phoneNumber: "904-293-7502",
        faxNumber: "904-293-9342",
        clinicManager: {
            firstName: "Sally",
            lastName: "Simpson"
        },
        patients: [
            patients[0]._id
        ]
    },
]

const labResults = [
    new LabResults({
        _id: labResultsIdArray[0],
        date: "05/23/2012",
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
    })
]

exec()
    .then(() => {
        console.log('successfully ran program');
        process.exit(0);
    })
    .catch(error => {
        console.error(`Error: ${error}\n${error.stack}`);
    });

function exec() {
    return co(function* () {
        const db = mongoose.createConnection(config.DATABASE_URL);
    
        // TODO: figure out if we can/how to use the model from the model files
        // make patient schema for this db connection
        const patient = db.model('Patient', Patient.schema);
    
        //make clinic schema for this db connection
        const clinic = db.model('Clinic', Clinic.schema);
    
        //make lab results schema for this db connection
        const labResult = db.model('LabResults', LabResults.schema);
    
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
