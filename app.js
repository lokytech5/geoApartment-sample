require('dotenv').config();
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const connectRedisClient = require('./db/redisClient')
const Apartment = require('./routes/apartment');
const db = require('./db/db');

app.use(cookieParser());

app.use(express.json());
app.use('/api/apartment', Apartment);

Promise.all([connectRedisClient(), db()])
    .then(([redisClient]) => {
        process.on('exit', () => {
            redisClient.quit();
        });

        process.on('SIGINT', () => {
            redisClient.quit();
            process.exit();
        });

        app.listen(5000, function () {
            console.log("Server started on port 5000");
        });
    })
    .catch(err => {
        console.error('Failed to connect to MongoDB or Redis:', err);
        process.exit(1);
    });