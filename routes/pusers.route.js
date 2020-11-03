
const express = require('express');
const router = express.Router();
const connection_pool = require('../db2');

// GET - Retrieve all of the dc_dernieragentreferent from table T_Portefeuille dropdown
router.get('/', (req, res) => {

  connection_pool.getConnection(function(error, conn) {
      if (error) throw err; // not connected!

      conn.query('SELECT DISTINCT dc_dernieragentreferent FROM T_Portefeuille', (err, results) => {

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