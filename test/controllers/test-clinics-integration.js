'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const request = require('supertest');
const {TEST_DATABASE_URL} = require('../../config');
const faker = require('faker');
const {app, runServer, closeServer} = require('../../server');
const {generateClinicData} = require('../models/test-clinics-integration');
const {Clinic} = require('../../models/clinics');

const expect = chai.expect;

chai.use(chaiHttp);

const authenticatedUser = request.agent(app);
const userCredentials = {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    username: faker.internet.userName(),
    password: faker.internet.password()
}

describe('Clinic controller', function() {

    before(function() {
        return runServer(TEST_DATABASE_URL);
    });

    after(function() {
        return closeServer();
    });

    before(function (done) {

        authenticatedUser
            .post('/users/register')
            .send(userCredentials)
            .end(function (err, response) {
                expect('Location', '/clinics');
                expect(response.statusCode).to.equal(302);
                done();
            });
    });

    describe('GET endpoint for clinics', function() {
        it('Should retrieve all existing clinics', function(done) {
            let res;

            authenticatedUser
                .get('/clinics')
                .then(function(_res) {
                    res = _res;
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('object');
                    done();
                });
        });
    });

    describe('POST endpoint for clinics', function() {
        it('Should create a new clinic', function(done) {
            const newClinic = generateClinicData();
                
            authenticatedUser
                .post('/clinics')
                .send(newClinic)
                .then(function(res) {
                    console.log('newClinic:', newClinic);
                    expect(res).to.have.status(302);
                    expect(res.body).to.be.a('object');
                    return Clinic
                        .findOne({
                            'name': newClinic.name, 
                            'address.street': newClinic.address.street,
                            'phoneNumber': newClinic.phoneNumber,
                            'faxNumber': newClinic.faxNumber,
                            'clinicManager.firstName': newClinic.clinicManager.firstName,
                            'clinicManager.lastName': newClinic.clinicManager.lastName
                        })
                })
                .then(function(createdClinic) {
                    console.log('createdClinic:', createdClinic);
                    expect(createdClinic.name).to.equal(newClinic.name);
                    expect(createdClinic.address.street).to.equal(newClinic.address.street);
                    expect(createdClinic.phoneNumber).to.equal(newClinic.phoneNumber);
                    expect(createdClinic.faxNumber).to.equal(newClinic.faxNumber);
                    expect(createdClinic.clinicManager.firstName).to.equal(newClinic.clinicManager.firstName);
                    expect(createdClinic.clinicManager.lastName).to.equal(newClinic.clinicManager.lastName);
                    done();
                });
        });
    });

    describe('PUT endpoint for clinics', function() {
        it('Should update the data of an existing clinic', function(done) {
            const updatedClinicData = {
                name: 'West Jacksonville Dialysis Center',
                phoneNumber: '904-432-8483',
                faxNumber: '904-432-9384',
                clinicManager: {
                    firstName: 'Stacey',
                    lastName: 'McCormick'
                }
            };

            let clinic = new Clinic(generateClinicData());

            clinic.save(function(err, clinic) {
                updatedClinicData._id = clinic._id
                authenticatedUser
                    .put(`/clinics/${clinic._id}`)
                    .send(updatedClinicData)
                    .end(function(err, res) {
                        expect(res).to.have.status(302);

                        Clinic.findById(updatedClinicData._id, (err, clinic) => {
                            expect(clinic.name).to.equal(updatedClinicData.name);
                            expect(clinic.phoneNumber).to.equal(updatedClinicData.phoneNumber);
                            expect(clinic.faxNumber).to.equal(updatedClinicData.faxNumber);
                            expect(clinic.clinicManager.firstName).to.equal(updatedClinicData.clinicManager.firstName);
                            expect(clinic.clinicManager.lastName).to.equal(updatedClinicData.clinicManager.lastName);
                            done();
                        });
                    });
            });
        });
    });

    describe('DELETE endpoint for clinics', function() {
        it('Should delete an existing clinic based on id', function(done) {
            let clinic = new Clinic(generateClinicData());

            clinic.save((err, clinic) => {
                authenticatedUser
                    .delete(`/clinics/${clinic._id}`)
                    .end(function(err, res) {
                        expect(res).to.have.status(302);
                        done();
                    });
            });
        });
    });
});