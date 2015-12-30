/*!
* UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
*/

sap.ui.define(function () {
	"use strict";

	/**
	 * MessageStrip utilities.
	 * @namespace
	 */
	var MessageStripUtilities = {};

	MessageStripUtilities.MESSAGES = {
		TYPE_NOT_SUPPORTED: "Value 'sap.ui.core.MessageType.None' for property 'type' is not supported." +
		"Defaulting to 'sap.ui.core.MessageType.Information'"
	};

	MessageStripUtilities.CLASSES = {
		ROOT: "sapMMsgStrip",
		ICON: "sapMMsgStripIcon",
		MESSAGE: "sapMMsgStripMessage",
		CLOSE_BUTTON: "sapMMsgStripCloseButton",
		CLOSING_TRANSITION: "sapMMsgStripClosing"
	};

	MessageStripUtilities.ATTRIBUTES = {
		CLOSABLE: "data-sap-ui-ms-closable"
	};

	MessageStripUtilities.RESOURCE_BUNDLE = sap.ui.getCore().getLibraryResourceBundle("sap.ui.core");

	/**
	 * Calculate the icon uri that should be set to the control property.
	 * Custom icons are allowed for all message types.
	 * If no custom icon is specified a default one is used.
	 * is defined by the control type.
	 * @private
	 * @returns {string} the icon uri that should be set to the control property
	 */
	MessageStripUtilities.getIconURI = function () {
		var sType = this.getType(),
			sCustomIconURI = this.getCustomIcon(),
			sIconURI = "sap-icon://message-" + sType.toLowerCase();

		return sCustomIconURI || sIconURI;
	};

	MessageStripUtilities.getAriaTypeText = function () {
		var sBundleKey = "MESSAGE_STRIP_" + this.getType().toUpperCase(),
			sAriaText = MessageStripUtilities.RESOURCE_BUNDLE.getText(sBundleKey);

		if (this.getShowCloseButton()) {
			sAriaText += " " + MessageStripUtilities.RESOURCE_BUNDLE.getText("MESSAGE_STRIP_CLOSABLE");
		}

		return sAriaText;
	};

	MessageStripUtilities.handleMSCloseButtonInteraction = function (oEvent) {
		if (MessageStripUtilities.isMSCloseButtonPressed(oEvent.target)) {
			this.close();
		}
	};

	MessageStripUtilities.isMSCloseButtonPressed = function (oTarget) {
		return oTarget.className.indexOf(MessageStripUtilities.CLASSES.CLOSE_BUTTON) !== -1 ||
			oTarget.parentNode.className.indexOf(MessageStripUtilities.CLASSES.CLOSE_BUTTON) !== -1;
	};

	MessageStripUtilities.closeTransitionWithJavascript = function (fnCallback) {
		this.$().animate({opacity: 0}, {
			duration: 200,
			complete: fnCallback
		});
	};

	MessageStripUtilities.closeTransitionWithCSS = function (fnCallback) {
		this.$().addClass(MessageStripUtilities.CLASSES.CLOSING_TRANSITION)
				.one("webkitTransitionEnd transitionend", fnCallback);
	};

	MessageStripUtilities.getAccessibilityState = function () {
		return {
			role: "note",
			live: "assertive",
			labelledby: this.getId()
		};
	};

	return MessageStripUtilities;
});
