/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.commons.layout.HorizontalLayout.
sap.ui.define(['jquery.sap.global', 'sap/ui/commons/library', 'sap/ui/layout/HorizontalLayout'],
	function(jQuery, library, HorizontalLayout1) {
	"use strict";


	
	/**
	 * Constructor for a new layout/HorizontalLayout.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * A layout that provides support for horizontal alignment of controls
	 * @extends sap.ui.layout.HorizontalLayout
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @alias sap.ui.commons.layout.HorizontalLayout
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var HorizontalLayout = HorizontalLayout1.extend("sap.ui.commons.layout.HorizontalLayout", /** @lends sap.ui.commons.layout.HorizontalLayout.prototype */ { metadata : {
	
		library : "sap.ui.commons"
	}});
	
	

	return HorizontalLayout;

}, /* bExport= */ true);
