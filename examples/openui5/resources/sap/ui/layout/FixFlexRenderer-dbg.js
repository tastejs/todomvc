/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(['jquery.sap.global'],
	function (jQuery) {
		"use strict";

		/**
		 * FixFlex renderer
		 * @namespace
		 */
		var FixFlexRenderer = {};

		/**
		 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
		 *
		 * @param {sap.ui.core.RenderManager} oRm the RenderManager that can be used for writing to the render output buffer
		 * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
		 */
		FixFlexRenderer.render = function (oRm, oControl) {
			// Control container
			oRm.write('<div');
			oRm.writeControlData(oControl);
			oRm.addClass('sapUiFixFlex');

			if (oControl.getMinFlexSize() !== 0) {
				oRm.addClass('sapUiFixFlexInnerScrolling');
			}

			// Setting css class for horizontal layout
			if (!oControl.getVertical()) {
				oRm.addClass('sapUiFixFlexRow');
			}

			// Setting css class for older browsers
			if (!jQuery.support.hasFlexBoxSupport) {
				oRm.addClass('sapUiFixFlex-Legacy');
			}

			oRm.writeClasses();
			oRm.write('>');

			// Defines the rendering sequence - fix/flex or flex/fix
			if (oControl.getFixFirst()) {
				this.renderFixChild(oRm, oControl);
				this.renderFlexChild(oRm, oControl);
			} else {
				this.renderFlexChild(oRm, oControl);
				this.renderFixChild(oRm, oControl);
			}

			// Close the FixFlex Control container
			oRm.write('</div>');
		};

		/**
		 * Render the controls in the flex container
		 *
		 * @param {sap.ui.core.RenderManager} oRm the RenderManager that can be used for writing to the render output buffer
		 * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
		 */
		FixFlexRenderer.renderFixChild = function (oRm, oControl) {
			var aFixContent = oControl.getFixContent();

			oRm.write('<div id="' + oControl.getId() + '-Fixed" class="sapUiFixFlexFixed"');

			// Set specific height/width to the element depending of the orientation of the layout
			if (oControl.getFixContentSize() !== 'auto') {
				if (oControl.getVertical()) {
					oRm.addStyle('height', oControl.getFixContentSize());
				} else {
					oRm.addStyle('width', oControl.getFixContentSize());
				}
				oRm.writeStyles();
			}

			oRm.write('>');

			// Render the children
			for (var i = 0; i < aFixContent.length; i++) {
				oRm.renderControl(aFixContent[i]);
			}

			oRm.write('</div>');
		};

		/**
		 * Render the controls in the fix container
		 *
		 * @param {sap.ui.core.RenderManager} oRm the RenderManager that can be used for writing to the render output buffer
		 * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
		 */
		FixFlexRenderer.renderFlexChild = function (oRm, oControl) {
			var oFlexContent = oControl.getFlexContent();

			oRm.write('<div id="' + oControl.getId() + '-Flexible" class="sapUiFixFlexFlexible">');
			oRm.write('<div id="' + oControl.getId() + '-FlexibleContainer" class="sapUiFixFlexFlexibleContainer"');
			if (oControl.getMinFlexSize() !== 0) {
				if (oControl.getVertical()) {
					oRm.write('style="min-height:' + oControl.getMinFlexSize() + 'px"');
				} else {
					oRm.write('style="min-width:' + oControl.getMinFlexSize() + 'px"');
				}
			}
			oRm.write('>');

			// Render the child
			oRm.renderControl(oFlexContent);

			oRm.write('</div>');
			oRm.write('</div>');
		};

		return FixFlexRenderer;

	}, /* bExport= */ true);
