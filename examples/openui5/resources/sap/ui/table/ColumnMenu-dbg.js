/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.table.ColumnMenu.
sap.ui.define(['jquery.sap.global', 'sap/ui/core/RenderManager', './library', 'sap/ui/unified/Menu', 'sap/ui/unified/MenuItem'],
	function(jQuery, RenderManager, library, Menu, MenuItem) {
	"use strict";


	
	/**
	 * Constructor for a new ColumnMenu.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * The column menu provides all common actions that can be performed on a column.
	 * @extends sap.ui.unified.Menu
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @alias sap.ui.table.ColumnMenu
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var ColumnMenu = Menu.extend("sap.ui.table.ColumnMenu", /** @lends sap.ui.table.ColumnMenu.prototype */ { metadata : {
	
		library : "sap.ui.table"
	}});
	
	
	/**
	 * This file defines behavior for the control,
	 */
	
	
	/**
	 * Initialization of the ColumnMenu control
	 * @private
	 */
	ColumnMenu.prototype.init = function() {
		if (Menu.prototype.init) {
			Menu.prototype.init.apply(this, arguments);
		}
		this.addStyleClass("sapUiTableColumnMenu");
		this.oResBundle = sap.ui.getCore().getLibraryResourceBundle("sap.ui.table");
		this._bInvalidated = true;
		this._iPopupClosedTimeoutId = null;
		this._oColumn = null;
		this._oTable = null;
		this._attachPopupClosed();
	};
	
	
	/**
	 * Termination of the ColumnMenu control
	 * @private
	 */
	ColumnMenu.prototype.exit = function() {
		if (Menu.prototype.exit) {
			Menu.prototype.exit.apply(this, arguments);
		}
		window.clearTimeout(this._iPopupClosedTimeoutId);
		this._detachEvents();
		this._oColumn = this._oTable = null;
	};
	
	
	/**
	 * Event handler. Called when the theme is changed.
	 * @private
	 */
	ColumnMenu.prototype.onThemeChanged = function() {
		if (this.getDomRef()) {
			this._invalidate();
		}
	};
	
	
	/**
	 * Overwrite of {@link sap.ui.unified.Menu#setParent} method.
	 * @see sap.ui.unified.Menu#setParent
	 * @private
	 */
	ColumnMenu.prototype.setParent = function(oParent) {
		this._detachEvents();
		this._invalidate();
		this._updateReferences(oParent);
		this._attachEvents();
		return Menu.prototype.setParent.apply(this, arguments);
	};
	
	ColumnMenu.prototype._updateReferences = function(oParent) {
		this._oColumn = oParent;
		if (oParent) {
			jQuery.sap.assert(oParent instanceof sap.ui.table.Column, "ColumnMenu.setParent: parent must be a subclass of sap.ui.table.Column");
	
			this._oTable = this._oColumn.getParent();
			if (this._oTable) {
				jQuery.sap.assert(this._oTable instanceof sap.ui.table.Table || this._oTable instanceof sap.ui.table.DataTable, "ColumnMenu.setParent: parent of parent must be subclass of sap.ui.table.Table");
			}
		}
	};
	
	
	/**
	 * Attaches the required event handlers.
	 * @private
	 */
	ColumnMenu.prototype._attachEvents = function() {
		if (this._oTable) {
			this._oTable.attachColumnVisibility(this._invalidate, this);
			this._oTable.attachColumnMove(this._invalidate, this);
		}
	};
	
	
	/**
	 * Detaches the required event handlers.
	 * @private
	 */
	ColumnMenu.prototype._detachEvents = function() {
		if (this._oTable) {
			this._oTable.detachColumnVisibility(this._invalidate, this);
			this._oTable.detachColumnMove(this._invalidate, this);
		}
	};
	
	/**
	 * Invalidates the column menu control items. Forces recreation of the menu items when the menu is opened.
	 * @private
	 */
	ColumnMenu.prototype._invalidate = function() {
		this._bInvalidated = true;
	};
	
	
	/**
	 * Special handling for IE < 9 when the popup is closed.
	 * The associated column of the menu is focused when the menu is closed.
	 * @private
	 */
	ColumnMenu.prototype._attachPopupClosed = function() {
		// put the focus back into the column header after the 
		// popup is being closed.
		var that = this;

		if (!sap.ui.Device.support.touch) {
			this.getPopup().attachClosed(function(oEvent) {
				that._iPopupClosedTimeoutId = window.setTimeout(function() {
					if (that._oColumn) {
						if (that._lastFocusedDomRef) {
							that._lastFocusedDomRef.focus();
						} else {
							that._oColumn.focus();
						}
					}
				}, 0);
			});
		}
	};
	
	
	/**
	 * Overwrite of {@link sap.ui.unified.Menu#open} method.
	 * @see sap.ui.unified.Menu#open
	 * @private
	 */
	ColumnMenu.prototype.open = function() {
		if (this._bInvalidated) {
			this._bInvalidated = false;
			this.destroyItems();
			this._addMenuItems();
		}
	
		if (this.getItems().length > 0) {
			this._lastFocusedDomRef = arguments[4];
			Menu.prototype.open.apply(this, arguments);
		}
	};
	
	
	/**
	 * Adds the menu items to the menu.
	 * @private
	 */
	ColumnMenu.prototype._addMenuItems = function() {
		// when you add or remove menu items here, remember to update the Column.prototype._menuHasItems function
		if (this._oColumn) {
			this._addSortMenuItem(false);
			this._addSortMenuItem(true);
			this._addFilterMenuItem();
			this._addGroupMenuItem();
			this._addFreezeMenuItem();
			this._addColumnVisibilityMenuItem();
		}
	};

	/**
	 * Adds the sort menu item to the menu.
	 * @param {boolean} bDesc the sort direction. <code>true</code> for descending.
	 * @private
	 */
	ColumnMenu.prototype._addSortMenuItem = function(bDesc) {
		var oColumn = this._oColumn;

		if (oColumn.isSortableByMenu()) {
			var sDir = bDesc ? "desc" : "asc";
			var sIcon = bDesc ? "sort-descending" : "sort-ascending";
			if (oColumn.getSortProperty() && oColumn.getShowSortMenuEntry()) {
				this.addItem(this._createMenuItem(
					sDir,
						"TBL_SORT_" + sDir.toUpperCase(),
					sIcon,
					function (oEvent) {
						oColumn.sort(bDesc, oEvent.getParameter("ctrlKey") === true);
					}
				));
			}
		}
	};
	
	
	/**
	 * Adds the filter menu item to the menu.
	 * @private
	 */
	ColumnMenu.prototype._addFilterMenuItem = function() {
		var oColumn = this._oColumn;
		var oTable = oColumn.getParent();
		var bEnableCustomFilter = false;
	
		if (oTable) {
			bEnableCustomFilter = oTable.getEnableCustomFilter();
		}
	
		if (oColumn.isFilterableByMenu()) {
			if (bEnableCustomFilter) {
				this.addItem(this._createMenuItem(
					"filter",
					"TBL_FILTER_ITEM",
					"filter",
					function(oEvent) {
						oTable.fireCustomFilter({
							column: oColumn
						});
					}
				));
			} else {
				this.addItem(this._createMenuTextFieldItem(
					"filter",
					"TBL_FILTER",
					"filter",
					oColumn.getFilterValue(),
					function(oEvent) {
						oColumn.filter(this.getValue());
					}
				));
			}
		}
	};
	
	
	/**
	 * Adds the group menu item to the menu.
	 * @private
	 */
	ColumnMenu.prototype._addGroupMenuItem = function() {
		var oColumn = this._oColumn;
		var oTable = this._oTable;
		if (oColumn.isGroupableByMenu()) {
			if (oTable && oTable.getEnableGrouping() && oColumn.getSortProperty()) {
				this.addItem(this._createMenuItem(
					"group",
					"TBL_GROUP",
					null,
					jQuery.proxy(function(oEvent) {
						oTable.setGroupBy(oColumn);
					},this)
				));
			}
		}
	};
	
	
	/**
	 * Adds the freeze menu item to the menu.
	 * @private
	 */
	ColumnMenu.prototype._addFreezeMenuItem = function() {
		var oColumn = this._oColumn;
		var oTable = this._oTable;
		if (oTable && oTable.getEnableColumnFreeze()) {
			var iColumnIndex = jQuery.inArray(oColumn, oTable.getColumns());
			var bIsFixedColumn = iColumnIndex + 1 == oTable.getFixedColumnCount();
			this.addItem(this._createMenuItem(
				"freeze",
				bIsFixedColumn ? "TBL_UNFREEZE" : "TBL_FREEZE",
				null,
				function(oEvent) {
					
					// forward the event
					var bExecuteDefault = oTable.fireColumnFreeze({
						column: oColumn
					});
	
					// execute the column freezing
					if (bExecuteDefault) {
						if (bIsFixedColumn) {
							oTable.setFixedColumnCount(0);
						} else {
							oTable.setFixedColumnCount(iColumnIndex + 1);
						}
					}
				}
			));
		}
	};
	
	
	/**
	 * Adds the column visibility menu item to the menu.
	 * @private
	 */
	ColumnMenu.prototype._addColumnVisibilityMenuItem = function() {
		var oTable = this._oTable;
	
		if (oTable && oTable.getShowColumnVisibilityMenu()) {
			var oColumnVisibiltyMenuItem = this._createMenuItem("column-visibilty", "TBL_COLUMNS");
			this.addItem(oColumnVisibiltyMenuItem);
	
			var oColumnVisibiltyMenu = new Menu(oColumnVisibiltyMenuItem.getId() + "-menu");
			oColumnVisibiltyMenu.addStyleClass("sapUiTableColumnVisibilityMenu");
			oColumnVisibiltyMenuItem.setSubmenu(oColumnVisibiltyMenu);
	
			var aColumns = oTable.getColumns();
			
			if (oTable.getColumnVisibilityMenuSorter && typeof oTable.getColumnVisibilityMenuSorter === "function") {
				var oSorter = oTable.getColumnVisibilityMenuSorter();
				if (typeof oSorter === "function") {
					aColumns = aColumns.sort(oSorter);
				}
			}

			var oBinding = oTable.getBinding();
			var bAnalyticalBinding = sap.ui.model && sap.ui.model.analytics && oBinding instanceof sap.ui.model.analytics.AnalyticalBinding;

			for (var i = 0, l = aColumns.length; i < l; i++) {
				var oColumn = aColumns[i];
				// skip columns which are set to invisible by analytical metadata
				if (bAnalyticalBinding && oColumn instanceof sap.ui.table.AnalyticalColumn) {

					var oQueryResult = oBinding.getAnalyticalQueryResult();
					var oEntityType = oQueryResult.getEntityType();
					var oMetadata = oBinding.getModel().getProperty("/#" + oEntityType.getTypeDescription().name + "/" + oColumn.getLeadingProperty() + "/sap:visible");

					if (oMetadata && (oMetadata.value === "false" || oMetadata.value === false)) {
						continue;
					}
				}
				var oMenuItem = this._createColumnVisibilityMenuItem(oColumnVisibiltyMenu.getId() + "-item-" + i, oColumn);
				oColumnVisibiltyMenu.addItem(oMenuItem);
			}
		}
	};
	
	
	/**
	 * Factory method for the column visibility menu item.
	 * @param {string} sId the id of the menu item.
	 * @param {sap.ui.table.Column} oColumn the associated column to the menu item.
	 * @return {sap.ui.unified.MenuItem} the created menu item.
	 * @private
	 */
	ColumnMenu.prototype._createColumnVisibilityMenuItem = function(sId, oColumn) {
		var sText = oColumn.getName() || (oColumn.getLabel() && oColumn.getLabel().getText ? oColumn.getLabel().getText() : null);
		return new MenuItem(sId, {
			text: sText,
			icon: oColumn.getVisible() ? "sap-icon://accept" : null,
			select: jQuery.proxy(function(oEvent) {
				var oMenuItem = oEvent.getSource();
				var bVisible = !oColumn.getVisible();
				if (bVisible || this._oTable._getVisibleColumnCount() > 1) {
					var oTable = oColumn.getParent();
					var bExecuteDefault = true;
					if (oTable && (oTable instanceof sap.ui.table.Table || oTable instanceof sap.ui.table.DataTable)) {
						bExecuteDefault = oTable.fireColumnVisibility({
							column: oColumn,
							newVisible: bVisible
						});
					}
					if (bExecuteDefault) {
						oColumn.setVisible(bVisible);
					}
					oMenuItem.setIcon(bVisible ? "sap-icon://accept" : null);
				}
			}, this)
		});
	};
	
	
	/**
	 * Factory method for a menu item.
	 * @param {string} sId the id of the menu item.
	 * @param {string} sTextI18nKey the i18n key that should be used for the menu item text.
	 * @param {string} sIcon the icon name
	 * @param {function} fHandler the handler function to call when the item gets selected.
	 * @return {sap.ui.unified.MenuItem} the created menu item.
	 * @private
	 */
	ColumnMenu.prototype._createMenuItem = function(sId, sTextI18nKey, sIcon, fHandler) {
		return new MenuItem(this.getId() + "-" + sId, {
			text: this.oResBundle.getText(sTextI18nKey),
			icon: sIcon ? "sap-icon://" + sIcon : null,
			select: fHandler || function() {}
		});
	};
	
	
	/**
	 * Factory method for a menu text field item.
	 * @param {string} sId the id of the menu item.
	 * @param {string} sTextI18nKey the i18n key that should be used for the menu item text.
	 * @param {string} sIcon the icon name
	 * @param {string} sValue the default value of the text field
	 * @param {function} fHandler the handler function to call when the item gets selected.
	 * @return {sap.ui.unified.MenuTextFieldItem} the created menu text field item.
	 * @private
	 */
	ColumnMenu.prototype._createMenuTextFieldItem = function(sId, sTextI18nKey, sIcon, sValue, fHandler) {
		jQuery.sap.require("sap.ui.unified.MenuTextFieldItem");
		fHandler = fHandler || function() {};
		return new sap.ui.unified.MenuTextFieldItem(this.getId() + "-" + sId, {
			label: this.oResBundle.getText(sTextI18nKey),
			icon: sIcon ? "sap-icon://" + sIcon : null,
			value: sValue,
			select: fHandler || function() {}
		});
	};
	
	
	/**
	 * sets a new filter value into the filter field
	 * @private
	 */
	ColumnMenu.prototype._setFilterValue = function(sValue) {
		var oColumn = this.getParent();
		var oTable = (oColumn ? oColumn.getParent() : undefined);

		var oFilterField = sap.ui.getCore().byId(this.getId() + "-filter");
		if (oFilterField && (oTable && !oTable.getEnableCustomFilter())) {
			oFilterField.setValue(sValue);
		}
		return this;
	};
	
	/**
	 * Sets the value state of the filter field
	 * @private
	 */
	ColumnMenu.prototype._setFilterState = function(sFilterState) {
		var oColumn = this.getParent();
		var oTable = (oColumn ? oColumn.getParent() : undefined);

		var oFilterField = sap.ui.getCore().byId(this.getId() + "-filter");
		if (oFilterField && (oTable && !oTable.getEnableCustomFilter())) {
			oFilterField.setValueState(sFilterState);
		}
		return this;
	};
	

	return ColumnMenu;

}, /* bExport= */ true);
