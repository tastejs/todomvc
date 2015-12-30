/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides the JSON model implementation of a list binding
sap.ui.define(['jquery.sap.global', './ChangeReason', './Filter', './FilterType', './ListBinding', './FilterProcessor', './Sorter', './SorterProcessor'],
	function(jQuery, ChangeReason, Filter, FilterType, ListBinding, FilterProcessor, Sorter, SorterProcessor) {
	"use strict";
	
	/**
	 *
	 * @class
	 * List binding implementation for client models
	 *
	 * @param {sap.ui.model.Model} oModel
	 * @param {string} sPath
	 * @param {sap.ui.model.Context} oContext
	 * @param {sap.ui.model.Sorter|sap.ui.model.Sorter[]} [aSorters] initial sort order (can be either a sorter or an array of sorters)
	 * @param {sap.ui.model.Filter|sap.ui.model.Filter[]} [aFilters] predefined filter/s (can be either a filter or an array of filters)
	 * @param {object} [mParameters]
	 * 
	 * @alias sap.ui.model.ClientListBinding
	 * @extends sap.ui.model.ListBinding
	 */
	var ClientListBinding = ListBinding.extend("sap.ui.model.ClientListBinding", /** @lends sap.ui.model.ClientListBinding.prototype */ {
	
		constructor : function(oModel, sPath, oContext, aSorters, aFilters, mParameters){
			ListBinding.apply(this, arguments);
			this.bIgnoreSuspend = false;
			this.update();
		},
	
		metadata : {
			publicMethods : [
				"getLength"
			]
		}
	
	});
	
	/**
	 * Return contexts for the list or a specified subset of contexts
	 * @param {int} [iStartIndex=0] the startIndex where to start the retrieval of contexts
	 * @param {int} [iLength=length of the list] determines how many contexts to retrieve beginning from the start index.
	 * Default is the whole list length.
	 *
	 * @return {Array} the contexts array
	 * @private
	 */
	ClientListBinding.prototype._getContexts = function(iStartIndex, iLength) {
		if (!iStartIndex) {
			iStartIndex = 0;
		}
		if (!iLength) {
			iLength = Math.min(this.iLength, this.oModel.iSizeLimit);
		}
		
		var iEndIndex = Math.min(iStartIndex + iLength, this.aIndices.length),
		oContext,
		aContexts = [],
		sPrefix = this.oModel.resolve(this.sPath, this.oContext);
		
		if (sPrefix && !jQuery.sap.endsWith(sPrefix, "/")) {
			sPrefix += "/";
		}
	
		for (var i = iStartIndex; i < iEndIndex; i++) {
			oContext = this.oModel.getContext(sPrefix + this.aIndices[i]);
			aContexts.push(oContext);
		}
		
		return aContexts;
	};
	
	/**
	 * Setter for context
	 * @param {Object} oContext the new context object
	 */
	ClientListBinding.prototype.setContext = function(oContext) {
		if (this.oContext != oContext) {
			this.oContext = oContext;
			if (this.isRelative()) {
				this.update();
				this._fireChange({reason: ChangeReason.Context});
			}
		}
	};
	
	/**
	 * @see sap.ui.model.ListBinding.prototype.getLength
	 *
	 */
	ClientListBinding.prototype.getLength = function() {
		return this.iLength;
	};
	
	/**
	 * Return the length of the list
	 *
	 * @return {int} the length
	 */
	ClientListBinding.prototype._getLength = function() {
		return this.aIndices.length;
	};
	
	/**
	 * Get indices of the list
	 */
	ClientListBinding.prototype.updateIndices = function(){
		this.aIndices = [];
		for (var i = 0; i < this.oList.length; i++) {
			this.aIndices.push(i);
		}
	
	};
	
	/**
	 * @see sap.ui.model.ListBinding.prototype.sort
	 */
	ClientListBinding.prototype.sort = function(aSorters){
		if (!aSorters) {
			this.aSorters = null;
			this.updateIndices();
			this.applyFilter();
		} else {
			if (aSorters instanceof Sorter) {
				aSorters = [aSorters];
			}
			this.aSorters = aSorters;
			this.applySort();
		}
		
		this.bIgnoreSuspend = true;
		
		this._fireChange({reason: ChangeReason.Sort});
		// TODO remove this if the sorter event gets removed which is deprecated
		this._fireSort({sorter: aSorters});
		this.bIgnoreSuspend = false;
		
		return this;
	};
	
	/**
	 * Sorts the list
	 * @private
	 */
	ClientListBinding.prototype.applySort = function(){
		var that = this;
	
		if (!this.aSorters || this.aSorters.length == 0) {
			return;
		}
		
		this.aIndices = SorterProcessor.apply(this.aIndices, this.aSorters, function(vRef, sPath) {
			return that.oModel.getProperty(sPath, that.oList[vRef]);
		});
	};
		
	/**
	 * Filters the list.
	 * 
	 * Filters are first grouped according to their binding path.
	 * All filters belonging to a group are ORed and after that the
	 * results of all groups are ANDed.
	 * Usually this means, all filters applied to a single table column
	 * are ORed, while filters on different table columns are ANDed.
	 * 
	 * @param {sap.ui.model.Filter[]} aFilters Array of filter objects
	 * @param {sap.ui.model.FilterType} sFilterType Type of the filter which should be adjusted, if it is not given, the standard behaviour applies
	 * @return {sap.ui.model.ListBinding} returns <code>this</code> to facilitate method chaining 
	 * 
	 * @public
	 */
	ClientListBinding.prototype.filter = function(aFilters, sFilterType){
		this.updateIndices();
		if (aFilters instanceof Filter) {
			aFilters = [aFilters];
		}
		if (sFilterType == FilterType.Application) {
			this.aApplicationFilters = aFilters || [];
		} else if (sFilterType == FilterType.Control) {
			this.aFilters = aFilters || [];
		} else {
			//Previous behaviour
			this.aFilters = aFilters || [];
			this.aApplicationFilters = [];
		}
		aFilters = this.aFilters.concat(this.aApplicationFilters);
		if (aFilters.length == 0) {
			this.aFilters = [];
			this.aApplicationFilters = [];
			this.iLength = this._getLength();
		} else {
			this.applyFilter();
		}
		this.applySort();
		
		this.bIgnoreSuspend = true;
		
		this._fireChange({reason: ChangeReason.Filter});
		// TODO remove this if the filter event gets removed which is deprecated
		if (sFilterType == FilterType.Application) {
			this._fireFilter({filters: this.aApplicationFilters});
		} else {
			this._fireFilter({filters: this.aFilters});
		}
		this.bIgnoreSuspend = false;
		
		return this;
	};
	
	/**
	 * Filters the list
	 * Filters are first grouped according to their binding path.
	 * All filters belonging to a group are ORed and after that the
	 * results of all groups are ANDed.
	 * Usually this means, all filters applied to a single table column
	 * are ORed, while filters on different table columns are ANDed.
	 * Multiple MultiFilters are ORed.
	 *
	 * @private
	 */
	ClientListBinding.prototype.applyFilter = function(){
		if (!this.aFilters) {
			return;
		}
		var aFilters = this.aFilters.concat(this.aApplicationFilters),
			that = this;
		
		this.aIndices = FilterProcessor.apply(this.aIndices, aFilters, function(vRef, sPath) {
			return that.oModel.getProperty(sPath, that.oList[vRef]);
		});
		
		this.iLength = this.aIndices.length;
	};
	
	/**
	 * Get distinct values
	 *
	 * @param {String} sPath
	 *
	 * @protected
	 */
	ClientListBinding.prototype.getDistinctValues = function(sPath){
		var aResult = [],
			oMap = {},
			sValue,
			that = this;
		jQuery.each(this.oList, function(i, oContext) {
			sValue = that.oModel.getProperty(sPath, oContext);
			if (!oMap[sValue]) {
				oMap[sValue] = true;
				aResult.push(sValue);
			}
		});
		return aResult;
	};
	

	return ClientListBinding;

});
