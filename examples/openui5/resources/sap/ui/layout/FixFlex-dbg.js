/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.layout.FixFlex.
sap.ui.define(["jquery.sap.global", "sap/ui/core/Control", "sap/ui/core/EnabledPropagator", "sap/ui/core/ResizeHandler", "./library"],
	function (jQuery, Control, EnabledPropagator, ResizeHandler, library) {
		"use strict";

		/**
		 * Constructor for a new FixFlex.
		 *
		 * @param {string} [sId] id for the new control, generated automatically if no id is given
		 * @param {object} [mSettings] initial settings for the new control
		 *
		 * @class
		 * The FixFlex control builds the container for a layout with a fixed and a flexible part. The flexible container adapts its size to the fix container. The fix container can hold any number of controls, while the flexible container can hold only one.
		 *
		 * In order for the FixFlex to stretch properly, the parent element, in which the control is placed, needs to have a specified height or needs to have an absolute position.
		 *
		 * Warning: Avoid nesting FixFlex in other flexbox based layout controls (FixFlex, FlexBox, Hbox, Vbox). Otherwise contents may be not accessible or multiple scrollbars can appear.
		 *
		 * Note: If the child control of the flex or the fix container has width/height bigger than the container itself, the child control will be cropped in the view. If minFlexSize is set, then a scrollbar is shown in the flexible part, depending on the vertical property.
		 * @extends sap.ui.core.Control
		 *
		 * @author SAP SE
		 * @version 1.32.9
		 *
		 * @constructor
		 * @public
		 * @since 1.25.0
		 * @alias sap.ui.layout.FixFlex
		 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
		 */
		var FixFlex = Control.extend("sap.ui.layout.FixFlex", /** @lends sap.ui.layout.FixFlex.prototype */ {
			metadata: {

				library: "sap.ui.layout",
				properties: {

					/**
					 * Determines the direction of the layout of child elements. True for vertical and false for horizontal layout.
					 */
					vertical: {type: "boolean", group: "Appearance", defaultValue: true},

					/**
					 * Determines whether the fixed-size area should be on the beginning/top ( if the value is "true") or beginning/bottom ( if the value is "false").
					 */
					fixFirst: {type: "boolean", group: "Misc", defaultValue: true},

					/**
					 * Determines the height (if the vertical property is "true") or the width (if the vertical property is "false") of the fixed area. If left at the default value "auto", the fixed-size area will be as large as its content. In this case the content cannot use percentage sizes.
					 */
					fixContentSize: {type: "sap.ui.core.CSSSize", group: "Dimension", defaultValue: "auto"},

					/**
					 * Enables scrolling inside the flexible part. The given size is calculated in "px". If the child control in the flexible part is larger then the available flexible size on the screen and if the available size for the flexible part is smaller or equal to the minFlexSize value, the scroll will be for the entire FixFlex control.
					 *
					 * @since 1.29
					 */
					minFlexSize: {type: "int", defaultValue: 0}
				},
				aggregations: {

					/**
					 * Controls in the fixed part of the layout.
					 */
					fixContent: {type: "sap.ui.core.Control", multiple: true, singularName: "fixContent"},

					/**
					 * Control in the stretching part of the layout.
					 */
					flexContent: {type: "sap.ui.core.Control", multiple: false}
				}
			}
		});


		EnabledPropagator.call(FixFlex.prototype);

		/**
		 * Calculate height/width on the flex part when flexbox is not supported
		 *
		 * @private
		 */
		FixFlex.prototype._handlerResizeNoFlexBoxSupport = function () {
			var $Control = this.$(),
				$FixChild,
				$FlexChild;

			// Exit if the container is invisible
			if (!$Control.is(":visible")) {
				return;
			}

			$FixChild = this.$("Fixed");
			$FlexChild = this.$("Flexible");

			// Remove the style attribute from previous calculations
			$FixChild.removeAttr("style");
			$FlexChild.removeAttr("style");

			if (this.getVertical()) {
				$FlexChild.height(Math.floor($Control.height() - $FixChild.height()));
			} else {
				$FlexChild.width(Math.floor($Control.width() - $FixChild.width()));
				$FixChild.width(Math.floor($FixChild.width()));
			}
		};

		/**
		 * Deregister the control
		 *
		 * @private
		 */
		FixFlex.prototype._deregisterControl = function () {
			// Deregister resize event
			if (this.sResizeListenerNoFlexBoxSupportId) {
				ResizeHandler.deregister(this.sResizeListenerNoFlexBoxSupportId);
				this.sResizeListenerNoFlexBoxSupportId = null;
			}

			// Deregister resize event for Fixed part
			if (this.sResizeListenerNoFlexBoxSupportFixedId) {
				ResizeHandler.deregister(this.sResizeListenerNoFlexBoxSupportFixedId);
				this.sResizeListenerNoFlexBoxSupportFixedId = null;
			}

			// Deregister resize event for FixFlex scrolling
			if (this.sResizeListenerFixFlexScroll) {
				ResizeHandler.deregister(this.sResizeListenerFixFlexScroll);
				this.sResizeListenerFixFlexScroll = null;
			}

			// Deregister resize event for FixFlex scrolling for Flex part
			if (this.sResizeListenerFixFlexScrollFlexPart) {
				ResizeHandler.deregister(this.sResizeListenerFixFlexScrollFlexPart);
				this.sResizeListenerFixFlexScrollFlexPart = null;
			}
		};

		/**
		 * Change FixFlex scrolling position
		 * @private
		 */
		FixFlex.prototype._changeScrolling = function () {
			var nFlexSize,
				sDirection,
				$this = this.$(),
				nMinFlexSize = this.getMinFlexSize();

			if (this.getVertical() === true) {
				nFlexSize = this.$().height() - this.$("Fixed").height();
				sDirection = "height";
			} else {
				nFlexSize = this.$().width() - this.$("Fixed").width();
				sDirection = "width";
			}

			// Add scrolling inside Flexible container
			if (nFlexSize < parseInt(this.getMinFlexSize(), 10)) {
				$this.addClass("sapUiFixFlexScrolling");
				$this.removeClass("sapUiFixFlexInnerScrolling");

				// BCP Incident-ID: 1570246771
				if (this.$("FlexibleContainer").children().height() > nMinFlexSize) {
					this.$("Flexible").attr("style", "min-" + sDirection + ":" + nMinFlexSize + "px");
				} else {
					// If the child control is smaller then the content,
					// the flexible part need to have set height/width, else the child control can"t resize to max
					this.$("Flexible").attr("style", sDirection + ":" + nMinFlexSize + "px");
				}

			} else { // Add scrolling for entire FixFlex
				$this.addClass("sapUiFixFlexInnerScrolling");
				$this.removeClass("sapUiFixFlexScrolling");
				this.$("Flexible").removeAttr("style");
			}
		};

		/**
		 * @private
		 */
		FixFlex.prototype.exit = function () {
			this._deregisterControl();
		};

		/**
		 * @private
		 */
		FixFlex.prototype.onBeforeRendering = function () {
			this._deregisterControl();
		};

		/**
		 * @private
		 */
		FixFlex.prototype.onAfterRendering = function () {
			// Fallback for older browsers
			if (!jQuery.support.hasFlexBoxSupport) {
				this.sResizeListenerNoFlexBoxSupportFixedId = ResizeHandler.register(this.getDomRef("Fixed"), jQuery.proxy(this._handlerResizeNoFlexBoxSupport, this));
				this.sResizeListenerNoFlexBoxSupportId = ResizeHandler.register(this.getDomRef(), jQuery.proxy(this._handlerResizeNoFlexBoxSupport, this));
				this._handlerResizeNoFlexBoxSupport();
			}

			// Add handler for FixFlex scrolling option
			if (this.getMinFlexSize() !== 0) {
				this.sResizeListenerFixFlexScroll = ResizeHandler.register(this.getDomRef(), jQuery.proxy(this._changeScrolling, this));
				this.sResizeListenerFixFlexScrollFlexPart = ResizeHandler.register(this.getDomRef("Fixed"), jQuery.proxy(this._changeScrolling, this));

				if (sap.ui.Device.browser.edge === true) {
					// In some cases the resize handlers are not triggered in "Edge" browser on initial render and
					// a manual trigger is needed
					// BCP: 1570807842
					this._changeScrolling();
				}
			}
		};

		/**
		 * @private
		 * @param {Object} oEvent
		 */
		FixFlex.prototype.ontouchmove = function (oEvent) {
			// mark the event for components that needs to know if the event was handled
			oEvent.setMarked();
		};

		return FixFlex;

	}, /* bExport= */ true);
