
// We always need to require express in every route file
const express = require('express');
// We create the express router 
const router = express.Router();
// We require the database connection configuration
const connection = require('../db');
const passport = require('passport');

const con = require('../db2');



router.get('/truncate', passport.authenticate('jwt', { session:  false }), (req,resp) =>{
  let sql = 'TRUNCATE TABLE ' + Object.keys(req.query).toString()

  connection.query(sql, (err, results) => {
      if (err) {
        resp.status(500).send('Internal server error')
      } else {
        resp.json(results)
      }
  })
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

  // con.query('TRUNCATE TABLE `T_EFO`')
  con.query(sql, [req_arr], (err, result) => {
    if (err) {
      return resp.status(500).json({
        err: "true", 
        error: err.message,
        errno: err.errno,
        sql: err.sql,
        arr: req_arr,
      });
    }
    else {
      return resp
      .status(201)
      .json({err: "false", error: "ok", arr: req_arr, nb_ligne:result.affectedRows});
    }
  })

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
  // con.query('TRUNCATE TABLE `t_portefeuille`')
  con.query(sql, [req_arr], (err, result) => {
    if (err) {
      console.log(err.message)
      return resp.status(500).json({
        err: "true", 
        error: err.message,
        errno: err.errno,
        sql: err.sql,
        arr: req_arr,
      });
    }
    else {
      return resp
      .status(201)
      .json({err: "false", error: "ok", arr: req_arr, nb_ligne:result.affectedRows});
    }
  })
    // POUR RECUPERER LE NB DE LIGNE APRES CHAQUE ENREGISTREM>ENT ?
    // con.query(sql, [req_arr], (err, result) => {
    // if (err) {
    //   console.log(err.message)
    //   return resp.status(500).json({
    //     err: "true", 
    //     error: err.message,
    //     errno: err.errno,
    //     sql: err.sql,
    //     arr: req_arr,
    //   });
    // }
    // else {
    //   let sql2 = 'SELECT COUNT(*) as NbLigne'
    //     sql2 += ' FROM t_portefeuille'
    //     connection.query(sql2, (err2, results) => {
    //       if (err2) {
    //         return resp.status(201).json({err: "false", error: "ok", arr: req_arr, nb_ligne:result.affectedRows, result:result});
    //       } else {
    //         resp.status(201).json(results);
    //       }
    //     }); 
    // }
    // })




  // --------------------------------- APE -------------------------------------------------------------------
    // const req_arr = Object.values(req.body).map((v) => Object.values(v));
    // connection.query('TRUNCATE TABLE `ape`')
    // connection.query("INSERT INTO ape (`id_ape`, `libelle_ape`, `dt`) VALUES ?", [req_arr], (err, result) => {
    //  if (err) {
    //     return resp.status(500).json({
    //       err: "true", 
    //       error: err.message,
    //       sql: err.sql,
    //       arr: req_arr,
    //     });
    //   }
    //   else {
    //     return resp
    //     .status(201)
    //     .json({err: "false", error: "ok", arr: req_arr,});
    //   }
    
    // })
})

router.post('/t_activites', passport.authenticate('jwt', { session:  false }), (req,resp) =>{
  // const req_arr = Object.values(req.body).map((v) => Object.values(v));
  // let req_arr = []
  // // console.log(Object.entries(req.body))
  // for (key in req.body) {
  //     req_arr.push(Object.values(req.body[key].data).map((v) => v===null?0:v));
  // }

  let req_arr = Object.values(req.body).map((v) => Object.values(v).map((value) => value===null?0:value));

  // let sql = "INSERT INTO t_activites VALUES ?"
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

  con.query('TRUNCATE TABLE `t_activites`')
  con.query(sql, [req_arr], (err, result) => {
    if (err) {
      return resp.status(500).json({
        err: "true", 
        error: err.message,
        errno: err.errno,
        sql: err.sql,
        arr: req_arr,
      });
    }
    else {
      return resp
      .status(201)
      .json({err: "false", error: "ok", arr: req_arr, nb_ligne:result.affectedRows});
    }
  })
})

router.get('/historicMAJ', (req, res) => {
  let sql = 'SELECT max(DATE_FORMAT(dateMAJ, " %d/%m/%Y")) as Date, tableMAJ FROM miseajour GROUP BY tableMAJ ORDER BY tableMAJ'

  // connection.query('SELECT COUNT(button) as Jalon FROM historic WHERE button = "Jalons"', (err, results) => {
  connection.query(sql, (err, results) => {
    if (err) {
      res.status(500).json({
        error: err.message,
        sql: err.sql,
      });
    } else {
      res.json(results);
    }
  });
});



router.get('/historic', (req, res) => {
  let sql = 'SELECT DISTINCT button'
      sql += ' FROM historic'

  // connection.query('SELECT COUNT(button) as Jalon FROM historic WHERE button = "Jalons"', (err, results) => {
  connection.query(sql, (err, results) => {
    if (err) {
      res.status(500).json({
        error: err.message,
        sql: err.sql,
      });
    } else {
      res.json(results);
    }
  });
});


 router.get('/historicS', (req, res) => {
    let sql = 'SELECT COUNT(*), button as bt'
        sql += ' FROM historic WHERE WEEK(date) = WEEK(curdate()) AND MONTH(date) = MONTH(CURDATE())'
        sql += ' AND NOT idgasi = "a" AND (button = "Diagnostic" OR button = "Jalons" OR button = "Contacts" OR button = "EFO" OR button = "Prestations")'
        sql += ' GROUP BY button'
    // connection.query('SELECT COUNT(button) as Jalon FROM historic WHERE button = "Jalons"', (err, results) => {
    connection.query(sql, (err, results) => {
      if (err) {
        res.status(500).json({
          error: err.message,
          sql: err.sql,
        });
      } else {
        res.json(results);
      }
    });
  });

  router.get('/historicH', (req, res) => {
    let sql = 'SELECT COUNT(*), button'
        sql += ' FROM historic WHERE MONTH(date) = MONTH(CURDATE())'
        sql += ' AND NOT idgasi = "a" AND (button = "Diagnostic" OR button = "Jalons" OR button = "Contacts" OR button = "EFO" OR button = "Prestations")'
        sql += ' GROUP BY button'
    // connection.query('SELECT COUNT(button) as Jalon FROM historic WHERE button = "Jalons"', (err, results) => {
    connection.query(sql, (err, results) => {
      if (err) {
        res.status(500).json({
          error: err.message,
          sql: err.sql,
        });
      } else {
        res.json(results);
      }
    });
  });


 router.get('/nbligne', (req, res) => {
    let sql = 'SELECT count(*) as efo from '
    sql += Object.keys(req.query).toString().slice(1)
    // connection.query('SELECT COUNT(button) as Jalon FROM historic WHERE button = "Jalons"', (err, results) => {
    connection.query(sql, (err, results) => {
      if (err) {
        res.status(500).json({
          error: err.message,
          sql: err.sql,
        });
      } else {
        res.json(results);
      }
    });
  });

module.exports = router;