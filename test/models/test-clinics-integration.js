"use strict";

const chai = require("chai");
const chaiHttp = require("chai-http");
const faker = require('faker');
const mongoose = require('mongoose');

const expect = chai.expect;

const {Clinic} = require('../../models/clinics');
const {TEST_DATABASE_URL} = require('../../config');
const {runServer, closeServer} = require('../../server');

chai.use(chaiHttp);

function generateClinicData() {
    return {
        _id: new mongoose.Types.ObjectId(),
        name: faker.company.companyName(),
        address: {
            street: faker.address.streetAddress("###"),
            city: faker.address.city(3),
            state: faker.address.stateAbbr(),
            zipCode: faker.random.number({min: "0000", max: "9999"})
        },
        phoneNumber: faker.phone.phoneNumberFormat(0),
        faxNumber: faker.phone.phoneNumberFormat(0),
        clinicManager: {
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName()
        }
    };
}

function seedClinicData() {
    console.info("Seeding clinic data");
    const seedData = [];
    for (let i = 1; i <= 10; i++) {
        seedData.push(generateClinicData());
    }
    return Clinic.insertMany(seedData);
}

function tearDownDb() {
    return new Promise((resolve, reject) => {
      console.warn("Deleting database");
      mongoose.connection.dropDatabase()
        .then(result => resolve(result))
        .catch(err => reject(err));
    });
}

describe('Clinic API resource', function() {
    before(function() {
        return runServer(TEST_DATABASE_URL);
    });

    beforeEach(function() {
        return seedClinicData();
    });

    afterEach(function() {
        return tearDownDb();
    });

    after(function() {
        return closeServer();
    });

    describe('Clinic model', function() {
        it('Should initialize clinic data with the correct fields', function(done) {
            const generatedClinic = generateClinicData();
            const clinic = new Clinic(generatedClinic);

            clinic.save(function(err, result) {
                console.log('error:', err);
                expect(result).to.exist;
                expect(err).to.not.exist;
                expect(result.name).to.equal(generatedClinic.name);
                expect(result.address.street).to.equal(generatedClinic.address.street);
                expect(result.address.city).to.equal(generatedClinic.address.city);
                expect(result.address.state).to.equal(generatedClinic.address.state);
                expect(result.address.zipCode).to.equal(generatedClinic.address.zipCode);
                expect(result.phoneNumber).to.equal(generatedClinic.phoneNumber);
                expect(result.faxNumber).to.equal(generatedClinic.faxNumber);
                expect(result.clinicManager.firstName).to.equal(generatedClinic.clinicManager.firstName);
                expect(result.clinicManager.lastName).to.equal(generatedClinic.clinicManager.lastName);
                done();
            });
        });

        it('Should not create a clinic if required fields are missing', function(done) {
            const generatedClinic = {};
            const clinic = new Clinic(generatedClinic);

            clinic.save(function(err, result) {
                expect(err).to.exist;
                expect(result).to.not.exist;
                done();
            });
        });

        it('Should not create a clinic if the zip code is anything other than a number', function(done) {
            const generatedClinic = generateClinicData();
            generatedClinic.address.zipCode = 'aeiou';
            const clinic = new Clinic(generatedClinic);

            clinic.save(function(err) {
                expect(err).to.exist;
                done();
            });
        });
    });
});

module.exports = {generateClinicData};
