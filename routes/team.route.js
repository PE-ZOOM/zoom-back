
const express = require('express');
const router = express.Router();
const connection_pool = require('../db2');

// GET - Retrieve all of the data from table team dropdown
router.get('/', (req, res) => {
  connection_pool.getConnection(function(error, conn) {
      if (error) throw err; // not connected!

          conn.query('SELECT * FROM Team', (err, results) => {

            conn.release();

            if (err) {
              res.status(500).json({
                error: err.message,
                sql: err.sql,
              });
            } else {
              res.json(results);
            }
          });
  });
});
    

module.exports = router;