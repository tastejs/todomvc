/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides class sap.ui.base.EventProvider
sap.ui.define(['jquery.sap.global', './Event', './Object', './ObjectPool'],
	function(jQuery, Event, BaseObject, ObjectPool) {
	"use strict";


	/**
	 * Creates an instance of EventProvider.
	 *
	 * @class Provides eventing capabilities for objects like attaching or detaching event handlers for events which are notified when events are fired.
	 *
	 * @abstract
	 * @extends sap.ui.base.Object
	 * @author SAP SE
	 * @version 1.32.9
	 * @constructor
	 * @public
	 * @alias sap.ui.base.EventProvider
	 */
	var EventProvider = BaseObject.extend("sap.ui.base.EventProvider", /* @lends sap.ui.base.EventProvider */ {

		constructor : function() {

			BaseObject.call(this);

			/**
			 * A map of arrays of event registrations keyed by the event names
			 * @private
			 */
			this.mEventRegistry = {};

		}

	});

	/**
	 * Map of event names and ids, that are provided by this class
	 * @private
	 * @static
	 */
	EventProvider.M_EVENTS = {EventHandlerChange:"EventHandlerChange"};

	/**
	 * Pool is defined on the prototype to be shared among all EventProviders
	 * @private
	 */
	EventProvider.prototype.oEventPool = new ObjectPool(Event);

	/**
	 * Attaches an event handler to the event with the given identifier.
	 *
	 * @param {string}
	 *            sEventId The identifier of the event to listen for
	 * @param {object}
	 *            [oData] An object that will be passed to the handler along with the event object when the event is fired
	 * @param {function}
	 *            fnFunction The handler function to call when the event occurs. This function will be called in the context of the
	 *                       <code>oListener</code> instance (if present) or on the event provider instance. The event
	 *                       object ({@link sap.ui.base.Event}) is provided as first argument of the handler. Handlers must not change
	 *                       the content of the event. The second argument is the specified <code>oData</code> instance (if present).
	 * @param {object}
	 *            [oListener] The object that wants to be notified when the event occurs (<code>this</code> context within the
	 *                        handler function). If it is not specified, the handler function is called in the context of the event provider.
	 * @return {sap.ui.base.EventProvider} Returns <code>this</code> to allow method chaining
	 * @public
	 */
	EventProvider.prototype.attachEvent = function(sEventId, oData, fnFunction, oListener) {
		jQuery.sap.assert(typeof (sEventId) === "string" && sEventId, "EventProvider.attachEvent: sEventId must be a non-empty string");
		if (typeof (oData) === "function") {
		//one could also increase the check in the line above
		//if(typeof(oData) === "function" && oListener === undefined) {
			oListener = fnFunction;
			fnFunction = oData;
			oData = undefined;
		}
		jQuery.sap.assert(typeof (fnFunction) === "function", "EventProvider.attachEvent: fnFunction must be a function");
		jQuery.sap.assert(!oListener || typeof (oListener) === "object", "EventProvider.attachEvent: oListener must be empty or an object");

		if (!this.mEventRegistry[sEventId]) {
			this.mEventRegistry[sEventId] = [];
		}
		this.mEventRegistry[sEventId].push({oListener:oListener, fFunction:fnFunction, oData: oData});

		// Inform interested parties about changed EventHandlers
		this.fireEvent(EventProvider.M_EVENTS.EventHandlerChange, {EventId: sEventId, type: 'listenerAttached'});

		return this;
	};

	/**
	 * Attaches an event handler, called one time only, to the event with the given identifier.
	 *
	 * When the event occurs, the handler function is called and the handler registration is automatically removed afterwards.
	 *
	 * @param {string}
	 *            sEventId The identifier of the event to listen for
	 * @param {object}
	 *            [oData] An object that will be passed to the handler along with the event object when the event is fired
	 * @param {function}
	 *            fnFunction The handler function to call when the event occurs. This function will be called in the context of the
	 *                       <code>oListener</code> instance (if present) or on the event provider instance. The event
	 *                       object ({@link sap.ui.base.Event}) is provided as first argument of the handler. Handlers must not change
	 *                       the content of the event. The second argument is the specified <code>oData</code> instance (if present).
	 * @param {object}
	 *            [oListener] The object that wants to be notified when the event occurs (<code>this</code> context within the
	 *                        handler function). If it is not specified, the handler function is called in the context of the event provider.
	 * @return {sap.ui.base.EventProvider} Returns <code>this</code> to allow method chaining
	 * @public
	 */
	EventProvider.prototype.attachEventOnce = function(sEventId, oData, fnFunction, oListener) {
		if (typeof (oData) === "function") {
			oListener = fnFunction;
			fnFunction = oData;
			oData = undefined;
		}
		function fnOnce() {
			this.detachEvent(sEventId, fnOnce);  // ‘this’ is always the control, due to the context ‘undefined’ in the attach call below
			fnFunction.apply(oListener || this, arguments);  // needs to do the same resolution as in fireEvent
		}
		this.attachEvent(sEventId, oData, fnOnce, undefined);  // a listener of ‘undefined’ enforce a context of ‘this’ even after clone
		return this;
	};

	/**
	 * Removes a previously attached event handler from the event with the given identifier.
	 *
	 * The passed parameters must match those used for registration with {@link #attachEvent} beforehand.
	 *
	 * @param {string}
	 *            sEventId The identifier of the event to detach from
	 * @param {function}
	 *            fnFunction The handler function to detach from the event
	 * @param {object}
	 *            [oListener] The object that wanted to be notified when the event occurred
	 * @return {sap.ui.base.EventProvider} Returns <code>this</code> to allow method chaining
	 * @public
	 */
	EventProvider.prototype.detachEvent = function(sEventId, fnFunction, oListener) {
		jQuery.sap.assert(typeof (sEventId) === "string" && sEventId, "EventProvider.detachEvent: sEventId must be a non-empty string" );
		jQuery.sap.assert(typeof (fnFunction) === "function", "EventProvider.detachEvent: fnFunction must be a function");
		jQuery.sap.assert(!oListener || typeof (oListener) === "object", "EventProvider.detachEvent: oListener must be empty or an object");

		var aEventListeners = this.mEventRegistry[sEventId];
		if (!aEventListeners) {
			return this;
		}

		var bListenerDetached = false;

		//PERFOPT use array. remember length to not re-calculate over and over again
		for (var i = 0, iL = aEventListeners.length; i < iL; i++) {
			//PERFOPT check for identity instead of equality... avoid type conversion
			if (aEventListeners[i].fFunction === fnFunction && aEventListeners[i].oListener === oListener) {
				//delete aEventListeners[i];
				aEventListeners.splice(i,1);
				bListenerDetached = true;
				break;
			}
		}
		// If we just deleted the last registered EventHandler, remove the whole entry from our map.
		if (aEventListeners.length == 0) {
			delete this.mEventRegistry[sEventId];
		}

		if (bListenerDetached) {
			// Inform interested parties about changed EventHandlers
			this.fireEvent(EventProvider.M_EVENTS.EventHandlerChange, {EventId: sEventId, type: 'listenerDetached' });
		}

		return this;
	};

	/**
	 * Fires an {@link sap.ui.base.Event event} with the given settings and notifies all attached event handlers.
	 *
	 * @param {string}
	 *            sEventId The identifier of the event to fire
	 * @param {object}
	 *            [mParameters] The parameters which should be carried by the event
	 * @param {boolean}
	 *            [bAllowPreventDefault] Defines whether function <code>preventDefault</code> is supported on the fired event
	 * @param {boolean}
	 *            [bEnableEventBubbling] Defines whether event bubbling is enabled on the fired event. Set to <code>true</code> the event is also forwarded to the parent(s)
	 *                                   of the event provider ({@link #getEventingParent}) until the bubbling of the event is stopped or no parent is available anymore.
	 * @return {sap.ui.base.EventProvider|boolean} Returns <code>this</code> to allow method chaining. When <code>preventDefault</code> is supported on the fired event
	 *                                             the function returns <code>true</code> if the default action should be executed, <code>false</code> otherwise.
	 * @protected
	 */
	EventProvider.prototype.fireEvent = function(sEventId, mParameters, bAllowPreventDefault, bEnableEventBubbling) {
		// at least in BrowserEventManager when firing events of its E_EVENTS enumeration, the type will be an integer... thus avoid this check
		//	jQuery.sap.assert(typeof (sEventId) == "string");

		// get optional parameters right
		if (typeof mParameters == "boolean") {
			bEnableEventBubbling = bAllowPreventDefault;
			bAllowPreventDefault = mParameters;
		}

		var aEventListeners = this.mEventRegistry[sEventId],
			bPreventDefault = false,
			oEvent, oParent, oInfo;

		if (bEnableEventBubbling || (aEventListeners && jQuery.isArray(aEventListeners))) {

			// this ensures no 'concurrent modification exception' occurs (e.g. an event listener deregisters itself).
			aEventListeners = aEventListeners ? aEventListeners.slice() : [];

			oEvent = this.oEventPool.borrowObject(sEventId, this, mParameters);

			//PERFOPT use array. remember length to not re-calculate over and over again
			for (var i = 0, iL = aEventListeners.length; i < iL; i++) {
				oInfo = aEventListeners[i];
				oInfo.fFunction.call(oInfo.oListener || this, oEvent, oInfo.oData);
			}

			// In case this is a bubbling event and object has a getParent method, also fire on parents
			if (bEnableEventBubbling) {
				oParent = this.getEventingParent();
				while (oParent && !oEvent.bCancelBubble) {
					aEventListeners = oParent.mEventRegistry[sEventId];
					if (aEventListeners && aEventListeners instanceof Array) {
						aEventListeners = aEventListeners.slice();
						for (var i = 0, iL = aEventListeners.length; i < iL; i++) {
							oInfo = aEventListeners[i];
							oInfo.fFunction.call(oInfo.oListener || oParent, oEvent, oInfo.oData);
						}
					}
					oParent = oParent.getEventingParent();
				}
			}

			// Store prevent default state, before returning event to the pool
			bPreventDefault = oEvent.bPreventDefault;

			this.oEventPool.returnObject(oEvent);
		}

		// Only return prevent default result in case it has been enabled, for compatibility
		if (bAllowPreventDefault) {
			return !bPreventDefault;
		} else {
			return this;
		}
	};

	/**
	 * Returns whether there are any registered event handlers for the event with the given identifier.
	 *
	 * @param {string} sEventId The identifier of the event
	 * @return {boolean} Whether there are any registered event handlers
	 * @protected
	 */
	EventProvider.prototype.hasListeners = function(sEventId) {
		return !!this.mEventRegistry[sEventId];
	};

	/**
	 * Returns the list of events currently having listeners attached.
	 *
	 * Introduced for lightspeed support to ensure that only relevant events are attached to the LS-world.
	 *
	 * This is a static method to avoid the pollution of the Element/Control namespace.
	 * As the callers are limited and known and for performance reasons the internal event registry
	 * is returned. It contains more information than necessary, but needs no expensive conversion.
	 *
	 * @return {object} the list of events currently having listeners attached
	 * @private
	 * @static
	 */
	EventProvider.getEventList = function(oEventProvider) {
		return oEventProvider.mEventRegistry;
	};

	/**
	 * Returns the parent in the eventing hierarchy of this object.
	 *
	 * Per default this returns null, but if eventing is used in objects, which are hierarchically
	 * structured, this can be overwritten to make the object hierarchy visible to the eventing and
	 * enables the use of event bubbling within this object hierarchy.
	 *
	 * @return {sap.ui.base.EventProvider} The parent event provider
	 * @protected
	 */
	EventProvider.prototype.getEventingParent = function() {
		return null;
	};

	/**
	 * Returns a string representation of this object.
	 *
	 * In case there is no class or id information, a simple static string is returned.
	 * Subclasses should override this method.
	 *
	 * @return {string} A string description of this event provider
	 * @public
	 */
	EventProvider.prototype.toString = function() {
		if ( this.getMetadata ) {
			return "EventProvider " + this.getMetadata().getName();
		} else {
			return "EventProvider";
		}
	};


	/**
	 * Cleans up the internal structures and removes all event handlers.
	 *
	 * The object must not be used anymore after destroy was called.
	 *
	 * @see sap.ui.base.Object#destroy
	 * @public
	 */
	EventProvider.prototype.destroy = function() {
		this.mEventRegistry = {};
		BaseObject.prototype.destroy.apply(this, arguments);
	};


	return EventProvider;

});
