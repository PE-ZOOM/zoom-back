const express = require('express');
const router = express.Router();
// const connection = require('../db');
const connection_pool = require('../db2');
const passport = require('passport');
const excel = require('exceljs');
const xls = require('../modules/xls')
const namecol = require('../modules/namefield')

//select excel contacts ref
//http://localhost:5000/activitexlsx/contacts/ref?
router.use('/contacts/ref', passport.authenticate('jwt', { session:  false }), (req,resp) => {
    const query = req.query;

    let sql ="SELECT annee , mois , nom_complet,  Sum(nb_de_affectes) AS nb_de_affectes, Sum(dem_de_trait_phys) AS GOA, Sum(dem_de_trait_tel) AS 'Tel 3949',"
    sql+= " Sum(entretien_phys) as entretien_phys, sum(entretien_tel) as entretien_tel, sum(entretien_mail) as entretien_mail, sum(entretien_dmc) as entretien_dmc, sum(mailnet_entrant) as mailnet_entrant, sum(mailnet_sortant) as mailnet_sortant,sum(contact_entrant) / sum(nb_de_affectes) as tx_contact_entrant, sum(contact_sortant) / Sum(nb_de_affectes) as tx_contact_sortant"
    // sql+=" FROM T_Activites INNER JOIN APE ON T_Activites.dc_structureprincipalesuivi = APE.id_ape"
    sql+=" FROM T_Activites"
    
    let sqlValues = [];
    let tab_filter = [];
    let filter1by1 = '';
    let libenclair = '';
    

    Object.keys(query).filter((key) => query[key]!=='all').map((key, index) => {
        
            if (index === 0) {
                sql += ` WHERE ${key} = ?`
            }
            else {
                sql += ` AND ${key} = ?`
    
            }
            sqlValues.push(query[key])
            libenclair=namecol.namefield(key)
            filter1by1=`${libenclair}=${query[key]}`
            tab_filter.push(filter1by1);
        })
    
    sql+= " GROUP BY annee, mois, nom_complet order by annee, mois, nom_complet desc"
    

    connection_pool.getConnection(function(error, conn) {
      if (error) throw err; // not connected!

        conn.query(sql, sqlValues, (err, results) => {

                conn.release();

                if (err) {
                    resp.status(500).send('Internal server error')
                } else {
                    if (!results.length) {
                        resp.status(404).send('datas not found')
                    } else {
                        const jsonResult = JSON.parse(JSON.stringify(results));

                        resp.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                        resp.setHeader('Content-Disposition', 'attachment; filename=' + 'ContactRef.xlsx');  

                        let header = [
                            { header: 'Année', key: 'annee'},
                            { header: 'Mois', key: 'mois'},
                            { header: 'Référent', key: 'nom_complet'},
                            { header: 'Nb DE affectes', key: 'nb_de_affectes'},
                            { header: 'GOA', key: 'GOA'},
                            { header: '3949', key: 'Tel 3949'},
                            { header: 'entretien phys', key: 'entretien_phys'},
                            { header: 'entretien tel', key: 'entretien_tel'},
                            { header: 'entretien mail', key: 'entretien_mail'},
                            { header: 'entretien dmc', key: 'entretien_dmc'},
                            { header: 'mailnet entrant', key: 'mailnet_entrant'},
                            { header: 'mailnet sortant', key: 'mailnet_sortant'},
                            { header: 'Tx DE avec contact entrant', key: 'tx_contact_entrant'},
                            { header: 'Tx DE avec contact sortant', key: 'tx_contact_sortant'}
                            
                        ];
                        
                        return xls.CreateXls('REF', header, jsonResult, tab_filter).xlsx.write(resp)
                        .then(function() {
                                resp.status(200).end();
                        });

                    }
                }
            })
        });
})
                

//END

//select excel contacts ape
//http://localhost:5000/activitexlsx/contacts/ape?
router.use('/contacts/ape', passport.authenticate('jwt', { session:  false }), (req,resp) => {

    const query = req.query;

    let sql ="SELECT annee , mois , dc_structureprincipalesuivi, Sum(nb_de_affectes) AS nb_de_affectes, Sum(dem_de_trait_phys) AS GOA, Sum(dem_de_trait_tel) AS 'Tel 3949',"
    sql+= " Sum(entretien_phys) as entretien_phys, sum(entretien_tel) as entretien_tel, sum(entretien_mail) as entretien_mail, sum(entretien_dmc) as entretien_dmc, sum(mailnet_entrant) as mailnet_entrant, sum(mailnet_sortant) as mailnet_sortant,sum(contact_entrant) / sum(nb_de_affectes) as tx_contact_entrant, sum(contact_sortant) / Sum(nb_de_affectes) as tx_contact_sortant"
    // sql+=" FROM T_Activites INNER JOIN APE ON T_Activites.dc_structureprincipalesuivi = APE.id_ape"
    sql+=" FROM T_Activites"
    
    let sqlValues = [];
    let tab_filter = [];
    let filter1by1 = '';
    let libenclair = '';
    
    Object.keys(query).filter((key) => query[key]!=='all').map((key, index) => {
        
            if (index === 0) {
                sql += ` WHERE ${key} = ?`
            }
            else {
                sql += ` AND ${key} = ?`
    
            } 
            sqlValues.push(query[key])
            libenclair=namecol.namefield(key)
            filter1by1=`${libenclair}=${query[key]}`
            tab_filter.push(filter1by1);
        })
    
    sql+= " GROUP BY annee, mois, dc_structureprincipalesuivi order by annee, mois, dc_structureprincipalesuivi desc"
    

    connection_pool.getConnection(function(error, conn) {
        if (error) throw err; // not connected!

        conn.query(sql, sqlValues, (err, results) => {

                conn.release();

                if (err) {
                    resp.status(500).send('Internal server error')
                } else {
                    if (!results.length) {
                        resp.status(404).send('datas not found')
                    } else {
                        const jsonResult = JSON.parse(JSON.stringify(results));

                        resp.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                        resp.setHeader('Content-Disposition', 'attachment; filename=' + 'ContactApe.xlsx');  

                        let header = [
                            { header: 'Année', key: 'annee'},
                            { header: 'Mois', key: 'mois' },
                            { header: 'APE', key: 'dc_structureprincipalesuivi'},
                            { header: 'Nb DE affectes', key: 'nb_de_affectes'},
                            { header: 'GOA', key: 'GOA'},
                            { header: '3949', key: 'Tel 3949'},
                            { header: 'entretien phys', key: 'entretien_phys'},
                            { header: 'entretien tel', key: 'entretien_tel'},
                            { header: 'entretien mail', key: 'entretien_mail'},
                            { header: 'entretien dmc', key: 'entretien_dmc'},
                            { header: 'mailnet entrant', key: 'mailnet_entrant'},
                            { header: 'mailnet sortant', key: 'mailnet_sortant'},
                            { header: 'Tx DE avec contact entrant', key: 'tx_contact_entrant'},
                            { header: 'Tx DE avec contact sortant', key: 'tx_contact_sortant'}
                            
                        ];
                        
                        return xls.CreateXls('APE', header, jsonResult, tab_filter).xlsx.write(resp)
                        .then(function() {
                                resp.status(200).end();
                        });
               
                    }
                }
            })
    });
})
                

//END

//select excel presta ref
//http://localhost:5000/activitexlsx/presta/ref?
router.use('/presta/ref', passport.authenticate('jwt', { session:  false }), (req,resp) => {

    const query = req.query;

    let sql ="SELECT annee , mois , nom_complet, "
    sql+= " Sum(nb_de_affectes) AS nb_de_affectes, Sum(presta_rca) AS ACTIV_Créa, Sum(presta_aem) AS ACTIV_Emploi," 
    sql += " Sum(presta_ap2) AS AP2, Sum(presta_rgc) AS Regards_croisés, Sum(presta_vsi) AS Valoriser_son_image_pro,"
    sql += " Sum(presta_z08+presta_z10+presta_z16) AS Vers1métier, Sum(presta_acl) AS ACL, Sum(presta_emd) AS EMD, Sum(presta) AS Presta, sum(presta) / Sum(nb_de_affectes) as tx_prestation"
    // sql+=" FROM T_Activites INNER JOIN APE ON T_Activites.dc_structureprincipalesuivi = APE.id_ape"
    sql+=" FROM T_Activites"
    
    let sqlValues = [];
    let tab_filter = [];
    let filter1by1 = '';
    let libenclair = '';
    
    Object.keys(query).filter((key) => query[key]!=='all').map((key, index) => {
        
            if (index === 0) {
                sql += ` WHERE ${key} = ?`
            }
            else {
                sql += ` AND ${key} = ?`
    
            } 
            sqlValues.push(query[key])
            libenclair=namecol.namefield(key)
            filter1by1=`${libenclair}=${query[key]}`
            tab_filter.push(filter1by1);
        
        })
    
    sql+= " GROUP BY annee, mois, nom_complet order by annee, mois, nom_complet desc"
    
    connection_pool.getConnection(function(error, conn) {
        if (error) throw err; // not connected!


        conn.query(sql, sqlValues, (err, results) => {

                    conn.release();

                    if (err) {
                        resp.status(500).send('Internal server error')
                    } else {
                        if (!results.length) {
                            resp.status(404).send('datas not found')
                        } else {
                            const jsonResult = JSON.parse(JSON.stringify(results));

                            resp.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                            resp.setHeader('Content-Disposition', 'attachment; filename=' + 'PrestaRef.xlsx');  

                            let header = [
                                { header: 'Année', key: 'annee'},
                                { header: 'Mois', key: 'mois'},
                                { header: 'Référent', key: 'nom_complet'},
                                { header: 'Nb DE affectes', key: 'nb_de_affectes'},
                                { header: 'ACTIV_Créa', key: 'ACTIV_Créa'},
                                { header: 'ACTIV_Emploi', key: 'ACTIV_Emploi'},
                                { header: 'AP2', key: 'AP2'},
                                { header: 'Regards_croisés', key: 'Regards_croisés'},
                                { header: 'Valoriser_son_image_pro', key: 'Valoriser_son_image_pro'},
                                { header: 'Vers1métier', key: 'Vers1métier'},
                                { header: 'ACL', key: 'ACL'},
                                { header: 'EMD', key: 'EMD'},
                                { header: 'Nombre DE avec presta', key: 'Presta'},
                                { header: 'Tx DE avec presta', key: 'tx_prestation'}                
                            ];
                            
                            return xls.CreateXls('REF', header, jsonResult, tab_filter).xlsx.write(resp)
                            .then(function() {
                                    resp.status(200).end();
                            });
                
                        }
                    }
            })
    });
})
                

//END

//select excel presta ape
//http://localhost:5000/activitexlsx/presta/ape?
router.use('/presta/ape', passport.authenticate('jwt', { session:  false }), (req,resp) => {

    const query = req.query;

    let sql ="SELECT annee , mois , dc_structureprincipalesuivi, "
    sql+= " Sum(nb_de_affectes) AS nb_de_affectes, Sum(presta_rca) AS ACTIV_Créa, Sum(presta_aem) AS ACTIV_Emploi," 
    sql += " Sum(presta_ap2) AS AP2, Sum(presta_rgc) AS Regards_croisés, Sum(presta_vsi) AS Valoriser_son_image_pro,"
    sql += " Sum(presta_z08+presta_z10+presta_z16) AS Vers1métier, Sum(presta_acl) AS ACL, Sum(presta_emd) AS EMD, Sum(presta) AS Presta, sum(presta) / Sum(nb_de_affectes) as tx_prestation"
    // sql+=" FROM T_Activites INNER JOIN APE ON T_Activites.dc_structureprincipalesuivi = APE.id_ape"
    sql+=" FROM T_Activites"

    let sqlValues = [];
    let tab_filter = [];
    let filter1by1 = '';
    let libenclair = '';
    
    Object.keys(query).filter((key) => query[key]!=='all').map((key, index) => {
        
                if (index === 0) {
                    sql += ` WHERE ${key} = ?`
                }
                else {
                    sql += ` AND ${key} = ?`
        
                } 
            sqlValues.push(query[key])
            libenclair=namecol.namefield(key)
            filter1by1=`${libenclair}=${query[key]}`
            tab_filter.push(filter1by1);
       
        })
    
    sql+= " GROUP BY annee, mois, dc_structureprincipalesuivi order by annee, mois, dc_structureprincipalesuivi desc"
    
console.log(sql)
console.log(sqlValues)

    connection_pool.getConnection(function(error, conn) {
        if (error) throw err; // not connected!


            conn.query(sql, sqlValues, (err, results) => {

                conn.release()

                if (err) {
                    resp.status(500).send('Internal server error')
                } else {
                    if (!results.length) {
                        resp.status(404).send('datas not found')
                    } else {
                            const jsonResult = JSON.parse(JSON.stringify(results));

                            resp.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                            resp.setHeader('Content-Disposition', 'attachment; filename=' + 'PrestaApe.xlsx');  

                            let header = [
                                { header: 'Année', key: 'annee'},
                                { header: 'Mois', key: 'mois' },
                                { header: 'APE', key: 'dc_structureprincipalesuivi'},
                                { header: 'Nb DE affectes', key: 'nb_de_affectes'},
                                { header: 'ACTIV_Créa', key: 'ACTIV_Créa'},
                                { header: 'ACTIV_Emploi', key: 'ACTIV_Emploi'},
                                { header: 'AP2', key: 'AP2'},
                                { header: 'Regards_croisés', key: 'Regards_croisés'},
                                { header: 'Valoriser_son_image_pro', key: 'Valoriser_son_image_pro'},
                                { header: 'Vers1métier', key: 'Vers1métier'},
                                { header: 'ACL', key: 'ACL'},
                                { header: 'EMD', key: 'EMD'},
                                { header: 'Nombre DE avec presta', key: 'Presta'},
                                { header: 'Tx DE avec presta', key: 'tx_prestation'} 
                                
                            ];
                            
                            return xls.CreateXls('APE', header, jsonResult, tab_filter).xlsx.write(resp)
                            .then(function() {
                                    resp.status(200).end();
                            });

                    }
                }
            })
    });
})
                

//END



module.exports = router;