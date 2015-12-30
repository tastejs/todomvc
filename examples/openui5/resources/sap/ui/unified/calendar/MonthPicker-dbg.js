/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.unified.Calendar.
sap.ui.define(['jquery.sap.global', 'sap/ui/core/Control', 'sap/ui/core/LocaleData', 'sap/ui/core/delegate/ItemNavigation', 'sap/ui/unified/library'],
	function(jQuery, Control, LocaleData, ItemNavigation, library) {
	"use strict";

	/**
	 * Constructor for a new MonthPicker.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * renders a MonthPicker with ItemNavigation
	 * This is used inside the calendar. Not for stand alone usage
	 * @extends sap.ui.core.Control
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @since 1.28.0
	 * @alias sap.ui.unified.calendar.MonthPicker
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var MonthPicker = Control.extend("sap.ui.unified.calendar.MonthPicker", /** @lends sap.ui.unified.calendar.MonthPicker.prototype */ { metadata : {

		library : "sap.ui.unified",
		properties : {

			/**
			 * The month is initial focused and selected
			 * The value must be between 0 and 11
			 */
			month : {type : "int", group : "Misc", defaultValue : 0},

			/**
			 * number of displayed months
			 * The value must be between 1 and 12
			 * @since 1.30.0
			 */
			months : {type : "int", group : "Misc", defaultValue : 12},

			/**
			 * number of months in each row
			 * The value must be between 0 and 12 (0 means just to have all months in one row, independent of the number)
			 * @since 1.30.0
			 */
			columns : {type : "int", group : "Misc", defaultValue : 3}

		},
		events : {

			/**
			 * Month selection changed
			 */
			select : {}

		}
	}});

	(function() {

		MonthPicker.prototype.init = function(){

		};

		MonthPicker.prototype.onAfterRendering = function(){

			var that = this;

			_initItemNavigation(that);

			// check if day names are too big -> use smaller ones
			_checkNamesLength(that);

		};

		MonthPicker.prototype.setMonth = function(iMonth){

			// no rerendering needed, just select new month
			this.setProperty("month", iMonth, true);
			iMonth = this.getProperty("month"); // to have type conversion, validation....

			if (iMonth < 0 || iMonth > 11) {
				throw new Error("Property month must be between 0 and 11; " + this);
			}

			if (this.getDomRef()) {
				var that = this;
				if (this.getMonths() < 12) {
					var iStartMonth = _getStartMonth(that);
					if (iMonth >= iStartMonth && iMonth <= iStartMonth + this.getMonths() - 1) {
						_selectMonth(that, iMonth, true);
						this._oItemNavigation.focusItem(iMonth - iStartMonth);
					}else {
						_updateMonths(that, iMonth);
					}
				} else {
					_selectMonth(that, iMonth, true);
					this._oItemNavigation.focusItem(iMonth);
				}
			}


		};

		/*
		 * Use rendered locale for stand alone control
		 * But as Calendar can have an own locale, use this one if used inside Calendar
		 */
		MonthPicker.prototype._getLocale = function(){

			var oParent = this.getParent();

			if (oParent && oParent._getLocale) {
				return oParent._getLocale();
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
		MonthPicker.prototype._getLocaleData = function(){

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

		MonthPicker.prototype.onsapselect = function(oEvent){

			// focused item must be selected
			var that = this;
			var iIndex = this._oItemNavigation.getFocusedIndex();
			var iMonth = iIndex + _getStartMonth(that);

			_selectMonth(that, iMonth);
			this.fireSelect();

		};

		MonthPicker.prototype.onmouseup = function(oEvent){

			// fire select event on mouseup to prevent closing MonthPicker during click

			if (this._bMousedownChange) {
				this._bMousedownChange = false;
				this.fireSelect();
			}

		};

		MonthPicker.prototype.onThemeChanged = function(){

			if (this._bNoThemeChange) {
				// already called from Calendar
				return;
			}

			this._bNamesLengthChecked = undefined;
			var aMonths = this._oItemNavigation.getItemDomRefs();
			this._bLongMonth = false;
			var oLocaleData = this._getLocaleData();
			// change month name on button but not change month picker, because it is hided again
			var aMonthNames = oLocaleData.getMonthsStandAlone("wide");
			for (var i = 0; i < aMonths.length; i++) {
				var $Month = jQuery(aMonths[i]);
				$Month.text(aMonthNames[i]);
			}

			var that = this;
			_checkNamesLength(that);

		};

		/**
		 * displays the next page
		 *
		 * @returns {sap.ui.unified.calendar.MonthPicker} <code>this</code> to allow method chaining
		 * @public
		 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
		 */
		MonthPicker.prototype.nextPage = function(){

			var that = this;
			var iStartMonth = _getStartMonth(that);
			var iIndex = this._oItemNavigation.getFocusedIndex();
			var iMonth = iIndex + iStartMonth;
			var iMonths = this.getMonths();

			iMonth = iMonth + iMonths;
			if (iMonth > 11) {
				iMonth = 11;
			}
			_updateMonths(that, iMonth);

			return this;

		};

		/**
		 * displays the previous page
		 *
		 * @returns {sap.ui.unified.calendar.MonthPicker} <code>this</code> to allow method chaining
		 * @public
		 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
		 */
		MonthPicker.prototype.previousPage = function(){

			var that = this;
			var iStartMonth = _getStartMonth(that);
			var iIndex = this._oItemNavigation.getFocusedIndex();
			var iMonth = iIndex + iStartMonth;
			var iMonths = this.getMonths();

			iMonth = iMonth - iMonths;
			if (iMonth < 0) {
				iMonth = 0;
			}
			_updateMonths(that, iMonth);
			return this;

		};

		function _initItemNavigation(oThis){

			var oRootDomRef = oThis.getDomRef();
			var aDomRefs = oThis.$().find(".sapUiCalItem");
			var iColumns = oThis.getColumns();
			var iMonths = oThis.getMonths();
			var bCycling = true;

			if (iMonths < 12) {
				bCycling = false;
			}

			if (!oThis._oItemNavigation) {
				oThis._oItemNavigation = new ItemNavigation();
				oThis._oItemNavigation.attachEvent(ItemNavigation.Events.AfterFocus, _handleAfterFocus, oThis);
				oThis._oItemNavigation.attachEvent(ItemNavigation.Events.FocusAgain, _handleFocusAgain, oThis);
				oThis._oItemNavigation.attachEvent(ItemNavigation.Events.BorderReached, _handleBorderReached, oThis);
				oThis.addDelegate(oThis._oItemNavigation);
				oThis._oItemNavigation.setHomeEndColumnMode(true, true);
				oThis._oItemNavigation.setDisabledModifiers({
					sapnext : ["alt"],
					sapprevious : ["alt"],
					saphome : ["alt"],
					sapend : ["alt"]
				});
			}
			oThis._oItemNavigation.setRootDomRef(oRootDomRef);
			oThis._oItemNavigation.setItemDomRefs(aDomRefs);
			oThis._oItemNavigation.setCycling(bCycling);
			oThis._oItemNavigation.setColumns(iColumns, !bCycling);
			var iIndex = oThis.getMonth() - _getStartMonth(oThis);
			oThis._oItemNavigation.setFocusedIndex(iIndex);
			oThis._oItemNavigation.setPageSize(aDomRefs.length); // to make sure that pageup/down goes out of month

		}

		function _handleAfterFocus(oControlEvent){

			var iIndex = oControlEvent.getParameter("index");
			var oEvent = oControlEvent.getParameter("event");

			if (!oEvent) {
				return; // happens if focus is set via ItemNavigation.focusItem directly
			}

			if (oEvent.type == "mousedown") {
				// as no click event is fired in some cases
				var that = this;
				_handleMousedown(that, oEvent, iIndex);
			}

		}

		function _handleFocusAgain(oControlEvent){

			var iIndex = oControlEvent.getParameter("index");
			var oEvent = oControlEvent.getParameter("event");

			if (!oEvent) {
				return; // happens if focus is set via ItemNavigation.focusItem directly
			}

			if (oEvent.type == "mousedown") {
				// as no click event is fired in some cases
				var that = this;
				_handleMousedown(that, oEvent, iIndex);
			}

		}

		function _handleMousedown(oThis, oEvent, iIndex){

			if (oEvent.button) {
				// only use left mouse button
				return;
			}

			var iMonth = iIndex + _getStartMonth(oThis);

			_selectMonth(oThis, iMonth);
			oThis._bMousedownChange = true;

			oEvent.preventDefault(); // to prevent focus set outside of DatePicker
			oEvent.setMark("cancelAutoClose");

		}

		function _handleBorderReached(oControlEvent){

			var oEvent = oControlEvent.getParameter("event");

			if (oEvent.type) {
				var that = this;
				var iStartMonth = _getStartMonth(that);
				var iIndex = this._oItemNavigation.getFocusedIndex();
				var iMonth = iIndex + iStartMonth;
				var iMonths = this.getMonths();

				switch (oEvent.type) {
				case "sapnext":
				case "sapnextmodifiers":
					if (iMonth < 11) {
						iMonth++;
						_updateMonths(that, iMonth);
					}
					break;

				case "sapprevious":
				case "sappreviousmodifiers":
					if (iMonth > 0) {
						iMonth--;
						_updateMonths(that, iMonth);
					}
					break;

				case "sappagedown":
					if (iMonth < 12 - iMonths) {
						iMonth = iMonth + iMonths;
						_updateMonths(that, iMonth);
					}
					break;

				case "sappageup":
					if (iMonth > iMonths) {
						iMonth = iMonth - iMonths;
						_updateMonths(that, iMonth);
					}
					break;

				default:
					break;
				}
			}

		}

		function _selectMonth(oThis, iMonth, bNoSetDate){

			var aDomRefs = oThis._oItemNavigation.getItemDomRefs();
			var $DomRef;
			var sId = oThis.getId() + "-m" + iMonth;
			for ( var i = 0; i < aDomRefs.length; i++) {
				$DomRef = jQuery(aDomRefs[i]);
				if ($DomRef.attr("id") == sId) {
					$DomRef.addClass("sapUiCalItemSel");
				}else {
					$DomRef.removeClass("sapUiCalItemSel");
				}
			}

			if (!bNoSetDate) {
				oThis.setProperty("month", iMonth, true);
			}

		}

		function _checkNamesLength(oThis){

			if (!oThis._bNamesLengthChecked) {
				var i = 0;
				// only once - cannot change by rerendering - only by theme change
				var aMonths = oThis._oItemNavigation.getItemDomRefs();
				var bTooLong = false;
				var iMonths = oThis.getMonths();
				var iBlocks = Math.ceil(12 / iMonths);
				var iMonth = iMonths - 1;
				for (var b = 0; b < iBlocks; b++) {
					if (iMonths < 12) {
						_updateMonths(oThis, iMonth);
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
					iMonth = oThis.getMonth();
					_updateMonths(oThis, iMonth);
				}

				if (bTooLong) {
					oThis._bLongMonth = false;
					var oLocaleData = oThis._getLocaleData();
					// change month name on button but not change month picker, because it is hided again
					var aMonthNames = oLocaleData.getMonthsStandAlone("abbreviated");
					var aMonthNamesWide = oLocaleData.getMonthsStandAlone("wide");
					for (i = 0; i < aMonths.length; i++) {
						var $Month = jQuery(aMonths[i]);
						$Month.text(aMonthNames[i]);
						$Month.attr("aria-label", aMonthNamesWide[i]);
					}
				} else {
					oThis._bLongMonth = true;
				}

				oThis._bNamesLengthChecked = true;
			}

		}

		function _getStartMonth(oThis){

			if (oThis.getMonths() < 12) {
				var oFirstMonth = oThis._oItemNavigation.getItemDomRefs()[0];
				return parseInt( oFirstMonth.id.slice( oThis.getId().length + 2), 10);
			} else {
				return 0;
			}

		}

		function _updateMonths(oThis, iMonth){

			var aMonths = oThis._oItemNavigation.getItemDomRefs();
			if (aMonths.legth > 11) {
				return;
			}

			// Month blocks should start with multiple of number of displayed months
			var iMonths = aMonths.length;
			var iStartMonth = Math.floor( iMonth / iMonths) * iMonths;
			if (iStartMonth + iMonths > 12) {
				iStartMonth = 12 - iMonths;
			}

			var oLocaleData = oThis._getLocaleData();
			var aMonthNames = [];
			var aMonthNamesWide = [];
			if (oThis._bLongMonth || !oThis._bNamesLengthChecked) {
				aMonthNames = oLocaleData.getMonthsStandAlone("wide");
			} else {
				aMonthNames = oLocaleData.getMonthsStandAlone("abbreviated");
				aMonthNamesWide = oLocaleData.getMonthsStandAlone("wide");
			}

			var iSelectedMonth = oThis.getMonth();

			for (var i = 0; i < aMonths.length; i++) {
				var $DomRef = jQuery(aMonths[i]);
				$DomRef.text(aMonthNames[i + iStartMonth]);
				$DomRef.attr("id", oThis.getId() + "-m" + (i + iStartMonth));
				if (!oThis._bLongMonth) {
					$DomRef.attr("aria-label", aMonthNamesWide[i + iStartMonth]);
				}
				if (i + iStartMonth == iSelectedMonth) {
					$DomRef.addClass("sapUiCalItemSel");
				}else {
					$DomRef.removeClass("sapUiCalItemSel");
				}
			}

			oThis._oItemNavigation.focusItem(iMonth - iStartMonth);
		}

	}());

	return MonthPicker;

}, /* bExport= */ true);
