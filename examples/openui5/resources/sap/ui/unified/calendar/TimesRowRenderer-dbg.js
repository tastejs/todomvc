/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(['jquery.sap.global', 'sap/ui/unified/calendar/CalendarUtils', 'sap/ui/core/date/UniversalDate'],
	function(jQuery, CalendarUtils, UniversalDate) {
	"use strict";


	/**
	 * Month renderer.
	 * @namespace
	 */
	var TimesRowRenderer = {
	};

	/**
	 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} oRm The RenderManager that can be used for writing to the render output buffer
	 * @param {sap.ui.unified.calendar.TimesRow} oTimesRow An object representation of the control that should be rendered
	 */
	TimesRowRenderer.render = function(oRm, oTimesRow){

		var oDate = oTimesRow._getStartDate();
		var sTooltip = oTimesRow.getTooltip_AsString();
		var sId = oTimesRow.getId();
		var oAriaLabel = {value: sId + "-Descr", append: true};

		oRm.write("<div");
		oRm.writeControlData(oTimesRow);
		oRm.addClass("sapUiCalTimesRow");
		oRm.addClass("sapUiCalRow");
		oRm.writeClasses();

		if (sTooltip) {
			oRm.writeAttributeEscaped("title", sTooltip);
		}

		if (oTimesRow._getShowHeader()) {
			oAriaLabel.value = oAriaLabel.value + " " + sId + "-Head";
		}

		oRm.writeAccessibilityState(oTimesRow, {
			role: "grid",
			readonly: "true",
			multiselectable: !oTimesRow.getSingleSelection() || oTimesRow.getIntervalSelection(),
			labelledby: oAriaLabel
		});

		oRm.write(">"); // div element

		oRm.write("<span id=\"" + sId + "-Descr\" style=\"display: none;\">" + oTimesRow._rb.getText("CALENDAR_DIALOG") + "</span>");

		if (oTimesRow.getIntervalSelection()) {
			oRm.write("<span id=\"" + sId + "-Start\" style=\"display: none;\">" + oTimesRow._rb.getText("CALENDAR_START_TIME") + "</span>");
			oRm.write("<span id=\"" + sId + "-End\" style=\"display: none;\">" + oTimesRow._rb.getText("CALENDAR_END_TIME") + "</span>");
		}

		this.renderRow(oRm, oTimesRow, oDate);

		oRm.write("</div>");

	};

	TimesRowRenderer.renderRow = function(oRm, oTimesRow, oDate){

		var sId = oTimesRow.getId();

		// header line
		this.renderHeader(oRm, oTimesRow, oDate);

		// time items
		oRm.write("<div id=\"" + sId + "-times\" class=\"sapUiCalItems\">"); // extra DIV around the times to allow rerendering only it's content
		this.renderTimes(oRm, oTimesRow, oDate);
		oRm.write("</div>");

	};

	TimesRowRenderer.renderHeader = function(oRm, oTimesRow, oDate){

		// header
		if (oTimesRow._getShowHeader()) {
			var oLocaleData = oTimesRow._getLocaleData();
			var sId = oTimesRow.getId();

			oRm.write("<div id=\"" + sId + "-Head\">");
			this.renderHeaderLine(oRm, oTimesRow, oLocaleData, oDate);
			oRm.write("</div>");
		}

	};

	TimesRowRenderer.renderHeaderLine = function(oRm, oTimesRow, oLocaleData, oDate){

		var oFormatDate = oTimesRow._getFormatDate();
		var sId = oTimesRow.getId();
		var iItems = oTimesRow.getItems();
		var oItemDate = oTimesRow._getIntervalStart(oDate);
		var iMinutes = oTimesRow.getIntervalMinutes();
		var sWidth = "";
		var sDay = 0;
		var aDayIntervals = [];
		var i = 0;

		for (i = 0; i < iItems; i++) {
			sDay = oFormatDate.format(oItemDate, true);
			if (aDayIntervals.length > 0 && aDayIntervals[aDayIntervals.length - 1].sDay == sDay) {
				aDayIntervals[aDayIntervals.length - 1].iItems++;
			}else {
				aDayIntervals.push({sDay: sDay, iItems: 1});
			}
			oItemDate.setUTCMinutes(oItemDate.getUTCMinutes() + iMinutes);
		}

		for (i = 0; i < aDayIntervals.length; i++) {
			var oDayInterval = aDayIntervals[i];
			sWidth = ( 100 / iItems * oDayInterval.iItems) + "%";
			oRm.write("<div id=\"" + sId + "-Head" + i + "\"class=\"sapUiCalHeadText\" style=\"width:" + sWidth + "\">");
			oRm.write(oDayInterval.sDay);
			oRm.write("</div>");
		}

	};

	TimesRowRenderer.renderTimes = function(oRm, oTimesRow, oDate){

		var oHelper = this.getHelper(oTimesRow, oDate);
		var iItems = oTimesRow.getItems();
		var sWidth = ( 100 / iItems ) + "%";
		var oItemDate = oTimesRow._getIntervalStart(oDate);

		for (var i = 0; i < iItems; i++) {
			this.renderTime(oRm, oTimesRow, oItemDate, oHelper, sWidth);
			oItemDate.setUTCMinutes(oItemDate.getUTCMinutes() + oHelper.iMinutes);
		}

	};

	TimesRowRenderer.getHelper = function(oTimesRow, oDate){

		var oHelper = {};

		oHelper.sLocale = oTimesRow._getLocale();
		oHelper.oLocaleData = oTimesRow._getLocaleData();
		oHelper.oNow = CalendarUtils._createUniversalUTCDate(new Date(), true);
		oHelper.sCurrentTime = oTimesRow._rb.getText("CALENDAR_CURRENT_TIME");
		oHelper.sId = oTimesRow.getId();
		oHelper.oFormatLong = oTimesRow._getFormatLong();
		oHelper.oFormatTime = oTimesRow._getFormatTime();
		oHelper.iMinutes = oTimesRow.getIntervalMinutes();

		return oHelper;

	};

	TimesRowRenderer.renderTime = function(oRm, oTimesRow, oDate, oHelper, sWidth){

		var mAccProps = {
				role: "gridcell",
				selected: false,
				label: "",
				describedby: ""
			};

		var sYyyyMMddHHmm = oTimesRow._oFormatYyyyMMddHHmm.format(oDate, true);
		var iSelected = oTimesRow._checkDateSelected(oDate);
		var oType = oTimesRow._getDateType(oDate);

		oRm.write("<div");
		oRm.writeAttribute("id", oHelper.sId + "-" + sYyyyMMddHHmm);
		oRm.addClass("sapUiCalItem");
		if (sWidth) {
			oRm.addStyle("width", sWidth);
		}

		var oNextInterval = new UniversalDate(oDate.getTime());
		oNextInterval.setUTCMinutes(oNextInterval.getUTCMinutes() + oHelper.iMinutes);

		if (oDate.getTime() <= oHelper.oNow.getTime() && oNextInterval.getTime() > oHelper.oNow.getTime()) {
			oRm.addClass("sapUiCalItemNow");
			mAccProps["label"] = oHelper.sCurrentTime + " ";
		}

		if (iSelected > 0) {
			oRm.addClass("sapUiCalItemSel"); // time selected
			mAccProps["selected"] = true;
		}
		if (iSelected == 2) {
			oRm.addClass("sapUiCalItemSelStart"); // interval start
			mAccProps["describedby"] = mAccProps["describedby"] + " " + oHelper.sId + "-Start";
		} else if (iSelected == 3) {
			oRm.addClass("sapUiCalItemSelEnd"); // interval end
			mAccProps["describedby"] = mAccProps["describedby"] + " " + oHelper.sId + "-End";
		} else if (iSelected == 4) {
			oRm.addClass("sapUiCalItemSelBetween"); // interval between
		} else if (iSelected == 5) {
			oRm.addClass("sapUiCalItemSelStart"); // interval start
			oRm.addClass("sapUiCalItemSelEnd"); // interval end
			mAccProps["describedby"] = mAccProps["describedby"] + " " + oHelper.sId + "-Start";
			mAccProps["describedby"] = mAccProps["describedby"] + " " + oHelper.sId + "-End";
		}

		if (oType && oType != sap.ui.unified.CalendarDayType.None) {
			oRm.addClass("sapUiCalItem" + oType.type);
			if (oType.tooltip) {
				oRm.writeAttributeEscaped('title', oType.tooltip);
			}
		}

		oRm.writeAttribute("tabindex", "-1");
		oRm.writeAttribute("data-sap-time", sYyyyMMddHHmm);
		mAccProps["label"] = mAccProps["label"] + oHelper.oFormatLong.format(oDate, true);
		oRm.writeAccessibilityState(null, mAccProps);
		oRm.writeClasses();
		oRm.writeStyles();
		oRm.write(">"); // div element

		oRm.write("<span");
		oRm.addClass("sapUiCalItemText");
		oRm.writeClasses();
		oRm.write(">"); // span
		oRm.write(oHelper.oFormatTime.format(oDate, true));
		oRm.write("</span>");

		oRm.write("</div>");

	};

	return TimesRowRenderer;

}, /* bExport= */ true);
