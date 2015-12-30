/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides default renderer for control sap.ui.unified.Menu
sap.ui.define(['jquery.sap.global'],
	function(jQuery) {
	"use strict";


	
	/**
	 * Currency renderer.
	 *
	 * @version 1.32.9
	 * @namespace
	 */
	var CurrencyRenderer = {
	};
	
	/**
	 * Renders the HTML for the given control, using the provided
	 * {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager}
	 *            oRenderManager The RenderManager that can be used for writing to the render-output-buffer.
	 * @param {sap.ui.core.Control}
	 *            oMenu An object representation of the control that should be rendered
	 */
	CurrencyRenderer.render = function(oRm,oCurrency) {
		var sTooltip = oCurrency.getTooltip_AsString();

		oRm.write("<div");
		oRm.writeControlData(oCurrency);

		if (sTooltip) {
			oRm.writeAttributeEscaped("title", sTooltip);
		}

		oRm.addClass("sapUiUfdCurrency");
		if (!oCurrency._hasValue()) {
			oRm.addClass("sapUiUfdCurrencyNoVal");
		}
		oRm.writeClasses();
		oRm.write(">");
		oRm.write("<div");
		oRm.addClass("sapUiUfdCurrencyAlign");
		oRm.writeClasses();
		oRm.write(">");
		oRm.write("<span");
		oRm.addClass("sapUiUfdCurrencyValue");
		oRm.writeClasses();
		oRm.write(">");
		oRm.writeEscaped(oCurrency.getFormattedValue());
		oRm.write("</span>");
		oRm.write("<span");
		oRm.addClass("sapUiUfdCurrencyCurrency");
		oRm.writeClasses();
		oRm.write(">");
		if (oCurrency.getUseSymbol()) {
			oRm.writeEscaped(oCurrency.getCurrencySymbol());
		} else {
			oRm.writeEscaped(oCurrency.getCurrency());
		}
		oRm.write("</span>");
		oRm.write("</div>");
		oRm.write("</div>");
	};

	return CurrencyRenderer;

}, /* bExport= */ true);
