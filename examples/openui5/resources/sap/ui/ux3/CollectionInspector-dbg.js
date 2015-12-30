/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.ux3.CollectionInspector.
sap.ui.define(['jquery.sap.global', 'sap/ui/core/Control', 'sap/ui/core/delegate/ItemNavigation', './library'],
	function(jQuery, Control, ItemNavigation, library) {
	"use strict";


	
	/**
	 * Constructor for a new CollectionInspector.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * CollectionInspector
	 * @extends sap.ui.core.Control
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @since 1.9.0
	 * @alias sap.ui.ux3.CollectionInspector
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var CollectionInspector = Control.extend("sap.ui.ux3.CollectionInspector", /** @lends sap.ui.ux3.CollectionInspector.prototype */ { metadata : {
	
		library : "sap.ui.ux3",
		properties : {
	
			/**
			 * Defines if the list of collection items is visible on the left
			 */
			sidebarVisible : {type : "boolean", group : "Appearance", defaultValue : true},
	
			/**
			 * If set to true, control will fit parents content area
			 */
			fitParent : {type : "boolean", group : "Appearance", defaultValue : true}
		},
		aggregations : {
	
			/**
			 * Collections which are displayed in the COllectionInspector
			 */
			collections : {type : "sap.ui.ux3.Collection", multiple : true, singularName : "collection"}, 
	
			/**
			 * All controls that are currently displayed
			 */
			content : {type : "sap.ui.core.Control", multiple : true, singularName : "content"}
		},
		associations : {
	
			/**
			 * Collection which is currently selected
			 */
			selectedCollection : {type : "sap.ui.ux3.Collection", multiple : false}
		},
		events : {
	
			/**
			 * Event is fired if user selects a collection
			 */
			collectionSelected : {}, 
	
			/**
			 * Fires when an item in a collection is selected
			 */
			itemSelectionChanged : {}, 
	
			/**
			 * Fires when the edit button is clicked
			 */
			editCollection : {}
		}
	}});
	
	
	/**
	 * Initialization the control
	 *
	 * @private
	 */
	CollectionInspector.prototype.init = function() {
	
		var that = this;
	
		if (!this._oItemNavigation) {
			this._oItemNavigation = new ItemNavigation();
			this._oItemNavigation.setCycling(false);
			this.addDelegate(this._oItemNavigation);
		}
	
		var oToggleButton = new sap.ui.commons.ToggleButton(this.getId() + "-toggleButton");
		oToggleButton.setParent(this);
		oToggleButton.setTooltip("This button opens and closes the sidebar");
		oToggleButton.attachPress(function() {
			if (oToggleButton.getPressed()) {
				that.openSidebar();
			} else {
				that.closeSidebar();
			}
		});
		this._oToggleButton = oToggleButton;
	
		var oCollectionSelector = new sap.ui.commons.SegmentedButton(this.getId() + "-selector");
	
		oCollectionSelector.attachSelect(function(oEvent) {
			var iCollectionIndex = this.indexOfButton(sap.ui.getCore().byId(this.getSelectedButton()));
			var oCollection = that.getCollections()[iCollectionIndex];
			that.setSelectedCollection(oCollection);
			that.fireCollectionSelected({
				collection: oCollection
			});
			that.openSidebar();
		});
	
		this._oCollectionSelector = oCollectionSelector;
	
		var oEditButton = new sap.ui.commons.Button();
		oEditButton.addStyleClass("sapUiUx3EditCollectionButton");
		oEditButton.setText("Collection");
		oEditButton.setTooltip("This button opens an edit dialog for the current collection");
		oEditButton.attachPress(function() {
			that.fireEditCollection();
		});
		this._oEditButton = oEditButton;
	};
	
	/**
	 * Destroys elements created by the control
	 *
	 * @private
	 */
	CollectionInspector.prototype.exit = function() {
		this._oToggleButton.destroy();
		this._oToggleButton = null;
		this._oEditButton.destroy();
		this._oEditButton = null;
		this._oCollectionSelector.destroy();
		this._oCollectionSelector = null;
		if (this._oItemNavigation) {
			this.removeDelegate(this._oItemNavigation);
			this._oItemNavigation.destroy();
			delete this._oItemNavigation;
		}
	};
	
	/**
	 * called before the control will be rendered
	 *
	 * @private
	 */
	CollectionInspector.prototype.onBeforeRendering = function() {
		this._oToggleButton.setPressed(this.getSidebarVisible());
	};
	
	/**
	 * called after control has been rendered
	 *
	 * @private
	 */
	CollectionInspector.prototype.onAfterRendering = function() {
		if (!this.getSelectedCollection()) {
			if (this.getCollections().length > 0) {
				this.setSelectedCollection(this.getCollections()[0]);
			}
		} else {
			var oSelectedCollection = sap.ui.getCore().byId(this.getSelectedCollection());
			if (oSelectedCollection.getSelectedItems().length == 0 && oSelectedCollection.getItems().length > 0) {
				oSelectedCollection.addSelectedItem(oSelectedCollection.getItems()[0]);
			}
		}
		this.setElementsHeight();
		this.updateItemNavigation();
		this.refreshSelectionHighlighting();
	};
	
	/**
	 * called when the control is clicked
	 *
	 * @private
	 */
	CollectionInspector.prototype.onclick = function(oEvent) {
		var oTarget = oEvent.target;
		if (jQuery(oTarget).hasClass("sapUiUx3CICollectionListItem")) {
			var oSelectedCollection = sap.ui.getCore().byId(this.getSelectedCollection());
			if (jQuery.inArray(oTarget.id,oSelectedCollection.getSelectedItems()) >= 0) {
				oSelectedCollection.removeSelectedItem(oTarget.id);
			} else {
				oSelectedCollection.addSelectedItem(oTarget.id);
			}
			this.refreshSelectionHighlighting();
			this.fireItemSelectionChanged({
				selectedItems: oSelectedCollection.getSelectedItems()
			});
		}
	};
	
	
	/**
	 * returns instance of toggle button
	 *
	 * @private
	 */
	CollectionInspector.prototype.getToggleButton = function() {
		return this._oToggleButton;
	};
	
	/**
	 * returns instance of collection selector
	 *
	 * @private
	 */
	CollectionInspector.prototype.getCollectionSelector = function() {
		return this._oCollectionSelector;
	};
	
	/**
	 * rerender the sidebar if different collection is selected
	 *
	 * @private
	 */
	CollectionInspector.prototype.rerenderSidebar = function() {
		var oCurrentCollection = sap.ui.getCore().byId(this.getSelectedCollection());
		if (oCurrentCollection && oCurrentCollection.getEditable()) {
			this._oEditButton.setVisible(true);
		} else {
			this._oEditButton.setVisible(false);
		}
		var $Content = this.$("sidebar");
		if ($Content.length > 0) {
			var rm = sap.ui.getCore().createRenderManager();
			this.getRenderer().renderSidebar(rm, this);
			rm.flush($Content[0]);
			rm.destroy();
		}
		if (oCurrentCollection && oCurrentCollection.getEditable()) {
			this.$("sidebar").addClass("sapUiUx3CIWithEditButton");
		} else {
			this.$("sidebar").removeClass("sapUiUx3CIWithEditButton");
		}
		this.updateItemNavigation();
		this.refreshSelectionHighlighting();
	};
	
	/**
	 * load all dom refs to into the item navigation
	 *
	 * @private
	 */
	CollectionInspector.prototype.updateItemNavigation = function() {
		var aItemDomRefs = [];
		var $Items = this.$("sidebar").find('li');
		jQuery.each($Items, function(iIndex, $DomRef) {
			aItemDomRefs.push($DomRef);
		});
		this._oItemNavigation.setItemDomRefs(aItemDomRefs);
		this._oItemNavigation.setRootDomRef(this.$("sidebar ul")[0]);
	};
	
	/**
	 * rerender the content if different collection or collection item is selected
	 *
	 * @param int Index of the collection that should be rendered
	 *
	 * @private
	 */
	CollectionInspector.prototype.rerenderContent = function() {
		var $Content = this.$("content");
		if ($Content.length > 0) {
			var rm = sap.ui.getCore().createRenderManager();
			this.getRenderer().renderContent(rm, this);
			rm.flush($Content[0]);
			rm.destroy();
		}
		this.setElementsHeight();
	};
	
	/**
	 * Calculate height, so that both the sidebar and the content have the same height
	 *
	 * @private
	 */
	CollectionInspector.prototype.setElementsHeight = function() {
		if (this.getFitParent()) {
			return;
		}
	
		var oSidebar = this.$("sidebar");
		var oContent = this.$("content");
	
		var iContentHeight = oContent.outerHeight(true);
		var iContentMargin = oContent.outerHeight(true) - oContent.height();
		var iSidebarMargin = oSidebar.outerHeight(true) - oSidebar.height();
	
		oSidebar.height(Math.max(200, iContentHeight) - iSidebarMargin);
		oContent.height(Math.max(200, iContentHeight) - iContentMargin);
	};
	
	/**
	 * Opens the sidebar
	 *
	 * @public
	 */
	CollectionInspector.prototype.openSidebar = function() {
		var $this = this.$();
		var $Sidebar = this.$("sidebar");
		var $Content = this.$("content");
		$Sidebar.stop(true, true).animate({ width : 150 }, 300, function() {
			$Sidebar.css('width', '');
		});
		$Content.stop(true, true).animate({ left : 150 }, 300, function() {
			$Content.css('left', '');
		});
		$this.removeClass("sapUiUx3CISidebarClosed");
		$this.addClass("sapUiUx3CISidebarOpened");
		this._oToggleButton.setPressed(true);
	};
	
	/**
	 * Closes the siedebar
	 *
	 * @public
	 */
	CollectionInspector.prototype.closeSidebar = function() {
		var $this = this.$();
		var $Sidebar = this.$("sidebar");
		var $Content = this.$("content");
		$Sidebar.stop(true, true).animate({ width : 0 }, 300, function() {
			$Sidebar.css('width', '');
		});
		$Content.stop(true, true).animate({ left : 0 }, 300, function() {
			$Content.css('left', '');
		});
		$this.removeClass("sapUiUx3CISidebarOpened");
		$this.addClass("sapUiUx3CISidebarClosed");
		this._oToggleButton.setPressed(false);
	};
	
	/**
	 * Inserts a collection into the aggregation named <code>collections</code>.
	 *
	 * @param {sap.ui.ux3.Collection}
	 *          oCollection the collection to insert; if empty, nothing is inserted
	 * @param {int}
	 *             iIndex the <code>0</code>-based index the collection should be inserted at; for 
	 *             a negative value of <code>iIndex</code>, the collection is inserted at position 0; for a value 
	 *             greater than the current size of the aggregation, the collection is inserted at 
	 *             the last position        
	 * @return {sap.ui.ux3.CollectionInspector} <code>this</code> to allow method chaining
	 * @public
	 */
	CollectionInspector.prototype.insertCollection = function(oCollection, iIndex) {
		var oButton = new sap.ui.commons.Button();
		oButton.setText(oCollection.getTitle());
		oCollection.attachEvent('_titleChanged', function(oEvent) {
			oButton.setText(oEvent.getParameter("newTitle"));
		});
		var that = this;
		oCollection.attachSelectionChanged(function() {
			that.refreshSelectionHighlighting();
		});
		oCollection.attachPropertyChanged(function() {
			that.rerenderSidebar();
		});
		this._oCollectionSelector.insertButton(oButton, iIndex);
		return this.insertAggregation("collections",oCollection, iIndex);
	};
	
	/**
	 * Adds some collection <code>oCollection</code> 
	 * to the aggregation named <code>collections</code>.
	 *
	 * @param {sap.ui.ux3.Collection}
	 *            oCollection the collection to add; if empty, nothing is inserted
	 * @return {sap.ui.ux3.CollectionInspector} <code>this</code> to allow method chaining
	 * @public
	 */
	CollectionInspector.prototype.addCollection = function(oCollection) {
		var oButton = new sap.ui.commons.Button();
		oButton.setText(oCollection.getTitle());
		oCollection.attachEvent('_titleChanged', function(oEvent) {
			oButton.setText(oEvent.getParameter("newTitle"));
		});
		var that = this;
		oCollection.attachSelectionChanged(function() {
			that.refreshSelectionHighlighting();
		});
		oCollection.attachPropertyChanged(function() {
			that.rerenderSidebar();
		});
		this._oCollectionSelector.addButton(oButton);
		return this.addAggregation("collections",oCollection);
	};
	
	/**
	 * Removes an collection from the aggregation named <code>collections</code>.
	 *
	 * @param {int | string | sap.ui.ux3.Collection} vCollection the collection to remove or its index or id
	 * @return {sap.ui.ux3.Collection} the removed collection or null
	 * @public
	 */
	CollectionInspector.prototype.removeCollection = function(vCollection) {
		var iIndex;
		if (typeof vCollection == "object") {
			iIndex = this.indexOfCollection(vCollection);
		} else {
			iIndex = this.indexOfCollection(sap.ui.getCore().byId(vCollection));
		}
		var oButton = this._oCollectionSelector.getButtons()[iIndex];
		this._oCollectionSelector.removeButton(oButton);
	
		var oResult = this.removeAggregation("collections",vCollection);
		if (oResult && this.getSelectedCollection() == oResult.getId()) {
			this.setSelectedCollection(null);
		}
		return oResult;
	};
	
	/**
	 * Removes all the controls in the aggregation named <code>collections</code>.<br/>
	 * Additionally unregisters them from the hosting UIArea.
	 * @return {sap.ui.ux3.Collection[]} an array of the removed elements (might be empty)
	 * @public
	 */
	CollectionInspector.prototype.removeAllCollections = function() {
		this._oCollectionSelector.removeAllButtons();
		this.setSelectedCollection(null);
		return this.removeAllAggregation("collections");
	};
	
	/**
	 * Destroys the collection aggregation
	 * @return {sap.ui.ux3.CollectionInspector} this to allow method chaining
	 * @public
	 */
	CollectionInspector.prototype.destroyCollections = function() {
		this._oCollectionSelector.destroyButtons();
		this.setSelectedCollection(null);
		return this.destroyAggregation("collections");
	};
	
	CollectionInspector.prototype.setSelectedCollection = function(oCollection) {
		this.setAssociation("selectedCollection",oCollection,true);
		if (!oCollection) {
			this._oEditButton.setVisible(false);
		} else {
			//Select the corresponding item in top navigation
			this._oCollectionSelector.setSelectedButton(this._oCollectionSelector.getButtons()[this.indexOfCollection(oCollection)]);
			//Select first item if no item is selected
			var oSelectedCollection = sap.ui.getCore().byId(this.getSelectedCollection());
			if (oSelectedCollection.getSelectedItems().length == 0 && oSelectedCollection.getItems().length > 0) {
				oSelectedCollection.addSelectedItem(oSelectedCollection.getItems()[0]);
			}
		}
		this.rerenderSidebar();
		this.refreshSelectionHighlighting();
	};
	
	/**
	 * Inserts a content into the aggregation named <code>content</code>.
	 *
	 * @param {sap.ui.core.Control}
	 *          oContent the content to insert; if empty, nothing is inserted
	 * @param {int}
	 *             iIndex the <code>0</code>-based index the content should be inserted at; for 
	 *             a negative value of <code>iIndex</code>, the content is inserted at position 0; for a value 
	 *             greater than the current size of the aggregation, the content is inserted at 
	 *             the last position        
	 * @return {sap.ui.ux3.CollectionInspector} <code>this</code> to allow method chaining
	 * @public
	 */
	CollectionInspector.prototype.insertContent = function(oContent, iIndex) {
		this.insertAggregation("content",oContent,iIndex,true);
		this.rerenderContent();
	};
	
	/**
	 * Adds some content <code>oContent</code> 
	 * to the aggregation named <code>content</code>.
	 *
	 * @param {sap.ui.core.Control}
	 *            oContent the content to add; if empty, nothing is inserted
	 * @return {sap.ui.ux3.CollectionInspector} <code>this</code> to allow method chaining
	 * @public
	 */
	CollectionInspector.prototype.addContent = function(oContent) {
		this.addAggregation("content",oContent,true);
		this.rerenderContent();
	};
	
	/**
	 * Removes an content from the aggregation named <code>content</code>.
	 *
	 * @param {int | string | sap.ui.core.Control} vContent the content to remove or its index or id
	 * @return {sap.ui.core.Control} the removed content or null
	 * @public
	 */
	CollectionInspector.prototype.removeContent = function(vContent) {
		this.removeAggregation("content",vContent,true);
		this.rerenderContent();
	};
	
	/**
	 * Removes all the controls in the aggregation named <code>content</code>.<br/>
	 * Additionally unregisters them from the hosting UIArea.
	 * @return {sap.ui.core.Control[]} an array of the removed elements (might be empty)
	 * @public
	 */
	CollectionInspector.prototype.removeAllContent = function() {
		this.removeAllAggregation("content",true);
		this.rerenderContent();
	};
	
	/**
	 * Destroys all the content in the aggregation 
	 * named <code>content</code>.
	 * @return {sap.ui.ux3.CollectionInspector} <code>this</code> to allow method chaining
	 * @public
	 */
	CollectionInspector.prototype.destroyContent = function() {
		this.destroyAggregation("content",true);
		this.rerenderContent();
	};
	
	/**
	 * When the CI looses the focus, this method is called.
	 *
	 * @param {jQuery.Event} oEvent
	 * @private
	 */
	CollectionInspector.prototype.onfocusout = function(oEvent) {
		var $Target = jQuery(oEvent.target);
		if ($Target.hasClass("sapUiUx3CICollectionListItem")) {
			$Target.removeClass("sapUiUx3CISidebarFoc");
		}
	};
	
	/**
	 * When the CI gets the focus, this method is called.
	 *
	 * @param {jQuery.Event} oEvent
	 * @private
	 */
	CollectionInspector.prototype.onfocusin = function(oEvent) {
		var $Target = jQuery(oEvent.target);
		if ($Target.hasClass("sapUiUx3CICollectionListItem")) {
			$Target.addClass("sapUiUx3CISidebarFoc");
		}
	};
	
	/**
	 * Handles the sapenter event does not bubble
	 *
	 * @param {jQuery.Event} oEvent
	 * @private
	 */
	CollectionInspector.prototype.onsapenter = function(oEvent) {
		var $Target = jQuery(oEvent.target);
		if ($Target.hasClass("sapUiUx3CISidebarFoc")) {
			this.onclick(oEvent);
		}
		oEvent.stopPropagation();
	};
	
	/**
	 * Handles the sapspace event does not bubble
	 *
	 * @param {jQuery.Event} oEvent
	 * @private
	 */
	CollectionInspector.prototype.onsapspace = function(oEvent) {
		var $Target = jQuery(oEvent.target);
		if ($Target.hasClass("sapUiUx3CISidebarFoc")) {
			this.onclick(oEvent);
		}
		oEvent.stopPropagation();
	};
	
	/**
	 * Updates the css classes for the selected items
	 *
	 * @param {jQuery.Event} oEvent
	 * @private
	 */
	CollectionInspector.prototype.refreshSelectionHighlighting = function() {
		var aItems = this.$("sidebar").find('.sapUiUx3CICollectionListItem');
		var aSelectedItems;
		if (this.getSelectedCollection()) {
			aSelectedItems = sap.ui.getCore().byId(this.getSelectedCollection()).getSelectedItems();
		} else {
			aSelectedItems = [];
		}
		jQuery.each(aItems, function(iIndex, oItem) {
			if (jQuery.inArray(oItem.id,aSelectedItems) >= 0) {
				jQuery(oItem).addClass("sapUiUx3CICollectionListItemSelected");
				jQuery(oItem).attr("aria-selected",true);
			} else {
				jQuery(oItem).removeClass("sapUiUx3CICollectionListItemSelected");
				jQuery(oItem).attr("aria-selected",false);
			}
		});
	};
	
	/**
	 * Return the edit button
	 *
	 * @public
	 */
	CollectionInspector.prototype.getEditButton = function() {
		return this._oEditButton;
	};

	return CollectionInspector;

}, /* bExport= */ true);
