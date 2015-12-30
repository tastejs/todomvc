/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(["jquery.sap.global", "sap/ui/Device", "sap/ui/core/library", "sap/ui/thirdparty/URI", "sap/ui/core/message/MessageParser", "sap/ui/core/message/Message"],
	function(jQuery, Device, coreLibrary, URI, MessageParser, Message) {
	"use strict";

/**
 * This map is used to translate back-end response severity values to the values defined in the
 * enumeration sap.ui.core.MessageType
 * @see sap.ui.core.ValueState
 */
var mSeverityMap = {
	"error":   sap.ui.core.MessageType.Error,
	"warning": sap.ui.core.MessageType.Warning,
	"success": sap.ui.core.MessageType.Success,
	"info":    sap.ui.core.MessageType.Information
};

/**
 * A plain error object as returned by the server. Either "@sap-severity"- or "severity"-property
 * must be set.
 *
 * @typedef {object} ODataMessageParser~ServerError
 * @property {string} target - The target entity path for which the message is meant
 * @property {string} message - The error message description
 * @property {string} code - The error code (message)
 * @property {string} [@sap-severity] - The level of the error (alternatively in v2: oMessageObject.severity) can be one of "success", "info", "warning", "error"
 * @property {string} [severity] - The level of the error (alternatively in v4: oMessageObject.@sap-severity) can be one of "success", "info", "warning", "error"
 */

/**
 * A map containing the relevant request-URL and (if available) the request and response objects
 *
 * @typedef {map} ODataMessageParser~RequestInfo
 * @property {string} url - The URL of the request
 * @property {object} request - The request object
 * @property {object} response - The response object
 */

/**
 * A map containing a parsed URL
 *
 * @typedef {map} ODataMessageParser~UrlInfo
 * @property {string} url - The URL, stripped of query and hash
 * @property {map} parameters - A map of the query parameters
 * @property {string} hash - The hash value of the URL
 */


/**
 * 
 * @namespace
 * @name sap.ui.model.odata
 * @public
 */

/**
 * OData implementation of the sap.ui.core.message.MessageParser class. Parses message responses from the back-end.
 * 
 * @class
 * @classdesc 
 *   OData implementation of the sap.ui.core.message.MessageParser class. Parses message responses from the back-end.
 * @extends sap.ui.core.message.MessageParser
 *
 * @author SAP SE
 * @version 1.32.9
 * @public
 * @abstract
 * @alias sap.ui.model.odata.ODataMessageParser
 */
var ODataMessageParser = MessageParser.extend("sap.ui.model.odata.ODataMessageParser", {
	metadata: {
		publicMethods: [ "parse", "setProcessor", "getHeaderField", "setHeaderField" ]
	},

	constructor: function(sServiceUrl, oMetadata) {
		MessageParser.apply(this);
		this._serviceUrl = getRelativeServerUrl(this._parseUrl(sServiceUrl).url);
		this._metadata = oMetadata;
		this._processor = null;
		this._headerField = "sap-message"; // Default header field
		this._lastMessages = [];
	}
});


////////////////////////////////////////// Public Methods //////////////////////////////////////////

/**
 * Returns the name of the header field that is used to parse the server messages
 *
 * @return {string} The name of the header field
 * @public
 */
ODataMessageParser.prototype.getHeaderField = function() {
	return this._headerField;
};

/**
 * Sets the header field name that should be used for parsing the JSON messages
 *
 * @param {string} sFieldName - The name of the header field that should be used as source of the message object
 * @return {sap.ui.model.odata.ODataMessageParser} Instance reference for method chaining
 * @public
 */
ODataMessageParser.prototype.setHeaderField = function(sFieldName) {
	this._headerField = sFieldName;
	return this;
};


/**
 * Parses the given response for messages, calculates the delta and fires the messageChange-event
 * on the MessageProcessor if messages are found.
 *
 * @param {object} oResponse - The response from the server containing body and headers
 * @param {object} oRequest - The original request that lead to this response
 * @param {map} mGetEntities - A map containing the entities requested from the back-end as keys
 * @param {map} mChangeEntities - A map containing the entities changed on the back-end as keys
 * @return {void}
 * @public
 */
ODataMessageParser.prototype.parse = function(oResponse, oRequest, mGetEntities, mChangeEntities) {
	// TODO: Implement filter function
	var aMessages = [];

	var mRequestInfo = {
		url: oRequest ? oRequest.requestUri : oResponse.requestUri,
		request: oRequest,
		response: oResponse
	};

	if (oResponse.statusCode >= 200 && oResponse.statusCode < 300) {
		// Status is 2XX - parse headers
		this._parseHeader(/* ref: */ aMessages, oResponse, mRequestInfo);
	} else if (oResponse.statusCode >= 400 && oResponse.statusCode < 600) {
		// Status us 4XX or 5XX - parse body
		this._parseBody(/* ref: */ aMessages, oResponse, mRequestInfo);
	} else {
		// Status neither ok nor error - I don't know what to do
		// TODO: Maybe this is ok and should be silently ignored...?
		jQuery.sap.log.warning(
			"No rule to parse OData response with status " + oResponse.statusCode + " for messages"
		);
	}

	if (this._processor) {
		this._propagateMessages(aMessages, mRequestInfo, mGetEntities, mChangeEntities);
	} else {
		// In case no message processor is attached, at least log to console.
		// TODO: Maybe we should just output an error an do nothing, since this is not how messages are meant to be used like?
		this._outputMesages(aMessages);
	}
};


////////////////////////////////////////// onEvent Methods /////////////////////////////////////////


////////////////////////////////////////// Private Methods /////////////////////////////////////////

/**
 * Parses the request URL as well as all message targets for paths that are affected, i.e. which have messages meaning
 * that currently available messages for that path will be replaced with the new ones
 *
 * @param {sap.ui.core.message.Message[]} aMessages - All messaged returned from the back-end in this request
 * @param {string} sRequestUri - The request URL
 * @param {map} mGetEntities - A map containing the entities requested from the back-end as keys
 * @param {map} mChangeEntities - A map containing the entities changed on the back-end as keys
 * @returns {map} A map of affected targets where every affected target
 */
ODataMessageParser.prototype._getAffectedTargets = function(aMessages, sRequestUri, mGetEntities, mChangeEntities) {
	var mAffectedTargets = jQuery.extend({
		"": true // Allow global messages by default
	}, mGetEntities, mChangeEntities);

	// Get EntitySet for Requested resource
	var sRequestTarget = this._parseUrl(sRequestUri).url;
	if (sRequestTarget.indexOf(this._serviceUrl) === 0) {
		// This is an absolute URL, remove the service part at the front
		sRequestTarget = sRequestTarget.substr(this._serviceUrl.length + 1);
	}
	
	var mEntitySet = this._metadata._getEntitySetByPath(sRequestTarget);
	if (mEntitySet) {
		mAffectedTargets[mEntitySet.name] = true;
	}
	
	
	// Get the EntitySet for every single target
	for (var i = 0; i < aMessages.length; ++i) {
		var sTarget = aMessages[i].getTarget();

		if (sTarget) {
			// Add all "parents" of the current target to the list of affected targets
			var sTrimmedTarget = sTarget.replace(/^\/+|\/$/g, "");
			mAffectedTargets[sTrimmedTarget] = true;
			var iPos = sTrimmedTarget.lastIndexOf("/");
			while (iPos > -1) {
				sTrimmedTarget = sTrimmedTarget.substr(0, iPos);
				mAffectedTargets[sTrimmedTarget] = true;
				iPos = sTrimmedTarget.lastIndexOf("/");
			}
			
			// Add the Entityset itself
			mEntitySet = this._metadata._getEntitySetByPath(sTarget);
			if (mEntitySet) {
				mAffectedTargets[mEntitySet.name] = true;
			}
		}
	}
	
	return mAffectedTargets;
};

/**
 * This method calculates the message delta and gives it to the MessageProcessor (fires the
 * messageChange-event) based on the entities belonging to this request.
 *
 * @param {sap.ui.core.message.Message[]} aMessages - All messaged returned from the back-end in this request
 * @param {ODataMessageParser~RequestInfo} mRequestInfo - Info object about the request URL
 * @param {map} mGetEntities - A map containing the entities requested from the back-end as keys
 * @param {map} mChangeEntities - A map containing the entities changed on the back-end as keys
 * @return {void}
 */
ODataMessageParser.prototype._propagateMessages = function(aMessages, mRequestInfo, mGetEntities, mChangeEntities) {
	var i, sTarget;

	var mAffectedTargets = this._getAffectedTargets(aMessages, mRequestInfo.url, mGetEntities, mChangeEntities);
	
	var aRemovedMessages = [];
	var aKeptMessages = [];
	for (i = 0; i < this._lastMessages.length; ++i) {
		// Note: mGetEntities and mChangeEntities contain the keys without leading or trailing "/", so all targets must 
		// be trimmed here
		sTarget = this._lastMessages[i].getTarget().replace(/^\/+|\/$/g, "");

		// Get entity for given target (properties are not affected targets as all messages must be sent for affected entity)
		var iPropertyPos = sTarget.lastIndexOf(")/");
		if (iPropertyPos > 0) {
			sTarget = sTarget.substr(0, iPropertyPos + 1);
		}

		if (mAffectedTargets[sTarget]) {
			// Message belongs to targets handled/requested by this request
			aRemovedMessages.push(this._lastMessages[i]);
		} else {
			// Message is not affected, i.e. should stay
			aKeptMessages.push(this._lastMessages[i]);
		}
	}

	this.getProcessor().fireMessageChange({
		oldMessages: aRemovedMessages,
		newMessages: aMessages
	});

	this._lastMessages = aKeptMessages.concat(aMessages);
};

/**
 * Creates a sap.ui.core.message.Message from the given JavaScript object
 *
 * @param {ODataMessageParser~ServerError} oMessageObject - The object containing the message data
 * @param {ODataMessageParser~RequestInfo} mRequestInfo - Info object about the request URL
 * @param {boolean} bIsTechnical - Whether this is a technical error (like 404 - not found)
 * @return {sap.ui.core.message.Message} The message for the given error
 */
ODataMessageParser.prototype._createMessage = function(oMessageObject, mRequestInfo, bIsTechnical) {
	var sType = oMessageObject["@sap.severity"]
		? oMessageObject["@sap.severity"]
		: oMessageObject["severity"];
	// Map severity value to value defined in sap.ui.core.ValueState, use actual value if not found
	sType = mSeverityMap[sType] ? mSeverityMap[sType] : sType;

	var sCode = oMessageObject.code ? oMessageObject.code : "";

	var sText = typeof oMessageObject["message"] === "object" && oMessageObject["message"]["value"]
		? oMessageObject["message"]["value"]
		: oMessageObject["message"];

	var sDescriptionUrl = oMessageObject.longtext_url ? oMessageObject.longtext_url : "";

	var sTarget = this._createTarget(oMessageObject, mRequestInfo);

	return new Message({
		type:      sType,
		code:      sCode,
		message:   sText,
		descriptionUrl: sDescriptionUrl,
		target:    sTarget,
		processor: this._processor,
		technical: bIsTechnical
	});
};

/**
 * Returns the path of the Entity affected by the given FunctionImport. It either uses the location header sent by the 
 * back-end or if none is sent tries to construct the correct URL from the metadata information about the function.
 * In case the URL of the target is built using only one key, the parameter-name is removed from the URL.
 * Example, if there are two keys "A" and "B", the URL mitgt look like this: "/List(A=1,B=2)" in case there is only one
 * key named "A", the URL would be "/List(1)"
 *
 * @param {map} mFunctionInfo - Function information map as returned by sap.ui.model.odata.ODataMetadata._getFunctionImportMetadata
 * @param {ODataMessageParser~RequestInfo} mRequestInfo - Map containing information about the current request
 * @param {ODataMessageParser~UrlInfo} mUrlData - Map containing parsed URL information as returned by sap.ui.mode.odata.ODataMessageParser._parseUrl
 * @returns {string} The Path to the affected entity
 */
ODataMessageParser.prototype._getFunctionTarget = function(mFunctionInfo, mRequestInfo, mUrlData) {
	var sTarget = "";
	
	var i;
	
	// In case of a function import the location header may point to the corrrect entry in the service.
	// This should be the case for writing/changing operations using POST
	if (mRequestInfo.response && mRequestInfo.response.headers && mRequestInfo.response.headers["location"]) {
		sTarget = mRequestInfo.response.headers["location"];
		
		var iPos = sTarget.lastIndexOf(this._serviceUrl);
		if (iPos > -1) {
			sTarget = sTarget.substr(iPos + this._serviceUrl.length);
		}
	} else {
		
		// Search for "action-for" annotation
		var sActionFor = null;
		if (mFunctionInfo.extensions) {
			for (i = 0; i < mFunctionInfo.extensions.length; ++i) {
				if (mFunctionInfo.extensions[i].name === "action-for") {
					sActionFor = mFunctionInfo.extensions[i].value;
					break;
				}
			}
		}
		
		var mEntityType;
		if (sActionFor) {
			mEntityType = this._metadata._getEntityTypeByName(sActionFor);
		} else if (mFunctionInfo.entitySet) {
			mEntityType = this._metadata._getEntityTypeByPath(mFunctionInfo.entitySet);
		} else if (mFunctionInfo.returnType) {
			mEntityType = this._metadata._getEntityTypeByName(mFunctionInfo.returnType);
		}
		
		var mEntitySet = this._metadata._getEntitySetByType(mEntityType);
		
		if (mEntitySet && mEntityType && mEntityType.key && mEntityType.key.propertyRef) {
			
			var sId = "";
			var sParam;

			if (mEntityType.key.propertyRef.length === 1) {
				// Just the ID in brackets
				sParam = mEntityType.key.propertyRef[0].name;
				if (mUrlData.parameters[sParam]) {
					sId = mUrlData.parameters[sParam];
				}
			} else {
				// Build ID string from keys
				var aKeys = [];
				for (i = 0; i < mEntityType.key.propertyRef.length; ++i) {
					sParam = mEntityType.key.propertyRef[i].name;
					if (mUrlData.parameters[sParam]) {
						aKeys.push(sParam + "=" + mUrlData.parameters[sParam]);
					}
				}
				sId = aKeys.join(",");
			}
			
			sTarget = "/" + mEntitySet.name + "(" + sId + ")";
		} else if (!mEntitySet) {
			jQuery.sap.log.error("Could not determine path of EntitySet for function call: " + mUrlData.url);
		} else {
			jQuery.sap.log.error("Could not determine keys of EntityType for function call: " + mUrlData.url);
		}
	}

	return sTarget;
};


/**
 * Creates an absolute target URL (relative to the service URL) from the given message-object and
 * the Response. It uses the service-URL to extract the base URI of the message from the response-
 * URI and appends the target if the target was not specified as absolute path (with leading "/")
 *
 * @param {ODataMessageParser~ServerError} oMessageObject - The object containing the message data
 * @param {ODataMessageParser~RequestInfo} mRequestInfo - Map containing information about the current request
 * @return {string} The actual target string
 * @private
 */
ODataMessageParser.prototype._createTarget = function(oMessageObject, mRequestInfo) {
	var sTarget = "";

	if (oMessageObject.target) {
		sTarget = oMessageObject.target;
	} else if (oMessageObject.propertyref) {
		sTarget = oMessageObject.propertyref;
	}

	if (sTarget.substr(0, 1) !== "/") {
		var sRequestTarget = "";

		var mUrlData = this._parseUrl(mRequestInfo.url);
		var sUrl = mUrlData.url;
		
		var iPos = sUrl.lastIndexOf(this._serviceUrl);
		if (iPos > -1) {
			sRequestTarget = sUrl.substr(iPos + this._serviceUrl.length + 1);
		} else {
			sRequestTarget = sUrl;
		}

		var sMethod = (mRequestInfo.request && mRequestInfo.request.method) ? mRequestInfo.request.method : "GET";
		var mFunctionInfo = this._metadata._getFunctionImportMetadata(sRequestTarget, sMethod);

		if (mFunctionInfo) {
			sRequestTarget = this._getFunctionTarget(mFunctionInfo, mRequestInfo, mUrlData);

			if (sTarget) {
				sTarget = sRequestTarget + "/" + sTarget;
			} else {
				sTarget = sRequestTarget;
			}
			
		} else {
			sRequestTarget = "/" + sRequestTarget;

			// If sRequestTarget is a collection, we have to add the target without a "/". In this case
			// a target would start with the specific product (like "(23)"), but the request itself
			// would not have the brackets
			var iSlashPos = sRequestTarget.lastIndexOf("/");
			var sRequestTargetName = iSlashPos > -1 ? sRequestTarget.substr(iSlashPos) : sRequestTarget;
			if (sRequestTargetName.indexOf("(") > -1) {
				// It is an entity
				sTarget = sRequestTarget + "/" + sTarget;
			} else {
				// It's a collection
				sTarget = sRequestTarget + sTarget;
			}
		}
		

	} /* else {
		// Absolute target path, do not use base URL
	} */

	return sTarget;
};

/**
 * Parses the header with the set headerField and tries to extract the messages from it.
 *
 * @param {sap.ui.core.message.Message[]} aMessages - The Array into which the new messages are added
 * @param {object} oResponse - The response object from which the headers property map will be used
 * @param {ODataMessageParser~RequestInfo} mRequestInfo - Info object about the request URL
 *
 */
ODataMessageParser.prototype._parseHeader = function(/* ref: */ aMessages, oResponse, mRequestInfo) {
	var sField = this.getHeaderField();
	if (!oResponse.headers || !oResponse.headers[sField]) {
		// No header set, nothing to process
		return;
	}

	var sMessages = oResponse.headers[sField];
	var oServerMessage = null;

	try {
		oServerMessage = JSON.parse(sMessages);

		aMessages.push(this._createMessage(oServerMessage, mRequestInfo));

		if (oServerMessage.details && jQuery.isArray(oServerMessage.details)) {
			for (var i = 0; i < oServerMessage.details.length; ++i) {
				aMessages.push(this._createMessage(oServerMessage.details[i], mRequestInfo));
			}
		}

	} catch (ex) {
		jQuery.sap.log.error("The message string returned by the back-end could not be parsed");
		return;
	}
};

/**
 * Parses the body of the request and tries to extract the messages from it.
 *
 * @param {sap.ui.core.message.Message[]} aMessages - The Array into which the new messages are added
 * @param {object} oResponse - The response object from which the body property will be used
 * @param {ODataMessageParser~RequestInfo} mRequestInfo - Info object about the request URL
 */
ODataMessageParser.prototype._parseBody = function(/* ref: */ aMessages, oResponse, mRequestInfo) {
	// TODO: The main error object does not support "target". Find out how to proceed with the main error information (ignore/add without target/add to all other errors)

	var sContentType = getContentType(oResponse);
	if (sContentType && sContentType.indexOf("xml") > -1) {
		// XML response
		this._parseBodyXML(/* ref: */ aMessages, oResponse, mRequestInfo, sContentType);
	} else {
		// JSON response
		this._parseBodyJSON(/* ref: */ aMessages, oResponse, mRequestInfo);
	}
	
	// Messages from an error response should contain duplicate messages - the main error should be the
	// same as the first errordetail error. If this is the case, remove the first one.
	// TODO: Check if this is actually correct, and if so, check if the below check can be improved
	if (aMessages.length > 1) {
		if (
			aMessages[0].getCode()    == aMessages[1].getCode()    &&
			aMessages[0].getMessage() == aMessages[1].getMessage()
		) {
			aMessages.shift();
		}
	}
};


/**
 * Parses the body of a JSON request and tries to extract the messages from it.
 *
 * @param {sap.ui.core.message.Message[]} aMessages - The Array into which the new messages are added
 * @param {object} oResponse - The response object from which the body property will be used
 * @param {ODataMessageParser~RequestInfo} mRequestInfo - Info object about the request URL
 * @param {string} sContentType - The content type of the response (for the XML parser)
 * @return {void}
 */
ODataMessageParser.prototype._parseBodyXML = function(/* ref: */ aMessages, oResponse, mRequestInfo, sContentType) {
	try {
		// TODO: I do not have a v4 service to test this with.

		var oDoc = new DOMParser().parseFromString(oResponse.body, sContentType);
		var aElements = getAllElements(oDoc, [ "error", "errordetail" ]);
		for (var i = 0; i < aElements.length; ++i) {
			var oNode = aElements[i];

			var oError = {};
			// Manually set severity in case we get an error response
			oError["severity"] = sap.ui.core.MessageType.Error;

			for (var n = 0; n < oNode.childNodes.length; ++n) {
				var oChildNode = oNode.childNodes[n];
				var sChildName = oChildNode.nodeName;

				if (sChildName === "errordetails" || sChildName === "details" || sChildName === "innererror" || sChildName === "#text") {
					// Ignore known children that contain other errors
					continue;
				}

				if (sChildName === "message" && oChildNode.hasChildNodes() && oChildNode.firstChild.nodeType !== window.Node.TEXT_NODE) {
					// Special case for v2 error message - the message is in the child node "value"
					for (var m = 0; m < oChildNode.childNodes.length; ++m) {
						if (oChildNode.childNodes[m].nodeName === "value") {
							oError["message"] = oChildNode.childNodes[m].text || oChildNode.childNodes[m].textContent;
						}
					}
				} else {
					oError[oChildNode.nodeName] = oChildNode.text || oChildNode.textContent;
				}
			}

			aMessages.push(this._createMessage(oError, mRequestInfo, true));
		}
	} catch (ex) {
		jQuery.sap.log.error("Error message returned by server could not be parsed");
	}
};

/**
 * Parses the body of a JSON request and tries to extract the messages from it.
 *
 * @param {sap.ui.core.message.Message[]} aMessages - The Array into which the new messages are added
 * @param {object} oResponse - The response object from which the body property will be used
 * @param {ODataMessageParser~RequestInfo} mRequestInfo - Info object about the request URL
 * @return {void}
 */
ODataMessageParser.prototype._parseBodyJSON = function(/* ref: */ aMessages, oResponse, mRequestInfo) {
	try {
		var oErrorResponse = JSON.parse(oResponse.body);

		var oError;
		if (oErrorResponse["error"]) {
			// v4 response according to OData specification or v2 response according to MS specification and SAP message specification
			oError = oErrorResponse["error"];
		} else {
			// Actual v2 response in some tested services
			oError = oErrorResponse["odata.error"];
		}

		if (!oError) {
			jQuery.sap.log.error("Error message returned by server did not contain error-field");
			return;
		}

		// Manually set severity in case we get an error response
		oError["severity"] = sap.ui.core.MessageType.Error;

		aMessages.push(this._createMessage(oError, mRequestInfo, true));

		// Check if more than one error has been returned from the back-end
		var aFurtherErrors = null;
		if (jQuery.isArray(oError.details)) {
			// v4 errors
			aFurtherErrors = oError.details;
		} else if (oError.innererror && jQuery.isArray(oError.innererror.errordetails)) {
			// v2 errors
			aFurtherErrors = oError.innererror.errordetails;
		} else {
			// No further errors
			aFurtherErrors = [];
		}

		for (var i = 0; i < aFurtherErrors.length; ++i) {
			aMessages.push(this._createMessage(aFurtherErrors[i], mRequestInfo, true));
		}
	} catch (ex) {
		jQuery.sap.log.error("Error message returned by server could not be parsed");
	}
};

/**
 * Parses the URL into an info map containing the url, the parameters and the has in its properties
 *
 * @param {string} sUrl - The URL to be stripped
 * @returns {ODataMessageParser~UrlInfo} An info map about the parsed URL
 * @private
 */
ODataMessageParser.prototype._parseUrl = function(sUrl) {
	var mUrlData = {
		url: sUrl,
		parameters: {},
		hash: ""
	};
	
	var iPos = -1;

	iPos = sUrl.indexOf("#");
	if (iPos > -1) {
		mUrlData.hash = mUrlData.url.substr(iPos + 1); 
		mUrlData.url = mUrlData.url.substr(0, iPos);
	}

	iPos = sUrl.indexOf("?");
	if (iPos > -1) {
		var sParameters = mUrlData.url.substr(iPos + 1);
		mUrlData.parameters = URI.parseQuery(sParameters);
		mUrlData.url = mUrlData.url.substr(0, iPos);
	}

	return mUrlData;
};

/**
 * Outputs messages to the browser console. This is a fallback for when there is no MessageProcessor
 * attached to this parser. This should not happen in standard cases, as the ODataModel registers
 * itself as MessageProcessor. Only if used stand-alone, this can at least prevent the messages
 * from being ignored completely.
 *
 * @param {sap.ui.message.Message[]} aMessages - The messages to be displayed on the console
 * @private
 */
ODataMessageParser.prototype._outputMesages = function(aMessages) {
	for (var i = 0; i < aMessages.length; ++i) {
		var oMessage = aMessages[i];
		var sOutput = "[OData Message] " + oMessage.getMessage() + " - " + oMessage.getDescription() + " (" + oMessage.getTarget() + ")";
		switch (aMessages[i].getType()) {
			case sap.ui.core.MessageType.Error:
				jQuery.sap.log.error(sOutput);
				break;

			case sap.ui.core.MessageType.Warning:
				jQuery.sap.log.warning(sOutput);
				break;

			case sap.ui.core.MessageType.Success:
				jQuery.sap.log.debug(sOutput);
				break;

			case sap.ui.core.MessageType.Information:
			case sap.ui.core.MessageType.None:
			default:
				jQuery.sap.log.info(sOutput);
				break;
		}
	}
};

///////////////////////////////////////// Hidden Functions /////////////////////////////////////////


/**
 * Returns the content-type header of the given response, it searches in a case-insentitive way for
 * the header
 *
 * @param {object} oResponse - The response object from which the body property will be used
 * @return {string|false} Either the content-type header content or false if none is found
 * @private
 */
function getContentType(oResponse) {
	if (oResponse && oResponse.headers) {
		for (var sHeader in oResponse.headers) {
			if (sHeader.toLowerCase() === "content-type") {
				return oResponse.headers[sHeader].replace(/([^;]*);.*/, "$1");
			}
		}
	}
	return false;
}

/**
 * Local helper element used to determine the path of a URL relative to the server
 *
 * @type {HTMLAnchorElement}
 */
var oLinkElement = document.createElement("a");
/**
 * Returns the URL relative to the host (i.e. the absolute path on the server) for the given URL
 * 
 * @param {string} sUrl - The URL to be converted
 * @returns {string} The server-relative URL
 */
function getRelativeServerUrl(sUrl) {
	oLinkElement.href = sUrl;
	return URI.parse(oLinkElement.href).path;
}

/**
 * Returns all elements in the given document (or node) that match the given elementnames
 *
 * @param {Node} oDocument - The start node from where to search for elements
 * @param {string[]} aElementNames - The names of the elements to search for
 * @returns {HTMLElement[]} The matching elements
 * @private
 */
function getAllElements(oDocument, aElementNames) {
	var aElements = [];
	
	var mElementNames = {};
	for (var i = 0; i < aElementNames.length; ++i) {
		mElementNames[aElementNames[i]] = true;
	}
	
	var oElement = oDocument;
	while (oElement) {
		if (mElementNames[oElement.tagName]) {
			aElements.push(oElement);
		}
		
		if (oElement.hasChildNodes()) {
			oElement = oElement.firstChild;
		} else {
			while (!oElement.nextSibling) {
				oElement = oElement.parentNode;
				
				if (!oElement || oElement === oDocument) {
					oElement = null;
					break;
				}
			}
			if (oElement) {
				oElement = oElement.nextSibling;
			}
		}
	}
	
	return aElements;
}

//////////////////////////////////////// Overridden Methods ////////////////////////////////////////

return ODataMessageParser;

});
