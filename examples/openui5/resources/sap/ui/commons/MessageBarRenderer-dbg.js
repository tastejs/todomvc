/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides default renderer for control sap.ui.commons.MessageBar
sap.ui.define(['jquery.sap.global', 'sap/ui/core/Popup'],
	function(jQuery, Popup) {
	"use strict";

//jQuery.sap.require("sap.ui.commons.MessageType");
	
	/**
	 * MessageBar renderer.
	 * @namespace
	 */
	var MessageBarRenderer = {
	};
	
	
	/**
	 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} oRenderManager the RenderManager that can be used for writing to the Render-Output-Buffer
	 * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
	 */
	MessageBarRenderer.render = function(oRenderManager, oControl){
	  // Convenience variables
		var rm  = oRenderManager;
		var id  = oControl.getId();
	
		// Opening the outer DIV container:
		// (Marking it as "draggable" stops the browser text selection on drag.)
		rm.write('<div draggable="true"');
	  rm.writeControlData(oControl);
	  rm.addClass("sapUiMsgBar");
	  if (this.oDropPosition) {
		// A "re-dock" image will be added if the MessageBar has been dragged.
		rm.addClass("sapUiMsgBarMoved");
	  }
	  rm.writeClasses();
	  rm.write(">");
	
			// Opening the counters&icons DIV container:
			// (An "id" is provided as the Toast will have to right-align against this element.)
			rm.write('<div id="' + id + '__sums" class="sapUiMsgBarSums">');
	
			  // Open-Hide message list arrow:
				// (An "id" is provided as the Toast will have to point-back towards this element.)
				// (This "Arrow" image is state-dependent and theme-dependent.)
				rm.write('<div id="' + id + '__arrowImg" class="sapUiMsgBarToggle"></div>');
	
			  // Error area: Image and Error count.
				// IDs are provided for DOM updates: display:none and count.
				rm.write('<div id="' + id + '__ErrorImg" class="sapUiMsgIcon sapUiMsgIconError sapUiMsgBarZeroCount"></div>');
				rm.write('<span id="' + id + '__ErrorCount" class="sapUiMsgTxt sapUiMsgBarZeroCount">(0)</span>');
	
			  // Warning area: Image and Warning count.
				rm.write('<div id="' + id + '__WarningImg" class="sapUiMsgIcon sapUiMsgIconWarning sapUiMsgBarZeroCount"></div>');
				rm.write('<span id="' + id + '__WarningCount" class="sapUiMsgTxt sapUiMsgBarZeroCount">(0)</span>');
	
			  // Success area: Image and Success count.
				rm.write('<div id="' + id + '__SuccessImg" class="sapUiMsgIcon sapUiMsgIconSuccess sapUiMsgBarZeroCount"></div>');
				rm.write('<span id="' + id + '__SuccessCount" class="sapUiMsgTxt sapUiMsgBarZeroCount">(0)</span>');
	
			// Closing the counters&icons DIV container:
		  rm.write("</div>");
	
		  // Re-dock icon: Appears after Drag&Drop.
			rm.write('<div class="sapUiMsgBarHome"></div>');
	
		// Closing the outer DIV container:
	  rm.write("</div>");
	};

	return MessageBarRenderer;

}, /* bExport= */ true);
