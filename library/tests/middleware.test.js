import { describe, expect, jest, test } from '@jest/globals';
import httpMocks from 'node-mocks-http';
import { expressHacheQL, nodeHacheQL } from '../hacheql-server';

// Function signature;
// checkHash(request, response, next)
// TODO: write test suite for final middleware, ensuring that url return to original

describe('expressHacheQL - server-side function', () => {
  let cache;

  const mockReq = {
    method: 'GET',
    url: '/?hash=arbitraryh4sh',
    originalUrl: '/graphql?hash=arbitraryh4sh',
    headers: {
      accepts: 'application/json',
      'Content-Type': 'application/json',
    },
    query: {
      hash: 'arbitraryh4sh',
    },
  };

  const mockReqFollowupPOST = {
    method: 'POST',
    url: '/?hash=arbitraryh4sh',
    originalUrl: '/graphql?hash=arbitraryh4sh',
    headers: {
      accepts: 'application/json',
      'Content-Type': 'application/json',
    },
    body: {
      query: '{me{name}}',
      operationName: 'doTheThing',
      variables: { myVariable: 'someValue' },
    },
    query: {
      hash: 'arbitraryh4sh',
    },
  };

  let req;
  let res;
  let next;

  beforeEach(() => {
    jest.clearAllMocks();
    cache = {};
    req = httpMocks.createRequest(mockReq);
    res = httpMocks.createResponse();
    next = jest.fn(() => { console.log('called next'); });
  });

  describe('Cache characteristics', () => {
    it.skip('The cache should be a FIFO heap, with the most recently accessed item moving to the top. It should be configurable to a certain size.', () => {});
  });

  describe('GET', () => {
    it('Should send an 800 response and prevent the execution of any subsequent pieces of middleware if the requested hash is not present in the server\'s cache', async () => {
      const configuredMiddleware = expressHacheQL({}, cache);
      configuredMiddleware(req, res, next);
      expect(res.statusCode).toBe(800);
      expect(next).toBeCalledTimes(0);
    });

    // This test assume's we're caching in local memory.
    describe(`For a GET request, if the requested hash is present in the cache:
              If on finishing the execution of our function the request method is a:
              POST: The associated GraphQL document should be stored at req.body
              GET: The associated GraphQL document should be stored at req.query`, () => {
      it('Caching in local memory', () => {
        // The requested hash is present in the cache.
        cache = {
          // arbitraryh4sh: '{"query":"{me{name}}","operationName":"doTheThing","variables":{"myVariable":"someValue"}}',
          arbitraryh4sh: {
            query: '{me{name}}',
            operationName: 'doTheThing',
            variables: { myVariable: 'someValue' },
          },
          otherhash: 'incorrect GraphQL document',
        };

        const configuredMiddleware = expressHacheQL({}, cache);
        configuredMiddleware(req, res, next);

        if (req.method === 'GET') {
          expect(typeof req.query).toBe('object');
          expect(req.query).toEqual(cache.arbitraryh4sh);
        }

        // JC - technically, this test is not being tested if our mock req object is a GET method right? Additionally, using our middleware, we wouldnt be checking cache under a POST request
        if (req.method === 'POST') {
          expect(typeof req.body).toBe('object');
          expect(req.body).toEqual(cache.arbitraryh4sh);
        }
      });
      // JC - Checking cache using an external cache (redis)? Would we check cache under POST method similar to line 92
      it('Caching in an external cache (Redis)', async () => {
        // The requested hash is present in the cache.
        const fakeRedisCache = {
          arbitraryh4sh: '{"query":"{me{name}}","operationName":"doTheThing","variables":{"myVariable":"someValue"}}',
          otherhash: 'incorrect GraphQL document',
        };

        const fakeRedisClient = {
          get: jest.fn((key) => fakeRedisCache[key]),
        };

        const configuredMiddleware = expressHacheQL({ redis: fakeRedisClient });
        await configuredMiddleware(req, res, next);

        if (req.method === 'GET') {
          expect(typeof req.query).toBe('object');
          expect(req.query).toEqual(JSON.parse(fakeRedisCache.arbitraryh4sh));
        }

        if (req.method === 'POST') {
          expect(typeof req.body).toBe('object');
          expect(req.body).toEqual(JSON.parse(fakeRedisCache.arbitraryh4sh));
        }
      });
    });

    it('Should pass the request along to the next piece of middleware if there isn\'t a hash on the search params', () => {
      const newMockReq = { ...mockReq, query: {} };
      const newMockRes = {
        randoProperty: {
          value: 'rando',
        },
      };

      const reqCopy = JSON.parse(JSON.stringify(newMockReq));
      const resCopy = JSON.parse(JSON.stringify(newMockRes));

      const configuredMiddleware = expressHacheQL({}, cache);
      configuredMiddleware(reqCopy, resCopy, next);

      expect(reqCopy).toEqual(newMockReq);
      expect(resCopy).toEqual(newMockRes);
      expect(next).toBeCalledTimes(1);

      // And what if there's no 'query' property on the request object at all?
      delete newMockReq.query;
      const reqCopyWithNoQuery = JSON.parse(JSON.stringify(newMockReq));

      configuredMiddleware(reqCopyWithNoQuery, resCopy, next);

      expect(reqCopyWithNoQuery).toEqual(newMockReq);
      expect(resCopy).toEqual(newMockRes);
      expect(next).toBeCalledTimes(2);
    });

    it.skip('If there\'s an error in the Redis cache, it should error 800 and switch to the local cache.', async () => {
      // This will simulate the Redis client being down.
      const fakeRedisClient = {
        get: jest.fn(() => Promise.reject(new Error('Error occurred while accessing the Redis cache.'))),
      };

      // Configure our middleware function to use the Redis client.
      const configuredMiddleware = expressHacheQL({ redis: fakeRedisClient }, cache);
      // Simulate our function running as part of a middleware chain.
      await configuredMiddleware(req, res, next);

      // Expect to receive and 800 error here.
      expect(res.statusCode).toBe(800);

      // Then send a followup post.
      const followupRequest = httpMocks.createRequest(mockReqFollowupPOST);
      const followupResponse = httpMocks.createResponse();
      await configuredMiddleware(followupRequest, followupResponse, next);

      // JC - should we be expecting the cache store to be in object per our last discussion?
      // Expect the key-value pair of hash-query to be saved in the local cache object.
      expect(cache.arbitraryh4sh).toBe(JSON.stringify({
        query: '{me{name}}',
        operationName: 'doTheThing',
        variables: { myVariable: 'someValue' },
      }));
    });

    xit('If the redis cache ever errors, ALL subsequent caching should take place in the local memory (potentially update redis cache when back online)', () => {});
  });

  xdescribe('POST', () => {
    it('For a POST request, if there is a hash, it should add the hash and request body to the server\'s cache and invoke the next piece of middleware', () => {});
    it('If there is no hash, it should invoke the next piece of middleware without storing anything in the cache.', () => {});

    it('If there was ever an error reading or writing from the redis cache, the request should instead be stored in the local cache', () => {});
    it('If the redis cache is erroring for the first time, switch to the local cache for the memory-life', () => {});
  });
  xdescribe('other HTTP methods', () => {
    it('If anything other than a POST or GET is found, we should invoke next (should we also log an error?)', () => {});
  });
});

xdescribe('nodeHacheQL - server-side function', () => {
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

    test('If there was ever an error reading or writing from the redis cache, the request should instead be stored in the local cache', () => {});
    test('If the redis cache is erroring for the first time, switch to the local cache for the memory-life', () => {});
  });
  describe('other HTTP methods', () => {
    test('If anything other than a POST or GET is found, we should invoke next (should we also log an error?)', () => {});
  });
});
