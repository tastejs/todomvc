/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([
	'jquery.sap.global'
], function(jQuery) {
	"use strict";

	/**
	 * SortPanel renderer.
	 * @namespace
	 */
	var P13nSortPanelRenderer = {};

	/**
	 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
	 * 
	 * @param {sap.ui.core.RenderManager}
	 *            oRm the RenderManager that can be used for writing to the render output buffer
	 * @param {sap.ui.core.Control}
	 *            oControl an object representation of the control that should be rendered
	 */
	P13nSortPanelRenderer.render = function(oRm, oControl) {
		// Return immediately if control is invisible
		if (!oControl.getVisible()) {
			return;
		}

		// start SortPanel
		oRm.write("<section");
		oRm.writeControlData(oControl);
		oRm.addClass("sapMSortPanel");
		//	oRm.addStyle("width", oControl.getWidth());
		//	oRm.addStyle("height", oControl.getHeight());
		oRm.writeClasses();
		oRm.writeStyles();
		oRm.write(">");

		// render content
		oRm.write("<div");
		oRm.addClass("sapMSortPanelContent");
		oRm.addClass("sapMSortPanelBG");

		oRm.writeClasses();
		oRm.write(">");
		var aChildren = oControl.getAggregation("content");
		var iLength = aChildren.length;
		for (var i = 0; i < iLength; i++) {
			oRm.renderControl(aChildren[i]);
		}
		oRm.write("</div>");

		oRm.write("</section>");
	};

	return P13nSortPanelRenderer;

}, /* bExport= */true);
