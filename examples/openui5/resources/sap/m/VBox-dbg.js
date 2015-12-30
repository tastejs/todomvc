/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.m.VBox.
sap.ui.define(['jquery.sap.global', './FlexBox', './library'],
	function(jQuery, FlexBox, library) {
	"use strict";


	
	/**
	 * Constructor for a new VBox.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * The VBox control builds the container for a vertical flexible box layout. VBox is a convenience control as it is just a specialized FlexBox control.
	 * 
	 * Browser support:
	 * This control is not supported in Internet Explorer 9!
	 * @extends sap.m.FlexBox
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @alias sap.m.VBox
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var VBox = FlexBox.extend("sap.m.VBox", /** @lends sap.m.VBox.prototype */ { metadata : {
	
		library : "sap.m"
	}});
	
	

	return VBox;

}, /* bExport= */ true);
