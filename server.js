"use strict";

const express = require('express');
const morgan = require("morgan");
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const {DATABASE_URL, PORT} = require("./config");

const app = express();

const patientsController = require("./controllers/patientsController");
const clinicsController = require("./controllers/clinicsController");
const labResultsController = require("./controllers/labResultsController");

app.use(express.static('public'));
app.use(morgan("common"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

app.use("/patients", patientsController);
app.use("/clinics", clinicsController);
app.use("/lab-results", labResultsController);
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