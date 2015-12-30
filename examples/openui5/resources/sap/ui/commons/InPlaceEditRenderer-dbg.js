/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(['jquery.sap.global'],
	function(jQuery) {
	"use strict";


	/**
	 * InPlaceEdit renderer.
	 * @namespace
	 */
	var InPlaceEditRenderer = {
	};

	/**
	 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
	 * 
	 * @param {sap.ui.core.RenderManager} rm the RenderManager that can be used for writing to the Render-Output-Buffer
	 * @param {sap.ui.core.Control} oInPlaceEdit an object representation of the control that should be rendered
	 */
	InPlaceEditRenderer.render = function(rm, oInPlaceEdit){

		var oContent = oInPlaceEdit.getContent();
		var sWidth;

		if (oContent) {
			if (oContent.getWidth) {
				sWidth = oContent.getWidth();
			}
			if (oContent.getVisible && !oContent.getVisible()) {
				// invisible -> render nothing
				jQuery.sap.log.warning("Content is not visivle - nothing is rendered", this);
				return;
			}
		} else {
			// no content -> render nothing
			jQuery.sap.log.warning("No content provided - nothing is rendered", this);
			return;
		}

		// write the HTML into the render manager
		rm.write("<DIV");
		rm.writeControlData(oInPlaceEdit);
		rm.addClass("sapUiIpe");

		if (!oInPlaceEdit.getEditable()) {
			rm.addClass("sapUiIpeRo");
		} else if (!oInPlaceEdit._bEditMode) {
			// display mode
			rm.writeAttribute("tabindex", "-1"); //to have focus event on clicking on this DIV (ComboBox expander in display mode)
			if (!oInPlaceEdit._sOldTextAvailable) {
				if (oContent.getMetadata().getName() == "sap.ui.commons.ComboBox" || oContent.getMetadata().getName() == "sap.ui.commons.DropdownBox") {
					rm.addClass("sapUiIpeCombo");
				}
			}
			if (oContent.getMetadata().getName() == "sap.ui.commons.Link") {
				rm.addClass("sapUiIpeLink");
			}
		} else {
			// edit mode
			rm.addClass("sapUiIpeEdit");
		}

		if (sWidth) {
			rm.addStyle("width", sWidth);
		}

		if (oInPlaceEdit.getUndoEnabled() && oInPlaceEdit._sOldTextAvailable && ( !oInPlaceEdit._bEditMode || ( oInPlaceEdit._bEditMode && oInPlaceEdit._oEditControl.getValue() != oInPlaceEdit._sOldText))) {
			// there is an old text available - visualize Undo
			rm.addClass("sapUiIpeUndo");
		}

		switch (oInPlaceEdit.getValueState()) {
		case sap.ui.core.ValueState.Error:
			rm.addClass('sapUiIpeErr');
		break;
		case sap.ui.core.ValueState.Success:
			rm.addClass('sapUiIpeSucc');
		break;
		case sap.ui.core.ValueState.Warning:
			rm.addClass('sapUiIpeWarn');
		break;
		default:
		break;
		}

		var tooltip = sap.ui.core.ValueStateSupport.enrichTooltip(oInPlaceEdit, oInPlaceEdit.getTooltip_AsString());
		if (tooltip) {
			rm.writeAttributeEscaped('title', tooltip);
		}

		rm.writeClasses();
		rm.writeStyles();
		rm.write(">"); // DIV
		if (oInPlaceEdit._sOldTextAvailable || oContent.getMetadata().getName() == "sap.ui.commons.Link") {
			// there is an old text available - put content in a extra DIV to position
			// for Link do it always to have the edit button next to the link, but have the defined width for the outer DIV
			rm.write("<DIV");
			rm.addClass("sapUiIpeCont");
			if (oContent.getMetadata().getName() == "sap.ui.commons.ComboBox" || oContent.getMetadata().getName() == "sap.ui.commons.DropdownBox") {
				rm.addClass("sapUiIpeCombo");
			}
			rm.writeClasses();
			rm.write(">"); // DIV

		}
		if (oInPlaceEdit._bEditMode) {
			this.renderEditContent(rm, oInPlaceEdit);
		} else {
			this.renderDisplayContent(rm, oInPlaceEdit);
		}
		if (oInPlaceEdit._sOldTextAvailable || oContent.getMetadata().getName() == "sap.ui.commons.Link") {
			rm.write("</DIV>");
			if (oInPlaceEdit.getUndoEnabled() && oInPlaceEdit._sOldTextAvailable) {
				// there is an old text available and undo enabled - render undo button
				rm.renderControl(oInPlaceEdit._oUndoButton);
			}
		}
		rm.write("</DIV>");
	};

	InPlaceEditRenderer.renderDisplayContent = function(rm, oInPlaceEdit){

		if (oInPlaceEdit._oDisplayControl) {
			rm.renderControl(oInPlaceEdit._oDisplayControl);
			if (oInPlaceEdit.getEditable() && oInPlaceEdit._oDisplayControl.getMetadata().getName() == "sap.ui.commons.Link") {
				rm.renderControl(oInPlaceEdit._oEditButton);
			}
		}

	};

	InPlaceEditRenderer.renderEditContent = function(rm, oInPlaceEdit){

		if (oInPlaceEdit._oEditControl) {
			rm.renderControl(oInPlaceEdit._oEditControl);
		}

	};

	return InPlaceEditRenderer;

}, /* bExport= */ true);
