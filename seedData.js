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
const {User} = require('./models/users');
const {Doctor} = require('./models/api/doctors');
const {Appointment} = require('./models/api/appointments');

mongoose.set('debug', true);

function getIds() {
    let arr = [];
    for (let i = 0; i < 6; i++) {
        arr.push(new mongoose.Types.ObjectId());
    }
    return arr;
}

const usersIdArray = getIds();
const patientsIdArray = getIds();
const clinicsIdArray = getIds();
const labResultsIdArray = getIds();
const doctorsIdArray = getIds();
const appointmentsIdArray = getIds();

let users = [
    new User({
        _id: usersIdArray[0],
        username: 'kidney',
        password: 'dialysis1',
        firstName: 'John',
        lastName: 'Doe'
    }),
    new User({
        _id: usersIdArray[1],
        username: 'joshingyou',
        password: 'josh',
        firstName: 'Joshua',
        lastName: 'Drumm'
    })
];

let patients = [
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
        primaryInsurance: {
            insuranceCompany: 'Cigna',
            nameOfCardHolder: {
                firstName: 'Robert',
                lastName: 'Jones'
            },
            policyNumber: 843892938,
            dateOfBirthOfCardHolder: '05/12/1968',
            socialSecurityNumberOfCardHolder: '127371989'
        },
        secondaryInsurance: {
            insuranceCompany: 'Ally Health',
            nameOfCardHolder: {
                firstName: 'Robert',
                lastName: 'Jones'
            },
            policyNumber: 542343443,
            dateOfBirthOfCardHolder: '05/12/1968',
            socialSecurityNumberOfCardHolder: '127371989'
        },
        treatmentDays: 'Tue/Thu/Sat',
        treatmentTime: '9:30 a.m.',
        labResults: [
            labResultsIdArray[0],
            labResultsIdArray[1],
            labResultsIdArray[2],
            labResultsIdArray[3],
            labResultsIdArray[4]
        ],
        clinic: clinicsIdArray[0],
        doctors: [
            doctorsIdArray[0],
            doctorsIdArray[1],
            doctorsIdArray[2]
        ],
        appointments: [
            appointmentsIdArray[0],
            appointmentsIdArray[1],
            appointmentsIdArray[2]
        ],
        username: 'robert.jones',
        password: 'rjones'
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
        primaryInsurance: {
            insuranceCompany: 'Medicaid',
            nameOfCardHolder: {
                firstName: 'Betty',
                lastName: 'Crocker'
            },
            policyNumber: 843818238,
            dateOfBirthOfCardHolder: '08/02/1951',
            socialSecurityNumberOfCardHolder: '380748274'
        },
        secondaryInsurance: null,
        labResults: [
            labResultsIdArray[1]
        ],
        clinic: clinicsIdArray[0],
        username: 'betty.crocker',
        password: 'bcrocker'
    }),
    new Patient({
        _id: patientsIdArray[2],
        name: {
            firstName: 'Michael',
            lastName: 'Williams'
        },
        dateOfBirth: '02/17/1974',
        sex: 'Male',
        socialSecurityNumber: '086785372',
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
        primaryInsurance: {
            insuranceCompany: 'Medicaid',
            nameOfCardHolder: {
                firstName: 'Michael',
                lastName: 'Williams'
            },
            policyNumber: 924218238,
            dateOfBirthOfCardHolder: '02/17/1974',
            socialSecurityNumberOfCardHolder: '086785372'
        },
        secondaryInsurance: null,
        labResults: [
            labResultsIdArray[2]
        ],
        clinic: clinicsIdArray[1],
        username: 'michael.williams',
        password: 'mwilliams'
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
        primaryInsurance: {
            insuranceCompany: 'Ally Health',
            nameOfCardHolder: {
                firstName: 'Meredith',
                lastName: 'Edwards'
            },
            policyNumber: 924291025,
            dateOfBirthOfCardHolder: '03/09/1948',
            socialSecurityNumberOfCardHolder: '378472109'
        },
        secondaryInsurance: null,
        labResults: [
            labResultsIdArray[3]
        ],
        clinic: clinicsIdArray[2],
        doctors: [
            doctorsIdArray[1]
        ],
        appointments: null,
        username: 'meredith.edwards',
        password: 'medwards'
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
        primaryInsurance: {
            insuranceCompany: 'Cigna',
            nameOfCardHolder: {
                firstName: 'David',
                lastName: 'Baker'
            },
            policyNumber: 736411025,
            dateOfBirthOfCardHolder: '11/30/1943',
            socialSecurityNumberOfCardHolder: '938848321'
        },
        secondaryInsurance: null,
        labResults: [
            labResultsIdArray[4]
        ],
        clinic: clinicsIdArray[3],
        username: 'david.baker',
        password: 'dbaker'
    }),
    new Patient({
        _id: patientsIdArray[5],
        name: {
            firstName: 'Carley',
            lastName: 'Grey'
        },
        dateOfBirth: '01/13/1982',
        sex: 'Female',
        socialSecurityNumber: '837294847',
        address: {
            street: '39 Palm St',
            city: 'Jacksonville',
            state: 'FL',
            zipCode: '33298'
        },
        phoneNumbers: {
            home: '904-111-2222',
            cell: '904-111-1111',
            work: '904-329-3932'
        },
        primaryInsurance: {
            insuranceCompany: 'Medicaid',
            nameOfCardHolder: {
                firstName: 'Carley',
                lastName: 'Grey'
            },
            policyNumber: 924218238,
            dateOfBirthOfCardHolder: '01/13/1982',
            socialSecurityNumberOfCardHolder: '837294847'
        },
        secondaryInsurance: null,
        labResults: [
            labResultsIdArray[5]
        ],
        clinic: clinicsIdArray[1],
        doctors: [
            doctorsIdArray[1]
        ],
        appointments: [
            appointmentsIdArray[3]
        ],
        username: 'demo',
        password: 'patient'
    }),
];

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
];

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
        patient: patientsIdArray[0]
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
        patient: patientsIdArray[0]
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
        patient: patientsIdArray[0]
    }),
    new LabResults({
        _id: labResultsIdArray[4],
        date: '06/19/2012',
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
        patient: patientsIdArray[0]
    }),
    new LabResults({
        _id: labResultsIdArray[5],
        date: '07/21/2017',
        hematology: {
            wbcCount: 5.32,
            rbcCount: 4.01,
            hemoglobin: 11.3,
            hematocrit: 38.3,
            plateletCount: 211
        },
        chemistry: {
            bun: 42,
            creatinine: 9.13,
            sodium: 131,
            potassium: 4.4,
            calcium: 10.7,
            phosphorus: 4.1,
            albumin: 3.6,
            glucose: 131,
            iron: 49,
            cholesterol: 172,
            triglycerides: 410
        },
        patient: patientsIdArray[5]
    })
];

const doctors = [
    new Doctor({
        _id: doctorsIdArray[0],
        name: {
            firstName: 'Joseph',
            lastName: 'Armstrong'
        },
        practice: 'Hematology',
        company: 'Mayo Clinic',
        address: {
            street: '436 East Rutherford Dr',
            city: 'Jacksonville',
            state: 'FL',
            zipCode: 34232
        },
        phoneNumber: '904-743-9433',
        faxNumber: '904-743-2743',
        patients: [
            patientsIdArray[0]
        ]
    }),
    new Doctor({
        _id: doctorsIdArray[1],
        name: {
            firstName: 'Andrea',
            lastName: 'Whiteside'
        },
        practice: 'Nephrology',
        company: 'Nephrologists of Northeast Florida',
        address: {
            street: '34 West Parkland St',
            city: 'Jacksonville',
            state: 'FL',
            zipCode: 37233
        },
        phoneNumber: '904-221-2244',
        faxNumber: '904-221-4321',
        patients: [
            patientsIdArray[0],
            patientsIdArray[3],
            patientsIdArray[5]
        ]
    }),
    new Doctor({
        _id: doctorsIdArray[2],
        name: {
            firstName: 'Matthew',
            lastName: 'Caldwell-Pope'
        },
        practice: 'Primary care',
        company: 'Baptist Medical Center',
        address: {
            street: '483 Palmetto Rd',
            city: 'Jacksonville',
            state: 'FL',
            zipCode: 37432
        },
        phoneNumber: '904-221-2244',
        faxNumber: '904-221-4321',
        patients: [
            patientsIdArray[0]
        ]
    }),
    new Doctor({
        _id: doctorsIdArray[3],
        name: {
            firstName: 'Rena',
            lastName: 'Kurosaki'
        },
        practice: 'Oncology',
        company: 'North Florida Oncology',
        address: {
            street: '12 Crystal Springs Place',
            city: 'Orange Park',
            state: 'FL',
            zipCode: 32633
        },
        phoneNumber: '904-932-9498',
        faxNumber: '904-932-2384',
        patients: [
            patientsIdArray[2],
            patientsIdArray[5]
        ]
    }),
    new Doctor({
        _id: doctorsIdArray[4],
        name: {
            firstName: 'Ryan',
            lastName: 'McMann'
        },
        practice: 'Immunology',
        company: 'St. Vincent\'s Medical Center',
        address: {
            street: '4302 Langston Rd',
            city: 'Jacksonville',
            state: 'FL',
            zipCode: 35322
        },
        phoneNumber: '904-903-3221',
        faxNumber: '904-903-3119',
        patients: [
            patientsIdArray[3]
        ]
    })
];

const appointments = [
    new Appointment({
        _id: appointmentsIdArray[0],
        description: 'Back pain',
        date: '01/19/19',
        time: '12:30 p.m.',
        with: 'Jessica Brown',
        title: 'Primary care physician',
        where: 'Baptist Primary Care',
        address: {
            street: '632 Oak St',
            city: 'Jacksonville',
            state: 'FL',
            zipCode: 34423
        },
        phoneNumber: '904-233-1114',
        patient: patientsIdArray[0]
    }),
    new Appointment({
        _id: appointmentsIdArray[1],
        description: 'Access evaluation',
        date: '01/04/19',
        time: '2:15 p.m.',
        with: 'Jason Strickland',
        title: 'MD',
        where: 'Vascular Access Center',
        address: {
            street: '402 South Lakeside Dr',
            city: 'Jacksonville',
            state: 'FL',
            zipCode: 35423
        },
        phoneNumber: '904-943-2942',
        patient: patientsIdArray[0]
    }),
    new Appointment({
        _id: appointmentsIdArray[2],
        description: 'Vein mapping',
        date: '02/04/19',
        time: '2:10 p.m.',
        with: 'Jason Strickland',
        title: 'MD',
        where: 'Vascular Access Center',
        address: {
            street: '402 South Lakeside Dr',
            city: 'Jacksonville',
            state: 'FL',
            zipCode: 35422
        },
        phoneNumber: '904-943-2942',
        patient: patientsIdArray[0]
    }),
    new Appointment({
        _id: appointmentsIdArray[3],
        description: 'Annual Checkup',
        date: '04/23/19',
        time: '1:30 p.m.',
        with: 'Jennifer Stanson',
        title: 'Primary care physician',
        where: 'Northeast Primary Care',
        address: {
            street: '82 South Jackson St',
            city: 'Jacksonville',
            state: 'FL',
            zipCode: 38321
        },
        phoneNumber: '904-812-2999',
        patient: patientsIdArray[5]
    })
];

patients.forEach(patient => {
    patient.password = patient.hashPassword(patient.password);
});

users.forEach(user => {
    user.password = user.hashPassword(user.password);
});

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
        //make user schema for this db connection
        const user = db.model('User', User.schema);
        //clear the users collection
        console.log('Removing users collection');
        yield user.remove();
        //make patient schema for this db connection
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
        //make doctor schema for this db connection
        const doctor = db.model('Doctor', Doctor.schema);
        // clear the doctors collection
        console.log('Removing doctors collection');
        yield doctor.remove();
        //make appointment schema for this db connection
        const appointment = db.model('Appointment', Appointment.schema);
        // clear the appointments collection
        console.log('Removing appointments collection');
        yield appointment.remove();
    
        // seed the user data
        console.log('Seeding users..');
        yield user.insertMany(users).then(() => ({ok: 1}));
        console.log('Users successfully imported!');
        // seed the patient data
        console.log('Seeding patients..');
        yield patient.insertMany(patients).then(() => ({ ok: 1 }));
        console.log('Patients successfully imported!');
        // seed the clinic data
        console.log('Seeding clinics..');
        yield clinic.insertMany(clinics).then(() => ({ ok: 1 }));
        console.log('Clinics successfully imported!');
         // seed the lab results data
        console.log('Seeding lab results..');
        yield labResult.insertMany(labResults).then(() => ({ ok: 1 }));
        console.log('Lab results successfully imported!');
        // seed the doctor data
        console.log('Seeding doctors..');
        yield doctor.insertMany(doctors).then(() => ({ ok: 1 }));
        console.log('Doctors successfully imported!');
        // seed the appointment data
        console.log('Seeding appointments..');
        yield appointment.insertMany(appointments).then(() => ({ ok: 1 }));
        console.log('Appointments successfully imported!');
    
        console.log('~Data successfully imported!~');
    });
}

