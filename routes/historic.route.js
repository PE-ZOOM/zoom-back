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


//Exploitation des données historisées

//liste filter ref
//http://localhost:5000/historic/listechamps?
router.get('/listechamps', passport.authenticate('jwt', { session:  false }), (req,resp) =>{
  const query = req.query;

  let sql = "SELECT DISTINCT(champs) FROM `historic` where champs<>''"

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
})


//graph bubble
router.get('/historicBubble', (req, resp) => {

  // let sql = 'SELECT MONTH(date) AS mois, button AS BT, COUNT(*) as NB FROM historic GROUP BY mois, BT '
  let sqlValues = []

  let sql = 'SELECT a.mois, '
    sql += 'a.Contacts, p.ContactsPersonne,'
    sql += 'a.Diagnostic, p.DiagnosticPersonne,'
    sql += 'a.EFO, p.EFOPersonne,'
    sql += 'a.Jalons, p.JalonsPersonne,'
    sql += 'a.Taux, p.TauxPersonne,'
    sql += 'a.DPAE_MEC, p.DPAE_MECPersonne,'
    sql += 'a.Prestations, p.PrestationsPersonne FROM '
    sql += ' ('
    sql += '    SELECT c.mois,'
    sql += '        CASE WHEN y.Contacts IS NULL THEN 0 ELSE y.Contacts END "Contacts", '
    sql += '        CASE WHEN y.Diagnostic IS NULL THEN 0 ELSE y.Diagnostic END "Diagnostic", '
    sql += '        CASE WHEN y.EFO IS NULL THEN 0 ELSE y.EFO END "EFO", '
    sql += '        CASE WHEN y.Jalons IS NULL THEN 0 ELSE y.Jalons END "Jalons", '
    sql += '        CASE WHEN y.Taux IS NULL THEN 0 ELSE y.Taux END "Taux", '
    sql += '        CASE WHEN y.DPAE_MEC IS NULL THEN 0 ELSE y.DPAE_MEC END "DPAE_MEC", '
    sql += '        CASE WHEN y.Prestations IS NULL THEN 0 ELSE y.Prestations END "Prestations"'
    sql += '    FROM '
    sql += '    ('
    sql += '          SELECT x.mois,'
    sql += '              MAX(CASE WHEN x.button = "Contacts" THEN x.nbclic ELSE 0 END) "Contacts",'
    sql += '              MAX(CASE WHEN x.button = "Diagnostic" THEN x.nbclic ELSE 0 END) "Diagnostic",'
    sql += '              MAX(CASE WHEN x.button = "EFO" THEN x.nbclic ELSE 0 END) "EFO",'
    sql += '              MAX(CASE WHEN x.button = "Jalons" THEN x.nbclic ELSE 0 END) "Jalons",'
    sql += '              MAX(CASE WHEN x.button = "Taux" THEN x.nbclic ELSE 0 END) "Taux",'
    sql += '              MAX(CASE WHEN x.button = "DPAE_MEC" THEN x.nbclic ELSE 0 END) "DPAE_MEC",'
    sql += '              MAX(CASE WHEN x.button = "Prestations" THEN x.nbclic ELSE 0 END) "Prestations"'
    sql += '         FROM'
    sql += '         ('
    sql += '              SELECT MONTH(date) as mois, button, count(id) as nbclic FROM historic '
    //exclure tous les idgasi DPR et admin
    sql += '             WHERE idgasi NOT IN ('
    sql += '(SELECT idgasi_exclu FROM excluredpr)'
    sql += ' )'
    

                        Object.keys(req.query).filter((key) => req.query[key]!=='all').map((key) => {
                          if(key==='annee'){
                            sql += ` AND YEAR(date) = ? `      
                            sqlValues.push(req.query[key])
                          }else if(key==='champs'){
                            sql += ` AND champs = ? `      
                            sqlValues.push(req.query[key])
                          }
                        })

    sql += '             GROUP BY mois, button) x'
    sql += '             GROUP BY x.mois'
    sql += '         ) y '
    sql += '         RIGHT JOIN historic_calc c on c.mois= y.mois'
    sql += '         WHERE c.mois <= ('
    sql += '            SELECT MAX(MONTH(date)) FROM historic '

    Object.keys(req.query).filter((key) => req.query[key]!=='all').map((key) => {
      if(key==='annee'){
        sql += ` WHERE YEAR(date) = ? `      
        sqlValues.push(req.query[key])
      }
    }) 

    sql += '          )'
    sql += '          AND c.mois >= ('
    sql += '             SELECT MIN(MONTH(date)) FROM historic '
    
    Object.keys(req.query).filter((key) => req.query[key]!=='all').map((key) => {
      if(key==='annee'){
        sql += ` WHERE YEAR(date) = ? `      
        sqlValues.push(req.query[key])
      }
    }) 

    sql += '           ) ' 
    sql += '    ) a'
                                                  
    sql += '    INNER JOIN '
    sql += '    ('
    sql += '        SELECT c.mois,'
    sql += '            CASE WHEN y.Contacts IS NULL THEN 0 ELSE y.Contacts END "ContactsPersonne", '
    sql += '            CASE WHEN y.Diagnostic IS NULL THEN 0 ELSE y.Diagnostic END "DiagnosticPersonne", '
    sql += '            CASE WHEN y.EFO IS NULL THEN 0 ELSE y.EFO END "EFOPersonne", '
    sql += '            CASE WHEN y.Jalons IS NULL THEN 0 ELSE y.Jalons END "JalonsPersonne", '
    sql += '            CASE WHEN y.Taux IS NULL THEN 0 ELSE y.Taux END "TauxPersonne", '
    sql += '            CASE WHEN y.DPAE_MEC IS NULL THEN 0 ELSE y.Taux END "DPAE_MECPersonne", '
    sql += '            CASE WHEN y.Prestations IS NULL THEN 0 ELSE y.Prestations END "PrestationsPersonne"'
    sql += '        FROM '
    sql += '        ('
    sql += '          SELECT x.mois,'
    sql += '              MAX(CASE WHEN x.button = "Contacts" THEN x.nbclic ELSE 0 END) "Contacts",'
    sql += '              MAX(CASE WHEN x.button = "Diagnostic" THEN x.nbclic ELSE 0 END) "Diagnostic",'
    sql += '              MAX(CASE WHEN x.button = "EFO" THEN x.nbclic ELSE 0 END) "EFO",'
    sql += '              MAX(CASE WHEN x.button = "Jalons" THEN x.nbclic ELSE 0 END) "Jalons",'
    sql += '              MAX(CASE WHEN x.button = "Taux" THEN x.nbclic ELSE 0 END) "Taux",'
    sql += '              MAX(CASE WHEN x.button = "DPAE_MEC" THEN x.nbclic ELSE 0 END) "DPAE_MEC",'
    sql += '              MAX(CASE WHEN x.button = "Prestations" THEN x.nbclic ELSE 0 END) "Prestations"'
    sql += '          FROM'
    sql += '          ('
    sql += '              SELECT MONTH(date) as mois, button, count(DISTINCT(idgasi)) as nbclic FROM historic '
    //exclure tous les idgasi DPR et admin
    sql += '             WHERE idgasi NOT IN ('
    sql += '(SELECT idgasi_exclu FROM excluredpr)'
    sql += ' )'
    
                          Object.keys(req.query).filter((key) => req.query[key]!=='all').map((key) => {
                            if(key==='annee'){
                              sql += ` AND YEAR(date) = ? `      
                              sqlValues.push(req.query[key])
                            }else if(key==='champs'){
                              sql += ` AND champs = ? `      
                              sqlValues.push(req.query[key])
                            }
                          })

    sql += '              GROUP BY mois, button) x'
    sql += '              GROUP BY x.mois'
    sql += '           ) y RIGHT JOIN historic_calc c on c.mois= y.mois'
    sql += '           WHERE c.mois <= ('
    sql += '              SELECT MAX(MONTH(date)) FROM historic '

    Object.keys(req.query).filter((key) => req.query[key]!=='all').map((key) => {
      if(key==='annee'){
        sql += ` WHERE YEAR(date) = ? `      
        sqlValues.push(req.query[key])
      }
    })                      

    sql += '           )'
    sql += '          AND c.mois >= ('
    sql += '             SELECT MIN(MONTH(date)) FROM historic '
    
    Object.keys(req.query).filter((key) => req.query[key]!=='all').map((key) => {
      if(key==='annee'){
        sql += ` WHERE YEAR(date) = ? `      
        sqlValues.push(req.query[key])
      }
    }) 

    sql += '           ) ' 
    sql += '     ) p ON p.mois = a.mois '

  connection_pool.getConnection(function(error, conn) {
    if (error) throw err; // not connected!

    // Use the connection
    conn.query(sql, sqlValues, (err, result) => {
      // When done with the connection, release it.
      conn.release();

      // Handle error after the release.
      if (err) {
        console.log(err)
        return  resp.status(500).json({
                err: "true", 
                error: err.message,
                errno: err.errno,
                sql: err.sql,
                });
      }
      else {
        return  resp
                .status(201)
                .json(result);
      }
    })
  });

});


router.get('/historicTopPersonne', (req, resp) => {

  let sql = "SELECT CONCAT(h.idgasi,'-',name) as idgasiname, count(h.idgasi) as compte "
      sql += 'FROM historic h '
      sql += 'INNER JOIN User u ON h.idgasi = u.idgasi '
      //exclure tous les idgasi DPR et admin
    sql += ' WHERE h.idgasi NOT IN ('
    sql += '(SELECT idgasi_exclu FROM excluredpr)'
    sql += ' )'
      sql += 'GROUP BY idgasiname '
      sql += 'ORDER BY compte DESC LIMIT 3'

  connection_pool.getConnection(function(error, conn) {
    if (error) throw err; // not connected!

    // Use the connection
    conn.query(sql, (err, result) => {
      // When done with the connection, release it.
      conn.release();

      // Handle error after the release.
      if (err) {
        console.log(err)
        return  resp.status(500).json({
                err: "true", 
                error: err.message,
                errno: err.errno,
                sql: err.sql,
                });
      }
      else {
        return  resp
                .status(201)
                .json(result);
      }
    })
  });

});

// router.get('/historicClick', (req, resp) => {

//     let sql = ' SELECT c.mois,'
//     sql += '   CASE WHEN y.Contacts IS NULL THEN 0 ELSE y.Contacts END "Contacts", '
//     sql += '   CASE WHEN y.Diagnostic IS NULL THEN 0 ELSE y.Diagnostic END "Diagnostic", '
//     sql += '   CASE WHEN y.EFO IS NULL THEN 0 ELSE y.EFO END "EFO", '
//     sql += '   CASE WHEN y.Jalons IS NULL THEN 0 ELSE y.Jalons END "Jalons", '
//     sql += '   CASE WHEN y.Prestations IS NULL THEN 0 ELSE y.Prestations END "Prestations"'
//     sql += ' FROM '
//     sql += ' ('
//     sql += '   SELECT x.mois,'
//     sql += '     MAX(CASE WHEN x.button = "Contacts" THEN x.nbclic ELSE 0 END) "Contacts",'
//     sql += '     MAX(CASE WHEN x.button = "Diagnostic" THEN x.nbclic ELSE 0 END) "Diagnostic",'
//     sql += '     MAX(CASE WHEN x.button = "EFO" THEN x.nbclic ELSE 0 END) "EFO",'
//     sql += '     MAX(CASE WHEN x.button = "Jalons" THEN x.nbclic ELSE 0 END) "Jalons",'
//     sql += '     MAX(CASE WHEN x.button = "Prestations" THEN x.nbclic ELSE 0 END) "Prestations"'
//     sql += '   FROM'
//     sql += '   ('
//     sql += '     SELECT MONTH(date) as mois, button, count(id) as nbclic FROM historic WHERE '
//     sql += '       idgasi NOT in ("icbl0540", "irle5360", "admin")' // Liste des noms à enlever (DPR)
//     // sql += '       AND YEAR(date)=2020 '

//     let sqlValues = []
//       Object.keys(req.query).filter((key) => req.query[key]!=='all').map((key) => {
//         if(key==='annee'){
//           sql += ` AND YEAR(date) = ? `      
//           sqlValues.push(req.query[key])
//         }else if(key==='champs'){
//           sql += ` AND champs = ? `      
//           sqlValues.push(req.query[key])
//         }
//       })

//     // sql += '       AND champs="APE L\'EPERON" '
//     sql += '       GROUP BY mois, button'
//     sql += '   ) x'
//     sql += '   GROUP BY x.mois'
//     sql += ' ) y RIGHT JOIN historic_calc c on c.mois= y.mois'
//     sql += '   WHERE c.mois <= ('
//     sql += '                     SELECT MAX(MONTH(date)) FROM historic '
//     sql += '                     WHERE YEAR(date)=2020'
//     sql += '                   ) '
//     sql += '  AND c.mois >= ('
//     sql += '                     SELECT MIN(MONTH(date)) FROM historic '
//     sql += '                     WHERE YEAR(date)=2020'
//     sql += '                   ) ' 

//   connection_pool.getConnection(function(error, conn) {
//     if (error) throw err; // not connected!

//     // Use the connection
//     conn.query(sql, sqlValues, (err, result) => {
//       // When done with the connection, release it.
//       conn.release();

//       // Handle error after the release.
//       if (err) {
//         console.log(err)
//         return  resp.status(500).json({
//                 err: "true", 
//                 error: err.message,
//                 errno: err.errno,
//                 sql: err.sql,
//                 });
//       }
//       else {
//         return  resp
//                 .status(201)
//                 .json(result);
//       }
//     })
//   });

// });




module.exports = router;
