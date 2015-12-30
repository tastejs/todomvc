
/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(['jquery.sap.global'],
	function(jQuery) {
	"use strict";


	/**
	 * Bar renderer.
	 * @namespace
	 */
	var TileContainerRenderer = {
	};


	/**
	 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} oRenderManager The RenderManager that can be used for writing to the Render-Output-Buffer
	 * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
	 */
	TileContainerRenderer.render = function(rm, oControl) {
		var id =  oControl.getId();

		rm.write("<div tabindex=\"-1\"");
		rm.writeControlData(oControl);
		rm.addStyle("height",oControl.getHeight());
		rm.addStyle("width",oControl.getWidth());
		rm.writeStyles();
		rm.addClass("sapMTC");
		rm.writeClasses();

		/* WAI ARIA region */
		rm.writeAccessibilityState(oControl, {
			role: "listbox",
			multiSelectable: false,
			activeDescendant: oControl.getTiles().length > 0 ? oControl.getTiles()[0].getId() : ""
		});

		rm.write(" >");
		rm.write("<div id=\"" + id + "-scrl\" class=\"sapMTCScrl\" style=\"height:0px;");
		if (!oControl.bRtl) {
			rm.write(" overflow: hidden;");
		}
		rm.write("\">");
		rm.write("<div id=\"" + id + "-blind\" class=\"sapMTCBlind\"></div>");
		rm.write("<div id=\"" + id + "-cnt\" class=\"sapMTCCnt sapMTCAnim\" style=\"height:0px; width:0px;\" role=\"group\">");
		var aTiles = oControl.getTiles();
		for (var i = 0;i < aTiles.length;i++) {
			aTiles[i]._setVisible(false);
			rm.renderControl(aTiles[i]);
		}
		rm.write("</div>");
		rm.write("</div>");
		rm.write("<div id=\"" + id + "-pager\" class=\"sapMTCPager\">");
		rm.write("</div>");
		rm.write("<div id=\"" + id + "-leftedge\" class=\"sapMTCEdgeLeft\"></div>");
		rm.write("<div id=\"" + id + "-rightedge\" class=\"sapMTCEdgeRight\"></div>");
		rm.write("<div id=\"" + id + "-leftscroller\" class=\"sapMTCScroller sapMTCLeft\" tabindex=\"-1\"><div class=\"sapMTCInner\" ></div></div>");
		rm.write("<div id=\"" + id + "-rightscroller\" class=\"sapMTCScroller sapMTCRight\" tabindex=\"-1\"><div class=\"sapMTCInner\" ></div></div>");
		rm.write("</div>");
	};

	return TileContainerRenderer;

}, /* bExport= */ true);
