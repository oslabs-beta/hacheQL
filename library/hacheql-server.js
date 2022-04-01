function decode(req) {
  return (new URL(req.url, `http://${req.headers.host}`)).searchParams.get('hash');
}

async function redSwitch(req, res, client, key) {
  if (req.method === 'GET') {
    // If our method is GET, check if we've got a key
    if (key) {
      // If we do have a key, check for a corresponding query in our cache
      const cachedQuery = await client.get(key);
      if (!cachedQuery) {
        // If there is no corresponding query, set status to 800 and return undefined;
        res.statusCode = 800;
      // If we find a corresponding query, return it (as string);
      } else {
        return cachedQuery;
      }
    }
    // If no key, return undefined: we don't want to do anything special
  } else if (req.method === 'POST') {
    // Otherwise, if we have a post, first check for a body-parsed object
    if (req.body) {
      // If we have a req.body, check for a key in our search params
      if (!key) {
        /* if we have no key, we're dealing with a graphql post that hasn't
        * been formatted by our client-side. Return undefined.
        */
        return;
      // Otherise, if we have a key, set the cache and return undefined;
      } else {
        return client.set(key, JSON.stringify(req.body))
          .then(() => console.log('added to redis cache!'))
          .catch((e) => console.error(e));
      }
    }
    /* if we don't have a req.body (without express, or without body-parser),
    * set up a listener to create one.
    */
    const buffers = [];
    req.on('data', (chunk) => {
      buffers.push(chunk);
    });
    // return the string representing our query
    return req.on('end', async () => {
      const data = Buffer.concat(buffers).toString();
      /* If there isn't a key, we can't add to our cache.
      * If there is, we must. Do whichever is appropriate.
      */
      if (!key) {
        return data;
      }
      return client.set(key, data)
        .then(() => data)
        .catch((e) => console.error(e));
    });
  }
}

function memSwitch(req, res, key, cache) {
  if (req.method === 'GET') {
    // If our method is GET, check if we've got a key
    if (key) {
      // If we do have a key, check for a corresponding query in our cache
      const cachedQuery = cache[key];
      if (!cachedQuery) {
        // If there is no corresponding query, set status to 800 and return undefined;
        res.statusCode = 800;
      // If we find a corresponding query, return it (as string);
      } else {
        return cachedQuery;
      }
    }
    // If no key, return undefined: we don't want to do anything special
  } else if (req.method === 'POST') {
    // Otherwise, if we have a post, first check for a body-parsed object
    if (req.body) {
      // If we have a req.body, check for a key in our search params
      if (!key) {
        /* if we have no key, we're dealing with a graphql post that hasn't
        * been formatted by our client-side. Return undefined.
        */
        return;
      // Otherise, if we have a key, set the cache and return undefined;
      } else {
        cache[key] = req.body;
        return;
      }
    }
    /* if we don't have a req.body (without express, or without body-parser),
    * set up a listener to create one.
    */
    const buffers = [];
    req.on('data', (chunk) => {
      buffers.push(chunk);
    });
    // return the string representing our query
    return req.on('end', async () => {
      const data = buffers.length ? JSON.parse(Buffer.concat(buffers).toString()) : undefined;
      /* If there isn't a key, we can't add to our cache.
      * If there is, we must. Do whichever is appropriate.
      */
      if (key) {
        cache[key] = data;
      }
      return data;
    });
  }
}

function nodeHacheQL(req, res, opts = {}) {
  const key = decode(req);
  if (opts.redis) {
    return redSwitch(req, res, opts.redis, key);
  }
  return memSwitch(req, res, key);
}

export function expressHacheQL(opts = {}, cache = {}) {
  return function (req, res, next) {
    let result;
    if (opts.redis) {
      result = redSwitch(req, res, opts.redis, req.query.hash)
        .then((data) => {
          if (data) {
            return JSON.parse(data)
          }
          return;
        });
    } else {
      result = memSwitch(req, res, req.query.hash, cache);
    }
    if (res.statusCode === 800) {
      res.send();
      return;
    }
    if (result) {
      req.body = result;
    }
    return next();
  };
}

export function httpCache(req, res, next) {
  if (req.method === 'GET') {
    res.set({
      'Cache-Control': 'no-cache',
      // If we set E-tag here, it will never update
      // Etag: req.query.hash
    });
  }
  return next();
}
