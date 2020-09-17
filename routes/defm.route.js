
// We always need to require express in every route file
const express = require('express');
// We create the express router 
const router = express.Router();
// We require the database connection configuration
// const connection = require('../db');
const connection_pool = require('../db2');
const passport = require('passport');

router.get('/inscript', passport.authenticate('jwt', { session:  false }), (req,resp) =>{

    // let sql = 'SELECT DISTINCT(`dc_lblaxetravailprincipal`) as lbl, COUNT("dc_lblaxetravailprincipal") as nb from t_portefeuille WHERE dc_situationde = 2 '
    let sql = "SELECT  CASE"
        sql += " WHEN t1.nbjourinscrip >=0 AND t1.nbjourinscrip<365  THEN '1: Moins de 12 mois'"
        sql += " WHEN t1.nbjourinscrip >=365 AND t1.nbjourinscrip<730  THEN '2: Entre 12 mois et 24 mois'"
        sql += " WHEN t1.nbjourinscrip >=730 AND t1.nbjourinscrip<1080  THEN '3: Entre 24 mois et 36 mois'"
        sql += " ELSE '4: Plus de 36 mois'"
        sql += " END AS lbl, "
        sql += " COUNT(t1.dc_individu_local) as nb,"
        sql += " ROUND(COUNT(t1.dc_nom)/"
        sql += "("
        sql +=    " SELECT COUNT(t2.dc_nom) FROM t_portefeuille t2 "
        sql +=    " INNER JOIN APE a2 ON t2.dc_structureprincipalede = a2.id_ape "
        sql +=    " WHERE dc_situationde = 2  "
        
                  Object.keys(req.query).map((key, index) => {
                    (key==='dt')?sql+=` AND a2.${key}="${req.query[key]}"`:sql+=` AND t2.${key}="${req.query[key]}"`
                  });

        sql +=    " )*100"
        sql += ") tx"
        // sql += ") nb"

        sql += " FROM t_portefeuille t1 INNER JOIN APE a1 ON t1.dc_structureprincipalede = a1.id_ape  "
        sql += " WHERE `dc_situationde`= 2"
  
        Object.keys(req.query).map((key, index) => {
          (key==='dt')?sql+=` AND a1.${key}="${req.query[key]}"`:sql+=` AND t1.${key}="${req.query[key]}"`
        });

        sql += " GROUP BY lbl"

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
            if (!result.length) {
                resp.status(404).send('datas not found')
            } else {
                resp.json(result)
            }
        }

      // Don't use the connection here, it has been returned to the pool.
      });   
    });
})

//axe
router.get('/axe', passport.authenticate('jwt', { session:  false }), (req,resp) =>{

    let sql =  'SELECT t1.dc_lblaxetravailprincipal as lbl, '
        sql += ' COUNT(t1.dc_lblaxetravailprincipal) as nb,' 
        sql += ' ROUND(COUNT(t1.dc_lblaxetravailprincipal)/'
        sql +=  '('
        sql +=    ' SELECT COUNT(t2.dc_lblaxetravailprincipal) '
        sql +=    ' FROM t_portefeuille t2 '
        sql +=    ' INNER JOIN APE a2 ON t2.dc_structureprincipalede = a2.id_ape '
        sql +=    ' WHERE dc_situationde = 2 '

        Object.keys(req.query).map((key, index) => {
          (key==='dt')?sql+=` AND a2.${key}="${req.query[key]}"`:sql+=` AND t2.${key}="${req.query[key]}"`
        });


        sql +=    ')*100'
        sql +=  ') as tx'
        // sql +=  ') as nb'
        sql += ' from t_portefeuille t1 '
        sql += ' INNER JOIN APE a1 ON t1.dc_structureprincipalede = a1.id_ape '
        sql += ' WHERE dc_situationde = 2  '

    Object.keys(req.query).map((key, index) => {
      (key==='dt')?sql+=` AND a1.${key}="${req.query[key]}"`:sql+=` AND ${key}="${req.query[key]}"`
    });
    
    sql += ' GROUP BY t1.dc_lblaxetravailprincipal'

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
            if (!result.length) {
                resp.status(404).send('datas not found')
            } else {
                resp.json(result)
            }
        }

      // Don't use the connection here, it has been returned to the pool.
      });   
    });
})

router.get('/acc', passport.authenticate('jwt', { session:  false }), (req,resp) =>{
  // console.log(Object.keys(req.query)[0])
  let sql ='SELECT DISTINCT(`dc_parcours`) as lbl, COUNT(`dc_parcours`) as nb FROM t_portefeuille'
      sql += ' INNER JOIN APE a1 ON T_Portefeuille.dc_structureprincipalede = a1.id_ape WHERE dc_situationde = 2  '
  // req.query.map((key, value) => console.log(key +' : ' + value))

  Object.keys(req.query).map((key, index) => {
    // index===0?sql+=` WHERE ${key}="${req.query[key]}"`:sql+=`AND ${key}="${req.query[key]}"`
    (key==='dt')?sql+=` AND a1.${key}="${req.query[key]}"`:sql+=` AND ${key}="${req.query[key]}"`
  });

  

  sql += " GROUP BY `dc_parcours`"
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
            if (!result.length) {
                resp.status(404).send('datas not found')
            } else {
                resp.json(result)
            }
        }

      // Don't use the connection here, it has been returned to the pool.
      });   
    });
})

router.get('/divers', passport.authenticate('jwt', { session:  false }), (req,resp) =>{

    let sql = '' 
        sql += 'SELECT COUNT(t1.dc_telephone) as tel '
        sql += ' FROM t_portefeuille t1 '
        sql += ' INNER JOIN APE a1 ON t1.dc_structureprincipalede = a1.id_ape '
        sql += ' WHERE dc_situationde = 2  '

        Object.keys(req.query).map((key, index) => {
          (key==='dt')?sql+=` AND a1.${key}="${req.query[key]}"`:sql+=` AND ${key}="${req.query[key]}"`
        });
    
    // sql += ' GROUP BY t1.dc_lblaxetravailprincipal'

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
            if (!result.length) {
                resp.status(404).send('datas not found')
            } else {
                resp.json(result)
            }
        }

      // Don't use the connection here, it has been returned to the pool.
      });   
    });
})


router.get('/multifilter', passport.authenticate('jwt', { session:  false }), (req,resp) =>{
  let sql = 'SELECT COUNT(*) as nb ';
  sql +=    'FROM t_portefeuille INNER JOIN APE ON T_Portefeuille.dc_structureprincipalede = APE.id_ape ';
  sql +=    'WHERE (dc_situationde = 2 ';
  Object.keys(req.query).map((key)=>{
    if(req.query[key]!==''){
      sql += ') AND (';
      if(key=='nbjourinscrip'){ 

          switch (parseInt(req.query[key].split(',')[0])){
            
            case 1:
              sql += ` ${key}>=0 `;
              break;
            case 2:
              sql += ` ${key}>=365 `;
              break; 
            case 3:
              sql += ` ${key}>=730 `;
              break;
            case 4:
              sql += ` ${key}>=1080 `;              
              break;
          } 
          switch (parseInt(req.query[key].split(',')[1])) {
            case 1:
              sql += ` AND ${key}<365 `;
              break; 
            case 2:
              sql += ` AND ${key}<730 `;
              break;
            case 3:
              sql += ` AND ${key}<1080 `;
              break;
          }
      //     console.log(Math.min(...min))
      //     // console.log(req.query[key] +", value : "+ value +" ,index : "+ index)

        } else {
          req.query[key].split(',').map((value, index)=>{


              sql+= `${key}="${value}"`;
              if(index!==req.query[key].split(',').length -1){
                sql+=' OR ';
              }
            

          });
        }
    }
  });
  sql +=    ') ';


    // console.log("===============================================================")
    // console.log(sql)
    // console.log("===============================================================")

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
            if (!result.length) {
                resp.status(404).send('datas not found')
            } else {
                resp.json(result)
            }
        }

      // Don't use the connection here, it has been returned to the pool.
      });   
    });
})


module.exports = router;