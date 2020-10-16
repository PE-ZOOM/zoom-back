// We always need to require express in every route file
const express = require('express');
// We create the express router
const router = express.Router();
// We require the database connection configuration
// const connection = require('../db');
const connection_pool = require('../db2');


const passport = require('passport');

 //count portefeuille nav
 router.get('/portefeuille', passport.authenticate('jwt', { session:  false }), (req,resp) =>{
    let fieldValue = ''

    let sql = 'SELECT COUNT(dc_individu_local) AS nb';
    sql +=
      // ' FROM T_Portefeuille INNER JOIN APE ON T_Portefeuille.dc_structureprincipalede = APE.id_ape';
      ' FROM T_Portefeuille';
    sql += ' WHERE dc_situationde = 2';

    //DR Admin
    //http://localhost:5000/count/portefeuille

    //Conseiller
    //http://localhost:5000/count/portefeuille?dc_dernieragentreferent=P000617 - XXXX
    if (req.query.dc_dernieragentreferent) {
      fieldValue = req.query.dc_dernieragentreferent;
      sql += ' AND dc_dernieragentreferent = ? ';
    }
    //ELP
    //http://localhost:5000/count/portefeuille?dc_structureprincipalede=97801
    if (req.query.dc_structureprincipalede) {
      fieldValue = req.query.dc_structureprincipalede;
      sql += ' AND dc_structureprincipalede = ? ';
    }
    //DTNE-DTSO
    //http://localhost:5000/count/portefeuille?dt=DTNE
    if (req.query.dt) {
      fieldValue = req.query.dt;
      sql += ' AND  dt = ? ';
    }

    // console.log(fieldValue)

    connection_pool.getConnection(function(error, conn) {
      if (error) throw err; // not connected!

      conn.query(sql, [fieldValue], (err, result) => {
      // When done with the connection, release it.
        conn.release();

        // Handle error after the release.
        if (err){
          // console.log(err.sqlMessage)
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


    // connection.query(sql, [fieldValue], (err, results) => {
    //   if (err) {
    //     resp.status(500).send('Internal server error');
    //   } else {
    //     if (!results.length) {
    //       resp.status(404).send('datas not found');
    //     } else {
    //       // console.log(json(results))
    //       resp.json(results);
    //     }
    //   }
    // });
  },
);
//END


//count EFO nav
router.get('/efo', passport.authenticate('jwt', { session:  false }), (req,resp) =>{
    let fieldValue = ''


    let sql = 'SELECT COUNT(dc_individu_local) AS nb';
    sql +=
      // ' FROM T_EFO INNER JOIN APE ON T_EFO.dc_structureprincipalede= APE.id_ape';
      ' FROM T_EFO';

    //DR Admin
    //http://localhost:5000/count/efo

    //Conseiller
    //http://localhost:5000/count/efo?dc_dernieragentreferent=P000617 - XXXX
    if (req.query.dc_dernieragentreferent) {
      fieldValue = req.query.dc_dernieragentreferent;
      sql += ' WHERE dc_dernieragentreferent = ? ';
    }
    //ELP
    //http://localhost:5000/count/efo?dc_structureprincipalede=97801
    if (req.query.dc_structureprincipalede) {
      fieldValue = req.query.dc_structureprincipalede;
      sql += ' WHERE dc_structureprincipalede = ? ';
    }
    //DTNE-DTSO
    //http://localhost:5000/count/efo?dt=DTNE
    if (req.query.dt) {
      fieldValue = req.query.dt;
      sql += ' WHERE dt = ? ';
    }

    // console.log(fieldValue)
    // connection.query(sql, [fieldValue], (err, results) => {
    //   if (err) {
    //     resp.status(500).send('Internal server error');
    //   } else {
    //     if (!results.length) {
    //       resp.status(404).send('datas not found');
    //     } else {
    //       resp.json(results);
    //     }
    //   }
    // });

    connection_pool.getConnection(function(error, conn) {
      if (error) throw err; // not connected!

      conn.query(sql, [fieldValue], (err, result) => {
      // When done with the connection, release it.
        conn.release();

        // Handle error after the release.
        if (err){
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


  },
);
//END

//count diag //important start by diag before user in url
//http://localhost:5000/count/diag?colonne113=O
router.get(
  '/diag',
  passport.authenticate('jwt', { session: false }),
  (req, resp) => {
    const query = req.query;
    let sql = 'SELECT x.name, x.nb, Diag.groupe2 FROM (';

    sql += `SELECT "${
      Object.keys(query)[0]
    }" as name,COUNT(dc_individu_local) AS nb`;
    sql +=
      // ' FROM T_Portefeuille INNER JOIN APE ON T_Portefeuille.dc_structureprincipalede = APE.id_ape';
      ' FROM T_Portefeuille';
    sql += ' WHERE dc_situationde = 2';

    let sqlValues = [];

    Object.keys(query).map((key, index) => {
      sql += ` AND ${key} = ?`;
      sqlValues.push(query[key]);
    });

    sql += ') x , Diag WHERE x.name = Diag.name';
    // sql += ' ORDER BY id_diag';

    // console.log(sql)
    // console.log(sqlValues)
    // connection.query(sql, sqlValues, (err, results) => {
    //   if (err) {
    //     resp.status(500).send('Internal server error');
    //   } else {
    //     if (!results.length) {
    //       resp.status(404).send('datas not found');
    //     } else {
    //       // console.log(json(results))
    //       resp.json(results);
    //     }
    //   }
    // });

    connection_pool.getConnection(function(error, conn) {
      if (error) throw err; // not connected!

      conn.query(sql, sqlValues, (err, result) => {
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

    
  },
);
//END

module.exports = router;
