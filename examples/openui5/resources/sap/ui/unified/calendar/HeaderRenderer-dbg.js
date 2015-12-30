/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(['jquery.sap.global'],
	function(jQuery) {
	"use strict";


	/**
	 * Header renderer.
	 * @namespace
	 */
	var HeaderRenderer = {
	};

	/**
	 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} oRm the RenderManager that can be used for writing to the render output buffer
	 * @param {sap.ui.unified.calendar.Header} oHead an object representation of the control that should be rendered
	 */
	HeaderRenderer.render = function(oRm, oHead){

		var sTooltip = oHead.getTooltip_AsString();
		var sId = oHead.getId();
		var mAccProps = {};

		oRm.write("<div");
		oRm.writeControlData(oHead);
		oRm.addClass("sapUiCalHead");
		oRm.writeClasses();

		if (sTooltip) {
			oRm.writeAttributeEscaped('title', sTooltip);
		}

		oRm.writeAccessibilityState(oHead);

		oRm.write(">"); // div element

		oRm.write("<button");
		oRm.writeAttributeEscaped('id', sId + '-prev');
		oRm.addClass("sapUiCalHeadPrev");
		if (!oHead.getEnabledPrevious()) {
			oRm.addClass("sapUiCalDsbl");
			oRm.writeAttribute('disabled', "disabled");
		}
		oRm.writeAttribute('tabindex', "-1");
		oRm.writeClasses();
		oRm.write(">"); // button element
		oRm.writeIcon("sap-icon://slim-arrow-left", null, { title: null });
		oRm.write("</button>");

		var iFirst = -1;
		var iLast = -1;
		var i = 0;
		for (i = 0; i < 3; i++) {
			if (oHead["getVisibleButton" + i]()) {
				if (iFirst < 0) {
					iFirst = i;
				}
				iLast = i;
			}
		}

		for (i = 0; i < 3; i++) {
			if (oHead["getVisibleButton" + i]()) {
				oRm.write("<button");
				oRm.writeAttributeEscaped('id', sId + '-B' + i);
				oRm.addClass("sapUiCalHeadB");
				oRm.addClass("sapUiCalHeadB" + i);
				if (iFirst == i) {
					oRm.addClass("sapUiCalHeadBFirst");
				}
				if (iLast == i) {
					oRm.addClass("sapUiCalHeadBLast");
				}
				oRm.writeAttribute('tabindex', "-1");
				oRm.writeClasses();
				if (oHead["getAriaLabelButton" + i]()) {
					mAccProps["label"] = jQuery.sap.encodeHTML(oHead["getAriaLabelButton" + i]());
				}
				oRm.writeAccessibilityState(null, mAccProps);
				mAccProps = {};
				oRm.write(">"); // button element
				oRm.writeEscaped(oHead["getTextButton" + i]() || "");
				oRm.write("</button>");
			}
		}

		oRm.write("<button");
		oRm.writeAttributeEscaped('id', sId + '-next');
		oRm.addClass("sapUiCalHeadNext");
		if (!oHead.getEnabledNext()) {
			oRm.addClass("sapUiCalDsbl");
			oRm.writeAttribute('disabled', "disabled");
		}
		oRm.writeAttribute('tabindex', "-1");
		oRm.writeClasses();
		oRm.write(">"); // button element
		oRm.writeIcon("sap-icon://slim-arrow-right", null, { title: null });
		oRm.write("</button>");

		oRm.write("</div>");

	};

	return HeaderRenderer;

}, /* bExport= */ true);
