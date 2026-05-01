const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(50) UNIQUE NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS favorites (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      anime_id INTEGER NOT NULL,
      anime_name VARCHAR(255),
      anime_image VARCHAR(255),
      anime_score VARCHAR(10),
      anime_kind VARCHAR(50),
      created_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(user_id, anime_id)
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS watch_history (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      anime_id INTEGER NOT NULL,
      anime_name VARCHAR(255),
      anime_image VARCHAR(255),
      watched_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(user_id, anime_id)
    )
  `);
}

module.exports = { pool, initDb };
