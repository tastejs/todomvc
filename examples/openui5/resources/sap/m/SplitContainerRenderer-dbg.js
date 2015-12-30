/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(['jquery.sap.global'],
	function(jQuery) {
	"use strict";


	/**
	 * SplitContainer renderer. 
	 * @namespace
	 */
	var SplitContainerRenderer = {
	};
	
	
	/**
	 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
	 * 
	 * @param {sap.ui.core.RenderManager} oRm the RenderManager that can be used for writing to the render output buffer
	 * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
	 */
	SplitContainerRenderer.render = function(oRm, oControl){
		var sMode = oControl.getMode();

		oRm.write("<div");
		oRm.writeControlData(oControl);
		oRm.addClass("sapMSplitContainer");

		if (this.renderAttributes) {
			this.renderAttributes(oRm, oControl); // may be used by inheriting renderers, but DO NOT write class or style attributes! Instead, call addClass/addStyle.
		}

		// The following CSS classes need to be added using the addStyleClass function because
		//  they are manipulated later on also using the togggleStyleClass function
		if (!sap.ui.Device.system.phone) {
			if (sap.ui.Device.orientation.portrait) {
				oControl.addStyleClass("sapMSplitContainerPortrait");
			}
			switch (sMode) {
				case "ShowHideMode":
					oControl.addStyleClass("sapMSplitContainerShowHide");
					break;
				case "StretchCompress":
					oControl.addStyleClass("sapMSplitContainerStretchCompress");
					break;
				case "PopoverMode":
					oControl.addStyleClass("sapMSplitContainerPopover");
					break;
				case "HideMode":
					oControl.addStyleClass("sapMSplitContainerHideMode");
					break;
			}
		}

		oRm.writeClasses(oControl);
		oRm.writeStyles();
		var sTooltip = oControl.getTooltip_AsString();
		if (sTooltip) {
			oRm.writeAttributeEscaped("title", sTooltip);
		}
		oRm.write(">"); // div element
		
		if (this.renderBeforeContent) {
			this.renderBeforeContent(oRm, oControl);
		}
		
		if (!sap.ui.Device.system.phone) {
			oControl._bMasterisOpen = false;
			if ((sap.ui.Device.orientation.landscape && (sMode !== "HideMode")) ||
					sap.ui.Device.orientation.portrait && (sMode === "StretchCompress")) {
				oControl._oMasterNav.addStyleClass("sapMSplitContainerMasterVisible");
				oControl._bMasterisOpen = true;
			} else {
				oControl._oMasterNav.addStyleClass("sapMSplitContainerMasterHidden");
			}

			if (oControl.getMode() === "PopoverMode" && sap.ui.Device.orientation.portrait) {
				oControl._oDetailNav.addStyleClass("sapMSplitContainerDetail");
				oRm.renderControl(oControl._oDetailNav);
				//add master to popover if it's not yet added
				if (oControl._oPopOver.getContent().length === 0) {
					oControl._oPopOver.addAggregation("content", oControl._oMasterNav, true);
				}
			} else {
				oControl._oMasterNav.addStyleClass("sapMSplitContainerMaster");
				oRm.renderControl(oControl._oMasterNav);
				
				oControl._oDetailNav.addStyleClass("sapMSplitContainerDetail");
				oRm.renderControl(oControl._oDetailNav);
			}
		} else {
			oControl._oMasterNav.addStyleClass("sapMSplitContainerMobile");
			oRm.renderControl(oControl._oMasterNav);
		}
		
		 oRm.write("</div>");
	};
	

	return SplitContainerRenderer;

}, /* bExport= */ true);
