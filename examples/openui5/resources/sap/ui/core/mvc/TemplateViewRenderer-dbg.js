/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides default renderer for JSView
sap.ui.define(['./ViewRenderer'],
	function(ViewRenderer) {
	"use strict";


	/**
	 * @class TemplateView renderer.
	 * @static
	 * @alias sap.ui.core.mvc.TemplateViewRenderer
	 */
	var TemplateViewRenderer = {
	};
	
	
	/**
	 * Renders the Template, using the provided {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} oRenderManager the RenderManager that can be used for writing to the Render-Output-Buffer
	 * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
	 */
	TemplateViewRenderer.render = function(oRenderManager, oControl){
		// convenience variable
		var rm = oRenderManager;
	
		// write the HTML into the render manager
		rm.write("<div");
		rm.writeControlData(oControl);
		rm.addClass("sapUiView");
		rm.addClass("sapUiTmplView");
		ViewRenderer.addDisplayClass(rm, oControl);
		rm.addStyle("width", oControl.getWidth());
		rm.addStyle("height", oControl.getHeight());
		rm.writeStyles();
		rm.writeClasses();
		rm.write(">");
		
		rm.renderControl(oControl._oTemplate);
	
		rm.write("</div>");
	};

	return TemplateViewRenderer;

}, /* bExport= */ true);
