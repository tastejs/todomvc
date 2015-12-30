/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides the JSON model implementation of a list binding
sap.ui.define(['jquery.sap.global', 'sap/ui/model/ClientTreeBinding'],
	function(jQuery, ClientTreeBinding) {
	"use strict";


	/**
	 *
	 * @class
	 * Tree binding implementation for JSON format.
	 * 
	 * The tree data structure may contain JSON objects and also arrays. If using arrays and don't want to bind every array data in the data structure you can 
	 * specify a parameter <code>arrayNames</code> in the mParameters which contains the names of the arrays in a string array which should be bound for the tree.
	 * An array not included there won't be bound. If an array is included but it is nested in another parent array which isn't included in the names list it won't be bound.
	 * So make sure that the parent array name is also included. If the tree data structure doesn't include any arrays you don't have to specify this parameter at all. 
	 *
	 * @param {sap.ui.model.json.JSONModel} [oModel]
	 * @param {string}
	 *         sPath the path pointing to the tree / array that should be bound
	 * @param {object}
	 *         [oContext=null] the context object for this databinding (optional)
	 * @param {array}
	 *         [aFilters=null] predefined filter/s contained in an array (optional)
	 * @param {object}
	 *         [mParameters=null] additional model specific parameters (optional)
	 * @param {string[]} [mParameters.arrayNames]
	 *         If this parameter is specified with an array of string names, these names will be used to construct the tree data structure.
	 *         Only the nested objects contained in arrays, with names specified by mParameters.arrayNames, will be included in the tree.
	 *         Of course this will only happen if all parent-nodes up to the top-level are also included.
	 *         If you do NOT specify this parameter: by default all nested objects/arrays will be used to build the trees hierarchy.
	 * 
	 * @alias sap.ui.model.json.JSONTreeBinding
	 * @extends sap.ui.model.TreeBinding
	 */
	var JSONTreeBinding = ClientTreeBinding.extend("sap.ui.model.json.JSONTreeBinding");
	
	JSONTreeBinding.prototype._saveSubContext = function(oNode, aContexts, sContextPath, sName) {
		// only collect node if it is defined (and not null), because typeof null == "object"!
		if (oNode && typeof oNode == "object") {
			var oNodeContext = this.oModel.getContext(sContextPath + sName);
			// check if there is a filter on this level applied
			if (this.aFilters && !this.bIsFiltering) {
				if (jQuery.inArray(oNodeContext, this.filterInfo.aFilteredContexts) != -1) {
					aContexts.push(oNodeContext);
				}
			} else {
				aContexts.push(oNodeContext);
			}
		}
	};

	return JSONTreeBinding;

});
