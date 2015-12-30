/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.layout.SplitterLayoutData.
sap.ui.define(['jquery.sap.global', 'sap/ui/core/LayoutData', './library'],
	function(jQuery, LayoutData, library) {
	"use strict";


	
	/**
	 * Constructor for a new SplitterLayoutData.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * Holds layout data for the splitter contents.
	 * Allowed size values are numeric values ending in "px" and "%" and the
	 * special case "auto".
	 * (The CSS value "auto" is used internally to recalculate the size of the content
	 * dynamically and is not directly set as style property.)
	 * @extends sap.ui.core.LayoutData
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @since 1.22.0
	 * @experimental Since version 1.22.0. 
	 * API is not yet finished and might change completely
	 * @alias sap.ui.layout.SplitterLayoutData
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var SplitterLayoutData = LayoutData.extend("sap.ui.layout.SplitterLayoutData", /** @lends sap.ui.layout.SplitterLayoutData.prototype */ { metadata : {
	
		library : "sap.ui.layout",
		properties : {
	
			/**
			 * Determines whether the control in the splitter can be resized or not.
			 */
			resizable : {type : "boolean", group : "Behavior", defaultValue : true},
	
			/**
			 * Sets the size of the splitter content.
			 */
			size : {type : "sap.ui.core.CSSSize", group : "Dimension", defaultValue : 'auto'},
	
			/**
			 * Sets the minimum size of the splitter content in px.
			 */
			minSize : {type : "int", group : "Dimension", defaultValue : 0}
		}
	}});
	
	/*** NOTHING ***/

	return SplitterLayoutData;

}, /* bExport= */ true);
