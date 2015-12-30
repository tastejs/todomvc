/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.m.FacetFilterList.
sap.ui.define(['jquery.sap.global', './List', './library'],
	function(jQuery, List, library) {
	"use strict";


	
	/**
	 * Constructor for a new FacetFilterList.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * FacetFilterList represents a list of values for the FacetFilter control.
	 * @extends sap.m.List
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @alias sap.m.FacetFilterList
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var FacetFilterList = List.extend("sap.m.FacetFilterList", /** @lends sap.m.FacetFilterList.prototype */ { metadata : {
	
		library : "sap.m",
		properties : {
	
			/**
			 * The title of the facet. The facet title is displayed on the facet button when the FacetFilter type is set to Simple. It is also displayed as a list item in the facet page of the dialog.
			 */
			title : {type : "string", group : "Appearance", defaultValue : null},
			/**
             * If true, item text wraps when it is too long.
             */
             wordWrap: {type : "boolean", group : "Appearance", defaultValue : false},
	
			/**
			 * Specifies whether multiple or single selection is used.
			 * @deprecated Since version 1.20.0. 
			 * This property is no longer supported. Use the setMode method instead. FacetFilterList overrides the setMode method to restrict the possible modes to MultiSelect and SingleSelectMaster. All other modes are ignored and will not be set.
			 */
			multiSelect : {type : "boolean", group : "Behavior", defaultValue : true, deprecated: true},
	
			/**
			 * Indicates that the list is displayed as a button when the FacetFilter type is set to Simple.
			 */
			active : {type : "boolean", group : "Behavior", defaultValue : true},


            /**
             * If true, enable case-insensitive search for OData .
             */
			enableCaseInsensitiveSearch: {type : "boolean", group : "Behavior", defaultValue : false, deprecated: false},

			/**
			 * Number of objects that match this item in the target data set when all filter items are selected.
			 */
			allCount : {type : "int", group : "Appearance", defaultValue : null},
	
			/**
			 * Sequence that determines the order in which facet list is shown on the facet filter. Lists are rendered by ascending order of sequence.
			 */
			sequence : {type : "int", group : "Behavior", defaultValue : -1},
	
			/**
			 * Unique identifier for this filter list.
			 */
			key : {type : "string", group : "Identification", defaultValue : null},
	
			/**
			 * Specifies whether remove icon for facet is visible or hidden.
			 * @since 1.20.4
			 */
			showRemoveFacetIcon : {type : "boolean", group : "Misc", defaultValue : true},
	
			/**
			 * Property to retain the list sequence if it is inactive and made active again .
			 * @since 1.22.1
			 */
			retainListSequence : {type : "boolean", group : "Misc", defaultValue : false},
	
			/**
			 * FacetFilterList data type. Only String data type will provide search function.
			 */
			dataType : {type : "sap.m.FacetFilterListDataType", group : "Misc", defaultValue : sap.m.FacetFilterListDataType.String}
		},
		events : {
	
			/**
			 * Fired before the filter list is opened.
			 */
			listOpen : {}, 
	
			/**
			 * Triggered after the list of items is closed.
			 */
			listClose : {
				parameters : {
	
					/**
					 * Array of selected items. Items returned are only copies and therefore can only be used to read properties, not set them.
					 */
					selectedItems : {type : "sap.m.FacetFilterItem[]"}, 
	
					/**
					 * True if the select All checkbox is selected. This will be false if all items are actually selected (every FacetFilterItem.selected == true). In that case selectedItems will contain all selected items.
					 */
					allSelected : {type : "boolean"}, 
	
					/**
					 * Associative array containing the keys of selected FacetFilterItems. Unlike the selectedItems parameter, this contains only the keys for all selected items, not the items themselves. Being an associative array, each object property is the FacetFilterItem key value and the value of the property is the FacetFilterItem text.
					 */
					selectedKeys : {type : "object"}
				}
			}
		}
	}});
	
	
	FacetFilterList.prototype.setTitle = function(sTitle) {
		
		this.setProperty("title", sTitle, true);
		if (this.getParent() && this.getParent()._setButtonText) {
			this.getParent()._setButtonText(this);
		}
		return this;
	};
	
	FacetFilterList.prototype.setMultiSelect = function(bVal) {
		
		this.setProperty("multiSelect", bVal, true);
		var mode = bVal ? sap.m.ListMode.MultiSelect : sap.m.ListMode.SingleSelectMaster;
		this.setMode(mode);
		return this;
	};
	
	/**
	 * Override to allow only MultiSelect and SingleSelectMaster list modes. If an invalid mode is given
	 * then the mode will not be changed.
	 * @param {sap.m.ListMode} mode The list mode
	 * @public
	 */
	FacetFilterList.prototype.setMode = function(mode) {
		
		if (mode === sap.m.ListMode.MultiSelect || mode === sap.m.ListMode.SingleSelectMaster) {
			
			List.prototype.setMode.call(this, mode);
			this.setProperty("multiSelect", mode === sap.m.ListMode.MultiSelect ? true : false, true);
		}
		return this;
	};
	
	FacetFilterList.prototype._applySearch = function() {
		var searchVal = this._getSearchValue();
		if (searchVal != null) {
			this._search(searchVal, true);
	
		}
	};
	
	
	FacetFilterList.prototype.getSelectedItems = function() {
		
		var aSelectedItems = [];
		// Track which items are added from the aggregation so that we don't add them again when adding the remaining selected key items
		var oCurrentSelectedItemsMap = {};
		var aCurrentSelectedItems = sap.m.ListBase.prototype.getSelectedItems.apply(this, arguments);
		
		// First add items according to what is selected in the 'items' aggregation. This maintains indexes of currently selected items in the returned array.
		aCurrentSelectedItems.forEach(function(oItem) {
			
			aSelectedItems.push(new sap.m.FacetFilterItem({
				text: oItem.getText(),
				key: oItem.getKey(),
				selected: true
			}));
			oCurrentSelectedItemsMap[oItem.getKey()] = true;
		});
	
		var oSelectedKeys = this.getSelectedKeys();
		var aSelectedKeys = Object.getOwnPropertyNames(oSelectedKeys);
		
		// Now add items that are not present in the aggregation. These have no index since they are not in the aggregation,
		// so just add them to the end in non-deterministic order.
		if (aCurrentSelectedItems.length < aSelectedKeys.length) {
				
			aSelectedKeys.forEach(function(sKey) {
				
				if (!oCurrentSelectedItemsMap[sKey]) {
					aSelectedItems.push(new sap.m.FacetFilterItem({
						text: oSelectedKeys[sKey],
						key: sKey,
						selected: true
					}));
				}
			});
		}
		return aSelectedItems;
	};
	
	FacetFilterList.prototype.getSelectedItem = function() {
		
		var oItem = sap.m.ListBase.prototype.getSelectedItem.apply(this, arguments);
		var aSelectedKeys = Object.getOwnPropertyNames(this.getSelectedKeys());
		if (!oItem && aSelectedKeys.length > 0) {
			oItem = new sap.m.FacetFilterItem({
				text: this.getSelectedKeys()[aSelectedKeys[0]],
				key: aSelectedKeys[0],
				selected: true
			});
		}
		return oItem;
	};
	
	FacetFilterList.prototype.removeSelections = function(bAll) {
		
		// See _resetItemsBinding to understand why we override the ListBase method
		if (this._allowRemoveSelections) {
			
			bAll ? this.setSelectedKeys() : sap.m.ListBase.prototype.removeSelections.call(this, bAll);
		}
		return this;
	};
	

	/**
	 * Returns the keys of the selected elements as an associative array. An empty object is returned if no items are selected.
	 *
	 * @type object
	 * @public
	 * @since 1.20.3
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	FacetFilterList.prototype.getSelectedKeys = function() {
		var oResult = {};
		var oKeys = this._oSelectedKeys;
		Object.getOwnPropertyNames(oKeys).forEach(function(key) {oResult[key] = oKeys[key];});
		return oResult;
	};
	

	/**
	 * Use this method to pre-select FacetFilterItems, such as when restoring FacetFilterList selections from a variant. Keys are cached separately from the actual FacetFilterItems so that they remain even when the physical items are removed by filtering or sorting. If aKeys is undefined, null, or {} (empty object) then all keys are deleted. After this method completes only those items with matching keys will be selected. All other items in the list will be deselected.
	 *
	 * @param {object} oAKeys
	 *         Associative array indicating which FacetFilterItems should be selected in the list. Each property must be set to the value of a FacetFilterItem.key property. Each property value should be set to the FacetFilterItem.text property value. The text value is used to display the FacetFilterItem text when the FacetFilterList button or FacetFilter summary bar is displayed. If no property value is set then the property key is used for the text.
	 * @type void
	 * @public
	 * @since 1.20.3
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	FacetFilterList.prototype.setSelectedKeys = function(oKeys) {
		
		this._oSelectedKeys = {};
		var bKeyAdded = false;
		oKeys && Object.getOwnPropertyNames(oKeys).forEach(function(key){
			this._addSelectedKey(key, oKeys[key]);
			bKeyAdded = true;
		}, this);
		if (bKeyAdded) {
			this.setActive(true);
			this._selectItemsByKeys();
		} else {
			sap.m.ListBase.prototype.removeSelections.call(this);
		}
	};
	

	/**
	 * Remove the specified key from the selected keys cache and deselect the item.
	 *
	 * @param {string} sKey
	 *         The key of the selected item to be removed from the cache. If null then the text parameter will be used as the key.
	 * @param {string} sText
	 *         The text of the selected item to be removed from the cache. If the key parameter is null then text will be used as the key.
	 * @type void
	 * @public
	 * @since 1.20.4
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	FacetFilterList.prototype.removeSelectedKey = function(sKey, sText) {
		
		if (this._removeSelectedKey(sKey, sText)) {
			this.getItems().forEach(function(oItem) {
				var sItemKey = oItem.getKey() || oItem.getText();
				sKey === sItemKey && oItem.setSelected(false);
			});
		}
	};
	

	/**
	 * Remove all selected keys from the selected keys cache and deselect all items.
	 *
	 * @type void
	 * @public
	 * @since 1.20.4
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	FacetFilterList.prototype.removeSelectedKeys = function() {
		this._oSelectedKeys = {};
		sap.m.ListBase.prototype.removeSelections.call(this, true);
	};
	
	FacetFilterList.prototype.removeItem = function(vItem) {
		
		// Update the selected keys cache if an item is removed
		var oItem = sap.m.ListBase.prototype.removeItem.apply(this, arguments);
		if (!this._filtering) {
		oItem && oItem.getSelected() && this.removeSelectedKey(oItem.getKey(), oItem.getText());
		return oItem;
		}
	};
	
	
	/**
	 * Control initialization.
	 *
	 * @private
	 */
	FacetFilterList.prototype.init = function(){
		this._firstTime = true;
		this._saveBindInfo;
	
		
		// The internal associative array of keys for selected items.
		// Items that were selected but currently are not in the model are included as well. 
		this._oSelectedKeys = {};
		
		List.prototype.init.call(this);
		this.setMode(sap.m.ListMode.MultiSelect);
		this.setIncludeItemInSelection(true);
		this.setGrowing(true);
		this.setRememberSelections(false);
		
		// Remember the search value so that it can be seeded into the search field
		this._searchValue = null;
		
		// Select items set from a variant when the growing list is updated 
		this.attachUpdateFinished(function(oEvent) {
			
			// Make sure we don't call _selectItemsByKeys twice in the case when the
			// list is being filtered. The process of selecting items gets more and more
			// expensive as the number of items increases.
			// 
			// If the list is being filtered then items are already selected in updateItems.
			var sUpdateReason = oEvent.getParameter("reason");
			if (sUpdateReason) {
				sUpdateReason = sUpdateReason.toLowerCase();
				if (sUpdateReason !== sap.ui.model.ChangeReason.Filter.toLowerCase()) {
					this._selectItemsByKeys();
				}
			} else {
				this._selectItemsByKeys();
			}
		});
		
		this._allowRemoveSelections = true;
	};
	
	/**
	 * ListBase method override needed to prevent selected keys from being removed by removeSelections when
	 * the 'items' binding is reset.
	 * 
	 * ListBase._resetItemsBinding calls removeSelections(), which is also overridden
	 * by FacetFilterList so that selected keys (i.e. cached selected items) are removed if bAll is true. If this
	 * method was not overridden then selected keys will be removed when 'items' is bound or when the model is set.
	 * This presents a dilemma for applications that want to load items from a listOpen event handler by setting the model. In
	 * that scenario it would be impossible to restore selections from a variant since selected keys must be set outside
	 * of the listOpen handler (otherwise the facet button or summary bar would not display pre-selected items until after
	 * the list was opened and then closed).
	 * 
	 * @private
	 */
	FacetFilterList.prototype._resetItemsBinding = function() {
	
		if (this.isBound("items")) {
			
			this._searchValue = null; // Clear the search value since items are being reinitialized
			this._allowRemoveSelections = false;
			sap.m.ListBase.prototype._resetItemsBinding.apply(this, arguments);
			this._allowRemoveSelections = true;
		}
	};
	
	/**
	 * @private
	 */
	
	FacetFilterList.prototype._fireListCloseEvent = function() {
	
	              var aSelectedItems = this.getSelectedItems();
	       var oSelectedKeys = this.getSelectedKeys();
	       
	       var bAllSelected = aSelectedItems.length === 0;
	     
	       this._firstTime = true;
	       
	       this.fireListClose({
	              selectedItems : aSelectedItems,
	              selectedKeys : oSelectedKeys,
	              allSelected : bAllSelected
	       });
	
	};
	
	
	/**
	 * Set this list active if at least one list item is selected, or the all checkbox is selected
	 * 
	 * @private
	 */
	FacetFilterList.prototype._updateActiveState = function() {
		
		var oCheckbox = sap.ui.getCore().byId(this.getAssociation("allcheckbox"));
		if (Object.getOwnPropertyNames(this._oSelectedKeys).length > 0 || (oCheckbox && oCheckbox.getSelected())) {
			this.setActive(true);
		}
	};
	
	
	/**
	 * Handle both liveChange and search events.
	 * 
	 * @private
	 */
	FacetFilterList.prototype._handleSearchEvent = function(oEvent) {
	
		var sSearchVal = oEvent.getParameters()["query"];
		if (sSearchVal === undefined) {
			sSearchVal = oEvent.getParameters()["newValue"];
		}
		this._search(sSearchVal);
		
		// If search was cleared and a selected item is made visible, make sure to set the
		// checkbox accordingly.
		this._updateSelectAllCheckBox();
	};
	
	/**
	 * Filter list items with the given search value. If an item's text value does not contain the search
	 * value then it is filtered out of the list. 
	 * 
	 * No search is done if the list is not bound to a model.
	 * 
	 * @private
	 */
	
	FacetFilterList.prototype._search = function(sSearchVal, force) {
	
		var bindingInfoaFilters;
		var numberOfsPath = 0;
	
		if (force || (sSearchVal !== this._searchValue)) {
			this._searchValue = sSearchVal;
			var oBinding = this.getBinding("items");
			var oBindingInfo = this.getBindingInfo("items");
			if (oBindingInfo && oBindingInfo.binding) {
				bindingInfoaFilters = oBindingInfo.binding.aFilters;
				if (bindingInfoaFilters.length > 0) {
					numberOfsPath = bindingInfoaFilters[0].aFilters.length;
					if (this._firstTime) {
						this._saveBindInfo = bindingInfoaFilters[0].aFilters[0];
						this._firstTime = false;
					}
				}
			}
			if (oBinding) { // There will be no binding if the items aggregation has not been bound to a model, so search is not
											// possible
				if (sSearchVal || numberOfsPath > 0) {
					var path = this.getBindingInfo("items").template.getBindingInfo("text").parts[0].path;
					if (path) {
						var oUserFilter = new sap.ui.model.Filter(path, sap.ui.model.FilterOperator.Contains, sSearchVal);
						if (oBinding.getModel() instanceof sap.ui.model.odata.ODataModel && this.getEnableCaseInsensitiveSearch()){
							 //notice the single quotes wrapping the value from the UI control!
							var sEncodedString = "'" + String(sSearchVal).replace(/'/g, "''") + "'";
							sEncodedString = sEncodedString.toLowerCase();
							oUserFilter = new sap.ui.model.Filter("tolower(" + path + ")", sap.ui.model.FilterOperator.Contains, sEncodedString);
						}
						if (numberOfsPath > 1) {
							var oFinalFilter = new sap.ui.model.Filter([oUserFilter, this._saveBindInfo], true);
						} else {
							if (this._saveBindInfo > "" && oUserFilter.sPath != this._saveBindInfo.sPath) {
								var oFinalFilter = new sap.ui.model.Filter([oUserFilter, this._saveBindInfo], true);
							} else {
								if (sSearchVal == "") {
									var oFinalFilter = [];
								} else {
									var oFinalFilter = new sap.ui.model.Filter([oUserFilter], true);
								}
							}
						}
						oBinding.filter(oFinalFilter, sap.ui.model.FilterType.Control);
					}
				} else {
					oBinding.filter([], sap.ui.model.FilterType.Control);
				}
			} else {
				jQuery.sap.log.warning("No filtering performed", "The list must be defined with a binding for search to work",
						this);
			}
		}
	
	};
	
	/**
	 * 
	 * @returns The last searched value
	 */
	FacetFilterList.prototype._getSearchValue = function() {
		
		return this._searchValue;
	};
	
	/**
	 * Update the select all checkbox according to the state of selections in the list and the list active state. This has
	 * no effect for lists not in MultiSelect mode.
	 * 
	 * @param bItemSelected
	 *          The selection state of the item currently being selected or deselected.
	 * @private
	 */
	FacetFilterList.prototype._updateSelectAllCheckBox = function(bItemSelected) {
		
		if (this.getMultiSelect()) {
			var oCheckbox = sap.ui.getCore().byId(this.getAssociation("allcheckbox"));
			
			  if (bItemSelected) {
				oCheckbox && oCheckbox.setSelected(false);
			} else {
				
				// Checkbox may not be defined if an item is selected and the list is not displayed
				oCheckbox && oCheckbox.setSelected(Object.getOwnPropertyNames(this._oSelectedKeys).length === 0 && this.getActive());
			}
		}
	};
	
	/**
	 * Add a key to the selected keys cache.
	 * 
	 * @param sKey
	 * @param sText
	 */
	FacetFilterList.prototype._addSelectedKey = function(sKey, sText){
		
		if (!sKey && !sText) {
			jQuery.sap.log.error("Both sKey and sText are not defined. At least one must be defined.");
			return;
		}
		if (this.getMode() === sap.m.ListMode.SingleSelectMaster) {
			this.removeSelectedKeys();
		}
		if (!sKey) {
			sKey = sText;
		}
		this._oSelectedKeys[sKey] = sText || sKey;
	};
	
	/**
	 * Remove the given key from the selected keys cache. This does not deselect the associated item and therefore does
	 * not cause onItemSelectedChange to be called.
	 * 
	 * @param sKey The key to remove. If null, then the value of sText will be used as the key.
	 * @param sText If key is null then this parameter will be used as the key.
	 * @returns {Boolean} true if the key was removed
	 */
	FacetFilterList.prototype._removeSelectedKey = function(sKey, sText) {
		
		if (!sKey && !sText) {
			jQuery.sap.log.error("Both sKey and sText are not defined. At least one must be defined.");
			return false;
		}
		
		// Since it is common for applications to use text as the key (and not set key), set the key to the text value if no key is given
		if (!sKey) {
			sKey = sText;
		}
		delete this._oSelectedKeys[sKey];
		return true;
	};
	
	/**
	 * Determine the selected state of the given item. The item's text value will
	 * be used as the lookup key if the item does not have a key set. This is done
	 * for convenience to allow applications to only set the item text and have it
	 * used also as the key.
	 * 
	 * @param oItem
	 * @returns true if the item is selected, false otherwise
	 * @private
	 */
	FacetFilterList.prototype._isItemSelected = function(oItem){
		return !!(this._oSelectedKeys[oItem && (oItem.getKey() || oItem.getText())]);
	};
	
	/**
	 * For each item key in the selected keys cache, select the matching FacetFilterItem
	 * present in the 'items' aggregation.
	 * 
	 * @private
	 */
	FacetFilterList.prototype._selectItemsByKeys = function(){
		this.getItems().forEach(function (oItem){
			oItem.setSelected(this._isItemSelected(oItem));
		}, this);
	};
	
	
	FacetFilterList.prototype.onItemSelectedChange = function(oItem, bSelect) {
		
		// This method override runs when setSelected is called from ListItemBase. Here we update
		// the selected keys cache based on whether the item is being selected or not. We also
		// update the select all checkbox state and list active state based on the selected
		// state of all items taken as a whole.
		if (bSelect) {
			this._addSelectedKey(oItem.getKey(), oItem.getText());
		} else {
			this._removeSelectedKey(oItem.getKey(), oItem.getText());
		}
		sap.m.ListBase.prototype.onItemSelectedChange.apply(this, arguments);
		
		this._updateSelectAllCheckBox(bSelect);
		this.setActive(this.getActive() || bSelect);
		!this.getDomRef() && this.getParent() && this.getParent().getDomRef() && this.getParent().invalidate();
	};
	
	
	FacetFilterList.prototype.updateItems = function(sReason) {
		
		// This method override runs when the list updates its items. The reason
		// for the update is given by sReason, which for example can be when the
		// list is filtered or when it grows.
	  this._filtering = sReason === sap.ui.model.ChangeReason.Filter;
	  sap.m.ListBase.prototype.updateItems.apply(this,arguments);
	  this._filtering = false;
	  // If this list is not set to growing or it has been filtered then we must make sure that selections are
	  // applied to items matching keys contained in the selected keys cache.  Selections
	  // in a growing list are handled by the updateFinished handler. 
	  if (!this.getGrowing() || sReason === sap.ui.model.ChangeReason.Filter) {
	  this._selectItemsByKeys();
	  }
	};
	

	return FacetFilterList;

}, /* bExport= */ true);
