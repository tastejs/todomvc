/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides the XML model implementation of a list binding
sap.ui.define(['jquery.sap.global', 'sap/ui/model/ClientTreeBinding'],
	function(jQuery, ClientTreeBinding) {
	"use strict";


	/**
	 *
	 * @class
	 * Tree binding implementation for XML format
	 *
	 * @param {sap.ui.model.xml.XMLModel} [oModel]
	 * @param {string} sPath the path pointing to the tree / array that should be bound
	 * @param {object} [oContext=null] the context object for this binding (optional)
	 * @param {array} [aFilters=null] predefined filter/s contained in an array (optional)
	 * @param {object} [mParameters=null] additional model specific parameters (optional)
	 * @alias sap.ui.model.xml.XMLTreeBinding
	 * @extends sap.ui.model.TreeBinding
	 */
	var XMLTreeBinding = ClientTreeBinding.extend("sap.ui.model.xml.XMLTreeBinding");
	
	/**
	 * Return node contexts for the tree
	 * @param {object} oContext to use for retrieving the node contexts
	 * @param {integer} iStartIndex the startIndex where to start the retrieval of contexts
	 * @param {integer} iLength determines how many contexts to retrieve beginning from the start index.
	 * @return {Array} the contexts array
	 * @protected
	 */
	XMLTreeBinding.prototype.getNodeContexts = function(oContext, iStartIndex, iLength) {
		if (!iStartIndex) {
			iStartIndex = 0;
		}
		if (!iLength) {
			iLength = this.oModel.iSizeLimit;
		}
		
		var sContextPath = oContext.getPath();
		
		if (!jQuery.sap.endsWith(sContextPath,"/")) {
			sContextPath = sContextPath + "/";
		}
		if (!jQuery.sap.startsWith(sContextPath,"/")) {
			sContextPath = "/" + sContextPath;
		}
	
		var aContexts = [],
			mNodeIndices = {},
			that = this,
			oNode = this.oModel._getObject(oContext.getPath()),
			sChildPath, oChildContext;
	
		jQuery.each(oNode[0].childNodes, function(sName, oChild) {
			if (oChild.nodeType == 1) { // check if node is an element
				if (mNodeIndices[oChild.nodeName] == undefined) {
					mNodeIndices[oChild.nodeName] = 0;
				} else {
					mNodeIndices[oChild.nodeName]++;
				}
				sChildPath = sContextPath + oChild.nodeName + "/" + mNodeIndices[oChild.nodeName];
				oChildContext = that.oModel.getContext(sChildPath);
				// check if there is a filter on this level applied
				if (that.aFilters && !that.bIsFiltering) {
					if (jQuery.inArray(oChildContext, that.filterInfo.aFilteredContexts) != -1) {
						aContexts.push(oChildContext);
					}
				} else {
					aContexts.push(oChildContext);
				}
			}
		});
		
		this._applySorter(aContexts);
		this._setLengthCache(sContextPath, aContexts.length);
		
		return aContexts.slice(iStartIndex, iStartIndex + iLength);
	};

	return XMLTreeBinding;

});
