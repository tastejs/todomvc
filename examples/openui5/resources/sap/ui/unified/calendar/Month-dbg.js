/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.unified.Calendar.
sap.ui.define(['jquery.sap.global', 'sap/ui/core/Control', 'sap/ui/core/LocaleData', 'sap/ui/core/delegate/ItemNavigation',
               'sap/ui/model/type/Date', 'sap/ui/unified/calendar/CalendarUtils', 'sap/ui/core/date/UniversalDate', 'sap/ui/unified/library'],
	function(jQuery, Control, LocaleData, ItemNavigation, Date1, CalendarUtils, UniversalDate, library) {
	"use strict";

	/*
	 * Inside the Month UniversalDate objects are used. But in the API JS dates are used.
	 * So conversion must be done on API functions.
	 */

	/**
	 * Constructor for a new calendar/Month.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * renders a month with ItemNavigation
	 * This is used inside the calendar. Not for stand alone usage
	 * If used inside the calendar the properties and aggregation are directly taken from the parent
	 * (To not duplicate and sync DateRanges and so on...)
	 * @extends sap.ui.core.Control
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @since 1.28.0
	 * @alias sap.ui.unified.calendar.Month
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var Month = Control.extend("sap.ui.unified.calendar.Month", /** @lends sap.ui.unified.calendar.Month.prototype */ { metadata : {

		library : "sap.ui.unified",
		properties : {
			/**
			 * the month including this date is rendered and this date is initial focused (if no other focus set)
			 */
			date : {type : "object", group : "Misc"},

			/**
			 * If set, interval selection is allowed
			 */
			intervalSelection : {type : "boolean", group : "Misc", defaultValue : false},

			/**
			 * If set, only a single date or interval, if intervalSelection is enabled, can be selected
			 */
			singleSelection : {type : "boolean", group : "Misc", defaultValue : true},

			/**
			 * If set, a header with the month name is shown
			 */
			showHeader : {type : "boolean", group : "Misc", defaultValue : false},

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
			 */
			specialDates : {type : "sap.ui.unified.DateTypeRange", multiple : true, singularName : "specialDate"}
		},
		associations: {

			/**
			 * Association to controls / ids which label this control (see WAI-ARIA attribute aria-labelledby).
			 */
			ariaLabelledBy: { type: "sap.ui.core.Control", multiple: true, singularName: "ariaLabelledBy" }
		},
		events : {

			/**
			 * Date selection changed
			 */
			select : {},

			/**
			 * Date focus changed
			 */
			focus : {
				parameters : {
					/**
					 * focused date
					 */
					date : {type : "object"},
					/**
					 * focused date is in an other month that the displayed one
					 */
					otherMonth : {type : "boolean"},
					/**
					 * focused date is set to the same as before (date in other month clicked)
					 */
					restoreOldDate : {type : "boolean"}
				}
			}
		}
	}});

	(function() {

		Month.prototype.init = function(){

			this._oFormatYyyymmdd = sap.ui.core.format.DateFormat.getInstance({pattern: "yyyyMMdd"});
			this._oFormatLong = sap.ui.core.format.DateFormat.getInstance({style: "long"});

			this._mouseMoveProxy = jQuery.proxy(this._handleMouseMove, this);

			this._iColumns = 7;
		};

		Month.prototype.exit = function(){

			if (this._oItemNavigation) {
				this.removeDelegate(this._oItemNavigation);
				this._oItemNavigation.destroy();
				delete this._oItemNavigation;
			}

			if (this._sInvalidateMonth) {
				jQuery.sap.clearDelayedCall(this._sInvalidateMonth);
			}

		};

		Month.prototype.onAfterRendering = function(){

			var that = this;

			_initItemNavigation(that);

			// check if day names are too big -> use smaller ones
			_checkNamesLength(that);

		};

		Month.prototype.onsapfocusleave = function(oEvent){

			if (!oEvent.relatedControlId || !jQuery.sap.containsOrEquals(this.getDomRef(), sap.ui.getCore().byId(oEvent.relatedControlId).getFocusDomRef())) {
				var that = this;

				if (this._bMouseMove) {
					this._unbindMousemove(true);

					_selectDay(that, this._getDate());
					this._bMoveChange = false;
					this._bMousedownChange = false;
					_fireSelect(that);
				}

				if (this._bMousedownChange) {
					// mouseup somewhere outside of control -> if focus left finish selection
					this._bMousedownChange = false;
					_fireSelect(that);
				}
			}

		};

		// overwrite invalidate to recognize changes on selectedDates
		Month.prototype.invalidate = function(oOrigin) {

			if (!this._bDateRangeChanged && (!oOrigin || !(oOrigin instanceof sap.ui.unified.DateRange))) {
				Control.prototype.invalidate.apply(this, arguments);
			} else if (this.getDomRef() && !this._sInvalidateMonth) {
				// DateRange changed -> only rerender days
				// do this only once if more DateRanges / Special days are changed
				var that = this;
				if (this._bInvalidateSync) { // set if calendar already invalidates in delayed call
					_invalidateMonth(that);
				} else {
					this._sInvalidateMonth = jQuery.sap.delayedCall(0, that, _invalidateMonth, [that]);
				}
			}

		};

		// overwrite removing of date ranged because invalidate don't get information about it
		Month.prototype.removeAllSelectedDates = function() {

			this._bDateRangeChanged = true;
			var aRemoved = this.removeAllAggregation("selectedDates");
			return aRemoved;

		};

		Month.prototype.destroySelectedDates = function() {

			this._bDateRangeChanged = true;
			var oDestroyed = this.destroyAggregation("selectedDates");
			return oDestroyed;

		};

		Month.prototype.removeAllSpecialDates = function() {

			this._bDateRangeChanged = true;
			var aRemoved = this.removeAllAggregation("specialDates");
			return aRemoved;

		};

		Month.prototype.destroySpecialDates = function() {

			this._bDateRangeChanged = true;
			var oDestroyed = this.destroyAggregation("specialDates");
			return oDestroyed;

		};

		Month.prototype.setDate = function(oDate){

			var that = this;
			_changeDate(that, oDate, false);

			return this;

		};

		Month.prototype._setDate = function(oDate){

			var oLocaleDate = CalendarUtils._createLocalDate(oDate);
			this.setProperty("date", oLocaleDate, true);
			this._oUTCDate = oDate;

		};

		Month.prototype._getDate = function(){

			if (!this._oUTCDate) {
				this._oUTCDate = CalendarUtils._createUniversalUTCDate(new Date());
			}

			return this._oUTCDate;

		};

		/**
		 * displays the month of a given date without setting the focus
		 *
		 * @param {object} oDate JavaScript date object for focused date.
		 * @returns {sap.ui.unified.calendar.Month} <code>this</code> to allow method chaining
		 * @public
		 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
		 */
		Month.prototype.displayDate = function(oDate){

			var that = this;
			_changeDate(that, oDate, true);

			return this;

		};

		/*
		 * Use rendered locale for stand alone control
		 * But as Calendar can have an own locale, use this one if used inside Calendar
		 */
		Month.prototype._getLocale = function(){

			var oParent = this.getParent();

			if (oParent && oParent.getLocale) {
				return oParent.getLocale();
			} else if (!this._sLocale) {
				this._sLocale = sap.ui.getCore().getConfiguration().getFormatSettings().getFormatLocale().toString();
			}

			return this._sLocale;

		};

		/*
		 * gets localeData for used locale
		 * Use rendered locale for stand alone control
		 * But as Calendar can have an own locale, use this one if used inside Calendar
		 */
		Month.prototype._getLocaleData = function(){

			var oParent = this.getParent();

			if (oParent && oParent._getLocaleData) {
				return oParent._getLocaleData();
			} else if (!this._oLocaleData) {
				var sLocale = this._getLocale();
				var oLocale = new sap.ui.core.Locale(sLocale);
				this._oLocaleData = LocaleData.getInstance(oLocale);
			}

			return this._oLocaleData;

		};

		/*
		 * get format for long date output depending on used locale
		 */
		Month.prototype._getFormatLong = function(){

			var sLocale = this._getLocale();

			if (this._oFormatLong.oLocale.toString() != sLocale) {
				var oLocale = new sap.ui.core.Locale(sLocale);
				this._oFormatLong = sap.ui.core.format.DateFormat.getInstance({style: "long"} , oLocale);
			}

			return this._oFormatLong;

		};

		/*
		 * if used inside Calendar get the value from the parent
		 * To don't have sync issues...
		 */
		Month.prototype.getIntervalSelection = function(){

			var oParent = this.getParent();

			if (oParent && oParent.getIntervalSelection) {
				return oParent.getIntervalSelection();
			} else {
				return this.getProperty("intervalSelection");
			}

		};

		/*
		 * if used inside Calendar get the value from the parent
		 * To don't have sync issues...
		 */
		Month.prototype.getSingleSelection = function(){

			var oParent = this.getParent();

			if (oParent && oParent.getSingleSelection) {
				return oParent.getSingleSelection();
			} else {
				return this.getProperty("singleSelection");
			}

		};

		/*
		 * if used inside Calendar get the value from the parent
		 * To don't have sync issues...
		 */
		Month.prototype.getSelectedDates = function(){

			var oParent = this.getParent();

			if (oParent && oParent.getSelectedDates) {
				return oParent.getSelectedDates();
			} else {
				return this.getAggregation("selectedDates", []);
			}

		};

		/*
		 * if used inside Calendar get the value from the parent
		 * To don't have sync issues...
		 */
		Month.prototype.getSpecialDates = function(){

			var oParent = this.getParent();

			if (oParent && oParent.getSpecialDates) {
				return oParent.getSpecialDates();
			} else {
				return this.getAggregation("specialDates", []);
			}

		};

		/*
		 * if used inside Calendar get the value from the parent
		 * To don't have sync issues...
		 */
		Month.prototype._getShowHeader = function(){

			var oParent = this.getParent();

			if (oParent && oParent._getShowMonthHeader) {
				return oParent._getShowMonthHeader();
			} else {
				return this.getProperty("showHeader");
			}

		};

		/*
		 * if used inside Calendar get the value from the parent
		 * To don't have sync issues...
		 */
		Month.prototype.getAriaLabelledBy = function(){

			var oParent = this.getParent();

			if (oParent && oParent.getAriaLabelledBy) {
				return oParent.getAriaLabelledBy();
			} else {
				return this.getAssociation("ariaLabelledBy", []);
			}

		};

		/*
		 * if used inside Calendar get the value from the parent
		 * To don't have sync issues...
		 * If not a valid day, use LocaleData
		 */
		Month.prototype._getFirstDayOfWeek = function(){

			var oParent = this.getParent();
			var iFirstDayOfWeek = 0;

			if (oParent && oParent.getFirstDayOfWeek) {
				iFirstDayOfWeek = oParent.getFirstDayOfWeek();
			} else {
				iFirstDayOfWeek = this.getProperty("firstDayOfWeek");
			}

			if (iFirstDayOfWeek < 0 || iFirstDayOfWeek > 6) {
				var oLocaleData = this._getLocaleData();
				iFirstDayOfWeek = oLocaleData.getFirstDayOfWeek();
			}

			return iFirstDayOfWeek;

		};

		/*
		 * if used inside Calendar get the value from the parent
		 * To don't have sync issues...
		 * If not a valid day, use LocaleData
		 */
		Month.prototype._getNonWorkingDays = function(){

			var oParent = this.getParent();
			var aNonWorkingDays;

			if (oParent && oParent.getNonWorkingDays) {
				aNonWorkingDays = oParent.getNonWorkingDays();
			} else {
				aNonWorkingDays = this.getProperty("nonWorkingDays");
			}

			if (aNonWorkingDays && !jQuery.isArray(aNonWorkingDays)) {
				aNonWorkingDays = [];
			}

			return aNonWorkingDays;

		};

		/*
		 * Checks if a date is selected and what kind of selected
		 * @return {int} iSelected 0: not selected; 1: single day selected, 2: interval start, 3: interval end, 4: interval between, 5: one day interval (start = end)
		 * @private
		 */
		Month.prototype._checkDateSelected = function(oDate){

			if (!(oDate instanceof UniversalDate)) {
				throw new Error("Date must be a UniversalDate object " + this);
			}

			var iSelected = 0;
			var aSelectedDates = this.getSelectedDates();
			var oTimeStamp = oDate.getTime();

			for ( var i = 0; i < aSelectedDates.length; i++) {
				// initalize the time part of the start and end time
				var oRange = aSelectedDates[i];
				var oStartDate = oRange.getStartDate();
				var oStartTimeStamp = 0;
				if (oStartDate) {
					oStartDate = CalendarUtils._createUniversalUTCDate(oStartDate);
					oStartTimeStamp = oStartDate.getTime();
				}
				var oEndDate = oRange.getEndDate();
				var oEndTimeStamp = 0;
				if (oEndDate) {
					oEndDate = CalendarUtils._createUniversalUTCDate(oEndDate);
					oEndTimeStamp = oEndDate.getTime();
				}

				if (oTimeStamp == oStartTimeStamp && !oEndDate ) {
					iSelected = 1; // single day selected
					break;
				} else if (oTimeStamp == oStartTimeStamp && oEndDate ) {
					iSelected = 2; // interval start
					if (oEndDate && oTimeStamp == oEndTimeStamp) {
						// one day interval
						iSelected = 5;
					}
					break;
				} else if (oEndDate && oTimeStamp == oEndTimeStamp) {
					iSelected = 3; // interval end
					break;
				} else if (oEndDate && oTimeStamp > oStartTimeStamp && oTimeStamp < oEndTimeStamp) {
					iSelected = 4; // interval between
					break;
				}

				if (this.getSingleSelection()) {
					// if single selection only check the first range
					break;
				}
			}

			return iSelected;

		};

		/*
		 * gets the type of a single date checking the specialDates aggregation
		 * the first hit is used
		 * @return {object} date type and tooltip defined in CalendarDayType
		 * @private
		 */
		Month.prototype._getDateType = function(oDate){

			if (!(oDate instanceof UniversalDate)) {
				throw new Error("Date must be a UniversalDate object " + this);
			}

			var oType;
			var aSpecialDates = this.getSpecialDates();
			var oTimeStamp = oDate.getTime();

			for ( var i = 0; i < aSpecialDates.length; i++) {
				// initialize the time part of the start and end time
				var oRange = aSpecialDates[i];
				var oStartDate = oRange.getStartDate();
				var oStartTimeStamp = 0;
				if (oStartDate) {
					oStartDate = CalendarUtils._createUniversalUTCDate(oStartDate);
					oStartTimeStamp = oStartDate.getTime();
				}
				var oEndDate = oRange.getEndDate();
				var oEndTimeStamp = 0;
				if (oEndDate) {
					oEndDate = CalendarUtils._createUniversalUTCDate(oEndDate);
					oEndTimeStamp = oEndDate.getTime();
				}

				if ((oTimeStamp == oStartTimeStamp && !oEndDate) || (oTimeStamp >= oStartTimeStamp && oTimeStamp <= oEndTimeStamp)) {
					oType = {type: oRange.getType(), tooltip: oRange.getTooltip_AsString()};
					break;
				}
			}

			return oType;

		};

		Month.prototype._handleMouseMove = function(oEvent){

			if (!this.$().is(":visible")) {
				// calendar was closed -> remove mousemove handler
				this._unbindMousemove(true);
			}

			var $Target = jQuery(oEvent.target);

			if ($Target.hasClass("sapUiCalItemText")) {
				$Target = $Target.parent();
			}

			if (this._sLastTargetId && this._sLastTargetId == $Target.attr("id")) {
				// mouse move at same day -> do nothing
				return;
			}
			this._sLastTargetId = $Target.attr("id");

			var that = this;

			if ($Target.hasClass("sapUiCalItem")) {
				var oOldFocusedDate = this._getDate();
				if (!jQuery.sap.containsOrEquals(this.getDomRef(), oEvent.target)) {
					// in multi month mode day can be in other month
					var aSelectedDates = this.getSelectedDates();

					if (aSelectedDates.length > 0 && this.getSingleSelection()) {
						var oStartDate = aSelectedDates[0].getStartDate();
						if (oStartDate) {
							oStartDate = CalendarUtils._createUniversalUTCDate(oStartDate);
						}
						var oEndDate = new UniversalDate(this._oFormatYyyymmdd.parse($Target.attr("data-sap-day"), true).getTime());
						if (oEndDate.getTime() >= oStartDate.getTime()) {
							_updateSelection(that, oStartDate, oEndDate);
						}else {
							_updateSelection(that, oEndDate, oStartDate);
						}
					}
				}else {
					var oFocusedDate = new UniversalDate(this._oFormatYyyymmdd.parse($Target.attr("data-sap-day"), true).getTime());

					if (oFocusedDate.getTime() != oOldFocusedDate.getTime()) {
						if ($Target.hasClass("sapUiCalItemOtherMonth")) {
							// in other month -> change month
							this.fireFocus({date: CalendarUtils._createLocalDate(oFocusedDate), otherMonth: true});
						} else {
							this._setDate(oFocusedDate);
							_selectDay(that, oFocusedDate, true);
							this._bMoveChange = true;
						}
					}
				}
			}

		};

		Month.prototype.onmouseup = function(oEvent){

			// fire select event on mouseup to prevent closing calendar during click

			var that = this;

			if (this._bMouseMove) {
				this._unbindMousemove(true);

				// focus now selected day
				var oFocusedDate = this._getDate();
				var aDomRefs = this._oItemNavigation.getItemDomRefs();

				for ( var i = 0; i < aDomRefs.length; i++) {
					var $DomRef = jQuery(aDomRefs[i]);
					if (!$DomRef.hasClass("sapUiCalItemOtherMonth")) {
						if ($DomRef.attr("data-sap-day") == this._oFormatYyyymmdd.format(oFocusedDate, true)) {
							$DomRef.focus();
							break;
						}
					}
				}

				if (this._bMoveChange) {
					// selection was changed -> make it final
					var $Target = jQuery(oEvent.target);

					if ($Target.hasClass("sapUiCalItemNum")) {
						$Target = $Target.parent();
					}

					if ($Target.hasClass("sapUiCalItem")) {
						oFocusedDate = new UniversalDate(this._oFormatYyyymmdd.parse($Target.attr("data-sap-day"), true).getTime());
					}

					_selectDay(that, oFocusedDate);
					this._bMoveChange = false;
					this._bMousedownChange = false;
					_fireSelect(that);
				}
			}

			if (this._bMousedownChange) {
				this._bMousedownChange = false;
				_fireSelect(that);
			}

		};

		Month.prototype.onsapselect = function(oEvent){

			// focused item must be selected
			var that = this;

			_selectDay(that, that._getDate());
			_fireSelect(that);

			//to prevent bubbling into input field if in DatePicker
			oEvent.stopPropagation();
			oEvent.preventDefault();

		};

		Month.prototype.onsapselectmodifiers = function(oEvent){

			this.onsapselect(oEvent);

		};

		Month.prototype.onsappageupmodifiers = function(oEvent){

			// not handled by ItemNavigation
			// go one or 10 years back
			var oFocusedDate = new UniversalDate(this._getDate().getTime());
			var iYear = oFocusedDate.getUTCFullYear();

			if (oEvent.metaKey || oEvent.ctrlKey) {
				oFocusedDate.setUTCFullYear(iYear - 10);
			} else {
				oFocusedDate.setUTCFullYear(iYear - 1);
			}

			this.fireFocus({date: CalendarUtils._createLocalDate(oFocusedDate), otherMonth: true});

			// cancel the event otherwise the browser select some text
			oEvent.preventDefault();

		};

		Month.prototype.onsappagedownmodifiers = function(oEvent){

			// not handled by ItemNavigation
			// go one or 10 years forward
			var oFocusedDate = new UniversalDate(this._getDate().getTime());
			var iYear = oFocusedDate.getUTCFullYear();

			if (oEvent.metaKey || oEvent.ctrlKey) {
				oFocusedDate.setUTCFullYear(iYear + 10);
			} else {
				oFocusedDate.setUTCFullYear(iYear + 1);
			}

			this.fireFocus({date: CalendarUtils._createLocalDate(oFocusedDate), otherMonth: true});

			// cancel the event otherwise the browser select some text
			oEvent.preventDefault();

		};

		/*
		 * called from the calendar in multi-month case to update the interval visualization
		 * for all months.
		 */
		Month.prototype._updateSelection = function(){

			var aSelectedDates = this.getSelectedDates();

			if (aSelectedDates.length > 0 && this.getSingleSelection()) {
				var that = this;
				var oStartDate = aSelectedDates[0].getStartDate();
				if (oStartDate) {
					oStartDate = CalendarUtils._createUniversalUTCDate(oStartDate);
				}
				var oEndDate = aSelectedDates[0].getEndDate();
				if (oEndDate) {
					oEndDate = CalendarUtils._createUniversalUTCDate(oEndDate);
				}
				_updateSelection(that, oStartDate, oEndDate);
			}

		};

		/*
		 * in Calendar with more than one months, other months must handle mousemove too
		 */
		Month.prototype._bindMousemove = function( bFireEvent ){

			jQuery(window.document).bind('mousemove', this._mouseMoveProxy);
			this._bMouseMove = true;

			if (bFireEvent) {
				// fire internal event for Calendar. In MultiMonth case all months must react on mousemove
				this.fireEvent("_bindMousemove");
			}

		};

		Month.prototype._unbindMousemove = function( bFireEvent ){

			jQuery(window.document).unbind('mousemove', this._mouseMoveProxy);
			this._bMouseMove = undefined;
			this._sLastTargetId = undefined;

			if (bFireEvent) {
				// fire internal event for Calendar. In MultiMonth case all months must react on mousemove
				this.fireEvent("_unbindMousemove");
			}

		};

		Month.prototype.onThemeChanged = function(){

			if (this._bNoThemeChange) {
				// already called from Calendar
				return;
			}

			this._bNamesLengthChecked = undefined;
			this._bLongWeekDays = undefined;
			var aWeekHeaders = this.$().find(".sapUiCalWH");
			var oLocaleData = this._getLocaleData();
			var iStartDay = this._getFirstDayOfWeek();
			var aDayNames = oLocaleData.getDaysStandAlone("abbreviated");
			for (var i = 0; i < aWeekHeaders.length; i++) {
				var oWeekDay = aWeekHeaders[i];
				jQuery(oWeekDay).text(aDayNames[(i + iStartDay) % 7]);
			}

			var that = this;
			_checkNamesLength(that);

		};

		Month.prototype._handleBorderReached = function(oControlEvent){

			var oEvent = oControlEvent.getParameter("event");
			var iMonth = 0;
			var oOldDate = this._getDate();
			var oFocusedDate = new UniversalDate(oOldDate.getTime());

			if (oEvent.type) {
				switch (oEvent.type) {
				case "sapnext":
				case "sapnextmodifiers":
					// last day in month reached
					if (oEvent.keyCode == jQuery.sap.KeyCodes.ARROW_DOWN) {
						//goto same day next week
						oFocusedDate.setUTCDate(oFocusedDate.getUTCDate() + 7);
					} else {
						//go to next day
						oFocusedDate.setUTCDate(oFocusedDate.getUTCDate() + 1);
					}
					break;

				case "sapprevious":
				case "sappreviousmodifiers":
					// first day in month reached
					if (oEvent.keyCode == jQuery.sap.KeyCodes.ARROW_UP) {
						//goto same day previous week
						oFocusedDate.setUTCDate(oFocusedDate.getUTCDate() - 7);
					} else {
						//go to previous day
						oFocusedDate.setUTCDate(oFocusedDate.getUTCDate() - 1);
					}
					break;

				case "sappagedown":
					// go to same day next month
					iMonth = oFocusedDate.getUTCMonth() + 1;
					oFocusedDate.setUTCMonth(iMonth);
					// but if the day doesn't exist in this month, go to last day of the month
					if (iMonth % 12 != oFocusedDate.getUTCMonth()) {
						while (iMonth != oFocusedDate.getUTCMonth()) {
							oFocusedDate.setUTCDate(oFocusedDate.getUTCDate() - 1);
						}
					}
					break;

				case "sappageup":
					// go to same day previous month
					iMonth = oFocusedDate.getUTCMonth() - 1;
					oFocusedDate.setUTCMonth(iMonth);
					if (iMonth < 0) {
						iMonth = 11;
					}
					// but if the day doesn't exist in this month, go to last day of the month
					if (iMonth != oFocusedDate.getUTCMonth()) {
						while (iMonth != oFocusedDate.getUTCMonth()) {
							oFocusedDate.setUTCDate(oFocusedDate.getUTCDate() - 1);
						}
					}
					break;

				default:
					break;
				}

				this.fireFocus({date: CalendarUtils._createLocalDate(oFocusedDate), otherMonth: true});

			}

		};

		/**
		 * checks if a date is focusable in the current rendered output.
		 * So if not rendered or in other month it is not focusable.
		 *
		 * @param {object} oDate JavaScript date object for focused date.
		 * @returns {boolean} flag if focusable
		 * @public
		 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
		 */
		Month.prototype.checkDateFocusable = function(oDate){

			if (!(oDate instanceof Date)) {
				throw new Error("Date must be a JavaScript date object; " + this);
			}

			var oMonthDate = this._getDate();
			var oUTCDate = CalendarUtils._createUniversalUTCDate(oDate);

			if (oUTCDate.getUTCFullYear() == oMonthDate.getUTCFullYear() && oUTCDate.getUTCMonth() == oMonthDate.getUTCMonth()) {
				return true;
			} else {
				return false;
			}

		};

		Month.prototype._renderHeader = function(){

			if (this._getShowHeader()) {
				var oDate = this._getDate();
				var oLocaleData = this._getLocaleData();
				var aMonthNames = oLocaleData.getMonthsStandAlone("wide");
				this.$("Head").text(aMonthNames[oDate.getUTCMonth()]);
			}

		};

		function _initItemNavigation(oThis){

			var oDate = oThis._getDate();
			var sYyyymmdd = oThis._oFormatYyyymmdd.format(oDate, true);
			var iIndex = 0;

			var oRootDomRef = oThis.$("days").get(0);
			var aDomRefs = oThis.$("days").find(".sapUiCalItem");

			for ( var i = 0; i < aDomRefs.length; i++) {
				var $DomRef = jQuery(aDomRefs[i]);
				if ($DomRef.attr("data-sap-day") === sYyyymmdd) {
					iIndex = i;
					break;
				}
			}

			if (!oThis._oItemNavigation) {
				oThis._oItemNavigation = new ItemNavigation();
				oThis._oItemNavigation.attachEvent(ItemNavigation.Events.AfterFocus, _handleAfterFocus, oThis);
				oThis._oItemNavigation.attachEvent(ItemNavigation.Events.FocusAgain, _handleFocusAgain, oThis);
				oThis._oItemNavigation.attachEvent(ItemNavigation.Events.BorderReached, oThis._handleBorderReached, oThis);
				oThis.addDelegate(oThis._oItemNavigation);
				if (oThis._iColumns > 1) {
					oThis._oItemNavigation.setHomeEndColumnMode(true, true);
				}
				oThis._oItemNavigation.setDisabledModifiers({
					sapnext : ["alt"],
					sapprevious : ["alt"],
					saphome : ["alt"],
					sapend : ["alt"]
				});
				oThis._oItemNavigation.setCycling(false);
				oThis._oItemNavigation.setColumns(oThis._iColumns, true);
			}
			oThis._oItemNavigation.setRootDomRef(oRootDomRef);
			oThis._oItemNavigation.setItemDomRefs(aDomRefs);
			oThis._oItemNavigation.setFocusedIndex(iIndex);
			oThis._oItemNavigation.setPageSize(aDomRefs.length); // to make sure that pageup/down goes out of month

		}

		function _handleAfterFocus(oControlEvent){

			var iIndex = oControlEvent.getParameter("index");
			var oEvent = oControlEvent.getParameter("event");

			if (!oEvent) {
				return; // happens if focus is set via ItemNavigation.focusItem directly
			}

			var that = this;
			var oOldDate = this._getDate();
			var oFocusedDate = new UniversalDate(oOldDate.getTime());
			var bOtherMonth = false;
			var bFireFocus = true;

			var aDomRefs = this._oItemNavigation.getItemDomRefs();
			var i = 0;

			// find out what day was focused
			var $DomRef = jQuery(aDomRefs[iIndex]);
			var $DomRefDay;
			/* eslint-disable no-lonely-if */
			if ($DomRef.hasClass("sapUiCalItemOtherMonth")) {
				if (oEvent.type == "saphomemodifiers" && (oEvent.metaKey || oEvent.ctrlKey)) {
					// on ctrl+home key focus first day of month
					oFocusedDate.setUTCDate(1);
					_focusDate(that, oFocusedDate);
				} else if (oEvent.type == "sapendmodifiers" && (oEvent.metaKey || oEvent.ctrlKey)) {
					// on ctrl+end key focus last day of month
					for ( i = aDomRefs.length - 1; i > 0; i--) {
						$DomRefDay = jQuery(aDomRefs[i]);
						if (!$DomRefDay.hasClass("sapUiCalItemOtherMonth")) {
							oFocusedDate = new UniversalDate(this._oFormatYyyymmdd.parse($DomRefDay.attr("data-sap-day"), true).getTime());
							break;
						}
					}
					_focusDate(that, oFocusedDate);
				} else {
					// focus old date again, but tell parent about the new date
					bOtherMonth = true;
					oFocusedDate = new UniversalDate(this._oFormatYyyymmdd.parse($DomRef.attr("data-sap-day"), true).getTime());
					if (!oFocusedDate) {
						oFocusedDate = new UniversalDate(oOldDate.getTime()); // e.g. year > 9999
					}
					_focusDate(that, oOldDate);

					if (oEvent.type == "mousedown" ||
							(this._sTouchstartYyyyMMdd && oEvent.type == "focusin" && this._sTouchstartYyyyMMdd == $DomRef.attr("data-sap-day"))) {
						// don't focus date in other month via mouse -> don't switch month in calendar while selecting day
						bFireFocus = false;
						this.fireFocus({date: CalendarUtils._createLocalDate(oOldDate), otherMonth: false, restoreOldDate: true});
					}

					// on touch devices a focusin is fired asyncrounously after the touch/mouse handling on DOM element if the focus was changed in the meantime
					// focus old date again and do not fire focus event
					if (oEvent.originalEvent && oEvent.originalEvent.type == "touchstart") {
						this._sTouchstartYyyyMMdd = $DomRef.attr("data-sap-day");
					} else {
						this._sTouchstartYyyyMMdd = undefined;
					}
				}
			} else {
				// day in current month focused
				if (jQuery(oEvent.target).hasClass("sapUiCalWeekNum")) {
					// click on week number - focus old date
					_focusDate(that, oFocusedDate);
				}else {
					// not if clicked on week number
					oFocusedDate = new UniversalDate(this._oFormatYyyymmdd.parse($DomRef.attr("data-sap-day"), true).getTime());
					this._setDate(oFocusedDate);
				}
				this._sTouchstartYyyyMMdd = undefined;
			}

			if (oEvent.type == "mousedown" && this.getIntervalSelection()) {
				// as in the focus event the month can be changed, store the last target here
				this._sLastTargetId = $DomRef.attr("id");
			}

			if (bFireFocus) {
				this.fireFocus({date: CalendarUtils._createLocalDate(oFocusedDate), otherMonth: bOtherMonth});
			}

			if (oEvent.type == "mousedown") {
				// as no click event is fired in some cases, e.g. if month is changed (because of changing DOM) select the day on mousedown
				_handleMousedown(that, oEvent, oFocusedDate, iIndex);
			}

		}

		function _handleFocusAgain(oControlEvent){

			var iIndex = oControlEvent.getParameter("index");
			var oEvent = oControlEvent.getParameter("event");

			if (!oEvent) {
				return; // happens if focus is set via ItemNavigation.focusItem directly
			}

			if (oEvent.type == "mousedown") {
				// as no click event is fired in some cases, e.g. if month is changed (because of changing DOM) select the day on mousedown
				var that = this;
				var oFocusedDate = this._getDate();
				if (this.getIntervalSelection()) {
					var aDomRefs = this._oItemNavigation.getItemDomRefs();
					this._sLastTargetId = aDomRefs[iIndex].id;
				}
				_handleMousedown(that, oEvent, oFocusedDate, iIndex);
			}

		}

		function _handleMousedown(oThis, oEvent, oFocusedDate, iIndex){

			if (oEvent.button) {
				// only use left mouse button
				return;
			}

			_selectDay(oThis, oFocusedDate);
			oThis._bMousedownChange = true;
			oThis._bMousedownChange = true;

			if (oThis._bMouseMove) {
				// a mouseup must be happened outside of control -> just end move
				oThis._unbindMousemove(true);
				oThis._bMoveChange = false;
			}else if (oThis.getIntervalSelection() && oThis.$().is(":visible")) {
				// if calendar was closed in select event, do not add mousemove handler
				oThis._bindMousemove(true);
			}

			oEvent.preventDefault(); // to prevent focus set outside of DatePicker
			oEvent.setMark("cancelAutoClose");

		}

		function _changeDate (oThis, oDate, bNoFocus){

			if (!(oDate instanceof Date)) {
				throw new Error("Date must be a JavaScript date object; " + oThis);
			}

			var iYear = oDate.getFullYear();
			if (iYear < 1 || iYear > 9999) {
				throw new Error("Date must not be in valid range (between 0001-01-01 and 9999-12-31); " + oThis);
			}

			var bFocusable = true; // if date not changed it is still focusable
			if (!jQuery.sap.equal(oThis.getDate(), oDate)) {
				var oUTCDate = CalendarUtils._createUniversalUTCDate(oDate);
				bFocusable = oThis.checkDateFocusable(oDate);
				oThis.setProperty("date", oDate, true);
				oThis._oUTCDate = oUTCDate;
			}

			if (oThis.getDomRef()) {
				if (bFocusable) {
					if (!bNoFocus) {
					_focusDate(oThis, oThis._oUTCDate, true);
					}
				} else {
					_renderMonth(oThis, bNoFocus);
				}
			}

		}

		function _focusDate (oThis, oDate, bNoSetDate){

			if (!bNoSetDate) {
				// use JS date as public function is called
				oThis.setDate(CalendarUtils._createLocalDate(new Date(oDate.getTime())));
			}

			var sYyyymmdd = oThis._oFormatYyyymmdd.format(oDate, true);
			var aDomRefs = oThis._oItemNavigation.getItemDomRefs();
			var $DomRefDay;
			for ( var i = 0; i < aDomRefs.length; i++) {
				$DomRefDay = jQuery(aDomRefs[i]);
				if ($DomRefDay.attr("data-sap-day") == sYyyymmdd) {
					if (document.activeElement != aDomRefs[i]) {
						oThis._oItemNavigation.focusItem(i);
					}
					break;
				}
			}

		}

		function _renderMonth(oThis, bNoFocus){

			var oDate = oThis.getRenderer().getStartDate(oThis);
			var $Container = oThis.$("days");
			var aDomRefs;
			var $DomRef;
			var i = 0;
			var iLastIndex = 0;

			if (oThis._sLastTargetId) {
				// new month during mousemove -> get index of last moving taget to ignore move on same area
				aDomRefs = oThis._oItemNavigation.getItemDomRefs();
				for ( i = 0; i < aDomRefs.length; i++) {
					$DomRef = jQuery(aDomRefs[i]);
					if ($DomRef.attr("id") == oThis._sLastTargetId) {
						iLastIndex = i;
						break;
					}
				}
			}

			if ($Container.length > 0) {
				var oRm = sap.ui.getCore().createRenderManager();
				oThis.getRenderer().renderDays(oRm, oThis, oDate);
				oRm.flush($Container[0]);
				oRm.destroy();
			}

			oThis._renderHeader();

			// fire internal event for DatePicker for with number of rendered days. If Calendar becomes larger maybe popup must change position
			oThis.fireEvent("_renderMonth", {days: $Container.find(".sapUiCalItem").length});

			_initItemNavigation(oThis);
			if (!bNoFocus) {
				oThis._oItemNavigation.focusItem(oThis._oItemNavigation.getFocusedIndex());
			}

			if (oThis._sLastTargetId) {
				// new month during mousemove -> get index of last moving taget to ignore move on same area
				aDomRefs = oThis._oItemNavigation.getItemDomRefs();
				if (iLastIndex <= aDomRefs.length - 1) {
					$DomRef = jQuery(aDomRefs[iLastIndex]);
					oThis._sLastTargetId = $DomRef.attr("id");
				}
			}

		}

		function _selectDay(oThis, oDate, bMove){

			var aSelectedDates = oThis.getSelectedDates();
			var oDateRange;
			var aDomRefs = oThis._oItemNavigation.getItemDomRefs();
			var $DomRef;
			var sYyyymmdd;
			var i = 0;
			var oParent = oThis.getParent();
			var oAggOwner = oThis;
			var oStartDate;

			if (oParent && oParent.getSelectedDates) {
				// if used in Calendar use the aggregation of this one
				oAggOwner = oParent;
			}

			/* eslint-disable no-lonely-if */
			if (oThis.getSingleSelection()) {

				if (aSelectedDates.length > 0) {
					oDateRange = aSelectedDates[0];
					oStartDate = oDateRange.getStartDate();
					if (oStartDate) {
						oStartDate = CalendarUtils._createUniversalUTCDate(oStartDate);
					}
				} else {
					oDateRange = new sap.ui.unified.DateRange();
					oAggOwner.addAggregation("selectedDates", oDateRange, true); // no re-rendering
				}

				if (oThis.getIntervalSelection() && (!oDateRange.getEndDate() || bMove) && oStartDate) {
					// single interval selection
					var oEndDate;
					if (oDate.getTime() < oStartDate.getTime()) {
						oEndDate = oStartDate;
						oStartDate = oDate;
						if (!bMove) {
							// in move mode do not set date. this bring broblems if on backward move the start date would be cahnged
							oDateRange.setProperty("startDate", CalendarUtils._createLocalDate(new Date(oStartDate.getTime())), true); // no-rerendering
							oDateRange.setProperty("endDate", CalendarUtils._createLocalDate(new Date(oEndDate.getTime())), true); // no-rerendering
						}
					} else if (oDate.getTime() >= oStartDate.getTime()) {
						// single day ranges are allowed
						oEndDate = oDate;
						if (!bMove) {
							oDateRange.setProperty("endDate", CalendarUtils._createLocalDate(new Date(oEndDate.getTime())), true); // no-rerendering
						}
					}
					_updateSelection(oThis, oStartDate, oEndDate);
				} else {
					// single day selection or start a new interval
					_updateSelection(oThis, oDate);

					oDateRange.setProperty("startDate", CalendarUtils._createLocalDate(new Date(oDate.getTime())), true); // no-rerendering
					oDateRange.setProperty("endDate", undefined, true); // no-rerendering
				}
			} else {
				// multiple selection
				if (oThis.getIntervalSelection()) {
					throw new Error("Calender don't support multiple interval selection");

				} else {
					var iSelected = oThis._checkDateSelected(oDate);
					if (iSelected > 0) {
						// already selected - deselect
						for ( i = 0; i < aSelectedDates.length; i++) {
							oStartDate = aSelectedDates[i].getStartDate();
							if (oStartDate && oDate.getTime() == CalendarUtils._createUniversalUTCDate(oStartDate).getTime()) {
								oAggOwner.removeAggregation("selectedDates", i, true); // no re-rendering
								break;
							}
						}
					} else {
						// not selected -> select
						oDateRange = new sap.ui.unified.DateRange({startDate: CalendarUtils._createLocalDate(new Date(oDate.getTime()))});
						oAggOwner.addAggregation("selectedDates", oDateRange, true); // no re-rendering
					}
					sYyyymmdd = oThis._oFormatYyyymmdd.format(oDate, true);
					for ( i = 0; i < aDomRefs.length; i++) {
						$DomRef = jQuery(aDomRefs[i]);
						if ($DomRef.attr("data-sap-day") == sYyyymmdd) {
							if (iSelected > 0) {
								$DomRef.removeClass("sapUiCalItemSel");
								$DomRef.attr("aria-selected", "false");
							} else {
								$DomRef.addClass("sapUiCalItemSel");
								$DomRef.attr("aria-selected", "true");
							}
						}
					}
				}
			}

		}

		function _updateSelection(oThis, oStartDate, oEndDate){

			var aDomRefs = oThis._oItemNavigation.getItemDomRefs();
			var $DomRef;
			var i = 0;
			var bStart = false;
			var bEnd = false;

			if (!oEndDate) {
				// start of interval or single date
				var sYyyymmdd = oThis._oFormatYyyymmdd.format(oStartDate, true);
				for ( i = 0; i < aDomRefs.length; i++) {
					$DomRef = jQuery(aDomRefs[i]);
					bStart = false;
					bEnd = false;
					if ($DomRef.attr("data-sap-day") == sYyyymmdd) {
						$DomRef.addClass("sapUiCalItemSel");
						$DomRef.attr("aria-selected", "true");
						bStart = true;
					} else if ($DomRef.hasClass("sapUiCalItemSel")) {
						$DomRef.removeClass("sapUiCalItemSel");
						$DomRef.attr("aria-selected", "false");
					}
					if ($DomRef.hasClass("sapUiCalItemSelStart")) {
						$DomRef.removeClass("sapUiCalItemSelStart");
					} else if ($DomRef.hasClass("sapUiCalItemSelBetween")) {
						$DomRef.removeClass("sapUiCalItemSelBetween");
					} else if ($DomRef.hasClass("sapUiCalItemSelEnd")) {
						$DomRef.removeClass("sapUiCalItemSelEnd");
					}
					_updateARIADesrcibedby(oThis, $DomRef, bStart, bEnd);
				}
			} else {
				var oDay;
				for ( i = 0; i < aDomRefs.length; i++) {
					$DomRef = jQuery(aDomRefs[i]);
					bStart = false;
					bEnd = false;
					oDay = new UniversalDate(oThis._oFormatYyyymmdd.parse($DomRef.attr("data-sap-day"), true).getTime());
					if (oDay.getTime() == oStartDate.getTime()) {
						$DomRef.addClass("sapUiCalItemSelStart");
						bStart = true;
						$DomRef.addClass("sapUiCalItemSel");
						$DomRef.attr("aria-selected", "true");
						if (oEndDate && oDay.getTime() == oEndDate.getTime()) {
							// start day and end day are the same
							$DomRef.addClass("sapUiCalItemSelEnd");
							bEnd = true;
						}
						$DomRef.removeClass("sapUiCalItemSelBetween");
					} else if (oEndDate && oDay.getTime() > oStartDate.getTime() && oDay.getTime() < oEndDate.getTime()) {
						$DomRef.addClass("sapUiCalItemSel");
						$DomRef.attr("aria-selected", "true");
						$DomRef.addClass("sapUiCalItemSelBetween");
						$DomRef.removeClass("sapUiCalItemSelStart");
						$DomRef.removeClass("sapUiCalItemSelEnd");
					} else if (oEndDate && oDay.getTime() == oEndDate.getTime()) {
						$DomRef.addClass("sapUiCalItemSelEnd");
						bEnd = true;
						$DomRef.addClass("sapUiCalItemSel");
						$DomRef.attr("aria-selected", "true");
						$DomRef.removeClass("sapUiCalItemSelStart");
						$DomRef.removeClass("sapUiCalItemSelBetween");
					} else {
						if ($DomRef.hasClass("sapUiCalItemSel")) {
							$DomRef.removeClass("sapUiCalItemSel");
							$DomRef.attr("aria-selected", "false");
						}
						if ($DomRef.hasClass("sapUiCalItemSelStart")) {
							$DomRef.removeClass("sapUiCalItemSelStart");
						} else if ($DomRef.hasClass("sapUiCalItemSelBetween")) {
							$DomRef.removeClass("sapUiCalItemSelBetween");
						} else if ($DomRef.hasClass("sapUiCalItemSelEnd")) {
							$DomRef.removeClass("sapUiCalItemSelEnd");
						}
					}
					_updateARIADesrcibedby(oThis, $DomRef, bStart, bEnd);
				}
			}

		}

		function _updateARIADesrcibedby(oThis, $DomRef, bStart, bEnd){

			if (!oThis.getIntervalSelection()) {
				return;
			}

			var sDescribedBy = "";
			var aDescribedBy = [];
			var sId = oThis.getId();
			var bChanged = false;

			sDescribedBy = $DomRef.attr("aria-describedby");
			if (sDescribedBy) {
				aDescribedBy = sDescribedBy.split(" ");
			}

			var iStartIndex = -1;
			var iEndIndex = -1;
			for (var i = 0; i < aDescribedBy.length; i++) {
				var sDescrId = aDescribedBy[i];
				if (sDescrId == (sId + "-Start")) {
					iStartIndex = i;
				}
				if (sDescrId == (sId + "-End")) {
					iEndIndex = i;
				}
			}

			if (iStartIndex >= 0 && !bStart) {
				aDescribedBy.splice(iStartIndex, 1);
				bChanged = true;
				if (iEndIndex > iStartIndex) {
					iEndIndex--;
				}
			}
			if (iEndIndex >= 0 && !bEnd) {
				aDescribedBy.splice(iEndIndex, 1);
				bChanged = true;
			}

			if (iStartIndex < 0 && bStart) {
				aDescribedBy.push(sId + "-Start");
				bChanged = true;
			}
			if (iEndIndex < 0 && bEnd) {
				aDescribedBy.push(sId + "-End");
				bChanged = true;
			}

			if (bChanged) {
				sDescribedBy = aDescribedBy.join(" ");
				$DomRef.attr("aria-describedby", sDescribedBy);
			}

		}

		function _fireSelect(oThis){

			if (oThis._bMouseMove) {
				// detach mouse move handler because calendar might be losed in select event handler
				oThis._unbindMousemove(true);
			}

			oThis.fireSelect();

		}

		function _checkNamesLength(oThis){

			if (!oThis._bNamesLengthChecked) {
				// only once - cannot change by rerendering - only by theme change
				var oWeekDay;

				// check day names
				var aWeekHeaders = oThis.$().find(".sapUiCalWH");
				var bTooLong = false;
				var i = 0;

				for (i = 0; i < aWeekHeaders.length; i++) {
					oWeekDay = aWeekHeaders[i];
					if (Math.abs(oWeekDay.clientWidth - oWeekDay.scrollWidth) > 1) {
						bTooLong = true;
						break;
					}
				}

				if (bTooLong) {
					oThis._bLongWeekDays = false;
					var oLocaleData = oThis._getLocaleData();
					var iStartDay = oThis._getFirstDayOfWeek();
					var aDayNames = oLocaleData.getDaysStandAlone("narrow");
					for ( i = 0; i < aWeekHeaders.length; i++) {
						oWeekDay = aWeekHeaders[i];
						jQuery(oWeekDay).text(aDayNames[(i + iStartDay) % 7]);
					}
				} else {
					oThis._bLongWeekDays = true;
				}

				oThis._bNamesLengthChecked = true;
			}

		}

		function _invalidateMonth(oThis){

			oThis._sInvalidateMonth = undefined;

			_renderMonth(oThis, oThis._bNoFocus);
			oThis._bDateRangeChanged = undefined;
			oThis._bNoFocus = undefined; // set in Calendar to prevent focus flickering for multiple months

		}

	}());

	return Month;

}, /* bExport= */ true);
