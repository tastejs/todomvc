/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global'],
	function(jQuery) {
	"use strict";


	/**
	 * ProgressIndicator renderer.
	 * @namespace
	 */
	var ProgressIndicatorRenderer = {};

	/**
	 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} oRm the RenderManager that can be used for writing to the render output buffer
	 * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
	 */
	ProgressIndicatorRenderer.render = function(oRm, oC) {
		var fWidthBar = oC.getPercentValue(),
			iWidthControl = oC.getWidth(),
			iHeightControl = oC.getHeight(),
			sTextValue = oC.getDisplayValue(),
			bShowText = oC.getShowValue(),
			sState = oC.getState(),
			sTextDirectionLowerCase = oC.getTextDirection().toLowerCase(),
			sControlId = oC.getId();

		// write the HTML into the render manager
		// PI border
		oRm.write("<div");
		oRm.writeControlData(oC);
		oRm.addClass("sapMPI");
		oRm.addStyle("width", iWidthControl);

		if (fWidthBar > 50) {
			oRm.addClass("sapMPIValueGreaterHalf");
		}

		if (iHeightControl) {
			oRm.addStyle("height", iHeightControl);
		}

		if (oC.getEnabled()) {
			oRm.writeAttribute('tabIndex', '-1');
		} else {
			oRm.addClass("sapMPIBarDisabled");
		}

		oRm.writeClasses();
		oRm.writeStyles();
		oRm.writeAccessibilityState(oC, {
			role: "progressbar",
			valuemin: 0,
			valuenow: fWidthBar,
			valuemax: 100,
			valuetext: oC._getAriaValueText({
				sText: sTextValue,
				fPercent: fWidthBar
			})
		});

		if (oC.getTooltip_AsString()) {
			oRm.writeAttributeEscaped("title", oC.getTooltip_AsString());
		}

		oRm.write(">"); // div element

		// PI bar
		oRm.write("<div");
		oRm.addClass("sapMPIBar");

		switch (sState) {
		case sap.ui.core.ValueState.Warning:
			oRm.addClass("sapMPIBarCritical");
			break;
		case sap.ui.core.ValueState.Error:
			oRm.addClass("sapMPIBarNegative");
			break;
		case sap.ui.core.ValueState.Success:
			oRm.addClass("sapMPIBarPositive");
			break;
		default:
			oRm.addClass("sapMPIBarNeutral");
			break;
		}

		oRm.writeClasses();
		oRm.writeAttribute("id", sControlId + "-bar");
		oRm.writeAttribute("style", "width:" + fWidthBar + "%");
		oRm.write(">"); // div element

		//PI textLeft
		ProgressIndicatorRenderer._renderDisplayText(oRm, sTextDirectionLowerCase, "Left", sControlId);

		//textvalue is only showed if showValue set
		if (bShowText) {
			oRm.writeEscaped(sTextValue);
		}

		oRm.write("</span>");
		oRm.write("</div>"); // div element pi bar

		//PI textRight
		ProgressIndicatorRenderer._renderDisplayText(oRm, sTextDirectionLowerCase, "Right", sControlId);

		//textvalue is only showed if showValue set
		if (bShowText) {
			oRm.writeEscaped(sTextValue);
		}

		oRm.write("</span>");
		oRm.write("</div>"); //div element pi text
	};

	ProgressIndicatorRenderer._renderDisplayText = function(oRm, sTextDirectionLowerCase, sTextAlign, oControlId){
		oRm.write("<span class='sapMPIText sapMPIText" + sTextAlign + "' id='" + oControlId + "-text" + sTextAlign + "'");

		if (sTextDirectionLowerCase !== "inherit") {
			oRm.writeAttribute("dir", sTextDirectionLowerCase);
		}

		oRm.write('>');
	};

	return ProgressIndicatorRenderer;

}, /* bExport= */ true);
