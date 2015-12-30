/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(['jquery.sap.global'],
	function(jQuery) {
	"use strict";


	/**
	 * Calendar renderer.
	 * @namespace
	 */
	var CalendarTimeIntervalRenderer = {
	};

	/**
	 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} oRm The RenderManager that can be used for writing to the render output buffer
	 * @param {sap.ui.unified.CalendarTimeInterval} oCal An object representation of the control that should be rendered
	 */
	CalendarTimeIntervalRenderer.render = function(oRm, oCal){

		oCal._iMode = 0; // it's rendered always as TimesRow

		var sId = oCal.getId();
		var sTooltip = oCal.getTooltip_AsString();
		var oTimesRow = oCal.getAggregation("timesRow");

		oRm.write("<div");
		oRm.writeControlData(oCal);
		oRm.addClass("sapUiCal");
		oRm.addClass("sapUiCalInt");
		oRm.addClass("sapUiCalTimeInt");

		if (oCal._getShowItemHeader()) {
			oRm.addClass("sapUiCalIntHead");
		}

		// This makes the calendar focusable and therefore
		// the white empty areas can be clicked without closing the calendar
		// by accident.
		oRm.writeAttribute("tabindex", "-1");

		var rb = sap.ui.getCore().getLibraryResourceBundle("sap.ui.unified");
		var mAccProps = {labelledby: {value: "", append: false}}; // render on Month
		if (oCal._bPoupupMode) {
			mAccProps["role"] = "dialog";
		}
		oRm.writeAccessibilityState(oCal, mAccProps);

		if (sTooltip) {
			oRm.writeAttributeEscaped('title', sTooltip);
		}

		var sWidth = oCal.getWidth();
		if (sWidth && sWidth != '') {
			oRm.addStyle("width", sWidth);
			oRm.writeStyles();
		}

		oRm.writeClasses();
		oRm.write(">"); // div element

		var oHeader = oCal.getAggregation("header");
		oRm.renderControl(oHeader);

		oRm.write("<div id=\"" + sId + "-content\" class=\"sapUiCalContent\">");
		oRm.renderControl(oTimesRow);

		oRm.write("<div id=\"" + sId + "-contentOver\" class=\"sapUiCalContentOver\" style=\"display:none;\"></div>");
		oRm.write("</div>");

		oRm.write("<button id=\"" + sId + "-cancel\" class=\"sapUiCalCancel\" tabindex=\"-1\">");
		oRm.write(rb.getText("CALENDAR_CANCEL"));
		oRm.write("</button>");

		// dummy element to catch tabbing in from next element
		oRm.write("<div id=\"" + sId + "-end\" tabindex=\"0\" style=\"width:0;height:0;position:absolute;right:0;bottom:0;\"></div>");

		oRm.write("</div>");

	};

	return CalendarTimeIntervalRenderer;

}, /* bExport= */ true);
