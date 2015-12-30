/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides default renderer for control sap.ui.commons.RatingIndicator
sap.ui.define(['jquery.sap.global'],
	function(jQuery) {
	"use strict";


	/**
	 * RatingIndicatorRenderer.
	 * @namespace
	 */
	var RatingIndicatorRenderer = function() {
	};
	
	/**
	 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager}
	 *          oRenderManager the RenderManager that can be used for writing to the Render-Output-Buffer
	 * @param {sap.ui.core.Control}
	 *          oRating an object representation of the control that should be rendered
	 */
	RatingIndicatorRenderer.render = function(oRenderManager, oRating) {
		var rm = oRenderManager;
		var iNumberOfSymbols = oRating.getMaxValue();
	
		rm.write("<div");
		rm.writeControlData(oRating);
		rm.addClass("sapUiRating");
		if (oRating.getEditable()) {
			rm.addClass("sapUiRatingEdit");
		}
		rm.writeClasses();
		rm.writeAttribute("tabindex", "0"/*oRating.getEditable() ? "0" : "-1"*/); //According to CSN 2581852 2012 the RI should always be in the tabchain
		if (oRating.getTooltip() && oRating.getTooltip_AsString()) {
			rm.writeAttributeEscaped("title", oRating.getTooltip_AsString());
		} else if (!oRating.getEditable()) {
			rm.writeAttribute("title", oRating._getDisplayValue());
		}
	
		//ARIA
		rm.writeAccessibilityState(oRating, {
			"role": "slider",
			"orientation": "horizontal",
			"valuemin": 1,
			"valuemax": iNumberOfSymbols,
			"disabled": !oRating.getEditable(),
			"live": "assertive"
		});
	
		rm.write(">");
	
		for (var i = 0; i < iNumberOfSymbols; i++) {
			RatingIndicatorRenderer.renderItem(rm, oRating, i, oRating._getDisplayValue());
		}
	
		rm.write("</div>");
	};
	
	/**
	 * Helper function to render a rating symbol.
	 * @private
	 */
	RatingIndicatorRenderer.renderItem = function(rm, oRating, i, fValue){
		var val = i + 1;
		rm.write("<div");
		rm.writeAttribute("id", oRating.getId() + "-itm-" + val);
		rm.writeAttribute("itemvalue", val);
		rm.writeAttribute("class", "sapUiRatingItm");
		rm.writeAttribute("style", "line-height:0px;");
		if (!oRating.getTooltip() && oRating.getEditable()) {
			//rm.writeAttribute("dir", "ltr"); //Do we need this to avoid tooltips like "of 5 3" instead of "3 of 5"
			rm.writeAttributeEscaped("title", oRating._getText("RATING_TOOLTIP" , [val, oRating.getMaxValue()]));
		}
		rm.write(">");
	
		rm.write("<img");
		rm.writeAttribute("class", "sapUiRatingItmImg");
		var sIcon = RatingIndicatorRenderer.getThemeSymbol("selected", oRating);
		rm.writeAttributeEscaped("src", sIcon);
		rm.write("/>");
	
		rm.write("<div");
		rm.writeAttribute("class", "sapUiRatingItmOvrflw");
	
		var visualMode = oRating.getVisualMode();
		if (visualMode == "Full") {
			fValue = Math.round(fValue);
		}
		var style;
		if (fValue >= val) {
			style = "width:0%;";
		} else if (fValue < i) {
			style = "width:100%;";
		} else {
			var diff = fValue - i;
			if (visualMode == "Half") {
				var width = 50;
				if (diff < 0.25) {
					width = 100;
				}
				if (diff >= 0.75) {
					width = 0;
				}
				style = "width:" + width + "%;";
			} else { //Continuous
				style = "width:" + (100 - Math.round(diff * 100)) + "%;";
			}
		}
		rm.writeAttribute("style", style);
		rm.write(">");
	
		rm.write("<img");
		rm.writeAttribute("class", "sapUiRatingItmOvrflwImg");
		sIcon = RatingIndicatorRenderer.getThemeSymbol("unselected", oRating);
		rm.writeAttributeEscaped("src", sIcon);
		rm.write("/>");
	
		rm.write("</div>");
		rm.write("</div>");
	};
	
	/**
	 * Helper function to render a rating symbol in hover state.
	 *
	 * @param {int} iCount the number of the rating image which should be hovered.
	 * @param {sap.ui.core.Control} oRating an object representation of the control that should be rendered
	 * @param {boolean} bAfter specifies whether the rating image is behind the hovered one.
	 * @private
	 */
	RatingIndicatorRenderer.hoverRatingSymbol = function(iCount, oRating, bAfter){
		var oSymbol = oRating.$("itm-" + iCount);
		oSymbol.addClass("sapUiRatingItmHov");
		var oSymbolImage = oSymbol.children("img");
		var sIcon = RatingIndicatorRenderer.getThemeSymbol(bAfter ? "unselected" : "hover", oRating);
		oSymbolImage.attr("src", sIcon);
	};
	
	/**
	 * Helper function to render a rating symbol in normal (selected/deselected) state.
	 *
	 * @param {int} iCount the number of the rating image which should be unhovered.
	 * @param {sap.ui.core.Control} oRating an object representation of the control that should be rendered
	 * @private
	 */
	RatingIndicatorRenderer.unhoverRatingSymbol = function(iCount, oRating){
		var oSymbol = oRating.$("itm-" + iCount);
		oSymbol.removeClass("sapUiRatingItmHov");
		var oSymbolImage = oSymbol.children("img");
		var sIcon = RatingIndicatorRenderer.getThemeSymbol("selected", oRating);
		oSymbolImage.attr("src", sIcon);
	};
	
	/**
	 * Helper function to find the right symbol.
	 *
	 * @param {string} sType type of desired image (selected, unselected, hover)
	 * @param {sap.ui.core.Control} oRating an object representation of the control that should be rendered
	 * @private
	 */
	RatingIndicatorRenderer.getThemeSymbol = function(sType, oRating){
		var sIcon, sParam;
	
		if (sType == "selected") {
			sIcon = oRating.getIconSelected();
			sParam = "sap.ui.commons.RatingIndicator:sapUiRatingSymbolSelected";
		} else if (sType == "unselected") {
			sIcon = oRating.getIconUnselected();
			sParam = "sap.ui.commons.RatingIndicator:sapUiRatingSymbolUnselected";
		} else {
			sIcon = oRating.getIconHovered();
			sParam = "sap.ui.commons.RatingIndicator:sapUiRatingSymbolHovered";
		}
	
		if (!sIcon) {
			var sThemePath =
				"themes/" +
				sap.ui.getCore().getConfiguration().getTheme() + "/" +
				sap.ui.core.theming.Parameters.get(sParam);
	
			// The documentation states that sap.ui.resource() should be used for theme-URLs
			sIcon = sap.ui.resource("sap.ui.commons", sThemePath);
		}
	
		return sIcon;
	};

	return RatingIndicatorRenderer;

}, /* bExport= */ true);
