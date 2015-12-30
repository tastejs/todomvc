/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides a filter for list bindings
sap.ui.define(['sap/ui/base/Object', 'sap/ui/model/Filter', 'sap/ui/model/FilterOperator'],
	function(BaseObject, Filter, FilterOperator) {
	"use strict";


	/**
	 * Constructor for Filter
	 *
	 * @class
	 * Filter for the list binding
	 *
	 * @param {string} sPath the binding path for this filter
	 * @param {object[]} aValues Array of FilterOperators and their values: [{operator:"GE",value1:"val1"},{operator:"LE",value1:"val1"},{operator:"BT",value1:"val1",value2:"val2"}]
	 * @param {boolean} [bAND=true] If true the values from aValues will be ANDed; otherwise ORed
	 * @public
	 * @alias sap.ui.model.odata.Filter
	 * @deprecated Since 1.22. Please use the sap.ui.model.Filter instead (@link: sap.ui.model.Filter).
	 */
	var ODataFilter = BaseObject.extend("sap.ui.model.odata.Filter", /** @lends sap.ui.model.odata.Filter.prototype */ {
		
		constructor : function(sPath, aValues, bAND){
			if (typeof sPath === "object") {
				var oFilterData = sPath;
				sPath = oFilterData.path;
				aValues = oFilterData.values;
				bAND = oFilterData.and;
			}
			this.sPath = sPath;
			this.aValues = aValues;
			this.bAND = bAND == undefined ? true : bAND;
		},
		
		
		/**
		 * Converts the <code>sap.ui.model.odata.Filter</code> into a 
		 * <code>sap.ui.model.Filter</code>. 
		 * 
		 * @return {sap.ui.model.Filter} a <code>sap.ui.model.Filter</code> object
		 * @public
		 */
		convert: function() {
			
			// covert the values array into an array of filter objects
			var aFilters = [];
			for (var i = 0, l = this.aValues && this.aValues.length || 0; i < l; i++) {
				aFilters.push(new Filter({
					path: this.sPath,
					operator: this.aValues[i].operator,
					value1: this.aValues[i].value1,
					value2: this.aValues[i].value2
				}));
			}
			
			// create the new filter object based on the filters
			if (aFilters.length > 1) {
				var oFilter = new Filter({
					filters: aFilters,
					and: this.bAND
				});
				
				return oFilter;
			} else {
				return aFilters[0];
			}
			
		}
	
	});
	

	return ODataFilter;

});
