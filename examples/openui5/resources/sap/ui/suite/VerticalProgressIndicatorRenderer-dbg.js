/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// provides default renderer for sap.ui.suite.VerticalProgressIndicator
sap.ui.define(['jquery.sap.global'],
	function(jQuery) {
	"use strict";


	/**
	 * VerticalProgressIndicator renderer. 
	 * @namespace
	 */
	var VerticalProgressIndicatorRenderer = {
	};
	
	
	/**
	 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
	 * 
	 * @param {sap.ui.core.RenderManager} oRenderManager the RenderManager that can be used for writing to the Render-Output-Buffer
	 * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
	 */
	VerticalProgressIndicatorRenderer.render = function(oRenderManager, oControl){
	    // convenience variable
		var rm = oRenderManager;
		
		//calculate percentage
	    var VerticalPercent = oControl.getPercentage();
	    if (VerticalPercent < 0 || VerticalPercent == Number.NaN) {
				VerticalPercent = 0;
	    }
	    if (VerticalPercent > 100) {
				VerticalPercent = 100;
	    }
	    var PixelDown = Math.round(VerticalPercent * 58 / 100);
	    var PixelUp   = 58 - PixelDown;
	    var PercentageString = VerticalPercent.toString();
	
		// write the HTML into the render manager  
	    rm.write("<DIV");
	    rm.writeControlData(oControl);
	    rm.writeAttribute('tabIndex', '0');
	
		if (oControl.getTooltip_AsString()) {
			rm.writeAttributeEscaped("title", oControl.getTooltip_AsString());
		} else {
			rm.writeAttributeEscaped("title", PercentageString);
		}
	    
	    //ARIA
	    if ( sap.ui.getCore().getConfiguration().getAccessibility()) {
		  rm.writeAttribute('role', 'progressbar');
	      rm.writeAccessibilityState(oControl, {valuemin: '0%'});
		  rm.writeAccessibilityState(oControl, {valuemax: '100%'});
		  rm.writeAccessibilityState(oControl, {valuenow: VerticalPercent + '%'});
		}
	    
	    rm.writeAttribute("class","sapUiVerticalProgressOuterContainer");
	    rm.write(">"); // Outer DIV element
	    rm.write("<DIV");
	    rm.writeAttribute('id', oControl.getId() + '-bar');
	    rm.writeAttribute("class","sapUiVerticalProgressInnerContainer");
	    rm.addStyle("top", PixelUp + "px");
	    rm.addStyle("height", PixelDown + "px");
	    rm.writeClasses();
	    rm.writeStyles();
	    rm.write(">"); // Inner DIV element
	    rm.write("</DIV>");
	    rm.write("</DIV>");
	
	};
	

	return VerticalProgressIndicatorRenderer;

}, /* bExport= */ true);
