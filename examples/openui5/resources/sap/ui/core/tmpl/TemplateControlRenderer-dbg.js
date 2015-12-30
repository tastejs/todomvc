/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// A renderer for the ScrollBar control
sap.ui.define(function() {
	"use strict";


	/**
	 * @class Control renderer.
	 * @static
	 * @alias sap.ui.core.tmpl.TemplateControlRenderer
	 */
	var TemplateControlRenderer = {};
	
	/**
	 * Renders the Template for the given control, using the provided
	 * {@link sap.ui.core.RenderManager}.
	 * 
	 * @param {sap.ui.core.RenderManager}
	 *            oRM RenderManager that can be used for writing to the
	 *            Render-Output-Buffer
	 * @param {sap.ui.core.tmpl.TemplateControl}
	 *            oControl Object representation of the template control 
	 *            that should be rendered
	 */
	TemplateControlRenderer.render = function(oRM, oControl) {
		
		// check the control being inlined or renders the control data itself
		var bSkipRootElement = oControl.isInline() || this.hasControlData;
		
		// we need to make sure to have a common root tag (therefore we add a DIV)
		// if we have no common root tag, the re-rendering would not clean up
		// the old markup properly.
		if (!bSkipRootElement) {
			oRM.write("<div");
			oRM.writeControlData(oControl);
			oRM.writeStyles();
			oRM.writeClasses();
			oRM.write(">");
		}
		
		// in case of declaring a control the renderTemplate function is part of the
		// specific renderer implementation - in case of anonymous template controls
		// the renderer is defined at the control instance
		var fnRenderer = this.renderTemplate || oControl.getTemplateRenderer();
		if (fnRenderer) {
			fnRenderer.apply(this, arguments);
		}
		
		if (!bSkipRootElement) {
			oRM.write("</div>");
		}
		
	};
	

	return TemplateControlRenderer;

}, /* bExport= */ true);
