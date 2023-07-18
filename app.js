require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const redisClient = require('./redisClient')
const Agent = require('./routes/agent');

process.on('exit', () => {
    redisClient.quit();
});

process.on('SIGINT', () => {
    redisClient.quit();
    process.exit();
});

app.use(cookieParser());

//*Connecting to MongoDB database server



app.use(express.json());
app.use('/api/agent', Agent);
db();

app.listen(3000, function () {
    console.log("Server started on port 3000");
});