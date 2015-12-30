/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides default renderer for the sap.ui.ux3.ToolPopup
sap.ui.define(['jquery.sap.global'],
	function(jQuery) {
	"use strict";


	/**
	 * ToolPopup renderer.
	 * @namespace
	 */
	var ToolPopupRenderer = {
	};
	
	
	/**
	 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} oRenderManager the RenderManager that can be used for writing to the Render-Output-Buffer
	 * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
	 */
	ToolPopupRenderer.render = function(rm, oControl) {
		var rb = sap.ui.getCore().getLibraryResourceBundle("sap.ui.ux3");
		var sId = oControl.getId();
		var aContent = oControl.getContent();
		var aButtons = oControl.getButtons();
		var sTitle = oControl.getTitle();
		// there must be something to focus -> empty elements don't get a focus
		var sSrc = sap.ui.resource('sap.ui.core', 'themes/base/img/1x1.gif');
	
		// write the HTML into the render manager
		rm.write("<div");
		rm.writeControlData(oControl);
		
		rm.addClass("sapUiUx3TP");
		if (sTitle === "") {
			rm.addClass("sapUiUx3TPNoTitle");
		}
		if (aButtons.length === 0) {
			rm.addClass("sapUiUx3TPNoButtons");
		}
		if (oControl.isInverted()) {
			rm.addClass("sapUiTPInverted");
			rm.addClass("sapUiInverted-CTX");
		}
		rm.writeClasses();
		
		rm.write(" aria-labelledby='", sId, "-title ", sId, "-acc' role='dialog'");
		rm.writeAttribute("tabindex", "-1");
		
		rm.write(">"); // div element
	
		rm.write("<div id='" + sId + "-arrow' class='sapUiUx3TPArrow sapUiUx3TPArrowLeft'><div class='sapUiUx3TPArrowBorder'></div></div>");
		rm.write("<span style='display:none;' id='", sId, "-acc'>");
		rm.writeEscaped(rb.getText("DIALOG_CLOSE_HELP"));
		rm.write("</span>");
	
		// write a focusable element that can be focused if there is no focusable element within the control
		// OR if the shift+tab key is used to set the focus on the last focusable element
		rm.write('<span id="' + sId + '-firstFocusable' + '" tabindex="0" class="sapUiUxTPFocus">');
		rm.write('<img src="' + sSrc + '">');
		rm.write('</span>');
	
		// title
		if (sTitle && (sTitle.length !== "")) {
			rm.write('<div class="sapUiUx3TPTitle" id="' + sId + '-title">');
			rm.write('<span class="sapUiUx3TPTitleText">');
			rm.writeEscaped(sTitle);
			rm.write('</span>');
			rm.write('</div>');
			rm.write('<div class="sapUiUx3TPTitleSep" id="' + sId + '-title-separator"></div>');
		} else { // for accessibility reasons use tooltip as hidden label
			var sTooltip = oControl.getTooltip_AsString();
			if (sTooltip) {
				rm.write("<h1 id='" + sId + "-title' style='display:none;'>");
				rm.writeEscaped(sTooltip);
				rm.write("</h1>");
			}
		}
	
		// content
		rm.write('<div id="' + sId + '-content"');
		rm.addClass("sapUiUx3TPContent");
		rm.writeClasses();
		rm.write(">");
		
		for (var i = 0; i < aContent.length; i++) {
			rm.renderControl(aContent[i]);
		}
		rm.write('</div>');
	
		// button row
		if (aButtons.length > 0) {
			rm.write('<div class="sapUiUx3TPButtonsSep" id="' + sId + '-buttons-separator"></div>');
			rm.write('<div class="sapUiUx3TPBtnRow" id="' + sId + '-buttons">');
			for (var i = 0; i < aButtons.length; i++) {
				rm.renderControl(aButtons[i].addStyleClass("sapUiUx3TPBtn"));
			}
		} else {
			// hide button row
			rm.write('<div class="sapUiUx3TPButtonsSep sapUiUx3TPButtonRowHidden" id="' + sId + '-buttons-separator"></div>');
			rm.write('<div class="sapUiUx3TPBtnRow sapUiUx3TPButtonRowHidden" id="' + sId + '-buttons">');
		}
		rm.write("</div>");
	
		// write a focusable element that can be focused when the user uses the tab-key within ToolPopup and 
		// to set the focus to the first focusable element
		rm.write('<span id="' + sId + '-lastFocusable' + '" tabindex="0" class="sapUiUxTPFocus">');
		rm.write('<img src="' + sSrc + '">');
		rm.write('</span>');
	
		rm.write("</div>");
	};
	

	return ToolPopupRenderer;

}, /* bExport= */ true);
