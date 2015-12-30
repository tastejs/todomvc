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
	 * @author SAP SE
	 * @namespace
	 */

	var ToggleButtonRenderer = Renderer.extend(ButtonRenderer);

	/**
	 * Hint: "renderButtonAttributes" is a reserved/hard-coded Button extending function!
	 *       It is used to allow extensions to display content after the actual button content.
	 * @param {sap.ui.core.RenderManager}
	 *            rm the RenderManager currently rendering this control
	 * @param {sap.ui.commons.ToggleButton}
	 *            oToggleButton the ToggleButton that should be rendered
	 * @private
	 */
	ToggleButtonRenderer.renderButtonAttributes = function(rm, oToggleButton) {
		rm.addClass("sapUiToggleBtn");
		if (oToggleButton.getPressed()) {
			rm.addClass("sapUiToggleBtnPressed");
			rm.writeAttribute('aria-pressed', true);
		} else {
			rm.writeAttribute('aria-pressed', false);
		}
	};


	/**
	 * Function called by ToggleButton control to enable Pressed state.
	 */
	ToggleButtonRenderer.onactivePressed = function(oToggleButton) {
		oToggleButton.$().addClass("sapUiToggleBtnPressed").attr('aria-pressed', true);
	};

	/**
	 * Function called by button control to disable Pressed state.
	 */
	ToggleButtonRenderer.ondeactivePressed = function(oToggleButton) {
		oToggleButton.$().removeClass("sapUiToggleBtnPressed").attr('aria-pressed', false);
	};

	/**
	 * Function called by button control to update image based on state.
	 */
	ToggleButtonRenderer.updateImage = function(oToggleButton) {
		oToggleButton.$("img").attr('src', this._getIconForState(oToggleButton, "base"));
	};

	/**
	 * Returns the icon URI for the given button state
	 * @private
	 */
	ToggleButtonRenderer._getIconForState = function(oButton, sState) {
		var sIcon;
		switch (sState) {
			case "mouseout":
			case "focus":
			case "blur":
			case "base":
				return oButton.getPressed() && oButton.getIconSelected() ? oButton.getIconSelected() : oButton.getIcon();
			case "active":
				sIcon = oButton.getIconSelected();
				return sIcon ? sIcon : oButton.getIcon();
			case "mouseover":
			case "deactive":
				sIcon = oButton.getIconHovered();
				if (sIcon) {
					return sIcon;
				} else if (oButton.getPressed() && oButton.getIconSelected()) {
					return oButton.getIconSelected();
				} else {
					return oButton.getIcon();
				}
		}
		return oButton.getIcon();
	};


	return ToggleButtonRenderer;

}, /* bExport= */ true);
