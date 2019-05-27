'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const expect = chai.expect;

const {Appointment} = require('../../../models/api/appointments');
const {TEST_DATABASE_URL} = require('../../../config');
const {runServer, closeServer} = require('../../../server');

chai.use(chaiHttp);