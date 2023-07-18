const mongoose = require('mongoose');
const Base = require('./base');
const agent = Base.discriminator('Agent', new mongoose.Schema({
    isPhoneVerified: {
        type: Boolean,
        default: false
    },
    verificationSid: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 25
    },
    agencyName: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 255
    },
    address: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 255
    },
    age: {
        type: Number,
        required: true,
        minlength: 1,
        maxlength: 3
    },
    createdAt: { type: Date, default: Date.now },
    analytics: {
        views: { type: Number, default: 0 },
        clicks: { type: Number, default: 0 },
        leads: { type: Number, default: 0 }
    },
    apartment: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Apartment"
    }]
}));

module.exports = agent;