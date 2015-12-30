/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides default renderer for control sap.ui.commons.Image
sap.ui.define(['jquery.sap.global'],
	function(jQuery) {
	"use strict";


	/**
	 * @author SAP SE
	 * @namespace
	 */
	var ImageRenderer = {
	};
	
	/**
	 * Renders the HTML for the Image, using the provided {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} oRenderManager The RenderManager that can be used for writing to the render output buffer.
	 * @param {sap.ui.commons.Image} oImage The control that should be rendered.
	 */
	ImageRenderer.render = function(oRenderManager, oImage) {
		var rm = oRenderManager;

		// Open the <img> tag
		rm.write("<img");
		rm.writeControlData(oImage);
	
		// Set the 1x1.gif when empty source is set. This is to prevent the broken image placeholder and unnecessary 
		// requests to the root url in older browsers (as the 1x1.gif is only loaded once and then cached).
		// Hiding the image won't help as hidden images are still loaded.
		// The HTML5 spec requires empty source tags to be ignored. Anyway, some modern browsers still show border around
		// empty images.
		rm.writeAttributeEscaped("src", oImage.getSrc() || sap.ui.resource('sap.ui.commons', 'img/1x1.gif'));
	
		rm.addClass("sapUiImg");
		if (oImage.hasListeners("press")) {
			rm.addClass("sapUiImgWithHandler");
		}
		if (!oImage.getSrc()) {
			rm.addClass("sapUiImgNoSource");
		}
		rm.writeClasses();
	
		var tooltip = oImage.getTooltip_AsString();
		if (tooltip) {
			rm.writeAttributeEscaped("title", tooltip);
		}
	
		var sUseMap = oImage.getUseMap();
		if (sUseMap) {
			if (!(jQuery.sap.startsWith(sUseMap, "#"))) {
				sUseMap = "#" + sUseMap;
			}
			rm.writeAttributeEscaped("useMap", sUseMap);
		}
	
		// determine tab index and write alt attribute - both depending on "decorative" state (which is overridden by the "useMap" property
		var myTabIndex = 0;
		if ((oImage.getDecorative() && (!sUseMap))) {
			myTabIndex = -1;
			rm.writeAttribute("role", "presentation");
			rm.write(" alt=''"); // accessibility requirement: write always empty alt attribute for decorative images
		} else {
			if (oImage.getAlt()) {
				rm.writeAttributeEscaped("alt", oImage.getAlt() || tooltip); // accessibility requirement: use tooltip for alt if alt is not set
			} else if (tooltip) {
				rm.writeAttributeEscaped("alt", tooltip);
			}
		}
		rm.writeAttribute("tabIndex", myTabIndex);
	
		// Dimensions
		var myStyle = "";
		if (oImage.getWidth() && oImage.getWidth() != '') {
			myStyle += "width:" + oImage.getWidth() + ";";
		}
		if (oImage.getHeight() && oImage.getHeight() != '') {
			myStyle += "height:" + oImage.getHeight() + ";";
		}
		if (myStyle != "") {
			rm.writeAttribute("style", myStyle);
		}
	
		rm.write("/>"); // close the <img> element
	};

	return ImageRenderer;

}, /* bExport= */ true);
