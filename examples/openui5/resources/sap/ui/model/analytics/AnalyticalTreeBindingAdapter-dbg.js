/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides class sap.ui.model.odata.ODataAnnotations
sap.ui.define(['jquery.sap.global', 'sap/ui/model/TreeBinding', './AnalyticalBinding', 'sap/ui/table/TreeAutoExpandMode', 'sap/ui/model/ChangeReason', 'sap/ui/model/odata/ODataTreeBindingAdapter', 'sap/ui/model/TreeBindingAdapter', 'sap/ui/model/TreeBindingUtils'],
	function(jQuery, TreeBinding, AnalyticalBinding, TreeAutoExpandMode, ChangeReason, ODataTreeBindingAdapter, TreeBindingAdapter, TreeBindingUtils) {
	"use strict";

	/**
	 * Adapter for TreeBindings to add the ListBinding functionality and use the 
	 * tree structure in list based controls.
	 *
	 * @alias sap.ui.model.analytics.AnalyticalTreeBindingAdapter
	 * @class
	 * @experimental This module is only for experimental use!
	 * @protected
	 */
	var AnalyticalTreeBindingAdapter = function() {
	
		// ensure only TreeBindings are enhanced which have not been enhanced yet
		if (!(this instanceof TreeBinding && this.getContexts === undefined)) {
			return;
		}
	
		ODataTreeBindingAdapter.apply(this);
		
		// apply the methods of the adapters prototype to the TreeBinding instance
		for (var fn in AnalyticalTreeBindingAdapter.prototype) {
			if (AnalyticalTreeBindingAdapter.prototype.hasOwnProperty(fn)) {
				this[fn] = AnalyticalTreeBindingAdapter.prototype[fn];
			}
		}
		
		//set the default auto expand mode
		this.setAutoExpandMode(this.mParameters.autoExpandMode || TreeAutoExpandMode.Bundled);
	};
	
	/**
	 * Returns the Root context of our tree, which is actually the context for the Grand Total
	 * Used by the AnalyticalTable to display the sum row.
	 */
	AnalyticalTreeBindingAdapter.prototype.getGrandTotalContext = function () {
		if (this._oRootNode) {
			return this._oRootNode.context;
		}
	};
	
	/**
	 * Returns the Root node, which contains the rendering information. 
	 */
	AnalyticalTreeBindingAdapter.prototype.getGrandTotalContextInfo = function () {
		return this._oRootNode;
	};
	
	AnalyticalTreeBindingAdapter.prototype.getLength = function() {
		if (!this._oRootNode) {
			return 0;
		}
		
		//in the autoExpand mode the length of the binding is defined by the watermark's position in the tree
		if (this._oRootNode && this._oWatermark && this._isRunningInAutoExpand(TreeAutoExpandMode.Bundled)) {
			
			//if the root length is not final -> we have to return the root node magnitude instead of the absolute index of the watermark
			if (this._oWatermark.groupID === this._oRootNode.groupID) {
				return this._oRootNode.magnitude + this._oRootNode.numberOfTotals;
			}
			
			// +1 because we have at least one node more after the watermark
			// this is important for the table's scrollbar calculation 
			return this._oWatermark.absoluteNodeIndex + this._oRootNode.numberOfTotals + 1;
		}
		
		// The length is the sum of the trees magnitue + all sum rows (from expanded nodes)
		return this._oRootNode.magnitude + this._oRootNode.numberOfTotals;
	};
	
	AnalyticalTreeBindingAdapter.prototype.getContextByIndex = function (iIndex) {
		// If we have fewer root level entries than the table has rows,
		// the table expectes the last entry in the flat nodes array to be the root node (sum row)
		if (this._oRootNode && iIndex === (this.getLength() - 1) && this.providesGrandTotal() && this.hasTotaledMeasures()) {
			return this._oRootNode.context;
		}
		
		var oNode = this.findNode(iIndex);
		
		// if the node was not found in the current tree snapshot -> rebuild the tree, and if necessary request the node
		if (!oNode || !oNode.context) {
			//@TODO: Maybe preserve the Row Index Cache, before calling getContexts, and restore it afterwards
			//Beware: getContexts might return nothing, if the context was not yet loaded!
			oNode = {context: this.getContexts(iIndex, 1, 0)[0]};
		}
		return oNode ? oNode.context : undefined;
	};
	
	AnalyticalTreeBindingAdapter.prototype.getNodeByIndex = function(iIndex) {
		// If we have fewer root level entries than the table has rows,
		// the table expectes the last entry in the flat nodes array to be the root node (sum row)
		if (iIndex === (this.getLength() - 1) && this.providesGrandTotal() && this.hasTotaledMeasures()) {
			return this._oRootNode;
		}
		
		// if the requested index is bigger than the magnitude of the tree, the index can never
		// be inside the tree. The tree may only shrink due to multi-unit merging
		if (iIndex >= this.getLength()) {
			return undefined;
		}
		
		return this.findNode(iIndex);
	};
	
	/**
	 * Checks if the given node can be selected.
	 * In the AnalyticalTable, only leaf nodes can be selected.
	 */
	AnalyticalTreeBindingAdapter.prototype._isNodeSelectable = function (oNode) {
		if (!oNode) {
			return false;
		}
		return oNode.isLeaf && !oNode.isArtificial;
	};
	
	/**
	 * Retrieves the requested part from the tree.
	 * @param {int} iStartIndex the first index to be retrieved
	 * @param {int} iLength the number of entries to be retrieved, starting at iStartIndex
	 * @param {int} iThreshold the number of additional entries, which will be loaded after (iStartIndex + iLength) as a buffer
	 */
	AnalyticalTreeBindingAdapter.prototype.getContexts = function(iStartIndex, iLength, iThreshold) {
		if (!iLength) {
			iLength = this.oModel.iSizeLimit;
		}
		if (!iThreshold) {
			iThreshold = 0;
		}
		
		this._iPageSize = iLength;
		this._iThreshold = Math.max(this._iThreshold, iThreshold);
		
		// clear the overall rowIndex to tree node map
		this._aRowIndexMap = [];
		
		this._buildTree(iStartIndex, iLength);
		
		// retrieve the requested/visible section of nodes from the tree
		var aNodes = [];
		if (this._oRootNode) {
			aNodes = this._retrieveNodeSection(this._oRootNode, iStartIndex, iLength);
		}
		
		// keep a map between Table.RowIndex and tree nodes
		this._updateRowIndexMap(aNodes, iStartIndex);
		
		var aContexts = [];
		//find missing spots in our visible section
		var mMissingSections;
		for (var i = 0; i < aNodes.length; i++) {
			var oNode = aNodes[i];
			
			//user scrolled into the water mark node, which is the last of the guaranteed loaded page (length + threshold)
			if (this._isRunningInAutoExpand(TreeAutoExpandMode.Bundled) && this._oWatermark) {
				if (oNode.groupID === this._oWatermark.groupID || 
						(this._oWatermark.groupID === this._oRootNode.groupID && (iStartIndex + i + 1) == this.getLength() - 1)) {
					this._autoExpandPaging();
				}
			}
			
			// we found a gap because the node is empty (context is undefined)
			if (!oNode.context) {
				mMissingSections = mMissingSections || {};
				// check if we already build a missing section
				var oParentNode = oNode.parent;
				
				mMissingSections[oParentNode.groupID] = oParentNode;
				
				this._updateNodeSections(oParentNode.groupID, {startIndex: oNode.positionInParent, length: 1});
			}
			
			aContexts.push(oNode.context);
		}
		
		// trigger load for nodes with missing sections
		if (mMissingSections) {
			var that = this;
			
			//if we have a missing section inside a subtree, we need to reload this subtree
			jQuery.each(mMissingSections, function (sGroupID, oNode) {
				// reset the root of the subtree
				oNode.magnitude = 0;
				oNode.numberOfTotals = 0;
				
				that._loadChildContexts(oNode, {absoluteNodeIndex: oNode.absoluteNodeIndex});
			});
			
			// try to fill gaps in our return array if we already have new data (thanks to thresholding)
			aContexts = [];
			for (var j = 0; j < aNodes.length; j++) {
				var oNode = aNodes[j];
				aContexts.push(oNode.context);
			}
		}
		
		return aContexts;
	};
	
	/**
	 * Trigger paging requests in auto expand mode
	 */
	AnalyticalTreeBindingAdapter.prototype._autoExpandPaging = function () {
		jQuery.sap.assert(this._oWatermark, "No watermark was set!");
		jQuery.sap.assert(this._isRunningInAutoExpand(TreeAutoExpandMode.Bundled), "Optimised AutoExpand Paging can only be used with TreeAutoExpandMode.Bundled!");
		// paging in the autoexpand case
		var aChildContexts = this.getNodeContexts(this._oWatermark.context, {
			startIndex: this._oWatermark.startIndex, //this._oWatermark.children.length,
			length: this._iPageSize,
			threshold: this._iThreshold,
			level: this._oWatermark.level,
			numberOfExpandedLevels: this._oWatermark.autoExpand
		});
		
		return aChildContexts;
	};
	
	/**
	 * This hook is called after all children of a node are matched.
	 * Used to insert sum row nodes (if any).
	 * @param {object} oNode the node which is currently matched (and whose children have already been matched)
	 * @see ODataTreeBindingAdapter#_match for further API Documentation, all other parameters are defined there
	 */
	AnalyticalTreeBindingAdapter.prototype._afterMatchHook = function (oNode, aResults, iMaxNumberOfMatches, fnMatchFunction, iPositionInParent, oParentNode) {
		if (oNode.sumNode && oNode !== this._oRootNode) {
			if (aResults.length === iMaxNumberOfMatches) {
				return true;
			}
			
			// make sure the additional sum node is also matched (and possibly pushed to the aResults array)
			var bNodeMatches = fnMatchFunction.call(this, oNode.sumNode, oNode.sumNode.positionInParent, oParentNode);
			if (bNodeMatches) {
				aResults.push(oNode.sumNode);
			}
		}
	};
	
	/**
	 * This hook is called after all children of "oNode" have been mapped.
	 * Used to also map on sum nodes (if any).
	 * @param {object} oNode the node which will be mapped again
	 */
	AnalyticalTreeBindingAdapter.prototype._afterMapHook = function (oNode, fnMapFunction) {
		if (oNode.sumNode && oNode !== this._oRootNode) {
			fnMapFunction.call(this, oNode.sumNode);
		}
	};
	
	/**
	 * Creates a sum node. 
	 * The sum node is later stored inside the tree structure, but is not part of the children array of a node.
	 * A sum node is a copy of the given node, minus the children and with a relative "positionInParent" to it's children.
	 * This means the sum node comes after the children of the given node.
	 * @see AnalyticalTreeBindingAdapter#_loadChildContexts
	 */
	AnalyticalTreeBindingAdapter.prototype._createSumNode = function (oNode) {
		var sumNode;
		
		// check for grand totals requested
		if (this.bProvideGrandTotals && !this.mParameters.sumOnTop && this.hasTotaledMeasures() && oNode.children.length > 1) {
			sumNode = this._createNode({
				parent: oNode.parent, 
				positionInParent: oNode.children.length, //sum row has position after every child in the parent node
				context: oNode.context,
				level: oNode.level
			});
			//an empty node state, only used to store rendering infos
			sumNode.nodeState = this._createNodeState({groupID: sumNode.groupID, sum: true, expanded: false});
		}
		
		return sumNode;
	};
	
	/**
	 * Builds the tree starting from the root node.
	 * @param {int} iStartIndex used as the startIndex of the initial page for the root node
	 * @param {int} iLength used as the length of the initial page for the root node
	 */
	AnalyticalTreeBindingAdapter.prototype._buildTree = function(iStartIndex, iLength) {
		//throw away our tree
		this._oRootNode = undefined;
		this._oWatermark = undefined;
		
		//Try to load the root context(s)
		var iNumberOfExpandedLevels = this.mParameters && this.getNumberOfExpandedLevels();
		var aRootContext = this.getRootContexts({
			startIndex: 0,
			length: this._iPageSize,
			threshold: this._iThreshold,
			numberOfExpandedLevels: this._autoExpandMode === TreeAutoExpandMode.Bundled ? iNumberOfExpandedLevels : undefined
		});
		var oRootContext;
		// sanity check for the binding
		// if aRootContexts is null -> no $select is given, because no dimensions are part of the aggregation-level
		if (aRootContext == null) {
			jQuery.sap.log.warning("AnalyticalTreeBindingAdapter: No Dimensions given. An artificial rootContext has be created. Please check your Table/Service definition for dimension columns!");
		} else {
			// if aRootContexts is empty [] -> request sent and everything is ok
			oRootContext = aRootContext[0];
		}
		
		//If we have no root contexts we cannot load any children
		if (!oRootContext) {
			return;
		}
		
		var oRootNodeState = this._getNodeState("/");
		//the root node is always expanded
		if (!oRootNodeState) {
			oRootNodeState = this._updateTreeState({groupID: "/", expanded: true, sum: true});
			// in this case initially the root does not have any section (of its children)
			this._updateNodeSections("/", {
				startIndex: 0,
				length: iLength
			});
		}
		
		//create the root node (contains the grand total sum)
		this._oRootNode = this._createNode({
			context: oRootContext,
			parent: null,
			level: 0,
			nodeState: oRootNodeState,
			isLeaf: false,
			autoExpand: iNumberOfExpandedLevels,
			absoluteNodeIndex: -1 //-1 because the root should not be counted as the first node in the tree (first node is 0)
		});
		
		this._oRootNode.isArtificial = true;
		
		//The root context is always automatically expanded
		this._loadChildContexts(this._oRootNode, {absoluteNodeIndex: -1});
		
	};
	
	/**
	 * (Re-)Loads the child contexts for the given node "oNode".
	 * This happens recursively for all expanded/autoExpanded child nodes -> the whole subtree starting at "oNode" is created.
	 * All subsequently loaded child nodes will be added to the children collection of oNode.
	 * Reuses the tree node objects (if any).
	 * Since object references are used, all changes to subtree are directly reflected inside the main tree structure.
	 */
	AnalyticalTreeBindingAdapter.prototype._loadChildContexts = function (oNode, oRecursionDetails) {
		var oNodeState = oNode.nodeState;

		// make sure the children array gets at least the requested length
		var iMaxGroupSize = this.getGroupSize(oNode.context, oNode.level);
		if (iMaxGroupSize >= 0) {
			if (!oNode.children[iMaxGroupSize - 1]) {
				oNode.children[iMaxGroupSize - 1] = undefined;
			}
			
			oNode.sumNode = this._createSumNode(oNode);
		}
		
		//iterate all loaded (known) sections
		for (var i = 0; i < oNodeState.sections.length; i++) {
			
			var oCurrentSection = oNodeState.sections[i];
			
			// check if section is still relevant
			// a section may vanish if the startIndex is now outside the known groupsize
			if (oCurrentSection.startIndex > oNode.children.length) {
				continue;
			}
			
			var iRequestedLength;
			if (iMaxGroupSize === -1) {
				iRequestedLength = oCurrentSection.length;
			} else {
				//the maximum entries we can request is the groupSize
				iRequestedLength = Math.min(oCurrentSection.length, iMaxGroupSize - oCurrentSection.startIndex);
			}
			
			//if we are in the autoexpand mode "bundled", supress additional requests during the tree traversal
			//paging is handled differently
			var bSupressRequest = false;
			if (oNode.autoExpand >= 0 && this._isRunningInAutoExpand(TreeAutoExpandMode.Bundled)) {
				bSupressRequest = true;
				iRequestedLength = Math.max(0, iMaxGroupSize);
			}
			
			//try to load the contexts for this sections (may be [])
			var aChildContexts = this.getNodeContexts(oNode.context, {
				startIndex: oCurrentSection.startIndex,
				length: iRequestedLength,
				//if we only retrieve he known data from the AnalyticalBinding we need no Threshold
				threshold: bSupressRequest ? 0 : this._iThreshold,
				level: oNode.level,
				supressRequest: bSupressRequest
			});
			
			//for each child context we create a new node
			for (var j = 0; j < aChildContexts.length; j++) {
				var oChildContext = aChildContexts[j];
				
				// calculate the index of the child node in the children array
				// the offset in the children array is the section start index
				var iChildIndex = j + oCurrentSection.startIndex;
				
				var oChildNode = oNode.children[iChildIndex];
				
				//the updated node data after this tree building cycle
				var oUpdatedNodeData = {
					context: aChildContexts[j],
					parent: oNode,
					level: oNode.level + 1,
					positionInParent: iChildIndex,
					autoExpand: Math.max(oNode.autoExpand - 1, -1),
					absoluteNodeIndex: (++oRecursionDetails.absoluteNodeIndex)
				};
				
				// if we already have a child node reuse it, otherwise create a new one
				// Using an object reference allows us to automatically update our "snapshot" of the tree, we retrieve in getContexts
				if (oChildNode) {
					oChildNode.context = oUpdatedNodeData.context;
					oChildNode.parent = oUpdatedNodeData.parent;
					oChildNode.level = oUpdatedNodeData.level;
					oChildNode.positionInParent = oUpdatedNodeData.positionInParent;
					oChildNode.magnitude = 0;
					oChildNode.numberOfTotals = 0;
					oChildNode.autoExpand = oUpdatedNodeData.autoExpand;
					oChildNode.absoluteNodeIndex = oUpdatedNodeData.absoluteNodeIndex;
					//calculate the group id for the given context
					//if we reach this point, the binding returned a context from which we can calculate the group id
					var sGroupIDForChild;
					if (oChildContext) {
						sGroupIDForChild = this._calculateGroupID(oChildNode);
					}
					oChildNode.groupID = sGroupIDForChild;
				} else {
					//create a node one level deeper (missing a group ID and a context)
					oChildNode = this._createNode(oUpdatedNodeData);
				}
				
				//retrieve the node state OR create one if necessary
				oChildNode.nodeState = this._getNodeState(oChildNode.groupID);
				if (!oChildNode.nodeState) {
					oChildNode.nodeState = this._createNodeState({
						groupID: oChildNode.groupID,
						expanded: false // a new node state is never expanded (EXCEPT during auto expand!)
					});
				}
				
				oChildNode.isLeaf = !this.nodeHasChildren(oChildNode);
				
				oNode.children[iChildIndex] = oChildNode;
				
				if (oChildNode.isLeaf) {
					oNode.numberOfLeafs += 1;
				}
				
				//if the parent node is in selectAllMode, select this child node
				if (oChildNode.parent.nodeState.selectAllMode && !this._mTreeState.deselected[oChildNode.groupID] && oChildNode.isLeaf) {
					this.setNodeSelection(oChildNode.nodeState, true);
				}
				
				// if the child node was previously expanded, it has to be expanded again after we rebuilt our tree
				// --> recursion
				// but only if we have at least 1 group (otherwise we have a flat list and not a tree)
				if ((oChildNode.autoExpand >= 0 || oChildNode.nodeState.expanded) && this.isGrouped()) {
					if (!this._mTreeState.collapsed[oChildNode.groupID]) {
						
						// propagate teh selectAllMode to the childNode, but only if the parent node is flagged and we are still autoexpanding
						if (oChildNode.autoExpand >= 0 && oChildNode.parent.nodeState.selectAllMode && !this._mTreeState.deselected[oChildNode.groupID]) {
							if (oChildNode.nodeState.selectAllMode === undefined) {
								oChildNode.nodeState.selectAllMode = true;
							}
						}
						
						this._updateTreeState({groupID: oChildNode.nodeState.groupID, fallbackNodeState: oChildNode.nodeState , expanded: true});
						this._loadChildContexts(oChildNode, oRecursionDetails);
					}
					// sum up the magnitude/sumRows when moving up in the recursiom 
					oNode.magnitude += oChildNode.magnitude;
					oNode.numberOfTotals += oChildNode.numberOfTotals;
					oNode.numberOfLeafs += oChildNode.numberOfLeafs;
				}
			}
		}
		
		// add up the sum of all sub-tree magnitudes
		// if we run in autoexpand mode, we need to take the full length of the children array
		iMaxGroupSize = this._isRunningInAutoExpand(TreeAutoExpandMode.Bundled) ? oNode.children.length : iMaxGroupSize;
		oNode.magnitude += Math.max(iMaxGroupSize || 0, 0);
		
		if (!iMaxGroupSize && !this._isRunningInAutoExpand(TreeAutoExpandMode.Bundled)) {
			jQuery.sap.log.warning("AnalyticalTreeBindingAdapter: iMaxGroupSize(" + iMaxGroupSize + ") is undefined for node '" + oNode.groupID + "'!");
		}
		
		// add up the total number of sum rows (expanded nodes with at least one child)
		// the number of totals for the root node is always 1 except in case the grand totals were not requested
		if (oNode.sumNode || (oNode === this._oRootNode && this.providesGrandTotal() && this.hasTotaledMeasures())) {
			oNode.numberOfTotals += 1;
		}
		
		
		// Determine a Watermark node for auto expand paging: 
		// Find the first node for which the group length is not final.
		// ONLY consider nodes with an autoExpand level to become a watermark node (autoExpand != -1)
		if (this._isRunningInAutoExpand(TreeAutoExpandMode.Bundled) && oNode.autoExpand != -1) {
			if (!this._oWatermark && !oNode.isLeaf && !this.mFinalLength[oNode.groupID]) {
				//this._oWatermark = oNode;
				this._oWatermark = {
					groupID: oNode.groupID,
					context: oNode.context,
					absoluteNodeIndex: oNode.absoluteNodeIndex,
					startIndex: oNode.children.length,
					level: oNode.level,
					autoExpand: oNode.autoExpand
				};
			}
		}
		
	};
	
	/**
	 * Retrieves the group ID for the given node.
	 * The implementation differs from the ODataTreeBindingAdapter, since the AnalyticalBinding already exposes
	 * certain convenience functions.
	 */
	AnalyticalTreeBindingAdapter.prototype._calculateGroupID = function (oNode) {
		var sGroupID;
		var iMaxLevel = this.aAggregationLevel.length;
		
		// in case we have no grouping at all, the "groupID" for each node is based on its position as the roots child 
		if (!this.isGrouped() && oNode && oNode.positionInParent) {
			sGroupID = "/" + oNode.positionInParent;
		} else {
			// if the level of the node exceeds the maximum level (in the analytical case, this is the aggregation level), 
			// the group id is also appended with the relative parent position
			if (oNode.level > iMaxLevel) {
				sGroupID = this._getGroupIdFromContext(oNode.context, iMaxLevel);
				jQuery.sap.assert(oNode.positionInParent != undefined, "If the node level is greater than the number of grouped columns, the position of the node to its parent must be defined!");
				sGroupID +=  oNode.positionInParent;
			} else {
				//this is the best case, the node sits on a higher level than the aggregation level
				sGroupID = this._getGroupIdFromContext(oNode.context, oNode.level);
			}
		}
		return sGroupID;
	};
	
	/**
	 * Collapses the given node, either a node instance or an index.
	 * Overwritten from the ODataTreeBindingAdapter, because of additional analytical logic.
	 */
	AnalyticalTreeBindingAdapter.prototype.collapse = function(vParam) {
		var oNodeStateForCollapsingNode, oNode;
		
		//check if the Parameter is a node state object
		if (typeof vParam === "object") {
			oNodeStateForCollapsingNode = vParam;
		} else if (typeof vParam === "number") {
			oNode = this.findNode(vParam);
			jQuery.sap.assert(oNode && oNode.nodeState, "AnalyticalTreeBindingAdapter.collapse(" + vParam + "): No node found!");
			//jump out if no node was found
			if (!oNode) {
				return;
			}
			
			oNodeStateForCollapsingNode = oNode.nodeState;
		}
		
		//mark the node as collapsed
		this._updateTreeState({groupID: oNodeStateForCollapsingNode.groupID, expanded: false});
		
		// remove the select-all state
		oNodeStateForCollapsingNode.selectAllMode = false;
		
		var bAutoExpandRequestTriggered = false;
		
		if (this.bCollapseRecursive || this._isRunningInAutoExpand(TreeAutoExpandMode.Bundled)) {
			
			var sGroupIDforCollapsingNode = oNodeStateForCollapsingNode.groupID;
			
			// in case we collapsed a parent(chain) of the watermark node, we have to page, because we can not know how many
			// nodes will move up after collapsing the subtree. This is important because the watermark node will never be visible
			if (this._isRunningInAutoExpand(TreeAutoExpandMode.Bundled) && this._oWatermark && jQuery.sap.startsWith(this._oWatermark.groupID, sGroupIDforCollapsingNode)) {
				// move the watermark node to the parent of the collapsed node, because the auto-expand paging starting point needs to be moved
				if (oNode && oNode.parent) {
					this._oWatermark = {
						groupID: oNode.parent.groupID,
						context: oNode.parent.context,
						absoluteNodeIndex: oNode.parent.absoluteNodeIndex,
						startIndex: oNode.positionInParent + 1, //+1 is the next (right) sibling of the collapsed node
						level: oNode.parent.level,
						autoExpand: oNode.parent.autoExpand
					};
				}
				
				this._autoExpandPaging();
				bAutoExpandRequestTriggered = true;
			}
			
			// Collapse all subsequent child nodes, this is determined by a common groupID prefix, e.g.: "/A100-50/" is the parent of "/A100-50/Finance/"
			// All expanded nodes which start with 'sGroupIDforCollapsingNode', are basically children of it and also need to be collapsed
			var that = this;
			jQuery.each(this._mTreeState.expanded, function (sGroupID, oNodeState) {
				if (jQuery.sap.startsWith(sGroupID, sGroupIDforCollapsingNode)) {
					that._updateTreeState({groupID: sGroupID, expanded: false});
				}
			});
			
			// also remove selections from child nodes of the collapsed node
			jQuery.each(this._mTreeState.selected, function (sGroupID, oNodeState) {
				if (jQuery.sap.startsWith(sGroupID, sGroupIDforCollapsingNode)) {
					oNodeState.selectAllMode = false;
					that.setNodeSelection(oNodeState, false);
				}
			});
		}
		
		// only fire change if no autoexpand request is triggered:
		// this prevents the table from rerendering because, the autoExpand logic
		// uses the same collapse/expand functions as the user interactions
		if (!bAutoExpandRequestTriggered) {
			this._fireChange({reason: ChangeReason.Collapse});
		}
	};

	AnalyticalTreeBindingAdapter.prototype.collapseToLevel = function(iLevel) {
		// reconfigure the auto expand level
		this.setNumberOfExpandedLevels(iLevel, true);
		TreeBindingAdapter.prototype.collapseToLevel.call(this, iLevel);
	};

	
	/**
	 * Returns if a node hase children or not.
	 * @param {object} oNode tree node
	 * @return {boolean} true if the node has children, false otherwise
	 */
	AnalyticalTreeBindingAdapter.prototype.nodeHasChildren = function(oNode) {
		jQuery.sap.assert(oNode, "AnalyticalTreeBindingAdapter.nodeHasChildren: No node given!");
		
		//check if the node has children
		if (!oNode || !oNode.parent || oNode.nodeState.sum) {
			return false;
		} else if (oNode.isArtificial) {
			return true;
		} else {
			return AnalyticalBinding.prototype.hasChildren.call(this, oNode.context, { level: oNode.level });
		}
	};
	
	/**
	 * Resets the data.
	 * If mParameters.reason is set to ChangeReason.Sort:
	 * Expand/Collapse states and the selection is kept in case the reset was triggered from within a sort() call.
	 * @param {object} oContext the context which will be reset (if undefined, the whole binding is reset)
	 * @param {object} mParameters.reason the reason for the reset
	 */
	AnalyticalTreeBindingAdapter.prototype.resetData = function(oContext, mParameters) {
		var vReturn = AnalyticalBinding.prototype.resetData.call(this, oContext, mParameters);
		
		// clear the mapping table
		this._aRowIndexMap = [];
		
		// and the root node
		this._oRootNode = undefined;
		
		this._oWatermark = undefined;
		
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
	
	/**
	 * Checks if the AnalyticalBinding has totaled measures available.
	 * Used for rendering sum rows.
	 * 
	 * @public
	 * @returns {boolean} wether the binding has totaled measures or not
	 */
	AnalyticalTreeBindingAdapter.prototype.hasTotaledMeasures = function() {
		var bHasMeasures = false;
		jQuery.each(this.getMeasureDetails() || [], function(iIndex, oMeasure) {
			if (oMeasure.analyticalInfo.total) {
				bHasMeasures = true;
				return false;
			}
		});
		return bHasMeasures;
	};

	/**
	 * Returns if the Binding is grouped. This depends on the aggregation level.
	 * If the aggregation level is 0, the binding essentially holds a list.
	 */
	AnalyticalTreeBindingAdapter.prototype.isGrouped = function () {
		return (this.aAggregationLevel.length > 0);
	};
	
	/**
	 * Returns if the binding is in auto expand mode. Used to branch paging behavior. 
	 */
	AnalyticalTreeBindingAdapter.prototype._isRunningInAutoExpand = function (sAutoExpandMode) {
		if (this.getNumberOfExpandedLevels() > 0 && this._autoExpandMode === sAutoExpandMode) {
			return true;
		} else {
			return false;
		}
	};
	
	/**
	 * Sets the number of expanded levels on the TreeBinding (commonly an AnalyticalBinding).
	 * This is NOT the same as AnalyticalTreeBindingAdapter#collapse or AnalyticalTreeBindingAdapter#expand.
	 * Setting the number of expanded levels leads to different requests.
	 * This function is used by the AnalyticalTable for the ungroup/ungroup-all feature.
	 * @see sap.ui.table.AnalyticalTable#_getGroupHeaderMenu
	 * @param {int} iLevels the number of levels which should be expanded, minimum is 0
	 * @protected
	 * @name sap.ui.model.analytics.AnalyticalTreeBindingAdapter#setNumberOfExpandedLevels
	 * @function
	 */
	AnalyticalTreeBindingAdapter.prototype.setNumberOfExpandedLevels = function(iLevels, bSupressResetData) {
		iLevels = iLevels || 0;
		if (iLevels < 0) {
			jQuery.sap.log.warning("AnalyticalTreeBindingAdapter: numberOfExpanded levels was set to 0. Negative values are prohibited.");
			iLevels = 0;
		}
		
		if (!bSupressResetData) {
			this.resetData();
		}
		
		// set the numberOfExpandedLevels on the binding directly
		// this.mParameters is inherited from the Binding super class
		this.mParameters.numberOfExpandedLevels = iLevels;
	};
	
	/**
	 * Retrieves the currently set number of expanded levels from the Binding (commonly an AnalyticalBinding).
	 * @protected
	 * @name sap.ui.model.analytics.AnalyticalTreeBindingAdapter#getNumberOfExpandedLevels
	 * @function
	 * @returns {int} the number of expanded levels
	 */
	AnalyticalTreeBindingAdapter.prototype.getNumberOfExpandedLevels = function() {
		return this.mParameters.numberOfExpandedLevels;
	};
	
	return AnalyticalTreeBindingAdapter;
	
}, /* bExport= */ true);
