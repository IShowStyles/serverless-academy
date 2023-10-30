const {Pool} = require('pg');

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
      this.pool = new Pool({
        user: 'your_username',
        host: 'localhost',
        database: 'your_database',
        password: 'your_password',
        port: 5432,
      });

      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS users (
          "id" SERIAL PRIMARY KEY,
          "username" VARCHAR(50) UNIQUE NOT NULL,
          "email" VARCHAR(100) UNIQUE NOT NULL,
          "refreshToken" VARCHAR(100) NOT NULL
          "accessToken" VARCHAR(100) NOT NULL
          "expiresIn" bigint NOT NULL,
          "createdAt" timestamp with time zone NOT NULL DEFAULT now()
        )`;

      await this.pool.query(createTableQuery);
    }
    return this.pool;
  }
  async close() {
    if (this.pool) {
      await this.pool.end();
      this.pool = null;
    }
  }
}

const instance = new Database();

module.exports = instance;