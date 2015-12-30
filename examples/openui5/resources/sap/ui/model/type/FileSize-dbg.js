/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides class sap.ui.model.type.FileSize
sap.ui.define(['jquery.sap.global', 'sap/ui/core/format/FileSizeFormat', 'sap/ui/model/SimpleType', 'sap/ui/model/FormatException', 'sap/ui/model/ParseException', 'sap/ui/model/ValidateException'],
	function(jQuery, FileSizeFormat, SimpleType, FormatException, ParseException, ValidateException) {
	"use strict";


	/**
	 * Constructor for a FileSize type.
	 *
	 * @class
	 * This class represents file size simple types.
	 *
	 * @extends sap.ui.model.SimpleType
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @param {object} [oFormatOptions] formatting options. Supports the same options as {@link sap.ui.core.format.FileSizeFormat.getInstance FileSizeFormat.getInstance}
	 * @param {object} [oFormatOptions.source] additional set of options used to create a second FileSizeFormat object for conversions between
	 *           string values in the data source (e.g. model) and a numeric byte representation. This second format object is used to convert from a model string to numeric bytes before
	 *           converting to string with the primary format object. Vice versa, this 'source' format is also used to format an already parsed
	 *           external value (e.g. user input) into the string format expected by the data source.
	 *           Supports the same set of options as {@link sap.ui.core.format.FileSizeFormat.getInstance FileSizeFormat.getInstance}.
	 * @param {object} [oConstraints] value constraints. 
	 * @param {float} [oConstraints.minimum] smallest value allowed for this type  
	 * @param {float} [oConstraints.maximum] largest value allowed for this type  
	 * @alias sap.ui.model.type.FileSize 
	 */
	var FileSize = SimpleType.extend("sap.ui.model.type.FileSize", /** @lends sap.ui.model.type.FileSize.prototype  */ {

		constructor : function () {
			SimpleType.apply(this, arguments);
			this.sName = "FileSize";
		}

	});

	/**
	 * @see sap.ui.model.SimpleType.prototype.formatValue
	 */
	FileSize.prototype.formatValue = function(vValue, sInternalType) {
		var fValue;

		if (vValue == undefined || vValue == null) {
			return null;
		}

		if (this.oInputFormat && typeof vValue === "string") {
			fValue = this.oInputFormat.parse(vValue);
			if (isNaN(fValue)) {
				throw new FormatException("Cannot format file size: " + vValue + " has the wrong format");
			}
		} else if (!this.oInputFormat && typeof vValue === "string") {
			throw new FormatException("Cannot format file size: " + vValue + " of type string without input/source formatter");
		} else if (typeof vValue === "number") {
			fValue = vValue;
		} else {
			throw new FormatException("Cannot format file size: " + vValue + " has wrong type: " + (typeof vValue));
		}

		if (fValue == undefined || fValue == null) {
			return null;
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
				throw new FormatException("Don't know how to format FileSize to " + sInternalType);
		}
	};

	/**
	 * @see sap.ui.model.SimpleType.prototype.parseValue
	 */
	FileSize.prototype.parseValue = function(vValue, sInternalType) {
		var vResult, oBundle;

		if (vValue == undefined || vValue == null) {
			return null;
		}

		switch (this.getPrimitiveType(sInternalType)) {
			case "string":
				vResult = this.oOutputFormat.parse(vValue);
				if (isNaN(vResult)) {
					oBundle = sap.ui.getCore().getLibraryResourceBundle();
					throw new ParseException(oBundle.getText("FileSize.Invalid"));
				}
				break;
			case "int":
			case "float":
				vResult = vValue;
				break;
			default:
				throw new ParseException("Don't know how to parse FileSize from " + sInternalType);
		}

		if (this.oInputFormat) {
			vResult = this.oInputFormat.format(vResult);
		}

		return vResult;
	};

	/**
	 * @see sap.ui.model.SimpleType.prototype.validateValue
	 */
	FileSize.prototype.validateValue = function(vValue) {
		if (this.oConstraints) {
			var oBundle = sap.ui.getCore().getLibraryResourceBundle(),
				aViolatedConstraints = [],
				aMessages = [],
				oInputFormat = this.oInputFormat;

			if (oInputFormat && typeof vValue === "string") {
				vValue = oInputFormat.parse(vValue);
			} else if (!oInputFormat && typeof vValue === "string") {
				throw new Error("No Validation possible: '" + vValue + "' is of type string but not input/source format specified.");
			}

			jQuery.each(this.oConstraints, function(sName, oContent) {
				if (oInputFormat && typeof oContent === "string") {
					oContent = oInputFormat.parse(oContent);
				} else if (!oInputFormat && typeof oContent === "string") {
					throw new Error("No Validation possible: Compare value (" + sName + ") '" + oContent + "' is of type string but not input/source format specified.");
				}
				switch (sName) {
					case "minimum":
						if (vValue < oContent) {
							aViolatedConstraints.push("minimum");
							aMessages.push(oBundle.getText("FileSize.Minimum", [oContent]));
						}
						break;
					case "maximum":
						if (vValue > oContent) {
							aViolatedConstraints.push("maximum");
							aMessages.push(oBundle.getText("FileSize.Maximum", [oContent]));
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
	FileSize.prototype.setFormatOptions = function(oFormatOptions) {
		this.oFormatOptions = oFormatOptions;
		this._handleLocalizationChange();
	};

	/**
	 * Called by the framework when any localization setting changed
	 * @private
	 */
	FileSize.prototype._handleLocalizationChange = function() {
		this.oOutputFormat = FileSizeFormat.getInstance(this.oFormatOptions);
		if (this.oFormatOptions.source) {
			this.oInputFormat = FileSizeFormat.getInstance(this.oFormatOptions.source);
		}
	};


	return FileSize;

});
