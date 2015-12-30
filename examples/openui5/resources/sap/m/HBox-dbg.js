/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.m.HBox.
sap.ui.define(['jquery.sap.global', './FlexBox', './library'],
	function(jQuery, FlexBox, library) {
	"use strict";


	
	/**
	 * Constructor for a new HBox.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * The HBox control builds the container for a horizontal flexible box layout. HBox is a convenience control as it is just a specialized FlexBox control.
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
	 * @alias sap.m.HBox
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var HBox = FlexBox.extend("sap.m.HBox", /** @lends sap.m.HBox.prototype */ { metadata : {
	
		library : "sap.m"
	}});
	
	

	return HBox;

}, /* bExport= */ true);
