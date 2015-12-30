/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(['jquery.sap.global', './FlexBoxStylingHelper'],
	function(jQuery, FlexBoxStylingHelper) {
	"use strict";


	/**
	 * FlexBox renderer
	 * @namespace
	 */
	var FlexBoxRenderer = {};


	/**
	 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} oRm the RenderManager that can be used for writing to the render output buffer
	 * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
	 */
	FlexBoxRenderer.render = function(oRm, oControl) {
		if (!jQuery.support.flexBoxLayout && !jQuery.support.newFlexBoxLayout && !jQuery.support.ie10FlexBoxLayout) {
			jQuery.sap.log.warning("This browser does not support Flexible Box Layouts natively.");
			FlexBoxRenderer.usePolyfill = true;
		}

		// Make sure HBox and VBox don't get the wrong direction and get the appropriate class
		var hvClass = "";
		if (oControl.getDirection() === "Row" || oControl.getDirection() === "RowReverse") {
			if (oControl instanceof sap.m.VBox) {
				jQuery.sap.log.error("Flex direction cannot be set to Row or RowReverse on VBox controls.");
			} else {
				hvClass = "sapMHBox";
			}
		} else if (oControl.getDirection() === "Column" || oControl.getDirection() === "ColumnReverse") {
			if (oControl instanceof sap.m.HBox) {
				jQuery.sap.log.error("Flex direction cannot be set to Column or ColumnReverse on HBox controls.");
			} else {
				hvClass = "sapMVBox";
			}
		}

		// Special treatment if FlexBox is itself an item of a parent FlexBox
		var oParent = oControl.getParent();
		if (oControl.getParent() instanceof sap.m.FlexBox) {
			oRm.addClass("sapMFlexItem");


			// Set layout properties
			var oLayoutData = oControl.getLayoutData();
			if (oLayoutData instanceof sap.m.FlexItemData && !FlexBoxRenderer.usePolyfill) {
				FlexBoxStylingHelper.setFlexItemStyles(oRm, oLayoutData);
			}

			if (oParent.getRenderType() === 'List') {
				oRm.write('<li');
				oRm.writeClasses();
				oRm.writeStyles();
			}
		}

		if (oControl.getRenderType() === 'List') {
			oRm.write('<ul');
		} else {
			oRm.write('<div');
		}

		oRm.writeControlData(oControl);
		oRm.addClass("sapMFlexBox");
		oRm.addClass(hvClass);
		oRm.writeClasses();
		if (oControl.getWidth()) {
			oRm.addStyle("width", oControl.getWidth());
		}
		if (oControl.getHeight()) {
			oRm.addStyle("height", oControl.getHeight());
		}
		if (!FlexBoxRenderer.usePolyfill) {
			FlexBoxStylingHelper.setFlexBoxStyles(oRm, oControl);
		}
		oRm.writeStyles();
		var sTooltip = oControl.getTooltip_AsString();
		if (sTooltip) {
			oRm.writeAttributeEscaped("title", sTooltip);
		}
		oRm.write(">");

		// Now render the flex items
		FlexBoxRenderer.renderItems(oControl, oRm);

		// Close the flexbox
		if (oControl.getRenderType() === "List") {
			oRm.write("</ul>");
		} else {
			oRm.write("</div>");
		}
	};

	FlexBoxRenderer.renderItems = function(oControl, oRm) {
		var aChildren = oControl.getItems(),
			sWrapperTag = '';

		for (var i = 0; i < aChildren.length; i++) {
			// Don't wrap if it's a FlexBox control
			if (aChildren[i] instanceof sap.m.FlexBox) {
				sWrapperTag = '';
			} else if (oControl.getRenderType() === 'List') {
				sWrapperTag = 'li';
			} else {
				sWrapperTag = 'div';
			}

			FlexBoxRenderer.renderItem(aChildren[i], sWrapperTag, oRm);
		}
	};

	FlexBoxRenderer.renderItem = function(oItem, sWrapperTag, oRm) {
		if (sWrapperTag) {
			// Open wrapper
			oRm.write('<' + sWrapperTag);

			// Set layout properties
			var oLayoutData = oItem.getLayoutData();
			if (oLayoutData instanceof sap.m.FlexItemData) {
				if (oLayoutData.getId()) {
					oRm.write(" id='" + oLayoutData.getId() + "'");
				}
				if (oLayoutData.getStyleClass()) {
					oRm.addClass(jQuery.sap.encodeHTML(oLayoutData.getStyleClass()));
				}

				if (!FlexBoxRenderer.usePolyfill) {
					FlexBoxStylingHelper.setFlexItemStyles(oRm, oLayoutData);
				}

				// ScrollContainer needs height:100% on the flex item
				if (oItem instanceof sap.m.ScrollContainer) {
					oRm.addStyle("height", "100%");
				}
				if (!oItem.getVisible()) {
					oRm.addClass("sapUiHiddenPlaceholder");
				}
				oRm.writeStyles();
			}

			oRm.addClass("sapMFlexItem");
			oRm.writeClasses();
			oRm.write(">");

		}

		// Render control
		oRm.renderControl(oItem);

		if (sWrapperTag) {
			// Close wrapper
			oRm.write('</' + sWrapperTag + '>');
		}
	};

	return FlexBoxRenderer;

}, /* bExport= */ true);
