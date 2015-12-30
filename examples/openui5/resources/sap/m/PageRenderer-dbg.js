/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(['jquery.sap.global'],
	function(jQuery) {
	"use strict";


	/**
	 * Page renderer.
	 * @namespace
	 */
	var PageRenderer = {};
	
	/**
	 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} rm the RenderManager that can be used for writing to the Render-Output-Buffer
	 * @param {sap.ui.core.Control} oPage an object representation of the control that should be rendered
	 */
	PageRenderer.render = function(rm, oPage) {
		var oHeader = null,
			oFooter = null,
			oSubHeader = null,
			sEnableScrolling = oPage.getEnableScrolling() ? " sapMPageScrollEnabled" : "";
	
		if (oPage.getShowHeader()) {
			oHeader = oPage._getAnyHeader();
		}
	
		if (oPage.getShowSubHeader()) {
			oSubHeader = oPage.getSubHeader();
		}
	
		if (oPage.getShowFooter()) {
			oFooter = oPage.getFooter();
		}
		rm.write("<div");
		rm.writeControlData(oPage);
		rm.addClass("sapMPage");
	
		rm.addClass("sapMPageBg" + oPage.getBackgroundDesign());
	
		if (oHeader) {
			rm.addClass("sapMPageWithHeader");
		}
	
		if (oSubHeader) {
			rm.addClass("sapMPageWithSubHeader");
		}
	
		if (oFooter) {
			// it is used in the PopOver to remove additional margin bottom for page with footer
			rm.addClass("sapMPageWithFooter");
		}
		
		if (!oPage.getContentOnlyBusy()) {
			rm.addClass("sapMPageBusyCoversAll");
		}
	
		rm.writeClasses();
	
		var sTooltip = oPage.getTooltip_AsString();
	
		if (sTooltip) {
			rm.writeAttributeEscaped("title", sTooltip);
		}
	
		rm.write(">");
	
		//render headers
		this.renderBarControl(rm, oHeader, {
			context : "header",
			styleClass : "sapMPageHeader"
		});
	
		this.renderBarControl(rm, oSubHeader, {
			context : "subheader",
			styleClass : "sapMPageSubHeader"
		});
	
		// render child controls
		rm.write('<section id="' + oPage.getId() + '-cont">');
		
		if (oPage._bUseScrollDiv) { // fallback to old rendering
			rm.write('<div id="' + oPage.getId() + '-scroll" class="sapMPageScroll' + sEnableScrolling + '">');
		}
	
		var aContent = oPage.getContent();
		var l = aContent.length;
	
		for (var i = 0; i < l; i++) {
			rm.renderControl(aContent[i]);
		}
	
		if (oPage._bUseScrollDiv) { // fallback to old rendering
			rm.write("</div>");
		}
	
		rm.write("</section>");
	
		// render footer Element
		this.renderBarControl(rm, oFooter, {
			context : "footer",
			styleClass : "sapMPageFooter"
		});
	
		rm.write("</div>");
	};
	
	/**
	 * Renders the bar control if it is defined. Also adds classes to it.
	 * 
	 * @param {sap.ui.core.RenderManager} rm the RenderManager that can be used for writing to the Render-Output-Buffer
	 * @param {sap.m.IBar} oBarControl the RenderManager that can be used for writing to the Render-Output-Buffer
	 * @param {object} oOptions object containing the tag, contextClass and styleClass added to the bar
	 */
	PageRenderer.renderBarControl = function (rm, oBarControl, oOptions) {
		if (!oBarControl) {
			return;
		}
	
		oBarControl.applyTagAndContextClassFor(oOptions.context);
	
		oBarControl.addStyleClass(oOptions.styleClass);
	
		rm.renderControl(oBarControl);
	};

	return PageRenderer;

}, /* bExport= */ true);
