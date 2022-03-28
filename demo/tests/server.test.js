import http from 'http';
import request from 'supertest';
import assert from 'assert';
// import app from '../server/server';

// All this stuff creates a mini-server that I can use to test functions individually.
import express from 'express';

const app = express();
app.get((req, res) => res.status(404).send('Not found'));

let server;
beforeAll(() => new Promise((resolve, reject) => {
  server = http.createServer(app);
  server.listen(3000, (error) => {
    if (error) {
      reject(error);
    }
    console.log('Listening on port 3000...');
    resolve();
  });
}));

afterAll(() => new Promise((resolve, reject) => {
  server.close((error) => {
    if (error) {
      reject(error);
    }
    console.log('Server on port 3000 has been stopped.');
    resolve();
  });
}));

describe('Test routes', () => {
  // eslint-disable-next-line arrow-body-style
  it('should respond to unkown routes with 404', () => {
    return request(server)
      .get('/bagelbites')
      .expect(404);
  });
});
