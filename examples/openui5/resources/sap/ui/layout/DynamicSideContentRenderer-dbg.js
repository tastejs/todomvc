/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides default renderer for control sap.ui.layout.DynamicSideContent
sap.ui.define([],
	function() {
		"use strict";

		var SIDE_CONTENT_LABEL = "SIDE_CONTENT_LABEL";

		/**
		 * Renderer for sap.ui.layout.DynamicSideContent.
		 * @namespace
		 */
		var DynamicSideContentRenderer = {};

		DynamicSideContentRenderer.render = function (oRm, oSideContent) {
			oRm.write("<div");
			oRm.writeControlData(oSideContent);

			oRm.addClass("sapUiDSC");
			oRm.writeClasses();
			oRm.addStyle("height", "100%");
			oRm.writeStyles();
			oRm.write(">");

			this.renderSubControls(oRm, oSideContent);

			oRm.write("</div>");

		};

		DynamicSideContentRenderer.renderSubControls = function (oRm, oSideControl) {
			var iSideContentId = oSideControl.getId(),
				bShouldSetHeight = oSideControl._shouldSetHeight(),
				// on firefox the 'aside' side content is not shown when below the main content; use div instead
				sSideContentTag = sap.ui.Device.browser.firefox ? "div" : "aside";

			oRm.write("<div id='" + iSideContentId + "-MCGridCell'");

			if (oSideControl._iMcSpan) {
				oRm.addClass("sapUiDSCSpan" + oSideControl._iMcSpan);
				oRm.writeClasses();
			}
			if (bShouldSetHeight) {
				oRm.addStyle("height", "100%");
				oRm.writeStyles();
			}
			oRm.write(">");

			this.renderControls(oRm, oSideControl.getMainContent());
			oRm.write("</div>");

			oRm.write("<" + sSideContentTag + " id='" + iSideContentId + "-SCGridCell'");

			var oMessageBundle = sap.ui.getCore().getLibraryResourceBundle("sap.ui.layout");
			oRm.writeAttribute("aria-label", oMessageBundle.getText(SIDE_CONTENT_LABEL));

			oRm.writeAccessibilityState(oSideControl, {
				role: "complementary"
			});

			if (oSideControl._iScSpan) {
				oRm.addClass("sapUiDSCSpan" + oSideControl._iScSpan);
				oRm.writeClasses();
			}
			if (bShouldSetHeight) {
				oRm.addStyle("height", "100%");
				oRm.writeStyles();
			}
			oRm.write(">");

			this.renderControls(oRm, oSideControl.getSideContent());
			oRm.write("</" + sSideContentTag + ">");
		};

		DynamicSideContentRenderer.renderControls = function (oRM, aContent) {
			var iLength = aContent.length,
				i = 0;

			for (; i < iLength; i++) {
				oRM.renderControl(aContent[i]);
			}
		};

		return DynamicSideContentRenderer;
	}, /* bExport= */ true);
