'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const expect = chai.expect;

const {Appointment} = require('../../../models/api/appointments');
const {TEST_DATABASE_URL} = require('../../../config');
const {runServer, closeServer} = require('../../../server');

chai.use(chaiHttp);

function generateAppointmentData() {
    return {
        _id: new mongoose.Types.ObjectId(),
        description: faker.lorem.words(),
        date: faker.date.recent(-1),
        time: faker.lorem.word(),
        with: faker.name.lastName(),
        title: faker.name.title(),
        where: faker.company.companyName(),
        address: {
            street: faker.address.streetAddress('###'),
            city: faker.address.city(3),
            state: faker.address.stateAbbr(),
            zipCode: faker.random.number({min: '0000', max: '9999'})
        },
        phoneNumber: faker.phone.phoneNumberFormat(0)
    };
}

function seedAppointmentData() {
    console.info('Seeding appointment data');
    const seedData = [];
    for (let i = 1; i <= 10; i++) {
        seedData.push(generateAppointmentData());
    }
    return Appointment.insertMany(seedData);
}

function tearDownDb() {
    return new Promise((resolve, reject) => {
      console.warn('Deleting database');
      mongoose.connection.dropDatabase()
        .then(result => resolve(result))
        .catch(err => reject(err));
    });
}

describe('Appointment API Resource', function() {
    before(function() {
        return runServer(TEST_DATABASE_URL);
    });

    beforeEach(function() {
        return seedAppointmentData();
    });

    afterEach(function() {
        return tearDownDb();
    });

    after(function() {
        return closeServer();
    });

    describe('Appointment model', function() {
        it('Should initialize appointment data with the correct fields', function(done) {
            const generatedAppointment = generateAppointmentData();
            const appointment = new Appointment(generatedAppointment);

            appointment.save(function(err, result) {
                expect(result).to.exist;
                expect(err).to.not.exist;
                expect(result.description).to.equal(generatedAppointment.description);
                expect(result.date).to.equal(generatedAppointment.date);
                expect(result.time).to.equal(generatedAppointment.time);
                expect(result.with).to.equal(generatedAppointment.with);
                expect(result.title).to.equal(generatedAppointment.title);
                expect(result.where).to.equal(generatedAppointment.where);
                expect(result.address.street).to.equal(generatedAppointment.address.street);
                expect(result.address.city).to.equal(generatedAppointment.address.city);
                expect(result.address.state).to.equal(generatedAppointment.address.state);
                expect(result.address.zipCode).to.equal(generatedAppointment.address.zipCode);
                expect(result.phoneNumber).to.equal(generatedAppointment.phoneNumber);
                done();
            });
        });

        it('Should not create an appointment if required fields are missing', function(done) {
            const generatedAppointment = {};
            const appointment = new Appointment(generatedAppointment);

            appointment.save(function(err, result) {
                expect(err).to.exist;
                expect(result).to.not.exist;
                done();
            });
        });

        it('Should not create an appointment if the phone number is anything other than a string', function(done) {
            const generatedAppointment = generateAppointmentData();
            generatedAppointment.phoneNumber = {phoneNumber: 1234567890};
            const appointment = new Appointment(generatedAppointment);

            appointment.save(function(err) {
                expect(err).to.exist;
                done();
            });
        });
    });
});

module.exports = {generateAppointmentData};