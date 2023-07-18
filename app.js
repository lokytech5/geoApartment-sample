require('dotenv').config();
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const redisClient = require('./db/redisClient')
const Apartment = require('./routes/apartment');
const db = require('./db/db');

process.on('exit', () => {
    redisClient.quit();
});

process.on('SIGINT', () => {
    redisClient.quit();
    process.exit();
});

app.use(cookieParser());

app.use(express.json());
app.use('/api/apartment', Apartment);
db();

app.listen(5000, function () {
    console.log("Server started on port 3000");
});