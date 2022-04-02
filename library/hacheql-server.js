import { createClient } from 'redis';

async function checkHash(req, res, next) {
  const redisClient = createClient();
  redisClient.on('error', (err) => console.log(`Redis connection error ${err}`));

  redisClient.connect();
  redisClient.on('connect', () => console.log('Redis connection successful'));

  if (req.method === 'GET') {
    const { hash } = req.query;

    const hashExist = await redisClient.exists(hash, (err) => {
      if (err) console.log(err);
    });

    if (hashExist) {
      const response = await redisClient.get(hash, (err) => console.log(err));
      req.body = JSON.parse(response);
    } else {
      return res.sendStatus(800);
    }

    // We don't need to set an etag here
  } else if (req.method === 'POST') {
    // should only apply for non mutations
    const uncacheable = ['mutation', 'subscription'];
    const query = req.body.query;
    const operationType = query.split('{')[0].trim();
    if (!uncacheable.includes(operationType)) {
    // save key-value of Hash into Redis
      await redisClient.set(req.query.hash, JSON.stringify(req.body), (err) => {
        if (err) console.log(err);
      });
    }
    return next();
  }
  return next();
}

function httpCache(req, res, next) {
  if (req.method === 'GET') {
    res.set({
      'Cache-Control': 'max-age=5',
      // If we set E-tag here, it will never update
      // Etag: req.query.hash
    });
  }
  return next();
}

export { checkHash, httpCache };
