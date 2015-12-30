/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global'],
	function(jQuery) {
	"use strict";


	/**
	 * BusyIndicator renderer.
	 * @namespace
	 */
	var BusyIndicatorRenderer = {
	};


	/**
	 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} oRenderManager the RenderManager that can be used for writing to the Render-Output-Buffer
	 * @param {sap.ui.core.Control} oBusyInd an object representation of the control that should be rendered
	 */
	BusyIndicatorRenderer.render = function (oRm, oBusyInd) {
		this.startBusyIndicator(oRm, oBusyInd);

		this.renderBusyIndication(oRm, oBusyInd);

		this.renderLabel(oRm, oBusyInd);

		this.endBusyIndicator(oRm);
	};

	BusyIndicatorRenderer.startBusyIndicator = function (oRm, oBusyInd) {
		var mAccState = {
			role: "progressbar",
			valuemin: "0",
			valuemax: "100"
		};

		oRm.write("<div");
		oRm.writeControlData(oBusyInd);

		oRm.addClass("sapMBusyIndicator");
		oRm.writeClasses();

		oRm.addStyle("font-size", oBusyInd.getSize());
		oRm.writeStyles();

		oRm.writeAccessibilityState(oBusyInd, mAccState);
		this.renderTooltip(oRm, oBusyInd.getTooltip_AsString());

		oRm.write(">");
	};

	BusyIndicatorRenderer.renderTooltip = function (oRm, sTooltip) {
		if (sTooltip) {
			oRm.writeAttributeEscaped("title", sTooltip);
		}
	};

	BusyIndicatorRenderer.renderBusyIndication = function (oRm, oBusyInd) {
		if (oBusyInd.getCustomIcon()) {
			oRm.renderControl(oBusyInd._iconImage);
		} else {
			oRm.write("<div class='sapMBusyIndicatorBusyArea'");
			oRm.writeAttribute("id", oBusyInd.getId() + "-busy-area");
			oRm.write("></div>");
		}
	};

	BusyIndicatorRenderer.renderLabel = function (oRm, oBusyInd) {
		if (oBusyInd.getText()) {
			oRm.renderControl(oBusyInd._busyLabel);
		}
	};

	BusyIndicatorRenderer.endBusyIndicator = function (oRm) {
		oRm.write("</div>");
	};

	return BusyIndicatorRenderer;

}, /* bExport= */ true);
