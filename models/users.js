'use strict';

const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const UserSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        default: '',
        required: true
    },
    lastName: {
        type: String,
        default: '',
        required: true
    }
});

UserSchema.methods.validatePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

UserSchema.methods.hashPassword = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

const User = mongoose.model('User', UserSchema);

module.exports = {User};
