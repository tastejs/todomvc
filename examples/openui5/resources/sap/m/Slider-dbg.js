/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(['jquery.sap.global', './library', 'sap/ui/core/Control', 'sap/ui/core/EnabledPropagator'],
	function(jQuery, library, Control, EnabledPropagator) {
		"use strict";

		/**
		 * Constructor for a new <code>sap.m.Slider</code>.
		 *
		 * @param {string} [sId] Id for the new control, generated automatically if no ID is given.
		 * @param {object} [mSettings] Initial settings for the new control.
		 *
		 * @class
		 * A slider is a user interface control that enables the user to adjust values in a specified numerical range.
		 * @extends sap.ui.core.Control
		 *
		 * @author SAP SE
		 * @version 1.32.9
		 *
		 * @constructor
		 * @public
		 * @alias sap.m.Slider
		 * @ui5-metamodel This control will also be described in the UI5 (legacy) design time meta model.
		 */
		var Slider = Control.extend("sap.m.Slider", /** @lends sap.m.Slider.prototype */ { metadata: {

			library: "sap.m",
			properties: {

				/**
				 * Defines the width of the control.
				 */
				width: { type: "sap.ui.core.CSSSize", group: "Appearance", defaultValue: "100%" },

				/**
				 * Indicates whether the user can change the value.
				 */
				enabled: { type: "boolean", group: "Behavior", defaultValue: true },

				/**
				 * The name property to be used in the HTML code for the slider (e.g. for HTML forms that send data to the server via submit).
				 */
				name: { type: "string", group: "Misc", defaultValue: "" },

				/**
				 * The minimum value.
				 */
				min: { type: "float", group: "Data", defaultValue: 0 },

				/**
				 * The maximum value.
				 */
				max: { type: "float", group: "Data", defaultValue: 100 },

				/**
				 * Define the amount of units to change the slider when adjusting by drag and drop.
				 *
				 * Defines the size of the slider's selection intervals. (e.g. min = 0, max = 10, step = 5 would result in possible selection of the values 0, 5, 10).
				 *
				 * The step must be positive, if a negative number is provided, the default value will be used instead.
				 * If the width of the slider converted to pixels is less than the range (max – min), the value will be rounded to multiples of the step size.
				 */
				step: { type: "float", group: "Data", defaultValue: 1 },

				/**
				 * Indicate whether a progress bar indicator is shown.
				 */
				progress: { type: "boolean", group: "Misc", defaultValue: true },

				/**
				 * Define the value.
				 *
				 * If the value is lower/higher than the allowed minimum/maximum, the value of the properties <code>min<code>/<code>max</code> are used instead.
				 */
				value: { type: "float", group: "Data", defaultValue: 0 },

				/**
				 * Indicate whether the handle tooltip is shown.
				 * @since 1.31
				 *
				 */
				showHandleTooltip: { type: "boolean", group: "Appearance", defaultValue: true }
			},
			associations: {

				/**
				 * Association to controls / IDs which label this control (see WAI-ARIA attribute <code>aria-labelledby</code>).
				 * @since 1.27.0
				 */
				ariaLabelledBy: { type: "sap.ui.core.Control", multiple: true, singularName: "ariaLabelledBy" }
			},
			events: {

				/**
				 * This event is triggered after the end user finishes interacting, if there is any change.
				 */
				change: {
					parameters: {

						/**
						 * The current value of the slider after a change.
						 */
						value: { type: "float" }
					}
				},

				/**
				 * This event is triggered during the dragging period, each time the slider value changes.
				 */
				liveChange: {
					parameters: {

						/**
						 * The current value of the slider after a live change.
						 */
						value: { type: "float" }
					}
				}
			}
		}});

		EnabledPropagator.apply(Slider.prototype, [true]);

		/* =========================================================== */
		/* Private methods and properties                              */
		/* =========================================================== */

		/* ----------------------------------------------------------- */
		/* Private methods                                             */
		/* ----------------------------------------------------------- */

		/**
		 * Convert <code>fValue</code> for RTL-Mode.
		 *
		 * @param {float} fValue input value
		 * @private
		 * @returns {float} output value
		 */
		Slider.prototype._convertValueToRtlMode = function(fValue) {
			return this.getMax() - fValue + this.getMin();
		};

		/**
		 * Recalculate some styles.
		 *
		 * @private
		 */
		Slider.prototype._recalculateStyles = function() {
			var $Slider = this.$();
			this._fSliderWidth = $Slider.width();
			this._fSliderPaddingLeft = parseFloat($Slider.css("padding-left"));
			this._fSliderOffsetLeft = $Slider.offset().left;
			this._fHandleWidth = this.$("handle").width();
		};

		/**
		 * Checks whether the minimum is lower than or equal to the maximum and
		 * whether the step is bigger than slider range.
		 *
		 * @private
		 * @returns {boolean}
		 */
		Slider.prototype._validateProperties = function() {
			var fMin = this.getMin(),
				fMax = this.getMax(),
				fStep = this.getStep(),
				bMinbiggerThanMax = false,
				bError = false;

			// if the minimum is lower than or equal to the maximum, log a warning
			if (fMin >= fMax) {
				bMinbiggerThanMax = true;
				bError = true;
				jQuery.sap.log.warning("Warning: " + "Property wrong min: " + fMin + " >= max: " + fMax + " on ", this);
			}

			// if the step is negative or 0, set to 1 and log a warning
			if (fStep <= 0) {
				jQuery.sap.log.warning("Warning: " + "The step could not be negative on ", this);
				fStep = 1;

				// update the step to 1 and suppress re-rendering
				this.setProperty("step", fStep, true);
			}

			// the step can't be bigger than slider range, log a warning
			if (fStep > (fMax - fMin) && !bMinbiggerThanMax) {
				bError = true;
				jQuery.sap.log.warning("Warning: " + "Property wrong step: " + fStep + " > max: " + fMax + " - " + "min: " + fMin + " on ", this);
			}

			return bError;
		};

		/**
		 * Calculate percentage.
		 *
		 * @param {float} fValue
		 * @private
		 * @returns {float} percent
		 */
		Slider.prototype._getPercentOfValue = function(fValue) {
			var fMin = this.getMin();
			return (((fValue - fMin) / (this.getMax() - fMin)) * 100);
		};

		/**
		 * Checks whether the given step is of the proper type.
		 *
		 * @param {int} iStep
		 * @private
		 * @returns {int}
		 */
		Slider.prototype._validateStep = function(iStep) {
			if (typeof iStep === "undefined") {
				return 1;	// default n = 1
			}

			if (typeof iStep !== "number") {
				jQuery.sap.log.warning('Warning: "iStep" needs to be a number', this);
				return 0;
			}

			if ((Math.floor(iStep) === iStep) && isFinite(iStep)) {
				return iStep;
			}

			jQuery.sap.log.warning('Warning: "iStep" needs to be a finite interger', this);

			return 0;
		};

		Slider.prototype.getDecimalPrecisionOfNumber = function(fValue) {

			// the value is an integer
			if (Math.floor(fValue) === fValue) {
				return 0;
			}

			var sValue = fValue.toString(),
				iIndexOfDot = sValue.indexOf("."),
				iIndexOfENotation = sValue.indexOf("e-"),
				bIndexOfENotationFound = iIndexOfENotation !== -1, // the "e-" is found in the value
				bIndexOfDotFound = iIndexOfDot !== -1;	// the "." is found in the value

			// note: numbers such as 0.0000005 are represented using the e-notation
			// (for example, 0.0000005 becomes 5e-7)
			if (bIndexOfENotationFound) {

				var iENotationExponent = +sValue.slice(iIndexOfENotation + 2);

				if (bIndexOfDotFound) {
					return iENotationExponent + sValue.slice(iIndexOfDot + 1, iIndexOfENotation).length;
				}

				return iENotationExponent;
			}

			if (bIndexOfDotFound) {
				return sValue.length - iIndexOfDot - 1;
			}

			return 0;
		};

		/**
		 * Sets the <code>value</code>.
		 *
		 * @see sap.m.Slider#setValue
		 * @param {float} fValue new value for property <code>value</code>.
		 * @param {object} [mOptions.snapValue=true]
		 * @returns {sap.m.Slider} <code>this</code> to allow method chaining.
		 * @private
		 */
		Slider.prototype._setValue = function(fNewValue, mOptions) {
			var fMin = this.getMin(),
				fMax = this.getMax(),
				fStep = this.getStep(),
				fValue = this.getValue(),
				sNewValueFixedPoint,
				bSnapValue = true,
				fModStepVal;

			if (mOptions) {
				bSnapValue = !!mOptions.snapValue;
			}

			// validate the new value before arithmetic calculations
			if (typeof fNewValue !== "number" || !isFinite(fNewValue)) {
				jQuery.sap.log.error("Error:", '"fNewValue" needs to be a finite number on ', this);
				return this;
			}

			fModStepVal = Math.abs((fNewValue - fMin) % fStep);

			if (bSnapValue && (fModStepVal !== 0) /* division with remainder */) {

				// adjust the new value to the nearest step
				fNewValue = fModStepVal * 2 >= fStep ? fNewValue + fStep - fModStepVal : fNewValue - fModStepVal;
			}

			// constrain the new value between the minimum and maximum
			if (fNewValue < fMin) {
				fNewValue = fMin;
			} else if (fNewValue > fMax) {
				fNewValue = fMax;
			}

			sNewValueFixedPoint = this.toFixed(fNewValue, this.getDecimalPrecisionOfNumber(fStep));
			fNewValue = Number(sNewValueFixedPoint);

			// update the value and suppress re-rendering
			this.setProperty("value", fNewValue, true);

			// update the value in DOM only when it has changed
			if (fValue !== this.getValue()) {
				this.setDomValue(sNewValueFixedPoint);
			}

			return this;
		};

		/**
		 * Formats the <code>fNumber</code> using the fixed-point notation.
		 *
		 * <b>Note:</b> The number of digits to appear after the decimal point of the value
		 * should be between 0 and 20 to avoid a RangeError when calling the <code>Number.toFixed()</code> method.
		 *
		 * @param {float} fNumber The number to format.
		 * @param {int} [iDigits] The number of digits to appear after the decimal point.
		 * @returns {string} A string representation of <code>fNumber</code> that does not use exponential notation.
		 * @private
		 */
		Slider.prototype.toFixed = function(fNumber, iDigits) {

			if (iDigits === undefined) {
				iDigits = this.getDecimalPrecisionOfNumber(fNumber);
			}

			if (iDigits > 20) {
				iDigits = 20;
			} else if (iDigits < 0) {
				iDigits = 0;
			}

			// note: .toFixed() does not return a string when the number is negative
			return fNumber.toFixed(iDigits) + "";
		};

		Slider.prototype.setDomValue = function(sNewValue) {
			var oDomRef = this.getDomRef();

			if (!oDomRef) {
				return;
			}

			// note: round negative percentages to 0
			var sPerValue = Math.max(this._getPercentOfValue(+sNewValue), 0) + "%",
				oHandleDomRef = this.getDomRef("handle");

			if (!!this.getName()) {
				this.getDomRef("input").setAttribute("value", sNewValue);
			}

			if (this.getProgress()) {

				// update the progress indicator
				this.getDomRef("progress").style.width = sPerValue;
			}

			// update the position of the handle
			oHandleDomRef.style[sap.ui.getCore().getConfiguration().getRTL() ? "right" : "left"] = sPerValue;

			if (this.getShowHandleTooltip()) {

				// update the tooltip
				oHandleDomRef.title = sNewValue;
			}

			// update the ARIA attribute value
			oHandleDomRef.setAttribute("aria-valuenow", sNewValue);
		};

		/**
		 * Gets the closest handle to a <code>touchstart</code> event.
		 *
		 * @returns {object} The nearest handle DOM reference.
		 */
		Slider.prototype.getClosestHandleDomRef = function() {

			// there is only one handle, it is always the nearest
			return this.getDomRef("handle");
		};

		/**
		 * Increase the value of the slider by the given <code>fIncrement</code>.
		 *
		 * @param {int} [fIncrement=1]
		 * @private
		 */
		Slider.prototype._increaseValueBy = function(fIncrement) {
			var fValue,
				fNewValue;

			if (this.getEnabled()) {
				fValue = this.getValue();
				this.setValue(fValue + (fIncrement || 1));
				fNewValue = this.getValue();

				if (fValue < fNewValue) {
					this._fireChangeAndLiveChange({ value: fNewValue });
				}
			}
		};

		/**
		 * Decrease the value of the slider by the given <code>fDecrement</code>.
		 *
		 * @param {int} [fDecrement=1]
		 * @private
		 */
		Slider.prototype._decreaseValueBy = function(fDecrement) {
			var fValue,
				fNewValue;

			if (this.getEnabled()) {
				fValue = this.getValue();
				this.setValue(fValue - (fDecrement || 1));
				fNewValue = this.getValue();

				if (fValue > fNewValue) {
					this._fireChangeAndLiveChange({ value: fNewValue });
				}
			}
		};

		Slider.prototype._getLongStep = function() {
			var fMin = this.getMin(),
				fMax = this.getMax(),
				fStep = this.getStep(),
				fLongStep = (fMax - fMin) / 10,
				iStepsFromMinToMax = (fMax - fMin) / fStep;

			return iStepsFromMinToMax > 10 ? fLongStep : fStep;
		};

		Slider.prototype._fireChangeAndLiveChange = function(oParam) {
			this.fireChange(oParam);
			this.fireLiveChange(oParam);
		};

		Slider.prototype._hasFocus = function() {
			return document.activeElement === this.getFocusDomRef();
		};

		/* =========================================================== */
		/* Lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * This event handler is called before the rendering of the control is started.
		 */
		Slider.prototype.onBeforeRendering = function() {

			var bError = this._validateProperties();

			// update the value only if there aren't errors
			if (!bError) {
				this.setValue(this.getValue());

				// this is the current % value of the progress bar
				// note: round negative percentages to 0
				this._sProgressValue = Math.max(this._getPercentOfValue(this.getValue()), 0) + "%";
			}

			if (!this._hasFocus()) {
				this._fInitialFocusValue = this.getValue();
			}
		};

		/* =========================================================== */
		/* Event handlers                                              */
		/* =========================================================== */

		/**
		 * Handles the <code>touchstart</code> event.
		 *
		 * @param {jQuery.Event} oEvent The event object.
		 */
		Slider.prototype.ontouchstart = function(oEvent) {
			var fMin = this.getMin(),
				oTouch = oEvent.targetTouches[0],
				fNewValue,
				CSS_CLASS = this.getRenderer().CSS_CLASS,
				sEventNamespace = "." + CSS_CLASS;

			// mark the event for components that needs to know if the event was handled
			oEvent.setMarked();

			// only process single touches
			if (oEvent.targetTouches.length > 1 ||
				!this.getEnabled() ||

				// detect which mouse button caused the event and only process the standard click
				// (this is usually the left button, oEvent.button === 0 for standard click)
				// note: if the current event is a touch event oEvent.button property will be not defined
				oEvent.button) {

				return;
			}

			// registers event listeners
			jQuery(document).on("touchend" + sEventNamespace + " touchcancel" + sEventNamespace + " mouseup" + sEventNamespace, this._ontouchend.bind(this))
							.on(oEvent.originalEvent.type === "touchstart" ? "touchmove" + sEventNamespace : "touchmove" + sEventNamespace + " mousemove" + sEventNamespace, this._ontouchmove.bind(this));

			var oNearestHandleDomRef = this.getClosestHandleDomRef();

			if (oTouch.target !== oNearestHandleDomRef) {

				// set the focus to the nearest slider handle
				jQuery.sap.delayedCall(0, oNearestHandleDomRef, "focus");
			}

			if (!this._hasFocus()) {
				this._fInitialFocusValue = this.getValue();
			}

			// recalculate some styles,
			// those values may change when the device orientation changes
			this._recalculateStyles();
			this._fDiffX = this._fSliderPaddingLeft;
			this._fInitialValue = this.getValue();

			// add active state
			this.$("inner").addClass(CSS_CLASS + "Pressed");

			if (oTouch.target === this.getDomRef("handle")) {

				this._fDiffX = (oTouch.pageX - jQuery(oNearestHandleDomRef).offset().left) + this._fSliderPaddingLeft - (this._fHandleWidth / 2);
			} else {

				fNewValue = (((oTouch.pageX - this._fSliderPaddingLeft - this._fSliderOffsetLeft) / this._fSliderWidth) * (this.getMax() - fMin)) +  fMin;

				if (sap.ui.getCore().getConfiguration().getRTL()) {
					fNewValue = this._convertValueToRtlMode(fNewValue);
				}

				// update the value
				this.setValue(fNewValue);

				// new validated value
				fNewValue = this.getValue();

				if (this._fInitialValue !== fNewValue) {
					this.fireLiveChange({ value: fNewValue });
				}
			}
		};

		/**
		 * Handles the <code>touchmove</code> event.
		 *
		 * @param {jQuery.Event} oEvent The event object.
		 * @private
		 */
		Slider.prototype._ontouchmove = function(oEvent) {

			// mark the event for components that needs to know if the event was handled
			oEvent.setMarked();

			// note: prevent native document scrolling
			oEvent.preventDefault();

			// suppress the emulated mouse event from touch interfaces
			if (oEvent.isMarked("delayedMouseEvent") ||
				!this.getEnabled() ||

				// detect which mouse button caused the event and only process the standard click
				// (this is usually the left button, oEvent.button === 0 for standard click)
				// note: if the current event is a touch event oEvent.button property will be not defined
				oEvent.button) {

				return;
			}

			var fMin = this.getMin(),
				fValue = this.getValue(),
				iPageX = oEvent.targetTouches ? oEvent.targetTouches[0].pageX : oEvent.pageX,
				fNewValue = (((iPageX - this._fDiffX - this._fSliderOffsetLeft) / this._fSliderWidth) * (this.getMax() - fMin)) +  fMin;

			// RTL mirror
			if (sap.ui.getCore().getConfiguration().getRTL()) {
				fNewValue = this._convertValueToRtlMode(fNewValue);
			}

			this.setValue(fNewValue);

			// validated value
			fNewValue = this.getValue();

			if (fValue !== fNewValue) {
				this.fireLiveChange({ value: fNewValue });
			}
		};

		/**
		 * Handles the <code>touchend</code> event.
		 *
		 * @param {jQuery.Event} oEvent The event object.
		 * @private
		 */
		Slider.prototype._ontouchend = function(oEvent) {
			var CSS_CLASS = this.getRenderer().CSS_CLASS,
				sEventNamespace = "." + CSS_CLASS;

			// mark the event for components that needs to know if the event was handled
			oEvent.setMarked();

			// suppress the emulated mouse event from touch interfaces
			if (oEvent.isMarked("delayedMouseEvent") ||
				!this.getEnabled() ||

				// detect which mouse button caused the event and only process the standard click
				// (this is usually the left button, oEvent.button === 0 for standard click)
				// note: if the current event is a touch event oEvent.button property will be not defined
				oEvent.button) {

				return;
			}

			// removes the registered event listeners
			jQuery(document).off(sEventNamespace);

			var fValue = this.getValue();

			// remove the active state
			this.$("inner").removeClass(CSS_CLASS + "Pressed");

			if (this._fInitialValue !== fValue) {
				this.fireChange({ value: fValue });
			}
		};

		/* ----------------------------------------------------------- */
		/* Keyboard handling                                           */
		/* ----------------------------------------------------------- */

		/**
		 * Handles the <code>sapincrease</code> event when right arrow or up arrow is pressed.
		 *
		 * @param {jQuery.Event} oEvent The event object.
		 */
		Slider.prototype.onsapincrease = function(oEvent) {
			var fValue,
				fNewValue;

			// note: prevent document scrolling when arrow keys are pressed
			oEvent.preventDefault();

			// mark the event for components that needs to know if the event was handled
			oEvent.setMarked();

			if (this.getEnabled()) {
				fValue = this.getValue();
				this.stepUp(1);
				fNewValue = this.getValue();

				if (fValue < fNewValue) {
					this._fireChangeAndLiveChange({ value: fNewValue });
				}
			}
		};

		/**
		 * Handles the <code>sapincreasemodifiers</code> event when Ctrl + right arrow or up arrow are pressed.
		 *
		 * @param {jQuery.Event} oEvent The event object.
		 */
		Slider.prototype.onsapincreasemodifiers = function(oEvent) {

			// note: prevent document scrolling when arrow keys are pressed
			oEvent.preventDefault();

			// mark the event for components that needs to know if the event was handled
			oEvent.setMarked();

			this._increaseValueBy(this._getLongStep());
		};

		/**
		 * Handles the <code>sapdecrease</code> event when left arrow or down arrow are pressed.
		 *
		 * @param {jQuery.Event} oEvent The event object.
		 */
		Slider.prototype.onsapdecrease = function(oEvent) {
			var fValue,
				fNewValue;

			// note: prevent document scrolling when arrow keys are pressed
			oEvent.preventDefault();

			// mark the event for components that needs to know if the event was handled
			oEvent.setMarked();

			if (this.getEnabled()) {
				fValue = this.getValue();
				this.stepDown(1);
				fNewValue = this.getValue();

				if (fValue > fNewValue) {
					this._fireChangeAndLiveChange({ value: fNewValue });
				}
			}
		};

		/**
		 * Handles the <code>sapdecreasemodifiers</code> event when Ctrl + left or Ctrl + down keys are pressed.
		 *
		 * @param {jQuery.Event} oEvent The event object.
		 */
		Slider.prototype.onsapdecreasemodifiers = function(oEvent) {

			// note: prevent document scrolling when arrow keys are pressed
			oEvent.preventDefault();

			// mark the event for components that needs to know if the event was handled
			oEvent.setMarked();

			this._decreaseValueBy(this._getLongStep());
		};

		/**
		 * Handles the <code>onsapplus</code> event when "+" is pressed.
		 *
		 * @param {jQuery.Event} oEvent The event object.
		 */
		Slider.prototype.onsapplus = function(oEvent) {
			var fValue,
				fNewValue;

			// mark the event for components that needs to know if the event was handled
			oEvent.setMarked();

			if (this.getEnabled()) {

				fValue = this.getValue();
				this.stepUp(1);
				fNewValue = this.getValue();

				if (fValue < fNewValue) {
					this._fireChangeAndLiveChange({ value: fNewValue });
				}
			}
		};

		/**
		 * Handles the <code>sapminus</code> event when "-" is pressed.
		 *
		 * @param {jQuery.Event} oEvent The event object.
		 */
		Slider.prototype.onsapminus = function(oEvent) {
			var fValue,
				fNewValue;

			// mark the event for components that needs to know if the event was handled
			oEvent.setMarked();

			if (this.getEnabled()) {

				fValue = this.getValue();
				this.stepDown(1);
				fNewValue = this.getValue();

				if (fValue > fNewValue) {
					this._fireChangeAndLiveChange({ value: fNewValue });
				}
			}
		};

		/**
		 * Handles the <code>sappageup</code> event when page up is pressed.
		 *
		 * @param {jQuery.Event} oEvent The event object.
		 */
		Slider.prototype.onsappageup = Slider.prototype.onsapincreasemodifiers;

		/**
		 * Handles the <code>sappagedown</code> event when when page down is pressed.
		 *
		 * @param {jQuery.Event} oEvent The event object.
		 */
		Slider.prototype.onsappagedown = Slider.prototype.onsapdecreasemodifiers;

		/**
		 * Handles the <code>saphome</code> event when home key is pressed.
		 *
		 * @param {jQuery.Event} oEvent The event object.
		 */
		Slider.prototype.onsaphome = function(oEvent) {

			// mark the event for components that needs to know if the event was handled
			oEvent.setMarked();

			var fMin = this.getMin();

			// note: prevent document scrolling when Home key is pressed
			oEvent.preventDefault();

			if (this.getEnabled() && this.getValue() > fMin) {
				this.setValue(fMin);
				this._fireChangeAndLiveChange({ value: fMin });
			}
		};

		/**
		 * Handles the <code>sapend</code> event when the End key pressed.
		 *
		 * @param {jQuery.Event} oEvent The event object.
		 */
		Slider.prototype.onsapend = function(oEvent) {

			// mark the event for components that needs to know if the event was handled
			oEvent.setMarked();

			var fMax = this.getMax();

			// note: prevent document scrolling when End key is pressed
			oEvent.preventDefault();

			if (this.getEnabled() && this.getValue() < fMax) {
				this.setValue(fMax);
				this._fireChangeAndLiveChange({ value: fMax });
			}
		};

		/**
		 * Handles the <code>saptabnext</code> event when the tab key is pressed.
		 *
		 */
		Slider.prototype.onsaptabnext = function() {
			this._fInitialFocusValue = this.getValue();
		};

		/**
		 * Handles the <code>saptabprevious</code> event when the shift + tab keys are pressed.
		 *
		 */
		Slider.prototype.onsaptabprevious = function() {
			this._fInitialFocusValue = this.getValue();
		};

		/**
		 * Handles the <code>sapescape</code> event when escape key is pressed.
		 *
		 */
		Slider.prototype.onsapescape = function() {

			// reset the slider back to the value
			// which it had when it got the focus
			this.setValue(this._fInitialFocusValue);
		};

		/* =========================================================== */
		/* API method                                                  */
		/* =========================================================== */

		/* ----------------------------------------------------------- */
		/* Public methods                                              */
		/* ----------------------------------------------------------- */

		Slider.prototype.getFocusDomRef = function() {
			return this.getDomRef("handle");
		};

		/**
		 * Increments the value by multiplying the <code>step</code> with the given parameter.
		 *
		 * @param {int} [iStep=1] The number of steps the slider goes up.
		 * @returns {sap.m.Slider} <code>this</code> to allow method chaining.
		 * @type sap.m.Slider
		 * @public
		 */
		Slider.prototype.stepUp = function(iStep) {
			return this.setValue(this.getValue() + (this._validateStep(iStep) * this.getStep()), { snapValue: false });
		};

		/**
		 * Decrements the value by multiplying the step the <code>step</code> with the given parameter.
		 *
		 * @param {int} [iStep=1] The number of steps the slider goes down.
		 * @returns {sap.m.Slider} <code>this</code> to allow method chaining.
		 * @type sap.m.Slider
		 * @public
		 */
		Slider.prototype.stepDown = function(iStep) {
			return this.setValue(this.getValue() - (this._validateStep(iStep) * this.getStep()), { snapValue: false });
		};

		/**
		 * Sets the property <code>value</code>.
		 *
		 * Default value is <code>0</code>.
		 *
		 * @param {float} fNewValue new value for property <code>value</code>.
		 * @returns {sap.m.Slider} <code>this</code> to allow method chaining.
		 * @public
		 */
		Slider.prototype.setValue = function(fNewValue) {

			// note: setValue() method sometimes is called, before the step,
			// max and min properties are set, due the value of the slider
			// needs to be updated in onBeforeRendering()
			this.setValue = this._setValue;

			// update the value and suppress re-rendering
			return this.setProperty("value", fNewValue, true);
		};

		return Slider;

	}, /* bExport= */ true);