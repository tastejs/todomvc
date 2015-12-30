/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(['jquery.sap.global', 'sap/ui/core/IconPool'],
	function(jQuery, IconPool) {
	"use strict";

/**
	 * HBox renderer.
	 * @namespace
	 */
	var IconTabBarRenderer = {
	};

	/**
	 * Array of all available icon color CSS classes
	 *
	 * @private
	 */
	IconTabBarRenderer._aAllIconColors = ['sapMITBFilterCritical', 'sapMITBFilterPositive', 'sapMITBFilterNegative', 'sapMITBFilterDefault'];


	/**
	 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} oRm the RenderManager that can be used for writing to the render output buffer
	 * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
	 */
	IconTabBarRenderer.render = function(oRm, oControl){
		var oContent = oControl.getContent(),
			oHeader = oControl._getIconTabHeader();

		// start control wrapper
		oRm.write("<div ");
		oRm.writeControlData(oControl);
		oRm.addClass("sapMITB");
		if (oControl.getStretchContentHeight()) {
			oRm.addClass("sapMITBStretch");
		}
		if (!oControl.getApplyContentPadding()) {
			oRm.addClass("sapMITBNoContentPadding");
		}
		oRm.addClass("sapMITBBackgroundDesign" + oControl.getBackgroundDesign());
		oRm.writeClasses();
		oRm.write(">");

		// render icon tab header (if not configured to hide by ObjectHeader)
		if (!oControl._bHideHeader) {
			oRm.renderControl(oHeader);
		}

		// render outer content
		oRm.write("<div id='" + oControl.getId() + "-containerContent' ");
		oRm.addClass("sapMITBContainerContent");
		if (!oControl.getExpanded()) { // add special styles  when closed
			oRm.addClass("sapMITBContentClosed");
		}
		oRm.writeClasses();
		oRm.write(">");

		// render inner content
		oRm.write("<div id='" + oControl.getId() + "-content' class='sapMITBContent' role='tabpanel' ");
		if (!oControl.getExpanded()) { // hide content when closed
			oRm.write("style='display: none'");
		}
		oRm.write(">");
		if (oControl.getExpanded()) {
			// content from selected item
			if (oHeader.oSelectedItem && oHeader.oSelectedItem.getContent()) {
				var oContentSelectedTab = oHeader.oSelectedItem.getContent();
				if (oContentSelectedTab.length > 0) {
					oContent = oContentSelectedTab;
				}
			}
			// render the content
			if (oContent.length > 0) {
				for (var i = 0; i < oContent.length; i++) {
					oRm.renderControl(oContent[i]);
				}
			}
		}
		oRm.write("</div>");

		// end outer content
		oRm.write("</div>");

		// end control wrapper
		oRm.write("</div>");
	};



	return IconTabBarRenderer;

}, /* bExport= */ true);
