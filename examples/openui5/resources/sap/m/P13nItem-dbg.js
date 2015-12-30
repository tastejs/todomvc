/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.m.P13nItem.
sap.ui.define(['jquery.sap.global', './library', 'sap/ui/core/Element'], function(jQuery, library, Element) {
	"use strict";

	/**
	 * Constructor for a new P13nItem.
	 * 
	 * @param {string}
	 *          [sId] id for the new control, generated automatically if no id is given
	 * @param {object}
	 *          [mSettings] initial settings for the new control
	 * 
	 * @class Base type for <code>items</code> aggregation in P13nPanel control.
	 * @extends sap.ui.core.Item
	 * @version 1.32.9
	 * 
	 * @constructor
	 * @public
	 * @since 1.26.0
	 * @alias sap.m.P13nItem
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var P13nItem = Element.extend("sap.m.P13nItem", /** @lends sap.m.P13nItem.prototype */
	{
		metadata : {

			library : "sap.m",
			properties : {
				/**
				 * Can be used as input for subsequent actions.
				 * @since 1.26.0
				 */
				columnKey : {
					type : "string",
					group : "Data",
					defaultValue : null
				},
				/**
				 * The text to be displayed for the item.
				 * @since 1.26.0
				 */
				text : {
					type : "string",
					group : "Misc",
					defaultValue : ""
				},

				/**
				 * Defines visibility of column
				 * @since 1.26.0
				 */
				visible : {
					type : "boolean",
					group : "Misc",
					defaultValue : null
				},

				/**
				 * data type of the column (text, numeric or date is supported)
				 * @since 1.26.0
				 */
				type : {
					type : "string",
					group : "Misc",
					defaultValue : "text"
				},

				/**
				 * if type==numeric the precision will be used to format the entered value (maxIntegerDigits  of the used Formatter)
				 * @since 1.26.0
				 */
				precision : {
					type : "string",
					group : "Misc",
					defaultValue : null
				},

				/**
				 * if type==numeric the scale will be used to format the entered value (maxFractionDigits of the used Formatter)
				 * @since 1.26.0
				 */
				scale : {
					type : "string",
					group : "Misc",
					defaultValue : null
				},

				/**
				 * specifies the number of characters which can be entered in the value fields of the condition panel
				 * @since 1.26.0  
				 */
				maxLength : {
					type : "string",
					group : "Misc",
					defaultValue : null
				},
				
				/**
				 * Defines column width
				 * @since 1.26.0
				 */
				width : {
					type : "string",
					group : "Misc",
					defaultValue : null
				},
				
				/**
				 * the column with isDefault==true will be used as the selected column item on the conditionPanel
				 * @since 1.26.0 
				 */
				isDefault : {
					type : "boolean",
					group : "Misc",
					defaultValue : false					
				}
			}
		}
	});


	return P13nItem;

}, /* bExport= */true);
