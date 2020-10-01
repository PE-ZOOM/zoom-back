const express = require('express');
const router = express.Router();
// const connection = require('../db');
const connection_pool = require('../db2');

router.get('/jalon', (req, res) => {
  const query = req.query;
  // const int1= [0,30];
  // const int2= [int1[1] + 1, 60];
  // let sql = 'SELECT x.dc_lblmotifjalonpersonnalise,'    
  // sql+=` MAX(CASE WHEN x.textnbjouravantjalon = "Sans Jalons" THEN x.nb ELSE 0 END) "Sans Jalons",`
  // sql+=` MAX(CASE WHEN x.textnbjouravantjalon = "Jalons dépassés" THEN x.nb ELSE 0 END) "Jalons dépassés",`
  // sql+=` MAX(CASE WHEN x.textnbjouravantjalon = "Entre ${int1[0]} et ${int1[1]} jours" THEN x.nb ELSE 0 END) "Entre ${int1[0]} et ${int1[1]} jours",`
  // sql+=` MAX(CASE WHEN x.textnbjouravantjalon = "Entre ${int2[0]} et ${int2[1]} jours" THEN x.nb ELSE 0 END) "Entre ${int2[0]} et ${int2[1]} jours",`
  // sql+=` MAX(CASE WHEN x.textnbjouravantjalon = "> ${int2[1]} jours" THEN x.nb ELSE 0 END) "> ${int2[1]} jours",`
  // sql+=` SUM(x.nb) Total`
  // sql+=' FROM ('

  //   sql += 'SELECT dc_lblmotifjalonpersonnalise,'
  //   sql += ' CASE'
  //   sql += ' WHEN nbjouravantjalon IS NULL THEN "Sans Jalons"'
  //   sql += ' WHEN nbjouravantjalon < 0 THEN "Jalons dépassés"'
  //   sql += ` WHEN nbjouravantjalon BETWEEN ${int1[0]} AND ${int1[1]} THEN "Entre ${int1[0]} et ${int1[1]} jours"`
  //   sql += ` WHEN nbjouravantjalon BETWEEN ${int2[0]} AND ${int2[1]} THEN "Entre ${int2[0]} et ${int2[1]} jours"`
  //   sql += ` WHEN nbjouravantjalon > ${int2[1]} THEN "> ${int2[1]} jours"`
  //   sql += ' ELSE "jalons"'
  //   sql += ' END AS textnbjouravantjalon,'
  //   sql += ' COUNT(dc_individu_local) AS nb'
  //   sql += ' FROM T_Portefeuille INNER JOIN APE ON T_Portefeuille.dc_structureprincipalede = APE.id_ape'
  //   sql += ' WHERE dc_situationde = 2'

  // Object.keys(query).filter((key) => query[key]!=='all').map((key) => {
  //   if(req.query[key]!=="null" && req.query[key]!==undefined)
  //   {
  //     sql += ` AND ${key} = "${req.query[key]}" `
  //   }
  // })

  // sql += ' GROUP BY dc_lblmotifjalonpersonnalise, textnbjouravantjalon) x'
  // sql += ' GROUP BY x.dc_lblmotifjalonpersonnalise'

    // sql = 'SELECT' 
    // sql += ' MAX(CASE WHEN x.lbl = "Sans Jalons" THEN x.nb ELSE 0 END) "Sans Jalons", '
    // sql += ' MAX(CASE WHEN x.lbl = "Jalons dépassés" THEN x.nb ELSE 0 END) "Jalons dépassés", '
    // sql += ' MAX(CASE WHEN x.lbl = "Entre 0 et 30 jours" THEN x.nb ELSE 0 END) "Entre 0 et 30 jours"'

    // sql += ' FROM ('
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

          Object.keys(query).filter((key) => query[key]!=='all').map((key) => {
            if(req.query[key]!=="null" && req.query[key]!==undefined)
            {
              sql += ` AND ${key} = "${req.query[key]}" `
            }
          })

    sql += '          GROUP BY lbl'
    // sql += '           ) x'


  
  connection_pool.getConnection(function(error, conn) {
    if (error) throw err; // not connected!

    conn.query(sql, (err, result) => {
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

router.get('/efo', (req, res) => {
  const query = req.query;

  let sql = 'SELECT CONCAT("EFO ", dc_statutaction_id)  as lbl, COUNT(dc_statutaction_id) as nb FROM T_EFO'
    // sql += ' INNER JOIN APE ON T_EFO.dc_structureprincipalede = APE.id_ape'

  // Object.keys(query).map((key, index) => {
  //   sql += ` WHERE ${key} = "${query[key]}"  `
  // })
  Object.keys(query).filter((key) => query[key]!=='all').map((key) => {
    if(req.query[key]!=="null" && req.query[key]!==undefined)
    {
      sql += ` AND ${key} = "${req.query[key]}" `
      // if(key==='dt'){
      //   sql += ` AND ${key} = "${req.query[key]}" `
      // }
    }
  })


  sql += ' GROUP BY dc_statutaction_id'

  connection_pool.getConnection(function(error, conn) {
    if (error) throw err; // not connected!

    conn.query(sql, (err, result) => {
    // When done with the connection, release it.
      conn.release();

      // Handle error after the release.
      if (err){
        console.log(err.sqlMessage)
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