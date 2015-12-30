/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides class sap.ui.core.date.IslamicDate
sap.ui.define(['jquery.sap.global', 'sap/ui/base/Object'],
	function (jQuery, BaseObject) {
		"use strict";

		var BASE_YEAR = 1400, // used for 2 digits "year" related method
			GREGORIAN_EPOCH_DAYS = 1721425.5, // Julian days since noon on January 1, 4713 BC
			ISLAMIC_EPOCH_DAYS = 1948439.5,   // Julian days since noon on January 1, 4713 BC
			ISLAMIC_MILLIS = -42521587200000, // 7/16/622
			ONE_DAY = 86400000;

		var oCustomizationMap = null;

		/**
		 * Constructor for IslamicDate
		 *
		 * This object represents dates in Islamic Calendar. It is also known as "Hijri" calendar, since it starts at
		 * the time of Mohammed's emigration (or "hijra") to Medina on Thursday, July 16, 622 AD (Julian) or July 19,
		 * 622 AD(Gregorian).
		 *
		 * They are various variants of the calendar. Supported is a Religios calendar where records for observations of
		 * the moon are obtained from ABAP back-end.
		 *
		 * For more information, see {@link http://en.wikipedia.org/wiki/Islamic_calendar}
		 * @class
		 * @see [CLDR calendar types]{@link http://www.unicode.org/reports/tr35/#Key_And_Type_Definitions_}
		 * @author SAP SE
		 * @version 1.32.9
		 * @since 1.28.6
		 * @extends sap.ui.base.Object
		 * @alias sap.ui.core.date.IslamicDate
		 * @private
		 */
		var IslamicDate = BaseObject.extend("sap.ui.core.date.IslamicDate", /** @lends sap.ui.core.date.IslamicDate.prototype */  {

			constructor: function () {
				if (!oCustomizationMap) {
					this.initCustomizationMap();
				}

				if (!this || !(this instanceof IslamicDate)) {
					return new IslamicDate().toString();
				}

				BaseObject.apply(this);

				this._year = 1;
				this._month = 0;
				this._date = 1;
				this._hours = 0;
				this._minutes = 0;
				this._seconds = 0;
				this._milliseconds = 0;

				var iArgsLength = arguments.length;
				if (!iArgsLength) {
					// called as "new IslamicDate()"
					this._fromGregorian(new Date());
				} else if (iArgsLength == 1 && typeof arguments[0] == "number") {
					// called as "new IslamicDate(value)"
					this._fromGregorian(new Date(arguments[0]));
				} else if (iArgsLength >= 2) {
					// called as "new IslamicDate(year, month[, day[, hour[, minutes[, seconds[, milliseconds]]]]])"
					this.setYear(arguments[0]);
					this.setMonth(arguments[1]);

					if (arguments[2]) {
						this.setDate(arguments[2]);
					} else {
						this.setDate(arguments[2] === 0 ? 0 : 1);
					}

					this.setHours(arguments[3] ? arguments[3] : 0);
					this.setMinutes(arguments[4] ? arguments[4] : 0);
					this.setSeconds(arguments[5] ? arguments[5] : 0);
					this.setMilliseconds(arguments[6] ? arguments[6] : 0);
				} else {
					throw new Error("Invalid Date");
				}
			}
		});

		function parseDateArgument(arg) {
			if (typeof arg == "number") {
				return arg;
			}
			var iValue = parseInt(arg, 10);
			if (isNaN(iValue)) {
				throw new Error("Invalid Date");
			}
			return iValue;
		}

		IslamicDate.prototype.getDate = function () {
			return this._date;
		};

		IslamicDate.prototype.getMonth = function () {
			return this._month;
		};

		IslamicDate.prototype.getFullYear = function () {
			return this._year;
		};

		IslamicDate.prototype.getYear = function () {
			return this._year - BASE_YEAR;
		};

		IslamicDate.prototype.getDay = function () {
			return this._toGregorian().getDay();
		};

		IslamicDate.prototype.getHours = function () {
			return this._hours;
		};

		IslamicDate.prototype.getMinutes = function () {
			return this._minutes;
		};

		IslamicDate.prototype.getSeconds = function () {
			return this._seconds;
		};

		IslamicDate.prototype.getMilliseconds = function () {
			return this._milliseconds;
		};

		IslamicDate.prototype.getTime = function () {
			return this._toGregorian().getTime();
		};

		IslamicDate.prototype.setDate = function (date) {
			date = parseDateArgument(date);
			if (date > 0 && date <= this.getMonthLength(this._month, this._year)) {
				this._date = date;
			} else {
				var iDaysInIslamicMonth;
				if (date > 0) {
					for (iDaysInIslamicMonth = this.getMonthLength(this._month, this._year);
						 date > iDaysInIslamicMonth;
						 date -= iDaysInIslamicMonth, iDaysInIslamicMonth = this.getMonthLength(this._month, this._year)) {
						this._month++;
						if (this._month >= 12) {
							this._year++;
							this._month -= 12;
						}
					}
					this._date = date;
				} else {
					for (iDaysInIslamicMonth = this.getMonthLength((this._month - 1) >= 0 ? (this._month - 1) : 11, ((this._month - 1) >= 0) ? this._year : this._year - 1);
						 date <= 0;
						 iDaysInIslamicMonth = this.getMonthLength((this._month - 1) >= 0 ? (this._month - 1) : 11, ((this._month - 1) >= 0) ? this._year : this._year - 1)) {
						this._month--;
						if (this._month < 0) {
							this._year--;
							this._month += 12;
						}
						date += iDaysInIslamicMonth;
					}
					this._date = date;
				}
			}
			return this.getTime();
		};

		IslamicDate.prototype.setFullYear = function (year) {
			year = parseDateArgument(year);
			this._year = year;
			return callChildSetterIfNeeded.call(this, arguments, "setMonth");
		};

		IslamicDate.prototype.setYear = function (year) {
			year = parseDateArgument(year);
			if (year > 99) {
				return this.setFullYear(year);
			} else {
				return this.setFullYear(BASE_YEAR + year);
			}
		};

		IslamicDate.prototype.setMonth = function (month) {
			month = parseDateArgument(month);
			var result = calculateValue(month, 12);
			this._month = result.iValue;
			if (result.iAddend) {
				this.setFullYear(this.getFullYear() + result.iAddend);
			}
			return callChildSetterIfNeeded.call(this, arguments, "setDate");
		};

		IslamicDate.prototype.setHours = function () {
			var iArgsLength = arguments.length;
			if (iArgsLength >= 1) {
				var iHours = parseDateArgument(arguments[0]);
				var oComputedHours = calculateValue(iHours, 24);
				this._hours = oComputedHours.iValue;
				if (oComputedHours.iAddend) {
					this.setDate(this.getDate() + oComputedHours.iAddend);
				}
			}
			return callChildSetterIfNeeded.call(this, arguments, "setMinutes");
		};

		IslamicDate.prototype.setMinutes = function (minutes) {
			minutes = parseDateArgument(minutes);
			var oCalculatedValue = calculateValue(minutes, 60);
			this._minutes = oCalculatedValue.iValue;
			if (oCalculatedValue.iAddend) {
				this.setHours(this.getHours() + oCalculatedValue.iAddend);
			}
			return callChildSetterIfNeeded.call(this, arguments, "setSeconds");
		};

		IslamicDate.prototype.setSeconds = function (seconds) {
			seconds = parseDateArgument(seconds);
			var oCalculatedValue = calculateValue(seconds, 60);
			this._seconds = oCalculatedValue.iValue;
			if (oCalculatedValue.iAddend) {
				this.setMinutes(this.getMinutes() + oCalculatedValue.iAddend);
			}
			return callChildSetterIfNeeded.call(this, arguments, "setMilliseconds");
		};

		IslamicDate.prototype.setMilliseconds = function (milliseconds) {
			milliseconds = parseDateArgument(milliseconds);
			var oCalculatedValue = calculateValue(milliseconds, 1000);
			this._milliseconds = oCalculatedValue.iValue;
			if (oCalculatedValue.iAddend) {
				this.setSeconds(this.getSeconds() + oCalculatedValue.iAddend);
			}
			return this.getTime();
		};

		/**
		 * Example:
		 *     returns value if value between 0 and maxValue:
		 *         calculateValue(11, 24) -> { 11, 0 } // for hours
		 *         calculateValue(25, 24) -> { 1, 1 }
		 *
		 * @param value
		 * @param maxValue
		 * @private
		 * @returns {{iValue: number, iAddend: number}} value if value between 0 and maxValue
		 */
		function calculateValue(value, maxValue) {
			var iResult = 0;
			if (value > 0) {
				iResult = Math.floor(value % maxValue);
			} else {
				iResult = Math.floor(((value % maxValue) + maxValue) % maxValue);
			}
			return {
				iValue: iResult,
				iAddend: Math.floor(value / maxValue)
			};
		}

		IslamicDate.prototype._toGregorian = function (bUTC) {
			var iIslamicYear = this._year,
				iIslamicMonth = this._month,
				iIslamicDate = this._date,
				iJulianDay = iIslamicDate + this.getCustomMonthStartDays(12 * (iIslamicYear - 1) + iIslamicMonth) + ISLAMIC_EPOCH_DAYS - 1,
				iJulianDayNoon = Math.floor(iJulianDay - 0.5) + 0.5,
				iDaysSinceGregorianEpoch = iJulianDayNoon - GREGORIAN_EPOCH_DAYS,
				iQuadricent = Math.floor(iDaysSinceGregorianEpoch / 146097),
				iQuadricentNormalized = this._mod(iDaysSinceGregorianEpoch, 146097),
				iCent = Math.floor(iQuadricentNormalized / 36524),
				iCentNormalized = this._mod(iQuadricentNormalized, 36524),
				iQuad = Math.floor(iCentNormalized / 1461),
				iQuadNormalized = this._mod(iCentNormalized, 1461),
				iYearIndex = Math.floor(iQuadNormalized / 365),
				iYear = (iQuadricent * 400) + (iCent * 100) + (iQuad * 4) + iYearIndex;

			if (!(iCent == 4 || iYearIndex == 4)) {
				iYear++;
			}

			var iGregorianYearStartDays = GREGORIAN_EPOCH_DAYS + (365 * (iYear - 1)) + Math.floor((iYear - 1) / 4)
				- ( Math.floor((iYear - 1) / 100)) + Math.floor((iYear - 1) / 400);

			var iDayOfYear = iJulianDayNoon - iGregorianYearStartDays;

			var tjd = (GREGORIAN_EPOCH_DAYS - 1) + (365 * (iYear - 1)) + Math.floor((iYear - 1) / 4)
				- ( Math.floor((iYear - 1) / 100)) + Math.floor((iYear - 1) / 400) + Math.floor((739 / 12)
				+ ( (this._isGregorianLeapYear(new Date(iYear, 3, 1), bUTC) ? -1 : -2)) + 1);

			var iLeapAdj = 0;
			if (iJulianDayNoon < tjd) {
				iLeapAdj = 0;
			} else {
				iLeapAdj = this._isGregorianLeapYear(new Date(iYear, 3, 1), bUTC) ? 1 : 2;
			}

			var iMonth = Math.floor((((iDayOfYear + iLeapAdj) * 12) + 373) / 367);

			var tjd2 = (GREGORIAN_EPOCH_DAYS - 1) + (365 * (iYear - 1))
				+ Math.floor((iYear - 1) / 4) - (Math.floor((iYear - 1) / 100))
				+ Math.floor((iYear - 1) / 400);

			var iLeapAdj2 = 0;
			if (iMonth > 2) {
				iLeapAdj2 = this._isGregorianLeapYear(new Date(iYear, (iMonth - 1), 1), bUTC) ? -1 : -2;
			}
			tjd2 += Math.floor((((367 * iMonth) - 362) / 12) + iLeapAdj2 + 1);

			var iDay = (iJulianDayNoon - tjd2) + 1;

			if (bUTC) {
				return new Date(Date.UTC(iYear, (iMonth - 1), iDay, this._hours, this._minutes, this._seconds, this._milliseconds));
			}
			return new Date(iYear, (iMonth - 1), iDay, this._hours, this._minutes, this._seconds, this._milliseconds);
		};

		IslamicDate.prototype._fromGregorian = function (oGregorianDate, bUTC) {
			var oDate = new Date(oGregorianDate.getTime());
			var iGregorianYear = bUTC ? oDate.getUTCFullYear() : oDate.getFullYear(),
				iGregorianMonth = bUTC ? oDate.getUTCMonth() : oDate.getMonth(),
				iGregorianDay = bUTC ? oDate.getUTCDate() : oDate.getDate();

			var iLeapAdj = 0;
			if ((iGregorianMonth + 1) > 2) {
				iLeapAdj = (this._isGregorianLeapYear(oDate, bUTC) ? -1 : -2);
			}
			var iJulianDay = (GREGORIAN_EPOCH_DAYS - 1) + (365 * (iGregorianYear - 1)) + Math.floor((iGregorianYear - 1) / 4)
				+ (-Math.floor((iGregorianYear - 1) / 100)) + Math.floor((iGregorianYear - 1) / 400)
				+ Math.floor((((367 * (iGregorianMonth + 1)) - 362) / 12)
				+ iLeapAdj + iGregorianDay);

			iJulianDay = Math.floor(iJulianDay) + 0.5;

			var iDays = iJulianDay - ISLAMIC_EPOCH_DAYS;

			// guess the month start
			var iMonths = Math.floor(iDays / 29.530588853); // day/CalendarAstronomer.SYNODIC_MONTH

			/*
			 * Always also check the next month, since customization can
			 * differ. It can differ for not more than 3 days. so that
			 * checking the next month is enough.
			 */
			iMonths++;

			/*
			 * Check the true month start for the given month. If it is
			 * later, check the previous month, until a suitable is found.
			 */
			while (this.getCustomMonthStartDays(iMonths) > iDays) {
				iMonths--;
			}

			var iIslamicYear = Math.floor(iMonths / 12) + 1;
			var iIslamicMonth = iMonths % 12;
			var iIslamicDay = (iDays - this.getCustomMonthStartDays(12 * (iIslamicYear - 1) + iIslamicMonth)) + 1;

			this._date = iIslamicDay;
			this._month = iIslamicMonth;
			this._year = iIslamicYear;
			this._hours = bUTC ? oDate.getUTCHours() : oDate.getHours();
			this._minutes = bUTC ? oDate.getUTCMinutes() : oDate.getMinutes();
			this._seconds = bUTC ? oDate.getUTCSeconds() : oDate.getSeconds();
			this._milliseconds = bUTC ? oDate.getUTCMilliseconds() : oDate.getMilliseconds();

			return this;
		};

		IslamicDate.prototype.valueOf = function () {
			return this._toGregorian().valueOf();
		};

		IslamicDate.prototype.initCustomizationMap = function () {
			var sDateFormat,
				oCustomizationJSON;

			oCustomizationMap = {};

			sDateFormat = sap.ui.getCore().getConfiguration().getFormatSettings().getLegacyDateFormat();
			oCustomizationJSON = sap.ui.getCore().getConfiguration().getFormatSettings().getLegacyDateCalendarCustomizing();
			oCustomizationJSON = oCustomizationJSON || [];

			if (!sDateFormat && !oCustomizationJSON.length) {//working with no customization
				jQuery.sap.log.info("No calendar customizations.");
				return;
			}

			if ((sDateFormat && !oCustomizationJSON.length) || (!sDateFormat && oCustomizationJSON.length)) {
				jQuery.sap.log.warning("There is a inconsistency between customization data [" + JSON.stringify(oCustomizationJSON) +
				"] and the date format [" + sDateFormat + "]. Calendar customization won't be used.");
				return;
			}

			oCustomizationJSON.forEach(function (oEntry) {
				if (oEntry.dateFormat === sDateFormat) {
					var date = parseDate(oEntry.gregDate);
					var iGregorianDate = new Date(Date.UTC(date.year, date.month - 1, date.day));
					var iMillis = iGregorianDate.getTime();
					var iIslamicMonthStartDays = (iMillis - ISLAMIC_MILLIS) / ONE_DAY;

					date = parseDate(oEntry.islamicMonthStart);
					var iIslamicMonths = (date.year - 1) * 12 + date.month - 1;

					oCustomizationMap[iIslamicMonths] = iIslamicMonthStartDays;
				}
			});
			jQuery.sap.log.info("Working with date format: [" + sDateFormat + "] and customization: " + JSON.stringify(oCustomizationJSON));
		};

		function parseDate(sDate) {
			return {
				year: parseDateArgument(sDate.substr(0, 4)),
				month: parseDateArgument(sDate.substr(4, 2)),
				day: parseDateArgument(sDate.substr(6, 2))
			};
		}

		IslamicDate.prototype.getCustomMonthStartDays = function (months) {
			var iIslamicMonthStartDays = oCustomizationMap[months];
			if (!iIslamicMonthStartDays) {
				var year = Math.floor(months / 12) + 1;
				var month = months % 12;
				iIslamicMonthStartDays = this._monthStart(year, month);
			}
			return iIslamicMonthStartDays;
		};

		IslamicDate.prototype._monthStart = function (year, month) {
			return Math.ceil(29.5 * month) + (year - 1) * 354 + Math.floor((3 + 11 * year) / 30.0);
		};

		IslamicDate.prototype._civilLeapYear = function (year) {
			return (14 + 11 * year) % 30 < 11;
		};

		IslamicDate.prototype.getMonthLength = function (month, year) {
			var iIslamicMonths = (year - 1) * 12 + month;
			var iIslamicDays = this.getCustomMonthStartDays(iIslamicMonths);
			if (iIslamicDays) {
				return (this.getCustomMonthStartDays(iIslamicMonths + 1) - iIslamicDays);
			} else {
				var iLength = 0;
				iLength = 29 + ((month + 1) % 2);
				if (month == 11 && this._civilLeapYear(year)) {
					iLength++;
				}
				return iLength;
			}
		};

		IslamicDate.prototype._mod = function (a, b) {
			return a - (b * Math.floor(a / b));
		};

		IslamicDate.prototype._isGregorianLeapYear = function (date, bUTC) {
			var year = bUTC ? date.getUTCFullYear() : date.getFullYear();
			return !(year % 400) || (!(year % 4) && !!(year % 100));
		};

		IslamicDate.now = function () {
			return new IslamicDate().getTime();
		};

		IslamicDate.prototype.getTimezoneOffset = function () {
			return this._toGregorian().getTimezoneOffset();
		};

		IslamicDate.prototype.getUTCDate = function () {
			var oIslamicDate = new IslamicDate()._fromGregorian(this._toGregorian(), true);
			return oIslamicDate.getDate();
		};

		IslamicDate.prototype.getUTCMonth = function () {
			var oIslamicDate = new IslamicDate()._fromGregorian(this._toGregorian(), true);
			return oIslamicDate.getMonth();
		};

		IslamicDate.prototype.getUTCFullYear = function () {
			var oIslamicDate = new IslamicDate()._fromGregorian(this._toGregorian(), true);
			return oIslamicDate.getFullYear();
		};

		IslamicDate.prototype.getUTCDay = function () {
			var oIslamicDate = new IslamicDate()._fromGregorian(this._toGregorian(), true);
			return oIslamicDate.getDay();
		};

		IslamicDate.prototype.getUTCHours = function () {
			var oIslamicDate = new IslamicDate()._fromGregorian(this._toGregorian(), true);
			return oIslamicDate.getHours();
		};

		IslamicDate.prototype.getUTCMinutes = function () {
			var oIslamicDate = new IslamicDate()._fromGregorian(this._toGregorian(), true);
			return oIslamicDate.getMinutes();
		};

		IslamicDate.prototype.getUTCSeconds = function () {
			var oIslamicDate = new IslamicDate()._fromGregorian(this._toGregorian(), true);
			return oIslamicDate.getSeconds();
		};

		IslamicDate.prototype.getUTCMilliseconds = function () {
			var oIslamicDate = new IslamicDate()._fromGregorian(this._toGregorian(), true);
			return oIslamicDate.getMilliseconds();
		};

		IslamicDate.prototype.setUTCFullYear = function (year, month, date) {
			//Bare in mind that oDate.setUTCFullYear(y, m, d) is not the same as calling consequently oDate.setUTCFullYear(y), oDate.setUTCMonth(m), oDate.setDate(d)
			var iMonth = arguments.length >= 2 ? month : this.getUTCMonth();
			var iDate = arguments.length >= 3 ? date : this.getUTCDate();
			var oTempIslamicUTC = new IslamicDate(IslamicDate.UTC(year, iMonth, iDate, this.getUTCHours(), this.getUTCMinutes(), this.getUTCSeconds(), this.getUTCMilliseconds()));
			updateLocalFields.call(this, oTempIslamicUTC);
			return this.getTime();
		};

		IslamicDate.prototype.setUTCMonth = function (month, date) {
			//Bare in mind that oDate.setUTCMonth(m, d) is not the same as calling consequently oDate.setUTCMonth(m), oDate.setDate(d)
			var iDate = arguments.length >= 2 ? date : this.getUTCDate();
			var oTempIslamicUTC = new IslamicDate(IslamicDate.UTC(this.getUTCFullYear(), month, iDate, this.getUTCHours(), this.getUTCMinutes(), this.getUTCSeconds(), this.getUTCMilliseconds()));
			updateLocalFields.call(this, oTempIslamicUTC);
			return this.getTime();
		};

		IslamicDate.prototype.setUTCDate = function (date) {
			var oTempIslamicUTC = new IslamicDate(IslamicDate.UTC(this.getUTCFullYear(), this.getUTCMonth(), date, this.getUTCHours(), this.getUTCMinutes(), this.getUTCSeconds(), this.getUTCMilliseconds()));
			updateLocalFields.call(this, oTempIslamicUTC);
			return this.getTime();
		};

		IslamicDate.prototype.setUTCHours = function (hours) {
			var oTempIslamicUTC = new IslamicDate(IslamicDate.UTC(this.getUTCFullYear(), this.getUTCMonth(), this.getUTCDate(), hours, this.getUTCMinutes(), this.getUTCSeconds(), this.getUTCMilliseconds()));
			updateLocalFields.call(this, oTempIslamicUTC);
			return callChildSetterIfNeeded.call(this, arguments, "setUTCMinutes");
		};

		IslamicDate.prototype.setUTCMinutes = function (minutes) {
			var oTempIslamicUTC = new IslamicDate(IslamicDate.UTC(this.getUTCFullYear(), this.getUTCMonth(), this.getUTCDate(), this.getUTCHours(), minutes, this.getUTCSeconds(), this.getUTCMilliseconds()));
			updateLocalFields.call(this, oTempIslamicUTC);
			return callChildSetterIfNeeded.call(this, arguments, "setUTCSeconds");
		};

		IslamicDate.prototype.setUTCSeconds = function (seconds) {
			var oTempIslamicUTC = new IslamicDate(IslamicDate.UTC(this.getUTCFullYear(), this.getUTCMonth(), this.getUTCDate(), this.getUTCHours(), this.getUTCMinutes(), seconds, this.getUTCMilliseconds()));
			updateLocalFields.call(this, oTempIslamicUTC);
			return callChildSetterIfNeeded.call(this, arguments, "setUTCMilliseconds");
		};

		IslamicDate.prototype.setUTCMilliseconds = function (milliseconds) {
			var oTempIslamicUTC = new IslamicDate(IslamicDate.UTC(this.getUTCFullYear(), this.getUTCMonth(), this.getUTCDate(), this.getUTCHours(), this.getUTCMinutes(), this.getUTCSeconds(), milliseconds));
			updateLocalFields.call(this, oTempIslamicUTC);
			return this.getTime();
		};

		IslamicDate.UTC = function () {
			var oIslamicDate = new IslamicDate(
				arguments[0],
				arguments[1],
				arguments[2],
				arguments[3],
				arguments[4],
				arguments[5],
				arguments[6]
				),
				oGregorianDate = oIslamicDate._toGregorian(true);

			return oGregorianDate.getTime();
		};

		IslamicDate.prototype.toString = function (bUTC) {
			var oGregorianDate = new Date(this.getTime());
			return (bUTC ? "UTC" : "Local") + " Islamic Date:" +
				formatDateTime(String(bUTC ? this.getUTCFullYear() : this.getFullYear()),
					String(bUTC ? (this.getUTCMonth() + 1) : (this.getMonth() + 1)),
					String(bUTC ? this.getUTCDate() : this.getDate()),
					String(bUTC ? this.getUTCDay() : this.getDay()),
					String(bUTC ? this.getUTCHours() : this.getHours()),
					String(bUTC ? this.getUTCMinutes() : this.getMinutes()),
					String(bUTC ? this.getUTCSeconds() : this.getSeconds()),
					String(bUTC ? this.getUTCMilliseconds() : this.getMilliseconds())) + "; Gregorian: " +
				formatDateTime(String(bUTC ? oGregorianDate.getUTCFullYear() : oGregorianDate.getFullYear()),
					String(bUTC ? (oGregorianDate.getUTCMonth() + 1) : (oGregorianDate.getMonth() + 1)),
					String(bUTC ? oGregorianDate.getUTCDate() : oGregorianDate.getDate()),
					String(bUTC ? oGregorianDate.getUTCDay() : oGregorianDate.getDay()),
					String(bUTC ? oGregorianDate.getUTCHours() : oGregorianDate.getHours()),
					String(bUTC ? oGregorianDate.getUTCMinutes() : oGregorianDate.getMinutes()),
					String(bUTC ? oGregorianDate.getUTCSeconds() : oGregorianDate.getSeconds()),
					String(bUTC ? oGregorianDate.getUTCMilliseconds() : oGregorianDate.getMilliseconds()));
		};

		IslamicDate.parse = function () {
		};
		IslamicDate.prototype.toDateString = function () {
		};
		IslamicDate.prototype.toGMTString = function () {
		};
		IslamicDate.prototype.toISOString = function () {
		};
		IslamicDate.prototype.toJSON = function () {
		};
		IslamicDate.prototype.toLocaleDateString = function () {
		};
		IslamicDate.prototype.toLocaleString = function () {
		};
		IslamicDate.prototype.toLocaleTimeString = function () {
		};
		IslamicDate.prototype.toTimeString = function () {
		};
		IslamicDate.prototype.toUTCString = function () {
		};


		function updateLocalFields(oFromIslamicDate, bUTC) {
			this._year = bUTC ? oFromIslamicDate.getUTCFullYear() : oFromIslamicDate.getFullYear();
			this._month = bUTC ? oFromIslamicDate.getUTCMonth() : oFromIslamicDate.getMonth();
			this._date = bUTC ? oFromIslamicDate.getUTCDate() : oFromIslamicDate.getDate();
			this._hours = bUTC ? oFromIslamicDate.getUTCHours() : oFromIslamicDate.getHours();
			this._minutes = bUTC ? oFromIslamicDate.getUTCMinutes() : oFromIslamicDate.getMinutes();
			this._seconds = bUTC ? oFromIslamicDate.getUTCSeconds() : oFromIslamicDate.getSeconds();
			this._milliseconds = bUTC ? oFromIslamicDate.getUTCMilliseconds() : oFromIslamicDate.getMilliseconds();
		}

		function formatDateTime(year, month, date, day, hours, minutes, seconds, milliseconds) {
			return jQuery.sap.padLeft(String(year), "0", 4) + "/" +
				jQuery.sap.padLeft(String(month), "0", 2) + "/" +
				jQuery.sap.padLeft(String(date), "0", 2) + "(" + day + ") " +
				jQuery.sap.padLeft(String(hours), "0", 2) + ":" +
				jQuery.sap.padLeft(String(minutes), "0", 2) + ":" +
				jQuery.sap.padLeft(String(seconds), "0", 2) + "." +
				jQuery.sap.padLeft(String(milliseconds), "0", 4);
		}

		/**
		 * Calls additional (lower in the hierarchy) function if there is at least one optional parameter
		 * @private
		 * @param aPreviousArgs the list of all arguments used in parent's call
		 * @param sSetterName the name of the function to call
		 * @returns {int} the timestamp corresponding to the last values of this
		 */
		function callChildSetterIfNeeded(aPreviousArgs, sSetterName) {
			if (aPreviousArgs.length == 1) {
				return this.getTime();
			} else {
				return IslamicDate.prototype[sSetterName].apply(this, Array.prototype.slice.call(aPreviousArgs, 1));
			}
		}

		return IslamicDate;
	});
