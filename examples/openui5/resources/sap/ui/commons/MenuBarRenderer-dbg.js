/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides default renderer for control sap.ui.commons.MenuBar
sap.ui.define(['jquery.sap.global'],
	function(jQuery) {
	"use strict";


	
	/**
	 * MenuBarRenderer.
	 * @namespace
	 */
	var MenuBarRenderer = {
	};
	
	/**
	 * Renders the HTML for the given menubar using the provided {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} oRenderManager The RenderManager that can be used for writing to the render output buffer.
	 * @param {sap.ui.commons.Toolbar} oToolbar An object representation of the control that should be rendered.
	 */
	MenuBarRenderer.render = function(oRenderManager, oMenuBar) {
		var rm = oRenderManager;
	
		oMenuBar.doBeforeRendering();

		rm.write("<div");
		rm.writeControlData(oMenuBar);
		rm.addClass("sapUiMnuBar");
		if (oMenuBar.getDesign() == sap.ui.commons.MenuBarDesign.Header) {
			rm.addClass("sapUiMnuBarHeader");
		}
		var bIsDisabled = !oMenuBar.getEnabled();
		if (bIsDisabled) {
			rm.addClass("sapUiMnuBarDsbl");
		}
		rm.addStyle("width", oMenuBar.getWidth());
		rm.writeStyles();
		rm.writeClasses();
		rm.writeAttribute("tabindex", "0");
		var sTooltip = oMenuBar.getTooltip_AsString();
		MenuBarRenderer.writeAria(rm, "menubar", sTooltip, bIsDisabled);
		rm.write("><ul");
		rm.writeAttribute("id", oMenuBar.getId() + "-area");
		rm.writeAttribute("class", "sapUiMnuBarArea");
		rm.write(">");
	
		var iVisibleItemIdx = 0;
		var aItems = oMenuBar.getItems();
		for (var i = 0; i < aItems.length; i++) {
			var oItem = aItems[i];
			if (oItem.getVisible()) {
				iVisibleItemIdx++;
				rm.write("<li");
				rm.writeElementData(oItem);
				rm.addClass("sapUiMnuBarItm");
				var bDsbld = !oItem.getEnabled() || bIsDisabled;
				if (bDsbld) {
					rm.addClass("sapUiMnuBarItmDsbl");
				}
				rm.writeClasses();
				rm.writeAttribute("itemidx", "" + i);
				var sTooltip = oItem.getTooltip_AsString();
				MenuBarRenderer.writeAria(rm, "menuitem", sTooltip, bDsbld, iVisibleItemIdx, !!oItem.getSubmenu());
				rm.writeAttribute("tabindex", "-1");
				rm.write("><span>");
				rm.writeEscaped(oItem.getText());
				rm.write("</span></li>");
			}
		}
	
		rm.write("<li");
		rm.writeAttribute("id", oMenuBar.getId() + "-ovrflw");
		rm.writeAttribute("itemidx", "ovrflw");
		rm.writeAttribute("style", "display:none;");
		rm.writeAttribute("tabindex", "-1");
		rm.addClass("sapUiMnuBarItm");
		rm.addClass("sapUiMnuBarOvrFlw");
		if (bDsbld) {
			rm.addClass("sapUiMnuBarItmDsbl");
		}
		rm.writeClasses();
		var rb = sap.ui.getCore().getLibraryResourceBundle("sap.ui.commons");
		var sOverFlowText;
		if (rb) {
			sOverFlowText = rb.getText("MNUBAR_OVRFLW");
		}
		MenuBarRenderer.writeAria(rm, "menuitem", sOverFlowText, false, 0, true);
		rm.write("><span></span></li></ul></div>");
	};
	
	MenuBarRenderer.writeAria = function(rm, sRole, sText, bDisabled, iIdx, bHasSubMenu){
		if (sText) {
			rm.writeAttributeEscaped("title", sText);
		}
	
		if (!sap.ui.getCore().getConfiguration().getAccessibility()) {
			return;
		}
	
		rm.writeAttribute("role", sRole);
		if (sRole == "menuitem") {
			if (bHasSubMenu) {
				rm.writeAttribute("aria-haspopup", true);
			}
			rm.writeAttribute("aria-posinset", iIdx);
		}
		if (bDisabled) {
			rm.writeAttribute("aria-disabled", true);
		}
	};

	return MenuBarRenderer;

}, /* bExport= */ true);
