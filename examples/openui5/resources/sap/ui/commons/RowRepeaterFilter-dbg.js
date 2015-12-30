/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.commons.RowRepeaterFilter.
sap.ui.define(['jquery.sap.global', './library', 'sap/ui/core/Element'],
	function(jQuery, library, Element) {
	"use strict";


	
	/**
	 * Constructor for a new RowRepeaterFilter.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * This element is used by the RowRepeater and allows to define a filter in this context along with the related data such as a text and an icon.
	 * @extends sap.ui.core.Element
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @alias sap.ui.commons.RowRepeaterFilter
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var RowRepeaterFilter = Element.extend("sap.ui.commons.RowRepeaterFilter", /** @lends sap.ui.commons.RowRepeaterFilter.prototype */ { metadata : {
	
		library : "sap.ui.commons",
		properties : {
	
			/**
			 * The filter title if needed for display.
			 */
			text : {type : "string", group : "Appearance", defaultValue : null},
	
			/**
			 * The filter icon if needed for display.
			 */
			icon : {type : "string", group : "Appearance", defaultValue : null},
	
			/**
			 * The set of filter objects.
			 */
			filters : {type : "object", group : "Data", defaultValue : null}
		}
	}});
	
	///**
	// * This file defines behavior for the control,
	// */
	//sap.ui.commons.RowRepeaterFilter.prototype.init = function(){
	//   // do something for initialization...
	//};

	return RowRepeaterFilter;

}, /* bExport= */ true);
