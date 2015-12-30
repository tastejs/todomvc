/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

//Provides default renderer for control sap.ui.commons.Paginator
sap.ui.define(['jquery.sap.global', 'jquery.sap.encoder'],
	function(jQuery/* , jQuerySap */) {
	"use strict";


	/**
	 * Paginator renderer.
	 * @namespace
	 */
	var PaginatorRenderer = {};
	
	/**
	 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
	 * @param {sap.ui.core.RenderManager} oRm the RenderManager that can be used for writing to the Render-Output-Buffer
	 * @param {sap.ui.core.Control} oPaginator an object representation of the control that should be rendered
	 */
	PaginatorRenderer.render = function(oRm, oPaginator){
	
		var rb = sap.ui.getCore().getLibraryResourceBundle("sap.ui.commons");
	
		oRm.write("<div");
		oRm.writeControlData(oPaginator);
		oRm.writeAccessibilityState(oPaginator, {
			role: "toolbar",
			labelledby: oPaginator.getId() + "-accDesc"
		});
		oRm.addClass("sapUiPag");
		oRm.writeClasses();
		oRm.write(">");
	
		oRm.write("<span class='sapUiPagAccDesc' id='" + oPaginator.getId() + "-accDesc'>");
		oRm.writeEscaped(rb.getText("PAGINATOR"));
		oRm.write("</span>");
	
		this.renderPaginator(oRm, oPaginator);
	
		oRm.write("</div>");
	};
	
	
	/**
	 * Builds the paginator
	 * @param {sap.ui.core.RenderManager} oRm the RenderManager that can be used for writing to the Render-Output-Buffer
	 * @param {sap.ui.core.Control} oPaginator an object representation of the control that should be rendered
	 */
	PaginatorRenderer.renderPaginator = function(oRm, oPaginator) {
		// First check if number of page is 1 or less, in this case, we do not render the paginator
		if (oPaginator.getNumberOfPages() <= 1) {
			return;
		}
	
		// Buffer paginator id for other ids concatenation
		var paginatorId = oPaginator.getId();
		var iCurrentPage = oPaginator.getCurrentPage();
		var rb = sap.ui.getCore().getLibraryResourceBundle("sap.ui.commons");
	
	
		/************************************************************************************
		 * Render the Page 1 (first page link) when necessary, back arrow, back link
		 ************************************************************************************/
		var linkClass = (iCurrentPage == 1) ? "sapUiLnkDsbl" : "sapUiLnk";
		var linkAcc = (iCurrentPage == 1) ? " aria-disabled='true'" : "";
	
		// First page link must only appear when at least 5 pages are available
		if (oPaginator.getNumberOfPages() > 5) {
			oRm.write("<a id='" + paginatorId + "--firstPageLink' href='javascript:void(0);' title='");
			oRm.writeEscaped(rb.getText("FIRST_PAGE"));
			oRm.write("' class='sapUiPagBtn sapUiPagFirst " + linkClass + "' " + linkAcc + "><span class='sapUiPagText'>");
			oRm.writeEscaped(rb.getText("PAGINATOR_OTHER_PAGE", [1]));
			oRm.write("</span></a>");
		}
		oRm.write("<a id='" + paginatorId + "--backLink' href='javascript:void(0);' title='");
		oRm.writeEscaped(rb.getText("PREVIOUS_PAGE"));
		oRm.write("' class='sapUiPagBtn sapUiPagBack " + linkClass + "' " + linkAcc + "><span class='sapUiPagText'>");
		oRm.writeEscaped(rb.getText("BACK"));
		oRm.write("</span></a>");
	
	
	
		/************************************************************************************
		 * Render the page numbers in a list
		 *************************************************************************************/
		oRm.write("<ul id='" + paginatorId + "-pages' role='presentation'>");
		oRm.write(PaginatorRenderer.getPagesHtml(paginatorId, oPaginator._calculatePagesRange(), oPaginator.getCurrentPage(), true));
		oRm.write("</ul>");
	
	
	
		/************************************************************************************
		 * Render the forward link, forward arrow and last page link when necessary
		 *************************************************************************************/
		linkClass = (iCurrentPage == oPaginator.getNumberOfPages()) ? "sapUiLnkDsbl" : "sapUiLnk";
		linkAcc = (iCurrentPage == 1) ? " aria-disabled='true'" : "";
	
		oRm.write("<a id='" + paginatorId + "--forwardLink' href='javascript:void(0);' title='");
		oRm.writeEscaped(rb.getText("NEXT_PAGE"));
		oRm.write("' class='sapUiPagBtn sapUiPagForward " + linkClass + "' " + linkAcc + "><span class='sapUiPagText'>");
		oRm.writeEscaped(rb.getText("FORWARD"));
		oRm.write("</span></a>");
		if (oPaginator.getNumberOfPages() > 5) {
			oRm.write("<a id='" + paginatorId + "--lastPageLink' href='javascript:void(0);' title='");
			oRm.writeEscaped(rb.getText("LAST_PAGE"));
			oRm.write("' class='sapUiPagBtn sapUiPagLast " + linkClass + "' " + linkAcc + "><span class='sapUiPagText'>");
			oRm.writeEscaped(rb.getText("PAGINATOR_OTHER_PAGE", [oPaginator.getNumberOfPages()]));
			oRm.write("</span></a>");
		}
	};
	
	
	PaginatorRenderer.getPagesHtml = function(sPaginatorId, oRange, iCurrent, bVisible) {
		var aHtml = [];
		var rb = sap.ui.getCore().getLibraryResourceBundle("sap.ui.commons");
	
		// each single page link is an <li> with an <a> inside
		for (var i = oRange.firstPage; i <= oRange.lastPage; i++) {
			aHtml.push("<li id='" + sPaginatorId + "-li--" + i + "' class='sapUiPagPage");
			aHtml.push((i == iCurrent) ? " sapUiPagCurrentPage'" : "'");
			if (!bVisible) { // for those items to be animated into view
				aHtml.push(" style='display:none'");
			}
			aHtml.push(">");
			aHtml.push("<a id='" + sPaginatorId + "-a--" + i + "' title='");
			if (i == iCurrent) {
				aHtml.push(jQuery.sap.encodeHTML(rb.getText("PAGINATOR_CURRENT_PAGE", [i])));
			} else {
				aHtml.push(jQuery.sap.encodeHTML(rb.getText("PAGINATOR_OTHER_PAGE", [i])));
			}
			aHtml.push("' href='javascript:void(0);'");
			if (i == iCurrent) {
				aHtml.push(" tabindex='0' class='sapUiLnkDsbl'");
			} else {
				 aHtml.push(" class='sapUiLnk'");
			}
			aHtml.push(">" + i + "</a>");
			aHtml.push("</li>");
		}
	
		return aHtml.join("");
	};
	
	/**
	 * Updates the back/first/next/last page links
	 * @param {sap.ui.core.Control} oPaginator an object representation of the control that should be updated
	 * @private
	 */
	PaginatorRenderer.updateBackAndForward = function(oPaginator) {
		var page = oPaginator.getCurrentPage();
		var id = oPaginator.getId();
	
		var isFirst = (page == 1);
		var isLast = (page == oPaginator.getNumberOfPages());
	
		var firstPage = jQuery.sap.byId(id + "--firstPageLink").toggleClass("sapUiLnk", !isFirst).toggleClass("sapUiLnkDsbl", isFirst);
		var backLink = jQuery.sap.byId(id + "--backLink").toggleClass("sapUiLnk", !isFirst).toggleClass("sapUiLnkDsbl", isFirst);
		var forwardLink = jQuery.sap.byId(id + "--forwardLink").toggleClass("sapUiLnk", !isLast).toggleClass("sapUiLnkDsbl", isLast);
		var lastPage = jQuery.sap.byId(id + "--lastPageLink").toggleClass("sapUiLnk", !isLast).toggleClass("sapUiLnkDsbl", isLast);
		
		if (isFirst) {
			firstPage.attr("aria-disabled", "true");
			backLink.attr("aria-disabled", "true");
			forwardLink.removeAttr("aria-disabled");
			lastPage.removeAttr("aria-disabled");
		} else if (isLast) {
			firstPage.removeAttr("aria-disabled");
			backLink.removeAttr("aria-disabled");
			forwardLink.attr("aria-disabled", "true");
			lastPage.attr("aria-disabled", "true");
		} else {
			firstPage.removeAttr("aria-disabled");
			backLink.removeAttr("aria-disabled");
			forwardLink.removeAttr("aria-disabled");
			lastPage.removeAttr("aria-disabled");
		}
	};

	return PaginatorRenderer;

}, /* bExport= */ true);
