/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(['jquery.sap.global'],
	function(jQuery) {
	"use strict";


	/**
	 * CalloutBase renderer.
	 * @namespace
	 */
	var CalloutBaseRenderer = {
	};
	
	/**
	 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} oRenderManager the RenderManager that can be used for writing to the Render-Output-Buffer
	 * @param {sap.ui.core.Control} oControl an object representation of the Callout that should be rendered
	 */
	CalloutBaseRenderer.render = function(oRenderManager, oControl){
	
		var rm = oRenderManager;
		var accessibility = sap.ui.getCore().getConfiguration().getAccessibility();
		var sId = oControl.getId();
	
		//container
		rm.write("<div");
		rm.writeControlData(oControl);
	
		rm.addClass("sapUiCltBase");
		if (this.addRootClasses) {
			this.addRootClasses(rm, oControl);
		}
		rm.writeClasses();
	
		if (accessibility) {
			rm.writeAttribute("role", "dialog");
			//ARIA label
			var sAriaLabel = oControl.oRb.getText('CALLOUT_ARIA_NAME');
			if (sAriaLabel) {
				rm.writeAttributeEscaped("aria-label", sAriaLabel);
			}
		}
		if (oControl.getTooltip_AsString()) {
			rm.writeAttributeEscaped("title", oControl.getTooltip_AsString());
		}
		
		rm.addStyle("display", "none");
		rm.writeStyles();
		
		rm.write(">");
	
		//first focusable control to provide tab loop
		rm.write("<span id=\"" + sId + "-fhfe\" tabIndex=\"0\"></span>");
	
		// content container
		rm.write("<div");
		rm.writeAttribute("id",sId + "-cont");
	
		rm.addClass("sapUiCltBaseCont");
		if (this.addContentClasses) {
			this.addContentClasses(rm, oControl);
		}
		rm.writeClasses();
	
		rm.writeAttribute("tabindex","-1");
		rm.write(">");
	
		// successor controls provide content here in their specific renderContent methods
		if (this.renderContent) {
			this.renderContent(rm, oControl);
		}
		rm.write("</div>");
	
		// arrow tip
		rm.write("<div");
		rm.writeAttribute("id", sId + "-arrow");
		if (accessibility) {
			rm.writeAttribute("role", "presentation");
		}
		// specific arrow placement is specified in behavior by setting additional CSS classes
		rm.addClass("sapUiCltBaseArr");
		if (this.addArrowClasses) {
			this.addArrowClasses(rm, oControl);
		}
		rm.writeClasses();
		rm.write("></div>");
	
		//last focusable control to provide tab loop
		rm.write("<span id=\"" + sId + "-fhee\" tabIndex=\"0\"></span>");
	
		rm.write("</div>");// container
	
	};
	

	return CalloutBaseRenderer;

}, /* bExport= */ true);
