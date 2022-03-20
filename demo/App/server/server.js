import express from 'express';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const PORT = 3000;
const app = express();

// ESM model for __dirname
const folderPath = dirname(fileURLToPath(import.meta.url));

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
