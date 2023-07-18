const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { config } = require('../config/config')


const baseOptions = {
    discriminatorKey: 'userType',
    collection: 'users',
};

const baseSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 100,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 200
    },
    emailVerificationToken: {
        type: String,
        default: null,
    },
    resetPasswordToken: {
        type: String,
        default: null,
    },
    password: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
}, baseOptions);

baseSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin, userType: this.userType }, config.jwtPrivateKey, { expiresIn: config.jwtExpiresIn });
    return token;
}

const Base = mongoose.model('Base', baseSchema);

module.exports = Base;