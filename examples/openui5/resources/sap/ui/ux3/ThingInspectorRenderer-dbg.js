/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides default renderer for the sap.ui.ux3.ThingInspector
sap.ui.define(['jquery.sap.global', 'sap/ui/core/Renderer', './OverlayRenderer'],
	function(jQuery, Renderer, OverlayRenderer) {
	"use strict";


	/**
	 * ThingInspector renderer.
	 * @namespace
	 */
	var ThingInspectorRenderer = Renderer.extend(OverlayRenderer);
	
	/**
	 * Renders the ThingInspector content
	 *
	 * @param {sap.ui.core.RenderManager}
	 *            oRenderManager the RenderManager that can be used for writing to
	 *            the Render-Output-Buffer
	 * @param {sap.ui.core.Control}
	 *            oControl an object representation of the control that should be
	 *            rendered
	 */
	ThingInspectorRenderer.renderContent = function(oRenderManager, oControl) {
		// convenience variable
		var rm = oRenderManager;
		rm.write("<div role='Main' class='sapUiUx3TIContent' id='" + oControl.getId() + "-content'>");
		rm.renderControl(oControl._oThingViewer);
		rm.write("</div>");
	};
	
	/**
	 * Add root class to ThingInspector
	 *
	 * @param {sap.ui.core.RenderManager}
	 *            oRenderManager the RenderManager that can be used for writing to
	 *            the Render-Output-Buffer
	 * @param {sap.ui.core.Control}
	 *            oControl an object representation of the control that should be
	 *            rendered
	 */
	ThingInspectorRenderer.addRootClasses = function(oRenderManager, oControl) {
		var rm = oRenderManager;
		rm.addClass("sapUiUx3TI");
	};
	
	/**
	 * Add class to ThingInspector
	 *
	 * @param {sap.ui.core.RenderManager}
	 *            oRenderManager the RenderManager that can be used for writing to
	 *            the Render-Output-Buffer
	 * @param {sap.ui.core.Control}
	 *            oControl an object representation of the control that should be
	 *            rendered
	 */
	ThingInspectorRenderer.addOverlayClasses = function(oRenderManager, oControl) {
		var rm = oRenderManager;
		rm.addClass("sapUiUx3TIOverlay");
	};

	return ThingInspectorRenderer;

}, /* bExport= */ true);
