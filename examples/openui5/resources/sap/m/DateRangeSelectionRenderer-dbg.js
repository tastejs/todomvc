/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global', 'sap/ui/core/Renderer', './DatePickerRenderer'],
	function(jQuery, Renderer, DatePickerRenderer) {
	"use strict";


	/**
	 * DateRangeSelection renderer.
	 * @namespace
	 */
	var DateRangeSelectionRenderer = Renderer.extend(DatePickerRenderer);

	/**
	 * Write the value of the input.
	 *
	 * @public
	 * @param {sap.ui.core.RenderManager} oRm The RenderManager that can be used for writing to the render output buffer.
	 * @param {sap.ui.core.Control} oControl An object representation of the control that should be rendered.
	 */
	DateRangeSelectionRenderer.writeInnerValue = function(oRm, oControl) {

		oRm.writeAttributeEscaped("value", oControl._formatValue(oControl.getDateValue(), oControl.getSecondDateValue()));

	};

	return DateRangeSelectionRenderer;

}, /* bExport= */ true);
