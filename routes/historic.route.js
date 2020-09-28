// We always need to require express in every route file
const express = require('express');
// We create the express router
const router = express.Router();
// We require the database connection configuration
const connection_pool = require('../db2');
const passport = require('passport');

//http://localhost:5000/historic
router.post('/',passport.authenticate('jwt', { session: false }),(req, res) => {

    const informClick = req.body;
    connection_pool.getConnection(function(error, conn) {
      if (error) throw err; // not connected!

        
      conn.query('INSERT INTO historic SET ?', informClick, (err, results) => {
        conn.release();
        if (err) {
          return res.status(500).json({
            error: err.message,
            sql: err.sql,
          });
        }
        return connection_pool.getConnection(function(error, conn2) {

          conn2.query('SELECT * FROM historic WHERE id = ?', results.insertId, (err2, records) => {
              conn2.release();
              if (err2) {
                return res.status(500).json({
                  error: err2.message,
                  sql: err2.sql,
                });
              }
              const inserted = records[0];
              return res.status(201).json(inserted);
          });
        })

      })
    });
});


module.exports = router;
