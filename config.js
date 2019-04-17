'use strict';

exports.CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:3000';
exports.JWT_SECRET = process.env.JWT_SECRET || 'helloworld';
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';
exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://joshingyou:suzumebachi1@ds137862.mlab.com:37862/nephrology-nexus-db';
// exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost/nephrology-nexus';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://localhost/test-nephrology-nexus';
exports.PORT = process.env.PORT || 8080;