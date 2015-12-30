/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.ux3.Feed.
sap.ui.define(['jquery.sap.global', 'sap/ui/commons/DropdownBox', 'sap/ui/commons/MenuButton', 'sap/ui/commons/SearchField', 'sap/ui/commons/ToggleButton', 'sap/ui/core/Control', './Feeder', './library'],
	function(jQuery, DropdownBox, MenuButton, SearchField, ToggleButton, Control, Feeder, library) {
	"use strict";


	
	/**
	 * Constructor for a new Feed.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * A container control representing a full feed page, including feeder and updates.
	 * @extends sap.ui.core.Control
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @experimental Since version 1.2. 
	 * The whole Feed/Feeder API is still under discussion, significant changes are likely. Especially text presentation (e.g. @-references and formatted text) is not final. Also the Feed model topic is still open.
	 * @alias sap.ui.ux3.Feed
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var Feed = Control.extend("sap.ui.ux3.Feed", /** @lends sap.ui.ux3.Feed.prototype */ { metadata : {
	
		library : "sap.ui.ux3",
		properties : {
	
			/**
			 * The path to the thumbnail image used for the feeder
			 */
			feederThumbnailSrc : {type : "sap.ui.core.URI", group : "Data", defaultValue : null},
	
			/**
			 * The sender of the feeder
			 */
			feederSender : {type : "string", group : "Data", defaultValue : null},
	
			/**
			 * Specifies whether the feed shall be in live mode
			 */
			live : {type : "boolean", group : "Behavior", defaultValue : true},
	
			/**
			 * Title text of the Feed. If no text is entered "FEED" is displayed.
			 */
			title : {type : "string", group : "Data", defaultValue : null}
		},
		aggregations : {
	
			/**
			 * Items of the filter
			 */
			filterItems : {type : "sap.ui.core.ListItem", multiple : true, singularName : "filterItem", bindable : "bindable"}, 
	
			/**
			 * The chunks
			 */
			chunks : {type : "sap.ui.ux3.FeedChunk", multiple : true, singularName : "chunk", bindable : "bindable"}, 
	
			/**
			 * MenuItems to open when the tool button is clicked by the user
			 */
			toolsMenuItems : {type : "sap.ui.commons.MenuItem", multiple : true, singularName : "toolsMenuItem", bindable : "bindable"}
		},
		events : {
	
			/**
			 * Event is fired when the filter is changed
			 */
			filterChange : {
				parameters : {
	
					/**
					 * The new/changed value of the filter
					 */
					newValue : {type : "string"}
				}
			}, 
	
			/**
			 * Event is fired when the search function on SearchField is triggered
			 */
			search : {
				parameters : {
	
					/**
					 * The search query
					 */
					query : {type : "string"}
				}
			}, 
	
			/**
			 * Event is fired when a new chunk is added
			 */
			chunkAdded : {
				parameters : {
	
					/**
					 * New chunk
					 */
					chunk : {type : "sap.ui.ux3.FeedChunk"}
				}
			}, 
	
			/**
			 * Event is fired when an item from the tools MenuButton was selected
			 */
			toolsItemSelected : {
				parameters : {
	
					/**
					 * The Id of the selected item
					 */
					itemId : {type : "string"}, 
	
					/**
					 * The selected item
					 */
					item : {type : "sap.ui.unified.MenuItemBase"}
				}
			}, 
	
			/**
			 * Event is fired when the live mode has changed
			 */
			toggleLive : {
				parameters : {
	
					/**
					 * Current live indicator
					 */
					live : {type : "boolean"}
				}
			}
		}
	}});
	
	
	///**
	// * This file defines behavior for the control,
	// */
	
	Feed.prototype.init = function(){
	
		this.rb = sap.ui.getCore().getLibraryResourceBundle("sap.ui.ux3");
		
		this.data("sap-ui-fastnavgroup", "true", true); // Define group for F6 handling
	
		// init sub-controls
		this.oFeeder = new Feeder( this.getId() + '-Feeder', {
			type: sap.ui.ux3.FeederType.Medium
		}).setParent(this);
		this.oFeeder.attachEvent('submit', this.handleFeederSubmit, this); // attach event this way to have the right this-reference in handler
	
		this.oLiveButton = new ToggleButton( this.getId() + '-liveButton', {
			text: this.rb.getText('FEED_LIVE'),
			pressed: this.getLive(), // initialize with default value because setter not called for it
			lite: true
		}).setParent(this);
		this.oLiveButton.attachEvent('press', this.handleLiveButtonPress, this); // attach event this way to have the right this-reference in handler
	
		this.oFilter = new DropdownBox( this.getId() + '-filter').setParent(this);
		this.oFilter.attachEvent('change', this.handleFilterChange, this); // attach event this way to have the right this-reference in handler
	
		this.oSearchField = new SearchField( this.getId() + '-search', {
			enableListSuggest: false
		}).setParent(this);
		this.oSearchField.attachEvent('search', this.handleSearchFieldSearch, this); // attach event this way to have the right this-reference in handler
	
	};
	
	/*
	 * create menu button without items. The items are added later
	 */
	Feed.prototype.initToolsButton = function(){
	
		if (!this.oToolsButton) {
			this.oToolsButton = new MenuButton( this.getId() + '-toolsButton', {
				tooltip: this.rb.getText('FEED_TOOLS'),
				lite: true,
				menu: new sap.ui.commons.Menu(this.getId() + '-toolsMenu')
			}).setParent(this);
			this.oToolsButton.attachEvent('itemSelected', this.handleLtoolsButtonSelected, this); // attach event this way to have the right this-reference in handler
	
			var sIcon = sap.ui.core.theming.Parameters.get('sap.ui.ux3.Feed:sapUiFeedToolsIconUrl');
			var sIconHover = sap.ui.core.theming.Parameters.get('sap.ui.ux3.Feed:sapUiFeedToolsIconHoverUrl');
			var sThemeModuleName = "sap.ui.ux3.themes." + sap.ui.getCore().getConfiguration().getTheme();
			if (sIcon) {
				this.oToolsButton.setProperty('icon', jQuery.sap.getModulePath(sThemeModuleName, sIcon), true);
			}
			if (sIconHover) {
				this.oToolsButton.setProperty('iconHovered', jQuery.sap.getModulePath(sThemeModuleName, sIconHover), true);
			}
		}
	
	};
	
	Feed.prototype.exit = function(){
	
		if (this.oFeeder) {
			this.oFeeder.destroy();
			delete this.oFeeder;
		}
		if (this.oLiveButton) {
			this.oLiveButton.destroy();
			delete this.oLiveButton;
		}
		if (this.oToolsButton) {
			this.oToolsButton.destroy();
			delete this.oToolsButton;
		}
		if (this.oFilter) {
			this.oFilter.destroy();
			delete this.oFilter;
		}
		if (this.oSearchField) {
			this.oSearchField.destroy();
			delete this.oSearchField;
		}
		this.rb = undefined;
	
	};
	
	/**
	 * Handler for feeder submit event
	 *
	 * @private
	 */
	Feed.prototype.handleFeederSubmit = function(oEvent){
	
		var oDate = new Date();
	//	var sDate = String(oDate.getFullYear()) + String(oDate.getMonth()) + String(oDate.getDate()) + String(oDate.getHours()) + String(oDate.getMinutes()) + String(oDate.getSeconds());
		var sDate = String(oDate);
	
		var oNewChunk = new sap.ui.ux3.FeedChunk(this.getId() + '-new-' + this.getChunks().length, {
			text: oEvent.getParameter('text'),
			commentChunk: false,
			deletionAllowed: true,
			timestamp: sDate,
			sender: this.getFeederSender(),
			thumbnailSrc: this.getFeederThumbnailSrc()
		});
	
		// new chunks are inserted at the top
		this.insertChunk(oNewChunk, 0);
		this.fireChunkAdded({chunk: oNewChunk});
	
	};
	
	/*
	 * overwrite of setLive
	 */
	Feed.prototype.setLive = function(bLive) {
		this.setProperty("live", bLive, true); //no re-rendering because only ToggleButton is changed
	
		if (this.oLiveButton) {
			// update ToggleButton
			this.oLiveButton.setPressed(bLive);
		}
		return this;
	};
	
	/**
	 * Handler for live-button press
	 *
	 * @private
	 */
	Feed.prototype.handleLiveButtonPress = function(oEvent){
	
		var bPressed = oEvent.getParameter("pressed");
	
		this.setProperty("live", bPressed, true); //no re-rendering because ToggleButton is already changed
		this.fireToggleLive({live: bPressed});
	
	};
	
	/**
	 * Handler for tools menu button item selection
	 *
	 * @private
	 */
	Feed.prototype.handleLtoolsButtonSelected = function(oEvent){
	
		// just forward event
		this.fireToolsItemSelected(oEvent.mParameters);
	
	};
	
	/**
	 * Handler for filter change
	 *
	 * @private
	 */
	Feed.prototype.handleFilterChange = function(oEvent){
	
		// just forward event
		this.fireFilterChange(oEvent.mParameters);
	
	};
	
	/**
	 * Handler for search field
	 *
	 * @private
	 */
	Feed.prototype.handleSearchFieldSearch = function(oEvent){
	
		// just forward event
		this.fireSearch(oEvent.mParameters);
	
	};
	
	/*
	 * Overwrite generated function
	 */
	Feed.prototype.setFeederThumbnailSrc = function(sFeederThumbnailSrc) {
	
		this.setProperty("feederThumbnailSrc", sFeederThumbnailSrc, true); // no rerendering, only feeder is changed
		this.oFeeder.setThumbnailSrc(sFeederThumbnailSrc);
		return this;
	
	};
	
	Feed.prototype.setLive = function(bLive) {
	
		this.setProperty("live", bLive, true); // no rerendering, only button is changed
		this.oLiveButton.setPressed(bLive);
		return this;
	
	};
	
	// connect toolsMenuItems to MenuButtons menu
	Feed.prototype.getToolsMenuItems = function() {
	
		if (this.oToolsButton) {
			// as parent of items is the menu use menus aggregation
			return this.oToolsButton.getMenu().getItems();
		}
	
	};
	
	Feed.prototype.insertToolsMenuItem = function(oToolsMenuItem, iIndex) {
	
		this.initToolsButton();
		// as parent of items is the menu use menus aggregation
		this.oToolsButton.getMenu().insertItem(oToolsMenuItem, iIndex);
		return this;
	
	};
	
	Feed.prototype.addToolsMenuItem = function(oToolsMenuItem) {
	
		this.initToolsButton();
		// as parent of items is the menu use menus aggregation
		this.oToolsButton.getMenu().addItem(oToolsMenuItem);
		return this;
	
	};
	
	Feed.prototype.removeToolsMenuItem = function(vToolsMenuItem) {
	
		if (this.oToolsButton) {
			// as parent of items is the menu use menus aggregation
			return this.oToolsButton.getMenu().removeItem(vToolsMenuItem);
		}
	
	};
	
	Feed.prototype.removeAllToolsMenuItems = function() {
	
		if (this.oToolsButton) {
			// as parent of items is the menu use menus aggregation
			return this.oToolsButton.getMenu().removeAllItems();
		}
	
	};
	
	Feed.prototype.indexOfToolsMenuItem = function(oToolsMenuItem) {
	
		if (this.oToolsButton) {
			// as parent of items is the menu use menus aggregation
			return this.oToolsButton.getMenu().indexOfItem(oToolsMenuItem);
		}
	
	};
	
	Feed.prototype.destroyToolsMenuItems = function() {
	
		if (this.oToolsButton) {
			// as parent of items is the menu use menus aggregation
			this.oToolsButton.getMenu().destroyItems();
		}
	
		return this;
	
	};
	
	Feed.prototype.bindToolsMenuItems = function(sPath, oTemplate, oSorter, aFilters) {
	
		this.initToolsButton();
		// as parent of items is the menu use menus aggregation
		this.oToolsButton.getMenu().bindItems(sPath, oTemplate, oSorter, aFilters);
	
		return this;
	
	};
	
	Feed.prototype.unbindToolsMenuItems = function() {
	
		if (this.oToolsButton) {
			this.oToolsButton.getMenu().unbindItems();
		}
	
		return this;
	
	};
	
	// connect filterItems to filter
	Feed.prototype.getFilterItems = function() {
	
		return this.oFilter.getItems();
	
	};
	
	Feed.prototype.insertFilterItem = function(oFilterItem, iIndex) {
	
		this.oFilter.insertItem(oFilterItem, iIndex);
		return this;
	
	};
	
	Feed.prototype.addFilterItem = function(oFilterItem) {
	
		this.oFilter.addItem(oFilterItem);
		return this;
	
	};
	
	Feed.prototype.removeFilterItem = function(vFilterItem) {
	
		return this.oFilter.removeItem(vFilterItem);
	
	};
	
	Feed.prototype.removeAllFilterItems = function() {
	
		return this.oFilter.removeAllItems();
	
	};
	
	Feed.prototype.indexOfFilterItem = function(oFilterItem) {
	
		return this.oFilter.indexOfItem(oFilterItem);
	
	};
	
	Feed.prototype.destroyFilterItems = function() {
	
		this.oFilter.destroyItems();
	
		return this;
	
	};
	
	Feed.prototype.bindFilterItems = function(sPath, oTemplate, oSorter, aFilters) {
	
		this.oFilter.bindItems(sPath, oTemplate, oSorter, aFilters);
	
		return this;
	
	};
	
	Feed.prototype.unbindFilterItems = function() {
	
		this.oFilter.unbindItems();
	
		return this;
	
	};
	

	return Feed;

}, /* bExport= */ true);
