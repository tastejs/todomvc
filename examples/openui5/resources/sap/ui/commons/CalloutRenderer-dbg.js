/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(['jquery.sap.global', './CalloutBaseRenderer', 'sap/ui/core/Renderer'],
	function(jQuery, CalloutBaseRenderer, Renderer) {
	"use strict";


	/**
	 * Callout renderer.
	 * @namespace
	 */
	var CalloutRenderer = Renderer.extend(CalloutBaseRenderer);
	
	/**
	 * Renders the HTML for content.
	 *
	 * @param {sap.ui.core.RenderManager} oRenderManager the RenderManager that can be used for writing to the Render-Output-Buffer
	 * @param {sap.ui.core.Control} oCallout an object representation of the Callout that should be rendered
	 */
	CalloutRenderer.renderContent = function(oRenderManager, oCallout){
	
		var rm = oRenderManager;
		var content = oCallout.getContent();
	
		// content
		for (var i = 0; i < content.length; i++) {
			rm.renderControl(content[i]);
		}
	};
	
	/**
	 * Add the root CSS class to the Callout to redefine/extend CalloutBase
	 *
	 * @param {sap.ui.core.RenderManager}
	 *            oRenderManager the RenderManager that can be used for writing to
	 *            the Render-Output-Buffer
	 * @param {sap.ui.core.Control}
	 *            oControl an object representation of the control that should be
	 *            rendered
	 */
	CalloutRenderer.addRootClasses = function(oRenderManager, oControl) {
		oRenderManager.addClass("sapUiClt");
	};
	
	/**
	 * Add the content CSS class to the Callout to redefine/extend CalloutBase
	 *
	 * @param {sap.ui.core.RenderManager}
	 *            oRenderManager the RenderManager that can be used for writing to
	 *            the Render-Output-Buffer
	 * @param {sap.ui.core.Control}
	 *            oControl an object representation of the control that should be
	 *            rendered
	 */
	CalloutRenderer.addContentClasses = function(oRenderManager, oControl) {
		oRenderManager.addClass("sapUiCltCont");
	};
	
	/**
	 * Add the arrow/tip CSS class to the Callout to redefine/extend CalloutBase
	 *
	 * @param {sap.ui.core.RenderManager}
	 *            oRenderManager the RenderManager that can be used for writing to
	 *            the Render-Output-Buffer
	 * @param {sap.ui.core.Control}
	 *            oControl an object representation of the control that should be
	 *            rendered
	 */
	CalloutRenderer.addArrowClasses = function(oRenderManager, oControl) {
		oRenderManager.addClass("sapUiCltArr");
	};
	

	return CalloutRenderer;

}, /* bExport= */ true);
