/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.commons.MenuTextFieldItem.
sap.ui.define(['jquery.sap.global', './MenuItemBase', './library', 'sap/ui/unified/MenuTextFieldItem'],
	function(jQuery, MenuItemBase, library, MenuTextFieldItem1) {
	"use strict";


	
	/**
	 * Constructor for a new MenuTextFieldItem element.
	 *
	 * @param {string} [sId] Id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * Special menu item which contains a label and a text field. This menu item is e.g. helpful for filter implementations.
	 * The aggregation <code>submenu</code> (inherited from parent class) is not supported for this type of menu item.
	 * @extends sap.ui.unified.MenuTextFieldItem
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @deprecated Since version 1.21.0. 
	 * Please use the control <code>sap.ui.unified.MenuTextFieldItem</code> of the library <code>sap.ui.unified</code> instead.
	 * @alias sap.ui.commons.MenuTextFieldItem
	 * @ui5-metamodel This control/element will also be described in the UI5 (legacy) design time meta model
	 */
	var MenuTextFieldItem = MenuTextFieldItem1.extend("sap.ui.commons.MenuTextFieldItem", /** @lends sap.ui.commons.MenuTextFieldItem.prototype */ { metadata : {
	
		deprecated : true,
		library : "sap.ui.commons"
	}});
	
	/*Ensure MenuItemBase is loaded (incl. loading of unified library)*/

	return MenuTextFieldItem;

}, /* bExport= */ true);
