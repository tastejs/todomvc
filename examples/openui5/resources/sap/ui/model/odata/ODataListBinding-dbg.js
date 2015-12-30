/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides class sap.ui.model.odata.ODataListBinding
sap.ui.define([
		'jquery.sap.global', 
		'sap/ui/model/ChangeReason', 'sap/ui/model/Filter', 'sap/ui/model/FilterType', 'sap/ui/model/ListBinding', 'sap/ui/model/Sorter', 
		'./ODataUtils', './CountMode'
	], function(jQuery, ChangeReason, Filter, FilterType, ListBinding, Sorter, ODataUtils, CountMode) {
	"use strict";
	
	/**
	 * @class
	 * List binding implementation for oData format
	 *
	 * @param {sap.ui.model.Model} oModel
	 * @param {string} sPath
	 * @param {sap.ui.model.Context} oContext
	 * @param {array} [aSorters] initial sort order (can be either a sorter or an array of sorters)
	 * @param {array} [aFilters] predefined filter/s (can be either a filter or an array of filters)
	 * @param {object} [mParameters]
	 * 
	 * @public
	 * @alias sap.ui.model.odata.ODataListBinding
	 * @extends sap.ui.model.ListBinding
	 */
	var ODataListBinding = ListBinding.extend("sap.ui.model.odata.ODataListBinding", /** @lends sap.ui.model.odata.ODataListBinding.prototype */ {
	
		constructor : function(oModel, sPath, oContext, aSorters, aFilters, mParameters) {
			ListBinding.apply(this, arguments);
			this.sFilterParams = null;
			this.sSortParams = null;
			this.sRangeParams = null;
			this.sCustomParams = this.oModel.createCustomParams(this.mParameters);
			this.iStartIndex = 0;
			this.bPendingChange = false;
			this.aKeys = [];
			this.bInitial = true;
			this.sCountMode = (mParameters && mParameters.countMode) || this.oModel.sDefaultCountMode;
			this.bRefresh = false;
			this.bNeedsUpdate = false;
			this.bDataAvailable = false;
			this.bIgnoreSuspend = false;
			
			// load the entity type for the collection only once and not e.g. every time when filtering
			if (!this.oModel.getServiceMetadata()) {
				var that = this,
				fnCallback = function(oEvent) {
					that.bInitial = false;
					that._initSortersFilters();
					that.oModel.detachMetadataLoaded(fnCallback);
				};
				this.oModel.attachMetadataLoaded(this, fnCallback);
			} else {
				this.bInitial = false;
				this._initSortersFilters();
			}
	
			// if nested list is already available and no filters or sorters are set, 
			// use the data and don't send additional requests
			// TODO: what if nested list is not complete, because it was too large?
			var oRef = this.oModel._getObject(this.sPath, this.oContext);
			this.aExpandRefs = oRef;
			if (jQuery.isArray(oRef) && !aSorters && !aFilters) {
				this.aKeys = oRef;
				this.iLength = oRef.length;
				this.bLengthFinal = true;
				this.bDataAvailable = true;
			} else if (oRef === null && this.oModel.resolve(this.sPath, this.oContext)) { // means that expanded data has no data available e.g. for 0..n relations
				this.aKeys = [];
				this.iLength = 0;
				this.bLengthFinal = true;
				this.bDataAvailable = true;
			}	else {
				// call getLength when metadata is already loaded or don't do anything
				// if the the metadata gets loaded it will call a refresh on all bindings
				if (this.oModel.getServiceMetadata()) {
					this.resetData();
				}
			}
	
		}
	
	});
	
	/**
	 * Return contexts for the list
	 *
	 * @param {int} [iStartIndex=0] the start index of the requested contexts
	 * @param {int} [iLength] the requested amount of contexts
	 * @param {int} [iThreshold=0]
	 * @return {sap.ui.model.Context[]} the array of contexts for each row of the bound list
	 * @protected
	 */
	ODataListBinding.prototype.getContexts = function(iStartIndex, iLength, iThreshold) {
	
		if (this.bInitial) {
			return [];
		}
		
		this.iLastLength = iLength;
		this.iLastStartIndex = iStartIndex;
		this.iLastThreshold = iThreshold;
		
		//	Set default values if startindex, threshold or length are not defined
		if (!iStartIndex) {
			iStartIndex = 0;
		}
		if (!iLength) {
			iLength = this.oModel.iSizeLimit;
			if (this.bLengthFinal && this.iLength < iLength) {
				iLength = this.iLength;
			}
		}
		if (!iThreshold) {
			iThreshold = 0;
		}
	
		var bLoadContexts = true,
			aContexts = this._getContexts(iStartIndex, iLength),
			oContextData = {},
			oSection;
	
		oSection = this.calculateSection(iStartIndex, iLength, iThreshold, aContexts);
		bLoadContexts = aContexts.length != iLength && !(this.bLengthFinal && aContexts.length >= this.iLength - iStartIndex);
		
		// check if metadata are already available
		if (this.oModel.getServiceMetadata()) {
			// If rows are missing send a request
			if (!this.bPendingRequest && oSection.length > 0 && (bLoadContexts || iLength < oSection.length)) {
				this.loadData(oSection.startIndex, oSection.length);
				aContexts.dataRequested = true;
			}
		}
		
		if (this.bRefresh) {
			// if refreshing and length is 0, pretend a request to be fired to make a refresh with
			// with preceding $count request look like a request with $inlinecount=allpages
			if (this.bLengthFinal && this.iLength == 0) {
				this.loadData(oSection.startIndex, oSection.length, true);
				aContexts.dataRequested = true;
			}
			this.bRefresh = false;
		} else {
			// Do not create context data and diff in case of refresh, only if real data has been received
			// The current behaviour is wrong and makes diff detection useless for OData in case of refresh
			for (var i = 0; i < aContexts.length; i++) {
				oContextData[aContexts[i].getPath()] = aContexts[i].getObject();
			}
		
			if (this.bUseExtendedChangeDetection) {
				//Check diff
				if (this.aLastContexts && iStartIndex < this.iLastEndIndex) {
					var that = this;
					var aDiff = jQuery.sap.arrayDiff(this.aLastContexts, aContexts, function(oOldContext, oNewContext) {
						return jQuery.sap.equal(
								oOldContext && that.oLastContextData && that.oLastContextData[oOldContext.getPath()],
								oNewContext && oContextData && oContextData[oNewContext.getPath()]
							);
					}, true);
					aContexts.diff = aDiff;
				}
			}
		
			this.iLastEndIndex = iStartIndex + iLength;
			this.aLastContexts = aContexts.slice(0);
			this.oLastContextData = jQuery.sap.extend(true, {}, oContextData);
		}
		
		return aContexts;
	};

	ODataListBinding.prototype.getCurrentContexts = function() {
		return this.aLastContexts || [];
	};
	
	/**
	 * Return contexts for the list
	 *
	 * @param {int} [iStartIndex=0] the start index of the requested contexts
	 * @param {int} [iLength] the requested amount of contexts
	 *
	 * @return {Array} the contexts array
	 * @private
	 */
	ODataListBinding.prototype._getContexts = function(iStartIndex, iLength) {
		var aContexts = [],
			oContext,
			sKey;
		
		if (!iStartIndex) {
			iStartIndex = 0;
		}
		if (!iLength) {
			iLength = this.oModel.iSizeLimit;
			if (this.bLengthFinal && this.iLength < iLength) {
				iLength = this.iLength;
			}
		}
		
		//	Loop through known data and check whether we already have all rows loaded
		for (var i = iStartIndex; i < iStartIndex + iLength; i++) {
			sKey = this.aKeys[i];
			if (!sKey) {
				break;
			}
			oContext = this.oModel.getContext('/' + sKey);
			aContexts.push(oContext);
		}
	
		return aContexts;
	};
	
	/*
	 * @private
	 */
	ODataListBinding.prototype.calculateSection = function(iStartIndex, iLength, iThreshold, aContexts) {
		var iSectionLength,
			iSectionStartIndex,
			iPreloadedSubsequentIndex,
			iPreloadedPreviousIndex,
			iRemainingEntries,
			oSection = {},
			sKey;
	
		iSectionStartIndex = iStartIndex;
		iSectionLength = 0;
	
		// check which data exists before startindex; If all necessary data is loaded iPreloadedPreviousIndex stays undefined
		for (var i = iStartIndex; i >= Math.max(iStartIndex - iThreshold,0); i--) {
			sKey = this.aKeys[i];
			if (!sKey) {
				iPreloadedPreviousIndex = i + 1;
				break;
			}
		}
		// check which data is already loaded after startindex; If all necessary data is loaded iPreloadedSubsequentIndex stays undefined
		for (var j = iStartIndex + iLength; j < iStartIndex + iLength + iThreshold; j++) {
			sKey = this.aKeys[j];
			if (!sKey) {
				iPreloadedSubsequentIndex = j;
				break;
			}
		}
		
		// calculate previous remaining entries
		iRemainingEntries = iStartIndex - iPreloadedPreviousIndex;
		if (iPreloadedPreviousIndex && iStartIndex > iThreshold && iRemainingEntries < iThreshold) {
			if (aContexts.length != iLength) {
				iSectionStartIndex = iStartIndex - iThreshold;
			} else {
				iSectionStartIndex = iPreloadedPreviousIndex - iThreshold;
			}
			iSectionLength = iThreshold;
		}
		
		// prevent iSectionStartIndex to become negative
		iSectionStartIndex = Math.max(iSectionStartIndex, 0);
		
		// No negative preload needed; move startindex if we already have some data
		if (iSectionStartIndex == iStartIndex) {
			iSectionStartIndex += aContexts.length;
		}
		
		//read the rest of the requested data
		if (aContexts.length != iLength) {
			iSectionLength += iLength - aContexts.length;
		}
		
		//calculate subsequent remaining entries
		iRemainingEntries = iPreloadedSubsequentIndex - iStartIndex - iLength;
		
		if (iRemainingEntries == 0) {
			iSectionLength += iThreshold;
		}
		
		if (iPreloadedSubsequentIndex && iRemainingEntries < iThreshold && iRemainingEntries > 0) {
				//check if we need to load previous entries; If not we can move the startindex
				if (iSectionStartIndex > iStartIndex) {
					iSectionStartIndex = iPreloadedSubsequentIndex;
					iSectionLength += iThreshold;
				}
				
		}
		
		//check final length and adapt sectionLength if needed.
		if (this.bLengthFinal && this.iLength < (iSectionLength + iSectionStartIndex)) {
			iSectionLength = this.iLength - iSectionStartIndex;
		}
		
		oSection.startIndex = iSectionStartIndex;
		oSection.length = iSectionLength;
		
		return oSection;
	};
	
	/**
	 * Setter for context
	 * @param {Object} oContext the new context object
	 */
	ODataListBinding.prototype.setContext = function(oContext) {
		if (this.oContext != oContext) {
			this.oContext = oContext;
			if (this.isRelative()) {
				// get new entity type with new context and init filters now correctly
				this._initSortersFilters();
	
				if (!this.bInitial) {
					// if nested list is already available, use the data and don't send additional requests
					// TODO: what if nested list is not complete, because it was too large?
					var oRef = this.oModel._getObject(this.sPath, this.oContext);
					this.aExpandRefs = oRef;
					if (jQuery.isArray(oRef) && !this.aSorters.length > 0 && !this.aFilters.length > 0) {
						this.aKeys = oRef;
						this.iLength = oRef.length;
						this.bLengthFinal = true;
						this._fireChange();
					} else if (!this.oModel.resolve(this.sPath, this.oContext) || oRef === null){ 
						// if path does not resolve, or data is known to be null (e.g. expanded list)
						this.aKeys = [];
						this.iLength = 0;
						this.bLengthFinal = true;
						this._fireChange();
					} else {
						this.refresh();
					}
				}
			}
		}
	};
	
	/**
	 * Get a download URL with the specified format considering the
	 * sort/filter/custom parameters.
	 *
	 * @param {string} sFormat Value for the $format Parameter
	 * @return {string} URL which can be used for downloading
	 * @since 1.24
	 * @public
	 */
	ODataListBinding.prototype.getDownloadUrl = function(sFormat) {
		var aParams = [],
			sPath;
		
		if (sFormat) {
			aParams.push("$format=" + encodeURIComponent(sFormat));
		}
		if (this.sSortParams) {
			aParams.push(this.sSortParams);
		}
		if (this.sFilterParams) {
			aParams.push(this.sFilterParams);
		}
		if (this.sCustomParams) {
			aParams.push(this.sCustomParams);
		}
		
		sPath = this.oModel.resolve(this.sPath,this.oContext);

		if (sPath) {
			return this.oModel._createRequestUrl(sPath, null, aParams);
		}
	};
	
	/**
	 * Load list data from the server
	 */
	ODataListBinding.prototype.loadData = function(iStartIndex, iLength, bPretend) {
	
		var that = this,
			bInlineCountRequested = false;
	
		// create range parameters and store start index for sort/filter requests
		if (iStartIndex || iLength) {
			this.sRangeParams = "$skip=" + iStartIndex + "&$top=" + iLength;
			this.iStartIndex = iStartIndex;
		} else {
			iStartIndex = this.iStartIndex;
		}
	
		// create the request url
		var aParams = [];
		if (this.sRangeParams) {
			aParams.push(this.sRangeParams);
		}
		if (this.sSortParams) {
			aParams.push(this.sSortParams);
		}
		if (this.sFilterParams) {
			aParams.push(this.sFilterParams);
		}
		if (this.sCustomParams) {
			aParams.push(this.sCustomParams);
		}
		if (!this.bLengthFinal &&
			(this.sCountMode == CountMode.Inline ||
			this.sCountMode == CountMode.Both)) {
			aParams.push("$inlinecount=allpages");
			bInlineCountRequested = true;
		}
		
		function fnSuccess(oData) {
	
			// Collecting contexts
			jQuery.each(oData.results, function(i, entry) {
				that.aKeys[iStartIndex + i] = that.oModel._getKey(entry);
			});
	
			// update iLength (only when the inline count was requested and is available)
			if (bInlineCountRequested && oData.__count) {
				that.iLength = parseInt(oData.__count, 10);
				that.bLengthFinal = true;
			}
	
			// if we got data and the results + startindex is larger than the
			// length we just apply this value to the length and add the requested
			// length again to enable paging/scrolling
			if (that.iLength < iStartIndex + oData.results.length) {
				that.iLength = iStartIndex + oData.results.length;
				that.bLengthFinal = false;
			}
	
			// if less entries are returned than have been requested
			// set length accordingly
			if (oData.results.length < iLength || iLength === undefined) {
				that.iLength = iStartIndex + oData.results.length;
				that.bLengthFinal = true;
			}
	
			// check if there are any results at all...
			if (iStartIndex == 0 && oData.results.length == 0) {
				that.iLength = 0;
				that.bLengthFinal = true;
			}
			
			that.oRequestHandle = null;
			that.bPendingRequest = false;
			
			// If request is originating from this binding, change must be fired afterwards
			that.bNeedsUpdate = true;
			
			that.bIgnoreSuspend = true;
		}
		
		function fnCompleted(oData) {
			that.fireDataReceived({data: oData});
		}
		
		function fnError(oError, bAborted) {
			that.oRequestHandle = null;
			that.bPendingRequest = false;
			if (!bAborted) {
				// reset data and trigger update
				that.aKeys = [];
				that.iLength = 0;
				that.bLengthFinal = true;
				that.bDataAvailable = true;
				that._fireChange({reason: ChangeReason.Change});
			}
			that.fireDataReceived();
		}
		
		function fnUpdateHandle(oHandle) {
			that.oRequestHandle = oHandle;
		}
		
		var sPath = this.sPath,
			oContext = this.oContext;
			
		if (this.isRelative()) {
			sPath = this.oModel.resolve(sPath,oContext);
		}
		if (sPath) {
			if (bPretend) {
				// Pretend to send a request by firing the appropriate events
				var sUrl = this.oModel._createRequestUrl(sPath, null, aParams);
				this.fireDataRequested();
				this.oModel.fireRequestSent({url: sUrl, method: "GET", async: true});
				setTimeout(function() {
					// If request is originating from this binding, change must be fired afterwards
					that.bNeedsUpdate = true;
					that.checkUpdate();
					that.oModel.fireRequestCompleted({url: sUrl, method: "GET", async: true, success: true});
					that.fireDataReceived();
				}, 0);
			} else {
				// Execute the request and use the metadata if available
				this.bPendingRequest = true;
				this.fireDataRequested();
				this.oModel._loadData(sPath, aParams, fnSuccess, fnError, false, fnUpdateHandle, fnCompleted);
			}
		}
	
	};
	
	/**
	 * @see sap.ui.model.ListBinding.prototype.getLength
	 *
	 */
	ODataListBinding.prototype.getLength = function() {
		// If length is not final and larger than zero, add some additional length to enable 
		// scrolling/paging for controls that only do this if more items are available
		if (this.bLengthFinal || this.iLength == 0) {
			return this.iLength;
		} else {
			var iAdditionalLength = this.iLastThreshold || this.iLastLength || 10;
			return this.iLength + iAdditionalLength;
		}
	};

	/**
	 * @see sap.ui.model.ListBinding.prototype.isLengthFinal
	 *
	 */
	ODataListBinding.prototype.isLengthFinal = function() {
		return this.bLengthFinal;
	};

	/**
	 * Return the length of the list
	 *
	 * @return {number} the length
	 */
	ODataListBinding.prototype._getLength = function() {
	
		var that = this;
	
		// create a request object for the data request
		var aParams = [];
		if (this.sFilterParams) {
			aParams.push(this.sFilterParams);
		}
		
		// use only custom params for count and not expand,select params
		if (this.mParameters && this.mParameters.custom) {
			var oCust = { custom: {}};
			jQuery.each(this.mParameters.custom, function (sParam, oValue){
				oCust.custom[sParam] = oValue;
			});
			aParams.push(this.oModel.createCustomParams(oCust));
		}
		
		function _handleSuccess(oData) {
			that.iLength = parseInt(oData, 10);
			that.bLengthFinal = true;
		}
	
		function _handleError(oError) {
			var sErrorMsg = "Request for $count failed: " + oError.message;
			if (oError.response) {
				sErrorMsg += ", " + oError.response.statusCode + ", " + oError.response.statusText + ", " + oError.response.body;
			}
			jQuery.sap.log.warning(sErrorMsg);
		}
		
		// Use context and check for relative binding
		var sPath = this.oModel.resolve(this.sPath, this.oContext);
	
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
	 * Refreshes the binding, check whether the model data has been changed and fire change event
	 * if this is the case. For server side models this should refetch the data from the server.
	 * To update a control, even if no data has been changed, e.g. to reset a control after failed
	 * validation, please use the parameter bForceUpdate.
	 * 
	 * @param {boolean} [bForceUpdate] Update the bound control even if no data has been changed
	 * @public
	 */
	ODataListBinding.prototype.refresh = function(bForceUpdate, mChangedEntities, mEntityTypes) {
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
				jQuery.each(this.aKeys, function(i, sKey) {
					if (sKey in mChangedEntities) {
						bChangeDetected = true;
						return false;
					}
				});
			}
			if (!mChangedEntities && !mEntityTypes) { // default
				bChangeDetected = true;
			}
		}
		if (bForceUpdate || bChangeDetected) {
			this.abortPendingRequest();
			this.resetData();
			this._fireRefresh({reason: ChangeReason.Refresh});
		}
	};
	
	/**
	 * fireRefresh
	 */
	ODataListBinding.prototype._fireRefresh = function(mArguments) {
		 if (this.oModel.resolve(this.sPath, this.oContext)) {
			 this.bRefresh = true;
			 this.fireEvent("refresh", mArguments);
		 }
	};
	
	/**
	 * Initialize binding. Fires a change if data is already available ($expand) or a refresh.
	 * If metadata is not yet available, do nothing, method will be called again when
	 * metadata is loaded.
	 *  
	 * @public
	 */
	ODataListBinding.prototype.initialize = function() {
		if (this.oModel.oMetadata.isLoaded()) {
			if (this.bDataAvailable) {
				this._fireChange({reason: ChangeReason.Change});
			} else {
				this._fireRefresh({reason: ChangeReason.Refresh});
			}
		}
	};
	
	/**
	 * Check whether this Binding would provide new values and in case it changed,
	 * inform interested parties about this.
	 *
	 * @param {boolean} bForceUpdate
	 * @param {object} mChangedEntities
	 */
	ODataListBinding.prototype.checkUpdate = function(bForceUpdate, mChangedEntities) {
		var bChangeReason = this.sChangeReason ? this.sChangeReason : ChangeReason.Change,
			bChangeDetected = false,
			oLastData, oCurrentData,
			that = this,
			oRef,
			bRefChanged;
		
		if (this.bSuspended && !this.bIgnoreSuspend) {
			return;
		}
		
		if (!bForceUpdate && !this.bNeedsUpdate) {
			
			// check if data in listbinding contains data loaded via expand
			// if yes and there was a change detected we:
			// - set the new keys if there are no sortes/filters set
			// - trigger a refresh if there are sorters/filters set
			oRef = this.oModel._getObject(this.sPath, this.oContext);
			bRefChanged = jQuery.isArray(oRef) && !jQuery.sap.equal(oRef,this.aExpandRefs);
			this.aExpandRefs = oRef;
			if (bRefChanged) {
				if (this.aSorters.length > 0 || this.aFilters.length > 0) {
					this.refresh();
					return;
				} else {
					this.aKeys = oRef;
					this.iLength = oRef.length;
					this.bLengthFinal = true;
					bChangeDetected = true;
				}
			} else if (mChangedEntities) {
				jQuery.each(this.aKeys, function(i, sKey) {
					if (sKey in mChangedEntities) {
						bChangeDetected = true;
						return false;
					}
				});
			} else {
				bChangeDetected = true;
			}
			if (bChangeDetected && this.aLastContexts) {
				// Reset bChangeDetected and compare actual data of entries
				bChangeDetected = false;
				
				//Get contexts for visible area and compare with stored contexts
				var aContexts = this._getContexts(this.iLastStartIndex, this.iLastLength, this.iLastThreshold);
				if (this.aLastContexts.length != aContexts.length) {
					bChangeDetected = true;
				} else {
					jQuery.each(this.aLastContexts, function(iIndex, oContext) {
						oLastData = that.oLastContextData[oContext.getPath()];
						oCurrentData = aContexts[iIndex].getObject();
						// Compare whether last data is completely contained in current data 
						if (!jQuery.sap.equal(oLastData, oCurrentData, true)) {
							bChangeDetected = true;
							return false;
						}
					});
				}
			}
		}
		if (bForceUpdate || bChangeDetected || this.bNeedsUpdate) {
			this.bNeedsUpdate = false;
			this._fireChange({reason: bChangeReason});
		}
		this.sChangeReason = undefined;
		this.bIgnoreSuspend = false;
	};
	
	/**
	 * Resets the current list data and length
	 * 
	 * @private
	 */
	ODataListBinding.prototype.resetData = function() {
		this.aKeys = [];
		this.iLength = 0;
		this.bLengthFinal = false;
		this.sChangeReason = undefined;
		this.bDataAvailable = false;
		if (this.oModel.isCountSupported() &&
			(this.sCountMode == CountMode.Request ||
			this.sCountMode == CountMode.Both)) {
			this._getLength();
		}
	};
	
	/**
	 * Aborts the current pending request (if any)
	 * 
	 * This can be called if we are sure that the data from the current request is no longer relevant,
	 * e.g. when filtering/sorting is triggered or the context is changed.
	 * 
	 * @private
	 */
	ODataListBinding.prototype.abortPendingRequest = function() {
		if (this.oRequestHandle) {
			this.oRequestHandle.abort();
			this.oRequestHandle = null;
			this.bPendingRequest = false;
		}
	};
	
	/**
	 * Sorts the list.
	 *
	 * @param {sap.ui.model.Sorter|Array} aSorters the Sorter or an array of sorter objects object which define the sort order
	 * @return {sap.ui.model.ListBinding} returns <code>this</code> to facilitate method chaining 
	 * @public
	 */
	ODataListBinding.prototype.sort = function(aSorters, bReturnSuccess) {
		
		var bSuccess = false;
		
		if (aSorters instanceof Sorter) {
			aSorters = [aSorters];
		}

		this.aSorters = aSorters;
		this.createSortParams(aSorters);

		if (!this.bInitial) {
			// Only reset the keys, length usually doesn't change when sorting
			this.aKeys = [];
			this.abortPendingRequest();
			this.sChangeReason = ChangeReason.Sort;
			this._fireRefresh({reason : this.sChangeReason});
			// TODO remove this if the sort event gets removed which is now deprecated
			this._fireSort({sorter: aSorters});
			bSuccess = true;
		}
		if (bReturnSuccess) {
			return bSuccess;
		} else {
			return this;
		}
	};
	
	ODataListBinding.prototype.createSortParams = function(aSorters) {
		this.sSortParams = ODataUtils.createSortParams(aSorters);
	};
	
	/**
	 * 
	 * Filters the list.
	 * 
	 * When using sap.ui.model.Filter the filters are first grouped according to their binding path.
	 * All filters belonging to a group are ORed and after that the
	 * results of all groups are ANDed.
	 * Usually this means, all filters applied to a single table column
	 * are ORed, while filters on different table columns are ANDed.
	 * 
	 * @param {sap.ui.model.Filter[]|sap.ui.model.odata.Filter[]} aFilters Array of filter objects
	 * @param {sap.ui.model.FilterType} sFilterType Type of the filter which should be adjusted, if it is not given, the standard behaviour applies
	 * @return {sap.ui.model.ListBinding} returns <code>this</code> to facilitate method chaining 
	 * 
	 * @public
	 */
	ODataListBinding.prototype.filter = function(aFilters, sFilterType, bReturnSuccess) {
		
		var bSuccess = false;
		
		if (!aFilters) {
			aFilters = [];
		}
		
		if (aFilters instanceof Filter) {
			aFilters = [aFilters];
		}
	
		if (sFilterType == FilterType.Application) {
			this.aApplicationFilters = aFilters;
		} else {
			this.aFilters = aFilters;
		}
		
		if (!aFilters || !jQuery.isArray(aFilters) || aFilters.length == 0) {
			this.aFilters = [];
		}
		//if no application-filters are present, or they are not in array form/empty array, init the filters with []
		if (!this.aApplicationFilters || !jQuery.isArray(this.aApplicationFilters) || this.aApplicationFilters.length === 0) {
			this.aApplicationFilters = [];
		}
		
		//if we have some Application Filters, they will ANDed to the Control-Filters
		this.createFilterParams(this.aFilters, this.aApplicationFilters);
	
		if (!this.bInitial) {
			this.resetData();
			this.abortPendingRequest();
			this.sChangeReason = ChangeReason.Filter;
			this._fireRefresh({reason : this.sChangeReason});
			// TODO remove this if the filter event gets removed which is now deprecated
			if (sFilterType == FilterType.Application) {
				this._fireFilter({filters: this.aApplicationFilters});
			} else {
				this._fireFilter({filters: this.aFilters});
			}
			bSuccess = true;
		}
		
		if (bReturnSuccess) {
			return bSuccess;
		} else {
			return this;
		}
	};

	/**
	 * Creates a $filter query option string, which will be used
	 * as an URL part for OData-Requests. If an Array of Application Filters is given as the second
	 * Argument, the Control-Filters and Application-Filters are ANDed together.
	 * @param {sap.ui.model.Filter[]|sap.ui.model.odata.Filter[]} aControlFilters An Array of control filters
	 * @param {sap.ui.model.Filter[]|sap.ui.model.odata.Filter[]} [aApplicationFilters] An Array of application filters
	 * @private
	 */
	ODataListBinding.prototype.createFilterParams = function(aControlFilters, aApplicationFilters) {
		// create URL Parameters for the Control- and Application-Filters
		// either one or both may return undefined if the arrays given are wrong somehow
		var sFilterParams,
			sControlParams = ODataUtils._createFilterParams(aControlFilters, this.oModel.oMetadata, this.oEntityType),
			sApplicationParams = ODataUtils._createFilterParams(aApplicationFilters, this.oModel.oMetadata, this.oEntityType);
		
		if (sControlParams) {
			sFilterParams = sControlParams;
		}
		
		if (sApplicationParams) {
			//if there are control-filtes, AND the application filters
			if (sControlParams) {
				//Apply braces to the ANDed parts
				sFilterParams = "(" + sFilterParams + ")" + "%20and%20" + "(" + sApplicationParams + ")";
			} else {
				//if the control-filters are undefined, we just use the application filter as a fallback
				sFilterParams = sApplicationParams;
			}
		}
		
		//prepend the system query option "$filter=" to the parameters (if parameters are given...)
		if (sFilterParams) {
			this.sFilterParams = "$filter=" + sFilterParams;
		} else {
			// no filter params could be constructed, since no control/application filter are given
			// reset the filter params to 'undefined', so following requests exclude the filter query
			this.sFilterParams = undefined;
		}
	};
	
	
	ODataListBinding.prototype._initSortersFilters = function() {
		// if path could not be resolved entity type cannot be retrieved and
		// also filters/sorters don't need to be set
		var sResolvedPath = this.oModel.resolve(this.sPath, this.oContext);
		if (!sResolvedPath) {
			return;
		}
		this.oEntityType = this._getEntityType();
		this.createSortParams(this.aSorters);
		this.createFilterParams(this.aFilters.concat(this.aApplicationFilters));
	};
	
	ODataListBinding.prototype._getEntityType = function(){
		var sResolvedPath = this.oModel.resolve(this.sPath, this.oContext);
		
		if (sResolvedPath) {
			var oEntityType = this.oModel.oMetadata._getEntityTypeByPath(sResolvedPath);
			jQuery.sap.assert(oEntityType, "EntityType for path " + sResolvedPath + " could not be found!");
			return oEntityType;
			
		}
		return undefined;
	};
	
	ODataListBinding.prototype.resume = function() {
		this.bIgnoreSuspend = false;
		ListBinding.prototype.resume.apply(this, arguments);
	};
	
	return ODataListBinding;

});
