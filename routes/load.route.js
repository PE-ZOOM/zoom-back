
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