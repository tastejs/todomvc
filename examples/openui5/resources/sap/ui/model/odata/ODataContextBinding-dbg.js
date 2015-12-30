/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

//Provides an abstraction for list bindings
sap.ui.define(['sap/ui/model/ContextBinding'],
		function(ContextBinding) {
	"use strict";


	/**
	 * Constructor for odata.ODataContextBinding
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
	 * @alias sap.ui.model.odata.ODataContextBinding
	 */
	var ODataContextBinding = ContextBinding.extend("sap.ui.model.odata.ODataContextBinding", /** @lends sap.ui.model.odata.ODataContextBinding.prototype */ {

		constructor : function(oModel, sPath, oContext, mParameters, oEvents){
			ContextBinding.call(this, oModel, sPath, oContext, mParameters, oEvents);
		}
	});

	/**
	 * Initializes the binding, will create the binding context.
	 * If metadata is not yet available, do nothing, method will be called again when
	 * metadata is loaded.
	 * @see sap.ui.model.Binding.prototype.initialize
	 */
	ODataContextBinding.prototype.initialize = function() {
		var that = this,
			sResolvedPath = this.oModel.resolve(this.sPath, this.oContext),
			oData = this.oModel._getObject(this.sPath, this.oContext),
			bReloadNeeded = this.oModel._isReloadNeeded(sResolvedPath, oData, this.mParameters);

		// don't fire any requests if metadata is not loaded yet.
		if (this.oModel.oMetadata.isLoaded()) {
			if (sResolvedPath && bReloadNeeded) {
				this.fireDataRequested();
			}
			this.oModel.createBindingContext(this.sPath, this.oContext, this.mParameters, function(oContext) {
				that.oElementContext = oContext;
				that._fireChange();
				if (sResolvedPath && bReloadNeeded) {
					that.fireDataReceived();
				}
			}, bReloadNeeded);
		}

	};

	/**
	 * @see sap.ui.model.ContextBinding.prototype.refresh
	 * 
	 * @param {boolean} [bForceUpdate] Update the bound control even if no data has been changed
	 * @param {map} [mChangedEntities] Map of changed entities
	 * @private
	 */
	ODataContextBinding.prototype.refresh = function(bForceUpdate, mChangedEntities) {
		var that = this, sKey, oStoredEntry, bChangeDetected = false,
			sResolvedPath = this.oModel.resolve(this.sPath, this.oContext);

		if (mChangedEntities) {
			//get entry from model. If entry exists get key for update bindings
			oStoredEntry = this.oModel._getObject(this.sPath, this.oContext);
			if (oStoredEntry) {
				sKey = this.oModel._getKey(oStoredEntry);
				if (sKey in mChangedEntities) {
					bChangeDetected = true;
				}
			}
		} else { // default
			bChangeDetected = true;
		}
		if (bForceUpdate || bChangeDetected) {
			//recreate Context: force update
			if (sResolvedPath) {
				this.fireDataRequested();
			}
			this.oModel.createBindingContext(this.sPath, this.oContext, this.mParameters, function(oContext) {
				if (that.oElementContext === oContext) {
					if (bForceUpdate) {
						that._fireChange();
					}
				} else {
					that.oElementContext = oContext;
					that._fireChange();
				}
				if (sResolvedPath) {
					that.fireDataReceived();
				}
			}, true);
		}
	};

	/**
	 * @see sap.ui.model.ContextBinding.prototype.setContext
	 * 
	 * @param {sap.ui.model.Context} oContext The binding context object
	 * @private
	 */
	ODataContextBinding.prototype.setContext = function(oContext) {
		var that = this,
			sResolvedPath,
			oData,
			bReloadNeeded;

		if (this.oContext !== oContext && this.isRelative()) {
			this.oContext = oContext;
			sResolvedPath = this.oModel.resolve(this.sPath, this.oContext);
			oData = this.oModel._getObject(this.sPath, this.oContext);
			bReloadNeeded = this.oModel._isReloadNeeded(sResolvedPath, oData, this.mParameters);

			if (sResolvedPath && bReloadNeeded) {
				this.fireDataRequested();
			}
			this.oModel.createBindingContext(this.sPath, this.oContext, this.mParameters, function(oContext) {
				that.oElementContext = oContext;
				that._fireChange();
				if (sResolvedPath && bReloadNeeded) {
					that.fireDataReceived();
				}
			}, bReloadNeeded);
		}
	};

	return ODataContextBinding;

});
