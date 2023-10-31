import pg from 'pg';

const {Pool} = pg;

const dbOptions = {
  user: process.env.PG_USER,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
}

class Database {
  constructor() {
    this.pool = null;
  }

  async init() {
    if (!this.pool) {
      this.pool = new Pool(dbOptions);

      let createTableQuery = `
        CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`
      createTableQuery += `CREATE TABLE IF NOT EXISTS users (
          id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
          username VARCHAR(50) UNIQUE NOT NULL,
          email VARCHAR(100) UNIQUE NOT NULL,
          refreshToken VARCHAR(255) NOT NULL,
          accessToken VARCHAR(255) NOT NULL,
          createdAt timestamp with time zone NOT NULL DEFAULT now(),
          updatedAt timestamp with time zone NOT NULL DEFAULT now()
        );`;
      await this.pool.query(createTableQuery);
    }
    return this.pool;
  }

  async queries(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.pool.query(sql,params, (err, res) => {
        if (err) {
          return reject(err);
        }
        resolve(res.rows[0]);
      });
    })
  }
}

export default new Database();