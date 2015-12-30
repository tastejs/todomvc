/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides default renderer for control sap.ui.commons.Label
sap.ui.define(['jquery.sap.global', 'sap/ui/core/Renderer'],
	function(jQuery, Renderer) {
	"use strict";


	
	/**
	 * @author SAP SE
	 * @namespace
	 */
	var LabelRenderer = {
	//	sap.ui.core.Renderer.apply(this, arguments);
	};
	
	/**
	 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} oRenderManager The RenderManager that can be used for writing to the render-output-buffer.
	 * @param {sap.ui.core.Control} oLabel An object representation of the control that should be rendered.
	 */
	LabelRenderer.render = function(oRenderManager, oLabel) {
		// Some convenience variables.
		var rm = oRenderManager;
		var r = LabelRenderer;
	
		rm.write("<label");
		rm.writeControlData(oLabel);
	
		sap.ui.core.LabelEnablement.writeLabelForAttribute(oRenderManager, oLabel);
		
		var oFor = oLabel._getLabeledControl();
		var sTooltip = oLabel.getTooltip_AsString();
		
		if ((!sTooltip || sTooltip == "") && oFor && oFor.getTooltip_AsString() && oFor.getTooltip_AsString() != "") {
			// If label has no own tooltip use tooltip of the labeled control
			sTooltip = oFor.getTooltip_AsString();
		}
	
		// check whether a 'required' marker is needed
		if ( oLabel.isRequired() ) {
			rm.addClass('sapUiLblReq');
			if (oLabel.getRequiredAtBegin()) {
				rm.addClass('sapUiLblReqBeg');
			} else {
				rm.addClass('sapUiLblReqEnd');
			}
		}
	
		if (sTooltip) {
			rm.writeAttributeEscaped('title', sTooltip);
		}
	
		// Styles
		rm.addClass("sapUiLbl");
		if (oLabel.getDesign() == sap.ui.commons.LabelDesign.Bold) {
			rm.addClass("sapUiLblEmph");
		}
	
		// Text direction
		var sTextDir = oLabel.getTextDirection();
		if (sTextDir) {
			rm.addStyle("direction", sTextDir.toLowerCase());
		}
	
		// Style for text alignment
		var sTextAlign = r.getTextAlign(oLabel.getTextAlign(), sTextDir);
		if (sTextAlign) {
			rm.addStyle("text-align", sTextAlign);
		}
	
		// Style for width
		var sWidth = oLabel.getWidth();
		if (sWidth) {
			rm.addStyle("width", sWidth);
		}
	
		if (!oLabel.getWrapping()) {
			rm.addClass("sapUiLblNowrap");
		}
	
		rm.writeStyles();
		rm.writeClasses();
	
		// Close start tag
		rm.write(">");
	
		// Get image fragment if there is one, and write
		if (oLabel.getIcon()) {
			this.writeImgHtml(rm, oLabel);
		}
	
		// Write the label text
		if (oLabel.getText()) {
			rm.writeEscaped(oLabel.getText());
		}
	
		// Close tag
		rm.write("</label>");
	};
	
	
	LabelRenderer.writeImgHtml = function(oRenderManager, oLabel) {
		var rm = oRenderManager;
		var sIconUrl = oLabel.getIcon();
		var oConfig = oRenderManager.getConfiguration();
		var aClasses = [];
		var mAttributes = {
			"title": null
		};
	
		aClasses.push("sapUiLblIco");
		if ((oLabel.getTextDirection() == sap.ui.core.TextDirection.RTL && !oConfig.getRTL()) || (oLabel.getTextDirection() == sap.ui.core.TextDirection.LTR && oConfig.getRTL())) {
			// if text direction is different to global text direction, icon margin must be switched.
			aClasses.push("sapUiLblIcoR");
		} else {
			aClasses.push("sapUiLblIcoL");
		}
	
		rm.writeIcon(sIconUrl, aClasses, mAttributes);
	
	};
	
	/**
	 * Dummy inheritance of static methods/functions.
	 * @see sap.ui.core.Renderer.getTextAlign
	 * @private
	 */
	LabelRenderer.getTextAlign = Renderer.getTextAlign;
	

	return LabelRenderer;

}, /* bExport= */ true);
