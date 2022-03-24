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
  const HASH = newOpts.body;
  delete newOpts.body;
  return new Promise((resolve, reject) => {
    fetch(`${endpoint}/?hash=${HASH}`, newOpts)
      .then((data) => resolve(data))
      .catch((err) => {
        if (err.message === HASH) {
          fetch(`${endpoint}/?hash=${HASH}`, options)
            .then((data) => resolve(data))
            .catch((altErr) => reject(altErr));
        } else {
          reject(err);
        }
      });
  });
}

// SERVER SIDE
// Middleware for converted get request
    // Verify if SHA256 hash exist in cache
function checkHash(req, res, next) {
  if (req.method === 'GET') {
    // index into redis cache using req.query.hash
    // if the hash isn't there, return next(new Error(req.query.hash))
    // Put query object at req.body.query
    // We don't need to set an etag here
    return next()
  } else if (req.method === 'POST') {
    // save key-value of Hash into Redis
  }
}
    // Return error if not found
    // Else execute query