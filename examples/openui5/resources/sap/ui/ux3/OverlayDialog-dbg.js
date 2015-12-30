/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.ux3.OverlayDialog.
sap.ui.define(['jquery.sap.global', 'sap/ui/core/IntervalTrigger', './Overlay', './library'],
	function(jQuery, IntervalTrigger, Overlay, library) {
	"use strict";

	/**
	 * Constructor for a new OverlayDialog.
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given.
	 * @param {object} [mSettings] Initial settings for the new control.
	 *
	 * @class
	 * Dialog implementation based on the Overlay. If used in a Shell it leaves the Tool-Palette, Pane-Bar and Header-Items accessible.
	 * @extends sap.ui.ux3.Overlay
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @alias sap.ui.ux3.OverlayDialog
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var OverlayDialog = Overlay.extend("sap.ui.ux3.OverlayDialog", /** @lends sap.ui.ux3.OverlayDialog.prototype */ {
		metadata: {
			library: "sap.ui.ux3",
			properties: {
				/**
				 * Determines the width of the Overlay Dialog. If the width is set to "auto" it is always 50% of the overlay width.
				 */
				width: {type: "sap.ui.core.CSSSize", group: "Dimension", defaultValue: 'auto'},

				/**
				 * Determines the height of the Overlay Dialog. If the height is set to "auto" it is always 50% of the overlay height.
				 */
				height: {type: "sap.ui.core.CSSSize", group: "Dimension", defaultValue: 'auto'}
			},
			aggregations: {
				/**
				 * Content for the OverlayDialog.
				 */
				content: {type: "sap.ui.core.Control", multiple: true, singularName: "content"}
			}
		}
	});

	/**
	 * @private
	 */
	OverlayDialog.prototype.init = function(){
		Overlay.prototype.init.apply(this);
		//OverlayDialog must not have an open button
		this.setProperty("openButtonVisible",false);
		OverlayDialog.Trigger = new IntervalTrigger(300);
	};

	/**
	 * Focus the last focusable element.
	 *
	 * @private
	 */
	OverlayDialog.prototype._setFocusLast = function() {
		var oFocus = this.$("content").lastFocusableDomRef();
		if (!oFocus && this.getCloseButtonVisible()) {
			oFocus = this.getDomRef("close");
		}
		jQuery.sap.focus(oFocus);
	};

	/**
	 * Focus the first focusable element.
	 *
	 * @private
	 */
	OverlayDialog.prototype._setFocusFirst = function() {
		if (this.getCloseButtonVisible()) {
			jQuery.sap.focus(this.getDomRef("close"));
		} else {
			jQuery.sap.focus(this.$("content").firstFocusableDomRef());
		}
	};

	/**
	 * This Method is not supported for the OverlayDialog.
	 *
	 * @param {boolean} bVisible
	 * @public
	 */
	OverlayDialog.prototype.setOpenButtonVisible = function(bVisible) {
		jQuery.sap.log.warning("OverlayDialog does not support an openButton.");
		return undefined;
	};

	/**
	 * The width for the OverlayDialog.
	 *
	 * @param {sap.ui.core.CSSSize} sWidth
	 * @public
	 */
	OverlayDialog.prototype.setWidth = function(sWidth) {
		if (sWidth == "auto" || sWidth == "inherit") {
			sWidth = "auto";
		}
		return this.setProperty("width", sWidth);
	};

	/**
	 * The height for the OverlayDialog.
	 *
	 * @param {sap.ui.core.CSSSize} sHeight
	 * @public
	 */
	OverlayDialog.prototype.setHeight = function(sHeight) {
		if (sHeight == "auto" || sHeight == "inherit") {
			sHeight = "auto";
		}
		return this.setProperty("height", sHeight);
	};

	/**
	 * @private
	 */
	OverlayDialog.prototype.onBeforeRendering = function(){
		Overlay.prototype.onBeforeRendering.apply(this, arguments);
		this._cleanup();
	};

	/**
	 * @private
	 */
	OverlayDialog.prototype.onAfterRendering = function(){
		Overlay.prototype.onAfterRendering.apply(this, arguments);
		OverlayDialog.Trigger.addListener(this._checkChange, this);
	};

	/**
	 * @private
	 */
	OverlayDialog.prototype._cleanup = function(){
		OverlayDialog.Trigger.removeListener(this._checkChange, this);
		this.contentWidth = null;
		this.contentHeight = null;
		this.overlayWidth = null;
		this.overlayHeight = null;
	};

	/**
	 * @private
	 */
	OverlayDialog.prototype.exit = function() {
		this._cleanup();
		Overlay.prototype.exit.apply(this,arguments);
	};

	/**
	 * @private
	 */
	OverlayDialog.prototype._checkChange = function(){
		if (!this.getDomRef()) {
			return;
		}

		var $content = this.$("content"),
			$overlay = this.$(),
			bAutoWidth = this.getWidth() === "auto",
			bAutoHeight = this.getHeight() === "auto";

		var contentWidth = bAutoWidth ? $overlay.width() / 2 : $content.width(),
			contentHeight = bAutoHeight ? $overlay.height() / 2 : $content.height(),
			overlayWidth = $overlay.width(),
			overlayHeight = $overlay.height();

		if (contentWidth != this.contentWidth || contentHeight != this.contentHeight
			|| overlayWidth != this.overlayWidth || overlayHeight != this.overlayHeight) {

			$content.css("left", "0").css("right", "auto").css("top", "0").css("bottom", "auto").css("width", this.getWidth()).css("height", this.getHeight());

			this.contentWidth = bAutoWidth ? $overlay.width() / 2 : $content.width();
			this.contentHeight = bAutoHeight ? $overlay.height() / 2 : $content.height();
			this.overlayWidth = overlayWidth;
			this.overlayHeight = overlayHeight;

			var $close = this.$("close");

			if (this.contentWidth < this.overlayWidth) {
				$content.css("left", "50%");
				$content.css("right", "auto");
				$content.css("margin-left", ( -1) * this.contentWidth / 2 + "px");
				$content.css("width",  bAutoHeight ? this.contentWidth : this.getWidth());
				$close.css("right", "50%");
				$close.css("margin-right", ( -1) * this.contentWidth / 2 - 10 + "px");
			} else {
				$content.css("left", "0");
				$content.css("right", "10px");
				$content.css("margin-left", "0");
				$content.css("width", "auto");
				$close.css("right", "0");
				$close.css("margin-right", "0");
			}

			if (this.contentHeight < this.overlayHeight - 30/*Bottom Border (NotificationBar)*/) {
				$content.css("top", "50%");
				$content.css("bottom", "auto");
				$content.css("margin-top", ( -1) * this.contentHeight / 2 + "px");
				$content.css("height",  bAutoHeight ? this.contentHeight : this.getHeight());
				$close.css("top", "50%");
				$close.css("margin-top", ( -1) * this.contentHeight / 2 - 10 + "px");
			} else {
				$content.css("top", "10px");
				$content.css("bottom", "30px");
				$content.css("margin-top", "0");
				$content.css("height", "auto");
				$close.css("top", "0");
				$close.css("margin-top", "0");
			}
		}
	};

	return OverlayDialog;
}, /* bExport= */ true);
