/*!
* UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
*/

// Provides control sap.m.MessageStrip.
sap.ui.define(["jquery.sap.global", "./library", "sap/ui/core/Control", "./MessageStripUtilities",
	"./Text", "./Link"], function (jQuery, library, Control, MSUtils, Text, Link) {
	"use strict";

	/**
	 * Constructor for a new MessageStrip.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * MessageStrip is a control that enables the embedding of application-related messages in the application.
	 * There are 4 types of messages: Information, Success, Warning and Error.
	 * Each message can have a close button, so that it can be removed from the UI if needed.
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @since 1.30
	 * @alias sap.m.MessageStrip
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var MessageStrip = Control.extend("sap.m.MessageStrip", /** @lends sap.m.MessageStrip.prototype */ {
		metadata: {
			library: "sap.m",
			properties: {

				/**
				 * Determines the text of the message.
				 */
				text: { type: "string", group: "Appearance", defaultValue: "" },

				/**
				 * Determines the type of messages that are displayed in the MessageStrip.
				 * Possible values are: Information (default), Success, Warning, Error.
				 * If None is passed, the value is set to Information and a warning is displayed in the console.
				 */
				type: { type: "sap.ui.core.MessageType", group: "Appearance", defaultValue: sap.ui.core.MessageType.Information },

				/**
				 * Determines a custom icon which is displayed.
				 * If none is set, the default icon for this message type is used.
				 */
				customIcon: { type: "sap.ui.core.URI", group: "Appearance", defaultValue: "" },

				/**
				 * Determines if an icon is displayed for the message.
				 */
				showIcon: { type: "boolean", group: "Appearance", defaultValue: false },

				/**
				 * Determines if the message has a close button in the upper right corner.
				 */
				showCloseButton: { type: "boolean", group: "Appearance", defaultValue: false }
			},
			defaultAggregation: "link",
			aggregations: {

				/**
				 * Adds a sap.m.Link control which will be displayed at the end of the message.
				 */
				link: { type: "sap.m.Link", multiple: false, singularName: "link" },

				/**
				 * Hidden aggregation which is used to transform the string message into sap.m.Text control.
				 */
				_text: { type: "sap.m.Text", multiple: false, visibility: "hidden" }
			},
			events: {

				/**
				 * This event will be fired after the container is closed.
				 */
				close: {}
			}
		}
	});

	MessageStrip.prototype.init = function () {
		this.data("sap-ui-fastnavgroup", "true", true);
		this.setAggregation("_text", new Text());
	};

	/**
	 * Setter for property text.
	 * Default value is empty/undefined
	 * @public
	 * @param {string} sText new value for property text
	 * @returns {sap.m.MessageStrip} this to allow method chaining
	 */
	MessageStrip.prototype.setText = function (sText) {
		this.getAggregation("_text").setText(sText);
		return this.setProperty("text", sText, true);
	};

	/**
	 * Setter for property type.
	 * Default value is sap.ui.core.MessageType.Information
	 * @public
	 * @param {sap.ui.core.MessageType} sType The Message type
	 * @returns {sap.m.MessageStrip} this to allow method chaining
	 */
	MessageStrip.prototype.setType = function (sType) {
		if (sType === sap.ui.core.MessageType.None) {
			jQuery.sap.log.warning(MSUtils.MESSAGES.TYPE_NOT_SUPPORTED);
			sType = sap.ui.core.MessageType.Information;
		}

		return this.setProperty("type", sType);
	};

	MessageStrip.prototype.setAggregation = function (sName, oControl, bSupressInvalidate) {
		if (sName === "link" && oControl instanceof Link) {
			oControl.addAriaLabelledBy(this.getId());
		}

		Control.prototype.setAggregation.call(this, sName, oControl, bSupressInvalidate);
		return this;
	};

	/**
	 * Handles tap/click
	 * @type void
	 * @private
	 */
	MessageStrip.prototype.ontap = MSUtils.handleMSCloseButtonInteraction;

	/**
	 * Handles enter key
	 * @type void
	 * @private
	 */
	MessageStrip.prototype.onsapenter = MSUtils.handleMSCloseButtonInteraction;

	/**
	 * Handles space key
	 * @type void
	 * @private
	 */
	MessageStrip.prototype.onsapspace = MSUtils.handleMSCloseButtonInteraction;

	/**
	 * Handles mobile touch events
	 * @type void
	 * @private
	 */
	MessageStrip.prototype.ontouchmove = function (oEvent) {
		// mark the event for components that needs to know if the event was handled
		oEvent.setMarked();
	};

	/**
	 * Closes the MessageStrip.
	 * This method sets the visible property of the MessageStrip to false.
	 * The MessageStrip can be shown again by setting the visible property to true.
	 * @type void
	 * @public
	 */
	MessageStrip.prototype.close = function () {
		var fnClosed = function () {
			this.fireClose();
			this.setVisible(false);
		}.bind(this);

		if (sap.ui.Device.browser.internet_explorer && sap.ui.Device.browser.version < 10) {
			MSUtils.closeTransitionWithJavascript.call(this, fnClosed);
		} else {
			MSUtils.closeTransitionWithCSS.call(this, fnClosed);
		}
	};

	return MessageStrip;

}, /* bExport= */ true);
