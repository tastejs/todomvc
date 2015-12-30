/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global', 'sap/ui/core/Renderer', './InputBaseRenderer'],
	function(jQuery, Renderer, InputBaseRenderer) {
	"use strict";


	/**
	 * DatePicker renderer.
	 * @namespace
	 */
	var DatePickerRenderer = Renderer.extend(InputBaseRenderer);

	/**
	 * Adds control specific class
	 *
	 * @param {sap.ui.core.RenderManager} oRm the RenderManager that can be used for writing to the render output buffer
	 * @param {sap.m.DatePicker} oDP an object representation of the control that should be rendered
	 */
	DatePickerRenderer.addOuterClasses = function(oRm, oDP) {

		oRm.addClass("sapMDP");
		if (oDP.getEnabled() && oDP.getEditable()) {
			oRm.addClass("sapMInputVH"); // just reuse styling of value help icon
		}

		if (sap.ui.Device.browser.internet_explorer && sap.ui.Device.browser.version < 11) {
			oRm.addClass("sapMInputIE9");
		}

	};

	/**
	 * add extra content to Input
	 *
	 * @param {sap.ui.core.RenderManager} oRm the RenderManager that can be used for writing to the render output buffer
	 * @param {sap.m.DatePicker} oDP an object representation of the control that should be rendered
	 */
	DatePickerRenderer.writeInnerContent = function(oRm, oDP) {

		if (oDP.getEnabled() && oDP.getEditable()) {
			var aClasses = ["sapMInputValHelpInner"];
			var mAttributes = {};

			mAttributes["id"] = oDP.getId() + "-icon";
			mAttributes["tabindex"] = "-1"; // to get focus events on it, needed for popup autoclose handling
			mAttributes["title"] = null;
			oRm.write('<div class="sapMInputValHelp">');
			oRm.writeIcon("sap-icon://appointment-2", aClasses, mAttributes);
			oRm.write("</div>");
		}

	};

	/**
	 * Write the value of the input.
	 *
	 * @param {sap.ui.core.RenderManager} oRm The RenderManager that can be used for writing to the render output buffer.
	 * @param {sap.m.DatePicker} oDP An object representation of the control that should be rendered.
	 */
	DatePickerRenderer.writeInnerValue = function(oRm, oDP) {

		oRm.writeAttributeEscaped("value", oDP._formatValue(oDP.getDateValue()));

	};

	/**
	 * This method is reserved for derived classes to add extra attributes for the input element.
	 *
	 * @param {sap.ui.core.RenderManager} oRm The RenderManager that can be used for writing to the render output buffer.
	 * @param {sap.m.DatePicker} oDP An object representation of the control that should be rendered.
	 */
	DatePickerRenderer.writeInnerAttributes = function(oRm, oDP) {

		if (oDP._bMobile) {
			// prevent keyboard in mobile devices
			oRm.writeAttribute("readonly", "readonly");
		}

	};

	DatePickerRenderer.getAriaRole = function(oDP) {

		return "combobox";

	};

	DatePickerRenderer.getDescribedByAnnouncement = function(oDP) {

		var sBaseAnnouncement = InputBaseRenderer.getDescribedByAnnouncement.apply(this, arguments);
		return sap.ui.getCore().getLibraryResourceBundle("sap.m").getText("DATEPICKER_DATE_TYPE") + " " + sBaseAnnouncement;

	};

	DatePickerRenderer.getAccessibilityState = function(oDP) {

		var mAccessibilityState = InputBaseRenderer.getAccessibilityState.apply(this, arguments);

		mAccessibilityState["multiline"] = false;
		mAccessibilityState["autocomplete"] = "none";
		mAccessibilityState["haspopup"] = true;
		mAccessibilityState["owns"] = oDP.getId() + "-cal";

		if (oDP._bMobile && oDP.getEnabled() && oDP.getEditable()) {
			// if on mobile device readonly property is set, but should not be announced
			mAccessibilityState["readonly"] = false;
		}

		return mAccessibilityState;

	};

	return DatePickerRenderer;

}, /* bExport= */ true);
