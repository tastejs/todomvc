/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides default renderer for control sap.ui.commons.TextField
sap.ui.define(['jquery.sap.global', 'sap/ui/core/Renderer', 'sap/ui/core/ValueStateSupport'],
	function(jQuery, Renderer, ValueStateSupport) {
	"use strict";


	/**
	 * TextField Renderer
	 * @namespace
	 * @author SAP
	 * @version 1.32.9
	 * @since 0.9.0
	 */
	var TextFieldRenderer = {};

	/**
	 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} oRenderManager The RenderManager that can be used for writing to the render output buffer.
	 * @param {sap.ui.commons.TextField}
	 *            oTextField The TextField control that should be rendered.
	 */
	TextFieldRenderer.render = function(oRenderManager, oTextField) {
		var rm = oRenderManager,
			r  = TextFieldRenderer;

		var sWidth = oTextField.getWidth();
		var tooltip = ValueStateSupport.enrichTooltip(oTextField, oTextField.getTooltip_AsString());
		var bRenderOuter = oTextField._getRenderOuter();

	// In case of Combobox, F4-help, DatePicker: Render outer element.
	// The details of the outer element are rendered in the hook implemented in the corresponding control.
		if (bRenderOuter) {
			rm.write("<div");
			rm.writeControlData(oTextField);
			rm.addClass("sapUiTfBack");
			this.renderStyles(rm, oTextField);

			if (tooltip) {
				rm.writeAttributeEscaped('title', tooltip);
			}

			var sSpanStyle;
			if (sWidth && sWidth != '') {
				sSpanStyle = 'width: ' + sWidth + ';';
			}

			if (this.renderOuterAttributes) {
				this.renderOuterAttributes(rm, oTextField);
			}

			if (sSpanStyle) {
				rm.writeAttribute('style', sSpanStyle);
			}
			rm.writeStyles();
			rm.writeClasses();
			rm.write(">");

			// Outer hook
			if (this.renderOuterContentBefore) {
				this.renderOuterContentBefore(rm, oTextField);
			}
		}

	// Inner tag / pure TextField
		if (this.getInnerTagName) {
			rm.write('<' + this.getInnerTagName());
		} else {
			rm.write("<input");
		}
		rm.addClass("sapUiTf");

		if (!bRenderOuter) {
			// Stand-alone TextField
			rm.writeControlData(oTextField);
			rm.addClass("sapUiTfBack");
			this.renderStyles(rm, oTextField);

			if (sWidth && sWidth != '') {
				rm.addStyle("width", sWidth);
			}
		} else {
			rm.writeAttribute('id', oTextField.getId() + '-input');
			rm.addClass("sapUiTfInner");
			rm.addStyle("width", '100%');
		}

		if (tooltip) {
			// render title always on INPUT tag (even it's in outer DIV too)
			// because screenreader ignores it on outer DIV 
			rm.writeAttributeEscaped('title', tooltip);
		}

		if (oTextField.getName()) {
			rm.writeAttributeEscaped('name', oTextField.getName());
		}

		if (!oTextField.getEditable() && oTextField.getEnabled()) {
			rm.writeAttribute('readonly', 'readonly');
		}
		if (this.renderTextFieldEnabled) {
			this.renderTextFieldEnabled(rm, oTextField);
		} else if (!oTextField.getEnabled()) {
			rm.writeAttribute('disabled', 'disabled');
			rm.writeAttribute('tabindex', '-1');
		} else if (!oTextField.getEditable()) {
			rm.writeAttribute('tabindex', '0');
		} else {
			rm.writeAttribute('tabindex', '0');
		}

		// Appearance
		var sTextDir = oTextField.getTextDirection();
		if (sTextDir) {
			rm.addStyle("direction", sTextDir.toLowerCase());
		}

		var sTextAlign = r.getTextAlign(oTextField.getTextAlign(), sTextDir);
		if (sTextAlign) {
			rm.addStyle("text-align", sTextAlign);
		}

		switch (oTextField.getImeMode()) {
		case sap.ui.core.ImeMode.Inactive:
			rm.addStyle('ime-mode','inactive');
			break;
		case sap.ui.core.ImeMode.Active:
			rm.addStyle('ime-mode','active');
			break;
		case sap.ui.core.ImeMode.Disabled:
			rm.addStyle('ime-mode','disabled');
			break;
		// no default
		}

		if (oTextField.getDesign() == sap.ui.core.Design.Monospace) {
			rm.addClass('sapUiTfMono');
		}

		if (oTextField.getMaxLength()) {
			rm.writeAttribute("maxLength", oTextField.getMaxLength());
		}

		// Add additional attributes, styles and so on (TextArea)
		if (this.renderInnerAttributes) {
			this.renderInnerAttributes(rm, oTextField);
		}

		// ARIA
		if (this.renderARIAInfo) {
			this.renderARIAInfo(rm, oTextField);
		}

		var sPlaceholder = oTextField.getPlaceholder();
		if (sPlaceholder) {
			if (this.convertPlaceholder) {
				sPlaceholder = this.convertPlaceholder(oTextField);
			}
			if (sap.ui.Device.support.input.placeholder) {
				rm.writeAttributeEscaped('placeholder', sPlaceholder);
			}
		}

		rm.writeStyles();
		rm.writeClasses();

		if (this.getInnerTagName) {
			rm.write(">");
		} else {
			rm.write(" value=\"");
			if (!sap.ui.Device.support.input.placeholder && sPlaceholder && !oTextField.getValue()) {
				rm.writeEscaped(sPlaceholder);
			} else {
				rm.writeEscaped(oTextField.getValue());
			}
			rm.write("\"");
			rm.write("/>");
		}

		if (this.getInnerTagName) {
			// Inner hook
			if (this.renderInnerContent) {
				this.renderInnerContent(rm, oTextField);
			}

			rm.write('</' + this.getInnerTagName() + '>');
		}

		if (bRenderOuter) {
			// Outer hook
			if (this.renderOuterContent) {
				this.renderOuterContent(rm, oTextField);
			}

			rm.write("</div>");
		}

	};

	TextFieldRenderer.renderStyles = function(rm, oTextField) {

		rm.addClass('sapUiTfBrd');

		if (oTextField.getEnabled()) {
			if (!oTextField.getEditable()) {
				rm.addClass("sapUiTfRo");
			} else {
				rm.addClass("sapUiTfStd");
			}
		} else {
			rm.addClass("sapUiTfDsbl");
		}

		switch (oTextField.getValueState()) {
		case (sap.ui.core.ValueState.Error) :
			rm.addClass('sapUiTfErr');
		break;
		case (sap.ui.core.ValueState.Success) :
			rm.addClass('sapUiTfSucc');
		break;
		case (sap.ui.core.ValueState.Warning) :
			rm.addClass('sapUiTfWarn');
		break;
		// no default
		}

		if (oTextField.getRequired()) {
			rm.addClass('sapUiTfReq');
		}

		if (oTextField.getPlaceholder() && !sap.ui.Device.support.input.placeholder) {
			rm.addClass('sapUiTfPlace');
		}

	};

	TextFieldRenderer.onfocus = function(oTextField) {
		var oTfRef = oTextField.$();
		var oTfRefInput;
		oTfRef.addClass("sapUiTfFoc");

		if (!sap.ui.Device.support.input.placeholder && !oTextField.getValue() && oTextField.getPlaceholder()) {
			if (oTextField._getRenderOuter()) {
				oTfRefInput = oTextField.$("input");
			} else {
				oTfRefInput = oTfRef;
			}

			oTfRef.removeClass("sapUiTfPlace");
			oTfRefInput.val("");
		}
	};

	TextFieldRenderer.onblur = function(oTextField) {
		var oTfRef = oTextField.$();
		var oTfRefInput;
		oTfRef.removeClass("sapUiTfFoc");

		var sPlaceholder = oTextField.getPlaceholder();
		if (!sap.ui.Device.support.input.placeholder) {
			if (oTextField._getRenderOuter()) {
				oTfRefInput = oTextField.$("input");
			} else {
				oTfRefInput = oTfRef;
			}

			if (!oTfRefInput.val() && sPlaceholder) {
				oTfRef.addClass("sapUiTfPlace");
				if (this.convertPlaceholder) {
					sPlaceholder = this.convertPlaceholder(oTextField);
				}
				oTfRefInput.val(sPlaceholder);
			}
		}
	};

	TextFieldRenderer.setValueState = function(oTextField, oldValueState, newValueState) {
		var oTfRef = oTextField.$();
		var oTfRefInput;
		var bRenderOuter = oTextField._getRenderOuter();

		if (bRenderOuter) {
		// aria attribute must be on inner tag
			oTfRefInput = oTextField.$("input");
		} else {
			oTfRefInput = oTfRef;
		}

		// Remove old value state
		switch (oldValueState) {
		case (sap.ui.core.ValueState.Error) :
			oTfRef.removeClass('sapUiTfErr');
			oTfRefInput.removeAttr('aria-invalid');
			break;
		case (sap.ui.core.ValueState.Success) :
			oTfRef.removeClass('sapUiTfSucc');
			break;
		case (sap.ui.core.ValueState.Warning) :
			oTfRef.removeClass('sapUiTfWarn');
			break;
		// no default
		}

		// Set new value state
		switch (newValueState) {
		case (sap.ui.core.ValueState.Error) :
			oTfRef.addClass('sapUiTfErr');
			oTfRefInput.attr('aria-invalid',true);
			break;
		case (sap.ui.core.ValueState.Success) :
			oTfRef.addClass('sapUiTfSucc');
			break;
		case (sap.ui.core.ValueState.Warning) :
			oTfRef.addClass('sapUiTfWarn');
			break;
		// no default
		}

		var tooltip = ValueStateSupport.enrichTooltip(oTextField, oTextField.getTooltip_AsString());
		if (tooltip) {
			oTfRef.attr('title', tooltip);
			if (bRenderOuter) {
				oTextField.$("input").attr('title', tooltip);
			}
		} else {
			oTfRef.removeAttr('title');
			if (bRenderOuter) {
				oTextField.$("input").removeAttr('title');
			}
		}

	};

	TextFieldRenderer.setEditable = function(oTextField, bEditable) {

		if (!oTextField.getEnabled()) {
			// if disabled -> nothing to do
			return;
		}

		var oTfRef = oTextField.$();
		var oTfRefInput;

		if (oTextField._getRenderOuter()) {
		// Readonly attribute must be on inner tag
			oTfRefInput = oTextField.$("input");
		} else {
			oTfRefInput = oTfRef;
		}

		if (bEditable) {
			oTfRef.removeClass('sapUiTfRo').addClass('sapUiTfStd');
			oTfRefInput.removeAttr('readonly');
			oTfRefInput.removeAttr('aria-readonly');
		} else {
			oTfRef.removeClass('sapUiTfStd').addClass('sapUiTfRo');
			oTfRefInput.attr('readonly', 'readonly');
			oTfRefInput.attr('aria-readonly', true);
		}

	};

	TextFieldRenderer.setEnabled = function(oTextField, bEnabled) {
		var oTfRef = oTextField.$();
		var oTfRefInput;

		if (oTextField._getRenderOuter()) {
		// Disabled attribute must be on inner tag
			oTfRefInput = oTextField.$("input");
		} else {
			oTfRefInput = oTfRef;
		}

		if (bEnabled) {
			if (oTextField.getEditable()) {
				oTfRef.removeClass('sapUiTfDsbl').addClass('sapUiTfStd').removeAttr('aria-disabled');
				oTfRefInput.removeAttr('disabled').removeAttr('aria-disabled').attr( 'tabindex', '0');
			} else {
				oTfRef.removeClass('sapUiTfDsbl').addClass('sapUiTfRo').removeAttr('aria-disabled');
				oTfRefInput.removeAttr('disabled').removeAttr('aria-disabled').attr( 'tabindex', '0').attr( 'readonly', 'readonly').attr('aria-readonly', true);
			}
		} else {
			if (oTextField.getEditable()) {
				oTfRef.removeClass('sapUiTfStd').addClass('sapUiTfDsbl').attr('aria-disabled', 'true');
				oTfRefInput.attr( 'disabled', 'disabled').attr('aria-disabled', 'true').attr( 'tabindex', '-1');
			} else {
				oTfRef.removeClass('sapUiTfRo').addClass('sapUiTfDsbl').attr('aria-disabled', 'true');
				oTfRefInput.removeAttr('readonly').removeAttr('aria-readonly').attr( 'disabled', 'disabled').attr('aria-disabled', 'true').attr( 'tabindex', '-1');
			}
		}

	};

	TextFieldRenderer.removeValidVisualization = function(oTextField) {
		var oTfRef = oTextField.$();
		if (oTfRef) {
			oTfRef.removeClass("sapUiTfSucc");
		} else {
			jQuery.sap.delayedCall(1000, TextFieldRenderer, "removeValidVisualization", [oTextField]);
		}
	};

	TextFieldRenderer.setDesign = function(oTextField, sDesign) {

		oTextField.$().toggleClass('sapUiTfMono', (sDesign == sap.ui.core.Design.Monospace));
	};

	TextFieldRenderer.setRequired = function(oTextField, bRequired) {

		var oTfRefInput;

		if (oTextField._getRenderOuter()) {
		// aria attribute must be on inner tag
			oTfRefInput = oTextField.$("input");
		} else {
			oTfRefInput = oTextField.$();
		}

		oTextField.$().toggleClass('sapUiTfReq', bRequired);
		if (bRequired) {
			oTfRefInput.attr("aria-required", true);
		} else {
			oTfRefInput.removeAttr("aria-required");
		}

	};

	TextFieldRenderer.renderARIAInfo = function(rm, oTextField) {

		var mProps = {
			role: oTextField.getAccessibleRole().toLowerCase(),
			multiline: false,
			autocomplete: 'none'};

		if (oTextField.getValueState() == sap.ui.core.ValueState.Error) {
			mProps["invalid"] = true;
		}

		rm.writeAccessibilityState(oTextField, mProps);

	};

	/**
	 * Dummy inheritance of static methods/functions.
	 * @see sap.ui.core.Renderer.getTextAlign
	 * @private
	 */
	TextFieldRenderer.getTextAlign = Renderer.getTextAlign;


	return TextFieldRenderer;

}, /* bExport= */ true);
