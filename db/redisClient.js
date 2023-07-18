const { createClient } = require('redis');

const redisClient = createClient({
    host: '127.0.0.1',
    port: '6379',
});

redisClient.on('error', (err) => {
    console.log('Error ' + err);
});

// Add the async function to connect the client
const connectClient = async () => {
    try {
        await redisClient.connect();
        console.log('Connected to Redis');
    } catch (err) {
        console.log('Redis client could not connect', err);
    }
};

// Call the function
connectClient();

module.exports = redisClient;
