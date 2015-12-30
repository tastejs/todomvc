/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(['jquery.sap.global', './library'],
	function(jQuery, library) {
	"use strict";


	var ShellHeader = sap.ui.core.Control.extend("sap.ui.unified.ShellHeader", {
		
		metadata: {
			properties: {
				logo: {type: "sap.ui.core.URI", defaultValue: ""},
				searchVisible: {type: "boolean", defaultValue: true}
			},
			aggregations: {
				headItems: {type: "sap.ui.unified.ShellHeadItem", multiple: true},
				headEndItems: {type: "sap.ui.unified.ShellHeadItem", multiple: true},
				search: {type: "sap.ui.core.Control", multiple: false},
				user: {type: "sap.ui.unified.ShellHeadUserItem", multiple: false}
			}
		},
		
		renderer: {
			render: function(rm, oHeader){
				var id = oHeader.getId();
				
				rm.write("<div");
				rm.writeControlData(oHeader);
				rm.writeAttribute("class", "sapUiUfdShellHeader");
				if (sap.ui.getCore().getConfiguration().getAccessibility()) {
					rm.writeAttribute("role", "toolbar");
				}
				rm.write(">");
				
				rm.write("<div id='", id, "-hdr-begin' class='sapUiUfdShellHeadBegin'>");
				this.renderHeaderItems(rm, oHeader, true);
				rm.write("</div>");
				
				rm.write("<div id='", id, "-hdr-center' class='sapUiUfdShellHeadCenter'>");
				this.renderSearch(rm, oHeader);
				rm.write("</div>");
				
				rm.write("<div id='", id, "-hdr-end' class='sapUiUfdShellHeadEnd'>");
				this.renderHeaderItems(rm, oHeader, false);
				rm.write("</div>");
				
				rm.write("</div>");
			},
			
			renderSearch: function(rm, oHeader) {
				var oSearch = oHeader.getSearch();
				rm.write("<div id='", oHeader.getId(), "-hdr-search'");
				if (sap.ui.getCore().getConfiguration().getAccessibility()) {
					rm.writeAttribute("role", "search");
				}
				rm.writeAttribute("class", "sapUiUfdShellSearch" + (oHeader.getSearchVisible() ? "" : " sapUiUfdShellHidden"));
				rm.write("><div>");
				if (oSearch) {
					rm.renderControl(oSearch);
				}
				rm.write("</div></div>");
			},
			
			renderHeaderItems: function(rm, oHeader, begin) {
				rm.write("<div class='sapUiUfdShellHeadContainer'>");
				var aItems = begin ? oHeader.getHeadItems() : oHeader.getHeadEndItems();
				
				for (var i = 0; i < aItems.length; i++) {
					rm.write("<a tabindex='0' href='javascript:void(0);'");
					rm.writeElementData(aItems[i]);
					rm.addClass("sapUiUfdShellHeadItm");
					if (aItems[i].getStartsSection()) {
						rm.addClass("sapUiUfdShellHeadItmDelim");
					}
					if (aItems[i].getShowSeparator()) {
						rm.addClass("sapUiUfdShellHeadItmSep");
					}
					if (!aItems[i].getVisible()) {
						rm.addClass("sapUiUfdShellHidden");
					}
					if (aItems[i].getSelected()) {
						rm.addClass("sapUiUfdShellHeadItmSel");
					}
					if (aItems[i].getShowMarker()) {
						rm.addClass("sapUiUfdShellHeadItmMark");
					}
					rm.writeClasses();
					var tooltip = aItems[i].getTooltip_AsString();
					if (tooltip) {
						rm.writeAttributeEscaped("title", tooltip);
					}
					if (sap.ui.getCore().getConfiguration().getAccessibility()) {
						rm.writeAccessibilityState(aItems[i], {
							role: "button",
							selected: null,
							pressed: aItems[i].getSelected()
						});
					}
					rm.write("><span></span><div class='sapUiUfdShellHeadItmMarker'><div></div></div></a>");
				}
				
				var oUser = oHeader.getUser();
				if (!begin && oUser) {
					rm.write("<a tabindex='0' href='javascript:void(0);'");
					rm.writeElementData(oUser);
					rm.addClass("sapUiUfdShellHeadUsrItm");
					if (!oUser.getShowPopupIndicator()) {
						rm.addClass("sapUiUfdShellHeadUsrItmWithoutPopup");
					}
					rm.writeClasses();
					var tooltip = oUser.getTooltip_AsString();
					if (tooltip) {
						rm.writeAttributeEscaped("title", tooltip);
					}
					if (sap.ui.getCore().getConfiguration().getAccessibility()) {
						rm.writeAccessibilityState(oUser, {
							role: "button"
						});
						if (oUser.getShowPopupIndicator()) {
							rm.writeAttribute("aria-haspopup", "true");
						}
					}
					
					rm.write("><span id='", oUser.getId(), "-img' aria-hidden='true' class='sapUiUfdShellHeadUsrItmImg'></span>");
					rm.write("<span id='" + oUser.getId() + "-name' class='sapUiUfdShellHeadUsrItmName'");
					var sUserName = oUser.getUsername() || "";
					rm.writeAttributeEscaped("title", sUserName);
					rm.write(">");
					rm.writeEscaped(sUserName);
					rm.write("</span><span class='sapUiUfdShellHeadUsrItmExp' aria-hidden='true'></span></a>");
				}
				
				rm.write("</div>");
				if (begin) {
					this._renderLogo(rm, oHeader);
				}
			},
			
			_renderLogo: function(rm, oHeader) {
				var rb = sap.ui.getCore().getLibraryResourceBundle("sap.ui.unified"),
					sLogoTooltip = rb.getText("SHELL_LOGO_TOOLTIP"),
					sIco = oHeader._getLogo();
				
				rm.write("<div class='sapUiUfdShellIco'>");
				rm.write("<img id='", oHeader.getId(), "-icon'");
				rm.writeAttributeEscaped("title", sLogoTooltip);
				rm.writeAttributeEscaped("alt", sLogoTooltip);
				rm.write("src='");
				rm.writeEscaped(sIco);
				rm.write("' style='", sIco ? "" : "display:none;","'></img>");
				rm.write("</div>");
			}
		}
		
	});
	
	
	ShellHeader.prototype.init = function(){
		var that = this;
		
		this._rtl = sap.ui.getCore().getConfiguration().getRTL();
		
		this._handleMediaChange = function(mParams){
			if (!that.getDomRef()) {
				return;
			}
			that._refresh();
		};
		sap.ui.Device.media.attachHandler(this._handleMediaChange, this, sap.ui.Device.media.RANGESETS.SAP_STANDARD);
		
		this._handleResizeChange = function(mParams){
			if (!that.getDomRef() || !that.getUser()) {
				return;
			}
			
			var oUser = this.getUser();
			var bChanged = oUser._checkAndAdaptWidth(!that.$("hdr-search").hasClass("sapUiUfdShellHidden") && !!that.getSearch());
			if (bChanged) {
				that._refresh();
			}
		};
		sap.ui.Device.resize.attachHandler(this._handleResizeChange, this);
		
		this.data("sap-ui-fastnavgroup", "true", true); // Define group for F6 handling
	};
	
	ShellHeader.prototype.exit = function(){
		sap.ui.Device.media.detachHandler(this._handleMediaChange, this, sap.ui.Device.media.RANGESETS.SAP_STANDARD);
		delete this._handleMediaChange;
		sap.ui.Device.resize.detachHandler(this._handleResizeChange, this);
		delete this._handleResizeChange;
	};
	
	ShellHeader.prototype.onAfterRendering = function(){
		this._refresh();
		this.$("hdr-center").toggleClass("sapUiUfdShellAnim", !this._noHeadCenterAnim);
	};
	
	ShellHeader.prototype.onThemeChanged = function(){
		if (this.getDomRef()) {
			this.invalidate();
		}
	};
	
	ShellHeader.prototype._getLogo = function(){
		var ico = this.getLogo();
		if (!ico) {
			jQuery.sap.require("sap.ui.core.theming.Parameters");
			ico = sap.ui.core.theming.Parameters._getThemeImage(null, true); // theme logo
		}
		return ico;
	};
	
	ShellHeader.prototype._refresh = function(){
		function updateItems(aItems){
			for (var i = 0; i < aItems.length; i++) {
				aItems[i]._refreshIcon();
			}
		}
		
		updateItems(this.getHeadItems());
		updateItems(this.getHeadEndItems());
		
		var oUser = this.getUser(),
			isPhoneSize = jQuery("html").hasClass("sapUiMedia-Std-Phone"),
			searchVisible = !this.$("hdr-search").hasClass("sapUiUfdShellHidden"),
			$logo = this.$("icon");
		
		if (oUser) {
			oUser._refreshImage();
			oUser._checkAndAdaptWidth(searchVisible && !!this.getSearch());
		}
		
		$logo.parent().toggleClass("sapUiUfdShellHidden", isPhoneSize && searchVisible && !!this.getSearch());
		
		var	we = this.$("hdr-end").outerWidth(),
			wb = this.$("hdr-begin").outerWidth(),
			wmax = Math.max(we, wb),
			begin = (isPhoneSize && searchVisible ? wb : wmax) + "px",
			end = (isPhoneSize && searchVisible ? we : wmax) + "px";
	
		this.$("hdr-center").css({
			"left": this._rtl ? end : begin,
			"right": this._rtl ? begin : end
		});
	};

	return ShellHeader;

}, /* bExport= */ true);
