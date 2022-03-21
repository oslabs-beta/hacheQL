import pg from 'pg';

const { Pool } = pg;
const PG_URI = 'postgres://localhost:5432';

const pool = new Pool({
  connectionString: PG_URI,
});

const randomModel = {
  query: (text, params, callback) => {
    console.log('executed query', text);
    return pool.query(text, params, callback);
  },
};

export default randomModel;
