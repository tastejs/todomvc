/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global', './TileRenderer'],
	function(jQuery, TileRenderer) {
	"use strict";

/**
	 * CustomTile renderer.
	 * @namespace
	 */
	var CustomTileRenderer = sap.ui.core.Renderer.extend(TileRenderer);

	/**
	 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager}
	 *                oRm The RenderManager that can be used for writing to the render output buffer
	 * @param {sap.ui.core.Control}
	 *                oControl An object representation of the control that should be rendered
	 */
	 CustomTileRenderer.render = function(rm, oControl) {
		rm.write("<div tabindex=\"0\"");
		rm.writeControlData(oControl);
		rm.addClass("sapMCustomTile");
		rm.writeClasses();
		if (oControl._invisible) {
			rm.addStyle("visibility", "hidden");
			rm.writeStyles();
		}

		/* WAI ARIA if in TileContainer context */
		if (oControl.getParent() instanceof sap.m.TileContainer) {
			rm.writeAccessibilityState({
				role: "option",
				posinset: oControl._getTileIndex(),
				setsize: oControl._getTilesCount()
			});
		}

		rm.write(">");
		rm.write("<div id=\"" + oControl.getId() + "-remove\" class=\"sapMTCRemove\"></div>");
		rm.write("<div class=\"sapMCustomTileContent\">");
		this._renderContent(rm,oControl);
		rm.write("</div></div>");
	};

	CustomTileRenderer._renderContent = function (rm, oTile) {
		rm.renderControl(oTile.getContent());
	};

	return CustomTileRenderer;

}, /* bExport= */ true);
