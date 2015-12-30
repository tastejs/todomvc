/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(['sap/ui/model/FormatException', 'sap/ui/model/odata/type/ODataType',
		'sap/ui/model/ParseException', 'sap/ui/model/ValidateException',
		'sap/ui/model/type/String'],
	function(FormatException, ODataType, ParseException, ValidateException, StringType) {
	"use strict";

	/**
	 * Sets the constraints.
	 *
	 * @param {sap.ui.model.odata.type.String} oType
	 *   the type instance
	 * @param {object} [oConstraints]
	 *   constraints, see {@link #constructor}
	 */
	function setConstraints(oType, oConstraints) {
		var vMaxLength, vNullable;

		oType.oConstraints = undefined;
		if (oConstraints) {
			vMaxLength = oConstraints.maxLength;
			if (typeof vMaxLength === "string") {
				vMaxLength = parseInt(vMaxLength, 10);
			}
			if (typeof vMaxLength === "number" && !isNaN(vMaxLength) && vMaxLength > 0) {
				oType.oConstraints = {maxLength: vMaxLength};
			} else if (vMaxLength !== undefined) {
				jQuery.sap.log.warning("Illegal maxLength: " + oConstraints.maxLength,
					null, oType.getName());
			}

			vNullable = oConstraints.nullable;
			if (vNullable === false || vNullable === "false") {
				oType.oConstraints = oType.oConstraints || {};
				oType.oConstraints.nullable = false;
			} else if (vNullable !== undefined && vNullable !== true && vNullable !== "true") {
				jQuery.sap.log.warning("Illegal nullable: " + vNullable, null, oType.getName());
			}
		}
	}

	/**
	 * Constructor for an OData primitive type <code>Edm.String</code>.
	 *
	 * @class This class represents the OData primitive type <a
	 * href="http://www.odata.org/documentation/odata-version-2-0/overview#AbstractTypeSystem">
	 * <code>Edm.String</code></a>.
	 *
	 * In {@link sap.ui.model.odata.v2.ODataModel ODataModel} this type is represented as a
	 * <code>string</code>.
	 *
	 * @extends sap.ui.model.odata.type.ODataType
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @alias sap.ui.model.odata.type.String
	 * @param {object} [oFormatOptions]
	 *   format options as defined in the interface of {@link sap.ui.model.SimpleType}; this
	 *   type ignores them since it does not support any format options
	 * @param {object} [oConstraints]
	 *   constraints; {@link #validateValue validateValue} throws an error if any constraint is
	 *   violated
	 * @param {int|string} [oConstraints.maxLength]
	 *   the maximal allowed length of the string; unlimited if not defined
	 * @param {boolean|string} [oConstraints.nullable=true]
	 *   if <code>true</code>, the value <code>null</code> is accepted
	 * @public
	 * @since 1.27.0
	 */
	var EdmString = ODataType.extend("sap.ui.model.odata.type.String", {
				constructor : function (oFormatOptions, oConstraints) {
					ODataType.apply(this, arguments);
					setConstraints(this, oConstraints);
				}
			}
		);

	/**
	 * Formats the given value to the given target type.
	 *
	 * @param {string} sValue
	 *   the value to be formatted
	 * @param {string} sTargetType
	 *   the target type; may be "any" or "string".
	 *   See {@link sap.ui.model.odata.type} for more information.
	 * @returns {string|number|boolean}
	 *   the formatted output value in the target type; <code>undefined</code> or <code>null</code>
	 *   are formatted to <code>null</code>
	 * @throws {sap.ui.model.FormatException}
	 *   if <code>sTargetType</code> is unsupported or the string cannot be formatted to the target
	 *   type
	 * @function
	 * @public
	 */
	EdmString.prototype.formatValue = StringType.prototype.formatValue;

	/**
	 * Parses the given value which is expected to be of the given type to a string.
	 *
	 * @param {string|number|boolean} vValue
	 *   the value to be parsed, maps <code>""</code> to <code>null</code>
	 * @param {string} sSourceType
	 *   the source type (the expected type of <code>vValue</code>); must be "string".
	 *   See {@link sap.ui.model.odata.type} for more information.
	 * @returns {string}
	 *   the parsed value
	 * @throws {sap.ui.model.ParseException}
	 *   if <code>sSourceType</code> is unsupported
	 * @public
	 */
	EdmString.prototype.parseValue = function (vValue, sSourceType) {
		return vValue === "" ? null : StringType.prototype.parseValue.apply(this, arguments);
	};

	/**
	 * Validates whether the given value in model representation is valid and meets the
	 * defined constraints.
	 *
	 * @param {string} sValue
	 *   the value to be validated
	 * @returns {void}
	 * @throws {sap.ui.model.ValidateException} if the value is not valid
	 * @public
	 */
	EdmString.prototype.validateValue = function (sValue) {
		var oConstraints = this.oConstraints || {},
			iMaxLength = oConstraints.maxLength;

		if (sValue === null) {
			if (oConstraints.nullable !== false) {
				return;
			}
		} else if (typeof sValue !== "string") {
			throw new ValidateException("Illegal " + this.getName() + " value: " + sValue);
		} else if (!iMaxLength || sValue.length <= iMaxLength) {
			return;
		}
		throw new ValidateException(sap.ui.getCore().getLibraryResourceBundle().getText(
			iMaxLength ? "EnterTextMaxLength" : "EnterText", [iMaxLength]));
	};

	/**
	 * Returns the type's name.
	 *
	 * @returns {string}
	 *   the type's name
	 * @public
	 */
	EdmString.prototype.getName = function () {
		return "sap.ui.model.odata.type.String";
	};

	return EdmString;
});
