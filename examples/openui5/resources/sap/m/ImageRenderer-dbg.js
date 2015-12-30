/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides default renderer for control sap.m.Image
sap.ui.define(['jquery.sap.global'],
	function(jQuery) {
	"use strict";

	/**
	 * Image renderer.
	 * @author SAP SE
	 * @namespace
	 */
	var ImageRenderer = {
	};


	/**
	 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} oRenderManager the RenderManager that can be used for writing to the Render-Output-Buffer
	 * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
	 */
	ImageRenderer.render = function(rm, oImage) {
		var sMode = oImage.getMode(),
			alt = oImage.getAlt(),
			tooltip = oImage.getTooltip_AsString(),
			bHasPressHandlers = oImage.hasListeners("press");

		// Open the DOM element tag. The 'img' tag is used for mode sap.m.ImageMode.Image and 'span' tag is used for sap.m.ImageMode.Background
		rm.write(sMode === sap.m.ImageMode.Image ? "<img" : "<span");

		rm.writeControlData(oImage);

		if (sMode === sap.m.ImageMode.Image) {
			rm.writeAttributeEscaped("src", oImage._getDensityAwareSrc());
		} else {
			// preload the image with a window.Image instance. The source uri is set to the output DOM node via CSS style 'background-image' after the source image is loaded (in onload function)
			oImage._preLoadImage(oImage._getDensityAwareSrc());
			rm.addStyle("background-size", jQuery.sap.encodeHTML(oImage.getBackgroundSize()));
			rm.addStyle("background-position", jQuery.sap.encodeHTML(oImage.getBackgroundPosition()));
			rm.addStyle("background-repeat", jQuery.sap.encodeHTML(oImage.getBackgroundRepeat()));
		}

		rm.addClass("sapMImg");
		if (oImage.hasListeners("press") || oImage.hasListeners("tap")) {
			rm.addClass("sapMPointer");
		}

		if (oImage.getUseMap() || !oImage.getDecorative()) {
			rm.addClass("sapMImgFocusable");
		}

		rm.writeClasses();

		//TODO implement the ImageMap control
		var sUseMap = oImage.getUseMap();
		if (sUseMap) {
			if (!(jQuery.sap.startsWith(sUseMap, "#"))) {
				sUseMap = "#" + sUseMap;
			}
			rm.writeAttributeEscaped("useMap", sUseMap);
		}

		if (oImage.getDecorative() && !sUseMap && !bHasPressHandlers) {
			rm.writeAttribute("role", "presentation");
			rm.writeAttribute("aria-hidden", "true");
			rm.write(" alt=''"); // accessibility requirement: write always empty alt attribute for decorative images
		} else {
			if (alt || tooltip) {
				rm.writeAttributeEscaped("alt", alt || tooltip);
			}
		}

		if (alt || tooltip) {
			rm.writeAttributeEscaped("aria-label", alt || tooltip);
		}

		if (tooltip) {
			rm.writeAttributeEscaped("title", tooltip);
		}

		if (bHasPressHandlers) {
			rm.writeAttribute("role", "button");
			rm.writeAttribute("tabIndex", 0);
		}

		// Dimensions
		if (oImage.getWidth() && oImage.getWidth() != '') {
			rm.addStyle("width", oImage.getWidth());
		}
		if (oImage.getHeight() && oImage.getHeight() != '') {
			rm.addStyle("height", oImage.getHeight());
		}

		rm.writeStyles();

		rm.write(" />"); // close the <img> element
	};

	return ImageRenderer;
}, /* bExport= */ true);
