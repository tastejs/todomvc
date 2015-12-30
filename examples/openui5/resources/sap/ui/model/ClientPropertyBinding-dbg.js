/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides the JSON model implementation of a property binding
sap.ui.define(['./PropertyBinding'],
	function(PropertyBinding) {
	"use strict";


	/**
	 *
	 * @class
	 * Property binding implementation for client models
	 * 
	 * @param {sap.ui.model.Model} oModel
	 * @param {String} sPath
	 * @param {sap.ui.model.Context} oContext
	 * @param {Object} [mParameters]
	 * 
	 * @alias sap.ui.model.ClientPropertyBinding
	 * @extends sap.ui.model.PropertyBinding
	 */
	var ClientPropertyBinding = PropertyBinding.extend("sap.ui.model.ClientPropertyBinding", /** @lends sap.ui.model.ClientPropertyBinding.prototype */ {
		
		constructor : function(oModel, sPath, oContext, mParameters){
			PropertyBinding.apply(this, arguments);
			this.oValue = this._getValue();
		}
		
	});
	
	/**
	 * @see sap.ui.model.PropertyBinding.prototype.getValue
	 */
	ClientPropertyBinding.prototype.getValue = function(){
		return this.oValue;
	};
	
	
	/**
	 * Returns the current value of the bound target (incl. re-evaluation)
	 * @return {object} the current value of the bound target
	 */
	ClientPropertyBinding.prototype._getValue = function(){
		var sProperty = this.sPath.substr(this.sPath.lastIndexOf("/") + 1);
		if (sProperty == "__name__") {
			var aPath = this.oContext.split("/");
			return aPath[aPath.length - 1];
		}
		return this.oModel.getProperty(this.sPath, this.oContext); // ensure to survive also not set model object
	};
	
	/**
	 * Setter for context
	 */
	ClientPropertyBinding.prototype.setContext = function(oContext) {
		if (this.oContext != oContext) {
			this.oContext = oContext;
			if (this.isRelative()) {
				this.checkUpdate();
			}
		}
	};

	return ClientPropertyBinding;

});
