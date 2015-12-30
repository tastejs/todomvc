/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides the base implementation for all model implementations
sap.ui.define(['sap/ui/base/DataType', './FormatException', './ParseException', './Type', './ValidateException'],
	function(DataType, FormatException, ParseException, Type, ValidateException) {
	"use strict";


	
	/**
	 * Constructor for a new SimpleType.
	 *
	 * @class
	 * This is an abstract base class for simple types.
	 * @abstract
	 *
	 * @extends sap.ui.model.Type
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @param {object} [oFormatOptions] options as provided by concrete subclasses
	 * @param {object} [oConstraints] constraints as supported by concrete subclasses
	 * @public
	 * @alias sap.ui.model.SimpleType
	 */
	var SimpleType = Type.extend("sap.ui.model.SimpleType", /** @lends sap.ui.model.SimpleType.prototype */ {
	
		constructor : function(oFormatOptions, oConstraints) {
			Type.apply(this, arguments);
			this.setFormatOptions(oFormatOptions || {});
			this.setConstraints(oConstraints || {});
			this.sName = "SimpleType";
		},
	
	  metadata : {
			"abstract" : true,
			publicMethods : [
			"setConstraints", "setFormatOptions", "formatValue", "parseValue", "validateValue"
		  ]
	  }
		
	});
	
	/**
	 * Format the given value in model representation to an output value in the given
	 * internal type. This happens according to the format options, if target type is 'string'.
	 * If oValue is not defined or null, null will be returned.
	 *
	 * @function
	 * @name sap.ui.model.SimpleType.prototype.formatValue
	 * @param {any} oValue the value to be formatted
	 * @param {string} sInternalType the target type
	 * @return {any} the formatted output value
	 *
	 * @public
	 */
	
	/**
	 * Parse a value of an internal type to the expected value of the model type.
	 *
	 * @function
	 * @name sap.ui.model.SimpleType.prototype.parseValue
	 * @param {any} oValue the value to be parsed
	 * @param {string} sInternalType the source type
	 * @return {any} the parse result
	 *
	 * @public
	 */
	
	/**
	 * Validate whether a given value in model representation is valid and meets the
	 * defined constraints (if any).
	 *
	 * @function
	 * @name sap.ui.model.SimpleType.prototype.validateValue
	 * @param {any} oValue the value to be validated
	 *
	 * @public
	 */
	
	/**
	 * Sets constraints for this type. This is meta information used when validating the
	 * value, to ensure it meets certain criteria, e.g. maximum length, minimal amount
	 *
	 * @param {object} oConstraints the constraints to set for this type
	 */
	SimpleType.prototype.setConstraints = function(oConstraints) {
		this.oConstraints = oConstraints;
	};
	
	/**
	 * Set format options for this type. This is meta information used when formatting and
	 * parsing values, such as patterns for number and date formatting or maximum length
	 *
	 * @param {object} oFormatOptions the options to set for this type
	 */
	SimpleType.prototype.setFormatOptions = function(oFormatOptions) {
		this.oFormatOptions = oFormatOptions;
	};

	/**
	 * Returns the primitive type name for the given internal type name
	 *
	 * @param {string} sInternalType the internal type name
	 * @return {string} the primitive type name
	 */
	SimpleType.prototype.getPrimitiveType = function(sInternalType) {
		// Avoid dealing with type objects, unless really necessary
		switch (sInternalType) {
			case "any": 
			case "boolean":
			case "int":
			case "float":
			case "string":
			case "object":
				return sInternalType;
			default:
				var oInternalType = DataType.getType(sInternalType);
				return oInternalType && oInternalType.getPrimitiveType().getName();
		}
	};

	return SimpleType;

});
