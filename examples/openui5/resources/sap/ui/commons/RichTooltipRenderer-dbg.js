/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides default renderer for control sap.ui.commons.RichTooltip
sap.ui.define(['jquery.sap.global', 'sap/ui/core/ValueStateSupport'],
	function(jQuery, ValueStateSupport) {
	"use strict";


	/**
	 * RichToltip renderer.
	 * @namespace
	 */
	var RichTooltipRenderer = {};
	
	/**
	 * Renders the HTML for the RichTooltip, using the provided {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} rm The RenderManager that can be used for writing to the render output buffer.
	 * @param {sap.ui.core.Control} oRichTooltip An object representation of the control that should be rendered.
	 */
	RichTooltipRenderer.render = function(rm, oRichTooltip){
		var sId = oRichTooltip.getId();
	
		// Header
		rm.write("<div ");
		rm.writeControlData(oRichTooltip);
		rm.addClass("sapUiRtt");
		rm.writeClasses();
		rm.write(" ><div><div>");
		rm.write("<div class='sapUiRttTopL'></div><div class='sapUiRttTopR'></div>");
		rm.write("<div class='sapUiRttCL'>");
		rm.write("<div class='sapUiRttCR'>");
		
		rm.write("<div class='sapUiRttContent'>");
	
		// Title
		var sTitle = oRichTooltip.getTitle();
		if (sTitle) {
			rm.write("<div id='" + sId + "-title' role='tooltip' class='sapUiRttTitle'>");
			rm.writeEscaped(sTitle);
			rm.write("</div>");
			// render a separator between title and rest of the RichTooltip
			rm.write("<div class='sapUiRttSep'></div>");
		}
	
		// if the parent element has a set ValueState render the corresponding text and image
		var sValueStateText = ValueStateSupport.getAdditionalText(oRichTooltip.getParent());
		
		// render the individual ValueState text (if available) otherwise use the default text
		var sIndividualText = oRichTooltip.getAggregation("individualStateText");
		
		// if there is any (from parent control or from RTT itself) value state text set
		if (sValueStateText || sIndividualText) {
			rm.write('<div class="sapUiRttValueStateContainer">');
			
			// only if the owner of the RTT has a value state - render state and image
			if (sValueStateText) {
				var sValueState = oRichTooltip.getParent().getValueState();
				var sValueStateImage = sValueState !== sap.ui.core.ValueState.None ? "ValueState_" + sValueState + ".png" : "";
	
				// if there is a proper value state -> render corresponding image
				if (sValueStateImage !== "") {
					sValueStateImage = jQuery.sap.getModulePath("sap.ui.commons.themes."
						+ sap.ui.getCore().getConfiguration().getTheme(), "/img/richtooltip/"
						+ sValueStateImage);
					rm.write('<img id="' + sId + '-valueStateImage" class="sapUiRttValueStateImage" src="');
					rm.writeEscaped(sValueStateImage);
					rm.write('"/>');
				}
			}
		
			if (sIndividualText) {
				rm.renderControl(sIndividualText);
			} else {
				rm.write('<div id="' + sId + '-valueStateText" class="sapUiRttValueStateText">');
				rm.writeEscaped(sValueStateText);
				rm.write('</div>');
			}
			
			rm.write('</div>');
			
			// render a separator between ValueState stuff and text of the RichTooltip
			rm.write("<div class='sapUiRttSep'></div>");
		}
		
		
		rm.write('<div class="sapUiRttContentContainer">');
		// render image that might be set
		var sImage = oRichTooltip.getImageSrc();
		if (sImage) {
			var sAltText = oRichTooltip.getImageAltText();
			rm.write('<img id="' + sId + '-image" class="sapUiRttImage"');
			rm.writeAttributeEscaped('alt', sAltText);
			rm.writeAttributeEscaped('src', sImage);
			rm.write('"/>');
		}
		
		// render RichTooltip's text
		var oText = oRichTooltip.getAggregation("formattedText");
		if (oText) {
			rm.renderControl(oText);
		}
		rm.write('</div>');
	
		// render footer
		rm.write("</div></div></div>");
		rm.write("<div class='sapUiRttBotL'></div>");
		rm.write("<div class='sapUiRttBotR'></div>");
		rm.write("</div></div></div>");
	};

	return RichTooltipRenderer;

}, /* bExport= */ true);
