/**
 * EXPERIMENTAL!  DO NOT USE!
 */

/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides the class sap.ui.ux3.ShellColorPicker
sap.ui.define(['jquery.sap.global', 'sap/ui/base/EventProvider', 'sap/ui/commons/Button', 'sap/ui/core/Popup'],
	function(jQuery, EventProvider, Button, Popup) {
	"use strict";


	
	
	var ShellColorPicker = EventProvider.extend("sap.ui.ux3.ShellColorPicker", {
		constructor: function(id) {
			EventProvider.apply(this);
			this.id = id;
		}
	});
	
	
	/*  EVENT HANDLING */
	
	ShellColorPicker.M_EVENTS = {liveChange: "liveChange"};
	
	ShellColorPicker.prototype.attachLiveChange = function(fFunction, oListener) {
		this.attachEvent(ShellColorPicker.M_EVENTS.liveChange, fFunction, oListener);
	};
	
	ShellColorPicker.prototype.detachLiveChange = function(fFunction, oListener) {
		this.detachEvent(ShellColorPicker.M_EVENTS.liveChange, fFunction, oListener);
	};
	
	ShellColorPicker.prototype.fireLiveChange = function(oColor) {
		var mParameters = {cssColor:ShellColorPicker.hslToCss(oColor)};
		this.fireEvent(ShellColorPicker.M_EVENTS.liveChange, mParameters);
	};
	
	
	
	/* API METHODS */
	
	/**
	 * @public
	 */
	ShellColorPicker.prototype.isOpen = function() {
		return (this.oPopup && this.oPopup.isOpen());
	};
	
	
	/**
	 * Opens the color picker, initially showing the given color.
	 *  
	 * All parameters after <code>oColor</code> have the same meaning and accept the same values as in {@link sap.ui.core.Popup#open Popup.open()}.
	 *  
	 * @param {object} oColor a hsl-based color object, as returned by parseCssRgbString()
	 * @param {int} [iDuration] animation duration in milliseconds; default is the jQuery preset "fast". For iDuration == 0 the opening happens synchronously without animation.
	 * @param {sap.ui.core.Popup.Dock} [my=sap.ui.core.Popup.Dock.CenterCenter] the popup content's reference position for docking
	 * @param {sap.ui.core.Popup.Dock} [at=sap.ui.core.Popup.Dock.CenterCenter] the "of" element's reference point for docking to
	 * @param {Element|sap.ui.core.Element} [of=document] the DOM Element or UI5 Element to dock to
	 * @param {string} [offset='0 0'] the offset relative to the docking point, specified as a string with space-separated pixel values (e.g. "0 10" to move the popup 10 pixels to the right). If the docking of both "my" and "at" are both RTL-sensitive ("begin" or "end"), this offset is automatically mirrored in the RTL case as well.
	 * @param {string} [collision='flip'] defines how the position of an element should be adjusted in case it overflows the window in some direction.
	 *
	 * @public
	 */
	ShellColorPicker.prototype.open = function(oColor, iDuration, my, at, of, offset, collision) {
		if (this.oPopup && this.oPopup.isOpen()) {
			return;
		}
	
		this.oSlider = new sap.ui.commons.Slider({width: "225px",liveChange:[this.handleSlider, this]});
		this.oOkBtn = new Button({text:"OK",press:[this.handleOk, this]});
		this.oCancelBtn = new Button({text:"Cancel",press:[this.handleCancel, this]});
	
		this.oInitialColor = oColor;
		this.oCurrentColor = jQuery.extend({}, this.oInitialColor);
	
		this.oSlider.setValue(this.oCurrentColor.l);
		var rm = sap.ui.getCore().createRenderManager();
		var dummyDiv = document.createElement("div");
		var statArea = sap.ui.getCore().getStaticAreaRef();
		statArea.appendChild(dummyDiv);
		this.renderHtml(rm);
		rm.flush(dummyDiv);
		rm.destroy;
		this.oPopup = new Popup(dummyDiv.firstChild, false, true, true).attachClosed(this.handleClose, this);
		this.oPopup.setAutoCloseAreas([dummyDiv.firstChild]);
		this.oPopup.open(iDuration, my, at, of, offset, collision);
		statArea.removeChild(dummyDiv);
		dummyDiv = null;
	
		jQuery.sap.byId(this.id).bind("mousedown", jQuery.proxy(this.handleGeneralMouseDown, this));
		jQuery.sap.byId(this.id + "-img").bind("mousedown", jQuery.proxy(this.handleMouseDown, this));
		jQuery.sap.byId(this.id + "-marker").bind("mousedown", jQuery.proxy(this.handleMouseDown, this));
		this._imgOffset = jQuery.sap.byId(this.id + "-img").offset();
	
		this.adaptSliderBar(this.oCurrentColor);
		this.markColorOnImage(this.oCurrentColor);
		this.adaptPreview(this.oCurrentColor);
	};
	
	
	/**
	 * Returns the oColor object (hsl-based) for the given CSS string that is built like this: "rgb(127,0,1)"
	 * @param sRgbString
	 */
	ShellColorPicker.parseCssRgbString = function(sRgbString) {
		sRgbString = jQuery.trim(sRgbString.replace(/rgb\(/, "").replace(/\)/, ""));
		var aRgb = sRgbString.split(",");
		var oRgbColor = {r:parseInt(aRgb[0], 10), g:parseInt(aRgb[1], 10), b:parseInt(aRgb[2], 10)};
		return ShellColorPicker.rgbToHsl(oRgbColor);
	};
	
	/* INTERNALS */
	
	ShellColorPicker.prototype.renderHtml = function(rm) {
		rm.write("<div id='" + this.id + "' class='sapUiUx3ShellColorPicker'>");
		rm.write("<img id='" + this.id + "-img' src='" + sap.ui.resource('sap.ui.ux3', 'img/colors-h.png') + "' />");
		rm.renderControl(this.oSlider);
		rm.write("<div id='" + this.id + "-grad' class='sapUiUx3ShellColorPickerGradient'></div>");
		rm.write("<div id='" + this.id + "-marker' class='sapUiUx3ShellColorPickerMarker'></div>");
		rm.write("<div id='" + this.id + "-preview' class='sapUiUx3ShellColorPickerPreview'></div>");
		rm.renderControl(this.oOkBtn);
		rm.renderControl(this.oCancelBtn);
		rm.write("</div>");
	};// TODO: remove HTML on close
	
	ShellColorPicker.prototype.markColorOnImage = function(oColor) {
		var x = oColor.h * 225;
		var y = (1 - oColor.s) * 75;
		jQuery.sap.byId(this.id + "-marker").css("left", x + 10).css("top", y + 10);
	};
	
	ShellColorPicker.prototype.markColorOnSlider = function(oColor) {
		this.oSlider.setValue(oColor.l);
	};
	
	ShellColorPicker.prototype.adaptSliderBar = function(oColor) {
		var gradient = "";
		var oMediumColor = jQuery.extend({},oColor);
		oMediumColor.l = 50;
		var color = ShellColorPicker.hslToCss(oMediumColor);
		if (!!sap.ui.Device.browser.firefox) {
			gradient = "-moz-linear-gradient(left, black, " + color + ", white)";
		} else if (!!sap.ui.Device.browser.webkit) {
			gradient = "-webkit-gradient(linear, left center, right center, from(#000), color-stop(0.5, " + color + "), to(#FFF))";
		}
		jQuery.sap.byId(this.id + "-grad").css("background-image", gradient);
	};
	
	ShellColorPicker.prototype.adaptPreview = function(oColor) {
		jQuery.sap.byId(this.id + "-preview").css("background-color", ShellColorPicker.hslToCss(oColor));
	};
	
	
	
	ShellColorPicker.prototype.handleSlider = function(e) {
		var l = e.getParameter("value");
		this.oCurrentColor.l = l;
		this.adaptPreview(this.oCurrentColor);
		this.fireLiveChange(this.oCurrentColor);
	};
	
	ShellColorPicker.prototype.handleGeneralMouseDown = function(e) {
		e.preventDefault(); // no autoclose!
	};
	
	ShellColorPicker.prototype.handleMouseDown = function(e) {
		this.handleMousePos(e);
		e.preventDefault(); // no drag&drop of the color image!
		jQuery(document)
			.bind("mousemove", jQuery.proxy(this.handleMousePos, this))
			.bind("mouseup", jQuery.proxy(this.handleMouseUp, this));
	};
	
	ShellColorPicker.prototype.handleMouseUp = function(e) {
		this.handleMousePos(e);
		jQuery(document)
			.unbind("mousemove", this.handleMousePos)
			.unbind("mouseup", this.handleMouseUp);
	};
	
	ShellColorPicker.prototype.handleMousePos = function(e) {
		var x = e.pageX - this._imgOffset.left;
		var y = e.pageY - this._imgOffset.top;
		x = Math.min(Math.max(x, 0), 225);
		y = Math.min(Math.max(y, 0), 75);
		var hue = x / 225; // TODO: hardcoded!
		var sat = 1 - y / 75; // TODO: hardcoded!
		this.oCurrentColor.h = hue;
		this.oCurrentColor.s = sat;
		this.adaptSliderBar(this.oCurrentColor);
		this.markColorOnImage(this.oCurrentColor);
		this.adaptPreview(this.oCurrentColor);
		this.fireLiveChange(this.oCurrentColor);
	};
	
	ShellColorPicker.prototype.handleOk = function() {
		this.fireLiveChange(this.oCurrentColor);
		this.oPopup.close();
	};
	
	ShellColorPicker.prototype.handleCancel = function() {
		this.fireLiveChange(this.oInitialColor);
		this.oPopup.close();
	};
	
	
	ShellColorPicker.prototype.handleClose = function() {
		// clean up event handlers, DOM, child controls and popup
		jQuery.sap.byId(this.id + "-img")
			.unbind("mousedown", this.handleMouseDown);
		jQuery.sap.byId(this.id + "-marker")
			.unbind("mousedown", this.handleMouseDown);
		jQuery(document)
			.unbind("mousemove", this.handleMousePos)
			.unbind("mouseup", this.handleMouseUp);
		jQuery.sap.byId(this.id)
			.unbind("mousedown", this.handleGeneralMouseDown);
	
		this.oSlider.destroy();
		this.oSlider = null;
		this.oOkBtn.destroy();
		this.oOkBtn = null;
		this.oCancelBtn.destroy();
		this.oCancelBtn = null;
	
		var domRef = jQuery.sap.domById(this.id);
		domRef.parentNode.removeChild(domRef);
	
		this.oPopup.destroy();
		this.oPopup = null;
	};
	
	
	/**
	 * rgb values are 0..255
	 */
	ShellColorPicker.rgbToHsl = function(oColor) {
		var r = oColor.r / 255,
				g = oColor.g / 255,
				b = oColor.b / 255;
		var max = Math.max(r, g, b);
		var min = Math.min(r, g, b);
		var h, s, l = (max + min) / 2;
	
		if (max == min) {
			h = s = 0; // all colors equally strong -> no saturation
		} else {
			var d = max - min;
			s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
			switch (max) {
				case r: h = (g - b) / d + (g < b ? 6 : 0); break;
				case g: h = (b - r) / d + 2; break;
				case b: h = (r - g) / d + 4; break;
			}
			h /= 6;
		}
		return {h:h,s:s,l:l * 100};
	};
	
	/**
	 * hs values are 0..1, l is 0..100
	 */
	ShellColorPicker.hslToRgb = function(oColor) {
		var r, g, b;
		var l = oColor.l / 100;
	
		if (oColor.s == 0) {
			r = g = b = l; // all colors equally strong -> all equal to lightness
		} else {
			var q = l < 0.5 ? l * (1 + oColor.s) : l + oColor.s - l * oColor.s;
			var p = 2 * l - q;
			r = ShellColorPicker.hueToRgb(p, q, oColor.h + 1 / 3);
			g = ShellColorPicker.hueToRgb(p, q, oColor.h);
			b = ShellColorPicker.hueToRgb(p, q, oColor.h - 1 / 3);
		}
	
		return [r * 255, g * 255, b * 255];
	};
	
	ShellColorPicker.hueToRgb = function(p, q, t) {
	  if (t < 0) {
		t += 1;
	  }
	  if (t > 1) {
		t -= 1;
	  }
	  if (t < 1 / 6) {
		return p + (q - p) * 6 * t;
	  }
	  if (t < 1 / 2) {
		return q;
	  }
	  if (t < 2 / 3) {
		return p + (q - p) * (2 / 3 - t) * 6;
	  }
	  return p;
	};
	
	ShellColorPicker.hslToCss = function(oColor) {
		var rgbColor = ShellColorPicker.hslToRgb(oColor);
		return "rgb(" + Math.round(rgbColor[0]) + "," + Math.round(rgbColor[1]) + "," + Math.round(rgbColor[2]) + ")";
	};

	return ShellColorPicker;

}, /* bExport= */ true);
