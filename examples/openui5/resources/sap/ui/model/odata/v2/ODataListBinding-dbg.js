/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

//Provides class sap.ui.model.odata.v2.ODataListBinding
sap.ui.define(['jquery.sap.global', 'sap/ui/model/FilterType', 'sap/ui/model/ListBinding', 'sap/ui/model/odata/ODataUtils', 'sap/ui/model/odata/CountMode', 'sap/ui/model/odata/Filter', 'sap/ui/model/odata/OperationMode', 'sap/ui/model/ChangeReason', 'sap/ui/model/Filter', 'sap/ui/model/FilterProcessor', 'sap/ui/model/Sorter', 'sap/ui/model/SorterProcessor'],
		function(jQuery, FilterType, ListBinding, ODataUtils, CountMode, ODataFilter, OperationMode, ChangeReason, Filter, FilterProcessor, Sorter, SorterProcessor) {
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
	 * @param {object} [mParameters] a map which contains additional parameters option for the binding
	 * @param {sap.ui.model.odata.CountMode} [mParameters.countMode] defines the count mode of this binding
	 * @param {sap.ui.model.odata.OperationMode} [mParameters.operationMode] defines the operation mode of this binding
	 * @param {boolean} [mParameters.faultTolerant] turns on the fault tolerance mode, data is not reset if a backend request returns an error
	 * @param {string} [mParameters.batchGroupId] sets the batch group id to be used for requests originating from this binding
	 * @param {int} [mParameters.threshold] a threshold which will be used if the OperationMode is set to "Auto".
	 * 										In case of OperationMode.Auto, the binding tries to fetch (at least) as many entries as the threshold.
	 * 										Also see API documentation for {@link sap.ui.model.OperationMode.Auto}.
	 *
	 * @public
	 * @alias sap.ui.model.odata.v2.ODataListBinding
	 * @extends sap.ui.model.ListBinding
	 */
	var ODataListBinding = ListBinding.extend("sap.ui.model.odata.v2.ODataListBinding", /** @lends sap.ui.model.odata.v2.ODataListBinding.prototype */ {

		constructor : function(oModel, sPath, oContext, aSorters, aFilters, mParameters) {
			ListBinding.apply(this, arguments);

			this.sFilterParams = null;
			this.sSortParams = null;
			this.sRangeParams = null;
			this.sCustomParams = this.oModel.createCustomParams(this.mParameters);
			this.iStartIndex = 0;
			this.iLength = 0;
			this.bPendingChange = false;
			this.aAllKeys = null;
			this.aKeys = [];
			this.sCountMode = (mParameters && mParameters.countMode) || this.oModel.sDefaultCountMode;
			this.sOperationMode = (mParameters && mParameters.operationMode) || this.oModel.sDefaultOperationMode;
			this.bRefresh = false;
			this.bNeedsUpdate = false;
			this.bDataAvailable = false;
			this.bIgnoreSuspend = false;
			this.sGroupId = undefined;
			this.sRefreshGroupId = undefined;
			this.bLengthRequested = false;
			this.bUseExtendedChangeDetection = true;
			this.bFaultTolerant = mParameters && mParameters.faultTolerant;
			this.bLengthFinal = false;
			this.iLastEndIndex = 0;
			this.aLastContexts = null;
			this.oLastContextData = null;
			this.bInitial = true;
			this.mRequestHandles = {};

			if (mParameters && (mParameters.batchGroupId || mParameters.groupId)) {
				this.sGroupId = mParameters.groupId || mParameters.batchGroupId;
			}
			
			this.iThreshold = (mParameters && mParameters.threshold) || 0;
			
			// the internal operation mode is defined by the OperationMode set by the application, and in case of
			// "Auto" several other indicators at runtime
			switch (this.sOperationMode) {
				default:
				case OperationMode.Server: this.bClientOperation = false; break;
				case OperationMode.Client: this.bClientOperation = true; break;
				case OperationMode.Auto: this.bClientOperation = false; break; //initially start with server mode
			}
			// flag to check if the threshold was rejected after a count was issued
			this.bThresholdRejected = false;
			if (this.sCountMode == CountMode.None) {
				// In CountMode.None, the threshold is implicitly rejected
				this.bThresholdRejected = true;
			}
			
			// if nested list is already available and no filters or sorters are set, use the data and don't send additional requests
			// $expand loads all associated entities, no paging parameters possible, so we can safely assume all data is available
			var oRef = this.oModel._getObject(this.sPath, this.oContext);
			this.aExpandRefs = oRef;
			// oRef needs to be an array, so that it is the list of expanded entries
			if (jQuery.isArray(oRef)) {
				this.aAllKeys = oRef;
				this.iLength = oRef.length;
				this.bLengthFinal = true;
				this.bDataAvailable = true;
				// since $expand loads all associated entries, we can directly switch to client operations
				this.bClientOperation = true;
				this.applyFilter();
				this.applySort();
			} else if (oRef === null && this.oModel.resolve(this.sPath, this.oContext)) { // means that expanded data has no data available e.g. for 0..n relations
				this.aKeys = [];
				this.iLength = 0;
				this.bLengthFinal = true;
				this.bDataAvailable = true;
			}	else {
				//initial reset
				this.resetData();
			}
		},

		metadata : {
			publicMethods : [
			                 "getLength"
			                 ]
		}

	});
	
	/**
	 * Return contexts for the list
	 * 

	 *
	 * @param {int} [iStartIndex] the start index of the requested contexts
	 * @param {int} [iLength] the requested amount of contexts
	 * @param {int} [iThreshold] The threshold value
	 * @return {sap.ui.model.Context[]} the array of contexts for each row of the bound list
	 * @protected
	 */
	ODataListBinding.prototype.getContexts = function(iStartIndex, iLength, iThreshold) {

		if (this.bInitial) {
			return [];
		}

		// OperationMode.Auto: handle synchronized count to check what the actual internal operation mode should be
		// but only when using CountMode.Request or Both.
		if (!this.bLengthFinal && this.sOperationMode == OperationMode.Auto && (this.sCountMode == CountMode.Request || this.sCountMode == CountMode.Both)) {
			if (!this.bLengthRequested) {
				this._getLength();
				this.bLengthRequested = true;
			}
			return [];
		}
		
		//get length
		if (!this.bLengthFinal && !this.bPendingRequest && !this.bLengthRequested) {
			this._getLength();
			this.bLengthRequested = true;
		}
		
		//this.bInitialized = true;
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
		
		// re-set the threshold in OperationMode.Auto
		// between binding-treshold and the threshold given as an argument, the bigger one will be taken
		if (this.sOperationMode == OperationMode.Auto) {
			if (this.iThreshold >= 0) {
				iThreshold = Math.max(this.iThreshold, iThreshold);
			}
		}

		var bLoadContexts = true,
		aContexts = this._getContexts(iStartIndex, iLength),
		oContextData = {},
		oSection;

		if (this.bClientOperation) {
			if (!this.aAllKeys && !this.bPendingRequest && this.oModel.getServiceMetadata()) {
				this.loadData();
				aContexts.dataRequested = true;
			}
		} else {
			oSection = this.calculateSection(iStartIndex, iLength, iThreshold, aContexts);
			bLoadContexts = aContexts.length !== iLength && !(this.bLengthFinal && aContexts.length >= this.iLength - iStartIndex);

			// check if metadata are already available
			if (this.oModel.getServiceMetadata()) {
				// If rows are missing send a request
				if (!this.bPendingRequest && oSection.length > 0 && (bLoadContexts || iLength < oSection.length)) {
					this.loadData(oSection.startIndex, oSection.length);
					aContexts.dataRequested = true;
				}
			}
		}

		if (this.bRefresh) {
			// if refreshing and length is 0, pretend a request to be fired to make a refresh with
			// with preceding $count request look like a request with $inlinecount=allpages
			if (this.bLengthFinal && this.iLength === 0) {
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

	/**
	 * @param {int} iStartIndex the start index of the requested contexts
	 * @param {int} iLength the requested amount of contexts
	 * @param {int} iThreshold The threshold value
	 * @param {array} aContexts Array of existing contexts
	 * @returns {object} oSection The section info object
	 * @private
	 */
	ODataListBinding.prototype.calculateSection = function(iStartIndex, iLength, iThreshold, aContexts) {
		//var bLoadNegativeEntries = false,
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
		for (var i = iStartIndex; i >= Math.max(iStartIndex - iThreshold, 0); i--) {
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
			if (aContexts.length !== iLength) {
				iSectionStartIndex = iStartIndex - iThreshold;
			} else {
				iSectionStartIndex = iPreloadedPreviousIndex - iThreshold;
			}
			iSectionLength = iThreshold;
		}

		// prevent iSectionStartIndex to become negative
		iSectionStartIndex = Math.max(iSectionStartIndex, 0);

		// No negative preload needed; move startindex if we already have some data
		if (iSectionStartIndex === iStartIndex) {
			iSectionStartIndex += aContexts.length;
		}

		//read the rest of the requested data
		if (aContexts.length !== iLength) {
			iSectionLength += iLength - aContexts.length;
		}

		//calculate subsequent remaining entries
		iRemainingEntries = iPreloadedSubsequentIndex - iStartIndex - iLength;

		if (iRemainingEntries === 0) {
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
		if (this.oContext !== oContext) {
			this.oContext = oContext;
			if (this.isRelative()) {
				// get new entity type with new context and init filters now correctly
				this._initSortersFilters();

				if (!this.bInitial){
					// if nested list is already available, use the data and don't send additional requests
					// $expand loads all associated entities, no paging parameters possible, so we can safely assume all data is available
					var oRef = this.oModel._getObject(this.sPath, this.oContext);
					this.aExpandRefs = oRef;
					// oRef needs to be an array, so that it is the list of expanded entries
					if (jQuery.isArray(oRef)) {
						this.aAllKeys = oRef;
						this.iLength = oRef.length;
						this.bLengthFinal = true;
						// since $expand loads all associated entries, we can directly switch to client operations
						this.bClientOperation = true;
						this.applyFilter();
						this.applySort();
						this._fireChange();
					} else if (!this.oModel.resolve(this.sPath, this.oContext) || oRef === null){
						// if path does not resolve, or data is known to be null (e.g. expanded list)
						this.aAllKeys = null;
						this.aKeys = [];
						this.iLength = 0;
						this.bLengthFinal = true;
						this._fireChange();
					} else {
						this._refresh();
					}
				}
			}
		}
	};

	/**
	 * Load data from model
	 *
	 * @param {int} iStartIndex The start index
	 * @param {int} iLength The count of data to be requested
	 * @param {boolean} bPretend Pretend
	 * Load list data from the server
	 * @private
	 */
	ODataListBinding.prototype.loadData = function(iStartIndex, iLength, bPretend) {

		var that = this,
		bInlineCountRequested = false,
		sUrl, sGuid = jQuery.sap.uid(),
		sGroupId;

		// create range parameters and store start index for sort/filter requests
		if (iStartIndex || iLength) {
			this.sRangeParams = "$skip=" + iStartIndex + "&$top=" + iLength;
			this.iStartIndex = iStartIndex;
		} else {
			iStartIndex = this.iStartIndex;
		}

		// create the request url
		// $skip/$top and are excluded for OperationMode.Client and Auto if the threshold was sufficient
		var aParams = [];
		if (this.sRangeParams && (this.sOperationMode != OperationMode.Auto || this.bThresholdRejected || !this.bLengthFinal)) {
			aParams.push(this.sRangeParams);
		}
		if (this.sSortParams) {
			aParams.push(this.sSortParams);
		}
		// When in OperationMode.Auto, the filters are excluded and applied clientside,
		// except when the threshold was rejected, and the binding will internally run in Server Mode (bClientOperation=false)
		if (this.sFilterParams && (this.sOperationMode != OperationMode.Auto || this.bThresholdRejected)) {
			aParams.push(this.sFilterParams);
		}
		if (this.sCustomParams) {
			aParams.push(this.sCustomParams);
		}
		if (this.sCountMode == CountMode.InlineRepeat ||
			!this.bLengthFinal &&
			(this.sCountMode === CountMode.Inline ||
			 this.sCountMode === CountMode.Both)) {
			aParams.push("$inlinecount=allpages");
			bInlineCountRequested = true;
		}

		function fnSuccess(oData) {

			// update iLength (only when the inline count was requested and is available)
			if (bInlineCountRequested && oData.__count) {
				that.iLength = parseInt(oData.__count, 10);
				if (that.sCountMode != CountMode.InlineRepeat) {
					that.bLengthFinal = true;
				}
				
				// in the OpertionMode.Auto, we check if the count is LE than the given threshold (which also was requested!)
				if (that.sOperationMode == OperationMode.Auto) {
					if (that.iLength <= that.mParameters.threshold) {
						//the requested data is enough to satisfy the threshold
						that.bClientOperation = true;
						that.bThresholdRejected = false;
					} else {
						that.bClientOperation = false;
						that.bThresholdRejected = true;
						
						//clean up successful request
						delete that.mRequestHandles[sGuid];
						that.bPendingRequest = false;
						
						// If request is originating from this binding, change must be fired afterwards
						that.bNeedsUpdate = true;
						that.bIgnoreSuspend = true;
						
						// return since we can't do anything here anymore,
						// we have to trigger the loading again, this time with application filters
						return;
					}
				}
			}

			// Collecting contexts, after the $inlinecount was evaluated, so we do not have to clear it again when
			// the Auto modes initial threshold <> count check failed.
			jQuery.each(oData.results, function(i, entry) {
				that.aKeys[iStartIndex + i] = that.oModel._getKey(entry);
			});
			
			// if we got data and the results + startindex is larger than the
			// length we just apply this value to the length
			if (that.iLength < iStartIndex + oData.results.length) {
				that.iLength = iStartIndex + oData.results.length;
				that.bLengthFinal = false;
			}

			// if less entries are returned than have been requested
			// set length accordingly
			if (!oData.__next && (oData.results.length < iLength || iLength === undefined)) {
				that.iLength = iStartIndex + oData.results.length;
				that.bLengthFinal = true;
			}

			// In fault tolerance mode, if an empty array and next link is returned,
			// finalize the length accordingly
			if (that.bFaultTolerant && oData.__next && oData.results.length == 0) {
				that.iLength = iStartIndex;
				that.bLengthFinal = true;
			}

			// check if there are any results at all...
			if (iStartIndex === 0 && oData.results.length === 0) {
				that.iLength = 0;
				that.bLengthFinal = true;
			}

			// For clientside sorting filtering store all keys separately and set length to final
			if (that.bClientOperation) {
				that.aAllKeys = that.aKeys.slice();
				that.applyFilter();
				that.applySort();
				that.iLength = that.aKeys.length;
				that.bLengthFinal = true;
			}

			delete that.mRequestHandles[sGuid];
			that.bPendingRequest = false;

			// If request is originating from this binding, change must be fired afterwards
			that.bNeedsUpdate = true;

			that.bIgnoreSuspend = true;

			//register datareceived call as  callAfterUpdate
			that.oModel.callAfterUpdate(function() {
				that.fireDataReceived({data: oData});
			});
		}

		function fnError(oError) {
			var bAborted = oError.statusCode == 0;
			delete that.mRequestHandles[sGuid];
			that.bPendingRequest = false;
			if (that.bFaultTolerant) {
				// In case of fault tolerance, don't reset data, but keep the already loaded
				// data and set the length to final to prevent further requests
				that.iLength = that.aKeys.length;
				that.bLengthFinal = true;
				that.bDataAvailable = true;
				
			} else if (!bAborted) {
				// reset data and trigger update
				that.aKeys = [];
				that.iLength = 0;
				that.bLengthFinal = true;
				that.bDataAvailable = true;
				that._fireChange({reason: ChangeReason.Change});
			}
			that.fireDataReceived();
		}

		var sPath = this.sPath,
		oContext = this.oContext;

		if (this.isRelative()) {
			sPath = this.oModel.resolve(sPath,oContext);
		}
		if (sPath) {
			if (bPretend) {
				// Pretend to send a request by firing the appropriate events
				sUrl = this.oModel._createRequestUrl(sPath, aParams);
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
				//if load is triggered by a refresh we have to check the refreshGroup
				sGroupId = this.sRefreshGroup ? this.sRefreshGroup : this.sGroupId;
				this.mRequestHandles[sGuid] = this.oModel.read(sPath, {groupId: sGroupId, urlParameters: aParams, success: fnSuccess, error: fnError});
			}
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
	 * Return the length of the list.
	 *
	 * In case the final length is unknown (e.g. when searching on a large dataset), this will
	 * return an estimated length.
	 *
	 * @return {number} the length
	 * @public
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
	 * Return the length of the list
	 *
	 * @private
	 */
	ODataListBinding.prototype._getLength = function() {
		var that = this;
		var sGroupId;
		
		if (this.sCountMode !== CountMode.Request && this.sCountMode !== CountMode.Both) {
			return;
		}

		// create a request object for the data request
		// In OperationMode.Auto we explicitly omitt the filters for the count,
		// filters will be applied afterwards on the client if count comes under the threshold
		var aParams = [];
		if (this.sFilterParams && this.sOperationMode != OperationMode.Auto) {
			aParams.push(this.sFilterParams);
		}

		// use only custom params for count and not expand,select params
		if (this.mParameters && this.mParameters.custom) {
			var oCust = { custom: {}};
			jQuery.each(this.mParameters.custom, function (sParam, oValue) {
				oCust.custom[sParam] = oValue;
			});
			aParams.push(this.oModel.createCustomParams(oCust));
		}

		function _handleSuccess(oData) {
			that.iLength = parseInt(oData, 10);
			that.bLengthFinal = true;
			that.bLengthRequested = true;
			delete that.mRequestHandles[sPath];
			
			// in the OpertionMode.Auto, we check if the count is LE than the given threshold and set the client operation flag accordingly
			if (that.sOperationMode == OperationMode.Auto) {
				if (that.iLength <= that.mParameters.threshold) {
					that.bClientOperation = true;
					that.bThresholdRejected = false;
				} else {
					that.bClientOperation = false;
					that.bThresholdRejected = true;
				}
				// fire change because of synchronized $count
				that._fireChange({reason: ChangeReason.Change});
			}
		}

		function _handleError(oError) {
			delete that.mRequestHandles[sPath];
			var sErrorMsg = "Request for $count failed: " + oError.message;
			if (oError.response){
				sErrorMsg += ", " + oError.response.statusCode + ", " + oError.response.statusText + ", " + oError.response.body;
			}
			jQuery.sap.log.warning(sErrorMsg);
		}

		// Use context and check for relative binding
		var sPath = this.oModel.resolve(this.sPath, this.oContext);

		// Only send request, if path is defined
		if (sPath) {
			// execute the request and use the metadata if available
			sPath = sPath + "/$count";
			//if load is triggered by a refresh we have to check the refreshGroup
			sGroupId = this.sRefreshGroup ? this.sRefreshGroup : this.sGroupId;
			this.mRequestHandles[sPath] = this.oModel.read(sPath,{withCredentials: this.oModel.bWithCredentials, groupId: sGroupId, urlParameters:aParams, success: _handleSuccess, error: _handleError});
		}
	};

	/**
	 * Refreshes the binding, check whether the model data has been changed and fire change event
	 * if this is the case. For server side models this should refetch the data from the server.
	 * To update a control, even if no data has been changed, e.g. to reset a control after failed
	 * validation, please use the parameter bForceUpdate.
	 *
	 * @param {boolean} [bForceUpdate] Update the bound control even if no data has been changed
	 * @param {string} [sGroupId] The group Id for the refresh
	 *
	 * @public
	 */
	ODataListBinding.prototype.refresh = function(bForceUpdate, sGroupId) {
		if (typeof bForceUpdate === "string") {
			sGroupId = bForceUpdate;
			bForceUpdate = false;
		}
		this.sRefreshGroup = sGroupId;
		this._refresh(bForceUpdate);
		this.sRefreshGroup = undefined;
	};
	
	/**
	 * @private
	 */
	ODataListBinding.prototype._refresh = function(bForceUpdate, mChangedEntities, mEntityTypes) {
		var bChangeDetected = false;

		if (!bForceUpdate) {
			if (mEntityTypes){
				var sResolvedPath = this.oModel.resolve(this.sPath, this.oContext);
				if (sResolvedPath) {
					var oEntityType = this.oModel.oMetadata._getEntityTypeByPath(sResolvedPath);
					if (oEntityType && (oEntityType.entityType in mEntityTypes)) {
						bChangeDetected = true;
					}
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
	 *
	 * @param {map} mParameters Map of event parameters
	 * @private
	 */
	ODataListBinding.prototype._fireRefresh = function(mParameters) {
		if (this.oModel.resolve(this.sPath, this.oContext)) {
			this.bRefresh = true;
			this.fireEvent("refresh", mParameters);
		}
	};

	/**
	 * Initialize binding. Fires a change if data is already available ($expand) or a refresh.
	 * If metadata is not yet available, do nothing, method will be called again when
	 * metadata is loaded.
	 *
	 * @returns {sap.ui.model.odata.OdataListBinding} oBinding The binding instance
	 * @public
	 */
	ODataListBinding.prototype.initialize = function() {
		if (this.oModel.oMetadata && this.oModel.oMetadata.isLoaded() && this.bInitial) {
			this.bInitial = false;
			this._initSortersFilters();
			if (this.bDataAvailable) {
				this._fireChange({reason: ChangeReason.Change});
			} else {
				this._fireRefresh({reason: ChangeReason.Refresh});
			}
		}
		return this;
	};

	/**
	 * Check whether this Binding would provide new values and in case it changed,
	 * inform interested parties about this.
	 *
	 * @param {boolean} bForceUpdate Force control update
	 * @param {object} mChangedEntities Map of changed entities
	 * @returns {boolean} bSuccess Success
	 * @private
	 */
	ODataListBinding.prototype.checkUpdate = function(bForceUpdate, mChangedEntities) {
		var bChangeReason = this.sChangeReason ? this.sChangeReason : ChangeReason.Change,
				bChangeDetected = false,
				oLastData, oCurrentData,
				that = this,
				oRef,
				bRefChanged;

		if (this.bSuspended && !this.bIgnoreSuspend) {
			return false;
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
					this._refresh();
					return false;
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
				if (this.aLastContexts.length !== aContexts.length) {
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
		this.aAllKeys = null;
		this.iLength = 0;
		this.bLengthFinal = false;
		this.sChangeReason = undefined;
		this.bDataAvailable = false;
		this.bLengthRequested = false;
		
		// reset the client operation flag based on the OperationMode
		switch (this.sOperationMode) {
			default:
			case OperationMode.Server: this.bClientOperation = false; break;
			case OperationMode.Client: this.bClientOperation = true; break;
			case OperationMode.Auto: this.bClientOperation = false; break;
		}
		
		this.bThresholdRejected = false;
		// In CountMode.None, the threshold is implicitly rejected
		if (this.sCountMode == CountMode.None) {
			this.bThresholdRejected = true;
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
		if (!jQuery.isEmptyObject(this.mRequestHandles)) {
			jQuery.each(this.mRequestHandles, function(sPath, oRequestHandle){
				oRequestHandle.abort();
			});
			this.mRequestHandles = {};
			this.bPendingRequest = false;
		}
	};

	/**
	 * Get download URL
	 * @param {string} sFormat The required format for the download
	 * @since 1.24
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

		if (!this.bClientOperation) {
			this.createSortParams(aSorters);
		}

		if (!this.bInitial) {
			if (this.bClientOperation) {
				// apply clientside sorters only if data is available
				if (this.aAllKeys) {
					this.applySort();
					this._fireChange({reason: ChangeReason.Sort});
				} else {
					this.sChangeReason = ChangeReason.Sort;
				}
			} else {
				// Only reset the keys, length usually doesn't change when sorting
				this.aKeys = [];
				this.abortPendingRequest();
				this.sChangeReason = ChangeReason.Sort;
				this._fireRefresh({reason : this.sChangeReason});
			}
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

	ODataListBinding.prototype.applySort = function() {
		var that = this,
			oContext;

		this.aKeys = SorterProcessor.apply(this.aKeys, this.aSorters, function(vRef, sPath) {
			oContext = that.oModel.getContext('/' + vRef);
			return that.oModel.getProperty(sPath, oContext);
		});
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

		if (sFilterType === FilterType.Application) {
			this.aApplicationFilters = aFilters;
		} else {
			this.aFilters = aFilters;
		}

		aFilters = this.aFilters.concat(this.aApplicationFilters);
		
		if (!aFilters || !jQuery.isArray(aFilters) || aFilters.length === 0) {
			this.aFilters = [];
			this.aApplicationFilters = [];
		}

		if (!this.bClientOperation) {
			this.createFilterParams(aFilters);
		}

		if (!this.bInitial) {
			
			if (this.bClientOperation) {
				// apply clientside filters/sorters only if data is available
				if (this.aAllKeys) {
					this.applyFilter();
					this.applySort();
					this._fireChange({reason: ChangeReason.Filter});
				} else {
					this.sChangeReason = ChangeReason.Filter;
				}
			} else {
				this.resetData();
				this.abortPendingRequest();
				this.sChangeReason = ChangeReason.Filter;
				this._fireRefresh({reason: this.sChangeReason});
			}
			// TODO remove this if the filter event gets removed which is now deprecated
			if (sFilterType === FilterType.Application) {
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

	ODataListBinding.prototype.applyFilter = function() {
		var that = this,
			oContext,
			aFilters = this.aFilters.concat(this.aApplicationFilters),
			aConvertedFilters = [];

		jQuery.each(aFilters, function(i, oFilter) {
			if (oFilter instanceof ODataFilter) {
				aConvertedFilters.push(oFilter.convert());
			} else {
				aConvertedFilters.push(oFilter);
			}
		});

		this.aKeys = FilterProcessor.apply(this.aAllKeys, aConvertedFilters, function(vRef, sPath) {
			oContext = that.oModel.getContext('/' + vRef);
			return that.oModel.getProperty(sPath, oContext);
		});
		this.iLength = this.aKeys.length;
	};

	ODataListBinding.prototype.createFilterParams = function(aFilters) {
		this.sFilterParams = ODataUtils.createFilterParams(aFilters, this.oModel.oMetadata, this.oEntityType);
	};

	ODataListBinding.prototype._initSortersFilters = function(){
		// if path could not be resolved entity type cannot be retrieved and
		// also filters/sorters don't need to be set
		var sResolvedPath = this.oModel.resolve(this.sPath, this.oContext);
		if (!sResolvedPath) {
			return;
		}
		this.oEntityType = this._getEntityType();
		if (!this.bClientOperation) {
			this.createSortParams(this.aSorters);
			this.createFilterParams(this.aFilters.concat(this.aApplicationFilters));
		}
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
