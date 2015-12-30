/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(['jquery.sap.global'],
	function(jQuery) {
	"use strict";

	/**
	 * Segmented renderer.
	 * @namespace
	 */
	var SegmentedButtonRenderer = {
	};

	/**
	 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} oRenderManager the RenderManager that can be used for writing to the Render-Output-Buffer
	 * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
	 */
	SegmentedButtonRenderer.render = function(oRM, oControl){
		var aButtons = oControl.getButtons(),
			sSelectedButton = oControl.getSelectedButton(),
			oButton,
			sTooltip,
			sButtonWidth,
			sButtonTextDirection,
			i = 0;

		// Select representation mockup
		if (oControl._bInOverflow) {
			oRM.write("<div");
			oRM.writeControlData(oControl);
			oRM.writeClasses();
			oRM.write(">");
			oRM.renderControl(oControl.getAggregation("_select"));
			oRM.write("</div>");
			return;
		}

		// write the HTML into the render manager
		oRM.write("<ul");
		oRM.addClass("sapMSegB");
		oRM.addClass("sapMSegBHide");
		oRM.writeClasses();
		if (oControl.getWidth() && oControl.getWidth() !== '') {
			oRM.addStyle('width', oControl.getWidth());
		}
		oRM.writeStyles();
		oRM.writeControlData(oControl);
		sTooltip = oControl.getTooltip_AsString();
		if (sTooltip) {
			oRM.writeAttributeEscaped("title", sTooltip);
		}

		// ARIA
		oRM.writeAccessibilityState(oControl, {
			role : "radiogroup"
		});

		oRM.write(">");

		for (; i < aButtons.length; i++) {
			oButton = aButtons[i];

			var sButtonText = oButton.getText(),
				oButtonIcon = oButton.getIcon(),
				sIconAriaLabel = "";

			if (oButtonIcon) {
				var oImage = oButton._getImage((oButton.getId() + "-img"), oButtonIcon);
				if (oImage instanceof sap.m.Image) {
					oControl._overwriteImageOnload(oImage);
				} else {
					sIconAriaLabel = oControl._getIconAriaLabel(oImage);
				}
			}

			// instead of the button API we render a li element but with the id of the button
			// only the button properties enabled, width, icon, text, and tooltip are evaluated here
			oRM.write("<li");
			oRM.writeControlData(oButton);
			oRM.addClass("sapMSegBBtn");
			if (oButton.aCustomStyleClasses !== undefined && oButton.aCustomStyleClasses instanceof Array) {
				for (var j = 0; j < oButton.aCustomStyleClasses.length; j++) {
					oRM.addClass(oButton.aCustomStyleClasses[j]);
				}
			}
			if (oButton.getEnabled()) {
				oRM.addClass("sapMSegBBtnFocusable");
			} else {
				oRM.addClass("sapMSegBBtnDis");
			}
			if (sSelectedButton === oButton.getId()) {
				oRM.addClass("sapMSegBBtnSel");
			}
			if (oButtonIcon && sButtonText !== '') {
				oRM.addClass("sapMSegBBtnMixed");
			}
			oRM.writeClasses();
			sButtonWidth = oButton.getWidth();
			if (sButtonWidth) {
				oRM.addStyle('width', sButtonWidth);
				oRM.writeStyles();
			} else {

				// Do not render buttons with their (auto) width now in order not to influence the parent's width.
				// (egg-chicken problem, e.g. SegmentedButton as "content" aggregation inside sap.m.Dialog).
				if (!oControl._bPreventWidthRecalculationOnAfterRendering) {//Make sure this happens when a real width
					// calculation will take place at "onAfterRendering", otherwise buttons will remain with width = 0.
					oRM.addStyle('width', "0px");
					oRM.writeStyles();
				}
			}
			sTooltip = oButton.getTooltip_AsString();
			if (sTooltip) {
				oRM.writeAttributeEscaped("title", sTooltip);
			}
			oRM.writeAttribute("tabindex", oButton.getEnabled() ? "0" : "-1");

			sButtonTextDirection = oButton.getTextDirection();
			if (sButtonTextDirection !== sap.ui.core.TextDirection.Inherit) {
				oRM.writeAttribute("dir", sButtonTextDirection.toLowerCase());
			}

			// ARIA
			oRM.writeAccessibilityState(oButton, {
				role : "radio",
				checked : sSelectedButton === oButton.getId()
			});

			// BCP:1570027826 If button has an icon add ARIA label containing the generic icon name
			if (oImage && sIconAriaLabel !== "") {
				// If there is text inside the button add it in the aria-label
				if (sButtonText !== "") {
					sIconAriaLabel += " " + sButtonText;
				}
				oRM.writeAttributeEscaped("aria-label", sIconAriaLabel);
			}

			oRM.write('>');

			if (oButtonIcon && oImage) {
				oRM.renderControl(oImage);
			}

			// render text
			if (sButtonText !== '') {
				oRM.writeEscaped(sButtonText, false);
			}
			oRM.write("</li>");
		}
		oRM.write("</ul>");
	};

	return SegmentedButtonRenderer;

}, /* bExport= */ true);
