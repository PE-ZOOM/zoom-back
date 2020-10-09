const express = require('express');
const router = express.Router();
// const connection = require('../db');
const connection_pool = require('../db2');

// dashboard jalons
router.get('/jalon', (req, res) => {
  
  let fieldValue = ''
  
    let sql = '    SELECT '
    sql += '          CASE WHEN nbjouravantjalon IS NULL THEN "Sans Jalons" '
    sql += '                WHEN nbjouravantjalon < 0 THEN "Jalons dépassés" '
    sql += '                WHEN nbjouravantjalon BETWEEN 0 AND 30 THEN "Entre 0 et 30 jours" '
    sql += '          END AS lbl,'
    sql += '                  COUNT(dc_individu_local) AS nb'
    sql += '           '
    sql += '          FROM T_Portefeuille '
    // sql += '          INNER JOIN APE ON T_Portefeuille.dc_structureprincipalede = APE.id_ape '
    sql += '          WHERE dc_situationde = 2 '

            //Conseiller
            if (req.query.dc_dernieragentreferent) {
              fieldValue = req.query.dc_dernieragentreferent;
              sql += ' AND dc_dernieragentreferent = ? ';
            }
            //ELP
            if (req.query.dc_structureprincipalede) {
              fieldValue = req.query.dc_structureprincipalede;
              sql += ' AND dc_structureprincipalede = ? ';
            }
            //DTNE-DTSO
            if (req.query.dt) {
              fieldValue = req.query.dt;
              sql += ' AND dt = ? ';
            }
          // })

    sql += '          GROUP BY lbl'
    // sql += '           ) x'


  connection_pool.getConnection(function(error, conn) {
    if (error) throw err; // not connected!

    conn.query(sql, [fieldValue], (err, result) => {
    // When done with the connection, release it.
      conn.release();

      // Handle error after the release.
      if (err){
        console.log(err)
        return  res.status(500).json({
                err: "true", 
                error: err.message,
                errno: err.errno,
                sql: err.sql,
                });
      }else{
        res.status(201).json(result)
      }

    // Don't use the connection here, it has been returned to the pool.
    });   
  });


});

//dashboard efo
router.get('/efo', (req, res) => {
  let fieldValue = ''
  let sql = 'SELECT CONCAT("EFO ", dc_statutaction_id)  as lbl, COUNT(dc_statutaction_id) as nb FROM T_EFO'
  //Conseiller
    if (req.query.dc_dernieragentreferent) {
      fieldValue = req.query.dc_dernieragentreferent;
      sql += ' WHERE dc_dernieragentreferent = ? ';
    }
    //ELP
    if (req.query.dc_structureprincipalede) {
      fieldValue = req.query.dc_structureprincipalede;
      sql += ' WHERE dc_structureprincipalede = ? ';
    }
    //DTNE-DTSO
    if (req.query.dt) {
      fieldValue = req.query.dt;
      sql += ' WHERE dt = ? ';
    }

  sql += ' GROUP BY dc_statutaction_id'
  
  connection_pool.getConnection(function(error, conn) {
    if (error) throw err; // not connected!

    conn.query(sql, [fieldValue], (err, result) => {
    // When done with the connection, release it.
      conn.release();

      // Handle error after the release.
      if (err){
        console.log(err.sql)
        return  res.status(500).json({
                err: "true", 
                error: err.message,
                errno: err.errno,
                sql: err.sql,
                });
      }else{
        res.status(201).json(result)
      }

    // Don't use the connection here, it has been returned to the pool.
    });   
  });
});

// dashboard ORE
router.get('/ore', (req, res) => {
  let fieldValue = ''
  let sql = 'SELECT CONCAT("ORE A VALIDER ", c_top_oreavalider_id)  as lbl, COUNT(c_top_oreavalider_id) as nb FROM T_Portefeuille'
   sql += ' WHERE dc_situationde = 2'
    
  //Conseiller
    //http://localhost:5000/count/efo?dc_dernieragentreferent=P000617 - XXXX
    if (req.query.dc_dernieragentreferent) {
      fieldValue = req.query.dc_dernieragentreferent;
      sql += ' AND dc_dernieragentreferent = ? ';
    }
    //ELP
    //http://localhost:5000/count/efo?dc_structureprincipalede=97801
    if (req.query.dc_structureprincipalede) {
      fieldValue = req.query.dc_structureprincipalede;
      sql += ' AND dc_structureprincipalede = ? ';
    }
    //DTNE-DTSO
    //http://localhost:5000/count/efo?dt=DTNE
    if (req.query.dt) {
      fieldValue = req.query.dt;
      sql += ' AND dt = ? ';
    }

  sql += ' GROUP BY c_top_oreavalider_id'
  
  connection_pool.getConnection(function(error, conn) {
    if (error) throw err; // not connected!

    conn.query(sql, [fieldValue], (err, result) => {
    // When done with the connection, release it.
      conn.release();

      // Handle error after the release.
      if (err){
        console.log(err.sql)
        return  res.status(500).json({
                err: "true", 
                error: err.message,
                errno: err.errno,
                sql: err.sql,
                });
      }else{
        res.status(201).json(result)
      }

    // Don't use the connection here, it has been returned to the pool.
    });   
  });
});

module.exports = router;