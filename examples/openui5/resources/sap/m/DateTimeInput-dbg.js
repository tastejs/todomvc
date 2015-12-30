/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.m.DateTimeInput.
sap.ui.define(['jquery.sap.global', './InputBase', './InstanceManager', './library', 'sap/ui/core/IconPool', 'sap/ui/core/theming/Parameters', 'sap/ui/model/type/Date', 'sap/ui/thirdparty/mobiscroll/js/mobiscroll-core', 'sap/ui/thirdparty/mobiscroll/js/mobiscroll-datetime', 'sap/ui/thirdparty/mobiscroll/js/mobiscroll-scroller'],
	function(jQuery, InputBase, InstanceManager, library, IconPool, Parameters, Date1, mobiscrollcore, mobiscrolldatetime, mobiscrollscroller) {
	"use strict";


	
	/**
	 * Constructor for a new DateTimeInput.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * Allows end users to interact with date and/or time and select from a date and/or time pad.
	 * Note: Since 1.22, this control should not be used as a date picker(type property "Date"), instead please use dedicated sap.m.DatePicker control.
	 * Note: This control does not support the Islamic calendar.
	 * @extends sap.m.InputBase
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @since 1.9.1
	 * @deprecated Since version 1.32.8. Instead, use dedicated <code>sap.m.DatePicker</code> and/or <code>sap.m.TimePicker</code> controls. 
	 * @alias sap.m.DateTimeInput
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var DateTimeInput = InputBase.extend("sap.m.DateTimeInput", /** @lends sap.m.DateTimeInput.prototype */ { metadata : {
	
		library : "sap.m",
		properties : {
	
			/**
			 * Type of DateTimeInput (e.g. Date, Time, DateTime)
			 */
			type : {type : "sap.m.DateTimeInputType", group : "Data", defaultValue : sap.m.DateTimeInputType.Date},
	
			/**
			 * Displays date value in this given format in text field. Default value is taken from locale settings.
			 * If you use data-binding on value property with type sap.ui.model.type.Date then you can ignore this property or latter wins.
			 * If user browser supports native picker then this property is overwritten by browser with locale settings.
			 */
			displayFormat : {type : "string", group : "Appearance", defaultValue : null},
	
			/**
			 * Given value property should match with valueFormat to parse date. Default value is taken from locale settings.
			 * You can only set and get value in this format.
			 * If you use data-binding on value property with type sap.ui.model.type.Date you can ignore this property or latter wins.
			 */
			valueFormat : {type : "string", group : "Data", defaultValue : null},
	
			/**
			 * This property as JavaScript Date Object can be used to assign a new value which is independent from valueFormat.
			 */
			dateValue : {type : "object", group : "Data", defaultValue : null}
		},
		events : {
	
			/**
			 * This event gets fired when the selection has finished and the value has changed.
			 */
			change : {
				parameters : {
	
					/**
					 * The string value of the control in given valueFormat(or locale format).
					 */
					value : {type : "string"}, 
	
					/**
					 * The value of control as JavaScript Date Object or null if value is empty.
					 */
					dateValue : {type : "object"}
				}
			}
		}
	}});
	
	
	!(function(oPrototype, $, oDevice) {
	
		var oi18n = sap.m.getLocaleData();
	
		$.extend(oPrototype, {
			_origin : "value",
			_super : InputBase.prototype,
			_types : {
				Date : {
					valueFormat : oi18n.getDatePattern("short"),
					displayFormat : oi18n.getDatePattern("medium")
				},
				Time : {
					valueFormat : oi18n.getTimePattern("short"),
					displayFormat : oi18n.getTimePattern("short")
				},
				DateTime : {
					valueFormat : oi18n.getDateTimePattern("short"),	// does not include pattern but e.g "{1} {0}"
					displayFormat : oi18n.getDateTimePattern("short")	// does not include pattern but e.g "{1} {0}"
				}
			}
		});
	
		// am-pm picker is hard-coded so use 24 hour format when language is not English
		if (sap.m.getLocale().getLanguage() != "en") {
			["valueFormat", "displayFormat"].forEach(function(sFormatType) {
				var oTime = oPrototype._types.Time;
				var sFormat = oTime[sFormatType];
				if (sFormat.indexOf("a") != -1) {
					oTime[sFormatType] = sFormat.replace(/a+/i, "").replace(/h+/i, "HH").trim();
				}
			});
		}
	
		// build DateTime formats from Date And Time values
		["Time", "Date"].forEach(function(sType, nIndex) {
			["valueFormat", "displayFormat"].forEach(function(sFormat) {
				var oTypes = oPrototype._types;
				oTypes.DateTime[sFormat] = oTypes.DateTime[sFormat].replace("{" + nIndex + "}", oTypes[sType][sFormat]);
			});
		});
	
	}(DateTimeInput.prototype, jQuery, sap.ui.Device));
	
	/**
	 * @overwrite sap.m.InputBase#onBeforeRendering
	 */
	DateTimeInput.prototype.onBeforeRendering = function() {
		this._destroyCustomPicker();
		this._super.onBeforeRendering.call(this);
		if (!this.mProperties.hasOwnProperty("type")) {
			this.setType("Date");
		}
	};
	
	/**
	 * @overwrite sap.m.InputBase#onAfterRendering
	 */
	DateTimeInput.prototype.onAfterRendering = function() {
		this._super.onAfterRendering.call(this);
		this._$input.scroller(this._getScrollerConfig());
		this._showValue();
	};
	
	/**
	 * @overwrite sap.m.InputBase#exit
	 */
	DateTimeInput.prototype.exit = function() {
		this._destroyCustomPicker();
		this._super.exit.call(this);
	};
	
	/**
	 * <pre>
	 * Setter for property <code>width</code>
	 *
	 * Default value is 100%
	 * </pre>
	 *
	 * @public
	 * @overwrite sap.m.InputBase#setWidth
	 * @param {sap.ui.core.CSSSize} sWidth new value for property <code>width</code>
	 * @returns {sap.m.DateTimeInput} this to allow method chaining
	 */
	DateTimeInput.prototype.setWidth = function(sWidth) {
		return this._super.setWidth.call(this, sWidth || "100%");
	};
	
	/**
	 * <pre>
	 * Getter for property <code>width</code>. Defines the width of the DateTimeInput, this value can be provided in %, em, px… and all possible CSS units.
	 *
	 * Default value is 100%
	 * </pre>
	 *
	 * @public
	 * @overwrite sap.m.InputBase#getWidth
	 * @returns {sap.ui.core.CSSSize} the value of property width
	 */
	DateTimeInput.prototype.getWidth = function() {
		return this.getProperty("width") || "100%";
	};
	
	/**
	 * <pre>
	 * This function can be used to assign new value and this is relevant with <code>valueFormat</code> property(see valueFormat) but independent from what is going to display on the field(see displayFormat).
	 * Another way to assign new value is using dateValue property in JsView(see dateValue).
	 * If you use both at the same time, latter wins.
	 *
	 * Also "Now" literal can be assigned as a parameter to show the current date and/or time.
	 * </pre>
	 *
	 * @public
	 * @see sap.m.DateTimeInput#getValueFormat
	 * @see sap.m.DateTimeInput#getDisplayFormat
	 * @see sap.m.DateTimeInput#getDateValue
	 * @param {string} sValue new value for property <code>value</code>
	 * @returns {sap.m.DateTimeInput} this to allow method chaining
	 */
	DateTimeInput.prototype.setValue = function(sValue) {
		sValue = this.validateProperty("value", sValue);
		if (sValue.toLowerCase() == "now") {
			return this.setDateValue(new Date());
		}
	
		if (sValue === this.getValue()) {
			return this;
		}
	
		this.setProperty("value", sValue);
		this._origin = "value";
		this._getFormatFromBinding();
		return this;
	};
	
	// set the dateValue property if oValue parameter is defined
	DateTimeInput.prototype.setDateValue = function(oValue) {
		if (!oValue || oValue === this.getDateValue()) {
			return this;
		}
	
		this._isDate(oValue);
		this._origin = "dateValue";
		this.setProperty("dateValue", oValue);
		if (!this.getDomRef()) {
			// set the string value property from date object if control is not yet rendered
			this.setProperty("value", sap.ui.core.format.DateFormat.getDateInstance({
				pattern : this.getValueFormat()
			}).format(oValue), true);
		}
		return this;
	};
	
	// returns assigned dateValue property or converts value to JS Date Object.
	DateTimeInput.prototype.getDateValue = function() {
		if (this._origin == "dateValue") {
			return this.getProperty("dateValue");
		}
	
		var sValue = this.getProperty("value");
		if (!sValue) {
			return null;
		}
	
		return sap.ui.core.format.DateFormat.getDateInstance({
			pattern : this.getValueFormat()
		}).parse(sValue);
	};
	
	DateTimeInput.prototype.getDisplayFormat = function() {
		return this.getProperty("displayFormat") || this._types[this.getType()].displayFormat;
	};
	
	DateTimeInput.prototype.getValueFormat = function() {
		return this.getProperty("valueFormat") || this._types[this.getType()].valueFormat;
	};
	
	DateTimeInput.prototype.onfocusin = function() {
		this.$().toggleClass("sapMFocus", true);
		this._setLabelVisibility();
		
		// open message when focus is back to input field
		this.openValueStateMessage();
	};
	
	// Check given is JS Date Object and throw error if not
	DateTimeInput.prototype._isDate = function(oValue) {
		if (!sap.m.isDate(oValue)) {
			throw new Error("Type Error: Expected JavaScript Date Object for property dateValue of " + this);
		}
		return true;
	};
	
	/** *
	 * Change event handler of the Input field
	 * Also gets called programmatically without parameter to update input value
	 *
	 * @overwrite sap.m.InputBase#onChange
	 */
	DateTimeInput.prototype.onChange = function(oEvent) {
		var oDate = null,
			sNewValue = this._$input.val(),
			sOldValue = this.getProperty("value");
	
		if (sNewValue) {
			oDate = this._$input.scroller("getDate");
			this.getType() == "Date" && oDate.setHours(0, 0, 0, 0);
	
			// reformat for CLDR
			oEvent && this._reformat && this._$input.val(
				sap.ui.core.format.DateFormat.getDateInstance({
					pattern : this.getDisplayFormat()
				}).format(oDate)
			);
	
			if (!isNaN(oDate)) {
				sNewValue = sap.ui.core.format.DateFormat.getDateInstance({
					pattern : this.getValueFormat()
				}).format(oDate);
			} else {
				sNewValue = "";
				oDate = null;
			}
		}
	
		if (sOldValue == sNewValue) {
			return;
		}
	
		this.setProperty("value", sNewValue, true);
		this.setProperty("dateValue", oDate, true);
		this._setLabelVisibility();
	
		if (oEvent && oEvent.type != "focus") {
			this.fireChangeEvent(sNewValue, {
				dateValue: oDate,
	
				// backwards compatibility
				newDateValue: oDate
			});
		}
	};
	
	/**
	 * Destroy custom picker if available
	 */
	DateTimeInput.prototype._destroyCustomPicker = function() {
		if (this._$input) {
			this._$input.scroller("hide");
			this._$input.scroller("destroy");
		}
	};
	
	DateTimeInput.prototype._setInputValue = function(sValue) {
		this._$input.val(sValue);
		this._setLabelVisibility();
		this.onChange();
	};
	
	/**
	 * Do the required conversion and set input value
	 */
	DateTimeInput.prototype._showValue = function() {
		var date = this.getProperty(this._origin);
		if (!date) {
			return;
		}
	
		if (this._origin == "value") {
			date = sap.ui.core.format.DateFormat.getDateInstance({
				pattern : this.getValueFormat()
			}).parse(date);
	
			if (!date) {
				jQuery.sap.log.error( "Format Error: value property " + this.getValue()
									+ " does not match with valueFormat " + this.getValueFormat()
									+ " of " + this );
				this._setInputValue("");
				return;
			}
		} else {
			this._isDate(date);
		}
	
		this._$input.scroller("setDate", date, false);
		this._setInputValue(
			sap.ui.core.format.DateFormat.getDateInstance({
				pattern : this.getDisplayFormat()
			}).format(date)
		);
	};
	
	/**
	 * Check data-binding for value property
	 * Get according pattern from type settings
	 */
	DateTimeInput.prototype._getFormatFromBinding = function() {
		var oBindingInfo = this.getBindingInfo("value");
		if (!oBindingInfo) {
			return;
		}
	
		var oBindingType = oBindingInfo.type;
		if (!oBindingType || !(oBindingType instanceof Date1)) {
			return;
		}
	
		var sFormat = oBindingType.getOutputPattern();
		this.setProperty("valueFormat", sFormat, true);
		this.setProperty("displayFormat", sFormat, true);
		return sFormat;
	};
	
	/**
	 * Opens scroller on tap
	 */
	DateTimeInput.prototype.ontap = function(oEvent) {
		if (document.activeElement) {
			document.activeElement.blur();
		}
		
		this._$input.scroller("show");
		oEvent.preventDefault();
		oEvent.setMarked();
	};
	
	/**
	 * Handle backspace
	 */
	DateTimeInput.prototype.onsapbackspace = function(oEvent) {
		// since input is readonly does not allow browsers back navigation
		oEvent.preventDefault();
	};
	
	/**
	 * Opens scroller via keyboard [ALT]+[UP]
	 */
	DateTimeInput.prototype.onsaphide = DateTimeInput.prototype.ontap;
	
	/**
	 * Opens scroller via keyboard [F4] or [ALT]+[DOWN]
	 */
	DateTimeInput.prototype.onsapshow = DateTimeInput.prototype.ontap;
	
	/**
	 * Enables custom date time and adds related methods to prototype
	 */
	(function($, oDevice) {
	
		var oDefaults = {},
			oCore = sap.ui.getCore(),
			oLocale = sap.m.getLocale(),
			sLanguage = oLocale.getLanguage(),
			oLocaleData = sap.m.getLocaleData(),
			oResourceBundle = oCore.getLibraryResourceBundle("sap.m"),
			_ = function(sText) {
				return $.sap.encodeHTML(oResourceBundle.getText("MOBISCROLL_" + sText));
			},
			rgxExcludeLiteral = "(?=([^']*'[^']*')*[^']*$)",
			sCssPath = $.sap.getModulePath("sap.ui.thirdparty.mobiscroll", "/css/"),
			oSettings = {
				endYear : new Date().getFullYear() + 10,
				lang : sLanguage
			},
			oi18n = {
				setText : _("SET"),
				cancelText : _("CANCEL"),
				monthText : _("MONTH"),
				dayText : _("DAY"),
				yearText : _("YEAR"),
				hourText : _("HOURS"),
				minuteText : _("MINUTES"),
				secText : _("SECONDS"),
				nowText : _("NOW"),
				dayNames : oLocaleData.getDaysStandAlone("wide"),
				dayNamesShort : oLocaleData.getDaysStandAlone("abbreviated"),
				monthNames : oLocaleData.getMonthsStandAlone("wide"),
				monthNamesShort : oLocaleData.getMonthsStandAlone("abbreviated")
			},
			oThemeParams = Parameters.get();
	
		// inject resources
		$.sap.includeStyleSheet(sCssPath + "mobiscroll-core.css");
	
		// do not 'calculate' dependency names or analyzer will ignore them
				
		// get default settings
		oDefaults = $("<input>").scroller({}).scroller("getInst").settings;
	
		var device = ["phone", "tablet", "desktop"].filter(function(d) {
				return oDevice.system[d];
			})[0],
			ucfirst = function(str) {
				if (!str) {
					return "";
				}
				return str.charAt(0).toUpperCase() + str.substr(1);
			},
			setDefaultsByTheme = function(key, type, prefix) {
				var value = oThemeParams["sapUiDTICustom" + ucfirst(prefix) + ucfirst(key)];
				if (value) {
					if (type == "bool") {
						oSettings[key] = (value.toLowerCase() == "true" ? true : false);
					} else if (type == "int") {
						value = parseInt(value, 10);
						!isNaN(value) && (oSettings[key] = value);
					} else {
						oSettings[key] = value;
					}
				}
				if (!prefix && device) {
					setDefaultsByTheme(key, type, device);
				}
			};
	
		oSettings.mode = "mixed";
		oSettings.display = "modal";
		oSettings.theme = "sapMDTICustom";
		setDefaultsByTheme("mode");
		setDefaultsByTheme("display");
		setDefaultsByTheme("rows", "int");
		setDefaultsByTheme("width", "int");
		setDefaultsByTheme("height", "int");
		setDefaultsByTheme("showLabel", "bool");
		setDefaultsByTheme("headerText", "bool");
		if (oSettings.headerText) {
			// mobiscroll needs text to replace
			oSettings.headerText = "{value}";
		}
	
		// load custom fonts
			IconPool.insertFontFaceStyle();
	
		// enable language settings
		$.scroller.i18n[sLanguage] = $.extend({}, oi18n);
	
		// enable instance management
		
		// Add custom datetime methods to prototype
		$.extend(DateTimeInput.prototype, {
			/**
			 * This method gets called from sap.m.InstanceManager,
			 * to close the opened mobiscroll dialog when the back button is clicked
			 */
			close : function() {
				this._$input.scroller("hide");
			},
	
			/**
			 * Mobiscroll title reformatter to support all cldr formats
			 * We can only get string value onChange/onWheel event
			 */
			_setScrollerHeader : function(sValue) {
				try {
					var oConfig = this._$input.scroller("getInst").settings,
						sFormat = !this.getType().indexOf("Date") ? oConfig.dateFormat : oConfig.timeFormat,
						oDate = $.mobiscroll.parseDate(sFormat, sValue);
	
					return $.sap.encodeHTML(sap.ui.core.format.DateFormat.getDateInstance({
						pattern : this.getDisplayFormat()
					}).format(oDate));
				} catch (e) {
					return sValue;
				}
			},
	
			/**
			 * Auto close for bubbles
			 */
			_autoClose : function(oEvent) {
				var oDomRef = this.getDomRef();
				if (oDomRef && oDomRef.contains(oEvent.target)) {
					oEvent.stopPropagation();
					oEvent.preventDefault();
					return;
				}
	
				var oDialog = document.querySelector(".sapMDTICustom .dwwr");
				if (oDialog && !oDialog.contains(oEvent.target)) {
					this._$input.scroller("hide");
				}
			},
	
			/**
			 * Restrict max width of the dialog
			 */
			_restrictMaxWidth : function($dialog) {
				//TODO : Find a better way to find out 22 instead of hard coding
				$dialog[0].querySelector(".dwwr").style.maxWidth = (document.documentElement.clientWidth - 22) + "px";
			},
	
			/**
			 * Handle window resize event
			 */
			_handleResize : function(oEvent) {
				this._restrictMaxWidth(oEvent.data.$dialog);
			},
	
			/**
			 * Handle key down event for buttons
			 */
			_handleBtnKeyDown : function(oEvent) {
				if (oEvent.which === $.sap.KeyCodes.ENTER) {
					if (oEvent.target && $(oEvent.target.parentElement).hasClass("dwb-c")) {
						// This means that "Return" was pressed with the
						// 'Cancel' button having the focus: 'Cancel' wins.
						this._$input.scroller("cancel");
					} else {
						this._$input.scroller("select");
					}
				} else if (oEvent.which === $.sap.KeyCodes.ESCAPE) {
					this._$input.scroller("cancel");
				} else if (oEvent.which === $.sap.KeyCodes.F4) {
					this._$input.scroller("select");
				}
			},
	
			/**
			 * Date-time conversion for mobiscroll configuration
			 */
			_getScrollerConfig : function() {
				var that = this,
					sType = this.getType(),
					sFormat = this.getDisplayFormat(),
					fnAutoCloseProxy = $.proxy(this._autoClose, this),
					fnHandleResize = $.proxy(this._handleResize, this),
					fnHandleBtnKeyDown = $.proxy(this._handleBtnKeyDown, this),
					fnFocusInFirst, fnFocusInLast, fnClick,
					$focusLeft = $("<span class='sapMFirstFE' tabindex='0'/>"),
					$focusRight = $("<span class='sapMLastFE' tabindex='0'/>"),
					fnKeyDown, $dialogToClean,
					oConfig = $.extend({}, oSettings, {
						preset : sType.toLowerCase(),
						showOnFocus : false,
						showOnTap: false,
						disabled : !that.getEnabled() || !that.getEditable(),
						onShow : function($dialog) {
							// Special treatment for IE: with jQuery < 1.9 focus is fired twice in IE
							// Therefore, mobiscroll may open the scroller again, immediately after it
							// has been closed
							if (oDevice.browser.msie) {
								if (that._popupIsShown) {
									return;
								}
								that._popupIsShown = true;
							}
	
							InstanceManager.addDialogInstance(that);
							$(window).on("resize.sapMDTICustom", {$dialog : $dialog}, fnHandleResize);
							//Fix a bug in mobiscroll-core.js line 805 (mobiscroll 2.7.2): their
							//'keydown.dw' handler always triggers a select, even if return was
							//pressed on the cancel button
							$(window).unbind('keydown.dw');
							$dialog.on('keydown.dw', fnHandleBtnKeyDown);
	
							if (oSettings.display == "bubble") {
								document.addEventListener(oDevice.support.touch ? "touchstart" : "mousedown", fnAutoCloseProxy, true);
							}
							if (oDevice.system.desktop) {
								// Amend keyboard navigation: see sap.m.Dialog.onfocusin for
								// an analogous procedure
								var $scrollerCont = $dialog.find('.dwcc'),
									$buttonBar = $dialog.find('.dwbc'),
									aFocusables = $scrollerCont.find(":focusable.dwww"),
                                   
                                    // to determine whether the input is inside a UI5 popup or not
									sOpenerPopupID = that._$input.closest("[data-sap-ui-popup]").attr("data-sap-ui-popup");
									
								if (sOpenerPopupID) {
									// let the inner popup know that a popup will be open
									var sPickerID = that.getId() + "-picker";
                                  
									// set a fix id for the picker so it can be set as focusable for the UI5 popup
									$dialog.attr("id", sPickerID);
                                  
									// every popup registers itself to the eventbus so it can be accesses since a popup is not a control that is listed in the control tree. 
									// via using the eventbus and providing the id of the picker it can be focused without that the UI5 popup reclaims the focus
									var sEventId = "sap.ui.core.Popup.addFocusableContent-" + sOpenerPopupID;
									sap.ui.getCore().getEventBus().publish("sap.ui", sEventId, {
										id : sPickerID
									});
								}
								
								$focusLeft.insertBefore($scrollerCont);
								fnFocusInLast = $.proxy(that._getFocusInHandler($buttonBar, false), that);
								$focusLeft.focusin(fnFocusInLast);
	
								$focusRight.insertAfter($buttonBar);
								fnFocusInFirst = $.proxy(that._getFocusInHandler($scrollerCont, true), that);
								$focusRight.focusin(fnFocusInFirst);
	
								// Make sure, the first scroller column has initial focus
								$.sap.focus($scrollerCont.firstFocusableDomRef());
								
								// CSN 0120061532 0001326801 2014: mobiscroll scrollers don't 
								// get focus when clicked upon
								fnClick = function(oEvent){
									//The target itself is not focusable. Need to focus the 
									//scroller parent marked by a 'dwww' class 
									$.sap.focus($(oEvent.target).parents(".dwww"));
								};
								$dialog.click(fnClick);
	
								// Support other keyboard events as well, e.g. LEFT, RIGHT
								$dialogToClean = $dialog;
								fnKeyDown = $.proxy(that._getKeyDownHandler(aFocusables), that);
								$dialog.keydown(fnKeyDown);
							}
						},
						onClose : function() {
							// Special treatment for IE: with jQuery < 1.9 focus is fired twice in IE
							// Therefore, mobiscroll may open the scroller again, immediately after it
							// has been closed
							if (oDevice.browser.msie) {
								that._popupIsShown = false;
							}
							InstanceManager.removeDialogInstance(that);
							$(window).off("resize.sapMDTICustom", fnHandleResize);
							if (oSettings.display == "bubble") {
								document.removeEventListener(oDevice.support.touch ? "touchstart" : "mousedown", fnAutoCloseProxy, true);
							}
	
							// clean up listeners
							$focusLeft.unbind('focusin', fnFocusInLast);
							$focusRight.unbind('focusin', fnFocusInFirst);
							if ($dialogToClean) {
								$dialogToClean.unbind('keydown', fnKeyDown);
								$dialogToClean.unbind('keydown.dw', fnHandleBtnKeyDown);
								$dialogToClean.unbind('click', fnClick);
							}
						},
						onSelect : function() {
							// fire change event on selection
							that.onChange({});
						},
						onMarkupReady : function($dialog, inst) {
							that._restrictMaxWidth($dialog);
							$dialog.addClass("sapMDTICustom" + that.getType());
							if (oSettings.headerText !== false) {
								$dialog.addClass("sapMDTICustomHdr");
							}
						}
					});
	
				if (sType == "Date") {
					sFormat = this._convertDatePattern(sFormat);
					$.extend(oConfig, {
						timeWheels : "",
						dateFormat : sFormat,
						dateOrder : this._getLongDatePattern(sFormat.replace(/'.*?'/g, "")).replace(/[^ymd ]/ig, "")
					});
				} else if (sType == "Time") {
					sFormat = this._convertTimePattern(sFormat);
					$.extend(oConfig, {
						dateOrder : "",
						timeFormat : sFormat,
						timeWheels : sFormat.replace(/'.*?'/g, "").replace(/[^hisa]/ig, "")
					});
				} else if (sType == "DateTime") {
					sFormat = this._convertDatePattern(this._convertTimePattern(sFormat));
	
					// date-time hack
					$.extend(oConfig, {
						dateFormat : sFormat,
						dateOrder : this._getLongDatePattern(sFormat.replace(/'.*?'/g, "")).replace(/[^ymd ]/ig, ""),
						rows : this._getRowForDateTime(),
						timeWheels : sFormat,
						timeFormat : "",
						separator : ""
					});
				}
	
				// check given format is not supported by mobiscroll
				if (/[^ymdhisa\W]/i.test(sFormat)) {
					this._reformat = true;
					if (oSettings.headerText !== false) {
						oConfig.headerText = $.proxy(this._setScrollerHeader, this);
					}
				} else {
					this._reformat = false;
				}
	
				return oConfig;
			},
	
			/**
			 * Until mobiscroll fixes min height(360px) problem for date time
			 * we just decrease the row count to 3
			 */
			_getRowForDateTime : function() {
				var rows = oSettings.rows || oDefaults.rows;
				if (!rows || rows <= 3) {
					return 3;
				}
				return Math.min(window.innerWidth, window.innerHeight) < 360 ? 3 : rows;
			},
	
			/**
			 * Returns a handler function to focus first or last focusable component
			 * within a given jQuery element to be used as a handler for
			 * the 'focusin' event.
			 *
			 * @param $parent the element whose children shall be focussed
			 * @param first if true return a function to focus the $parent's first
			 * focusable element, otherwise return a function to focus $parent's last
			 * focusable element.
			 */
			_getFocusInHandler : function($parent, first) {
				return function() {
					var oElementToFocus = first ? $parent.firstFocusableDomRef() : $parent.lastFocusableDomRef();
					$.sap.focus(oElementToFocus);
				};
			},
	
			/**
			 * Returns a handler function to deal with key events for keyboard
			 * navigation, that are not yet dealt with by the underlying mobiscroll
			 * dialog.
			 *
			 * @param aFocusables array of focusable elements within the mobiscroll dialog
			 */
			_getKeyDownHandler : function(aFocusables) {
				return function(oEvent){
					var iKeyCode = oEvent.which,
					bShift = oEvent.shiftKey,
					bAlt = oEvent.altKey,
					bCtrl = oEvent.ctrlKey;
					if (!bAlt && !bShift && !bCtrl) {
						// No modifiers pressed
						switch (iKeyCode) {
							// RIGHT
							case $.sap.KeyCodes.ARROW_RIGHT:
								// Moves focus one column right to the selected field, e.g. from Hours to Minutes.
								// When focus is on the last column, move focus to the first column.
								var current = aFocusables.index(document.activeElement),
								$next = aFocusables.eq(current + 1).length ? aFocusables.eq(current + 1) : aFocusables.eq(0);
								$next.focus();
								break;
							case $.sap.KeyCodes.ARROW_LEFT:
								// Moves focus one column left to the selected field, e.g. from Minutes to Hours.
								// When focus is on the first column, move focus to the last column.
								var current = aFocusables.index(document.activeElement),
								$previous = aFocusables.eq(current - 1).length ? aFocusables.eq(current - 1) : aFocusables.eq(aFocusables.length - 1);
								$previous.focus();
								break;
							case $.sap.KeyCodes.HOME:
								// Moves focus to the first column of the same row and same month
								aFocusables[0].focus();
								break;
							case $.sap.KeyCodes.END:
								// Moves focus to the last column of the same row and same month
								aFocusables[aFocusables.length - 1].focus();
								break;
							default:
								break;
						}
					} else if (bAlt && !bShift && !bCtrl) {
						// ALT pressed
						switch (iKeyCode) {
							case $.sap.KeyCodes.ARROW_UP:
							case $.sap.KeyCodes.ARROW_DOWN:
								// Keeps the current state and closes the dialog. Same as clicking “OK”.
								this._$input.scroller("select");
								break;
							default:
								break;
						}
					}
				};
			},
	
			/**
			 * cache often used regular expressions
			 */
			_rgxYear : new RegExp("y+" + rgxExcludeLiteral, "ig"),
			_rgxMonth : new RegExp("m+" + rgxExcludeLiteral, "ig"),
			_rgxDay : new RegExp("d+" + rgxExcludeLiteral, "g"),
			_rgxMinute : new RegExp("m" + rgxExcludeLiteral, "g"),
			_rgxAmPm : new RegExp("a" + rgxExcludeLiteral, "g"),
			_rgxDayOfWeekLong : new RegExp("EEEE" + rgxExcludeLiteral, "g"),
			_rgxDayOfWeekShort : new RegExp("E+" + rgxExcludeLiteral, "g"),
	
			/**
			 * Convert date pattern to long month name, 4 digit year, 2 digit day
			 */
			_getLongDatePattern : function(sPattern) {
				sPattern = (sPattern || this.getDisplayFormat()).replace(this._rgxYear, "YY");
				return sPattern.replace(this._rgxMonth, "MM").replace(this._rgxDay, "dd");
			},
	
			/**
			 * Converts the time pattern from CLDR to the mobiscroll time picker
			 * m is short month name, i = minute
			 */
			_convertTimePattern : function(sPattern) {
				sPattern = sPattern || this.getDisplayFormat();
				return sPattern.replace(this._rgxMinute, "i").replace(this._rgxAmPm, "A");
			},
	
			/**
			 * Converts the date pattern from CLDR to the one of the jQuery datePicker
			 * Month is coded in the different way
			 * TODO: Copied from core talk with core team to call method from somewhere else shared
			 * TODO: This implementation ignores the literals usage case, talk also with core team
			 */
			_convertDatePattern : function(sPattern) {
				sPattern = sPattern || this.getDisplayFormat();
	
				var iIndex1 = sPattern.indexOf("M"),
					iIndex2 = sPattern.lastIndexOf("M"),
					sFormat = sPattern,
					sNewMonth;
	
				if (iIndex1 == -1) {
					// no month defined with M, maybe using L (standalone)
					iIndex1 = sPattern.indexOf("L");
					iIndex2 = sPattern.lastIndexOf("L");
				}
	
				if (iIndex1 > -1) {
					switch (iIndex2 - iIndex1) {
					case 0:
						sNewMonth = "m";
						break;
					case 1:
						sNewMonth = "mm";
						break;
					case 2:
						sNewMonth = "M";
						break;
					case 5:
						// narrow state not available in jQuery DatePicker -> use shortest one
						sNewMonth = "m";
						break;
					default:
						sNewMonth = "MM";
					break;
					}
					sFormat = sPattern.substring(0, iIndex1) + sNewMonth + sPattern.substring(iIndex2 + 1);
				}
	
				var sNewYear;
				iIndex1 = sFormat.indexOf("y");
				if (iIndex1 > -1) {
					iIndex2 = sFormat.lastIndexOf("y");
					if (iIndex2 - iIndex1 == 1) {
						// two chanrs
						sNewYear = "y";
					} else {
						sNewYear = "yy";
					}
					sFormat = sFormat.substring(0, iIndex1) + sNewYear + sFormat.substring(iIndex2 + 1);
				}
	
				var sNewYearDay;
				iIndex1 = sFormat.indexOf("D");
				if (iIndex1 > -1) {
					iIndex2 = sFormat.lastIndexOf("D");
	
					if (iIndex2 - iIndex1 == 1) {
						// two chanrs
						sNewYearDay = "o";
					} else {
						sNewYearDay = "oo";
					}
					sFormat = sFormat.substring(0, iIndex1) + sNewYearDay + sFormat.substring(iIndex2 + 1);
				}
	
				// EEEE = DD = day of week(long)
				// EEE, EE, E = D = day of week(short)
				sFormat = sFormat.replace(this._rgxDayOfWeekLong, "DD").replace(this._rgxDayOfWeekShort, "D");
				return sFormat;
			}
		});
	
	})(jQuery, sap.ui.Device);
	

	return DateTimeInput;

}, /* bExport= */ true);
