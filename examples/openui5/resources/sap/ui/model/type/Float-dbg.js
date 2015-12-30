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
	 * Constructor for a Float type.
	 *
	 * @class
	 * This class represents float simple types.
	 *
	 * @extends sap.ui.model.SimpleType
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @param {object} [oFormatOptions] formatting options. Supports the same options as {@link sap.ui.core.format.NumberFormat.getFloatInstance NumberFormat.getFloatInstance}
	 * @param {object} [oFormatOptions.source] additional set of format options to be used if the property in the model is not of type string and needs formatting as well. 
	 * 										   In case an empty object is given, the default is disabled grouping and a dot as decimal separator. 
	 * @param {object} [oConstraints] value constraints. 
	 * @param {float} [oConstraints.minimum] smallest value allowed for this type  
	 * @param {float} [oConstraints.maximum] largest value allowed for this type  
	 * @alias sap.ui.model.type.Float 
	 */
	var Float = SimpleType.extend("sap.ui.model.type.Float", /** @lends sap.ui.model.type.Float.prototype  */ {

		constructor : function () {
			SimpleType.apply(this, arguments);
			this.sName = "Float";
		}

	});

	/**
	 * @see sap.ui.model.SimpleType.prototype.formatValue
	 */
	Float.prototype.formatValue = function(vValue, sInternalType) {
		var fValue = vValue;
		if (vValue == undefined || vValue == null) {
			return null;
		}
		if (this.oInputFormat) {
			fValue = this.oInputFormat.parse(vValue);
			if (fValue == null) {
				throw new FormatException("Cannot format float: " + vValue + " has the wrong format");
			}
		}
		switch (this.getPrimitiveType(sInternalType)) {
			case "string":
				return this.oOutputFormat.format(fValue);
			case "int":
				return Math.floor(fValue);
			case "float":
			case "any":
				return fValue;
			default:
				throw new FormatException("Don't know how to format Float to " + sInternalType);
		}
	};

	/**
	 * @see sap.ui.model.SimpleType.prototype.parseValue
	 */
	Float.prototype.parseValue = function(vValue, sInternalType) {
		var fResult, oBundle;
		switch (this.getPrimitiveType(sInternalType)) {
			case "string":
				fResult = this.oOutputFormat.parse(vValue);
				if (isNaN(fResult)) {
					oBundle = sap.ui.getCore().getLibraryResourceBundle();
					throw new ParseException(oBundle.getText("Float.Invalid"));
				}
				break;
			case "int":
			case "float":
				fResult = vValue;
				break;
			default:
				throw new ParseException("Don't know how to parse Float from " + sInternalType);
		}
		if (this.oInputFormat) {
			fResult = this.oInputFormat.format(fResult);
		}				
		return fResult;
	};

	/**
	 * @see sap.ui.model.SimpleType.prototype.validateValue
	 */
	Float.prototype.validateValue = function(iValue) {
		if (this.oConstraints) {
			var oBundle = sap.ui.getCore().getLibraryResourceBundle(),
				aViolatedConstraints = [],
				aMessages = [];
			jQuery.each(this.oConstraints, function(sName, oContent) {
				switch (sName) {
					case "minimum":
						if (iValue < oContent) {
							aViolatedConstraints.push("minimum");
							aMessages.push(oBundle.getText("Float.Minimum", [oContent]));
						}
						break;
					case "maximum":
						if (iValue > oContent) {
							aViolatedConstraints.push("maximum");
							aMessages.push(oBundle.getText("Float.Maximum", [oContent]));
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
	Float.prototype.setFormatOptions = function(oFormatOptions) {
		this.oFormatOptions = oFormatOptions;
		this._createFormats();
	};

	/**
	 * Called by the framework when any localization setting changed
	 * @private
	 */
	Float.prototype._handleLocalizationChange = function() {
		this._createFormats();
	};
	
	/**
	 * Create formatters used by this type
	 * @private
	 */
	Float.prototype._createFormats = function() {
		var oSourceOptions = this.oFormatOptions.source;
		this.oOutputFormat = NumberFormat.getFloatInstance(this.oFormatOptions);
		if (oSourceOptions) {
			if (jQuery.isEmptyObject(oSourceOptions)) {
				oSourceOptions = {
					groupingEnabled: false,
					groupingSeparator: ",",
					decimalSeparator: "."
				};
			}
			this.oInputFormat = NumberFormat.getFloatInstance(oSourceOptions);
		}
	};

	return Float;

});
