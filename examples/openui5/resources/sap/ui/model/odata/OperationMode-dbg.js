/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides enumeration sap.ui.model.OperationMode
sap.ui.define(function() {
	"use strict";


	/**
	* @class
	* Different modes for executing service operations (filtering, sorting)
	*
	* @static
	* @public
	* @alias sap.ui.model.odata.OperationMode
	*/
	var OperationMode = {
			/**
			 * Operations are executed on the Odata service, by appending corresponding URL parameters ($filter, $orderby).
			 * Each change in filtering or sorting is triggering a new request to the server.
			 * @public
			 */
			Server: "Server",
			
			/**
			 * Operations are executed on the client, all entries must be avilable to be able to do so.
			 * The initial request fetches the complete collection, filtering and sorting does not trigger further requests
			 * @public
			 */
			Client: "Client",
			
			/**
			 * With OperationMode "Auto", operations are either processed on the client or on the server, depending on the given binding threshold.
			 * Please be aware, that the combination of OperationMode.Auto and CountMode.None is not supported.
			 * 
			 * There are two possibilities which can happen, when using the "Auto" mode, depending on the configured "CountMode":
			 * 1. CountMode "Request" and "Both"
			 * Initially the binding will issue a $count request without any filters/sorters.
			 * a) If the count is lower or equal to the threshold, the binding will behave like in operation mode "Client", and a data request for all entries is issued.
			 * b) If the count exceeds the threshold, the binding will behave like in operation mode "Server".
			 * 
			 * 2. CountModes "Inline" or "InlineRepeat"
			 * The initial request tries to fetch as many entries as the configured threshold, without any filters/sorters. In addition a $inlinecount is added.
			 * The binding assumes, that the threshold given by the application can be met. If this is not the case additional data requests might be needed.
			 * So the application has to have the necessary confidence that the threshold is high enough to make sure, that the data is not requested twice.
			 * 
			 * a) If this request returns fewer (or just as many) entries as the threshold, the binding will behave exactly like when using 
			 * the "Client" operation mode. Initially configured filters/sorters will be applied afterwards on the client.
			 * b) If the $inlinecount is higher than the threshold, the binding will behave like in operation mode "Server". In this case a new data request
			 * containing the initially set filters/sorters will be issued. 
			 * @public
			 */
			Auto: "Auto"
	};

	return OperationMode;

}, /* bExport= */ true);
