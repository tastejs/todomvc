/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.commons.RowRepeaterSorter.
sap.ui.define(['jquery.sap.global', './library', 'sap/ui/core/Element'],
	function(jQuery, library, Element) {
	"use strict";


	
	/**
	 * Constructor for a new RowRepeaterSorter.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * This element is used by the RowRepeater and allows to define a sorter in this context along with the related data such as a text and an icon.
	 * @extends sap.ui.core.Element
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @alias sap.ui.commons.RowRepeaterSorter
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var RowRepeaterSorter = Element.extend("sap.ui.commons.RowRepeaterSorter", /** @lends sap.ui.commons.RowRepeaterSorter.prototype */ { metadata : {
	
		library : "sap.ui.commons",
		properties : {
	
			/**
			 * The sorter title if needed for display.
			 */
			text : {type : "string", group : "Appearance", defaultValue : null},
	
			/**
			 * The sorter icon if needed for display.
			 */
			icon : {type : "string", group : "Appearance", defaultValue : null},
	
			/**
			 * The sorter object.
			 */
			sorter : {type : "object", group : "Data", defaultValue : null}
		}
	}});
	
	///**
	// * This file defines behavior for the control,
	// */
	//sap.ui.commons.RowRepeaterSorter.prototype.init = function(){
	//   // do something for initialization...
	//};

	return RowRepeaterSorter;

}, /* bExport= */ true);
