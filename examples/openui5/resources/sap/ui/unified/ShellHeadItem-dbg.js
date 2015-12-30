/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.unified.ShellHeadItem.
sap.ui.define(['jquery.sap.global', 'sap/ui/core/Element', 'sap/ui/core/IconPool', './library'],
	function(jQuery, Element, IconPool, library) {
	"use strict";


	
	/**
	 * Constructor for a new ShellHeadItem.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * Header Action item of the Shell.
	 * @extends sap.ui.core.Element
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @since 1.15.1
	 * @alias sap.ui.unified.ShellHeadItem
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var ShellHeadItem = Element.extend("sap.ui.unified.ShellHeadItem", /** @lends sap.ui.unified.ShellHeadItem.prototype */ { metadata : {
	
		library : "sap.ui.unified",
		properties : {
	
			/**
			 * If set to true, a divider is displayed before the item.
			 * @deprecated Since version 1.18. 
			 * Dividers are not supported anymore.
			 */
			startsSection : {type : "boolean", group : "Appearance", defaultValue : false, deprecated: true},
	
			/**
			 * If set to true, a separator is displayed after the item.
			 * @since 1.22.5
			 */
			showSeparator : {type : "boolean", group : "Appearance", defaultValue : true},
	
			/**
			 * If set to true, the item gets a special design.
			 */
			selected : {type : "boolean", group : "Appearance", defaultValue : false},
	
			/**
			 * If set to true, a theme dependent marker is shown on the item.
			 * @deprecated Since version 1.18. 
			 * Markers should not be used anymore.
			 */
			showMarker : {type : "boolean", group : "Appearance", defaultValue : false, deprecated: true},
	
			/**
			 * The icon of the item, either defined in the sap.ui.core.IconPool or an URI to a custom image. An icon must be set.
			 */
			icon : {type : "sap.ui.core.URI", group : "Appearance", defaultValue : null},
	
			/**
			 * Invisible items are not shown on the UI.
			 * @since 1.18
			 */
			visible : {type : "boolean", group : "Appearance", defaultValue : true}
		},
		associations : {
			/**
			 * Association to controls / ids which label this control (see WAI-ARIA attribute aria-labelledby).
			 */
			ariaLabelledBy : {type : "sap.ui.core.Control", multiple : true, singularName : "ariaLabelledBy"}
		},
		events : {
	
			/**
			 * Event is fired when the user presses the item.
			 */
			press : {}
		}
	}});
	
	ShellHeadItem.prototype.onclick = function(oEvent){
		this.firePress();
		// IE always interprets a click on an anker as navigation and thus triggers the 
		// beforeunload-event on the window. Since a ShellHeadItem never has a valid href-attribute,
		// the default behavior should never be triggered
		oEvent.preventDefault();
	};
	
	ShellHeadItem.prototype.onsapspace = ShellHeadItem.prototype.onclick;
	
	
	ShellHeadItem.prototype.setStartsSection = function(bStartsSection){
		bStartsSection = !!bStartsSection;
		this.setProperty("startsSection", bStartsSection, true);
		this.$().toggleClass("sapUiUfdShellHeadItmDelim", bStartsSection);
		return this;
	};
	
	
	ShellHeadItem.prototype.setShowSeparator = function(bShowSeparator){
		bShowSeparator = !!bShowSeparator;
		this.setProperty("showSeparator", bShowSeparator, true);
		this.$().toggleClass("sapUiUfdShellHeadItmSep", bShowSeparator);
		return this;
	};
	
	
	ShellHeadItem.prototype.setSelected = function(bSelected){
		bSelected = !!bSelected;
		this.setProperty("selected", bSelected, true);
		this.$().toggleClass("sapUiUfdShellHeadItmSel", bSelected);
		this.$().attr("aria-pressed", bSelected);
		return this;
	};
	
	
	ShellHeadItem.prototype.setVisible = function(bVisible){
		this.setProperty("visible", !!bVisible); // Suppress Rerendering handled by Shell
		return this;
	};
	
	
	ShellHeadItem.prototype.setShowMarker = function(bMarker){
		bMarker = !!bMarker;
		this.setProperty("showMarker", bMarker, true);
		this.$().toggleClass("sapUiUfdShellHeadItmMark", bMarker);
		return this;
	};
	
	
	ShellHeadItem.prototype.setIcon = function(sIcon){
		this.setProperty("icon", sIcon, true);
		if (this.getDomRef()) {
			this._refreshIcon();
		}
		return this;
	};
	
	
	ShellHeadItem.prototype._refreshIcon = function(){
		var $Ico = jQuery(this.$().children()[0]);
		var sIco = this.getIcon();
		if (IconPool.isIconURI(sIco)) {
			var oIconInfo = IconPool.getIconInfo(sIco);
			$Ico.html("").css("style", "");
			if (oIconInfo) {
				$Ico.text(oIconInfo.content).attr("role", "presentation").attr("aria-label", oIconInfo.text || oIconInfo.name).css("font-family", "'" + oIconInfo.fontFamily + "'");
			}
		} else {
			var $Image = this.$("img-inner");
			if ($Image.length == 0 || $Image.attr("src") != sIco) {
				$Ico.css("style", "").attr("aria-label", null).html("<img role='presentation' id='" + this.getId() + "-img-inner' src='" + jQuery.sap.encodeHTML(sIco) + "'></img>");
			}
		}
	};

	return ShellHeadItem;

}, /* bExport= */ true);
