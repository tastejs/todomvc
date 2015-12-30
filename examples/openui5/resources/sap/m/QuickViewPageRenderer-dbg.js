/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(['jquery.sap.global'],
	function(jQuery) {
		"use strict";

		/**
		 * @class QuickViewPage renderer.
		 * @static
		 */
		var QuickViewPageRenderer = {};

		/**
		 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
		 *
		 * @param {sap.ui.core.RenderManager}
		 *          oRm the RenderManager that can be used for writing to the render output buffer
		 * @param {sap.ui.core.Control}
		 *          oQuickView an object representation of the control that should be rendered
		 */
		QuickViewPageRenderer.render = function(oRm, oQuickViewPage) {

			var mPageContent = oQuickViewPage._createPageContent();

			oRm.write("<div");
			oRm.addClass("sapMQuickViewPage");
			oRm.writeControlData(oQuickViewPage);
			oRm.writeClasses();
			oRm.write(">");

			if (mPageContent.header) {
				oRm.renderControl(mPageContent.header);
			}

			oRm.renderControl(mPageContent.form);
			oRm.write("</div>");
		};

		return QuickViewPageRenderer;

	}, /* bExport= */ true);
