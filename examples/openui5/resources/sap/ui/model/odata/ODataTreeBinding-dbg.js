/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides the OData model implementation of a tree binding
sap.ui.define(['jquery.sap.global', 'sap/ui/model/TreeBinding', './CountMode'],
	function(jQuery, TreeBinding, CountMode) {
	"use strict";


	/**
	 *
	 * @class
	 * Tree binding implementation for client models
	 *
	 * @param {sap.ui.model.Model} oModel
	 * @param {string} sPath
	 * @param {sap.ui.model.Context} oContext
	 * @param {array} [aFilters] predefined filter/s (can be either a filter or an array of filters)
	 * @param {object} [mParameters]
	 * 
	 * @deprecated please use the <code>sap.ui.model.odata.v2.ODataModel</code> for improved tree binding support (e.g. filtering which is not supported in V1).
	 * 
	 * @alias sap.ui.model.odata.ODataTreeBinding
	 * @extends sap.ui.model.TreeBinding
	 */
	var ODataTreeBinding = TreeBinding.extend("sap.ui.model.odata.ODataTreeBinding", /** @lends sap.ui.model.odata.ODataTreeBinding.prototype */ {
	
		constructor : function(oModel, sPath, oContext, aFilters, mParameters){
			TreeBinding.apply(this, arguments);
	
			this.bPendingRequest = false;
			this.oFinalLengths = {};
			this.oLengths = {};
			this.oKeys = {};
			this.bNeedsUpdate = false;
			this.bHasTreeAnnotations = this._hasTreeAnnotations();
			this.oRootContext = null;
			this.iNumberOfExpandedLevels = mParameters && mParameters.numberOfExpandedLevels;
			this.sCountMode = (mParameters && mParameters.countMode) || this.oModel.sDefaultCountMode;

			if (!this.bHasTreeAnnotations) {
				if (!mParameters || !mParameters.navigation) {
					jQuery.sap.log.error("A navigation paths parameter object has to be defined");
					this.oNavigationPaths = {};
				} else {
					this.oNavigationPaths = mParameters.navigation;
				}
			} else {
				jQuery.sap.log.warning("Tree hierarchy annotations are deprecated and may not work correctly with the sap.ui.model.odata.ODataModel." +
						" Please use the sap.ui.model.odata.v2.ODataModel (since version 1.28) instead which fully supports hierarchy annotations.");
			}
		}
	
	});
	
	/**
	 * Return root contexts for the tree
	 * @param {integer} iStartIndex the start index of the requested contexts
	 * @param {integer} iLength the requested amount of contexts
	 * @param {integer} iThreshold
	 * @return {Array} the contexts array
	 * @protected
	 */
	ODataTreeBinding.prototype.getRootContexts = function(iStartIndex, iLength, iThreshold) {
		var sNodeId = null,
			mRequestParameters = {
				numberOfExpandedLevels: this.iNumberOfExpandedLevels
			},
			aRootContexts = [],
			bRequestRootContexts = true,
			that = this;

		if (this.bHasTreeAnnotations) {
			mRequestParameters.level = 0;
			if (!this.bDisplayRootNode) {
				mRequestParameters.level = 1;
			}
		} else {
			sNodeId = this.oModel.resolve(this.getPath(), this.getContext());
			mRequestParameters.navPath = this._getNavPath(this.getPath());
			
			if (mRequestParameters.numberOfExpandedLevels > 0) {
				var sAbsPath = sNodeId;
				for (var i = 0; i < mRequestParameters.numberOfExpandedLevels;i++) {
					var sNewNavPath = this._getNavPath(sAbsPath);
					mRequestParameters.navPath += "/" + sNewNavPath;
					sAbsPath += "/" + sNewNavPath;
				}
			}

			var bIsList = this.oModel.isList(this.sPath, this.getContext());

			if (bIsList) {
				//We are bound to a collection which represents the first level
				this.bDisplayRootNode = true;
			} else {
				//We are bound to a single entity which represents the root context
				//Get the binding context for the root element, it is created if it doesn't exist yet
				bRequestRootContexts = false;
				this.oModel.createBindingContext(sNodeId, null, {expand: mRequestParameters.navPath }, function(oNewContext) {
					aRootContexts = [oNewContext];
					if (that.oRootContext !== oNewContext) {
						that.oRootContext = oNewContext;
						that._processODataObject(oNewContext.getObject(), sNodeId, mRequestParameters.navPath);
						that.bNeedsUpdate = true;
					}
				}, this.bRefresh);
				this.bRefresh = false;
			}
		}

		if (bRequestRootContexts) {
			//If the root node should not be displayed, we assume that there is only one root node
			if (!this.bDisplayRootNode) {
				aRootContexts = this._getContextsForNodeId(sNodeId, 0, 1, 0, mRequestParameters);
			} else {
				aRootContexts = this._getContextsForNodeId(sNodeId, iStartIndex, iLength, iThreshold, mRequestParameters);
			}
		}

		if (!this.bDisplayRootNode && aRootContexts.length > 0) {
			this.oRootContext = aRootContexts[0];
			aRootContexts = this.getNodeContexts(aRootContexts[0], iStartIndex, iLength, iThreshold);
		}

		return aRootContexts;
	};
	
	/**
	 * Return node contexts for the tree
	 * @param {integer} iStartIndex the start index of the requested contexts
	 * @param {integer} iLength the requested amount of contexts
	 * @param {integer} iThreshold
	 * @return {Array} the contexts array
	 * @protected
	 */
	ODataTreeBinding.prototype.getNodeContexts = function(oContext, iStartIndex, iLength, iThreshold) {
		var sNodeId,
			mRequestParameters = {};

		if (this.bHasTreeAnnotations) {
			var sDrilldownState = oContext.getProperty(this.oTreeProperties["hierarchy-drill-state-for"]);

			//If we have a leaf we cannot fetch any child nodes
			if (sDrilldownState == "leaf") {
				return [];
			}

			sNodeId = oContext.getProperty(this.oTreeProperties["hierarchy-node-for"]);
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
	 * Returns if the node has child nodes
	 *
	 * @param {Object} oContext the context element of the node
	 * @return {boolean} true if node has children
	 *
	 * @public
	 */
	ODataTreeBinding.prototype.hasChildren = function(oContext) {
		if (!oContext) {
			return false;
		}
		if (this.bHasTreeAnnotations) {
			var sDrilldownState = oContext.getProperty(this.oTreeProperties["hierarchy-drill-state-for"]);
			return sDrilldownState === "expanded" || sDrilldownState === "collapsed";
		} else {			
			var sNavPath = this._getNavPath(oContext.getPath());
			var sPathToChildren = oContext.getPath() + "/" + sNavPath;
			return sNavPath && this.oLengths[sPathToChildren] > 0;
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
			var vHierachyNode;
			if (!oContext) {
				if (this.oRootContext) {
					vHierachyNode = this.oRootContext.getProperty(this.oTreeProperties["hierarchy-node-for"]);
				} else {
					//Needs to be adapted if backend services by sFIn change
					vHierachyNode = "000000";
				}
			} else {
				vHierachyNode = oContext.getProperty(this.oTreeProperties["hierarchy-node-for"]);
			}
			return this.oLengths[vHierachyNode];
		} else {
			if (!oContext) {
				return this.oLengths[this.getPath()];
			}
			return this.oLengths[oContext.getPath() + "/" + this._getNavPath(oContext.getPath())];
		}
	};
	
	/**
	 * Gets or loads all contexts for a specified node id (dependent on mode)
	 *
	 * @param {String} sNodeId the absolute path to be loaded
	 * @param {integer} iStartIndex
	 * @param {integer} iLength
	 * @param {integer} iThreshold
	 * @param {object} mParameters
	 * @return {array} Array of contexts
	 *
	 * @private
	 */
	ODataTreeBinding.prototype._getContextsForNodeId = function(sNodeId, iStartIndex, iLength, iThreshold, mParameters) {
		var aContexts = [],
			bLoadContexts,
			sKey;
		
		// Set default values if startindex, threshold or length are not defined
		if (!iStartIndex) {
			iStartIndex = 0;
		}
		if (!iLength) {
			iLength = this.oModel.iSizeLimit;
		}
		if (!iThreshold) {
			iThreshold = 0;
		}
		
		if (this.bHasTreeAnnotations) {
			/*****************************/
			/***    FIX for sFIN    ******/
			if (sNodeId == null) {
				sNodeId = "000000";
			}
			if (mParameters.level == 0) {
				mParameters.level++;
			}
		}
	
		if (this.oFinalLengths[sNodeId] && this.oLengths[sNodeId] < iLength) {
			iLength = this.oLengths[sNodeId];
		}
	
		// Loop through known data and check whether we already have all rows loaded
		if (this.oKeys[sNodeId]) {
			for (var i = iStartIndex; i < iStartIndex + iLength; i++) {
				sKey = this.oKeys[sNodeId][i];
				if (!sKey) {
					break;
				}
				aContexts.push(this.oModel.getContext('/' + sKey));
			}
		}
	
		bLoadContexts = aContexts.length != iLength && !(this.oFinalLengths[sNodeId] && aContexts.length >= this.oLengths[sNodeId]);
	
		// check if metadata are already available
		if (this.oModel.getServiceMetadata()) {
			// If rows are missing send a request
			if (!this.bPendingRequest && bLoadContexts) {
				var aParams = [];
				if (this.bHasTreeAnnotations) {
					if (mParameters.numberOfExpandedLevels > 0) {
						var iLevel = mParameters.level + mParameters.numberOfExpandedLevels;
						aParams.push("$filter=" + this.oTreeProperties["hierarchy-level-for"] + " le '0" + iLevel + "'");
					} else {
						aParams.push("$filter=" + this.oTreeProperties["hierarchy-level-for"] + " eq '0" + mParameters.level + "' and " + this.oTreeProperties["hierarchy-parent-node-for"] + " eq '" + sNodeId + "'");
					}
				} else {
					if (mParameters.navPath) {
						aParams.push("$expand=" + mParameters.navPath);
					}
				}
				this._loadSubNodes(sNodeId, iStartIndex, iLength, iThreshold, aParams, mParameters);
			}
		}
	
		return aContexts;
	};
	
	ODataTreeBinding.prototype._getCountForNodeId = function(sNodeId, iStartIndex, iLength, iThreshold, mParameters) {
		var that = this;
		
		// create a request object for the data request
		var aParams = [];
		
		function _handleSuccess(oData) {
			that.oFinalLengths[sNodeId] = true;
			that.oLengths[sNodeId] = parseInt(oData, 10);
		}
	
		function _handleError(oError) {
			var sErrorMsg = "Request for $count failed: " + oError.message;
			if (oError.response) {
				sErrorMsg += ", " + oError.response.statusCode + ", " + oError.response.statusText + ", " + oError.response.body;
			}
			jQuery.sap.log.warning(sErrorMsg);
		}
		
		var sPath;
		if (this.bHasTreeAnnotations) {
			sPath = this.oModel.resolve(this.getPath(), this.getContext());
			aParams.push("$filter=" + this.oTreeProperties["hierarchy-parent-node-for"] + " eq '" + sNodeId + "'");
		} else {
			sPath = sNodeId;
		}
	
		// Only send request, if path is defined
		if (sPath) {
			var sUrl = this.oModel._createRequestUrl(sPath + "/$count", null, aParams);
			var oRequest = this.oModel._createRequest(sUrl, "GET", false);
			// count needs other accept header
			oRequest.headers["Accept"] = "text/plain, */*;q=0.5";
		
			// execute the request and use the metadata if available
			// (since $count requests are synchronous we skip the withCredentials here)
			this.oModel._request(oRequest, _handleSuccess, _handleError, undefined, undefined, this.oModel.getServiceMetadata());
		}
	};
	
	/**
	 * Load list data from the server
	 */
	ODataTreeBinding.prototype._loadSubNodes = function(sNodeId, iStartIndex, iLength, iThreshold, aParams, mParameters) {
		var that = this,
			bInlineCountRequested = false;

		if (iStartIndex || iLength) {
			aParams.push("$skip=" + iStartIndex + "&$top=" + iLength);
		}
		
		if (!that.bHasTreeAnnotations && !this.oFinalLengths[sNodeId] && (this.sCountMode == CountMode.Inline || this.sCountMode == CountMode.Both)) {
			aParams.push("$inlinecount=allpages");
			bInlineCountRequested = true;
		}
		
		function fnSuccess(oData) {

			// Collecting contexts
			if (oData.results) {
				//Entity set
				if (!that.bHasTreeAnnotations) {
					// update length (only when the inline count was requested and is available)
					if (bInlineCountRequested && oData.__count) {
						that.oLengths[sNodeId] = parseInt(oData.__count, 10);
						that.oFinalLengths[sNodeId] = true;
					} else {
						if (that.oModel.isCountSupported()) {
							that._getCountForNodeId(sNodeId);
						}
					}
					
					that.oKeys[sNodeId] = [];
					for (var i = 0; i < oData.results.length; i++) {
						var oEntry = oData.results[i];
						var sKey = that.oModel._getKey(oEntry);
						that._processODataObject(oEntry, "/" + sKey, mParameters.navPath);
						that.oKeys[sNodeId][i + iStartIndex] = sKey;
					}
				} else {
					var mLastNodeIdIndices = {};
					
					for (var i = 0; i < oData.results.length; i++) {
						var oEntry = oData.results[i];

						sNodeId = oEntry[that.oTreeProperties["hierarchy-parent-node-for"]];
						
						if (i == 0) {
							mLastNodeIdIndices[sNodeId] = iStartIndex;
						} else if (mLastNodeIdIndices[sNodeId] == undefined) {
							mLastNodeIdIndices[sNodeId] = 0;
						}
						
						if (!(sNodeId in that.oKeys)) {
							that.oKeys[sNodeId] = [];
							that._getCountForNodeId(sNodeId);
						}

						that.oKeys[sNodeId][mLastNodeIdIndices[sNodeId]] = that.oModel._getKey(oEntry);
						mLastNodeIdIndices[sNodeId]++;
					}
				}
			} else {
				//Single entity (this only happens if you bind to a single entity as root element)
				that.oKeys[null] = that.oModel._getKey(oData);
				if (!that.bHasTreeAnnotations) {
					that._processODataObject(oData, sNodeId, mParameters.navPath);
				}
			}
	
			that.oRequestHandle = null;
			that.bPendingRequest = false;
			that.bNeedsUpdate = true;
		}
		
		function fnCompleted() {
			that.fireDataReceived();
		}
	
		function fnError(oData) {
			that.oRequestHandle = null;
			that.bPendingRequest = false;
			that.fireDataReceived();
		}
	
		function fnUpdateHandle(oHandle) {
			that.oRequestHandle = oHandle;
		}

		if (sNodeId) {
			if (!this.oFinalLengths[sNodeId]) {
				this.bPendingRequest = true;
				// execute the request and use the metadata if available
				this.fireDataRequested();
				var sAbsolutePath;
				if (this.bHasTreeAnnotations) {
					sAbsolutePath = this.oModel.resolve(this.getPath(), this.getContext());
				} else {
					sAbsolutePath = sNodeId;
				}
				this.oModel._loadData(sAbsolutePath, aParams, fnSuccess, fnError, false, fnUpdateHandle, fnCompleted);
			}
		}
	};
	
	/**
	 * Resets the current list data and length
	 * 
	 * @private
	 */
	ODataTreeBinding.prototype.resetData = function(oContext) {
		if (oContext) {
			//Only reset specific content
			var sPath = oContext.getPath();
	
			delete this.oKeys[sPath];
			delete this.oLengths[sPath];
			delete this.oFinalLengths[sPath];
		} else {
			this.oKeys = {};
			this.oLengths = {};
			this.oFinalLengths = {};
			this.oRootContext = null;
		}
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
	 * @public
	 */
	ODataTreeBinding.prototype.refresh = function(bForceUpdate, mChangedEntities, mEntityTypes) {
		var bChangeDetected = false;
		if (!bForceUpdate) {
			if (mEntityTypes) {
				var sResolvedPath = this.oModel.resolve(this.sPath, this.oContext);
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
			this._fireChange();
		}
	};
	
	/**
	 * @param {sap.ui.model.Filter[]|sap.ui.model.Filter} aFilters
	 * @see sap.ui.model.TreeBinding.prototype.filter
	 * @public
	 */
	ODataTreeBinding.prototype.filter = function(aFilters){
		jQuery.sap.log.warning("Filtering is currently not possible in the ODataTreeBinding");
		return this;
	};
	
	/**
	 * Check whether this Binding would provide new values and in case it changed,
	 * inform interested parties about this.
	 * 
	 * @param {boolean} bForceUpdate
	 * 
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

	ODataTreeBinding.prototype._hasTreeAnnotations = function() {
		var oModel = this.oModel,
			oMetadata = oModel.oMetadata,
			sAbsolutePath = oModel.resolve(this.getPath(), this.getContext()),
			oEntityType = oMetadata._getEntityTypeByPath(sAbsolutePath),
			sTreeAnnotationNamespace = oMetadata.mNamespaces["sap"],
			that = this;

		//List of all annotations that are required for the OdataTreebinding to work
		this.oTreeProperties = {
			"hierarchy-level-for": false,
			"hierarchy-parent-node-for": false,
			"hierarchy-node-for": false,
			"hierarchy-drill-state-for": false
		};

		if (!oEntityType) {
			jQuery.sap.log.fatal("EntityType for path " + sAbsolutePath + " could not be found.");
			return false;
		}

		//Check if all required proeprties are available
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

		var bMissing = false;
		jQuery.each(this.oTreeProperties, function(iIndex, oTreeProperty) {
			if (!oTreeProperty) {
				bMissing = true;
				return false;
			}
		});

		return !bMissing;
	};

	return ODataTreeBinding;

});
