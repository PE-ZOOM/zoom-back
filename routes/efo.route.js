
const express = require('express');
const router = express.Router();
// const connection = require('../db');
const passport = require('passport');
const connection_pool = require('../db2');

//list filter efo
//liste filter situation DE
//http://localhost:5000/efo/listesituationde?
// router.get('/listesituationde', passport.authenticate('jwt', { session:  false }), (req,resp) =>{
//     const query = req.query;
 
//     let sql = 'SELECT DISTINCT dc_situationde, libelle'
//         // sql+= ' FROM T_EFO INNER JOIN APE ON T_EFO.dc_structureprincipalede = APE.id_ape'
//         sql+= ' FROM T_EFO'
//         sql+= ' INNER JOIN Modalite ON T_EFO.dc_situationde = Modalite.id_mod'
        
//         let sqlValues = [];

//         Object.keys(query).map((key, index) => {
//             if (index === 0) {
//                 sql += ` WHERE ${key} = ?`
//             }
//             else {
//                 sql += ` AND ${key} = ?`
    
//             } 
//             sqlValues.push(query[key]) 
//         })

//     connection_pool.getConnection(function(error, conn) {
//       if (error) throw err; // not connected!

//       conn.query(sql, sqlValues, (err, result) => {
//       // When done with the connection, release it.
//         conn.release();

//         // Handle error after the release.
//         if (err){
//           console.log(err.sqlMessage)
//           return  resp.status(500).json({
//                   err: "true", 
//                   error: err.message,
//                   errno: err.errno,
//                   sql: err.sql,
//                   });
//         }else{
//           resp.status(201).json(result)
//         }

      // Don't use the connection here, it has been returned to the pool.
    //   });   
    // });


    // connection.query(sql, sqlValues, (err, results) => {
    //     if (err) {
    //         resp.status(500).send('Internal server error')
    //     } else {
    //         if (!results.length) {
    //             resp.status(404).send('datas not found')
    //         } else {
    //             resp.json(results)
    //         }
    //     }
    // })
// })

//list filter efo
//liste filter parcours
//http://localhost:5000/efo/listeparcours?
// router.get('/listeparcours', passport.authenticate('jwt', { session:  false }), (req,resp) =>{
//     const query = req.query;
 
//     let sql = 'SELECT DISTINCT dc_parcours'
//         sql+= ' FROM T_EFO INNER JOIN APE ON T_EFO.dc_structureprincipalede = APE.id_ape'
        
//         let sqlValues = [];

//         Object.keys(query).map((key, index) => {
//             if (index === 0) {
//                 sql += ` WHERE ${key} = ?`
//             }
//             else {
//                 sql += ` AND ${key} = ?`
    
//             } 
//             sqlValues.push(query[key]) 
//         })
//     connection_pool.getConnection(function(error, conn) {
//       if (error) throw err; // not connected!

//       conn.query(sql, sqlValues, (err, result) => {
//       // When done with the connection, release it.
//         conn.release();

//         // Handle error after the release.
//         if (err){
//           console.log(err.sqlMessage)
//           return  resp.status(500).json({
//                   err: "true", 
//                   error: err.message,
//                   errno: err.errno,
//                   sql: err.sql,
//                   });
//         }else{
//           resp.status(201).json(result)
//         }

//       // Don't use the connection here, it has been returned to the pool.
//       });   
//     });
// })


//list filter efo
//liste filter categorie
//http://localhost:5000/efo/listecategorie?
// router.get('/listecategorie', passport.authenticate('jwt', { session:  false }), (req,resp) =>{
//     const query = req.query;
 
//     let sql = 'SELECT DISTINCT dc_categorie'
//         // sql+= ' FROM T_EFO INNER JOIN APE ON T_EFO.dc_structureprincipalede = APE.id_ape ORDER BY dc_categorie'
//         sql+= ' FROM T_EFO ORDER BY dc_categorie'
        
//         let sqlValues = [];

//         Object.keys(query).map((key, index) => {
//             if (index === 0) {
//                 sql += ` WHERE ${key} = ?`
//             }
//             else {
//                 sql += ` AND ${key} = ?`
    
//             } 
//             sqlValues.push(query[key]) 
//         })
//     connection_pool.getConnection(function(error, conn) {
//       if (error) throw err; // not connected!

//       conn.query(sql, sqlValues, (err, result) => {
//       // When done with the connection, release it.
//         conn.release();

//         // Handle error after the release.
//         if (err){
//           console.log(err.sqlMessage)
//           return  resp.status(500).json({
//                   err: "true", 
//                   error: err.message,
//                   errno: err.errno,
//                   sql: err.sql,
//                   });
//         }else{
//           resp.status(201).json(result)
//         }

//       // Don't use the connection here, it has been returned to the pool.
//       });   
//     });
// })

//list filter efo
//liste filter statut action
//http://localhost:5000/efo/listestatutaction?
router.get('/listestatutaction', passport.authenticate('jwt', { session:  false }), (req,resp) =>{
    const query = req.query;
 
    let sql = 'SELECT DISTINCT dc_statutaction_id'
        // sql+= ' FROM T_EFO INNER JOIN APE ON T_EFO.dc_structureprincipalede = APE.id_ape'
        sql+= ' FROM T_EFO'
        
        let sqlValues = [];

        Object.keys(query).map((key, index) => {
            if (index === 0) {
                sql += ` WHERE ${key} = ?`
            }
            else {
                sql += ` AND ${key} = ?`
    
            } 
            sqlValues.push(query[key]) 
        })
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

//list filter efo
//liste filter statut formatcode
//http://localhost:5000/efo/listeformacode?
// router.get('/listeformacode', passport.authenticate('jwt', { session:  false }), (req,resp) =>{
//     const query = req.query;
 
//     let sql = 'SELECT DISTINCT dc_formacode_id, dc_lblformacode'
//         sql+= ' FROM T_EFO INNER JOIN APE ON T_EFO.dc_structureprincipalede = APE.id_ape'
        
//         let sqlValues = [];

//         Object.keys(query).map((key, index) => {
//             if (index === 0) {
//                 sql += ` WHERE ${key} = ?`
//             }
//             else {
//                 sql += ` AND ${key} = ?`
    
//             } 
//             sqlValues.push(query[key]) 
//         })
//     connection.query(sql, sqlValues, (err, results) => {
//         if (err) {
//             resp.status(500).send('Internal server error')
//         } else {
//             if (!results.length) {
//                 resp.status(404).send('datas not found')
//                 // resp.json([])
//             } else {
//                 // console.log(json(results))
//                 resp.json(results)
//             }
//         }
//     })
// })
// SELECT COUNT(dc_formacode_id ), dc_formacode_id, dc_lblformacode FROM T_EFO GROUP BY dc_formacode_id ORDER BY COUNT(dc_formacode_id ) DESC LIMIT 8

  router.get('/listeFormationDemandee', (req, resp) => {
    const query = req.query;
    let sql = 'SELECT COUNT(dc_formacode_id ) as Qte, dc_lblformacode'
        sql+= ' FROM T_EFO'
        
    // let sqlValues = [];
    Object.keys(query).filter((key) => query[key]!=='all').map((key, index) => {
        sql += ` WHERE ${key} = "${query[key]}"`
    })

    sql += ' GROUP BY dc_formacode_id ORDER BY COUNT(dc_formacode_id ) DESC LIMIT 5'
    
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

  router.get('/EFO_c_o', (req, resp) => {

    const query = req.query;
    let sql  = `SELECT COUNT(dc_statutaction_id) as Qte, dc_statutaction_id FROM T_EFO` 
        // sql += ` INNER JOIN APE ON T_EFO.dc_structureprincipalede = APE.id_ape` 
       
    Object.keys(query).filter((key) => query[key]!=='all').map((key, index) => {
        if (index === 0) {
            sql += ` WHERE ${key} = "${query[key]}" `
        }else{
            sql += ` AND ${key} = "${query[key]}"`
        }
    })
    
    sql += ` GROUP BY dc_statutaction_id`
    
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

router.get('/EFO_byDate', (req, resp) => {

    const query = req.query;
    let sql = `SELECT COUNT(dd_datepreconisation ) as Qte, dc_statutaction_id FROM T_EFO WHERE` 
    Object.keys(query).filter((key) => query[key]!=='all').map((key, index) => {
        if(key !=='soon'){
            if (index === 0) {
                sql += ` ${key} = "${query[key]}" AND `
            }else{
                sql += ` ${key} = "${query[key]}" AND`
            }
        }
    })
    // sql += ' DATEDIFF(CURDATE(), dd_datepreconisation) > 800'
    sql += ` DATEDIFF(CURDATE(), dd_datepreconisation) > 365`

    // sql += ' GROUP BY dc_formacode_id ORDER BY COUNT(dc_formacode_id ) DESC LIMIT 5'
    
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

//nb efo
//http://localhost:5000/efo?
router.get('/', passport.authenticate('jwt', { session:  false }), (req,resp) =>{
    const query = req.query;
   
    // let sql ="SELECT count(t1.dc_individu_local) AS nbEFO, x.nbDEEFO, y.nbDE, CONCAT(FORMAT(x.nbDEEFO / y.nbDE * 100, 1),'%') as tx"
    let sql ="SELECT count(t1.dc_individu_local) AS nbEFO, x.nbDEEFO, y.nbDE, CONCAT(FORMAT(x.nbDEEFO / y.nbDE * 100, 1),'%') as tx"
    // sql+= " FROM T_EFO t1 INNER JOIN APE ON t1.dc_structureprincipalede = APE.id_ape ,"
    sql+= " FROM T_EFO t1 ,"
    sql+="(SELECT COUNT(DISTINCT t2.dc_individu_local) AS nbDEEFO"
    // sql+=" FROM T_EFO t2 INNER JOIN APE ON t2.dc_structureprincipalede = APE.id_ape"
    sql+=" FROM T_EFO t2"
    
    let sqlValues = [];
    
   
    Object.keys(query).filter((key) => query[key]!=='all').map((key, index) => {
        
        // dc_lblformacode
        if (key==='dc_lblformacode') {
            if (index === 0) {
                sql += ` WHERE t2.${key} LIKE "%" ? "%"`
            }
            else {
                sql += ` AND t2.${key} LIKE "%" ? "%"`
            } 

        } else  {
        
                    if (key==='dt') {
                            if (index === 0) {
                                sql += ` WHERE ${key} = ?`
                            }
                            else {
                                sql += ` AND ${key} = ?`
                    
                            } 
                        }
                        else {
                            if (index === 0) {
                                sql += ` WHERE t2.${key} = ?`
                            }
                            else {
                                sql += ` AND t2.${key} = ?`
                            } 
                        }
                    }        
            sqlValues.push(query[key])
        })
    

    sql+= ") x ,"
    sql+="(SELECT COUNT(DISTINCT dc_individu_local) AS nbDE"
    // sql += ' FROM T_Portefeuille INNER JOIN APE ON T_Portefeuille.dc_structureprincipalede = APE.id_ape'
    sql += ' FROM T_Portefeuille'
    
    Object.keys(query).filter((key) => query[key]!=='all' && key!=='dc_statutaction_id' && key!=='dc_lblformacode').map((key, index) => {
        if (index === 0) {
            sql += ` WHERE ${key} = ?`
        }
        else {
            sql += ` AND ${key} = ?`

        } 
        sqlValues.push(query[key])
    })

    sql+= ") y"
        
    
    Object.keys(query).filter((key) => query[key]!=='all').map((key, index) => {
        
        if (key==='dc_lblformacode') {
            if (index === 0) {
                sql += ` WHERE t1.${key} LIKE "%" ? "%"`
            }
            else {
                sql += ` AND t1.${key} LIKE "%" ? "%"`
            } 

        } else  {
        
                if (key==='dt') {
                    if (index === 0) {
                        sql += ` WHERE ${key} = ?`
                    }
                    else {
                        sql += ` AND ${key} = ?`
            
                    } 
                }
                else {
                    if (index === 0) {
                        sql += ` WHERE t1.${key} = ?`
                    }
                    else {
                        sql += ` AND t1.${key} = ?`
            
                    } 
                }
            }
        
        sqlValues.push(query[key])
    })

    sql+= " Group by x.nbDEEFO,y.nbDE"

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
//END



module.exports = router;