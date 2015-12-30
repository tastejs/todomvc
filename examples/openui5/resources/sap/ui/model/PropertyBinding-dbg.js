/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides an abstract property binding.
sap.ui.define(['jquery.sap.global', './Binding', './SimpleType','./DataState'],
	function(jQuery, Binding, SimpleType, DataState) {
	"use strict";


	/**
	 * Constructor for PropertyBinding
	 *
	 * @class 
	 * The PropertyBinding is used to access single data values in the data model.
	 *
	 * @param {sap.ui.model.Model} oModel
	 * @param {string} sPath
	 * @param {sap.ui.model.Context} oContext
	 * @param {object} [mParameters]
	 * 
	 * @public
	 * @alias sap.ui.model.PropertyBinding
	 * @extends sap.ui.model.Binding
	 */
	
	var PropertyBinding = Binding.extend("sap.ui.model.PropertyBinding", /** @lends sap.ui.model.PropertyBinding.prototype */ {
	
		constructor : function (oModel, sPath, oContext, mParameters) {
			Binding.apply(this, arguments);
			this.vInvalidValue = null;
		},
		metadata : {
			"abstract" : true,
			
		  publicMethods : [
			  "getValue", "setValue", "setType", "getType", "setFormatter", "getFormatter", "getExternalValue", "setExternalValue", "getBindingMode"
		  ]
		}
	
	});
	
	// the 'abstract methods' to be implemented by child classes
	/**
	 * Returns the current value of the bound target
	 *
	 * @function
	 * @name sap.ui.model.PropertyBinding.prototype.getValue
	 * @return {object} the current value of the bound target
	 *
	 * @public
	 */
	
	/**
	 * Sets the value for this binding. A model implementation should check if the current default binding mode permits
	 * setting the binding value and if so set the new value also in the model.
	 *
	 * @function
	 * @name sap.ui.model.PropertyBinding.prototype.setValue
	 * @param {object} oValue the value to set for this binding
	 *
	 * @public
	 */
	
	/**
	 * Returns the current external value of the bound target which is formatted via a type or formatter function. 
	 *
	 * @throws sap.ui.model.FormatException
	 *
	 * @return {object} the current value of the bound target
	 *
	 * @public
	 */
	PropertyBinding.prototype.getExternalValue = function() {
		return this._toExternalValue(this.getValue());
	};
	
	/**
	 * Returns the current external value of the given value which is formatted via a type or formatter function. 
	 *
	 * @throws sap.ui.model.FormatException
	 *
	 * @return {object} the current value of the bound target
	 *
	 * @private
	 */
	PropertyBinding.prototype._toExternalValue = function(oValue) {
		if (this.oType) {
			oValue = this.oType.formatValue(oValue, this.sInternalType);
		}
		if (this.fnFormatter) {
			oValue = this.fnFormatter(oValue);
		}
		return oValue;
	};
	
	
	/**
	 * Sets the value for this binding. The value is parsed and validated against its type and then set to the binding.
	 * A model implementation should check if the current default binding mode permits
	 * setting the binding value and if so set the new value also in the model.
	 *
	 * @param {object} oValue the value to set for this binding
	 * 
	 * @throws sap.ui.model.ParseException
	 * @throws sap.ui.model.ValidateException
	 *
	 * @public
	 */
	PropertyBinding.prototype.setExternalValue = function(oValue) {
		
		// formatter doesn't support two way binding
		if (this.fnFormatter) {
			jQuery.sap.log.warning("Tried to use twoway binding, but a formatter function is used");
			return;
		}
		try {
			if (this.oType) {
				oValue = this.oType.parseValue(oValue, this.sInternalType);
				this.oType.validateValue(oValue);
			}
		} catch (oException) {
			this.vInvalidValue = oValue;
			this.checkDataState(); //data ui state is dirty inform the control
			throw oException;
		}
		// if no type specified set value directly
		this.vInvalidValue = null;
		this.setValue(oValue);
	};
	
	/**
	 * Sets the optional type and internal type for the binding. The type and internal type are used to do the parsing/formatting correctly.
	 * The internal type is the property type of the element which the value is formatted to.  
	 *
	 * @param {sap.ui.model.Type} oType the type for the binding
	 * @param {String} sInternalType the internal type of the element property which this binding is bound against.
	 * 
	 * @public
	 */
	PropertyBinding.prototype.setType = function(oType, sInternalType) {
		this.oType = oType;
		this.sInternalType = sInternalType;
	};
	
	/**
	 *  Returns the type if any for the binding.
	 *  @returns {sap.ui.model.Type} the binding type
	 *  @public
	 */
	PropertyBinding.prototype.getType = function() {
		return this.oType;
	};
	
	/**
	 * Sets the optional formatter function for the binding.
	
	 * @param {function} fnFormatter the formatter function for the binding
	 * 
	 * @public
	 */
	PropertyBinding.prototype.setFormatter = function(fnFormatter) {
		this.fnFormatter = fnFormatter;
	};
	
	/**
	 *  Returns the formatter function
	 *  @returns {Function} the formatter function
	 *  @public
	 */
	PropertyBinding.prototype.getFormatter = function() {
		return this.fnFormatter;
	};
	
	/**
	 *  Returns the binding mode 
	 *  @returns {sap.ui.model.BindingMode} the binding mode
	 *  @public
	 */
	PropertyBinding.prototype.getBindingMode = function() {
		return this.sMode;
	};
	
	/**
	 * Sets the binding mode 
	 * @param {sap.ui.model.BindingMode} sBindingMode the binding mode
	 * @protected
	 */
	PropertyBinding.prototype.setBindingMode = function(sBindingMode) {
		this.sMode = sBindingMode;
	};
	

	/**
	 * Checks whether an update of the messages of this binding is required.
	 *
	 * @private
	 */
	PropertyBinding.prototype._updateDataState = function() {
		var oDataState = Binding.prototype._updateDataState.call(this); //super first to apply general status data like messages and laundering
		if (this.oModel && this.sPath) {
			oDataState.setInvalidValue(this.vInvalidValue);
			/*if (this.vInvalidValue) {
				return oDataState; // no further processing needed
			}*/
			try  {
				var oOriginalValue = this.oModel.getOriginalProperty(this.sPath, this.oContext);
				oDataState.setOriginalValue(this._toExternalValue(oOriginalValue));
				oDataState.setOriginalInternalValue(oOriginalValue);
			} catch (ex) {
				jQuery.sap.log.debug("type validation of original model value failed");
			}
			try  {
				oDataState.setValue(this.getExternalValue());
			} catch (ex) {
				jQuery.sap.log.debug("formatting of value failed");
			}
		}
		oDataState.setInternalValue(this.getValue());
		return oDataState;
	};
	
	return PropertyBinding;

});
