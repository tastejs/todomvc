/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides default renderer for control sap.ui.commons.Togglebutton
sap.ui.define(['jquery.sap.global', './ButtonRenderer', 'sap/ui/core/Renderer'],
	function(jQuery, ButtonRenderer, Renderer) {
	"use strict";


	/**
	 * ToggleButton renderer.
	 * @namespace
	 */

	var ToggleButtonRenderer = Renderer.extend(ButtonRenderer);

	/**
	 * Callback for specific rendering of accessibility attributes.
	 *
	 * @param {sap.ui.core.RenderManager}
	 *            oRm the RenderManager currently rendering this control
	 * @param {sap.m.ToggleButton}
	 *            oToggleButton the ToggleButton that should be rendered
	 * @param {object} mAccProps Accessibillity properties
	 * @private
	 */
	ToggleButtonRenderer.renderAccessibilityAttributes = function(oRm, oToggleButton, mAccProps) {

		mAccProps["pressed"] = oToggleButton.getPressed();

	};

	/**
	 * Callback for specific rendering of inner button attributes.
	 *
	 * @param {sap.ui.core.RenderManager}
	 *            oRm the RenderManager currently rendering this control
	 * @param {sap.m.ToggleButton}
	 *            oToggleButton the ToggleButton that should be rendered
	 * @private
	 */
	ToggleButtonRenderer.renderButtonAttributes = function(oRm, oToggleButton) {
		if (oToggleButton.getPressed() && !oToggleButton._isUnstyled()) {
			oRm.addClass("sapMToggleBtnPressed");
		}
	};

	return ToggleButtonRenderer;

}, /* bExport= */ true);
