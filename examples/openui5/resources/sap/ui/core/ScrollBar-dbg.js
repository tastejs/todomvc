/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.core.ScrollBar.
sap.ui.define(['jquery.sap.global', 'sap/ui/Device', './Control', './library'],
	function(jQuery, Device, Control, library) {
	"use strict";


	
	/**
	 * Constructor for a new ScrollBar.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * The ScrollBar control can be used for virtual scrolling of a certain area.
	 * This means: to simulate a very large scrollable area when technically the area is small and the control takes care of displaying the respective part only. E.g. a Table control can take care of only rendering the currently visible rows and use this ScrollBar control to make the user think he actually scrolls through a long list.
	 * @extends sap.ui.core.Control
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @alias sap.ui.core.ScrollBar
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var ScrollBar = Control.extend("sap.ui.core.ScrollBar", /** @lends sap.ui.core.ScrollBar.prototype */ { metadata : {
	
		library : "sap.ui.core",
		properties : {
	
			/**
			 * Orientation. Defines if the Scrollbar is vertical or horizontal.
			 */
			vertical : {type : "boolean", group : "Behavior", defaultValue : true},
	
			/**
			 * Scroll position in steps or pixels.
			 */
			scrollPosition : {type : "int", group : "Behavior", defaultValue : null},
	
			/**
			 * Size of the Scrollbar (in pixels).
			 */
			size : {type : "sap.ui.core.CSSSize", group : "Dimension", defaultValue : null},
	
			/**
			 * Size of the scrollable content (in pixels).
			 */
			contentSize : {type : "sap.ui.core.CSSSize", group : "Dimension", defaultValue : null},
	
			/**
			 * Number of steps to scroll. Used if the size of the content is not known as the data is loaded dynamically.
			 */
			steps : {type : "int", group : "Dimension", defaultValue : null}
		},
		events : {
	
			/**
			 * Scroll event.
			 */
			scroll : {
				parameters : {
	
					/**
					 * Actions are: Click on track, button, drag of thumb, or mouse wheel click.
					 */
					action : {type : "sap.ui.core.ScrollBarAction"},
	
					/**
					 * Direction of scrolling: back (up) or forward (down).
					 */
					forward : {type : "boolean"},
	
					/**
					 * Current Scroll position either in pixels or in steps.
					 */
					newScrollPos : {type : "int"},
	
					/**
					 * Old Scroll position - can be in pixels or in steps.
					 */
					oldScrollPos : {type : "int"}
				}
			}
		}
	}});
	
	
	// =============================================================================
	// BASIC CONTROL API
	// =============================================================================
	
	/**
	 * Initialization of the Scrollbar control
	 * @private
	 */
	ScrollBar.prototype.init = function(){
	
		// JQuery Object - Dom reference of the scroll bar
		this._$ScrollDomRef = null;
	
		// In pixels - exact position
		this._iOldScrollPos = 0;
	
		// In steps
		this._iOldStep = 0;
	
		// True if the scroll position was verified. And false if the check was not done yet - for example if the rendering is not done completely
		this._bScrollPosIsChecked = false;
	
		// RTL mode
		this._bRTL = sap.ui.getCore().getConfiguration().getRTL();
	
		// Supress scroll event
		this._bSuppressScroll = false;
		
		this._iMaxContentDivSize = 1000000;  // small value that all browsers still can render without any problems
		
		if (jQuery.sap.touchEventMode === "ON") {
			jQuery.sap.require("sap.ui.thirdparty.zyngascroll");
	
			// Remember last touch scroller position to prevent unneeded rendering
			this._iLastTouchScrollerPosition = null;
			
			// The threshold in pixel for a step when scrolled by touch events
			this._iTouchStepTreshold = 24;
			
			// Some zynga scroller methods call the touch handler. By settings this variable to false, touch handling is prevented and
			// number of unneeded rendering is reduced.
			this._bSkipTouchHandling = false;
			
			this._oTouchScroller = new window.Scroller(jQuery.proxy(this._handleTouchScroll,this), {
				bouncing:false
			});
		}
	};
	
	
	/**
	 * Rerendering handling
	 * @private
	 */
	ScrollBar.prototype.onBeforeRendering = function() {
		this.$("sb").unbind("scroll", this.onscroll);
	};
	
	
	/**
	 * Rerendering handling
	 * @private
	 */
	ScrollBar.prototype.onAfterRendering = function () {
		 // count of steps (comes per API)
		this._iSteps = this.getSteps();
	
		// content size in pixel
		var sContentSize = this.getContentSize();
	
		// determine the mode
		this._bStepMode = !sContentSize;
	
		var iScrollBarSize = this.getSize();
		if (jQuery.sap.endsWith(iScrollBarSize,"px")) {
			iScrollBarSize = iScrollBarSize.substr(0, iScrollBarSize.length - 2);
		} else {
			iScrollBarSize = this.getVertical() ? this.$().height() : this.$().width();
		}
	
		var stepSize = null;
	
		var $ffsize = this.$("ffsize");
		if (!!Device.browser.firefox) {
			stepSize = $ffsize.outerHeight();
			if ( stepSize === 0) {
				// the following code is used if a container of the scrollbar is rendered invisible and afterwards is set to visible
				stepSize = window.getComputedStyle(jQuery("body").get(0))["font-size"];
				if (jQuery.sap.endsWith(stepSize,"px")) {
					stepSize = stepSize.substr(0, stepSize.length - 2);
				}
				stepSize = parseInt(stepSize, 10);
			}
		}
		$ffsize.remove();
	
		if (!!Device.browser.webkit) {
			// document.width - was not supported by Chrome 17 anymore, but works again with Chrome from 18 to 30, and does not work in chrom 31.
			if  (!document.width) {
				stepSize = Math.round(40 / (window.outerWidth / jQuery(document).width()));
			} else {
				stepSize = Math.round(40 / (document.width / jQuery(document).width()));
				//jQuery.sap.log.debug( stepSize + " ****************************STEP SIZE*************************************************************");
			}
		}
	
		if (this.getVertical()) {
			if (!!Device.browser.firefox) {
				this._iFactor = stepSize;
			} else if (!!Device.browser.webkit) {
				this._iFactor = stepSize;
			} else {
				this._iFactor = Math.floor(iScrollBarSize  * 0.125);
			}
			this._iFactorPage = !!Device.browser.firefox ? iScrollBarSize - stepSize : Math.floor(iScrollBarSize * 0.875);
		} else {
			if (!!Device.browser.firefox) {
				this._iFactor = 10;
				this._iFactorPage = Math.floor(iScrollBarSize * 0.8);
			} else if (!!Device.browser.webkit) {
				this._iFactor = stepSize;
				this._iFactorPage = Math.floor(iScrollBarSize  * 0.875);
			} else {
				this._iFactor = 7;
				this._iFactorPage = iScrollBarSize - 14;
			}
		}
	
		this._$ScrollDomRef = this.$("sb");
	
		if (this._bStepMode) {
			
			if (this.getVertical()) {
				// calculate the height of the content size => scroll bar height + (steps * browser step size)
				var iSize = this._iSteps * this._iFactor;
				
				if (iSize > this._iMaxContentDivSize) {
					this._iFactor = this._iFactor / (iSize / this._iMaxContentDivSize);
				}
				
				var iContentSize = this._$ScrollDomRef.height() + Math.ceil(this._iSteps * this._iFactor);
				
				// set the content size
				this._$ScrollDomRef.find("div").height(iContentSize);
			} else {
				// calculate the height of the content size => scroll bar size + (steps * browser step size)
				var iContentSize = this._$ScrollDomRef.width() + this._iSteps * this._iFactor;
				// set the content size
				this._$ScrollDomRef.find("div").width(iContentSize);
			}
		}
	
		this.setCheckedScrollPosition(this.getScrollPosition() ? this.getScrollPosition() : 0, true);
	
		this._$ScrollDomRef.bind("scroll", jQuery.proxy(this.onscroll, this));
	
		if (jQuery.sap.touchEventMode === "ON") {
			this._bSkipTouchHandling = true;
			
			var oContent = {
					width:0,
					height:0
			};
			oContent[this.getVertical() ? "height" : "width"] = this._bStepMode ? (this.getSteps() * this._iTouchStepTreshold) : parseInt(this.getContentSize(), 10);
	
			this._oTouchScroller.setDimensions(0, 0, oContent.width, oContent.height);
		
			var oElement = this._$ScrollDomRef.get(0);
			var oRect = oElement.getBoundingClientRect();
			this._oTouchScroller.setPosition(oRect.left + oElement.clientLeft, oRect.top + oElement.clientTop);
			this._bSkipTouchHandling = false;
		}
	};
	
	//=============================================================================
	// CONTROL EVENT HANDLING
	//=============================================================================
	
	/**
	 * Event object contains detail (for Firefox and Opera), and wheelData (for Internet Explorer, Safari, and Opera).
	 * Scrolling down is a positive number for detail, but a negative number for wheelDelta.
	 * @param {jQuery.Event} oEvent Event object contains detail (for Firefox and Opera), and wheelData (for Internet Explorer, Safari, and Opera).
	 * @private
	 */
	ScrollBar.prototype.onmousewheel = function(oEvent)  {
	
		// ignore the mousewheel events when the scrollbar is not visible
		if (this.$().is(":visible")) {
		
			// So let's scale and make negative value for all scroll down in all browsers.
			var oOriginalEvent = oEvent.originalEvent;
			var wheelData = oOriginalEvent.detail ? oOriginalEvent.detail : oOriginalEvent.wheelDelta * (-1) / 40;
		
			// find out if the user is scrolling up= back or down= forward.
			var bForward = wheelData > 0 ? true : false;
		
			if (jQuery.sap.containsOrEquals(this._$ScrollDomRef[0], oEvent.target)) {
				this._doScroll(sap.ui.core.ScrollBarAction.MouseWheel, bForward);
			} else {
		
				this._bMouseWheel = true;
				var pos = null;
				if (this._bStepMode) {
					pos = wheelData + this._iOldStep;
				} else {
					pos = wheelData * this._iFactor + this._iOldScrollPos;
				}
		
				this.setCheckedScrollPosition(pos, true);
			}
		
			// prevent the default behavior
			oEvent.preventDefault();
			oEvent.stopPropagation();
			return false;
			
		}
			
	};
	
	
	/**
	 * Touch start handler. Called when the "touch start" event occurs on this control.
	 * @param {jQuery.Event} oEvent Touch Event object 
	 * @private
	 */
	ScrollBar.prototype.ontouchstart = function(oEvent) {
		// Don't react if initial down happens on a form element
		var aTouches =  oEvent.touches;
		var oFirstTouch = aTouches[0];
		if (oFirstTouch && oFirstTouch.target && oFirstTouch.target.tagName.match(/input|textarea|select/i)) {
			return;
		}
		if (this._oTouchScroller) {
			this._oTouchScroller.doTouchStart(aTouches, oEvent.timeStamp);
		}
		if (aTouches.length == 1) {
			oEvent.preventDefault();
		}
	};
	
	
	/**
	 * Touch move handler. Called when the "touch move" event occurs on this control.
	 * @param {jQuery.Event} oEvent Touch Event object 
	 * @private
	 */
	ScrollBar.prototype.ontouchmove = function(oEvent) {
		if (this._oTouchScroller) {
			this._oTouchScroller.doTouchMove(oEvent.touches, oEvent.timeStamp, oEvent.scale);
		}
	};
	
	
	/**
	 * Touch end handler. Called when the "touch end" event occurs on this control.
	 * @param {jQuery.Event} oEvent Touch Event object 
	 * @private
	 */
	ScrollBar.prototype.ontouchend = function(oEvent) {
		if (this._oTouchScroller) {
			this._oTouchScroller.doTouchEnd(oEvent.timeStamp);
		}
	};
	
	/**
	 * Touch cancel handler. Called when the "touch cancel" event occurs on this control.
	 * @param {jQuery.Event} oEvent Touch Event object 
	 * @private
	 */
	ScrollBar.prototype.ontouchcancel = function(oEvent) {
		if (this._oTouchScroller) {
			this._oTouchScroller.doTouchEnd(oEvent.timeStamp);
		}
	};
	
	/**
	* Handles the Scroll event. 
	*
	* @param {jQuery.Event}  oEvent Event object
	* @private
	*/
	ScrollBar.prototype.onscroll = function(oEvent) {
		//jQuery.sap.log.debug("*****************************onScroll************************ SUPRESS SCROLL:  " + this._bSuppressScroll );
		if (this._bSuppressScroll) {
			this._bSuppressScroll = false;
			oEvent.preventDefault();
			oEvent.stopPropagation();
			return false;
		}
	
		// Set new Scroll position
		var iScrollPos = null;
		if (this._$ScrollDomRef) {
			if (this.getVertical()) {
				iScrollPos = Math.round(this._$ScrollDomRef.scrollTop());
			} else {
				iScrollPos = Math.round(this._$ScrollDomRef.scrollLeft());
				if ( !!Device.browser.firefox && this._bRTL ) {
					iScrollPos = Math.abs(iScrollPos);
				} else if ( !!Device.browser.webkit && this._bRTL ) {
					var oScrollDomRef = this._$ScrollDomRef.get(0);
					iScrollPos = oScrollDomRef.scrollWidth - oScrollDomRef.clientWidth - oScrollDomRef.scrollLeft;
				}
			}
		}
	
		var iDelta = iScrollPos - this._iOldScrollPos;
	
		var bForward = iDelta > 0 ? true : false;
		if (iDelta < 0) {
			iDelta = iDelta * (-1);
		}
	
		var eAction = sap.ui.core.ScrollBarAction.Drag;
		if (iDelta == this._iFactor) {
			eAction = sap.ui.core.ScrollBarAction.Step;
		} else if (iDelta == this._iFactorPage) {
			eAction = sap.ui.core.ScrollBarAction.Page;
		} else if (this._bMouseWheel) {
			eAction = sap.ui.core.ScrollBarAction.MouseWheel;
		}
	
		// Proceed scroll
		if (this._bLargeDataScrolling && eAction === sap.ui.core.ScrollBarAction.Drag) {
			this._eAction = eAction;
			this._bForward = bForward;
			if (sap.ui.Device.browser.internet_explorer) {
				if (this._scrollTimeout) {
					window.clearTimeout(this._scrollTimeout);
				}
				this._scrollTimeout = window.setTimeout(
					this._onScrollTimeout.bind(this),
					300
				);
			}
		} else {
			this._doScroll(eAction, bForward);
		}
	
		oEvent.preventDefault();
		oEvent.stopPropagation();
		return false;
	};
	
	ScrollBar.prototype._onScrollTimeout = function(){
		this._scrollTimeout = undefined;
		this._doScroll(this._eAction, this._bForward);
		this._eAction = undefined;
		this._bForward = undefined;
		this._bTouchScroll = undefined;
	};

	ScrollBar.prototype.onmouseup = function() {
		if (this._bLargeDataScrolling && (this._eAction || this._bForward || this._bTouchScroll) && !sap.ui.Device.browser.internet_explorer) {
			this._doScroll(this._eAction, this._bForward);
			this._eAction = undefined;
			this._bForward = undefined;
			this._bTouchScroll = undefined;
		}
	};

	ScrollBar.prototype.ontouchend = ScrollBar.prototype.onmouseup;

	/**
	 * Handler for the touch scroller instance. Called only when touch mode is enabled.
	 *
	 * @param {number} left Horizontal scroll position
	 * @param {number} top Vertical scroll position 
	 * @param {number} zoom The zoom level
	 * @private
	 */
	ScrollBar.prototype._handleTouchScroll = function(iLeft, iTop, iZoom) {
		if (this._bSkipTouchHandling) {
			return;
		}
	
		var iValue = this.getVertical() ? iTop : iLeft;
		var iPos;
		if (this._bStepMode) {
			iPos = Math.max(Math.round(iValue / this._iTouchStepTreshold), 0);
		} else {
			iPos = Math.round(iValue);
		}
		if (this._iLastTouchScrollerPosition !== iPos) {
			this._iLastTouchScrollerPosition = iPos;
			this.setCheckedScrollPosition(iPos, true);
			if (this._bLargeDataScrolling) {
				this._bTouchScroll = true;
			} else {
				this.fireScroll();
			}
		}
	};
	
	
	//=============================================================================
	// PUBLIC API METHODS
	//=============================================================================
	
	/**
	 * Unbinds the mouse wheel scroll event of the control that has the scrollbar
	 *
	 * @param {string} oOwnerDomRef
	 *         Dom ref of the Control that uses the scrollbar
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	ScrollBar.prototype.unbind = function (oOwnerDomRef) {
		if (oOwnerDomRef) {
			this._$OwnerDomRef = jQuery(oOwnerDomRef);
			if (this.getVertical()) {
				this._$OwnerDomRef.unbind(!!Device.browser.firefox ? "DOMMouseScroll" : "mousewheel", this.onmousewheel);
			}
			
			if (jQuery.sap.touchEventMode === "ON") {
				this._$OwnerDomRef.unbind(this._getTouchEventType("touchstart"), jQuery.proxy(this.ontouchstart, this));
				this._$OwnerDomRef.unbind(this._getTouchEventType("touchmove"), jQuery.proxy(this.ontouchmove, this));
				this._$OwnerDomRef.unbind(this._getTouchEventType("touchend"), jQuery.proxy(this.ontouchend, this));
				this._$OwnerDomRef.unbind(this._getTouchEventType("touchcancle"), jQuery.proxy(this.ontouchcancle, this));
			}
		}
	};
	
	/**
	 * Binds the mouse wheel scroll event of the control that has the scrollbar to the scrollbar itself.
	 *
	 * @param {string} oOwnerDomRef
	 *         Dom ref of the control that uses the scrollbar
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	ScrollBar.prototype.bind = function (oOwnerDomRef) {
		if (oOwnerDomRef) {
			this._$OwnerDomRef = jQuery(oOwnerDomRef);
			if (this.getVertical()) {
				this._$OwnerDomRef.bind(!!Device.browser.firefox ? "DOMMouseScroll" : "mousewheel", jQuery.proxy(this.onmousewheel, this));
			}
	
			if (jQuery.sap.touchEventMode === "ON") {
				this._$OwnerDomRef.bind(this._getTouchEventType("touchstart"), jQuery.proxy(this.ontouchstart, this));
				this._$OwnerDomRef.bind(this._getTouchEventType("touchmove"), jQuery.proxy(this.ontouchmove, this));
				this._$OwnerDomRef.bind(this._getTouchEventType("touchend"), jQuery.proxy(this.ontouchend, this));
				this._$OwnerDomRef.bind(this._getTouchEventType("touchcancle"), jQuery.proxy(this.ontouchcancle, this));
			}
		}
	};
	
	/**
	* Returns the event type for a given touch event type base on the current touch event mode (jQuery.sap.touchEventMod).
	*   
	 * @param {string} sType The touch event to convert
	* @return {string} The converted event type.
	* @private
	*/
	ScrollBar.prototype._getTouchEventType = function (sType) {
		return jQuery.sap.touchEventMode === "SIM" ? ("sap" + sType) : sType;
	};
	
	/**
	 * Page Up is used to scroll one page back.
	 *
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	ScrollBar.prototype.pageUp = function() {
		// call on scroll
		this._doScroll(sap.ui.core.ScrollBarAction.Page, false);
	};
	
	/**
	 * Page Down is used to scroll one page forward.
	 *
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	ScrollBar.prototype.pageDown = function() {
		// call on scroll
		this._doScroll(sap.ui.core.ScrollBarAction.Page, true);
	};
	
	//=============================================================================
	// OVERRIDE OF SETTERS
	//=============================================================================
	
	/*
	 * @see JSDoc generated by SAPUI5 control API generator
	 */
	ScrollBar.prototype.setScrollPosition = function (scrollPosition) {
		if (this._$ScrollDomRef) {
			this.setCheckedScrollPosition(scrollPosition, true);
		} else {
			this.setProperty("scrollPosition", scrollPosition);
		}
		return this;
	};
	
	/*
	 * After the Scrollbar is rendered, we check the validity of the scroll position and set Scroll Left and ScrollTop.
	 * @private
	 */
	ScrollBar.prototype.setCheckedScrollPosition = function (scrollPosition, callScrollEvent) {
	
		var iCheckedSP = Math.max(scrollPosition, 0);
	
		if ( this._bStepMode === undefined) {
			this._bStepMode = !this.getContentSize();
		}
	
		var iScrollPos = iCheckedSP;
		if ( this._bStepMode) {
	
			iCheckedSP = Math.min(iCheckedSP, this.getSteps());
	
			// STEPS MODE - Calculate the position in PX
			iScrollPos = iCheckedSP * this._iFactor;
		}
	
		iCheckedSP = Math.round(iCheckedSP);
	
		this._bSuppressScroll = !callScrollEvent;
		this.setProperty("scrollPosition", iCheckedSP, true);
	
		if ( this.getVertical()) {
				this._$ScrollDomRef.scrollTop(iScrollPos);
			} else {
			if ( !!Device.browser.firefox && this._bRTL ) {
				this._$ScrollDomRef.scrollLeft(-iScrollPos);
			} else if ( !!Device.browser.webkit && this._bRTL ) {
				var oScrollDomRef = this._$ScrollDomRef.get(0);
				this._$ScrollDomRef.scrollLeft(oScrollDomRef.scrollWidth - oScrollDomRef.clientWidth - iScrollPos);
			} else {
				this._$ScrollDomRef.scrollLeft(iScrollPos);
			}
		}
	
		if (jQuery.sap.touchEventMode === "ON") {
			var value = iCheckedSP;
			if (this._bStepMode) {
				value = Math.round(iCheckedSP * this._iTouchStepTreshold);
			}
	
			this._oTouchScroller.__scrollTop = this.getVertical() ? value : 0;
			this._oTouchScroller.__scrollLeft =  this.getVertical() ? 0 : value;
		}
	};
	
	/*
	 * @see JSDoc generated by SAPUI5 control API generator
	 */
	ScrollBar.prototype.setContentSize = function (sContentSize) {
	
		// Trigger the rerendering when switching the from step mode.
		this.setProperty("contentSize", sContentSize);
		this._bStepMode = false;
		var $SbCnt = this.$("sbcnt");
		if ($SbCnt) {
			if (this.getVertical()) {
				$SbCnt.height(sContentSize);
			} else {
				$SbCnt.width(sContentSize);
			}
		}
		return this;
	};
	
	//=============================================================================
	// PRIVATE METHODS
	//=============================================================================
	
	/**
	 * Process scroll events and fire scroll event
	 * @param eAction Action type that can be mouse wheel, Drag, Step or Page.
	 * @param bForward Scroll Direction - forward or back
	 * @private
	 */
	ScrollBar.prototype._doScroll = function(eAction, bForward) {
	
		// Get new scroll position
		var iScrollPos = null;
		if (this._$ScrollDomRef) {
			if (this.getVertical()) {
				iScrollPos = Math.round(this._$ScrollDomRef.scrollTop());
			} else {
				iScrollPos = Math.round(this._$ScrollDomRef.scrollLeft());
				if (!!Device.browser.firefox && this._bRTL ) {
					iScrollPos = Math.abs(iScrollPos);
				} else if ( !!Device.browser.webkit && this._bRTL ) {
					var oScrollDomRef = this._$ScrollDomRef.get(0);
					iScrollPos = oScrollDomRef.scrollWidth - oScrollDomRef.clientWidth - oScrollDomRef.scrollLeft;
				}
			}
		}
	
		if (this._bStepMode) {
	
			// STEP MODE
			var iStep = Math.round(iScrollPos / this._iFactor);
			var iOldStep = this._iOldStep;
	
			if (iOldStep !== iStep) {
	
				// Set new scrollposition without the rerendering
				this.setCheckedScrollPosition(iStep, false);
	
				jQuery.sap.log.debug("-----STEPMODE-----: New Step: " + iStep + " --- Old Step: " +  iOldStep  + " --- Scroll Pos in px: " + iScrollPos + " --- Action: " + eAction + " --- Direction is forward: " + bForward);
				this.fireScroll({ action: eAction, forward: bForward, newScrollPos: iStep, oldScrollPos: iOldStep});
				this._iOldStep = iStep;
	
			}
		} else {
	
			// Set new scroll position without the rerendering:
			iScrollPos = Math.round(iScrollPos);
			this.setProperty("scrollPosition", iScrollPos, true);
	
			jQuery.sap.log.debug("-----PIXELMODE-----: New ScrollPos: " + iScrollPos + " --- Old ScrollPos: " +  this._iOldScrollPos + " --- Action: " + eAction + " --- Direction is forward: " + bForward);
			this.fireScroll({ action: eAction, forward: bForward, newScrollPos: iScrollPos, oldScrollPos: this._iOldScrollPos});
		}
		// rounding errors in IE lead to infinite scrolling
		if (Math.round(this._iFactor) == this._iFactor || !sap.ui.Device.browser.internet_explorer) {
			this._bSuppressScroll = false;
		}
		this._iOldScrollPos = iScrollPos;
		this._bMouseWheel = false;
	
	};
	
	ScrollBar.prototype.onThemeChanged = function() {
		this.rerender();
	};
	
	/**
	 * return the native scroll position without any browser specific correction of 
	 * the scroll position value (firefox & RTL => negative value / webkit & RTL =>
	 * positive value not beginning with 0 because 0 is left and not as expected 
	 * right for webkit RTL mode).
	 * @return {int} native scroll position
	 * @private
	 */
	ScrollBar.prototype.getNativeScrollPosition = function() {
		if (this._$ScrollDomRef) {
			if (this.getVertical()) {
				return Math.round(this._$ScrollDomRef.scrollTop());
			} else {
				return Math.round(this._$ScrollDomRef.scrollLeft());
			}
		}
		return 0;
	};
	
	/**
	 * sets the scroll position directly
	 * @param {int} iNativeScrollPos new native scroll position
	 * @private
	 */
	ScrollBar.prototype.setNativeScrollPosition = function(iNativeScrollPos) {
		var iScrollPos = Math.round(iNativeScrollPos);
		if (this._$ScrollDomRef) {
			if (this.getVertical()) {
				this._$ScrollDomRef.scrollTop(iScrollPos);
			} else {
				this._$ScrollDomRef.scrollLeft(iScrollPos);
			}
		}
	};

	return ScrollBar;

});
