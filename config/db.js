require("dotenv").config({
  path: require("path").resolve(__dirname, "../.env"),
});

const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Test the database connection
(async () => {
  try {
    const client = await pool.connect();
    // console.log("Connected to the database successfully!");
    client.release();
  } catch (err) {
    // console.error("Error connecting to the database:", err);
  }
})();

module.exports = pool;
