/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(['jquery.sap.global', 'sap/ui/core/Renderer', './InputBaseRenderer'],
	function(jQuery, Renderer, InputBaseRenderer) {
	"use strict";


	/**
	 * Input renderer.
	 * @namespace
	 *
	 * InputRenderer extends the InputBaseRenderer
	 */
	var InputRenderer = Renderer.extend(InputBaseRenderer);

	/**
	 * Adds control specific class
	 *
	 * @param {sap.ui.core.RenderManager} oRm the RenderManager that can be used for writing to the render output buffer
	 * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
	 */
	InputRenderer.addOuterClasses = function(oRm, oControl) {
		oRm.addClass("sapMInput");
		if (oControl.getShowValueHelp() && oControl.getEnabled() && oControl.getEditable()) {
			oRm.addClass("sapMInputVH");
			if (oControl.getValueHelpOnly()) {
				oRm.addClass("sapMInputVHO");
			}
			if (sap.ui.Device.browser.internet_explorer && sap.ui.Device.browser.version < 11) {
				// IE9 and IE10 ignore padding-right in <input>
				oRm.addClass("sapMInputIE9");
			}
		}
		if (oControl.getDescription()) {
				oRm.addClass("sapMInputDescription");
		}
	};

	/**
	 * Add extra styles for input container
	 *
	 * @param {sap.ui.core.RenderManager} oRm the RenderManager that can be used for writing to the render output buffer
	 * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
	 */
	InputRenderer.addOuterStyles = function(oRm, oControl) {
	};

	/**
	 * add extra attributes to Input
	 *
	 * @param {sap.ui.core.RenderManager} oRm the RenderManager that can be used for writing to the render output buffer
	 * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
	 */
	InputRenderer.writeInnerAttributes = function(oRm, oControl) {
		oRm.writeAttribute("type", oControl.getType().toLowerCase());
		if ((!oControl.getEnabled() && oControl.getType() == "Password")
				|| (oControl.getShowSuggestion() && oControl._bUseDialog)
				|| (oControl.getValueHelpOnly() && oControl.getEnabled() && oControl.getEditable() && oControl.getShowValueHelp())) {
			// required for JAWS reader on password fields on desktop and in other cases:
			oRm.writeAttribute("readonly", "readonly");
		}
	};

	/**
	 * Adds inner css classes to the input field
	 *
	 * @param {sap.ui.core.RenderManager} oRm the RenderManager that can be used for writing to the render output buffer
	 * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
	 */
	InputRenderer.addInnerClasses = function(oRm, oControl) {
	};

	/**
	 * Add inner styles to the input field
	 *
	 * @param {sap.ui.core.RenderManager} oRm the RenderManager that can be used for writing to the render output buffer
	 * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
	 */
	InputRenderer.addInnerStyles = function(oRm, oControl) {

		if (oControl.getDescription()) {
			oRm.addStyle("width", oControl.getFieldWidth() || "50%");
		}
	};

	/**
	 * add extra content to Input
	 *
	 * @param {sap.ui.core.RenderManager} oRm the RenderManager that can be used for writing to the render output buffer
	 * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
	 */
	InputRenderer.writeInnerContent = function(oRm, oControl) {

		if (!oControl.getDescription()) {
			this.writeValueHelpIcon(oRm, oControl);
		}else {
			var sDescription = oControl.getDescription();
			oRm.write("<span>");
			this.writeValueHelpIcon(oRm, oControl);
			oRm.writeEscaped(sDescription);
			oRm.write("</span>");
		}

		if (sap.ui.getCore().getConfiguration().getAccessibility()) {
			if (oControl.getShowSuggestion() && oControl.getEnabled() && oControl.getEditable()) {
				oRm.write("<span id=\"" + oControl.getId() + "-SuggDescr\" class=\"sapUiInvisibleText\" role=\"status\" aria-live=\"polite\"></span>");
			}
		}

	};

	InputRenderer.writeValueHelpIcon = function(oRm, oControl) {

		if (oControl.getShowValueHelp() && oControl.getEnabled() && oControl.getEditable()) {
			oRm.write('<div class="sapMInputValHelp">');
			oRm.renderControl(oControl._getValueHelpIcon());
			oRm.write("</div>");
		}

	};

	/**
	 * Add inner styles to the placeholder
	 *
	 * @param {sap.ui.core.RenderManager} oRm the RenderManager that can be used for writing to the render output buffer
	 * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
	 */
	InputRenderer.addPlaceholderStyles = function(oRm, oControl) {

		if (oControl.getDescription()) {
			oRm.addStyle("width", oControl.getFieldWidth() || "50%");
		}

	};

	InputRenderer.getAriaDescribedBy = function(oControl) {

		var sAriaDescribedBy = InputBaseRenderer.getAriaDescribedBy.apply(this, arguments);

		if (oControl.getShowValueHelp() && oControl.getEnabled() && oControl.getEditable()) {
			if (sAriaDescribedBy) {
				sAriaDescribedBy = sAriaDescribedBy + " " + oControl._sAriaValueHelpLabelId;
			} else {
				sAriaDescribedBy = oControl._sAriaValueHelpLabelId;
			}
			if (oControl.getValueHelpOnly()) {
				sAriaDescribedBy = sAriaDescribedBy + " " + oControl._sAriaInputDisabledLabelId;
			}
		}

		if (oControl.getShowSuggestion() && oControl.getEnabled() && oControl.getEditable()) {
			if (sAriaDescribedBy) {
				sAriaDescribedBy = sAriaDescribedBy + " " + oControl.getId() + "-SuggDescr";
			} else {
				sAriaDescribedBy = oControl.getId() + "-SuggDescr";
			}
		}

		return sAriaDescribedBy;

	};

	InputRenderer.getAccessibilityState = function(oControl) {

		var mAccessibilityState = InputBaseRenderer.getAccessibilityState.apply(this, arguments);

		if (oControl.getShowSuggestion() && oControl.getEnabled() && oControl.getEditable()) {
			mAccessibilityState.autocomplete = "list";
		}

		return mAccessibilityState;

	};

	return InputRenderer;

}, /* bExport= */ true);
