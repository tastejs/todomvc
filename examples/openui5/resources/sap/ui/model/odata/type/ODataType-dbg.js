/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

/**
 * The types in this namespace are {@link sap.ui.model.SimpleType simple types} corresponding
 * to the
 * <a href="http://www.odata.org/documentation/odata-version-2-0/overview#AbstractTypeSystem">
 * OData primitive types</a>.
 *
 * They can be used in any place where simple types are allowed (and the model representation
 * matches), but they are of course most valuable in bindings to an {@link
 * sap.ui.model.odata.v2.ODataModel ODataModel}.
 *
 * <b>Example:</b>
 * <pre>
 *   &lt;Label text="ID"/&gt;
 *   &lt;Input value="{path: 'id', type: 'sap.ui.model.odata.type.String',
 *       constraints: {nullable: false, maxLength: 10}}"/&gt;
 *   &lt;Label text="valid through"/&gt;
 *   &lt;Input value="{path: 'validThrough', type: 'sap.ui.model.odata.type.DateTime',
 *       constraints: {displayFormat: 'Date'}}"/&gt;
 * </pre>
 *
 * All types support formatting from the representation used in ODataModel ("model format") to
 * various representations used by UI elements ("target type") and vice versa. Additionally they
 * support validating a given value against the type's constraints.
 *
 * The following target types may be supported:
 * <table>
 * <tr><th>Type</th><th>Description</th></tr>
 * <tr><td><code>string</code></td><td>The value is converted to a <code>string</code>, so that it
 * can be displayed in an input field. Supported by all types.</td></tr>
 * <tr><td><code>boolean</code></td><td>The value is converted to a <code>Boolean</code>, so that
 * it can be displayed in a checkbox. Only supported by
 * {@link sap.ui.model.odata.type.Boolean}.</td></tr>
 * <tr><td><code>int</code></td><td>The value is converted to an integer (as <code>number</code>).
 * May cause truncation of decimals and overruns. Supported by all numeric types.</td></tr>
 * <tr><td><code>float</code></td><td>The value is converted to a <code>number</code>. Supported by
 * all numeric types.</td></tr>
 * <tr><td><code>any</code></td><td>A technical format. The value is simply passed through. Only
 * supported by <code>format</code>, not by <code>parse</code>. Supported by all types.</td></tr>
 * </table>
 *
 * All constraints may be given as strings besides their natural types (e.g.
 * <code>nullable: "false"</code> or <code>maxLength: "10"</code>). This makes the life of
 * template processors easier.
 *
 * <b>Handling of <code>null</code></b>:
 *
 * All types handle <code>null</code> in the same way. When formatting to <code>string</code>, it
 * is simply passed through (and <code>undefined</code> becomes <code>null</code>, too). When
 * parsing from <code>string</code>, it is also passed through.  Additionally,
 * {@link sap.ui.model.type.odata.String String} and {@link sap.ui.model.type.odata.Guid Guid}
 * convert the empty string to <code>null</code> when parsing. <code>validate</code> decides based
 * on the constraint <code>nullable</code>: If <code>false</code>, <code>null</code> is not
 * accepted and leads to a (locale-dependent) <code>ParseException</code>.
 *
 * This ensures that the user cannot clear an input field bound to an attribute with non-nullable
 * type. However it does not ensure that the user really entered something if the field was empty
 * before.
 *
 * @namespace
 * @name sap.ui.model.odata.type
 * @public
 */

sap.ui.define(['sap/ui/model/SimpleType'],
	function(SimpleType) {
	"use strict";

	/**
	 * Constructor for a new <code>ODataType</code>.
	 *
	 * @class This class is an abstract base class for all OData primitive types (see <a
	 * href="http://www.odata.org/documentation/odata-version-2-0/overview#AbstractTypeSystem">
	 * Edm Types</a>). All sub-types implement the interface of
	 * {@link sap.ui.model.SimpleType}. That means they implement next to the constructor:
	 * <ul>
	 * <li>{@link sap.ui.model.SimpleType#getName getName}</li>
	 * <li>{@link sap.ui.model.SimpleType#formatValue formatValue}</li>
	 * <li>{@link sap.ui.model.SimpleType#parseValue parseValue}</li>
	 * <li>{@link sap.ui.model.SimpleType#validateValue validateValue}</li>
	 * </ul>
	 *
	 * All ODataTypes are immutable. All format options and constraints are given to the
	 * constructor, they cannot be modified later.
	 *
	 * All ODataTypes use a locale-specific message when throwing an error caused by invalid
	 * user input (e.g. if {@link sap.ui.model.odata.type.Double#parseValue Double.parseValue}
	 * cannot parse the given value to a number, or if any type's {@link #validateValue
	 * validateValue} gets a <code>null</code>, but the constraint <code>nullable</code> is
	 * <code>false</code>).
	 *
	 * @extends sap.ui.model.SimpleType
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @alias sap.ui.model.odata.type.ODataType
	 * @param {object} [oFormatOptions]
	 *   type-specific format options; see sub-types
	 * @param {object} [oConstraints]
	 *   type-specific constraints (e.g. <code>oConstraints.nullable</code>), see sub-types
	 * @public
	 * @since 1.27.0
	 */
	var ODataType = SimpleType.extend("sap.ui.model.odata.type.ODataType", {
				constructor : function (oFormatOptions, oConstraints) {
					// do not call super constructor to avoid generation of unused objects
				},
				metadata : {
					"abstract" : true
				}
			}
		);


	/**
	 * ODataTypes are immutable and do not allow modifying the type's constraints.
	 * This function overwrites the <code>setConstraints</code> of
	 * <code>sap.ui.model.SimpleType</code> and does nothing.
	 *
	 * @param {object} [oConstraints]
	 *   constraints, see {@link #constructor}.
	 * @private
	 */
	ODataType.prototype.setConstraints = function(oConstraints) {
		// do nothing!
	};

	/**
	 * ODataTypes are immutable and do not allow modifying the type's format options.
	 * This function overwrites the <code>setFormatOptions</code> of
	 * <code>sap.ui.model.SimpleType</code> and does nothing.
	 *
	 * @param {object} [oFormatOptions]
	 *   format options, see {@link #constructor}.
	 * @private
	 */
	ODataType.prototype.setFormatOptions = function(oFormatOptions) {
		// do nothing!
	};

	return ODataType;
});
