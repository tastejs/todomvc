/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(['jquery.sap.global'],
	function(jQuery) {
	"use strict";


	/**
	 * Carousel renderer.
	 * @namespace
	 */
	var CarouselRenderer = {
	};

	/**
	 * Renders the Carousel's HTML, using the provided {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} oRm the RenderManager that can be used for writing to the render output buffer
	 * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
	 */
	CarouselRenderer.render = function(rm, oCarousel){
		//Outer carousel div
		rm.write("<div");
		rm.writeControlData(oCarousel);
		// custom F6 handling
		rm.writeAttribute("data-sap-ui-customfastnavgroup", "true");

		rm.addStyle("width", oCarousel.getWidth());
		rm.addStyle("height", oCarousel.getHeight());
		rm.writeStyles();

		rm.addClass("sapMCrsl");
		//'sapMCrslFluid' is originally from mobify-carousel
		rm.addClass("sapMCrslFluid");

		// add all classes (also custom classes) to carousel tag
		rm.writeClasses();

		var sTooltip = oCarousel.getTooltip_AsString();
		if (sTooltip) {
			rm.writeAttributeEscaped("title", sTooltip);
		}

		rm.writeAttributeEscaped("tabindex","0");

		// ARIA
		rm.writeAccessibilityState(oCarousel, {
			role: "list"
		});

		rm.write(">");

		var aPages = oCarousel.getPages();
		var iPageCount = aPages.length;
		var sPageIndicatorPlacement = oCarousel.getPageIndicatorPlacement();

		//visual indicator
		if (sPageIndicatorPlacement === sap.m.PlacementType.Top) {
			this._renderPageIndicator({
				rm: rm,
				iPageCount: iPageCount,
				sShowPageIndicator: oCarousel.getShowPageIndicator()
			});
		}

		//inner carousel div
		rm.write("<div class='sapMCrslInner'>");
		//do housekeeping
		oCarousel._cleanUpScrollContainer();

		var fnRenderPage = function(oPage, iIndex, aArray) {
			//item div
			rm.write("<div class='sapMCrslItem");
			if (sPageIndicatorPlacement === sap.m.PlacementType.Bottom) {
				rm.write(" sapMCrslBottomOffset");
			}
			rm.write("' id='" + oCarousel.sId + "-" + oPage.sId + "-slide'");

			// ARIA
			rm.writeAccessibilityState(oPage, {
				role: "listitem",
				posinset: iIndex + 1,
				setsize: aArray.length
			});

			rm.write(">");
				rm.renderControl(oCarousel._createScrollContainer(oPage, iIndex));
			rm.write("</div>");
		};

		//Render Pages
		aPages.forEach(fnRenderPage);


		rm.write("</div>");
		//inner div ends


		if (sap.ui.Device.system.desktop && iPageCount > 1) {
			//heads up controls for desktop browsers
			rm.write("<div class='sapMCrslControls sapMCrslHud'>");
				rm.write("<a class='sapMCrslPrev' href='#' data-slide='prev' tabindex='-1'><div class='sapMCrslHudInner'>");
				rm.renderControl(oCarousel._getNavigationArrow('left'));
				rm.write("</div></a>");

				rm.write("<a class='sapMCrslNext' href='#' data-slide='next' tabindex='-1'><div class='sapMCrslHudInner'>");
				rm.renderControl(oCarousel._getNavigationArrow('right'));
				rm.write("</div></a>");
			rm.write("</div>");
		}


		//visual indicator
		if (sPageIndicatorPlacement === sap.m.PlacementType.Bottom) {
			this._renderPageIndicator({
				rm: rm,
				iPageCount: iPageCount,
				bBottom: true,
				bShowPageIndicator: oCarousel.getShowPageIndicator()
			});
		}
		rm.write("</div>");
		//page-wrap ends
	};


	/**
	 * Renders the page indicator, using the provided {@link sap.ui.core.RenderManager}.
	 * Page indicator is only rendered if there is more than one carousel page
	 *
	 * @param {Object} settings.rm - oRm the RenderManager that can be used for writing to the render output buffer
	 * @param {Array} settings.iPages
	 * @param {boolean} settings.bBottom
	 * @param {boolean} settings.bShowPageIndicator
	 * @private
	 */
	CarouselRenderer._renderPageIndicator = function(settings){
		var rm = settings.rm,
		iPageCount = settings.iPageCount,
		bBottom = settings.bBottom,
		bShowPageIndicator = settings.bShowPageIndicator;

		var oResourceBundle = sap.ui.getCore().getLibraryResourceBundle('sap.m'),
		sOffsetCSSClass = bBottom ? " sapMCrslBottomOffset" : "",
		sDisplayStyle = bShowPageIndicator ? "" : "display: none";

		// If there is only one page - do not render the indicator
		if (iPageCount <= 1) {
			return;
		}

		rm.write('<div class="sapMCrslControls sapMCrslBulleted' + sOffsetCSSClass + '" style="' + sDisplayStyle + '">');

		for ( var i = 1; i <= iPageCount; i++) {
			rm.write("<span role='img' data-slide=" + i + " aria-label='" + oResourceBundle.getText('CAROUSEL_POSITION', [i, iPageCount]) + "'>" + i + "</span>");
		}

		rm.write("</div>");
	};

	return CarouselRenderer;

}, /* bExport= */ true);
