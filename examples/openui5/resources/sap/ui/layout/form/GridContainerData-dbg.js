/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.layout.form.GridContainerData.
sap.ui.define(['jquery.sap.global', 'sap/ui/core/LayoutData', 'sap/ui/layout/library'],
	function(jQuery, LayoutData, library) {
	"use strict";

	/**
	 * Constructor for a new sap.ui.layout.form.GridContainerData.
	 *
	 * @param {string} [sId] Id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * <code>GridLayout</code>-specific properties for <code>FormContainers</code>.
	 * @extends sap.ui.core.LayoutData
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @since 1.16.0
	 * @alias sap.ui.layout.form.GridContainerData
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var GridContainerData = LayoutData.extend("sap.ui.layout.form.GridContainerData", /** @lends sap.ui.layout.form.GridContainerData.prototype */ { metadata : {

		library : "sap.ui.layout",
		properties : {

			/**
			 * If set, the container takes half the width of the <code>Form</code> (8 cells), if not it takes the full width (16 cells).
			 * If the <code>GridLayout</code> is set to <code>singleColumn</code>, the full width of the grid is only 8 cells. So containers are rendered only once per row.
			 */
			halfGrid : {type : "boolean", group : "Misc", defaultValue : false}
		}
	}});

	///**
	// * This file defines behavior for the control, 
	// */
	//sap.ui.commons.form.GridLayoutdata.prototype.init = function(){
	//   // do something for initialization...
	//};

	return GridContainerData;

}, /* bExport= */ true);
