/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.commons.Menu.
sap.ui.define(['jquery.sap.global', './MenuItemBase', './library', 'sap/ui/unified/Menu'],
	function(jQuery, MenuItemBase, library, Menu1) {
	"use strict";


	
	/**
	 * Constructor for a new Menu control.
	 *
	 * @param {string} [sId] Id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * A menu is an interactive element which provides a choice of different actions to the user. These actions (items) can also be organized in submenus.
	 * Like other dialog-like controls, the menu is not rendered within the control hierarchy. Instead it can be opened at a specified position via a function call. 
	 * @extends sap.ui.unified.Menu
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 * @since 1.0.0
	 *
	 * @constructor
	 * @public
	 * @deprecated Since version 1.21.0. 
	 * Please use the control sap.ui.unified.Menu of the library sap.ui.unified instead.
	 * @alias sap.ui.commons.Menu
	 * @ui5-metamodel This control/element will also be described in the UI5 (legacy) design time meta model
	 */
	var Menu = Menu1.extend("sap.ui.commons.Menu", /** @lends sap.ui.commons.Menu.prototype */ { metadata : {
	
		deprecated : true,
		library : "sap.ui.commons"
	}});
	
	Menu.prototype.bCozySupported = false;
	
	/*Ensure MenuItemBase is loaded (incl. loading of unified library)*/

	return Menu;

}, /* bExport= */ true);
