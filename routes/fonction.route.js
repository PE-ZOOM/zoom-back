
const express = require('express');
const router = express.Router();
const connection = require('../db');

// GET - Retrieve all of the data from table fonction exept "admin"
router.get('/', (req, res) => {
    connection.query('SELECT * FROM Fonction where id_fonction <> 6', (err, results) => {
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