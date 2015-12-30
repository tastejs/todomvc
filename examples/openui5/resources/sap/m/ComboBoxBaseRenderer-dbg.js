/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global', './InputBaseRenderer', 'sap/ui/core/Renderer'],
	function(jQuery, InputBaseRenderer, Renderer) {
		"use strict";

		/**
		 * ComboBoxBase renderer.
		 *
		 * @namespace
		 */
		var ComboBoxBaseRenderer = Renderer.extend(InputBaseRenderer);

		/**
		 * CSS class to be applied to the root element of the ComboBoxBase.
		 *
		 * @readonly
		 * @const {string}
		 */
		ComboBoxBaseRenderer.CSS_CLASS = "sapMComboBoxBase";

		/**
		 * Add attributes to the input element.
		 *
		 * @param {sap.ui.core.RenderManager} oRm The RenderManager that can be used for writing to the render output buffer.
		 * @param {sap.ui.core.Control} oControl An object representation of the control that should be rendered.
		 */
		ComboBoxBaseRenderer.writeInnerAttributes = function(oRm, oControl) {
			oRm.writeAttribute("autocomplete", "off");
			oRm.writeAttribute("autocorrect", "off");
			oRm.writeAttribute("autocapitalize", "off");
		};

		/**
		 * Retrieves the ARIA role for the control.
		 * To be overwritten by subclasses.
		 *
		 */
		ComboBoxBaseRenderer.getAriaRole = function() {
			return "combobox";
		};

		/**
		 * Retrieves the accessibility state of the control.
		 * To be overwritten by subclasses.
		 *
		 * @param {sap.ui.core.Control} oControl An object representation of the control that should be rendered.
		 */
		ComboBoxBaseRenderer.getAccessibilityState = function(oControl) {
			var mAccessibilityState = sap.m.InputBaseRenderer.getAccessibilityState.call(this, oControl);

			mAccessibilityState.expanded = oControl.isOpen();
			mAccessibilityState.autocomplete = "both";
			return mAccessibilityState;
		};

		/**
		 * Add extra styles for input container.
		 *
		 * @param {sap.ui.core.RenderManager} oRm The RenderManager that can be used for writing to the render output buffer.
		 * @param {sap.ui.core.Control} oControl An object representation of the control that should be rendered.
		 */
		ComboBoxBaseRenderer.addOuterStyles = function(oRm, oControl) {
			oRm.addStyle("max-width", oControl.getMaxWidth());
		};

		/**
		 * Add classes to the ComboBox.
		 *
		 * @param {sap.ui.core.RenderManager} oRm The RenderManager that can be used for writing to the render output buffer.
		 * @param {sap.ui.core.Control} oControl An object representation of the control that should be rendered.
		 */
		ComboBoxBaseRenderer.addOuterClasses = function(oRm, oControl) {
			var CSS_CLASS = ComboBoxBaseRenderer.CSS_CLASS;

			oRm.addClass(CSS_CLASS);
			oRm.addClass(CSS_CLASS + "Input");

			if (!oControl.getEnabled()) {
				oRm.addClass(CSS_CLASS + "Disabled");
			}

			if (!oControl.getEditable()) {
				oRm.addClass(CSS_CLASS + "Readonly");
			}
		};

		/**
		 * Add inner classes to the ComboBox's input element.
		 *
		 * @param {sap.ui.core.RenderManager} oRm The RenderManager that can be used for writing to the render output buffer.
		 * @param {sap.ui.core.Control} oControl An object representation of the control that should be rendered.
		 */
		ComboBoxBaseRenderer.addInnerClasses = function(oRm, oControl) {
			var CSS_CLASS = ComboBoxBaseRenderer.CSS_CLASS;
			oRm.addClass(CSS_CLASS + "InputInner");

			if (!oControl.getEditable()) {
				oRm.addClass(CSS_CLASS + "InputInnerReadonly");
			}
		};

		/**
		 * Add the CSS value state classes to the control's root element using the provided {@link sap.ui.core.RenderManager}.
		 * To be overwritten by subclasses.
		 *
		 * @param {sap.ui.core.RenderManager} oRm The RenderManager that can be used for writing to the render output buffer.
		 * @param {sap.ui.core.Control} oControl An object representation of the control that should be rendered.
		 */
		ComboBoxBaseRenderer.addValueStateClasses = function(oRm, oControl) {
			InputBaseRenderer.addValueStateClasses.apply(this, arguments);
			var CSS_CLASS = ComboBoxBaseRenderer.CSS_CLASS;
			oRm.addClass(CSS_CLASS + "State");
			oRm.addClass(CSS_CLASS + oControl.getValueState());
		};

		/**
		 * Renders the ComboBox's arrow, using the provided {@link sap.ui.core.RenderManager}.
		 *
		 * @param {sap.ui.core.RenderManager} oRm The RenderManager that can be used for writing to the render output buffer.
		 * @param {sap.ui.core.Control} oControl An object representation of the control that should be rendered.
		 */
		ComboBoxBaseRenderer.writeInnerContent = function(oRm, oControl) {
			this.renderButton(oRm, oControl);
		};

		/**
		 * Renders the combo box button, using the provided {@link sap.ui.core.RenderManager}.
		 * To be overwritten by subclasses.
		 *
		 * @param {sap.ui.core.RenderManager} oRm The RenderManager that can be used for writing to the render output buffer.
		 * @param {sap.ui.core.Control} oControl An object representation of the control that should be rendered.
		 */
		ComboBoxBaseRenderer.renderButton = function(oRm, oControl) {
			var sId = oControl.getId(),
				sButtonId = sId + "-arrow",
				sButtonLabelId = sId + "-buttonlabel",
				oRb = sap.ui.getCore().getLibraryResourceBundle("sap.m");

			oRm.write('<button tabindex="-1"');
			oRm.writeAttribute("id", sButtonId);
			oRm.writeAttribute("aria-labelledby", sButtonLabelId);
			this.addButtonClasses(oRm, oControl);
			oRm.writeClasses();
			oRm.write(">");
			oRm.write("<label");
			oRm.writeAttribute("id", sButtonLabelId);
			oRm.addClass("sapUiInvisibleText");
			oRm.addClass(ComboBoxBaseRenderer.CSS_CLASS + "ButtonLabel");
			oRm.writeClasses();
			oRm.write(">");
			oRm.write(oRb.getText("COMBOBOX_BUTTON"));
			oRm.write("</label>");
			oRm.write("</button>");
		};

		/**
		 * Add CSS classes to the combo box arrow button, using the provided {@link sap.ui.core.RenderManager}.
		 * To be overwritten by subclasses.
		 *
		 * @param {sap.ui.core.RenderManager} oRm The RenderManager that can be used for writing to the render output buffer.
		 * @param {sap.ui.core.Control} oControl An object representation of the control that should be rendered.
		 */
		ComboBoxBaseRenderer.addButtonClasses = function(oRm, oControl) {
			oRm.addClass(ComboBoxBaseRenderer.CSS_CLASS + "Arrow");
		};

		return ComboBoxBaseRenderer;

	}, /* bExport= */ true);