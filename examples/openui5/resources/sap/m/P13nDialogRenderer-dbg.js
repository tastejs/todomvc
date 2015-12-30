/*
 * ! UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([
	'jquery.sap.global', 'sap/ui/core/Renderer', './DialogRenderer'
], function(jQuery, Renderer, DialogRenderer) {
	"use strict";

	/**
	 * P13nDialog renderer.
	 *
	 * @namespace
	 */
	var P13nDialogRenderer = Renderer.extend(DialogRenderer);

	/**
	 * CSS class to be applied to the root element of the ComboBoxBase.
	 *
	 * @readonly
	 * @const {string}
	 */
	P13nDialogRenderer.CSS_CLASS = "sapMPersoDialog";

	P13nDialogRenderer.render = function(oRm, oControl) {
		DialogRenderer.render.apply(this, arguments);

		var sId = oControl._getVisiblePanelID();
		var oPanel = oControl.getVisiblePanel();
		if (sId && oPanel) {
			oRm.write("<div");
			oRm.writeAttribute("id", sId);
			oRm.write(">");
			oRm.renderControl(oPanel);
			oRm.write("</div>");
		}
	};

	return P13nDialogRenderer;

}, /* bExport= */true);
