import { createClient } from 'redis';

const redisClient = createClient();
redisClient.on('error', (err) => console.log(`Redis connection error ${err}`));

redisClient.connect();
redisClient.on('connect', () => console.log('Redis connection successful'));
