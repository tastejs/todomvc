/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides enumeration sap.ui.table.TreeAutoExpandMode
sap.ui.define(['jquery.sap.global'],
	function(jQuery) {
	"use strict";


	/**
	* @class
	* Different modes for setting the auto expand mode on different tables (Analytical-, TreeTable, ...)
	*
	* @static
	* @public
	* @alias sap.ui.table.TreeAutoExpandMode
	*/
	var TreeAutoExpandMode = {
			/**
			 * Tree nodes will be expanded in sequence, level by level (Single requests are sent)
			 * @public
			 */
			Sequential: "Sequential",
	
			/**
			 * If supported by a backend provider with analytical capabilities, the requests needed for an automatic node expansion are bundled.
			 * @public
			 */
			Bundled: "Bundled"
	};

	return TreeAutoExpandMode;

}, /* bExport= */ true);