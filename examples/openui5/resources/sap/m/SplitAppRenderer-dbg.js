/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(['jquery.sap.global', './SplitContainerRenderer', 'sap/ui/core/Renderer'],
	function(jQuery, SplitContainerRenderer, Renderer) {
	"use strict";

/**
	 * SplitApp renderer. 
	 * @namespace
	 */
	var SplitAppRenderer = {
	};
	
	var SplitAppRenderer = Renderer.extend(SplitContainerRenderer);
	
	SplitAppRenderer.renderAttributes = function(oRm, oControl){
		sap.m.BackgroundHelper.addBackgroundColorStyles(oRm, oControl.getBackgroundColor(),  oControl.getBackgroundImage());
	};
	
	SplitAppRenderer.renderBeforeContent = function(oRm, oControl){
		sap.m.BackgroundHelper.renderBackgroundImageTag(oRm, oControl, "sapMSplitContainerBG",  oControl.getBackgroundImage(), oControl.getBackgroundRepeat(), oControl.getBackgroundOpacity());
	};

	return SplitAppRenderer;

}, /* bExport= */ true);
