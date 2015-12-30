/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides class sap.ui.core.format.FileSizeFormat
sap.ui.define(['jquery.sap.global', 'sap/ui/base/Object', 'sap/ui/core/LocaleData', 'sap/ui/core/format/NumberFormat'],
	function(jQuery, BaseObject, LocaleData, NumberFormat) {
	"use strict";


	var _UNITS = [
		{ binaryFactor: 1, decimalFactor: 1, decimalUnit: "Byte", binaryUnit: "Byte" },
		{ binaryFactor: 1, decimalFactor: 1, decimalUnit: "Bytes", binaryUnit: "Bytes" },
		{ binaryFactor: Math.pow(2,10), decimalFactor: 1e3, decimalUnit: "Kilobyte", binaryUnit: "Kibibyte" },
		{ binaryFactor: Math.pow(2,20), decimalFactor: 1e6, decimalUnit: "Megabyte", binaryUnit: "Mebibyte" },
		{ binaryFactor: Math.pow(2,30), decimalFactor: 1e9, decimalUnit: "Gigabyte", binaryUnit: "Gibibyte" },
		{ binaryFactor: Math.pow(2,40), decimalFactor: 1e12, decimalUnit: "Terabyte", binaryUnit: "Tebibyte" },
		{ binaryFactor: Math.pow(2,50), decimalFactor: 1e15, decimalUnit: "Petabyte", binaryUnit: "Pebibyte" },
		{ binaryFactor: Math.pow(2,60), decimalFactor: 1e18, decimalUnit: "Exabyte", binaryUnit: "Exbibyte" },
		{ binaryFactor: Math.pow(2,70), decimalFactor: 1e21, decimalUnit: "Zettabyte", binaryUnit: "Zebibyte" },
		{ binaryFactor: Math.pow(2,80), decimalFactor: 1e24, decimalUnit: "Yottabyte", binaryUnit: "Yobibyte" }
	];
	
	
	/**
	 * Format classes
	 *
	 * @namespace
	 * @name sap.ui.core.format
	 * @public
	 */
	
	/**
	 * Constructor for FileSizeFormat - must not be used: To get a FileSizeFormat instance, please use getInstance.
	 *
	 * @class
	 * The FileSizeFormat is a static class for formatting and parsing numeric file size values according
	 * to a set of format options.
	 *
	 * Supports the same options as {@link sap.ui.core.format.NumberFormat.getFloatInstance NumberFormat.getFloatInstance}
	 * For format options which are not specified default values according to the type and locale settings are used.
	 * 
	 * Supported format options (additional to NumberFormat):
	 * <ul>
	 * <li>binaryFilesize: if true, base 2 is used: 1 Kibibyte = 1024 Byte, ... , otherwise base 10 is used: 1 Kilobyte = 1000 Byte (Default is false)</li>
	 * </ul>
	 *
	 * @public
	 * @alias sap.ui.core.format.FileSizeFormat
	 */
	var FileSizeFormat = BaseObject.extend("sap.ui.core.format.FileSizeFormat", /** @lends sap.ui.core.format.FileSizeFormat.prototype */ {
		constructor : function(oFormatOptions) {
			// Do not use the constructor
			throw new Error();
		}
	});
	
	
	/**
	 * Get an instance of the FileSizeFormat, which can be used for formatting.
	 * 
	 * If no locale is given, the currently configured 
	 * {@link sap.ui.core.Configuration.FormatSettings#getFormatLocale formatLocale} will be used. 
	 *
	 * @param {object} [oFormatOptions] Object which defines the format options
	 * @param {sap.ui.core.Locale} [oLocale] Locale to get the formatter for
	 * @return {sap.ui.core.format.FileSizeFormat} instance of the FileSizeFormat
	 * @static
	 * @public
	 */
	FileSizeFormat.getInstance = function(oFormatOptions, oLocale) {
		return this.createInstance(oFormatOptions, oLocale);
	};
	
	/**
	 * Create an instance of the FileSizeFormat.
	 *
	 * @param {object} [oFormatOptions] Object which defines the format options
	 * @return {sap.ui.core.format.FileSizeFormat} the instance of the FileSizeFormat
	 * @static
	 * @private
	 */
	FileSizeFormat.createInstance = function(oFormatOptions, oLocale) {
		var oFormat = jQuery.sap.newObject(this.prototype);
		if ( oFormatOptions instanceof sap.ui.core.Locale ) {
			oLocale = oFormatOptions;
			oFormatOptions = undefined;
		}
		if (!oLocale) {
			oLocale = sap.ui.getCore().getConfiguration().getFormatSettings().getFormatLocale();
		}
		oFormat.oLocale = oLocale;
		oFormat.oLocaleData = LocaleData.getInstance(oLocale);
		oFormat.oNumberFormat = NumberFormat.getFloatInstance(oFormatOptions, oLocale);
		oFormat.oBundle = sap.ui.getCore().getLibraryResourceBundle("sap.ui.core", oLocale.toString());
		
		oFormat.bBinary = oFormatOptions ? !!oFormatOptions.binaryFilesize : false;
		
		return oFormat;
	};
	
	/**
	 * Format a filesize (in bytes) according to the given format options.
	 *
	 * @param {number|string} oValue the number (or hex string) to format
	 * @return {string} the formatted output value
	 * @public
	 */
	FileSizeFormat.prototype.format = function(oValue) {
		var fValue = null, fOriginValue;
		if (typeof oValue == "string") {
			try {
				if (/^\s*[\+-]?0[xX]/.test(oValue)) {
					fValue = parseInt(oValue, 16);
				} else {
					fValue = parseFloat(oValue, 10);
				}
			} catch (e) {
				// Incompatible String is handled as NaN
			}
		} else if (typeof oValue == "number") {
			fValue = oValue;
		}

		if (fValue === null) {
			return "NaN";
		}
		
		fOriginValue = fValue;
		
		var oUnit = _getUnit(fValue, this.bBinary),
			sValue = this.oNumberFormat.format(fValue / oUnit.factor);
		
		// Rounding may induce a change of scale. -> Second pass required
		if (!oUnit.noSecondRounding) {
			fValue = this.oNumberFormat.parse(sValue);
			if ((this.bBinary && Math.abs(fValue) >= 1024) || (!this.bBinary && Math.abs(fValue) >= 1000)) {
				oUnit = _getUnit(fValue * oUnit.factor, this.bBinary);
				sValue = this.oNumberFormat.format(fOriginValue / oUnit.factor);
			}
		}
		
		return this.oBundle.getText("FileSize." + oUnit.unit, sValue);
	};
	
	/**
	 * Parse a string which is formatted according to the given format options.
	 *
	 * @param {string} sValue the string containing a formatted filesize value
	 * @return {number} the parsed value in bytes
	 * @public
	 */
	FileSizeFormat.prototype.parse = function(sValue) {
		var oUnit, _sValue, fValue, bBinary;
		
		if (!sValue) {
			return NaN;
		}
		
		for (var i = 0; i < _UNITS.length; i++) {
			oUnit = _UNITS[i];
			_sValue = _checkUnit(this.oBundle, oUnit.decimalUnit, sValue);
			if (_sValue) {
				bBinary = false;
				break;
			} else {
				_sValue = _checkUnit(this.oBundle, oUnit.binaryUnit, sValue);
				if (_sValue) {
					bBinary = true;
					break;
				}
			}
		}
		
		if (!_sValue) {
			_sValue = sValue;
			bBinary = false;
			oUnit = _UNITS[0];
		}
		
		fValue = this.oNumberFormat.parse(_sValue);
		return fValue * (bBinary ? oUnit.binaryFactor : oUnit.decimalFactor);
	};

    
	function _getUnit(fBytes, bBinary) {
		var b = Math.abs(fBytes),
			unit, factor;
		
		for (var i = _UNITS.length - 1; i >= 2; i--) {
			unit = _UNITS[i];
			factor = bBinary ? unit.binaryFactor : unit.decimalFactor;
			if (b >= factor) {
				return {factor: factor, unit: bBinary ? unit.binaryUnit : unit.decimalUnit, noSecondRounding: (i == _UNITS.length - 1)};
			}
		}
		return {factor: 1, unit: _UNITS[b >= 2 ? 1 : 0].decimalUnit};
	}
	
	
	function _checkUnit(oBundle, sUnit, sValue){
		var sPattern = oBundle.getText("FileSize." + sUnit),
			_oPattern;
		
		if (jQuery.sap.startsWith(sPattern, "{0}")) {
			_oPattern = sPattern.substr(3, sPattern.length);
			if (jQuery.sap.endsWithIgnoreCase(sValue, _oPattern)) {
				return sValue.substr(0, sValue.length - _oPattern.length);
			}
		} else if (jQuery.sap.endsWith(sPattern, "{0}")) {
			_oPattern = sPattern.substr(0, sPattern.length - 3);
			if (jQuery.sap.startsWithIgnoreCase(sValue, _oPattern)) {
				return sValue.substr(_oPattern.length, sValue.length);
			}
		} else {
			_oPattern = sPattern.split("{0}");
			if (_oPattern.length == 2 && jQuery.sap.startsWithIgnoreCase(sValue, _oPattern[0]) && jQuery.sap.endsWithIgnoreCase(sValue, _oPattern[1])) {
				return sValue.substr(_oPattern[0].length, sValue.length - _oPattern[1].length);
			}
		}
		
		return null;
	}
	
	
	return FileSizeFormat;

});