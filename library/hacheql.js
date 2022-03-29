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
  // * should be implenting a method to hash the query
  const HASH = 'banana'
  delete newOpts.body;
  console.log(HASH);
  return new Promise((resolve, reject) => {
    fetch(`${endpoint}/?hash=${HASH}`, newOpts)
      .then((data) => {
        // Status code 800 is a custom status code.
        // It indicates that the request's hash was not found in the server's cache.
        if (data.status === 800) {
          fetch(`${endpoint}/?hash=${HASH}`, options)
            .then((data) => resolve(data))
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

export { hacheQL };
