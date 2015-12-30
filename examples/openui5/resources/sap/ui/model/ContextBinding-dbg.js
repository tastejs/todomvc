/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides an abstraction for list bindings
sap.ui.define(['./Binding'],
	function(Binding) {
	"use strict";


	/**
	 * Constructor for ContextBinding
	 *
	 * @class
	 * The ContextBinding is a specific binding for a setting context for the model
	 *
	 * @param {sap.ui.model.Model} oModel
	 * @param {String} sPath
	 * @param {Object} oContext
	 * @param {Object} [mParameters]
	 * @param {Object} [oEvents] object defining event handlers
	 * @abstract
	 * @public
	 * @alias sap.ui.model.ContextBinding
	 * @extends sap.ui.model.Binding
	 */
	var ContextBinding = Binding.extend("sap.ui.model.ContextBinding", /** @lends sap.ui.model.ContextBinding.prototype */ {
		
		constructor : function(oModel, sPath, oContext, mParameters, oEvents){
			Binding.call(this, oModel, sPath, oContext, mParameters, oEvents);
			this.oElementContext = null;
			this.bInitial = true;
		},
	
		metadata : {
			 publicMethods : [
			 // methods
				"getElementContext"
			 ]
		}
	});
	
	/**
	 * Check whether this Binding would provide new values and in case it changed,
	 * inform interested parties about this.
	 *
	 * @param {boolean} bForceupdate
	 */
	ContextBinding.prototype.checkUpdate = function(bForceupdate) {
		// nothing to do here, data changes can not change the context
	};
	
	/**
	 * Refreshes the binding, check whether the model data has been changed and fire change event
	 * if this is the case. For server side models this should refetch the data from the server.
	 * 
	 * @param {boolean} bForceUpdate Does not have any effect on this binding
	 * 
	 * @public
	 */
	
	/**
	 * Return the bound context
	 */
	ContextBinding.prototype.getBoundContext = function(oContext) {
		return this.oElementContext;
	};
	

	return ContextBinding;

});
