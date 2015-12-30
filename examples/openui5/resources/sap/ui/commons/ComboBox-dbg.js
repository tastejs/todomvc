/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.commons.ComboBox.
sap.ui.define(['jquery.sap.global', './TextField', './library', 'sap/ui/core/Popup', 'jquery.sap.strings'],
	function(jQuery, TextField, library, Popup/* , jQuerySap */) {
	"use strict";


	/**
	 * Constructor for a new ComboBox.
	 *
	 * @param {string} [sId] Id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 *
	 * The control provides a field that allows end users to either enter some text, or to choose an entry out of a list of pre-defined items.
	 * The choosable items can be provided in the form of a complete <code>ListBox</code>, single <code>ListItems</code>.
	 * @extends sap.ui.commons.TextField
	 * @implements sap.ui.commons.ToolbarItem
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @alias sap.ui.commons.ComboBox
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var ComboBox = TextField.extend("sap.ui.commons.ComboBox", /** @lends sap.ui.commons.ComboBox.prototype */ { metadata : {

		interfaces : [
			"sap.ui.commons.ToolbarItem"
		],
		library : "sap.ui.commons",
		properties : {

			/**
			 *
			 * Defines the number of items that shall be displayed at once. If the overall number of items is higher than this setting, a scrollbar is provided.
			 */
			maxPopupItems : {type : "int", group : "Behavior", defaultValue : 10},

			/**
			 * Indicates whether the <code>additionalText</code> property that is available for <code>sap.ui.core.ListItem</code> shall be displayed in the list.
			 */
			displaySecondaryValues : {type : "boolean", group : "Misc", defaultValue : false},

			/**
			 * Key of the selected item.
			 *
			 * If the value has no corresponding item the key is empty.
			 *
			 * If duplicate keys exists the first item matching the key is used.
			 *
			 * If the key is set to a not existing value it will not be changed.
			 */
			selectedKey : {type : "string", group : "Data", defaultValue : null},

			/**
			 * Id of the selected item. If the value has no corresponding item, the <code>selectedItemId</code> is empty.
			 *
			 * If the <code>selectedItemId</code> is set to an not existing item, it will not be changed.
			 */
			selectedItemId : {type : "string", group : "Data", defaultValue : null}
		},
		defaultAggregation : "items",
		aggregations : {

			/**
			 * <code>ListItems</code> (see <code>sap.ui.core.ListBox</code>) that shall be displayed in the list.
			 */
			items : {type : "sap.ui.core.ListItem", multiple : true, singularName : "item", bindable : "bindable"},

			/**
			 * The hidden <code>ListBox</code> which is only used when no shared <code>ListBox</code> is set via association listBox
			 */
			myListBox : {type : "sap.ui.commons.ListBox", multiple : false, visibility : "hidden"}
		},
		associations : {

			/**
			 * Using this method, you provide a <code>ListBox</code> control. This allows reuse of item lists in different controls. Either a control id can be used as new target, or a control instance.
			 *
			 * <b>Note:</b> The ListBox must not be rendered somewhere in the UI. But if you want to bind the <code>ListBox</code> items to a model it must be in the control tree.
			 * So we suggest to add it as dependent somewhere (e.g. to the view or the first used <code>ComboBox</code>). If it is not set as child or dependant to an other control it will be automatically set as dependent to the first ComboBox where it is assigned.
			 */
			listBox : {type : "sap.ui.commons.ListBox", multiple : false}
		}
	}});

	/**
	 * Initializes the control.
	 * It is called from the constructor.
	 * @private
	 */
	ComboBox.prototype.init = function(){

		TextField.prototype.init.apply(this, arguments);
		this._iClosedUpDownIdx = -1;
		this._sCloseId = null;
		this.setAccessibleRole(sap.ui.core.AccessibleRole.Combobox);

		if (!sap.ui.Device.system.desktop) {
			this.mobile = true;
		}
	};

	/**
	 * Destroy the private ListBox if it exists.
	 * @private
	 */
	ComboBox.prototype.exit = function() {
		if ( this._oListBox ) {
			if (this._oListBoxDelegate) {
				this._oListBox.removeDelegate(this._oListBoxDelegate);
			}

			if (this.getAggregation("myListBox")) {
				this.destroyAggregation("myListBox", true);
			} else {
				this._oListBox.destroy();
			}
			this._oListBox = null;
		} else if (this.getListBox()) {
			var oListBox = sap.ui.getCore().byId(this.getListBox());
			if (oListBox) {
				oListBox.detachEvent("itemsChanged", this._handleItemsChanged, this);
				oListBox.detachEvent("itemInvalidated",this._handleItemInvalidated, this);
			}
		}
		this._sWantedSelectedKey = undefined;
		this._sWantedSelectedItemId = undefined;

		if (this._sHandleItemsChanged) {
			jQuery.sap.clearDelayedCall(this._sHandleItemsChanged);
			this._sHandleItemsChanged = null;
			this._bNoItemCheck = undefined;
		}
	};


	//***********************************************************
	// Mouse handling...
	//***********************************************************

	/*
	 * Handle click events triggered on the control and if triggered on F4-button open or close the proposal list
	 *
	 * @param {jQuery.Event} oEvent
	 * @protected
	 */
	ComboBox.prototype.onclick = function(oEvent){
		if (this.getEnabled && this.getEnabled() && this.getEditable() && oEvent.target === this.getF4ButtonDomRef()) {
			if (this.oPopup && this.oPopup.isOpen()) {
				this._close();
			} else if (!this._F4ForClose) {
				this._open();
			}
			this.focus();
		}
		this._F4ForClose = false;
	};

	/*
	 * Handle mousedown events triggered on the control
	 *
	 * @param {jQuery.Event} oEvent
	 * @protected
	 */
	ComboBox.prototype.onmousedown = function(oEvent){

		var oF4ButtonDomRef = this.getF4ButtonDomRef();

		if (oEvent.target !== oF4ButtonDomRef || !this.getEnabled() || !this.getEditable()) {
			if (this.oPopup && this.oPopup.isOpen()) {
				// stop propagation of event, otherwise if the ComboBox is in a dialog (popup) this will move in front of the listbox
				oEvent.stopPropagation();
			}
			return;
		} else if (oEvent.target == oF4ButtonDomRef && jQuery(this.getFocusDomRef()).data("sap.INItem")) {
			// in case of ItemNavigation focus the input field and stop the propagation to prevent
			// ItemNavigation to set focus to other item.
			oEvent.stopPropagation();
			this.focus();
		}

		if (this.oPopup && this.oPopup.isOpen()) {
			this._F4ForClose = true;
		} else {
			this._F4ForOpen = true;
		}
	};


	//***********************************************************
	// Keyboard handling...
	//***********************************************************

	/**
	 * Handle sapshow pseudo events on the control
	 * @param {jQuery.Event} oEvent The event object.
	 * @protected
	 */
	ComboBox.prototype.onsapshow = function(oEvent){

		if (this.mobile) {
			return;
		}

		if (this.oPopup && this.oPopup.isOpen()) {
			this._close();
		} else {
			this._open();
		}
		oEvent.preventDefault();
		oEvent.stopImmediatePropagation();
	};

	/**
	 * Handle sapnextmodifiers pseudo events on the control
	 * if in toolbar prevent item navigation if popup is opened.
	 * @param {jQuery.Event} oEvent The event object.
	 * @protected
	 */
	ComboBox.prototype.onsapnextmodifiers = function(oEvent){
		TextField.prototype.onsapnextmodifiers.apply(this, arguments);
		if ( oEvent.keyCode == jQuery.sap.KeyCodes.ARROW_DOWN && oEvent.altKey ) {
			this.onsapshow(oEvent);
			oEvent.stopPropagation();
		}
	};

	/**
	 * Handle saphide pseudo events on the control
	 * @param {jQuery.Event} oEvent The event object.
	 * @protected
	 */
	ComboBox.prototype.onsaphide = function(oEvent){

		if (this.mobile) {
			return;
		}

		this._close();
		oEvent.stopPropagation(); // prevent item navigation in toolbar
	};

	/**
	 * Handle sapescape pseudo events on the control
	 * @param {jQuery.Event} oEvent The event object.
	 * @protected
	 */
	ComboBox.prototype.onsapescape = function(oEvent) {

		if (this.oPopup && this.oPopup.isOpen()) {
			this._close();
			oEvent.stopPropagation(); // if comboBox is on a popup don't close this popup too
		}
		// standard behavior of TextField
		TextField.prototype.onsapescape.apply(this, arguments);

		// restore index, itemId and so on
		var sItemId = this.getSelectedItemId();
		if (sItemId) {
			var oItem = sap.ui.getCore().byId(sItemId);
			this._iClosedUpDownIdx = this.indexOfItem(oItem);
			var oListBox = this._getListBox();
			oListBox.setSelectedIndex(this._iClosedUpDownIdx);
			this._updatePosInSet( null, this._iClosedUpDownIdx + 1, (oItem.getAdditionalText ? oItem.getAdditionalText() : ""));
		} else {
			this._updatePosInSet( null, -1, null);
			this._iClosedUpDownIdx = -1;
		}

	};

	/**
	 * Handle sapenter pseudo events on the control
	 * @param {jQuery.Event} oEvent The event object.
	 * @protected
	 */
	ComboBox.prototype.onsapenter = function(oEvent) {
		this._close();
		this._checkChange(oEvent);
	};


	//***********************************************************
	//Focus handling...
	//***********************************************************

	/*
	 * Handle the sapfocusleave pseudo event and ensure that when the focus moves to the list box,
	 * the check change functionality (incl. fireChange) is not triggered.
	 * @protected
	 */
	ComboBox.prototype.onsapfocusleave = function(oEvent) {

		var oLB = this._getListBox();
		if ((oEvent.relatedControlId && jQuery.sap.containsOrEquals(oLB.getFocusDomRef(), sap.ui.getCore().byId(oEvent.relatedControlId).getFocusDomRef())) ||
				this._bOpening) {
			this.focus();
		} else {
			// we left the ComboBox to another (unrelated) control and thus have to fire the change (if needed).
			TextField.prototype.onsapfocusleave.apply(this, arguments);
		}

	};

	//***********************************************************
	// Change handling and related event firing
	//***********************************************************

	/**
	 * Compares the previous value with the current value and fires the "Change" event
	 * if the ComboBox is editable and the value has changed or whether the value has been changed
	 * e.g. via up/down or auto-complete feature
	 *
	 * @param {jQuery.Event} oEvent The event object.
	 * @param {boolean} [bImmediate] indicate whether the check should happen immediately or delayed (e.g. to avoid focusout / click double event processing)
	 * @protected
	 */
	ComboBox.prototype._checkChange = function(oEvent, bImmediate) {

		var oInput = this.getInputDomRef();
		if (!oInput) {
			// to be save if some one deletes field from DOM during delayed call
			return;
		}

		var sNewVal = jQuery(oInput).val(),
		sOldVal = this.getValue();

		if (!this._F4ForOpen && (this.getEditable() && this.getEnabled())) {
			var aItems = this.getItems(),
			oItem = null,
			oText,
			sKey,
			sId,
			iIndex;

			if (sOldVal != sNewVal) {
				this.setValue(sNewVal, true);

				for (var i = 0, l = aItems.length; i < l; i++) {
					oText = aItems[i].getText();
					if (oText === sNewVal) {
						if (i == this._iClosedUpDownIdx) {
							// it's the currently selected item
							oItem = aItems[i];
							sKey = oItem.getKey();
							sId  = oItem.getId();
							iIndex = i;
							break;
						} else if (!iIndex) {
							// if not the currently selected item, use the first found one
							oItem = aItems[i];
							sKey = oItem.getKey();
							sId  = oItem.getId();
							iIndex = i;
						}
					}
				}
				this.setProperty("selectedKey", sKey, true); // no rerendering needed
				this.setProperty("selectedItemId", sId, true); // no rerendering needed
				if (sId) {
					this._iClosedUpDownIdx = iIndex;
				} else {
					this._iClosedUpDownIdx = -1;
				}
				if (this.mobile) {
					if (!sId) {
						// no list item entered (free text) => add one dummy item to the select box
						this._addDummyOption(sNewVal);
					} else {
						this._removeDummyOption();
						this.getDomRef("select").selectedIndex = iIndex;
					}
				}
			} else {
				// same value, check if different Item
				var sOldItemId = this.getSelectedItemId();
				var sNewItemId;
				iIndex = this._iClosedUpDownIdx;
				if (iIndex >= 0) {
					oItem = aItems[iIndex];
					if (oItem.getText() == sNewVal) {
						// only if same Text
						sNewItemId = oItem.getId();
					}
				}
				if (sNewItemId && sNewItemId != sOldItemId) {
					this.setSelectedItemId(sNewItemId, true);
				} else {
					return;
				}
			}
			this.fireChange({newValue:sNewVal, selectedItem: oItem});
		}
	};

	//***********************************************************
	// Advanced keyboard handling... type ahead, up / down navigation, ...
	//***********************************************************

	/**
	 * Handle the keypress event
	 * @param {jQuery.Event} oEvent the event that occurred on the ComboBox
	 * @private
	 */
	ComboBox.prototype.onkeypress = function(oEvent) {

		if (oEvent.target.id == this.getId() + "-select") {
			// on native dropdown -> no implemented typeAhead
			return;
		}

		if (!this.getEnabled() || !this.getEditable()) {
			return;
		}

		if (this._sTypeAhead) {
			jQuery.sap.clearDelayedCall(this._sTypeAhead);
		}

		var oKC = jQuery.sap.KeyCodes;
		if (ComboBox._isHotKey(oEvent) || oEvent.keyCode === oKC.F4 && oEvent.which === 0 /*this is the Firefox case and ensures 's' with same charCode is accepted*/) {
			return;
		}

		var iKC = oEvent.which || oEvent.keyCode;
		if (iKC !== oKC.DELETE && iKC !== oKC.BACKSPACE && iKC !== oKC.ESCAPE) {
			this._sTypeAhead = jQuery.sap.delayedCall(200, this, "_doTypeAhead");
		} else {
			// standard behavior of TextField
			TextField.prototype.onkeypress.apply(this, arguments);
			if (iKC !== oKC.ESCAPE) {
				this._updatePosInSet( null, -1, null);
			}
		}
		// Do not cancel the event as this would prevent typing in the field.
	};

	/**
	 * Handle the sapup event
	 * TODO How do we enable switching this off? e.g. in table case, arrow keys might trigger
	 *      cell navigation instead of this one? is there a special key to 're-enable' again? like right-Alt key?
	 *
	 * @param {jQuery.Event} oEvent the event that occurred on the ComboBox
	 * @private
	 */
	ComboBox.prototype.onsapup = function(oEvent) {

		if (oEvent.target.id == this.getId() + "-select") {
			// on native dropdown -> no implemented typeAhead
			return;
		}

		if (!this.getEnabled() || !this.getEditable()) {
			return;
		}

		if (jQuery(this.getFocusDomRef()).data("sap.InNavArea")) {
			// parent handles arrow navigation
			return;
		}

		var oListBox = this._getListBox(),
		aItems = oListBox.getItems(),
		oDomRef = this.getInputDomRef(),
		oValue = jQuery(oDomRef).val();

		var i = this._prepareUpDown(aItems, oValue);
		i = this._updateIdx(aItems, oDomRef, i - 1, i, oEvent);

		oEvent.preventDefault();
		oEvent.stopPropagation(); // prevent itemNavigation if ComboBox is in toolbar
	};

	/**
	 * Handle the sapdown event.
	 * TODO How do we enable switching this off? e.g. in table case, arrow keys might trigger
	 *      cell navigation instead of this one? is there a special key to 're-enable' again? like right-Alt key?
	 *
	 * @param {jQuery.Event} oEvent the event that occurred on the ComboBox
	 * @private
	 */
	ComboBox.prototype.onsapdown = function(oEvent) {

		if (oEvent.target.id == this.getId() + "-select") {
			// on native dropdown -> no implemented typeAhead
			return;
		}

		if (!this.getEnabled() || !this.getEditable()) {
			return;
		}

		if (jQuery(this.getFocusDomRef()).data("sap.InNavArea")) {
			// parent handles arrow navigation
			return;
		}

		var oListBox = this._getListBox(),
			aItems = oListBox.getItems(),
			oDomRef = this.getInputDomRef(),
			oValue = jQuery(oDomRef).val();

		var i = this._prepareUpDown(aItems, oValue);
		i = this._updateIdx(aItems, oDomRef, i + 1, i, oEvent);

		oEvent.preventDefault();
		oEvent.stopPropagation(); // prevent itemNavigation if ComboBox is in toolbar
	};

	/**
	 * Handle the saphome event.
	 * TODO How do we enable switching this off? e.g. in table case, arrow keys might trigger
	 *      cell navigation instead of this one? is there a special key to 're-enable' again? like right-Alt key?
	 *
	 * @param {jQuery.Event} oEvent the event that occurred on the ComboBox
	 * @private
	 */

	ComboBox.prototype.onsaphome = function(oEvent) {
		TextField.prototype.onsaphome.apply(this, arguments);

		if (oEvent.target.id == this.getId() + "-select") {
			// on native dropdown -> no implemented typeAhead
			return;
		}

		if (!this.getEditable() || !this.getEnabled() || !this.oPopup || !this.oPopup.isOpen()) {
			return;
		}

		var oListBox = this._getListBox(),
			aItems = oListBox.getItems(),
			oDomRef = this.getInputDomRef();

		this._updateIdx(aItems, oDomRef, 0, undefined, oEvent);

		oEvent.preventDefault();
		oEvent.stopPropagation();
	};

	/**
	 * Handle the sapend event.
	 * TODO How do we enable switching this off? e.g. in table case, arrow keys might trigger
	 *      cell navigation instead of this one? is there a special key to 're-enable' again? like right-Alt key?
	 *
	 * @param {jQuery.Event} oEvent the event that occurred on the ComboBox
	 * @private
	 */

	ComboBox.prototype.onsapend = function(oEvent) {
		TextField.prototype.onsapend.apply(this, arguments);

		if (oEvent.target.id == this.getId() + "-select") {
			// on native dropdown -> no implemented typeAhead
			return;
		}

		if (!this.getEditable() || !this.getEnabled() || !this.oPopup || !this.oPopup.isOpen()) {
			return;
		}

		var oListBox = this._getListBox(),
			aItems = oListBox.getItems(),
			oDomRef = this.getInputDomRef();

		var i = aItems.length - 1;
		i = this._updateIdx(aItems, oDomRef, i, undefined, oEvent);

		oEvent.preventDefault();
		oEvent.stopPropagation();
	};

	/**
	 * method for delayed handle of type ahead in closed combobox
	 * @private
	 */
	ComboBox.prototype._doTypeAhead = function(){
		this._sTypeAhead = null;
		this._sWantedSelectedKey = undefined; // something typed -> do not search again for not existing items
		this._sWantedSelectedItemId = undefined;
		var oLB = this._getListBox(),
			aItems = oLB.getItems(),
			oItem,
			oText,
			$Ref = jQuery(this.getInputDomRef()),
			oValue = $Ref.val(),
			startsWith = jQuery.sap.startsWithIgnoreCase;
		this._sTypedChars = oValue;
		var bFound = false;
		var i = 0;
		for (var l = aItems.length; i < l; i++) {
			oItem = aItems[i];
			oText = "" + oItem.getText();
			if (startsWith(oText, oValue) && oItem.getEnabled()) {
				this._updatePosInSet( $Ref, i + 1, (oItem.getAdditionalText ? oItem.getAdditionalText() : ""));
				$Ref.val(oText);
				this._doSelect(oValue.length, oText.length);

				oLB.setSelectedIndex(i);
				oLB.scrollToIndex(i, true);
				bFound = true;
				if (this.mobile) {
					this._removeDummyOption();
					this.getDomRef("select").selectedIndex = i;
				}
				return;
			}
		}
		oLB.clearSelection();
		oLB.scrollToIndex(i, true);
		if (!bFound) {
			this._updatePosInSet( $Ref, -1, null);
			if (this.mobile) {
				this._addDummyOption(oValue);
			}
		}
	};

	/**
	 * Prepares for the up and down arrow handling.
	 * Checks whether there is a set index and this still matches the given value
	 * @param {sap.ui.core.ListItem[]} aItems array of listitems that should be used.
	 * @param {string} oValue value to check
	 * @return {int} the new index
	 * @private
	 */
	ComboBox.prototype._prepareUpDown = function(aItems, oValue){
		var oText;
		if (this._iClosedUpDownIdx >= 0 && aItems[this._iClosedUpDownIdx] && aItems[this._iClosedUpDownIdx].getText() !== oValue) {
			this._iClosedUpDownIdx = -1;
		}

		if (this._iClosedUpDownIdx === -1) {
			for (var i = 0, l = aItems.length; i < l; i++) {
				oText = aItems[i].getText();
				if (oText === oValue) {
					this._iClosedUpDownIdx = i;
					break;
				}
			}
		}
		return this._iClosedUpDownIdx;
	};

	/**
	 * Updates the value of the comboBox taking the given idx into account.
	 *
	 * @param {sap.ui.core.ListItem[]} aItems the items belonging to this ComboBox
	 * @param {string} oDomRef the dom ref of the inputField to update
	 * @param {int} iNewIdx the index to set
	 * @param {int} [iCurIdx] The index to 'fall back to'.
	 *						  Leave blank in case of navigation to 'first' (home-key) or 'last' (end-key). Will ensure 'first' or 'last' selectable item will be selected.
	 * @return {int} the actually set index (which might have been corrected)
	 * @param {jQuery.Event} oEvent The original event object.
	 * @private
	 */
	ComboBox.prototype._updateIdx = function(aItems, oDomRef, iNewIdx, iCurIdx, oEvent){
		var l = aItems.length,
			bFirst = iNewIdx === 0 && iCurIdx === undefined,
			bDown = iCurIdx !== undefined && iCurIdx < iNewIdx || bFirst,
			i,
			$Ref = jQuery(oDomRef);

			if (iNewIdx < 0) {
				i = 0;
			} else if (iNewIdx < l) {
				i = iNewIdx;
			} else {
				i = l - 1;
			}

		var oItem,
			bValid = false;
		do {
			iNewIdx = bDown ? i++ : i--;
			oItem = aItems[iNewIdx];
			bValid = oItem && oItem.getEnabled() && !(oItem instanceof sap.ui.core.SeparatorItem) && oItem.getId() !== this.getId() + "_shi";
		} while (!bValid && i < l && i >= 0);
		if (bValid) {
			var oText = oItem.getText();
			var iPos = iNewIdx + 1;
			if (this._determinePosinset) {
				iPos = this._determinePosinset(aItems, iNewIdx); //in DropdownBox separators must be removed from Posinset
			}
			this._updatePosInSet( $Ref, iPos, (oItem.getAdditionalText ? oItem.getAdditionalText() : ""));
			$Ref.val(oText);
			this._doSelect();
			this._fireLiveChange(oEvent);

			var oListBox = this._getListBox();
			oListBox.setSelectedIndex(iNewIdx);
			oListBox.scrollToIndex(iNewIdx, true);
		} else {
			iNewIdx = iCurIdx;
		}
		this._iClosedUpDownIdx = iNewIdx;
		return iNewIdx;
	};

	/**
	 * Selects the text of the InputDomRef in the given range
	 * @param {int} [iStart=0] start position of the text selection
	 * @param {int} [iEnd=<length of text>] end position of the text selection
	 * @return {sap.ui.commons.ComboBox} this DropdownBox instance
	 * @private
	 */
	ComboBox.prototype._doSelect = function(iStart, iEnd){

		var oDomRef = this.getInputDomRef();

		if (oDomRef) {
			//if no Dom-Ref - no selection (Maybe popup closed)
			var $Ref = jQuery(oDomRef);
			oDomRef.focus();
			$Ref.selectText(iStart ? iStart : 0, iEnd ? iEnd : $Ref.val().length);
		}

		return this;

	};


	//***********************************************************
	// DOM Ref handling
	//***********************************************************

	/**
	 * Returns the DomRef which represents the icon for value help.
	 * Could be overwritten in child-classes
	 *
	 * @return {Element} The F4-element's DOM reference or null
	 * @protected
	 */
	ComboBox.prototype.getF4ButtonDomRef = function() {
		return this.getDomRef("icon");
	};


	//***********************************************************
	// List Box handling (incl. creation of 'private one')
	//***********************************************************

	/**
	 * Returns the private listbox.
	 * Creates a new one if not yet done.
	 * @return {sap.ui.commons.ListBox} the private listbox
	 * @private
	 */
	ComboBox.prototype._getPrivateListBox = function(){
		if (this._oListBox) {
			return this._oListBox;
		}
		// else
		this._oListBox = new sap.ui.commons.ListBox(this.getId() + "-lb", {allowMultiSelect:false});
		this.setAggregation("myListBox", this._oListBox, true);
		this._oListBox.attachEvent("itemsChanged",this._handleItemsChanged, this);
		this._oListBox.attachEvent("itemInvalidated",this._handleItemInvalidated, this);

		if (this.getDomRef()) {
			// update ARIA info
			this.$().attr("aria-owns",  this.getId() + "-input " + this._oListBox.getId());
		}

		return this._oListBox;
	};

	/*
	 * get the existing ListBox - shared or private. But if n private exist, do not create one
	 */
	ComboBox.prototype._getExistingListBox = function(){

		var sListBox = this.getListBox(),
			oListBox;
		if (sListBox) {
			oListBox = sap.ui.getCore().byId(sListBox);
		} else if (this._oListBox) {
			oListBox = this._getPrivateListBox();
		}

		return oListBox;

	};

	/**
	 * Returns the listbox that should be used.
	 * This is either the one set from outside or the one created as 'private'
	 * @param {boolean} bUpdateListBox indicate whether the ListBox should be updated for rerendering
	 * @return {sap.ui.commons.ListBox} the listbox that should be used
	 * @private
	 */
	ComboBox.prototype._getListBox = function(bUpdateListBox){

		var oListBox = this._getExistingListBox();
		if (!oListBox) {
			oListBox = this._getPrivateListBox();
		}
		if (bUpdateListBox) {
			oListBox.setAllowMultiSelect(false);
			oListBox.setDisplaySecondaryValues(this.getDisplaySecondaryValues());

			var oDomRef = this.getDomRef();
			if (oDomRef) {
				oListBox.setMinWidth(jQuery(oDomRef).rect().width + "px");
			}
		}
		return oListBox;
	};


	//***********************************************************
	// Closing and opening the drop down
	//***********************************************************

	/**
	 * Opens the proposal list of the ComboBox
	 * @param {int} iDuration duration for opening
	 * @private
	 */
	ComboBox.prototype._open = function(iDuration){

		if (this.mobile) {
			return; // on mobile devices use native dropdown.
		}

		if (iDuration === undefined) {
			iDuration = -1;
		}

		if (!this.getEditable() || !this.getEnabled()) {
			return;
		}

		if (!this.oPopup) {
			this.oPopup = new Popup();
		}

		this._F4ForOpen = false;

		var oListBox = this._getListBox(!this.oPopup.isOpen());
		var oPopup = this.oPopup;
		this._prepareOpen(oListBox);
		if (!this._oListBoxDelegate) {
			this._oListBoxDelegate = {oCombo: this, onclick: function(oEvent){ // FIXME: is this code ever executed? ListBox selection triggers _handleSelect which closes the Popup and removes this delegate again before the delegates for onclick are called
				// cover also the case of 'confirm initial proposal'
				var itemId = jQuery(oEvent.target).closest("li").attr("id");
				if (itemId) {
					// could also be done via EventPool... but whose to use? Combo's? ListBox'?
					var oNewEvent = new sap.ui.base.Event("_internalSelect", this.oCombo, {selectedId: itemId});
					this.oCombo._handleSelect(oNewEvent);
				}
			}};
		}
		oListBox.addDelegate(this._oListBoxDelegate);

		// and update the given popup instance
		oPopup.setContent(oListBox);
		oPopup.setAutoClose(true);
		oPopup.setAutoCloseAreas([this.getDomRef()]);
		oPopup.setDurations(0, 0); // no animations
		oPopup.setInitialFocusId(this.getId() + '-input'); // to prevent popup to set focus to the ListBox -> stay in input field

		// now, as everything is set, ensure HTML is up-to-date
		// This is separated in a function because controls which inherit the Combobox (e.g. SearchField) might override this
		// Here is also the possibility to interrupt the open procedure of the list (e.g. when the list is empty)
		var bSkipOpen = this._rerenderListBox(oListBox);
		if (bSkipOpen) {
			return;
		}

		oPopup.attachOpened(this._handleOpened, this);
		// attachClosed moved to _handleOpened

		var eDock = Popup.Dock;
		oPopup.open(iDuration, eDock.BeginTop, eDock.BeginBottom, this/*.getDomRef()*/,
			/*offset*/null, /*collision*/ null, /*followOf*/ Popup.CLOSE_ON_SCROLL);
		jQuery(oListBox.getFocusDomRef()).attr("tabIndex", "-1");
		//attachSelect moved to _handleOpened

		jQuery(this.getDomRef()).attr("aria-expanded", true);

	};

	/*
	 * Rerenders the attached Listbox
	 * @private
	 */
	ComboBox.prototype._rerenderListBox = function(oListBox){
	//	do not use oListBox.rerender(); because this not deletes rerender-timer. So it will be rerendered
	//  twice in DropdownBox.
		sap.ui.getCore().applyChanges();
		return false;
	};

	/**
	 * Walks over the list of available items in the given oListBox and updates the visual selection.
	 * Also updates the Popup to show the right content.
	 *
	 * @param {sap.ui.commons.ListBox} oListBox listBox belonging to this ComboBox instance.
	 * @private
	 */
	ComboBox.prototype._prepareOpen = function(oListBox) {
		// update the list and the input field
		this._bOpening = true;

		var $Ref = jQuery(this.getInputDomRef()),
			oValue = $Ref.val(),
			oNewValue,
			aItems = oListBox.getItems(),
			oText,
			startsWith = jQuery.sap.startsWithIgnoreCase,
			bEmptyString = oValue === "",
			sSelectedItemId = this.getSelectedItemId(),
			oItem;
		var i = 0;
		var iIndex = -1;
		for (var l = aItems.length; i < l; i++) {
			oItem = aItems[i];
			if (!oItem.getEnabled()) {
				continue;
			}
			oText = "" + oItem.getText();
			if (bEmptyString || startsWith(oText, oValue)) {
				// maybe more than one item fit, try to find the right one (if nothing found use the first one)
				if (oText == oValue && i == this._iClosedUpDownIdx) {
					// it's the currently selected item of the list (after last liveChange)
					iIndex = i;
					oNewValue = oText;
					break;
				} else if (this._iClosedUpDownIdx < 0 && oText == oValue && oItem.getId() == sSelectedItemId) {
					// it's the currently selected item of the ComboBox (after last change event)
					iIndex = i;
					oNewValue = oText;
					break;
				} else if (iIndex < 0) {
					iIndex = i;
					oNewValue = oText;
				}
			}
		}
		if (iIndex >= 0) {
			// ensure to mark pending only when set new
			this._iClosedUpDownIdx = iIndex;
			this._updatePosInSet( $Ref, iIndex + 1, (oItem.getAdditionalText ? oItem.getAdditionalText() : ""));
			$Ref.val(oNewValue);
			this._doSelect();
			var oEvent = new jQuery.Event("sapshow"); // use sapshow event for live change (AutoComplete needs an event here)
			oEvent.which = jQuery.sap.KeyCodes.F4;
			this._fireLiveChange(oEvent);
		}
		var iItemsLength = oListBox.getItems().length;
		var iMaxPopupItems = this.getMaxPopupItems();
		oListBox.setVisibleItems(iMaxPopupItems < iItemsLength ? iMaxPopupItems : -1); // if less than max items let LisBox determine the size
		oListBox.setSelectedIndex(iIndex);

		// preparation of Popup moved to _open method again to allow cleaner implementation in dropdown box
	};

	/**
	 * Once the ListBox is opened, we can update the scroll position
	 * @private
	 */
	ComboBox.prototype._handleOpened = function(){

		this.oPopup.detachOpened(this._handleOpened, this);
		var oListBox = this._getListBox();
		oListBox.scrollToIndex(this._iClosedUpDownIdx, true);
		oListBox.attachSelect(this._handleSelect, this);
		// and also ensure we get to know it closes / gets closed via automatic-close again
		this.oPopup.attachClosed(this._handleClosed, this);

		if (!!sap.ui.Device.browser.internet_explorer) {
			// as IE just ignores syncron focus() called from popup by opening it must be called asynchron
			// otherwise onfocusin is not executed.
			jQuery.sap.delayedCall(0, this, function(){
				jQuery(this.getInputDomRef()).focus();
			});
		}

		// if ComboBox is open -> switch to action mode
		if (jQuery(this.getFocusDomRef()).data("sap.InNavArea")) {
			jQuery(this.getFocusDomRef()).data("sap.InNavArea", false);
		}

		this._bOpening = false;

	};

	/**
	 * Closes  the proposal list of the ComboBox
	 * @param {jQuery.Event} oEvent The event object.
	 * @private
	 */
	ComboBox.prototype._close = function(oEvent){
		if (this.oPopup) { // only if there is a Popup, the list box might have been used
			this.oPopup.close(0);
		}
	};

	/**
	 * As there might also be situation where the auto-close functionality triggers the close,
	 * ensure to handle everything in the event listener
	 * @private
	 */
	ComboBox.prototype._handleClosed = function(){
		this.oPopup.detachClosed(this._handleClosed, this);
		var oListBox = this._getListBox();
		oListBox.removeDelegate(this._oListBoxDelegate);
		oListBox.detachSelect(this._handleSelect, this);
		jQuery(this.getDomRef()).attr("aria-expanded", false);

		if (this._cleanupClose) {
			this._cleanupClose(oListBox);
		}
	};

	/**
	 * This method is attached to the ListBox instance when it is open
	 * to handle the click event occurring in the ListBox.
	 * It additionally closes the Popup.
	 * @param {sap.ui.base.Event} oControlEvent The event that was raised by the Listbox
	 * @return {sap.ui.core.ListItem} item
	 * @private
	 */
	ComboBox.prototype._handleSelect = function(oControlEvent) {

		var iSelected = oControlEvent.getParameter("selectedIndex"),
			iSelectedId = oControlEvent.getParameter("selectedId"),
			oItem = oControlEvent.getParameter("selectedItem");

		if (!oItem && iSelectedId) {
			oItem = sap.ui.getCore().byId(iSelectedId);
			if (oItem.getParent() !== this._getListBox(false)) {// can this happen?
				oItem = null;
			}
			iSelected = jQuery.inArray(oItem, this._getListBox().getItems());
		}
		if (oItem && oItem.getEnabled()) {
			var sNewValue = oItem.getText();
			this._iClosedUpDownIdx = iSelected;
			this._close(); // to allow DropdownBox to set this._iClosedUpDownIdx in _cleanupClose
			this._updatePosInSet( null, this._getListBox().getSelectedIndex() + 1, (oItem.getAdditionalText ? oItem.getAdditionalText() : ""));
			var sOldValue = this.getValue();
			var sOldKey = this.getSelectedKey();
			var sNewKey = oItem.getKey();
			var sOldId = this.getSelectedItemId();
			var sNewId = oItem.getId();

			this._sTypedChars = sNewValue;
			this._sWantedSelectedKey = undefined;
			this._sWantedSelectedItemId = undefined;
			if (sOldValue != sNewValue || sOldKey != sNewKey || sOldId != sNewId) {
				this.setValue(sNewValue, true);
				this.setProperty("selectedKey", sNewKey, true); // no rerendering needed
				this.setProperty("selectedItemId", sNewId, true); // no rerendering needed
				this.fireChange({newValue: sNewValue, selectedItem: oItem});
			} else if (sNewValue != jQuery(this.getInputDomRef()).val()) {
				// input field value was changed while type-Ahead during opening -> just restore
				jQuery(this.getInputDomRef()).val(sNewValue);
			}
		}
		this._doSelect();
		return oItem;
	};


	//***********************************************************
	// Handle aggregation and association
	//***********************************************************

	//Handle items aggregation
	ComboBox.prototype.getItems = function(){
		// to not force creation if internal ListBox do not use _getListBox()
		var oListBox = this._getExistingListBox();

		return oListBox ? oListBox.getItems() : [];
	};
	ComboBox.prototype.insertItem = function(oItem, iIndex){
		oItem = this.validateAggregation("items", oItem, /* multiple */ true);
		this._getListBox().insertItem(oItem, iIndex);
		return this;
	};
	ComboBox.prototype.addItem = function(oItem){
		oItem = this.validateAggregation("items", oItem, /* multiple */ true);
		this._getListBox().addItem(oItem);
		return this;
	};
	ComboBox.prototype.removeItem = function(vElement) {
		return this._getListBox().removeItem(vElement);
	};
	ComboBox.prototype.removeAllItems = function() {
		// to not force creation if internal ListBox do not use _getListBox()
		var oListBox = this._getExistingListBox();

		return oListBox ? oListBox.removeAllItems() : [];
	};
	ComboBox.prototype.indexOfItem = function(oItem){
		return this._getListBox().indexOfItem(oItem);
	};
	ComboBox.prototype.destroyItems = function(){
		var oListBox = this._getExistingListBox();
		if (oListBox) {
			this._getListBox().destroyItems();
		}
		return this;
	};

	ComboBox.prototype.updateItems = function(){

		this._bNoItemCheck = true; // is cleared in _handleItemsChanged after all changes are done

		// only new and removed items will be updated here.
		// If items are "reused" they only change their properies
		this.updateAggregation("items");

		//handleItemsChange must be called asyncronous to insure that all bindingInfos are updated (item + selectedKey)
		if (!this._sHandleItemsChanged) {
			this._sHandleItemsChanged = jQuery.sap.delayedCall(0, this, "_handleItemsChanged", [null, true]);
		}

	};

	// handle listBox association
	ComboBox.prototype.setListBox = function(sListBox) {

		var oOldListBox = sap.ui.getCore().byId(this.getListBox());
		if (oOldListBox) {
			oOldListBox.detachEvent("itemsChanged", this._handleItemsChanged, this);
			oOldListBox.detachEvent("itemInvalidated",this._handleItemInvalidated, this);
			if (this._bListBoxDependentSet) {
				this.removeDependent(oOldListBox);
				this._bListBoxDependentSet = false;
			}
		}

		// if we created our own listBox beforehand, destroy it as the newly set one should win.
		if (this._oListBox && sListBox) {
			this._oListBox.detachEvent("itemsChanged", this._handleItemsChanged, this);
			this._oListBox.detachEvent("itemInvalidated",this._handleItemInvalidated, this);
			if (this.getAggregation("myListBox")) {
				this.destroyAggregation("myListBox", true);
			} else {
				this._oListBox.destroy();
			}
			this._oListBox = null;
		}
		this.setAssociation("listBox", sListBox);

		var oListBox = typeof sListBox === "string" ? sap.ui.getCore().byId(sListBox) : sListBox;
		if (oListBox && oListBox.attachEvent) {
			oListBox.attachEvent("itemsChanged",this._handleItemsChanged, this);
			oListBox.attachEvent("itemInvalidated",this._handleItemInvalidated, this);
		}

		if (oListBox && !oListBox.getParent()) {
			// ListBox has no parent, add as dependent to prove the model in case of databinding
				this.addDependent(oListBox);
				this._bListBoxDependentSet = true;
		}

		if (this.getDomRef() && oListBox) {
			// update ARIA info
			this.$().attr("aria-owns", this.getId() + "-input " + oListBox.getId());
		}

		return this;
	};

	ComboBox.prototype._handleItemsChanged = function(oEvent, bDelayed){

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

		// check if selected item is still valid
		var aItems = [];
		if (this._getExistingListBox()) {
			// do not use this.getItems because AutoComplete has there an other logic
			aItems = this._getListBox().getItems();
		}
		var sSelectedKey = this.getSelectedKey();
		var sSelectedItemId = this.getSelectedItemId();
		var sNewKey, sNewId, sNewValue, sNewAdditionalText;
		var sValue = this.getValue();
		var iIndex = -1;
		var bFoundByKey = false;
		var bFoundById = false;
		var bFoundByValue = false;
		this._iClosedUpDownIdx = -1;
		var bBoundValue = !!this.getBinding("value");
		var bBoundSelectedKey = !!this.getBinding("selectedKey");
		// binding for itemId makes no sense...

		if (bBoundValue && bBoundSelectedKey) {
			// if both bound -> only use key
			bBoundValue = false;
		}
		var i = 0;
		var oItem;

		for ( i = 0; i < aItems.length; i++) {
			oItem = aItems[i];
			if ((this._sWantedSelectedKey || this._sWantedSelectedItemId)
			     && (oItem.getKey() == this._sWantedSelectedKey || oItem.getId() == this._sWantedSelectedItemId)
			     && oItem.getEnabled()) {
				// Item set before exist - now it exist
				sNewKey = oItem.getKey();
				sNewId = oItem.getId();
				sNewValue = oItem.getText();
				sNewAdditionalText = (oItem.getAdditionalText ? oItem.getAdditionalText() : "");
				iIndex = i;
				this._sWantedSelectedKey = undefined;
				this._sWantedSelectedItemId = undefined;
				break;
			} else if (sSelectedKey && oItem.getKey() == sSelectedKey && oItem.getEnabled() && !(bFoundByValue && bBoundValue)) {
				// if not a WantedKey or Id is used, first search for key
				bFoundByKey = true;
				sNewKey = sSelectedKey;
				sNewId = oItem.getId();
				sNewValue = oItem.getText();
				sNewAdditionalText = (oItem.getAdditionalText ? oItem.getAdditionalText() : "");
				iIndex = i;

				if (sNewValue == sValue && sNewId == sSelectedItemId
				    && !this._sWantedSelectedKey  && !this._sWantedSelectedItemId) {
					// value, id and key still the same and no items searched for existence
					break;
				}
				if (bBoundSelectedKey && !this._sWantedSelectedKey  && !this._sWantedSelectedItemId) {
					// bound on key and no not items searched for existence
					break;
				}
			} else if (sSelectedItemId && oItem.getId() == sSelectedItemId && oItem.getEnabled() && !bFoundByKey && !(bFoundByValue && bBoundValue)) {
				// if not a WantedKey or Id is used and not found by key search for ID
				bFoundById = true;
				sNewKey = oItem.getKey();
				sNewId = sSelectedItemId;
				sNewValue = oItem.getText();
				sNewAdditionalText = (oItem.getAdditionalText ? oItem.getAdditionalText() : "");
				iIndex = i;
			} else if (oItem.getText() == sValue && oItem.getEnabled() && !(bFoundByKey && !bBoundValue) && !(bFoundById && !bBoundValue) && !bFoundByValue) {
				// if not a WantedKey or Id is used and not found by key or ID, search for Value (use only first hit)
				bFoundByValue = true;
				sNewKey = oItem.getKey();
				sNewId = oItem.getId();
				sNewValue = sValue;
				sNewAdditionalText = (oItem.getAdditionalText ? oItem.getAdditionalText() : "");
				iIndex = i;
				if (bBoundValue && !this._sWantedSelectedKey  && !this._sWantedSelectedItemId) {
					// bound on value and no items searched for existence
					break;
				}
			}
		}

		this._iClosedUpDownIdx = iIndex;
		if (sValue != sNewValue && iIndex >= 0) { //only if item found
			this.setProperty("value", sNewValue, true); // no rerendering needed
			jQuery(this.getInputDomRef()).val(sNewValue);
		}
		this.setProperty("selectedKey", sNewKey, true); // no rerendering needed
		this.setProperty("selectedItemId", sNewId, true); // no rerendering needed
		var oDomRef = this.getDomRef();
		if ( oDomRef ) {
			jQuery(this.getInputDomRef()).attr("aria-setsize", aItems.length);
			if (sNewId) {
				this._updatePosInSet( null, iIndex + 1, sNewAdditionalText);
			} else {
				this._updatePosInSet( null, -1, null);
			}
			if (this.mobile) {
				// refresh und rebulid select options because not ever known what exactly changed
				var oSelect = this.getDomRef("select");
				while (oSelect.length > 0) {
					oSelect.remove(0);
				}
				for ( i = 0; i < aItems.length; i++) {
					oItem = aItems[i];
					var oOption = document.createElement("option");
					oOption.text = oItem.getText();
					oOption.id = this.getId() + "-" + oItem.getId();
					if (!oItem.getEnabled()) {
						oOption.disabled = "disabled";
					}
					oSelect.add(oOption, null);
				}
				oSelect.selectedIndex = iIndex;
			}
		}

	};

	ComboBox.prototype._handleItemInvalidated = function(oEvent){

		if (this._bNoItemCheck) {
			// Items are updated by binding but might have same IDs like before
			// only check once after udate is complete
			return;
		}

		// an Item had changed -> check if text or key must be changed
		var oItem = oEvent.getParameter("item");
		if (oItem.getId() == this.getSelectedItemId()) {
			if (oItem.getKey() != this.getSelectedKey()) {
				this.setProperty("selectedKey", oItem.getKey(), true); // no rerendering needed
			}
			if (oItem.getText() != this.getValue()) {
				// just update the value without changing wanted key or id
				TextField.prototype.setValue.apply(this, [oItem.getText()]);
			}
		}

		// maybe the wanted selected item is available now
		if (!this._sHandleItemsChanged) {
			// if there is an async. call outstanding, no call for item needed
			this._handleItemsChanged(oEvent);
		}

	};

	//***********************************************************
	// Focus information handling and rendering related
	//***********************************************************

	/**
	 * Returns an object representing the serialized focus information
	 * To be overwritten by the specific control method
	 * @return {object} an object representing the serialized focus information
	 * @private
	 */
	ComboBox.prototype.getFocusInfo = function(){
		return {id: this.getId(), sTypedChars: this._sTypedChars};
	};

	/*
	 * Applies the focus info
	 * To be overwritten by the specific control method
	 * @param {object} oFocusInfo
	 * @private
	 */
	ComboBox.prototype.applyFocusInfo = function(oFocusInfo){

		var $Inp = jQuery(this.getInputDomRef());

		// only apply the stored value if the FocusInfo wasn't processed by
		// the Popup. It might be possible that an application changed the value
		// within the ComboBox in the meantime and the stored value in the FocusInfo
		// is outdated.
		if (!oFocusInfo.popup) {
			$Inp.val(oFocusInfo.sTypedChars);
		}
		if (!this.getSelectedItemId() || sap.ui.getCore().byId(this.getSelectedItemId()).getText() != oFocusInfo.sTypedChars) {
			// text entred before and is not the currently selected item -> just restore type-ahead
			this._doTypeAhead();
		}
		this.focus();
		return this;
	};

	/*
	 * Ensure that handed in ListBoxes are taken from the visible UI immediately.
	 * @protected
	 */
	ComboBox.prototype.onAfterRendering = function(oEvent){

		TextField.prototype.onAfterRendering.apply(this, arguments);

		// if a ListBox is given (shared ListBox) make sure that is nor visible and move it in the
		// static UI Area. Not needed for private ListBox
		var sListBox = this.getListBox();
		if (sListBox) {
			var oListBox = sap.ui.getCore().byId(sListBox);
			if (oListBox.getDomRef()) {
				oListBox.$().appendTo(sap.ui.getCore().getStaticAreaRef());
			}
		}

		if (this.mobile) {
			var that = this;
			this.$("select").bind("change", function(){
				var newVal = that.$("select").val();
				//as iPad ignores disabled attibute on option - check if item is enabled -> otherwise ignore
				var aItems = that.getItems();
				var bEnabled = true;
				var iOldIndex = 0;
				var sOldValue = that.getValue();

				for ( var i = 0; i < aItems.length; i++) {
					if (aItems[i].getText() == newVal) {
						// Value found
						bEnabled = aItems[i].getEnabled();
					}
					if (aItems[i].getText() == sOldValue) {
						// old Value found
						iOldIndex = i;
					}
				}
				if (bEnabled) {
					that.setValue(newVal);
					that.fireChange({newValue:newVal, selectedItem: sap.ui.getCore().byId(that.getSelectedItemId())});
				} else {
					that.getDomRef("select").selectedIndex = iOldIndex;
				}
			});
			// set initial selected item
			if (this.getSelectedItemId()) {
				for ( var i = 0; i < this.getItems().length; i++) {
					var oItem = this.getItems()[i];
					if (this.getSelectedItemId() == oItem.getId()) {
						this.getDomRef("select").selectedIndex = i;
						break;
					}
				}
			} else {
				this._addDummyOption(this.getValue());
			}
		}
	};


	//***********************************************************
	// Misc.
	//***********************************************************

	/**
	 * Figure out whether the triggered key was a hotkey
	 * @param {jQuery.Event} oEvent the event fired on the ComboBox
	 * @returns {boolean} flag if hotkey or not
	 * @private
	 * @static
	 */
	ComboBox._isHotKey = function(oEvent){
		if (oEvent.altKey || oEvent.ctrlKey || oEvent.metaKey) {
			return true;
		}

		var iKeyCode = oEvent.keyCode || oEvent.which,
			eKC = jQuery.sap.KeyCodes;

		switch (iKeyCode) {
			// some keys can be identified as hotkey 'all alone'
			case eKC.ENTER:
			case eKC.SHIFT:
			case eKC.TAB:
			case eKC.ALT:
			case eKC.CONTROL:
				return true;
			// as  some keys share the keycode with standard characters (only in keypress event), ensure that which equals 0
			case eKC.END:
			case eKC.HOME:
			case eKC.ARROW_LEFT:
			case eKC.ARROW_UP:
			case eKC.ARROW_RIGHT:
			case eKC.ARROW_DOWN:
			case eKC.F1:
			case eKC.F2:
			case eKC.F3:
			case eKC.F4:
			case eKC.F5:
			case eKC.F6:
			case eKC.F7:
			case eKC.F8:
			case eKC.F9:
			case eKC.F10:
			case eKC.F11:
			case eKC.F12:
				if (oEvent.type == "keypress") {
					return oEvent.which === 0;
				} else {
					return true;
				}
				// falls through
			default:
				return false;
		}
	};

	/*
	 * Overwrite of standard function
	 */
	ComboBox.prototype.setSelectedKey = function(sSelectedKey) {

		if (this.getSelectedKey() == sSelectedKey) {
			// not changed
			return this;
		}

		if (!sSelectedKey && this._isSetEmptySelectedKeyAllowed()) {
			// selectedKey explicit not set -> select no item and initialize value
			return this;
		}

		// find corresponding item
		var aItems = this.getItems();
		var bNotFound = true;
		var sSelectedItemId;
		var iIndex;
		var sAdditionalText;

		for ( var i = 0; i < aItems.length; i++) {
			if (aItems[i].getKey() == sSelectedKey && aItems[i].getEnabled()) {
				// key found -> set corresponding value
				var oSelectedItem = aItems[i];
				sSelectedItemId = oSelectedItem.getId();
				var sValue = oSelectedItem.getText();
				sAdditionalText = (oSelectedItem.getAdditionalText ? oSelectedItem.getAdditionalText() : "");
				this.setValue(sValue, true);
				this._sTypedChars = sValue;
				iIndex = i;

				bNotFound = false;
				break;
			}
		}
		if (!bNotFound) {
			this.setProperty("selectedKey", sSelectedKey, true); // no rerendering needed
			this.setProperty("selectedItemId", sSelectedItemId, true); // no rerendering needed
			var oDomRef = this.getDomRef();
			if ( oDomRef ) {
				this._updatePosInSet( null, iIndex + 1, sAdditionalText);
				if (this.mobile) {
					this._removeDummyOption();
					this.getDomRef("select").selectedIndex = iIndex;
				}
			}
			this._sWantedSelectedKey = undefined;
			this._iClosedUpDownIdx = iIndex;
		} else {
			// remember key to set later if items are updated
			this._sWantedSelectedKey = sSelectedKey;
			this._iClosedUpDownIdx = -1;
		}
		this._sWantedSelectedItemId = undefined; // delete wanted ID, because key was used later
		return this;
	};

	/*
	 * To be overwritten by DropdownBox
	 * in ComboBox an empty selected Key is allowed, then select no item and initialize value
	 */
	ComboBox.prototype._isSetEmptySelectedKeyAllowed = function() {

			this.setProperty("selectedKey", "", true); // no rerendering needed
			this.setProperty("selectedItemId", "", true); // no rerendering needed
			this.setValue("", true);
			return true;

	};

	/*
	 * Overwrite of standard function
	 */
	ComboBox.prototype.setSelectedItemId = function(sSelectedItemId) {

		if (this.getSelectedItemId() == sSelectedItemId) {
			// not changed
			return this;
		}

		if (!sSelectedItemId && this._isSetEmptySelectedKeyAllowed()) {
			// selectedItemId explicit not set -> select no item and initialize value
			return this;
		}

		//find corresponding item
		var aItems = this.getItems();
		var bNotFound = true;
		var sKey;
		var iIndex;
		var sAdditionalText;

		for ( var i = 0; i < aItems.length; i++) {
			if (aItems[i].getId() == sSelectedItemId && aItems[i].getEnabled()) {
				// key found -> set corresponding value
				var oSelectedItem = aItems[i];
				sKey = oSelectedItem.getKey();
				var sValue = oSelectedItem.getText();
				sAdditionalText = (oSelectedItem.getAdditionalText ? oSelectedItem.getAdditionalText() : "");
				this.setValue(sValue, true);
				this._sTypedChars = sValue;
				iIndex = i;

				bNotFound = false;
				break;
			}
		}
		if (!bNotFound) {
			this.setProperty("selectedItemId", sSelectedItemId, true); // no rerendering needed
			this.setProperty("selectedKey", sKey, true); // no rerendering needed
			var oDomRef = this.getDomRef();
			if ( oDomRef ) {
				this._updatePosInSet( null, iIndex + 1, sAdditionalText);
				if (this.mobile) {
					this._removeDummyOption();
					this.getDomRef("select").selectedIndex = iIndex;
				}
			}
			this._sWantedSelectedItemId = undefined;
			this._iClosedUpDownIdx = iIndex;
		} else {
			// remember ID to set later if items are updated
			this._sWantedSelectedItemId = sSelectedItemId;
			this._iClosedUpDownIdx = -1;
		}
		this._sWantedSelectedKey = undefined; // delete wanted key, because ID was used later
		return this;
	};

	/*
	 * Overwrite of TextField function
	 * additional parameter bNotSetSelectedKey to not set selected key because set
	 * from calling function
	 */
	ComboBox.prototype.setValue = function(sValue, bNotSetSelectedKey) {

		if (!bNotSetSelectedKey) {
			// find key for value
			var aItems = this.getItems();
			var sKey;
			var sSelectedItemId;
			var iIndex;
			var sAdditionalText;
			this._iClosedUpDownIdx = -1;

			for ( var i = 0; i < aItems.length; i++) {
				if (aItems[i].getText() == sValue && aItems[i].getEnabled()) {
					// Value found -> set corresponding key
					var oSelectedItem = aItems[i];
					sSelectedItemId = oSelectedItem.getId();
					sKey = oSelectedItem.getKey();
					sAdditionalText = (oSelectedItem.getAdditionalText ? oSelectedItem.getAdditionalText() : "");
					iIndex = i;
					this._iClosedUpDownIdx = iIndex;
					break;
				}
			}
			this.setProperty("selectedKey", sKey, true); // no rerendering needed
			this.setProperty("selectedItemId", sSelectedItemId, true); // no rerendering needed
			var oDomRef = this.getDomRef();
			if ( oDomRef ) {
				if (sSelectedItemId) {
					this._updatePosInSet( null, iIndex + 1, sAdditionalText);
				} else {
					this._updatePosInSet( null, -1, null);
				}
				if (this.mobile) {
					if (!sSelectedItemId) {
						// no list item entered (free text) => add one dummy item to the select box
						this._addDummyOption(sValue);
					} else {
						this._removeDummyOption();
						this.getDomRef("select").selectedIndex = iIndex;
					}
				}
			}
		}

		// call standard TextField function
		TextField.prototype.setValue.apply(this, [sValue]);
		this._sTypedChars = this.getValue();
		this._sWantedSelectedKey = undefined;
		this._sWantedSelectedItemId = undefined;
		return this;
	};

	/*
	 * Overwite of INVALIDATE
	 * do not invalidate ComboBox if only ListBox is changed
	*/
	ComboBox.prototype.invalidate = function(oOrigin) {

		if (!oOrigin || !(oOrigin instanceof sap.ui.commons.ListBox) || oOrigin != this._getListBox()) {
			sap.ui.core.Control.prototype.invalidate.apply(this, arguments);
		} else {
			// register ListBox as invalidated
			if (this.getUIArea() && oOrigin.getDomRef()) {
				this.getUIArea().addInvalidatedControl(oOrigin);
			}
		}

	};

	/*
	 * Overwrite CLONE to set aggregation of ListBox
	 */
	ComboBox.prototype.clone = function(sIdSuffix){

		var oClone = sap.ui.core.Control.prototype.clone.apply(this, arguments),
			oListBox = this.getAggregation("myListBox"),
			oListBoxClone;

		// if listbox exists, clone it and add it to the combobox clone
		// FIX 20120905 FWE when items is fully bound for this ComboBox, _oListBox exists already in the clone and must not be cloned again
		if (oListBox && !oClone._oListBox) {
			// detatch event handlers to not clone it.
			oListBox.detachEvent("itemsChanged", this._handleItemsChanged, this);
			oListBox.detachEvent("itemInvalidated",this._handleItemInvalidated, this);

			oListBoxClone = oListBox.clone(sIdSuffix);
			// attach events to clone
			oListBoxClone.attachEvent("itemsChanged",oClone._handleItemsChanged, oClone);
			oListBoxClone.attachEvent("itemInvalidated",oClone._handleItemInvalidated, oClone);
			oClone.setAggregation("myListBox", oListBoxClone, true);
			oClone._oListBox = oListBoxClone;

			// attach events again
			oListBox.attachEvent("itemsChanged",this._handleItemsChanged, this);
			oListBox.attachEvent("itemInvalidated",this._handleItemInvalidated, this);
		}

		return oClone;

	};

	ComboBox.prototype._addDummyOption = function(sValue){

		var oOption = this.getDomRef("dummyOption");
		if (!oOption) {
			var aItems = this.getItems();
			oOption = document.createElement("option");
			oOption.text = sValue;
			oOption.id = this.getId() + "-dummyOption";
			if (aItems.length > 0) {
				this.getDomRef("select").add(oOption, jQuery.sap.domById(this.getId() + "-" + aItems[0].getId()));
			} else {
				this.getDomRef("select").add(oOption, null);
			}
		} else {
			oOption.text = sValue;
		}
		this.getDomRef("select").selectedIndex = 0;

	};

	ComboBox.prototype._removeDummyOption = function(){

		var oOption = this.getDomRef("dummyOption");
		if (oOption) {
			this.getDomRef("select").remove(0);
		}

	};

	ComboBox.prototype.getFocusDomRef = function() {

		if (this.mobile) {
			return this.getDomRef("select") || null;
		} else {
			return this.getDomRef("input") || null;
		}

	};

	ComboBox.prototype._updatePosInSet = function($Input, iIndex, sAdditionalText) {

		if (!$Input) {
			$Input = this.$("input");
		}

		if (iIndex >= 0) {
			$Input.attr("aria-posinset", iIndex);
			if (this.getDisplaySecondaryValues()) {
				this.$("SecVal").text(sAdditionalText);
			}
		} else {
			$Input.removeAttr("aria-posinset");
			if (this.getDisplaySecondaryValues()) {
				this.$("SecVal").text("");
			}
		}

	};

	// to overwrite JS doc with new event parameter

	/**
	 * Fire event change to attached listeners.
	 *
	 * Expects following event parameters:
	 * <ul>
	 * <li>'newValue' of type <code>string</code> The new / changed value of the textfield.</li>
	 * <li>'selectedItem' of type <code>sap.ui.core.ListItem</code> selected item </li>
	 * </ul>
	 *
	 * @param {Map} [mArguments] the arguments to pass along with the event.
	 * @return {sap.ui.commons.ComboBox} <code>this</code> to allow method chaining
	 * @protected
	 * @name sap.ui.commons.ComboBox#fireChange
	 * @function
	 */

	/**
	 * Event is fired when the text in the field has changed AND the focus leaves the ComboBox or the Enter key is pressed.
	 *
	 * @name sap.ui.commons.ComboBox#change
	 * @event
	 * @param {sap.ui.base.Event} oControlEvent
	 * @param {sap.ui.base.EventProvider} oControlEvent.getSource
	 * @param {object} oControlEvent.getParameters
	 * @param {string} oControlEvent.getParameters.newValue The new / changed value of the ComboBox.
	 * @param {sap.ui.core.ListItem} oControlEvent.getParameters.selectedItem The new / changed item of the ComboBox.
	 * @public
	 */


	return ComboBox;

}, /* bExport= */ true);
