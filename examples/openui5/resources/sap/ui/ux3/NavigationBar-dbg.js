/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.ux3.NavigationBar.
sap.ui.define(['jquery.sap.global', 'sap/ui/core/Control', 'sap/ui/core/delegate/ItemNavigation', './library', 'jquery.sap.dom'],
	function(jQuery, Control, ItemNavigation, library/* , jQuerySap */) {
	"use strict";


	
	/**
	 * Constructor for a new NavigationBar.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * Provides enhanced navigation capabilities and is the parent control of NavigationItem. It is displayed in the form of a horizontal line
	 * with switching markers depending on the currently selected item. The size of an item which is currently chosen by the user is enlarged. In the case
	 * that a large number of items are defined for the bar, this is made transparent to the user by showing symbols for scrolling options (forwards and backwards)
	 * to see the next or previous items.
	 * @extends sap.ui.core.Control
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @alias sap.ui.ux3.NavigationBar
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var NavigationBar = Control.extend("sap.ui.ux3.NavigationBar", /** @lends sap.ui.ux3.NavigationBar.prototype */ { metadata : {
	
		library : "sap.ui.ux3",
		properties : {
	
			/**
			 * Defines whether the navigation bar shall have top-level appearance
			 */
			toplevelVariant : {type : "boolean", group : "Misc", defaultValue : false}
		},
		defaultAggregation : "items",
		aggregations : {
	
			/**
			 * If the navigation items need to have a different parent than the NavigationBar, alternatively the associatedItems association can be used.
			 * The NavigationBar follows the approach to use the items aggregation. If this aggregation is empty, associatedItems is used.
			 */
			items : {type : "sap.ui.ux3.NavigationItem", multiple : true, singularName : "item"}, 
	
			/**
			 * Hidden aggregation for the overflow menu if applicable
			 */
			overflowMenu : {type : "sap.ui.commons.Menu", multiple : false, visibility : "hidden"}
		},
		associations : {
	
			/**
			 * The selected NavigationItem.
			 */
			selectedItem : {type : "sap.ui.ux3.NavigationItem", multiple : false}, 
	
			/**
			 * This association is ignored as long as the items aggregation is used; and supposed to be used alternatively when the items should be aggregated by other
			 * entities.
			 */
			associatedItems : {type : "sap.ui.ux3.NavigationItem", multiple : true, singularName : "associatedItem"}
		},
		events : {
	
			/**
			 * Event is fired when an item is selected by the user
			 */
			select : {allowPreventDefault : true,
				parameters : {
	
					/**
					 * The ID of the newly selected NavigationItem.
					 */
					itemId : {type : "string"}, 
	
					/**
					 * The newly selected NavigationItem.
					 */
					item : {type : "sap.ui.ux3.NavigationItem"}
				}
			}
		}
	}});
	
	
	NavigationBar.SCROLL_STEP = 250; // how many pixels to scroll with every overflow arrow click
	//sap.ui.ux3.NavigationBar._MAX_ITEM_WIDTH = 300;
	
	NavigationBar.prototype.init = function() {
		this._bPreviousScrollForward = false; // remember the item overflow state
		this._bPreviousScrollBack = false;
		this._iLastArrowPos = -100; // this property is always read and applied as "left"/"right" depending on RTL configuration
		this._bRtl = sap.ui.getCore().getConfiguration().getRTL();
	
		this.allowTextSelection(false);
	
	
		this.startScrollX = 0;
		this.startTouchX = 0;
		var that = this;
	
		// Initialize the ItemNavigation
		this._oItemNavigation = new ItemNavigation().setCycling(false);
		this.addDelegate(this._oItemNavigation);
		
		this.data("sap-ui-fastnavgroup", "true", true); // Define group for F6 handling
	
		if (jQuery.sap.touchEventMode === "ON") {
			var fnTouchStart = function(evt) {
				evt.preventDefault();
	
				// stop any inertia scrolling
				if (that._iInertiaIntervalId) {
					window.clearInterval(that._iInertiaIntervalId);
				}
	
				that.startScrollX = that.getDomRef("list").scrollLeft;
				that.startTouchX = evt.touches[0].pageX;
				that._bTouchNotMoved = true;
				that._lastMoveTime = new Date().getTime();
			};
	
			var fnTouchMove = function(evt) {
				var dx = evt.touches[0].pageX - that.startTouchX;
	
				var oListRef = that.getDomRef("list");
				var oldScrollLeft = oListRef.scrollLeft;
				var newScrollLeft = that.startScrollX - dx;
				oListRef.scrollLeft = newScrollLeft;
				that._bTouchNotMoved = false;
	
				// inertia scrolling: prepare continuation even after touchend by calculating the current velocity
				var dt = new Date().getTime() - that._lastMoveTime;
				that._lastMoveTime = new Date().getTime();
				if (dt > 0) {
					that._velocity = (newScrollLeft - oldScrollLeft) / dt;
				}
	
				evt.preventDefault();
			};
	
			var fnTouchEnd = function(evt) {
				if (that._bTouchNotMoved === false) { // swiping ends now
					evt.preventDefault();
	
					// add some inertia... continue scrolling with decreasing velocity
					var oListRef = that.getDomRef("list");
					var dt = 50;
					var endVelocity = Math.abs(that._velocity / 10); // continue scrolling until the speed has decreased to a fraction (v/10 means 11 iterations with slowing-down factor 0.8)
					that._iInertiaIntervalId = window.setInterval(function(){
						that._velocity = that._velocity * 0.80;
						var dx = that._velocity * dt;
						oListRef.scrollLeft = oListRef.scrollLeft + dx;
						if (Math.abs(that._velocity) < endVelocity) {
							window.clearInterval(that._iInertiaIntervalId);
							that._iInertiaIntervalId = undefined;
						}
					}, dt);
	
				} else if (that._bTouchNotMoved === true) { //touchstart and touchend without move is a click; trigger it directly to avoid the usual delay
					that.onclick(evt);
					evt.preventDefault();
				} //else  touchend without corresponding start do nothing special
				that._bTouchNotMoved = undefined;
				that._lastMoveTime = undefined;
			};
	
			this.ontouchstart = fnTouchStart;
			this.ontouchend = fnTouchEnd;
			this.ontouchmove = fnTouchMove;
		}
	
	};
	
	NavigationBar.prototype.exit = function () {
		if (this._oItemNavigation) {
			this.removeDelegate(this._oItemNavigation);
			this._oItemNavigation.destroy();
			delete this._oItemNavigation;
		}

		if (this._checkOverflowIntervalId) {
			jQuery.sap.clearIntervalCall(this._checkOverflowIntervalId);
			this._checkOverflowIntervalId = null;
		}

		// no super.exit() to call
	};
	
	
	NavigationBar.prototype.onBeforeRendering = function() {
		// stop the periodic overflow checker
		if (this._checkOverflowIntervalId) {
			jQuery.sap.clearIntervalCall(this._checkOverflowIntervalId);
			this._checkOverflowIntervalId = null;
		}
	
		if (!!sap.ui.Device.browser.firefox) { // TODO: feature detection... not used yet because of performance implications (may involve creating elements)
			this.$().unbind("DOMMouseScroll", this._handleScroll);
		} else {
			this.$().unbind("mousewheel", this._handleScroll);
		}
	
		var arrow = this.getDomRef("arrow");
		this._iLastArrowPos = arrow ? parseInt(this._bRtl ? arrow.style.right : arrow.style.left, 10) : -100;
	};
	
	
	NavigationBar.prototype.invalidate = function(oSource) {
		// In case the source of invalidation is a navigation item, it most likely changed something
		// that we have to reflect in the overflow-menu
		if (oSource instanceof sap.ui.ux3.NavigationItem) {
			this._menuInvalid = true;
		}
		Control.prototype.invalidate.apply(this, arguments);
	};
	
	/**
	 * Calculates the (initial) position of the indicator-arrow and the overflow-arrows
	 * 
	 * @private
	 */
	NavigationBar.prototype._calculatePositions = function() {
		var oDomRef = this.getDomRef();
		
		// re-initialize display of scroll arrows
		this._bPreviousScrollForward = false;
		this._bPreviousScrollBack = false;
		this._checkOverflow(oDomRef.firstChild, this.getDomRef("ofb"), this.getDomRef("off"));
	};
	
	/**
	 * Attaches to a themechange and recalculates the positions of the arrows in the NavigationBar
	 */
	NavigationBar.prototype.onThemeChanged = function() {
		if (this.getDomRef()) {
			this._calculatePositions();
		}
	};
	
	
	NavigationBar.prototype.onAfterRendering = function() {
		var oDomRef = this.getDomRef();
	
		// start the periodic checking for overflow of the item area
		var oListDomRef = oDomRef.firstChild;
		var of_back = this.getDomRef("ofb");
		var of_fw = this.getDomRef("off");
		this._checkOverflowIntervalId = jQuery.sap.intervalCall(350, this, "_checkOverflow", [oListDomRef,of_back,of_fw]);
	
		// bind a scroll handler to the workset item area
		if (!!sap.ui.Device.browser.firefox) { // TODO: feature detection... not used yet because of performance implications (may involve creating elements)
			jQuery(oDomRef).bind("DOMMouseScroll", jQuery.proxy(this._handleScroll, this));
		} else {
			jQuery(oDomRef).bind("mousewheel", jQuery.proxy(this._handleScroll, this));
		}
	
		this._calculatePositions();
		
		this._updateItemNavigation();
		
		// Workaround for sporadic weird scrolling behavior in NavigationBar when there is 
		// mobile content in the Shell.
		// TODO: We should get to the bottom of why this happens, but after 6 hours of debugging, I give up.
		// See for example CSS 0120061532 0002361191 2013 - HPAs had the same problems
		// This happens in the BC as well as GC theme
		var $NavBar = this.$();
		$NavBar.on("scroll", function() {
			$NavBar.children().scrollTop(0);
			$NavBar.scrollTop(0);
		});
	};
	
	
	NavigationBar.prototype._updateItemNavigation = function() {
		var oDomRef = this.getDomRef();
		if (oDomRef) {
			// reinitialize the ItemNavigation after rendering
			var iSelectedDomIndex = -1;
			var sSelectedId = this.getSelectedItem();
	
			var $ItemRefs = jQuery(oDomRef).children().children("li").children().not(".sapUiUx3NavBarDummyItem");
			$ItemRefs.each(function(index, element) {
				if (element.id == sSelectedId) {
					iSelectedDomIndex = index;
				}
			});
	
			this._oItemNavigation.setRootDomRef(oDomRef);
			this._oItemNavigation.setItemDomRefs($ItemRefs.toArray());
			this._oItemNavigation.setSelectedIndex(iSelectedDomIndex);
		}
	};
	
	
	NavigationBar.prototype.onsapspace = function(oEvent) {
		this._handleActivation(oEvent);
	};
	
	NavigationBar.prototype.onclick = function(oEvent) {
		this._handleActivation(oEvent);
	};
	
	
	NavigationBar.prototype._handleActivation = function(oEvent) {
		var sTargetId = oEvent.target.id;
	
		if (sTargetId) {
			var sId = this.getId();
			
			// For items: do not navigate away! Stay on the page and handle the click in-place. Right-click + "Open in new Tab" still works.
			// For scroll buttons: Prevent IE from firing beforeunload event -> see CSN 4378288 2012
			oEvent.preventDefault();
	
			if (sTargetId == sId + "-ofb") {
				// scroll back/left button
				this._scroll( -NavigationBar.SCROLL_STEP, 500);
	
			} else if (sTargetId == sId + "-off") {
				// scroll forward/right button
				this._scroll(NavigationBar.SCROLL_STEP, 500);
			} else if (sTargetId == sId + "-oflt" || sTargetId == sId + "-ofl") {
				// Overflow Button has been activated
				this._showOverflowMenu();
			} else {
				// should be one of the items - select it
				
				var item = sap.ui.getCore().byId(sTargetId);
				if (item
						&& (sTargetId != this.getSelectedItem())
						&& (sap.ui.getCore().byId(sTargetId) instanceof sap.ui.ux3.NavigationItem)) {
					// select the item and fire the event
					if (this.fireSelect({item:item,itemId:sTargetId})) {
						this.setAssociation("selectedItem", item, true); // avoid rerendering, animate
						this._updateSelection(sTargetId);
					}
				}
			}
		}
	};
	
	
	/**
	 * Return the overflow Menu, creates it if it does not exist. 
	 * 
	 * @returns {sap.ui.commons.Menu}
	 */
	NavigationBar.prototype._getOverflowMenu = function() {
		var oMenu = this.getAggregation("overflowMenu");
		if (!oMenu || this._menuInvalid) {
			// TODO: Check with new destroy-behavior: The Menu might not be there because it was already destroyed. In that case this might create a memory leak.
			if (oMenu) {
				oMenu.destroyAggregation("items", true);
			} else {
				oMenu = new sap.ui.commons.Menu();
			}
	
			var aItems = this._getCurrentItems();
			var that = this;
			var sSelectedId = this.getSelectedItem();
			
			for (var i = 0; i < aItems.length; ++i) {
				var oNavItem = aItems[i];
				
				var oMenuItem = new sap.ui.commons.MenuItem(oNavItem.getId() + "-overflowItem", {
					text : oNavItem.getText(),
					visible : oNavItem.getVisible(),
					// Like the normal NavigationBar Items, disabled items are shown and handled
					// like enabled items. The application can check the item for its 
					// enabled-property
					/* enabled : oNavItem.getEnabled(), */
					icon : sSelectedId == oNavItem.getId() ? "sap-icon://accept" : null,
					/* eslint-disable no-loop-func */
					select : (function(oNavItem) { 
						return function(oEvent) {
							that._handleActivation({
								target : { id : oNavItem.getId() },
								preventDefault : function() { /* Ignore */ }
							});
						};
					})(oNavItem)
					/* eslint-enable no-loop-func */
				});
				oMenu.addAggregation("items", oMenuItem, true);
			}
	
			this.setAggregation("overflowMenu", oMenu, true);
			this._menuInvalid = false;
		}
		
		return oMenu;
	};
	
	/**
	 * Returns the items added to the items aggregation, or (if empty) the items that are
	 * referred to in the associatedItems association.
	 */
	NavigationBar.prototype._getCurrentItems = function() {
		var aItems = this.getItems();
		if (aItems.length < 1) {
			aItems = this.getAssociatedItems();
	
			var oCore = sap.ui.getCore();
			for (var i = 0; i < aItems.length; ++i) {
				aItems[i] = oCore.byId(aItems[i]);
			}
		}
		
		return aItems;
	};
	
	
	/**
	 * Shows the menu items that do not fit into the navigation bar. Or in the case of overflow being
	 * set to MenuAndButtons: All items (since we cannot know what is currently scrolled into view).
	 */
	NavigationBar.prototype._showOverflowMenu = function() {
		var oMenu = this._getOverflowMenu();
		var oTarget = this.$("ofl").get(0);
	
		oMenu.open(
			true, // First item highlighted. Check whether this is the correct behavior
			oTarget,
			sap.ui.core.Popup.Dock.EndTop,
			sap.ui.core.Popup.Dock.CenterCenter,
			oTarget
		);
	};
	
	
	/**
	 * Visually adapts the NavigationBar to the new selection, using animations instead of re-rendering.
	 *
	 * @param sItemId may be null, which means all selection is removed
	 * @private
	 */
	NavigationBar.prototype._updateSelection = function(sItemId) {
		this._menuInvalid = true;
	
		// update the css classes to make the selected item larger etc.
		var $newSel = jQuery.sap.byId(sItemId);
		$newSel.attr("tabindex", "0").attr("aria-checked", "true");
		$newSel.parent().addClass("sapUiUx3NavBarItemSel");
		$newSel.parent().parent().children().each(function(){
			var a = this.firstChild;
			if (a && (a.id != sItemId) && (a.className.indexOf("Dummy") == -1)) {
				jQuery(a).attr("tabindex", "-1"); // includes arrow and dummy, but does not hurt TODO?
				jQuery(a).parent().removeClass("sapUiUx3NavBarItemSel");
				jQuery(a).attr("aria-checked", "false");
			}
		});
	
		// let the ItemNavigation know about the new selection
		var iSelectedDomIndex = $newSel.parent().index();
		if (iSelectedDomIndex > 0) {
			iSelectedDomIndex--; // if a selected element is found, its index in the ItemNavigation is the DOM index minus the dummy element, which is the first sibling
		}
		this._oItemNavigation.setSelectedIndex(iSelectedDomIndex);
	
		// make the arrow slide to the selected item
		var $Arrow = this.$("arrow");
		var arrowWidth = $Arrow.outerWidth();
		var targetPos = NavigationBar._getArrowTargetPos(sItemId, arrowWidth, this._bRtl);
		$Arrow.stop(); // stop any ongoing animation
		var animation_1 = this._bRtl ? {right:targetPos + "px"} : {left:targetPos + "px"};
		$Arrow.animate(animation_1, 500, "linear");
		var that = this;
		window.setTimeout(function(){ // because the items resize (for 300ms), interrupt and adjust the animation in the middle
			targetPos = NavigationBar._getArrowTargetPos(sItemId, arrowWidth, that._bRtl);
			$Arrow.stop();
			var animation_2 = that._bRtl ? {right:targetPos + "px"} : {left:targetPos + "px"};
			$Arrow.animate(animation_2, 200, "linear", function(){
				var item = jQuery.sap.domById(sItemId);
				that._scrollItemIntoView(item);
			});
		}, 300);
	};
	
	NavigationBar.prototype._scrollItemIntoView = function(item) {
		if (!item) {
			return;
		}
		
		var li = jQuery(item.parentNode);
		var ul = li.parent();
		var targetPos;
		var bRtl = sap.ui.getCore().getConfiguration().getRTL();
	
		// special handling for first and last item to not only scroll them into view but to scroll to the very start/end
		var index = li.index() - 1; // -1 because of leading dummy item
		if (index == 0) {
			targetPos = bRtl ? (ul[0].scrollWidth - ul.innerWidth() + 20) : 0; // +20 to account for margins etc.
		} else if (index == li.siblings().length - 2) { // siblings() excludes the item itself, but (apart from the already subtracted dummy) also the arrow => -2
			targetPos = bRtl ? 0 : (ul[0].scrollWidth - ul.innerWidth() + 20); // +20 to account for margins etc.
		} else {
			var liLeft = li.position().left;
			var ulScrollLeft = bRtl ? ul.scrollLeftRTL() : ul.scrollLeft();
			
			if (liLeft < 0) {
				// item cut at the left => scroll right to make it left-aligned
				targetPos = ulScrollLeft + liLeft;
			} else {
				var rightDistance = ul.innerWidth() - (liLeft + li.outerWidth(true));  // the distance from the right item edge to the end of the ul; negative if the item is cut
				if (rightDistance < 0) {
					targetPos = ulScrollLeft - rightDistance; // rightDistance is negative, add its amount to the current scroll amount
					// but now it might be that we scroll so far to the left that the left part of the item is hidden, which may not happen!
					targetPos = Math.min(targetPos, ulScrollLeft + liLeft);
				}
			}
		}
	
		if (targetPos !== undefined) {
			if (bRtl) {
				targetPos = jQuery.sap.denormalizeScrollLeftRTL(targetPos, ul.get(0)); // fix browser differences*/
			}
			ul.stop(true, true).animate({scrollLeft: targetPos}); // should be a string like "-50px"
		}
	};
	
	/**
	 * Calculates the required position of the selection arrow to highlight the item with the given ID.
	 * If null is given, the position will be outside the visible area.
	 *
	 * If bRight is set, the distance to the *right* border will be returned (instead of the normal position from left),
	 * this can be used for RTL mode.
	 *
	 * @static
	 * @private
	 */
	NavigationBar._getArrowTargetPos = function(sTargetItemId, arrowWidth, bRight) {
		var $Item = jQuery.sap.byId(sTargetItemId);
		if ($Item.length > 0) {
			var width = $Item.outerWidth(); //Math.min($Item.outerWidth(), sap.ui.ux3.NavigationBar._MAX_ITEM_WIDTH);
			var leftDistance = Math.round($Item[0].offsetLeft + (width / 2) - (arrowWidth / 2));
			if (!bRight) {
				return leftDistance;
			} else {
				return $Item.parent().parent().innerWidth() - leftDistance - arrowWidth;
			}
		} else {
			return -100;
		}
	};
	
	
	/**
	 * Handles a mouse scroll event, scrolling the items if possible.
	 *
	 * @param oEvent
	 * @private
	 */
	NavigationBar.prototype._handleScroll = function(oEvent) {
		if (oEvent.type == "DOMMouseScroll") { // Firefox
			var scrollAmount = oEvent.originalEvent.detail * 40; // in FF you get 3 ticks at once, *40 gives reasonable speed
			this._scroll(scrollAmount, 50);          // scroll fast to avoid temporal overlap
		} else { // other browsers
			var scrollAmount = -oEvent.originalEvent.wheelDelta; // in IE you get 120 as basic amount, direction is inverted
			this._scroll(scrollAmount, 50);          // scroll fast to avoid temporal overlap
		}
		oEvent.preventDefault(); // do not scroll the window (?)
	};
	
	
	/**
	 * Scrolls the items if possible, using an animation.
	 *
	 * @param iDelta how far to scroll
	 * @param iDuration how long to scroll (ms)
	 * @private
	 */
	NavigationBar.prototype._scroll = function(iDelta, iDuration) {
		var oDomRef = this.$()[0].firstChild;
		var iScrollLeft = oDomRef.scrollLeft;
		if (!sap.ui.Device.browser.internet_explorer && this._bRtl) {
			iDelta = -iDelta;
		} // RTL lives in the negative space
		var iScrollTarget = iScrollLeft + iDelta;
		jQuery(oDomRef).stop(true, true).animate({scrollLeft: iScrollTarget}, iDuration);
	};
	
	
	
	/**
	 * Changes the state of the scroll arrows depending on whether they are required due to overflow.
	 *
	 * @param oListDomRef the ul tag containing the items
	 * @param of_back the backward scroll arrow
	 * @param of_fw the forward scroll arrow
	 * @private
	 */
	NavigationBar.prototype._checkOverflow = function(oListDomRef, of_back, of_fw) {

		function isChromeOnMac() {
			return sap.ui.Device.os.macintosh && sap.ui.Device.browser.chrome;
		}

		if (oListDomRef && this.getDomRef() && jQuery.sap.act.isActive()) {
			var iScrollLeft = oListDomRef.scrollLeft;

			// check whether scrolling to the left is possible
			var bScrollBack = false;
			var bScrollForward = false;

			var realWidth = oListDomRef.scrollWidth;
			var availableWidth = oListDomRef.clientWidth;

			// Exceptional case for Chrome on Mac OS
			// Added scroll tolerance to ensure that the arrows are hidden correctly
			// see BCP Internal Incident 1570758438
			var iScrollTolerance = isChromeOnMac() ? 5 : 0;

			if (Math.abs(realWidth - availableWidth) == 1) { // Avoid rounding issues see CSN 1316630 2013
				realWidth = availableWidth;
			}

			if (!this._bRtl) {   // normal LTR mode

				if (iScrollLeft > iScrollTolerance) {
					bScrollBack = true;
				}
				if ((realWidth > availableWidth) && (realWidth - (iScrollLeft + availableWidth) > iScrollTolerance)) {
					bScrollForward = true;
				}
	
			} else {  // RTL mode
				var $List = jQuery(oListDomRef);
				if ($List.scrollLeftRTL() > iScrollTolerance) {
					bScrollForward = true;
				}
				if ($List.scrollRightRTL() > iScrollTolerance) {
					bScrollBack = true;
				}
			}

			// only do DOM changes if the state changed to avoid periodic application of identical values
			if ((bScrollForward != this._bPreviousScrollForward) || (bScrollBack != this._bPreviousScrollBack)) {
				this._bPreviousScrollForward = bScrollForward;
				this._bPreviousScrollBack = bScrollBack;
				this.$().toggleClass("sapUiUx3NavBarScrollBack", bScrollBack)
						.toggleClass("sapUiUx3NavBarScrollForward", bScrollForward);
				if (!NavigationBar._bMenuLoaded && (bScrollBack || bScrollForward)) {
					NavigationBar._bMenuLoaded = true;
					jQuery.sap.require("sap.ui.commons.Menu");
				}
			}
			
			// paint selection arrow in the right place
			var selItem = sap.ui.getCore().byId(this.getSelectedItem());
			if (selItem) {
				var $Arrow = this.$("arrow");
				var arrowWidth = $Arrow.outerWidth();
				var targetPos = NavigationBar._getArrowTargetPos(selItem.getId(), arrowWidth, this._bRtl) + "px";
				if (!this._bRtl) {
					if ($Arrow[0].style.left != targetPos) {
						$Arrow[0].style.left = targetPos;
					}
				} else {
					if ($Arrow[0].style.right != targetPos) {
						$Arrow[0].style.right = targetPos;
					}
				}
			}
		}
	};
	
	
	
	
	/* API methods */
	
	/* overwritten association methods */
	
	NavigationBar.prototype.setSelectedItem = function(vItem) {
		this.setAssociation("selectedItem", vItem, true); // avoid rerendering
		if (this.getDomRef()) {
			var sItemId = (!vItem || (typeof (vItem) == "string")) ? vItem : vItem.getId();
			this._updateSelection(sItemId); // animate selection
		}
	};
	
	
	/* overridden aggregation items */
	
	NavigationBar.prototype.addItem = function(oItem) {
		this._menuInvalid = true;
		return this.addAggregation("items", oItem);
	};
	
	NavigationBar.prototype.destroyItems = function() {
		this._menuInvalid = true;
		return this.destroyAggregation("items");
	};
	
	NavigationBar.prototype.insertItem = function(oItem, iIndex) {
		this._menuInvalid = true;
		return this.insertAggregation("items", oItem, iIndex);
	};
	
	NavigationBar.prototype.removeItem = function(oItem) {
		this._menuInvalid = true;
		return this.removeAggregation("items", oItem);
	};
	
	NavigationBar.prototype.removeAllItems = function() {
		this._menuInvalid = true;
		return this.removeAllAggregation("items");
	};
	
	
	/* overridden association associatedItems */
	
	NavigationBar.prototype.addAssociatedItem = function(vItemOrId) {
		this._menuInvalid = true;
		return this.addAssociation("associatedItems", vItemOrId);
	};
	
	NavigationBar.prototype.removeAssociatedItem = function(vItemOrId) {
		this._menuInvalid = true;
		return this.removeAssociation("associatedItems", vItemOrId);
	};
	
	NavigationBar.prototype.removeAllAssociatedItems = function() {
		this._menuInvalid = true;
		return this.removeAllAssociation("associatedItems");
	};
	
	
	/* API method implementations */
	

	/**
	 * Replaces the currently associated items with the ones in the given array
	 *
	 * @param {sap.ui.ux3.NavigationItem[]} aItems
	 *         The items to associate
	 * @type sap.ui.ux3.NavigationBar
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	NavigationBar.prototype.setAssociatedItems = function(aItems /* bResetArrowPosition */) { // second parameter is currently not in the public API
		jQuery.sap.assert(jQuery.isArray(aItems), "aItems must be an array");
	
		var oListDomRef = this.getDomRef("list");
	
		// remove old items
		this.removeAllAssociation("associatedItems", true);
	
		// add new items
		for (var i = 0; i < aItems.length; i++) {
			this.addAssociation("associatedItems", aItems[i], true);
		}
	
		// if already rendered, update the UI
		if (oListDomRef) {
			var $FocusRef = jQuery(oListDomRef).find(":focus");
			var focusId = ($FocusRef.length > 0) ? $FocusRef.attr("id") : null;
	
			if (arguments.length > 1 && typeof arguments[1] === "boolean") { // checking for the second, hidden parameter "bResetArrowPosition"
				this._iLastArrowPos = -100;
			} else {
				var arrow = this.getDomRef("arrow");
				this._iLastArrowPos = parseInt(this._bRtl ? arrow.style.right : arrow.style.left, 10);
			}
			
			oListDomRef.innerHTML = "";
			var rm = sap.ui.getCore().createRenderManager();
			
			sap.ui.ux3.NavigationBarRenderer.renderItems(rm, this);
			
			rm.flush(oListDomRef, true);
			rm.destroy();
	
			// restore focus
			var oNewFocusRef;
			if (focusId && (oNewFocusRef = jQuery.sap.domById(focusId))) {
				jQuery.sap.focus(oNewFocusRef);
			}
	
			this._updateSelection(this.getSelectedItem());
	
			// update the item navigation, as the item HTML has changed
			this._updateItemNavigation();
		}
	
		return this;
	};
	
	

	/**
	 * Returns whether there is a selectedItem set which is actually present in the items aggregation; or, if the aggregation is empty, in the associatedItems association.
	 *
	 * @type boolean
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	NavigationBar.prototype.isSelectedItemValid = function() {
		var selId = this.getSelectedItem();
		if (!selId) {
			return false;
		} // no selection means no selected item out of those which are present
	
		var items = this.getItems();
		if (!items || items.length == 0) {
			items = this.getAssociatedItems();
			for (var i = 0; i < items.length; i++) {
				if (items[i] == selId) {
					return true;
				}
			}
		} else {
			for (var i = 0; i < items.length; i++) {
				if (items[i].getId() == selId) {
					return true;
				}
			}
		}
		return false;
	};
	

	return NavigationBar;

}, /* bExport= */ true);
