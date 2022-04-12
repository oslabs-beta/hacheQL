import express from 'express';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import process from 'process';
import { graphqlHTTP } from 'express-graphql';
import schema from './graphql/types';
import { expressHacheQL, httpCache } from 'hacheql/server';

const PORT = 3000;

// ESM model for __dirname
const folderPath = dirname(fileURLToPath(import.meta.url));

const app = express();

app.use(express.json());

// serve static files
app.use(express.static(path.resolve(folderPath, '../build')));

// graphiql req
app.use(
  '/graphql',
  expressHacheQL({}),
  httpCache,
  graphqlHTTP({
    schema,
    graphiql: true,
  }),
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

function shutdown() {
  try {
    console.log('Successfully shutting down.');
    process.exit(0);
  } catch (e) {
    console.log('Error in shutdown process.');
    console.error(e);
    process.exit(1);
  }
}

process.on('SIGTERM', () => {
  console.log('caught SIGTERM.');
  shutdown();
});

process.on('SIGINT', () => {
  console.log('\nGracefully shutting down API server');
  shutdown();
});
