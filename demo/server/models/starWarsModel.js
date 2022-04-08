import pg from 'pg';
const { Pool } = pg;

const config = {
  max: 5,
  idleTimeoutMillis: 30000,
};

if (process.env.NODE_ENV === 'development') {
  config.user = 'hqladmin';
  config.database = 'hqldb';
  config.password = 'admin';
  config.host = 'postgres-db';
  config.port = 5432;
} else if (process.env.NODE_ENV === 'production') {
  config.user = process.env.RDS_USERNAME;
  config.database = process.env.RDS_DB_NAME;
  config.password = process.env.RDS_PASSWORD;
  config.host = process.env.RDS_HOSTNAME;
  config.port = process.env.RDS_PORT;
}


const pool = new Pool(config);

pool.on('error', function (err, client) {
  console.error('idle client error', err.message, err.stack);
});

const starWarsModel = {
  query: (text, params, callback) => {
    console.log('executed query', text, params);
    return pool.query(text, params, callback);
  },
};

export const connect = function (cb) {
  return pool.connect(cb);
};

export default starWarsModel;
