/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides default renderer for control sap.ui.commons.TextView
sap.ui.define(['jquery.sap.global', 'sap/ui/core/Renderer'],
	function(jQuery, Renderer) {
	"use strict";


	/**
	 * TextView renderer.
	 * @author SAP SE
	 * @namespace
	 */
	var TextViewRenderer = {
	};
	
	/**
	 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} oRenderManager The RenderManager that can be used for writing to the render output buffer.
	 * @param {sap.ui.core.Control} oTextView An object representation of the control that should be rendered.
	 */
	TextViewRenderer.render = function(oRenderManager, oTextView) {
		var rm = oRenderManager;
		var r = TextViewRenderer;
	
		// Get parameters
		var enabled = oTextView.getEnabled() === true,
			oDesign = oTextView.getDesign();
	
		// Enable/disable
		if (!enabled) {
			rm.addClass("sapUiTvDsbl");
			oTextView.allowTextSelection(false);
		} else { // Show error/warning states if they are enabled
			// error/warning state
			switch (oTextView.getSemanticColor()) {
			case (sap.ui.commons.TextViewColor.Negative) :
				rm.addClass('sapUiTvErr');
				break;
			case (sap.ui.commons.TextViewColor.Positive) :
				rm.addClass('sapUiTvSucc');
				break;
			case (sap.ui.commons.TextViewColor.Critical) :
				rm.addClass('sapUiTvWarn');
				break;
			// no default
			}
		}
	
		// Styles
		var TextViewDesign = sap.ui.commons.TextViewDesign;
		if (oDesign != TextViewDesign.Standard) {
			if (oDesign === TextViewDesign.Bold) {
				rm.addClass("sapUiTvEmph");
			} else if (oDesign === TextViewDesign.H1) {
				rm.addClass("sapUiTvH1");
			} else if (oDesign === TextViewDesign.H2) {
				rm.addClass("sapUiTvH2");
			} else if (oDesign === TextViewDesign.H3) {
				rm.addClass("sapUiTvH3");
			} else if (oDesign === TextViewDesign.H4) {
				rm.addClass("sapUiTvH4");
			} else if (oDesign === TextViewDesign.H5) {
				rm.addClass("sapUiTvH5");
			} else if (oDesign === TextViewDesign.H6) {
				rm.addClass("sapUiTvH6");
			} else if (oDesign === TextViewDesign.Italic) {
				rm.addClass("sapUiTvItalic");
			} else if (oDesign === TextViewDesign.Small) {
				rm.addClass("sapUiTvSmall");
			} else if (oDesign === TextViewDesign.Monospace) {
				rm.addClass("sapUiTvMono");
			} else if (oDesign === TextViewDesign.Underline) {
				rm.addClass("sapUiTvULine");
			}
		}
	
		if (!oTextView.getWrapping()) {
			rm.addClass("sapUiTvWrap");
		}
	
		if (oTextView.getWidth() && oTextView.getWidth() != '') {
			rm.addStyle("width", oTextView.getWidth());
		}
	
		rm.write("<span");
		rm.writeControlData(oTextView);
	
		rm.addClass("sapUiTv");
	
		if (oTextView.getTooltip_AsString()) {
			rm.writeAttributeEscaped("title", oTextView.getTooltip_AsString());
		} else if (oTextView.getText()) {
			rm.writeAttributeEscaped("title", oTextView.getText());
		}
	
		// Appearance
		var sTextDir = oTextView.getTextDirection();
		if (sTextDir) {
			rm.addStyle("direction", sTextDir.toLowerCase());
		}
	
		var sAlign = r.getTextAlign(oTextView.getTextAlign(), sTextDir);
		if (sAlign) {
			// use class because it's easier to overwrite
			sAlign = sAlign.charAt(0).toUpperCase() + sAlign.substring(1);
			rm.addClass("sapUiTvAlign" + sAlign);
		}
	
		// Make control focusable via tab
		// according to Stefan Schnabel there shall not be a tabstop   rm.writeAttribute('tabindex', tabIndex);
		rm.writeAttribute('tabindex', '-1'); //to make it focusable in ItemNavigation
		// Set Accessible Role
		rm.writeAccessibilityState(oTextView, {
			role: oTextView.getAccessibleRole() ? oTextView.getAccessibleRole().toLowerCase() : undefined,
			invalid: oTextView.getSemanticColor() == sap.ui.commons.TextViewColor.Negative,
			disabled: !oTextView.getEnabled()
		});
	
		rm.writeClasses();
		rm.writeStyles();
		rm.write(">");
		rm.writeEscaped(oTextView.getText(), true);
		rm.write("</span>");
	
	};
	
	/**
	 * Dummy inheritance of static methods/functions.
	 * @see sap.ui.core.Renderer.getTextAlign
	 * @private
	 */
	TextViewRenderer.getTextAlign = Renderer.getTextAlign;

	return TextViewRenderer;

}, /* bExport= */ true);
