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
    if (!req.body.mutation) {
    // save key-value of Hash into Redis
      await redisClient.set(req.query.hash, JSON.stringify(req.body), (err) => {
        if (err) console.log(err);
      });
    }
    return next();
  }
  return next();
}

export { checkHash };
