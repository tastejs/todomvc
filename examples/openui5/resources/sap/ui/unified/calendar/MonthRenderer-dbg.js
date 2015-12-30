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
	var MonthRenderer = {
	};

	/**
	 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} oRm the RenderManager that can be used for writing to the render output buffer
	 * @param {sap.ui.unified.calendar.Month} oMonth an object representation of the control that should be rendered
	 */
	MonthRenderer.render = function(oRm, oMonth){

		var oDate = this.getStartDate(oMonth);
		var sTooltip = oMonth.getTooltip_AsString();
		var rb = sap.ui.getCore().getLibraryResourceBundle("sap.ui.unified");
		var sId = oMonth.getId();
		var oAriaLabel = {value: sId + "-Descr", append: true};

		oRm.write("<div");
		oRm.writeControlData(oMonth);
		oRm.addClass(this.getClass());
		oRm.writeClasses();

		if (sTooltip) {
			oRm.writeAttributeEscaped("title", sTooltip);
		}

		if (oMonth._getShowHeader()) {
			oAriaLabel.value = oAriaLabel.value + " " + sId + "-Head";
		}

		oRm.writeAccessibilityState(oMonth, {
			role: "grid",
			readonly: "true",
			multiselectable: !oMonth.getSingleSelection() || oMonth.getIntervalSelection(),
			labelledby: oAriaLabel
		});

		oRm.write(">"); // div element

		oRm.write("<span id=\"" + sId + "-Descr\" style=\"display: none;\">" + rb.getText("CALENDAR_DIALOG") + "</span>");

		if (oMonth.getIntervalSelection()) {
			oRm.write("<span id=\"" + sId + "-Start\" style=\"display: none;\">" + rb.getText("CALENDAR_START_DATE") + "</span>");
			oRm.write("<span id=\"" + sId + "-End\" style=\"display: none;\">" + rb.getText("CALENDAR_END_DATE") + "</span>");
		}

		this.renderMonth(oRm, oMonth, oDate);

		oRm.write("</div>");

	};

	MonthRenderer.getStartDate = function(oMonth){

		return oMonth._getDate();

	};

	MonthRenderer.getClass = function(){

		var sClasses = "sapUiCalMonthView";
		var sCalendarType = sap.ui.getCore().getConfiguration().getCalendarType();

		if (sCalendarType == sap.ui.core.CalendarType.Islamic) {
			// on Islamic calendar week numbers are not used
			sClasses = sClasses + " sapUiCalNoWeekNum";
		}

		return sClasses;

	};

	MonthRenderer.renderMonth = function(oRm, oMonth, oDate){

		var sId = oMonth.getId();

		// header line
		this.renderHeader(oRm, oMonth, oDate);

		// days
		oRm.write("<div id=\"" + sId + "-days\" class=\"sapUiCalItems\">"); // extra DIV around the days to allow rerendering only it's content
		this.renderDays(oRm, oMonth, oDate);
		oRm.write("</div>");

	};

	MonthRenderer.renderHeader = function(oRm, oMonth, oDate){

		var oLocaleData = oMonth._getLocaleData();
		var iFirstDayOfWeek = oMonth._getFirstDayOfWeek();
		var sId = oMonth.getId();
		var rb = sap.ui.getCore().getLibraryResourceBundle("sap.ui.unified");

		// header
		this.renderHeaderLine(oRm, oMonth, oLocaleData, oDate);

		oRm.write("<div");
		oRm.writeAttribute("id", sId + "-CW");
		oRm.addStyle("display", "none");
		oRm.writeStyles();
		oRm.writeAccessibilityState(null, {role: "columnheader"});
		oRm.write(">"); // div
		oRm.write(rb.getText("CALENDAR_WEEK"));
		oRm.write("</div>");

		oRm.write("<div");
		oRm.writeAccessibilityState(null, {role: "row"});
		oRm.write(">"); // div

		this.renderDayNames(oRm, oMonth, oLocaleData, iFirstDayOfWeek, 7, true, undefined);

		oRm.write("</div>");

	};

	MonthRenderer.renderHeaderLine = function(oRm, oMonth, oLocaleData, oDate){

		if (oMonth._getShowHeader()) {
			var sId = oMonth.getId();
			var aMonthNames = oLocaleData.getMonthsStandAlone("wide");
			oRm.write("<div id=\"" + sId + "-Head\"class=\"sapUiCalHeadText\" >");
			oRm.write(aMonthNames[oDate.getUTCMonth()]);
			oRm.write("</div>");
		}

	};

	MonthRenderer.renderDayNames = function(oRm, oMonth, oLocaleData, iStartDay, iDays, bDayNumberAsId, sWidth){

		var iFirstDayOfWeek = oMonth._getFirstDayOfWeek();
		var sId = oMonth.getId();
		var sDayId = "";

		var aWeekDays = [];
		if (oMonth._bLongWeekDays || !oMonth._bNamesLengthChecked) {
			aWeekDays = oLocaleData.getDaysStandAlone("abbreviated");
		} else {
			aWeekDays = oLocaleData.getDaysStandAlone("narrow");
		}
		var aWeekDaysWide = oLocaleData.getDaysStandAlone("wide");

		for ( var i = 0; i < iDays; i++) {
			oRm.write("<div");
			oRm.addClass("sapUiCalWH");
			if (bDayNumberAsId) {
				// month mode -> use the day number as ID
				sDayId = sId + "-WH" + ((i + iFirstDayOfWeek) % 7);
			} else {
				// just use counter as ID
				sDayId = sId + "-WH" + i;
			}
			oRm.writeAttribute("id", sDayId );
			if (i == 0) {
				oRm.addClass("sapUiCalFirstWDay");
			}
			if (sWidth) {
				oRm.addStyle("width", sWidth);
			}
			oRm.writeAccessibilityState(null, {role: "columnheader", label: aWeekDaysWide[(i + iStartDay) % 7]});
			oRm.writeClasses();
			oRm.writeStyles();
			oRm.write(">"); // div element
			oRm.write(aWeekDays[(i + iStartDay) % 7]);
			oRm.write("</div>");
		}

	};

	MonthRenderer.renderDays = function(oRm, oMonth, oDate){

		if (!oDate) {
			oDate = oMonth._getFocusedDate();
		}

		var iMonth = oDate.getUTCMonth();
		var oHelper = this.getDayHelper(oMonth, oDate);
		var sCalendarType = sap.ui.getCore().getConfiguration().getCalendarType();
		var bWeekNum = sCalendarType != sap.ui.core.CalendarType.Islamic; // on Islamic calendar week numbers are not used

		// determine weekday of first day in month
		var oFirstDay = new UniversalDate(oDate.getTime());
		oFirstDay.setUTCDate(1);
		var iWeekDay = oFirstDay.getUTCDay();
		var iDaysOldMonth = iWeekDay - oHelper.iFirstDayOfWeek;
		if (iDaysOldMonth < 0) {
			iDaysOldMonth = 7 + iDaysOldMonth;
		}

		if (iDaysOldMonth > 0) {
			// determine first day for display
			oFirstDay.setUTCDate(1 - iDaysOldMonth);
		}

		var oDay = new UniversalDate(oFirstDay.getTime());
		var iNextMonth = (iMonth + 1) % 12;

		do {
			iWeekDay = oDay.getUTCDay();

			if (iWeekDay == oHelper.iFirstDayOfWeek) {
				// begin of row
				oRm.write("<div");
				oRm.writeAccessibilityState(null, {role: "row"});
				oRm.write(">"); // div
			}

			this.renderDay(oRm, oMonth, oDay, oHelper, true, bWeekNum, -1, undefined);

			if (iWeekDay == (oHelper.iFirstDayOfWeek + 6) % 7) {
				// end of row
				oRm.write("</div>");
			}

			oDay.setUTCDate(oDay.getUTCDate() + 1);
		} while (oDay.getUTCMonth() != iNextMonth || oDay.getUTCDay() != oHelper.iFirstDayOfWeek);

	};

	MonthRenderer.getDayHelper = function(oMonth, oDate){

		var oHelper = {};

		oHelper.sLocale = oMonth._getLocale();
		oHelper.oLocaleData = oMonth._getLocaleData();
		oHelper.iMonth = oDate.getUTCMonth();
		oHelper.iYear = oDate.getUTCFullYear();
		oHelper.iFirstDayOfWeek = oMonth._getFirstDayOfWeek();
		oHelper.iWeekendStart = oHelper.oLocaleData.getWeekendStart();
		oHelper.iWeekendEnd = oHelper.oLocaleData.getWeekendEnd();
		oHelper.aNonWorkingDays = oMonth._getNonWorkingDays();
		oHelper.sToday = oHelper.oLocaleData.getRelativeDay(0);
		oHelper.oToday = CalendarUtils._createUniversalUTCDate(new Date());
		oHelper.sId = oMonth.getId();
		oHelper.oFormatLong = oMonth._getFormatLong();

		return oHelper;

	};

	MonthRenderer.renderDay = function(oRm, oMonth, oDay, oHelper, bOtherMonth, bWeekNum, iNumber, sWidth){

		var mAccProps = {
				role: "gridcell",
				selected: false,
				label: "",
				describedby: ""
			};

		var sYyyymmdd = oMonth._oFormatYyyymmdd.format(oDay, true);
		var iWeekDay = oDay.getUTCDay();
		var iSelected = oMonth._checkDateSelected(oDay);
		var oType = oMonth._getDateType(oDay);

		var iWeekNumber = 0;
		if (bWeekNum) {
			iWeekNumber = CalendarUtils.calculateWeekNumber(oDay, oHelper.iYear, oHelper.sLocale, oHelper.oLocaleData);
			mAccProps["describedby"] = oHelper.sId + "-CW" + " " + oHelper.sId + "-WNum-" +  iWeekNumber;
		}

		var sWHId = "";
		if (iNumber < 0) {
			sWHId = oHelper.sId + "-WH" + iWeekDay;
		} else {
			sWHId = oHelper.sId + "-WH" + iNumber;
		}
		mAccProps["describedby"] = mAccProps["describedby"] + " " + sWHId;

		oRm.write("<div");
		oRm.writeAttribute("id", oHelper.sId + "-" + sYyyymmdd);
		oRm.addClass("sapUiCalItem");
		oRm.addClass("sapUiCalWDay" + iWeekDay);
		if (sWidth) {
			oRm.addStyle("width", sWidth);
		}
		if (iWeekDay == oHelper.iFirstDayOfWeek) {
			oRm.addClass("sapUiCalFirstWDay");
		}
		if (bOtherMonth && oHelper.iMonth != oDay.getUTCMonth()) {
			oRm.addClass("sapUiCalItemOtherMonth");
			mAccProps["disabled"] = true;
		}
		if (oDay.getUTCMonth() == oHelper.oToday.getUTCMonth() && oDay.getUTCFullYear() == oHelper.oToday.getUTCFullYear() && oDay.getUTCDate() == oHelper.oToday.getUTCDate()) {
			oRm.addClass("sapUiCalItemNow");
			mAccProps["label"] = oHelper.sToday + " ";
		}

		if (iSelected > 0) {
			oRm.addClass("sapUiCalItemSel"); // day selected
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

		if (oHelper.aNonWorkingDays) {
			for (var i = 0; i < oHelper.aNonWorkingDays.length; i++) {
				if (iWeekDay == oHelper.aNonWorkingDays[i]) {
					oRm.addClass("sapUiCalItemWeekEnd");
					break;
				}
			}
		}else	if ((iWeekDay >= oHelper.iWeekendStart && iWeekDay <= oHelper.iWeekendEnd) ||
				( oHelper.iWeekendEnd < oHelper.iWeekendStart && ( iWeekDay >= oHelper.iWeekendStart || iWeekDay <= oHelper.iWeekendEnd))) {
			oRm.addClass("sapUiCalItemWeekEnd");
		}
		oRm.writeAttribute("tabindex", "-1");
		oRm.writeAttribute("data-sap-day", sYyyymmdd);
		mAccProps["label"] = mAccProps["label"] + oHelper.oFormatLong.format(oDay, true);
		oRm.writeAccessibilityState(null, mAccProps);
		oRm.writeClasses();
		oRm.writeStyles();
		oRm.write(">"); // div element

		oRm.write("<span");
		oRm.addClass("sapUiCalItemText");
		oRm.writeClasses();
		oRm.write(">"); // span
		oRm.write(oDay.getUTCDate());
		oRm.write("</span>");

		if (bWeekNum && iWeekDay == oHelper.iFirstDayOfWeek) {
			// add week number - inside first day of the week to allow better position and make it easier for ItemNavigation
			oRm.write("<span");
			oRm.writeAttribute("id", oHelper.sId + "-WNum-" +  iWeekNumber);
			oRm.addClass("sapUiCalWeekNum");
			oRm.writeClasses();
			oRm.writeAccessibilityState(null, {role: "rowheader", desribedby: oHelper.sId + "-CW"});
			oRm.write(">"); // span
			oRm.write(iWeekNumber);
			oRm.write("</span>");
		}

		oRm.write("</div>");

	};

	return MonthRenderer;

}, /* bExport= */ true);
