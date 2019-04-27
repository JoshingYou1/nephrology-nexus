'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const expect = chai.expect;

const {Appointment} = require('../../models/api/appointments');
const {TEST_DATABASE_URL} = require('../../config');
const {runServer, closeServer} = require('../../server');

chai.use(chaiHttp);

function generateAppointmentData() {
    return {
        _id: new mongoose.Types.ObjectId(),
        description: faker.lorem.words(),
        date: faker.date.soon(5),
        time: faker.lorem.word(),
        with: faker.name.lastName(),
        title: faker.name.title(),
        where: faker.company.companyName(),
        address: {
            street: faker.address.streetAddress('###'),
            city: faker.address.city(3),
            state: faker.address.stateAbbr(),
            zipCode: faker.random.number({min: '0000', max: '9999'})
        }
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

describe('Appointment API Resource')