/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(['jquery.sap.global'],
	function(jQuery) {
	"use strict";


	/**
	 * FacetFilter renderer. 
	 * @namespace
	 */
	var FacetFilterRenderer = {
	};
	// create ARIA announcements 
	var mAriaAnnouncements = {};
	
	
	/**
	 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
	 * 
	 * @param {sap.ui.core.RenderManager} oRm the RenderManager that can be used for writing to the render output buffer
	 * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
	 */
	FacetFilterRenderer.render = function(oRm, oControl){
		switch (oControl.getType()) {
	
		case sap.m.FacetFilterType.Simple:
			FacetFilterRenderer.renderSimpleFlow(oRm, oControl);
			break;
	
		case sap.m.FacetFilterType.Light:
			FacetFilterRenderer.renderSummaryBar(oRm, oControl);
			break;
		}
	};
	
	/**
	 * 
	 * 
	 * @param {sap.ui.core.RenderManager} oRm the RenderManager that can be used for writing to the render output buffer
	 * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
	 */
	FacetFilterRenderer.renderSimpleFlow = function(oRm, oControl) {
		
		oRm.write("<div");
		oRm.writeControlData(oControl);
		oRm.addClass("sapMFF");
		
		if (oControl.getShowSummaryBar()) {
			
			oRm.write(">");
			FacetFilterRenderer.renderSummaryBar(oRm, oControl);
		} else {
			
			if (oControl._lastScrolling) {
				
				oRm.addClass("sapMFFScrolling");
			} else {
				
				oRm.addClass("sapMFFNoScrolling");
			}
			
			if (oControl.getShowReset()) {
				
				oRm.addClass("sapMFFResetSpacer");
			}
			oRm.writeClasses();
			oRm.write(">");
			
			
			if (sap.ui.Device.system.desktop) {
				oRm.renderControl(oControl._getScrollingArrow("left"));
			}
			// Render the div for the carousel
			oRm.write("<div");
			oRm.writeAttribute("id", oControl.getId() + "-head");
			oRm.addClass("sapMFFHead");
			oRm.writeClasses();
			oRm.write(">");
			
			var aLists = oControl._getSequencedLists();
			for (var i = 0; i < aLists.length; i++) {
						var button = oControl._getButtonForList(aLists[i]);
						if (oControl.getShowPersonalization()) {
								if (!button.getAriaDescribedBy() || button.getAriaDescribedBy() == '')	 {
									button.addAriaDescribedBy(this.getAriaAnnouncement("ARIA_REMOVE"));
								}
						}
				oRm.renderControl(button);
				if (oControl.getShowPersonalization()) {
					
					oRm.renderControl(oControl._getFacetRemoveIcon(aLists[i]));
				}
			}
			
			if (oControl.getShowPersonalization()) {
				oRm.renderControl(oControl.getAggregation("addFacetButton"));
			}
			oRm.write("</div>"); // Close carousel div
			if (sap.ui.Device.system.desktop) {
				oRm.renderControl(oControl._getScrollingArrow("right"));
			}
			
			if (oControl.getShowReset()) {
				
				oRm.write("<div");
				oRm.addClass("sapMFFResetDiv");
				oRm.writeClasses();
				oRm.write(">");
				oRm.renderControl(oControl.getAggregation("resetButton"));
				oRm.write("</div>");
			}
		}
		oRm.write("</div>");
	};
	
	
	/**
	 * 
	 * 
	 * @param {sap.ui.core.RenderManager} oRm the RenderManager that can be used for writing to the render output buffer
	 * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
	 */
	FacetFilterRenderer.renderSummaryBar = function(oRm, oControl) {
	
		// We cannot just render the toolbar without the parent div.  Otherwise it is
		// not possible to switch type from light to simple.
		oRm.write("<div");
		oRm.writeControlData(oControl);
		oRm.addClass("sapMFF");
		oRm.writeClasses();
		oRm.write(">");
		var oSummaryBar = oControl.getAggregation("summaryBar");
		oRm.renderControl(oSummaryBar);
		oRm.write("</div>");
	};
	
	
	/**
	 * Creates an invisible aria node for the given message bundle text  
	 * in the static UIArea and returns its id for ARIA announcements
	 * 
	 * This method should be used when text is reached frequently.
	 * 
	 * @param {String} sKey key of the announcement
	 * @param {String} [sBundleText] key of the announcement
	 * @returns {String} id of the generated invisible aria node
	 * @protected
	 */
	FacetFilterRenderer.getAriaAnnouncement = function(sKey, sBundleText) {
		if (mAriaAnnouncements[sKey]) {
			return mAriaAnnouncements[sKey];
		}
		
		sBundleText = sBundleText || "FACETFILTER_" + sKey.toUpperCase();
		mAriaAnnouncements[sKey] = new sap.ui.core.InvisibleText({
			text : sap.ui.getCore().getLibraryResourceBundle("sap.m").getText(sBundleText)
		}).toStatic().getId();
		
		return mAriaAnnouncements[sKey];
	};
	

	
	/**
	 * Returns the inner aria describedby ids for the accessibility
	 *
	 * @param {sap.ui.core.Control} oLI an object representation of the control
	 * @returns {String|undefined} 
	 * @protected
	 */
	FacetFilterRenderer.getAriaDescribedBy = function(oControl) {
		var aDescribedBy = [];
	
		if (oControl.getShowPersonalization()) {
			aDescribedBy.push(this.getAriaAnnouncement("ARIA_REMOVE"));
		}
		
		
		return aDescribedBy.join(" ");
	};
	
	
	/**
	 * Returns the accessibility state of the control
	 *
	 * @param {sap.ui.core.Control} oLI an object representation of the control
	 * @protected
	 */
	FacetFilterRenderer.getAccessibilityState = function(oControl) {
		return {
			describedby : {
				value : this.getAriaDescribedBy(oControl),
				append : true
			}
		};
	};
	
	

	return FacetFilterRenderer;

}, /* bExport= */ true);
