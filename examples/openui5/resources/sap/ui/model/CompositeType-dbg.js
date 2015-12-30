/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides the base implementation for all model implementations
sap.ui.define(['./FormatException', './ParseException', './SimpleType', './ValidateException'],
	function(FormatException, ParseException, SimpleType, ValidateException) {
	"use strict";
	
	/**
	 * Constructor for a new CompositeType.
	 *
	 * @class
	 * This is an abstract base class for composite types. Composite types have multiple input values and know
	 * how to merge/split them upon formatting/parsing the value. Typical use case a currency or amount values.
	 * 
	 * Subclasses of CompositeTypes can define boolean properties in the constructor:
	 * - bUseRawValues: the format and parse method will handle raw model values, types of embedded bindings are ignored
	 * - bParseWithValues: the parse method call will include the current binding values as a third parameter 
	 * 
	 * @abstract
	 *
	 * @extends sap.ui.model.SimpleType
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @param {object} [oFormatOptions] options as provided by concrete subclasses
	 * @param {object} [oConstraints] constraints as supported by concrete subclasses
	 * @public
	 * @alias sap.ui.model.CompositeType
	 */
	var CompositeType = SimpleType.extend("sap.ui.model.CompositeType", /** @lends sap.ui.model.CompositeType.prototype */ {
	
		constructor : function(oFormatOptions, oConstraints) {
			SimpleType.apply(this, arguments);
			this.sName = "CompositeType";
			this.bUseRawValues = false;
			this.bParseWithValues = false;
		},
	
		metadata : {
			"abstract" : true,
			publicMethods : []
		}
		
	});
	
	/**
	 * Format the given set of values in model representation to an output value in the given
	 * internal type. This happens according to the format options, if target type is 'string'.
	 * If aValues is not defined or null, null will be returned.
	 *
	 * @function
	 * @name sap.ui.model.CompositeType.prototype.formatValue
	 * @param {array} aValues the values to be formatted
	 * @param {string} sInternalType the target type
	 * @return {any} the formatted output value
	 *
	 * @public
	 */
	
	/**
	 * Parse a value of an internal type to the expected set of values of the model type.
	 *
	 * @function
	 * @name sap.ui.model.CompositeType.prototype.parseValue
	 * @param {any} oValue the value to be parsed
	 * @param {string} sInternalType the source type
	 * @param {array} aCurrentValues the current values of all binding parts
	 * @return {array} the parse result array
	 *
	 * @public
	 */
	
	/**
	 * Validate whether a given value in model representation is valid and meets the
	 * defined constraints (if any).
	 *
	 * @function
	 * @name sap.ui.model.CompositeType.prototype.validateValue
	 * @param {array} aValues the set of values to be validated
	 *
	 * @public
	 */
	
	/**
	 * Returns whether this composite types works on raw values or formatted values
	 */
	CompositeType.prototype.getUseRawValues = function() {
		return this.bUseRawValues;
	};
	
	/**
	 * Returns whether this composite types needs current values for parsing
	 */
	CompositeType.prototype.getParseWithValues = function() {
		return this.bParseWithValues;
	};
	
	return CompositeType;

});
