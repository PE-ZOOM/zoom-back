const express = require('express');
const router = express.Router();
const connection_pool = require('../db2');

// GET - Retrieve all of the data from table fonction exept "admin" dropdown
router.get('/', (req, resp) => {
    sql = 'SELECT * FROM Fonction where id_fonction <> 6';

    connection_pool.getConnection(function(error, conn) {
      if (error) throw err; // not connected!

      conn.query(sql, (err, result) => {
      // When done with the connection, release it.
        conn.release();

        // Handle error after the release.
        if (err){
          console.log(err.sqlMessage)
          return  resp.status(500).json({
                  err: "true", 
                  error: err.message,
                  errno: err.errno,
                  sql: err.sql,
                  });
        }else{
          resp.status(201).json(result)
        }

      // Don't use the connection here, it has been returned to the pool.
      });   
    });

  });
    

module.exports = router;