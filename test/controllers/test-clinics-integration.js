'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const {TEST_DATABASE_URL} = require('../../config');
const {app, runServer, closeServer} = require('../../server');
const {generateClinicData} = require('../models/test-clinics-integration');
const {Clinic} = require('../../models/clinics');

const expect = chai.expect;

chai.use(chaiHttp);

describe('Clinic controller', function() {
    before(function() {
        return runServer(TEST_DATABASE_URL);
    });

    after(function() {
        return closeServer();
    });

    describe('GET endpoint for clinics', function() {
        it('Should retrieve all existing clinics', function() {
            let res;

            return chai
                .request(app)
                .get('/clinics')
                .then(function(_res) {
                    res = _res;
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('object');
                });
        });
    });

    describe('POST endpoint for clinics', function() {
        it('Should create a new clinic', function() {
            const newClinic = generateClinicData();

            return chai
                .request(app)
                .post('/clinics')
                .send(newClinic)
                .then(function(res) {
                    expect(res).to.have.status(201);
                    expect(res.body).to.be.a('object');
                    return Clinic
                        .findOne({'name': newClinic.name, 'address.street': newClinic.address.street, 'phoneNumber': newClinic.phoneNumber,
                            'faxNumber': newClinic.faxNumber, 'clinicManager.firstName': newClinic.clinicManager.firstName,
                            'clinicManager.lastName': newClinic.clinicManager.lastName})
                })
                .then(function(createdClinic) {
                    expect(createdClinic.name).to.equal(newClinic.name);
                    expect(createdClinic.address.street).to.equal(newClinic.address.street);
                    expect(createdClinic.phoneNumber).to.equal(newClinic.phoneNumber);
                    expect(createdClinic.faxNumber).to.equal(newClinic.faxNumber);
                    expect(createdClinic.clinicManager.firstName).to.equal(newClinic.clinicManager.firstName);
                    expect(createdClinic.clinicManager.lastName).to.equal(newClinic.clinicManager.lastName);
                });
        });
    });

    describe('PUT endpoint for clinics', function() {
        it('Should update the data of an existing clinic', function() {
            const updatedClinicData = {
                name: 'West Jacksonville Dialysis Center',
                phoneNumber: '904-432-8483',
                faxNumber: '904-432-9384',
                clinicManager: {
                    firstName: 'Stacey',
                    lastName: 'McCormick'
                }
            }

            return Clinic
                .findOne()
                .then(function(clinic) {
                    updatedClinicData.id = clinic.id

                    return chai
                        .request(app)
                        .put(`/clinics/${clinic.id}`)
                        .send(updatedClinicData)
                })
                .then(function(res) {
                    expect(res).to.have.status(204);
                    return Clinic.findById(updatedClinicData.id);
                })
                .then(function(clinic) {
                    expect(clinic.name).to.equal(updatedClinicData.name);
                    expect(clinic.phoneNumber).to.equal(updatedClinicData.phoneNumber);
                    expect(clinic.faxNumber).to.equal(updatedClinicData.faxNumber);
                    expect(clinic.clinicManager.firstName).to.equal(updatedClinicData.clinicManager.firstName);
                    expect(clinic.clinicManager.lastName).to.equal(updatedClinicData.clinicManager.lastName);
                });
        });
    });

    describe('DELETE endpoint for clinics', function() {
        it('Should delete an existing clinic based on id', function() {
            let clinic;

            return Clinic
                .findOne()
                .then(function(_clinic) {
                    clinic = _clinic;

                    return chai
                        .request(app)
                        .delete(`/clinics/${clinic.id}`);
                })
                .then(function(res) {
                    expect(res).to.have.status(204);
                    return Clinic.findById(clinic.id);
                })
                .then(function(_clinic) {
                    expect(_clinic).to.be.null;
                });
        });
    });
});