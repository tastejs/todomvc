/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides xml parsing and error checking functionality.
sap.ui.define(['jquery.sap.global', 'sap/ui/Device'],
	function(jQuery, Device) {
	"use strict";

	/*global ActiveXObject */
	/**
	 * Parses the specified XML formatted string text using native parsing
	 * function of the browser and returns a valid XML document. If an error
	 * occurred during parsing a parse error object is returned as property (parseError) of the
	 * returned XML document object. The parse error object has the following error
	 * information parameters: errorCode, url, reason, srcText, line, linepos, filepos
	 *
	 * @param {string}
	 *            sXMLText the XML data as string
	 * @return {object} the parsed XML document with a parseError property as described in
	 *         getParseError. An error occurred if the errorCode property of the parseError is != 0.
	 * @public
	 */
	jQuery.sap.parseXML = function parseXML(sXMLText) {
		var oXMLDocument;
		if (window.DOMParser) {
			var oParser = new DOMParser();
			try {
				oXMLDocument = oParser.parseFromString(sXMLText, "text/xml");
			} catch (e) {
				var oParseError = jQuery.sap.getParseError(oXMLDocument);
				oXMLDocument = {};
				oParseError.reason = e.message;
				oXMLDocument.parseError = oParseError;
				return oXMLDocument;
			}
		} else {
			oXMLDocument = new ActiveXObject("Microsoft.XMLDOM");
			oXMLDocument.async = false;
			oXMLDocument.loadXML(sXMLText);
		}
		var oParseError = jQuery.sap.getParseError(oXMLDocument);
		if (oParseError) {
			if (!oXMLDocument.parseError) {
				oXMLDocument.parseError = oParseError;
			}
		}
		return oXMLDocument;
	};

	/**
	 * Serializes the specified XML document into a string representation.
	 *
	 * @param {string}
	 *            oXMLDocument the XML document object to be serialized as string
	 * @return {object} the serialized XML string
	 * @public
	 */
	jQuery.sap.serializeXML = function serializeXML(oXMLDocument) {
		var sXMLString = "";
		if (window.ActiveXObject) {
			sXMLString = oXMLDocument.xml;
			if (sXMLString) {
				return sXMLString;
			}
		}
		if (window.XMLSerializer) {
			var serializer = new XMLSerializer();
			sXMLString = serializer.serializeToString(oXMLDocument);
		}
		return sXMLString;
	};

	jQuery.sap.isEqualNode = function(oNode1, oNode2) {
		if (oNode1 === oNode2) {
			return true;
		}
		if (!oNode1 || !oNode2) {
			return false;
		}
		if (oNode1.isEqualNode) {
			return oNode1.isEqualNode(oNode2);
		}
		if (oNode1.nodeType != oNode2.nodeType) {
			return false;
		}
		if (oNode1.nodeValue != oNode2.nodeValue) {
			return false;
		}
		if (oNode1.baseName != oNode2.baseName) {
			return false;
		}
		if (oNode1.nodeName != oNode2.nodeName) {
			return false;
		}
		if (oNode1.nameSpaceURI != oNode2.nameSpaceURI) {
			return false;
		}
		if (oNode1.prefix != oNode2.prefix) {
			return false;
		}
		if (oNode1.nodeType != 1) {
			return true; //ELEMENT_NODE
		}
		if (oNode1.attributes.length != oNode2.attributes.length) {
			return false;
		}
		for (var i = 0; i < oNode1.attributes.length; i++) {
			if (!jQuery.sap.isEqualNode(oNode1.attributes[i], oNode2.attributes[i])) {
				return false;
			}
		}
		if (oNode1.childNodes.length != oNode2.childNodes.length) {
			return false;
		}
		for (var i = 0; i < oNode1.childNodes.length; i++) {
			if (!jQuery.sap.isEqualNode(oNode1.childNodes[i], oNode2.childNodes[i])) {
				return false;
			}
		}
		return true;
	};


	/**
	 * Extracts parse error information from the specified document (if any). If
	 * an error was found the returned object has the following error
	 * information parameters: errorCode, url, reason, srcText, line, linepos,
	 * filepos
	 *
	 * @return oParseError if errors were found, or an object with an errorCode of 0 only
	 * @private
	 */
	jQuery.sap.getParseError = function getParseError(oDocument) {
		var oParseError = {
			errorCode : -1,
			url : "",
			reason : "unknown error",
			srcText : "",
			line : -1,
			linepos : -1,
			filepos : -1
		};

		// IE
		if (!!Device.browser.internet_explorer && oDocument && oDocument.parseError
				&& oDocument.parseError.errorCode != 0) {
			return oDocument.parseError;
		}

		// Firefox or Edge
		if ((!!Device.browser.firefox  || !!Device.browser.edge) && oDocument && oDocument.documentElement
				&& oDocument.documentElement.tagName == "parsererror") {

			var sErrorText = oDocument.documentElement.firstChild.nodeValue, rParserError = /XML Parsing Error: (.*)\nLocation: (.*)\nLine Number (\d+), Column (\d+):(.*)/;

			if (rParserError.test(sErrorText)) {
				oParseError.reason = RegExp.$1;
				oParseError.url = RegExp.$2;
				oParseError.line = parseInt(RegExp.$3, 10);
				oParseError.linepos = parseInt(RegExp.$4, 10);
				oParseError.srcText = RegExp.$5;

			}
			return oParseError;
		}

		// Safari
		if (!!Device.browser.webkit && oDocument && oDocument.documentElement
				&& oDocument.documentElement.tagName == "html"
				&& oDocument.getElementsByTagName("parsererror").length > 0) {

			var sErrorText = jQuery.sap.serializeXML(oDocument), rParserError = /error on line (\d+) at column (\d+): ([^<]*)/;

			if (rParserError.test(sErrorText)) {
				oParseError.reason = RegExp.$3;
				oParseError.url = "";
				oParseError.line = parseInt(RegExp.$1, 10);
				oParseError.linepos = parseInt(RegExp.$2, 10);
				oParseError.srcText = "";

			}
			return oParseError;
		}

		if (!oDocument || !oDocument.documentElement) {
			return oParseError;
		}

		return	{
				errorCode : 0
			};
	};

	return jQuery;

});
