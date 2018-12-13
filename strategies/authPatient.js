const {Strategy: LocalStrategy} = require('passport-local');
const {Strategy: JwtStrategy, ExtractJwt} = require('passport-jwt');
const {Patient} = require('../models/patients');
const {JWT_SECRET} = require('../config');

const patientStrategy = new LocalStrategy((username, password, callback) => {
    let patient;

    Patient
    .findOne({
        username: username
    })
    .then(_patient => {
        patient = _patient;
        if (!patient) {
            return Promise.reject({
                reason: 'LoginError',
                message: 'Incorrect username or password'
            })
        }
        return patient.validatePassword(password);
    })
    .then(isValid => {
        if (!isValid) {
            return Promise.reject({
                reason: 'LoginError',
                message: 'Incorrect username or password'
            })
        }
        return callback(null, patient);
    })
    .catch(err => {
        if (err.reason === 'LoginError') {
            return callback(null, false, err);
        }
        return callback(err, false);
    })

});

const jwtStrategy = new JwtStrategy({
    secretOrKey: JWT_SECRET,
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
    algorithms: ['HS256']
},
    (payload, done) => {
        done(null, payload.patient);
});

module.exports = {patientStrategy, jwtStrategy};

