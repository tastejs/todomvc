/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(['jquery.sap.global'],
	function(jQuery) {
	"use strict";


	/**
	 * HorizontalLayout renderer.
	 * @namespace
	 */
	var HorizontalLayoutRenderer = {
	};
	
	
	/**
	 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} oRenderManager the RenderManager that can be used for writing to the Render-Output-Buffer
	 * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
	 */
	HorizontalLayoutRenderer.render = function(oRenderManager, oControl){
		// convenience variable
		var rm = oRenderManager;
		var bNoWrap = !oControl.getAllowWrapping();
	
		// write the HTML into the render manager
		rm.write("<div");
		rm.writeControlData(oControl);
		rm.addClass("sapUiHLayout");
		if (bNoWrap) {
			rm.addClass("sapUiHLayoutNoWrap");
		}
		rm.writeClasses();
		rm.write(">"); // div element
	
		var aChildren = oControl.getContent();
		for (var i = 0; i < aChildren.length; i++) {
			if (bNoWrap) {
				rm.write("<div class='sapUiHLayoutChildWrapper'>");
			}
			rm.renderControl(aChildren[i]);
			if (bNoWrap) {
				rm.write("</div>");
			}
		}
	
		rm.write("</div>");
	};
	

	return HorizontalLayoutRenderer;

}, /* bExport= */ true);
