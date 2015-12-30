/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.m.Select.
sap.ui.define(['jquery.sap.global', './Bar', './Dialog', './InputBase', './Popover', './SelectList', './library', 'sap/ui/core/Control', 'sap/ui/core/EnabledPropagator', 'sap/ui/core/IconPool'],
	function(jQuery, Bar, Dialog, InputBase, Popover, SelectList, library, Control, EnabledPropagator, IconPool) {
		"use strict";

		/**
		 * Constructor for a new Select.
		 *
		 * @param {string} [sId] ID for the new control, generated automatically if no ID is given.
		 * @param {object} [mSettings] Initial settings for the new control.
		 *
		 * @class
		 * The <code>sap.m.Select</code> control provides a list of items that allows users to select an item.
		 * @extends sap.ui.core.Control
		 *
		 * @author SAP SE
		 * @version 1.32.9
		 *
		 * @constructor
		 * @public
		 * @alias sap.m.Select
		 * @ui5-metamodel This control will also be described in the UI5 (legacy) design time meta model.
		 */
		var Select = Control.extend("sap.m.Select", /** @lends sap.m.Select.prototype */ { metadata: {

			library: "sap.m",
			properties: {

				/**
				 * The name to be used in the HTML code (for example, for HTML forms that send data to the server via submit).
				 */
				name: { type : "string", group : "Misc", defaultValue: "" },

				/**
				 * Indicates whether the user can change the selection.
				 */
				enabled: { type: "boolean", group: "Behavior", defaultValue: true },

				/**
				 * Sets the width of the control. The default width is derived from the widest item.
				 * If the width defined is smaller than the widest item in the selection list, only the width of the selection field will be changed:
				 * the list will keep the width of its widest item.
				 * If the list is wider than the viewport, it is truncated and an ellipsis is displayed for each item.
				 * For phones, the width of the list is always the same as the viewport.
				 *
				 * <b>Note:</b> This property is ignored if the <code>autoAdjustWidth</code> property is set to <code>true</code>.
				 */
				width: { type: "sap.ui.core.CSSSize", group: "Dimension", defaultValue: "auto" },

				/**
				 * Sets the maximum width of the control.
				 *
				 * <b>Note:</b> This property is ignored if the <code>autoAdjustWidth</code> property is set to <code>true</code>.
				 */
				maxWidth: { type: "sap.ui.core.CSSSize", group: "Dimension", defaultValue: "100%" },

				/**
				 * Key of the selected item.
				 *
				 * <b>Note:</b> If duplicate keys exist, the first item matching the key is used.
				 * @since 1.11
				 */
				selectedKey: { type: "string", group: "Data", defaultValue: "" },

				/**
				 * ID of the selected item.
				 * @since 1.12
				 */
				selectedItemId: { type: "string", group: "Misc", defaultValue: "" },

				/**
				 * The URI to the icon that will be displayed only when using the <code>IconOnly</code> type.
				 * @since 1.16
				 */
				icon: { type: "sap.ui.core.URI", group: "Appearance", defaultValue: "" },

				/**
				 * Type of a select. Possible values <code>Default</code>, <code>IconOnly</code>.
				 * @since 1.16
				 */
				type: { type: "sap.m.SelectType", group: "Appearance", defaultValue: sap.m.SelectType.Default },

				/**
				 * Indicates whether the width of the input field is determined by the selected item's content.
				 * @since 1.16
				 */
				autoAdjustWidth: { type: "boolean", group: "Appearance", defaultValue: false },

				/**
				 * Sets the horizontal alignment of the text within the input field.
				 * @since 1.28
				 */
				textAlign: { type: "sap.ui.core.TextAlign", group: "Appearance", defaultValue: sap.ui.core.TextAlign.Initial },

				/**
				 * Specifies the direction of the text within the input field with enumerated options. By default, the control inherits text direction from the DOM.
				 * @since 1.28
				 */
				textDirection: { type: "sap.ui.core.TextDirection", group: "Appearance", defaultValue: sap.ui.core.TextDirection.Inherit }
			},
			defaultAggregation : "items",
			aggregations: {

				/**
				 * Defines the items contained within this control.
				 */
				items: { type: "sap.ui.core.Item", multiple: true, singularName: "item", bindable: "bindable" },

				/**
				 * Internal aggregation to hold the inner picker popup.
				 */
				picker: { type : "sap.ui.core.PopupInterface", multiple: false, visibility: "hidden" }
			},
			associations: {

				/**
				 * Sets or retrieves the selected item from the aggregation named items.
				 */
				selectedItem: { type: "sap.ui.core.Item", multiple: false },

				/**
				 * Association to controls / IDs which label this control (see WAI-ARIA attribute <code>aria-labelledby</code>).
				 * @since 1.27.0
				 */
				ariaLabelledBy: { type: "sap.ui.core.Control", multiple: true, singularName: "ariaLabelledBy" }
			},
			events: {

				/**
				 * This event is fired when the value in the selection field is changed in combination with one of the following actions:
				 * <ul>
				 * 	<li>The focus leaves the selection field</li>
				 * 	<li>The <i>Enter</i> key is pressed</li>
				 * 	<li>The item is pressed</li>
				 * </ul>
				 */
				change: {
					parameters: {

						/**
						 * The selected item.
						 */
						selectedItem: { type : "sap.ui.core.Item" }
					}
				}
			}
		}});

		IconPool.insertFontFaceStyle();
		EnabledPropagator.apply(Select.prototype, [true]);

		/* =========================================================== */
		/* Private methods and properties                              */
		/* =========================================================== */

		/* ----------------------------------------------------------- */
		/* Private methods                                             */
		/* ----------------------------------------------------------- */

		function fnHandleKeyboardNavigation(oItem) {

			if (oItem) {

				this.setSelection(oItem);
				this.setValue(oItem.getText());
			}

			this.scrollToItem(oItem);
		}

		Select.prototype._handleFocusout = function() {
			this._bFocusoutDueRendering = this._bRenderingPhase;

			if (this._bFocusoutDueRendering) {
				this._bProcessChange = false;
				return;
			}

			if (this._bProcessChange) {
				this._checkSelectionChange();
				this._bProcessChange = false;
			} else {
				this._bProcessChange = true;
			}
		};

		Select.prototype._checkSelectionChange = function() {
			var oItem = this.getSelectedItem();

			if (this._oSelectionOnFocus !== oItem) {
				this.fireChange({ selectedItem: oItem });
			}
		};

		Select.prototype._getSelectedItemText = function(vItem) {
			vItem = vItem || this.getSelectedItem();

			if (!vItem) {
				vItem = this.getDefaultSelectedItem();
			}

			if (vItem) {
				return vItem.getText();
			}

			return "";
		};

		Select.prototype._callMethodInControl = function(sFunctionName, aArgs) {
			var oList = this.getList();

			if (aArgs[0] === "items") {

				if (oList) {
					return SelectList.prototype[sFunctionName].apply(oList, aArgs);
				}
			} else {
				return Control.prototype[sFunctionName].apply(this, aArgs);
			}
		};

		/**
		 * Retrieves the first enabled item from the aggregation named <code>items</code>.
		 *
		 * @param {array} [aItems]
		 * @returns {sap.ui.core.Item | null}
		 * @private
		 */
		Select.prototype.findFirstEnabledItem = function(aItems) {
			var oList = this.getList();
			return oList ? oList.findFirstEnabledItem(aItems) : null;
		};

		/**
		 * Retrieves the last enabled item from the aggregation named <code>items</code>.
		 *
		 * @param {array} [aItems]
		 * @returns {sap.ui.core.Item | null}
		 * @private
		 */
		Select.prototype.findLastEnabledItem = function(aItems) {
			var oList = this.getList();
			return oList ? oList.findLastEnabledItem(aItems) : null;
		};

		/**
		 * Sets the selected item by its index.
		 *
		 * @param {int} iIndex
		 * @private
		 */
		Select.prototype.setSelectedIndex = function(iIndex, _aItems /* only for internal usage */) {
			var oItem;
			_aItems = _aItems || this.getItems();

			// constrain the new index
			iIndex = (iIndex > _aItems.length - 1) ? _aItems.length - 1 : Math.max(0, iIndex);
			oItem = _aItems[iIndex];

			if (oItem) {

				this.setSelection(oItem);
			}
		};

		/**
		 * Scrolls an item into the visual viewport.
		 *
		 * @private
		 */
		Select.prototype.scrollToItem = function(oItem) {
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
		 * Sets the text value of the <code>Select</code> field.
		 *
		 * @param {string} sValue
		 * @private
		 */
		Select.prototype.setValue = function(sValue) {
			this.$("label").text(sValue);
		};

		/**
		 * Whether the native HTML Select Element is required.
		 *
		 * @returns {boolean}
		 * @private
		 */
		Select.prototype._isRequiredSelectElement = function() {
			if (this.getAutoAdjustWidth()) {
				return false;
			} else if (this.getWidth() === "auto") {
				return true;
			}

			return false;
		};

		/**
		 * Handles the virtual focus of items.
		 *
		 * @param {sap.ui.core.Item | null} vItem
		 * @private
		 * @since 1.30
		 */
		Select.prototype._handleAriaActiveDescendant = function(vItem) {
			var oDomRef = this.getDomRef(),
				oItemDomRef = vItem && vItem.getDomRef(),
				sActivedescendant = "aria-activedescendant";

			if (!oDomRef) {
				return;
			}

			// the aria-activedescendant attribute is set when the item is rendered
			if (oItemDomRef && this.isOpen()) {
				oDomRef.setAttribute(sActivedescendant, vItem.getId());
			} else {
				oDomRef.removeAttribute(sActivedescendant);
			}
		};

		/**
		 * Gets the Select's <code>list</code>.
		 *
		 * @returns {sap.m.List}
		 * @private
		 * @since 1.22.0
		 */
		Select.prototype.getList = function() {
			if (this.bIsDestroyed) {
				return null;
			}

			return this._oList;
		};

		/**
		 * Called whenever the binding of the aggregation items is changed.
		 *
		 */
		Select.prototype.updateItems = function(sReason) {
			SelectList.prototype.updateItems.apply(this, arguments);

			// note: after the items are recreated, the selected item association
			// points to the new item
			this._oSelectionOnFocus = this.getSelectedItem();
		};

		/**
		 * Called when the items aggregation needs to be refreshed.
		 *
		 * <b>Note:</b> This method has been overwritten to prevent <code>updateItems()</code>
		 * from being called when the bindings are refreshed.
		 * @see sap.ui.base.ManagedObject#bindAggregation
		 */
		Select.prototype.refreshItems = function() {
			SelectList.prototype.refreshItems.apply(this, arguments);
		};

		/* ----------------------------------------------------------- */
		/* Picker                                                      */
		/* ----------------------------------------------------------- */

		/**
		 * This event handler is called before the picker popup is opened.
		 *
		 * @private
		 */
		Select.prototype.onBeforeOpen = function() {
			var fnPickerTypeBeforeOpen = this["_onBeforeOpen" + this.getPickerType()];

			// add the active state to the Select's field
			this.addStyleClass(this.getRenderer().CSS_CLASS + "Pressed");

			// call the hook to add additional content to the list
			this.addContent();

			fnPickerTypeBeforeOpen && fnPickerTypeBeforeOpen.call(this);
		};

		/**
		 * This event handler will be called after the picker popup is opened.
		 *
		 * @private
		 */
		Select.prototype.onAfterOpen = function() {
			var oDomRef = this.getFocusDomRef(),
				oItem = null;

			if (!oDomRef) {
				return;
			}

			oItem = this.getSelectedItem();
			oDomRef.setAttribute("aria-expanded", "true");

			// expose a parent/child contextual relationship to assistive technologies
			// note: the "aria-owns" attribute is set when the list is visible and in view
			oDomRef.setAttribute("aria-owns", this.getList().getId());

			if (oItem) {

				// note: the "aria-activedescendant" attribute is set
				// when the currently active descendant is visible and in view
				oDomRef.setAttribute("aria-activedescendant", oItem.getId());
			}
		};

		/**
		 * This event handler is called before the picker popup is closed.
		 *
		 * @private
		 */
		Select.prototype.onBeforeClose = function() {
			var oDomRef = this.getFocusDomRef();

			if (oDomRef) {

				// note: the "aria-owns" attribute is removed when the list is not visible and in view
				oDomRef.removeAttribute("aria-owns");

				// the "aria-activedescendant" attribute is removed when the currently active descendant is not visible
				oDomRef.removeAttribute("aria-activedescendant");
			}

			// remove the active state of the Select's field
			this.removeStyleClass(this.getRenderer().CSS_CLASS + "Pressed");
		};

		/**
		 * This event handler is called after the picker popup is closed.
		 *
		 * @private
		 */
		Select.prototype.onAfterClose = function() {
			var oDomRef = this.getFocusDomRef();

			if (oDomRef) {
				oDomRef.setAttribute("aria-expanded", "false");

				// note: the "aria-owns" attribute is removed when the list is not visible and in view
				oDomRef.removeAttribute("aria-owns");
			}
		};

		/**
		 * Gets the control's picker popup.
		 *
		 * @returns {sap.m.Dialog | sap.m.Popover | null} The picker instance, creating it if necessary by calling <code>createPicker()</code> method.
		 * @private
		 */
		Select.prototype.getPicker = function() {
			if (this.bIsDestroyed) {
				return null;
			}

			// initialize the control's picker
			return this.createPicker(this.getPickerType());
		};

		/**
		 * Setter for property <code>_sPickerType</code>.
		 *
		 * @private
		 */
		Select.prototype.setPickerType = function(sPickerType) {
			this._sPickerType = sPickerType;
		};

		/**
		 * Getter for property <code>_sPickerType</code>
		 *
		 * @returns {string}
		 * @private
		 */
		Select.prototype.getPickerType = function() {
			return this._sPickerType;
		};

		/* ----------------------------------------------------------- */
		/* Popover                                                     */
		/* ----------------------------------------------------------- */

		/**
		 * Creates an instance of <code>sap.m.Popover</code>.
		 *
		 * @returns {sap.m.Popover}
		 * @private
		 */
		Select.prototype._createPopover = function() {

			var that = this,
				oPicker = new Popover({
				showArrow: false,
				showHeader: false,
				placement: sap.m.PlacementType.Vertical,
				offsetX: 0,
				offsetY: 0,
				initialFocus: this,
				bounce: false
			});

			// detect when the scrollbar is pressed
			oPicker.addEventDelegate({
				ontouchstart: function(oEvent) {
					var oPickerDomRef = this.getDomRef("cont");

					if (oEvent.target === oPickerDomRef) {
						that._bProcessChange = false;
					}
				}
			}, oPicker);

			this._decoratePopover(oPicker);
			return oPicker;
		};

		/**
		 * Decorates a <code>sap.m.Popover</code> instance.
		 *
		 * @param {sap.m.Popover}
		 * @private
		 */
		Select.prototype._decoratePopover = function(oPopover) {
			var that = this;

			oPopover._setMinWidth = function(sWidth) {
				var oPickerDomRef = this.getDomRef();

				if (oPickerDomRef) {
					oPickerDomRef.style.minWidth = sWidth;
				}
			};

			oPopover.open = function() {
				return this.openBy(that);
			};
		};

		/**
		 * Required adaptations after rendering of the Popover.
		 *
		 * @private
		 */
		Select.prototype._onAfterRenderingPopover = function() {
			var oPopover = this.getPicker(),
				sWidth = (this.$().outerWidth() / parseFloat(sap.m.BaseFontSize)) + "rem";

			oPopover._setMinWidth(sWidth);
		};

		/* ----------------------------------------------------------- */
		/* Dialog                                                      */
		/* ----------------------------------------------------------- */

		/**
		 * Creates an instance of <code>sap.m.Dialog</code>.
		 *
		 * @returns {sap.m.Dialog}
		 * @private
		 */
		Select.prototype._createDialog = function() {
			var CSS_CLASS = this.getRenderer().CSS_CLASS;

			// initialize Dialog
			var oDialog = new Dialog({
				stretch: true,
				customHeader: new Bar({
					contentLeft: new InputBase({
						width: "100%",
						editable: false
					}).addStyleClass(CSS_CLASS + "Input")
				}).addStyleClass(CSS_CLASS + "Bar")
			});

			oDialog.getAggregation("customHeader").attachBrowserEvent("tap", function() {
				oDialog.close();
			}, this);

			return oDialog;
		};

		/**
		 * This event handler is called before the dialog is opened.
		 *
		 * @private
		 */
		Select.prototype._onBeforeOpenDialog = function() {
			var oInput = this.getPicker().getCustomHeader().getContentLeft()[0],
				oSelectedItem = this.getSelectedItem();

			if (oSelectedItem) {
				oInput.setValue(oSelectedItem.getText());
				oInput.setTextDirection(this.getTextDirection());
				oInput.setTextAlign(this.getTextAlign());
			}
		};

		/* =========================================================== */
		/* Lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Initialization hook.
		 *
		 */
		Select.prototype.init = function() {

			// set the picker type
			this.setPickerType(sap.ui.Device.system.phone ? "Dialog" : "Popover");

			// initialize composites
			this.createPicker(this.getPickerType());

			// selected item on focus
			this._oSelectionOnFocus = null;

			// to detect when the control is in the rendering phase
			this._bRenderingPhase = false;

			// to detect if the focusout event is triggered due a rendering
			this._bFocusoutDueRendering = false;

			// used to prevent the change event from firing when the user scrolls
			// the picker popup (dropdown) list using the mouse
			this._bProcessChange = false;
		};

		/**
		 * This event handler is called before the rendering of the control is started.
		 *
		 */
		Select.prototype.onBeforeRendering = function() {

			// rendering phase is started
			this._bRenderingPhase = true;

			// note: in Firefox 38, the focusout event is not fired when the select is removed
			if (sap.ui.Device.browser.firefox && (this.getFocusDomRef() === document.activeElement)) {
				this._handleFocusout();
			}

			this.synchronizeSelection();
		};

		/**
		 * This event handler is called when the rendering of the control is completed.
		 *
		 */
		Select.prototype.onAfterRendering = function() {

			// rendering phase is finished
			this._bRenderingPhase = false;
		};

		/**
		 * Cleans up before destruction.
		 *
		 */
		Select.prototype.exit = function() {
			this._oSelectionOnFocus = null;
		};

		/* =========================================================== */
		/* Event handlers                                              */
		/* =========================================================== */

		/**
		 * Handle the touch start event on the Select.
		 *
		 * @param {jQuery.Event} oEvent The event object.
		 * @private
		 */
		Select.prototype.ontouchstart = function(oEvent) {

			// mark the event for components that needs to know if the event was handled
			oEvent.setMarked();

			if (this.getEnabled() && this.isOpenArea(oEvent.target)) {

				// add the active state to the Select's field
				this.addStyleClass(this.getRenderer().CSS_CLASS + "Pressed");
			}
		};

		/**
		 * Handle the touch end event on the Select.
		 *
		 * @param {jQuery.Event} oEvent The event object.
		 * @private
		 */
		Select.prototype.ontouchend = function(oEvent) {

			// mark the event for components that needs to know if the event was handled
			oEvent.setMarked();

			if (this.getEnabled() && (!this.isOpen() || !this.hasContent()) && this.isOpenArea(oEvent.target)) {

				// remove the active state of the Select HTMLDIVElement container
				this.removeStyleClass(this.getRenderer().CSS_CLASS + "Pressed");
			}
		};

		/**
		 * Handle the tap event on the Select.
		 *
		 * @param {jQuery.Event} oEvent The event object.
		 * @private
		 */
		Select.prototype.ontap = function(oEvent) {
			var CSS_CLASS = this.getRenderer().CSS_CLASS;

			// mark the event for components that needs to know if the event was handled
			oEvent.setMarked();

			if (!this.getEnabled()) {
				return;
			}

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

				// add the active state to the Select's field
				this.addStyleClass(CSS_CLASS + "Pressed");
			}
		};

		/**
		 * Handles the <code>selectionChange</code> event on the list.
		 *
		 * @param {sap.ui.base.Event} oControlEvent
		 * @private
		 */
		Select.prototype.onSelectionChange = function(oControlEvent) {
			var oItem = oControlEvent.getParameter("selectedItem");
			this.close();
			this.setSelection(oItem);
			this.fireChange({ selectedItem: oItem });
			this.setValue(this._getSelectedItemText());
		};

		/* ----------------------------------------------------------- */
		/* Keyboard handling                                           */
		/* ----------------------------------------------------------- */

		/**
		 * Handles the <code>keypress</code> event.
		 *
		 * @param {jQuery.Event} oEvent The event object.
		 * @private
		 */
		Select.prototype.onkeypress = function(oEvent) {

			// mark the event for components that needs to know if the event was handled
			oEvent.setMarked();

			if (!this.getEnabled()) {
				return;
			}

			var oItem = this.findNextItemByFirstCharacter(String.fromCharCode(oEvent.which));	// note: jQuery oEvent.which normalizes oEvent.keyCode and oEvent.charCode
			fnHandleKeyboardNavigation.call(this, oItem);
		};

		/**
		 * Handle when F4 or Alt + DOWN arrow are pressed.
		 *
		 * @param {jQuery.Event} oEvent The event object.
		 * @private
		 */
		Select.prototype.onsapshow = function(oEvent) {

			// mark the event for components that needs to know if the event was handled
			oEvent.setMarked();

			// note: prevent browser address bar to be open in ie9, when F4 is pressed
			if (oEvent.which === jQuery.sap.KeyCodes.F4) {
				oEvent.preventDefault();
			}

			this.toggleOpenState();
		};

		/**
		 * Handle when Alt + UP arrow are pressed.
		 *
		 * @param {jQuery.Event} oEvent The event object.
		 * @private
		 * @function
		 */
		Select.prototype.onsaphide = Select.prototype.onsapshow;

		/**
		 * Handle when escape is pressed.
		 *
		 * @param {jQuery.Event} oEvent The event object.
		 * @private
		 */
		Select.prototype.onsapescape = function(oEvent) {

			if (this.isOpen()) {

				// mark the event for components that needs to know if the event was handled
				oEvent.setMarked();

				this.close();
				this._checkSelectionChange();
			}
		};

		/**
		 * Handles the <code>sapenter</code> event when enter key is pressed.
		 *
		 * @param {jQuery.Event} oEvent The event object.
		 * @private
		 */
		Select.prototype.onsapenter = function(oEvent) {

			// mark the event for components that needs to know if the event was handled
			oEvent.setMarked();

			this.close();
			this._checkSelectionChange();
		};

		/**
		 * Handle when the spacebar key is pressed.
		 *
		 * @param {jQuery.Event} oEvent The event object.
		 * @private
		 */
		Select.prototype.onsapspace = function(oEvent) {

			// mark the event for components that needs to know if the event was handled
			oEvent.setMarked();

			// note: prevent document scrolling when the spacebar key is pressed
			oEvent.preventDefault();

			if (this.isOpen()) {
				this._checkSelectionChange();
			}

			this.toggleOpenState();
		};

		/**
		 * Handles the <code>sapdown</code> pseudo event when keyboard DOWN arrow key is pressed.
		 *
		 * @param {jQuery.Event} oEvent The event object.
		 * @private
		 */
		Select.prototype.onsapdown = function(oEvent) {

			// mark the event for components that needs to know if the event was handled
			oEvent.setMarked();

			// note: prevent document scrolling when arrow keys are pressed
			oEvent.preventDefault();

			var oNextSelectableItem,
				aSelectableItems = this.getSelectableItems();

			oNextSelectableItem = aSelectableItems[aSelectableItems.indexOf(this.getSelectedItem()) + 1];
			fnHandleKeyboardNavigation.call(this, oNextSelectableItem);
		};

		/**
		 * Handles the <code>sapup</code> pseudo event when keyboard UP arrow key is pressed.
		 *
		 * @param {jQuery.Event} oEvent The event object.
		 * @private
		 */
		Select.prototype.onsapup = function(oEvent) {

			// mark the event for components that needs to know if the event was handled
			oEvent.setMarked();

			// note: prevent document scrolling when arrow keys are pressed
			oEvent.preventDefault();

			var oPrevSelectableItem,
				aSelectableItems = this.getSelectableItems();

			oPrevSelectableItem = aSelectableItems[aSelectableItems.indexOf(this.getSelectedItem()) - 1];
			fnHandleKeyboardNavigation.call(this, oPrevSelectableItem);
		};

		/**
		 * Handles the <code>saphome</code> pseudo event when keyboard Home key is pressed.
		 * The first selectable item is selected.
		 *
		 * @param {jQuery.Event} oEvent The event object.
		 * @private
		 */
		Select.prototype.onsaphome = function(oEvent) {

			// mark the event for components that needs to know if the event was handled
			oEvent.setMarked();

			// note: prevent document scrolling when Home key is pressed
			oEvent.preventDefault();

			var oFirstSelectableItem = this.getSelectableItems()[0];
			fnHandleKeyboardNavigation.call(this, oFirstSelectableItem);
		};

		/**
		 * Handles the <code>sapend</code> pseudo event when keyboard End key is pressed.
		 * The first selectable item is selected.
		 *
		 * @param {jQuery.Event} oEvent The event object.
		 * @private
		 */
		Select.prototype.onsapend = function(oEvent) {

			// mark the event for components that needs to know if the event was handled
			oEvent.setMarked();

			// note: prevent document scrolling when End key is pressed
			oEvent.preventDefault();

			var oLastSelectableItem = this.findLastEnabledItem(this.getSelectableItems());
			fnHandleKeyboardNavigation.call(this, oLastSelectableItem);
		};

		/**
		 * Handles the <code>sappagedown</code> pseudo event when keyboard page down key is pressed.
		 *
		 * @param {jQuery.Event} oEvent The event object.
		 * @private
		 */
		Select.prototype.onsappagedown = function(oEvent) {

			// mark the event for components that needs to know if the event was handled
			oEvent.setMarked();

			// note: prevent document scrolling when page down key is pressed
			oEvent.preventDefault();

			var aSelectableItems = this.getSelectableItems(),
				oSelectedItem = this.getSelectedItem();

			this.setSelectedIndex(aSelectableItems.indexOf(oSelectedItem) + 10, aSelectableItems);
			oSelectedItem = this.getSelectedItem();

			if (oSelectedItem) {
				this.setValue(oSelectedItem.getText());
			}

			this.scrollToItem(oSelectedItem);
		};

		/**
		 * Handles the <code>sappageup</code> pseudo event when keyboard page up key is pressed.
		 *
		 * @param {jQuery.Event} oEvent The event object.
		 * @private
		 */
		Select.prototype.onsappageup = function(oEvent) {

			// mark the event for components that needs to know if the event was handled
			oEvent.setMarked();

			// note: prevent document scrolling when page up key is pressed
			oEvent.preventDefault();

			var aSelectableItems = this.getSelectableItems(),
				oSelectedItem = this.getSelectedItem();

			this.setSelectedIndex(aSelectableItems.indexOf(oSelectedItem) - 10, aSelectableItems);
			oSelectedItem = this.getSelectedItem();

			if (oSelectedItem) {
				this.setValue(oSelectedItem.getText());
			}

			this.scrollToItem(oSelectedItem);
		};

		/**
		 * Handles the <code>focusin</code> event.
		 *
		 * @param {jQuery.Event} oEvent The event object.
		 * @private
		 */
		Select.prototype.onfocusin = function(oEvent) {

			if (!this._bFocusoutDueRendering && !this._bProcessChange) {
				this._oSelectionOnFocus = this.getSelectedItem();
			}

			this._bProcessChange = true;

			// note: in some circumstances IE browsers focus non-focusable elements
			if (oEvent.target !== this.getFocusDomRef()) {	// whether an inner element is receiving the focus

				// force the focus to leave the inner element and set it back to the control's root element
				this.focus();
			}
		};

		/**
		 * Handles the <code>focusout</code> event.
		 *
		 * @param {jQuery.Event} oEvent The event object.
		 * @private
		 */
		Select.prototype.onfocusout = function() {
			this._handleFocusout();
		};

		/**
		 * Handles the <code>focusleave</code> pseudo event.
		 *
		 * @param {jQuery.Event} oEvent The event object.
		 * @private
		 */
		Select.prototype.onsapfocusleave = function(oEvent) {
			var oPicker = this.getAggregation("picker");

			if (!oEvent.relatedControlId || !oPicker) {
				return;
			}

			var oControl = sap.ui.getCore().byId(oEvent.relatedControlId),
				oFocusDomRef = oControl && oControl.getFocusDomRef();

			if (sap.ui.Device.system.desktop && jQuery.sap.containsOrEquals(oPicker.getFocusDomRef(), oFocusDomRef)) {

				// force the focus to stay in the input field
				this.focus();
			}
		};

		/* =========================================================== */
		/* API methods                                                 */
		/* =========================================================== */

		/* ----------------------------------------------------------- */
		/* protected methods                                           */
		/* ----------------------------------------------------------- */

		/**
		 * Updates and synchronizes <code>selectedItem</code> association, <code>selectedItemId</code> and <code>selectedKey</code> properties.
		 *
		 * @param {sap.ui.core.Item | null} vItem
		 */
		Select.prototype.setSelection = function(vItem) {
			var oList = this.getList(),
				sKey;

			if (oList) {
				oList.setSelection(vItem);
			}

			this.setAssociation("selectedItem", vItem, true);
			this.setProperty("selectedItemId", (vItem instanceof sap.ui.core.Item) ? vItem.getId() : vItem, true);

			if (typeof vItem === "string") {
				vItem = sap.ui.getCore().byId(vItem);
			}

			sKey = vItem ? vItem.getKey() : "";
			this.setProperty("selectedKey", sKey, true);
			this._handleAriaActiveDescendant(vItem);
		};

		/**
		 * Determines whether the <code>selectedItem</code> association and <code>selectedKey</code> property are synchronized.
		 *
		 * @returns {boolean}
		 */
		Select.prototype.isSelectionSynchronized = function() {
			var vItem = this.getSelectedItem();
			return this.getSelectedKey() === (vItem && vItem.getKey());
		};

		/**
		 * Synchronizes the <code>selectedItem</code> association and the <code>selectedItemId</code> property.
		 *
		 * @param {sap.ui.core.Item} vItem
		 * @param {string} sKey
		 * @param {array} [aItems]
		 */
		Select.prototype.synchronizeSelection = function() {
			SelectList.prototype.synchronizeSelection.apply(this, arguments);
		};

		/**
		 * This hook method can be used to add additional content.
		 *
		 * @param {sap.m.Dialog | sap.m.Popover} [oPicker]
		 */
		Select.prototype.addContent = function(oPicker) {};

		/**
		 * Creates a picker popup container where the selection should take place.
		 *
		 * @param {string} sPickerType
		 * @returns {sap.m.Popover | sap.m.Dialog}
		 * @protected
		 */
		Select.prototype.createPicker = function(sPickerType) {
			var oPicker = this.getAggregation("picker"),
				CSS_CLASS = this.getRenderer().CSS_CLASS;

			if (oPicker) {
				return oPicker;
			}

			oPicker = this["_create" + sPickerType]();

			// define a parent-child relationship between the control and the picker popup
			this.setAggregation("picker", oPicker, true);

			// configuration
			oPicker.setHorizontalScrolling(false)
					.addStyleClass(CSS_CLASS + "Picker")
					.addStyleClass(CSS_CLASS + "Picker-CTX")
					.attachBeforeOpen(this.onBeforeOpen, this)
					.attachAfterOpen(this.onAfterOpen, this)
					.attachBeforeClose(this.onBeforeClose, this)
					.attachAfterClose(this.onAfterClose, this)
					.addEventDelegate({
						onBeforeRendering: this.onBeforeRenderingPicker,
						onAfterRendering: this.onAfterRenderingPicker
					}, this)
					.addContent(this.createList());

			return oPicker;
		};

		/**
		 * Retrieves the next item from the aggregation named <code>items</code>
		 * whose first character match with the given <code>sChar</code>.
		 *
		 * @param {string} sChar
		 * @returns {sap.ui.core.Item | null}
		 * @since 1.26.0
		 */
		Select.prototype.findNextItemByFirstCharacter = function(sChar) {
			var aItems = this.getItems(),
				iSelectedIndex = this.getSelectedIndex(),
				aItemsAfterSelection = aItems.splice(iSelectedIndex + 1, aItems.length - iSelectedIndex),
				aItemsBeforeSelection = aItems.splice(0, aItems.length - 1);

			aItems = aItemsAfterSelection.concat(aItemsBeforeSelection);

			for (var i = 0, oItem; i < aItems.length; i++) {
				oItem = aItems[i];

				if (oItem.getEnabled() && !(oItem instanceof sap.ui.core.SeparatorItem) && jQuery.sap.startsWithIgnoreCase(oItem.getText(), sChar)) {
					return oItem;
				}
			}

			return null;
		};

		/**
		 * Create an instance type of <code>sap.m.SelectList</code>.
		 *
		 * @returns {sap.m.SelectList}
		 */
		Select.prototype.createList = function() {

			// list to use inside the picker
			this._oList = new SelectList({
				width: "100%"
			}).addEventDelegate({
				ontap: function(oEvent) {
					this.close();
				}
			}, this)
			.attachSelectionChange(this.onSelectionChange, this);

			return this._oList;
		};

		/**
		 * Determines whether the Select has content or not.
		 *
		 * @returns {boolean}
		 */
		Select.prototype.hasContent = function() {
			return !!this.getItems().length;
		};

		/**
		 * This event handler is called before the picker popup is rendered.
		 *
		 */
		Select.prototype.onBeforeRenderingPicker = function() {
			var fnOnBeforeRenderingPickerType = this["_onBeforeRendering" + this.getPickerType()];
			fnOnBeforeRenderingPickerType && fnOnBeforeRenderingPickerType.call(this);
		};

		/**
		 * This event handler is called after the picker popup is rendered.
		 *
		 */
		Select.prototype.onAfterRenderingPicker = function() {
			var fnOnAfterRenderingPickerType = this["_onAfterRendering" + this.getPickerType()];
			fnOnAfterRenderingPickerType && fnOnAfterRenderingPickerType.call(this);
		};

		/**
		 * Open the control's picker popup.
		 *
		 * @returns {sap.m.Select} <code>this</code> to allow method chaining.
		 * @protected
		 * @since 1.16
		 */
		Select.prototype.open = function() {
			var oPicker = this.getPicker();

			if (oPicker) {
				oPicker.open();
			}

			return this;
		};

		/**
		 * Toggle the open state of the control's picker popup.
		 *
		 * @returns {sap.m.Select} <code>this</code> to allow method chaining.
		 * @since 1.26
		 */
		Select.prototype.toggleOpenState = function() {
			if (this.isOpen()) {
				this.close();
			} else if (this.hasContent()) {
				this.open();
			}

			return this;
		};

		/**
		 * Gets the visible <code>items</code>.
		 *
		 * @return {sap.ui.core.Item[]}
		 * @since 1.22.0
		 */
		Select.prototype.getVisibleItems = function() {
			var oList = this.getList();
			return oList ? oList.getVisibleItems() : [];
		};

		/**
		 * Indicates whether the provided item is selected.
		 *
		 * @param {sap.ui.core.Item} oItem
		 * @returns {boolean}
		 * @since 1.24.0
		 */
		Select.prototype.isItemSelected = function(oItem) {
			return oItem && (oItem.getId() === this.getAssociation("selectedItem"));
		};

		/**
		 * Retrieves the index of the selected item from the aggregation named <code>items</code>.
		 *
		 * @returns {int} An integer specifying the selected index, or -1 if no item is selected.
		 * @since 1.26.0
		 */
		Select.prototype.getSelectedIndex = function() {
			var oSelectedItem = this.getSelectedItem();
			return oSelectedItem ? this.indexOfItem(this.getSelectedItem()) : -1;
		};

		/**
		 * Gets the default selected item object from the aggregation named <code>items</code>.
		 *
		 * @returns {sap.ui.core.Item | null}
		 * @since 1.22.0
		 */
		Select.prototype.getDefaultSelectedItem = function(aItems) {
			return this.findFirstEnabledItem();
		};

		/**
		 * Gets the selectable items from the aggregation named <code>items</code>.
		 *
		 * @return {sap.ui.core.Item[]} An array containing the selectables items.
		 * @since 1.22.0
		 */
		Select.prototype.getSelectableItems = function() {
			var oList = this.getList();
			return oList ? oList.getSelectableItems() : [];
		};

		/**
		 * Gets the control's picker popup's trigger element.
		 *
		 * @returns {Element | null} Returns the element that is used as trigger to open the control's picker popup.
		 * @since 1.22.0
		 */
		Select.prototype.getOpenArea = function() {
			return this.getDomRef();
		};

		/**
		 * Checks whether the provided element is the open area.
		 *
		 * @param {Element} oDomRef
		 * @returns {boolean}
		 * @since 1.22.0
		 */
		Select.prototype.isOpenArea = function(oDomRef) {
			var oOpenAreaDomRef = this.getOpenArea();
			return oOpenAreaDomRef && oOpenAreaDomRef.contains(oDomRef);
		};

		/**
		 * Retrieves an item by searching for the given property/value from the aggregation named <code>items</code>.
		 *
		 * <b>Note: </b> If duplicate values exists, the first item matching the value is returned.
		 *
		 * @param {string} sProperty An item property.
		 * @param {string} sValue An item value that specifies the item to retrieve.
		 * @returns {sap.ui.core.Item | null} The matched item or null.
		 * @since 1.22.0
		 */
		Select.prototype.findItem = function(sProperty, sValue) {
			var oList = this.getList();
			return oList ? oList.findItem(sProperty, sValue) : null;
		};

		/**
		 * Clear the selection.
		 *
		 * @since 1.22.0
		 */
		Select.prototype.clearSelection = function() {
			this.setSelection(null);
		};

		/**
		 * Handles properties' changes of items in the aggregation named <code>items</code>.
		 *
		 * @private
		 * @param {sap.ui.base.Event} oControlEvent
		 * @since 1.30
		 */
		Select.prototype.onItemChange = function(oControlEvent) {
			var sSelectedItemId = this.getAssociation("selectedItem"),
				sNewValue = oControlEvent.getParameter("newValue"),
				sProperty = oControlEvent.getParameter("name");

			// if the selected item has changed, synchronization is needed
			if (sSelectedItemId === oControlEvent.getParameter("id")) {

				switch (sProperty) {
					case "text":
						this.setValue(sNewValue);
						break;

					case "key":

						if (!this.isBound("selectedKey")) {
							this.setSelectedKey(sNewValue);
						}

						break;

					// no default
				}
			}
		};

		Select.prototype.fireChange = function(mParameters) {
			this._oSelectionOnFocus = mParameters.selectedItem;
			return this.fireEvent("change", mParameters);
		};

		Select.prototype.addAggregation = function(sAggregationName, oObject, bSuppressInvalidate) {
			this._callMethodInControl("addAggregation", arguments);

			if (sAggregationName === "items" && !bSuppressInvalidate && !this.isInvalidateSuppressed()) {
				this.invalidate(oObject);
			}

			return this;
		};

		Select.prototype.getAggregation = function() {
			return this._callMethodInControl("getAggregation", arguments);
		};

		Select.prototype.setAssociation = function(sAssociationName, sId, bSuppressInvalidate) {
			var oList = this.getList();

			if (oList && (sAssociationName === "selectedItem")) {

				// propagate the value of the "selectedItem" association to the list
				SelectList.prototype.setAssociation.apply(oList, arguments);
			}

			return Control.prototype.setAssociation.apply(this, arguments);
		};

		Select.prototype.indexOfAggregation = function() {
			return this._callMethodInControl("indexOfAggregation", arguments);
		};

		Select.prototype.insertAggregation = function() {
			this._callMethodInControl("insertAggregation", arguments);
			return this;
		};

		Select.prototype.removeAggregation = function() {
			return this._callMethodInControl("removeAggregation", arguments);
		};

		Select.prototype.removeAllAggregation = function() {
			return this._callMethodInControl("removeAllAggregation", arguments);
		};

		Select.prototype.destroyAggregation = function(sAggregationName, bSuppressInvalidate) {
			this._callMethodInControl("destroyAggregation", arguments);

			if (!bSuppressInvalidate && !this.isInvalidateSuppressed()) {
				this.invalidate();
			}

			return this;
		};

		Select.prototype.setProperty = function(sPropertyName, oValue, bSuppressInvalidate) {
			var oList = this.getList();

			if ((sPropertyName === "selectedKey") || (sPropertyName === "selectedItemId")) {

				// propagate the value of the "selectedKey" or "selectedItemId" properties to the list
				oList && SelectList.prototype.setProperty.apply(oList, arguments);
			}

			return Control.prototype.setProperty.apply(this, arguments);
		};

		Select.prototype.removeAllAssociation = function(sAssociationName, bSuppressInvalidate) {
			var oList = this.getList();

			if (oList && (sAssociationName === "selectedItem")) {
				SelectList.prototype.removeAllAssociation.apply(oList, arguments);
			}

			return Control.prototype.removeAllAssociation.apply(this, arguments);
		};

		Select.prototype.clone = function() {
			var oSelectClone = Control.prototype.clone.apply(this, arguments),
				oList = this.getList(),
				oSelectedItem = this.getSelectedItem(),
				sSelectedKey = this.getSelectedKey();

			// note: clone the items because the select forward its aggregation items
			// to an inner list control. In this case, the standard clone functionality
			// doesn't detect and clone the items that are forwarded to an inner control.
			if (!this.isBound("items") && oList) {
				for (var i = 0, aItems = oList.getItems(); i < aItems.length; i++) {
					oSelectClone.addItem(aItems[i].clone());
				}
			}

			if (!this.isBound("selectedKey") && !oSelectClone.isSelectionSynchronized()) {

				if (oSelectedItem && (sSelectedKey === "")) {
					oSelectClone.setSelectedIndex(this.indexOfItem(oSelectedItem));
				} else {
					oSelectClone.setSelectedKey(sSelectedKey);
				}
			}

			return oSelectClone;
		};

		/* ----------------------------------------------------------- */
		/* public methods                                              */
		/* ----------------------------------------------------------- */

		/**
		 * Adds an item to the aggregation named <code>items</code>.
		 *
		 * @param {sap.ui.core.Item} oItem The item to be added; if empty, nothing is added.
		 * @returns {sap.m.Select} <code>this</code> to allow method chaining.
		 * @public
		 */
		Select.prototype.addItem = function(oItem) {
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
		 * @returns {sap.m.Select} <code>this</code> to allow method chaining.
		 * @public
		 */
		Select.prototype.insertItem = function(oItem, iIndex) {
			this.insertAggregation("items", oItem, iIndex);

			if (oItem) {
				oItem.attachEvent("_change", this.onItemChange, this);
			}

			return this;
		};

		Select.prototype.findAggregatedObjects = function() {
			var oList = this.getList();

			if (oList) {

				// note: currently there is only one aggregation
				return SelectList.prototype.findAggregatedObjects.apply(oList, arguments);
			}

			return [];
		};

		/**
		 * Gets aggregation <code>items</code>.
		 *
		 * <b>Note</b>: This is the default aggregation.
		 * @return {sap.ui.core.Item[]}
		 * @public
		 */
		Select.prototype.getItems = function() {
			var oList = this.getList();
			return oList ? oList.getItems() : [];
		};

		/**
		 * Sets the <code>selectedItem</code> association.
		 *
		 * Default value is <code>null</code>.
		 *
		 * @param {string | sap.ui.core.Item | null} vItem New value for the <code>selectedItem</code> association.
		 * If an ID of a <code>sap.ui.core.Item</code> is given, the item with this ID becomes the <code>selectedItem</code> association.
		 * Alternatively, a <code>sap.ui.core.Item</code> instance may be given or <code>null</code>.
		 * If the value of <code>null</code> is provided, the first enabled item will be selected (if any).
		 *
		 * @returns {sap.m.Select} <code>this</code> to allow method chaining.
		 * @public
		 */
		Select.prototype.setSelectedItem = function(vItem) {

			if (typeof vItem === "string") {
				this.setAssociation("selectedItem", vItem, true);
				vItem = sap.ui.getCore().byId(vItem);
			}

			if (!(vItem instanceof sap.ui.core.Item) && vItem !== null) {
				return this;
			}

			if (!vItem) {
				vItem = this.getDefaultSelectedItem();
			}

			this.setSelection(vItem);
			this.setValue(this._getSelectedItemText(vItem));
			return this;
		};

		/**
		 * Sets the <code>selectedItemId</code> property.
		 *
		 * Default value is an empty string <code>""</code> or <code>undefined</code>.
		 *
		 * @param {string | undefined} vItem New value for property <code>selectedItemId</code>.
		 * If the provided <code>vItem</code> has a default value, the first enabled item will be selected (if any).
		 *
		 * @returns {sap.m.Select} <code>this</code> to allow method chaining.
		 * @public
		 * @since 1.12
		 */
		Select.prototype.setSelectedItemId = function(vItem) {
			vItem = this.validateProperty("selectedItemId", vItem);

			if (!vItem) {
				vItem = this.getDefaultSelectedItem();
			}

			this.setSelection(vItem);
			this.setValue(this._getSelectedItemText());
			return this;
		};

		/**
		 * Sets property <code>selectedKey</code>.
		 *
		 * Default value is an empty string <code>""</code> or <code>undefined</code>.
		 *
		 * @param {string} sKey New value for property <code>selectedKey</code>.
		 * If the provided <code>sKey</code> is an empty string <code>""</code> or <code>undefined</code>, the first enabled item is selected (if any).
		 * In the case that an item has the default key value, it is selected instead.
		 * If duplicate keys exist, the first item matching the key is selected.
		 *
		 * @returns {sap.m.Select} <code>this</code> to allow method chaining.
		 * @public
		 * @since 1.11
		 */
		Select.prototype.setSelectedKey = function(sKey) {
			sKey = this.validateProperty("selectedKey", sKey);
			var oItem = this.getItemByKey(sKey);

			if (oItem || (sKey === "")) {

				// if "sKey" is an empty string "" or undefined,
				// the first enabled item will be selected (if any)
				if (!oItem && sKey === "") {
					oItem = this.getDefaultSelectedItem();
				}

				this.setSelection(oItem);
				this.setValue(this._getSelectedItemText(oItem));
				return this;
			}

			return this.setProperty("selectedKey", sKey);
		};

		/**
		 * Gets the item from the aggregation named <code>items</code> at the given 0-based index.
		 *
		 * @param {int} iIndex Index of the item to return.
		 * @returns {sap.ui.core.Item | null} Item at the given index, or null if none.
		 * @public
		 * @since 1.16
		 */
		Select.prototype.getItemAt = function(iIndex) {
			return this.getItems()[ +iIndex] || null;
		};

		/**
		 * Gets the selected item object from the aggregation named <code>items</code>.
		 *
		 * @returns {sap.ui.core.Item | null} The current target of the <code>selectedItem</code> association, or null.
		 * @public
		 */
		Select.prototype.getSelectedItem = function() {
			var vSelectedItem = this.getAssociation("selectedItem");
			return (vSelectedItem === null) ? null : sap.ui.getCore().byId(vSelectedItem) || null;
		};

		/**
		 * Gets the first item from the aggregation named <code>items</code>.
		 *
		 * @returns {sap.ui.core.Item | null} The first item, or null if there are no items.
		 * @public
		 * @since 1.16
		 */
		Select.prototype.getFirstItem = function() {
			return this.getItems()[0] || null;
		};

		/**
		 * Gets the last item from the aggregation named <code>items</code>.
		 *
		 * @returns {sap.ui.core.Item | null} The last item, or null if there are no items.
		 * @public
		 * @since 1.16
		 */
		Select.prototype.getLastItem = function() {
			var aItems = this.getItems();
			return aItems[aItems.length - 1] || null;
		};

		/**
		 * Gets the enabled items from the aggregation named <code>items</code>.
		 *
		 * @param {sap.ui.core.Item[]} [aItems=getItems()] Items to filter.
		 * @return {sap.ui.core.Item[]} An array containing the enabled items.
		 * @public
		 * @since 1.22.0
		 */
		Select.prototype.getEnabledItems = function(aItems) {
			var oList = this.getList();
			return oList ? oList.getEnabledItems(aItems) : [];
		};

		/**
		 * Gets the item with the given key from the aggregation named <code>items</code>.
		 *
		 * <b>Note: </b> If duplicate keys exist, the first item matching the key is returned.
		 *
		 * @param {string} sKey An item key that specifies the item to be retrieved.
		 * @returns {sap.ui.core.Item | null}
		 * @public
		 * @since 1.16
		 */
		Select.prototype.getItemByKey = function(sKey) {
			var oList = this.getList();
			return oList ? oList.getItemByKey(sKey) : null;
		};

		/**
		 * Removes an item from the aggregation named <code>items</code>.
		 *
		 * @param {int | string | sap.ui.core.Item} vItem The item to be removed or its index or ID.
		 * @returns {sap.ui.core.Item} The removed item or null.
		 * @public
		 */
		Select.prototype.removeItem = function(vItem) {
			var oList = this.getList(),
				oItem;

			vItem = oList ? oList.removeItem(vItem) : null;

			if (this.getItems().length === 0) {
				this.clearSelection();
			} else if (this.isItemSelected(vItem)) {
				oItem = this.findFirstEnabledItem();

				if (oItem) {
					this.setSelection(oItem);
				}
			}

			this.setValue(this._getSelectedItemText());

			if (vItem) {
				vItem.detachEvent("_change", this.onItemChange, this);
			}

			return vItem;
		};

		/**
		 * Removes all the items in the aggregation named <code>items</code>.
		 * Additionally unregisters them from the hosting UIArea and clears the selection.
		 *
		 * @returns {sap.ui.core.Item[]} An array of the removed items (might be empty).
		 * @public
		 */
		Select.prototype.removeAllItems = function() {
			var oList = this.getList(),
				aItems = oList ? oList.removeAllItems() : [];

			this.clearSelection();
			this.setValue("");

			if (this._isRequiredSelectElement()) {
				this.$("select").children().remove();
			}

			for (var i = 0; i < aItems.length; i++) {
				aItems[i].detachEvent("_change", this.onItemChange, this);
			}

			return aItems;
		};

		/**
		 * Destroys all the items in the aggregation named <code>items</code>.
		 *
		 * @returns {sap.m.Select} <code>this</code> to allow method chaining.
		 * @public
		 */
		Select.prototype.destroyItems = function() {
			var oList = this.getList();

			if (oList) {
				oList.destroyItems();
			}

			this.setValue("");

			if (this._isRequiredSelectElement()) {
				this.$("select").children().remove();
			}

			return this;
		};

		/**
		 * Indicates whether the control's picker popup is opened.
		 *
		 * @returns {boolean} Indicates whether the picker popup is currently open (this includes opening and closing animations).
		 * @public
		 * @since 1.16
		 */
		Select.prototype.isOpen = function() {
			var oPicker = this.getAggregation("picker");
			return !!(oPicker && oPicker.isOpen());
		};

		/**
		 * Closes the control's picker popup.
		 *
		 * @returns {sap.m.Select} <code>this</code> to allow method chaining.
		 * @public
		 * @since 1.16
		 */
		Select.prototype.close = function() {
			var oPicker = this.getAggregation("picker");

			if (oPicker) {
				oPicker.close();
			}

			return this;
		};

		return Select;

}, /* bExport= */ true);