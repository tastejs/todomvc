/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.unified.Calendar.
sap.ui.define(['jquery.sap.global', 'sap/ui/core/Control', 'sap/ui/core/LocaleData', 'sap/ui/model/type/Date', 'sap/ui/unified/calendar/CalendarUtils',
               './calendar/Header', './calendar/Month', './calendar/MonthPicker', './calendar/YearPicker', 'sap/ui/core/date/UniversalDate', './library'],
	function(jQuery, Control, LocaleData, Date1, CalendarUtils, Header, Month, MonthPicker, YearPicker, UniversalDate, library) {
	"use strict";

	/*
	 * Inside the Calendar UniversalDate objects are used. But in the API JS dates are used.
	 * So conversion must be done on API functions.
	 */

	/**
	 * Constructor for a new Calendar.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * Basic Calendar.
	 * This calendar is used for DatePickers
	 * @extends sap.ui.core.Control
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @since 1.22.0
	 * @alias sap.ui.unified.Calendar
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var Calendar = Control.extend("sap.ui.unified.Calendar", /** @lends sap.ui.unified.Calendar.prototype */ { metadata : {

		library : "sap.ui.unified",
		properties : {

			/**
			 * If set, interval selection is allowed
			 */
			intervalSelection : {type : "boolean", group : "Misc", defaultValue : false},

			/**
			 * If set, only a single date or interval, if intervalSelection is enabled, can be selected
			 */
			singleSelection : {type : "boolean", group : "Misc", defaultValue : true},

			/**
			 * number of months displayed
			 * on phones always only one month is displayed
			 * @since 1.28.0
			 */
			months : {type : "int", group : "Misc", defaultValue : 1},

			/**
			 * If set, the first day of the displayed week is this day. Valid values are 0 to 6.
			 * If not a valid value is set, the default of the used locale is used.
			 * @since 1.28.9
			 */
			firstDayOfWeek : {type : "int", group : "Misc", defaultValue : -1},

			/**
			 * If set, the provided weekdays are displayed as non-working days.
			 * Valid values inside the array are 0 to 6.
			 * If not set, the weekend defined in the locale settings is displayed as non-working days.
			 * @since 1.28.9
			 */
			nonWorkingDays : {type : "int[]", group : "Misc", defaultValue : null}
		},
		aggregations : {

			/**
			 * Date Ranges for selected dates of the DatePicker
			 */
			selectedDates : {type : "sap.ui.unified.DateRange", multiple : true, singularName : "selectedDate"},

			/**
			 * Date Range with type to visualize special days in the Calendar.
			 * If one day is assigned to more than one Type, only the first one will be used.
			 * @since 1.24.0
			 */
			specialDates : {type : "sap.ui.unified.DateTypeRange", multiple : true, singularName : "specialDate"},

			/**
			 * Hidden, for internal use only.
			 */
			header : {type : "sap.ui.unified.calendar.Header", multiple : false, visibility : "hidden"},
			month : {type : "sap.ui.unified.calendar.Month", multiple : true, visibility : "hidden"},
			monthPicker : {type : "sap.ui.unified.calendar.MonthPicker", multiple : false, visibility : "hidden"},
			yearPicker : {type : "sap.ui.unified.calendar.YearPicker", multiple : false, visibility : "hidden"}

		},
		associations: {

			/**
			 * Association to controls / ids which label this control (see WAI-ARIA attribute aria-labelledby).
			 * @since 1.28.0
			 */
			ariaLabelledBy: { type: "sap.ui.core.Control", multiple: true, singularName: "ariaLabelledBy" }
		},
		events : {

			/**
			 * Date selection changed
			 */
			select : {},

			/**
			 * Date selection was cancelled
			 */
			cancel : {}
		}
	}});

	/*
	 * There are different modes (stored in this._iMode)
	 * The standard is 0, that means a calendar showing a calendar with the days of one month.
	 * If 1 a month picker is shown.
	 * if 2 a year picker is shown.
	 */

	(function() {

		Calendar.prototype.init = function(){

			this._iMode = 0; // days are shown

			this._oFormatYyyymmdd = sap.ui.core.format.DateFormat.getInstance({pattern: "yyyyMMdd"});

			this.data("sap-ui-fastnavgroup", "true", true); // Define group for F6 handling

			this._oMinDate = new UniversalDate(UniversalDate.UTC(1, 0, 1));
			this._oMinDate.setUTCFullYear(1); // otherwise year 1 will be converted to year 1901
			this._oMaxDate = new UniversalDate(UniversalDate.UTC(9999, 11, 31));

			var oHeader = new Header(this.getId() + "--Head");
			oHeader.attachEvent("pressPrevious", this._handlePrevious, this);
			oHeader.attachEvent("pressNext", this._handleNext, this);
			oHeader.attachEvent("pressButton1", _handleButton1, this);
			oHeader.attachEvent("pressButton2", _handleButton2, this);
			this.setAggregation("header",oHeader);

			var oMonth = this._createMonth(this.getId() + "--Month0");
			oMonth.attachEvent("focus", _handleFocus, this);
			oMonth.attachEvent("select", _handleSelect, this);
			oMonth.attachEvent("_renderMonth", _handleRenderMonth, this);
			oMonth.attachEvent("_bindMousemove", _handleBindMousemove, this);
			oMonth.attachEvent("_unbindMousemove", _handleUnbindMousemove, this);
			oMonth._bNoThemeChange = true;
			this.addAggregation("month",oMonth);

			var oMonthPicker = new MonthPicker(this.getId() + "--MP");
			oMonthPicker.attachEvent("select", _handleSelectMonth, this);
			oMonthPicker._bNoThemeChange = true;
			this.setAggregation("monthPicker",oMonthPicker);

			var oYearPicker = new YearPicker(this.getId() + "--YP");
			oYearPicker.attachEvent("select", _handleSelectYear, this);
			this.setAggregation("yearPicker",oYearPicker);

		};

		Calendar.prototype.exit = function(){

			if (this._sInvalidateMonth) {
				jQuery.sap.clearDelayedCall(this._sInvalidateMonth);
			}

		};

		Calendar.prototype._createMonth = function(sId){

			var oMonth = new Month(sId);

			return oMonth;

		};

		Calendar.prototype.onBeforeRendering = function(){

			var aMonths = this.getAggregation("month");
			var oDate;
			var oMonthDate = aMonths[0].getDate();

			if (aMonths.length > 1 && oMonthDate) {
				// for more than one month - re-render same months (if already rendered once)
				oDate = new UniversalDate(oMonthDate.getTime());
			}else {
				oDate = this._getFocusedDate();
			}

			this._updateHeader(oDate);

			for (var i = 0; i < aMonths.length; i++) {
				var oMonth = aMonths[i];
				oMonthDate = new UniversalDate(oDate.getTime());
				if (i > 0) {
					oMonthDate.setUTCDate(1);
					oMonthDate.setUTCMonth(oDate.getUTCMonth() + i);
				}
				oMonth.setDate(CalendarUtils._createLocalDate(oMonthDate));
			}

		};

		Calendar.prototype.onAfterRendering = function(){

			var that = this;

			// check if day names and month names are too big -> use smaller ones
			_checkNamesLength(that);

		};

		// overwrite invalidate to recognize changes on selectedDates
		Calendar.prototype.invalidate = function(oOrigin) {

			if (!this._bDateRangeChanged && (!oOrigin || !(oOrigin instanceof sap.ui.unified.DateRange))) {
				Control.prototype.invalidate.apply(this, arguments);
			} else if (this.getDomRef() && this._iMode == 0 && !this._sInvalidateMonth) {
				// DateRange changed -> only rerender days
				// do this only once if more DateRanges / Special days are changed
				var that = this;
				this._sInvalidateMonth = jQuery.sap.delayedCall(0, that, _invalidateMonth, [that]);
			}

		};

		// overwrite removing of date ranged because invalidate don't get information about it
		Calendar.prototype.removeAllSelectedDates = function() {

			this._bDateRangeChanged = true;
			var aRemoved = this.removeAllAggregation("selectedDates");
			return aRemoved;

		};

		Calendar.prototype.destroySelectedDates = function() {

			this._bDateRangeChanged = true;
			var oDestroyed = this.destroyAggregation("selectedDates");
			return oDestroyed;

		};

		Calendar.prototype.removeAllSpecialDates = function() {

			this._bDateRangeChanged = true;
			var aRemoved = this.removeAllAggregation("specialDates");
			return aRemoved;

		};

		Calendar.prototype.destroySpecialDates = function() {

			this._bDateRangeChanged = true;
			var oDestroyed = this.destroyAggregation("specialDates");
			return oDestroyed;

		};

		/**
		 * sets the locale for the DatePicker
		 * only for internal use
		 * @param {string} sLocale  new value for <code>locale</code>
		 * @returns {sap.ui.unified.Calendar} <code>this</code> to allow method chaining
		 * @private
		 */
		Calendar.prototype.setLocale = function(sLocale){

			if (this._sLocale != sLocale) {
				this._sLocale = sLocale;
				this._oLocaleData = undefined;
				this.invalidate();
			}

			return this;

		};

		/**
		 * gets the used locale for the DatePicker
		 * only for internal use
		 * @return {string} sLocale
		 * @private
		 */
		Calendar.prototype.getLocale = function(){

			if (!this._sLocale) {
				this._sLocale = sap.ui.getCore().getConfiguration().getFormatSettings().getFormatLocale().toString();
			}

			return this._sLocale;

		};

		Calendar.prototype._getFocusedDate = function(){

			if (!this._oFocusedDate) {
				var that = this;
				_determineFocusedDate(that);
			}

			return this._oFocusedDate;

		};

		Calendar.prototype._setFocusedDate = function(oDate){

			if (!(oDate instanceof UniversalDate)) {
				throw new Error("Date must be a UniversalDate object " + this);
			}

			this._oFocusedDate = new UniversalDate(oDate.getTime());

		};

		/**
		 * Sets the focused date of the calendar.
		 *
		 * @param {object} oDate
		 *         JavaScript date object for focused date.
		 * @returns {sap.ui.unified.Calendar} <code>this</code> to allow method chaining
		 * @public
		 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
		 */
		Calendar.prototype.focusDate = function(oDate){

			var that = this;
			_displayDate(that, oDate, false);

			return this;

		};

		/**
		 * Displays a date in the calendar but don't set the focus.
		 *
		 * @param {object} oDate
		 *         JavaScript date object for focused date.
		 * @returns {sap.ui.unified.Calendar} <code>this</code> to allow method chaining
		 * @since 1.28.0
		 * @public
		 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
		 */
		Calendar.prototype.displayDate = function(oDate){

			var that = this;
			_displayDate(that, oDate, true);

			return this;

		};

		/**
		 * sets the Popup mode
		 * e.G. Tab-chain should not leave calendar
		 * only for internal use
		 * @param {boolean} bPoupupMode <code>PopupMode</code>
		 * @returns {sap.ui.unified.Calendar} <code>this</code> to allow method chaining
		 * @private
		 */
		Calendar.prototype.setPopupMode = function(bPoupupMode){

			this._bPoupupMode = bPoupupMode;

			return this; 

		};

		Calendar.prototype.setMonths = function(iMonths){

			this.setProperty("months", iMonths, false); // rerender
			var that = this;
			iMonths = _getMonths(that); // to use validation

			var aMonths = this.getAggregation("month");
			var i = 0;
			var oMonth;

			if (aMonths.length < iMonths) {
				for (i = aMonths.length; i < iMonths; i++) {
					oMonth = this._createMonth(this.getId() + "--Month" + i);
					oMonth.attachEvent("focus", _handleFocus, this);
					oMonth.attachEvent("select", _handleSelect, this);
					oMonth.attachEvent("_renderMonth", _handleRenderMonth, this);
					oMonth.attachEvent("_bindMousemove", _handleBindMousemove, this);
					oMonth.attachEvent("_unbindMousemove", _handleUnbindMousemove, this);
					oMonth._bNoThemeChange = true;
					this.addAggregation("month",oMonth);
				}
			}else if (aMonths.length > iMonths){
				for (i = aMonths.length; i > iMonths; i--) {
					oMonth = this.removeAggregation("month", i - 1);
					oMonth.destroy();
				}
			}

			return this;

		};

		/*
		 * gets localeData for used locale
		 * if no locale is given use rendered one
		 */
		Calendar.prototype._getLocaleData = function(){

			if (!this._oLocaleData) {
				var sLocale = this.getLocale();
				var oLocale = new sap.ui.core.Locale(sLocale);
				this._oLocaleData = LocaleData.getInstance(oLocale);
			}

			return this._oLocaleData;

		};

		/*
		 * gets the information if month headers should be shown
		 * used by Month controls instead of updating the controls on every change
		 */
		Calendar.prototype._getShowMonthHeader = function(){

			var that = this;
			var iMonths = _getMonths(that);
			if (iMonths > 2) {
				return true;
			}else {
				return false;
			}

		};

		Calendar.prototype.onclick = function(oEvent){

			if (oEvent.isMarked("delayedMouseEvent") ) {
				return;
			}

			if (oEvent.target.id == this.getId() + "-cancel") {
				this.onsapescape(oEvent);
			}

		};

		Calendar.prototype.onmousedown = function(oEvent){

			oEvent.preventDefault(); // to prevent focus set outside of DatePicker
			oEvent.setMark("cancelAutoClose");

		};

		Calendar.prototype.onsapescape = function(oEvent){

			var that = this;

			switch (this._iMode) {
			case 0: // day picker
				this.fireCancel();
				break;

			case 1: // month picker
				_hideMonthPicker(that);
				break;

			case 2: // year picker
				_hideYearPicker(that);
				break;
				// no default
			}

		};

		Calendar.prototype.onsapshow = function(oEvent){

			if (this._bPoupupMode) {
				var that = this;
				switch (this._iMode) {
				case 1: // month picker
					_hideMonthPicker(that);
					break;

				case 2: // year picker
					_hideYearPicker(that);
					break;
					// no default
				}
				this.fireCancel();

				oEvent.preventDefault(); // otherwise IE opens the address bar history

			}

		};

		Calendar.prototype.onsaphide = Calendar.prototype.onsapshow;

		Calendar.prototype.onsaptabnext = function(oEvent){

			// if tab was pressed on a day it should jump to the month and then to the year button
			var oHeader = this.getAggregation("header");

			if (jQuery.sap.containsOrEquals(this.getDomRef("content"), oEvent.target)) {
				jQuery.sap.focus(oHeader.getDomRef("B1"));

				if (!this._bPoupupMode) {
					// remove Tabindex from day, month, year - to break cycle
					var aMonths = this.getAggregation("month");
					var oMonthPicker = this.getAggregation("monthPicker");
					var oYearPicker = this.getAggregation("yearPicker");
					for (var i = 0; i < aMonths.length; i++) {
						var oMonth = aMonths[i];
						jQuery(oMonth._oItemNavigation.getItemDomRefs()[oMonth._oItemNavigation.getFocusedIndex()]).attr("tabindex", "-1");
					}
					if (oMonthPicker.getDomRef()) {
						jQuery(oMonthPicker._oItemNavigation.getItemDomRefs()[oMonthPicker._oItemNavigation.getFocusedIndex()]).attr("tabindex", "-1");
					}
					if (oYearPicker.getDomRef()) {
						jQuery(oYearPicker._oItemNavigation.getItemDomRefs()[oYearPicker._oItemNavigation.getFocusedIndex()]).attr("tabindex", "-1");
					}
				}

				oEvent.preventDefault();
			} else if (oEvent.target.id == oHeader.getId() + "-B1") {
				jQuery.sap.focus(oHeader.getDomRef("B2"));

				oEvent.preventDefault();
			//} else if (oEvent.target.id == oHeader.getId() + "-B2") {
				// go to next element on page, in Popup mode to day, month or year
			}

		};

		Calendar.prototype.onsaptabprevious = function(oEvent){

			var oHeader = this.getAggregation("header");

			if (jQuery.sap.containsOrEquals(this.getDomRef("content"), oEvent.target)) {
				// tab from day, month or year -> go to header

				if (this._bPoupupMode) {
					jQuery.sap.focus(oHeader.getDomRef("B2"));
					oEvent.preventDefault();
				}
			} else if (oEvent.target.id == oHeader.getId() + "-B1") {
				// focus day, month or year
				var aMonths = this.getAggregation("month");
				var oMonthPicker = this.getAggregation("monthPicker");
				var oYearPicker = this.getAggregation("yearPicker");
				var oFocusedDate;
				switch (this._iMode) {
				case 0: // day picker
					oFocusedDate = this._getFocusedDate();
					for (var i = 0; i < aMonths.length; i++) {
						var oMonth = aMonths[i];
						var oMonthDate = CalendarUtils._createUniversalUTCDate(oMonth.getDate());
						if (oFocusedDate.getTime() == oMonthDate.getTime()) {
							oMonth._oItemNavigation.focusItem(oMonth._oItemNavigation.getFocusedIndex());
						} else {
							jQuery(oMonth._oItemNavigation.getItemDomRefs()[oMonth._oItemNavigation.getFocusedIndex()]).attr("tabindex", "0");
						}
					}
					break;

				case 1: // month picker
					oMonthPicker._oItemNavigation.focusItem(oMonthPicker._oItemNavigation.getFocusedIndex());
					break;

				case 2: // year picker
					oYearPicker._oItemNavigation.focusItem(oYearPicker._oItemNavigation.getFocusedIndex());
					break;
					// no default
				}

				oEvent.preventDefault();
			} else if (oEvent.target.id == oHeader.getId() + "-B2") {
				jQuery.sap.focus(oHeader.getDomRef("B1"));

				oEvent.preventDefault();
			}
		};

		Calendar.prototype.onfocusin = function(oEvent){

			if (oEvent.target.id == this.getId() + "-end") {
				// focus via tab+shift (otherwise not possible to go to this element)
				var oHeader = this.getAggregation("header");
				var aMonths = this.getAggregation("month");
				var oMonthPicker = this.getAggregation("monthPicker");
				var oYearPicker = this.getAggregation("yearPicker");

				jQuery.sap.focus(oHeader.getDomRef("B2"));

				if (!this._bPoupupMode) {
					// remove Tabindex from day, month, year - to break cycle
					for (var i = 0; i < aMonths.length; i++) {
						var oMonth = aMonths[i];
						jQuery(oMonth._oItemNavigation.getItemDomRefs()[oMonth._oItemNavigation.getFocusedIndex()]).attr("tabindex", "-1");
					}
					if (oMonthPicker.getDomRef()) {
						jQuery(oMonthPicker._oItemNavigation.getItemDomRefs()[oMonthPicker._oItemNavigation.getFocusedIndex()]).attr("tabindex", "-1");
					}
					if (oYearPicker.getDomRef()) {
						jQuery(oYearPicker._oItemNavigation.getItemDomRefs()[oYearPicker._oItemNavigation.getFocusedIndex()]).attr("tabindex", "-1");
					}
				}
			}

			// remove tabindex of dummy element if focus is inside calendar
			this.$("end").attr("tabindex", "-1");

		};

		Calendar.prototype.onsapfocusleave = function(oEvent){

			if (!oEvent.relatedControlId || !jQuery.sap.containsOrEquals(this.getDomRef(), sap.ui.getCore().byId(oEvent.relatedControlId).getFocusDomRef())) {
				// put dummy element back to tab-chain
				this.$("end").attr("tabindex", "0");

				if (!this._bPoupupMode) {
					// restore Tabindex from day, month, year
					var aMonths = this.getAggregation("month");
					var oMonthPicker = this.getAggregation("monthPicker");
					var oYearPicker = this.getAggregation("yearPicker");
					switch (this._iMode) {
					case 0: // day picker
						for (var i = 0; i < aMonths.length; i++) {
							var oMonth = aMonths[i];
							jQuery(oMonth._oItemNavigation.getItemDomRefs()[oMonth._oItemNavigation.getFocusedIndex()]).attr("tabindex", "0");
						}
						break;

					case 1: // month picker
						jQuery(oMonthPicker._oItemNavigation.getItemDomRefs()[oMonthPicker._oItemNavigation.getFocusedIndex()]).attr("tabindex", "0");
						break;

					case 2: // year picker
						jQuery(oYearPicker._oItemNavigation.getItemDomRefs()[oYearPicker._oItemNavigation.getFocusedIndex()]).attr("tabindex", "0");
						break;
						// no default
					}
				}
			}

		};

		Calendar.prototype.onThemeChanged = function() {

			//If the calendar is not yet rendered we cannot perform the theme change operations, which include DOM manipulation
			if (!this.getDomRef()) {
				return;
			}

			var that = this;
			this._bNamesLengthChecked = undefined;
			var oMonthPicker = this.getAggregation("monthPicker");
			_showMonthPicker(that, true);
			oMonthPicker._bNoThemeChange = false;
			oMonthPicker.onThemeChanged( arguments );
			oMonthPicker._bNoThemeChange = true;
			this._bLongMonth = oMonthPicker._bLongMonth;
			_hideMonthPicker(that, true);

			var aMonths = this.getAggregation("month");
			for (var i = 0; i < aMonths.length; i++) {
				var oMonth = aMonths[i];
				oMonth._bNoThemeChange = false;
				oMonth.onThemeChanged( arguments );
				oMonth._bNoThemeChange = true;
			}

			var oDate = this._getFocusedDate();
			_setHeaderText(that, oDate);

			// check if day names and month names are too big -> use smaller ones
			_checkNamesLength(that);

		};

		Calendar.prototype._updateHeader = function(oDate){

			var that = this;
			_setHeaderText(that, oDate);
			_togglePrevNext(that, oDate, true);

		};

		Calendar.prototype._handlePrevious = function(oEvent){

			var that = this;
			var oFocusedDate = this._getFocusedDate();
			var oHeader = this.getAggregation("header");
			var oYearPicker = this.getAggregation("yearPicker");
			var iMonths = _getMonths(that);
			var oFirstMonthDate;
			var bNoFocus = false;

			switch (this._iMode) {
			case 0: // day picker
				if (iMonths > 1) {
					oFirstMonthDate = CalendarUtils._createUniversalUTCDate(this.getAggregation("month")[0].getDate());
					oFirstMonthDate.setUTCDate(1);
					this._setFocusedDate(oFirstMonthDate);
					oFocusedDate = this._getFocusedDate();
				}else {
					oFocusedDate.setUTCDate(1);
				}

				oFocusedDate.setUTCDate(oFocusedDate.getUTCDate() - 1);
				_renderMonth(that, bNoFocus, true);

				break;

			case 1: // month picker
				oFocusedDate.setUTCFullYear(oFocusedDate.getUTCFullYear() - 1);
				oHeader.setTextButton2((oFocusedDate.getUTCFullYear()).toString());
				_togglePrevNext(that, oFocusedDate);
				break;

			case 2: // year picker
				oYearPicker.previousPage();
				break;
				// no default
			}

		};

		Calendar.prototype._handleNext = function(oEvent){

			var that = this;
			var oFocusedDate = this._getFocusedDate();
			var oHeader = this.getAggregation("header");
			var oYearPicker = this.getAggregation("yearPicker");
			var iMonths = _getMonths(that);
			var oFirstMonthDate;

			switch (this._iMode) {
			case 0: // day picker
				if (iMonths > 1) {
					oFirstMonthDate = CalendarUtils._createUniversalUTCDate(this.getAggregation("month")[0].getDate());
					this._setFocusedDate(oFirstMonthDate);
					oFocusedDate = this._getFocusedDate();
				}
				oFocusedDate.setUTCMonth(oFocusedDate.getUTCMonth() + iMonths, 1);
				_renderMonth(that);
				break;

			case 1: // month picker
				oFocusedDate.setUTCFullYear(oFocusedDate.getUTCFullYear() + 1);
				oHeader.setTextButton2((oFocusedDate.getUTCFullYear()).toString());
				_togglePrevNext(that, oFocusedDate);
				break;

			case 2: // year picker
				oYearPicker.nextPage();
				break;
				// no default
			}

		};

		/*
		 * returns the displayed months rendered fr a start date
		 */
		Calendar.prototype._getDisplayedMonths = function(oDate){

			var that = this;
			var aMonths = [];
			var iMonth = oDate.getUTCMonth();
			var iMonths = _getMonths(that);

			if (iMonths > 1) {
				for (var i = 0; i < iMonths; i++) {
					aMonths.push((iMonth + i) % 12);
				}
			}else {
				aMonths.push(iMonth);
			}

			return aMonths;

		};

		/*
		 * sets the date in the used Month controls
		 * @param {sap.ui.unified.Calendar} oThis Calendar instance
		 * @param {boolean} bNoFolus if set no focus is set to the date
		 * @param {boolean} bInLastMont if more than one month is used, date is rendered in last month
		 */
		function _renderMonth(oThis, bNoFocus, bInLastMonth){

			var oDate = oThis._getFocusedDate();
			var aMonths = oThis.getAggregation("month");
			var bFound = false;
			var oMonth;
			var oMonthDate;
			var oFirstDate;
			var i = 0;
			for (i = 0; i < aMonths.length; i++) {
				oMonth = aMonths[i];
				if (oMonth.checkDateFocusable(CalendarUtils._createLocalDate(oDate))) {
					bFound = true;
				}
				if (bFound || aMonths.length == 1) {
					// if only 1 month, date must be set in it any way
					if (!bNoFocus) {
						oMonth.setDate(CalendarUtils._createLocalDate(oDate));
					} else {
						oMonth.displayDate(CalendarUtils._createLocalDate(oDate));
					}
					break;
				}
			}

			if (!bFound) {
				// date not found in existing months - render new ones
				oFirstDate = new UniversalDate(oDate.getTime());

				if (aMonths.length > 1) {
					oFirstDate.setUTCDate(1);
					if (bInLastMonth) {
						oFirstDate.setUTCMonth(oFirstDate.getUTCMonth() - aMonths.length + 1);
					}

					for (i = 0; i < aMonths.length; i++) {
						oMonth = aMonths[i];
						oMonthDate = new UniversalDate(oFirstDate.getTime());
						oMonthDate.setUTCMonth(oFirstDate.getUTCMonth() + i);
						if (!bNoFocus && oMonthDate.getUTCFullYear() == oDate.getUTCFullYear() && oMonthDate.getUTCMonth() == oDate.getUTCMonth()) {
							oMonth.setDate(CalendarUtils._createLocalDate(oDate));
						}else {
							oMonth.displayDate(CalendarUtils._createLocalDate(oMonthDate));
						}
					}
				}

				// change month and year
				oThis._updateHeader(oFirstDate);
			}

		}

		function _determineFocusedDate(oThis){

			var aSelectedDates = oThis.getSelectedDates();
			if (aSelectedDates && aSelectedDates[0] && aSelectedDates[0].getStartDate()) {
				// selected dates are provided -> use first one to focus
				oThis._oFocusedDate = CalendarUtils._createUniversalUTCDate(aSelectedDates[0].getStartDate());
			} else {
				// use current date
				var oNewDate = new Date();
				oThis._oFocusedDate = CalendarUtils._createUniversalUTCDate(oNewDate);
			}

		}

		function _showMonthPicker(oThis, bNoFocus){

			if (oThis._iMode == 2) {
				_hideYearPicker(oThis, true);
			}

			var oDate = oThis._getFocusedDate();
			var oMonthPicker = oThis.getAggregation("monthPicker");
			if (oMonthPicker.getDomRef()) {
				// already rendered
				oMonthPicker.$().css("display", "");
			} else {
				var oRm = sap.ui.getCore().createRenderManager();
				var $Container = oThis.$("content");
				oRm.renderControl(oMonthPicker);
				oRm.flush($Container[0], false, true); // insert it
				oRm.destroy();
			}
			oThis.$("contentOver").css("display", "");

			if (!bNoFocus) {
				oMonthPicker.setMonth(oDate.getUTCMonth());

				if (oThis._iMode == 0) {
					// remove tabindex from month
					var aMonths = oThis.getAggregation("month");

					for (var i = 0; i < aMonths.length; i++) {
						var oMonth = aMonths[i];
						jQuery(oMonth._oItemNavigation.getItemDomRefs()[oMonth._oItemNavigation.getFocusedIndex()]).attr("tabindex", "-1");
					}
				}
			}

			oThis._iMode = 1;

			_togglePrevNext(oThis, oDate, false);

		}

		function _hideMonthPicker(oThis, bNoFocus){

			oThis._iMode = 0;

			var oMonthPicker = oThis.getAggregation("monthPicker");
			oMonthPicker.$().css("display", "none");
			oThis.$("contentOver").css("display", "none");

			if (!bNoFocus) {
				_renderMonth(oThis); // to focus date

				if (oThis.getMonths() > 1) {
					// restore tabindex because if date not changed in _renderMonth only the focused date is updated
					var aMonths = oThis.getAggregation("month");
					for (var i = 0; i < aMonths.length; i++) {
						var oMonth = aMonths[i];
						jQuery(oMonth._oItemNavigation.getItemDomRefs()[oMonth._oItemNavigation.getFocusedIndex()]).attr("tabindex", "0");
					}
				}
			}

		}

		function _showYearPicker(oThis){

			if (oThis._iMode == 1) {
				_hideMonthPicker(oThis, true);
			}

			var oDate = oThis._getFocusedDate();
			var iYear = oDate.getUTCFullYear();
			var iYearMax = oThis._oMaxDate.getUTCFullYear();
			var iYearMin = oThis._oMinDate.getUTCFullYear();

			if (iYearMax - iYearMin <= 20) {
				return;
			}

			var oHeader = oThis.getAggregation("header");

			if (iYear > ( iYearMax - 10 )) {
				iYear = iYearMax - 9;
				oHeader.setEnabledNext(false);
			} else {
				oHeader.setEnabledNext(true);
			}
			if (iYear < ( iYearMin + 9 )) {
				iYear = iYearMin + 10;
				oHeader.setEnabledPrevious(false);
			} else {
				oHeader.setEnabledPrevious(true);
			}

			var oYearPicker = oThis.getAggregation("yearPicker");
			if (oYearPicker.getDomRef()) {
				// already rendered
				oYearPicker.$().css("display", "");
			} else {
				var oRm = sap.ui.getCore().createRenderManager();
				var $Container = oThis.$("content");
				oRm.renderControl(oYearPicker);
				oRm.flush($Container[0], false, true); // insert it
				oRm.destroy();
			}
			oThis.$("contentOver").css("display", "");

			oYearPicker.setYear(iYear);

			// check special case if only 4 weeks are displayed (e.g. February 2021) -> top padding must be removed
			// can only happen if only one month is displayed -> otherwise at least one month has more than 28 days.
			if (_getMonths(oThis) == 1) {
				var oMonth = oThis.getAggregation("month")[0];
				var aDomRefs = oMonth.$("days").find(".sapUiCalItem");
				if (aDomRefs.length == 28) {
					oYearPicker.$().addClass("sapUiCalYearNoTop");
				}else {
					oYearPicker.$().removeClass("sapUiCalYearNoTop");
				}
			}

			if (oThis._iMode == 0) {
				// remove tabindex from month
				var aMonths = oThis.getAggregation("month");

				for (var i = 0; i < aMonths.length; i++) {
					var oMonth = aMonths[i];
					jQuery(oMonth._oItemNavigation.getItemDomRefs()[oMonth._oItemNavigation.getFocusedIndex()]).attr("tabindex", "-1");
				}
			}

			oThis._iMode = 2;

		}

		function _hideYearPicker(oThis, bNoFocus){

			oThis._iMode = 0;

			var oYearPicker = oThis.getAggregation("yearPicker");
			oYearPicker.$().css("display", "none");
			oThis.$("contentOver").css("display", "none");

			if (!bNoFocus) {
				_renderMonth(oThis); // to focus date

				if (oThis.getMonths() > 1) {
					// restore tabindex because if date not changed in _renderMonth only the focused date is updated
					var aMonths = oThis.getAggregation("month");
					for (var i = 0; i < aMonths.length; i++) {
						var oMonth = aMonths[i];
						jQuery(oMonth._oItemNavigation.getItemDomRefs()[oMonth._oItemNavigation.getFocusedIndex()]).attr("tabindex", "0");
					}
				}
			}

		}

		function _checkNamesLength(oThis){

			if (!oThis._bNamesLengthChecked) {
				// check month names (don't change focus)
				_showMonthPicker(oThis, true);
				_hideMonthPicker(oThis, true);

				var oMonthPicker = oThis.getAggregation("monthPicker");
				oThis._bLongMonth = oMonthPicker._bLongMonth;

				oThis._bNamesLengthChecked = true;

				if (!oThis._bLongMonth) {
					// update short month name (long name used by default)
					var oDate = oThis._getFocusedDate();
					_setHeaderText(oThis, oDate);
				}
			}else if (oThis.getMonths() > 1) {
				// on rerendering focus might be set on wrong month
				_focusDate(oThis, oThis._getFocusedDate(), true);
			}

		}

		function _togglePrevNext (oThis, oDate, bCheckMonth){

			var iYear = oDate.getUTCFullYear();
			var iYearMax = oThis._oMaxDate.getUTCFullYear();
			var iYearMin = oThis._oMinDate.getUTCFullYear();
			var iMonth = oDate.getUTCMonth();
			var iMonthMax = oThis._oMaxDate.getUTCMonth();
			var iMonthMin = oThis._oMinDate.getUTCMonth();
			var oHeader = oThis.getAggregation("header");

			if (iYear > iYearMax || (iYear == iYearMax && ( !bCheckMonth || iMonth >= iMonthMax ))) {
				oHeader.setEnabledNext(false);
			}else {
				oHeader.setEnabledNext(true);
			}

			if (iYear < iYearMin || (iYear == iYearMin && ( !bCheckMonth || iMonth <= iMonthMin ))) {
				oHeader.setEnabledPrevious(false);
			}else {
				oHeader.setEnabledPrevious(true);
			}

		}

		function _focusDate (oThis, oDate, bOtherMonth){

			// if a date should be focused thats out of the borders -> focus the border
			var oFocusedDate;
			var bChanged = false;
			if (oDate.getTime() < oThis._oMinDate.getTime()) {
				oFocusedDate = oThis._oMinDate;
				bChanged = true;
			}else if (oDate.getTime() > oThis._oMaxDate.getTime()){
				oFocusedDate = oThis._oMaxDate;
				bChanged = true;
			}else {
				oFocusedDate = oDate;
			}

			if (oThis._focusDateExtend) {
				// hook for CalenarDateInterval
				oThis._focusDateExtend(oDate, bOtherMonth);
			}

			var bInLastMonth = oFocusedDate.getTime() < oThis._getFocusedDate().getTime();

			oThis._setFocusedDate(oFocusedDate);

			if (bChanged || bOtherMonth) {
				_renderMonth(oThis, false, bInLastMonth);
			}

		}

		function _setHeaderText (oThis, oDate){

			// sets the text for the month and the year button to the header 

			var oLocaleData = oThis._getLocaleData();
			var aMonthNames = [];
			var aMonthNamesWide = [];
			var sAriaLabel;
			var bShort = false;
			if (oThis._bLongMonth || !oThis._bNamesLengthChecked) {
				aMonthNames = oLocaleData.getMonthsStandAlone("wide");
			} else {
				bShort = true;
				aMonthNames = oLocaleData.getMonthsStandAlone("abbreviated");
				aMonthNamesWide = oLocaleData.getMonthsStandAlone("wide");
			}

			var aMonths = oThis._getDisplayedMonths(oDate);
			var sText;
			if (aMonths.length > 1) {
				var sPattern = oLocaleData.getIntervalPattern();
				sText = sPattern.replace(/\{0\}/, aMonthNames[aMonths[0]]).replace(/\{1\}/, aMonthNames[aMonths[aMonths.length - 1]]);
				if (bShort) {
					sAriaLabel = sPattern.replace(/\{0\}/, aMonthNamesWide[aMonths[0]]).replace(/\{1\}/, aMonthNamesWide[aMonths[aMonths.length - 1]]);
				}
			}else {
				sText = aMonthNames[aMonths[0]];
				if (bShort) {
					sAriaLabel = aMonthNamesWide[aMonthNames[aMonths[0]]];
				}
			}

			var oHeader = oThis.getAggregation("header");
			oHeader.setTextButton1(sText);
			if (bShort) {
				oHeader.setAriaLabelButton1(sAriaLabel);
			}
			oHeader.setTextButton2((oDate.getUTCFullYear()).toString());

		}

		function _displayDate (oThis, oDate, bNoFocus){

			if (oDate && (!oThis._oFocusedDate || oThis._oFocusedDate.getTime() != oDate.getTime())) {
				if (!(oDate instanceof Date)) {
					throw new Error("Date must be a JavaScript date object; " + oThis);
				}

				oDate = CalendarUtils._createUniversalUTCDate(oDate);

				var iYear = oDate.getUTCFullYear();
				if (iYear < 1 || iYear > 9999) {
					throw new Error("Date must not be in valid range (between 0001-01-01 and 9999-12-31); " + oThis);
				}

				oThis._setFocusedDate(oDate);

				if (oThis.getDomRef() && oThis._iMode == 0) {
					_renderMonth(oThis, bNoFocus);
				}
			}

		}

		function _getMonths (oThis){

			// in phone mode always only one month is displayed
			if (sap.ui.Device.system.phone) {
				return 1;
			} else {
				return oThis.getMonths();
			}

		}

		// handlers for sub-controls
		function _handleButton1 (oEvent){

			var that = this;

			if (this._iMode != 1) {
				_showMonthPicker(that);
			} else {
				_hideMonthPicker(that);
			}

		}

		function _handleButton2 (oEvent){

			var that = this;

			if (this._iMode != 2) {
				_showYearPicker(that);
			} else {
				_hideYearPicker(that);
			}

		}

		function _handleRenderMonth (oEvent){

			// fire internal event for DatePicker for with number of rendered days. If Calendar becomes larger maybe popup must change position
			this.fireEvent("_renderMonth", {days: oEvent.getParameter("days")});

		}

		function _handleSelect (oEvent){

			var that = this;

			if (_getMonths(that) > 1) {
				var aMonths = this.getAggregation("month");
				for (var i = 0; i < aMonths.length; i++) {
					var oMonth = aMonths[i];
					if (oMonth.getId() != oEvent.oSource.getId()) {
						oMonth._updateSelection();
					}
				}
			}

			this.fireSelect();

		}

		function _handleFocus (oEvent){

			var oDate = CalendarUtils._createUniversalUTCDate(oEvent.getParameter("date"));
			var bOtherMonth = oEvent.getParameter("otherMonth");
			var bRestoreOldDate = oEvent.getParameter("restoreOldDate");
			var that = this;

			if (bRestoreOldDate) {
				// in multimonth mode stay at the last focused date
				if (!jQuery.sap.equal(this._getFocusedDate(), oDate)) {
					_renderMonth(that, false);
				}
			} else {
				_focusDate(that, oDate, bOtherMonth);
			}

		}

		function _handleBindMousemove (oEvent){

			var that = this;

			if (_getMonths(that) > 1) {
				var aMonths = this.getAggregation("month");
				for (var i = 0; i < aMonths.length; i++) {
					var oMonth = aMonths[i];
					if (oMonth.getId() != oEvent.oSource.getId()) {
						oMonth._bindMousemove();
					}
				}
			}

		}

		function _handleUnbindMousemove (oEvent){

			var that = this;

			if (_getMonths(that) > 1) {
				var aMonths = this.getAggregation("month");
				for (var i = 0; i < aMonths.length; i++) {
					var oMonth = aMonths[i];
					if (oMonth.getId() != oEvent.oSource.getId()) {
						oMonth._unbindMousemove();
					}
				}
			}

		}

		function _handleSelectMonth (oEvent){

			var oFocusedDate = new UniversalDate(this._getFocusedDate().getTime());
			var oMonthPicker = this.getAggregation("monthPicker");
			var iMonth = oMonthPicker.getMonth();
			var that = this;

			oFocusedDate.setUTCMonth(iMonth);

			if (iMonth != oFocusedDate.getUTCMonth() ) {
				// day did not exist in this month (e.g. 31) -> go to last day of month
				oFocusedDate.setUTCDate(0);
			}

			_focusDate(that, oFocusedDate, true);

			_hideMonthPicker(that);

		}

		function _handleSelectYear (oEvent){

			var oFocusedDate = new UniversalDate(this._getFocusedDate().getTime());
			var oYearPicker = this.getAggregation("yearPicker");
			var iYear = oYearPicker.getYear();
			var that = this;

			oFocusedDate.setUTCFullYear(iYear);

			_focusDate(that, oFocusedDate, true);

			_hideYearPicker(that);

		}

		function _invalidateMonth(oThis){

			oThis._sInvalidateMonth = undefined;

			var aMonths = oThis.getAggregation("month");
			for (var i = 0; i < aMonths.length; i++) {
				var oMonth = aMonths[i];
				oMonth._bDateRangeChanged = true;
				oMonth._bInvalidateSync = true;
				if (aMonths.length > 1) {
					oMonth._bNoFocus = true;
				}
				oMonth.invalidate();
				oMonth._bInvalidateSync = undefined;
			}

			if (aMonths.length > 1) {
				// restore focus
				_focusDate(oThis, oThis._getFocusedDate(), true);
			}
			oThis._bDateRangeChanged = undefined;

		}

	}());

	return Calendar;

}, /* bExport= */ true);
