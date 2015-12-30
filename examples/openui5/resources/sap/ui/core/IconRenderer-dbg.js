/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global'], function(jQuery) {
	"use strict";

	/**
	 * Font-Icon renderer.
	 * @namespace
	 * @alias sap.ui.core.IconRenderer
	 */
	var IconRenderer = {};

	/**
	 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} oRm The RenderManager that can be used for writing to the render output buffer.
	 * @param {sap.ui.core.Control} oControl An object representation of the control that should be rendered.
	 */
	IconRenderer.render = function(oRm, oControl) {
		// write the HTML into the render manager
		var oIconInfo = sap.ui.core.IconPool.getIconInfo(oControl.getSrc()),
			sWidth = oControl.getWidth(),
			sHeight = oControl.getHeight(),
			sColor = oControl.getColor(),
			sBackgroundColor = oControl.getBackgroundColor(),
			sSize = oControl.getSize(),
			sTooltip = oControl.getTooltip_AsString(),
			bUseIconTooltip = oControl.getUseIconTooltip(),
			bNoTabStop = oControl.getNoTabStop();

		oRm.write("<span");
		oRm.writeControlData(oControl);
		oRm.writeAccessibilityState(oControl, oControl._getAccessibilityAttributes());

		if (sTooltip || (bUseIconTooltip && oIconInfo)) {
			oRm.writeAttributeEscaped("title", sTooltip || oIconInfo.text || oIconInfo.name);
		}

		if (oControl.hasListeners("press") && !bNoTabStop) {
			oRm.writeAttribute("tabindex", 0);
		}

		if (oIconInfo) {
			oRm.writeAttributeEscaped("data-sap-ui-icon-content", oIconInfo.content);
			oRm.addStyle("font-family", "'" + jQuery.sap.encodeHTML(oIconInfo.fontFamily) + "'");
		}

		if (sWidth) {
			oRm.addStyle("width", sWidth);
		}

		if (sHeight) {
			oRm.addStyle("height", sHeight);
			oRm.addStyle("line-height", sHeight);
		}

		if (!(sColor in sap.ui.core.IconColor)) {
			oRm.addStyle("color", jQuery.sap.encodeHTML(sColor));
		}

		if (!(sBackgroundColor in sap.ui.core.IconColor)) {
			oRm.addStyle("background-color", jQuery.sap.encodeHTML(sBackgroundColor));
		}

		if (sSize) {
			oRm.addStyle("font-size", sSize);
		}

		oRm.addClass("sapUiIcon");

		if (oIconInfo && !oIconInfo.suppressMirroring) {
			oRm.addClass("sapUiIconMirrorInRTL");
		}

		if (oControl.hasListeners("press")) {
			oRm.addClass("sapUiIconPointer");
		}

		oRm.writeClasses();
		oRm.writeStyles();

		oRm.write("></span>");
	};

	return IconRenderer;

}, /* bExport= */ true);
