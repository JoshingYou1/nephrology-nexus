'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const {Patient} = require('./patients');

const clinicSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String, required: true},
    address: {
        street: {type: String, required: true},
        city: {type: String, required: true},
        state: {type: String, required: true},
        zipCode: {type: Number, required: true}
    },
    phoneNumber: {type: String, required: true},
    faxNumber: {type: String, required: true},
    clinicManager: {
        firstName: {type: String, required: true},
        lastName: {type: String, required: true}
    },
    patients: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient'
    }]
});

clinicSchema.pre('remove', async function(next) {
    await Patient.find({clinic: this._id})
            .then(function(patients) {
                patients.forEach(async function(p) {
                    await p.remove(function(err) {
                        if (err) {
                            console.log(`Failed to remove patient ${p._id}:`, err);
                        }
                    });
                });
            });
    next();
});

clinicSchema.virtual('managerName').get(function() {
    return `${this.clinicManager.firstName} ${this.clinicManager.lastName}`;
});

const Clinic = mongoose.model('Clinic', clinicSchema);

module.exports = {Clinic};
