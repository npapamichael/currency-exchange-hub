const { createClient } = require('redis');

const redisClient = createClient({
  url: 'redis://redis:6379' // 'redis' is the service name from docker-compose
});

redisClient.on('error', (err) => {
  console.error('❌ Redis connection error:', err);
});

redisClient.on('connect', () => {
  console.log('✅ Connected to Redis');
});

redisClient.connect();

module.exports = redisClient;
