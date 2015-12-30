/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

/**
 * @namespace
 * @name sap.ui.core.delegate
 * @public
 */

// Provides class sap.ui.core.delegate.ItemNavigation
sap.ui.define(['jquery.sap.global', 'sap/ui/base/EventProvider'],
	function(jQuery, EventProvider) {
	"use strict";
	/* eslint-disable no-lonely-if */

	/**
	 * Creates an <code>ItemNavigation</code> delegate that can be attached to controls requiring
	 * capabilities for keyboard navigation between items.
	 *
	 * @class Delegate for the navigation between DOM nodes with the keyboard.
	 *
	 * The <code>ItemNavigation</code> provides keyboard and mouse navigation between DOM nodes representing items.
	 * This means that controls rendering a list of items can attach this delegate to get a common keyboard and mouse support
	 * to navigate between these items.
	 * It is possible to navigate between the items via the arrow keys.
	 * If needed, paging using the Page Up and Page Down keys is possible. (To activate call <code>setPageSize</code> with a value &gt; 0.)
	 * HOME and END keys are also supported.
	 * Focusing an item via mouse also is also supported. For mouse navigation, the <code>mousedown</code> event is used.
	 *
	 * As the <code>ItemNavigation</code> works with DOM nodes, the items and the control area must be provided as
	 * DOM references. There is one root DOM reference (set via <code>setRootDomRef</code>).
	 * All item DOM references (set via <code>setItemDomRefs</code>) must be places somewhere inside of this root DOM reference.
	 * Only focusable items are used for the navigation, meaning disabled items or separator items are just ignored by navigating
	 * through the items. In some cases however, it makes sense to put the non-focusable items in the array of the DOM references to
	 * keep the indexes stable or like in the calling control.
	 * <b>Hint:</b> To make a DOM reference focusable a <code>tabindex</code> of -1 can be set.
	 *
	 * <b>Note</b> After re-rendering of the control or changing the DOM nodes of the control, the
	 * DOM references of the <code>ItemNavigation</code> must be updated. Then the same item
	 * (corresponding to the index) will get the focus.
	 *
	 * The <code>ItemNavigation</code> adjusts the <code>tabindex</code> of all DOM references relating to the current
	 * focused item. So if the control containing the items gets the focus (e.g. via tab navigation),
	 * it is always the focused items which will be focused.
	 *
	 * <b>Note:</b> If the <code>ItemNavigation</code> is nested in another <code>ItemNavigation</code> 
	 * (e.g. <code>SegmentedButton</code> in <code>Toolbar</code>), the <code>RootDomRef</code> will always have <code>tabindex</code> -1.
	 *
	 * Per default the <code>ItemNavigation</code> cycles over the items.
	 * It navigates again to the first item if the Arrow Down or Arrow Right key is pressed while
	 * the last item has the focus. It navigates to the last item if arrow up or
	 * arrow left is pressed while the first item has the focus.
	 * If you want to stop the navigation at the first and last item,
	 * call the <code>setCycling</code> method with a value of <code>false</code>.
	 *
	 * It is possible to have multiple columns in the item navigation. If multiple columns
	 * are used, the keyboard navigation changes. The Arrow Right and Arrow Left keys will take the user to the next or previous
	 * item, and the Arrow Up and Arrow Down keys will navigate the same way but in a vertical direction.
	 *
	 * The <code>ItemNavigation</code> also allows setting a selected index that is used to identify
	 * the selected item. Initially, if no other focus is set, the selected item will be the focused one.
	 * Note that navigating through the items will not change the selected item, only the focus.
	 * (For example a radio group has one selected item.)
	 *
	 * @author SAP SE
	 *
	 * @extends sap.ui.base.EventProvider
	 *
	 * @param {Element} oDomRef The root DOM reference that includes all items
	 * @param {Element[]} aItemDomRefs Array of DOM references representing the items for the navigation
	 * @param {boolean} [bNotInTabChain=false] Whether the selected element should be in the tab chain or not
	 *
	 * @version 1.32.9
	 * @constructor
	 * @alias sap.ui.core.delegate.ItemNavigation
	 * @public
	 */
	var ItemNavigation = EventProvider.extend("sap.ui.core.delegate.ItemNavigation", /** @lends sap.ui.core.delegate.ItemNavigation.prototype */ {
		constructor: function(oDomRef, aItemDomRefs, bNotInTabChain) {

			EventProvider.apply(this);

			// the surrounding dom ref that is focused initially
			this.oDomRef = null;

			if (oDomRef) {
				this.setRootDomRef(oDomRef);
			}

			// the array of dom refs representing the items
			this.aItemDomRefs = [];
			if (aItemDomRefs) {
				this.setItemDomRefs(aItemDomRefs);
			}

			// initialize Tabindex
			this.iTabIndex = -1;

			// whether the active element should get a tabindex of 0 or -1
			this.iActiveTabIndex = !!bNotInTabChain ? -1 : 0;

			// the initial focusedindex
			this.iFocusedIndex = -1;

			// the initial selected index (if any)
			this.iSelectedIndex = -1;

			// default for cycling
			this.bCycling = true;

			// default for table mode
			this.bTableMode = false;

			// the pagesize for pageup and down events
			this.iPageSize = -1;

			// a marker to enable focusin to decide HOW the focus arrived
			this._bMouseDownHappened = false;

			// default disabled modifiers these modifiers will not be handled by ItemNavigation
			this.oDisabledModifiers = {
				sapend : ["alt", "shift"],
				saphome : ["alt", "shift"]
			};
		}
	});

	ItemNavigation.Events = {
		BeforeFocus: "BeforeFocus",
		AfterFocus: "AfterFocus",
		BorderReached: "BorderReached",
		FocusAgain: "FocusAgain",
		FocusLeave: "FocusLeave"
	};

	/**
	 * The 'beforeFocus' event is fired before the actual item is focused.
	 *
	 * @name sap.ui.core.delegate.ItemNavigation#beforeFocus
	 * @event
	 * @param {int} index Index of the item
	 * @param {jQuery.Event} event Event that leads to the focus change
	 * @public
	 */

	/**
	 * The 'afterFocus' event is fired after the actual item is focused.
	 * The control can register to this event and react on the focus change.
	 *
	 * @name sap.ui.core.delegate.ItemNavigation#afterFocus
	 * @event
	 * @param {int} index Index of the item
	 * @param {jQuery.Event} event Event that leads to the focus change
	 * @public
	 */

	/**
	 * The 'borderReached' event is fired if the border of the items is reached and
	 * no cycling is used, meaning an application can react on this.
	 *
	 * For example if the first item is focused and the Arrow Left key is pressed.
	 *
	 * @name sap.ui.core.delegate.ItemNavigation#borderReached
	 * @event
	 * @param {int} index Index of the item
	 * @param {jQuery.Event} event Event that leads to the focus change
	 * @public
	 */

	/**
	 * The 'focusAgain' event is fired if the current focused item is focused again
	 * (e.g. click again on focused item.)
	 *
	 * @name sap.ui.core.delegate.ItemNavigation#focusAgain
	 * @event
	 * @param {int} index Index of the item
	 * @param {jQuery.Event} event Event that leads to the focus change
	 * @public
	 */

	/**
	 * The 'focusLeave' event fired if the focus is set outside the control handled by the <code>ItemNavigation</code>.
	 *
	 * @name sap.ui.core.delegate.ItemNavigation#focusLeave
	 * @event
	 * @param {int} index Index of the item
	 * @param {jQuery.Event} event Event that leads to the focus change
	 * @public
	 */

	/**
	 * Sets the disabled modifiers
	 * These modifiers will not be handled by the <code>ItemNavigation</code>
	 *
	 * <pre>
	 * Example: Disable shift + up handling of the <code>ItemNavigation</code>
	 *
	 * oItemNavigation.setDisabledModifiers({
	 *     sapnext : ["shift"]
	 * });
	 *
	 * Possible keys are : "shift", "alt", "ctrl", "meta"
	 * Possible events are : "sapnext", "sapprevious", "saphome", "sapend"
	 * </pre>
	 *
	 * @param {Object} oDisabledModifiers Object that includes event type with disabled keys as an array
	 * @return {sap.ui.core.delegate.ItemNavigation} <code>this</code> to allow method chaining
	 * @public
	 */
	ItemNavigation.prototype.setDisabledModifiers = function(oDisabledModifiers) {
		this.oDisabledModifiers = oDisabledModifiers;
		return this;
	};

	/**
	 * Returns disabled modifiers
	 * These modifiers will not be handled by the <code>ItemNavigation</code>
	 *
	 * @param {object} oDisabledModifiers Object that includes event type with disabled keys as an array
	 * @return {object} Object that includes event type with disabled keys as an array
	 * @public
	 */
	ItemNavigation.prototype.getDisabledModifiers = function(oDisabledModifiers) {
		return this.oDisabledModifiers;
	};

	/**
	 * Check whether given event has disabled modifier or not
	 *
	 * @param {jQuery.Event} oEvent jQuery event
	 * @return {Boolean} Flag if disabled modifiers are set
	 * @public
	 */
	ItemNavigation.prototype.hasDisabledModifier = function(oEvent) {
		var aDisabledKeys = this.oDisabledModifiers[oEvent.type.replace("modifiers", "")];
		if (jQuery.isArray(aDisabledKeys)) {
			for (var i = 0; i < aDisabledKeys.length; i++) {
				if (oEvent[aDisabledKeys[i] + "Key"]) {
					return true;
				}
			}
		}

		return false;
	};

	/**
	 * Sets the root DOM reference surrounding the items
	 *
	 * @param {object} oDomRef Root DOM reference
	 * @return {sap.ui.core.delegate.ItemNavigation} <code>this</code> to allow method chaining
	 * @public
	 */
	ItemNavigation.prototype.setRootDomRef = function(oDomRef) {
		this.oDomRef = oDomRef;

		// in nested ItemNavigation the tabindex must only be set at the root DOM from the parent ItemNavigation
		if (!jQuery(this.oDomRef).data("sap.INItem")) {
			if (this.iFocusedIndex >= 0) {
				jQuery(this.oDomRef).attr("tabIndex", this.iTabIndex);
			} else {
				jQuery(this.oDomRef).attr("tabIndex", this.iActiveTabIndex);
			}
		}

		jQuery(this.oDomRef).data("sap.INRoot", this);

		return this;
	};

	/**
	 * Returns the root DOM reference surrounding the items
	 *
	 * @return {Element} Root DOM reference
	 * @public
	 */
	ItemNavigation.prototype.getRootDomRef = function() {
		return this.oDomRef;
	};

	/**
	 * Returns the array of item DOM references
	 *
	 * @return {Element[]} Array of item DOM references
	 * @public
	 */
	ItemNavigation.prototype.getItemDomRefs = function() {
		return this.aItemDomRefs;
	};

	/**
	 * Sets the item DOM references as an array for the items
	 *
	 * @param {Element[]} aItemDomRefs Array of DOM references representing the items
	 * @return {sap.ui.core.delegate.ItemNavigation} <code>this</code> to allow method chaining
	 * @public
	 */
	ItemNavigation.prototype.setItemDomRefs = function(aItemDomRefs) {
		this.aItemDomRefs = aItemDomRefs;

		if (this.iFocusedIndex > aItemDomRefs.length - 1) {
			this.iFocusedIndex = aItemDomRefs.length - 1;
		}

		// in nested ItemNavigation the tabindex must only be set if it's the focused item of the parent ItemNavigation
		for (var i = 0; i < this.aItemDomRefs.length; i++) {
			if (this.aItemDomRefs[i]) { // separators return null here
				var $Item = jQuery(this.aItemDomRefs[i]);

				// as this code can be executed even if the items are not visible (e.g. Popup is closed)
				// no focusable check can be performed. So only for the currently focused item
				// the tabindex is set to 0. For all items with tabindex 0 the tabindex is set to -1
				// Items without tabindex are checked for focusable on the first focusin on the root.
				if (i == this.iFocusedIndex && !$Item.data("sap.INRoot")) {
					$Item.attr("tabIndex", this.iActiveTabIndex);
				} else if ($Item.attr("tabindex") == "0") { // set tabindex to -1 only if already set to 0
					$Item.attr("tabIndex", -1);
				}

				$Item.data("sap.INItem", true);
				$Item.data("sap.InNavArea", true); //Item is in navigation area - allow navigation mode and edit mode

				if ($Item.data("sap.INRoot") && i != this.iFocusedIndex) {

					// item is root of an nested ItemNavigation -> set tabindexes from its items to -1
					$Item.data("sap.INRoot").setNestedItemsTabindex();
				}
			}
		}

		return this;
	};

	/**
	 * Sets the <code>tabindex</code> of the items.
	 *
	 * This cannot be done while setting items because at this point of time the items might
	 * be invisible (because e.g. a popup closed), meaning the focusable check will fail.
	 * So the items <code>tabindex</code>es are set if the rootDom is focused the first time.
	 *
	 * @return {sap.ui.core.delegate.ItemNavigation} <code>this</code> to allow method chaining
	 * @private
	 */
	ItemNavigation.prototype.setItemsTabindex = function() {

		for (var i = 0; i < this.aItemDomRefs.length; i++) {
			if (this.aItemDomRefs[i]) { // separators return null here
				var $Item = jQuery(this.aItemDomRefs[i]);
				if ($Item.is(":sapFocusable")) {

					// not focusable items (like labels) must not get a tabindex attribute
					if (i == this.iFocusedIndex && !$Item.data("sap.INRoot")) {
						$Item.attr("tabIndex", this.iActiveTabIndex);
					} else {
						$Item.attr("tabIndex", -1);
					}
				}
			}
		}

		return this;
	};

	/**
	 * Sets <code>tabindex</code> of item to -1
	 * if called from parent <code>ItemNavigation</code> if ItemNavigation is nested.
	 * In the nested case the <code>tabindex</code> is ruled by the parent <code>ItemNavigation</code>,
	 * only the top items can have <code>tabindex</code> = 0.
	 *
	 * @return {sap.ui.core.delegate.ItemNavigation} <code>this</code> to allow method chaining
	 * @private
	 */
	ItemNavigation.prototype.setNestedItemsTabindex = function() {
		if (jQuery(this.oDomRef).data("sap.INItem")) {
			for (var i = 0; i < this.aItemDomRefs.length; i++) {
				if (this.aItemDomRefs[i] && jQuery(this.aItemDomRefs[i]).attr("tabindex") == "0") { // separators return null here
					jQuery(this.aItemDomRefs[i]).attr("tabIndex", -1);
				}
			}
		}

		return this;
	};

	/**
	 * Destroys the delegate and releases all DOM references.
	 *
	 */
	ItemNavigation.prototype.destroy = function() {

		if (this.oDomRef) {
			jQuery(this.oDomRef).removeData("sap.INRoot");
			this.oDomRef = null;
		}

		if (this.aItemDomRefs) {
			for (var i = 0; i < this.aItemDomRefs.length; i++) {
				if (this.aItemDomRefs[i]) { // separators return null here
					jQuery(this.aItemDomRefs[i]).removeData("sap.INItem");
					jQuery(this.aItemDomRefs[i]).removeData("sap.InNavArea");
				}
			}

			this.aItemDomRefs = null;
		}

		this._bItemTabIndex = undefined;
		this.iFocusedIndex = -1;
	};

	/**
	 * Sets whether the <code>ItemNavigation</code> should cycle through the items.
	 *
	 * If cycling is disabled the navigation stops at the first and last item, if the corresponding arrow keys are used.
	 *
	 * @param {boolean} bCycling Set to true if cycling should be done, else false
	 * @return {sap.ui.core.delegate.ItemNavigation} <code>this</code> to allow method chaining
	 * @public
	 */
	ItemNavigation.prototype.setCycling = function(bCycling) {
		this.bCycling = bCycling;
		return this;
	};

	/**
	 * Sets whether the <code>ItemNavigation</code> should use the table mode to navigate through
	 * the items (navigation in a grid).
	 *
	 * @param {boolean} bTableMode Set to true if table mode should be used, else false
	 * @param {boolean} [bTableList] This sets a different behavior for table mode.
	 * In this mode we keep using table navigation but there are some differences. e.g.
	 * <ul>
	 * 	<li>Page-up moves focus to the first row, not to the first cell like in table mode</li>
	 * 	<li>Page-down moves focus to the last row, not to the last cell like in table mode</li>
	 * </ul>
	 *
	 * @return {sap.ui.core.delegate.ItemNavigation} <code>this</code> to allow method chaining
	 * @public
	 */
	ItemNavigation.prototype.setTableMode = function(bTableMode, bTableList) {
		this.bTableMode = bTableMode;
		this.bTableList = bTableMode ? bTableList : false;
		return this;
	};

	/**
	 * Sets the page size of the item navigation to allow Page Up and Page Down keys.
	 *
	 * @param {int} iPageSize The page size, needs to be at least 1
	 * @return {sap.ui.core.delegate.ItemNavigation} <code>this</code> to allow method chaining
	 * @public
	 */
	ItemNavigation.prototype.setPageSize = function(iPageSize) {
		this.iPageSize = iPageSize;
		return this;
	};

	/**
	 * Sets the selected index if the used control supports selection.
	 *
	 * @param {int} iIndex Index of the first selected item
	 * @return {sap.ui.core.delegate.ItemNavigation} <code>this</code> to allow method chaining
	 * @public
	 */
	ItemNavigation.prototype.setSelectedIndex = function(iIndex) {
		this.iSelectedIndex = iIndex;
		return this;
	};

	/**
	 * Sets whether the items are displayed in columns.
	 *
	 * If columns are used, the Arrow Up and Arrow Down keys navigate to the next or previous
	 * item of the column. If the first or last item of the column is reached, the next focused
	 * item is then in the next or previous column.
	 *
	 * @param {int} iColumns Count of columns for the table mode or cycling mode
	 * @param {boolean} bNoColumnChange Forbids jumping to an other column with Arrow Up and Arrow Down keys
	 * @return {sap.ui.core.delegate.ItemNavigation} <code>this</code> to allow method chaining
	 * @public
	 */
	ItemNavigation.prototype.setColumns = function(iColumns, bNoColumnChange) {
		this.iColumns = iColumns;
		this.bNoColumnChange = bNoColumnChange;
		return this;
	};

	/**
	 * Sets behavior of HOME and END keys if columns are used.
	 *
	 * @param {boolean} bStayInRow HOME -> go to first item in row; END -> go to last item in row
	 * @param {boolean} bCtrlEnabled HOME/END with CTRL -> go to first/last item of all
	 * @return {sap.ui.core.delegate.ItemNavigation} <code>this</code> to allow method chaining
	 * @public
	 */
	ItemNavigation.prototype.setHomeEndColumnMode = function(bStayInRow, bCtrlEnabled) {

			this._bStayInRow = bStayInRow;
			this._bCtrlEnabled = bCtrlEnabled;

			return this;

	};

	/**
	 * Sets the focus to the item with the given index.
	 *
	 * @param {int} iIndex Index of the item to focus
	 * @param {jQuery.event} oEvent Event that leads to focus change
	 * @private
	 */
	ItemNavigation.prototype.focusItem = function(iIndex, oEvent) {

		jQuery.sap.log.info("FocusItem: " + iIndex + " iFocusedIndex: " + this.iFocusedIndex, "focusItem", "ItemNavigation");

		if (iIndex == this.iFocusedIndex && this.aItemDomRefs[this.iFocusedIndex] == document.activeElement) {
			this.fireEvent(ItemNavigation.Events.FocusAgain, {
				index: iIndex,
				event: oEvent
			});
			return; // item already focused -> nothing to do
		}

		// if there is no item to put the focus on, we don't even try it, if working in table mode we just focus the next item
		if (!this.aItemDomRefs[iIndex] || !jQuery(this.aItemDomRefs[iIndex]).is(":sapFocusable")) {
			if (this.bTableMode) {
				var iCol = iIndex % this.iColumns;
				var iOldIndex = iIndex;
				if (oEvent.keyCode == jQuery.sap.KeyCodes.ARROW_RIGHT) {
					if (iCol < this.iColumns - 1) {
						iIndex += 1;
					}
				} else {
					if (iCol > 1) {
						iIndex -= 1;
					}
				}
				if (iIndex != iOldIndex) {
					this.focusItem(iIndex, oEvent);
				}
			}
			return;
		}

		this.fireEvent(ItemNavigation.Events.BeforeFocus, {
			index: iIndex,
			event: oEvent
		});

		this.setFocusedIndex(iIndex);
		this.bISetFocus = true;

		if (jQuery(this.aItemDomRefs[this.iFocusedIndex]).data("sap.INRoot") && oEvent) {

			// store event type for nested ItemNavigations
			var oItemItemNavigation = jQuery(this.aItemDomRefs[this.iFocusedIndex]).data("sap.INRoot");
			oItemItemNavigation._sFocusEvent = oEvent.type;
		}

		jQuery.sap.log.info("Set Focus on ID: " + this.aItemDomRefs[this.iFocusedIndex].id, "focusItem", "ItemNavigation");
		jQuery.sap.focus(this.aItemDomRefs[this.iFocusedIndex]);

		this.fireEvent(ItemNavigation.Events.AfterFocus, {
			index: iIndex,
			event: oEvent
		});
	};

	/**
	 * Sets the focused index to the given index.
	 *
	 * @param {int} iIndex Index of the item
	 * @return {sap.ui.core.delegate.ItemNavigation} <code>this</code> to allow method chaining
	 * @private
	 */
	ItemNavigation.prototype.setFocusedIndex = function(iIndex) {
		var $Item;

		if (iIndex < 0) {
			iIndex = 0;
		}

		if (iIndex > this.aItemDomRefs.length - 1) {
			iIndex = this.aItemDomRefs.length - 1;
		}

		jQuery(this.oDomRef).attr("tabIndex", this.iTabIndex);

		if (this.iFocusedIndex !== -1 && this.aItemDomRefs.length > this.iFocusedIndex) {
			jQuery(this.aItemDomRefs[this.iFocusedIndex]).attr("tabIndex", -1);

			// if focus is in nested ItemNavigation but is moved to an other item, remove tabindex from nested item
			$Item = jQuery(this.aItemDomRefs[this.iFocusedIndex]);
			if ($Item.data("sap.INRoot") && iIndex != this.iFocusedIndex) {
				jQuery($Item.data("sap.INRoot").aItemDomRefs[$Item.data("sap.INRoot").iFocusedIndex]).attr("tabIndex", -1);
			}
		}

		this.iFocusedIndex = iIndex;
		var oFocusItem = this.aItemDomRefs[this.iFocusedIndex];

		$Item = jQuery(this.aItemDomRefs[this.iFocusedIndex]);
		if (!$Item.data("sap.INRoot")) {

			// in nested ItemNavigation the nested item gets the tabindex
			jQuery(oFocusItem).attr("tabIndex", this.iActiveTabIndex);
		}

		return this;
	};

	/**
	 * Returns the focused DOM reference.
	 *
	 * @return {Element} Focused DOM reference
	 * @private
	 */
	ItemNavigation.prototype.getFocusedDomRef = function() {
		return this.aItemDomRefs[this.iFocusedIndex];
	};

	/**
	 * Returns index of the focused item.
	 *
	 * @return {int} focused index
	 * @private
	 */
	ItemNavigation.prototype.getFocusedIndex = function() {
		return this.iFocusedIndex;
	};

	/**
	 * Handles the onfocusin event.
	 *
	 * @param {jQuery.Event} oEvent the browser event
	 * @private
	 */
	ItemNavigation.prototype.onfocusin = function(oEvent) {

		var oSource = oEvent.target;
		var i = 0;

		if (oSource == this.oDomRef) {

			// focus occured on the main dom ref
			// on first focus - set tabindex for items
			if (!this._bItemTabIndex) {
				this.setItemsTabindex();
				this._bItemTabIndex = true;
			}

			// if the focus came by clicking AND it did not target one of the elements, but the root element, do nothing
			// (otherwise clicking the scrollbar re-focuses the previously focused element, which causes the browser to scroll it into view)
			if (this._bMouseDownHappened) {
				return;
			}

			var iIndex;

			if (jQuery(this.oDomRef).data("sap.INItem") && this._sFocusEvent && !jQuery(this.oDomRef).data("sap.InNavArea")) {

				// if nested ItemNavigation need to know if focused by parent ItemNavigation (not in Navigation mode)
				switch (this._sFocusEvent) {
					case "sapnext":
						iIndex = 0;
						break;

					case "sapprevious":
						iIndex = this.aItemDomRefs.length - 1;
						break;

					default:
						if (this.iSelectedIndex != -1) {
							iIndex = this.iSelectedIndex;
						} else if (this.iFocusedIndex != -1) {
							iIndex = this.iFocusedIndex;
						} else {
							iIndex = 0;
						}
						break;
				}

				this._sFocusEvent = undefined;
			} else {
				if (this.iSelectedIndex != -1) {
					iIndex = this.iSelectedIndex;
				} else if (this.iFocusedIndex != -1) {
					iIndex = this.iFocusedIndex;
				} else {
					iIndex = 0;
				}
			}

			this.focusItem(iIndex, oEvent);

			if (this.iFocusedIndex == -1) {

				// no item focused, maybe not focusable -> try the next one
				for (i = iIndex + 1; i < this.aItemDomRefs.length; i++) {
					this.focusItem(i, oEvent);
					if (this.iFocusedIndex == i) {
						break;
					}
				}

				if (this.iFocusedIndex == -1 && iIndex > 0) {

					// still no item selected, try to find a previous one
					for (i = iIndex - 1; i >= 0; i--) {
						this.focusItem(i, oEvent);
						if (this.iFocusedIndex == i) {
							break;
						}
					}
				}
			}

			// cancel the bubbling of event in this case
			oEvent.preventDefault();
			oEvent.stopPropagation();
		} else if (!this.bISetFocus) {

			// check if this is really the already focused item
			// in case of a click on a label this could be an other item
			if (this.aItemDomRefs && oEvent.target != this.aItemDomRefs[this.iFocusedIndex]) {
				for (i = 0; i < this.aItemDomRefs.length; i++) {
					if (oEvent.target == this.aItemDomRefs[i]) {
						this.focusItem(i, oEvent);
						break;
					}
				}
			} else {

				// give focused item to registered application
				this.fireEvent(ItemNavigation.Events.AfterFocus,{index:this.iFocusedIndex, event:oEvent});
			}
		}

		this.bISetFocus = false;
	};

	/**
	 * Handles the onsapfocusleave event
	 *
	 * @param {jQuery.Event} oEvent the browser event
	 * @private
	 */
	ItemNavigation.prototype.onsapfocusleave = function(oEvent) {
		if (!oEvent.relatedControlId || !jQuery.sap.containsOrEquals(this.oDomRef, sap.ui.getCore().byId(oEvent.relatedControlId).getFocusDomRef())) {

			// entirely leaving the control handled by this ItemNavigation instance
			var iIndex;
			if (this.iSelectedIndex != -1) {
				iIndex = this.iSelectedIndex;
			} else if (this.iFocusedIndex != -1) {
				iIndex = this.iFocusedIndex;
			} else {
				iIndex = 0;
			}
			this.setFocusedIndex(iIndex);

			var $DomRef;

			if (jQuery(this.oDomRef).data("sap.INItem")) {

				// if in nested ItemNavigation and focus moves to item of parent ItemNavigation -> do not set Tabindex
				var oParentDomRef;
				$DomRef = jQuery(this.oDomRef);

				while (!oParentDomRef) {
					$DomRef = $DomRef.parent();
					if ($DomRef.data("sap.INRoot")) {
						oParentDomRef = $DomRef.get(0);
					}
				}

				if (!oEvent.relatedControlId || jQuery.sap.containsOrEquals(oParentDomRef, sap.ui.getCore().byId(oEvent.relatedControlId).getFocusDomRef())) {
					jQuery(this.aItemDomRefs[this.iFocusedIndex]).attr("tabIndex", -1);
				}
			}

			$DomRef = jQuery(this.oDomRef);
			if ($DomRef.data("sap.InNavArea") === false) { // check for false to avoid undefinded

				// if in action mode switch back to navigation mode
				$DomRef.data("sap.InNavArea", true);
			}

			this.fireEvent(ItemNavigation.Events.FocusLeave, {
				index: iIndex,
				event: oEvent
			});
		}
	};

	/**
	 * Handles the onmousedown event
	 * Sets the focus to the item if it occured on an item
	 *
	 * @param {jQuery.Event} oEvent the browser event
	 * @private
	 */
	ItemNavigation.prototype.onmousedown = function(oEvent) {

		// set the focus to the clicked element or back to the last
		var oSource = oEvent.target;

		var checkFocusableParent = function( oDomRef, oItem){

			// as table cell might have focusable content that have not focusable DOM insinde
			// the table cell should not get the focus but the focusable element inside
			var bFocusableParent = false;
			var $CheckDom = jQuery(oDomRef);
			while (!$CheckDom.is(":sapFocusable") && $CheckDom.get(0) != oItem) {
				$CheckDom = $CheckDom.parent();
			}

			if ($CheckDom.get(0) != oItem) {
				// focusable Dom found inside item
				bFocusableParent = true;
			}

			return bFocusableParent;

		};

		if (jQuery.sap.containsOrEquals(this.oDomRef, oSource)) {

			// the mouse down occured inside the main dom ref
			for (var i = 0; i < this.aItemDomRefs.length;i++) {
				var oItem = this.aItemDomRefs[i];
				if (jQuery.sap.containsOrEquals(oItem,oSource)) {
					if (!this.bTableMode) {

						// the mousedown occured inside of an item
						this.focusItem(i, oEvent);

						// no oEvent.preventDefault(); because cursor will not be set in Textfield
						// no oEvent.stopPropagation(); because e.g. DatePicker can not close popup
					} else {
						// only focus the items if the click did not happen on a
						// focusable element!
						if (oItem === oSource || !checkFocusableParent(oSource, oItem)) {
							this.focusItem(i, oEvent);

							// the table mode requires not to prevent the default
							// behavior on click since we want to allow text selection
							// click into the control, ...
						}
					}
					return;
				}
			}

			if (oSource == this.oDomRef) {

				// root DomRef of item navigation has been clicked
				// focus will also come in a moment - let it know that it was the mouse who caused the focus
				this._bMouseDownHappened = true;
				var that = this;
				window.setTimeout(
					function(){
						that._bMouseDownHappened = false;
					}, 20
				);
			}
		}
	};

	/**
	 * Handles the onsapnext event
	 * Sets the focus to the next item
	 *
	 * @param {jQuery.Event} oEvent the browser event
	 * @private
	 */
	ItemNavigation.prototype.onsapnext = function(oEvent) {

		if (!jQuery.sap.containsOrEquals(this.oDomRef, oEvent.target)) {

			// current element is not part of the navigation content
			return;
		}

		if (jQuery(this.oDomRef).data("sap.InNavArea")) {

			// control is in navigation mode -> no ItemNavigation
			return;
		}

		// in the table mode we only react on events of the domrefs
		if (this.bTableMode && jQuery.inArray(oEvent.target, this.aItemDomRefs) === -1) {
			return;
		}

		// focus the next item
		var iIndex = this.iFocusedIndex,
			bFirstTime = true,
			bBorderReached = false;

		if (iIndex > -1) {
			if (this.bTableMode) {

				var iRowCount = this.aItemDomRefs.length / this.iColumns,
					iRow = Math.floor(iIndex / this.iColumns),
					iCol = iIndex % this.iColumns;

				if (oEvent.keyCode == jQuery.sap.KeyCodes.ARROW_DOWN) {
					if (iRow  < iRowCount - 1) {
						iIndex += this.iColumns;
					}
				} else {
					if (iCol < this.iColumns - 1) {
						iIndex += 1;
					}
				}
			} else {
				do {
					if (this.iColumns > 1 && oEvent.keyCode == jQuery.sap.KeyCodes.ARROW_DOWN) {
						if ((iIndex + this.iColumns) >= this.aItemDomRefs.length) {
							if (!this.bNoColumnChange) {
								// on bottom -> begin on top of next column
								if ((iIndex % this.iColumns) < (this.iColumns - 1)) {
									iIndex = (iIndex % this.iColumns) + 1;
								} else if (this.bCycling) {
									iIndex = 0;
								}
							} else {
								// do not go to an other item;
								iIndex = this.iFocusedIndex;
								bBorderReached = true;
							}
						} else {
							iIndex = iIndex + this.iColumns;
						}
					} else {
						if (iIndex == this.aItemDomRefs.length - 1) {

							// last item
							if (jQuery(this.oDomRef).data("sap.INItem")) {

								// if nested ItemNavigations leave here to ItemNavigation of parent
								return;
							} else if (this.bCycling) {

								// in cycling case focus first one, if not - don't change
								iIndex = 0;
							} else {

								// last one, no next item, so leave focus on already focused item (to prevent endless loops)
								iIndex = this.iFocusedIndex;
								bBorderReached = true;
							}
						} else {
							iIndex++;
						}
					}

					if (iIndex === this.iFocusedIndex) {
						if (bFirstTime) {
							bFirstTime = false;
						} else {
							throw new Error("ItemNavigation has no visible/existing items and is hence unable to select the next one");
						}
					}

				// if item is not visible or a dummy item go to the next one
				// !jQuery(this.aItemDomRefs[iIndex]).is(":visible") and jQuery(this.aItemDomRefs[iIndex]).css("visibility") === "hidden"
				// - is not needed as .is(":sapFocusable") do these checks already
				} while (!this.aItemDomRefs[iIndex] || !jQuery(this.aItemDomRefs[iIndex]).is(":sapFocusable"));
			}

			this.focusItem(iIndex, oEvent);

			if (bBorderReached) {
				this.fireEvent(ItemNavigation.Events.BorderReached, {
					index: iIndex,
					event: oEvent
				});
			}

			// cancel the event otherwise the browser will scroll
			oEvent.preventDefault();
			oEvent.stopPropagation();
		}
	};

	/**
	 * Ensure the sapnext event with modifiers is also handled
	 *
	 * @see #onsapnext
	 * @param {jQuery.Event} oEvent the browser event
	 * @private
	 */
	ItemNavigation.prototype.onsapnextmodifiers = function(oEvent) {
		if (this.hasDisabledModifier(oEvent)) {
			return;
		}

		this.onsapnext(oEvent);
	};

	/**
	 * Handles the onsapprevious event
	 * Sets the focus to the previous item
	 *
	 * @param {jQuery.Event} oEvent the browser event
	 * @private
	 */
	ItemNavigation.prototype.onsapprevious = function(oEvent) {

		if (!jQuery.sap.containsOrEquals(this.oDomRef, oEvent.target)) {

			// current element is not part of the navigation content
			return;
		}

		if (jQuery(this.oDomRef).data("sap.InNavArea")) {

			// control is in navigation mode -> no ItemNavigation
			return;
		}

		// in the table mode we only react on events of the domrefs
		if (this.bTableMode && jQuery.inArray(oEvent.target, this.aItemDomRefs) === -1) {
			return;
		}

		// focus the previous item
		var iIndex = this.iFocusedIndex,
			bFirstTime = true,
			bBorderReached = false;
		var iCol = 0;

		if (iIndex > -1) {
			if (this.bTableMode) {
				var iRow = Math.floor(iIndex / this.iColumns);
				iCol = iIndex % this.iColumns;

				if (oEvent.keyCode == jQuery.sap.KeyCodes.ARROW_UP) {
					if (iRow  > 0) {
						iIndex -= this.iColumns;
					}
				} else {
					if (iCol > 0) {
						iIndex -= 1;
					}
				}
			} else {
				do {
					if (this.iColumns > 1 && oEvent.keyCode == jQuery.sap.KeyCodes.ARROW_UP) {
						if ((iIndex - this.iColumns) < 0) {
							if (!this.bNoColumnChange) {
								// on top -> begin on end of previous column
								iCol = 0;

								if ((iIndex % this.iColumns) > 0) {
									iCol = (iIndex % this.iColumns) - 1;
								} else if (this.bCycling) {
									iCol = Math.min(this.iColumns - 1, this.aItemDomRefs.length - 1);
								}

								if (iIndex === 0 && iCol === 0) {
									iIndex = 0;
								} else {
									var iRows = Math.ceil(this.aItemDomRefs.length / this.iColumns);
									iIndex = iCol + ((iRows - 1) * this.iColumns);

									if (iIndex >= this.aItemDomRefs.length) {
										iIndex = iIndex - this.iColumns;
									}
								}
							} else {
								// do not go to an other item;
								iIndex = this.iFocusedIndex;
								bBorderReached = true;
							}
						} else {
							iIndex = iIndex - this.iColumns;
						}
					} else {
						if (iIndex == 0) {

							// first item
							if (jQuery(this.oDomRef).data("sap.INItem")) {

								// if nested ItemNavigations leave here to ItemNavigation of parent
								return;
							} else if (this.bCycling) {

								// in cycling case focus last one, if not - don't change
								iIndex = this.aItemDomRefs.length - 1;
							} else {

								// first one, no next item, so leave focus on already focused item (to prevent endless loops)
								iIndex = this.iFocusedIndex;
								bBorderReached = true;
							}
						} else {
							iIndex--;
						}
					}

					if (iIndex == this.iFocusedIndex) {
						if (bFirstTime) {
							bFirstTime = false;
						} else {
							throw new Error("ItemNavigation has no visible/existing items and is hence unable to select the previous one");
						}
					}

				// if item is not visible or a dummy item go to the next one
				} while (!this.aItemDomRefs[iIndex] || !jQuery(this.aItemDomRefs[iIndex]).is(":sapFocusable"));
			}

			this.focusItem(iIndex, oEvent);

			if (bBorderReached) {
				this.fireEvent(ItemNavigation.Events.BorderReached, {
					index: iIndex,
					event: oEvent
				});
			}

			// cancel the event otherwise the browser will scroll
			oEvent.preventDefault();
			oEvent.stopPropagation();
		}
	};

	/**
	 * Ensure the sapprevious event with modifiers is also handled
	 *
	 * @see #onsapprevious
	 * @param {jQuery.Event} oEvent the browser event
	 * @private
	 */
	ItemNavigation.prototype.onsappreviousmodifiers = function(oEvent) {
		if (this.hasDisabledModifier(oEvent)) {
			return;
		}

		this.onsapprevious(oEvent);
	};

	/**
	 * Handles the onsappageup event
	 * Sets the focus to the previous page item of <code>iPageSize</code> > 0
	 * @param {jQuery.Event} oEvent the browser event
	 * @private
	 */
	ItemNavigation.prototype.onsappageup = function(oEvent) {

		if (!jQuery.sap.containsOrEquals(this.oDomRef, oEvent.target)) {

			// current element is not part of the navigation content
			return;
		}

		// in the table mode we only react on events of the domrefs
		if (this.bTableMode && jQuery.inArray(oEvent.target, this.aItemDomRefs) === -1) {
			return;
		}

		var iIndex = 0;
		var bBorderReached = false;

		if (this.iPageSize > 0) {
			iIndex = this.iFocusedIndex;

			if (iIndex > -1) {
				iIndex = iIndex - this.iPageSize;

				while (iIndex > 0 && !jQuery(this.aItemDomRefs[iIndex]).is(":sapFocusable")) {
					iIndex--;
				}

				if (iIndex < 0) {
					if (!this.bNoColumnChange) {
						iIndex = 0;
					} else {
						iIndex = this.iFocusedIndex;
						bBorderReached = true;
					}
				}

				this.focusItem(iIndex, oEvent);
			}
		} else if (this.bTableMode) {
			iIndex = this.iFocusedIndex % this.iColumns;
			this.focusItem(iIndex, oEvent);
		}

		if (bBorderReached) {
			this.fireEvent(ItemNavigation.Events.BorderReached, {
				index: iIndex,
				event: oEvent
			});
		}

		// cancel the event otherwise the browser will scroll
		oEvent.preventDefault();
		oEvent.stopPropagation();

	};

	/**
	 * Handles the onsappagedown event.
	 *
	 * Sets the focus to the previous page item of <code>iPageSize</code> > 0
	 *
	 * @param {jQuery.Event} oEvent the browser event
	 * @private
	 */
	ItemNavigation.prototype.onsappagedown = function(oEvent) {

		if (!jQuery.sap.containsOrEquals(this.oDomRef, oEvent.target)) {

			// current element is not part of the navigation content
			return;
		}

		// in the table mode we only react on events of the domrefs
		if (this.bTableMode && jQuery.inArray(oEvent.target, this.aItemDomRefs) === -1) {
			return;
		}

		var iIndex = 0;
		var bBorderReached = false;

		if (this.iPageSize > 0) {
			iIndex = this.iFocusedIndex;

			if (iIndex > -1) {
				iIndex = iIndex + this.iPageSize;

				while (iIndex < this.aItemDomRefs.length - 1 && !jQuery(this.aItemDomRefs[iIndex]).is(":sapFocusable")) {
					iIndex++;
				}

				if (iIndex > this.aItemDomRefs.length - 1) {
					if (!this.bNoColumnChange) {
						iIndex = this.aItemDomRefs.length - 1;
					} else {
						iIndex = this.iFocusedIndex;
						bBorderReached = true;
					}
				}

				this.focusItem(iIndex, oEvent);
			}
		} else if (this.bTableMode) {
			var iRowCount = this.aItemDomRefs.length / this.iColumns,
				iCol = this.iFocusedIndex % this.iColumns;

			iIndex = (iRowCount - 1) * this.iColumns + iCol;
			this.focusItem(iIndex, oEvent);
		}

		if (bBorderReached) {
			this.fireEvent(ItemNavigation.Events.BorderReached, {
				index: iIndex,
				event: oEvent
			});
		}

		// cancel the event otherwise the browser will scroll
		oEvent.preventDefault();
		oEvent.stopPropagation();
	};

	/**
	 * Handles the onsaphome event
	 *
	 * Sets the focus to first visible and focusable item
	 * @param {jQuery.Event} oEvent the browser event
	 * @private
	 */
	ItemNavigation.prototype.onsaphome = function(oEvent) {

		if (!jQuery.sap.containsOrEquals(this.oDomRef, oEvent.target)) {

			// current element is not part of the navigation content
			// or shift or alt key is pressed
			return;
		}

		// in the table mode we only react on events of the domrefs
		if (this.bTableMode && jQuery.inArray(oEvent.target, this.aItemDomRefs) === -1) {
			return;
		}

		var iIndex = 0;
		var iRow = 0;
		if (this.bTableMode) {

			if (!this.bTableList && !(oEvent.metaKey || oEvent.ctrlKey)) {
				iRow = Math.floor(this.iFocusedIndex / this.iColumns);
				iIndex = iRow * this.iColumns;
			}
		} else {
			if (!!(oEvent.metaKey || oEvent.ctrlKey) && !this._bCtrlEnabled) {

				// do not handle ctrl
				return;
			}

			if (this._bStayInRow && !(this._bCtrlEnabled && (oEvent.metaKey || oEvent.ctrlKey)) && this.iColumns > 0) {
				iRow = Math.floor(this.iFocusedIndex / this.iColumns);
				iIndex = iRow * this.iColumns;
			} else {
				while (!this.aItemDomRefs[iIndex] || !jQuery(this.aItemDomRefs[iIndex]).is(":sapFocusable")) {
					iIndex++;

					if (iIndex == this.aItemDomRefs.length) {

						// no visible item -> no new focus
						return;
					}
				}
			}
		}

		this.focusItem(iIndex, oEvent);

		// cancel the event otherwise the browser will scroll
		oEvent.preventDefault();
		oEvent.stopPropagation();
	};

	/**
	 * Ensure the sapprevious event with modifiers is also handled
	 *
	 * @see #onsaphome
	 * @param {jQuery.Event} oEvent the browser event
	 * @private
	 */
	ItemNavigation.prototype.onsaphomemodifiers = function(oEvent) {
		if (this.hasDisabledModifier(oEvent)) {
			return;
		}

		this.onsaphome(oEvent);
	};

	/**
	 * Handles the onsapend event
	 *
	 * Sets the focus to last visible and focusable item
	 * @param {jQuery.Event} oEvent the browser event
	 * @private
	 */
	ItemNavigation.prototype.onsapend = function(oEvent) {

		if (!jQuery.sap.containsOrEquals(this.oDomRef, oEvent.target)) {

			// current element is not part of the navigation content
			// or shift or alt key is pressed
			return;
		}

		// in the table mode we only react on events of the domrefs
		if (this.bTableMode && jQuery.inArray(oEvent.target, this.aItemDomRefs) === -1) {
			return;
		}

		var iIndex = this.aItemDomRefs.length - 1;
		var iRow = 0;

		if (this.bTableMode) {
			if (!this.bTableList && !(oEvent.metaKey || oEvent.ctrlKey)) {
				iRow = Math.floor(this.iFocusedIndex / this.iColumns);
				iIndex = iRow * this.iColumns + this.iColumns - 1;
			}
		} else {

			if (!!(oEvent.metaKey || oEvent.ctrlKey) && !this._bCtrlEnabled) {

				// do not handle ctrl
				return;
			}

			if (this._bStayInRow && !(this._bCtrlEnabled && (oEvent.metaKey || oEvent.ctrlKey)) && this.iColumns > 0) {
				iRow = Math.floor(this.iFocusedIndex / this.iColumns);
				iIndex = (iRow + 1) * this.iColumns - 1;
				if (iIndex >= this.aItemDomRefs.length) {
					// item not exist -> use last one
					iIndex = this.aItemDomRefs.length - 1;
				}
			} else {
				while (!this.aItemDomRefs[iIndex] || !jQuery(this.aItemDomRefs[iIndex]).is(":sapFocusable")) {
					iIndex--;

					if (iIndex < 0) {

						// no visible item -> no new focus
						return;
					}
				}
			}
		}

		this.focusItem(iIndex, oEvent);

		// cancel the event otherwise the browser will scroll
		oEvent.preventDefault();
		oEvent.stopPropagation();
	};

	/**
	 * Ensure the sapprevious event with modifiers is also handled.
	 *
	 * @see #onsapend
	 * @param {jQuery.Event} oEvent the browser event
	 * @private
	 */
	ItemNavigation.prototype.onsapendmodifiers = function(oEvent) {
		if (this.hasDisabledModifier(oEvent)) {
			return;
		}

		this.onsapend(oEvent);
	};

	/**
	 * Sets <code>tabindex</code> of the root DOM reference to 0.
	 * Is used, for example in image map for IE browser in order to avoid <code>tabindex</code> -1 on image
	 * with which it would not be tabable at all.
	 *
	 * @private
	 */
	ItemNavigation.prototype.setTabIndex0 = function() {
		this.iTabIndex = 0;
		this.iActiveTabIndex = 0;
	};

	/**
	 * toggle navigation/action mode on F2
	 *
	 * @param {jQuery.Event} oEvent the browser event
	 * @private
	 */
	ItemNavigation.prototype.onkeyup = function(oEvent) {

		if (oEvent.keyCode == jQuery.sap.KeyCodes.F2) {

			var $DomRef = jQuery(this.oDomRef);

			if ($DomRef.data("sap.InNavArea")) {
				$DomRef.data("sap.InNavArea", false);
			} else if ($DomRef.data("sap.InNavArea") === false) { // check for false to avoid undefined
				$DomRef.data("sap.InNavArea", true);
			}

			oEvent.preventDefault();
			oEvent.stopPropagation();
		}
	};

	return ItemNavigation;

});