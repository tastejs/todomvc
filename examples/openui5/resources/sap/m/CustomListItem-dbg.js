/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.m.CustomListItem.
sap.ui.define(['jquery.sap.global', './ListItemBase', './library'],
	function(jQuery, ListItemBase, library) {
	"use strict";


	
	/**
	 * Constructor for a new CustomListItem.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * This control with a content aggregation can be used to customize standard list items that we don't provide. List mode and ListItem type are applied to CustomListItems as well.
	 * Note: Even the content aggregation allows any control, complex responsive layout controls (e.g. Table, Form) should not be aggregated as content.
	 * 
	 * @extends sap.m.ListItemBase
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @alias sap.m.CustomListItem
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var CustomListItem = ListItemBase.extend("sap.m.CustomListItem", /** @lends sap.m.CustomListItem.prototype */ { metadata : {
	
		library : "sap.m",
		defaultAggregation : "content",
		aggregations : {
	
			/**
			 * The content of this list item
			 */
			content : {type : "sap.ui.core.Control", multiple : true, singularName : "content", bindable : "bindable"}
		}
	}});
	
	
	

	return CustomListItem;

}, /* bExport= */ true);
