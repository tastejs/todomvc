/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides default renderer for the sap.ui.ux3.NavigationBar
sap.ui.define(['jquery.sap.global'],
	function(jQuery) {
	"use strict";


	/**
	 * NavigationBar renderer.
	 * @namespace
	 */
	var NavigationBarRenderer = {
	};


	/**
	 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} oRenderManager the RenderManager that can be used for writing to the Render-Output-Buffer
	 * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
	 */
	NavigationBarRenderer.render = function(oRenderManager, oControl) {
		// convenience variable
		var rm = oRenderManager;
		var sId = oControl.getId();

		// write the HTML into the render manager
		rm.addClass("sapUiUx3NavBar");
		if (oControl.getToplevelVariant()) {
			rm.addClass("sapUiUx3NavBarToplevel");
		}

		rm.write("<nav");
		rm.writeControlData(oControl);
		rm.writeClasses();
		rm.write("role='navigation'>");
		rm.write("<ul id='" + sId + "-list' role='menubar' class='sapUiUx3NavBarList'");
		rm.addStyle("white-space", "nowrap");
		rm.writeStyles();
		rm.write(">");
		NavigationBarRenderer.renderItems(rm, oControl);
		rm.write("</ul>");
		rm.write("<a id='" + sId + "-ofb' tabindex='-1' role='presentation' class='sapUiUx3NavBarBack' href='javascript:void(0)'>&lt;&lt;</a>");
		rm.write("<a id='" + sId + "-off' tabindex='-1' role='presentation' class='sapUiUx3NavBarForward' href='javascript:void(0)'>&gt;&gt;</a>");
		rm.write("<a id='" + sId + "-ofl' tabindex='-1' role='presentation' class='sapUiUx3NavBarOverflowBtn' href='javascript:void(0)'>");
		rm.writeIcon("sap-icon://overflow", [], { id : sId + "-oflt" });
		rm.write("</a>");
		rm.write("</nav>");
	};



	NavigationBarRenderer.renderItems = function(oRm, oControl) {
		var aItems = oControl.getItems();
		var bNeedToGetInstances = false;
		if (!aItems || aItems.length == 0) { // use the association instead, if the aggregation is empty
			aItems = oControl.getAssociatedItems();
			bNeedToGetInstances = true; // avoid type checks in the loop
		}

		var iNoOfItems = aItems.length;

		// dummy item to avoid jumping while animating
		oRm.write("<li");
		oRm.addStyle("display", "inline-block");
		oRm.writeStyles();
		oRm.write(">");
		oRm.write("<a id='" + oControl.getId() + "-dummyItem' class='sapUiUx3NavBarDummyItem sapUiUx3NavBarItem'>&nbsp;</a></li>");
		var selId = oControl.getSelectedItem();

		for (var i = 0; i < iNoOfItems; i++) {
			var item = bNeedToGetInstances ? sap.ui.getCore().byId(aItems[i]) : aItems[i];
			if (item.getVisible()) {
				var itemId = item.getId();
				var bIsSelected = itemId == selId;
				oRm.write("<li");
				oRm.addStyle("display", "inline-block");
				oRm.writeStyles();
				if (bIsSelected) {
					oRm.write(" class='sapUiUx3NavBarItemSel'");
				}

				oRm.write("><a ");

				// Psssst. This is not right. Don't tell anyone, because it works like this.
				// The element data should be written into the li-element so that it is removed
				// automatically on destroy. Since when removing items an invalidate is called the list
				// is built up from scratch anyway, so it does not cause any problems. If this leads
				// to any problems, the onclick/userActivation code must be changed to reflect this
				// change.
				// TL;DR: Not correct, won't fix - because it works and things might depend on the DOM
				//        being this way.
				oRm.writeElementData(item);
				/* eslint-disable no-script-url */
				oRm.writeAttributeEscaped("href", item.getHref() || "javascript:void(0);");
				/* eslint-enable no-script-url */
				oRm.write(" aria-setsize='" + iNoOfItems + "' aria-posinset='" + (i + 1) + "' role='menuitemradio' class='sapUiUx3NavBarItem'");
				if (bIsSelected) {
					oRm.write(" tabindex='0'");
				}
				oRm.write(" aria-checked='" + (bIsSelected ? "true" : "false") + "'");

				var tooltip = item.getTooltip_AsString();
				if (tooltip) {
					oRm.write(" title='" + jQuery.sap.encodeHTML(tooltip) + "'");
				}

				oRm.write(">");
				oRm.write(jQuery.sap.encodeHTML(item.getText()));
				oRm.write("</a></li>");
			}
		}

		var arrowPos;
		if (oControl._bRtl) {
			arrowPos = "right:" + oControl._iLastArrowPos;
		} else {
			arrowPos = "left:" + oControl._iLastArrowPos;
		}
		oRm.write("<span id='" + oControl.getId() + "-arrow' style='" + arrowPos + "px;");
		if ((aItems.length == 1) && !oControl.getToplevelVariant() && !!sap.ui.Device.browser.internet_explorer && (sap.ui.Device.browser.version == 8 || sap.ui.Device.browser.version == 7)) { // IE8 workaround; other browsers understand nth-child, see Base-CSS
			oRm.write("display:none;"); // hide arrow when there is only one item
		}
		oRm.write("' class='sapUiUx3NavBarArrow'></span>");
	};


	return NavigationBarRenderer;

}, /* bExport= */ true);
