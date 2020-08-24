
// We always need to require express in every route file
const express = require('express');
// We create the express router 
const router = express.Router();
// We require the database connection configuration
const connection = require('../db');
const passport = require('passport');

 router.post('/t_efo', passport.authenticate('jwt', { session:  false }), (req,resp) =>{
    const req_arr = Object.values(req.body).map((v) => Object.values(v));
    // connection.query('TRUNCATE TABLE `T_EFO`')

    connection.query("INSERT INTO `T_EFO` (`dc_individu_local`, `dc_structureprincipalede`, `dc_dernieragentreferent`, `dc_civilite`, `dc_nom`, `dc_prenom`, `dc_categorie`, `dc_situationde`, `dc_parcours`, `dc_telephone`, `dc_adresseemail`, `dc_listeromemetierrech`, `dc_listeromeprojetmetier`, `dc_listeromecreatreprise`, `dc_statutaction_id`, `dc_formacode_id`, `dc_lblformacode`, `dd_datepreconisation`) VALUES ?", [req_arr], (err, result) => {
      if (err) {
        return resp.status(500).json({
          err: "true", 
          error: err.message,
          sql: err.sql,
          arr: req_arr,
        });
      }
      else {
        return resp
        .status(201)
        .json({err: "false", error: "ok", arr: req_arr,});
      }
    
    })
  })

 router.post('/t_portefeuille', passport.authenticate('jwt', { session:  false }), (req,resp) =>{
    const req_arr = Object.values(req.body).map((v) => Object.values(v));
    connection.query('TRUNCATE TABLE `ape`')
    // console.log('req_arr : ' + req_arr)
    // connection.query("INSERT INTO t_portefeuille (`dc_individu_local`, `dc_civilite`, `dc_nom`, `dc_prenom`, `dc_categorie`, `dc_situationde`, `dc_structureprincipalede`, `dc_dernieragentreferent`, `dc_parcours`, `dc_telephone`, `dc_adresseemail`, `dc_listeromemetierrech`, `dc_listeromeprojetmetier`, `dc_listeromecreatreprise`, `dc_niveauformationmax`, `dc_listelblmoyenlocomotion`, `dc_listepermis`, `datejalonintermediaire`, `dc_lblmotifjalonpersonnalise`, `nbjouravantjalon`, `nbjoursansentretien`, `nbjoursanscontactsortantteloumel`, `nbjourparcours`, `nbjoursansformation`, `type_presta`, `nbjoursanspresta`, `nbjourinscrip`, `nbjouraffectation`, `nbjourdepuisdpae`, `colonne109`, `colonne113`, `colonne117`, `colonne122`, `colonne127`, `colonne136`, `colonne140`, `colonne40`, `colonne41`, `colonne42`, `colonne43`, `colonne44`, `colonne45`, `colonne46`, `colonne47`, `colonne48`, `colonne49`, `colonne50`, `colonne51`, `colonne64`, `colonne65`, `colonne66`, `colonne80`, `colonne82`, `colonne83`, `colonne84`, `colonne85`, `colonne86`, `colonne95`, `colonne96`, `colonne97`, `colonne98`, `colonne99`, `colonne143`, `colonne144`, `colonne145`, `colonne146`, `colonne147`, `colonne160`, `colonne163`) VALUES ?", [req_arr], (err, result) => {
    connection.query("INSERT INTO ape (`id_ape`, `libelle_ape`, `dt`) VALUES ?", [req_arr], (err, result) => {
     if (err) {
        return resp.status(500).json({
          err: "true", 
          error: err.message,
          sql: err.sql,
          arr: req_arr,
        });
      }
      else {
        return resp
        .status(201)
        .json({err: "false", error: "ok", arr: req_arr,});
      }
    
    })
  })

 router.post('/t_activite', passport.authenticate('jwt', { session:  false }), (req,resp) =>{
    const req_arr = Object.values(req.body).map((v) => Object.values(v));
    console.log('req_arr : ' + req)
    // connection.query("INSERT INTO T_EFO (id_efo, dc_individu_local , dc_structureprincipalede, dc_dernieragentreferent, dc_civilite, dc_nom, dc_prenom, dc_categorie, dc_situationde, dc_parcours, dc_telephone, dc_adresseemail, dc_listeromemetierrech, dc_listeromeprojetmetier, dc_listeromecreatreprise, dc_statutaction_id, dc_formacode_id, dc_lblformacode, dd_datepreconisation) VALUES ?", [req_arr], (err, result) => {
    // connection.query("INSERT INTO test (id, level , cvss, title, vulnerability, solution, reference) VALUES ?", [req_arr], (err, result) => {
    //   if (err) {
    //     return resp.status(500).json({
    //       error: err.message,
    //       sql: err.sql,
    //     });
    //   }
    //   else {
    //     return resp
    //     .status(201)
    //     .json(req_arr.length);
    //   }
    
    // })
    return resp.status(201).json(req_arr.length)
    // return req
  })


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

module.exports = router;