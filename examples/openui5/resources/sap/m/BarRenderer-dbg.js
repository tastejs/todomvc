/*!

 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(['jquery.sap.global', './BarInPageEnabler'],
	function(jQuery, BarInPageEnabler) {
	"use strict";


	/**
	 * Bar renderer.
	 * @namespace
	 */
	var BarRenderer = {};

	/////////////////
	//Bar in page delegation
	/////////////////

	/**
	 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
	 * @protected
	 * @param {sap.ui.core.RenderManager} oRM The RenderManager that can be used for writing to the Render-Output-Buffer.
	 * @param {sap.ui.core.Control} oControl An object representation of the control that should be rendered
	 */
	BarRenderer.render = BarInPageEnabler.prototype.render;

	/////////////////
	//Bar specific rendering + implementation of enabler hooks
	/////////////////

	/**
	 * Adds classes attributes and styles to the root tag
	 *
	 * @param {sap.ui.core.RenderManager} oRM The RenderManager that can be used for writing to the Render-Output-Buffer
	 * @param {sap.ui.core.Control} oControl An object representation of the control that should be rendered
	 */
	BarRenderer.decorateRootElement = function (oRM, oControl) {
		oRM.addClass("sapMBar");
		oRM.addClass(this.getContext(oControl));
		oRM.writeAccessibilityState(oControl, {
			role: "toolbar"
		});

		if (oControl.getTranslucent() && (sap.ui.Device.support.touch  || jQuery.sap.simulateMobileOnDesktop)) {
			oRM.addClass("sapMBarTranslucent");
		}

		oRM.addClass("sapMBar-CTX");
	};

	/**
	 * Determines if the IBarContext classes should be added to the control.
	 * @private
	 */
	BarRenderer.shouldAddIBarContext = function () {
		return true;
	};

	/**
	 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} oRM The RenderManager that can be used for writing to the Render-Output-Buffer
	 * @param {sap.ui.core.Control} oControl An object representation of the control that should be rendered
	 */
	BarRenderer.renderBarContent = function(oRM, oControl) {
		var sClosingDiv = "</div>";

		//left content area
		oRM.write("<div id='" + oControl.getId() + "-BarLeft' ");
		oRM.addClass('sapMBarLeft');
		oRM.addClass('sapMBarContainer');
		oRM.writeClasses();
		writeWidthIfContentOccupiesWholeArea("left", oRM, oControl);
		oRM.write(">");

		this.renderAllControls(oControl.getContentLeft(), oRM, oControl);

		oRM.write(sClosingDiv);

		//middle content area
		oRM.write("<div id='" + oControl.getId() + "-BarMiddle' ");
		oRM.addClass('sapMBarMiddle');
		oRM.writeClasses();
		oRM.write(">");
		if (oControl.getEnableFlexBox()) {
			oControl._oflexBox = oControl._oflexBox || new sap.m.HBox(oControl.getId() + "-BarPH", {alignItems: "Center"}).addStyleClass("sapMBarPH").setParent(oControl, null, true);
			var bContentLeft = !!oControl.getContentLeft().length,
				bContentMiddle = !!oControl.getContentMiddle().length,
				bContentRight = !!oControl.getContentRight().length;
			if (bContentMiddle && !bContentLeft && !bContentRight) {
				oControl._oflexBox.addStyleClass("sapMBarFlexBoxWidth100");

			}
			oControl.getContentMiddle().forEach(function(oMidContent) {
				oControl._oflexBox.addItem(oMidContent);
			});

			oRM.renderControl(oControl._oflexBox);
		} else {
			oRM.write("<div id='" + oControl.getId() + "-BarPH' ");
			oRM.addClass('sapMBarPH');
			oRM.addClass('sapMBarContainer');
			writeWidthIfContentOccupiesWholeArea("middle", oRM, oControl);
			oRM.writeClasses();
			oRM.write(">");

			this.renderAllControls(oControl.getContentMiddle(), oRM, oControl);

			oRM.write(sClosingDiv);
		}
		oRM.write(sClosingDiv);


		//right content area
		oRM.write("<div id='" + oControl.getId() + "-BarRight'");
		oRM.addClass('sapMBarRight');
		oRM.addClass('sapMBarContainer');
		if (sap.ui.getCore().getConfiguration().getRTL()) {
			oRM.addClass("sapMRTL");
		}
		oRM.writeClasses();
		writeWidthIfContentOccupiesWholeArea("right", oRM, oControl);
		oRM.write(">");

		this.renderAllControls(oControl.getContentRight(), oRM, oControl);

		oRM.write(sClosingDiv);
	};

	/**
	 * Makes the RenderManager render all controls in an array.
	 * @param {sap.ui.core.Control} aControls The Controls to be rendered
	 * @param {sap.ui.core.RenderManager} oRM The RenderManager that can be used for writing to the Render-Output-Buffer
	 * @param {sap.m.Bar} oBar An object representation of the control that should be rendered
	 */
	BarRenderer.renderAllControls = function (aControls, oRM, oBar) {
		aControls.forEach(function (oControl) {
			sap.m.BarInPageEnabler.addChildClassTo(oControl, oBar);

			oRM.renderControl(oControl);
		});
	};

	BarRenderer._mContexts = {
			Header : "sapMHeader-CTX",
			SubHeader : "sapMSubHeader-CTX",
			Footer : "sapMFooter-CTX",
			Default : "sapMContent-CTX"
	};

	/**
	 * Determines which tag or context class the Bar should have.
	 * @protected
	 * @param {sap.m.BarBase} oControl The Bar control
	 * @returns {string} The context class
	 */
	BarRenderer.getContext = function(oControl) {
		var sDesign = oControl.getDesign(),
			mContexts = BarRenderer._mContexts;

		return mContexts[sDesign] || mContexts.Default;
	};

	/**
	 * Adds width style to 100% in case of the given content container is the only container with content amongst the three (left, middle, right)
	 * @param {string} sArea The content container - one of the left, middle or right
	 * @param {sap.ui.core.RenderManager} oRM The RenderManager that can be used for writing to the Render-Output-Buffer.
	 * @param {sap.ui.core.Control} oControl the Bar instance
	 * @private
	 */
	function writeWidthIfContentOccupiesWholeArea(sArea, oRm, oControl) {
		var bContentLeft = !!oControl.getContentLeft().length,
			bContentMiddle = !!oControl.getContentMiddle().length,
			bContentRight = !!oControl.getContentRight().length;

		function writeAndUpdate() {
			oRm.addStyle("width", "100%");
			oRm.writeStyles();
		}
		switch (sArea.toLowerCase()) {
			case "left":
				if (bContentLeft && !bContentMiddle && !bContentRight) {
					writeAndUpdate();
				}
				break;
			case "middle":
				if (bContentMiddle && !bContentLeft && !bContentRight) {
					writeAndUpdate();
				}
				break;
			case "right" :
				if (bContentRight && !bContentLeft && !bContentMiddle) {
					writeAndUpdate();
				}
				break;
			default:
				jQuery.sap.log.error("Cannot determine which of the three content aggregations is alone");
		}
	}



	return BarRenderer;

}, /* bExport= */ true);
