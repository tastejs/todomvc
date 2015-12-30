/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(['jquery.sap.global', './TileRenderer', 'sap/ui/core/ValueStateSupport'],
	function(jQuery, TileRenderer, ValueStateSupport) {
	"use strict";

	/**
	 * CustomTile renderer.
	 * @namespace
	 */
	var StandardTileRenderer = sap.ui.core.Renderer.extend(TileRenderer);

	/**
	 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager}
	 *                oRm The RenderManager that can be used for writing to the render output buffer
	 * @param {sap.ui.core.Control}
	 *                oControl An object representation of the control that should be rendered
	 */
	StandardTileRenderer._renderContent = function(rm, oTile) {
		var infoState = oTile.getInfoState();

		rm.write("<div"); // Start top row
		rm.addClass("sapMStdTileTopRow");
		rm.writeClasses();
		rm.write(">");
		if (oTile.getIcon()) {
			rm.write("<div");
			rm.addClass("sapMStdTileIconDiv");

			switch (oTile.getType()) {
				case sap.m.StandardTileType.Monitor:
					rm.addClass("sapMStdIconMonitor");
					break;
				case sap.m.StandardTileType.Create:
					rm.addClass("sapMStdIconCreate");
					break;
			}
			rm.writeClasses();
			rm.write(">");
			rm.renderControl(oTile._getImage());
			rm.write("</div>");
		}


		if (oTile.getNumber()) {

			rm.write("<div");
			rm.addClass("sapMStdTileNumDiv");
			rm.writeClasses();
			rm.write(">");

			rm.write("<div");
			rm.writeAttribute("id", oTile.getId() + "-number");

			var numberLength = oTile.getNumber().length;
			if (numberLength < 5) {
				rm.addClass("sapMStdTileNum");
			} else if (numberLength < 8) {
				rm.addClass("sapMStdTileNumM");
			} else {
				rm.addClass("sapMStdTileNumS");
			}

			rm.writeClasses();
			rm.write(">");
			rm.writeEscaped(oTile.getNumber());
			rm.write("</div>");

			if (oTile.getNumberUnit()) {
				rm.write("<div");
				rm.writeAttribute("id", oTile.getId() + "-numberUnit");
				rm.addClass("sapMStdTileNumUnit");
				rm.writeClasses();
				rm.write(">");
				rm.writeEscaped(oTile.getNumberUnit());
				rm.write("</div>");
			}
			rm.write("</div>"); // End number div
		}
		rm.write("</div>"); // End top row div


		rm.write("<div"); // Start monitoring tile styling
		rm.addClass("sapMStdTileBottomRow");
		if (oTile.getType() === sap.m.StandardTileType.Monitor) {
			rm.addClass("sapMStdTileMonitorType");
		}
		rm.writeClasses();
		rm.write(">");

		rm.write("<div");  // Start title div
		rm.writeAttribute("id", oTile.getId() + "-title");
		rm.addClass("sapMStdTileTitle");
		rm.writeClasses();
		rm.write(">");
		if (oTile.getTitle()) {
			rm.writeEscaped(oTile.getTitle());
		}
		rm.write("</div>"); // End title div

		if (oTile.getInfo()) {
			rm.write("<div"); // Start info
			rm.writeAttribute("id", oTile.getId() + "-info");
			rm.addClass("sapMStdTileInfo");
			rm.addClass("sapMStdTileInfo" + infoState);
			rm.writeClasses();

			/* WAI ARIA for infoState */
			if (infoState != sap.ui.core.ValueState.None) {
				rm.writeAccessibilityState(oTile, {
					ariaDescribedBy: {
						value: oTile.getId() + "-sapSRH",
						append: true
					}
				});
			}

			rm.write(">");
			if (oTile.getInfo()) {
				rm.writeEscaped(oTile.getInfo());
			}
			rm.write("</div>"); // End info
		}

		/* WAI ARIA adding hidden element for infoStatus */
		if (infoState != sap.ui.core.ValueState.None) {
			rm.write("<span");
			rm.writeAttributeEscaped("id", oTile.getId() + "-sapSRH");
			rm.addClass("sapUiInvisibleText");
			rm.writeClasses();
			rm.writeAccessibilityState({
				hidden: false
			});
			rm.write(">");
			rm.writeEscaped(ValueStateSupport.getAdditionalText(infoState));
			rm.write("</span>");
		}

		rm.write("</div>"); // End bottom row type tile styling

	};


	return StandardTileRenderer;

}, /* bExport= */ true);
