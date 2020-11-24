const express = require('express');
const router = express.Router();
// const connection = require('../db');
const connection_pool = require('../db2');
const passport = require('passport');

// dashboard jalons
router.get('/jalon', passport.authenticate('jwt', { session:  false }), (req,resp) =>{  
  let fieldValue = ''
  
    let sql = '    SELECT '
    sql += '          CASE  '
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

//dashboard efo
router.get('/efo', passport.authenticate('jwt', { session:  false }), (req,resp) =>{
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

// dashboard ORE
router.get('/ore', passport.authenticate('jwt', { session:  false }), (req,resp) =>{
  let fieldValue = ''
  let sql = 'SELECT CONCAT("ORE A CONTRACTUALISER ", c_top_oreavalider_id) as lbl, COUNT(c_top_oreavalider_id) as nb FROM T_Portefeuille'
      sql += " WHERE dc_situationde = 2 "
    
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

// dashboard effectifs
router.get('/eff', passport.authenticate('jwt', { session:  false }), (req,resp) =>{
  const query = req.query;
  let sqlValues = [];
  
let sql = 'SELECT tt.dc_structureprincipalede,tt.libelle_ape,'
sql += 'MAX(CASE WHEN tt.dc_parcours = "SUI" THEN tt.eff ELSE 0 END) "SUI",'
sql += 'MAX(CASE WHEN tt.dc_parcours = "GUI" THEN tt.eff ELSE 0 END) "GUI",'
sql += 'MAX(CASE WHEN tt.dc_parcours = "REN" THEN tt.eff ELSE 0 END) "REN",'
sql += 'MAX(CASE WHEN tt.dc_parcours = "GLO" THEN tt.eff ELSE 0 END) "GLO",'
sql += 'MAX(CASE WHEN tt.dc_parcours = "SUI" THEN ROUND(tt.charge) ELSE 0 END) "SUI(charge)",'
sql += 'MAX(CASE WHEN tt.dc_parcours = "GUI" THEN ROUND(tt.charge) ELSE 0 END) "GUI(charge)",'
sql += 'MAX(CASE WHEN tt.dc_parcours = "REN" THEN ROUND(tt.charge) ELSE 0 END) "REN(charge)",'
sql += 'MAX(CASE WHEN tt.dc_parcours = "GLO" THEN ROUND(tt.charge) ELSE 0 END) "GLO(charge)"'
sql += ' FROM ('
sql += '(SELECT t.dc_structureprincipalede,t.libelle_ape, t.dc_parcours, count(t.dc_dernieragentreferent) as eff, avg(t.maxnbide) as charge FROM '
sql += '(SELECT c1.dc_structureprincipalede,c1.libelle_ape, c1.dc_dernieragentreferent,c1.dc_parcours,y.maxnbide '
sql += 'FROM '
sql += '(SELECT dc_dernieragentreferent,dc_structureprincipalede,libelle_ape,dc_parcours,count(dc_individu_local) as nbide'
sql += ' FROM T_Portefeuille'
sql += ' WHERE dc_situationde = 2'

Object.keys(query).map((key, index) => {
  sql += ` AND ${key} = ?`
  sqlValues.push(query[key])
  
})

sql += ' GROUP BY dc_structureprincipalede,libelle_ape,dc_dernieragentreferent,dc_parcours) c1 INNER JOIN '
sql += ' (SELECT x.dc_dernieragentreferent, MAX(x.nbide) as maxnbide FROM '
sql += ' (SELECT dc_dernieragentreferent,dc_structureprincipalede,libelle_ape, dc_parcours,count(dc_individu_local) as nbide FROM T_Portefeuille '
sql += ' WHERE dc_situationde = 2' 

Object.keys(query).map((key, index) => {
  sql += ` AND ${key} = ?`
  sqlValues.push(query[key])
  
})

sql += ' GROUP BY dc_structureprincipalede,libelle_ape,dc_dernieragentreferent,dc_parcours) x '
sql += ' GROUP bY dc_dernieragentreferent) y ON c1.dc_dernieragentreferent = y.dc_dernieragentreferent AND c1.nbide = y.maxnbide '
sql += ' WHERE y.maxnbide>10) t '
sql += ' GROUP BY t.dc_structureprincipalede,t.libelle_ape, t.dc_parcours) tt) '
sql += ' GROUP BY tt.dc_structureprincipalede,tt.libelle_ape'

// console.log(sql)
// console.log(sqlValues)

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

})

// dashboard charge moyenne
router.get('/charge', passport.authenticate('jwt', { session:  false }), (req,resp) =>{
  const query = req.query;
  let sqlValues = [];
  
let sql = 'SELECT tt.dc_structureprincipalede,tt.libelle_ape,'
sql += 'MAX(CASE WHEN tt.dc_parcours = "SUI" THEN ROUND(tt.charge) ELSE 0 END) "SUI",'
sql += 'MAX(CASE WHEN tt.dc_parcours = "GUI" THEN ROUND(tt.charge) ELSE 0 END) "GUI",'
sql += 'MAX(CASE WHEN tt.dc_parcours = "REN" THEN ROUND(tt.charge) ELSE 0 END) "REN",'
sql += 'MAX(CASE WHEN tt.dc_parcours = "GLO" THEN ROUND(tt.charge) ELSE 0 END) "GLO"'
sql += ' FROM ('
sql += '(SELECT t.dc_structureprincipalede,t.libelle_ape, t.dc_parcours, count(t.dc_dernieragentreferent) as eff, avg(t.maxnbide) as charge FROM '
sql += '(SELECT c1.dc_structureprincipalede,c1.libelle_ape, c1.dc_dernieragentreferent,c1.dc_parcours,y.maxnbide '
sql += 'FROM '
sql += '(SELECT dc_dernieragentreferent,dc_structureprincipalede,libelle_ape,dc_parcours,count(dc_individu_local) as nbide'
sql += ' FROM T_Portefeuille'
sql += ' WHERE dc_situationde = 2'

Object.keys(query).map((key, index) => {
  sql += ` AND ${key} = ?`
  sqlValues.push(query[key])
  
})

sql += ' GROUP BY dc_structureprincipalede,libelle_ape,dc_dernieragentreferent,dc_parcours) c1 INNER JOIN '
sql += ' (SELECT x.dc_dernieragentreferent, MAX(x.nbide) as maxnbide FROM '
sql += ' (SELECT dc_dernieragentreferent,dc_structureprincipalede,libelle_ape, dc_parcours,count(dc_individu_local) as nbide FROM T_Portefeuille '
sql += ' WHERE dc_situationde = 2' 

Object.keys(query).map((key, index) => {
  sql += ` AND ${key} = ?`
  sqlValues.push(query[key])
  
})

sql += ' GROUP BY dc_structureprincipalede,libelle_ape,dc_dernieragentreferent,dc_parcours) x '
sql += ' GROUP bY dc_dernieragentreferent) y ON c1.dc_dernieragentreferent = y.dc_dernieragentreferent AND c1.nbide = y.maxnbide '
sql += ' WHERE y.maxnbide>10) t '
sql += ' GROUP BY t.dc_structureprincipalede,t.libelle_ape, t.dc_parcours) tt) '
sql += ' GROUP BY tt.dc_structureprincipalede,tt.libelle_ape'

// console.log(sql)
// console.log(sqlValues)

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

})


module.exports = router;