/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.m.DatePicker.
sap.ui.define(['jquery.sap.global', './InputBase', 'sap/ui/model/type/Date', 'sap/ui/core/date/UniversalDate', './library'],
	function(jQuery, InputBase, Date1, UniversalDate, library) {
	"use strict";


	/**
	 * Constructor for a new DatePicker.
	 *
	 * @param {string} [sId] Id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * This is a date input control with a calendar as date picker.
	 *
	 * A date can be entered using a calendar that opens in a popup. Alternatively a value can be entered directly in the input field by typing it in.
	 * (This is only possible on desktop devices, on mobile devices keyboard input is not possible.)
	 * If a date is entered by typing it into the input field, it must fit to the used date format and locale. (See <code>sap.ui.core.format.DateFormat</code>)
	 *
	 * There are two options to provide a date for the <code>DatePicker</code>.
	 * You can put a date as a string to the property <code>value</code> or you can put a JavaScript Date object to the property <code>dateValue</code>.
	 * Only one of the properties should be used at one time, but they are synchronized internally.
	 * What property you should use depends on the use case of the application:
	 * <ul>
	 * <li>Use the <code>value</code> property if you want to bind the <code>DatePicker</code> to a model using the <code>sap.ui.model.type.Date</code>.</li>
	 * <li>Use the <code>value</code> property if the date is provided as a string from the backend or inside the application (e.g. as ABAP type DATS field).</li>
	 * <li>Use the <code>dateValue</code> property if the date is already provided as a JavaScript Date object or you want to work with a JavaScript Date object.</li>
	 * </ul>
	 *
	 * All formatting and parsing of dates from and to strings is done using the {@link sap.ui.core.format.DateFormat}, so read the corresponding documentation if you need some information about this.
	 *
	 * Supported format options are pattern-based on Unicode LDML Date Format notation. {@link http://unicode.org/reports/tr35/#Date_Field_Symbol_Table}
	 *
	 * For example, if the <code>valueFormat</code> is "yyyy-MM-dd", <code>displayFormat</code> is "MMM d, y" and the used locale is English,
	 * a valid <code>value</code> string is "2015-07-30", which leads to an output of "Jul 30, 2015".
	 *
	 * If no <code>placeholder</code> is set to the <code>DatePicker</code> the used <code>displayFormat</code> is shown as placeholder.
	 * If another placeholder is needed, it must be set.
	 *
	 * Internally the <code>sap.ui.unified.Calendar</code> is used, but it is only needed if the <code>DatePicker</code> is opened. This means that it is not needed for the initial rendering.
	 * If the <code>sap.ui.unified</code> library is not loaded before the <code>DatePicker</code> is opened, it will be loaded upon opening.
	 * This could lead to a waiting time before a <code>DatePicker</code> is opened the first time. To prevent this, applications using the <code>DatePicker</code> should also load
	 * the <code>sap.ui.unified</code> library.
	 * @extends sap.m.InputBase
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @since 1.22.0
	 * @alias sap.m.DatePicker
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var DatePicker = InputBase.extend("sap.m.DatePicker", /** @lends sap.m.DatePicker.prototype */ { metadata : {

		library : "sap.m",
		properties : {

			/**
			 * The date is displayed in the input field using this format. By default, the medium format of the used locale is used.
			 *
			 * Supported format options are pattern-based on Unicode LDML Date Format notation. {@link http://unicode.org/reports/tr35/#Date_Field_Symbol_Table}
			 * <b>Note:</b> If you use data binding on the <code>value</code> property with type <code>sap.ui.model.type.Date</code> this property will be ignored.
			 * The format defined in the binding will be used.
			 */
			displayFormat : {type : "string", group : "Appearance", defaultValue : null},

			/**
			 * The date string expected and returned in the <code>value</code> property uses this format. By default the short format of the used locale is used.
			 *
			 *
			 * Supported format options are pattern-based on Unicode LDML Date Format notation. {@link http://unicode.org/reports/tr35/#Date_Field_Symbol_Table}
			 *
			 * For example, if the date string represents an ABAP DATS type, the format should be "yyyyMMdd".
			 *
			 * <b>Note:</b> If data binding on <code>value</code> property with type <code>sap.ui.model.type.Date</code> is used, this property will be ignored.
			 * The format defined in the binding will be used.
			 */
			valueFormat : {type : "string", group : "Data", defaultValue : null},

			/**
			 * The date as JavaScript Date object. This is independent from any formatter.
			 *
			 * <b>Note:</b> If this property is used, the <code>value</code> property should not be changed from the caller.
			 */
			dateValue : {type : "object", group : "Data", defaultValue : null},

			/**
			 * Displays date in this given type in input field. Default value is taken from locale settings.
			 * Accepted are values of <code>sap.ui.core.CalendarType</code> or an empty string. If no type is set, the default type of the
			 * configuration is used.
			 * <b>Note:</b> If data binding on <code>value</code> property with type <code>sap.ui.model.type.Date</code> is used, this property will be ignored.
			 * @since 1.28.6
			 */
			displayFormatType : {type : "string", group : "Appearance", defaultValue : ""}
		}
	}});


	(function() {

		DatePicker.prototype.init = function() {

			InputBase.prototype.init.apply(this, arguments);

			this._bIntervalSelection = false;

			this._bValid = true;

			// use UniversalDate because this is calendar dependent.
			// But timestamp comparison with JS-Date later should work fine
			this._oMinDate = new UniversalDate(1, 0, 1);
			this._oMinDate.setFullYear(1); // otherwise year 1 will be converted to year 1901
			this._oMaxDate = new UniversalDate(9999, 11, 31);

			this._bMobile = !sap.ui.Device.system.desktop;

		};

		DatePicker.prototype.exit = function() {

			InputBase.prototype.exit.apply(this, arguments);

			if (this._oPopup) {
				if (this._oPopup.isOpen()) {
					this._oPopup.close();
				}
				delete this._oPopup;
			}

			if (this._oCalendar) {
				this._oCalendar.destroy();
				delete this._oCalendar;
			}

			this._sUsedDisplayPattern = undefined;
			this._sUsedDisplayCalendarType = undefined;
			this._oDisplayFormat = undefined;
			this._sUsedValuePattern = undefined;
			this._sUsedValueCalendarType = undefined;
			this._oValueFormat = undefined;

		};

		DatePicker.prototype.invalidate = function(oOrigin) {

			if (!oOrigin || oOrigin != this._oCalendar) {
				// Calendar is only invalidated by DatePicker itself -> so don't invalidate DatePicker
				sap.ui.core.Control.prototype.invalidate.apply(this, arguments);
			}

		};

		/**
		 * Defines the width of the DatePicker. Default value is 100%
		 *
		 * @param {string} sWidth  new value for <code>width</code>
		 * @returns {sap.m.DatePicker} <code>this</code> to allow method chaining
		 * @public
		 */
		DatePicker.prototype.setWidth = function(sWidth) {

			return InputBase.prototype.setWidth.call(this, sWidth || "100%");

		};

		DatePicker.prototype.getWidth = function(sWidth) {

			return this.getProperty("width") || "100%";

		};

		DatePicker.prototype.applyFocusInfo = function(oFocusInfo) {

			this._bFocusNoPopup = true;
			InputBase.prototype.applyFocusInfo.apply(this, arguments);

		};

		DatePicker.prototype.onfocusin = function(oEvent) {

			if (!jQuery(oEvent.target).hasClass("sapUiIcon")) {
				InputBase.prototype.onfocusin.apply(this, arguments);
			}

			this._bFocusNoPopup = undefined;

		};

		DatePicker.prototype.oninput = function(oEvent) {
			InputBase.prototype.oninput.call(this, oEvent);
			if (oEvent.isMarked("invalid")) {
				return;
			}

			// do not use sap.m.InputBase.prototype._setLabelVisibility because value is not updated during typing
			if (this.getDomRef() && this._$label) {
				var sValue = this._$input.val();
				this._$label.css("display", sValue ? "none" : "inline");
			}
		};

		DatePicker.prototype.onsapshow = function(oEvent) {

			_toggleOpen.call(this);

			oEvent.preventDefault(); // otherwise IE opens the address bar history

		};

		// ALT-UP and ALT-DOWN should behave the same
		DatePicker.prototype.onsaphide = DatePicker.prototype.onsapshow;

		DatePicker.prototype.onsappageup = function(oEvent){

			//increase by one day
			_increaseDate.call(this, 1, "day");

			oEvent.preventDefault(); // do not move cursor

		};

		DatePicker.prototype.onsappageupmodifiers = function(oEvent){

			if (!oEvent.ctrlKey && oEvent.shiftKey) {
				// increase by one month
				_increaseDate.call(this, 1, "month");
			} else {
				// increase by one year
				_increaseDate.call(this, 1, "year");
			}

			oEvent.preventDefault(); // do not move cursor

		};

		DatePicker.prototype.onsappagedown = function(oEvent){

			//decrease by one day
			_increaseDate.call(this, -1, "day");

			oEvent.preventDefault(); // do not move cursor

		};

		DatePicker.prototype.onsappagedownmodifiers = function(oEvent){

			if (!oEvent.ctrlKey && oEvent.shiftKey) {
				// decrease by one month
				_increaseDate.call(this, -1, "month");
			} else {
				// decrease by one year
				_increaseDate.call(this, -1, "year");
			}

			oEvent.preventDefault(); // do not move cursor

		};

		DatePicker.prototype.onkeypress = function(oEvent){

			// the keypress event should be fired only when a character key is pressed,
			// unfortunately some browsers fire the keypress event for control keys as well.
			if (!oEvent.charCode || oEvent.metaKey || oEvent.ctrlKey) {
				return;
			}

			var oFormatter = _getFormatter.call(this, true);
			var sChar = String.fromCharCode(oEvent.charCode);

			if (sChar && oFormatter.sAllowedCharacters && oFormatter.sAllowedCharacters.indexOf(sChar) < 0) {
				oEvent.preventDefault();
			}
		};

		DatePicker.prototype.onclick = function(oEvent) {

			if (jQuery(oEvent.target).hasClass("sapUiIcon")) {
				_toggleOpen.call(this);
			} else if (this._bMobile && (!this._oPopup || !this._oPopup.isOpen()) &&
					this.getEditable() && this.getEnabled()) {
				_open.call(this);
			}

		};

		/**
		 * Getter for property <code>value</code>.
		 *
		 * Returns a date as a string in the format defined in property <code>valueFormat</code>.
		 *
		 * <b>Note:</b> The value is always expected and updated in Gregorian calendar format. (If data binding is used the format of the binding is used.)
		 *
		 * If this property is used, the <code>dateValue</code> property should not be changed from the caller.
		 *
		 * @returns {string} the value of property <code>value</code>
		 * @public
		 * @name sap.m.DateRangeSelection#getValue
		 * @function
		 */

		/**
		 * Setter for property <code>value</code>.
		 *
		 * Expects a date as a string in the format defined in property <code>valueFormat</code>.
		 *
		 * <b>Note:</b> The value is always expected and updated in Gregorian calendar format. (If data binding is used the format of the binding is used.)
		 *
		 * If this property is used, the <code>dateValue</code> property should not be changed from the caller.
		 *
		 * @param {string} sValue The new value of the input.
		 * @return {sap.m.DatePicker} <code>this</code> to allow method chaining
		 * @public
		 * @name sap.m.DateRangeSelection#setValue
		 * @function
		 */
		DatePicker.prototype.setValue = function(sValue) {

			sValue = this.validateProperty("value", sValue); // to convert null and undefined to ""

			var sOldValue = this.getValue();
			if (sValue == sOldValue) {
				return this;
			} else {
				this._lastValue = sValue;
			}

			// set the property in any case but check validity on output
			this.setProperty("value", sValue, true); // no rerendering
			this._bValid = true;

			// convert to date object
			var oDate;
			if (sValue) {
				oDate = this._parseValue(sValue);
				if (!oDate || oDate.getTime() < this._oMinDate.getTime() || oDate.getTime() > this._oMaxDate.getTime()) {
					this._bValid = false;
					jQuery.sap.log.warning("Value can not be converted to a valid date", this);
				}
			}
			if (this._bValid) {
				this.setProperty("dateValue", oDate, true); // no rerendering
			}

			// do not call InputBase.setValue because the displayed value and the output value might have different pattern
			if (this.getDomRef()) {
				// convert to output
				var sOutputValue;
				if (oDate) {
					sOutputValue = this._formatValue(oDate);
				} else {
					sOutputValue = sValue;
				}

				if (this._$input.val() !== sOutputValue) {
					this._$input.val(sOutputValue);
					this._setLabelVisibility();
					this._curpos = this._$input.cursorPos();
				}
			}

			return this;

		};

		DatePicker.prototype.setDateValue = function(oDate) {

			if (jQuery.sap.equal(this.getDateValue(), oDate)) {
				return this;
			}

			if (oDate && !(oDate instanceof Date)) {
				throw new Error("Date must be a JavaScript date object; " + this);
			}

			if (oDate && (oDate.getTime() < this._oMinDate.getTime() || oDate.getTime() > this._oMaxDate.getTime())) {
				this._bValid = false;
				jQuery.sap.assert(this._bValid, "Date must be in valid range");
			}else {
				this._bValid = true;
				this.setProperty("dateValue", oDate, true); // no rerendering
			}

			// convert date object to value
			var sValue = this._formatValue(oDate, true);

			if (sValue !== this.getValue()) {
				this._lastValue = sValue;
			}
			// set the property in any case but check validity on output
			this.setProperty("value", sValue, true); // no rerendering

			if (this.getDomRef()) {
				// convert to output
				var sOutputValue = this._formatValue(oDate);

				if (this._$input.val() !== sOutputValue) {
					this._$input.val(sOutputValue);
					this._setLabelVisibility();
					this._curpos = this._$input.cursorPos();
				}
			}

			return this;

		};

		DatePicker.prototype.setValueFormat = function(sValueFormat) {

			// if valueFormat changes the value must be parsed again

			this.setProperty("valueFormat", sValueFormat, true); // no rerendering
			var sValue = this.getValue();

			if (sValue) {
				var oDate = this._parseValue(sValue);
				if (!oDate || oDate.getTime() < this._oMinDate.getTime() || oDate.getTime() > this._oMaxDate.getTime()) {
					this._bValid = false;
					jQuery.sap.log.warning("Value can not be converted to a valid date", this);
				}else {
					this._bValid = true;
					this.setProperty("dateValue", oDate, true); // no rerendering
				}
			}

			return this;

		};

		DatePicker.prototype.setDisplayFormat = function(sDisplayFormat) {

			// if displayFormat changes the value must be formatted again

			this.setProperty("displayFormat", sDisplayFormat, true); // no rerendering
			var sOutputValue = this._formatValue(this.getDateValue());

			if (this.getDomRef() && (this._$input.val() !== sOutputValue)) {
				this._$input.val(sOutputValue);
				this._curpos = this._$input.cursorPos();
			}

			return this;

		};

		DatePicker.prototype.setDisplayFormatType = function(sDisplayFormatType) {

			if (sDisplayFormatType) {
				var bFound = false;
				for ( var sType in sap.ui.core.CalendarType) {
					if (sType == sDisplayFormatType) {
						bFound = true;
						break;
					}
				}
				if (!bFound) {
					throw new Error(sDisplayFormatType + " is not a valid calendar type" + this);
				}
			}

			this.setProperty("displayFormatType", sDisplayFormatType, true); // no rerendering

			// reuse update from format function
			this.setDisplayFormat(this.getDisplayFormat());

			return this;

		};

		DatePicker.prototype.onChange = function(oEvent) {
			// don't call InputBase onChange because this calls setValue what would trigger a new formatting

			// check the control is editable or not
			if (!this.getEditable() || !this.getEnabled()) {
				return;
			}

			// set date before fire change event
			var sValue = this._$input.val();
			var sOldValue = this._formatValue(this.getDateValue());

			if (sValue == sOldValue && this._bValid) {
				// only needed if value really changed
				return;
			}

			var oDate;
			this._bValid = true;
			if (sValue != "") {
				oDate = this._parseValue(sValue, true);
				if (!oDate || oDate.getTime() < this._oMinDate.getTime() || oDate.getTime() > this._oMaxDate.getTime()) {
					this._bValid = false;
					oDate = undefined;
				}else {
					// check if Formatter changed the value (it correct some wrong inputs or known patterns)
					sValue = this._formatValue(oDate);
				}
			}

			if (this.getDomRef() && (this._$input.val() !== sValue)) {
				this._$input.val(sValue);
				this._curpos = this._$input.cursorPos();
				if (this._$label) {
					// because value property might not be updated between typing
					this._$label.css("display", sValue ? "none" : "inline");
				}
			}

			if (oDate) {
				// get the value in valueFormat
				sValue = this._formatValue(oDate, true);
			}

			// compare with the old known value
			if (sValue !== this._lastValue) {
				this.setProperty("value", sValue, true); // no rerendering
				if (this._bValid) {
					this.setProperty("dateValue", oDate, true); // no rerendering
				}

				// remember the last value on change
				this._lastValue = sValue;

				this.fireChangeEvent(sValue, {valid: this._bValid});

				if (this._oPopup && this._oPopup.isOpen()) {
					this._oCalendar.focusDate(oDate);
					var oStartDate = this._oDateRange.getStartDate();
					if ((!oStartDate && oDate) || (oStartDate && oDate && oStartDate.getTime() != oDate.getTime())) {
						this._oDateRange.setStartDate(new Date(oDate));
					} else if (oStartDate && !oDate) {
						this._oDateRange.setStartDate(undefined);
					}
				}
			}

		};

		// overwrite _getInputValue to do the conversion there
		DatePicker.prototype._getInputValue = function(sValue) {

			sValue = (typeof sValue == "undefined") ? this._$input.val() : sValue.toString();

			var oDate = this._parseValue(sValue, true);
			sValue = this._formatValue(oDate, true);

			return sValue;

		};

		// overwrite _getInputValue to do the output conversion
		DatePicker.prototype.updateDomValue = function(sValue) {

			// dom value updated other than value property
			this._bCheckDomValue = true;

			sValue = (typeof sValue == "undefined") ? this._$input.val() : sValue.toString();
			this._curpos = this._$input.cursorPos();

			var oDate = this._parseValue(sValue, true);
			sValue = this._formatValue(oDate);

			// update the DOM value when necessary
			// otherwise cursor can goto end of text unnecessarily
			if (this.isActive() && (this._$input.val() !== sValue)) {
				this._$input.val(sValue);
				this._$input.cursorPos(this._curpos);
			}

			// update synthetic placeholder visibility
			this._setLabelVisibility();

			return this;
		};

		DatePicker.prototype._parseValue = function(sValue, bDisplayFormat) {

			var oFormat = _getFormatter.call(this, bDisplayFormat);

			// convert to date object
			var oDate = oFormat.parse(sValue);
			return oDate;

		};

		// converts the date to the output format, but if bValueFormat set it converts it to the input format
		DatePicker.prototype._formatValue = function(oDate, bValueFormat) {

			var sValue = "";

			if (oDate) {
				var oFormat = _getFormatter.call(this, !bValueFormat);
				// convert to date object
				sValue = oFormat.format(oDate);
			}

			return sValue;

		};

		DatePicker.prototype._getPlaceholder = function() {

			var sPlaceholder = this.getPlaceholder();

			if (!sPlaceholder) {
				var oBinding = this.getBinding("value");

				if (oBinding && oBinding.oType && (oBinding.oType instanceof Date1)) {
					sPlaceholder = oBinding.oType.getOutputPattern();
				} else {
					sPlaceholder = this.getDisplayFormat();
				}

				if (!sPlaceholder) {
					sPlaceholder = "medium";
				}

				if (sPlaceholder == "short" || sPlaceholder == "medium" || sPlaceholder == "long") {
					var oLocale = sap.ui.getCore().getConfiguration().getFormatSettings().getFormatLocale();
					var oLocaleData = sap.ui.core.LocaleData.getInstance(oLocale);
					sPlaceholder = oLocaleData.getDatePattern(sPlaceholder);
				}
			}

			return sPlaceholder;

		};

		function _open(){

			if (!this._oPopup) {
				jQuery.sap.require("sap.ui.core.Popup");
				this._oPopup = new sap.ui.core.Popup();
				this._oPopup.setAutoClose(true);
				this._oPopup.setDurations(0, 0); // no animations
				this._oPopup.attachOpened(_handleOpened, this);
				//			this._oPopup.attachClosed(_handleClosed, this);
			}

			if (!this._oCalendar) {
				sap.ui.getCore().loadLibrary("sap.ui.unified");
				jQuery.sap.require("sap.ui.unified.library");
				this._oCalendar = new sap.ui.unified.Calendar(this.getId() + "-cal", {intervalSelection: this._bIntervalSelection});
				this._oDateRange = new sap.ui.unified.DateRange();
				this._oCalendar.addSelectedDate(this._oDateRange);
				this._oCalendar.attachSelect(this._selectDate, this);
				this._oCalendar.attachCancel(_cancel, this);
				this._oCalendar.attachEvent("_renderMonth", _resizeCalendar, this);
				this._oPopup.setContent(this._oCalendar);
				if (this.$().closest(".sapUiSizeCompact").length > 0) {
					this._oCalendar.addStyleClass("sapUiSizeCompact");
				}
				this._oCalendar.setPopupMode(true);
				this._oCalendar.setParent(this, undefined, true); // don't invalidate DatePicker
			}

			var sValue = this._formatValue(this.getDateValue());
			if (sValue != this._$input.val()) {
				this.onChange(); // to check manually typed in text
			}

			this._fillDateRange();

			this._oPopup.setAutoCloseAreas([this.getDomRef()]);

			var eDock = sap.ui.core.Popup.Dock;
			var sAt;
			if (this.getTextAlign() == sap.ui.core.TextAlign.End) {
				sAt = eDock.EndBottom + "-4"; // as m.Input has some padding around
				this._oPopup.open(0, eDock.EndTop, sAt, this, null, "fit", true);
			}else {
				sAt = eDock.BeginBottom + "-4"; // as m.Input has some padding around
				this._oPopup.open(0, eDock.BeginTop, sAt, this, null, "fit", true);
			}

		}

		DatePicker.prototype._fillDateRange = function(){

			var oDate = this.getDateValue();

			if (oDate) {
				this._oCalendar.focusDate(new Date(oDate));
				if (!this._oDateRange.getStartDate() || this._oDateRange.getStartDate().getTime() != oDate.getTime()) {
					this._oDateRange.setStartDate(new Date(oDate.getTime()));
				}
			} else if (this._oDateRange.getStartDate()) {
				this._oDateRange.setStartDate(undefined);
			}

		};

		function _toggleOpen(){

			if (this.getEditable() && this.getEnabled()) {
				if (!this._oPopup || !this._oPopup.isOpen()) {
					_open.call(this);
				} else {
					_cancel.call(this);
				}
			}

		}

		DatePicker.prototype._selectDate = function(oEvent){

			var aSelectedDates = this._oCalendar.getSelectedDates();
			var oDateOld = this.getDateValue();
			var oDate;
			var sValue = "";

			if (aSelectedDates.length > 0) {
				oDate = aSelectedDates[0].getStartDate();
			}

			// do not use this.onChange() because output pattern will change date (e.g. only last 2 number of year -> 1966 -> 2066 )
			if (!jQuery.sap.equal(oDate, oDateOld)) {
				this.setDateValue(oDate);
				// compare Dates because value can be the same if only 2 digits for year 
				sValue = this.getValue();
				this.fireChangeEvent(sValue, {valid: true});
				if (this.getDomRef()) { // as control could be destroyed during update binding
					this._curpos = this._$input.val().length;
					this._$input.cursorPos(this._curpos);
				}
			}else if (!this._bValid){
				// wrong input before open calendar
				sValue = this._formatValue(oDate);
				if (sValue != this._$input.val()) {
					this._bValid = true;
					if (this.getDomRef()) { // as control could be destroyed during update binding
						this._$input.val(sValue);
					}
					this.fireChangeEvent(sValue, {valid: true});
				}
			}

			// close popup and focus input after change event to allow application to reset value state or similar things
			this._oPopup.close();
			this._bFocusNoPopup = true;
			this.focus();

		};

		function _cancel(oEvent) {

			if (this._oPopup && this._oPopup.isOpen()) {
				this._oPopup.close();
				this._bFocusNoPopup = true;
				this.focus();
			}

		}
	/*
		function _handleClosed(oEvent) {


		};
	*/
		function _increaseDate(iNumber, sUnit) {

			var oOldDate = this.getDateValue();
			var iCurpos = this._$input.cursorPos();

			if (oOldDate && this.getEditable() && this.getEnabled()) {
				// use UniversalDate to calculate new date based on used calendar
				var oDate = new UniversalDate(oOldDate.getTime());
				oOldDate = new UniversalDate(oOldDate.getTime());

				switch (sUnit) {
				case "day":
					oDate.setDate(oDate.getDate() + iNumber);
					break;
				case "month":
					oDate.setMonth(oDate.getMonth() + iNumber);
					var iMonth = (oOldDate.getMonth() + iNumber) % 12;
					if (iMonth < 0) {
						iMonth = 12 + iMonth;
					}
					while (oDate.getMonth() != iMonth) {
						// day don't exist in this month (e.g. 31th)
						oDate.setDate(oDate.getDate() - 1);
					}
					break;
				case "year":
					oDate.setFullYear(oDate.getFullYear() + iNumber);
					while (oDate.getMonth() != oOldDate.getMonth()) {
						// day don't exist in this month (February 29th)
						oDate.setDate(oDate.getDate() - 1);
					}
					break;

				default:
					break;
				}

				if (oDate.getTime() < this._oMinDate.getTime()) {
					oDate = new UniversalDate(this._oMinDate.getTime());
				}else if (oDate.getTime() > this._oMaxDate.getTime()){
					oDate = new UniversalDate(this._oMaxDate.getTime());
				}

				this.setDateValue(new Date(oDate.getTime()));

				this._curpos = iCurpos;
				this._$input.cursorPos(this._curpos);

				var sValue = this.getValue();
				this.fireChangeEvent(sValue, {valid: true});
			}

		}

		function _handleOpened(oEvent) {

			this._renderedDays = this._oCalendar.$("-Month0-days").find(".sapUiCalItem").length;

		}

		function _resizeCalendar(oEvent){

			var iDays = oEvent.getParameter("days");

			if (iDays > this._renderedDays) {
				// calendar gets larger, so it could move out of the page -> reposition
				this._renderedDays = iDays;
				this._oPopup._applyPosition(this._oPopup._oLastPosition);
			}

		}

		function _getFormatter(bDisplayFormat) {

			var sPattern = "";
			var bRelative = false; // if true strings like "Tomorrow" are parsed fine
			var oFormat;
			var oBinding = this.getBinding("value");
			var sCalendarType;

			if (oBinding && oBinding.oType && (oBinding.oType instanceof Date1)) {
				sPattern = oBinding.oType.getOutputPattern();
				bRelative = !!oBinding.oType.oOutputFormat.oFormatOptions.relative;
				sCalendarType = oBinding.oType.oOutputFormat.oFormatOptions.calendarType;
			}

			/* eslint-disable no-lonely-if */
			if (!sPattern) {
				// not databinding is used -> use given format
				if (bDisplayFormat) {
					sPattern = ( this.getDisplayFormat() || "medium" );
					sCalendarType = this.getDisplayFormatType();
				} else {
					sPattern = ( this.getValueFormat() || "short" );
					sCalendarType = sap.ui.core.CalendarType.Gregorian;
				}
			}

			if (!sCalendarType) {
				sCalendarType = sap.ui.getCore().getConfiguration().getCalendarType();
			}

			if (bDisplayFormat) {
				if (sPattern == this._sUsedDisplayPattern && sCalendarType == this._sUsedDisplayCalendarType) {
					oFormat = this._oDisplayFormat;
				}
			} else {
				if (sPattern == this._sUsedValuePattern && sCalendarType == this._sUsedValueCalendarType) {
					oFormat = this._oValueFormat;
				}
			}

			if (!oFormat) {
				if (sPattern == "short" || sPattern == "medium" || sPattern == "long") {
					oFormat = sap.ui.core.format.DateFormat.getInstance({style: sPattern, strictParsing: true, relative: bRelative, calendarType: sCalendarType});
				} else {
					oFormat = sap.ui.core.format.DateFormat.getInstance({pattern: sPattern, strictParsing: true, relative: bRelative, calendarType: sCalendarType});
				}
				if (bDisplayFormat) {
					this._sUsedDisplayPattern = sPattern;
					this._sUsedDisplayCalendarType = sCalendarType;
					this._oDisplayFormat = oFormat;
				} else {
					this._sUsedValuePattern = sPattern;
					this._sUsedValueCalendarType = sCalendarType;
					this._oValueFormat = oFormat;
				}
			}

			return oFormat;

		}

	}());

	/**
	 * This event gets fired when the input operation has finished and the value has changed.
	 *
	 * @name sap.m.DatePicker#change
	 * @event
	 * @param {sap.ui.base.Event} oControlEvent
	 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
	 * @param {object} oControlEvent.getParameters
	 * @param {string} oControlEvent.getParameters.value The new value of the <code>sap.m.DatePicker</code>.
	 * @param {boolean} oControlEvent.getParameters.valid Indicator for a valid date.
	 * @public
	 */

	 /**
	 * Fire event change to attached listeners.
	 *
	 * Expects following event parameters:
	 * <ul>
	 * <li>'value' of type <code>string</code> The new value of the <code>sap.m.DatePicker</code>.</li>
	 * <li>'valid' of type <code>boolean</code> Indicator for a valid date.</li>
	 * </ul>
	 *
	 * @param {Map} [mArguments] the arguments to pass along with the event.
	 * @return {sap.m.DatePicker} <code>this</code> to allow method chaining
	 * @protected
	 * @name sap.m.DatePicker#fireChange
	 * @function
	 */

	return DatePicker;

}, /* bExport= */ true);
