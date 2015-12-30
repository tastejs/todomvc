/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

 // Provides default renderer for the sap.ui.ux3.DataSetSimpleView
sap.ui.define(['jquery.sap.global'],
	function(jQuery) {
	"use strict";


	/**
	 * DataSetSimpleView renderer.
	 * @namespace
	 */
	var DataSetSimpleViewRenderer = {
	};
	
	
	/**
	 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} oRenderManager the RenderManager that can be used for writing to the Render-Output-Buffer
	 * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
	 */
	DataSetSimpleViewRenderer.render = function(oRenderManager, oControl){
	     // convenience variable
		var rm = oRenderManager;
		// write the HTML into the render manager
		rm.write("<div");
		rm.writeControlData(oControl);
		rm.addClass("sapUiUx3DSSV");
		if (oControl.getFloating()) {
			if (oControl.getResponsive()) {
				rm.addClass("sapUiUx3DSSVResponsive");
			} else {
				rm.addClass("sapUiUx3DSSVFloating");
			}
		} else {
			rm.addClass("sapUiUx3DSSVSingleRow");
		}
		if (oControl.getHeight()) {
			rm.addStyle("height", oControl.getHeight());
			rm.addClass("sapUiUx3DSSVSA");
		}
		rm.writeClasses();
		rm.writeStyles();
		rm.write(">"); // SPAN element
		if ( oControl.items) {
			for (var i = 0; i < oControl.items.length; i++) {
				this.renderItem(rm, oControl, oControl.items[i]);
			}
		}
		rm.write("</div>");
	};
	
	DataSetSimpleViewRenderer.renderItem = function(rm, oControl, oItem){
		rm.write("<div");
		rm.addClass("sapUiUx3DSSVItem");
		if (oControl.getFloating()) {
			rm.addClass("sapUiUx3DSSVFlow");
			if (oControl.getItemMinWidth() > 0) {
				rm.writeAttribute("style","min-width:" + oControl.getItemMinWidth() + "px");
			}
		}
		if (oControl.isItemSelected(oItem)) {
			rm.addClass("sapUiUx3DSSVSelected");
		}
		rm.writeClasses();
		rm.writeElementData(oItem);
		rm.write(">");
		rm.renderControl(oItem.getAggregation("_template"));
		rm.write("</div>");
	};
	

	return DataSetSimpleViewRenderer;

}, /* bExport= */ true);
