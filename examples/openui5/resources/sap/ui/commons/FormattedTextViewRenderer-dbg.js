/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global'],
	function (jQuery) {
		"use strict";


		/**
		 * FormattedTextView renderer.
		 * @namespace
		 */
		var FormattedTextViewRenderer = {};

		/**
		 * Renders the HTML for the FormattedTextView, using the provided
		 * {@link sap.ui.core.RenderManager}.
		 *
		 * @param {sap.ui.core.RenderManager} oRm The RenderManager that can be used for
		 * writing to the render output buffer
                 * @param {sap.ui.core.Control} oControl An object representation of the control that should be rendered
		 */
		FormattedTextViewRenderer.render = function (oRm, oControl) {
			// pattern for placeholders:
			var rPlaceHolderPattern = /<embed\s+data-index="([0-9]+)"\s*\/?>/gim;
			var sHtml = oControl.getHtmlText();

			// clone, will be modified below
			var aInnerControls = oControl.getControls().slice();

			var iToBeRendered = aInnerControls.length;
			var lastIndex = 0;
			var aMatch = [];

			// write the HTML into the render manager
			oRm.write("<span");
			oRm.writeControlData(oControl);
			oRm.addClass("sapUiFTV");
			oRm.writeClasses();

			// render Tooltip
			if (oControl.getTooltip_AsString()) {
				oRm.writeAttributeEscaped("title", oControl.getTooltip_AsString());
			}
			oRm.write(">"); // span element

			// check for placeholders in htmlText property
			while ((aMatch = rPlaceHolderPattern.exec(sHtml)) !== null) {
				// write any static HTML between previous and current placeholder (if
				// any)
				oRm.write(sHtml.slice(lastIndex, aMatch.index));
				// replace placeholder with control in aggregation
				if (this._renderReplacement(oRm, aMatch[1], aInnerControls)) {
					iToBeRendered--;
				} else {
					jQuery.sap.log.warning("Could not find matching control to placeholder #" + aMatch[1]);
				}
				lastIndex = rPlaceHolderPattern.lastIndex;
			}
			// render the remainder of the HTML
			oRm.write(sHtml.slice(lastIndex, sHtml.length));

			if (iToBeRendered > 0) {
				jQuery.sap.log.warning('There are leftover controls in the aggregation that have not been used in the formatted text', oControl);
			}

			oRm.write("</span>");

		};

		/* */
		/**
		 * Used for a placeholder replacement.
		 * @param {sap.ui.core.RenderManager} rm The render manager
		 * @param {number} controlsIndex
		 * @param {array} aControls
		 * @returns {boolean} Indicates whether the replacement was successful
		 * @private
		 */
		FormattedTextViewRenderer._renderReplacement = function (rm, controlsIndex, aControls) {
			if (aControls[controlsIndex]) {
				rm.renderControl(aControls[controlsIndex]);
				// UI5 controls must not be rendered twice!
				aControls[controlsIndex] = null;
				return true;
			} else {
				return false;
			}
		};

		return FormattedTextViewRenderer;

	}, /* bExport= */ true);
