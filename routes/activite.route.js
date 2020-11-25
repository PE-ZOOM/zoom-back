
const express = require('express');
const router = express.Router();
// const connection = require('../db');
const passport = require('passport');

const connection_pool = require('../db2');

//list filter acti
//liste filter structure
//http://localhost:5000/activites/listestructure?
router.get('/listestructure', passport.authenticate('jwt', { session:  false }), (req,resp) =>{
    const query = req.query;
 
    // let sql = 'SELECT DISTINCT dc_structureprincipalesuivi, APE.libelle_ape'
    let sql = 'SELECT DISTINCT dc_structureprincipalesuivi, libelle_ape'
        // sql+= ' FROM T_Activites INNER JOIN APE ON T_Activites.dc_structureprincipalesuivi = APE.id_ape'
        sql+= ' FROM T_Activites'
        
        let sqlValues = [];

        Object.keys(query).map((key, index) => {
            if (index === 0) {
                sql += ` WHERE ${key} = ?`
            }
            else {
                sql += ` AND ${key} = ?`
    
            } 
            sqlValues.push(query[key]) 
        })
    sql+= " ORDER BY libelle_ape"

    connection_pool.getConnection(function(error, conn) {
      if (error) throw err; // not connected!

      conn.query(sql, sqlValues, (err, result) => {
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


//liste filter modalite d'acc
//http://localhost:5000/activites/listemodeacc?
router.get('/listemodeacc', passport.authenticate('jwt', { session:  false }), (req,resp) =>{
    const query = req.query;
 
    let sql = 'SELECT DISTINCT dc_modalitesuiviaccomp_id'
        // sql+= ' FROM T_Activites INNER JOIN APE ON T_Activites.dc_structureprincipalesuivi = APE.id_ape'
        sql+= ' FROM T_Activites'
        
        let sqlValues = [];

        Object.keys(query).map((key, index) => {
            if (index === 0) {
                sql += ` WHERE ${key} = ?`
            }
            else {
                sql += ` AND ${key} = ?`
    
            } 
            sqlValues.push(query[key]) 
        })


    connection_pool.getConnection(function(error, conn) {
      if (error) throw err; // not connected!

      conn.query(sql, sqlValues, (err, result) => {
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


//liste filter year
//http://localhost:5000/activites/listeyear?
router.get('/listeyear', passport.authenticate('jwt', { session:  false }), (req,resp) =>{
    const query = req.query;
 
    let sql = 'SELECT DISTINCT annee'
        // sql+= ' FROM T_Activites INNER JOIN APE ON T_Activites.dc_structureprincipalesuivi = APE.id_ape'
        sql+= ' FROM T_Activites'
        
        let sqlValues = [];

        Object.keys(query).map((key, index) => {
            if (index === 0) {
                sql += ` WHERE ${key} = ?`
            }
            else {
                sql += ` AND ${key} = ?`
    
            } 
            sqlValues.push(query[key]) 
        })
    connection_pool.getConnection(function(error, conn) {
      if (error) throw err; // not connected!

      conn.query(sql, sqlValues, (err, result) => {
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


//liste filter ref
//http://localhost:5000/activites/listeref?
router.get('/listeref', passport.authenticate('jwt', { session:  false }), (req,resp) =>{
  const query = req.query;

  
  let sql = 'SELECT DISTINCT a.nom_complet FROM T_Activites a INNER JOIN'
      sql+= ' (SELECT MAX(annee) as maxannee, MAX(mois) as maxmois FROM T_Activites) as x on '
      sql+= ' x.maxannee=a.annee and x.maxmois=a.mois '
      sql+= ' WHERE a.nb_de_affectes>20 '
      
      let sqlValues = [];

      Object.keys(query).map((key, index) => {
          
              sql += ` AND a.${key} = ?`
  
          sqlValues.push(query[key]) 
      })
      sql+= " ORDER BY SUBSTRING(a.nom_complet, 10)"
     

  connection_pool.getConnection(function(error, conn) {
    if (error) throw err; // not connected!

    conn.query(sql, sqlValues, (err, result) => {
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



//contacts
//http://localhost:5000/activites/contacts?
router.get('/contacts', passport.authenticate('jwt', { session:  false }), (req,resp) =>{
    const query = req.query;
   

    let sql ="SELECT annee , mois , Sum(nb_de_affectes) AS nb_de_affectes, Sum(dem_de_trait_phys) AS GOA, Sum(dem_de_trait_tel) AS 'Tel 3949',"
    sql+= " Sum(entretien_phys) as entretien_phys, sum(entretien_tel) as entretien_tel, sum(entretien_mail) as entretien_mail, sum(entretien_dmc) as entretien_dmc, sum(mailnet_entrant) as mailnet_entrant, sum(mailnet_sortant) as mailnet_sortant, CONCAT(FORMAT(sum(contact_entrant) / sum(nb_de_affectes) * 100, 1), '%') as tx_contact_entrant, CONCAT(FORMAT(sum(contact_sortant) / Sum(nb_de_affectes) * 100, 1),'%') as tx_contact_sortant"
    // sql+=" FROM T_Activites INNER JOIN APE ON T_Activites.dc_structureprincipalesuivi = APE.id_ape"
    sql+=" FROM T_Activites"
    
    let sqlValues = [];
    
    Object.keys(query).filter((key) => query[key]!=='all').map((key, index) => {
        
                if (index === 0) {
                    sql += ` WHERE ${key} = ?`
                }
                else {
                    sql += ` AND ${key} = ?`
        
                } 
            
            sqlValues.push(query[key])
        })
    
    sql+= " GROUP BY annee, mois order by annee, mois desc"
    
    connection_pool.getConnection(function(error, conn) {
      if (error) throw err; // not connected!

      conn.query(sql, sqlValues, (err, result) => {
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
//END
// //contactsEntrant
// //http://localhost:5000/activites/contactsEntrant?
// router.get('/contactsEntrant', passport.authenticate('jwt', { session:  false }), (req,resp) =>{
//     const query = req.query;
   

//     let sql ="SELECT annee , mois , Sum(contacts_tel_entrant) AS Tel, Sum(contacts_mail_entrant) AS Mail, Sum(contacts_internet_entrant) AS Internet,"
//     sql+= " Sum(mailnet_entrant) as MailNet, sum(contact_entrant) as contacts"
//     // sql+=" FROM T_Activites INNER JOIN APE ON T_Activites.dc_structureprincipalesuivi = APE.id_ape"
//     sql+=" FROM T_Activites"
    
//     let sqlValues = [];
    
//     Object.keys(query).filter((key) => query[key]!=='all').map((key, index) => {
        
//                 if (index === 0) {
//                     sql += ` WHERE ${key} = ?`
//                 }
//                 else {
//                     sql += ` AND ${key} = ?`
        
//                 } 
            
//             sqlValues.push(query[key])
//         })
    
//     sql+= " GROUP BY annee, mois order by annee, mois desc"
    
//     connection_pool.getConnection(function(error, conn) {
//       if (error) throw err; // not connected!

//       conn.query(sql, sqlValues, (err, result) => {
//       // When done with the connection, release it.
//         conn.release();

//         // Handle error after the release.
//         if (err){
//           console.log(err.sqlMessage)
//           return  resp.status(500).json({
//                   err: "true", 
//                   error: err.message,
//                   errno: err.errno,
//                   sql: err.sql,
//                   });
//         }else{
//           resp.status(201).json(result)
//         }

//       // Don't use the connection here, it has been returned to the pool.
//       });   
//     });
// })
// //END
// //contactsSortant
// //http://localhost:5000/activites/contactsEntrant?
// router.get('/contactsSortant', passport.authenticate('jwt', { session:  false }), (req,resp) =>{
//     const query = req.query;

//     let sql ="SELECT annee , mois , Sum(contacts_tel_sortant) AS Tel, Sum(contacts_mail_sortant) AS Mail, Sum(contacts_internet_sortant) AS Internet,"
//     sql+= " Sum(mailnet_sortant) as MailNet, sum(contact_sortant) as contacts"
//     // sql+=" FROM T_Activites INNER JOIN APE ON T_Activites.dc_structureprincipalesuivi = APE.id_ape"
//     sql+=" FROM T_Activites"
    
//     let sqlValues = [];
    
//     Object.keys(query).filter((key) => query[key]!=='all').map((key, index) => {
                
//                 if (index === 0) {
//                     sql += ` WHERE ${key} = ?`
//                 }
//                 else {
//                     sql += ` AND ${key} = ?`
        
//                 } 
            
//             sqlValues.push(query[key])
//         })
    
//     sql+= " GROUP BY annee, mois order by annee, mois desc"
    
//     connection_pool.getConnection(function(error, conn) {
//       if (error) throw err; // not connected!

//       conn.query(sql, sqlValues, (err, result) => {
//       // When done with the connection, release it.
//         conn.release();

//         // Handle error after the release.
//         if (err){
//           console.log(err.sqlMessage)
//           return  resp.status(500).json({
//                   err: "true", 
//                   error: err.message,
//                   errno: err.errno,
//                   sql: err.sql,
//                   });
//         }else{
//           resp.status(201).json(result)
//         }

//       // Don't use the connection here, it has been returned to the pool.
//       });   
//     });
// })
// //END



//presta
//http://localhost:5000/activites/presta?
router.get('/presta', passport.authenticate('jwt', { session:  false }), (req,resp) =>{
    const query = req.query;
  

    
    let sql ="SELECT annee , mois , Sum(nb_de_affectes) AS nb_de_affectes, Sum(presta_rca) AS ACTIV_Créa, Sum(presta_aem) AS ACTIV_Emploi," 
    sql += " Sum(presta_ap2) AS AP2, Sum(presta_rgc) AS Regards_croisés, Sum(presta_vsi) AS Valoriser_son_image_pro,"
    sql += " Sum(presta_z08+presta_z10+presta_z16) AS Vers1métier, Sum(presta_acl) AS ACL, Sum(presta_emd) AS EMD, Sum(presta) AS Presta, CONCAT(FORMAT(sum(presta) / Sum(nb_de_affectes) * 100, 1),'%') as tx_prestation"
    // sql+=" FROM T_Activites INNER JOIN APE ON T_Activites.dc_structureprincipalesuivi = APE.id_ape"
    sql+=" FROM T_Activites"
    
    let sqlValues = [];
    
    Object.keys(query).filter((key) => query[key]!=='all').map((key, index) => {
        
                if (index === 0) {
                    sql += ` WHERE ${key} = ?`
                }
                else {
                    sql += ` AND ${key} = ?`
        
                } 
            
            sqlValues.push(query[key])
        })
    
    sql+= " GROUP BY annee, mois order by annee desc, mois desc"
    
    connection_pool.getConnection(function(error, conn) {
      if (error) throw err; // not connected!

      conn.query(sql, sqlValues, (err, result) => {
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
//END

//dpae mec
//http://localhost:5000/activites/dpae?
router.get('/dpae', passport.authenticate('jwt', { session:  false }), (req,resp) =>{
  const query = req.query;

  let sql ="SELECT annee , mois , Sum(nb_de_affectes) AS nb_de_affectes, Sum(dpae) AS Nb_DE_avec_DPAE," 
  sql += "  CONCAT(FORMAT(sum(dpae) / Sum(nb_de_affectes) * 100, 1),'%') as tx_DE_avec_DPAE,"
  sql += "  Sum(mec) AS MEC, Sum(de_mec) AS Nb_DE_avec_MEC, CONCAT(FORMAT(sum(mec) / Sum(nb_de_affectes) * 100, 1),'%') as tx_DE_avec_MEC,"
  sql += "  Sum(mer) AS MER, Sum(de_mer) AS Nb_DE_avec_MER, CONCAT(FORMAT(sum(mer) / Sum(nb_de_affectes) * 100, 1),'%') as tx_DE_avec_MER,"
  sql += "  Sum(merplus) AS 'MER+', Sum(de_merplus) AS 'Nb_DE_avec_MER+', CONCAT(FORMAT(sum(merplus) / Sum(nb_de_affectes) * 100, 1),'%') as 'tx_DE_avec_MER+'"

  // sql+=" FROM T_Activites INNER JOIN APE ON T_Activites.dc_structureprincipalesuivi = APE.id_ape"
  sql+=" FROM T_Activites"
  
  let sqlValues = [];
  
  Object.keys(query).filter((key) => query[key]!=='all').map((key, index) => {
      
              if (index === 0) {
                  sql += ` WHERE ${key} = ?`
              }
              else {
                  sql += ` AND ${key} = ?`
      
              } 
          
          sqlValues.push(query[key])
      })
  
  sql+= " GROUP BY annee, mois order by annee desc, mois desc"
  
  connection_pool.getConnection(function(error, conn) {
    if (error) throw err; // not connected!

    conn.query(sql, sqlValues, (err, result) => {
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
//END

//taux
//http://localhost:5000/activites/taux?
router.get('/taux', passport.authenticate('jwt', { session:  false }), (req,resp) =>{
  const query = req.query;


  
  let sql = "SELECT annee, mois, CONCAT(FORMAT(sum(presta) / Sum(nb_de_affectes) * 100, 1),'%') as tx_DE_avec_prestation, "
  sql += "CONCAT(FORMAT(sum(dpae) / Sum(nb_de_affectes) * 100, 1),'%') as tx_DE_avec_DPAE, "
  sql += "CONCAT(FORMAT(sum(formation) / Sum(nb_de_affectes) * 100, 1),'%') as tx_DE_avec_formation, "
      sql += "CONCAT(FORMAT(sum(contact_entrant) / sum(nb_de_affectes) * 100, 1), '%') as tx_DE_avec_contact_entrant, "
      sql += "CONCAT(FORMAT(sum(contact_sortant) / Sum(nb_de_affectes) * 100, 1),'%') as tx_DE_avec_contact_sortant, "
      sql += "CONCAT(FORMAT(sum(mec) / Sum(nb_de_affectes) * 100, 1),'%') as tx_DE_avec_MEC,"
      sql += "CONCAT(FORMAT(sum(mer) / Sum(nb_de_affectes) * 100, 1),'%') as tx_DE_avec_MER,"
      sql += "CONCAT(FORMAT(sum(merplus) / Sum(nb_de_affectes) * 100, 1),'%') as 'tx_DE_avec_MER+'"
      // sql+=" FROM T_Activites INNER JOIN APE ON T_Activites.dc_structureprincipalesuivi = APE.id_ape"
  sql+=" FROM T_Activites"
  
  let sqlValues = [];
  
  Object.keys(query).filter((key) => query[key]!=='all').map((key, index) => {
      
              if (index === 0) {
                  sql += ` WHERE ${key} = ?`
              }
              else {
                  sql += ` AND ${key} = ?`
      
              } 
          
          sqlValues.push(query[key])
      })
  
  sql+= " GROUP BY annee, mois order by annee desc, mois desc"
  
  connection_pool.getConnection(function(error, conn) {
    if (error) throw err; // not connected!

    conn.query(sql, sqlValues, (err, result) => {
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
//END



module.exports = router;