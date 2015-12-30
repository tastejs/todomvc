/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.commons.RatingIndicator.
sap.ui.define(['jquery.sap.global', './library', 'sap/ui/core/Control', 'sap/ui/core/theming/Parameters'],
	function(jQuery, library, Control, Parameters) {
	"use strict";



	/**
	 * Constructor for a new RatingIndicator.
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * RatingIndicator is used to let the user do some rating on a given topic. The amount of
	 * rating symbols can be specified, as well as the URIs to the image icons which shall be
	 * used as rating symbols. When the user performs a rating, an event is fired.
	 * @extends sap.ui.core.Control
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @alias sap.ui.commons.RatingIndicator
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy)
	 * designtime metamodel
	 */
	var RatingIndicator = Control.extend("sap.ui.commons.RatingIndicator", /** @lends sap.ui.commons.RatingIndicator.prototype */ { metadata : {

		library : "sap.ui.commons",
		properties : {
			/**
			 * Determines if the rating symbols can be edited.
			 */
			editable : {type : "boolean", group : "Behavior", defaultValue : true},

			/**
			 * Determines the number of displayed rating symbols
			 */
			maxValue : {type : "int", group : "Behavior", defaultValue : 5},

			/**
			 * Determines the currently selected value. If value is set to sap.ui.commons.RatingIndicator.NoValue,
			 * the averageValue is shown.
			 */
			value : {type : "float", group : "Behavior", defaultValue : 0, bindable : "bindable"},

			/**
			 * Determines the average value. This value is shown if no value is set.
			 * This can be used to display an average Value before the user votes.
			 */
			averageValue : {type : "float", group : "Behavior", defaultValue : 0},

			/**
			 * The URI to the image which shall be displayed for all selected rating symbols.
			 * Note that when this attribute is used, also the other icon attributes need to be set.
			 */
			iconSelected : {type : "sap.ui.core.URI", group : "Behavior", defaultValue : null},

			/**
			 * The URI to the image which shall be displayed for all unselected rating symbols.
			 * If this attribute is used, a requirement is that all custom icons need to have the same size.
			 * Note that when this attribute is used also the other icon attributes need to be set.
			 */
			iconUnselected : {type : "sap.ui.core.URI", group : "Behavior", defaultValue : null},

			/**
			 * The URI to the image which is displayed when the mouse hovers onto a rating symbol.
			 * If used, a requirement is that all custom icons need to have the same size.
			 * Note that when this attribute is used also the other icon attributes need to be set.
			 */
			iconHovered : {type : "sap.ui.core.URI", group : "Behavior", defaultValue : null},

			/**
			 * Defines how float values are visualized: Full, Half, Continuous
			 * (see enumeration RatingIndicatorVisualMode)
			 */
			visualMode : {type : "sap.ui.commons.RatingIndicatorVisualMode", group : "Behavior", defaultValue : sap.ui.commons.RatingIndicatorVisualMode.Half}
		},
		associations : {

			/**
			 * Association to controls / ids which describe this control (see WAI-ARIA attribute aria-describedby).
			 */
			ariaDescribedBy : {type : "sap.ui.core.Control", multiple : true, singularName : "ariaDescribedBy"},

			/**
			 * Association to controls / ids which label this control (see WAI-ARIA attribute aria-labelledby).
			 */
			ariaLabelledBy : {type : "sap.ui.core.Control", multiple : true, singularName : "ariaLabelledBy"}
		},
		events : {

			/**
			 * The event is fired when the user has done a rating.
			 */
			change : {
				parameters : {

					/**
					 * The value of the user rating
					 */
					value : {type : "int"}
				}
			}
		}
	}});


	RatingIndicator.NoValue = -9999;
	/**
	 * Control Initialization
	 * @private
	 */
	RatingIndicator.prototype.init = function(){
		this.iHoveredRating = -1;
	};

	/**
	 * Does all the cleanup when the RatingIndicator is to be destroyed.
	 * Called from Element's destroy() method.
	 * @private
	 */
	RatingIndicator.prototype.exit = function (){
		// no super.exit() to call
	};

	/**
	 * Called when the theme is changed.
	 * @private
	 */
	RatingIndicator.prototype.onThemeChanged = function(oEvent){
		if (this.getDomRef()) {
			this.invalidate();
		}
	};

	/**
	 * Avoid dragging the icons.
	 * @private
	 */
	RatingIndicator.prototype.ondragstart = function(oEvent){
		oEvent.preventDefault();
	};

	/**
	 * Returns the value to be displayed, which is either a set value or (if no value is set) the
	 * averageValue
	 * @private
	 */
	RatingIndicator.prototype._getDisplayValue = function() {
		var fValue = this.getValue();

		if (fValue == RatingIndicator.NoValue) {
			// If the value is set to sap.ui.commons.RatingIndicator.NoValue, show the averageValue
			return this.getAverageValue();
		} else {
			return fValue;
		}
	};

	/**
	 * Behavior implementation which is executed when the user presses Arrow Right (Left in RTL case) or Arrow Up.
	 *
	 * @param {jQuery.Event} oEvent
	 * @private
	 */
	RatingIndicator.prototype.onsapincrease = function(oEvent){
		var iNewHoverValue = this.iHoveredRating;

		if (iNewHoverValue == -1) {
			iNewHoverValue = Math.round(this._getDisplayValue()) - 1;
			if (iNewHoverValue == -1) {
				iNewHoverValue = 0;
			}
		}

		if (iNewHoverValue < this.getMaxValue()) {
			iNewHoverValue = iNewHoverValue + 1;
		} else {
			iNewHoverValue = this.getMaxValue();
		}

		this.updateHoverState(oEvent, iNewHoverValue);
	};

	/**
	 * Behavior implementation which is executed when the user presses Arrow Left (Right in RTL case) or Arrow Down.
	 *
	 * @param {jQuery.Event} oEvent
	 * @private
	 */
	RatingIndicator.prototype.onsapdecrease = function(oEvent){
		var iNewHoverValue = this.iHoveredRating;

		if (iNewHoverValue == -1 && Math.round(this._getDisplayValue()) == 0) {
			return;
		}

		if (iNewHoverValue == -1) {
			iNewHoverValue = Math.round(this._getDisplayValue()) + 1;
		}

		if (iNewHoverValue > 1) {
			iNewHoverValue = iNewHoverValue - 1;
		} else {
			iNewHoverValue = 1;
		}

		this.updateHoverState(oEvent, iNewHoverValue);
	};

	/**
	 * Behavior implementation which is executed when the user presses Home.
	 *
	 * @param {jQuery.Event} oEvent
	 * @private
	 */
	RatingIndicator.prototype.onsaphome = function(oEvent){
		this.updateHoverState(oEvent, 1);
	};

	/**
	 * Behavior implementation which is executed when the user presses End.
	 *
	 * @param {jQuery.Event} oEvent
	 * @private
	 */
	RatingIndicator.prototype.onsapend = function(oEvent){
		this.updateHoverState(oEvent, this.getMaxValue());
	};

	/**
	 * Behavior implementation which is executed when the user presses Enter or Space.
	 *
	 * @param {jQuery.Event} oEvent
	 * @private
	 */
	RatingIndicator.prototype.onsapselect = function(oEvent){
		this.saveValue(oEvent, true, this.iHoveredRating);
	};

	/**
	 * Behavior implementation which is executed when the user presses Esc.
	 *
	 * @param {jQuery.Event} oEvent
	 * @private
	 */
	RatingIndicator.prototype.onsapescape = function(oEvent){
		this.saveValue(oEvent, true, -1);
	};

	/**
	 * Behavior implementation which is executed when the control loses the focus.
	 *
	 * @param {jQuery.Event} oEvent
	 * @private
	 */
	RatingIndicator.prototype.onfocusout = function(oEvent){
		//Do not react on focusouts of child DOM refs in IE
		if (!!sap.ui.Device.browser.internet_explorer && oEvent.target != this.getDomRef()) {
			return;
		}
		this.saveValue(oEvent, false, this.iHoveredRating);
	};

	/**
	 * Behavior implementation which is executed when the control gets the focus.
	 *
	 * @param {jQuery.Event} oEvent
	 * @private
	 */
	RatingIndicator.prototype.onfocusin = function(oEvent){
		//Avoid focusing child DOM refs in IE
		if (!!sap.ui.Device.browser.internet_explorer && oEvent.target != this.getDomRef()) {
			this.getDomRef().focus();
		}
	};

	/**
	 * Behavior implementation which is executed when the user clicks on a rating symbol.
	 *
	 * @param {jQuery.Event} oEvent
	 * @private
	 */
	RatingIndicator.prototype.onclick = function(oEvent){
		this.saveValue(oEvent, true, this.getSymbolValue(oEvent));
	};

	/**
	 * Behavior implementation which is executed when the user moves the mouse on a rating symbol.
	 *
	 * @param {jQuery.Event} oEvent
	 * @private
	 */
	RatingIndicator.prototype.onmouseover = function(oEvent){
		oEvent.preventDefault();
		oEvent.stopPropagation();

		if (!this.getEditable()) {
			return;
		}
		this.iHoveredRating = -1;

		var symbolValue = this.getSymbolValue(oEvent);
		if (symbolValue == -1) {
			return;
		}

		for (var i = 1; i <= symbolValue; i++) {
			sap.ui.commons.RatingIndicatorRenderer.hoverRatingSymbol(i, this);
		}
		for (var i = symbolValue + 1; i <= this.getMaxValue(); i++) {
			sap.ui.commons.RatingIndicatorRenderer.hoverRatingSymbol(i, this, true);
		}
	};

	/**
	 * Behavior implementation which is executed when the user moves the mouse out of the rating symbol.
	 *
	 * @param {jQuery.Event} oEvent
	 * @private
	 */
	RatingIndicator.prototype.onmouseout = function(oEvent){
		oEvent.preventDefault();
		oEvent.stopPropagation();

		if (!this.getEditable()) {
			return;
		}

		if (jQuery.sap.checkMouseEnterOrLeave(oEvent, this.getDomRef())) {
			this.iHoveredRating = -1;
			for (var i = 1; i <= this.getMaxValue(); i++) {
				sap.ui.commons.RatingIndicatorRenderer.unhoverRatingSymbol(i, this);
			}
		}
	};

	/**
	 * Returns the rating symbol value which is affected by the given event or -1
	 * if the event was not on a rating symbol.
	 *
	 * @param {jQuery.Event} oEvent
	 * @private
	 */
	RatingIndicator.prototype.getSymbolValue = function(oEvent){
		var oSymbol = jQuery(oEvent.target);
		if (oSymbol.hasClass("sapUiRatingItmImg") || oSymbol.hasClass("sapUiRatingItmOvrflw")) {
			oSymbol = jQuery(oEvent.target.parentNode);
		} else if (oSymbol.hasClass("sapUiRatingItmOvrflwImg")) {
			oSymbol = jQuery(oEvent.target.parentNode.parentNode);
		}
		var itemvalue = oSymbol.attr("itemvalue");
		if (itemvalue) {
			return parseInt(itemvalue, 10);
		}
		return -1;
	};

	/**
	 * Updates the hover state according to the current pending keyboard input.
	 *
	 * @private
	 */
	RatingIndicator.prototype.updateKeyboardHoverState = function(bSkipHoverAfter){
		for (var i = 1; i <= this.getMaxValue(); i++) {
			sap.ui.commons.RatingIndicatorRenderer.unhoverRatingSymbol(i, this);
			if (i <= this.iHoveredRating) {
				sap.ui.commons.RatingIndicatorRenderer.hoverRatingSymbol(i, this);
			} else if (!bSkipHoverAfter) {
				sap.ui.commons.RatingIndicatorRenderer.hoverRatingSymbol(i, this, true);
			}
		}
		this.setAriaState();
	};

	/**
	 * Called by the framework when rendering is completed.
	 *
	 * @private
	 */
	RatingIndicator.prototype.onAfterRendering = function() {
		this.setAriaState();
	};

	/**
	 * Updates the ARIA state initially and in case of changes.
	 *
	 * @private
	 */
	RatingIndicator.prototype.setAriaState = function() {
		var val = this.iHoveredRating == -1 ? this._getDisplayValue() : this.iHoveredRating;
		this.$().attr("aria-valuenow", val).attr("aria-valuetext", this._getText("RATING_ARIA_VALUE" , [val])).attr("aria-label", this._getText("RATING_ARIA_NAME"));
	};

	/**
	 * Load language dependent texts.
	 *
	 * @private
	 */
	RatingIndicator.prototype._getText = function(sKey, aArgs) {
		var rb = sap.ui.getCore().getLibraryResourceBundle("sap.ui.commons");
		if (rb) {
			return rb.getText(sKey, aArgs);
		}
		return sKey;
	};

	/**
	 * Helper function to save the value and fire the change event.
	 *
	 * @param {jQuery.Event} oEvent
	 * @param {boolean} bstopEvent
	 * @param {int} iNewValue
	 * @private
	 */
	RatingIndicator.prototype.saveValue = function(oEvent, bstopEvent, iNewValue) {
		if (bstopEvent) {
			oEvent.preventDefault();
			// the control should not stop browser event propagation
			// Example: table control needs to catch and handle the event as well
			//oEvent.stopPropagation();
		}
		if (!this.getEditable()) {
			return false;
		}

		this.iHoveredRating = -1;
		if (iNewValue != -1 && iNewValue != this.getValue()) {
			this.setValue(iNewValue);
			this.fireChange({value:iNewValue});
			return true;
		} else {
			//Update hover state only if value is not changed (otherwise rerendering is done anyway)
			for (var i = 1; i <= this.getMaxValue(); i++) {
				sap.ui.commons.RatingIndicatorRenderer.unhoverRatingSymbol(i, this);
			}
			this.setAriaState();
			return false;
		}
	};

	/**
	 * Helper function to update the hover state when keyboard is used.
	 *
	 * @param {jQuery.Event} oEvent
	 * @param {interger} iNewHoverValue
	 * @private
	 */
	RatingIndicator.prototype.updateHoverState = function(oEvent, iNewHoverValue) {
		oEvent.preventDefault();
		oEvent.stopPropagation();
		if (!this.getEditable()) {
			return;
		}
		this.iHoveredRating = iNewHoverValue;
		this.updateKeyboardHoverState();
	};

	/**
	 * Setter for property <code>maxValue</code>.
	 *
	 * Default value is <code>5</code>
	 * Minimum value is <code>1</code>
	 *
	 * @param {int} iMaxValue new value for property <code>maxValue</code>
	 * @return {sap.ui.commons.RatingIndicator} <code>this</code> to allow method chaining
	 * @public
	 */
	RatingIndicator.prototype.setMaxValue = function(iMaxValue) {
		if (iMaxValue < 1) {
			iMaxValue = 1;
		}
		this.setProperty("maxValue", iMaxValue);
		return this;
	};


	return RatingIndicator;

}, /* bExport= */ true);
