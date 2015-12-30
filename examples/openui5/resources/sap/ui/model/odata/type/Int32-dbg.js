/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(['sap/ui/model/odata/type/Int'],
	function(Int) {
	"use strict";

	var oRange = {minimum: -2147483648, maximum: 2147483647};

	/**
	 * Constructor for a primitive type <code>Edm.Int32</code>.
	 *
	 * @class This class represents the OData primitive type <a
	 * href="http://www.odata.org/documentation/odata-version-2-0/overview#AbstractTypeSystem">
	 * <code>Edm.Int32</code></a>.
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
	 * @alias sap.ui.model.odata.type.Int32
	 * @param {object} [oFormatOptions]
	 *   format options as defined in {@link sap.ui.core.format.NumberFormat}. In contrast to
	 *   NumberFormat <code>groupingEnabled</code> defaults to <code>true</code>.
	 * @param {object} [oConstraints]
	 *   constraints; {@link sap.ui.model.odata.type.Int#validateValue validateValue} throws an
	 *   error if any constraint is violated
	 * @param {boolean|string} [oConstraints.nullable=true]
	 *   if <code>true</code>, the value <code>null</code> is accepted
	 * @public
	 * @since 1.27.0
	 */
	var Int32 = Int.extend("sap.ui.model.odata.type.Int32", {
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
	Int32.prototype.getName = function () {
		return "sap.ui.model.odata.type.Int32";
	};

	/**
	 * Returns the type's supported range as object with properties <code>minimum</code> and
	 * <code>maximum</code>.
	 *
	 * @returns {object} the range
	 * @protected
	 */
	Int32.prototype.getRange = function () {
		return oRange;
	};

	return Int32;
});
