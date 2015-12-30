/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global', './InputRenderer', 'sap/ui/core/Renderer'],
	function(jQuery, InputRenderer, Renderer) {
	"use strict";


	/**
	 * MultiInput renderer.
	 * @namespace
	 */
	var MultiInputRenderer = Renderer.extend(InputRenderer);
	
	MultiInputRenderer.getAriaDescribedBy = function(oControl) {

		var sAriaDescribedBy = InputRenderer.getAriaDescribedBy.apply(this, arguments);

		if (oControl.getTokens().length > 0) {
			if (sAriaDescribedBy) {
				sAriaDescribedBy = sAriaDescribedBy + " " + oControl._sAriaMultiInputContainTokenId;
			} else {
				sAriaDescribedBy = oControl._sAriaMultiInputContainTokenId;
			}
		}

		return sAriaDescribedBy;

	};
	
	
	MultiInputRenderer.openInputTag = function(oRm, oControl) {
		
		if (oControl.getEnableMultiLineMode() || oControl._bUseDialog){
			
			oControl._isMultiLineMode = true;
			
			// add multi-line css to the boarder if the multi-line mode is on 
			if ( !oControl._bUseDialog && oControl._bShowIndicator === false ) {
				oRm.write("<div id=\"" + oControl.getId() + "-border\" class=\"sapMMultiInputBorder sapMMultiInputMultiModeBorder\">");					
			} else {
				oControl._showIndicator();	
				
				//render the single line
				oRm.write("<div id=\"" + oControl.getId() + "-border\" class=\"sapMMultiInputBorder\">");
			}

		} else {
			oRm.write("<div id=\"" + oControl.getId() + "-border\" class=\"sapMMultiInputBorder\">");
			
		}

		MultiInputRenderer._renderTokens(oRm, oControl);
		MultiInputRenderer._renderInput(oRm, oControl);	
	};

	MultiInputRenderer._renderTokens = function(oRm, oControl) {
		oRm.renderControl(oControl._tokenizer);
	};
	
	MultiInputRenderer._renderInput = function(oRm, oControl) {
		
		if ( oControl._isMultiLineMode && oControl._bShowIndicator === false ) {
			oRm.write("<div class=\"sapMMultiInputInputContainer sapMMultiInputMultiModeInputContainer\">");
		} else {
			if ( oControl._isMultiLineMode && oControl._bShowIndicator === true) {
				var iTokens = oControl.getTokens().length;
				oRm.write("<span class=\"sapMMultiInputIndicator\">");
				if (iTokens > 1) {
					var oMessageBundle = sap.ui.getCore().getLibraryResourceBundle("sap.m");
					oRm.write( oMessageBundle.getText("MULTIINPUT_SHOW_MORE_TOKENS", iTokens - 1) );
				}
				oRm.write("</span>");
			}
			oRm.write("<div class=\"sapMMultiInputInputContainer\">");
		}

		InputRenderer.openInputTag.call(this, oRm, oControl);
		
	};

	
	MultiInputRenderer.closeInputTag = function(oRm, oControl) {
		InputRenderer.closeInputTag.call(this, oRm, oControl);

		oRm.write("</div>");
		oRm.write("</div>");
		oRm.write("<div class=\"sapMMultiInputShadowDiv\"/>");
	};
	

	return MultiInputRenderer;

}, /* bExport= */ true);
