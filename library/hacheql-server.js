function strip(req, key) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const { searchParams } = url;
  const hash = searchParams.get(key);
  url.searchParams.delete(key);
  req.url = `${url.pathname}${url.search}`;
  return { searchParams, hash };
}

let tripwire = false;

export async function nodeHacheQL(req, res, opts, cache = {}, callback = (err, data) => {
  if (err) {
    throw err;
  }
  return data;
}) {
  const internalOpts = opts;
  if (tripwire) {
    delete internalOpts.redis;
  }
  const { redis } = internalOpts;
  const { searchParams, hash } = strip(req, 'hash');
  try {
    if (redis) {
      redis.on('error', () => {
        tripwire = true;
      });
      if (req.method === 'GET') {
        if (hash) {
          const query = await redis.get(hash);
          if (!query) {
            res.statusCode = 800;
            res.send();
            throw new URIError();
          }
          return callback(undefined, JSON.parse(query));
        }
        return callback(undefined, Object.fromEntries(searchParams.entries()));
      }
      if (req.method === 'POST') {
        const query = await (() => (
          new Promise((resolve) => {
            const buffers = [];
            req.on('data', (chunk) => {
              buffers.push(chunk);
            });
            req.on('end', () => {
              resolve(Buffer.concat(buffers).toString());
            });
          })))();
        if (hash) {
          await redis.set(hash, query);
        }
        return callback(undefined, JSON.parse(query));
      }
      return callback();
    }
    const internalCache = cache;
    if (req.method === 'GET') {
      if (hash) {
        if (!internalCache[hash]) {
          res.statusCode = 800;
          res.send();
          throw new URIError();
        }
        return callback(undefined, internalCache[hash]);
      }
      return callback(undefined, Object.fromEntries(searchParams.entries()));
    }
    if (req.method === 'POST') {
      const query = await (() => (
        new Promise((resolve) => {
          const buffers = [];
          req.on('data', (chunk) => {
            buffers.push(chunk);
          });
          req.on('end', () => {
            resolve(Buffer.concat(buffers).toString());
          });
        })
      ))();
      if (hash) {
        internalCache[hash] = query;
      }
      return callback(undefined, JSON.parse(query));
    }
    return callback();
  } catch (e) {
    if (!(e instanceof URIError)) {
      return callback(e);
    }
    return undefined;
  }
}

export function expressHacheQL({ redis }, cache = {}) {
  if (redis) {
    return async function redisHandler(req, res, next) {
      try {
        if (req.method === 'GET') {
          if (Object.hasOwn(req.query, 'hash')) {
            const query = await redis.get(req.query.hash);
            if (!query) {
              return res.sendStatus(800);
            }
            res.locals.cacheable = true;
            req.query = {};
            req.method = 'POST';
            req.body = JSON.parse(query);
          }
          return next();
        }
        if (req.method === 'POST') {
          if (Object.hasOwn(req.query, 'hash')) {
            const query = typeof req.body === 'object' ? JSON.stringify(req.body) : req.body;
            await redis.set(req.query.hash, query);
          }
        }
        return next();
      } catch (e) {
        return next(e);
      }
    };
  }
  const internalCache = cache;
  return function cacheHandler(req, res, next) {
    try {
      if (req.method === 'GET') {
        if (Object.hasOwn(req.query, 'hash')) {
          const query = internalCache[req.query.hash];
          if (!query) {
            return res.sendStatus(800);
          }
          req.query = {};
          req.method = 'POST';
          req.body = query;
        }
        return next();
      }
      if (req.method === 'POST') {
        if (Object.hasOwn(req.query, 'hash')) {
          internalCache[req.query.hash] = req.body;
        }
      }
      return next();
    } catch (e) {
      return next(e);
    }
  };
}

export function httpCache(req, res, next) {
  if (res.locals.cacheable) {
    res.set({
      'Cache-Control': 'max-age=5',
      // If we set E-tag here, it will never update
      // Etag: req.query.hash
    });
  }
  return next();
}

// async function redSwitch(req, res, client, key) {
//  if (req.method === 'GET') {
//    // If our method is GET, check if we've got a key
//    if (key) {
//      // If we do have a key, check for a corresponding query in our cache
//      const cachedQuery = await client.get(key);
//      if (!cachedQuery) {
//        // If there is no corresponding query, set status to 800 and return undefined;
//        res.statusCode = 800;
//      // If we find a corresponding query, return it (as string);
//      } else {
//        return cachedQuery;
//      }
//    }
//    // If no key, return undefined: we don't want to do anything special
//  } else if (req.method === 'POST') {
//    // Otherwise, if we have a post, first check for a body-parsed object
//    if (req.body) {
//      // If we have a req.body, check for a key in our search params
//      if (!key) {
//        /* if we have no key, we're dealing with a graphql post that hasn't
//        * been formatted by our client-side. Return undefined.
//        */
//        return;
//      // Otherise, if we have a key, set the cache and return undefined;
//      }
//      return client.set(key, JSON.stringify(req.body))
//        .then(() => console.log('added to redis cache!'))
//        .catch((e) => console.error(e));
//    }
//    /* if we don't have a req.body (without express, or without body-parser),
//    * set up a listener to create one.
//    */
//    const buffers = [];
//    req.on('data', (chunk) => {
//      buffers.push(chunk);
//    });
//    // return the string representing our query
//    return req.on('end', async () => {
//      const data = Buffer.concat(buffers).toString();
//      /* If there isn't a key, we can't add to our cache.
//      * If there is, we must. Do whichever is appropriate.
//      */
//      if (!key) {
//        return data;
//      }
//      return client.set(key, data)
//        .then(() => data)
//        .catch((e) => console.error(e));
//    });
//  }
// }
//
// function memSwitch(req, res, key, cache) {
//  if (req.method === 'GET') {
//    // If our method is GET, check if we've got a key
//    if (key) {
//      // If we do have a key, check for a corresponding query in our cache
//      const cachedQuery = cache[key];
//      if (!cachedQuery) {
//        // If there is no corresponding query, set status to 800 and return undefined;
//        res.statusCode = 800;
//      // If we find a corresponding query, return it (as string);
//      } else {
//        return cachedQuery;
//      }
//    }
//    // If no key, return undefined: we don't want to do anything special
//  } else if (req.method === 'POST') {
//    // Otherwise, if we have a post, first check for a body-parsed object
//    if (req.body) {
//      // If we have a req.body, check for a key in our search params
//      if (!key) {
//        /* if we have no key, we're dealing with a graphql post that hasn't
//        * been formatted by our client-side. Return undefined.
//        */
//        return;
//      // Otherise, if we have a key, set the cache and return undefined;
//      }
//      cache[key] = req.body;
//      return;
//    }
//    /* if we don't have a req.body (without express, or without body-parser),
//    * set up a listener to create one.
//    */
//    const buffers = [];
//    req.on('data', (chunk) => {
//      buffers.push(chunk);
//    });
//    // return the string representing our query
//    return req.on('end', async () => {
//      const data = buffers.length ? JSON.parse(Buffer.concat(buffers).toString()) : undefined;
//      /* If there isn't a key, we can't add to our cache.
//      * If there is, we must. Do whichever is appropriate.
//      */
//      if (key) {
//        cache[key] = data;
//      }
//      return data;
//    });
//  }
// }
//
// export function nodeHacheQL(req, res, opts = {}) {
//  const key = decode(req);
//  if (opts.redis) {
//    return redSwitch(req, res, opts.redis, key);
//  }
//  return memSwitch(req, res, key);
// }
//
// export function expressHacheQL(opts = {}, cache = {}) {
//  return function (req, res, next) {
//    let result;
//    if (opts.redis) {
//      result = redSwitch(req, res, opts.redis, req.query.hash)
//        .then((data) => {
//          if (data) {
//            return JSON.parse(data);
//          }
//        });
//    } else {
//      result = memSwitch(req, res, req.query.hash, cache);
//    }
//    if (res.statusCode === 800) {
//      res.send();
//      return;
//    }
//    if (result) {
//      req.body = result;
//    }
//    return next();
//  };
// }
//
