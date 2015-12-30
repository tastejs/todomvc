/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides default renderer for control sap.ui.commons.RadioButtonGroup
sap.ui.define(['jquery.sap.global'],
	function(jQuery) {
	"use strict";


	/**
	 * RadioButtonGroup renderer.
	 * @namespace
	 */
	var RadioButtonGroupRenderer = {
	};
	
	
	/**
	 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} oRenderManager the RenderManager that can be used for writing to the Render-Output-Buffer
	 * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
	 */
	RadioButtonGroupRenderer.render = function(oRenderManager, oRBGroup){
		// convenience variable
		var rm = oRenderManager;
	
		// Return immediately if control has no RadioButtons
		if (!oRBGroup.aRBs) {
			return;
		}
	
		var iColumns = oRBGroup.getColumns();
		var bEnabled = oRBGroup.getEnabled();
	
		if (bEnabled) {
			// check if at least one item is enabled
			var aItems = oRBGroup.getItems();
			bEnabled = false;
			for ( var i = 0; i < aItems.length; i++) {
				if (aItems[i].getEnabled()) {
					bEnabled = true;
					break;
				}
			}
		}
	
		rm.write("<DIV");
		rm.writeControlData(oRBGroup);
		rm.addClass("sapUiRbG");
		if (iColumns > 1) {
			if (iColumns == oRBGroup.aRBs.length) {
				rm.addClass("sapUiRbG1Row");
			} else {
				rm.addClass("sapUiRbGTab");
				if (oRBGroup.getWidth() && oRBGroup.getWidth() != '') {
					rm.addClass("sapUiRbGTabFlex");
					// as in Firefox -moz-box-flex > 0 brings ellipsis even if no width is given
					// therefore flexible columns should be only used if a width is given.
				}
			}
		}
	
		if (oRBGroup.getWidth() && oRBGroup.getWidth() != '') {
			rm.addStyle("width", oRBGroup.getWidth());
		}
	
		if (oRBGroup.getTooltip_AsString()) {
			rm.writeAttributeEscaped("title", oRBGroup.getTooltip_AsString());
		}
	
		if (bEnabled) {
			rm.writeAttribute('tabindex', '0');
		} else {
			rm.writeAttribute('tabindex', '-1');
		}
	
		// ARIA
		rm.writeAccessibilityState(oRBGroup, {
			role: "radiogroup",
			invalid: oRBGroup.getValueState() == sap.ui.core.ValueState.Error,
			disabled: !oRBGroup.getEditable()
		});
	
		rm.writeClasses();
		rm.writeStyles();
		rm.write(">"); // DIV
	
		// columns
		for (var c = 0; c < iColumns; c++) {
			if (iColumns > 1 && iColumns != oRBGroup.aRBs.length) {
				// if only 1 column -> no DIV necessary
				rm.write("<DIV");
				rm.addClass("sapUiRbGCol");
				rm.writeClasses();
				rm.write(">"); // DIV element
			}
	
			// render RadioButtons
			for (var i = c; i < oRBGroup.aRBs.length; i = i + iColumns) {
				rm.renderControl(oRBGroup.aRBs[i]);
			}
	
			if (iColumns > 1 && iColumns != oRBGroup.aRBs.length) {
				rm.write("</DIV>");
			}
		}
	
		if (iColumns > 1 && iColumns != oRBGroup.aRBs.length) {
			// dummy Column to avoid big spaces between RadioButtons in Safari
			rm.write('<DIV class="sapUiRbGDummy"> </DIV>');
		}
	
		rm.write("</DIV>");
	};

	return RadioButtonGroupRenderer;

}, /* bExport= */ true);
