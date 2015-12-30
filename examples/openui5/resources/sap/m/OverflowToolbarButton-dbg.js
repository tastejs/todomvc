/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.m.OverflowToolbarButton.
sap.ui.define(['sap/m/Button', 'sap/m/ButtonRenderer'],
	function(Button, ButtonRenderer) {
	"use strict";



	/**
	 * Constructor for a new OverflowToolbarButton.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * OverflowToolbarButton is a version of Button that shows its text only when in the overflow area of a sap.m.OverflowToolbar.
	 * This control is intended to be used exclusively in the context of OverflowToolbar, when it is required to have buttons that show only
	 * an icon in the toolbar, but icon and text in the overflow menu.
	 * @extends sap.m.Button
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @private
	 * @since 1.28
	 * @alias sap.m.OverflowToolbarButton
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var OverflowToolbarButton = Button.extend("sap.m.OverflowToolbarButton", /** @lends sap.m.OverflowToolbarButton.prototype */ {
		renderer: ButtonRenderer.render
	});

	OverflowToolbarButton.prototype._getText = function() {
			if (this._bInOverflow) {
				return Button.prototype._getText.call(this);
			}

			return "";
	};

	return OverflowToolbarButton;

}, /* bExport= */ true);
