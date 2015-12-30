/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.m.RatingIndicator.
sap.ui.define(['jquery.sap.global', './library', 'sap/ui/core/Control', 'sap/ui/core/IconPool', 'sap/ui/core/theming/Parameters'],
	function(jQuery, library, Control, IconPool, Parameters) {
	"use strict";



	/**
	 * Constructor for a new RatingIndicator.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * Is used to rate content. The amount of rating symbols can be specified, as well as the URIs to the
	 * image icons which shall be used as rating symbols. When the user performs a rating, an event is fired.
	 * @extends sap.ui.core.Control
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @since 1.14
	 * @alias sap.m.RatingIndicator
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var RatingIndicator = Control.extend("sap.m.RatingIndicator", /** @lends sap.m.RatingIndicator.prototype */ { metadata : {

		library : "sap.m",
		properties : {
			/**
			 * Value "true" is required to let the user rate with this control. It is recommended to set this parameter to "false" for the "Small" size which is meant for indicating a value only
			 */
			enabled : {type : "boolean", group : "Behavior", defaultValue : true},

			/**
			 * The number of displayed rating symbols
			 */
			maxValue : {type : "int", group : "Behavior", defaultValue : 5},

			/**
			 * The indicated value of the rating
			 */
			value : {type : "float", group : "Behavior", defaultValue : 0, bindable : "bindable"},

			/**
			 * The Size of the image or icon to be displayed. The default value depends on the theme. Please be sure that the size is corresponding to a full pixel value as some browsers don't support subpixel calculations. Recommended size is 1.375rem (22px) for normal, 1rem (16px) for small, and 2rem (32px) for large icons correspondingly.
			 */
			iconSize : {type : "sap.ui.core.CSSSize", group : "Behavior", defaultValue : null},

			/**
			 * The URI to the icon font icon or image that will be displayed for selected rating symbols. A star icon will be used if the property is not set
			 */
			iconSelected : {type : "sap.ui.core.URI", group : "Behavior", defaultValue : null},

			/**
			 * The URI to the icon font icon or image that will be displayed for all unselected rating symbols. A star icon will be used if the property is not set
			 */
			iconUnselected : {type : "sap.ui.core.URI", group : "Behavior", defaultValue : null},

			/**
			 * The URI to the icon font icon or image that will be displayed for hovered rating symbols. A star icon will be used if the property is not set
			 */
			iconHovered : {type : "sap.ui.core.URI", group : "Behavior", defaultValue : null},

			/**
			 * Defines how float values are visualized: Full, Half (see enumeration RatingIndicatorVisualMode)
			 */
			visualMode : {type : "sap.m.RatingIndicatorVisualMode", group : "Behavior", defaultValue : sap.m.RatingIndicatorVisualMode.Half}
		},
		aggregations : {

			/**
			 * The internal selected rating icons are managed in this aggregation
			 */
			_iconsSelected : {type : "sap.ui.core.Control", multiple : true, singularName : "_iconsSelected", visibility : "hidden"},

			/**
			 * The internal unselected rating icons are managed in this aggregation
			 */
			_iconsUnselected : {type : "sap.ui.core.Control", multiple : true, singularName : "_iconsUnselected", visibility : "hidden"},

			/**
			 * The internal hovered rating icons are managed in this aggregation
			 */
			_iconsHovered : {type : "sap.ui.core.Control", multiple : true, singularName : "_iconsHovered", visibility : "hidden"}
		},
		associations : {
			/**
			 * Association to controls / ids which describe this control (see WAI-ARIA attribute aria-describedby).
			 */
			ariaDescribedBy : { type: "sap.ui.core.Control", multiple: true, singularName: "ariaDescribedBy" },

			/**
			 * Association to controls / ids which label this control (see WAI-ARIA attribute aria-labelledby).
			 */
			ariaLabelledBy : { type: "sap.ui.core.Control", multiple: true, singularName: "ariaLabelledBy" }
		},
		events : {

			/**
			 * The event is fired when the user has done a rating.
			 */
			change : {
				parameters : {

					/**
					 * The rated value
					 */
					value : {type : "int"}
				}
			},

			/**
			 * This event is triggered during the dragging period, each time the rating value changes.
			 */
			liveChange : {
				parameters : {

					/**
					 * The current value of the rating after a live change event.
					 */
					value : {type : "float"}
				}
			}
		}
	}});

	///**
	// * This file defines behavior for the control,
	// */

	/* =========================================================== */
	/*           temporary flags for jslint syntax check           */
	/* =========================================================== */
	/*jslint nomen: false */

	/* =========================================================== */
	/*           begin: API methods                                */
	/* =========================================================== */

	/**
	 * Initializes the control.
	 *
	 * @private
	 */
	RatingIndicator.prototype.init = function () {

		// deactivate text selection on drag events
		this.allowTextSelection(false);
		this._iIconCounter = 0;
		this._fHoverValue = 0;

		this._oResourceBundle = sap.ui.getCore().getLibraryResourceBundle('sap.m');

		if (RatingIndicator._pxCalculations === undefined) {
			RatingIndicator._pxCalculations = [];
		}
	};

	/**
	 * Sets the rating value. The method is automatically checking whether the value is in the valid range of 0-{@link #getMaxValue maxValue} and if it is a valid number. Calling the setter with null or undefined will reset the value to it's default.
	 *
	 * @param {float} fValue The rating value to be set.
	 * @returns {sap.m.RatingIndicator} Returns <code>this</code> to facilitate method chaining.
	 * @override
	 * @public
	 */
	RatingIndicator.prototype.setValue = function (fValue) {
		// validates the property and sets null/undefined values to the default
		fValue = this.validateProperty("value", fValue);

		// do not set negative values (will be returned by calculation function if there is an error)
		if (fValue < 0) {
			return this;
		}

		// check for valid numbers
		if (isNaN(fValue)) {
			jQuery.sap.log.warning('Ignored new rating value "' + fValue + '" because it is NAN');

		// check if the number is in the range 0-maxValue (only if control is rendered)
		// if control is not rendered it is handled by onBeforeRendering()
		} else if (this.$().length && (fValue > this.getMaxValue())) {
			jQuery.sap.log.warning('Ignored new rating value "' + fValue + '" because it is out  of range (0-' + this.getMaxValue() + ')');
		} else {
			fValue = this._roundValueToVisualMode(fValue);
			this.setProperty("value", fValue, true);

			// always set hover value to current value to allow keyboard / mouse / touch navigation
			this._fHoverValue = fValue;

			// if control is already rendered reflect the changes in the UI as well
			if (this.$().length) {
				this._updateUI(fValue);
			}
		}
		return this;
	};

	/**
	 * Sets the icon size value. The method is automatically updating the UI components if the control has been rendered before.
	 *
	 * @param {sap.ui.core.CSSSize} sIconSize
	 * @returns {sap.m.RatingIndicator} Returns <code>this</code> to facilitate method chaining.
	 * @override
	 * @public
	 */
	RatingIndicator.prototype.setIconSize = function (sIconSize) {

		// if control is already rendered we calculate the new pixel values for the icon size once
		if (this.$().length) {
			this._iPxIconSize = this._toPx(sIconSize) || 16;
		}

		// then update the property and rerender since updating all widths would be too complex here
		this.setProperty("iconSize", sIconSize, false);
		return this;
	};

	/**
	 * Sets the selected icon without rerendering the control.
	 *
	 * @param {sap.ui.core.URI} sURI
	 * @returns {sap.m.RatingIndicator} Returns <code>this</code> to facilitate method chaining.
	 * @override
	 * @public
	 */
	RatingIndicator.prototype.setIconSelected = function (sURI) {
		if (sap.ui.getCore().getConfiguration().getTheme() === "sap_hcb") {
			this.setProperty("iconSelected", sURI, true);
			return;
		}

		var oItems = this.getAggregation("_iconsSelected"),
			i = 0;

		if (oItems) {
			for (; i < oItems.length; i++) {
				oItems[i].setSrc(sURI);
			}
		}

		this.setProperty("iconSelected", sURI, true);
		return this;
	};

	/**
	 * Handler for theme changing
	 *
	 * @param oEvent {jQuery.Event} oEvent The event object passed to the event handler.
	 */
	RatingIndicator.prototype.onThemeChanged = function (oEvent){
		this.invalidate(); // triggers a re-rendering
	};

	/**
	 * Sets the unselected icon without rerendering the control.
	 *
	 * @param {sap.ui.core.URI} sURI
	 * @returns {sap.m.RatingIndicator} Returns <code>this</code> to facilitate method chaining.
	 * @override
	 * @public
	 */
	RatingIndicator.prototype.setIconUnselected = function (sURI) {
		if (sap.ui.getCore().getConfiguration().getTheme() === "sap_hcb") {
			this.setProperty("iconUnselected", sURI, true);
			return;
		}

		var oItems = this.getAggregation("_iconsUnselected"),
			i = 0;

		if (oItems) {
			for (; i < oItems.length; i++) {
				oItems[i].setSrc(sURI);
			}
		}

		this.setProperty("iconUnselected", sURI, true);
		return this;
	};

	/**
	 * Sets the hovered icon without rerendering the control.
	 *
	 * @param {sap.ui.core.URI} sURI
	 * @returns {sap.m.RatingIndicator} Returns <code>this</code> to facilitate method chaining.
	 * @override
	 * @public
	 */
	RatingIndicator.prototype.setIconHovered = function (sURI) {
		if (sap.ui.getCore().getConfiguration().getTheme() === "sap_hcb") {
			this.setProperty("iconHovered", sURI, true);
			return;
		}

		var oItems = this.getAggregation("_iconsHovered"),
			i = 0;

		if (oItems) {
			for (; i < oItems.length; i++) {
				oItems[i].setSrc(sURI);
			}
		}

		this.setProperty("iconHovered", sURI, true);
		return this;
	};

	/**
	 * Called before rendering starts by the renderer to readjust values outside the range.
	 *
	 * @private
	 */
	RatingIndicator.prototype.onBeforeRendering = function () {
		var fVal = this.getValue(),
			iMVal = this.getMaxValue();

		if (fVal > iMVal) {
			this.setValue(iMVal);
			jQuery.sap.log.warning("Set value to maxValue because value is > maxValue (" + fVal + " > " + iMVal + ").");
		} else if (fVal < 0) {
			this.setValue(0);
			jQuery.sap.log.warning("Set value to 0 because value is < 0 (" + fVal + " < 0).");
		}

		this._iPxIconSize = this._toPx(this.getIconSize()) || 16;
		this._iPxPaddingSize = this._toPx(Parameters.get("sapUiRIIconPadding")) || 4;
	};

	/**
	 * Called by the framework when rendering is completed.
	 *
	 * @private
	 */
	RatingIndicator.prototype.onAfterRendering = function() {
		this._updateAriaValues();
	};

	/**
	 * Destroys the control.
	 *
	 * @private
	 */
	RatingIndicator.prototype.exit = function () {
		delete this._iIconCounter;
		delete this._fStartValue;
		delete this._iPxIconSize;
		delete this._iPxPaddingSize;
		delete this._fHoverValue;

		delete this._oResourceBundle;
	};

	/* =========================================================== */
	/*           end: API methods                                  */
	/* =========================================================== */

	/* =========================================================== */
	/*           begin: internal methods and properties            */
	/* =========================================================== */

	RatingIndicator.prototype._toPx = function (cssSize) {
		cssSize = cssSize || 0;
		var  scopeVal = RatingIndicator._pxCalculations[cssSize],
			scopeTest;

		if (scopeVal === undefined) {
			if (cssSize) {
				scopeTest = jQuery('<div style="display: none; width: ' + cssSize + '; margin: 0; padding:0; height: auto; line-height: 1; font-size: 1; border:0; overflow: hidden">&nbsp;</div>').appendTo(sap.ui.getCore().getStaticAreaRef());
				scopeVal = scopeTest.width();
			} else {
				scopeTest = jQuery('<div class="sapMRIIcon">&nbsp;</div>').appendTo(sap.ui.getCore().getStaticAreaRef());
				scopeVal = scopeTest.height();
			}
			scopeTest.remove();
		}

		RatingIndicator._pxCalculations[cssSize] = Math.round(scopeVal);
		return RatingIndicator._pxCalculations[cssSize];
	};

	/**
	 * Updates the controls's interface to reflect a value change of the rating.
	 *
	 * @param {float} fValue the rating value to be set
	 * @param {boolean} bHover if this parameter is set to true, the hover mode is activated and the value is displayed with {@link #getIconHovered iconHovered} instead of {@link #getIconSelected iconSelected}
	 * @private
	 */
	RatingIndicator.prototype._updateUI = function (fValue, bHover) {

		// save a reference on all needed DOM elements
		var $SelectedDiv = this.$("sel"),
			$UnselectedContainerDiv = this.$("unsel-wrapper"),
			$HoveredDiv = this.$("hov"),

			// calculate padding, size, and measurement
			fIconSize = this._iPxIconSize,
			fIconPadding = this._iPxPaddingSize,
			sIconSizeMeasure = "px",
			iSymbolCount = this.getMaxValue(),

			// calculate the width for the selected elements and the complete width
			iSelectedWidth = fValue * fIconSize + (Math.round(fValue) - 1) * fIconPadding,

			iWidth = iSymbolCount * (fIconSize + fIconPadding) - fIconPadding;

		// always set hover value to current value to allow keyboard / mouse / touch navigation
		this._fHoverValue = fValue;

		if (iSelectedWidth < 0) {	// width should not be negative
			iSelectedWidth = 0;
		}

		this._updateAriaValues(fValue);

		// adjust unselected container with the remaining width
		$UnselectedContainerDiv.width((iWidth - iSelectedWidth) + sIconSizeMeasure);

		// update the DOM elements to reflect the value by setting the width of the div elements
		if (bHover) { // hide selected div & adjust hover div
			$HoveredDiv.width(iSelectedWidth + sIconSizeMeasure);
			$SelectedDiv.hide();
			$HoveredDiv.show();
		} else { // hide hovered div & adjust selected div
			$SelectedDiv.width(iSelectedWidth + sIconSizeMeasure);
			$HoveredDiv.hide();
			$SelectedDiv.show();
		}

		jQuery.sap.log.debug("Updated rating UI with value " + fValue + " and hover mode " + bHover);
	};

	/**
	 * Updates the ARIA values.
	 *
	 * @private
	 */
	RatingIndicator.prototype._updateAriaValues = function (newValue) {
		var $this = this.$();

		var fValue;
		if (newValue === undefined) {
			fValue = this.getValue();
		} else {
			fValue = newValue;
		}

		var fMaxValue = this.getMaxValue();

		$this.attr("aria-valuenow", fValue);
		$this.attr("aria-valuemax", fMaxValue);

		var sValueText = this._oResourceBundle.getText("RATING_VALUEARIATEXT", [fValue, fMaxValue]);
		$this.attr("aria-valuetext", sValueText);
	};

	/**
	 * Load the icons/images of the rating for the different rating states.
	 *
	 * @param {int} iState The icon to be returned (0 = {@link #getIconSelected iconSelected},  1 = {@link #getIconUnselected  iconUnselected}, 2 = {@link #getIconHovered iconHovered}
	 * @returns {object} either an sap.m.Image or an sap.m.Icon depending on the URI of the control parameters
	 * @private
	 */
	RatingIndicator.prototype._getIcon = function (iState) {

		// single initialization
		var oImage = null,
			sURI = null;

		if (sap.ui.getCore().getConfiguration().getTheme() !== "sap_hcb") {
			// preset the variables based on the state requested
			switch (iState) {
				case 1: // unselected
					sURI = this.getIconUnselected() || IconPool.getIconURI("favorite");
					break;
				case 2: // Hovered
					sURI = this.getIconHovered() || IconPool.getIconURI("favorite");
					break;
				case 0: // Selected
					sURI = this.getIconSelected() || IconPool.getIconURI("favorite");
					break;
			}
		} else {
			// preset the variables based on the state requested
			switch (iState) {
				case 1: // unselected
					if (this.getEnabled() === false) {
						sURI = IconPool.getIconURI("favorite");
					} else {
						sURI = IconPool.getIconURI("unfavorite");
					}
					break;
				case 2: // Hovered
					sURI = IconPool.getIconURI("favorite");
					break;
				case 0: // Selected
					sURI = IconPool.getIconURI("favorite");
					break;
			}
		}


		if (sURI) {
			oImage = IconPool.createControlByURI({
				id: this.getId() + "__icon" + this._iIconCounter++,
				src: sURI,
				useIconTooltip: false
			}, sap.m.Image);

			// store the icons in the corresponding internal aggregation
			switch (iState) {
			case 1: // unselected
				this.addAggregation("_iconsUnselected", oImage, true);
				break;
			case 2: // Hovered
				this.addAggregation("_iconsHovered", oImage, true);
				break;
			case 0: // Selected
				this.addAggregation("_iconsSelected", oImage, true);
				break;
			}
		}

		return oImage;
	};

	/**
	 * Calculated the selected value based on the event position of the tap/move/click event.
	 * This function is called by the event handlers to determine the {@link #getValue value} of the rating.
	 *
	 * @param {jQuery.Event} oEvent The event object passed to the event handler.
	 * @returns {float} The rounded rating value based on {@link #getVisualMode visualMode}.
	 * @private
	 */
	RatingIndicator.prototype._calculateSelectedValue = function (oEvent) {
		var selectedValue = -1.0,
			percentageWidth = 0.0,
			oControlRoot = this.$(),
			fControlPadding = (oControlRoot.innerWidth() - oControlRoot.width()) / 2,
			oEventPosition,
			bRtl = sap.ui.getCore().getConfiguration().getRTL();

		if (oEvent.targetTouches) {
			oEventPosition = oEvent.targetTouches[0];
		} else {
			oEventPosition = oEvent;
		}

		// get the event position for tap/touch/click events
		if (!oEventPosition || !oEventPosition.pageX) { // desktop fallback
			oEventPosition = oEvent;
			if ((!oEventPosition || !oEventPosition.pageX) && oEvent.changedTouches) { // touchend fallback
				oEventPosition = oEvent.changedTouches[0];
			}
		}

		// if an event position is not present we stop
		if (!oEventPosition.pageX) { // TODO: find out why this happens
			return parseFloat(selectedValue);
		}

		// check if event is happening inside of the control area (minus padding of the control)
		if (oEventPosition.pageX < oControlRoot.offset().left) {
			selectedValue = 0;
		} else if ((oEventPosition.pageX - oControlRoot.offset().left) >  oControlRoot.innerWidth() - fControlPadding) {
			selectedValue = this.getMaxValue();
		} else {

			// calculate the selected value based on the percentage value of the event position
			percentageWidth = (oEventPosition.pageX - oControlRoot.offset().left - fControlPadding) / oControlRoot.width();
			selectedValue = percentageWidth * this.getMaxValue();
		}

		// rtl support
		if (bRtl) {
			selectedValue = this.getMaxValue() - selectedValue;
		}

		// return rounded value based on the control's visual mode
		return this._roundValueToVisualMode(selectedValue, true);
	};

	/**
	 * Rounds the float value according to the parameter {@link #getVisualMode visualMode}:
	 * - A value of "Full" will result in integer values.
	 * - A value of "Half" will result in float values rounded to 0.5.
	 *
	 * @param {float} fValue The rating value.
	 * @param {boolean} bInputMode whether the given value represents user input
	 * @returns {float} The rounded rating value.
	 * @private
	 */
	RatingIndicator.prototype._roundValueToVisualMode = function (fValue, bInputMode) {
		if (bInputMode) { // we only support full selection of stars
			if (fValue < 0.25) { // to be able to also select 0 stars
				fValue = 0;
			} else if (fValue < this.getMaxValue() - 0.25) { // to optimize selection behaviour
				fValue += 0.25;
			}
			fValue = Math.round(fValue);
		} else { // for display we round to the correct behavior
			if (this.getVisualMode() === sap.m.RatingIndicatorVisualMode.Full) {
				fValue = Math.round(fValue);
			} else if (this.getVisualMode() === sap.m.RatingIndicatorVisualMode.Half) {
				fValue = Math.round(fValue * 2) / 2;
			}
		}

		return parseFloat(fValue);
	};

	/* =========================================================== */
	/*           end: internal methods                             */
	/* =========================================================== */

	/* =========================================================== */
	/*           begin: event handlers                             */
	/* =========================================================== */

	/**
	 * Handle the touch start event happening on the rating.
	 * The UI will be updated accordingly to show a preview of the rating value without actually setting the value.
	 *
	 * @param {jQuery.Event} oEvent The event object.
	 * @private
	 */
	RatingIndicator.prototype.ontouchstart = function (oEvent) {

		if (this.getEnabled()) {

			// mark the event for components that needs to know if the event was handled by this Control
			oEvent.setMarked();

			if (!this._touchEndProxy) {
				this._touchEndProxy = jQuery.proxy(this._ontouchend, this);
			}

			if (!this._touchMoveProxy) {
				this._touchMoveProxy = jQuery.proxy(this._ontouchmove, this);
			}

			// here also bound to the mouseup mousemove event to enable it working in
			// desktop browsers
			jQuery(document).on("touchend touchcancel mouseup", this._touchEndProxy);
			jQuery(document).on("touchmove mousemove", this._touchMoveProxy);

			this._fStartValue = this.getValue();
			var fValue = this._calculateSelectedValue(oEvent);

			if (fValue >= 0 && fValue <= this.getMaxValue()) {
				this._updateUI(fValue, true);
				if (this._fStartValue !== fValue) {	// if the value if not the same
					this.fireLiveChange({ value: fValue });
				}
			}
		}
	};

	/**
	 * Handle the touch move event on the rating.
	 * The UI will be updated accordingly to show a preview of the rating value without actually setting the value.
	 *
	 * @param {jQuery.Event} oEvent The event object.
	 * @private
	 */
	RatingIndicator.prototype._ontouchmove = function (oEvent) {

		if (oEvent.isMarked("delayedMouseEvent")) {
			return;
		}

		// note: prevent native document scrolling
		oEvent.preventDefault();

		if (this.getEnabled()) {
			var fValue = this._calculateSelectedValue(oEvent);

			if (fValue >= 0 && fValue <= this.getMaxValue()) {
				this._updateUI(fValue, true);
				if (this._fStartValue !== fValue) {	// if the value if not the same
					this.fireLiveChange({value: fValue});
				}
			}
		}
	};

	/**
	 * Handle the touch end event on the rating.
	 * A change event will be fired when the touch ends, the value will be set, and the UI will be updated accordingly.
	 *
	 * @param {jQuery.Event} oEvent The event object.
	 * @private
	 */
	RatingIndicator.prototype._ontouchend = function (oEvent) {

		if (oEvent.isMarked("delayedMouseEvent")) {
			return;
		}

		if (this.getEnabled()) {
			var fValue = this._calculateSelectedValue(oEvent);
			this.setProperty("value", fValue, true);
			this._updateUI(fValue, false);

			if (this._fStartValue !== fValue) {	// if the value if not the same
				this.fireLiveChange({ value: fValue });
				this.fireChange({ value: fValue });
			}

			jQuery(document).off("touchend touchcancel mouseup", this._touchEndProxy);
			jQuery(document).off("touchmove mousemove", this._touchMoveProxy);

			// remove unused properties
			delete this._fStartValue;
		}
	};

	/**
	 * Handle the touch end event.
	 *
	 * @param {jQuery.Event} oEvent The event object.
	 * @private
	 */
	RatingIndicator.prototype.ontouchcancel = RatingIndicator.prototype.ontouchend;

	/**
	 * Keyboard navigation event when the user presses Arrow Right (Left in RTL case) or Arrow Up.
	 *
	 * @param {jQuery.Event} oEvent The event object.
	 * @private
	 */
	RatingIndicator.prototype.onsapincrease = function (oEvent) {
		var fValue = this.getValue(),
			fOldValue = this.getValue(),
			iMaxValue = this.getMaxValue();

		if (!this.getEnabled()) {
			return false;
		}

		if (this.getVisualMode() === sap.m.RatingIndicatorVisualMode.Full) {
			fValue += 1;
		} else if (this.getVisualMode() === sap.m.RatingIndicatorVisualMode.Half) {
			fValue += 0.5;
		}

		if (fValue > iMaxValue) {
			fValue = iMaxValue;
		}

		this.setValue(fValue);

		if (fValue !== fOldValue) {
			this.fireLiveChange({ value: fValue });
			this.fireChange({ value: fValue });
		}

		// stop browsers default behavior
		if (oEvent) {
			oEvent.preventDefault();
			oEvent.stopPropagation();
		}
	};

	/**
	 * Keyboard navigation event when the user presses Arrow Left (Right in RTL case) or Arrow Down.
	 *
	 * @param {jQuery.Event} oEvent The event object.
	 * @private
	 */
	RatingIndicator.prototype.onsapdecrease = function (oEvent) {
		var fValue = this.getValue(),
			fOldValue = this.getValue();

		if (!this.getEnabled()) {
			return false;
		}

		if (this.getVisualMode() === sap.m.RatingIndicatorVisualMode.Full) {
			fValue -= 1;
		} else if (this.getVisualMode() === sap.m.RatingIndicatorVisualMode.Half) {
			fValue -= 0.5;
		}

		if (fValue < 0) {
			fValue = 0;
		}

		this.setValue(fValue);

		if (fValue !== fOldValue) {
			this.fireLiveChange({ value: fValue });
			this.fireChange({ value: fValue });
		}

		// stop browsers default behavior
		if (oEvent) {
			oEvent.preventDefault();
			oEvent.stopPropagation();
		}
	};

	/**
	* Keyboard navigation event when the user presses Home.
	*
	* @param {jQuery.Event} oEvent
	* @private
	*/
	RatingIndicator.prototype.onsaphome = function (oEvent) {
		var fValue =  0,
			fOldValue = this.getValue();

		if (!this.getEnabled()) {
			return false;
		}

		this.setValue(fValue);

		if (fValue !== fOldValue) {
			this.fireLiveChange({ value: fValue });
			this.fireChange({ value: fValue });
		}

		// stop browsers default behavior
		if (oEvent) {
			oEvent.preventDefault();
			oEvent.stopPropagation();
		}
	};

	/**
	 * Keyboard navigation event when the user presses End.
	 *
	 * @param {jQuery.Event} oEvent
	 * @private
	 */
	RatingIndicator.prototype.onsapend = function (oEvent) {
		var fValue =  this.getMaxValue(),
			fOldValue = this.getValue();

		if (!this.getEnabled()) {
			return false;
		}

		this.setValue(fValue);

		if (fValue !== fOldValue) {
			this.fireLiveChange({ value: fValue });
			this.fireChange({ value: fValue });
		}

		// stop browsers default behavior
		if (oEvent) {
			oEvent.preventDefault();
			oEvent.stopPropagation();
		}
	};

	/**
	 * Keyboard navigation event when the user presses Enter or Space.
	 *
	 * @param {jQuery.Event} oEvent The event object.
	 * @private
	 */
	RatingIndicator.prototype.onsapselect = function (oEvent) {
		var fValue = this.getValue(),
			iMaxValue = this.getMaxValue(),
			fOldValue = this.getValue();

		if (!this.getEnabled()) {
			return false;
		}

		if (fValue === iMaxValue) {
			fValue = 0; // start with 0 if we are at maximum
		} else if (this.getVisualMode() === sap.m.RatingIndicatorVisualMode.Full) {
			fValue += 1;
		} else if (this.getVisualMode() === sap.m.RatingIndicatorVisualMode.Half) {
			fValue += 0.5;
		}

		if (fValue > iMaxValue) {
			fValue = iMaxValue;
		}

		this.setValue(fValue);

		if (fValue !== fOldValue) {
			this.fireLiveChange({ value: fValue });
			this.fireChange({ value: fValue });
		}

		// stop browsers default behavior
		if (oEvent) {
			oEvent.preventDefault();
			oEvent.stopPropagation();
		}
	};

	/**
	* Keyboard handling event when the user presses number keys.
	*
	* @param {jQuery.Event} oEvent
	* @private
	*/
	RatingIndicator.prototype.onkeyup = function(oEvent) {
		var iMaxValue = this.getMaxValue();

		if (!this.getEnabled()) {
			return false;
		}

		if (oEvent.which === jQuery.sap.KeyCodes.DIGIT_0 || oEvent.which === jQuery.sap.KeyCodes.NUMPAD_0) {
			this.setValue(0);
		}
		if (oEvent.which === jQuery.sap.KeyCodes.DIGIT_1 || oEvent.which === jQuery.sap.KeyCodes.NUMPAD_1) {
			this.setValue(1);
		}
		if (oEvent.which === jQuery.sap.KeyCodes.DIGIT_2 || oEvent.which === jQuery.sap.KeyCodes.NUMPAD_2) {
			this.setValue(Math.min(2, iMaxValue));
		}
		if (oEvent.which === jQuery.sap.KeyCodes.DIGIT_3 || oEvent.which === jQuery.sap.KeyCodes.NUMPAD_3) {
			this.setValue(Math.min(3, iMaxValue));
		}
		if (oEvent.which === jQuery.sap.KeyCodes.DIGIT_4 || oEvent.which === jQuery.sap.KeyCodes.NUMPAD_4) {
			this.setValue(Math.min(4, iMaxValue));
		}
		if (oEvent.which === jQuery.sap.KeyCodes.DIGIT_5 || oEvent.which === jQuery.sap.KeyCodes.NUMPAD_5) {
			this.setValue(Math.min(5, iMaxValue));
		}
		if (oEvent.which === jQuery.sap.KeyCodes.DIGIT_6 || oEvent.which === jQuery.sap.KeyCodes.NUMPAD_6) {
			this.setValue(Math.min(6, iMaxValue));
		}
		if (oEvent.which === jQuery.sap.KeyCodes.DIGIT_7 || oEvent.which === jQuery.sap.KeyCodes.NUMPAD_7) {
			this.setValue(Math.min(7, iMaxValue));
		}
		if (oEvent.which === jQuery.sap.KeyCodes.DIGIT_8 || oEvent.which === jQuery.sap.KeyCodes.NUMPAD_8) {
			this.setValue(Math.min(8, iMaxValue));
		}
		if (oEvent.which === jQuery.sap.KeyCodes.DIGIT_9 || oEvent.which === jQuery.sap.KeyCodes.NUMPAD_9) {
			this.setValue(Math.min(9, iMaxValue));
		}
	};

	/* =========================================================== */
	/*           end: event handlers                               */
	/* =========================================================== */

	return RatingIndicator;

}, /* bExport= */ true);
