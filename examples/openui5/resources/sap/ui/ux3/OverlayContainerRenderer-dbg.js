/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides default renderer for the sap.ui.ux3.OverlayContainer
sap.ui.define(['jquery.sap.global', 'sap/ui/core/Renderer', './OverlayRenderer'],
	function(jQuery, Renderer, OverlayRenderer) {
	"use strict";

/**
	 * OverlayContainer renderer.
	 * @namespace
	 */
	var OverlayContainerRenderer = Renderer.extend(OverlayRenderer);
	
	/**
	 * Renders the Overlay content
	 *
	 * @param {sap.ui.core.RenderManager}
	 *            oRenderManager the RenderManager that can be used for writing to
	 *            the Render-Output-Buffer
	 * @param {sap.ui.core.Control}
	 *            oControl an object representation of the control that should be
	 *            rendered
	 */
	OverlayContainerRenderer.renderContent = function(oRenderManager, oControl) {
		var rm = oRenderManager;
		rm.write("<div role='Main' class='sapUiUx3OCContent' id='" + oControl.getId() + "-content'>");
		var content = oControl.getContent();
		for (var i = 0; i < content.length; i++) {
			var control = content[i];
			rm.renderControl(control);
		}
		rm.write("</div>");
	};
	
	/**
	 * Add root class to Overlay
	 *
	 * @param {sap.ui.core.RenderManager}
	 *            oRenderManager the RenderManager that can be used for writing to
	 *            the Render-Output-Buffer
	 * @param {sap.ui.core.Control}
	 *            oControl an object representation of the control that should be
	 *            rendered
	 */
	OverlayContainerRenderer.addRootClasses = function(oRenderManager, oControl) {
		var rm = oRenderManager;
		rm.addClass("sapUiUx3OC");
	};
	
	/**
	 * Add class to Overlay
	 *
	 * @param {sap.ui.core.RenderManager}
	 *            oRenderManager the RenderManager that can be used for writing to
	 *            the Render-Output-Buffer
	 * @param {sap.ui.core.Control}
	 *            oControl an object representation of the control that should be
	 *            rendered
	 */
	OverlayContainerRenderer.addOverlayClasses = function(oRenderManager, oControl) {
		var rm = oRenderManager;
		rm.addClass("sapUiUx3OCOverlay");
	};
	

	return OverlayContainerRenderer;

}, /* bExport= */ true);
