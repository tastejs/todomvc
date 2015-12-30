/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides the JSON model implementation of a property binding
sap.ui.define(['sap/ui/model/PropertyBinding'],
	function(PropertyBinding) {
	"use strict";


	/**
	 * @class
	 * Property binding implementation for JSON format.
	 *
	 * @param {sap.ui.model.control.ControlModel} oModel
	 * @param {string} sPath 
	 * @param {object} [oContext] 
	 * @alias sap.ui.model.control.ControlPropertyBinding
	 * @extends sap.ui.model.PropertyBinding
	 */
	var ControlPropertyBinding = PropertyBinding.extend("sap.ui.model.control.ControlPropertyBinding", /** @lends sap.ui.model.control.ControlPropertyBinding.prototype */ {
		
		constructor : function(oModel, sPath, oContext){
			PropertyBinding.apply(this, arguments);
			this.oValue = this._getValue();
		}
	
	});
	
	/**
	 * Returns the current value of the bound target
	 * @return {object} the current value of the bound target
	 */
	ControlPropertyBinding.prototype.getValue = function(){
		return this.oValue;
	};
	
	/**
	 * Sets the current value on the control
	 */
	ControlPropertyBinding.prototype.setValue = function(oValue){
		this.oValue = oValue;
		this.oContext.setProperty(this.sPath, oValue);
	};
	
	/**
	 * Returns the current value of the bound target (incl. re-evaluation)
	 * @return {object} the current value of the bound target
	 */
	ControlPropertyBinding.prototype._getValue = function () {
		return this.oContext.getProperty(this.sPath);
	};
	
	/**
	 * Setter for context
	 */
	ControlPropertyBinding.prototype.setContext = function(oContext) {
		this.oContext = oContext;
		this.checkUpdate();
	};
	
	/**
	 * Check whether this Binding would provide new values and in case it changed,
	 * inform interested parties about this.
	 * @protected
	 */
	ControlPropertyBinding.prototype.checkUpdate = function() {
		var oValue = this._getValue();
		if (oValue !== this.oValue) {// optimize for not firing the events when unneeded
			this.oValue = oValue;
			this._fireChange();
		}
	};

	return ControlPropertyBinding;

});
