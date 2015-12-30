/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(['sap/ui/model/odata/type/Int'],
	function(Int) {
	"use strict";

	var oRange = {minimum: -128, maximum: 127};

	/**
	 * Constructor for a primitive type <code>Edm.SByte</code>.
	 *
	 * @class This class represents the OData primitive type <a
	 * href="http://www.odata.org/documentation/odata-version-2-0/overview#AbstractTypeSystem">
	 * <code>Edm.SByte</code></a>.
	 *
	 * In {@link sap.ui.model.odata.v2.ODataModel ODataModel} this type is represented as a
	 * <code>number</code>.
	 *
	 * @extends sap.ui.model.odata.type.Int
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @alias sap.ui.model.odata.type.SByte
	 * @param {object} [oFormatOptions]
	 *   format options as defined in {@link sap.ui.core.format.NumberFormat}
	 * @param {object} [oConstraints]
	 *   constraints; {@link sap.ui.model.odata.type.Int#validateValue validateValue} throws an
	 *   error if any constraint is violated
	 * @param {boolean|string} [oConstraints.nullable=true]
	 *   if <code>true</code>, the value <code>null</code> is accepted
	 * @public
	 * @since 1.27.0
	 */
	var SByte = Int.extend("sap.ui.model.odata.type.SByte", {
			constructor : function () {
				Int.apply(this, arguments);
			}
		});

	/**
	 * Returns the type's name.
	 *
	 * @returns {string}
	 *   the type's name
	 * @public
	 */
	SByte.prototype.getName = function () {
		return "sap.ui.model.odata.type.SByte";
	};

	/**
	 * Returns the type's supported range as object with properties <code>minimum</code> and
	 * <code>maximum</code>.
	 *
	 * @returns {object} the range
	 * @protected
	 */
	SByte.prototype.getRange = function () {
		return oRange;
	};

	return SByte;
});
