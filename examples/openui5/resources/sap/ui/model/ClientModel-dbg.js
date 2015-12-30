/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides client-based DataBinding implementation
sap.ui.define(['jquery.sap.global', './ClientContextBinding', './ClientListBinding', './ClientPropertyBinding', './ClientTreeBinding', './Model'],
	function(jQuery, ClientContextBinding, ClientListBinding, ClientPropertyBinding, ClientTreeBinding, Model) {
	"use strict";


	/**
	 * Constructor for a new ClientModel.
	 *
	 * @class Model implementation for Client models
	 * @abstract
	 * @extends sap.ui.model.Model
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @param {object} oData URL where to load the data from
	 * @constructor
	 * @public
	 * @alias sap.ui.model.ClientModel
	 */
	var ClientModel = Model.extend("sap.ui.model.ClientModel", /** @lends sap.ui.model.ClientModel.prototype */ {
		
		constructor : function(oData) {
			Model.apply(this, arguments);
			
			this.bCache = true;
			this.aPendingRequestHandles = [];
			
			if (typeof oData == "string") {
				this.loadData(oData);
			}
		},
	
		metadata : {
			publicMethods : ["loadData", "setData", "getData", "setProperty", "forceNoCache"]
		}
	
	});
	
	/**
	 * Returns the current data of the model.
	 * Be aware that the returned object is a reference to the model data so all changes to that data will also change the model data.
	 *
	 * @return the data object
	 * @public
	 */
	ClientModel.prototype.getData = function(){
		return this.oData;
	};
	
	/**
	 * @see sap.ui.model.Model.prototype.bindElement
	 *
	 */
	/**
	 * @see sap.ui.model.Model.prototype.createBindingContext
	 *
	 */
	ClientModel.prototype.createBindingContext = function(sPath, oContext, mParameters, fnCallBack) {
		// optional parameter handling
		if (typeof oContext == "function") {
			fnCallBack = oContext;
			oContext = null;
		}
		if (typeof mParameters == "function") {
			fnCallBack = mParameters;
			mParameters = null;
		}
		// resolve path and create context
		var sContextPath = this.resolve(sPath, oContext),
			oNewContext = (sContextPath == undefined) ? undefined : this.getContext(sContextPath ? sContextPath : "/");
		if (!oNewContext) {
			oNewContext = null;
		}
		if (fnCallBack) {
			fnCallBack(oNewContext);
		}
		return oNewContext;
	};
	
	
	ClientModel.prototype._ajax = function(oParameters){
		var that = this;
	
		if (this.bDestroyed) {
			return;
		}
	
		function wrapHandler(fn) {
			return function() {
				// request finished, remove request handle from pending request array
				var iIndex = jQuery.inArray(oRequestHandle, that.aPendingRequestHandles);
				if (iIndex > -1) {
					that.aPendingRequestHandles.splice(iIndex, 1);
				}
	
				// call original handler method
				if (!(oRequestHandle && oRequestHandle.bSuppressErrorHandlerCall)) {
					fn.apply(this, arguments);
				}
			};
		}
	
		oParameters.success = wrapHandler(oParameters.success);
		oParameters.error = wrapHandler(oParameters.error);
	
		var oRequestHandle = jQuery.ajax(oParameters);
	
		// add request handle to array and return it (only for async requests)
		if (oParameters.async) {
			this.aPendingRequestHandles.push(oRequestHandle);
		}
	
	};
	
	/**
	 * @see sap.ui.model.Model.prototype.destroy
	 * @public
	 */
	ClientModel.prototype.destroy = function() {
		Model.prototype.destroy.apply(this, arguments);
		// Abort pending requests
		if (this.aPendingRequestHandles) {
			for (var i = this.aPendingRequestHandles.length - 1; i >= 0; i--) {
				var oRequestHandle = this.aPendingRequestHandles[i];
				if (oRequestHandle && oRequestHandle.abort) {
					oRequestHandle.bSuppressErrorHandlerCall = true;
					oRequestHandle.abort();
				}
			}
			delete this.aPendingRequestHandles;
		}
	};
	
	/**
	 * @see sap.ui.model.Model.prototype.destroyBindingContext
	 *
	 */
	ClientModel.prototype.destroyBindingContext = function(oContext) {
		// TODO: what todo here?
	};
	
	/**
	 * @see sap.ui.model.Model.prototype.bindContext
	 */
	ClientModel.prototype.bindContext = function(sPath, oContext, mParameters) {
		var oBinding = new ClientContextBinding(this, sPath, oContext, mParameters);
		return oBinding;
	};
	
	/**
	 * update all bindings
	 * @param {boolean} bForceUpdate true/false: Default = false. If set to false an update 
	 * 					will only be done when the value of a binding changed.   
	 * @public
	 */
	ClientModel.prototype.updateBindings = function(bForceUpdate) {
		this.checkUpdate(bForceUpdate);
	};
	
	/**
	 * Force no caching.
	 * @param {boolean} [bForceNoCache=false] whether to force not to cache
	 * @public
	 */
	ClientModel.prototype.forceNoCache = function(bForceNoCache) {
		this.bCache = !bForceNoCache;
	};
	

	return ClientModel;

});
