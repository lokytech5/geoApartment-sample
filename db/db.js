const mongoose = require("mongoose");

module.exports = function () {
    return new Promise((resolve, reject) => {
        mongoose.set('strictQuery', true);
        mongoose.connect('mongodb://127.0.0.1:27017/Apartment_db', { useNewUrlParser: true })
            .then(() => {
                console.log('Connected to MongoDB')
                resolve();
            })
            .catch((err) => {
                console.log('Could not connect to MongoDB', err);
                reject(err);
            });
    });
}
