/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.commons.form.GridElementData.
sap.ui.define(['jquery.sap.global', 'sap/ui/commons/library', 'sap/ui/layout/form/GridElementData'],
	function(jQuery, library, GridElementData1) {
	"use strict";


	
	/**
	 * Constructor for a new form/GridElementData.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * The grid specific layout data for FormElement fields.
	 * The width property of the elements is ignored since the width is defined by grid cells.
	 * @extends sap.ui.layout.form.GridElementData
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @since 1.9.1
	 * @deprecated Since version 1.16.0. 
	 * moved to sap.ui.layout library. Please use this one.
	 * @alias sap.ui.commons.form.GridElementData
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var GridElementData = GridElementData1.extend("sap.ui.commons.form.GridElementData", /** @lends sap.ui.commons.form.GridElementData.prototype */ { metadata : {
	
		deprecated : true,
		library : "sap.ui.commons"
	}});
	
	///**
	// * This file defines behavior for the control, 
	// */
	//sap.ui.commons.form.GridElementData.prototype.init = function(){
	//   // do something for initialization...
	//};
	

	return GridElementData;

}, /* bExport= */ true);
