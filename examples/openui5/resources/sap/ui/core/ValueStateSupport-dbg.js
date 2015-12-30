/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides helper class ValueStateSupport
sap.ui.define(['jquery.sap.global', './Element'],
	function(jQuery, Element) {
	"use strict";


		/**
		 * Helper functionality for value state support.
		 *
		 * @author SAP SE
		 * @version 1.32.9
		 * @public
		 * @namespace sap.ui.core.ValueStateSupport
		 */
		var ValueStateSupport = {};
		var mTexts = null;
	
	
		var ensureTexts = function() {
			if (!mTexts) { // initialize texts if required
				mTexts = {};
				var rb = sap.ui.getCore().getLibraryResourceBundle("sap.ui.core");
				mTexts[sap.ui.core.ValueState.Error] = rb.getText("VALUE_STATE_ERROR");
				mTexts[sap.ui.core.ValueState.Warning] = rb.getText("VALUE_STATE_WARNING");
				mTexts[sap.ui.core.ValueState.Success] = rb.getText("VALUE_STATE_SUCCESS");
			}
		};
	
	
		/**
		 * Appends a generic success, warning or error message to the given tooltip text if the given Element
		 * has a property "valueState" with one of these three states.
		 *
		 * @param {sap.ui.core.Element} oElement the Element of which the tooltip needs to be modified
		 * @param {string} sTooltipText the original tooltip text (may be null)
		 * @returns {string} the given text, with appended success/warning/error text, if appropriate
		 *
		 * @public
		 * @name sap.ui.core.ValueStateSupport.enrichTooltip
		 * @function
		 */
		ValueStateSupport.enrichTooltip = function(oElement, sTooltipText) {
			jQuery.sap.assert(oElement instanceof Element, "oElement must be an Element");
	
			if (!sTooltipText && oElement.getTooltip()) {
				return undefined; // this means there is no tooltip text configured, but a tooltip object like a RichTooltip
			}
	
			var sText = sap.ui.core.ValueStateSupport.getAdditionalText(oElement);
			if (sText) {
				return (sTooltipText ? sTooltipText + " - " : "") + sText;
			}
	
			return sTooltipText; // when there is no value state
		};
	
	
		/**
		 * Returns a generic success, warning or error message if the given Element
		 * has a property "valueState" with one of these three states or the given ValueState
		 * represents one of these states.
		 *
		 * @param {sap.ui.core.Element|sap.ui.core.ValueState} vValue the Element of which the valueState needs to be checked, or the ValueState explicitly
		 * @returns {string} the success/warning/error text, if appropriate; otherwise null
		 *
		 * @public
		 * @name sap.ui.core.ValueStateSupport.getAdditionalText
		 * @function
		 */
		ValueStateSupport.getAdditionalText = function(vValue) {
			var sState = null;
			
			if (vValue.getValueState) {
				sState = vValue.getValueState();
			} else if (sap.ui.core.ValueState[vValue]) {
				sState = vValue;
			}

			if (sState && (sState != sap.ui.core.ValueState.None)) { // only for one of the three interesting state, not for the default
				ensureTexts();
				return mTexts[sState];
			}
			
			return null;
		};
	
		/**
		 * Returns a ValueState object based on the given integer value
		 * 
		 *  0 : ValueState.None
		 *  1 : ValueState.Warning
		 *  2 : ValueState.Success
		 *  3 : ValueState.Error
		 *
		 * @param {int} iState the state as an integer
		 * @return {sap.ui.core.ValueState} the corresponding ValueState object
		 * @static
		 * @public
		 * @name sap.ui.core.ValueStateSupport.formatValueState
		 * @function
		 * @since 1.25.0
		 */
		ValueStateSupport.formatValueState = function(iState) {
			switch (iState) {
				case 1:
					return sap.ui.core.ValueState.Warning;
				case 2:
					return sap.ui.core.ValueState.Success;
				case 3:
					return sap.ui.core.ValueState.Error;
				default:
					return sap.ui.core.ValueState.None;
			}
		};
	

	return ValueStateSupport;

}, /* bExport= */ true);
