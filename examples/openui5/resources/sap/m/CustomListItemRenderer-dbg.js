/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(['jquery.sap.global', './ListItemBaseRenderer', 'sap/ui/core/Renderer'],
	function(jQuery, ListItemBaseRenderer, Renderer) {
	"use strict";


	/**
	 * CustomListItem renderer.
	 * @namespace
	 */
	var CustomListItemRenderer = Renderer.extend(ListItemBaseRenderer);
	
	/**
	 * Renders the HTML for the given control, using the provided
	 * {@link sap.ui.core.RenderManager}.
	 * 
	 * @param {sap.ui.core.RenderManager}
	 *            oRenderManager the RenderManager that can be used for writing to
	 *            the Render-Output-Buffer
	 * @param {sap.ui.core.Control}
	 *            oControl an object representation of the control that should be
	 *            rendered
	 */
	CustomListItemRenderer.renderLIAttributes = function(rm, oLI) {
		rm.addClass("sapMCLI");
	};
	
	CustomListItemRenderer.renderLIContent = function(rm, oLI) {
		var aContent = oLI.getContent();
		var cLength = aContent.length;
		for ( var i = 0; i < cLength; i++) {
			rm.renderControl(aContent[i]);
		}
	};

	return CustomListItemRenderer;

}, /* bExport= */ true);
