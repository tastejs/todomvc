/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides default renderer for control sap.ui.commons.TriStateCheckBox
sap.ui.define(['jquery.sap.global', 'sap/ui/core/ValueStateSupport'],
	function(jQuery, ValueStateSupport) {
	"use strict";


	/**
	 * @author SAP SE
	 * @namespace
	 */
	var TriStateCheckBoxRenderer = {};

	/**
	 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} oRm the RenderManager that can be used for writing to the render output buffer
	 * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
	 */
	TriStateCheckBoxRenderer.render = function(oRm, oControl) {
		var myTabIndex = 0;
		var bReadOnly = false;

		// Collect state information
		var enabled = !!oControl.getEnabled();
		var editable = !!oControl.getEditable();
		var inErrorState = false;
		var inWarningState = false;
		var selectedState = oControl.getSelectionState();
		var ariaState = selectedState.toLowerCase();
		if (ariaState == "checked") {
			ariaState = true;
		} else if (ariaState == "unchecked") {
			ariaState = false;
		}
		var tooltip = ValueStateSupport.enrichTooltip(oControl, oControl.getTooltip_AsString());
		var ariaLabelId = "sapUiAriaLabel" + oControl.getIdForLabel();
		if (oControl.getValueState() != null) {
			inErrorState = sap.ui.core.ValueState.Error == oControl.getValueState();
			inWarningState = sap.ui.core.ValueState.Warning == oControl.getValueState();
		}

		// write the HTML into the render manager
		//outer span containing aria information, tabindex, text and tooltip etc.
		oRm.write("<span");
		oRm.writeControlData(oControl);

		oRm.addClass("sapUiTriCb");

		if (!!oControl.getWidth()) {
			oRm.writeAttribute("style", "width:" + oControl.getWidth() + ";");
		}
		oRm.writeAccessibilityState(oControl, {
			"role" : sap.ui.core.AccessibleRole.Checkbox.toLowerCase(),
			"checked" : ariaState
			});
		oRm.writeClasses();
		if (!enabled) {
			myTabIndex = -1;
		}
		oRm.writeAttribute("tabIndex", myTabIndex);
		oRm.write(">");

		// inner span carrying metadata and style according to the current state
		oRm.write("<span");

		oRm.writeAccessibilityState(oControl, {"labelledby": ariaLabelId});

		if (tooltip) {
			oRm.writeAttributeEscaped("title", tooltip);
		}

		if (!enabled) {
			bReadOnly = true;
			myTabIndex = -1;
			oRm.write(" disabled='disabled'");
		}

		if (!editable) {
			bReadOnly = true;
		}

		if (bReadOnly) {
			oRm.write(" readOnly='readOnly'");
		}

		oRm.addClass("sapUiTriCbInner");

		if (!enabled) {
			oRm.addClass("sapUiTriCbDis");
		}

		if (!editable) {
			oRm.addClass("sapUiTriCbRo");
		}

		if (inErrorState) {
			oRm.addClass("sapUiTriCbErr");
		} else if (inWarningState) {
			oRm.addClass("sapUiTriCbWarn");
		}

		// Add classes and properties depending on the state
		if (selectedState === "Checked") {
			oRm.addClass("sapUiTriCbCheck");
		} else if (selectedState === "Mixed") {
			oRm.addClass("sapUiTriCbMix");
		}

		oRm.writeClasses();
		oRm.write(">"); // span element
		oRm.write("</span>");

	// render text into the outer span
		if (oControl.getText()) {
			this.renderText(ariaLabelId, oRm, oControl.getText(), oControl.getTextDirection());
		}
		oRm.write("</span>");

	};

	/**
	 * Write the descriptive span for the CheckBox along with an explicit "dir" in case the text direction is different from the environment.
	 * Add sLabelId as id for aria-labelledby support
	 *
	 */
	 TriStateCheckBoxRenderer.renderText = function(sLabelId, oRenderManager, sText, eTextDirection) {
		var oRm = oRenderManager;
		oRm.write("<span id=" + sLabelId + " class=\"sapUiTriCbLbl\"");
		if (!eTextDirection || eTextDirection == sap.ui.core.TextDirection.Inherit) {
			oRm.write(">");
			oRm.writeEscaped(sText);
		} else {
			oRm.write(" style=\"direction:" + eTextDirection.toLowerCase() + ";\">");
			oRm.writeEscaped(sText);
		}
		oRm.write("</span>");
	};

	return TriStateCheckBoxRenderer;

}, /* bExport= */ true);
