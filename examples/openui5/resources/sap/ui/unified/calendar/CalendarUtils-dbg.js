/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

/**
 * Calendar Utility Class
 *
 * @namespace
 * @name sap.ui.unified.calendar
 * @public
 */

// Provides class sap.ui.unified.caledar.CalendarUtils
sap.ui.define(['jquery.sap.global', 'sap/ui/core/format/DateFormat', 'sap/ui/core/date/UniversalDate'],
	function(jQuery, DateFormat, UniversalDate) {
	"use strict";

	// Static class

	/**
	 * @alias sap.ui.unified.caledar.CalendarUtils
	 * @namespace
	 * @private
	 */
	var CalendarUtils = {};

	/**
	 * Creates a Date in local timezone from UTC timezone
	 * @param {Date} oDate in UTC timezone
	 * @param {boolean} bTime if set the time part of the date will be used too, otherwise it will be initial
	 * @return {Date} in local timezone
	 * @private
	 */
	CalendarUtils._createLocalDate = function(oDate, bTime) {

		var oLocaleDate;

		if (oDate) {
			var oMyDate;

			if (oDate instanceof UniversalDate) {
				oMyDate = new Date(oDate.getTime());
			}else {
				oMyDate = oDate;
			}

			oLocaleDate = new Date(oMyDate.getUTCFullYear(), oMyDate.getUTCMonth(), oMyDate.getUTCDate());
			if (oMyDate.getFullYear() < 1000) {
				oLocaleDate.setFullYear(oMyDate.getFullYear());
			}

			if (bTime) {
				oLocaleDate.setHours(oMyDate.getUTCHours());
				oLocaleDate.setMinutes(oMyDate.getUTCMinutes());
				oLocaleDate.setSeconds(oMyDate.getUTCSeconds());
				oLocaleDate.setMilliseconds(oMyDate.getUTCMilliseconds());
			}
		}

		return oLocaleDate;

	};

	/**
	 * Creates a Date in UTC timezone from local timezone
	 * @param {Date} oDate in local timezone
	 * @param {boolean} bTime if set the time part of the date will be used too, otherwise it will be initial
	 * @return {Date} in UTC timezone
	 * @private
	 */
	CalendarUtils._createUTCDate = function(oDate, bTime) {

		var oUTCDate;

		if (oDate) {
			var oMyDate;

			if (oDate instanceof UniversalDate) {
				oMyDate = new Date(oDate.getTime());
			}else {
				oMyDate = oDate;
			}

			oUTCDate = new Date(Date.UTC(oMyDate.getFullYear(), oMyDate.getMonth(), oMyDate.getDate()));
			if (oMyDate.getFullYear() < 1000) {
				oUTCDate.setUTCFullYear(oMyDate.getFullYear());
			}

			if (bTime) {
				oUTCDate.setUTCHours(oMyDate.getHours());
				oUTCDate.setUTCMinutes(oMyDate.getMinutes());
				oUTCDate.setUTCSeconds(oMyDate.getSeconds());
				oUTCDate.setUTCMilliseconds(oMyDate.getMilliseconds());
			}
		}

		return oUTCDate;

	};

	/**
	 * Creates a Date in UTC timezone from local timezone
	 * @param {Date} oDate in local timezone
	 * @param {boolean} bTime if set the time part of the date will be used too, otherwise it will be initial
	 * @return {UniversalDate} in UTC timezone
	 * @private
	 */
	CalendarUtils._createUniversalUTCDate = function(oDate, bTime) {

		var oUTCDate = new UniversalDate(this._createUTCDate(oDate, bTime).getTime());
		return oUTCDate;

	};

	/**
	 * Calculates the week number for a date
	 * @param {Date} oDate date to get week number
	 * @param {int} iYear year for the week number. (In en-US the week number for the last Days in December depends on the year.)
	 * @param {string} sLocale used locale
	 * @param {object} oLocaleData locale date for used locale
	 * @return {integer} week number
	 * @private
	 */
	CalendarUtils.calculateWeekNumber = function(oDate, iYear, sLocale, oLocaleData){

		return DateFormat.calculateWeekNumber(oDate, {
			UTC: true,
			baseYear: iYear,
			locale: sLocale
		});

	};

	return CalendarUtils;

}, /* bExport= */ true);
