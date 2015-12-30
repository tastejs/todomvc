/*!
  * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides the JSON model implementation of a list binding
sap.ui.define(['jquery.sap.global', './ChangeReason', './Context', './TreeBinding', 'sap/ui/model/SorterProcessor', 'sap/ui/model/FilterProcessor'],
	function(jQuery, ChangeReason, Context, TreeBinding, SorterProcessor, FilterProcessor) {
	"use strict";


	/**
	 *
	 * @class
	 * Tree binding implementation for client models
	 *
	 * @param {sap.ui.model.Model} oModel
	 * @param {string} sPath the path pointing to the tree / array that should be bound
	 * @param {object} [oContext=null] the context object for this databinding (optional)
	 * @param {array} [aFilters=null] predefined filter/s contained in an array (optional)
	 * @param {object} [mParameters=null] additional model specific parameters (optional)
	 * @param {sap.ui.model.Sorter[]} [aSorters=null] predefined sorter/s contained in an array (optional)
	 * @alias sap.ui.model.ClientTreeBinding
	 * @extends sap.ui.model.TreeBinding
	 */
	var ClientTreeBinding = TreeBinding.extend("sap.ui.model.ClientTreeBinding", /** @lends sap.ui.model.ClientTreeBinding.prototype */ {
	
		constructor : function(oModel, sPath, oContext, aFilters, mParameters, aSorters){
			TreeBinding.apply(this, arguments);
			if (!this.oContext) {
				this.oContext = "";
			}
			this._mLengthsCache = {};
			this.filterInfo = {};
			this.filterInfo.aFilteredContexts = [];
			this.filterInfo.oParentContext = {};
			
			if (this.aFilters) {
				if (this.oModel._getObject(this.sPath, this.oContext)) {
					this.filter(aFilters);
				}
			}
			
		}
		
	});
	
	/**
	 * Return root contexts for the tree
	 *
	 * @return {object[]} the contexts array
	 * @protected
	 * @param {integer} iStartIndex the startIndex where to start the retrieval of contexts
	 * @param {integer} iLength determines how many contexts to retrieve beginning from the start index.
	 */
	ClientTreeBinding.prototype.getRootContexts = function(iStartIndex, iLength) {
		if (!iStartIndex) {
			iStartIndex = 0;
		}
		if (!iLength) {
			iLength = this.oModel.iSizeLimit;
		}

		var aContexts = [];
		var that = this;
		
		if (!this.oModel.isList(this.sPath)) {
			var oContext = this.oModel.getContext(this.sPath);
			if (this.bDisplayRootNode) {
				aContexts = [oContext];
			} else {
				aContexts = this.getNodeContexts(oContext, iStartIndex, iLength);
			}
		} else {
			var sContextPath = this._sanitizePath(this.sPath);
			
			jQuery.each(this.oModel._getObject(sContextPath), function(iIndex, oObject) {
				that._saveSubContext(oObject, aContexts, sContextPath, iIndex);
			});

			this._applySorter(aContexts);
			
			this._setLengthCache(sContextPath, aContexts.length);
			
			return aContexts.slice(iStartIndex, iStartIndex + iLength);
		}
		
		return aContexts;
	};
	
	/**
	 * Return node contexts for the tree
	 * @param {object} oContext to use for retrieving the node contexts
	 * @param {integer} iStartIndex the startIndex where to start the retrieval of contexts
	 * @param {integer} iLength determines how many contexts to retrieve beginning from the start index.
	 * @return {object[]} the contexts array
	 * @protected
	 */
	ClientTreeBinding.prototype.getNodeContexts = function(oContext, iStartIndex, iLength) {
		if (!iStartIndex) {
			iStartIndex = 0;
		}
		if (!iLength) {
			iLength = this.oModel.iSizeLimit;
		}
		
		var sContextPath = this._sanitizePath(oContext.getPath());
	
		var aContexts = [],
			that = this,
			oNode = this.oModel._getObject(sContextPath),
			aArrayNames = this.mParameters && this.mParameters.arrayNames,
			aChildArray;
		
		if (oNode) {
			if (aArrayNames && jQuery.isArray(aArrayNames)) {
				jQuery.each(aArrayNames, function(iIndex, sArrayName){
					aChildArray = oNode[sArrayName];
					if (aChildArray) {
						jQuery.each(aChildArray, function(sSubName, oSubChild) {
							that._saveSubContext(oSubChild, aContexts, sContextPath, sArrayName + "/" + sSubName);
						});
					}
				});
			} else {
				jQuery.sap.each(oNode, function(sName, oChild) {
					if (jQuery.isArray(oChild)) {
						jQuery.each(oChild, function(sSubName, oSubChild) {
							that._saveSubContext(oSubChild, aContexts, sContextPath, sName + "/" + sSubName);
						});
					} else if (typeof oChild == "object") {
						that._saveSubContext(oChild, aContexts, sContextPath, sName);
					}
				});
			}
		}
		
		this._applySorter(aContexts);
		
		this._setLengthCache(sContextPath, aContexts.length);
		
		return aContexts.slice(iStartIndex, iStartIndex + iLength);
	};

	/**
	 * Returns if the node has child nodes.
	 *
	 * @param {object} oContext the context element of the node
	 * @return {boolean} true if node has children
	 *
	 * @public
	 */
	ClientTreeBinding.prototype.hasChildren = function(oContext) {
		if (oContext == undefined) {
			return false;
		}
		return this.getChildCount(oContext) > 0;
	};
	
	/**
	 * Retrieves the number of children for the given context.
	 * Makes sure the child count is retrieved from the length cache, and fills the cache if necessary.
	 * Calling it with no arguments or 'null' returns the number of root level nodes.
	 * 
	 * @param {sap.ui.model.Context} oContext the context for which the child count should be retrieved
	 * @return {int} the number of children for the given context
	 * @public
	 * @override
	 */
	ClientTreeBinding.prototype.getChildCount = function(oContext) {
		//if oContext is null or empty -> root level count is requested
		var sPath = oContext ? oContext.sPath : this.getPath();
		sPath = this._sanitizePath(sPath);
		
		// if the length is not cached, call the get*Contexts functions to fill it
		if (this._mLengthsCache[sPath] === undefined) {
			if (oContext) {
				this.getNodeContexts(oContext);
			} else {
				this.getRootContexts();
			}
		}
		
		return this._mLengthsCache[sPath];
	};
	
	/**
	 * Makes sure the path is prepended and appended with a "/" if necessary.
	 * @param {string} sContextPath the path to be checked
	 */
	ClientTreeBinding.prototype._sanitizePath = function (sContextPath) {
		if (!jQuery.sap.endsWith(sContextPath,"/")) {
			sContextPath = sContextPath + "/";
		}
		if (!jQuery.sap.startsWith(sContextPath,"/")) {
			sContextPath = "/" + sContextPath;
		}
		return sContextPath;
	};
	
	ClientTreeBinding.prototype._saveSubContext = function(oNode, aContexts, sContextPath, sName) {
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
	
	
	/**
	 * Filters the tree according to the filter definitions.
	 * 
	 * The filtering is applied recursively through the tree.
	 * The parent nodes of filtered child nodes will also be displayed if they don't match the filter conditions.
	 * All filters belonging to a group (=have the same path) are ORed and after that the
	 * results of all groups are ANDed.
	 * 
	 * @see sap.ui.model.TreeBinding.prototype.filter
	 * @param {sap.ui.model.Filter[]} aFilters Array of filter objects
	 * @return {sap.ui.model.ClientTreeBinding} returns <code>this</code> to facilitate method chaining
	 * @public
	 */
	ClientTreeBinding.prototype.filter = function(aFilters){
		// The filtering is applied recursively through the tree and stores all filtered contexts and its parent contexts in an array.
		
		// wrap single filters in an array
		if (aFilters && !jQuery.isArray(aFilters)) {
			aFilters = [aFilters];
		}
		
		// reset previous stored filter contexts
		this.filterInfo.aFilteredContexts = [];
		this.filterInfo.oParentContext = {};
		if (!aFilters || !jQuery.isArray(aFilters) || aFilters.length == 0) {
			this.aFilters = null;
		} else {
			this.aFilters = aFilters;
			// start with binding path root
			var oContext = new Context(this.oModel, this.sPath);
			this.filterRecursive(oContext);
		}
		this._mLengthsCache = {};
		this._fireChange({reason: "filter"});
		// TODO remove this if the filter event is removed
		this._fireFilter({filters: aFilters});
		
		return this;
	};
	
	/**
	 * filters the tree recursively.
	 * @param {object} oParentContext the context where to start. The children of this node context are then filtered recursively.
	 * @private
	 */
	ClientTreeBinding.prototype.filterRecursive = function(oParentContext){
	
		this.bIsFiltering = true;
		var aChildren = this.getNodeContexts(oParentContext);
		this.bIsFiltering = false;
	
		if (aChildren.length > 0) {
			var that = this;
			jQuery.each(aChildren, function(i, oChildContext){
				that.filterRecursive(oChildContext);
			});
			this.applyFilter(oParentContext);
		}
	};
	
	
	/**
	 * Performs the real filtering and stores all filtered contexts and its parent context into an array.
	 * @param {object} oParentContext the context where to start. The children of this node context are filtered.
	 * @private
	 */
	ClientTreeBinding.prototype.applyFilter = function(oParentContext){
		if (!this.aFilters) {
			return;
		}
		var that = this,
			aFiltered = [];
		
		this.bIsFiltering = true;
		var aUnfilteredContexts = this.getNodeContexts(oParentContext);
		this.bIsFiltering = false;
		
		aFiltered = FilterProcessor.apply(aUnfilteredContexts, this.aFilters, function (oContext, sPath) {
			return that.oModel.getProperty(sPath, oContext);
		});
		
		if (aFiltered.length > 0) {
			jQuery.merge(this.filterInfo.aFilteredContexts, aFiltered);
			this.filterInfo.aFilteredContexts.push(oParentContext);
			this.filterInfo.oParentContext = oParentContext;
		}
		// push additionally parentcontexts if any children are already included in filtered contexts
		if (jQuery.inArray(this.filterInfo.oParentContext, aUnfilteredContexts) != -1) {
			this.filterInfo.aFilteredContexts.push(oParentContext);
			// set the parent context which was added to be the new parent context
			this.filterInfo.oParentContext = oParentContext;
		}
	
	};
	
	/**
	 * Sorts the contexts of this ClientTreeBinding.
	 * The tree will be sorted level by level. So the nodes are NOT sorted absolute, but relative to their parent node,
	 * to keep the hierarchy untouched.
	 * 
	 * @param {sap.ui.model.Sorter[]} an array of Sorter instances which will be applied
	 * @return {sap.ui.model.ClientTreeBinding} returns <code>this</code> to facilitate method chaining
	 * @public
	 */
	ClientTreeBinding.prototype.sort = function (aSorters) {
		aSorters = aSorters || [];
		this.aSorters = jQuery.isArray(aSorters) ? aSorters : [aSorters];
		
		this._fireChange({reason: ChangeReason.Sort});
		
		return this;
	};
	
	/**
	 * internal function to apply the defined this.aSorters for the given array
	 * @param {array} aContexts the context array which should be sorted (inplace)
	 */
	ClientTreeBinding.prototype._applySorter = function (aContexts) {
		var that = this;
		SorterProcessor.apply(aContexts, this.aSorters, function(oContext, sPath) {
			return that.oModel.getProperty(sPath, oContext);
		},
		function (oContext) {
			//the context path is used as a key for internal use in the SortProcessor.
			return oContext.getPath();
		});
	};
	
	/**
	 * Sets the length cache.
	 * Called by get*Contexts() to keep track of the child count (after filtering)
	 */
	ClientTreeBinding.prototype._setLengthCache = function (sKey, iLength) {
		// keep track of the child count for each context (after filtering)
		this._mLengthsCache[sKey] = iLength;
	};
	
	/**
	 * Check whether this Binding would provide new values and in case it changed,
	 * inform interested parties about this.
	 * 
	 * @param {boolean} bForceupdate
	 * 
	 */
	ClientTreeBinding.prototype.checkUpdate = function(bForceupdate){
		this._mLengthsCache = {};
		this._fireChange();
	};
	

	return ClientTreeBinding;

});
