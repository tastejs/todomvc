/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// A renderer for the ScrollBar control
sap.ui.define(['jquery.sap.global', 'sap/ui/Device'],
	function(jQuery, Device) {
	"use strict";


	/**
	 * @class ScrollBar renderer.
	 * @static
	 * @alias sap.ui.core.ScrollBarRenderer
	 */
	var ScrollBarRenderer = {
	};
	
	
	/**
	 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} oRenderManager RenderManager that can be used for writing to the Render-Output-Buffer
	 * @param {sap.ui.core.Control} oControl Object representation of the control that should be rendered
	 */
	ScrollBarRenderer.render = function(oRenderManager, oScrollBar){
	
		// convenience variable
		var rm = oRenderManager;
		var bRTL = sap.ui.getCore().getConfiguration().getRTL();
	
	
		rm.addClass("sapUiScrollBar");
		
		var sScrollBarTouchClass;
		if (Device.support.touch) {
			sScrollBarTouchClass = "sapUiScrollBarTouch";
			rm.addClass(sScrollBarTouchClass);
		}
	
		// Get Properties
		var bVertical = oScrollBar.getVertical();
		var sSize = oScrollBar.getSize();
		var sContentSize = oScrollBar.getContentSize();
		
		var oBSS = jQuery.sap.scrollbarSize(sScrollBarTouchClass);
		var sWidth = oBSS.width;
		var sHeight = oBSS.height;
	
		if (bVertical) {
			// First div. <div style="overflow:hidden;width:16px;height:200px">
			rm.write("<div");
			rm.writeControlData(oScrollBar);
			rm.write(" style=\"overflow:hidden;width:" + sWidth + "px");
			if (sSize) {
				rm.write(";height:" + sSize);
			}
			rm.write("\"");
			rm.writeClasses();
			rm.write(">");
	
			// Middle div - ScrollBar itself.
			rm.write("<div ");
			rm.writeAttribute( "id", oScrollBar.getId() + "-sb");
			rm.write(" style=\"width:" + sWidth * 2 + "px;height:100%;overflow-y:scroll;overflow-x:hidden");
			if (bRTL) {
				//right to left mode. Special handling for mozilla 3.6 and safari - do not render right margin
				if ((!(!!Device.browser.firefox && Device.browser.version == 3.6)) && (!Device.browser.safari)) {
					rm.write(";margin-right:-" + sWidth + "px");
				}
			} else {
				rm.write(";margin-left:-" + sWidth + "px;");
			}
			rm.write("\">");
	
			//Last div - The content div <div style="height:1000px;width:16px"></div>
			rm.write("<div");
			rm.writeAttribute( "id", oScrollBar.getId() + "-sbcnt");
			rm.write(" style=\"width:" + sWidth + "px");
			if (sContentSize) {
				rm.write(";height:" + sContentSize);
			}
			rm.write("\"");
			rm.write(">");
			rm.write("</div>");
			rm.write("</div>");
	
			rm.write("<div> <span id=" + oScrollBar.getId() + "-ffsize" + " style='position: absolute; top: -9000px; left: -9000px; visibility: hidden; line-height: normal;'> FF Size</span></div>");
			rm.write("</div>");
	
		} else {
	
			// Horizontal Scrollbar
			// First div.    <div style="width:200px;height:16px;overflow:hidden">
			rm.write("<div");
			rm.writeControlData(oScrollBar);
			rm.write(" style=\"overflow:hidden;height:" + sHeight + "px");
			if (sSize) {
				rm.write(";width:" + sSize);
			}
			rm.write("\"");
			rm.writeClasses();
			rm.write(">");
	
			// Middle div - ScrollBar itself.
			rm.write("<div ");
			rm.writeAttribute( "id", oScrollBar.getId() + "-sb");
			rm.write(" style=\"height:" + sHeight * 2 + "px;margin-top:-" + sHeight + "px;overflow-x:scroll;overflow-y:hidden\">");
	
			//Last div - The content div   <div style="width:1000px;height:16px;"></div>
			rm.write("<div");
			rm.writeAttribute( "id", oScrollBar.getId() + "-sbcnt");
			rm.write(" style=\"height:" + sHeight + "px");
			if (sContentSize) {
				rm.write(";width:" + sContentSize);
			}
			rm.write("\"");
			rm.write(">");
			rm.write("</div>");
			rm.write("</div>");
			rm.write("</div>");
		}
	};
	
	
	/* PURE HTML EXAMPLE, FOR TESTING, FOR EXAMPLE IE9 SCROLLING PROBLEM:
	<h1>vertical</h1>
	<div style="width:16px;height:200px;overflow:hidden">
	<div style="width:32px;height:100%;margin-left:-16px;overflow-y:scroll;overflow-x:hidden" onscroll="document.getElementById('v').innerHTML = this.scrollTop">
	<div style="height:1000px;width:16px"></div>
	</div>
	</div>
	<div id="v"></div>
	
	<h1>horizontal</h1>
	<div style="width:200px;height:16px;overflow:hidden">
	<div style="width:100%;height:32px;margin-top:-16px;overflow-x:scroll;overflow-y:hidden" onscroll="document.getElementById('h').innerHTML = this.scrollLeft">
	<div style="width:1000px;height:16px;"></div>
	</div>
	</div>
	<div id="h"></div>
	
	*/

	return ScrollBarRenderer;

}, /* bExport= */ true);
