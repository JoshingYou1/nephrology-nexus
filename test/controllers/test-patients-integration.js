"use strict";

const chai = require("chai");
const chaiHttp = require("chai-http");

const expect = chai.expect;

const {TEST_DATABASE_URL} = require("../../config");
const {app, runServer, closeServer} = require("../../server");
const {generatePatientData} = require("../models/test-patients-integration");

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
        it("Should add a new patient", function() {

            const newPatient = generatePatientData();
            return chai
                .request(app)
                .post("/patients")
                .send(newPatient)
                .then(function(req, res) {
                    console.log("res.body:", res.body);
                    console.log("req.body:", req.body);
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a("object");
                    expect(res.body).to.include.keys("id", "name", "dateOfBirth", "gender", "socialSecurityNumber", "address", "phoneNumbers");
                    expect(res.body.id).to.not.be.null;
                    expect(res.body.name).to.equal(`${newPatient.name.lastName} ${newPatient.name.firstName}`);
                    expect(res.body.gender).to.equal(newPatient.gender);
                    expect(res.body.socialSecurityNumber).to.equal(newPatient.socialSecurityNumber);
                    return newPatient.findById(res.body.id);
                })
                .then(function(patient) {
                    expect(newPatient.name.firstName).to.equal(patient.name.firstName);
                    expect(newPatient.name.lastName).to.equal(patient.name.lastName);
                    expect(newPatient.gender).to.equal(patient.gender);
                    expect(newPatient.socialSecurityNumber).to.equal(patient.socialSecurityNumber);
                    expect(newPatient.address.street).to.equal(patient.address.street);
                    expect(newPatient.address.city).to.equal(patient.address.city);
                    expect(newPatient.phoneNumbers.home).to.equal(patient.phoneNumbers.home);
                });
        });
    });
});