/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.ux3.NavigationItem.
sap.ui.define(['jquery.sap.global', 'sap/ui/core/Item', './library'],
	function(jQuery, Item, library) {
	"use strict";


	
	/**
	 * Constructor for a new NavigationItem.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * Is the item to be used within the NavigationBar
	 * @extends sap.ui.core.Item
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @alias sap.ui.ux3.NavigationItem
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var NavigationItem = Item.extend("sap.ui.ux3.NavigationItem", /** @lends sap.ui.ux3.NavigationItem.prototype */ { metadata : {
	
		library : "sap.ui.ux3",
		properties : {
	
			/**
			 * Whether the NavigationItem is currently visible. When making NavigationItems invisible at runtime it is the application's responsibility to make sure it is not the currently selected one - or to select another one in this case.
			 * @since 1.9.0
			 */
			visible : {type : "boolean", group : "Appearance", defaultValue : true},
	
			/**
			 * Defines the link target URL. This property is optional and should only be set when required!
			 * The use of the href property is to not only allow users to navigate in-place by left-clicking NavigationItems, but also to allow right-click and then "open in new tab" or "open in new window". As long as href is not set, an empty window will open and stay blank. But when href is set, the new window/tab will load this URL and it is the application's responsibility to display what the user expects (e.g. the Shell, with the respective NavigationItem being selected).
			 */
			href : {type : "sap.ui.core.URI", group : "Behavior", defaultValue : null}
		},
		defaultAggregation : "subItems",
		aggregations : {
	
			/**
			 * Any NavigationItems on the next hierarchy level connected to this NavigationItem
			 */
			subItems : {type : "sap.ui.ux3.NavigationItem", multiple : true, singularName : "subItem"}
		}
	}});
	
	

	return NavigationItem;

}, /* bExport= */ true);
