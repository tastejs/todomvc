/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.m.Popover.
sap.ui.define(['jquery.sap.global', './Bar', './Button', './InstanceManager', './library', 'sap/ui/core/Control', 'sap/ui/core/Popup', 'sap/ui/core/delegate/ScrollEnablement', 'sap/ui/core/theming/Parameters'],
	function (jQuery, Bar, Button, InstanceManager, library, Control, Popup, ScrollEnablement, Parameters) {
		"use strict";


		/**
		 * Constructor for a new Popover.
		 *
		 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
		 * @param {object} [mSettings] Initial settings for the new control
		 *
		 * @class
		 * Popover is used to present information temporarily but in a way that does not take over the entire screen. The popover content is layered on top of your existing content and it remains visible until the user taps outside of the popover (when modal is set to false) or you explicitly dismiss it (when modal is set to true). The switching between modal and non-modal can also be done when the popover is already opened.
		 * @extends sap.ui.core.Control
		 * @implements sap.ui.core.PopupInterface
		 *
		 * @author SAP SE
		 * @version 1.32.9
		 *
		 * @constructor
		 * @public
		 * @alias sap.m.Popover
		 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
		 */
		var Popover = Control.extend("sap.m.Popover", /** @lends sap.m.Popover.prototype */ {
			metadata: {

				interfaces: [
					"sap.ui.core.PopupInterface"
				],
				library: "sap.m",
				properties: {

					/**
					 * This is the information about on which side will the popover be placed at. Possible values are sap.m.PlacementType.Left, sap.m.PlacementType.Right, sap.m.PlacementType.Top, sap.m.PlacementType.Bottom, sap.m.PlacementType.Horizontal, sap.m.PlacementType.HorizontalPreferedLeft, sap.m.PlacementType.HorizontalPreferedRight, sap.m.PlacementType.Vertical, sap.m.PlacementType.VerticalPreferedTop, sap.m.PlacementType.VerticalPreferedBottom, sap.m.PlacementType.Auto. The default value is sap.m.PlacementType.Right. Setting this property while popover is open won't cause any rerendering of the popover, but it will take effect when it's opened again.
					 */
					placement: {
						type: "sap.m.PlacementType",
						group: "Behavior",
						defaultValue: sap.m.PlacementType.Right
					},

					/**
					 * If a header should be shown at the top of the popover.
					 */
					showHeader: {type: "boolean", group: "Appearance", defaultValue: true},

					/**
					 * Title text appears in the header. This property will be ignored when showHeader is set to false.
					 */
					title: {type: "string", group: "Appearance", defaultValue: null},

					/**
					 * If the popover will not be closed when tapping outside the popover. It also blocks any interaction with the background. The default value is false.
					 */
					modal: {type: "boolean", group: "Behavior", defaultValue: false},

					/**
					 * The offset for the popover placement in the x axis. It's with unit pixel.
					 */
					offsetX: {type: "int", group: "Appearance", defaultValue: 0},

					/**
					 * The offset for the popover placement in the y axis. It's with unit pixel.
					 */
					offsetY: {type: "int", group: "Appearance", defaultValue: 0},

					/**
					 * Whether Popover arrow should be visible
					 * @since 1.31
					 */
					showArrow: {type: "boolean", group: "Appearance", defaultValue: true},

					/**
					 * Set the width of the content area inside Popover. When controls which adapt their size to the parent control are added directly into Popover, for example sap.m.Page control, a size needs to be specified to the content area of the Popover. Otherwise, Popover control isn't able to display the content in the right way. This values isn't necessary for controls added to Popover directly which can decide their size by themselves, for exmaple sap.m.List, sap.m.Image etc., only needed for controls that adapt their size to the parent control.
					 * @since 1.9.0
					 */
					contentWidth: {type: "sap.ui.core.CSSSize", group: "Dimension", defaultValue: null},

					/**
					 * Set the height of the content area inside Popover. When controls which adapt their size to the parent control are added directly into Popover, for example sap.m.Page control, a size needs to be specified to the content area of the Popover. Otherwise, Popover control isn't able to display the content in the right way. This values isn't necessary for controls added to Popover directly which can decide their size by themselves, for exmaple sap.m.List, sap.m.Image etc., only needed for controls that adapt their size to the parent control.
					 * @since 1.9.0
					 */
					contentHeight: {type: "sap.ui.core.CSSSize", group: "Dimension", defaultValue: null},

					/**
					 * This property is deprecated. Please use properties verticalScrolling and horizontalScrolling instead. If you still use this property it will be mapped on the new properties verticalScrolling and horizontalScrolling.
					 * @deprecated Since version 1.15.0.
					 * This property is deprecated. Please use properties verticalScrolling and horizontalScrolling instead. If you still use this property it will be mapped on the new properties verticalScrolling and horizontalScrolling.
					 */
					enableScrolling: {type: "boolean", group: "Misc", defaultValue: true, deprecated: true},

					/**
					 * This property indicates if user can scroll vertically inside popover when the content is bigger than the content area. However, when scrollable control (sap.m.ScrollContainer, sap.m.Page) is in the popover, this property needs to be set to false to disable the scrolling in popover in order to make the scrolling in the child control work properly.
					 * Popover detects if there's sap.m.NavContainer, sap.m.Page, or sap.m.ScrollContainer as direct child added to Popover. If there is, Popover will turn off scrolling by setting this property to false automatically ignoring the existing value of this property.
					 * @since 1.15.0
					 */
					verticalScrolling: {type: "boolean", group: "Misc", defaultValue: true},

					/**
					 * This property indicates if user can scroll horizontally inside popover when the content is bigger than the content area. However, when scrollable control (sap.m.ScrollContainer, sap.m.Page) is in the popover, this property needs to be set to false to disable the scrolling in popover in order to make the scrolling in the child control work properly.
					 * Popover detects if there's sap.m.NavContainer, sap.m.Page, or sap.m.ScrollContainer as direct child added to Popover. If there is, Popover will turn off scrolling by setting this property to false automatically ignoring the existing value of this property.
					 * @since 1.15.0
					 */
					horizontalScrolling: {type: "boolean", group: "Misc", defaultValue: true},

					/**
					 * Whether bouncing is enabled.
					 * @since 1.16.5
					 */
					bounce: {type: "boolean", group: "Behavior", defaultValue: null}
				},
				defaultAggregation: "content",
				aggregations: {

					/**
					 * The content inside the popover.
					 */
					content: {type: "sap.ui.core.Control", multiple: true, singularName: "content"},

					/**
					 * Any control that needed to be displayed in the header area. When this is set, the showHeader property is ignored, and only this customHeader is shown on the top of popover.
					 */
					customHeader: {type: "sap.ui.core.Control", multiple: false},

					/**
					 * When subHeader is assigned to Popover, it's rendered directly after the main header if there is, or at the beginning of Popover when there's no main header. SubHeader is out of the content area and won't be scrolled when content's size is bigger than the content area's size.
					 * @since 1.15.1
					 */
					subHeader: {type: "sap.ui.core.Control", multiple: false},

					/**
					 * This is optional footer which is shown on the bottom of the popover.
					 */
					footer: {type: "sap.ui.core.Control", multiple: false},

					/**
					 * This is the hidden aggregation for managing the internally created header.
					 */
					_internalHeader: {type: "sap.m.Bar", multiple: false, visibility: "hidden"},

					/**
					 * BeginButton is shown at the left side (right side in RTL mode) inside the header. When showHeader is set to false, the property is ignored.
					 * @since 1.15.1
					 */
					beginButton: {type: "sap.ui.core.Control", multiple: false},

					/**
					 * EndButton is always shown at the right side (left side in RTL mode) inside the header. When showHeader is set to false, the property is ignored.
					 * @since 1.15.1
					 */
					endButton: {type: "sap.ui.core.Control", multiple: false}
				},
				associations: {

					/**
					 * LeftButton is shown at the left edge of the bar in iOS, and at the right side of the bar for the other platforms. Please set this to null if you want to remove the left button from the bar. And the button is only removed from the bar, not destroyed. When showHeader is set to false, this property will be ignored.
					 * @deprecated Since version 1.15.1.
					 *
					 * This property has been deprecated since 1.15.1. Please use the beginButton instead.
					 */
					leftButton: {type: "sap.m.Button", multiple: false, deprecated: true},

					/**
					 * RightButton is always shown at the right edge of the bar. Please set this to null if you want to remove the right button from the bar. And the button is only removed from the bar, not destroyed. When showHeader is set to false, this property will be ignored.
					 * @deprecated Since version 1.15.1.
					 *
					 * This property has been deprecated since 1.15.1. Please use the endButton instead.
					 */
					rightButton: {type: "sap.m.Button", multiple: false, deprecated: true},

					/**
					 * Focus is set to the popover in the sequence of leftButton and rightButton when available. But if some other control neends to get the focus other than one of those two buttons, set the initialFocus with the control which should be focused on.
					 * @since 1.15.0
					 */
					initialFocus: {type: "sap.ui.core.Control", multiple: false},

					/**
					 * Association to controls / ids which describe this control (see WAI-ARIA attribute aria-describedby).
					 */
					ariaDescribedBy: {type: "sap.ui.core.Control", multiple: true, singularName: "ariaDescribedBy"}
				},
				events: {

					/**
					 * This event will be fired after the popover is opened.
					 */
					afterOpen: {
						parameters: {

							/**
							 * This refers to the control which opens the popover.
							 */
							openBy: {type: "sap.ui.core.Control"}
						}
					},

					/**
					 * This event will be fired after the popover is closed.
					 */
					afterClose: {
						parameters: {

							/**
							 * This refers to the control which opens the popover.
							 */
							openBy: {type: "sap.ui.core.Control"}
						}
					},

					/**
					 * This event will be fired before the popover is opened.
					 */
					beforeOpen: {
						parameters: {

							/**
							 * This refers to the control which opens the popover.
							 */
							openBy: {type: "sap.ui.core.Control"}
						}
					},

					/**
					 * This event will be fired before the popover is closed.
					 */
					beforeClose: {
						parameters: {

							/**
							 * This refers to the control which opens the popover.
							 */
							openBy: {type: "sap.ui.core.Control"}
						}
					}
				}
			}
		});


		/* =========================================================== */
		/*                   begin: lifecycle methods                  */
		/* =========================================================== */
		Popover._bIE9 = (sap.ui.Device.browser.internet_explorer && sap.ui.Device.browser.version < 10);
		Popover._bIOS7 = sap.ui.Device.os.ios && sap.ui.Device.os.version >= 7 && sap.ui.Device.os.version < 8 && sap.ui.Device.browser.name === "sf";

		/**
		 * Initializes the popover control.
		 *
		 * @private
		 */
		Popover.prototype.init = function () {
			// The offset of the arrow must be more than _arrowOffsetThreshold from the border of the popover content
			this._arrowOffsetThreshold = 4;

			this._marginTopInit = false;
			// The following 4 values are the margins which are used to avoid making the popover very near to the border of the screen
			this._marginTop = 48; //This is the default value, and dynamic calculation will be done in afterRendering

			this._marginLeft = 10;
			this._marginRight = 10;
			this._marginBottom = 10;

			this._$window = jQuery(window);
			this._initialWindowDimensions = {
				width: this._$window.width(),
				height: this._$window.height()
			};

			this.oPopup = new Popup();
			this.oPopup.setShadow(true);
			this.oPopup.setAutoClose(true);
			this.oPopup.setAnimations(jQuery.proxy(this._openAnimation, this), jQuery.proxy(this._closeAnimation, this));

			// This is data used to position the popover depending on the placement property
			this._placements = [sap.m.PlacementType.Top, sap.m.PlacementType.Right, sap.m.PlacementType.Bottom, sap.m.PlacementType.Left, sap.m.PlacementType.Vertical, sap.m.PlacementType.Horizontal, sap.m.PlacementType.Auto, sap.m.PlacementType.VerticalPreferedTop, sap.m.PlacementType.VerticalPreferedBottom, sap.m.PlacementType.HorizontalPreferedLeft, sap.m.PlacementType.HorizontalPreferedRight];
			this._myPositions = ["center bottom", "begin center", "center top", "end center"];
			this._atPositions = ["center top", "end center", "center bottom", "begin center"];
			this._offsets = ["0 -18", "18 0", "0 18", "-18 0"];

			this._arrowOffset = 18;

			this._followOfTolerance = 32;

			// used to judge if enableScrolling needs to be disabled
			this._scrollContentList = [sap.m.NavContainer, sap.m.Page, sap.m.ScrollContainer];

			// Make this.oPopup call this._adjustPositionAndArrow each time after its position is changed
			this._fnAdjustPositionAndArrow = jQuery.proxy(this._adjustPositionAndArrow, this);

			// The orientationchange event listener
			this._fnOrientationChange = jQuery.proxy(this._onOrientationChange, this);

			// The handler to close popover when the size or position of the open by control changes
			this._fnFollowOf = jQuery.proxy(function (mInfo) {
				var oLastRect = mInfo.lastOfRect,
					oRect = mInfo.currentOfRect;

				// When runs on mobile device, Popover always follows the open by control.
				// When runs on the other platforms, Popover is repositioned if the position change of openBy is smaller than the tolerance, otherwise popover is closed.
				if (!sap.ui.Device.system.desktop
					|| (Math.abs(oLastRect.top - oRect.top) <= this._followOfTolerance && Math.abs(oLastRect.left - oRect.left) <= this._followOfTolerance)
					|| (Math.abs(oLastRect.top + oLastRect.height - oRect.top - oRect.height) <= this._followOfTolerance && Math.abs(oLastRect.left + oLastRect.width - oRect.left - oRect.width) <= this._followOfTolerance)) {
					this.oPopup._applyPosition(this.oPopup._oLastPosition, true);
				} else {
					this.close();
				}
			}, this);

			//CSN 0001875244 2013: on desktop explicitly close popover if position of triggering
			//element is moved. Make use of popup's 'followOf' feature. This ensures that popover is
			//closed when a containing scroll container is scrolled, be it via scrollbar or using the
			//mousewheel.
			this.setFollowOf(true);

			this._oRestoreFocusDelegate = {
				onBeforeRendering: function () {
					var $ActiveElement = jQuery(document.activeElement),
						oActiveControl = $ActiveElement.control(0);
					this._sFocusControlId = oActiveControl && oActiveControl.getId();
				},
				onAfterRendering: function () {
					if (this._sFocusControlId && !jQuery.sap.containsOrEquals(this.getDomRef(), document.activeElement)) {
						sap.ui.getCore().byId(this._sFocusControlId).focus();
					}
				}
			};

			var that = this;
			this.oPopup._applyPosition = function (oPosition, bFromResize) {
				var eOpenState = this.getOpenState(),
					oOf;
				// avoid calling on being closed or closed instances
				if (eOpenState === sap.ui.core.OpenState.CLOSING || eOpenState === sap.ui.core.OpenState.CLOSED) {
					return;
				}

				if (bFromResize) {
					// Save the current scroll position only when this method is called from resize handler
					// otherwise it messes the initial scrolling setting of scrollenablement in RTL mode
					that._storeScrollPosition();
				}
				that._clearCSSStyles();

				//calculate the best placement of the popover if placementType is horizontal,  vertical or auto
				var iPlacePos = jQuery.inArray(that.getPlacement(), that._placements);
				if (iPlacePos > 3 && !that._bPosCalced) {
					that._calcPlacement();
					return;
				}

				that._bPosCalced = false;

				// update the "of" property on oPosition because parent can be already rerendered
				if (that._oOpenBy instanceof sap.ui.core.Element) {
					oPosition.of = that._getOpenByDomRef();
				}

				// if the openBy dom reference is null there's no need to continue the reposition the popover
				if (!oPosition.of) {
					jQuery.sap.log.warning("sap.m.Popover: in function applyPosition, the openBy element doesn't have any DOM output. " + that);
					return;
				}

				// if the openBy dom reference is already detached from the document, try to get the dom reference with the same id from dom tree again
				if (!jQuery.sap.containsOrEquals(document.documentElement, oPosition.of) && oPosition.of.id) {
					oOf = jQuery.sap.byId(oPosition.of.id);
					if (oOf) {
						oPosition.of = oOf;
					} else {
						jQuery.sap.log.warning("sap.m.Popover: in function applyPosition, the openBy element's DOM is already detached from DOM tree and can't be found again by the same id. " + that);
						return;
					}
				}

				var oRect = jQuery(oPosition.of).rect();
				// if openBy Dom element is complete out of viewport after resize event, close the popover. But close it only if virtualkeyboard is not opened.
				if (bFromResize
					&& that._$window.height() == that._initialWindowDimensions.height
					&& (oRect.top + oRect.height <= 0 || oRect.top >= that._$window.height() || oRect.left + oRect.width <= 0 || oRect.left >= that._$window.width())) {
					that.close();
					return;
				}

				// some mobile browser changes the scrollLeft of window after firing resize event
				// which caused the popover to be positioned at the wrong place.
				if (!sap.ui.Device.system.desktop) {
					jQuery(window).scrollLeft(0);
				}

				//deregister the content resize handler before repositioning
				that._deregisterContentResizeHandler();
				Popup.prototype._applyPosition.call(this, oPosition);
				that._fnAdjustPositionAndArrow();
				that._restoreScrollPosition();

				//register the content resize handler
				that._registerContentResizeHandler();
			};

			// when popup's close method is called by autoclose handler, the beforeClose event also needs to be fired.
			// popup's close method has been inherited here in order to fire the beforeClose event for calling close on
			// autoclose.
			this.oPopup.close = function (bBeforeCloseFired) {
				var bBooleanParam = typeof bBeforeCloseFired === "boolean";

				// Only when the given parameter is "true", the beforeClose event isn't fired here.
				// Because it's already fired in the sap.m.Popover.prototype.close function.
				// The event also should not be fired if the focus is still inside the Popup. This could occur when the
				// autoclose mechanism is fired by the child Popup and is called throught the EventBus
				if (bBeforeCloseFired !== true && (this.touchEnabled || !this._isFocusInsidePopup())) {
					that.fireBeforeClose({openBy: that._oOpenBy});
				}

				that._deregisterContentResizeHandler();
				Popup.prototype.close.apply(this, bBooleanParam ? [] : arguments);
				that.removeDelegate(that._oRestoreFocusDelegate);

				if (document.activeElement && !this.restoreFocus && !this._bModal) {
					 document.activeElement.blur();
				}
			};
		};

		/**
		 * Required adaptations before rendering of the Popover.
		 *
		 * @private
		 */
		Popover.prototype.onBeforeRendering = function () {
			var oNavContent, oPageContent;

			// When scrolling isn't set manually and content has scrolling, disable scrolling automatically
			if (!this._bVScrollingEnabled && !this._bHScrollingEnabled && this._hasSingleScrollableContent()) {
				this._forceDisableScrolling = true;
				jQuery.sap.log.info("VerticalScrolling and horizontalScrolling in sap.m.Popover with ID " + this.getId() + " has been disabled because there's scrollable content inside");
			} else {
				this._forceDisableScrolling = false;
			}

			if (!this._forceDisableScrolling) {
				if (!this._oScroller) {
					this._oScroller = new ScrollEnablement(this, this.getId() + "-scroll", {
						horizontal: this.getHorizontalScrolling(),
						vertical: this.getVerticalScrolling(),
						zynga: false,
						preventDefault: false,
						nonTouchScrolling: "scrollbar",
						bounce: this.getBounce() === "" ? undefined : this.getBounce(),
						// In android stock browser, iScroll has to be used
						// The scrolling layer using native scrolling is transparent for the browser to dispatch events
						iscroll: sap.ui.Device.browser.name === "an" ? "force" : undefined
					});
				}
			}

			if (this._bContentChanged) {
				this._bContentChanged = false;
				oNavContent = this._getSingleNavContent();
				oPageContent = this._getSinglePageContent();
				if (oNavContent && !this.getModal() && !sap.ui.Device.support.touch && !jQuery.sap.simulateMobileOnDesktop) {
					//gain the focus back to popover in order to prevent the autoclose of the popover
					oNavContent.attachEvent("afterNavigate", function (oEvent) {
						jQuery.sap.focus(this.getDomRef());
					}, this);
				}
				if (oNavContent || oPageContent) {
					oPageContent = oPageContent || oNavContent.getCurrentPage();
					if (oPageContent && oPageContent._getAnyHeader) {
						this.addStyleClass("sapMPopoverWithHeaderCont");
					}

					if (oNavContent) {
						oNavContent.attachEvent("navigate", function (oEvent) {
							var oPage = oEvent.getParameter("to");
							if (oPage instanceof sap.m.Page) {
								this.$().toggleClass("sapMPopoverWithHeaderCont", !!oPage._getAnyHeader());
							}
						}, this);
					}
				}
			}
		};

		/**
		 * Required adaptations after rendering of the Popover.
		 *
		 * @private
		 */
		Popover.prototype.onAfterRendering = function () {
			var $openedBy, $page, $header;

			//calculate the height of the header in the current page
			//only for the first time calling after rendering
			if (!this._marginTopInit && this.getShowArrow()) {
				this._marginTop = 2;
				if (this._oOpenBy) {
					$openedBy = jQuery(this._getOpenByDomRef());
					//first check if the openedBy isn't inside a header
					if (!($openedBy.closest("header.sapMIBar").length > 0)) {
						$page = $openedBy.closest(".sapMPage");
						if ($page.length > 0) {
							$header = $page.children("header.sapMIBar");
							if ($header.length > 0) {
								this._marginTop += $header.outerHeight();
							}
						}
					}
					this._marginTopInit = true;
				}
			}
		};

		/**
		 * Destroys all related objects to the Popover.
		 *
		 * @private
		 */
		Popover.prototype.exit = function () {
			this._deregisterContentResizeHandler();

			sap.ui.Device.resize.detachHandler(this._fnOrientationChange);

			InstanceManager.removePopoverInstance(this);

			this.removeDelegate(this._oRestoreFocusDelegate);
			this._oRestoreFocusDelegate = null;

			if (this.oPopup) {
				this.oPopup.detachClosed(this._handleClosed, this);
				this.oPopup.destroy();
				this.oPopup = null;
			}

			if (this._oScroller) {
				this._oScroller.destroy();
				this._oScroller = null;
			}

			if (this._internalHeader) {
				this._internalHeader.destroy();
				this._internalHeader = null;
			}

			if (this._headerTitle) {
				this._headerTitle.destroy();
				this._headerTitle = null;
			}
		};
		/* =========================================================== */
		/*                   end: lifecycle methods                    */
		/* =========================================================== */


		/* =========================================================== */
		/*                   begin: API method                         */
		/* =========================================================== */
		/**
		 * Opens the Popover and set the Popover position according to the {@link #getPlacement() placement} property around the <code>oControl</code> parameter.
		 *
		 * @param {object} oControl This is the control to which the Popover will be placed. It can be not only a UI5 control, but also an existing DOM reference. The side of the placement depends on the placement property set in the Popover.
		 * @param {boolean} bSkipInstanceManager
		 * @returns {sap.m.Popover} Reference to the control instance for chaining
		 * @public
		 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
		 */
		Popover.prototype.openBy = function (oControl, bSkipInstanceManager) {
			// If already opened with the needed content then return
			var oPopup = this.oPopup,
				ePopupState = this.oPopup.getOpenState(),
			// The control that needs to be focused after popover is open is calculated in following sequence:
			// initialFocus, beginButton, endButton, and popover itself.
			// focus has to be inside/on popover otherwise autoclose() will not work
				sFocusId = this._getInitialFocusId(),
				oParentDomRef, iPlacePos;

			this._adaptPositionParams();

			if (ePopupState === sap.ui.core.OpenState.OPEN || ePopupState === sap.ui.core.OpenState.OPENING) {
				if (this._oOpenBy === oControl) {
					//if the popover is open, and is opening by the same control again, just return
					return this;
				} else {
					//if the popover is open, and is opening by another control, then first close it and open later.
					var afterClosed = function () {
						oPopup.detachClosed(afterClosed, this);
						this.openBy(oControl);
					};
					oPopup.attachClosed(afterClosed, this);
					this.close();
					return this;
				}
			}

			if (!oControl) {
				return this;
			}

			//bind the resize event to window
			//CSN 2012 4216945
			//binding should be registered here (very early) because when keyboard in android closes at the same time, resize event needs to be reacted in order to
			//reposition the popover after the keyboard fully closes.
			if (sap.ui.Device.support.touch) {
				sap.ui.Device.resize.attachHandler(this._fnOrientationChange);
			}

			if (!this._oOpenBy || oControl !== this._oOpenBy) {
				this._oOpenBy = oControl;
			}

			this.fireBeforeOpen({openBy: this._oOpenBy});

			oPopup.attachOpened(this._handleOpened, this);
			oPopup.attachClosed(this._handleClosed, this);
			oPopup.setInitialFocusId(sFocusId);
			// Open popup
			iPlacePos = jQuery.inArray(this.getPlacement(), this._placements);
			if (iPlacePos > -1) {
				oParentDomRef = this._getOpenByDomRef();
				if (!oParentDomRef) {
					jQuery.sap.log.error("sap.m.Popover id = " + this.getId() + ": is opened by a control which isn't rendered yet.");
					return this;
				}

				// Set compact style class if the referenced DOM element is compact too
				this.toggleStyleClass("sapUiSizeCompact", !!jQuery(oParentDomRef).closest(".sapUiSizeCompact").length);

				oPopup.setAutoCloseAreas([oParentDomRef]);
				oPopup.setContent(this);
				//if position has to be calculated wait until it is calculated with setting the position
				if (iPlacePos <= 3) {
					oPopup.setPosition(this._myPositions[iPlacePos], this._atPositions[iPlacePos], oParentDomRef, this._calcOffset(this._offsets[iPlacePos]), "fit");
				} else {
					oPopup._oPosition.of = oParentDomRef;
				}

				var that = this;
				var fCheckAndOpen = function () {
					if (oPopup.getOpenState() === sap.ui.core.OpenState.CLOSING) {
						if (that._sOpenTimeout) {
							clearTimeout(that._sOpenTimeout);
							that._sOpenTimeout = null;
						}
						that._sOpenTimeout = setTimeout(fCheckAndOpen, 150);
					} else {
						// Save current focused element to restore the focus after closing the dialog
						that._oPreviousFocus = Popup.getCurrentFocusInfo();
						oPopup.open();
						// delegate must be added after calling open on popup because popup should position the content first and then focus can be reset
						that.addDelegate(that._oRestoreFocusDelegate, that);
						//if popover shouldn't be managed by Instance Manager
						//e.g. SplitContainer in PopoverMode, the popover which contains the master area should be managed by the SplitContainer control
						if (!bSkipInstanceManager) {
							InstanceManager.addPopoverInstance(that);
						}
					}
				};
				fCheckAndOpen();
			} else {
				jQuery.sap.log.error(this.getPlacement() + "is not a valid value! It can only be top, right, bottom or left");
			}
			return this;
		};

		/**
		 * Closes the popover when it's already opened.
		 *
		 * @return {sap.m.Popover} Reference to the control instance for chaining
		 * @public
		 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
		 */
		Popover.prototype.close = function () {
			var eOpenState = this.oPopup.getOpenState(),
				bSameFocusElement;

			if (eOpenState === sap.ui.core.OpenState.CLOSED || eOpenState === sap.ui.core.OpenState.CLOSING) {
				return this;
			}

			this.fireBeforeClose({openBy: this._oOpenBy});

			// beforeCloseEvent is already fired here, the parameter true needs to be passed into the popup's close method.
			this.oPopup.close(true);

			if (this._oPreviousFocus) {
				// if the current focused control/element is the same as the focused control/element before popover is open, no need to restore focus.
				bSameFocusElement = (this._oPreviousFocus.sFocusId === sap.ui.getCore().getCurrentFocusedControlId()) ||
					(this._oPreviousFocus.sFocusId === document.activeElement.id);

				// restore previous focus, if the current control isn't the same control as
				if (!bSameFocusElement && this.oPopup.restoreFocus) {
					Popup.applyFocusInfo(this._oPreviousFocus);
					this._oPreviousFocus = null;
				}
			}

			return this;
		};


		/**
		 * The method checks if the Popover is open. It returns true when the Popover is currently open (this includes opening and closing animations), otherwise it returns false.
		 *
		 * @return {boolean} whether the Popover is currently opened
		 * @public
		 * @since 1.9.1
		 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
		 */
		Popover.prototype.isOpen = function () {
			return this.oPopup && this.oPopup.isOpen();
		};

		/**
		 * The followOf feature closes the Popover when the position of the control that opened the Popover changes by at least  32 pixels (on desktop browsers). This may lead to unwanted closing of the Popover.
		 *
		 * This function is for enabling/disabling the followOf feature.
		 *
		 * @param {boolean} bValue Enables the followOf feature
		 * @return {sap.m.Popover} Reference to the control instance for chaining
		 * @protected
		 * @since 1.16.8
		 */
		Popover.prototype.setFollowOf = function (bValue) {
			if (bValue) {
				this.oPopup.setFollowOf(this._fnFollowOf);
			} else {
				this.oPopup.setFollowOf(false);
			}
			return this;
		};

		/**
		 * Setter for property <code>bounce</code>.
		 *
		 * Default value is empty
		 *
		 * @param {boolean} bBounce New value for property <code>bounce</code>
		 * @return {sap.m.Popover} Reference to the control instance for chaining
		 * @protected
		 * @name sap.m.Popover#setBounce
		 * @function
		 */

		/* =========================================================== */
		/*                     end: API method                         */
		/* =========================================================== */


		/* =========================================================== */
		/*                      begin: event handlers                  */
		/* =========================================================== */
		Popover.prototype._clearCSSStyles = function () {
			var oStyle = this.getDomRef().style,
				$content = this.$("cont"),
				$scrollArea = $content.children(".sapMPopoverScroll"),
				oContentStyle = $content[0].style,
				oScrollAreaStyle = $scrollArea[0].style,
				sContentWidth = this.getContentWidth(),
				sContentHeight = this.getContentHeight(),
				$arrow = this.$("arrow"),
				iWindowWidth,
				iWindowHeight;

			if (sContentWidth.indexOf("%") > 0) {
				iWindowWidth = this._$window.width();
				sContentWidth = sap.m.PopupHelper.calcPercentageSize(sContentWidth, iWindowWidth);
			}

			if (sContentHeight.indexOf("%") > 0) {
				iWindowHeight = this._$window.height();
				sContentHeight = sap.m.PopupHelper.calcPercentageSize(sContentHeight, iWindowHeight);
			}

			oContentStyle.width = sContentWidth || "";
			oContentStyle.height = sContentHeight || "";
			oContentStyle.maxWidth = "";
			oContentStyle.maxHeight = "";

			oStyle.left = "";
			oStyle.right = "";
			oStyle.top = "";
			oStyle.bottom = "";
			oStyle.width = "";
			oStyle.height = "";

			oScrollAreaStyle.width = "";
			oScrollAreaStyle.display = "";

			// clear arrow styles
			$arrow.removeClass("sapMPopoverArrRight sapMPopoverArrLeft sapMPopoverArrDown sapMPopoverArrUp sapMPopoverCrossArr sapMPopoverFooterAlignArr sapMPopoverHeaderAlignArr");
			$arrow.css({
				left: "",
				top: ""
			});
		};

		Popover.prototype._onOrientationChange = function () {
			var ePopupState = this.oPopup.getOpenState();
			if (!(ePopupState === sap.ui.core.OpenState.OPEN || ePopupState === sap.ui.core.OpenState.OPENING)) {
				return;
			}

			this.oPopup._applyPosition(this.oPopup._oLastPosition, true);
		};

		/**
		 * Register the listener to close the Popover when user taps outside both of the Popover and the control that opens the Popover.
		 *
		 * @private
		 */
		Popover.prototype._handleOpened = function () {
			var that = this;
			this.oPopup.detachOpened(this._handleOpened, this);

			//	recalculate the arrow position when the size of the popover changes.
			if (!sap.ui.Device.support.touch) {
				setTimeout(function () {
					sap.ui.Device.resize.attachHandler(that._fnOrientationChange);
				}, 0);
			}

			// Set focus to the first visible focusable element
			var sFocusId = this._getInitialFocusId(),
				oControl = sap.ui.getCore().byId(sFocusId);
			jQuery.sap.focus(oControl ? oControl.getFocusDomRef() : jQuery.sap.domById(sFocusId));

			this.fireAfterOpen({openBy: this._oOpenBy});
		};

		Popover.prototype._handleClosed = function () {
			this.oPopup.detachClosed(this._handleClosed, this);

			sap.ui.Device.resize.detachHandler(this._fnOrientationChange);

			InstanceManager.removePopoverInstance(this);
			this.fireAfterClose({openBy: this._oOpenBy});
		};

		/**
		 * Event handler for the focusin event.
		 * If it occurs on the focus handler elements at the beginning of the dialog, the focus is set to the end, and vice versa.
		 *
		 * @param {jQuery.EventObject} oEvent The event object
		 * @private
		 */
		Popover.prototype.onfocusin = function (oEvent) {
			var oSourceDomRef = oEvent.target,
				$this = this.$();

			//If the invisible FIRST focusable element (suffix '-firstfe') has got focus, move focus to the last focusable element inside
			if (oSourceDomRef.id === this.getId() + "-firstfe") {
				// Search for anything focusable from bottom to top
				var oLastFocusableDomref = $this.lastFocusableDomRef();
				jQuery.sap.focus(oLastFocusableDomref);
			} else if (oSourceDomRef.id === this.getId() + "-lastfe") {
				// Search for anything focusable from top to bottom
				var oFirstFocusableDomref = $this.firstFocusableDomRef();
				jQuery.sap.focus(oFirstFocusableDomref);
			}
		};

		/**
		 * Event handler for the keydown event.
		 *
		 * @param {jQuery.EventObject} oEvent The event object
		 * @private
		 */
		Popover.prototype.onkeydown = function (oEvent) {
			var oKC = jQuery.sap.KeyCodes,
				iKC = oEvent.which || oEvent.keyCode,
				bAlt = oEvent.altKey;

			// Popover should be closed when ESCAPE key or ATL+F4 is pressed
			if (iKC === oKC.ESCAPE || (bAlt && iKC === oKC.F4)) {
				// if inner control has already handled the event, dialog doesn't process the event anymore
				if (oEvent.originalEvent && oEvent.originalEvent._sapui_handledByControl) {
					return;
				}
				this.close();

				//event should not trigger any further actions
				oEvent.stopPropagation();
				oEvent.preventDefault();
			}
		};

		/* =========================================================== */
		/*                      end: event handlers                  */
		/* =========================================================== */


		/* =========================================================== */
		/*                      begin: internal methods                  */
		/* =========================================================== */
		/**
		 * This method detects if there's a sap.m.NavContainer instance added as a single child into Popover's content aggregation or through one or more sap.ui.mvc.View controls.
		 * If there is, sapMPopoverNav style class will be added to the root node of the control in order to apply some special css styles to the inner dom nodes.
		 * @returns {boolean}
		 */
		Popover.prototype._hasSingleNavContent = function () {
			return !!this._getSingleNavContent();
		};

		Popover.prototype._getSingleNavContent = function () {
			var aContent = this._getAllContent();

			while (aContent.length === 1 && aContent[0] instanceof sap.ui.core.mvc.View) {
				aContent = aContent[0].getContent();
			}

			if (aContent.length === 1 && aContent[0] instanceof sap.m.NavContainer) {
				return aContent[0];
			} else {
				return null;
			}
		};

		Popover.prototype._getSinglePageContent = function () {
			var aContent = this._getAllContent();

			while (aContent.length === 1 && aContent[0] instanceof sap.ui.core.mvc.View) {
				aContent = aContent[0].getContent();
			}

			if (aContent.length === 1 && aContent[0] instanceof sap.m.Page) {
				return aContent[0];
			} else {
				return null;
			}
		};

		/**
		 * This method detects if there's a sap.m.Page instance added as a single child into popover's content aggregation or through one or more sap.ui.mvc.View controls.
		 * If there is, sapMPopoverPage style class will be added to the root node of the control in order to apply some special css styles to the inner dom nodes.
		 *
		 * @returns {boolean}
		 */
		Popover.prototype._hasSinglePageContent = function () {
			var aContent = this._getAllContent();

			while (aContent.length === 1 && aContent[0] instanceof sap.ui.core.mvc.View) {
				aContent = aContent[0].getContent();
			}

			if (aContent.length === 1 && aContent[0] instanceof sap.m.Page) {
				return true;
			} else {
				return false;
			}
		};

		/**
		 * If a scrollable control (sap.m.NavContainer, sap.m.ScrollContainer, sap.m.Page) is added to popover's content aggregation as a single child or through one or more sap.ui.mvc.View instances,
		 * the scrolling inside popover will be disabled in order to avoid wrapped scrolling areas.
		 *
		 * If more than one scrollable control is added to popover, the scrolling needs to be disabled manually.
		 *
		 * @returns {boolean}
		 */
		Popover.prototype._hasSingleScrollableContent = function () {
			var aContent = this._getAllContent(), i;

			while (aContent.length === 1 && aContent[0] instanceof sap.ui.core.mvc.View) {
				aContent = aContent[0].getContent();
			}

			if (aContent.length === 1) {
				for (i = 0; i < this._scrollContentList.length; i++) {
					if (aContent[0] instanceof this._scrollContentList[i]) {
						return true;
					}
				}
				return false;
			} else {
				return false;
			}
		};

		/**
		 * Returns the offsetX value by negating the value when in RTL mode.
		 *
		 * @returns {number} OffsetX
		 * @private
		 */
		Popover.prototype._getOffsetX = function () {
			var bRtl = sap.ui.getCore().getConfiguration().getRTL();
			return this.getOffsetX() * (bRtl ? -1 : 1);
		};

		/**
		 * This is only a wrapper of getOffsetY for possible future usage.
		 *
		 * @returns {number} OffsetY
		 * @private
		 */
		Popover.prototype._getOffsetY = function () {
			return this.getOffsetY();
		};

		Popover.prototype._calcOffset = function (sOffset) {
			var iOffsetX = this._getOffsetX(),
				iOffsetY = this._getOffsetY();

			var aParts = sOffset.split(" ");
			return (parseInt(aParts[0], 10) + iOffsetX) + " " + (parseInt(aParts[1], 10) + iOffsetY);
		};

		Popover.prototype._calcPlacement = function () {
			var oPlacement = this.getPlacement();
			var oParentDomRef = this._getOpenByDomRef();

			//calculate the position of the popover
			switch (oPlacement) {
				case sap.m.PlacementType.Auto:
					this._calcAuto();
					break;
				case sap.m.PlacementType.Vertical:
				case sap.m.PlacementType.VerticalPreferedTop:
				case sap.m.PlacementType.VerticalPreferedBottom:
					this._calcVertical();
					break;
				case sap.m.PlacementType.Horizontal:
				case sap.m.PlacementType.HorizontalPreferedLeft:
				case sap.m.PlacementType.HorizontalPreferedRight:
					this._calcHorizontal();
					break;
			}
			//set flag to avoid calling _applyPosition
			this._bPosCalced = true;

			//set position of popover to calculated position
			var iPlacePos = jQuery.inArray(this._oCalcedPos, this._placements);
			this.oPopup.setPosition(this._myPositions[iPlacePos], this._atPositions[iPlacePos], oParentDomRef, this._calcOffset(this._offsets[iPlacePos]), "fit");
		};

		Popover.prototype._calcVertical = function () {
			var $parent = jQuery(this._getOpenByDomRef());
			var bHasParent = $parent[0] !== undefined;
			var iParentTop = bHasParent ? $parent[0].getBoundingClientRect().top : 0;
			var iParentHeight = bHasParent ? $parent[0].getBoundingClientRect().height : 0;
			var iOffsetY = this._getOffsetY();
			var iTopSpace = iParentTop - this._marginTop + iOffsetY;
			var iParentBottom = iParentTop + iParentHeight;
			var iBottomSpace = this._$window.height() - iParentBottom - this._marginBottom - iOffsetY;
			var iPopoverHeight = this.$().outerHeight();

			if (this.getPlacement() === sap.m.PlacementType.VerticalPreferedTop && iTopSpace > iPopoverHeight + this._arrowOffset) {
				this._oCalcedPos = sap.m.PlacementType.Top;
			} else if (this.getPlacement() === sap.m.PlacementType.VerticalPreferedBottom && iBottomSpace > iPopoverHeight + this._arrowOffset) {
				this._oCalcedPos = sap.m.PlacementType.Bottom;
			} else if (iTopSpace > iBottomSpace) {
				this._oCalcedPos = sap.m.PlacementType.Top;
			} else {
				this._oCalcedPos = sap.m.PlacementType.Bottom;
			}
		};

		Popover.prototype._calcHorizontal = function () {
			var $parent = jQuery(this._getOpenByDomRef());
			var bHasParent = $parent[0] !== undefined;
			var iParentLeft = bHasParent ? $parent[0].getBoundingClientRect().left : 0;
			var iParentWidth = bHasParent ? $parent[0].getBoundingClientRect().width : 0;
			var iOffsetX = this._getOffsetX();
			var iLeftSpace = iParentLeft - this._marginLeft + iOffsetX;
			var iParentRight = iParentLeft + iParentWidth;
			var iRightSpace = this._$window.width() - iParentRight - this._marginRight - iOffsetX;
			var iPopoverWidth = this.$().outerWidth();

			var bRtl = sap.ui.getCore().getConfiguration().getRTL();

			if (this.getPlacement() === sap.m.PlacementType.HorizontalPreferedLeft && iLeftSpace > iPopoverWidth + this._arrowOffset) {
				this._oCalcedPos = bRtl ? sap.m.PlacementType.Right : sap.m.PlacementType.Left;
			} else if (this.getPlacement() === sap.m.PlacementType.HorizontalPreferedRight && iRightSpace > iPopoverWidth + this._arrowOffset) {
				this._oCalcedPos = bRtl ? sap.m.PlacementType.Left : sap.m.PlacementType.Right;
			} else if (iLeftSpace > iRightSpace) {
				this._oCalcedPos = bRtl ? sap.m.PlacementType.Right : sap.m.PlacementType.Left;
			} else {
				this._oCalcedPos = bRtl ? sap.m.PlacementType.Left : sap.m.PlacementType.Right;
			}
		};

		Popover.prototype._calcAuto = function () {
			//calculate which position is the best
			if (this._$window.width() > this._$window.height()) {
				//in "landscape" mode horizontal is preferred, therefore it is checked first
				if (this._checkHorizontal()) {
					this._calcHorizontal();
				} else if (this._checkVertical()) {
					this._calcVertical();
				} else {
					this._calcBestPos();
				}
			} else {
				if (this._checkVertical()) {
					this._calcVertical();
				} else if (this._checkHorizontal()) {
					this._calcHorizontal();
				} else {
					this._calcBestPos();
				}
			}

		};

		Popover.prototype._checkHorizontal = function () {
			//check if there is enough space
			var $parent = jQuery(this._getOpenByDomRef());
			var bHasParent = $parent[0] !== undefined;
			var iParentLeft = bHasParent ? $parent[0].getBoundingClientRect().left : 0;
			var iParentWidth = bHasParent ? $parent[0].getBoundingClientRect().width : 0;
			var iOffsetX = this._getOffsetX();
			var iLeftSpace = iParentLeft - this._marginLeft + iOffsetX;
			var iParentRight = iParentLeft + iParentWidth;
			var iRightSpace = this._$window.width() - iParentRight - this._marginRight - iOffsetX;

			var $this = this.$();
			var iWidth = $this.outerWidth() + this._arrowOffset;

			if ((iWidth <= iLeftSpace) || (iWidth <= iRightSpace)) {
				return true;
			}
		};

		Popover.prototype._checkVertical = function () {
			//check if there is enough space
			var $parent = jQuery(this._getOpenByDomRef());
			var bHasParent = $parent[0] !== undefined;
			var iParentTop = bHasParent ? $parent[0].getBoundingClientRect().top : 0;
			var iParentHeight = bHasParent ? $parent[0].getBoundingClientRect().height : 0;
			var iOffsetY = this._getOffsetY();
			var iTopSpace = iParentTop - this._marginTop + iOffsetY;
			var iParentBottom = iParentTop + iParentHeight;
			var iBottomSpace = this._$window.height() - iParentBottom - this._marginBottom - iOffsetY;

			var $this = this.$();
			var iHeight = $this.outerHeight() + this._arrowOffset;

			if ((iHeight <= iTopSpace) || (iHeight <= iBottomSpace)) {
				return true;
			}
		};

		Popover.prototype._calcBestPos = function () {
			// if all positions are not big enough, we calculate which position covers the most of the popover
			var $this = this.$();
			var iHeight = $this.outerHeight();
			var iWidth = $this.outerWidth();
			var bRtl = sap.ui.getCore().getConfiguration().getRTL();

			var $parent = jQuery(this._getOpenByDomRef());
			var bHasParent = $parent[0] !== undefined;
			var iParentLeft = bHasParent ? $parent[0].getBoundingClientRect().left : 0;
			var iParentTop = bHasParent ? $parent[0].getBoundingClientRect().top : 0;
			var iParentWidth = bHasParent ? $parent[0].getBoundingClientRect().width : 0;
			var iParentHeight = bHasParent ? $parent[0].getBoundingClientRect().height : 0;
			var iOffsetX = this._getOffsetX();
			var iOffsetY = this._getOffsetY();
			var iTopSpace = iParentTop - this._marginTop + iOffsetY;
			var iParentBottom = iParentTop + iParentHeight;
			var iBottomSpace = this._$window.height() - iParentBottom - this._marginBottom - iOffsetY;
			var iLeftSpace = iParentLeft - this._marginLeft + iOffsetX;
			var iParentRight = iParentLeft + iParentWidth;
			var iRightSpace = this._$window.width() - iParentRight - this._marginRight - iOffsetX;

			//calculation for every possible position how many percent of the popover can be covered
			var fPopoverSize = iHeight * iWidth;
			var fAvailableHeight;
			var fAvaliableWidth;

			if ((this._$window.height() - this._marginTop - this._marginBottom) >= iHeight) {
				fAvailableHeight = iHeight;
			} else {
				fAvailableHeight = this._$window.height() - this._marginTop - this._marginBottom;
			}

			if ((this._$window.width() - this._marginLeft - this._marginRight) >= iWidth) {
				fAvaliableWidth = iWidth;
			} else {
				fAvaliableWidth = this._$window.width() - this._marginLeft - this._marginRight;
			}

			var fLeftCoverage = (fAvailableHeight * (iLeftSpace)) / fPopoverSize;
			var fRightCoverage = (fAvailableHeight * (iRightSpace)) / fPopoverSize;
			var fTopCoverage = (fAvaliableWidth * (iTopSpace)) / fPopoverSize;
			var fBottomCoverage = (fAvaliableWidth * (iBottomSpace)) / fPopoverSize;

			//choosing of the position with the biggest coverage and setting of the associated position
			var fMaxCoverageHorizontal = Math.max(fLeftCoverage, fRightCoverage);
			var fMaxCoverageVertical = Math.max(fTopCoverage, fBottomCoverage);

			if (fMaxCoverageHorizontal > fMaxCoverageVertical) {
				if (fMaxCoverageHorizontal === fLeftCoverage) {
					this._oCalcedPos = bRtl ? sap.m.PlacementType.Right : sap.m.PlacementType.Left;
				} else if (fMaxCoverageHorizontal === fRightCoverage) {
					this._oCalcedPos = bRtl ? sap.m.PlacementType.Left : sap.m.PlacementType.Right;
				}
			} else if (fMaxCoverageVertical > fMaxCoverageHorizontal) {
				if (fMaxCoverageVertical === fTopCoverage) {
					this._oCalcedPos = sap.m.PlacementType.Top;
				} else if (fMaxCoverageVertical === fBottomCoverage) {
					this._oCalcedPos = sap.m.PlacementType.Bottom;
				}
			} else if (fMaxCoverageVertical === fMaxCoverageHorizontal) {
				if (this._$window.height() > this._$window.width()) {
					// in portrait vertical is preferred
					if (fMaxCoverageVertical === fTopCoverage) {
						this._oCalcedPos = sap.m.PlacementType.Top;
					} else if (fMaxCoverageVertical === fBottomCoverage) {
						this._oCalcedPos = sap.m.PlacementType.Bottom;
					}
				} else {
					// in landscape horizontal is preferred
					if (fMaxCoverageHorizontal === fLeftCoverage) {
						this._oCalcedPos = bRtl ? sap.m.PlacementType.Right : sap.m.PlacementType.Left;
					} else if (fMaxCoverageHorizontal === fRightCoverage) {
						this._oCalcedPos = bRtl ? sap.m.PlacementType.Left : sap.m.PlacementType.Right;
					}
				}
			}
		};

		/**
		 * Return width of the element, for IE specific return the float number of width.
		 *
		 * @protected
		 */
		Popover.width = function (oElement) {
			if (sap.ui.Device.browser.msie) {
				var sWidth = window.getComputedStyle(oElement, null).getPropertyValue("width");
				return Math.ceil(parseFloat(sWidth));
			} else {
				return jQuery(oElement).width();
			}

		};

		/**
		 * Calculate outerWidth of the element, for IE specific return the float number of width.
		 *
		 * @protected
		 */
		Popover.outerWidth = function (oElement, bIncludeMargin) {
			var iWidth = Popover.width(oElement),
				iPaddingLeft = parseInt(jQuery(oElement).css("padding-left"), 10),
				iPaddingRight = parseInt(jQuery(oElement).css("padding-right"), 10),
				iBorderLeftWidth = parseInt(jQuery(oElement).css("border-left-width"), 10),
				iBorderRightWidth = parseInt(jQuery(oElement).css("border-right-width"), 10);

			var iOuterWidth = iWidth + iPaddingLeft + iPaddingRight + iBorderLeftWidth + iBorderRightWidth;

			if (bIncludeMargin) {
				var iMarginLeft = parseInt(jQuery(oElement).css("margin-left"), 10),
					iMarginRight = parseInt(jQuery(oElement).css("margin-right"), 10);
				iOuterWidth = iOuterWidth + iMarginLeft + iMarginRight;
			}
			return iOuterWidth;
		};

		Popover.prototype._getPositionParams = function ($popover, $arrow, $content, $scrollArea) {
			var oComputedStyle = window.getComputedStyle($popover[0]),
				oContentComputedStyle = window.getComputedStyle($content[0]),
				oPosParams = {};

			oPosParams._$popover = $popover;
			oPosParams._$parent = jQuery(this._getOpenByDomRef());
			oPosParams._$arrow = $arrow;
			oPosParams._$content = $content;
			oPosParams._$scrollArea = $scrollArea;

			oPosParams._$header = $popover.children(".sapMPopoverHeader");
			oPosParams._$subHeader = $popover.children(".sapMPopoverSubHeader");

			oPosParams._$footer = $popover.children(".sapMPopoverFooter");

			oPosParams._fWindowTop = this._$window.scrollTop();
			oPosParams._fWindowRight = this._$window.width();
			oPosParams._fWindowBottom = (Popover._bIOS7 && sap.ui.Device.orientation.landscape && window.innerHeight) ? window.innerHeight : this._$window.height();
			oPosParams._fWindowLeft = this._$window.scrollLeft();

			oPosParams._fDocumentWidth = oPosParams._fWindowLeft + oPosParams._fWindowRight;
			oPosParams._fDocumentHeight = oPosParams._fWindowTop + oPosParams._fWindowBottom;

			oPosParams._fArrowHeight = $arrow.outerHeight(true);
			oPosParams._fWidth = Popover.outerWidth($popover[0]);
			oPosParams._fHeight = $popover.outerHeight();
			oPosParams._fHeaderHeight = oPosParams._$header.length > 0 ? oPosParams._$header.outerHeight(true) : 0;
			oPosParams._fSubHeaderHeight = oPosParams._$subHeader.length > 0 ? oPosParams._$subHeader.outerHeight(true) : 0;
			oPosParams._fFooterHeight = oPosParams._$footer.length > 0 ? oPosParams._$footer.outerHeight(true) : 0;

			oPosParams._fOffset = $popover.offset();
			oPosParams._fOffsetX = this._getOffsetX();
			oPosParams._fOffsetY = this._getOffsetY();

			oPosParams._fMarginTop = oPosParams._fWindowTop + this._marginTop;
			oPosParams._fMarginRight = this._marginRight;
			oPosParams._fMarginBottom = this._marginBottom;
			oPosParams._fMarginLeft = oPosParams._fWindowLeft + this._marginLeft;

			oPosParams._fPopoverBorderTop = parseFloat(oComputedStyle.borderTopWidth);
			oPosParams._fPopoverBorderRight = parseFloat(oComputedStyle.borderRightWidth);
			oPosParams._fPopoverBorderBottom = parseFloat(oComputedStyle.borderBottomWidth);
			oPosParams._fPopoverBorderLeft = parseFloat(oComputedStyle.borderLeftWidth);

			oPosParams._fContentMarginTop = parseFloat(oContentComputedStyle.marginTop);
			oPosParams._fContentMarginBottom = parseFloat(oContentComputedStyle.marginBottom);

			return oPosParams;
		};

		/**
		 * Recalculate the margin offsets so the Popover will never cover the control that opens it.
		 *
		 * @param {sap.m.PlacementType} sCalculatedPlacement Calculated placement of the Popover
		 * @param {object} oPosParams used to calculate actual values for the screen margins, so the Popover will never cover the Opener control or goes outside of the viewport
		 * @private
		 */
		Popover.prototype._recalculateMargins = function (sCalculatedPlacement, oPosParams) {
			var bRtl = sap.ui.getCore().getConfiguration().getRTL();

			//make the popover never cover the control or dom node that opens the popover
			switch (sCalculatedPlacement) {
				case sap.m.PlacementType.Left:
					if (bRtl) {
						oPosParams._fMarginLeft = oPosParams._$parent.offset().left + Popover.outerWidth(oPosParams._$parent[0], false) + this._arrowOffset + oPosParams._fOffsetX;
					} else {
						oPosParams._fMarginRight = oPosParams._fDocumentWidth - oPosParams._$parent.offset().left + this._arrowOffset + oPosParams._fOffsetX;
					}
					break;
				case sap.m.PlacementType.Right:
					if (bRtl) {
						oPosParams._fMarginRight = oPosParams._fDocumentWidth - oPosParams._$parent.offset().left + this._arrowOffset - oPosParams._fOffsetX;
					} else {
						oPosParams._fMarginLeft = oPosParams._$parent.offset().left + Popover.outerWidth(oPosParams._$parent[0], false) + this._arrowOffset + oPosParams._fOffsetX;
					}
					break;
				case sap.m.PlacementType.Top:
					oPosParams._fMarginBottom = oPosParams._fDocumentHeight - oPosParams._$parent.offset().top + this._arrowOffset + oPosParams._fOffsetY;
					break;
				case sap.m.PlacementType.Bottom:
					oPosParams._fMarginTop = oPosParams._$parent.offset().top + oPosParams._$parent.outerHeight() + this._arrowOffset + oPosParams._fOffsetY;
					break;
			}
		};

		/**
		 * Gets the styles for positioning the Popover.
		 *
		 * @param {object} oPosParams used to calculate actual values for the Popover's top, left, right and bottom properties
		 * @returns {object} Values for positioning the Popover
		 * @private
		 */
		Popover.prototype._getPopoverPositionCss = function (oPosParams) {
			var iLeft,
				iRight,
				iTop,
				iBottom,
				iPosToRightBorder = oPosParams._fDocumentWidth - oPosParams._fOffset.left - oPosParams._fWidth,
				iPosToBottomBorder = oPosParams._fDocumentHeight - oPosParams._fOffset.top - oPosParams._fHeight,
				bExceedHorizontal = (oPosParams._fDocumentWidth - oPosParams._fMarginRight - oPosParams._fMarginLeft) < oPosParams._fWidth,
				bExceedVertical = (oPosParams._fDocumentHeight - oPosParams._fMarginTop - oPosParams._fMarginBottom) < oPosParams._fHeight,
				bOverLeft = oPosParams._fOffset.left < oPosParams._fMarginLeft,
				bOverRight = iPosToRightBorder < oPosParams._fMarginRight,
				bOverTop = oPosParams._fOffset.top < oPosParams._fMarginTop,
				bOverBottom = iPosToBottomBorder < oPosParams._fMarginBottom,
				bRtl = sap.ui.getCore().getConfiguration().getRTL();

			if (bExceedHorizontal) {
				iLeft = oPosParams._fMarginLeft;
				iRight = oPosParams._fMarginRight;
			} else {
				if (bOverLeft) {
					iLeft = oPosParams._fMarginLeft;
					if (bRtl) {
						// when only one side of the popover goes beyond the defined border make sure that
						// only one from the iLeft and iRight is set because Popover has a fixed size and
						// can't react to content size change when both are set
						iRight = "";
					}
				} else if (bOverRight) {
					iRight = oPosParams._fMarginRight;
					// when only one side of the popover goes beyond the defined border make sure that
					// only one from the iLeft and iRight is set because Popover has a fixed size and
					// can't react to content size change when both are set
					iLeft = "";
				}
			}

			if (bExceedVertical) {
				iTop = oPosParams._fMarginTop;
				iBottom = oPosParams._fMarginBottom;
			} else {
				if (bOverTop) {
					iTop = oPosParams._fMarginTop;
				} else if (bOverBottom) {
					iBottom = oPosParams._fMarginBottom;
					// when only one side of the popover goes beyond the defined border make sure that
					// only one from the iLeft and iRight is set because Popover has a fixed size and
					// can't react to content size change when both are set
					iTop = "";
				}
			}

			return {
				top: iTop,
				bottom: Math.max(iBottom - oPosParams._fWindowTop, iBottom),
				left: iLeft,
				right: typeof iRight === "number" ? iRight - oPosParams._fWindowLeft : iRight
			};
		};

		/**
		 * Gets styles for the content area.
		 *
		 * @param {object} oPosParams used to calculate the content dimension (width, height, max-height) values
		 * @returns {object} Calculated styles for content area
		 * @private
		 */
		Popover.prototype._getContentDimensionsCss = function (oPosParams) {
			var oCSS = {},
				iActualContentHeight = oPosParams._$content.height(),
				iMaxContentWidth = this._getMaxContentWidth(oPosParams),
				iMaxContentHeight = this._getMaxContentHeight(oPosParams);

			//make sure iMaxContentHeight is NEVER less than 0
			iMaxContentHeight = Math.max(iMaxContentHeight, 0);

			oCSS["max-width"] = iMaxContentWidth + "px";
			// When Popover can fit into the current screen size, don't set the height on the content div.
			// This can fix the flashing scroll bar problem when content size gets bigger after it's opened.
			// When position: absolute is used on the scroller div, the height has to be kept otherwise content div has 0 height.
			if (this.getContentHeight() || (iActualContentHeight > iMaxContentHeight)) {
				oCSS["height"] = Math.min(iMaxContentHeight, iActualContentHeight) + "px";
			} else {
				oCSS["height"] = "";
				oCSS["max-height"] = iMaxContentHeight + "px";
			}

			return oCSS;
		};

		/**
		 * Gets max content width.
		 *
		 * @param {object} oPosParams Parameters used from the method to calculate the right values
		 * @returns {number} Calculated max content width
		 * @private
		 */
		Popover.prototype._getMaxContentWidth = function (oPosParams) {
			return oPosParams._fDocumentWidth - oPosParams._fMarginLeft - oPosParams._fMarginRight - oPosParams._fPopoverBorderLeft - oPosParams._fPopoverBorderRight;
		};

		/**
		 * Gets max content height.
		 *
		 * @param {object} oPosParams Parameters used from the method to calculate the right values
		 * @returns {number} Calculated max content height
		 * @private
		 */
		Popover.prototype._getMaxContentHeight = function (oPosParams) {
			return oPosParams._fDocumentHeight - oPosParams._fMarginTop - oPosParams._fMarginBottom - oPosParams._fHeaderHeight - oPosParams._fSubHeaderHeight - oPosParams._fFooterHeight - oPosParams._fContentMarginTop - oPosParams._fContentMarginBottom - oPosParams._fPopoverBorderTop - oPosParams._fPopoverBorderBottom;
		};

		/**
		 * Checks if there is need from a scrollbar or not.
		 *
		 * @param {object} oPosParams Parameters used from the method to calculate the right values
		 *
		 * @returns {boolean} Wheather scrollbar is needed or not
		 * @private
		 */
		Popover.prototype._isScrollbarNeeded = function (oPosParams) {
			// disable the horizontal scrolling when content inside can fit the container.
			if (oPosParams._$scrollArea.outerWidth(true) <= oPosParams._$content.width()) {
				return true;
			}

			return false;
		};

		/**
		 * Gets arrow offset styles.
		 *
		 * @param {sap.m.PlacementType} sCalculatedPlacement Calculated placement of the Popover
		 * @param {object} oPosParams Parameters used from the method to calculate the right values
		 *
		 * @returns {object} Correct position type and value
		 * @private
		 */
		Popover.prototype._getArrowOffsetCss = function (sCalculatedPlacement, oPosParams) {
			var iPosArrow,
				bRtl = sap.ui.getCore().getConfiguration().getRTL();

			// Recalculate Popover width and height because they can be changed after position adjustments
			oPosParams._fWidth = Popover.outerWidth(oPosParams._$popover[0]);
			oPosParams._fHeight = oPosParams._$popover.outerHeight();

			//set arrow offset
			if (sCalculatedPlacement === sap.m.PlacementType.Left || sCalculatedPlacement === sap.m.PlacementType.Right) {
				iPosArrow = oPosParams._$parent.offset().top - oPosParams._$popover.offset().top - oPosParams._fPopoverBorderTop + oPosParams._fOffsetY + 0.5 * (oPosParams._$parent.outerHeight(false) - oPosParams._$arrow.outerHeight(false));
				iPosArrow = Math.max(iPosArrow, this._arrowOffsetThreshold);
				iPosArrow = Math.min(iPosArrow, oPosParams._fHeight - this._arrowOffsetThreshold - oPosParams._$arrow.outerHeight());
				return {"top": iPosArrow};
			} else if (sCalculatedPlacement === sap.m.PlacementType.Top || sCalculatedPlacement === sap.m.PlacementType.Bottom) {
				if (bRtl) {
					iPosArrow = oPosParams._$popover.offset().left + Popover.outerWidth(oPosParams._$popover[0], false) - (oPosParams._$parent.offset().left + Popover.outerWidth(oPosParams._$parent[0], false)) + oPosParams._fPopoverBorderRight + oPosParams._fOffsetX + 0.5 * (Popover.outerWidth(oPosParams._$parent[0], false) - Popover.outerWidth(oPosParams._$arrow[0], false));
					iPosArrow = Math.max(iPosArrow, this._arrowOffsetThreshold);
					iPosArrow = Math.min(iPosArrow, oPosParams._fWidth - this._arrowOffsetThreshold - Popover.outerWidth(oPosParams._$arrow[0], false));
					return {"right": iPosArrow};
				} else {
					iPosArrow = oPosParams._$parent.offset().left - oPosParams._$popover.offset().left - oPosParams._fPopoverBorderLeft + oPosParams._fOffsetX + 0.5 * (Popover.outerWidth(oPosParams._$parent[0], false) - Popover.outerWidth(oPosParams._$arrow[0], false));
					iPosArrow = Math.max(iPosArrow, this._arrowOffsetThreshold);
					iPosArrow = Math.min(iPosArrow, oPosParams._fWidth - this._arrowOffsetThreshold - Popover.outerWidth(oPosParams._$arrow[0], false));
					return {"left": iPosArrow};
				}
			}
		};

		/**
		 * Gets the CSS class for positioning the arrow.
		 *
		 * @param {sap.m.PlacementType} sCalculatedPlacement Calculated placement of the Popover
		 *
		 * @returns {string} CSS class for positioning the arrow
		 * @private
		 */
		Popover.prototype._getArrowPositionCssClass = function (sCalculatedPlacement) {
			switch (sCalculatedPlacement) {
				case sap.m.PlacementType.Left:
					return "sapMPopoverArrRight";

				case sap.m.PlacementType.Right:
					return "sapMPopoverArrLeft";

				case sap.m.PlacementType.Top:
					return "sapMPopoverArrDown";

				case sap.m.PlacementType.Bottom:
					return "sapMPopoverArrUp";
			}
		};

		/**
		 * Gets the CSS class for arrow if it crosses header or footer.
		 *
		 * @param {object} oPosParams Parameters used from the method to calculate the right values
		 *
		 * @returns {string|undefined} Correct CSS class or undefined if the Arrow do not cross Header or Footer
		 * @private
		 */
		Popover.prototype._getArrowStyleCssClass = function (oPosParams) {
			//cross header or cross footer detection
			var oArrowPos = oPosParams._$arrow.position(),
				oFooterPos = oPosParams._$footer.position(),
				oNavContent = this._getSingleNavContent(),
				oPageContent = this._getSinglePageContent(),
				iPageHeaderHeight = 0;

			if (oNavContent || oPageContent) {
				oPageContent = oPageContent || oNavContent.getCurrentPage();

				if (oPageContent) {
					iPageHeaderHeight = oPageContent._getAnyHeader().$().outerHeight();
				}
			}

			if ((oArrowPos.top + oPosParams._fArrowHeight) < (oPosParams._fHeaderHeight + oPosParams._fSubHeaderHeight) || ((oArrowPos.top + oPosParams._fArrowHeight) < iPageHeaderHeight)) {
				return "sapMPopoverHeaderAlignArr";
			} else if ((oArrowPos.top < (oPosParams._fHeaderHeight + oPosParams._fSubHeaderHeight)) || (oArrowPos.top < iPageHeaderHeight) || (oPosParams._$footer.length && ((oArrowPos.top + oPosParams._fArrowHeight) > oFooterPos.top) && (oArrowPos.top < oFooterPos.top))) {
				return "sapMPopoverCrossArr";
			} else if (oPosParams._$footer.length && (oArrowPos.top > oFooterPos.top)) {
				return "sapMPopoverFooterAlignArr";
			}
		};

		/**
		 * Gets the calculated placement of the Popover.
		 *
		 * @returns {sap.m.PlacementType}
		 * @private
		 */
		Popover.prototype._getCalculatedPlacement = function () {
			return this._oCalcedPos || this.getPlacement();
		};

		/**
		 * Rearrange the arrow and the popover position.
		 *
		 * @private
		 */
		Popover.prototype._adjustPositionAndArrow = function () {
			var ePopupState = this.oPopup.getOpenState();
			if (!(ePopupState === sap.ui.core.OpenState.OPEN || ePopupState === sap.ui.core.OpenState.OPENING)) {
				return;
			}

			var $popover = this.$(),
				$arrow = this.$("arrow"),
				$content = this.$("cont"),
				$scrollArea = this.$("scroll"),
				sCalculatedPlacement = this._getCalculatedPlacement(),
				oPosParams = this._getPositionParams($popover, $arrow, $content, $scrollArea);

			this._recalculateMargins(sCalculatedPlacement, oPosParams);

			// Reposition popover
			$popover.css(this._getPopoverPositionCss(oPosParams));

			// Resize popover content, if necessary
			$content.css(this._getContentDimensionsCss(oPosParams));

			// Enable the scrollbar, if necessary
			if (this._isScrollbarNeeded(oPosParams)) {
				$scrollArea.css("display", "block");
			}

			if (this.getShowArrow()) {
				// Remove old position of the arrow and add the new one
				// Set the arrow next to the opener
				$arrow.removeAttr("style");
				$arrow.css(this._getArrowOffsetCss(sCalculatedPlacement, oPosParams));

				// Add position class to the arrow
				$arrow.addClass(this._getArrowPositionCssClass(sCalculatedPlacement));

				// Style the arrow according to the header/footer/content if it is to the left or right
				if (sCalculatedPlacement === sap.m.PlacementType.Left || sCalculatedPlacement === sap.m.PlacementType.Right) {
					var sArrowStyleClass = this._getArrowStyleCssClass(oPosParams);

					if (sArrowStyleClass) {
						$arrow.addClass(sArrowStyleClass);
					}
				}

				// Prevent the popover from hiding the arrow
				$popover.css("overflow", "visible");
			}

			this._afterAdjustPositionAndArrowHook();
		};

		/**
		 * Adapt position and offsets variables if the Popover is used without arrow.
		 *
		 * @private
		 */
		Popover.prototype._adaptPositionParams = function () {
			if (this.getShowArrow()) {
				this._marginLeft = 10;
				this._marginRight = 10;
				this._marginBottom = 10;

				this._arrowOffset = 18;
				this._offsets = ["0 -18", "18 0", "0 18", "-18 0"];

				this._myPositions = ["center bottom", "begin center", "center top", "end center"];
				this._atPositions = ["center top", "end center", "center bottom", "begin center"];
			} else {
				this._marginTop = 0;
				this._marginLeft = 0;
				this._marginRight = 0;
				this._marginBottom = 0;

				this._arrowOffset = 0;
				this._offsets = ["0 0", "0 0", "0 0", "0 0"];

				this._myPositions = ["begin bottom", "begin center", "begin top", "end center"];
				this._atPositions = ["begin top", "end center", "begin bottom", "begin center"];
			}
		};

		/**
		 * Hook called after adjusment of the Popover position.
		 *
		 * @protected
		 */
		Popover.prototype._afterAdjustPositionAndArrowHook = function () {
		};

		/**
		 * Determine if the <code>oDomNode</code> is inside the Popover or inside the control that opens the Popover.
		 * @private
		 */
		Popover.prototype._isPopupElement = function (oDOMNode) {
			var oParentDomRef = this._getOpenByDomRef();
			return !!(jQuery(oDOMNode).closest(sap.ui.getCore().getStaticAreaRef()).length) || !!(jQuery(oDOMNode).closest(oParentDomRef).length);
		};

		/**
		 * If customHeader is set, this will return the customHeaer. Otherwise it creates a header and put the
		 * title and buttons if needed inside, and finally return this newly create header.
		 *
		 * @protected
		 */
		Popover.prototype._getAnyHeader = function () {
			if (this.getCustomHeader()) {
				return this.getCustomHeader();
			} else {
				if (this.getShowHeader()) {
					this._createInternalHeader();
					return this._internalHeader;
				}
			}
		};

		Popover.prototype._createInternalHeader = function () {
			if (!this._internalHeader) {
				var that = this;
				this._internalHeader = new Bar(this.getId() + "-intHeader");
				this.setAggregation("_internalHeader", this._internalHeader);
				this._internalHeader.addEventDelegate({
					onAfterRendering: function () {
						that._restoreFocus();
					}
				});
				return true;
			} else {
				return false;
			}
		};

		Popover.prototype._openAnimation = function ($Ref, iRealDuration, fnOpened) {
			var that = this;
			if (Popover._bIE9) {
				//no animation in ie9 transition not supported
				fnOpened();
			} else {
				var bOpenedCalled = false,
					fnTransitionEnd = function () {
						if (bOpenedCalled || !that.oPopup || that.oPopup.getOpenState() !== sap.ui.core.OpenState.OPENING) {
							return;
						}
						$Ref.unbind("webkitTransitionEnd transitionend");
						fnOpened();
						bOpenedCalled = true;
					};
				setTimeout(function () {
					$Ref.addClass("sapMPopoverTransparent");
					$Ref.css("display", "block");
					// has to be done in a timeout to ensure transition properties are set
					setTimeout(function () {
						$Ref.bind("webkitTransitionEnd transitionend", fnTransitionEnd);
						$Ref.removeClass("sapMPopoverTransparent");
						//check if the transitionend event isn't fired, if it's not fired due to unexpected rerendering,
						//fnOpened should be called again.
						setTimeout(function () {
							fnTransitionEnd();
						}, 300);
					}, sap.ui.Device.browser.firefox ? 50 : 0);
				}, 0);
			}
		};

		Popover.prototype._closeAnimation = function ($Ref, iRealDuration, fnClose) {
			if (Popover._bIE9) {
				fnClose();
			} else {
				var bClosedCalled = false,
					fnTransitionEnd = function () {
						if (bClosedCalled) {
							return;
						}
						$Ref.unbind("webkitTransitionEnd transitionend");
						setTimeout(function () {
							fnClose();
							bClosedCalled = true;
							$Ref.removeClass("sapMPopoverTransparent");
						}, 0);
					};
				// has to be done in a timeout to ensure transition properties are set
				$Ref.bind("webkitTransitionEnd transitionend", fnTransitionEnd).addClass("sapMPopoverTransparent");
				//check if the transitionend event isn't fired, if it's not fired due to unexpected rerendering,
				//fnClose should be called again.
				setTimeout(function () {
					fnTransitionEnd();
				}, 300);
			}
		};

		Popover.prototype._getInitialFocusId = function () {
			return this.getInitialFocus()
				|| this._getFirstVisibleButtonId()
				|| this._getFirstFocusableContentElementId()
				|| this.getId();
		};

		Popover.prototype._getFirstVisibleButtonId = function () {
			var oBeginButton = this.getBeginButton(),
				oEndButton = this.getEndButton(),
				sButtonId = "";

			if (oBeginButton && oBeginButton.getVisible()) {
				sButtonId = oBeginButton.getId();
			} else if (oEndButton && oEndButton.getVisible()) {
				sButtonId = oEndButton.getId();
			}

			return sButtonId;
		};

		Popover.prototype._getFirstFocusableContentElementId = function () {
			var sResult = "";
			var $popoverContent = this.$("cont");
			var oFirstFocusableDomRef = $popoverContent.firstFocusableDomRef();

			if (oFirstFocusableDomRef) {
				sResult = oFirstFocusableDomRef.id;
			}
			return sResult;
		};

		Popover.prototype._restoreFocus = function () {
			if (this.isOpen()) {
				//restore the focus after rendering when popover is already open
				var sFocusId = this._getInitialFocusId(),
					oControl = sap.ui.getCore().byId(sFocusId);
				jQuery.sap.focus(oControl ? oControl.getFocusDomRef() : jQuery.sap.domById(sFocusId));
			}
		};

		Popover.prototype._registerContentResizeHandler = function () {
			if (!this._sResizeListenerId) {
				this._sResizeListenerId = sap.ui.core.ResizeHandler.register(this.getDomRef("scroll"), this._fnOrientationChange);
			}
		};

		Popover.prototype._deregisterContentResizeHandler = function () {
			if (this._sResizeListenerId) {
				sap.ui.core.ResizeHandler.deregister(this._sResizeListenerId);
				this._sResizeListenerId = null;
			}
		};

		Popover.prototype._storeScrollPosition = function () {
			var $content = this.$("cont");
			if ($content.length > 0) {
				this._oScrollPosDesktop = {x: $content.scrollLeft(), y: $content.scrollTop()};
			}
		};

		Popover.prototype._restoreScrollPosition = function () {
			if (!this._oScrollPosDesktop) {
				return;
			}

			var $content = this.$("cont");

			if ($content.length > 0) {
				$content.scrollLeft(this._oScrollPosDesktop.x).
					scrollTop(this._oScrollPosDesktop.y);

				this._oScrollPosDesktop = null;
			}
		};

		Popover.prototype._repositionOffset = function () {
			var ePopupState = this.oPopup.getOpenState(),
				oLastPosition, iPlacePos;

			//if popup isn't open, just return
			if (!(ePopupState === sap.ui.core.OpenState.OPEN)) {
				return this;
			}

			//popup is open
			oLastPosition = this.oPopup._oLastPosition;
			iPlacePos = jQuery.inArray(this.getPlacement(), this._placements);

			if (iPlacePos === -1) {
				return this;
			}

			if (iPlacePos < 4) {
				oLastPosition.offset = this._calcOffset(this._offsets[iPlacePos]);
				this.oPopup._applyPosition(oLastPosition);
			} else {
				this._calcPlacement();
			}

			return this;
		};

		Popover.prototype._getOpenByDomRef = function () {
			if (!this._oOpenBy) {
				return null;
			}

			// attach popup to:
			// - the given DOM element or
			// - the specified anchor DOM reference provided by function getPopupAnchorDomRef
			// - focusDomRef when getPopupAnchorDomRef isn't implemented
			if (this._oOpenBy instanceof sap.ui.core.Element) {
				return (this._oOpenBy.getPopupAnchorDomRef && this._oOpenBy.getPopupAnchorDomRef()) || this._oOpenBy.getFocusDomRef();
			} else {
				return this._oOpenBy;
			}
		};

		/**
		 * Getter for property <code>bounce</code>.
		 *
		 * Default value is empty
		 *
		 * @return {boolean} the value of property <code>bounce</code>
		 * @private
		 * @name sap.m.Popover#getBounce
		 * @function
		 */

		/* =========================================================== */
		/*                      end: internal methods                  */
		/* =========================================================== */


		/* ==================================================== */
		/*                      begin: Setters                  */
		/* ==================================================== */
		/**
		 * Set the placement of the Popover.
		 *
		 * @param {sap.m.PlacementType} sPlacement The position of the Popover
		 * @returns {sap.m.Popover} Reference to the control instance for chaining
		 * @public
		 */
		Popover.prototype.setPlacement = function (sPlacement) {
			this.setProperty("placement", sPlacement, true);
			var iPlacePos = jQuery.inArray(sPlacement, this._placements);
			if (iPlacePos <= 3) {
				// this variable is internal used for the placement of the popover
				this._oCalcedPos = sPlacement;
			}
			return this;
		};

		/**
		 * The setter of the title property.
		 *
		 * If you want to show a header in the popover, don't forget to set the
		 * {@link #setShowHeader showHeader} property to true.
		 * @param {string} sTitle The title to be set
		 * @returns {sap.m.Popover} Reference to the control instance for chaining
		 * @public
		 */
		Popover.prototype.setTitle = function (sTitle) {
			if (sTitle) {
				this.setProperty("title", sTitle, true);
				if (this._headerTitle) {
					this._headerTitle.setText(sTitle);
				} else {
					this._headerTitle = new sap.m.Title(this.getId() + "-title", {
						text: this.getTitle(),
						level: "H1"
					});

					this._createInternalHeader();
					this._internalHeader.addContentMiddle(this._headerTitle);
				}
			}

			return this;
		};

		Popover.prototype.setBeginButton = function (oButton) {
			var oOldBeginButton = this.getBeginButton();

			if (oOldBeginButton === oButton) {
				return this;
			}

			this._createInternalHeader();

			//this is used in the getAggregation method
			this._beginButton = oButton;

			if (oButton) {
				if (oOldBeginButton) {
					this._internalHeader.removeAggregation("contentLeft", oOldBeginButton, true);
				}
				this._internalHeader.addAggregation("contentLeft", oButton);
			} else {
				this._internalHeader.removeContentLeft(oOldBeginButton);
			}

			return this;
		};

		Popover.prototype.setEndButton = function (oButton) {
			var oOldEndButton = this.getEndButton();

			if (oOldEndButton === oButton) {
				return this;
			}

			this._createInternalHeader();

			//this is used in the getAggregation method
			this._endButton = oButton;

			if (oButton) {
				if (oOldEndButton) {
					this._internalHeader.removeAggregation("contentRight", oOldEndButton, true);
				}
				this._internalHeader.insertAggregation("contentRight", oButton, 1, true);
				this._internalHeader.invalidate();
			} else {
				this._internalHeader.removeContentRight(oOldEndButton);
			}

			return this;
		};

		Popover.prototype.setLeftButton = function (vButton) {
			if (!(vButton instanceof Button)) {
				vButton = sap.ui.getCore().byId(vButton);
			}

			//setting leftButton also sets the beginButton
			this.setBeginButton(vButton);
			return this.setAssociation("leftButton", vButton);
		};

		Popover.prototype.setRightButton = function (vButton) {
			if (!(vButton instanceof Button)) {
				vButton = sap.ui.getCore().byId(vButton);
			}

			//setting rightButton also sets the endButton
			this.setEndButton(vButton);
			return this.setAssociation("rightButton", vButton);
		};

		Popover.prototype.setShowHeader = function (bValue) {
			if (bValue === this.getShowHeader() || this.getCustomHeader()) {
				return this;
			}

			if (bValue) {
				//when internal header is created, show header
				//if not, the header will be created when setting title, beginButton, or endButton
				//the latest time of the header creation before it's rendered is in the renderer, calling get any header.
				if (this._internalHeader) {
					this._internalHeader.$().show();
				}
			} else {
				if (this._internalHeader) {
					this._internalHeader.$().hide();
				}
			}

			//skip the rerendering
			this.setProperty("showHeader", bValue, true);

			return this;
		};

		/**
		 * Setter for property <code>modal</code>.
		 * This overwrites the default setter of the property <code>modal</code> to avoid rerendering the whole popover control.
		 *
		 * Default value is <code>false</code>
		 *
		 * @param {boolean} bModal New value for property <code>modal</code>.
		 * @param {string} [sModalCSSClass] A CSS class (or space-separated list of classes) that should be added to the block layer.
		 * @return {sap.m.Popover} Reference to the control instance for chaining
		 * @public
		 */
		Popover.prototype.setModal = function (bModal, sModalCSSClass) {
			if (bModal === this.getModal()) {
				return this;
			}

			this.oPopup.setModal(bModal, jQuery.trim("sapMPopoverBLayer " + sModalCSSClass || ""));

			// suppress re-rendering
			this.setProperty("modal", bModal, true);

			return this;
		};

		Popover.prototype.setOffsetX = function (iValue) {
			this.setProperty("offsetX", iValue, true);

			return this._repositionOffset();
		};

		Popover.prototype.setOffsetY = function (iValue) {
			this.setProperty("offsetY", iValue, true);

			return this._repositionOffset();
		};

		Popover.prototype.setEnableScrolling = function (bValue) {
			//map deprecated property to new properties
			this.setHorizontalScrolling(bValue);
			this.setVerticalScrolling(bValue);

			var oldValue = this.getEnableScrolling();
			if (oldValue === bValue) {
				return this;
			}

			this.setProperty("enableScrolling", bValue, true);

			return this;
		};

		Popover.prototype.setVerticalScrolling = function (bValue) {
			// Mark that vertical scrolling is manually set
			this._bVScrollingEnabled = bValue;

			var oldValue = this.getVerticalScrolling();
			if (oldValue === bValue) {
				return this;
			}

			this.$().toggleClass("sapMPopoverVerScrollDisabled", !bValue);
			this.setProperty("verticalScrolling", bValue, true);

			if (this._oScroller) {
				this._oScroller.setVertical(bValue);
			}

			return this;

		};

		Popover.prototype.setHorizontalScrolling = function (bValue) {
			// Mark that horizontal scrolling is manually set
			this._bHScrollingEnabled = bValue;

			var oldValue = this.getHorizontalScrolling();
			if (oldValue === bValue) {
				return this;
			}

			this.$().toggleClass("sapMPopoverHorScrollDisabled", !bValue);
			this.setProperty("horizontalScrolling", bValue, true);

			if (this._oScroller) {
				this._oScroller.setHorizontal(bValue);
			}

			return this;
		};


		/**
		 * Returns the sap.ui.core.ScrollEnablement delegate which is used with this control.
		 *
		 * @private
		 */
		Popover.prototype.getScrollDelegate = function () {
			return this._oScroller;
		};

		/* ==================================================== */
		/*                      end: Setters                  */
		/* ==================================================== */


		// beginButton and endButton are managed inside the internal header therefore the following three functions need to be overwritten.
		// beginButton and endButton are singular aggregation, overwritting those three functions are enough.
		Popover.prototype.setAggregation = function (sAggregationName, oObject, bSuppressInvalidate) {
			if (sAggregationName === "beginButton" || sAggregationName === "endButton") {
				var sFunctionName = "set" + sAggregationName.charAt(0).toUpperCase() + sAggregationName.slice(1);
				return this[sFunctionName](oObject);
			} else {
				return Control.prototype.setAggregation.apply(this, arguments);
			}
		};

		Popover.prototype.getAggregation = function (sAggregationName, oDefaultForCreation) {
			if (sAggregationName === "beginButton" || sAggregationName === "endButton") {
				var sButton = this["_" + sAggregationName];
				return sButton || oDefaultForCreation || null;
			} else {
				return Control.prototype.getAggregation.apply(this, arguments);
			}
		};

		Popover.prototype.destroyAggregation = function (sAggregationName, bSuppressInvalidate) {
			if (sAggregationName === "beginButton" || sAggregationName === "endButton") {
				var sButton = this["_" + sAggregationName];
				if (sButton) {
					sButton.destroy();
					this["_" + sAggregationName] = null;
				}
				return this;
			} else {
				return Control.prototype.destroyAggregation.apply(this, arguments);
			}
		};

		Popover.prototype.invalidate = function (oOrigin) {
			if (this.isOpen()) {
				Control.prototype.invalidate.apply(this, arguments);
			}
			return this;
		};

		Popover.prototype.addAggregation = function (sAggregationName, oObject, bSuppressInvalidate) {
			if (sAggregationName === "content") {
				this._bContentChanged = true;
			}
			Control.prototype.addAggregation.apply(this, arguments);
		};

		/**
		 * A hook for controls that extend popover to determine how the controls array is formed
		 * @returns {sap.ui.core.Control[]}
		 * @private
		 */
		Popover.prototype._getAllContent = function () {
			return this.getContent();
		};

		return Popover;

	}, /* bExport= */ true);
