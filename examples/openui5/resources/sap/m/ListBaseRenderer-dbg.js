/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(['jquery.sap.global', 'sap/ui/core/theming/Parameters'],
	function(jQuery, Parameters) {
	"use strict";


	/**
	 * List renderer.
	 * @namespace
	 */
	var ListBaseRenderer = {};
	
	/**
	 * Determines the order of the mode for the renderer
	 * -1 is for the beginning of the content
	 * +1 is for the end of the content
	 *  0 is to ignore this mode 
	 * @static
	 */
	ListBaseRenderer.ModeOrder = {
		None : 0,
		Delete : 1,
		MultiSelect : -1,
		SingleSelect : 1,
		SingleSelectLeft : -1,
		SingleSelectMaster : 0
	};
	
	/**
	 * Renders the HTML for the given control, using the provided
	 * {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager}
	 *          oRenderManager the RenderManager that can be used for writing to the
	 *          Render-Output-Buffer
	 * @param {sap.ui.core.Control}
	 *          oControl an object representation of the control that should be
	 *          rendered
	 */
	ListBaseRenderer.render = function(rm, oControl) {
		// container
		rm.write("<div");
		rm.addClass("sapMList");
		rm.writeControlData(oControl);
		rm.writeAttribute("tabindex", "-1");
		rm.writeAttribute("role", "presentation");
		
		if (oControl.getInset()) {
			rm.addClass("sapMListInsetBG");
		}
		if (oControl.getWidth()) {
			rm.addStyle("width", oControl.getWidth());
		}
	
		// background
		if (oControl.getBackgroundDesign) {
			rm.addClass("sapMListBG" + oControl.getBackgroundDesign());
		}
		
		// tooltip
		var sTooltip = oControl.getTooltip_AsString();
		if (sTooltip) {
			rm.writeAttributeEscaped("title", sTooltip);
		}
	
		// run hook method
		this.renderContainerAttributes(rm, oControl);
	
		rm.writeStyles();
		rm.writeClasses();
		rm.write(">");
	
		// render header
		var sHeaderText = oControl.getHeaderText();
		var oHeaderTBar = oControl.getHeaderToolbar();
		if (oHeaderTBar) {
			oHeaderTBar.setDesign(sap.m.ToolbarDesign.Transparent, true);
			oHeaderTBar.addStyleClass("sapMListHdrTBar");
			rm.renderControl(oHeaderTBar);
		} else if (sHeaderText) {
			rm.write("<div class='sapMListHdr'");
			rm.writeAttribute("id", oControl.getId("header"));
			rm.write(">");
			rm.writeEscaped(sHeaderText);
			rm.write("</div>");
		}
	
		// render info bar
		var oInfoTBar = oControl.getInfoToolbar();
		if (oInfoTBar) {
			oInfoTBar.setDesign(sap.m.ToolbarDesign.Info, true);
			oInfoTBar.addStyleClass("sapMListInfoTBar");
			rm.renderControl(oInfoTBar);
		}
		
		// determine items rendering 
		var aItems = oControl.getItems(true);
		var bRenderItems = oControl.shouldRenderItems() && aItems.length;
	
		// run hook method to start building list
		this.renderListStartAttributes(rm, oControl);
		
		// write accessibility state
		rm.writeAccessibilityState(oControl, this.getAccessibilityState(oControl));
	
		// list attributes
		rm.addClass("sapMListUl");
		rm.writeAttribute("id", oControl.getId("listUl"));
		if (bRenderItems || oControl.getShowNoData()) {
			rm.writeAttribute("tabindex", "0");
		}
	
		// separators
		rm.addClass("sapMListShowSeparators" + oControl.getShowSeparators());
	
		// modes
		rm.addClass("sapMListMode" + oControl.getMode());
	
		// inset
		oControl.getInset() && rm.addClass("sapMListInset");
	
		// write inserted styles and classes
		rm.writeClasses();
		rm.writeStyles();
		rm.write(">");
	
		// run hook method to render list head attributes
		this.renderListHeadAttributes(rm, oControl);
	
		// render child controls
		bRenderItems && aItems.forEach(function(oItem) {
			rm.renderControl(oItem);
		});
	
		// render no-data if needed
		if (!bRenderItems && oControl.getShowNoData()) {
			// hook method to render no data
			this.renderNoData(rm, oControl);
		}
	
		// run hook method to finish building list
		this.renderListEndAttributes(rm, oControl);
	
		// dummy after focusable area
		rm.write("<div");
		rm.writeAttribute("id", oControl.getId("after"));
		if (bRenderItems || oControl.getShowNoData()) {
			rm.writeAttribute("tabindex", "0");
		}
		rm.write("></div>");
		
		// render growing delegate if available
		if (bRenderItems && oControl._oGrowingDelegate) {
			oControl._oGrowingDelegate.render(rm);
		}
	
		// footer
		if (oControl.getFooterText()) {
			rm.write("<footer class='sapMListFtr'");
			rm.writeAttribute("id", oControl.getId("footer"));
			rm.write(">");
			rm.writeEscaped(oControl.getFooterText());
			rm.write("</footer>");
		}
	
		// done
		rm.write("</div>");
	};
	
	/**
	 * This hook method is called to render container attributes
	 *
	 * @param {sap.ui.core.RenderManager} rm the RenderManager that can be used for writing to the render output buffer
	 * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
	 */
	ListBaseRenderer.renderContainerAttributes = function(rm, oControl) {
	};
	
	/**
	 * This hook method is called after <ul> and before first <li>
	 *
	 * @param {sap.ui.core.RenderManager} rm the RenderManager that can be used for writing to the render output buffer
	 * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
	 */
	ListBaseRenderer.renderListHeadAttributes = function(rm, oControl) {
	};
	
	/**
	 * This hook method is called to render list tag
	 *
	 * @param {sap.ui.core.RenderManager} rm the RenderManager that can be used for writing to the render output buffer
	 * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
	 */
	ListBaseRenderer.renderListStartAttributes = function(rm, oControl) {
		rm.write("<ul");
		oControl.addNavSection(oControl.getId("listUl"));
	};
	
	/**
	 * Returns aria accessibility role
	 *
	 * @param {sap.ui.core.Control} oControl an object representation of the control
	 * @returns {String}
	 */
	ListBaseRenderer.getAriaRole = function(oControl) {
		return "listbox";
	};
	
	/**
	 * Returns the inner aria labelledby ids for the accessibility
	 *
	 * @param {sap.ui.core.Control} oControl an object representation of the control 
	 * @returns {String|undefined} 
	 */
	ListBaseRenderer.getAriaLabelledBy = function(oControl) {
		var oHeaderTBar = oControl.getHeaderToolbar();
		if (oHeaderTBar) {
			return oHeaderTBar.getTitleId();
		} else if (oControl.getHeaderText()) {
			return oControl.getId("header");
		}
	};
	
	/**
	 * Returns the inner aria describedby ids for the accessibility
	 *
	 * @param {sap.ui.core.Control} oControl an object representation of the control
	 * @returns {String|undefined} 
	 */
	ListBaseRenderer.getAriaDescribedBy = function(oControl) {
		if (oControl.getFooterText()) {
			return oControl.getId("footer");
		}
	};
	
	/**
	 * Returns the accessibility state of the control
	 *
	 * @param {sap.ui.core.Control} oControl an object representation of the control
	 */
	ListBaseRenderer.getAccessibilityState = function(oControl) {
		
		var mMode = sap.m.ListMode,
			sMode = oControl.getMode(),
			bMultiSelectable;
		
		if (sMode == mMode.MultiSelect) {
			bMultiSelectable = true;
		} else if (sMode != mMode.None && sMode != mMode.Delete) {
			bMultiSelectable = false;
		}
		
		return {
			role : this.getAriaRole(oControl),
			multiselectable : bMultiSelectable,
			labelledby : {
				value : this.getAriaLabelledBy(oControl),
				append : true
			}, 
			describedby : {
				value : this.getAriaDescribedBy(oControl),
				append : true
			}
		};
	};
	
	/**
	 * This hook method is called to finish list rendering
	 *
	 * @param {sap.ui.core.RenderManager} rm the RenderManager that can be used for writing to the render output buffer
	 * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
	 */
	ListBaseRenderer.renderListEndAttributes = function(rm, oControl) {
		rm.write("</ul>");
	};
	
	/**
	 * This hook method is called to render no data field
	 *
	 * @param {sap.ui.core.RenderManager} rm the RenderManager that can be used for writing to the render output buffer
	 * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
	 */
	ListBaseRenderer.renderNoData = function(rm, oControl) {
		rm.write("<li");
		rm.writeAttribute("tabindex", "-1");
		rm.writeAttribute("id", oControl.getId("nodata"));
		rm.addClass("sapMLIB sapMListNoData sapMLIBTypeInactive");
		rm.writeClasses();
		rm.write(">");
		
		rm.write("<div");
		rm.addClass("sapMListNoDataText");
		rm.writeAttribute("id", oControl.getId("nodata-text"));
		rm.writeClasses();
		rm.write(">");
		rm.writeEscaped(oControl.getNoDataText(true));
		rm.write("</div>");
		
		rm.write("</li>");
	};

	return ListBaseRenderer;

}, /* bExport= */ true);
