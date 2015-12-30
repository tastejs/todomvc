/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides default renderer for XMLView
sap.ui.define(['jquery.sap.global', './ViewRenderer', '../RenderManager', '../library'],
	function(jQuery, ViewRenderer, RenderManager, CoreLib) {
	"use strict";

	// shortcut
	var PREFIX_DUMMY = CoreLib.RenderPrefixes.Dummy;

	/**
	 * @namespace
	 * @alias sap.ui.core.mvc.XMLViewRenderer
	 * @private
	 */
	var XMLViewRenderer = {
	};


	/**
	 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} oRenderManager the RenderManager that can be used for writing to the Render-Output-Buffer
	 * @param {sap.ui.core.mvc.XMLView} oControl an object representation of the control that should be rendered
	 */
	XMLViewRenderer.render = function(rm, oControl) {
		// make sure to preserve the content if not preserved yet 
		var oDomRef = oControl.getDomRef();
		if (oDomRef && !RenderManager.isPreservedContent(oDomRef)) {
			RenderManager.preserveContent(oDomRef, /* bPreserveRoot= */ true);
		}
		// write the HTML into the render manager
		var $oldContent = oControl._$oldContent = RenderManager.findPreservedContent(oControl.getId());
		if ( $oldContent.length === 0) {
			// jQuery.sap.log.debug("rendering " + oControl + " anew");
			var bSubView = oControl.isSubView();
			if (!bSubView) {
				rm.write("<div");
				rm.writeControlData(oControl);
				rm.addClass("sapUiView");
				rm.addClass("sapUiXMLView");
				ViewRenderer.addDisplayClass(rm, oControl);
				if (!oControl._oAsyncState || !oControl._oAsyncState.suppressPreserve) {
					// do not preserve when rendering initially in async mode
					rm.writeAttribute("data-sap-ui-preserve", oControl.getId());
				}
				if (oControl.getWidth()) {
					rm.addStyle("width", oControl.getWidth());
				}
				if (oControl.getHeight()) {
					rm.addStyle("height", oControl.getHeight());
				}
				rm.writeStyles();

				rm.writeClasses();

				rm.write(">");
			}
			if (oControl._aParsedContent) {
				for (var i = 0; i < oControl._aParsedContent.length; i++) {
					var fragment = oControl._aParsedContent[i];
					if (fragment && typeof (fragment) === "string") {
						rm.write(fragment);
					} else {
						rm.renderControl(fragment);
						// when the child control did not render anything (e.g. visible=false), we add a placeholder to know where to render the child later
						if ( !fragment.bOutput ) {
							rm.write('<div id="' + PREFIX_DUMMY + fragment.getId() + '" class="sapUiHidden"/>');
						}
					}
				}
			}
			if (!bSubView) {
				rm.write("</div>");
			}

		} else {

			// render dummy control for early after rendering notification
			rm.renderControl(oControl.oAfterRenderingNotifier);

			// jQuery.sap.log.debug("rendering placeholder instead of " + oControl + " (preserved dom)");
			// preserve mode: render only root tag and child controls
			rm.write('<div id="' + PREFIX_DUMMY + oControl.getId() + '" class="sapUiHidden">');
			for (var i = 0; i < oControl._aParsedContent.length; i++) {
				var fragment = oControl._aParsedContent[i];
				if ( typeof (fragment) !== "string") {
					// jQuery.sap.log.debug("replacing preserved DOM for child " + fragment + " with a placeholder");
					jQuery.sap.byId(fragment.getId(), $oldContent).replaceWith('<div id="' + PREFIX_DUMMY + fragment.getId() + '" class="sapUiHidden"/>');
					rm.renderControl(fragment);
				}
			}
			rm.write('</div>');

		}
	};


	return XMLViewRenderer;

}, /* bExport= */ true);
