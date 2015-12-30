/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.m.ToolbarSpacer.
sap.ui.define(['jquery.sap.global', './library', 'sap/ui/core/Control'],
	function(jQuery, library, Control) {
	"use strict";


	
	/**
	 * Constructor for a new ToolbarSpacer.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * This control can be used to add horizontal space between toolbar items.
	 * Note: ToolbarLayoutData should not be used with this control.
	 * @extends sap.ui.core.Control
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @since 1.16
	 * @alias sap.m.ToolbarSpacer
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var ToolbarSpacer = Control.extend("sap.m.ToolbarSpacer", /** @lends sap.m.ToolbarSpacer.prototype */ { metadata : {
	
		library : "sap.m",
		properties : {
	
			/**
			 * Defines the width of the horizontal space.
			 * Note: Empty("") value makes the space flexible which means it covers the remaining space between toolbar items.
			 * This feature can be used to push next item to the edge of the toolbar.
			 */
			width : {type : "sap.ui.core.CSSSize", group : "Appearance", defaultValue : ''}
		}
	}});
	
	/**
	 * Flexible Spacer Class Name
	 * @protected
	 */
	ToolbarSpacer.flexClass = "sapMTBSpacerFlex";

	return ToolbarSpacer;

}, /* bExport= */ true);
