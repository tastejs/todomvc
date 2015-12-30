/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.m.ToolbarSeparator.
sap.ui.define(['jquery.sap.global', './library', 'sap/ui/core/Control'],
	function(jQuery, library, Control) {
	"use strict";


	
	/**
	 * Constructor for a new ToolbarSeparator.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * Creates a visual separator (theme dependent: padding, margin, line) between the preceding and succeeding toolbar item.
	 * @extends sap.ui.core.Control
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @since 1.26
	 * @alias sap.m.ToolbarSeparator
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var ToolbarSeparator = Control.extend("sap.m.ToolbarSeparator", /** @lends sap.m.ToolbarSeparator.prototype */ { metadata : {
	
		library : "sap.m"
	}});

	return ToolbarSeparator;

}, /* bExport= */ true);
