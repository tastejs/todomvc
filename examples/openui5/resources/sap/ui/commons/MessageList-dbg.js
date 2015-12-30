/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.commons.MessageList.
sap.ui.define(['jquery.sap.global', './library', 'sap/ui/core/Control', 'sap/ui/core/Popup'],
	function(jQuery, library, Control, Popup) {
	"use strict";



	/**
	 * Constructor for a new MessageList.
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * Instantiated by the "MessageBar" Control if the user requests to generate the corresponding "MessageList".
	 * @extends sap.ui.core.Control
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @deprecated Since version 1.4.0.
	 * A new messaging concept will be created in future. Therefore this control might be removed in one of the next versions.
	 * @alias sap.ui.commons.MessageList
	 * @ui5-metamodel This control/element also will be described in the UI5 design-time metamodel
	 */
	var MessageList = Control.extend("sap.ui.commons.MessageList", /** @lends sap.ui.commons.MessageList.prototype */ { metadata : {

		deprecated : true,
		library : "sap.ui.commons",
		properties : {

			/**
			 * Specifies whether or not the MessageList is visible. Invisible controls are not rendered.
			 */
			visible : {type : "boolean", group : "Behavior", defaultValue : false},

			/**
			 * ID of the anchor under which the MessageList will render.
			 */
			anchorId : {type : "string", group : "Appearance", defaultValue : null},

			/**
			 * Maximum number of messages being display in the List before a scrollbar appears. Value '0' means no limit.
			 */
			maxListed : {type : "string", group : "Misc", defaultValue : '7'}
		}
	}});

	/**
	 * Initializes the control
	 *
	 * @override
	 * @private
	 */
	MessageList.prototype.init = function(){
		// Defining some private data:
		this.aMessages = [];
		this.iItemHeight = 0;

		// Popup(oContent, bModal, bShadow, bAutoClose) container initialization:
		// - bModal: "true/false" : For blocking the background window.
		this.oPopup   = new Popup(this, false, true, false);
	};

	/**
	 * Destroys this Control instance, called by Element#destroy()
	 * @private
	 */
	MessageList.prototype.exit = function() {
	  this.close();

		this.oPopup.destroy();
		this.oPopup = null;
	};

	/**
	 * Re-initializes the measurements, so all sizes are recalculated after a theme switch.
	 * @private
	 */
	MessageList.prototype.onThemeChanged = function () {
		this.iItemHeight = 0;
	};

	/**
	 * This utility checks to see if a scrollbar has to be rendered.
	 * @private
	 */
	MessageList.prototype.onAfterRendering = function () {
		var oList = this.getDomRef();
		var jList = jQuery(oList);

		// A scrollbar is only required over 7 items:
		var maxVisibleItems = this.getMaxListed();
		var len = this.aMessages.length;
		if (len <= maxVisibleItems) {
			// By default, css height was set to "20px" to make sure List would fit, for Popup to open.
			jList.height("auto");
			return;
		}

		// Calculating 1 item height:
		if (this.iItemHeight == 0) {
			var oItem = oList.firstChild;
			var jItem = jQuery(oItem);
			this.iItemHeight = jItem.height();
		}

		oList.style.overflowY = "scroll";
		oList.style.overflowX = "hidden";
		var desiredHeight = (maxVisibleItems * this.iItemHeight) + "px";
		jList.height(desiredHeight);
	};

	// #############################################################################
	// Internal Utilities
	// #############################################################################
	/**
	 * This utility opens the MessageList Popup.
	 * @private
	 */
	MessageList.prototype.open = function() {
		var rtl = sap.ui.getCore().getConfiguration().getRTL();

		// Defining or fetching the Popup attributes:
		var animationDuration = 200;
		var msgListSnapPoint = rtl ? Popup.Dock.RightTop    : Popup.Dock.LeftTop;
		var anchorSnapPoint  = rtl ? Popup.Dock.RightBottom : Popup.Dock.LeftBottom;
		var relativeAnchorPosition = "0 0";
		var anchor = null;
		var anchorId = this.getAnchorId();
		if (anchorId) {
			anchor = jQuery.sap.domById(anchorId);
		}
		if (!anchor) {
			anchor = document.body;
		}
		// Invoking the MsgBar Popup open function(iDuration, my, at, of, offset):
		this.oPopup.open(animationDuration, msgListSnapPoint, anchorSnapPoint, anchor, relativeAnchorPosition);
	};

	/**
	 * This utility closes the MessageList Popup.
	 * @private
	 */
	MessageList.prototype.close = function() {
		// Invoking the MsgBar Popup close = function(iDuration):
		var animationDuration = 200;
		this.oPopup.close(animationDuration);
	};

	/**
	 * Sets the list of Messages to be displayed and re-renders this Control if it is visible.
	 *
	 * @param {sap.ui.commons.Message[]} aMessages Message list.
	 * @type void
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 design-time metamodel
	 */
	MessageList.prototype.setMessages = function(aMessages) {
		// Storing the Messages:
		this.aMessages = aMessages;

		// Re-rendering this MessageList if visible:
		if (this.getVisible()) {
			sap.ui.getCore().getRenderManager().render(this, sap.ui.getCore().getStaticAreaRef(), true);
		}

		return this;
	};


	// #############################################################################
	// Overwriting auto-generated methods of MessageList.API.js
	// #############################################################################

	/**
	 * Setter for property <code>visible</code>.
	 *
	 * Default value is <code>true</code>
	 *
	 * The default implementation of function "setVisible()" is overwritten
	 * in order to invoke the open() and close() of the MessageList Popup.
	 *
	 * @param {boolean} bVisible New value for property <code>visible</code>
	 * @return {sap.ui.commons.MessageList} <code>this</code> to allow method chaining
	 * @public
	 */
	MessageList.prototype.setVisible = function(bVisible) {
		this.setProperty("visible", bVisible);

		// Opening or closing the MessageBar, as requested:
		if (bVisible) {
		// Re-rendering, in case content is new.
		sap.ui.getCore().getRenderManager().render(this, sap.ui.getCore().getStaticAreaRef(), true);
			this.open();
		} else {
			this.close();
		}

		return this;
	};

	return MessageList;

}, /* bExport= */ true);
