/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides the class sap.ui.ux3.ShellPersonalization
sap.ui.define(['jquery.sap.global', 'sap/ui/base/EventProvider', 'sap/ui/commons/Button', 'sap/ui/commons/Dialog'],
	function(jQuery, EventProvider, Button, Dialog) {
	"use strict";


	
	
	/**
	 * Experimental implementation of visual Ux3 Shell personalization / branding.
	 *
	 * DO NOT USE PRODUCTIVELY!!!
	 *
	 *
	 * Being completely non-generic as of now, this is supposed to facilitate discussions with Ux
	 * about the personalization capabilities. Once that concept is more final, we can go for a cleaner implementation,
	 * considering the number of configurable properties etc.
	 *
	 * @param oShell
	 * @public
	 * @experimental Since 1.0. The Shell-features Personalization, Color Picker and “Inspect”-Tool are only experimental work and might change or disappear in future versions.
	 * @alias sap.ui.ux3.ShellPersonalization
	 */
	var ShellPersonalization = EventProvider.extend("sap.ui.ux3.ShellPersonalization", {
		constructor: function(oShell) {
			EventProvider.apply(this);
			this.shell = oShell;
		
			this.oSettings = {}; // TODO: read user config from somewhere/server/app
		}
	});
	
	/**
	 * Makes the personalization use the given settings.
	 *
	 * @param {object} oSettings
	 * @public
	 */
	ShellPersonalization.prototype.initializeSettings = function(oSettings) {
		this.oSettings = jQuery.extend({}, oSettings);
		if (this.shell.getDomRef()) {
			this.applySettings(oSettings);
		}
	};
	
	
	
	/*  EVENT HANDLING */
	
	ShellPersonalization.M_EVENTS = {personalizationChange: "personalizationChange"};
	
	ShellPersonalization.prototype.attachPersonalizationChange = function(fFunction, oListener) {
		this.attachEvent(ShellPersonalization.M_EVENTS.personalizationChange, fFunction, oListener);
	};
	
	ShellPersonalization.prototype.detachPersonalizationChange = function(fFunction, oListener) {
		this.detachEvent(ShellPersonalization.M_EVENTS.personalizationChange, fFunction, oListener);
	};
	
	ShellPersonalization.prototype.firePersonalizationChange = function(mParameters) {
		this.fireEvent(ShellPersonalization.M_EVENTS.personalizationChange, mParameters);
	};
	
	
	
	/**
	 * The default settings
	 */
	ShellPersonalization.ORIGINAL_SETTINGS = {
			bByDStyle: false,
	
			sBgColor: "rgb(17,17,17)",
			sBgCssImg: null, // updated later
			sBgImgSrc: null,
			sBgImgPos: "tile",
			fBgImgOpacity: 1,
	
			fSidebarOpacity: 1,
			sLineColor:"rgb(239,170,0)",
	
			sLogoImageSrc: null,
			sLogoAlign: "left",
			bUseLogoSize: false
	};
	
	ShellPersonalization.TRANSPARENT_1x1 = sap.ui.resource('sap.ui.core', 'themes/base/img/1x1.gif');
	
	ShellPersonalization.IMAGE_FOLDER_PATH = jQuery.sap.getModulePath("sap.ui.ux3.themes." + sap.ui.getCore().getConfiguration().getTheme(), "/img/shell/");
	
	ShellPersonalization.getOriginalSettings = function() {
		// buffer the settings
		if (!ShellPersonalization._bOriginalSettingsInitialized) {
			ShellPersonalization._bOriginalSettingsInitialized = true;
			
			jQuery.sap.require("sap.ui.core.theming.Parameters");
			var mAllParameters = sap.ui.core.theming.Parameters.get();
			var gradientTop = mAllParameters["sap.ui.ux3.Shell:sapUiUx3ShellGradientTop"];
			var gradientBottom = mAllParameters["sap.ui.ux3.Shell:sapUiUx3ShellGradientBottom"];
	
			if (!!sap.ui.Device.browser.firefox) {
				ShellPersonalization.ORIGINAL_SETTINGS.sBgCssImg = "-moz-linear-gradient(top, " + gradientTop + " 0, " + gradientBottom + " 108px, " + gradientBottom + ")";
			} else if (!!sap.ui.Device.browser.internet_explorer) {
				if (sap.ui.Device.browser.version == 7 || sap.ui.Device.browser.version == 8 || sap.ui.Device.browser.version == 9) {
					ShellPersonalization.ORIGINAL_SETTINGS.sBgCssImg = "url("
						+ ShellPersonalization.IMAGE_FOLDER_PATH
						+ "Workset_bg.png)";
				} else { // IE10+
					ShellPersonalization.ORIGINAL_SETTINGS.sBgCssImg = "-ms-linear-gradient(top, " + gradientTop + " 0, " + gradientBottom + " 108px, " + gradientBottom + ")";
				}
			} else if (!!sap.ui.Device.browser.webkit) {
				ShellPersonalization.ORIGINAL_SETTINGS.sBgCssImg = "-webkit-linear-gradient(top, " + gradientTop + " 0, " + gradientBottom + " 108px, " + gradientBottom + ")";
			}
		}
		
		return ShellPersonalization.ORIGINAL_SETTINGS;
	};
	
	
	
	/**
	 * Returns whether there are any personalization changes
	 *
	 * @returns {boolean}
	 * @public
	 */
	ShellPersonalization.prototype.hasChanges = function() {
		var iSettings = 0;
		/* eslint-disable no-unused-vars */
		/* Needed for counting object keys since IE8 does not support Object.keys(this.oSettings).length */
		for (var key in this.oSettings) {
			iSettings++;
		}
		/* eslint-enable no-unused-vars */
		return (iSettings > 0);
	};
	
	
	/**
	 * Applies the given personalization settings to the DOM.
	 *
	 * @param oSettings
	 */
	ShellPersonalization.prototype.applySettings = function(oSettings) {
		// copy fallback settings and mix in the given settings
		var oActualSettings = jQuery.extend({}, ShellPersonalization.getOriginalSettings());
		oActualSettings = jQuery.extend(oActualSettings, oSettings);
	
		// apply the settings
		this.applyByDStyle(oActualSettings.bByDStyle);
	
		this.applyBgColor(oActualSettings.sBgColor);
		this.applyBgImage(oActualSettings.sBgCssImg, oActualSettings.sBgImgSrc);
	
	
		// TODO: bgImgPos
		this.applyBgImageOpacity(oActualSettings.fBgImgOpacity);
	
		if (oActualSettings.sHeaderImageSrc) {
			this.applyHeaderImage(oActualSettings.sHeaderImageSrc);
		} else {
			this.shell.getDomRef("hdr").style.backgroundImage = "";
		}
		this.applySidebarOpacity(oActualSettings.fSidebarOpacity);
	
		this.applyBgColor(oActualSettings.sBgColor);
		this.applyLineColor(oActualSettings.sLineColor);
	
		this.applyLogoImage(oActualSettings.sLogoImageSrc);
		this.applyLogoAlign(oActualSettings.sLogoAlign);
		this.applyUseLogoSize(oActualSettings.bUseLogoSize);
	};
	
	
	/**
	 * Opens the personalization Dialog. This can be called from wherever the application wants to offer branding changes.
	 *
	 * @public
	 */
	ShellPersonalization.prototype.openDialog = function() {
		if (this.oDialog && this._getDialog().isOpen()) {
			return;
		} // first check is important because if !this.oDialog, the getter builds the Dialog and relies on the existence of this.oSettings!
																// but on the other hand, this.oSettings must not be initialized when the Dialog is already open
		this.oTransientSettings = jQuery.extend({}, this.oSettings);
	
		this._getDialog().open();
	
		// drag&drop for images with local file API
		this._bindDragAndDrop("bg");
		this._bindDragAndDrop("hdr");
		this._bindDragAndDrop("logo");
	};
	
	
	ShellPersonalization.prototype.getTransientSettingsWithDefaults = function() {
		return jQuery.extend(jQuery.extend({}, ShellPersonalization.getOriginalSettings()), this.oTransientSettings);
	};
	
	
	ShellPersonalization.prototype._bindDragAndDrop = function(sPrefix) {
		if (window.FileReader) {
			var sId = this.shell.getId() + "-p13n_";
			jQuery.sap.byId(sId + sPrefix + "ImageImg")
				.bind('dragover', jQuery.proxy(this._handleDragover, this))
				.bind('dragend',jQuery.proxy(this._handleDragend, this))
				.bind('drop', jQuery.proxy(this._handleDrop, this));
			jQuery.sap.byId(sId + sPrefix + "ImageHolder")
				.bind('dragover', jQuery.proxy(this._handleDragover, this))
				.bind('dragend',jQuery.proxy(this._handleDragend, this))
				.bind('drop', jQuery.proxy(this._handleDrop, this));
		}
	};
	ShellPersonalization.prototype._unbindDragAndDrop = function(sPrefix) {
		if (window.FileReader) {
			var sId = this.shell.getId() + "-p13n_";
			jQuery.sap.byId(sId + "hdrImageImg")
				.unbind('dragover', this._handleDragover)
				.unbind('dragend', this._handleDragend)
				.unbind('drop', this._handleDrop);
			jQuery.sap.byId(sId + "hdrImageHolder")
				.unbind('dragover', this._handleDragover)
				.unbind('dragend', this._handleDragend)
				.unbind('drop', this._handleDrop);
		}
	};
	
	
	/**
	 * Returns and - if necessary - constructs the Dialog
	 *
	 * @returns {sap.ui.commons.Dialog}
	 */
	ShellPersonalization.prototype._getDialog = function() {
		if (!this.oDialog) {
			jQuery.sap.require("sap.ui.ux3.ShellColorPicker");
	
			var sId = this.shell.getId() + "-p13n_";
			var oSettingsWithDefaults = jQuery.extend(jQuery.extend({}, ShellPersonalization.getOriginalSettings()), this.oSettings);
			var c = sap.ui.commons;
			var that = this;
	
	
			/* build the Dialog */
	
			var d = new c.Dialog({title:"Shell Personalization",width:"544px",height:"560px",showCloseButton:false,resizable:false,closed:[function(){
				// drag&drop for images with local file API
				this._unbindDragAndDrop("bg");
				this._unbindDragAndDrop("hdr");
				this._unbindDragAndDrop("logo");
				this.oTransientSettings = null;
			},this]}).addStyleClass("sapUiUx3ShellP13n");
	
	
			/* build the tabstrip */
	
			var tabs = new c.TabStrip({width:"100%",height:"100%",select:jQuery.proxy(function(oParams){
				var oControl = sap.ui.getCore().byId(oParams.getParameter("id"));
				if (oControl) {
					var index = oParams.getParameter("index");
					oControl.setSelectedIndex(index);
					var that = this;
					if (index == 0) {
						// apply the current settings to the plain HTML parts
						window.setTimeout(function(){that.shell.$("bgColor").css("background-color", that.getTransientSettingsWithDefaults().sBgColor);},1);
	
						// bind the drop event handlers
						window.setTimeout(jQuery.proxy(function(){
							this._bindDragAndDrop("bg");
						}, this), 0);
	
					} else if (index == 1) {
						// apply the current settings to the plain HTML parts
						window.setTimeout(function(){that.shell.$("lineColor").css("background-color", that.getTransientSettingsWithDefaults().sLineColor);},1);
	
						// bind the drop event handlers
						window.setTimeout(jQuery.proxy(function(){
							this._bindDragAndDrop("hdr");
						}, this), 0);
	
					} else if (index == 2) {
						// bind the drop event handlers
						window.setTimeout(jQuery.proxy(function(){
							this._bindDragAndDrop("logo");
						}, this), 0);
					}
				}
			}, this)});
	
	
			/* build the first tab */
	
			this.oBgImgHtml = new sap.ui.core.HTML(sId + "bgImageHolder", {
				preferDOM:true,
				content:"<div id='" + sId + "bgImageHolder' class='sapUiUx3ShellP13nImgHolder'><img id='" + sId + "bgImageImg' src='"
				+ (this.oTransientSettings.sBackgroundImageSrc ? this.oTransientSettings.sBackgroundImageSrc : sap.ui.resource('sap.ui.core', 'themes/base/img/1x1.gif')) + "'/></div>"}
			);
	
			this.oBgImgOpacitySlider = new c.Slider({
				value:(this.oTransientSettings.fBgImgOpacity !== undefined ? 100 - this.oTransientSettings.fBgImgOpacity * 100 : 100 - ShellPersonalization.getOriginalSettings().fBgImgOpacity * 100),
				liveChange:jQuery.proxy(this._handleBgImageOpacitySliderChange,this)
			});
			this.oSidebarOpacitySlider = new c.Slider({
				value:(this.oTransientSettings.fSidebarOpacity !== undefined ? 100 - this.oTransientSettings.fSidebarOpacity * 100 : 100 - ShellPersonalization.getOriginalSettings().fSidebarOpacity * 100),
				liveChange:jQuery.proxy(this._handleSidebarOpacitySliderChange,this)
			});
	
			this.oBgColorPicker = new sap.ui.ux3.ShellColorPicker(sId + "bgColorPicker");
			this.oBgColorPicker.attachLiveChange(function(oEvent){
				that._handleBgColorChange(oEvent);
			});
			var oBgColorBtn = new c.Button({text:"Change..."});
			var that = this;
			oBgColorBtn.attachPress(function(){
				if (!that.oBgColorPicker.isOpen()) {
					that.oBgColorPicker.open(sap.ui.ux3.ShellColorPicker.parseCssRgbString(that.getTransientSettingsWithDefaults().sBgColor), sap.ui.core.Popup.Dock.BeginTop, sap.ui.core.Popup.Dock.BeginBottom, that.shell.getDomRef("bgColor"));
				}
			});
			this.oBgPreviewHtml = new sap.ui.core.HTML({preferDom:true,content:"<div id='" + this.shell.getId() + "-bgColor' style='background-color:" + oSettingsWithDefaults.sBgColor + "' class='sapUiUx3ShellColorPickerPreview'></div>"});
	
			var oBgTab = new sap.ui.commons.Tab().setText("Background").addContent(new c.layout.MatrixLayout({layoutFixed:false})
				.createRow(new c.Label({text:"Background Image:"}), this.oBgImgHtml)
				.createRow(new c.Label({text:"Image Transparency:"}), this.oBgImgOpacitySlider)
				.createRow(new c.Label({text:"Background Color:"}), new c.layout.MatrixLayoutCell().addContent(this.oBgPreviewHtml).addContent(oBgColorBtn))
				.createRow(null)
				.createRow(new c.Label({text:"Sidebar Transparency:"}), this.oSidebarOpacitySlider)
			);
			tabs.addTab(oBgTab);
	
	
			/* build the second tab */
	
			this.oByDStyleCb = new c.CheckBox({text:"ByDesign-style Header Bar",checked:this.oTransientSettings.bByDStyle,change:jQuery.proxy(this._handleByDStyleChange,this)});
			this.oHdrImgHtml = new sap.ui.core.HTML(sId + "hdrImageHolder", {
				preferDOM:true,
				content:"<div id='" + sId + "hdrImageHolder' class='sapUiUx3ShellP13nImgHolder'><img id='" + sId + "hdrImageImg' src='"
				+ (this.oTransientSettings.sHeaderImageSrc ? this.oTransientSettings.sHeaderImageSrc : sap.ui.resource('sap.ui.core', 'themes/base/img/1x1.gif')) + "'/></div>"}
			);
	
			this.oLineColorPicker = new sap.ui.ux3.ShellColorPicker(sId + "lineColorPicker");
			this.oLineColorPicker.attachLiveChange(function(oEvent){
				that._handleLineColorChange(oEvent);
			});
			var oLineColorBtn = new c.Button({text:"Change..."});
			var that = this;
			oLineColorBtn.attachPress(function(){
				if (!that.oLineColorPicker.isOpen()) {
					that.oLineColorPicker.open(sap.ui.ux3.ShellColorPicker.parseCssRgbString(that.getTransientSettingsWithDefaults().sLineColor), sap.ui.core.Popup.Dock.BeginTop, sap.ui.core.Popup.Dock.BeginBottom, that.shell.getDomRef("lineColor"));
				}
			});
			this.oLinePreviewHtml = new sap.ui.core.HTML({preferDom:true,content:"<div id='" + this.shell.getId() + "-lineColor' style='background-color:" + oSettingsWithDefaults.sLineColor + "' class='sapUiUx3ShellColorPickerPreview'></div>"});
	
			var oHdrTab = new sap.ui.commons.Tab().setText("Header Bar").addContent(new c.layout.MatrixLayout({layoutFixed:false})
				//.createRow(this.oByDStyleCb)
				.createRow(new c.Label({text:"Line Color (ByD-style only):"}), new c.layout.MatrixLayoutCell().addContent(this.oLinePreviewHtml).addContent(oLineColorBtn))
				.createRow(null)
				.createRow(new c.Label({text:"Header Image:"}),	this.oHdrImgHtml)
			);
			tabs.addTab(oHdrTab);
	
	
			/* build the third tab */
	
			this.oLogoImgHtml = new sap.ui.core.HTML(sId + "logoImageHolder", {
				preferDOM:true,
				content:"<div id='" + sId + "logoImageHolder' class='sapUiUx3ShellP13nImgHolder'><img id='" + sId + "logoImageImg' src='"
				+ (this.oTransientSettings.sLogoImageSrc ? this.oTransientSettings.sLogoImageSrc : sap.ui.resource('sap.ui.core', 'themes/base/img/1x1.gif')) + "'/></div>"}
			);
			this.oLogoRbg = new c.RadioButtonGroup()
				.addItem(new sap.ui.core.Item({text:"Left",key:"left"}))
				.addItem(new sap.ui.core.Item({text:"Center",key:"center"}))
				.attachSelect(this._handleLogoAlignChange, this);
			this.oUseLogoSizeCb = new c.CheckBox({text:"Use original image size",checked:this.oTransientSettings.bUseLogoSize,change:jQuery.proxy(this._handleUseLogoSizeChange,this)});
			var oLogoTab = new sap.ui.commons.Tab().setText("Logo").addContent(new c.layout.MatrixLayout({layoutFixed:false})
				.createRow(new c.Label({text:"Logo Image:"}), this.oLogoImgHtml)
				.createRow(new c.Label({text:"Position:"}), this.oLogoRbg)
				.createRow(this.oUseLogoSizeCb)
			);
			tabs.addTab(oLogoTab);
			d.addContent(tabs);
	
	
			/* finish building the Dialog */
	
			var that = this;
			d.addButton(new c.Button({text:"Reset All",press:function(){
				that.applySettings(jQuery.extend({}, ShellPersonalization.getOriginalSettings()));
				that.oSettings = {};
				that.oTransientSettings = {};
				that.updateDialog();
				that._bindDragAndDrop("bg");
				that._bindDragAndDrop("hdr");
				that._bindDragAndDrop("logo");
				that.firePersonalizationChange({settings:{}});
			}}));
			d.addButton(new c.Button({text:"OK",press:function(){
				that.oSettings = jQuery.extend({}, that.oTransientSettings); // settings are already applied
				that.firePersonalizationChange({settings:that.oSettings});
				d.close();
			}}));
			d.addButton(new c.Button({text:"Cancel",press:function(){
				// that.applySettings(that.oSettings);
				// that.updateDialog();
				d.close();
			}}));
			this.oDialog = d;
		}
		return this.oDialog;
	};
	
	
	ShellPersonalization.prototype.updateDialog = function() {
		var oActualSettings = jQuery.extend({}, ShellPersonalization.getOriginalSettings());
		oActualSettings = jQuery.extend(oActualSettings, this.oSettings);
		var sId = this.shell.getId() + "-p13n_";
	
		this.oBgImgHtml.setContent("<div id='" + sId + "bgImageHolder' class='sapUiUx3ShellP13nImgHolder'><img id='" + sId + "bgImageImg' src='"
				+ (oActualSettings.sBackgroundImageSrc ? oActualSettings.sBackgroundImageSrc : sap.ui.resource('sap.ui.core', 'themes/base/img/1x1.gif')) + "'/></div>");
		this.oBgImgOpacitySlider.setValue(100 - oActualSettings.fBgImgOpacity * 100);
		this.oSidebarOpacitySlider.setValue(100 - oActualSettings.fSidebarOpacity * 100);
	
		this.oByDStyleCb.setChecked(oActualSettings.bByDStyle);
		this.oHdrImgHtml.setContent("<div id='" + sId + "hdrImageHolder' class='sapUiUx3ShellP13nImgHolder'><img id='" + sId + "hdrImageImg' src='"
				+ (oActualSettings.sHeaderImageSrc ? oActualSettings.sHeaderImageSrc : sap.ui.resource('sap.ui.core', 'themes/base/img/1x1.gif')) + "'/></div>");
	
		this.oLogoRbg.setSelectedIndex((oActualSettings.sLogoAlign == "center") ? 1 : 0);
		this.oUseLogoSizeCb.setChecked(oActualSettings.bUseLogoSize);
		this.oLogoImgHtml.setContent("<div id='" + sId + "logoImageHolder' class='sapUiUx3ShellP13nImgHolder'><img id='" + sId + "logoImageImg' src='"
				+ (oActualSettings.sLogoImageSrc ? oActualSettings.sLogoImageSrc : sap.ui.resource('sap.ui.core', 'themes/base/img/1x1.gif')) + "'/></div>");
	};
	
	
	
	
	/* property change handlers and code to apply each setting to the UI */
	
	
	ShellPersonalization.prototype._handleByDStyleChange = function(oEvent) {
		var bChecked = oEvent.getParameter("checked");
		this.oTransientSettings.bByDStyle = bChecked;
		this.applyByDStyle(bChecked);
	};
	ShellPersonalization.prototype.applyByDStyle = function(bByDStyle) {
		this.shell.$().toggleClass("sapUiUx3ShellByD", bByDStyle);
	};
	
	ShellPersonalization.prototype._handleBgColorChange = function(oEvent) {
		var cssColor = oEvent.getParameter("cssColor");
		this.oTransientSettings.sBgColor = cssColor;
		this.applyBgColor(cssColor);
	};
	ShellPersonalization.prototype.applyBgColor = function(sCssColor) {
		this.shell.$("bg").css("background-color", sCssColor);
		this.shell.$("bgColor").css("background-color", sCssColor);
	};
	
	ShellPersonalization.prototype._handleBackgroundImageChange = function(url, bPersistImmediately) {
		var tile = true; // TODO
		if (bPersistImmediately) {
			if (tile) {
				this.oSettings.sBgCssImg = "url(" + url + ")";
				this.oSettings.sBgImgSrc = null;
			} else {
				this.oSettings.sBgCssImg = null;
				this.oSettings.sBgImgSrc = url;
			}
			this.applyBgImage(this.oSettings.sBgCssImg, this.oSettings.sBgImgSrc);
			this.firePersonalizationChange({settings:this.oSettings});
		} else {
			if (tile) {
				this.oTransientSettings.sBgCssImg = "url(" + url + ")";
				this.oTransientSettings.sBgImgSrc = null;
			} else {
				this.oTransientSettings.sBgCssImg = null;
				this.oTransientSettings.sBgImgSrc = url;
			}
			this.applyBgImage(this.oTransientSettings.sBgCssImg, this.oTransientSettings.sBgImgSrc);
		}
	};
	
	ShellPersonalization.prototype.applyBgImage = function(sBgCssImg, sBgImgSrc) {
		// var sForcedImgSrc = sBgImgSrc ? sBgImgSrc : sBgCssImg.substring(4, sBgCssImg.length - 1);
		sBgCssImg = sBgCssImg ? sBgCssImg : "";
		sBgImgSrc = sBgImgSrc ? sBgImgSrc : ShellPersonalization.TRANSPARENT_1x1;
	
		var oBgImgRef = this.shell.getDomRef("bgImg");
		// var oBgImgPreviewRef = this.shell.getDomRef("p13n_bgImageImg");
	
		oBgImgRef.style.backgroundImage = sBgCssImg;
		oBgImgRef.src = sBgImgSrc;
	
		/* if (oBgImgPreviewRef) {
			// TODO: understand why this code exists   oBgImgPreviewRef.src = sForcedImgSrc;
		} */
	};
	
	ShellPersonalization.prototype._handleHeaderImageChange = function(dataUrl, bPersistImmediately) {
		if (bPersistImmediately) {
			this.oSettings.sHeaderImageSrc = dataUrl;
			this.firePersonalizationChange({settings:this.oSettings});
		} else {
			this.oTransientSettings.sHeaderImageSrc = dataUrl;
		}
		this.applyHeaderImage(dataUrl);
	};
	ShellPersonalization.prototype.applyHeaderImage = function(dataUrl) {
		this.shell.$("hdr").css("background-image", "url(" + dataUrl + ")");
		if (this.oDialog && this.oDialog.isOpen()) {
			this.shell.$("p13n_hdrImageImg").attr("src", dataUrl);
		}
	};
	
	ShellPersonalization.prototype._handleLineColorChange = function(oEvent) {
		var cssColor = oEvent.getParameter("cssColor");
		this.oTransientSettings.sLineColor = cssColor;
		this.applyLineColor(cssColor);
	};
	ShellPersonalization.prototype.applyLineColor = function(sCssColor) {
		this.shell.$("hdr").find("hr").css("background-color", sCssColor);
		this.shell.$("lineColor").css("background-color", sCssColor);
	};
	
	ShellPersonalization.prototype._handleBgImageOpacitySliderChange = function(oEvent) {
		var value = (100 - oEvent.getParameter("value")) / 100;
		this.oTransientSettings.fBgImgOpacity = value;
		this.applyBgImageOpacity(value);
	};
	ShellPersonalization.prototype.applyBgImageOpacity = function(fValue) {
		this.shell.$("bgImg").css("opacity", fValue);
	};
	
	ShellPersonalization.prototype._handleSidebarOpacitySliderChange = function(oEvent) {
		var value = (100 - oEvent.getParameter("value")) / 100;
		this.oTransientSettings.fSidebarOpacity = value;
		this.applySidebarOpacity(value);
	};
	ShellPersonalization.prototype.applySidebarOpacity = function(fValue) {
		this.shell.$("tp").css("opacity", fValue);
		this.shell.$("paneBar").children(":nth-child(2)").css("opacity", fValue);
	};
	
	ShellPersonalization.prototype._handleLogoImageChange = function(url, bPersistImmediately) {
		if (bPersistImmediately) {
			this.oSettings.sLogoImageSrc = url;
			this.firePersonalizationChange({settings:this.oSettings});
		} else {
			this.oTransientSettings.sLogoImageSrc = url;
		}
		this.applyLogoImage(url);
	};
	ShellPersonalization.prototype.applyLogoImage = function(url) {
		if (!url) {
			url = this.shell.getAppIcon();
			if (!url) {
				url = ShellPersonalization.TRANSPARENT_1x1;
			}
		}
		this.shell.$("logoImg").attr("src", url);
		this.shell.$("p13n_logoImageImg").attr("src", url); // just in case the dialog is displaying it
	};
	
	ShellPersonalization.prototype._handleLogoAlignChange = function(oEvent) {
		var iIndex = oEvent.getParameter("selectedIndex");
		var sAlign = ["left","center"][iIndex];
		this.oTransientSettings.sLogoAlign = sAlign;
		this.applyLogoAlign(sAlign);
	};
	ShellPersonalization.prototype.applyLogoAlign = function(sLogoAlign) {
		var sRealAlign = sLogoAlign;
		if (sap.ui.getCore().getConfiguration().getRTL() && (sRealAlign == "right")) {
			sRealAlign = "left"; // need to use left/right, as "begin" is not supported by IE8
		}
		this.shell.$("hdr").css("text-align", sRealAlign);
	};
	
	ShellPersonalization.prototype._handleUseLogoSizeChange = function(oEvent) {
		var bUse = oEvent.getParameter("checked");
		this.oTransientSettings.bUseLogoSize = bUse;
		this.applyUseLogoSize(bUse);
	};
	ShellPersonalization.prototype.applyUseLogoSize = function(bUseLogoSize) {
		this.shell.$("hdr").toggleClass("sapUiUx3ShellHeaderFlex", bUseLogoSize);
		this.shell.$("hdrImg").toggleClass("sapUiUx3ShellHeaderImgFlex", bUseLogoSize);
	};
	
	
	
	/* drag & drop code */
	
	
	ShellPersonalization.prototype._handleDragover = function(evt) {
		var id = evt.target.id;
		if (!this._dragOverBlinking) {
			var $bg = jQuery.sap.byId(id);
			$bg.css("opacity", "0.5");
			this._dragOverBlinking = true;
			var that = this;
			window.setTimeout(function(){
				$bg.css("opacity", "1");
				window.setTimeout(function(){
					that._dragOverBlinking = null;
				}, 250);
			}, 250);
		}
	  return false;
	};
	ShellPersonalization.prototype._handleDragend = function(evt) {
		return false;
	};
	ShellPersonalization.prototype._handleDrop = function(evt) {
		var id = evt.target.id;
		evt.preventDefault();
		var e = evt.originalEvent;
		var file = e.dataTransfer.files[0];
		if (file) {
			// read file content
			var reader = new window.FileReader();
			reader.onload = jQuery.proxy(function(event) {
				var dataUrl = event.target.result;
				if ((id == this.shell.getId() + "-p13n_bgImageImg")
						|| (id == this.shell.getId() + "-p13n_bgImageHolder")) {
					this._handleBackgroundImageChange(dataUrl);
				} else if ((id == this.shell.getId() + "-p13n_hdrImageImg")
						|| (id == this.shell.getId() + "-p13n_hdrImageHolder")) {
					this._handleHeaderImageChange(dataUrl);
				} else if ((id == this.shell.getId() + "-p13n_logoImageImg")
						|| (id == this.shell.getId() + "-p13n_logoImageHolder")) {
					this._handleLogoImageChange(dataUrl);
				}
				reader = null;
			}, this);
			reader.readAsDataURL(file);
		}
	};
	

	return ShellPersonalization;

}, /* bExport= */ true);
