'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const request = require('supertest');
const {TEST_DATABASE_URL} = require('../../../config');
const faker = require('faker');
const jwt = require('jsonwebtoken');
const {app, runServer, closeServer} = require('../../../server');
const {generateAppointmentData} = require('../../models/api/test-appointments-integration');
const {generatePatientData} = require('../../models/test-patients-integration');
const {Appointment} = require('../../../models/api/appointments');
const {Patient} = require('../../../models/patients');
const secret = 'neverShareYourSecret';
const JWT_EXPIRY = '7d';


const expect = chai.expect;

chai.use(chaiHttp);

const authenticatedUser = request.agent(app);
const patient = new Patient(generatePatientData());

describe('Appointment controller', function() {
    let patientId;
    let userCredentials;
    let token;

    before(function() {
        return runServer(TEST_DATABASE_URL);
    });

    after(function() {
        return closeServer();
    });

    before(function (done) {
        userCredentials = {
            username: patient.username,
            password: patient.password
        };
        token = jwt.sign({patient}, secret, {
            subject: patient.username,
            expiresIn: JWT_EXPIRY,
            algorithm: 'HS256'
        });
        patient.save(function(err, patient) {
            patientId = patient._id;

            authenticatedUser
            .post('/api/patient/auth/login')
            .send(userCredentials)
            .set('Authorization', `Bearer ${token}`)
            .end(function (err, response) {
                console.log("authenticatedUser.end");
                console.log(err);
                expect('Location', `/api/patients/${patientId}/appointments`);
                expect(response.statusCode).to.equal(302);
                done();
            });

            // authenticatedUser
            //     .post('/api/patient/auth/login')
            //     .send(userCredentials)
            //     .set('Authorization', `Bearer ${token}`)
            //     .end(function (err, response) {
            //         expect('Location', `/api/patients/${patientId}/appointments`);
            //         expect(response.statusCode).to.equal(302);
            //         done();
            //     });
        });
    });

    describe('GET endpoint for appointments', function() {
        it('Should retrieve all existing appointments that belong to a given user', function(done) {
            let res;

            token = jwt.sign({patient}, secret, {
                subject: patient.username,
                expiresIn: JWT_EXPIRY,
                algorithm: 'HS256'
            });
    
            authenticatedUser
                // .post('/api/patient/auth/login')
                // .send(userCredentials)
                .get(`/api/patients/${patientId}/appointments`)
                .set('Authorization', `Bearer ${token}`)
                .then(function(_res) {
                    res = _res;
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res.body).to.be.a('array')
                    done();
                });
        });

        // it("Should return appointments with the correct fields", function(done) {
        //     let resAppointment;

        //     token = jwt.sign({patient}, secret, {
        //         subject: patient.username,
        //         expiresIn: JWT_EXPIRY,
        //         algorithm: 'HS256'
        //     });
        //     console.log('token', token);
        //     console.log('patientId', patientId);
            
        //     authenticatedUser
        //         .get(`/api/patients/${patientId}/appointments`)
        //         .set('Authorization', `Bearer ${token}`)
        //         .then(function(res) {
        //             expect(res).to.have.status(200);
        //             expect(res).to.be.json;
        //             expect(res.body).to.be.a('array')
    
        //             res.body.forEach(function(appointment) {
        //                 expect(appointment).to.be.a('object');
        //                 expect(appointment).to.include.keys('_id', 'description', 'date', 'time', 'with', 'title', 'where', 'address', 'phoneNumber');
        //             });
        //             resAppointment = res.body[0];
        //             return Appointment.findById(resAppointment._id)
        //         })
        //         .then(function(appointment) {
        //             expect(resAppointment.description).to.equal(appointment.description);
        //             expect(resAppointment.time).to.equal(appointment.time);
        //             expect(resAppointment.with).to.equal(appointment.with);
        //             done();
        //         });
        // });
    });
});