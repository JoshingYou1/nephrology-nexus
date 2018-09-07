"use strict";

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const clinicSchema = mongoose.Schema({
    name: {type: String, required: true},
    address: {
        street: {type: String},
        city: {type: String},
        state: {type: String},
        zipcode: {type: Number}
    },
    phoneNumber: {type: String, required: true},
    faxNumber: {type: String, required: true},
    clinicManager: {type: String, required: true}
});

clinicSchema.virtual("addressString").get(function() {
    return `Street: ${this.address.street}\n
            City: ${this.address.city}\n
            State: ${this.address.state}\n
            Zipcode: ${this.address.zipcode}`;
});

clinicSchema.methods.serialize() = function() {
    return {
        id: this._id,
        name: this.name,
        address: this.addressString,
        phoneNumber: this.phoneNumber,
        faxNumber: this.faxNumber,
        clinicManager: this.clinicManager
    };
};

const Clinic = mongoose.model("Clinic", clinicSchema);

module.exports = {Clinic};
