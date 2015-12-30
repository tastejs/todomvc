/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides default renderer for control sap.m.MessagePage
sap.ui.define(['jquery.sap.global'],
		function(jQuery) {
			"use strict";


			/**
			 * MessagePage renderer.
			 * @namespace
			 */
			var MessagePageRenderer = {};

			/**
			 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
			 *
			 * @param {sap.ui.core.RenderManager} oRenderManager the RenderManager that can be used for writing to the Render-Output-Buffer
			 * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
			 */
			MessagePageRenderer.render = function(oRm, oMessagePage) {
				oRm.write("<div");
				oRm.writeControlData(oMessagePage);
				oRm.addClass("sapMMessagePage");
				oRm.writeClasses();
				oRm.write(">");
				oRm.renderControl(oMessagePage.getAggregation("_page"));
				oRm.write("</div>");
			};

			return MessagePageRenderer;

		}, /* bExport= */ true);
