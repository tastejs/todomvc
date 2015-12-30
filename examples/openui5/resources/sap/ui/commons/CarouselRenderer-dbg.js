/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides default renderer for control sap.ui.commons.Carousel
sap.ui.define(['jquery.sap.global'],
	function(jQuery) {
	"use strict";


	/**
	 * carousel renderer.
	 * @namespace
	 */
	var CarouselRenderer = {
	};


	/**
	 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} oRenderManager the RenderManager that can be used for writing to the Render-Output-Buffer
	 * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
	 */
	CarouselRenderer.render = function(oRenderManager, oControl) {

		var rm = oRenderManager;
		var bRTL = sap.ui.getCore().getConfiguration().getRTL();

		rm.write("<div");
		rm.addClass("sapUiCrsl");
		if (oControl.getWidth() != "") {
			rm.addStyle("width", oControl.getWidth());
		}
		if (oControl.getHeight() != "") {
			rm.addStyle("height", oControl.getHeight());
		}
		rm.writeStyles();
		rm.writeClasses();
		rm.writeControlData(oControl);
		rm.write(">");

		var rb = sap.ui.getCore().getLibraryResourceBundle("sap.ui.commons");

		// Start Prev button
		rm.write("<div");
		rm.writeAttribute("id", oControl.getId() + "-prevbutton");
		rm.writeAttribute("title", rb.getText("CAROUSEL_SHOW_PREV"));
		rm.addClass("sapUiCrslPrevBtn");
		rm.writeClasses();
		if (oControl.getHandleSize() != 22) {
			if (oControl.getOrientation() == "vertical") {
				rm.addStyle("height",oControl.getHandleSize() + "px");
			} else {
				rm.addStyle("width",oControl.getHandleSize() + "px");
			}
			rm.writeStyles();
		}
		rm.write(">");
		if (oControl.getOrientation() == "vertical") {
			rm.write("&#9650");//Symbol for Base and HCB Theme (Must be hidden in other themes)
		} else {
			if (bRTL) {
				rm.write("&#9658");//Symbol for Base and HCB Theme (Must be hidden in other themes)
			} else {
				rm.write("&#9668");//Symbol for Base and HCB Theme (Must be hidden in other themes)
			}
		}
		rm.write("</div>");
		// End Prev button

		// Start Next button
		rm.write("<div");
		rm.writeAttribute("id", oControl.getId() + "-nextbutton");
		rm.writeAttribute("title", rb.getText("CAROUSEL_SHOW_NEXT"));
		rm.addClass("sapUiCrslNextBtn");
		rm.writeClasses();
		if (oControl.getHandleSize() != 22) {
			if (oControl.getOrientation() == "vertical") {
				rm.addStyle("height",oControl.getHandleSize() + "px");
			} else {
				rm.addStyle("width",oControl.getHandleSize() + "px");
			}
			rm.writeStyles();
		}
		rm.write(">");
		if (oControl.getOrientation() == "vertical") {
			rm.write("&#9660");//Symbol for Base and HCB Theme (Must be hidden in other themes)
		} else {
			if (bRTL) {
				rm.write("&#9668");//Symbol for Base and HCB Theme (Must be hidden in other themes)
			} else {
				rm.write("&#9658");//Symbol for Base and HCB Theme (Must be hidden in other themes)
			}
		}
		rm.write("</div>");
		// End Next button

		// Start content area
		rm.write("<div");
		rm.writeAttribute("id", oControl.getId() + "-contentarea");
		rm.addClass("sapUiCrslCnt");
		rm.writeClasses();
		rm.write(">");

		var aContent = oControl.getContent();

		rm.write("<ul");
		rm.writeAttribute("id", oControl.getId() + "-scrolllist");
		rm.writeAttribute("role", "listbox");
		rm.writeAttribute("aria-describedby", oControl.getId() + "-navigate");
		rm.addClass("sapUiCrslScl");
		rm.writeClasses();
		rm.write(">");

		for ( var index = 0; index < aContent.length; index++) {
			var oChild = aContent[index];
			rm.write("<li");
			rm.writeAttribute("id",oControl.getId() + "-item-" + oChild.getId());

			// ARIA
			rm.writeAccessibilityState(oControl, {
				role: "option",
				posinset: index + 1,
				setsize: aContent.length,
				labelledby: oControl.getId() + "-toggleaction"
			});

			rm.writeAttribute("tabindex", "-1");
			rm.addClass("sapUiCrslItm");
			rm.writeClasses();
			rm.write(">");
			rm.renderControl(oChild);
			rm.write("</li>");
		}

		rm.write("</ul>");

		rm.write("</div>");
		// End content area

		rm.write("<div");
		rm.writeAttribute("tabindex", "0");
		rm.addClass("sapUiCrslBefore");
		rm.writeClasses();
		rm.write("></div>");

		rm.write("<div");
		rm.writeAttribute("tabindex", "0");
		rm.addClass("sapUiCrslAfter");
		rm.writeClasses();
		rm.write("></div>");

		// aria description for toggling the action mode
		rm.write("<span");
		rm.writeAttribute("id", oControl.getId() + "-toggleaction");
		rm.addStyle("position", "absolute");
		rm.addStyle("top", "-20000px");
		rm.writeStyles();
		rm.write(">");
		rm.write(rb.getText("CAROUSEL_ACTION_MODE"));
		rm.write("</span>");

		// aria description for navigation
		rm.write("<span");
		rm.writeAttribute("id", oControl.getId() + "-navigate");
		rm.addStyle("position", "absolute");
		rm.addStyle("top", "-20000px");
		rm.writeStyles();
		rm.write(">");
		rm.write(rb.getText("CAROUSEL_NAV"));
		rm.write("</span>");

		rm.write("</div>");
	};

	return CarouselRenderer;

}, /* bExport= */ true);
