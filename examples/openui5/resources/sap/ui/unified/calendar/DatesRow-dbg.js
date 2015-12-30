/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.unified.Calendar.
sap.ui.define(['jquery.sap.global', 'sap/ui/core/Control', 'sap/ui/core/LocaleData', 'sap/ui/core/delegate/ItemNavigation',
               'sap/ui/model/type/Date', 'sap/ui/unified/calendar/CalendarUtils', 'sap/ui/core/date/UniversalDate', 'sap/ui/unified/calendar/Month', 'sap/ui/unified/library'],
	function(jQuery, Control, LocaleData, ItemNavigation, Date1, CalendarUtils, UniversalDate, Month, library) {
	"use strict";

	/**
	 * Constructor for a new calendar/DatesRow.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * renders a row of days with ItemNavigation
	 * This is used inside the calendar. Not for stand alone usage
	 * If used inside the calendar the properties and aggregation are directly taken from the parent
	 * (To not duplicate and sync DateRanges and so on...)
	 * @extends sap.ui.unified.calendar.Month
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @since 1.30.0
	 * @alias sap.ui.unified.calendar.DatesRow
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var DatesRow = Month.extend("sap.ui.unified.calendar.DatesRow", /** @lends sap.ui.unified.calendar.DatesRow.prototype */ { metadata : {

		library : "sap.ui.unified",
		properties : {

			/**
			 * Start date of the row
			 * If in rendering phase the date property is not in the range startDate + days,
			 * it is set to the start date
			 * So after setting the start date the date should be set to be in the range of the start date
			 */
			startDate : {type : "object", group : "Misc"},

			/**
			 * number of days displayed
			 */
			days : {type : "int", group : "Misc", defaultValue : 7}

		}
	}});

	(function() {

		DatesRow.prototype.init = function(){

			Month.prototype.init.apply(this, arguments);

			this._iColumns = 1;

		};

		DatesRow.prototype.setStartDate = function(oStartDate){

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

			if (this.getDomRef()) {
				var oOldDate = CalendarUtils._createLocalDate(this._getDate());
				this._bNoRangeCheck = true;
				this.displayDate(oStartDate); // don't set focus
				this._bNoRangeCheck = false;
				if (oOldDate && this.checkDateFocusable(oOldDate)) {
					this.setDate(oOldDate);
				}
			}
			return this;

		};

		DatesRow.prototype._getStartDate = function(){

			if (!this._oUTCStartDate) {
				this._oUTCStartDate = CalendarUtils._createUniversalUTCDate(new Date());
			}

			return this._oUTCStartDate;
		};

		/**
		 * Setter for property <code>date</code>.
		 *
		 * Property <code>date</code> date to be focused or displayed. It must be in the displayed date range
		 * beginning with <code>startDate</code> and <code>days</code> days
		 * So set this properties before setting the date.
		 *
		 * @param {object} oDate JavaScript date object for start date.
		 * @returns {sap.ui.unified.calendar.DatesRow} <code>this</code> to allow method chaining
		 * @public
		 * @name sap.ui.unified.calendar.DatesRow#setDate
		 * @function
		 */
		DatesRow.prototype.setDate = function(oDate){

			// check if in visible date range
			if (!this._bNoRangeCheck && !this.checkDateFocusable(oDate)) {
				throw new Error("Date must be in visible date range; " + this);
			}

			Month.prototype.setDate.apply(this, arguments);

			return this;

		};

		/**
		 * displays the a given date without setting the focus
		 *
		 * Property <code>date</code> date to be focused or displayed. It must be in the displayed date range
		 * beginning with <code>startDate</code> and <code>days</code> days
		 * So set this properties before setting the date.
		 *
		 * @param {object} oDate JavaScript date object for focused date.
		 * @returns {sap.ui.unified.calendar.DatesRow} <code>this</code> to allow method chaining
		 * @public
		 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
		 */
		DatesRow.prototype.displayDate = function(oDate){

			// check if in visible date range
			if (!this._bNoRangeCheck && !this.checkDateFocusable(oDate)) {
				throw new Error("Date must be in visible date range; " + this);
			}

			Month.prototype.displayDate.apply(this, arguments);

			return this;

		};

		/**
		 * Setter for property <code>firstDayOfWeek</code>.
		 *
		 * Property <code>firstDayOfWeek</code> is not supported in <code>sap.ui.unified.calendar.DatesRow</code> control.
		 *
		 * @protected
		 * @param {int} [iFirstDayOfWeek] first day of the week
		 * @name sap.ui.unified.calendar.DatesRow#setFirstDayOfWeek
		 * @function
		 */
		DatesRow.prototype.setFirstDayOfWeek = function(iFirstDayOfWeek){

			if (iFirstDayOfWeek == -1) {
				this.setProperty("firstDayOfWeek", iFirstDayOfWeek, false); // rerender
			} else {
				throw new Error("Property firstDayOfWeek not supported " + this);
			}

		};

		DatesRow.prototype._handleBorderReached = function(oControlEvent){

			var oEvent = oControlEvent.getParameter("event");
			var iDays = this.getDays();
			var oOldDate = this._getDate();
			var oFocusedDate = new UniversalDate(oOldDate.getTime());

			if (oEvent.type) {
				switch (oEvent.type) {
				case "sapnext":
				case "sapnextmodifiers":
					//go to next day
					oFocusedDate.setUTCDate(oFocusedDate.getUTCDate() + 1);
					break;

				case "sapprevious":
				case "sappreviousmodifiers":
					//go to previous day
					oFocusedDate.setUTCDate(oFocusedDate.getUTCDate() - 1);
					break;

				case "sappagedown":
					// go getDays() days forward
					oFocusedDate.setUTCDate(oFocusedDate.getUTCDate() + iDays);
					break;

				case "sappageup":
					// go getDays() days backwards
					oFocusedDate.setUTCDate(oFocusedDate.getUTCDate() - iDays);
					break;

				default:
					break;
				}

				this.fireFocus({date: CalendarUtils._createLocalDate(oFocusedDate), otherMonth: true});

			}

		};

		/*
		 * needs UTC date
		 */
		DatesRow.prototype.checkDateFocusable = function(oDate){

			if (!(oDate instanceof Date)) {
				throw new Error("Date must be a JavaScript date object; " + this);
			}

			if (this._bNoRangeCheck) {
				// to force to render days if start date is changed
				return false;
			}

			var oStartDate = this._getStartDate();

			var oEndDate = new UniversalDate(oStartDate.getTime());
			oEndDate.setUTCDate(oEndDate.getUTCDate() + this.getDays());
			var oUTCDate = CalendarUtils._createUniversalUTCDate(oDate);

			if (oUTCDate.getTime() >= oStartDate.getTime() && oUTCDate.getTime() < oEndDate.getTime()) {
				return true;
			}else {
				return false;
			}

		};

		DatesRow.prototype._renderHeader = function(){

			var oStartDate = this._getStartDate();
			var iStartDay = oStartDate.getUTCDay();
			var oLocaleData = this._getLocaleData();
			var aWeekHeader = this.$("Names").children();

			var aWeekDays = [];
			if (this._bLongWeekDays || !this._bNamesLengthChecked) {
				aWeekDays = oLocaleData.getDaysStandAlone("abbreviated");
			} else {
				aWeekDays = oLocaleData.getDaysStandAlone("narrow");
			}
			var aWeekDaysWide = oLocaleData.getDaysStandAlone("wide");
			var i = 0;

			for (i = 0; i < aWeekHeader.length; i++) {
				var $WeekHeader = jQuery(aWeekHeader[i]);
				$WeekHeader.text(aWeekDays[(i + iStartDay) % 7]);
				$WeekHeader.attr("aria-label", aWeekDaysWide[(i + iStartDay) % 7]);
			}

			if (this._getShowHeader()) {
				var $Container = this.$("Head");

				if ($Container.length > 0) {
					var oRm = sap.ui.getCore().createRenderManager();
					this.getRenderer().renderHeaderLine(oRm, this, oLocaleData, oStartDate);
					oRm.flush($Container[0]);
					oRm.destroy();
				}
			}

		};

		/*
		 * returns the first displayed week day. Needed to change week days if too long
		 */
		DatesRow.prototype._getFirstWeekDay = function(){

			var oStartDate = this._getStartDate();
			return oStartDate.getUTCDay();

		};

	}());

	return DatesRow;

}, /* bExport= */ true);
