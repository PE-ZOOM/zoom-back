
const express = require('express');
const router = express.Router();
const connection_pool = require('../db2');
const passport = require('passport');
const excel = require('exceljs');

//select excel efo ide
//http://localhost:5000/efoxlsx/ide?
router.use('/ide', passport.authenticate('jwt', { session:  false }), (req,resp) => {
    const query = req.query;
   
    let sql = ""
        sql += "SELECT dc_individu_local,dc_structureprincipalede,nom_ref,dc_civilite,"
        sql += "dc_nom, dc_prenom,dc_categorie,dc_situationde,dc_parcours,dc_adresseemail,dc_telephone,"
        sql += "dc_statutaction_id,dc_formacode_id, dc_lblformacode,"
        sql += "DATE_FORMAT(dd_datepreconisation,'%d/%m/%Y') AS french_datepreco "
        // sql += ' FROM T_EFO INNER JOIN APE ON T_EFO.dc_structureprincipalede = APE.id_ape'
        sql += ' FROM T_EFO'

    let sqlValues = [];
    
    Object.keys(query).filter((key) => query[key]!=='all').map((key, index) => {
        //datepreconisation 
      if (key==='dd_datepreconisation') {
        if (index === 0) {
            sql += ` WHERE ${key} > ? `
        }
        else {
            sql += ` AND ${key} > ? `
        } 
      } else {
        
        if (key==='dc_lblformacode') {
            if (index === 0) {
                sql += ` WHERE ${key} LIKE "%" ? "%"`
            }
            else {
                sql += ` AND ${key} LIKE "%" ? "%"`
            } 

        } else  {
        
            if (index === 0) {
                    sql += ` WHERE ${key} = ?`
                }
                else {
                    sql += ` AND ${key} = ?`
                } 
            }
        }
        sqlValues.push(query[key])
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
                    { header: 'Situation', key: 'dc_situationde'},
                    { header: 'MSA', key: 'dc_parcours'},
                    { header: 'Mail', key: 'dc_adresseemail'},
                    { header: 'Tel', key: 'dc_telephone'},
                    { header: 'Statut Action', key: 'dc_statutaction_id'},
                    { header: 'Formacode', key: 'dc_formacode_id'},
                    { header: 'Libellé Formacode', key: 'dc_lblformacode'},
                    { header: 'Date préconisation', key: 'french_datepreco'}
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
                resp.setHeader('Content-Disposition', 'attachment; filename=' + 'efoIde.xlsx');  
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

//select excel efo ref
//http://localhost:5000/efoxlsx/ref?
router.use('/ref', passport.authenticate('jwt', { session:  false }), (req,resp) => {
    const query = req.query;
    let sql = ''
        sql+= 'Select t3.nom_ref, CASE WHEN t1.nbEFO  IS NULL THEN 0 ELSE t1.nbEFO END AS nbEFO,'
        sql+= ' CASE WHEN t2.nbDEEFO  IS NULL THEN 0 ELSE t2.nbDEEFO END AS nbDEEFO, t3.nbDE,'
        sql+= ' CASE WHEN (nbDEEFO / t3. nbDE) IS NULL  THEN 0 ELSE nbDEEFO / t3. nbDE END AS tx FROM'
        sql+= '(SELECT p1.nom_ref, count(p1.dc_individu_local) as nbEFO'
        // sql+= ' FROM T_EFO p1 INNER JOIN APE a1 ON p1.dc_structureprincipalede = a1.id_ape'
        sql+= ' FROM T_EFO p1'
 
    let sqlValues = [];
    
    Object.keys(query).filter((key) => query[key]!=='all').map((key, index) => {
        
        //datepreconisation 
      if (key==='dd_datepreconisation') {
        if (index === 0) {
            sql += ` WHERE p1.${key} > ? `
        }
        else {
            sql += ` AND p1.${key} > ? `
        } 
      } else {
        if (key==='dc_lblformacode') {
            if (index === 0) {
                sql += ` WHERE p1.${key} LIKE "%" ? "%"`
            }
            else {
                sql += ` AND p1.${key} LIKE "%" ? "%"`
            }
        }
            
        else {    
        
        if (index === 0) {
                sql += ` WHERE p1.${key} = ?`
            }
            else {
                sql += ` AND p1.${key} = ?`
            }
        }
    }
        sqlValues.push(query[key])
    })

    sql+=' GROUP BY p1.nom_ref) as t1 INNER JOIN'
    sql+=' (SELECT x.nom_ref, count(x.dc_individu_local) as nbDEEFO FROM'
    sql+=' (SELECT DISTINCT p2.dc_individu_local, p2.nom_ref'
    // sql+=' FROM T_EFO p2 INNER JOIN APE a2 ON p2.dc_structureprincipalede = a2.id_ape'
    sql+=' FROM T_EFO p2'
   
    
    Object.keys(query).filter((key) => query[key]!=='all').map((key, index) => {
        //datepreconisation 
      if (key==='dd_datepreconisation') {
        if (index === 0) {
            sql += ` WHERE p2.${key} > ? `
        }
        else {
            sql += ` AND p2.${key} > ? `
        } 
      } else { 
        if (key==='dc_lblformacode') {
            if (index === 0) {
                sql += ` WHERE p2.${key} LIKE "%" ? "%"`
            }
            else {
                sql += ` AND p2.${key} LIKE "%" ? "%"`
            }
        }
            
        else { 
            if (index === 0) {
                sql += ` WHERE p2.${key} = ?`
            }
            else {
                sql += ` AND p2.${key} = ?`
    
            } 
        }}
        sqlValues.push(query[key])
    })
    

    sql+=') x Group by x.nom_ref'
    sql+=') as t2 ON t2.nom_ref=t1.nom_ref'
    sql+=' RIGHT JOIN'
    sql+=' (SELECT p3.nom_ref, count(p3.dc_individu_local) as nbDE'
    // sql+=' FROM T_Portefeuille p3 INNER JOIN APE a3 ON p3.dc_structureprincipalede = a3.id_ape'
    sql+=' FROM T_Portefeuille p3'

    Object.keys(query).filter((key) => query[key]!=='all' && key!=='dc_statutaction_id' && key!=='dc_lblformacode' && key!=='dd_datepreconisation').map((key, index) => {
        
        
            if (index === 0) {
                sql += ` WHERE p3.${key} = ?`
            }
            else {
                sql += ` AND p3.${key} = ?`
    
            } 
        
        sqlValues.push(query[key])
    })

   sql+=' GROUP BY p3.nom_ref'
   sql+=') as t3 ON t3.nom_ref=t1.nom_ref'

   

//    console.log(sql)
//    console.log(sqlValues)

    connection_pool.getConnection(function(error, conn) {
        if (error) throw err; // not connected!

        conn.query(sql, sqlValues, (err, results) => {
                conn.release();

                if (err) {
                    console.log(err)
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
                    { header: "Nombre d'EFO", key: 'nbEFO'},
                    { header: 'Nombre de DE avec EFO', key: 'nbDEEFO' },
                    { header: 'Nombre de DE', key: 'nbDE' },
                    { header: 'Taux DE avec EFO', key: 'tx' },
                    
                ];
                
                worksheet.columns.forEach(column => {
                    column.width = column.header.length < 10 ? 10 : column.header.length + 2
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

                worksheet.getColumn(5).eachCell((cell) => {
                    cell.numFmt = '0.0%';
                  });

  
                resp.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                resp.setHeader('Content-Disposition', 'attachment; filename=' + 'efoREF.xlsx');  
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

//select excel efo ape
//http://localhost:5000/efoxlsx/ape?
router.use('/ape', passport.authenticate('jwt', { session:  false }), (req,resp) => {
    const query = req.query;
    
    let sql = 'Select t3.dc_structureprincipalede, CASE WHEN t1.nbEFO  IS NULL THEN 0 ELSE t1.nbEFO END AS nbEFO,'
        sql+= ' CASE WHEN t2.nbDEEFO  IS NULL THEN 0 ELSE t2.nbDEEFO END AS nbDEEFO, t3.nbDE,'
        sql+= ' CASE WHEN (nbDEEFO / t3. nbDE) IS NULL  THEN 0 ELSE nbDEEFO / t3. nbDE END AS tx FROM'
        sql+= '(SELECT p1.dc_structureprincipalede, count(p1.dc_individu_local) as nbEFO'
        // sql+= ' FROM T_EFO p1 INNER JOIN APE a1 ON p1.dc_structureprincipalede = a1.id_ape'
        sql+= ' FROM T_EFO p1'
 
    let sqlValues = [];
    
    Object.keys(query).filter((key) => query[key]!=='all').map((key, index) => {
        
        //datepreconisation 
      if (key==='dd_datepreconisation') {
        if (index === 0) {
            sql += ` WHERE p1.${key} > ? `
        }
        else {
            sql += ` AND p1.${key} > ? `
        } 
      } else {
        if (key==='dc_lblformacode') {
            if (index === 0) {
                sql += ` WHERE p1.${key} LIKE "%" ? "%"`
            }
            else {
                sql += ` AND p1.${key} LIKE "%" ? "%"`
            }
        }
            
        else {    
        
        if (index === 0) {
                sql += ` WHERE p1.${key} = ?`
            }
            else {
                sql += ` AND p1.${key} = ?`
            }
        }}
        sqlValues.push(query[key])
    })

    sql+=' GROUP BY p1.dc_structureprincipalede) as t1 INNER JOIN'
    sql+=' (SELECT x.dc_structureprincipalede, count(x.dc_individu_local) as nbDEEFO FROM'
    sql+=' (SELECT DISTINCT p2.dc_individu_local, p2.dc_structureprincipalede'
    // sql+=' FROM T_EFO p2 INNER JOIN APE a2 ON p2.dc_structureprincipalede = a2.id_ape'
    sql+=' FROM T_EFO p2'
   
    
    Object.keys(query).filter((key) => query[key]!=='all').map((key, index) => {
        //datepreconisation 
      if (key==='dd_datepreconisation') {
        if (index === 0) {
            sql += ` WHERE p2.${key} > ? `
        }
        else {
            sql += ` AND p2.${key} > ? `
        } 
      } else { 
        if (key==='dc_lblformacode') {
            if (index === 0) {
                sql += ` WHERE p2.${key} LIKE "%" ? "%"`
            }
            else {
                sql += ` AND p2.${key} LIKE "%" ? "%"`
            }
        }
            
        else { 
            if (index === 0) {
                sql += ` WHERE p2.${key} = ?`
            }
            else {
                sql += ` AND p2.${key} = ?`
    
            } 
        }}
        sqlValues.push(query[key])
    })
    

    sql+=') x Group by x.dc_structureprincipalede'
    sql+=') as t2 ON t2.dc_structureprincipalede=t1.dc_structureprincipalede'
    sql+=' RIGHT JOIN'
    sql+=' (SELECT p3.dc_structureprincipalede, count(p3.dc_individu_local) as nbDE'
    // sql+=' FROM T_Portefeuille p3 INNER JOIN APE a3 ON p3.dc_structureprincipalede = a3.id_ape'
    sql+=' FROM T_Portefeuille p3'

    Object.keys(query).filter((key) => query[key]!=='all' && key!=='dc_statutaction_id' && key!=='dc_lblformacode' && key!=='dd_datepreconisation').map((key, index) => {
        
        
            if (index === 0) {
                sql += ` WHERE p3.${key} = ?`
            }
            else {
                sql += ` AND p3.${key} = ?`
    
            } 
        
        sqlValues.push(query[key])
    })

   sql+=' GROUP BY p3.dc_structureprincipalede'
   sql+=') as t3 ON t3.dc_structureprincipalede=t1.dc_structureprincipalede' 
    

    //  console.log(sql)
    //  console.log(sqlValues)

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
                let worksheet = workbook.addWorksheet('APE',{views: [{showGridLines: false}]}); //creating worksheet
             
                worksheet.columns = [
                    { header: 'APE', key: 'dc_structureprincipalede' },
                    { header: "Nombre d'EFO", key: 'nbEFO' },
                    { header: 'Nombre de DE avec EFO', key: 'nbDEEFO' },
                    { header: 'Nombre de DE', key: 'nbDE' },
                    { header: 'Taux DE avec EFO', key: 'tx' },
                    
                ];
                
                
                worksheet.columns.forEach(column => {
                    column.width = column.header.length < 10 ? 10 : column.header.length + 2
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

                worksheet.getColumn(5).eachCell((cell) => {
                    cell.numFmt = '0.0%';
                  });

                //   worksheet.autoFilter = {
                //     from: 'A1',
                //     to: 'E1',
                // } 
                

                resp.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                resp.setHeader('Content-Disposition', 'attachment; filename=' + 'efoAPE.xlsx');  
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