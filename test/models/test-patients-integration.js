'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const expect = chai.expect;

const {Patient} = require('../../models/patients');
const {TEST_DATABASE_URL} = require('../../config');
const {runServer, closeServer} = require('../../server');

chai.use(chaiHttp);

function generateSex() {
    const sexes = ['male', 'female'];
    return sexes[Math.floor(Math.random() * sexes.length)];
}

function generatePatientData() {
    return {
        _id: new mongoose.Types.ObjectId(),
        name: {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName()
        },
        dateOfBirth: faker.date.past(),
        sex: generateSex(),
        socialSecurityNumber: faker.helpers.replaceSymbolWithNumber('###-##-####'),
        address: {
            street: faker.address.streetAddress('###'),
            city: faker.address.city(3),
            state: faker.address.stateAbbr(),
            zipCode: faker.random.number({min: '0000', max: '9999'})
        },
        phoneNumbers: {
            home: faker.phone.phoneNumberFormat(0),
            cell: faker.phone.phoneNumberFormat(0),
            work: faker.phone.phoneNumberFormat(0)
        },
        primaryInsurance: {
            insuranceCompany: faker.company.companyName(),
            nameOfCardHolder: {
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName()
            },
            policyNumber: faker.random.number(100000000),
            dateOfBirthOfCardHolder: faker.date.past(),
            socialSecurityNumberOfCardHolder: faker.helpers.replaceSymbolWithNumber('###-##-####')
        },
        secondaryInsurance: {
            insuranceCompany: faker.company.companyName(),
            nameOfCardHolder: {
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName()
            },
            policyNumber: faker.random.number(100000000),
            dateOfBirthOfCardHolder: faker.date.past(),
            socialSecurityNumberOfCardHolder: faker.helpers.replaceSymbolWithNumber('###-##-####')
        },
        treatmentDays: faker.fake('{{date.weekday}}/{{date.weekday}}/{{date.weekday}}'),
        treatmentTime: faker.random.word(),
        username: faker.internet.userName(),
        password: faker.internet.password(),
        appointments: [
            {
                _id: new mongoose.Types.ObjectId(),
                description: faker.random.words(),
                date: faker.date.past(),
                time: faker.random.word(),
                with: faker.name.lastName(),
                title: faker.name.jobTitle(),
                where: faker.company.companyName(),
                address: {
                    street: faker.address.streetAddress('###'),
                    city: faker.address.city(3),
                    state: faker.address.stateAbbr(),
                    zipCode: faker.random.number({min: '0000', max: '9999'})
                },
                phoneNumber: faker.phone.phoneNumberFormat(0)
            }
        ],
        doctors: [
            {
                _id: new mongoose.Types.ObjectId(),
                name: {
                    firstName: faker.name.firstName(),
                    lastName: faker.name.lastName()
                },
                practice: faker.name.jobTitle(),
                company: faker.company.companyName(),
                address: {
                    street: faker.address.streetAddress('###'),
                    city: faker.address.city(3),
                    state: faker.address.stateAbbr(),
                    zipCode: faker.random.number({min: '0000', max: '9999'})
                },
                phoneNumber: faker.phone.phoneNumberFormat(0),
                faxNumber: faker.phone.phoneNumberFormat(0)
            }
        ],
        labResults: [
            {
                _id: new mongoose.Types.ObjectId(),
                date: faker.date.past(2),
                hematology: {
                    wbcCount: Number(faker.finance.amount(0,20,2)),
                    rbcCount: Number(faker.finance.amount(0,10,2)),
                    hemoglobin: Number(faker.finance.amount(0,20,1)),
                    hematocrit: Number(faker.finance.amount(0,75,1)),
                    plateletCount: Number(faker.finance.amount(0,600,0))
                },
                chemistry: {
                    bun: Number(faker.finance.amount(0,75,0)),
                    creatinine: Number(faker.finance.amount(0,20,2)),
                    sodium: Number(faker.finance.amount(0,250,0)),
                    potassium: Number(faker.finance.amount(0,15,1)),
                    calcium: Number(faker.finance.amount(0,20,1)),
                    phosphorus: Number(faker.finance.amount(0,15,1)),
                    albumin: Number(faker.finance.amount(0,10,1)),
                    glucose: Number(faker.finance.amount(0,400,0)),
                    iron: Number(faker.finance.amount(0,300,0)),
                    cholesterol: Number(faker.finance.amount(0,500,0)),
                    triglycerides: Number(faker.finance.amount(0,500,0))
                }
            }
        ],
        clinic: {
            _id: new mongoose.Types.ObjectId(),
            name: faker.company.companyName(),
            address: {
                street: faker.address.streetAddress('###'),
                city: faker.address.city(3),
                state: faker.address.stateAbbr(),
                zipCode: faker.random.number({min: '0000', max: '9999'})
            },
            phoneNumber: faker.phone.phoneNumberFormat(0),
            faxNumber: faker.phone.phoneNumberFormat(0),
            clinicManager: {
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName()
            }
        }
    };
}

function seedPatientData() {
    console.info('Seeding patient data');
    const seedData = [];
    for (let i = 1; i <= 10; i++) {
        seedData.push(generatePatientData());
    }
    return Patient.insertMany(seedData);
}

function tearDownDb() {
    return new Promise((resolve, reject) => {
      console.warn('Deleting database');
      mongoose.connection.dropDatabase()
        .then(result => resolve(result))
        .catch(err => reject(err));
    });
  }

describe('Patient API resource', function() {
    before(function() {
        return runServer(TEST_DATABASE_URL);
    });

    beforeEach(function() {
        return seedPatientData();
    });

    afterEach(function() {
        return tearDownDb();
    });

    after(function() {
        return closeServer();
    });

    describe('Patient model', function() {
        it('Should initialize patient data with the correct fields', function(done) {
            const generatedPatient = generatePatientData();
            const patient = new Patient(generatedPatient);

            patient.save(function(err, result) {
                expect(result).to.exist;
                expect(err).to.not.exist;
                expect(result.name.firstName).to.equal(generatedPatient.name.firstName);
                expect(result.name.lastName).to.equal(generatedPatient.name.lastName);
                expect(result.sex).to.equal(generatedPatient.sex);
                expect(result.socialSecurityNumber).to.equal(generatedPatient.socialSecurityNumber);
                expect(result.address.street).to.equal(generatedPatient.address.street);
                expect(result.address.city).to.equal(generatedPatient.address.city);
                expect(result.address.state).to.equal(generatedPatient.address.state);
                expect(result.address.zipCode).to.equal(generatedPatient.address.zipCode);
                done();
            });
        });

        it('Should format social security number correctly', function(done) {
            const generatedPatient = new Patient(generatePatientData());

            generatedPatient.socialSecurityNumber = '123456789';

            generatedPatient.save(generatedPatient, function(err, patient) {
                expect(patient.socialSecurityNumber).to.equal(generatedPatient.socialSecurityNumber);
                expect(patient.formatSsn).to.equal('123-45-6789');
                done();
            });
        });
        
        it('Should not create a patient if required fields are missing', function(done) {
            const generatedPatient = {};
            const patient = new Patient(generatedPatient);

            patient.save(function(err, result) {
                expect(err).to.exist;
                expect(result).to.not.exist;
                done();
            });
        });

        it('Should not create a patient if the zip code is anything other than a number', function(done) {
            const generatedPatient = generatePatientData();
            generatedPatient.address.zipCode = 'abc';
            const patient = new Patient(generatedPatient);

            patient.save(function(err) {
                expect(err).to.exist;
                done();
            });
        });
    });
});

module.exports = {generatePatientData};
