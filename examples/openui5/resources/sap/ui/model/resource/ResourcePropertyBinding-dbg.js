/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides the Resource model implementation of a property binding
sap.ui.define(['sap/ui/model/PropertyBinding', 'sap/ui/model/ChangeReason'],
	function(PropertyBinding, ChangeReason) {
	"use strict";


	/**
	 * @class
	 * Property binding implementation for resource bundles
	 *
	 * @param {sap.ui.model.resource.ResourceModel} oModel
	 * @param {string} sPath
	 * @param {sap.ui.model.Context} oContext
	 * @param {object} [mParameters]
	 * @alias sap.ui.model.resource.ResourcePropertyBinding
	 */
	var ResourcePropertyBinding = PropertyBinding.extend("sap.ui.model.resource.ResourcePropertyBinding", /** @lends sap.ui.model.resource.ResourcePropertyBinding.prototype */ {
		
		constructor : function(oModel, sPath){
			PropertyBinding.apply(this, arguments);
		
			this.oValue = this.oModel.getProperty(sPath);
		}
		
	});
	
	/**
	 * @see sap.ui.model.PropertyBinding.prototype.getValue
	 */
	ResourcePropertyBinding.prototype.getValue = function(){
		return this.oValue;
	};
	
	/**
	 * @see sap.ui.model.PropertyBinding.prototype.checkUpdate
	 */
	ResourcePropertyBinding.prototype.checkUpdate = function(bForceUpdate) {
		if (!this.bSuspended) {
			var oValue = this.oModel.getProperty(this.sPath);
			if (bForceUpdate || oValue != this.oValue) {
				this.oValue = oValue;
				this._fireChange({reason: ChangeReason.Change});
			}
		}
	};

	return ResourcePropertyBinding;

});
