/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.m.DisplayListItem.
sap.ui.define(['jquery.sap.global', './ListItemBase', './library'],
	function(jQuery, ListItemBase, library) {
	"use strict";


	/**
	 * Constructor for a new DisplayListItem.
	 *
	 * @param {string} [sId] Id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * <code>sap.m.DisplayListItem</code> can be used to represent a label and a value.
	 * @extends sap.m.ListItemBase
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @alias sap.m.DisplayListItem
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var DisplayListItem = ListItemBase.extend("sap.m.DisplayListItem", /** @lends sap.m.DisplayListItem.prototype */ { metadata : {
	
		library : "sap.m",
		properties : {
	
			/**
			 * Defines the label of the list item.
			 */
			label : {type : "string", group : "Misc", defaultValue : null},
	
			/**
			 * Defines the value of the list item.
			 */
			value : {type : "string", group : "Data", defaultValue : null},

			/**
			 * Defines the <code>value</code> text directionality with enumerated options. By default, the control inherits text direction from the DOM.
			 * @since 1.28.0
			 */
			valueTextDirection : {type : "sap.ui.core.TextDirection", group : "Appearance", defaultValue : sap.ui.core.TextDirection.Inherit}
		}
	}});

	return DisplayListItem;

}, /* bExport= */ true);
