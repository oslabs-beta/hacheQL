import sha1 from 'sha1';

/*
* @module getWrapper
* @param {string} query - the string representing the query the client would like to make to the GraphQL service.
* @params {object} rest parameter representing arguments, except for the method, to be passed to the fetch.
* @returns {promise} - promise that resolves to the value returned either from the cache or the server, or terminates in an error, unless the error is that the server does not recognize our query param,
* in which case the promise does not resolve until a second fetch is sent and returned.
*/

// CLIENT SIDE
function hacheQL(endpoint, options) {
  // The value of the body property should already be JSON string.
  // (I.e., the developer using the package should have stringified it themselves before passing the options object to our function.)
  // TODO: are these really the only differences between GET and POST?
  const newOpts = { ...options, method: 'GET' };
  // const HASH = newOpts.body;
  const HASH = sha1(options.body);
  delete newOpts.body;
  return new Promise((resolve, reject) => {
    fetch(`${endpoint}/?hash=${HASH}`, newOpts)
      .then((data) => {
        // Status code 800 is a custom status code.
        // It indicates that the request's hash was not found in the server's cache.
        if (data.status === 800) {
          fetch(`${endpoint}/?hash=${HASH}`, options)
            .then((data) => { console.log(data); resolve(data); })
            .catch((altErr) => reject(altErr));
        } else {
          resolve(data);
        }
        // this would mean the third or greater request to the same endpoint so it should be returning the database query?
      })
      .catch((err) => {
        console.log(err);
        // if (err.message === HASH) {
        // fetch(endpoint, options)
        // .then((data) => resolve(data))
        // .catch((altErr) => reject(altErr));
        // }
        // else {
        reject(err);
        // }
      });
  });
}

const fakeCache = {};

// SERVER SIDE
// Middleware for converted get request
// Verify if SHA256 hash exist in cache
function checkHash(req, res, next) {
  if (req.method === 'GET') {
    const { hash } = req.query;
    // index into redis cache using req.query.hash
    if (Object.hasOwn(fakeCache, hash)) {
      // Put query object at req.body.query
      req.body = fakeCache[hash];
      // if the hash isn't there, return next(new Error(req.query.hash))
      // What status code should we send?
      const cacheError = new Error();
      cacheError.message = req.query.hash;
      return res.status(800).json(cacheError);
    }
    // We don't need to set an etag here
  } else if (req.method === 'POST') {
    console.log(req.body);
    fakeCache[req.query.hash] = req.body;
    return next();
    // save key-value of Hash into Redis
  }
  return next();
}
export { hacheQL, checkHash };
