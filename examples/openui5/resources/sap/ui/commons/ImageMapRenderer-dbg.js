/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(['jquery.sap.global'],
	function(jQuery) {
	"use strict";


	/**
	 * ImageMap renderer.
	 * @namespace
	 */
	var ImageMapRenderer = {
	};
	
	
	/**
	 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} oRenderManager the RenderManager that can be used for writing to the Render-Output-Buffer
	 * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
	 */
	ImageMapRenderer.render = function(oImageRenderManager, oImageMap){
	    // convenience variable
		var rm = oImageRenderManager;
		var accessibility = sap.ui.getCore().getConfiguration().getAccessibility();
		var rb = sap.ui.getCore().getLibraryResourceBundle("sap.ui.commons");
	
		rm.write('<SPAN id="' + oImageMap.getId() + '-Descr" style="visibility: hidden; display: none; outline: none;">');
		rm.writeEscaped(rb.getText("IMAGEMAP_DSC"));
		rm.write('</SPAN>');
	
		rm.write("<map tabindex='-1'");
		rm.writeControlData(oImageMap);
	
		// Render name attribute
		rm.writeAttributeEscaped("name",  oImageMap.getName());
	
		if (oImageMap.getTooltip_AsString()) {
			rm.writeAttributeEscaped("title", oImageMap.getTooltip_AsString());
		}
	
		rm.write(">");
		var aAreas = oImageMap.getAreas();
			for (var index = 0, length = aAreas.length; index < length; index++) {
				rm.write("<area ");
	
				rm.writeElementData(aAreas[index]);
				
				rm.write(' style="display: inline;"');
	
				if (accessibility) {
					rm.writeAttribute("aria-describedby", oImageMap.getId() + "-Descr");
				}
	
				
				// Get the Attributes of the area
				var sShape = aAreas[index].getShape();
				var sCoords = aAreas[index].getCoords();
				var sHref = aAreas[index].getHref();
				var sAlt = aAreas[index].getAlt();
				var sTitle = aAreas[index].getTooltip_AsString();
	
				// Render Shape Attribute. It can an be only rect, circle, poly and default
				if ( (sShape === "rect") || (sShape === "circle") || (sShape === "poly")) {
					rm.writeAttribute("shape", sShape);
				} else {
					rm.writeAttribute("shape", "default");
				}
	
				// Render Coordinates. To do: check syntax of the input array of the coordinates
				if (sCoords) {
					rm.writeAttributeEscaped("coords", sCoords);
				}
	
				// Render href
				if (sHref) {
					rm.writeAttributeEscaped("href", sHref);
				}
	
				// Render text on ALT
				if (sAlt) {
					rm.writeAttributeEscaped("alt", sAlt);
				}
	
				// Tooltip
				if (sTitle) {
					rm.writeAttributeEscaped("title", sTitle);
				}
	
	
	
				rm.writeAttribute("tabIndex", 0);
				rm.write(">");
			} // end of for
	
		rm.write("</map>");
	
	};
	

	return ImageMapRenderer;

}, /* bExport= */ true);
