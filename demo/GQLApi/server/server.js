import express from 'express';
import process from 'process';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull,
}
  from 'graphql';

import db from './models/randomModel.js';

const PORT = 7500;

const app = express();
app.use(express.json());

app.use((req, res) => res.sendStatus(404));

app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error!',
    status: 500,
    message: { err: 'An error occurred!' },
  };
  const errorObj = { ...defaultErr, ...err };
  return res.status(errorObj.status).json(errorObj.message);
});

const server = app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

process.on('SIGINT', () => {
  console.log('\nGracefully shutting down API server');
  process.kill(process.pid, 'SIGTERM');
});
