"use strict";

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

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

clinicSchema.virtual("addressString").get(function() {
    return `Street: ${this.address.street}\n
            City: ${this.address.city}\n
            State: ${this.address.state}\n
            Zipcode: ${this.address.zipcode}`;
});

clinicSchema.virtual('managerName').get(function() {
    return `Clinic Manager: ${this.clinicManager.firstName} ${this.clinicManager.lastName}`;
})

clinicSchema.methods.serialize = function() {
    return {
        id: this._id,
        name: this.name,
        address: this.addressString,
        phoneNumber: this.phoneNumber,
        faxNumber: this.faxNumber,
        clinicManager: this.managerName
    };
};

const Clinic = mongoose.model("Clinic", clinicSchema);

module.exports = {Clinic};
