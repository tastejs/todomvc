/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides default renderer for control sap.ui.commons.TextArea
sap.ui.define(['jquery.sap.global', './TextFieldRenderer', 'sap/ui/core/Renderer'],
	function(jQuery, TextFieldRenderer, Renderer) {
	"use strict";


	/**
	 * TextArea renderer.
	 * @namespace
	 */
	var TextAreaRenderer = Renderer.extend(TextFieldRenderer);
	
	/**
	 * Use TextField to render TextArea but change tag to TEXTAREA
	 * @protected
	 */
	TextAreaRenderer.getInnerTagName = function(){
		return ('textarea');
	}
	
	/**
	 * Add attributes, styles and so on to TextField tag
	 */;
	TextAreaRenderer.renderInnerAttributes = function(oRenderManager, oTextArea){
	
		var rm = oRenderManager;
	
		rm.addClass("sapUiTxtA");
	
		rm.addStyle('overflow', 'auto');
	
		/*eslint-disable no-empty */
		//TODO Rethink if empty block is needed
		if (oTextArea.getWidth() && oTextArea.getWidth() != '') {
	//		done in TextField renderer
		} else {
			if (oTextArea.getCols() && oTextArea.getCols() != '') {
				rm.writeAttribute('cols', oTextArea.getCols());
			}
		}
		/*eslint-enable no-empty */
	
		if (oTextArea.getHeight() && oTextArea.getHeight() != '') {
			rm.addStyle('height',oTextArea.getHeight());
			//if a height is set don't use margin-top and margin-button because this would it make higher than wanted
			//this would lead to scrollbars or cut controls in layouts
			rm.addStyle('margin-top','0');
			rm.addStyle('margin-bottom','0');
		} else {
			if (oTextArea.getRows() && oTextArea.getRows() != '') {
				rm.writeAttribute('rows', oTextArea.getRows());
			}
		}
	
		// Changes of the wrap property require re-rendering for browser reasons.
		// Therefore, no dynamic function to change wrapping necessary.
		switch (oTextArea.getWrapping()) {
		case (sap.ui.core.Wrapping.Soft) :
			rm.writeAttribute('wrap', 'soft');
			break;
		case (sap.ui.core.Wrapping.Hard) :
			rm.writeAttribute('wrap', 'hard');
			break;
		case (sap.ui.core.Wrapping.Off) :
			rm.writeAttribute('wrap', 'off');
			break;
		}
	}
	
	/**
	 * Overwrite renderARIAInfo function of TextField
	 */;
	TextAreaRenderer.renderARIAInfo = function(rm, oTextArea) {
	
		rm.writeAccessibilityState(oTextArea, {
			role: oTextArea.getAccessibleRole().toLowerCase() || 'textbox',
			labelledby: oTextArea.getLabeledBy() ? (oTextArea.getLabeledBy() + " " + oTextArea.getAriaDescribedBy().join(" ")) : undefined,
			required: oTextArea.getRequired(),
			readonly: !oTextArea.getEditable(),
			multiline: true,
			autocomplete: "none",
			invalid: oTextArea.getValueState() == sap.ui.core.ValueState.Error});
	
	};
	
	/**
	 * Renders additional HTML for the TextArea to the TextField
	 *
	 * @param {sap.ui.fw.RenderManager} oRenderManager The RenderManager that can be used for writing to the render output buffer.
	 * @param {sap.ui.fw.Control} oControl An object representation of the control that should be rendered.
	 */
	TextAreaRenderer.renderInnerContent = function(oRenderManager, oTextArea){
		// Convenience variable
		var rm = oRenderManager;
	
		var sValue = oTextArea.getValue();
		var sPlaceholder = oTextArea.getPlaceholder();
	
		if (sValue.length > oTextArea.getMaxLength() && oTextArea.getMaxLength() > 0) {
			sValue = sValue.substring(0,oTextArea.getMaxLength());
		}
	
		if (!sap.ui.Device.support.input.placeholder && sPlaceholder && !sValue) {
			rm.writeEscaped(sPlaceholder);
		} else {
			rm.writeEscaped(sValue);
		}
	};

	return TextAreaRenderer;

}, /* bExport= */ true);
