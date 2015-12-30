/*
 * ! UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.m.P13nGroupItem.
sap.ui.define([
	'jquery.sap.global', './library', 'sap/ui/core/Item'
], function(jQuery, library, Item) {
	"use strict";

	/**
	 * Constructor for a new P13nGroupItem.
	 * 
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 * @class Type for <code>groupItems</code> aggregation in P13nGroupPanel control.
	 * @extends sap.ui.core.Item
	 * @version 1.32.9
	 * @constructor
	 * @public
	 * @alias sap.m.P13nGroupItem
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var P13nGroupItem = Item.extend("sap.m.P13nGroupItem", /** @lends sap.m.P13nGroupItem.prototype */
	{
		metadata: {

			library: "sap.m",
			properties: {

				/**
				 * sap.m.P13nConditionOperation
				 * @since 1.28.0 
				 */
				operation: {
					type: "string",
					group: "Misc",
					defaultValue: null
				},

				/**
				 * key of the column
				 * @since 1.28.0 
				 */
				columnKey: {
					type: "string",
					group: "Misc",
					defaultValue: null
				},

				/**
				 * make the grouped column as normalcolumn visible 
				 * @since 1.28.0 
				 */
				showIfGrouped: {
					type: "boolean",
					group: "Misc",
					defaultValue: false
				}
			}
		}
	});

	return P13nGroupItem;

}, /* bExport= */true);
