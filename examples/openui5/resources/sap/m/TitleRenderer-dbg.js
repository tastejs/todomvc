/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides default renderer for control sap.m.Title
sap.ui.define(['jquery.sap.global', 'sap/ui/Device'],
	function(jQuery, Device) {
	"use strict";


	/**
	 * @class Title renderer.
	 * @static
	 */
	var TitleRenderer = {};
	
	/**
	 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
	 * @param {sap.ui.core.RenderManager} oRm the RenderManager that can be used for writing to the Render-Output-Buffer
	 * @param {sap.ui.core.Control} oShell an object representation of the control that should be rendered
	 */
	TitleRenderer.render = function(oRm, oTitle){
		var oAssoTitle = oTitle._getTitle(),
			sLevel = (oAssoTitle ? oAssoTitle.getLevel() : oTitle.getLevel()) || sap.ui.core.TitleLevel.Auto,
			bAutoLevel = sLevel == sap.ui.core.TitleLevel.Auto,
			sTag = bAutoLevel ? "div" : sLevel;
		
		oRm.write("<", sTag);
		oRm.writeControlData(oTitle);
		oRm.addClass("sapMTitle");
		oRm.addClass("sapMTitleStyle" + (oTitle.getTitleStyle() || sap.ui.core.TitleLevel.Auto));
		oRm.addClass("sapMTitleNoWrap");
		oRm.addClass("sapUiSelectable");
		
		var sWidth = oTitle.getWidth();
		if (!sWidth) {
			oRm.addClass("sapMTitleMaxWidth");
		} else {
			oRm.addStyle("width", sWidth);
		}
		
		var sTextAlign = oTitle.getTextAlign();
		if (sTextAlign && sTextAlign != sap.ui.core.TextAlign.Initial) {
			oRm.addClass("sapMTitleAlign" + sTextAlign);
		}
		
		if (oTitle.getParent() instanceof sap.m.Toolbar) {
			oRm.addClass("sapMTitleTB");
		}
		
		var sTooltip = oAssoTitle ? oAssoTitle.getTooltip_AsString() : oTitle.getTooltip_AsString();
		if (sTooltip) {
			oRm.writeAttributeEscaped("title", sTooltip);
		}
		
		if (bAutoLevel) {
			oRm.writeAttribute("role", "heading");
		}
		
		oRm.writeClasses();
		oRm.writeStyles();

		oRm.write("><span>");
		oRm.writeEscaped(oAssoTitle ? oAssoTitle.getText() : oTitle.getText());
		oRm.write("</span></", sTag, ">");
	};
	
	return TitleRenderer;

}, /* bExport= */ true);