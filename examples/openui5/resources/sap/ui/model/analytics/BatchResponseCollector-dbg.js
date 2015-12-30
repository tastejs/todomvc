/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

/**
 * Internal Component of the AnalyticalBinding, only used there
 *
 * @namespace
 * @name sap.ui.model.analytics
 * @private
 */

sap.ui.define(function() {
	"use strict";

	/**
	 * Constructor for a batch response collecting component
	 * 
	 * Simple Response Collection Component, collects the responses for each sub-request inside a bigger batch request
	 * Also handles clean-up after all responses (either success or error) have been collected.
	 * Instantiated in AnalyticalBinding.prototype._executeBatchRequest()
	 * 
	 * @name sap.ui.model.analytics.v2.BatchResponseCollector
	 * @constructor
	 * @public
	 * @param {object} [mParams] optional Setup-Parameter, @see BatchResponseCollector#setup
	 */
	function BatchResponseCollector(mParams) {
		if (mParams) {
			this.setup(mParams);
		}
	}

	/**
	 * Type "Success" for Batch Sub-Responses
	 */
	BatchResponseCollector.TYPE_SUCCESS = "success";
	/**
	 * Type "Error" for Batch Sub-Responses
	 */
	BatchResponseCollector.TYPE_ERROR = "error";

	/**
	 * Setup-Function to initialize/reset the BatchResponseCollector
	 * 
	 * @function
	 * @public
	 * @param {object} [mParams] optional Setup-Parameter
	 * @param {array} mParams.executedRequests an Array with detail informations for all executed batch sub-requests
	 * @param {object} mParams.binding a reference to the AnalyticalBinding which started the batch request
	 * @param {int} mParams.lastAnalyticalInfoVersion the analyticalInfo version at the time of the creation of this 
	 * 			BatchResponseCollector instance, this may change during the process of a pending request. Typically changed
	 * 			via a call to AnalyticalBinding#updateAnalyticalInfo.
	 * @param {function} mParam.success a success handler function, which is called after all requests in mParams.executedRequests
	 * 			have returned.
	 * @param {function} mParam.error an error handler function, which is called if one or more requests have returned with an error
	 */
	BatchResponseCollector.prototype.setup = function(mParams) {
		this.iRequestCollectionCount = 0;
		this.aCollectedSuccesses = [];
		this.aCollectedErrors = [];

		this.aExecutedRequestDetails = mParams.executedRequests;
		this.oAnalyticalBinding = mParams.binding;
		this.fnSuccessHandler = mParams.success;
		this.fnErrorHandler = mParams.error;
	};

	/**
	 * Convenience function to collect a success response.
	 * Internally BatchResponseCollector#collect is called with second parameter BatchResponseCollector.TYPE_SUCCESS
	 * 
	 * @function
	 * @public
	 * @name BatchResponseCollector#success
	 * @param {object} oResponse the successful response, which should be collected
	 */
	BatchResponseCollector.prototype.success = function(oResponse) {
		this.collect(oResponse, BatchResponseCollector.TYPE_SUCCESS);
	};

	/**
	 * Convenience function to collect an error response.
	 * Internally BatchResponseCollector#collect is called, the second parameter is set to BatchResponseCollector.TYPE_ERROR
	 * 
	 * @function
	 * @public
	 * @name BatchResponseCollector#error
	 * @param {object} oResponse the erroneous response object
	 */
	BatchResponseCollector.prototype.error = function(oResponse) {
		this.collect(oResponse, BatchResponseCollector.TYPE_ERROR);
	};

	/**
	 * Collects responses of type BatchResponseCollector.TYPE_SUCCESS and BatchResponseCollector. TYPE_ERROR
	 * Keeps track of all collected responses and fires the necessary events after all responses for the
	 * requests, given in the constructor, have returned.
	 * 
	 * @function
	 * @public
	 * @name BatchResponseCollector#collect
	 * @param {object} oResponse the response which should be collected
	 * @param {string} [sResponseType] the type of the response, either BatchResponseCollector.TYPE_SUCCESS
	 * 									or BatchResponseCollector.TYPE_ERROR
	 */
	BatchResponseCollector.prototype.collect = function(oResponse, sResponseType) {
		this.iRequestCollectionCount++;

		//check if the response was a success
		if (sResponseType === BatchResponseCollector.TYPE_SUCCESS) {
			this.aCollectedSuccesses.push(oResponse);
		} else {
			this.aCollectedErrors.push(oResponse);
		}

		var iOverallCompletedRequests = (this.aCollectedSuccesses.length + this.aCollectedErrors.length);

		//all responses have returned
		if (iOverallCompletedRequests === this.aExecutedRequestDetails.length) {
			//check if all responses were successful
			if ((this.aCollectedSuccesses.length === iOverallCompletedRequests) && this.aCollectedErrors.length === 0) {
				// has to be bound to window, because the model does it too
				this.fnSuccessHandler.call(window, {
					__batchResponses: this.aCollectedSuccesses
				}, {
					requestUri: this.oAnalyticalBinding.oModel.sServiceUrl + "/$batch"
				});
			} else {
				this.fnErrorHandler.call(window, this.aCollectedErrors[0]);
			}
		}
	};
	return BatchResponseCollector;

}, /* bExport= */true);
