declare interface Components {
    const hdbURL: string;
    const cdpURL: string;
}

export function set_compopnents_configuration(config) {
    let config_data = JSON.parse(config);
    let excel_config = config_data.Excel;
    hdbURL = config_data.Database.hdbURL + ".json?";
    cdpURL = config_data.Database.cdpURL;

    //Excel configuration setting
    startHeaders = excel_config.start_headers;
    startComponentHeaders = excel_config.start_component_headers;
    startSearchColCode = excel_config.start_search_col_code;
    startCompColCode = excel_config.start_component_col_code;
    start_update_col = excel_config.start_update_col;
    end_update_col = excel_config.end_update_col;
    search_cols.push(convert_string_to_array(excel_config.search_col_names_and_values));
    search_props = convert_string_to_array(excel_config.search_prop_names);
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
