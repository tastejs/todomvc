/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.ux3.FacetFilterList.
sap.ui.define(['jquery.sap.global', 'sap/ui/commons/ListBox', 'sap/ui/core/Control', './library'],
	function(jQuery, ListBox, Control, library) {
	"use strict";


	
	/**
	 * Constructor for a new FacetFilterList.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * List to be used with the FacetFilter control. The control is not intended to be used stand alone.
	 * @extends sap.ui.core.Control
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @alias sap.ui.ux3.FacetFilterList
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var FacetFilterList = Control.extend("sap.ui.ux3.FacetFilterList", /** @lends sap.ui.ux3.FacetFilterList.prototype */ { metadata : {
	
		library : "sap.ui.ux3",
		properties : {
	
			/**
			 * The title of this list.
			 */
			title : {type : "string", group : "Misc", defaultValue : null},
	
			/**
			 * Specifies whether multiple or single selection is used.
			 */
			multiSelect : {type : "boolean", group : "Behavior", defaultValue : true},
	
			/**
			 * Specifies whether the text values from the additionalText property (see sap.ui.core.ListItems) shall be displayed.
			 * @since 1.9.0
			 */
			displaySecondaryValues : {type : "boolean", group : "Misc", defaultValue : false},
	
			/**
			 * Array of type string containing the selected keys.
			 */
			selectedKeys : {type : "string[]", group : "Misc", defaultValue : null},
	
			/**
			 * Specifies whether the counter for all entries is shown.
			 */
			showCounter : {type : "boolean", group : "Behavior", defaultValue : true}
		},
		aggregations : {
	
			/**
			 * The filter values that are presented as a list.
			 */
			items : {type : "sap.ui.core.ListItem", multiple : true, singularName : "item"}, 
	
			/**
			 * ListBoxes that are managed by this FacetFilterList
			 */
			controls : {type : "sap.ui.commons.ListBox", multiple : true, singularName : "control", visibility : "hidden"}
		},
		events : {
	
			/**
			 * On Select event.
			 */
			select : {
				parameters : {
	
					/**
					 * Id of the FacetFilterList taht fires the event.
					 */
					id : {type : "string"}, 
	
					/**
					 * Array of selected Indices.
					 */
					selectedIndices : {type : "int[]"}, 
	
					/**
					 * Array of selected Items.
					 */
					selectedItems : {type : "sap.ui.core.ListItem[]"}, 
	
					/**
					 * If it is true, then Item All is selected. That means all items in the list are selected - no filter is set.
					 */
					all : {type : "boolean"}
				}
			}
		}
	}});
	
	
	(function() {
	
	/**
	 * Does the setup when the control is created.
	 * @private
	 */
	FacetFilterList.prototype.init = function(){
	
	    // Get the translatable text
		this._oResBundle = sap.ui.getCore().getLibraryResourceBundle("sap.ui.ux3");
	
		//For later use
		//this._bAccMode = sap.ui.getCore().getConfiguration().getAccessibility();
		//this._bRtlMode = sap.ui.getCore().getConfiguration().getRTL();
	
		//Create the used ListBox control
		this._oListBox = new ListBox(this.getId() + "-lb");
		this._oListBox.setScrollTop(0);
		this._oListBox.setValueTextAlign("Begin");
		this._oListBox.setDisplaySecondaryValues(this.getDisplaySecondaryValues());
		this._oListBox.setDisplayIcons(false);
		this._oListBox.setEditable(true);
		this._oListBox.setEnabled(true);
		this._oListBox.setVisible(true);
		this._oListBox.setAllowMultiSelect(this.getMultiSelect());
		this._oListBox.addAriaLabelledBy(this.getId() + "-head-txt");
		var that = this;
		//Attach to the ListBox select event
		this._oListBox.attachSelect(function(oEvent) {
			that.onSelect(that, oEvent);
		});
		this.addAggregation("controls", this._oListBox);
		this._oItemAll = new sap.ui.core.ListItem({text: this._oResBundle.getText("FACETFILTER_ALL", [0]), key:"sapUiFacetFilter_ALL"});
		this._oListBox.addItem(this._oItemAll);
	};
	
	FacetFilterList.prototype.setMultiSelect = function(bMultiSelect) {
		this._oListBox.setAllowMultiSelect(bMultiSelect);
		this.setProperty("multiSelect", bMultiSelect, true);
	};
	
	FacetFilterList.prototype.setDisplaySecondaryValues = function(bDisplaySecondaryValues) {
		this._oListBox.setDisplaySecondaryValues(bDisplaySecondaryValues);
		this.setProperty("displaySecondaryValues", bDisplaySecondaryValues, true);
	};
	
	FacetFilterList.prototype.addItem = function(oItem) {
		this._oListBox.addItem(oItem);
		if (!oItem.getKey() || jQuery.trim(oItem.getKey()) == "" ) {
			oItem.setKey("generatedkey" + this.indexOfItem(oItem));
		}
		this.updateText4All();
	};
	
	FacetFilterList.prototype.insertItem = function(oItem, iIndex) {
		this._oListBox.insertItem(oItem, iIndex + 1); // +1 because of entry "all" on the fist position.
		if (!oItem.getKey() || jQuery.trim(oItem.getKey()) == "" ) {
			oItem.setKey("generatedkey" + this.indexOfItem(oItem));
		}
		this.updateText4All();
	};
	
	FacetFilterList.prototype.removeItem = function(oItem) {
		this._oListBox.removeItem(oItem);
		this.updateText4All();
	};
	
	FacetFilterList.prototype.removeAllItems = function() {
		this._oListBox.removeAllItems();
		this._oListBox.addItem(this._oItemAll);
		this.updateText4All();
	};
	
	FacetFilterList.prototype.destroyItems = function() {
		this._oListBox.removeItem(this._oItemAll);
		this._oListBox.destroyItems();
		this._oListBox.addItem(this._oItemAll);
		this.updateText4All();
	};
	
	FacetFilterList.prototype.indexOfItem = function(oItem) {
		var iIndex = this._oListBox.indexOfItem(oItem);
		if (iIndex > -1) { // index values -1, -2 and 0 stay unchanged
			iIndex = iIndex - 1;
		}
		return iIndex;
	};
	
	FacetFilterList.prototype.getItems = function() {
		var aListItems = this._oListBox.getItems();
		var aItems = [];
		for (var i = 1; i < aListItems.length; i++) {
			aItems.push(aListItems[i]);
		}
		return aItems;
	};
	
	FacetFilterList.prototype.setSelectedKeys = function(aSelectedKeys) {
		this.setProperty("selectedKeys", aSelectedKeys);
		this.invalidate();
	};
	
	FacetFilterList.prototype.setShowCounter = function(bShowCounter) {
		this.setProperty("showCounter", bShowCounter);
		this.updateText4All();
	};
	
	/**
	 *
	 * @private
	 */
	FacetFilterList.prototype.updateText4All = function() {
		if (this.getShowCounter()) {
			this._oItemAll.setText( this._oResBundle.getText("FACETFILTER_ALL", [this._oListBox.getItems().length - 1]));
		} else {
			this._oItemAll.setText( this._oResBundle.getText("FACETFILTER_NO_COUNT"));
		}
	};
	
	/**
	 * Used for after-rendering initialization.
	 *
	 * @private
	 */
	FacetFilterList.prototype.onBeforeRendering = function() {
		if (!this.bFullHeight) {
			this._oListBox.setVisibleItems(5);
		}
		
		var aKeys = this.getSelectedKeys();
		if (aKeys && aKeys.length > 0) {
			this._oListBox.setSelectedKeys(aKeys);
			this._bAllOnly = false;
		} else {
			this._oListBox.setSelectedKeys(["sapUiFacetFilter_ALL"]);
			this._bAllOnly = true;
		}
	};
	
	FacetFilterList.prototype.updateItems = function(){
	
		this.updateAggregation("items");
	
		var aSelectedKeys = this._oListBox.getSelectedKeys();
		//if no selection at all - mark ALL
		if (aSelectedKeys.length == 0) {
			aSelectedKeys = ["sapUiFacetFilter_ALL"];
			this._bAllOnly = true;
			this._oListBox.setSelectedKeys(aSelectedKeys);
		}
	
	};
	
	//Handles the select event of the used ListBox control
	FacetFilterList.prototype.onSelect = function(oFFList, oEvent) {
	    var aSelectedKeys = this._oListBox.getSelectedKeys();
	    //if no selection at all - mark ALL
	    if (aSelectedKeys.length == 0) {
				aSelectedKeys = ["sapUiFacetFilter_ALL"];
				this._bAllOnly = true;
				this._oListBox.setSelectedKeys(aSelectedKeys);
	    }
	    var iIndexAll = jQuery.inArray("sapUiFacetFilter_ALL", aSelectedKeys);
	    if (iIndexAll > -1) {
				if (aSelectedKeys.length == 1) {
					this._bAllOnly = true;
				} else {
					if (this._bAllOnly) {
						aSelectedKeys.splice(iIndexAll,1);
						this._bAllOnly = false;
					} else {
						aSelectedKeys = ["sapUiFacetFilter_ALL"];
						this._bAllOnly = true;
					}
					this._oListBox.setSelectedKeys(aSelectedKeys);
				}
	    } else {
				this._bAllOnly = false;
	    }
	
		this.setProperty("selectedKeys", aSelectedKeys, true);
		
		var aSelectedIndices = [];
		var aSelectedItems = [];
		var aAllSelectedItems = this._oListBox.getSelectedItems();
		if (!this._bAllOnly) {
			 for (var i = 0; i < aAllSelectedItems.length; i++) {
				 if (aAllSelectedItems[i] != this._oItemAll) {
					 aSelectedIndices.push(this.indexOfItem(aAllSelectedItems[i]));
					 aSelectedItems.push(aAllSelectedItems[i]);
				 }
			 }
		}
		
		this.fireSelect({
			id:oFFList.getId(),
			all:this._bAllOnly,
			selectedIndices: aSelectedIndices,
			selectedItems: aSelectedItems
		});
	};
	
	}());
	

	return FacetFilterList;

}, /* bExport= */ true);
