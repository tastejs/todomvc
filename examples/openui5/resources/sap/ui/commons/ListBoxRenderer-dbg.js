/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides default renderer for control sap.ui.commons.ListBox
sap.ui.define(['jquery.sap.global', 'sap/ui/core/Renderer', 'sap/ui/core/IconPool', 'jquery.sap.strings'],
	function(jQuery, Renderer, IconPool /* , jQuerySap */) {
	"use strict";


	/**
	 * ListBox Renderer
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 * @namespace
	 */
	var ListBoxRenderer = {
	};

	/**
	 * Renders the HTML for the ListBox, using the provided {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} rm The RenderManager that can be used for writing to the render-output-buffer.
	 * @param {sap.ui.commons.ListBox} oListBox The ListBox control that should be rendered.
	 */
	ListBoxRenderer.render = function(rm, oListBox) {
		var r = ListBoxRenderer;

		// TODO: this is a prototype experimenting with an alternative to onAfterRendering for size calculations and corrections
		// Do not copy this approach for now!
		// Main problem: renderers are supposed to create a string, not DOM elements, e.g. so they could also run on the server. At least that was the idea in former times.
		if (r.borderWidths === undefined) {
			if (sap.ui.Device.browser.internet_explorer) { // all known IE versions have this issue (min-width does not include borders)  TODO: update
				var oFakeLbx = document.createElement("div");
				var oStaticArea = sap.ui.getCore().getStaticAreaRef();
				oStaticArea.appendChild(oFakeLbx);
				oFakeLbx.className = "sapUiLbx";
				var $fakeLbx = jQuery(oFakeLbx);
				$fakeLbx.css("width", "50px");
				$fakeLbx.css("min-width", "100px");
				r.borderWidths = oFakeLbx.offsetWidth - 100;
				oStaticArea.removeChild(oFakeLbx);
			} else {
				// all other browsers are fine
				r.borderWidths = 0;
			}
		}

		rm.addClass("sapUiLbx");
		var bStd = true;
		if (!oListBox.getEditable()) {
			rm.addClass("sapUiLbxRo");
			bStd = false;
		}
		if (!oListBox.getEnabled()) {
			rm.addClass("sapUiLbxDis");
			bStd = false;
		}
		if (bStd) {
			rm.addClass("sapUiLbxStd"); // neither readonly nor disabled - this helps the CSS
		}

		// Open the containing <div> tag
		rm.write("<div");

		rm.writeControlData(oListBox);
		rm.writeAttribute("tabindex", "-1");

		var sWidth = oListBox.getWidth();
		if (sWidth) {
			rm.addStyle("width", sWidth);
			var bDisplaySecondaryValues = oListBox.getDisplaySecondaryValues();
			var bDisplayIcons = oListBox.getDisplayIcons();
			if (!bDisplaySecondaryValues && !bDisplayIcons) {
				// if fixed width, no secondary values and no icons use table-layout:fixed; to enable text-overflow:ellipsis;
				// not possible with secondary value / icons because of auto width function of table not available with fixed layout
				rm.addClass("sapUiLbxFixed");
			}
		}

		if (!sWidth || (sWidth == "auto") || (sWidth == "inherit")) {
			rm.addClass("sapUiLbxFlexWidth");
		}

		rm.writeClasses();

		// min/max-widths need fixes in IE
		var sMinWidth = oListBox.getMinWidth();
		var sMaxWidth = oListBox.getMaxWidth();
		if (sap.ui.Device.browser.internet_explorer) {
			sMinWidth = r.fixWidth(sMinWidth);
			sMaxWidth = r.fixWidth(sMaxWidth);
		}
		if (sMinWidth) {
			rm.addStyle("min-width", sMinWidth);
		}
		if (sMaxWidth) {
			rm.addStyle("max-width", sMaxWidth);
		}

		if (oListBox._bHeightInItems) {
			if (oListBox._sTotalHeight != null) {
				rm.addStyle("height", oListBox._sTotalHeight); // calculated height available
			} // else height will be calculated and set in onAfterRendering
		} else {
			var sHeight = oListBox.getHeight();
			if (sHeight) {
				rm.addStyle("height", sHeight); // "normal" CSS height
			}
		}
		rm.writeStyles();

		var tooltip = oListBox.getTooltip_AsString();
		if (tooltip) {
			rm.writeAttributeEscaped("title", tooltip);
		}
		rm.write(">");

		this.renderItemList(oListBox, rm);

		rm.write("</div>");
	};

	/**
	 * @param {sap.ui.commons.ListBox} oListBox ListBox instance
	 * @param {sap.ui.core.RenderManager} rm RenderManager instance
	 * Renders all items
	 */
	ListBoxRenderer.renderItemList = function (oListBox, rm) {

		// Write the start tag
		rm.write("<ul id='" + oListBox.getId() + "-list'");

		rm.writeAttribute("tabindex", this.getTabIndex(oListBox));

		// add ARIA stuff
		rm.writeAccessibilityState(oListBox, {
			role: "listbox",
			multiselectable: oListBox.getAllowMultiSelect()
		});
		rm.write(">");

		var items = oListBox.getItems(),
			iRealItemIndex = 0, // to not count separators
			iRealItemCount = 0;

		var i;
		for (i = 0; i < items.length; i++) { // TODO: required only for ARIA setsize
			if (!(items[i] instanceof sap.ui.core.SeparatorItem)) {
				iRealItemCount++;
			}
		}

		var bDisplaySecondaryValues = oListBox.getDisplaySecondaryValues();

		// Write the rows with the items
		for (i = 0; i < items.length; i++) {
			var item = items[i];

			if (item instanceof sap.ui.core.SeparatorItem) {
				// draw a separator
				rm.write("<div id='", item.getId(), "' class='sapUiLbxSep' role='separator'><hr/>");

				// colspan is not available, so add more separator cells
				if (oListBox.getDisplayIcons()) {
					rm.write("<hr/>");
				}
				if (bDisplaySecondaryValues) {
					rm.write("<hr/>");
				}
				rm.write("</div>");

			} else {
				// regular ListItem or just a plain Item
				rm.write("<li");
				rm.writeElementData(item);
				rm.writeAttribute("data-sap-ui-lbx-index", i);

				rm.addClass("sapUiLbxI");
				if (!item.getEnabled()) {
					rm.addClass("sapUiLbxIDis");
				}
				rm.writeAttribute("tabindex", "-1"); // make all LIs to focusable elements, tabindex will be changed by ItemNavigation
				if (oListBox.isIndexSelected(i)) {
					rm.addClass("sapUiLbxISel");
				}
				rm.writeClasses();

				// get the text values
				var sText = item.getText();
				var sSecondaryValue = item.getAdditionalText ? item.getAdditionalText() : ""; // allow usage of sap.ui.core.Item

				// tooltip
				if (item.getTooltip_AsString()) {
					rm.writeAttributeEscaped("title", item.getTooltip_AsString());
				} else {
					rm.writeAttributeEscaped("title", sText + ((bDisplaySecondaryValues && sSecondaryValue) ? "  --  " + sSecondaryValue : ""));
				}

				// ARIA
				rm.writeAccessibilityState(item, {
					role: "option",
					selected: (i === oListBox.getSelectedIndex()),
					setsize: iRealItemCount,
					posinset: iRealItemIndex + 1
				});

				rm.write(">");


				// write icon column if required
				if (oListBox.getDisplayIcons()) {
					var sIcon;
					if (item.getIcon) { // allow usage of sap.ui.core.Item
						sIcon = item.getIcon();
					}
					rm.write("<span");
					if (IconPool.isIconURI(sIcon)) {
						rm.addClass("sapUiLbxIIco");
						rm.addClass("sapUiLbxIIcoFont");
						var oIconInfo = IconPool.getIconInfo(sIcon);
						rm.addStyle("font-family", "'" + jQuery.sap.encodeHTML(oIconInfo.fontFamily) + "'");
						if (oIconInfo && !oIconInfo.skipMirroring) {
							rm.addClass("sapUiIconMirrorInRTL");
						}
						rm.writeClasses();
						rm.writeStyles();
						rm.write(">");
						rm.writeEscaped(oIconInfo.content);
					} else {
						rm.write(" class='sapUiLbxIIco'><img src='");
						// if the item has an icon, use it; otherwise use something empty
						if (sIcon) {
							rm.writeEscaped(sIcon);
						} else {
							rm.write(sap.ui.resource('sap.ui.commons', 'img/1x1.gif'));
						}
						rm.write("'/>");
					}
					rm.write("</span>");
				}

				// write the main text
				rm.write("<span class='sapUiLbxITxt");
				rm.write("'");
				rm.writeAttribute("id", item.getId() + "-txt");
				var sValueTextAlign = ListBoxRenderer.getTextAlign(oListBox.getValueTextAlign(), null);
				if (sValueTextAlign) {
					rm.write("style='text-align:" + sValueTextAlign + "'"); // TODO: check whether the ListBox needs its own textDirection property
				}
				rm.write(">");
				if (sText === "" || sText === null) {
					rm.write("&nbsp;");
				} else {
					rm.writeEscaped(sText);
				}

				// Potentially display second column
				if (bDisplaySecondaryValues) {
					rm.write("</span><span class='sapUiLbxISec");
					rm.write("'");
					var sSecondaryValueTextAlign = ListBoxRenderer.getTextAlign(oListBox.getSecondaryValueTextAlign(), null);
					if (sSecondaryValueTextAlign) {
						rm.write("style='text-align:" + sSecondaryValueTextAlign + "'"); // TODO: check whether the ListBox needs its own textDirection property
					}
					rm.write(">");
					rm.writeEscaped(sSecondaryValue);
				}

				rm.write("</span></li>");
				iRealItemIndex++;
			}
		}

		// Close the surrounding element
		rm.write("</ul>");
	};


	/**
	 * If the given width is set in pixels, this method reduces the pixel width by the known total width of the borders.
	 * Needed for IE which doesn't handle the combination of border-box and min/max-width correctly.
	 *
	 * @param {string} sCssWidth CSS width
	 * @return {string} Fixed CSS width
	 * @private
	 */
	ListBoxRenderer.fixWidth = function(sCssWidth) {
		if (ListBoxRenderer.borderWidths > 0) {
			if (sCssWidth && jQuery.sap.endsWithIgnoreCase(sCssWidth, "px")) {
				var iWidth = parseInt(sCssWidth.substr(0, sCssWidth.length - 2), 10);
				var newWidth = iWidth - ListBoxRenderer.borderWidths;
				if (newWidth >= 0) {
					return newWidth + "px";
				}
			}
		}
		return sCssWidth;
	};

	/**
	 * The default TabIndex that should be set for the ListBox as well as for the selected element.
	 * Can be overwritten in extending sub-classes.
	 * @param {sap.ui.commons.ListBox} oListBox ListBox instance
	 * @return {int} Tab index
	 * @protected
	 */
	ListBoxRenderer.getTabIndex = function(oListBox) {
		if (oListBox.getEnabled() && oListBox.getEditable()) {
			return 0;
		} else {
			return -1;
		}
	};

	/**
	 * Adapts the item CSS classes after a selection change
	 *
	 * @param {sap.ui.commons.ListBox} oListBox ListBox instance
	 * @private
	 */
	ListBoxRenderer.handleSelectionChanged = function(oListBox) { // TODO: handle tab stop
		if (oListBox.getDomRef()) {
			var items = oListBox.getItems();
			for (var i = 0, l = items.length; i < l; i++) { // TODO: could take very long for long lists
				if (oListBox.isIndexSelected(i)) {
					items[i].$().addClass("sapUiLbxISel").attr("aria-selected", "true");
				} else {
					items[i].$().removeClass("sapUiLbxISel").attr("aria-selected", "false");
				}
			}
		}
	};

	/**
	 * Set the active descendant of the ListBox to get correct announcements
	 *
	 * @param {sap.ui.commons.ListBox} oListBox ListBox instance
	 * @param {int} iIndex Item index
	 * @private
	 */
	ListBoxRenderer.handleARIAActivedescendant = function(oListBox, iIndex) {
		var $list = oListBox.$("list");
		if ($list.length > 0) {
			var $selectedChild = $list.children("li[data-sap-ui-lbx-index=" + iIndex + "]");
			$list.attr("aria-activedescendant", $selectedChild.attr("id"));
		}
	};

	/**
	 * Dummy inheritance of static methods/functions.
	 * @see sap.ui.core.Renderer.getTextAlign
	 * @private
	 */
	ListBoxRenderer.getTextAlign = Renderer.getTextAlign;


	return ListBoxRenderer;

}, /* bExport= */ true);
