/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides the base implementation for all model implementations
sap.ui.define(['jquery.sap.global', 'sap/ui/core/format/NumberFormat', 'sap/ui/model/SimpleType', 'sap/ui/model/FormatException', 'sap/ui/model/ParseException', 'sap/ui/model/ValidateException'],
	function(jQuery, NumberFormat, SimpleType, FormatException, ParseException, ValidateException) {
	"use strict";


	/**
	 * Constructor for a Integer type.
	 *
	 * @class
	 * This class represents integer simple types.
	 *
	 * @extends sap.ui.model.SimpleType
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @param {object} [oFormatOptions] formatting options. Supports the same options as {@link sap.ui.core.format.NumberFormat.getIntegerInstance NumberFormat.getIntegerInstance}
	 * @param {object} [oFormatOptions.source] additional set of format options to be used if the property in the model is not of type string and needs formatting as well. 
	 * 										   In case an empty object is given, the default is disabled grouping and a dot as decimal separator. 
	 * @param {object} [oConstraints] value constraints. 
	 * @param {int} [oConstraints.minimum] smallest value allowed for this type  
	 * @param {int} [oConstraints.maximum] largest value allowed for this type  
	 * @alias sap.ui.model.type.Integer
	 */
	var Integer = SimpleType.extend("sap.ui.model.type.Integer", /** @lends sap.ui.model.type.Integer.prototype */ {

		constructor : function () {
			SimpleType.apply(this, arguments);
			this.sName = "Integer";
		}

	});

	/**
	 * @see sap.ui.model.SimpleType.prototype.formatValue
	 */
	Integer.prototype.formatValue = function(vValue, sInternalType) {
		var iValue = vValue;
		if (vValue == undefined || vValue == null) {
			return null;
		}
		if (this.oInputFormat) {
			iValue = this.oInputFormat.parse(vValue);
			if (iValue == null) {
				throw new FormatException("Cannot format float: " + vValue + " has the wrong format");
			}
		}
		switch (this.getPrimitiveType(sInternalType)) {
			case "string":
				return this.oOutputFormat.format(iValue);
			case "int":
			case "float":
			case "any":
				return iValue;
			default:
				throw new FormatException("Don't know how to format Integer to " + sInternalType);
		}
	};

	/**
	 * @see sap.ui.model.SimpleType.prototype.parseValue
	 */
	Integer.prototype.parseValue = function(vValue, sInternalType) {
		var iResult, oBundle;
		switch (this.getPrimitiveType(sInternalType)) {
			case "string":
				iResult = this.oOutputFormat.parse(String(vValue));
				if (isNaN(iResult)) {
					oBundle = sap.ui.getCore().getLibraryResourceBundle();
					throw new ParseException(oBundle.getText("Integer.Invalid"));
				}
				break;
			case "float":
				iResult = Math.floor(vValue);
				if (iResult != vValue) {
					oBundle = sap.ui.getCore().getLibraryResourceBundle();
					throw new ParseException(oBundle.getText("Integer.Invalid"));
				}
				break;
			case "int":
				iResult = vValue;
				break;
			default:
				throw new ParseException("Don't know how to parse Integer from " + sInternalType);
		}
		if (this.oInputFormat) {
			iResult = this.oInputFormat.format(iResult);
		}				
		return iResult;
	};

	/**
	 * @see sap.ui.model.SimpleType.prototype.validateValue
	 */
	Integer.prototype.validateValue = function(iValue) {
		if (this.oConstraints) {
			var oBundle = sap.ui.getCore().getLibraryResourceBundle(),
				aViolatedConstraints = [],
				aMessages = [];
			jQuery.each(this.oConstraints, function(sName, oContent) {
				switch (sName) {
					case "minimum":
						if (iValue < oContent) {
							aViolatedConstraints.push("minimum");
							aMessages.push(oBundle.getText("Integer.Minimum", [oContent]));
						}
						break;
					case "maximum":
						if (iValue > oContent) {
							aViolatedConstraints.push("maximum");
							aMessages.push(oBundle.getText("Integer.Maximum", [oContent]));
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
	Integer.prototype.setFormatOptions = function(oFormatOptions) {
		this.oFormatOptions = oFormatOptions;
		this._createFormats();
	};

	/**
	 * Called by the framework when any localization setting changed
	 * @private
	 */
	Integer.prototype._handleLocalizationChange = function() {
		this._createFormats();
	};
	
	/**
	 * Create formatters used by this type
	 * @private
	 */
	Integer.prototype._createFormats = function() {
		var oSourceOptions = this.oFormatOptions.source;
		this.oOutputFormat = NumberFormat.getIntegerInstance(this.oFormatOptions);
		if (oSourceOptions) {
			if (jQuery.isEmptyObject(oSourceOptions)) {
				oSourceOptions = {
					groupingEnabled: false,
					groupingSeparator: ",",
					decimalSeparator: "."
				};
			}
			this.oInputFormat = NumberFormat.getIntegerInstance(oSourceOptions);
		}
	};

	return Integer;

});
