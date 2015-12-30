/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(['sap/ui/model/odata/type/DateTimeBase'],
	function(DateTimeBase) {
	"use strict";

	/**
	 * Adjusts the constraints for DateTimeBase.
	 *
	 * @param {sap.ui.model.odata.type.DateTimeOffset} oType
	 *   the type
	 * @param {object} [oConstraints]
	 *   constraints, see {@link #constructor}
	 * @returns {object}
	 *   the constraints adjusted for DateTimeBase
	 */
	function adjustConstraints(oType, oConstraints) {
		return {
			nullable: oConstraints && oConstraints.nullable
		};
	}

	/**
	 * Constructor for a primitive type <code>Edm.DateTimeOffset</code>.
	 *
	 * @class This class represents the OData primitive type <a
	 * href="http://www.odata.org/documentation/odata-version-2-0/overview#AbstractTypeSystem">
	 * <code>Edm.DateTimeOffset</code></a>.
	 *
	 * In {@link sap.ui.model.odata.v2.ODataModel ODataModel} this type is represented as a
	 * <code>Date</code> in local time.
	 *
	 * @extends sap.ui.model.odata.type.DateTimeBase
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @alias sap.ui.model.odata.type.DateTimeOffset
	 * @param {object} [oFormatOptions]
	 *   format options as defined in {@link sap.ui.core.format.DateFormat}
	 * @param {object} [oConstraints]
	 *   constraints; {@link sap.ui.model.odata.type.DateTimeBase#validateValue validateValue}
	 *   throws an error if any constraint is violated
	 * @param {boolean|string} [oConstraints.nullable=true]
	 *   if <code>true</code>, the value <code>null</code> is accepted
	 * @public
	 * @since 1.27.0
	 */
	var DateTimeOffset = DateTimeBase.extend("sap.ui.model.odata.type.DateTimeOffset", {
				constructor : function (oFormatOptions, oConstraints) {
					DateTimeBase.call(this, oFormatOptions, adjustConstraints(this, oConstraints));
				}
			}
		);

	/**
	 * Returns the type's name.
	 *
	 * @returns {string}
	 *   the type's name
	 * @public
	 */
	DateTimeOffset.prototype.getName = function () {
		return "sap.ui.model.odata.type.DateTimeOffset";
	};

	return DateTimeOffset;
});
