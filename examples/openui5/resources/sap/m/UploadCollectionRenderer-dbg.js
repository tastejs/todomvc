/*!
* UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
*/
sap.ui.define(['jquery.sap.global'],
	function(jQuery) {
	"use strict";


	/**
	* UploadCollection renderer.
	* @namespace
	*/
	var UploadCollectionRenderer = {};
	
	/**
	 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} oRm the RenderManager that can be used for writing to the render output buffer
	 * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
	 */
	UploadCollectionRenderer.render = function(oRm, oControl) {
	
		// write the HTML into the render manager
		oRm.write("<div");
		oRm.writeControlData(oControl);
		oRm.addClass("sapMUC");
		oRm.writeClasses();
		oRm.write(">");
		oRm.renderControl(oControl._oList);
		oRm.write("</div>");
	};

	return UploadCollectionRenderer;

}, /* bExport= */ true);
