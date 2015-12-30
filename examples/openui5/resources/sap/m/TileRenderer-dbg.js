/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides default renderer for control sap.m.Text
sap.ui.define(['jquery.sap.global', 'sap/ui/core/Renderer'],
	function(jQuery, Renderer) {
	"use strict";


	/**
	 * Text renderer.
	 * @author SAP SE
	 * @namespace
	 */
	var TileRenderer = {};

	/**
	 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
	 * @param {sap.ui.core.RenderManager} oRenderManager The RenderManager that can be used for writing to the render output buffer
	 * @param {sap.ui.core.Control} oControl An object representation of the control that should be rendered
	 */
	TileRenderer.render = function(rm, oControl) {
		rm.write("<div tabindex=\"0\"");
		rm.writeControlData(oControl);
		rm.addClass("sapMTile");
		rm.addClass("sapMPointer");
		rm.writeClasses();
		if (oControl._invisible) {
			rm.addStyle("visibility", "hidden");
			rm.writeStyles();
		}
		var sTooltip = oControl.getTooltip_AsString();
		if (sTooltip) {
			rm.writeAttributeEscaped("title", sTooltip);
		}

		/* WAI ARIA if in TileContainer context */
		if (oControl.getParent() instanceof sap.m.TileContainer) {
			rm.writeAccessibilityState(oControl, {
				role: "option",
				posinset: oControl._getTileIndex(),
				setsize: oControl._getTilesCount()
			});
		}

		rm.write(">");
		if (oControl.getRemovable()) {
			rm.write("<div id=\"" + oControl.getId() + "-remove\" class=\"sapMTCRemove\"></div>");
		} else {
			rm.write("<div id=\"" + oControl.getId() + "-remove\" class=\"sapMTCNoRemove\"></div>");
		}
		rm.write("<div class=\"sapMTileContent\">");
		this._renderContent(rm,oControl);
		rm.write("</div></div>");
	};

	TileRenderer._renderContent = function(rm, oControl) {};

	return TileRenderer;

}, /* bExport= */ true);
