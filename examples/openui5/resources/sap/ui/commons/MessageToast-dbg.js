/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.commons.MessageToast.
sap.ui.define(['jquery.sap.global', './library', 'sap/ui/core/Control', 'sap/ui/thirdparty/jqueryui/jquery-ui-core'],
	function(jQuery, library, Control, jqueryuicore) {
	"use strict";



	/**
	 * Constructor for a new MessageToast.
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * Responsible for displaying the new incoming messages, one at the time, on top of the MessageBar.
	 * @extends sap.ui.core.Control
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @deprecated Since version 1.4.0.
	 * A new messaging concept will be created in future. Therefore this control might be removed in one of the next versions.
	 * @alias sap.ui.commons.MessageToast
	 * @ui5-metamodel This control/element also will be described in the UI5 design-time metamodel
	 */
	var MessageToast = Control.extend("sap.ui.commons.MessageToast", /** @lends sap.ui.commons.MessageToast.prototype */ { metadata : {

		deprecated : true,
		library : "sap.ui.commons",
		properties : {

			/**
			 * ID of the anchor on top of which the MessageToast is to render.
			 */
			anchorId : {type : "string", group : "Misc", defaultValue : null}
		},
		events : {

			/**
			 * Fired once the <code>toast()</code> method is over, so that the MessageBar can "toast" another message if needed.
			 */
			next : {}
		}
	}});

	/**
	 * Initializes the control
	 *
	 * @override
	 * @private
	 */
	MessageToast.prototype.init = function(){
		// Local variables...
		this.oMessage    = null;
		this.sAnchorId   = "";
		this.bIdle       = true;
		this.sLeftOffset = "";

		// Popup(oContent, bModal, bShadow, bAutoClose) container initialization:
		// - oModal: "true/false" : For blocking the background window.
		// - bShadow: "false" as the MessageBar Popup is displayed without shadow in all themes.
		//            Shadow is added but not at the Popup level because in contains a down-arrow.
		//            Therefore the shadow is added to an inner container, excluding this down-arrow.
		this.oPopup   = new sap.ui.core.Popup(this, false, false, false);
		// Asking the Popup to fire our "next" event once a "toast()" is over.
		this.oPopup.attachClosed(this.next, this);
	};

	/**
	 * Destroys this Control instance, called by Element#destroy()
	 * @private
	 */
	MessageToast.prototype.exit = function() {
	  if (!this.bIdle) {
		this.close();
	  }

		this.oPopup.destroy();
		this.oPopup = null;
	};

	/**
	 * This utility makes sure that the Toast is pointing down towards
	 * the right MessageBar Icon.
	 * @private
	 */
	MessageToast.prototype.onAfterRendering = function(){
	  // The MessageToast and the MessageBar are right-aligned.
	  // The MessageToast has a minWidth matching that of the MessageBar.
	  // (That allows us to position the down-arrow without moving the MessageToast.)
	  // The MessageToast Arrow aligns towards the proper MessageBar Icon.

	  var rtl = sap.ui.getCore().getConfiguration().getRTL();

	  // 1) Calculating the distance between the Icon and the right side of its MessageBar container:
	  var jIcon = jQuery.sap.byId(this.sAnchorId); // Anchor against which our Arrow has to align
	//if (!jIcon) return;
	  var iconPosition  = jIcon.position();
	  var jBar = jQuery.sap.byId(this.getAnchorId()); // Anchor against which our Toast has to align
	//if (!jBar) return;
	  var barWidth = jBar.outerWidth();
	  if (iconPosition) {
		  var targetRightOffset = rtl ? iconPosition.left + jIcon.outerWidth()
									  : barWidth - iconPosition.left;


		  // 2) Calculating the default distance between the Arrow and the right side of our Toast:
			var jToast = this.$();  // = jQuery.sap.byId(this.getId());
		  var toastWidth = jToast.width();
		  var defaultArrowRightOffset = Math.max(toastWidth,barWidth);

		  // 3) Taking care of too-small a Toast:
		  var delta = barWidth - toastWidth;
			if (delta > 0) {
			// Making the Toast as wide as the Bar:
			jToast.css('minWidth', barWidth);
			}

		  // 4) Now, we need to move our Arrow right, by what is missing:
		  var moveRightOffset = rtl ? (defaultArrowRightOffset - targetRightOffset + 2) + "px"
									: (defaultArrowRightOffset - targetRightOffset - 2) + "px";
			if (defaultArrowRightOffset >= targetRightOffset) {
			var jArrow = jQuery.sap.byId(this.getId() + "Arrow");
			if (sap.ui.getCore().getConfiguration().getRTL()) {
				jArrow.css('marginRight', moveRightOffset); // Positive padding
			} else {
				jArrow.css('marginLeft', moveRightOffset); // Positive padding
			}
			// Our right-alignment can stay:
			this.sLeftOffset = "0";
			}
		}
	};

	// #############################################################################
	// Internal Utilities
	// #############################################################################
	/**
	 * Our popup-close callback function.
	 * Registers the fact that a toast just completed, and fires our "next" event.
	 * @private
	 */
	MessageToast.prototype.next = function(){
		// Toast done (allows for smooth toasting):
	  this.bIdle = true;
	  this.fireNext();
	}

	/**
	 * This utility opens the MessageToast Popup.
	 * @private
	 */;
	MessageToast.prototype.open = function(iDuration) {
		// For Multiple Messages, 1st we need to close the existing toast:
	  if (!this.bIdle) {
		this.oPopup.close(0);
	  }

		// Toast start (allows for no interruption):
	  this.bIdle = false;

	  var rtl = sap.ui.getCore().getConfiguration().getRTL();

		// Defining or fetching the Popup attributes:
	  var popupSnapPoint  = rtl ? sap.ui.core.Popup.Dock.LeftBottom : sap.ui.core.Popup.Dock.RightBottom;
	  var anchorSnapPoint = rtl ? sap.ui.core.Popup.Dock.LeftTop    : sap.ui.core.Popup.Dock.RightTop;
	  var relativeAnchorPosition = this.sLeftOffset + " 5";
	  var anchor = null;
	  var anchorId = this.getAnchorId();
	  if (anchorId) {
		anchor = jQuery.sap.domById(anchorId);
	  }
	  if (!anchor) {
		anchor = document.body;
	  }
	  // Invoking the MsgBar Popup open function(iDuration, my, at, of, offset):
	  this.oPopup.open(iDuration, popupSnapPoint, anchorSnapPoint, anchor, relativeAnchorPosition);
	};

	/**
	 * This utility closes the MessageToast Popup.
	 * @private
	 */
	MessageToast.prototype.close = function(iDuration) {
	  // Invoking the Popup close = function(iDuration):
	  this.oPopup.close(iDuration);
	};

	/**
	 * This utility returns the class of the MessageToast container,
	 * which changes according to the displayed message TYPE/PRIORITY
	 * to allow for "semantic" rendering.  :-)
	 * @private
	 */
	MessageToast.prototype.getClasses = function() {
	  // By default assuming the "Multiple new messages..." css:
	  var css = "sapUiMsgToast";
	  // Allow for specializing as per the message Type:
	  if (this.oMessage && this.oMessage.getType()) {
		css += " sapUiMsgT" + this.oMessage.getType();
	  }
	  return css;
	};

	// #############################################################################
	// Public APIs
	// #############################################################################
	/**
	 * Triggers the toasting of a message, on top of the MessageBar.
	 * If no message is supplied, displays the "Multiple new messages..." message.
	 *
	 * Receives the list of Messages to be displayed,
	 * and re-renders this Control if it is visible.
	 *
	 * @param {sap.ui.commons.Message} oMessage
	 *         The Message to be toasted.
	 * @param {string} sAnchorId
	 *         DOM ID of the anchor against which the Toast Arrow should align for a given Toast.
	 * @type void
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 design-time metamodel
	 */
	MessageToast.prototype.toast = function(oMessage, sAnchorId) {
	  // Storing the supplied data:
		this.oMessage = oMessage;
		this.sAnchorId = sAnchorId;
	  // Render according to new message, and animate:
		sap.ui.getCore().getRenderManager().render(this, sap.ui.getCore().getStaticAreaRef(), true);
	  this.open(750);
	  this.close(2250); // <-- CAN BE COMMENTED OUT WHILE STYLING THE TOAST...

		return this;
	};

	/**
	 * Returns the idle state of the control. Returns true if no message is being toasted.
	 *
	 * @type boolean
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 design-time metamodel
	 */
	MessageToast.prototype.isIdle = function() {
	  return this.bIdle;
	};

	return MessageToast;

}, /* bExport= */ true);
