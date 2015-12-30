/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.commons.MenuBar.
sap.ui.define(['jquery.sap.global', './Menu', './MenuItem', './MenuItemBase', './library', 'sap/ui/core/Control'],
	function(jQuery, Menu, MenuItem, MenuItemBase, library, Control) {
	"use strict";


	
	/**
	 * Constructor for a new MenuBar.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * Represents a user interface area which is the entry point for menus with their menu items. MenuBar is useful for applications which shall offer a
	 * set of actions that shall be provided in a structured way. The MenuBar contains the menu titles from where users navigate to the single items. The control supports
	 * for example long menu item texts, automated scrolling for menu items when the browser space is not large enough to display all items, defining images for single
	 * or all items in a menu, automated layouting of items with or w/o image, and active/non-active items.
	 * @extends sap.ui.core.Control
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @alias sap.ui.commons.MenuBar
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var MenuBar = Control.extend("sap.ui.commons.MenuBar", /** @lends sap.ui.commons.MenuBar.prototype */ { metadata : {
	
		library : "sap.ui.commons",
		properties : {
	
			/**
			 * When the MenuBar is not enabled, automatically all single menu items are also displayed as 'disabled'.
			 */
			enabled : {type : "boolean", group : "Behavior", defaultValue : true},
	
			/**
			 * Specifies the width of the MenuBar
			 */
			width : {type : "sap.ui.core.CSSSize", group : "Dimension", defaultValue : '100%'},
	
			/**
			 * Available design options are Header and Standard. Note that design settings are theme-dependent.
			 */
			design : {type : "sap.ui.commons.MenuBarDesign", group : "Appearance", defaultValue : sap.ui.commons.MenuBarDesign.Standard}
		},
		defaultAggregation : "items",
		aggregations : {
	
			/**
			 * Aggregation of menu items.
			 */
			items : {type : "sap.ui.unified.MenuItem", multiple : true, singularName : "item"}
		}
	}});
	
	/*Ensure MenuItemBase is loaded (incl. loading of unified library)*/
	
	MenuItem.extend("sap.ui.commons._DelegatorMenuItem", {
		constructor: function(oAlterEgoItm) {
			MenuItem.apply(this);
			this.oAlterEgoItm = oAlterEgoItm;
			this.bNoSubMenu = true;

			var oSubmenu = this.oAlterEgoItm.getSubmenu();
			if (oSubmenu) {
				var that = this;
				oSubmenu.getRootMenu = function() {
					return that.getParent();
				};
				this.bNoSubMenu = false;
			}
		},
		exit: function() {
			if (!this.bNoSubMenu) {
				this.oAlterEgoItm.getSubmenu().getRootMenu = Menu.prototype.getRootMenu;
			}
			this.bNoSubMenu = true;
			this.oAlterEgoItm = null;
		},
		getText: function() {
			return this.oAlterEgoItm.getText();
		},
		getIcon: function() {
			return this.oAlterEgoItm.getIcon();
		},
		getEnabled: function() {
			return this.oAlterEgoItm.getEnabled();
		},
		getVisible: function() {
			return this.oAlterEgoItm.getVisible();
		},
		getSubmenu: function() {
			return this.oAlterEgoItm.getSubmenu();
		}
	});
	
	(function() {
	
	
	/**
	 * Initialize this control.
	 * 
	 * @private
	 */
	MenuBar.prototype.init = function() {
		this.oOvrFlwMnu = null;
		this.sCurrentFocusedItemRefId = null;
		
		this.data("sap-ui-fastnavgroup", "true", true); // Define group for F6 handling
	};
	
	
	/**
	 * Does all the cleanup when the control is to be destroyed.
	 * Called from Element's destroy() method.
	 * @private
	 */
	MenuBar.prototype.exit = function (){
		if (this.oOvrFlwMnu) {
			this.oOvrFlwMnu.destroy();
		}
		this.oOvrFlwMnu = null;
		// Cleanup resize event registration
		if (this.sResizeListenerId) {
			sap.ui.core.ResizeHandler.deregister(this.sResizeListenerId);
			this.sResizeListenerId = null;
		}
	};
	
	
	/**
	 * Called before rendering starts by the renderer
	 * (This is not the onBeforeRendering method which would be not called for the first rendering)
	 * @private
	 */
	MenuBar.prototype.doBeforeRendering = function() {
		var aItems = this.getItems();
		for (var i = 0; i < aItems.length; i++) {
			var oMenu = aItems[i].getSubmenu();
			if (oMenu) {
				oMenu.setRootMenuTopStyle(this.getDesign() == sap.ui.commons.MenuBarDesign.Header);
			}
		}
	
		if (this.oOvrFlwMnu) {
			this.oOvrFlwMnu.setRootMenuTopStyle(this.getDesign() == sap.ui.commons.MenuBarDesign.Header);
		}
	
		// Cleanup resize event registration before re-rendering
		if (this.sResizeListenerId) {
			sap.ui.core.ResizeHandler.deregister(this.sResizeListenerId);
			this.sResizeListenerId = null;
		}
	};
	
	
	/**
	 * Called when the rendering is complete
	 * @private
	 */
	MenuBar.prototype.onAfterRendering = function() {
		//Listen to resizing
		this.sResizeListenerId = sap.ui.core.ResizeHandler.register(this.getDomRef(), jQuery.proxy(this.onresize, this));
	
		//Calculate the overflow
		this.onresize();
	};
	
	
	/**
	 * Called when the control is resized
	 * @private
	 */
	MenuBar.prototype.onresize = function(oEvent) {
		updateAfterResize(this);
	};
	
	
	/**
	 * Behavior implementation which is executed when the focus comes into the control or on one of its children.
	 *
	 * @param {jQuery.Event} oEvent
	 * @private
	 */
	MenuBar.prototype.onfocusin = function(oEvent){
		var sId = this.getId();
		var jTarget = jQuery(oEvent.target);
		var jTargetId = jTarget.attr("id");
		if (!jTargetId || jTargetId == sId || jTargetId == sId + "-area") {
			var jItems = this.$("area").children();
			this.sCurrentFocusedItemRefId = jItems.length == 0 ? null : jQuery(jItems.get(0)).attr("id");
		} else {
			// Make sure the parent menu item get the focus when a menu is closed via
			// keyboard in order to keep keyboard navigation working
			this.sCurrentFocusedItemRefId = jTargetId;
		}
	
		var oFocusElement = jQuery.sap.byId(this.sCurrentFocusedItemRefId).get(0);
		if (oFocusElement) {
			oFocusElement.focus();
		}
		
		this.$().attr("tabindex", "-1");
	};
	
	
	/**
	 * Behavior implementation which is executed when the focus leaves the control or one of its children.
	 *
	 * @param {jQuery.Event} oEvent
	 * @private
	 */
	MenuBar.prototype.onfocusout = function(oEvent){
		//Add the control to tab chain again to make tab in working (see onfocusin)
		this.$().attr("tabindex", "0");
	};
	
	
	/**
	 * Function is called when mouse key is clicked down.
	 *
	 * @param {jQuery.Event} oEvent
	 * @private
	 */
	MenuBar.prototype.onmousedown = function(oEvent) {
		var oMenuItem = _getMenuItem(this, oEvent);
		if (oMenuItem === "ovrflw") {
			this._bOvrFlwMnuSkipOpen = this.oOvrFlwMnu && this.oOvrFlwMnu.bOpen;
		} else if (oMenuItem) {
			var oMenu = oMenuItem.getSubmenu();
			oMenuItem._bSkipOpen = oMenu && oMenu.bOpen;
		}
	};
	
	
	/**
	 * Function is called when mouse leaves the control.
	 *
	 * @param {jQuery.Event} oEvent
	 * @private
	 */
	MenuBar.prototype.onmouseout = function(oEvent) {
		var oMenuItem = _getMenuItem(this, oEvent);
		if (oMenuItem === "ovrflw") {
			var jRef = get$Item(this, oEvent);
			if (this._bOvrFlwMnuSkipOpen && jQuery.sap.checkMouseEnterOrLeave(oEvent, jRef[0])) {
				this._bOvrFlwMnuSkipOpen = false;
			}
		} else if (oMenuItem) {
			var jRef = get$Item(this, oEvent);
			if (oMenuItem._bSkipOpen && jQuery.sap.checkMouseEnterOrLeave(oEvent, jRef[0])) {
				oMenuItem._bSkipOpen = false;
			}
		}
	};
	
	
	/**
	 * Behavior implementation which is executed when the user clicks.
	 *
	 * @param {jQuery.Event} oEvent
	 * @private
	 */
	MenuBar.prototype.onclick = function(oEvent) {
		openItemMenu(this, oEvent, false);
	};
	
	
	/**
	 * Behavior implementation which is executed when the user presses the space or enter key.
	 *
	 * @param {jQuery.Event} oEvent
	 * @private
	 */
	MenuBar.prototype.onsapselect = function(oEvent){
		openItemMenu(this, oEvent, true);
	};
	
	
	/**
	 * Function is called when down key is pressed without a modifier key.
	 *
	 * @param {jQuery.Event} oEvent
	 * @private
	 */
	MenuBar.prototype.onsapdown = function(oEvent){
		openItemMenu(this, oEvent, true);
	};
	
	
	/**
	 * Function is called when down key is pressed with a modifier key.
	 *
	 * @param {jQuery.Event} oEvent
	 * @private
	 */
	MenuBar.prototype.onsapdownmodifiers = function(oEvent){
		if (oEvent.altKey) {
			openItemMenu(this, oEvent, true);
		}
	};
	
	
	/**
	 * Behavior implementation which is executed when the user presses the arrow left (RTL: arrow right) key.
	 *
	 * @param {jQuery.Event} oEvent
	 * @private
	 */
	MenuBar.prototype.onsapprevious = function(oEvent){
		if (oEvent.keyCode != jQuery.sap.KeyCodes.ARROW_UP) {//Ignore arrow up
			focusStep(this, oEvent, "prev");
		}
	};
	
	
	/**
	 * Behavior implementation which is executed when the user presses the arrow right (RTL: arrow left) key.
	 *
	 * @param {jQuery.Event} oEvent
	 * @private
	 */
	MenuBar.prototype.onsapnext = function(oEvent){
		if (oEvent.keyCode != jQuery.sap.KeyCodes.ARROW_DOWN) {//Ignore arrow down
			focusStep(this, oEvent, "next");
		}
	};
	
	
	/**
	 * Behavior implementation which is executed when the user presses the home/pos1 key.
	 *
	 * @param {jQuery.Event} oEvent
	 * @private
	 */
	MenuBar.prototype.onsaphome = function(oEvent){
		focusStep(this, oEvent, "first");
	};
	
	
	/**
	 * Behavior implementation which is executed when the user presses the end key.
	 *
	 * @param {jQuery.Event} oEvent
	 * @private
	 */
	MenuBar.prototype.onsapend = function(oEvent){
		focusStep(this, oEvent, "last");
	};
	
	
	//********* Private *********
	
	
	//Opens the corresponding menu of the selected menu item
	var openItemMenu = function(oThis, oEvent, bWithKeyboard) {
		oEvent.preventDefault();
		oEvent.stopPropagation();
		
		if (oThis.getEnabled()) {
			var oMenuItem = _getMenuItem(oThis, oEvent);
			if (oMenuItem === "ovrflw") {
				var jRef = get$Item(oThis, oEvent);
				if (oThis.oOvrFlwMnu && !oThis._bOvrFlwMnuSkipOpen) {
					var eDock = sap.ui.core.Popup.Dock;
					oThis.oOvrFlwMnu.open(bWithKeyboard, jRef.get(0), eDock.EndTop, eDock.EndBottom, jRef.get(0));
				}
			} else if (oMenuItem) {
				if (oMenuItem.getEnabled()) {
					var jRef = get$Item(oThis, oEvent);
					var oMenu = oMenuItem.getSubmenu();
					if (oMenu && !oMenuItem._bSkipOpen) {
						var eDock = sap.ui.core.Popup.Dock;
						oMenu.open(bWithKeyboard, jRef.get(0), eDock.BeginTop, eDock.BeginBottom, jRef.get(0));
					} else if (!oMenu) {
						oMenuItem.fireSelect({item: oMenuItem});
					}
				}
			}
		}
		
		//Resets all skip open flags
		oThis._bOvrFlwMnuSkipOpen = false;
		var aItems = oThis.getItems();
		for (var i = 0; i < aItems.length; i++) {
			aItems[i]._bSkipOpen = false;
		}
	};
	
	
	//Returns the jQuery Object of the item which was the target of the event (if exists)
	var get$Item = function(oThis, oEvent){
		var jRef = jQuery(oEvent.target);
		if (!jRef.attr("itemidx")) {
			jRef = jRef.parent();
		}
		return jRef.attr("itemidx") ? jRef : null;
	};
	
	
	//Returns the item which was the target of the event (if exists) or "ovrflow" for the overflow
	var _getMenuItem = function(oThis, oEvent) {
		var jRef = get$Item(oThis, oEvent);
		if (jRef) {
			var sItemIdx = jRef.attr("itemidx");
			if (sItemIdx) {
				if (sItemIdx == "ovrflw") {
					return "ovrflw";
				} else {
					var iIdx = parseInt(sItemIdx, 10);
					var oMenuItem = oThis.getItems()[iIdx];
					return oMenuItem;
				}
			}
		}
		return null;
	};
	
	
	//Compute actual number of items currently hidden due to overflow
	var getVisibleItemCount = function(oThis){
		var iVisibleItems = 0;
	
		var jAreaRef = oThis.$("area");
		var jItems = jAreaRef.children();
	
		var bRtl = sap.ui.getCore().getConfiguration().getRTL();
		var lastOffsetLeft = (bRtl ? 100000 : 0);
	
		jItems.each(function(iIdx) {
			if (iIdx == 0) {
				return true;
			}
	
			var currentOffsetLeft = this.offsetLeft;
			var bLineBreak = (bRtl ? (currentOffsetLeft >= lastOffsetLeft) : (currentOffsetLeft <= lastOffsetLeft));
	
			if (bLineBreak) {
				iVisibleItems = iIdx;
				return false;
			} else if (jQuery(this).attr("id") == oThis.getId() + "-ovrflw") {
				// This is the overflow button, there was no line break
				iVisibleItems = iIdx;
				return false;
			} else {
				// Regular item, to the right of the last one, so just proceed
				lastOffsetLeft = currentOffsetLeft;
				return true;
			}
		});
	
		return iVisibleItems;
	};
	
	
	//Handle the resize of the menubar
	var updateAfterResize = function(oThis){
		var iVisibleItems = getVisibleItemCount(oThis);
		var _iVisibleItems = iVisibleItems;
	
		var jAreaRef = oThis.$("area");
		var jItems = jAreaRef.children();
		var jOvrFlwRef = oThis.$("ovrflw");
	
		var bUpdateFocus = false;
	
		if (iVisibleItems < jItems.length - 1) {
			jOvrFlwRef.attr("style", "display:block;");
			if (!oThis.oOvrFlwMnu) {
				oThis.oOvrFlwMnu = new Menu(oThis.getId() + "-ovrflwmnu");
				oThis.oOvrFlwMnu.bUseTopStyle = oThis.getDesign() == sap.ui.commons.MenuBarDesign.Header;
				oThis.oOvrFlwMnu.attachItemSelect(function(oEvent){
					var oItem = oEvent.getParameter("item");
					if (!(oItem instanceof sap.ui.commons._DelegatorMenuItem)) {
						var oItemRootMenu = Menu.prototype.getRootMenu.apply(oItem.getParent());
						oItemRootMenu.fireItemSelect({item: oItem});
					} else if (oItem.bNoSubMenu && oItem instanceof sap.ui.commons._DelegatorMenuItem) {
						oItem.oAlterEgoItm.fireSelect({item: oItem.oAlterEgoItm});
					}
				});
			}
			oThis.oOvrFlwMnu.destroyItems();
			var aItems = oThis.getItems();
			for (var i = 0; i < aItems.length; i++) {
				var oItem = aItems[i];
				if (iVisibleItems != 0) {
					if (oItem.getVisible()) {
						iVisibleItems--;
					}
					if (iVisibleItems == 0) {
						oThis.sLastVisibleItemId = oItem.getId();
					}
				} else {
					oThis.oOvrFlwMnu.addItem(new sap.ui.commons._DelegatorMenuItem(oItem));
					if (oItem.getId() == oThis.sCurrentFocusedItemRefId) {
						bUpdateFocus = true;
					}
				}
			}
			if (sap.ui.getCore().getConfiguration().getAccessibility()) {
				jItems.attr("aria-setsize", _iVisibleItems + 1);
				jOvrFlwRef.attr("aria-posinset", _iVisibleItems + 1);
			}
		} else {
			jOvrFlwRef.attr("style", "display:none;");
			if (oThis.oOvrFlwMnu) {
				oThis.oOvrFlwMnu.destroyItems();
			}
			oThis.sLastVisibleItemId = null;
			if (sap.ui.getCore().getConfiguration().getAccessibility()) {
				jItems.attr("aria-setsize", _iVisibleItems);
				jOvrFlwRef.attr("aria-posinset", 0);
			}
		}
	
		jAreaRef.scrollTop(0);
	
		if (bUpdateFocus) {
			oThis.sCurrentFocusedItemRefId = oThis.sLastVisibleItemId;
			jQuery.sap.byId(oThis.sLastVisibleItemId).get(0).focus();
		}
	};
	
	
	//Focus the next (depending on the given direction) step
	var focusStep = function(oThis, oEvent, sDir){
		oEvent.stopPropagation();
		oEvent.preventDefault();
	
		if (!oThis.sCurrentFocusedItemRefId) {
			return;
		}
	
		var sFollowingFocusItemId = null;
		if (oThis.sLastVisibleItemId && ((oThis.sCurrentFocusedItemRefId == oThis.sLastVisibleItemId && sDir == "next") || sDir == "last")) {
			sFollowingFocusItemId = oThis.getId() + "-ovrflw";
		} else if (oThis.sLastVisibleItemId && oThis.sCurrentFocusedItemRefId == oThis.getId() + "-ovrflw" && sDir == "prev") {
			sFollowingFocusItemId = oThis.sLastVisibleItemId;
		} else {
			var sFoo = sDir + "All";
			var bIsJumpToEnd = false;
			if (sDir == "first") {
				sFoo = "prevAll";
				bIsJumpToEnd = true;
			} else if (sDir == "last") {
				sFoo = "nextAll";
				bIsJumpToEnd = true;
			}
	
			var jCurrentFocusItem = jQuery.sap.byId(oThis.sCurrentFocusedItemRefId);
			var jFollowingItems = jCurrentFocusItem[sFoo](":visible");
	
			sFollowingFocusItemId = jQuery(jFollowingItems.get(bIsJumpToEnd ? jFollowingItems.length - 1 : 0)).attr("id");
		}
		if (sFollowingFocusItemId) {
			oThis.sCurrentFocusedItemRefId = sFollowingFocusItemId;
			jQuery.sap.byId(sFollowingFocusItemId).get(0).focus();
		}
	};
	
	
	}());
	

	return MenuBar;

}, /* bExport= */ true);
