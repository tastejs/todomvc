/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(['jquery.sap.global', 'sap/ui/core/ValueStateSupport'],
	function(jQuery, ValueStateSupport) {
	"use strict";


	/**
	 * CheckBox renderer.
	 * @namespace
	 */
	var CheckBoxRenderer = {
	};


	/**
	 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} oRm The RenderManager that can be used for writing to the Render-Output-Buffer
	 * @param {sap.ui.core.Control} oCheckBox An object representation of the control that should be rendered
	 */
	CheckBoxRenderer.render = function(oRm, oCheckBox){
		// get control properties
		var bEnabled = oCheckBox.getEnabled();
		var bEditable = oCheckBox.getEditable();

		// CheckBox wrapper
		oRm.write("<div");
		oRm.addClass("sapMCb");

		if (!bEditable) {
			oRm.addClass("sapMCbRo");
		}

		if (!bEnabled) {
			oRm.addClass("sapMCbBgDis");
		}

		oRm.writeControlData(oCheckBox);
		oRm.writeClasses();

		var sTooltip = ValueStateSupport.enrichTooltip(oCheckBox, oCheckBox.getTooltip_AsString());
		if (sTooltip) {
			oRm.writeAttributeEscaped("title", sTooltip);
		}

		if (bEnabled) {
			oRm.writeAttribute("tabindex", oCheckBox.getTabIndex());
		}

		//ARIA attributes
		oRm.writeAccessibilityState(oCheckBox, {
			role: "checkbox",
			selected: null,
			checked: oCheckBox.getSelected()
		});

		oRm.write(">");		// DIV element

		// write the HTML into the render manager
		oRm.write("<div id='");
		oRm.write(oCheckBox.getId() + "-CbBg'");

		// CheckBox style class
		oRm.addClass("sapMCbBg");

		if (bEnabled && bEditable && sap.ui.Device.system.desktop) {
			oRm.addClass("sapMCbHoverable");
		}

		if (!oCheckBox.getActiveHandling()) {
			oRm.addClass("sapMCbActiveStateOff");
		}

		oRm.addClass("sapMCbMark"); // TODO: sapMCbMark is redundant, remove it and simplify CSS

		if (oCheckBox.getSelected()) {
			oRm.addClass("sapMCbMarkChecked");
		}
		oRm.writeClasses();

		oRm.write(">");		// DIV element

		oRm.write("<input type='CheckBox' id='");
		oRm.write(oCheckBox.getId() + "-CB'");

		if (oCheckBox.getSelected()) {
			oRm.writeAttribute("checked", "checked");
		}

		if (oCheckBox.getName()) {
			oRm.writeAttributeEscaped('name', oCheckBox.getName());
		}

		if (!bEnabled) {
			oRm.write(" disabled=\"disabled\"");
		}

		if (!bEditable) {
			oRm.write(" readonly=\"readonly\"");
		}

		oRm.write(" /></div>");
		oRm.renderControl(oCheckBox._oLabel);
		oRm.write("</div>");
	};


	return CheckBoxRenderer;

}, /* bExport= */ true);
