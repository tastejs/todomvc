/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

 sap.ui.define(['jquery.sap.global'],
	function(jQuery) {
	"use strict";


	/**
	 * Shell renderer.
	 * @namespace
	 */
	var ShellRenderer = {
	};


	/**
	 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} rm the RenderManager that can be used for writing to the render output buffer
	 * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
	 */
	ShellRenderer.render = function(rm, oControl) {
		rm.write("<div");
		rm.writeControlData(oControl);
		rm.addClass("sapMShell");
		if (oControl.getAppWidthLimited()) {
			rm.addClass("sapMShellAppWidthLimited");
		}

		sap.m.BackgroundHelper.addBackgroundColorStyles(rm, oControl.getBackgroundColor(),  oControl.getBackgroundImage(), "sapMShellGlobalOuterBackground");

		rm.writeClasses();
		rm.writeStyles();

		var sTooltip = oControl.getTooltip_AsString();
		if (sTooltip) {
			rm.writeAttributeEscaped("title", sTooltip);
		}

		rm.write(">");

		sap.m.BackgroundHelper.renderBackgroundImageTag(rm, oControl, ["sapMShellBG", "sapUiGlobalBackgroundImageForce"],  oControl.getBackgroundImage(), oControl.getBackgroundRepeat(), oControl.getBackgroundOpacity());

		rm.write("<div class='sapMShellBrandingBar'></div>");


		rm.write("<div class='sapMShellCentralBox'>");


		// header
		var extraHeaderClass = "", extraBGClass = "";
		if (!oControl.getBackgroundImage()) {
			extraHeaderClass = "sapMShellBackgroundColorOnlyIfDefault";
			extraBGClass = "sapUiGlobalBackgroundImageOnlyIfDefault";
		}
		rm.write("<header class='sapMShellHeader " + extraHeaderClass + "' id='" + oControl.getId() + "-hdr'>");
		rm.write("<div class='" + extraBGClass + "'></div>");
		// logo
		rm.write(ShellRenderer.getLogoImageHtml(oControl));

		// header title
		rm.write("<h1 id='" + oControl.getId() + "-hdrTxt' class='sapMShellHeaderText'>");
		rm.writeEscaped(oControl.getTitle());
		rm.write("</h1>");

		// header right area
		rm.write("<span class='sapMShellHeaderRight'>");

		// headerRightText
		rm.write("<span id='" + oControl.getId() + "-hdrRightTxt' ");
		if (!oControl.getHeaderRightText()) {
			rm.writeAttribute("style", "display:none;");
		}
		rm.write("class='sapMShellHeaderRightText'>" + jQuery.sap.encodeHTML(oControl.getHeaderRightText()) + "</span>");


		// logout button
		if (oControl.getShowLogout()) {
			var rb = sap.ui.getCore().getLibraryResourceBundle("sap.m");
			rm.write("<a id='" + oControl.getId() + "-logout' tabindex='0' role='button' class='sapMShellHeaderLogout'>" + rb.getText("SHELL_LOGOUT") + "</a>");
		}

		rm.write("</span></header>");



		// content
		rm.write("<section class='sapMShellContent sapMShellGlobalInnerBackground' id='" + oControl.getId() + "-content' data-sap-ui-root-content='true'>");

		rm.renderControl(oControl.getApp());

		rm.write("</section></div></div>");
	};

	ShellRenderer.getLogoImageHtml = function(oControl) {
		var sImage = oControl.getLogo(); // configured logo
		if (!sImage) {
			jQuery.sap.require("sap.ui.core.theming.Parameters");
			sImage = sap.ui.core.theming.Parameters._getThemeImage(); // theme logo
		}

		var result = "";
		if (sImage) {
			var oRb = sap.ui.getCore().getLibraryResourceBundle("sap.m");
			result = "<div class='sapMShellLogo'>";
			if (sap.ui.Device.browser.msie) {
				result += "<span class='sapMShellLogoImgAligner'></span>";
			}
			result += "<img id='" + oControl.getId() + "-logo' class='sapMShellLogoImg' src='";
			result += jQuery.sap.encodeHTML(sImage);
			result += "' alt='";
			result += oRb.getText("SHELL_ARIA_LOGO");
			result += "' /></div>";
		}
		return result;
	};

	return ShellRenderer;

 }, /* bExport= */ true);
