/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides default renderer for the sap.ui.ux3.ExactListRenderer
sap.ui.define(['jquery.sap.global'],
	function(jQuery) {
	"use strict";


	/**
	 * ExactList renderer.
	 * @namespace
	 */
	var ExactListRenderer = {
	};
	
	
	/**
	 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} oRenderManager the RenderManager that can be used for writing to the Render-Output-Buffer
	 * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
	 */
	ExactListRenderer.render = function(oRenderManager, oControl){
	
		var rm = oRenderManager;
		var aSubLists = oControl.getSubLists();
		var oAttribute = oControl._getAtt();
		
		if (!oAttribute) {
			return; //No Attribute attached to this list -> ignore rendering
		}
		
		var bIsTop = oControl._isTop();
	
		// render the root tag
	    rm.write("<div");
	    rm.writeControlData(oControl);
	    rm.addClass("sapUiUx3ExactLst");
	    var bActiveTitle = false;
	    
	    var bTopListHidden = false;
	    
	    if (bIsTop) {
				var oBrowser = oControl.getParent();
				if (oBrowser) {
					if (oBrowser.hasOptionsMenu) {
						bActiveTitle = oBrowser.hasOptionsMenu();
						if (bActiveTitle) {
							rm.addClass("sapUiUx3ExactLstTopActive");
						}
					}
					if (oBrowser.getShowTopList && !oBrowser.getShowTopList()) {
						rm.addClass("sapUiUx3ExactLstTopHidden");
						bTopListHidden = true;
					}
				}
				
			rm.addClass("sapUiUx3ExactLstTop");
			rm.addStyle("height", oControl.getTopHeight() + "px");
	    }
	    if (oControl._bCollapsed) {
			rm.addClass("sapUiUx3ExactLstCollapsed");
	    }
	    
	    rm.addClass("sapUiUx3ExactLstLvl_" + oControl._iLevel);
	
	    rm.writeClasses();
	    rm.writeStyles();
	    rm.write(">");
	    
	    if (bTopListHidden) {
				rm.write("<div id=\"" + oControl.getId() + "-foc\" class=\"sapUiUx3ExactLstFoc\" tabindex=\"0\"></div>");
	    }
	
	    if (!oControl._bPopupOpened) {
			// render the list area with the used listbox
			rm.write("<div id=\"" + oControl.getId() + "-lst\" class=\"sapUiUx3ExactLstLst\"");
				if (oControl._bCollapsed && oControl._oCollapseStyles && oControl._oCollapseStyles["lst"]) {
					rm.write(" style=\"" + oControl._oCollapseStyles["lst"] + "\"");
				}
				
				rm.write(">");
			rm.renderControl(oControl._lb);
			rm.write("<a id=\"" + oControl.getId() + "-exp\" class=\"sapUiUx3ExactLstExp\">" + this.getExpanderSymbol(false, false) + "</a>");
			rm.write("</div>");
	    } else {
				oControl._bRefreshList = true;
	    }
	
	    // render the content area with the sub lists
	    rm.write("<div id=\"" + oControl.getId() + "-cntnt\" ");
	    rm.write("class=\"sapUiUx3ExactLstCntnt");
	    if (aSubLists.length == 0) {
			rm.write(" sapUiUx3ExactLstCntntEmpty");
	    }
	    rm.write("\"");
	    if (oControl._bCollapsed && oControl._oCollapseStyles && oControl._oCollapseStyles["cntnt"]) {
				rm.write(" style=\"" + oControl._oCollapseStyles["cntnt"] + "\"");
	    }
	    rm.write(">");
	    for (var i = 0; i < aSubLists.length; i++) {
			rm.renderControl(aSubLists[i]);
	    }
	    rm.write("</div>");
	
	    // render the header
	    rm.write("<header id=\"" + oControl.getId() + "-head\" class=\"sapUiUx3ExactLstHead\"");
	    if (bIsTop && bActiveTitle) {
				rm.write(" role=\"button\" aria-haspopup=\"true\"");
	    }
	    if (!bIsTop && oControl._bCollapsed && oAttribute) {
				rm.writeAttribute("role", "region");
				rm.writeAttribute("aria-expanded", "false");
				rm.writeAttributeEscaped("aria-label", oControl._rb.getText("EXACT_LST_LIST_COLL_ARIA_LABEL", [oControl._iLevel, oAttribute.getText()]));
	    }
	    rm.write(" tabindex=\"" + (bIsTop ? "0" : "-1") + "\">");
	    if (bIsTop) {
			// render the header content for top list
			rm.write("<h3 id=\"" + oControl.getId() + "-head-txt\" class=\"sapUiUx3ExactLstHeadTopTxt\"><span class=\"sapUiUx3ExactLstHeadTopTxtTxt\">");
			if (oControl.getTopTitle()) {
				rm.writeEscaped(oControl.getTopTitle());
			}
			rm.write("</span>");
			if (bActiveTitle) {
				rm.write("<span class=\"sapUiUx3ExactLstHeadTopIco\"></span>");
			}
			rm.write("</span></h3>");
	    } else {
			// render the header content for non-top list
			rm.write("<h3 id=\"" + oControl.getId() + "-head-txt\" class=\"sapUiUx3ExactLstHeadTxt\"");
			if (oAttribute && oAttribute.getTooltip_AsString()) {
				rm.writeAttributeEscaped("title", oAttribute.getTooltip_AsString());
			} else if (oAttribute && oAttribute.getText()) {
				rm.writeAttributeEscaped("title", oAttribute.getText());
			}
			if (oControl._bCollapsed && oControl._oCollapseStyles && oControl._oCollapseStyles["head-txt"]) {
					rm.write(" style=\"" + oControl._oCollapseStyles["head-txt"] + "\"");
			}
			rm.write(">");
			if (oAttribute) {
				rm.writeEscaped(oAttribute.getText());
			}
			rm.write("</h3>");
	
			// render header actions
			rm.write("<div id=\"" + oControl.getId() + "-head-action\" class=\"sapUiUx3ExactLstHeadAct" + (oControl.getShowClose() ? "" : " sapUiUx3ExactLstHeadActNoClose") + "\">");
			rm.write("<a id=\"" + oControl.getId() + "-hide\" class=\"sapUiUx3ExactLstHide\" role=\"presentation\"");
			rm.writeAttributeEscaped("title", oControl._rb.getText(oControl._bCollapsed ? "EXACT_LST_LIST_EXPAND" : "EXACT_LST_LIST_COLLAPSE"));
			rm.write(">", this.getExpanderSymbol(!oControl._bCollapsed, true), "</a>");
			rm.write("<a id=\"" + oControl.getId() + "-close\" role=\"presentation\" class=\"sapUiUx3ExactLstClose\"");
			rm.writeAttributeEscaped("title", oControl._rb.getText("EXACT_LST_LIST_CLOSE"));
			rm.write(">X</a>");
			rm.write("</div>");
	    }
	    rm.write("</header>");
	
	    // render resize bar
	    rm.write("<div id=\"" + oControl.getId() + "-rsz\" class=\"sapUiUx3ExactLstRSz\"></div>");
	
		// close the root tag
	    rm.write("</div>");
	};
	
	
	/**
	 * Returns the symbol for the vertical or horizontal expander depending on the given expand state.
	 * @private
	 */
	ExactListRenderer.getExpanderSymbol = function(bExpanded, bHorizontal){
		if (bHorizontal) {
			if (sap.ui.getCore().getConfiguration().getRTL()) {
				return bExpanded ? "&#9654;" : "&#9664;";
			} else {
				return bExpanded ? "&#9664;" : "&#9654;";
			}
		} else {
			return bExpanded ? "&#9650;" : "&#9660;";
		}
	};
	

	return ExactListRenderer;

}, /* bExport= */ true);
