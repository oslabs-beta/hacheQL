import { jest } from '@jest/globals';
import { checkHash } from '../hacheql';

// Function signature;
// checkHash(request, response, next)

describe('checkHash - server-side function', () => {
  test('Should send an 800 response if the requested hash is not present in the server\'s cache', () => {

  });

  // Maybe remove this test
  test('When sending an 800 response, should include the requested hash in the response body', () => {

  });

  test('For a POST request, should add the hash and request body to the server\'s cache', () => {

  });

  test('For a GET request, if the requested hash is present in the cache, should store the associated persisted request body on req.body', () => {

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
