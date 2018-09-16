"use strict";

const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../server");

const expect = chai.expect;

chai.use(chaiHttp);

describe("HTML page", function() {
    it("Should be there", function() {
        return chai
            .request(app)
            .get("/")
            .then(function(res) {
                expect(res).to.have.status(200);
            });
    });
});
