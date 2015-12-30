/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.commons.ResponsiveContainerRange.
sap.ui.define(['jquery.sap.global', './library', 'sap/ui/core/Control'],
	function(jQuery, library, Control) {
	"use strict";


	
	/**
	 * Constructor for a new ResponsiveContainerRange.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * Defines a range for the ResponsiveContainer
	 * @extends sap.ui.core.Control
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @alias sap.ui.commons.ResponsiveContainerRange
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var ResponsiveContainerRange = Control.extend("sap.ui.commons.ResponsiveContainerRange", /** @lends sap.ui.commons.ResponsiveContainerRange.prototype */ { metadata : {
	
		library : "sap.ui.commons",
		properties : {
	
			/**
			 * The minimal width for this range to be displayed.
			 */
			width : {type : "sap.ui.core.CSSSize", group : "Dimension", defaultValue : ''},
	
			/**
			 * The minimal height for this range to be displayed.
			 */
			height : {type : "sap.ui.core.CSSSize", group : "Dimension", defaultValue : ''},
	
			/**
			 * A key which can be used to identify the range (optional).
			 */
			key : {type : "string", group : "Misc", defaultValue : ''}
		},
		associations : {
	
			/**
			 * The content to show for this range (optional).
			 */
			content : {type : "sap.ui.core.Control", multiple : false}
		}
	}});
	
	

	return ResponsiveContainerRange;

}, /* bExport= */ true);
