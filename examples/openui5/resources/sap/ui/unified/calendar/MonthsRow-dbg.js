/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.unified.CalendarMonthInterval.
sap.ui.define(['jquery.sap.global', 'sap/ui/core/Control', 'sap/ui/core/LocaleData', 'sap/ui/core/delegate/ItemNavigation',
               'sap/ui/model/type/Date', 'sap/ui/unified/calendar/CalendarUtils', 'sap/ui/core/date/UniversalDate', 'sap/ui/unified/library'],
	function(jQuery, Control, LocaleData, ItemNavigation, Date1, CalendarUtils, UniversalDate, library) {
	"use strict";

	/*
	 * <code>UniversalDate</code> objects are used inside the <code>MonthsRow</code>, whereas JavaScript dates are used in the API.
	 * This means that a conversion must be performed for the API functions.
	 */

	/**
	 * Constructor for a new <code>MonthsRow</code>.
	 * It shows a calendar with month granularity
	 *
	 * <b>Note:</b> This is used inside the CalendarMonthInterval, not for standalone usage.
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * Renders a row of months using ItemNavigation. There is no paging or navigation outside the rendered area implemented.
	 * This is done inside the CalendarMonthInterval.
	 * If used inside the CalendarMonthInterval the properties and aggregation are directly taken from the parent
	 * (to not duplicate and synchronize DateRanges and so on...).
	 *
	 * The MontsRow works with JavaScript Date objects, but only the month and the year are used to display and interact.
	 * As representation for a month, the 1st of the month will always be returned in the API.
	 * @extends sap.ui.core.Control
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @since 1.32.0
	 * @alias sap.ui.unified.calendar.MonthsRow
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var MonthsRow = Control.extend("sap.ui.unified.calendar.MonthsRow", /** @lends sap.ui.unified.calendar.MonthsRow.prototype */ { metadata : {

		library : "sap.ui.unified",
		properties : {
			/**
			 * A date as JavaScript Date object. The month including this date is rendered and this date is focused initially (if no other focus is set).
			 * If the date property is not in the range <code>startDate</code> + <code>months</code> in the rendering phase,
			 * it is set to the <code>startDate</code>.
			 * So after setting the <code>startDate</code> the date should be set to be in the visible range.
			 */
			date : {type : "object", group : "Misc"},

			/**
			 * Start date, as JavaScript Date object, of the row. The month of this date is the first month of the displayed row.
			 */
			startDate : {type : "object", group : "Misc"},

			/**
			 * Number of months displayed
			 */
			months : {type : "int", group : "Misc", defaultValue : 12},

			/**
			 * If set, interval selection is allowed
			 */
			intervalSelection : {type : "boolean", group : "Misc", defaultValue : false},

			/**
			 * If set, only a single month or interval, if intervalSelection is enabled, can be selected
			 *
			 * <b>Note:</b> Selection of multiple intervals is not supported in the current version.
			 */
			singleSelection : {type : "boolean", group : "Misc", defaultValue : true},

			/**
			 * If set, a header with the years is shown to visualize what month belongs to what year.
			 */
			showHeader : {type : "boolean", group : "Misc", defaultValue : false}
		},
		aggregations : {

			/**
			 * Date ranges for selected dates.
			 * If <code>singleSelection</code> is set, only the first entry is used.
			 *
			 * <b>Note:</b> Even if only one day is selected, the whole corresponding month is selected.
			 */
			selectedDates : {type : "sap.ui.unified.DateRange", multiple : true, singularName : "selectedDate"},

			/**
			 * Date ranges with type to visualize special months in the row.
			 * If one day is assigned to more than one type, only the first one will be used.
			 *
			 * <b>Note:</b> Even if only one day is set as a special day, the whole corresponding month is displayed in this way.
			 */
			specialDates : {type : "sap.ui.unified.DateTypeRange", multiple : true, singularName : "specialDate"}
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
			 * Month focus changed
			 */
			focus : {
				parameters : {
					/**
					 * First date, as JavaScript Date object, of the month that is focused.
					 */
					date : {type : "object"},
					/**
					 * If set, the focused date is not rendered yet. (This happens by navigating out of the visible area.)
					 */
					notVisible : {type : "boolean"}
				}
			}
		}
	}});

	(function() {

		MonthsRow.prototype.init = function(){

			this._oFormatYyyymm = sap.ui.core.format.DateFormat.getInstance({pattern: "yyyyMM"});
			this._oFormatLong = sap.ui.core.format.DateFormat.getInstance({pattern: "MMMM y"});

			this._mouseMoveProxy = jQuery.proxy(this._handleMouseMove, this);

			this._rb = sap.ui.getCore().getLibraryResourceBundle("sap.ui.unified");

		};

		MonthsRow.prototype.exit = function(){

			if (this._oItemNavigation) {
				this.removeDelegate(this._oItemNavigation);
				this._oItemNavigation.destroy();
				delete this._oItemNavigation;
			}

			if (this._sInvalidateMonths) {
				jQuery.sap.clearDelayedCall(this._sInvalidateMonths);
			}

		};

		MonthsRow.prototype.onAfterRendering = function(){

			_initItemNavigation.call(this);

			// check if day names are too big -> use smaller ones
			_checkNamesLength.call(this);

		};

		MonthsRow.prototype.onsapfocusleave = function(oEvent){

			if (!oEvent.relatedControlId || !jQuery.sap.containsOrEquals(this.getDomRef(), sap.ui.getCore().byId(oEvent.relatedControlId).getFocusDomRef())) {
				if (this._bMouseMove) {
					_unbindMousemove.call(this, true);

					_selectMonth.call(this, this._getDate());
					this._bMoveChange = false;
					this._bMousedownChange = false;
					_fireSelect.call(this);
				}

				if (this._bMousedownChange) {
					// mouseup somewhere outside of control -> if focus left finish selection
					this._bMousedownChange = false;
					_fireSelect.call(this);
				}
			}

		};

		// overwrite invalidate to recognize changes on selectedDates
		MonthsRow.prototype.invalidate = function(oOrigin) {

			if (!this._bDateRangeChanged && (!oOrigin || !(oOrigin instanceof sap.ui.unified.DateRange))) {
				Control.prototype.invalidate.apply(this, arguments);
			} else if (this.getDomRef() && !this._sInvalidateMonths) {
				// DateRange changed -> only rerender months
				// do this only once if more DateRanges / Special days are changed
				if (this._bInvalidateSync) { // set if calendar already invalidates in delayed call
					_invalidateMonths.call(this);
				} else {
					this._sInvalidateMonths = jQuery.sap.delayedCall(0, this, _invalidateMonths);
				}
			}

		};

		// overwrite removing of date ranged because invalidate don't get information about it
		MonthsRow.prototype.removeAllSelectedDates = function() {

			this._bDateRangeChanged = true;
			var aRemoved = this.removeAllAggregation("selectedDates");
			return aRemoved;

		};

		MonthsRow.prototype.destroySelectedDates = function() {

			this._bDateRangeChanged = true;
			var oDestroyed = this.destroyAggregation("selectedDates");
			return oDestroyed;

		};

		MonthsRow.prototype.removeAllSpecialDates = function() {

			this._bDateRangeChanged = true;
			var aRemoved = this.removeAllAggregation("specialDates");
			return aRemoved;

		};

		MonthsRow.prototype.destroySpecialDates = function() {

			this._bDateRangeChanged = true;
			var oDestroyed = this.destroyAggregation("specialDates");
			return oDestroyed;

		};

		MonthsRow.prototype.setDate = function(oDate){

			_changeDate.call(this, oDate, false);

			return this;

		};

		MonthsRow.prototype._setDate = function(oDate){

			var oLocaleDate = CalendarUtils._createLocalDate(oDate);
			this.setProperty("date", oLocaleDate, true);
			this._oUTCDate = oDate;

		};

		MonthsRow.prototype._getDate = function(){

			if (!this._oUTCDate) {
				this._oUTCDate = CalendarUtils._createUniversalUTCDate(new Date());
			}

			return this._oUTCDate;

		};

		MonthsRow.prototype.setStartDate = function(oStartDate){

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
			this._oUTCStartDate.setUTCDate(1); // always use begin of month as start date

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

		MonthsRow.prototype._getStartDate = function(){

			if (!this._oUTCStartDate) {
				this._oUTCStartDate = CalendarUtils._createUniversalUTCDate(new Date());
				this._oUTCStartDate.setUTCDate(1); // always use begin of month as start date
			}

			return this._oUTCStartDate;
		};

		/**
		 * Displays the month of a given date without setting the focus
		 *
		 * @param {object} oDate JavaScript Date object for focused date.
		 * @returns {sap.ui.unified.calendar.MonthsRow} <code>this</code> to allow method chaining
		 * @public
		 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
		 */
		MonthsRow.prototype.displayDate = function(oDate){

			_changeDate.call(this, oDate, true);

			return this;

		};

		/*
		 * Use rendered locale for stand alone control
		 * But as Calendar can have an own locale, use this one if used inside Calendar
		 */
		MonthsRow.prototype._getLocale = function(){

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
		MonthsRow.prototype._getLocaleData = function(){

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
		MonthsRow.prototype._getFormatLong = function(){

			var sLocale = this._getLocale();

			if (this._oFormatLong.oLocale.toString() != sLocale) {
				var oLocale = new sap.ui.core.Locale(sLocale);
				this._oFormatLong = sap.ui.core.format.DateFormat.getInstance({style: "long"} , oLocale);
			}

			return this._oFormatLong;

		};

		/*
		 * if used inside CalendarMonthInterval get the value from the parent
		 * To don't have sync issues...
		 */
		MonthsRow.prototype.getIntervalSelection = function(){

			var oParent = this.getParent();

			if (oParent && oParent.getIntervalSelection) {
				return oParent.getIntervalSelection();
			} else {
				return this.getProperty("intervalSelection");
			}

		};

		/*
		 * if used inside CalendarMonthInterval get the value from the parent
		 * To don't have sync issues...
		 */
		MonthsRow.prototype.getSingleSelection = function(){

			var oParent = this.getParent();

			if (oParent && oParent.getSingleSelection) {
				return oParent.getSingleSelection();
			} else {
				return this.getProperty("singleSelection");
			}

		};

		/*
		 * if used inside CalendarMonthInterval get the value from the parent
		 * To don't have sync issues...
		 */
		MonthsRow.prototype.getSelectedDates = function(){

			var oParent = this.getParent();

			if (oParent && oParent.getSelectedDates) {
				return oParent.getSelectedDates();
			} else {
				return this.getAggregation("selectedDates", []);
			}

		};

		/*
		 * if used inside CalendarMonthInterval get the value from the parent
		 * To don't have sync issues...
		 */
		MonthsRow.prototype.getSpecialDates = function(){

			var oParent = this.getParent();

			if (oParent && oParent.getSpecialDates) {
				return oParent.getSpecialDates();
			} else {
				return this.getAggregation("specialDates", []);
			}

		};

		/*
		 * if used inside CalendarMonthInterval get the value from the parent
		 * To don't have sync issues...
		 */
		MonthsRow.prototype._getShowHeader = function(){

			var oParent = this.getParent();

			if (oParent && oParent._getShowItemHeader) {
				return oParent._getShowItemHeader();
			} else {
				return this.getProperty("showHeader");
			}

		};

		/*
		 * if used inside CalendarMonthInterval get the value from the parent
		 * To don't have sync issues...
		 */
		MonthsRow.prototype.getAriaLabelledBy = function(){

			var oParent = this.getParent();

			if (oParent && oParent.getAriaLabelledBy) {
				return oParent.getAriaLabelledBy();
			} else {
				return this.getAssociation("ariaLabelledBy", []);
			}

		};

		/*
		 * Checks if a date is selected and what kind of selected
		 * @return {int} iSelected 0: not selected; 1: single day selected, 2: interval start, 3: interval end, 4: interval between, 5: one day interval (start = end)
		 * @private
		 */
		MonthsRow.prototype._checkDateSelected = function(oDate){

			if (!(oDate instanceof UniversalDate)) {
				throw new Error("Date must be a UniversalDate object " + this);
			}

			var iSelected = 0;
			var aSelectedDates = this.getSelectedDates();
			var oMyDate = new UniversalDate(oDate.getTime());
			oMyDate.setUTCDate(1); //always use begin of month for test
			var oTimeStamp = oMyDate.getTime();

			for ( var i = 0; i < aSelectedDates.length; i++) {
				// initalize the time part of the start and end time
				var oRange = aSelectedDates[i];
				var oStartDate = oRange.getStartDate();
				var oStartTimeStamp = 0;
				if (oStartDate) {
					oStartDate = CalendarUtils._createUniversalUTCDate(oStartDate);
					oStartDate.setUTCDate(1); // begin of month
					oStartTimeStamp = oStartDate.getTime();
				}
				var oEndDate = oRange.getEndDate();
				var oEndTimeStamp = 0;
				if (oEndDate) {
					oEndDate = CalendarUtils._createUniversalUTCDate(oEndDate);
					oEndDate.setUTCDate(1); // begin of month
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
		MonthsRow.prototype._getDateType = function(oDate){

			if (!(oDate instanceof UniversalDate)) {
				throw new Error("Date must be a UniversalDate object " + this);
			}

			var oType;
			var aSpecialDates = this.getSpecialDates();
			var oMyDate = new UniversalDate(oDate.getTime());
			oMyDate.setUTCDate(1); //always use begin of month for test
			var oTimeStamp = oMyDate.getTime();

			for ( var i = 0; i < aSpecialDates.length; i++) {
				// initialize the time part of the start and end time
				var oRange = aSpecialDates[i];
				var oStartDate = oRange.getStartDate();
				var oStartTimeStamp = 0;
				if (oStartDate) {
					oStartDate = CalendarUtils._createUniversalUTCDate(oStartDate);
					oStartDate.setUTCDate(1); // begin of month
					oStartTimeStamp = oStartDate.getTime();
				}
				var oEndDate = oRange.getEndDate();
				var oEndTimeStamp = 0;
				if (oEndDate) {
					oEndDate = CalendarUtils._createUniversalUTCDate(oEndDate);
					oEndDate.setUTCDate(1); // begin of month
					oEndDate.setUTCMonth(oEndDate.getUTCMonth() + 1); // next month
					oEndDate.setUTCDate(0); // end of needed Month
					oEndTimeStamp = oEndDate.getTime();
				}

				if ((oTimeStamp == oStartTimeStamp && !oEndDate) || (oTimeStamp >= oStartTimeStamp && oTimeStamp <= oEndTimeStamp)) {
					oType = {type: oRange.getType(), tooltip: oRange.getTooltip_AsString()};
					break;
				}
			}

			return oType;

		};

		MonthsRow.prototype._handleMouseMove = function(oEvent){

			if (!this.$().is(":visible")) {
				// calendar was closed -> remove mousemove handler
				_unbindMousemove.call(this, true);
			}

			var $Target = jQuery(oEvent.target);

			if ($Target.hasClass("sapUiCalItemText")) {
				$Target = $Target.parent();
			}

			if ($Target.hasClass("sapUiCalItem")) {
				var oOldFocusedDate = this._getDate();
				var oFocusedDate = new UniversalDate(this._oFormatYyyymm.parse($Target.attr("data-sap-month"), true).getTime());

				if (oFocusedDate.getTime() != oOldFocusedDate.getTime()) {
					this._setDate(oFocusedDate);
					_selectMonth.call(this, oFocusedDate, true);
					this._bMoveChange = true;
				}
			}

		};

		MonthsRow.prototype.onmouseup = function(oEvent){

			if (this._bMouseMove) {
				_unbindMousemove.call(this, true);

				// focus now selected day
				var oFocusedDate = this._getDate();
				var aDomRefs = this._oItemNavigation.getItemDomRefs();

				for ( var i = 0; i < aDomRefs.length; i++) {
					var $DomRef = jQuery(aDomRefs[i]);
					if ($DomRef.attr("data-sap-month") == this._oFormatYyyymm.format(oFocusedDate, true)) {
						$DomRef.focus();
						break;
					}
				}

				if (this._bMoveChange) {
					// selection was changed -> make it final
					var $Target = jQuery(oEvent.target);

					if ($Target.hasClass("sapUiCalItemText")) {
						$Target = $Target.parent();
					}

					if ($Target.hasClass("sapUiCalItem")) {
						oFocusedDate = new UniversalDate(this._oFormatYyyymm.parse($Target.attr("data-sap-month"), true).getTime());
					}

					_selectMonth.call(this, oFocusedDate);
					this._bMoveChange = false;
					this._bMousedownChange = false;
					_fireSelect.call(this);
				}
			}

			if (this._bMousedownChange) {
				this._bMousedownChange = false;
				_fireSelect.call(this);
			}

		};

		MonthsRow.prototype.onsapselect = function(oEvent){

			// focused item must be selected
			_selectMonth.call(this, this._getDate());
			_fireSelect.call(this);

			//to prevent bubbling into input field if in DatePicker
			oEvent.stopPropagation();
			oEvent.preventDefault();

		};

		MonthsRow.prototype.onsapselectmodifiers = function(oEvent){

			this.onsapselect(oEvent);

		};

		MonthsRow.prototype.onsappageupmodifiers = function(oEvent){

			// not handled by ItemNavigation
			// go one or 10 years back
			var oFocusedDate = new UniversalDate(this._getDate().getTime());
			var iYear = oFocusedDate.getUTCFullYear();

			if (oEvent.metaKey || oEvent.ctrlKey) {
				oFocusedDate.setUTCFullYear(iYear - 10);
			} else {
				var iMonths = this.getMonths();
				if (iMonths <= 12) {
					oFocusedDate.setUTCFullYear(iYear - 1);
				} else {
					oFocusedDate.setUTCMonths(oFocusedDate.getUTCMonth() - iMonths);
				}
			}

			this.fireFocus({date: CalendarUtils._createLocalDate(oFocusedDate), notVisible: true});

			// cancel the event otherwise the browser select some text
			oEvent.preventDefault();

		};

		MonthsRow.prototype.onsappagedownmodifiers = function(oEvent){

			// not handled by ItemNavigation
			// go one or 10 years forward
			var oFocusedDate = new UniversalDate(this._getDate().getTime());
			var iYear = oFocusedDate.getUTCFullYear();

			if (oEvent.metaKey || oEvent.ctrlKey) {
				oFocusedDate.setUTCFullYear(iYear + 10);
			} else {
				var iMonths = this.getMonths();
				if (iMonths <= 12) {
					oFocusedDate.setUTCFullYear(iYear + 1);
				} else {
					oFocusedDate.setUTCMonths(oFocusedDate.getUTCMonth() + iMonths);
				}
			}

			this.fireFocus({date: CalendarUtils._createLocalDate(oFocusedDate), notVisible: true});

			// cancel the event otherwise the browser select some text
			oEvent.preventDefault();

		};

		MonthsRow.prototype.onThemeChanged = function(){

			if (this._bNoThemeChange) {
				// already called from Calendar
				return;
			}

			this._bNamesLengthChecked = undefined;
			this._bLongWeekDays = undefined;
			var oLocaleData = this._getLocaleData();
			var aMonthNamesWide = oLocaleData.getMonthsStandAlone("wide");
			var aMonths = this.$("months").children();
			var iMonth = this._getStartDate().getUTCMonth();
			for (var i = 0; i < aMonths.length; i++) {
				var $Month = jQuery(jQuery(aMonths[i]).children(".sapUiCalItemText"));
				$Month.text(aMonthNamesWide[(i + iMonth) % 12]);
			}

			_checkNamesLength.call(this);

		};

		/**
		 * Checks if a date is focusable in the current rendered output.
		 * This means that if it is not rendered, it is not focusable.
		 *
		 * @param {object} oDate JavaScript Date object for focused date.
		 * @returns {boolean} flag if focusable
		 * @public
		 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
		 */
		MonthsRow.prototype.checkDateFocusable = function(oDate){

			if (!(oDate instanceof Date)) {
				throw new Error("Date must be a JavaScript date object; " + this);
			}

			if (this._bNoRangeCheck) {
				// to force to render months if start date is changed
				return false;
			}

			var oStartDate = this._getStartDate();

			// set end date to begin of first month outside row
			var oEndDate = new UniversalDate(oStartDate.getTime());
			oEndDate.setUTCDate(1);
			oEndDate.setUTCMonth(oEndDate.getUTCMonth() + this.getMonths());
			var oUTCDate = CalendarUtils._createUniversalUTCDate(oDate);

			if (oUTCDate.getTime() >= oStartDate.getTime() && oUTCDate.getTime() < oEndDate.getTime()) {
				return true;
			}else {
				return false;
			}

		};

		function _initItemNavigation(){

			var oDate = this._getDate();
			var sYyyymm = this._oFormatYyyymm.format(oDate, true);
			var iIndex = 0;

			var oRootDomRef = this.$("months").get(0);
			var aDomRefs = this.$("months").children(".sapUiCalItem");

			for ( var i = 0; i < aDomRefs.length; i++) {
				var $DomRef = jQuery(aDomRefs[i]);
				if ($DomRef.attr("data-sap-month") === sYyyymm) {
					iIndex = i;
					break;
				}
			}

			if (!this._oItemNavigation) {
				this._oItemNavigation = new ItemNavigation();
				this._oItemNavigation.attachEvent(ItemNavigation.Events.AfterFocus, _handleAfterFocus, this);
				this._oItemNavigation.attachEvent(ItemNavigation.Events.FocusAgain, _handleFocusAgain, this);
				this._oItemNavigation.attachEvent(ItemNavigation.Events.BorderReached, _handleBorderReached, this);
				this.addDelegate(this._oItemNavigation);
				this._oItemNavigation.setDisabledModifiers({
					sapnext : ["alt"],
					sapprevious : ["alt"],
					saphome : ["alt"],
					sapend : ["alt"]
				});
				this._oItemNavigation.setCycling(false);
				this._oItemNavigation.setColumns(1, true);
			}
			this._oItemNavigation.setRootDomRef(oRootDomRef);
			this._oItemNavigation.setItemDomRefs(aDomRefs);
			this._oItemNavigation.setFocusedIndex(iIndex);
			this._oItemNavigation.setPageSize(aDomRefs.length); // to make sure that pageup/down goes out of month

		}

		function _handleAfterFocus(oControlEvent){

			var iIndex = oControlEvent.getParameter("index");
			var oEvent = oControlEvent.getParameter("event");

			if (!oEvent) {
				return; // happens if focus is set via ItemNavigation.focusItem directly
			}

			var oOldDate = this._getDate();
			var oFocusedDate = new UniversalDate(oOldDate.getTime());
			var aDomRefs = this._oItemNavigation.getItemDomRefs();

			// find out what day was focused
			var $DomRef = jQuery(aDomRefs[iIndex]);

			oFocusedDate = new UniversalDate(this._oFormatYyyymm.parse($DomRef.attr("data-sap-month"), true).getTime());
			this._setDate(oFocusedDate);

			this.fireFocus({date: CalendarUtils._createLocalDate(oFocusedDate), notVisible: false});

			if (oEvent.type == "mousedown") {
				// as no click event is fired in some cases, e.g. if DOM changed select the month on mousedown
				_handleMousedown.call(this, oEvent, oFocusedDate, iIndex);
			}

		}

		function _handleFocusAgain(oControlEvent){

			var iIndex = oControlEvent.getParameter("index");
			var oEvent = oControlEvent.getParameter("event");

			if (!oEvent) {
				return; // happens if focus is set via ItemNavigation.focusItem directly
			}

			if (oEvent.type == "mousedown") {
				// as no click event is fired in some cases, e.g. if DOM has changed select the day on mousedown
				var oFocusedDate = this._getDate();
				_handleMousedown.call(this, oEvent, oFocusedDate, iIndex);
			}

		}

		function _handleBorderReached(oControlEvent){

			var oEvent = oControlEvent.getParameter("event");
			var iMonths = this.getMonths();
			var oOldDate = this._getDate();
			var oFocusedDate = new UniversalDate(oOldDate.getTime());

			if (oEvent.type) {
				switch (oEvent.type) {
				case "sapnext":
				case "sapnextmodifiers":
					//go to next month
					oFocusedDate.setUTCMonth(oFocusedDate.getUTCMonth() + 1);
					break;

				case "sapprevious":
				case "sappreviousmodifiers":
					//go to previous month
					oFocusedDate.setUTCMonth(oFocusedDate.getUTCMonth() - 1);
					break;

				case "sappagedown":
					// go getMonths() month forward
					oFocusedDate.setUTCMonth(oFocusedDate.getUTCMonth() + iMonths);
					break;

				case "sappageup":
					// go getMonths() months backwards
					oFocusedDate.setUTCMonth(oFocusedDate.getUTCMonth() - iMonths);
					break;

				default:
					break;
				}

				this.fireFocus({date: CalendarUtils._createLocalDate(oFocusedDate), notVisible: true});

			}

		}

		function _handleMousedown(oEvent, oFocusedDate, iIndex){

			if (oEvent.button) {
				// only use left mouse button
				return;
			}

			_selectMonth.call(this, oFocusedDate);
			this._bMousedownChange = true;

			if (this._bMouseMove) {
				// a mouseup must be happened outside of control -> just end move
				_unbindMousemove.call(this, true);
				this._bMoveChange = false;
			}else if (this.getIntervalSelection() && this.$().is(":visible")) {
				// if closed in select event, do not add mousemove handler
				_bindMousemove.call(this, true);
			}

			oEvent.preventDefault();
			oEvent.setMark("cancelAutoClose");

		}

		function _changeDate(oDate, bNoFocus){

			if (!(oDate instanceof Date)) {
				throw new Error("Date must be a JavaScript date object; " + this);
			}

			var iYear = oDate.getFullYear();
			if (iYear < 1 || iYear > 9999) {
				throw new Error("Date must not be in valid range (between 0001-01-01 and 9999-12-31); " + this);
			}

			var bFocusable = true; // if date not changed it is still focusable
			if (!jQuery.sap.equal(this.getDate(), oDate)) {
				var oUTCDate = CalendarUtils._createUniversalUTCDate(oDate);
				oUTCDate.setUTCDate(1); // always use begin of month
				bFocusable = this.checkDateFocusable(oDate);

				if (!this._bNoRangeCheck && !bFocusable) {
					throw new Error("Date must be in visible date range; " + this);
				}

				this.setProperty("date", oDate, true);
				this._oUTCDate = oUTCDate;
			}

			if (this.getDomRef()) {
				if (bFocusable) {
					if (!bNoFocus) {
					_focusDate.call(this, this._oUTCDate);
					}
				} else {
					_renderRow.call(this, bNoFocus);
				}
			}

		}

		function _focusDate(oDate){

			var sYyyymm = this._oFormatYyyymm.format(oDate, true);
			var aDomRefs = this._oItemNavigation.getItemDomRefs();
			var $DomRefDay;
			for ( var i = 0; i < aDomRefs.length; i++) {
				$DomRefDay = jQuery(aDomRefs[i]);
				if ($DomRefDay.attr("data-sap-month") == sYyyymm) {
					if (document.activeElement != aDomRefs[i]) {
						this._oItemNavigation.focusItem(i);
					}
					break;
				}
			}

		}

		function _renderRow(bNoFocus){

			var oDate = this._getStartDate();
			var $Container = this.$("months");

			if ($Container.length > 0) {
				var oRm = sap.ui.getCore().createRenderManager();
				this.getRenderer().renderMonths(oRm, this, oDate);
				oRm.flush($Container[0]);
				oRm.destroy();
			}

			_renderHeader.call(this);

			_initItemNavigation.call(this);
			if (!bNoFocus) {
				this._oItemNavigation.focusItem(this._oItemNavigation.getFocusedIndex());
			}

		}

		function _renderHeader(){

			var oStartDate = this._getStartDate();

			if (this._getShowHeader()) {
				var $Container = this.$("Head");

				if ($Container.length > 0) {
					var oLocaleData = this._getLocaleData();
					var oRm = sap.ui.getCore().createRenderManager();
					this.getRenderer().renderHeaderLine(oRm, this, oLocaleData, oStartDate);
					oRm.flush($Container[0]);
					oRm.destroy();
				}
			}

		}

		function _selectMonth(oDate, bMove){

			var aSelectedDates = this.getSelectedDates();
			var oDateRange;
			var aDomRefs = this._oItemNavigation.getItemDomRefs();
			var $DomRef;
			var sYyyymm;
			var i = 0;
			var oParent = this.getParent();
			var oAggOwner = this;
			var oStartDate;

			if (oParent && oParent.getSelectedDates) {
				// if used in Calendar use the aggregation of this one
				oAggOwner = oParent;
			}

			/* eslint-disable no-lonely-if */
			if (this.getSingleSelection()) {

				if (aSelectedDates.length > 0) {
					oDateRange = aSelectedDates[0];
					oStartDate = oDateRange.getStartDate();
					if (oStartDate) {
						oStartDate = CalendarUtils._createUniversalUTCDate(oStartDate);
						oStartDate.setUTCDate(1); // begin of month
					}
				} else {
					oDateRange = new sap.ui.unified.DateRange();
					oAggOwner.addAggregation("selectedDates", oDateRange, true); // no re-rendering
				}

				if (this.getIntervalSelection() && (!oDateRange.getEndDate() || bMove) && oStartDate) {
					// single interval selection
					var oEndDate;
					if (oDate.getTime() < oStartDate.getTime()) {
						oEndDate = oStartDate;
						oStartDate = oDate;
						if (!bMove) {
							// in move mode do not set date. this bring broblems if on backward move the start date would be changed
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
					_updateSelection.call(this, oStartDate, oEndDate);
				} else {
					// single day selection or start a new interval
					_updateSelection.call(this, oDate);

					oDateRange.setProperty("startDate", CalendarUtils._createLocalDate(new Date(oDate.getTime())), true); // no-rerendering
					oDateRange.setProperty("endDate", undefined, true); // no-rerendering
				}
			} else {
				// multiple selection
				if (this.getIntervalSelection()) {
					throw new Error("Calender don't support multiple interval selection");

				} else {
					var iSelected = this._checkDateSelected(oDate);
					if (iSelected > 0) {
						// already selected - deselect
						for ( i = 0; i < aSelectedDates.length; i++) {
							oStartDate = aSelectedDates[i].getStartDate();
							if (oStartDate) {
								oStartDate = CalendarUtils._createUniversalUTCDate(oStartDate);
								oStartDate.setUTCDate(1); // begin of month
								if (oDate.getTime() == oStartDate.getTime()) {
									oAggOwner.removeAggregation("selectedDates", i, true); // no re-rendering
									break;
								}
							}
						}
					} else {
						// not selected -> select
						oDateRange = new sap.ui.unified.DateRange({startDate: CalendarUtils._createLocalDate(new Date(oDate.getTime()))});
						oAggOwner.addAggregation("selectedDates", oDateRange, true); // no re-rendering
					}
					sYyyymm = this._oFormatYyyymm.format(oDate, true);
					for ( i = 0; i < aDomRefs.length; i++) {
						$DomRef = jQuery(aDomRefs[i]);
						if ($DomRef.attr("data-sap-month") == sYyyymm) {
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

		function _updateSelection(oStartDate, oEndDate){

			var aDomRefs = this._oItemNavigation.getItemDomRefs();
			var $DomRef;
			var i = 0;
			var bStart = false;
			var bEnd = false;

			if (!oEndDate) {
				// start of interval or single date
				var sYyyymm = this._oFormatYyyymm.format(oStartDate, true);
				for ( i = 0; i < aDomRefs.length; i++) {
					$DomRef = jQuery(aDomRefs[i]);
					bStart = false;
					bEnd = false;
					if ($DomRef.attr("data-sap-month") == sYyyymm) {
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
					_updateARIADesrcibedby.call(this, $DomRef, bStart, bEnd);
				}
			} else {
				var oDay;
				for ( i = 0; i < aDomRefs.length; i++) {
					$DomRef = jQuery(aDomRefs[i]);
					bStart = false;
					bEnd = false;
					oDay = new UniversalDate(this._oFormatYyyymm.parse($DomRef.attr("data-sap-month"), true).getTime());
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
					_updateARIADesrcibedby.call(this, $DomRef, bStart, bEnd);
				}
			}

		}

		function _updateARIADesrcibedby($DomRef, bStart, bEnd){

			if (!this.getIntervalSelection()) {
				return;
			}

			var sDescribedBy = "";
			var aDescribedBy = [];
			var sId = this.getId();
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

		function _fireSelect(){

			if (this._bMouseMove) {
				// detach mouse move handler because calendar might be losed in select event handler
				_unbindMousemove.call(this, true);
			}

			this.fireSelect();

		}

		function _checkNamesLength(){

			if (!this._bNamesLengthChecked) {
				var i = 0;
				// only once - cannot change by rerendering - only by theme change
				var aMonths = this.$("months").children();
				var bTooLong = false;
				var iMonths = this.getMonths();
				var iBlocks = Math.ceil(12 / iMonths);
				var iMonth = 0;
				var oLocaleData = this._getLocaleData();
				var aMonthNamesWide = oLocaleData.getMonthsStandAlone("wide");
				var $Month;

				for (var b = 0; b < iBlocks; b++) {
					if (iMonths < 12) {
						for (i = 0; i < aMonths.length; i++) {
							$Month = jQuery(jQuery(aMonths[i]).children(".sapUiCalItemText"));
							$Month.text(aMonthNamesWide[(i + iMonth) % 12]);
						}
						iMonth = iMonth + iMonths;
						if (iMonth > 11) {
							iMonth = 11;
						}
					}

					for (i = 0; i < aMonths.length; i++) {
						var oMonth = aMonths[i];
						if (Math.abs(oMonth.clientWidth - oMonth.scrollWidth) > 1) {
							bTooLong = true;
							break;
						}
					}

					if (bTooLong) {
						break;
					}
				}

				if (iMonths < 12) {
					// restore rendered block
					iMonth = this._getStartDate().getUTCMonth();
					for (i = 0; i < aMonths.length; i++) {
						$Month = jQuery(jQuery(aMonths[i]).children(".sapUiCalItemText"));
						$Month.text(aMonthNamesWide[(i + iMonth) % 12]);
					}
				}

				if (bTooLong) {
					this._bLongMonth = false;
					// change month name on button but not change month picker, because it is hided again
					var aMonthNames = oLocaleData.getMonthsStandAlone("abbreviated");
					iMonth = this._getStartDate().getUTCMonth();
					for (i = 0; i < aMonths.length; i++) {
						$Month = jQuery(jQuery(aMonths[i]).children(".sapUiCalItemText"));
						$Month.text(aMonthNames[(i + iMonth) % 12]);
					}
				} else {
					this._bLongMonth = true;
				}

				this._bNamesLengthChecked = true;
			}
		}

		function _invalidateMonths(){

			this._sInvalidateMonths = undefined;

			_renderRow.call(this, this._bNoFocus);
			this._bDateRangeChanged = undefined;
			this._bNoFocus = undefined; // set in Calendar to prevent focus flickering for multiple months

		}

		function _bindMousemove(){

			jQuery(window.document).bind('mousemove', this._mouseMoveProxy);
			this._bMouseMove = true;

		}

		function _unbindMousemove(){

			jQuery(window.document).unbind('mousemove', this._mouseMoveProxy);
			this._bMouseMove = undefined;

		}

	}());

	return MonthsRow;

}, /* bExport= */ true);
