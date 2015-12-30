/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides the default renderer for control sap.m.Label
sap.ui.define(['jquery.sap.global', 'sap/ui/core/Renderer'],
	function(jQuery, Renderer) {
	"use strict";

	/**
	 * Label renderer.
	 *
	 * @author SAP SE
	 * @namespace
	 */
	var LabelRenderer = {};

	/**
	 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} rm The RenderManager that can be used for writing to the renderer output buffer
	 * @param {sap.ui.core.Control} oLabel An object representation of the control that should be rendered
	 */
	LabelRenderer.render = function(rm, oLabel){
		// convenience variable
		var r = LabelRenderer;

		// write the HTML into the render manager
		rm.write("<label");
		rm.writeControlData(oLabel);

		// styles
		rm.addClass("sapMLabel");
		rm.addClass("sapUiSelectable");
		// set design to bold
		if (oLabel.getDesign() == sap.m.LabelDesign.Bold) {
			rm.addStyle("font-weight", "bold");
		}

		if (oLabel.getRequired()) {
			rm.addClass("sapMLabelRequired");
		}

		if (oLabel.getLabelForRendering()) {
			sap.ui.core.LabelEnablement.writeLabelForAttribute(rm, oLabel);
		} else if (oLabel.getParent() instanceof sap.m.Toolbar) {
			rm.addClass("sapMLabelTBHeader");
		}

		// text direction
		var sTextDir = oLabel.getTextDirection();
		if (sTextDir !== sap.ui.core.TextDirection.Inherit){
			rm.writeAttribute("dir", sTextDir.toLowerCase());
		}

		// style for width
		var sWidth = oLabel.getWidth();
		if (sWidth) {
			rm.addStyle("width", sWidth);
		} else {
			rm.addClass("sapMLabelMaxWidth");
		}

		// style for text alignment
		var sTextAlign = oLabel.getTextAlign();
		if (sTextAlign) {
			var sTextAlign = r.getTextAlign(sTextAlign, sTextDir);
			if (sTextAlign) {
				rm.addStyle("text-align", sTextAlign);
			}
		}

		var sLabelText = oLabel.getText();
		if (sLabelText == "") {
			rm.addClass("sapMLabelNoText");
		}

		rm.writeStyles();
		rm.writeClasses();

		var sTooltip = oLabel.getTooltip_AsString();
		if (sTooltip) {
			rm.writeAttributeEscaped("title", sTooltip);
		}

		rm.write(">");

		// write the label text

		if (sLabelText) {
			rm.writeEscaped(sLabelText);
		}
		rm.write("</label>");
	};

	/**
	 * Dummy inheritance of static methods/functions.
	 * @see sap.ui.core.Renderer.getTextAlign
	 * @private
	 */
	LabelRenderer.getTextAlign = Renderer.getTextAlign;

	return LabelRenderer;

}, /* bExport= */ true);
