
const express = require('express');
const router = express.Router();
// const connection = require('../db');
const connection_pool = require('../db2');
const passport = require('passport');
const excel = require('exceljs');
// const { response } = require('express');

//select excel diag ide
//http://localhost:5000/diagxlsx/ide?colonne113=O
router.use('/ide', passport.authenticate('jwt', { session:  false }), (req,resp) => {
    const query = req.query;
   
    let sql = ""
        sql += `SELECT *`
        // sql += ' FROM T_Portefeuille INNER JOIN APE ON T_Portefeuille.dc_structureprincipalede = APE.id_ape'
        sql += ' FROM T_Portefeuille'
        sql += ' WHERE dc_situationde = 2'

    let sqlValues = [];
    
    Object.keys(query).map((key, index) => {
        sql += ` AND ${key} IN ( ? )`;
        sqlValues.push(query[key].split(","));
    })

    // console.log(sql)
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
                        let workbook = new excel.Workbook(); //creating workbook
                        let worksheet = workbook.addWorksheet('IDE',{views: [{showGridLines: false}]});; //creating worksheet
                        
                        worksheet.columns = [
                            { header: 'IDE', key: 'dc_individu_local'},
                            { header: 'APE', key: 'dc_structureprincipalede'},
                            { header: 'Référent', key: 'nom_ref'},
                            { header: 'Civilité', key: 'dc_civilite'},
                            { header: 'Nom', key: 'dc_nom'},
                            { header: 'Prénom', key: 'dc_prenom'},
                            { header: 'Catégorie', key: 'dc_categorie'},
                            { header: 'MSA', key: 'dc_parcours'},
                            { header: 'Mail', key: 'dc_adresseemail'},
                            { header: 'Tel', key: 'dc_telephone'}

                        ];

                        worksheet.columns.forEach(column => {
                            column.width = column.header.length < 5 ? 10 : column.header.length + 2
                          })

                        worksheet.addRows(jsonResult);

                        worksheet.getRow(1).eachCell((cell) => {
                            cell.font = { bold: true };
                          });
                          for (let i =1; i<=worksheet.columns.length;i++){
                          worksheet.getColumn(i).eachCell((cell) => {
                            cell.border = {
                                top: { style: 'thin' }, bottom: { style: 'thin' },
                              };
                          });
                        }
          
                        resp.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                        resp.setHeader('Content-Disposition', 'attachment; filename=' + 'diagIde.xlsx');  
                        return workbook.xlsx.write(resp)
                        .then(function() {
                              resp.status(200).end();
                        });
                

                    }
                }
        })

    });
})
                

//END

//select excel diag ref
//http://localhost:5000/diagxlsx/ref?colonne113=O
router.use('/ref', passport.authenticate('jwt', { session:  false }), (req,resp) => {
    const query = req.query;

//     Select t1.dc_dernieragentreferent, t1.nbCriteres, t2. nbDE, CONCAT(FORMAT(t1.nbCriteres / t2. nbDE * 100, 1),'%') as tx FROM 
// (SELECT p1.dc_dernieragentreferent, count(p1.dc_individu_local) as nbCriteres
//  FROM T_Portefeuille p1 INNER JOIN APE a1 ON p1.dc_structureprincipalede = a1.id_ape
//  WHERE p1.dc_situationde = 2 AND p1.dc_structureprincipalede = 97801 and p1.colonne42='B'
//  Group BY p1.dc_dernieragentreferent) as t1 INNER JOIN 
//  (SELECT p2.dc_dernieragentreferent, count(p2.dc_individu_local) as nbDE
//  FROM T_Portefeuille p2 INNER JOIN APE a2 ON p2.dc_structureprincipalede = a2.id_ape
//  WHERE p2.dc_situationde = 2 AND p2.dc_structureprincipalede = 97801
//  Group BY p2.dc_dernieragentreferent) as t2 ON t2.dc_dernieragentreferent=t1.dc_dernieragentreferent


    // let sql = "SELECT t2.dc_dernieragentreferent, CASE WHEN t1.nbDECriteres IS NULL THEN 0 ELSE t1.nbDECriteres END AS nbDECriteres, t2.nbDE," 
    //     sql+= ' CASE WHEN (nbDECriteres / t2. nbDE) IS NULL THEN 0 ELSE nbDECriteres / t2. nbDE END AS tx FROM'
    //     sql += '(SELECT p1.dc_dernieragentreferent, count(p1.dc_individu_local) as nbDECriteres'
    //     sql += ' FROM T_Portefeuille p1 INNER JOIN APE a1 ON p1.dc_structureprincipalede = a1.id_ape'
    //     sql += ' WHERE p1.dc_situationde = 2'

    let sql = "SELECT t2.nom_ref, CASE WHEN t1.nbDECriteres IS NULL THEN 0 ELSE t1.nbDECriteres END AS nbDECriteres, t2.nbDE, " 
        sql+= ' CASE WHEN (nbDECriteres / t2. nbDE) IS NULL THEN 0 ELSE nbDECriteres / t2. nbDE END AS tx FROM'
        sql += '(SELECT nom_ref, count(dc_individu_local) as nbDECriteres'
        sql += ' FROM T_Portefeuille'
        sql += ' WHERE dc_situationde = 2'    

    let sqlValues = [];
    
    // Object.keys(query).map((key, index) => {
    //     if (key==='dt') {
    //         sql += ` AND a1.${key} = ?`
    //         sqlValues.push(query[key])
    //     }
    //     else {
    //     sql += ` AND p1.${key} = ?`
    //     sqlValues.push(query[key])
    //     }

    // })
    Object.keys(query).map((key, index) => {
        sql += ` AND ${key} IN ( ? )`;
        sqlValues.push(query[key].split(","));
        }
       )

        // sql+=' GROUP BY p1.dc_dernieragentreferent) as t1 RIGHT JOIN '
        // sql+='(SELECT p2.dc_dernieragentreferent, count(p2.dc_individu_local) as nbDE '
        // sql+=' FROM T_Portefeuille p2 INNER JOIN APE a2 ON p2.dc_structureprincipalede = a2.id_ape'
        // sql+=' WHERE p2.dc_situationde = 2'

        sql+=' GROUP BY nom_ref) as t1 RIGHT JOIN '
        sql+='(SELECT nom_ref, count(dc_individu_local) as nbDE '
        sql+=' FROM T_Portefeuille'
        sql+=' WHERE dc_situationde = 2'

        // Object.keys(query).filter((key) => key==='dc_dernieragentreferent' || key==='dc_structureprincipalede' || key==='dt').map((key, index) => {
        //         if (key==='dt') {
        //             sql += ` AND a2.${key} = ?`
        //             sqlValues.push(query[key])
        //         }
        //         else {
        //         sql += ` AND p2.${key} = ?`
        //         sqlValues.push(query[key])
        //         }
        
        //     })

        Object.keys(query).filter((key) => key==='dc_dernieragentreferent' || key==='dc_structureprincipalede' || key==='dt').map((key, index) => {
                
                sql += ` AND ${key} = ?`
                sqlValues.push(query[key])
            })    
        
        // sql+=' GROUP BY p2.dc_dernieragentreferent) as t2 ON t2.dc_dernieragentreferent=t1.dc_dernieragentreferent'    
        sql+=' GROUP BY nom_ref) as t2 ON t2.nom_ref=t1.nom_ref'    


    //  console.log(sql)
    // console.log(sqlValues)
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
                        let workbook = new excel.Workbook(); //creating workbook
                        let worksheet = workbook.addWorksheet('REF',{views: [{showGridLines: false}]});; //creating worksheet
                        
                        worksheet.columns = [
                            { header: 'Référent', key: 'nom_ref'},
                            { header: 'Nombre DE avec critères sélectionnés', key: 'nbDECriteres'},
                            { header: 'Nombre DE en portefeuille', key: 'nbDE'},
                            { header: 'Taux', key: 'tx'},

                        ];

                        worksheet.columns.forEach(column => {
                            column.width = column.header.length < 5 ? 10 : column.header.length + 2
                          })

                        worksheet.addRows(jsonResult);

                        worksheet.getRow(1).eachCell((cell) => {
                            cell.font = { bold: true };
                          });
                          for (let i =1; i<=worksheet.columns.length;i++){
                          worksheet.getColumn(i).eachCell((cell) => {
                            cell.border = {
                                top: { style: 'thin' }, bottom: { style: 'thin' },
                              };
                          });
                        }

                        worksheet.getColumn(4).eachCell((cell) => {
                            cell.numFmt = '0.0%';
                          });
          
                        resp.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                        resp.setHeader('Content-Disposition', 'attachment; filename=' + 'diagRef.xlsx');  
                        return workbook.xlsx.write(resp)
                        .then(function() {
                              resp.status(200).end();
                        });
                    }
                }
        })
    });
                
})
//END

//select excel diag ape
//http://localhost:5000/diagxlsx/ape?colonne113=O
router.use('/ape', passport.authenticate('jwt', { session:  false }), (req,resp) => {
    const query = req.query;

    // let sql = "SELECT t2.dc_structureprincipalede, CASE WHEN t1.nbDECriteres IS NULL THEN 0 ELSE t1.nbDECriteres END AS nbDECriteres, t2.nbDE, "
    //     sql+= ' CASE WHEN (nbDECriteres / t2. nbDE) IS NULL THEN 0 ELSE nbDECriteres / t2. nbDE END AS tx FROM'
    //     sql += '(SELECT p1.dc_structureprincipalede, count(p1.dc_individu_local) as nbDECriteres'
    //     sql += ' FROM T_Portefeuille p1 INNER JOIN APE a1 ON p1.dc_structureprincipalede = a1.id_ape'
    //     sql += ' WHERE p1.dc_situationde = 2'

    let sql = "SELECT t2.dc_structureprincipalede, CASE WHEN t1.nbDECriteres IS NULL THEN 0 ELSE t1.nbDECriteres END AS nbDECriteres, t2.nbDE, "
        sql+= ' CASE WHEN (nbDECriteres / t2. nbDE) IS NULL THEN 0 ELSE nbDECriteres / t2. nbDE END AS tx FROM'
        sql += '(SELECT dc_structureprincipalede, count(dc_individu_local) as nbDECriteres'
        sql += ' FROM T_Portefeuille'
        sql += ' WHERE dc_situationde = 2'    

    let sqlValues = [];
    
    // Object.keys(query).map((key, index) => {
    //     if (key==='dt') {
    //         sql += ` AND a1.${key} = ?`
    //         sqlValues.push(query[key])
    //     }
    //     else {
    //     sql += ` AND p1.${key} = ?`
    //     sqlValues.push(query[key])
    //     }

    // })
    Object.keys(query).filter((key) => query[key]!=='all').map((key, index) => {
        sql += ` AND ${key} IN ( ? )`;
        sqlValues.push(query[key].split(","));
        
    })

        // sql+=' GROUP BY p1.dc_structureprincipalede) as t1 RIGHT JOIN '
        // sql+='(SELECT p2.dc_structureprincipalede, count(p2.dc_individu_local) as nbDE '
        // sql+=' FROM T_Portefeuille p2 INNER JOIN APE a2 ON p2.dc_structureprincipalede = a2.id_ape'
        // sql+=' WHERE p2.dc_situationde = 2'

        sql+=' GROUP BY dc_structureprincipalede) as t1 RIGHT JOIN '
        sql+='(SELECT dc_structureprincipalede, count(dc_individu_local) as nbDE '
        sql+=' FROM T_Portefeuille'
        sql+=' WHERE dc_situationde = 2'

        // Object.keys(query).filter((key) => key==='dc_dernieragentreferent' || key==='dc_structureprincipalede' || key==='dt').map((key, index) => {
        //         if (key==='dt') {
        //             sql += ` AND a2.${key} = ?`
        //             sqlValues.push(query[key])
        //         }
        //         else {
        //         sql += ` AND p2.${key} = ?`
        //         sqlValues.push(query[key])
        //         }
        
        //     })
        Object.keys(query).filter((key) => key==='dc_dernieragentreferent' || key==='dc_structureprincipalede' || key==='dt').map((key, index) => {
                
                sql += ` AND ${key} = ?`
                sqlValues.push(query[key])
                
        
            })   
        
        // sql+=' GROUP BY p2.dc_structureprincipalede) as t2 ON t2.dc_structureprincipalede=t1.dc_structureprincipalede'    
        sql+=' GROUP BY dc_structureprincipalede) as t2 ON t2.dc_structureprincipalede=t1.dc_structureprincipalede'    


    // console.log(sql)
    // console.log(sqlValues)

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
                        let workbook = new excel.Workbook(); //creating workbook
                        let worksheet = workbook.addWorksheet('APE',{views: [{showGridLines: false}]});; //creating worksheet
                        
                        worksheet.columns = [
                            { header: 'APE', key: 'dc_structureprincipalede'},
                            { header: 'Nombre DE avec critères sélectionnés', key: 'nbDECriteres'},
                            { header: 'Nombre DE en portefeuille', key: 'nbDE'},
                            { header: 'Taux', key: 'tx'},

                        ];

                        worksheet.columns.forEach(column => {
                            column.width = column.header.length < 5 ? 10 : column.header.length + 2
                          })

                        worksheet.addRows(jsonResult);

                        worksheet.getRow(1).eachCell((cell) => {
                            cell.font = { bold: true };
                          });
                          for (let i =1; i<=worksheet.columns.length;i++){
                          worksheet.getColumn(i).eachCell((cell) => {
                            cell.border = {
                                top: { style: 'thin' }, bottom: { style: 'thin' },
                              };
                          });
                        }

                        worksheet.getColumn(4).eachCell((cell) => {
                            cell.numFmt = '0.0%';
                          });
          
                        resp.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                        resp.setHeader('Content-Disposition', 'attachment; filename=' + 'diagApe.xlsx');  
                        return workbook.xlsx.write(resp)
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