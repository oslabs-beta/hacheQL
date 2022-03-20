import express from 'express';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import process from 'process';
import db from './models/randomModel';
import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull,
}
  from 'graphql';

const PORT = 3000;

// ESM model for __dirname
const folderPath = dirname(fileURLToPath(import.meta.url));

const app = express();

app.use(express.json());

// serve static files
app.use(express.static(path.resolve(folderPath, '../build')));

// catch all for pages not found
app.use((req, res) => res.sendStatus(404));

// error handler
app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error!',
    status: 500,
    message: { err: 'An error occurred!' },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  return res.status(errorObj.status).json(errorObj.message);
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

process.on('SIGINT', () => {
  console.log('\nGracefully shutting down API server');
  process.kill(process.pid, 'SIGTERM');
});
