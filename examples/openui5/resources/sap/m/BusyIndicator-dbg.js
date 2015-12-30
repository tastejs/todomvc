/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.m.BusyIndicator.
sap.ui.define(['jquery.sap.global', './library', 'sap/ui/core/Control', 'sap/ui/core/theming/Parameters'],
	function(jQuery, library, Control, Parameters) {
	"use strict";



	/**
	 * Constructor for a new BusyIndicator.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * Control to indicate that the system is busy with some task and the user has to wait.
	 * @extends sap.ui.core.Control
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @alias sap.m.BusyIndicator
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var BusyIndicator = Control.extend("sap.m.BusyIndicator", /** @lends sap.m.BusyIndicator.prototype */ { metadata : {

		library : "sap.m",
		properties : {

			/**
			 * Defines text to be displayed below the busy indicator.
			 * It can be used to inform the user of the current operation.
			 */
			text : {type : "string", group : "Data", defaultValue : ""},

			/**
			 * Options for the text direction are RTL and LTR.
			 * Alternatively, the control can inherit the text direction from its parent container.
			 */
			textDirection : {type : "sap.ui.core.TextDirection", group : "Appearance", defaultValue : sap.ui.core.TextDirection.Inherit},

			/**
			 * Icon URL if an icon is used as the busy indicator.
			 */
			customIcon : {type : "sap.ui.core.URI", group : "Misc", defaultValue : ""},

			/**
			 * Defines the rotation speed of the given image.
			 * If a .gif is used, the speed has to be set to 0.
			 * The unit is in ms.
			 * <b>Note:</b> Values are considered valid when greater than or equal to 0.
			 * If invalid value is provided the speed defaults to 0.
			 */
			customIconRotationSpeed : {type : "int", group : "Appearance", defaultValue : 1000},

			/**
			 * If this is set to false, the src image will be loaded directly without attempting
			 * to fetch the density perfect image for high density device.
			 * By default, this is set to true but then one or more requests are sent to the server,
			 * trying to get the density perfect version of the specified image.
			 * If bandwidth is the key for the application, set this value to false.
			 */
			customIconDensityAware : {type : "boolean", defaultValue : true},

			/**
			 * Width of the provided icon. By default 44px are used.
			 */
			customIconWidth : {type : "sap.ui.core.CSSSize", group : "Appearance", defaultValue : "44px"},

			/**
			 * Height of the provided icon. By default 44px are used.
			 */
			customIconHeight : {type : "sap.ui.core.CSSSize", group : "Appearance", defaultValue : "44px"},

			/**
			 * Defines the size of the busy indicator.
			 * The animation consists of three circles, each of which will be this size.
			 * Therefore the total width of the control amounts to three times the given size.
			 */
			size : {type : "sap.ui.core.CSSSize", group : "Misc", defaultValue : "1rem"},

			/**
			 * Setting this property will not have any effect on the appearance of the BusyIndicator
			 * in versions greater than or equal to 1.32.1
			 * @deprecated Since version 1.32.1
			 */
			design : {type : "string", group : "Appearance", defaultValue : "auto"}
		},
		associations: {
			/**
			 * Association to controls / ids which label this control (see WAI-ARIA attribute aria-labelledby).
			 * @since 1.27.0
			 */
			ariaLabelledBy: {type: "sap.ui.core.Control", multiple: true, singularName: "ariaLabelledBy"}
		}
	}});

	BusyIndicator.prototype.init = function () {
		this.setBusyIndicatorDelay(0);
	};

	BusyIndicator.prototype.setText = function (sText) {
		this.setProperty("text", sText, true);
		this._createLabel("setText", sText);
		return this;
	};

	BusyIndicator.prototype.setTextDirection = function (sDirection) {
		this.setProperty("textDirection", sDirection, true);
		this._createLabel("setTextDirection", sDirection);
		return this;
	};

	BusyIndicator.prototype.setCustomIcon = function (iSrc) {
		this.setProperty("customIcon", iSrc, false);
		this._createCustomIcon("setSrc", iSrc);
		return this;
	};

	BusyIndicator.prototype.setCustomIconRotationSpeed = function (iSpeed) {
		if (isNaN(iSpeed) || iSpeed < 0) {
			iSpeed = 0;
		}

		if (iSpeed !== this.getCustomIconRotationSpeed()) {
			this.setProperty("customIconRotationSpeed", iSpeed, true);
			this._setRotationSpeed();
		}

		return this;
	};

	BusyIndicator.prototype.setCustomIconDensityAware = function (bAware) {
		this.setProperty("customIconDensityAware", bAware, true);
		this._createCustomIcon("setDensityAware", bAware);
		return this;
	};

	BusyIndicator.prototype.setCustomIconWidth = function (sWidth) {
		this.setProperty("customIconWidth", sWidth, true);
		this._createCustomIcon("setWidth", sWidth);
		return this;
	};

	BusyIndicator.prototype.setCustomIconHeight = function (sHeight) {
		this.setProperty("customIconHeight", sHeight, true);
		this._createCustomIcon("setHeight", sHeight);
		return this;
	};

	BusyIndicator.prototype.onBeforeRendering = function () {
		if (this.getCustomIcon()) {
			this.setBusy(false);
		} else {
			this.setBusy(true, "busy-area");
		}
	};

	BusyIndicator.prototype.exit = function () {
		if (this._iconImage) {
			this._iconImage.destroy();
			this._iconImage = null;
		}

		if (this._busyLabel) {
			this._busyLabel.destroy();
			this._busyLabel = null;
		}
	};

	BusyIndicator.prototype._createCustomIcon = function(sName, sValue){
		if (!this._iconImage) {
			this._iconImage = new sap.m.Image(this.getId() + "-icon", {
				width: "44px",
				height: "44px"
			}).addStyleClass("sapMBsyIndIcon");

			this._iconImage.addEventDelegate({
				onAfterRendering: function() {
					this._setRotationSpeed();
				}
			}, this);
		}

		this._iconImage[sName](sValue);
		this._setRotationSpeed();
	};

	BusyIndicator.prototype._createLabel = function (sName, sValue) {
		if (!this._busyLabel) {
			this._busyLabel = new sap.m.Label(this.getId() + "-label", {
				labelFor: this.getId(),
				textAlign: "Center"
			});
		}

		this._busyLabel[sName](sValue);
	};

	BusyIndicator.prototype._setRotationSpeed = function () {
		if (!this._iconImage) {
			return;
		}

		if (jQuery.support.cssAnimations) {
			var $icon = this._iconImage.$();
			var sRotationSpeed = this.getCustomIconRotationSpeed() + "ms";

			$icon.css("-webkit-animation-duration", sRotationSpeed)
				.css("animation-duration", sRotationSpeed);

			//Bug in Chrome: After changing height of image -> changing the rotationspeed will have no affect
			//chrome needs a rerendering of this element.
			$icon.css("display", "none");
			setTimeout(function() {
				$icon.css("display", "inline");
			}, 0);
		} else { // IE9
			this._rotateCustomIcon();
		}
	};

	BusyIndicator.prototype._rotateCustomIcon = function(){
		if (!this._iconImage) {
			return;
		}
		var $icon = this._iconImage.$();

		// stop if the custom icon is not available or hidden:
		if (!$icon[0] || !$icon[0].offsetWidth) {
			return;
		}

		var iRotationSpeed = this.getCustomIconRotationSpeed();
		if (!iRotationSpeed) {
			return;
		}

		if (!this._fnRotateCustomIcon) {
			this._fnRotateCustomIcon = jQuery.proxy(this._rotateCustomIcon, this);
		}
		var fnRotateCustomIcon = this._fnRotateCustomIcon;

		if (!this._$CustomRotator) {
			this._$CustomRotator = jQuery({deg: 0});
		}
		var $rotator = this._$CustomRotator;

		if ($rotator.running) {
			return;
		}

		// restart animation
		$rotator[0].deg = 0;

		$rotator.animate({deg: 360}, {
			duration: iRotationSpeed,
			easing: "linear",
			step: function(now) {
				$rotator.running = true;
				$icon.css("-ms-transform", 'rotate(' + now + 'deg)');
			},
			complete: function(){
				$rotator.running = false;
				window.setTimeout(fnRotateCustomIcon, 10);
			}
		});
	};

	return BusyIndicator;

}, /* bExport= */ true);
