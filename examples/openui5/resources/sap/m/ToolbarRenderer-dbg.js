/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(['jquery.sap.global', './BarInPageEnabler'],
	function(jQuery, BarInPageEnabler) {
	"use strict";


	/**
	 * Toolbar renderer.
	 * @namespace
	 */
	var ToolbarRenderer = {};

	/**
	 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
	 * @protected
	 * @param {sap.ui.core.RenderManager} oRM the RenderManager that can be used for writing to the render output buffer.
	 * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered.
	 */
	ToolbarRenderer.render = BarInPageEnabler.prototype.render;

	/**
	 * Add classes attributes and styles to the root tag
	 *
	 * @param {sap.ui.core.RenderManager} oRM the RenderManager that can be used for writing to the Render-Output-Buffer
	 * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
	 */
	ToolbarRenderer.decorateRootElement = function (rm, oToolbar) {
		rm.addClass("sapMTB");

		// ARIA
		var aContent = oToolbar.getContent();
		if (oToolbar.getActive() && (!aContent || aContent.length === 0)) {
			rm.writeAccessibilityState(oToolbar, {
				role: "button"
			});
		} else {
			rm.writeAccessibilityState(oToolbar, {
				role: "toolbar"
			});
		}


		if (!sap.m.Toolbar.hasFlexBoxSupport) {
			rm.addClass("sapMTBNoFlex");
		} else if (!sap.m.Toolbar.hasNewFlexBoxSupport) {
			rm.addClass("sapMTBOldFlex");
		} else {
			rm.addClass("sapMTBNewFlex");
		}

		if (oToolbar.getActive()) {
			rm.addClass("sapMTBActive");
			rm.writeAttribute("tabindex", "0");
		} else {
			rm.addClass("sapMTBInactive");
		}

		rm.addClass("sapMTB-" + oToolbar.getActiveDesign() + "-CTX");

		var sWidth = oToolbar.getWidth();
		var sHeight = oToolbar.getHeight();
		sWidth && rm.addStyle("width", sWidth);
		sHeight && rm.addStyle("height", sHeight);
	};

	ToolbarRenderer.renderBarContent = function(rm, oToolbar) {
		oToolbar.getContent().forEach(function(oControl) {
			sap.m.BarInPageEnabler.addChildClassTo(oControl, oToolbar);
			rm.renderControl(oControl);
		});
	};

	/**
	 * Determines, if the IBarContext classes should be added to the control
	 * @private
	 */
	ToolbarRenderer.shouldAddIBarContext = function (oControl) {
		return false;
	};



	return ToolbarRenderer;

}, /* bExport= */ true);
