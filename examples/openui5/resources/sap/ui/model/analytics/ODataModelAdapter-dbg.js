/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

/**
 * Analytical Adapter for ODataModels
 * 
 * @namespace
 * @name sap.ui.model.analytics
 * @public
 */

// Provides class ODataModelAdapter
sap.ui.define(['jquery.sap.global', './AnalyticalBinding', "./AnalyticalTreeBindingAdapter", './odata4analytics', './AnalyticalVersionInfo'],
	function(jQuery, AnalyticalBinding, AnalyticalTreeBindingAdapter, odata4analytics, AnalyticalVersionInfo) {
	"use strict";
	
	
	/**
	 * If called on an instance of an (v1/v2) ODataModel it will enrich it with analytics capabilities.
	 *
	 * @alias sap.ui.model.analytics.ODataModelAdapter
	 * @function
	 * @experimental This module is only for experimental use!
	 * @protected
	 */
	var ODataModelAdapter = function() {
		// "this" is the prototype now when called with apply()
		
		// make sure the version is set correctly, depending on the used ODataModel
		var iModelVersion = AnalyticalVersionInfo.getVersion(this);
	
		// ensure only ODataModel are enhanced which have not been enhanced yet
		if (this.iModelVersion === AnalyticalVersionInfo.NONE || this.getAnalyticalExtensions) {
			return;
		}
	
		// Keep a reference on the bindList and bindTree function before applying the Adapter-Functions,
		// this way the old functions do not get lost and the correct one is used for "prototype" calls.
		// Previously only the ODataModel V1 prototype functions would get called
		this._mPreadapterFunctions = {
			bindList: this.bindList,
			bindTree: this.bindTree
		};
		
		// apply the methods of the adapters prototype to the ODataModelAdapter instance
		for (var fn in ODataModelAdapter.prototype) {
			if (ODataModelAdapter.prototype.hasOwnProperty(fn)) {
				this[fn] = ODataModelAdapter.prototype[fn];
			}
		}
		
		//initialise the Analytical Extension during the metadata loaded Event of the v2.ODataModel
		/*if (iModelVersion === AnalyticalVersionInfo.V2 && !(this.oMetadata && this.oMetadata.isLoaded())) {
			var that = this;
			this.attachMetadataLoaded(function () {
				jQuery.sap.log.info("ODataModelAdapter: Running on ODataModel V2, Metadata was loaded; initialising analytics model.");
				that.getAnalyticalExtensions();
			});
		}*/
		
		// disable the count support (inline count is required for AnalyticalBinding)
		if (iModelVersion === AnalyticalVersionInfo.V1 && this.isCountSupported()) {
			jQuery.sap.log.info("ODataModelAdapter: switched ODataModel to use inlinecount (mandatory for the AnalyticalBinding)");
			this.setCountSupported(false);
		}
		
	};
	
	/**
	 * @see sap.ui.model.odata.ODataModel#bindList
	 * @see sap.ui.model.odata.v2.ODataModel#bindList
	 */
	ODataModelAdapter.prototype.bindList = function(sPath, oContext, aSorters, aFilters, mParameters) {
		// detection for usage of AnalyticalBinding (aligned with AnalyticalTable#bindRows)
		if (mParameters && mParameters.analyticalInfo) {
			var oBinding = new AnalyticalBinding(this, sPath, oContext, aSorters, aFilters, mParameters);
			AnalyticalTreeBindingAdapter.apply(oBinding); // enhance the TreeBinding wit an adapter for the ListBinding
			return oBinding;
		} else {
			// calling the preadapter functions makes sure, that v1 or v2 ODataListBindings get instantiated, depending on the model
			return this._mPreadapterFunctions.bindList.apply(this, arguments);
		}
	};
	
	/**
	 * @see sap.ui.model.odata.ODataModel#bindTree
	 * @see sap.ui.model.odata.v2.ODataModel#bindTree
	 */
	ODataModelAdapter.prototype.bindTree = function(sPath, oContext, aFilters, mParameters) {
		// detection for usage of AnalyticalBinding (aligned with AnalyticalTable#bindRows)
		if (mParameters && mParameters.analyticalInfo) {
			var oBinding = new AnalyticalBinding(this, sPath, oContext, [], aFilters, mParameters);
			return oBinding;
		} else {
			// calling the preadapter functions makes sure, that v1 or v2 ODataTreeBindings get instantiated, depending on the model
			return this._mPreadapterFunctions.bindTree.apply(this, arguments);
		}
	};
	
	/**
	 * @return {sap.ui.model.analytics.odata4analytics.Model} Model providing access to analytical
	 *         extensions of the OData model or null if the services does not
	 *         include analytical extensions
	 * @public
	 */
	ODataModelAdapter.prototype.getAnalyticalExtensions = function() {
		// initialize API by loading the analytical OData model
		if (this.oOData4SAPAnalyticsModel != undefined && this.oOData4SAPAnalyticsModel != null) {
			return this.oOData4SAPAnalyticsModel;
		}
	
		var iModelVersion = AnalyticalVersionInfo.getVersion(this);
		
		// Throw Error if metadata was not loaded
		if (iModelVersion === AnalyticalVersionInfo.V2 && !(this.oMetadata && this.oMetadata.isLoaded())) {
			throw "Failed to get the analytical extensions. The metadata have not been loaded by the model yet." +
					"Register for the 'metadataLoaded' event of the ODataModel(v2) to know when the analytical extensions can be retrieved.";
		}
		
		var sAnnotationDoc = null;
	
		if (arguments.length == 1) {
			// hidden feature: load resource with additional analytical metadata
			// defined in a JSON format
			var sAnnotationDocURI = arguments[0];
	
			var oResult = jQuery.sap.syncGetText(sAnnotationDocURI);
			if (oResult.success) {
				sAnnotationDoc = oResult.data;
			}
		}
	
		// initialize API by loading the analytical OData model
		try {
			this.oOData4SAPAnalyticsModel = new odata4analytics.Model(new odata4analytics.Model.ReferenceByModel(this), {sAnnotationJSONDoc: sAnnotationDoc});
		} catch (exception) {
			throw "Failed to instantiate analytical extensions for given OData model: " + exception.message;
		}
		return this.oOData4SAPAnalyticsModel;
	};
	
	return ODataModelAdapter;

}, /* bExport= */ true);
