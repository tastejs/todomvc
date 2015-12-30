/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.m.IconTabHeader.
sap.ui.define(['jquery.sap.global', './library', 'sap/ui/core/Control', 'sap/ui/core/EnabledPropagator', 'sap/ui/core/delegate/ItemNavigation', 'sap/ui/core/IconPool'],
	function(jQuery, library, Control, EnabledPropagator, ItemNavigation, IconPool) {
	"use strict";

	/**
	 * Constructor for a new IconTabHeader.
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * This control displays a number of IconTabFilters and IconTabSeparators. If the available horizontal
	 * space is exceeded, a horizontal scrolling appears.
	 * @extends sap.ui.core.Control
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @alias sap.m.IconTabHeader
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var IconTabHeader = Control.extend("sap.m.IconTabHeader", /** @lends sap.m.IconTabHeader.prototype */ { metadata : {

		library : "sap.m",
		properties : {

			/**
			 * Defines whether the current selection is visualized.
			 * @deprecated As of 1.15.0.
			 * Regarding to changes of this control this property is not needed anymore.
			 */
			showSelection : {type : "boolean", group : "Misc", defaultValue : true, deprecated: true},

			/**
			 * Key of the selected item.
			 *
			 * If the key has no corresponding aggregated item, no changes will apply.
			 * If duplicate keys exists the first item matching, the key is used.
			 * @since 1.15.0
			 */
			selectedKey : {type : "string", group : "Data", defaultValue : null},

			/**
			 * Specifies whether the control is rendered.
			 * @since 1.15.0
			 */
			visible : {type : "boolean", group : "Behavior", defaultValue : true}
		},
		aggregations : {

			/**
			 * The items displayed in the IconTabHeader.
			 */
			items : {type : "sap.m.IconTab", multiple : true, singularName : "item"}
		},
		events : {

			/**
			 * Fires when an item is selected.
			 */
			select : {
				parameters : {

					/**
					 * The selected item
					 * @since 1.15.0
					 */
					item : {type : "sap.m.IconTabFilter"},

					/**
					 * The key of the selected item
					 * @since 1.15.0
					 */
					key : {type : "string"}
				}
			}
		}
	}});

	EnabledPropagator.apply(IconTabHeader.prototype, [true]);

	IconTabHeader.SCROLL_STEP = 264; // how many pixels to scroll with every overflow arrow click

	// When to create a scroll delegate:
	IconTabHeader.prototype._bDoScroll = !sap.ui.Device.system.desktop || (sap.ui.Device.os.windows && sap.ui.Device.os.version === 8);

	IconTabHeader.prototype.init = function() {
		this._bPreviousScrollForward = false; // remember the item overflow state
		this._bPreviousScrollBack = false;
		this._iCurrentScrollLeft = 0;
		this._bRtl = sap.ui.getCore().getConfiguration().getRTL();

		this.startScrollX = 0;
		this.startTouchX = 0;
		this._scrollable = null;

		this._aTabKeys = [];

		// Initialize the ItemNavigation
		this._oItemNavigation = new ItemNavigation().setCycling(false);
		this._oItemNavigation.attachEvent(ItemNavigation.Events.FocusLeave, this._onItemNavigationFocusLeave, this);
		this._oItemNavigation.attachEvent(ItemNavigation.Events.AfterFocus, this._onItemNavigationAfterFocus, this);
		this.addDelegate(this._oItemNavigation);

		if (this._bDoScroll) {
			jQuery.sap.require("sap.ui.core.delegate.ScrollEnablement");
			this._oScroller = new sap.ui.core.delegate.ScrollEnablement(this, this.getId() + "-head", {
				horizontal: true,
				vertical: false,
				nonTouchScrolling: true
			});
		}

	};

	IconTabHeader.prototype._onItemNavigationFocusLeave = function() {

		// BCP: 1570034646
		if (!this.oSelectedItem) {
			return;
		}

		var aItems = this.getItems();
		var iIndex = -1;
		var oItem;

		for (var i = 0; i < aItems.length; i++) {
			oItem = aItems[i];

			if (oItem instanceof sap.m.IconTabFilter == false) {
				continue;
			}

			iIndex++;

			if (this.oSelectedItem == oItem) {
				break;
			}
		}

		this._oItemNavigation.setFocusedIndex(iIndex);
	};

	/**
	 * Adjusts arrows when keyboard is used for navigation and the beginning/end of the toolbar is reached.
	 * @private
	 */
	IconTabHeader.prototype._onItemNavigationAfterFocus = function(oEvent) {
		var oHead = this.getDomRef("head"),
			oIndex = oEvent.getParameter("index"),
			$event = oEvent.getParameter('event');

		// handle only keyboard navigation here
		if ($event.keyCode === undefined) {
			return;
		}

		this._iCurrentScrollLeft = oHead.scrollLeft;

		this._checkOverflow();

		if (oIndex !== null && oIndex !== undefined) {
			this._scrollIntoView(this.getTabFilters()[oIndex], 0);
		}
	};

	/**
	 * Returns all tab filters, without the tab separators.
	 * @private
	 */
	IconTabHeader.prototype.getTabFilters = function() {

		var aItems = this.getItems();
		var aTabFilters = [];

		aItems.forEach(function(oItem) {
			if (oItem instanceof sap.m.IconTabFilter) {
				aTabFilters.push(oItem);
			}
		});

		return aTabFilters;
	};

	IconTabHeader.prototype.exit = function() {
		if (this._oArrowLeft) {
			this._oArrowLeft.destroy();
		}
		if (this._oArrowRight) {
			this._oArrowRight.destroy();
		}

		if (this._oItemNavigation) {
			this.removeDelegate(this._oItemNavigation);
			this._oItemNavigation.destroy();
			delete this._oItemNavigation;
		}

		if (this._oScroller) {
			this._oScroller.destroy();
			this._oScroller = null;
		}

		if (this._sResizeListenerId) {
			sap.ui.core.ResizeHandler.deregister(this._sResizeListenerId);
			this._sResizeListenerId = null;
		}
		if (this._aTabKeys) {
			this._aTabKeys = null;
		}
	};

	IconTabHeader.prototype.onBeforeRendering = function() {
		var aItems = this.getItems(),
			sSelectedKey = this.getSelectedKey(),
			i = 0;

		if (this._sResizeListenerId) {
			sap.ui.core.ResizeHandler.deregister(this._sResizeListenerId);
			this._sResizeListenerId = null;
		}

		var oParent = this.getParent();
		var bIsParentIconTabBar = oParent instanceof sap.m.IconTabBar;

		if (aItems.length > 0) {
			if (!this.oSelectedItem || sSelectedKey && sSelectedKey !== this.oSelectedItem._getNonEmptyKey()) {
				if (sSelectedKey) {
					// selected key was specified by API: set oSelectedItem to the item specified by key
					for (; i < aItems.length; i++) {
						if (!(aItems[i] instanceof sap.m.IconTabSeparator) && aItems[i]._getNonEmptyKey() === sSelectedKey) {
							this.oSelectedItem = aItems[i];
							break;
						}
					}
				}

				// no key and no item, we set the first visible item as selected if container is not explicitly set to collapsed
				if (!this.oSelectedItem &&
					(!bIsParentIconTabBar || bIsParentIconTabBar && oParent.getExpanded())) {
					for (i = 0; i < aItems.length; i++) { // tab item
						if (!(aItems[i] instanceof sap.m.IconTabSeparator) && aItems[i].getVisible()) {
							this.oSelectedItem = aItems[i];
							break;
						}
					}
				}
			}

			//in case the selected tab is not visible anymore and the content is expanded, the selected tab will change to the first visible tab
			if (this.oSelectedItem &&
				!this.oSelectedItem.getVisible() &&
				(!bIsParentIconTabBar || bIsParentIconTabBar && oParent.getExpanded())) {
				for (i = 0; i < aItems.length; i++) { // tab item
					if (!(aItems[i] instanceof sap.m.IconTabSeparator) && aItems[i].getVisible()) {
						this.oSelectedItem = aItems[i];
						break;
					}
				}
			}

			if (this.oSelectedItem) {
				this.setProperty("selectedKey", this.oSelectedItem._getNonEmptyKey(), true);
			}
		}

		// Deregister resize event before re-rendering
		if (this._sResizeListenerNoFlexboxSupportId) {
			sap.ui.core.ResizeHandler.deregister(this._sResizeListenerNoFlexboxSupportId);
			this._sResizeListenerNoFlexboxSupportId = null;
		}
	};

	/**
	 * Sets the selected item based on key.
	 * @overwrite
	 * @public
	 * @param {string} sKey The key of the item to be selected
	 * @return {sap.m.IconTabHeader} this pointer for chaining
	 */
	IconTabHeader.prototype.setSelectedKey = function (sKey) {
		var aItems = this.getTabFilters(),
			i = 0;

		if (aItems.length > 0) {
			sKey = sKey || aItems[0]._getNonEmptyKey();
		}

		// adjust UI and internal variables if already rendered (otherwise taken care by onBeforeRendering)
		if (this.$().length) {
			for (; i < aItems.length; i++) {
				if (aItems[i]._getNonEmptyKey() === sKey) {
					this.setSelectedItem(aItems[i], true);
					break;
				}
			}
		}

		// set internal property
		this.setProperty("selectedKey", sKey, true);
		return this;
	};

	/*
	 * Sets the selected item, updates the UI, and fires the select event.
	 * @private
	 * @param {sap.m.IconTabFilter} oItem The item to be selected
	 * @param {Boolean} bAPIChange whether this function is called through the API
	 * @return {sap.m.IconTabHeader} this pointer for chaining
	 */
	IconTabHeader.prototype.setSelectedItem = function(oItem, bAPIchange) {

		if (!oItem || !oItem.getEnabled()) {
			return this;
		}

		var oParent = this.getParent();
		var bIsParentIconTabBar = oParent instanceof sap.m.IconTabBar;

		//if the old selected tab and the new selected tab both have no own content, which means they both use the same content from the icontabbar
		//there is no need to rerender the content
		//fix for xml views css: 0120061532 0001427250 2014
		var bIsContentTheSame = false;
		if (oItem.getContent().length === 0  && this.oSelectedItem && this.oSelectedItem.getContent().length === 0) {
			bIsContentTheSame = true;
		}

		if (this.oSelectedItem &&
			this.oSelectedItem.getVisible() &&
			(bIsParentIconTabBar && oParent.getExpandable() || this.oSelectedItem !== oItem)) {
			this.oSelectedItem.$()
					.removeClass("sapMITBSelected")
					.removeAttr('aria-selected')
					.removeAttr('aria-expanded');
		}

		if (oItem.getVisible()) {
			//click on already selected item leads to expanding/collapsing of the content (if expandable enabled)
			if (this.oSelectedItem === oItem && !bAPIchange) {
				//if content is not expandable nothing should happen otherwise content will be expanded/collapsed
				if (bIsParentIconTabBar && oParent.getExpandable()) {
					oParent._toggleExpandCollapse();
				}
			//click on other item leads to showing the right content of this item
			} else {
				//change the content aria-labaled by the newly selected tab;
				if (bIsParentIconTabBar) {
					oParent.$("content").attr('aria-labelledby', oItem.sId);
				}

				// set new item
				this.oSelectedItem = oItem;
				this.setProperty("selectedKey", this.oSelectedItem._getNonEmptyKey(), true);

				if (!bIsParentIconTabBar) {
					this.oSelectedItem.$()
						.addClass("sapMITBSelected")
						.attr({ 'aria-selected': true });
				}

				//if the IconTabBar is not expandable and the content not expanded (which means content can never be expanded), we do not need
				//to visualize the selection and we do not need to render the content
				if (bIsParentIconTabBar && (oParent.getExpandable() || oParent.getExpanded())) {
					// add selected styles
					this.oSelectedItem.$()
							.addClass("sapMITBSelected")
							.attr({ 'aria-selected': true });

					//if item has own content, this content is shown
					var oSelectedItemContent = this.oSelectedItem.getContent();
					if (oSelectedItemContent.length > 0) {
						oParent._rerenderContent(oSelectedItemContent);
					//if item has not own content, general content of the icontabbar is shown
					} else {
						//if the general content was already shown there is no need to rerender
						if (!bIsContentTheSame) {
							oParent._rerenderContent(oParent.getContent());
						}
					}
					//if content is not expanded, content will be expanded (first click on item always leads to expanding the right content)
					if (!bAPIchange && oParent.getExpandable() && !oParent.getExpanded()) {
						oParent._toggleExpandCollapse(true);
					}
				}
			}

			// scroll to item if out of viewport
			if (this.oSelectedItem.$().length > 0) {
				this._scrollIntoView(oItem, 500);
			} else {
				this._scrollAfterRendering = true;
			}
		}

		var sSelectedKey = this.oSelectedItem._getNonEmptyKey();
		this.oSelectedItem = oItem;
		this.setProperty("selectedKey", sSelectedKey, true);
		if (bIsParentIconTabBar) {
			oParent.setProperty("selectedKey", sSelectedKey, true);
		}

		if (!bAPIchange) {
			// fire event on iconTabBar
			if (bIsParentIconTabBar) {
				oParent.fireSelect({
					selectedItem: this.oSelectedItem,
					selectedKey: sSelectedKey,
					item: this.oSelectedItem,
					key: sSelectedKey
				});
			} else {
				// fire event on header
				this.fireSelect({
					selectedItem: this.oSelectedItem,
					selectedKey: sSelectedKey,
					item: this.oSelectedItem,
					key: sSelectedKey
				});
			}
		}
		return this;
	};

	/**
	 * Returns the first visible item, which is needed for correct arrow calculation.
	 */
	IconTabHeader.prototype._getFirstVisibleItem = function(aItems) {
		for (var i = 0; i < aItems.length; i++) {
			if (aItems[i].getVisible()) {
				return aItems[i];
			}
		}

		return null;
	};

	IconTabHeader.prototype.onAfterRendering = function() {
		var oHeadDomRef = this.getDomRef("head");

		// initialize scrolling
		if (this._oScroller) {
			this._oScroller.setIconTabBar(this, jQuery.proxy(this._afterIscroll, this), jQuery.proxy(this._scrollPreparation, this));
		}

		var oParent = this.getParent();
		var bIsParentIconTabBar = oParent instanceof sap.m.IconTabBar;

		if (this.oSelectedItem &&
			(!bIsParentIconTabBar || bIsParentIconTabBar && oParent.getExpanded())) {
			this.oSelectedItem.$()
					.addClass("sapMITBSelected")
					.attr({ 'aria-selected': true });
		}

		if (this._bDoScroll) {
			jQuery.sap.delayedCall(350, this, "_checkOverflow");
		} else {
			this._checkOverflow();
		}

		// reset scroll state after re-rendering for non-touch devices (iScroll will handle this internally)
		if (this._iCurrentScrollLeft !== 0 && !this._bDoScroll) {
			oHeadDomRef.scrollLeft = this._iCurrentScrollLeft;
		}

		// scroll to selected item if it is out of screen and we render the control the first time
		if (this.oSelectedItem) {
			if (!this._bDoThisOnlyOnce) {
				jQuery.sap.delayedCall(1000, this, "_scrollIntoView", [this.oSelectedItem, 0]); // needs some delay to have correct position info
				this._bDoThisOnlyOnce = true;
			} else if (this._scrollAfterRendering) {
				this._scrollIntoView(this.oSelectedItem, 500);
				this._scrollAfterRendering = false;
			}
		}

		//use ItemNavigation for keyboardHandling
		var aItems = this.getItems();
		var aTabDomRefs = [];
		var iSelectedDomIndex = -1;
		var that = this;

		// find a collection of all tabs
		aItems.forEach(function(oItem) {
			if (oItem instanceof sap.m.IconTabFilter) {
				var oItemDomRef = that.getFocusDomRef(oItem);
				jQuery(oItemDomRef).attr("tabindex", "-1");
				aTabDomRefs.push(oItemDomRef);
				if (oItem === that.oSelectedItem) {
					iSelectedDomIndex = aTabDomRefs.indexOf(oItem);
				}
			}
		});

		//Initialize the ItemNavigation
		if (!this._oItemNavigation) {
			this._oItemNavigation = new ItemNavigation();
			this._oItemNavigation.attachEvent(ItemNavigation.Events.FocusLeave, this._onItemNavigationFocusLeave, this);
			this._oItemNavigation.attachEvent(ItemNavigation.Events.AfterFocus, this._onItemNavigationAfterFocus, this);
			this.addDelegate(this._oItemNavigation);
		}

		//Reinitialize the ItemNavigation after rendering
		this._oItemNavigation.setRootDomRef(oHeadDomRef);
		this._oItemNavigation.setItemDomRefs(aTabDomRefs);
		this._oItemNavigation.setSelectedIndex(iSelectedDomIndex);


		//listen to resize
		this._sResizeListenerId = sap.ui.core.ResizeHandler.register(this.getDomRef(),  jQuery.proxy(this._fnResize, this));

		// Change ITB content height on resize when ITB stretchContentHeight is set to true (IE9 fix)
		if (!jQuery.support.newFlexBoxLayout &&
			bIsParentIconTabBar &&
			oParent.getStretchContentHeight()) {
			this._sResizeListenerNoFlexboxSupportId = sap.ui.core.ResizeHandler.register(oParent.getDomRef(), jQuery.proxy(this._fnResizeNoFlexboxSupport, this));
			this._fnResizeNoFlexboxSupport();
		}

	};

	/*
	 * Destroys the item aggregation.
	 */
	IconTabHeader.prototype.destroyItems = function() {
		this.oSelectedItem = null;
		this._aTabKeys = [];
		this.destroyAggregation("items");
	};

	IconTabHeader.prototype.addItem = function(oItem) {
		if (!(oItem instanceof sap.m.IconTabSeparator)) {
			var sKey = oItem.getKey();
			// check if key is a duplicate
			if (this._aTabKeys.indexOf(sKey) !== -1) {
				jQuery.sap.log.warning("sap.m.IconTabHeader: duplicate key '" + sKey + "' inside the IconTabFilter. Please use unique keys.");
			}
			this._aTabKeys.push(sKey);
		}
		this.addAggregation("items", oItem);
	};

	IconTabHeader.prototype.insertItem = function(oItem, iIndex) {
		if (!(oItem instanceof sap.m.IconTabSeparator)) {
			var sKey = oItem.getKey();
			//check if key is a duplicate
			if (this._aTabKeys.indexOf(sKey) !== -1) {
				jQuery.sap.log.warning("sap.m.IconTabHeader: duplicate key '" + sKey + "' inside the IconTabFilter. Please use unique keys.");
			}
			this._aTabKeys.push(sKey);
		}
		this.insertAggregation("items", oItem, iIndex);
	};

	IconTabHeader.prototype.removeAllItems = function() {
		this._aTabKeys = [];
		this.removeAllAggregation("items");
	};

	IconTabHeader.prototype.removeItem = function(oItem) {
		// Make sure we have the actual Item and not just an ID
		oItem = this.removeAggregation("items", oItem);

		if (oItem && !(oItem instanceof sap.m.IconTabSeparator)) {
			var sKey = oItem.getKey();
			this._aTabKeys.splice(this._aTabKeys.indexOf(sKey) , 1);
		}

		// Return the original value from removeAggregation
		return oItem;
	};

	IconTabHeader.prototype.removeAggregation = function (sAggregationName, oObject, bSuppressInvalidate) {
		var aItems = this.getTabFilters();

		var oItem = Control.prototype.removeAggregation.apply(this, arguments);

		if (oItem && oItem == this.oSelectedItem && sAggregationName == 'items') {

			var iIndexOf = jQuery.inArray(oItem, aItems);
			aItems = this.getTabFilters();

			iIndexOf = Math.max(0, Math.min(iIndexOf, aItems.length - 1));

			var oSelectedItem = aItems[iIndexOf];

			if (oSelectedItem) {
				this.setSelectedItem(oSelectedItem);
			} else {
				var oIconTabBar = this.getParent();
				if (oIconTabBar instanceof sap.m.IconTabBar && oIconTabBar.getExpanded()) {
					oIconTabBar.$("content").children().remove();
				}
			}
		}

		return oItem;
	};

	IconTabHeader.prototype.removeAllAggregation = function (sAggregationName, bSuppressInvalidate) {

		if (sAggregationName == 'items') {
			var oIconTabBar = this.getParent();
			if (oIconTabBar instanceof sap.m.IconTabBar && oIconTabBar.getExpanded()) {
				oIconTabBar.$("content").children().remove();
			}
		}

		return Control.prototype.removeAllAggregation.apply(this, arguments);
	};


	/**
	 * Checks if all tabs are textOnly version.
	 * @private
	 * @returns True if all tabs are textOnly version, otherwise false
	 */
	IconTabHeader.prototype._checkTextOnly = function(aItems) {
		if (aItems.length > 0) {
			for (var i = 0; i < aItems.length; i++) {
				if (!(aItems[i] instanceof sap.m.IconTabSeparator)) {
					if (aItems[i].getIcon()) {
						this._bTextOnly = false;
						return false;
					}
				}
			}
		}
		this._bTextOnly = true;
		return true;
	};

	/**
	 * Checks if all tabs are noText version.
	 * @private
	 * @returns True if all tabs are noText version, otherwise false
	 */
	IconTabHeader.prototype._checkNoText = function(aItems) {
		if (aItems.length > 0) {
			for (var i = 0; i < aItems.length; i++) {
				if (!(aItems[i] instanceof sap.m.IconTabSeparator)) {
					if (aItems[i].getText().length > 0) {
						return false;
					}
				}
			}
		}
		return true;
	};

	/**
	 * Checks if scrolling is needed.
	 * @private
	 * @returns True if scrolling is needed, otherwise false
	 */
	IconTabHeader.prototype._checkScrolling = function(oHead) {

		var $bar = this.$();

		var bScrolling = false;

		if (this._bDoScroll) { //iScroll is used, therefore we need other calculation then in desktop mode
			var domScrollCont = this.getDomRef("scrollContainer");
			var domHead = this.getDomRef("head");

			if (domHead && domScrollCont) {
				if (domHead.offsetWidth > domScrollCont.offsetWidth) {
					bScrolling = true;
				}
			}
		} else { //desktop mode
			//check if there are more tabs as displayed
			if (oHead) {
				if (oHead.scrollWidth > oHead.clientWidth) {
					//scrolling possible
					bScrolling = true;
				}
			}
		}

		if (this._scrollable !== bScrolling) {
			$bar.toggleClass("sapMITBScrollable", bScrolling);
			$bar.toggleClass("sapMITBNotScrollable", !bScrolling);
			this._scrollable = bScrolling;
		}

		return bScrolling;
	};

	/**
	 * Gets the icon of the requested arrow (left/right).
	 * @private
	 * @param sName Left or right
	 * @returns Icon of the requested arrow
	 */
	IconTabHeader.prototype._getScrollingArrow = function(sName) {
		var src;

		if (sap.ui.Device.system.desktop) {
			// use navigation arrows on desktop and win8 combi devices
			src = IconPool.getIconURI("navigation-" + sName + "-arrow");
		} else {
			// use slim arrows on mobile devices
			src = IconPool.getIconURI("slim-arrow-" + sName);
		}

		var mProperties = {
			src : src,
			useIconTooltip : false
		};

		var sSuffix = this._bTextOnly ? "TextOnly" : "";
		var sLeftArrowClass = "sapMITBArrowScrollLeft" + sSuffix;
		var sRightArrowClass = "sapMITBArrowScrollRight" + sSuffix;

		var aCssClassesToAddLeft = ["sapMITBArrowScroll", sLeftArrowClass];
		var aCssClassesToAddRight = ["sapMITBArrowScroll", sRightArrowClass];

		if (sName === "left") {
			if (!this._oArrowLeft) {
				this._oArrowLeft = sap.m.ImageHelper.getImageControl(this.getId() + "-arrowScrollLeft", this._oArrowLeft, this, mProperties, aCssClassesToAddLeft);
			}
			return this._oArrowLeft;
		}
		if (sName === "right") {
			if (!this._oArrowRight) {
				this._oArrowRight = sap.m.ImageHelper.getImageControl(this.getId() + "-arrowScrollRight", this._oArrowRight, this, mProperties, aCssClassesToAddRight);
			}
			return this._oArrowRight;
		}
	};

	/**
	 * Changes the state of the scroll arrows depending on whether they are required due to overflow.
	 * @private
	 */
	IconTabHeader.prototype._checkOverflow = function() {

		var oBarHead = this.getDomRef("head");
		var $bar = this.$();

		if (this._checkScrolling(oBarHead) && oBarHead) {
			// check whether scrolling to the left is possible
			var bScrollBack = false;
			var bScrollForward = false;

			if (this._bDoScroll) { //ScrollEnablement is used, therefore we need other calculation then in desktop mode
				var domScrollCont = this.getDomRef("scrollContainer");
				var domHead = this.getDomRef("head");
				if (this._oScroller.getScrollLeft() > 0) {
					bScrollBack = true;
				}
				if ((this._oScroller.getScrollLeft() + domScrollCont.offsetWidth) < domHead.offsetWidth) {
					bScrollForward = true;
				}

			} else { //desktop mode
				var iScrollLeft = this._iCurrentScrollLeft;
				var realWidth = oBarHead.scrollWidth;
				var availableWidth = oBarHead.clientWidth;

				if (Math.abs(realWidth - availableWidth) == 1) { // Avoid rounding issues see CSN 1316630 2013
					realWidth = availableWidth;
				}

				if (!this._bRtl) {   // normal LTR mode
					if (iScrollLeft > 0) {
						bScrollBack = true;
					}
					if ((realWidth > availableWidth) && (iScrollLeft + availableWidth < realWidth)) {
						bScrollForward = true;
					}
				} else {  // RTL mode
					var $List = jQuery(oBarHead);
					if ($List.scrollLeftRTL() > 0) {
						bScrollForward = true;
					}
					if ($List.scrollRightRTL() > 0) {
						bScrollBack = true;
					}
				}
			}

			// only do DOM changes if the state changed to avoid periodic application of identical values
			if ((bScrollForward != this._bPreviousScrollForward) || (bScrollBack != this._bPreviousScrollBack)) {
				this._bPreviousScrollForward = bScrollForward;
				this._bPreviousScrollBack = bScrollBack;
				$bar.toggleClass("sapMITBScrollBack", bScrollBack);
				$bar.toggleClass("sapMITBNoScrollBack", !bScrollBack);
				$bar.toggleClass("sapMITBScrollForward", bScrollForward);
				$bar.toggleClass("sapMITBNoScrollForward", !bScrollForward);
			}
		} else {
			this._bPreviousScrollForward = false;
			this._bPreviousScrollBack = false;
		}
	};

	/**
	 * Handles the activation of the tabs and arrows.
	 * @private
	 */
	IconTabHeader.prototype._handleActivation = function(oEvent) {
		var sTargetId = oEvent.target.id,
			oControl = oEvent.srcControl,
			sControlId;

		var $sTargetId = jQuery.sap.byId(sTargetId);
		/*eslint-disable no-empty */
		// TODO check better implementation
		if (jQuery.inArray(this.$("content")[0], $sTargetId.parents()) > -1) {
		/*eslint-enable no-empty */
			//do nothing because element is inside content
		} else {
			if (sTargetId) {
				var sId = this.getId();

				// For items: do not navigate away! Stay on the page and handle the click in-place. Right-click + "Open in new Tab" still works.
				// For scroll buttons: Prevent IE from firing beforeunload event -> see CSN 4378288 2012
				oEvent.preventDefault();

				//on mobile devices click on arrows has no effect
				if (sTargetId == sId + "-arrowScrollLeft" && sap.ui.Device.system.desktop) {
					if (sap.ui.Device.os.windows && sap.ui.Device.os.version === 8) {
						//combi devices with windows 8 should also scroll on click on arrows
						//need to use iscroll
						var iScrollLeft = this._oScroller.getScrollLeft() - IconTabHeader.SCROLL_STEP;
						if (iScrollLeft < 0) {
							iScrollLeft = 0;
						}
						// execute manual scrolling with iScroll's scrollTo method (delayedCall 0 is needed for positioning glitch)
						this._scrollPreparation();
						jQuery.sap.delayedCall(0, this._oScroller, "scrollTo", [iScrollLeft, 0, 500]);
						jQuery.sap.delayedCall(500, this, "_afterIscroll");
					} else {
						// scroll back/left button
						this._scroll(-IconTabHeader.SCROLL_STEP, 500);
					}

				} else if (sTargetId == sId + "-arrowScrollRight" && sap.ui.Device.system.desktop) {
					if (sap.ui.Device.os.windows && sap.ui.Device.os.version === 8) {
						//combi devices with windows 8 should also scroll on click on arrows
						//need to use iscroll
						var iScrollLeft = this._oScroller.getScrollLeft() + IconTabHeader.SCROLL_STEP;
						var iContainerWidth = this.$("scrollContainer").width();
						var iHeadWidth = this.$("head").width();
						if (iScrollLeft > (iHeadWidth - iContainerWidth)) {
							iScrollLeft = iHeadWidth - iContainerWidth;
						}
						// execute manual scrolling with iScroll's scrollTo method (delayedCall 0 is needed for positioning glitch)
						this._scrollPreparation();
						jQuery.sap.delayedCall(0, this._oScroller, "scrollTo", [iScrollLeft, 0, 500]);
						jQuery.sap.delayedCall(500, this, "_afterIscroll");
					} else {
						// scroll forward/right button
						this._scroll(IconTabHeader.SCROLL_STEP, 500);
					}

				} else {

					// should be one of the items - select it
					if (oControl instanceof sap.ui.core.Icon || oControl instanceof sap.m.Image) {
						// click on icon: fetch filter instead
						sControlId = oEvent.srcControl.getId().replace(/-icon$/, "");
						oControl = sap.ui.getCore().byId(sControlId);
						if (oControl.getMetadata().isInstanceOf("sap.m.IconTab") && !(oControl instanceof sap.m.IconTabSeparator)) {
							this.setSelectedItem(oControl);
						}
					} else if (oControl.getMetadata().isInstanceOf("sap.m.IconTab") && !(oControl instanceof sap.m.IconTabSeparator)) {
						// select item if it is an iconTab but not a separator

						this.setSelectedItem(oControl);
					}
				}
			} else {
				//no target id, so we have to check if showAll is set or it's a text only item, because clicking on the number then also leads to selecting the item
				if (oControl.getMetadata().isInstanceOf("sap.m.IconTab") && !(oControl instanceof sap.m.IconTabSeparator)) {
					this.setSelectedItem(oControl);
				}
			}
		}
	};

	/*
	 * Scrolls to the item passed as parameter if it is not (fully) visible.
	 * If the item is to the left of the viewport it will be put leftmost.
	 * If the item is to the right of the viewport it will be put rightmost.
	 * @param {sap.m.IconTabFilter} oItem The item to be scrolled into view
	 * @param {int} iDuration The duration of the animation effect
	 * @private
	 * @return {sap.m.IconTabHeader} this pointer for chaining
	 */
	IconTabHeader.prototype._scrollIntoView = function(oItem, iDuration) {
		var $item = oItem.$(),
		oHeadDomRef,
		iScrollLeft,
		iNewScrollLeft,
		iContainerWidth;

		if ($item.length > 0) {
			var $head = this.$('head');
			var iHeadPaddingWidth = $head.innerWidth() - $head.width();
			var iItemWidth = $item.outerWidth(true);
			var iItemPosLeft = $item.position().left - iHeadPaddingWidth / 2;

			// switch based on scrolling mode
			if (this._bDoScroll) { // ScrollEnablement
				iScrollLeft = this._oScroller.getScrollLeft();
				iContainerWidth = this.$("scrollContainer").width();
				iNewScrollLeft = 0;

				// check if item is outside of viewport
				if (iItemPosLeft - iScrollLeft < 0 || iItemPosLeft - iScrollLeft > iContainerWidth - iItemWidth) {
					if (iItemPosLeft - iScrollLeft < 0) { // left side: make this the first item
						iNewScrollLeft += iItemPosLeft;
					} else { // right side: make this the last item
						iNewScrollLeft += iItemPosLeft + iItemWidth - iContainerWidth;
					}

					// execute manual scrolling with scrollTo method (delayedCall 0 is needed for positioning glitch)
					this._scrollPreparation();
					// store current scroll state to set it after rerendering
					this._iCurrentScrollLeft = iNewScrollLeft;
					jQuery.sap.delayedCall(0, this._oScroller, "scrollTo", [iNewScrollLeft, 0, iDuration]);
					jQuery.sap.delayedCall(iDuration, this, "_afterIscroll");
				}
			} else { // desktop scrolling with jQuery
				oHeadDomRef = this.getDomRef("head");
				iScrollLeft = oHeadDomRef.scrollLeft;
				iContainerWidth = $item.parent().width();
				iNewScrollLeft = iScrollLeft;

				// check if item is outside of viewport
				if (iItemPosLeft < 0 || iItemPosLeft > iContainerWidth - iItemWidth) {
					if (iItemPosLeft < 0) { // left side: make this the first item
						iNewScrollLeft += iItemPosLeft;
					} else { // right side: make this the last item
						iNewScrollLeft += iItemPosLeft + iItemWidth - iContainerWidth;
					}

					// execute scrolling
					this._scrollPreparation();
					// store current scroll state to set it after rerendering
					this._iCurrentScrollLeft = iNewScrollLeft;
					jQuery(oHeadDomRef).stop(true, true).animate({scrollLeft: iNewScrollLeft}, iDuration, jQuery.proxy(this._adjustAndShowArrow, this));
				}
			}
		}

		return this;
	};

	/*
	 * Scrolls the items if possible, using an animation.
	 *
	 * @param iDelta How far to scroll
	 * @param iDuration How long to scroll (ms)
	 * @private
	 */
	IconTabHeader.prototype._scroll = function(iDelta, iDuration) {
		this._scrollPreparation();

		var oDomRef = this.getDomRef("head");
		var iScrollLeft = oDomRef.scrollLeft;
		var bIsIE = sap.ui.Device.browser.internet_explorer || sap.ui.Device.browser.edge;
		if (!bIsIE && this._bRtl) {
			iDelta = -iDelta;
		} // RTL lives in the negative space
		var iScrollTarget = iScrollLeft + iDelta;
		jQuery(oDomRef).stop(true, true).animate({scrollLeft: iScrollTarget}, iDuration, jQuery.proxy(this._adjustAndShowArrow, this));
		this._iCurrentScrollLeft = iScrollTarget;
	};

	/**
	 * Adjusts the arrow position and displays the arrow.
	 * @private
	 */
	IconTabHeader.prototype._adjustAndShowArrow = function() {
		this._$bar && this._$bar.toggleClass("sapMITBScrolling", false);
		this._$bar = null;
		//update the arrows on desktop
		if (sap.ui.Device.system.desktop) {
			this._checkOverflow();
		}
	};

	/**
	 * Scroll preparation.
	 * @private
	 */
	IconTabHeader.prototype._scrollPreparation = function() {
		if (!this._$bar) {
			this._$bar = this.$().toggleClass("sapMITBScrolling", true);
		}
	};

	/**
	 * After iscroll.
	 * @private
	*/
	IconTabHeader.prototype._afterIscroll = function() {
		this._checkOverflow();
		this._adjustAndShowArrow();
	};

	/**
	 * Resize  handling.
	 * @private
	*/
	IconTabHeader.prototype._fnResize = function() {
		this._checkOverflow();
	};

	/**
	 * Resize handler for ITB content inside FixFlex layout (IE9 fix)
	 * Calculate height on the content
	 * @private
	 */
	sap.m.IconTabHeader.prototype._fnResizeNoFlexboxSupport = function() {
		var $content = this.getParent().$("containerContent"),
			iDiffOuterInnerHeight = $content.outerHeight(true) - $content.height();

		// calculate and set content div height
		$content.height(this.getParent().$().height() - $content.position().top - iDiffOuterInnerHeight);
	};

	sap.m.IconTabHeader.prototype.onExit = function() {
		// Deregister resize event before re-rendering
		if (this._sResizeListenerNoFlexboxSupportId) {
			sap.ui.core.ResizeHandler.deregister(this._sResizeListenerNoFlexboxSupportId);
			this._sResizeListenerNoFlexboxSupportId = null;
		}
	};

	/**
	 * @overwrite
	 */
	//overwritten method, returns for most cases the iconDomRef, if the given tab has no icon, the textDomRef is returned.
	IconTabHeader.prototype.getFocusDomRef = function (oFocusTab) {
		var oTab = oFocusTab || this.oSelectedItem;
		if (!oTab) {
			return null;
		}

		return oTab.getDomRef();
	};

	IconTabHeader.prototype.applyFocusInfo = function (oFocusInfo) {
		//sets the focus depending on the used IconTabFilter
		if (oFocusInfo.focusDomRef) {
			jQuery(oFocusInfo.focusDomRef).focus();
		}
	};

	/* =========================================================== */
	/*           begin: event handlers                             */
	/* =========================================================== */

	/**
	 * Initializes scrolling on the IconTabHeader.
	 *
	 * @param {jQuery.Event} oEvent
	 * @private
	 */
	IconTabHeader.prototype.ontouchstart = function(oEvent) {
		var oTargetTouch = oEvent.targetTouches[0];

		// store & init touch state
		this._iActiveTouch = oTargetTouch.identifier;
		this._iTouchStartPageX = oTargetTouch.pageX;
		this._iTouchDragX = 0;

		var $target = jQuery(oEvent.target);

		// prevent text selecting when click on the scrolling arrows
		if ($target.hasClass('sapMITBArrowScroll')) {
			oEvent.preventDefault();
		}

		//if the browser is IE prevent click events on dom elements in the tab, because the IE will focus them, not the tab itself.
		if (sap.ui.Device.browser.internet_explorer) {
			if ($target.hasClass('sapMITBFilterIcon') || $target.hasClass('sapMITBCount') || $target.hasClass('sapMITBText') || $target.hasClass('sapMITBTab') || $target.hasClass('sapMITBContentArrow') || $target.hasClass('sapMITBSep') || $target.hasClass('sapMITBSepIcon')) {
				oEvent.preventDefault();
			}
		}
	};

	/**
	 * Sets an internal flag if horizontal drag was executed.
	 *
	 * @param {jQuery.Event} oEvent
	 * @private
	 */
	IconTabHeader.prototype.ontouchmove = function(oEvent) {

		if (this._iActiveTouch === undefined) {
			return;
		}

		var oTouch = sap.m.touch.find(oEvent.changedTouches, this._iActiveTouch);

		// check for valid changes
		if (!oTouch || oTouch.pageX === this._iTouchStartPageX) {
			return;
		}

		// sum up movement to determine in touchend event if selection should be executed
		this._iTouchDragX += Math.abs(this._iTouchStartPageX - oTouch.pageX);
		this._iTouchStartPageX = oTouch.pageX;
	};

	/**
	 * Handles touch end and events and triggers selection if bar was not dragged.
	 *
	 * @param {jQuery.Event} oEvent
	 * @private
	 */
	IconTabHeader.prototype.ontouchend = function(oEvent) {

		if (this._iActiveTouch === undefined) {
			return;
		}

		// suppress selection if there ware a drag (moved more than 5px on desktop or 20px on others)
		if (this._scrollable && this._iTouchDragX > (sap.ui.Device.system.desktop ? 5 : 15)) {
			return;
		}

		var MOBILE_TAP = 0;
		var LEFT_MOUSE_CLICK = 1;
		var LUMIA_TOUCH; // undefined on Lumia phone

		if (oEvent.which === LUMIA_TOUCH || oEvent.which === MOBILE_TAP || oEvent.which === LEFT_MOUSE_CLICK) {
			this._handleActivation(oEvent);
		}

		this._iActiveTouch = undefined;
	};


	/**
	 * Handles the touch cancel event.
	 *
	 * @param {jQuery.EventObject} oEvent The event object
	 * @private
	 */
	IconTabHeader.prototype.ontouchcancel = IconTabHeader.prototype.ontouchend;

	/**
	 * Fires keyboard navigation event when the user presses Enter or Space.
	 *
	 * @param {jQuery.Event} oEvent
	 * @private
	 */
	IconTabHeader.prototype.onsapselect = function(oEvent) {
		this._handleActivation(oEvent);
	};

	/* =========================================================== */
	/*           end: event handlers                               */
	/* =========================================================== */


	return IconTabHeader;

}, /* bExport= */ true);
