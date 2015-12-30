/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides default renderer for control sap.ui.commons.Panel
sap.ui.define(['jquery.sap.global'],
	function(jQuery) {
	"use strict";


	/**
	 * @namespace
	 */
	var PanelRenderer = function() {
	};
	
	
	/**
	 * Renders the HTML for the Panel, using the provided {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} oRenderManager The RenderManager that can be used for writing to the render output buffer.
	 * @param {sap.ui.core.Control} oControl An object representation of the control that should be rendered
	 */
	PanelRenderer.render = function(rm, oControl) {
		var id = oControl.getId();
		var accessibility = sap.ui.getCore().getConfiguration().getAccessibility();
	
		//var hasToolbar = false; // TODO: this can be used in the future; rendering should already be quite ok, but minor adjustments are expected
	
		var heightSet = sap.ui.commons.Panel._isSizeSet(oControl.getHeight());
		var widthSet = sap.ui.commons.Panel._isSizeSet(oControl.getWidth());
	
		oControl.getScrollTop();  // update the scroll position properties
		oControl.getScrollLeft();
	
	
		// root element and classes
		rm.write("<section");
		rm.writeControlData(oControl);
		rm.addClass("sapUiPanel");
		rm.addStyle("width", oControl.getWidth());
	
		if (!oControl.getCollapsed()) {
			rm.addStyle("height", oControl.getHeight());
		} else {
			rm.addClass("sapUiPanelColl");
			rm.addStyle("height", "auto");
		}
		if (heightSet) {
			rm.addClass("sapUiPanelHeightSet");
		}
		if (widthSet) {
			rm.addClass("sapUiPanelWidthSet");
		}
		if (oControl.getApplyContentPadding()) {
			rm.addClass("sapUiPanelWithPadding");
		}
		if (!oControl.getEnabled()) {
			rm.addClass("sapUiPanelDis");
		}
		if (oControl.getShowCollapseIcon()) {
			rm.addClass("sapUiPanelWithCollapseIcon");
		}
		rm.addClass("sapUiPanelBorderDesign" + oControl.getBorderDesign());
		rm.addClass("sapUiPanelAreaDesign" + oControl.getAreaDesign());
		rm.writeClasses();
		rm.writeStyles();
	
		if (accessibility) {
			rm.writeAttribute("aria-labelledby", id + "-title ");
			rm.writeAttribute("aria-describedby", id + "-acc");
			rm.writeAttribute("role", "region");
			if (oControl.getCollapsed()) {
				rm.writeAttribute("aria-expanded", "false");
			} else {
				rm.writeAttribute("aria-expanded", "true");
			}
			rm.writeAttribute("tabindex", "0");
		}
	
		// tooltip of Panel
		var sTooltip = oControl.getTooltip_AsString();
		if (sTooltip) {
			rm.writeAttributeEscaped("title", sTooltip);
		}
	
	
		// header
		rm.write("><header id='" + id + "-hdr'");
		rm.addClass("sapUiPanelHdr");
	
		// tooltip of Title, might be set in addition
		var oTitle = oControl.getTitle();
		var sTitleTooltip;
		var sLevel = sap.ui.core.TitleLevel.H5; // to be compatible of size
		var bEmphasized = true;
		if (oTitle) {
			sTitleTooltip = oTitle.getTooltip_AsString();
			if (sTitleTooltip) {
				rm.writeAttributeEscaped("title", sTitleTooltip);
			}
	
			if (oTitle.getLevel() != sap.ui.core.TitleLevel.Auto) {
				// if title level is set use emphasized of title, otherwise use default one to be compatible
				sLevel = oTitle.getLevel();
				bEmphasized = oTitle.getEmphasized();
			}
		}
		if (bEmphasized) {
			rm.addClass("sapUiPanelHdrEmph");
		}
	
		rm.writeClasses();
		rm.write(">");
		
		if (oControl.getShowCollapseIcon() && accessibility) {
			rm.write("<span id=\"" + id + "-acc\" style=\"display:none;\">");
			rm.writeEscaped(oControl._rb.getText("PANEL_HEAD_ACC"));
			rm.write("</span>");
		}
	
		var sCollapseTooltip = oControl._rb.getText(oControl.getCollapsed() ? "PANEL_EXPAND" : "PANEL_COLLAPSE");
		if (oControl.getShowCollapseIcon()) { /* TODO: remove this one and rearrange the other in CSS */
			rm.write("<a id='" + id + "-collArrow' class='sapUiPanelHdrItem sapUiPanelCollArrow' href='javascript:void(0)' tabindex='0' title='" + sCollapseTooltip + "'");
			if (accessibility) {
				//rm.writeAttribute("aria-labelledby", id + "-title");
				rm.writeAttribute("role", "button");
			}
			rm.write(">&nbsp;</a>");
		}
	
	
		// IMPORTANT: title h1 is always rendered to simplify calculations and because having no title should be a rare use-case
		// if (oTitle) {
		if (oTitle && oTitle.getIcon()) {
			// header icon, if available
			var sIcon = oTitle.getIcon();
			var aClasses = [];
			var mAttributes = {};
	
			mAttributes["id"] = id + "-ico";
			mAttributes["title"] = null; // prevent icon tooltip
			aClasses.push("sapUiPanelIco");
			aClasses.push("sapUiPanelHdrItem");
			aClasses.push("sapUiTv" + sLevel); // use same font-size like header level (if icon font is used (for image it dosn't matters)
	
			rm.writeIcon(sIcon, aClasses, mAttributes);
		}
	
		// header title text
		var text = jQuery.sap.encodeHTML(oControl.getText());
		if (!text) {
			text = "&nbsp;";
		}
		// just reuse TextView class because there font size & co. is already defined
		rm.write("<" + sLevel + " ");
		rm.addClass("sapUiTv" + sLevel);
	//	rm.write("<h1 id='" + id + "-title' class='sapUiPanelHdrItem sapUiPanelTitle'");
		rm.write(" id='" + id + "-title' ");
		rm.addClass("sapUiPanelHdrItem");
		rm.addClass("sapUiPanelTitle");
		rm.writeClasses();
		if (accessibility) {
			rm.writeAttribute("role", "heading");
		}
		rm.write(">");
		rm.write(text); // already escaped!
	//	rm.write("</h1>");
		rm.write("</" + sLevel + ">");
	
	
	  // toolbar + buttons
	  var aButtons = oControl.getButtons();
	  if (aButtons && (aButtons.length > 0)) {
		rm.write("<div id='" + id + "-tb' class='sapUiPanelHdrItem sapUiPanelTb sapUiTbDesignFlat'>");
	
		for (var i = 0; i < aButtons.length; i++) {
			rm.renderControl(aButtons[i]);
		}
	
			rm.write("</div>");
	  }
	
	
	  // any other right-aligned buttons go like this:
	  // <a id="firstIcoRight" class="sapUiPanelHdrRightItem sapUiPanel*">O</a>
	  // the positioning among these items needs to be solved then, either by fixed CSS classes if there are few items (like Right1 Right2)
	  // or maybe they need to be put into a nowrap div
	
	  // collapse icon
	  if (oControl.getShowCollapseIcon()) {
			rm.write("<a id='" + id + "-collIco' class='sapUiPanelHdrRightItem sapUiPanelCollIco' href='javascript:void(0)' tabindex='0' title='" + sCollapseTooltip + "'");
			if (accessibility) {
				//rm.writeAttribute("aria-labelledby", id + "-title");
				rm.writeAttribute("role", "button");
			}
			rm.write(">&nbsp;</a>");
		}
	
	  rm.write("</header>");
	
	
	
		// content area
	
		// everything below the header is only rendered initially if not collapsed - saves performance and Panel just re-renders later on expand
		if (!oControl.getCollapsed()) {
			rm.write("<div class='sapUiPanelCont' id='", id, "-cont'>");
	
			// Content (child controls)
			var oControls = oControl.getContent(),
					iLength = oControls.length;
			for (var i = 0; i < iLength; i++) {
				rm.renderControl(oControls[i]);
			}
	
			rm.write("</div>");
		}
	
		rm.write("</section>");
	};

	return PanelRenderer;

}, /* bExport= */ true);
