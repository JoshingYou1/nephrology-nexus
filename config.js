'use strict';

exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost/nephrology-nexus';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://localhost/test-nephrology-nexus';
exports.PORT = process.env.PORT || 8080;