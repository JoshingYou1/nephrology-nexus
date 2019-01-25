'use strict';

const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const passport = require('passport');
const cors = require('cors');
mongoose.Promise = global.Promise;

const {DATABASE_URL, PORT} = require('./config');
const {localStrategy, registerStrategy} = require('./strategies/auth');
const {User} = require('./models/users');
const {CLIENT_ORIGIN} = require('./config');
const {patientStrategy, jwtStrategy} = require('./strategies/authPatient');

const app = express();

const patientsController = require('./controllers/patientsController');
const clinicsController = require('./controllers/clinicsController');
const labResultsController = require('./controllers/labResultsController');
const usersController = require('./controllers/usersController');
const patientAuthController = require('./controllers/patientAuthController');

const apiPatientsController = require('./controllers/api/apiPatientsController');
const apiAppointmentsController = require('./controllers/api/apiAppointmentsController');
const apiDoctorsController = require('./controllers/api/apiDoctorsController');


app.use(bodyParser());
app.use(methodOverride(function(req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        const method = req.body._method;
        delete req.body._method;
        return method;
    }
}));
app.use(express.static('public'));
app.use(morgan('common'));
app.use(cookieParser('secret'));
app.use(session({secret: process.env.JWT_SECRET}));
app.use(flash());
app.use(
    cors({
        origin: CLIENT_ORIGIN
    })
);

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.redirect('/users/login');
});

passport.use('patientLogin', patientStrategy);
passport.use('jwt', jwtStrategy);
passport.use('local-login', localStrategy);
passport.use('local-register', registerStrategy);
passport.serializeUser(function(user, done) {
    done(null, user._id);
});
passport.deserializeUser(function(_id, done) {
    User.findById(_id, function(err, user) {
        done(err, user);
    });
});
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
    res.locals.user = req.user;
    next();
});
app.use('/users', usersController);
app.use('/clinics', clinicsController);
app.use('/clinics/:clinicId/patients', function(req, res, next) {
    req.clinicId = req.params.clinicId;
    next();
}, patientsController);
app.use('/clinics/:clinicId/patients/:patientId/lab-results', function(req, res, next) {
    req.clinicId = req.params.clinicId;
    req.patientId = req.params.patientId;
    next();
}, labResultsController);
app.use('/patient/auth', patientAuthController);

app.use('/api/patients/:patientId', function(req, res, next) {
    req.patientId = req.params.patientId;
    next();
}, apiPatientsController);
app.use('/api/patients/:patientId/appointments', function(req, res, next) {
    req.patientId = req.params.patientId;
    next();
}, apiAppointmentsController);
app.use('/api/patients/:patientId/doctors', function(req, res, next) {
    req.patientId = req.params.patientId;
    next();
}, apiDoctorsController);

app.use('*', function (req, res) {
    res.status(404).json({ message: 'Not Found' });
  });

let server;
let db;

function runServer(databaseUrl, port = PORT) {
    return new Promise(function(resolve, reject) {
        db = mongoose.connect(databaseUrl, function(err) {
                if (err) {
                    return reject(err);
                }
                server = app.listen(port, function() {
                    console.log(`Your app is listening on port ${port}`);
                    resolve();
                })
                    .on('error', function(err) {
                        mongoose.disconnect();
                        reject(err);
                    });
            });
        });
}

function closeServer() {
    return mongoose.disconnect()
        .then(() => {
            return new Promise(function(resolve, reject) {
                console.log('Closing the server');
                server.close(function(err) {
                    if (err) {
                        return reject(err);
                    }
                    resolve();
                });
            });
        });
}

if (require.main === module) {
    runServer(DATABASE_URL).catch(function(err) {
        console.log(err);
    });
}

module.exports = {db, app, runServer, closeServer};