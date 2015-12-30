/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(['jquery.sap.global'],
	function(jQuery) {
	"use strict";


	/**
	 * Form renderer.
	 * @namespace
	 */
	var FormRenderer = {
	};

	/**
	 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
	 * 
	 * @param {sap.ui.core.RenderManager} oRenderManager the RenderManager that can be used for writing to the Render-Output-Buffer
	 * @param {sap.ui.core.Control} oForm an object representation of the control that should be rendered
	 */
	FormRenderer.render = function(oRenderManager, oForm){
		// convenience variable
		var rm = oRenderManager;
		var oLayout = oForm.getLayout();

		// write only a DIV for the form and let the layout render the rest
		rm.write("<div");
		rm.writeControlData(oForm);
		rm.addClass("sapUiForm");
		rm.writeAttribute("data-sap-ui-customfastnavgroup", "true");

		var sClass = sap.ui.layout.form.FormHelper.addFormClass();
		if (sClass) {
			rm.addClass(sClass);
		}

		if (oForm.getEditable()) {
			rm.addClass("sapUiFormEdit");
			rm.addClass("sapUiFormEdit-CTX");
		}

		if (oForm.getWidth()) {
			rm.addStyle("width", oForm.getWidth());
		}
		if (oForm.getTooltip_AsString()) {
			rm.writeAttributeEscaped('title', oForm.getTooltip_AsString());
		}
		rm.writeClasses();
		rm.writeStyles();

		var mAriaProps = {role: "form"};
		var oTitle = oForm.getTitle();
		if (oTitle) {
			var sId = "";
			if (typeof oTitle == "string") {
				sId = oForm.getId() + "--title";
			} else {
				sId = oTitle.getId();
			}
			mAriaProps["labelledby"] = {value: sId, append: true};
		}

		rm.writeAccessibilityState(oForm, mAriaProps);

		rm.write(">");

		if (oLayout) {
			// render the layout with the content of this form control
			rm.renderControl(oLayout);
		} else {
			jQuery.sap.log.warning("Form \"" + oForm.getId() + "\" - Layout missing!", "Renderer", "Form");
		}

		rm.write("</div>");
	};

	return FormRenderer;

}, /* bExport= */ true);
