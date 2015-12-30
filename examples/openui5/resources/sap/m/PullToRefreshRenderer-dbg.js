/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(['jquery.sap.global', 'sap/ui/core/IconPool'],
	function(jQuery, IconPool) {
	"use strict";

// TODO: consider making this conditional 
	IconPool.insertFontFaceStyle();
	
	/**
	 * PullToRefresh renderer. 
	 * @namespace
	 */
	var PullToRefreshRenderer = {
	};
	
	/**
	 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
	 * 
	 * @param {sap.ui.core.RenderManager} oRm the RenderManager that can be used for writing to the render output buffer
	 * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
	 */
	PullToRefreshRenderer.render = function(oRm, oControl){
		var bShowIcon = oControl.getShowIcon();
		var sCustomIcon = oControl.getCustomIcon();
		var sTooltip = oControl.getTooltip_AsString();
	
		oRm.write("<div");
		oRm.writeControlData(oControl);
		oRm.addClass("sapMPullDown");
		if (!oControl._bTouchMode) {
			oRm.addClass("sapMPullDownNontouch");
		} else {
			oRm.addClass("sapMPullDownTouch");
		}
		if (bShowIcon && !sCustomIcon) { // if no custom icon is provided, use SAP logo as background
			oRm.addClass("sapMPullDownLogo");
		}
		oRm.writeClasses();

		if (sTooltip) {
			oRm.writeAttributeEscaped("title", sTooltip);
		}

		oRm.write(" tabindex=\"0\""); // div element		
		oRm.write(" role='button' aria-controls='" + oControl.getParent().sId + "-cont'>"); // aria attribute
	
		if (bShowIcon && sCustomIcon) {
			var oCustomImage = oControl.getCustomIconImage();
			if (oCustomImage) {
				oRm.write("<div class=\"sapMPullDownCI\">");
				oRm.renderControl(oCustomImage);
				oRm.write("</div>");
			}
		}
	
		// Pull down arrow icon
		oRm.write("<span class=\"sapMPullDownIcon\"></span>");
	
		// Busy Indicator
		oRm.write("<span class=\"sapMPullDownBusy\">");
		oRm.renderControl(oControl._oBusyIndicator);
		oRm.write("</span>");
	
		// Text - Pull down to refresh
		oRm.write("<span id=" + oControl.getId() + "-T class=\"sapMPullDownText\">");
		oRm.writeEscaped(oControl.oRb.getText(oControl._bTouchMode ? "PULL2REFRESH_PULLDOWN" : "PULL2REFRESH_REFRESH"));
		oRm.write("</span>");
	
		// Info - last updated at xx:xx:xx
		oRm.write("<span id=" + oControl.getId() + "-I class=\"sapMPullDownInfo\">");
		oRm.writeEscaped(oControl.getDescription());
		oRm.write("</span>");
	
		oRm.write("</div>");
	};
	

	return PullToRefreshRenderer;

}, /* bExport= */ true);
