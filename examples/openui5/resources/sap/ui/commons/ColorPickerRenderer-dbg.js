/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides default renderer for control sap.ui.commons.ColorPicker
sap.ui.define(['jquery.sap.global'],
	function(jQuery) {
	"use strict";


	/**
	 * ColorPicker renderer.
	 * @namespace
	 */
	var ColorPickerRenderer = {
	};
	
	
	/**
	 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} oRenderManager the RenderManager that can be used for writing to the Render-Output-Buffer
	 * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
	 */
	ColorPickerRenderer.render = function(oRm, oControl){
	
		// write the HTML into the render manager
		oRm.write("<div");   // Outer DIV
		oRm.writeControlData(oControl);
		oRm.writeClasses();
		oRm.write(">"); // <DIV> element
		oRm.renderControl(oControl.oMatrix);
		oRm.write("</div>");  // outer DIV
	
	};
	
	

	return ColorPickerRenderer;

}, /* bExport= */ true);
