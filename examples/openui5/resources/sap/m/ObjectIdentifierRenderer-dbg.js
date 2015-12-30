/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(['jquery.sap.global'],
	function(jQuery) {
	"use strict";


	/**
	 * ObjectIdentifier renderer.
	 * @namespace
	 */
	var ObjectIdentifierRenderer = {};

	/**
	 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager}
	 *            oRm The RenderManager that can be used for writing to the render
	 *            output buffer
	 * @param {sap.ui.core.Control}
	 *            oOI An object representation of the control that should be
	 *            rendered
	 */
	ObjectIdentifierRenderer.render = function(oRm, oOI) {

		var sTooltip;

		// Return immediately if control is invisible
		if (!oOI.getVisible()) {
			return;
		}

		// write the HTML into the render manager
		oRm.write("<div"); // Identifier begins
		oRm.writeControlData(oOI);
		//WAI ARIA support
		oRm.writeAccessibilityState(oOI);
		oRm.addClass("sapMObjectIdentifier");
		oRm.writeClasses();

		sTooltip = oOI.getTooltip_AsString();
		if (sTooltip) {
			oRm.writeAttributeEscaped("title", sTooltip);
		}

		oRm.write(">");

		oRm.write("<div"); // Top row begins
		oRm.addClass("sapMObjectIdentifierTopRow");
		oRm.writeClasses();
		oRm.write(">");

		oRm.write("<div"); // Icons begin
		oRm.addClass("sapMObjectIdentifierIcons");
		oRm.writeClasses();

		oRm.write(">");

		if (oOI.getBadgeAttachments()) {
			oRm.write("<span"); // Icon span begins
			oRm.addClass("sapMObjectIdentifierIconSpan");
			oRm.writeClasses();
			oRm.write(">");
			oRm.renderControl(oOI._getAttachmentsIcon());
			oRm.write("</span>"); // Icon span ends
		}
		if (oOI.getBadgeNotes()) {
			oRm.write("<span"); // Icon span begins
			oRm.addClass("sapMObjectIdentifierIconSpan");
			oRm.writeClasses();
			oRm.write(">");
			oRm.renderControl(oOI._getNotesIcon());
			oRm.write("</span>"); // Icon span ends
		}
		if (oOI.getBadgePeople()) {
			oRm.write("<span"); // Icon span begins
			oRm.addClass("sapMObjectIdentifierIconSpan");
			oRm.writeClasses();
			oRm.write(">");
			oRm.renderControl(oOI._getPeopleIcon());
			oRm.write("</span>"); // Icon span ends
		}

		oRm.write("</div>"); // Icons end

		oRm.write("<div id='" + oOI.getId() + "-title'"); // Title begins
		oRm.addClass("sapMObjectIdentifierTitle");

		oRm.writeClasses();
		oRm.write(">");
		oRm.renderControl(oOI._getTitleControl());
		//Render WAI ARIA hidden label for title if it's active
		if (oOI.getProperty("titleActive")) {
			oRm.renderControl(oOI._oAriaInfoTextControl);
		}
		oRm.write("</div>"); // Title ends

		oRm.write("</div>"); // Top row ends

		oRm.write("<div id='" + oOI.getId() + "-text'"); // Text begins
		oRm.addClass("sapMObjectIdentifierText");

		if (!!oOI.getProperty("text") && !!oOI.getProperty("title")) {
			oRm.addClass("sapMObjectIdentifierTextBellow");
		}
		oRm.writeClasses();
		oRm.write(">");
		oRm.renderControl(oOI._getTextControl());
		oRm.write("</div>"); // Text ends

		oRm.write("</div>"); // Identifier ends
	};


	return ObjectIdentifierRenderer;

}, /* bExport= */ true);
