const mongoose = require("mongoose");

module.exports = function () {
    mongoose.set('strictQuery', true);
    mongoose.connect('mongodb://127.0.0.1:27017/Apartment_db', { useNewUrlParser: true })
        .then(() => console.log('Connected to MongoDB'))
        .catch((err) => console.log('could not connect to MongoDB', err));
}