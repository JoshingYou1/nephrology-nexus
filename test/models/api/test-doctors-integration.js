'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const expect = chai.expect;

const {Doctor} = require('../../../models/api/doctors');
const {TEST_DATABASE_URL} = require('../../../config');
const {runServer, closeServer} = require('../../../server');

chai.use(chaiHttp);

function generateDoctorData() {
    return {
        _id: new mongoose.Types.ObjectId(),
        name: {
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName()
        },
        practice: faker.lorem.word(),
        company: faker.company.companyName(),
        address: {
            street: faker.address.streetAddress('###'),
            city: faker.address.city(3),
            state: faker.address.stateAbbr(),
            zipCode: faker.random.number({min: '0000', max: '9999'})
        },
        phoneNumber: faker.phone.phoneNumberFormat(0),
        faxNumber: faker.phone.phoneNumberFormat(0)
    };
}

function seedDoctorData() {
    console.info('Seeding doctor data');
    const seedData = [];
    for (let i = 1; i <= 10; i++) {
        seedData.push(generateDoctorData());
    }
    return Doctor.insertMany(seedData);
}

function tearDownDb() {
    return new Promise((resolve, reject) => {
      console.warn('Deleting database');
      mongoose.connection.dropDatabase()
        .then(result => resolve(result))
        .catch(err => reject(err));
    });
}

describe('Doctor API resource', function() {
    before(function() {
        return runServer(TEST_DATABASE_URL);
    });

    beforeEach(function() {
        return seedDoctorData();
    });

    afterEach(function() {
        return tearDownDb();
    });

    after(function() {
        return closeServer();
    });

    describe('Doctor model', function() {
        it('Should initialize doctor data with the correct fields', function(done) {
            const generatedDoctor = generateDoctorData();
            const doctor = new Doctor(generatedDoctor);

            doctor.save(function(err, result) {
                expect(result).to.exist;
                expect(err).to.not.exist;
                expect(result.name.firstName).to.equal(generatedDoctor.name.firstName);
                expect(result.name.lastName).to.equal(generatedDoctor.name.lastName);
                expect(result.practice).to.equal(generatedDoctor.practice);
                expect(result.company).to.equal(generatedDoctor.company);
                expect(result.address.street).to.equal(generatedDoctor.address.street);
                expect(result.address.city).to.equal(generatedDoctor.address.city);
                expect(result.address.state).to.equal(generatedDoctor.address.state);
                expect(result.address.zipCode).to.equal(generatedDoctor.address.zipCode);
                expect(result.phoneNumber).to.equal(generatedDoctor.phoneNumber);
                expect(result.faxNumber).to.equal(generatedDoctor.faxNumber);
                done();
            });
        });

        it('Should not create a doctor if required fields are missing', function(done) {
            const generatedDoctor = {};
            const doctor = new Doctor(generatedDoctor);

            doctor.save(function(err, result) {
                expect(err).to.exist;
                expect(result).to.not.exist;
                done();
            });
        });

        it('Should not create a doctor if the zip code is anything other than a number', function(done) {
            const generatedDoctor = generateDoctorData();
            generatedDoctor.address.zipCode = 'aeiou';
            const doctor = new Doctor(generatedDoctor);

            doctor.save(function(err) {
                expect(err).to.exist;
                done();
            });
        });
    });
});

module.exports = {generateDoctorData};