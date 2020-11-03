
const express = require('express');
const router = express.Router();
// const connection = require('../db');
const connection_pool = require('../db2');


// GET - Retrieve all of the data from table ape sans passeport parce qu'avant connexion user
router.get('/', (req, resp) => {
    let sql = 'SELECT id_ape, libelle_ape FROM APE';
    // connection.query('SELECT id_ape, libelle_ape FROM APE', (err, results) => {
    //   if (err) {
    //     res.status(500).json({
    //       error: err.message,
    //       sql: err.sql,
    //     });
    //   } else {
    //     res.json(results);
    //   }
    // });



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