const {validationResult} = require('express-validator');
const redis = require('redis');
require('dotenv').config();
 
const sendSignal = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    let redisConnection;
    try {
        redisConnection = redis.createClient({
            url: process.env.REDIS_URL
        });

        redisConnection.on('error', (error) => {
            console.error('Redis connection error:', error);
        });

        await redisConnection.connect();

        const { signal, location } = req.body;
        const channel = `traffic_channel_${location}`;
        console.log(`Publishing signal to channel: ${channel}`);

        const signalSuccess = await redisConnection.publish(channel, signal);

        if (signalSuccess >=0) {
            console.log(`Sent to ${signalSuccess} subscribers`);
            return res.status(200).json({ message: 'Signal sent' });
        } 
    } catch (error) {
        console.error('Error sending signal:', error);
        return res.status(500).json({ error: error.message });
    } finally {
        // Ensure Redis connection is closed after the request
        if (redisConnection) {
            await redisConnection.disconnect();
        }
    }
};

module.exports = {sendSignal}
