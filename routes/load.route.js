
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
            //supprimer table
            let sql = "DROP TABLE T_Portefeuille;"

            //Recréer table sans index
          
          sql += "   CREATE TABLE `T_Portefeuille` ("
          sql += "    `dc_individu_local` varchar(8) COLLATE utf8_unicode_ci NOT NULL,"
          sql += "    `dc_civilite` varchar(3) COLLATE utf8_unicode_ci NOT NULL,"
          sql += "    `dc_nom` varchar(40) COLLATE utf8_unicode_ci NOT NULL,"
          sql += "    `dc_prenom` varchar(80) COLLATE utf8_unicode_ci DEFAULT NULL,"
          sql += "    `dc_categorie` int(11) NOT NULL,"
          sql += "    `dc_situationde` int(11) NOT NULL,"
          sql += "    `dc_structureprincipalede` int(11) NOT NULL,"
          sql += "    `dc_dernieragentreferent` varchar(7) COLLATE utf8_unicode_ci NOT NULL,"
          sql += "    `dc_parcours` varchar(5) COLLATE utf8_unicode_ci NOT NULL,"
          sql += "    `dc_lblaxetravailprincipal` varchar(200) COLLATE utf8_unicode_ci DEFAULT NULL,"
          sql += "    `dc_telephone` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,"
          sql += "    `dc_adresseemail` varchar(80) COLLATE utf8_unicode_ci DEFAULT NULL,"
          sql += "    `dc_listelblmoyenlocomotion` varchar(150) COLLATE utf8_unicode_ci DEFAULT NULL,"
          sql += "    `dc_presencecv` varchar(5) COLLATE utf8_unicode_ci DEFAULT NULL,"
          sql += "    `dc_listepermis` varchar(80) COLLATE utf8_unicode_ci DEFAULT NULL,"
          sql += "    `datejalonintermediaire` date DEFAULT NULL,"
          sql += "    `dc_lblmotifjalonpersonnalise` varchar(200) COLLATE utf8_unicode_ci DEFAULT NULL,"
          sql += "    `nbjouravantjalon` int(11) DEFAULT NULL,"
          sql += "    `z3_trsansentretien` varchar(80) COLLATE utf8_unicode_ci DEFAULT NULL,"
          sql += "    `z4_trsanscontactsortantteloumel` varchar(80) COLLATE utf8_unicode_ci DEFAULT NULL,"
          sql += "    `z5_trsansformation` varchar(80) COLLATE utf8_unicode_ci DEFAULT NULL,"
          sql += "    `type_presta` varchar(10) COLLATE utf8_unicode_ci DEFAULT NULL,"
          sql += "    `z6_trsanspresta` varchar(80) COLLATE utf8_unicode_ci DEFAULT NULL,"
          sql += "    `nbjourinscrip` int(11) DEFAULT NULL,"
          sql += "    `z7_traffectation` varchar(80) COLLATE utf8_unicode_ci DEFAULT NULL,"
          sql += "    `z8_trdepuisdpae` varchar(80) COLLATE utf8_unicode_ci DEFAULT NULL,"
          sql += "    `colonne109` varchar(2) COLLATE utf8_unicode_ci NOT NULL,"
          sql += "    `colonne113` varchar(2) COLLATE utf8_unicode_ci NOT NULL,"
          sql += "    `colonne117` varchar(2) COLLATE utf8_unicode_ci NOT NULL,"
          sql += "    `colonne122` varchar(2) COLLATE utf8_unicode_ci NOT NULL,"
          sql += "    `colonne127` varchar(2) COLLATE utf8_unicode_ci NOT NULL,"
          sql += "    `colonne136` varchar(2) COLLATE utf8_unicode_ci NOT NULL,"
          sql += "    `colonne140` varchar(2) COLLATE utf8_unicode_ci NOT NULL,"
          sql += "    `colonne40` varchar(2) COLLATE utf8_unicode_ci NOT NULL,"
          sql += "    `colonne41` varchar(2) COLLATE utf8_unicode_ci NOT NULL,"
          sql += "    `colonne42` varchar(2) COLLATE utf8_unicode_ci NOT NULL,"
          sql += "    `colonne43` varchar(2) COLLATE utf8_unicode_ci NOT NULL,"
          sql += "    `colonne44` varchar(2) COLLATE utf8_unicode_ci NOT NULL,"
          sql += "    `colonne45` varchar(2) COLLATE utf8_unicode_ci NOT NULL,"
          sql += "    `colonne46` varchar(2) COLLATE utf8_unicode_ci NOT NULL,"
          sql += "    `colonne47` varchar(2) COLLATE utf8_unicode_ci NOT NULL,"
          sql += "    `colonne48` varchar(2) COLLATE utf8_unicode_ci NOT NULL,"
          sql += "    `colonne49` varchar(2) COLLATE utf8_unicode_ci NOT NULL,"
          sql += "    `colonne50` varchar(2) COLLATE utf8_unicode_ci NOT NULL,"
          sql += "    `colonne51` varchar(2) COLLATE utf8_unicode_ci NOT NULL,"
          sql += "    `colonne64` varchar(2) COLLATE utf8_unicode_ci NOT NULL,"
          sql += "    `colonne65` varchar(2) COLLATE utf8_unicode_ci NOT NULL,"
          sql += "    `colonne66` varchar(2) COLLATE utf8_unicode_ci NOT NULL,"
          sql += "    `colonne80` varchar(2) COLLATE utf8_unicode_ci NOT NULL,"
          sql += "    `colonne82` varchar(2) COLLATE utf8_unicode_ci NOT NULL,"
          sql += "    `colonne83` varchar(2) COLLATE utf8_unicode_ci NOT NULL,"
          sql += "    `colonne84` varchar(2) COLLATE utf8_unicode_ci NOT NULL,"
          sql += "    `colonne85` varchar(2) COLLATE utf8_unicode_ci NOT NULL,"
          sql += "    `colonne86` varchar(2) COLLATE utf8_unicode_ci NOT NULL,"
          sql += "    `colonne95` varchar(2) COLLATE utf8_unicode_ci NOT NULL,"
          sql += "    `colonne96` varchar(2) COLLATE utf8_unicode_ci NOT NULL,"
          sql += "    `colonne97` varchar(2) COLLATE utf8_unicode_ci NOT NULL,"
          sql += "    `colonne98` varchar(2) COLLATE utf8_unicode_ci NOT NULL,"
          sql += "    `colonne99` varchar(2) COLLATE utf8_unicode_ci NOT NULL,"
          sql += "    `colonne143` varchar(2) COLLATE utf8_unicode_ci NOT NULL,"
          sql += "    `colonne144` varchar(2) COLLATE utf8_unicode_ci NOT NULL,"
          sql += "    `colonne145` varchar(2) COLLATE utf8_unicode_ci NOT NULL,"
          sql += "    `colonne146` varchar(2) COLLATE utf8_unicode_ci NOT NULL,"
          sql += "    `colonne147` varchar(2) COLLATE utf8_unicode_ci NOT NULL,"
          sql += "    `colonne160` varchar(2) COLLATE utf8_unicode_ci NOT NULL,"
          sql += "    `colonne163` varchar(2) COLLATE utf8_unicode_ci NOT NULL,"
          sql += "    `c_top_oreavalider_id` varchar(1) COLLATE utf8_unicode_ci NOT NULL,"
          sql += "    `dt` varchar(5) COLLATE utf8_unicode_ci NOT NULL,"
          sql += "    `libelle_ape` varchar(80) COLLATE utf8_unicode_ci NOT NULL,"
          sql += "    `rome_ore` varchar(30) COLLATE utf8_unicode_ci NOT NULL,"
          sql += "    `tranche_age` varchar(30) COLLATE utf8_unicode_ci NOT NULL,"
          sql += "    `nom_ref` varchar(80) COLLATE utf8_unicode_ci DEFAULT NULL,"
          sql += "    `dc_lblrome_ore` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,"
          sql += "    `cadre_rp` varchar(1) COLLATE utf8_unicode_ci NOT NULL,"
          sql += "    `crea` varchar(1) COLLATE utf8_unicode_ci NOT NULL,"
          sql += "    `z1_diag` varchar(20) COLLATE utf8_unicode_ci NOT NULL,"
          sql += "    `nbfrein` int(11) NOT NULL,"
          sql += "    `dc_anc18mois` varchar(30) COLLATE utf8_unicode_ci NOT NULL,"
          sql += "    `z2_consent_visio` varchar(20) COLLATE utf8_unicode_ci NOT NULL,"
          sql += "    `z9_pic` varchar(20) COLLATE utf8_unicode_ci NOT NULL,"
          sql += "    `y1_carte_visite` varchar(1) COLLATE utf8_unicode_ci NOT NULL,"
          sql += "    `y2_nb_besoin_num` int(11) NOT NULL,"
          sql += "    `dc_structure_suivi_delegue` varchar(150) COLLATE utf8_unicode_ci DEFAULT NULL,"
          sql += "    `dc_typesuividelegue` varchar(150) COLLATE utf8_unicode_ci DEFAULT NULL,"
          sql += "    `y3_trdepuismod` varchar(30) COLLATE utf8_unicode_ci NOT NULL,"
          sql += "    PRIMARY KEY (dc_individu_local) "
          sql += "  ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;"
      
      // load file csv
      sql += `LOAD DATA LOCAL INFILE '${filePath}' INTO TABLE T_Portefeuille  FIELDS TERMINATED BY ';' LINES TERMINATED BY '\r\n' IGNORE 1 LINES`
      sql += " SET nbjouravantjalon = nullif(nbjouravantjalon,'');"

      //recréer index attention max 64 index dc il faut choisir
   sql += "   ALTER TABLE `T_Portefeuille` "
   sql += "     ADD KEY `DC_SITUATIONDE` (`dc_situationde`),"
   sql += "     ADD KEY `DC_STRUCTUREPRINCIPALEDE` (`dc_structureprincipalede`),"
   sql += "     ADD KEY `DC_DERNIERAGENTREFERENT` (`dc_dernieragentreferent`),"
   sql += "     ADD KEY `DC_PARCOURS` (`dc_parcours`),"
   sql += "     ADD KEY `Colonne40` (`colonne40`),"
   sql += "     ADD KEY `Colonne41` (`colonne41`),"
   sql += "     ADD KEY `Colonne42` (`colonne42`),"
   sql += "     ADD KEY `Colonne43` (`colonne43`),"
   sql += "     ADD KEY `Colonne44` (`colonne44`),"
   sql += "     ADD KEY `Colonne45` (`colonne45`),"
   sql += "     ADD KEY `Colonne46` (`colonne46`),"
   sql += "     ADD KEY `Colonne47` (`colonne47`),"
   sql += "     ADD KEY `Colonne48` (`colonne48`),"
   sql += "     ADD KEY `Colonne49` (`colonne49`),"
   sql += "     ADD KEY `Colonne50` (`colonne50`),"
  //  sql += "     ADD KEY `Colonne51` (`colonne51`),"
   sql += "     ADD KEY `Colonne64` (`colonne64`),"
   sql += "     ADD KEY `Colonne65` (`colonne65`),"
   sql += "     ADD KEY `Colonne66` (`colonne66`),"
   sql += "     ADD KEY `Colonne80` (`colonne80`),"
   sql += "     ADD KEY `Colonne82` (`colonne82`),"
   sql += "     ADD KEY `Colonne83` (`colonne83`),"
   sql += "     ADD KEY `Colonne84` (`colonne84`),"
   sql += "     ADD KEY `Colonne85` (`colonne85`),"
   sql += "     ADD KEY `Colonne86` (`colonne86`),"
   sql += "     ADD KEY `Colonne95` (`colonne95`),"
   sql += "     ADD KEY `Colonne96` (`colonne96`),"
   sql += "     ADD KEY `Colonne97` (`colonne97`),"
   sql += "     ADD KEY `Colonne98` (`colonne98`),"
   sql += "     ADD KEY `Colonne99` (`colonne99`),"
   sql += "     ADD KEY `Colonne143` (`colonne143`),"
   sql += "     ADD KEY `Colonne144` (`colonne144`),"
   sql += "     ADD KEY `Colonne145` (`colonne145`),"
   sql += "     ADD KEY `Colonne146` (`colonne146`),"
   sql += "     ADD KEY `Colonne147` (`colonne147`),"
   sql += "     ADD KEY `Colonne160` (`colonne160`),"
   sql += "     ADD KEY `Colonne163` (`colonne163`),"
   sql += "     ADD KEY `dt` (`dt`),"
   sql += "     ADD KEY `libelle_ape` (`libelle_ape`),"
   sql += "     ADD KEY `tranche_age` (`tranche_age`),"
   sql += "     ADD KEY `cadre_rp` (`cadre_rp`),"
   sql += "     ADD KEY `crea` (`crea`),"
   sql += "     ADD KEY `diag` (`z1_diag`),"
   sql += "     ADD KEY `nbfrein` (`nbfrein`),"
   sql += "     ADD KEY `anc18mois` (`dc_anc18mois`),"
   sql += "     ADD KEY `consent_visio` (`z2_consent_visio`),"
   sql += "     ADD KEY `c_top_oreavalider_id` (`c_top_oreavalider_id`),"
   sql += "     ADD KEY `dc_lblaxetravailprincipal` (`dc_lblaxetravailprincipal`),"
   sql += "     ADD KEY `z9_pic` (`z9_pic`),"
   sql += "     ADD KEY `y1_carte_visite` (`y1_carte_visite`),"
   sql += "     ADD KEY `y2_nb_besoin_num` (`y2_nb_besoin_num`),"
   sql += "     ADD KEY `colonne140` (`colonne140`),"
   sql += "     ADD KEY `colonne109` (`colonne109`),"
   sql += "     ADD KEY `colonne113` (`colonne113`),"
   sql += "     ADD KEY `colonne117` (`colonne117`),"
   sql += "     ADD KEY `colonne122` (`colonne122`),"
   sql += "     ADD KEY `colonne127` (`colonne127`),"
   sql += "     ADD KEY `colonne136` (`colonne136`),"
   sql += "     ADD KEY `z3_trsansentretien` (`z3_trsansentretien`),"
   sql += "     ADD KEY `z4_trsanscontactsortantteloumel` (`z4_trsanscontactsortantteloumel`),"
   sql += "     ADD KEY `z5_trsansformation` (`z5_trsansformation`),"
   sql += "     ADD KEY `z6_trsanspresta` (`z6_trsanspresta`),"
   sql += "     ADD KEY `z8_trdepuisdpae` (`z8_trdepuisdpae`),"
   sql += "     ADD KEY `y3_trdepuismod` (`y3_trdepuismod`);"

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
            
              res.status(201).json({err: "false", error: "ok", arr: result[2]})
              
            }
          });   
        });
  
    })
  })

  // connection.query(sql, [req_arr], (err, result) => {
  //   if (err) {
  //     // console.log(err.message)
  //     return res.status(500).json({
  //       err: "true", 
  //       error: err.message,
  //       errno: err.errno,
  //       sql: err.sql,
  //       arr: req_arr,
  //     });
  //   }
  //   else {
  //     return res
  //     .status(201)
  //     .json({err: "false", error: "ok", arr: req_arr, nb_ligne:result.affectedRows});
  //   }
  // })


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
              sql += "libelle_ape"
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

  let sql = 'SELECT a.mois, '
    sql += 'a.Contacts, p.ContactsPersonne,'
    sql += 'a.Diagnostic, p.DiagnosticPersonne,'
    sql += 'a.EFO, p.EFOPersonne,'
    sql += 'a.Jalons, p.JalonsPersonne,'
    sql += 'a.Taux, p.TauxPersonne,'
    sql += 'a.Prestations, p.PrestationsPersonne FROM '
    sql += ' ('
    sql += '    SELECT c.mois,'
    sql += '        CASE WHEN y.Contacts IS NULL THEN 0 ELSE y.Contacts END "Contacts", '
    sql += '        CASE WHEN y.Diagnostic IS NULL THEN 0 ELSE y.Diagnostic END "Diagnostic", '
    sql += '        CASE WHEN y.EFO IS NULL THEN 0 ELSE y.EFO END "EFO", '
    sql += '        CASE WHEN y.Jalons IS NULL THEN 0 ELSE y.Jalons END "Jalons", '
    sql += '        CASE WHEN y.Taux IS NULL THEN 0 ELSE y.Taux END "Taux", '
    sql += '        CASE WHEN y.Prestations IS NULL THEN 0 ELSE y.Prestations END "Prestations"'
    sql += '    FROM '
    sql += '    ('
    sql += '          SELECT x.mois,'
    sql += '              MAX(CASE WHEN x.button = "Contacts" THEN x.nbclic ELSE 0 END) "Contacts",'
    sql += '              MAX(CASE WHEN x.button = "Diagnostic" THEN x.nbclic ELSE 0 END) "Diagnostic",'
    sql += '              MAX(CASE WHEN x.button = "EFO" THEN x.nbclic ELSE 0 END) "EFO",'
    sql += '             MAX(CASE WHEN x.button = "Jalons" THEN x.nbclic ELSE 0 END) "Jalons",'
    sql += '             MAX(CASE WHEN x.button = "Taux" THEN x.nbclic ELSE 0 END) "Taux",'
    sql += '             MAX(CASE WHEN x.button = "Prestations" THEN x.nbclic ELSE 0 END) "Prestations"'
    sql += '         FROM'
    sql += '         ('
    sql += '              SELECT MONTH(date) as mois, button, count(id) as nbclic FROM historic '
    sql += '             WHERE idgasi NOT in ("icbl0540")'
    sql += '             AND YEAR(date)=2020 '
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
    sql += '            CASE WHEN y.Prestations IS NULL THEN 0 ELSE y.Prestations END "PrestationsPersonne"'
    sql += '        FROM '
    sql += '        ('
    sql += '          SELECT x.mois,'
    sql += '              MAX(CASE WHEN x.button = "Contacts" THEN x.nbclic ELSE 0 END) "Contacts",'
    sql += '              MAX(CASE WHEN x.button = "Diagnostic" THEN x.nbclic ELSE 0 END) "Diagnostic",'
    sql += '              MAX(CASE WHEN x.button = "EFO" THEN x.nbclic ELSE 0 END) "EFO",'
    sql += '              MAX(CASE WHEN x.button = "Jalons" THEN x.nbclic ELSE 0 END) "Jalons",'
    sql += '              MAX(CASE WHEN x.button = "Taux" THEN x.nbclic ELSE 0 END) "Taux",'
    sql += '              MAX(CASE WHEN x.button = "Prestations" THEN x.nbclic ELSE 0 END) "Prestations"'
    sql += '          FROM'
    sql += '          ('
    sql += '              SELECT MONTH(date) as mois, button, count(DISTINCT(idgasi)) as nbclic FROM historic '
    sql += '              WHERE idgasi NOT in ("icbl0540")'
    sql += '              AND YEAR(date)=2020 '
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

    let sqlValues = []
    //   Object.keys(req.query).filter((key) => req.query[key]!=='all').map((key) => {
    //     if(key==='annee'){
    //       sql += ` AND YEAR(date) = ? `      
    //       sqlValues.push(req.query[key])
    //     }else if(key==='champs'){
    //       sql += ` AND champs = ? `      
    //       sqlValues.push(req.query[key])
    //     }
    //   })

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




router.get('/historicNbPersonne', (req, resp) => {

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
    sql += '     SELECT MONTH(date) as mois, button, count(DISTINCT(idgasi)) as nbclic FROM historic WHERE '
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