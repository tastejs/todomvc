/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.m.Panel.
sap.ui.define(['jquery.sap.global', './library', 'sap/ui/core/Control', 'sap/ui/core/IconPool'],
	function(jQuery, library, Control, IconPool) {
	"use strict";

	/**
	 * Constructor for a new Panel.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * The Panel control is a container for controls which has a header and content.
	 * The header is always visible while the content can be collapsed if the Panel is expandable.
	 * @extends sap.ui.core.Control
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @since 1.16
	 * @alias sap.m.Panel
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var Panel = Control.extend("sap.m.Panel", /** @lends sap.m.Panel.prototype */ { metadata : {
		library : "sap.m",
		properties : {

			/**
			 * This property is used to set the header text of the Panel.
			 * The "headerText" is visible in both expanded and collapsed state.
			 * Note: This property is overwritten by the "headerToolbar" aggregation.
			 */
			headerText : {type : "string", group : "Data", defaultValue : null},

			/**
			 * Determines the Panel width.
			 */
			width : {type : "sap.ui.core.CSSSize", group : "Appearance", defaultValue : "100%"},

			/**
			 * Determines the Panel height.
			 */
			height : {type : "sap.ui.core.CSSSize", group : "Appearance", defaultValue : "auto"},

			/**
			 * Specifies whether the control is expandable.
			 * This allows for collapsing or expanding the infoToolbar (if available) and content of the Panel.
			 * Note: If expandable is set to false, the Panel will always be rendered expanded.
			 * @since 1.22
			 */
			expandable : {type : "boolean", group : "Appearance", defaultValue : false},

			/**
			 * Indicates whether the Panel is expanded or not.
			 * If expanded is set to true, then both the infoToolbar (if available) and the content are rendered.
			 * If expanded is set to false, then only the headerText or headerToolbar is rendered.
			 * @since 1.22
			 */
			expanded : {type : "boolean", group : "Appearance", defaultValue : false},

			/**
			 * Indicates whether the transition between the expanded and the collapsed state of the control is animated.
			 * By default the animation is enabled.
			 * @since 1.26
			 */
			expandAnimation : {type : "boolean", group : "Behavior", defaultValue : true},

			/**
			 * This property is used to set the background color of the Panel.
			 * Depending on the theme you can change the state of the background from "Solid" over "Translucent" to "Transparent".
			 * @since 1.30
			 */
			backgroundDesign : {type : "sap.m.BackgroundDesign", group : "Appearance", defaultValue : sap.m.BackgroundDesign.Translucent}
		},
		defaultAggregation : "content",
		aggregations : {

			/**
			 * Determines the content of the Panel.
			 * The content will be visible only when the Panel is expanded.
			 */
			content : {type : "sap.ui.core.Control", multiple : true, singularName : "content"},

			/**
			 * This aggregation allows the use of a custom Toolbar as header for the Panel.
			 * The "headerToolbar" is visible in both expanded and collapsed state.
			 * Use it when you want to add extra controls for user interactions in the header.
			 * Note: This aggregation overwrites "headerText" property.
			 * @since 1.16
			 */
			headerToolbar : {type : "sap.m.Toolbar", multiple : false},

			/**
			 * This aggregation allows the use of a custom Toolbar as information bar for the Panel.
			 * The "infoToolbar" is placed below the header and is visible only in expanded state.
			 * Use it when you want to show extra information to the user.
			 * @since 1.16
			 */
			infoToolbar : {type : "sap.m.Toolbar", multiple : false}
		},
		events : {

			/**
			 * Indicates that the panel will expand or collapse
			 * @since 1.22
			 */
			expand : {
				parameters : {

					/**
					 * If the panel will expand, this is true.
					 * If the panel will collapse, this is false.
					 */
					expand : {type : "boolean"}
				}
			}
		}
	}});

	Panel.prototype.init = function () {
		this.data("sap-ui-fastnavgroup", "true", true); // Define group for F6 handling
	};

	/**
	 * Sets the width of the panel.
	 * @param {sap.ui.core.CSSSize} sWidth The width of the Panel as CSS size.
	 * @returns {sap.m.Panel} Pointer to the control instance to allow method chaining.
	 * @public
	 */
	Panel.prototype.setWidth = function (sWidth) {
		this.setProperty("width", sWidth, true);

		var oDomRef = this.getDomRef();
		if (oDomRef) {
			oDomRef.style.width = sWidth;
		}

		return this;
	};

	/**
	 * Sets the height of the panel.
	 * @param {sap.ui.core.CSSSize} sHeight The height of the panel as CSS size.
	 * @returns {sap.m.Panel} Pointer to the control instance to allow method chaining.
	 * @public
	 */
	Panel.prototype.setHeight = function (sHeight) {
		this.setProperty("height", sHeight, true);

		var oDomRef = this.getDomRef();
		if (oDomRef) {
			oDomRef.style.height = sHeight;
			this._setContentHeight();
		}

		return this;
	};

	/**
	 * Sets the expandable property of the control.
	 * @param {boolean} bExpandable Defines whether the control is expandable or not.
	 * @returns {sap.m.Panel} Pointer to the control instance to allow method chaining.
	 * @public
	 */
	Panel.prototype.setExpandable = function (bExpandable) {
		this.setProperty("expandable", bExpandable, false); // rerender since we set certain css classes

		if (bExpandable && !this.oIconCollapsed) {
			this.oIconCollapsed = this._createIcon();
		}

		return this;
	};

	/**
	 * Sets the expanded property of the control.
	 * @param {boolean} bExpanded Defines whether control is expanded or not.
	 * @returns {sap.m.Panel} Pointer to the control instance to allow method chaining.
	 * @public
	 */
	Panel.prototype.setExpanded = function (bExpanded) {
		if (bExpanded === this.getExpanded()) {
			return this;
		}

		this.setProperty("expanded", bExpanded, true);

		if (!this.getExpandable()) {
			return this;
		}

		// ARIA
		this._getIcon().$().attr("aria-expanded", bExpanded.toString());

		this._toggleExpandCollapse();
		this._toggleCssClasses();
		this.fireExpand({ expand : bExpanded });

		return this;
	};

	Panel.prototype.onBeforeRendering = function () {
		var sId;

		if (this.oIconCollapsed) {
			sId = this._getLabellingElementId();
			this.oIconCollapsed.addAriaLabelledBy(sId);
		}
	};

	Panel.prototype.onAfterRendering = function () {
		var $this = this.$(),
			$icon;

		this._setContentHeight();

		if (this.getExpandable()) {
			$icon = this.oIconCollapsed.$();
			if (this.getExpanded()) {
				// this is relevant when we create Panel specifying the expanded property as 'constructor parameter'
				$this.children(".sapMPanelWrappingDiv").addClass("sapMPanelWrappingDivExpanded");
				$this.children(".sapMPanelWrappingDivTb").addClass("sapMPanelWrappingDivTbExpanded");
				//ARIA
				$icon.attr("aria-expanded", "true");
			} else {
				// hide those parts which are collapsible (w/o animation, otherwise initial loading doesn't look good ...)
				$this.children(".sapMPanelExpandablePart").hide();
				//ARIA
				$icon.attr("aria-expanded", "false");
			}
		}
	};

	Panel.prototype.exit = function () {
		if (this.oIconCollapsed) {
			this.oIconCollapsed.destroy();
			delete this.oIconCollapsed;
		}
	};

	Panel.prototype._createIcon = function () {
		var that = this,
			sCollapsedIconURI = IconPool.getIconURI("navigation-right-arrow");

		return IconPool.createControlByURI({
			id: that.getId() + "-CollapsedImg",
			src: sCollapsedIconURI,
			decorative: false,
			useIconTooltip: false,
			press: function () {
				that.setExpanded(!that.getExpanded());
			}
		}).addStyleClass("sapMPanelExpandableIcon");
	};

	Panel.prototype._getIcon = function () {
		return this.oIconCollapsed;
	};

	Panel.prototype._setContentHeight = function () {
		if (this.getHeight() === "auto") {
			return;
		}

		var iHeight = 0,
			oHeaderToolbar = this.getHeaderToolbar(),
			oInfoToolbar = this.getInfoToolbar(),
			$this = this.$();

		if (oHeaderToolbar) {
			iHeight += parseInt(oHeaderToolbar.$().outerHeight(), 10);
		}

		if (!oHeaderToolbar && this.getHeaderText() !== "") {
			iHeight += parseInt($this.find(".sapMPanelHdr").first().outerHeight(), 10);
		}

		if (oInfoToolbar) {
			iHeight += parseInt(oInfoToolbar.$().outerHeight(), 10);
		}

		$this.children(".sapMPanelContent").css("height", parseInt($this.outerHeight(), 10) - iHeight);
	};

	Panel.prototype._toggleExpandCollapse = function () {
		var oOptions = {};
		if (!this.getExpandAnimation()) {
			oOptions.duration = 0;
		}

		this.$().children(".sapMPanelExpandablePart").slideToggle(oOptions);
	};

	Panel.prototype._toggleCssClasses = function () {
		var $this = this.$();

		// for controlling the visibility of the border
		$this.children(".sapMPanelWrappingDiv").toggleClass("sapMPanelWrappingDivExpanded");
		$this.children(".sapMPanelWrappingDivTb").toggleClass("sapMPanelWrappingDivTbExpanded");
		$this.find(".sapMPanelExpandableIcon").first().toggleClass("sapMPanelExpandableIconExpanded");
	};

	Panel.prototype._getLabellingElementId = function () {
		var headerToolbar = this.getHeaderToolbar(),
			id;

		if (headerToolbar) {
			id = headerToolbar.getId();
		} else {
			id = this.getId() + "-header";
		}

		return id;
	};

	return Panel;

}, /* bExport= */ true);
