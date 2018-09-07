"use strict";

const chai = require("chai");
const chaiHttp = require("chai-http");
const faker = require("faker");
const mongoose = require("mongoose");

const expect = chai.expect;

const {Patient} = require("../models/patients");
const {TEST_DATABASE_URL} = require("../config");
const {app, runServer, closeServer} = require("../server");

chai.use(chaiHttp);

function generateGender() {
    const genders = ["male", "female"];
    return genders[Math.floor(Math.random() * genders.length)];
}

function generatePatientData() {
    return {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        dateOfBirth: faker.date.past(),
        gender: generateGender(),
        socialSecurityNumber: faker.helpers.replaceSymbolWithNumber("###-##-####"),
        address: {
            street: faker.address.streetAddress("###"),
            city: faker.address.city(3),
            state: faker.address.stateAbbr(),
            zipCode: faker.address.zipCode("#####")
        },
        phoneNumbers: {
            home: faker.phone.phoneNumberFormat(1),
            cell: faker.phone.phoneNumberFormat(1),
            work: faker.phone.phoneNumberFormat(1)
        }
    };
}

function seedPatientData() {
    console.info("Seeding patient data");
    const seedData = [];
    for (let i = 1; i <= 10; i++) {
        seedData.push(generatePatientData());
    }
    return Patient.insertMany(seedData);
}

function tearDownDb() {
    return new Promise((resolve, reject) => {
      console.warn("Deleting database");
      mongoose.connection.dropDatabase()
        .then(result => resolve(result))
        .catch(err => reject(err));
    });
  }

describe("Patient API resource", function() {
    before(function() {
        return runServer(TEST_DATABASE_URL);
    });

    beforeEach(function() {
        return seedPatientData();
    });

    afterEach(function() {
        return tearDownDb();
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
                    expect(res.body).to.have.lengthOf.at.least(1);
                    return Patient.count();
                })
                .then(function(patient) {
                    expect(res.body).to.have.lengthOf(patient);
                })
        });
    });

    it("Should return patients with the correct fields", function() {
        let resPatient;
        return chai
            .request(app)
            .get("/patients")
            .then(function(res) {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a("array");
                expect(res.body).to.have.lengthOf.at.least(1);
                
                res.body.forEach(function(patient) {
                    expect(patient).to.be.a("object");
                    expect(patient).to.include.keys("id", "firstName", "lastName", "dateOfBirth", "gender", "socialSecurityNumber", "address",
                    "phoneNumbers");
                });
                resPatient = res.body[0];
                return Patient.findById(resPatient.id)
            })
            .then(function(patient) {
                expect(resPatient.firstName).to.equal(patient.firstName);
                expect(resPatient.lastName).to.equal(patient.lastName);
                expect(resPatient.dateOfBirth).to.equal(patient.dateOfBirth);
                expect(resPatient.gender).to.equal(patient.gender);
                expect(resPatient.socialSecurityNumber).to.equal(patient.socialSecurityNumber);
                expect(resPatient.address).to.equal(patient.address);
                expect(resPatient.phoneNumbers).to.equal(patient.phoneNumbers);
            });
    });


});