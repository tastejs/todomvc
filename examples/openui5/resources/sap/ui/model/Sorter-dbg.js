/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides the concept of a sorter for list bindings
sap.ui.define(['sap/ui/base/Object'],
	function(BaseObject) {
	"use strict";


	/**
	 *
	 * Constructor for Sorter
	 *
	 * @class
	 * Sorter for the list binding
	 * This object defines the sort order for the list binding.
	 *
	 *
	 * @param {String} sPath the binding path used for sorting
	 * @param {boolean} [bDescending=false] whether the sort order should be descending
	 * @param {boolean|function} vGroup configure grouping of the content, can either be true to enable grouping
	 *        based on the raw model property value, or a function which calculates the group value out of the 
	 *        context (e.g. oContext.getProperty("date").getYear() for year grouping). The control needs to
	 *        implement the grouping behaviour for the aggregation which you want to group. In case a function 
	 *        is provided it must either return a primitive type value as the group key or an object containing
	 *        a "key" property an may contain additional properties needed for group visualization.
	 * @public
	 * @alias sap.ui.model.Sorter
	 */
	var Sorter = BaseObject.extend("sap.ui.model.Sorter", /** @lends sap.ui.model.Sorter.prototype */ {
		
		constructor : function(sPath, bDescending, vGroup){
			if (typeof sPath === "object") {
				var oSorterData = sPath;
				sPath = oSorterData.path;
				bDescending = oSorterData.descending;
				vGroup = oSorterData.group;
			}
			this.sPath = sPath;
	
			// if a model separator is found in the path, extract model name
			var iSeparatorPos = this.sPath.indexOf(">");
			if (iSeparatorPos > 0) {
				this.sPath = this.sPath.substr(iSeparatorPos + 1);
			}
	
			this.bDescending = bDescending;
			this.vGroup = vGroup;
			if (typeof vGroup == "boolean" && vGroup) {
				this.fnGroup = function(oContext) {
					return oContext.getProperty(this.sPath);
				};
			}
			if (typeof vGroup == "function") {
				this.fnGroup = vGroup;
			}
		},
		
		/**
		 * Returns a group object, at least containing a key property for group detection.
		 * May contain additional properties as provided by a custom group function.
		 * 
		 * @param {sap.ui.model.Context} oContext the binding context
		 * @return {object} An object containing a key property and optional custom properties
		 * @public
		 */
		getGroup : function(oContext) {
			var oGroup = this.fnGroup(oContext);
			if (typeof oGroup === "string" || typeof oGroup === "number" || typeof oGroup === "boolean" || oGroup == null) {
				oGroup = {
					key: oGroup
				};
			} 
			return oGroup;
		}
	
	});

	return Sorter;

});
