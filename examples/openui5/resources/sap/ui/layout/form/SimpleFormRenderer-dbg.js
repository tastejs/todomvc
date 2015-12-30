/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(['jquery.sap.global'],
	function(jQuery) {
	"use strict";


	/**
	 * SimpleForm renderer.
	 * @namespace
	 */
	var SimpleFormRenderer = {
	};


	/**
	 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
	 * 
	 * @param {sap.ui.core.RenderManager} oRm the RenderManager that can be used for writing to the render output buffer
	 * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
	 */
	SimpleFormRenderer.render = function(oRm, oControl){

		oControl._bChangedByMe = true;
		// write the HTML into the render manager
		oRm.write("<div");
		oRm.writeControlData(oControl);
		oRm.addClass("sapUiSimpleForm");
		if (oControl.getWidth()) {
			oRm.addStyle("width", oControl.getWidth());
		}
		oRm.writeStyles();
		oRm.writeClasses();
		oRm.write(">"); // div element
		var oForm = oControl.getAggregation("form");
		oRm.renderControl(oForm);
		oRm.write("</div>");
		oControl._bChangedByMe = false;

	};


	return SimpleFormRenderer;

}, /* bExport= */ true);
