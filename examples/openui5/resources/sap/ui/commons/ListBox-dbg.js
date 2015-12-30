/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.commons.ListBox.
sap.ui.define(['jquery.sap.global', './library', 'sap/ui/core/Control', 'sap/ui/core/delegate/ItemNavigation', 'jquery.sap.strings'],
	function(jQuery, library, Control, ItemNavigation/* , jQuerySap */) {
	"use strict";

	/**
	 * Constructor for a new ListBox.
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * Provides a list of items from which users can choose an item.
	 * For the design of the list box, features such as defining the list box height, fixing the number of visible items,
	 * choosing one item to be the item that is marked by default when the list box is shown,
	 * or a scroll bar for large list boxes are available.
	 * @extends sap.ui.core.Control
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @alias sap.ui.commons.ListBox
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var ListBox = Control.extend("sap.ui.commons.ListBox", /** @lends sap.ui.commons.ListBox.prototype */ { metadata : {
		library : "sap.ui.commons",
		properties : {

			/**
			 * Determines whether the ListBox is interactive or not.
			 * Can be used to disable interaction with mouse or keyboard.
			 */
			editable : {type : "boolean", group : "Behavior", defaultValue : true},

			/**
			 * Determines whether the ListBox is enabled or not.
			 * Can be used to disable interaction with mouse or keyboard.
			 * Disabled controls have another color display depending on custom settings.
			 */
			enabled : {type : "boolean", group : "Behavior", defaultValue : true},

			/**
			 * Determines whether multiple selection is allowed.
			 */
			allowMultiSelect : {type : "boolean", group : "Behavior", defaultValue : false},

			/**
			 * Control width as common CSS-size (px or % as unit, for example).
			 */
			width : {type : "sap.ui.core.CSSSize", group : "Dimension", defaultValue : null},

			/**
			 * Control height as common CSS-size (px or % as unit, for example).
			 * The setting overrides any definitions made for the setVisibleItems() method.
			 */
			height : {type : "sap.ui.core.CSSSize", group : "Dimension", defaultValue : null},

			/**
			 * Scroll bar position from the top.
			 * Setting the scrollTop property and calling scrollToIndex are two operations
			 * influencing the same "physical" property, so the last call "wins".
			 */
			scrollTop : {type : "int", group : "Behavior", defaultValue : -1},

			/**
			 * Determines whether the icons of the list items shall also be displayed.
			 * Enabling icons requires some space to be reserved for them.
			 * Displaying icons can also influence the width and height of a single item,
			 * which affects the overall height of the ListBox when defined in number of items.
			 * Note that the number of icons that can be displayed in the ListBox depends on the
			 * size of the icons themselves and of the total ListBox height.
			 */
			displayIcons : {type : "boolean", group : "Behavior", defaultValue : false},

			/**
			 * Determines whether the text values from the additionalText property (see sap.ui.core.ListItems) shall be displayed.
			 */
			displaySecondaryValues : {type : "boolean", group : "Misc", defaultValue : false},

			/**
			 * Determines the text alignment in the primary ListBox column.
			 */
			valueTextAlign : {type : "sap.ui.core.TextAlign", group : "Appearance", defaultValue : sap.ui.core.TextAlign.Begin},

			/**
			 * Determines the text alignment in the secondary ListBox text column (if available).
			 */
			secondaryValueTextAlign : {type : "sap.ui.core.TextAlign", group : "Appearance", defaultValue : sap.ui.core.TextAlign.Begin},

			/**
			 * Determines the minimum width of the ListBox. If not set, there is no minimum width.
			 */
			minWidth : {type : "sap.ui.core.CSSSize", group : "Dimension", defaultValue : null},

			/**
			 * Determines the maximum width of the ListBox. If not set, there is no maximum width.
			 */
			maxWidth : {type : "sap.ui.core.CSSSize", group : "Dimension", defaultValue : null},

			/**
			 * The ListBox height in number of items that are initially displayed without scrolling.
			 * This setting overwrites height settings in terms of CSS size that have been made.
			 * When the items have different heights, the height of the first item is used for all
			 * other item height calculations.
			 * Note that if there are one or more separators between the visible ListBox items,
			 * the displayed items might not relate 1:1 to the initially specified number of items.
			 * When the value is retrieved, it equals the previously set value if it was set;
			 * otherwise, it will be the number of items completely fitting into the ListBox without
			 * scrolling in the case the control was already rendered.
			 * Note that if the control was not rendered, the behavior will be undefined,
			 * it may return -1 or any other number.
			 */
			visibleItems : {type : "int", group : "Dimension", defaultValue : null}
		},
		defaultAggregation : "items",
		aggregations : {

			/**
			 * Aggregation of items to be displayed. Must be either of type sap.ui.core.ListItem or sap.ui.core.SeparatorItem.
			 */
			items : {type : "sap.ui.core.Item", multiple : true, singularName : "item"}
		},
		associations : {

			/**
			 * Association to controls / ids which describe this control (see WAI-ARIA attribute aria-describedby).
			 */
			ariaDescribedBy : {type : "sap.ui.core.Control", multiple : true, singularName : "ariaDescribedBy"},

			/**
			 * Association to controls / ids which label this control (see WAI-ARIA attribute aria-labelledby).
			 */
			ariaLabelledBy : {type : "sap.ui.core.Control", multiple : true, singularName : "ariaLabelledBy"}
		},
		events : {

			/**
			 * Event is fired when selection is changed by user interaction.
			 */
			select : {
				parameters : {

					/**
					 * ID of the ListBox which triggered the event.
					 */
					id : {type : "string"},

					/**
					 * The currently selected index of the ListBox.
					 * In the case of multiple selection, this is exactly one of the selected indices -
					 * the one whose selection has triggered the selection change.
					 * To get all currently selected indices, use selectedIndices.
					 */
					selectedIndex : {type : "int"},

					/**
					 * The currently selected item of the ListBox.
					 * In the case of multiple selection, this is exactly one of the selected items -
					 * the one whose selection has triggered the selection change.
					 */
					selectedItem : {type : "sap.ui.core.Item"},

					/**
					 * Array containing the indices which are selected.
					 */
					selectedIndices : {type : "int[]"}
				}
			}
		}
	}});


	/**
	 * Initializes the ListBox control
	 * @private
	 */
	ListBox.prototype.init = function () {
		this.allowTextSelection(false);
		if (!this._bHeightInItems) { // otherwise setVisibleItems was already called by the JSON constructor
			this._bHeightInItems = false; // decides whether the height is set as CSS size (height is in height property then) or in multiples of an item height (height is in this._iVisibleItems then)
			this._iVisibleItems = -1;     // initially -1, this subsequently must be the number of items that are visible without scrolling; the value is either set directly if the height is given in items, or calculated in onAfterRendering
		}
		this._sTotalHeight = null;    // if height is set in items, this contains the
		if (ListBox._fItemHeight === undefined) {
			ListBox._fItemHeight = -1;
		}
		if (ListBox._iBordersAndStuff === undefined) {
			ListBox._iBordersAndStuff = -1;
		}

		this._aSelectionMap = [];
		this._iLastDirectlySelectedIndex = -1;

		//FIXME Mapping from activeItems index to the id of it for item navigation purposes
		this._aActiveItems = null;
	};


	/**
	 * Re-initializes the ListBox, so all sizes are fine after a theme switch
	 * @private
	 */
	ListBox.prototype.onThemeChanged = function () {
		ListBox._fItemHeight = -1;
		ListBox._iBordersAndStuff = -1;
		this._sTotalHeight = null;
		if (!this._bHeightInItems) {
			this._iVisibleItems = -1; // re-calculation only required for ItemNavigation - shouldn't change when explicitly set
		}
		this._skipStoreScrollTop = true; // Skip remembering the scrolltop in next onBeforeRendering due to theme change
		if (this.getDomRef()) {
			this.invalidate();
		}
	};


	/**
	 * Called before rendering. Required for storing the scroll position.
	 * @private
	 */
	ListBox.prototype.onBeforeRendering = function () {
		if (this._skipStoreScrollTop) {
			delete this._skipStoreScrollTop;
			return;
		}

		this.getScrollTop(); // store current ScrollTop
		// TODO: store focus??
	};


	/**
	 * Called after rendering. Required for calculating and setting the correct heights.
	 * @private
	 */
	ListBox.prototype.onAfterRendering = function () {
		var oDomRef = this.getDomRef();

		// calculate item height
		if (ListBox._fItemHeight <= 0) { // TODO: merge with width measurement which is currently in renderer

			// create dummy ListBox with dummy item
			var oStaticArea = sap.ui.getCore().getStaticAreaRef();
			var div = document.createElement("div");
			div.id = "sap-ui-commons-ListBox-sizeDummy";
			div.innerHTML = '<div class="sapUiLbx sapUiLbxFlexWidth sapUiLbxStd"><ul><li class="sapUiLbxI"><span class="sapUiLbxITxt">&nbsp;</span></li></ul></div>';
			if (sap.ui.Device.browser.safari) {
				oStaticArea.insertBefore(div, oStaticArea.firstChild);
			} else {
				oStaticArea.appendChild(div);
			}
			var oItemDomRef = div.firstChild.firstChild.firstChild;
			ListBox._fItemHeight = oItemDomRef.offsetHeight;

			// subpixel rendering strategy in IE >= 9 can lead to the total being larger than the sum of heights
			if (!!sap.ui.Device.browser.internet_explorer && (document.documentMode == 9 || document.documentMode == 10)) { // TODO: browser version check... not good...
				var cs = document.defaultView.getComputedStyle(oItemDomRef.firstChild, "");
				var h = parseFloat(cs.getPropertyValue("height").split("px")[0]);
				if (!(typeof h === "number") || !(h > 0)) { // sometimes cs.getPropertyValue("height") seems to return "auto"
					h = jQuery(oItemDomRef.firstChild).height();
				}
				var pt = parseFloat(cs.getPropertyValue("padding-top").split("px")[0]);
				var pb = parseFloat(cs.getPropertyValue("padding-bottom").split("px")[0]);
				var bt = parseFloat(cs.getPropertyValue("border-top-width").split("px")[0]);
				var bb = parseFloat(cs.getPropertyValue("border-bottom-width").split("px")[0]);
				ListBox._fItemHeight = h + pt + pb + bt + bb;
			}

			// remove the dummy
			oStaticArea.removeChild(div);
		}

		// calculate height of ListBox borders and padding
		if (ListBox._iBordersAndStuff == -1) {
			var $DomRef = jQuery(this.getDomRef());
			var outerHeight = $DomRef.outerHeight();
			var innerHeight = $DomRef.height();
			ListBox._iBordersAndStuff = outerHeight - innerHeight;
		}

		// Height is set in number of visible items
		if (this._bHeightInItems) {
			if (this._sTotalHeight == null) {
				//...but the height needs to be calculated first
				this._calcTotalHeight(); // TODO: verify this._sTotalHeight is > 0

				// now set height
				oDomRef.style.height = this._sTotalHeight;
			} // else height was already set in the renderer!
		}

		// find out how many items are visible because the ItemNavigation needs to know
		if (this._iVisibleItems == -1) {
			this._updatePageSize();
		}

		// Collect items for ItemNavigation   TODO: make it cleaner
		var oFocusRef = this.getFocusDomRef(),
				aRows = oFocusRef.childNodes,
				aDomRefs = [],
				aItems = this.getItems();
		this._aActiveItems = [];
		var aActiveItems = this._aActiveItems;
		for (var i = 0; i < aRows.length; i++) {
			if (!(aItems[i] instanceof sap.ui.core.SeparatorItem)) {
				aActiveItems[aDomRefs.length] = i;
				aDomRefs.push(aRows[i]);
			}
		}

		// init ItemNavigation
		if (!this.oItemNavigation) {
			var bNotInTabChain = (!this.getEnabled() || !this.getEditable());
			this.oItemNavigation = new ItemNavigation(null, null, bNotInTabChain);
			this.oItemNavigation.attachEvent(ItemNavigation.Events.AfterFocus, this._handleAfterFocus, this);
			this.addDelegate(this.oItemNavigation);
		}
		this.oItemNavigation.setRootDomRef(oFocusRef);
		this.oItemNavigation.setItemDomRefs(aDomRefs);
		this.oItemNavigation.setCycling(false);
		this.oItemNavigation.setSelectedIndex(this._getNavigationIndexForRealIndex(this.getSelectedIndex()));
		this.oItemNavigation.setPageSize(this._iVisibleItems); // Page down by number of visible items

		// Apply scrollTop


		// if scrolling to a certain item index is currently requested (but was not done because the control was not rendered before), do it now
		if (this.oScrollToIndexRequest) {
			this.scrollToIndex(this.oScrollToIndexRequest.iIndex, this.oScrollToIndexRequest.bLazy); // keep the oScrollToIndexRequest for the timeouted call
		} else {
			var scrollTop = this.getProperty("scrollTop");
			if (scrollTop > -1) {
				oDomRef.scrollTop = scrollTop;
			}
		}

		// sometimes this did not work, so repeat it after a timeout (consciously done twice, yes)
		var that = this;
		window.setTimeout(function() { // needs to be delayed because in Firefox sometimes the scrolling seems to come too early
			// if scrolling to a certain item index is currently requested (but was not done because the control was not rendered before), do it now
			if (that.oScrollToIndexRequest) {
				that.scrollToIndex(that.oScrollToIndexRequest.iIndex, that.oScrollToIndexRequest.bLazy);
				that.oScrollToIndexRequest = null;
			} else {
				var scrollTop = that.getProperty("scrollTop");
				if (scrollTop > -1) {
					oDomRef.scrollTop = scrollTop;
				}
			}
		}, 0);
	};


	/**
	 * For the given iIndex, this method calculates the index of the respective item within the ItemNavigation set.
	 * (if there are separators, the ItemNavigation does not know them)
	 * Prerequisite: the iIndex points to an element which is NOT a Separator or disabled (= it must be known to the ItemNavigation)
	 *
	 * @param {int} iIndex real index (with separators)
	 * @return {int} iNavIndex itemnavigation index (without separators)
	 * @private
	 */
	ListBox.prototype._getNavigationIndexForRealIndex = function(iIndex) {
		var aItems = this.getItems();
		var iNavIndex = iIndex;
		for (var i = 0; i < iIndex; i++) {
			if (aItems[i] instanceof sap.ui.core.SeparatorItem) {
				iNavIndex--;
			}
		}
		return iNavIndex;
	};


	/**
	 * Calculates the number of visible items.
	 * Must happen after rendering and whenever the height is changed without rerendering.
	 * @private
	 */
	ListBox.prototype._updatePageSize = function() {
		var oDomRef = this.getDomRef();
		if (oDomRef) {
			if (ListBox._fItemHeight > 0) {
				this._iVisibleItems = Math.floor(oDomRef.clientHeight / ListBox._fItemHeight);
			} // else shouldn't happen
		}
		// else: nothing to do, item navigation will be initialized after rendering
	};

	/**
	 * If the ListBox has a scroll bar because the number of items is larger than the number of visible items,
	 * this method scrolls to the item with the given index.
	 * If there are enough items, this item will then appear at the topmost visible position in the ListBox.
	 * If bLazy is true, it only scrolls as far as required to make the item visible.
	 * Setting the scrollTop property and calling scrollToIndex are two operations
	 * influencing the same "physical" property, so the last call "wins".
	 *
	 * @param {int} iIndex The index to which the ListBox should scroll.
	 * @param {boolean} bLazy
	 *         If set to true, the ListBox only scrolls if the item is not completely visible, and it scrolls for exactly the space to make it fully visible. If set to false, the item is scrolled to the top position (if possible).
	 * @return {sap.ui.commons.ListBox} <code>this</code> to allow method chaining.
	 * @public
	 */
	ListBox.prototype.scrollToIndex = function(iIndex, bLazy) {
		var oDomRef = this.getDomRef();
		if (oDomRef) { // only if already rendered
			var oItem = this.$("list").children("li[data-sap-ui-lbx-index=" + iIndex + "]");
			oItem = oItem.get(0);
			if (oItem) {
				var iScrollTop = oItem.offsetTop;
				if (!bLazy) {
					// scroll there without any conditions
					this.setScrollTop(iScrollTop);
				} else {
					// "lazy" means we should only scroll if required and as far as required
					var iCurrentScrollTop = oDomRef.scrollTop;
					var iViewPortHeight = jQuery(oDomRef).height();
					if (iCurrentScrollTop >= iScrollTop) {
						// if we have to scroll up, the behavior is fine already
						this.setScrollTop(iScrollTop);
					} else if ((iScrollTop + ListBox._fItemHeight) > (iCurrentScrollTop + iViewPortHeight)) { // bottom Edge of item > bottom edge of viewport
						// the item is - at least partly - below the current viewport of the ListBox, so scroll down. But only as far as required
						this.setScrollTop(Math.ceil(iScrollTop + ListBox._fItemHeight - iViewPortHeight)); // round because of _fItemHeight
					} // else if the item is already fully visible, do nothing
				}
			}
			// store the actual position
			this.getScrollTop();
		} else {
			// control not yet rendered, thus item height is unknown, so remember request for after rendering
			this.oScrollToIndexRequest = {iIndex:iIndex,bLazy:bLazy};
		}
		return this;
	};

	/**
	 * Returns the number of visible items.
	 * @return {int} Number of visible items.
	 * @public
	 */
	ListBox.prototype.getVisibleItems = function() {
		return this._iVisibleItems;
	};

	/**
	 * Makes the ListBox render with a height that allows it to display exactly the given number of items.
	 *
	 * @param {int} iItemCount The number of items that should fit into the ListBox without scrolling.
	 * @return {sap.ui.commons.ListBox} <code>this</code> to allow method chaining.
	 * @public
	 */
	ListBox.prototype.setVisibleItems = function(iItemCount) {
	 /*
		*For the calculation, the size of the first item is used; if no item is present, an invisible dummy item
		* is rendered and instantly removed again.
		* Therefore, this method will not work for items with different heights and if actual items have a different
		* size than generic empty dummy items.
		*/
		// TODO: prevent values less than 1, or make them go back to CSS heights
		this.setProperty("visibleItems", iItemCount, true);

		this._iVisibleItems = iItemCount;
		if (iItemCount < 0) {
			this._bHeightInItems = false;
		} else {
			this._bHeightInItems = true;
		}

		// the actual height to set must be calculated now or later
		this._sTotalHeight = null;

		// if already rendered, calculate and set the height
		var oDomRef = this.getDomRef();
		if (oDomRef) {
			if (this._bHeightInItems) {
				var oFirstItem = oDomRef.firstChild ? oDomRef.firstChild.firstChild : null;
				if (oFirstItem || ((ListBox._fItemHeight > 0) && (ListBox._iBordersAndStuff > 0))) {
					oDomRef.style.height = this._calcTotalHeight();
				} else {
					// already rendered, but no dummy item!
					this.invalidate();
				}
			} else {
				oDomRef.style.height = this.getHeight();
				this._updatePageSize();
				if (this.oItemNavigation) {
					this.oItemNavigation.setPageSize(this._iVisibleItems); // Page down by number of visible items
				}
			}
		}

		//if (this._sTotalHeight == null) { // this is the "else" clause covering all cases where the height was not set above
			// called before rendering, so the calculation and setting of the actual CSS height to set must be done later
		//}

		return this;
	};


	/**
	 * Calculates the outer height of the ListBox from the known item height and number of items that should fit.
	 * The result (a CSS size string) is returned as well as assigned to this._sTotalHeight.
	 * Precondition: the control is rendered, this._iVisibleItems, sap.ui.commons.ListBox._iBordersAndStuff and
	 * sap.ui.commons.ListBox._fItemHeight are initialized.
	 *
	 * @returns {string} the required outer height as CSS size
	 * @private
	 */
	ListBox.prototype._calcTotalHeight = function() {
		// TODO: check preconditions
		var desiredHeight = this._iVisibleItems * ListBox._fItemHeight;
		this._sTotalHeight = (desiredHeight + ListBox._iBordersAndStuff) + "px";
		return this._sTotalHeight;
	};


	/**
	 * Sets the height of this ListBox in CSS units.
	 *
	 * @param {sap.ui.core.CSSSize} sHeight New height for the ListBox.
	 * @return {sap.ui.commons.ListBox} <code>this</code> to allow method chaining.
	 * @public
	 */
	ListBox.prototype.setHeight = function(sHeight) {
		this.validateProperty("height", sHeight);
		if (this.getHeight() === sHeight) {
			return this;
		}

		this._bHeightInItems = false;
		this._iVisibleItems = -1;
		var oDomRef = this.getDomRef();

		if (oDomRef) {
			oDomRef.style.height = sHeight;
			this._updatePageSize();
			if (this.oItemNavigation) {
				this.oItemNavigation.setPageSize(this._iVisibleItems); // Page down by number of visible items
			}
		}

		return this.setProperty("height", sHeight, true); // no re-rendering
	};

	/**
	 * Sets the width of this ListBox in CSS units.
	 *
	 * @param {sap.ui.core.CSSSize} sWidth New width for the ListBox.
	 * @return {sap.ui.commons.ListBox} <code>this</code> to allow method chaining.
	 * @public
	 */
	ListBox.prototype.setWidth = function(sWidth) {
		var oDomRef = this.getDomRef();
		if (oDomRef) {
			oDomRef.style.width = sWidth;
		}
		this.setProperty("width", sWidth, true); // no re-rendering
		return this;
	};

	/**
	 * Positions the ListBox contents so that they are scrolled-down by the given number of pixels.
	 *
	 * @param {int} iScrollTop Vertical scroll position in pixels.
	 * @return {sap.ui.commons.ListBox} <code>this</code> to allow method chaining.
	 * @public
	 */
	ListBox.prototype.setScrollTop = function (iScrollTop) {
		iScrollTop = Math.round(iScrollTop);
		var scrollDomRef = this.getDomRef();
		this.oScrollToIndexRequest = null; // delete any pending scroll request
		if (scrollDomRef) {
			scrollDomRef.scrollTop = iScrollTop;
		}
		this.setProperty("scrollTop", iScrollTop, true); // no rerendering
		return this;
	};

	/**
	 * Returns how many pixels the ListBox contents are currently scrolled down.
	 *
	 * @return {int} Vertical scroll position.
	 * @public
	 */
	ListBox.prototype.getScrollTop = function () {
		var scrollDomRef = this.getDomRef();
		if (scrollDomRef) {
			var scrollTop = Math.round(scrollDomRef.scrollTop);
			this.setProperty("scrollTop", scrollTop, true);
			return scrollTop;
		} else {
			return this.getProperty("scrollTop");
		}
	};



	/* --- user interaction handling methods --- */

	ListBox.prototype.onmousedown = function(oEvent) {
		if (!!sap.ui.Device.browser.webkit && oEvent.target && oEvent.target.id === this.getId()) { // ListBox scrollbar has been clicked; webkit completely removes the focus, which breaks autoclose popups
			var idToFocus = document.activeElement ? document.activeElement.id : this.getId();
			var that = this;
			window.setTimeout(function(){
				var scrollPos = that.getDomRef().scrollTop; // yes, this scrollPosition is the right one to use. The one before setTimeout works for the scrollbar grip, but not for the arrows
				jQuery.sap.focus(jQuery.sap.domById(idToFocus)); // re-set the focus
				that.getDomRef().scrollTop = scrollPos; // re-apply the scroll position (otherwise the focus() call would scroll the focused element into view)
			},0);
		}
	};

	ListBox.prototype.onclick = function (oEvent) {
		this._handleUserActivation(oEvent);
	};

	ListBox.prototype.onsapspace = function (oEvent) {
		this._handleUserActivation(oEvent);
	};

	/*
	 * Ensure the sapspace event with modifiers is also handled as well as the respective "enter" events
	 */

	ListBox.prototype.onsapspacemodifiers = ListBox.prototype.onsapspace;
	ListBox.prototype.onsapenter = ListBox.prototype.onsapspace;
	ListBox.prototype.onsapentermodifiers = ListBox.prototype.onsapspace;

	/**
	 * Internal method invoked when the user activates an item.
	 * Differentiates and dispatches according to modifier key and current selection.
	 * @param {jQuery.Event} oEvent jQuery Event
	 * @private
	 */
	ListBox.prototype._handleUserActivation = function (oEvent) {
		if (!this.getEnabled() || !this.getEditable()) {
			return;
		}

		var oSource = oEvent.target;
		if (oSource.id === "" || jQuery.sap.endsWith(oSource.id, "-txt")) {
			oSource = oSource.parentNode;
			if (oSource.id === "") { // could be the image inside the first cell
				oSource = oSource.parentNode;
			}
		}
		var attr = jQuery(oSource).attr("data-sap-ui-lbx-index");
		if (typeof attr == "string" && attr.length > 0) {
			var iIndex = parseInt(attr, 10); // Get the selected index from the HTML

			var aItems = this.getItems();
			var oItem = aItems[iIndex]; // oItem could be a separator, though!

			// It could be the case that the list of items changed during the click event handling. Ensure the item is still the one in
			if (aItems.length <= iIndex) {  // TODO: very questionable! Why set the index to the last position? And why allow removing items during the processing?  Remove!
				iIndex = aItems.length - 1;
			}

			if (iIndex >= 0 && iIndex < aItems.length) { // TODO: this should be known by now
				if (oItem.getEnabled() && !(oItem instanceof sap.ui.core.SeparatorItem)) {
					// Take care of selection and select event
					if (oEvent.ctrlKey || oEvent.metaKey) { // = CTRL
							this._handleUserActivationCtrl(iIndex, oItem);
					} else  if (oEvent.shiftKey) {
						this.setSelectedIndices(this._getUserSelectionRange(iIndex));
						this.fireSelect({
							id:this.getId(),
							selectedIndex:iIndex,
							selectedIndices:this.getSelectedIndices(), /* NEW (do not use hungarian prefixes!) */
							selectedItem:oItem,
							sId:this.getId(),
							aSelectedIndices:this.getSelectedIndices() /* OLD */
						});
						this._iLastDirectlySelectedIndex = iIndex;
					} else {
						this._handleUserActivationPlain(iIndex, oItem);
					}
				}
			}
			oEvent.preventDefault();
			oEvent.stopPropagation();
		}
	};

	/**
	 * Called when the user triggers an item without holding a modifier key.
	 * Changes the selection in the expected way.
	 *
	 * @param {int} iIndex index that should be selected
	 * @param {sap.ui.core.Item} oItem item that should be selected
	 * @private
	 */
	ListBox.prototype._handleUserActivationPlain = function (iIndex, oItem) {
		this._iLastDirectlySelectedIndex = iIndex;
		this.oItemNavigation.setSelectedIndex(this._getNavigationIndexForRealIndex(iIndex));
		if (this.getSelectedIndex() != iIndex || this.getSelectedIndices().length > 1) {
			this.setSelectedIndex(iIndex); // Replace selection

			this.fireSelect({
				id:this.getId(),
				selectedIndex:iIndex,
				selectedIndices:this.getSelectedIndices(), /* NEW (do not use hungarian prefixes!) */
				selectedItem:oItem,
				sId:this.getId(),
				aSelectedIndices:this.getSelectedIndices() /* OLD */
			});
		}
	};

	/**
	 * Called when the user triggers an item while pressing the Ctrl key.
	 * Changes the selection in the expected way for the "Ctrl" case.
	 *
	 * @param {int} iIndex index that should be selected
	 * @param {sap.ui.core.Item} oItem item that should be selected
	 * @private
	 */
	ListBox.prototype._handleUserActivationCtrl = function (iIndex, oItem) {
		this._iLastDirectlySelectedIndex = iIndex;
		this.oItemNavigation.setSelectedIndex(this._getNavigationIndexForRealIndex(iIndex));
		if (this.isIndexSelected(iIndex)) {
			this.removeSelectedIndex(iIndex); // Remove from multi-selection
		} else {
			this.addSelectedIndex(iIndex); // Add to multi-selection
		}

		this.fireSelect({
			id:this.getId(),
			selectedIndex:iIndex,
			selectedIndices:this.getSelectedIndices(), /* NEW (do not use hungarian prefixes!) */
			selectedItem:oItem,
			sId:this.getId(),
			aSelectedIndices:this.getSelectedIndices() /* OLD */
		});
	};

	/**
	 * Calculates the list of indices ranging from the previously selected item to the
	 * given index. Used internally for calculating the new selection range when the user holds the "shift" key
	 * while clicking in the ListBox.
	 *
	 * @param {int} iIndex index of selection end
	 * @returns {int[]} Indices of user selection range
	 * @private
	 */
	ListBox.prototype._getUserSelectionRange = function (iIndex) {
		if (this._iLastDirectlySelectedIndex == -1) {
			// TODO: Use focus and continue execution
			return [];
		}

		var aItems = this.getItems();
		var aRange = [];
		var i;
		if (this._iLastDirectlySelectedIndex <= iIndex) {
			for (i = this._iLastDirectlySelectedIndex; i <= iIndex; i++) {
				if ((i > -1) && (aItems[i].getEnabled() && !(aItems[i] instanceof sap.ui.core.SeparatorItem))) {
					aRange.push(i);
				}
			}
		} else {
			for (i = iIndex; i <= this._iLastDirectlySelectedIndex; i++) {
				if ((i > -1) && (aItems[i].getEnabled() && !(aItems[i] instanceof sap.ui.core.SeparatorItem))) {
					aRange.push(i);
				}
			}
		}
		return aRange;
	};



	/* --- Overwritten setters and getters affecting the selection --- */


	/**
	 * Zero-based index of selected item. Index value for no selection is -1.
	 * When multiple selection is enabled and multiple items are selected,
	 * the method returns the first selected item.
	 *
	 * @return {int} Selected index
	 * @public
	 */
	ListBox.prototype.getSelectedIndex = function() {
		for (var i = 0; i < this._aSelectionMap.length; i++) {
			if (this._aSelectionMap[i]) {
				return i;
			}
		}
		return -1;
	};


	/**
	 * Sets the zero-based index of the currently selected item.
	 *This method removes any previous selections. When the given index is invalid, the call is ignored.
	 *
	 * @param {int} iSelectedIndex Index to be selected.
	 * @return {sap.ui.commons.ListBox} <code>this</code> to allow method chaining.
	 * @public
	 */
	ListBox.prototype.setSelectedIndex = function(iSelectedIndex) {
		if ((iSelectedIndex < -1) || (iSelectedIndex > this._aSelectionMap.length - 1)) {
			return this;
		} // Invalid index

		// do not select a disabled or separator item
		var aItems = this.getItems();
		if ((iSelectedIndex > -1) && (!aItems[iSelectedIndex].getEnabled() || (aItems[iSelectedIndex] instanceof sap.ui.core.SeparatorItem))) {
			return this;
		}

		for (var i = 0; i < this._aSelectionMap.length; i++) {
			this._aSelectionMap[i] = false;
		}
		this._aSelectionMap[iSelectedIndex] = true;
		// And inform the itemNavigation about this, too
		if (this.oItemNavigation) {
			this.oItemNavigation.setSelectedIndex(this._getNavigationIndexForRealIndex(iSelectedIndex));
		}
		this.getRenderer().handleSelectionChanged(this);

		return this;
	};


	/**
	 * Adds the given index to current selection.
	 * When multiple selection is disabled, this replaces the current selection.
	 * When the given index is invalid, the call is ignored.
	 *
	 * @param {int} iSelectedIndex Index to add to selection..
	 * @return {sap.ui.commons.ListBox} <code>this</code> to allow method chaining.
	 * @public
	 */
	ListBox.prototype.addSelectedIndex = function(iSelectedIndex) {
		if (!this.getAllowMultiSelect()) { // If multi-selection is not allowed, this call equals setSelectedIndex
			this.setSelectedIndex(iSelectedIndex);
		}

		// Multi-selectable case
		if ((iSelectedIndex < -1) || (iSelectedIndex > this._aSelectionMap.length - 1)) {
			return this;
		} // Invalid index

		// do not select a disabled or separator item
		var aItems = this.getItems();
		if ((iSelectedIndex > -1) && (!aItems[iSelectedIndex].getEnabled() || (aItems[iSelectedIndex] instanceof sap.ui.core.SeparatorItem))) {
			return this;
		}

		if (this._aSelectionMap[iSelectedIndex]) {
			return this;
		} // Selection does not change

		// Was not selected before
		this._aSelectionMap[iSelectedIndex] = true;
		this.getRenderer().handleSelectionChanged(this);

		return this;
	};


	/**
	 * Removes the given index from this selection. When the index is invalid or not selected, the call is ignored.
	 *
	 * @param {int} iIndex Index that shall be removed from selection.
	 * @return {sap.ui.commons.ListBox} <code>this</code> to allow method chaining.
	 * @public
	 */
	ListBox.prototype.removeSelectedIndex = function(iIndex) {
		if ((iIndex < 0) || (iIndex > this._aSelectionMap.length - 1)) {
			return this;
		} // Invalid index

		if (!this._aSelectionMap[iIndex]) {
			return this;
		} // Selection does not change

		// Was selected before
		this._aSelectionMap[iIndex] = false;
		this.getRenderer().handleSelectionChanged(this);

		return this;
	};


	/**
	 * Removes complete selection.
	 *
	 * @return {sap.ui.commons.ListBox} <code>this</code> to allow method chaining.
	 * @public
	 */
	ListBox.prototype.clearSelection = function() {
		for (var i = 0; i < this._aSelectionMap.length; i++) {
			if (this._aSelectionMap[i]) {
				this._aSelectionMap[i] = false;
			}
		}
		// More or less re-initialized
		this._iLastDirectlySelectedIndex = -1;
		// Reset the index also in ItemNavigation
		if (this.oItemNavigation) {
			this.oItemNavigation.setSelectedIndex( -1);
		}
		this.getRenderer().handleSelectionChanged(this);

		return this;
	};




	/**
	 * Zero-based indices of selected items, wrapped in an array. An empty array means "no selection".
	 *
	 * @return {int[]} Array of selected indices.
	 * @public
	 */
	ListBox.prototype.getSelectedIndices = function() {
		var aResult = [];
		for (var i = 0; i < this._aSelectionMap.length; i++) {
			if (this._aSelectionMap[i]) {
				aResult.push(i);
			}
		}
		return aResult;
	};


	/**
	 * Zero-based indices of selected items, wrapped in an array. An empty array means "no selection".
	 * When multiple selection is disabled and multiple items are given,
	 * the selection is set to the index of the first valid index in the given array.
	 * Any invalid indices are ignored.
	 * The previous selection is in any case replaced.
	 *
	 * @param {int[]} aSelectedIndices Indices of the items to be selected.
	 * @return {sap.ui.commons.ListBox} <code>this</code> to allow method chaining.
	 * @public
	 */
	ListBox.prototype.setSelectedIndices = function(aSelectedIndices) {
		var indicesToSet = [];
		var aItems = this.getItems();
		var i;
		for (i = 0; i < aSelectedIndices.length; i++) {
			if ((aSelectedIndices[i] > -1) && (aSelectedIndices[i] < this._aSelectionMap.length)) {
				if (aItems[aSelectedIndices[i]].getEnabled() && !(aItems[aSelectedIndices[i]] instanceof sap.ui.core.SeparatorItem)) {
					indicesToSet.push(aSelectedIndices[i]);
				}
			}
		}

		if (indicesToSet.length > 0) { // TODO: Disable event listening to items??
			// With multi-selection disabled, use the first valid index only
			if (!this.getAllowMultiSelect()) {
				indicesToSet = [indicesToSet[0]];
			}
		}

		for (i = 0; i < this._aSelectionMap.length; i++) {
			this._aSelectionMap[i] = false;
		}

		// O(n+m)
		for (i = 0; i < indicesToSet.length; i++) {
			this._aSelectionMap[indicesToSet[i]] = true;
		}
		this.getRenderer().handleSelectionChanged(this);

		return this;
	};


	/**
	 * Adds the given indices to selection. Any invalid indices are ignored.
	 *
	 * @param {int[]} aSelectedIndices Indices of the items that shall additionally be selected.
	 * @return {sap.ui.commons.ListBox} <code>this</code> to allow method chaining.
	 * @public
	 */
	ListBox.prototype.addSelectedIndices = function(aSelectedIndices) {
		var indicesToSet = [];
		var aItems = this.getItems();
		var i;
		for (i = 0; i < aSelectedIndices.length; i++) {
			if ((aSelectedIndices[i] > -1) && (aSelectedIndices[i] < this._aSelectionMap.length)) {
				// do not select a disabled or separator item
				if (aItems[aSelectedIndices[i]].getEnabled() && !(aItems[aSelectedIndices[i]] instanceof sap.ui.core.SeparatorItem)) {
					indicesToSet.push(aSelectedIndices[i]);
				}
			}
		}

		if (indicesToSet.length > 0) { // TODO: Disable event listening to items??
			// With multi-selection disabled, use the first valid index only
			if (!this.getAllowMultiSelect()) {
				indicesToSet = [indicesToSet[0]];
			}

			// O(n+m)
			for (i = 0; i < indicesToSet.length; i++) {
				this._aSelectionMap[indicesToSet[i]] = true;
			}
			this.getRenderer().handleSelectionChanged(this);
		}
		return this;
	};



	/**
	 * Returns whether the given index is selected.
	 *
	 * @param {int} iIndex Index which is checked for selection state.
	 * @return {boolean} Whether index is selected.
	 * @public
	 */
	ListBox.prototype.isIndexSelected = function(iIndex) {
		if ((iIndex < -1) || (iIndex > this._aSelectionMap.length - 1)) {
			return false; // Invalid index -> not selected
		}

		return this._aSelectionMap[iIndex];
	};



	/**
	 * Keys of the items to be selected, wrapped in an array. An empty array means no selection.
	 * When multiple selection is disabled, and multiple keys are given,
	 * the selection is set to the item with the first valid key in the given array.
	 * Any invalid keys are ignored.
	 * The previous selection is replaced in any case.
	 *
	 * @param {string[]} aSelectedKeys The keys of the items to be selected.
	 * @return {sap.ui.commons.ListBox} <code>this</code> to allow method chaining.
	 * @public
	 */
	ListBox.prototype.setSelectedKeys = function(aSelectedKeys) {
		var aItems = this.getItems();

		var mKeyMap = {};
		for (var i = 0; i < aSelectedKeys.length; i++) { // put the keys into a map to hopefully search faster below
			mKeyMap[aSelectedKeys[i]] = true;
		}

		var aIndices = [];
		for (var j = 0; j < aItems.length; j++) {
			if (mKeyMap[aItems[j].getKey()]) {
				aIndices.push(j);
			}
		}

		return this.setSelectedIndices(aIndices);
	};


	/**
	 * Returns the keys of the selected items in an array.
	 * If a selected item does not have a key, the respective array entry will be undefined.
	 *
	 * @return {string[]} Array with selected keys.
	 * @public
	 */
	ListBox.prototype.getSelectedKeys = function() {
		var aItems = this.getItems();
		var aResult = [];
		for (var i = 0; i < this._aSelectionMap.length; i++) {
			if (this._aSelectionMap[i]) {
				aResult.push(aItems[i].getKey());
			}
		}
		return aResult;
	};



	/**
	 * Returns selected item. When no item is selected, "null" is returned.
	 * When multi-selection is enabled and multiple items are selected, only the first selected item is returned.
	 *
	 * @return {sap.ui.core.Item} Selected item
	 * @public
	 */
	ListBox.prototype.getSelectedItem = function() {
		var iIndex = this.getSelectedIndex();
		if ((iIndex < 0) || (iIndex >= this._aSelectionMap.length)) {
			return null;
		}
		return this.getItems()[iIndex];
	};


	/**
	 * Returns an array containing the selected items. In the case of no selection, an empty array is returned.
	 *
	 * @return {sap.ui.core.Item[]} Selected items.
	 * @public
	 */
	ListBox.prototype.getSelectedItems = function() {
		var aItems = this.getItems();
		var aResult = [];
		for (var i = 0; i < this._aSelectionMap.length; i++) {
			if (this._aSelectionMap[i]) {
				aResult.push(aItems[i]);
			}
		}
		return aResult;
	};

	ListBox.prototype.setAllowMultiSelect = function(bAllowMultiSelect) {
		this.setProperty("allowMultiSelect", bAllowMultiSelect);
		var oneWasSelected = false;
		var twoWereSelected = false;
		if (!bAllowMultiSelect && this._aSelectionMap) {
			for (var i = 0; i < this._aSelectionMap.length; i++) {
				if (this._aSelectionMap[i]) {
					if (!oneWasSelected) {
						oneWasSelected = true;
					} else {
						this._aSelectionMap[i] = false;
						twoWereSelected = true;
					}
				}
			}
		}
		if (twoWereSelected) {
			this.getRenderer().handleSelectionChanged(this);
		}
		return this;
	};


	/**
	 * Handles the event that gets fired by the {@link sap.ui.core.delegate.ItemNavigation} delegate.
	 *
	 * @param {sap.ui.base.Event} oControlEvent The event that gets fired by the {@link sap.ui.core.delegate.ItemNavigation} delegate.
	 * @private
	 */
	ListBox.prototype._handleAfterFocus = function(oControlEvent) {
		var iIndex = oControlEvent.getParameter("index");
		iIndex = ((iIndex !== undefined && iIndex >= 0) ? this._aActiveItems[iIndex] : 0);

		this.getRenderer().handleARIAActivedescendant(this, iIndex);
	};

	/* --- "items" aggregation methods, overwritten to update _aSelectionMap and allow filteredItems --- */

	/*
	 * Implementation of API method setItems.
	 * Semantically belonging to "items" aggregation but not part of generated method set.
	 * @param bNoItemsChanged not in official API, only needed in DropdownBox TypeAhead
	 */

	/**
	 * Allows setting the list items as array for this instance of ListBox.
	 *
	 * @param {sap.ui.core.ListItem[]} aItems The items to set for this ListBox.
	 * @param {boolean} bDestroyItems Optional boolean parameter to indicate that the formerly set items should be destroyed, instead of just removed.
	 * @return {sap.ui.commons.ListBox} <code>this</code> to allow method chaining.
	 * @public
	 */
	ListBox.prototype.setItems = function(aItems, bDestroyItems, bNoItemsChanged) {
		this._bNoItemsChangeEvent = true;
		if (bDestroyItems) {
			this.destroyItems();
		} else {
			this.removeAllItems();
		}
		for (var i = 0, l = aItems.length; i < l; i++) {
			this.addItem(aItems[i]);
		}
		this._bNoItemsChangeEvent = undefined;
		if (!bNoItemsChanged) {
			this.fireEvent("itemsChanged", {event: "setItems", items: aItems}); //private event used in DropdownBox
		}
		return this;
	};

	ListBox.prototype.addItem = function(oItem) {
		this._bNoItemInvalidateEvent = true;
		this.addAggregation("items", oItem);
		this._bNoItemInvalidateEvent = false;
		if ( !this._aSelectionMap ) {
			this._aSelectionMap = [];
		}
		this._aSelectionMap.push(false);

		if (!this._bNoItemsChangeEvent) {
			this.fireEvent("itemsChanged", {event: "addItem", item: oItem}); //private event used in DropdownBox
		}

		oItem.attachEvent("_change", this._handleItemChanged, this);

		return this;
	};

	ListBox.prototype.insertItem = function(oItem, iIndex) {
		if ((iIndex < 0) || (iIndex > this._aSelectionMap.length)) {
			return this;
		} // Ignore invalid index TODO:: check behavior for iIndex=length
		// TODO: Negative indices might be used to count from end of array

		this._bNoItemInvalidateEvent = true;
		this.insertAggregation("items", oItem, iIndex);
		this._bNoItemInvalidateEvent = false;
		this._aSelectionMap.splice(iIndex, 0, false);

		this.invalidate();

		if (!this._bNoItemsChangeEvent) {
			this.fireEvent("itemsChanged", {event: "insertItems", item: oItem, index: iIndex}); //private event used in DropdownBox
		}

		oItem.attachEvent("_change", this._handleItemChanged, this);

		return this;
	};

	ListBox.prototype.removeItem = function(vElement) {
		var iIndex = vElement;
		if (typeof (vElement) == "string") { // ID of the element is given
			vElement = sap.ui.getCore().byId(vElement);
		}
		if (typeof (vElement) == "object") { // the element itself is given or has just been retrieved
			iIndex = this.indexOfItem(vElement);
		}

		if ((iIndex < 0) || (iIndex > this._aSelectionMap.length - 1)) {
			if (!this._bNoItemsChangeEvent) {
				this.fireEvent("itemsChanged", {event: "removeItem", item: vElement}); //private event used in DropdownBox
			}
			return undefined;
		} // Ignore invalid index

		this._bNoItemInvalidateEvent = true;
		var oRemoved = this.removeAggregation("items", iIndex);
		this._bNoItemInvalidateEvent = false;
		this._aSelectionMap.splice(iIndex, 1);

		this.invalidate();

		if (!this._bNoItemsChangeEvent) {
			this.fireEvent("itemsChanged", {event: "removeItem", item: oRemoved}); //private event used in DropdownBox
		}

		oRemoved.detachEvent("_change", this._handleItemChanged, this);

		return oRemoved;
	};

	ListBox.prototype.removeAllItems = function() {
		this._bNoItemInvalidateEvent = true;
		var oRemoved = this.removeAllAggregation("items");
		this._bNoItemInvalidateEvent = false;

		this._aSelectionMap = [];

		this.invalidate();

		if (!this._bNoItemsChangeEvent) {
			this.fireEvent("itemsChanged", {event: "removeAllItems"}); //private event used in DropdownBox
		}

		for ( var i = 0; i < oRemoved.length; i++) {
			oRemoved[i].detachEvent("_change", this._handleItemChanged, this);
		}

		return oRemoved;
	};

	ListBox.prototype.destroyItems = function() {

		var aItems = this.getItems();
		for ( var i = 0; i < aItems.length; i++) {
			aItems[i].detachEvent("_change", this._handleItemChanged, this);
		}

		this._bNoItemInvalidateEvent = true;
		var destroyed = this.destroyAggregation("items");
		this._bNoItemInvalidateEvent = false;

		this._aSelectionMap = [];

		this.invalidate();

		if (!this._bNoItemsChangeEvent) {
			this.fireEvent("itemsChanged", {event: "destroyItems"}); //private event used in DropdownBox
		}

		return destroyed;
	};

	ListBox.prototype.updateItems = function(){

		this._bNoItemsChangeEvent = true;  // is cleared in _itemsChangedAfterUpdateafter all changes are done

		// only new and removed items will be updated here.
		// If items are "reused" they only change their properies
		this.updateAggregation("items");

		this._bNoItemInvalidateEvent = true;
		// fire change event asynchrounusly to be sure all binding update is done
		if (!this._bItemsChangedAfterUpdate) {
			this._bItemsChangedAfterUpdate = jQuery.sap.delayedCall(0, this, "_itemsChangedAfterUpdate");
		}

	};

	ListBox.prototype._itemsChangedAfterUpdate = function(){

		this._bNoItemsChangeEvent = undefined;
		this._bItemsChangedAfterUpdate = undefined;
		this._bNoItemInvalidateEvent = undefined;

		this.fireEvent("itemsChanged", {event: "updateItems"}); //private event used in DropdownBox

	};

	/**
	 * Does all the cleanup when the ListBox is to be destroyed.
	 * Called from the element's destroy() method.
	 * @private
	 */
	ListBox.prototype.exit = function (){
		if (this.oItemNavigation) {
			this.removeDelegate(this.oItemNavigation);
			this.oItemNavigation.destroy();
			delete this.oItemNavigation;
		}

		if (this._bItemsChangedAfterUpdate) {
			jQuery.sap.clearDelayedCall(this._bItemsChangedAfterUpdate);
			this._bItemsChangedAfterUpdate = undefined;
			this._bNoItemsChangeEvent = undefined;
			this._bNoItemInvalidateEvent = undefined;
		}
		// No super.exit() to call
	};

	/*
	 * Overrides getFocusDomRef of base element class.
	 * @public
	 */
	ListBox.prototype.getFocusDomRef = function() {
		return this.getDomRef("list");
	};

	/*
	 * Overwrites default implementation
	 * the label must point to the UL element
	 * @public
	 */
	ListBox.prototype.getIdForLabel = function () {
		return this.getId() + '-list';
	};

	/*
	 * inform ComboBox if an item has changed
	*/
	ListBox.prototype._handleItemChanged = function(oEvent) {

		if (!this._bNoItemInvalidateEvent) {
			this.fireEvent("itemInvalidated", {item: oEvent.oSource}); //private event used in ComboBox
		}

	};

	return ListBox;

}, /* bExport= */ true);
