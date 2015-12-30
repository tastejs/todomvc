/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.commons.form.GridContainerData.
sap.ui.define(['jquery.sap.global', 'sap/ui/commons/library', 'sap/ui/layout/form/GridContainerData'],
	function(jQuery, library, GridContainerData1) {
	"use strict";


	
	/**
	 * Constructor for a new form/GridContainerData.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * Grid layout specific properties for FormContainers.
	 * The width and height properties of the elements are ignored since the witdh and heights are defined by the grid cells.
	 * @extends sap.ui.layout.form.GridContainerData
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @since 1.9.1
	 * @deprecated Since version 1.16.0. 
	 * moved to sap.ui.layout library. Please use this one.
	 * @alias sap.ui.commons.form.GridContainerData
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var GridContainerData = GridContainerData1.extend("sap.ui.commons.form.GridContainerData", /** @lends sap.ui.commons.form.GridContainerData.prototype */ { metadata : {
	
		deprecated : true,
		library : "sap.ui.commons"
	}});
	
	///**
	// * This file defines behavior for the control, 
	// */
	//sap.ui.commons.form.GridLayoutdata.prototype.init = function(){
	//   // do something for initialization...
	//};
	

	return GridContainerData;

}, /* bExport= */ true);
