/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.commons.DropdownBox.
sap.ui.define(['jquery.sap.global', './ComboBox', './library', 'sap/ui/core/History', 'sap/ui/core/SeparatorItem'],
	function(jQuery, ComboBox, library, History, SeparatorItem) {
	"use strict";


	/**
	 * Constructor for a new DropdownBox.
	 *
	 * @param {string} [sId] Id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * The control provides a field that allows end users to an entry out of a list of pre-defined items.
	 * The choosable items can be provided in the form of a complete <code>ListBox</code>, single <code>ListItems</code>.
	 * @extends sap.ui.commons.ComboBox
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @alias sap.ui.commons.DropdownBox
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var DropdownBox = ComboBox.extend("sap.ui.commons.DropdownBox", /** @lends sap.ui.commons.DropdownBox.prototype */ { metadata : {

		library : "sap.ui.commons",
		properties : {

			/**
			 * Whether the DropdownBox's search help should be enabled.
			 */
			searchHelpEnabled : {type : "boolean", group : "Behavior", defaultValue : false},

			/**
			 * (optional) The text to use for the search help entry.
			 */
			searchHelpText : {type : "string", group : "Appearance", defaultValue : null},

			/**
			 * (optional) The additional Text to use for the search help entry.
			 */
			searchHelpAdditionalText : {type : "string", group : "Appearance", defaultValue : null},

			/**
			 * (optional) The URI of the icon to use for the search help entry.
			 */
			searchHelpIcon : {type : "sap.ui.core.URI", group : "Appearance", defaultValue : null},

			/**
			 * Maximum number of history items in the list.
			 *
			 * If 0 no history is displayed or stored. The history is locally stored on the client.
			 * Therefore do not activate this feature when this control handles confidential data.
			 */
			maxHistoryItems : {type : "int", group : "Behavior", defaultValue : 0}
		},
		events : {

			/**
			 * Event fired whenever the configured searchHelpItem is clicked or the searchHelpItem is configured and F4 key is pressed.
			 */
			searchHelp : {
				parameters : {

					/**
					 * The current value of the DropdownBox.
					 */
					value : {type : "string"}
				}
			}
		}
	}});


	/**
	 * Initialization method.
	 * @private
	 */
	DropdownBox.prototype.init = function() {
		ComboBox.prototype.init.apply(this, arguments);
		this._oValueBeforePaste = null;
		this._oValueBeforeOpen = null;
		this.__aItems = null;
		this._iCursorPosBeforeBackspace = null;
		/**
		 * Array of ListItems containing SearchHelp followed by Separator
		 * @type {sap.ui.core.ListItem[]}
		 * @private
		 */
		this._searchHelpItem = null;
		this._iItemsForHistory = 10; // UX defined history shall appear if there are more than 10 items
		this._oHistory = new History(this.getId());
	};

	/**
	 * Cleanup instance.
	 * @private
	 */
	DropdownBox.prototype.exit = function() {
		var sIdPrefix = this.getId() + "-h-";
		// destroys searchHelpItems
		if ( this._searchHelpItem ) {
			this._searchHelpItem[0].destroy();
			this._searchHelpItem[1].destroy();
			this._searchHelpItem = null;
		}

		ComboBox.prototype.exit.apply(this, arguments);
		// check for and remaining history items and destroy them
		function remove(id) {
			var oItem = sap.ui.getCore().byId(id);
			if (oItem) {
				oItem.destroy();
			}
		}
		for (var i = 0; i < this.getMaxHistoryItems(); i++) {
			remove(sIdPrefix + i);
		}
		if (this.__oSeparator) {
			this.__oSeparator.destroy();
			this.__oSeparator = null;
		}
		this._oHistory = null;

		this.__aItems = null;
		this._sWantedValue = undefined;
	};

	/**
	 * Ensure that handed in ListBoxes are taken from the visible UI immediately.
	 * @param {jQuery.Event} oEvent The event object.
	 * @protected
	 */
	DropdownBox.prototype.onAfterRendering = function(oEvent){

		ComboBox.prototype.onAfterRendering.apply(this, arguments);

		if (!this._sHandleItemsChanged) {
			// if _handleItemsChanges is executed, checkValueInItems is executed inside
			this.checkValueInItems();
		}

	};

	/*
	 * Handle items aggregation (if Popup is opened, ListBox has invalid data because of history and filter)
	 */
	DropdownBox.prototype.getItems = function(){

		if (this.oPopup && this.oPopup.isOpen()) {
			// take items from typeAhead array
			return this.__aItems;
		} else {
			return ComboBox.prototype.getItems.apply(this, arguments);
		}

	};
	DropdownBox.prototype.insertItem = function(oItem, iIndex){
		if (this.oPopup && this.oPopup.isOpen()) {
			// take items from typeAhead array
			this.__aItems.splice(iIndex, 0, oItem);
			if (this.__aItems.length <= this._iItemsForHistory && !this._searchHelpItem) {
				// if no history ListBox is not changed -> update ListBox too
				this._getListBox().insertItem(oItem, iIndex);
			}
			if (!this._bNoItemCheck) {
				// history might be not up do date -> rebuild; suppose the text before cursor is just typed in to use filter
				var $Ref = jQuery(this.getInputDomRef());
				var iCursorPos = $Ref.cursorPos();
				this._doTypeAhead($Ref.val().substr(0, iCursorPos), "");
			}
			return this;
		} else {
			return ComboBox.prototype.insertItem.apply(this, arguments);
		}
	};
	DropdownBox.prototype.addItem = function(oItem){
		if (this.oPopup && this.oPopup.isOpen()) {
			// take items from typeAhead array
			this.__aItems.push(oItem);
			if (this.__aItems.length <= this._iItemsForHistory && !this._searchHelpItem) {
				// if no history ListBox is not changed -> update ListBox too
				this._getListBox().addItem(oItem);
			}
			if (!this._bNoItemCheck) {
				// history might be not up do date -> rebuild; suppose the text before cursor is just typed in to use filter
				var $Ref = jQuery(this.getInputDomRef());
				var iCursorPos = $Ref.cursorPos();
				this._doTypeAhead($Ref.val().substr(0, iCursorPos), "");
			}
			return this;
		} else {
			return ComboBox.prototype.addItem.apply(this, arguments);
		}
	};
	DropdownBox.prototype.removeItem = function(vElement) {
		if (this.oPopup && this.oPopup.isOpen()) {
			// take items from typeAhead array
			var oItem = null;
			var vOriginalElement = vElement;

			if (typeof (vElement) == "string") { // ID of the element is given
				vElement = sap.ui.getCore().byId(vElement);
			}

			if (typeof (vElement) == "object") { // the element itself is given or has just been retrieved
				for (var i = 0; i < this.__aItems.length; i++) {
					if (this.__aItems[i] == vElement) {
						vElement = i;
						break;
					}
				}
			}

			if (typeof (vElement) == "number") { // "vElement" is the index now
				if (vElement < 0 || vElement >= this.__aItems.length) {
					jQuery.sap.log.warning("Element.removeAggregation called with invalid index: Items, " + vElement);

				} else {
					oItem = this.__aItems[vElement];
					this.__aItems.splice(vElement, 1);
				}
			}
			if (this.__aItems.length <= this._iItemsForHistory && !this._searchHelpItem) {
				// if no history ListBox is not changed -> update ListBox too
				this._getListBox().removeItem(vOriginalElement);
			}
			if (!this._bNoItemCheck) {
				// history might be not up do date -> rebuild; suppose the text before cursor is just typed in to use filter
				var $Ref = jQuery(this.getInputDomRef());
				var iCursorPos = $Ref.cursorPos();
				this._doTypeAhead($Ref.val().substr(0, iCursorPos), "");
			}
			return oItem;
		} else {
			return ComboBox.prototype.removeItem.apply(this, arguments);
		}
	};
	DropdownBox.prototype.removeAllItems = function() {
		if (this.oPopup && this.oPopup.isOpen()) {
			// take items from typeAhead array
			var aItems = this.__aItems;
			if (!aItems) {
				return [];
			}

			// as an empty list can not have an history or an searchHelp just clear List
			ComboBox.prototype.removeAllItems.apply(this, arguments);

			this.__aItems = [];

			return aItems;
		} else {
			return ComboBox.prototype.removeAllItems.apply(this, arguments);
		}
	};
	DropdownBox.prototype.indexOfItem = function(oItem){
		if (this.oPopup && this.oPopup.isOpen()) {
			// take items from typeAhead array
			if (this.__aItems) {
				if (this.__aItems.length == undefined) {
					return -2;
				} // not a multiple aggregation

				for (var i = 0; i < this.__aItems.length; i++) {
					if (this.__aItems[i] == oItem) {
						return i;
					}
				}
			}
			return -1;
		} else {
			return ComboBox.prototype.indexOfItem.apply(this, arguments);
		}
	};
	DropdownBox.prototype.destroyItems = function(){
		if (this.oPopup && this.oPopup.isOpen()) {
			// take items from typeAhead array
			if (!this.__aItems) {
				return this;
			}

			// first remove all items from ListBox and then destroy them,
			// do not use destroy function from ListBox because history items and search field item
			// must not be destroyed
			this._getListBox().removeAllItems();

			for (var i = 0; i < this.__aItems.length; i++) {
				if (this.__aItems[i]) {
					this.__aItems[i].destroy();
				}
			}
			this.__aItems = [];

			return this;
		} else {
			return ComboBox.prototype.destroyItems.apply(this, arguments);
		}
	};

	DropdownBox.prototype.updateItems = function(){

		ComboBox.prototype.updateItems.apply(this, arguments);

		if (this.oPopup && this.oPopup.isOpen()) {
			// history might be not up do date -> rebuild; suppose the text before cursor is just typed in to use filter
			var $Ref = jQuery(this.getInputDomRef());
			var iCursorPos = $Ref.cursorPos();
			this._doTypeAhead($Ref.val().substr(0, iCursorPos), "");
		}

	};

	DropdownBox.prototype._handleItemsChanged = function(oEvent, bDelayed){

		if (bDelayed) {
			// Items are updated by binding. As items can be "reused" and have same IDSs,
			// only one check at the end of all changes is needed
			// only clear if really from an delayed call
			this._sHandleItemsChanged = null;
			this._bNoItemCheck = undefined;
		}

		if (this._bNoItemCheck) {
			return;
		}

		if (this.__aItems && (!this.oPopup || !this.oPopup.isOpen())) {
			// if popup is closed internal typeAhead item array must be cleared -> otherwise items could be inconsistent
			throw new Error("DropdownBox " + this.getId() + " : this.__aItems is not empty!");
		}
		if (this.getListBox() && this.oPopup && this.oPopup.isOpen()) {
			// items are maintained directly on ListBox adjust internal item array
			if (this.__aItems.length > this._iItemsForHistory || this._searchHelpItem) {
				var oItem;
				var i = 0;
				switch (oEvent.getParameter("event")) {
				case "destroyItems":
					// destroy items not destroyed from ListBox
					for (i = 0; i < this.__aItems.length; i++) {
						oItem = this.__aItems[i];
						if ( !oItem.bIsDestroyed ) {
							oItem.destroy();
						}
					}
					this.__aItems = [];
					if (this.getSearchHelpEnabled()) {
						// recreate search help and separator item
						this._searchHelpItem = null;
						this.setSearchHelpEnabled(this.getSearchHelpEnabled(), this.getSearchHelpText(), this.getSearchHelpAdditionalText(), this.getSearchHelpIcon());
					}
					break;
				case "removeAllItems":
					this.__aItems = [];
					break;
				case "removeItem":
					oItem = oEvent.getParameter("item");
					for (i = 0; i < this.__aItems.length; i++) {
						if (this.__aItems[i] == oItem) {
							this.__aItems.splice(i, 1);
							break;
						}
					}
					if (this.__aItems.length <= this._iItemsForHistory) {
						// now we don't have a filter or history any longer -> set all items to ListBox
						this._getListBox().setItems(this.__aItems, false, true);
					}
					break;
				case "insertItem":
					this.__aItems.splice(oEvent.getParameter("index"), 0, oEvent.getParameter("item"));
					break;
				case "addItem":
					this.__aItems.push(oEvent.getParameter("item"));
					break;
				case "setItems":
					this.__aItems = oEvent.getParameter("items");
					break;
				case "updateItems":
					// destroy items not destroyed from ListBox
					for (i = 0; i < this.__aItems.length; i++) {
						oItem = this.__aItems[i];
						if ( !oItem.bIsDestroyed ) {
							oItem.destroy();
						}
					}
					if (this.getSearchHelpEnabled()) {
						// recreate search help and separator item
						this._searchHelpItem = null;
						this.setSearchHelpEnabled(this.getSearchHelpEnabled(), this.getSearchHelpText(), this.getSearchHelpAdditionalText(), this.getSearchHelpIcon());
					}
					this.__aItems = this._getListBox().getItems();
					break;
				default:
					break;
				}
			} else {
				// no filter, no additional items
				this.__aItems = this._getListBox().getItems();
			}
			// history might be not up do date -> rebuild; suppose the text before cursor is just typed in to use filter
			var $Ref = jQuery(this.getInputDomRef());
			var iCursorPos = $Ref.cursorPos();
			this._doTypeAhead($Ref.val().substr(0, iCursorPos), "");
		}

		ComboBox.prototype._handleItemsChanged.apply(this, arguments);

		this.checkValueInItems();
	};

	//***********************************************************
	//Mouse handling...
	//***********************************************************

	/**
	 * Handle the click event happening in the DropdownBox
	 * @param {jQuery.Event} oEvent The event object.
	 * @protected
	 */
	DropdownBox.prototype.onclick = function(oEvent) {

		if (!this.mobile && this.getEnabled && this.getEnabled() && this.getEditable()) {
			if (this.oPopup && this.oPopup.isOpen()) {
				this._close();
				this._doSelect();
			} else if (!this._F4ForClose) {
				this._open();
			}
			this.focus();
		}
		this._F4ForClose = false;

	};

	DropdownBox.prototype.onmousedown = function(oEvent){

		if (!this.getEnabled() || !this.getEditable()) {
			return;
		}

		// DropdownBox opens and closes on click on F4-Button and on input field
		if (this.oPopup && this.oPopup.isOpen()) {
			this._F4ForClose = true;
		} else {
			this._F4ForOpen = true;
		}

		ComboBox.prototype.onmousedown.apply(this, arguments);

	};


	//***********************************************************
	//Keyboard handling...
	//***********************************************************

	/**
	 * Handle sapshow pseudo events on the control
	 * @param {jQuery.Event} oEvent The event object.
	 * @protected
	 */
	DropdownBox.prototype.onsapshow = function(oEvent){

		if (this.mobile) {
			return;
		}

		if (!this.getEnabled() || !this.getEditable()) {
			oEvent.preventDefault();
			oEvent.stopImmediatePropagation();
			return;
		}

		if (oEvent.which === jQuery.sap.KeyCodes.F4 && this._searchHelpItem) {
			this._close();
			this.fireSearchHelp({value: jQuery(this.getInputDomRef()).val()});
			oEvent.preventDefault();
			oEvent.stopImmediatePropagation();
			return;
		}
		if (this.oPopup && this.oPopup.isOpen()) {
			this._close();
		} else {
			this._open();
			var oLB = this._getListBox();
			oLB.scrollToIndex(oLB.getSelectedIndex());
			this._doSelect();
		}
		oEvent.preventDefault();
		oEvent.stopImmediatePropagation();
	};

	/**
	 * Handle keydown event
	 * @param {jQuery.Event} oEvent the occuring event
	 * @protected
	 */
	DropdownBox.prototype.onkeydown = function(oEvent) {

		if (oEvent.target.id == this.getId() + "-select") {
			// on native dropdown -> no own keyboard handling
			return;
		}

		if (!!sap.ui.Device.browser.webkit && (oEvent.which == jQuery.sap.KeyCodes.DELETE || oEvent.which == jQuery.sap.KeyCodes.BACKSPACE)) {
			// Webkit do not fire keypress event for DELETE or BACKSPACE
			// IE also fires no keypress but an input event, so it's handled there
			this.onkeypress(oEvent);
		}

		if (!sap.ui.Device.browser.internet_explorer || oEvent.which !== jQuery.sap.KeyCodes.BACKSPACE) {
			return;
		}

		// Quite a trick to solve the issue with 'delete from last cursorPos' vs. 'delete last (proposed / auto-completed) character in IE
		this._iCursorPosBeforeBackspace = jQuery(this.getInputDomRef()).cursorPos();
	};

	/**
	 * Handle paste event
	 * @param {jQuery.Event} oEvent the occuring event
	 * @protected
	 */
	DropdownBox.prototype.onpaste = function(oEvent) {

		if (oEvent.target.id == this.getId() + "-select") {
			// on native dropdown -> no own keyboard handling
			return;
		}

		//prevent 'multiple-pastes' by e.g. holding down paste combination.
		if (this._oValueBeforePaste === null) {
			this._oValueBeforePaste = jQuery(this.getInputDomRef()).val();
		}

	};

	DropdownBox.prototype.oncut = DropdownBox.prototype.onpaste;

	DropdownBox.prototype.oninput = function(oEvent) {

		if (this.mobile) {
			// as no real input is possible on mobile devices
			return;
		}

		if (!this._realOninput(oEvent)) {
			return;
		}

		var $Ref = jQuery(this.getInputDomRef());
		var sVal = $Ref.val();
		if (!this.oPopup || !this.oPopup.isOpen()) {
			this.noTypeAheadByOpen = true; // no typeahead and rerendering during open because of ARIA update issues
			this._open();
			this.noTypeAheadByOpen = undefined;
		}
		var bValid = this._doTypeAhead(sVal, "");
		if (!bValid && this._oValueBeforePaste) {
			this._doTypeAhead("", this._oValueBeforePaste);
		}
		this._oValueBeforePaste = null;
		this._fireLiveChange(oEvent);

	};

	/**
	 * Handle keyup event
	 * This must only be considered if it is from Backspace-key in IE or after paste.
	 * In case there is a keyup with a tab this results from being entered via tabbing and can be ignored, too.
	 * @param {jQuery.Event} oEvent the occuring event
	 * @protected
	 */
	DropdownBox.prototype.onkeyup = function(oEvent) {

		if (oEvent.target.id == this.getId() + "-select") {
			// on native dropdown -> no own keyboard handling
			return;
		}

		if (!this.getEnabled() || !this.getEditable()) {
			return;
		}

		var iKC = oEvent.which,
			oKC = jQuery.sap.KeyCodes;

		// call keyup function of TextField to get liveChange event
		sap.ui.commons.TextField.prototype.onkeyup.apply(this, arguments);

		if (!(!!sap.ui.Device.browser.internet_explorer && iKC === oKC.BACKSPACE) && this._oValueBeforePaste === null || iKC === oKC.TAB) {
			return;
		}
		// it's either backspace in IE or after paste (cumulating potentially multiple pastes, too)

		// as it is keyboard interaction, open the proposal list (if not yet done)
		if (!this.oPopup || !this.oPopup.isOpen()) {
			this.noTypeAheadByOpen = true; // no typeahead and rerendering during open because of ARIA update issues
			this._open();
			this.noTypeAheadByOpen = undefined;
		}
		var $Ref = jQuery(this.getInputDomRef()),
			bValid = false;
		// the first case (backspace-handling) could only be true in IE. For FF we do this (less 'tricky') in keypress handler
		if (iKC === oKC.BACKSPACE && this._iCursorPosBeforeBackspace !== null) {
			var iCursorPos = $Ref.cursorPos();
			if (this._iCursorPosBeforeBackspace !== iCursorPos) {
				iCursorPos++;
			} // 'normalize' cursor position for upcoming handling...
			this._iCursorPosBeforeBackspace = null; // forget being called by backspace handling
			bValid = this._doTypeAhead($Ref.val().substr(0, iCursorPos - 1), "");
		} else if (!(bValid = this._doTypeAhead("", $Ref.val()))) {
			// this must happen to check for valid entry after paste and if required -> rollback
			$Ref.val(this._oValueBeforePaste);
		}
		// Ensure visibility as well as filtering and new height is applied
		if (bValid) {
			this._getListBox().rerender();
		}

		this._oValueBeforePaste = null;
	};

	/**
	 * Handle pseudo event onsaphome
	 * @param {jQuery.Event} oEvent the occuring event
	 * @protected
	 */
	DropdownBox.prototype.onsaphome = function(oEvent) {

		if (oEvent.target.id == this.getId() + "-select") {
			// on native dropdown -> no own keyboard handling
			return;
		}

		if ((!this.oPopup || !this.oPopup.isOpen()) && this.getEditable() && this.getEnabled()) {
			sap.ui.commons.TextField.prototype.onsaphome.apply(this, arguments); // before setting the cursor to have old cursor position in there
			var $Ref = jQuery(this.getInputDomRef());
			$Ref.cursorPos(0);
			this._updateSelection();
			oEvent.preventDefault();
		} else {
			ComboBox.prototype.onsaphome.apply(this, arguments);
		}
	};

	/**
	 * Handle pseudo event onsapdelete.
	 * If triggered with open dropdown and current item provided by history feature,
	 * removes the selected item from this instance's history.
	 * @param {jQuery.Event} oEvent the occuring event
	 * @protected
	 */
	DropdownBox.prototype.onsapdelete = function(oEvent) {

		if (oEvent.target.id == this.getId() + "-select") {
			// on native dropdown -> no own keyboard handling
			return;
		}

		if (!this.oPopup || !this.oPopup.isOpen()) {
			return;
		}
		var oLB = this._getListBox(),
			oItem = oLB.getSelectedItem(),
			aMatches = oItem.getId().match(/\-h\-([0-4])/),
			iIdx = oLB.getSelectedIndex();
		if (aMatches && aMatches.length === 2) {
			this._oHistory.remove(oItem.getText());
			oLB.removeItem(iIdx);
			var iLength = this._oHistory.get().length;
			if (iLength === 0) {// remove separator element, too
				oLB.removeItem(0);
			}
			oLB.rerender();
			var iNewIndex = iIdx + (this._searchHelpItem ? 2 : 0);
			if (iNewIndex == iLength) {
				// seperator item can not selected
				iNewIndex++;
			}
			oLB.setSelectedIndex(iNewIndex);
			this.setValue(oLB.getSelectedItem().getText());
		}
	};

	/**
	 * Handle keypress event
	 * @param {jQuery.Event} oEvent the occuring event
	 * @protected
	 */
	DropdownBox.prototype.onkeypress = function(oEvent) {

		if (oEvent.target.id == this.getId() + "-select") {
			// on native dropdown -> no own keyboard handling
			return;
		}

		if (!this.getEnabled() || !this.getEditable()) {
			return;
		}

		var iKC = oEvent.which,
			iKeyCode = oEvent.keyCode,
			oKC = jQuery.sap.KeyCodes;
		if (( ComboBox._isHotKey(oEvent)
			    || ( !!sap.ui.Device.browser.firefox && iKeyCode === oKC.HOME ) || // IE & webkit fires no keypress on HOME, but "$" has the same keyCode
				iKeyCode === oKC.F4 && oEvent.which === 0 ) /*this is the Firefox case and ensures 's' with same charCode is accepted*/
				&& !(oEvent.ctrlKey && oEvent.which == 120)/*Ctrl+X*/ ) {
			return;
		} else if (iKeyCode == oKC.ESCAPE) {
			var sValue = this.getProperty("value");
			var oInput = this.getInputDomRef();
			if (oInput && oInput.value !== sValue) {
				jQuery(oInput).val(sValue);
			}
			return;
		}
		var oNewChar = String.fromCharCode(iKC),
			$Ref = jQuery(this.getInputDomRef()),
			iCursorPos = $Ref.cursorPos(),
			sVal = $Ref.val();
		//jQuery.sap.log.debug("current value is: " + sVal + " with cursorPos: " + iCursorPos + " and newChar is: " + oNewChar);

		if (!this.oPopup || !this.oPopup.isOpen()) {
			this.noTypeAheadByOpen = true; // no typeahead and rerendering during open because of ARIA update issues
			this._open();
			this.noTypeAheadByOpen = undefined;
		}
		if (iKC === oKC.BACKSPACE) {// only happens in FF or other non-IE-browsers. Webkit or IE does not support BACKSPACE in keypress, but in Webkit it's called from keydown
			this._doTypeAhead(sVal.substr(0, iCursorPos - 1), "");
		} else {
			this._doTypeAhead(sVal.substr(0, iCursorPos), oNewChar);
		}
		this._fireLiveChange(oEvent);

		oEvent.preventDefault();
	};

	/**
	 * Move the cursor one step to the right (and adapt selection)
	 * @param {jQuery.Event} oEvent The event object.
	 * @protected
	 */
	DropdownBox.prototype.onsapright = function(oEvent) {

		if (oEvent.target.id == this.getId() + "-select") {
			// on native dropdown -> no own keyboard handling
			return;
		}

		if (!this.getEnabled() || !this.getEditable()) {
			return;
		}

		var bRtl = sap.ui.getCore().getConfiguration().getRTL();
		if (!bRtl) {
			this._updateSelection(1);
		} else {
			this._updateSelection( -1);
		}
		oEvent.preventDefault();
	};

	/**
	 * Move the cursor one step to the left (and adapt selection)
	 * @param {jQuery.Event} oEvent The event object.
	 * @protected
	 */
	DropdownBox.prototype.onsapleft = function(oEvent) {

		if (oEvent.target.id == this.getId() + "-select") {
			// on native dropdown -> no own keyboard handling
			return;
		}

		if (!this.getEnabled() || !this.getEditable()) {
			return;
		}

		var bRtl = sap.ui.getCore().getConfiguration().getRTL();
		if (!bRtl) {
			this._updateSelection( -1);
		} else {
			this._updateSelection(1);
		}
		oEvent.preventDefault();
	};


	//***********************************************************
	// Focus handling...
	//***********************************************************

	/**
	 * Handle focusin event
	 * Ensures the text gets selected when focus gets into the field
	 * @param {jQuery.Event} oEvent the occuring event
	 * @protected
	 */
	DropdownBox.prototype.onfocusin = function(oEvent) {

		if (!this.oPopup || !this.oPopup.isOpen() || this._bFocusByOpen) {
			// if popup is open the text-selection is made by doTypeAhead
			// do not select all text in this case
			var $Ref = jQuery(this.getInputDomRef()),
			l = $Ref.val().length;
			if (l > 0 && !this.mobile) {
				this._doSelect(0, l);
			}
			this._bFocusByOpen = undefined;
		}
		ComboBox.prototype.onfocusin.apply(this, arguments);
	};


	//***********************************************************
	// Text selection handling...
	//***********************************************************

	/**
	 * Handle the select event happening in the DropdownBox
	 * @param {jQuery.Event} oEvent The event object.
	 * @protected
	 */
	DropdownBox.prototype.onselect = function(oEvent) {

		var iTimeStamp = new Date().getTime();

		if (this._bIgnoreSelect) {
			this._bIgnoreSelect = false;
			this.iOldTimestamp = iTimeStamp;
			return;
		}
		if (this.iOldTimestamp && iTimeStamp - this.iOldTimestamp < 50) {
			// prevent double call of event in IE9 and jQuery 1.7.1
			return;
		}
		this.iOldTimestamp = undefined;

		if (!this.getEnabled() || !this.getEditable()) {
			return;
		}

		var $Ref = jQuery(this.getInputDomRef()),
			iNewCursor = $Ref.cursorPos(),
			sVal = $Ref.val();
		if (sVal.length > 0 && iNewCursor > 0) {
			// if nothing is selected do not initialate value
			this._doTypeAhead(sVal.substr(0,iNewCursor), "");
			if (!this.oPopup || !this.oPopup.isOpen()) {
				// as popup is not open restore listbox item like on popup close
				this._cleanupClose(this._getListBox());
			}
		}
		oEvent.preventDefault();
	};

	DropdownBox.prototype._determinePosinset = function(aItems, iNewIndex){

		var iPos = iNewIndex + 1;

		if (this.oPopup && this.oPopup.isOpen()) {
			this.dontSetPoisinset = undefined;
			var oItem = aItems[iNewIndex];
			// history and search help only available if open
			var bHistory = aItems[0].getId().search(this.getId() + "-h-") != -1;

			if (oItem.getId().search(this.getId() + "-h-") == -1) {
				// no history item
				if (bHistory) {
					//but history items available-> remove separator from index
					iPos = iPos - 1;
				}
				if (this._searchHelpItem) {
					// search help -> remove from index
					iPos = iPos - 2;
				}
			}
		}

		return iPos;

	};

	/**
	 * Selects the text of the InputDomRef in the given range
	 * @param {int} [iStart=0] start position of the text selection
	 * @param {int} [iEnd=<length of text>] end position of the text selection
	 * @return {sap.ui.commons.DropdownBox} this DropdownBox instance
	 * @private
	 */
	DropdownBox.prototype._doSelect = function(iStart, iEnd){

		this._bIgnoreSelect = true;

		var oDomRef = this.getInputDomRef();

		if (oDomRef) {
			//if no Dom-Ref - no selection (Maybe popup closed)
			var $Ref = jQuery(oDomRef);
			// do not call focus in DropdownBox
			$Ref.selectText(iStart ? iStart : 0, iEnd ? iEnd : $Ref.val().length);
		}

		return this;

	};

	/**
	 * Adapt the selection to the cursor position and move the curser beforehand (if parameter iMoveBy is given)
	 * @param {int} iMoveBy the number of places the cursor should move (can be positive (move right) or negative (move left))
	 * @private
	 */
	DropdownBox.prototype._updateSelection = function(iMoveBy) {
		var $Ref = jQuery(this.getInputDomRef()),
			iNewCursor = $Ref.cursorPos() + (iMoveBy || 0),
			sVal = $Ref.val();
		this._doTypeAhead(sVal.substr(0,iNewCursor), "");
		if (!this.oPopup || !this.oPopup.isOpen()) {
			// as popup is not open restore listbox item like on popup close
			this._cleanupClose(this._getListBox());
		} else {
			this._getListBox().rerender();
		}
	};


	//***********************************************************
	// Type ahead and list box related
	//***********************************************************

	/*
	 * Returns whether the new value is a valid one
	 * @param {object} oValue the value before the event
	 * @param {string} oNewChar the newly added character
	 * @param {boolean} bNoFilter omit the filtering (e.g. when opening the listbox)
	 * @param {int} iItemIndex use this item, only mix up hitory and filter
	 * @returns {boolean} whether the new value is a valid one
	 * @private
	 */
	DropdownBox.prototype._doTypeAhead = function(oValue, oNewChar, bNoFilter, iItemIndex){
		if (this.__doTypeAhead === true) {
			return; // recursive from opening the Popup and the _prepareOpen-method
		}
		this.__doTypeAhead = true;
		this._sWantedSelectedKey = undefined; // something typed -> do not search again for not existing items
		this._sWantedSelectedItemId = undefined;
		this._sWantedValue = undefined;

		var oLB = this._getListBox(),
			//oSelectedItem = oLB.getSelectedItem(),
			iMaxPopupItems = this.getMaxPopupItems(),
			aItems = this.__aItems || oLB.getItems(),
			iVisibleItemsCnt = aItems.length,
			// filtering and history only apply when more than a certain number of items is there
			bHistory = aItems.length > this._iItemsForHistory,
			bFilter = !bNoFilter && bHistory,
			oNewValue = oValue + oNewChar,
			oSpecials = new RegExp("[.*+?|()\\[\\]{}\\\\]", "g"), // .*+?|()[]{}\
			sRegExpValue = oNewValue.toLowerCase().replace(oSpecials, "\\$&"), //escape special characters
			rValFilter = RegExp("^" + sRegExpValue + ".*$"),
			iMove = oNewChar && oNewChar.length || 0,
			$Ref = jQuery(this.getInputDomRef());

		this.__aItems = aItems;

		if (iVisibleItemsCnt <= 0) {
			// no items -> no typeAhead possible -> everything is wrong
			this.__doTypeAhead = false;
			return false;
		}

		var aCurrentItems,
			// identify items matching already entered value (for autocomplete, item selection)
			aFilteredItems = this._getFilteredItems(aItems, rValFilter),
			bValid = aFilteredItems.length > 0;

		if (!bValid) {
			// if not valid just show all items
			bFilter = false;
		}
		// in case we have to filter, only the matching subset of the current items (the configured set) is relevant for display
		if (bFilter) {
			aCurrentItems = aFilteredItems;
		} else {
			aCurrentItems = aItems.slice(0);
		}

		var aHistoryItems = [];
		if (bHistory) {
			aHistoryItems = this._addHistoryItems(aCurrentItems, bFilter && rValFilter);
			oLB.setItems(aCurrentItems, false, true); // fire no itemsChanged event because this would update Value property
			iVisibleItemsCnt = aCurrentItems.length;
		}
		oLB.setVisibleItems(iMaxPopupItems < iVisibleItemsCnt ? iMaxPopupItems : -1);

		var oItem,
		iHistLength = aHistoryItems.length;
		var i = 0;

		if (iItemIndex >= 0) {
			// use the required item
			oItem = aItems[iItemIndex];
		}
		// if there is no filter (e.g. when opening) but a history, try to find the current value in the history
		if (!bFilter && iHistLength > 0 && bValid) {
			aHistoryItems = this._getFilteredItems(aHistoryItems, rValFilter);
			oItem = aHistoryItems[0];
		}
		// in case there is filtering in place, select the first (valid) item
		if (bFilter) {
			oItem = aFilteredItems[0];
		} else if (!oItem) {
			// in case there was no filtering and no valid item from history
			// select the first of the filtered non-history items
			if (aFilteredItems.length > 0) {
				oItem = aFilteredItems[0];
			} else {// use last valid item
				var sOldValue = $Ref.val();
				var iFirstItem = 0;
				for ( i = 0; i < aCurrentItems.length; i++) {
					var oCheckItem = aCurrentItems[i];
					if (oCheckItem.getEnabled()) {
						if (!iFirstItem) {
							iFirstItem = i;
						}
						if (oCheckItem.getText() == sOldValue) {
							oItem = oCheckItem;
							break;
						}
					}
				}
				if (!oItem) {// still no item found - use first one (can this happen???)
					oItem = aCurrentItems[iFirstItem];
				}
			}
		}
		// OK, we know what to select, let's insert search help if required
		var oSHI = this._searchHelpItem;
		if (oSHI) {
			aCurrentItems.splice(iHistLength++, 0, oSHI[0], oSHI[1]);
			oLB.setItems(aCurrentItems, false, true); // fire no itemsChanged event because this would update Value property
		}
		// find and select the item and update the text and the selection in the inputfield
		i = oLB.indexOfItem(oItem);
		var sText = oItem.getText();
		var iPos = i + 1;
		var iSize = aCurrentItems.length;
		if (aHistoryItems.length > 0) {
			iSize = iSize - 1;
		}
		if (oSHI) {
			iSize = iSize - 2;
		}
		if (iPos > aHistoryItems.length) {
			if (aHistoryItems.length > 0) {
				// no history item but history available -> remove separator from position
				iPos = iPos - 1;
			}
			if (oSHI) {
				// search help -> remove search help item and separator from position
				iPos = iPos - 2;
			}
		}
		this._updatePosInSet( $Ref, iPos, (oItem.getAdditionalText ? oItem.getAdditionalText() : ""));
		$Ref.attr("aria-setsize", iSize);
		$Ref.val(sText);
		this._sTypedChars = oNewValue;
		this._doSelect(oValue.length + iMove, sText.length);

		oLB.setSelectedIndex(i);
		if (oSHI && i == 2) {
			// special case -> search help item exist and first real item selected -> show search help too
			oLB.scrollToIndex(0);
		} else {
			oLB.scrollToIndex(i);
		}
		this._iClosedUpDownIdx = i;

		if (!bValid) {
			$Ref = this.$();
			$Ref.addClass("sapUiTfErr");
			jQuery.sap.delayedCall(300, $Ref, "removeClass", ["sapUiTfErr"]);
			// move cursor back to old position and select from there
			$Ref.cursorPos(oValue.length);
			this._doSelect(oValue.length, sText.length);
		}
		this.__doTypeAhead = false;
		return bValid;
	};

	/**
	 * Walks over the list of available items in the given oListBox and updates the visual selection.
	 * Also updates the Popup to show the right content.
	 *
	 * @param {sap.ui.commons.ListBox} oListBox listBox belonging to this ComboBox instance.
	 * @param {sap.ui.core.Popup} oPopup the instance of the Popup functionality used for opening the proposal list
	 * @returns {sap.ui.commons.DropdownBox} DropdownBox
	 * @private
	 */
	DropdownBox.prototype._prepareOpen = function(oListBox, oPopup){
		this._oValueBeforeOpen = this.$().val();

		// remember we opening the popup (needed in applyFocusInfo called after rerendering of ListBox)
		this._Opening = true;

		if (!this.noTypeAheadByOpen) {
			// there might be items with same text -> try to find out what is currently selected.
			var iItemIndex;
			if (this._iClosedUpDownIdx >= 0) {
				iItemIndex = this._iClosedUpDownIdx;
			} else if (this.getSelectedItemId()) {
				iItemIndex = this.indexOfItem(sap.ui.getCore().byId(this.getSelectedItemId()));
			}
			this._doTypeAhead("", jQuery(this.getInputDomRef()).val(), true, iItemIndex);
		}
		return this;
	};

	DropdownBox.prototype._handleOpened = function(){

		ComboBox.prototype._handleOpened.apply(this, arguments);

		if (!sap.ui.Device.browser.internet_explorer) {
			// because in IE already async made in ComboBox
			jQuery(this.getInputDomRef()).focus();
		} else {
			this._bFocusByOpen = true;
		}

	};

	/**
	 * Ensures the given listbox is 'cleaned-up'.
	 * @param {sap.ui.commons.ListBox} oListBox the listBox to clean up
	 * @returns {sap.ui.commons.DropdownBox} this instance of DropdownBox
	 * @private
	 */
	DropdownBox.prototype._cleanupClose = function(oListBox){
		if (this.__aItems) {
			// restore selected Item
			var oSelectedItem = oListBox.getSelectedItem();
			oListBox.setItems(this.__aItems, false, true); // fire no itemsChanged event because this would update Value property
			this._iClosedUpDownIdx = oListBox.indexOfItem(oSelectedItem);
			oListBox.setSelectedIndex(this._iClosedUpDownIdx);
			this.__aItems = undefined;
		}
		this._oValueBeforeOpen = null;
		this._Opening = undefined;
		return this;
	};

	/**
	 * Returns an array of ListItems matching given rValFilter.
	 *
	 * @param {sap.ui.core.ListItem[]} aItems array of list items to be filtered
	 * @param {RegExp} rValFilter filter expression that can be used to identify valid items
	 * @returns {sap.ui.core.ListItem[]} array of list items matching given rValFilter
	 * @private
	 */
	DropdownBox.prototype._getFilteredItems = function(aItems, rValFilter){
		var aTmpItems = aItems.slice(0),
			oItem;
		for (var i = aTmpItems.length - 1; i >= 0; i--) {
			oItem = aTmpItems[i];
			if (!rValFilter.test(oItem.getText().toLowerCase()) || !oItem.getEnabled()) {
				aTmpItems.splice(i,1);
			}
		}
		return aTmpItems;
	};

	/**
	 * Enriches provided array of listitems with history if history entries matching given rFilter exist.
	 *
	 * @param {sap.ui.core.ListItem[]} aItems array of list items to be enriched by history
	 * @param {RegExp} rFilter filter expression that can be used to identify valid history items
	 * @returns {sap.ui.core.ListItem[]} array of new 'history-list-items' (comprising separator)
	 * @private
	 */
	DropdownBox.prototype._addHistoryItems = function(aItems, rFilter) {
		var sIdPrefix = this.getId() + "-h-",
			oItem,
			aHistory = this._oHistory.get(),
			l = aHistory.length,
			aNewItems = [];
		// add items from history still matching given set of items
		for (var i = 0, j = 0; j < this.getMaxHistoryItems() && i < l; i++) {
			if (!rFilter || rFilter.test(aHistory[i])) {
				oItem = (oItem = sap.ui.getCore().byId(sIdPrefix + j)) && oItem.setText(aHistory[i]) || new sap.ui.core.ListItem(sIdPrefix + j, {text: aHistory[i]});
				aNewItems.push(oItem);
				j++;
			}
		}

		if (aNewItems.length > 0) {
			var sSepId = sIdPrefix + "separator",
				oSeparator = this._getSeparator(sSepId);
			aNewItems.push(oSeparator);
		}
		aItems.unshift.apply(aItems, aNewItems);
		return aNewItems;
	};

	/**
	 * Returns the separator instance for this DropdownBox.
	 * If sSepId is given, this id will be used to either find or create the Separator.
	 * If sSepId is omitted, only previously found separator will be returned but no new Separator would be created.
	 *
	 * @param {string} [sSepId] id of the separator to find or create. If omitted, only previously found separator will be returned.
	 * @returns {sap.ui.core.SeparatorItem} separator item if found or created or null.
	 */
	DropdownBox.prototype._getSeparator = function(sSepId){
		if (!this.__oSeparator && sSepId) {
			this.__oSeparator = sap.ui.getCore().byId(sSepId) || new SeparatorItem(sSepId);
		}
		return this.__oSeparator || null;
	};


	//***************************************************
	// Overwritten methods from API
	//***************************************************

	/* overwrite standard generated fireChange method */
	DropdownBox.prototype.fireChange = function(mArguments) {
		this.fireEvent("change", mArguments);
		if (mArguments.newValue && (this.getMaxHistoryItems() > 0)) {
			this._oHistory.add(mArguments.newValue);
		}

		this._sWantedValue = undefined;
		return this;
	};

	/* overrides generated setValue-method */
	DropdownBox.prototype.setValue = function(sValue, bNotSetSelectedKey) {
		// normalize 'empty'  values
		sValue = (sValue === undefined || sValue === null || sValue === "") ? "" : sValue;
		var aItems = this.getItems(),
			sText,
			bValueOK = false,
			sFirstEnabledValue;

		// it might be necessary to also check for history... but as this should only contain valid entries, don't worry.
		for (var i = 0, l = aItems.length; i < l && !bValueOK; i++) {
			var oItem = aItems[i];
			var bEnabled = oItem.getEnabled();
			sText = oItem.getText();
			if ( bEnabled && !sFirstEnabledValue) {
				sFirstEnabledValue = sText;
			}
			bValueOK = sText === sValue && bEnabled;
		}

		// only set the value in case the given one is valid
		if (bValueOK) {
			ComboBox.prototype.setValue.call(this, sValue, bNotSetSelectedKey);
			this._sWantedValue = undefined;
		} else if (sValue === "" && aItems.length > 0) {
			// initialize Dropdownbox to first valid Value
			ComboBox.prototype.setValue.call(this, sFirstEnabledValue, bNotSetSelectedKey);
		} else {
			// remember wanted value for check if items are updated
			this._sWantedValue = sValue;
		}

		return this;
	};


	//***********************************************************
	//Focus information handling and rendering related
	//***********************************************************

	/**
	 * Applies the focus info and ensures the typeAhead feature is re-established again.
	 *
	 * @param {object} oFocusInfo the focus information belonging to this dropdown
	 * @returns {sap.ui.commons.DropdownBox} DropdownBox
	 * @private
	 */
	DropdownBox.prototype.applyFocusInfo = function(oFocusInfo){
		var $Inp = jQuery(this.getInputDomRef());
		if (jQuery.sap.startsWithIgnoreCase(this.getValue(), oFocusInfo.sTypedChars)) {
			$Inp.val(oFocusInfo.sTypedChars);
			this.focus();
			if (!this.getSelectedItemId() || sap.ui.getCore().byId(this.getSelectedItemId()).getText() != oFocusInfo.sTypedChars) {
				// text entred before and is not the currently selected item -> just restore type-ahead
				this._doTypeAhead(oFocusInfo.sTypedChars, "");
			}
			if (!this._Opening && (!this.oPopup || !this.oPopup.isOpen())) {
				// as popup is not open restore listbox item like on popup close
				this._cleanupClose(this._getListBox());
			}
		} else {
			oFocusInfo.sTypedChars = "";
			//	 $Inp.val(this.getValue()); // enable if really needed
			this.focus();
			this._doSelect();
		}
		return this;
	};

	/*
	 * Handle the sapfocusleave pseudo event and ensure that when the focus moves to the list box,
	 * the check change functionality (incl. fireChange) is not triggered.
	 * Before the change event the value must be checked again if it fits to the items, because
	 * it might be manipulated using DOM manipulation or a IME tool for entering foreign characters
	 * @protected
	 */
	DropdownBox.prototype.onsapfocusleave = function(oEvent) {

		var oLB = this._getListBox();
		if (oEvent.relatedControlId && jQuery.sap.containsOrEquals(oLB.getFocusDomRef(), sap.ui.getCore().byId(oEvent.relatedControlId).getFocusDomRef())) {
			this.focus();
		} else {
			// we left the DropdownBox to another (unrelated) control and thus have to fire the change (if needed).
			var $Inp = jQuery(this.getInputDomRef());
			var sValue = $Inp.val();
			if (!this.getSelectedItemId() || sap.ui.getCore().byId(this.getSelectedItemId()).getText() != sValue) {
				// text entred before and is not the currently selected item -> just restore type-ahead
				this._doTypeAhead(sValue, "");
				if (!this._Opening && (!this.oPopup || !this.oPopup.isOpen())) {
					// as popup is not open restore listbox item like on popup close
					this._cleanupClose(this._getListBox());
				}
			}

			sap.ui.commons.TextField.prototype.onsapfocusleave.apply(this, arguments);
		}

	};

	/**
	 * Extends the method inherited from sap.ui.core.Element by providing information on Search Help access (if needed)
	 *
	 * @return {string} string tooltip or undefined
	 * @public
	 */
	DropdownBox.prototype.getTooltip_AsString = function() {
		var sTooltipString = ComboBox.prototype.getTooltip_AsString.apply(this, arguments);
		if (!this._searchHelpItem) {
			return sTooltipString;
		} else {
			var rb = sap.ui.getCore().getLibraryResourceBundle("sap.ui.commons");
			// ResourceBundle always returns the key if the text is not found
			var sSearchHelp = rb.getText("DDBX_SHI_ARIA");
			sSearchHelp = sSearchHelp === "DDBX_SHI_ARIA" ? "Open search help via {0}" : sSearchHelp;
			var sAdditionalText = this._searchHelpItem[0] && this._searchHelpItem[0].getAdditionalText() || rb.getText("DDBX_SHIF4");
			sAdditionalText = sAdditionalText === "DDBX_SHIF4" ? "F4" : sAdditionalText;
			sSearchHelp = sSearchHelp.replace("{0}", sAdditionalText);
			return (sTooltipString ? sTooltipString + " - " : "") + sSearchHelp;
		}
	};


	//***************************************************
	// Handling of list events
	//***************************************************

	/**
	 * This method is attached to the ListBox instance when it is open
	 * to handle the click event occurring in the ListBox.
	 * It additionally closes the Popup.
	 * If clicked on SearchHelp entry triggers the appropriate handling
	 *
	 * @param {sap.ui.base.Event} oControlEvent The event that was raised by the Listbox
	 * @return {sap.ui.core.ListItem} item
	 * @private
	 */
	DropdownBox.prototype._handleSelect = function(oControlEvent) {
		if (this._searchHelpItem && oControlEvent.getParameter("selectedItem") === this._searchHelpItem[0]) {
			var oEvent = new jQuery.Event("sapshow");
			oEvent.which = jQuery.sap.KeyCodes.F4;
			this.onsapshow(oEvent);
		} else {
			// if history item is selected search for corresponding real item in list
			var oItem = oControlEvent.getParameter("selectedItem");
			if (!oItem) {
				// not from ListBox, from ComboBox _open
				oItem = sap.ui.getCore().byId(oControlEvent.getParameter("selectedId"));
			}
			if (oItem.getId().search(this.getId() + "-h-") != -1) {
				// history item selected
				var oLB = this._getListBox(),
					aItems = oLB.getItems();
				var iLength = this._oHistory.get().length;
				if (iLength > this.getMaxHistoryItems()) {
					iLength = Math.max(this.getMaxHistoryItems(), 0);
				}
				for ( var iIndex = iLength; iIndex < aItems.length; iIndex++) {
					if (aItems[iIndex].getText() == oItem.getText() && aItems[iIndex].getEnabled()) {
						// Item found -> set in event data
						oControlEvent.mParameters.selectedIndex = iIndex;
						if (!oControlEvent.getParameter("selectedIndices")) {
							//create arrays
							oControlEvent.mParameters.selectedIndices = new Array(1);
							oControlEvent.mParameters.aSelectedIndices = new Array(1);
						}
						oControlEvent.mParameters.selectedIndices[0] = iIndex;
						oControlEvent.mParameters.aSelectedIndices[0] = iIndex;
						oControlEvent.mParameters.selectedItem = aItems[iIndex];
						break;
					}
				}
			}

			this._sWantedValue = undefined;
			return ComboBox.prototype._handleSelect.apply(this, arguments);
		}
	};


	//***************************************************
	// API method implementation
	//***************************************************

	/**
	 * Overwrite of Setter for property <code>searchHelpEnabled</code>.
	 * This method accepts additional parameter to be compatiple with the
	 * previous functionality
	 *
	 * Default value is <code>false</code>
	 *
	 * @param {boolean} bEnabled new value for property <code>searchHelpEnabled</code>
	 * @param {string} sText new value for property <code>searchHelpText</code>
	 * @param {string} sAdditionalText new value for property <code>searchHelpAdditionalText</code>
	 * @param {string} sIcon new value for property <code>searchHelpIcon</code>
	 * @return {sap.ui.commons.DropdownBox} <code>this</code> to allow method chaining
	 * @public
	 */
	DropdownBox.prototype.setSearchHelpEnabled = function(bEnabled, sText, sAdditionalText, sIcon) {

		this.setProperty("searchHelpEnabled", bEnabled);

		// set additional optional properties
		if (sText) {
			this.setProperty("searchHelpText", sText);
		} else {
			sText = this.getSearchHelpText();
		}
		if (sAdditionalText) {
			this.setProperty("searchHelpAdditionalText", sAdditionalText);
		} else {
			sAdditionalText = this.getSearchHelpAdditionalText();
		}
		if (sIcon) {
			this.setProperty("searchHelpIcon", sIcon);
		} else {
			sIcon = this.getSearchHelpIcon();
		}

		if (bEnabled) {
			var rb = sap.ui.getCore().getLibraryResourceBundle("sap.ui.commons");
			if ( rb ) {
				// ResourceBundle always returns the key if the text is not found
				sText = sText || rb.getText("DDBX_SHI");
				sText = sText === "DDBX_SHI" ? "Search Help" : sText;
				sAdditionalText = sAdditionalText || rb.getText("DDBX_SHIF4");
				sAdditionalText = sAdditionalText === "DDBX_SHIF4" ? "F4" : sAdditionalText;
			}
			sIcon = sIcon || sap.ui.resource("sap.ui.commons", "images/dropdown/ico12_f4.gif");
			if (!this._searchHelpItem) {
				this._searchHelpItem = [new sap.ui.core.ListItem(this.getId() + "_shi", {
					text: sText,
					additionalText: sAdditionalText,
					enabled: true,
					icon: sIcon
					}),
					new SeparatorItem()];
			} else {
				this._searchHelpItem[0].setText(sText).setAdditionalText(sAdditionalText).setIcon(sIcon);
			}
		} else {
			if ( this._searchHelpItem ) {
				this._searchHelpItem[0].destroy();
				this._searchHelpItem[1].destroy();
				this._searchHelpItem = null;
			}
		}

		return this;
	};

	/**
	 * Overwrite of Setter for property <code>searchHelpText</code>.
	 *
	 * Default value is empty/<code>undefined</code>
	 *
	 * @param {string} sSearchHelpText new value for property <code>searchHelpText</code>
	 * @return {sap.ui.commons.DropdownBox} <code>this</code> to allow method chaining
	 * @public
	 */
	DropdownBox.prototype.setSearchHelpText = function(sSearchHelpText) {
		this.setProperty("searchHelpText", sSearchHelpText);

		this.setSearchHelpEnabled(this.getSearchHelpEnabled(), sSearchHelpText, this.getSearchHelpAdditionalText(), this.getSearchHelpIcon());

		return this;
	};

	/**
	 * Overwrite of Setter for property <code>searchHelpAdditionalText</code>.
	 *
	 * Default value is empty/<code>undefined</code>
	 *
	 * @param {string} sSearchHelpAdditionalText new value for property <code>searchHelpAdditionalText</code>
	 * @return {sap.ui.commons.DropdownBox} <code>this</code> to allow method chaining
	 * @public
	 */
	DropdownBox.prototype.setSearchHelpAdditionalText = function(sSearchHelpAdditionalText) {
		this.setProperty("searchHelpAdditionalText", sSearchHelpAdditionalText);

		this.setSearchHelpEnabled(this.getSearchHelpEnabled(), this.getSearchHelpText(), sSearchHelpAdditionalText, this.getSearchHelpIcon());

		return this;
	};

	/**
	 * Overwrite of Setter for property <code>searchHelpIcon</code>.
	 *
	 * Default value is empty/<code>undefined</code>
	 *
	 * @param {sap.ui.core.URI} sSearchHelpIcon new value for property <code>searchHelpIcon</code>
	 * @return {sap.ui.commons.DropdownBox} <code>this</code> to allow method chaining
	 * @public
	 */
	DropdownBox.prototype.setSearchHelpIcon = function(sSearchHelpIcon) {
		this.setProperty("searchHelpIcon", sSearchHelpIcon);

		this.setSearchHelpEnabled(this.getSearchHelpEnabled(), this.getSearchHelpText(), this.getSearchHelpAdditionalText(), sSearchHelpIcon);

		return this;
	};

	/**
	 * Check if value fits to items. If not, set to first item
	 * @return {string} value
	 * @private
	 */
	DropdownBox.prototype.checkValueInItems = function() {

		var sValue = this.getValue();
		var aItems = ComboBox.prototype.getItems.apply(this); // use real items, even if popup is open (without filter....)
		// save and restore wanted item
		var sWantedSelectedKey = this._sWantedSelectedKey;
		var sWantedSelectedItemId = this._sWantedSelectedItemId;

		// only check the value in the items when items are available
		// TODO: reset the value?
		if (aItems && aItems.length > 0) {

			var bValueOK = false;
			var sFirstEnabledValue;
			var i = 0, l = 0;
			var oItem;
			var bEnabled = false;
			var sText = "";

			if (this._sWantedValue) {
				// value set but item not exists -> check now
				for (i = 0, l = aItems.length; i < l && !bValueOK; i++) {
					oItem = aItems[i];
					bEnabled = oItem.getEnabled();
					sText = oItem.getText();
					if ( bEnabled && !sFirstEnabledValue) {
						sFirstEnabledValue = sText;
					}
					bValueOK = sText === this._sWantedValue && bEnabled;
				}

				if (bValueOK) {
					sValue = this._sWantedValue;
					this._sWantedValue = undefined;
					sWantedSelectedKey = undefined;
					sWantedSelectedItemId = undefined;
					ComboBox.prototype.setValue.call(this, sValue);
				}
			}

			if (!bValueOK) {
				for (i = 0, l = aItems.length; i < l && !bValueOK; i++) {
					oItem = aItems[i];
					bEnabled = oItem.getEnabled();
					sText = oItem.getText();
					if ( bEnabled && !sFirstEnabledValue) {
						sFirstEnabledValue = sText;
					}
					bValueOK = sText === sValue && bEnabled;
				}
			}

			if (!bValueOK) {
				sValue = sFirstEnabledValue;
				ComboBox.prototype.setValue.call(this, sValue);
			}

		} else {
			// no items
			sValue = "";
			ComboBox.prototype.setValue.call(this, sValue);

		}

		this._sWantedSelectedKey = sWantedSelectedKey;
		this._sWantedSelectedItemId = sWantedSelectedItemId;
		return sValue;

	};

	/*
	 * Overwrite generated setter to delete old history items if not longer needed
	 */
	DropdownBox.prototype.setMaxHistoryItems = function(iMaxHistoryItems) {

		var iOldMaxHistoryItems = this.getMaxHistoryItems();
		var sIdPrefix = this.getId() + "-h-";
		var oItem;

		this.setProperty('maxHistoryItems', iMaxHistoryItems, true); // No re-rendering

		if (iMaxHistoryItems < iOldMaxHistoryItems) {
			// delete not longer visible history items
			var oListBox = this._getListBox();
			for ( var i = Math.max(iMaxHistoryItems, 0); i < iOldMaxHistoryItems; i++) {
				oItem = sap.ui.getCore().byId(sIdPrefix + i);
				if (oItem) {
					oListBox.removeItem(oItem);
					oItem.destroy();
				}
			}
			if (iMaxHistoryItems <= 0 && this.__oSeparator) {
				// remove separator but do not destroy it because it might be used again
				oListBox.removeItem(this.__oSeparator);
			}
		}
		// new items are added automatically by opening listbox (no support to change property while
		// listbox is open)

	};


	/**
	 * Using this method the history of the DropdownBox can be cleared.
	 * This might be necessary if the items of the DropdownBox have changed. Otherwise invalid items may appear in the history.
	 *
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	DropdownBox.prototype.clearHistory = function() {

		this._oHistory.clear();

		var sIdPrefix = this.getId() + "-h-";
		var oListBox = this._getListBox();
		var oItem;

		for (var i = 0; i < this.getMaxHistoryItems(); i++) {
			oItem = sap.ui.getCore().byId(sIdPrefix + i);
			if (oItem) {
				oListBox.removeItem(oItem);
				oItem.destroy();
			}
		}
		if (this.__oSeparator) {
			// remove separator but do not destroy it because it might be used again
			oListBox.removeItem(this.__oSeparator);
		}

	};

	DropdownBox.prototype.ondrop = function(oEvent) {

		// dropping text in DropdownBox makes no sense.
		oEvent.preventDefault();

	};

	/*
	 * in ComboBox an empty selected Key is not allowed (execute same logig as for defined keys)
	 */
	DropdownBox.prototype._isSetEmptySelectedKeyAllowed = function() {

		return false;

	};


	return DropdownBox;

}, /* bExport= */ true);
