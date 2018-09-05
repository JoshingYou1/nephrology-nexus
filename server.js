"use strict";

const express = require('express');
const morgan = require("morgan");

const app = express();

const patientsRouter = require("./patientsRouter");
const clinicsRouter = require("./clinicsRouter");
const labResultsRouter = require("./labResultsRouter");

app.use(express.static('public'));
app.use(morgan("common"));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

app.use("/patients", patientsRouter);
app.use("/clinics", clinicsRouter);
app.use("/lab-results", labResultsRouter);

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