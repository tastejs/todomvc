/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.layout.DynamicSideContent.
sap.ui.define(['jquery.sap.global', 'sap/ui/core/Control', 'sap/ui/core/ResizeHandler'],
	function (jQuery, Control, ResizeHandler) {
		"use strict";

		/**
		 * Constructor for a new DynamicSideContent.
		 *
		 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
		 * @param {object} [mSettings] Initial settings for the new control
		 *
		 * @class
		 * The DynamicSideContent control allows additional (side) content to be displayed alongside or below the main
		 * content, within the container the control is used in. There are different size ratios between the main and
		 * the side content for the different breakpoints. The side content position (alongside/below the main content)
		 * and visibility (visible/hidden) can be configured per breakpoint. There are 4 predefined breakpoints:
		 * - Screen width > 1440 px (XL breakpoint)
		 * - Screen width <= 1440 px (L breakpoint)
		 * - Main content width <= 600 px (M breakpoint)
		 * - Screen width <= 720 px (S breakpoint)
		 *
		 * @extends sap.ui.core.Control
		 *
		 * @author SAP SE
		 * @version 1.32.9
		 *
		 * @constructor
		 * @public
		 * @since 1.30
		 * @alias sap.ui.layout.DynamicSideContent
		 */
		var DynamicSideContent = Control.extend("sap.ui.layout.DynamicSideContent", /** @lends sap.ui.layout.DynamicSideContent.prototype */ { metadata : {
			library : "sap.ui.layout",
			properties : {

				/**
				 * Determines whether the side content is visible or hidden.
				 */
				showSideContent : {type : "boolean", group : "Appearance", defaultValue : true},

				 /**
				 * Determines whether the main content is visible or hidden.
				 */
				showMainContent : {type : "boolean", group : "Appearance", defaultValue : true},

				/**
				 * Determines on which breakpoints the side content is visible.
				 */
				sideContentVisibility : {type : "sap.ui.layout.SideContentVisibility", group : "Appearance", defaultValue : sap.ui.layout.SideContentVisibility.ShowAboveS},

				/**
				 * Determines on which breakpoints the side content falls down below the main content.
				 */
				sideContentFallDown : {type : "sap.ui.layout.SideContentFallDown", group : "Appearance", defaultValue : sap.ui.layout.SideContentFallDown.OnMinimumWidth},

				/**
				 * Defines whether the control is in equal split mode. In this mode, the side and the main content
				 * take 50:50 percent of the container on all screen sizes except for phone, where the main and
				 * side contents are switching visibility using the toggle method.
				 */
				equalSplit : {type : "boolean", group : "Appearance", defaultValue : false},

				/**
				 * If set to TRUE, then not the media Query (device screen size) but the size of the container, surrounding the control, defines the current range.
				 */
				containerQuery : {type : "boolean", group : "Behavior", defaultValue : false}
			},
			defaultAggregation : "mainContent",
			events : {
				/**
				 * Fires when the current breakpoint has been changed.
				 * @since 1.32
				 */
				breakpointChanged : {
					parameters : {
						currentBreakpoint : {type : "string"}
					}
				}
			},
			aggregations : {

				/**
				 * Main content controls.
				 */
				mainContent : {type: "sap.ui.core.Control", multiple:  true},

				/**
				 * Side content controls.
				 */
				sideContent : {type: "sap.ui.core.Control", multiple:  true}
			}
		}});

		var	S = "S",
			M = "M",
			L = "L",
			XL = "XL",
			HIDDEN_CLASS = "sapUiHidden",
			SPAN_SIZE_12_CLASS = "sapUiDSCSpan12",
			MC_FIXED_CLASS = "sapUiDSCMCFixed",
			SC_FIXED_CLASS = "sapUiDSCSCFixed",
			SPAN_SIZE_3 = 3,
			SPAN_SIZE_4 = 4,
			SPAN_SIZE_6 = 6,
			SPAN_SIZE_8 = 8,
			SPAN_SIZE_9 = 9,
			SPAN_SIZE_12 = 12,
			INVALID_BREAKPOINT_ERROR_MSG = "Invalid Breakpoint. Expected: S, M, L or XL",
			INVALID_PARENT_WIDTH_ERROR_MSG = "Invalid input. Only values greater then 0 are allowed",
			SC_GRID_CELL_SELECTOR = "SCGridCell",
			MC_GRID_CELL_SELECTOR = "MCGridCell",
			S_M_BREAKPOINT = 720,
			M_L_BREAKPOINT = 1024,
			L_XL_BREAKPOINT = 1440;

		DynamicSideContent.prototype.init = function () {
			this._bSuppressInitialFireBreakPointChange = true;
		};

		/**
		 * Sets the showSideContent property.
		 * @param {boolean} bVisible Determines if the side content part is visible
		 * @param {boolean} bSuppressVisualUpdate Determines if the visual state is updated
		 * @returns {sap.m.DynamicSideContent} this pointer for chaining
		 * @override
		 * @public
		 */
		DynamicSideContent.prototype.setShowSideContent = function (bVisible, bSuppressVisualUpdate) {
			this.setProperty("showSideContent", bVisible, true);
			this._SCVisible = bVisible;
			if (!bSuppressVisualUpdate && this.$().length) {
				this._setResizeData(this.getCurrentBreakpoint(), this.getEqualSplit());
				if (this._currentBreakpoint === S) {
					this._MCVisible = true;
				}
				this._changeGridState();
			}
			return this;
		};

		/**
		 * Sets the showMainContent property.
		 * @param {boolean} bVisible Determines if the main content part is visible
		 * @param {boolean} bSuppressVisualUpdate Determines if the visual state is updated
		 * @returns {sap.m.DynamicSideContent} this pointer for chaining
		 * @override
		 * @public
		 */
		DynamicSideContent.prototype.setShowMainContent = function (bVisible, bSuppressVisualUpdate) {
			this.setProperty("showMainContent", bVisible, true);
			this._MCVisible = bVisible;
			if (!bSuppressVisualUpdate && this.$().length) {
				this._setResizeData(this.getCurrentBreakpoint(), this.getEqualSplit());
				if (this._currentBreakpoint === S) {
					this._SCVisible = true;
				}
				this._changeGridState();
			}
			return this;
		};

		/**
		 * Gets the value of showSideContent property.
		 * @returns {boolean} Side content visibility state
		 * @override
		 * @public
		 */
		DynamicSideContent.prototype.getShowSideContent = function () {
			if (this._currentBreakpoint === S) {
				return this._SCVisible && this.getProperty("showSideContent");
			} else {
				return this.getProperty("showSideContent");
			}
		};

		/**
		 * Gets the value of showMainContent property.
		 * @returns {boolean} Side content visibility state
		 * @override
		 * @public
		 */
		DynamicSideContent.prototype.getShowMainContent = function () {
			if (this._currentBreakpoint === S) {
				return this._MCVisible && this.getProperty("showMainContent");
			} else {
				return this.getProperty("showMainContent");
			}
		};

		/**
		 * Sets or unsets the page in equalSplit mode.
		 * @param {boolean}[bState] Determines if the page is set to equalSplit mode
		 * @returns {sap.m.DynamicSideContent} this pointer for chaining
		 * @override
		 * @public
		 */
		DynamicSideContent.prototype.setEqualSplit = function (bState) {
			this._MCVisible = true;
			this._SCVisible = true;
			this.setProperty("equalSplit", bState, true);
			if (this._currentBreakpoint) {
				this._setResizeData(this._currentBreakpoint, bState);
				this._changeGridState();
			}
			return this;
		};

		/**
		 * Adds a control to the side content area.
		 * Only the side content part in the aggregation is re-rendered.
		 * @param {object} oControl Object to be added in the aggregation
		 * @returns {sap.m.DynamicSideContent} this pointer for chaining
		 * @override
		 * @public
		 */
		DynamicSideContent.prototype.addSideContent = function (oControl) {
			this.addAggregation("sideContent", oControl, true);
			// Rerender only the part of the control that is changed
			this._rerenderControl(this.getAggregation("sideContent"), this.$(SC_GRID_CELL_SELECTOR));
			return this;
		};

		/**
		 * Adds a control to the main content area.
		 * Only the main content part in the aggregation is re-rendered.
		 * @param {object} oControl Object to be added in the aggregation
		 * @returns {sap.m.DynamicSideContent} this pointer for chaining
		 * @override
		 * @public
		 */
		DynamicSideContent.prototype.addMainContent = function (oControl) {
			this.addAggregation("mainContent", oControl, true);
			// Rerender only the part of the control that is changed
			this._rerenderControl(this.getAggregation("mainContent"), this.$(MC_GRID_CELL_SELECTOR));
			return this;
		};

		/**
		 * Used for the toggle button functionality.
		 * When the control is on a phone screen size only, one control area is visible.
		 * This helper method is used to implement a button/switch for changing
		 * between the main and side content areas.
		 * Only works if the current breakpoint is "S".
		 * @returns {sap.m.DynamicSideContent} this pointer for chaining
		 * @public
		 */
		DynamicSideContent.prototype.toggle = function () {
			if (this._currentBreakpoint === S) {

				if (!this.getProperty("showMainContent")) {
					this.setShowMainContent(true, true);
					this._MCVisible = false;
				}
				if (!this.getProperty("showSideContent")) {
					this.setShowSideContent(true, true);
					this._SCVisible = false;
				}

				if (this._MCVisible && !this._SCVisible) {
					this._SCVisible = true;
					this._MCVisible = false;
				} else if (!this._MCVisible && this._SCVisible) {
					this._MCVisible = true;
					this._SCVisible = false;
				}

				this._changeGridState();
			}
			return this;
		};

		/**
		 * Returns the breakpoint for the current state of the control.
		 * @returns {String} currentBreakpoint
		 * @public
		 */
		DynamicSideContent.prototype.getCurrentBreakpoint = function () {
			return this._currentBreakpoint;
		};

		/**
		 * Function is called before the control is rendered.
		 * @private
		 * @override
		 */
		DynamicSideContent.prototype.onBeforeRendering = function () {
			this._detachContainerResizeListener();

			this._SCVisible = this.getProperty("showSideContent");
			this._MCVisible = this.getProperty("showMainContent");

			if (!this.getContainerQuery()) {
				this._iWindowWidth = jQuery(window).width();
				this._setBreakpointFromWidth(this._iWindowWidth);
				this._setResizeData(this._currentBreakpoint, this.getEqualSplit());
			}
		};

		/**
		 * Function is called after the control is rendered.
		 * @private
		 * @override
		 */
		DynamicSideContent.prototype.onAfterRendering = function () {
			if (this.getContainerQuery()) {
				this._attachContainerResizeListener();
				this._handleMediaChange();
			} else {
				var that = this;
				jQuery(window).resize(function() {
					that._handleMediaChange();
				});
				this._changeGridState();
			}
			this._initScrolling();
		};

		/**
		 * Function is called when exiting the control.
		 * @private
		 */
		DynamicSideContent.prototype.exit = function () {
			this._detachContainerResizeListener();

			if (this._oSCScroller) {
				this._oSCScroller.destroy();
				this._oSCScroller = null;
			}

			if (this._oMCScroller) {
				this._oMCScroller.destroy();
				this._oMCScroller = null;
			}
		};

		/**
		 * Re-renders only part of the control that is changed.
		 * @param {object} aControls Array containing the passed aggregation controls
		 * @param {object} $domElement DOM reference of the control to be re-rendered
		 * @returns {sap.m.DynamicSideContent} this pointer for chaining
		 * @private
		 */
		DynamicSideContent.prototype._rerenderControl = function (aControls, $domElement) {
			if (this.getDomRef()) {
				var oRm = sap.ui.getCore().createRenderManager();
				this.getRenderer().renderControls(oRm, aControls);
				oRm.flush($domElement[0]);
				oRm.destroy();
			}
			return this;
		};

		/**
		 * Initializes scroll for side and main content.
		 * @private
		 */
		DynamicSideContent.prototype._initScrolling = function () {
			var sControlId = this.getId(),
				sSideContentId = sControlId + "-" + SC_GRID_CELL_SELECTOR,
				sMainContentId = sControlId + "-" + MC_GRID_CELL_SELECTOR;

			if (!this._oSCScroller && !this._oMCScroller) {
				jQuery.sap.require("sap.ui.core.delegate.ScrollEnablement");
				this._oSCScroller = new sap.ui.core.delegate.ScrollEnablement(this, null, {
					scrollContainerId: sSideContentId,
					horizontal: false,
					vertical: true
				});
				this._oMCScroller = new sap.ui.core.delegate.ScrollEnablement(this, null, {
					scrollContainerId: sMainContentId,
					horizontal: false,
					vertical: true
				});
			}
		};

		/**
		 * Attaches event listener for the needed breakpoints to the container.
		 * @private
		 */
		DynamicSideContent.prototype._attachContainerResizeListener = function () {
			if (!this._sContainerResizeListener) {
				this._sContainerResizeListener = ResizeHandler.register(this, jQuery.proxy(this._handleMediaChange, this));
			}
		};

		/**
		 * Detaches event listener for the needed breakpoints to the container.
		 * @private
		 */
		DynamicSideContent.prototype._detachContainerResizeListener = function () {
			if (this._sContainerResizeListener) {
				ResizeHandler.deregister(this._sContainerResizeListener);
				this._sContainerResizeListener = null;
			}
		};

		/**
		 * Gets the current breakpoint, related to the width, which is passed to the method.
		 * @private
		 * @param {integer} iWidth The parent container width
		 * @returns {String} Breakpoint corresponding to the width passed
		 */
		DynamicSideContent.prototype._getBreakPointFromWidth = function (iWidth) {
			if (iWidth <= 0) {
				throw new Error(INVALID_PARENT_WIDTH_ERROR_MSG);
			}
			if (iWidth <= S_M_BREAKPOINT && this._currentBreakpoint !== S) {
				return S;
			} else if ((iWidth > S_M_BREAKPOINT) && (iWidth <= M_L_BREAKPOINT) && this._currentBreakpoint !== M) {
				return M;
			} else if ((iWidth > M_L_BREAKPOINT) && (iWidth <= L_XL_BREAKPOINT) && this._currentBreakpoint !== L) {
				return L;
			} else if (iWidth > L_XL_BREAKPOINT && this._currentBreakpoint !== XL) {
				return XL;
			}
			return this._currentBreakpoint;
		};


		/**
		 * Sets the current breakpoint, related to the width, which is passed to the method.
		 * @private
		 * @param {integer} iWidth is the parent container width
		 */
		DynamicSideContent.prototype._setBreakpointFromWidth = function (iWidth) {
			if (iWidth <= 0) {
				throw new Error(INVALID_PARENT_WIDTH_ERROR_MSG);
			}
			this._currentBreakpoint = this._getBreakPointFromWidth(iWidth);
			if (this._bSuppressInitialFireBreakPointChange) {
				this._bSuppressInitialFireBreakPointChange = false;
			} else {
				this.fireBreakpointChanged({currentBreakpoint : this._currentBreakpoint});
			}
		};

		/**
		 * Handles the screen size breakpoints.
		 * @private
		 */
		DynamicSideContent.prototype._handleMediaChange = function () {
			if (this.getContainerQuery()){
				this._iWindowWidth = this.$().parent().width();
			} else {
				this._iWindowWidth = jQuery(window).width();
			}

			if (this._iWindowWidth !== this._iOldWindowWidth) {
				this._iOldWindowWidth = this._iWindowWidth;

				this._oldBreakPoint = this._currentBreakpoint;
				this._setBreakpointFromWidth(this._iWindowWidth);

				if ((this._oldBreakPoint !== this._currentBreakpoint)
					|| (this._currentBreakpoint === M
					&& this.getSideContentFallDown() === sap.ui.layout.SideContentFallDown.OnMinimumWidth)) {
					this._setResizeData(this._currentBreakpoint, this.getEqualSplit());
					this._changeGridState();
				}
			}
		};

		/**
		 * Returns object with data about the size of the main and the side content, based on the screen breakpoint and
		 * control mode.
		 * @param {string} sSizeName Possible values S, M, L, XL
		 * @param {boolean} bComparison Checks if the page is in equalSplit mode
		 * @returns {sap.m.DynamicSideContent} this pointer for chaining
		 * @private
		 */
		DynamicSideContent.prototype._setResizeData = function (sSizeName, bComparison) {
			var sideContentVisibility = this.getSideContentVisibility(),
				sideContentFallDown = this.getSideContentFallDown();

			if (!bComparison) {
				// Normal mode
				switch (sSizeName) {
					case S:
						this._setSpanSize(SPAN_SIZE_12, SPAN_SIZE_12);
						if (this.getProperty("showSideContent") && this.getProperty("showMainContent")) {
							this._SCVisible = sideContentVisibility === sap.ui.layout.SideContentVisibility.AlwaysShow;
						}
						this._bFixedSideContent = false;
						break;
					case M:
						var iSideContentWidth = Math.ceil((33.333 / 100) * this._iWindowWidth);
						if (sideContentFallDown === sap.ui.layout.SideContentFallDown.BelowL ||
							sideContentFallDown === sap.ui.layout.SideContentFallDown.BelowXL ||
							(iSideContentWidth <= 320 && sideContentFallDown === sap.ui.layout.SideContentFallDown.OnMinimumWidth)) {
							this._setSpanSize(SPAN_SIZE_12, SPAN_SIZE_12);
							this._bFixedSideContent = false;
						} else {
							this._setSpanSize(SPAN_SIZE_4, SPAN_SIZE_8);
							this._bFixedSideContent = true;
						}
						this._SCVisible = sideContentVisibility === sap.ui.layout.SideContentVisibility.ShowAboveS ||
							sideContentVisibility === sap.ui.layout.SideContentVisibility.AlwaysShow;

						this._MCVisible = true;
						break;
					case L:
						if (sideContentFallDown === sap.ui.layout.SideContentFallDown.BelowXL) {
							this._setSpanSize(SPAN_SIZE_12, SPAN_SIZE_12);
						} else {
							this._setSpanSize(SPAN_SIZE_4, SPAN_SIZE_8);
						}
						this._SCVisible = sideContentVisibility === sap.ui.layout.SideContentVisibility.ShowAboveS ||
							sideContentVisibility === sap.ui.layout.SideContentVisibility.ShowAboveM ||
							sideContentVisibility === sap.ui.layout.SideContentVisibility.AlwaysShow;
						this._MCVisible = true;
						this._bFixedSideContent = false;
						break;
					case XL:
						this._setSpanSize(SPAN_SIZE_3, SPAN_SIZE_9);
						this._SCVisible = sideContentVisibility !== sap.ui.layout.SideContentVisibility.NeverShow;
						this._MCVisible = true;
						this._bFixedSideContent = false;
						break;
					default:
						throw new Error(INVALID_BREAKPOINT_ERROR_MSG);
				}
			} else {
				// Equal split mode
				switch (sSizeName) {
					case S:
						this._setSpanSize(SPAN_SIZE_12, SPAN_SIZE_12);
						this._SCVisible = false;
						break;
					default:
						this._setSpanSize(SPAN_SIZE_6, SPAN_SIZE_6);
						this._SCVisible = true;
						this._MCVisible = true;
				}
				this._bFixedSideContent = false;
			}

			return this;
		};

		/**
		 * Determines if the control sets height, based on the control state.
		 * @private
		 * @return {boolean} If the control sets height
		 */
		DynamicSideContent.prototype._shouldSetHeight = function () {
			var bSameLine,
				bBothVisible,
				bOnlyScVisible,
				bOnlyMcVisible,
				bOneVisible,
				bFixedSC,
				bSCNeverShow;

			bSameLine = (this._iScSpan + this._iMcSpan) === SPAN_SIZE_12;
			bBothVisible = this._MCVisible && this._SCVisible;

			bOnlyScVisible = !this._MCVisible && this._SCVisible;
			bOnlyMcVisible = this._MCVisible && !this._SCVisible;
			bOneVisible = bOnlyScVisible || bOnlyMcVisible;

			bFixedSC = this._fixedSideContent;
			bSCNeverShow = this.getSideContentVisibility() === sap.ui.layout.SideContentVisibility.NeverShow;

			return ((bSameLine && bBothVisible) || bOneVisible || bFixedSC || bSCNeverShow);
		};

		/**
		 * Changes the state of the grid without re-rendering the control.
		 * Shows and hides the main and side content.
		 * @private
		 */
		DynamicSideContent.prototype._changeGridState = function () {
			var $sideContent = this.$(SC_GRID_CELL_SELECTOR),
				$mainContent = this.$(MC_GRID_CELL_SELECTOR),
				bMainContentVisibleProperty = this.getProperty("showMainContent"),
				bSideContentVisibleProperty = this.getProperty("showSideContent");

			if (this._bFixedSideContent) {
				$sideContent.removeClass().addClass(SC_FIXED_CLASS);
				$mainContent.removeClass().addClass(MC_FIXED_CLASS);
			} else {
				$sideContent.removeClass(SC_FIXED_CLASS);
				$mainContent.removeClass(MC_FIXED_CLASS);
			}

			if (this._SCVisible && this._MCVisible && bSideContentVisibleProperty && bMainContentVisibleProperty) {
				if (!this._bFixedSideContent) {
					$mainContent.removeClass().addClass("sapUiDSCSpan" + this._iMcSpan);
					$sideContent.removeClass().addClass("sapUiDSCSpan" + this._iScSpan);
				}
				if (this._shouldSetHeight()) {
					$sideContent.css("height", "100%").css("float", "left");
					$mainContent.css("height", "100%").css("float", "left");
				} else {
					$sideContent.css("height", "auto").css("float", "none");
					$mainContent.css("height", "auto").css("float", "none");
				}
			} else if (!this._SCVisible && !this._MCVisible) {
				$mainContent.addClass(HIDDEN_CLASS);
				$sideContent.addClass(HIDDEN_CLASS);
			} else if (this._MCVisible && bMainContentVisibleProperty) {
				$mainContent.removeClass().addClass(SPAN_SIZE_12_CLASS);
				$sideContent.addClass(HIDDEN_CLASS);
			} else if (this._SCVisible && bSideContentVisibleProperty) {
				$sideContent.removeClass().addClass(SPAN_SIZE_12_CLASS);
				$mainContent.addClass(HIDDEN_CLASS);
			} else if (!bMainContentVisibleProperty && !bSideContentVisibleProperty) {
				$mainContent.addClass(HIDDEN_CLASS);
				$sideContent.addClass(HIDDEN_CLASS);
			}
		};

		/**
		 * Sets the main and side content span size.
		 * @param {integer} iScSpan Side content span size
		 * @param {integer} iMcSpan Main content span size
		 * @private
		 */
		DynamicSideContent.prototype._setSpanSize = function (iScSpan, iMcSpan) {
			this._iScSpan = iScSpan;
			this._iMcSpan = iMcSpan;
		};

		return DynamicSideContent;
	}, /* bExport= */ true);
