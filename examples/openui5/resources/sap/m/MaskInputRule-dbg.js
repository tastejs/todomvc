/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.m.MaskInputRule.
sap.ui.define(['jquery.sap.global', 'sap/ui/core/Element'], function(jQuery, Element) {
	"use strict";

	/**
	 * Constructor for a new MaskInputRule.
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * The <code>sap.m.MaskInputRule</code> control holds the mapping of one char with its allowed range of chars.
	 *
	 * @author SAP SE
	 * @extends sap.ui.core.Element
	 * @version 1.32.9
	 * @private
	 * @constructor
	 * @since 1.32.0
	 * @alias sap.m.MaskInputRule
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var MaskInputRule = Element.extend("sap.m.MaskInputRule", /** @lends sap.m.MaskInputRule.prototype */ {
		metadata : {
			library : "sap.m",
			properties : {

				/**
				 * Defines the symbol used in the mask format which will accept a certain range of characters.
				 */
				maskFormatSymbol: {type: "string", group: "Misc", defaultValue: "*"},

				/**
				 * Defines the allowed characters as a regular expression.
				 */
				regex: {type: "string", group: "Misc", defaultValue: "[a-zA-Z0-9]"}
			}
		}
	});

	/**
	 * Initializes the control.
	 */
	MaskInputRule.prototype.init = function () {
	};

	/**
	 * Called when the control is destroyed.
	 */
	MaskInputRule.prototype.exit = function () {
	};

	/**
	 * Sets maskFormatSymbol property.
	 * @override
	 * @param {String} sNewMaskFormatSymbol The new format symbol
	 * @returns {sap.m.MaskInputRule} this pointer for chaining
	 */
	MaskInputRule.prototype.setMaskFormatSymbol = function (sNewMaskFormatSymbol) {
		var bIsMaskSymbolValid = validateMaskFormatSymbol.call(this, sNewMaskFormatSymbol);

		if (bIsMaskSymbolValid) {
			this.setProperty("maskFormatSymbol", sNewMaskFormatSymbol);
		}
		return this;
	};

	/**
	 * Sets regex property.
	 * @override
	 * @param {String} sNewRegex The new regex
	 * @returns {sap.m.MaskInputRule} this pointer for chaining
	 */
	MaskInputRule.prototype.setRegex = function (sNewRegex) {
		var bIsRegexValid = validateRegex.call(this, sNewRegex);

		if (bIsRegexValid) {
			this.setProperty("regex", sNewRegex);
		}
		return this;
	};

	/**
	 * Converts to string representation.
	 * @returns {String} String representation of this instance.
	 */
	MaskInputRule.prototype.toString = function(){
		return this.getMaskFormatSymbol() + ":" + this.getRegex();
	};

	/********************************************************************************************
	 ********************************* Private methods ******************************************
	 ********************************************************************************************/

	/**
	 * Checks if a passed symbol is valid.
	 * @param {string} sNewSymbol Symbol to be validated
	 * @returns {boolean} Whether the passed symbol is valid.
	 * @private
	 */
	function validateMaskFormatSymbol(sNewSymbol) {
		var rSymbol = /^.$/i,
			bNewSymbolIsValid = rSymbol.test(sNewSymbol);

		if (!bNewSymbolIsValid) {
			jQuery.sap.log.error("The mask format symbol '" + sNewSymbol + "' is not valid");
		}

		return bNewSymbolIsValid;
	}

	/**
	 * Checks if a passed range of regex is valid.
	 * @param {String} sRegex The regex string to be validated
	 * @returns {boolean} Whether the passed regex string is valid
	 * @private
	 */
	function validateRegex(sRegex) {
		var rAllowedChars = /.+/i,
			bRegexIsValid = rAllowedChars.test(sRegex);

		if (!bRegexIsValid) {
			jQuery.sap.log.error("The regex value '" + sRegex + "' is not valid");
		}

		return bRegexIsValid;
	}

	return MaskInputRule;

}, /* bExport= */ false);
