/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.commons.Message.
sap.ui.define(['jquery.sap.global', './Dialog', './library', 'sap/ui/core/Control'],
	function(jQuery, Dialog, library, Control) {
	"use strict";


	
	/**
	 * Constructor for a new Message.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * Creates the "Message"s to be supplied to the "MessageBar" Control.
	 * @extends sap.ui.core.Control
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @deprecated Since version 1.4.0. 
	 * A new messaging concept will be created in future. Therefore this control might be removed in one of the next versions.
	 * @alias sap.ui.commons.Message
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var Message = Control.extend("sap.ui.commons.Message", /** @lends sap.ui.commons.Message.prototype */ { metadata : {
	
		deprecated : true,
		library : "sap.ui.commons",
		properties : {
	
			/**
			 * "Success", or "Warning", or "Error" messages. (Mandatory)
			 */
			type : {type : "sap.ui.commons.MessageType", group : "Behavior", defaultValue : null},
	
			/**
			 * Message short text. (Mandatory)
			 */
			text : {type : "string", group : "Data", defaultValue : null},
	
			/**
			 * Associated UI element ID. (Optional)
			 * For navigation to error field.
			 */
			associatedElementId : {type : "string", group : "Data", defaultValue : null},
	
			/**
			 * Internal attribute, used to force the display of the "short" or the "long" text only.
			 */
			design : {type : "string", group : "Misc", defaultValue : null}
		}
	}});
	
	
	Message.prototype.init = function(){
		// Defining some private data...
		this.isRTL = sap.ui.getCore().getConfiguration().getRTL();
	
		// The "Details" related Controls.
	  this.fnCallBack    = null; // Supplied only if a longText is to be provided on demand.
		this.oLink         = null; // Created only if a longText exists. This is the link opening the Details Dialog.
		this.oContainer    = null; // Created only if a longText exists. This is the "Dialog" hosting the Details.
		this.oDetails      = null; // Created only if a longText exists. This is the Controller rendering the Details.
		this.oBtnOK        = null; // Created only if a longText exists. This is the OK button found within the Dialog.
	};
	
	/**
	 * Destroys this Control instance, called by Element#destroy()
	 * @private
	 */
	Message.prototype.exit = function() {
		if (this.oLink) {
			this.oLink.destroy();
			this.oLink = null;
		}
		if (this.oDetails) {
			this.oDetails.destroy();
			this.oDetails = null;
		}
		if (this.oContainer) {
			this.oContainer.destroy();
			this.oContainer = null;
		}
		if (this.oBtnOK) {
			this.oBtnOK.destroy();
			this.oBtnOK = null;
		}
	};
	
	// #############################################################################
	// Internal Utilities
	// #############################################################################
	/**
	 * This utility is for closing the Message Details from its OK button.
	 * @private
	 */
	Message.closeDetails = function(oControlEvent) {
	  oControlEvent.getSource().getParent().close();
	};
	/**
	 * This utility closes THIS Message's Details.
	 * @private
	 */
	Message.prototype.closeDetails = function() {
	  // If Details have been opened, can attempt to close them:
	  if (this.oContainer) {
		this.oContainer.close();
	  }
	};
	
	/**
	 * This utility renders the Message Details.
	 * Current Specifications are those of JPaaS:
	 *    Supported by:               "Dialog"              "MessageBox"
	 *  - Title:                       Yes                   Yes
	 *  - Non-blocking:                Yes, configurable.    No, modal only
	 *  - Accepts HTML string:         Yes, via oContent.    No, sMessage only
	 *  - Bottom-Right resize handle:  Yes                   No
	 *  - No icon:                     Yes                   Possible
	 * @private
	 */
	Message.prototype.openDetails = function() {
	  if (!this.oContainer) {
		var rb          = sap.ui.getCore().getLibraryResourceBundle("sap.ui.commons");
		var OK          = rb.getText("MSGBAR_DETAILS_DIALOG_CLOSE");
		var title       = rb.getText("MSGBAR_DETAILS_DIALOG_TITLE");
		// Reading the HTML details as is, styles included:
		var	htmlDetails = this.fnCallBack(this.getId());
		this.oDetails   = new Message({type: this.getType(), text: htmlDetails});
		this.oBtnOK     = new sap.ui.commons.Button({text: OK, press:Message.closeDetails});
		this.oContainer = new Dialog();
		this.oContainer.addContent(this.oDetails);
		this.oContainer.setTitle(title);
			this.oContainer.addButton(this.oBtnOK);
	  //this.oContainer.setDefaultButton(this.oBtnOK); // Already the default since the only button...
	  }
		// Other visible Dialogs around?
	  var sContainerId = this.oContainer.getId();
	  var iOthersMaxZIndex = 0;
	  var oOtherOpenDialogs = jQuery('.sapUiDlg');
	  for (var i = oOtherOpenDialogs.length - 1; i >= 0; i--) {
		if (jQuery(oOtherOpenDialogs[i]).css('visibility') != "visible") {
		  oOtherOpenDialogs.splice(i, 1);
		} else if (oOtherOpenDialogs[i].id == sContainerId) {
		  oOtherOpenDialogs.splice(i, 1);
		} else {
		  iOthersMaxZIndex = Math.max(iOthersMaxZIndex,jQuery(oOtherOpenDialogs[i]).css('zIndex'));
		}
	  }
	
	  // Taking note for later:
	  var bWasOpen = this.oContainer.isOpen();
	  // No matter what, we have to open the new Details, so:
	  this.oContainer.open();
	
	  // jQuery version of our OPEN Dialog Container:
		var jContainer = this.oContainer.$();
	
	  // Starting a new Stack in the default Dialog's location:
	  var jContainerRect = jContainer.rect(); // For Height and Width...
		if (oOtherOpenDialogs.length == 0) {
			// "offsets.right" & "offsets.left" should be identical as plain Dialogs are centered,
			// but in case there is a bug (like in Safari RTL):
			if (this.isRTL) {
			  // Will be using "left" invariably for RTL or LTR:
				jContainerRect.left = Number(jContainer.css('right').replace("px", ""));
			}
			this.setLastOffsets(jContainerRect);
			// Nothing else to do:
			return;
		}
	
	  // Dialog limitation. Work-around:
	  if (bWasOpen) {
			if (iOthersMaxZIndex > jContainer.css('zIndex')) {
				// zIndex not raised via previous re-open()...
				// Have to raise it ourselves.
			jContainer.css('zIndex',iOthersMaxZIndex + 1);
			}
			// Nothing else to do:
		return;
	  }
	
	  //*************** Stacking process starts ***************
	  // 1st rendering the new Dialog on top of the old one...
	  var oNextOffsets = this.getNextOffsets();
		jContainer.css('top',  (oNextOffsets.top - Message.TOP_INCR ) + "px");
	  if (this.isRTL) {
			jContainer.css('right', (oNextOffsets.left - Message.LEFT_INCR) + "px");
	  } else {
		jContainer.css('left',  (oNextOffsets.left - Message.LEFT_INCR) + "px");
	  }
	
	  // Figuring what should the next coordinates be:
	  var jContainerRect = jContainer.rect(); // For Height and Width...
	  var scrollTop   = jQuery(window).scrollTop();
	  var scrollLeft  = jQuery(window).scrollLeft(); // Negative in RTL
	  var scrollRight = -scrollLeft;
	  // Checking if the new coordinates fit within the window:
	  if ((jQuery(window).height() + scrollTop) < (oNextOffsets.top + jContainerRect.height)) {
		// ReStacking from the top:
		oNextOffsets.top = scrollTop;
		this.setLastOffsets(oNextOffsets);
	  }
	  if (this.isRTL) {
		  if ((jQuery(window).width() + scrollRight) < (oNextOffsets.left + jContainerRect.width)) {
			// ReStacking from the right:
			oNextOffsets.left = scrollRight;
			this.setLastOffsets(oNextOffsets);
		  }
			// Animating the Dialog to its new offset position:
			jContainer.animate({top:oNextOffsets.top + "px", right:oNextOffsets.left + "px"}, 200);
	  } else {
		  if ((jQuery(window).width() + scrollLeft) < (oNextOffsets.left + jContainerRect.width)) {
			// ReStacking from the left:
			oNextOffsets.left = scrollLeft;
			this.setLastOffsets(oNextOffsets);
		  }
			// Animating the Dialog to its new offset position:
			jContainer.animate({top:oNextOffsets.top + "px", left:oNextOffsets.left + "px"}, 200);
	  }
	
	//MESSAGEBOX BACKUP: Issues: Only Modal, Doesn't accept HTML string, No Resize-Area.
	//	var rb    = sap.ui.getCore().getLibraryResourceBundle("sap.ui.commons");
	//  var ICON  = this.getType().toUpperCase();		// ERROR, WARNING, ...
	//  var title = rb.getText("MSGTYPE_" + ICON);
	//  var text  = this.getLongText();
	//  sap.ui.commons.MessageBox.show(text, ICON, title);
	};
	
	Message.TOP_INCR  = 20;
	Message.LEFT_INCR = 10;
	
	
	// Begin of Dialog-Offsets-Stacking facilities
	(function() {
		var oLastOffsets = null;
		/**
		 * @static
		 */
		Message.setLastOffsets = function(oOffsets){
			oLastOffsets = oOffsets;
		};
		Message.prototype.setLastOffsets = function(oOffsets){
			Message.setLastOffsets(oOffsets);
		};
		Message.getNextOffsets = function(){
		  oLastOffsets.top   += Message.TOP_INCR;
		  oLastOffsets.left  += Message.LEFT_INCR;
			return oLastOffsets;
		};
		Message.prototype.getNextOffsets = function(){
			return Message.getNextOffsets();
		};
	}());
	// End of Dialog-Offsets-Stacking facilities
	
	
	// #############################################################################
	// Public APIs
	// #############################################################################

	/**
	 * Registers a callback function to be invoked if long text Details are to be made available. 
	 * 
	 * This callback function will be supplied the corresponding Message "id", and should 
	 * return the (simple) HTML string to be displayed within the Message Details Dialog.
	 * 
	 * E.g.: myMessage.bindDetails(getDetails);
	 * function getDetails(sId) {... return htmlString;}
	 *
	 * @param {function} fnCallBack the callback function 
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 * @public
	 */
	Message.prototype.bindDetails = function(fnCallBack) {
		this.fnCallBack = fnCallBack;
	};

	return Message;

}, /* bExport= */ true);
