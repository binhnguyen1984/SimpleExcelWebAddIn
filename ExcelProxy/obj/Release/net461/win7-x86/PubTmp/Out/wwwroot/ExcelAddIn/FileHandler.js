"use strict";
exports.__esModule = true;
var exceljs_1 = require("exceljs");
function loadJSONFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4 && rawFile.status == 200) {
            callback(rawFile.responseText);
        }
    };
    rawFile.send(null);
}
exports.loadJSONFile = loadJSONFile;
function loadExcelFile(file, callback) {
    console.log("Loading excel file");
    var wb = new exceljs_1.Workbook();
    var result = null;
    try {
        //console.log("start");
        wb.xlsx.readFile(file).then(function () {
            console.log("end");
            var sheet = wb.getWorksheet("Sheet1");
            var headers = sheet.getRow(0);
            var rowId = 1;
            result = new Array();
            while (true) {
                var rowData = sheet.getRow(rowId);
                if (rowData.hasValues) {
                    result.push(rowData);
                    rowId++;
                }
                else
                    break;
            }
            ;
        });
    }
    catch (error) {
        return null;
    }
    return result;
}
exports.loadExcelFile = loadExcelFile;
