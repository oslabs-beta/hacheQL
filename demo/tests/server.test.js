/* eslint-disable jest/expect-expect */
/* eslint-disable arrow-body-style */
import request from 'supertest';
import assert from 'assert';
import testServer from './testServer';
import { hacheQL } from './hacheQL.test';
// import assert from 'assert';

beforeAll(() => testServer.startTestServer());

afterAll(() => testServer.stopTestServer());

describe('Should respond 200 to all requests', () => {
  test('GET request', () => {
    return request(testServer.app)
      .get('/')
      .expect(200)
      .expect({ method: 'GET' });
  });

  test('POST request', () => {
    return request(testServer.app)
      .post('/')
      .expect(200)
      .expect({ method: 'POST' });
  });
});

describe('hacheQLFetch', () => {
  it('Should send a GET request to the passed-in endpoint', async () => {
    let response = await hacheQL(`http://localhost:${testServer.PORT}/graphql`);
    response = await response.json();
    expect(response.method).toBe('GET');
  });
});
