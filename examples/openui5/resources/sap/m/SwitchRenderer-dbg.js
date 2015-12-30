/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(['jquery.sap.global'],
	function(jQuery) {
		"use strict";

		/**
		 * Switch renderer.
		 * @namespace
		 */
		var SwitchRenderer = {};

		/**
		 * CSS class to be applied to the HTML root element of the Switch control.
		 *
		 * @type {string}
		 */
		SwitchRenderer.CSS_CLASS = "sapMSwt";

		/**
		 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
		 *
		 * @param {sap.ui.core.RenderManager} oRm The RenderManager that can be used for writing to the Render-Output-Buffer.
		 * @param {sap.ui.core.Control} oSwitch An object representation of the control that should be rendered.
		 */
		SwitchRenderer.render = function(oRm, oSwitch) {
			var bState = oSwitch.getState(),
				sState = bState ? oSwitch._sOn : oSwitch._sOff,
				sTooltip = oSwitch.getTooltip_AsString(),
				bEnabled = oSwitch.getEnabled(),
				sName = oSwitch.getName(),
				bAccessibilityEnabled = sap.ui.getCore().getConfiguration().getAccessibility(),
				oRb = sap.ui.getCore().getLibraryResourceBundle("sap.m"),
				CSS_CLASS = SwitchRenderer.CSS_CLASS;

			oRm.write("<div");
			oRm.addClass(CSS_CLASS + "Cont");

			if (!bEnabled) {
				oRm.addClass(CSS_CLASS + "ContDisabled");
			}

			oRm.writeClasses();
			oRm.writeStyles();
			oRm.writeControlData(oSwitch);

			if (bEnabled) {
				oRm.writeAttribute("tabindex", "0");
			}

			if (sTooltip) {
				oRm.writeAttributeEscaped("title", sTooltip);
			}

			if (bAccessibilityEnabled) {
				this.writeAccessibilityState(oRm, oSwitch);
			}

			oRm.write("><div");
			oRm.writeAttribute("id", oSwitch.getId() + "-switch");
			oRm.writeAttribute("aria-hidden", "true");
			oRm.addClass(CSS_CLASS);
			oRm.addClass(bState ? CSS_CLASS + "On" : CSS_CLASS + "Off");
			oRm.addClass(CSS_CLASS + oSwitch.getType());

			if (sap.ui.Device.system.desktop && bEnabled) {
				oRm.addClass(CSS_CLASS + "Hoverable");
			}

			if (!bEnabled) {
				oRm.addClass(CSS_CLASS + "Disabled");
			}

			oRm.writeClasses();
			oRm.write("><div");
			oRm.addClass(CSS_CLASS + "Inner");
			oRm.writeAttribute("id", oSwitch.getId() + "-inner");
			oRm.writeClasses();
			oRm.write(">");

			// text
			this.renderText(oRm, oSwitch);

			// handle
			this.renderHandle(oRm, oSwitch, sState);

			oRm.write("</div>");
			oRm.write("</div>");

			if (sName) {

				// checkbox
				this.renderCheckbox(oRm, oSwitch, sState);
			}

			if (bAccessibilityEnabled) {
				this.renderInvisibleElement(oRm, oSwitch, {
					id: oSwitch.getInvisibleElementId(),
					text: oRb.getText(oSwitch.getInvisibleElementText())
				});
			}

			oRm.write("</div>");
		};

		SwitchRenderer.renderText = function(oRm, oSwitch) {
			var CSS_CLASS = SwitchRenderer.CSS_CLASS,
				bDefaultType = oSwitch.getType() === sap.m.SwitchType.Default;

			// on
			oRm.write("<div");
			oRm.addClass(CSS_CLASS + "Text");
			oRm.addClass(CSS_CLASS + "TextOn");
			oRm.writeAttribute("id", oSwitch.getId() + "-texton");
			oRm.writeClasses();
			oRm.write(">");
			oRm.write("<span");
			oRm.addClass(CSS_CLASS + "Label");
			oRm.addClass(CSS_CLASS + "LabelOn");
			oRm.writeClasses();
			oRm.write(">");

			if (bDefaultType) {
				oRm.writeEscaped(oSwitch._sOn);
			}

			oRm.write("</span>");
			oRm.write("</div>");

			// off
			oRm.write("<div");
			oRm.addClass(CSS_CLASS + "Text");
			oRm.addClass(CSS_CLASS + "TextOff");
			oRm.writeAttribute("id", oSwitch.getId() + "-textoff");
			oRm.writeClasses();
			oRm.write(">");
			oRm.write("<span");
			oRm.addClass(CSS_CLASS + "Label");
			oRm.addClass(CSS_CLASS + "LabelOff");
			oRm.writeClasses();
			oRm.write(">");

			if (bDefaultType) {
				oRm.writeEscaped(oSwitch._sOff);
			}

			oRm.write("</span>");
			oRm.write("</div>");
		};

		SwitchRenderer.renderHandle = function(oRm, oSwitch, sState) {
			var CSS_CLASS = SwitchRenderer.CSS_CLASS;

			oRm.write("<div");
			oRm.writeAttribute("id", oSwitch.getId() + "-handle");
			oRm.writeAttributeEscaped("data-sap-ui-swt", sState);
			oRm.addClass(CSS_CLASS + "Handle");

			if (sap.ui.Device.browser.webkit && Number(sap.ui.Device.browser.webkitVersion).toFixed(2) === "537.35") {
				oRm.addClass(CSS_CLASS + "WebKit537-35");
			}

			oRm.writeClasses();
			oRm.write("></div>");
		};

		SwitchRenderer.renderCheckbox = function(oRm, oSwitch, sState) {
			oRm.write('<input type="checkbox"');
			oRm.writeAttribute("id", oSwitch.getId() + "-input");
			oRm.writeAttributeEscaped("name", oSwitch.getName());
			oRm.writeAttributeEscaped("value", sState);

			if (oSwitch.getState()) {
				oRm.writeAttribute("checked", "checked");
			}

			if (!oSwitch.getEnabled()) {
				oRm.writeAttribute("disabled", "disabled");
			}

			oRm.write(">");
		};

		/**
		 * Writes the accessibility state.
		 * To be overwritten by subclasses.
		 *
		 * @param {sap.ui.core.RenderManager} oRm The RenderManager that can be used for writing to the render output buffer.
		 * @param {sap.ui.core.Control} oSwitch An object representation of the control that should be rendered.
		 */
		SwitchRenderer.writeAccessibilityState = function(oRm, oSwitch) {
			var mAriaLabelledby = oSwitch.getAriaLabelledBy(),
				mAccessibilityStates;

			if (mAriaLabelledby) {
				mAriaLabelledby = {
					value: oSwitch.getInvisibleElementId(),
					append: true
				};
			}

			mAccessibilityStates = {
				role: "checkbox",
				checked: oSwitch.getState(),
				labelledby: mAriaLabelledby
			};

			oRm.writeAccessibilityState(oSwitch, mAccessibilityStates);
		};

		/**
		 * Writes an invisible span element with a text node that is referenced in the ariaLabelledBy
		 * associations for screen reader announcement.
		 *
		 * To be overwritten by subclasses.
		 *
		 * @param {sap.ui.core.RenderManager} oRm The RenderManager that can be used for writing to the render output buffer.
		 * @param {sap.ui.core.Control} oSwitch An object representation of the control that should be rendered.
		 * @param {object} mOptions
		 */
		SwitchRenderer.renderInvisibleElement = function(oRm, oSwitch, mOptions) {
			oRm.write("<span");
			oRm.writeAttribute("id", mOptions.id);
			oRm.writeAttribute("aria-hidden", "true");
			oRm.addClass("sapUiInvisibleText");
			oRm.writeClasses();
			oRm.write(">");
			oRm.writeEscaped(mOptions.text);
			oRm.write("</span>");
		};

		return SwitchRenderer;

	}, /* bExport= */ true);