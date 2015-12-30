/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.m.InputListItem.
sap.ui.define(['jquery.sap.global', './ListItemBase', './library'],
	function(jQuery, ListItemBase, library) {
	"use strict";


	
	/**
	 * Constructor for a new InputListItem.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * List item should be used for a label and an input field.
	 * @extends sap.m.ListItemBase
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @alias sap.m.InputListItem
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var InputListItem = ListItemBase.extend("sap.m.InputListItem", /** @lends sap.m.InputListItem.prototype */ { metadata : {
	
		library : "sap.m",
		properties : {
	
			/**
			 * Label of the list item
			 */
			label : {type : "string", group : "Misc", defaultValue : null},
	
			/**
			 * This property specifies the label text directionality with enumerated options. By default, the label inherits text direction from the DOM.
			 * @since 1.30.0
			 */
			labelTextDirection : {type : "sap.ui.core.TextDirection", group : "Appearance", defaultValue : sap.ui.core.TextDirection.Inherit}
		},
		defaultAggregation : "content",
		aggregations : {
	
			/**
			 * Content controls can be added
			 */
			content : {type : "sap.ui.core.Control", multiple : true, singularName : "content", bindable : "bindable"}
		}
	}});
	
	

	return InputListItem;

}, /* bExport= */ true);
