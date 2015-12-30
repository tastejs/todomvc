/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.m.ViewSettingsCustomItem.
sap.ui.define(['jquery.sap.global', './ViewSettingsItem', './library'],
	function(jQuery, ViewSettingsItem, library) {
	"use strict";



	/**
	 * Constructor for a new ViewSettingsCustomItem.
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * The ViewSettingsCustomItem control is used for modelling custom filters in the ViewSettingsDialog.
	 * @extends sap.m.ViewSettingsItem
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @since 1.16
	 * @alias sap.m.ViewSettingsCustomItem
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var ViewSettingsCustomItem = ViewSettingsItem.extend("sap.m.ViewSettingsCustomItem", /** @lends sap.m.ViewSettingsCustomItem.prototype */ { metadata : {

		library : "sap.m",
		properties : {

			/**
			 * The number of currently active filters for this custom filter item. It will be displayed in the filter list of the ViewSettingsDialog to represent the filter state of the custom control.
			 */
			filterCount : {type : "int", group : "Behavior", defaultValue : 0}
		},
		aggregations : {

			/**
			 * A custom control for the filter field. It can be used for complex filtering mechanisms.
			 */
			customControl : {type : "sap.ui.core.Control", multiple : false}
		}
	}});

	/**
	 * Destroys the control.
	 * @private
	 */
	ViewSettingsCustomItem.prototype.exit = function () {
		if (this._control && !this._control.getParent()) {
			// control is not aggregated, so we have to destroy it
			this._control.destroy();
			delete this._control;
		}
	};

	/**
	 * Internally the control is handled as a managed object instead of an aggregation
	 * as this control is sometimes aggregated in other controls like a popover or a dialog.
	 * @override
	 * @public
	 * @param {sap.ui.core.Control} oControl A control used for filtering purposes
	 * @return {sap.m.ViewSettingsCustomItem} this pointer for chaining
	 */
	ViewSettingsCustomItem.prototype.setCustomControl = function (oControl) {
		this._control = oControl;
		return this;
	};

	/**
	 * Internally the control is handled as a managed object instead of an aggregation
	 * because this control is sometimes aggregated in other controls like a popover or a dialog.
	 * @override
	 * @public
	 * @return {sap.ui.core.Control} oControl a control used for filtering purposes
	 */
	ViewSettingsCustomItem.prototype.getCustomControl = function () {
		return this._control;
	};

	/**
	 * Sets the filterCount without invalidating the control as it is never rendered directly.
	 * @override
	 * @param {integer} iValue The new value for property filterCount
	 * @public
	 * @return {sap.m.ViewSettingsItem} this pointer for chaining
	 */
	ViewSettingsCustomItem.prototype.setFilterCount = function (iValue) {
		this.setProperty("filterCount", iValue, true);
		return this;
	};

	/**
	 * Sets the selected property without invalidating the control as it is never rendered directly.
	 * @override
	 * @param {boolean} bValue The new value for property selected
	 * @public
	 * @return {sap.m.ViewSettingsItem} this pointer for chaining
	 */
	ViewSettingsCustomItem.prototype.setSelected = function (bValue) {
		this.setProperty("selected", bValue, true);
		return this;
	};


	return ViewSettingsCustomItem;

}, /* bExport= */ true);
