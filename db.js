// config/db.js
require('dotenv').config();
const mysql = require('mysql2/promise');

module.exports = mysql.createPool({
  host            : process.env.DB_HOST     || 'localhost',
  user            : process.env.DB_USER     || 'root',
  password        : process.env.DB_PASS     || '',
  database        : process.env.DB_NAME     || 'homelink',
  waitForConnections: true,
  connectionLimit   : 10,
  queueLimit        : 0
});
