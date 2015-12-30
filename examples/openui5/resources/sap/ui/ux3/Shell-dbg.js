/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.ux3.Shell.
sap.ui.define(['jquery.sap.global', 'sap/ui/commons/Menu', 'sap/ui/core/Control', 'sap/ui/core/theming/Parameters', './library'],
	function(jQuery, Menu, Control, Parameters, library) {
	"use strict";



	/**
	 * Constructor for a new Shell.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * The Ux3 GoldReflection Shell, which is an application frame with navigation capabilities.
	 * It is supposed to be added to a direct child of the BODY tag of a page and there should be no other parts of the page consuming space outside the Shell.
	 * @extends sap.ui.core.Control
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @alias sap.ui.ux3.Shell
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var Shell = Control.extend("sap.ui.ux3.Shell", /** @lends sap.ui.ux3.Shell.prototype */ { metadata : {

		library : "sap.ui.ux3",
		properties : {

			/**
			 * The application title to appear in the left part of the header, usually a company and/or product name. appIcon and appTitle are both optional and can both be set; in this case the icon appears first.
			 */
			appTitle : {type : "string", group : "Misc", defaultValue : null},

			/**
			 * The URL of the image to appear in the left part of the header, usually a branding image containing a logo and/or product name. appIcon and appTitle are both optional and can both be set; in this case the icon appears first.
			 * If the appIcon is set, for accessibility reasons the appIconTooltip must also be set.
			 */
			appIcon : {type : "sap.ui.core.URI", group : "Misc", defaultValue : null},

			/**
			 * The tooltip of the application icon in the header
			 */
			appIconTooltip : {type : "string", group : "Misc", defaultValue : null},

			/**
			 * Whether the Logoff button in the header should be displayed or not.
			 */
			showLogoutButton : {type : "boolean", group : "Misc", defaultValue : true},

			/**
			 * The tooltip to be displayed for the Logout Button of the Shell. If not set, a text meaning "Logout" in the current language will be displayed.
			 * @since 1.9.0
			 */
			logoutButtonTooltip : {type : "string", group : "Accessibility", defaultValue : null},

			/**
			 * Whether the "Global Search" tool should be displayed or not.
			 */
			showSearchTool : {type : "boolean", group : "Misc", defaultValue : true},

			/**
			 * Whether the "Inspector" tool should be displayed or not.
			 * @deprecated Since version 1.7.2.
			 * According to the current Ux designs, the ThingInspector should NOT be opened like this from the Tool Pane. And technically, the ThingInspector is not a ToolPopup.
			 * Instead trigger it from the respective elements in the Shell content.
			 */
			showInspectorTool : {type : "boolean", group : "Misc", defaultValue : false, deprecated: true},

			/**
			 * Whether the "Feeder" tool should be displayed or not.
			 */
			showFeederTool : {type : "boolean", group : "Misc", defaultValue : true},

			/**
			 * Whether the tool area should be displayed at all or not.
			 */
			showTools : {type : "boolean", group : "Misc", defaultValue : true},

			/**
			 * Whether the pane bar should be displayed at all or not.
			 */
			showPane : {type : "boolean", group : "Misc", defaultValue : true},

			/**
			 * Defines which header type to be used. Depending on the header type some other functionality might be obsolete.
			 */
			headerType : {type : "sap.ui.ux3.ShellHeaderType", group : "Misc", defaultValue : sap.ui.ux3.ShellHeaderType.Standard},

			/**
			 * Defines which design type is to be used.
			 * @since 1.12.0
			 */
			designType : {type : "sap.ui.ux3.ShellDesignType", group : "Misc", defaultValue : sap.ui.ux3.ShellDesignType.Standard},

			/**
			 * The width of the right-hand side pane in pixels. The value must be a non-negative integer. The Shell reserves the right to define a minimum width (currently 50px).
			 */
			paneWidth : {type : "int", group : "Misc", defaultValue : 250},

			/**
			 * Whether the Shell content area should have a theme-dependent padding or not.
			 * @since 1.9.0
			 */
			applyContentPadding : {type : "boolean", group : "Appearance", defaultValue : true},

			/**
			 * If set to true, the content area has a defined height. This means that any content put inside can use "100%" height in CSS and will then consume all available space.
			 * However, if content is larger, scrollbars will appear at the content area of the Shell and not on window level.
			 * @since 1.9.0
			 */
			fullHeightContent : {type : "boolean", group : "Appearance", defaultValue : false},

			/**
			 * Whether the Shell header (Title Area + Header Items) can be accessed when an Overlay, OverlayContainer or ThingInspector is open.
			 * @since 1.14.0
			 */
			allowOverlayHeaderAccess : {type : "boolean", group : "Appearance", defaultValue : false}
		},
		defaultAggregation : "content",
		aggregations : {

			/**
			 * The workset items.
			 */
			worksetItems : {type : "sap.ui.ux3.NavigationItem", multiple : true, singularName : "worksetItem"},

			/**
			 * The items to appear in the PaneBar.
			 */
			paneBarItems : {type : "sap.ui.core.Item", multiple : true, singularName : "paneBarItem"},

			/**
			 * The content to appear in the pane area.
			 */
			paneContent : {type : "sap.ui.core.Control", multiple : true, singularName : "paneContent"},

			/**
			 * The content to appear in the main canvas. Each modification of this aggregation leads to a re-rendering of the content area - but not to a re-rendering of the complete Shell.
			 */
			content : {type : "sap.ui.core.Control", multiple : true, singularName : "content"},

			/**
			 * The items which appear in the ToolPalette and are opened as popup when clicked.
			 */
			toolPopups : {type : "sap.ui.ux3.ToolPopup", multiple : true, singularName : "toolPopup"},

			/**
			 * Controls to appear in the header next to the logout button. It is recommended to only use controls of type Button, MenuButton and TextView.
			 * The respective UI guidelines need to be enforced on a higher level.
			 */
			headerItems : {type : "sap.ui.core.Control", multiple : true, singularName : "headerItem"},

			/**
			 * The NotificationBar which should be integrated into the Shell.
			 * @since 1.7.0
			 */
			notificationBar : {type : "sap.ui.ux3.NotificationBar", multiple : false},

			/**
			 *
			 * The menu that is shown when there are too many pane-bar entries to fit onto the screen.
			 * It is shown after a click on the overflow button that appears in that case.
			 * @since 1.14.0
			 */
			_paneOverflowMenu : {type : "sap.ui.commons.Menu", multiple : false, visibility : "hidden"}
		},
		associations : {

			/**
			 * The ID of the Item that is currently selected.
			 * When setting, the NavigationItem itself can be given instead of its ID. There will not be a worksetItemSelected event, the application is responsible to show the proper content according to the newly selected WorksetItem. If the set WorksetItem does not exist in this Shell, the first item (and first sub-item) will be selected after the call.
			 * When getting, always the ID is returned, by which the NavigationItem instance can be retrieved.
			 */
			selectedWorksetItem : {type : "sap.ui.ux3.NavigationItem", multiple : false}
		},
		events : {

			/**
			 * Fired when a workset item was selected by the user. The application may populate the sub-items of the given workset item in the event handler, but this must happen synchronously. If this is done, the application is responsible for displaying the correct content for the selected one of the newly created sub-items. The Shell will currently always mark the first sub-item as selected.
			 */
			worksetItemSelected : {allowPreventDefault : true,
				parameters : {

					/**
					 * The id of the workset item that has been newly selected by the user. If a top-level item has been clicked which has sub-items, the ID of the currently active sub-item (/leaf) is given.
					 */
					id : {type : "string"},

					/**
					 * The selected NavigationItem
					 */
					item : {type : "sap.ui.ux3.NavigationItem"},

					/**
					 * The key of the selected NavigationItem (or null if there is no key)
					 */
					key : {type : "string"}
				}
			},

			/**
			 * An item in the right-hand-side pane bar has been selected, the pane is now visible and can be filled with UI elements.
			 */
			paneBarItemSelected : {
				parameters : {

					/**
					 * The ID of the selected PaneBarItem.
					 */
					id : {type : "string"},

					/**
					 * The selected Item
					 */
					item : {type : "sap.ui.core.Item"},

					/**
					 * The key of the selected Item (or null if there is no key)
					 */
					key : {type : "string"}
				}
			},

			/**
			 * Fired when the user clicks the "Log-off" button
			 */
			logout : {},

			/**
			 * Fired when search has been triggered.
			 */
			search : {},

			/**
			 * Fired when a new feed entry is submitted.
			 */
			feedSubmit : {},

			/**
			 * Fired after a side pane of the shell is closed. It is also fired, when an open pane is closed by calling setShowPane(false), if and only if the pane was opened before.
			 * @since 1.12.0
			 */
			paneClosed : {
				parameters : {

					/**
					 * The id of the PaneBarItem to which the closed pane belonged.
					 */
					id : {type : "string"}
				}
			}
		}
	}});


	Shell.WSI_MENU_DELAY = 200;
	Shell.WSI_OVERFLOW_SCROLL_STEP = 250; // how many pixels to scroll with every overflow arrow click
	Shell.TOOL_PREFIX = "-tool-";
	Shell.FIRST_RENDERING = true; // used for detecting the single very first rendering of any Shell on the page

	/**
	 * The basic width of the ToolPalette if all icons fit into one column. Multiplied if more than
	 * one column of items must be used.
	 *
	 * This value might change after rendering from the LESS parameter "sapUiUx3ShellSideBarBaseWidth"
	 * @see onBeforeRendering and onThemeChanged
	 */
	Shell.SIDE_BAR_BASE_WIDTH = null;

	/**
	 * The basic height of the overflow button in the right pane. Shown when there are too many entries.
	 *
	 * This value might change after rendering from the LESS parameter "sapUiUx3ShellPaneOverflowButtonHeight",
	 * @see onBeforeRendering and onThemeChanged
	 */
	Shell.PANE_OVERFLOW_BUTTON_HEIGHT = null;

	Shell.prototype.init = function() {
		this._iOpenPaneIndex = -1;
		this._sOpenWsiId = null;

		this._bPreviousScrollRight = false; // remember the workset item overflow state
		this._bPreviousScrollLeft = false;

		this._sSelectedWorksetId = null;
		this._sSelectedFacetId = null;

		this._aSyncRefStack = [];
		this._mSyncRefs = {};

		this._oWorksetBar = new sap.ui.ux3.NavigationBar(this.getId() + "-wsBar", {
			toplevelVariant : true,
			select          : [this._handleWorksetBarSelect, this]
		}).setParent(this);
		this._oFacetBar = new sap.ui.ux3.NavigationBar(this.getId() + "-facetBar", {
			select          : [this._handleFacetBarSelect, this]
		}).setParent(this);

		this.setAggregation("_paneOverflowMenu", new Menu());

		// Resize check closure, to be used with bind and unbind (so the right one gets unbound)
		var that = this;
		this._checkResizeClosure = function() { that._checkResize(); };

		// The following calue is updated when the ToolPalette is resized.
		// (It is used in methods like _closePane and setOffsetRight)
		this.currentToolPaletteWidth = 0;

		this._updateThemeVariables();
	};


	Shell.prototype.exit = function() {
		if (this._oWorksetBar) {
			this._oWorksetBar.destroy();
			delete this._oWorksetBar;
		}
		if (this._oFacetBar) {
			this._oFacetBar.destroy();
			delete this._oFacetBar;
		}
		this._oSearchField = null;

		jQuery(window).unbind("resize", this._checkResizeClosure);
	};


	Shell.prototype.onBeforeRendering = function() {

		// unbind the tool palette mouse (hover effect) handlers
		this._beforeRenderingToolPalette();

		this.$("focusDummyPane").unbind("focusin");

		// drag&drop for images with local file API
		if (window.FileReader) {
			var $hdr = this.$("hdr");
			$hdr.unbind('dragover', this._handleDragover)
			.unbind('dragend', this._handleDragend)
			.unbind('drop', this._handleDrop);
			var $bg = this.$("bgImg");
			$bg.unbind('dragover', jQuery.proxy(this._handleDragover))
			.unbind('dragend', this._handleDragend)
			.unbind('drop', this._handleDrop);
		}

	};


	Shell.prototype.onAfterRendering = function() {

		// register hover effect handlers for application-provided tool icons
		this._afterRenderingToolPalette();

		if (this._topSyncRefId && this._mSyncRefs[this._topSyncRefId].focusLast) {
			this.$("focusDummyPane").focusin(this._mSyncRefs[this._topSyncRefId].focusLast);
		}

		// drag&drop for images with local file API
		if (window.FileReader) {
			var $hdr = this.$("hdr");
			$hdr.bind('dragover', jQuery.proxy(this._handleDragover, this))
			.bind('dragend',jQuery.proxy(this._handleDragend, this))
			.bind('drop', jQuery.proxy(this._handleDrop, this));
			var $bg = this.$("bgImg");
			$bg.bind('dragover', jQuery.proxy(this._handleDragover, this))
			.bind('dragend',jQuery.proxy(this._handleDragend, this))
			.bind('drop', jQuery.proxy(this._handleDrop, this));
		}

		// hide or show the facet bar depending on whether the current workset item has sub-items
		var bShowFacetBar = (this._oFacetBar.getAssociatedItems().length > 0);
		var $FacetBar = this.$("facetBar");
		$FacetBar.css("display", (bShowFacetBar ? "block" : "none"));
		this._adaptContentHeight();

		// remember RTL mode to avoid repeated checks
		this._bRtl = sap.ui.getCore().getConfiguration().getRTL();

		if (this._getPersonalization().hasChanges()) {
			this._getPersonalization().applySettings(this._getPersonalization().oSettings);
		}

		// ItemNavigation for PaneBar items
		if (!this._oPaneItemNavigation) {
			this._oPaneItemNavigation = new sap.ui.core.delegate.ItemNavigation().setCycling(false);
			this.addDelegate(this._oPaneItemNavigation);
		}
		var $PaneListRef = this.$("paneBarEntries");
		this._updatePaneBarItemNavigation($PaneListRef);

		this._setNotifyVisibility();

		if (Shell.FIRST_RENDERING) {
			jQuery(window).bind("resize", this._checkResizeClosure);
		}
		this._checkResize();

		Shell.FIRST_RENDERING = false;

		// Firefox ESR (17) workaround
		// TODO: Remove when Firefox ESR is updated
		if (!!sap.ui.Device.browser.firefox && sap.ui.Device.browser.version == 17) {
			jQuery.sap.delayedCall(500, this, this._checkResize);
		}
	};

	/**
	 * Reads LESS parameter values from the currently active theme.
	 * If any of the values are set to NaN, something went wrong.
	 *
	 * @private
	 */
	Shell.prototype._updateThemeVariables = function() {
		Shell.SIDE_BAR_BASE_WIDTH = parseInt(
			Parameters.get("sapUiUx3ShellSideBarBaseWidth"),
			10
		);

		Shell.PANE_OVERFLOW_BUTTON_HEIGHT = parseInt(
			Parameters.get("sapUiUx3ShellPaneOverflowButtonHeight"),
			10
		);
		// Save the original button height to be referenced as maximum height
		Shell.PANE_OVERFLOW_BUTTON_MAX_HEIGHT = Shell.PANE_OVERFLOW_BUTTON_HEIGHT;
	};


	/**
	 * Triggers a delayed check that determines whether the overflow mechanism of the side bars
	 * must be activated.
	 *
	 * @private
	 */
	Shell.prototype._checkResize = function() {
		if (!this.getDomRef()) {
			return;
		}

		// The browser window is (depending on the configuration) repainted several hundred times
		// during resize, which triggers several resize-events
		// Keep it from executing several times when only once suffices...
		jQuery.sap.clearDelayedCall(this._checkResizeDelayId);
		this._checkResizeDelayId = jQuery.sap.delayedCall(100, this, function() {
			this._rerenderPaneBarItems();
			this._checkToolPaletteSize();
		});
	};


	/**
	 * Checks whether there are too many ToolPopups to fit into the ToolPalette (left bar) and changes
	 * its width accordingly.
	 */
	Shell.prototype._checkToolPaletteSize = function(bHideBar) {
		if (!this.getDomRef()) {
			// Do not try to calculate anything if nothing has been rendered
			return;
		}

		if (bHideBar === undefined) {
			bHideBar = !this.getShowTools();
		}

		// Check whether the last item is still visible on the screen
		var oToolPalette = this.$("tp");

		var iColumns = 1;
		var iLastTop = 9999999; // Just some very large number...
		var iCurrentTop = 0;
		var bKeepGrowing = true;

		if (bHideBar) {
			iColumns = 0;
			bKeepGrowing = false;
		}

		do { // Loop at least once
			var iBarWidth  = iColumns * Shell.SIDE_BAR_BASE_WIDTH;
			var iSepWidth  = Math.floor(iBarWidth / 2);
			var iSepMargin = Math.floor(iBarWidth / 4);

			var sSide1 = this._bRtl ? "right" : "left";

			// Move left side of canvas
			this.$("canvas").css(sSide1, iBarWidth + "px");
			this.$("canvasBackground").css(sSide1, iBarWidth + "px");
			// Move left side of WorksetItems (Navigation)
			this.$("wBar").css("margin-" + sSide1, iBarWidth + "px");

			// Resize the Notification Area
			var mProps = {};
			mProps[sSide1] = iBarWidth + "px";
			this.$("notify").css(mProps);

			// Resize ToolPalette
			oToolPalette.css("width", iBarWidth + "px");
			// Resize Toolpalette Separators
			var mProps = {};
			mProps["width"] = iSepWidth + "px";
			mProps["margin-" + sSide1] = iSepMargin + "px";
			this.$("tp-separator").css(mProps);

			if (!bKeepGrowing) {
				// Break if we have to stop growing...
				break;
			}

			sap.ui.core.RenderManager.forceRepaint(oToolPalette[0]);
			iCurrentTop = oToolPalette.children().last()[0].offsetTop;
			if (iCurrentTop >= iLastTop) {
				// Reset to previous size...
				iColumns--;
				// and break (see if-condition above)
				bKeepGrowing = false;
				continue;
			}
			iLastTop = iCurrentTop;

			iColumns++;
			if (iColumns > 10) {
				// Now this is just silly....
				jQuery.sap.log.error("The ToolPalette is growing too much, this must be a bug.");
				break;
			}

		} while (
			iCurrentTop > oToolPalette.height()
		);

		this.currentToolPaletteWidth = this.getShowTools() ? iBarWidth : 0;

		this._updateOverlaysOnToolPaletteChange();
	};


	Shell.prototype._updateOverlaysOnToolPaletteChange = function() {
		// Resize visible Overlays when the ToolPalette changes its width.
		// Overlays can for example be ThingInspectors that leave room to the sides so the user is able
		// to use the panes while having the overlay open.
		// See setShowTools-method for another location that updates positions in this way
		var $OpenOverlays = this._getSyncRefs();
		if (this._bRtl) {
			$OpenOverlays.css("right", this.currentToolPaletteWidth + "px");
		} else {
			$OpenOverlays.css("left", this.currentToolPaletteWidth + "px");
		}
	};


	/**
	 * Updates the ItemNavigation for the PaneBarItems after the HTML has changed due to re-rendering
	 *
	 * @param $PaneListRef
	 */
	Shell.prototype._updatePaneBarItemNavigation = function($PaneListRef) {
		this._oPaneItemNavigation.setRootDomRef($PaneListRef[0]);
		var aPaneItems = $PaneListRef.children().toArray();
		this._oPaneItemNavigation.setItemDomRefs(aPaneItems);

		if (this._oPaneItemNavigation.getFocusedIndex() > aPaneItems.length) { // if items have been removed
			this._oPaneItemNavigation.setFocusedIndex( -1);
		}

		this._checkPaneBarOverflow($PaneListRef);
	};

	/**
	 * Called in onAfterRendering and onThemeChanged to make sure that the paneBar-items that do not
	 * fit on screen are rendered in a separate menu.
	 *
	 * @param $PaneListRef jQuery object pointing to the List containing the items
	 * @private
	 */
	Shell.prototype._checkPaneBarOverflow = function($PaneListRef) {
		// Keep it from executing several times when only once suffices...
		jQuery.sap.clearDelayedCall(this._checkPaneBarOverflowDelayId);
		this._checkPaneBarOverflowDelayId = jQuery.sap.delayedCall(200, this, function() {
			this._delayedCheckPaneBarOverflow($PaneListRef);
		});
	};

	Shell.prototype._delayedCheckPaneBarOverflow = function($PaneListRef) {

		if (!$PaneListRef) {
			$PaneListRef = this.$("paneBarEntries");
		}
		if ($PaneListRef.length == 0) {
			// If it is still not there, try again later...
			this._checkPaneBarOverflow();
			return;
		}

		var iListHeight =
			$PaneListRef.parent().height() -
			// The container itself overflows and its height is defined by its padding which changes
			// the available space in RTL mode...
			// TODO: Check for a more elegant solution and - if found - rewrite
			(this._bRtl ? $PaneListRef.innerHeight() : 0);
		var iItemBottomPosition = 0;
		var $Entries = $PaneListRef.children();

		$Entries.css("display", "inline-block");
		var bItemsInMenu = false;
		var len = $Entries.length;
		for (var i = len - 1; i >= 0; --i) {
			// TODO: Maybe we can loop backwards and just brake when the first one fits.

			var oDomEntry = $Entries[i];
			// Find out at which position the bottom end of the item lies
			if (this._bRtl) {
				// When RTL-mode is enabled the rotated left side of the pane entry is at the bottom,
				// so the negative offsetLeft value indicates how far down the item goes...
				iItemBottomPosition = (0 - oDomEntry.offsetLeft);
			} else {
				// In normal mode, the rotated left is at the top, so we have to add the item width
				// to the offsetLeft value in order to get the bottom position
				iItemBottomPosition = oDomEntry.offsetLeft + oDomEntry.offsetWidth;
			}

			var bItemInPane = iItemBottomPosition < iListHeight;

			// Hide/show the main item
			jQuery(oDomEntry).css("display", bItemInPane ? "inline-block" : "none");
			// Hide/show the submenu item
			sap.ui.getCore().byId(oDomEntry.id + "-overflow").setVisible(!bItemInPane);

			if (bItemInPane) {
				// This item is inside the pane
				continue;
				// We cannot break at this point, since we don't know which items have been visible
				// in the overflow-menu before - so we have to loop over all items and set the
				// visibility for all of them. Else, menu items could be set to visible that should
				// be hidden. Another solution would be to always show every entry in the overflow
				// menu.
			} else {
				bItemsInMenu = true;
			}
		}

		var $OverflowButton = this.$("paneBarOverflowButton");
		if (bItemsInMenu) {
			// Overflow is happening. Show button.
			$OverflowButton.css("display", "block");

		} else {
			// No overflow. Hide button.
			$OverflowButton.css("display", "none");
			// // Remove buffer for overflow menu button
			// $PaneBar.css("padding-bottom", "0");

			// Firefox ESR (17) Redraw bug workaround
			// TODO: Remove when Firefox ESR is updated
			if (!!sap.ui.Device.browser.firefox && sap.ui.Device.browser.version == 17) {
				sap.ui.core.RenderManager.forceRepaint(document.getElementsByTagName("body")[0]);
			}
		}

		// This is tricky: Because of this method, the overflow-button might change, but since the
		// calculation depends on the size of the overflow-button we have to check whether something
		// changed and then restart the calculation if it did (or else we have an endless loop).
		var bOverflowButtonChanged = this._changeOverflowButton();
		if (bOverflowButtonChanged) {
			this._checkPaneBarOverflow();
		}

	};


	/**
	 * Checks the text content of the overflow-button and resizes it depending on the text. The
	 * maximum height is defined through the less-parameter and written to
	 * sap.ui.ux3.Shell.PANE_OVERFLOW_BUTTON_MAX_HEIGHT while the current height is saved in
	 * sap.ui.ux3.Shell.PANE_OVERFLOW_BUTTON_HEIGHT
	 *
	 * @returns {bool} Returns whether a change to the button height has been made.
	 */
	Shell.prototype._adaptOverflowButtonHeight = function() {
		var $Button = this.$("paneBarOverflowButton");
		var $ButtonWrapper = this.$("paneBarOverflowWrapper");
		var $ButtonText = this.$("paneBarOverflowText");
		var $PaneBar = this.$("paneBarRight");

		// Make the span small so it does not increase the button size without having content
		$ButtonText.css("width", "");


		var iOldHeight = Shell.PANE_OVERFLOW_BUTTON_HEIGHT;

		// We need the scroll_Width_ because the content of the button is rotated by 90°
		var iScrollWidth = $ButtonText[0].scrollWidth + /* buffer: */ 5;

		if (iScrollWidth > Shell.PANE_OVERFLOW_BUTTON_MAX_HEIGHT) {
			// Use the size specified in the theme as maximum width
			Shell.PANE_OVERFLOW_BUTTON_HEIGHT = Shell.PANE_OVERFLOW_BUTTON_MAX_HEIGHT;
		} else {
			// The button does not need the maximum amount of allowed space, give it whatever it needs
			Shell.PANE_OVERFLOW_BUTTON_HEIGHT = iScrollWidth;
		}

		$Button.css("height", Shell.PANE_OVERFLOW_BUTTON_HEIGHT);
		$ButtonWrapper.css("width", Shell.PANE_OVERFLOW_BUTTON_HEIGHT);
		// Make the span as large as the surrounding box again, so ellipsis works
		$ButtonText.css("width", "100%");
		// Make sure there is room for overflow menu button
		$PaneBar.css("padding-bottom", Shell.PANE_OVERFLOW_BUTTON_HEIGHT + "px");


		return (iOldHeight != Shell.PANE_OVERFLOW_BUTTON_HEIGHT);
	};

	/**
	 * Changes the overflow button from the standard text to the currently active overflowing
	 * item and back.
	 *
	 * @returns {bool} Returns whether a change to the button height has been made.
	 */
	Shell.prototype._changeOverflowButton = function() {
		// Only if this._sOpenPaneId is not null, an overflow item could be active
		// Whether the item is really in the overflow menu will be checked later by checking
		// its visible-property
		var oOverflowItem = null;
		if (this._sOpenPaneId) {
			oOverflowItem = sap.ui.getCore().byId(this._sOpenPaneId + "-overflow");
		}


		var sText = sap.ui.getCore().getLibraryResourceBundle("sap.ui.ux3").getText("SHELL_MORE_BUTTON");
		var bSelected = false;
		if (oOverflowItem && oOverflowItem.getVisible()) {
			// This activation is from an overflow menu item: Change overflow button
			sText = oOverflowItem.getText();
			bSelected = true;
		}

		sText = sText.toUpperCase(); // TODO: This should be done in CSS, see also renderer

		var oButtonText = this.$("paneBarOverflowText");

		oButtonText.text(sText);
		oButtonText.attr("title", sText);
		oButtonText.toggleClass("sapUiUx3ShellPaneEntrySelected", bSelected);

		return this._adaptOverflowButtonHeight();
	};

	Shell.prototype._getPaneOverflowMenu = function() {
		return this.getAggregation("_paneOverflowMenu");
	};

	/**
	 * @returns an object defining the current focus in the Shell
	 */
	Shell.prototype.getFocusInfo = function() {
		try {
			var oElement = document.activeElement;
			return oElement ? {'sFocusId': oElement.id,'oFocusedElement': oElement} : {};
		} catch (ex) {
			// IE9 throws an Unspecified Error when accessing document.activeElement inside a frame before body.onload. This is not an issue, as there is just no focus yet to restore.
			return {};
		}
	};

	/**
	 * Restores focus according to the given oFocusInfo which has been acquired by calling Shell.getFocusInfo
	 * @param oFocusInfo
	 */
	Shell.prototype.applyFocusInfo = function(oFocusInfo) {
		var oElement = jQuery.sap.domById(oFocusInfo.sFocusId)
		|| oFocusInfo.oFocusedElement; // if not even an ID was available when focus was lost maybe the original DOM element is still there
		jQuery.sap.focus(oElement); // also works for oElement == null
	};


	/**
	 *
	 * @private
	 * @static
	 */
	Shell._updateToolIcon = function(oDomRef) {
		if (oDomRef && oDomRef.firstChild) {
			var $elem = jQuery(oDomRef);
			var toolId = oDomRef.id.substr(oDomRef.id.indexOf(Shell.TOOL_PREFIX) + 6);
			var tool = sap.ui.getCore().byId(toolId);
			var icon;
			if ($elem.is(".sapUiUx3ShellToolSelected")) {
				icon = tool.getIconSelected();
			} else if ($elem.is(".sapUiUx3ShellToolHover")) {
				icon = tool.getIconHover();
			} else {
				icon = tool.getIcon();
			}
			oDomRef.firstChild.src = icon;
		}
	};


	Shell.prototype.onclick = function(oEvent) {
		this.onUserActivation(oEvent);
	};
	Shell.prototype.onsapspace = function(oEvent) {
		this.onUserActivation(oEvent);
	};
	Shell.prototype.onsapenter = function(oEvent) {
		this.onUserActivation(oEvent);
	};

	Shell.prototype.onUserActivation = function(oEvent) {
		var sTargetId = oEvent.target.id;
		var parent = oEvent.target.parentNode;
		var sId = this.getId();

		if (oEvent.target.className
			&& oEvent.target.className.indexOf /* not available for SVG elements */
			&& oEvent.target.className.indexOf("sapUiUx3ShellHeader-logout") > -1) { // logout button clicked
			this.fireLogout();

		} else if (parent && parent.parentNode
			&& parent.parentNode.className
			&& parent.parentNode.className.indexOf /* not available for SVG elements */
			&& parent.parentNode.className.indexOf("sapUiUx3ShellToolPaletteArea") > -1) {  // tool item clicked
			this._handleToolItemClick(sTargetId);

		} else if (parent && parent.parentNode
			&& parent.parentNode.parentNode
			&& parent.parentNode.parentNode.className
			&& parent.parentNode.parentNode.className.indexOf /* not available for SVG elements */
			&& parent.parentNode.parentNode.className.indexOf("sapUiUx3ShellToolPaletteArea") > -1) {  // image in tool item clicked
			this._handleToolItemClick(parent.id);

		} else if (sTargetId === sId + "-paneBarOverflowText") {
			// Show/Hide overflow menu
			var oTarget = this.$("paneBarOverflowButton")[0];
			this._getPaneOverflowMenu().open(
				true,
				oTarget,
				(this._bRtl ? "left" : "right") + " bottom",
				"center center",
				oTarget
			);

		} else if (sTargetId) {
			if (parent && parent.className
				&& parent.className.indexOf /* not available for SVG elements */
				&& parent.className.indexOf("sapUiUx3ShellPaneEntries") > -1) {  // pane bar item clicked

				this._handlePaneBarItemClick(sTargetId);
			}
		}
	};


	/* ====== WORKSET ITEMS ====== */


	Shell.prototype._handleWorksetBarSelect = function(oEvent) {
		var bProcessSelection = this._handleWorksetItemClick(oEvent.getParameter("item"));
		if (!bProcessSelection) {
			oEvent.preventDefault();
		}
	};

	Shell.prototype._handleFacetBarSelect = function(oEvent) {
		var bProcessSelection = this._handleWorksetItemClick(oEvent.getParameter("item"));
		if (!bProcessSelection) {
			oEvent.preventDefault();
		}
	};


	Shell.prototype._handleWorksetItemClick = function(oElement) {
		var parent = oElement.getParent(),
		id = oElement.getId(),
		facetId = id,
		bProcessSelection = true;

		if (parent instanceof Shell) { // 1st-level
			if (id != this._sSelectedWorksetId) {   // it's actually a change

				var aSubItems = oElement.getSubItems();
				if (aSubItems.length > 0) {
					facetId = aSubItems[0].getId();
				}

				// tell the application what the user has done and give the chance to supply new/more/changed subitems
				bProcessSelection = this._fireWorksetItemSelected(facetId);
				if (bProcessSelection) {

					this._sSelectedWorksetId = id;
					if (aSubItems.length > 0) {
						this._sSelectedFacetId = aSubItems[0].getId();
						id = this._sSelectedFacetId; // the user clicked first-level, but if the first-level has children there must be one of them selected
					} else {
						this._sSelectedFacetId = null;
					}

					// if the application modifies/sets the selected subId, this should work, as long as this._sSelectedFacetId is updated

					// application has received the event and potentially modified the subitems
					var aSubItems = oElement.getSubItems();
					this._oFacetBar.setAssociatedItems(aSubItems, true); // exchange the items in the second-level navigation; force an "arrow flies in" animation

					var $FacetBar = this.$("facetBar");
					var iFacetBarHeight = this._calcFacetBarHeight($FacetBar);

					// hide/show the second-level navigation
					if (aSubItems.length > 0) {
						if (!this._oFacetBar.isSelectedItemValid()) {
							this._oFacetBar.setSelectedItem(aSubItems[0]);
							this._sSelectedFacetId = aSubItems[0].getId();
						}
						$FacetBar.slideDown();
						this._adaptContentHeight(null, true, iFacetBarHeight);
					} else {
						this._oFacetBar.setSelectedItem(null);
						$FacetBar.slideUp();
						this._adaptContentHeight(null, true, iFacetBarHeight);
					}
				}
			}

		} else {									 // 2nd-level - it is a sub-item
			if (id != this._sSelectedFacetId) { // it's actually a change
				bProcessSelection = this._fireWorksetItemSelected(facetId);
				if (bProcessSelection) {
					this._sSelectedFacetId = id;
				}
			}
		}
		return bProcessSelection;
	};


	Shell.prototype._fireWorksetItemSelected = function(sId) {
		var item = sap.ui.getCore().byId(sId);
		var key = (item ? item.getKey() : null);
		var bProcessSelection = this.fireWorksetItemSelected({id:sId,item:item,key:key});
		if (bProcessSelection) {
			this.setAssociation("selectedWorksetItem", sId, true); // update the internal and publicly available knowledge about which item is selected
		}
		return bProcessSelection;
	};





	/* ====== TOOL PALETTE ====== */

	Shell.prototype._closeCurrentToolPopup = function() {
		var sOpenToolId;
		if (this._oOpenToolPopup) {
			sOpenToolId = this._oOpenToolPopup.getId();
			jQuery.sap.byId(this.getId() + Shell.TOOL_PREFIX + this._oOpenToolPopup.getId()).removeClass("sapUiUx3ShellToolSelected").attr("aria-pressed", "false");
			if (sOpenToolId === this.getId() + "-feederTool") {
				var feeder = sap.ui.getCore().byId(this.getId() + "-feeder");
				feeder.setText("");
				feeder.rerender();
			}
			this._oOpenToolPopup.close();
			this._oOpenToolPopup = null;
		}
		return sOpenToolId;
	};

	Shell.prototype._handleToolItemClick = function(sId) {

		// close any previously open tool and remember ID of open tool, so it does not get opened again below
		var sAlreadyOpenId = this._closeCurrentToolPopup();

		// identify new tool
		var tool;
		var toolId = sId.substr(sId.indexOf(Shell.TOOL_PREFIX) + 6);
		if (toolId == (this.getId() + "-searchTool")) {
			tool = this._getSearchTool();
		} else if (toolId == (this.getId() + "-feederTool")) {
			tool = this._getFeederTool();
		} else  {
			// application tool clicked
			tool = sap.ui.getCore().byId(toolId);
		}

		// open the new tool
		if (tool && (tool.getId() != sAlreadyOpenId)) {
			this._oOpenToolPopup = tool;
			tool.setPosition(sap.ui.core.Popup.Dock.BeginTop, sap.ui.core.Popup.Dock.EndTop, jQuery.sap.domById(sId), "13 -6", "fit");
			tool.open();

			// mark icon as "tool opened"
			jQuery.sap.byId(sId).addClass("sapUiUx3ShellToolSelected").attr("aria-pressed", "true");
			Shell._updateToolIcon(jQuery.sap.domById(sId));

			// need to reset the icon also when the tool is closed by the application
			var that = this;
			var fnOnClosed = function(oEvent) {
				tool.detachClosed(fnOnClosed);

				if (that._oOpenToolPopup && that._oOpenToolPopup.getId() === oEvent.getParameter("id")) {
					//that._oOpenToolPopup = null;
					that._closeCurrentToolPopup();
				}

				jQuery.sap.byId(sId).removeClass("sapUiUx3ShellToolSelected");
				Shell._updateToolIcon(jQuery.sap.domById(sId));
			};
			tool.attachClosed(fnOnClosed);

		} else if (tool.getId() == sAlreadyOpenId) {
			Shell._updateToolIcon(jQuery.sap.domById(sId));
		}
	};


	/**
	 * Returns whether or not the design is dark, which means that for example the
	 * ToolPopup should be dark as well (inverted-property set to true), which in
	 * turn means that the popup content should be dark...
	 *
	 * @private
	 * @returns Boolean
	 */
	Shell.prototype._hasDarkDesign = function() {
		return (
			this.getDesignType() !== sap.ui.ux3.ShellDesignType.Light
			&& this.getDesignType() !== sap.ui.ux3.ShellDesignType.Crystal
		);
	};

	Shell.prototype._getSearchTool = function() {
		if (!this._oSearchPopup) {
			var rb = sap.ui.getCore().getLibraryResourceBundle("sap.ui.ux3");
			this._oSearchPopup = new sap.ui.ux3.ToolPopup(this.getId() + "-searchTool", {tooltip:rb.getText("SHELL_SEARCH")}).addStyleClass("sapUiUx3TP-search");

			// Create the popup in an inverted state if the shell is dark.
			// This will be changed when the design is changed: see setDesignType()
			var bInverted = this._hasDarkDesign();
			this._oSearchPopup.setInverted(bInverted);

			var that = this;
			var sf = new sap.ui.commons.SearchField(this.getId() + "-searchField", {
				enableListSuggest: false,
				search: function(oEvent) {
					that.fireSearch({text:oEvent.getParameter("query")});
				}
			});
			var label = new sap.ui.commons.Label({text:rb.getText("SHELL_SEARCH_LABEL") + ":"}).setLabelFor(sf);
			this._oSearchPopup.addContent(label).addContent(sf);
			this._oSearchPopup.attachOpen(function(){
				window.setTimeout(function(){sf.focus();},100);
			});
			this._oSearchField = sf;
		}
		return this._oSearchPopup;
	};


	/**
	 * Returns the SearchField control which is used in the Search Tool.
	 *
	 * @type sap.ui.commons.SearchField
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	Shell.prototype.getSearchField = function() {
		if (!this._oSearchField) {
			this._getSearchTool();
		}
		return this._oSearchField;
	};

	Shell.prototype._getFeederTool = function() {
		if (!this._oFeederPopup) {
			var that = this;
			var rb = sap.ui.getCore().getLibraryResourceBundle("sap.ui.ux3");
			this._oFeederPopup = new sap.ui.ux3.ToolPopup(this.getId() + "-feederTool", {tooltip:rb.getText("SHELL_FEEDER")}).addStyleClass("sapUiUx3TP-feeder");

			// Create the popup in an inverted state if the shell is dark.
			// This will be changed when the design is changed: see setDesignType()
			var bInverted = this._hasDarkDesign();
			this._oFeederPopup.setInverted(bInverted);

			var f = new sap.ui.ux3.Feeder(this.getId() + "-feeder", {type:sap.ui.ux3.FeederType.Medium,submit:function(oEvent){
				that.fireFeedSubmit({text:oEvent.getParameter("text")});
				f.setText("");
				f.rerender();
				that._oFeederPopup.close();
			}});
			this._oFeederPopup.setInitialFocus(this.getId() + "-feeder");
			this._oFeederPopup.attachClose(function(){
				// TODO: maybe the text should stay when closing?
				f.setText("");
			});
			this._oFeederPopup.addContent(f);
		}
		return this._oFeederPopup;
	};




	/* ====== PANE BAR ====== */



	/**
	 * Opens the side Pane.
	 *
	 * A valid ID of a paneBarItem must be given, so this item can be marked as selected. A "paneBarItemSelected" event is then fired as if the opening was triggered by the user by a click on the respective PaneBarItem.
	 * This method can be called (with different IDs) even when the Pane is already open. It has then the same effect as if the user switches between PaneBarItems.
	 *
	 * Returns 'this' to allow method chaining.
	 *
	 * @param {string} sPaneBarItemId
	 *         The ID of the PaneBarItem which should be marked as selected.
	 * @type sap.ui.ux3.Shell
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	Shell.prototype.openPane = function(sPaneId) {
		var that = this;
		jQuery.sap.assert(typeof sPaneId === "string", "sPaneId must be given as string");
		var item = sap.ui.getCore().byId(sPaneId);
		if (item && (sPaneId != this._sOpenPaneId) && this.getShowPane()) {
			var key;
			if (item) {
				if (item.getKey() == "") {
					key = null;
				} else {
					key = item.getKey();
				}
			} else {
				key = null;
			}
			this.firePaneBarItemSelected({"id":sPaneId,"item":item,"key":key});

			var oPaneButton = jQuery.sap.byId(sPaneId);
			oPaneButton.siblings().removeClass("sapUiUx3ShellPaneEntrySelected");
			oPaneButton.addClass("sapUiUx3ShellPaneEntrySelected");

			if (!this._sOpenPaneId) {
				// pane area not open yet, open it
				this._openPane(function() {
					// Due to the display:none of the pane bar content in bluecrystal in combination
					// with the jQuery-animation, we need to wait until the pane bar content animation
					// is finished and thus the content focusable by jQuery.
					that.focusPaneStart();
				});
			} else {
				// pane area already open for a different pane bar item - unselect that one
				jQuery.sap.byId(this.getId() + "-pb_" + this._sOpenPaneId).removeClass("sapUiUx3ShellPaneEntrySelected");
			}

			this._sOpenPaneId = sPaneId;

		}
		return this;
	};


	/**
	 * Closes the side Pane (if open).
	 *
	 * Returns 'this' to allow method chaining.
	 *
	 * @type sap.ui.ux3.Shell
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	Shell.prototype.closePane = function() {
		this._closePane();
		return this;
	};


	/**
	 * Returns 'true' if the side Pane is currently open.
	 *
	 * @type boolean
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	Shell.prototype.isPaneOpen = function() {
		return (this._sOpenPaneId != null);
	};


	Shell.prototype._handlePaneBarItemClick = function(sPaneId) {
		if (sPaneId === this._sOpenPaneId) { // close currently opened pane area
			this.closePane();
		} else { // a pane needs to be displayed
			this.openPane(sPaneId);
		}

		this._checkPaneBarOverflow();
	};



	(function() {

		Shell._SHELL_OFFSET_RIGHT = 0;   // can be changed during runtime
	//	sap.ui.ux3.Shell._PANE_OUTER_DISTANCE = 40; //TODO: Theme Parameter?

		Shell.prototype._closePane = function(fCompleteCallback) {
			if (!this._sOpenPaneId) {
				if (fCompleteCallback) {
					fCompleteCallback();
				}

				// If the paneId is not set, it  means that there was no open pane, thus
				// the paneClosed-event (see below where the callback is called as well)
				// is not fired.
				return;
			}

			// Keep the pane-ID for use as a parameter to the paneClosed-event below
			var sOpenPaneId = this._sOpenPaneId;
			var that = this; // this-reference for closures below

			var id = this.getId();
			var dist = this.getShowPane() ? (jQuery.sap.byId(id + "-paneBarRight").outerWidth() + Shell._SHELL_OFFSET_RIGHT) : Shell._SHELL_OFFSET_RIGHT;
			var props = {};
			props[this._bRtl ? "left" : "right"] = dist + "px";
			var props2 = {};
			props2[this._bRtl ? "marginLeft" : "marginRight"] = (dist - Shell._SHELL_OFFSET_RIGHT) + "px";

			jQuery.sap.byId(id + "-content").css("overflow-x", "hidden");
			jQuery.sap.byId(id + "-canvas").stop().animate(props);
			jQuery.sap.byId(id + "-notify").stop().animate(props);
			this._getSyncRefs().stop(false, true).animate(props);
			jQuery.sap.byId(id + "-wBar").stop().animate(props2);
			jQuery.sap.byId(id + "-paneBar")
				.removeClass("sapUiUx3ShellPaneBarOpened")
				.addClass("sapUiUx3ShellPaneBarClose");
			jQuery.sap.byId(id + "-canvasBackground")
			.removeClass("sapUiUx3ShellCanvasBackgroundOpen")
			.addClass("sapUiUx3ShellCanvasBackgroundClosed")
			.stop().animate(props, function() {
				jQuery.sap.byId(id + "-paneBar").removeClass("sapUiUx3ShellPaneBarOpen");
				jQuery.sap.byId(id + "-content").css("overflow-x", "");
				if (fCompleteCallback) {
					fCompleteCallback();
				}

				// When pane closing is finished, the event paneClosed is fired with
				// the id of the closed pane in its parameter.
				that.firePaneClosed({ "id" : sOpenPaneId });
			});

			jQuery.sap.byId(this._sOpenPaneId).removeClass("sapUiUx3ShellPaneEntrySelected");
			this._sOpenPaneId = null;
		};

		Shell.prototype._openPane = function(fnOpenedCallback) {
			var id = this.getId();
			var PANE_WIDTH = this.getPaneWidth();
			var iPaneBarWidth = jQuery.sap.byId(id + "-paneBarRight").outerWidth();

			jQuery.sap.byId(id + "-content").css("overflow-x", "hidden");
			if (this._bRtl) {
				jQuery.sap.byId(id + "-paneBar")
					.removeClass("sapUiUx3ShellPaneBarClose")
					.addClass("sapUiUx3ShellPaneBarOpen");
				jQuery.sap.byId(id + "-wBar").stop().animate({marginLeft: (PANE_WIDTH + iPaneBarWidth) + "px"});
				jQuery.sap.byId(id + "-canvas").stop().animate({left: (PANE_WIDTH + iPaneBarWidth + Shell._SHELL_OFFSET_RIGHT) + "px"});
				jQuery.sap.byId(id + "-notify").stop().animate({left: (PANE_WIDTH + iPaneBarWidth + Shell._SHELL_OFFSET_RIGHT) + "px"});
				this._getSyncRefs().stop(false, true).animate({left: (PANE_WIDTH + iPaneBarWidth + Shell._SHELL_OFFSET_RIGHT) + "px"});
				jQuery.sap.byId(id + "-canvasBackground").stop().animate({left: (PANE_WIDTH + iPaneBarWidth + Shell._SHELL_OFFSET_RIGHT) + "px"}, function() {
					jQuery.sap.byId(id + "-content").css("overflow-x", "");
					jQuery.sap.byId(id + "-canvasBackground").removeClass("sapUiUx3ShellCanvasBackgroundClosed").addClass("sapUiUx3ShellCanvasBackgroundOpen");
					jQuery.sap.byId(id + "-paneBar").addClass("sapUiUx3ShellPaneBarOpened");

					if (fnOpenedCallback) {
						fnOpenedCallback();
					}
				});
			} else {
				jQuery.sap.byId(id + "-paneBar")
					.removeClass("sapUiUx3ShellPaneBarClose")
					.addClass("sapUiUx3ShellPaneBarOpen");
				jQuery.sap.byId(id + "-wBar").stop().animate({marginRight: (PANE_WIDTH + iPaneBarWidth) + "px"});
				jQuery.sap.byId(id + "-canvas").stop().animate({right: (PANE_WIDTH + iPaneBarWidth + Shell._SHELL_OFFSET_RIGHT) + "px"});
				jQuery.sap.byId(id + "-notify").stop().animate({right: (PANE_WIDTH + iPaneBarWidth + Shell._SHELL_OFFSET_RIGHT) + "px"});
				this._getSyncRefs().stop(false, true).animate({right: (PANE_WIDTH + iPaneBarWidth + Shell._SHELL_OFFSET_RIGHT) + "px"});
				jQuery.sap.byId(id + "-canvasBackground").stop().animate({right: (PANE_WIDTH + iPaneBarWidth + Shell._SHELL_OFFSET_RIGHT) + "px"}, function() {
					jQuery.sap.byId(id + "-content").css("overflow-x", "");
					jQuery.sap.byId(id + "-canvasBackground").removeClass("sapUiUx3ShellCanvasBackgroundClosed").addClass("sapUiUx3ShellCanvasBackgroundOpen");
					jQuery.sap.byId(id + "-paneBar").addClass("sapUiUx3ShellPaneBarOpened");

					if (fnOpenedCallback) {
						fnOpenedCallback();
					}
				});
			}
		};

		Shell.prototype.setPaneWidth = function (iWidth) {
			if (typeof iWidth == "number" && (iWidth > 0)) {
				iWidth = Math.max(iWidth, 50);

				// apply width
				if (this.getDomRef()) {
					var id = this.getId();
					jQuery.sap.byId(id + "-paneContent").css("width", iWidth + "px");
					jQuery.sap.byId(id + "-paneBar").css("width", (iWidth + Shell.SIDE_BAR_BASE_WIDTH) + "px");

					if (!!this._sOpenPaneId) { // pane area is open
						if (this._bRtl) {
							jQuery.sap.byId(id + "-wBar").css("marginLeft", (iWidth + Shell.SIDE_BAR_BASE_WIDTH) + "px");
							jQuery.sap.byId(id + "-canvas").css("left", (iWidth + Shell.SIDE_BAR_BASE_WIDTH + Shell._SHELL_OFFSET_RIGHT) + "px");
							jQuery.sap.byId(id + "-notify").css("left", (iWidth + Shell.SIDE_BAR_BASE_WIDTH + Shell._SHELL_OFFSET_RIGHT) + "px");
							this._getSyncRefs().css("left", (iWidth + Shell.SIDE_BAR_BASE_WIDTH + Shell._SHELL_OFFSET_RIGHT) + "px");
							jQuery.sap.byId(id + "-canvasBackground").css("left", (iWidth + Shell.SIDE_BAR_BASE_WIDTH + Shell._SHELL_OFFSET_RIGHT) + "px");
						} else {
							jQuery.sap.byId(id + "-wBar").css("marginRight", (iWidth + Shell.SIDE_BAR_BASE_WIDTH) + "px");
							jQuery.sap.byId(id + "-canvas").css("right", (iWidth + Shell.SIDE_BAR_BASE_WIDTH + Shell._SHELL_OFFSET_RIGHT) + "px");
							jQuery.sap.byId(id + "-notify").css("right", (iWidth + Shell.SIDE_BAR_BASE_WIDTH + Shell._SHELL_OFFSET_RIGHT) + "px");
							this._getSyncRefs().css("right", (iWidth + Shell.SIDE_BAR_BASE_WIDTH + Shell._SHELL_OFFSET_RIGHT) + "px");
							jQuery.sap.byId(id + "-canvasBackground").css("right", (iWidth + Shell.SIDE_BAR_BASE_WIDTH + Shell._SHELL_OFFSET_RIGHT) + "px");
						}
					}
				}

				this.setProperty("paneWidth", iWidth, true);
			}

			return this;
		};

		/**
		 * Moves the complete Shell away from the right window border by the given number of pixels (left border in RTL case).
		 *
		 * So there is space for a sidebar or so outside the Shell. The CSS class 'sapUiUx3ShellOuterSideBar' provides the basic position
		 * capabilities for the sidebar DOM element.
		 *
		 * This feature is not public. The usage is only granted to special groups on request.
		 *
		 * @param {int} px how many pixels of free space should be next to the Shell (between 0 and 600)
		 * @param {function} [complete] optional callback function to call after the animation
		 * @param {string} [outerId] optional id of the content representing the outside sidebar. If specified the width of the content is animated.
		 * @since 1.7.0
		 *
		 * @protected
		 */
		Shell.prototype.setOffsetRight = function(px, complete, outerId) {
			if (px < 0) {
				px = 0;
			}
			if (px > 600) {
				px = 600;
			}

			// adapt value used for animations
			Shell._SHELL_OFFSET_RIGHT = px;

			// adapt DOM elements
			var pxVal = px + "px";
			var id = this.getId();
			var animCnfg = this._bRtl ? {"left": pxVal} : {"right": pxVal};

			jQuery.sap.byId(id + "-hdr").stop().animate(animCnfg);
			jQuery.sap.byId(id + "-hdrImg").stop().animate(animCnfg);
			jQuery.sap.byId(id + "-bg").stop().animate(animCnfg, function() {
				if (complete) {
					complete();
				}
			});

			jQuery.sap.byId(id + "-bgImg").stop().animate(animCnfg);
			jQuery.sap.byId(id + "-wBar").stop().animate(animCnfg);
			jQuery.sap.byId(id + "-paneBar").stop().animate(animCnfg);
			jQuery.sap.byId(outerId).stop().animate({"width": pxVal});

			if (!this.$().hasClass("sapUiUx3ShellNoPane")) {
				pxVal = (px + (this._sOpenPaneId ? this.getPaneWidth() : 0) + Shell.SIDE_BAR_BASE_WIDTH) + "px";
			}

			animCnfg = this._bRtl ? {"left": pxVal} : {"right": pxVal};

			jQuery.sap.byId(id + "-notify").stop().animate(animCnfg);
			this._getSyncRefs().stop(false, true).animate(animCnfg);
			jQuery.sap.byId(id + "-canvas").stop().animate(animCnfg);
			jQuery.sap.byId(id + "-canvasBackground").stop().animate(animCnfg);
		};

		Shell.prototype._refreshCanvasOffsetRight = function(bPaneShown) {
			var id = this.getId();
			var right = this._bRtl ? "left" : "right";
			var pxVal = Shell._SHELL_OFFSET_RIGHT;
			if (bPaneShown) {
				var iPaneBarWidth = jQuery.sap.byId(id + "-paneBarRight").outerWidth();
				pxVal = pxVal + (this._sOpenPaneId ? this.getPaneWidth() : 0) + iPaneBarWidth;
			}
			pxVal = pxVal + "px";

			jQuery.sap.byId(id + "-notify").css(right, pxVal);
			jQuery.sap.byId(id + "-canvas").css(right, pxVal);
			jQuery.sap.byId(id + "-canvasBackground").css(right, pxVal);
			this._getSyncRefs().css(right, pxVal);
		};

		Shell.prototype._setNotifyVisibility = function(sVisibleStatus) {
			var oNotificationBar = this.getNotificationBar();
			if (!oNotificationBar) {
				return;
			}

			if (!sVisibleStatus) {
				sVisibleStatus = oNotificationBar.getVisibleStatus();
			}

			var $notify = this.$("notify");
			var $syncRef = this._topSyncRefId ? jQuery.sap.byId(this._topSyncRefId) : jQuery(null);
			var bIsThingInspector = $syncRef.hasClass("sapUiUx3TI");

			var iHeight = 0;
			var iBottom = 0;

			if (sVisibleStatus === sap.ui.ux3.NotificationBarStatus.Min) {
				iHeight = 10;
			} else if (sVisibleStatus === sap.ui.ux3.NotificationBarStatus.Max || sVisibleStatus === sap.ui.ux3.NotificationBarStatus.Default) {
				if (this.getHeaderType() === sap.ui.ux3.ShellHeaderType.BrandOnly && bIsThingInspector) {
					iHeight = parseInt(oNotificationBar.getHeightOfStatus(sap.ui.ux3.NotificationBarStatus.Default), 10);
				} else {
					iHeight = 10;
				}
				iBottom = iHeight;
			}

			$notify.removeClass("sapUiUx3ShellNotifyTI").removeClass("sapUiUx3ShellNotifyOverlay");

			if (this._topSyncRefId) {
				this._getSyncRefs().animate({"bottom" : iBottom + "px"}, "fast");
				//$syncRef.css("bottom", iBottom+"px");
				if (iBottom > 0) {
					$notify.addClass(bIsThingInspector ? "sapUiUx3ShellNotifyTI" : "sapUiUx3ShellNotifyOverlay");
				}
			}

			// TODO replace 100000 when there is something smart to handle the z-index centrally
			if (sVisibleStatus === sap.ui.ux3.NotificationBarStatus.Min) {
				// this enables the NotificationBar to be usable if it's minimized.
				// If there is a ComboBox in the content area the NotificationBar should
				// be behind the ComboBox if the NotificationBar is minimized. Otherwise
				// the NotificationBar must cover all content.
				$notify.css("height", iHeight + "px").css("z-index", 1);
			} else {
				$notify.css("height", iHeight + "px").css("z-index", 100000);
			}

			if (iHeight > 0 && !this.$().hasClass("sapUiUx3ShellNotifyVisible")) {
				this.$().addClass("sapUiUx3ShellNotifyVisible");
			} else if (iHeight == 0 && this.$().hasClass("sapUiUx3ShellNotifyVisible")) {
				this.$().removeClass("sapUiUx3ShellNotifyVisible");
			}

			this._adaptContentHeight(sVisibleStatus);
		};



		/**
		 * Used to hand a DomRef to the Shell which should always cover the canvas area and also be animated
		 * with PaneBar opening/closing.
		 *
		 * Only to be used internally (by the ThingInspector/OverlayContainer)! Marking as "private", but
		 * actually is "package" visibility.
		 * @private
		 */
		Shell.prototype.syncWithCanvasSize = function(sId, bInit, fFocusFirst, fFocusLast, fApplyChanges) {
			var idx = jQuery.inArray(sId, this._aSyncRefStack);

			//Update sync ref data structure
			if (bInit) {
				var oRef = {id: sId, focusFirst: fFocusFirst, focusLast: fFocusLast, applyChanges: fApplyChanges};
				if (idx < 0) {
					this._aSyncRefStack.push(sId);
				}
				this._mSyncRefs[sId] = oRef;
				//notify TI for property changes
				oRef.applyChanges({showOverlay: this.getHeaderType() !== sap.ui.ux3.ShellHeaderType.BrandOnly});
			} else {
				if (idx >= 0) {
					delete this._mSyncRefs[sId];
					this._aSyncRefStack.splice(idx, 1);
				}
			}

			//Cleanup Shell
			this.$("canvas").removeAttr("aria-hidden");
			this.$("focusDummyTPStart").removeAttr("tabindex").unbind("focusin");
			this.$("focusDummyTPEnd").removeAttr("tabindex").unbind("focusin");
			this.$("focusDummyHdrStart").removeAttr("tabindex").unbind("focusin");
			this.$("focusDummyHdrEnd").removeAttr("tabindex").unbind("focusin");
			this.$("focusDummyPane").removeAttr("tabindex").unbind("focusin");
			this.$().toggleClass("sapUiUx3ShellBlockHeaderAccess", false);
			delete this._topSyncRefId;

			//Reinitialize Shell
			if (this._aSyncRefStack.length > 0) {
				var oRef = this._mSyncRefs[this._aSyncRefStack[this._aSyncRefStack.length - 1]];
				var $DomRefs = this._getSyncRefs();
				var oCanvas = this.getDomRef("canvas");
				$DomRefs.css(this._bRtl ? "right" : "left", (this.getShowTools() ? this.currentToolPaletteWidth : 0) + "px");
				var iRight = Shell._SHELL_OFFSET_RIGHT;
				if (this.getShowPane()) {
					iRight += Shell.SIDE_BAR_BASE_WIDTH;
					if (this._sOpenPaneId) {
						iRight += this.getPaneWidth();
					}
				}
				$DomRefs.css(this._bRtl ? "left" : "right", iRight + "px");
				$DomRefs.css("top", jQuery.sap.domById(this.getId() + (this.getAllowOverlayHeaderAccess() ? "-hdr" : "-hdrLine")).offsetHeight + "px");
				$DomRefs.css("bottom", "0");
				jQuery(oCanvas).attr("aria-hidden", "true");
				this.$("focusDummyTPEnd").attr("tabindex", "0").focusin(oRef.focusFirst);
				this.$("focusDummyHdrStart").attr("tabindex", "0").focusin(jQuery.proxy(this.focusPaneEnd, this));
				this.$("focusDummyHdrEnd").attr("tabindex", "0").focusin(jQuery.proxy(this.focusFirstTool, this));
				this.$("focusDummyTPStart").attr("tabindex", "0").focusin(jQuery.proxy(this.focusLastHdr, this));
				this.$("focusDummyPane").attr("tabindex", "0").focusin(oRef.focusLast);
				this.$().toggleClass("sapUiUx3ShellBlockHeaderAccess", !this.getAllowOverlayHeaderAccess());
				this._topSyncRefId = oRef.id;
			}

			jQuery.sap.require("jquery.sap.script");
			if (this._sUpdateNotificationZIndex) {
				jQuery.sap.clearDelayedCall(this._sUpdateNotificationZIndex);
				delete this._sUpdateNotificationZIndex;
			}
			this._sUpdateNotificationZIndex = jQuery.sap.delayedCall(0, this, function(){
				delete this._sUpdateNotificationZIndex;
				this._setNotifyVisibility();

				if (this._oOpenToolPopup && this._topSyncRefId) {
					var $syncRef = jQuery.sap.byId(this._topSyncRefId);
					this._oOpenToolPopup.$().css("z-index", parseInt($syncRef.css("z-index"), 10) + 1);
				}
			});
		};

	}());

	/**
	 * Returns a jQuery object containing all registered "special cases" aka overlays (ThingInspector,
	 * etc.) that cover the canvas area, but not the panes. Whenever the canvas size is changes, all
	 * these have to be updated as well.
	 *
	 * @private
	 * @return {jQuery} $Refs A jQuery-object referencing all "overlaying" elements
	 */
	Shell.prototype._getSyncRefs = function(){
		var aRefs = [];
		var oRef;
		for (var i = 0; i < this._aSyncRefStack.length; i++) {
			oRef = jQuery.sap.domById(this._aSyncRefStack[i]);
			if (oRef) {
				aRefs.push(oRef);
			}
		}
		return jQuery(aRefs);
	};


	/**
	 * Focuses the first element in the Shell Header which is in the logical tab chain while the ThingInspector is open. This is either the first element in the header,
	 * or if there is no such element, it is the first tool.
	 *
	 * Only to be used internally (by the ThingInspector)! Marking as "private", but actually is "package" visibility.
	 * @private
	 */
	Shell.prototype.focusFirstHdr = function() {
		// tabbing forward into the page from the browser UI
		var oToFocus = this.$("hdr-items").firstFocusableDomRef();
		if (oToFocus && this.getAllowOverlayHeaderAccess() && this.getHeaderType() != sap.ui.ux3.ShellHeaderType.BrandOnly) {
			jQuery.sap.focus(oToFocus);
		} else {
			// otherwise focus the first tool
			this.focusFirstTool();
		}
	};

	/**
	 * Focuses the last element in the Shell Header which is in the logical tab chain while the ThingInspector is open. This is either the last element in the header,
	 * or if there is no such element, it is the last entry in the pane area.
	 *
	 * Only to be used internally (by the ThingInspector)! Marking as "private", but actually is "package" visibility.
	 * @private
	 */
	Shell.prototype.focusLastHdr = function() {
		// tabbing forward into the page from the browser UI
		var oToFocus = this.$("hdr-items").lastFocusableDomRef();
		if (oToFocus && this.getAllowOverlayHeaderAccess() && this.getHeaderType() != sap.ui.ux3.ShellHeaderType.BrandOnly) {
			jQuery.sap.focus(oToFocus);
		} else {
			// otherwise focus the last pane entry
			this.focusPaneEnd();
		}
	};

	/**
	 * Focuses the first element in the Shell which is in the logical tab chain while the ThingInspector is open. This is either the first Tool,
	 * or if there is no tool, it is the first item in the ThingInspector.
	 *
	 * Only to be used internally (by the ThingInspector)! Marking as "private", but actually is "package" visibility.
	 * @private
	 */
	Shell.prototype.focusFirstTool = function() {
		// tabbing forward into the page from the browser UI
		var $firstTool = this.$("tp").find(".sapUiUx3ShellTool").first();
		if ($firstTool.length && this.getShowTools()) {
			jQuery.sap.focus($firstTool[0]);
		} else {
			// otherwise focus the first item in the ThingInspector
			this._mSyncRefs[this._topSyncRefId].focusFirst();
		}
	};

	/**
	 * Focuses the last element in the tab chain which is logically BEFORE the ThingInspector
	 *
	 * Only to be used internally (by the ThingInspector)! Marking as "private", but actually is "package" visibility.
	 * @private
	 */
	Shell.prototype.focusLastTool = function() {
		// tabbing backward out of the ThingInspector
		var $lastTool = this.$("tp").find(".sapUiUx3ShellTool").last();
		if ($lastTool.length && this.getShowTools()) {
			jQuery.sap.focus($lastTool[0]);
		} else {
			// no tool present => jump to end of the Pane
			this.focusPaneEnd();
		}
	};

	/**
	 * Focuses the first element in the tab chain which is logically AFTER the ThingInspector
	 *
	 * Only to be used internally (by the ThingInspector)! Marking as "private", but actually is "package" visibility.
	 * @private
	 */
	Shell.prototype.focusPaneStart = function() {
		// tabbing forward, ThingInspector is being left
		var oToFocus = this.$("paneBar").firstFocusableDomRef();
		if (oToFocus) {
			jQuery.sap.focus(oToFocus);
		} else {
			// no focusable element in the pane => focus first tool
			this.focusFirstTool();
		}
	};

	/**
	 * Focuses the last element in the tab chain which belongs to the Shell Pane. This is also the "last" element of the Shell.
	 *
	 * @private
	 */
	Shell.prototype.focusPaneEnd = function() {
		// The ThingInspector tried to focus the last tool, but there was no tool. Or tools were being focused and we are tabbing backwards.
		var oToFocus = this.$("paneBar").lastFocusableDomRef();
		if (oToFocus) {
			jQuery.sap.focus(oToFocus);
		} else {
			// no focusable element in the pane, so focus the last element in the ThingInspector
			this._mSyncRefs[this._topSyncRefId].focusLast();
		}
	};


	//invalidation avoiding code

	Shell.prototype.setAppTitle = function(sAppTitle) {
		this.setProperty("appTitle", sAppTitle, true);
		this._rerenderHeader();
		return this;
	};

	Shell.prototype.setAppIcon = function(sAppIcon) {
		this.setProperty("appIcon", sAppIcon, true);
		this._rerenderHeader();
		return this;
	};

	Shell.prototype.setShowLogoutButton = function(bShowLogoutButton) {
		this.setProperty("showLogoutButton", bShowLogoutButton, true);
		this._rerenderHeader();
		return this;
	};

	Shell.prototype.setLogoutButtonTooltip = function(sTooltip) {
		this.setProperty("logoutButtonTooltip", sTooltip, true);
		this._rerenderHeader();
		return this;
	};

	Shell.prototype.insertHeaderItem = function(oHeaderItem, iIndex) {
		if (sap.ui.commons && sap.ui.commons.Button && (oHeaderItem instanceof sap.ui.commons.Button)) {
			oHeaderItem.setStyled(false);
		}
		this.insertAggregation("headerItems", oHeaderItem, iIndex, true);
		this._rerenderHeader();
		return this;
	};
	Shell.prototype.addHeaderItem = function(oHeaderItem) {
		if (sap.ui.commons && sap.ui.commons.Button && (oHeaderItem instanceof sap.ui.commons.Button)) {
			oHeaderItem.setStyled(false);
		}
		this.addAggregation("headerItems", oHeaderItem, true);
		this._rerenderHeader();
		return this;
	};
	Shell.prototype.removeHeaderItem = function(vIndex) {
		var result = this.removeAggregation("headerItems", vIndex, true);
		this._rerenderHeader();
		return result;
	};
	Shell.prototype.removeAllHeaderItems = function() {
		var result = this.removeAllAggregation("headerItems", true);
		this._rerenderHeader();
		return result;
	};
	Shell.prototype.destroyHeaderItems = function() {
		this.destroyAggregation("headerItems", true);
		this._rerenderHeader();
		return this;
	};


	Shell.prototype.setShowSearchTool = function(bShowSearchTool) {
		this.setProperty("showSearchTool", bShowSearchTool, true);
		this._rerenderToolPalette();
		return this;
	};

	Shell.prototype.setShowFeederTool = function(bShowFeederTool) {
		this.setProperty("showFeederTool", bShowFeederTool, true);
		this._rerenderToolPalette();
		return this;
	};

	Shell.prototype.setHeaderType = function(sHeaderType) {
		var sCurrentType = this.getHeaderType();
		this.setProperty("headerType", sHeaderType, true);
		this.$().removeClass("sapUiUx3ShellHead" + sCurrentType).addClass("sapUiUx3ShellHead" + this.getHeaderType());

		var $SyncRefs = this._getSyncRefs();
		if ($SyncRefs.length) {
			$SyncRefs.css("top", jQuery.sap.domById(this.getId() + (this.getAllowOverlayHeaderAccess() ? "-hdr" : "-hdrLine")).offsetHeight + "px");
		}

		//notify TI for changes
		var oChanges = {showOverlay: sHeaderType !== sap.ui.ux3.ShellHeaderType.BrandOnly};
		jQuery.each(this._mSyncRefs,function(sId,oRef) {
			oRef.applyChanges(oChanges);
		});
		return this;
	};

	Shell.prototype.setAllowOverlayHeaderAccess = function(bAllowOverlayHeaderAccess) {
		this.setProperty("allowOverlayHeaderAccess", bAllowOverlayHeaderAccess, true);

		var $SyncRefs = this._getSyncRefs();
		if ($SyncRefs.length) {
			this.$().toggleClass("sapUiUx3ShellBlockHeaderAccess", !this.getAllowOverlayHeaderAccess());
			$SyncRefs.css("top", jQuery.sap.domById(this.getId() + (this.getAllowOverlayHeaderAccess() ? "-hdr" : "-hdrLine")).offsetHeight + "px");
		}

		return this;
	};

	Shell.prototype.setDesignType = function(sDesignType) {
		var sCurrentType = this.getDesignType();
		this.setProperty("designType", sDesignType, true);

		// Set inverted state of registered tool popups based on design
		var bInverted = this._hasDarkDesign();

		if (this._oSearchPopup) {
			// If it does not exist at this time, the inverted state will be set on
			// creation of the ToolPopup: see _getSearchTool()
			this._oSearchPopup.setInverted(bInverted);
		}
		if (this._oFeederPopup) {
			// If it does not exist at this time, the inverted state will be set on
			// creation of the ToolPopup: see _getFeederTool()
			this._oFeederPopup.setInverted(bInverted);
		}

		// Make sure that all registered ToolPopups have the correct inverted state
		var aToolPopups = this.getToolPopups();
		for (var i = 0; i < aToolPopups.length; ++i) {
			aToolPopups[i].setInverted(bInverted);
		}



		this.$()
		.removeClass("sapUiUx3ShellDesign" + sCurrentType)
		.addClass("sapUiUx3ShellDesign" + sDesignType)
		.toggleClass("sapUiUx3ShellDesignLight", !bInverted);

		return this;
	};

	Shell.prototype.setShowTools = function(bShowTools) {
		this.setProperty("showTools", bShowTools, true);
		if (bShowTools) {
			this.$().removeClass("sapUiUx3ShellNoTools");
			this._checkResize();
		} else {
			this.$().addClass("sapUiUx3ShellNoTools");
			this._closeCurrentToolPopup();
			// Remove custom styles for ToolPalette size
			this.$("tp").attr("style", "");
		}

		this._checkToolPaletteSize(true); // Also updates SyncRefs

		return this;
	};


	Shell.prototype.setShowPane = function(bShowPane) {
		this.setProperty("showPane", bShowPane, true);

		if (bShowPane) {
			this.$().removeClass("sapUiUx3ShellNoPane");
			this._refreshCanvasOffsetRight(true);
			this._checkPaneBarOverflow();
		} else {
			var that = this;
			this._closePane(function() {
				that._refreshCanvasOffsetRight(false);
				that.$().addClass("sapUiUx3ShellNoPane");
			});
		}


		return this;
	};

	Shell.prototype.insertToolPopup = function(oToolPopup, iIndex) {
		this.insertAggregation("toolPopups", oToolPopup, iIndex, true);
		oToolPopup.attachIconChanged(this._rerenderToolPalette, this);
		this._rerenderToolPalette();
		return this;
	};

	Shell.prototype.addToolPopup = function(oToolPopup) {
		// Set inverted state of registered tool popups based on design
		var bInverted = this._hasDarkDesign();
		oToolPopup.setInverted(bInverted);

		this.addAggregation("toolPopups", oToolPopup, true);
		oToolPopup.attachIconChanged(this._rerenderToolPalette, this);
		this._rerenderToolPalette();
		return this;
	};

	Shell.prototype.removeToolPopup = function(vIndex) {
		var result = this.removeAggregation("toolPopups", vIndex, true);
		if (result === this._oOpenToolPopup) {
			this._closeCurrentToolPopup();
		}
		this._rerenderToolPalette();
		return result;
	};
	Shell.prototype.removeAllToolPopups = function() {
		var result = this.removeAllAggregation("toolPopups", true);
		this._rerenderToolPalette();
		return result;
	};
	Shell.prototype.destroyToolPopups = function() {
		this.destroyAggregation("toolPopups", true);
		this._rerenderToolPalette();
		return this;
	};

	Shell.prototype.insertContent = function(oContent, iIndex) {
		this.insertAggregation("content", oContent, iIndex, true);
		this._rerenderContent();
		return this;
	};
	Shell.prototype.addContent = function(oContent) {
		this.addAggregation("content", oContent, true);
		this._rerenderContent();
		return this;
	};
	Shell.prototype.removeContent = function(vIndex) {
		var result = this.removeAggregation("content", vIndex, true);
		this._rerenderContent();
		return result;
	};
	Shell.prototype.removeAllContent = function() {
		var result = this.removeAllAggregation("content", true);
		this._rerenderContent();
		return result;
	};
	Shell.prototype.destroyContent = function() {
		this.destroyAggregation("content", true);
		this._rerenderContent();
		return this;
	};



	Shell.prototype.addPaneBarItem = function(oPaneBarItem) {
		this.addAggregation("paneBarItems", oPaneBarItem, true);
		this._rerenderPaneBarItems();
		return this;
	};
	Shell.prototype.insertPaneBarItem = function(oPaneBarItem, iIndex) {
		this.insertAggregation("paneBarItems", oPaneBarItem, iIndex, true);
		this._rerenderPaneBarItems();
		return this;
	};
	Shell.prototype.removePaneBarItem = function(vPaneBarItem) {
		var oResult = this.removeAggregation("paneBarItems", vPaneBarItem, true);

		// Remove the corresponding item in the overflow-menu (if it exists)
		if (oResult) {
			var oItem = sap.ui.getCore().byId(oResult.getId() + "-overflow");
			if (oItem) {
				oItem.destroy();
			}
		}

		this._rerenderPaneBarItems();
		return oResult;
	};
	Shell.prototype.removeAllPaneBarItems = function() {
		var result = this.removeAllAggregation("paneBarItems", true);

		// Overflowmenu-entries are not needed anymore
		this._getPaneOverflowMenu().destroyItems();

		this._rerenderPaneBarItems();
		return result;
	};
	Shell.prototype.destroyPaneBarItems = function() {
		this.destroyAggregation("paneBarItems", true);

		// Overflowmenu-entries are not needed anymore
		this._getPaneOverflowMenu().destroyItems();

		this._rerenderPaneBarItems();
		return this;
	};

	Shell.prototype.addWorksetItem = function(oWorksetItem) {
		this.addAggregation("worksetItems", oWorksetItem, true);
		this._rerenderWorksetItems();
		return this;
	};
	Shell.prototype.insertWorksetItem = function(oWorksetItem, iIndex) {
		this.insertAggregation("worksetItems", oWorksetItem, iIndex, true);
		this._rerenderWorksetItems();
		return this;
	};
	Shell.prototype.removeWorksetItem = function(vWorksetItem) {
		var result = this.removeAggregation("worksetItems", vWorksetItem, true);
		this._rerenderWorksetItems();
		return result;
	};
	Shell.prototype.removeAllWorksetItems = function() {
		var result = this.removeAllAggregation("worksetItems", true);
		this._rerenderWorksetItems();
		return result;
	};
	Shell.prototype.destroyWorksetItems = function() {
		this.destroyAggregation("worksetItems", true);
		this._rerenderWorksetItems();
		return this;
	};

	(function() {

		function clearNotificationBar(oShell) {
			var oOldNotificationBar = oShell.getNotificationBar();
			if (oOldNotificationBar) {
				oShell._setNotifyVisibility(sap.ui.ux3.NotificationBarStatus.None);
				oOldNotificationBar.setVisibleStatus = oOldNotificationBar.__orig_setVisibleStatus;
				oOldNotificationBar.detachDisplay(oOldNotificationBar.__fHandleNotifyDisplay);
				delete oOldNotificationBar.__orig_setVisibleStatus;
				delete oOldNotificationBar.__fHandleNotifyDisplay;
			}
		}

		/**
		 * This sets a NotificationBar to the Shell. If there is a NotificationBar
		 * attached already the old one will be removed. Additionally the Shell attaches
		 * itself to the NotificationBar's <code>display</code>-event.
		 *
		 * @param {object} oNotificationBar is the NotificationBar that should be
		 * attached to the Shell
		 * @return {object} this to enable chaining of setters and getters
		 */
		Shell.prototype.setNotificationBar = function(oNotificationBar) {
			clearNotificationBar(this);
			if (oNotificationBar) {
				var that = this;
				oNotificationBar.__orig_setVisibleStatus = oNotificationBar.setVisibleStatus;
				oNotificationBar.setVisibleStatus = function(sVisibleStatus){
					this.__orig_setVisibleStatus.apply(this, arguments);
					that._setNotifyVisibility();
				};
			}
			this.setAggregation("notificationBar", oNotificationBar, true);
			this._rerenderNotificationArea();
			if (oNotificationBar) {
				oNotificationBar.__fHandleNotifyDisplay = function(oEvent){
					var bShow = oEvent ? oEvent.getParameter("show") : oNotificationBar.hasItems();
					oNotificationBar.setVisibleStatus(bShow ? sap.ui.ux3.NotificationBarStatus.Default : sap.ui.ux3.NotificationBarStatus.None);
				};
				oNotificationBar.attachDisplay(oNotificationBar.__fHandleNotifyDisplay);
				oNotificationBar.__fHandleNotifyDisplay();
			}
			return this;
		};

		Shell.prototype.destroyNotificationBar = function() {
			clearNotificationBar(this);
			this.destroyAggregation("notificationBar", true);
			this._rerenderNotificationArea();
			return this;
		};

	}());

	Shell.prototype._rerenderNotificationArea = function() {
		var $notify = this.$("notify");
		if ($notify.length > 0) {
			var rm = sap.ui.getCore().createRenderManager();
			sap.ui.ux3.ShellRenderer.renderNotificationArea(rm, this);
			rm.flush($notify[0], true);
			rm.destroy();
		}
	};

	Shell.prototype._rerenderHeader = function() {
		var $hdr = this.$("hdr");
		if ($hdr.length > 0) {
			var rm = sap.ui.getCore().createRenderManager();
			sap.ui.ux3.ShellRenderer.renderHeader(rm, this);
			rm.flush($hdr[0], true);
			rm.destroy();
		}
	};

	Shell.prototype._rerenderToolPalette = function() {
		var $tp = this.$("tp");
		if ($tp.length > 0) {
			var rm = sap.ui.getCore().createRenderManager();
			this._beforeRenderingToolPalette();
			sap.ui.ux3.ShellRenderer.renderToolPalette(rm, this);
			rm.flush($tp[0], true);
			this._afterRenderingToolPalette();
			rm.destroy();

			this._checkResize();
		}
	};

	Shell.prototype._beforeRenderingToolPalette = function() {
		// unbind the tool palette mouse (hover effect) handlers
		this.$("tp").find(".sapUiUx3ShellTool").unbind("mouseenter mouseleave");

		this.$("focusDummyTPEnd").unbind("focusin");
		this.$("focusDummyTPStart").unbind("focusin");
	};

	Shell.prototype._afterRenderingToolPalette = function() {
		// register hover effect handlers for application-provided tool icons
		var sIdPrefix = this.getId() + Shell.TOOL_PREFIX;
		var aToolItems = this.getToolPopups();

		var bValidOpenTool = false;
		if (this._oOpenToolPopup && this._oOpenToolPopup.isOpen() && (this.indexOfToolPopup(this._oOpenToolPopup) >= 0 || this._oOpenToolPopup === this._oSearchPopup || this._oOpenToolPopup === this._oFeederPopup)) {
			this._oOpenToolPopup.setPosition(sap.ui.core.Popup.Dock.BeginTop, sap.ui.core.Popup.Dock.EndTop, jQuery.sap.domById(sIdPrefix + this._oOpenToolPopup.getId()), "13 -6", "fit");
			var oPopupTool = jQuery.sap.domById(sIdPrefix + this._oOpenToolPopup.getId());
			jQuery(oPopupTool).toggleClass("sapUiUx3ShellToolSelected", true);
			Shell._updateToolIcon(oPopupTool);
			bValidOpenTool = true;
		}

		if (!bValidOpenTool && this._oOpenToolPopup) {
			this._closeCurrentToolPopup();
		}

		for (var i = 0; i < aToolItems.length; i++) {
			var oToolItem = aToolItems[i];
			if (oToolItem instanceof sap.ui.ux3.ToolPopup) {	// regular item
				jQuery.sap.byId(sIdPrefix + oToolItem.getId()).hover(
					/*eslint-disable no-loop-func */
					function(evt) {
						jQuery(this).toggleClass("sapUiUx3ShellToolHover", (evt.type === "mouseenter")); // set/remove class depending on mouseenter/mouseleave
						Shell._updateToolIcon(this);
					}
					/*eslint-enable no-loop-func */
				);
			}
		}

		if (this._topSyncRefId && this._mSyncRefs[this._topSyncRefId].focusFirst) {
			this.$("focusDummyTPEnd").attr("tabindex", "0").focusin(this._mSyncRefs[this._topSyncRefId].focusFirst);
		}
		if (this._aSyncRefStack.length > 0) {
			this.$("focusDummyTPStart").attr("tabindex", "0").focusin(jQuery.proxy(this.focusLastHdr, this));
		}
	};

	Shell.prototype._rerenderContent = function(bPreventPreserve) {
		var $content = this.$("content");
		if ($content.length > 0) {
			var aContent = this.getContent(),
			rm = sap.ui.getCore().createRenderManager();
			for (var i = 0; i < aContent.length; i++) {
				rm.renderControl(aContent[i]);
			}
			rm.flush($content[0], bPreventPreserve);
			rm.destroy();
		}
	};

	Shell.prototype._rerenderPane = function(bPreventPreserve) {
		var $paneContent = this.$("paneContent");
		if ($paneContent.length > 0) {
			var aPaneContent = this.getPaneContent(),
			rm = sap.ui.getCore().createRenderManager();
			for (var i = 0; i < aPaneContent.length; i++) {
				rm.renderControl(aPaneContent[i]);
			}
			rm.flush($paneContent[0], bPreventPreserve);
			rm.destroy();
		}
	};

	Shell.prototype._rerenderPaneBarItems = function() {
		var $PaneListRef = this.$("paneBar").find(".sapUiUx3ShellPaneEntries");

		if ($PaneListRef.length > 0) {
			var rm = sap.ui.getCore().createRenderManager();
			sap.ui.ux3.ShellRenderer.renderPaneBarItems(rm, this);
			rm.flush($PaneListRef[0]);
			rm.destroy();

			this._updatePaneBarItemNavigation($PaneListRef);
		}

		// Create overflow menu
		var that = this;
		var oMenu = this._getPaneOverflowMenu();
		var aPaneBarItems = this.getPaneBarItems();

		var fnOnItemSelect = function(oEvent) {
			// Emulate an event-object to "trick" the Shell into believing a real panel
			// item was selected
			var mPseudoEvent = {
				overflowItem : oEvent.getParameter("item"),
				target : {
					id : oEvent.getParameter("id").replace(/-overflow$/, ""),
					parentNode : {
						className : "sapUiUx3ShellPaneEntries"
					}
				}
			};

			that.onUserActivation(mPseudoEvent);
		};

		for (var i = 0; i < aPaneBarItems.length; ++i) {
			var sItemId = aPaneBarItems[i].getId() + "-overflow";
			var oItem = sap.ui.getCore().byId(sItemId);

			if (!oItem) {
				var oOverflowItem = new sap.ui.commons.MenuItem(sItemId, {
					text : aPaneBarItems[i].getText(),
					visible : false,
					select : fnOnItemSelect
				});

				oMenu.addItem(oOverflowItem);
			}
		}

		this._checkPaneBarOverflow($PaneListRef);
	};

	Shell.prototype._rerenderWorksetItems = function() {
		if (this.$("wBar").length > 0) {
			sap.ui.ux3.ShellRenderer.renderWorksetItems(null, this);
			sap.ui.ux3.ShellRenderer.renderFacetBar(null, this);
			var items = this._oFacetBar.getAssociatedItems();
			this._oFacetBar.$().css("display", (items && items.length > 0 ? "block" : "none"));
			this._adaptContentHeight();
		}
	};



	/* DEBUG code for tracking invalidation */

	/**
	 * Forces invalidation and rerendering (.invalidate() is disabled)
	 * @private
	 */
	Shell.prototype.forceInvalidation = Control.prototype.invalidate;

	/**
	 * Hack that prevents Shell invalidation by default.
	 * Later, invalidation should return to normal, but be prevented in all typical cases by bSuppressRerendering with explicit change handling.
	 *
	 * @private
	 */
	Shell.prototype.invalidate = function(oSource) {

		/* if (oSource == this) {
			// does not happen because the source is only given when propagating to a parent

		} else */ if (!oSource) {
			// direct invalidation of the Shell; this means a property has been modified
			this.forceInvalidation(); // let invalidation occur

		} else if (oSource instanceof sap.ui.ux3.NavigationItem) {
			// a workset item was changed/renamed or, more likely, subitems were added/exchanged
			if (this._oWorksetBar && this._oFacetBar) { // if already destroyed no update
				this._oWorksetBar.setAssociatedItems(this.getWorksetItems());
				var wsi = this.getSelectedWorksetItem();
				if (wsi) {
					var items;
					var sel = sap.ui.getCore().byId(wsi);
					if (sel && sel.getParent() instanceof sap.ui.ux3.NavigationItem) { // second-level item is selected
						this._oFacetBar.setAssociatedItems(sel.getParent().getSubItems()); // update the second-level NavigationBar as well
					} else if (sel && (items = sel.getSubItems())) {                            // toplevel item is selected and has children
						if (items && (items.length > 0)) {
							this._oFacetBar.setAssociatedItems(items); // update the second-level NavigationBar as well
						}
					} /* else {
						// toplevel item with no children, TODO: removing/adding the only child may be interesting to look at
					} */

					items = this._oFacetBar.getAssociatedItems();
					this._oFacetBar.$().css("display", (items && items.length > 0 ? "block" : "none"));
					this._adaptContentHeight();
				}
			}

		} else if ((oSource instanceof sap.ui.core.Item) && (oSource.getParent() == this)) {
			// a PaneBarItem was changed/added/removed
			this.forceInvalidation();

		} else if (oSource instanceof sap.ui.ux3.ToolPopup) {
			// This is needed for changes due to databinding. When the model changes for example the
			// tooltip, the Shell's invalidate function is called.
			this._rerenderToolPalette();

		} else if (this.indexOfHeaderItem(oSource) >= 0) {
			// a header item was invalidated - rerender the header
			this._rerenderHeader();

		} /* else {
			// a child was invalidated - TODO: check what kind of child and either handle directly or re-render
		} */
	};


	Shell.prototype._setParent = Control.prototype.setParent;
	Shell.prototype.setParent = function(oParent, sAggregationName, bSuppressRerendering) {
		this._setParent(oParent, sAggregationName, bSuppressRerendering);
		this.forceInvalidation(); // TODO: temporary hack to force invalidation when the Shell is added to a UiArea
	};


	/*  METHODS  */


	/**
	 * Replaces the existing Shell content with the given Control(-Tree). Only leads to a re-rendering of the content area (not the complete Shell).
	 * This method may be more convenient than a series of calls to "removeContent" and "addContent", which each lead to a re-rendering of the content area (but again not of the complete Shell).
	 *
	 * By default the old content is not destroyed and is returned by this method in an array for further usage. To avoid memory leaks, the old content should be destroyed (if not needed later), by setting the "destroyOldContent" flag or by destroying it manually later on. If "destroyOldContent" is set, an empty array is returned.
	 *
	 * @param {sap.ui.core.Control} oContent
	 *         The new Content. In this method it must be exactly one control (-tree). Use addContent() to add more control (-trees) to the main content area of the Shell.
	 * @param {boolean} bDestroyOldContent
	 *         If set, the controls previously contained in the Shell will be destroyed, to avoid memory leaks.
	 * @type sap.ui.core.Control[]
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	Shell.prototype.setContent = function(vContent, bDestruct) {
		jQuery.sap.assert(vContent === null
			|| (vContent instanceof Control)
			|| ((jQuery.isArray(vContent) && ((vContent.length > 0) ? (vContent[0] instanceof Control) : true))),
			"vContent must be a control or array of controls or null"); // only the first array element is checked
		jQuery.sap.assert((bDestruct === undefined || bDestruct === true || bDestruct === false), "bDestruct must be true, false, or undefined");

		var oldContent = [];
		var $content = this.$("content");
		var bPreventPreserve = false;

		if (!bDestruct) {
			oldContent = this.removeAllAggregation("content", true);

			if ($content.length > 0) {
				sap.ui.core.RenderManager.preserveContent($content[0]);
				bPreventPreserve = true;
				$content.empty();
			}
		} else {
			this.destroyAggregation("content", true);
		}

		// add new control(s) to aggregation
		if (vContent instanceof Control) { // one single control
			this.addAggregation("content", vContent, true);
		} else if (vContent && typeof (vContent) == "object" && vContent.length) { // an array of (hopefully) controls
			for (var i = 0; i < vContent.length; i++) {
				this.addAggregation("content", vContent[i], true);
			}
		}

		// if Shell is already rendered, update the UI
		this._rerenderContent(bPreventPreserve);

		return oldContent;
	};



	/**
	 * Replaces the existing side pane content with the given Control(-Tree). This method is optimized to only re-render the pane content (and not the shell) which is faster and smoother than any other way of changing the "paneContent" aggregation.
	 *
	 * By default, the old pane content is not destroyed and is returned by this method in an array for further usage. To avoid memory leaks, the old content should be destroyed (if not needed later), by setting the "destroyOldContent" flag or by destroying it manually later on. If "destroyOldContent" is set, an empty array is returned.
	 *
	 * @param {sap.ui.core.Control} oContent
	 *         The new Pane content. In this method it must be exactly one control (-tree). This could likely be a layout or a specific ux3 Pane control. Use addPaneContent() to add more control (-trees) to the Pane.
	 * @param {boolean} bDestroyOldContent
	 *         If set, the controls previously contained in the pane will be destroyed, to avoid memory leaks.
	 * @type sap.ui.core.Control[]
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	Shell.prototype.setPaneContent = function(vContent, bDestruct) {
		jQuery.sap.assert((vContent instanceof Control)
			|| ((jQuery.isArray(vContent) && ((vContent.length > 0) ? (vContent[0] instanceof Control) : true))),
			"vContent must be a control or array of controls"); // only the first array element is checked
		jQuery.sap.assert((bDestruct === undefined || bDestruct === true || bDestruct === false), "bDestruct must be true, false, or undefined");

		var oldContent = [];
		var $paneContent = this.$("paneContent");
		var bPreventPreserve = false;

		if (!bDestruct) {
			oldContent = this.removeAllAggregation("paneContent", true);

			if ($paneContent.length > 0) {
				sap.ui.core.RenderManager.preserveContent($paneContent[0]);
				bPreventPreserve = true; // HTML content is already preserved; do not do it again in the RenderManager
				$paneContent.empty();
			}
		} else {
			this.destroyAggregation("paneContent", true);
		}

		// add new control(s) to aggregation
		if (vContent instanceof Control) { // one single control
			this.addAggregation("paneContent", vContent, true);
		} else if (vContent && typeof (vContent) == "object" && vContent.length) { // an array of (hopefully) controls
			for (var i = 0; i < vContent.length; i++) {
				this.addAggregation("paneContent", vContent[i], true);
			}
		}

		// if Shell is already rendered, update the UI
		this._rerenderPane(bPreventPreserve);

		return oldContent;
	};



	Shell.prototype.getSelectedWorksetItem = function() {
		/* Initially, this is null
		 * There is a value as soon as:
		 * 1. The application sets a value
		 * 2. The Shell is rendered without a value (the first toplevel item will be used then (respectively its first child, if present))
		 */
		return this.getAssociation("selectedWorksetItem");
	};

	Shell.prototype.setSelectedWorksetItem = function(selectedWorksetItem) {
		var oldSelectedId = this.getSelectedWorksetItem();
		this.setAssociation("selectedWorksetItem", selectedWorksetItem, true);
		var newSelectedId = this.getSelectedWorksetItem();

		if (oldSelectedId != newSelectedId) { // only do something if selected item really changed
			var newSelectedItem = sap.ui.getCore().byId(newSelectedId);

			if (newSelectedItem) {

				this._sSelectedWorksetId = newSelectedId;
				this._sSelectedFacetId = null;

				var sub = newSelectedItem.getSubItems();
				if (sub.length > 0) { // app set a parent item that has children, so select automatically the first child
					newSelectedItem = sub[0];
				}

				if (newSelectedItem && (newSelectedItem.getParent() instanceof sap.ui.ux3.NavigationItem)) { // if selected item is sub-item
					var newParentItem = newSelectedItem.getParent();
					this._sSelectedWorksetId = newParentItem.getId();
					this._sSelectedFacetId = newSelectedItem.getId();

					this._oWorksetBar.setSelectedItem(newParentItem);
					this._oFacetBar.setAssociatedItems(newParentItem.getSubItems());
					this._oFacetBar.setSelectedItem(newSelectedItem);

					if (this.getDomRef()) {
						var $FacetBar = this.$("facetBar");
						var iFacetBarHeight = this._calcFacetBarHeight($FacetBar);
						$FacetBar.slideDown();
						this._adaptContentHeight(null, true, iFacetBarHeight);
					}

				} else if (newSelectedItem) {
					this._oWorksetBar.setSelectedItem(newSelectedItem);
					this._oFacetBar.setAssociatedItems([]);
					this._oFacetBar.setSelectedItem(null);

					if (this.getDomRef()) {
						var $FacetBar = this.$("facetBar");
						var iFacetBarHeight = this._calcFacetBarHeight($FacetBar);
						$FacetBar.slideUp();
						this._adaptContentHeight(null, true, iFacetBarHeight);
					}

				} /* else {
					// newSelectedItem == null  after selecting the child
				} */
			} else {
				// newSelectedItem == null
				throw new Error("WorksetItem with ID " + newSelectedId + " cannot be found.");
			}
		}

		return this;
	};


	/* FullHeight / ContentPadding */

	Shell.prototype.setApplyContentPadding = function(bApplyContentPadding) {
		this.setProperty("applyContentPadding", bApplyContentPadding, true); // no re-rendering
		this.$().toggleClass("sapUiUx3ShellNoContentPadding", !bApplyContentPadding);
		this._adaptContentHeight();
	};

	Shell.prototype.setFullHeightContent = function(bFullHeightContent) {
		this.setProperty("fullHeightContent", bFullHeightContent, true); // no re-rendering
		this.$().toggleClass("sapUiUx3ShellFullHeightContent", bFullHeightContent);
		this._adaptContentHeight();
	};

	Shell.prototype._calcFacetBarHeight = function($FacetBar){
		if (this._iFacetBarHeight === undefined) {
			this._iFacetBarHeight = 0;
		}

		if (!$FacetBar) {
			$FacetBar = this.$("facetBar");
		}
		if ($FacetBar.length > 0) {
			var h = this.$("facetBar").outerHeight(true);
			this._iFacetBarHeight = Math.max(this._iFacetBarHeight, h);
		}

		return this._iFacetBarHeight;
	};

	Shell.prototype._adaptContentHeight = function(sNotificationBarVisibleStatus, bAnimate, iFacetBarHeight) {
		if (!this.getDomRef()) {
			return;
		}

		var $content = this.$("content");
		var $canvas = this.$("canvas");

		if (this.getFullHeightContent()) {
			var bPad = this.getApplyContentPadding();
			var iTop = !bPad ? 0 : parseInt($canvas.css("paddingTop"), 10);
			var iLeft = !bPad ? 0 : parseInt($canvas.css("paddingLeft"), 10);
			var iRight = !bPad ? 0 : parseInt($canvas.css("paddingRight"), 10);

			var _iFacetBarHeight = iFacetBarHeight ? iFacetBarHeight : this._calcFacetBarHeight();

			var sTop = (iTop + (this._oFacetBar.getAssociatedItems().length > 0 ? _iFacetBarHeight : 0)) + "px";

			if (bAnimate) {
				$content.stop().animate({top: sTop});
			} else {
				$content.stop().css("top", sTop);
			}

			var oNotify = this.getNotificationBar();
			if (oNotify && !sNotificationBarVisibleStatus) {
				sNotificationBarVisibleStatus = oNotify.getVisibleStatus();
			}

			if (sNotificationBarVisibleStatus === sap.ui.ux3.NotificationBarStatus.Default
				|| sNotificationBarVisibleStatus === sap.ui.ux3.NotificationBarStatus.Max) {
				$content.css("bottom", oNotify.getHeightOfStatus(sap.ui.ux3.NotificationBarStatus.Default));
			} else {
				var iBottom = !bPad ? 0 : parseInt($canvas.css("paddingBottom"), 10);
				if (oNotify && sNotificationBarVisibleStatus === sap.ui.ux3.NotificationBarStatus.Min) {
					iBottom += sap.ui.ux3.NotificationBar.HOVER_ITEM_HEIGHT;
				}
				$content.css("bottom", iBottom + "px");
			}

			$content.css(this._bRtl ? "right" : "left", iLeft + "px");
			$content.css(this._bRtl ? "left" : "right", iRight + "px");
		} else {
			$content.removeAttr("style");
		}

		if (!!sap.ui.Device.browser.webkit) {
			//Force Webkit Browsers to do a repaint
			sap.ui.core.RenderManager.forceRepaint(this.getId() + "-canvas");
		}
	};


	/* Drag&Drop personalization */

	Shell.prototype._handleDragover = function(evt) {
		var id = evt.target.id;
		if (!this._dragOverBlinking) {
			var $bg = jQuery.sap.byId(id);
			$bg.css("opacity", "0.5");
			this._dragOverBlinking = true;
			var that = this;
			window.setTimeout(function(){
				$bg.css("opacity", "1");
				window.setTimeout(function(){
					that._dragOverBlinking = null;
				}, 300);
			}, 300);
		}
		return false;
	};
	Shell.prototype._handleDragend = function(evt) {
		return false;
	};
	Shell.prototype._handleDrop = function(evt) {
		var id = evt.target.id;
		evt.preventDefault();
		var e = evt.originalEvent;
		var file = e.dataTransfer.files[0];
		if (file) {
			// read file content
			var reader = new window.FileReader();
			reader.onload = jQuery.proxy(function(event) {
				var dataUrl = event.target.result;
				if (id == this.getId() + "-bgImg") {
					this._getPersonalization()._handleBackgroundImageChange(dataUrl, true);
				} else if (id == this.getId() + "-hdr") {
					this._getPersonalization()._handleHeaderImageChange(dataUrl, true);
				} else if (id == this.getId() + "-logoImg") {
					this._getPersonalization()._handleLogoImageChange(dataUrl, true);
				}
				reader = null;
			}, this);
			reader.readAsDataURL(file);
		}
	};



	Shell.prototype._getPersonalization = function() {
		if (!this.oPersonalization) {
			jQuery.sap.require("sap.ui.ux3.ShellPersonalization");
			this.oPersonalization = new sap.ui.ux3.ShellPersonalization(this);
		}
		return this.oPersonalization;
	};


	/**
	 * Experimental method! Do not use!
	 *
	 * @type void
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	Shell.prototype.openPersonalizationDialog = function() {
		this._getPersonalization().openDialog();
	};


	/**
	 * Experimental method! Do not use!
	 *
	 * Makes Shell personalization available and injects the given personalization settings. This should be called before the user can do any adaptations per drag&drop or using the personalization dialog. Otherwise it may override the user's new settings.
	 *
	 * @param {object} oSettings
	 *         Personalization settings object
	 * @type void
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	Shell.prototype.initializePersonalization = function(oSettings) {
		this._getPersonalization().initializeSettings(oSettings);
	};

	Shell.prototype.onThemeChanged = function(oEvent) {
		this._iFacetBarHeight = undefined;

		if (!this.getDomRef()) {
			// If there is no DOM-element, we cant do anything - onAfterRendering will be called later.
			return;
		}

		var sImage = "";
		// if already rendered update images
		if (!this.getAppIcon()) {
			sImage = Parameters._getThemeImage('sapUiUx3ShellApplicationImageURL', true);
			this.$("logoImg").attr('src', sImage);
		}

		sImage = Parameters._getThemeImage('sapUiUx3ShellHeaderImageURL', true);
		this.$("hdrImg").attr('src', sImage);

		sImage = Parameters._getThemeImage('sapUiUx3ShellBackgroundImageURL', true);
		this.$("bgImg").attr('src', sImage);

		this.$("facetBar").stop(true, true); //Stop potentially running animations
		this._adaptContentHeight();

		this._updateThemeVariables();

		this._checkResize();
	};


	return Shell;

}, /* bExport= */ true);
