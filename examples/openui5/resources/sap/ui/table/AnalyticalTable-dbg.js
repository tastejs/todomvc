/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.table.AnalyticalTable.
sap.ui.define(['jquery.sap.global', './AnalyticalColumn', './Table', './TreeTable', './library', 'sap/ui/model/analytics/ODataModelAdapter', 'sap/ui/core/IconPool'],
	function(jQuery, AnalyticalColumn, Table, TreeTable, library, ODataModelAdapter, IconPool) {
	"use strict";



	/**
	 * Constructor for a new AnalyticalTable.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * Table which handles analytical OData backends. The AnalyticalTable only works with an AnalyticalBinding and
	 * correctly annotated OData services. Please check on the SAP Annotations for OData Version 2.0 documentation for further details.
	 * @see http://scn.sap.com/docs/DOC-44986
	 *
	 * @extends sap.ui.table.Table
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @alias sap.ui.table.AnalyticalTable
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var AnalyticalTable = Table.extend("sap.ui.table.AnalyticalTable", /** @lends sap.ui.table.AnalyticalTable.prototype */ { metadata : {

		library : "sap.ui.table",
		properties : {

			/**
			 * Specifies if the total values should be displayed in the group headers or on bottom of the row. Does not affact the total sum.
			 */
			sumOnTop : {type : "boolean", group : "Appearance", defaultValue : false},

			/**
			 * Number of levels, which should be opened initially (on first load of data).
			 */
			numberOfExpandedLevels : {type : "int", group : "Misc", defaultValue : 0},
			
			/**
			 * The kind of auto expansion algorithm, e.g. optimised filter conditions, per level requests, ...
			 * sap.ui.table.TreeAutoExpandMode
			 */
			autoExpandMode: {type: "string", group: "Misc", defaultValue: "Bundled" },
			
			/**
			 * Functions which is used to sort the column visibility menu entries e.g.: function(ColumnA, ColumnB) { return 0 = equals, <0 lower, >0 greater }; Other values than functions will be ignored.
			 */
			columnVisibilityMenuSorter : {type : "any", group : "Appearance", defaultValue : null},
			
			/**
			 * Setting collapseRecursive to true means, that when collapsing a node all subsequent child nodes will also be collapsed.
			 */
			collapseRecursive : {type: "boolean", defaultValue: true},
			
			/**
			 * If dirty the content of the Table will be overlayed.
			 * @deprecated Since version 1.21.2.
			 * Please use setShowOverlay instead.
			 */
			dirty : {type : "boolean", group : "Appearance", defaultValue : null, deprecated: true}
		}
	}});


	// =====================================================================
	// WE START WITH A COPY OF THE TREETABLE AND REFACTOR THE CODING!
	// =====================================================================

	/**
	 * This function retrieves the grand total context, in case of an analytical table
	 * Overidden from Table.js
	 * @overrides
	 */
	AnalyticalTable.prototype._getFixedBottomRowContexts = function (oBinding) {
		return oBinding.getGrandTotalContext();
	};

	/**
	 * Initialization of the AnalyticalTable control
	 * @private
	 */
	AnalyticalTable.prototype.init = function() {
		Table.prototype.init.apply(this, arguments);

		this.addStyleClass("sapUiAnalyticalTable");

		this.attachBrowserEvent("contextmenu", this._onContextMenu);

		// defaulting properties
		this.setSelectionMode(sap.ui.table.SelectionMode.MultiToggle);
		this.setShowColumnVisibilityMenu(true);
		this.setEnableColumnFreeze(true);
		this.setEnableCellFilter(true);
		this._aGroupedColumns = [];

		// adopting properties and load icon fonts for bluecrystal
		if (sap.ui.getCore().getConfiguration().getTheme() === "sap_bluecrystal") {

			// add the icon fonts
			jQuery.sap.require("sap.ui.core.IconPool");
			sap.ui.core.IconPool.insertFontFaceStyle();

			// defaulting the rowHeight -> is set via CSS
		}
	};

	AnalyticalTable.prototype.setFixedRowCount = function() {
		jQuery.sap.log.error("The property fixedRowCount is not supported by the AnalyticalTable and must not be set!");
		return this;
	};

	AnalyticalTable.prototype.setFixedBottomRowCount = function() {
		jQuery.sap.log.error("The property fixedBottomRowCount is managed by the AnalyticalTable and must not be set!");
		return this;
	};

	/**
	 * Rerendering handling
	 * @private
	 */
	AnalyticalTable.prototype.onAfterRendering = function() {
		Table.prototype.onAfterRendering.apply(this, arguments);
		this.$().find("[role=grid]").attr("role", "treegrid");
	};

	AnalyticalTable.prototype.setDirty = function(bDirty) {
		jQuery.sap.log.error("The property \"dirty\" is deprecated. Please use \"showOverlay\".");
		this.setProperty("dirty", bDirty, true);
		this.setShowOverlay(this.getDirty());
		return this;
	};

	AnalyticalTable.prototype.getModel = function(oModel, sName) {
		var oModel = Table.prototype.getModel.apply(this, arguments);
		if (oModel) {
			sap.ui.model.analytics.ODataModelAdapter.apply(oModel);
		}
		return oModel;
	};
	
	/**
	 * handler for change events of the binding
	 * @param {sap.ui.base.Event} oEvent change event
	 * @private
	 */
	AnalyticalTable.prototype._onBindingChange = function(oEvent) {
		Table.prototype._onBindingChange.apply(this, arguments);
		// the column menus have to be invalidated when the amount
		// of data changes in the Table; this happens on normal changes
		// of the Table as well as when filtering
		var sReason = typeof (oEvent) === "object" ? oEvent.getParameter("reason") : oEvent;
		if (sReason !== "sort") {
			this._invalidateColumnMenus();
		}
	};

	AnalyticalTable.prototype.bindRows = function(oBindingInfo) {
		// Sanitize the arguments for API Compatibility: sName, sPath, oTemplate, oSorter, aFilters
		var oBindingInfoSanitized = this._sanitizeBindingInfo.apply(this, arguments);
		
		var vReturn = this.bindAggregation("rows", oBindingInfoSanitized);
		this._bSupressRefresh = true;
		this._updateColumns();
		this._bSupressRefresh = false;

		return vReturn;
	};

	/**
	 * _bindAggregation is overwritten, and will be called by either ManagedObject.prototype.bindAggregation 
	 * or ManagedObject.prototype.setModel
	 */
	AnalyticalTable.prototype._bindAggregation = function(sName, sPath, oTemplate, oSorter, aFilters) {
		if (sName === "rows") {
			// make sure to reset the first visible row (currently needed for the analytical binding)
			// TODO: think about a boundary check to reset the firstvisiblerow if out of bounds
			this.setProperty("firstVisibleRow", 0, true);
			
			// The current syntax for _bindAggregation is sPath can be an object wrapping the other parameters
			// in this case we have to sanitize the parameters, so the ODataModelAdapter will instantiate the correct binding.
			this._sanitizeBindingInfo.call(this, sPath, oTemplate, oSorter, aFilters);
		}
		return Table.prototype._bindAggregation.apply(this, arguments);
	};
	
	/**
	 * Overwritten from Table.js - does nothing since the selection is stored in the 
	 */
	AnalyticalTable.prototype._initSelectionModel = function (sSelectionMode) {
		this._oSelection = new sap.ui.model.SelectionModel(sSelectionMode);
		return this;
	};
	
	/**
	 * Sets the selection mode, the current selection is lost.
	 * Since the AnalyticalTable relies on the RowSelector for rendering the group headers the SelectionMode "None" is
	 * not supported and must not be used.
	 * @param {string} sSelectionMode the selection mode, see sap.ui.table.SelectionMode
	 * @public
	 * @return {sap.ui.table.Table} a reference on the table for chaining
	 */
	AnalyticalTable.prototype.setSelectionMode = function (sSelectionMode) {
		// clear selection if the mode changes
		if (sSelectionMode === sap.ui.table.SelectionMode.None) {
			jQuery.sap.log.fatal("SelectionMode 'None' is not supported by the AnalyticalTable.");
			return this;
		}

		var oBinding = this.getBinding("rows");
		if (oBinding && oBinding.clearSelection) {
			oBinding.clearSelection();
		}

		// set selection mode independent from clearing the selection
		this.setProperty("selectionMode", sSelectionMode);
		return this;
	};

	/**
	 * Sets the selection behavior.
	 * Since the AnalyticalTable relies on the RowSelector for rendering the group headers the SelectionBehavior "RowOnly" is
	 * not supported and must not be used.
	 * @param {string} sBehavior the selection behavior, see sap.ui.table.SelectionBehavior
	 * @public
	 * @returns {sap.ui.table.Table} this for chaining
	 */
	AnalyticalTable.prototype.setSelectionBehavior = function (sBehavior) {
		if (sBehavior === sap.ui.table.SelectionBehavior.RowOnly) {
			jQuery.sap.log.fatal("SelectionBehavior 'RowOnly' is not supported by the AnalyticalTable.");
			return this;
		} else {
			return Table.prototype.setSelectionBehavior.apply(this, arguments);
		}
	};
	
	AnalyticalTable.prototype._sanitizeBindingInfo = function (oBindingInfo) {
		var sPath,
			oTemplate,
			aSorters,
			aFilters;
		
		// Old API compatibility
		// previously the bind* functions were called in this pattern: sName, sPath, oTemplate, oSorter, aFilters
		if (typeof oBindingInfo == "string") {
			sPath = arguments[0];
			oTemplate = arguments[1];
			aSorters = arguments[2];
			aFilters = arguments[3];
			oBindingInfo = {path: sPath, sorter: aSorters, filters: aFilters};
			// allow either to pass the template or the factory function as 3rd parameter
			if (oTemplate instanceof sap.ui.base.ManagedObject) {
				oBindingInfo.template = oTemplate;
			} else if (typeof oTemplate === "function") {
				oBindingInfo.factory = oTemplate;
			}
		}
		
		// extract the sorters from the columns (TODO: reconsider this!)
		var aColumns = this.getColumns();
		for (var i = 0, l = aColumns.length; i < l; i++) {
			if (aColumns[i].getSorted()) {
				oBindingInfo.sorter = oBindingInfo.sorter || [];
				oBindingInfo.sorter.push(new sap.ui.model.Sorter(aColumns[i].getSortProperty() || aColumns[i].getLeadingProperty(), aColumns[i].getSortOrder() === sap.ui.table.SortOrder.Descending));
			}
		}
		
		// Make sure all necessary parameters are given.
		// The ODataModelAdapter (via bindList) needs these properties to determine if an AnalyticalBinding should be instantiated.
		// This is the default for the AnalyticalTable.
		oBindingInfo.parameters = oBindingInfo.parameters || {};
		oBindingInfo.parameters.analyticalInfo = this._getColumnInformation();
		oBindingInfo.parameters.sumOnTop = this.getSumOnTop();
		oBindingInfo.parameters.numberOfExpandedLevels = this.getNumberOfExpandedLevels();
		oBindingInfo.parameters.autoExpandMode = this.getAutoExpandMode();
		
		// This may fail, in case the model is not yet set.
		// If this case happens, the ODataModelAdapter is added by the overriden _bindAggregation, which is called during setModel(...)
		var oModel = this.getModel(oBindingInfo.model);
		if (oModel) {
			ODataModelAdapter.apply(oModel);
		}
		
		return oBindingInfo;
	};
	
	/**
	 * @param {Boolean} bSuppressRefresh Suppress Refresh
	 * @returns {sap.ui.table.AnalyticalTable} this
	 * @private
 	 */
	AnalyticalTable.prototype._setSuppressRefresh = function (bSuppressRefresh) {
		this._bSupressRefresh = bSuppressRefresh;
		return this;
	};

	AnalyticalTable.prototype._attachBindingListener = function() {
		var oBinding = this.getBinding("rows");

		// The selectionChanged event is also a special AnalyticalTreeBindingAdapter event.
		// The event interface is the same as in sap.ui.model.SelectionModel, due to compatibility with the sap.ui.table.Table
		if (oBinding && !oBinding.hasListeners("selectionChanged")){
			oBinding.attachSelectionChanged(this._onSelectionChanged, this);
		}

		Table.prototype._attachDataRequestedListeners.apply(this);
	};

	AnalyticalTable.prototype._getColumnInformation = function() {
		var aColumns = [],
			aTableColumns = this.getColumns();

		for (var i = 0; i < this._aGroupedColumns.length; i++) {
			var oColumn = sap.ui.getCore().byId(this._aGroupedColumns[i]);

			if (!oColumn) {
				continue;
			}

			aColumns.push({
				name: oColumn.getLeadingProperty(),
				visible: oColumn.getVisible(),
				grouped: oColumn.getGrouped(),
				total: oColumn.getSummed(),
				sorted: oColumn.getSorted(),
				sortOrder: oColumn.getSortOrder(),
				inResult: oColumn.getInResult(),
				formatter: oColumn.getGroupHeaderFormatter()
			});
		}

		for (var i = 0; i < aTableColumns.length; i++) {
			var oColumn = aTableColumns[i];

			if (jQuery.inArray(oColumn.getId(), this._aGroupedColumns) > -1) {
				continue;
			}
			if (!oColumn instanceof AnalyticalColumn) {
				jQuery.sap.log.error("You have to use AnalyticalColumns for the Analytical table");
			}

			aColumns.push({
				name: oColumn.getLeadingProperty(),
				visible: oColumn.getVisible(),
				grouped: oColumn.getGrouped(),
				total: oColumn.getSummed(),
				sorted: oColumn.getSorted(),
				sortOrder: oColumn.getSortOrder(),
				inResult: oColumn.getInResult(),
				formatter: oColumn.getGroupHeaderFormatter()
			});
		}

		return aColumns;
	};

	AnalyticalTable.prototype._updateTableContent = function() {
		Table.prototype._updateTableContent.apply(this, arguments);

		var oBinding = this.getBinding("rows"),
			iFirstRow = this.getFirstVisibleRow(),
			iFixedBottomRowCount = this.getFixedBottomRowCount(),
			iCount = this.getVisibleRowCount(),
			aCols = this.getColumns();

		var fnRemoveClasses = function (oRow) {
			var $row = oRow.getDomRefs(true);

			$row.row.removeAttr("data-sap-ui-level");
			$row.row.removeData("sap-ui-level");
			$row.row.removeAttr('aria-level');
			$row.row.removeAttr('aria-expanded');
			$row.row.removeClass("sapUiTableGroupHeader sapUiAnalyticalTableSum sapUiAnalyticalTableDummy");
			$row.rowSelector.html("");
		};

		var aRows = this.getRows();
		//check if the table has rows (data to display)
		if (!oBinding) {
			// restore initial table state, remove group headers and total row formatting
			for (var i = 0; i < aRows.length; i++) {
				fnRemoveClasses(aRows[i]);
			}
			return;
		}

		for (var iRow = 0, l = Math.min(iCount, aRows.length); iRow < l; iRow++) {
			var bIsFixedRow = iRow > (iCount - iFixedBottomRowCount - 1) && oBinding.getLength() > iCount,
				iRowIndex = bIsFixedRow ? (oBinding.getLength() - 1 - (iCount - 1 - iRow)) : iFirstRow + iRow,
				oRow = aRows[iRow],
				$row = oRow.$(),
				$fixedRow = oRow.$("fixed"),
				$rowHdr = this.$().find("div[data-sap-ui-rowindex=" + $row.attr("data-sap-ui-rowindex") + "]");

			var oContextInfo;
			if (bIsFixedRow && oBinding.bProvideGrandTotals) {
				oContextInfo = oBinding.getGrandTotalContextInfo();
			} else {
				oContextInfo = this.getContextInfoByIndex(iRowIndex);
			}
			
			var iLevel = oContextInfo ? oContextInfo.level : 0;

			if (!oContextInfo || !oContextInfo.context) {
				fnRemoveClasses(oRow);
				if (oContextInfo && !oContextInfo.context) {
					$row.addClass("sapUiAnalyticalTableDummy");
					$rowHdr.addClass("sapUiAnalyticalTableDummy");
					$rowHdr.html('<div class="sapUiAnalyticalTableLoading">' + this._oResBundle.getText("TBL_CELL_LOADING") + '</div>');
				}
				continue;
			}

			var aAriaLabelledByParts = [this.getId() + "-rownumberofrows"];
			var sAriaTextForSum = "";

			if (oBinding.nodeHasChildren && oBinding.nodeHasChildren(oContextInfo)) {
				// modify the rows
				$row.addClass("sapUiTableGroupHeader");
				$fixedRow.addClass("sapUiTableGroupHeader");

				$rowHdr.attr("aria-haspopup", true);
				
				var sGroupHeaderText = oBinding.getGroupName(oContextInfo.context, oContextInfo.level);

				var sClass = oContextInfo.nodeState.expanded ? "sapUiTableGroupIconOpen" : "sapUiTableGroupIconClosed";

				if (oContextInfo.nodeState.expanded && !this.getSumOnTop()) {
					$row.addClass("sapUiTableRowHidden");
					$fixedRow.addClass("sapUiTableRowHidden");
					$rowHdr.addClass("sapUiTableRowHidden");
				}
				
				var sGroupHeaderMenuButton = "";
				if ('ontouchstart' in document) {
					sGroupHeaderMenuButton = "<div class='sapUiTableGroupMenuButton'></div>";
				}
				$rowHdr.html("<div id=\"" + oRow.getId() + "-groupHeader\" class=\"sapUiTableGroupIcon " + sClass + "\" tabindex=\"-1\" title=\"" + sGroupHeaderText + "\">" + sGroupHeaderText + "</div>" + sGroupHeaderMenuButton);
				aAriaLabelledByParts.push(oRow.getId() + "-groupHeader");
				
				$row.removeClass("sapUiAnalyticalTableSum sapUiAnalyticalTableDummy");
				$fixedRow.removeClass("sapUiAnalyticalTableSum sapUiAnalyticalTableDummy");
				$rowHdr.removeClass("sapUiAnalyticalTableSum sapUiAnalyticalTableDummy");
				$rowHdr.addClass("sapUiTableGroupHeader").removeAttr("title").removeAttr("aria-label");

				$row.attr('aria-expanded', oContextInfo.nodeState.expanded);
				$fixedRow.attr('aria-expanded', oContextInfo.nodeState.expanded);
				$rowHdr.attr('aria-expanded', oContextInfo.nodeState.expanded);

				if (oContextInfo.level > 0) {
					sAriaTextForSum = oBinding.getGroupName(oContextInfo.context, oContextInfo.level);
				} else {
					sAriaTextForSum = this._oResBundle.getText("TBL_GRAND_TOTAL_ROW");
				}
			} else {
				$row.removeAttr('aria-expanded');
				$rowHdr.removeAttr('aria-expanded');
				$fixedRow.removeAttr('aria-expanded');
				$rowHdr.attr("aria-haspopup", false);

				$rowHdr.removeAttr('aria-describedby');

				$row.removeClass("sapUiTableGroupHeader sapUiTableRowHidden sapUiAnalyticalTableSum sapUiAnalyticalTableDummy");

				$fixedRow.removeClass("sapUiTableGroupHeader sapUiTableRowHidden sapUiAnalyticalTableSum");

				$rowHdr.html("");
				$rowHdr.removeClass("sapUiTableGroupHeader sapUiAnalyticalTableDummy sapUiAnalyticalTableSum");

				// update aria description for row selection
				if (!oContextInfo.nodeState.sum) {
					aAriaLabelledByParts.push(this.getId() + "-rows-row" + $rowHdr.attr("data-sap-ui-rowindex") + "-rowselecttext");
				}

				if (oContextInfo.nodeState.sum && oContextInfo.context && oContextInfo.context.getObject()) {
					$row.addClass("sapUiAnalyticalTableSum");
					$fixedRow.addClass("sapUiAnalyticalTableSum");
					$rowHdr.addClass("sapUiAnalyticalTableSum");

					sAriaTextForSum;
					if (oContextInfo.level > 0) {
						sAriaTextForSum = this._oResBundle.getText("TBL_GROUP_TOTAL_ROW") + " " + oBinding.getGroupName(oContextInfo.context, oContextInfo.level);
					} else {
						sAriaTextForSum = this._oResBundle.getText("TBL_GRAND_TOTAL_ROW");
					}
				}
			}

			//set the level of the node on the DOM
			$row.attr("data-sap-ui-level", iLevel);
			$fixedRow.attr("data-sap-ui-level", iLevel);
			$rowHdr.attr("data-sap-ui-level", iLevel);
			$rowHdr.attr('aria-level', iLevel + 1);
			$row.attr('aria-level', iLevel + 1);
			$fixedRow.attr('aria-level', iLevel + 1);
			
			//set the level of the node as a data-* attribute
			$row.data("sap-ui-level", iLevel);
			$fixedRow.data("sap-ui-level", iLevel);
			$rowHdr.data("sap-ui-level", iLevel);
			
			if ('ontouchstart' in document) {
				var iScrollBarOffset = 0;
				if (this.$().hasClass("sapUiTableVScr")) {
					iScrollBarOffset += this.$().find('.sapUiTableVSb').width();
				}
				var $GroupHeaderMenuButton = $rowHdr.find(".sapUiTableGroupMenuButton");
				
				if (this._bRtlMode) {
					$GroupHeaderMenuButton.css("right", (this.$().width() - $GroupHeaderMenuButton.width() + $rowHdr.position().left - iScrollBarOffset) + "px");
				} else {
					$GroupHeaderMenuButton.css("left", (this.$().width() - $GroupHeaderMenuButton.width() - $rowHdr.position().left - iScrollBarOffset) + "px");
				}
			}

			// show or hide the totals if not enabled - needs to be done by Table
			// control since the model could be reused and thus the values cannot
			// be cleared in the model - and the binding has no control over the
			// value mapping - this happens directly via the context!
			var aCells = oRow.getCells();
			var aMeasures = [];
			for (var i = 0, lc = aCells.length; i < lc; i++) {
				var iCol = aCells[i].data("sap-ui-colindex");
				var oCol = aCols[iCol];
				var $td = jQuery(aCells[i].$().closest("td"));
				if (oBinding.isMeasure(oCol.getLeadingProperty())) {
					$td.addClass("sapUiTableMeasureCell");
					if (!oContextInfo.nodeState.sum || oCol.getSummed()) {
						$td.removeClass("sapUiTableCellHidden");
						aMeasures.push(oCol.getId());
						aMeasures.push($td[0].id);
					} else {
						$td.addClass("sapUiTableCellHidden");
					}

					var sAriaTextForSumId = $td[0].id + "-ariaTextForSum";
					var $AriaTextForSum = jQuery.sap.byId(sAriaTextForSumId);
					if ($AriaTextForSum.length === 0) {
						$td.append("<span id=\"" + sAriaTextForSumId + "\" class=\"sapUiHidden\"></span>");
						$AriaTextForSum = jQuery.sap.byId(sAriaTextForSumId);
					}

					if (oContextInfo.nodeState.sum || $row.hasClass("sapUiTableGroupHeader")) {
						$AriaTextForSum.text(sAriaTextForSum);
						$td.attr("aria-labelledby", sAriaTextForSumId + " " + $td.attr("aria-labelledby"));
					} else {
						$AriaTextForSum.text("");
						$td.removeAriaLabelledBy(sAriaTextForSumId);
					}
				} else {
					$td.removeClass("sapUiTableMeasureCell");
				}
			}

			// connect measures with the group header
			for (var k = 0; k < aMeasures.length; k++) {
				aAriaLabelledByParts.push(aMeasures[k]);
			}
			// update aria description for row selection
			$rowHdr.attr("aria-labelledby", aAriaLabelledByParts.join(" "));
			
			var $targetRow = this.getFixedColumnCount() > 0 ? $fixedRow : $row;
			this._resizeGroupHeader($rowHdr, $targetRow, oContextInfo.nodeState.expanded);
		}
	};
	
	/*
	 * Calculates how much width is available for the group header title.
	 * Logic tries to grant as much space as possible. Especially to use every gap between each sum/dimension label.
	 * This is important for users for making sure that they can read the group title even when they scrolled horizontally.
	 * @param {jQuery} $rowHdr the current row header wrapped by jQuery. 
	 * @param {jQuery} $row jQuery collection of the current processed row. 
	 * @param {Boolean} bIsExpanded
	 *         flag whether the current node is expanded or not. 
	 */
	AnalyticalTable.prototype._resizeGroupHeader = function($rowHdr, $row, bIsExpanded) {
		// Group Icon Layouting logic
		var $groupIcon = $rowHdr.find(".sapUiTableGroupIcon");
		if ($groupIcon.length === 0 || bIsExpanded) {
			return;
		}
		
		var $MeasureAndSumLabels =  $row.find(".sapUiTableCell > *");
		var oTableClientRect = this.getDomRef().getBoundingClientRect();
		$groupIcon.width('');
		var iGroupPosition = this._bRtlMode ? $groupIcon[0].getBoundingClientRect().left : $groupIcon[0].getBoundingClientRect().right;
		var iGroupIconWidth = $groupIcon.width();
		
		var bIsRtlMode = this._bRtlMode;
		
		$MeasureAndSumLabels.each(function(index) {
			var $this = jQuery(this);
			if ($this.text().length === 0) {
				return true;
			}
			var oClientRect = $this[0].getBoundingClientRect();
			$this.width('auto');
			var iLabelWidth = $this.width();
			$this.width('');
			
			var iOverlap = 0;
			var bDoResize = false;
			var sTextAlign = $this.css('text-align');
			if (!bIsRtlMode) {
				if (sTextAlign === "left") {
					iOverlap = iGroupPosition - oClientRect.left;
					bDoResize = (iOverlap > 0 && oClientRect.left + iLabelWidth > oTableClientRect.left);
				} else if (sTextAlign === "right") {
					iOverlap = iGroupPosition - oClientRect.right + iLabelWidth;
					bDoResize = (iOverlap > 0 && oClientRect.right > oTableClientRect.left);
				}
			} else {
				if (sTextAlign === "left") {
					iOverlap = oClientRect.left + iLabelWidth - iGroupPosition;
					bDoResize = (iOverlap > 0 && oClientRect.left < oTableClientRect.right);
				} else if (sTextAlign === "right") {
					iOverlap = oClientRect.right - iGroupPosition;
					bDoResize = (iOverlap > 0 && oClientRect.right < oTableClientRect.right);
				}
			}
			
			if (bDoResize) {
				$groupIcon.width(iGroupIconWidth - iOverlap);
				// break loop
				return false;
			}
		});
	};

	AnalyticalTable.prototype.onclick = function(oEvent) {
		var $EventTarget = jQuery(oEvent.target);
		if ($EventTarget.hasClass("sapUiTableGroupIcon")) {
			this._onNodeSelect(oEvent);
		} else if ($EventTarget.hasClass("sapUiAnalyticalTableSum")) {
			// Sums cannot be selected
			oEvent.preventDefault();
			return;
		} else if ($EventTarget.hasClass("sapUiTableGroupMenuButton")) {
			this._onContextMenu(oEvent);
			oEvent.preventDefault();
			return;
		} else {
			if (Table.prototype.onclick) {
				Table.prototype.onclick.apply(this, arguments);
			}
		}
	};

	AnalyticalTable.prototype.onsapselect = function(oEvent) {
		if (jQuery(oEvent.target).hasClass("sapUiTableGroupIcon")) {
			this._onNodeSelect(oEvent);
		} else if (jQuery(oEvent.target).hasClass("sapUiAnalyticalTableSum")) {
			//Summs connot be selected
			oEvent.preventDefault();
			return;
		} else {
			var $Target = jQuery(oEvent.target),
				$TargetDIV = $Target.closest('div.sapUiTableRowHdr');
			if ($TargetDIV.hasClass('sapUiTableGroupHeader') && $TargetDIV.hasClass('sapUiTableRowHdr')) {
				var iRowIndex = this.getFirstVisibleRow() + parseInt($TargetDIV.attr("data-sap-ui-rowindex"), 10);
				var oBinding = this.getBinding("rows");
				oBinding.toggleIndex(iRowIndex);
				return;
			}
			if (Table.prototype.onsapselect) {
				Table.prototype.onsapselect.apply(this, arguments);
			}
		}
	};

	AnalyticalTable.prototype._onNodeSelect = function(oEvent) {

		var $parent = jQuery(oEvent.target).parent();
		if ($parent.length > 0) {
			var iRowIndex = this.getFirstVisibleRow() + parseInt($parent.attr("data-sap-ui-rowindex"), 10);
			var oBinding = this.getBinding("rows");
			oBinding.toggleIndex(iRowIndex);
		}

		oEvent.preventDefault();
		oEvent.stopPropagation();

	};

	AnalyticalTable.prototype._onContextMenu = function(oEvent) {
		if (jQuery(oEvent.target).closest('tr').hasClass('sapUiTableGroupHeader') ||
				jQuery(oEvent.target).closest('.sapUiTableRowHdr.sapUiTableGroupHeader').length > 0) {
			this._iGroupedLevel = jQuery(oEvent.target).closest('[data-sap-ui-level]').data('sap-ui-level');
			var oMenu = this._getGroupHeaderMenu();
			var eDock = sap.ui.core.Popup.Dock;
			
			var iLocationX = oEvent.pageX || oEvent.clientX;
			var iLocationY = oEvent.pageY || oEvent.clientY;
			oMenu.open(false, oEvent.target, eDock.LeftTop, eDock.LeftTop, document, (iLocationX - 2) + " " + (iLocationY - 2));

			oEvent.preventDefault();
			oEvent.stopPropagation();
			return;
		}

		return true;
	};

	AnalyticalTable.prototype._getGroupHeaderMenu = function() {

		var that = this;
		function getGroupColumnInfo() {
			var iIndex = that._iGroupedLevel - 1;
			if (that._aGroupedColumns[iIndex]) {
				var oGroupedColumn = that.getColumns().filter(function(oColumn){
					if (that._aGroupedColumns[iIndex] == oColumn.getId()) {
						return true;
					}
				})[0];

				return {
					column: oGroupedColumn,
					index: iIndex
				};
			}else {
				return undefined;
			}
		}

		if (!this._oGroupHeaderMenu) {
			this._oGroupHeaderMenu = new sap.ui.unified.Menu();
			this._oGroupHeaderMenuVisibilityItem = new sap.ui.unified.MenuItem({
				text: this._oResBundle.getText("TBL_SHOW_COLUMN"),
				select: function() {
					var oGroupColumnInfo = getGroupColumnInfo();

					if (oGroupColumnInfo) {
						var oColumn = oGroupColumnInfo.column,
							bShowIfGrouped = oColumn.getShowIfGrouped();
						oColumn.setShowIfGrouped(!bShowIfGrouped);

						that.fireGroup({column: oColumn, groupedColumns: oColumn.getParent()._aGroupedColumns, type:( !bShowIfGrouped ? sap.ui.table.GroupEventType.showGroupedColumn : sap.ui.table.GroupEventType.hideGroupedColumn )});
					}
				}
			});
			this._oGroupHeaderMenu.addItem(this._oGroupHeaderMenuVisibilityItem);
			this._oGroupHeaderMenu.addItem(new sap.ui.unified.MenuItem({
				text: this._oResBundle.getText("TBL_UNGROUP"),
				select: function() {
					var aColumns = that.getColumns(),
						iFoundGroups = 0,
						iLastGroupedIndex = -1,
						iUngroudpedIndex = -1,
						oColumn;
					for (var i = 0; i < aColumns.length; i++) {
						oColumn = aColumns[i];
						if (oColumn.getGrouped()) {
							iFoundGroups++;
							if (iFoundGroups == that._iGroupedLevel) {
								oColumn._bSkipUpdateAI = true;

								// relaying the ungrouping to the AnalyticalBinding,
								// the numberOfExpandedLevels must be reset through the AnalyticalTreeBindingAdapter.
								var oBinding = that.getBinding("rows");
								oBinding.setNumberOfExpandedLevels(0);
								// setGrouped(false) leads to an invalidation of the Column -> rerender
								// and this will result in new requests from the AnalyticalBinding,
								//because the initial grouping is lost (can not be restored!)
								oColumn.setGrouped(false);

								oColumn._bSkipUpdateAI = false;
								iUngroudpedIndex = i;
								that.fireGroup({column: oColumn, groupedColumns: oColumn.getParent()._aGroupedColumns, type: sap.ui.table.GroupEventType.ungroup});
							} else {
								iLastGroupedIndex = i;
							}
						}
					}
					if (iLastGroupedIndex > -1 && iUngroudpedIndex > -1 && iUngroudpedIndex < iLastGroupedIndex) {
						var oUngroupedColumn = aColumns[iUngroudpedIndex];
						var iHeaderSpan = oUngroupedColumn.getHeaderSpan();
						if (jQuery.isArray(iHeaderSpan)) {
							iHeaderSpan = iHeaderSpan[0];
						}
						var aRemovedColumns = [];
						for (var i = iUngroudpedIndex; i < iUngroudpedIndex + iHeaderSpan; i++) {
							aRemovedColumns.push(aColumns[i]);
						}
						jQuery.each(aRemovedColumns, function(iIndex, oColumn) {
							that.removeColumn(oColumn);
							that.insertColumn(oColumn, iLastGroupedIndex);
						});
					}
					that._updateTableColumnDetails();
					that.updateAnalyticalInfo();
				}
			}));
			this._oGroupHeaderMenu.addItem(new sap.ui.unified.MenuItem({
				text: this._oResBundle.getText("TBL_UNGROUP_ALL"),
				select: function() {
					var aColumns = that.getColumns();
					for (var i = 0; i < aColumns.length; i++) {
						aColumns[i]._bSkipUpdateAI = true;

						// same as with single "ungrouping" (see above)
						var oBinding = that.getBinding("rows");
						oBinding.setNumberOfExpandedLevels(0);

						aColumns[i].setGrouped(false);
						aColumns[i]._bSkipUpdateAI = false;
					}
					that._bSupressRefresh = true;
					that._updateTableColumnDetails();
					that.updateAnalyticalInfo();
					that._bSupressRefresh = false;
					that.fireGroup({column: undefined, groupedColumns: [], type: sap.ui.table.GroupEventType.ungroupAll});
				}
			}));
			this._oGroupHeaderMoveUpItem = new sap.ui.unified.MenuItem({
				text: this._oResBundle.getText("TBL_MOVE_UP"),
				select: function() {
					var oGroupColumnInfo = getGroupColumnInfo();

					if (oGroupColumnInfo) {
						var oColumn = oGroupColumnInfo.column;
						var iIndex = jQuery.inArray(oColumn.getId(), that._aGroupedColumns);
						if (iIndex > 0) {
							that._aGroupedColumns[iIndex] = that._aGroupedColumns.splice(iIndex - 1, 1, that._aGroupedColumns[iIndex])[0];
							that.updateAnalyticalInfo();
							that.fireGroup({column: oColumn, groupedColumns: oColumn.getParent()._aGroupedColumns, type: sap.ui.table.GroupEventType.moveUp});
						}
					}
				},
				icon: "sap-icon://arrow-top"
			});
			this._oGroupHeaderMenu.addItem(this._oGroupHeaderMoveUpItem);
			this._oGroupHeaderMoveDownItem = new sap.ui.unified.MenuItem({
				text: this._oResBundle.getText("TBL_MOVE_DOWN"),
				select: function() {
					var oGroupColumnInfo = getGroupColumnInfo();

					if (oGroupColumnInfo) {
						var oColumn = oGroupColumnInfo.column;
						var iIndex = jQuery.inArray(oColumn.getId(), that._aGroupedColumns);
						if (iIndex < that._aGroupedColumns.length) {
							that._aGroupedColumns[iIndex] = that._aGroupedColumns.splice(iIndex + 1, 1, that._aGroupedColumns[iIndex])[0];
							that.updateAnalyticalInfo();
							that.fireGroup({column: oColumn, groupedColumns: oColumn.getParent()._aGroupedColumns, type: sap.ui.table.GroupEventType.moveDown});
						}
					}
				},
				icon: "sap-icon://arrow-bottom"
			});
			this._oGroupHeaderMenu.addItem(this._oGroupHeaderMoveDownItem);
			this._oGroupHeaderMenu.addItem(new sap.ui.unified.MenuItem({
				text: this._oResBundle.getText("TBL_SORT_ASC"),
				select: function() {
					var oGroupColumnInfo = getGroupColumnInfo();

					if (oGroupColumnInfo) {
						var oColumn = oGroupColumnInfo.column;

						oColumn.sort(false); //update Analytical Info triggered by aftersort in column
					}
				},
				icon: "sap-icon://up"
			}));
			this._oGroupHeaderMenu.addItem(new sap.ui.unified.MenuItem({
				text: this._oResBundle.getText("TBL_SORT_DESC"),
				select: function() {
					var oGroupColumnInfo = getGroupColumnInfo();

					if (oGroupColumnInfo) {
						var oColumn = oGroupColumnInfo.column;

						oColumn.sort(true); //update Analytical Info triggered by aftersort in column
					}
				},
				icon: "sap-icon://down"
			}));
			this._oGroupHeaderMenu.addItem(new sap.ui.unified.MenuItem({
				text: this._oResBundle.getText("TBL_COLLAPSE_LEVEL"),
				select: function() {
					// Why -1? Because the "Collapse Level" Menu Entry should collapse TO the given level - 1
					// So collapsing level 1 means actually all nodes up TO level 0 will be collapsed.
					// Potential negative values are handled by the binding. 
					that.getBinding("rows").collapseToLevel(that._iGroupedLevel - 1);
					that.setFirstVisibleRow(0); //scroll to top after collapsing (so no rows vanish)
					that.clearSelection();
				}
			}));
			this._oGroupHeaderMenu.addItem(new sap.ui.unified.MenuItem({
				text: this._oResBundle.getText("TBL_COLLAPSE_ALL"),
				select: function() {
					that.getBinding("rows").collapseToLevel(0);
					that.setFirstVisibleRow(0); //scroll to top after collapsing (so no rows vanish)
					that.clearSelection();
				}
			}));
		}

		var oGroupColumnInfo = getGroupColumnInfo();
		if (oGroupColumnInfo) {
			var oColumn = oGroupColumnInfo.column;
			if (oColumn.getShowIfGrouped()) {
				this._oGroupHeaderMenuVisibilityItem.setText(this._oResBundle.getText("TBL_HIDE_COLUMN"));
			} else {
				this._oGroupHeaderMenuVisibilityItem.setText(this._oResBundle.getText("TBL_SHOW_COLUMN"));
			}
			this._oGroupHeaderMoveUpItem.setEnabled(oGroupColumnInfo.index > 0);
			this._oGroupHeaderMoveDownItem.setEnabled(oGroupColumnInfo.index < this._aGroupedColumns.length - 1);
		} else {
			this._oGroupHeaderMoveUpItem.setEnabled(true);
			this._oGroupHeaderMoveDownItem.setEnabled(true);
		}

		return this._oGroupHeaderMenu;

	};

	AnalyticalTable.prototype.expand = function(iRowIndex) {
		var oBinding = this.getBinding("rows");
		if (oBinding) {
			oBinding.expand(iRowIndex);
		}
	};

	AnalyticalTable.prototype.collapse = function(iRowIndex) {
		var oBinding = this.getBinding("rows");
		if (oBinding) {
			oBinding.collapse(iRowIndex);
		}
	};
	
	/**
	 * Collapses all nodes (and lower if collapseRecursive is activated)
	 * 
	 * @return {sap.ui.table.TreeTable} a reference on the TreeTable control, can be used for chaining
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	AnalyticalTable.prototype.collapseAll = function () {
		var oBinding = this.getBinding("rows");
		if (oBinding) {
			oBinding.collapseToLevel(0);
			this.setFirstVisibleRow(0);
		}
		
		return this;
	};

	AnalyticalTable.prototype.isExpanded = function(iRowIndex) {
		var oBinding = this.getBinding("rows");
		if (oBinding) {
			return oBinding.isExpanded(iRowIndex);
		}
		return false;
	};

	/**
	 * Returns the context of a row by its index.
	 *
	 * @param {int} iIndex
	 *         Index of the row to return the context from.
	 * @type object
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	AnalyticalTable.prototype.getContextByIndex = function(iIndex) {
		var oBinding = this.getBinding("rows");
		return iIndex >= 0 && oBinding ? oBinding.getContextByIndex(iIndex) : null;
	};
	
	AnalyticalTable.prototype.getContextInfoByIndex = function(iIndex) {
		var oBinding = this.getBinding("rows");
		return iIndex >= 0 && oBinding ? oBinding.getNodeByIndex(iIndex) : null;
	};

	AnalyticalTable.prototype._onColumnMoved = function(oEvent) {
		Table.prototype._onColumnMoved.apply(this, arguments);
		this.updateAnalyticalInfo();
	};

	AnalyticalTable.prototype.addColumn = function(vColumn, bSuppressInvalidate) {
		//@TODO: Implement addColumn(Column[] || oColumn)
		var oColumn = this._getColumn(vColumn);
		if (oColumn.getGrouped()) {
			this._addGroupedColumn(oColumn.getId());
		}
		Table.prototype.addColumn.call(this, oColumn, bSuppressInvalidate);
		this._updateTableColumnDetails();
		this.updateAnalyticalInfo(bSuppressInvalidate);
		return this;
	};

	AnalyticalTable.prototype.insertColumn = function(vColumn, iIndex, bSuppressInvalidate) {
		var oColumn = this._getColumn(vColumn);
		if (oColumn.getGrouped()) {
			this._addGroupedColumn(oColumn.getId());
		}
		Table.prototype.insertColumn.call(this, oColumn, iIndex, bSuppressInvalidate);
		this._updateTableColumnDetails();
		this.updateAnalyticalInfo(bSuppressInvalidate);
		return this;
	};

	AnalyticalTable.prototype.removeColumn = function(vColumn, bSuppressInvalidate) {
		var oResult = Table.prototype.removeColumn.apply(this, arguments);
		
		// only remove from grouped columns if not caused by column move. If this._iNewColPos
		// is set, the column was moved by user.-
		if (!this._iNewColPos) {
			this._aGroupedColumns = jQuery.grep(this._aGroupedColumns, function(sValue) {
				//check if vColum is an object with getId function
				if (vColumn.getId) {
					return sValue != vColumn.getId();
				} else {
					return sValue == vColumn;
				}
			});
		}
		
		this.updateAnalyticalInfo(bSuppressInvalidate);

		return oResult;
	};

	AnalyticalTable.prototype.removeAllColumns = function(bSuppressInvalidate) {
		this._aGroupedColumns = [];
		var aResult = Table.prototype.removeAllColumns.apply(this, arguments);
		
		this._updateTableColumnDetails();
		this.updateAnalyticalInfo(bSuppressInvalidate);

		return aResult;
	};

	AnalyticalTable.prototype._getColumn = function(vColumn) {
		if (typeof vColumn === "string") {
			var oColumn =  new AnalyticalColumn({
				leadingProperty: vColumn,
				template: vColumn,
				managed: true
			});
			return oColumn;
		} else if (vColumn instanceof AnalyticalColumn) {
			return vColumn;
		} else {
			throw new Error("Wrong column type. You need to define a string (property) or pass an AnalyticalColumnObject");
		}
	};

	AnalyticalTable.prototype._updateColumns = function() {
		this._updateTableColumnDetails();
		this.updateAnalyticalInfo();
	};

	AnalyticalTable.prototype.updateAnalyticalInfo = function(bSupressRefresh) {
		var oBinding = this.getBinding("rows");
		if (oBinding) {
			var aColumnInfo = this._getColumnInformation();
			oBinding.updateAnalyticalInfo(aColumnInfo);
			this._updateTotalRow(aColumnInfo, bSupressRefresh);
			if (bSupressRefresh || this._bSupressRefresh) {
				return;
			}
			this.refreshRows();
		}
	};

	AnalyticalTable.prototype._updateTotalRow = function(aColumnInfo, bSuppressInvalidate) {
		var oBinding = this.getBinding("rows");

		var iFixedBottomRowCount = this.getFixedBottomRowCount();
		if (oBinding && (oBinding.providesGrandTotal() && oBinding.hasTotaledMeasures())) {
			if (iFixedBottomRowCount !== 1) {
				this.setProperty("fixedBottomRowCount", 1, bSuppressInvalidate);
			}
		} else {
			if (iFixedBottomRowCount !== 0) {
				this.setProperty("fixedBottomRowCount", 0, bSuppressInvalidate);
			}
		}

	};

	AnalyticalTable.prototype._updateTableColumnDetails = function() {
		var oBinding = this.getBinding("rows"),
			oResult = oBinding && oBinding.getAnalyticalQueryResult();

		if (oResult) {
			var aColumns = this.getColumns(),
				aGroupedDimensions = [],
				aUngroupedDimensions = [],
				aDimensions = [],
				oDimensionIndex = {},
				oColumn,
				oDimension;

			// calculate an index of all dimensions and their columns. Grouping is done per dimension.
			for (var i = 0; i < aColumns.length; i++) {
				oColumn = aColumns[i];
				oColumn._isLastGroupableLeft = false;
				oColumn._bLastGroupAndGrouped = false;
				oColumn._bDependendGrouped = false;

				// ignore invisible columns
				if (!oColumn.getVisible()) {
					continue;
				}

				var sLeadingProperty = oColumn.getLeadingProperty();
				oDimension = oResult.findDimensionByPropertyName(sLeadingProperty);

				if (oDimension) {
					var sDimensionName = oDimension.getName();
					if (!oDimensionIndex[sDimensionName]) {
						oDimensionIndex[sDimensionName] = {dimension: oDimension, columns: [oColumn]};
					} else {
						oDimensionIndex[sDimensionName].columns.push(oColumn);
					}

					// if one column of a dimension is grouped, the dimension is considered as grouped.
					// all columns which are not explicitly grouped will be flagged as dependendGrouped in the next step
					if (oColumn.getGrouped() && jQuery.inArray(sDimensionName, aGroupedDimensions) == -1) {
						aGroupedDimensions.push(sDimensionName);
					}

					if (jQuery.inArray(sDimensionName, aDimensions) == -1) {
						aDimensions.push(sDimensionName);
					}
				}
			}

			aUngroupedDimensions = jQuery.grep(aDimensions, function (s) {
				return (jQuery.inArray(s, aGroupedDimensions) == -1);
			});

			// for all grouped dimensions
			if (aGroupedDimensions.length > 0) {
				// calculate and flag the dependendly grouped columns of the dimension
				jQuery.each(aGroupedDimensions, function(i, s) {
					jQuery.each(oDimensionIndex[s].columns, function(j, o) {
						if (!o.getGrouped()) {
							o._bDependendGrouped = true;
						}
					});
				});

				// if there is only one dimension left, their columns must remain visible even though they are grouped.
				// this behavior is controlled by the flag _bLastGroupAndGrouped
				if (aGroupedDimensions.length == aDimensions.length) {
					oDimension = oResult.findDimensionByPropertyName(sap.ui.getCore().byId(this._aGroupedColumns[this._aGroupedColumns.length - 1]).getLeadingProperty());
					var aGroupedDimensionColumns = oDimensionIndex[oDimension.getName()].columns;
					jQuery.each(aGroupedDimensionColumns, function(i, o) {
						o._bLastGroupAndGrouped = true;
					});
				}
			}

			if (aUngroupedDimensions.length == 1) {
				jQuery.each(oDimensionIndex[aUngroupedDimensions[0]].columns, function(j, o) {
					o._isLastGroupableLeft = true;
				});
			}
		}
	};

	AnalyticalTable.prototype._getFirstMeasureColumnIndex = function() {
		var oBinding = this.getBinding("rows"),
			oResultSet = oBinding && oBinding.getAnalyticalQueryResult(),
			aColumns = this._getVisibleColumns();

		if (!oResultSet) {
			return -1;
		}

		for (var i = 0; i < aColumns.length; i++) {
			var oColumn = aColumns[i],
				sLeadingProperty = oColumn.getLeadingProperty();

			if (oResultSet.findMeasureByName(sLeadingProperty) || oResultSet.findMeasureByPropertyName(sLeadingProperty)) {
				return i;
			}
		}
	};

	/**
	 * Returns the total size of the data entries.
	 *
	 * @type int
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	AnalyticalTable.prototype.getTotalSize = function() {
		var oBinding = this.getBinding("rows");
		if (oBinding) {
			return oBinding.getTotalSize();
		}
		return 0;
	};

	AnalyticalTable.prototype._hasData = function() {
		var oBinding = this.getBinding("rows"),
			iLength = oBinding && (oBinding.getLength() || 0),
			bHasTotal = oBinding && oBinding.providesGrandTotal() && oBinding.hasTotaledMeasures();

		if (!oBinding || (bHasTotal && iLength < 2) || (!bHasTotal && iLength === 0)) {
			return false;
		}
		return true;
	};

	AnalyticalTable.prototype._onPersoApplied = function() {
		Table.prototype._onPersoApplied.apply(this, arguments);
		this._aGroupedColumns = [];
		var aColumns = this.getColumns();
		for (var i = 0, l = aColumns.length; i < l; i++) {
			if (aColumns[i].getGrouped()) {
				this._addGroupedColumn(aColumns[i].getId());
			}
		}
		this._updateTableColumnDetails();
		this.updateAnalyticalInfo();
	};

	AnalyticalTable.prototype._addGroupedColumn = function(sColumn) {
		if (jQuery.inArray(sColumn, this._aGroupedColumns) < 0) {
			this._aGroupedColumns.push(sColumn);
		}
	};

	AnalyticalTable.prototype.getGroupedColumns = function () {
		return this._aGroupedColumns;
	};

	/**
	 * Sets the node hierarchy to collapse recursive. When set to true, all child nodes will get collapsed as well.
	 * This setting has only effect when the binding is already initialized.
	 * @param {boolean} bCollapseRecursive
	 */
	AnalyticalTable.prototype.setCollapseRecursive = function(bCollapseRecursive) {
		var oBinding = this.getBinding("rows");
		if (oBinding) {
			jQuery.sap.assert(oBinding.setCollapseRecursive, "Collapse Recursive is not supported by the used binding");
			if (oBinding.setCollapseRecursive) {
				oBinding.setCollapseRecursive(bCollapseRecursive);
			}
		}
		this.setProperty("collapseRecursive", !!bCollapseRecursive, true);
		return this;
	};
	
	/***************************************************
	 *              Selection of Table Rows            *
	 ***************************************************/
	
	/**
	 * returns the count of rows which can ca selected when bound or 0
	 * @private
	 */
	AnalyticalTable.prototype._getSelectableRowCount = function() {
		var oBinding = this.getBinding("rows");
		if (oBinding) {
			var oRootNode = oBinding.getGrandTotalContextInfo(); 
			return oRootNode ? oRootNode.numberOfLeafs : 0;
		}
	};
	
	/**
	 * Checks if the row at the given index is selected.
	 * 
	 * @param {int} iRowIndex The row index for which the selection state should be retrieved
	 * @return {boolean} true if the index is selected, false otherwise
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	AnalyticalTable.prototype.isIndexSelected = function (iRowIndex) {
		return TreeTable.prototype.isIndexSelected.call(this, iRowIndex);
	};
	
	/**
	 * Overriden from Table.js base class.
	 * In a TreeTable you can only select indices, which correspond to the currently visualized tree.
	 * Invisible tree nodes (e.g. collapsed child nodes) can not be selected via Index, because they do not
	 * correspond to a TreeTable row.
	 * 
	 * @param {int} iRowIndex The row index which will be selected (if existing)
	 * @return {sap.ui.table.TreeTable} a reference on the TreeTable control, can be used for chaining
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	AnalyticalTable.prototype.setSelectedIndex = function (iRowIndex) {
		return TreeTable.prototype.setSelectedIndex.call(this, iRowIndex);
	};
	
	/**
	 * Returns an array containing the row indices of all selected tree nodes (ordered ascending).
	 * 
	 * Please be aware of the following:
	 * Due to performance/network traffic reasons, the getSelectedIndices function returns only all indices
	 * of actually selected rows/tree nodes. Unknown rows/nodes (as in "not yet loaded" to the client), will not be
	 * returned.
	 * 
	 * @return {int[]} an array containing all selected indices
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	AnalyticalTable.prototype.getSelectedIndices = function () {
		return TreeTable.prototype.getSelectedIndices.call(this);
	};
	
	/**
	 * Sets the selection of the TreeTable to the given range (including boundaries).
	 * Beware: The previous selection will be lost/overriden. If this is not wanted, please use "addSelectionInterval" and
	 * "removeSelectionIntervall".
	 * 
	 * @param {int} iFromIndex the start index of the selection range
	 * @param {int} iToIndex the end index of the selection range
	 * @return {sap.ui.table.TreeTable} a reference on the TreeTable control, can be used for chaining
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	AnalyticalTable.prototype.setSelectionInterval = function (iFromIndex, iToIndex) {
		return TreeTable.prototype.setSelectionInterval.call(this, iFromIndex, iToIndex);
	};
	
	/**
	 * Marks a range of tree nodes as selected, starting with iFromIndex going to iToIndex.
	 * The TreeNodes are referenced via their absolute row index.
	 * Please be aware, that the absolute row index only applies to the the tree which is visualized by the TreeTable.
	 * Invisible nodes (collapsed child nodes) will not be regarded.
	 * 
	 * Please also take notice of the fact, that "addSelectionInterval" does not change any other selection.
	 * To override the current selection, please use "setSelctionInterval" or for a single entry use "setSelectedIndex".
	 * 
	 * @param {int} iFromIndex The starting index of the range which will be selected.
	 * @param {int} iToIndex The starting index of the range which will be selected.
	 * @return {sap.ui.table.TreeTable} a reference on the TreeTable control, can be used for chaining
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	AnalyticalTable.prototype.addSelectionInterval = function (iFromIndex, iToIndex) {
		return TreeTable.prototype.addSelectionInterval.call(this, iFromIndex, iToIndex);
	};
	
	/**
	 * All rows/tree nodes inside the range (including boundaries) will be deselected.
	 * Tree nodes are referenced with theit absolute row index inside the tree- 
	 * Please be aware, that the absolute row index only applies to the the tree which is visualized by the TreeTable.
	 * Invisible nodes (collapsed child nodes) will not be regarded.
	 * 
	 * @param {int} iFromIndex The starting index of the range which will be deselected.
	 * @param {int} iToIndex The starting index of the range which will be deselected.
	 * @return {sap.ui.table.TreeTable} a reference on the TreeTable control, can be used for chaining
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	AnalyticalTable.prototype.removeSelectionInterval = function (iFromIndex, iToIndex) {
		return TreeTable.prototype.removeSelectionInterval.call(this, iFromIndex, iToIndex);
	};
	
	/**
	 * Selects all available nodes/rows.
	 * 
	 * Explanation of the SelectAll function and what to expect from its behavior:
	 * All rows/tree nodes locally stored on the client are selected.
	 * In addition all subsequent rows/tree nodes, which will be paged into view are also immediatly selected.
	 * However, due to obvious performance/network traffic reasons, the SelectAll function will NOT retrieve any data from the backend.
	 * 
	 * @return {sap.ui.table.TreeTable} a reference on the TreeTable control, can be used for chaining
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	AnalyticalTable.prototype.selectAll = function () {
		return TreeTable.prototype.selectAll.call(this);
	};
	
	/**
	 * Retrieves the lead selection index. The lead selection index is, among other things, used to determine the
	 * start/end of a selection range, when using Shift-Click to select multiple entries at once. 
	 * 
	 * @return {int[]} an array containing all selected indices (ascending ordered integers)
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	AnalyticalTable.prototype.getSelectedIndex = function() {
		return TreeTable.prototype.getSelectedIndex.call(this);
	};
	
	/**
	 * Clears the complete selection (all tree table rows/nodes will lose their selection)
	 * 
	 * @return {sap.ui.table.TreeTable} a reference on the TreeTable control, can be used for chaining
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	AnalyticalTable.prototype.clearSelection = function () {
		return TreeTable.prototype.clearSelection.call(this);
	};

	AnalyticalTable.prototype._isRowSelectable = function(iRowIndex) {
		var oBinding = this.getBinding("rows");
		if (oBinding) {
			return oBinding.isIndexSelectable(iRowIndex);
		} else {
			// if there is no binding the selection can't be handled, therefore the row is not selectable
			return false;
		}

	};
	
	return AnalyticalTable;

}, /* bExport= */ true);
