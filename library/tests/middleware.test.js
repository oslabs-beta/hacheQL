import { describe, jest } from '@jest/globals';
import { expressHacheQL, nodeHacheQL } from '../hacheql-server';

// Function signature;
// checkHash(request, response, next)
// TODO: write test suite for final middleware, ensuring that url return to original 

describe('expressHacheQL - server-side function', () => {
  describe('GET', () => {
    describe('Caching lifecycle', () => {
      test('Should send an 800 response if the requested hash is not present in the server\'s cache', () => {});
    });
    test(
      `For a GET request, if the requested hash is present in the cache:
        If on finishing the execution of our function the request method is a:
          POST: The associated query should be stored in req.body
          GET: The associated query should be stored as req.query`, () => {});
    describe('Edge cases', () => {

    })
  });

  describe('POST', () => {

  });

  describe('other HTTP methods', () => {
    test('For a POST request, should add the hash and request body to the server\'s cache', () => {});
  });



  test('Should do something with etags?', () => {

  });

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