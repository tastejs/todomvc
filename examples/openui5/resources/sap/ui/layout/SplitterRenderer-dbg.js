/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global'],
	function(jQuery) {
	"use strict";


	/**
	 * Splitter renderer. 
	 * @namespace
	 */
	var SplitterRenderer = {
	};
	
	
	/**
	 * Renders the main HTML element for the Splitter control and everything else is rendered in a
	 * hidden area inside the splitter. The content of that hidden area is shown after rendering to
	 * avoid flickering.
	 * 
	 * @param {sap.ui.core.RenderManager} oRm the RenderManager that can be used for writing to the render output buffer
	 * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
	 */
	SplitterRenderer.render = function(oRm, oControl){
		var bHorizontal       = oControl.getOrientation() === sap.ui.core.Orientation.Horizontal;
		var sOrientationClass = bHorizontal ? "sapUiLoSplitterH" : "sapUiLoSplitterV";
		var bAnimate          = sap.ui.getCore().getConfiguration().getAnimation();
		
		
		// Make sure we have the main element available before rendering the children so we can use 
		// the element width to calculate before rendering the children.
		oRm.write("<div");
		oRm.writeControlData(oControl);
		oRm.addClass("sapUiLoSplitter");
		oRm.addClass(sOrientationClass);
		if (bAnimate && !oControl._liveResize) {
			// Do not animate via CSS when liveResize is enabled
			oRm.addClass("sapUiLoSplitterAnimated");
		}
		oRm.writeClasses();
		oRm.addStyle("width", oControl.getWidth());
		oRm.addStyle("height", oControl.getHeight());
		oRm.writeStyles();
		oRm.write(">"); // main div
		
		this.renderInitialContent(oRm, oControl);
		
		oRm.write("</div>"); // main control
	};
	
	SplitterRenderer.renderInitialContent = function(oRm, oControl) {
		var sId         = oControl.getId();
		var bHorizontal = oControl.getOrientation() === sap.ui.core.Orientation.Horizontal;
		var sSizeType   = bHorizontal ? "width" : "height";
		var sGripIcon = "sap-icon://" + (bHorizontal ? "horizontal" : "vertical") + "-grip";
	
		var aContents = oControl.getContentAreas();
		var iLen = aContents.length;
		var aCalculatedSizes = oControl.getCalculatedSizes();
		for (var i = 0; i < iLen; ++i) {
			var oLayoutData = aContents[i].getLayoutData();
			var sSize = "0";
			if (aCalculatedSizes[i]) {
				// Use precalculated sizes if available
				sSize = aCalculatedSizes[i] + "px";
			} else if (oLayoutData) {
				sSize = oLayoutData.getSize();
			}
			
			// Render content control
			oRm.write(
				"<section " +
				"id=\"" + sId + "-content-" + i + "\" " +
				"style=\"" + sSizeType + ": " + sSize + ";\" " +
				"class=\"sapUiLoSplitterContent\">"
			);
			oRm.renderControl(aContents[i]);
			oRm.write("</section>");
			
			if (i < iLen - 1) {
				// Render splitter if this is not the last control
				oRm.write(
					"<div id=\"" + sId + "-splitbar-" + i + "\" " +
						"role=\"separator\" " +
						"title=\"" + oControl._getText("SPLITTER_MOVE") + "\" " +
						"class=\"sapUiLoSplitterBar\" " +
						"aria-orientation=\"" + (bHorizontal ? "vertical" : "horizontal") + "\" " +
						"tabindex=\"0\">"
				);
				// Icon ID must start with sId + "-splitbar-" + i so that the target is recognized for resizing
				oRm.writeIcon(sGripIcon, "sapUiLoSplitterBarIcon", {
					"id" : sId + "-splitbar-" + i + "-icon",
					// prevent any tooltip / ARIA attributes on the icon as they
					// are already set on the outer div
					"title" : null,
					"aria-label" : null
				});
				oRm.write("</div>");
			}
		}
		
		oRm.write(
			"<div id=\"" + sId + "-overlay\" class=\"sapUiLoSplitterOverlay\" style=\"display: none;\">" +
			"<div id=\"" + sId + "-overlayBar\" class=\"sapUiLoSplitterOverlayBar\">"
		);
		// Icon ID must start with sId + "-splitbar" so that the target is recognized for resizing
		oRm.writeIcon(sGripIcon, "sapUiLoSplitterBarIcon", {
			"id" : sId + "-splitbar-Overlay-icon",
			// prevent any tooltip / ARIA attributes on the icon as they
			// are already set on the outer div
			"title" : null,
			"aria-label" : null
		});
		oRm.write(
			"</div>" +
			"</div>"
		);
		
	};
	
	

	return SplitterRenderer;

}, /* bExport= */ true);
