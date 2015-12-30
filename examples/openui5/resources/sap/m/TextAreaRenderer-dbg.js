/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(['jquery.sap.global', 'sap/ui/core/Renderer', './InputBaseRenderer'],
	function(jQuery, Renderer, InputBaseRenderer) {
	"use strict";


	/**
	 * TextArea renderer.
	 * @namespace
	 */
	var TextAreaRenderer = {};
	
	
	/**
	 * Input renderer.
	 * @namespace
	 *
	 * TextAreaRenderer extends the TextAreaRenderer
	 */
	var TextAreaRenderer = Renderer.extend(InputBaseRenderer);
	
	// Adds control specific class
	TextAreaRenderer.addOuterClasses = function(oRm, oControl) {
		oRm.addClass("sapMTextArea");
	};
	
	// Add extra styles to Container
	TextAreaRenderer.addOuterStyles = function(oRm, oControl) {
		oControl.getHeight() && oRm.addStyle("height", oControl.getHeight());
	};
	
	// Write the opening tag name of the TextArea
	TextAreaRenderer.openInputTag = function(oRm, oControl) {
		oRm.write("<textarea");
	};
	
	// Write the closing tag name of the TextArea
	TextAreaRenderer.closeInputTag = function(oRm, oControl) {
		oRm.write("</textarea>");
	};
	
	// TextArea does not have value property as HTML element, so overwrite base method
	TextAreaRenderer.writeInnerValue = function() {
	};
	
	// Write the value of the TextArea
	TextAreaRenderer.writeInnerContent = function(oRm, oControl) {
		var sValue = oControl.getValue();
		sValue = jQuery.sap.encodeHTML(sValue);
		
		// Convert the new line HTML entity rather than displaying it as a text. 
		//Normalize the /n and /r to /r/n - Carriage Return and Line Feed
		sValue = sValue.replace(/&#xd;&#xa;|&#xd;|&#xa;/g, "&#13;&#10;");
		oRm.write(sValue);
	};
	
	// Add extra classes for TextArea element
	TextAreaRenderer.addInnerClasses = function(oRm, oControl) {
		oRm.addClass("sapMTextAreaInner");
	};
	
	// Returns the accessibility state of the control.
	TextAreaRenderer.getAccessibilityState = function(oControl) {
		var mBaseAccessibilityState = InputBaseRenderer.getAccessibilityState.call(this, oControl);
		return jQuery.extend(mBaseAccessibilityState, {
			multiline: true
		});
	}; 
	
	// Add extra attributes to TextArea
	TextAreaRenderer.writeInnerAttributes = function(oRm, oControl) {
		if (oControl.getWrapping() && oControl.getWrapping() != "None") {
			oRm.writeAttribute("wrap", oControl.getWrapping());
		}
		oRm.writeAttribute("rows", oControl.getRows());
		oRm.writeAttribute("cols", oControl.getCols());
	};

	return TextAreaRenderer;

}, /* bExport= */ true);
