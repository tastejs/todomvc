/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global', '../base/Object', './EventBus'],
	function(jQuery, BaseObject, EventBus) {
	"use strict";


		var _EVENT_ID = "sapUiIntervalTrigger-event";
	
		/**
		 * Creates an instance of EventBus.
		 * 
		 * @class Provides a trigger that triggers in a set interval and calls all
		 *        registered listeners. If the interval is <= 0 the trigger is
		 *        switched off and won't trigger at all.
		 * @param {int}
		 *            iInterval is the interval the trigger should be used. If the
		 *            trigger is >0 triggering starts/runs and if the interval is
		 *            set to <=0 triggering stops.
		 * 
		 * @extends sap.ui.base.Object
		 * @author SAP SE
		 * @version 1.32.9
		 * @constructor
		 * @public
		 * @since 1.11.0
		 * @alias sap.ui.core.IntervalTrigger
		 */
		var IntervalTrigger = BaseObject.extend("sap.ui.core.IntervalTrigger", {
			constructor : function(iInterval) {
				BaseObject.apply(this);
	
				this._oEventBus = new EventBus();
	
				this._delayedCallId = null;
				this._triggerProxy = jQuery.proxy(trigger, this);
	
				this._iInterval = 0;
				if (iInterval) {
					this.setInterval(iInterval);
				}
			}
		});
	
		/**
		 * This is the function that will be used for triggering. This function is
		 * called by a proxy call.
		 * 
		 * @private
		 */
		var trigger = function() {
			jQuery.sap.clearDelayedCall(this._delayedCallId);
	
			// if interval is active and there are registered listeners
			var bHasListeners = this._oEventBus._defaultChannel.hasListeners(_EVENT_ID);
			if (this._iInterval > 0 && bHasListeners) {
				this._oEventBus.publish(_EVENT_ID);
	
				this._delayedCallId = jQuery.sap.delayedCall(this._iInterval, this, this._triggerProxy);
			}
		};
	
		/**
		 * Destructor method for objects.
		 * 
		 * @public
		 */
		IntervalTrigger.prototype.destroy = function() {
			BaseObject.prototype.destroy.apply(this, arguments);
	
			delete this._triggerProxy;
	
			this._oEventBus.destroy();
			delete this._oEventBus;
		};
	
		/**
		 * Sets the trigger interval. If the value is >0 triggering will start if
		 * there are any registered listeners. If the interval is set to <=0
		 * triggering will stop.
		 * 
		 * @public
		 * @param {int}
		 *            iInterval sets the interval in milliseconds when a new
		 *            triggering should occur.
		 */
		IntervalTrigger.prototype.setInterval = function(iInterval) {
			jQuery.sap.assert((typeof iInterval === "number"), "Interval must be an integer value");
	
			// only change and (re)trigger if the interval is different
			if (this._iInterval !== iInterval) {
				this._iInterval = iInterval;
				this._triggerProxy();
			}
		};
	
		/**
		 * Adds a listener to the list that should be triggered.
		 * 
		 * @public
		 * @param {function}
		 *            fnFunction is the called function that should be called when
		 *            the trigger want to trigger the listener.
		 * @param {object}
		 *            [oListener] that should be triggered.
		 */
		IntervalTrigger.prototype.addListener = function(fnFunction, oListener) {
			this._oEventBus.subscribe(_EVENT_ID, fnFunction, oListener);
	
			this._triggerProxy();
		};
	
		/**
		 * Removes corresponding listener from list.
		 * 
		 * @public
		 * @param {function}
		 *            fnFunction is the previously registered function
		 * @param {object}
		 *            [oListener] that should be removed
		 */
		IntervalTrigger.prototype.removeListener = function(fnFunction, oListener) {
			this._oEventBus.unsubscribe(_EVENT_ID, fnFunction, oListener);
		};
	
		/**
		 * @see sap.ui.base.Object#getInterface
		 * @public
		 */
		IntervalTrigger.prototype.getInterface = function() {
			return this;
		};


	return IntervalTrigger;

});
