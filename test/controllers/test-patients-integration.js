"use strict";

const chai = require("chai");
const chaiHttp = require("chai-http");

const expect = chai.expect;

const {TEST_DATABASE_URL} = require("../../config");
const {app, runServer, closeServer} = require("../../server");

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
});