/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides default renderer for control sap.ui.commons.RowRepeater
sap.ui.define(['jquery.sap.global', './Button', './Paginator', './Toolbar'],
	function(jQuery, Button, Paginator, Toolbar) {
	"use strict";


	/**
	 * RowRepeater renderer.
	 * @namespace
	 */
	var RowRepeaterRenderer = {
	};
	
	
	/**
	 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} oRenderManager the RenderManager that can be used for writing to the Render-Output-Buffer
	 * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
	 */
	RowRepeaterRenderer.render = function(oRenderManager, oControl){
		// opening root DIV
		oRenderManager.write("<div");
		oRenderManager.writeControlData(oControl);
		// add design CSS class: sapUiRrDesignStandard/sapUiRrDesignTransparent/sapUiRrDesignBareShell
		oRenderManager.addClass("sapUiRrDesign" + oControl.getDesign() );
		oRenderManager.writeClasses();
		oRenderManager.write(">");
	
		// render the row repeater header (not in BARESHELL design)
		if ( oControl.getDesign() !== sap.ui.commons.RowRepeaterDesign.BareShell) {
			this.renderHeader(oRenderManager, oControl);
		}
	
		// render the row repeater body
		this.renderBody(oRenderManager, oControl);
	
		// render the row repeater footer (not in BARESHELL design)
		if ( oControl.getDesign() !== sap.ui.commons.RowRepeaterDesign.BareShell) {
			this.renderFooter(oRenderManager, oControl);
		}
	
		// closing root DIV
		oRenderManager.write("</div>");
	
	};
	
	
	RowRepeaterRenderer.renderHeader = function(oRenderManager, oControl) {
	
		// render the primary toolbar
		this.renderPrimaryToolbar(oRenderManager, oControl);
	
		// render the secondary toolbar only if more than one sorter is defined
		if (oControl.getSorters().length > 1 && oControl.isBound()) {
			this.renderSecondaryToolbar(oRenderManager, oControl);
		}
	
	
	};
	
	
	RowRepeaterRenderer.renderPrimaryToolbar = function(oRenderManager, oControl) {
	
		// opening primary toolbar DIV
		oRenderManager.write("<div");
		oRenderManager.addClass("sapUiRrPtb");
		oRenderManager.writeClasses();
		oRenderManager.write(">");
	
		// render a title if the title aggregation is provided
		if (oControl.getTitle() !== null) {
			this.renderTitle(oRenderManager, oControl);
		}
	
		// render the buttons of the filter
		this.renderFilterToolbar(oRenderManager, oControl);
	
		// always render the controller that displays either pager or show more
		this.renderController(oRenderManager, oControl);
	
		// closing primary toolbar DIV
		oRenderManager.write("</div>");
	
	};
	
	
	RowRepeaterRenderer.renderTitle = function(oRenderManager, oControl) {
	
		// local variables
		var oTitle = oControl.getTitle();
		var sTooltip = oTitle.getTooltip_AsString();
	
	//BACKUP FOR LOGO AND TITLE IN A SINGLE SHARED DIV:
	//	// opening title DIV
	//	oRenderManager.write("<div");
	//	oRenderManager.addClass("sapUiRrTitle");
	//	oRenderManager.writeClasses();
	//	if(sTooltip!==undefined) {
	//		oRenderManager.writeAttributeEscaped("title", sTooltip);
	//	}
	//	oRenderManager.write(">");
	//
	//	// render the icon if it is defined
	//	if(oTitle.getIcon()!==null) {
	//		oRenderManager.write("<img");
	//		oRenderManager.writeAttributeEscaped("src", oTitle.getIcon());
	//		oRenderManager.write("/>");
	//	}
	//
	//	// render the text if provided
	//	if(oTitle.getText()!==null) {
	//		oRenderManager.writeEscaped(oTitle.getText());
	//	}
	//
	//	// closing title DIV
	//	oRenderManager.write("</div>");
	
	
	//LOGO AND TITLE IN 2 SEPARATE DIVs:
		// render the icon if it is defined
		if (oTitle.getIcon()) {
			// opening logo DIV
			oRenderManager.write("<div");
			oRenderManager.addClass("sapUiRrLogo");
			oRenderManager.writeClasses();
			if (sTooltip !== undefined) {
				oRenderManager.writeAttributeEscaped("title", sTooltip);
			}
			oRenderManager.write(">");
	
			if (oTitle.getIcon()) {
				oRenderManager.write("<img");
				oRenderManager.writeAttributeEscaped("src", oTitle.getIcon());
				oRenderManager.write("/>");
			}
			// closing DIV
			oRenderManager.write("</div>");
		}
	
		// render the text if provided
		if (oTitle.getText()) {
			// opening title DIV
			oRenderManager.write("<div");
			oRenderManager.addClass("sapUiRrTitle");
			oRenderManager.writeClasses();
			oRenderManager.writeAttribute("role", "heading");
			oRenderManager.write(">");
	
			oRenderManager.writeEscaped(oTitle.getText());
	
			// closing DIV
			oRenderManager.write("</div>");
		}
	
	
	
	};
	
	
	RowRepeaterRenderer.renderFilterToolbar = function(oRenderManager, oControl) {
	
		// local variables
		var aFilters = oControl.getFilters();
		if (aFilters.length > 0) {
			// opening filter toolbar DIV
			oRenderManager.write("<div");
			oRenderManager.addClass("sapUiRrFilters");
			oRenderManager.writeClasses();
			oRenderManager.write(">");
		
			// don't render any content if there is not minimum 2 filters OR
			// if the row repeater is not bound
			if (aFilters.length > 1 && oControl.isBound()) {
				oRenderManager.renderControl(oControl.getAggregation("filterToolbar"));
			}
		
			// closing filter toolbar DIV
			oRenderManager.write("</div>");
		}
	};
	
	
	RowRepeaterRenderer.renderController = function(oRenderManager, oControl) {
	
		if (!oControl.bPagingMode) {
			// opening controller DIV
			oRenderManager.write("<div");
			oRenderManager.addClass("sapUiRrCtrl");
			oRenderManager.writeClasses();
			oRenderManager.write(">");
		
			// render "show more" button or pager depending on pager mode flag
			
				oRenderManager.renderControl(oControl.getAggregation("headerShowMoreButton"));
			
			// closing controller DIV
			oRenderManager.write("</div>");
		}
	};
	
	
	RowRepeaterRenderer.renderSecondaryToolbar = function(oRenderManager, oControl) {
	
		// opening secondary toolbar DIV
		oRenderManager.write("<div");
		oRenderManager.addClass("sapUiRrStb");
		oRenderManager.writeClasses();
		oRenderManager.write(">");
	
		// render the "Sort By:" text
		oRenderManager.write("<div");
		oRenderManager.addClass("sapUiRrSortBy");
		oRenderManager.writeClasses();
		oRenderManager.write(">");
		oRenderManager.writeEscaped(oControl.oResourceBundle.getText("SORT_BY") + ":");
		oRenderManager.write("</div>");
	
		// begin of sorter toolbar wrapping DIV
		oRenderManager.write("<div");
		oRenderManager.addClass("sapUiRrSorters");
		oRenderManager.writeClasses();
		oRenderManager.write(">");
	
		// render the toolbar
		oRenderManager.renderControl(oControl.getAggregation("sorterToolbar"));
	
		// end of sorter toolbar wrapping DIV
		oRenderManager.write("</div>");
	
		// closing secondary toolbar DIV
		oRenderManager.write("</div>");
	
	};
	
	
	RowRepeaterRenderer.renderBody = function(oRenderManager, oControl) {
	
		// variables
		var sId = oControl.getId();
		var iShowMoreSteps = oControl.getShowMoreSteps();
		var iCurrentPage = oControl.getCurrentPage();
		var iNumberOfRows = oControl.getNumberOfRows();
		var iStartIndex = (iCurrentPage - 1) * iNumberOfRows;
		var aRows = oControl.getRows();
		var iRowCount = oControl._getRowCount();
		var iMaxRows = iRowCount - iStartIndex;
		var iCurrentVisibleRows = oControl._getRowCount() > iNumberOfRows ? iNumberOfRows : iMaxRows;
		var iLastPage = Math.ceil(iRowCount / iNumberOfRows);
		var iCurrentRow;
	
		// make sure only to render the max visible rows (not to render pseudo rows)
		iCurrentVisibleRows = Math.min(iCurrentVisibleRows, iMaxRows);
	
		// in the show more mode we always start with the first row
		if (iShowMoreSteps > 0) {
			iStartIndex = 0;
		}
	
		// opening body DIV
		oRenderManager.write("<div");
		oRenderManager.writeAttribute("id", sId + "-body");
		oRenderManager.addClass("sapUiRrBody");
		oRenderManager.writeClasses();
		oRenderManager.write(">");
	
		// opening UL for current page
		oRenderManager.write("<ul");
		oRenderManager.writeAttribute("id", sId + "-page_" + iCurrentPage);
		oRenderManager.addClass("sapUiRrPage");
		oRenderManager.writeClasses();
		oRenderManager.write(">");
	
		// we display a text, if the length of aggregation rows is 0 or we are past the last page
		if (aRows.length === 0 || iLastPage < iCurrentPage) {
	
			// render a "No Data" LI with custom control or default text
				oRenderManager.write("<li");
				oRenderManager.addClass("sapUiRrNoData");
				oRenderManager.writeClasses();
				oRenderManager.write(">");
				var oNoData = oControl.getNoData();
				if (oNoData) {
					oRenderManager.renderControl(oNoData);
				} else {
					oRenderManager.writeEscaped(oControl.oResourceBundle.getText("NO_DATA"));
				}
				oRenderManager.write("</li>");
	
		} else {
	
			// create additional LI style if row height is fixed
			var sRowHeightStyle;
			if ( oControl.getFixedRowHeight() !== "" ) {
				sRowHeightStyle = "height:" + oControl.getFixedRowHeight() + ";overflow:hidden;";
			}
	
			// loop over all rows visible on current page
			if (oControl.getBinding("rows")) {
				iStartIndex = oControl._bSecondPage ? iNumberOfRows : 0;
			}
			for ( iCurrentRow = iStartIndex; iCurrentRow < iStartIndex + iCurrentVisibleRows; iCurrentRow++ ) {
	
				// open the LI wrapping each row
				oRenderManager.write("<li");
				oRenderManager.writeAttribute("id", sId + "-row_" + iCurrentRow);
				if (sRowHeightStyle) {
					oRenderManager.writeAttribute("style", sRowHeightStyle);
				}
				oRenderManager.addClass("sapUiRrRow");
				oRenderManager.writeClasses();
				oRenderManager.write(">");
	
				// render the nested control
				oRenderManager.renderControl(aRows[iCurrentRow]);
	
				// close the wrapping LI
				oRenderManager.write("</li>");
	
			}
	
		}
	
		// closing page UL
		oRenderManager.write("</ul>");
	
		// closing body DIV
		oRenderManager.write("</div>");
	
	};
	
	
	RowRepeaterRenderer.renderFooter = function(oRenderManager, oControl) {
	
		// opening footer DIV
		oRenderManager.write("<div");
		oRenderManager.addClass("sapUiRrFtr");
		oRenderManager.writeClasses();
		oRenderManager.write(">");
	
		// render "show more" button or pager depending on pager mode flag
		if (oControl.bPagingMode) {
			oRenderManager.renderControl(oControl.getAggregation("footerPager"));
		} else {
			oRenderManager.renderControl(oControl.getAggregation("footerShowMoreButton"));
		}
	
		// closing footer DIV
		oRenderManager.write("</div>");
	
	};
	

	return RowRepeaterRenderer;

}, /* bExport= */ true);
