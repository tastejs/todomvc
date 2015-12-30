/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(['jquery.sap.global'],
	function(jQuery) {
	"use strict";


	/**
	 * ColumnsPanel renderer.
	 * @namespace
	 */
	var P13nColumnsPanelRenderer = {};
	
	/**
	 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
	 * 
	 * @param {sap.ui.core.RenderManager}
	 *            oRm the RenderManager that can be used for writing to the render output buffer
	 * @param {sap.ui.core.Control}
	 *            oControl an object representation of the control that should be rendered
	 */
	P13nColumnsPanelRenderer.render = function(oRm, oControl) {
		oRm.write("<div");
		oRm.writeControlData(oControl);
		oRm.addClass("sapMP13nColumnsPanel");
		oRm.writeClasses();
		oRm.write(">"); // div element
	
		var aContent = oControl.getAggregation("content");
		if (aContent) {
			aContent.forEach(function(oContent){
				oRm.renderControl(oContent);
			});
		}

		oRm.write("</div>");
	};
	

	return P13nColumnsPanelRenderer;

}, /* bExport= */ true);
