/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides default renderer for control sap.ui.commons.AutoComplete
sap.ui.define(['jquery.sap.global', './ComboBoxRenderer', 'sap/ui/core/Renderer'],
	function(jQuery, ComboBoxRenderer, Renderer) {
	"use strict";


	/**
	 * Renderer for the sap.ui.commons.AutoComplete
	 * @namespace
	 */
	var AutoCompleteRenderer = Renderer.extend(ComboBoxRenderer);
	
	AutoCompleteRenderer.renderExpander = function(rm, oCtrl){
		if (!oCtrl.__sARIATXT) {
			var rb = sap.ui.getCore().getLibraryResourceBundle("sap.ui.commons");
			oCtrl.__sARIATXT = rb.getText("AUTOCOMPLETE_ARIA_SUGGEST");
		}
		
		rm.write("<span id=\"", oCtrl.getId(), "-ariaLbl\" style=\"display:none;\">", oCtrl.__sARIATXT, "</span>");
	};
	
	AutoCompleteRenderer.renderOuterAttributes = function(rm, oCtrl) {
		rm.addClass("sapUiTfAutoComp");
		ComboBoxRenderer.renderOuterAttributes.apply(this, arguments);
	};
	
	//@see sap.ui.commons.ComboBoxRenderer.renderComboARIAInfo
	AutoCompleteRenderer.renderComboARIAInfo = function(rm, oCtrl) {
		var mProps = {
			role: "textbox",
			owns: oCtrl.getId() + "-input " + oCtrl._getListBox().getId()
		};
	
		if (!oCtrl.getEnabled()) {
			mProps["disabled"] = true;
		}
	
		rm.writeAccessibilityState(null, mProps); //null because otherwise automatic generated attributes will be rendered twice
	};
	
	
	//@see sap.ui.commons.ComboBoxRenderer.renderARIAInfo
	AutoCompleteRenderer.renderARIAInfo = function(rm, oCtrl) {
		var mProps = {
			autocomplete: "list",
			live: "polite",
			relevant: "all",
			setsize: oCtrl._getListBox().getItems().length
		};
	
		if (oCtrl.getValueState() == sap.ui.core.ValueState.Error) {
			mProps["invalid"] = true;
		}
	
		rm.writeAccessibilityState(oCtrl, mProps);
	};
	
	

	return AutoCompleteRenderer;

}, /* bExport= */ true);
