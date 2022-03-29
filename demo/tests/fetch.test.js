/* eslint-disable camelcase */
import { jest } from '@jest/globals';
import sha1 from 'sha1';
import { hacheQL } from '../../library/hacheql';

// GLOBAL VARIABLES/CONSTANTS ==================================
const endpointURL = 'chicken-nuggest'; // yes, 'nuggest'
const requestOptions = {
  method: 'POST',
  headers: {
    'Happy-Meal-Toy': 'Bowser in a Mario Kart car',
  },
  body: JSON.stringify(
    {
      query: `{ 
          characters {
            _id
            name
            win_rate
            best_time
            favorite_item
            arch_nemesis {
              name
            }
          }
         }`,
    },
  ),
};
const serverResponse200 = {
  status: 200,
  body: JSON.stringify({
    data: {
      characters: [
        {
          _id: 1,
          name: 'Mario',
          win_rate: '54%',
          best_time: '1:50.713',
          favorite_item: 'Golden Mushroom',
          arch_nemesis: {
            name: 'Bowser',
          },
        },
        {
          _id: 2,
          name: 'Princess Peach',
          win_rate: '78%',
          best_time: '1:23.402',
          favorite_item: 'Bob-omb',
          arch_nemesis: {
            name: 'Luigi',
          },
        },
        {
          _id: 3,
          name: 'Luigi',
          win_rate: '41%',
          best_time: '2:09.250',
          favorite_item: 'Triple Bananas',
          arch_nemesis: {
            name: 'Bowser',
          },
        },
        {
          _id: 4,
          name: 'Bowser',
          win_rate: '48%',
          best_time: '1:56.917',
          favorite_item: 'Piranha Plant',
          arch_nemesis: {
            name: 'Mario',
          },
        },
      ],
    },
  }),
};
const serverResponse304 = {
  status: 304,
};
const serverResponse800 = {
  status: 800,
};

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
    return Promise.resolve(serverResponse800);
  }
  if (options.method === 'POST') {
    return Promise.resolve(serverResponse200);
  }
  return 'Neither GET nor POST request.';
});

// Imitates server responses when the requested hash is present in the server's cache.
// When receiving a GET request: responds with status code 200 and a body of JSON-formatted data, imitating data from a database.
const mockServer_HashFound = jest.fn(() => Promise.resolve(serverResponse200));

// Imitates server responses when the requested hash is present in the server's cache and the requested resource has not been modified.
const mockServer_NotModified = jest.fn(() => Promise.resolve(serverResponse304));

// Simulates an error during the fetch API call.
const mockErrorGET = jest.fn((endpoint, options) => Promise.reject(new Error('Ouch! GET me to a doctor!')));

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
  });

  describe('Should take appropriate action based on different server responses.', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('Should make a followup POST request if the initial GET request receives an 800 response.', async () => {
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

    test('Should catch errors during a GET request', async () => {
      expect.assertions(1);
      global.fetch = mockErrorGET;

      return hacheQL(endpointURL, requestOptions).catch((error) => expect(error.message).toBe('Ouch! GET me to a doctor!'));
    });
  });
});
