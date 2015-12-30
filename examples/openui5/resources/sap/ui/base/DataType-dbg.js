/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides class sap.ui.base.DataType
sap.ui.define(['jquery.sap.global'],
	function(jQuery) {
	"use strict";


	/**
	 * @class Describes the metadata of a data type and provides methods for validation.
	 * @author Frank Weigel
	 * @since 0.9.0
	 * @alias sap.ui.base.DataType
	 */
	var DataType = function() {
		// Avoid construction of a DataType.
		// DataType is only a function to support the "instanceof" operator.
		throw new Error();
	};
	
	/**
	 * The qualified name of the data type.
	 * Note that this name usually equals the design time name of the type.
	 * Only for primitive types it differs, namely it omits the package 'sap.ui.core'.
	 * @return {string} name of the data type
	 * @public
	 */
	DataType.prototype.getName = function() {
		return undefined;
	};
	
	/**
	 * The base type of this type or undefined if this is a primitive type.
	 * @return {sap.ui.base.DataType} base type or undefined
	 * @public
	 */
	DataType.prototype.getBaseType = function() {
		return undefined;
	};
	
	/**
	 * The primitive base type of this type or the primitive type itself.
	 * @return {sap.ui.base.DataType} the primitive type
	 * @public
	 */
	DataType.prototype.getPrimitiveType = function() {
		/*eslint-disable consistent-this*/
		var oType = this;
		/*eslint-enable consistent-this*/
		while (oType.getBaseType()) {
			oType = oType.getBaseType();
		}
		return oType;
	};
	
	/**
	 * The component type of this type or undefined if this is not an array.
	 * @return {sap.ui.base.DataType} component type or undefined
	 * @public
	 */
	DataType.prototype.getComponentType = function() {
		return undefined;
	};
	
	/**
	 * The default value for this type. Each type must define a default value.
	 * @return {any} default value of the data type. The type of the returned value
	 *    must match the JavaScript type of the data type (a string for string types etc.)
	 * @public
	 */
	DataType.prototype.getDefaultValue = function() {
		return undefined;
	};
	
	/**
	 * Whether this type is an array type.
	 * @return {boolean} whether this type is an array type
	 * @public
	 */
	DataType.prototype.isArrayType = function() {
		return undefined;
	};
	
	/**
	 * Parses the given string value and converts it into the specific data type.
	 * @param {string} sValue string representation for a value of this type
	 * @return the value in the correct internal format
	 * @public
	 */
	DataType.prototype.parseValue = function(sValue) {
		// currently this function considers to handle primitive values
		// - in future may be other values might be also relevant.
		var sType = this.getName();
		if (sType == "string") {
			return sValue;
		} else if (sType == "boolean") {
			return sValue == "true";
		} else if (sType == "int") {
			return parseInt(sValue, 10);
		} else if (sType == "float") {
			return parseFloat(sValue);
		} else if (sType == "object") {
			return sValue ? jQuery.parseJSON(sValue) : null;
		} else {
			// support for other types like e.g.
			// sap.ui.core.CSSSize (just apply)
			return sValue;
		}
	};
	
	/**
	 * A validation check. To be implemented by concrete types.
	 * @param {any} vValue the value to be checked
	 * @return {boolean} whether the given value is valid for this data type (without conversion)
	 * @public
	 */
	DataType.prototype.isValid = undefined;
	
	/**
	 * Sets the normalizer function for that data type
	 * 
	 * @param {function} fnNormalizer the function to call for normalizing. Will be called with the value
	 * as the first parameter. It must return the (normalized) value.
	 * @public
	 */
	DataType.prototype.setNormalizer = function(fnNormalizer) {
		jQuery.sap.assert(typeof fnNormalizer === "function", "DataType.setNormalizer: fnNormalizer must be a function");
		this._fnNormalizer = fnNormalizer;
	};
	
	/**
	 * Changes a value using the normalizer specified for this datatype
	 * 
	 * @param {object} oValue the value to be normalized
	 * @return the normalized value
	 * @public
	 */
	DataType.prototype.normalize = function(oValue) {
		if (typeof this._fnNormalizer === "function") {
			return this._fnNormalizer(oValue);
		} else {
			return oValue;
		}
	};
	
	
	(function() {
	
		function createType(sName, mSettings, oBase) {
	
			jQuery.sap.assert(typeof sName === "string" && !!sName, "DataType.<createType>: type name must be a string");
			jQuery.sap.assert(!oBase || oBase instanceof DataType, "DataType.<createType>: base type must be empty or a DataType");
			mSettings = mSettings || {};
	
			// create a new type object with the base type as prototype
			var oBaseObject = oBase || DataType.prototype;
			var oType = jQuery.sap.newObject(oBaseObject);
	
			// getter for the name
			oType.getName = function() {
				return sName;
			};
	
			// if a default value is specified, create a getter for it
			if ( mSettings.hasOwnProperty("defaultValue") ) {
				var vDefault = mSettings.defaultValue;
				oType.getDefaultValue = function() {
					return vDefault;
				};
			}
	
			// if a validator is specified either chain it with the base type validator
			// or set it if no base validator exists
			if ( mSettings.hasOwnProperty("isValid") ) {
				var fnIsValid = mSettings.isValid;
				oType.isValid = oBaseObject.isValid ? function(vValue) {
					if ( !oBaseObject.isValid(vValue) ) {
						return false;
					}
					return fnIsValid(vValue);
				} : fnIsValid;
			}
	
			// not an array type
			oType.isArrayType = function() {
				return false;
			};
			
			// return the base type
			oType.getBaseType = function() {
				return oBase;
			};
			
			return oType;
		}
	
		function createArrayType(componentType) {
			jQuery.sap.assert(componentType instanceof DataType, "DataType.<createArrayType>: componentType must be a DataType");
	
			// create a new type object with the base type as prototype
			var oType = jQuery.sap.newObject(DataType.prototype);
	
			// getter for the name
			oType.getName = function() {
				return componentType.getName() + "[]";
			};
	
			// getter for component type
			oType.getComponentType = function() {
				return componentType;
			};
	
			// array validator
			oType.isValid = function(aValues) {
				if (aValues === null) {
					return true;
				}
				if (jQuery.isArray(aValues)) {
					for (var i = 0; i < aValues.length; i++) {
						if (!componentType.isValid(aValues[i])) {
							return false;
						}
					}
					return true;
				}
				return false;
			};
	
			// array parser
			oType.parseValue = function(sValue) {
				var aValues = sValue.split(",");
				for (var i = 0; i < aValues.length; i++) {
					aValues[i] = componentType.parseValue(aValues[i]);
				}
				return aValues;
			};
	
			// is an array type
			oType.isArrayType = function() {
				return true;
			};
	
			// return the base type
			oType.getBaseType = function() {
				return mHiddenTypes.array;
			};
			
			return oType;
		}
	
		function createEnumType(sTypeName, oEnum) {
			
			var mValues = {},
				sDefaultValue;
			for (var sName in oEnum) {
				var sValue = oEnum[sName];
				// the first entry will become the default value
				if (!sDefaultValue) {
					sDefaultValue = sValue;
				}
				if ( typeof sValue !== "string") {
					throw new Error("Value " + sValue + " for enum type " + sTypeName + " is not a string"); 
				}
				// if there are multiple entries with the same value, the one where name
				// and value are matching is taken
				if (!mValues.hasOwnProperty(sValue) || sName == sValue) {
					mValues[sValue] = sName;
				}
			}
			
			var oType = jQuery.sap.newObject(DataType.prototype);

			// getter for the name
			oType.getName = function() { return sTypeName; };

			// enum validator
			oType.isValid = function(v) {
				return typeof v === "string" && mValues.hasOwnProperty(v);
			};

			// enum parser
			oType.parseValue = function(sValue) {
				return oEnum[sValue];
			};

			// default value
			oType.getDefaultValue = function() {
				return sDefaultValue;
			};

			// return the base type
			oType.getBaseType = function() {
				return mTypes.string;
			};
			
			return oType;
		}

		var mTypes = {
	
			"any" :
					createType("any", {
						defaultValue : null,
						isValid : function(vValue) {
							return true;
						}
					}),
	
			"boolean" :
				createType("boolean", {
					defaultValue : false,
					isValid : function(vValue) {
						return typeof vValue === "boolean";
					}
				}),
	
			"int" :
				createType("int", {
					defaultValue : 0,
					isValid : function(vValue) {
						return typeof vValue === "number" && Math.floor(vValue) == vValue;
					}
				}),
	
			"float" :
				createType("float", {
					defaultValue : 0.0,
					isValid : function(vValue) {
						return typeof vValue === "number";
					}
				}),
	
			"string" :
				createType("string", {
					defaultValue : "",
					isValid : function(vValue) {
						return typeof vValue === "string" || vValue instanceof String;
					}
				}),
			"object" :
				createType("object", {
					defaultValue : null,
					isValid : function(vValue) {
						return typeof vValue === "object" || typeof vValue === "function";
					}
				})
		};
		
		// Array type is not part of public types to avoid direct usage as property type
		var mHiddenTypes = {

			"array" :
				createType("array", {
					defaultValue : [],
					isValid : function(vValue) {
						return jQuery.isArray(vValue);
					}
				})
		};
	
		/**
		 * Returns the type object for the type with the given name.
		 * 
		 * @param {string} sTypeName name of the type to be retrieved 
		 * @return the type object or undefined when no such type object exists.
		 * @public
		 */
		DataType.getType = function(sTypeName) {
			var oType = mTypes[sTypeName];
			if ( !oType ) {
				// check for array types
				if (sTypeName.indexOf("[]") > 0) {
					var sComponentTypeName = sTypeName.slice(0, -2),
						oComponentType = this.getType(sComponentTypeName);
					oType = oComponentType && createArrayType(oComponentType);
					if ( oType ) {
						mTypes[sTypeName] = oType;
					}
					return oType;
				} else {
					oType = jQuery.sap.getObject(sTypeName);
					if ( oType instanceof DataType ) {
						mTypes[sTypeName] = oType;
					} else if ( jQuery.isPlainObject(oType) ) {
						oType = mTypes[sTypeName] = createEnumType(sTypeName, oType);
					}
				}
			}
			return oType;
		};
	
		/**
		 * Creates a new type as a subtype of a given type.
		 * @param {string} sName the unique name of the new type
		 * @param {object} [mSettings settings] for the new type
		 * @param {any} [mSettings.defaultValue] the default value for the new type
		 * @param {function} [mSettings.isValid] a validator function for values of the new type
		 * @param {sap.ui.base.DataType} [base] the base type for the new type
		 * @public
		 */
		DataType.createType = createType;
	
		// ---- minimal support for interface types ----
		
		var mInterfaces = {};
		
		/**
		 * Registers the given array of type names as known interface types.
		 * Only purpose is to enable the {@link #isInterfaceType} check.
		 * @param {string[]} aTypes interface types to be reigstered  
		 * @private
		 */
		DataType.registerInterfaceTypes = function(aTypes) {
			for (var i = 0; i < aTypes.length; i++) {
				jQuery.sap.setObject(aTypes[i], mInterfaces[aTypes[i]] = new String(aTypes[i]));
			}
		};
		
		/**
		 * @param {string} sType name of type to check
		 * @return {boolean} whether the given type is known to be an interface type
		 * @private 
		 */
		DataType.isInterfaceType = function(sType) {
			return mInterfaces.hasOwnProperty(sType) && jQuery.sap.getObject(sType) === mInterfaces[sType];
		};
	
	}());

	return DataType;

}, /* bExport= */ true);
