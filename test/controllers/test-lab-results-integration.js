'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const request = require('supertest');
const {TEST_DATABASE_URL} = require('../../config');
const faker = require('faker');
const {app, runServer, closeServer} = require('../../server');
const {generateLabResultsData} = require('../models/test-lab-results-integration');
const {generateClinicData} = require('../models/test-clinics-integration');
const {generatePatientData} = require('../models/test-patients-integration');
const {LabResults} = require('../../models/lab-results');
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

describe('Lab results controller', function() {
    let clinicId = '';
    let patientId = '';

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

        const patient = new Patient(generatePatientData());
        patient.clinic = clinicId;
        patient.save(function(err, patient) {
            patientId = patient._id;

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
    });

    describe('GET endpoint for lab results', function() {
        it('Should retrieve all existing lab results that belong to a single patient', function(done) {
            let res;
        
            authenticatedUser
                .get(`/clinics/${clinicId}/patients/${patientId}/lab-results`)
                .then(function(_res) {
                    res = _res;
                    expect(res).to.have.status(200);
                    expect(res).to.be.a('object');
                    done();
                });
        });
    });

    describe('POST endpoint for lab results', function() {
        it('Should create new lab results data', function(done) {
            const newLabResults = generateLabResultsData();
            newLabResults.patient = patientId;
            
            authenticatedUser
                .post(`/clinics/${clinicId}/patients/${patientId}/lab-results`)
                .send(newLabResults)
                .then(function(res) {
                    expect(res).to.have.status(302);
                    expect(res.body).to.be.a('object');
                    return LabResults
                        .findOne({
                            'hematology.wbcCount': newLabResults.hematology.wbcCount,
                            'hematology.rbcCount': newLabResults.hematology.rbcCount,
                            'hematology.hemoglobin': newLabResults.hematology.hemoglobin,
                            'chemistry.bun': newLabResults.chemistry.bun,
                            'chemistry.sodium': newLabResults.chemistry.sodium,
                            'chemistry.albumin': newLabResults.chemistry.albumin
                        })
                })
                        .then(function(createdLabResults) {
                            expect(createdLabResults.hematology.wbcCount).to.equal(newLabResults.hematology.wbcCount);
                            expect(createdLabResults.hematology.rbcCount).to.equal(newLabResults.hematology.rbcCount);
                            expect(createdLabResults.hematology.hemoglobin).to.equal(newLabResults.hematology.hemoglobin);
                            expect(createdLabResults.chemistry.bun).to.equal(newLabResults.chemistry.bun);
                            expect(createdLabResults.chemistry.sodium).to.equal(newLabResults.chemistry.sodium);
                            expect(createdLabResults.chemistry.albumin).to.equal(newLabResults.chemistry.albumin);
                            done();
                        });
        });
    });

    describe('PUT endpoint for lab results', function() {
        it('Should update the data of an existing set of lab results', function(done) {
            const updatedLabResultsData = {
                hematology: {
                    wbcCount: 6.22,
                    rbcCount: 4.93,
                    hemoglobin: 15.7
                },
                chemistry: {
                    bun: 53,
                    sodium: 128,
                    albumin: 3.7
                }
            };

            let results = new LabResults(generateLabResultsData());

            results.save(function(err, results) {
                updatedLabResultsData._id = results._id;

                authenticatedUser
                    .put(`/clinics/${clinicId}/patients/${patientId}/lab-results/${results._id}`)
                    .send(updatedLabResultsData)
                    .end(function(err, res) {
                        expect(res).to.have.status(302);

                        LabResults.findById(updatedLabResultsData, function(err, results) {
                            expect(results.hematology.wbcCount).to.equal(updatedLabResultsData.hematology.wbcCount);
                            expect(results.hematology.rbcCount).to.equal(updatedLabResultsData.hematology.rbcCount);
                            expect(results.hematology.hemoglobin).to.equal(updatedLabResultsData.hematology.hemoglobin);
                            expect(results.chemistry.bun).to.equal(updatedLabResultsData.chemistry.bun);
                            expect(results.chemistry.sodium).to.equal(updatedLabResultsData.chemistry.sodium);
                            expect(results.chemistry.albumin).to.equal(updatedLabResultsData.chemistry.albumin);
                            done();
                        });
                    });
            });
        });
    });

    describe('DELETE endpoint for lab results', function() {
        it('Should delete an existing set of lab results based on id', function(done) {
            let results = new LabResults(generateLabResultsData());

            results.save(function(err, results) {
                authenticatedUser
                    .delete(`/clinics/${clinicId}/patients/${patientId}/lab-results/${results._id}`)
                    .end(function(err, res) {
                        expect(res).to.have.status(302);
                        done();
                    });
            });
        });
    });
});