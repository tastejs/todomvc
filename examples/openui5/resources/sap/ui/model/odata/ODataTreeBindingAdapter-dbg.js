/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides class sap.ui.model.odata.ODataTreeBindingAdapter
sap.ui.define(['jquery.sap.global', 'sap/ui/model/TreeBinding', './v2/ODataTreeBinding', 'sap/ui/model/TreeBindingAdapter' ,'sap/ui/table/TreeAutoExpandMode', 'sap/ui/model/ChangeReason', 'sap/ui/model/TreeBindingUtils'],
	function(jQuery, TreeBinding, ODataTreeBinding, TreeBindingAdapter, TreeAutoExpandMode, ChangeReason, TreeBindingUtils) {
	"use strict";

	/**
	 * Adapter for TreeBindings to add the ListBinding functionality and use the 
	 * tree structure in list based controls.
	 *
	 * @alias sap.ui.model.odata.ODataTreeBindingAdapter
	 * @function
	 * @experimental This module is only for experimental and internal use!
	 * @protected
	 */
	var ODataTreeBindingAdapter = function() {
	
		// ensure only TreeBindings are enhanced which have not been enhanced yet
		if (!(this instanceof TreeBinding && this.getContexts === undefined)) {
			return;
		}

		TreeBindingAdapter.apply(this);

		// apply the methods of the adapters prototype to the TreeBinding instance
		for (var fn in ODataTreeBindingAdapter.prototype) {
			if (ODataTreeBindingAdapter.prototype.hasOwnProperty(fn)) {
				this[fn] = ODataTreeBindingAdapter.prototype[fn];
			}
		}
		
		// make sure we have a parameter object
		this.mParameters = this.mParameters || {};
		
		// initialize the contexts
		this._aRowIndexMap = [];
		
		//Store length and threshold for all requests
		this._iThreshold = 0;
		this._iPageSize = 0;
		
		//set the default auto expand mode
		this.setAutoExpandMode(this.mParameters.autoExpandMode || TreeAutoExpandMode.Sequential);
		
		//default value for collapse recursive
		if (this.mParameters.collapseRecursive === undefined) {
			this.bCollapseRecursive = true;
		} else {
			this.bCollapseRecursive = !!this.mParameters.collapseRecursive;
		}
		
		//create general tree structure
		this._createTreeState();
	};

	/**
	 * Returns true or false, depending on the child count of the given node.
	 * @override
	 */
	ODataTreeBindingAdapter.prototype.nodeHasChildren = function(oNode) {
		jQuery.sap.assert(oNode, "ODataTreeBindingAdapter.nodeHasChildren: No node given!");

		//check if the node has children
		if (!oNode) {
			return false;
		} else if (oNode.isArtificial) {
			//our artificial root node ALWAYS has children
			return true;
		} else {
			return ODataTreeBinding.prototype.hasChildren.call(this, oNode.context);
		}
	};

	/**
	 * Calculates a group id for the given node.
	 * The actual group ID differs between hierarchy-annotations and navigation properties
	 * @override
	 */
	ODataTreeBindingAdapter.prototype._calculateGroupID = function (oNode) {

		var sGroupIDBase = "";
		var sGroupIDSuffix = "";

		//artificial root has always "/" as groupID
		if (oNode.context === null) {
			return "/";
		}

		if (oNode.parent) {
			//case 1: nested node, group id is the path along the parents
			sGroupIDBase = oNode.parent.groupID;
			sGroupIDBase = sGroupIDBase[sGroupIDBase.length - 1] !== "/" ? sGroupIDBase + "/" : sGroupIDBase;
			if (this.bHasTreeAnnotations) {
				sGroupIDSuffix = oNode.context.getProperty(this.oTreeProperties["hierarchy-node-for"]) + "/";
			} else {
				//odata navigation properties
				sGroupIDSuffix = oNode.context.sPath.substring(1) + "/";
			}
		} else {
			//case 2: node sits on root level
			if (this.bHasTreeAnnotations) {
				sGroupIDBase = "/";
				sGroupIDSuffix = oNode.context.getProperty(this.oTreeProperties["hierarchy-node-for"]) + "/";
			} else {
				//odata nav properties case
				sGroupIDBase = "/";
				sGroupIDSuffix = oNode.context.sPath[0] === "/" ? oNode.context.sPath.substring(1) : oNode.context.sPath;
			}
		}

		var sGroupID = sGroupIDBase + sGroupIDSuffix;

		return sGroupID;
	};
	
	ODataTreeBindingAdapter.prototype.resetData = function(oContext, mParameters) {
		var vReturn = ODataTreeBinding.prototype.resetData.call(this, oContext, mParameters);

		// clear the mapping table
		this._aRowIndexMap = [];

		// and the root node
		this._oRootNode = undefined;

		// clear page size
		this._iPageSize = 0;
		this._iThreshold = 0;

		if (!mParameters || mParameters.reason !== ChangeReason.Sort) {
			//remove the selection/reset lead selection index
			this.clearSelection();

			// clear the tree state
			this._createTreeState(true);
		}

		return vReturn;
	};

	return ODataTreeBindingAdapter;
	
}, /* bExport= */ true);
