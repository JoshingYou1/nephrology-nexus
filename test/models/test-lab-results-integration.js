'use strict';

const chai = require('chai');
const chaiHttp = require("chai-http");
const faker = require('faker');
const mongoose = require('mongoose');

const expect = chai.expect;

const {LabResults} = require('../../models/lab-results');
const {TEST_DATABASE_URL} = require('../../config');
const {runServer, closeServer} = require('../../server');

chai.use(chaiHttp);

function generateLabResultsData() {
    return {
        _id: new mongoose.Types.ObjectId(),
        date: faker.date.past(2),
        hematology: {
            wbcCount: Number(faker.finance.amount(0,20,2)),
            rbcCount: Number(faker.finance.amount(0,10,2)),
            hemoglobin: Number(faker.finance.amount(0,20,1)),
            hematocrit: Number(faker.finance.amount(0,75,1)),
            plateletCount: Number(faker.finance.amount(0,600,0))
        },
        chemistry: {
            bun: Number(faker.finance.amount(0,75,0)),
            creatinine: Number(faker.finance.amount(0,20,2)),
            sodium: Number(faker.finance.amount(0,250,0)),
            potassium: Number(faker.finance.amount(0,15,1)),
            calcium: Number(faker.finance.amount(0,20,1)),
            phosphorus: Number(faker.finance.amount(0,15,1)),
            albumin: Number(faker.finance.amount(0,10,1)),
            glucose: Number(faker.finance.amount(0,400,0)),
            iron: Number(faker.finance.amount(0,300,0)),
            cholesterol: Number(faker.finance.amount(0,500,0)),
            triglycerides: Number(faker.finance.amount(0,500,0))
        }
    };
}

function seedLabResultsData() {
    console.info('Seeding lab results data');
    const seedData = [];
    for (let i = 1; i <= 10; i++) {
        seedData.push(generateLabResultsData());
    }
    return LabResults.insertMany(seedData);
}

function tearDownDb() {
    return new Promise((resolve, reject) => {
      console.warn('Deleting database');
      mongoose.connection.dropDatabase()
        .then(result => resolve(result))
        .catch(err => reject(err));
    });
}

describe('Clinic API resource', function() {
    before(function() {
        return runServer(TEST_DATABASE_URL);
    });

    beforeEach(function() {
        return seedLabResultsData();
    });

    afterEach(function() {
        return tearDownDb();
    });

    after(function() {
        return closeServer();
    });

    describe('Lab results model', function() {
        it('Should initialize lab results data with the correct fields', function(done) {
            const generatedLabResults = generateLabResultsData();
            const results = new LabResults(generatedLabResults);

            results.save(function(err, result) {
                expect(result).to.exist;
                expect(err).to.not.exist;
                expect(result.date).to.equal(generatedLabResults.date);
                expect(result.hematology.wbcCount).to.equal(generatedLabResults.hematology.wbcCount);
                expect(result.hematology.rbcCount).to.equal(generatedLabResults.hematology.rbcCount);
                expect(result.hematology.hemoglobin).to.equal(generatedLabResults.hematology.hemoglobin);
                expect(result.hematology.hematocrit).to.equal(generatedLabResults.hematology.hematocrit);
                expect(result.hematology.plateletCount).to.equal(generatedLabResults.hematology.plateletCount);
                expect(result.chemistry.bun).to.equal(generatedLabResults.chemistry.bun);
                expect(result.chemistry.creatinine).to.equal(generatedLabResults.chemistry.creatinine);
                expect(result.chemistry.sodium).to.equal(generatedLabResults.chemistry.sodium);
                expect(result.chemistry.potassium).to.equal(generatedLabResults.chemistry.potassium);
                expect(result.chemistry.calcium).to.equal(generatedLabResults.chemistry.calcium);
                expect(result.chemistry.phosphorus).to.equal(generatedLabResults.chemistry.phosphorus);
                expect(result.chemistry.albumin).to.equal(generatedLabResults.chemistry.albumin);
                expect(result.chemistry.glucose).to.equal(generatedLabResults.chemistry.glucose);
                expect(result.chemistry.iron).to.equal(generatedLabResults.chemistry.iron);
                expect(result.chemistry.cholesterol).to.equal(generatedLabResults.chemistry.cholesterol);
                expect(result.chemistry.triglycerides).to.equal(generatedLabResults.chemistry.triglycerides);
                done();
            });
        });

        it('Should not create lab results if required fields are missing', function(done) {
            const generatedLabResults = {};
            const results = new LabResults(generatedLabResults);

            results.save(function(err, result) {
                expect(err).to.exist;
                expect(result).to.not.exist;
                done();
            });
        });
    });
});

module.exports = {generateLabResultsData};