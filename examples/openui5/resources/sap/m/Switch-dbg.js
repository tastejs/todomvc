/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.m.Switch.
sap.ui.define(['jquery.sap.global', './library', 'sap/ui/core/Control', 'sap/ui/core/EnabledPropagator', 'sap/ui/core/IconPool', 'sap/ui/core/theming/Parameters'],
	function(jQuery, library, Control, EnabledPropagator, IconPool, Parameters) {
		"use strict";

		/**
		 * Constructor for a new Switch.
		 *
		 * @param {string} [sId] id for the new control, generated automatically if no id is given
		 * @param {object} [mSettings] initial settings for the new control
		 *
		 * @class
		 * A switch is a user interface control on mobile devices that is used for change between binary states. The user can also drag the button handle or tap to change the state.
		 * @extends sap.ui.core.Control
		 *
		 * @author SAP SE
		 * @version 1.32.9
		 *
		 * @constructor
		 * @public
		 * @alias sap.m.Switch
		 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
		 */
		var Switch = Control.extend("sap.m.Switch", /** @lends sap.m.Switch.prototype */ { metadata: {

			library: "sap.m",
			properties: {

				/**
				 * A boolean value indicating whether the switch is on or off.
				 */
				state: { type: "boolean", group: "Misc", defaultValue: false },

				/**
				 * Custom text for the "ON" state.
				 *
				 * "ON" translated to the current language is the default value.
				 * Beware that the given text will be cut off after three characters.
				 */
				customTextOn: { type: "string", group: "Misc", defaultValue: "" },

				/**
				 * Custom text for the "OFF" state.
				 *
				 * "OFF" translated to the current language is the default value.
				 * Beware that the given text will be cut off after three characters.
				 */
				customTextOff: { type: "string", group: "Misc", defaultValue: "" },

				/**
				 * Whether the switch is enabled.
				 */
				enabled: { type: "boolean", group: "Data", defaultValue: true },

				/**
				 * The name to be used in the HTML code for the switch (e.g. for HTML forms that send data to the server via submit).
				 */
				name: { type: "string", group: "Misc", defaultValue: "" },

				/**
				 * Type of a Switch. Possibles values "Default", "AcceptReject".
				 */
				type: { type : "sap.m.SwitchType", group: "Appearance", defaultValue: sap.m.SwitchType.Default }
			},
			associations: {

				/**
				 * Association to controls / ids which label this control (see WAI-ARIA attribute aria-labelledby).
				 * @since 1.27.0
				 */
				ariaLabelledBy: { type: "sap.ui.core.Control", multiple: true, singularName: "ariaLabelledBy" }
			},
			events: {

				/**
				 * Triggered when a switch changes the state.
				 */
				change: {
					parameters: {

						/**
						 * The new state of the switch.
						 */
						state: { type: "boolean" }
					}
				}
			}
		}});

		IconPool.insertFontFaceStyle();
		EnabledPropagator.apply(Switch.prototype, [true]);

		/* =========================================================== */
		/* Internal methods and properties                             */
		/* =========================================================== */

		/**
		 * Slide the switch.
		 *
		 * @private
		 */
		Switch.prototype._slide = function(iPosition) {
			if (iPosition > Switch._OFFPOSITION) {
				iPosition = Switch._OFFPOSITION;
			} else if (iPosition < Switch._ONPOSITION) {
				iPosition = Switch._ONPOSITION;
			}

			if (this._iCurrentPosition === iPosition) {
				return;
			}

			this._iCurrentPosition = iPosition;
			this.getDomRef("inner").style[sap.ui.getCore().getConfiguration().getRTL() ? "right" : "left"] = iPosition + "px";
			this._setTempState(Math.abs(iPosition) < Switch._SWAPPOINT);
		};

		Switch.prototype._setTempState = function(b) {
			if (this._bTempState === b) {
				return;
			}

			this._bTempState = b;
			this.getDomRef("handle").setAttribute("data-sap-ui-swt", b ? this._sOn : this._sOff);
		};

		Switch.prototype._setDomState = function(bState) {
			var CSS_CLASS = this.getRenderer().CSS_CLASS,
				sState = bState ? this._sOn : this._sOff,
				oDomRef = this.getDomRef();

			if (!oDomRef) {
				return;
			}

			var $Switch = this.$("switch"),
				oSwitchInnerDomRef = this.getDomRef("inner"),
				oHandleDomRef = this.getDomRef("handle"),
				oCheckboxDomRef = null;

			if (this.getName()) {
				oCheckboxDomRef = this.getDomRef("input");
				oCheckboxDomRef.setAttribute("checked", bState);
				oCheckboxDomRef.setAttribute("value", sState);
			}

			oHandleDomRef.setAttribute("data-sap-ui-swt", sState);

			if (bState) {
				$Switch.removeClass(CSS_CLASS + "Off").addClass(CSS_CLASS + "On");
				oDomRef.setAttribute("aria-checked", "true");
			} else {
				$Switch.removeClass(CSS_CLASS + "On").addClass(CSS_CLASS + "Off");
				oDomRef.setAttribute("aria-checked", "false");
			}

			$Switch.addClass(CSS_CLASS + "Trans");

			// remove inline styles
			oSwitchInnerDomRef.style.cssText = "";
		};

		Switch.prototype.getInvisibleElementId = function() {
			return this.getId() + "-invisible";
		};

		Switch.prototype.getInvisibleElementText = function() {
			var sText = "";

			switch (this.getType()) {
				case sap.m.SwitchType.Default:

					if (!this.getCustomTextOn()) {
						sText = "SWITCH_ON";
					}

					break;

				case sap.m.SwitchType.AcceptReject:
					sText = "SWITCH_ARIA_ACCEPT";
					break;

				// no default
			}

			return sText;
		};

		// the milliseconds takes the transition from one state to another
		Switch._TRANSITIONTIME = Number(Parameters.get("sapMSwitch-TRANSITIONTIME")) || 0;

		// the position of the inner HTML element whether the switch is "ON"
		Switch._ONPOSITION = Number(Parameters.get("sapMSwitch-ONPOSITION"));

		// the position of the inner HTML element whether the switch is "OFF"
		Switch._OFFPOSITION = Number(Parameters.get("sapMSwitch-OFFPOSITION"));

		// swap point
		Switch._SWAPPOINT = Math.abs((Switch._ONPOSITION - Switch._OFFPOSITION) / 2);

		// resource bundle
		Switch._oRb = sap.ui.getCore().getLibraryResourceBundle("sap.m");

		/* =========================================================== */
		/* Lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Required adaptations before rendering.
		 *
		 * @private
		 */
		Switch.prototype.onBeforeRendering = function() {
			var Swt = Switch;

			this._sOn = this.getCustomTextOn() || Swt._oRb.getText("SWITCH_ON");
			this._sOff = this.getCustomTextOff() || Swt._oRb.getText("SWITCH_OFF");
		};

		/* =========================================================== */
		/* Event handlers                                              */
		/* =========================================================== */

		/**
		 * Handle the touch start event happening on the switch.
		 *
		 * @param {jQuery.Event} oEvent The event object.
		 * @private
		 */
		Switch.prototype.ontouchstart = function(oEvent) {
			var oTargetTouch = oEvent.targetTouches[0],
				CSS_CLASS = this.getRenderer().CSS_CLASS,
				$SwitchInner = this.$("inner");

			// mark the event for components that needs to know if the event was handled by the Switch
			oEvent.setMarked();

			// only process single touches (only the first active touch point)
			if (sap.m.touch.countContained(oEvent.touches, this.getId()) > 1 ||
				!this.getEnabled() ||

				// detect which mouse button caused the event and only process the standard click
				// (this is usually the left button, oEvent.button === 0 for standard click)
				// note: if the current event is a touch event oEvent.button property will be not defined
				oEvent.button) {

				return;
			}

			// track the id of the first active touch point
			this._iActiveTouchId = oTargetTouch.identifier;

			this._bTempState = this.getState();
			this._iStartPressPosX = oTargetTouch.pageX;
			this._iPosition = $SwitchInner.position().left;

			// track movement to determine if the interaction was a click or a tap
			this._bDragging = false;

			// note: force ie browsers to set the focus to switch
			jQuery.sap.delayedCall(0, this, "focus");

			// add active state
			this.$("switch").addClass(CSS_CLASS + "Pressed")
							.removeClass(CSS_CLASS + "Trans");
		};

		/**
		 * Handle the touch move event on the switch.
		 *
		 * @param {jQuery.Event} oEvent The event object.
		 * @private
		 */
		Switch.prototype.ontouchmove = function(oEvent) {

			// mark the event for components that needs to know if the event was handled by the Switch
			oEvent.setMarked();

			// note: prevent native document scrolling
			oEvent.preventDefault();

			var oTouch,
				iPosition,
				fnTouch = sap.m.touch;

			if (!this.getEnabled() ||

				// detect which mouse button caused the event and only process the standard click
				// (this is usually the left button, oEvent.button === 0 for standard click)
				// note: if the current event is a touch event oEvent.button property will be not defined
				oEvent.button) {

				return;
			}

			// only process single touches (only the first active touch point),
			// the active touch has to be in the list of touches
			jQuery.sap.assert(fnTouch.find(oEvent.touches, this._iActiveTouchId), "missing touchend");

			// find the active touch point
			oTouch = fnTouch.find(oEvent.changedTouches, this._iActiveTouchId);

			// only process the active touch
			if (!oTouch ||

				// note: do not rely on a specific granularity of the touchmove event.
				// On windows 8 surfaces, the touchmove events are dispatched even if
				// the user doesn’t move the touch point along the surface.
				oTouch.pageX === this._iStartPressPosX) {

				return;
			}

			// interaction was not a click or a tap
			this._bDragging = true;

			iPosition = ((this._iStartPressPosX - oTouch.pageX) * -1) + this._iPosition;

			// RTL mirror
			if (sap.ui.getCore().getConfiguration().getRTL()) {
				iPosition = -iPosition;
			}

			this._slide(iPosition);
		};

		/**
		 * Handle the touch end event on the switch.
		 *
		 * @param {jQuery.Event} oEvent The event object.
		 * @private
		 */
		Switch.prototype.ontouchend = function(oEvent) {

			// mark the event for components that needs to know if the event was handled by the Switch
			oEvent.setMarked();

			var oTouch,
				fnTouch = sap.m.touch,
				assert = jQuery.sap.assert;

			if (!this.getEnabled() ||

				// detect which mouse button caused the event and only process the standard click
				// (this is usually the left button, oEvent.button === 0 for standard click)
				// note: if the current event is a touch event oEvent.button property will be not defined
				oEvent.button) {

				return;
			}

			// only process single touches (only the first active touch)
			assert(this._iActiveTouchId !== undefined, "expect to already be touching");

			// find the active touch point
			oTouch = fnTouch.find(oEvent.changedTouches, this._iActiveTouchId);

			// process this event only if the touch we're tracking has changed
			if (oTouch) {

				// the touchend for the touch we're monitoring
				assert(!fnTouch.find(oEvent.touches, this._iActiveTouchId), "touchend still active");

				// remove active state
				this.$("switch").removeClass(this.getRenderer().CSS_CLASS + "Pressed");

				// note: update the DOM before the change event is fired for better user experience
				this._setDomState(this._bDragging ? this._bTempState : !this.getState());

				// fire the change event after the CSS transition is completed
				jQuery.sap.delayedCall(Switch._TRANSITIONTIME, this, function() {
					var bState = this.getState();

					// change the state
					this.setState(this._bDragging ? this._bTempState : !bState);

					if (bState !== this.getState()) {
						this.fireChange({ state: this.getState() });
					}
				});
			}
		};

		/**
		 * Handle the touchcancel event on the switch.
		 *
		 * @param {jQuery.Event} oEvent The event object.
		 * @private
		 */
		Switch.prototype.ontouchcancel = Switch.prototype.ontouchend;

		/**
		 *  Handle when the space or enter key are pressed.
		 *
		 * @param {jQuery.Event} oEvent The event object.
		 * @private
		 */
		Switch.prototype.onsapselect = function(oEvent) {
			var bState;

			if (this.getEnabled()) {

				// mark the event for components that needs to know if the event was handled by the Switch
				oEvent.setMarked();

				// note: prevent document scrolling when space keys is pressed
				oEvent.preventDefault();

				this.setState(!this.getState());

				bState = this.getState();

				// fire the change event after the CSS transition is completed
				jQuery.sap.delayedCall(Switch._TRANSITIONTIME, this, function() {
					this.fireChange({ state: bState });
				});
			}
		};

		/* =========================================================== */
		/* API method                                                  */
		/* =========================================================== */

		/**
		 * Change the switch state between on and off.
		 *
		 * @param {boolean} bState
		 * @public
		 * @return {sap.m.Switch} <code>this</code> to allow method chaining.
		 */
		Switch.prototype.setState = function(bState) {
			this.setProperty("state", bState, true);
			this._setDomState(this.getState());
			return this;
		};

		return Switch;

	}, /* bExport= */ true);