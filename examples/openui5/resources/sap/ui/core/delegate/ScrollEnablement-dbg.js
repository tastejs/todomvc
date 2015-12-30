/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

/**
 * @namespace
 * @name sap.ui.core.delegate
 * @public
 */

// Provides class sap.ui.core.delegate.ScrollEnablement
sap.ui.define(['jquery.sap.global', 'sap/ui/Device', 'sap/ui/base/Object'],
	function(jQuery, Device, BaseObject) {
	"use strict";


	var $ = jQuery;

		/**
		 * Creates a ScrollEnablement delegate that can be attached to Controls requiring
		 * capabilities for scrolling of a certain part of their DOM on mobile devices.
		 *
		 * @class Delegate for touch scrolling on mobile devices
		 *
		 * This delegate uses CSS (-webkit-overflow-scrolling) only if supported. Otherwise the desired
		 * scrolling library is used. Please also consider the documentation
		 * of the library for a proper usage.
		 *
		 * Controls that implement ScrollEnablement should additionally provide the getScrollDelegate method that returns
		 * the current instance of this delegate object
		 *
		 * @extends sap.ui.base.Object
		 * @experimental Since 1.5.2. This class is experimental and provides only limited functionality. Also the API might be changed in future.
		 *
		 * @param {sap.ui.core.Control} oControl the Control of which this Scroller is the delegate
		 * @param {string} sScrollContentDom the Id of the element within the DOM of the Control which should be scrollable
		 * @param {object} oConfig the configuration of the scroll delegate
		 * @param {boolean} [oConfig.horizontal=false] Whether the element should be scrollable horizontally
		 * @param {boolean} [oConfig.vertical=false] Whether the element should be scrollable vertically
		 * @param {boolean} [oConfig.zynga=false] If set, then the Zynga scroller (http://zynga.github.com/scroller/) is used
		 * @param {boolean} [oConfig.iscroll=false] If set, then iScroll (http://cubiq.org/iscroll-4) is used
		 * @param {boolean} [oConfig.preventDefault=false] If set, the default of touchmove is prevented
		 * @param {boolean} [oConfig.nonTouchScrolling=false] If true, the delegate will also be active to allow touch like scrolling with the mouse on non-touch platforms.
		 * @param {string} [oConfig.scrollContainerId=""] Native scrolling does not need content wrapper. In this case, ID of the container element should be provided.
		 *
		 * @constructor
		 * @protected
		 * @alias sap.ui.core.delegate.ScrollEnablement
		 * @version 1.32.9
		 * @author SAP SE
		 */
		var ScrollEnablement = BaseObject.extend("sap.ui.core.delegate.ScrollEnablement", /** @lends sap.ui.core.delegate.ScrollEnablement.prototype */ {

			constructor : function(oControl, sScrollContentDom, oConfig) {

				BaseObject.apply(this);

				this._oControl = oControl;
				this._oControl.addDelegate(this);
				this._sContentId = sScrollContentDom;
				this._sContainerId = oConfig.scrollContainerId;
				this._bHorizontal = !!oConfig.horizontal;
				this._bVertical = !!oConfig.vertical;
				this._scrollX = 0;
				this._scrollY = 0;
				this._scroller = null;
				this._scrollbarClass = oConfig.scrollbarClass || false;
				this._bounce = oConfig.bounce;
				this._scrollCoef = 0.9; // Approximation coefficient used to mimic page down and page up behaviour when [CTRL] + [RIGHT] and [CTRL] + [LEFT] is used

				initDelegateMembers(this, oConfig);

				if (this._init) {
					this._init.apply(this, arguments);
				}
			},

			/**
			 * Enable or disable horizontal scrolling.
			 *
			 * @param {boolean} bHorizontal set true to enable horizontal scrolling, false - to disable
			 * @protected
			 */
			setHorizontal : function(bHorizontal) {
				this._bHorizontal = !!bHorizontal;

				if (this._scroller) {
					if (this._zynga) {

						// Zynga keeps scrolling options internally
						this._scroller.options.scrollingX = this._bHorizontal;
					} else {
						// iScroll
						this._scroller.hScroll = this._scroller.hScrollbar = this._bHorizontal;
						this._scroller._scrollbar('h');
					}
				} else if (this._setOverflow) { // native scrolling
					this._setOverflow();
				}
			},

			/**
			 * Enable or disable vertical scrolling.
			 *
			 * @param {boolean} bVertical set true to enable vertical scrolling, false - to disable
			 * @protected
			 */
			setVertical : function(bVertical) {
				this._bVertical = !!bVertical;

				if (this._scroller) {
					if (this._zynga) {

						// Zynga options
						this._scroller.options.scrollingY = this._bVertical;
					} else {

						// iScroll
						this._scroller.vScroll = this._scroller.vScrollbar = this._bVertical;
						this._scroller._scrollbar('v');
					}
				} else if (this._setOverflow) { //native scrolling
					this._setOverflow();
				}
			},

			/**
			 * Get current setting for horizontal scrolling.
			 *
			 * @return {boolean} true if horizontal scrolling is enabled
			 * @protected
			 * @since 1.9.1
			 */
			getHorizontal : function() {
				return this._bHorizontal;
			},

			/**
			 * Get current setting for vertical scrolling.
			 *
			 * @return {boolean} true if vertical scrolling is enabled
			 * @protected
			 * @since 1.9.1
			 */
			getVertical : function() {
				return this._bVertical;
			},

			/**
			 * Setter for property <code>bounce</code>.
			 *
			 * @param {boolean} bBounce new value for property <code>bounce</code>.
			 * @protected
			 * @since 1.17
			 */
			setBounce: function(bBounce) {
				this._bounce = !!bBounce;
			},

			/**
			 * Set overflow control on top of scroll container.
			 *
			 * @param {sap.ui.core.Control} top control that should be normally hidden over
			 * the top border of the scroll container (pull-down content).
			 * This function is supported in iScroll delegates only. In MouseScroll delegates the element is not hidden and should have an appropriate rendering for being always displayed and should have an alternative way for triggering (e.g. a Button).
			 * @protected
			 * @since 1.9.2
			 */
			setPullDown : function(oControl) {
				this._oPullDown = oControl;
				return this;
			},

			/**
			 * Sets GrowingList control to scroll container
			 *
			 * @param {sap.m.GrowingList} GrowingList instance
			 * This function is supported in iScroll and mouse delegates only.
			 * @protected
			 * @since 1.11.0
			 */
			setGrowingList : function(oGrowingList, fnScrollLoadCallback) {
				this._oGrowingList = oGrowingList;
				this._fnScrollLoadCallback = jQuery.proxy(fnScrollLoadCallback, oGrowingList);
				return this;
			},

			/**
			 * Sets IconTabBar control to scroll container
			 *
			 * @param {sap.m.IconTabBar} IconTabBar instance
			 * This function is supported in iScroll only.
			 * @protected
			 * @since 1.16.1
			 */
			setIconTabBar : function(oIconTabBar, fnScrollEndCallback, fnScrollStartCallback) {
				this._oIconTabBar = oIconTabBar;
				this._fnScrollEndCallback = jQuery.proxy(fnScrollEndCallback, oIconTabBar);
				this._fnScrollStartCallback = jQuery.proxy(fnScrollStartCallback, oIconTabBar);
				return this;
			},

			scrollTo : function(x, y, time) {
				this._scrollX = x; // remember for later rendering
				this._scrollY = y;
				this._scrollTo(x, y, time);
				return this;
			},

			/**
			 * Calculates scroll position of a child of a container.
			 * @param {HTMLElement | jQuery} vElement An element(DOM or jQuery) for which the scroll position will be calculated.
			 * @returns {object} Position object.
			 * @protected
			 */
			getChildPosition: function(vElement) {
				// check if vElement is a DOM element and if yes convert it to jQuery object
				var $Element = vElement instanceof jQuery ? vElement : $(vElement),
					oElementPosition = $Element.position(),
					$OffsetParent = $Element.offsetParent(),
					oAddUpPosition;

				while (!$OffsetParent.is(this._$Container)) {
					oAddUpPosition = $OffsetParent.position();
					oElementPosition.top += oAddUpPosition.top;
					oElementPosition.left += oAddUpPosition.left;
					$OffsetParent = $OffsetParent.offsetParent();
				}

				return oElementPosition;
			},

			/**
			 * Scrolls to an element within a container.
			 * @param {HTMLElement} oElement A DOM element.
			 * @param {int} [iTime=0] The duration of animated scrolling in milliseconds. To scroll immediately without animation, give 0 as value.
			 * @returns {ScrollEnablement}
			 * @protected
			 */
			scrollToElement: function(oElement, iTime) {
				// do nothing if _$Container is not a (grand)parent of oElement
				if (!this._$Container[0].contains(oElement) ||
					oElement.style.display === "none" ||
					oElement.offsetParent.nodeName.toUpperCase() === "HTML") {
						return this;
				}

				var $Element = $(oElement),
					oScrollPosition = this.getChildPosition($Element),
					iLeftScroll = this.getScrollLeft() + oScrollPosition.left,
					iTopScroll = this.getScrollTop() + oScrollPosition.top;

				if (this._bFlipX) {
					// in IE RTL scrollLeft goes opposite direction
					iLeftScroll = this.getScrollLeft() - (oScrollPosition.left - this._$Container.width()) - $Element.width();
				}

				// scroll to destination
				this._scrollTo(iLeftScroll, iTopScroll , iTime);

				return this;
			},

			/**
			 * Destroys this Scrolling delegate.
			 *
			 * This function must be called by the control which uses this delegate in the <code>exit</code> function.
			 * @protected
			 */
			destroy : function() {
				if (this._exit) {
					this._exit();
				}

				if (this._oControl) {
					this._oControl.removeDelegate(this);
					this._oControl = undefined;
				}
			},

			/**
			 * Refreshes this Scrolling delegate.
			 *
			 * @protected
			 */
			refresh : function() {
				if (this._refresh) {
					this._refresh();
				}
			},

			_useDefaultScroll : function(target) {
				return target.isContentEditable || this._scroller;
			},

			onkeydown : function(oEvent) {
				if (this._useDefaultScroll(oEvent.target)) {
					return;
				}

				var container = this._$Container[0];

				if (oEvent.altKey && this.getHorizontal()) {
					switch (oEvent.keyCode) {
						case jQuery.sap.KeyCodes.PAGE_UP:
							// Navigate 1 page left
							this._customScrollTo(this._scrollX - container.clientWidth, this._scrollY, oEvent);
							break;
						case jQuery.sap.KeyCodes.PAGE_DOWN:
							// Navigate 1 page right
							this._customScrollTo(this._scrollX + container.clientWidth, this._scrollY, oEvent);
							break;
					}
				}

				if (oEvent.ctrlKey) {
					switch (oEvent.keyCode) {
						case jQuery.sap.KeyCodes.ARROW_UP:
							// [CTRL]+[UP] - 1 page up
							if (this.getVertical()) {
								this._customScrollTo(this._scrollX, this._scrollY - container.clientHeight * this._scrollCoef, oEvent);
							}
							break;
						case jQuery.sap.KeyCodes.ARROW_DOWN:
							// [CTRL]+[DOWN] - 1 page down
							if (this.getVertical()) {
								this._customScrollTo(this._scrollX, this._scrollY + container.clientHeight * this._scrollCoef, oEvent);
							}
							break;
						case jQuery.sap.KeyCodes.ARROW_LEFT:
							// [CTRL]+[LEFT] - 1 page left
							if (this.getHorizontal()) {
								this._customScrollTo(this._scrollX - container.clientWidth, this._scrollY, oEvent);
							}
							break;
						case jQuery.sap.KeyCodes.ARROW_RIGHT:
							// [CTRL]+[RIGHT] - 1 page right
							if (this.getHorizontal()) {
								this._customScrollTo(this._scrollX + container.clientWidth, this._scrollY, oEvent);
							}
							break;
						case jQuery.sap.KeyCodes.HOME:
							if (this.getHorizontal()) {
								this._customScrollTo(0, this._scrollY, oEvent);
							}

							if (this.getVertical()) {
								this._customScrollTo(this._scrollX, 0, oEvent);
							}
							break;
						case jQuery.sap.KeyCodes.END:

							var left = container.scrollWidth - container.clientWidth;
							var top = container.scrollHeight - container.clientHeight;

							if (!this.getHorizontal()) {
								top = this._scrollY;
							}

							if (!this.getVertical()) {
								left = this._scrollX;
							}

							this._customScrollTo(left, top, oEvent);
							break;
					}
				}
			},

			_customScrollTo : function(left, top, oEvent) {
				oEvent.preventDefault();
				oEvent.setMarked();

				this._scrollTo(left, top);
			}

		});

		/* =========================================================== */
		/* Delegate members for usage of iScroll library               */
		/* =========================================================== */


		var oIScrollDelegate = {

			getScrollTop : function() {
				return this._scrollY;
			},

			getScrollLeft : function() {
				return this._scrollX;
			},

			getMaxScrollTop : function() {
				return this._scroller ? -this._scroller.maxScrollY : 0;
			},

			_scrollTo : function(x, y, time) {
				this._scroller && this._scroller.scrollTo(-x, -y, time, false);
			},

			_refresh : function() {
				if (this._scroller && this._sScrollerId) {
					var oScroller = $.sap.domById(this._sScrollerId);

					if (oScroller && (oScroller.offsetHeight > 0)) { // only refresh if rendered and not collapsed to zero height (e.g. display: none)

						this._bIgnoreScrollEnd = true; // this refresh may introduce wrong position 0 after invisible rerendering
						this._scroller.refresh();
						this._bIgnoreScrollEnd = false;

						// and if scroller is not yet at the correct position (e.g. due to rerendering) move it there
						if (-this._scrollX != this._scroller.x || -this._scrollY != this._scroller.y) {
							this._scroller.scrollTo(-this._scrollX, -this._scrollY, 0);
						}

						// reset scrollTop of the section after webkit soft keyboard is closed
						if (this._scroller.wrapper && this._scroller.wrapper.scrollTop) {
							this._scroller.wrapper.scrollTop = 0;
						}
					}
				}
			},

			_cleanup : function() {
				this._toggleResizeListeners(false);

				if (this._scroller) {
					this._scroller.stop();
					this._scrollX = -this._scroller.x; // remember position for after rendering
					var oScroller = $.sap.domById(this._sScrollerId);

					if (oScroller && (oScroller.offsetHeight > 0)) {
						this._scrollY = -this._scroller.y;
					}

					this._scroller.destroy();
					this._scroller = null;
				}
			},

			_toggleResizeListeners : function(bToggle){

				if (this._sScrollerResizeListenerId) {
					sap.ui.core.ResizeHandler.deregister(this._sScrollerResizeListenerId);
					this._sScrollerResizeListenerId = null;
				}

				if (this._sContentResizeListenerId) {
					sap.ui.core.ResizeHandler.deregister(this._sContentResizeListenerId);
					this._sContentResizeListenerId = null;
				}

				if (bToggle && this._sContentId && $.sap.domById(this._sContentId)) {

					//TODO Prevent a double refresh
					var $fRefresh = $.proxy(this._refresh, this);
					this._sScrollerResizeListenerId = sap.ui.core.ResizeHandler.register( $.sap.domById(this._sScrollerId), $fRefresh );
					this._sContentResizeListenerId = sap.ui.core.ResizeHandler.register( $.sap.domById(this._sContentId), $fRefresh );
				}

			},

			onBeforeRendering : function() {
				this._cleanup();
			},

			onfocusin: function(evt) {
				// on Android Inputs need to be scrolled into view
				if (ScrollEnablement._bScrollToInput && Device.os.android) {
					var element = evt.srcElement;
					this._sTimerId && jQuery.sap.clearDelayedCall(this._sTimerId);
					if (element && element.nodeName &&
							(element.nodeName.toUpperCase() === "INPUT" || element.nodeName.toUpperCase() === "TEXTAREA")) {
						this._sTimerId = jQuery.sap.delayedCall(400, this, function() {
							var offset = this._scroller._offset(element);
							offset.top += 48;
							this._scroller.scrollTo(offset.left, offset.top);
						});
					}
				}
			},

			onAfterRendering : function() {
				var that = this,
					bBounce = (this._bounce !== undefined) ? this._bounce : Device.os.ios;

				var $Content = $.sap.byId(this._sContentId);

				this._sScrollerId = $Content.parent().attr("id");

				// Fix for displaced edit box overlay on scrolled pages in Android 4.x browser:
				var bDontUseTransform = (
						!!Device.os.android &&
						!Device.browser.chrome &&
						(Device.os.version == 4) &&
						$Content.find("input,textarea").length
					);

				this._iTopOffset = this._oPullDown && this._oPullDown.getDomRef && this._oPullDown.getDomRef().offsetHeight || 0;

				var x = this._scrollX || 0,
					y = this._scrollY || 0;

				// RTL adaptations
				if (sap.ui.getCore().getConfiguration().getRTL()) {
					// iScroll does not support RTL, so in RTL mode we need some tweaks (see https://github.com/cubiq/iscroll/issues/247)
					$Content.attr("dir", "rtl");
					var $Parent = $Content.parent();
					$Parent.attr("dir", "ltr");

					if (!this._bScrollPosInitialized) {
						x = this._scrollX = $Content.width() - $Parent.width(); // initial scroll position: scrolled to the right edge in RTL
						this._bScrollPosInitialized = true;
					}
				}

				this._scroller = new window.iScroll(this._sScrollerId, {
					useTransition: true,
					useTransform: !bDontUseTransform,
					hideScrollbar: true,
					fadeScrollbar: true,
					bounce: !!bBounce,
					momentum: true,
					handleClick: false,	/* implicitly set to false otherwise we have double click event */
					hScroll: this._bHorizontal,
					vScroll: this._bVertical,
					x: -x,
					y: -y,
					topOffset: this._iTopOffset,
					scrollbarClass: this._scrollbarClass,
					onBeforeScrollStart: function(oEvent) {

						// A touch on a scrolling list means "stop scrolling" and not a tap.
						if (that._isScrolling) {

							// Do not allow core to convert touchstart+touchend into a tap event during scrolling:
							oEvent.stopPropagation();

							// Disable native HTML behavior on <a> elements:
							oEvent.preventDefault();
						}
					},

					onScrollEnd: function() {
						if (!that._bIgnoreScrollEnd && that._scroller) { // that.scroller can be undefined when scrolled into the empty place
							that._scrollX = -that._scroller.x;
							that._scrollY = -that._scroller.y;
						}

						if (that._oPullDown) {
							that._oPullDown.doScrollEnd();
						}

						if (that._oGrowingList && that._fnScrollLoadCallback) {

							// start loading if 75% of the scroll container is scrolled
							var scrollThreshold = Math.floor(this.wrapperH / 4);
							var bInLoadingLimit = -this.maxScrollY + this.y < scrollThreshold;

							// user needs to scroll bottom and must be in loading range
							if (this.dirY > 0 && bInLoadingLimit) {
								that._fnScrollLoadCallback();
							}

						}

						if (that._oIconTabBar && that._fnScrollEndCallback) {
							that._fnScrollEndCallback();
						}

						that._isScrolling = false;
					},

					onRefresh: function(){
						if (that._oPullDown) {
							that._oPullDown.doRefresh();
						}

						// Reset resize listeners after each refresh to avoid concurrent errors like in
						// the following case:
						// 1. List height: 2000px. Resize handler remembers it
						// 2. PullToRefresh calls refresh, list is empty, height: 800px, iScroll remembers it
						// 3. List is filled again, no change, list height is 2000px.
						// 4. Resize handler checks after 200ms and finds no changes: iScroll has wrong size and
						//    must be refreshed.
						// Due to this, refresh and resize handler registration should be done synchronously
						that._toggleResizeListeners(true);
					},

					onScrollMove: function(oEvent) {
						if (!that._isScrolling) {

							// Workaround for problems with active input and textarea: close keyboard on scroll start
							var rIsTextField = /(INPUT|TEXTAREA)/i,
								oActiveEl = document.activeElement;

							if (rIsTextField.test(oActiveEl.tagName) && oEvent.target !== oActiveEl ) {
								oActiveEl.blur();
							}
						}

						that._isScrolling = true;

						if (that._oPullDown) {
							that._oPullDown.doScrollMove();
						}

						if (that._oIconTabBar && that._fnScrollStartCallback) {
							that._fnScrollStartCallback();
						}
					}
				});

				// Traverse the parents and check if any has a ScrollDelegate with the same vertical or horizontal scroll.
				// Controls that implement ScrollEnablement should provide the getScrollDelegate method.
				for (var oParent = this._oControl; (oParent = oParent.oParent) !== null;) {
					var oSD = oParent.getScrollDelegate ? oParent.getScrollDelegate() : null;
					if (oSD && (oSD.getVertical() && this.getVertical() || oSD.getHorizontal() && this.getHorizontal())) {
						this._scroller._sapui_isNested = true;
						break;
					}
				}

				// SAP modification: disable nested scrolling.
				this._scroller._move = function(oEvent){

					if (oEvent._sapui_handledByControl && !oEvent._sapui_scroll) {
						return;
					}

					// Enable scrolling of outer container when the inner container is scrolled to the end
					// so that a user can "pull out" contents that have been accidentally moved outside of
					// the scrolling container by momentum scrolling.
					if (this._sapui_isNested) {
						oEvent._sapui_handledByControl =
							!(this.dirY < 0 && this.y >= 0) &&
							!(this.dirY > 0 && this.y <= this.maxScrollY) &&
							!(this.dirX < 0 && this.x >= 0) &&
							!(this.dirX > 0 && this.x <= this.maxScrollX);
					}

					window.iScroll.prototype._move.call(this,oEvent);
				};

				// re-apply scrolling position after rendering - but only if changed and the height is > 0
				var oScroller = $Content.parent()[0];

				if (oScroller && (oScroller.offsetHeight > 0)) {
					if (this._scrollX != -this._scroller.x || this._scrollY != -this._scroller.y) {
						this._scroller.scrollTo(-this._scrollX, -this._scrollY, 0);
					}
				}

				// listen to size changes
				this._toggleResizeListeners(true);

			},

			ontouchmove : function(oEvent) {

				if (this._preventTouchMoveDefault) {

					//Prevent the default touch action e.g. scrolling the whole page
					oEvent.preventDefault();
				}
			}
		};

		/* =========================================================== */
		/* Delegate members for usage of Zynga library                 */
		/* =========================================================== */

		var oZyngaDelegate = {

			_refresh : function() {
				if (this._scroller && this._sContentId && $.sap.domById(this._sContentId)) {
					var $Content = $.sap.byId(this._sContentId);
					var $Container = $Content.parent();
					this._scroller.setDimensions($Container.width(), $Container.height(), $Content.width(), $Content.height());
				}
			},

			_cleanup : function() {
				if (this._sScrollerResizeListenerId) {
					sap.ui.core.ResizeHandler.deregister(this._sScrollerResizeListenerId);
					this._sScrollerResizeListenerId = null;
				}

				if (this._sContentResizeListenerId) {
					sap.ui.core.ResizeHandler.deregister(this._sContentResizeListenerId);
					this._sContentResizeListenerId = null;
				}

				if (this._scroller) {
					var oVals = this._scroller.getValues();
					this._scrollX = oVals.left; // remember position for after rendering
					this._scrollY = oVals.top;
				}
			},

			_scrollTo : function(x, y, time){
				if (this._scroller) {
					if (!isNaN(time)) {
						this._scroller.options.animationDuration = time;
					}
					this._scroller.scrollTo(x, y, !!time);
				}
			},

			onBeforeRendering : function() {
				this._cleanup();
			},

			onAfterRendering : function() {
				this._refresh();

				this._scroller.scrollTo(this._scrollX, this._scrollY, false);

				this._sContentResizeListenerId = sap.ui.core.ResizeHandler.register(
					$.sap.domById(this._sContentId),
					$.proxy(function(){
						if ((!this._sContentId || !$.sap.domById(this._sContentId)) && this._sContentResizeListenerId) {
							sap.ui.core.ResizeHandler.deregister(this._sContentResizeListenerId);
							this._sContentResizeListenerId = null;
						} else {
							this._refresh();
						}
					}, this)
				);
			},

			ontouchstart : function(oEvent) {

				// Don't react if initial down happens on a form element
				if (oEvent.target.tagName.match(/input|textarea|select/i)) {
					return;
				}

				this._scroller.doTouchStart(oEvent.touches, oEvent.timeStamp);
			},

			ontouchend : function(oEvent) {
				this._scroller.doTouchEnd(oEvent.timeStamp);
			},

			ontouchmove : function(oEvent) {
				this._scroller.doTouchMove(oEvent.touches, oEvent.timeStamp);
				if (this._preventTouchMoveDefault) {
					//Prevent the default touch action e.g. scrolling the whole page
					oEvent.preventDefault();
				} else {
					// Zynga relies on default browser behavior and
					// the app.control prevents default at window level in initMobile
					oEvent.stopPropagation();
				}
			}
		};

		/* =========================================================== */
		/* Native scroll delegate                                      */
		/* =========================================================== */

		var oNativeScrollDelegate = {

			getScrollTop : function() {
				return this._scrollY || 0;
			},

			getScrollLeft : function() {
				return this._scrollX || 0;
			},

			getMaxScrollTop : function() {
				return (this._$Container && this._$Container.length) ? this._$Container[0].scrollHeight - this._$Container.height() : -1;
			},

			_cleanup : function() {
				if (this._sResizeListenerId) {
					sap.ui.core.ResizeHandler.deregister(this._sResizeListenerId);
					this._sResizeListenerId = null;
				}
			},

			_setOverflow : function(){
				var $Container = this._$Container;
				if (!$Container || !$Container[0]) {
					return;
				}

				// Let container scroll into the configured directions
				if (Device.os.ios || Device.os.blackberry) {
					$Container
						.css("overflow-x", this._bHorizontal ? "scroll" : "hidden")
						.css("overflow-y", this._bVertical ? "scroll" : "hidden")
						.css("-webkit-overflow-scrolling", "touch");
				} else { //other browsers do not support -webkit-overflow-scrolling
					$Container
						.css("overflow-x", this._bHorizontal && !this._bDragScroll ? "auto" : "hidden")
						.css("overflow-y", this._bVertical && !this._bDragScroll ? "auto" : "hidden");
				}
			},

			_refresh : function(){
				var $Container = this._$Container;
				if (!$Container || !$Container.height()) {
					return;
				}

				if (this._oPullDown && this._oPullDown._bTouchMode) {
					// hide pull to refresh (except for state 2 - loading)
					var domRef = this._oPullDown.getDomRef();
					if (domRef) {
							domRef.style.marginTop = this._oPullDown._iState == 2 ? "" : "-" + domRef.offsetHeight + "px";
					}
				}

				if ($Container.scrollTop() != this._scrollY) {
					$Container.scrollTop(this._scrollY);
				}

				if (!(this._oPullDown && this._oPullDown._bTouchMode)
					&& !this._fnScrollLoadCallback
					&& !Device.browser.internet_explorer) {
					// for IE the resize listener must remain in place for the case when navigating away and coming back.
					// For the other browsers it seems to work fine without.
					sap.ui.core.ResizeHandler.deregister(this._sResizeListenerId);
					this._sResizeListenerId = null;
				}
			},

			_onScroll: function(oEvent) {
				var $Container = this._$Container,
					fScrollTop = $Container.scrollTop(),
					fVerticalMove = fScrollTop - this._scrollY;

				// Prevent false tap event during momentum scroll in IOS
				if (this._oIOSScroll && this._oIOSScroll.bMomentum) {
					var dY = Math.abs(fVerticalMove);
					// check if we are still in momentum scrolling
					if (dY > 0 && dY < 10 || oEvent.timeStamp - this._oIOSScroll.iTimeStamp > 120) {
						jQuery.sap.log.debug("IOS Momentum Scrolling is OFF");
						this._oIOSScroll.bMomentum = false;
					}
				}

				this._scrollX = $Container.scrollLeft(); // remember position
				this._scrollY = fScrollTop;

				// Growing List/Table
				if (this._fnScrollLoadCallback && fVerticalMove > 0 && $Container[0].scrollHeight - fScrollTop - $Container.height() < 100 ) {
					this._fnScrollLoadCallback(); // close to the bottom
				}

				// IconTabHeader
				if (this._oIconTabBar && this._fnScrollEndCallback) {
					this._fnScrollEndCallback();
				}
			},

			_onStart : function(oEvent){
				var container = this._$Container[0];
				if (!container) {
					return;
				}

				this._iLastTouchMoveTime = 0;

				// Drag instead of native scroll
				// 1. when requested explicitly
				// 2. bypass Windows Phone 8.1 scrolling issues when soft keyboard is opened
				this._bDoDrag = this._bDragScroll || Device.os.windows_phone && /(INPUT|TEXTAREA)/i.test(document.activeElement.tagName);

				// find if container is scrollable vertically or horizontally
				if (!this._scrollable) {
					this._scrollable = {};
				}
				this._scrollable.vertical = this._bVertical && container.scrollHeight > container.clientHeight;
				this._scrollable.horizontal = this._bHorizontal && container.scrollWidth > container.clientWidth;

				// Prevent false tap event during momentum scroll in IOS
				if (this._oIOSScroll && this._oIOSScroll.bMomentum) {
					jQuery.sap.log.debug("IOS Momentum Scrolling: prevent tap event");
					oEvent.stopPropagation();
					this._oIOSScroll.bMomentum = false;
				}

				// Store initial coordinates for drag scrolling
				var point = oEvent.touches ? oEvent.touches[0] : oEvent;
				this._iX = point.pageX;
				this._iY = point.pageY;
				if (this._oIOSScroll) { // preventing rubber page
					if (!this._scrollable.vertical) {
						this._oIOSScroll.iTopDown = 0;
					} else if (container.scrollTop === 0) {
						this._oIOSScroll.iTopDown = 1;
					} else if (container.scrollTop === container.scrollHeight - container.clientHeight) {
						this._oIOSScroll.iTopDown = -1;
					} else {
						this._oIOSScroll.iTopDown = 0;
					}
				}
				this._bPullDown = false;
				this._iDirection = ""; // h - horizontal, v - vertical
			},

			_onTouchMove : function(oEvent){
				var container = this._$Container[0];
				var point = oEvent.touches[0];
				var dx = point.pageX - this._iX;
				var dy = point.pageY - this._iY;

				if (this._iDirection == "") { // do once at start

					if (dx != 0 || dy != 0) {
						this._iDirection = Math.abs(dy) > Math.abs(dx) ? "v" : "h";
					}

					// PullToRefresh: replace native scrolling with drag, but only in this case
					if (this._oPullDown && this._oPullDown._bTouchMode && this._iDirection == "v" && container.scrollTop <= 1) {
						// pull only of near to top
						if (dy > Math.abs(dx)) {
							// user drags vertically down, disable native scrolling
							this._bPullDown = true;
						}
					}
				}

				if (this._oIOSScroll && this._oIOSScroll.iTopDown && dy != 0) {
					if (dy * this._oIOSScroll.iTopDown > 0) {
						this._bDoDrag = true;
					}
				}

				if (this._bPullDown === true) {
					var pd = this._oPullDown.getDomRef();
					var top = oEvent.touches[0].pageY - this._iY - pd.offsetHeight;
					if ( top > 20) {
						top = 20;
					}
					pd.style.marginTop = top  + "px";
					// rotate pointer
					this._oPullDown.doPull(top);
					// prevent scrolling
					oEvent.preventDefault();
					this._bDoDrag = false; // avoid interference with drag scrolling
				}

				// Special case for dragging instead of scrolling:
				if (this._bDoDrag) {
					var scrollLeft = container.scrollLeft,
					scrollTop = container.scrollTop;
					if (this._bHorizontal) {
						if (this._bFlipX) {
							container.scrollLeft = scrollLeft - this._iX + point.pageX;
						} else {
							container.scrollLeft = scrollLeft + this._iX - point.pageX;
						}
					}
					if (this._bVertical) {
						container.scrollTop = scrollTop + this._iY - point.pageY;
					}
					if ((container.scrollLeft != scrollLeft) || (container.scrollTop != scrollTop)) { // if moved
						oEvent.setMarked();
						oEvent.preventDefault();
					}
					this._iX = point.pageX;
					this._iY = point.pageY;
					return;
				}

				if (sap.ui.Device.os.blackberry) {
					if (this._iLastTouchMoveTime && oEvent.timeStamp - this._iLastTouchMoveTime < 100) {
						oEvent.stopPropagation();
					} else {
						this._iLastTouchMoveTime = oEvent.timeStamp;
					}
				}

				// Prevent false tap event during momentum scroll in IOS
				if (this._oIOSScroll && !this._bDoDrag && this._iDirection == "v" && Math.abs(oEvent.touches[0].pageY - this._iY) >= 10) {
					this._oIOSScroll.bMomentum = true;
					this._oIOSScroll.iTimeStamp = oEvent.timeStamp;
				}

				if (!this._oIOSScroll || this._scrollable.vertical || this._scrollable.horizontal && this._iDirection == "h") {
					oEvent.setMarked(); // see jQuery.sap.mobile.js
				}

				if (window.iScroll) { // if both iScroll and native scrolling are used (IconTabBar)
					oEvent.setMarked("scroll");
				}
			},

			_onEnd : function(oEvent){
				if (this._oIOSScroll && this._oIOSScroll.bMomentum) {
					this._oIOSScroll.iTimeStamp = oEvent.timeStamp;
				}

				if (this._oPullDown && this._oPullDown._bTouchMode) {
					this._oPullDown.doScrollEnd();
					this._refresh();
				}

				if (this._bDragScroll && this._iDirection) {
					oEvent.setMarked();
				}
			},

			// Mouse drag scrolling, optional.
			// Set options.nonTouchScrolling = true to enable
			_onMouseDown : function(oEvent){
				// start scrolling only when the left button is pressed
				if (oEvent.button == 0) {
					this._bScrolling = true;
					this._onStart(oEvent);
				}
			},

			_onMouseMove : function(oEvent){
				// check if scrolling and the (left) button is pressed
				if (this._bScrolling) {
					var e = oEvent.originalEvent;
					var button = e.buttons || e.which;
					if (button == 1) {
						var container = this._$Container[0];
						if (this._bHorizontal) {
							if ( this._bFlipX ) {
								container.scrollLeft = container.scrollLeft - this._iX + oEvent.pageX;
							} else {
								container.scrollLeft = container.scrollLeft + this._iX - oEvent.pageX;
							}
						}
						if (this._bVertical) {
							container.scrollTop = container.scrollTop + this._iY - oEvent.pageY;
						}
						this._iX = oEvent.pageX;
						this._iY = oEvent.pageY;
					}
				}
			},

			_onMouseUp : function(oEvent){
				this._bScrolling = false;
				this._onEnd();
			},

			onBeforeRendering: function() {
				if (this._sResizeListenerId) {
					sap.ui.core.ResizeHandler.deregister(this._sResizeListenerId);
					this._sResizeListenerId = null;
				}

				var $Container = this._$Container;
				if ($Container) {
					if ($Container.height() > 0) {
						this._scrollX = $Container.scrollLeft(); // remember position
						this._scrollY = $Container.scrollTop();
					}
					$Container.off(); // delete all event handlers
				}
			},

			onAfterRendering: function() {
				var $Container = this._$Container = this._sContainerId ? $.sap.byId(this._sContainerId) : $.sap.byId(this._sContentId).parent();
				var _fnRefresh = jQuery.proxy(this._refresh, this);

				this._setOverflow();

				// apply the previous scroll state
				this._scrollTo(this._scrollX, this._scrollY);

				this._refresh();

				if (!$Container.is(":visible")
					|| !!Device.browser.internet_explorer
					|| this._oPullDown
					|| this._fnScrollLoadCallback) {
					// element may be hidden and have height 0
					this._sResizeListenerId = sap.ui.core.ResizeHandler.register($Container[0], _fnRefresh);
				}

				// Set event listeners
				$Container.scroll(jQuery.proxy(this._onScroll, this));
				if (Device.support.touch) {
					$Container
						.on("touchcancel touchend", jQuery.proxy(this._onEnd, this))
						.on("touchstart", jQuery.proxy(this._onStart, this))
						.on("touchmove", jQuery.proxy(this._onTouchMove, this));
				} else if (this._bDragScroll) {
					$Container
						.on("mouseup mouseleave", jQuery.proxy(this._onMouseUp, this))
						.mousedown(jQuery.proxy(this._onMouseDown, this))
						.mousemove(jQuery.proxy(this._onMouseMove, this));
				}
			},

			_readActualScrollPosition: function() {
				// if container has a size, this method reads the current scroll position and stores it as desired position
				if (this._$Container.width() > 0) {
					this._scrollX = this._$Container.scrollLeft();
				}
				if (this._$Container.height() > 0) {
					this._scrollY = this._$Container.scrollTop();
				}
			},

			_scrollTo: function(x, y, time) {
				if (this._$Container.length > 0) {
					if (time > 0) {
						this._$Container.animate({ scrollTop: y, scrollLeft: x }, time, jQuery.proxy(this._readActualScrollPosition, this));
					} else {
						this._$Container.scrollTop(y);
						this._$Container.scrollLeft(x);
						this._readActualScrollPosition(); // if container is too large no scrolling is possible
					}
				}
			}
		};

		/*
		 * Init delegator prototype according to various conditions.
		 */
		function initDelegateMembers(oScrollerInstance, oConfig) {
			var oDelegateMembers;

			if (Device.support.touch || $.sap.simulateMobileOnDesktop) {
				$.sap.require("jquery.sap.mobile");
			}

			oDelegateMembers = {
				_init : function(oControl, sScrollContentDom, oConfig) {

					function createZyngaScroller(contentId, horizontal, vertical){
						var oScroller = new window.Scroller(function(left, top, zoom){
								var $Container = $.sap.byId(contentId).parent();
								$Container.scrollLeft(left);
								$Container.scrollTop(top);
							}, {
								scrollingX: horizontal,
								scrollingY: vertical,
								bouncing: false
						});
						return oScroller;
					}

					// When to use what library?
					function getLibrary() {
						if (oConfig.zynga) {
							return "z";
						}

						if (oConfig.iscroll) {
							return "i";
						}

						return "n";
					}
					var sLib = getLibrary();

					// Initialization
					this._preventTouchMoveDefault = !!oConfig.preventDefault;
					this._scroller = null;
					switch (sLib) {
						case "z": // Zynga library
							$.sap.require("sap.ui.thirdparty.zyngascroll");
							$.extend(this, oZyngaDelegate);
							this._zynga = true;
							this._scroller = createZyngaScroller(this._sContentId, this._bHorizontal, this._bVertical);
							break;
						case "i": // iScroll library
							$.sap.require("sap.ui.thirdparty.iscroll");
							$.extend(this, oIScrollDelegate);
							this._bIScroll = true;
							break;
						default: // native scrolling;
							// default scroll supression threshold of jQuery mobile is too small and prevent native scrolling
							if ($.mobile && $.event.special.swipe && $.event.special.swipe.scrollSupressionThreshold < 120) {
								$.event.special.swipe.scrollSupressionThreshold = 120;
							}
							$.extend(this, oNativeScrollDelegate);
							if (oConfig.nonTouchScrolling === true) {
								this._bDragScroll = true; // optional drag instead of native scrolling
							}
							if (sap.ui.getCore().getConfiguration().getRTL()) {
								this._scrollX = 9999; // in RTL case initially scroll to the very right
								if (Device.browser.internet_explorer || Device.browser.edge) {
									this._bFlipX = true; // in IE and Edge RTL, scrollLeft goes opposite direction
								}
							}
							if (Device.os.ios) {
								this._oIOSScroll = {
									iTimeStamp : 0,
									bMomentum : false
								};
							}
							break;
					}
				},
				_exit : function() {
					if (this._cleanup) {
						this._cleanup();
					}
					this._scroller = null;
				}
			};
			// Copy over members to prototype
			$.extend(oScrollerInstance, oDelegateMembers);
		}

	return ScrollEnablement;

});
