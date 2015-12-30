/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(['sap/ui/core/Core', 'sap/ui/model/FormatException',
		'sap/ui/model/odata/type/ODataType', 'sap/ui/model/ParseException',
		'sap/ui/model/ValidateException'],
	function(Core, FormatException, ODataType, ParseException, ValidateException) {
	"use strict";

	/**
	 * Returns the locale-dependent error message for the type.
	 *
	 * @returns {string}
	 *   the locale-dependent error message
	 */
	function getErrorMessage() {
		return getMessage("EnterYesOrNo", [getText(true), getText(false)]);
	}

	/**
	 * Returns the locale-dependent text for the given key. Fetches the resource bundle
	 * and stores it in the type if necessary.
	 *
	 * @param {string} sKey
	 *   the key
	 * @param {any[]} aParameters
	 *   the parameters
	 * @returns {string}
	 *   the locale-dependent text for the key
	 */
	function getMessage(sKey, aParameters) {
		return sap.ui.getCore().getLibraryResourceBundle().getText(sKey, aParameters);
	}

	/**
	 * Returns the locale-dependent text for the given boolean value. Fetches the resource bundle
	 * and stores it in the type if necessary.
	 *
	 * @param {boolean} bValue
	 *   the value
	 * @returns {string}
	 *   the locale-dependent text for the value
	 */
	function getText(bValue) {
		return getMessage(bValue ? "YES" : "NO");
	}

	/**
	 * Sets the constraints.
	 *
	 * @param {sap.ui.model.odata.type.Boolean} oType
	 *   the type instance
	 * @param {object} [oConstraints]
	 *   constraints, see {@link #constructor}
	 */
	function setConstraints(oType, oConstraints) {
		var vNullable = oConstraints && oConstraints.nullable;

		oType.oConstraints = undefined;
		if (vNullable === false || vNullable === "false") {
			oType.oConstraints = {nullable : false};
		} else if (vNullable !== undefined && vNullable !== true && vNullable !== "true") {
			jQuery.sap.log.warning("Illegal nullable: " + vNullable, null, oType.getName());
		}
	}

	/**
	 * Constructor for an OData primitive type <code>Edm.Boolean</code>.
	 *
	 * @class This class represents the OData primitive type <a
	 * href="http://www.odata.org/documentation/odata-version-2-0/overview#AbstractTypeSystem">
	 * <code>Edm.Boolean</code></a>.
	 *
	 * In {@link sap.ui.model.odata.v2.ODataModel ODataModel} this type is represented as a
	 * <code>boolean</code>.
	 *
	 * @extends sap.ui.model.odata.type.ODataType
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @alias sap.ui.model.odata.type.Boolean
	 * @param {object} [oFormatOptions]
	 *   format options as defined in the interface of {@link sap.ui.model.SimpleType}; this
	 *   type ignores them since it does not support any format options
	 * @param {object} [oConstraints]
	 *   constraints; {@link #validateValue validateValue} throws an error if any constraint is
	 *   violated
	 * @param {boolean|string} [oConstraints.nullable=true]
	 *   if <code>true</code>, the value <code>null</code> is accepted
	 * @public
	 * @since 1.27.0
	 */
	var EdmBoolean = ODataType.extend("sap.ui.model.odata.type.Boolean", {
				constructor : function (oFormatOptions, oConstraints) {
					ODataType.apply(this, arguments);
					setConstraints(this, oConstraints);
				}
			}
		);

	/**
	 * Formats the given boolean value to the given target type.
	 *
	 * @param {boolean} bValue
	 *   the value to be formatted
	 * @param {string} sTargetType
	 *   the target type; may be "any", "boolean" or "string". If it is "string", the result is
	 *   "Yes" or "No" in the current {@link sap.ui.core.Configuration#getLanguage language}.
	 *   See {@link sap.ui.model.odata.type} for more information.
	 * @returns {boolean|string}
	 *   the formatted output value in the target type; <code>undefined</code> or <code>null</code>
	 *   are formatted to <code>null</code>
	 * @throws {sap.ui.model.FormatException}
	 *   if <code>sTargetType</code> is unsupported
	 * @public
	 */
	EdmBoolean.prototype.formatValue = function (bValue, sTargetType) {
		if (bValue === null || bValue === undefined) {
			return null;
		}
		switch (sTargetType) {
		case "any":
		case "boolean":
			return bValue;
		case "string":
			return getText(bValue);
		default:
			throw new FormatException("Don't know how to format " + this.getName() + " to "
				+ sTargetType);
		}
	};

	/**
	 * Parses the given value from the given type to a boolean.
	 *
	 * @param {boolean|string} vValue
	 *   the value to be parsed; the empty string and <code>null</code> are parsed to
	 *   <code>null</code>
	 * @param {string} sSourceType
	 * 	 the source type (the expected type of <code>vValue</code>); may be "boolean" or "string".
	 *   See {@link sap.ui.model.odata.type} for more information.
	 * @returns {boolean}
	 *   the parsed value
	 * @throws {sap.ui.model.ParseException}
	 *   if <code>sSourceType</code> is unsupported or if the given string is neither "Yes" nor
	 *   "No" in the current {@link sap.ui.core.Configuration#getLanguage language}.
	 * @public
	 */
	EdmBoolean.prototype.parseValue = function(vValue, sSourceType) {
		var sValue;

		if (vValue === null || vValue === "") {
			return null;
		}
		switch (sSourceType) {
			case "boolean":
				return vValue;
			case "string":
				sValue = vValue.trim().toLowerCase();
				if (sValue === getText(true).toLowerCase()) {
					return true;
				}
				if (sValue === getText(false).toLowerCase()) {
					return false;
				}
				throw new ParseException(getErrorMessage());
			default:
				throw new ParseException("Don't know how to parse " + this.getName() + " from "
					+ sSourceType);
		}
	};

	/**
	 * Validates whether the given value in model representation is valid and meets the given
	 * constraints.
	 *
	 * @param {boolean} bValue
	 *   the value to be validated
	 * @returns {void}
	 * @throws {sap.ui.model.ValidateException} if the value is not valid
	 * @public
	 */
	EdmBoolean.prototype.validateValue = function (bValue) {
		if (bValue === null) {
			if (this.oConstraints && this.oConstraints.nullable === false) {
				throw new ValidateException(getErrorMessage());
			}
			return;
		}
		if (typeof bValue !== "boolean") {
			// This is a "technical" error by calling validate w/o parse
			throw new ValidateException("Illegal " + this.getName() + " value: " + bValue);
		}
	};

	/**
	 * Returns the type's name.
	 *
	 * @returns {string}
	 *   the type's name
	 * @public
	 */
	EdmBoolean.prototype.getName = function () {
		return "sap.ui.model.odata.type.Boolean";
	};

	return EdmBoolean;
});
