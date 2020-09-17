
// We always need to require express in every route file
const express = require('express');
// We create the express router 
const router = express.Router();
// We require the database connection configuration
// const connection = require('../db');
const passport = require('passport');

const connection_pool = require('../db2');

router.get('/test', (req, resp) => {

  connection_pool.getConnection(function(error, conn) {
    if (error) throw err; // not connected!

    // Use the connection
    conn.query('SELECT * from ape', (err, result) => {
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
        resp.status(201).json({err: "false", error: "ok", arr: result})
      }

    // Don't use the connection here, it has been returned to the pool.
    });

  });

});

router.post('/truncate', passport.authenticate('jwt', { session:  false }), (req,resp) =>{
  let sql = 'TRUNCATE TABLE ' + Object.keys(req.query).toString()

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
        resp.status(201).json({err: "false", error: "ok", arr: result})
      }

    // Don't use the connection here, it has been returned to the pool.
    });   
  });
})


router.post('/t_efo', passport.authenticate('jwt', { session:  false }), (req,resp) =>{

  let req_arr = Object.values(req.body).map((v) => Object.values(v).map((value) => value===null?0:value));
  let sql = "INSERT INTO T_EFO "+
                "("+
                  "`dc_individu_local`,       `dc_structureprincipalede`, `dc_dernieragentreferent`, "+
                  "`dc_civilite`,             `dc_nom`,                   `dc_prenom`,                `dc_categorie`, "+
                  "`dc_situationde`,          `dc_parcours`,              `dc_telephone`,             `dc_adresseemail`, "+
                  "`dc_listeromemetierrech`,  `dc_listeromeprojetmetier`, `dc_listeromecreatreprise`, `dc_statutaction_id`, "+
                  "`dc_formacode_id`,         `dc_lblformacode`,          `dd_datepreconisation`"+
                ") VALUES ?"

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



  // console.log("-------------------------")
  // console.log(req.body.count)
  // console.log("-------------------------")
  // return resp.status(201).json({err: "false", error: "ok"});

})

router.post('/t_portefeuille', passport.authenticate('jwt', { session:  false }), (req,resp) =>{

  // let req_arr = Object.values(req.body).map((v) => Object.values(v).map((value) => value===null?0:value));
  // let req_arr = []
  // console.log(Object.entries(req.body))
  // for (key in req.body) {
  //     req_arr.push(Object.values(req.body[key].data).map((v) => v===null?0:v));
  // }

  let req_arr = Object.values(req.body).map((v) => Object.values(v).map((value) => value===null?0:value));
  // con.query('TRUNCATE TABLE `t_portefeuille`')
  let sql = "INSERT INTO t_portefeuille ("+
                      "`dc_individu_local`,                 `dc_civilite`,              `dc_nom`, "+
                      "`dc_prenom`,                         `dc_categorie`,             `dc_situationde`, "+
                      "`dc_structureprincipalede`,          `dc_dernieragentreferent`,  `dc_parcours`, `dc_lblaxetravailprincipal`,"+
                      "`dc_telephone`,                      `dc_adresseemail`,          `dc_listeromemetierrech`, "+
                      "`dc_listeromeprojetmetier`,          `dc_listeromecreatreprise`, `dc_niveauformationmax`, "+
                      "`dc_listelblmoyenlocomotion`,        `dc_presencecv`,    `dc_listepermis`,           `datejalonintermediaire`, "+
                      "`dc_lblmotifjalonpersonnalise`,      `nbjouravantjalon`,         `nbjoursansentretien`, "+
                      "`nbjoursanscontactsortantteloumel`,                              `nbjoursansformation`, "+
                      "`type_presta`,                       `nbjoursanspresta`,         `nbjourinscrip`, "+
                      "`nbjouraffectation`,                 `nbjourdepuisdpae`,         `colonne109`, "+
                      "`colonne113`,                        `colonne117`,               `colonne122`, "+
                      "`colonne127`,                        `colonne136`,               `colonne140`, "+
                      "`colonne40`,                         `colonne41`,                `colonne42`, "+
                      "`colonne43`,                         `colonne44`,                `colonne45`, "+
                      "`colonne46`,                         `colonne47`,                `colonne48`, "+
                      "`colonne49`,                         `colonne50`,                `colonne51`, "+
                      "`colonne64`,                         `colonne65`,                `colonne66`, "+
                      "`colonne80`,                         `colonne82`,                `colonne83`, "+
                      "`colonne84`,                         `colonne85`,                `colonne86`, "+
                      "`colonne95`,                         `colonne96`,                `colonne97`, "+
                      "`colonne98`,                         `colonne99`,                `colonne143`, "+
                      "`colonne144`,                        `colonne145`,               `colonne146`, "+
                      "`colonne147`,                        `colonne160`,               `colonne163`, `c_top_oreavalider_id`"+
                  ") VALUES ?"
    
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


  // connection.query(sql, [req_arr], (err, result) => {
  //   if (err) {
  //     // console.log(err.message)
  //     return resp.status(500).json({
  //       err: "true", 
  //       error: err.message,
  //       errno: err.errno,
  //       sql: err.sql,
  //       arr: req_arr,
  //     });
  //   }
  //   else {
  //     return resp
  //     .status(201)
  //     .json({err: "false", error: "ok", arr: req_arr, nb_ligne:result.affectedRows});
  //   }
  // })



})

router.post('/t_activites', passport.authenticate('jwt', { session:  false }), (req,resp) =>{
  let req_arr = Object.values(req.body).map((v) => Object.values(v).map((value) => value===null?0:value));
  let sql = "INSERT INTO t_activites "+
              "("+
                  "`dc_agentreferent`,         `nom_complet`,           `dc_structureprincipalesuivi`, "+ 
                  "`dc_modalitesuiviaccomp_id`, `nb_de_affectes`,        `contacts_phys`,               `contacts_tel_entrant`, "+
                  "`contacts_tel_sortant`,      `contacts_mail_entrant`, `contacts_mail_sortant`,       `contacts_internet_entrant`, "+
                  "`contacts_internet_sortant`, `dem_de_trait_phys`,     `dem_de_trait_tel`,            `entretien_phys`, "+
                  "`entretien_tel`,             `entretien_mail`,        `entretien_dmc`,               `mailnet_entrant`, "+
                  "`mailnet_sortant`,           `contact_sortant`,       `contact_entrant`,             `dpae`, "+
                  "`presta_rca`,                `presta_aem`,            `presta_acp`,                  `presta_z04`, "+
                  "`presta_atl`,                `presta_atj`,            `presta_c71`,                  `presta_z15`, "+
                  "`presta_ecc`,                `presta_esp`,            `presta_espr`,                 `presta_z07`, "+
                  "`presta_z08`,                `presta_z10`,            `presta_m06`,                  `presta_z18`, "+
                  "`presta_z13`,                `presta_z12`,            `presta_z17`,                  `presta_z02`, "+
                  "`presta_z16`,                `presta_rgc`,            `presta_m03`,                  `presta_m01`, "+
                  "`presta_vsi`,                `presta`,                `formation`,                    `annee`, "+
                  "`mois`"+
              ") VALUES ?"

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

router.get('/historicMAJ', (req, resp) => {
  let sql = 'SELECT DATE_FORMAT(max(dateMAJ), " %d/%m/%Y") as Date, tableMAJ FROM miseajour GROUP BY tableMAJ ORDER BY tableMAJ'

  // connection.query('SELECT COUNT(button) as Jalon FROM historic WHERE button = "Jalons"', (err, results) => {

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



router.get('/historic', (req, resp) => {
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


router.get('/historicS', (req, resp) => {
    let sql = 'SELECT COUNT(*), button as bt'
        sql += ' FROM historic WHERE WEEK(date) = WEEK(curdate()) AND MONTH(date) = MONTH(CURDATE())'
        sql += ' AND NOT idgasi = "a"'
        sql += ' GROUP BY button'
    // connection.query('SELECT COUNT(button) as Jalon FROM historic WHERE button = "Jalons"', (err, results) => {
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

router.get('/historicH', (req, resp) => {
    let sql = 'SELECT COUNT(*), button'
        sql += ' FROM historic WHERE MONTH(date) = MONTH(CURDATE())'
        sql += ' AND NOT idgasi = "a"'
        sql += ' GROUP BY button'
    // connection.query('SELECT COUNT(button) as Jalon FROM historic WHERE button = "Jalons"', (err, results) => {
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


router.get('/nbligne', (req, resp) => {
  let sql = 'SELECT count(*) as efo from '
  sql += Object.keys(req.query).toString().slice(1)
  // connection.query('SELECT COUNT(button) as Jalon FROM historic WHERE button = "Jalons"', (err, results) => {

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

module.exports = router;



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