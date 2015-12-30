/*!

* UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.

*/
sap.ui.define(['jquery.sap.global'],
	function(jQuery) {
	"use strict";


	/**
	 * Token renderer. 
	 * @namespace
	 */
	var TokenRenderer = {
	};
	
	
	/**
	 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
	 * 
	 * @param {sap.ui.core.RenderManager} oRm the RenderManager that can be used for writing to the render output buffer
	 * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
	 */
	TokenRenderer.render = function(oRm, oControl){
		// write the HTML into the render manager
		oRm.write("<div tabindex=\"-1\"");
		oRm.writeControlData(oControl);
		oRm.addClass("sapMToken");
		oRm.writeClasses();

		oRm.writeAttribute("role", "listitem");
		oRm.writeAttribute("aria-readonly", !oControl.getEditable());
		oRm.writeAttribute("aria-selected", oControl.getSelected());
		
		if (oControl.getSelected()) {
			oRm.addClass("sapMTokenSelected");
		}
		
		// add tooltip if available
		var sTooltip = oControl.getTooltip_AsString();
		if (sTooltip) {
			oRm.writeAttributeEscaped("title", sTooltip);
		}
		
		var oAccAttributes = {}; // additional accessibility attributes

		//ARIA attributes
		oAccAttributes.describedby = {
			value: oControl._sAriaTokenLabelId,
			append: true
		};
		
		if (oControl.getEditable()) {
			oAccAttributes.describedby = {
					value: oControl._sAriaTokenDeletableId,
					append: true
			};
		}

		oRm.writeAccessibilityState(oControl, oAccAttributes);
		
		oRm.write(">");
	
		TokenRenderer._renderInnerControl(oRm, oControl);
		
		if (oControl.getEditable()) {
			oRm.renderControl(oControl._deleteIcon);
		}
		
		oRm.write("</div>");
	};
	
	/**
	 * Renders the inner HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
	 * 
	 * @param {sap.ui.core.RenderManager} oRm the RenderManager that can be used for writing to the render output buffer
	 * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
	 */
	TokenRenderer._renderInnerControl = function(oRm, oControl){
		var sTextDir = oControl.getTextDirection();
		
		oRm.write("<span");
		oRm.addClass("sapMTokenText");
		oRm.writeClasses();
		// set text direction
		if (sTextDir !== sap.ui.core.TextDirection.Inherit) {
			oRm.writeAttribute("dir", sTextDir.toLowerCase());
		}
		oRm.write(">");
		
		var title = oControl.getText();
		if (title) {
			oRm.writeEscaped(title);
		}
		oRm.write("</span>");
	};
	

	return TokenRenderer;

}, /* bExport= */ true);
