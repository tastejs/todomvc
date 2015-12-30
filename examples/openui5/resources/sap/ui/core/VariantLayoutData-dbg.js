/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.core.VariantLayoutData.
sap.ui.define(['./LayoutData', './library'],
	function(LayoutData, library) {
	"use strict";


	
	/**
	 * Constructor for a new VariantLayoutData.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * Allows to add multiple LayoutData to one control in case that a easy switch of layouts (e.g. in a Form) is needed.
	 * @extends sap.ui.core.LayoutData
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @since 1.9.2
	 * @alias sap.ui.core.VariantLayoutData
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var VariantLayoutData = LayoutData.extend("sap.ui.core.VariantLayoutData", /** @lends sap.ui.core.VariantLayoutData.prototype */ { metadata : {
	
		library : "sap.ui.core",
		aggregations : {
	
			/**
			 * Allows multiple LayoutData.
			 */
			multipleLayoutData : {type : "sap.ui.core.LayoutData", multiple : true, singularName : "multipleLayoutData"}
		}
	}});
	
	

	return VariantLayoutData;

});
