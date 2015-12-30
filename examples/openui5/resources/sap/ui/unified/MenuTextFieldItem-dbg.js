/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.unified.MenuTextFieldItem.
sap.ui.define(['jquery.sap.global', 'sap/ui/core/ValueStateSupport', './MenuItemBase', './library'],
	function(jQuery, ValueStateSupport, MenuItemBase, library) {
	"use strict";


	
	/**
	 * Constructor for a new MenuTextFieldItem element.
	 *
	 * @param {string} [sId] Id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * Special menu item which contains a label and a text field. This menu item is e.g. helpful for filter implementations.
	 * The aggregation <code>submenu</code> (inherited from parent class) is not supported for this type of menu item.
	 * @extends sap.ui.unified.MenuItemBase
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 * @since 1.21.0
	 *
	 * @constructor
	 * @public
	 * @alias sap.ui.unified.MenuTextFieldItem
	 * @ui5-metamodel This control/element will also be described in the UI5 (legacy) design time meta model
	 */
	var MenuTextFieldItem = MenuItemBase.extend("sap.ui.unified.MenuTextFieldItem", /** @lends sap.ui.unified.MenuTextFieldItem.prototype */ { metadata : {
	
		library : "sap.ui.unified",
		properties : {
	
			/**
			 * Defines the label of the text field of the item.
			 */
			label : {type : "string", group : "Appearance", defaultValue : null},
	
			/**
			 * Defines the icon of the {@link sap.ui.core.IconPool sap.ui.core.IconPool} or an image which should be displayed on the item.
			 */
			icon : {type : "sap.ui.core.URI", group : "Appearance", defaultValue : null},
	
			/**
			 * Defines the value of the text field of the item.
			 */
			value : {type : "string", group : "Misc", defaultValue : null},
	
			/**
			 * Defines the value state of the text field of the item. This allows you to visualize e.g. warnings or errors.
			 */
			valueState : {type : "sap.ui.core.ValueState", group : "Appearance", defaultValue : sap.ui.core.ValueState.None}
		}
	}});
	
	
	(function() {
	
	MenuTextFieldItem.prototype.render = function(oRenderManager, oItem, oMenu, oInfo){
		var rm = oRenderManager,
			bIsEnabled = oMenu.checkEnabled(oItem),
			itemId = oItem.getId();
		
		var sClass = "sapUiMnuItm sapUiMnuTfItm";
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
		
		rm.write("<li ");
		rm.writeAttribute("class", sClass);
		rm.writeElementData(oItem);
		
		// ARIA
		if (oInfo.bAccessible) {
			rm.writeAttribute("role", "menuitem");
			rm.writeAttribute("aria-disabled", !bIsEnabled);
			rm.writeAttribute("aria-posinset", oInfo.iItemNo);
			rm.writeAttribute("aria-setsize", oInfo.iTotalItems);
		}
		
		// Left border
		rm.write("><div class=\"sapUiMnuItmL\"></div>");
		
		// icon/check column 
		rm.write("<div class=\"sapUiMnuItmIco\">");
		if (oItem.getIcon()) {
			rm.writeIcon(oItem.getIcon(), null, {title: null});
		}
		rm.write("</div>");
		
		// Text filed column 
		rm.write("<div id=\"" + itemId + "-txt\" class=\"sapUiMnuItmTxt\">");
		rm.write("<label id=\"" + itemId + "-lbl\" class=\"sapUiMnuTfItemLbl\">");
		rm.writeEscaped(oItem.getLabel() || "");
		rm.write("</label>");
		rm.write("<div id=\"" + itemId + "-str\" class=\"sapUiMnuTfItmStretch\"></div>"); // Helper to strech the width if needed
		rm.write("<div class=\"sapUiMnuTfItemWrppr\">");
		rm.write("<input id=\"" + itemId + "-tf\" tabindex=\"-1\"");
		rm.writeAttributeEscaped("value", oItem.getValue() || "");
		rm.writeAttribute("class", bIsEnabled ? "sapUiMnuTfItemTf sapUiMnuTfItemTfEnbl" : "sapUiMnuTfItemTf sapUiMnuTfItemTfDsbl");
		if (!bIsEnabled) {
			rm.writeAttribute("disabled", "disabled");
		}
		if (oInfo.bAccessible) {
			rm.writeAccessibilityState(oItem, {
				role: "textbox",
				disabled: !bIsEnabled,
				multiline: false,
				autocomplete: "none",
				labelledby: {value: /*oMenu.getId() + "-label " + */itemId + "-lbl", append: true}
			});
		}
		rm.write("></input></div></div>");
		
		// Right border
		rm.write("<div class=\"sapUiMnuItmR\"></div>");
	
		rm.write("</li>");
	};
	
	
	MenuTextFieldItem.prototype.hover = function(bHovered, oMenu){
		this.$().toggleClass("sapUiMnuItmHov", bHovered);
		
		if (bHovered && oMenu.checkEnabled(this)) {
			oMenu.closeSubmenu(false, true);
			this.$("tf").focus();
		}
	};
	
	
	MenuTextFieldItem.prototype.onAfterRendering = function(){
		this._adaptSizes();
		this.setValueState(this.getValueState());
	};
	
	
	//************ Event Handling *************
	
	
	MenuTextFieldItem.prototype.onsapup = function(oEvent){
		this.getParent().focus();
		this.getParent().onsapprevious(oEvent);
	};
	
	
	MenuTextFieldItem.prototype.onsapdown = function(oEvent){
		this.getParent().focus();
		this.getParent().onsapnext(oEvent);
	};
	
	
	MenuTextFieldItem.prototype.onsaphome = function(oEvent){
		if (this._checkCursorPosForNav(false)) {
			this.getParent().focus();
			this.getParent().onsaphome(oEvent);
		}
	};
	
	
	MenuTextFieldItem.prototype.onsapend = function(oEvent){
		if (this._checkCursorPosForNav(true)) {
			this.getParent().focus();
			this.getParent().onsapend(oEvent);
		}
	};
	
	
	MenuTextFieldItem.prototype.onsappageup = function(oEvent){
		this.getParent().focus();
		this.getParent().onsappageup(oEvent);
	};
	
	
	MenuTextFieldItem.prototype.onsappagedown = function(oEvent){
		this.getParent().focus();
		this.getParent().onsappagedown(oEvent);
	};
	
	
	MenuTextFieldItem.prototype.onsapescape = function(oEvent){
		this.getParent().onsapescape(oEvent);
	};
	
	
	MenuTextFieldItem.prototype.onkeydown = function(oEvent){
		oEvent.stopPropagation(); //Avoid bubbling key events to the Menu -> Events are only selectively forwarded
	};
	
	
	MenuTextFieldItem.prototype.onclick = function(oEvent){
		this.getParent().closeSubmenu(false, true);
		if (!sap.ui.Device.system.desktop && this.getParent().checkEnabled(this)) {
			this.focus();
		}
		oEvent.stopPropagation();
	};
	
	
	MenuTextFieldItem.prototype.onsapenter = function(oEvent){
		var sValue = this.$("tf").val();
		this.setValue(sValue);
		this.getParent().selectItem(this);
		oEvent.preventDefault();
		oEvent.stopPropagation();
	};
	
	
	// ************ Overridden API functions *************
	
	/**
	 * The aggregation <code>submenu</code> (inherited from parent class) is not supported for this type of menu item.
	 * 
	 * @return {sap.ui.unified.Menu}
	 * @public
	 * @name sap.ui.unified.MenuTextFieldItem#getSubmenu
	 * @deprecated The aggregation <code>submenu</code> (inherited from parent class) is not supported for this type of menu item.
	 * @function
	 */
	 
	/**
	 * The aggregation <code>submenu</code> (inherited from parent class) is not supported for this type of menu item.
	 * 
	 * @return {sap.ui.unified.MenuTextFieldItem} <code>this</code> to allow method chaining
	 * @public
	 * @name sap.ui.unified.MenuTextFieldItem#destroySubmenu
	 * @deprecated The aggregation <code>submenu</code> (inherited from parent class) is not supported for this type of menu item.
	 * @function
	 */
	
	/**
	 * The aggregation <code>submenu</code> (inherited from parent class) is not supported for this type of menu item.
	 * 
	 * @param {sap.ui.unified.Menu} oSubmenu
	 * @return {sap.ui.unified.MenuTextFieldItem} <code>this</code> to allow method chaining
	 * @public
	 * @deprecated The aggregation <code>submenu</code> (inherited from parent class) is not supported for this type of menu item.
	 */
	MenuTextFieldItem.prototype.setSubmenu = function(oMenu){
		jQuery.sap.log.warning("The aggregation 'submenu' is not supported for this type of menu item.", "", "sap.ui.unified.MenuTextFieldItem");
		return this;
	};
	
	
	MenuTextFieldItem.prototype.setLabel = function(sLabel){
		this.setProperty("label", sLabel, true);
		this.$("lbl").text(sLabel);
		this._adaptSizes();
		return this;
	};
	
	
	MenuTextFieldItem.prototype.setValue = function(sValue){
		this.setProperty("value", sValue, true);
		this.$("tf").val(sValue);
		//this._adaptSizes();
		return this;
	};
	
	
	MenuTextFieldItem.prototype.setValueState = function(sValueState){
		this.setProperty("valueState", sValueState, true);
		var $tf = this.$("tf");
		$tf.toggleClass("sapUiMnuTfItemTfErr", sValueState == sap.ui.core.ValueState.Error);
		$tf.toggleClass("sapUiMnuTfItemTfWarn", sValueState == sap.ui.core.ValueState.Warning);
		var sTooltip = ValueStateSupport.enrichTooltip(this, this.getTooltip_AsString());
		this.$().attr("title", sTooltip ? sTooltip : "");
		return this;
	};
	
	
	//************ Private Helpers *************
	
	
	MenuTextFieldItem.prototype.getFocusDomRef = function () {
		var $FocusRef = this.$("tf");
		return $FocusRef.length ? $FocusRef.get(0) : null;
	};
	
	
	MenuTextFieldItem.prototype._adaptSizes = function(){
		var $tf = this.$("tf");
		var $lbl = this.$("lbl");
		var offsetLeft = $lbl.length ? $lbl.get(0).offsetLeft : 0;
		
		if (sap.ui.getCore().getConfiguration().getRTL()) {
			$tf.parent().css({"width": "auto", "right": (this.$().outerWidth(true) - offsetLeft + ($lbl.outerWidth(true) - $lbl.outerWidth())) + "px"});
		} else {
			$tf.parent().css({"width": "auto", "left": (offsetLeft + $lbl.outerWidth(true)) + "px"});
		}
	};
	
	
	MenuTextFieldItem.prototype._checkCursorPosForNav = function(bForward) {
		var bRtl = sap.ui.getCore().getConfiguration().getRTL();
		var bBack = bForward ? bRtl : !bRtl;
		var $input = this.$("tf");
		var iPos = $input.cursorPos();
		var iLen = $input.val().length;
		if (bRtl) {
			iPos = iLen - iPos;
		}
		if ((!bBack && iPos != iLen) || (bBack && iPos != 0)) {
			return false;
		}
		return true;
	};
	
	
	}());
	

	return MenuTextFieldItem;

}, /* bExport= */ true);
