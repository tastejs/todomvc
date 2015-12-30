/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides default renderer for control sap.ui.commons.Button
sap.ui.define(['jquery.sap.global'],
	function(jQuery) {
	"use strict";


	/**
	 * @author SAP SE
	 * @version 1.32.9
	 * @namespace
	 */
	var ButtonRenderer = {
	};

	/**
	 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} rm The RenderManager that can be used for writing to the render output buffer.
	 * @param {sap.ui.core.Control} oButton An object representation of the control that should be rendered.
	 */
	ButtonRenderer.render = function(rm, oButton) {
		rm.addClass("sapUiBtn");

		// button is rendered as a "<button>" element
		rm.write("<button type=\"button\""); // otherwise this turns into a submit button in IE8
		rm.writeControlData(oButton);
		if (oButton.getTooltip_AsString()) {
			rm.writeAttributeEscaped("title", oButton.getTooltip_AsString());
		}

		//styling
		if (oButton.getStyled()) {
			rm.addClass("sapUiBtnS");
		}

		if (oButton.getLite()) {
			rm.addClass("sapUiBtnLite");
		} else {
			rm.addClass("sapUiBtnNorm");
		}

		var sStyle = oButton.getStyle();

		if (sStyle != "" && sStyle != sap.ui.commons.ButtonStyle.Default) {
			rm.addClass("sapUiBtn" + jQuery.sap.encodeHTML(sStyle));
		}

		//ARIA
		rm.writeAccessibilityState(oButton, {
			role: 'button',
			disabled: !oButton.getEnabled()
		});

		if (!oButton.getEnabled()) {
			rm.write(" tabIndex=\"-1\"");
			rm.addClass("sapUiBtnDsbl");
		} else {
			rm.write(" tabIndex=\"0\"");
			rm.addClass("sapUiBtnStd");
		}

		var bImageOnly = false;
		if (!oButton.getText() && oButton.getIcon()) { // icon, but no text => reduce padding
			rm.addClass("sapUiBtnIconOnly");
			bImageOnly = true; // only the image is there, so it must have some meaning
		}

		if (oButton.getIcon() && oButton.getText()) {
			rm.addClass("sapUiBtnIconAndText");
		}

		if (oButton.getWidth() && oButton.getWidth() != '') {
			rm.addStyle("width", oButton.getWidth());
			rm.addClass("sapUiBtnFixedWidth");
		}
		if (oButton.getHeight() && oButton.getHeight() != '') {
			rm.addStyle("height", oButton.getHeight());
		}
		rm.writeStyles();

		if (this.renderButtonAttributes) {
			this.renderButtonAttributes(rm, oButton);
		}

		// feature-dependent CSS class, written for browsers not understanding CSS gradients (=IE8, IE9)
		// required to avoid a large number of browser selectors which is needed to NOT serve filter:... to IE10
		if (!!sap.ui.Device.browser.internet_explorer && (!document.documentMode || document.documentMode < 10)) {
			rm.addClass("sapUiBtnNoGradient");
		}

		rm.writeClasses();

		rm.write(">");

		if (this.renderButtonContentBefore) {
			this.renderButtonContentBefore(rm, oButton);
		}

		var bUseIconFont = false;
		if (sap.ui.core.IconPool.isIconURI(oButton.getIcon())) {
			bUseIconFont = true;
		}

		if (oButton.getIconFirst()) {
			if (bUseIconFont) {
				this.writeIconHtml(rm, oButton);
			} else if (this._getIconForState(oButton, "base")) {
				this.writeImgHtml(rm, oButton, bImageOnly);
			}
		}

		// write the button label
		if (oButton.getText()) {
			if (!oButton.getIcon() && !this.renderButtonContentBefore && !this.renderButtonContentAfter) {
				rm.writeEscaped(oButton.getText());
			} else { // if there is an icon, an additional span is required
				rm.write("<span class=\"sapUiBtnTxt\">");
				rm.writeEscaped(oButton.getText());
				rm.write("</span>");
			}
		}

		if (!oButton.getIconFirst()) {
			if (bUseIconFont) {
				this.writeIconHtml(rm, oButton);
			} else if (this._getIconForState(oButton, "base")) {
				this.writeImgHtml(rm, oButton, bImageOnly);
			}
		}

		if (this.renderButtonContentAfter) {
			this.renderButtonContentAfter(rm, oButton);
		}

		// close button
		rm.write("</button>");
	};

	/**
	 * Function called by button control on mouse down event.
	 */
	ButtonRenderer.onactive = function(oButton) {
		oButton.$().addClass("sapUiBtnAct").removeClass("sapUiBtnStd");
		oButton.$("img").attr("src", this._getIconForState(oButton, "active"));
	};

	/**
	 * Function called by button control on mouse up event.
	 */
	ButtonRenderer.ondeactive = function(oButton) {
		oButton.$().addClass("sapUiBtnStd").removeClass("sapUiBtnAct");
		oButton.$("img").attr("src", this._getIconForState(oButton, "deactive"));
	};

	/**
	 * Function called by button control on blur.
	 */
	ButtonRenderer.onblur = function(oButton) {
		oButton.$().removeClass("sapUiBtnFoc");
		oButton.$("img").attr("src", this._getIconForState(oButton, "blur"));
		if (!!sap.ui.Device.browser.internet_explorer) {
			ButtonRenderer.onmouseout(oButton);
		}
	};

	/**
	 * Function called by button control on focus.
	 */
	ButtonRenderer.onfocus = function(oButton) {
		oButton.$().addClass("sapUiBtnFoc");
		oButton.$("img").attr("src", this._getIconForState(oButton, "focus"));
	};

	/**
	 * Function called when mouse leaves button
	 */
	ButtonRenderer.onmouseout = function(oButton) {
		oButton.$().removeClass("sapUiBtnAct");
		oButton.$().addClass("sapUiBtnStd");
		oButton.$("img").attr("src", this._getIconForState(oButton, "mouseout"));
	};

	/**
	 * Function called when mouse enters button
	 * @private
	 */
	ButtonRenderer.onmouseover = function(oButton) {
		oButton.$("img").attr("src", this._getIconForState(oButton, "mouseover"));
	};

	/**
	 * Returns the icon URI for the given button state
	 * @private
	 */
	ButtonRenderer._getIconForState = function(oButton, sState) {
		if (!oButton.getEnabled()) {
			sState = "disabled";
		}
		switch (sState) {
			case "focus":
			case "blur":
			case "base":
				if (oButton.$().hasClass("sapUiBtnAct")) {
					var sIcon = oButton.getIconSelected() || oButton.getIconHovered();
					return sIcon ? sIcon : oButton.getIcon();
				} else if (oButton.$().hasClass("sapUiBtnFoc")) {
					return oButton.getIconHovered() || oButton.getIcon();
				}
				return oButton.getIcon();
			case "mouseout":
				if (oButton.$().hasClass("sapUiBtnFoc")) {
					return oButton.getIconHovered() || oButton.getIcon();
				}
				return oButton.getIcon();
			case "active":
				var sIcon = oButton.getIconSelected() || oButton.getIconHovered();
				return sIcon ? sIcon : oButton.getIcon();
			case "mouseover":
			case "deactive":
				var sIcon = oButton.getIconHovered();
				return sIcon ? sIcon : oButton.getIcon();
		}
		return oButton.getIcon();
	};

	/**
	 * HTML for icon as image
	 */
	ButtonRenderer.writeImgHtml = function(oRenderManager, oButton, bImageOnly) {
		var rm = oRenderManager,
			iconUrl = this._getIconForState(oButton, "base");

		rm.write("<img");
		rm.writeAttribute("id", oButton.getId() + "-img");
		rm.writeAttributeEscaped("src", iconUrl);
		if (oButton.getTooltip_AsString() && !oButton.getText()) {
			rm.writeAttributeEscaped("alt", oButton.getTooltip_AsString());
		} else {
			rm.writeAttribute("alt", ""); // there must be an ALT attribute
		}

        if (!bImageOnly) {
            rm.writeAttribute("role", "presentation");
        }

		rm.addClass("sapUiBtnIco");
        if (oButton.getText()) { // only add a distance to the text if there is text
			if (oButton.getIconFirst()) {
				rm.addClass("sapUiBtnIcoL");
			} else {
				rm.addClass("sapUiBtnIcoR");
			}
		}
		rm.writeClasses();

		rm.write("/>");
	};

	/**
	 * HTML for icon as icon font
	 */
	ButtonRenderer.writeIconHtml = function(oRenderManager, oButton) {

		var rm = oRenderManager;
		var oIconInfo = sap.ui.core.IconPool.getIconInfo(oButton.getIcon());
		var aClasses = [];
		var mAttributes = buildIconAttributes(oButton);
		aClasses.push("sapUiBtnIco");
		if (oButton.getText()) { // only add a distance to the text if there is text
			var bRTL = rm.getConfiguration().getRTL();
			if ((oButton.getIconFirst() && (!bRTL || oIconInfo.skipMirroring)) || (!oButton.getIconFirst() && !oIconInfo.skipMirroring && bRTL)) {
				aClasses.push("sapUiBtnIcoL");
			} else {
				aClasses.push("sapUiBtnIcoR");
			}
		}

		rm.writeIcon(oButton.getIcon(), aClasses, mAttributes);
	};

	ButtonRenderer.changeIcon = function(oButton) {

		if (sap.ui.core.IconPool.isIconURI(oButton.getIcon())) {
			var oIconInfo = sap.ui.core.IconPool.getIconInfo(oButton.getIcon());
			var oIcon = oButton.$("icon");
			if (sap.ui.Device.browser.internet_explorer && sap.ui.Device.browser.version < 9) {
				oIcon.text(oIconInfo.content);
			} else {
				oIcon.attr("data-sap-ui-icon-content", oIconInfo.content);
			}
			if (!oIconInfo.skipMirroring) {
				oIcon.addClass("sapUiIconMirrorInRTL");
			} else {
				oIcon.removeClass("sapUiIconMirrorInRTL");
			}
		} else if (oButton.$().hasClass("sapUiBtnAct")) {
			oButton.$("img").attr("src", this._getIconForState(oButton, "active"));
		} else if (oButton.$().hasClass("sapUiBtnFoc")) {
			oButton.$("img").attr("src", this._getIconForState(oButton, "focus"));
		} else if (oButton.$().hasClass("sapUiBtnStd")) {
			oButton.$("img").attr("src", this._getIconForState(oButton, "base"));
		}

	};

	/**
	*
	* @private
	* @param oButton
	* @returns {object} icon attributes
	*/
	function buildIconAttributes(oButton) {
		var oAttributes = {},
			sTooltip = oButton.getTooltip_AsString();

		oAttributes["id"] = oButton.getId() + "-icon";
		if (sTooltip) { // prevents default icon tooltip
			oAttributes["title"] = null;
			oAttributes["aria-label"] = null;
			oAttributes["aria-hidden"] = true;
		}
		return oAttributes;
	}
	return ButtonRenderer;

}, /* bExport= */ true);
