/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

/**
 * Control-based DataBinding
 *
 * @namespace
 * @name sap.ui.model.control
 * @public
 */

// Provides the JSON object based model implementation
sap.ui.define(['jquery.sap.global', 'sap/ui/model/Model', './ControlPropertyBinding'],
	function(jQuery, Model, ControlPropertyBinding) {
	"use strict";

//jQuery.sap.require("sap.ui.model.control.ControlListBinding");
	
	/**
	 * Constructor for a new ControlModel.
	 *
	 * @class
	 * Model implementation for Control model
	 *
	 * @extends sap.ui.model.Model
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @alias sap.ui.model.control.ControlModel
	 */
	var ControlModel = Model.extend("sap.ui.model.control.ControlModel", /** @lends sap.ui.model.control.ControlModel.prototype */ {
		
		constructor : function (oControl) {
			Model.apply(this, arguments);
			this.oControl = oControl;
			this.oControl.attachEvent("_change", this.checkUpdate, this);
			this.oElements = [];
		}
	
	});
	
	/**	 */
	ControlModel.prototype.destroy = function() {
		this.oControl.detachEvent("_change", this.checkUpdate, this);
	};
	
	/**	 */
	ControlModel.prototype.addFacadeComponent = function(oElement) {
		var i = jQuery.inArray(oElement, this.oElements);
		if ( i < 0 ) {
			this.oElements.push(oElement);
			oElement.attachEvent("_change", this.checkUpdate, this);
		}
	};
	
	/**	 */
	ControlModel.prototype.removeFacadeComponent = function(oElement) {
		var i = jQuery.inArray(oElement, this.oElements);
		if ( i >= 0 ) {
			this.oElements.splice(i, 1);
			oElement.detachEvent("_change", this.checkUpdate, this);
		}
	};
	
	/**
	 * @see sap.ui.model.Model.prototype.bindProperty
	 */
	ControlModel.prototype.bindProperty = function(sPath, oContext) {
		oContext = oContext || this.oControl;
		if ( oContext !== this.oControl ) {
			this.addFacadeComponent(oContext);
		}
		return new ControlPropertyBinding(this, sPath, oContext);
	};
	
	/**	 */
	ControlModel.prototype.checkUpdate = function(oEvent) {
		if ( this._onchange ) {
			this._onchange(oEvent);
		}
		if ( this.aBindings.length ) {
			// TODO optimize with info from event object (control & property)
			var aBindings = this.aBindings.slice(0);
			jQuery.each(aBindings, function(iIndex, oBinding) {
				oBinding.checkUpdate();
			});
		}
	};

	return ControlModel;

});
