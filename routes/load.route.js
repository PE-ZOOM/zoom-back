
// We always need to require express in every route file
const express = require('express');
// We create the express router 
const router = express.Router();
// We require the database connection configuration
// const connection = require('../db');
const passport = require('passport');
const connection_pool = require('../db2');
var multer = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
                cb(null, 'csv/')
              },
  filename: function (req, file, cb) {
    // cb(null, Date.now() + '-' +file.originalname )
    cb(null, file.originalname )
          }
})

var upload = multer({ storage: storage }).single('file')




router.post('/truncate', passport.authenticate('jwt', { session:  false }), (req,resp) =>{
  let sql = 'TRUNCATE TABLE ' + Object.keys(req.query).toString()

  connection_pool.getConnection(function(error, conn) {
    if (error) throw err; // not connected!

    conn.query(sql, (err, result) => {
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
        resp.status(201).json({err: "false", error: "ok", arr: result})
      }

    // Don't use the connection here, it has been returned to the pool.
    });   
  });
})


router.post('/t_efo', passport.authenticate('jwt', { session:  false }), (req,res) =>{

  
  upload(req, res, function (err_upload) {
    if (err_upload instanceof multer.MulterError) {
        return res.status(500).json(err_upload)
    } else if (err_upload) {
      console.log(err_upload)
        return res.status(500).json(err_upload)
    }
    // console.log(req.file.filename)
      let filePath = 'csv/'+req.file.filename
      let sql = "LOAD DATA LOCAL INFILE '" +filePath+ "'  INTO TABLE T_EFO  FIELDS TERMINATED BY ';' LINES TERMINATED BY '\r\n' IGNORE 1 LINES"
      sql += '(dc_individu_local,dc_structureprincipalede,dc_dernieragentreferent,dc_civilite,dc_nom,dc_prenom,dc_categorie,dc_situationde,'
      sql += 'dc_parcours,dc_telephone,dc_adresseemail,dc_statutaction_id,dc_formacode_id,dc_lblformacode,dd_datepreconisation,dt,libelle_ape,nom_ref);'
      
  //  console.log(sql)

      connection_pool.getConnection(function(error, conn) {
        if (error) throw err; // not connected!
    
        conn.query(sql, (err, result) => {
        // When done with the connection, release it.
          conn.release();
    
          // Handle error after the release.
          if (err){
            // console.log(err)
            return  res.status(500).json({
                    err: "true", 
                    error: err.message,
                    errno: err.errno,
                    sql: err.sql,
                    });
          }else{
            res.status(201).json({err: "false", error: "ok", arr: result})
            
          }
        });   
      });

  })
})

//fonction pour tester si query en cours
// function verifquery (req,res) {
//   sql='SELECT * FROM information_schema.innodb_trx t JOIN information_schema.processlist p ON t.trx_mysql_thread_id = p.id'
// }



router.post('/t_portefeuille', passport.authenticate('jwt', { session:  false }), (req,res) =>{
  
  // res.setTimeout(0)

  upload(req, res, function (err_upload) {
    if (err_upload instanceof multer.MulterError) {
        return res.status(500).json(err_upload)
    } else if (err_upload) {
      console.log(err_upload)
        return res.status(500).json(err_upload)
    }
    
      let filePath = 'csv/'+req.file.filename
      let sql = `LOAD DATA LOCAL INFILE '${filePath}' INTO TABLE T_Portefeuille  FIELDS TERMINATED BY ';' LINES TERMINATED BY '\r\n' IGNORE 1 LINES`
      sql += " SET nbjouravantjalon = nullif(nbjouravantjalon,'');"
         
        //  console.log(sql)   
          
        connection_pool.getConnection(function(error, conn) {
          if (error) throw err; // not connected!
           //conn.query({sql:sql,timeout: 0}, (err, result) => {
            conn.query(sql, (err, result) => {
          // When done with the connection, release it.
            conn.release();

            // Handle error after the release.
            if (err){

              return  res.status(500).json({
                      err: "true", 
                      error: err.message,
                      errno: err.errno,
                      sql: err.sql,
                      });
            }else{

              res.status(201).json({err: "false", error: "ok", arr: result})
              
            }
          });   
        });
  
    })
  })


router.post('/t_activites', passport.authenticate('jwt', { session:  false }), (req,res) =>{
  // let req_arr = Object.values(req.body).map((v) => Object.values(v).map((value) => value===null?0:value));
  
  // let req_arr = Object.values(req.body).map((v) => Object.values(v.data).map((y) => y ));
  // let sql = "INSERT INTO T_Activites "+
  //             "("+
  //                 "`dc_agentreferent`,         `nom_complet`,           `dc_structureprincipalesuivi`, "+ 
  //                 "`dc_modalitesuiviaccomp_id`, `nb_de_affectes`,        `contacts_phys`,               `contacts_tel_entrant`, "+
  //                 "`contacts_tel_sortant`,      `contacts_mail_entrant`, `contacts_mail_sortant`,       `contacts_internet_entrant`, "+
  //                 "`contacts_internet_sortant`, `dem_de_trait_phys`,     `dem_de_trait_tel`,            `entretien_phys`, "+
  //                 "`entretien_tel`,             `entretien_mail`,        `entretien_dmc`,               `mailnet_entrant`, "+
  //                 "`mailnet_sortant`,           `contact_sortant`,       `contact_entrant`,             `dpae`, "+
  //                 "`presta_rca`,                `presta_aem`,            `presta_acp`,                  `presta_z04`, "+
  //                 "`presta_atl`,                `presta_atj`,            `presta_c71`,                  `presta_z15`, "+
  //                 "`presta_ecc`,                `presta_esp`,            `presta_espr`,                 `presta_z07`, "+
  //                 "`presta_z08`,                `presta_z10`,            `presta_m06`,                  `presta_z18`, "+
  //                 "`presta_z13`,                `presta_z12`,            `presta_z17`,                  `presta_z02`, "+
  //                 "`presta_z16`,                `presta_rgc`,            `presta_m03`,                  `presta_m01`, "+
  //                 "`presta_vsi`,                `presta`,                `formation`,                    `annee`, "+
  //                 "`mois`,                      `dt`,                    `libelle_ape`"+
  //             ") VALUES ?"

  // connection_pool.getConnection(function(error, conn) {
  //   if (error) throw err; // not connected!

  //   // Use the connection
  //   conn.query(sql, [req_arr], (err, result) => {
  //     // When done with the connection, release it.
  //     conn.release();

  //     // Handle error after the release.
  //     if (err) {
  //       // console.log(err)
  //       return  res.status(500).json({
  //               err: "true", 
  //               error: err.message,
  //               errno: err.errno,
  //               sql: err.sql,
  //               arr: req_arr,
  //               });
  //     }
  //     else {
  //       return  res
  //               .status(201)
  //               .json({err: "false", error: "ok", arr: req_arr, nb_ligne:result.affectedRows}
  //       );
  //     }
  //   })
  // });

  upload(req, res, function (err_upload) {
    if (err_upload instanceof multer.MulterError) {
        return res.status(500).json(err_upload)
    } else if (err_upload) {
      console.log(err_upload)
        return res.status(500).json(err_upload)
    }
    
      let filePath = 'csv/'+req.file.filename
      let sql = "LOAD DATA LOCAL INFILE '" +filePath+ "'  REPLACE INTO TABLE T_Activites  FIELDS TERMINATED BY ';' LINES TERMINATED BY '\r\n' IGNORE 1 ROWS"
           sql += "("
              sql += "dc_agentreferent,"
              sql += "nom_complet,"
              sql += "dc_structureprincipalesuivi,"
              sql += "dc_modalitesuiviaccomp_id,"
              sql += "nb_de_affectes,"
              sql += "contacts_phys,"
              sql += "contacts_tel_entrant,"
              sql += "contacts_tel_sortant,"
              sql += "contacts_mail_entrant,"
              sql += "contacts_mail_sortant,"
              sql += "contacts_internet_entrant,"
              sql += "contacts_internet_sortant,"
              sql += "dem_de_trait_phys,"
              sql += "dem_de_trait_tel,"
              sql += "entretien_phys,"
              sql += "entretien_tel,"
              sql += "entretien_mail,"
              sql += "entretien_dmc,"
              sql += "mailnet_entrant,"
              sql += "mailnet_sortant,"
              sql += "contact_sortant,"
              sql += "contact_entrant,"
              sql += "dpae,"
              sql += "presta_rca,"
              sql += "presta_aem,"
              sql += "presta_ap2,"
              sql += "presta_z04,"
              sql += "presta_atl,"
              sql += "presta_atj,"
              sql += "presta_c71,"
              sql += "presta_z15,"
              sql += "presta_ecc,"
              sql += "presta_esp,"
              sql += "presta_espr,"
              sql += "presta_z07,"
              sql += "presta_z08,"
              sql += "presta_z10,"
              sql += "presta_m06,"
              sql += "presta_z18,"
              sql += "presta_z13,"
              sql += "presta_z12,"
              sql += "presta_z17,"
              sql += "presta_z02,"
              sql += "presta_z16,"
              sql += "presta_rgc,"
              sql += "presta_m03,"
              sql += "presta_m01,"
              sql += "presta_vsi,"
              sql += "presta,"
              sql += "presta_acl,"
              sql += "presta_emd,"
              sql += "formation,"
              sql += "annee,"
              sql += "mois,"
              sql += "dt,"
              sql += "libelle_ape,"
              sql += "mec,"
              sql += "mer,"
              sql += "merplus,"
              sql += "de_mec,"
              sql += "de_mer,"
              sql += "de_merplus"
        sql += ") ;"

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
            res.status(201).json({err: "false", error: "ok", arr: result})
          }
        });   
      });

  })

})

//dates mise à jour tables
router.get('/historicMAJ', passport.authenticate('jwt', { session:  false }), (req,resp) =>{
  let sql = 'SELECT DATE_FORMAT(MAX(dateMAJ), "%d/%m/%Y") as dateMAJ, tableMAJ FROM miseajour '
  let fieldValue='';

  //T_Portefeuille
  if (req.query.tableMAJ) {
    fieldValue = req.query.tableMAJ;
    sql += ' WHERE tableMAJ = ? ';
  }

  sql += ' GROUP BY tableMAJ ORDER BY tableMAJ'

  connection_pool.getConnection(function(error, conn) {
    if (error) throw err; // not connected!

    // Use the connection
    conn.query(sql, [fieldValue], (err, result) => {
      // When done with the connection, release it.
      conn.release();

      // Handle error after the release.
      if (err) {
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



router.get('/historic', passport.authenticate('jwt', { session:  false }), (req,resp) =>{
  let sql = 'SELECT DISTINCT button'
      sql += ' FROM historic'

  connection_pool.getConnection(function(error, conn) {
    if (error) throw err; // not connected!

    // Use the connection
    conn.query(sql, (err, result) => {
      // When done with the connection, release it.
      conn.release();

      // Handle error after the release.
      if (err) {
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
    sql += '             MAX(CASE WHEN x.button = "Jalons" THEN x.nbclic ELSE 0 END) "Jalons",'
    sql += '             MAX(CASE WHEN x.button = "Taux" THEN x.nbclic ELSE 0 END) "Taux",'
    sql += '             MAX(CASE WHEN x.button = "DPAE_MEC" THEN x.nbclic ELSE 0 END) "DPAE_MEC",'
    sql += '             MAX(CASE WHEN x.button = "Prestations" THEN x.nbclic ELSE 0 END) "Prestations"'
    sql += '         FROM'
    sql += '         ('
    sql += '              SELECT MONTH(date) as mois, button, count(id) as nbclic FROM historic '
    sql += '             WHERE idgasi NOT in ("icbl0540")'
    // sql += '             AND YEAR(date)=2020 '

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
    sql += '            WHERE YEAR(date)=2020'
    sql += '          )'
    sql += '          AND c.mois >= ('
    sql += '             SELECT MIN(MONTH(date)) FROM historic '
    sql += '             WHERE YEAR(date)=2020'
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
    sql += '              WHERE idgasi NOT in ("icbl0540")'
    // sql += '              AND YEAR(date)=2020 '

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
    sql += '              WHERE YEAR(date)=2020'
    sql += '           )'
    sql += '          AND c.mois >= ('
    sql += '             SELECT MIN(MONTH(date)) FROM historic '
    sql += '             WHERE YEAR(date)=2020'
    sql += '           ) ' 
    sql += '     ) p ON p.mois = a.mois '

    // sql += '       AND champs="APE L\'EPERON" '
    // sql += '       GROUP BY mois, button'
    // sql += '   ) x'
    // sql += '   GROUP BY x.mois'
    // sql += ' ) y RIGHT JOIN historic_calc c on c.mois= y.mois'
    // sql += '   WHERE c.mois <= ('
    // sql += '                     SELECT MAX(MONTH(date)) FROM historic '
    // sql += '                     WHERE YEAR(date)=2020'
    // sql += '                   ) '
    // sql += '  AND c.mois >= ('
    // sql += '                     SELECT MIN(MONTH(date)) FROM historic '
    // sql += '                     WHERE YEAR(date)=2020'
    // sql += '                   ) ' 

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

  let sql = 'SELECT name, count(h.idgasi) as compte '
      sql += 'FROM historic h '
      sql += 'INNER JOIN user u ON h.idgasi = u.idgasi '
      sql += 'WHERE h.idgasi NOT in ("icbl0540", "a", "zz","to") '
      sql += 'GROUP BY name '
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




router.get('/historicClick', (req, resp) => {

  // let sql = 'SELECT MONTH(date) AS mois, button AS BT, COUNT(*) as NB FROM historic GROUP BY mois, BT '

  let sql = ' SELECT c.mois,'
    sql += '   CASE WHEN y.Contacts IS NULL THEN 0 ELSE y.Contacts END "Contacts", '
    sql += '   CASE WHEN y.Diagnostic IS NULL THEN 0 ELSE y.Diagnostic END "Diagnostic", '
    sql += '   CASE WHEN y.EFO IS NULL THEN 0 ELSE y.EFO END "EFO", '
    sql += '   CASE WHEN y.Jalons IS NULL THEN 0 ELSE y.Jalons END "Jalons", '
    sql += '   CASE WHEN y.Prestations IS NULL THEN 0 ELSE y.Prestations END "Prestations"'
    sql += ' FROM '
    sql += ' ('
    sql += '   SELECT x.mois,'
    sql += '     MAX(CASE WHEN x.button = "Contacts" THEN x.nbclic ELSE 0 END) "Contacts",'
    sql += '     MAX(CASE WHEN x.button = "Diagnostic" THEN x.nbclic ELSE 0 END) "Diagnostic",'
    sql += '     MAX(CASE WHEN x.button = "EFO" THEN x.nbclic ELSE 0 END) "EFO",'
    sql += '     MAX(CASE WHEN x.button = "Jalons" THEN x.nbclic ELSE 0 END) "Jalons",'
    sql += '     MAX(CASE WHEN x.button = "Prestations" THEN x.nbclic ELSE 0 END) "Prestations"'
    sql += '   FROM'
    sql += '   ('
    sql += '     SELECT MONTH(date) as mois, button, count(id) as nbclic FROM historic WHERE '
    sql += '       idgasi NOT in ("icbl0540", "irle5360", "admin")' // Liste des noms à enlever (DPR)
    // sql += '       AND YEAR(date)=2020 '

    let sqlValues = []
      Object.keys(req.query).filter((key) => req.query[key]!=='all').map((key) => {
        if(key==='annee'){
          sql += ` AND YEAR(date) = ? `      
          sqlValues.push(req.query[key])
        }else if(key==='champs'){
          sql += ` AND champs = ? `      
          sqlValues.push(req.query[key])
        }
      })

    // sql += '       AND champs="APE L\'EPERON" '
    sql += '       GROUP BY mois, button'
    sql += '   ) x'
    sql += '   GROUP BY x.mois'
    sql += ' ) y RIGHT JOIN historic_calc c on c.mois= y.mois'
    sql += '   WHERE c.mois <= ('
    sql += '                     SELECT MAX(MONTH(date)) FROM historic '
    sql += '                     WHERE YEAR(date)=2020'
    sql += '                   ) '
    sql += '  AND c.mois >= ('
    sql += '                     SELECT MIN(MONTH(date)) FROM historic '
    sql += '                     WHERE YEAR(date)=2020'
    sql += '                   ) ' 

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

//liste filter ref
//http://localhost:5000/activites/listeref?
router.get('/listechamps', passport.authenticate('jwt', { session:  false }), (req,resp) =>{
  const query = req.query;

  let sql = "SELECT DISTINCT(champs) FROM `historic`"

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




router.get('/nbligne', passport.authenticate('jwt', { session:  false }), (req,resp) =>{
  let sql = 'SELECT count(*) as nblig from '
  sql += Object.keys(req.query).toString().slice(1)
 
// console.log(sql)

  connection_pool.getConnection(function(error, conn) {
    if (error) throw err; // not connected!

    // Use the connection
    conn.query(sql, (err, result) => {
      // When done with the connection, release it.
      conn.release();

      // Handle error after the release.
      if (err) {
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




router.post('/maj', passport.authenticate('jwt', { session:  false }), (req,resp) =>{
  let req_arr = Object.values(req.body).map((v) => v===null?0:v);
  let sql = "INSERT INTO miseajour "+
              "("+
                  "`dateMAJ`,         `tableMAJ`" +
              ") VALUES (?)"

  // return resp.status(201)
  connection_pool.getConnection(function(error, conn) {
    if (error) throw err; // not connected!

    // Use the connection
    conn.query(sql, [req_arr], (err, result) => {
      // When done with the connection, release it.
      conn.release();

      // Handle error after the release.
      if (err) {
        return  resp.status(500).json({
                err: "true", 
                error: err.message,
                errno: err.errno,
                sql: err.sql,
                arr: req_arr,
                });
      }
      else {
        return  resp
                .status(201)
                .json({err: "false", error: "ok", arr: req_arr, nb_ligne:result.affectedRows}
        );
      }
    })
  });

})

module.exports = router;