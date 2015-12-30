/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.unified.Calendar.
sap.ui.define(['jquery.sap.global', 'sap/ui/core/Control', 'sap/ui/core/LocaleData', 'sap/ui/model/type/Date', 'sap/ui/unified/calendar/CalendarUtils',
               './Calendar', './calendar/Header', './calendar/Month', './calendar/DatesRow', './calendar/MonthPicker', './calendar/YearPicker', 'sap/ui/core/date/UniversalDate', './library'],
	function(jQuery, Control, LocaleData, Date1, CalendarUtils, Calendar, Header, Month, DatesRow, MonthPicker, YearPicker, UniversalDate, library) {
	"use strict";

	/**
	 * Constructor for a new Calendar.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * Calendar with dates displayed in one line.
	 * @extends sap.ui.unified.Calendar
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @since 1.30.0
	 * @alias sap.ui.unified.CalendarDateInterval
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var CalendarDateInterval = Calendar.extend("sap.ui.unified.CalendarDateInterval", /** @lends sap.ui.unified.CalendarDateInterval.prototype */ { metadata : {

		library : "sap.ui.unified",
		properties : {

			/**
			 * Start date of the Interval
			 */
			startDate : {type : "object", group : "Misc"},

			/**
			 * number of days displayed
			 * on phones the maximum rendered number of days is 8.
			 */
			days : {type : "int", group : "Misc", defaultValue : 7},

			/**
			 * Width of Calendar
			 */
			width : {type : "sap.ui.core.CSSSize", group : "Dimension", defaultValue : null}

		}
	}});

	(function() {

		CalendarDateInterval.prototype.init = function(){

			Calendar.prototype.init.apply(this, arguments);

			var oMonthPicker = this.getAggregation("monthPicker");
			oMonthPicker.setColumns(0);
			oMonthPicker.setMonths(3); // default for 7 days

			var oYearPicker = this.getAggregation("yearPicker");
			oYearPicker.setColumns(0);
			oYearPicker.setYears(3); // default for 7 days

			this._iDaysLarge = 10; // if more than this number of days are displayed, start and end month are displayed on the button
			this._iDaysMonthHead = 35; // if more than this number of days, month names are displayed on top of days

		};

		CalendarDateInterval.prototype._createMonth = function(sId){

			var oMonth = new DatesRow(sId);

			return oMonth;

		};

		CalendarDateInterval.prototype.setStartDate = function(oStartDate){

			if (!(oStartDate instanceof Date)) {
				throw new Error("Date must be a JavaScript date object; " + this);
			}

			var iYear = oStartDate.getFullYear();
			if (iYear < 1 || iYear > 9999) {
				throw new Error("Date must not be in valid range (between 0001-01-01 and 9999-12-31); " + this);
			}

			var oUTCDate = CalendarUtils._createUniversalUTCDate(oStartDate);
			this.setProperty("startDate", oStartDate, true);
			this._oUTCStartDate = oUTCDate;

			var oDatesRow = this.getAggregation("month")[0];
			oDatesRow.setStartDate(oStartDate);

			this._updateHeader(oUTCDate);

			var oDate = CalendarUtils._createLocalDate(this._getFocusedDate());
			if (!oDatesRow.checkDateFocusable(oDate)) {
				//focused date not longer visible -> focus start date
				this._setFocusedDate(oUTCDate);
				oDatesRow.setDate(oStartDate);
			}

			return this;

		};

		CalendarDateInterval.prototype.setDays = function(iDays){

			this.setProperty("days", iDays, true);

			iDays = this._getDays(); // to use phone limit

			var oDatesRow = this.getAggregation("month")[0];
			oDatesRow.setDays(iDays);

			var oMonthPicker = this.getAggregation("monthPicker");
			var iMonths = Math.ceil(iDays / 3);
			if (iMonths > 12) {
				iMonths = 12;
			}
			oMonthPicker.setMonths(iMonths);

			var oYearPicker = this.getAggregation("yearPicker");
			var iYears = Math.floor(iDays / 2);
			if (iYears > 20) {
				iYears = 20;
			}
			oYearPicker.setYears(iYears);

			var that = this;
			var oStartDate = _getStartDate(that);
			this._updateHeader(oStartDate);

			if (this.getDomRef()) {
				if (iDays > this._iDaysLarge) {
					this.$().addClass("sapUiCalIntLarge");
				}else {
					this.$().removeClass("sapUiCalIntLarge");
				}

				if (iDays > this._iDaysMonthHead) {
					this.$().addClass("sapUiCalIntHead");
				}else {
					this.$().removeClass("sapUiCalIntHead");
				}
			}

		};

		CalendarDateInterval.prototype._getDays = function(){

			var iDays = this.getDays();

			// in phone mode max 8 days are displayed
			if (sap.ui.Device.system.phone && iDays > 8) {
				return 8;
			} else {
				return iDays;
			}

		};

		CalendarDateInterval.prototype._getShowMonthHeader = function(){

			var iDays = this._getDays();
			if (iDays > this._iDaysMonthHead) {
				return true;
			}else {
				return false;
			}

		};

		CalendarDateInterval.prototype._getFocusedDate = function(){

			if (!this._oFocusedDate) {
				Calendar.prototype._getFocusedDate.apply(this, arguments);
				var oStartDate = this.getStartDate();
				var oDatesRow = this.getAggregation("month")[0];
				if (!oStartDate) {
					// use focused date as start date
					var that = this;
					_setStartDate(that, this._oFocusedDate, false);
				}else if (!oDatesRow.checkDateFocusable(CalendarUtils._createLocalDate(this._oFocusedDate))) {
					this._oFocusedDate = CalendarUtils._createUniversalUTCDate(oStartDate);
				}
			}


			return this._oFocusedDate;

		};

		/**
		 * Setter for property <code>months</code>.
		 *
		 * Property <code>months</code> is not supported in <code>sap.ui.unified.CalendarDateInterval</code> control.
		 *
		 * @protected
		 * @param {int} [iMonths] months
		 * @name sap.ui.unified.CalendarDateInterval#setMonths
		 * @function
		 */
		CalendarDateInterval.prototype.setMonths = function(iMonths){

			if (iMonths == 1) {
				this.setProperty("months", iMonths, false); // rerender
			} else {
				throw new Error("Property months not supported " + this);
			}

		};

		/**
		 * Setter for property <code>firstDayOfWeek</code>.
		 *
		 * Property <code>firstDayOfWeek</code> is not supported in <code>sap.ui.unified.CalendarDateInterval</code> control.
		 *
		 * @protected
		 * @param {int} [iFirstDayOfWeek] first day of the week
		 * @name sap.ui.unified.CalendarDateInterval#setFirstDayOfWeek
		 * @function
		 */
		CalendarDateInterval.prototype.setFirstDayOfWeek = function(iFirstDayOfWeek){

			if (iFirstDayOfWeek == -1) {
				this.setProperty("firstDayOfWeek", iFirstDayOfWeek, false); // rerender
			} else {
				throw new Error("Property firstDayOfWeek not supported " + this);
			}

		};

		CalendarDateInterval.prototype.focusDate = function(oDate){

			var oDatesRow = this.getAggregation("month")[0];
			if (!oDatesRow.checkDateFocusable(oDate)) {
				var oUTCDate = CalendarUtils._createUniversalUTCDate(oDate);
				this._focusDateExtend(oUTCDate, true);
			}

			Calendar.prototype.focusDate.apply(this, arguments);

			return this;

		};

		CalendarDateInterval.prototype._focusDateExtend = function(oDate, bOtherMonth) {

			// set start date according to new focused date
			// only if focused date is not in current rendered date interval
			// new focused date should have the same position like the old one
			if (bOtherMonth) {
				var that = this;
				var oOldDate = this._getFocusedDate();
				var oStartDate = _getStartDate(that);
				var iDay = Math.ceil((oOldDate.getTime() - oStartDate.getTime()) / (1000 * 3600 * 24));
				oStartDate = new UniversalDate(oDate.getTime());
				oStartDate.setUTCDate( oStartDate.getUTCDate() - iDay);
				_setStartDate(that, oStartDate, false);
			}

		};

		CalendarDateInterval.prototype._handlePrevious = function(oEvent){

			var that = this;
			var oFocusedDate = new UniversalDate(this._getFocusedDate().getTime());
			var oMonthPicker = this.getAggregation("monthPicker");
			var oYearPicker = this.getAggregation("yearPicker");
			var oStartDate = new UniversalDate(_getStartDate(that).getTime());
			var iDays = this._getDays();

			switch (this._iMode) {
			case 0: // day picker
				oStartDate.setUTCDate(oStartDate.getUTCDate() - iDays);
				oFocusedDate.setUTCDate(oFocusedDate.getUTCDate() - iDays);
				this._setFocusedDate(oFocusedDate);
				_setStartDate(that, oStartDate, true);
				break;

			case 1: // month picker
				if (oMonthPicker.getMonths() < 12) {
					oMonthPicker.previousPage();
				} else {
					oFocusedDate.setUTCFullYear(oFocusedDate.getUTCFullYear() - 1);
					this._focusDateExtend(oFocusedDate, true);
					this._setFocusedDate(oFocusedDate);
					this._updateHeader(oFocusedDate);
				}
				break;

			case 2: // year picker
				oYearPicker.previousPage();
				break;
				// no default
			}

		};

		CalendarDateInterval.prototype._handleNext = function(oEvent){

			var that = this;
			var oFocusedDate = new UniversalDate(this._getFocusedDate().getTime());
			var oMonthPicker = this.getAggregation("monthPicker");
			var oYearPicker = this.getAggregation("yearPicker");
			var oStartDate = new UniversalDate(_getStartDate(that).getTime());
			var iDays = this._getDays();

			switch (this._iMode) {
			case 0: // day picker
				oStartDate.setUTCDate(oStartDate.getUTCDate() + iDays);
				oFocusedDate.setUTCDate(oFocusedDate.getUTCDate() + iDays);
				this._setFocusedDate(oFocusedDate);
				_setStartDate(that, oStartDate, true);
				break;

			case 1: // month picker
				if (oMonthPicker.getMonths() < 12) {
					oMonthPicker.nextPage();
				} else {
					oFocusedDate.setUTCFullYear(oFocusedDate.getUTCFullYear() + 1);
					this._focusDateExtend(oFocusedDate, true);
					this._setFocusedDate(oFocusedDate);
					this._updateHeader(oFocusedDate);
				}
				break;

			case 2: // year picker
				oYearPicker.nextPage();
				break;
				// no default
			}

		};

		CalendarDateInterval.prototype._getDisplayedMonths = function(oDate){

			var aMonths = [];
			var iMonth = oDate.getUTCMonth();
			var iDays = this._getDays();

			aMonths.push(iMonth);
			if (iDays > this._iDaysLarge) {
				// of only a few days displayed, there is not enough space for 2 Months in Button
				var oEndDate = new UniversalDate(oDate.getTime());
				oEndDate.setUTCDate(oEndDate.getUTCDate() + iDays - 1);
				var iEndMonth = oEndDate.getUTCMonth();
				while (iMonth != iEndMonth) {
					iMonth = (iMonth + 1) % 12;
					aMonths.push(iMonth);
				}
			}

			return aMonths;

		};

		function _setStartDate(oThis, oStartDate, bSetFocusDate){

			var oMaxDate = new UniversalDate(oThis._oMaxDate.getTime());
			oMaxDate.setUTCDate(oMaxDate.getUTCDate() - oThis._getDays());
			if (oStartDate.getTime() < oThis._oMinDate.getTime()) {
				oStartDate = oThis._oMinDate;
			}else if (oStartDate.getTime() > oMaxDate.getTime()){
				oStartDate = oMaxDate;
			}

			var oLocaleDate = CalendarUtils._createLocalDate(oStartDate);
			oThis.setProperty("startDate", oLocaleDate, true);
			oThis._oUTCStartDate = oStartDate;

			var oDatesRow = oThis.getAggregation("month")[0];
			oDatesRow.setStartDate(oLocaleDate);

			oThis._updateHeader(oStartDate);

			if (bSetFocusDate) {
				var oDate = CalendarUtils._createLocalDate(oThis._getFocusedDate());
				if (!oDatesRow.checkDateFocusable(oDate)) {
					//focused date not longer visible -> focus start date
					oThis._setFocusedDate(oStartDate);
					oDatesRow.setDate(oLocaleDate);
				}else {
					oDatesRow.setDate(oDate);
				}
			}

		}

		function _getStartDate(oThis){

			if (!oThis._oUTCStartDate) {
				// no start date set, use focused date
				oThis._oUTCStartDate = oThis._getFocusedDate();
			}

			return oThis._oUTCStartDate;

		}

	}());

	return CalendarDateInterval;

}, /* bExport= */ true);
