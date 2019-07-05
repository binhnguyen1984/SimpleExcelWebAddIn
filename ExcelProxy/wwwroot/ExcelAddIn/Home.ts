declare let fabric: any;
import * as FileHandler from "./FileHandler";
(function () {
    "use strict";
    let messageBanner;
    let compList;
    let rowCounter = 0;
    let startHeaders = 1;
    let startComponentHeaders = 3;
    let startSearchColCode = 65;
    let startCompColCode = 65;
    let search_cols = [];
    let search_props;
    let component_cols = [];
    let component_col_db;
    let compPropCount;
    let startSearchColName;
    let startUpdateColName;
    let endUpdateColName;
    let endSearchColName;
    let startCompColName;
    let endCompColName;
    let start_update_col;
    let end_update_col;
    let requestURL;

    // The initialize function must be run each time a new page is loaded.
    Office.initialize = function (reason) {
        $(document).ready(async function () {
            FileHandler.loadJSONFile("./config.json", initializeExcelData);
            //await FileHandler.loadExcelFile("./config.xlsx", () => { });

            // Initialize the FabricUI notification mechanism and hide it
            let element = document.querySelector('.ms-MessageBanner');
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

                return;
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
        });
    };

    function set_configuration(config) {
        let config_data = JSON.parse(config);
        let excel_config = config_data.Excel;
        requestURL = config_data.Database.requestURL;

        //Excel configuration setting
        startHeaders = excel_config.start_headers;
        startComponentHeaders = excel_config.start_component_headers;
        startSearchColCode = excel_config.start_search_col_code;
        startCompColCode = excel_config.start_component_col_code;
        start_update_col = excel_config.start_update_col;
        end_update_col = excel_config.end_update_col;
        search_cols.push(convert_string_to_array(excel_config.search_col_names_and_values));
        search_props = convert_string_to_array(excel_config.search_prop_names);//['code', 'prefix', 'system', 'group'];
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
        })
    }

    async function initializeExcelData(config: string) {
        set_configuration(config);
        await setExcelHeaders();
    }

    // this is kind of a pattern for handling contents in the current excel sheet
    async function excelHandler(handler) {
        try {
            await Excel.run(handler);
        } catch (error) {
            errorHandler(error);
        }
    }

    async function setExcelHeaders() {
        // Run a batch operation against the Excel object model
		await excelHandler(async ctx => {
                // Create a proxy object for the active sheet
                let sheet = ctx.workbook.worksheets.getActiveWorksheet();
                let searchRange = sheet.getRange(startSearchColName + startHeaders + ":" + endSearchColName + startHeaders);
                searchRange.values = search_cols;
                await ctx.sync();
                for (let col = 0; col < search_cols[0].length / 2; col++)
                {
                     let cell = searchRange.getCell(0, 2 * col);
                     cell.format.font.bold = true;
                     cell.format.fill.color = "yellow";
                }
                let componentRange = sheet.getRange(startCompColName + startComponentHeaders + ":" + endCompColName + startComponentHeaders);
                componentRange.values = component_cols;
                componentRange.format.font.bold = true;
                componentRange.format.fill.color = "orange";
                componentRange.format.autofitColumns();
                await ctx.sync();
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

    async function requestComponents(filterValues) {
        // create url to query for the data
        let url = requestURL + ".json?";
        let filter = '';
        let i = 0, col;
        for (; i < search_props.length; i++) {
            col = (i << 1);
            if (!empty(filterValues.values[0][col]))
                filter += search_props[i] + " eq '" + filterValues.values[0][col] + "' and ";
        }
        if (filter.length > 0) {
            filter = filter.substring(0, filter.length - 5);
            url += "$filter=" + filter;
        }

        // call the api to fetch all the components
        let response = await fetch(url);
        let data = await response.json();
        return data;
    }

    function getFilterValues(ctx) {
        // Create a proxy object for the active sheet
        let sheet = ctx.workbook.worksheets.getActiveWorksheet();
        let startSearchDataColName = String.fromCharCode(startSearchColCode + 1);
        let endSearchDataColName = String.fromCharCode(startSearchColCode + search_cols[0].length-1);

        // delete old data
        for (let col = 0; col < component_cols[0].length; col++) {
            let componentColName = String.fromCharCode(startCompColCode + col);
            let startIndex = startComponentHeaders + 1;
            let endIndex = startIndex + rowCounter;
            let dataRange = sheet.getRange(componentColName + startIndex + ":" + componentColName + endIndex);
            dataRange.clear();
        }

        //
        let filterRange = sheet.getRange(startSearchDataColName + startHeaders + ":" + endSearchDataColName + startHeaders);
        let filterValues = filterRange.load("values");
        return filterValues;
    }


    async function loadComponents() {
        // Run a batch operation against the Excel object model
        await excelHandler(async (ctx) => {
            showNotification("Message", "Data is loading ...")
            let filterValues = getFilterValues(ctx);
            await ctx.sync();
            let data = await requestComponents(filterValues);
            fillComponents(data);
            await ctx.sync();
            showNotification("Message", "Data has been loaded.");
        });
    }

    function parseJSONComponents(data) {
        let message = data.message;
        compList = message.components;
        if (compList == null || compList.length == 0)
            return null;
        let compValues = new Array(compList.length);
        for (let row = 0; row < compValues.length; row++) {
            compValues[row] = new Array(compPropCount);
            for (let col = 0; col < compPropCount; col++) {
                compValues[row][col] = compList[row][component_col_db[col]];
            }
        }
        return compValues;
    }

    async function fillComponents(data) {
        // Run a batch operation against the Excel object model
        await excelHandler(async (ctx) => {
            let compValues = parseJSONComponents(data);
            if (compValues != null) {
                // create a 2d-array to store all the component information
                let sheet = ctx.workbook.worksheets.getActiveWorksheet();
                let dataRange = sheet.getRange(startCompColName + (startComponentHeaders + 1) + ":" + endCompColName + (compValues.length + startComponentHeaders)).load("values");
                await ctx.sync();
                rowCounter = compValues.length
                if (rowCounter > 0) {
                    dataRange.values = compValues;
                    await ctx.sync();
                }
            }
        });
    }

    async function putComponent(compStr, componentID) {
        // create PUT url
        let url = requestURL + '(' + componentID + ')';
        let response = await fetch(url, {
            method: 'PUT',
            body: compStr,
            headers: {
                'Content-Type': 'application/json'
            }
        });
        let result = await response.json();
        return result;
    }

    async function updateComponents() {
        // Run a batch operation against the Excel object model
        await excelHandler(async function (ctx) {
            showNotification("Message:", "Updating the components... ");
            // create a 2d-array to store all the component information
            let sheet = ctx.workbook.worksheets.getActiveWorksheet();
            let updateRange = sheet.getRange(startUpdateColName + (startComponentHeaders + 1) + ":" + endUpdateColName + (rowCounter + startComponentHeaders)).load("values");
            await ctx.sync();
            for (let row = 0; row < rowCounter; row++)
                if (compList[row].locked == false) {
                    // update the values
                    for (let col = start_update_col; col <= end_update_col; col++) {
                        compList[row][component_col_db[col]] = updateRange.values[row][col - start_update_col];
                    }

                    // convert updated component information to a string
                    let compStr = JSON.stringify(compList[row]);
                    let result = await putComponent(compStr, compList[row].componentID);
                    if (result.code != 200) {
                        if (result.code == 500)
                            showNotification("Message:", "Updating row " + row +
                                " failed due to data inconsistency. You must fetch data before updating.");
                        else showNotification("Message:", "Updating row " + row + " failed [" + result.status + "]");
                        break;
                    }
                    else if (row == rowCounter - 1)
                        showNotification("Message:", "Updating succeeded!");
                }
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
