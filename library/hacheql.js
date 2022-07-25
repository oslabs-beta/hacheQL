import sha1 from 'sha1';
/**
* @module hacheQL
*/

// Uncacheable GraphQl operation types - HacheQL will pass unaffected
const uncacheable = { mutation: true, subscription: true };

/**
* @param {string} endpoint - the string representing the endpoint the client would like to query.
* @param {Object} options - options object corresponding to the fetch API specification.
* @returns {Promise} - promise that resolves to the value returned either from the cache or the server,
* or terminates in an error, unless the error is that the server does not recognize our query param,
* in which case the promise does not resolve until a second fetch is sent and returned.
*/

function hacheQL(endpoint, options) {
  // If the body is undefined then let the request pass through as is
  if (!Object.hasOwn(options, 'body')) {
    return fetch(endpoint, options);
  }
  // Check if operation type is uncacheable, if so pass through as is
  const { query } = JSON.parse(options.body);
  const operationType = query.split('{')[0].trim();
  if (Object.hasOwn(uncacheable, operationType)) {
    return fetch(endpoint, options);
  }
  // Reconstruct request as a GET request to make response HTTP cacheable
  // Hash body to store with URL constraint
  const newOpts = { ...options, method: 'GET' };
  const HASH = sha1(newOpts.body);
  delete newOpts.body;
  // Construct new Promise to allow wrapper function to behave as a normal fetch
  return new Promise((resolve, reject) => {
    fetch(`${endpoint}/?hash=${HASH}`, newOpts)
      .then((data) => {
        // Status 303 indicates that hash is not found in server cache
        // Upon receipt, send original request as follow-up
        if (data.status === 303) {
          fetch(`${endpoint}/?hash=${HASH}`, options)
            .then((res) => resolve(res))
            .catch((altErr) => reject(altErr));
        } else {
          resolve(data);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export default hacheQL;
