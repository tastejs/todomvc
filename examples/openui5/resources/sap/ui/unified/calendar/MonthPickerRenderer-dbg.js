/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(['jquery.sap.global'],
	function(jQuery) {
	"use strict";


	/**
	 * MonthPicker renderer.
	 * @namespace
	 */
	var MonthPickerRenderer = {
	};

	/**
	 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} oRm the RenderManager that can be used for writing to the render output buffer
	 * @param {sap.ui.unified.calendar.MonthPicker} oMP an object representation of the control that should be rendered
	 */
	MonthPickerRenderer.render = function(oRm, oMP){

		var iMonth = oMP.getMonth();
		var iMonths = oMP.getMonths();
		var iStartMonth = 0;
		var iColumns = oMP.getColumns();
		var sTooltip = oMP.getTooltip_AsString();
		var oLocaleData = oMP._getLocaleData();
		var sId = oMP.getId();
		var sWidth = "";

		var aMonthNames = [];
		var aMonthNamesWide = [];
		if (oMP._bLongMonth || !oMP._bNamesLengthChecked) {
			aMonthNames = oLocaleData.getMonthsStandAlone("wide");
		} else {
			aMonthNames = oLocaleData.getMonthsStandAlone("abbreviated");
			aMonthNamesWide = oLocaleData.getMonthsStandAlone("wide");
		}

		oRm.write("<div");
		oRm.writeControlData(oMP);
		oRm.addClass("sapUiCalMonthPicker");
		oRm.writeClasses();

		if (sTooltip) {
			oRm.writeAttributeEscaped('title', sTooltip);
		}

		oRm.writeAccessibilityState(oMP, {
			role: "grid",
			readonly: "true",
			multiselectable: "false"
		});

		oRm.write(">"); // div element

		var mAccProps;

		if (iMonths > 12) {
			iMonths = 12;
		}else	if (iMonths < 12) {
			// Month blocks should start with multiple of number of displayed months
			iStartMonth = Math.floor( iMonth / iMonths) * iMonths;
			if (iStartMonth + iMonths > 12) {
				iStartMonth = 12 - iMonths;
			}
		}

		if (iColumns > 0) {
			sWidth = ( 100 / iColumns ) + "%";
		} else {
			sWidth = ( 100 / iMonths ) + "%";
		}

		for ( var i = 0; i < iMonths; i++) {
			mAccProps = {
					role: "gridcell"
				};
			if (!oMP._bLongMonth && oMP._bNamesLengthChecked) {
				mAccProps["label"] = aMonthNamesWide[i + iStartMonth];
			}

			if (iColumns > 0 && i % iColumns == 0) {
				// begin of row
				oRm.write("<div");
				oRm.writeAccessibilityState(null, {role: "row"});
				oRm.write(">"); // div element
			}

			oRm.write("<div");
			oRm.writeAttribute("id", sId + "-m" + (i + iStartMonth));
			oRm.addClass("sapUiCalItem");
			if (i + iStartMonth == iMonth) {
				oRm.addClass("sapUiCalItemSel");
			}
			oRm.writeAttribute("tabindex", "-1");
			oRm.addStyle("width", sWidth);
			oRm.writeClasses();
			oRm.writeStyles();
			oRm.writeAccessibilityState(null, mAccProps);
			oRm.write(">"); // div element
			oRm.write(aMonthNames[i + iStartMonth]);
			oRm.write("</div>");

			if (iColumns > 0 && ((i + 1) % iColumns == 0)) {
				// end of row
				oRm.write("</div>");
			}
		}

		oRm.write("</div>");

	};

	return MonthPickerRenderer;

}, /* bExport= */ true);
