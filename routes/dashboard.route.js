const express = require('express');
const router = express.Router();
const connection = require('../db');

router.get('/jalon', (req, res) => {
  const query = req.query;
  const int1= [0,30];
  const int2= [int1[1] + 1, 60];
  let sql = 'SELECT x.dc_lblmotifjalonpersonnalise,'    
  sql+=` MAX(CASE WHEN x.textnbjouravantjalon = "Sans Jalons" THEN x.nb ELSE 0 END) "Sans Jalons",`
  sql+=` MAX(CASE WHEN x.textnbjouravantjalon = "Jalons dépassés" THEN x.nb ELSE 0 END) "Jalons dépassés",`
  sql+=` MAX(CASE WHEN x.textnbjouravantjalon = "Entre ${int1[0]} et ${int1[1]} jours" THEN x.nb ELSE 0 END) "Entre ${int1[0]} et ${int1[1]} jours",`
  sql+=` MAX(CASE WHEN x.textnbjouravantjalon = "Entre ${int2[0]} et ${int2[1]} jours" THEN x.nb ELSE 0 END) "Entre ${int2[0]} et ${int2[1]} jours",`
  sql+=` MAX(CASE WHEN x.textnbjouravantjalon = "> ${int2[1]} jours" THEN x.nb ELSE 0 END) "> ${int2[1]} jours",`
  sql+=` SUM(x.nb) Total`
  sql+=' FROM ('

    sql += 'SELECT dc_lblmotifjalonpersonnalise,'
    sql += ' CASE'
    sql += ' WHEN nbjouravantjalon IS NULL THEN "Sans Jalons"'
    sql += ' WHEN nbjouravantjalon < 0 THEN "Jalons dépassés"'
    sql += ` WHEN nbjouravantjalon BETWEEN ${int1[0]} AND ${int1[1]} THEN "Entre ${int1[0]} et ${int1[1]} jours"`
    sql += ` WHEN nbjouravantjalon BETWEEN ${int2[0]} AND ${int2[1]} THEN "Entre ${int2[0]} et ${int2[1]} jours"`
    sql += ` WHEN nbjouravantjalon > ${int2[1]} THEN "> ${int2[1]} jours"`
    sql += ' ELSE "jalons"'
    sql += ' END AS textnbjouravantjalon,'
    sql += ' COUNT(dc_individu_local) AS nb'
    sql += ' FROM T_Portefeuille INNER JOIN APE ON T_Portefeuille.dc_structureprincipalede = APE.id_ape'
    sql += ' WHERE dc_situationde = 2'

  Object.keys(query).map((key, index) => {
    sql += ` AND ${key} = "${query[key]}"  `
  })

  sql += ' GROUP BY dc_lblmotifjalonpersonnalise, textnbjouravantjalon) x'
  sql += ' GROUP BY x.dc_lblmotifjalonpersonnalise'

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

router.get('/efo', (req, res) => {
  const query = req.query;

  let sql = 'SELECT COUNT(dc_statutaction_id) as Qte, dc_statutaction_id FROM T_EFO'
    sql += ' INNER JOIN APE ON T_EFO.dc_structureprincipalede = APE.id_ape'

  Object.keys(query).map((key, index) => {
    sql += ` WHERE ${key} = "${query[key]}"  `
  })

  sql += ' GROUP BY dc_statutaction_id'

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

router.get('/activite', (req, res) => {
  const query = req.query;

  let sql = 'SELECT COUNT(*) as NbDESansActivite FROM `t_portefeuille` WHERE nbjoursansentretien > 360 AND nbjoursanscontactsortantteloumel > 360'

  Object.keys(query).map((key, index) => {
    sql += ` AND ${key} = "${query[key]}"  `
  })

  // sql += ' GROUP BY dc_statutaction_id'

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