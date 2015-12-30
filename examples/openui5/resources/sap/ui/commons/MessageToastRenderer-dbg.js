/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides default renderer for control sap.ui.commons.MessageToast
sap.ui.define(['jquery.sap.global'],
	function(jQuery) {
	"use strict";


	/**
	 * MessageToast renderer.
	 * @namespace
	 */
	var MessageToastRenderer = {
	};
	
	
	/**
	 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} oRenderManager the RenderManager that can be used for writing to the Render-Output-Buffer
	 * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
	 */
	MessageToastRenderer.render = function(oRenderManager, oControl){
		// Convenience variable
		var rm = oRenderManager;
	
		// Opening the invisible outer-DIV container:
		// (Required to host the down-arrow.)
		// "classing" as per Type/Priority, for influencing the inner rendering:
		rm.write('<div class="' + oControl.getClasses() + '"');
		rm.writeControlData(oControl);
		rm.write('>');
	
			// Opening the inner-DIV message-container:
			rm.write('<div class="sapUiMsgToastMsg sapUiShd">');
	
				// Checking what message is to be toasted:
			  if (oControl.oMessage) {
				rm.renderControl(oControl.oMessage);
			  } else {
				// No message supplied. Rendering "Multiple new messages...":
					var sMultiMsgs = sap.ui.getCore().getLibraryResourceBundle("sap.ui.commons").getText("MSGTOAST_MULTI_MSGS");
					rm.write('<div class="sapUiMsg" tabindex="0"><span class="sapUiMsgTxt">' + sMultiMsgs + '</span></div>');
			  }
	
			// Closing the inner-DIV message-container:
			rm.write("</div>");
	
		  // Down-arrow:
			// (An "id" is provided as this arrow will have to point-back towards the right Bar icon.)
			// (This "Arrow" image is Type/Priority-dependent and theme-dependent.)
			rm.write('<div id="' + oControl.getId() + 'Arrow" class="sapUiMsgToastArrow"></div>');
	
		// Closing the invisible outer-DIV container:
		rm.write("</div>");
	};

	return MessageToastRenderer;

}, /* bExport= */ true);
