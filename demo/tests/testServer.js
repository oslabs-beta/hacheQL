// All this stuff creates a mini-server that I can use to test functions individually.
import http from 'http';
import express from 'express';

const app = express();
app.use((req, res) => res.status(200).json({ method: req.method }));

let server;
const PORT = 3000;

function startTestServer() {
  return new Promise((resolve, reject) => {
    server = http.createServer(app);
    server.listen(PORT, (error) => {
      if (error) {
        reject(error);
      }
      console.log(`Listening on port ${PORT}...`);
      resolve();
    });
  });
}

function stopTestServer() {
  return new Promise((resolve, reject) => {
    server.close((error) => {
      if (error) {
        reject(error);
      }
      console.log('Server on port 3000 has been stopped.');
      resolve();
    });
  });
}

export default {
  app, server, PORT, startTestServer, stopTestServer,
};
