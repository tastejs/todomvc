/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.commons.Panel.
sap.ui.define(['jquery.sap.global', './library', 'sap/ui/core/Control'],
	function(jQuery, library, Control) {
	"use strict";



	/**
	 * Constructor for a new Panel.
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * Represents a container with scroll functionality, that can be used for text and controls.
	 * The Panel does not layout the embedded controls.
	 * @extends sap.ui.core.Control
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @alias sap.ui.commons.Panel
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var Panel = Control.extend("sap.ui.commons.Panel", /** @lends sap.ui.commons.Panel.prototype */ { metadata : {

		library : "sap.ui.commons",
		properties : {

			/**
			 * Determines the width of the Panel in CSS size.
			 */
			width : {type : "sap.ui.core.CSSSize", group : "Dimension", defaultValue : '100%'},

			/**
			 * Determines the height of the Panel in CSS size.
			 * Per default, the height for the Panel is automatically adjusted to the content.
			 * Dimension allows to explicitly specify the height.
			 */
			height : {type : "sap.ui.core.CSSSize", group : "Dimension", defaultValue : null},

			/**
			 * Represents the state of the of the Panel (enabled or disabled)
			 */
			enabled : {type : "boolean", group : "Behavior", defaultValue : true},

			/**
			 * Determines the scroll position from left to right. Value "0" means leftmost position.
			 */
			scrollLeft : {type : "int", group : "Behavior", defaultValue : 0},

			/**
			 * Determines the scroll position from top to bottom. Value "0" means topmost position.
			 */
			scrollTop : {type : "int", group : "Behavior", defaultValue : 0},

			/**
			 * Determines whether the Panel will have padding.
			 * Padding is theme-dependent.
			 */
			applyContentPadding : {type : "boolean", group : "Appearance", defaultValue : true},

			/**
			 * Determines whether the Panel will be initially collapsed.
			 * When it is initially collapsed, the contents are not rendered.
			 * A collapsed Panel consumes less space than an expanded one.
			 */
			collapsed : {type : "boolean", group : "Behavior", defaultValue : false},

			/**
			 * Determines the background color.
			 * Note that color settings are theme-dependent.
			 */
			areaDesign : {type : "sap.ui.commons.enums.AreaDesign", group : "Appearance", defaultValue : sap.ui.commons.enums.AreaDesign.Fill},

			/**
			 * Determines if the Panel can have a box as border.
			 * Note that displaying borders is theme-dependent.
			 */
			borderDesign : {type : "sap.ui.commons.enums.BorderDesign", group : "Appearance", defaultValue : sap.ui.commons.enums.BorderDesign.Box},

			/**
			 * Determines whether the Panel will have an icon for collapsing/expanding, or not.
			 */
			showCollapseIcon : {type : "boolean", group : "Behavior", defaultValue : true},

			/**
			 * Specifies the text that is rendered in the Panel header.
			 * Can be used to create a simple titles that do not require an icon in the header.
			 */
			text : {type : "string", group : "Misc", defaultValue : null}
		},
		defaultAggregation : "content",
		aggregations : {

			/**
			 * Aggregates the controls that are contained in the Panel.
			 * It is recommended to use a layout control as single direct child.
			 * When the Panel dimensions are set, the child control may have width and height of 100%.
			 * When the dimensions are not set, the child defines the size of the Panel.
			 */
			content : {type : "sap.ui.core.Control", multiple : true, singularName : "content"},

			/**
			 * Aggregates the title element of the Panel.
			 * For text titles only, you alternatively could use setText() which also creates a title in the background.
			 */
			title : {type : "sap.ui.core.Title", multiple : false},

			/**
			 * The buttons that shall be displayed in the Panel header
			 */
			buttons : {type : "sap.ui.commons.Button", multiple : true, singularName : "button"}
		}
	}});


	/**
	 * Initialization
	 * @private
	 */
	Panel.prototype.init = function() {
		this._oScrollDomRef = null;       // points to the content area
		this._iMaxTbBtnWidth = -1;        // the maximum width of all toolbar buttons (when there are any, else -1)
		this._iTbMarginsAndBorders = 0;
		this._iMinTitleWidth = 30;        // the minimum width of the title span
		this._iOptTitleWidth = 30;
		this._iTitleMargin = 0;
		this._bFocusCollapseIcon = false; // indicates whether the collapse icon should be focused after the next rendering
		this._resizeDelayTimer = null;    // the timer for delayed reaction to resize events in browsers not supporting FlexBox layout
		this._rb = sap.ui.getCore().getLibraryResourceBundle("sap.ui.commons");

		this.data("sap-ui-fastnavgroup", "true", true); // Define group for F6 handling
	};

	Panel.prototype.exit = function() {
		this._rb = undefined;
	};

	/**
	 * Called after the theme has been switched: adjust sizes
	 * @private
	 */
	Panel.prototype.onThemeChanged = function () {
		if (this.getDomRef() && this._oTitleDomRef) { // only if already rendered and if a real Panel (no subclass like Tab)

			// reset size settings done for previous theme, so elements take their optimum space
			this.getDomRef().style.minWidth = "auto";
			if (this._oToolbarDomRef) {
				this._oToolbarDomRef.style.width = "auto";
			}
			this._oTitleDomRef.style.width = "auto";

			// adapt sizes
			this._initializeSizes(); // TODO: delay this for Safari?
			if (!jQuery.support.flexBoxLayout ||
					(Panel._isSizeSet(this.getHeight()) && (this._hasIcon() || (this.getButtons().length > 0)))) {
				this._handleResizeNow();
			}
		}
	};


	/**
	 * Event unbinding
	 * @private
	 */
	Panel.prototype.onBeforeRendering = function() {
		// Deregister resize event before re-rendering
		if (this.sResizeListenerId) {
			sap.ui.core.ResizeHandler.deregister(this.sResizeListenerId);
			this.sResizeListenerId = null;
		}
	};


	/**
	 * Adapts size settings of the rendered HTML
	 * @private
	 */
	Panel.prototype.onAfterRendering = function () {
		var id = this.getId();
		this._oScrollDomRef = jQuery.sap.domById(id + "-cont");
		if (!this._oScrollDomRef) {
			return;
		} // BugFix for TwoGo where the DomRefs were not there after rendering
		this._oHeaderDomRef = jQuery.sap.domById(id + "-hdr");
		this._oTitleDomRef = jQuery.sap.domById(id + "-title");
		this._oToolbarDomRef = jQuery.sap.domById(id + "-tb");

		// restore focus if required
		if (this._bFocusCollapseIcon) {
			this._bFocusCollapseIcon = false;
			var $collArrow = jQuery.sap.byId(id + "-collArrow");
			if ($collArrow.is(":visible") && ($collArrow.css("visibility") == "visible" || $collArrow.css("visibility") == "inherit")) {
				$collArrow.focus();
			} else {
				var $collIco = jQuery.sap.byId(id + "-collIco");
				if ($collIco.is(":visible") && ($collIco.css("visibility") == "visible" || $collIco.css("visibility") == "inherit")) {
					$collIco.focus();
				}
			}
		}

		this._initializeSizes(); // TODO: delay this for Safari?

		// in browsers not supporting the FlexBoxLayout we need to listen to resizing
		if (!jQuery.support.flexBoxLayout ||
				(Panel._isSizeSet(this.getHeight()) && (this._hasIcon() || (this.getButtons().length > 0)))) {
			this._handleResizeNow();
			this.sResizeListenerId = sap.ui.core.ResizeHandler.register(this.getDomRef(), jQuery.proxy(this._handleResizeSoon, this));
		}
	};


	/**
	 *
	 * @protected
	 */
	Panel.prototype.getFocusInfo = function () {
		var collId = null;
		var id = this.getId();

		// if collapse icon needs to be focused, find out which one - if any - is currently visible
		if (this._bFocusCollapseIcon) {
			var $collArrow = jQuery.sap.byId(id + "-collArrow");
			if ($collArrow.is(":visible") && ($collArrow.css("visibility") == "visible" || $collArrow.css("visibility") == "inherit")) {
				collId = $collArrow[0].id;
			} else {
				var $collIco = jQuery.sap.byId(id + "-collIco");
				if ($collIco.is(":visible") && ($collIco.css("visibility") == "visible" || $collIco.css("visibility") == "inherit")) {
					collId = $collIco[0].id;
				}
			}

		}

		// if a collapse icon is visible and to be focused, return its ID, otherwise just the control ID
		return {id:(collId ? collId : id)};
	};


	/**
	 *
	 * @private
	 */
	Panel.prototype.applyFocusInfo = function (oFocusInfo) {
		var $DomRef;
		if (oFocusInfo && oFocusInfo.id && ($DomRef = jQuery.sap.byId(oFocusInfo.id)) && ($DomRef.length > 0)) {
			$DomRef.focus();
		} else {
			this.focus();
		}
		return this;
	};


	/**
	 * Measures and calculates/sets sizes as soon as the CSS has been applied after rendering or a theme switch
	 * @private
	 */
	Panel.prototype._initializeSizes = function() {
		var bRtl = sap.ui.getCore().getConfiguration().getRTL();

		// maximum width of a toolbar item -> min toolbar width
		var aButtons = this.getButtons();
		if (aButtons && aButtons.length > 0) {
			var maxWidth = 0;
			jQuery(this._oToolbarDomRef).children().each(function(){
				var width = this.offsetWidth;
				if (width > maxWidth) {
					maxWidth = width;
				}
			});
			this._iMaxTbBtnWidth = maxWidth;

			if (this._oToolbarDomRef) {
				this._oToolbarDomRef.style.minWidth = maxWidth + "px";

				// calculate the toolbar borders and margins
				var $tb = jQuery(this._oToolbarDomRef);
				this._iTbMarginsAndBorders = $tb.outerWidth(true) - $tb.width();
			}
		}

		// calculate available space between left- and right-aligned items with static width
		var beginBorderOfTitle = this._oTitleDomRef.offsetLeft; // displacement of the beginning of the title from the Panel border
		var totalWidth = this.getDomRef().offsetWidth;
		if (bRtl) {
			beginBorderOfTitle = totalWidth - (beginBorderOfTitle + this._oTitleDomRef.offsetWidth); // RTL case
		}
		var $title = jQuery(this._oTitleDomRef);
		this._iOptTitleWidth = $title.width() + 1 /*+1 to avoid subpixel issues*/;
		this._iTitleMargin = $title.outerWidth(true) - $title.outerWidth();
		var beginBorderOfRightItems = 10000;
		jQuery(this._oHeaderDomRef).children(".sapUiPanelHdrRightItem").each(function(){
			var begin = this.offsetLeft;
			if (bRtl) {
				begin = totalWidth - (begin + this.offsetWidth); // RTL case
			}
			if ((begin < beginBorderOfRightItems) && (begin > 0)) {
				beginBorderOfRightItems = begin;
			}
		});


		// set minimum Panel width as sum of minimum sizes
		var minWidth = beginBorderOfTitle;
		minWidth += this._iMinTitleWidth; // 30px is ok even if there is no title
		minWidth += this._iMaxTbBtnWidth + 1; // -1 if there is no toolbar... 1px more or less is no problem here
		minWidth += (beginBorderOfRightItems == 10000) ? 10 : (totalWidth - beginBorderOfRightItems); // use 10 as hardcoded right border
		this.getDomRef().style.minWidth = minWidth + 10 + "px";


		// restore scroll positions
		if (this._oScrollDomRef) {
			var scrollTop = this.getProperty("scrollTop");
			if (scrollTop > 0) {
				this._oScrollDomRef.scrollTop = scrollTop;
			}
			var scrollLeft = this.getProperty("scrollLeft");
			if (scrollLeft > 0) {
				this._oScrollDomRef.scrollLeft = scrollLeft;
			}

		}

	};


	/**
	 * Adapts the absolute position of the content when height is set.
	 * @private
	 */
	Panel.prototype._fixContentHeight = function() {
		//if height is set and an icon or at least one toolbar button is present (which *could* inflate the header height), the cont top must be set to the header height
		if (Panel._isSizeSet(this.getHeight()) && (this._hasIcon() || (this.getButtons().length > 0))) { // TODO: what if the icon is not yet loaded?
			this._iContTop = this._oHeaderDomRef.offsetHeight;
			if (this._oScrollDomRef) {
				this._oScrollDomRef.style.top = this._iContTop + "px";
			}
		}
	};


	/**
	 * Called in browsers not supporting the FlexBox layout whenever the Panel size is changing.
	 * This method registers a delayed reaction to the size changes.
	 * When there are further size changes during this delay, the delay starts from zero.
	 * So the Panel is not adapted during the resize, but only after resizing has completed.
	 * This should fix most of the related performance issues.
	 * @private
	 */
	Panel.prototype._handleResizeSoon = function() {
		if (this._resizeDelayTimer) {
			jQuery.sap.clearDelayedCall(this._resizeDelayTimer);
		}

		this._resizeDelayTimer = jQuery.sap.delayedCall(200, this, function() {
			this._handleResizeNow();
			this._resizeDelayTimer = null;
		});
	};


	/**
	 * Called in browsers not supporting the FlexBox layout whenever the Panel size has changed and
	 * the header layout finally needs to be adapted.
	 * Basically this method imitates that layout's behavior.
	 * @private
	 */
	Panel.prototype._handleResizeNow = function() {
		// in IE8 (maybe also IE9) the sizes of the flexible items (title and toolbar) need to be adjusted
		// whenever the Panel width changes
		if (!jQuery.support.flexBoxLayout && this.getDomRef()) {
			var bRtl = sap.ui.getCore().getConfiguration().getRTL();

			/* Algorithm:
			 * 1. calculate space available for the two elements
			 * 2. if no toolbar is present, apply this width to the title, else:
			 * 3.   reduce toolbar width until maxBtnSize is reached, then reduce title width until minimum (do not make either any smaller; the Panel has a min-width anyway)
			 * 4.   apply these widths
			 */

			// begin of Panel to begin of Title
			var beginBorderOfTitle = this._oTitleDomRef.offsetLeft; // displacement of the beginning of the title from the Panel border
			var totalWidth = this.getDomRef().offsetWidth;
			if (bRtl) {
				beginBorderOfTitle = totalWidth - (beginBorderOfTitle + this._oTitleDomRef.offsetWidth); // RTL case
			}

			// begin of Panel to begin if "RightItems"
			var beginBorderOfRightItems = 10000;
			jQuery(this._oHeaderDomRef).children(".sapUiPanelHdrRightItem").each(function(){
				var begin = this.offsetLeft;
				if (bRtl) {
					begin = totalWidth - (begin + this.offsetWidth); // RTL case
				}
				if ((begin < beginBorderOfRightItems) && (begin > 0)) {
					beginBorderOfRightItems = begin;
				}
			});

			var availableSpace = (beginBorderOfRightItems == 10000) ?
						this.$().width() - beginBorderOfTitle - 20
					: beginBorderOfRightItems - beginBorderOfTitle - 10;

			var aButtons = this.getButtons();
			if (aButtons && aButtons.length > 0) { // there are title and toolbar; calculate and set both sizes
				// differentiate between two cases: 1. there is enough space for title plus minimum toolbar width
				//                                  2. both need to be reduced in size
				if ((availableSpace - this._iOptTitleWidth - this._iTitleMargin) > (this._iMaxTbBtnWidth - this._iTbMarginsAndBorders)) {
					// if available width minus optimum title width is still more than the minimum toolbar width,
					// give all remaining width to the toolbar
					this._oToolbarDomRef.style.width = (availableSpace - this._iOptTitleWidth - this._iTitleMargin - this._iTbMarginsAndBorders) + "px";
					this._oTitleDomRef.style.width = this._iOptTitleWidth + "px";
				} else {
					// both are affected => set toolbar to minimum and reduce title width, but not smaller than minimum
					this._oToolbarDomRef.style.width = this._iMaxTbBtnWidth + "px";
					this._oTitleDomRef.style.width = Math.max((availableSpace - this._iMaxTbBtnWidth - this._iTbMarginsAndBorders), this._iMinTitleWidth) + "px";
				}

			} else {
				// no toolbar
				this._oTitleDomRef.style.width = Math.max(availableSpace, this._iMinTitleWidth) + "px";
			}
		}

		// in case the resizing caused button wrapping, adapt content height -- FOR ALL BROWSERS!
		this._fixContentHeight();
	};


	/**
	 * Helper method to find out whether the Panel has an icon.
	 * @private
	 */
	Panel.prototype._hasIcon = function() {
		return (this.getTitle() && this.getTitle().getIcon());
	};



	/**
	 * Property setter for the "enabled" state
	 *
	 * @param {boolean} bEnabled Whether the Panel should be enabled or not.
	 * @return {sap.ui.commons.Panel} <code>this</code> to allow method chaining.
	 * @public
	 */
	Panel.prototype.setEnabled = function(bEnabled) {
		this.setProperty("enabled", bEnabled, true); // no re-rendering!
		// if already rendered, adapt rendered control without complete re-rendering
		jQuery(this.getDomRef()).toggleClass("sapUiPanelDis", !bEnabled);
		return this;
	};


	/**
	 * Property setter for the padding
	 *
	 * @param {boolean} bPadding Whether the Panel should have padding.
	 * @returns {sap.ui.commons.Panel} <code>this</code> to allow method chaining.
	 * @public
	 */
	Panel.prototype.setApplyContentPadding = function(bPadding) {
		this.setProperty("applyContentPadding", bPadding, true); // no re-rendering!
		jQuery(this.getDomRef()).toggleClass("sapUiPanelWithPadding", bPadding);
		return this;
	};


	/**
	 * Property setter for the "collapsed" state
	 *
	 * @param {boolean} bCollapsed Whether the Panel should be collapsed or not.
	 * @return {sap.ui.commons.Panel} <code>this</code> to allow method chaining.
	 * @public
	 */
	Panel.prototype.setCollapsed = function(bCollapsed) {
		this.setProperty("collapsed", bCollapsed, true); // no re-rendering!
		this._setCollapsedState(bCollapsed); // adapt rendered control without complete re-rendering
		return this;
	};


	/**
	 * Internal method for applying a (non-)"collapsed" state to the rendered HTML
	 *
	 * @param bCollapsed whether the Panel should be collapsed or not
	 * @private
	 */
	Panel.prototype._setCollapsedState = function(bCollapsed) {
		var oDomRef = this.getDomRef();
		if (oDomRef) {
			// after Panel has been rendered
			var accessibility = sap.ui.getCore().getConfiguration().getAccessibility();
			if (bCollapsed) {
				// collapsing
				if (!this.getWidth()) {
					oDomRef.style.width = this.getDomRef().offsetWidth + "px"; // maintain the current width
				}
				jQuery(oDomRef).addClass("sapUiPanelColl");
				if (accessibility) {
					oDomRef.setAttribute("aria-expanded", "false");
				}
				if (this.getHeight()) {
					// if there is a height set, the Panel would still consume the respective space, so remove the height setting
					oDomRef.style.height = "auto";
				}
				// update tooltips
				var sExpandTooltip = this._rb.getText("PANEL_EXPAND");
				this.$("collArrow").attr("title", sExpandTooltip);
				this.$("collIco").attr("title", sExpandTooltip);

			} else {
				// expanding
				if (!this.getDomRef("cont")) {
					// content has not been rendered yet, so render it now
					this._bFocusCollapseIcon = true; // restore focus to collapse icon/button after rendering
					this.rerender();
				} else {
					// content exists already, just make it visible again
					jQuery(oDomRef).removeClass("sapUiPanelColl");
					if (accessibility) {
						oDomRef.setAttribute("aria-expanded", "true");
					}
					if (!this.getWidth()) {
						oDomRef.style.width = "auto"; // restore the automatic width behavior
					}
					if (this.getHeight()) {
						oDomRef.style.height = this.getHeight(); // restore the set height
					}
					// update tooltips
					var sCollapseTooltip = this._rb.getText("PANEL_COLLAPSE");
					this.$("collArrow").attr("title", sCollapseTooltip);
					this.$("collIco").attr("title", sCollapseTooltip);
				}
			}
		}
	};


	/**
	 * Static method that finds out whether the given CSS size is actually set.
	 * Returns "true" for absolute and relative sizes, returns "false" if "null", "inherit" or "auto" is given.
	 *
	 * @static
	 * @param sCssSize a css size string (must be a valid CSS size, or null)
	 * @private
	 */
	Panel._isSizeSet = function(sCssSize) {
		return (sCssSize && !(sCssSize == "auto") && !(sCssSize == "inherit"));
	};

	/**
	 * Sets a Tille control that will be rendered in the Panel header.
	 *
	 * @param {sap.ui.core.Title} oTitle The Title to render in the header.
	 * @return {sap.ui.commons.Panel} <code>this</code> to allow method chaining.
	 * @public
	 */
	Panel.prototype.setTitle = function(oTitle) {
		var oOldTitle = this.getTitle();
		this.setAggregation("title", oTitle);
		// check whether the title has been created on the fly. Then we are owner of it and should destroy it
		// the ID check should be sufficient as long as the naming conventions are obeyed
		if ( oOldTitle && oOldTitle !== oTitle && oOldTitle.getId() === this.getId() + "-tit" ) {
			oOldTitle.destroy();
		}
		return this;
	};

	/**
	 * Sets the text that will be rendered in the Panel header.
	 *
	 * @param {string} sText The text to render in the header.
	 * @return {sap.ui.commons.Panel} <code>this</code> to allow method chaining.
	 * @public
	 */
	Panel.prototype.setText = function(sText) {
		if (!this.getTitle()) {
			this.setTitle(new sap.ui.core.Title(this.getId() + "-tit",{text:sText}));
		} else {
			this.getTitle().setText(sText);
		}
		return this;
	};

	/**
	 * Returns the text that is rendered in the Panel header.
	 * If a Title control was used it returns the text of the Title control.
	 *
	 * @return {string} The text in the Panel header.
	 * @public
	 */
	Panel.prototype.getText = function () {
		if (!this.getTitle()) {
			return "";
		} else {
			return this.getTitle().getText();
		}
	};


	/**
	 * Returns the scroll position of the panel in pixels from the left.
	 * Returns 0 if not rendered yet.
	 * Also internally updates the control property.
	 *
	 * @return {int} The scroll position.
	 * @public
	 */
	Panel.prototype.getScrollLeft = function () {
		var scrollLeft = 0;
		if (this._oScrollDomRef) {
			if (sap.ui.getCore().getConfiguration().getRTL()) {
				scrollLeft = jQuery(this._oScrollDomRef).scrollLeftRTL();
			} else {
				scrollLeft = jQuery(this._oScrollDomRef).scrollLeft();
			}
			jQuery.sap.assert(typeof scrollLeft == "number", "scrollLeft read from DOM should be a number");
			this.setProperty("scrollLeft", scrollLeft, true);
		}

		return scrollLeft;
	};


	/**
	 * Sets the scroll position of the panel in pixels from the left.
	 *
	 * @param {int} iPosition The position to scroll to.
	 * @return {sap.ui.commons.Panel} <code>this</code> to allow method chaining.
	 * @public
	 */
	Panel.prototype.setScrollLeft = function (iPosition) {
		this.setProperty("scrollLeft", iPosition, true);
		if (this._oScrollDomRef) {
			if (sap.ui.getCore().getConfiguration().getRTL()) {
				jQuery(this._oScrollDomRef).scrollLeftRTL(iPosition);
			} else {
				jQuery(this._oScrollDomRef).scrollLeft(iPosition);
			}
		}
		return this;
	};


	/**
	 * Returns the scroll position of the panel in pixels from the top.
	 * Returns 0 if not rendered yet.
	 * Also internally updates the control property.
	 *
	 * @return {int} The scroll position.
	 * @public
	 */
	Panel.prototype.getScrollTop = function () {
		var scrollTop = 0;
		if (this._oScrollDomRef) {
			scrollTop = this._oScrollDomRef.scrollTop;
			this.setProperty("scrollTop", scrollTop, true);
		}

		return scrollTop;
	};


	/**
	 * Sets the scrolls position of the panel in pixels from the top.
	 *
	 * @param {int} iPosition The position to scroll to.
	 * @return {sap.ui.commons.Panel} <code>this</code> to allow method chaining.
	 * @public
	 */
	Panel.prototype.setScrollTop = function (iPosition) {
		this.setProperty("scrollTop", iPosition, true);
		if (this._oScrollDomRef) {
			this._oScrollDomRef.scrollTop = iPosition;
		}
		return this;
	};


	/**
	 * Sets the dimensions of the panel.
	 *
	 * @param {sap.ui.core.CSSSize} sWidth The width of the panel as CSS size.
	 * @param {sap.ui.core.CSSSize} sHeight The height of the panel as CSS size.
	 * @return {sap.ui.commons.Panel} <code>this</code> to allow method chaining.
	 * @public
	 */
	Panel.prototype.setDimensions = function (sWidth, sHeight) {
		jQuery.sap.assert(typeof sWidth == "string" && typeof sHeight == "string", "sWidth and sHeight must be strings");
		this.setWidth(sWidth); // does not rerender
		this.setHeight(sHeight);
		return this;
	};


	/**
	 * Sets the width of the panel.
	 *
	 * @param {sap.ui.core.CSSSize} sWidth The width of the panel as CSS size.
	 * @return {sap.ui.commons.Panel} <code>this</code> to allow method chaining.
	 * @public
	 */
	Panel.prototype.setWidth = function (sWidth) {
		this.setProperty("width", sWidth, true); // don't rerender
		var oDomRef = this.getDomRef();
		if (oDomRef) {
			oDomRef.style.width = sWidth;
		}
		return this;
	};


	/**
	 * Sets the height of the panel.
	 *
	 * @param {sap.ui.core.CSSSize} sHeight The height of the panel as CSS size.
	 * @return {sap.ui.commons.Panel} <code>this</code> to allow method chaining.
	 * @public
	 */
	Panel.prototype.setHeight = function (sHeight) {
		this.setProperty("height", sHeight, true); // don't rerender
		var oDomRef = this.getDomRef();
		if (oDomRef) {
			oDomRef.style.height = sHeight;
		}
		return this;
	};



	/*   Event Handling   */

	/**
	 * Handles mouse clicks
	 *
	 * @param {jQuery.Event} oEvent
	 * @private
	 */
	Panel.prototype.onclick = function(oEvent) {
		this._handleTrigger(oEvent);
	};

	/**
	 * Handles "space" presses
	 *
	 * @param {jQuery.Event} oEvent
	 * @private
	 */
	Panel.prototype.onsapspace = function(oEvent) {
		this._handleTrigger(oEvent);
	};

	/**
	 * Handles any "triggering" actions like click and space
	 *
	 * @param {jQuery.Event} oEvent
	 * @private
	 */
	Panel.prototype._handleTrigger = function(oEvent) {
		var id = this.getId();
		// minimize button toggled
		if ((oEvent.target.id === id + "-collArrow") ||
				(oEvent.target.id === id + "-collIco") ||
				// toggle triggered via space key
				(oEvent.target.id === id && oEvent.type === "sapspace" && this.getShowCollapseIcon())) {
			this.setCollapsed(!this.getProperty("collapsed"));
			oEvent.preventDefault();
			oEvent.stopPropagation();
			this.fireEvent("collapsedToggled"); //private event used in ResponsiveLayout
		}
	};


	return Panel;

}, /* bExport= */ true);
