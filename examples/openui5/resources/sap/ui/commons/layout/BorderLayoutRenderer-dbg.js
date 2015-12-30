/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides default renderer for control sap.ui.commons.layout.BorderLayout
sap.ui.define(['jquery.sap.global', 'jquery.sap.encoder'],
	function(jQuery/* , jQuerySap */) {
	"use strict";


	
	/**
	 * BorderLayout renderer.
	 * @namespace
	 */
	var BorderLayoutRenderer = {};
	
	(function() {
		/**
		 * Renders the HTML for the given control, using the provided
		 * {@link sap.ui.core.RenderManager}.
		 * 
		 * @param {sap.ui.core.RenderManager}
		 *            oRenderManager the RenderManager that can be used for writing
		 *            to the Render-Output-Buffer
		 * @param {sap.ui.core.Control}
		 *            oControl an object representation of the control that should
		 *            be rendered
		 */
		BorderLayoutRenderer.render = function(oRm, oControl) {
			var mAreas = {
				top : oControl.getTop(),
				begin : oControl.getBegin(),
				center : oControl.getCenter(),
				end : oControl.getEnd(),
				bottom : oControl.getBottom()
			};
			var mAreaSizes = {
				top : sizeOf(mAreas.top),
				begin : sizeOf(mAreas.begin),
				center : sizeOf(mAreas.center),
				end : sizeOf(mAreas.end),
				bottom : sizeOf(mAreas.bottom)
			};
			var bRTL = sap.ui.getCore().getConfiguration().getRTL();
	
			// open the outer HTML tag
			oRm.write("<div");
			// let control data be written so that connection to SAPUI5 eventing
			// gets established
			oRm.writeControlData(oControl);
			oRm.addClass("sapUiBorderLayout");
			oRm.addStyle("width", oControl.getWidth());
			oRm.addStyle("height", oControl.getHeight());
			oRm.writeClasses();
			oRm.writeStyles();
			// don't forget to close the HTML tag
			oRm.write(">");
	
			/* render areas */
			if (mAreas.top/* && oTop.getVisible() */) {
				renderArea(oRm, "top", mAreas.top, mAreaSizes, bRTL);
			}
			if (mAreas.begin/* && oBegin.getVisible() */) {
				renderArea(oRm, "begin", mAreas.begin, mAreaSizes, bRTL);
			}
			if (mAreas.center && mAreas.center.getVisible()) {
				renderArea(oRm, "center", mAreas.center, mAreaSizes, bRTL);
			}
			if (mAreas.end/* && oEnd.getVisible() */) {
				renderArea(oRm, "end", mAreas.end, mAreaSizes, bRTL);
			}
			if (mAreas.bottom/* && oBottom.getVisible() */) {
				renderArea(oRm, "bottom", mAreas.bottom, mAreaSizes, bRTL);
			}
	
			// close surrounding div
			oRm.write("</div>");
		};
	
		BorderLayoutRenderer.animate = function(oArea, bVisible) {
			// var sBorderLayoutId = oBorderLayout.getId();
			var bRTL = sap.ui.getCore().getConfiguration().getRTL();
			var end = bVisible ? oArea.getSize() : "0";
	
			switch (oArea.getAreaId()) {
			case "top":
				$area(oArea, "top").animate({
					height : end
				});
				$area(oArea, "begin").animate({
					top : end
				});
				$area(oArea, "center").animate({
					top : end
				});
				$area(oArea, "end").animate({
					top : end
				});
				break;
	
			case "begin":
				$area(oArea, "begin").animate({
					width : end
				});
				$area(oArea, "center").animate(bRTL ? {
					right : end
				} : {
					left : end
				});
				break;
	
			case "end":
				$area(oArea, "center").animate(bRTL ? {
					left : end
				} : {
					right : end
				});
				$area(oArea, "end").animate({
					width : end
				});
				break;
	
			case "bottom":
				$area(oArea, "begin").animate({
					bottom : end
				});
				$area(oArea, "center").animate({
					bottom : end
				});
				$area(oArea, "end").animate({
					bottom : end
				});
				$area(oArea, "bottom").animate({
					height : end
				});
				break;
	
			default:
				break;
			}
	
		};
	
		function sizeOf(oArea) {
			var oSize = oArea && oArea.getVisible() && oArea.getSize();
			return oSize || "0";
		}
	
		function renderArea(oRm, sAreaId, oArea, mAreaSizes, bRTL) {
			var aAreaControls = oArea.getContent();
			var length = aAreaControls.length;
	
			oRm.write("<div");
			oRm.writeAttribute("id", oArea.getId());
			// collect styles and classes depending on area type
			switch (sAreaId) {
			case "top":
				oRm.addClass("sapUiBorderLayoutTop");
				oRm.addStyle("height", mAreaSizes.top);
				break;
			case "begin":
				oRm.addClass("sapUiBorderLayoutBegin");
				oRm.addStyle("width", mAreaSizes.begin);
				oRm.addStyle("top", mAreaSizes.top);
				oRm.addStyle("bottom", mAreaSizes.bottom);
				break;
			case "center":
				oRm.addClass("sapUiBorderLayoutCenter");
				oRm.addStyle("top", mAreaSizes.top);
				oRm.addStyle("right", bRTL ? mAreaSizes.begin : mAreaSizes.end);
				oRm.addStyle("bottom", mAreaSizes.bottom);
				oRm.addStyle("left", bRTL ? mAreaSizes.end : mAreaSizes.begin);
				break;
			case "end":
				oRm.addClass("sapUiBorderLayoutEnd");
				oRm.addStyle("width", mAreaSizes.end);
				oRm.addStyle("top", mAreaSizes.top);
				oRm.addStyle("bottom", mAreaSizes.bottom);
				break;
			case "bottom":
				oRm.addClass("sapUiBorderLayoutBottom");
				oRm.addStyle("height", mAreaSizes.bottom);
				break;
			default:
				jQuery.sap.assert("default branch must not be reached");
				break;
			}
	
			// add overflow definition to the style-attribute value
			oRm.addStyle("overflow-x", jQuery.sap.encodeHTML(oArea.getOverflowX() || ""));
			oRm.addStyle("overflow-y", jQuery.sap.encodeHTML(oArea.getOverflowY() || ""));
	
			// write alignment
			var sAlign = oArea.getContentAlign();
			if (bRTL) {
				if (sAlign === "right") {
					sAlign = "left";
				} else if (sAlign === "left") {
					sAlign = "right";
				}
			}
			oRm.addStyle("text-align", jQuery.sap.encodeHTML(sAlign || ""));
	
			oRm.writeClasses(oArea);
			oRm.writeStyles();
	
			oRm.write(">");
	
			// render the controls
			for ( var i = 0; i < length; i++) {
				oRm.renderControl(aAreaControls[i]);
			}
	
			oRm.write("</div>");
		}
	
		function $area(oArea, sAreaId) {
			var oOtherArea = oArea.getParent().getArea(sAreaId);
			return oOtherArea ? oOtherArea.$() : jQuery();
		}
	}());

	return BorderLayoutRenderer;

}, /* bExport= */ true);
