/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides default renderer for control sap.ui.unified.ShellLayout
sap.ui.define(['jquery.sap.global'],
	function(jQuery) {
	"use strict";


	/**
	 * Shell Layout renderer.
	 * @namespace
	 */
	var ShellLayoutRenderer = {};
	
	/**
	 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
	 * @param {sap.ui.core.RenderManager} rm the RenderManager that can be used for writing to the Render-Output-Buffer
	 * @param {sap.ui.core.Control} oShell an object representation of the control that should be rendered
	 */
	ShellLayoutRenderer.render = function(rm, oShell){
		var id = oShell.getId();
	
		rm.write("<div");
		rm.writeControlData(oShell);
		rm.addClass("sapUiUfdShell");
		if (oShell._animation) {
			rm.addClass("sapUiUfdShellAnim");
		}
		if (!oShell.getHeaderVisible()) {
			rm.addClass("sapUiUfdShellNoHead");
		}
		rm.addClass("sapUiUfdShellHead" + (oShell._showHeader ? "Visible" : "Hidden"));
		if (oShell.getShowCurtain()) {
			rm.addClass("sapUiUfdShellCurtainVisible");
		} else {
			rm.addClass("sapUiUfdShellCurtainHidden");
			rm.addClass("sapUiUfdShellCurtainClosed");
		}
		
		rm.writeClasses();
		rm.write(">");
		
		rm.write("<hr id='", id, "-brand' class='sapUiUfdShellBrand'/>");
		
		rm.write("<header id='", id, "-hdr'  class='sapUiUfdShellHead'");
		if (sap.ui.getCore().getConfiguration().getAccessibility()) {
			rm.writeAttribute("role", "banner");
		}
		rm.write("><div><div id='", id, "-hdrcntnt' class='sapUiUfdShellCntnt'>");
		if (oShell.getHeader()) {
			rm.renderControl(oShell.getHeader());
		}
		rm.write("</div>", "</div>", "</header>");
	
		rm.write("<section id='", id, "-curt' class='sapUiUfdShellCntnt sapUiUfdShellCurtain'>");
		rm.write("<div id='", id, "-curtcntnt' class='sapUiUfdShellCntnt'>");
		rm.renderControl(oShell._curtCont);
		rm.write("</div>");
		rm.write("<span id='", id, "-curt-focusDummyOut' tabindex='0'></span>");
		rm.write("</section>");
		
		rm.write("<div id='", id, "-cntnt' class='sapUiUfdShellCntnt sapUiUfdShellCanvas sapUiGlobalBackgroundColor sapUiGlobalBackgroundColorForce'>");
		rm.write("<div id='", id, "-strgbg' class='sapUiUfdShellBG" + (oShell._useStrongBG ? " sapUiStrongBackgroundColor" : "") + "'></div>");
		rm.write("<div class='sapUiGlobalBackgroundImage sapUiGlobalBackgroundImageForce sapUiUfdShellBG'></div>");
		rm.renderControl(oShell._cont);
		rm.write("</div>");
		
		rm.write("<span id='", id, "-main-focusDummyOut' tabindex='" + (oShell.getShowCurtain() ? 0 : -1) + "'></span>");
		
		rm.write("</div>");
	};

	return ShellLayoutRenderer;

}, /* bExport= */ true);
