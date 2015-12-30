/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.m.ToolbarLayoutData.
sap.ui.define(['jquery.sap.global', './library', 'sap/ui/core/LayoutData'],
	function(jQuery, library, LayoutData) {
	"use strict";



	/**
	 * Constructor for a new ToolbarLayoutData.
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * Defines layout data for the toolbar items.
	 * @extends sap.ui.core.LayoutData
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @since 1.20
	 * @alias sap.m.ToolbarLayoutData
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var ToolbarLayoutData = LayoutData.extend("sap.m.ToolbarLayoutData", /** @lends sap.m.ToolbarLayoutData.prototype */ { metadata : {

		library : "sap.m",
		properties : {

			/**
			 * Determines whether the control, when in a toolbar, is shrinkable or not. For controls with fixed width (100px, 5rem, etc...) this property is ignored.
			 *
			 * Note: Nested layout controls should not be shrinkable.
			 */
			shrinkable : {type : "boolean", group : "Behavior", defaultValue : false},

			/**
			 * Sets the minimum width of the toolbar item.
			 */
			minWidth : {type : "sap.ui.core.CSSSize", group : "Dimension", defaultValue : null},

			/**
			 * Sets the maximum width of the toolbar item.
			 */
			maxWidth : {type : "sap.ui.core.CSSSize", group : "Dimension", defaultValue : null}
		}
	}});

	/*
	 * Returns the parent's live style object from DOM.
	 * Here the parent is the control who is setting the layout data
	 *
	 * @returns {Object}
	 * @protected
	 */
	ToolbarLayoutData.prototype.getParentStyle = function() {
		var oParent = this.getParent();
		if (!oParent || !oParent.getDomRef) {
			return {};
		}

		var oDomRef = oParent.getDomRef();
		return oDomRef ? oDomRef.style : {};
	};

	/*
	 * If the control that is using ToolbarLayoutData has been already rendered,
	 * then this function can be used to apply layout data properties to the related control
	 *
	 * @returns {sap.m.ToolbarLayoutData}
	 * @protected
	 */
	ToolbarLayoutData.prototype.applyProperties = function() {
		var oStyle = this.getParentStyle();
		oStyle.minWidth = this.getMinWidth();
		oStyle.maxWidth = this.getMaxWidth();
		return this;
	};

	return ToolbarLayoutData;

}, /* bExport= */ true);
