/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */


sap.ui.define("sap/m/semantic/SemanticPageRenderer", [], function() {
	"use strict";

	var SemanticPageRenderer = {};

	SemanticPageRenderer.render = function(oRenderManager, omPage) {

		oRenderManager.write("<div");
		oRenderManager.writeControlData(omPage);
		oRenderManager.addClass("sapMSemanticPage");
		oRenderManager.writeClasses();
		oRenderManager.write(">");
		oRenderManager.renderControl(omPage._getPage());
		oRenderManager.write("</div>");
	};

	return SemanticPageRenderer;
}, /* bExport= */ true);
