/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides the implementation for a Message
sap.ui.define(['jquery.sap.global', 'sap/ui/base/Object', './MessageProcessor'],
	function(jQuery, Object, library, MessageProcessor) {
	"use strict";

	/**
	 *
	 * @namespace
	 * @name sap.ui.core.message
	 * @public
	 */

	/**
	 * Constructor for a new Message.
	 * @class
	 * @extends sap.ui.base.Object
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * 
	 * @param {object} [mParameters] (optional) a map which contains the following parameter properties:
	 * {string} [mParameters.id] The message id: will be defaulted if no id is set 
	 * {string} [mParameters.message] The message text
	 * {string} [mParameters.description] The message description
	 * {sap.ui.core.MessageType} [mParameters.type] The message type
	 * {string} [mParameters.code] The message code
	 * {sap.ui.core.message.Messageprocessor} [mParameters.processor]
	 * {string} [mParameters.target] The message target: The syntax MessageProcessor dependent. Read the documentation of the respective MessageProcessor.
	 * {boolean} [mParameters.persistent] Sets message persistent: If persistent is set true the message 
	 * lifecycle controlled by Application
	 * 
	 * @public
	 * @alias sap.ui.core.message.Message
	 */
	var Message = Object.extend("sap.ui.core.message.Message", /** @lends sap.ui.core.message.Message.prototype */ {

		constructor : function (mParameters) {
			Object.apply(this, arguments);
			
			this.id = mParameters.id ? mParameters.id : jQuery.sap.uid();
			this.message = mParameters.message;
			this.description = mParameters.description;
			this.descriptionUrl = mParameters.descriptionUrl;
			this.type = mParameters.type;
			this.code = mParameters.code;
			this.target = mParameters.target;
			this.processor = mParameters.processor;
			this.persistent = mParameters.persistent || false;
			this.technical = mParameters.technical || false;
			this.references = mParameters.references || {};
			
		}
	});
	
	/**
	 * Returns the Message Id
	 * 
	 *  @returns {string} id
	 */
	Message.prototype.getId = function() {
		return this.id;
	};
	
	/**
	 * Set message text
	 * 
	 * @param {string} sMessage The Message as text 
	 */
	Message.prototype.setMessage = function(sMessage) {
		this.message = sMessage;
	};
	
	/**
	 * Returns message text
	 * 
	 * @returns {string} message
	 */
	Message.prototype.getMessage = function() {
		return this.message;
	};
	
	/**
	 * Set message description
	 * 
	 * @param {string} sDescription The Message description 
	 */
	Message.prototype.setDescription = function(sDescription) {
		this.description = sDescription;
	};
	
	/**
	 * Returns the message description
	 * 
	 *  @returns {string} description
	 */
	Message.prototype.getDescription = function() {
		return this.description;
	};
	
	/**
	 * Returns the message description URL which should be used to download the description content
	 * 
	 *  @returns {string} The URL pointing to the description long text
	 */
	Message.prototype.getDescriptionUrl = function() {
		return this.descriptionUrl;
	};
	
	/**
	 * Set message description URL which should be used to download the description content
	 * 
	 * @param {string} sDescription The URL pointing to the description long text
	 */
	Message.prototype.setDescriptionUrl = function(sDescriptionUrl) {
		this.descriptionUrl = sDescriptionUrl;
	};

	/**
	 * Set message type
	 * 
	 * @param {sap.ui.core.MessageType} sType The Message type 
	 */
	Message.prototype.setType = function(sType) {
		if (sType in sap.ui.core.MessageType) {
			this.type = sType;
		} else {
			jQuery.sap.log.error("MessageType must be of type sap.ui.core.MessageType");
		}
	};
	
	/**
	 * Returns the message type
	 * 
	 *  @returns {sap.ui.core.MessageType} type
	 */
	Message.prototype.getType = function() {
		return this.type;
	};
	
	/**
	 * Set message target: The syntax MessageProcessor dependent. See the documentation of the
	 * respective MessageProcessor.
	 * 
	 * @param {string} sTarget The Message target 
	 */
	Message.prototype.setTarget = function(sTarget) {
		this.target = sTarget;
	};

	/**
	 * Returns the message target
	 * 
	 *  @returns {string} target
	 */
	Message.prototype.getTarget = function() {
		return this.target;
	};
	
	/**
	 * Set message processor
	 * 
	 * @param {sap.ui.core.message.MessageProcessor} oMessageProcessor The Message processor 
	 */
	Message.prototype.setMessageProcessor = function(oMessageProcessor) {
		if (oMessageProcessor instanceof MessageProcessor) {
			this.processor = oMessageProcessor;
		} else {
			jQuery.sap.log.error("MessageProcessor must be an instance of sap.ui.core.message.MessageProcessor");
		}
	};
	
	/**
	 * Returns the message processor
	 * 
	 *  @returns {sap.ui.core.message.MessageProcessor} processor
	 */
	Message.prototype.getMessageProcessor = function() {
		return this.processor;
	};
	
	/**
	 * Set message code
	 * 
	 * @param {string} sCode The Message code 
	 */
	Message.prototype.setCode = function(sCode) {
		this.code = sCode;
	};
	
	/**
	 * Returns the message code
	 * 
	 *  @returns {string} code
	 */
	Message.prototype.getCode = function() {
		return this.code;
	};
	
	/**
	 * Set message persistent
	 * 
	 * @param {boolean} bPersistent Set Message persistent: If persisten is set true the message 
	 * lifecycle controlled by Application
	 */
	Message.prototype.setPersistent = function(bPersistent) {
		this.persistent = bPersistent;
	};
	
	/**
	 * Returns the if Message is persistent
	 * 
	 *  @returns {boolean} bPersistent
	 */
	Message.prototype.getPersistent = function() {
		return this.persistent;
	};
	
	/**
	 * Set message as technical message
	 * 
	 * @param {boolean} bTechnical Set Message as technical message
	 * lifecycle controlled by Application
	 */
	Message.prototype.setTechnical = function(bTechnical) {
		this.technical = bTechnical;
	};
	
	/**
	 * Returns the if Message set as technical message
	 * 
	 *  @returns {boolean} bTechnical 
	 */
	Message.prototype.getTechnical = function() {
		return this.technical;
	};
	
	Message.prototype.addReference = function(sId, sProperty) {
		if (!sId) {
			return;
		}
		if (!this.references[sId]) {
			this.references[sId] = {
				properties: {}
			};
		}
		if (!this.references[sId].properties[sProperty]) {
			this.references[sId].properties[sProperty] = true; 
		}
	};
	
	Message.prototype.removeReference = function(sId, sProperty) {
		if (!sId) {
			return;
		}
		if (sId in this.references) {
			if (!sProperty) {
				delete this.references[sId];
			} else {
				if (this.references[sId].properties[sProperty]) {
					delete this.references[sId].properties[sProperty];
				}
			}
		}
	};
	
	return Message;

});
