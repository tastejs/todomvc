/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides default renderer for control sap.ui.commons.RadioButton
sap.ui.define(['jquery.sap.global', 'sap/ui/core/ValueStateSupport'],
	function(jQuery, ValueStateSupport) {
	"use strict";


	/**
	 * RadioButton Renderer
	 *
	 * @author SAP SE
	 * @namespace
	 */
	var RadioButtonRenderer = {
	};
	
	/**
	 * Renders the HTML for the RadioButton, using the provided {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} oRenderManager The RenderManager that can be used for writing to the render output buffer.
	 * @param {sap.ui.commons.RadioButton} oRadioButton The RadioButton control that should be rendered.
	 */
	RadioButtonRenderer.render = function(rm, oRadioButton) {
		var sId = oRadioButton.getId();
		var tooltip = oRadioButton.getTooltip_AsString();
	
		rm.addClass("sapUiRb");
	
		// Open the containing <span> tag
		rm.write("<span");
		rm.writeControlData(oRadioButton);
	
		// ARIA
		rm.writeAccessibilityState(oRadioButton, {
			role: "radio",
			checked: oRadioButton.getSelected() === true,
			invalid: oRadioButton.getValueState() == sap.ui.core.ValueState.Error,
			disabled: !oRadioButton.getEditable(),
			labelledby: sId + "-label",
			describedby: tooltip ? sId + "-Descr" : undefined
		});
	
		// Collect state information
		var enabled = oRadioButton.getEnabled() != null && oRadioButton.getEnabled();
		var editable = oRadioButton.getEditable() != null && oRadioButton.getEditable();
		var inErrorState = false;
		var inWarningState = false;
		if (oRadioButton.getValueState() != null) {
			inErrorState = sap.ui.core.ValueState.Error == oRadioButton.getValueState();
			inWarningState = sap.ui.core.ValueState.Warning == oRadioButton.getValueState();
		}
	
		// Add classes and properties depending on the state
		if (oRadioButton.getSelected()) {
			rm.addClass("sapUiRbSel");
		}
	
		var myTabIndex = 0;
		var bReadOnly = false;
	
		if (!enabled) {
			myTabIndex = -1;
			bReadOnly = true;
			rm.addClass("sapUiRbDis");
		}
		if (!editable) {
			//myTabIndex = -1; //According to CSN2581852 2012 a readonly RB should be in the tabchain
			bReadOnly = true;
			rm.addClass("sapUiRbRo");
		}
		if (inErrorState) {
			rm.addClass("sapUiRbErr");
		} else if (inWarningState) {
			rm.addClass("sapUiRbWarn");
		}
		if (enabled && editable && !inErrorState && !inWarningState) {
			rm.addClass("sapUiRbStd");
		}
		if (enabled && editable) {
			rm.addClass("sapUiRbInteractive");
		}
		rm.writeClasses();
	
		if (oRadioButton.getWidth() && oRadioButton.getWidth() != '') {
			rm.writeAttribute("style", "width:" + oRadioButton.getWidth() + ";");
		}
	
		rm.writeAttribute("tabIndex", myTabIndex);
	
		var tooltipToUse = ValueStateSupport.enrichTooltip(oRadioButton, tooltip ? tooltip : oRadioButton.getText());
		if (tooltipToUse) {
			rm.writeAttributeEscaped("title", tooltipToUse);
		}
	
		rm.write(">"); // Close the containing <span> tag
	
	
		// Write the real - potentially hidden - HTML RadioButton element
		rm.write("<input type='radio' tabindex='-1' id='");
		rm.write(sId);
		rm.write("-RB' name=\"");
		rm.writeEscaped(oRadioButton.getGroupName());
		rm.write("\" ");
		if (oRadioButton.getSelected()) {
			rm.write(" checked='checked'");
		}
		if (!enabled) {
			rm.write(" disabled='disabled'");
		}
		if (bReadOnly) {
			rm.write(" readonly='readonly'");
			rm.write(" disabled='disabled'");
		}
		if (oRadioButton.getKey()) {
			rm.writeAttributeEscaped("value", oRadioButton.getKey());
		}
	
		rm.write(" />"); // Close RadioButton-input-element
	
	
		// Write the RadioButton label which also holds the background image
		rm.write("<label id=\"" + sId + "-label\"");
		rm.writeAttribute("for", sId + "-RB"); // Label for RadioButton, so a click toggles the state
		if (!oRadioButton.getText()) {
			rm.write(" class=\"sapUiRbNoText\"");
		}
		rm.write(">");
		if (oRadioButton.getText()) {
			this.renderText(rm, oRadioButton.getText(), oRadioButton.getTextDirection());
		}
		rm.write("</label>");
	
		if (tooltip) {
			// for ARIA the tooltip must be in a separate SPAN and assigned via aria-describedby.
			// otherwise JAWS do not read it.
			rm.write("<span id=\"" + sId + "-Descr\" style=\"visibility: hidden; display: none;\">");
			rm.writeEscaped(tooltip);
			rm.write("</span>");
		}
		// Close the surrounding <span> element
		rm.write("</span>");
	};
	
	/**
	 * Write RadioButton label - either flat, or, in case the text direction is different from the environment, within a <span> with an explicit "dir".
	 */
	RadioButtonRenderer.renderText = function(oRenderManager, sText, eTextDirection) {
		var rm = oRenderManager;
		if (!eTextDirection || eTextDirection == sap.ui.core.TextDirection.Inherit) {
			rm.writeEscaped(sText);
		} else {
			rm.write("<span style=\"direction:" + eTextDirection.toLowerCase() + ";\">");
			rm.writeEscaped(sText);
			rm.write("</span>");
		}
	};
	
	RadioButtonRenderer.setSelected = function(oRadioButton, bSelected) {
	
		oRadioButton.$().toggleClass('sapUiRbSel', bSelected).attr('aria-checked', bSelected);
		var $Dom = oRadioButton.getDomRef("RB");
		if (bSelected) {
			$Dom.checked = true;
			$Dom.setAttribute('checked', 'checked');
		} else {
			$Dom.checked = false;
			$Dom.removeAttribute('checked');
		}
	
	};
	

	return RadioButtonRenderer;

}, /* bExport= */ true);
