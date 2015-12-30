/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

//Provides default renderer for control sap.ui.table.Table
sap.ui.define(['jquery.sap.global', 'sap/ui/core/theming/Parameters'],
	function(jQuery, Parameters) {
	"use strict";


	/**
	 * Table renderer.
	 * @namespace
	 */
	var TableRenderer = {};

	/**
	 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} rm the RenderManager that can be used for writing to the Render-Output-Buffer
	 * @param {sap.ui.core.Control} oTable an object representation of the control that should be rendered
	 */
	TableRenderer.render = function(rm, oTable) {
		// create the rows of the table
		// (here we could think about a swith to allow the programmatic usage of the table)
		oTable._createRows();

		// basic table div
		rm.write("<div");
		if (oTable._bAccMode) {
			var aAriaOwnsIds = [];
			if (oTable.getToolbar()) {
				aAriaOwnsIds.push(oTable.getToolbar().getId());
			}
			aAriaOwnsIds.push(oTable.getId() + "-table");
			rm.writeAttribute("aria-owns", aAriaOwnsIds.join(" "));
			rm.writeAttribute("aria-readonly", "true");
			if (oTable.getTitle()) {
				rm.writeAttribute("aria-labelledby", oTable.getTitle().getId());
			}
			if (oTable.getSelectionMode() === sap.ui.table.SelectionMode.Multi) {
				rm.writeAttribute("aria-multiselectable", "true");
			}
		}
		rm.writeControlData(oTable);
		rm.addClass("sapUiTable");
		rm.addClass("sapUiTableSelMode" + oTable.getSelectionMode());
		if (oTable.getColumnHeaderVisible()) {
			rm.addClass("sapUiTableCHdr"); // show column headers
		}
		if (oTable.getSelectionMode() !== sap.ui.table.SelectionMode.None &&
				oTable.getSelectionBehavior() !== sap.ui.table.SelectionBehavior.RowOnly) {
			rm.addClass("sapUiTableRSel"); // show row selector
		}

		// This class flags whether the sap.m. library is loaded or not.
		var sSapMTableClass = sap.ui.table.TableHelper.addTableClass();
		if (sSapMTableClass) {
			rm.addClass(sSapMTableClass);
		}

		rm.addClass("sapUiTableSelMode" + oTable.getSelectionMode()); // row selection mode
		//rm.addClass("sapUiTableHScr"); // show horizontal scrollbar
		if (oTable.getNavigationMode() === sap.ui.table.NavigationMode.Scrollbar) {
			rm.addClass("sapUiTableVScr"); // show vertical scrollbar
		}
		if (oTable.getEditable()) {
			rm.addClass("sapUiTableEdt"); // editable (background color)
		}
		rm.addClass("sapUiTableShNoDa");
		if (oTable.getShowNoData() && oTable._getRowCount() === 0) {
			rm.addClass("sapUiTableEmpty"); // no data!
		}
		if (oTable.getEnableGrouping()) {
			rm.addClass("sapUiTableGrouping");
		}
		rm.writeClasses();
		if (oTable.getWidth()) {
			rm.addStyle("width", oTable.getWidth());
		}
		rm.writeStyles();
		rm.write(">");

		if (oTable.getTitle()) {
			this.renderHeader(rm, oTable, oTable.getTitle());
		}

		if (oTable.getToolbar()) {
			this.renderToolbar(rm, oTable, oTable.getToolbar());
		}

		if (oTable.getExtension() && oTable.getExtension().length > 0) {
			this.renderExtensions(rm, oTable, oTable.getExtension());
		}

		rm.write("<div");
		rm.addClass("sapUiTableCnt");
		rm.writeClasses();
		// Define group for F6 handling
		rm.writeAttribute("data-sap-ui-fastnavgroup", "true");
		if (oTable._bAccMode) {
			rm.writeAttribute("aria-describedby", oTable.getId() + "-ariacount");
		}
		rm.write(">");

		this.renderColHdr(rm, oTable);

		this.renderTable(rm, oTable);

		if (oTable._bAccMode) {
			// aria description for the row count
			rm.write("<span");
			rm.writeAttribute("id", oTable.getId() + "-ariadesc");
			rm.addStyle("position", "absolute");
			rm.addStyle("top", "-20000px");
			rm.writeStyles();
			rm.write(">");
			if (oTable.getTitle() && oTable.getTitle().getText && oTable.getTitle().getText() != "") {
				rm.writeEscaped(oTable.getTitle().getText());
			} else {
				rm.write(oTable._oResBundle.getText("TBL_TABLE"));
			}

			rm.write("</span>");
			// aria description for the row count
			rm.write("<span");
			rm.writeAttribute("id", oTable.getId() + "-ariacount");
			rm.addStyle("position", "absolute");
			rm.addStyle("top", "-20000px");
			rm.writeStyles();
			rm.write(">");
			rm.write("</span>");
			// aria description for toggling the edit mode
			rm.write("<span");
			rm.writeAttribute("id", oTable.getId() + "-toggleedit");
			rm.addStyle("position", "absolute");
			rm.addStyle("top", "-20000px");
			rm.writeStyles();
			rm.write(">");
			rm.write(oTable._oResBundle.getText("TBL_TOGGLE_EDIT_KEY"));
			rm.write("</span>");
			// aria description for row selection behavior with no line selected
			rm.write("<span");
			rm.writeAttribute("id", oTable.getId() + "-selectrow");
			rm.addStyle("position", "absolute");
			rm.addStyle("top", "-20000px");
			rm.writeStyles();
			rm.write(">");
			rm.write(oTable._oResBundle.getText("TBL_ROW_SELECT_KEY"));
			rm.write("</span>");
			// aria description for row selection behavior with line selected
			rm.write("<span");
			rm.writeAttribute("id", oTable.getId() + "-selectrowmulti");
			rm.addStyle("position", "absolute");
			rm.addStyle("top", "-20000px");
			rm.writeStyles();
			rm.write(">");
			rm.write(oTable._oResBundle.getText("TBL_ROW_SELECT_MULTI_KEY"));
			rm.write("</span>");
			// aria description for row deselection behavior with no line selected
			rm.write("<span");
			rm.writeAttribute("id", oTable.getId() + "-deselectrow");
			rm.addStyle("position", "absolute");
			rm.addStyle("top", "-20000px");
			rm.writeStyles();
			rm.write(">");
			rm.write(oTable._oResBundle.getText("TBL_ROW_DESELECT_KEY"));
			rm.write("</span>");
			// aria description for row deselection behavior with line selected
			rm.write("<span");
			rm.writeAttribute("id", oTable.getId() + "-deselectrowmulti");
			rm.addStyle("position", "absolute");
			rm.addStyle("top", "-20000px");
			rm.writeStyles();
			rm.write(">");
			rm.write(oTable._oResBundle.getText("TBL_ROW_DESELECT_MULTI_KEY"));
			rm.write("</span>");
			// table row count
			rm.write("<span");
			rm.writeAttribute("id", oTable.getId() + "-rownumberofrows");
			rm.addStyle("position", "absolute");
			rm.addStyle("top", "-20000px");
			rm.writeStyles();
			rm.write(">");
			rm.write("</span>");
		}

		rm.write("</div>");

		if (oTable.getNavigationMode() === sap.ui.table.NavigationMode.Paginator) {
			rm.write("<div");
			rm.addClass("sapUiTablePaginator");
			rm.writeClasses();
			rm.write(">");
			if (!oTable._oPaginator) {
				jQuery.sap.require("sap.ui.commons.Paginator");
				oTable._oPaginator = new sap.ui.commons.Paginator(oTable.getId() + "-paginator");
				oTable._oPaginator.attachPage(jQuery.proxy(oTable.onvscroll, oTable));
			}
			rm.renderControl(oTable._oPaginator);
			rm.write("</div>");
		}

		if (oTable.getFooter()) {
			this.renderFooter(rm, oTable, oTable.getFooter());
		}

		if (oTable.getVisibleRowCountMode() == sap.ui.table.VisibleRowCountMode.Interactive) {
			this.renderVariableHeight(rm ,oTable);
		}

		rm.write("</div>");

	};

	// =============================================================================
	// BASIC AREAS OF THE TABLE
	// =============================================================================

	TableRenderer.renderHeader = function(rm, oTable, oTitle) {
		rm.write("<div");
		rm.addClass("sapUiTableHdr");
		rm.writeClasses();
		if (oTable._bAccMode) {
			rm.writeAttribute("role", "heading");
		}
		rm.write(">");

		rm.renderControl(oTitle);

		rm.write("</div>");
	};

	TableRenderer.renderToolbar = function(rm, oTable, oToolbar) {
		rm.write("<div");
		rm.addClass("sapUiTableTbr");
		if (typeof oToolbar.getStandalone !== "function") {
			// for the mobile toolbar we add another class
			rm.addClass("sapUiTableMTbr");
		}
		rm.writeClasses();
		rm.write(">");

		// toolbar has to be embedded (not standalone)!
		if (typeof oToolbar.getStandalone === "function" && oToolbar.getStandalone()) {
			oToolbar.setStandalone(false);
		}

		// set the default design of the toolbar
		if (sap.m && sap.m.Toolbar && oToolbar instanceof sap.m.Toolbar) {
			oToolbar.setDesign(Parameters.get("sapUiTableToolbarDesign"), true);
		}

		rm.renderControl(oToolbar);

		rm.write("</div>");
	};

	TableRenderer.renderExtensions = function(rm, oTable, aExtensions) {
		for (var i = 0, l = aExtensions.length; i < l; i++) {
			this.renderExtension(rm, oTable, aExtensions[i]);
		}
	};

	TableRenderer.renderExtension = function(rm, oTable, oExtension) {
		rm.write("<div");
		rm.addClass("sapUiTableExt");
		rm.writeClasses();
		rm.write(">");

		rm.renderControl(oExtension);

		rm.write("</div>");
	};

	TableRenderer.renderTable = function(rm, oTable) {
		rm.write("<div");
		rm.addClass("sapUiTableCCnt");
		rm.writeClasses();
		rm.write(">");

		rm.write("<div");
		rm.addClass("sapUiTableCtrlBefore");
		rm.writeClasses();
		rm.writeAttribute("tabindex", "0");
		rm.write("></div>");

		this.renderRowHdr(rm, oTable);
		this.renderTableCtrl(rm, oTable);
		this.renderVSb(rm, oTable);

		rm.write("</div>");

		this.renderHSb(rm, oTable);

	};

	TableRenderer.renderFooter = function(rm, oTable, oFooter) {
		rm.write("<div");
		rm.addClass("sapUiTableFtr");
		rm.writeClasses();
		rm.write(">");

		rm.renderControl(oFooter);

		rm.write("</div>");
	};

	TableRenderer.renderVariableHeight = function(rm, oTable) {
		rm.write('<div id="' + oTable.getId() + '-sb" tabIndex="-1"');
		rm.addClass("sapUiTableSplitterBar");
		rm.addStyle("height", "5px");
		rm.writeClasses();
		rm.writeStyles();
		rm.write(">");
		rm.write("</div>");
	};

	// =============================================================================
	// COLUMN HEADER OF THE TABLE
	// =============================================================================

	TableRenderer.renderColHdr = function(rm, oTable) {

		rm.write("<div");
		rm.addClass("sapUiTableColHdrCnt");
		rm.writeClasses();
		if (oTable.getColumnHeaderHeight() > 0) {
			rm.addStyle("height", (oTable.getColumnHeaderHeight() * oTable._getHeaderRowCount()) + "px");
		}
		if (oTable._bAccMode &&
			 (oTable.getSelectionMode() === sap.ui.table.SelectionMode.None ||
					 oTable.getSelectionBehavior() === sap.ui.table.SelectionBehavior.RowOnly)) {
			rm.writeAttribute("role", "row");
		}
		rm.writeStyles();
		rm.write(">");

		this.renderColRowHdr(rm, oTable);

		var aCols = oTable.getColumns();

		if (oTable.getFixedColumnCount() > 0) {
			rm.write("<div");
			rm.addClass("sapUiTableColHdrFixed");
			rm.writeClasses();
			rm.write(">");

			for (var h = 0; h < oTable._getHeaderRowCount(); h++) {

				rm.write("<div");
				rm.addClass("sapUiTableColHdr");
				rm.writeClasses();
				rm.addStyle("min-width", oTable._getColumnsWidth(0, oTable.getFixedColumnCount()) + "px");
				rm.writeStyles();
				rm.write(">");

				var iSpan = 1;
				for (var i = 0, l = oTable.getFixedColumnCount(); i < l; i++) {
					if (aCols[i] && aCols[i].shouldRender()) {
						if (iSpan <= 1) {
							this.renderCol(rm, oTable, aCols[i], i, h);
							var aHeaderSpan = aCols[i].getHeaderSpan();
							if (jQuery.isArray(aHeaderSpan)) {
								iSpan = aCols[i].getHeaderSpan()[h] + 1;
							} else {
								iSpan = aCols[i].getHeaderSpan() + 1;
							}
						} else {
							//Render column header but this is invisible because of the span
							this.renderCol(rm, oTable, aCols[i], i, h, true);
						}
						if (h == 0) {
							this.renderColRsz(rm, oTable, aCols[i], i);
						}
						iSpan--;
					}
				}

				rm.write("<p style=\"clear: both;\"></p>");
				rm.write("</div>");

			}

			rm.write("</div>");
		}

		rm.write("<div");
		rm.addClass("sapUiTableColHdrScr");
		rm.writeClasses();
		if (oTable.getFixedColumnCount() > 0) {
			if (oTable._bRtlMode) {
				rm.addStyle("margin-right", "0");
			} else {
				rm.addStyle("margin-left", "0");
			}
			rm.writeStyles();
		}
		rm.write(">");

		for (var h = 0; h < oTable._getHeaderRowCount(); h++) {

			rm.write("<div");
			rm.addClass("sapUiTableColHdr");
			rm.writeClasses();
			rm.addStyle("min-width", oTable._getColumnsWidth(oTable.getFixedColumnCount(), aCols.length) + "px");
			rm.writeStyles();
			rm.write(">");

			var iSpan = 1;
			for (var i = oTable.getFixedColumnCount(), l = aCols.length; i < l; i++) {
				if (aCols[i].shouldRender()) {
					if (iSpan <= 1) {
						this.renderCol(rm, oTable, aCols[i], i, h);
						var aHeaderSpan = aCols[i].getHeaderSpan();
						if (jQuery.isArray(aHeaderSpan)) {
							iSpan = aCols[i].getHeaderSpan()[h] + 1;
						} else {
							iSpan = aCols[i].getHeaderSpan() + 1;
						}
					} else {
						//Render column header but this is invisible because of the span
						this.renderCol(rm, oTable, aCols[i], i, h, true);
					}
					if (h == 0) {
						this.renderColRsz(rm, oTable, aCols[i], i);
					}
					iSpan--;
				}
			}

			rm.write("<p style=\"clear: both;\"></p>");
			rm.write("</div>");

		}

		rm.write("</div>");

		rm.write("</div>");

	};

	/**
	 * This function renders aria attributes if bAccMode is true.
	 * @param {sap.ui.core.RenderManager} rm Instance of the RenderManager
	 * @param {Map} mAriaAttributes Map of aria attributes. The Key of the maps equals the attribute name
	 * @param {Boolean} bAccMode Flag if Acc Mode is turned on
	 */
	TableRenderer.renderAriaAttributes = function(rm, mAriaAttributes, bAccMode) {
		if (bAccMode) {
			for (var sKey in mAriaAttributes) {
				var mAriaAttribute = mAriaAttributes[sKey];
				if (mAriaAttribute.escaped) {
					rm.writeAttributeEscaped(sKey, mAriaAttribute.value);
				} else {
					rm.writeAttribute(sKey, mAriaAttribute.value);
				}
			}
		}
	};

	TableRenderer.getAriaAttributesForRowHdr = function(oTable) {
		return {
			"aria-label": {value: oTable._oResBundle.getText("TBL_SELECT_ALL_KEY"), escaped: true}
		};
	};

	TableRenderer.renderColRowHdr = function(rm, oTable) {
		rm.write("<div");
		rm.writeAttribute("id", oTable.getId() + "-selall");
		var oSelMode = oTable.getSelectionMode();
		if ((oSelMode == "Multi" || oSelMode == "MultiToggle") && oTable.getEnableSelectAll()) {
			rm.writeAttributeEscaped("title", oTable._oResBundle.getText("TBL_SELECT_ALL"));
			//TODO: remove second _getSelectableRowCount Call!
			if (oTable._getSelectableRowCount() == 0 || oTable._getSelectableRowCount() !== oTable.getSelectedIndices().length) {
				rm.addClass("sapUiTableSelAll");
			}
			rm.addClass("sapUiTableSelAllEnabled");
		}
		rm.addClass("sapUiTableColRowHdr");
		rm.writeClasses();

		rm.writeAttribute("tabindex", "-1");

		var mAriaAttributes = this.getAriaAttributesForRowHdr(oTable);
		this.renderAriaAttributes(rm, mAriaAttributes, oTable._bAccMode);

		rm.write(">");
		if (oTable.getSelectionMode() !== sap.ui.table.SelectionMode.Single) {
			rm.write("<div");
			rm.addClass("sapUiTableColRowHdrIco");
			rm.writeClasses();
			if (oTable.getColumnHeaderHeight() > 0) {
				rm.addStyle("height", oTable.getColumnHeaderHeight() + "px");
			}
			rm.write(">");
			rm.write("</div>");
		}
		rm.write("</div>");
	};

	TableRenderer.getAriaAttributesForCol = function(oTable, oColumn, iColumnIndex) {
		var mAriaAttributes = {};

		// aria-haspopup should only be added if the column has a column menu
		// the column menu always gets created but might have no items.
		if (oColumn._menuHasItems()) {
			mAriaAttributes["aria-haspopup"] = {value: "true"};
		}

		mAriaAttributes.role = {value: "columnheader"};

		if (iColumnIndex < oTable.getFixedColumnCount()) {
			mAriaAttributes["aria-labelledby"] = {value: oColumn.getId() + " " + oTable.getId() + "-ariafixedcolumn"};
		}

		return mAriaAttributes;
	};

	TableRenderer.renderCol = function(rm, oTable, oColumn, iIndex, iHeader, bInvisible) {
		var oLabel;
		if (oColumn.getMultiLabels().length > 0) {
			oLabel = oColumn.getMultiLabels()[iHeader];
		} else if (iHeader == 0) {
			oLabel = oColumn.getLabel();
		}

		rm.write("<div");
		if (iHeader === 0) {
			rm.writeElementData(oColumn);
		} else {
			// TODO: we need a writeElementData with suffix - it is another HTML element
			//       which belongs to the same column but it is not in one structure!
			rm.writeAttribute('id', oColumn.getId() + "_" + iHeader);
		}
		rm.writeAttribute('data-sap-ui-colid', oColumn.getId());
		rm.writeAttribute("data-sap-ui-colindex", iIndex);

		rm.writeAttribute("tabindex", "-1");

		var mAriaAttributes = this.getAriaAttributesForCol(oTable, oColumn, iIndex);
		this.renderAriaAttributes(rm, mAriaAttributes, oTable._bAccMode);

		rm.addClass("sapUiTableCol");
		if (oTable.getFixedColumnCount() === iIndex + 1) {
			rm.addClass("sapUiTableColLastFixed");
		}
		
		rm.writeClasses();
		rm.addStyle("width", oColumn.getWidth());
		if (oTable.getColumnHeaderHeight() > 0) {
			rm.addStyle("height", oTable.getColumnHeaderHeight() + "px");
		}
		if (bInvisible) {
			rm.addStyle("display", "none");
		}
		rm.writeStyles();
		var sTooltip = oColumn.getTooltip_AsString();
		if (sTooltip) {
			rm.writeAttributeEscaped("title", sTooltip);
		}
		rm.write("><div");
		rm.addClass("sapUiTableColCell");
		rm.writeClasses();
		var sHAlign = this.getHAlign(oColumn.getHAlign(), oTable._bRtlMode);
		if (sHAlign) {
			rm.addStyle("text-align", sHAlign);
		}
		rm.writeStyles();
		rm.write(">");

		// TODO: rework column sort / filter status integration
		rm.write("<div id=\"" + oColumn.getId() + "-icons\" class=\"sapUiTableColIcons\"></div>");

		if (oLabel) {
			rm.renderControl(oLabel);
		}

		rm.write("</div></div>");
	};

	TableRenderer.renderColRsz = function(rm, oTable, oColumn, iIndex) {
		if (oColumn.getResizable()) {
			rm.write("<div");
			rm.writeAttribute("id", oColumn.getId() + "-rsz");
			rm.writeAttribute("data-sap-ui-colindex", iIndex);
			rm.writeAttribute("tabindex", "-1");
			rm.addClass("sapUiTableColRsz");
			rm.writeClasses();
			rm.addStyle("left", oTable._bRtlMode ? "99000px" : "-99000px");
			rm.writeStyles();
			rm.write("></div>");
		}
	};


	// =============================================================================
	// CONTENT AREA OF THE TABLE
	// =============================================================================

	TableRenderer.renderRowHdr = function(rm, oTable) {
		rm.write("<div");
		rm.addClass("sapUiTableRowHdrScr");
		rm.writeClasses();
		rm.write(">");

		// start with the first current top visible row
		for (var row = 0, count = oTable.getRows().length; row < count; row++) {
			this.renderRowHdrRow(rm, oTable, oTable.getRows()[row], row);
		}

		rm.write("</div>");
	};

	TableRenderer.getAriaAttributesForRowHdrRow = function(oTable, oRow) {
		var mAriaAttributes = {
			"aria-labelledby": {value: oTable.getId() + "-rownumberofrows " + oRow.getId() + "-rowselecttext"}
		};

		var sSelctionMode = oTable.getSelectionMode();
		if (sSelctionMode !== sap.ui.table.SelectionMode.None) {
			mAriaAttributes["title"] = {value: oTable._oResBundle.getText("TBL_ROW_SELECT")};
			mAriaAttributes["aria-selected"] = {value: "false"};
			if (sSelctionMode === sap.ui.table.SelectionMode.Multi) {
				if (oTable.getSelectedIndices().length > 1) {
					mAriaAttributes["aria-label"] = {value: oTable._oResBundle.getText("TBL_ROW_SELECT_MULTI_KEY")};
				}
			} else {
				mAriaAttributes["aria-label"] = {value: oTable._oResBundle.getText("TBL_ROW_SELECT_KEY")};
			}
		}

		return mAriaAttributes;
	};

	TableRenderer.renderRowHdrRow = function(rm, oTable, oRow, iRowIndex) {
		rm.write("<div");
		rm.writeAttribute("id", oTable.getId() + "-rowsel" + iRowIndex);
		rm.writeAttribute("data-sap-ui-rowindex", iRowIndex);
		rm.addClass("sapUiTableRowHdr");
		if (oRow._bHidden) {
			rm.addClass("sapUiTableRowHidden");
		}
		rm.writeClasses();
		if (oTable.getRowHeight() > 0) {
			rm.addStyle("height", oTable.getRowHeight() + "px");
		}

		rm.writeAttribute("tabindex", "-1");

		var mAriaAttributes = this.getAriaAttributesForRowHdrRow(oTable, oRow);
		this.renderAriaAttributes(rm, mAriaAttributes, oTable._bAccMode);

		var aCellIds = [];
		jQuery.each(oRow.getCells(), function(iIndex, oCell) {
			aCellIds.push(oRow.getId() + "-col" + iIndex);
		});

		rm.writeStyles();
		rm.write("></div>");
	};

	TableRenderer.renderTableCtrl = function(rm, oTable) {

		if (oTable.getFixedColumnCount() > 0) {
			rm.write("<div");
			rm.addClass("sapUiTableCtrlScrFixed");
			rm.writeClasses();
			rm.write(">");

			this.renderTableControl(rm, oTable, true);

			rm.write("<span");
			rm.writeAttribute("id", oTable.getId() + "-ariafixedcolumn");
			rm.addStyle("position", "absolute");
			rm.addStyle("top", "-20000px");
			rm.writeStyles();
			rm.write(">");
			rm.write(oTable._oResBundle.getText("TBL_FIXED_COLUMN"));
			rm.write("</div>");
		}

		rm.write("<div");
		rm.addClass("sapUiTableCtrlScr");
		rm.writeClasses();
		if (oTable.getFixedColumnCount() > 0) {
			if (oTable._bRtlMode) {
				rm.addStyle("margin-right", "0");
			} else {
				rm.addStyle("margin-left", "0");
			}
			rm.writeStyles();
		}
		rm.write(">");

		rm.write("<div");
		rm.addClass("sapUiTableCtrlCnt");
		rm.writeClasses();
		rm.write(">");

		this.renderTableControl(rm, oTable, false);

		rm.write("</div>");

		rm.write("<div");
		rm.addClass("sapUiTableCtrlAfter");
		rm.writeClasses();
		rm.writeAttribute("tabindex", "0");
		rm.write("></div>");
		rm.write("</div>");

		rm.write("<div");
		rm.addClass("sapUiTableCtrlEmpty");
		rm.writeClasses();
		rm.writeAttribute("tabindex", "0");
		rm.write(">");
		if (oTable.getNoData() && oTable.getNoData() instanceof sap.ui.core.Control) {
			rm.renderControl(oTable.getNoData());
		} else {
			rm.write("<span");
			rm.addClass("sapUiTableCtrlEmptyMsg");
			rm.writeClasses();
			rm.write(">");
			if (typeof oTable.getNoData() === "string" || oTable.getNoData() instanceof String) {
				rm.writeEscaped(oTable.getNoData());
			} else if (oTable.getNoDataText()) {
				rm.writeEscaped(oTable.getNoDataText());
			} else {
				rm.writeEscaped(oTable._oResBundle.getText("TBL_NO_DATA"));
			}
			rm.write("</span>");
		}
		rm.write("</div>");
	};


	TableRenderer.renderTableControl = function(rm, oTable, bFixedTable) {
		var iStartColumn, iEndColumn;
		if (bFixedTable) {
			iStartColumn = 0;
			iEndColumn = oTable.getFixedColumnCount();
		} else {
			iStartColumn = oTable.getFixedColumnCount();
			iEndColumn = oTable.getColumns().length;
		}
		var iFixedRows = oTable.getFixedRowCount();
		var iFixedBottomRows = oTable.getFixedBottomRowCount();
		var aRows = oTable.getRows();

		if (iFixedRows > 0) {
			this.renderTableControlCnt(rm, oTable, bFixedTable, iStartColumn, iEndColumn, true, false, 0, iFixedRows);
		}
		this.renderTableControlCnt(rm, oTable, bFixedTable, iStartColumn, iEndColumn, false, false, iFixedRows, aRows.length - iFixedBottomRows);
		if (iFixedBottomRows > 0) {
			this.renderTableControlCnt(rm, oTable, bFixedTable, iStartColumn, iEndColumn, false, true, aRows.length - iFixedBottomRows, aRows.length);
		}
	};

	TableRenderer.getAriaAttributesForTableControlCntColTh = function(oColumn, bHasRowSelector) {
		var mAriaAttributes = {
			"role": {value: "columnheader"},
			"scope": {value: "col"}
		};

		if (bHasRowSelector) {
			mAriaAttributes["aria-owns"] = {value: "" + oColumn.getId()};
			mAriaAttributes["aria-labelledby"] = {value: "" + oColumn.getId()};
		}

		return mAriaAttributes;
	};

	TableRenderer.renderTableControlCnt = function(rm, oTable, bFixedTable, iStartColumn, iEndColumn, bFixedRow, bFixedBottomRow, iStartRow, iEndRow) {
		rm.write("<table");
		var sId = oTable.getId() + "-table";

		if (bFixedTable) {
			sId += "-fixed";
			rm.addClass("sapUiTableCtrlFixed");
		} else {
			rm.addClass("sapUiTableCtrlScroll");
		}
		if (bFixedRow) {
			sId += "-fixrow";
			rm.addClass("sapUiTableCtrlRowFixed");
		} else if (bFixedBottomRow) {
			sId += "-fixrow-bottom";
			rm.addClass("sapUiTableCtrlRowFixedBottom");
		} else {
			rm.addClass("sapUiTableCtrlRowScroll");
		}
		rm.writeAttribute("id", sId);
		if (oTable._bAccMode) {
			rm.writeAttribute("role", "grid");
		}
		rm.addClass("sapUiTableCtrl");
		rm.writeClasses();
		rm.addStyle("min-width", oTable._getColumnsWidth(iStartColumn, iEndColumn) + "px");
		//Firefox and chrome and safari need a defined width for the fixed table
		if (bFixedTable && (!!sap.ui.Device.browser.firefox || !!sap.ui.Device.browser.chrome || !!sap.ui.Device.browser.safari)) {
			rm.addStyle("width", oTable._getColumnsWidth(iStartColumn, iEndColumn) + "px");
		}
		rm.writeStyles();
		rm.write(">");

		rm.write("<thead>");

		rm.write("<tr");
		rm.addClass("sapUiTableCtrlCol");
		if (iStartRow == 0) {
			rm.addClass("sapUiTableCtrlFirstCol");
		}
		rm.writeClasses();
		rm.write(">");

		var aCols = oTable.getColumns();
		if (oTable.getSelectionMode() !== sap.ui.table.SelectionMode.None &&
				oTable.getSelectionBehavior() !== sap.ui.table.SelectionBehavior.RowOnly) {
			rm.write("<th");
			rm.addStyle("width", "0px");
			rm.writeStyles();
			if (iStartRow == 0) {
				var mAriaAttributes = this.getAriaAttributesForTableControlCntColTh(oColumn);
				this.renderAriaAttributes(rm, mAriaAttributes, oTable._bAccMode);
				rm.writeAttribute("id", oTable.getId() + "_colsel");
			}
			rm.write("></th>");
		} else {
			if (aCols.length === 0) {
				// no cols => render th => avoids rendering issue in firefox
				rm.write("<th></th>");
			}
		}

		for (var col = iStartColumn, count = iEndColumn; col < count; col++) {
			var oColumn = aCols[col];
			if (oColumn && oColumn.shouldRender()) {
				rm.write("<th");
				rm.addStyle("width", oColumn.getWidth());
				rm.writeStyles();
				if (iStartRow == 0) {
					var mAriaAttributes = this.getAriaAttributesForTableControlCntColTh(oColumn, true);
					this.renderAriaAttributes(rm, mAriaAttributes, oTable._bAccMode);
					rm.writeAttribute("id", oTable.getId() + "_col" + col);
				}
				rm.writeAttribute("data-sap-ui-headcolindex", col);
				rm.write(">");
				if (iStartRow == 0 && oTable._getHeaderRowCount() == 0) {
					if (oColumn.getMultiLabels().length > 0) {
						rm.renderControl(oColumn.getMultiLabels()[0]);
					} else {
						rm.renderControl(oColumn.getLabel());
					}
				}
				rm.write("</th>");
			}
		}

		// dummy column to fill the table width
		if (!bFixedTable && oTable._hasOnlyFixColumnWidths() && aCols.length > 0) {
			rm.write("<th></th>");
		}

		rm.write("</tr>");
		rm.write("</thead>");

		rm.write("<tbody>");

		var aVisibleColumns = oTable._getVisibleColumns();
		var bHasOnlyFixedColumns = oTable._hasOnlyFixColumnWidths();
		
		// render the table rows
		var aRows = oTable.getRows();
		// retrieve tooltip and aria texts only once and pass them to the rows _updateSelection function
		var mTooltipTexts = oTable._getAriaTextsForSelectionMode(true);

		// check whether the row can be clicked to change the selection
		var bSelectOnCellsAllowed = oTable._getSelectOnCellsAllowed();
		for (var row = iStartRow, count = iEndRow; row < count; row++) {
			this.renderTableRow(rm, oTable, aRows[row], row, bFixedTable, iStartColumn, iEndColumn, false, aVisibleColumns, bHasOnlyFixedColumns, mTooltipTexts, bSelectOnCellsAllowed);
		}

		rm.write("</tbody>");
		rm.write("</table>");
	};

	TableRenderer.getAriaAttributesForRowTr = function(oTable, iRowIndex, aCells) {
		var mAriaAttributes = {};

		mAriaAttributes["role"] = {value: "row"};

		if (oTable.getSelectionMode() !== sap.ui.table.SelectionMode.None) {
			mAriaAttributes["aria-selected"] = {value: "false"};
		}

		return mAriaAttributes;
	};

	TableRenderer.getAriaAttributesForRowTd = function(oTable, oRow, iRowIndex, aCells) {
		var mAriaAttributes = {};

		if (oTable.getSelectionMode() !== sap.ui.table.SelectionMode.None &&
			oTable.getSelectionBehavior() !== sap.ui.table.SelectionBehavior.RowOnly) {
			mAriaAttributes["role"] = {value: "rowheader"};
		} else {
			if (aCells.length === 0) {
				mAriaAttributes["role"] = {value: "gridcell"};
			}
		}

		mAriaAttributes["headers"] = {value: oTable.getId() + "_colsel"};
		mAriaAttributes["aria-owns"] = {value: oTable.getId() + "-rowsel" + iRowIndex};
		mAriaAttributes["role"] = {value: "rowheader"};

		if (oTable.getSelectionMode() !== sap.ui.table.SelectionMode.None) {
			mAriaAttributes["aria-selected"] = {value: "false"};
		}

		return mAriaAttributes;
	};

	TableRenderer.renderTableRow = function(rm, oTable, oRow, iRowIndex, bFixedTable, iStartColumn, iEndColumn, bFixedRow, aVisibleColumns, bHasOnlyFixedColumns, mTooltipTexts, bSelectOnCellsAllowed) {

		rm.write("<tr");
		rm.addClass("sapUiTableTr");
		if (bFixedTable) {
			rm.writeAttribute("id", oRow.getId() + "-fixed");
		} else {
			rm.writeElementData(oRow);
		}
		if (oRow._bHidden) {
			rm.addClass("sapUiTableRowHidden");
		}
		if (iRowIndex % 2 === 0) {
			rm.addClass("sapUiTableRowEven");
		} else {
			rm.addClass("sapUiTableRowOdd");
		}
		rm.writeClasses();
		rm.writeAttribute("data-sap-ui-rowindex", iRowIndex);
		if (oTable.getRowHeight() > 0) {
			rm.addStyle("height", oTable.getRowHeight() + "px");
		}
		rm.writeStyles();

		var mAriaAttributes = this.getAriaAttributesForRowTr(oTable);
		this.renderAriaAttributes(rm, mAriaAttributes, oTable._bAccMode);

		rm.write(">");
		var aCells = oRow.getCells();
		// render the row headers
		if ((oTable.getSelectionMode() !== sap.ui.table.SelectionMode.None &&
			oTable.getSelectionBehavior() !== sap.ui.table.SelectionBehavior.RowOnly) ||
			aCells.length === 0) {
			rm.write("<td");
			var mAriaAttributes = this.getAriaAttributesForRowTd(oTable, oRow, iRowIndex, aCells);
			this.renderAriaAttributes(rm, mAriaAttributes, oTable._bAccMode);

			rm.write(">");
			if (oTable._bAccMode) {
				rm.write("<div");
				rm.writeAttribute("id", oRow.getId() + "-rowselecttext");
				rm.addClass("sapUiTableAriaRowSel");
				rm.writeClasses();
				rm.write(">");
				rm.write("</div>");
			}
			rm.write("</td>");
		}
		
		for (var cell = 0, count = aCells.length; cell < count; cell++) {
			this.renderTableCell(rm, oTable, oRow, aCells[cell], cell, bFixedTable, iStartColumn, iEndColumn, aVisibleColumns);
		}
		if (!bFixedTable && bHasOnlyFixedColumns && aCells.length > 0) {
			rm.write("<td></td>");
		}
		rm.write("</tr>");

		// because property changes of the table lead to re-rendering but the selection state might
		// remain, it's required to update tooltips and aria description according to the selection.
		// delay this call to make sure it happens when the DOM is rendered. Otherwise some elements
		// might not be rendered yet.
		jQuery.sap.delayedCall(0, this, function() {
			oRow._updateSelection(oTable, mTooltipTexts, bSelectOnCellsAllowed);
		});

	};

	TableRenderer.getAriaAttributesForCell = function(oTable, bFixedTable, oRow, oColumn, iColIndex, oCell) {
		var mAriaAttributes = {};

		mAriaAttributes["headers"] = {value: oTable.getId() + "_col" + iColIndex};
		mAriaAttributes["role"] = {value: "gridcell"};

		var sRowSelectorId = oTable.getId() + "-rownumberofrows";


		var aMultiLabels = oColumn.getMultiLabels();
		var iMultiLabels = aMultiLabels.length;
		var sLabels = "";

		// get IDs of column labels
		if (oTable.getColumnHeaderVisible()) {
			var sColumnId = oColumn.getId();
			// first column header has no suffix, just the column ID
			sLabels = sColumnId;
			if (iMultiLabels > 1) {
				for (var i = 1; i < iMultiLabels; i++) {
					// for all other column header rows we add the suffix
					sLabels += " " + sColumnId + "_" + i;
				}
			}
		} else {
			// column header is not rendered therfore there is no <div> tag. Link aria description to label
			var oLabel;
			if (iMultiLabels == 0) {
				oLabel = oColumn.getLabel();
				if (oLabel) {
					sLabels = oLabel.getId();
				}
			} else {
				for (var i = 0; i < iMultiLabels; i++) {
					// for all other column header rows we add the suffix
					oLabel = aMultiLabels[i];
					if (oLabel) {
						sLabels += " " + oLabel.getId() + " ";
					}
				}
			}
		}


		var sLabelledBy = sRowSelectorId + " " + oTable.getId() + "-ariadesc " + sLabels;

		sLabelledBy +=  " " + oCell.getId();

		var sDescribedBy = "";
		if (bFixedTable) {
			sLabelledBy += " " + oTable.getId() + "-ariafixedcolumn";
		}

		mAriaAttributes["aria-labelledby"] = {value: sLabelledBy};
		mAriaAttributes["aria-describedby"] = {value: oTable.getId() + "-toggleedit" + sDescribedBy};

		if (oTable.getSelectionMode() !== sap.ui.table.SelectionMode.None) {
			mAriaAttributes["aria-selected"] = {value: "false"};
		}


		return mAriaAttributes;
	};

	TableRenderer.renderTableCell = function(rm, oTable, oRow, oCell, iCellIndex, bFixedTable, iStartColumn, iEndColumn, aVisibleColumns) {
		var iColIndex = oCell.data("sap-ui-colindex");
		var oColumn = oTable.getColumns()[iColIndex];
		if (oColumn.shouldRender() && iStartColumn <= iColIndex && iEndColumn > iColIndex) {
			rm.write("<td");
			var sId = oRow.getId() + "-col" + iCellIndex;
			rm.writeAttribute("id", sId);
			rm.writeAttribute("tabindex", "-1");

			var mAriaAttributes = this.getAriaAttributesForCell(oTable, bFixedTable, oRow, oColumn, iColIndex, oCell);
			this.renderAriaAttributes(rm, mAriaAttributes, oTable._bAccMode);

			var sHAlign = this.getHAlign(oColumn.getHAlign(), oTable._bRtlMode);
			if (sHAlign) {
				rm.addStyle("text-align", sHAlign);
			}
			rm.writeStyles();
			if (aVisibleColumns.length > 0 && aVisibleColumns[0] === oColumn) {
				rm.addClass("sapUiTableTdFirst");
			}
			// grouping support to show/hide values of grouped columns
			if (oColumn.getGrouped()) {
				rm.addClass("sapUiTableTdGroup");
			}
			rm.writeClasses();
			rm.write("><div");
			rm.addClass("sapUiTableCell");
			
			rm.writeClasses();
			
			if (oTable.getRowHeight() && oTable.getVisibleRowCountMode() == sap.ui.table.VisibleRowCountMode.Auto) {
				rm.addStyle("max-height", oTable.getRowHeight() + "px");
			}
			rm.writeStyles();
			
			rm.write(">");
			this.renderTableCellControl(rm, oTable, oCell, iCellIndex);
			rm.write("</div></td>");
		}
	};

	TableRenderer.renderTableCellControl = function(rm, oTable, oCell, iCellIndex) {
		rm.renderControl(oCell);
	};

	TableRenderer.renderVSb = function(rm, oTable) {
		rm.write("<div");
		rm.addClass("sapUiTableVSb");
		rm.writeClasses();
		rm.write(">");
		rm.renderControl(oTable._oVSb);
		rm.write("</div>");
	};

	TableRenderer.renderHSb = function(rm, oTable) {
		rm.write("<div");
		rm.addClass("sapUiTableHSb");
		rm.writeClasses();
		rm.write(">");
		rm.renderControl(oTable._oHSb);
		rm.write("</div>");
	};


	// =============================================================================
	// HELPER FUNCTIONALITY
	// =============================================================================

	/**
	 * Returns the value for the HTML "align" attribute according to the given
	 * horizontal alignment and RTL mode, or NULL if the HTML default is fine.
	 *
	 * @param {sap.ui.core.HorizontalAlign} oHAlign
	 * @param {boolean} bRTL
	 * @type string
	 */
	TableRenderer.getHAlign = function(oHAlign, bRTL) {
	  switch (oHAlign) {
		case sap.ui.core.HorizontalAlign.Center:
		  return "center";
		case sap.ui.core.HorizontalAlign.End:
		case sap.ui.core.HorizontalAlign.Right:
		  return bRTL ? "left" : "right";
	  }
	  // case sap.ui.core.HorizontalAlign.Left:
	  // case sap.ui.core.HorizontalAlign.Begin:
	  return bRTL ? "right" : "left";
	};


	return TableRenderer;

}, /* bExport= */ true);
