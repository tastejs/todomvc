/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides the base implementation for all MessageProcessor implementations
sap.ui.define(['jquery.sap.global', 'sap/ui/base/EventProvider'],
	function(jQuery, EventProvider) {
	"use strict";
	

	/**
	 * 
	 * @namespace
	 * @name sap.ui.core.message
	 * @public
	 */

	/**
	 * Constructor for a new MessageProcessor
	 *
	 * @class
	 * This is an abstract base class for MessageProcessor objects.
	 * @abstract
	 *
	 * @extends sap.ui.base.EventProvider
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @alias sap.ui.core.message.MessageProcessor
	 */
	var MessageProcessor = EventProvider.extend("sap.ui.core.message.MessageProcessor", /** @lends sap.ui.core.message.MessageProcessor.prototype */ {

		constructor : function () {
			EventProvider.apply(this, arguments);
			
			this.mMessages = null;
			this.id = jQuery.sap.uid();
			sap.ui.getCore().getMessageManager().registerMessageProcessor(this);
		},

		metadata : {

			"abstract" : true,
			publicMethods : [
				// methods
				"getId", "setMessages", "attachMessageChange", "detachMessageChange"
		  ]
		}

	});


	/**
	 * Map of event names, that are provided by the MessageProcessor.
	 */
	MessageProcessor.M_EVENTS = {
		/**
		 * MessageChange should be fired when the MessageProcessor provides message changes
		 *
		 */
		messageChange : "messageChange"
	};

	/**
	 * The 'messageChange' event is fired, when the messages are changed
	 *
	 * @namesap.ui.core.messages.MessageProcessor#requestFailed
	 * @event
	 * @param {sap.ui.base.Event} oControlEvent
	 * @public
	 */

	/**
	 * Attach event-handler <code>fnFunction</code> to the 'messageChange' event of this <code>sap.ui.core.message.MessageProcessor</code>.<br/>
	 *
	 *
	 * @param {object}
	 *            [oData] The object, that should be passed along with the event-object when firing the event.
	 * @param {function}
	 *            fnFunction The function to call, when the event occurs. This function will be called on the
	 *            oListener-instance (if present) or in a 'static way'.
	 * @param {object}
	 *            [oListener] Object on which to call the given function. If empty, this MessageProcessor is used.
	 *
	 * @return {sap.ui.core.message.MessageProcessor} <code>this</code> to allow method chaining
	 * @public
	 */
	MessageProcessor.prototype.attachMessageChange = function(oData, fnFunction, oListener) {
		this.attachEvent("messageChange", oData, fnFunction, oListener);
		return this;
	};

	/**
	 * Detach event-handler <code>fnFunction</code> from the 'sap.ui.core.message.MessageProcessor' event of this <code>sap.ui.core.message.MessageProcessor</code>.<br/>
	 *
	 * The passed function and listener object must match the ones previously used for event registration.
	 *
	 * @param {function}
	 *            fnFunction The function to call, when the event occurs.
	 * @param {object}
	 *            oListener Object on which the given function had to be called.
	 * @return {sap.ui.core.message.MessageProcessor} <code>this</code> to allow method chaining
	 * @public
	 */
	MessageProcessor.prototype.detachMessageChange = function(fnFunction, oListener) {
		this.detachEvent("messageChange", fnFunction, oListener);
		return this;
	};

	/**
	 * Fire event messageChange to attached listeners.
	 *
	 * @param {object} [mArguments] the arguments to pass along with the event.
	 *
	 * @return {sap.ui.core.message.MessageProcessor} <code>this</code> to allow method chaining
	 * @protected
	 */
	MessageProcessor.prototype.fireMessageChange = function(mArguments) {
		this.fireEvent("messageChange", mArguments);
		return this;
	};
	// the 'abstract methods' to be implemented by child classes

	/**
	 * Implement in inheriting classes
	 * @abstract
	 *
	 * @name sap.ui.core.message.MessageProcessor.prototype.checkMessage
	 * @function
	 * @return {sap.ui.model.ListBinding}
	 * @public
	 */

	/**
	 * Implement in inheriting classes
	 * @abstract
	 *
	 * @name sap.ui.core.message.MessageProcessor.prototype.setMessages
	 * @function
	 * @param {map}
	 *         vMessages map of messages: {'target': [array of messages],...}
	 * @public
	 */

	/**
	 * Returns the ID of the MessageProcessor instance
	 * 
	 * @return {string} sId The MessageProcessor ID
	 * @public
	 */
	MessageProcessor.prototype.getId = function() {
		return this.id;
	};
	
	/**
	 * Destroys the MessageProcessor Instance
	 * @public
	 */
	MessageProcessor.prototype.destroy = function() {
		sap.ui.getCore().getMessageManager().unregisterMessageProcessor(this);
		EventProvider.prototype.destroy.apply(this, arguments);
	};
	
	return MessageProcessor;

});
