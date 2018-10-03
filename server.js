"use strict";

const express = require('express');
const morgan = require("morgan");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const session = require("express-session");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const passport = require('passport');
mongoose.Promise = global.Promise;

const {DATABASE_URL, PORT} = require("./config");
const {localStrategy, registerStrategy} = require('./strategies/auth');
const {User} = require('./models/users');

const app = express();

const patientsController = require("./controllers/patientsController");
const clinicsController = require("./controllers/clinicsController");
const labResultsController = require("./controllers/labResultsController");
const usersController = require('./controllers/usersController');

app.use(bodyParser());
app.use(methodOverride(function(req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        const method = req.body._method;
        delete req.body._method;
        return method;
    }
}));
app.use(express.static('public'));
app.use(morgan("common"));
app.use(cookieParser('secret'));
app.use(session({ cookie: {maxAge: 60000 }}));
app.use(flash());

app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.redirect('/users/login');
});


passport.use('local-login', localStrategy);
passport.use('local-register', registerStrategy);
passport.serializeUser((user, done) => {
    done(null, user._id);
});
passport.deserializeUser((_id, done) => {
    User.findById(_id, (err, user) => {
        done(err, user);
    });
});
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
    console.log('user:', req.user);
    res.locals.user = req.user;
    next();
});
app.use('/users', usersController);
app.use("/clinics", clinicsController);
app.use("/clinics/:clinicId/patients", (req, res, next) =>{
    req.clinicId = req.params.clinicId;
    next();
}, patientsController);
app.use("/clinics/:clinicId/patients/:patientId/lab-results", function(req, res, next) {
    req.clinicId = req.params.clinicId;
    req.patientId = req.params.patientId;
    next();
}, labResultsController);


app.use('*', function (req, res) {
    res.status(404).json({ message: 'Not Found' });
  });

let server;

function runServer(databaseUrl, port = PORT) {
    return new Promise(function(resolve, reject) {
        mongoose.connect(databaseUrl, err => {
            if (err) {
                return reject(err);
            }
            server = app.listen(port, () => {
                console.log(`Your app is listening on port ${port}`);
                resolve();
            })
                .on("error", err => {
                    mongoose.disconnect();
                    reject(err);
                });
        });
    });
}

function closeServer() {
    return mongoose.disconnect()
        .then(() => {
            return new Promise((resolve, reject) => {
                console.log("Closing the server");
                server.close(err => {
                    if (err) {
                        return reject(err);
                    }
                    resolve();
                });
            });
        });
}

if (require.main === module) {
    runServer(DATABASE_URL).catch(err => console.log(err));
}

module.exports = {app, runServer, closeServer};