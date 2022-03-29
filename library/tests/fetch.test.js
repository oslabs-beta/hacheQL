/* eslint-disable camelcase */
import { jest } from '@jest/globals';
import sha1 from 'sha1';
import { hacheQL } from '../hacheql';
import {
  endpointURL,
  requestOptions,
  serverResponse200,
  serverResponse304,
} from './mockReqRes.test';
import {
  getFetchRequestProfile,
  mockServer_HashNotFound,
  mockServer_HashFound,
  mockServer_NotModified,
  mockErrorGET,
  mockErrorPOST,
} from './mockFunctions.test';

/**
* Function signature
* hacheQL(endpoint, options) // IS THE OPTIONS OBJECT OPTIONAL?

* This function signature is designed to mimic the fetch API. (In fact, the function uses the fetch API under the hood.)
* https://developer.mozilla.org/en-US/docs/Web/API/fetch#parameters

* @param {string} endpoint - The endpoint for the GraphQL requests. Analogous to the fetch API's 'resource' parameter.
* @param {object} options - An object containing settings for the request; for example, the HTTP request method, headers, and request body. Analogous to the fetch API's 'init' parameter. All valid settings for the fetch API's 'init' object are valid for this function's options object.
* @returns {promise} - A promise that resolves to a response object from the server, or rejects with an error object.
*/

// TESTS =======================================================
describe('hacheQL() - client-side wrapper for fetch()', () => {
  describe('Should return a promise', () => {
    test('Should return a promise', async () => {
      expect.assertions(1);
      global.fetch = () => Promise.resolve(true);
      const immediateValue = hacheQL(endpointURL, requestOptions);
      expect(immediateValue).toBeInstanceOf(Promise);
    });
  });

  describe('Should default to sending a GET request with the following characteristics:', () => {
    let hacheQLFetchRequestProfile;

    beforeAll(async () => {
      // Mock the fetch API.
      global.fetch = getFetchRequestProfile;
      hacheQLFetchRequestProfile = await hacheQL(endpointURL, requestOptions);
    });

    test('Should make a GET request to the passed-in endpoint.', async () => {
      expect.assertions(2);
      expect(getFetchRequestProfile).toBeCalledTimes(1);
      expect(hacheQLFetchRequestProfile.method).toBe('GET');
    });

    test('The * entire * request body should be hashed with SHA-1 and appended to the endpoint URL as a query parameter with a key of \'hash\'.', async () => {
      expect.assertions(1);
      const HASH = sha1(requestOptions.body);
      expect(hacheQLFetchRequestProfile.endpoint).toBe(`${endpointURL}/?hash=${HASH}`);
    });

    test('The headers passed to the fetch API should match those passed to the hacheQL function.', async () => {
      expect.assertions(2);
      expect(hacheQLFetchRequestProfile.headers).toBe(requestOptions.headers);
      expect(Object.hasOwn(hacheQLFetchRequestProfile, 'body')).toBe(false);
    });

    test('The body passed to the hacheQL function should NOT be included in the options object passed to the fetch API.', async () => {
      expect.assertions(1);
      expect(Object.hasOwn(hacheQLFetchRequestProfile, 'body')).toBe(false);
    });

    test('If it receives 800, followup request options should be identical to the passed in request options', async () => {
      global.fetch = mockServer_HashNotFound;
      await hacheQL(endpointURL, { ...requestOptions, method: 'DELETE' });
      expect(mockServer_HashNotFound.mock.calls.length).toBe(2);
      expect(mockServer_HashNotFound.mock.calls[1][1].method).toBe('DELETE');
    });
  });

  describe('Should take appropriate action based on different server responses.', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('Should make a followup request if the initial GET request receives an 800 response.', async () => {
      expect.assertions(2);
      global.fetch = mockServer_HashNotFound;
      const response = await hacheQL(endpointURL, requestOptions);
      expect(mockServer_HashNotFound).toBeCalledTimes(2);
      expect(response).toEqual(serverResponse200);
    });

    test('Should return data from the server if the response has a status code of 200.', async () => {
      expect.assertions(2);
      global.fetch = mockServer_HashFound;
      const response = await hacheQL(endpointURL, requestOptions);
      expect(mockServer_HashFound).toBeCalledTimes(1);
      expect(response).toEqual(serverResponse200);
    });

    test('Should return data from the server if the response has a status code of 304.', async () => {
      expect.assertions(1);
      global.fetch = mockServer_NotModified;
      const response = await hacheQL(endpointURL, requestOptions);
      expect(response).toEqual(serverResponse304);
    });
  });

  describe('Should handle errors gracefully', () => {
    async function hacheQLAttempt() {
      try {
        const response = await hacheQL(endpointURL, requestOptions);
        return response;
      } catch (error) {
        return error;
      }
    }

    test('Should catch errors during a GET request', async () => {
      expect.assertions(1);
      global.fetch = mockErrorGET;

      // The Jest documentation suggests writing this test like this:
      // https://jestjs.io/docs/asynchronous#promises
      // return hacheQL(endpointURL, requestOptions).catch((error) => expect(error.message).toBe('Ouch! GET me to a doctor!'));

      // But ESLint recommends doing it this way instead:
      // https://github.com/jest-community/eslint-plugin-jest/blob/v26.1.3/docs/rules/no-conditional-expect.md
      // (See both the rest of this 'test' block and the top of this 'describe' block.)

      // Also, note that 'errors thrown inside asynchronous functions will act like uncaught errors.'
      // That tripped me up for a while.
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch#gotchas_when_throwing_errors

      const result = await (hacheQLAttempt());
      expect(result).toEqual(new Error('Ouch! GET me to a doctor!'));
    });

    test('Should catch errors during a followup POST request', async () => {
      expect.assertions(1);
      global.fetch = mockErrorPOST;

      const result = await (hacheQLAttempt());
      expect(result).toEqual(new Error('Yikes! This one\'s going to need a POSTmortem!'));
    });
  });
});
