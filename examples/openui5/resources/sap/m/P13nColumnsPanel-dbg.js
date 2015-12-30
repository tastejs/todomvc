/*
 * ! UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.m.P13nColumnsPanel.
sap.ui.define([
	'jquery.sap.global', './ColumnListItem', './P13nPanel', './P13nColumnsItem', './SearchField', './Table', './library', 'sap/ui/core/Control'
], function(jQuery, ColumnListItem, P13nPanel, P13nColumnsItem, SearchField, Table, library, Control) {
	"use strict";

	/**
	 * Constructor for a new P13nColumnsPanel.
	 * 
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 * @class The P13nColumnsPanel control is used to define column-specific settings for table personalization.
	 * @extends sap.m.P13nPanel
	 * @author SAP SE
	 * @version 1.32.9
	 * @constructor
	 * @public
	 * @since 1.26.0
	 * @alias sap.m.P13nColumnsPanel
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var P13nColumnsPanel = P13nPanel.extend("sap.m.P13nColumnsPanel", /** @lends sap.m.P13nColumnsPanel.prototype */
	{
		metadata: {
			library: "sap.m",
			properties: {
				/**
				 * Used to specify a threshold of visible items.
				 * 
				 * @since 1.26.7
				 */
				visibleItemsThreshold: {
					type: "int",
					group: "Behavior",
					defaultValue: -1
				}
			},
			aggregations: {
				/**
				 * List of columns that has been changed.
				 * 
				 * @since 1.26.0
				 */
				columnsItems: {
					type: "sap.m.P13nColumnsItem",
					multiple: true,
					singularName: "columnsItem",
					bindable: "bindable"
				},

				/**
				 * Internal aggregation for the toolbar.
				 */
				content: {
					type: "sap.ui.core.Control",
					multiple: true,
					singularName: "content",
					visibility: "hidden"
				}
			},
			events: {

				/**
				 * Event raised when a <code>columnsItem</code> is added.
				 * 
				 * @since 1.26.0
				 */
				addColumnsItem: {
					parameters: {
						/**
						 * <code>columnsItem</code> that needs to be added in the model.
						 */
						newItem: {
							type: "sap.m.P13nColumnsItem"
						}
					}
				},
				/**
				 * Event raised if <code>columnsItems</code> is changed or new one needs to be created in the model.
				 * 
				 * @since 1.26.7
				 */
				changeColumnsItems: {
					parameters: {
						/**
						 * Contains <code>columnsItems</code> that needs to be created in the model.
						 */
						newItems: {
							type: "sap.m.P13nColumnsItem[]"
						},
						/**
						 * Contains <code>columnsItems</code> that needs to be changed in the model.
						 */
						existingItems: {
							type: "sap.m.P13nColumnsItem[]"
						}
					}
				},
				/**
				 * Event raised if <code>setData</code> is called in model. The event serves the purpose of minimizing such calls since they can
				 * take up a lot of performance.
				 * 
				 * @since 1.26.7
				 */
				setData: {}
			}
		}
	});

	/* =========================================================== */
	/* Private methods and properties */
	/* =========================================================== */

	/**
	 * Move selected item to begin of the item list
	 * 
	 * @private
	 */
	P13nColumnsPanel.prototype._ItemMoveToTop = function() {
		var iOldIndex = -1, iNewIndex = -1, sItemKey = null, aTableItems = null;

		if (this._oSelectedItem) {
			aTableItems = this._oTable.getItems();

			// Determine new and old item index
			sItemKey = this._oSelectedItem.data('P13nColumnKey');
			iOldIndex = this._getArrayIndexByItemKey(sItemKey, aTableItems);

			// calculate new item index
			iNewIndex = iOldIndex;
			if (iOldIndex > 0) {
				iNewIndex = 0;
			}

			// apply new item index
			if (iNewIndex != -1 && iOldIndex != -1 && iOldIndex != iNewIndex) {
				this._handleItemIndexChanged(this._oSelectedItem, iNewIndex);
				this._changeColumnsItemsIndexes(iOldIndex, iNewIndex);
				this._afterMoveItem();
			}
		}
	};

	/**
	 * Move selected item one position up
	 * 
	 * @private
	 */
	P13nColumnsPanel.prototype._ItemMoveUp = function() {
		var iOldIndex = -1, iNewIndex = -1, sItemKey = null, aTableItems = null;

		if (this._oSelectedItem) {
			aTableItems = this._oTable.getItems();

			// Determine new and old item index
			sItemKey = this._oSelectedItem.data('P13nColumnKey');
			iOldIndex = this._getArrayIndexByItemKey(sItemKey, aTableItems);

			// calculate new item index
			iNewIndex = iOldIndex;
			if (iOldIndex > 0) {
				iNewIndex = this._getPreviousItemIndex(iOldIndex);
			}

			// apply new item index
			if (iNewIndex != -1 && iOldIndex != -1 && iOldIndex != iNewIndex) {
				this._handleItemIndexChanged(this._oSelectedItem, iNewIndex);
				this._changeColumnsItemsIndexes(iOldIndex, iNewIndex);
				this._afterMoveItem();
			}
		}
	};

	/**
	 * Move selected item one position down
	 * 
	 * @private
	 */
	P13nColumnsPanel.prototype._ItemMoveDown = function() {
		var iOldIndex = -1, iNewIndex = -1, sItemKey = null, aTableItems = null;
		var iTableMaxIndex = null;

		if (this._oSelectedItem) {
			aTableItems = this._oTable.getItems();
			iTableMaxIndex = aTableItems.length;

			// Determine new and old item index
			sItemKey = this._oSelectedItem.data('P13nColumnKey');
			iOldIndex = this._getArrayIndexByItemKey(sItemKey, aTableItems);

			// calculate new item index
			iNewIndex = iOldIndex;
			if (iOldIndex < iTableMaxIndex - 1) {
				iNewIndex = this._getNextItemIndex(iOldIndex);
			}

			// apply new item index
			if (iNewIndex != -1 && iOldIndex != -1 && iOldIndex != iNewIndex) {
				this._handleItemIndexChanged(this._oSelectedItem, iNewIndex);
				this._changeColumnsItemsIndexes(iOldIndex, iNewIndex);
				this._afterMoveItem();
			}
		}
	};

	/**
	 * Move selected item to end of the item list
	 * 
	 * @private
	 */
	P13nColumnsPanel.prototype._ItemMoveToBottom = function() {
		var iOldIndex = -1, iNewIndex = -1, sItemKey = null, aTableItems = null;
		var iTableMaxIndex = null;

		if (this._oSelectedItem) {
			aTableItems = this._oTable.getItems();
			iTableMaxIndex = aTableItems.length;

			// Determine new and old item index
			sItemKey = this._oSelectedItem.data('P13nColumnKey');
			iOldIndex = this._getArrayIndexByItemKey(sItemKey, aTableItems);

			// calculate new item index
			iNewIndex = iOldIndex;
			if (iOldIndex < iTableMaxIndex - 1) {
				iNewIndex = iTableMaxIndex - 1;
			}

			// apply new item index
			if (iNewIndex != -1 && iOldIndex != -1 && iOldIndex != iNewIndex) {
				this._handleItemIndexChanged(this._oSelectedItem, iNewIndex);
				this._changeColumnsItemsIndexes(iOldIndex, iNewIndex);
				this._afterMoveItem();
			}
		}
	};

	/**
	 * This method determines all columnsItems that have an index property, which are not undefined and fit into index range of iOldIndex & iNewIndex.
	 * If such columnsItems are found take the index property and change it to a value according to the move direction.
	 * 
	 * @private
	 * @param {int} iOldIndex is the index from where the correction shall start in columnsItems
	 * @param {int} iNewIndex is the index to where the correction shall run in columnsItems
	 */
	P13nColumnsPanel.prototype._changeColumnsItemsIndexes = function(iOldIndex, iNewIndex) {
		var iMinIndex = null, iMaxIndex = null, sSelectedItemColumnKey = null, iMaxTableIndex = null;
		var aColumnsItems = null, iColumnsItemIndex = null, sColumnKey = null;

		if (iOldIndex !== null && iOldIndex !== undefined && iOldIndex > -1 && iNewIndex !== null && iNewIndex !== undefined && iNewIndex > -1 && iOldIndex !== iNewIndex) {

			iMinIndex = Math.min(iOldIndex, iNewIndex);
			iMaxIndex = Math.max(iOldIndex, iNewIndex);
			iMaxTableIndex = this._oTable.getItems().length - 1;

			aColumnsItems = this.getColumnsItems();
			sSelectedItemColumnKey = this._oSelectedItem.data('P13nColumnKey');
			aColumnsItems.forEach(function(oColumnsItem) {

				// Exclude columnKey for selectedItem as this one is already set right
				sColumnKey = oColumnsItem.getColumnKey();
				if (sColumnKey !== undefined && sColumnKey === sSelectedItemColumnKey) {
					return;
				}

				iColumnsItemIndex = oColumnsItem.getIndex();
				// identify columnsItems that does not fit into index range --> exclude them
				if (iColumnsItemIndex === undefined || iColumnsItemIndex < 0 || iColumnsItemIndex < iMinIndex || iColumnsItemIndex > iMaxIndex) {
					return;
				}

				// For all remain columnsItems change the index property according to the move action
				if (iOldIndex > iNewIndex) {
					// Action: column moved UP
					if (iColumnsItemIndex < iMaxTableIndex) {
						iColumnsItemIndex += 1;
					}
				} else {
					// Action: column moved DOWN
					if (iColumnsItemIndex > 0) {
						iColumnsItemIndex -= 1;
					}
				}
				oColumnsItem.setIndex(iColumnsItemIndex);
			});
		}
	};

	/**
	 * After an items was moved renewal selected items instance and it's selection
	 * 
	 * @private
	 */
	P13nColumnsPanel.prototype._afterMoveItem = function() {
		this._scrollToSelectedItem(this._oSelectedItem);
		this._calculateMoveButtonAppearance();
	};

	/**
	 * Swop "Show Selected" button to "Show All"
	 * 
	 * @private
	 */
	P13nColumnsPanel.prototype._swopShowSelectedButton = function() {
		var sNewButtonText;

		// Swop the button text
		this._bShowSelected = !this._bShowSelected;
		if (this._bShowSelected) {
			sNewButtonText = this._oRb.getText('COLUMNSPANEL_SHOW_ALL');
		} else {
			sNewButtonText = this._oRb.getText('COLUMNSPANEL_SHOW_SELECTED');
		}
		this._oShowSelectedButton.setText(sNewButtonText);
		this._changeEnableProperty4SelectAll();

		this._filterItems();
		if (this._oSelectedItem && this._oSelectedItem.getVisible() !== true) {
			this._deactivateSelectedItem();
		}

		this._scrollToSelectedItem(this._oSelectedItem);
		this._calculateMoveButtonAppearance();
		this._fnHandleResize();
	};

	/**
	 * Escapes special characters
	 * 
	 * @private
	 * @param {string} sToEscape contains the content that shall be escaped
	 */
	P13nColumnsPanel.prototype._escapeRegExp = function(sToEscape) {
		if (sToEscape) {
			return sToEscape.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
		}
	};

	/**
	 * Filters items by its selection status
	 * 
	 * @private
	 */
	P13nColumnsPanel.prototype._filterItems = function() {
		var aSelectedItems = null, aTableItems = null;
		var iLength = 0, jLength = 0, i = 0, j = 0;
		var oItem = null, oItemTemplate = null;
		var bItemVisibleBySearchText, bItemVisibleBySelection;
		var sItemText = null, sSearchText = null, regExp = null;

		// Get table items according "Show Selected" button status
		if (this._bShowSelected) {
			aSelectedItems = this._oTable.getSelectedItems();
		} else {
			aSelectedItems = this._oTable.getItems();
		}

		// Get search filter value
		if (this._bSearchFilterActive) {
			sSearchText = this._oSearchField.getValue();

			// replace white-spaces at BEGIN & END of the searchText, NOT IN BETWEEN!!
			if (sSearchText) {
				sSearchText = sSearchText.replace(/(^\s+)|(\s+$)/g, '');
			}
			// create RegEx for search only if a searchText exist!!
			if (sSearchText !== null && sSearchText !== undefined) {// " " is a VALID value!!!
				sSearchText = this._escapeRegExp(sSearchText); // escape user input
				sSearchText = regExp = new RegExp(sSearchText, 'igm'); // i = ignore case; g = global; m = multiline

			}
		}

		aTableItems = this._oTable.getItems();
		iLength = aTableItems.length;
		for (i = 0; i < iLength; i++) {
			oItem = aTableItems[i];
			bItemVisibleBySearchText = true;
			bItemVisibleBySelection = false;

			// Is filtering via search text active
			if (this._bSearchFilterActive) {
				bItemVisibleBySearchText = false;

				// search in item text
				sItemText = oItem.getCells()[0].getText();
				if (sItemText && regExp !== null && sItemText.match(regExp) !== null) {
					bItemVisibleBySearchText = true;
				}

				// search in tooltip text of actual item
				if (bItemVisibleBySearchText !== true && oItem.getTooltip_Text) {
					sItemText = (oItem.getTooltip() instanceof sap.ui.core.TooltipBase ? oItem.getTooltip().getTooltip_Text() : oItem.getTooltip_Text());
					if (sItemText && regExp !== null && sItemText.match(regExp) !== null) {
						bItemVisibleBySearchText = true;
					}
				}
			}
			// Is filtering via selection active
			jLength = aSelectedItems.length;
			for (j = 0; j < jLength; j++) {
				oItemTemplate = aSelectedItems[j];
				if (oItemTemplate) {
					if (oItemTemplate.getId() == oItem.getId()) {
						bItemVisibleBySelection = true;
						break;
					}
				}
			}
			oItem.setVisible(bItemVisibleBySelection && bItemVisibleBySearchText);
		}
	};

	/**
	 * Execute search by filtering columns list based on the given sValue
	 * 
	 * @private
	 * @param {boolean} bStatus is OPTIONAL and determines whether the SelectAll check-box is enabled = true||false
	 */
	P13nColumnsPanel.prototype._changeEnableProperty4SelectAll = function(bStatus) {
		var oTableCB = sap.ui.getCore().byId(this._oTable.getId() + '-sa');

		if (oTableCB) {
			oTableCB.setEnabled(!this._bSearchFilterActive && !this._bShowSelected);
		}
	};

	/**
	 * Execute search by filtering columns list based on the given sValue
	 * 
	 * @private
	 */
	P13nColumnsPanel.prototype._executeSearch = function() {
		var sValue = this._oSearchField.getValue();
		var iLength = sValue.length || 0;

		// change search filter status
		if (iLength > 0) {
			this._bSearchFilterActive = true;
		} else {
			this._bSearchFilterActive = false;
		}

		// De-Activate table header checkBox
		this._changeEnableProperty4SelectAll();

		// filter table items based on user selections
		this._filterItems();

		// check, whether actual selected item is still visible after filterItems -> if not -> deactivate selected
		// item
		if (this._oSelectedItem && this._oSelectedItem.getVisible() !== true) {
			this._deactivateSelectedItem();
		}

		this._calculateMoveButtonAppearance();
		this._scrollToSelectedItem(this._oSelectedItem);
	};

	/**
	 * Determine the previous table item index starting from position, which comes via iStartIndex
	 * 
	 * @private
	 * @param {inteter} iStartIndex is the table index from where the search start
	 * @returns {integer} is the index of a previous items; if no item is found it will be returned -1
	 */
	P13nColumnsPanel.prototype._getPreviousItemIndex = function(iStartIndex) {
		var iResult = -1, i = 0;
		var aTableItems = null, oTableItem = null;

		if (iStartIndex !== null && iStartIndex !== undefined && iStartIndex > 0) {
			if (this._bShowSelected === true) {
				aTableItems = this._oTable.getItems();
				if (aTableItems && aTableItems.length > 0) {
					for (i = iStartIndex - 1; i >= 0; i--) {
						oTableItem = aTableItems[i];
						if (oTableItem && oTableItem.getSelected() === true) {
							iResult = i;
							break;
						}
					}
				}
			} else {
				iResult = iStartIndex - 1;
			}
		}

		return iResult;
	};

	/**
	 * Determine the next table item index to that position, which comes via iStartIndex
	 * 
	 * @private
	 * @param {inteter} iStartIndex is the table index from where the search start
	 * @returns {integer} is the index of the next item; if no item is found it will be returned -1
	 */
	P13nColumnsPanel.prototype._getNextItemIndex = function(iStartIndex) {
		var iResult = -1, i = 0, iLength = null;
		var aTableItems = null, oTableItem = null;

		if (iStartIndex !== null && iStartIndex !== undefined && iStartIndex > -1) {
			aTableItems = this._oTable.getItems();
			if (aTableItems && aTableItems.length > 0) {
				iLength = aTableItems.length;
			}

			if (iStartIndex >= 0 && iStartIndex < iLength - 1) {
				if (this._bShowSelected === true) {
					for (i = iStartIndex + 1; i < iLength; i++) {
						oTableItem = aTableItems[i];
						if (oTableItem && oTableItem.getSelected() === true) {
							iResult = i;
							break;
						}
					}
				} else {
					iResult = iStartIndex + 1;
				}
			}
		}

		return iResult;
	};

	/**
	 * Update Select All column count information
	 * 
	 * @private
	 */
	P13nColumnsPanel.prototype._updateSelectAllDescription = function(oEvent) {
		var iTableItems = this._oTable.getItems().length;
		var iSelectedItems = this._oTable.getSelectedItems().length;
		var sSelectAllText = null;

		// update the selection label
		var oColumn = this._oTable.getColumns()[0];
		if (oColumn) {
			sSelectAllText = this._oRb.getText('COLUMNSPANEL_SELECT_ALL');
			if (iSelectedItems !== null && iSelectedItems !== undefined && iSelectedItems >= 0) {
				sSelectAllText = this._oRb.getText('COLUMNSPANEL_SELECT_ALL_WITH_COUNTER', [
					iSelectedItems, iTableItems
				]);
			}
			oColumn.getHeader().setText(sSelectAllText);
		}

		if (this._bShowSelected) {
			this._filterItems();
		}
	};

	/**
	 * Change the selected item instance to the new given one
	 * 
	 * @private
	 */
	P13nColumnsPanel.prototype._changeSelectedItem = function(oItem) {
		var oNewSelectedItem = null;

		// Remove highlighting from previous item
		if (this._oSelectedItem !== null && this._oSelectedItem !== undefined) {
			this._removeHighLightingFromItem(this._oSelectedItem);
		}

		// Set highlighting to just selected item (only in case it is not already selected -> then do nothing)
		oNewSelectedItem = oItem;
		if (oNewSelectedItem != this._oSelectedItem) {
			this._oSelectedItem = oNewSelectedItem;
			this._setHighLightingToItem(this._oSelectedItem);
		} else {
			this._oSelectedItem = null;
		}

		// Calculate move button appearance
		this._calculateMoveButtonAppearance();
	};

	/**
	 * Item press behavior is called as soon as a table item is selected
	 * 
	 * @private
	 */
	P13nColumnsPanel.prototype._itemPressed = function(oEvent) {
		var oNewSelectedItem = null;
		// Change selected items
		oNewSelectedItem = oEvent.getParameter('listItem');
		this._changeSelectedItem(oNewSelectedItem);
	};

	/**
	 * Calculates the Appearance of the move button depending of selected item instance
	 * 
	 * @private
	 */
	P13nColumnsPanel.prototype._calculateMoveButtonAppearance = function() {
		var sItemKey = null, aTableItems = null;
		var iLength = -1, iItemIndex = -1;
		var bMoveUp = false, bMoveDown = false;

		/*
		 * Calculate MOVE buttons appearance
		 */

		// if search field is filled -> disable move buttons
		if (this._bSearchFilterActive === true) {
			bMoveUp = bMoveDown = false;
		} else if (this._oSelectedItem !== null && this._oSelectedItem !== undefined) {
			sItemKey = this._oSelectedItem.data('P13nColumnKey');

			// Determine displayed table items dependent of "Show Selected" filter status
			if (this._bShowSelected === true) {
				aTableItems = this._oTable.getSelectedItems();
			} else {
				aTableItems = this._oTable.getItems();
			}
			iItemIndex = this._getArrayIndexByItemKey(sItemKey, aTableItems);

			if (iItemIndex !== -1) {
				if (aTableItems && aTableItems.length) {
					iLength = aTableItems.length;
				}

				// Minimum border
				if (iItemIndex === 0) {
					bMoveDown = true;
				} else if (iItemIndex === iLength - 1) {
					// Maximum border
					bMoveUp = true;
				} else if (iItemIndex > 0 && iItemIndex < iLength - 1) {
					bMoveDown = true;
					bMoveUp = true;
				}
			}
		} else {
			bMoveUp = bMoveDown = false;
		}

		/*
		 * Now change real appearance of the buttons
		 */
		if (this._oMoveToTopButton.getEnabled() !== bMoveUp) {
			this._oMoveToTopButton.setEnabled(bMoveUp);
		}
		if (this._oMoveUpButton.getEnabled() !== bMoveUp) {
			this._oMoveUpButton.setEnabled(bMoveUp);
		}
		if (this._oMoveDownButton.getEnabled() !== bMoveDown) {
			this._oMoveDownButton.setEnabled(bMoveDown);
		}
		if (this._oMoveToBottomButton.getEnabled() !== bMoveDown) {
			this._oMoveToBottomButton.setEnabled(bMoveDown);
		}
	};

	/**
	 * Set highlighting to an item
	 * 
	 * @private
	 * @param {object} oItem is that item that shall be highlighted
	 */
	P13nColumnsPanel.prototype._setHighLightingToItem = function(oItem) {
		if (oItem !== null && oItem !== undefined && oItem.addStyleClass) {
			oItem.addStyleClass("sapMP13nColumnsPanelItemSelected");
		}
	};

	/**
	 * Remove highlighting from an item
	 * 
	 * @private
	 * @param {object} oItem is that item that where highlighting shall be removed from
	 */
	P13nColumnsPanel.prototype._removeHighLightingFromItem = function(oItem) {
		if (oItem !== null && oItem !== undefined && oItem.removeStyleClass) {
			oItem.removeStyleClass("sapMP13nColumnsPanelItemSelected");
		}
	};

	/**
	 * Deactivate selected items for any movements & all move buttons
	 * 
	 * @private
	 */
	P13nColumnsPanel.prototype._deactivateSelectedItem = function() {
		if (this._oSelectedItem) {
			this._removeHighLightingFromItem(this._oSelectedItem);
			this._oSelectedItem = null;
			this._calculateMoveButtonAppearance();
		}
	};

	/**
	 * Delivers the index of an item in the given array identified by its key
	 * 
	 * @private
	 * @param {string} sItemKey is the key for that item for that the index shall be found in the array
	 * @param {array} aItems is the array in that the item will be searched
	 * @returns {integer} is the index of the identified item
	 */
	P13nColumnsPanel.prototype._getArrayIndexByItemKey = function(sItemKey, aItems) {
		var iResult = -1;
		var iLength = 0, i = 0;
		var oItem = null, sItemKeyTemp = null;

		if (sItemKey !== null && sItemKey !== undefined && sItemKey !== "") {
			if (aItems && aItems.length > 0) {
				iLength = aItems.length;
				for (i = 0; i < iLength; i++) {
					sItemKeyTemp = null;
					oItem = aItems[i];
					if (oItem) {

						if (oItem.getColumnKey) {
							sItemKeyTemp = oItem.getColumnKey();
						} else if (oItem.columnKey) {
							sItemKeyTemp = oItem.columnKey;
						} else {
							sItemKeyTemp = oItem.data('P13nColumnKey');
						}

						if (sItemKeyTemp !== null && sItemKeyTemp !== undefined && sItemKeyTemp !== "") {
							if (sItemKeyTemp === sItemKey) {
								iResult = i;
								break;
							}
						}
					}
				}
			}
		}

		return iResult;
	};

	/**
	 * Scroll table content to given item
	 * 
	 * @private
	 */
	P13nColumnsPanel.prototype._scrollToSelectedItem = function(oItem) {
		var oFocusedElement = null;
		if (oItem) {
			sap.ui.getCore().applyChanges();
			// oItem needs to be rendered, otherwise the necessary scroll calculations cannot be performed
			if (!!oItem.getDomRef()) {
				// get just focused DOM element
				oFocusedElement = document.activeElement;

				// focus actual item to get it into the scroll container viewport
				oItem.focus();

				// reset focus to previous DOM element
				if (oFocusedElement && oFocusedElement.focus) {
					oFocusedElement.focus();
				}
			}
		}
	};

	/**
	 * This method extracts all information from given columnsItems array into a JSON based list
	 * 
	 * @private
	 * @param {array} aColumnsItems list of columnsItems
	 * @returns {array} aExtractionResult is a JSON based array with main information about the given columnsItems array
	 */
	P13nColumnsPanel.prototype._extractExistingColumnsItems = function(aColumnsItems) {
		var aExtractionResult = null, oExtractedObject = null;

		if (aColumnsItems && aColumnsItems.length > 0) {
			aExtractionResult = [];
			aColumnsItems.forEach(function(oColumnsItem) {
				oExtractedObject = {
					columnKey: oColumnsItem.getColumnKey(),
					index: oColumnsItem.getIndex(),
					visible: oColumnsItem.getVisible(),
					width: oColumnsItem.getWidth()
				};
				aExtractionResult.push(oExtractedObject);
			});
		}

		return aExtractionResult;
	};

	/**
	 * This method extracts all information from existing table items into a JSON based list
	 * 
	 * @private
	 * @returns {array} aExtractionResult is a JSON based array with main information about table items
	 */
	P13nColumnsPanel.prototype._extractExistingTableItems = function() {
		var aExtractionResult = null, oExtractedObject = null;
		var aTableItems = this._oTable.getItems();

		if (aTableItems && aTableItems.length > 0) {
			aExtractionResult = [];
			aTableItems.forEach(function(oTableItem, iIndex) {
				oExtractedObject = {
					columnKey: oTableItem.data('P13nColumnKey'),
					index: iIndex,
					visible: oTableItem.getSelected(),
					width: oTableItem.data('P13nColumnWidth')
				};
				aExtractionResult.push(oExtractedObject);
			});
		}

		return aExtractionResult;
	};

	/**
	 * react on item visibility changes
	 * 
	 * @private
	 * @param {sap.m.ColumnListItem} oItem is the table item for that the index was changed
	 * @param {int} iNewIndex is the item index where the item shall be inserted
	 */
	P13nColumnsPanel.prototype._handleItemIndexChanged = function(oItem, iNewIndex) {
		var sItemKey = null, iColumnsItemIndex = null;
		var aExistingColumnsItems = [], oColumnsItem = null;
		var aNewColumnsItems = [], aColumnsItems = null;
		var that = this;

		if (oItem && iNewIndex !== null && iNewIndex !== undefined && iNewIndex > -1) {
			sItemKey = oItem.data('P13nColumnKey');
			aColumnsItems = this.getColumnsItems();
			this._aExistingColumnsItems = this._extractExistingColumnsItems(aColumnsItems);

			iColumnsItemIndex = this._getArrayIndexByItemKey(sItemKey, aColumnsItems);
			if (iColumnsItemIndex !== null && iColumnsItemIndex !== undefined && iColumnsItemIndex !== -1) {
				oColumnsItem = aColumnsItems[iColumnsItemIndex];
			}

			// check, whether a columnsItems does exist for actual table item
			if (oColumnsItem === null) {
				oColumnsItem = this._createNewColumnsItem(sItemKey);
				oColumnsItem.setIndex(iNewIndex);
				aNewColumnsItems.push(oColumnsItem);

				this.fireAddColumnsItem({
					newItem: oColumnsItem
				});
			} else {
				oColumnsItem.setIndex(iNewIndex);
				aExistingColumnsItems.push(oColumnsItem);
			}

			// fire consolidated model change event for all collected model changes
			if (aNewColumnsItems.length > 0 || aExistingColumnsItems.length > 0) {
				this.aOwnHandledColumnsItems = aNewColumnsItems;
				this.fireChangeColumnsItems({
					newItems: aNewColumnsItems,
					existingItems: aExistingColumnsItems
				});
			}

			// fire event for setting of changed data into model
			this.fireSetData();

			// react on model changes
			if (aExistingColumnsItems && aExistingColumnsItems.length > 0) {
				aExistingColumnsItems.forEach(function(oItem) {
					that._updateTableItems(oItem);
				});
				this._oTableItemsOrdering.fCheckReOrdering();
			}

		}
	};

	/**
	 * react on item visibility changes
	 * 
	 * @private
	 * @param {array} aItems is an array of JSON objects that represents content of involved sap.m.ColumnListItem
	 */
	P13nColumnsPanel.prototype._handleItemVisibilityChanged = function(aItems) {
		var that = this;
		var sItemKey = null, iColumnsItemIndex = null;
		var aExistingColumnsItems = [], oColumnsItem = null;
		var aNewColumnsItems = [], aColumnsItems = null;

		if (aItems && aItems.length > 0) {
			aColumnsItems = this.getColumnsItems();
			this._aExistingColumnsItems = this._extractExistingColumnsItems(aColumnsItems);

			aItems.forEach(function(oItem) {
				oColumnsItem = iColumnsItemIndex = null;

				sItemKey = oItem.columnKey;

				// check, whether a columnsItems does exist for actual table item
				iColumnsItemIndex = that._getArrayIndexByItemKey(sItemKey, aColumnsItems);
				if (iColumnsItemIndex !== null && iColumnsItemIndex !== undefined && iColumnsItemIndex !== -1) {
					oColumnsItem = aColumnsItems[iColumnsItemIndex];
				}

				if (oColumnsItem === null) {
					oColumnsItem = that._createNewColumnsItem(sItemKey);
					oColumnsItem.setVisible(oItem.visible);
					aNewColumnsItems.push(oColumnsItem);

					that.fireAddColumnsItem({
						newItem: oColumnsItem
					});
				} else {
					oColumnsItem.setVisible(oItem.visible);
					// in case a column will be made invisible -> remove the index property
					if (oColumnsItem.getVisible() === false) {
						oColumnsItem.setIndex(undefined);
					}
					aExistingColumnsItems.push(oColumnsItem);
				}

			});

			// fire consolidated model change event for all collected model changes
			if (aNewColumnsItems.length > 0 || aExistingColumnsItems.length > 0) {
				this.aOwnHandledColumnsItems = aNewColumnsItems;
				this.fireChangeColumnsItems({
					newItems: aNewColumnsItems,
					existingItems: aExistingColumnsItems
				});
			}

			// fire event for setting of changed data into model
			this.fireSetData();

			// react on model changes
			if (aExistingColumnsItems && aExistingColumnsItems.length > 0) {
				aExistingColumnsItems.forEach(function(oItem) {
					that._updateTableItems(oItem);
				});
				this._oTableItemsOrdering.fCheckReOrdering();
			}
		}
	};

	/**
	 * get ColumnsItem by a given ColumnsKey
	 * 
	 * @private
	 * @param {string} sItemKey is the columns key with that a ColumnsItem can be identified
	 * @param {boolean} bCreateIfNotFound determines whether a ColumnsItems will be created if no ColumnsItem was found by the given key
	 * @returns {object} ColumnsItem that was found by the key or created if required
	 */
	P13nColumnsPanel.prototype._createNewColumnsItem = function(sItemKey) {
		var oNewColumnsItem = new sap.m.P13nColumnsItem({
			"columnKey": sItemKey
		});
		return oNewColumnsItem;
	};

	/**
	 * get ColumnsItem by a given ColumnsKey
	 * 
	 * @private
	 * @param {string} sItemKey is the columns key with that a ColumnsItem can be identified
	 * @returns {object} ColumnsItem that was found by the key or created if required
	 */
	P13nColumnsPanel.prototype._getColumnsItemByKey = function(sItemKey) {
		var aColumnsItems = null;
		var iColumnsItemIndex = -1, oColumnsItem = null;

		if (sItemKey !== null && sItemKey !== undefined && sItemKey !== "") {
			aColumnsItems = this.getColumnsItems();
			iColumnsItemIndex = this._getArrayIndexByItemKey(sItemKey, aColumnsItems);

			if (iColumnsItemIndex !== null && iColumnsItemIndex > -1) {
				oColumnsItem = aColumnsItems[iColumnsItemIndex];
			}
		}

		return oColumnsItem;
	};

	/**
	 * Updates table items based on content of ColumnsItem(s)
	 * 
	 * @private
	 * @param {object} oColumnsItem is an item from columnsItems aggregation
	 */
	P13nColumnsPanel.prototype._updateTableItems = function(oColumnsItem) {
		var aTableItems = null, iTableItemIndex, oTableItem = null;
		var aColumnsItems = null, sColumnsKey = null;

		/*
		 * If no direct ColumnsItem is passed in take all existing ColumnsItems for update
		 */
		if (oColumnsItem) {
			aColumnsItems = [];
			aColumnsItems.push(oColumnsItem);
		} else {
			aColumnsItems = this.getColumnsItems();
		}

		// determine existing table items to that ColumnsItems can be applied
		aTableItems = this._oTable.getItems();
		if (aTableItems && aTableItems.length > 0) {
			aColumnsItems.forEach(function(oColumnsItem) {
				sColumnsKey = oColumnsItem.getColumnKey();
				iTableItemIndex = this._getArrayIndexByItemKey(sColumnsKey, aTableItems);
				if (iTableItemIndex !== -1) {
					oTableItem = aTableItems[iTableItemIndex];
					this._applyColumnsItem2TableItem(oColumnsItem, oTableItem);
				}
			}, this);
		}

	};

	/**
	 * This method shall reorder all existing table items. First all selected, and then the unselected items in a alphabetical order
	 * 
	 * @private
	 * @param {object} oColumnsItem is an item from columnsItems aggregation
	 */
	P13nColumnsPanel.prototype._reOrderExistingTableItems = function() {
		var aExistingTableItems = null, aExistingSelectedTableItems = null;
		var iExistingSelectedTableItemIndex = -1, sLanguage = null;
		var that = this;

		// get list of table items and list of selected items
		aExistingTableItems = this._oTable.getItems();
		aExistingSelectedTableItems = this._oTable.getSelectedItems();

		// Calculate list of unselected table Items
		if (aExistingSelectedTableItems && aExistingSelectedTableItems.length > 0) {
			aExistingSelectedTableItems.forEach(function(oExistingSelectedTableItem) {
				iExistingSelectedTableItemIndex = aExistingTableItems.indexOf(oExistingSelectedTableItem);
				if (iExistingSelectedTableItemIndex > -1) {
					aExistingTableItems.splice(iExistingSelectedTableItemIndex, 1);
				}
			});
		}

		// Sort array of unselected table items by it's column name
		if (aExistingTableItems && aExistingTableItems.length > 0) {
			try {
				sLanguage = sap.ui.getCore().getConfiguration().getLocale().toString();
			} catch (exception) {
				// this exception can happen if the configured language is not convertible to BCP47 -> getLocale will deliver an exception
				jQuery.sap.log.error("sap.m.P13nColumnsPanel : no available Language/Locale to sort table items");
				sLanguage = null;
			}

			if (sLanguage) {
				aExistingTableItems.sort(function(a, b) {
					var sTextA = a.getCells()[0].getText();
					var sTextB = b.getCells()[0].getText();
					return sTextA.localeCompare(sTextB, sLanguage, {
						numeric: true
					});
				});
			}
		}

		// remove all table items and refill items: 1. all selected, 2. all unselected, but sorted items
		this._oTable.removeAllItems();
		aExistingSelectedTableItems.forEach(function(oItem) {
			that._oTable.addItem(oItem);
		});
		aExistingTableItems.forEach(function(oItem) {
			that._oTable.addItem(oItem);
		});

	};

	/**
	 * Add a new table item based on the given P13nItem content
	 * 
	 * @private
	 * @param {sap.m.P13nItem} oItem is used to create and added a new table item
	 */
	P13nColumnsPanel.prototype._addTableItem = function(oItem) {
		var oColumnsItem = null;
		var oNewTableItem = null, sColumnKeys = null;

		if (oItem) {
			sColumnKeys = oItem.getColumnKey();
			oColumnsItem = this._getColumnsItemByKey(sColumnKeys);
			oNewTableItem = this._createNewTableItemBasedOnP13nItem(oItem);

			// columnsItem was found -> take over included data
			if (oColumnsItem) {
				// columnsItems exist for current oItem -> insert the new oItem according to found columnsItem
				// information
				if (oColumnsItem.getVisible() !== undefined) {
					oNewTableItem.setSelected(oColumnsItem.getVisible());
				}

				// As long as the ColumnListItem does not reflect the width property -> just store it as customer data
				if (oColumnsItem.getWidth() !== undefined) {
					oNewTableItem.data('P13nColumnWidth', oColumnsItem.getWidth());
				}
			}

			// Calculate index where the new table item shall be placed
			if (oColumnsItem && oColumnsItem.getIndex() !== undefined) {
				// columnsItems with valid index property found -> take this index property
				this._oTable.insertItem(oNewTableItem, oColumnsItem.getIndex());
			} else {
				// No columnsItems exist Or found columnsItem does not contains index property
				this._oTable.addItem(oNewTableItem);
			}
		}
	};

	/**
	 * Inserts a new table item based on the given P13nItem content
	 * 
	 * @private
	 * @param {int} iIndex is the index where the new item shall be inserted
	 * @param {sap.m.P13nItem} oItem is used to create and insert a new table item
	 */
	P13nColumnsPanel.prototype._insertTableItem = function(iIndex, oItem) {
		var oColumnsItem = null, oNewTableItem = null, sColumnKeys = null;

		if (oItem) {
			sColumnKeys = oItem.getColumnKey();
			oColumnsItem = this._getColumnsItemByKey(sColumnKeys);
			oNewTableItem = this._createNewTableItemBasedOnP13nItem(oItem);

			// columnsItem was found -> take over included data
			if (oColumnsItem) {
				// columnsItems exist for current oItem -> insert the new oItem according to found columnsItem
				// information
				if (oColumnsItem.getVisible() !== undefined) {
					oNewTableItem.setSelected(oColumnsItem.getVisible());
				}

				// As long as the ColumnListItem does not reflect the width property -> just store it as customer data
				if (oColumnsItem.getWidth() !== undefined) {
					oNewTableItem.data('P13nColumnWidth', oColumnsItem.getWidth());
				}
			}

			// Insert new table item to table
			if (oColumnsItem && oColumnsItem.getIndex() !== undefined) {
				// columnsItems with valid index property found -> INSERT the new item at the index
				this._oTable.insertItem(oNewTableItem, oColumnsItem.getIndex());
			} else {
				// No columnsItems exist for current item -> INSERT the new item at iIndex
				this._oTable.insertItem(oNewTableItem, iIndex);
			}
		}
	};

	/**
	 * Inserts a new table item based on the given P13nItem content
	 * 
	 * @private
	 * @param {sap.m.P13nItem} oItem is the information template to create a new table item
	 * @returns {sap.m.ColumnListItem} oNewTableItem is the new created table item or null
	 */
	P13nColumnsPanel.prototype._createNewTableItemBasedOnP13nItem = function(oItem) {
		var oNewTableItem = null, sColumnKeys = null;

		if (oItem) {
			sColumnKeys = oItem.getColumnKey();
			oNewTableItem = new sap.m.ColumnListItem({
				cells: [
					new sap.m.Text({
						text: oItem.getText()
					})
				],
				visible: true,
				selected: oItem.getVisible(),
				tooltip: oItem.getTooltip(),
				type: sap.m.ListType.Active
			});
			oNewTableItem.data('P13nColumnKey', sColumnKeys);

			// As long as the ColumnListItem does not reflect the width property -> just store it as customer data
			oNewTableItem.data('P13nColumnWidth', oItem.getWidth());
		}

		return oNewTableItem;
	};

	/**
	 * Apply all ColumnsItem changes (that are stored in its properties) to the proper table item (if it already exist)
	 * 
	 * @private
	 * @param {object} oColumnsItem is an item from columnsItems aggregation
	 * @param {object} oTableItem is that item (in this._oTable) where all ColumnsItem changes will be applied to
	 */
	P13nColumnsPanel.prototype._applyColumnsItem2TableItem = function(oColumnsItem, oTableItem) {
		var aTableItems = this._oTable.getItems();
		var iMaxTableIndex = 0, oRemovedItem = null, iTableItemIndex;
		var sColumnKey = null, iColumnsItemIndex = null, oExistingColumnsItem = null, bIndexPropertyAlreadyKnown = false;

		if (oColumnsItem && oTableItem && aTableItems && aTableItems.length > 0) {
			sColumnKey = oColumnsItem.getColumnKey();

			// Check for special case that columnsItem is already known -> don't apply it again! That can happen if we create a new
			// columnsItems. The binding will remove at first all existing columnsItems and will refill the whole aggregation. Known
			// columnsItems does not need to be applied again!!
			if (this._aExistingColumnsItems && this._aExistingColumnsItems.length > 0) {
				iColumnsItemIndex = this._getArrayIndexByItemKey(sColumnKey, this._aExistingColumnsItems);
				if (iColumnsItemIndex !== -1) {
					oExistingColumnsItem = this._aExistingColumnsItems[iColumnsItemIndex];

					if (oExistingColumnsItem && oExistingColumnsItem.index !== undefined && oExistingColumnsItem.index === oColumnsItem.getIndex()) {
						bIndexPropertyAlreadyKnown = true;
					}
				}
			}

			// apply index property
			if (oColumnsItem.getIndex() !== undefined && !bIndexPropertyAlreadyKnown) {
				iMaxTableIndex = aTableItems.length;
				iTableItemIndex = aTableItems.indexOf(oTableItem);
				if (iTableItemIndex !== oColumnsItem.getIndex() && oColumnsItem.getIndex() <= iMaxTableIndex) {
					oRemovedItem = this._oTable.removeItem(oTableItem);
					this._oTable.insertItem(oRemovedItem, oColumnsItem.getIndex());
				}
			}

			// apply visible property
			if (oColumnsItem.getVisible() !== undefined && oTableItem.getSelected() !== oColumnsItem.getVisible()) {
				oTableItem.setSelected(oColumnsItem.getVisible());
			}

			// apply width property
			if (oColumnsItem.getWidth() !== undefined && oTableItem.data('P13nColumnWidth') !== oColumnsItem.getWidth()) {
				oTableItem.data('P13nColumnWidth', oColumnsItem.getWidth());
			}

		}
	};

	/**
	 * This method returns a boolean based status, whether the panel has been changed
	 * 
	 * @private
	 * @returns {Boolean} bTableItemsChangeStatus that returns true if something was changed and otherwise false
	 */
	P13nColumnsPanel.prototype._getTableItemsChangeStatus = function() {
		var bTableItemsChangeStatus = false, oTableItemNow = null;
		var aTableItemsNow = this._extractExistingTableItems();

		if (this._aExistingTableItems && !aTableItemsNow) {
			bTableItemsChangeStatus = true;
		} else if (aTableItemsNow && !this._aExistingTableItems) {
			bTableItemsChangeStatus = true;
		} else if (this._aExistingTableItems && aTableItemsNow) {
			// Compare existing table items saved from first OnAfterRendering with table items now
			this._aExistingTableItems.forEach(function(oExistingTableItem, iExistingTableItemIndex) {
				oTableItemNow = null;
				if (iExistingTableItemIndex < aTableItemsNow.length) {
					oTableItemNow = aTableItemsNow[iExistingTableItemIndex];
				}

				// Comparison
				if (oTableItemNow) {
					if (oExistingTableItem.columnKey !== oTableItemNow.columnKey) {
						bTableItemsChangeStatus = true;
					}
					if (oExistingTableItem.index !== oTableItemNow.index) {
						bTableItemsChangeStatus = true;
					}
					if (oExistingTableItem.visible !== oTableItemNow.visible) {
						bTableItemsChangeStatus = true;
					}
					if (oExistingTableItem.width !== oTableItemNow.width) {
						bTableItemsChangeStatus = true;
					}

				} else {
					bTableItemsChangeStatus = true;
				}

				// Stop comparison at first difference
				if (bTableItemsChangeStatus) {
					return;
				}
			});
		}

		return bTableItemsChangeStatus;
	};

	/* =========================================================== */
	/* Lifecycle methods */
	/* =========================================================== */

	/**
	 * Initialization hook.
	 * 
	 * @private
	 */
	P13nColumnsPanel.prototype.init = function() {
		var iLiveChangeTimer = 0;
		var that = this;
		this._bOnBeforeRenderingFirstTimeExecuted = false;
		this._bOnAfterRenderingFirstTimeExecuted = false;
		this._aExistingColumnsItems = null;
		this._aExistingTableItems = null;

		// ---------------------------------------------------------------
		// Following object _oTableItemsOrdering handles the table behavior for sorting of included items
		// - _bShallBeOrderedOnlyFirstTime = true means that the table items will ONLY be sorted during the very
		// first OnAfterRendering execution
		// - _bShallBeOrdered = true means that the table items will ALWAYS be resorted if a change will be done
		// - _bAreOrdered = true means that the table items are already order and does not need to
		// be reOrder during the next OnAfterRendering execution
		// ---------------------------------------------------------------
		this._oTableItemsOrdering = {
			"_bShallBeOrdered": true,
			"_bShallBeOrderedOnlyFirstTime": true,
			"_bAreOrdered": false,
			"fIsOrderingToBeDoneOnlyFirstTime": function() {
				return this._bShallBeOrderedOnlyFirstTime;
			},
			"fOrderOnlyFirstTime": function() {
				this._bShallBeOrdered = true;
			},
			"fIsOrderingToBeDone": function(bShallBeOrdered) {
				if (bShallBeOrdered !== undefined && bShallBeOrdered !== null) {
					this._bShallBeOrdered = bShallBeOrdered;
				}
				return this._bShallBeOrdered;
			},
			"fIsOrderingDone": function(bAreOrdered) {
				if (bAreOrdered !== undefined && bAreOrdered !== null) {
					this._bAreOrdered = bAreOrdered;
				}
				return this._bAreOrdered;
			},
			"fCheckReOrdering": function() {
				if (this.fIsOrderingToBeDone()) {
					this._bAreOrdered = false; // real ReOrdring will be dine in OnAfterRendering
				}
			}
		};
		// ---------------------------------------------------------------

		this.setVerticalScrolling(false);

		// Call-back for handling of resizing
		// TODO: make sure we optimize calculation and respect margins and borders, use e.g.
		// jQuery.outerHeight(true)
		this._fnHandleResize = function() {
			var bChangeResult = false, iScrollContainerHeightOld, iScrollContainerHeightNew;
			if (that.getParent) {
				var oParent = null, $dialogCont = null, iContentHeight, iHeaderHeight;
				oParent = that.getParent();
				if (oParent) {
					$dialogCont = jQuery("#" + oParent.getId() + "-cont");
					if ($dialogCont.children().length > 0 && that._oToolbar.$().length > 0) {
						iScrollContainerHeightOld = that._oScrollContainer.$()[0].clientHeight;

						iContentHeight = $dialogCont.children()[0].clientHeight;
						iHeaderHeight = that._oToolbar ? that._oToolbar.$()[0].clientHeight : 0;

						iScrollContainerHeightNew = iContentHeight - iHeaderHeight;

						if (iScrollContainerHeightOld !== iScrollContainerHeightNew) {
							that._oScrollContainer.setHeight(iScrollContainerHeightNew + 'px');
							bChangeResult = true;
						}
					}
				}
			}
			return bChangeResult;
		};

		sap.ui.Device.resize.attachHandler(this._fnHandleResize, this);

		// Resource bundle, for texts
		this._oRb = sap.ui.getCore().getLibraryResourceBundle("sap.m");

		this._oMoveToTopButton = new sap.m.OverflowToolbarButton({
			icon: sap.ui.core.IconPool.getIconURI("collapse-group"),
			text: this._oRb.getText('COLUMNSPANEL_MOVE_TO_TOP'),
			tooltip: this._oRb.getText('COLUMNSPANEL_MOVE_TO_TOP'),
			press: function() {
				that._ItemMoveToTop();
			},
			layoutData: new sap.m.OverflowToolbarLayoutData({
				"moveToOverflow": true
			})
		});

		this._oMoveUpButton = new sap.m.OverflowToolbarButton({
			icon: sap.ui.core.IconPool.getIconURI("slim-arrow-up"),
			text: this._oRb.getText('COLUMNSPANEL_MOVE_UP'),
			tooltip: this._oRb.getText('COLUMNSPANEL_MOVE_UP'),
			press: function() {
				that._ItemMoveUp();
			},
			layoutData: new sap.m.OverflowToolbarLayoutData({
				"moveToOverflow": true
			})
		});

		this._oMoveDownButton = new sap.m.OverflowToolbarButton({
			icon: sap.ui.core.IconPool.getIconURI("slim-arrow-down"),
			text: this._oRb.getText('COLUMNSPANEL_MOVE_DOWN'),
			tooltip: this._oRb.getText('COLUMNSPANEL_MOVE_DOWN'),
			press: function() {
				that._ItemMoveDown();
			},
			layoutData: new sap.m.OverflowToolbarLayoutData({
				"moveToOverflow": true
			})
		});

		this._oMoveToBottomButton = new sap.m.OverflowToolbarButton({
			icon: sap.ui.core.IconPool.getIconURI("expand-group"),
			text: this._oRb.getText('COLUMNSPANEL_MOVE_TO_BOTTOM'),
			tooltip: this._oRb.getText('COLUMNSPANEL_MOVE_TO_BOTTOM'),
			press: function() {
				that._ItemMoveToBottom();
			},
			layoutData: new sap.m.OverflowToolbarLayoutData({
				"moveToOverflow": true
			})
		});

		this._oShowSelectedButton = new sap.m.Button({
			text: this._oRb.getText('COLUMNSPANEL_SHOW_SELECTED'),
			press: function() {
				that._swopShowSelectedButton();
			},
			layoutData: new sap.m.OverflowToolbarLayoutData({
				"moveToOverflow": true
			})
		});
		this._bShowSelected = false;
		this._bSearchFilterActive = false;

		this._oSearchField = new SearchField(this.getId() + "-searchField", {
			liveChange: function(oEvent) {
				var sValue = oEvent.getSource().getValue(), iDelay = (sValue ? 300 : 0); // no delay if value is empty

				// execute search after user stops typing for 300ms
				window.clearTimeout(iLiveChangeTimer);
				if (iDelay) {
					iLiveChangeTimer = window.setTimeout(function() {
						that._executeSearch();
					}, iDelay);
				} else {
					that._executeSearch();
				}
			},
			// execute the standard search
			search: function(oEvent) {
				that._executeSearch();
			},
			layoutData: new sap.m.OverflowToolbarLayoutData({
				"minWidth": "12.5rem",
				"maxWidth": "23.077rem",
				"shrinkable": true,
				"moveToOverflow": false,
				"stayInOverflow": false

			})
		});

		this._oToolbarSpacer = new sap.m.ToolbarSpacer();

		this._oToolbar = new sap.m.OverflowToolbar({
			active: true,
			design: sap.m.ToolbarDesign.Solid, // Transparent,
			content: [
				this._oToolbarSpacer, this._oSearchField, this._oShowSelectedButton, this._oMoveToTopButton, this._oMoveUpButton, this._oMoveDownButton, this._oMoveToBottomButton
			]
		});

		// this._oToolbar.setParent(this);
		this.addAggregation("content", this._oToolbar);

		this._oTable = new Table({
			mode: sap.m.ListMode.MultiSelect,
			rememberSelections: false,
			itemPress: function(oEvent) {
				that._itemPressed(oEvent);
			},
			selectionChange: function(oEvent) {
				that._updateSelectAllDescription(oEvent);

				// set all provided items to the new selection status
				var bSelected = oEvent.getParameter('selected');
				var aTableItems = oEvent.getParameter('listItems');
				var aTableItemsVisibilityChange = [], oTableItemVisibilityChange = null;

				aTableItems.forEach(function(oTableItem) {
					oTableItem.setSelected(bSelected);

					oTableItemVisibilityChange = {
						"columnKey": oTableItem.data('P13nColumnKey'),
						"visible": oTableItem.getSelected()
					};
					aTableItemsVisibilityChange.push(oTableItemVisibilityChange);

				});
				that._handleItemVisibilityChanged(aTableItemsVisibilityChange);

				var fValidate = that.getValidationExecutor();
				if (fValidate) {
					fValidate();
				}

				// Special logic to change _oSelectedItem ALSO then if ONLY the "selection" status has been changed from
				// false to true
				if (aTableItems.length === 1 && bSelected === true) {
					if (aTableItems[0] !== that._oSelectedItem) {
						that._changeSelectedItem(aTableItems[0]);
					}
				}
			},
			columns: [
				new sap.m.Column({
					header: new sap.m.Text({
						text: this._oRb.getText('COLUMNSPANEL_SELECT_ALL')
					})
				})
			]
		});

		this._oScrollContainer = new sap.m.ScrollContainer({
			horizontal: false,
			vertical: true,
			content: [
				this._oTable
			],
			width: '100%',
			height: '100%'
		});

// this._oScrollContainer.setParent(this);
		this.addAggregation("content", this._oScrollContainer);
	};

	/**
	 * This method does a re-initialization of the panel
	 * 
	 * @public
	 * @since 1.28
	 */
	P13nColumnsPanel.prototype.reInitialize = function() {

		// Reactivate one time sorting
		this._oTableItemsOrdering.fOrderOnlyFirstTime();
		this._oTableItemsOrdering.fCheckReOrdering();
	};

	/**
	 * Required adaptations before rendering
	 * 
	 * @private
	 */
	P13nColumnsPanel.prototype.onBeforeRendering = function() {

		// Execute following lines only if this control is started the first time!
		if (!this._bOnBeforeRenderingFirstTimeExecuted) {
			this._bOnBeforeRenderingFirstTimeExecuted = true;

			// check, whether table items shall be order ONLY very first time
			if (this._oTableItemsOrdering.fIsOrderingToBeDoneOnlyFirstTime()) {
				this._oTableItemsOrdering.fOrderOnlyFirstTime();
			}
		}

		// If table items are NOT ordered, but shall be ordered -> do it now
		if (!this._oTableItemsOrdering.fIsOrderingDone() && this._oTableItemsOrdering.fIsOrderingToBeDone()) {
			this._updateTableItems();
			this._reOrderExistingTableItems();
			this._oTableItemsOrdering.fIsOrderingDone(true);

			// if the reOrder was only done during the very first time -> switch reOrdering now to OFF
			if (this._oTableItemsOrdering.fIsOrderingToBeDoneOnlyFirstTime()) {
				this._oTableItemsOrdering.fIsOrderingToBeDone(false);
			}
		}

		// Save existing table items to be able to calculate changes
		if (this._aExistingTableItems === null || this._aExistingTableItems === undefined) {
			this._aExistingTableItems = this._extractExistingTableItems();
		}

		this._updateSelectAllDescription();
		this._calculateMoveButtonAppearance();
	};

	/**
	 * Required adaptations after rendering
	 * 
	 * @private
	 */
	P13nColumnsPanel.prototype.onAfterRendering = function() {
		var that = this, iLiveChangeTimer = 0;

		// adapt scroll-container very first time to the right size of the browser
		if (!this._bOnAfterRenderingFirstTimeExecuted) {
			this._bOnAfterRenderingFirstTimeExecuted = true;
			window.clearTimeout(iLiveChangeTimer);
			iLiveChangeTimer = window.setTimeout(function() {
				that._fnHandleResize();

				// following line is needed to get layout of OverflowToolbar rearranged IF it is used in a dialog
				that._oToolbar._resetAndInvalidateToolbar();
			}, 0);
		}
	};

	/**
	 * Delivers a payload for columnsPanel that can be used at consumer side
	 * 
	 * @public
	 * @since 1.26.7
	 * @returns {object} oPayload, which contains useful information
	 */
	P13nColumnsPanel.prototype.getOkPayload = function() {
		var oPayload = null, aSelectedItems = [], oSelectedItem = null;
		var aTableItems = this._extractExistingTableItems();

		if (aTableItems && aTableItems.length > 0) {
			oPayload = {
				"tableItems": aTableItems,
				"tableItemsChanged": false,
				"selectedItems": aSelectedItems

			};

			aTableItems.forEach(function(oTableItem) {
				if (oTableItem && oTableItem.visible && oTableItem.visible === true) {
					oSelectedItem = {
						"columnKey": oTableItem.columnKey
					};
					aSelectedItems.push(oSelectedItem);
				}
			});

			oPayload.tableItemsChanged = this._getTableItemsChangeStatus();
		}

		return oPayload;
	};

	/**
	 * Delivers a payload for columnsPanel that can be used at consumer side
	 * 
	 * @public
	 * @since 1.28
	 * @returns {object} oPayload, which contains useful information
	 */
	P13nColumnsPanel.prototype.getResetPayload = function() {
		var oPayload = null;

		oPayload = {
			"oPanel": this
		};

		return oPayload;
	};

	/**
	 * Cleans up before destruction.
	 * 
	 * @public
	 */
	P13nColumnsPanel.prototype.exit = function() {

		sap.ui.Device.resize.detachHandler(this._fnHandleResize);

		this._oMoveToTopButton.destroy();
		this._oMoveToTopButton = null;

		this._oMoveDownButton.destroy();
		this._oMoveDownButton = null;

		this._oMoveUpButton.destroy();
		this._oMoveUpButton = null;

		this._oMoveToBottomButton.destroy();
		this._oMoveToBottomButton = null;

		this._oSearchField.destroy();
		this._oSearchField = null;

		this._oToolbar.destroy();
		this._oToolbar = null;

		this._oTable.destroy();
		this._oTable = null;
	};

	/**
	 * Add item to items aggregation
	 * 
	 * @public
	 * @since 1.26.0
	 * @returns {sap.m.P13nColumnsPanel} <code>this</code> to allow method chaining.
	 * @param {sap.m.P13nItem} oItem is the new item that shall be added
	 */
	P13nColumnsPanel.prototype.addItem = function(oItem) {
		P13nPanel.prototype.addItem.apply(this, arguments);

		this._addTableItem(oItem);
		return this;
	};

	/**
	 * Add item to items aggregation
	 * 
	 * @public
	 * @since 1.26.0
	 * @returns {sap.m.P13nColumnsPanel} <code>this</code> to allow method chaining.
	 * @param {int} iIndex is the index where the new item shall be inserted
	 * @param {sap.m.P13nItem} oItem is the new item that shall be added
	 */
	P13nColumnsPanel.prototype.insertItem = function(iIndex, oItem) {
		P13nPanel.prototype.insertItem.apply(this, arguments);

		this._insertTableItem(iIndex, oItem);
		return this;
	};

	/**
	 * Remove item from items aggregation
	 * 
	 * @public
	 * @since 1.26.0
	 * @returns {sap.m.P13nItem} The removed item or null.
	 * @param {sap.m.P13nItem} oItem is the item that shall be removed
	 */
	P13nColumnsPanel.prototype.removeItem = function(oItem) {
		var oTableItemToBeRemoved = null, iItemIndex = null, aTableItems = null, sItemKey = null;

		oItem = P13nPanel.prototype.removeItem.apply(this, arguments);

		if (oItem) {
			sItemKey = oItem.getColumnKey();
			aTableItems = this._oTable.getItems();

			if (aTableItems && aTableItems.length > 0 && sItemKey !== null && sItemKey !== "") {
				iItemIndex = this._getArrayIndexByItemKey(sItemKey, aTableItems);
				if (iItemIndex !== null && iItemIndex !== -1) {
					oTableItemToBeRemoved = aTableItems[iItemIndex];
					if (oTableItemToBeRemoved) {
						this._oTable.removeItem(oTableItemToBeRemoved);
					}
				}
			}
		}

		// return the removed item or null
		return oItem;
	};

	/**
	 * Remove all item from items aggregation
	 * 
	 * @public
	 * @since 1.26.0
	 * @returns {sap.m.P13nItem[]} An array of the removed items (might be empty).
	 */
	P13nColumnsPanel.prototype.removeAllItems = function() {
		var aItems = P13nPanel.prototype.removeAllItems.apply(this, arguments);
		if (this._oTable) {
			this._oTable.removeAllItems();
		}
		return aItems;
	};

	/**
	 * Destroy all items from items aggregation
	 * 
	 * @public
	 * @since 1.26.0
	 * @returns {sap.m.P13nColumnsPanel} <code>this</code> to allow method chaining.
	 */
	P13nColumnsPanel.prototype.destroyItems = function() {
		P13nPanel.prototype.destroyItems.apply(this, arguments);

		if (this._oTable) {
			this._oTable.destroyItems();
		}
		return this;
	};

	/**
	 * Add ColumnsItem to columnsItems aggregation
	 * 
	 * @public
	 * @since 1.26.0
	 * @returns {sap.m.P13nColumnsPanel} <code>this</code> to allow method chaining.
	 * @param {sap.m.P13nColumnsItem} oColumnsItem is the new ColumnsItem that shall be added
	 */
	P13nColumnsPanel.prototype.addColumnsItem = function(oColumnsItem) {
		this.addAggregation("columnsItems", oColumnsItem);

		this._updateTableItems(oColumnsItem);
		this._oTableItemsOrdering.fCheckReOrdering();

		return this;
	};

	/**
	 * Insert ColumnsItem to columnsItems aggregation
	 * 
	 * @public
	 * @since 1.26.0
	 * @returns {sap.m.P13nColumnsPanel} <code>this</code> to allow method chaining.
	 * @param {int} iIndex is the index where the columnsItem item shall be inserted
	 * @param {sap.m.P13nColumnsItem} oColumnsItem is the new columnsItem that shall be inserted
	 */
	P13nColumnsPanel.prototype.insertColumnsItem = function(iIndex, oColumnsItem) {
		this.insertAggregation("columnsItems", oColumnsItem, iIndex);

		this._updateTableItems(oColumnsItem);
		this._oTableItemsOrdering.fCheckReOrdering();

		return this;
	};

	/**
	 * Remove ColumnsItem from columnsItems aggregation
	 * 
	 * @public
	 * @since 1.26.0
	 * @returns {sap.m.P13nColumnsItem} The removed item or null.
	 * @param {sap.m.P13nColumnsItem} oColumnsItem is the ColumnsItem that shall be removed
	 */
	P13nColumnsPanel.prototype.removeColumnsItem = function(oColumnsItem) {
		oColumnsItem = this.removeAggregation("columnsItems", oColumnsItem);

		this._updateTableItems(oColumnsItem);
		this._oTableItemsOrdering.fCheckReOrdering();

		return oColumnsItem;
	};

	/**
	 * Remove all ColumnsItems from columnsItems aggregation
	 * 
	 * @public
	 * @since 1.26.0
	 * @returns {sap.m.P13nColumnsItem[]} An array of the removed items (might be empty).
	 */
	P13nColumnsPanel.prototype.removeAllColumnsItems = function() {
		var aColumnsItems = this.removeAllAggregation("columnsItems");

		this._oTableItemsOrdering.fCheckReOrdering();

		return aColumnsItems;
	};

	/**
	 * Destroy all instances from columnsItems aggregation
	 * 
	 * @public
	 * @since 1.26.0
	 * @returns {sap.m.P13nColumnsPanel} <code>this</code> to allow method chaining.
	 */
	P13nColumnsPanel.prototype.destroyColumnsItems = function() {
		this.destroyAggregation("columnsItems");

		this._oTableItemsOrdering.fCheckReOrdering();

		return this;
	};

	/**
	 * This method is executed before navigation, to provide validation result(s) for columnsPanel
	 * 
	 * @returns {boolean} true if it is allowed to navigate away from this panel, false if it is not allowed
	 * @public
	 * @since 1.26.7
	 */
	P13nColumnsPanel.prototype.onBeforeNavigationFrom = function() {
		var bResult = true;
		var aSelectedItems = this._oTable.getSelectedItems();
		var iVisibleItemsThreshold = this.getVisibleItemsThreshold();

		if (aSelectedItems && iVisibleItemsThreshold !== -1 && aSelectedItems.length > iVisibleItemsThreshold) {
			bResult = false;
		}

		return bResult;
	};

	return P13nColumnsPanel;

}, /* bExport= */true);
