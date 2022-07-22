/* eslint-disable camelcase */
import { jest } from '@jest/globals';
import {
  serverResponse200,
  serverResponse304,
  serverResponseHashNotFound,
} from './mockReqRes';

// MOCK FUNCTIONS ==============================================
// These functions are used in the tests in place of the actual fetch API.

// Returns an object with metadata about the HTTP request being sent.
const getFetchRequestProfile = jest.fn((endpoint, { method, headers, body }) => {
  const fetchRequest = {};
  if (endpoint !== undefined) fetchRequest.endpoint = endpoint;
  if (method !== undefined) fetchRequest.method = method;
  if (headers !== undefined) fetchRequest.headers = headers;
  if (body !== undefined) fetchRequest.body = body;

  return Promise.resolve(fetchRequest);
});

// Imitates server responses when the requested hash is not present in the server's cache.
// When receiving a GET request: responds with status code 800.
// When receiving a POST request: responds with status code 200 and a body of JSON-formatted data, imitating data from a database.
const mockServer_HashNotFound = jest.fn((endpoint, options) => {
  if (options.method === 'GET') {
    return Promise.resolve(serverResponseHashNotFound);
  }
  if (options.method === 'POST') {
    return Promise.resolve(serverResponse200);
  }
  return Promise.resolve('Neither a GET nor POST request. Weird...');
});

// Imitates server responses when the requested hash is present in the server's cache.
// When receiving a GET request: responds with status code 200 and a body of JSON-formatted data, imitating data from a database.
const mockServer_HashFound = jest.fn(() => Promise.resolve(serverResponse200));

// Imitates server responses when the requested hash is present in the server's cache and the requested resource has not been modified.
const mockServer_NotModified = jest.fn(() => Promise.resolve(serverResponse304));

// Simulates an error during the fetch API call.
const mockErrorGET = jest.fn(() => Promise.reject(new Error('Ouch! GET me to a doctor!')));
const mockErrorPOST = jest.fn((endpoint, options) => {
  if (options.method === 'GET') {
    return Promise.resolve(serverResponseHashNotFound);
  }
  if (options.method === 'POST') {
    return Promise.reject(new Error('Yikes! This one\'s going to need a POSTmortem!'));
  }
  return Promise.resolve('Neither a GET nor POST request. Weird...');
});

export {
  getFetchRequestProfile,
  mockServer_HashNotFound,
  mockServer_HashFound,
  mockServer_NotModified,
  mockErrorGET,
  mockErrorPOST,
};
