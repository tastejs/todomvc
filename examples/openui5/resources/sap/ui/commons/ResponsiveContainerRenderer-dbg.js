/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides default renderer for control sap.ui.commons.ResponsiveContainer
sap.ui.define(['jquery.sap.global'],
	function(jQuery) {
	"use strict";


	/**
	 * RatingIndicatorRenderer.
	 * @namespace
	 */
	var ResponsiveContainerRenderer = function() {
	};
	
	/**
	 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager}
	 *          oRenderManager the RenderManager that can be used for writing to the Render-Output-Buffer
	 * @param {sap.ui.core.Control}
	 *          oRating an object representation of the control that should be rendered
	 */
	ResponsiveContainerRenderer.render = function(oRenderManager, oContainer) {
		var oRM = oRenderManager,
			oContent = oContainer.getAggregation("content");
		oRM.write("<div ");
		oRM.writeControlData(oContainer);
		oRM.addStyle("width", oContainer.getWidth());
		oRM.addStyle("height", oContainer.getHeight());
		oRM.writeStyles();
		oRM.write(">");
		if (oContent) {
			oRM.renderControl(oContent);
		}
		// Render divs for each range into an invisible area to get the actual pixel width
		// for arbitrary CSS sizes (em, ex, rem, etc...)
		oRM.write("<div ");
		oRM.addStyle("width", "0px");
		oRM.addStyle("height", "0px");
		oRM.addStyle("overflow", "hidden");
		oRM.writeStyles();
		oRM.write(">");
		jQuery.each(oContainer.getRanges(), function(i, oRange) {
			oRM.write("<div ");
			oRM.writeElementData(oRange);
			oRM.addStyle("width", oRange.getWidth());
			oRM.addStyle("height", oRange.getHeight());
			oRM.writeStyles();
			oRM.write("></div>");
		});
		oRM.write("</div>");
		oRM.write("</div>");
	};

	return ResponsiveContainerRenderer;

}, /* bExport= */ true);
