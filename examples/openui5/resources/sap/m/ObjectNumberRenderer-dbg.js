/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(['jquery.sap.global', 'sap/ui/core/Renderer'],
	function(jQuery, Renderer) {
	"use strict";


	/**
	 * ObjectNumber renderer.
	 * @namespace
	 */
	var ObjectNumberRenderer = {
	};

	/**
	 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} oRm The RenderManager that can be used for writing to the render output buffer
	 * @param {sap.ui.core.Control} oON An object representation of the control that should be rendered
	 */
	ObjectNumberRenderer.render = function(oRm, oON) {
		var sTooltip = oON._getEnrichedTooltip(),
			sTextDir = oON.getTextDirection(),
			sTextAlign = oON.getTextAlign();

		oRm.write("<div");
		oRm.writeControlData(oON);
		oRm.addClass("sapMObjectNumber");

		oRm.addClass(oON._sCSSPrefixObjNumberStatus + oON.getState());

		if (oON.getEmphasized()) {
			oRm.addClass("sapMObjectNumberEmph");
		}

		if (sTooltip) {
			oRm.writeAttributeEscaped("title", sTooltip);
		}

		if (sTextDir !== sap.ui.core.TextDirection.Inherit) {
			oRm.writeAttribute("dir", sTextDir.toLowerCase());
		}

		sTextAlign = Renderer.getTextAlign(sTextAlign, sTextDir);

		if (sTextAlign) {
			oRm.addStyle("text-align", sTextAlign);
		}

		oRm.writeClasses();
		oRm.writeStyles();

		// ARIA
		// when the status is "None" there is nothing for reading
		if (oON.getState() !== sap.ui.core.ValueState.None) {
			oRm.writeAccessibilityState({
			labelledby: oON.getId() + "-state"
			});
		}


		oRm.write(">");

		this.renderText(oRm, oON);
		oRm.write("  "); // space between the number text and unit
		this.renderUnit(oRm, oON);
		this.renderHiddenARIAElement(oRm, oON);

		oRm.write("</div>");
	};

	ObjectNumberRenderer.renderText = function(oRm, oON) {
		oRm.write("<span");
		oRm.addClass("sapMObjectNumberText");
		oRm.writeClasses();
		oRm.write(">");
		oRm.writeEscaped(oON.getNumber());
		oRm.write("</span>");
	};

	ObjectNumberRenderer.renderUnit = function(oRm, oON) {
		var sUnit = oON.getUnit() || oON.getNumberUnit();

		oRm.write("<span");
		oRm.addClass("sapMObjectNumberUnit");
		oRm.writeClasses();
		oRm.write(">");
		oRm.writeEscaped(sUnit);
		oRm.write("</span>");
	};

	ObjectNumberRenderer.renderHiddenARIAElement = function(oRm, oON) {
		var sARIAStateText = "",
			oRB = sap.ui.getCore().getLibraryResourceBundle("sap.m");

		if (oON.getState() == sap.ui.core.ValueState.None) {
			return;
		}

		oRm.write("<span id='" + oON.getId() + "-state' class='sapUiInvisibleText' aria-hidden='true'>");

		switch (oON.getState()) {
			case sap.ui.core.ValueState.Error:
				sARIAStateText = oRB.getText("OBJECTNUMBER_ARIA_VALUE_STATE_ERROR");
				break;
			case sap.ui.core.ValueState.Warning:
				sARIAStateText = oRB.getText("OBJECTNUMBER_ARIA_VALUE_STATE_WARNING");
				break;
			case sap.ui.core.ValueState.Success:
				sARIAStateText = oRB.getText("OBJECTNUMBER_ARIA_VALUE_STATE_SUCCESS");
				break;
		}

		oRm.write(sARIAStateText);
		oRm.write("</span>");
	};

	return ObjectNumberRenderer;

}, /* bExport= */ true);
