/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(['sap/ui/core/format/DateFormat', 'sap/ui/model/FormatException',
		'sap/ui/model/odata/type/ODataType', 'sap/ui/model/ParseException',
		'sap/ui/model/ValidateException'],
	function(DateFormat, FormatException, ODataType, ParseException, ValidateException) {
	"use strict";

	var oDemoDate = new Date(2014, 10, 27, 13, 47, 26);

	/*
	 * Returns true if the type uses only the date.
	 */
	function isDateOnly(oType) {
		return oType.oConstraints && oType.oConstraints.isDateOnly;
	}

	/**
	 * Returns the matching locale-dependent error message for the type based on the constraints.
	 *
	 * @param {sap.ui.model.odata.type.DateTimeBase} oType
	 *   the type
	 * @returns {string}
	 *   the locale-dependent error message
	 */
	function getErrorMessage(oType) {
		return sap.ui.getCore().getLibraryResourceBundle().getText(
			isDateOnly(oType) ? "EnterDate" : "EnterDateTime",
				[oType.formatValue(oDemoDate, "string")]);
	}

	/**
	 * Returns the formatter. Creates it lazily.
	 * @param {sap.ui.model.odata.type.DateTimeBase} oType
	 *   the type instance
	 * @returns {sap.ui.core.format.DateFormat}
	 *   the formatter
	 */
	function getFormatter(oType) {
		var oFormatOptions;

		if (!oType.oFormat){
			oFormatOptions = jQuery.extend({strictParsing: true}, oType.oFormatOptions);
			if (isDateOnly(oType)) {
				oFormatOptions.UTC = true;
				oType.oFormat = DateFormat.getDateInstance(oFormatOptions);
			} else {
				delete oFormatOptions.UTC;
				oType.oFormat = DateFormat.getDateTimeInstance(oFormatOptions);
			}
		}
		return oType.oFormat;
	}

	/**
	 * Sets the constraints.
	 *
	 * @param {sap.ui.model.odata.type.DateTimeBase} oType
	 *   the type instance
	 * @param {object} [oConstraints]
	 *   constraints, see {@link #constructor}
	 * @private
	 */
	function setConstraints(oType, oConstraints) {
		oType.oConstraints = undefined;
		if (oConstraints) {
			switch (oConstraints.nullable) {
			case undefined:
			case true:
			case "true":
				break;
			case false:
			case "false":
				oType.oConstraints = oType.oConstraints || {};
				oType.oConstraints.nullable = false;
				break;
			default:
				jQuery.sap.log.warning("Illegal nullable: " + oConstraints.nullable, null,
					oType.getName());
			}

			if (oConstraints.isDateOnly === true) {
				oType.oConstraints = oType.oConstraints || {};
				oType.oConstraints.isDateOnly = true;
			}
		}
		oType._handleLocalizationChange();
	}

	/**
	 * Base constructor for the primitive types <code>Edm.DateTime</code> and
	 * <code>Edm.DateTimeOffset</code>.
	 *
	 * @class This is an abstract base class for the <a
	 * href="http://www.odata.org/documentation/odata-version-2-0/overview#AbstractTypeSystem">
	 * OData primitive types</a> <code>Edm.DateTime</code> and <code>Edm.DateTimeOffset</code>.
	 *
	 * @extends sap.ui.model.odata.type.ODataType
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @alias sap.ui.model.odata.type.DateTimeBase
	 * @param {object} [oFormatOptions]
	 *   type-specific format options; see sub-types
	 * @param {object} [oConstraints]
	 *   constraints; {@link #validateValue validateValue} throws an error if any constraint is
	 *   violated
	 * @param {boolean|string} [oConstraints.nullable=true]
	 *   if <code>true</code>, the value <code>null</code> is accepted
	 * @param {boolean} [oConstraints.isDateOnly=false]
	 *   if <code>true</code>, only the date part is used, the time part is always 00:00:00 and
	 *   the timezone is UTC to avoid timezone-related problems
	 * @public
	 * @abstract
	 * @since 1.27.0
	 */
	var DateTimeBase = ODataType.extend("sap.ui.model.odata.type.DateTimeBase", {
				constructor : function (oFormatOptions, oConstraints) {
					ODataType.apply(this, arguments);
					setConstraints(this, oConstraints);
					this.oFormatOptions = oFormatOptions;
				},
				metadata : {
					"abstract": true
				}
			}
		);

	/**
	 * Formats the given value to the given target type.
	 *
	 * @param {Date} oValue
	 *   the value to be formatted, which is represented as a JavaScript Date in the model
	 * @param {string} sTargetType
	 *   the target type; may be "any" or "string".
	 *   See {@link sap.ui.model.odata.type} for more information.
	 * @returns {string|Date}
	 *   the formatted output value in the target type; <code>undefined</code> or <code>null</code>
	 *   are formatted to <code>null</code>
	 * @throws {sap.ui.model.FormatException}
	 *   if <code>sTargetType</code> is unsupported
	 * @public
	 */
	DateTimeBase.prototype.formatValue = function(oValue, sTargetType) {
		if (oValue === null || oValue === undefined) {
			return null;
		}
		switch (sTargetType) {
		case "any":
			return oValue;
		case "string":
			return getFormatter(this).format(oValue);
		default:
			throw new FormatException("Don't know how to format " + this.getName() + " to "
				+ sTargetType);
		}
	};

	/**
	 * Parses the given value to JavaScript <code>Date</code>.
	 *
	 * @param {string} sValue
	 *   the value to be parsed; the empty string and <code>null</code> are parsed to
	 *   <code>null</code>
	 * @param {string} sSourceType
	 *   the source type (the expected type of <code>sValue</code>); must be "string".
	 *   See {@link sap.ui.model.odata.type} for more information.
	 * @returns {Date}
	 *   the parsed value
	 * @throws {sap.ui.model.ParseException}
	 *   if <code>sSourceType</code> is unsupported or if the given string cannot be parsed to a
	 *   Date
	 * @public
	 */
	DateTimeBase.prototype.parseValue = function(sValue, sSourceType) {
		var oResult;

		if (sValue === null || sValue === "") {
			return null;
		}
		switch (sSourceType) {
		case "string":
			oResult = getFormatter(this).parse(sValue);
			if (!oResult) {
				throw new ParseException(getErrorMessage(this));
			}
			return oResult;
		default:
			throw new ParseException("Don't know how to parse " + this.getName() + " from "
				+ sSourceType);
		}
	};

	/**
	 * Called by the framework when any localization setting changed.
	 * @private
	 */
	DateTimeBase.prototype._handleLocalizationChange = function () {
		this.oFormat = null;
	};

	/**
	 * Validates whether the given value in model representation is valid and meets the
	 * defined constraints.
	 *
	 * @param {Date} oValue
	 *   the value to be validated
	 * @returns {void}
	 * @throws {sap.ui.model.ValidateException} if the value is not valid
	 * @public
	 */
	DateTimeBase.prototype.validateValue = function (oValue) {
		if (oValue === null) {
			if (this.oConstraints && this.oConstraints.nullable === false) {
				throw new ValidateException(getErrorMessage(this));
			}
			return;
		} else if (oValue instanceof Date) {
			return;
		}
		throw new ValidateException("Illegal " + this.getName() + " value: " + oValue);
	};

	/**
	 * Returns the type's name.
	 *
	 * @alias sap.ui.model.odata.type.DateTimeBase#getName
	 * @protected
	 * @abstract
	 */

	return DateTimeBase;
});
