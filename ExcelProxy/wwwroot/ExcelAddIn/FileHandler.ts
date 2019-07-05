import { Workbook, Worksheet } from 'exceljs';
export function loadJSONFile(file, callback) {
    let rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4 && rawFile.status == 200) {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}

export function loadExcelFile(file, callback) {
    console.log("Loading excel file");
    let wb: Workbook = new Workbook();
    let result = null;
    try {
        //console.log("start");
        wb.xlsx.readFile(file).then(() => {
            console.log("end");
            let sheet: Worksheet = wb.getWorksheet("Sheet1");
            let headers = sheet.getRow(0);
            let rowId = 1;
            result = new Array();
            while (true) {
                let rowData = sheet.getRow(rowId);
                if (rowData.hasValues) {
                    result.push(rowData); rowId++;
                }
                else break;
            };
        })
    } catch (error) {
        return null;
    }
    return result;
}