/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
 
// Provides class sap.ui.model.odata.ODataAnnotations
sap.ui.define(['jquery.sap.global', 'sap/ui/model/TreeBinding', 'sap/ui/model/ClientTreeBinding', './TreeBindingAdapter', 'sap/ui/table/TreeAutoExpandMode', 'sap/ui/model/ChangeReason'],
	function(jQuery, TreeBinding, ClientTreeBinding, TreeBindingAdapter, TreeAutoExpandMode, ChangeReason) {
		"use strict";

		/**
		 * Adapter for TreeBindings to add the ListBinding functionality and use the
		 * tree structure in list based controls.
		 *
		 * @alias sap.ui.model.ClientTreeBindingAdapter
		 * @class
		 * @experimental This module is only for experimental use!
		 * @protected
		 */
		var ClientTreeBindingAdapter = function() {

			// ensure only TreeBindings are enhanced which have not been enhanced yet
			if (!(this instanceof TreeBinding && this.getContexts === undefined)) {
				return;
			}

			TreeBindingAdapter.apply(this);

			// apply the methods of the adapters prototype to the TreeBinding instance
			for (var fn in ClientTreeBindingAdapter.prototype) {
				if (ClientTreeBindingAdapter.prototype.hasOwnProperty(fn)) {
					this[fn] = ClientTreeBindingAdapter.prototype[fn];
				}
			}

			this._invalidTree = true;

			//set the default auto expand mode
			this.setNumberOfExpandedLevels(this.mParameters.numberOfExpandedLevels || 0);
		};

		ClientTreeBindingAdapter.prototype.setNumberOfExpandedLevels = function (iNumberOfExpandedLevels) {
			this._iNumberOfExpandedLevels = parseInt(iNumberOfExpandedLevels, 10);
		};

		ClientTreeBindingAdapter.prototype.getNumberOfExpandedLevels = function () {
			return this._iNumberOfExpandedLevels;
		};

		/**
		 * Returns true or false, depending on the child count of the given node.
		 * @param {Object} oNode Node instance to check whether it has children
		 * @returns {boolean} True if the node has children
		 */
		ClientTreeBindingAdapter.prototype.nodeHasChildren = function(oNode) {
			jQuery.sap.assert(oNode, "TreeBindingAdapter.nodeHasChildren: No node given!");

			//check if the node has children
			if (!oNode) {
				return false;
			} else if (oNode.isArtificial) {
				//our artificial root node ALWAYS has children
				return true;
			} else {
				return ClientTreeBinding.prototype.hasChildren.call(this, oNode.context);
			}
		};
		
		ClientTreeBindingAdapter.prototype.resetData = function(oContext, mParameters) {
			var vReturn = ClientTreeBinding.prototype.resetData.call(this, oContext, mParameters);

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

		/**
		 * Calculates a unique group ID for a given node
		 * @param {Object} oNode Node of which the group ID shall be calculated
		 * @returns {string} Group ID for oNode
		 * @override
		 */
		ClientTreeBindingAdapter.prototype._calculateGroupID = function (oNode) {
			var sBindingPath = this.getPath();
			var sGroupId;
			if (oNode.context) {
				var sContextPath = oNode.context.getPath();
				// only split the contextpath along the binding path, if it is not the top-level ("/"),
				// otherwise the "_" replace regex, will replace wrongly substitute the context-path
				if (sBindingPath != "/") {
					sGroupId = sContextPath.split(sBindingPath)[1];
				}
				if (!sGroupId) {
					sGroupId = sContextPath;
				}

				// slashes are used to separate levels. As in the data model not every path-part represents a level,
				// the remaining slashes must be replaced by some other character. "_" is used
				if (jQuery.sap.startsWith(sGroupId,"/")) {
					sGroupId = sGroupId.substring(1, sGroupId.length);
				}
				sGroupId = oNode.parent.groupID + sGroupId.replace(/\//g, "_") + "/";

			} else if (oNode.context === null) {
				// only the root node should have null as context
				sGroupId = "/";
			}

			return sGroupId;
		};

		/**
		 * Builds the tree from start index with the specified number of nodes
		 * @param {int} iStartIndex Index from which the tree shall be built
		 * @param {int} iLength Number of Nodes
		 * @override
		 */
		ClientTreeBindingAdapter.prototype._buildTree = function(iStartIndex, iLength) {
			if (this._invalidTree) {
				iStartIndex = iStartIndex || 0;
				iLength = iLength || this.getRootContexts().length;
				this._invalidTree = false;
				TreeBindingAdapter.prototype._buildTree.call(this, iStartIndex, iLength);
			}
		};

		ClientTreeBindingAdapter.prototype.getLength = function() {
			this._buildTree();
			return TreeBindingAdapter.prototype.getLength.apply(this, arguments);
		};

		ClientTreeBindingAdapter.prototype._fireChange = function() {
			this._invalidTree = true;
			this.constructor.prototype._fireChange.apply(this, arguments);
		};

		return ClientTreeBindingAdapter;

	}, /* bExport= */ true);
