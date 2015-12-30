/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.m.ComboBoxBase.
sap.ui.define(['jquery.sap.global', './Bar', './ComboBoxBaseRenderer', './Dialog', './InputBase', './SelectList', './Popover', './library', 'sap/ui/core/EnabledPropagator', 'sap/ui/core/IconPool'],
	function(jQuery, Bar, ComboBoxBaseRenderer, Dialog, InputBase, SelectList, Popover, library, EnabledPropagator, IconPool) {
		"use strict";

		/**
		 * Constructor for a new ComboBoxBase.
		 *
		 * @param {string} [sId] ID for the new control, generated automatically if no ID is given.
		 * @param {object} [mSettings] Initial settings for the new control.
		 *
		 * @class
		 * An abstract class for combo boxes.
		 * @extends sap.m.InputBase
		 *
		 * @author SAP SE
		 * @version 1.32.9
		 *
		 * @constructor
		 * @public
		 * @since 1.22.0
		 * @alias sap.m.ComboBoxBase
		 * @ui5-metamodel This control will also be described in the UI5 (legacy) design time meta model.
		 */
		var ComboBoxBase = InputBase.extend("sap.m.ComboBoxBase", /** @lends sap.m.ComboBoxBase.prototype */ { metadata: {

			"abstract": true,
			library: "sap.m",
			properties: {

				/**
				 * Sets the maximum width of the text field.
				 */
				maxWidth: { type: "sap.ui.core.CSSSize", group: "Dimension", defaultValue: "100%" }
			},
			defaultAggregation: "items",
			aggregations: {

				/**
				 * Defines the items contained within this control.
				 */
				items: { type: "sap.ui.core.Item", multiple: true, singularName: "item", bindable: "bindable" },

				/**
				 * Internal aggregation to hold the inner picker popup.
				 */
				picker: { type: "sap.ui.core.Control", multiple: false, visibility: "hidden" }
			}
		}});

		IconPool.insertFontFaceStyle();
		EnabledPropagator.apply(ComboBoxBase.prototype, [true]);

		/* =========================================================== */
		/* Private methods and properties                              */
		/* =========================================================== */

		/* ----------------------------------------------------------- */
		/* Private methods                                             */
		/* ----------------------------------------------------------- */

		/**
		 * Called, whenever the binding of the aggregation items is changed.
		 *
		 */
		ComboBoxBase.prototype.updateItems = function(sReason) {
			this.bDataUpdated = false;
			this.destroyItems();
			this.updateAggregation("items");
			this.bDataUpdated = true;
		};

		/**
		 * Called, when the items' aggregation needs to be refreshed.
		 *
		 * <b>Note:</b> This method has been overwritten to prevent <code>updateItems()</code>
		 * from being called when the bindings are refreshed.
		 * @see sap.ui.base.ManagedObject#bindAggregation
		 */
		ComboBoxBase.prototype.refreshItems = function() {
			this.bDataUpdated = false;
			this.refreshAggregation("items");
		};

		/**
		 * Gets the Select's <code>list</code>.
		 *
		 * @returns {sap.m.SelectList}
		 * @private
		 */
		ComboBoxBase.prototype.getList = function() {
			if (this.bIsDestroyed) {
				return null;
			}

			return this._oList;
		};

		/* =========================================================== */
		/* Lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Initialization hook.
		 *
		 */
		ComboBoxBase.prototype.init = function() {
			InputBase.prototype.init.apply(this, arguments);

			// sets the picker popup type
			this.setPickerType("Popover");

			// initialize composites
			this.createPicker(this.getPickerType());

			/**
			 * To detect whether the data is updated.
			 */
			this.bDataUpdated = false;
		};

		/**
		 * Cleans up before destruction.
		 *
		 */
		ComboBoxBase.prototype.exit = function() {
			InputBase.prototype.exit.apply(this, arguments);

			if (this.getList()) {
				this.getList().destroy();
				this._oList = null;
			}
		};

		/* =========================================================== */
		/* Event handlers                                              */
		/* =========================================================== */

		/**
		 * Handle the touch start event on the control.
		 *
		 * @param {jQuery.Event} oEvent The event object.
		 */
		ComboBoxBase.prototype.ontouchstart = function(oEvent) {

			if (!this.getEnabled() || !this.getEditable()) {
				return;
			}

			// mark the event for components that needs to know if the event was handled
			oEvent.setMarked();

			if (this.isOpenArea(oEvent.target)) {

				// add the active state to the control's field
				this.addStyleClass(ComboBoxBaseRenderer.CSS_CLASS + "Pressed");
			}
		};

		/**
		 * Handle the touch end event on the control.
		 *
		 * @param {jQuery.Event} oEvent The event object.
		 */
		ComboBoxBase.prototype.ontouchend = function(oEvent) {

			if (!this.getEnabled() || !this.getEditable()) {
				return;
			}

			// mark the event for components that needs to know if the event was handled
			oEvent.setMarked();

			if ((!this.isOpen() || !this.hasContent()) && this.isOpenArea(oEvent.target)) {

				// remove the active state of the control's field
				this.removeStyleClass(ComboBoxBaseRenderer.CSS_CLASS + "Pressed");
			}
		};

		/**
		 * Handles the tap event on the control.
		 *
		 * @param {jQuery.Event} oEvent The event object.
		 */
		ComboBoxBase.prototype.ontap = function(oEvent) {
			InputBase.prototype.ontap.apply(this, arguments);

			var CSS_CLASS = ComboBoxBaseRenderer.CSS_CLASS;

			// in case of a non-editable or disabled combo box, the picker popup cannot be opened
			if (!this.getEnabled() || !this.getEditable()) {
				return;
			}

			// mark the event for components that needs to know if the event was handled
			oEvent.setMarked();

			if (this.isOpenArea(oEvent.target)) {

				if (this.isOpen()) {
					this.close();
					this.removeStyleClass(CSS_CLASS + "Pressed");
					return;
				}

				if (this.hasContent()) {
					this.open();
				}
			}

			if (this.isOpen()) {

				// add the active state to the control's field
				this.addStyleClass(CSS_CLASS + "Pressed");
			}
		};

		/* ----------------------------------------------------------- */
		/* Keyboard handling                                           */
		/* ----------------------------------------------------------- */

		/**
		 * Handles the <code>onsapshow</code> event when F4 or Alt and DOWN arrow are pressed.
		 *
		 * @param {jQuery.Event} oEvent The event object.
		 */
		ComboBoxBase.prototype.onsapshow = function(oEvent) {

			// in case of a non-editable or disabled combo box, the picker popup cannot be opened
			if (!this.getEnabled() || !this.getEditable()) {
				return;
			}

			// mark the event for components that needs to know if the event was handled
			oEvent.setMarked();

			// note: prevent browser address bar to be open in ie9, when F4 is pressed
			if (oEvent.keyCode === jQuery.sap.KeyCodes.F4) {
				oEvent.preventDefault();
			}

			if (this.isOpen()) {
				this.close();
				return;
			}

			// select all text
			this.selectText(0, this.getValue().length);

			// open only if the combobox has items
			if (this.hasContent()) {
				this.open();
			}
		};

		/**
		 * Handles when escape is pressed.
		 *
		 * If picker popup is closed, cancel changes and revert to the original value when the input field got its focus.
		 * If list is open, close list.
		 *
		 * @param {jQuery.Event} oEvent The event object.
		 */
		ComboBoxBase.prototype.onsapescape = function(oEvent) {

			// a non editable or disabled ComboBox, the value cannot be changed
			if (this.getEnabled() && this.getEditable() && this.isOpen()) {

				// mark the event for components that needs to know if the event was handled
				oEvent.setMarked();

				// note: fix for Firefox
				oEvent.preventDefault();

				this.close();
			} else {	// the picker is closed

				// cancel changes and revert to the value which the Input field had when it got the focus
				InputBase.prototype.onsapescape.apply(this, arguments);
			}
		};

		/**
		 * Handle when Alt + UP arrow are pressed.
		 *
		 * @param {jQuery.Event} oEvent The event object.
		 */
		ComboBoxBase.prototype.onsaphide = ComboBoxBase.prototype.onsapshow;

		/**
		 * Handles the <code>sapfocusleave</code> event of the input field.
		 *
		 * @param {jQuery.Event} oEvent The event object.
		 */
		ComboBoxBase.prototype.onsapfocusleave = function(oEvent) {

			if (!oEvent.relatedControlId) {
				InputBase.prototype.onsapfocusleave.apply(this, arguments);
				return;
			}

			var oControl = sap.ui.getCore().byId(oEvent.relatedControlId);

			// to prevent the change event from firing when the arrow button is pressed
			if (oControl === this) {
				return;
			}

			var oPicker = this.getAggregation("picker"),
				oFocusDomRef = oControl && oControl.getFocusDomRef();

			// to prevent the change event from firing when an item is pressed
			if (oPicker && jQuery.sap.containsOrEquals(oPicker.getFocusDomRef(), oFocusDomRef)) {
				return;
			}

			InputBase.prototype.onsapfocusleave.apply(this, arguments);
		};

		/* =========================================================== */
		/* API methods                                                 */
		/* =========================================================== */

		/**
		 * Overwrites use labels as placeholder configuration of the InputBase.
		 *
		 * IE9 does not have a native placeholder support.
		 * IE10+ fires the input event when an input field with a native placeholder is focused.
		 */
		ComboBoxBase.prototype.bShowLabelAsPlaceholder = sap.ui.Device.browser.msie;

		/**
		 * Hook method, can be used to add additional content to the control's picker popup.
		 *
		 * @param {sap.m.Dialog | sap.m.Popover} [oPicker]
		 */
		ComboBoxBase.prototype.addContent = function(oPicker) {};

		/**
		 * Setter for property <code>_sPickerType</code>.
		 *
		 * @param {string} sPickerType
		 * @protected
		 */
		ComboBoxBase.prototype.setPickerType = function(sPickerType) {
			this._sPickerType = sPickerType;
		};

		/**
		 * Getter for property <code>_sPickerType</code>
		 *
		 * @returns {string}
		 * @protected
		 */
		ComboBoxBase.prototype.getPickerType = function() {
			return this._sPickerType;
		};

		/**
		 * Creates a picker popup container where the selection should take place.
		 * To be overwritten by subclasses.
		 *
		 * @param {string} sPickerType
		 * @returns {sap.m.Popover | sap.m.Dialog} The picker popup to be used.
		 * @protected
		 */
		ComboBoxBase.prototype.createPicker = function() {};

		/**
		 * Gets the control's picker popup.
		 *
		 * @returns {sap.m.Dialog | sap.m.Popover | null} The picker instance, creating it if necessary by calling <code>createPicker()</code> method.
		 * @protected
		 */
		ComboBoxBase.prototype.getPicker = function() {

			if (this.bIsDestroyed) {
				return null;
			}

			// initialize the control's picker
			return this.createPicker(this.getPickerType());
		};

		/*
		 * Determines whether the control has content or not.
		 *
		 * @returns {boolean}
		 * @protected
		 */
		ComboBoxBase.prototype.hasContent = function() {
			return !!this.getItems().length;
		};

		/**
		 * Retrieves the first enabled item from the aggregation named <code>items</code>.
		 *
		 * @param {array} [aItems]
		 * @returns {sap.ui.core.Item | null}
		 */
		ComboBoxBase.prototype.findFirstEnabledItem = function(aItems) {
			var oList = this.getList();
			return oList ? oList.findFirstEnabledItem(aItems) : null;
		};

		/**
		 * Retrieves the last enabled item from the aggregation named <code>items</code>.
		 *
		 * @param {array} [aItems]
		 * @returns {sap.ui.core.Item | null}
		 */
		ComboBoxBase.prototype.findLastEnabledItem = function(aItems) {
			var oList = this.getList();
			return oList ? oList.findLastEnabledItem(aItems) : null;
		};

		/**
		 * Opens the control's picker popup.
		 *
		 * @returns {sap.m.ComboBoxBase} <code>this</code> to allow method chaining.
		 * @protected
		 */
		ComboBoxBase.prototype.open = function() {
			var oPicker = this.getPicker();

			if (oPicker) {
				oPicker.open();
			}

			return this;
		};

		/*
		 * Gets the visible items from the aggregation named <code>items</code>.
		 *
		 * @return {sap.ui.core.Item[]}
		 * @protected
		 */
		ComboBoxBase.prototype.getVisibleItems = function() {
			var oList = this.getList();
			return oList ? oList.getVisibleItems() : [];
		};

		/*
		 * Check whether an item is selected or not.
		 * To be overwritten by subclasses.
		 *
		 * @param {sap.ui.core.Item} oItem
		 * @returns {boolean} Whether the item is selected.
		 * @protected
		 * @since 1.24.0
		 */
		ComboBoxBase.prototype.isItemSelected = function() {};

		/*
		 * Get key of each item from the aggregation named items.
		 *
		 * @param {sap.ui.core.Item[]} [aItems]
		 * @return {string[]}
		 * @protected
		 * @since 1.24.0
		 */
		ComboBoxBase.prototype.getKeys = function(aItems) {
			aItems = aItems || this.getItems();

			for (var i = 0, aKeys = []; i < aItems.length; i++) {
				aKeys[i] = aItems[i].getKey();
			}

			return aKeys;
		};

		/**
		 * Gets the selectable items from the aggregation named <code>items</code>.
		 *
		 * @returns {sap.ui.core.Item[]} An array containing the selectables items.
		 */
		ComboBoxBase.prototype.getSelectableItems = function() {
			var oList = this.getList();
			return oList ? oList.getSelectableItems() : [];
		};

		/**
		 * Gets the control's picker popup's trigger element.
		 *
		 * @returns {Element | null} Returns the element that is used as trigger to open the control's picker popup.
		 */
		ComboBoxBase.prototype.getOpenArea = function() {
			return this.getDomRef("arrow");
		};

		/**
		 * Checks whether the provided element is the open area.
		 *
		 * @param {Element} oDomRef
		 * @returns {boolean}
		 */
		ComboBoxBase.prototype.isOpenArea = function(oDomRef) {
			var oOpenAreaDomRef = this.getOpenArea();
			return oOpenAreaDomRef && oOpenAreaDomRef.contains(oDomRef);
		};

		/**
		 * Retrieves an item by searching for the given property/value from the aggregation named <code>items</code>.
		 *
		 * <b>Note:</b> If duplicate values exist, the first item matching the value is returned.
		 *
		 * @param {string} sProperty An item property.
		 * @param {string} sValue An item value that specifies the item to retrieve.
		 * @returns {sap.ui.core.Item | null} The matched item or null.
		 */
		ComboBoxBase.prototype.findItem = function(sProperty, sValue) {
			var oList = this.getList();
			return oList ? oList.findItem(sProperty, sValue) : null;
		};

		/*
		 * Gets the item with the given value from the aggregation named <code>items</code>.
		 *
		 * <b>Note: </b> If duplicate values exist, the first item matching the value is returned.
		 *
		 * @param {string} sText An item value that specifies the item to retrieve.
		 * @returns {sap.ui.core.Item | null} The matched item or null.
		 * @protected
		 */
		ComboBoxBase.prototype.getItemByText = function(sText) {
			return this.findItem("text", sText);
		};

		/**
		 * Scrolls an item into the visual viewport.
		 *
		 */
		ComboBoxBase.prototype.scrollToItem = function(oItem) {
			var oPicker = this.getPicker(),
				oPickerDomRef = oPicker.getDomRef("cont"),
				oItemDomRef = oItem && oItem.getDomRef();

			if (!oPicker || !oPickerDomRef || !oItemDomRef) {
				return;
			}

			var iPickerScrollTop = oPickerDomRef.scrollTop,
				iItemOffsetTop = oItemDomRef.offsetTop,
				iPickerHeight = oPickerDomRef.clientHeight,
				iItemHeight = oItemDomRef.offsetHeight;

			if (iPickerScrollTop > iItemOffsetTop) {

				// scroll up
				oPickerDomRef.scrollTop = iItemOffsetTop;

			// bottom edge of item > bottom edge of viewport
			} else if ((iItemOffsetTop + iItemHeight) > (iPickerScrollTop + iPickerHeight)) {

				// scroll down, the item is partly below the viewport of the list
				oPickerDomRef.scrollTop = Math.ceil(iItemOffsetTop + iItemHeight - iPickerHeight);
			}
		};

		/**
		 * Clear the filter
		 *
		 */
		ComboBoxBase.prototype.clearFilter = function() {
			for (var i = 0, aItems = this.getItems(); i < aItems.length; i++) {
				aItems[i].bVisible = true;
			}
		};

		/**
		 * Handles properties' changes of items in the aggregation named <code>items</code>.
		 * To be overwritten by subclasses.
		 *
		 * @experimental
		 * @param {sap.ui.base.Event} oControlEvent
		 * @since 1.30
		 */
		ComboBoxBase.prototype.onItemChange = function() {};

		/**
		 * Clear the selection.
		 * To be overwritten by subclasses.
		 *
		 * @protected
		 */
		ComboBoxBase.prototype.clearSelection = function() {};

		ComboBoxBase.prototype.updateValueStateClasses = function(sValueState, sOldValueState) {
			InputBase.prototype.updateValueStateClasses.apply(this, arguments);

			var mValueState = sap.ui.core.ValueState,
				CSS_CLASS = ComboBoxBaseRenderer.CSS_CLASS,
				$DomRef = this.$();

			if (sOldValueState !== mValueState.None) {
				$DomRef.removeClass(CSS_CLASS + "State " + CSS_CLASS + sOldValueState);
			}

			if (sValueState !== mValueState.None) {
				$DomRef.addClass(CSS_CLASS + "State " + CSS_CLASS + sValueState);
			}
		};

		/* ----------------------------------------------------------- */
		/* public methods                                              */
		/* ----------------------------------------------------------- */

		/**
		 * Getter for property <code>value</code>.
		 *
		 * Default value is empty/<code>undefined</code>.
		 *
		 * @return {string} the value of property <code>value</code>
		 * @public
		 */
		ComboBoxBase.prototype.getValue = function() {
			var oDomRef = this.getFocusDomRef();

			// if the input field is rendered
			if (oDomRef) {

				// return the live value
				return oDomRef.value;
			}

			// else return the value from the model
			return this.getProperty("value");
		};

		/**
		 * Adds an item to the aggregation named <code>items</code>.
		 *
		 * @param {sap.ui.core.Item} oItem The item to be added; if empty, nothing is added.
		 * @returns {sap.m.ComboBoxBase} <code>this</code> to allow method chaining.
		 * @public
		 */
		ComboBoxBase.prototype.addItem = function(oItem) {
			this.addAggregation("items", oItem);

			if (oItem) {
				oItem.attachEvent("_change", this.onItemChange, this);
			}

			return this;
		};

		/**
		 * Inserts an item into the aggregation named <code>items</code>.
		 *
		 * @param {sap.ui.core.Item} oItem The item to be inserted; if empty, nothing is inserted.
		 * @param {int} iIndex The <code>0</code>-based index the item should be inserted at; for
		 *             a negative value of <code>iIndex</code>, the item is inserted at position 0; for a value
		 *             greater than the current size of the aggregation, the item is inserted at the last position.
		 * @returns {sap.m.ComboBoxBase} <code>this</code> to allow method chaining.
		 * @public
		 */
		ComboBoxBase.prototype.insertItem = function(oItem, iIndex) {
			this.insertAggregation("items", oItem, iIndex, true);

			if (oItem) {
				oItem.attachEvent("_change", this.onItemChange, this);
			}

			return this;
		};

		/**
		 * Gets the item from the aggregation named <code>items</code> at the given 0-based index.
		 *
		 * @param {int} iIndex Index of the item to return.
		 * @returns {sap.ui.core.Item} Item at the given index, or null if none.
		 * @public
		 */
		ComboBoxBase.prototype.getItemAt = function(iIndex) {
			return this.getItems()[ +iIndex] || null;
		};

		/**
		 * Gets the first item from the aggregation named <code>items</code>.
		 *
		 * @returns {sap.ui.core.Item} The first item, or null if there are no items.
		 * @public
		 */
		ComboBoxBase.prototype.getFirstItem = function() {
			return this.getItems()[0] || null;
		};

		/**
		 * Gets the last item from the aggregation named <code>items</code>.
		 *
		 * @returns {sap.ui.core.Item} The last item, or null if there are no items.
		 * @public
		 */
		ComboBoxBase.prototype.getLastItem = function() {
			var aItems = this.getItems();
			return aItems[aItems.length - 1] || null;
		};

		/**
		 * Gets the enabled items from the aggregation named <code>items</code>.
		 *
		 * @param {sap.ui.core.Item[]} [aItems=getItems()] Items to filter.
		 * @return {sap.ui.core.Item[]} An array containing the enabled items.
		 * @public
		 */
		ComboBoxBase.prototype.getEnabledItems = function(aItems) {
			var oList = this.getList();
			return oList ? oList.getEnabledItems(aItems) : [];
		};

		/**
		 * Gets the item with the given key from the aggregation named <code>items</code>.
		 *
		 * <b>Note:</b> If duplicate keys exist, the first item matching the key is returned.
		 *
		 * @param {string} sKey An item key that specifies the item to retrieve.
		 * @returns {sap.ui.core.Item}
		 * @public
		 */
		ComboBoxBase.prototype.getItemByKey = function(sKey) {
			var oList = this.getList();
			return oList ? oList.getItemByKey(sKey) : null;
		};

		/**
		 * Indicates whether the control's picker popup is open.
		 *
		 * @returns {boolean} Determines whether the control's picker popup is currently open (this includes opening and closing animations).
		 * @public
		 */
		ComboBoxBase.prototype.isOpen = function() {
			var oPicker = this.getAggregation("picker");
			return !!(oPicker && oPicker.isOpen());
		};

		/**
		 * Closes the control's picker popup.
		 *
		 * @returns {sap.m.ComboBoxBase} <code>this</code> to allow method chaining.
		 * @public
		 */
		ComboBoxBase.prototype.close = function() {
			var oPicker = this.getAggregation("picker");

			if (oPicker) {
				oPicker.close();
			}

			return this;
		};

		/**
		 * Removes an item from the aggregation named <code>items</code>.
		 *
		 * @param {int | string | sap.ui.core.Item} vItem The item to remove or its index or id.
		 * @returns {sap.ui.core.Item} The removed item or null.
		 * @public
		 */
		ComboBoxBase.prototype.removeItem = function(vItem) {
			var oList = this.getList();

			vItem = oList ? oList.removeItem(vItem) : null;

			if (vItem) {
				vItem.detachEvent("_change", this.onItemChange, this);
			}

			return vItem;
		};

		/**
		 * Removes all the controls in the aggregation named <code>items</code>.
		 * Additionally unregisters them from the hosting UIArea and clears the selection.
		 *
		 * @returns {sap.ui.core.Item[]} An array of the removed items (might be empty).
		 * @public
		 */
		ComboBoxBase.prototype.removeAllItems = function() {
			var oList = this.getList(),
				aItems = oList ? oList.removeAllItems() : [];

			// clear the selection
			this.clearSelection();

			for (var i = 0; i < aItems.length; i++) {
				aItems[i].detachEvent("_change", this.onItemChange, this);
			}

			return aItems;
		};

		/**
		 * Destroys all the items in the aggregation named <code>items</code>.
		 *
		 * @returns {sap.m.ComboBox} <code>this</code> to allow method chaining.
		 * @public
		 */
		ComboBoxBase.prototype.destroyItems = function() {
			var oList = this.getList();

			if (oList) {
				oList.destroyItems();
			}

			return this;
		};

		return ComboBoxBase;

	}, /* bExport= */ true);
