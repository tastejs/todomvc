/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides default renderer for control sap.ui.commons.ComboBox
sap.ui.define(['jquery.sap.global', './TextFieldRenderer', 'sap/ui/core/Renderer'],
	function(jQuery, TextFieldRenderer, Renderer) {
	"use strict";


	/**
	 * Renderer for the sap.ui.commons.ComboBox
	 * @namespace
	 */
	var ComboBoxRenderer = Renderer.extend(TextFieldRenderer);

	/**
	 * Renders the attributes of the outer &lt;div&gt; for the ComboBox to the TextField
	 *
	 * @param {sap.ui.fw.RenderManager} rm the RenderManager that can be used for writing to the Render-Output-Buffer
	 * @param {sap.ui.fw.Control} oCmb an object representation of the ComboBox that should be rendered
	 */
	ComboBoxRenderer.renderOuterAttributes = function(rm, oCmb) {
		rm.addClass("sapUiTfCombo");
		this.renderComboARIAInfo(rm, oCmb);
	};

	/**
	 * Renders additional HTML for the ComboBox to the TextField before the INPUT element (sets the icon)
	 *
	 * @param {sap.ui.fw.RenderManager} rm the RenderManager that can be used for writing to the Render-Output-Buffer
	 * @param {sap.ui.fw.Control} oCmb an object representation of the ComboBox that should be rendered
	 */
	ComboBoxRenderer.renderOuterContentBefore = function(rm, oCmb){

		this.renderExpander(rm, oCmb);
		this.renderSelectBox(rm, oCmb, '-1');

	};

	ComboBoxRenderer.renderExpander = function(rm, oCmb){

		rm.write("<div");
		rm.writeAttributeEscaped('id', oCmb.getId() + '-icon');
		rm.writeAttribute('unselectable', 'on');
		if ( sap.ui.getCore().getConfiguration().getAccessibility()) {
			rm.writeAttribute("role", "presentation");
		}
		rm.addClass("sapUiTfComboIcon");
		rm.writeClasses();
		rm.write(">&#9660;</div>");//Symbol for HCB Theme (Must be hidden in other themes)

	};

	ComboBoxRenderer.renderSelectBox = function(rm, oCmb, sTabindex){

		if (oCmb.mobile) {
			// for mobile devices render SELECT box
			// it lays over the button but should be transparent. So a click on the button opens the select box
			rm.write("<select");
			rm.writeAttributeEscaped('id', oCmb.getId() + '-select');
			rm.writeAttribute('tabindex', sTabindex);
			if (!oCmb.getEnabled() || !oCmb.getEditable()) {
				rm.writeAttribute('disabled', 'disabled');
			}
			rm.write(">");
			for ( var i = 0; i < oCmb.getItems().length; i++) {
				var oItem = oCmb.getItems()[i];
				rm.write("<option");
				// combine comboBox ID with Item ID because items can be in more than one ComboBox vi the same List
				rm.writeAttributeEscaped('id', oCmb.getId() + "-" + oItem.getId());
				if (!oItem.getEnabled()) {
					rm.writeAttribute("disabled", "disabled");
				}
				rm.write(">");
				rm.writeEscaped(oItem.getText());
				rm.write("</option>");
			}
			rm.write("</select>");
		}

	};

	ComboBoxRenderer.renderOuterContent = function(rm, oCmb){

		if (oCmb.getDisplaySecondaryValues()) {
			rm.write("<span id=\"" + oCmb.getId() + "-SecVal\" style=\"display: none;\"></span>");
		}

	};

	/**
	 * Renders the inner &lt;div&gt; for the ComboBox to the TextField
	 *
	 * @param {sap.ui.fw.RenderManager} rm the RenderManager that can be used for writing to the Render-Output-Buffer
	 * @param {sap.ui.fw.Control} oCmb an object representation of the ComboBox that should be rendered
	 */
	ComboBoxRenderer.renderInnerAttributes = function(rm, oCmb) {

		if (oCmb.mobile) {
			rm.writeAttribute('autocapitalize', 'off');
			rm.writeAttribute('autocorrect', 'off');
		}

	};

	/*
	 * Renders ARIA information for the combobox (outer &lt;div&gt;)
	 * @param {sap.ui.fw.RenderManager} rm the RenderManager that can be used for writing to the Render-Output-Buffer
	 * @param {sap.ui.fw.Control} oControl an object representation of the control that should be rendered
	 * @private
	 */
	ComboBoxRenderer.renderComboARIAInfo = function(rm, oCmb) {

		// to not force creation if internal ListBox do not use _getListBox()
		var sListBox = oCmb.getListBox();
		if (!sListBox && oCmb._oListBox) {
			sListBox = oCmb._oListBox.getId();
		}

		var mProps = {
				role: "combobox",
				owns: oCmb.getId() + "-input " + sListBox
		};

		if (!oCmb.getEnabled()) {
			mProps["disabled"] = true;
		}

		rm.writeAccessibilityState(null,  //null because otherwise automatic generated attributes will be rendered twice
				mProps);

	};

	/*
	 * Renders ARIA information for the given input field (called from 'parent'-renderer, i.e. sap.ui.commons.TextFieldRenderer)
	 * As the input tag has the focus all controls aria attributes should be here
	 * @param {sap.ui.fw.RenderManager} rm the RenderManager that can be used for writing to the Render-Output-Buffer
	 * @param {sap.ui.fw.Control} oControl an object representation of the control that should be rendered
	 * @private
	 */
	ComboBoxRenderer.renderARIAInfo = function(rm, oCmb) {

		var iPosInSet = -1;
		if (oCmb.getSelectedItemId()) {
			for ( var i = 0; i < oCmb.getItems().length; i++) {
				var oItem = oCmb.getItems()[i];
				if (oItem.getId() == oCmb.getSelectedItemId()) {
					iPosInSet =  i + 1;
					break;
				}
			}
		}

		var mProps = {
				autocomplete: "inline",
				live: "polite",
				setsize: oCmb.getItems().length,
				posinset: (iPosInSet >= 0) ? iPosInSet : undefined
		};

		if (oCmb.getValueState() == sap.ui.core.ValueState.Error) {
			mProps["invalid"] = true;
		}

		if (oCmb.getDisplaySecondaryValues()) {
			mProps["describedby"] = {
					value: oCmb.getId() + "-SecVal",
					append: true
			};
		}

		rm.writeAccessibilityState(oCmb, mProps);

	};

	ComboBoxRenderer.setEditable = function(oCmb, bEditable) {

		if (oCmb.mobile) {
			var $Select = oCmb.$("select");
			if (bEditable && oCmb.getEnabled()) {
				$Select.removeAttr("disabled");
			} else {
				$Select.attr("disabled", "disabled");
			}
		}

		TextFieldRenderer.setEditable.apply(this, arguments);

	};

	ComboBoxRenderer.setEnabled = function(oCmb, bEnabled) {

		if (oCmb.mobile) {
			var $Select = oCmb.$("select");
			if (bEnabled && oCmb.getEditable()) {
				$Select.removeAttr("disabled");
			} else {
				$Select.attr("disabled", "disabled");
			}
		}

		TextFieldRenderer.setEnabled.apply(this, arguments);

	};

	return ComboBoxRenderer;

}, /* bExport= */ true);
