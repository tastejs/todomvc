/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(['jquery.sap.global', 'sap/ui/core/Renderer', './ListBaseRenderer'],
	function(jQuery, Renderer, ListBaseRenderer) {
	"use strict";


	/**
	 * List renderer.
	 * @namespace
	 *
	 * TableRenderer extends the ListBaseRenderer
	 */
	var TableRenderer = Renderer.extend(ListBaseRenderer);
	
	
	/**
	 * Renders the Header and/or Footer of the Table like List Control
	 *
	 * @param {sap.ui.core.RenderManager} rm RenderManager
	 * @param {sap.m.ListBase} oTable Table control
	 * @param {String} type Whether "Head" or "Foot"
	 */
	TableRenderer.renderColumns = function(rm, oTable, type) {
		var index = 0,
			hiddens = 0,
			hasPopin = false,
			hasFooter = false,
			mode = oTable.getMode(),
			iModeOrder = ListBaseRenderer.ModeOrder[mode],
			clsPrefix = "sapMListTbl",
			idPrefix = oTable.getId("tbl"),
			cellTag = (type == "Head") ? "th" : "td",
			cellRole = (type == "Head") ? "columnheader" : "gridcell",
			groupTag = "t" + type.toLowerCase(),
			aColumns = oTable.getColumns(),
			isHeaderHidden = (type == "Head") && aColumns.every(function(oColumn) {
				return	!oColumn.getHeader() || 
						!oColumn.getHeader().getVisible() ||
						!oColumn.getVisible() ||
						oColumn.isPopin() ||
						oColumn.isNeverVisible() ||
						oColumn.isHidden();
			}),
			hasOneHeader = (type == "Head") && aColumns.filter(function(oColumn) {
				return	oColumn.getVisible() &&
						!oColumn.isPopin() &&
						!oColumn.isNeverVisible() &&
						!oColumn.isHidden();
			}).length == 1,
			createBlankCell = function(cls, id, bAriaHidden) {
				rm.write("<");
				rm.write(cellTag);
				rm.writeAttribute("role", cellRole);
				bAriaHidden && rm.writeAttribute("aria-hidden", "true");
				id && rm.writeAttribute("id", idPrefix + id);
				rm.addClass(clsPrefix + cls);
				rm.writeClasses();
				rm.write("></");
				rm.write(cellTag);
				rm.write(">");
				index++;
			};
	
		rm.write("<" + groupTag + ">");
		rm.write("<tr");
		rm.writeAttribute("tabindex", -1);
		rm.writeAttribute("role", "row");
		rm.writeAttribute("id", oTable.addNavSection(idPrefix + type + "er" ));
	
		if (isHeaderHidden) {
			rm.addClass("sapMListTblHeaderNone");
		} else {
			rm.addClass("sapMListTblRow sapMListTbl" + type + "er");
		}
	
		rm.writeClasses();
		rm.write(">");
	
		if (iModeOrder == -1) {
			if (mode == "MultiSelect" && type == "Head" && !isHeaderHidden) {
				rm.write("<th role='columnheader' class='" + clsPrefix + "SelCol'>");
				rm.write("<div class='sapMLIBSelectM'>");
				rm.renderControl(oTable._getSelectAllCheckbox());
				rm.write("</div></th>");
				index++;
			} else {
				createBlankCell("SelCol");
			}
		}
	
		aColumns.forEach(function(oColumn, order) {
			oColumn.setIndex(-1);
			oColumn.setInitialOrder(order);
		});
	
		oTable.getColumns(true).forEach(function(oColumn, order) {
			if (!oColumn.getVisible()) {
				return;
			}
			if (oColumn.isPopin()) {
				hasPopin = true;
				return;
			}
			if (oColumn.isNeverVisible()) {
				return;
			}
			if (oColumn.isHidden()) {
				hiddens++;
			}
	
			var control = oColumn["get" + type + "er"](),
				width = hasOneHeader ? "" : oColumn.getWidth(),
				cls = oColumn.getStyleClass(true),
				align = oColumn.getCssAlign();
	
			rm.write("<" + cellTag);
			cls && rm.addClass(jQuery.sap.encodeHTML(cls));
			rm.addClass(clsPrefix + "Cell");
			rm.addClass(clsPrefix + type + "erCell");
			rm.writeAttribute("id", idPrefix + type + index);
			rm.writeAttribute("data-sap-width", oColumn.getWidth());
			rm.writeAttribute("role", cellRole);
			width && rm.addStyle("width", width);
			
			if (align) {
				rm.addStyle("text-align", align);
			}
			
			rm.writeClasses();
			rm.writeStyles();
			rm.write(">");
			if (control) {
				oColumn.applyAlignTo(control);
				rm.renderControl(control);
			}
			if (type == "Head" && !hasFooter) {
				hasFooter = !!oColumn.getFooter();
			}
			rm.write("</" + cellTag + ">");
			oColumn.setIndex(index++);
		});
	
		createBlankCell("NavCol", type + "Nav", !oTable._iItemNeedsColumn);
	
		if (iModeOrder == 1) {
			createBlankCell("SelCol");
		}
	
		rm.write("</tr></" + groupTag + ">");
	
		if (type == "Head") {
			oTable._hasPopin = hasPopin;
			oTable._colCount = index - hiddens;
			oTable._hasFooter = hasFooter;
			oTable._headerHidden = isHeaderHidden;
		}
	};
	
	
	/**
	 * add table container class name
	 */
	TableRenderer.renderContainerAttributes = function(rm, oControl) {
		rm.addClass("sapMListTblCnt");
	};
	
	/**
	 * render table tag and add required classes
	 */
	TableRenderer.renderListStartAttributes = function(rm, oControl) {
		rm.write("<table");
		rm.addClass("sapMListTbl");
		if (oControl.getFixedLayout() === false) {
			rm.addStyle("table-layout", "auto");
		}
		
		// make the type column visible if needed
		if (oControl._iItemNeedsColumn) {
			rm.addClass("sapMListTblHasNav");
		}
	};
	
	/**
	 * returns aria accessibility role
	 */
	TableRenderer.getAriaRole = function(oControl) {
		return "grid";
	};
	
	/**
	 * generate table columns
	 */
	TableRenderer.renderListHeadAttributes = function(rm, oControl) {
		this.renderColumns(rm, oControl, "Head");
		rm.write("<tbody");
		rm.writeAttribute("id", oControl.addNavSection(oControl.getId("tblBody")));
		rm.write(">");
	};
	
	/**
	 * render footer and finish rendering table
	 */
	TableRenderer.renderListEndAttributes = function(rm, oControl) {
		rm.write("</tbody>");	// items should be rendered before foot
		oControl._hasFooter && this.renderColumns(rm, oControl, "Foot");
		rm.write("</table>");
	};
	
	/**
	 * render no data
	 */
	TableRenderer.renderNoData = function(rm, oControl) {
		rm.write("<tr");
		rm.writeAttribute("role", "row");
		rm.writeAttribute("tabindex", "-1");
		rm.writeAttribute("id", oControl.getId("nodata"));
		rm.addClass("sapMLIB sapMListTblRow sapMLIBTypeInactive");
		if (!oControl._headerHidden || (!oControl.getHeaderText() && !oControl.getHeaderToolbar())) {
			rm.addClass("sapMLIBShowSeparator");
		}
		rm.writeClasses();
		rm.write(">");
		
		rm.write("<td");
		rm.writeAttribute("role", "gridcell");
		rm.writeAttribute("id", oControl.getId("nodata-text"));
		rm.writeAttribute("colspan", oControl.getColCount());
		rm.addClass("sapMListTblCell sapMListTblCellNoData");
		rm.writeClasses();
		rm.write(">");
		rm.writeEscaped(oControl.getNoDataText(true));
		rm.write("</td>");
		
		rm.write("</tr>");
	};

	return TableRenderer;

}, /* bExport= */ true);
