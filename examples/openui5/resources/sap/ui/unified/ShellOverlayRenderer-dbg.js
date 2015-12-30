/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides default renderer for control sap.ui.unified.ShellOverlay
sap.ui.define(['jquery.sap.global'],
	function(jQuery) {
	"use strict";


	/**
	 * ShellOverlay renderer.
	 * @namespace
	 */
	var ShellOverlayRenderer = {};
	
	/**
	 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
	 * @param {sap.ui.core.RenderManager} rm the RenderManager that can be used for writing to the Render-Output-Buffer
	 * @param {sap.ui.core.Control} oShell an object representation of the control that should be rendered
	 */
	ShellOverlayRenderer.render = function(rm, oControl){
		rm.write("<div");
		rm.writeControlData(oControl);
		rm.addClass("sapUiUfdShellOvrly");
		if (oControl._opening) {
			rm.addClass("sapUiUfdShellOvrlyCntntHidden");
			rm.addClass("sapUiUfdShellOvrlyOpening");
		}
		
		if (oControl._getAnimActive()) {
			rm.addClass("sapUiUfdShellOvrlyAnim");
		}
		rm.writeClasses();
		if (sap.ui.getCore().getConfiguration().getAccessibility()) {
			rm.writeAccessibilityState(oControl, {
				role: "dialog"
			});
		}
		rm.write("><span id='", oControl.getId(), "-focfirst' tabIndex='0'></span><div id='", oControl.getId(), "-inner'>");
		
		rm.write("<header class='sapUiUfdShellOvrlyHead'>");
		rm.write("<hr class='sapUiUfdShellOvrlyBrand'/>");
		rm.write("<div class='sapUiUfdShellOvrlyHeadCntnt'");
		if (sap.ui.getCore().getConfiguration().getAccessibility()) {
			rm.writeAttribute("role", "toolbar");
		}
		rm.write("><div id='" + oControl.getId() + "-hdr-center' class='sapUiUfdShellOvrlyHeadCenter'>");
		ShellOverlayRenderer.renderSearch(rm, oControl);
		rm.write("</div>");
		var rb = sap.ui.getCore().getLibraryResourceBundle("sap.ui.unified"),
			sCloseTxt = rb.getText("SHELL_OVERLAY_CLOSE");
		rm.write("<a tabindex='0' href='javascript:void(0);' id='" + oControl.getId() + "-close' class='sapUiUfdShellOvrlyHeadClose'");
		rm.writeAttributeEscaped("title", sCloseTxt);
		if (sap.ui.getCore().getConfiguration().getAccessibility()) {
			rm.writeAttribute("role", "button");
		}
		rm.write(">");
		rm.writeEscaped(sCloseTxt);
		rm.write("</a></div></header>");
		rm.write("<div id='" + oControl.getId() + "-cntnt' class='sapUiUfdShellOvrlyCntnt'>");
		ShellOverlayRenderer.renderContent(rm, oControl);
		rm.write("</div>");
		
		rm.write("</div><span id='", oControl.getId(), "-foclast' tabIndex='0'></span></div>");
	};
	
	ShellOverlayRenderer.renderSearch = function(rm, oControl) {
		var iWidth = oControl._getSearchWidth();
		var sStyle = "";
		if (iWidth > 0 && oControl._opening) {
			sStyle = "style='width:" + iWidth + "px'";
		}
		
		rm.write("<div id='" + oControl.getId() + "-search' class='sapUiUfdShellOvrlySearch' " + sStyle + "><div>");
		var oSearch = oControl.getSearch();
		if (oSearch) {
			rm.renderControl(oSearch);
		}
		rm.write("</div></div>");
	};
	
	ShellOverlayRenderer.renderContent = function(rm, oControl) {
		rm.write("<div tabindex='-1'>");
		var aContent = oControl.getContent();
		for (var i = 0; i < aContent.length; i++) {
			rm.renderControl(aContent[i]);
		}
		rm.write("</div>");
	};

	return ShellOverlayRenderer;

}, /* bExport= */ true);
