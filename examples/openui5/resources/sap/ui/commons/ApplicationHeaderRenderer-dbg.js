/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides default renderer for control sap.ui.commons.ApplicationHeader
sap.ui.define(['jquery.sap.global'],
	function(jQuery) {
	"use strict";


	/**
	 * ApplicationHeader renderer.
	 * @namespace
	 */
	var ApplicationHeaderRenderer = {};

	/**
	 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
	 * @param {sap.ui.core.RenderManager} oRenderManager the RenderManager that can be used for writing to the Render-Output-Buffer
	 * @param {sap.ui.core.Control} oAppHeader an object representation of the control that should be rendered
	 */
	ApplicationHeaderRenderer.render = function(oRenderManager, oAppHeader){

		if (!this.initializationDone) {
			oAppHeader.initControls();
			oAppHeader.initializationDone = true;
		}

		var appHeaderId = oAppHeader.getId();

		//Write the HTML into the render manager
		oRenderManager.write("<header");
		oRenderManager.writeControlData(oAppHeader);
		oRenderManager.addClass("sapUiAppHdr");
		oRenderManager.writeClasses();
		oRenderManager.write(">");

		//Welcome and logoff areas
		oRenderManager.write("<div id=\"" + appHeaderId + "-appHeaderWelcomeLogoffAreas\" class=\"sapUiAppHdrWelcomeLogoffArea sapUiInverted-CTX\">");
		this.renderWelcomeAndLogoffAreas(oRenderManager, oAppHeader);
		oRenderManager.write("</div>"); //End welcome and logout areas

		//Logo area
		oRenderManager.write("<div id=\"" + appHeaderId + "-logoArea\" class=\"sapUiAppHdrLogo\">");
		this.renderLogoArea(oRenderManager,oAppHeader);
		oRenderManager.write("</div>");

		oRenderManager.write("</header>");

	};

	/**
	 * Renders the HTML for the logo area (Logo src and text if any)
	 * @param {sap.ui.core.RenderManager} oRenderManager the RenderManager that can be used for writing to the Render-Output-Buffer
	 * @param {sap.ui.core.Control} oAppHeader an object representation of the control that should be rendered
	 */
	ApplicationHeaderRenderer.renderLogoArea = function(oRenderManager, oAppHeader){

		//Add the logo, but first set the source to the right path
		var sSrc = oAppHeader.getLogoSrc();
		if (!sSrc) {
			jQuery.sap.require("sap.ui.core.theming.Parameters");
			sSrc = sap.ui.core.theming.Parameters._getThemeImage(); // theme logo
		}
		if (!sSrc) {
			sSrc = sap.ui.resource("sap.ui.commons", "themes/" + sap.ui.getCore().getConfiguration().getTheme() + "/img/applicationheader/SAPLogo.png");
		}

		oAppHeader.oLogo.setSrc(sSrc);
		oRenderManager.renderControl(oAppHeader.oLogo);

		//Insert the logo text if any provided by application
		if (oAppHeader.getLogoText() != "") {
			oAppHeader.oLogoText.setText(oAppHeader.getLogoText());
			oAppHeader.oLogoText.setTooltip(oAppHeader.getLogoText());
			oRenderManager.renderControl(oAppHeader.oLogoText);
		}

	};

	/**
	 * Renders the HTML for the welcome and logoff areas
	 * @param {sap.ui.core.RenderManager} oRenderManager the RenderManager that can be used for writing to the Render-Output-Buffer
	 * @param {sap.ui.core.Control} oAppHeader an object representation of the control that should be rendered
	 */
	ApplicationHeaderRenderer.renderWelcomeAndLogoffAreas = function(oRenderManager, oAppHeader){

		var appHeaderId = oAppHeader.getId();

		//Check if the Welcome text is requested
		if (oAppHeader.getDisplayWelcome()) {

			var rb = sap.ui.getCore().getLibraryResourceBundle("sap.ui.commons");

			var padding = sap.ui.getCore().getConfiguration().getRTL() ? "padding-left" : "padding-right";

			//Add the user name if provided
			if (oAppHeader.getUserName() != "") {
				oRenderManager.write("<label class=\"sapUiLbl sapUiLblEmph\" style=\"text-align: left;\" id=\"" + appHeaderId + "-welcomeLabel\">" +
									  rb.getText("APPHDR_WELCOME_USER") + ":</label>");
				oRenderManager.write("&nbsp;");
				oRenderManager.write("<label class=\"sapUiLbl\" style=\"text-align: left;", padding, ":15px;\" id=\"", appHeaderId, "-userLabel\">");
				oRenderManager.writeEscaped(oAppHeader.getUserName());
				oRenderManager.write("</label>");
			} else {
				oRenderManager.write("<label class=\"sapUiLbl sapUiLblEmph\" style=\"text-align: left;" + padding + ":15px;\" id=\"" + appHeaderId + "-welcomeLabel\">" +
									  rb.getText("APPHDR_WELCOME") + "</label>");
			}
		}

		//Logout area
		if (oAppHeader.getDisplayLogoff()) {

			//Display the separator only when the welcome area is displayed as well
			if (oAppHeader.getDisplayWelcome()) {
				oRenderManager.write("<span role=\"separator\" class=\"sapUiTbSeparator\"></span>");
			}
			oRenderManager.renderControl(oAppHeader.oLogoffBtn);
		}

	};

	return ApplicationHeaderRenderer;

}, /* bExport= */ true);
