/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides the XML model implementation of a property binding
sap.ui.define(['jquery.sap.global', 'sap/ui/model/ChangeReason', 'sap/ui/model/ClientPropertyBinding'],
	function(jQuery, ChangeReason, ClientPropertyBinding) {
	"use strict";


	/**
	 *
	 * @class
	 * Property binding implementation for XML format
	 *
	 * @param {sap.ui.model.xml.XMLModel} oModel
	 * @param {string} sPath
	 * @param {sap.ui.model.Context} oContext
	 * @param {object} [mParameters]
	 * @alias sap.ui.model.xml.XMLPropertyBinding
	 * @extends sap.ui.model.PropertyBinding
	 */
	var XMLPropertyBinding = ClientPropertyBinding.extend("sap.ui.model.xml.XMLPropertyBinding");
	
	/**
	 * @see sap.ui.model.PropertyBinding.prototype.setValue
	 */
	XMLPropertyBinding.prototype.setValue = function(oValue){
		if (this.oValue != oValue) {
			if (this.oModel.setProperty(this.sPath, oValue, this.oContext, true)) {
				this.oValue = oValue;
			}
		}
	};
	
	/**
	 * Check whether this Binding would provide new values and in case it changed,
	 * inform interested parties about this.
	 * 
	 * @param {boolean} bForceupdate
	 * 
	 */
	XMLPropertyBinding.prototype.checkUpdate = function(bForceupdate){
		var oValue = this._getValue();
		if (!jQuery.sap.equal(oValue, this.oValue) || bForceupdate) {// optimize for not firing the events when unneeded
			this.oValue = oValue;
			this._fireChange({reason: ChangeReason.Change});
		}
	};

	return XMLPropertyBinding;

});
