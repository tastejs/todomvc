/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides the base implementation for all model implementations
sap.ui.define(['jquery.sap.global', 'sap/ui/core/format/NumberFormat', 'sap/ui/model/CompositeType', 'sap/ui/model/FormatException', 'sap/ui/model/ParseException', 'sap/ui/model/ValidateException'],
	function(jQuery, NumberFormat, CompositeType, FormatException, ParseException, ValidateException) {
	"use strict";


	/**
	 * Constructor for a Currency type.
	 *
	 * @class
	 * This class represents float simple types.
	 *
	 * @extends sap.ui.model.CompositeType
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @param {object} [oFormatOptions] formatting options. Supports the same options as {@link sap.ui.core.format.NumberFormat.getCurrencyInstance NumberFormat.getCurrencyInstance}
	 * @param {object} [oFormatOptions.source] additional set of format options to be used if the property in the model is not of type string and needs formatting as well. 
	 * 										   In case an empty object is given, the default is disabled grouping and a dot as decimal separator. 
	 * @param {object} [oConstraints] value constraints. 
	 * @param {float} [oConstraints.minimum] smallest value allowed for this type  
	 * @param {float} [oConstraints.maximum] largest value allowed for this type  
	 * @alias sap.ui.model.type.Currency 
	 */
	var Currency = CompositeType.extend("sap.ui.model.type.Currency", /** @lends sap.ui.model.type.Currency.prototype  */ {

		constructor : function () {
			CompositeType.apply(this, arguments);
			this.sName = "Currency";
			this.bUseRawValues = true;
		}

	});

	/**
	 * @see sap.ui.model.SimpleType.prototype.formatValue
	 */
	Currency.prototype.formatValue = function(vValue, sInternalType) {
		var aValues = vValue;
		if (vValue == undefined || vValue == null) {
			return null;
		}
		if (this.oInputFormat) {
			aValues = this.oInputFormat.parse(vValue);
		}
		if (!jQuery.isArray(aValues)) {
			throw new FormatException("Cannot format currency: " + vValue + " has the wrong format");
		}	
		if (aValues[0] == undefined || aValues[0] == null) {
			return null;
		}
		switch (this.getPrimitiveType(sInternalType)) {
			case "string":
				return this.oOutputFormat.format(aValues);
			case "int":
			case "float":
			case "any":
			default:
				throw new FormatException("Don't know how to format currency to " + sInternalType);
		}
	};

	/**
	 * @see sap.ui.model.SimpleType.prototype.parseValue
	 */
	Currency.prototype.parseValue = function(vValue, sInternalType) {
		var vResult, oBundle;
		switch (this.getPrimitiveType(sInternalType)) {
			case "string":
				vResult = this.oOutputFormat.parse(vValue);
				if (!jQuery.isArray(vResult)) {
					oBundle = sap.ui.getCore().getLibraryResourceBundle();
					throw new ParseException(oBundle.getText("Currency.Invalid", [vValue]));
				}
				break;
			case "int":
			case "float":
			default:
				throw new ParseException("Don't know how to parse Currency from " + sInternalType);
		}
		if (this.oInputFormat) {
			vResult = this.oInputFormat.format(vResult);
		}				
		return vResult;
	};

	/**
	 * @see sap.ui.model.SimpleType.prototype.validateValue
	 */
	Currency.prototype.validateValue = function(aValues) {
		var iValue = aValues[0];
		if (this.oConstraints) {
			var oBundle = sap.ui.getCore().getLibraryResourceBundle(),
				aViolatedConstraints = [],
				aMessages = [];
			jQuery.each(this.oConstraints, function(sName, oContent) {
				switch (sName) {
					case "minimum":
						if (iValue < oContent) {
							aViolatedConstraints.push("minimum");
							aMessages.push(oBundle.getText("Currency.Minimum", [oContent]));
						}
						break;
					case "maximum":
						if (iValue > oContent) {
							aViolatedConstraints.push("maximum");
							aMessages.push(oBundle.getText("Currency.Maximum", [oContent]));
						}
				}
			});
			if (aViolatedConstraints.length > 0) {
				throw new ValidateException(aMessages.join(" "), aViolatedConstraints);
			}
		}
	};

	/**
	 * @see sap.ui.model.SimpleType.prototype.setFormatOptions
	 */
	Currency.prototype.setFormatOptions = function(oFormatOptions) {
		this.oFormatOptions = oFormatOptions;
		this._createFormats();
	};

	/**
	 * Called by the framework when any localization setting changed
	 * @private
	 */
	Currency.prototype._handleLocalizationChange = function() {
		this._createFormats();
	};
	
	/**
	 * Create formatters used by this type
	 * @private
	 */
	Currency.prototype._createFormats = function() {
		var oSourceOptions = this.oFormatOptions.source;
		this.oOutputFormat = NumberFormat.getCurrencyInstance(this.oFormatOptions);
		if (oSourceOptions) {
			if (jQuery.isEmptyObject(oSourceOptions)) {
				oSourceOptions = {
					groupingEnabled: false,
					groupingSeparator: ",",
					decimalSeparator: "."
				};
			}
			this.oInputFormat = NumberFormat.getCurrencyInstance(oSourceOptions);
		}
	};

	return Currency;

});
