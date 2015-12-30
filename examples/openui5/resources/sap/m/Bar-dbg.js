/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.m.Bar.
sap.ui.define(['jquery.sap.global', './BarInPageEnabler', './library', 'sap/ui/core/Control'],
	function(jQuery, BarInPageEnabler, library, Control) {
	"use strict";



	/**
	 * Constructor for a new Bar.
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * The Bar control can be used as a header, sub-header and a footer in a page.
	 * It has the capability to center a content like a title, while having other controls on the left and right side.
	 * @extends sap.ui.core.Control
	 * @implements sap.m.IBar
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @alias sap.m.Bar
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var Bar = Control.extend("sap.m.Bar", /** @lends sap.m.Bar.prototype */ { metadata : {

		interfaces : [
			"sap.m.IBar"
		],
		library : "sap.m",
		properties : {

			/**
			 * If this flag is set to true, contentMiddle will be rendered as a HBox and layoutData can be used to allocate available space.
			 * @deprecated Since version 1.16.
			 * This property is no longer supported, instead, contentMiddle will always occupy 100% width when no contentLeft and contentRight are being set.
			 */
			enableFlexBox : {type : "boolean", group : "Misc", defaultValue : false, deprecated: true},

			/**
			 * Indicates whether the Bar is partially translucent.
			 * It is only applied for touch devices.
			 * @since 1.12
			 * @deprecated Since version 1.18.6.
			 * This property has no effect since release 1.18.6 and should not be used. Translucent bar may overlay an input and make it difficult to edit.
			 */
			translucent : {type : "boolean", group : "Appearance", defaultValue : false, deprecated: true},

			/**
			 * Determines the design of the bar. If set to auto, it becomes dependent on the place where the bar is placed.
			 * @since 1.22
			 */
			design : {type : "sap.m.BarDesign", group : "Appearance", defaultValue : sap.m.BarDesign.Auto}
		},
		aggregations : {

			/**
			 * Represents the left content area, usually containing a button or an app icon. If it is overlapped by the right content, its content will disappear and the text will show an ellipsis.
			 */
			contentLeft : {type : "sap.ui.core.Control", multiple : true, singularName : "contentLeft"},

			/**
			 * Represents the middle content area. Controls such as label, segmented buttons or select can be placed here. The content is centrally positioned if there is enough space. If the right or left content overlaps the middle content, the middle content will be centered in the space between the left and the right content.
			 */
			contentMiddle : {type : "sap.ui.core.Control", multiple : true, singularName : "contentMiddle"},

			/**
			 *  Represents the right content area. Controls such as action buttons or search field can be placed here.
			 */
			contentRight : {type : "sap.ui.core.Control", multiple : true, singularName : "contentRight"}
		}
	}});

	Bar.prototype.onBeforeRendering = function() {
		this._removeAllListeners();
	};

	Bar.prototype.onAfterRendering = function() {
		this._handleResize();
	};

	/**
	 * Called when the control is initialized.
	 */
	Bar.prototype.init = function() {
		this.data("sap-ui-fastnavgroup", "true", true); // Define group for F6 handling
	};

	/**
	 * Called when the control is destroyed.
	 */
	Bar.prototype.exit = function() {
		this._removeAllListeners();

		if (this._oflexBox) {

			this._oflexBox.destroy();
			this._oflexBox = null;

		}

		this._$MidBarPlaceHolder = null;
		this._$RightBar = null;
		this._$LeftBar = null;
	};

	/**
	 * @private
	 */
	Bar._aResizeHandlers = ["_sResizeListenerId", "_sResizeListenerIdMid", "_sResizeListenerIdRight", "_sResizeListenerIdLeft"];

	/**
	 * Removes all resize listeners the Bar has registered.
	 * @private
	 */
	Bar.prototype._removeAllListeners = function() {
		var that = this;

		Bar._aResizeHandlers.forEach(function(sItem) {

			that._removeListenerFailsave(sItem);

		});
	};

	/**
	 * Removes the listener with the specified name and sets it to null if the listener is defined.
	 * @param {string} sListenerName The name of the listener to be removed
	 *
	 * @private
	 */
	Bar.prototype._removeListenerFailsave = function(sListenerName) {
		if (this[sListenerName]) {

			sap.ui.core.ResizeHandler.deregister(this[sListenerName]);
			this[sListenerName] = null;

		}
	};

	/**
	 * Handles resize changes.
	 * Invoked when the bar is re-rendered, its size has changed or the size of one of the bars content has changed.
	 * @private
	 */
	Bar.prototype._handleResize = function() {
		this._removeAllListeners();

		var bContentLeft = !!this.getContentLeft().length,
			bContentMiddle = !!this.getContentMiddle().length,
			bContentRight = !!this.getContentRight().length;

		//Invisible bars also do not need resize listeners
		if (!this.getVisible()) {
			return;
		}

		//No content was set yet - no need to listen to resizes
		if (!bContentLeft && !bContentMiddle && !bContentRight) {
			return;
		}

		this._$LeftBar = this.$("BarLeft");
		this._$RightBar = this.$("BarRight");
		this._$MidBarPlaceHolder = this.$("BarPH");

		this._updatePosition(bContentLeft, bContentMiddle, bContentRight);

		this._sResizeListenerId = sap.ui.core.ResizeHandler.register(this.getDomRef(), jQuery.proxy(this._handleResize, this));

		if (this.getEnableFlexBox()) {
			return;
		}

		if (bContentLeft) {
			this._sResizeListenerIdLeft = sap.ui.core.ResizeHandler.register(this._$LeftBar[0], jQuery.proxy(this._handleResize, this));
		}

		if (bContentMiddle) {
			this._sResizeListenerIdMid = sap.ui.core.ResizeHandler.register(this._$MidBarPlaceHolder[0], jQuery.proxy(this._handleResize, this));
		}

		if (bContentRight) {
			this._sResizeListenerIdRight = sap.ui.core.ResizeHandler.register(this._$RightBar[0], jQuery.proxy(this._handleResize, this));
		}
	};

	/**
	 * Repositions the bar.
	 * If there is only one aggregation filled, this aggregation will take 100% of the Bar space.
	 * @param {boolean} bContentLeft Indicates whether there is content on the left side of the Bar
	 * @param {boolean} bContentMiddle Indicates whether there is content in the middle section of the Bar
	 * @param {boolean} bContentRight Indicates whether there is content on the right side of the Bar
	 * @private
	 */
	Bar.prototype._updatePosition = function(bContentLeft, bContentMiddle, bContentRight) {
		if (!bContentLeft && !bContentRight && bContentMiddle) {
			return;
		}
		if (bContentLeft && !bContentMiddle && !bContentRight) {
			return;
		}

		if (!bContentLeft && !bContentMiddle && bContentRight) {
			return;
		}

		var iBarWidth = this.$().outerWidth(true);

		// reset to default
		this._$RightBar.css({ width : "" });
		this._$LeftBar.css({ width : "" });
		this._$MidBarPlaceHolder.css({ position : "", width : "", visibility : 'hidden' });

		var iRightBarWidth = this._$RightBar.outerWidth(true);

		//right bar is bigger than the bar - only show the right bar
		if (iRightBarWidth > iBarWidth) {

			if (bContentLeft) {
				this._$LeftBar.css({ width : "0px" });
			}

			if (bContentMiddle) {
				this._$MidBarPlaceHolder.css({ width : "0px" });
			}

			this._$RightBar.css({ width : iBarWidth + "px"});
			return;

		}

		var iLeftBarWidth = this._getBarContainerWidth(this._$LeftBar);

		// handle the case when left and right content are wider than the bar itself
		if (iBarWidth < (iLeftBarWidth + iRightBarWidth)) {

			// this scenario happens mostly when a very long title text is set in the left content area
			// hence we make sure the rightContent always has enough space and reduce the left content area width accordingly
			iLeftBarWidth = iBarWidth - iRightBarWidth;

			this._$LeftBar.width(iLeftBarWidth);
			this._$MidBarPlaceHolder.width(0);
			return;

		}

		//middle bar will be shown
		this._$MidBarPlaceHolder.css(this._getMidBarCss(iRightBarWidth, iBarWidth, iLeftBarWidth));

	};

	/**
	 * Returns the CSS for the contentMiddle aggregation.
	 * It is centered if there is enough space for it to fit between the left and the right content, otherwise it is centered between them.
	 * If not it will be centered between those two.
	 * @param {integer} iRightBarWidth The width in px
	 * @param {integer} iBarWidth The width in px
	 * @param {integer} iLeftBarWidth The width in px
	 * @returns {object} The new _$MidBarPlaceHolder CSS value
	 * @private
	 */
	Bar.prototype._getMidBarCss = function(iRightBarWidth, iBarWidth, iLeftBarWidth) {
		var iMidBarPlaceholderWidth = this._$MidBarPlaceHolder.outerWidth(true),
			bRtl = sap.ui.getCore().getConfiguration().getRTL(),
			sLeftOrRight = bRtl ? "right" : "left",
			oMidBarCss = { visibility : "" };

		if (this.getEnableFlexBox()) {

			iMidBarPlaceholderWidth = iBarWidth - iLeftBarWidth - iRightBarWidth - parseInt(this._$MidBarPlaceHolder.css('margin-left'), 10) - parseInt(this._$MidBarPlaceHolder.css('margin-right'), 10);

			oMidBarCss.position = "absolute";
			oMidBarCss.width = iMidBarPlaceholderWidth + "px";
			oMidBarCss[sLeftOrRight] = iLeftBarWidth;

			//calculation for flex is done
			return oMidBarCss;

		}

		var iSpaceBetweenLeftAndRight = iBarWidth - iLeftBarWidth - iRightBarWidth,

			iMidBarStartingPoint = (iBarWidth / 2) - (iMidBarPlaceholderWidth / 2),
			bLeftContentIsOverlapping = iLeftBarWidth > iMidBarStartingPoint,

			iMidBarEndPoint = (iBarWidth / 2) + (iMidBarPlaceholderWidth / 2),
			bRightContentIsOverlapping = (iBarWidth - iRightBarWidth) < iMidBarEndPoint;

		if (iSpaceBetweenLeftAndRight > 0 && (bLeftContentIsOverlapping || bRightContentIsOverlapping)) {

			//Left or Right content is overlapping the Middle content

			// place the middle positioned element directly next to the end of left content area
			oMidBarCss.position = "absolute";

			//Use the remaining space
			oMidBarCss.width = iSpaceBetweenLeftAndRight + "px";

			oMidBarCss.left = bRtl ? iRightBarWidth : iLeftBarWidth;
		}

		return oMidBarCss;

	};

	/**
	 * Gets the width of a container.
	 * @static
	 * @param {object} $Container A container with children
	 * @returns {number} The width of one of the Bar containers
	 * @private
	 */
	Bar.prototype._getBarContainerWidth = function($Container) {
		var i,
			iContainerWidth = 0,
			aContainerChildren = $Container.children(),
			iContainerChildrenTotalWidth = 0;

		// Chrome browser has a problem in providing the correct div size when image inside does not have width explicitly set
		//since ff version 24 the calculation is correct, since we don't support older versions we won't check it
		if (sap.ui.Device.browser.webkit || sap.ui.Device.browser.firefox) {

			for (i = 0; i < aContainerChildren.length; i++) {

				iContainerChildrenTotalWidth += jQuery(aContainerChildren[i]).outerWidth(true);

			}

			iContainerWidth = $Container.outerWidth(true);

		} else {

			// IE has a rounding issue with JQuery.outerWidth
			var oContainerChildrenStyle;

			for (i = 0; i < aContainerChildren.length; i++) {

				oContainerChildrenStyle = window.getComputedStyle(aContainerChildren[i]);

				if (oContainerChildrenStyle.width == "auto") {

					iContainerChildrenTotalWidth += jQuery(aContainerChildren[i]).width() + 1; //add an additional 1 pixel because of rounding issue.

				} else {

					iContainerChildrenTotalWidth += parseFloat(oContainerChildrenStyle.width);

				}

				iContainerChildrenTotalWidth += parseFloat(oContainerChildrenStyle.marginLeft);
				iContainerChildrenTotalWidth += parseFloat(oContainerChildrenStyle.marginRight);
				iContainerChildrenTotalWidth += parseFloat(oContainerChildrenStyle.paddingLeft);
				iContainerChildrenTotalWidth += parseFloat(oContainerChildrenStyle.paddingRight);
			}

			var oContainerComputedStyle = window.getComputedStyle($Container[0]);

			iContainerWidth += parseFloat(oContainerComputedStyle.width);
			iContainerWidth += parseFloat(oContainerComputedStyle.marginLeft);
			iContainerWidth += parseFloat(oContainerComputedStyle.marginRight);
			iContainerWidth += parseFloat(oContainerComputedStyle.paddingLeft);
			iContainerWidth += parseFloat(oContainerComputedStyle.paddingRight);

		}

		if (iContainerWidth < iContainerChildrenTotalWidth) {

			iContainerWidth = iContainerChildrenTotalWidth;

		}

		return iContainerWidth;
	};

	/////////////////
	//Bar in page delegation
	/////////////////
	/**
	 * Determines whether the Bar is sensitive to the container context.
	 *
	 * Implementation of the IBar interface.
	 * @returns {boolean} isContextSensitive
	 * @protected
	 */
	Bar.prototype.isContextSensitive = BarInPageEnabler.prototype.isContextSensitive;

	/**
	 * Sets the HTML tag of the root element.
	 * @param {sap.m.IBarHTMLTag} sTag The HTML tag of the root element
	 * @returns {sap.m.IBar} this for chaining
	 * @protected
	 */
	Bar.prototype.setHTMLTag = BarInPageEnabler.prototype.setHTMLTag;
	/**
	 * Gets the HTML tag of the root element.
	 * @returns {sap.m.IBarHTMLTag} The HTML-tag
	 * @protected
	 */
	Bar.prototype.getHTMLTag  = BarInPageEnabler.prototype.getHTMLTag;

	/**
	 * Sets classes and tag according to the context of the page. Possible contexts are header, footer and sub-header.
	 * @returns {sap.m.IBar} this for chaining
	 * @protected
	 */
	Bar.prototype.applyTagAndContextClassFor  = BarInPageEnabler.prototype.applyTagAndContextClassFor;

	return Bar;

}, /* bExport= */ true);
