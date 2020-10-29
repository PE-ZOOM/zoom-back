const express = require('express');
const router = express.Router();
// const connection = require('../../db');
const connection_pool = require('../../db2');
const bcrypt=require('bcryptjs');
const passport = require('passport');
const jwt = require('jsonwebtoken');

//signup new user
router.post('/signup', function(req, res, next) {
        
  const hash = bcrypt.hashSync(req.body.password, 10);
  const { idgasi, name, fonction_id, team_id, p_user, ape_id  } = req.body;
  const userValue= [idgasi, name, fonction_id, team_id, p_user, ape_id, hash ]
  
  connection_pool.getConnection(function(error, conn) {
      if (error) throw err; // not connected!

      let sql = 'INSERT INTO User (idgasi, name, fonction_id, team_id, p_user, ape_id, password) VALUES (?, ?, ?, ?, ?, ?, ?)'
      conn.query(sql, [userValue], (err, result) => {
      // When done with the connection, release it.
        conn.release();

        // Handle error after the release.
        if (err){
          console.log(err)
          return  resp.status(500).json({
                    flash: err.message,
                    sql: err.sql,
                  });
        }else{
          resp.status(201).json({ flash:  `User has been signed up !` })
        }

      // Don't use the connection here, it has been returned to the pool.
      });   
    });

        // connection.query('INSERT INTO User (idgasi, name, fonction_id, team_id, p_user, ape_id, password) VALUES (?, ?, ?, ?, ?, ?, ?)', userValue, (err, results) => {
        //     if (err) {
        //         return res.status(500).json({
        //           flash: err.message,
        //           sql: err.sql,
        //         });
        //       }
        //         return res
        //           .status(201)
        //           .json({ flash:  `User has been signed up !` });
        //       });
  });

  //login
      router.post('/signin', function(req, res, next) {
        passport.authenticate('local',(err, user, info) => { 
          if (err) {
            return res.status(500).json({
              flash: err.message,
              sql: err.sql,
            });
          }
          if (!user) return res.status(400).json({flash: info.message});  
         req.user = user
          const token = jwt.sign(JSON.stringify(user), 'coucou');  
          return res.json({user, token, flash:  `User sign in!` }); 
      })(req, res);
    })

//profile
       router.get('/profile', passport.authenticate('jwt', { session:  false }),function (req, res) {
      res.send(req.user);
      })

//update user 

router.put('/update/:idgasi', passport.authenticate('jwt', { session:  false }),  (req, res) => {
  const idgasi = req.params.idgasi;


  connection_pool.getConnection(function(error, conn) {
    if (error) throw err; // not connected!

    let sql = 'UPDATE User SET fonction_id = ? , team_id = ? , p_user = ? , ape_id = ? WHERE idgasi = ?'
    conn.query(sql, [req.body.fonction_id , req.body.team_id , req.body.p_user , req.body.ape_id , idgasi], (err, result) => {
    // When done with the connection, release it.
      

      // Handle error after the release.
      if (err){
        console.log(err)
        return  resp.status(500).json({
          error: err.message,
          sql: err.sql,
                });
      }
      sql = 'SELECT * FROM User WHERE idgasi = ?'
      conn.query(sql, idgasi, (err2, records) => {

        conn.release();

      // return connection.query('SELECT * FROM User WHERE idgasi = ?', idgasi, (err2, records) => {
        if (err2) {
          return res.status(500).json({
            error: err2.message,
            sql: err2.sql,
          });
        }
        const updatedUser = records[0];
        return res
          .status(200)
          .json({updatedUser, flash:  `User updated!`});
      });

    // Don't use the connection here, it has been returned to the pool.
    });   
  });
}
);
      

module.exports = router;