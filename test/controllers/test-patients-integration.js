'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const request = require('supertest');
const {TEST_DATABASE_URL} = require('../../config');
const faker = require('faker');
const {app, runServer, closeServer} = require('../../server');
const {generatePatientData} = require('../models/test-patients-integration');
const {generateClinicData} = require('../models/test-clinics-integration');
const {Patient} = require('../../models/patients');
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

describe('Patient controller', function() {
    let clinicId = '';

    before(function() {
        return runServer(TEST_DATABASE_URL);
    });

    after(function() {
        return closeServer();
    });

    before(function (done) {
        const clinic = new Clinic(generateClinicData());
        clinic.save(function(err, clinic) {
            clinicId = clinic._id;

        authenticatedUser
            .post('/users/register')
            .send(userCredentials)
            .end(function (err, response) {
                expect('Location', '/patients');
                expect(response.statusCode).to.equal(302);
                done();
            });
        });
    });

    describe('GET endpoint for patients', function() {
        it('Should retrieve all existing patients that belong to a single clinic', function(done) {
            let res;
            
            
            authenticatedUser
                .get(`/clinics/${clinicId}/patients`)
                .then(function(_res) {
                    res = _res;
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a("object");
                    done();
                });
        });
    });

    describe('POST endpoint for patients', function() {
        it('Should create a new patient', function(done) {

            const newPatient = generatePatientData();
            newPatient.clinic = clinicId;
            
            authenticatedUser
                .post(`/clinics/${clinicId}/patients`)
                .send(newPatient)
                .then(function(res) {
                    expect(res).to.have.status(302);
                    expect(res.body).to.be.a('object');
                    return Patient
                        .findOne({
                            'name.firstName': newPatient.name.firstName,
                            'name.lastName': newPatient.name.lastName,
                            'sex': newPatient.sex,
                            'socialSecurityNumber': newPatient.socialSecurityNumber
                        })
                })
                .then(function(createdPatient) {
                    expect(createdPatient.patientName).to.equal(`${newPatient.name.lastName}, ${newPatient.name.firstName}`);
                    expect(createdPatient.sex).to.equal(newPatient.sex);
                    expect(createdPatient.socialSecurityNumber).to.equal(newPatient.socialSecurityNumber);
                    done();
                });
        });   
    });

    describe('PUT endpoint for patients', function() {
        it('Should update the data of an existing patient', function(done) {
            const updatedPatientData = {
                name: {
                    firstName: 'Joseph',
                    lastName: 'Richardson'
                },
                sex: 'Male',
                socialSecurityNumber: '232-13-1422',
            };

            let patient = new Patient(generatePatientData());

            patient.save(function(err, patient) {
                updatedPatientData._id = patient._id;
                
                authenticatedUser
                    .put(`/clinics/${clinicId}/patients/${patient._id}`)
                    .send(updatedPatientData)
                    .end(function(err, res) {
                        expect(res).to.have.status(302);

                        Patient.findById(updatedPatientData, function(err, patient) {
                            expect(patient.name.firstName).to.equal(updatedPatientData.name.firstName);
                            expect(patient.name.lastName).to.equal(updatedPatientData.name.lastName);
                            expect(patient.sex).to.equal(updatedPatientData.sex);
                            expect(patient.socialSecurityNumber).to.equal(updatedPatientData.socialSecurityNumber)
                            done();
                        });
                    });
            });
        });
    });

    describe('DELETE endpoint for patients', function() {
        it('Should delete an existing patient based on id', function(done) {
            let patient = new Patient(generatePatientData());

            patient.save(function(err, patient) {
                authenticatedUser
                    .delete(`/clinics/${clinicId}/patients/${patient._id}`)
                    .end(function(err, res) {
                        expect(res).to.have.status(302);
                        done();
                    });
            });
        });
    });
});