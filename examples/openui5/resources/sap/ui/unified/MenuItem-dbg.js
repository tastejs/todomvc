/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.unified.MenuItem.
sap.ui.define(['jquery.sap.global', 'sap/ui/core/IconPool', './MenuItemBase', './library'],
	function(jQuery, IconPool, MenuItemBase, library) {
	"use strict";


	
	/**
	 * Constructor for a new MenuItem element.
	 *
	 * @param {string} [sId] Id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * Standard item to be used inside a menu. A menu item represents an action which can be selected by the user in the menu or
	 * it can provide a submenu to organize the actions hierarchically.
	 * @extends sap.ui.unified.MenuItemBase
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 * @since 1.21.0
	 *
	 * @constructor
	 * @public
	 * @alias sap.ui.unified.MenuItem
	 * @ui5-metamodel This control/element will also be described in the UI5 (legacy) design time meta model
	 */
	var MenuItem = MenuItemBase.extend("sap.ui.unified.MenuItem", /** @lends sap.ui.unified.MenuItem.prototype */ { metadata : {
	
		library : "sap.ui.unified",
		properties : {
	
			/**
			 * Defines the text which should be displayed on the item.
			 */
			text : {type : "string", group : "Appearance", defaultValue : ''},
	
			/**
			 * Defines the icon of the {@link sap.ui.core.IconPool sap.ui.core.IconPool} or an image which should be displayed on the item.
			 */
			icon : {type : "sap.ui.core.URI", group : "Appearance", defaultValue : ''}
		}
	}});
	
	IconPool.getIconInfo("", ""); //Ensure Icon Font is loaded
	
	MenuItem.prototype.render = function(oRenderManager, oItem, oMenu, oInfo){
		var rm = oRenderManager;
		var oSubMenu = oItem.getSubmenu();
		rm.write("<li ");
		
		var sClass = "sapUiMnuItm";
		if (oInfo.iItemNo == 1) {
			sClass += " sapUiMnuItmFirst";
		} else if (oInfo.iItemNo == oInfo.iTotalItems) {
			sClass += " sapUiMnuItmLast";
		}
		if (!oMenu.checkEnabled(oItem)) {
			sClass += " sapUiMnuItmDsbl";
		}
		if (oItem.getStartsSection()) {
			sClass += " sapUiMnuItmSepBefore";
		}
		
		rm.writeAttribute("class", sClass);
		if (oItem.getTooltip_AsString()) {
			rm.writeAttributeEscaped("title", oItem.getTooltip_AsString());
		}
		rm.writeElementData(oItem);
	
		// ARIA
		if (oInfo.bAccessible) {
			rm.writeAccessibilityState(oItem, {
				role: "menuitem",
				disabled: !oMenu.checkEnabled(oItem),
				posinset: oInfo.iItemNo,
				setsize: oInfo.iTotalItems,
				labelledby: {value: /*oMenu.getId() + "-label " + */this.getId() + "-txt " + this.getId() + "-scuttxt", append: true}
			});
			if (oSubMenu) {
				rm.writeAttribute("aria-haspopup", true);
				rm.writeAttribute("aria-owns", oSubMenu.getId());
			}
		}
	
		// Left border
		rm.write("><div class=\"sapUiMnuItmL\"></div>");
	
		// icon/check column
		rm.write("<div class=\"sapUiMnuItmIco\">");
		if (oItem.getIcon()) {
			rm.writeIcon(oItem.getIcon(), null, {title: null});
		}
		rm.write("</div>");
	
		// Text column
		rm.write("<div id=\"" + this.getId() + "-txt\" class=\"sapUiMnuItmTxt\">");
		rm.writeEscaped(oItem.getText());
		rm.write("</div>");
	
		// Shortcut column
		rm.write("<div id=\"" + this.getId() + "-scuttxt\" class=\"sapUiMnuItmSCut\"></div>");
	
		// Submenu column
		rm.write("<div class=\"sapUiMnuItmSbMnu\">");
		if (oSubMenu) {
			rm.write("<div class=\"sapUiIconMirrorInRTL\"></div>");
		}
		rm.write("</div>");
	
		// Right border
		rm.write("<div class=\"sapUiMnuItmR\"></div>");
	
		rm.write("</li>");
	};
	
	MenuItem.prototype.hover = function(bHovered, oMenu){
		this.$().toggleClass("sapUiMnuItmHov", bHovered);
	};

	return MenuItem;

}, /* bExport= */ true);
