/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global', 'sap/ui/core/theming/Parameters'],
	function(jQuery, Parameters) {
	"use strict";


	/* =========================================================== */
	/*           temporary flags for jslint syntax check           */
	/* =========================================================== */
	/*jslint nomen: false */
	
	/**
	 * RatingIndicator renderer.
	 * @namespace
	 */
	var RatingIndicatorRenderer = {
	};
	
	/**
	 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} oRm the RenderManager that can be used for writing to the render output buffer
	 * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
	 */
	RatingIndicatorRenderer.render = function (oRm, oControl) {
	
		var fRatingValue = oControl._roundValueToVisualMode(oControl.getValue()),
			iSymbolCount = oControl.getMaxValue(),
			fIconSize = oControl._iPxIconSize,
			fIconPadding = oControl._iPxPaddingSize,
			sIconSizeMeasure = 'px',
			iSelectedWidth = fRatingValue * fIconSize + (Math.round(fRatingValue) - 1) * fIconPadding,
			iWidth = iSymbolCount * (fIconSize + fIconPadding) - fIconPadding,
			oIconSel,
			oIconUnsel,
			oIconHov,
			i = 0,
			sTooltip = oControl.getTooltip_AsString(),
			// gradients in combination with background-clip: text are not supported by ie, android < 4.2 or blackberry
			bUseGradient = sap.ui.Device.browser.chrome || sap.ui.Device.browser.safari,
			sLabelID;
	
		if (iSelectedWidth < 0) { //width should not be negative
			iSelectedWidth = 0;
		}
	
		// render the control container div
		oRm.write("<div");
		oRm.writeControlData(oControl);
		oRm.writeAttribute("style", "width: " + iWidth + sIconSizeMeasure);
		if (!oControl.getEnabled()) {
			oRm.writeAttribute("tabindex", "-1");
		} else {
			oRm.writeAttribute("tabindex", "0");
		}
		oRm.addClass("sapMRI");
		if (oControl.getEnabled()) {
			oRm.addClass("sapMPointer");
		} else {
			oRm.addClass("sapMRIDisabled");
		}
		oRm.writeClasses();
		// add tooltip if available
		if (sTooltip) {
			oRm.writeAttributeEscaped("title", sTooltip);
		}

		// ARIA
		sLabelID = oControl.getId() + "-ariaLabel";

		oRm.writeAccessibilityState(oControl, {
			"role": "slider",
			"orientation": "horizontal",
			"live": "assertive",
			"valuemin": 0,
			"disabled": !oControl.getEnabled(),
			"labelledby": {
				value: sLabelID,
				append: true
			}
		});

		oRm.write(">");

		// ARIA
		oRm.write("<label id='" + sLabelID + "' style='display:none;' aria-hidden='true'>" + oControl._oResourceBundle.getText("RATING_ARIA_NAME") + "</label>");

		// render selected items div
		oRm.write("<div class='sapMRISel");
		if (bUseGradient) {
			oRm.write(" sapMRIGrd");
		}
		oRm.write("'");
		oRm.writeAttribute("id", oControl.getId() + "-sel");
		oRm.writeAttribute("style", "width: " + iSelectedWidth + sIconSizeMeasure);
		oRm.write(">");
		// for defined count of icons, create selected icons with oControl._getIcon(0)
		for (i = 0; i < iSymbolCount; i++) {
			oIconSel = oControl._getIcon(0);
			//check if icon is icon or image
			if (oIconSel instanceof sap.ui.core.Icon) {
				oIconSel.setSize(fIconSize + sIconSizeMeasure);
			}
			// always set width and height because icon fonts can have different dimensions
			oIconSel.setWidth(fIconSize + sIconSizeMeasure);
			oIconSel.setHeight(fIconSize + sIconSizeMeasure);
	
			oIconSel.addStyleClass("sapMRIIconSel");
			oRm.renderControl(oIconSel);
		}
		oRm.write("</div>");
	
		// render unselected items div (container and relative child)
		oRm.write("<div class='sapMRIUnselWrapper'");
		oRm.writeAttribute("id", oControl.getId() + "-unsel-wrapper");
		oRm.writeAttribute("style", "width: " + (iWidth - iSelectedWidth) + sIconSizeMeasure);
		oRm.write(">");
		oRm.write("<div class='sapMRIUnsel");
		if (bUseGradient && oControl.getEnabled()) { // see the specification for read only rating indicator
			oRm.write(" sapMRIGrd");
		}
		oRm.write("' id='" + oControl.getId() + "-unsel'>");
		// for defined count of icons, create unselected icons with oControl._getIcon(1)
		for (i = 0; i < iSymbolCount; i++) {
			oIconUnsel = oControl._getIcon(1);
			//check if icon is icon or image
			if (oIconUnsel instanceof sap.ui.core.Icon) {
				oIconUnsel.setSize(fIconSize + sIconSizeMeasure);
			}
			// always set width and height because icon fonts can have different dimensions
			oIconUnsel.setWidth(fIconSize + sIconSizeMeasure);
			oIconUnsel.setHeight(fIconSize + sIconSizeMeasure);
	
			oIconUnsel.addStyleClass("sapMRIIconUnsel");
			if (fIconSize <= 1) {
				oIconUnsel.addStyleClass("sapMRIIconUnselSmall");
			}
			oRm.renderControl(oIconUnsel);
		}
		oRm.write("</div>");
		oRm.write("</div>");
	
		// render hovered item div
		if (oControl.getEnabled()) {
			oRm.write("<div class='sapMRIHov' id='" + oControl.getId() + "-hov'>");
			// for defined count of icons, create hovered icons with oControl._getIcon(2)
			for (i = 0; i < iSymbolCount; i++) {
				oIconHov = oControl._getIcon(2);
				//check if icon is icon or image
				if (oIconHov instanceof sap.ui.core.Icon) {
					oIconHov.setSize(fIconSize + sIconSizeMeasure);
				}
				// always set width and height because icon fonts can have different dimensions
				oIconHov.setWidth(fIconSize + sIconSizeMeasure);
				oIconHov.setHeight(fIconSize + sIconSizeMeasure);
	
				oIconHov.addStyleClass("sapMRIIconHov");
				oRm.renderControl(oIconHov);
			}
			oRm.write("</div>");
	
			// render selector items div
			oRm.write("<div class='sapMRISelector' id='" + oControl.getId() + "-selector'>");
			oRm.write("</div>");
		}
	
		// close control div
		oRm.write("</div>");
	};

	return RatingIndicatorRenderer;

}, /* bExport= */ true);
