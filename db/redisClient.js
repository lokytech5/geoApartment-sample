const { createClient } = require('redis');

module.exports = function () {
    return new Promise((resolve, reject) => {
        const redisClient = createClient({
            host: '127.0.0.1',
            port: '6379',
        });

        redisClient.on('error', (err) => {
            console.log('Error ' + err);
            reject(err);
        });

        redisClient.connect()
            .then(() => {
                console.log('Connected to Redis');
                resolve(redisClient);
            })
            .catch((err) => {
                console.log('Redis client could not connect', err);
                reject(err);
            });
    });
}
