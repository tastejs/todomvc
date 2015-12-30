/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global', 'sap/ui/Device'], function ($, Device) {
	"use strict";

	///////////////////////////////
	/// Privates
	///////////////////////////////
	var queue = [],
		context = {};

	function internalWait (fnCallback, oOptions, oDeferred) {

		// Increase the wait timeout in debug mode, to allow debugging the waitFor without getting timeouts
		if (window["sap-ui-debug"]){
			oOptions.timeout = 300;
		}

		var startTime = new Date();
		fnCheck();

		function fnCheck () {
			var oResult = fnCallback();

			if (oResult.result) {
				internalEmpty(oDeferred);
				return;
			}

			var timeDiff = new Date() - startTime;

			// strip the milliseconds
			timeDiff /= 1000;

			var iPassedSeconds = Math.round(timeDiff % 60);

			if (oOptions.timeout > iPassedSeconds) {
				setTimeout(fnCheck, oOptions.pollingInterval);
				// timeout not yet reached
				return;
			}

			if (oOptions.error) {
				try {
					oOptions.error(oOptions, oResult.arguments);
				} finally {
					oDeferred.reject(oOptions, oResult.arguments);
				}
				return;
			}

			oDeferred.reject(oOptions);
		}

	}

	function internalEmpty(deferred) {
		if (queue.length === 0) {
			deferred.resolve();
			return true;
		}

		var queueElement = queue.shift();

		// This has to be here for IFrame with IE - if there is no timeout, there is a window with all properties undefined.
		// Therefore the core code throws exceptions, when functions like setTimeout are called.
		// I don't have a proper explanation for this.
		setTimeout(function () {
			internalWait(queueElement.callback, queueElement.options, deferred);
		}, 0);
	}

	function ensureNewlyAddedWaitForStatementsPrepended(iPreviousQueueLength, nestedInOptions){
		var iNewWaitForsCount = queue.length - iPreviousQueueLength;
		if (iNewWaitForsCount) {
			var aNewWaitFors = queue.splice(iPreviousQueueLength, iNewWaitForsCount);
			aNewWaitFors.forEach(function(queueElement) {
				queueElement.options._nestedIn = nestedInOptions;
			});
			queue = aNewWaitFors.concat(queue);
		}
	}

	function createStack(iDropCount) {
		iDropCount = (iDropCount || 0) + 2;

		if (Device.browser.mozilla) {
			//firefox needs one less in the string
			iDropCount = iDropCount - 1;
		}

		var oError = new Error(),
			stack = oError.stack;

		if (!stack){
			//In IE an error has to be thrown first to get a stack
			try {
				throw oError();
			} catch (oError2) {
				stack = oError2.stack;
			}
		}

		// IE <= 9 this will not work
		if (!stack) {
			return "";
		}

		stack = stack.split("\n");
		stack.splice(0, iDropCount);
		return stack.join("\n");
	}
	///////////////////////////////
	/// Public
	///////////////////////////////


	/**
	 * This class will help you write acceptance tests in one page or single page applications.
	 * You can wait for certain conditions to be met.
	 *
	 * @class One Page Acceptance testing.
	 * @public
	 * @alias sap.ui.test.Opa
	 * @author SAP SE
	 * @since 1.22
	 *
	 * @param {object} [extensionObject] An object containing properties and functions. The newly created Opa will be extended by these properties and functions using jQuery.extend.
	 */
	var Opa = function(extensionObject) {
		this.and = this;
		$.extend(this, extensionObject);
	};


	/**
	 * the global configuration of Opa.
	 * All of the global values can be overwritten in an individual waitFor call.
	 * defaults are :
	 * <ul>
	 * 		<li>arrangements: a new Opa instance</li>
	 * 		<li>actions: a new Opa instance</li>
	 * 		<li>assertions: a new Opa instance</li>
	 * 		<li>timeout : 15 seconds, is increased to 5 minutes if running in debug mode e.g. with URL parameter sap-ui-debug=true</li>
	 * 		<li>pollingInterval: 400 milliseconds</li>
	 * </ul>
	 * You can either directly manipulate the config, or extend it, using {@link sap.ui.test.Opa#.extendConfig}
	 * @public
	 */
	Opa.config = {};

	/**
	 * Extends and overwrites default values of the Opa.config
	 *
	 * @param {object} options the values to be added to the existing config
	 * @public
	 */
	Opa.extendConfig = function (options) {
		Opa.config = jQuery.extend(Opa.config, options);
	};

	/**
	 * Reset Opa.config to its default values
	 * All of the global values can be overwritten in an individual waitFor call.
	 *
	 * defaults are :
	 * <ul>
	 * 		<li>arrangements: a new Opa instance</li>
	 * 		<li>actions: a new Opa instance</li>
	 * 		<li>assertions: a new Opa instance</li>
	 * 		<li>timeout : 15 seconds, is increased to 5 minutes if running in debug mode e.g. with URL parameter sap-ui-debug=true</li>
	 * 		<li>pollingInterval: 400 milliseconds</li>
	 * </ul>
	 *
	 * @public
	 * @since 1.25
	 */
	Opa.resetConfig = function () {
		Opa.config = {
			arrangements : new Opa(),
			actions : new Opa(),
			assertions : new Opa(),
			timeout : 15,
			pollingInterval : 400,
			_stackDropCount : 0 //Internal use. Specify numbers of additional stack frames to remove for logging
		};
	};

	/**
	 * Gives access to a singleton object you can save values in.
	 * same as {@link sap.ui.test.Opa#getContext}
	 * @since 1.29.0
	 * @returns {object} the context object
	 * @public
	 * @function
	 */
	Opa.getContext = function () {
		return context;
	};

	/**
	 * Waits until all waitFor calls are done.
	 *
	 * @returns {jQuery.promise} If the waiting was successful, the promise will be resolved. If not it will be rejected
	 * @public
	 */
	Opa.emptyQueue = function emptyQueue () {
		function addStacks(oOptions) {
			var sResult = "\nCallstack:\n";
			if (oOptions._stack) {
				sResult += oOptions._stack;
				delete oOptions._stack;
			} else {
				sResult += "Unknown";
			}
			if (oOptions._nestedIn) {
				sResult += addStacks(oOptions._nestedIn);
				delete oOptions._nestedIn;
			}
			return sResult;
		}

		var oDeferred = $.Deferred();

		internalEmpty(oDeferred);

		return oDeferred.promise().fail(function(oOptions){
			oOptions.errorMessage = oOptions.errorMessage || "Failed to wait for check";
			oOptions.errorMessage += addStacks(oOptions);
			jQuery.sap.log.error(oOptions.errorMessage);
		});
	};

	//create the default config
	Opa.resetConfig();

	Opa.prototype = {

		/**
		 * Gives access to a singleton object you can save values in.
		 * This object will only be created once and never destroyed.
		 * So you may use it across different tests.
		 *
		 * @returns {object} the context object
		 * @public
		 * @function
		 */
		getContext : Opa.getContext,

		/**
		 * Queues up a waitFor command for Opa.
		 * The Queue will not be emptied until {@link sap.ui.test.Opa#.emptyQueue} is called.
		 * If you are using {@link sap.ui.test.opaQunit}, emptyQueue will be called by the wrapped tests.
		 *
		 * If you are using Opa5, waitFor takes additional parameters.
		 * They can be found here: {@link sap.ui.test.Opa5#waitFor}.
		 * Waits for a check condition to return true. Then a success function will be called.
		 * If check does not return true until timeout is reached, an error function will be called.
		 *
		 *
		 * @public
		 * @param {object} options containing check, success and error functions
		 * @param {integer} [oOptions.timeout] default: 15 - (seconds) specifies how long the waitFor function polls before it fails.
		 * @param {integer} [oOptions.pollingInterval] default: 400 - (milliseconds) specifies how often the waitFor function polls.
		 * @param {function} [oOptions.check] Will get invoked in every polling interval. If it returns true, the check is successful and the polling will stop.
		 * The first parameter passed into the function is the same value that gets passed to the success function.
		 * Returning something different than boolean in check will not change the first parameter of success.
		 * @param {function} [oOptions.success] will get invoked after the check function returns true. If there is no check function defined,
		 * it will be directly invoked. waitFor statements added in the success handler will be executed before previously added waitFor statements
		 * @param {string} [oOptions.errorMessage] Will be displayed as errorMessage depending on your unit test framework. Currently the only adapter for OPA is QUnit. There the message appears when OPA5 is reaching its timeout but QUnit has not reached it yet.
		 * @returns {jQuery.promise} a promise that gets resolved on success.
		 */
		waitFor : function (options) {
			var deferred = $.Deferred();
				options = $.extend({},
				Opa.config,
				options);

			options._stack = createStack(1 + options._stackDropCount);
			delete options._stackDropCount;

			deferred.promise(this);

			queue.push({
				callback : jQuery.proxy(function () {
					var bResult = true;

					//no check - all ok
					if (options.check) {
						bResult = options.check.apply(this, arguments);
					}

					if (bResult) {
						if (options.success) {
							try {
								var iCurrentQueueLength = queue.length;
								options.success.apply(this, arguments);
							} finally {
								ensureNewlyAddedWaitForStatementsPrepended(iCurrentQueueLength, options);
								deferred.resolve();
							}
						} else {
							deferred.resolve();
						}

						return { result : true, arguments : arguments };
					}

					return {result : false, arguments : arguments };
				}, this),
				options : options
			});

			return this;
		},

		/**
		 * Calls the static extendConfig function in the Opa namespace {@link sap.ui.test.Opa#.extendConfig}
		 * @public
		 * @function
		 */
		extendConfig : Opa.extendConfig,

		/**
		 * Calls the static emptyQueue function in the Opa namespace {@link sap.ui.test.Opa#.emptyQueue}
		 * @public
		 * @function
		 */
		emptyQueue : Opa.emptyQueue
	};


	return Opa;
},  /* export= */ true);
