/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.unified.Calendar.
sap.ui.define(['jquery.sap.global', 'sap/ui/core/Control', 'sap/ui/core/LocaleData', 'sap/ui/model/type/Date', 'sap/ui/unified/calendar/CalendarUtils',
               './calendar/Header', './calendar/MonthsRow', './calendar/MonthPicker', './calendar/YearPicker', 'sap/ui/core/date/UniversalDate', './library'],
	function(jQuery, Control, LocaleData, Date1, CalendarUtils, Header, MonthsRow, MonthPicker, YearPicker, UniversalDate, library) {
	"use strict";

	/*
	 * Inside the CalendarMonthInterval UniversalDate objects are used. But in the API JS dates are used.
	 * So conversion must be done on API functions.
	 */

	/**
	 * Constructor for a new CalendarMonthInterval.
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * Calendar with granularity of months displayed in one line.
	 *
	 * <b>Note:</b> JavaScript Date objects are used to set and return the months, mark them as selected or as a special type.
	 * But the date part of the Date object is not used. If a Date object is returned the date will be set to the 1st of the corresponding month.
	 * @extends sap.ui.core.Control
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @since 1.32.0
	 * @alias sap.ui.unified.CalendarMonthInterval
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var CalendarMonthInterval = Control.extend("sap.ui.unified.CalendarMonthInterval", /** @lends sap.ui.unified.CalendarMonthInterval.prototype */ { metadata : {

		library : "sap.ui.unified",
		properties : {

			/**
			 * Width of the <code>CalendarMonthInterval</code>. The width of the single months depends on this width.
			 */
			width : {type : "sap.ui.core.CSSSize", group : "Dimension", defaultValue : null},

			/**
			 * Start date of the Interval as JavaScript Date object.
			 * The month of this Date will be the first month in the displayed row.
			 */
			startDate : {type : "object", group : "Misc"},

			/**
			 * If set, interval selection is allowed
			 */
			intervalSelection : {type : "boolean", group : "Misc", defaultValue : false},

			/**
			 * If set, only a single date or interval, if <code>intervalSelection</code> is enabled, can be selected
			 *
			 * <b>Note:</b> Selection of multiple intervals is not supported in the current version.
			 */
			singleSelection : {type : "boolean", group : "Misc", defaultValue : true},

			/**
			 * Number of months displayed
			 *
			 * <b>Note:</b> On phones, the maximum number of months displayed in the row is always 6.
			 */
			months : {type : "int", group : "Misc", defaultValue : 12}
		},
		aggregations : {

			/**
			 * Date ranges for selected dates of the <code>CalendarMonthInterval</code>.
			 *
			 * If <code>singleSelection</code> is set, only the first entry is used.
			 *
			 * <b>Note:</b> Even if only one day is selected, the whole corresponding month is selected.
			 */
			selectedDates : {type : "sap.ui.unified.DateRange", multiple : true, singularName : "selectedDate"},

			/**
			 * Date ranges with type to visualize special months in the <code>CalendarMonthInterval</code>.
			 * If one day is assigned to more than one type, only the first one will be used.
			 *
			 * <b>Note:</b> Even if only one day is set as a special day, the whole corresponding month is displayed in this way.
			 */
			specialDates : {type : "sap.ui.unified.DateTypeRange", multiple : true, singularName : "specialDate"},

			/**
			 * Hidden, for internal use only.
			 */
			header : {type : "sap.ui.unified.calendar.Header", multiple : false, visibility : "hidden"},
			monthsRow : {type : "sap.ui.unified.calendar.MonthsRow", multiple : false, visibility : "hidden"},
			yearPicker : {type : "sap.ui.unified.calendar.YearPicker", multiple : false, visibility : "hidden"}

		},
		associations: {

			/**
			 * Association to controls / IDs which label this control (see WAI-ARIA attribute aria-labelledby).
			 */
			ariaLabelledBy: { type: "sap.ui.core.Control", multiple: true, singularName: "ariaLabelledBy" }
		},
		events : {

			/**
			 * Month selection changed
			 */
			select : {},

			/**
			 * Month selection was cancelled
			 */
			cancel : {}
		}
	}});

	/*
	 * There are different modes (stored in this._iMode)
	 * The standard is 0, that means a calendar showing a calendar with the days of one month.
	 * If 1 a year picker is shown.
	 */

	(function() {

		CalendarMonthInterval.prototype.init = function(){

			this._iMode = 0; // months are shown

			this.data("sap-ui-fastnavgroup", "true", true); // Define group for F6 handling

			this._oMinDate = new UniversalDate(UniversalDate.UTC(1, 0, 1));
			this._oMinDate.setUTCFullYear(1); // otherwise year 1 will be converted to year 1901
			this._oMaxDate = new UniversalDate(UniversalDate.UTC(9999, 11, 31));

			var oHeader = new Header(this.getId() + "--Head", {
				visibleButton0: false,
				visibleButton1: false,
				visibleButton2: true
			});
			oHeader.attachEvent("pressPrevious", this._handlePrevious, this);
			oHeader.attachEvent("pressNext", this._handleNext, this);
			oHeader.attachEvent("pressButton2", _handleButton2, this);
			this.setAggregation("header",oHeader);

			var oMonthsRow = new MonthsRow(this.getId() + "--MonthsRow");
			oMonthsRow.attachEvent("focus", _handleFocus, this);
			oMonthsRow.attachEvent("select", _handleSelect, this);
			oMonthsRow._bNoThemeChange = true;
			this.setAggregation("monthsRow",oMonthsRow);

			var oYearPicker = new YearPicker(this.getId() + "--YP", {
				columns: 0,
				years: 6 // default for 12 months
			});
			oYearPicker.attachEvent("select", _handleSelectYear, this);
			this.setAggregation("yearPicker",oYearPicker);

			this._iDaysMonthsHead = 15; // if more than this number of months, year numbers are displayed on top of months

		};

		CalendarMonthInterval.prototype.exit = function(){

			if (this._sInvalidateContent) {
				jQuery.sap.clearDelayedCall(this._sInvalidateContent);
			}

		};

		CalendarMonthInterval.prototype.onBeforeRendering = function(){

			var oMonthsRow = this.getAggregation("monthsRow");
			var oDate = this._getFocusedDate();

			_updateHeader.call(this);

			oMonthsRow.setDate(CalendarUtils._createLocalDate(oDate));

		};

//		CalendarMonthInterval.prototype.onAfterRendering = function(){
//
//		};

		CalendarMonthInterval.prototype.setStartDate = function(oStartDate){

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
			this._oUTCStartDate.setUTCDate(1); // always use begin of month

			var oMonthsRow = this.getAggregation("monthsRow");
			oMonthsRow.setStartDate(oStartDate);

			_updateHeader.call(this);

			var oDate = CalendarUtils._createLocalDate(this._getFocusedDate());
			if (!oMonthsRow.checkDateFocusable(oDate)) {
				//focused date not longer visible -> focus start date
				this._setFocusedDate(this._oUTCStartDate);
				oMonthsRow.setDate(oStartDate);
			}

			return this;

		};

		// overwrite invalidate to recognize changes on selectedDates
		CalendarMonthInterval.prototype.invalidate = function(oOrigin) {

			if (!this._bDateRangeChanged && (!oOrigin || !(oOrigin instanceof sap.ui.unified.DateRange))) {
				Control.prototype.invalidate.apply(this, arguments);
			} else if (this.getDomRef() && this._iMode == 0 && !this._sInvalidateContent) {
				// DateRange changed -> only rerender days
				// do this only once if more DateRanges / Special days are changed
				this._sInvalidateContent = jQuery.sap.delayedCall(0, this, _invalidateMonthsRow);
			}

		};

		// overwrite removing of date ranged because invalidate don't get information about it
		CalendarMonthInterval.prototype.removeAllSelectedDates = function() {

			this._bDateRangeChanged = true;
			var aRemoved = this.removeAllAggregation("selectedDates");
			return aRemoved;

		};

		CalendarMonthInterval.prototype.destroySelectedDates = function() {

			this._bDateRangeChanged = true;
			var oDestroyed = this.destroyAggregation("selectedDates");
			return oDestroyed;

		};

		CalendarMonthInterval.prototype.removeAllSpecialDates = function() {

			this._bDateRangeChanged = true;
			var aRemoved = this.removeAllAggregation("specialDates");
			return aRemoved;

		};

		CalendarMonthInterval.prototype.destroySpecialDates = function() {

			this._bDateRangeChanged = true;
			var oDestroyed = this.destroyAggregation("specialDates");
			return oDestroyed;

		};

		/**
		 * Sets the locale for the <code>CalendarMonthInterval</code>.
		 * Only for internal use
		 * @param {string} sLocale  New value for <code>locale</code>
		 * @returns {sap.ui.unified.Calendar} <code>this</code> to allow method chaining
		 * @private
		 */
		CalendarMonthInterval.prototype.setLocale = function(sLocale){

			if (this._sLocale != sLocale) {
				this._sLocale = sLocale;
				this._oLocaleData = undefined;
				this.invalidate();
			}

			return this;

		};

		/**
		 * Gets the used locale for the <code>CalendarMonthInterval</code>
		 * Only for internal use
		 * @return {string} sLocale
		 * @private
		 */
		CalendarMonthInterval.prototype.getLocale = function(){

			if (!this._sLocale) {
				this._sLocale = sap.ui.getCore().getConfiguration().getFormatSettings().getFormatLocale().toString();
			}

			return this._sLocale;

		};

		CalendarMonthInterval.prototype._getFocusedDate = function(){

			if (!this._oFocusedDate) {
				_determineFocusedDate.call(this);
			}

			return this._oFocusedDate;

		};

		CalendarMonthInterval.prototype._setFocusedDate = function(oDate){

			if (!(oDate instanceof UniversalDate)) {
				throw new Error("Date must be a UniversalDate object " + this);
			}

			this._oFocusedDate = new UniversalDate(oDate.getTime());

		};

		/**
		 * Sets the focused month of the <code>CalendarMonthInterval</code>.
		 *
		 * @param {object} oDate JavaScript date object for focused date. (The month of this date will be focused.)
		 * @returns {sap.ui.unified.Calendar} <code>this</code> to allow method chaining
		 * @public
		 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
		 */
		CalendarMonthInterval.prototype.focusDate = function(oDate){

			var oMonthsRow = this.getAggregation("monthsRow");
			if (!oMonthsRow.checkDateFocusable(oDate)) {
				var oUTCDate = CalendarUtils._createUniversalUTCDate(oDate);
				_setStartDateForFocus.call(this, oUTCDate);
			}

			_displayDate.call(this, oDate, false);

			return this;

		};

		/**
		 * Displays a month in the <code>CalendarMonthInterval</code> but doesn't set the focus.
		 *
		 * @param {object} oDate JavaScript date object for displayed date. (The month of this date will be displayed.)
		 * @returns {sap.ui.unified.Calendar} <code>this</code> to allow method chaining
		 * @public
		 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
		 */
		CalendarMonthInterval.prototype.displayDate = function(oDate){

			_displayDate.call(this, oDate, true);

			return this;

		};

		CalendarMonthInterval.prototype.setMonths = function(iMonths){

			this.setProperty("months", iMonths, true);

			iMonths = this._getMonths(); // to use phone limit

			var oMonthsRow = this.getAggregation("monthsRow");
			oMonthsRow.setMonths(iMonths);

			// check if focused date still is valid
			var oDate = CalendarUtils._createLocalDate(this._getFocusedDate());
			if (!oMonthsRow.checkDateFocusable(oDate)) {
				//focused date not longer visible -> focus start date
				var oStartDate = _getStartDate.call(this);
				this._setFocusedDate(this._oUTCStartDate);
				oMonthsRow.setDate(CalendarUtils._createLocalDate(oStartDate));
			}

			var oYearPicker = this.getAggregation("yearPicker");
			var iYears = Math.floor(iMonths / 2);
			if (iYears > 20) {
				iYears = 20;
			}
			oYearPicker.setYears(iYears);

			_updateHeader.call(this);

			if (this.getDomRef()) {
				if (this._getShowItemHeader()) {
					this.$().addClass("sapUiCalIntHead");
				}else {
					this.$().removeClass("sapUiCalIntHead");
				}
			}

		};

		CalendarMonthInterval.prototype._getMonths = function(){

			var iMonths = this.getMonths();

			// in phone mode max 6 Months are displayed
			if (sap.ui.Device.system.phone && iMonths > 6) {
				return 6;
			} else {
				return iMonths;
			}

		};

		/*
		 * gets localeData for used locale
		 * if no locale is given use rendered one
		 */
		CalendarMonthInterval.prototype._getLocaleData = function(){

			if (!this._oLocaleData) {
				var sLocale = this.getLocale();
				var oLocale = new sap.ui.core.Locale(sLocale);
				this._oLocaleData = LocaleData.getInstance(oLocale);
			}

			return this._oLocaleData;

		};

		CalendarMonthInterval.prototype.onclick = function(oEvent){

			if (oEvent.isMarked("delayedMouseEvent") ) {
				return;
			}

			if (oEvent.target.id == this.getId() + "-cancel") {
				this.onsapescape(oEvent);
			}

		};

		CalendarMonthInterval.prototype.onmousedown = function(oEvent){

			oEvent.preventDefault(); // to prevent focus set outside of DatePicker
			oEvent.setMark("cancelAutoClose");

		};

		CalendarMonthInterval.prototype.onsapescape = function(oEvent){

			switch (this._iMode) {
			case 0: // day picker
				this.fireCancel();
				break;

			case 1: // year picker
				_hideYearPicker.call(this);
				break;
				// no default
			}

		};

		CalendarMonthInterval.prototype.onsaptabnext = function(oEvent){

			// if tab was pressed on a day it should jump to the year button
			var oHeader = this.getAggregation("header");

			if (jQuery.sap.containsOrEquals(this.getDomRef("content"), oEvent.target)) {
				jQuery.sap.focus(oHeader.getDomRef("B2"));

				if (!this._bPoupupMode) {
					// remove Tabindex from day, month, year - to break cycle
					var oMonthsRow = this.getAggregation("monthsRow");
					var oYearPicker = this.getAggregation("yearPicker");
					jQuery(oMonthsRow._oItemNavigation.getItemDomRefs()[oMonthsRow._oItemNavigation.getFocusedIndex()]).attr("tabindex", "-1");
					if (oYearPicker.getDomRef()) {
						jQuery(oYearPicker._oItemNavigation.getItemDomRefs()[oYearPicker._oItemNavigation.getFocusedIndex()]).attr("tabindex", "-1");
					}
				}

				oEvent.preventDefault();
			}

		};

		CalendarMonthInterval.prototype.onsaptabprevious = function(oEvent){

			var oHeader = this.getAggregation("header");

			if (jQuery.sap.containsOrEquals(this.getDomRef("content"), oEvent.target)) {
				// tab from day or year -> go to header

				if (this._bPoupupMode) {
					jQuery.sap.focus(oHeader.getDomRef("B2"));
					oEvent.preventDefault();
				}
			} else if (oEvent.target.id == oHeader.getId() + "-B2") {
				// focus day or year
				var oMonthsRow = this.getAggregation("monthsRow");
				var oYearPicker = this.getAggregation("yearPicker");
				switch (this._iMode) {
				case 0: // day picker
					oMonthsRow._oItemNavigation.focusItem(oMonthsRow._oItemNavigation.getFocusedIndex());
					break;

				case 1: // year picker
					oYearPicker._oItemNavigation.focusItem(oYearPicker._oItemNavigation.getFocusedIndex());
					break;
					// no default
				}

				oEvent.preventDefault();
			}
		};

		CalendarMonthInterval.prototype.onfocusin = function(oEvent){

			if (oEvent.target.id == this.getId() + "-end") {
				// focus via tab+shift (otherwise not possible to go to this element)
				var oHeader = this.getAggregation("header");
				var oMonthsRow = this.getAggregation("monthsRow");
				var oYearPicker = this.getAggregation("yearPicker");

				jQuery.sap.focus(oHeader.getDomRef("B2"));

				if (!this._bPoupupMode) {
					// remove Tabindex from day, month, year - to break cycle
					jQuery(oMonthsRow._oItemNavigation.getItemDomRefs()[oMonthsRow._oItemNavigation.getFocusedIndex()]).attr("tabindex", "-1");
					if (oYearPicker.getDomRef()) {
						jQuery(oYearPicker._oItemNavigation.getItemDomRefs()[oYearPicker._oItemNavigation.getFocusedIndex()]).attr("tabindex", "-1");
					}
				}
			}

			// remove tabindex of dummy element if focus is inside calendar
			this.$("end").attr("tabindex", "-1");

		};

		CalendarMonthInterval.prototype.onsapfocusleave = function(oEvent){

			if (!oEvent.relatedControlId || !jQuery.sap.containsOrEquals(this.getDomRef(), sap.ui.getCore().byId(oEvent.relatedControlId).getFocusDomRef())) {
				// put dummy element back to tab-chain
				this.$("end").attr("tabindex", "0");

				if (!this._bPoupupMode) {
					// restore Tabindex from day and year
					var oMonthsRow = this.getAggregation("monthsRow");
					var oYearPicker = this.getAggregation("yearPicker");
					switch (this._iMode) {
					case 0: // day picker
						jQuery(oMonthsRow._oItemNavigation.getItemDomRefs()[oMonthsRow._oItemNavigation.getFocusedIndex()]).attr("tabindex", "0");
						break;

					case 1: // year picker
						jQuery(oYearPicker._oItemNavigation.getItemDomRefs()[oYearPicker._oItemNavigation.getFocusedIndex()]).attr("tabindex", "0");
						break;
						// no default
					}
				}
			}

		};

		CalendarMonthInterval.prototype._handlePrevious = function(oEvent){

			var oFocusedDate = this._getFocusedDate();
			var oYearPicker = this.getAggregation("yearPicker");
			var iMonths = this._getMonths();
			var oStartDate = new UniversalDate(_getStartDate.call(this).getTime());

			switch (this._iMode) {
			case 0: // month picker
				oStartDate.setUTCMonth(oStartDate.getUTCMonth() - iMonths);
				oFocusedDate.setUTCMonth(oFocusedDate.getUTCMonth() - iMonths);
				this._setFocusedDate(oFocusedDate);
				_setStartDate.call(this, oStartDate, true);

				break;

			case 1: // year picker
				oYearPicker.previousPage();
				break;
				// no default
			}

		};

		CalendarMonthInterval.prototype._handleNext = function(oEvent){

			var oFocusedDate = this._getFocusedDate();
			var oYearPicker = this.getAggregation("yearPicker");
			var iMonths = this._getMonths();
			var oStartDate = new UniversalDate(_getStartDate.call(this).getTime());

			switch (this._iMode) {
			case 0: // month picker
				oStartDate.setUTCMonth(oStartDate.getUTCMonth() + iMonths);
				oFocusedDate.setUTCMonth(oFocusedDate.getUTCMonth() + iMonths);
				this._setFocusedDate(oFocusedDate);
				_setStartDate.call(this, oStartDate, true);

				break;

			case 1: // year picker
				oYearPicker.nextPage();
				break;
				// no default
			}

		};

		CalendarMonthInterval.prototype._getShowItemHeader = function(){

			var iMonths = this.getMonths();
			if (iMonths > this._iDaysMonthsHead) {
				return true;
			}else {
				return false;
			}

		};

		function _setStartDate(oStartDate, bSetFocusDate){

			var oMaxDate = new UniversalDate(this._oMaxDate.getTime());
			oMaxDate.setUTCMonth(oMaxDate.getUTCDate() - this._getMonths());
			if (oStartDate.getTime() < this._oMinDate.getTime()) {
				oStartDate = this._oMinDate;
			}else if (oStartDate.getTime() > oMaxDate.getTime()){
				oStartDate = oMaxDate;
			}

			oStartDate.setUTCDate(1); // always use begin of month
			var oLocaleDate = CalendarUtils._createLocalDate(oStartDate);
			this.setProperty("startDate", oLocaleDate, true);
			this._oUTCStartDate = oStartDate;

			var oMonthsRow = this.getAggregation("monthsRow");
			oMonthsRow.setStartDate(oLocaleDate);

			_updateHeader.call(this);

			if (bSetFocusDate) {
				var oDate = CalendarUtils._createLocalDate(this._getFocusedDate());
				if (!oMonthsRow.checkDateFocusable(oDate)) {
					//focused date not longer visible -> focus start date
					this._setFocusedDate(oStartDate);
					oMonthsRow.setDate(oLocaleDate);
				}else {
					oMonthsRow.setDate(oDate);
				}
			}

		}

		function _getStartDate(){

			if (!this._oUTCStartDate) {
				// no start date set, use focused date
				this._oUTCStartDate = this._getFocusedDate();
				this._oUTCStartDate.setUTCDate(1); // always use begin of month
			}

			return this._oUTCStartDate;

		}

		/*
		 * sets the date in the used Month controls
		 * @param {boolean} bNoFolus if set no focus is set to the date
		 */
		function _renderMonthsRow(bNoFocus){

			var oDate = this._getFocusedDate();
			var oMonthsRow = this.getAggregation("monthsRow");

			if (!bNoFocus) {
				oMonthsRow.setDate(CalendarUtils._createLocalDate(oDate));
			} else {
				oMonthsRow.displayDate(CalendarUtils._createLocalDate(oDate));
			}

			// change month and year
			_updateHeader.call(this);

		}

		function _determineFocusedDate(){

			var aSelectedDates = this.getSelectedDates();
			if (aSelectedDates && aSelectedDates[0] && aSelectedDates[0].getStartDate()) {
				// selected dates are provided -> use first one to focus
				this._oFocusedDate = CalendarUtils._createUniversalUTCDate(aSelectedDates[0].getStartDate());
				this._oFocusedDate.setUTCDate(1); // always use begin of month
			} else {
				// use current date
				var oNewDate = new Date();
				this._oFocusedDate = CalendarUtils._createUniversalUTCDate(oNewDate);
				this._oFocusedDate.setUTCDate(1); // always use begin of month
			}

		}

		function _showYearPicker(){

			var oDate = this._getFocusedDate();
			var iYear = oDate.getUTCFullYear();
			var iYearMax = this._oMaxDate.getUTCFullYear();
			var iYearMin = this._oMinDate.getUTCFullYear();

			if (iYearMax - iYearMin <= 20) {
				return;
			}

			var oHeader = this.getAggregation("header");

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

			var oYearPicker = this.getAggregation("yearPicker");
			if (oYearPicker.getDomRef()) {
				// already rendered
				oYearPicker.$().css("display", "");
			} else {
				var oRm = sap.ui.getCore().createRenderManager();
				var $Container = this.$("content");
				oRm.renderControl(oYearPicker);
				oRm.flush($Container[0], false, true); // insert it
				oRm.destroy();
			}
			this.$("contentOver").css("display", "");

			oYearPicker.setYear(iYear);

			if (this._iMode == 0) {
				// remove tabindex from month
				var oMonthsRow = this.getAggregation("monthsRow");

				jQuery(oMonthsRow._oItemNavigation.getItemDomRefs()[oMonthsRow._oItemNavigation.getFocusedIndex()]).attr("tabindex", "-1");
			}

			this._iMode = 1;

		}

		function _hideYearPicker(bNoFocus){

			this._iMode = 0;

			var oYearPicker = this.getAggregation("yearPicker");
			oYearPicker.$().css("display", "none");
			this.$("contentOver").css("display", "none");

			if (!bNoFocus) {
				_renderMonthsRow.call(this); // to focus date

					// restore tabindex because if date not changed in _renderMonthsRow only the focused date is updated
				var oMonthsRow = this.getAggregation("monthsRow");
				jQuery(oMonthsRow._oItemNavigation.getItemDomRefs()[oMonthsRow._oItemNavigation.getFocusedIndex()]).attr("tabindex", "0");
			}

		}

		function _updateHeader(){

			_setHeaderText.call(this);
			_togglePrevNext.call(this);

		}

		function _togglePrevNext(){

			var oDate = new UniversalDate(_getStartDate.call(this).getTime());
			var iMonths = this._getMonths();
			var iYear = oDate.getUTCFullYear();
			var iYearMax = this._oMaxDate.getUTCFullYear();
			var iYearMin = this._oMinDate.getUTCFullYear();
			var iMonth = oDate.getUTCMonth();
			var iMonthMax = this._oMaxDate.getUTCMonth();
			var iMonthMin = this._oMinDate.getUTCMonth();
			var oHeader = this.getAggregation("header");

			if (iYear < iYearMin || (iYear == iYearMin && iMonth <= iMonthMin )) {
				oHeader.setEnabledPrevious(false);
			}else {
				oHeader.setEnabledPrevious(true);
			}

			oDate.setUTCMonth(oDate.getUTCMonth() + iMonths - 1);
			iYear = oDate.getUTCFullYear();
			iMonth = oDate.getUTCMonth();
			if (iYear > iYearMax || (iYear == iYearMax && iMonth >= iMonthMax)) {
				oHeader.setEnabledNext(false);
			}else {
				oHeader.setEnabledNext(true);
			}

		}

		function _setHeaderText(){

			// sets the text for the year button to the header
			var sText;
			var oStartDate = _getStartDate.call(this);
			var iStartYear = oStartDate.getUTCFullYear();
			var oEndDate = new UniversalDate(oStartDate.getTime());
			oEndDate.setUTCMonth(oEndDate.getUTCMonth() + this._getMonths() - 1);
			var iEndYear = oEndDate.getUTCFullYear();
			if (iStartYear != iEndYear) {
				var oLocaleData = this._getLocaleData();
				var sPattern = oLocaleData.getIntervalPattern();
				sText = sPattern.replace(/\{0\}/, iStartYear.toString()).replace(/\{1\}/, iEndYear.toString());
			} else {
				sText = iStartYear.toString();
			}

			var oHeader = this.getAggregation("header");
			oHeader.setTextButton2(sText);

		}

		function _focusDate(oDate, bNotVisible){

			// if a date should be focused thats out of the borders -> focus the border
			var oFocusedDate;
			var bChanged = false;
			if (oDate.getTime() < this._oMinDate.getTime()) {
				oFocusedDate = this._oMinDate;
				bChanged = true;
			}else if (oDate.getTime() > this._oMaxDate.getTime()){
				oFocusedDate = this._oMaxDate;
				bChanged = true;
			}else {
				oFocusedDate = oDate;
			}

			this._setFocusedDate(oFocusedDate);

			if (bChanged || bNotVisible) {
				_setStartDateForFocus.call(this, oFocusedDate);
				_renderMonthsRow.call(this, false);
			}

		}

		function _displayDate(oDate, bNoFocus){

			if (oDate && (!this._oFocusedDate || this._oFocusedDate.getTime() != oDate.getTime())) {
				if (!(oDate instanceof Date)) {
					throw new Error("Date must be a JavaScript date object; " + this);
				}

				oDate = CalendarUtils._createUniversalUTCDate(oDate);

				var iYear = oDate.getUTCFullYear();
				if (iYear < 1 || iYear > 9999) {
					throw new Error("Date must not be in valid range (between 0001-01-01 and 9999-12-31); " + this);
				}

				this._setFocusedDate(oDate);

				if (this.getDomRef() && this._iMode == 0) {
					_renderMonthsRow.call(this, bNoFocus);
				}
			}

		}

		function _handleButton2(oEvent){

			if (this._iMode != 1) {
				_showYearPicker.call(this);
			} else {
				_hideYearPicker.call(this);
			}

		}

		function _handleSelect(oEvent){

			this.fireSelect();

		}

		function _handleFocus(oEvent){

			var oDate = CalendarUtils._createUniversalUTCDate(oEvent.getParameter("date"));
			var bNotVisible = oEvent.getParameter("notVisible");

			_focusDate.call(this, oDate, bNotVisible);

		}

		function _handleSelectYear(oEvent){

			var oFocusedDate = new UniversalDate(this._getFocusedDate().getTime());
			var oYearPicker = this.getAggregation("yearPicker");
			var iYear = oYearPicker.getYear();

			oFocusedDate.setUTCFullYear(iYear);

			_focusDate.call(this, oFocusedDate, true);

			_hideYearPicker.call(this);

		}

		function _invalidateMonthsRow(){

			this._sInvalidateContent = undefined;

			var oMonthsRow = this.getAggregation("monthsRow");
			oMonthsRow._bDateRangeChanged = true;
			oMonthsRow._bInvalidateSync = true;
			oMonthsRow.invalidate();
			oMonthsRow._bInvalidateSync = undefined;

			this._bDateRangeChanged = undefined;

		}

		function _setStartDateForFocus(oDate) {

			// set start date according to new focused date
			// only if focused date is not in current rendered month interval
			// new focused date should have the same position like the old one
			var oMonthsRow = this.getAggregation("monthsRow");
			var oStartDate = _getStartDate.call(this);
			var iMonth = oMonthsRow._oItemNavigation.getFocusedIndex();
			oStartDate = new UniversalDate(oDate.getTime());
			oStartDate.setUTCMonth( oStartDate.getUTCMonth() - iMonth);
			_setStartDate.call(this, oStartDate, false);

		}

	}());

	return CalendarMonthInterval;

}, /* bExport= */ true);
