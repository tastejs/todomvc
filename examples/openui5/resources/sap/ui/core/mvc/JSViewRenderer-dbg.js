/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides default renderer for JSView
sap.ui.define(['jquery.sap.global', './ViewRenderer'],
	function(jQuery, ViewRenderer) {
	"use strict";


	/**
	 * @class JSView renderer.
	 * @static
	 * @alias sap.ui.core.mvc.JSViewRenderer
	 */
	var JSViewRenderer = {
	};
	
	
	/**
	 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} oRenderManager the RenderManager that can be used for writing to the Render-Output-Buffer
	 * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
	 */
	JSViewRenderer.render = function(oRenderManager, oControl){
		// convenience variable
		var rm = oRenderManager;
	
		// write the HTML into the render manager
		rm.write("<div");
		rm.writeControlData(oControl);
		rm.addClass("sapUiView");
		rm.addClass("sapUiJSView");
		ViewRenderer.addDisplayClass(rm, oControl);
		if (oControl.getWidth()) {
			rm.addStyle("width", oControl.getWidth());
		}
		if (oControl.getHeight()) {
			rm.addStyle("height", oControl.getHeight());
		}
		rm.writeStyles();
		rm.writeClasses();
		rm.write(">");
	
		var content = oControl.getContent();
		if (content) {
			if (jQuery.isArray(content)) {
				// looks like an Array
				for (var i = 0; i < content.length; i++) {
					rm.renderControl(content[i]);
				}
	
			} else if (content) {
				// should be a Control
				rm.renderControl(content);
			}
		}
	
		rm.write("</div>");
	};
	

	return JSViewRenderer;

}, /* bExport= */ true);
