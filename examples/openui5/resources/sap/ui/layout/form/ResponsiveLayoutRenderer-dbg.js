/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(['jquery.sap.global', 'sap/ui/core/Renderer', './FormLayoutRenderer'],
	function(jQuery, Renderer, FormLayoutRenderer) {
	"use strict";


	/**
	 * ResponsiveLayout renderer.
	 * @namespace
	 */
	var ResponsiveLayoutRenderer = Renderer.extend(FormLayoutRenderer);
	
	
	ResponsiveLayoutRenderer.getMainClass = function(){
		return "sapUiFormResLayout";
	};
	
	ResponsiveLayoutRenderer.renderContainers = function(rm, oLayout, oForm){
	
		var aContainers = oForm.getFormContainers();
		var iLength = 0;
		for ( var i = 0; i < aContainers.length; i++) {
			var oContainer = aContainers[i];
			if (oContainer.getVisible()) {
				iLength++;
			}
		}
	
		if (iLength > 0) {
			// special case: only one container -> do not render an outer ResponsiveFlowLayout
			if (iLength > 1) {
				//render ResponsiveFlowLayout
				rm.renderControl(oLayout._mainRFLayout);
			} else if (oLayout.mContainers[aContainers[0].getId()][0]) {
				// render panel
				rm.renderControl(oLayout.mContainers[aContainers[0].getId()][0]);
			} else {
				// render ResponsiveFlowLayout of container
				rm.renderControl(oLayout.mContainers[aContainers[0].getId()][1]);
			}
		}
	
	};
	

	return ResponsiveLayoutRenderer;

}, /* bExport= */ true);
