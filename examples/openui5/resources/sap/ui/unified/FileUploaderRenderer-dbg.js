/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides default renderer for control sap.ui.unified.FileUploader
sap.ui.define(['jquery.sap.global'],
	function(jQuery) {
	"use strict";


	/**
	 * @namespace
	 */
	var FileUploaderRenderer = function() {
	};


	/**
	 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} oRenderManager The RenderManager that can be used for writing to the render output buffer.
	 * @param {sap.ui.core.Control} oFileUploader An object representation of the control that should be rendered.
	 */
	FileUploaderRenderer.render = function(oRenderManager, oFileUploader) {

		var rm = oRenderManager;
		var accessibility = sap.ui.getCore().getConfiguration().getAccessibility();

		rm.write('<div');
		rm.writeControlData(oFileUploader);
		rm.addClass("sapUiFup");

		var sClass = sap.ui.unified.FileUploaderHelper.addFormClass();
		if (sClass) {
			rm.addClass(sClass);
		}

		rm.writeClasses();
		rm.write('>');

		// form
		rm.write('<form style="display:inline-block" encType="multipart/form-data" method="post"');
		rm.writeAttribute('id', oFileUploader.getId() + '-fu_form');
		rm.writeAttributeEscaped('action', oFileUploader.getUploadUrl());
		rm.writeAttribute('target', oFileUploader.getId() + '-frame');
		rm.write('>');

		// the SAPUI5 TextField and Button
		rm.write('<div ');
		if (!oFileUploader.bMobileLib) {
			rm.write('class="sapUiFupInp"');
		}
		if (accessibility) {
			rm.writeAttribute("role", "textbox");
			rm.writeAttribute("aria-readonly", "true");
		}
		rm.write('>');

		if (!oFileUploader.getButtonOnly()) {
			rm.write('<div class="sapUiFupGroup" border="0" cellPadding="0" cellSpacing="0"><div><div>');
		} else {
			rm.write('<div class="sapUiFupGroup" border="0" cellPadding="0" cellSpacing="0"><div><div style="display:none">');
		}
		rm.renderControl(oFileUploader.oFilePath);
		rm.write('</div><div>');  //-> per style margin
		rm.renderControl(oFileUploader.oBrowse);

		var sAriaText;
		var sTooltip = "";
		if (oFileUploader.getTooltip()) {
			sTooltip = oFileUploader.getTooltip_AsString();
		}
		var sPlaceholder = "";
		if (oFileUploader.getPlaceholder()) {
			sPlaceholder = oFileUploader.getPlaceholder();
		}
		var sValue = "";
		if (oFileUploader.getValue()) {
			sValue = oFileUploader.getValue();
		}
		var sButtonText = "";
		if (oFileUploader.getButtonText()) {
			sButtonText = oFileUploader.getButtonText();
		}
		if (!sValue) {
			sAriaText = sTooltip + " " + sPlaceholder + " " + sButtonText;
		} else {
			sAriaText = sTooltip + " " + sValue + " " + sButtonText;
		}

		rm.write('<span id="' + oFileUploader.getId() + '-AccDescr" class="sapUiInvisibleText" aria-hidden="true">');
		rm.writeEscaped(sAriaText + " " + oFileUploader._sAccText);
		rm.write('</span>');
		rm.write('</div></div></div>');

		// hidden pure input type file (surrounded by a div which is responsible for giving the input the correct size)
		var sName = oFileUploader.getName() || oFileUploader.getId();
		rm.write('<div class="sapUiFupInputMask">');
		rm.write('<input type="hidden" name="_charset_" aria-hidden="true">');
		rm.write('<input type="hidden" id="' + oFileUploader.getId() + '-fu_data" aria-hidden="true"');
		rm.writeAttributeEscaped('name', sName + '-data');
		rm.writeAttributeEscaped('value', oFileUploader.getAdditionalData() || "");
		rm.write('>');
		jQuery.each(oFileUploader.getParameters(), function(iIndex, oParam) {
			rm.write('<input type="hidden" aria-hidden="true" ');
			rm.writeAttributeEscaped('name', oParam.getName() || "");
			rm.writeAttributeEscaped('value', oParam.getValue() || "");
			rm.write('>');
		});
		rm.write('</div>');

		rm.write('</div>');
		rm.write('</form>');
		rm.write('</div>');
	};

	return FileUploaderRenderer;

}, /* bExport= */ true);
