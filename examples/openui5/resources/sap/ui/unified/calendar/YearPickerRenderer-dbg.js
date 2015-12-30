/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(['jquery.sap.global'],
	function(jQuery) {
	"use strict";


	/**
	 * YearPicker renderer.
	 * @namespace
	 */
	var YearPickerRenderer = {
	};

	/**
	 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} oRm the RenderManager that can be used for writing to the render output buffer
	 * @param {sap.ui.unified.calendar.YearPicker} oYP an object representation of the control that should be rendered
	 */
	YearPickerRenderer.render = function(oRm, oYP){

		var sTooltip = oYP.getTooltip_AsString();
		var sId = oYP.getId();
		var iCurrentYear = oYP.getYear();
		var iYears = oYP.getYears();
		var iColumns = oYP.getColumns();
		var sWidth = "";

		oRm.write("<div");
		oRm.writeControlData(oYP);
		oRm.addClass("sapUiCalYearPicker");
		oRm.writeClasses();

		if (sTooltip) {
			oRm.writeAttributeEscaped('title', sTooltip);
		}

		oRm.writeAccessibilityState(oYP, {
			role: "grid",
			readonly: "true",
			multiselectable: "false"
		});

		oRm.write(">"); // div element

		var iYear = iCurrentYear - Math.floor(iYears / 2);

		if (iYear >= 10000 - iYears) {
			iYear = 10000 - iYears;
		}else if (iYear < 1) {
			iYear = 1;
		}

		if (iColumns > 0) {
			sWidth = ( 100 / iColumns ) + "%";
		} else {
			sWidth = ( 100 / iYears ) + "%";
		}

		for ( var i = 0; i < iYears; i++) {
			if (iColumns > 0 && i % iColumns == 0) {
				// begin of row
				oRm.write("<div");
				oRm.writeAccessibilityState(null, {role: "row"});
				oRm.write(">"); // div element
			}

			oRm.write("<div");
			oRm.writeAttribute("id", sId + "-y" + iYear);
			oRm.addClass("sapUiCalItem");
			if (iYear == iCurrentYear) {
				oRm.addClass("sapUiCalItemSel");
			}
			oRm.writeAttribute("tabindex", "-1");
			oRm.addStyle("width", sWidth);
			oRm.writeClasses();
			oRm.writeStyles();
			oRm.writeAccessibilityState(null, {role: "gridcell"});
			oRm.write(">"); // div element
			oRm.write(iYear);
			oRm.write("</div>");
			iYear++;

			if (iColumns > 0 && ((i + 1) % iColumns == 0)) {
				// end of row
				oRm.write("</div>");
			}
		}

		oRm.write("</div>");

	};

	return YearPickerRenderer;

}, /* bExport= */ true);
