/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

/* EXPERIMENTAL */

sap.ui.define(['jquery.sap.global', 'sap/ui/Device', 'sap/ui/core/Core'],
	function(jQuery, Device, Core) {
	"use strict";


	/**
	 * @class Performance Recorder
	 * @static
	 * @alias sap.ui.core.support.PerformanceRecorder
	 */
	
	var PerformanceRecorder = {};
	
	/**
	 * Initialize and start the recording of performance measurements
	 *
	 * @param {object} oConfig The object holding the configuration
	 * @param {object[]} aInteractionSteps The array holding the interaction steps
	 * @return void
	 * @public
	 */
	PerformanceRecorder.start = function(oConfig, aInteractionSteps) {
		PerformanceRecorder.config = oConfig;
		PerformanceRecorder.interactionSteps = aInteractionSteps;
		PerformanceRecorder.interactionPointer = 0;
		PerformanceRecorder.stepPointer = 0;
	
		jQuery.sap.measure.setActive(true);
	
		PerformanceRecorder.processStepStart();
	};
	
	/**
	 * Process a step's start trigger
	 *
	 * @return void
	 * @private
	 */
	PerformanceRecorder.processStepStart = function() {
		// Get the relevant steps
		var currentInteraction = PerformanceRecorder.interactionSteps[PerformanceRecorder.interactionPointer];
		var currentStep = currentInteraction.steps[PerformanceRecorder.stepPointer];
	
		// Start timer or attach trigger event or delegate
		if (currentStep.startTriggerEvent == "immediate") {
	
			// Start timer for interaction step if it's the first measuring step
			if (PerformanceRecorder.stepPointer == 0) {
				jQuery.sap.measure.start(currentInteraction.id, currentInteraction.description);
			}
	
			// Start timer for measuring step
			jQuery.sap.measure.start(currentStep.id, currentInteraction.id);
	
			// Continue to stop event processing
			PerformanceRecorder.processStepStop();
	
		} else if (currentStep.startTriggerEvent == "UIUpdated") {
	
			sap.ui.getCore().attachEvent(Core.M_EVENTS.UIUpdated, function() {
				// Start timer for interaction step if it's the first measuring step
				if (sap.ui.core.support.stepPointer == 0) {
					jQuery.sap.measure.start(currentInteraction.id, currentInteraction.description);
				}
	
				// Start timer for measuring step
				jQuery.sap.measure.start(currentStep.id, currentInteraction.id);
	
				// Continue to stop event processing
				PerformanceRecorder.processStepStop();
			});
	
		} else if (currentStep.startTriggerId && currentStep.startTriggerEvent) {	// Trigger by element event
	
			// Get the trigger element
			var oTrigger = sap.ui.getCore().byId(currentStep.startTriggerId);
	
			// Prepare trigger event
			PerformanceRecorder.oTriggerEvent = {};
			PerformanceRecorder.oTriggerEvent[currentStep.startTriggerEvent] = function() {
				// Start timer for interaction step if it's the first measuring step
				if (PerformanceRecorder.stepPointer == 0) {
					jQuery.sap.measure.start(currentInteraction.id, currentInteraction.description);
				}
	
				// Start timer for measuring step
				jQuery.sap.measure.start(currentStep.id, currentInteraction.id);
	
				// Continue to stop event processing
				PerformanceRecorder.processStepStop();
			};
	
			// Add trigger event as a delegate to the element
			oTrigger.addDelegate(PerformanceRecorder.oTriggerEvent, true);
	
		}
	};
	
	/**
	 * Process a step's stop trigger
	 *
	 * @return void
	 * @private
	 */
	PerformanceRecorder.processStepStop = function() {
		// Get the relevant steps
		var currentInteraction = PerformanceRecorder.interactionSteps[PerformanceRecorder.interactionPointer];
		var currentStep = currentInteraction.steps[PerformanceRecorder.stepPointer];
	
		// Detach start trigger event or delegate
		if (currentStep.startTriggerEvent == "UIUpdated") {
			// Detach from this function from UIUpdated event
			sap.ui.getCore().detachEvent(Core.M_EVENTS.UIUpdated, PerformanceRecorder.processStepStop);
		} else if (currentStep.startTriggerId && currentStep.startTriggerEvent) {
			// Remove delegate from trigger element
			var oTrigger = sap.ui.getCore().byId(currentStep.startTriggerId);
			oTrigger.removeDelegate(PerformanceRecorder.oTriggerEvent);
		}
	
		// Register the stop event
		if (currentStep.stopTriggerEvent == "UIUpdated") {
			sap.ui.getCore().attachEvent(Core.M_EVENTS.UIUpdated, PerformanceRecorder.concludeStep);
		} else if (currentStep.stopTriggerId && currentStep.stopTriggerEvent) {	// Trigger by element event
	
			// Get the trigger element
			var oTrigger = sap.ui.getCore().byId(currentStep.stopTriggerId);
	
			// Prepare trigger event
			PerformanceRecorder.oTriggerEvent = {};
			PerformanceRecorder.oTriggerEvent[currentStep.stopTriggerEvent] = function() {
	
				// Continue to stop event processing
				PerformanceRecorder.concludeStep();
			};
	
			// Add trigger event as a delegate to the element
			oTrigger.addDelegate(PerformanceRecorder.oTriggerEvent, true);
	
		}
	};
	
	/**
	 * Conclude step/interaction/recording
	 *
	 * @return void
	 * @private
	 */
	PerformanceRecorder.concludeStep = function() {
		var currentInteraction = PerformanceRecorder.interactionSteps[PerformanceRecorder.interactionPointer];
		var currentStep = currentInteraction.steps[PerformanceRecorder.stepPointer];
		var lastInteraction = PerformanceRecorder.interactionSteps.length - 1;
		var lastStep = currentInteraction.steps.length - 1;
	
		// Record stop time for measuring step
		jQuery.sap.measure.end(currentStep.id);
	
		// Detach trigger event
		if (currentStep.stopTriggerEvent == "UIUpdated") {
			sap.ui.getCore().detachEvent(Core.M_EVENTS.UIUpdated, PerformanceRecorder.concludeStep);
		}
	
		// Stop timer for interaction step if it's the last measuring step
		if (PerformanceRecorder.stepPointer == lastStep) {
			jQuery.sap.measure.end(currentInteraction.id);
		}
	
		// Advance pointers or end recording
		if (PerformanceRecorder.interactionPointer < lastInteraction) {
			if (PerformanceRecorder.stepPointer < lastStep) {
				PerformanceRecorder.stepPointer++;
			} else {
				PerformanceRecorder.interactionPointer++;
				PerformanceRecorder.stepPointer = 0;
			}
			PerformanceRecorder.processStepStart();
		} else {
			PerformanceRecorder.endRecording();
		}
	};
	
	/**
	 * End recording and beacon results
	 *
	 * @return void
	 * @private
	 */
	PerformanceRecorder.endRecording = function() {
		var measurements = PerformanceRecorder.getAllMeasurementsAsHAR();
		var data = {
			log: {
					version: "1.2",
					creator: {
						name: "SAPUI5 PerformanceRecorder",
						version: "1.1"
					},
					browser: {
						name: navigator.userAgent,
						version: Device.browser.version
					}
			}
		};
	
		var pages = [];
		var entries = [];
		for (var i in measurements) {
			if (measurements[i].id.substr(-5) === "_page") {
				var page = {
					startedDateTime: measurements[i].startedDateTime,
					id: measurements[i].id,
					title: measurements[i].pageref,
					pageTimings: {
								onContentLoad: -1,
								onLoad: measurements[i].time
					}
				};
	
				pages.push(page);
			} else {
				entries.push(measurements[i]);
			}
		}
	
		data.log.pages = pages;
		data.log.entries = entries;
	
		jQuery.ajax({
			type: 'POST',
			url: PerformanceRecorder.config.beaconUrl,
			data: data,
			dataType: 'text'
		});
	};
	
	/**
	 * Gets all performance measurements in HAR format
	 *
	 * @return {object} [] current measurement (false if error)
	 * @private
	 */
	PerformanceRecorder.getAllMeasurementsAsHAR = function() {
		var origMeasurements = jQuery.sap.measure.getAllMeasurements();
		var aMeasurements = [];
		var oFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
			pattern: "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"
		});
	
		//TODO Improve the data that is being written into the fields
		jQuery.each(origMeasurements, function(sId, oMeasurement){
			var isoDate = oFormat.format(new Date(oMeasurement.start), true);
	
			aMeasurements.push({
				id: oMeasurement.id,
				pageref: oMeasurement.info,
				startedDateTime: isoDate,
				time: oMeasurement.duration,
				request: {
								method: "GET",
					url: oMeasurement.id,
					httpVersion: "HTTP/1.1",
					cookies: [
						{
								dummy: ""
						}
					],
					headers: [
						{
								name: "",
								value: ""
						}
					],
					queryString: [
						{
								name: "",
								value: ""
						}
					],
					headersSize: 0,
					bodySize: 0
				},
				response: {
								status: 200,
					statusText: "OK",
					httpVersion: "HTTP/1.1",
					cookies: [
						{
								dummy: ""
						}
					],
					headers: [
						{
								name: "",
								value: ""
						}
					],
					content: {
						size: 0,
						compression: 0,
						mimeType: "text/html; charset=utf-8",
						text: "\n"
					},
					redirectURL: "",
					headersSize: 0,
					bodySize: 0
				},
				cache: {
								beforeRequest: {
						lastAccess: "",
						eTag: "",
						hitCount: ""
					},
					afterRequest: {
						lastAccess: "",
						eTag: "",
						hitCount: ""
					}
				},
				timings: {
					blocked: -1,
					dns: -1,
					connect: -1,
					send: -1,
					wait: -1,
					receive: oMeasurement.duration,
					ssl: -1
				}
			});
		});
		return aMeasurements;
	};
	

	return PerformanceRecorder;

}, /* bExport= */ true);
