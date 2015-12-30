/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.table.TreeTable.
sap.ui.define(['jquery.sap.global', './Table', 'sap/ui/model/odata/ODataTreeBindingAdapter', 'sap/ui/model/ClientTreeBindingAdapter', 'sap/ui/model/TreeBindingCompatibilityAdapter', './library'],
	function(jQuery, Table, ODataTreeBindingAdapter, ClientTreeBindingAdapter, TreeBindingCompatibilityAdapter, library) {
	"use strict";

	/**
	 * Constructor for a new TreeTable.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * The TreeTable Control.
	 * @extends sap.ui.table.Table
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @alias sap.ui.table.TreeTable
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var TreeTable = Table.extend("sap.ui.table.TreeTable", /** @lends sap.ui.table.TreeTable.prototype */ { metadata : {

		library : "sap.ui.table",
		properties : {

			/**
			 * Flag to enable or disable expanding of first level.
			 */
			expandFirstLevel : {type : "boolean", defaultValue : false},

			/**
			 * If group mode is enable nodes with subitems are rendered as if they were group headers.
			 * This can be used to do the grouping for an OData service on the backend and visualize this in a table.
			 * This mode only makes sense if the tree has a depth of exacly 1 (group headers and entries)
			 */
			useGroupMode : {type : "boolean", group : "Appearance", defaultValue : false},

			/**
			 * The property name of the rows data which will be displayed as a group header if the group mode is enabled
			 */
			groupHeaderProperty : {type : "string", group : "Data", defaultValue : null},
			
			/**
			 * Setting collapseRecursive to true means, that when collapsing a node all subsequent child nodes will also be collapsed.
			 * This property is only supported with sap.ui.model.odata.v2.ODataModel
			 */
			collapseRecursive : {type: "boolean", defaultValue: true},
			
			/**
			 * The root level is the level of the topmost tree nodes, which will be used as an entry point for OData services.
			 * This property is only supported when the TreeTable uses an underlying odata services with hierarchy annotations.
			 * This property is only supported with sap.ui.model.odata.v2.ODataModel
			 * The hierarchy annotations may also be provided locally as a parameter for the ODataTreeBinding.
			 */
			rootLevel : {type: "int", group: "Data", defaultValue: 0}
		},
		events : {

			/**
			 * fired when a node has been expanded or collapsed (only available in hierachical mode)
			 */
			toggleOpenState : {
				parameters : {

					/**
					 * index of the expanded/collapsed row
					 */
					rowIndex : {type : "int"},

					/**
					 * binding context of the selected row
					 */
					rowContext : {type : "object"},

					/**
					 * flag whether the node has been expanded or collapsed
					 */
					expanded : {type : "boolean"}
				}
			}
		}
	}});


	/**
	 * Initialization of the TreeTable control
	 * @private
	 */
	TreeTable.prototype.init = function() {
		Table.prototype.init.apply(this, arguments);
		this._iLastFixedColIndex = 0;

		// adopting properties and load icon fonts for bluecrystal
		if (sap.ui.getCore().getConfiguration().getTheme() === "sap_bluecrystal" ||
			sap.ui.getCore().getConfiguration().getTheme() === "sap_hcb") {

			// add the icon fonts
			jQuery.sap.require("sap.ui.core.IconPool");
			sap.ui.core.IconPool.insertFontFaceStyle();

			// defaulting the rowHeight
			// this.setRowHeight(32); --> is done via CSS

		}
	};

	TreeTable.prototype.bindRows = function(oBindingInfo, vTemplate, aSorters, aFilters) {
		var sPath,
			oTemplate,
			aSorters,
			aFilters;
		
		// Old API compatibility (sName, sPath, oTemplate, oSorter, aFilters)
		if (typeof oBindingInfo == "string") {
			sPath = arguments[0];
			oTemplate = arguments[1];
			aSorters = arguments[2];
			aFilters = arguments[3];
			oBindingInfo = {path: sPath, sorter: aSorters, filters: aFilters, template: oTemplate};
		}
		
		if (typeof oBindingInfo === "object") {
			oBindingInfo.parameters = oBindingInfo.parameters || {};
			oBindingInfo.parameters.rootLevel = this.getRootLevel();
			oBindingInfo.parameters.collapseRecursive = this.getCollapseRecursive();
			// number of expanded levels is taken from the binding parameters first,
			// if not found, we check if they are set on the table
			oBindingInfo.parameters.numberOfExpandedLevels = oBindingInfo.parameters.numberOfExpandedLevels || (this.getExpandFirstLevel() ? 1 : 0);
			oBindingInfo.parameters.rootNodeID = oBindingInfo.parameters.rootNodeID;
		}
		
		//return Table.prototype.bindRows.call(this, oBindingInfo, vTemplate, oSorter, aFilters);
		return this.bindAggregation("rows", oBindingInfo);
	};
	
	/**
	 * Sets the selection mode. The current selection is lost.
	 * @param {string} sSelectionMode the selection mode, see sap.ui.table.SelectionMode
	 * @public
	 * @return a reference on the table for chaining
	 */
	TreeTable.prototype.setSelectionMode = function (sSelectionMode) {
		var oBinding = this.getBinding("rows");
		if (oBinding && oBinding.clearSelection) {
			oBinding.clearSelection();
			this.setProperty("selectionMode", sSelectionMode);
		} else {
			Table.prototype.setSelectionMode.call(this, sSelectionMode);
		}
		return this;
	};
	
	/**
	 * refresh rows
	 * @private
	 */
	TreeTable.prototype.refreshRows = function(sReason) {
		this._bBusyIndicatorAllowed = true;
		this._attachBindingListener();
		var oBinding = this.getBinding("rows");
		if (oBinding && this.isTreeBinding("rows") && !oBinding.hasListeners("selectionChanged")) {
			oBinding.attachSelectionChanged(this._onSelectionChanged, this);
		}
		
		//needs to be called here to reset the firstVisible row so that the correct data is fetched
		this._bRefreshing = true;
		this._onBindingChange(sReason);
		this._updateBindingContexts(true);
		//this.getBinding()._init();
		this._bRefreshing = false;
	};
	
	/**
	 * Setter for property <code>fixedRowCount</code>.
	 *
	 * <b>This property is not supportd for the TreeTable and will be ignored!</b>
	 *
	 * Default value is <code>0</code>
	 *
	 * @param {int} iFixedRowCount  new value for property <code>fixedRowCount</code>
	 * @return {sap.ui.table.TreeTable} <code>this</code> to allow method chaining
	 * @public
	 */
	TreeTable.prototype.setFixedRowCount = function(iRowCount) {
		// this property makes no sense for the TreeTable
		jQuery.sap.log.warning("TreeTable: the property \"fixedRowCount\" is not supported and will be ignored!");
		return this;
	};


	/**
	 * Rerendering handling
	 * @private
	 */
	TreeTable.prototype.onAfterRendering = function() {
		Table.prototype.onAfterRendering.apply(this, arguments);
		this.$().find("[role=grid]").attr("role", "treegrid");
	};

	TreeTable.prototype.isTreeBinding = function(sName) {
		sName = sName || "rows";
		if (sName === "rows") {
			return true;
		}
		return sap.ui.core.Element.prototype.isTreeBinding.apply(this, arguments);
	};

	TreeTable.prototype.getBinding = function(sName) {
		sName = sName || "rows";
		var oBinding = sap.ui.core.Element.prototype.getBinding.call(this, sName);
		
		// the check for the tree binding is only relevant becuase of the DataTable migration
		//  --> once the DataTable is deleted after the deprecation period this check can be deleted
		if (oBinding && this.isTreeBinding(sName) && sName === "rows" && !oBinding.getLength) {
			if (sap.ui.model.odata.ODataTreeBinding && oBinding instanceof sap.ui.model.odata.ODataTreeBinding) {
				// use legacy tree binding adapter
				TreeBindingCompatibilityAdapter(oBinding, this);
			} else if (sap.ui.model.odata.v2.ODataTreeBinding && oBinding instanceof sap.ui.model.odata.v2.ODataTreeBinding) {
				ODataTreeBindingAdapter.apply(oBinding);
			} else if (sap.ui.model.ClientTreeBinding && oBinding instanceof sap.ui.model.ClientTreeBinding) {
				ClientTreeBindingAdapter.apply(oBinding);
				//TreeBindingCompatibilityAdapter(oBinding, this);
			} else {
				jQuery.sap.log.error("Binding not supported by sap.ui.table.TreeTable");
			}
		}
		
		return oBinding;
	};

	TreeTable.prototype._updateTableContent = function() {
		Table.prototype._updateTableContent.apply(this, arguments);

		var oBinding = this.getBinding("rows"),
			iFirstRow = this.getFirstVisibleRow(),
			aRows = this.getRows(),
			iCount = aRows.length,
			iFixedBottomRowCount = this.getFixedBottomRowCount(),
			iFirstFixedBottomRowIndex = iCount - iFixedBottomRowCount;

		var iIndex = iFirstRow;
		if (oBinding) {
			var iBindingLength = oBinding.getLength();
			for (var iRow = 0; iRow < iCount; iRow++) {
				if (iFixedBottomRowCount > 0 && iRow >= iFirstFixedBottomRowIndex) {
					iIndex = iBindingLength - iCount + iRow;
				} else {
					iIndex = iFirstRow + iRow;
				}

				var oContext = this.getContextByIndex(iIndex),
					$DomRefs = aRows[iRow].getDomRefs(true),
					$row = $DomRefs.rowFixedPart || $DomRefs.rowScrollPart;

				this._updateExpandIcon($row, oContext, iIndex);

				if (this.getUseGroupMode()) {
					//If group mode is enabled nodes which have children are visualized as if they were group header
					var $rowHdr = this.$().find("div[data-sap-ui-rowindex='" + $row.attr("data-sap-ui-rowindex") + "']");
					if (oBinding.hasChildren && oBinding.hasChildren(oContext)) {
						// modify the rows
						$row.addClass("sapUiTableGroupHeader sapUiTableRowHidden");
						var sClass = oBinding.isExpanded(iFirstRow + iRow) ? "sapUiTableGroupIconOpen" : "sapUiTableGroupIconClosed";
						$rowHdr.html("<div class=\"sapUiTableGroupIcon " + sClass + "\" tabindex=\"-1\">" + this.getModel().getProperty(this.getGroupHeaderProperty(), oContext) + "</div>");
						$rowHdr.addClass("sapUiTableGroupHeader").removeAttr("title");
					} else {
						$row.removeClass("sapUiTableGroupHeader");
						if (oContext) {
							$row.removeClass("sapUiTableRowHidden");
						}
						$rowHdr.html("");
						$rowHdr.removeClass("sapUiTableGroupHeader");
					}
				}
			}
		}
	};

	TreeTable.prototype._updateTableCell = function () {
		return true;
	};
	
	TreeTable.prototype._updateExpandIcon = function($row, oContext, iAbsoluteRowIndex) {

		var oBinding = this.getBinding("rows");

		if (oBinding) {
			var iLevel = 0,
				bIsExpanded = false;
			
			if (oBinding.getLevel) {
				//used by the "mini-adapter" in the TreeTable ClientTreeBindings
				iLevel = oBinding.getLevel(oContext);
				bIsExpanded = oBinding.isExpanded(iAbsoluteRowIndex);
			} else if (oBinding.findNode) { // the ODataTreebinding(Adapter) provides the hasChildren method for Tree
				var oNode = oBinding.findNode(iAbsoluteRowIndex);
				iLevel = oNode ? oNode.level : 0;
				bIsExpanded = oNode && oNode.nodeState ? oNode.nodeState.expanded : false;
			}
			
			var $TreeIcon = $row.find(".sapUiTableTreeIcon");
			var sTreeIconClass = "sapUiTableTreeIconLeaf";
			var $FirstTd = $row.children("td.sapUiTableTdFirst");
			if (!this.getUseGroupMode()) {
				if (this._bRtlMode === true) {
					$TreeIcon.css("marginRight", iLevel * 17);
				} else {
					$TreeIcon.css("marginLeft", iLevel * 17);
				}
			}
			if (oBinding.hasChildren && oBinding.hasChildren(oContext)) {
				sTreeIconClass = bIsExpanded ? "sapUiTableTreeIconNodeOpen" : "sapUiTableTreeIconNodeClosed";
				$FirstTd.attr('aria-expanded', bIsExpanded);
				var sNodeText = bIsExpanded ? this._oResBundle.getText("TBL_COLLAPSE") : this._oResBundle.getText("TBL_EXPAND");
				$TreeIcon.attr('title', sNodeText);
			} else {
				$FirstTd.attr('aria-expanded', false);
				$TreeIcon.attr('aria-label', this._oResBundle.getText("TBL_LEAF"));
			}
			$TreeIcon.removeClass("sapUiTableTreeIconLeaf sapUiTableTreeIconNodeOpen sapUiTableTreeIconNodeClosed").addClass(sTreeIconClass);
			$row.attr("data-sap-ui-level", iLevel);
			$FirstTd.attr('aria-level', iLevel + 1);
		}

	};

	TreeTable.prototype.onclick = function(oEvent) {
		if (jQuery(oEvent.target).hasClass("sapUiTableGroupIcon")) {
			this._onGroupSelect(oEvent);
		} else if (jQuery(oEvent.target).hasClass("sapUiTableTreeIcon")) {
			this._onNodeSelect(oEvent);
		} else {
			if (Table.prototype.onclick) {
				Table.prototype.onclick.apply(this, arguments);
			}
		}
	};

	TreeTable.prototype.onsapselect = function(oEvent) {
		if (jQuery(oEvent.target).hasClass("sapUiTableTreeIcon")) {
			this._onNodeSelect(oEvent);
		} else {
			if (Table.prototype.onsapselect) {
				Table.prototype.onsapselect.apply(this, arguments);
			}
		}
	};

	TreeTable.prototype.onkeydown = function(oEvent) {
		Table.prototype.onkeydown.apply(this, arguments);
		var $Target = jQuery(oEvent.target),
			$TargetTD = $Target.closest('td');
		if (oEvent.keyCode == jQuery.sap.KeyCodes.TAB && this._bActionMode && $TargetTD.find('.sapUiTableTreeIcon').length > 0) {
			//If node icon has focus set tab to control else set tab to node icon
			if ($Target.hasClass('sapUiTableTreeIcon')) {
				if (!$Target.hasClass("sapUiTableTreeIconLeaf")) {
					$TargetTD.find(':sapFocusable:not(.sapUiTableTreeIcon)').first().focus();
				}
			} else {
				$TargetTD.find('.sapUiTableTreeIcon:not(.sapUiTableTreeIconLeaf)').focus();
			}
			oEvent.preventDefault();
		}
	};

	TreeTable.prototype._onNodeSelect = function(oEvent) {

		var $parent = jQuery(oEvent.target).parents("tr");
		if ($parent.length > 0) {
			var iRowIndex = this.getFirstVisibleRow() + parseInt($parent.attr("data-sap-ui-rowindex"), 10);
			var oContext = this.getContextByIndex(iRowIndex);
			this.fireToggleOpenState({
				rowIndex: iRowIndex,
				rowContext: oContext,
				expanded: !this.getBinding().isExpanded(iRowIndex)
			});
			//this.getBinding("rows").toggleContext(oContext);
			this.getBinding("rows").toggleIndex(iRowIndex);
		}

		oEvent.preventDefault();
		oEvent.stopPropagation();

	};

	TreeTable.prototype._onGroupSelect = function(oEvent) {

		var $parent = jQuery(oEvent.target).parents("[data-sap-ui-rowindex]");
		if ($parent.length > 0) {
			var iRowIndex = this.getFirstVisibleRow() + parseInt($parent.attr("data-sap-ui-rowindex"), 10);
			var oContext = this.getContextByIndex(iRowIndex);
			if (this.getBinding().isExpanded(iRowIndex)) {
				jQuery(oEvent.target).removeClass("sapUiTableGroupIconOpen").addClass("sapUiTableGroupIconClosed");
			} else {
				jQuery(oEvent.target).removeClass("sapUiTableGroupIconClosed").addClass("sapUiTableGroupIconOpen");
			}
			this.fireToggleOpenState({
				rowIndex: iRowIndex,
				rowContext: oContext,
				expanded: !this.getBinding().isExpanded(iRowIndex)
			});
			//this.getBinding("rows").toggleContext(iRowIndex);
			this.getBinding("rows").toggleIndex(iRowIndex);
		}

		oEvent.preventDefault();
		oEvent.stopPropagation();

	};

	/**
	 * expands the row for the given row index
	 *
	 * @param {int} iRowIndex
	 *         index of the row to expand
	 * @return {sap.ui.table.TreeTable} a reference on the TreeTable control, can be used for chaining
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	TreeTable.prototype.expand = function(iRowIndex) {
		var oBinding = this.getBinding("rows");
		if (oBinding) {
			oBinding.expand(iRowIndex);
		}
		
		return this;
	};

	/**
	 * collapses the row for the given row index
	 *
	 * @param {int} iRowIndex
	 *         index of the row to collapse
	 * @return {sap.ui.table.TreeTable} a reference on the TreeTable control, can be used for chaining
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	TreeTable.prototype.collapse = function(iRowIndex) {
		var oBinding = this.getBinding("rows");
		if (oBinding) {
			oBinding.collapse(iRowIndex);
		}
		
		return this;
	};
	
	/**
	 * Collapses all nodes (and lower if collapseRecursive is activated)
	 * 
	 * @return {sap.ui.table.TreeTable} a reference on the TreeTable control, can be used for chaining
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	TreeTable.prototype.collapseAll = function () {
		var oBinding = this.getBinding("rows");
		if (oBinding) {
			oBinding.collapseToLevel(0);
			this.setFirstVisibleRow(0);
		}
		
		return this;
	};

	/**
	 * Expands all nodes starting from the root level to the given level 'iLevel'.
	 * 
	 * Only supported with ODataModel v2, when running in OperationMode.Client or OperationMode.Auto.
	 * Fully supported for <code>sap.ui.model.ClientTreeBinding</code>, e.g. if you are using a <code>sap.ui.model.json.JSONModel</code>.
	 * 
	 * Please also see <code>sap.ui.model.odata.OperationMode</code>.
	 * 
	 * @param {int} iLevel the level to which the trees shall be expanded
	 * @return {sap.ui.table.TreeTable} a reference on the TreeTable control, can be used for chaining
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	TreeTable.prototype.expandToLevel = function (iLevel) {
		var oBinding = this.getBinding("rows");
		
		jQuery.sap.assert(oBinding && oBinding.expandToLevel, "TreeTable.expandToLevel is not supported with your current Binding. Please check if you are running on an ODataModel V2.");
		
		if (oBinding && oBinding.expandToLevel) {
			oBinding.expandToLevel(iLevel);
		}
		
		return this;
	};
	
	/**
	 * Returns whether the row is expanded or collapsed.
	 *
	 * @param {int} iRowIndex index of the row to check
	 * @return {boolean} true if the node at "iRowIndex" is expanded, false otherwise (meaning it is collapsed)
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	TreeTable.prototype.isExpanded = function(iRowIndex) {
		var oBinding = this.getBinding("rows");
		if (oBinding) {
			return oBinding.isExpanded(iRowIndex);
		}
		return false;
	};

	/**
	 * Checks if the row at the given index is selected.
	 * 
	 * @param {int} iRowIndex The row index for which the selection state should be retrieved
	 * @return {boolean} true if the index is selected, false otherwise
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	TreeTable.prototype.isIndexSelected = function (iRowIndex) {
		var oBinding = this.getBinding("rows");
		//when using the treebindingadapter, check if the node is selected
		if (oBinding && oBinding.isIndexSelected) {
			return oBinding.isIndexSelected(iRowIndex);
		} else {
			return Table.prototype.isIndexSelected.call(this, iRowIndex);
		}
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
	TreeTable.prototype.setSelectedIndex = function (iRowIndex) {
		if (iRowIndex === -1) {
			//If Index eq -1 no item is selected, therefore clear selection is called
			//SelectionModel doesn't know that -1 means no selection
			this.clearSelection();
		}
		
		//when using the treebindingadapter, check if the node is selected
		var oBinding = this.getBinding("rows");
		
		if (oBinding && oBinding.findNode && oBinding.setNodeSelection) {
			// set the found node as selected
			oBinding.setSelectedIndex(iRowIndex);
			//this.fireEvent("selectionChanged");
		} else {
			Table.prototype.setSelectedIndex.call(this, iRowIndex);
		}
		return this;
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
	TreeTable.prototype.getSelectedIndices = function () {
		//when using the treebindingadapter, check if the node is selected
		var oBinding = this.getBinding("rows");
		
		if (oBinding && oBinding.findNode && oBinding.getSelectedIndices) {
			/*jQuery.sap.log.warning("When using a TreeTable on a V2 ODataModel, you can also use 'getSelectedContexts' on the underlying TreeBinding," + 
					" for an optimised retrieval of the binding contexts of the all selected rows/nodes.");*/
			return oBinding.getSelectedIndices();
		} else {
			return Table.prototype.getSelectedIndices.call(this);
		}
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
	TreeTable.prototype.setSelectionInterval = function (iFromIndex, iToIndex) {
		//when using the treebindingadapter, check if the node is selected
		var oBinding = this.getBinding("rows");
		
		if (oBinding && oBinding.findNode && oBinding.setSelectionInterval) {
			oBinding.setSelectionInterval(iFromIndex, iToIndex);
		} else {
			Table.prototype.setSelectionInterval.call(this, iFromIndex, iToIndex);
		}
		
		return this;
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
	TreeTable.prototype.addSelectionInterval = function (iFromIndex, iToIndex) {
		var oBinding = this.getBinding("rows");
		//TBA check
		if (oBinding && oBinding.findNode && oBinding.addSelectionInterval) {
			oBinding.addSelectionInterval(iFromIndex, iToIndex);
		} else {
			Table.prototype.addSelectionInterval.call(this, iFromIndex, iToIndex);
		}
		return this;
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
	TreeTable.prototype.removeSelectionInterval = function (iFromIndex, iToIndex) {
		var oBinding = this.getBinding("rows");
		//TBA check
		if (oBinding && oBinding.findNode && oBinding.removeSelectionInterval) {
			oBinding.removeSelectionInterval(iFromIndex, iToIndex);
		} else {
			Table.prototype.removeSelectionInterval.call(this, iFromIndex, iToIndex);
		}
		return this;
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
	TreeTable.prototype.selectAll = function () {
		//select all is only allowed when SelectionMode is "Multi" or "MultiToggle"
		var oSelMode = this.getSelectionMode();
		if (!this.getEnableSelectAll() || (oSelMode != "Multi" && oSelMode != "MultiToggle") || !this._getSelectableRowCount()) {
			return this;
		}
		
		//The OData TBA exposes a selectAll function
		var oBinding = this.getBinding("rows");
		if (oBinding.selectAll) {
			oBinding.selectAll();
			this.$("selall").attr('title',this._oResBundle.getText("TBL_DESELECT_ALL")).removeClass("sapUiTableSelAll");
		} else {
			//otherwise fallback on the tables own function
			Table.prototype.selectAll.call(this);
		}

		return this;
	};
	
	/**
	 * Retrieves the lead selection index. The lead selection index is, among other things, used to determine the
	 * start/end of a selection range, when using Shift-Click to select multiple entries at once. 
	 * 
	 * @return {int[]} an array containing all selected indices (ascending ordered integers)
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	TreeTable.prototype.getSelectedIndex = function() {
		//when using the treebindingadapter, check if the node is selected
		var oBinding = this.getBinding("rows");
		
		if (oBinding && oBinding.findNode) {
			return oBinding.getSelectedIndex();
		} else {
			return Table.prototype.getSelectedIndex.call(this);
		}
	};
	
	/**
	 * Clears the complete selection (all tree table rows/nodes will lose their selection)
	 * 
	 * @return {sap.ui.table.TreeTable} a reference on the TreeTable control, can be used for chaining
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	TreeTable.prototype.clearSelection = function () {
		var oBinding = this.getBinding("rows");
		
		if (oBinding && oBinding.clearSelection) {
			oBinding.clearSelection();
		} else {
			Table.prototype.clearSelection.call(this);
		}
		
		return this;
	};
	
	TreeTable.prototype._enterActionMode = function($Tabbable) {
		var $domRef = $Tabbable.eq(0);

		Table.prototype._enterActionMode.apply(this, arguments);
		if ($Tabbable.length > 0 && $domRef.hasClass("sapUiTableTreeIcon") && !$domRef.hasClass("sapUiTableTreeIconLeaf")) {
			//Set tabindex to 0 to have make node icon accessible
			$domRef.attr("tabindex", 0).focus();
			//set action mode to true so that _leaveActionMode is called to remove the tabindex again
			this._bActionMode = true;
		}
	};

	TreeTable.prototype._leaveActionMode = function(oEvent) {
		Table.prototype._leaveActionMode.apply(this, arguments);
		this.$().find(".sapUiTableTreeIcon").attr("tabindex", -1);
	};

	TreeTable.prototype.getContextByIndex = function (iRowIndex) {
		var oBinding = this.getBinding("rows");
		if (oBinding) {
			return oBinding.getContextByIndex(iRowIndex);
		}
	};

	/**
	 * Set the rootLevel for the hierarchy
	 * The root level is the level of the topmost tree nodes, which will be used as an entry point for OData services.
	 * This setting has only effect when the binding is already initialized.
	 * @param {int} iRootLevel
	 * @returns {TreeTable}
	 */
	TreeTable.prototype.setRootLevel = function(iRootLevel) {
		this.setFirstVisibleRow(0);
		
		var oBinding = this.getBinding("rows");
		if (oBinding) {
			jQuery.sap.assert(oBinding.setRootLevel, "rootLevel is not supported by the used binding");
			if (oBinding.setRootLevel) {
				oBinding.setRootLevel(iRootLevel);
			}
		}
		this.setProperty("rootLevel", iRootLevel, true);
		
		return this;
	};

	/**
	 * Sets the node hierarchy to collapse recursive. When set to true, all child nodes will get collapsed as well.
	 * This setting has only effect when the binding is already initialized.
	 * @param {boolean} bCollapseRecursive
	 */
	TreeTable.prototype.setCollapseRecursive = function(bCollapseRecursive) {
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

	return TreeTable;

}, /* bExport= */ true);
