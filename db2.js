var mysql = require('mysql');
var pool  = mysql.createPool({
  host     : process.env.DB_HOST,
  user     : process.env.DB_USER,
  password : process.env.DB_PASS,
  database: process.env.DB_NAME
});

pool.getConnection(function(err, connection) {
  // connected! (unless `err` is set)
  // connection.release();
});


module.exports = pool;