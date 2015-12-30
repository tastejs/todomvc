/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides enumeration sap.ui.model.FilterType
sap.ui.define(function() {
	"use strict";


	/**
	* Operators for the Filter.
	*
	* @namespace
	* @public
	* @alias sap.ui.model.FilterType
	*/
	var FilterType = {
			/**
			 * Filters which are changed by the application
			 * @public
			 */
			Application: "Application",
	
			/**
			 * Filters which are set by the different controls
			 * @public
			 */
			Control: "Control"
	};

	return FilterType;

}, /* bExport= */ true);
