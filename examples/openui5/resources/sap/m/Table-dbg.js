/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.m.Table.
sap.ui.define(['jquery.sap.global', './ListBase', './library'],
	function(jQuery, ListBase, library) {
	"use strict";


	
	/**
	 * Constructor for a new Table.
	 *
	 * @param {string} [sId] Id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * <code>sap.m.Table</code> control provides a set of sophisticated and convenience functions for responsive table design.
	 * For mobile devices, the recommended limit of table rows is 100 (based on 4 columns) to assure proper performance. To improve initial rendering on large tables, use the <code>growing</code> feature.
	 * @extends sap.m.ListBase
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @since 1.16
	 * @alias sap.m.Table
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var Table = ListBase.extend("sap.m.Table", /** @lends sap.m.Table.prototype */ { metadata : {
	
		library : "sap.m",
		properties : {
	
			/**
			 * Sets the background style of the table. Depending on the theme, you can change the state of the background from <code>Solid</code> to <code>Translucent</code> or to <code>Transparent</code>.
			 */
			backgroundDesign : {type : "sap.m.BackgroundDesign", group : "Appearance", defaultValue : sap.m.BackgroundDesign.Translucent},
	
			/**
			 * Defines the algorithm to be used to layout the table cells, rows, and columns.
			 * By default, a table is rendered with fixed layout algorithm. This means the horizontal layout only depends on the table's width and the width of the columns, not the contents of the cells. Cells in subsequent rows do not affect column widths. This allows a browser to layout the table faster than the auto table layout since the browser can begin to display the table once the first row has been analyzed.
			 * 
			 * When this property is set to <code>false</code>, <code>sap.m.Table</code> is rendered with auto layout algorithm. This means, the width of the table and its cells depends on the contents of the cells. The column width is set by the widest unbreakable content inside the cells. This can make the rendering slow, since the browser needs to read through all the content in the table before determining the final layout.
			 * <b>Note:</b> Since <code>sap.m.Table</code> does not have its own scrollbars, setting <code>fixedLayout</code> to false can force the table to overflow, which may cause visual problems. It is suggested to use this property when a table has a few columns in wide screens or within the horizontal scroll container (e.g <code>sap.m.Dialog</code>) to handle overflow.
			 * In auto layout mode the <code>width</code> property of <code>sap.m.Column</code> is taken into account as a minimum width.
			 * @since 1.22
			 */
			fixedLayout : {type : "boolean", group : "Behavior", defaultValue : true},
	
			/**
			 * Setting this property to <code>true</code> will show an overlay on top of the table content and prevents the user interaction with it.
			 * @since 1.22.1
			 */
			showOverlay : {type : "boolean", group : "Appearance", defaultValue : false}
		},
		aggregations : {
	
			/**
			 * Defines the columns of the table.
			 */
			columns : {type : "sap.m.Column", multiple : true, singularName : "column"}
		}
	}});
	
	// class name for the navigation items
	Table.prototype.sNavItemClass = "sapMListTblRow";
	
	Table.prototype.init = function() {
		this._hasPopin = false;
		this._iItemNeedsColumn = 0;
		this._selectAllCheckBox = null;
		ListBase.prototype.init.call(this);
	};
	
	Table.prototype.onBeforeRendering = function() {
		ListBase.prototype.onBeforeRendering.call(this);
		this._notifyColumns("ItemsRemoved");
	};
	
	Table.prototype.onAfterRendering = function() {
		ListBase.prototype.onAfterRendering.call(this);
	
		// notify columns after rendering
		var $Table = jQuery(this.getTableDomRef());
		this._notifyColumns("ColumnRendered", $Table, !this.getFixedLayout());

		this.updateSelectAllCheckbox();
		this._renderOverlay();
	};
	
	Table.prototype._renderOverlay = function() {
		var $this = this.$(),
		    $overlay = $this.find(".sapMTableOverlay"),
		    bShowOverlay = this.getShowOverlay();
		if (bShowOverlay && $overlay.length === 0) {
			$overlay = jQuery("<div>").addClass("sapUiOverlay sapMTableOverlay").css("z-index", "1");
			$this.append($overlay);
		} else if (!bShowOverlay) {
			$overlay.remove();
		}
	};
	
	Table.prototype.setShowOverlay = function(bShow) {
		this.setProperty("showOverlay", bShow, true);
		this._renderOverlay();
		return this;
	};
	
	Table.prototype.exit = function () {
		ListBase.prototype.exit.call(this);
		if (this._selectAllCheckBox) {
			this._selectAllCheckBox.destroy();
			this._selectAllCheckBox = null;
		}
	};
	
	Table.prototype.destroyItems = function() {
		this._notifyColumns("ItemsRemoved");
		return ListBase.prototype.destroyItems.call(this);
	};
	
	Table.prototype.removeAllItems = function() {
		this._notifyColumns("ItemsRemoved");
		return ListBase.prototype.removeAllItems.call(this);
	};
	
	Table.prototype.removeSelections = function() {
		ListBase.prototype.removeSelections.apply(this, arguments);
		this.updateSelectAllCheckbox();
		return this;
	};
	
	Table.prototype.selectAll = function () {
		ListBase.prototype.selectAll.apply(this, arguments);
		this.updateSelectAllCheckbox();
		return this;
	};
	
	/**
	 * Getter for aggregation columns.
	 *
	 * @param {Boolean} [bSort] set true to get the columns in an order that respects personalization settings
	 * @returns {sap.m.Column[]} columns of the Table
	 * @public
	 */
	Table.prototype.getColumns = function(bSort) {
		var aColumns = this.getAggregation("columns", []);
		if (bSort) {
			aColumns.sort(function(c1, c2) {
				return c1.getOrder() - c2.getOrder();
			});
		}
		return aColumns;
	};
	
	/*
	 * This hook method is called if growing feature is enabled and after new page loaded
	 * @overwrite
	 */
	Table.prototype.onAfterPageLoaded = function() {
		this.updateSelectAllCheckbox();
		ListBase.prototype.onAfterPageLoaded.apply(this, arguments);
	};
	
	/*
	 * This hook method is called from renderer to determine whether items should render or not
	 * @overwrite
	 */
	Table.prototype.shouldRenderItems = function() {
		return this.getColumns().some(function(oColumn) {
			return oColumn.getVisible();
		});
	};
	
	// this gets called when item type column requirement is changed
	Table.prototype.onItemTypeColumnChange = function(oItem, bNeedsTypeColumn) {
		this._iItemNeedsColumn += (bNeedsTypeColumn ? 1 : -1);
		
		// update type column visibility
		if (this._iItemNeedsColumn == 1 && bNeedsTypeColumn) {
			this._setTypeColumnVisibility(true);
		} else if (this._iItemNeedsColumn == 0) {
			this._setTypeColumnVisibility(false);
		}
	};
	
	// this gets called when selected property of the item is changed
	Table.prototype.onItemSelectedChange = function(oItem, bSelect) {
		ListBase.prototype.onItemSelectedChange.apply(this, arguments);
		jQuery.sap.delayedCall(0, this, function() {
			this.updateSelectAllCheckbox();
		});
	};
	
	/*
	 * Returns the <table> DOM reference
	 * @protected
	 */
	Table.prototype.getTableDomRef = function() {
		return this.getDomRef("listUl");
	};
	
	/*
	 * Returns items container DOM reference
	 * @overwrite
	 */
	Table.prototype.getItemsContainerDomRef = function() {
		return this.getDomRef("tblBody");
	};
	
	/*
	 * Sets DOM References for keyboard navigation
	 * @overwrite
	 */
	Table.prototype.setNavigationItems = function(oItemNavigation) {
		var $Header = this.$("tblHeader");
		var $Footer = this.$("tblFooter");
		var $Rows = this.$("tblBody").find(".sapMLIB");
		
		var aItemDomRefs = $Header.add($Rows).add($Footer).get();
		oItemNavigation.setItemDomRefs(aItemDomRefs);
		
		// header and footer are in the item navigation but 
		// initial focus should be at the first item row
		if (oItemNavigation.getFocusedIndex() == -1) {
			oItemNavigation.setFocusedIndex($Header[0] ? 1 : 0);
		}
	};
	
	/*
	 * Determines for growing feature to handle all data from scratch
	 * if column merging and growing feature are active at the same time
	 * it is complicated to remerge or demerge columns when we
	 * insert or delete items from the table with growing diff logic
	 *
	 * @protected
	 */
	Table.prototype.checkGrowingFromScratch = function() {
		// no merging for popin case
		if (this.hasPopin()) {
			return false;
		}
	
		// check visibility and merge feature of columns
		return this.getColumns().some(function(oColumn) {
			return oColumn.getVisible() && oColumn.getMergeDuplicates();
		});
	};
	
	/*
	 * This method is called asynchronously if resize event comes from column
	 * @protected
	 */
	Table.prototype.onColumnResize = function(oColumn) {
		// if list did not have pop-in and will not have pop-in
		// then we do not need re-render, we can just change display of column
		if (!this.hasPopin() && !this._mutex) {
			var hasPopin = this.getColumns().some(function(col) {
				return col.isPopin();
			});
	
			if (!hasPopin) {
				oColumn.setDisplayViaMedia(this.getTableDomRef());
				return;
			}
		}
	
		this._dirty = window.innerWidth;
		if (!this._mutex) {
			var clean = window.innerWidth;
			this._mutex = true;
			this.rerender();
	
			// do not re-render if resize event comes so frequently
			jQuery.sap.delayedCall(200, this, function() {
				// but check if any event come during the wait-time
				if (this._dirty != clean) {
					this._dirty = 0;
					this.rerender();
				}
				this._mutex = false;
			});
		}
	};
		
	/*
	 * This method is called from Column control when column visibility is changed via CSS media query
	 *
	 * @param {boolean} bColVisible whether column is now visible or not
	 * @protected
	 */
	Table.prototype.setTableHeaderVisibility = function(bColVisible) {
		if (!this.getDomRef()) {
			return;
		}
	
		// find first visible column
		var $table = jQuery(this.getTableDomRef()),
			$headRow = $table.find("thead > tr"),
			bHeaderVisible = !$headRow.hasClass("sapMListTblHeaderNone"),
			aVisibleColumns = $headRow.find(".sapMListTblCell").filter(":visible"),
			$firstVisibleCol = aVisibleColumns.eq(0);
	
		// check if only one column is visible
		if (aVisibleColumns.length == 1) {
			$firstVisibleCol.width("");	// cover the space
		} else {
			// set original width of columns
			aVisibleColumns.each(function() {
				this.style.width = this.getAttribute("data-sap-width") || "";
			});
		}
	
		// update GroupHeader colspan according to visible column count and additional selection column
		$table.find(".sapMGHLICell").attr("colspan", aVisibleColumns.length + !!sap.m.ListBaseRenderer.ModeOrder[this.getMode()]);
	
		// remove or show column header row(thead) according to column visibility value
		if (!bColVisible && bHeaderVisible) {
			$headRow[0].className = "sapMListTblRow sapMListTblHeader";
			this._headerHidden = false;
		} else if (bColVisible && !bHeaderVisible && !aVisibleColumns.length) {
			$headRow[0].className = "sapMListTblHeaderNone";
			this._headerHidden = true;
		}
	};
	
	// updates the type column visibility and sets the aria flag
	Table.prototype._setTypeColumnVisibility = function(bVisible) {
		var $Table = jQuery(this.getTableDomRef()),
			$TypeColumnHeader = this.$("tblHeadNav"),
			iTypeColumnIndex = $TypeColumnHeader.index() + 1,
			$TypeColumnCells = $Table.find("tr > td:nth-child(" + iTypeColumnIndex + ")");
		
		$Table.toggleClass("sapMListTblHasNav", bVisible);
		$TypeColumnHeader.attr("aria-hidden", !bVisible);
		$TypeColumnCells.attr("aria-hidden", !bVisible);
	};
	
	// notify all columns with given action and param
	Table.prototype._notifyColumns = function(sAction, vParam1, vParam2) {
		this.getColumns().forEach(function(oColumn) {
			oColumn["on" + sAction](vParam1, vParam2);
		});
	};

	/**
	 * This method takes care of the select all checkbox for table lists. It
	 * will automatically be created on demand and returned when needed
	 *
	 * @private
	 * @return {sap.m.CheckBox} reference to the internal select all checkbox
	 */
	Table.prototype._getSelectAllCheckbox = function() {
		return this._selectAllCheckBox || (this._selectAllCheckBox = new sap.m.CheckBox({
			id: this.getId("sa"),
			activeHandling: false
		}).setParent(this, null, true).attachSelect(function () {
			if (this._selectAllCheckBox.getSelected()) {
				this.selectAll(true);
			} else {
				this.removeSelections(false, true);
			}
		}, this).setTabIndex(-1).addEventDelegate({
			onAfterRendering: function() {
				// hide this from the screen readers
				this._selectAllCheckBox.getFocusDomRef().setAttribute("aria-hidden", "true");
			}
		}, this));
	};
	
	/*
	 * Internal public function to update the selectAll checkbox
	 * according to the current selection on the list items.
	 *
	 * @protected
	 */
	Table.prototype.updateSelectAllCheckbox = function () {
		// checks if the list is in multi select mode and has selectAll checkbox
		if (this._selectAllCheckBox && this.getMode() === "MultiSelect") {
			var aItems = this.getItems(),
				iSelectedItemCount = this.getSelectedItems().length,
				iSelectableItemCount = aItems.filter(function(oItem) {
					return oItem.isSelectable();
				}).length;
	
			// set state of the checkbox by comparing item length and selected item length
			this._selectAllCheckBox.setSelected(aItems.length > 0 && iSelectedItemCount == iSelectableItemCount);
		}
	};
	
	/*
	 * Returns colspan for all columns except navigation
	 * Because we render navigation always even it is empty
	 * @protected
	 */
	Table.prototype.getColSpan = function() {
		return (this._colCount || 1 ) - 1;
	};
	
	/*
	 * Returns the number of total columns
	 * @protected
	 */
	Table.prototype.getColCount = function() {
		return (this._colCount || 0);
	};
	
	/*
	 * Returns whether or not the table is in pop-in mode
	 * @protected
	 */
	Table.prototype.hasPopin = function() {
		return !!this._hasPopin;
	};
	
	/*
	 * Returns whether given event is initialized within header row or not
	 * @protected
	 */
	Table.prototype.isHeaderRowEvent = function(oEvent) {
		var $Header = this.$("tblHeader");
		return !!jQuery(oEvent.target).closest($Header, this.getTableDomRef()).length;
	};
	
	/*
	 * Returns whether give event is initialized within footer row or not
	 * @protected
	 */
	Table.prototype.isFooterRowEvent = function(oEvent) {
		var $Footer = this.$("tblFooter");
		return !!jQuery(oEvent.target).closest($Footer, this.getTableDomRef()).length;
	};
	
	/*
	 * This gets called after navigation items are focused
	 * Overwrites the ListItemBase default handling
	 */
	Table.prototype.onNavigationItemFocus = function() {
	};
	
	// keyboard handling
	Table.prototype.onsapspace = function(oEvent) {
		if (oEvent.isMarked()) {
			return;
		}
	
		// toggle select all header checkbox and fire its event
		if (oEvent.target === this.getDomRef("tblHeader") && this._selectAllCheckBox) {
			this._selectAllCheckBox.setSelected(!this._selectAllCheckBox.getSelected()).fireSelect();
			oEvent.preventDefault();
			oEvent.setMarked();
		}
	};
	
	// Handle tab key 
	Table.prototype.onsaptabnext = function(oEvent) {
		if (oEvent.isMarked()) {
			return;
		}
		
		var $Row = jQuery();
		if (oEvent.target.id == this.getId("nodata")) {
			$Row = this.$("nodata");
		} if (this.isHeaderRowEvent(oEvent)) {
			$Row = this.$("tblHeader");
		} else if (this.isFooterRowEvent(oEvent)) {
			$Row = this.$("tblFooter");
		}
		
		var oLastTabbableDomRef = $Row.find(":sapTabbable").get(-1) || $Row[0];
		if (oEvent.target === oLastTabbableDomRef) {
			this.forwardTab(true);
		}
	};
	
	// Handle shift-tab key 
	Table.prototype.onsaptabprevious = function(oEvent) {
		if (oEvent.isMarked()) {
			return;
		}
		
		var sTargetId = oEvent.target.id;
		if (sTargetId == this.getId("nodata") ||
			sTargetId == this.getId("tblHeader") || 
			sTargetId == this.getId("tblFooter")) {
			this.forwardTab(false);
		} else if (sTargetId == this.getId("trigger")) {
			this.focusPrevious();
			oEvent.preventDefault();
		}
	};

	return Table;

}, /* bExport= */ true);
