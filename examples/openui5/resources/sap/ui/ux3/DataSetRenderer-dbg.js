/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides default renderer for the sap.ui.ux3.DataSet
sap.ui.define(['jquery.sap.global'],
	function(jQuery) {
	"use strict";


	/**
	 * DataSet renderer.
	 * @namespace
	 */
	var DataSetRenderer = {
	};
	
	
	/**
	 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} oRenderManager The RenderManager that can be used for writing to the Render-Output-Buffer
	 * @param {sap.ui.core.Control} oControl An object representation of the control that should be rendered
	 */
	DataSetRenderer.render = function(oRenderManager, oControl){
		// convenience variable
		var rm = oRenderManager,
			oView = null;
	
		oControl.prepareRendering();
	
		rm.write("<div");
		rm.writeControlData(oControl);
		rm.addClass("sapUiUx3DS");
		rm.writeClasses();
		rm.writeStyles();
		rm.write(">");
		rm.write("<div id='" + oControl.getId() + "-toolbar'");
		rm.addClass('sapUiUx3DSToolbar');
		if (!oControl.getShowToolbar()) {
			rm.addClass('noPadding');
		}
		rm.writeClasses();
		rm.write(">");
		this.renderToolbar(rm,oControl);
		rm.write("</div>");
		rm.write("<div id='" + oControl.getId() + "-filter'");
		rm.addClass('sapUiUx3DSFilterArea');
		if (!oControl.getShowFilter()) {
			rm.addClass('noPadding');
		}
		rm.writeClasses();
		rm.write(">");
		this.renderFilterArea(rm,oControl);
		rm.write("</div>");
		rm.write("<div");
		rm.writeAttribute("id", oControl.getId() + "-items");
		rm.addClass("sapUiUx3DSItems");
		rm.writeClasses();
		rm.write(">");
		oView = sap.ui.getCore().byId(oControl.getSelectedView());
		rm.renderControl(oView);
		rm.write("</div>");
		rm.write("</div>");
	};
	
	/**
	 * Renders the HTML for the DataSet Toolbar
	 *
	 * @param {sap.ui.core.RenderManager}
	 *            oRenderManager The RenderManager that can be used for writing to
	 *            the Render-Output-Buffer
	 * @param {sap.ui.core.Control}
	 *            oControl An object representation of the control that should be
	 *            rendered
	 */
	DataSetRenderer.renderToolbar = function(oRenderManager,oControl) {
		var rm = oRenderManager;
		if (oControl.getShowToolbar()) {
			rm.renderControl(oControl._getToolbar());
		}
	};
	
	/**
	 * Renders the HTML for the DataSet FilterArea
	 *
	 * @param {sap.ui.core.RenderManager}
	 *            oRenderManager The RenderManager that can be used for writing to
	 *            the Render-Output-Buffer
	 * @param {sap.ui.core.Control}
	 *            oControl An object representation of the control that should be
	 *            rendered
	 */
	DataSetRenderer.renderFilterArea = function(oRenderManager,oControl) {
		var rm = oRenderManager, aFilter = oControl.getFilter();
		if (oControl.getShowFilter()) {
			jQuery.each(aFilter,function(i, oFilter){
				rm.renderControl(oFilter);
			});
		}
	};
	

	return DataSetRenderer;

}, /* bExport= */ true);
