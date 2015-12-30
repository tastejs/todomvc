/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global', 'sap/ui/core/Renderer', './InputBaseRenderer'],
	function(jQuery, Renderer, InputBaseRenderer) {
	"use strict";


	
	/**
	 * DateTimeInput renderer.
	 * @namespace
	 *
	 * For a common look & feel,
	 * DateTimeInputRenderer extends the InputRenderer
	 */
	var DateTimeInputRenderer = Renderer.extend(InputBaseRenderer);
	
	/**
	 * Adds control specific class
	 *
	 * @param {sap.ui.core.RenderManager} oRm the RenderManager that can be used for writing to the render output buffer
	 * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
	 */
	DateTimeInputRenderer.addOuterClasses = function(oRm, oControl) {
		oRm.addClass("sapMDTI");
	};
	
	/**
	 * Add pointer cursor to date-time input
	 *
	 * @param {sap.ui.core.RenderManager} oRm the RenderManager that can be used for writing to the render output buffer
	 * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
	 */
	DateTimeInputRenderer.addCursorClass = function(oRm, oControl) {
		if (oControl.getEnabled() && oControl.getEditable()) {
			oRm.addClass("sapMPointer");
		}
	};
	
	/**
	 * Add extra styles for input container
	 *
	 * @param {sap.ui.core.RenderManager} oRm the RenderManager that can be used for writing to the render output buffer
	 * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
	 */
	DateTimeInputRenderer.addOuterStyles = function(oRm, oControl) {
		oRm.addStyle("width", oControl.getWidth());
	};

	return DateTimeInputRenderer;

}, /* bExport= */ true);
