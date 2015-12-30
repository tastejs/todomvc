/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides default renderer for control sap.ui.commons.ValueHelpField
sap.ui.define(['jquery.sap.global', './TextFieldRenderer'],
	function(jQuery, TextFieldRenderer) {
	"use strict";


	/**
	 * ValueHelpField renderer.
	 * For a common look&feel, the ValueHelpField extends the TextField control,
	 * just like the ComboBox does.
	 * @namespace
	 */
	var ValueHelpFieldRenderer = sap.ui.core.Renderer.extend(TextFieldRenderer);

	/**
	 * Hint: "renderOuterAttributes" is a reserved/hard-coded TextField extending function!
	 *       It is used to allow extensions to display help icons.
	 * @param {sap.ui.core.RenderManager}
	 *            rm the RenderManager currently rendering this control
	 * @param {sap.ui.commons.ValueHelpField}
	 *            oControl the ValueHelpField whose "value help" should be rendered
	 * @private
	 */
	ValueHelpFieldRenderer.renderOuterAttributes = function(rm, oControl) {
		// To share the overall ComboBox styling:
		// Note: Would be best if a more generic className had been used for this, like
		//       "sapUiTfIconContainer", as ComboBox and DatePicker and ValueHelpField are likely
		//       to always share a common container look. (Only icon should differ.)
		//       Then, in the unlikely case where one of them would want to differ from the
		//       others, then this one would only need to add its own className on top of
		//       the generic one, e.g. "sapUiTfDateContainer" for the DatePicker.
		// Referencing "sapUiTfCombo" for now.
		rm.addClass("sapUiTfCombo");
	//as only input field gets focus, render aria info there
		rm.writeAttribute("aria-owns", oControl.getId() + '-input ' + oControl.getId() + '-icon');
	};

	/**
	 * Renders additional HTML for the ComboBox to the TextField (sets the icon)
	 *
	 * @param {sap.ui.fw.RenderManager} oRenderManager The RenderManager that can be used for
	 *                                                 writing to the Render-Output-Buffer.
	 * @param {sap.ui.fw.Control} oControl An object representation of the control that should
	 *                                     be rendered.
	 */
	ValueHelpFieldRenderer.renderOuterContent = function(rm, oControl){

		var sIconUrl = oControl.getIconURL();
		var aClasses = [];
		var mAttributes = {};
		mAttributes["id"] = oControl.getId() + "-icon";
		mAttributes["role"] = "button";

		// As mentioned above, a more generic "sapUiTfIcon" className could have been used...
		// One would just have had to add its own icon className!
		// Using "sapUiTfValueHelpIcon" for now, as it proved easier to define instead of overwriting
		// the ComboBox image sources and backgrounds.
		aClasses.push("sapUiTfValueHelpIcon");

		if (sIconUrl && sap.ui.core.IconPool.isIconURI(sIconUrl)) {
			oControl.bIsIconURI = true;
			mAttributes.title = oControl.getTooltip_AsString();
		} else {
			oControl.bIsIconURI = false;
			if (oControl.getEnabled() && oControl.getEditable()) {
				aClasses.push("sapUiTfValueHelpRegularIcon");
			}

			sIconUrl = this.renderIcon(rm, oControl, aClasses);
		}

		rm.writeIcon(sIconUrl, aClasses, mAttributes);

	};

		/**
	 * as onBeforeRendering only runs while re-rendering this module is called in renderer
	 */
	ValueHelpFieldRenderer.renderIcon = function(rm, oControl, aClasses){

		var sIcon = "";

		if (!oControl.getEnabled()) {
			if (oControl.getIconDisabledURL()) {
				oControl.sIconDsblUrl = oControl.getIconDisabledURL();
			} else if (oControl.getIconURL()) {
				oControl.sIconDsblUrl = oControl.getIconURL();
				aClasses.push('sapUiTfValueHelpDsblIcon');
			}
			sIcon = oControl.sIconDsblUrl;
		} else {
			if (oControl.getIconURL()) {
				oControl.sIconRegularUrl = oControl.getIconURL();
			}
			sIcon = oControl.sIconRegularUrl;
		}
		return sIcon;

	};

		///**
	// * Renders ARIA information for the outer DIV
	// *
	// * @param {sap.ui.fw.RenderManager} oRenderManager the RenderManager that can be used for
	// *                                                 writing to the Render-Output-Buffer
	// * @param {sap.ui.fw.Control} oControl an object representation of the control that should
	// *                                     be rendered
	// */
	//sap.ui.commons.ValueHelpFieldRenderer.renderARIAInfo = function(rm, oControl) {
	//	if ( sap.ui.getCore().getConfiguration().getAccessibility()){
	//	// Widgets are discrete user interface objects with which the user can interact.
	//	// Widget roles map to standard features in accessibility APIs.
	//	// When a user navigates an element assigned any of the non-abstract subclass roles of widget,
	//	// assistive technologies that typically intercept standard keyboard events SHOULD switch to
	//	// an application browsing mode, and pass keyboard events through to the web application.
	//	// The intent is to hint to certain assistive technologies to switch from normal browsing mode
	//	// into a mode more appropriate for interacting with a web application; some user agents have
	//	// a browse navigation mode where keys, such as up and down arrows, are used to browse the
	//	// document, and this native behavior prevents the use of these keys by a web application.
	//		rm.writeAttribute('role', 'widget');
	//		rm.writeAttribute('aria-haspopup', 'true');
	//		// IMPORTANT: According to jQuery forums, DatePicker Accessibility is to be delivered in a
	//		//            future release. No release mentionned.
	//		// So there is not much point about doing more about this at the moment.
	//	}
	//};

	return ValueHelpFieldRenderer;

}, /* bExport= */ true);
