/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.commons.TextArea.
sap.ui.define(['jquery.sap.global', './TextField', './library'],
	function(jQuery, TextField, library) {
	"use strict";

	/**
	 * Constructor for a new TextArea.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * Control to enter or display multible row text.
	 * @extends sap.ui.commons.TextField
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @alias sap.ui.commons.TextArea
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var TextArea = TextField.extend("sap.ui.commons.TextArea", /** @lends sap.ui.commons.TextArea.prototype */ { metadata : {

		library : "sap.ui.commons",
		properties : {

			/**
			 * Height of text field. When it is set (CSS-size such as % or px), this is the exact size.
			 */
			height : {type : "sap.ui.core.CSSSize", group : "Dimension", defaultValue : null},

			/**
			 * Number of Columns. Cols means number of characters per row. This proprty is only used if Width is not used.
			 */
			cols : {type : "int", group : "Dimension", defaultValue : null},

			/**
			 * Number of Rows. This proprty is only used if Height is not used.
			 */
			rows : {type : "int", group : "Dimension", defaultValue : null},

			/**
			 * Text wrapping. Possible values are: Soft, Hard, Off.
			 */
			wrapping : {type : "sap.ui.core.Wrapping", group : "Appearance", defaultValue : null},

			/**
			 * Position of cursor, e.g., to let the user re-start typing at the same position as before the server roundtrip
			 */
			cursorPos : {type : "int", group : "Appearance", defaultValue : null},

			/**
			 * text which appears, in case quick-help is switched on
			 */
			explanation : {type : "string", group : "Misc", defaultValue : null},

			/**
			 * ID of label control
			 * @deprecated Since version 1.5.2. 
			 * Please use association AriaLabelledBy instead.
			 */
			labeledBy : {type : "string", group : "Identification", defaultValue : null, deprecated: true}
		}
	}});

	///**
	// * This file defines the control behavior.
	// */
	//.TextArea.prototype.init = function(){
	//   // do something for initialization...
	//};

	/**
	 * Exit handler
	 */
	TextArea.prototype.exit = function() {
		this._detachEventHandler();
	};

	/**
	 * Event handler called before control is rendered
	 */
	TextArea.prototype.onBeforeRendering = function() {
		this._detachEventHandler();
	};

	/**
	 * Event handler called after control is rendered
	 */
	TextArea.prototype.onAfterRendering = function () {

		TextField.prototype.onAfterRendering.apply(this, arguments);
		this._attachEventHandler();

	};

	/**
	 * attaches the native event handlers
	 */
	TextArea.prototype._attachEventHandler = function() {
		var $this = this.$();
		this.proChHandlerId = $this.bind('propertychange', jQuery.proxy(this.oninput, this)); // for IE
	};

	/**
	 * detaches the native event handlers
	 */
	TextArea.prototype._detachEventHandler = function() {
		// Unbind events
		var $this = this.$();
		if (this.proChHandlerId) {
			$this.unbind('propertychange', this.oninput);
			this.proChHandlerId = null;
		}
	};

	/**
	 * Event handler called when control is getting the focus
	 *
	 * @param {jQuery.Event} oEvent The event object
	 * @private
	 */
	TextArea.prototype.onfocusin = function(oEvent){

		TextField.prototype.onfocusin.apply(this, arguments);

		// Set focus flag
		this.bFocus = true;

		oEvent.preventDefault();
	};

	/*
	 * Event handler called when control is loosing the focus
	 *
	 * @param {jQuery.Event} oEvent
	 * @private
	 */
	TextArea.prototype.onsapfocusleave = function(oEvent){

		TextField.prototype.onsapfocusleave.apply(this, arguments);

		var oFocusDomRef = this.getFocusDomRef();
		if (oFocusDomRef && !!sap.ui.Device.browser.firefox) { // Only for FF -> deselect text
			if (oFocusDomRef.selectionStart != oFocusDomRef.selectionEnd) {
				jQuery(oFocusDomRef).selectText(oFocusDomRef.selectionStart, oFocusDomRef.selectionStart);
			}
		}

		// Clear focus flag
		this.bFocus = false;

		oEvent.preventDefault();
		oEvent.stopPropagation();
	};

	/**
	 * Applies the focus info.
	 * Overwrites the standard function.
	 * @param {object} oFocusInfo Focusinfo object
	 * @private
	 */
	TextArea.prototype.applyFocusInfo = function (oFocusInfo) {

		TextField.prototype.applyFocusInfo.apply(this, arguments);

		var oFocusDomRef = this.getFocusDomRef();
		jQuery(oFocusDomRef).cursorPos(this.getCursorPos());

		return this;

	};

	/**
	 * Event handler called on Key press
	 *
	 * @param {jQuery.Event} oEvent The event object
	 * @private
	 */
	TextArea.prototype.onkeypress = function(oEvent){

		TextField.prototype.onkeypress.apply(this, arguments);

		if (!this.getEditable() || !this.getEnabled() || this.getMaxLength() <= 0) {
			return;
		}

		var oKC = jQuery.sap.KeyCodes;
		var iKC = oEvent.which || oEvent.keyCode;
		var oDom = this.getDomRef();

		// Check if some text is selected since this is different in Internet Explorer and FireFox
		// If some text is selected, it is overwritten by a key press -> Value will not get too large
		if (document.selection) { //IE
			var oSel = document.selection.createRange();
			if (oSel.text.length > 0) {
				return;
			}
		} else { // FF
			if (oDom.selectionStart != oDom.selectionEnd) {
				return;
			}
		}

		// Only real characters and ENTER, no backspace
		if (oDom.value.length >= this.getMaxLength() && ( iKC > oKC.DELETE || iKC == oKC.ENTER || iKC == oKC.SPACE) && !oEvent.ctrlKey) {
			oEvent.preventDefault();
			oEvent.stopPropagation();
		}

	};

	/**
	 * Event handler called on Key up
	 *
	 * @param {jQuery.Event} oEvent The event object
	 * @private
	 */
	TextArea.prototype.onkeyup = function(oEvent){

		// save cursor position
		var oDomRef = this.getDomRef();
		this.setProperty('cursorPos', jQuery(oDomRef).cursorPos(), true); // no re-rendering!

		// call keyup function of TextField to get liveChange event
		TextField.prototype.onkeyup.apply(this, arguments);

	};

	/**
	 * Event handler called when the enter key is pressed.
	 * @see sap.ui.commons.TextField#onsapenter
	 * @param {jQuery.Event} oEvent The event object
	 * @private
	 */
	TextArea.prototype.onsapenter = function (oEvent) {
		// stop bubbling of event when in the textarea so other actions of parent control handlers won't be called.
		// don't do a prevent default because we want the default browser behavior...e.g. new line when pressing enter in the text area.
		oEvent.stopPropagation();
	};

	TextArea.prototype.onsapnext = function(oEvent) {

		if (jQuery(this.getFocusDomRef()).data("sap.InNavArea") && oEvent.keyCode != jQuery.sap.KeyCodes.END) {
			// parent handles arrow navigation
			oEvent.preventDefault();
			return;
		}

		this._checkCursorPosForNav(oEvent, true);

	};

	TextArea.prototype.onsapprevious = function(oEvent) {

		if (jQuery(this.getFocusDomRef()).data("sap.InNavArea") && oEvent.keyCode != jQuery.sap.KeyCodes.HOME) {
			// parent handles arrow navigation
			oEvent.preventDefault();
			return;
		}

		this._checkCursorPosForNav(oEvent, false);

	};

	TextArea.prototype.onsapnextmodifiers = TextArea.prototype.onsapnext;
	TextArea.prototype.onsappreviousmodifiers = TextArea.prototype.onsapprevious;
	TextArea.prototype.onsapend = TextArea.prototype.onsapnext;
	TextArea.prototype.onsaphome = TextArea.prototype.onsapprevious;

	/**
	 * Event handler called on Mouse up
	 *
	 * @param {jQuery.Event} oEvent The event object
	 * @private
	 */
	TextArea.prototype.onmouseup = function(oEvent){

		// Save cursor position
		var oDomRef = this.getDomRef();
		this.setProperty('cursorPos', jQuery(oDomRef).cursorPos(), true); // no re-rendering!

	};

	/**
	 * Event handler called on Paste
	 *
	 * @param {jQuery.Event} oEvent The event object
	 * @private
	 */
	TextArea.prototype.onpaste = function(oEvent){

		if (!this.getEditable() || !this.getEnabled() || this.getMaxLength() <= 0) {
			return;
		}

		var oDom = this.getDomRef();

		if (oDom.value.length >= this.getMaxLength() && oDom.selectionStart == oDom.selectionEnd) {
			// already maxLenght reached and nothing selected -> no paste possible
			oEvent.preventDefault();
			oEvent.stopPropagation();
		}

	};

	/**
	 * Event handler called on Input
	 *
	 * @param {jQuery.Event} oEvent The event object
	 * @private
	 */
	TextArea.prototype.oninput = function(oEvent){

		if (oEvent.originalEvent && oEvent.originalEvent.propertyName && oEvent.originalEvent.propertyName.toLowerCase() != "value") {
			// In Internet Explorer, check for correct property
			return;
		}

		if (this.getEditable() && this.getEnabled() && this.getMaxLength() > 0) {
			var oDom = this.getDomRef();

			// If text is entered or pasted, cut it if is too long
			if (oDom.value.length > this.getMaxLength()) {
				oDom.value = oDom.value.substring(0,this.getMaxLength());
			}
			// The result is if text is pasted via clipboard or drag and drop the result is cut to fit the
			// maxLength. It's not easy to cut only the pasted text because in FireFox there is no access to the clipboard.
			// An option would be to store the old value after each change and compare it after each change.
			// Then the pasted text must be determined and cut. But this would need a lot of effort and script on
			// every change.
		}

		TextField.prototype.oninput.apply(this, arguments);

		// save cursor position
		var oDomRef = this.getDomRef();
		this.setProperty('cursorPos', jQuery(oDomRef).cursorPos(), true); // no re-rendering!

	};

	/**
	 * Property setter for MaxLength
	 *
	 * @param {int} iMaxLength maximal length of text
	 * @return {sap.ui.commons.TextArea} <code>this</code> to allow method chaining
	 * @public
	 */
	TextArea.prototype.setMaxLength = function(iMaxLength) {

		this.setProperty('maxLength', iMaxLength, true); // No re-rendering

		var oDom = this.getDomRef();

		if (oDom && oDom.value.length > iMaxLength && iMaxLength > 0 ) {
			oDom.value = oDom.value.substring(0,iMaxLength);
		}

		var sValue = this.getValue();
		if (sValue.length > iMaxLength && iMaxLength > 0 ) {
			this.setProperty('value', sValue.substring(0,iMaxLength));
		}

		return this;
	};

	/**
	 * Property setter for the cursor position
	 *
	 * @param {int} iCursorPos cursor position
	 * @return {sap.ui.commons.TextArea} <code>this</code> to allow method chaining
	 * @public
	 */
	TextArea.prototype.setCursorPos = function(iCursorPos) {

		this.setProperty('cursorPos', iCursorPos, true); // no re-rendering!

		if (this.bFocus) {
			jQuery(this.getDomRef()).cursorPos(iCursorPos);
		}

		return this;
	};

	return TextArea;

}, /* bExport= */ true);
