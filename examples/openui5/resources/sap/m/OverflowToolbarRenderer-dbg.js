/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(['sap/ui/core/Renderer', './ToolbarRenderer'],
	function(Renderer, ToolbarRenderer) {
		"use strict";


		/**
		 * OverflowToolbar renderer.
		 * @namespace
		 */
		var OverflowToolbarRenderer = Renderer.extend(ToolbarRenderer);

		OverflowToolbarRenderer.renderBarContent = function(rm, oToolbar) {

			oToolbar._getVisibleContent().forEach(function(oControl) {
				sap.m.BarInPageEnabler.addChildClassTo(oControl,oToolbar);
				rm.renderControl(oControl);
			});

			if (oToolbar._getOverflowButtonNeeded()) {
				OverflowToolbarRenderer.renderOverflowButton(rm,oToolbar);
			}
		};

		OverflowToolbarRenderer.renderOverflowButton = function(rm,oToolbar) {
			var oOverflowButton = oToolbar._getOverflowButton();
			sap.m.BarInPageEnabler.addChildClassTo(oOverflowButton,oToolbar);
			rm.renderControl(oOverflowButton);
		};

		return OverflowToolbarRenderer;

	}, /* bExport= */ true);
