/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides class sap.ui.model.odata.ODataPropertyBinding
sap.ui.define(['jquery.sap.global', 'sap/ui/model/ChangeReason', 'sap/ui/model/PropertyBinding'],
	function(jQuery, ChangeReason, PropertyBinding) {
	"use strict";


	/**
	 *
	 * @class
	 * Property binding implementation for oData format
	 *
	 * @param {sap.ui.model.Model} oModel
	 * @param {string} sPath
	 * @param {sap.ui.model.Context} oContext
	 * @param {object} [mParameters]
	 * 
	 * @public
	 * @alias sap.ui.model.odata.ODataPropertyBinding
	 * @extends sap.ui.model.PropertyBinding
	 */
	var ODataPropertyBinding = PropertyBinding.extend("sap.ui.model.odata.ODataPropertyBinding", /** @lends sap.ui.model.odata.ODataPropertyBinding.prototype */ {
		
		constructor : function(oModel, sPath, oContext, mParameters){
			PropertyBinding.apply(this, arguments);
			this.bInitial = true;
			this.oValue = this._getValue();
		}
	
	});
	
	/**
	 * Initialize the binding. The message should be called when creating a binding.
	 * If metadata is not yet available, do nothing, method will be called again when
	 * metadata is loaded.
	 * 
	 * @protected
	 */
	ODataPropertyBinding.prototype.initialize = function() {
		if (this.oModel.oMetadata.isLoaded() && this.bInitial) {
			this.checkUpdate(true);
			this.bInitial = false;
		}
	};
	
	/**
	 * Returns the current value of the bound target
	 * @return {object} the current value of the bound target
	 * @protected
	 */
	ODataPropertyBinding.prototype.getValue = function(){
		return this.oValue;
	};
	
	/**
	 * Returns the current value of the bound target (incl. re-evaluation)
	 * @return {object} the current value of the bound target
	 */
	ODataPropertyBinding.prototype._getValue = function(){
		return this.oModel._getObject(this.sPath, this.oContext);
	};
	
	/**
	 * @see sap.ui.model.PropertyBinding.prototype.setValue
	 */
	ODataPropertyBinding.prototype.setValue = function(oValue){
		if (!jQuery.sap.equal(oValue, this.oValue)) {
			if (this.oModel.setProperty(this.sPath, oValue, this.oContext, true)) {
				this.oValue = oValue;
			}
		}
	};
	
	/**
	 * Setter for context
	 */
	ODataPropertyBinding.prototype.setContext = function(oContext) {
		if (this.oContext != oContext) {
			this.oContext = oContext;
			if (this.isRelative()) {
				this.checkUpdate();
			}
		}
	};
	
	/**
	 * Check whether this Binding would provide new values and in case it changed,
	 * inform interested parties about this.
	 * 
	 * @param {boolean} force no cache true/false: Default = false
	 * 
	 */
	ODataPropertyBinding.prototype.checkUpdate = function(bForceUpdate){
		var oValue = this._getValue();
		if (!jQuery.sap.equal(oValue, this.oValue) || bForceUpdate) {// optimize for not firing the events when unneeded
			this.oValue = oValue;
			this._fireChange({reason: ChangeReason.Change});
		}
	};

	return ODataPropertyBinding;

});
