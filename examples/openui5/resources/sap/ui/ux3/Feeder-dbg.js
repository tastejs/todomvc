/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.ux3.Feeder.
sap.ui.define(['jquery.sap.global', 'sap/ui/commons/Button', 'sap/ui/core/Control', 'sap/ui/core/theming/Parameters', './library'],
	function(jQuery, Button, Control, Parameters, library) {
	"use strict";


	
	/**
	 * Constructor for a new Feeder.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * This feed control flavor represents a lean common feed, or a comment feed, with a text commit function.
	 * The control can be used stand alone or in a multiple way, and generally would be integrated directly into a UIArea.
	 * @extends sap.ui.core.Control
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @experimental Since version 1.2. 
	 * The whole Feed/Feeder API is still under discussion, significant changes are likely. Especially text presentation (e.g. @-references and formatted text) is not final. Also the Feed model topic is still open.
	 * @alias sap.ui.ux3.Feeder
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var Feeder = Control.extend("sap.ui.ux3.Feeder", /** @lends sap.ui.ux3.Feeder.prototype */ { metadata : {
	
		library : "sap.ui.ux3",
		properties : {
	
			/**
			 * URL to the thumb nail image
			 * This property is optional if the feeder is a sub-control of a feed or a feedChunk control. In this case the value of the feed or feddChunk control is used if it's not set. So it must be only set once on the feed or feedChunk control.
			 */
			thumbnailSrc : {type : "sap.ui.core.URI", group : "Data", defaultValue : null},
	
			/**
			 * The text for the Feeder. @References are supported.
			 */
			text : {type : "string", group : "Data", defaultValue : null},
	
			/**
			 * Type and size of the Feeder
			 */
			type : {type : "sap.ui.ux3.FeederType", group : "Appearance", defaultValue : sap.ui.ux3.FeederType.Large},
	
			/**
			 * This property could be used for costum placeholder. If it is not set, the default text is used.
			 */
			placeholderText : {type : "string", group : "Appearance", defaultValue : null}
		},
		events : {
	
			/**
			 * Event is fired when the entered text is submitted
			 */
			submit : {
				parameters : {
	
					/**
					 * The text that is submitted
					 */
					text : {type : "string"}
				}
			}
		}
	}});
	
	
	/**
	 * This file defines behavior for the control,
	 */
	
	Feeder.prototype.init = function(){
		this.rb = sap.ui.getCore().getLibraryResourceBundle("sap.ui.ux3");
		this.oSendButton = new Button( this.getId() + "-send", {
				style: sap.ui.commons.ButtonStyle.Emph,
				icon: "sap-icon://feeder-arrow"
			}).setParent(this);
		this.oSendButton.attachEvent('press', this.handleSendButtonPress, this); // attach event this way to have the right this-reference in handler
	
	};
	
	/*
	 * as onBeforeRendering only runs while re-rendering this module is called in renderer
	 */
	Feeder.prototype.initSendButton = function(){
		if (this.getText() == "") {
			// no re-rendering as button is not rendered now.
			this.oSendButton.setProperty('enabled', false, true);
		}
	
	};
	
	Feeder.prototype.exit = function(){
		this.rb = undefined;
		this.oInput = undefined;
		if (this.oSendButton) {
			this.oSendButton.destroy();
			delete this.oSendButton;
		}
	};
	
	/**
	 * After rendering, keep the input field jQuery object as attribute
	 * for reuse
	 *
	 * @private
	 */
	Feeder.prototype.onAfterRendering = function () {
		this.oInput = this.$("input");
	};
	
	/**
	 * handler for click event
	 *
	 * @private
	 */
	Feeder.prototype.onclick = function(oEvent){
	
		var sTargetId = oEvent.target.getAttribute( 'ID' );
	
		switch ( sTargetId ) {
		case ( this.getId() + '-send' ):
			// Click on send button (should be handled in button)
		break;
		case ( this.getId() + '-input'):
			// Click on input field
	
		break;
		default:
	
		break;
		}
	
	};
	
	/**
	 * handler for focusIn
	 *
	 * If the Feeder is empty the default text must be cleared
	 * @private
	 */
	Feeder.prototype.onfocusin = function(oEvent){
	
		this.oInput.find(".sapUiFeederEmptyText").remove();
	
	};
	
	/**
	 * handler for focusOut
	 *
	 * If the Feeder is empty the default text written
	 * @private
	 */
	Feeder.prototype.onfocusout = function(oEvent){
	
		var sText = this.oInput.text();
		if (sText == "") {
			this.oInput.empty(); // to remove invisible line breaks and so on
			this.oInput.append(sap.ui.ux3.FeederRenderer.getEmptyTextInfo(this));
		}
	
		this.setProperty("text", sText, true); // no rerendering!
	
	};
	
	// overrides sap.ui.core.Element.getFocusDomRef()
	Feeder.prototype.getFocusDomRef = function(){
		return this.getDomRef("input");
	};
	
	/**
	 * handler for keyUp
	 *
	 * if text is entered the button must be enables, if empty it must be disabled
	 * @private
	 */
	Feeder.prototype.onkeyup = function(oEvent){
	
		if (this.oInput.text() == "") {
			this.oSendButton.setEnabled(false);
		} else {
			this.oSendButton.setEnabled(true);
		}
	
		//Clean input so we avoid having invisible DOM content
	//	if(!this.oInput.text()){
	//		this.oInput.empty();
	//	}
	
	};
	
	/**
	 * Handler for send-button press
	 *
	 * @private
	 */
	Feeder.prototype.handleSendButtonPress = function(oEvent){
	
		var sText = this.getMultilineText(this.oInput);
		this.setProperty("text", sText, true); // no rerendering!
		this.fireSubmit({text: sText});
		this.setText(''); // clear text after submit
	
	};
	
	/**
	 * get multiline text from input DIV
	 *
	 * @param {object} [oInput] jQuery object of the input field
	 *
	 * @private
	 */
	Feeder.prototype.getMultilineText = function(oInput) {
	
		function parseText(nodes) {
	
			var node;
			var sText = '';
	
			for (var i = 0; i < nodes.length; i++) {
				node = nodes[i];
	
				// text / cdata
				if (node.nodeType === 3 || node.nodeType === 4) {
	
					// ignore non-breakable space in IE
					if (!(!!sap.ui.Device.browser.internet_explorer && node.nodeValue === '\xA0')) {
						sText += node.nodeValue.replace(/\n/g, ''); // filter out line breaks in text-nodes
					}
				}
	
				// check for "linebreaking"-nodes
				if (node.nodeName === 'DIV' ||
						node.nodeName ===  'P' ||
						(node.nodeName === 'BR' && !sap.ui.Device.browser.webkit)) { // ignore BR in webkit
	
					// ignore last <br> with type="_moz" in mozilla
					if (node.nodeName === 'BR' &&
						!!sap.ui.Device.browser.firefox &&
						i === nodes.length - 1 &&
						jQuery(node).attr("type") === "_moz") {
						continue;
					}
	
					// do not add a newline if no text was found until now (IE)
					if (!(!!sap.ui.Device.browser.internet_explorer && sText === '') &&
	
						// same as above but only for <P> and webkit/mozilla
						!((!!sap.ui.Device.browser.firefox || !!sap.ui.Device.browser.webkit) && sText === '' && node.nodeName ===  'P') &&
	
						// ignore <P>'s containing linebreaks only (\n)
						!(!!sap.ui.Device.browser.webkit && node.nodeName ===  'P' && node.textContent.match(/^(\n)*$/))) {
	
						sText += '\n';
					}
	
				}
	
				// parse child elements, ignore comments in mozilla
				if (node.nodeType !== 8) {
					sText += parseText(node.childNodes);
				}
	
			}
	
			return sText;
		}
	
		return parseText(oInput.get(0).childNodes);
	};
	
	/*
	 * Overwrite standard getter for thumbnail source:
	 * If not set and feeder is child of a Feed or FeedChunk use the thumbnailsource of the parent
	 * So it must not be set manually for each sub-control and is always in sync
	 */
	Feeder.prototype.getThumbnailSrc = function() {
		var sThumbnailSrc =  this.getProperty("thumbnailSrc");
	
		if (!sThumbnailSrc || sThumbnailSrc == "") {
			var oParent = this.getParent();
			if (oParent && (oParent instanceof sap.ui.ux3.Feed || oParent instanceof sap.ui.ux3.FeedChunk)) {
				sThumbnailSrc = oParent.getFeederThumbnailSrc();
			}
		}
	
		return sThumbnailSrc;
	};
	
	Feeder.prototype.onpaste = function(oEvent){
	
		// call after paste function delayed to have content already pasted (in the moment only needed in FireFox)
		if (!!sap.ui.Device.browser.firefox) {
			jQuery.sap.delayedCall(10, this, "onAfterPaste");
		}
	
	};
	
	Feeder.prototype.onAfterPaste = function(){
	
		// if pasted from MS Word in FireFox text is longer that contenteditable DIV
		// -> add overflow:hidden to PRE elements
		var aChildren = this.oInput.get(0).childNodes;
	
		for ( var i = 0; i < aChildren.length; i++) {
			var oChild = aChildren[i];
			if (oChild.nodeName == "PRE") {
				jQuery(oChild).css("overflow", "hidden");
			}
		}
	
	};

	return Feeder;

}, /* bExport= */ true);
