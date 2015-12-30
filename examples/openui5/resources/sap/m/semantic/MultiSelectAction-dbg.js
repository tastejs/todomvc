/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(['sap/m/semantic/SemanticToggleButton'], function(SemanticToggleButton) {
	"use strict";

	/**
	 * Constructor for a new MultiSelectAction.
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Custom initial settings for the new control
	 *
	 * @class
	 * A MultiSelectAction button has default semantic-specific properties and is
	 * eligible for aggregation content of a {@link sap.m.semantic.SemanticPage}.
	 *
	 * @extends sap.m.semantic.SemanticToggleButton
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @since 1.30.0
	 * @alias sap.m.semantic.MultiSelectAction
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */

	var MultiSelectAction = SemanticToggleButton.extend("sap.m.semantic.MultiSelectAction", /** @lends sap.m.semantic.MultiSelectAction.prototype */ {

	});

	/**
	 * Defines the icon url for each state
	 * @private
	 */
	MultiSelectAction.prototype._PRESSED_STATE_TO_ICON_MAP = {
		"true": "sap-icon://sys-cancel",
		"false": "sap-icon://multi-select"
	};

	/**
	 * Sets the 'pressed' property value.
	 * Overwrites to apply semantic-specific logic
	 * @Overwrites
	 * @private
	 */
	MultiSelectAction.prototype._setPressed = function(bPressed, bSuppressInvalidate) {
		var sIconUrl = MultiSelectAction.prototype._PRESSED_STATE_TO_ICON_MAP[bPressed];
		this._getControl().setIcon(sIconUrl);
	};

	return MultiSelectAction;
}, /* bExport= */ true);
