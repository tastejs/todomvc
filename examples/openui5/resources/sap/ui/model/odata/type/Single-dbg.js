/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(['sap/ui/core/format/NumberFormat', 'sap/ui/model/FormatException',
		'sap/ui/model/odata/type/ODataType', 'sap/ui/model/ParseException',
		'sap/ui/model/ValidateException'],
	function(NumberFormat, FormatException, ODataType, ParseException, ValidateException) {
	"use strict";

	// Math.fround polyfill
	if (!Math.fround) {
		if (window.Float32Array) {
			// IE 10+
			Math.fround = function (fValue) {
				return new window.Float32Array([fValue])[0];
			};
		} else {
			// IE 9: simply return the value itself
			Math.fround = function (fValue) {
				return fValue;
			};
		}
	}

	/**
	 * Returns the locale-dependent error message for the type.
	 *
	 * @returns {string}
	 *   the locale-dependent error message
	 */
	function getErrorMessage() {
		return sap.ui.getCore().getLibraryResourceBundle().getText("EnterNumber");
	}

	/**
	 * Returns the formatter. Creates it lazily.
	 * @param {sap.ui.model.odata.type.Single} oType
	 *   the type instance
	 * @returns {sap.ui.core.format.NumberFormat}
	 *   the formatter
	 */
	function getFormatter(oType) {
		var oFormatOptions;

		if (!oType.oFormat) {
			oFormatOptions = jQuery.extend({groupingEnabled: true}, oType.oFormatOptions);
			oType.oFormat = NumberFormat.getFloatInstance(oFormatOptions);
		}
		return oType.oFormat;
	}

	/**
	 * Returns the type's nullable constraint.
	 *
	 * @param {sap.ui.model.odata.type.Single} oType
	 *   the type
	 * @returns {boolean}
	 *   the nullable constraint or <code>true</code> if not defined
	 */
	function isNullable(oType) {
		return !oType.oConstraints || oType.oConstraints.nullable !== false;
	}

	/**
	 * Sets the constraints.
	 *
	 * @param {sap.ui.model.odata.type.Single} oType
	 *   the type instance
	 * @param {object} [oConstraints]
	 *   constraints, see {@link #constructor}
	 */
	function setConstraints(oType, oConstraints) {
		var vNullable = oConstraints && oConstraints.nullable;

		oType.oConstraints = undefined;
		if (vNullable === false || vNullable === "false") {
			oType.oConstraints = {nullable: false};
		} else if (vNullable !== undefined && vNullable !== true && vNullable !== "true") {
			jQuery.sap.log.warning("Illegal nullable: " + vNullable, null, oType.getName());
		}

		oType._handleLocalizationChange();
	}

	/**
	 * Constructor for a primitive type <code>Edm.Single</code>.
	 *
	 * @class This class represents the OData primitive type <a
	 * href="http://www.odata.org/documentation/odata-version-2-0/overview#AbstractTypeSystem">
	 * <code>Edm.Single</code></a>.
	 *
	 * In {@link sap.ui.model.odata.v2.ODataModel ODataModel} this type is represented as a
	 * <code>number</code>.
	 *
	 * @extends sap.ui.model.odata.type.ODataType
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @alias sap.ui.model.odata.type.Single
	 * @param {object} [oFormatOptions]
	 *   format options as defined in {@link sap.ui.core.format.NumberFormat}. In contrast to
	 *   NumberFormat <code>groupingEnabled</code> defaults to <code>true</code>.
	 * @param {object} [oConstraints]
	 *   constraints; {@link #validateValue validateValue} throws an error if any constraint is
	 *   violated
	 * @param {boolean|string} [oConstraints.nullable=true]
	 *   if <code>true</code>, the value <code>null</code> is accepted
	 * @public
	 * @since 1.27.1
	 */
	var Single = ODataType.extend("sap.ui.model.odata.type.Single", {
				constructor : function (oFormatOptions, oConstraints) {
					ODataType.apply(this, arguments);
					this.oFormatOptions = oFormatOptions;
					setConstraints(this, oConstraints);
				}
			}
		);

	/**
	 * Formats the given value to the given target type.
	 *
	 * @param {string|number} vValue
	 *   the value to be formatted, which is represented as a number in the model
	 * @param {string} sTargetType
	 *   the target type; may be "any", "float", "int", "string".
	 *   See {@link sap.ui.model.odata.type} for more information.
	 * @returns {number|string}
	 *   the formatted output value in the target type; <code>undefined</code> or <code>null</code>
	 *   are formatted to <code>null</code>
	 * @throws {sap.ui.model.FormatException}
	 *   if <code>sTargetType</code> is unsupported
	 * @public
	 */
	Single.prototype.formatValue = function(vValue, sTargetType) {
		var fValue;

		if (vValue === null || vValue === undefined) {
			return null;
		}
		fValue = typeof vValue !== "number" ? parseFloat(vValue) : vValue;
		switch (sTargetType) {
		case "any":
			return vValue;
		case "float":
			return fValue;
		case "int":
			return Math.floor(fValue);
		case "string":
			// toPrecision to avoid rounding errors and parseFloat to avoid trailing zeroes
			return getFormatter(this).format(parseFloat(fValue.toPrecision(7)));
		default:
			throw new FormatException("Don't know how to format " + this.getName() + " to "
				+ sTargetType);
		}
	};

	/**
	 * Parses the given value, which is expected to be of the given type, to an Edm.Single in
	 * <code>number</code> representation.
	 *
	 * @param {string|number} vValue
	 *   the value to be parsed; the empty string and <code>null</code> are parsed to
	 *   <code>null</code>; note that there is no way to enter <code>Infinity</code> or
	 *   <code>NaN</code> values
	 * @param {string} sSourceType
	 *   the source type (the expected type of <code>vValue</code>); may be "float", "int"
	 *   or "string".
	 *   See {@link sap.ui.model.odata.type} for more information.
	 * @returns {number}
	 *   the parsed value
	 * @throws {sap.ui.model.ParseException}
	 *   if <code>sSourceType</code> is unsupported or if the given string cannot be parsed to a
	 *   Single
	 * @public
	 * @since 1.29.0
	 */
	Single.prototype.parseValue = function(vValue, sSourceType) {
		var fResult;

		if (vValue === null || vValue === "") {
			return null;
		}
		switch (sSourceType) {
		case "string":
			fResult = getFormatter(this).parse(vValue);
			if (isNaN(fResult)) {
				throw new ParseException(getErrorMessage());
			}
			break;
		case "int":
		case "float":
			fResult = vValue;
			break;
		default:
			throw new ParseException("Don't know how to parse " + this.getName() + " from "
				+ sSourceType);
		}
		return Math.fround(fResult);
	};

	/**
	 * Called by the framework when any localization setting changed.
	 * @private
	 */
	Single.prototype._handleLocalizationChange = function () {
		this.oFormat = null;
	};

	/**
	 * Validates whether the given value in model representation is valid and meets the
	 * defined constraints.
	 *
	 * @param {number} fValue
	 *   the value to be validated
	 * @returns {void}
	 * @throws {sap.ui.model.ValidateException} if the value is not valid
	 * @public
	 * @since 1.29.0
	 */
	Single.prototype.validateValue = function (fValue) {
		if (fValue === null && isNullable(this)) {
			return;
		}
		if (typeof fValue === "number") {
			return;
		}
		throw new ValidateException(getErrorMessage());
	};

	/**
	 * Returns the type's name.
	 *
	 * @returns {string}
	 *   the type's name
	 * @public
	 */
	Single.prototype.getName = function () {
		return "sap.ui.model.odata.type.Single";
	};

	return Single;
});
