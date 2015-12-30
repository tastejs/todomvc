/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.m.List.
sap.ui.define(['jquery.sap.global', './ListBase', './library'],
	function(jQuery, ListBase, library) {
	"use strict";


	
	/**
	 * Constructor for a new List.
	 *
	 * @param {string} [sId] Id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * The List control provides a container for all types of list items.
	 * For mobile devices, the recommended limit of list items is 100 to assure proper performance. To improve initial rendering of large lists, use the "growing" feature. Please refer to the SAPUI5 Developer Guide for more information..
	 * @extends sap.m.ListBase
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @alias sap.m.List
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var List = ListBase.extend("sap.m.List", /** @lends sap.m.List.prototype */ { metadata : {
	
		library : "sap.m",
		properties : {
	
			/**
			 * Sets the background style of the list. Depending on the theme, you can change the state of the background from <code>Solid</code> to <code>Translucent</code> or to <code>Transparent</code>.
			 * @since 1.14
			 */
			backgroundDesign : {type : "sap.m.BackgroundDesign", group : "Appearance", defaultValue : sap.m.BackgroundDesign.Solid}
		},
		aggregations : {
	
			/**
			 * Defines columns of the list.
			 * @deprecated Since version 1.16. Instead, use the <code>sap.m.Table</code> control.
			 */
			columns : {type : "sap.m.Column", multiple : true, singularName : "column", deprecated: true}
		}
	}});
	
	List.prototype.onBeforeRendering = function() {
		if (ListBase.prototype.onBeforeRendering) {
			ListBase.prototype.onBeforeRendering.call(this);
		}
		
		// if "columns" aggregation is not in use or incompatible then ignore
		if (!this.getColumns().length || this._isColumnsIncompatible()) {
			return;
		}
		
		/**
		 * FIXME: Here to support old API if columns are set
		 * We are trying to extend renderer to render list as table
		 * This is so ugly and we need to get rid of it ASAP
		 */
		jQuery.sap.require("sap.m.Table");
		var proto = sap.m.Table.prototype;
		Object.keys(proto).forEach(function(key) {
			this[key] = proto[key];
		}, this);
	
		/**
		 * FIXME: Handle different default backgroundDesign value for Table
		 */
		if (!this.mProperties.hasOwnProperty("backgroundDesign")) {
			this.setBackgroundDesign("Translucent");
		}
		
	};
	
	// checks if "columns" usage is not compatible anymore
	List.prototype._isColumnsIncompatible = function() {
		return sap.ui.getCore().getConfiguration().getCompatibilityVersion("sapMListAsTable").compareTo("1.16") >= 0;
	};

	return List;

}, /* bExport= */ true);
