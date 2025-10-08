// config/DB-Config.js
require("dotenv").config();
const { Pool } = require("pg");

let pool;

function createPool() {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  pool.on("error", (err) => {
    console.error("Unexpected PostgreSQL client error:", err);
  });

  return pool;
}

// Initialize pool
createPool();

async function query(sql, params) {
  if (!pool) createPool();
  let client;
  try {
    client = await pool.connect();
    const res = await client.query(sql, params);
    return res;
  } catch (err) {
    console.error("Database query error:", err.message);
    // If connection terminated, recreate pool
    if (err.message.includes("terminated")) {
      console.log("Recreating PostgreSQL pool...");
      createPool();
    }
    throw err;
  } finally {
    if (client) client.release();
  }
}

module.exports = { query };
