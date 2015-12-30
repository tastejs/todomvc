/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.ux3.Collection.
sap.ui.define(['jquery.sap.global', 'sap/ui/core/Element', 'sap/ui/model/SelectionModel', './library'],
	function(jQuery, Element, SelectionModel, library) {
	"use strict";


	
	/**
	 * Constructor for a new Collection.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * Collection
	 * @extends sap.ui.core.Element
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @since 1.9.0
	 * @alias sap.ui.ux3.Collection
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var Collection = Element.extend("sap.ui.ux3.Collection", /** @lends sap.ui.ux3.Collection.prototype */ { metadata : {
	
		library : "sap.ui.ux3",
		properties : {
	
			/**
			 * Name for the collection
			 */
			title : {type : "string", group : "Appearance", defaultValue : null},
	
			/**
			 * If a collection is editable an edit button will be displayed below the list of items
			 */
			editable : {type : "boolean", group : "Appearance", defaultValue : false},
	
			/**
			 * Allow multi selection of items in collection
			 */
			multiSelection : {type : "boolean", group : "Accessibility", defaultValue : false}
		},
		aggregations : {
	
			/**
			 * Items in the collection
			 */
			items : {type : "sap.ui.core.Item", multiple : true, singularName : "item"}
		},
		associations : {
	
			/**
			 * Contains all items that are currently selected
			 */
			selectedItems : {type : "sap.ui.core.Item", multiple : true, singularName : "selectedItem"}
		},
		events : {
	
			/**
			 * Fired when ever the selected items changer
			 */
			selectionChanged : {}, 
	
			/**
			 * Fires if a property has changed, and the collection inspector needs to do something after that
			 */
			propertyChanged : {}
		}
	}});
	
	
	
	Collection.prototype.init = function() {
		this.oCollectionSelection = new SelectionModel(SelectionModel.SINGLE_SELECTION);
	};
	
	/*
	 * Set multi selection for selection model
	 *
	 * @param {boolean} bMultiSelection
	 * @public
	 */
	Collection.prototype.setMultiSelection = function(bMultiSelection) {
		if (bMultiSelection) {
			this.oCollectionSelection.setSelectionMode(SelectionModel.MULTI_SELECTION);
		} else {
			this.oCollectionSelection.setSelectionMode(SelectionModel.SINGLE_SELECTION);
			this.removeAllSelectedItems();
		}
		return this.setProperty("multiSelection",bMultiSelection);
	};
	
	/*
	 * Set editable
	 *
	 * @param {boolean} bEditable
	 * @public
	 */
	Collection.prototype.setEditable = function(bEditable) {
		this.setProperty("editable",bEditable,true);
		this.firePropertyChanged();
	};
	
	/*
	 * Set title
	 *
	 * @param {string} sTitle
	 * @public
	 */
	Collection.prototype.setTitle = function(sTitle) {
		this.setProperty("title",sTitle);
		this.fireEvent('_titleChanged', { newTitle: this.getProperty("title") });
	};
	
	
	/**
	 *
	 * @param {string | sap.ui.core.Item} vSelectedItem
	 *    Id of a selectedItem which becomes an additional target of this <code>selectedItems</code> association.
	 *    Alternatively, a selectedItem instance may be given. 
	 * @return {sap.ui.ux3.Collection} <code>this</code> to allow method chaining
	 * @public
	 */
	Collection.prototype.addSelectedItem = function(vSelectedItem) {
		var oSelectedItem;
		if (typeof vSelectedItem == "object") {
			oSelectedItem = vSelectedItem;
		} else {
			oSelectedItem = sap.ui.getCore().byId(vSelectedItem);
		}
		if (jQuery.inArray(oSelectedItem.getId(),this.getSelectedItems()) >= 0) {
			return this;
		}
		var iIndex = this.indexOfItem(oSelectedItem);
		if (iIndex > -1) {
			if (this.oCollectionSelection.getSelectionMode() == SelectionModel.SINGLE_SELECTION) {
				this.removeAllAssociation("selectedItems",true);
				this.oCollectionSelection.clearSelection();
			}
			this.oCollectionSelection.addSelectionInterval(iIndex,iIndex);
		}
		this.addAssociation("selectedItems",vSelectedItem,true);
		this.fireSelectionChanged();
		return this;
	};
	
	/**
	 * @param {int | string | sap.ui.core.Item} vSelectedItem the selectedItem to remove or its index or id
	 * @return {string} the id of the removed selectedItem or null
	 * @public
	 */
	Collection.prototype.removeSelectedItem = function(vSelectedItem) {
		//Don't remove the item if there is only one item selected
		if (this.getSelectedItems().length <= 1) {
			return;
		}
		var sRemovedObject = this.removeAssociation("selectedItems",vSelectedItem,true);
		var iIndex;
		if (typeof vSelectedItem == "object") {
			iIndex = this.indexOfItem(vSelectedItem);
		} else {
			iIndex = this.indexOfItem(sap.ui.getCore().byId(vSelectedItem));
		}
		if (iIndex > -1) {
			this.oCollectionSelection.removeSelectionInterval(iIndex,iIndex);
		}
		this.fireSelectionChanged();
		return sRemovedObject;
	};
	
	/**
	 * @return {string[]} an array with the ids of the removed elements (might be empty)
	 * @public
	 */
	Collection.prototype.removeAllSelectedItems = function() {
		var aRemovedObjects = this.removeAllAssociation("selectedItems",true);
		this.oCollectionSelection.clearSelection();
		if (this.getItems().length > 0) {
			this.addSelectedItem(this.getItems()[0]);
		} else {
			this.fireSelectionChanged();
		}
		return aRemovedObjects;
	};

	return Collection;

}, /* bExport= */ true);
