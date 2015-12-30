/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides an abstraction for list bindings
sap.ui.define(['./ContextBinding'],
	function(ContextBinding) {
	"use strict";


	/**
	 * Constructor for ClientContextBinding
	 *
	 * @class
	 * The ContextBinding is a specific binding for a setting context for the model
	 *
	 * @param {sap.ui.model.Model} oModel
	 * @param {String} sPath
	 * @param {Object} oContext
	 * @param {Object} [mParameters]
	 * @abstract
	 * @public
	 * @alias sap.ui.model.ClientContextBinding
	 */
	var ClientContextBinding = ContextBinding.extend("sap.ui.model.ClientContextBinding", /** @lends sap.ui.model.ClientContextBinding.prototype */ {
	
		constructor : function(oModel, sPath, oContext, mParameters, oEvents){
			ContextBinding.call(this, oModel, sPath, oContext, mParameters, oEvents);
			var that = this;
			oModel.createBindingContext(sPath, oContext, mParameters, function(oContext) {
				that.bInitial = false;
				that.oElementContext = oContext;
			});
		}
	
	});
	
	/**
	 * @see sap.ui.model.ContextBinding.prototype.refresh
	 */
	ClientContextBinding.prototype.refresh = function(bForceUpdate) {
		var that = this;
		//recreate Context: force update
		this.oModel.createBindingContext(this.sPath, this.oContext, this.mParameters, function(oContext) {
			if (that.oElementContext === oContext && !bForceUpdate) {
				that.oModel.checkUpdate(true,oContext);
			} else {
				that.oElementContext = oContext;
				that._fireChange();
			}
		}, true);
	};
	
	/**
	 * @see sap.ui.model.ContextBinding.prototype.refresh
	 */
	ClientContextBinding.prototype.initialize = function() {
		var that = this;
		//recreate Context: force update
		this.oModel.createBindingContext(this.sPath, this.oContext, this.mParameters, function(oContext) {
			that.oElementContext = oContext;
			that._fireChange();
		}, true);
	};
	
	/**
	 * @see sap.ui.model.ContextBinding.prototype.setContext
	 */
	ClientContextBinding.prototype.setContext = function(oContext) {
		var that = this;
		if (this.oContext != oContext) {
			this.oContext = oContext;
			this.oModel.createBindingContext(this.sPath, this.oContext, this.mParameters, function(oContext) {
				that.oElementContext = oContext;
				that._fireChange();
			});
		}
	};

	return ClientContextBinding;

});
