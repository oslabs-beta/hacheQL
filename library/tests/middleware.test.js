import { describe, jest, test } from '@jest/globals';
import { expressHacheQL, nodeHacheQL } from '../hacheql-server';

// Function signature;
// checkHash(request, response, next)
// TODO: write test suite for final middleware, ensuring that url return to original

describe('expressHacheQL - server-side function', () => {
  describe('Cache characteristics', () => {
    test('The cache should be a FIFO heap, with the most recently accessed item moving to the top. It should be configurable to a certain size.', () => {});
  });
  describe('GET', () => {
    describe('Caching lifecycle', () => {
      test('Should send an 800 response and prevent the execution of any subsequent pieces of middleware if the requested hash is not present in the server\'s cache', () => {});
      test(`For a GET request, if the requested hash is present in the cache:
        If on finishing the execution of our function the request method is a:
          POST: The associated query should be stored in req.body
          GET: The associated query should be stored as req.query`, () => {});
    });
    describe('Edge cases', () => {
      test('Should pass the request along to the next piece of middleware if there isn\'t a hash on the search params', () => {});
      test('If there\'s an error in the redis cache, it should error 800 and switch to the local cache.', () => {});
      test('If the redis cache ever errors, ALL subsequent caching should take place in the local memory (potentially update redis cache when back online)', () => {});
    });
  });

  describe('POST', () => {
    test('For a POST request, if there is a hash, it should add the hash and request body to the server\'s cache and invoke the next piece of middleware', () => {});
    test('If there is no hash, it should invoke the next piece of middleware without storing anything in the cache.', () => {});

    test('If there was ever an error reading or writing from the redis cache, the request should instead be stored in the local cache');
    test('If the redis cache is erroring for the first time, switch to the local cache for the memory-life');
  });
  describe('other HTTP methods', () => {
    test('If anything other than a POST or GET is found, we should invoke next (should we also log an error?)', () => {});
  });
});

describe('nodeHacheQL - server-side function', () => {
  describe('Cache characteristics', () => {
    test('The cache should be a FIFO heap, with the most recently accessed item moving to the top. It should be configurable to a certain size.', () => {});
  });
  describe('GET', () => {
    describe('Caching lifecycle', () => {
      test('Should send an 800 response if the requested hash is not present in the server\'s cache', () => {});
    });
    test(`For a GET request, if the requested hash is present in the cache:
        If on finishing the execution of our function the request method is a:
          POST: The associated query should be stored in req.body
          GET: The associated query should be stored as req.query`, () => {});
    describe('Edge cases', () => {
      test('Should pass the request along to the next piece of middleware if there isn\'t a hash on the search params', () => {});
      test('If there\'s an error in the redis cache, it should error 800 and switch to the local cache.', () => {});
      test('If the redis cache ever errors, ALL subsequent caching should take place in the local memory (potentially update redis cache when back online)', () => {});
    });
  });

  describe('POST', () => {
    test('For a POST request, if there is a hash, it should add the hash and request body to the server\'s cache and invoke the next piece of middleware', () => {});
    test('If there is no hash, it should invoke the next piece of middleware without storing anything in the cache.', () => {});

    test('If there was ever an error reading or writing from the redis cache, the request should instead be stored in the local cache');
    test('If the redis cache is erroring for the first time, switch to the local cache for the memory-life');
  });
  describe('other HTTP methods', () => {
    test('If anything other than a POST or GET is found, we should invoke next (should we also log an error?)', () => {});
  });
});

test('Should do something with etags?', () => {
  test('If no hash property in the query string, just hand off control to the next piece of middleware', () => {

  });

  test('It should call next() when it\'s done executing', () => {

  });

  test('Should', () => {

  });

  test('Should', () => {

  });

  test('Should', () => {

  });

  test('Should', () => {

  });
});
