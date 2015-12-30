/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.commons.layout.VerticalLayout.
sap.ui.define(['jquery.sap.global', 'sap/ui/commons/library', 'sap/ui/layout/VerticalLayout'],
	function(jQuery, library, VerticalLayout1) {
	"use strict";


	
	/**
	 * Constructor for a new layout/VerticalLayout.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * In this layout the elemnts are orderd one below the other
	 * @extends sap.ui.layout.VerticalLayout
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @deprecated Since version 1.16.0. 
	 * Moved to sap.ui.layout library. Please use this one.
	 * @alias sap.ui.commons.layout.VerticalLayout
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var VerticalLayout = VerticalLayout1.extend("sap.ui.commons.layout.VerticalLayout", /** @lends sap.ui.commons.layout.VerticalLayout.prototype */ { metadata : {
	
		deprecated : true,
		library : "sap.ui.commons"
	}});
	
	

	return VerticalLayout;

}, /* bExport= */ true);
