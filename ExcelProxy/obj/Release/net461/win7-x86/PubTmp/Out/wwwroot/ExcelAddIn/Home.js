"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var FileHandler = require("./FileHandler");
(function () {
    "use strict";
    var messageBanner;
    var compList;
    var rowCounter = 0;
    var startHeaders = 1;
    var startComponentHeaders = 3;
    var startSearchColCode = 65;
    var startCompColCode = 65;
    var search_cols = [];
    var search_props;
    var component_cols = [];
    var component_col_db;
    var compPropCount;
    var startSearchColName;
    var startUpdateColName;
    var endUpdateColName;
    var endSearchColName;
    var startCompColName;
    var endCompColName;
    var start_update_col;
    var end_update_col;
    var requestURL;
    // The initialize function must be run each time a new page is loaded.
    Office.initialize = function (reason) {
        $(document).ready(function () {
            return __awaiter(this, void 0, void 0, function () {
                var element;
                return __generator(this, function (_a) {
                    FileHandler.loadJSONFile("./config.json", initializeExcelData);
                    element = document.querySelector('.ms-MessageBanner');
                    messageBanner = new fabric.MessageBanner(element);
                    messageBanner.hideBanner();
                    // If not using Excel 2016, use fallback logic.
                    if (!Office.context.requirements.isSetSupported('ExcelApi', 1.1)) {
                        $("#template-description").text("This sample allows reading/writing from/to the Excel sheet.");
                        $('#fetch-button-text').text("Fetch");
                        $('#fetch-button-desc').text("Fetch components");
                        $('#fetch-button').click(loadComponents);
                        $('#put-button-text').text("Update");
                        $('#put-button-desc').text("Update components");
                        $('#put-button').click(loadComponents);
                        return [2 /*return*/];
                    }
                    //$("#template-description").text("This sample will fetch all the components to the Excel sheet.");
                    $('#fetch-button-text').text("Fetch");
                    $('#fetch-button-desc').text("Fetch all the components.");
                    // Add a click event handler for the fetch button.
                    $('#fetch-button').click(loadComponents);
                    $('#put-button-text').text("Update");
                    $('#put-button-desc').text("Update components.");
                    // Add a click event handler for the put button.
                    $('#put-button').click(updateComponents);
                    return [2 /*return*/];
                });
            });
        });
    };
    function set_configuration(config) {
        var config_data = JSON.parse(config);
        var excel_config = config_data.Excel;
        requestURL = config_data.Database.requestURL;
        //Excel configuration setting
        startHeaders = excel_config.start_headers;
        startComponentHeaders = excel_config.start_component_headers;
        startSearchColCode = excel_config.start_search_col_code;
        startCompColCode = excel_config.start_component_col_code;
        start_update_col = excel_config.start_update_col;
        end_update_col = excel_config.end_update_col;
        search_cols.push(convert_string_to_array(excel_config.search_col_names_and_values));
        search_props = convert_string_to_array(excel_config.search_prop_names); //['code', 'prefix', 'system', 'group'];
        component_cols.push(convert_string_to_array(excel_config.component_col_names));
        component_col_db = convert_string_to_array(excel_config.component_col_db);
        compPropCount = component_cols[0].length;
        startSearchColName = String.fromCharCode(startSearchColCode);
        endSearchColName = String.fromCharCode(startSearchColCode + search_cols[0].length - 1);
        startCompColName = String.fromCharCode(startCompColCode);
        endCompColName = String.fromCharCode(startCompColCode + compPropCount - 1);
        startUpdateColName = String.fromCharCode(startCompColCode + start_update_col);
        endUpdateColName = String.fromCharCode(startCompColCode + end_update_col);
    }
    function convert_string_to_array(str) {
        return str.split(",").map(function (item) {
            return item.trim();
        });
    }
    function initializeExcelData(config) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        set_configuration(config);
                        return [4 /*yield*/, setExcelHeaders()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    }
    // this is kind of a pattern for handling contents in the current excel sheet
    function excelHandler(handler) {
        return __awaiter(this, void 0, void 0, function () {
            var error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, Excel.run(handler)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        errorHandler(error_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    }
    function setExcelHeaders() {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // Run a batch operation against the Excel object model
                    return [4 /*yield*/, excelHandler(function (ctx) { return __awaiter(_this, void 0, void 0, function () {
                            var sheet, searchRange, col, cell, componentRange;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        sheet = ctx.workbook.worksheets.getActiveWorksheet();
                                        searchRange = sheet.getRange(startSearchColName + startHeaders + ":" + endSearchColName + startHeaders);
                                        searchRange.values = search_cols;
                                        return [4 /*yield*/, ctx.sync()];
                                    case 1:
                                        _a.sent();
                                        for (col = 0; col < search_cols[0].length / 2; col++) {
                                            cell = searchRange.getCell(0, 2 * col);
                                            cell.format.font.bold = true;
                                            cell.format.fill.color = "yellow";
                                        }
                                        componentRange = sheet.getRange(startCompColName + startComponentHeaders + ":" + endCompColName + startComponentHeaders);
                                        componentRange.values = component_cols;
                                        componentRange.format.font.bold = true;
                                        componentRange.format.fill.color = "orange";
                                        componentRange.format.autofitColumns();
                                        return [4 /*yield*/, ctx.sync()];
                                    case 2:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                    case 1:
                        // Run a batch operation against the Excel object model
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    }
    function empty(data) {
        if (typeof (data) == 'number' || typeof (data) == 'boolean') {
            return false;
        }
        if (typeof (data) == 'undefined' || data === null) {
            return true;
        }
        if (typeof (data.length) != 'undefined') {
            return data.length == 0;
        }
        return true;
    }
    function requestComponents(filterValues) {
        return __awaiter(this, void 0, void 0, function () {
            var url, filter, i, col, response, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = requestURL + ".json?";
                        filter = '';
                        i = 0;
                        for (; i < search_props.length; i++) {
                            col = (i << 1);
                            if (!empty(filterValues.values[0][col]))
                                filter += search_props[i] + " eq '" + filterValues.values[0][col] + "' and ";
                        }
                        if (filter.length > 0) {
                            filter = filter.substring(0, filter.length - 5);
                            url += "$filter=" + filter;
                        }
                        return [4 /*yield*/, fetch(url)];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 2:
                        data = _a.sent();
                        return [2 /*return*/, data];
                }
            });
        });
    }
    function getFilterValues(ctx) {
        // Create a proxy object for the active sheet
        var sheet = ctx.workbook.worksheets.getActiveWorksheet();
        var startSearchDataColName = String.fromCharCode(startSearchColCode + 1);
        var endSearchDataColName = String.fromCharCode(startSearchColCode + search_cols[0].length - 1);
        // delete old data
        for (var col = 0; col < component_cols[0].length; col++) {
            var componentColName = String.fromCharCode(startCompColCode + col);
            var startIndex = startComponentHeaders + 1;
            var endIndex = startIndex + rowCounter;
            var dataRange = sheet.getRange(componentColName + startIndex + ":" + componentColName + endIndex);
            dataRange.clear();
        }
        //
        var filterRange = sheet.getRange(startSearchDataColName + startHeaders + ":" + endSearchDataColName + startHeaders);
        var filterValues = filterRange.load("values");
        return filterValues;
    }
    function loadComponents() {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // Run a batch operation against the Excel object model
                    return [4 /*yield*/, excelHandler(function (ctx) { return __awaiter(_this, void 0, void 0, function () {
                            var filterValues, data;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        showNotification("Message", "Data is loading ...");
                                        filterValues = getFilterValues(ctx);
                                        return [4 /*yield*/, ctx.sync()];
                                    case 1:
                                        _a.sent();
                                        return [4 /*yield*/, requestComponents(filterValues)];
                                    case 2:
                                        data = _a.sent();
                                        fillComponents(data);
                                        return [4 /*yield*/, ctx.sync()];
                                    case 3:
                                        _a.sent();
                                        showNotification("Message", "Data has been loaded.");
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                    case 1:
                        // Run a batch operation against the Excel object model
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    }
    function parseJSONComponents(data) {
        var message = data.message;
        compList = message.components;
        if (compList == null || compList.length == 0)
            return null;
        var compValues = new Array(compList.length);
        for (var row = 0; row < compValues.length; row++) {
            compValues[row] = new Array(compPropCount);
            for (var col = 0; col < compPropCount; col++) {
                compValues[row][col] = compList[row][component_col_db[col]];
            }
        }
        return compValues;
    }
    function fillComponents(data) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // Run a batch operation against the Excel object model
                    return [4 /*yield*/, excelHandler(function (ctx) { return __awaiter(_this, void 0, void 0, function () {
                            var compValues, sheet, dataRange;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        compValues = parseJSONComponents(data);
                                        if (!(compValues != null)) return [3 /*break*/, 3];
                                        sheet = ctx.workbook.worksheets.getActiveWorksheet();
                                        dataRange = sheet.getRange(startCompColName + (startComponentHeaders + 1) + ":" + endCompColName + (compValues.length + startComponentHeaders)).load("values");
                                        return [4 /*yield*/, ctx.sync()];
                                    case 1:
                                        _a.sent();
                                        rowCounter = compValues.length;
                                        if (!(rowCounter > 0)) return [3 /*break*/, 3];
                                        dataRange.values = compValues;
                                        return [4 /*yield*/, ctx.sync()];
                                    case 2:
                                        _a.sent();
                                        _a.label = 3;
                                    case 3: return [2 /*return*/];
                                }
                            });
                        }); })];
                    case 1:
                        // Run a batch operation against the Excel object model
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    }
    function putComponent(compStr, componentID) {
        return __awaiter(this, void 0, void 0, function () {
            var url, response, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = requestURL + '(' + componentID + ')';
                        return [4 /*yield*/, fetch(url, {
                                method: 'PUT',
                                body: compStr,
                                headers: {
                                    'Content-Type': 'application/json'
                                }
                            })];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 2:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    }
    function updateComponents() {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // Run a batch operation against the Excel object model
                    return [4 /*yield*/, excelHandler(function (ctx) {
                            return __awaiter(this, void 0, void 0, function () {
                                var sheet, updateRange, row, col, compStr, result;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            showNotification("Message:", "Updating the components... ");
                                            sheet = ctx.workbook.worksheets.getActiveWorksheet();
                                            updateRange = sheet.getRange(startUpdateColName + (startComponentHeaders + 1) + ":" + endUpdateColName + (rowCounter + startComponentHeaders)).load("values");
                                            return [4 /*yield*/, ctx.sync()];
                                        case 1:
                                            _a.sent();
                                            row = 0;
                                            _a.label = 2;
                                        case 2:
                                            if (!(row < rowCounter)) return [3 /*break*/, 5];
                                            if (!(compList[row].locked == false)) return [3 /*break*/, 4];
                                            // update the values
                                            for (col = start_update_col; col <= end_update_col; col++) {
                                                compList[row][component_col_db[col]] = updateRange.values[row][col - start_update_col];
                                            }
                                            compStr = JSON.stringify(compList[row]);
                                            return [4 /*yield*/, putComponent(compStr, compList[row].componentID)];
                                        case 3:
                                            result = _a.sent();
                                            if (result.code != 200) {
                                                if (result.code == 500)
                                                    showNotification("Message:", "Updating row " + row +
                                                        " failed due to data inconsistency. You must fetch data before updating.");
                                                else
                                                    showNotification("Message:", "Updating row " + row + " failed [" + result.status + "]");
                                                return [3 /*break*/, 5];
                                            }
                                            else if (row == rowCounter - 1)
                                                showNotification("Message:", "Updating succeeded!");
                                            _a.label = 4;
                                        case 4:
                                            row++;
                                            return [3 /*break*/, 2];
                                        case 5: return [2 /*return*/];
                                    }
                                });
                            });
                        })];
                    case 1:
                        // Run a batch operation against the Excel object model
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    }
    // Helper function for treating errors
    function errorHandler(error) {
        // Always be sure to catch any accumulated errors that bubble up from the Excel.run execution
        showNotification("Error", error);
        console.log("Error: " + error);
        if (error instanceof OfficeExtension.Error) {
            console.log("Debug info: " + JSON.stringify(error.debugInfo));
        }
    }
    // Helper function for displaying notifications
    function showNotification(header, content) {
        $("#notification-header").text(header);
        $("#notification-body").text(content);
        messageBanner.showBanner();
        messageBanner.toggleExpansion();
    }
})();
