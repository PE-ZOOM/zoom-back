
const express = require('express');
const router = express.Router();
const connection = require('../db');
const passport = require('passport');

//list filter acti
//liste filter structure
//http://localhost:5000/activites/listestructure?
router.get('/listestructure', passport.authenticate('jwt', { session:  false }), (req,resp) =>{
    const query = req.query;
 
    let sql = 'SELECT DISTINCT dc_structureprincipalesuivi, APE.libelle_ape'
        sql+= ' FROM T_Activites INNER JOIN APE ON T_Activites.dc_structureprincipalesuivi = APE.id_ape'
        
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
    connection.query(sql, sqlValues, (err, results) => {
        if (err) {
            resp.status(500).send('Internal server error')
        } else {
            if (!results.length) {
                resp.status(404).send('datas not found')
            } else {
                // console.log(json(results))
                resp.json(results)
            }
        }
    })
})


//liste filter modalite d'acc
//http://localhost:5000/activites/listemodeacc?
router.get('/listemodeacc', passport.authenticate('jwt', { session:  false }), (req,resp) =>{
    const query = req.query;
 
    let sql = 'SELECT DISTINCT dc_modalitesuiviaccomp_id'
        sql+= ' FROM T_Activites INNER JOIN APE ON T_Activites.dc_structureprincipalesuivi = APE.id_ape'
        
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

        console.log(sql)

    connection.query(sql, sqlValues, (err, results) => {
        if (err) {
            resp.status(500).send('Internal server error')
        } else {
            if (!results.length) {
                resp.status(404).send('datas not found')
            } else {
                // console.log(json(results))
                resp.json(results)
            }
        }
    })
})


//liste filter year
//http://localhost:5000/activites/listeyear?
router.get('/listeyear', passport.authenticate('jwt', { session:  false }), (req,resp) =>{
    const query = req.query;
 
    let sql = 'SELECT DISTINCT annee'
        sql+= ' FROM T_Activites INNER JOIN APE ON T_Activites.dc_structureprincipalesuivi = APE.id_ape'
        
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
    connection.query(sql, sqlValues, (err, results) => {
        if (err) {
            resp.status(500).send('Internal server error')
        } else {
            if (!results.length) {
                resp.status(404).send('datas not found')
            } else {
                // console.log(json(results))
                resp.json(results)
            }
        }
    })
})



//contacts
//http://localhost:5000/activites/contacts?
router.get('/contacts', passport.authenticate('jwt', { session:  false }), (req,resp) =>{
    const query = req.query;
   

    let sql ="SELECT annee , mois , Sum(nb_de_affectes) AS nb_de_affectes, Sum(dem_de_trait_phys) AS GOA, Sum(dem_de_trait_tel) AS 'Tel 3949',"
    sql+= " Sum(entretien_phys) as entretien_phys, sum(entretien_tel) as entretien_tel, sum(entretien_mail) as entretien_mail, sum(entretien_dmc) as entretien_dmc, sum(mailnet_entrant) as mailnet_entrant, sum(mailnet_sortant) as mailnet_sortant, CONCAT(FORMAT(sum(contact_entrant) / sum(nb_de_affectes) * 100, 1), '%') as tx_contact_entrant, CONCAT(FORMAT(sum(contact_sortant) / Sum(nb_de_affectes) * 100, 1),'%') as tx_contact_sortant"
    sql+=" FROM T_Activites INNER JOIN APE ON T_Activites.dc_structureprincipalesuivi = APE.id_ape"
    
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
    
    connection.query(sql, sqlValues, (err, results) => {
        if (err) {
            resp.status(500).send('Internal server error')
        } else {
            if (!results.length || results===undefined) {
                // resp.status(404).send('datas not found')
                resp.json([])
            } else {
                // console.log(json(results))
                resp.json(results)
            }
        }
    })
})
//END
//contactsEntrant
//http://localhost:5000/activites/contactsEntrant?
router.get('/contactsEntrant', passport.authenticate('jwt', { session:  false }), (req,resp) =>{
    const query = req.query;
   

    let sql ="SELECT annee , mois , Sum(contacts_tel_entrant) AS Tel, Sum(contacts_mail_entrant) AS Mail, Sum(contacts_internet_entrant) AS Internet,"
    sql+= " Sum(mailnet_entrant) as MailNet, sum(contact_entrant) as contacts"
    sql+=" FROM T_Activites INNER JOIN APE ON T_Activites.dc_structureprincipalesuivi = APE.id_ape"
    
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
    
    connection.query(sql, sqlValues, (err, results) => {
        if (err) {
            resp.status(500).send('Internal server error')
        } else {
            if (!results.length || results===undefined) {
                // resp.status(404).send('datas not found')
                resp.json([])
            } else {
                // console.log(json(results))
                resp.json(results)
            }
        }
    })
})
//END
//contactsSortant
//http://localhost:5000/activites/contactsEntrant?
router.get('/contactsSortant', passport.authenticate('jwt', { session:  false }), (req,resp) =>{
    const query = req.query;

    let sql ="SELECT annee , mois , Sum(contacts_tel_sortant) AS Tel, Sum(contacts_mail_sortant) AS Mail, Sum(contacts_internet_sortant) AS Internet,"
    sql+= " Sum(mailnet_sortant) as MailNet, sum(contact_sortant) as contacts"
    sql+=" FROM T_Activites INNER JOIN APE ON T_Activites.dc_structureprincipalesuivi = APE.id_ape"
    
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
    
    connection.query(sql, sqlValues, (err, results) => {
        if (err) {
            resp.status(500).send('Internal server error')
        } else {
            if (!results.length || results===undefined) {
                // resp.status(404).send('datas not found')
                resp.json([])
            } else {
                // console.log(json(results))
                resp.json(results)
            }
        }
    })
})
//END



//presta
//http://localhost:5000/activites/presta?
router.get('/presta', passport.authenticate('jwt', { session:  false }), (req,resp) =>{
    const query = req.query;
  

    
    let sql ="SELECT annee , mois , Sum(nb_de_affectes) AS nb_de_affectes, Sum(presta_rca) AS ACTIV_Créa, Sum(presta_aem) AS ACTIV_Emploi," 
    sql += " Sum(presta_acp) AS ACTIV_Projet, Sum(presta_rgc) AS Regards_croisés, Sum(presta_vsi) AS Valoriser_son_image_pro,"
    sql += " Sum(presta_z08+presta_z10+presta_z16) AS Vers1métier, Sum(presta) AS Presta, CONCAT(FORMAT(sum(presta) / Sum(nb_de_affectes) * 100, 1),'%') as tx_prestation"
    sql+=" FROM T_Activites INNER JOIN APE ON T_Activites.dc_structureprincipalesuivi = APE.id_ape"
    
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

    console.log(sql)
    
    connection.query(sql, sqlValues, (err, results) => {
        if (err) {
            resp.status(500).send('Internal server error')
        } else {
            if (!results.length || results===undefined) {
                // resp.status(404).send('datas not found')
                resp.json([])
            } else {
                // console.log(json(results))
                resp.json(results)
            }
        }
    })
})
//END


module.exports = router;