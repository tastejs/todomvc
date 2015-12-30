/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides class sap.ui.core.ws.WebSocket for WebSocket support with SAP-PCP Protocol
sap.ui.define(['jquery.sap.global', './WebSocket'],
	function(jQuery, WebSocket) {
	"use strict";

	/**
	 * Creates a new WebSocket connection and uses the pcp-protocol for communication.
	 *
	 * @param {string} sUrl relative or absolute URL for WebSocket connection.
	 * @param {array} [aProtocols] array of protocols as strings, a single protocol as a string.
	 * Protocol(s) should be selected from {@link sap.ui.core.ws.SapPcpWebSocket.SUPPORTED_PROTOCOLS}.
	 *
	 * @public
	 *
	 * @class WebSocket class implementing the pcp-protocol
	 * @extends sap.ui.core.ws.WebSocket
	 * @author SAP SE
	 * @version 1.32.9
	 * @alias sap.ui.core.ws.SapPcpWebSocket
	 */
	var SapPcpWebSocket = WebSocket.extend("sap.ui.core.ws.SapPcpWebSocket", /** @lends sap.ui.core.ws.SapPcpWebSocket.prototype */ {

		constructor: function(sUrl, aProtocols) {
			WebSocket.apply(this, arguments);
		}

	});

	/**
	 * The 'message' event is fired, when a message was received.
	 *
	 * @name sap.ui.core.ws.SapPcpWebSocket#message
	 * @event
	 * @param {sap.ui.base.Event} oControlEvent
	 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
	 * @param {object} oControlEvent.getParameters
	 * @param {string} oControlEvent.getParameters.data Received data from the server.
	 * @param {string} oControlEvent.getParameters.pcpFields Received pcpFields as a key-value map.
	 * @public
	 */

	/**
	 * Fire event 'message' to attached listeners.
	 *
	 * @param {object} [mArguments] the arguments to pass along with the event.
	 * @param {string} [mArguments.data] Received data from the server.
	 * @param {string} [mArguments.pcpFields] Received pcpFields as a key-value map.
	 * @return {sap.ui.core.ws.SapPcpWebSocket} <code>this</code> to allow method chaining
	 * @protected
	 * @name sap.ui.core.ws.SapPcpWebSocket#fireMessage
	 * @function
	 */

	/**
	 * @class Protocol versions.<br>
	 * One (or more) of these have to be selected to create a SapPcpWebSocket connection
	 * (or no protocol at all).
	 *
	 * @public
	 * @static
	 */
	SapPcpWebSocket.SUPPORTED_PROTOCOLS = {

		/**
		 * Protocol v10.pcp.sap.com
		 * @public
		 * @name sap.ui.core.ws.SapPcpWebSocket.SUPPORTED_PROTOCOLS.v10
		 */
		v10 : "v10.pcp.sap.com"

	};

	/**
	 * RegEx to get pcp-header fields
	 *
	 * @private
	 */
	SapPcpWebSocket._deserializeRegexp = /((?:[^:\\]|(?:\\.))+):((?:[^:\\\n]|(?:\\.))*)/;

	/**
	 * Separator between header-fields and message body
	 *
	 * @private
	 */
	SapPcpWebSocket._SEPARATOR = "\n\n";

	/**
	 * pcp-action value
	 *
	 * @private
	 */
	SapPcpWebSocket._MESSAGE = "MESSAGE";

	/**
	 * Internal handler for open-event.
	 *
	 * @private
	 */
	SapPcpWebSocket.prototype._onopen = function() {
		var bSuccess = false;

		if (this.getProtocol() === "") {
			bSuccess = true;
		} else {
			for (var protocol in SapPcpWebSocket.SUPPORTED_PROTOCOLS) {
				if (SapPcpWebSocket.SUPPORTED_PROTOCOLS.hasOwnProperty(protocol)) {
					if (SapPcpWebSocket.SUPPORTED_PROTOCOLS[protocol] === this.getProtocol()) {
						bSuccess = true;
						break;
					}
				}
			}
		}

		if (bSuccess) {
			this.fireOpen();
		} else {
			jQuery.sap.log.error("Unsupported protocol '" + this.getProtocol() + "' selected by the server. " +
				"Connection will be closed.");
			this.close("Unsupported protocol selected by the server");
		}

	};

	/**
	 * Internal handler for message-event.
	 *
	 * @private
	 */
	SapPcpWebSocket.prototype._onmessage = function(oMessageEvent) {
		var iSplitPos = -1,
			oEventData = {};

		if (typeof oMessageEvent.data === "string") {
			iSplitPos = oMessageEvent.data.indexOf(SapPcpWebSocket._SEPARATOR);
		}

		if (iSplitPos !== -1) {
			oEventData.pcpFields = this._extractPcpFields(oMessageEvent.data.substring(0, iSplitPos));
			oEventData.data = oMessageEvent.data.substr(iSplitPos + SapPcpWebSocket._SEPARATOR.length);
		} else {
			jQuery.sap.log.warning("Invalid PCP message received: " + oMessageEvent.data);
			oEventData.pcpFields = {};
			oEventData.data = oMessageEvent.data; // Fall back, just pass through original data
		}

		this.fireMessage(oEventData);
	};

	/**
	 * Extracts the pcp-fields from a header string.
	 *
	 * @param {string} sHeader Header as string
	 * @return {object} oPcpFields extracted fields as key-value map
	 * @private
	 */
	SapPcpWebSocket.prototype._extractPcpFields = function(sHeader) {
		var aFields = sHeader.split("\n"),
			aLine = [],
			oPcpFields = {};

		for (var i = 0; i < aFields.length; i++) {
			aLine = aFields[i].match(SapPcpWebSocket._deserializeRegexp);
			if (aLine && aLine.length === 3) {
				oPcpFields[this._unescape(aLine[1])] = this._unescape(aLine[2]);
			}
		}

		return oPcpFields;
	};

	/**
	 * Unescapes a string.
	 *
	 * @param {string} sEscaped escaped string
	 * @return sUnescaped Unescaped string
	 * @private
	 */
	SapPcpWebSocket.prototype._unescape = function(sEscaped) {
		var aParts = sEscaped.split("\u0008"),
			sUnescaped = "";

		for (var i = 0; i < aParts.length; i++) {
			aParts[i] = aParts[i].replace(/\\\\/g, "\u0008").replace(/\\:/g, ':').replace(/\\n/g, '\n').replace(/\u0008/g, "\\");
		}

		sUnescaped = aParts.join("\u0008");

		return sUnescaped;
	};

	/**
	 * Serializes pcp-fields into a string.
	 *
	 * @param {object} oPcpFields key-value map with pcp-fields
	 * @param {string} sMessageType message-type, one of 'string', 'blob' or 'arraybuffer'.
	 * @param {string} sPcpAction pcp-action value
	 * @return {string} serialized pcp-fields
	 * @private
	 */
	SapPcpWebSocket.prototype._serializePcpFields = function(oPcpFields, sMessageType, sPcpAction) {
		var oSerialized = "",
			sFieldName = "",
			sPcpBodyType = "";

		if (sMessageType === 'string') {
			sPcpBodyType = 'text';
		} else if (sMessageType === 'blob' || sMessageType === 'arraybuffer') {
			sPcpBodyType = 'binary';
		}

		if (oPcpFields && typeof oPcpFields === 'object') {
			for (sFieldName in oPcpFields) {
				if (oPcpFields.hasOwnProperty(sFieldName) && sFieldName.indexOf('pcp-') !== 0) {
					oSerialized += this._escape(sFieldName) + ":" + this._escape(String(oPcpFields[sFieldName])) + "\n";
				}
			}
		}

		return "pcp-action:" + sPcpAction + "\npcp-body-type:" + sPcpBodyType + "\n" + oSerialized + "\n";
	};

	/**
	 * Escapes a string.
	 *
	 * @param {string} sUnEscaped unescaped string
	 * @return {string} sEscaped escaped string
	 * @private
	 */
	SapPcpWebSocket.prototype._escape = function(sUnEscaped) {
		return sUnEscaped.replace(/\\/g, '\\\\').replace(/:/g, '\\:').replace(/\n/g, '\\n');
	};

	// Public Methods
	/**
	 * Sends a message and optional pcp-header-fields using the pcp-protocol.<br>
	 * <br>
	 * If the connection is not yet opened, the message will be queued and sent
	 * when the connection is established.
	 *
	 * @param {string|blob|arraybuffer} message message to send
	 * @param {object} [oPcpFields] additional pcp-fields as key-value map
	 * @return {sap.ui.core.ws.SapPcpWebSocket} <code>this</code> to allow method chaining
	 * @public
	 */
	SapPcpWebSocket.prototype.send = function(message, oPcpFields) {
		var sMessageType = typeof message,
			sPcpFields = "";

		sPcpFields = this._serializePcpFields(oPcpFields, sMessageType, SapPcpWebSocket._MESSAGE);

		WebSocket.prototype.send.call(this, sPcpFields + message);
		return this;
	};

	return SapPcpWebSocket;

});
