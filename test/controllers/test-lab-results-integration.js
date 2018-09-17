'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const {TEST_DATABASE_URL} = require('../../config');
const {app, runServer, closeServer} = require('../../server');
const {generateLabResultsData} = require('../models/test-lab-results-integration');
const {LabResults} = require('../../models/lab-results');

const expect = chai.expect;

chai.use(chaiHttp);

describe('Lab results controller', function() {
    before(function() {
        return runServer(TEST_DATABASE_URL);
    });

    after(function() {
        return closeServer();
    });

    describe('GET endpoint for lab results', function() {
        it('Should retrieve all existing lab results', function() {
            let res;

            return chai
                .request(app)
                .get('/lab-results')
                .then(function(_res) {
                    res = _res;
                    expect(res).to.have.status(200);
                    expect(res).to.be.a('object');
                });
        });
    });

    describe('POST endpoint for lab results', function() {
        it('Should create new lab results data', function() {
            const newLabResults = generateLabResultsData();

            return chai
                .request(app)
                .post('/lab-results')
                .send(newLabResults)
                .then(function(res) {
                    expect(res).to.have.status(201);
                    expect(res.body).to.be.a('object');
                    return LabResults
                        .findOne({'hematology.wbcCount': newLabResults.hematology.wbcCount, 'hematology.rbcCount': newLabResults.hematology.rbcCount,
                            'hematology.hemoglobin': newLabResults.hematology.hemoglobin, 'chemistry.bun': newLabResults.chemistry.bun,
                            'chemistry.sodium': newLabResults.chemistry.sodium, 'chemistry.albumin': newLabResults.chemistry.albumin})
                })
                .then(function(createdLabResults) {
                    expect(createdLabResults.hematology.wbcCount).to.equal(newLabResults.hematology.wbcCount);
                    expect(createdLabResults.hematology.rbcCount).to.equal(newLabResults.hematology.rbcCount);
                    expect(createdLabResults.hematology.hemoglobin).to.equal(newLabResults.hematology.hemoglobin);
                    expect(createdLabResults.chemistry.bun).to.equal(newLabResults.chemistry.bun);
                    expect(createdLabResults.chemistry.sodium).to.equal(newLabResults.chemistry.sodium);
                    expect(createdLabResults.chemistry.albumin).to.equal(newLabResults.chemistry.albumin);
                });
        });
    });

    describe('PUT endpoint for lab results', function() {
        it('Should update the data of an existing set of lab results', function() {
            const updatedLabResults = {
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
            }

            return LabResults
                .findOne()
                .then(function(results) {
                    updatedLabResults.id = results.id

                    return chai
                        .request(app)
                        .put(`/lab-results/${results.id}`)
                        .send(updatedLabResults)   
                })
                .then(function(res) {
                    expect(res).to.have.status(204);
                    return LabResults.findById(updatedLabResults.id);
                })
                .then(function(results) {
                    expect(results.hematology.wbcCount).to.equal(updatedLabResults.hematology.wbcCount);
                    expect(results.hematology.rbcCount).to.equal(updatedLabResults.hematology.rbcCount);
                    expect(results.hematology.hemoglobin).to.equal(updatedLabResults.hematology.hemoglobin);
                    expect(results.chemistry.bun).to.equal(updatedLabResults.chemistry.bun);
                    expect(results.chemistry.sodium).to.equal(updatedLabResults.chemistry.sodium);
                    expect(results.chemistry.albumin).to.equal(updatedLabResults.chemistry.albumin);
                });
        });
    });

    describe('DELETE endpoint for lab results', function() {
        it('Should delete an existing set of lab results based on id', function() {
            let results;

            return LabResults
                .findOne()
                .then(function(_results) {
                    results = _results;

                    return chai
                        .request(app)
                        .delete(`/lab-results/${results.id}`);
                })
                .then(function(res) {
                    expect(res).to.have.status(204);
                    return LabResults.findById(results.id);
                })
                .then(function(_results) {
                    expect(_results).to.be.null;
                });
        });
    });
});