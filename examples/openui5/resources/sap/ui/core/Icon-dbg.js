/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.core.Icon.
sap.ui.define(['jquery.sap.global', '../Device', './Control', './IconPool', './library'],
	function(jQuery, Device, Control, IconPool, library) {
	"use strict";


	/**
	 * Constructor for a new Icon.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * Icon uses embedded font instead of pixel image. Comparing to image, Icon is easily scalable, color can be altered live and various effects can be added using css.
	 *
	 * A set of built in Icons is available and they can be fetched by calling sap.ui.core.IconPool.getIconURI and set this value to the src property on the Icon.
	 * @extends sap.ui.core.Control
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @since 1.11.1
	 * @alias sap.ui.core.Icon
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var Icon = Control.extend("sap.ui.core.Icon", /** @lends sap.ui.core.Icon.prototype */ { metadata : {

		library : "sap.ui.core",
		properties : {

			/**
			 * This property should be set by the return value of calling sap.ui.core.IconPool.getIconURI with a Icon name parameter and an optional collection parameter which is required when using application extended Icons. A list of standard FontIcon is available here.
			 */
			src : {type : "sap.ui.core.URI", group : "Data", defaultValue : null},

			/**
			 * Since Icon uses font, this property will be applied to the css font-size property on the rendered DOM element.
			 */
			size : {type : "sap.ui.core.CSSSize", group : "Dimension", defaultValue : null},

			/**
			 * The color of the Icon. If color is not defined here, the Icon inherits the color from its DOM parent.
			 */
			color : {type : "string", group : "Appearance", defaultValue : null},

			/**
			 * This color is shown when icon is hovered. This property has no visual effect when run on mobile device.
			 */
			hoverColor : {type : "string", group : "Appearance", defaultValue : null},

			/**
			 * This color is shown when icon is pressed/activated by the user.
			 */
			activeColor : {type : "string", group : "Appearance", defaultValue : null},

			/**
			 * This is the width of the DOM element which contains the Icon. Setting this property doesn't affect the size of the font. If you want to make the font bigger, increase the size property.
			 */
			width : {type : "sap.ui.core.CSSSize", group : "Dimension", defaultValue : null},

			/**
			 * This is the height of the DOM element which contains the Icon. Setting this property doesn't affect the size of the font. If you want to make the font bigger, increase the size property.
			 */
			height : {type : "sap.ui.core.CSSSize", group : "Dimension", defaultValue : null},

			/**
			 * Background color of the Icon in normal state.
			 */
			backgroundColor : {type : "string", group : "Appearance", defaultValue : null},

			/**
			 * Background color for Icon in hover state. This property has no visual effect when run on mobile device.
			 */
			hoverBackgroundColor : {type : "string", group : "Appearance", defaultValue : null},

			/**
			 * Background color for Icon in active state.
			 */
			activeBackgroundColor : {type : "string", group : "Appearance", defaultValue : null},

			/**
			 * A decorative icon is included for design reasons. Accessibility tools will ignore decorative icons. Tab stop isn't affected by this property anymore and it's now controlled by the existence of press event handler and the noTabStop property.
			 * @since 1.16.4
			 */
			decorative : {type : "boolean", group : "Accessibility", defaultValue : true},

			/**
			 * Decides whether a default Icon tooltip should be used if no tooltip is set.
			 * @since 1.30.0
			 */
			useIconTooltip : {type : "boolean", group : "Accessibility", defaultValue : true},

			/**
			 * This defines the alternative text which is used for outputting the aria-label attribute on the DOM.
			 * @since 1.30.0
			 */
			alt : {type : "string", group : "Accessibility", defaultValue : null},

			/**
			 * Defines whether the tab stop of icon is controlled by the existence of press event handler. When it's set to false, Icon control has tab stop when press event handler is attached.
			 * If it's set to true, Icon control never has tab stop no matter whether press event handler exists or not.
			 * @since 1.30.1
			 */
			noTabStop : {type : "boolean", group : "Accessibility", defaultValue : false}
		},
		associations : {

			/**
			 * Association to controls / ids which label this control (see WAI-ARIA attribute aria-labelledby).
			 */
			ariaLabelledBy : {type : "sap.ui.core.Control", multiple : true, singularName : "ariaLabelledBy"}
		},
		events : {

			/**
			 * This event is fired when icon is pressed/activated by the user. When a handler is attached to this event, the Icon gets tab stop. If you want to disable this behavior, set the noTabStop property to true.
			 */
			press : {}
		}
	}});

	/* =========================================================== */
	/* Event handlers                                              */
	/* =========================================================== */

	/**
	 * Handle the mousedown event on the Icon.
	 *
	 * @param {jQuery.Event} oEvent The event object.
	 * @private
	 */
	Icon.prototype.onmousedown = function(oEvent) {

		this._bPressFired = false;

		if (this.hasListeners("press") || this.hasListeners("tap")) {

			// mark the event for components that needs to know if the event was handled
			oEvent.setMarked();
		}

		var sActiveColor = this.getActiveColor(),
			sActiveBackgroundColor = this.getActiveBackgroundColor(),
			$Icon;

		if (sActiveColor || sActiveBackgroundColor) {

			// change the source only when the first finger is on the Icon, the following fingers doesn't affect
			if (!oEvent.targetTouches || (oEvent.targetTouches && oEvent.targetTouches.length === 1)) {
				$Icon = this.$();

				$Icon.addClass("sapUiIconActive");

				if (sActiveColor) {
					this._addColorClass(sActiveColor, "color");
				}

				if (sActiveBackgroundColor) {
					this._addColorClass(sActiveBackgroundColor, "background-color");
				}
			}
		}
	};

	/**
	 * Handle the touchstart event on the Icon.
	 *
	 * @param {jQuery.Event} oEvent The event object.
	 * @private
	 */
	Icon.prototype.ontouchstart = Icon.prototype.onmousedown;

	/**
	 * Handle the mouseup event on the Icon.
	 *
	 * @param {jQuery.Event} oEvent The event object.
	 * @private
	 */
	Icon.prototype.onmouseup = function(oEvent) {

		// change the source back only when all fingers leave the icon
		if (!oEvent.targetTouches || (oEvent.targetTouches && oEvent.targetTouches.length === 0)) {

			this.$().removeClass("sapUiIconActive");
			this._restoreColors();
		}
	};

	/**
	 * Handle the touchend event on the Icon.
	 *
	 * @param {jQuery.Event} oEvent The event object.
	 * @private
	 */
	Icon.prototype.ontouchend = Icon.prototype.onmouseup;

	/**
	 * Handle the touchcancel event on the Icon.
	 *
	 * @param {jQuery.Event} oEvent The event object.
	 * @private
	 */
	Icon.prototype.ontouchcancel = Icon.prototype.onmouseup;

	/**
	 * Handle the mouseover event on the Icon.
	 *
	 * @private
	 */
	Icon.prototype.onmouseover = function() {

		var sHoverColor = this.getHoverColor(),
			sHoverBackgroundColor = this.getHoverBackgroundColor();

		if (sHoverColor) {
			this._addColorClass(sHoverColor, "color");
		}

		if (sHoverBackgroundColor) {
			this._addColorClass(sHoverBackgroundColor, "background-color");
		}
	};

	/**
	 * Handle the mouseout event on the Icon.
	 *
	 * @private
	 */
	Icon.prototype.onmouseout = function() {
		this._restoreColors();
	};

	/**
	 * Handle the click or tap event on the Icon.
	 *
	 * @private
	 */
	Icon.prototype.onclick = function() {
		if (this._bPressFired) {
			return;
		}

		this.firePress({/* no parameters */});
		this._bPressFired = true;
	};

	Icon.prototype.ontap = Icon.prototype.onclick;

	/* ----------------------------------------------------------- */
	/* Keyboard handling                                           */
	/* ----------------------------------------------------------- */

	/**
	 * Handle the key down event for SPACE and ENTER.
	 *
	 * @param {jQuery.Event} oEvent - the keyboard event.
	 * @private
	 */
	Icon.prototype.onkeydown = function(oEvent) {

		if (oEvent.which === jQuery.sap.KeyCodes.SPACE || oEvent.which === jQuery.sap.KeyCodes.ENTER) {

			// note: prevent document scrolling
			oEvent.preventDefault();

			var $Icon = this.$(),
				sActiveColor = this.getActiveColor(),
				sActiveBackgroundColor = this.getActiveBackgroundColor();

			$Icon.addClass("sapUiIconActive");

			if (sActiveColor) {
				this._addColorClass(sActiveColor, "color");
			}

			if (sActiveBackgroundColor) {
				this._addColorClass(sActiveBackgroundColor, "background-color");
			}
		}
	};

	/**
	 * Handle the key up event for SPACE and ENTER.
	 *
	 * @param {jQuery.Event} oEvent - the keyboard event.
	 * @private
	 */
	Icon.prototype.onkeyup = function(oEvent) {

		if (oEvent.which === jQuery.sap.KeyCodes.SPACE || oEvent.which === jQuery.sap.KeyCodes.ENTER) {

			this.$().removeClass("sapUiIconActive");
			this._restoreColors();
			this.firePress({/* no parameters */});
		}
	};

	/* =========================================================== */
	/* Private methods                                             */
	/* =========================================================== */

	Icon.prototype._restoreColors = function() {
		this._addColorClass(this.getColor() || "", "color");
		this._addColorClass(this.getBackgroundColor() || "", "background-color");
	};

	/* =========================================================== */
	/* API method                                                  */
	/* =========================================================== */

	Icon.prototype.setSrc = function(sSrc) {
		var oIconInfo = IconPool.getIconInfo(sSrc);

		if (oIconInfo) {
			var $Icon = this.$();
			$Icon.css("font-family", oIconInfo.fontFamily);
			$Icon.attr("data-sap-ui-icon-content", oIconInfo.content);
			$Icon.toggleClass("sapUiIconMirrorInRTL", !oIconInfo.suppressMirroring);

			var sTooltip = this.getTooltip_AsString(),
				alabelledBy = this.getAriaLabelledBy(),
				sAlt = this.getAlt(),
				bUseIconTooltip = this.getUseIconTooltip();

			if (sTooltip || bUseIconTooltip) {
				$Icon.attr("title", sTooltip || oIconInfo.text || oIconInfo.name);
			} else {
				$Icon.attr("title", null);
			}

			// Only adopt "aria-label" if there is no "labelledby" as this is managed separately
			if (alabelledBy.length === 0) {
				if (sAlt || sTooltip || bUseIconTooltip) {
					$Icon.attr("aria-label", sAlt || sTooltip || oIconInfo.text || oIconInfo.name);
				} else {
					$Icon.attr("aria-label", null);
				}
			}

		}

		// when the given sSrc can't be found in IconPool, rerender the icon is needed.
		this.setProperty("src", sSrc, !!oIconInfo);

		return this;
	};

	Icon.prototype.setWidth = function(sWidth) {
		this.setProperty("width", sWidth, true);
		this.$().css("width", sWidth);

		return this;
	};

	Icon.prototype.setHeight = function(sHeight) {
		this.setProperty("height", sHeight, true);
		this.$().css({
			"height": sHeight,
			"line-height": sHeight
		});

		return this;
	};

	Icon.prototype.setSize = function(sSize) {
		this.setProperty("size", sSize, true);
		this.$().css("font-size", sSize);

		return this;
	};

	Icon.prototype.setColor = function(sColor) {
		this.setProperty("color", sColor, true);
		this._addColorClass(sColor, "color");

		return this;
	};

	Icon.prototype._addColorClass = function(sColor, sCSSPropName) {
		var $Icon = this.$(),
				that = this;

		var sCSSClassNamePrefix = "";
		if (sCSSPropName === "color") {
			sCSSClassNamePrefix = "sapUiIconColor";
		} else if (sCSSPropName === "background-color") {
			sCSSClassNamePrefix = "sapUiIconBGColor";
		} else {
			return;
		}

		jQuery.each(sap.ui.core.IconColor, function(sPropertyName, sPropertyValue) {
			that.removeStyleClass(sCSSClassNamePrefix + sPropertyValue);
		});

		if (sColor in sap.ui.core.IconColor) {
			// reset the relevant css property
			$Icon.css(sCSSPropName, "");
			this.addStyleClass(sCSSClassNamePrefix + sColor);
		} else {
			$Icon.css(sCSSPropName, sColor);
		}
	};

	Icon.prototype.setActiveColor = function(sColor) {
		return this.setProperty("activeColor", sColor, true);
	};

	Icon.prototype.setHoverColor = function(sColor) {
		return this.setProperty("hoverColor", sColor, true);
	};

	Icon.prototype.setBackgroundColor = function(sColor) {
		this.setProperty("backgroundColor", sColor, true);
		this._addColorClass(sColor, "background-color");

		return this;
	};

	Icon.prototype.setActiveBackgroundColor = function(sColor) {
		return this.setProperty("activeBackgroundColor", sColor, true);
	};

	Icon.prototype.setHoverBackgroundColor = function(sColor) {
		return this.setProperty("hoverBackgroundColor", sColor, true);
	};

	Icon.prototype.attachPress = function () {
		var aMyArgs = Array.prototype.slice.apply(arguments);
		aMyArgs.unshift("press");

		Control.prototype.attachEvent.apply(this, aMyArgs);

		if (this.hasListeners("press")) {
			this.$().toggleClass("sapUiIconPointer", true)
					.attr({
						role: "button",
						tabindex: this.getNoTabStop() ? undefined : 0
					});
		}

		return this;
	};

	Icon.prototype.detachPress = function() {
		var aMyArgs = Array.prototype.slice.apply(arguments);
		aMyArgs.unshift("press");

		Control.prototype.detachEvent.apply(this, aMyArgs);

		if (!this.hasListeners("press")) {
			this.$().toggleClass("sapUiIconPointer", false)
					.attr({
						role: this.getDecorative() ? "presentation" : "img"
					})
					.removeAttr("tabindex");
		}

		return this;
	};

	Icon.prototype._getAccessibilityAttributes = function() {
		var oIconInfo = IconPool.getIconInfo(this.getSrc()),
			alabelledBy = this.getAriaLabelledBy(),
			sTooltip = this.getTooltip_AsString(),
			sAlt = this.getAlt(),
			bUseIconTooltip = this.getUseIconTooltip(),
			mAccAttributes = {};

		if (this.getDecorative()) {
			mAccAttributes.role = "presentation";
			mAccAttributes.hidden = "true";
		} else {
			if (this.hasListeners("press")) {
				mAccAttributes.role = "button";
			} else {
				mAccAttributes.role = "img";
			}
		}

		if (alabelledBy.length > 0) {
			mAccAttributes.labelledby = alabelledBy.join(" ");
		} else if (sAlt || sTooltip || (bUseIconTooltip && oIconInfo)) {
			mAccAttributes.label = sAlt || sTooltip || oIconInfo.text || oIconInfo.name;
		}

		return mAccAttributes;
	};

	return Icon;

});
