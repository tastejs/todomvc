/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.commons.RadioButtonGroup.
sap.ui.define(['jquery.sap.global', './library', 'sap/ui/core/Control', 'sap/ui/core/delegate/ItemNavigation'],
	function(jQuery, library, Control, ItemNavigation) {
	"use strict";

	/**
	 * Constructor for a new RadioButtonGroup.
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given 
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * The RadioButtonGroup is a basic control that is used to provide area for making interactive 
	 * choice out of a set of options. It represents a list with items where exactly one item can 
	 * be selected in a session. For the representation of the single group entries, the RadioButton 
	 * items are created automatically. For the RadioButton choice, mouse and keyboard navigation 
	 * usage is supported.
	 * 
	 * @extends sap.ui.core.Control
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @alias sap.ui.commons.RadioButtonGroup
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var RadioButtonGroup = Control.extend("sap.ui.commons.RadioButtonGroup", /** @lends sap.ui.commons.RadioButtonGroup.prototype */ { metadata : {

		library : "sap.ui.commons",
		properties : {

			/**
			 * Defines the width of the RadioButtonGroup.
			 */
			width : {type : "sap.ui.core.CSSSize", group : "Dimension", defaultValue : null},

			/**
			 * Determines the maximum number of RadioButtons displayed in one line.
			 */
			columns : {type : "int", group : "Appearance", defaultValue : 1},

			/**
			 * Specifies whether the user can change the selected value of the RadioButtonGroup.
			 * When the property is set to false, the control obtains visual styles
			 * different from its visual styles for the normal and the disabled state.
			 * Additionally the control is no longer interactive, but can receive focus.
			 */
			editable : {type : "boolean", group : "Behavior", defaultValue : true},

			/**
			 * Тhe value state to be displayed for the RadioButton. Possible values are: sap.ui.core.ValueState.Error,
			 * sap.ui.core.ValueState.Warning, sap.ui.core.ValueState.Success and sap.ui.core.ValueState.None.
			 * Note: Setting this attribute to sap.ui.core.ValueState.Error when the accessibility feature is enabled,
			 * sets the value of the invalid property for the whole RadioButtonGroup to true.
			 */
			valueState : {type : "sap.ui.core.ValueState", group : "Data", defaultValue : sap.ui.core.ValueState.None},

			/**
			 * The index of the selected/checked RadioButton.
			 */
			selectedIndex : {type : "int", group : "Data", defaultValue : 0},

			/**
			 * Enables/disables the RadioButtonGroup. If it is disabled all RadioButtons will be displayed as disabled. 
			 * The enabled property of the Item will not be used in this case. If the RadioButtonGroup is enabled, the 
			 * enabled property of the Item will define if a RadioButton is enabled or not.
			 * 
			 * @since 1.10.3
			 */
			enabled : {type : "boolean", group : "Behavior", defaultValue : true}
		},
		defaultAggregation : "items",
		aggregations : {

			/**
			 * The RadioButtons of this RadioButtonGroup.
			 */
			items : {type : "sap.ui.core.Item", multiple : true, singularName : "item", bindable : "bindable"}
		},
		associations : {

			/**
			 * Association to controls / IDs, which describe this control (see WAI-ARIA attribute aria-describedby).
			 */
			ariaDescribedBy : {type : "sap.ui.core.Control", multiple : true, singularName : "ariaDescribedBy"}, 

			/**
			 * Association to controls / IDs, which label this control (see WAI-ARIA attribute aria-labelledby).
			 */
			ariaLabelledBy : {type : "sap.ui.core.Control", multiple : true, singularName : "ariaLabelledBy"}
		},
		events : {

			/**
			 * Fires when selection is changed by user interaction.
			 */
			select : {
				parameters : {

					/**
					 * Index of the selected RadioButton.
					 */
					selectedIndex : {type : "int"}
				}
			}
		}
	}});


	RadioButtonGroup.prototype.exit = function() {
		this.destroyItems(); // or Element.exit should call the typed destroyXYZ methods?

		if (this.oItemNavigation) {
			this.removeDelegate(this.oItemNavigation);
			this.oItemNavigation.destroy();
			delete this.oItemNavigation;
		}

	};

	RadioButtonGroup.prototype.onBeforeRendering = function() {
		if (this.getSelectedIndex() > this.getItems().length) {
			// SelectedIndex is > than number of items -> select the first one
			jQuery.sap.log.warning("Invalid index, set to 0");
			this.setSelectedIndex(0);
		}
	};

	RadioButtonGroup.prototype.onAfterRendering = function() {

		this.initItemNavigation();

		// update ARIA information of RadioButtons
		for (var i = 0; i < this.aRBs.length; i++) {
			this.aRBs[i].$().attr("aria-posinset", i + 1).attr("aria-setsize", this.aRBs.length);
		}
	};

	/*
	 * Initializes ItemNavigation. Transfers RadioButtons to ItemNavigation.
	 * TabIndexes are set by ItemNavigation.
	 * @private
	 */
	RadioButtonGroup.prototype.initItemNavigation = function(){

		// Collect items for ItemNavigation
		var aDomRefs = [];
		this._aActiveItems = [];
		var aActiveItems = this._aActiveItems;
		var bEnabled = false;
		for (var i = 0; i < this.aRBs.length; i++) {
			aActiveItems[aDomRefs.length] = i;
			aDomRefs.push(this.aRBs[i].getDomRef());
			if (!bEnabled && this.aRBs[i].getEnabled()) {
				// at least one RadioButton is enabled
				bEnabled = true;
			}
		}

		if (bEnabled) {
			// at least one RadioButton enabled -> use property of RadioButtonGroup
			// so if all RadioButtons are disabled the RadioButtonGroup is disabled too.
			bEnabled = this.getEnabled();
		}

		if (!bEnabled) {
			// RadioButtonGroup is disabled -> no ItemNavigation
			if (this.oItemNavigation) {
				this.removeDelegate(this.oItemNavigation);
				this.oItemNavigation.destroy();
				delete this.oItemNavigation;
			}
			return;
		}

		// init ItemNavigation
		if (!this.oItemNavigation) {
			this.oItemNavigation = new ItemNavigation();
			this.oItemNavigation.attachEvent(ItemNavigation.Events.AfterFocus, this._handleAfterFocus, this);
			this.addDelegate(this.oItemNavigation);
		}
		this.oItemNavigation.setRootDomRef(this.getDomRef());
		this.oItemNavigation.setItemDomRefs(aDomRefs);
		this.oItemNavigation.setCycling(true);
		this.oItemNavigation.setColumns(this.getColumns());
		this.oItemNavigation.setSelectedIndex(this.getSelectedIndex());
		this.oItemNavigation.setFocusedIndex(this.getSelectedIndex());
	};

	/*
	 * Sets the selected RadioButton using Index.
	 * @public
	 */
	RadioButtonGroup.prototype.setSelectedIndex = function(iSelectedIndex) {

		var iIndexOld = this.getSelectedIndex();

		if (iSelectedIndex < 0) {
			// invalid negative index -> don't change index.
			jQuery.sap.log.warning("Invalid index, will not be changed");
			return this;
		}

		this.setProperty("selectedIndex", iSelectedIndex, true); // no re-rendering

		// deselect old RadioButton
		if ( !isNaN(iIndexOld) && this.aRBs && this.aRBs[iIndexOld]) {
			this.aRBs[iIndexOld].setSelected(false);
		}

		// select new one
		if (this.aRBs && this.aRBs[iSelectedIndex]) {
			this.aRBs[iSelectedIndex].setSelected(true);
		}

		if (this.oItemNavigation) {
			this.oItemNavigation.setSelectedIndex(iSelectedIndex);
			this.oItemNavigation.setFocusedIndex(iSelectedIndex);
		}

		return this;

	};

	/*
	 * Sets selected RadioButton using Item
	 * @param {sap.ui.core.Item} oSelectedItem The Item to be selected
	 * @public
	 */

	/**
	 * Sets the Item as selected and removes the selection from the previous one.
	 *
	 * @param {sap.ui.core.Item} oSelectedItem Selected item
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	RadioButtonGroup.prototype.setSelectedItem = function(oSelectedItem) {

		for (var i = 0; i < this.getItems().length; i++) {
			if (oSelectedItem.getId() == this.getItems()[i].getId()) {
				this.setSelectedIndex(i);
				break;
			}
		}
	};

	/*
	 * Gets the Item of the selected RadioButton and returns it.
	 * @public
	 * 
	 */

	/**
	 * When no item is selected, "null" is returned.
	 *
	 * @returns {sap.ui.core.Item} Selected Item
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	RadioButtonGroup.prototype.getSelectedItem = function() {

		return this.getItems()[this.getSelectedIndex()];

	};

	/*
	 * Adds a new Item.
	 * If an Item is added, a new RadioButton must be added too.
	 * @public
	 */
	RadioButtonGroup.prototype.addItem = function(oItem) {

		this.myChange = true;
		this.addAggregation("items", oItem);
		oItem.attachEvent("_change", this._handleItemChanged, this);
		this.myChange = undefined;

		if (!this._bUpdateItems) {
			if (this.getSelectedIndex() === undefined) {
				// if not defined -> select first one
				this.setSelectedIndex(0);
			}
		}

		if (!this.aRBs) {
			this.aRBs = [];
		}

		var iIndex = this.aRBs.length;

		this.aRBs[iIndex] = this.createRadioButton(oItem, iIndex);

		return this;
	};

	/*
	 * Inserts a new Item.
	 * If an Item is inserted, a new RadioButton must be inserted too.
	 * @public
	 */
	RadioButtonGroup.prototype.insertItem = function(oItem, iIndex) {

		this.myChange = true;
		this.insertAggregation("items", oItem, iIndex);
		oItem.attachEvent("_change", this._handleItemChanged, this);
		this.myChange = undefined;

		if (!this.aRBs) {
			this.aRBs = [];
		}

		var iLength = this.aRBs.length;

		if (!this._bUpdateItems) {
			if (this.getSelectedIndex() === undefined || iLength == 0) {
				// if not defined -> select first one
				this.setSelectedIndex(0);
			} else if (this.getSelectedIndex() >= iIndex) {
				// If inserted before selected one, move selection index (only change parameter, not RadioButton)
				this.setProperty("selectedIndex", this.getSelectedIndex() + 1, true); // no re-rendering
			}
		}

		if ( iIndex >= iLength) {
			this.aRBs[iIndex] = this.createRadioButton(oItem, iIndex);
		} else {
			// Insert RadioButton: loop backwards over Array and shift everything
			for (var i = (iLength); i > iIndex; i--) {
				this.aRBs[i] = this.aRBs[i - 1];
				if ((i - 1) == iIndex) {
					this.aRBs[i - 1] = this.createRadioButton(oItem, iIndex);
				}
			}
		}

		return this;

	};

	/*
	 * Creates RadioButton for an Item.
	 * @private
	 */
	RadioButtonGroup.prototype.createRadioButton = function(oItem, iIndex){

		if (this.iIDCount == undefined) {
			this.iIDCount = 0;
		} else {
			this.iIDCount++;
		}

		var oRadioButton = new sap.ui.commons.RadioButton(this.getId() + "-" + this.iIDCount);
		oRadioButton.setText(oItem.getText());
		oRadioButton.setTooltip(oItem.getTooltip());
		if (this.getEnabled()) {
			oRadioButton.setEnabled(oItem.getEnabled());
		} else {
			oRadioButton.setEnabled(false);
		}
		oRadioButton.setKey(oItem.getKey());
		oRadioButton.setTextDirection(oItem.getTextDirection());
		oRadioButton.setEditable(this.getEditable());
		oRadioButton.setGroupName(this.getId());
		oRadioButton.setValueState(this.getValueState());
		oRadioButton.setParent(this);

		if ( iIndex == this.getSelectedIndex() ) {
			oRadioButton.setSelected(true);
		}

		oRadioButton.attachEvent('select', this.handleRBSelect, this);

		return oRadioButton;
	};

	/*
	 * Removes an Item.
	 * If an Item is removed, the corresponding RadioButton must be deleted.
	 * @public
	 */
	RadioButtonGroup.prototype.removeItem = function(vElement) {
		var iIndex = vElement;
		if (typeof (vElement) == "string") { // ID of the element is given
			vElement = sap.ui.getCore().byId(vElement);
		}
		if (typeof (vElement) == "object") { // the element itself is given or has just been retrieved
			iIndex = this.indexOfItem(vElement);
		}

		this.myChange = true;
		var oItem = this.removeAggregation("items", iIndex);
		oItem.detachEvent("_change", this._handleItemChanged, this);
		this.myChange = undefined;

		if (!this.aRBs) {
			this.aRBs = [];
		}

		if (!this.aRBs[iIndex]) {
			// RadioButton not exists
			return null;
		}

		this.aRBs[iIndex].destroy();
		this.aRBs.splice(iIndex, 1);

		if (!this._bUpdateItems) {
			if (this.aRBs.length == 0) {
				this.setSelectedIndex(undefined);
			} else if (this.getSelectedIndex() == iIndex) {
				// selected one is removed -> select first one
				this.setSelectedIndex(0);
			} else if (this.getSelectedIndex() > iIndex) {
				// If removed before selected one, move selection index (only change parameter, not RadioButton)
				this.setProperty("selectedIndex", this.getSelectedIndex() - 1, true); // no re-rendering
			}
		}

		return oItem;
	};

	/*
	 * Removes all Items.
	 * If all Items are removed, all RadioButtons must be deleted.
	 * @public
	 */
	RadioButtonGroup.prototype.removeAllItems = function() {

		this.myChange = true;
		var aItems = this.removeAllAggregation("items");
		for (var i = 0; i < aItems.length; i++) {
			aItems[i].detachEvent("_change", this._handleItemChanged, this);
		}
		this.myChange = undefined;

		if (!this._bUpdateItems) {
			this.setSelectedIndex(undefined);
		}

		if (this.aRBs) {
			while (this.aRBs.length > 0) {
				this.aRBs[0].destroy();
				this.aRBs.splice(0, 1);
			}
			return aItems;
		} else {
			return null;
		}

	};

	/*
	 * Destroys all Items.
	 * If all Items are destroyed, all RadioButtons must be deleted.
	 * @public
	 */
	RadioButtonGroup.prototype.destroyItems = function() {

		this.myChange = true;
		var aItems = this.getItems();
		for (var i = 0; i < aItems.length; i++) {
			aItems[i].detachEvent("_change", this._handleItemChanged, this);
		}
		this.destroyAggregation("items");
		this.myChange = undefined;

		if (!this._bUpdateItems) {
			this.setSelectedIndex(undefined);
		}

		if (this.aRBs) {
			while (this.aRBs.length > 0) {
				this.aRBs[0].destroy();
				this.aRBs.splice(0, 1);
			}
		}

		return this;

	};

	/*
	 * Update all Items.
	 * Update RadioButtonGroup Items in regard to the aggregation binding.
	 * @public
	 */
	RadioButtonGroup.prototype.updateItems = function() {

		var iSelectedIndex = this.getSelectedIndex();

		this._bUpdateItems = true;
		this.updateAggregation("items");
		this._bUpdateItems = undefined;

		// if selectedIndex is still valid -> restore
		var aItems = this.getItems();
		if (iSelectedIndex === undefined && aItems.length > 0) {
			// if not defined -> select first one
			this.setSelectedIndex(0);
		}else if (iSelectedIndex >= 0 && aItems.length == 0) {
			this.setSelectedIndex(undefined);
		}else if (iSelectedIndex >= aItems.length) {
			// if less items than before -> select last one
			this.setSelectedIndex(aItems.length - 1);
		}


	};

	/**
	 * Creates a new instance of RadioButtonGroup, with the same settings as the RadioButtonGroup
	 * on which the method is called.
	 * Event handlers are not cloned.
	 * @returns {sap.ui.commons.RadioButtonGroup} New instance of RadioButtonGroup
	 * @public
	 */
	RadioButtonGroup.prototype.clone = function(){

		// on clone don't clone event handler
		var aItems = this.getItems();
		var i = 0;
		for (i = 0; i < aItems.length; i++) {
			aItems[i].detachEvent("_change", this._handleItemChanged, this);
		}

		var oClone = Control.prototype.clone.apply(this, arguments);

		for (i = 0; i < aItems.length; i++) {
			aItems[i].attachEvent("_change", this._handleItemChanged, this);
		}

		return oClone;

	};

	/*
	 * Fires Select event for the group on Select event for single RadioButtons.
	 * @private
	 */
	RadioButtonGroup.prototype.handleRBSelect = function(oControlEvent){
		// find RadioButton in Array to get Index
		for (var i = 0; i < this.aRBs.length; i++) {
			if (this.aRBs[i].getId() == oControlEvent.getParameter("id")) {
				this.setSelectedIndex(i);
				this.oItemNavigation.setSelectedIndex(i);
				this.oItemNavigation.setFocusedIndex(i);
				this.fireSelect({selectedIndex: i});
				break;
			}
		}

	};

	/*
	 * Sets all RadioButtons to Editable/ReadOnly.
	 * @public
	 */
	RadioButtonGroup.prototype.setEditable = function(bEditable){

		this.setProperty("editable", bEditable, false); // re-rendering to update ItemNavigation

		if (this.aRBs) {
			for (var i = 0; i < this.aRBs.length; i++) {
				this.aRBs[i].setEditable(bEditable);
			}
		}
	};

	/*
	 * Sets all RadioButtons to Enabled/Disabled.
	 * @public
	 */
	RadioButtonGroup.prototype.setEnabled = function(bEnabled){

		this.setProperty("enabled", bEnabled, false); // re-rendering to update ItemNavigation

		if (this.aRBs) {
			var aItems = this.getItems();

			for (var i = 0; i < this.aRBs.length; i++) {
				if (bEnabled) {
					this.aRBs[i].setEnabled(aItems[i].getEnabled());
				} else {
					this.aRBs[i].setEnabled(bEnabled);
				}
			}
		}

	};

	/*
	 * Sets ValueState for all RadioButtons.
	 * @public
	 */
	RadioButtonGroup.prototype.setValueState = function(sValueState){

		this.setProperty("valueState", sValueState, false); // re-rendering to update ItemNavigation

		if (this.aRBs) {
			for (var i = 0; i < this.aRBs.length; i++) {
				this.aRBs[i].setValueState(sValueState);
			}
		}
	};

	/*
	 * Handles the event that gets fired by the {@link sap.ui.core.delegate.ItemNavigation} delegate.
	 * Ensures that focused element is selected.
	 *
	 * @param {sap.ui.base.Event} oControlEvent The event that gets fired by the {@link sap.ui.core.delegate.ItemNavigation} delegate
	 * @private
	 */
	RadioButtonGroup.prototype._handleAfterFocus = function(oControlEvent){

		var iIndex = oControlEvent.getParameter("index");
		var oEvent = oControlEvent.getParameter("event");

		if (iIndex != this.getSelectedIndex() && !(oEvent.ctrlKey || oEvent.metaKey) && this.aRBs[iIndex].getEditable() && this.aRBs[iIndex].getEnabled()) {
			// if CTRL key is used do not switch selection
			this.setSelectedIndex(iIndex);
			this.oItemNavigation.setSelectedIndex(iIndex);
			this.fireSelect({selectedIndex:iIndex});
		}
	};

	/**
	 * Forwards the change of the RadioButtonGroup to the RadioButton that is affected.
	 * @param {sap.ui.base.Event} oEvent
	 * @private
	 */
	RadioButtonGroup.prototype._handleItemChanged = function(oEvent){

		var oItem = oEvent.oSource;
		var sProperty = oEvent.getParameter("name");
		var snewValue = oEvent.getParameter("newValue");
		var aItems = this.getItems();
		var oRB;

		for (var i = 0; i < aItems.length; i++) {
			if ( aItems[i] == oItem) {
				if (this.aRBs[i]) {
					oRB = this.aRBs[i];
				}
				break;
			}
		}

		switch (sProperty) {
		case "text":
			oRB.setText(snewValue);
			break;
		case "tooltip":
			oRB.setTooltip(snewValue);
			break;
		case "enabled":
			if (this.getEnabled()) {
				oRB.setEnabled(snewValue);
			}
			break;
		case "key":
			oRB.setKey(snewValue);
			break;
		case "textDirection":
			oRB.setTextDirection(snewValue);
			break;

		default:
			break;
		}

	};

	return RadioButtonGroup;

}, /* bExport= */ true);
