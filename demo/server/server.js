import express from 'express';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import process from 'process';
import db from './models/starWarsModel';
import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull,
}
  from 'graphql';

import { graphqlHTTP } from 'express-graphql';
import types from './graphql/types';
// import { v4 as uuid } from 'uuid';
import { checkHash } from '../../library/hacheql';

const PORT = 3000;

// ESM model for __dirname
const folderPath = dirname(fileURLToPath(import.meta.url));

const app = express();

app.use(express.json());

// serve static files
app.use(express.static(path.resolve(folderPath, '../build')));

// test middleware
// const persistedQuery = (req, res, next) => {
//   console.log("this is req" + req.url)

//   next();
// }

// simple cache:
app.get('/graphql', checkHash, (req, res) => res.json('wazzup?'));

// graphiql req
app.post('/graphql',
  (req, res, next) => { console.log('request received'); return next(); },
  graphqlHTTP({
    schema: types.schema,
    graphiql: true,
  })
);

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
