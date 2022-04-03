import sha1 from 'sha1';
/**
* @module getWrapper
* @param {string} endpoint - the string representing the endpoint the client would like to query.
* @param {Object} options - options object corresponding to the fetch API specification.
* @returns {Promise} - promise that resolves to the value returned either from the cache or the server, or terminates in an error, unless the error is that the server does not recognize our query param,
* in which case the promise does not resolve until a second fetch is sent and returned.
*/

const uncacheable = { mutation: true, subscription: true };

function hacheQL(endpoint, options) {
  const { query } = JSON.parse(options.body);
  const operationType = query.split('{')[0].trim();
  if (uncacheable[operationType]) {
    return fetch(endpoint, options);
  }
  const newOpts = { ...options, method: 'GET' };
  const HASH = sha1(newOpts.body); // If passed in options object has no body...
  delete newOpts.body;
  return new Promise((resolve, reject) => {
    fetch(`${endpoint}/?hash=${HASH}`, newOpts)
      .then((data) => {
        // Status code 800 is a custom status code.
        // It indicates that the request's hash was not found in the server's cache.
        if (data.status === 800) {
          fetch(`${endpoint}/?hash=${HASH}`, options)
            .then((res) => resolve(res))
            .catch((altErr) => reject(altErr));
        } else {
          resolve(data);
        }
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

export default hacheQL;
