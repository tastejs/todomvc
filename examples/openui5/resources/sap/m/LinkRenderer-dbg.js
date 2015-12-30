/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

 sap.ui.define(['jquery.sap.global', 'sap/ui/core/Renderer'],
	function(jQuery, Renderer) {
	"use strict";


	/**
	 * Link renderer
	 * @namespace
	 */
	var LinkRenderer = {
	};


	/**
	 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} oRm the RenderManager that can be used for writing to the render output buffer
	 * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
	 */
	LinkRenderer.render = function(rm, oControl) {
		var sTextDir = oControl.getTextDirection();
		var sTextAlign = Renderer.getTextAlign(oControl.getTextAlign(), sTextDir);

		// Link is rendered as a "<a>" element
		rm.write("<a");
		rm.writeControlData(oControl);

		// ARIA attributes
		rm.writeAccessibilityState(oControl, {
			role: 'link',
			haspopup: !oControl.getHref()
		});

		rm.addClass("sapMLnk");
		if (oControl.getSubtle()) {
			rm.addClass("sapMLnkSubtle");
		}

		if (oControl.getEmphasized()) {
			rm.addClass("sapMLnkEmphasized");
		}

		if (!oControl.getEnabled()) {
			rm.addClass("sapMLnkDsbl");
			rm.writeAttribute("disabled", "true");
			rm.writeAttribute("tabIndex", "-1"); // still focusable by mouse click, but not in the tab chain
		} else {
			rm.writeAttribute("tabIndex", "0");
		}
		if (oControl.getWrapping()) {
			rm.addClass("sapMLnkWrapping");
		}

		if (oControl.getTooltip_AsString()) {
			rm.writeAttributeEscaped("title", oControl.getTooltip_AsString());
		}

		/* set href only if link is enabled - BCP incident 1570020625 */
		if (oControl.getHref() && oControl.getEnabled()) {
			rm.writeAttributeEscaped("href", oControl.getHref());
		} else {
			/*eslint-disable no-script-url */
			rm.writeAttribute("href", "javascript:void(0);");
			/*eslint-enable no-script-url */
		}

		if (oControl.getTarget()) {
			rm.writeAttributeEscaped("target", oControl.getTarget());
		}

		if (oControl.getWidth()) {
			rm.addStyle("width", oControl.getWidth());
		} else {
			rm.addClass("sapMLnkMaxWidth");
		}

		if (sTextAlign) {
			rm.addStyle("text-align", sTextAlign);
		}

		// check if textDirection property is not set to default "Inherit" and add "dir" attribute
		if (sTextDir !== sap.ui.core.TextDirection.Inherit) {
			rm.writeAttribute("dir", sTextDir.toLowerCase());
		}

		rm.writeClasses();
		rm.writeStyles();
		rm.write(">"); // opening <a> tag

		if (oControl.getText()) {
			rm.writeEscaped(oControl.getText());
		}

		// ARIA write hidden element for emphasized or subtle link
		if (oControl.getEmphasized()) {
			rm.write("<label id='" + oControl.getId() + "-linkEmphasized" + "' class='sapUiHidden'>" + oControl._getLinkDescription("LINK_EMPHASIZED") + "</label>");
		}
		if (oControl.getSubtle()) {
			rm.write("<label id='" + oControl.getId() + "-linkSubtle" + "' class='sapUiHidden'>" + oControl._getLinkDescription("LINK_SUBTLE") + "</label>");
		}

		rm.write("</a>");
	};


	return LinkRenderer;

 }, /* bExport= */ true);
