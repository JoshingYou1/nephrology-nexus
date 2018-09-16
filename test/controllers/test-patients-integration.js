"use strict";

const chai = require("chai");
const chaiHttp = require("chai-http");

const expect = chai.expect;

const {TEST_DATABASE_URL} = require("../../config");
const {app, runServer, closeServer} = require("../../server");
const {generatePatientData} = require("../models/test-patients-integration");
const {Patient} = require("../../models/patients");

chai.use(chaiHttp);

describe("Patient controller", function() {
    before(function() {
        return runServer(TEST_DATABASE_URL);
    });

    after(function() {
        return closeServer();
    });

    describe("GET endpoint for patients", function() {
        it("Should retrieve all existing patients", function() {
            let res;

            return chai
                .request(app)
                .get("/patients")
                .then(function(_res) {
                    res = _res;
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a("object");
                });
            });
        });

    describe("POST endpoint for patients", function() {
        it("Should create a new patient", function() {

            const newPatient = generatePatientData();
            return chai
                .request(app)
                .post("/patients")
                .send(newPatient)
                .then(function(res) {
                    expect(res).to.have.status(201);
                    expect(res.body).to.be.a("object");
                    return Patient
                        .findOne({"name.firstName": newPatient.name.firstName, "name.lastName": newPatient.name.lastName,
                            'socialSecurityNumber': newPatient.socialSecurityNumber})
                .then(function(createdPatient) {
                    console.log("createdPatient:", createdPatient);
                    expect(createdPatient.patientName).to.equal(`${newPatient.name.lastName}, ${newPatient.name.firstName}`);
                    expect(createdPatient.gender).to.equal(newPatient.gender);
                    expect(createdPatient.socialSecurityNumber).to.equal(newPatient.socialSecurityNumber);
                });     
            });
        });
    });

    describe("PUT endpoint for patients", function() {
        it("Should update the data of an existing patient", function() {
            const updatedPatientData = {
                name: {
                    firstName: "Joseph",
                    lastName: "Richardson"
                },
                gender: "Male",
                socialSecurityNumber: "232-13-1422",
            };

            return Patient
                .findOne()
                .then(function(patient) {
                    updatedPatientData.id = patient.id;

                    return chai
                        .request(app)
                        .put(`/patients/${patient.id}`)
                        .send(updatedPatientData)
                })
                .then(function(res) {
                    expect(res).to.have.status(204);
                    return Patient.findById(updatedPatientData.id);
                })
                .then(function(patient) {
                    expect(patient.name.firstName).to.equal(updatedPatientData.name.firstName);
                    expect(patient.name.lastName).to.equal(updatedPatientData.name.lastName);
                    expect(patient.gender).to.equal(updatedPatientData.gender);
                    expect(patient.socialSecurityNumber).to.equal(updatedPatientData.socialSecurityNumber);
                });
        });
    });

    describe("DELETE endpoint for patients", function() {
        it("Should delete an existing patient based on id", function() {
            let patient;

            return Patient
                .findOne()
                .then(function(_patient) {
                    patient = _patient;

                    return chai
                        .request(app)
                        .delete(`/patients/${patient.id}`);
                })
                .then(function(res) {
                    expect(res).to.have.status(204);
                    return Patient.findById(patient.id);
                })
                .then(function(_patient) {
                    expect(_patient).to.be.null;
                });
        });
    });
});