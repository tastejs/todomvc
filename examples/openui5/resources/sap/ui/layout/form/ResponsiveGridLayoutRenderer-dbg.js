/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(['jquery.sap.global', 'sap/ui/core/Renderer', './FormLayoutRenderer'],
	function(jQuery, Renderer, FormLayoutRenderer) {
	"use strict";


	/**
	 * form/ResponsiveGridLayout renderer.
	 * @namespace
	 */
	var ResponsiveGridLayoutRenderer = Renderer.extend(FormLayoutRenderer);
	
	ResponsiveGridLayoutRenderer.getMainClass = function(){
		return "sapUiFormResGrid";
	};
	
	ResponsiveGridLayoutRenderer.renderContainers = function(rm, oLayout, oForm){
	
		var aContainers = oForm.getFormContainers();
		var aVisibleContainers = [];
		var iLength = 0;
		for ( var i = 0; i < aContainers.length; i++) {
			var oContainer = aContainers[i];
			if (oContainer.getVisible()) {
				iLength++;
				aVisibleContainers.push(oContainer);
			}
		}
	
		if (iLength > 0) {
			// special case: only one container -> do not render an outer Grid
			if (iLength > 1) {
				//render Grid
				rm.renderControl(oLayout._mainGrid);
			} else if (oLayout.mContainers[aVisibleContainers[0].getId()][0]) {
				// render panel
				rm.renderControl(oLayout.mContainers[aVisibleContainers[0].getId()][0]);
			} else {
				// render Grid of container
				rm.renderControl(oLayout.mContainers[aVisibleContainers[0].getId()][1]);
			}
		}
	
	};

	return ResponsiveGridLayoutRenderer;

}, /* bExport= */ true);
