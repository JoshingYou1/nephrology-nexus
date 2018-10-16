"use strict";

const chai = require("chai");
const chaiHttp = require("chai-http");
const faker = require("faker");
const mongoose = require("mongoose");
const sinon = require("sinon");
require("sinon-mongoose");

const expect = chai.expect;

const {Patient} = require("../../models/patients");
const {TEST_DATABASE_URL} = require("../../config");
const {runServer, closeServer} = require("../../server");

chai.use(chaiHttp);

function generateGender() {
    const genders = ["male", "female"];
    return genders[Math.floor(Math.random() * genders.length)];
}

function generatePatientData() {
    return {
        _id: new mongoose.Types.ObjectId(),
        name: {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName()
        },
        dateOfBirth: faker.date.past(),
        gender: generateGender(),
        socialSecurityNumber: faker.helpers.replaceSymbolWithNumber("###-##-####"),
        address: {
            street: faker.address.streetAddress("###"),
            city: faker.address.city(3),
            state: faker.address.stateAbbr(),
            zipCode: faker.random.number({min: "0000", max: "9999"})
        },
        phoneNumbers: {
            home: faker.phone.phoneNumberFormat(0),
            cell: faker.phone.phoneNumberFormat(0),
            work: faker.phone.phoneNumberFormat(0)
        }
    };
}

function seedPatientData() {
    console.info("Seeding patient data");
    const seedData = [];
    for (let i = 1; i <= 10; i++) {
        seedData.push(generatePatientData());
    }
    return Patient.insertMany(seedData);
}

function tearDownDb() {
    return new Promise((resolve, reject) => {
      console.warn("Deleting database");
      mongoose.connection.dropDatabase()
        .then(result => resolve(result))
        .catch(err => reject(err));
    });
  }

describe("Patient API resource", function() {
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

    describe("Patient model", function() {
        it("Should initialize patient data with the correct fields", function(done) {
            const generatedPatient = generatePatientData();
            const patient = new Patient(generatedPatient);

            patient.save(function(err, result) {
                expect(result).to.exist;
                expect(err).to.not.exist;
                expect(result.name.firstName).to.equal(generatedPatient.name.firstName);
                expect(result.name.lastName).to.equal(generatedPatient.name.lastName);
                expect(result.gender).to.equal(generatedPatient.gender);
                expect(result.socialSecurityNumber).to.equal(generatedPatient.socialSecurityNumber);
                expect(result.address.street).to.equal(generatedPatient.address.street);
                expect(result.address.city).to.equal(generatedPatient.address.city);
                expect(result.address.state).to.equal(generatedPatient.address.state);
                expect(result.address.zipCode).to.equal(generatedPatient.address.zipCode);
                done();
            });
        });

        it("Should format social security number correctly", function(done) {
            const generatedPatient = new Patient(generatePatientData());

            generatedPatient.socialSecurityNumber = '123456789';

            generatedPatient.save(generatedPatient, function(err, patient) {
                expect(patient.socialSecurityNumber).to.equal(generatedPatient.socialSecurityNumber);
                console.log('patient.formatSsn:', patient.formatSsn);
                expect(patient.formatSsn).to.equal('123-45-6789');
                done();
            });
        });
        
        it("Should not create a patient if required fields are missing", function(done) {
            const generatedPatient = {};
            const patient = new Patient(generatedPatient);

            patient.save(function(err, result) {
                expect(err).to.exist;
                expect(result).to.not.exist;
                done();
            });
        });

        it("Should not create a patient if the zip code is anything other than a number", function(done) {
            const generatedPatient = generatePatientData();
            generatedPatient.address.zipCode = "abc";
            const patient = new Patient(generatedPatient);

            patient.save(function(err) {
                expect(err).to.exist;
                done();
            });
        });
    });
});

module.exports = {generatePatientData};
