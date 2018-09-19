'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const config = require('./config');
mongoose.connect(config.DATABASE_URL);
console.log(config.DATABASE_URL);

const {Patient} = require('./models/patients');
const {Clinic} = require('./models/clinics');
const {LabResults} = require('./models/lab-results');

const patients = [
    new Patient({
        _id: new mongoose.Types.ObjectId(),
        name: {
            firstName: "Robert",
            lastName: "Jones"
        },
        dateOfBirth: "05/12/68",
        gender: "Male",
        socialSecurityNumber: "127371989",
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
        }
    })
    ,
    new Patient({
        _id: new mongoose.Types.ObjectId(),
        name: {
            firstName: "Betty",
            lastName: "Crocker"
        },
        dateOfBirth: "08/02/51",
        gender: "Female",
        socialSecurityNumber: "380748274",
        address: {
            street: "456 Colonial Drive",
            city: "Orange Park",
            state: "Florida",
            zipCode: "38271"
        },
        phoneNumbers: {
            home: "904-923-0092",
            cell: null,
            work: null
        }
    }),
    new Patient({
        _id: new mongoose.Types.ObjectId(),
        name: {
            firstName: "Michael",
            lastName: "Williams"
        },
        dateOfBirth: "02/17/74",
        gender: "Male",
        socialSecurityNumber: "002385372",
        address: {
            street: "798 Wallaby Way",
            city: "Jacksonville",
            state: "Florida",
            zipCode: "39123"
        },
        phoneNumbers: {
            home: "904-828-8211",
            cell: "904-912-9233",
            work: "904-903-1283"
        }
    }),
    new Patient({
        _id: new mongoose.Types.ObjectId(),
        name: {
            firstName: "Meredith",
            lastName: "Edwards"
        },
        dateOfBirth: "03/09/48",
        gender: "Female",
        socialSecurityNumber: "378472109",
        address: {
            street: "932 Long Leaf Road",
            city: "Jacksonville",
            state: "Florida",
            zipcode: "30919"
        },
        phoneNumbers: {
            home: "904-021-8774",
            cell: "904-875-9239",
            work: null
        }
    }),
    new Patient({
        _id: new mongoose.Types.ObjectId(),
        name: {
            firstName: "David",
            lastName: "Baker"
        },
        dateOfBirth: "11/30/43",
        gender: "Male",
        socialSecurityNumber: "938848321",
        address: {
            street: "22 West Monument Road",
            city: "Jacksonville",
            state: "Florida",
            zipcode: "32932"
        },
        phoneNumbers: {
            home: null,
            cell: null,
            work: null
        }
    })
]

const clinics = [
    {
        _id: new mongoose.Types.ObjectId(),
        name: "North Florida Dialysis",
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
            patients[0]._id,
            patients[1]._id
        ]
    },
    {
        _id: new mongoose.Types.ObjectId(),
        name: "First Coast Dialysis",
        address: {
            street: "847 Jefferson Lane",
            city: "Jacksonville",
            state: "Florida",
            zipCode: "37462"
        },
        phoneNumber: "904-838-3848",
        faxNumber: "904-838-9833",
        clinicManager: {
            firstName: "Rich",
            lastName: "Paul"
        },
        patients: [
            patients[2]._id
        ]
    },
    {
        _id: new mongoose.Types.ObjectId(),
        name: "Dialysis, Inc.",
        address: {
            street: "3 Washington Street",
            city: "Orange Park",
            state: "Florida",
            zipCode: "38721"
        },
        phoneNumber: "904-129-7734",
        faxNumber: "904-129-1028",
        clinicManager: {
            firstName: "Jack",
            lastName: "Johnson"
        },
        patients: [
            patients[3]._id
        ]
    },
    {
        _id: new mongoose.Types.ObjectId(),
        name: "Duval Dialysis Center",
        address: {
            street: "23 West Sunset Road",
            city: "Jacksonville",
            state: "Florida",
            zipCode: "34531"
        },
        phoneNumber: "904-933-2344",
        faxNumber: "904-933-2938",
        clinicManager: {
            firstName: "Mary",
            lastName: "Maxwell"
        },
        patients: [
            patients[4]._id
        ]
    },
    {
        _id: new mongoose.Types.ObjectId(),
        name: "East Jacksonville Dialysis",
        address: {
            street: "37 Beaches Boulevard",
            city: "Jacksonville",
            state: "Florida",
            zipCode: "30923"
        },
        phoneNumber: "904-453-2553",
        faxNumber: "904-453-9212",
        clinicManager: {
            firstName: "Jerry",
            lastName: "McNabb"
        }
    }
]

const labResults = [
    new LabResults({
        _id: new mongoose.Types.ObjectId(),
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
        }
    }),
    new LabResults({
        _id: new mongoose.Types.ObjectId(),
        date: "07/02/2012",
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
        }
    }),
    new LabResults({
        _id: new mongoose.Types.ObjectId(),
        date: "11/15/2012",
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
        }
    }),
    new LabResults({
        _id: new mongoose.Types.ObjectId(),
        date: "09/29/2012",
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
        }
    }),
    new LabResults({
        _id: new mongoose.Types.ObjectId(),
        date: "6/19/2012",
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
    })
]

function seedPatientData() {
    console.info("Seeding patient data");
    const seedData = [];
    for (let i = 1; i <= 10; i++) {
        seedData.push(patients);
    }
    return Patient.insertMany(seedData);
}

function seedClinicData() {
    console.info("Seeding clinic data");
    const seedData = [];
    for (let i = 1; i <= 10; i++) {
        seedData.push(clinics);
    }
    return Clinic.insertMany(seedData);
}

function seedLabResultsData() {
    console.info("Seeding lab results data");
    const seedData = [];
    for (let i = 1; i <= 10; i++) {
        seedData.push(labResults);
    }
    return LabResults.insertMany(seedData);
}

async function dropDatabase () {
    console.log('Removing patient collection')
    await Patient.remove()
    console.log('Removing clinic collection')
    await Clinic.remove()
    console.log('Removing lab results collection')
    await LabResults.remove()
    console.log('Success!')
  }
  
  async function seedData () {
    try {
        console.log('Seeding patients..')
        await importSeedData();
        // await Patient.insertMany(patients)
        console.log('Patients successfully imported!')

        console.log('Seeding clinics..')
        await Clinic.insertMany(clinics)
        console.log('Clinics successfully imported!')

        // console.log('Seeding lab results..')
        // await LabResults.insertMany(labResults)
        // console.log('Lab results successfully imported!')
    }
    catch(error) {
      console.log('Error:' + error)
    }
  }
  
  async function setup() {
    dropDatabase();
    //seedData();
    process.exit(0);
  }

  setup();

async function importSeedData() {
    patients.forEach((patient, index) => {
        patient.save(err => {
            if (err) {
                console.log('Error:' + err);
            }
            else {
                labResults[index].patient = patient._id;
                labResults[index].save();
            }
        })
    })
}