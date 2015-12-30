/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(['jquery.sap.global'],
	function(jQuery) {
	"use strict";


	/**
	 * ScrollContainer renderer. 
	 * @namespace
	 */
	var ScrollContainerRenderer = {
	};
	
	
	/**
	 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
	 * 
	 * @param {sap.ui.core.RenderManager} oRm the RenderManager that can be used for writing to the render output buffer
	 * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
	 */
	ScrollContainerRenderer.render = function(oRm, oControl) {
		oRm.write("<div");
		oRm.writeControlData(oControl);
	
		var width = oControl.getWidth(),
		height = oControl.getHeight();
		if (width) {
			oRm.addStyle("width", width);
		}
		if (height) {
			oRm.addStyle("height", height);
		}
		oRm.writeStyles();
	
		if (oControl.getVertical()) {
			if (!oControl.getHorizontal()) {
				oRm.addClass("sapMScrollContV");
			} else {
				oRm.addClass("sapMScrollContVH");
			}
		} else if (oControl.getHorizontal()) {
			oRm.addClass("sapMScrollContH");
		}
	
		oRm.addClass("sapMScrollCont");
		oRm.writeClasses();
		
		var sTooltip = oControl.getTooltip_AsString();
		if (sTooltip) {
			oRm.writeAttributeEscaped("title", sTooltip);
		}
		
		if (oControl.getFocusable()) {
			oRm.writeAttributeEscaped("tabindex","0");
		}
		
		oRm.write("><div id='" + oControl.getId() + "-scroll' class='sapMScrollContScroll'>");
	
		// render child controls
		var aContent = oControl.getContent(),
		l = aContent.length;
		for (var i = 0; i < l; i++) {
			oRm.renderControl(aContent[i]);
		}
	
		oRm.write("</div></div>");
	};
	

	return ScrollContainerRenderer;

}, /* bExport= */ true);
