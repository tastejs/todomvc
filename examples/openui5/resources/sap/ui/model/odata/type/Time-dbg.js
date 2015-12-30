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

	var oDemoTime = {
			__edmType: "Edm.Time",
			ms: 49646000 // "13:47:26"
		};

	/**
	 * Returns the locale-dependent error message.
	 *
	 * @param {sap.ui.model.odata.type.Time} oType
	 *   the type
	 * @returns {string}
	 *   the locale-dependent error message
	 * @private
	 */
	function getErrorMessage(oType) {
		return sap.ui.getCore().getLibraryResourceBundle().getText("EnterTime",
			[oType.formatValue(oDemoTime, "string")]);
	}

	/**
	 * Returns the formatter. Creates it lazily.
	 * @param {sap.ui.model.odata.type.Time} oType
	 *   the <code>Time</code> instance
	 * @returns {sap.ui.core.format.DateFormat}
	 *   the formatter
	 */
	function getFormatter(oType) {
		var oFormatOptions;

		if (!oType.oFormat) {
			oFormatOptions = jQuery.extend({strictParsing: true}, oType.oFormatOptions);
			oFormatOptions.UTC = true;
			oType.oFormat = DateFormat.getTimeInstance(oFormatOptions);
		}
		return oType.oFormat;
	}

	/**
	 * Verifies that the given object is really a <code>Time</code> object in the model format.
	 * @param {any} o
	 *   the object to test
	 * @returns {boolean}
	 *   <code>true</code>, if it is a time object
	 */
	function isTime(o) {
		return typeof o === "object" && o.__edmType === "Edm.Time" && typeof o.ms === "number";
	}

	/**
	 * Sets the constraints.
	 *
	 * @param {sap.ui.model.odata.type.Time} oType
	 *   the <code>Time</code> instance
	 * @param {object} [oConstraints]
	 *   constraints
	 * @param {boolean|string} [oConstraints.nullable=true]
	 *   if <code>true</code>, the value <code>null</code> is accepted; note that
	 *   {@link #parseValue} maps <code>""</code> to <code>null</code>
	 */
	function setConstraints(oType, oConstraints) {
		var vNullable = oConstraints && oConstraints.nullable;

		oType.oConstraints = undefined;
		if (vNullable === false || vNullable === "false") {
			oType.oConstraints = {nullable: false};
		} else if (vNullable !== undefined && vNullable !== true && vNullable !== "true") {
			jQuery.sap.log.warning("Illegal nullable: " + vNullable, null, oType.getName());
		}
	}

	/**
	 * Converts the given time object to a Date.
	 * @param {object} oTime
	 *   the <code>Time</code> object
	 * @returns {Date}
	 *   a Date with hour, minute, second and milliseconds set according to the time object.
	 * @throws FormatException if the time object's format does not match
	 */
	function toDate(oTime) {
		if (!isTime(oTime)) {
			throw new FormatException("Illegal sap.ui.model.odata.type.Time value: "
				+ toString(oTime));
		}
		return new Date(oTime.ms);
	}

	/**
	 * Converts the given Date to a time object.
	 * @param {Date} oDate
	 *   the date (day, month and year are ignored)
	 * @returns {object}
	 *   a time object with __edmType and ms
	 */
	function toModel(oDate) {
		return {
			__edmType: "Edm.Time",
			ms: ((oDate.getUTCHours() * 60 + oDate.getUTCMinutes()) * 60 + oDate.getUTCSeconds())
				* 1000 + oDate.getUTCMilliseconds()
		};
	}

	/**
	 * Converts the object to a string. Prefers JSON.stringify if possible.
	 * @param {any} v
	 *   the object
	 * @returns {string}
	 *   <code>v</code> converted to a string
	 */
	function toString(v) {
		try {
			return JSON.stringify(v);
		} catch (e) {
			return String(v);
		}
	}

	/**
	 * Constructor for an OData primitive type <code>Edm.Time</code>.
	 *
	 * @class This class represents the OData primitive type <a
	 * href="http://www.odata.org/documentation/odata-version-2-0/overview#AbstractTypeSystem">
	 * <code>Edm.Time</code></a>.
	 *
	 * In {@link sap.ui.model.odata.v2.ODataModel ODataModel} this type is represented as an
	 * object with two properties:
	 * <ul>
	 * <li><code>__edmType</code> with the value "Edm.Time"
	 * <li><code>ms</code> with the number of milliseconds since midnight
	 * </ul>
	 *
	 * @extends sap.ui.model.odata.type.ODataType
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @alias sap.ui.model.odata.type.Time
	 * @param {object} [oFormatOptions]
	 *   format options as defined in {@link sap.ui.core.format.DateFormat}
	 * @param {object} [oConstraints]
	 *   constraints; {@link #validateValue validateValue} throws an error if any constraint is
	 *   violated
	 * @param {boolean|string} [oConstraints.nullable=true]
	 *   if <code>true</code>, the value <code>null</code> is accepted
	 * @public
	 * @since 1.27.0
	 */
	var Time = ODataType.extend("sap.ui.model.odata.type.Time", {
				constructor : function (oFormatOptions, oConstraints) {
					ODataType.apply(this, arguments);
					setConstraints(this, oConstraints);
					this.oFormatOptions = oFormatOptions;
			}
		});

	/**
	 * Formats the given value to the given target type
	 *
	 * @param {object} oValue
	 *   the value in model representation to be formatted.
	 * @param {string} oValue.__edmType
	 *   the type has to be "Edm.Time"
	 * @param {number} oValue.ms
	 *   the time in milliseconds
	 * @param {string} sTargetType
	 *   the target type; may be "any" or "string".
	 *   See {@link sap.ui.model.odata.type} for more information.
	 * @returns {string}
	 *   the formatted output value in the target type; <code>undefined</code> or <code>null</code>
	 *   are formatted to <code>null</code>
	 * @throws {sap.ui.model.FormatException}
	 *   if <code>sTargetType</code> is unsupported
	 * @public
	 */
	Time.prototype.formatValue = function(oValue, sTargetType) {
		if (oValue === undefined || oValue === null) {
			return null;
		}
		switch (sTargetType) {
		case "any":
			return oValue;
		case "string":
			return getFormatter(this).format(toDate(oValue));
		default:
			throw new FormatException("Don't know how to format " + this.getName() + " to "
				+ sTargetType);
		}
	};

	/**
	 * Returns the type's name.
	 *
	 * @returns {string}
	 *   the type's name
	 * @public
	 */
	Time.prototype.getName = function () {
		return "sap.ui.model.odata.type.Time";
	};

	/**
	 * Parses the given value, which is expected to be of the given type, to a time object.
	 *
	 * @param {string} sValue
	 *   the value to be parsed, maps <code>""</code> to <code>null</code>
	 * @param {string} sSourceType
	 *   the source type (the expected type of <code>sValue</code>); must be "string".
	 *   See {@link sap.ui.model.odata.type} for more information.
	 * @returns {object}
	 *   the parsed value as described in {@link #formatValue formatValue}
	 * @throws {sap.ui.model.ParseException}
	 *   if <code>sSourceType</code> is unsupported
	 * @public
	 */
	Time.prototype.parseValue = function (sValue, sSourceType) {
		var oDate;

		if (sValue === "" || sValue === null) {
			return null;
		}
		if (sSourceType !== "string") {
			throw new ParseException("Don't know how to parse " + this.getName() + " from "
				+ sSourceType);
		}
		oDate = getFormatter(this).parse(sValue);
		if (!oDate) {
			throw new ParseException(getErrorMessage(this));
		}
		return toModel(oDate);
	};

	/**
	 * Validates whether the given value in model representation is valid and meets the
	 * defined constraints.
	 *
	 * @param {object} oValue
	 *   the value to be validated
	 * @returns {void}
	 * @throws {sap.ui.model.ValidateException} if the value is not valid
	 * @public
	 */
	Time.prototype.validateValue = function (oValue) {
		if (oValue === null) {
			if (this.oConstraints && this.oConstraints.nullable === false) {
				throw new ValidateException(getErrorMessage(this));
			}
			return;
		}
		if (!isTime(oValue)) {
			throw new ValidateException("Illegal " + this.getName() + " value: "
				+ toString(oValue));
		}
	};

	/**
	 * Called by the framework when any localization setting changed.
	 * @private
	 */
	Time.prototype._handleLocalizationChange = function () {
		this.oFormat = null;
	};

	return Time;
});
