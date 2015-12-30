/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides the OData model implementation of a tree binding
sap.ui.define(['jquery.sap.global', 
               'sap/ui/model/TreeBinding', 
               'sap/ui/model/odata/CountMode',
               'sap/ui/model/ChangeReason',
               'sap/ui/model/Sorter',
               'sap/ui/model/odata/ODataUtils',
               'sap/ui/model/TreeBindingUtils',
               'sap/ui/model/odata/OperationMode',
               'sap/ui/model/SorterProcessor',
               'sap/ui/model/FilterProcessor'],
	function(jQuery, TreeBinding, CountMode, ChangeReason, Sorter, ODataUtils, TreeBindingUtils, OperationMode, SorterProcessor, FilterProcessor) {
	"use strict";


	/**
	 *
	 * @class
	 * Tree binding implementation for odata models.
	 * To use the v2.ODataTreeBinding with an odata service, which exposes hierarchy annotations, please
	 * consult the "SAP Annotations for OData Version 2.0" Specification.
	 * The necessary property annotations, as well as accepted/default values are documented in the specification.
	 * 
	 * In addition to these hieararchy annotations, the ODataTreeBinding also supports (cyclic) references between entities based on navigation properties.
	 * To do this you have to specify the binding parameter "navigation".
	 * The pattern for this is as follows: { entitySetName: "navigationPropertyName" }.
	 * Example: { 
	 *     "Employees": "toColleagues"
	 * }
	 * 
	 * In OperationMode.Server, the filtering on the ODataTreeBinding is only supported with initial filters. 
	 * However please be aware that this applies only to filters which do not obstruct the creation of a hierarchy.
	 * So filtering on a property (e.g. a "Customer") is fine, as long as the application can ensure, that the responses from the backend are enough
	 * to construct a tree hierarchy. Subsequent paging requests for sibiling and child nodes must also return responses since the filters will be sent with
	 * every request.
	 * Filtering with the filter() function is not supported for the OperationMode.Server.
	 * 
	 * With OperationMode.Client and OperationMode.Auto, the ODataTreeBinding also supports control filters.
	 * In these OperationModes, the filters and sorters will be applied clientside, same as for the v2.ODataListBinding.
	 * The OperationModes "Client" and "Auto" are only supported for trees which will be constructed based upon hierarchy annotations.
	 *
	 * @param {sap.ui.model.Model} oModel
	 * @param {string} sPath
	 * @param {sap.ui.model.Context} oContext
	 * @param {sap.ui.model.Filter[]} [aFilters] predefined filter/s (can be either a filter or an array of filters). All initial filters,
	 *                                           will be sent with every request. Filtering on the ODataTreeBinding is only supported with initial filters.
	 * @param {object} [mParameters] Parameter Object
	 * 
	 * @param {object} [mParameters.treeAnnotationProperties] This parameter defines the mapping between data properties and 
	 *                                                        the hierarchy used to visualize the tree, if not provided by the services metadata.
	 *                                                        For correct metadata annotation, please check the "SAP Annotations for OData Version 2.0" Specification. 
	 * @param {int} [mParameters.treeAnnotationProperties.hierarchyLevelFor] Mapping to the property holding the level information,
	 * @param {string} [mParameters.treeAnnotationProperties.hierarchyNodeFor] Mapping to the property holding the hierarchy node id,
	 * @param {string} [mParameters.treeAnnotationProperties.hierarchyParentNodeFor] Mapping to the property holding the parent node id,
	 * @param {string} [mParameters.treeAnnotationProperties.hierarchyDrillStateFor] Mapping to the property holding the drill state for the node,
	 * @param {object} [mParameters.navigation] An map describing the navigation properties between entity sets, which should be used for constructing and paging the tree.
	 * @param {int} [mParameters.numberOfExpandedLevels=0] This property defines the number of levels, which will be expanded initially.
	 *                                                   Please be aware, that this property leads to multiple backend requests. Default value is 0.
	 * @param {int} [mParameters.rootLevel=0] The root level is the level of the topmost tree nodes, which will be used as an entry point for OData services.
	 *                                        Conforming to the "SAP Annotations for OData Version 2.0" Specification, the root level must start at 0. 
	 *                                        Default value is thus 0.
	 * @param {string} [mParameters.batchGroupId] Deprecated - use groupId instead: sets the batch group id to be used for requests originating from this binding
	 * @param {string} [mParameters.groupId] sets the group id to be used for requests originating from this binding
	 * @param {sap.ui.model.Sorter[]} [aSorters] predefined sorter/s (can be either a sorter or an array of sorters)
	 * @param {int} [mParameters.threshold] a threshold, which will be used if the OperationMode is set to "Auto".
	 * 										In case of OperationMode.Auto, the binding tries to fetch (at least) as many entries as the threshold.
	 * 										Also see API documentation for {@link sap.ui.model.OperationMode.Auto}.
	 * 
	 * @public
	 * @alias sap.ui.model.odata.v2.ODataTreeBinding
	 * @extends sap.ui.model.TreeBinding
	 */
	var ODataTreeBinding = TreeBinding.extend("sap.ui.model.odata.v2.ODataTreeBinding", /** @lends sap.ui.model.odata.v2.ODataTreeBinding.prototype */ {
	
		constructor : function(oModel, sPath, oContext, aFilters, mParameters, aSorters){
			TreeBinding.apply(this, arguments);
			
			//make sure we have at least an empty parameter object
			this.mParameters = this.mParameters || mParameters || {};
			
			this.sGroupId;
			this.sRefreshGroupId;
			this.oFinalLengths = {};
			this.oLengths = {};
			this.oKeys = {};
			this.bNeedsUpdate = false;
			this._bRootMissing = false;
			
			this.aSorters = aSorters || [];
			this.sFilterParams = "";

			// a queue containing all parallel running requests
			// a request is identified by (node id, startindex, length)
			this.mRequestHandles = {};
			
			this.oRootContext = null;
			
			this.iNumberOfExpandedLevels = (mParameters && mParameters.numberOfExpandedLevels) || 0;
			this.iRootLevel =  (mParameters && mParameters.rootLevel) || 0;
			
			this.sCountMode = (mParameters && mParameters.countMode) || this.oModel.sDefaultCountMode;
			if (this.sCountMode == CountMode.None) {
				jQuery.log.fatal("To use an ODataTreeBinding at least one CountMode must be supported by the service!");
			}
			
			if (mParameters) {
				this.sBatchGroupId = mParameters.groupId || mParameters.batchGroupId;
			}
			
			this.bInitial = true;
			this._mLoadedSections = {};
			this._iPageSize = 0;
			
			// external operation mode
			this.sOperationMode = (mParameters && mParameters.operationMode) || this.oModel.sDefaultOperationMode;
			
			// internal operation mode switch, default is the same as "OperationMode.Server"
			this.bClientOperation = false;
			
			// the internal operation mode might change, the external operation mode (this.sOperationMode) will always be the original value
			switch (this.sOperationMode) {
				case OperationMode.Server: this.bClientOperation = false; break;
				case OperationMode.Client: this.bClientOperation = true; break;
				case OperationMode.Auto: this.bClientOperation = false; break; //initially start the same as the server mode
			}
			
			// the threshold for the OperationMode.Auto
			this.iThreshold = (mParameters && mParameters.threshold) || 0;
			
			// flag to check if the threshold was rejected after a count was issued
			this.bThresholdRejected = false;
			
			// the total collection count is the number of entries available in the backend (starting at the given rootLevel)
			this.iTotalCollectionCount = null;
			
			this.oAllKeys = null;
			this.oAllLengths = null;
			this.oAllFinalLengths = null;
		}
	
	});
	
	/**
	 * Drill-States for Hierarchy-Nodes
	 * 
	 * From the spec:
	 * A property holding the drill state of a hierarchy node includes this attribute. 
	 * The drill state is indicated by one of the following values: collapsed, expanded, leaf.
	 * The value of this attribute is always the name of another property in the same type. 
	 * It points to the related property holding the hierarchy node ID.
	 */
	ODataTreeBinding.DRILLSTATES = {
		Collapsed: "collapsed",
		Expanded: "expanded",
		Leaf: "leaf"
	};
	
	ODataTreeBinding.prototype._getNodeFilterParams = function (mParams) {
		var sPropName = mParams.isRoot ? this.oTreeProperties["hierarchy-node-for"] : this.oTreeProperties["hierarchy-parent-node-for"];
		var oEntityType = this._getEntityType();
		return ODataUtils._createFilterParams([new sap.ui.model.Filter(sPropName, "EQ", mParams.id)], this.oModel.oMetadata, oEntityType);
	};
	
	/**
	 * Retrieves the root node given through sNodeId
	 * @param {string} sNodeId the ID od the root node which should be loaded (e.g. when bound to a single entity)
	 * @param {string} sRequestKey a key string used to store/clean-up request handles
	 * @private
	 */
	ODataTreeBinding.prototype._loadSingleRootNodeByNavigationProperties = function (sNodeId, sRequestKey) {
		var that = this,
			sGroupId;
		
		if (this.mRequestHandles[sRequestKey]) {
			this.mRequestHandles[sRequestKey].abort();
		}
		sGroupId = this.sRefreshGroupId ? this.sRefreshGroupId : this.sGroupId;
		this.mRequestHandles[sRequestKey] = this.oModel.read(sNodeId, {
			groupId: sGroupId,
			success: function (oData) {
				var sNavPath = that._getNavPath(that.getPath());
				
				if (oData) {
					// we expect only one root node
					var oEntry = oData;
					var sKey =  that.oModel._getKey(oEntry);
					var oNewContext = that.oModel.getContext('/' + sKey);
					
					that.oRootContext = oNewContext;
					that._processODataObject(oNewContext.getObject(), sNodeId, sNavPath);
				} else {
					that._bRootMissing = true;
				}
				that.bNeedsUpdate = true;
				
				delete that.mRequestHandles[sRequestKey];
				
				that.fireDataReceived();
			},
			error: function (oError) {
				//Only perform error handling if the request was not aborted intentionally
				if (oError && oError.statusCode != 0 && oError.statusText != "abort") {
					that.bNeedsUpdate = true;
					that._bRootMissing = true;
					delete that.mRequestHandles[sRequestKey];
				
					that.fireDataReceived();
				}
			}
		});
	};
	
	/**
	 * Returns root contexts for the tree. You can specify the start index and the length for paging requests
	 * @param {integer} [iStartIndex=0] the start index of the requested contexts
	 * @param {integer} [iLength=v2.ODataModel.sizeLimit] the requested amount of contexts. If none given, the default value is the size limit of the underlying
	 *                                                 sap.ui.model.odata.v2.ODataModel instance.
	 * @param {integer} [iThreshold=0] the number of entities which should be retrieved in addition to the given length.
	 *                  A higher threshold reduces the number of backend requests, yet these request blow up in size, since more data is loaded.
	 * @return {sap.ui.model.Context[]} an array containing the contexts for the entities returned by the backend, might be fewer than requested 
	 *                                  if the backend does not have enough data.
	 * @public
	 */
	ODataTreeBinding.prototype.getRootContexts = function(iStartIndex, iLength, iThreshold) {
		
		var sNodeId = null,
			mRequestParameters = {
				numberOfExpandedLevels: this.iNumberOfExpandedLevels
			},
			aRootContexts = [];

		if (this.isInitial()) {
			return aRootContexts;
		}
		
		// make sure the input parameters are not undefined
		iStartIndex = iStartIndex || 0;
		iLength = iLength || this.oModel.sizeLimit;
		iThreshold = iThreshold || 0;
		
		// node ID for the root context(s) ~> null
		// startindex/length may differ due to paging
		// same node id + different paging sections are treated as different requests and will not abort each other
		var sRequestKey = "" + sNodeId + "-" + iStartIndex + "-" + this._iPageSize + "-" + iThreshold;
		
		if (this.bHasTreeAnnotations) {
			
			this.bDisplayRootNode = true;
			// load root level, node id is "null" in this case
			aRootContexts = this._getContextsForNodeId(null, iStartIndex, iLength, iThreshold);
			
		} else {
			sNodeId = this.oModel.resolve(this.getPath(), this.getContext());
			
			var bIsList = this.oModel.isList(this.sPath, this.getContext());
			if (bIsList) {
				this.bDisplayRootNode = true;
			}
			
			if (this.bDisplayRootNode && !bIsList) {
				if (this.oRootContext) {
					return [this.oRootContext];
				} else if (this._bRootMissing) {
					// the backend may not return anything for the given root node, so in this case our root node is missing
					return [];
				} else {
					this._loadSingleRootNodeByNavigationProperties(sNodeId, sRequestKey);
				}
			} else {
				mRequestParameters.navPath = this._getNavPath(this.getPath());
				
				//append nav path if binding path is not a collection and the root node should not be displayed
				if (!this.bDisplayRootNode) {
					sNodeId += "/" + mRequestParameters.navPath;
				}
				aRootContexts = this._getContextsForNodeId(sNodeId, iStartIndex, iLength, iThreshold, mRequestParameters);
			}
			
		}
		
		return aRootContexts;
	};
	
	/**
	 * Returns the contexts of the child nodes for the given context.
	 * 
	 * @param {sap.ui.model.Context} oContext the context for which the child nodes should be retrieved
	 * @param {integer} iStartIndex the start index of the requested contexts
	 * @param {integer} iLength the requested amount of contexts
	 * @param {integer} iThreshold
	 * @return {sap.ui.model.Context[]} the contexts array
	 * @public
	 */
	ODataTreeBinding.prototype.getNodeContexts = function(oContext, iStartIndex, iLength, iThreshold) {
		
		var sNodeId,
			mRequestParameters = {};
		
		if (this.isInitial()) {
			return [];
		}
		
		if (this.bHasTreeAnnotations) {
			// previously only the Hierarchy-ID-property from the data was used as key but not the actual OData-Key
			// now the actual key of the odata entry is used
			sNodeId = this.oModel.getKey(oContext); 
			mRequestParameters.level = parseInt(oContext.getProperty(this.oTreeProperties["hierarchy-level-for"]), 10) + 1;
		} else {
			var sNavPath = this._getNavPath(oContext.getPath());

			//If no nav path was found no nav property is defined and we cannot find any more data
			if (!sNavPath) {
				return [];
			}
		
			sNodeId = this.oModel.resolve(sNavPath, oContext);
			mRequestParameters.navPath = this.oNavigationPaths[sNavPath];
		}

		return this._getContextsForNodeId(sNodeId, iStartIndex, iLength, iThreshold, mRequestParameters);
	};
	
	/**
	 * Returns if the node has child nodes.
	 * If the ODataTreeBinding is running with hierarchy annotations, a context with the property values "expanded" or "collapsed"
	 * for the drilldown state property, returns true. Entities with drilldown state "leaf" return false.
	 *
	 * @param {sap.ui.model.Context} oContext the context element of the node
	 * @return {boolean} true if node has children
	 *
	 * @public
	 */
	ODataTreeBinding.prototype.hasChildren = function(oContext) {
		if (this.bHasTreeAnnotations) {
			if (!oContext) {
				return false;
			}
			var sDrilldownState = oContext.getProperty(this.oTreeProperties["hierarchy-drill-state-for"]);
			
			var sNodeKey = this.oModel.getKey(oContext);
			//var sHierarchyNode = oContext.getProperty(this.oTreeProperties["hierarchy-node-for"]);
			
			var iLength = this.oLengths[sNodeKey];
			
			// if the server returned no children for a node (even though it has a DrilldownState of "expanded"),
			// the length for this node is set to 0 and finalized -> no children available
			if (iLength === 0 && this.oFinalLengths[sNodeKey]) {
				return false;
			} 
			// leaves do not have childre, only "expanded" and "collapsed" nodes
			// Beware: the drilldownstate may be undefined/empty string, 
			//         in case the entity (oContext) has no value for the drilldown state property
			if (sDrilldownState === "expanded" || sDrilldownState === "collapsed") {
				return true;
			} else if (sDrilldownState === "leaf"){
				return false;
			} else {
				jQuery.sap.log.warning("The entity '" + oContext.getPath() + "' has not specified Drilldown State property value.");
				//fault tolerance for empty property values (we optimistically say that those nodes can be expanded/collapsed)
				if (sDrilldownState === undefined || sDrilldownState === "") {
					return true;
				}
				return false;
			}
		} else {
			if (!oContext) {
				return this.oLengths[this.getPath()] > 0;
			}
			var iLength = this.oLengths[oContext.getPath() + "/" + this._getNavPath(oContext.getPath())];
			
			//only return false if we definitely know that the length is 0, otherwise, we have either a known length or none at all (undefined)
			return iLength !== 0;
		}
	};
	
	/**
	 * Returns the number of child nodes
	 *
	 * @param {Object} oContext the context element of the node
	 * @return {integer} the number of children
	 *
	 * @public
	 */
	ODataTreeBinding.prototype.getChildCount = function(oContext) {
		if (this.bHasTreeAnnotations) {
			var vHierarchyNode;
			// only the root node should have no context 
			// the child count is either stored via the rootNodeId or (if only the rootLevel is given) as "null", because we do not know the root id
			if (!oContext) {
				vHierarchyNode = null;
			} else {
				vHierarchyNode = this.oModel.getKey(oContext);
			}
			return this.oLengths[vHierarchyNode];
		} else {
			if (!oContext) {
				// if no context was given, we retrieve the top-level child count:
				// 1. in case the binding path is a collection we need use the binding path as a key in the length map
				// 2. in case the binding path is a single entity, we need to add the navigation property from the "$expand" query option
				if (!this.bDisplayRootNode) {
					return this.oLengths[this.getPath() + "/" + this._getNavPath(this.getPath())];
				} else {
					return this.oLengths[this.getPath()];
				}
			}
			return this.oLengths[oContext.getPath() + "/" + this._getNavPath(oContext.getPath())];
		}
	};
	
	/**
	 * Gets or loads all contexts for a specified node id (dependent on mode)
	 *
	 * @param {String} sNodeId the value of the hierarchy node property on which a parent node filter will be performed
	 * @param {integer} iStartIndex start index of the page
	 * @param {integer} iLength length of the page
	 * @param {integer} iThreshold additionally loaded entities
	 * @param {object} mParameters additional request parameters
	 * 
	 * @return {sap.ui.model.Context[]} Array of contexts
	 *
	 * @private
	 */
	ODataTreeBinding.prototype._getContextsForNodeId = function(sNodeId, iStartIndex, iLength, iThreshold, mRequestParameters) {
		var aContexts = [],
			sKey;
		
		// OperationMode.Auto: handle synchronized count to check what the actual internal operation mode should be
		// If the $count or $inlinecount is used, is determined by the respective 
		if (this.sOperationMode == OperationMode.Auto) {
			// as long as we do not have a collection count, we return an empty array
			if (this.iTotalCollectionCount == null) {
				if (!this.bCollectionCountRequested) {
					this._getCountForCollection();
					this.bCollectionCountRequested = true;
				}
				return [];
			}
		}
		
		// Set default values if startindex, threshold or length are not defined
		iStartIndex = iStartIndex || 0;
		iLength = iLength || this.oModel.iSizeLimit;
		iThreshold = iThreshold || 0;
		
		// re-set the threshold in OperationMode.Auto
		// between binding-treshold and the threshold given as an argument, the bigger one will be taken
		if (this.sOperationMode == OperationMode.Auto) {
			if (this.iThreshold >= 0) {
				iThreshold = Math.max(this.iThreshold, iThreshold);
			}
		}

		if (!this._mLoadedSections[sNodeId]) {
			this._mLoadedSections[sNodeId] = [];
		}

		// make sure we only request the maximum length available (length is known and final)
		if (this.oFinalLengths[sNodeId] && this.oLengths[sNodeId] < iStartIndex + iLength) {
			iLength = Math.max(this.oLengths[sNodeId] - iStartIndex, 0);
		}

		var that = this;
		// check whether a start index was already requested
		var fnFindInLoadedSections = function(iStartIndex) {
			// check in the sections which where loaded
			for (var i = 0; i < that._mLoadedSections[sNodeId].length; i++) {
				var oSection = that._mLoadedSections[sNodeId][i];
				// try to find i in the loaded sections. If i is within one of the sections it needs not to be loaded again
				if (iStartIndex >= oSection.startIndex && iStartIndex < oSection.startIndex + oSection.length) {
					return true;
				}
			}

			// check requested sections where we still wait for an answer
		};

		var aMissingSections = [];
		// Loop through known data and check whether we already have all rows loaded
		// make sure to also check that the entities before the requested start index can be served
		var i = Math.max((iStartIndex - iThreshold - this._iPageSize), 0);
		if (this.oKeys[sNodeId]) {
			
			// restrict loop to the maximum available length if we have a $(inline)count
			// this will make sure we do not find "missing" sections at the end of the known datablock, if it is outside the $(inline)count
			var iMaxIndexToCheck = iStartIndex + iLength + (iThreshold);
			if (this.oLengths[sNodeId]) {
				iMaxIndexToCheck = Math.min(iMaxIndexToCheck, this.oLengths[sNodeId]);
			}
			
			for (i; i < iMaxIndexToCheck; i++) {
				sKey = this.oKeys[sNodeId][i];
				if (!sKey) {
					//only collect missing sections if we are running in the internal operationMode "Server" -> bClientOperation = false
					if (!this.bClientOperation && !fnFindInLoadedSections(i)) {
						aMissingSections = TreeBindingUtils.mergeSections(aMissingSections, {startIndex: i, length: 1});
					}
				}

				// collect requested contexts if loaded
				if (i >= iStartIndex && i < iStartIndex + iLength) {
					if (sKey) {
						aContexts.push(this.oModel.getContext('/' + sKey));
					} else {
						aContexts.push(undefined);
					}
				}
			}

			// check whether the missing section already spans the complete page. If this is the case, we don't need to request an additional page
			var iBegin = Math.max((iStartIndex - iThreshold - this._iPageSize), 0);
			var iEnd = iStartIndex + iLength + (iThreshold);
			var bExpandThreshold = aMissingSections[0] && aMissingSections[0].startIndex === iBegin && aMissingSections[0].startIndex + aMissingSections[0].length === iEnd;

			if (aMissingSections.length > 0 && !bExpandThreshold) {
				//first missing section will be prepended with additional threshold ("negative")
				i = Math.max((aMissingSections[0].startIndex - iThreshold - this._iPageSize), 0);
				var iFirstStartIndex = aMissingSections[0].startIndex;
				for (i; i < iFirstStartIndex; i++) {
					var sKey = this.oKeys[sNodeId][i];
					if (!sKey) {
						if (!fnFindInLoadedSections(i)) {
							aMissingSections = TreeBindingUtils.mergeSections(aMissingSections, {startIndex: i, length: 1});
						}
					}
				}

				//last missing section will be appended with additional threshold ("positive")
				i = aMissingSections[aMissingSections.length - 1].startIndex + aMissingSections[aMissingSections.length - 1].length;
				var iEndIndex = i + iThreshold + this._iPageSize;
				// if we already have a count -> clamp the end index
				if (this.oLengths[sNodeId]) {
					iEndIndex = Math.min(iEndIndex, this.oLengths[sNodeId]);
				}
				
				for (i; i < iEndIndex; i++) {
					var sKey = this.oKeys[sNodeId][i];
					if (!sKey) {
						if (!fnFindInLoadedSections(i)) {
							aMissingSections = TreeBindingUtils.mergeSections(aMissingSections, {startIndex: i, length: 1});
						}
					}
				}
			}
		} else {
			// for initial loading of a node use this shortcut.
			if (!fnFindInLoadedSections(iStartIndex)) {
				// "i" is our shifted forward startIndex for the "negative" thresholding
				// in this case i is always smaller than iStartIndex, but minimum is 0
				var iLengthShift = iStartIndex - i;
				aMissingSections = TreeBindingUtils.mergeSections(aMissingSections, {startIndex: i, length: iLength + iLengthShift + iThreshold});
			}
		}

		// check if metadata are already available
		if (this.oModel.getServiceMetadata()) {
			// If rows are missing send a request
			if (aMissingSections.length > 0) {
				var aParams = [];
				var sFilterParams = this.getFilterParams();
				if (this.bHasTreeAnnotations) {
					// application/control filter parameters, will be added to the node/level filter
					sFilterParams = sFilterParams ? "%20and%20" + sFilterParams : "";
					if (sNodeId) {
						//retrieve the correct context for the sNodeId (it's an OData-Key) and resolve the correct hierarchy node property as a filter value
						var oNodeContext = this.oModel.getContext("/" + sNodeId);
						var sNodeIdForFilter = oNodeContext.getProperty(this.oTreeProperties["hierarchy-node-for"]);
						aParams.push("$filter=" + jQuery.sap.encodeURL(this.oTreeProperties["hierarchy-parent-node-for"] + " eq '" + sNodeIdForFilter + "'") + sFilterParams);
					} else if (sNodeId == null) {
						// no root node id is given: sNodeId === null
						// in this case we use the root level
						
						// in case the binding runs in OperationMode Server -> the level filter is EQ by default,
						// for the Client OperationMode GT is used to fetch all nodes below the given level
						var sLevelFilterOperator = !this.bClientOperation ? " eq " : " ge ";
						aParams.push("$filter=" + jQuery.sap.encodeURL(this.oTreeProperties["hierarchy-level-for"] + sLevelFilterOperator + this.iRootLevel) + sFilterParams);
					}
				} else {
					// append application filters for navigation property case
					if (sFilterParams) {
						aParams.push("$filter=" + sFilterParams);
					}
				}
				
				if (this.sCustomParams) {
					aParams.push(this.sCustomParams);
				}
				
				if (!this.bClientOperation) {
					// request the missing sections and manage the loaded sections map
					for (i = 0; i < aMissingSections.length; i++) {
						var oRequestedSection = aMissingSections[i];
						this._mLoadedSections[sNodeId] = TreeBindingUtils.mergeSections(this._mLoadedSections[sNodeId], {startIndex: oRequestedSection.startIndex, length: oRequestedSection.length});
						this._loadSubNodes(sNodeId, oRequestedSection.startIndex, oRequestedSection.length, 0, aParams, mRequestParameters, oRequestedSection);
					}
				} else {
					// OperationMode is set to "Client" AND we have something missing (should only happen once, at the very first loading request)
					// of course also make sure no request is running already
					if (!this.oAllKeys && !this.mRequestHandles[ODataTreeBinding.REQUEST_KEY_CLIENT]) {
						this._loadCompleteTreeWithAnnotations(aParams);
					}
				}
				
			}
		}
	
		return aContexts;
	};
	
	/**
	 * Simple request to count how many nodes are available in the collection, starting at the given rootLevel.
	 * Depending on the countMode of the binding, either a $count or a $inlinecount is sent.
	 */
	ODataTreeBinding.prototype._getCountForCollection = function () {
		
		if (!this.bHasTreeAnnotations || this.sOperationMode != OperationMode.Auto) {
			jQuery.sap.log.error("The Count for the collection can only be retrieved with Hierarchy Annotations and in OperationMode.Auto.");
			return;
		}
		
		// create a request object for the data request
		var aParams = [];
		
		function _handleSuccess(oData) {
			
			// $inlinecount is in oData.__count, the $count is just oData
			var iCount = oData.__count ? parseInt(oData.__count, 10) : parseInt(oData, 10);

			this.iTotalCollectionCount = iCount;
			
			// in the OpertionMode.Auto, we check if the count is LE than the given threshold and set the client operation flag accordingly
			if (this.sOperationMode == OperationMode.Auto) {
				if (this.iTotalCollectionCount <= this.mParameters.threshold) {
					this.bClientOperation = true;
					this.bThresholdRejected = false;
				} else {
					this.bClientOperation = false;
					this.bThresholdRejected = true;
				}
				this._fireChange({reason: ChangeReason.Change});
			}
		}
	
		function _handleError(oError) {
			// Only perform error handling if the request was not aborted intentionally
			if (oError && oError.statusCode === 0 && oError.statusText === "abort") {
				return;
			}
			var sErrorMsg = "Request for $count failed: " + oError.message;
			if (oError.response){
				sErrorMsg += ", " + oError.response.statusCode + ", " + oError.response.statusText + ", " + oError.response.body;
			}
			jQuery.sap.log.warning(sErrorMsg);
		}
		
		var sPath = this.oModel.resolve(this.getPath(), this.getContext());
		
		// the only applied filter is on the rootLevel, everything else will be applied afterwards on the client
		var sNodeFilter = "$filter=" + jQuery.sap.encodeURL(this.oTreeProperties["hierarchy-level-for"] + " ge " + this.getRootLevel());
		aParams.push(sNodeFilter);
		
		// figure out how to request the count
		var sCountType = "";
		if (this.sCountMode == CountMode.Request || this.sCountMode == CountMode.Both) {
			sCountType = "/$count";
		} else if (this.sCountMode == CountMode.Inline) {
			aParams.push("$top=0");
			aParams.push("$inlinecount=allpages");
		}
		
		// send the counting request
		if (sPath) {
			this.oModel.read(sPath + sCountType, {
				urlParameters: aParams,
				success: _handleSuccess.bind(this),
				error: _handleError.bind(this),
				groupId: this.sRefreshGroupId ? this.sRefreshGroupId : this.sGroupId
			});
		}
	};
	
	/**
	 * Issues a $count request for the given node-id/odata-key.
	 * Only used when running in CountMode.Request. Inlinecounts are appended directly when issuing a loading request.
	 * @private
	 */
	ODataTreeBinding.prototype._getCountForNodeId = function(sNodeId, iStartIndex, iLength, iThreshold, mParameters) {
		var that = this,
			sGroupId;
		
		// create a request object for the data request
		var aParams = [];
		
		function _handleSuccess(oData) {
			that.oFinalLengths[sNodeId] = true;
			that.oLengths[sNodeId] = parseInt(oData, 10);
		}
	
		function _handleError(oError) {
			//Only perform error handling if the request was not aborted intentionally
			if (oError && oError.statusCode === 0 && oError.statusText === "abort") {
				return;
			}
			var sErrorMsg = "Request for $count failed: " + oError.message;
			if (oError.response){
				sErrorMsg += ", " + oError.response.statusCode + ", " + oError.response.statusText + ", " + oError.response.body;
			}
			jQuery.sap.log.warning(sErrorMsg);
		}
		
		var sPath;
		
		var sFilterParams = this.getFilterParams() || "";
		var sNodeFilter = "";
		if (this.bHasTreeAnnotations) {
			//resolve OData-Key to hierarchy node property value for filtering
			var oNodeContext = this.oModel.getContext("/" + sNodeId);
			var sHierarchyNodeId = oNodeContext.getProperty(this.oTreeProperties["hierarchy-node-for"]);
			
			sPath = this.oModel.resolve(this.getPath(), this.getContext());
			// only filter for the parent node if the given node is not the root (null)
			// if root and we $count the collection
			if (sNodeId != null) {
				sNodeFilter = this._getNodeFilterParams({id: sHierarchyNodeId});
			} else {
				sNodeFilter = jQuery.sap.encodeURL(this.oTreeProperties["hierarchy-level-for"] + " eq " + this.getRootLevel());
			}
			
		} else {
			sPath = sNodeId;
		}
		
		if (sNodeFilter || sFilterParams) {
			var sAnd = "";
			if (sNodeFilter && sFilterParams) {
				sAnd = "%20and%20";
			}
			
			sFilterParams = "$filter=" + sFilterParams + sAnd + sNodeFilter;
			aParams.push(sFilterParams);
		}
	
		// Only send request, if path is defined
		if (sPath) {
			sGroupId = this.sRefreshGroupId ? this.sRefreshGroupId : this.sGroupId;
			this.oModel.read(sPath + "/$count", {
				urlParameters: aParams,
				success: _handleSuccess,
				error: _handleError,
				sorters: this.aSorters,
				groupId: sGroupId
			});
		}
	};
	
	/**
	 * Triggers backend requests to load the child nodes of the node with the given sNodeId.
	 * 
	 * @param {String} sNodeId the value of the hierarchy node property on which a parent node filter will be performed
	 * @param {integer} iStartIndex start index of the page
	 * @param {integer} iLength length of the page
	 * @param {integer} iThreshold additionally loaded entities
	 * @param {array} aParams odata url parameters, already concatenated with "="
	 * @param {object} mParameters additional request parameters
	 * @param {object} mParameters.navPath the navigation path
	 * 
	 * @return {sap.ui.model.Context[]} Array of contexts
	 * 
	 * @private
	 */
	ODataTreeBinding.prototype._loadSubNodes = function(sNodeId, iStartIndex, iLength, iThreshold, aParams, mParameters, oRequestedSection) {
		var that = this,
			sGroupId,
			bInlineCountRequested = false;

		// Only append $skip/$top values if we run in OperationMode "Server".
		// When the OperationMode is set to "Client", we will fetch the whole collection
		if ((iStartIndex || iLength) && !this.bClientOperation) {
			aParams.push("$skip=" + iStartIndex + "&$top=" + (iLength + iThreshold));
		}
		
		//check if we already have a count
		if (!this.oFinalLengths[sNodeId]) {
			// issue $inlinecount
			if (this.sCountMode == CountMode.Inline || this.sCountMode == CountMode.Both) {
				aParams.push("$inlinecount=allpages");
				bInlineCountRequested = true;
			} else if (this.sCountMode == CountMode.Request) {
				//... or $count request
				that._getCountForNodeId(sNodeId);
			}
		}
		
		var sRequestKey = "" + sNodeId + "-" + iStartIndex + "-" + this._iPageSize + "-" + iThreshold;
		
		function fnSuccess(oData) {

			if (oData) {
				// make sure we have a keys array
				that.oKeys[sNodeId] = that.oKeys[sNodeId] || [];
				
				// evaluate the count
				if (bInlineCountRequested && oData.__count >= 0) {
					that.oLengths[sNodeId] = parseInt(oData.__count, 10);
					that.oFinalLengths[sNodeId] = true;
				}
			}
			
			// Collecting contexts
			// beware: oData.results can be an empty array -> so the length has to be checked
			if (jQuery.isArray(oData.results) && oData.results.length > 0) {

				// Case 1: Result is an entity set
				// Case 1a: Tree Annotations
				if (that.bHasTreeAnnotations) {
					var mLastNodeIdIndices = {};

					for (var i = 0; i < oData.results.length; i++) {
						var oEntry = oData.results[i];

						if (i == 0) {
							mLastNodeIdIndices[sNodeId] = iStartIndex;
						} else if (mLastNodeIdIndices[sNodeId] == undefined) {
							mLastNodeIdIndices[sNodeId] = 0;
						}
						
						that.oKeys[sNodeId][mLastNodeIdIndices[sNodeId]] = that.oModel._getKey(oEntry);
						mLastNodeIdIndices[sNodeId]++;
					}
				} else {
					// Case 1b: Navigation Properties
					for (var i = 0; i < oData.results.length; i++) {
						var oEntry = oData.results[i];
						var sKey = that.oModel._getKey(oEntry);
						that._processODataObject(oEntry, "/" + sKey, mParameters.navPath);
						that.oKeys[sNodeId][i + iStartIndex] = sKey;
					}
				}
			} else if (oData && !jQuery.isArray(oData.results)){
				// Case 2: oData.results is not an array, so oData is a single entity
				// this only happens if you bind to a single entity as root element)
				that.oKeys[null] = that.oModel._getKey(oData);
				if (!that.bHasTreeAnnotations) {
					that._processODataObject(oData, sNodeId, mParameters.navPath);
				}
			}
	
			that.oRequestHandle = null;
			delete that.mRequestHandles[sRequestKey];
			that.bNeedsUpdate = true;

			that.fireDataReceived();
		}
	
		function fnError(oError) {
			//Only perform error handling if the request was not aborted intentionally
			if (oError && oError.statusCode === 0 && oError.statusText === "abort") {
				return;
			}
			
			that.oRequestHandle = null;
			delete that.mRequestHandles[sRequestKey];
			that.fireDataReceived();

			if (oRequestedSection) {
				// remove section from loadedSections so the data can be requested again.
				// this might be required when e.g. when the service was not available for a short time
				var aLoadedSections = [];
				for (var i = 0; i < that._mLoadedSections[sNodeId].length; i++) {
					var oCurrentSection = that._mLoadedSections[sNodeId][i];
					if (oRequestedSection.startIndex >= oCurrentSection.startIndex && oRequestedSection.startIndex + oRequestedSection.length <= oCurrentSection.startIndex + oCurrentSection.length) {
						// remove the section interval and maintain adapted sections. If start index and length are the same, ignore the section
						if (oRequestedSection.startIndex !== oCurrentSection.startIndex && oRequestedSection.length !== oCurrentSection.length) {
							aLoadedSections = TreeBindingUtils.mergeSections(aLoadedSections, {startIndex: oCurrentSection.startIndex, length: oRequestedSection.startIndex - oCurrentSection.startIndex});
							aLoadedSections = TreeBindingUtils.mergeSections(aLoadedSections, {startIndex: oRequestedSection.startIndex + oRequestedSection.length, length: (oCurrentSection.startIndex + oCurrentSection.length) - (oRequestedSection.startIndex + oRequestedSection.length)});
						}
	
					} else {
						aLoadedSections.push(oCurrentSection);
					}
				}
				that._mLoadedSections[sNodeId] = aLoadedSections;
			}
		}
		
		// !== because we use "null" as sNodeId in case the user only provided a root level
		if (sNodeId !== undefined) {
			// execute the request and use the metadata if available
			this.fireDataRequested();
			var sAbsolutePath;
			if (this.bHasTreeAnnotations) {
				sAbsolutePath = this.oModel.resolve(this.getPath(), this.getContext());
			} else {
				sAbsolutePath = sNodeId;
			}
			
			if (this.mRequestHandles[sRequestKey]) {
				this.mRequestHandles[sRequestKey].abort();
			}
			sGroupId = this.sRefreshGroupId ? this.sRefreshGroupId : this.sGroupId;
			this.mRequestHandles[sRequestKey] = this.oModel.read(sAbsolutePath, {
				urlParameters: aParams,
				success: fnSuccess,
				error: fnError,
				sorters: this.aSorters,
				groupId: sGroupId
			});
		}
	};
	
	ODataTreeBinding.REQUEST_KEY_CLIENT = "_OPERATIONMODE_CLIENT_TREE_LOADING";
	
	/**
	 * Loads the complete collection from the given binding path.
	 * The tree is then reconstructed from the response entries based on the properties with hierarchy annotations.
	 * Adds additional URL parameters.
	 */
	ODataTreeBinding.prototype._loadCompleteTreeWithAnnotations = function (aURLParams) {
		var that = this;
		
		var sRequestKey = ODataTreeBinding.REQUEST_KEY_CLIENT;
		
		var fnSuccess = function (oData) {

			// all nodes on root level -> save in this.oKeys[null] = [] (?)
			if (oData.results && oData.results.length > 0) {
				
				//collect mapping table between parent node id and actual OData-Key
				var mParentIds = {};
				var oDataObj;
				for (var k = 0; k < oData.results.length; k++) {
					oDataObj = oData.results[k];
					var sDataKey = oDataObj[that.oTreeProperties["hierarchy-node-for"]];
					// sanity check: if we have duplicate keys, the data is messed up. Has already happend...
					if (mParentIds[sDataKey]) {
						jQuery.sap.log.warning("ODataTreeBinding - Duplicate data entry for key: " + sDataKey + "!");
					}
					mParentIds[sDataKey] = that.oModel._getKey(oDataObj);
				}
				
				// process data and built tree
				for (var i = 0; i < oData.results.length; i++) {
					oDataObj = oData.results[i];
					var sParentKey = oDataObj[that.oTreeProperties["hierarchy-parent-node-for"]];
					var sParentNodeID = mParentIds[sParentKey]; //oDataObj[that.oTreeProperties["hierarchy-parent-node-for"]];
					
					// the parentNodeID for root nodes (node level == iRootLevel) is "null"
					if (parseInt(oDataObj[that.oTreeProperties["hierarchy-level-for"]], 10) === that.iRootLevel) {
						sParentNodeID = "null";
					}
					
					// make sure the parent node is already present in the key map
					that.oKeys[sParentNodeID] = that.oKeys[sParentNodeID] || [];
					
					// add the current entry key to the key map, as a child of its parent node
					var sKey = that.oModel._getKey(oDataObj);
					that.oKeys[sParentNodeID].push(sKey);
					
					// update the length of the parent node
					that.oLengths[sParentNodeID] = that.oLengths[sParentNodeID] || 0;
					that.oLengths[sParentNodeID]++;
					that.oFinalLengths[sParentNodeID] = true;
					
					// keep up with the loaded sections
					that._mLoadedSections[sParentNodeID] = that._mLoadedSections[sParentNodeID] || [];
					that._mLoadedSections[sParentNodeID][0] = that._mLoadedSections[sParentNodeID][0] || {startIndex: 0, length: 0};
					that._mLoadedSections[sParentNodeID][0].length++;
				}
				
			} else {
				// no data received -> empty tree
				that.oKeys["null"] = [];
				that.oLengths["null"] = 0;
				that.oFinalLengths["null"] = true;
			}

			that.oAllKeys = jQuery.extend(true, {}, that.oKeys);
			that.oAllLengths = jQuery.extend(true, {}, that.oLengths);
			that.oAllFinalLengths = jQuery.extend(true, {}, that.oFinalLengths);
			
			delete that.mRequestHandles[sRequestKey];
			that.bNeedsUpdate = true;
			
			that.fireDataReceived();
		};
		
		var fnError = function (oError) {
			delete that.mRequestHandles[sRequestKey];
			
			// handle error state like the ListBinding -> reset data and trigger update
			var bAborted = oError.statusCode == 0;
			if (!bAborted) {
				that.oKeys = {};
				that.oLengths = {};
				that.oFinalLengths = {};
				that.oAllKeys = {};
				that.oAllLengths = {};
				that.oAllFinalLengths = {};
				that._fireChange({reason: ChangeReason.Change});
			}
			
			that.fireDataReceived();
		};
		
		// request the tree collection
		this.fireDataRequested();
		if (this.mRequestHandles[sRequestKey]) {
			this.mRequestHandles[sRequestKey].abort();
		}
		this.mRequestHandles[sRequestKey] = this.oModel.read(this.getPath(), {
			urlParameters: aURLParams,
			success: fnSuccess,
			error: fnError,
			sorters: this.aSorters
		});
	};
	
	/**
	 * Resets the current tree data and the lengths of the different nodes/groups. 
	 * 
	 * @param {object} oContext the context for which the lengths values should be resetted.
	 * 
	 * @private
	 */
	ODataTreeBinding.prototype.resetData = function(oContext, mParameters) {
		if (oContext) {
			//Only reset specific content
			var sPath = oContext.getPath();
	
			delete this.oKeys[sPath];
			delete this.oLengths[sPath];
			delete this.oFinalLengths[sPath];
			delete this._mLoadedSections[sPath];
		} else {
			this.oKeys = {};
			
			// the internal operation mode might change, the external operation mode (this.sOperationMode) will always be the original value
			// internal operation mode switch, default is the same as "OperationMode.Server"
			this.bClientOperation = false;
			
			// the internal operation mode might change, the external operation mode (this.sOperationMode) will always be the original value
			switch (this.sOperationMode) {
				case OperationMode.Server: this.bClientOperation = false; break;
				case OperationMode.Client: this.bClientOperation = true; break;
				case OperationMode.Auto: this.bClientOperation = false; break; //initially start the same as the server mode
			}
			// if no data is available after the reset we can't be sure the threshold is met or rejected
			this.bThresholdRejected = false;
			// the count might be wrong after a resetData, so we clear it
			this.iTotalCollectionCount = null;
			
			// objects used for client side filter/sort
			this.oAllKeys = null;
			this.oAllLengths = null;
			this.oAllFinalLengths = null;
			
			this.oLengths = {};
			this.oFinalLengths = {};
			this.oRootContext = null;
			this._bRootMissing = false;
			
			// abort running request and clear the map afterwards
			jQuery.each(this.mRequestHandles, function (sRequestKey, oRequestHandle) {
				if (oRequestHandle) {
					oRequestHandle.abort();
				}
			});
			this.mRequestHandles = {};
			
			this._mLoadedSections = {};
			this._iPageSize = 0;
			this.sFilterParams = "";
		}
	};
	
	/**
	 * Refreshes the binding, check whether the model data has been changed and fire change event
	 * if this is the case. For server side models this should refetch the data from the server.
	 * To update a control, even if no data has been changed, e.g. to reset a control after failed
	 * validation, please use the parameter bForceUpdate.
	 * 
	 * @param {boolean} [bForceUpdate] Update the bound control even if no data has been changed
	 * @param {string} [sGroupId] The  group Id for the refresh
	 * 
	 * @public
	 */
	ODataTreeBinding.prototype.refresh = function(bForceUpdate, sGroupId) {
		if (typeof bForceUpdate === "string") {
			sGroupId = bForceUpdate;
		}
		this.sRefreshGroup = sGroupId;
		this._refresh(bForceUpdate);
		this.sRefreshGroup = undefined;
	};
	
	/**
	 * Refreshes the binding, check whether the model data has been changed and fire change event
	 * if this is the case. For server side models this should refetch the data from the server.
	 * To update a control, even if no data has been changed, e.g. to reset a control after failed
	 * validation, please use the parameter bForceUpdate.
	 * 
	 * @param {boolean} [bForceUpdate] Update the bound control even if no data has been changed
	 * @param {object} [mChangedEntities]
	 * @param {string} [mEntityTypes]
	 * 
	 * @private
	 */
	ODataTreeBinding.prototype._refresh = function(bForceUpdate, mChangedEntities, mEntityTypes) {
		var bChangeDetected = false;
		if (!bForceUpdate) {
			if (mEntityTypes){
				var sResolvedPath = this.oModel.resolve(this.sPath, this.oContext);
				// remove url parameters if any to get correct path for entity type resolving
				if (sResolvedPath.indexOf("?") !== -1) {
					sResolvedPath = sResolvedPath.split("?")[0];
				}
				var oEntityType = this.oModel.oMetadata._getEntityTypeByPath(sResolvedPath);
				if (oEntityType && (oEntityType.entityType in mEntityTypes)) {
					bChangeDetected = true;
				}
			}
			if (mChangedEntities && !bChangeDetected) {
				jQuery.each(this.oKeys, function(i, aNodeKeys) {
					jQuery.each(aNodeKeys, function(i, sKey) {
						if (sKey in mChangedEntities) {
							bChangeDetected = true;
							return false;
						}
					});
					if (bChangeDetected) {
						return false;
					}
				});
			}
			if (!mChangedEntities && !mEntityTypes) { // default
				bChangeDetected = true;
			}
		}
		if (bForceUpdate || bChangeDetected) {
			this.resetData();
			this.bNeedsUpdate = false;
			this.bRefresh = true;
			this._fireRefresh({reason: ChangeReason.Refresh});
		}
	};
	
	/**
	 * Applying ControlFilters is not suported for OperationMode.Server.
	 * Since 1.34.0 the filtering is supported for OperationMode.Client and if the threshold for OperationMode.Auto could be satisfied.
	 * See also: {@link sap.ui.model.odata.OperationMode.Auto}.
	 * 
	 * Only initial ApplicationFilters, given as constructor arguments, are supported with the other possible OperationModes.
	 * Please see the constructor documentation for more information.
	 * 
	 * @param {sap.ui.model.Filter[]|sap.ui.model.Filter} aFilters
	 * @see sap.ui.model.TreeBinding.prototype.filter
	 * @return {sap.ui.model.odata.v2.ODataTreeBinding} returns <code>this</code> to facilitate method chaining
	 * @public
	 */
	ODataTreeBinding.prototype.filter = function(aFilters){
		
		if (this.bClientOperation) {
			
			if (!aFilters) {
				aFilters = [];
			}

			if (aFilters instanceof sap.ui.model.Filter) {
				aFilters = [aFilters];
			}

			this.aControlFilters = aFilters;
			
			this.oKeys = jQuery.extend(true, {}, this.oAllKeys);
			this.oLengths = jQuery.extend(true, {}, this.oAllLengths);
			this.oFinalLengths = jQuery.extend(true, {}, this.oAllFinalLengths);
			
			if (this.aControlFilters.length > 0) {
				this._applySort();
				this._applyFilter();
			}
			
			this._fireChange({reason: ChangeReason.Filter});
		} else {
			jQuery.sap.log.warning("Filtering is ONLY possible if the ODataTreeBinding is running in OperationMode.Client or " +
					"OperationMode.Auto, in case the given threshold is lower than the total number of tree nodes.");
		}
		
		return this;
	};
	
	/**
	 * Process the currently set filters clientside. Uses the FilterProcessor and only works if the binding is running
	 * in the OperationModes "Client" or "Auto".
	 */
	ODataTreeBinding.prototype._applyFilter = function () {
		var that = this;
		
		// filter function for recursive filtering,
		// checks if a single key matches the filters
		var fnFilterKey = function (sKey) {
			var aFiltered = FilterProcessor.apply([sKey], that.aControlFilters, function(vRef, sPath) {
				var oContext = that.oModel.getContext('/' + vRef);
				return that.oModel.getProperty(sPath, oContext);
			});
			return aFiltered.length > 0;
		};
		
		// filtered tree will be stored in oFilteredKeys
		var oFilteredKeys = {};
		this._filterRecursive({id: "null"}, oFilteredKeys, fnFilterKey);
		
		this.oKeys = oFilteredKeys;
		
		// set the lengths for the root node
		this.oLengths["null"] = this.oKeys["null"].length;
		this.oFinalLengths["null"] = true;
	};
	
	ODataTreeBinding.prototype._filterRecursive = function (oNode, mKeys, fnFilterKey) {
		var aChildrenKeys = this.oKeys[oNode.id];
		
		// node has children
		if (aChildrenKeys) {
			// loop over all children, and search for filter matches depth-first
			oNode.children = oNode.children || [];
			for (var i = 0; i < aChildrenKeys.length; i++) {
				var oChildNode = this._filterRecursive({
					id : aChildrenKeys[i]
				}, mKeys, fnFilterKey);

				if (oChildNode.isFiltered) {
					mKeys[oNode.id] = mKeys[oNode.id] || [];
					mKeys[oNode.id].push(oChildNode.id);

					oNode.children.push(oChildNode);
				}
			}

			// if node has children, then it should also be part of the filtered subset, since it is in the parent chain of a filter match
			if (oNode.children.length > 0) {
				oNode.isFiltered = true;
			} else {
				// if the node has no filter-matching children, it might still match the filter
				oNode.isFiltered = fnFilterKey(oNode.id);
			}
			
			// keep track of the group size and note the length as final if the node is part of the filtered subset
			if (oNode.isFiltered) {
				this.oLengths[oNode.id] = oNode.children.length;
				this.oFinalLengths[oNode.id] = true;
			}
			
			return oNode;
		} else {
			// node is leaf
			oNode.isFiltered = fnFilterKey(oNode.id);
			return oNode;
		}
		
	};
	
	/**
	 * Sorts the Tree according to the given Sorter(s).
	 * In OperationMode.Client or OperationMode.Auto (if the given threshold is satisfied), the sorters are applied locally on the client.
	 * 
	 * @param {sap.ui.model.Sorter[]|sap.ui.model.Sorter} aSorters the Sorter or an Array of sap.ui.model.Sorter instances
	 * @return {sap.ui.model.odata.v2.ODataTreeBinding} returns <code>this</code> to facilitate method chaining
	 * @public
	 */
	ODataTreeBinding.prototype.sort = function(aSorters, bReturnSuccess) {

		var bSuccess = false;

		if (aSorters instanceof Sorter) {
			aSorters = [aSorters];
		}

		this.aSorters = aSorters || [];

		if (!this.bInitial) {
			// abort running request, since new requests will be sent containing $orderby
			jQuery.each(this.mRequestHandles, function (sRequestKey, oRequestHandle) {
				if (oRequestHandle) {
					oRequestHandle.abort();
				}
			});
			
			if (!this.bClientOperation) {
				//server side sorting
				this.resetData(undefined, {reason: ChangeReason.Sort});
				this._fireRefresh({reason : ChangeReason.Sort});
				bSuccess = true;
			} else {
				//apply client side sorter
				this._applySort();
				this._fireChange({reason: ChangeReason.Sort});
			}
		}
		
		if (bReturnSuccess) {
			return bSuccess;
		} else {
			return this;
		}
	};
	
	/**
	 * Sorts the data which is currently available on the client.
	 * Only used when running in OperationMode.Client.
	 * @private
	 */
	ODataTreeBinding.prototype._applySort = function() {
		var that = this,
			oContext;
		
		// retrieves the sort value
		var fnGetValue = function(sKey, sPath) {
			oContext = that.oModel.getContext('/' + sKey);
			return that.oModel.getProperty(sPath, oContext);
		};
		
		// loop over all nodes and sort their children
		for (var sNodeID in this.oKeys) {
			SorterProcessor.apply(this.oKeys[sNodeID], this.aSorters, fnGetValue);
		}
	};
	
	/**
	 * Check whether this Binding would provide new values and in case it changed,
	 * inform interested parties about this.
	 * 
	 * @param {boolean} bForceUpdate
	 * 
	 * @private
	 */
	ODataTreeBinding.prototype.checkUpdate = function(bForceUpdate, mChangedEntities){
		var bChangeDetected = false;
		if (!bForceUpdate) {
			if (this.bNeedsUpdate || !mChangedEntities) {
				bChangeDetected = true;
			} else {
				jQuery.each(this.oKeys, function(i, aNodeKeys) {
					jQuery.each(aNodeKeys, function(i, sKey) {
						if (sKey in mChangedEntities) {
							bChangeDetected = true;
							return false;
						}
					});
					if (bChangeDetected) {
						return false;
					}
				});
			}
		}
		if (bForceUpdate || bChangeDetected) {
			this.bNeedsUpdate = false;
			this._fireChange();
		}
	};
	
	/**
	 * Splits the given path along the navigation properties.
	 * Only used when bound against a service, which describes the tree via navigation properties.
	 * 
	 * @param {string} sPath
	 * @private
	 */
	ODataTreeBinding.prototype._getNavPath = function(sPath) {
		//Check the last part of the path
		var sAbsolutePath = this.oModel.resolve(sPath, this.getContext());
		
		if (!sAbsolutePath) {
			return;
		}
		
		var aPathParts = sAbsolutePath.split("/"),
			sEntityName = aPathParts[aPathParts.length - 1],
			sNavPath;

		//Only if part contains "(" we are working on a specific entity with children
		var sCurrent = sEntityName.split("(")[0];
		if (sCurrent && this.oNavigationPaths[sCurrent]) {
			//Replace context with subitems context
			sNavPath = this.oNavigationPaths[sCurrent];
		}
		return sNavPath;
	};
	
	/**
	 * Processes the odata entries returned after a backend request.
	 * navigation property paths are split and stored internally.
	 * 
	 * @param {object} oObject the object which will be processed
	 * @param {string} sPath the binding path of the object
	 * @param {string} sNavPath the path through the data object along the navigation properties
	 * @private
	 */
	ODataTreeBinding.prototype._processODataObject = function(oObject, sPath, sNavPath) {
		var aNavPath = [],
			that = this;
		
		if (sNavPath && sNavPath.indexOf("/") > -1) {
			aNavPath = sNavPath.split("/");
			sNavPath = aNavPath[0];
			aNavPath.splice(0,1);
		}
	
		var oRef = this.oModel._getObject(sPath);
		if (jQuery.isArray(oRef)) {
			this.oKeys[sPath] = oRef;
			this.oLengths[sPath] = oRef.length;
			this.oFinalLengths[sPath] = true;
		} else if (oRef) {
			this.oLengths[sPath] = 1;
			this.oFinalLengths[sPath] = true;
		}
		
		if (sNavPath && oObject[sNavPath]) {
			if (jQuery.isArray(oRef)) {
				jQuery.each(oRef, function(iIndex, sRef) {
					var oObject = that.getModel().getData("/" + sRef);
					that._processODataObject(oObject, "/" + sRef + "/" + sNavPath, aNavPath.join("/"));
				});
			} else if (typeof oRef === "object") {
				that._processODataObject(oObject, sPath + "/" + sNavPath, aNavPath.join("/"));
			}
		}
	};

	/**
	 * Checks the metadata for Hierarchy Tree Annotations.
	 * The property mapping describing the tree will be placed in "this.oTreeProperties".
	 * Also checks if clientside property mappings are given.
	 * 
	 * The extracted hierarchy informations will be stored in "this.oTreeProperties" (if any)
	 * 
	 * @private
	 */
	ODataTreeBinding.prototype._hasTreeAnnotations = function() {
		var oModel = this.oModel,
			oMetadata = oModel.oMetadata,
			sAbsolutePath = oModel.resolve(this.getPath(), this.getContext()),
			oEntityType,
			sTreeAnnotationNamespace = oMetadata.mNamespaces["sap"],
			that = this;

		//List of all annotations that are required for the OdataTreebinding to work
		this.oTreeProperties = {
			"hierarchy-level-for": false,
			"hierarchy-parent-node-for": false,
			"hierarchy-node-for": false,
			"hierarchy-drill-state-for": false
		};
		
		// Checks if no tree annotations are missing
		// true: everythings fine
		// false: we can't proceed
		var fnSanityCheckTreeAnnotations = function () {
			
			var iFoundAnnotations = 0;
			var iMaxAnnotationLength = 0;
			jQuery.each(that.oTreeProperties, function (sPropName, sPropValue) {
				iMaxAnnotationLength++;
				
				if (sPropValue) {
					iFoundAnnotations += 1;
				}
			});
			
			if (iFoundAnnotations === iMaxAnnotationLength){
				return true;
			} else if (iFoundAnnotations > 0 && iFoundAnnotations < iMaxAnnotationLength) {
				jQuery.sap.log.warning("Incomplete hierarchy tree annotations. Please check your service metadata definition!");
			}
			//if no annotations where found -> we are in the navigtion property mode
			return false;
		};
		
		// support for locally annotated tree hierarchy properties
		if (this.mParameters && this.mParameters.treeAnnotationProperties) {
			this.oTreeProperties["hierarchy-level-for"] = this.mParameters.treeAnnotationProperties.hierarchyLevelFor;
			this.oTreeProperties["hierarchy-parent-node-for"] = this.mParameters.treeAnnotationProperties.hierarchyParentNodeFor;
			this.oTreeProperties["hierarchy-node-for"] = this.mParameters.treeAnnotationProperties.hierarchyNodeFor;
			this.oTreeProperties["hierarchy-drill-state-for"] = this.mParameters.treeAnnotationProperties.hierarchyDrillStateFor;
			
			return fnSanityCheckTreeAnnotations();
		}
		
		// remove url parameters if any to get correct path for entity type resolving
		if (sAbsolutePath.indexOf("?") !== -1) {
			sAbsolutePath = sAbsolutePath.split("?")[0];
		}
		
		oEntityType = oMetadata._getEntityTypeByPath(sAbsolutePath);
		
		if (!oEntityType) {
			jQuery.sap.log.fatal("EntityType for path " + sAbsolutePath + " could not be found.");
			return false;
		}

		//Check if all required properties are available
		jQuery.each(oEntityType.property, function(iIndex, oProperty) {
			if (!oProperty.extensions) {
				return true;
			}
			jQuery.each(oProperty.extensions, function(iIndex, oExtension) {
				var sName = oExtension.name;
				if (oExtension.namespace === sTreeAnnotationNamespace &&
						sName in that.oTreeProperties &&
						!that.oTreeProperties[sName]) {
					that.oTreeProperties[sName] = oProperty.name;
				}
			});
		});

		return fnSanityCheckTreeAnnotations();
	};
	
	/**
	 * Initialize binding. Fires a change if data is already available ($expand) or a refresh.
	 * If metadata is not yet available, do nothing, method will be called again when
	 * metadata is loaded.
	 * 
	 * @returns {sap.ui.model.odata.v2.ODataTreeBinding} The binding instance
	 * @public
	 */
	ODataTreeBinding.prototype.initialize = function() {
		if (this.oModel.oMetadata && this.oModel.oMetadata.isLoaded() && this.bInitial) {
			this.bInitial = false;
			this.bHasTreeAnnotations = this._hasTreeAnnotations();
			this._processSelectParameters();
			this.oEntityType = this._getEntityType();
			this._fireRefresh({reason: ChangeReason.Refresh});
		}
		return this;
	};
	
	/**
	 * Internal function to evaluate the select parameters for the binding.
	 * @private
	 */
	ODataTreeBinding.prototype._processSelectParameters = function () {
		if (this.mParameters) {
			this.oNavigationPaths = this.mParameters.navigation;
			
			// put navigation params also to select params if there are select params
			if (this.mParameters.select) {
				//split all select params
				var aSelectParams = this.mParameters.select.split(",");
				var aNewSelectParams = [];
				
				if (this.oNavigationPaths) {
					jQuery.each(this.oNavigationPaths, function(sParamKey, sParamName){
						if (jQuery.inArray(sParamName, aNewSelectParams) == -1) {
							aNewSelectParams.push(sParamName);
						}
					});
				}
				
				// add new select params to custom select params
				jQuery.each(aNewSelectParams, function(sParamKey, sParamName){
					if (jQuery.inArray(sParamName, aSelectParams) == -1) {
						aSelectParams.push(sParamName);
					}
				});
				// add hierarchy annotation properties to select params if not there already
				if (this.bHasTreeAnnotations) {
					jQuery.each(this.oTreeProperties, function(sAnnotationName, sTreePropName){
						if (sTreePropName) {
							if (jQuery.inArray(sTreePropName, aSelectParams) == -1) {
								aSelectParams.push(sTreePropName);
							}
						}
					});
				}
				
				this.mParameters.select = aSelectParams.join(",");
			}
			
			this.sCustomParams = this.oModel.createCustomParams(this.mParameters);
		}
		
		//after parameter processing:
		//check if we have navigation parameters
		if (!this.bHasTreeAnnotations && !this.oNavigationPaths) {
			jQuery.sap.log.error("Neither navigation paths parameters, nor (complete/valid) tree hierarchy annotations where provided to the TreeBinding.");
			this.oNavigationPaths = {};
		}
	};
	
	/**
	 * Builds a download URL
	 * TODO: Make this public as soon as the download URL feature is implemented correctly
	 * @param {string} sFormat The format for the result data, when accessing the Download-URL
	 * 
	 * @private
	 */
	ODataTreeBinding.prototype.getDownloadUrl = function(sFormat) {
		var aParams = [],
			sPath;
		
		if (sFormat) {
			aParams.push("$format=" + encodeURIComponent(sFormat));
		}
		// sort and filter not supported yet
		if (this.aSorters && this.aSorters.length > 0) {
			aParams.push(ODataUtils.createSortParams(this.aSorters));
		}

		if (this.getFilterParams()) {
			aParams.push("$filter=" + this.getFilterParams());
		}
		//also includes the selct parameters
		//in hierarchy annotated trees, the mapping properties are mandatory
		if (this.sCustomParams) {
			aParams.push(this.sCustomParams);
		}
		
		sPath = this.oModel.resolve(this.sPath,this.oContext);

		if (sPath) {
			return this.oModel._createRequestUrl(sPath, null, aParams);
		}
	};
	
	/**
	 * Setting the number of expanded levels leads to different requests.
	 * This function is used by the TreeTable for the ungroup/ungroup-all feature.
	 * @see sap.ui.table.TreeTable#_getGroupHeaderMenu
	 * @param {int} iLevels the number of levels which should be expanded, minimum is 0
	 * @protected
	 * @name sap.ui.model.odata.ODataTreeBinding#setNumberOfExpandedLevels
	 * @function
	 */
	ODataTreeBinding.prototype.setNumberOfExpandedLevels = function(iLevels) {
		iLevels = iLevels || 0;
		if (iLevels < 0) {
			jQuery.sap.log.warning("ODataTreeBinding: numberOfExpandedLevels was set to 0. Negative values are prohibited.");
			iLevels = 0;
		}
		// set the numberOfExpandedLevels on the binding directly
		// this.mParameters is inherited from the Binding super class
		this.iNumberOfExpandedLevels = iLevels;
		this._fireChange();
	};
	
	/**
	 * Retrieves the currently set number of expanded levels from the Binding (commonly an ODataTreeBinding).
	 * @protected
	 * @name sap.ui.model.odata.ODataTreeBinding#getNumberOfExpandedLevels
	 * @function
	 * @returns {int} the number of expanded levels
	 */
	ODataTreeBinding.prototype.getNumberOfExpandedLevels = function() {
		return this.iNumberOfExpandedLevels;
	};
	
	/**
	 * Sets the rootLevel
	 * The root level is the level of the topmost tree nodes, which will be used as an entry point for OData services.
	 * This is only possible (and necessary) for OData services implementing the hierarchy annotation specification,
	 * or when providing the annotation information locally as a binding parameter. See the constructor for API documentation on this.
	 * @param {int} iRootLevel
	 * 
	 * @public
	 */
	ODataTreeBinding.prototype.setRootLevel = function(iRootLevel) {
		iRootLevel = parseInt(iRootLevel || 0, 10);
		if (iRootLevel < 0) {
			jQuery.sap.log.warning("ODataTreeBinding: rootLevels was set to 0. Negative values are prohibited.");
			iRootLevel = 0;
		}
		// set the rootLevel on the binding directly
		this.iRootLevel = iRootLevel;
		this.refresh();
	};

	/**
	 * Returns the rootLevel
	 * @returns {int}
	 * 
	 * @public
	 */
	ODataTreeBinding.prototype.getRootLevel = function() {
		return this.iRootLevel;
	};

	/**
	 * Retrieves the EntityType of the bindings path, resolved with the current context.
	 * @private
	 */
	ODataTreeBinding.prototype._getEntityType = function(){
		var sResolvedPath = this.oModel.resolve(this.sPath, this.oContext);

		if (sResolvedPath) {
			var oEntityType = this.oModel.oMetadata._getEntityTypeByPath(sResolvedPath);
			jQuery.sap.assert(oEntityType, "EntityType for path " + sResolvedPath + " could not be found!");
			return oEntityType;
		}

		return undefined;
	};

	/**
	 * Retrieves a string concatenation of the filter parameters given in "this.aFilters".
	 * Also sets the created filter-string to "this.sFilterParams".
	 * Filters will be ANDed and ORed by the ODataUtils. 
	 * @returns {string} the concatenated OData filters
	 */
	ODataTreeBinding.prototype.getFilterParams = function() {
		if (this.aFilters) {
			this.aFilters = jQuery.isArray(this.aFilters) ? this.aFilters : [this.aFilters];
			if (this.aFilters.length > 0 && !this.sFilterParams) {
				this.sFilterParams = ODataUtils._createFilterParams(this.aFilters, this.oModel.oMetadata, this.oEntityType);
				this.sFilterParams = this.sFilterParams ? this.sFilterParams : "";
			}
		} else {
			this.sFilterParams = "";
		}

		return this.sFilterParams;
	};

	return ODataTreeBinding;

});