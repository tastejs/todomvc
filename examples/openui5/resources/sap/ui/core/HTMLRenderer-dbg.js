/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// A renderer for the HTML control
sap.ui.define(['./library'], function(library) {
	"use strict";


	// local shortcut
	var RenderPrefixes = library.RenderPrefixes;

	var HTMLRenderer = {
	
		/**
		 * Renders either the configured content or a dummy div that will be replaced after rendering
		 * 
		 * @param {sap.ui.core.RenderManager} [oRM] The RenderManager instance
		 * @param {sap.ui.core.Control} [oControl] The instance of the invisible control
		 */
		render : function(oRM, oControl) {
			// render an invisible, but easily identifiable placeholder for the content
			oRM.write("<div id=\"" + RenderPrefixes.Dummy + oControl.getId() + "\" style=\"display:none\">");

			// Note: we do not render the content string here, but only in onAfterRendering
			// This has the advantage that syntax errors don't affect the whole control tree
			// but only this control...

			oRM.write("</div>");
		}

	};

	return HTMLRenderer;

}, /* bExport= */ true);
