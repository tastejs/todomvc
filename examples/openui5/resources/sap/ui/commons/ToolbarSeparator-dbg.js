/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.commons.ToolbarSeparator.
sap.ui.define(['jquery.sap.global', './library', 'sap/ui/core/Element'],
	function(jQuery, library, Element) {
	"use strict";


	
	/**
	 * Constructor for a new ToolbarSeparator.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * A small vertical line that is generally added to the tool bar between the items to visually separate them.
	 * @extends sap.ui.core.Element
	 * @implements sap.ui.commons.ToolbarItem
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @alias sap.ui.commons.ToolbarSeparator
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var ToolbarSeparator = Element.extend("sap.ui.commons.ToolbarSeparator", /** @lends sap.ui.commons.ToolbarSeparator.prototype */ { metadata : {
	
		interfaces : [
			"sap.ui.commons.ToolbarItem"
		],
		library : "sap.ui.commons",
		properties : {
	
			/**
			 * When set to false, there is no visual indication of separation by a vertical line but by a wider space.
			 */
			displayVisualSeparator : {type : "boolean", group : "Appearance", defaultValue : true},
	
			/**
			 * Design of the Separator.
			 */
			design : {type : "sap.ui.commons.ToolbarSeparatorDesign", group : "Misc", defaultValue : null}
		}
	}});
	
	ToolbarSeparator.prototype.getFocusDomRef = function() {
		return undefined;
	};

	return ToolbarSeparator;

}, /* bExport= */ true);
