const mongoose = require('mongoose');

const ApartmentSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 100
    },
    image: [{
        type: String,
        required: true
    }],
    location: {
        type: {
            type: String,
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            required: true
        },
        formattedAddress: String,
        city: {
            type: String,
            required: true
        },
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 255
    },
    agent: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Agent",
        required: true
    }],
    available: {
        type: String,
        enum: ['available', 'unavailable', 'rented'],
        default: 'available'
    },
    bedrooms: {
        type: Number,
        required: true
    },
    bathrooms: {
        type: Number,
        required: true
    },
    petPolicy: String,
    amenities: [String],
    createdAt: {
        type: Date,
        default: Date.now
    },
    reviews: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'RegularUser' },
            rating: { type: Number, min: 1, max: 5 },
            comment: String,
            createdAt: { type: Date, default: Date.now },
        },
    ],
});

ApartmentSchema.index({ location: '2dsphere' });

const Apartment = mongoose.model('Apartment', ApartmentSchema);


module.exports = Apartment;