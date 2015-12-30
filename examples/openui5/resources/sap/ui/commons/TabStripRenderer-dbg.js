/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides default renderer for control sap.ui.commons.TabStrip
sap.ui.define(['jquery.sap.global'],
	function(jQuery) {
	"use strict";


	/**
	 * TabStrip renderer.
	 * @namespace
	 */
	var TabStripRenderer = function() {
	};


	/**
	 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} oRenderManager the RenderManager that can be used for writing to the Render-Output-Buffer
	 * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
	 */
	TabStripRenderer.render = function(oRenderManager, oControl){
		// convenience variable
		var rm = oRenderManager;
		var rb = sap.ui.getCore().getLibraryResourceBundle("sap.ui.commons");

		//outer DIV
		rm.write("<div role='presentation'");
		rm.addClass("sapUiTabStrip");
		rm.addStyle("height",oControl.getHeight());
		rm.addStyle("width",oControl.getWidth());
		rm.writeClasses();
		rm.writeStyles();
		rm.writeControlData(oControl);
		//header area
		rm.write("><div class=\"sapUiTabBar\" tabIndex=\"0\"");
		if (oControl.getTooltip_AsString()) {
			rm.writeAttributeEscaped('title', oControl.getTooltip_AsString());
		}
		// menu and list header
		rm.write("><div class=\"sapUiTabMenu\"></div><ul class=\"sapUiTabBarCnt\" role=\"tablist\">");

		var aTabs = oControl.getTabs();
		// check if selected tab exists and is visible -> otherwise select first active one
		var bWrongIndex = false;
		var iSelectedIndex = oControl.getSelectedIndex();
		if (iSelectedIndex < 0) {
			// if not tab is selected use default value
			iSelectedIndex = 0;
			oControl.setProperty( 'selectedIndex', 0, true );
		}
		var oSelectedTab = aTabs[iSelectedIndex];
		if (!oSelectedTab || !oSelectedTab.getVisible() || !oSelectedTab.getEnabled()) {
			oControl._warningInvalidSelectedIndex(iSelectedIndex, oSelectedTab);
			bWrongIndex = true;
		}

		// for ARIA determine number of visible tabs
		oControl.iVisibleTabs = 0;
		for (var i = 0;i < aTabs.length;i++) {
			var oTab = aTabs[i];
			if (oTab.getVisible() === false) {
				continue;
			}
			oControl.iVisibleTabs++;
		}

		var iVisibleIndex = 0;
		// tabs
		for (var i = 0; i < aTabs.length; i++) {
			var oTab = aTabs[i];
			if (oTab.getVisible() === false) {
				continue;
			}

			if (bWrongIndex && oTab.getEnabled()) {
				oControl.setProperty( 'selectedIndex', i, true );
				iSelectedIndex = i;
				bWrongIndex = false;
			}

			rm.write("<li");

			if (oTab.getEnabled() == false) {
				rm.addClass("sapUiTabDsbl");
			} else if (i == iSelectedIndex) {
				rm.addClass("sapUiTabSel");
			} else {
				rm.addClass("sapUiTab");
			}

			// enable the successor tab to overlap this tab if selected
			if (i == iSelectedIndex - 1) {
				rm.addClass("sapUiTabBeforeSel");
			} else if (i == iSelectedIndex + 1) {
				rm.addClass("sapUiTabAfterSel");
			}

			rm.writeControlData(oTab);
			rm.writeAttribute("tabidx", i);

			//ARIA
			iVisibleIndex++;

			rm.writeAttribute("tabindex", "-1");
			rm.writeAttribute("role", "tab");

			rm.writeAccessibilityState(oTab, {selected: i == iSelectedIndex,
											  controls: oTab.getId() + "-panel",
											  disabled: !oTab.getEnabled(),
											  posinset: iVisibleIndex,
											  setsize: oControl.iVisibleTabs});
			if (oTab.getClosable()) {
				// close button text must be read
				rm.writeAccessibilityState(oTab, {describedby: oTab.getId() + "-close"});
			}

			rm.writeClasses();

			var oTitle = oTab.getTitle();
			// tooltip: if title has a tooltip use it, if not use the tooltip of the tab
			if (oTitle && oTitle.getTooltip_AsString()) {
				rm.writeAttributeEscaped('title', oTitle.getTooltip_AsString());
			} else if (oTab.getTooltip_AsString()) {
				rm.writeAttributeEscaped('title', oTab.getTooltip_AsString());
			}
			rm.write(">");

			// title with icon
			if (oTitle) {
				var sIcon = oTitle.getIcon();
				if (sIcon) {
					var aClasses = [];
					var mAttributes = {
						"title": null // prevent icon tooltip
					};

					aClasses.push("sapUiTabIco");
					rm.writeIcon(sIcon, aClasses, mAttributes);
				}
				rm.writeEscaped(oTitle.getText());
			} else {
				jQuery.sap.log.warning("No title configured for " + oTab + ". Either set a string as 'text' property or a sap.ui.core.Title as 'title' aggregation.");
			}
			if (oTab.getClosable()) {
				// close button
				rm.write("<button id='" + oTab.getId() + "-close' type=\"button\" tabindex= \"-1\" class=\"sapUiTabClose\" title=\"" + rb.getText("TAB_CLOSE_TEXT") + "\"></button>");
			}
			rm.write("</li>");
		}
		rm.write("</ul></div>");

		if (bWrongIndex) {
			// still wrong index - no tab is selected -> render empty panel area
			oControl.setProperty( 'selectedIndex', -1, true );
			iSelectedIndex = -1;
			rm.write("<div id=\"" + oControl.getId() + "-panel" + "\" role=\"tabpanel\"");
			rm.addClass("sapUiTabPanel");
			if (oControl.getHeight()) {
				rm.addClass("sapUiTabPanelHeight");
			}
			rm.writeClasses();
			rm.write("></div>");
		} else {
			for (var i = 0;i < aTabs.length;i++) {
				var oTab = aTabs[i];
				//do not render unselected (or invisible) tab content
				if (i != iSelectedIndex || oTab.getVisible() === false) {
					continue;
				}

				// Improved version... now announcing the title when clicked into the tabpanel... into the full tabpanel!
				// ARIA requires ID for the Panel...
				rm.write("<div id=\"" + oTab.getId() + "-panel" + "\" role=\"tabpanel\" aria-labelledby=\"" + oTab.getId() + "\"");
				rm.addClass("sapUiTabPanel");
				if (oControl.getHeight()) {
					rm.addClass("sapUiTabPanelHeight");
				}
				rm.writeClasses();
				rm.write(">");

				TabStripRenderer.renderTabContents(rm,oTab);
				rm.write("</div>");
			}
		}
		rm.write("</div>");

		// reset invalidate flag
		oControl.invalidated = false;

	};

	/*moved over from former (and replaced) Panel control
	 * @private
	 */
	TabStripRenderer.renderTabContents = function(rm, oControl) {

		// Content
		var oControls = oControl.getContent(),
		iLength = oControls.length;
		for (var i = 0;i < iLength;i++) {
			rm.renderControl(oControls[i]);
		}

	};

	return TabStripRenderer;

}, /* bExport= */ true);
