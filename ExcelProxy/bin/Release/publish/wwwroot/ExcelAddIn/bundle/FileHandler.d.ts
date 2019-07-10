declare module FileHandler
{
	let hdbURL: any, cdpURL: any;
	export { hdbURL, cdpURL };
	export function set_urls(config_data: any): void;
	export function convert_string_to_array(str: any): any;
	export function initializeMessageBanner(): void;
	export function empty(data: any): boolean;
	export function excelHandler(action: any): Promise<void>;
	export function errorHandler(error: any): void;
	export function showNotification(header: any, content: any): void;

	let startHeaders: number;
	let startComponentHeaders: number;
	let search_cols: any[];
	let component_cols: any[];
	let startSearchColName: any;
	let endSearchColName: any;
	let startCompColName: any;
	let endCompColName: any;
	export { startSearchColName, endSearchColName, startHeaders, startCompColName, startComponentHeaders, endCompColName, search_cols, component_cols };
	export function set_compopnents_configuration(excel_config: any): void;
	export function loadComponentsDetail(): Promise<void>;
	export function updateComponents(): Promise<void>;

	export function asyncLoadJSONFile(file: any, callback: any): void;
	export function loadExcelFile(file: string): unknown[];

	/// <reference path="bundle/FileHandler.d.ts" />
	export {};

}