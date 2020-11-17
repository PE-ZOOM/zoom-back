const excel = require('exceljs');

module.exports = {
    /*

        Modules pour créer les fichier export XLS
        Utilisation = xls.CreateXls(wsName, header, data, filter)
        wsName      = Nom de la sheet
        header      = tableau d'objet entête [{name : ..., key : ...}, {name : ..., key : ...}]
        data  = résultat de la requête SQL
        filter  = filtre utilisé (Si pas de filtre, MyTable commence en 'A1')
        prct = Int numéro de la colonne à mettre en %, pour ne rien mettre en %, ne rien mettre à la place de prct

    */
    CreateXls: function (wsName, header, data, filter, prct){

        let workbook = new excel.Workbook(); //creating workbook
        let worksheet = workbook.addWorksheet(wsName,{views: [{showGridLines: false}]}); //creating worksheet
        let tab_header = []
        let tab_row = []
        let cellTable = ''
        
        if(filter && filter.length > 0){
            filter.unshift('Mes filtres', '')
            filter.map((value, index) => {
                let cell = worksheet.getCell('A'+(2+index).toString());
                cell.value = value;
                // worksheet.mergeCells('A'+(2+index).toString()+':'+String.fromCharCode(64+parseInt(header.length))+(2+index).toString());
                
                if(index==0){
                    cell.font = {
                        family: 4,
                        size: 12,
                        bold: true
                        };
                }
            })
            cellTable = (3+filter.length).toString();
        }else{
            cellTable = '1';
        }
        

        header.map((key) => {
            tab_header.push({name: key.header, filterButton: true})
            
        })

        let rows = []
        for(i in data){
            header.map((key) => {
                tab_row.push(data[i][key.key])
            })
            rows.push(tab_row)
            tab_row = []
        }
        // console.log(rows)

        worksheet.addTable({
            name: 'MyTable',
            ref: 'A'+cellTable,
            headerRow: true,
            totalsRow: false,
            style: {
                theme: 'TableStyleLight6',
                showRowStripes: true,
            },
            columns: tab_header,
            rows: rows,
        });

        for(i in tab_header){
            worksheet.getColumn(parseInt(i)+1).width = 15;
        } 
        if(typeof(prct)=='object')
            {
                prct.map((key) => {
                   worksheet.getColumn(key).eachCell((cell) => {
                        cell.numFmt = '0.0%';
                    });
                })
                // worksheet.getColumn(parseInt(i)+1).eachCell((cell) => {
                //     cell.numFmt = '0.0%';
                // });
            }

        worksheet.addRows(data);

        return workbook

    }


}