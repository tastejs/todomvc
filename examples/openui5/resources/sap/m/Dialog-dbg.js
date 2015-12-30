/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.m.Dialog.
sap.ui.define(['jquery.sap.global', './Bar', './InstanceManager', './OverflowToolbar', './ToolbarSpacer', './library', 'sap/ui/core/Control', 'sap/ui/core/IconPool', 'sap/ui/core/Popup', 'sap/ui/core/delegate/ScrollEnablement', 'sap/ui/core/theming/Parameters'],
	function (jQuery, Bar, InstanceManager, OverflowToolbar, ToolbarSpacer, library, Control, IconPool, Popup, ScrollEnablement, Parameters) {
		"use strict";


		var ValueState = sap.ui.core.ValueState;

		/**
		 * Constructor for a new Dialog.
		 *
		 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
		 * @param {object} [mSettings] Initial settings for the new control
		 *
		 * @class
		 * The Dialog control is used to interrupt the current processing of an application to prompt the user for information or a response.
		 * @extends sap.ui.core.Control
		 * @implements sap.ui.core.PopupInterface
		 *
		 * @author SAP SE
		 * @version 1.32.9
		 *
		 * @constructor
		 * @public
		 * @alias sap.m.Dialog
		 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
		 */
		var Dialog = Control.extend("sap.m.Dialog", /** @lends sap.m.Dialog.prototype */ {
			metadata: {
				interfaces: [
					"sap.ui.core.PopupInterface"
				],
				library: "sap.m",
				properties: {

					/**
					 * Icon displayed in the dialog's header. This icon is invisible on the iOS platform and it's density aware. You can use the density convention (@2, @1.5, etc.) to provide higher resolution image for higher density screen.
					 */
					icon: {type: "sap.ui.core.URI", group: "Appearance", defaultValue: null},

					/**
					 * Title text appears in the dialog header.
					 */
					title: {type: "string", group: "Appearance", defaultValue: null},

					/**
					 * Determines whether the header is shown inside the dialog. If this property is set to true, the text and icon property are ignored. This property has a default value true.
					 * @since 1.15.1
					 */
					showHeader: {type: "boolean", group: "Appearance", defaultValue: true},

					/**
					 * The type of the dialog. In theme sap_bluecrystal, the type "message" will limit the dialog's width within 480px on tablet and desktop.
					 */
					type: {type: "sap.m.DialogType", group: "Appearance", defaultValue: sap.m.DialogType.Standard},

					/**
					 * The state affects the icon and the title color. If other than "None" is set, a predefined icon will be added to the dialog. Setting icon property will overwrite the predefined icon. The default value is "None" which doesn't add any icon to the Dialog control. This property is by now only supported by blue crystal theme.
					 * @since 1.11.2
					 */
					state: {type: "sap.ui.core.ValueState", group: "Appearance", defaultValue: ValueState.None},

					/**
					 * Determines whether the dialog will displayed on full screen on a phone.
					 * @since 1.11.2
					 * @deprecated Since version 1.13.1.
					 * Please use the new stretch property instead. This enables a stretched dialog even on tablet and desktop. If you want to achieve the same effect as stretchOnPhone, please set the stretch with jQuery.device.is.phone, then dialog is only stretched when runs on phone.
					 */
					stretchOnPhone: {type: "boolean", group: "Appearance", defaultValue: false, deprecated: true},

					/**
					 * Determines  if the dialog will be stretched to full screen. This property is only applicable to standard dialog and message type dialog ignores this property.
					 * @since 1.13.1
					 */
					stretch: {type: "boolean", group: "Appearance", defaultValue: false},

					/**
					 * Preferred width of content in Dialog. This property affects the width of dialog on phone in landscape mode, tablet or desktop, because the dialog has a fixed width on phone in portrait mode. If the preferred width is less than the minimum width of dilaog or more than the available width of the screen, it will be overwritten by the min or max value. The current mininum value of dialog width on tablet is 400px.
					 * @since 1.12.1
					 */
					contentWidth: {type: "sap.ui.core.CSSSize", group: "Dimension", defaultValue: null},

					/**
					 * Preferred height of content in Dialog. If the preferred height is bigger than the available space on screen, it will be overwritten by the maximum available height on screen in order to make sure that dialog isn't cut off.
					 * @since 1.12.1
					 */
					contentHeight: {type: "sap.ui.core.CSSSize", group: "Dimension", defaultValue: null},

					/**
					 * Indicates if user can scroll horizontally inside dialog when the content is bigger than the content area. However, when scrollable control (sap.m.ScrollContainer, sap.m.Page) is in the dialog, this property needs to be set to false to disable the scrolling in dialog in order to make the scrolling in the child control work properly.
					 * Dialog detects if there's sap.m.NavContainer, sap.m.Page, or sap.m.ScrollContainer as direct child added to dialog. If there is, dialog will turn off scrolling by setting this property to false automatically ignoring the existing value of this property.
					 * @since 1.15.1
					 */
					horizontalScrolling: {type: "boolean", group: "Behavior", defaultValue: true},

					/**
					 * Indicates if user can scroll vertically inside dialog when the content is bigger than the content area. However, when scrollable control (sap.m.ScrollContainer, sap.m.Page) is in the dialog, this property needs to be set to false to disable the scrolling in dialog in order to make the scrolling in the child control work properly.
					 * Dialog detects if there's sap.m.NavContainer, sap.m.Page, or sap.m.ScrollContainer as direct child added to dialog. If there is, dialog will turn off scrolling by setting this property to false automatically ignoring the existing value of this property.
					 * @since 1.15.1
					 */
					verticalScrolling: {type: "boolean", group: "Behavior", defaultValue: true},

					/**
					 * Indicates whether the dialog is resizable. the dialog is resizable. If this property is set to true, the dialog will have a resize handler in it's bottom right corner. This property has a default value false. The Dialog can be resizable only in desktop mode.
					 * @since 1.30
					 */
					resizable: {type: "boolean", group: "Behavior", defaultValue: false},

					/**
					 * Indicates whether the dialog is draggable. If this property is set to true, the dialog will be draggable by it's header. This property has a default value false. The Dialog can be draggable only in desktop mode.
					 * @since 1.30
					 */
					draggable: {type: "boolean", group: "Behavior", defaultValue: false}
				},
				defaultAggregation: "content",
				aggregations: {

					/**
					 * The content inside the dialog.
					 */
					content: {type: "sap.ui.core.Control", multiple: true, singularName: "content"},

					/**
					 * When subHeader is assigned to Dialog, it's rendered directly after the main header in Dialog. SubHeader is out of the content area and won't be scrolled when content's size is bigger than the content area's size.
					 * @since 1.12.2
					 */
					subHeader: {type: "sap.m.IBar", multiple: false},

					/**
					 * CustomHeader is only supported in theme sap_bluecrystal. When it's set, the icon, title and showHeader are properties ignored. Only the customHeader is shown as the header of the dialog.
					 * @since 1.15.1
					 */
					customHeader: {type: "sap.m.IBar", multiple: false},

					/**
					 * The button which is rendered to the left side (right side in RTL mode) of the endButton in the footer area inside the dialog. From UI5 version 1.21.1, there's a new aggregation "buttons" created with which more than 2 buttons can be added to the footer area of dialog. If the new "buttons" aggregation is set, any change made to this aggregation has no effect anymore. When runs on the phone, this button (and the endButton together when set) is (are) rendered at the center of the footer area. When runs on the other platforms, this button (and the endButton together when set) is (are) rendered at the right side (left side in RTL mode) of the footer area.
					 * @since 1.15.1
					 */
					beginButton: {type: "sap.m.Button", multiple: false},

					/**
					 * The button which is rendered to the right side (left side in RTL mode) of the beginButton in the footer area inside the dialog. From UI5 version 1.21.1, there's a new aggregation "buttons" created with which more than 2 buttons can be added to the footer area of dialog. If the new "buttons" aggregation is set, any change made to this aggregation has no effect anymore. When runs on the phone, this button (and the beginButton together when set) is (are) rendered at the center of the footer area. When runs on the other platforms, this button (and the beginButton together when set) is (are) rendered at the right side (left side in RTL mode) of the footer area.
					 * @since 1.15.1
					 */
					endButton: {type: "sap.m.Button", multiple: false},

					/**
					 * Buttons can be added to the footer area of dialog through this aggregation. When this aggregation is set, any change to beginButton and endButton has no effect anymore. Buttons which are inside this aggregation are aligned at the right side (left side in RTL mode) of the footer instead of in the middle of the footer.
					 * @since 1.21.1
					 */
					buttons: {type: "sap.m.Button", multiple: true, singularName: "button"},

					/**
					 * The hidden aggregation for internal maintained header.
					 */
					_header: {type: "sap.ui.core.Control", multiple: false, visibility: "hidden"},

					/**
					 * The hidden aggregation for internal maintained title control.
					 */
					_title: {type: "sap.ui.core.Control", multiple: false, visibility: "hidden"},

					/**
					 * The hidden aggregation for internal maintained icon control.
					 */
					_icon: {type: "sap.ui.core.Control", multiple: false, visibility: "hidden"},

					/**
					 * The hidden aggregation for internal maintained toolbar instance
					 */
					_toolbar: {type: "sap.m.OverflowToolbar", multiple: false, visibility: "hidden"}
				},
				associations: {

					/**
					 * LeftButton is shown at the left edge of the bar in iOS, and at the right side of the bar for the other platforms. Please set this to null if you want to remove the left button from the bar. And the button is only removed from the bar, not destroyed. When showHeader is set to false, this property will be ignored. Setting leftButton will also set the beginButton internally.
					 * @deprecated Since version 1.15.1.
					 *
					 * LeftButton has been deprecated since 1.15.1. Please use the beginButton instead which is more RTL friendly.
					 */
					leftButton: {type: "sap.m.Button", multiple: false, deprecated: true},

					/**
					 * RightButton is always shown at the right edge of the bar. Please set this to null if you want to remove the right button from the bar. And the button is only removed from the bar, not destroyed. When showHeader is set to false, this property will be ignored. Setting rightButton will also set the endButton internally.
					 * @deprecated Since version 1.15.1.
					 *
					 * RightButton has been deprecated since 1.15.1. Please use the endButton instead which is more RTL friendly.
					 */
					rightButton: {type: "sap.m.Button", multiple: false, deprecated: true},

					/**
					 * Focus is set to the dialog in the sequence of leftButton and rightButton when available. But if some other control needs to get the focus other than one of those two buttons, set the initialFocus with the control which should be focused on. Setting initialFocus to input controls doesn't open the on screen keyboard on mobile device, this is due to the browser limitation that the on screen keyboard can't be opened with javascript code. The opening of on screen keyboard must be triggered by real user action.
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
					 * This event will be fired before the dialog is opened.
					 */
					beforeOpen: {},

					/**
					 * This event will be fired after the dialog is opened.
					 */
					afterOpen: {},

					/**
					 * This event will be fired before the dialog is closed.
					 */
					beforeClose: {
						parameters: {

							/**
							 * This indicates the trigger of closing the dialog. If dialog is closed by either leftButton or rightButton, the button that closes the dialog is set to this parameter. Otherwise this parameter is set to null.
							 * @since 1.9.2
							 */
							origin: {type: "sap.m.Button"}
						}
					},

					/**
					 * This event will be fired after the dialog is closed.
					 */
					afterClose: {
						parameters: {

							/**
							 * This indicates the trigger of closing the dialog. If dialog is closed by either leftButton or rightButton, the button that closes the dialog is set to this parameter. Otherwise this parameter is set to null.
							 * @since 1.9.2
							 */
							origin: {type: "sap.m.Button"}
						}
					}
				}
			}
		});

		Dialog._bIOS7Tablet = sap.ui.Device.os.ios && sap.ui.Device.system.tablet && sap.ui.Device.os.version >= 7 && sap.ui.Device.os.version < 8 && sap.ui.Device.browser.name === "sf";
		Dialog._bPaddingByDefault = (sap.ui.getCore().getConfiguration().getCompatibilityVersion("sapMDialogWithPadding").compareTo("1.16") < 0);

		Dialog._mStateClasses = {};
		Dialog._mStateClasses[ValueState.None] = "";
		Dialog._mStateClasses[ValueState.Success] = "sapMDialogSuccess";
		Dialog._mStateClasses[ValueState.Warning] = "sapMDialogWarning";
		Dialog._mStateClasses[ValueState.Error] = "sapMDialogError";

		Dialog._mIcons = {};
		Dialog._mIcons[ValueState.Success] = IconPool.getIconURI("message-success");
		Dialog._mIcons[ValueState.Warning] = IconPool.getIconURI("message-warning");
		Dialog._mIcons[ValueState.Error] = IconPool.getIconURI("message-error");

		/* =========================================================== */
		/*                  begin: Lifecycle functions                 */
		/* =========================================================== */
		Dialog.prototype.init = function () {
			var that = this;
			this._externalIcon = undefined;
			this._sResizeListenerId = null;
			this._$Window = jQuery(window);
			this._oManuallySetSize = null;

			this._aButtons = [];

			// used to judge if enableScrolling needs to be disabled
			this._scrollContentList = ["NavContainer", "Page", "ScrollContainer"];

			this.oPopup = new Popup();
			this.oPopup.setShadow(true);
			if (jQuery.device.is.iphone && !this._bMessageType) {
				this.oPopup.setModal(true, "sapMDialogTransparentBlk");
			} else {
				this.oPopup.setModal(true, "sapMDialogBlockLayerInit");
			}

			//avoid playing fancy animation in native browser with android version smaller than 4.1
			//because it has problem with keyframe animation that it always sets back to the first
			//keyframe after the animation which causes flickering during the animation.
			if (!(sap.ui.Device.os.android && sap.ui.Device.os.version < 4.1 && window.navigator.userAgent.toLowerCase().indexOf("chrome") === -1)) {
				this.oPopup.setAnimations(jQuery.proxy(this._openAnimation, this), jQuery.proxy(this._closeAnimation, this));
			}

			//keyboard support for desktop environments
			//use pseudo event 'onsapescape' to implement keyboard-trigger for closing this dialog
			//had to implement this on the popup instance because it did not work on the dialog prototype
			this.oPopup.onsapescape = jQuery.proxy(function (oEvent) {
				// when the escape is already handled by inner control, nothing should happen inside dialog
				if (oEvent.originalEvent && oEvent.originalEvent._sapui_handledByControl) {
					return;
				}
				this.close();
				//event should not trigger any further actions
				oEvent.stopPropagation();
			}, this);

			//the orientationchange event listener
			this._fnOrientationChange = jQuery.proxy(this._reposition, this);

			this._fnContentResize = jQuery.proxy(this._onResize, this);

			this._fnRepositionAfterOpen = jQuery.proxy(this._repositionAfterOpen, this);

			/**
			 *
			 * @param {Object} oPosition A new position to move the Dialog to.
			 * @param {boolean} bFromResize Is the function called from resize event.
			 * @private
			 */
			this.oPopup._applyPosition = function (oPosition, bFromResize) {
				var $that = that.$(),
					$Window = that._$Window;

				that._setDimensions();
				that._adjustScrollingPane();

				//TODO: if sap_mvi has to be restored, here has to be changed.
				oPosition.at = {
					left: parseInt(($Window.width() - $that.outerWidth()) / 2, 10),
					top: parseInt(($Window.height() - $that.outerHeight()) / 2, 10)
				};

				Popup.prototype._applyPosition.call(this, oPosition);

				var iTop = $that.offset().top;

				//TODO: remove this code after Apple fixes the jQuery(window).height() is 20px more than the window.innerHeight issue.
				if (Dialog._bIOS7Tablet && sap.ui.Device.orientation.landscape) {
					$that.css("top", iTop - 10); //the calculated window size is 20px more than the actual size in ios 7 tablet landscape mode.
				}

				that._registerResizeHandler();
			};

			if (Dialog._bPaddingByDefault) {
				this.addStyleClass("sapUiPopupWithPadding");
			}
		};

		Dialog.prototype.onBeforeRendering = function () {
			// the resize handler have to be resize because in some edge cases the content ('scroll') dom element can be replaced
			// Incident ID: 1570796905
			// this will be unneeded when the positioning is refactored (to be done with css only)
			this._deregisterResizeHandler();

			//if content has scrolling, disable scrolling automatically
			if (this._hasSingleScrollableContent()) {
				this._forceDisableScrolling = true;
				jQuery.sap.log.info("VerticalScrolling and horizontalScrolling in sap.m.Dialog with ID " + this.getId() + " has been disabled because there's scrollable content inside");
			} else {
				this._forceDisableScrolling = false;
			}

			if (!this._forceDisableScrolling) {
				if (!this._oScroller) {
					this._oScroller = new ScrollEnablement(this, this.getId() + "-scroll", {
						horizontal: this.getHorizontalScrolling(), // will be disabled in adjustScrollingPane if content can fit in
						vertical: this.getVerticalScrolling(),
						zynga: false,
						preventDefault: false,
						nonTouchScrolling: "scrollbar",
						// In android stock browser, iScroll has to be used
						// The scrolling layer using native scrolling is transparent for the browser to dispatch events
						iscroll: sap.ui.Device.browser.name === "an" ? "force" : undefined
					});
				}
			}
		};

		Dialog.prototype.onAfterRendering = function () {
			this._$scrollPane = this.$("scroll");
			//this is not used in the control itself but is used in test and may me used from client's implementations
			this._$content = this.$("cont");
			this._$dialog = this.$();

			if (this.isOpen()) {
				//restore the focus after rendering when dialog is already open
				this._setInitialFocus();
			}
		};

		Dialog.prototype.exit = function () {
			this._deregisterResizeHandler();

			sap.ui.Device.resize.detachHandler(this._fnOrientationChange);

			InstanceManager.removeDialogInstance(this);

			if (this.oPopup) {
				this.oPopup.detachOpened(this._handleOpened, this);
				this.oPopup.detachClosed(this._handleClosed, this);
				this.oPopup.destroy();
				this.oPopup = null;
			}
			if (this._oScroller) {
				this._oScroller.destroy();
				this._oScroller = null;
			}

			if (this._header) {
				this._header.destroy();
				this._header = null;
			}

			if (this._headerTitle) {
				this._headerTitle.destroy();
				this._headerTitle = null;
			}

			if (this._iconImage) {
				this._iconImage.destroy();
				this._iconImage = null;
			}

			// begin/endButton are added to the toolbar in onBeforeRendering when runs on tablet or desktop
			// They have to be destroyed here if dialog is never opened
			if (this._oBeginButton) {
				this._oBeginButton.destroy();
				this._oBeginButton = null;
			}

			if (this._oEndButton) {
				this._oEndButton.destroy();
				this._oEndButton = null;
			}
		};
		/* =========================================================== */
		/*                   end: Lifecycle functions                  */
		/* =========================================================== */

		/* =========================================================== */
		/*                    begin: public functions                  */
		/* =========================================================== */
		/**
		 * Open the dialog.
		 *
		 * @public
		 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
		 */
		Dialog.prototype.open = function () {
			var oPopup = this.oPopup;
			// Set the initial focus to the dialog itself.
			// The initial focus should be set because otherwise the first focusable element will be focused.
			// This first element can be input or textarea which will trigger the keyboard to open.
			// The focus will be change after the dialog is opened;
			oPopup.setInitialFocusId(this.getId());

			if (oPopup.isOpen()) {
				return this;
			}

			//reset the close trigger
			this._oCloseTrigger = null;

			this.fireBeforeOpen();
			oPopup.attachOpened(this._handleOpened, this);

			// Open popup
			oPopup.setContent(this);

			oPopup.setPosition("center center", "center center", window, "0 0", "fit");

			oPopup.open();

			// bind to window resize
			sap.ui.Device.resize.attachHandler(this._fnOrientationChange);

			InstanceManager.addDialogInstance(this);
			return this;
		};


		/**
		 * Close the dialog.
		 *
		 * @public
		 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
		 */
		Dialog.prototype.close = function () {
			var oPopup = this.oPopup;

			var eOpenState = this.oPopup.getOpenState();
			if (!(eOpenState === sap.ui.core.OpenState.CLOSED || eOpenState === sap.ui.core.OpenState.CLOSING)) {
				sap.m.closeKeyboard();
				this.fireBeforeClose({origin: this._oCloseTrigger});
				oPopup.attachClosed(this._handleClosed, this);
				this._deregisterResizeHandler();
				this._bDisableRepositioning = false;
				oPopup.close();
			}
			return this;
		};

		/**
		 * The method checks if the Dialog is open. It returns true when the Dialog is currently open (this includes opening and closing animations), otherwise it returns false.
		 *
		 * @returns boolean
		 * @public
		 * @since 1.9.1
		 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
		 */
		Dialog.prototype.isOpen = function () {
			return this.oPopup && this.oPopup.isOpen();
		};
		/* =========================================================== */
		/*                     end: public functions                   */
		/* =========================================================== */

		/* =========================================================== */
		/*                      begin: event handlers                  */
		/* =========================================================== */
		/**
		 *
		 * @private
		 */
		Dialog.prototype._handleOpened = function () {
			this.oPopup.detachOpened(this._handleOpened, this);
			this._setInitialFocus();
			this.fireAfterOpen();
		};

		/**
		 *
		 * @private
		 */
		Dialog.prototype._handleClosed = function () {
			this.oPopup.detachClosed(this._handleClosed, this);

			// Not removing the content DOM leads to the  problem that control DOM with the same ID exists in two places if
			// the control is added to a different aggregation without the dialog being destroyed. In this special case the
			// RichTextEditor (as an example) renders a textarea-element and afterwards tells the TinyMCE component which ID
			// to use for rendering; since there are two elements with the same ID at that point, it does not work.
			// As the Dialog can only contain other controls, we can safely discard the DOM - we cannot do this inside
			// the Popup, since it supports displaying arbitrary HTML content.
			this.$().remove();

			sap.ui.Device.resize.detachHandler(this._fnOrientationChange);
			InstanceManager.removeDialogInstance(this);
			this.fireAfterClose({origin: this._oCloseTrigger});
		};

		/**
		 * Event handler for the focusin event.
		 * If it occurs on the focus handler elements at the beginning of the dialog, the focus is set to the end, and vice versa.
		 * @param {jQuery.EventObject} oEvent The event object
		 * @private
		 */
		Dialog.prototype.onfocusin = function (oEvent) {
			var oSourceDomRef = oEvent.target;

			//Check if the invisible FIRST focusable element (suffix '-firstfe') has gained focus
			if (oSourceDomRef.id === this.getId() + "-firstfe") {
				//Check if buttons are available
				var oLastFocusableDomRef = this.$("footer").lastFocusableDomRef() || this.$("cont").lastFocusableDomRef() || (this.getSubHeader() && this.getSubHeader().$().firstFocusableDomRef()) || (this._getAnyHeader() && this._getAnyHeader().$().lastFocusableDomRef());
				if (oLastFocusableDomRef) {
					jQuery.sap.focus(oLastFocusableDomRef);
				}
			} else if (oSourceDomRef.id === this.getId() + "-lastfe") {
				//Check if the invisible LAST focusable element (suffix '-lastfe') has gained focus
				//First check if header content is available
				var oFirstFocusableDomRef = (this._getAnyHeader() && this._getAnyHeader().$().firstFocusableDomRef()) || (this.getSubHeader() && this.getSubHeader().$().firstFocusableDomRef()) || this.$("cont").firstFocusableDomRef() || this.$("footer").firstFocusableDomRef();
				if (oFirstFocusableDomRef) {
					jQuery.sap.focus(oFirstFocusableDomRef);
				}
			}
		};

		/* =========================================================== */
		/*                      end: event handlers                  */
		/* =========================================================== */

		/* =========================================================== */
		/*                      begin: private functions               */
		/* =========================================================== */
		/**
		 *
		 * @param {Object} $Ref
		 * @param {number} iRealDuration
		 * @param fnOpened
		 * @private
		 */
		Dialog.prototype._openAnimation = function ($Ref, iRealDuration, fnOpened) {
			if (!(sap.ui.Device.browser.internet_explorer && sap.ui.Device.browser.version < 10)) {
				$Ref.css("display", "block");
			}

			var that = this,
				bOpenedCalled = false,
				fnEnd;

			if ((sap.ui.Device.browser.internet_explorer && sap.ui.Device.browser.version < 10)) {
				$Ref.fadeIn(200, fnOpened);
			} else {
				fnEnd = function () {
					if (bOpenedCalled || !that.oPopup || that.oPopup.getOpenState() !== sap.ui.core.OpenState.OPENING) {
						return;
					}
					$Ref.unbind("webkitAnimationEnd animationend");
					fnOpened();
					$Ref.removeClass("sapMDialogOpening");
					bOpenedCalled = true;
				};
				$Ref.bind("webkitAnimationEnd animationend", fnEnd);
				$Ref.addClass("sapMDialogOpening");
				//check if the transitionend event isn't fired, if it's not fired due to unexpected rerendering,
				//fnOpened should be called again.
				setTimeout(function () {
					fnEnd();
				}, 150);
			}
		};

		/**
		 *
		 * @param {Object} $Ref
		 * @param {number} iRealDuration
		 * @param fnClose
		 * @private
		 */
		Dialog.prototype._closeAnimation = function ($Ref, iRealDuration, fnClose) {
			var bClosedCalled = false,
				fnEnd;

			if (sap.ui.Device.browser.internet_explorer && sap.ui.Device.browser.version < 10) {
				$Ref.fadeOut(200, fnClose);
			} else {
				fnEnd = function () {
					if (bClosedCalled) {
						return;
					}
					$Ref.unbind("webkitAnimationEnd animationend");
					fnClose();
					$Ref.removeClass("sapMDialogClosing");
					bClosedCalled = true;
				};
				$Ref.bind("webkitAnimationEnd animationend", fnEnd);
				$Ref.addClass("sapMDialogClosing");
				setTimeout(function () {
					fnEnd();
				}, 150);
			}
		};

		/**
		 *
		 * @param {string} windowWidth
		 * @returns {{top, left}}
		 * @private
		 */
		Dialog.prototype._getDialogOffset = function (windowWidth) {
			var iWindowWidth = windowWidth || this._$Window.width();
			var screenSizes = {
				small: 600,
				large: 1024
			};
			var remToPixelMargin = function (rem) {
				var iRemInPx = parseInt(window.getComputedStyle(document.body).fontSize, 10);
				return (rem * iRemInPx) * 2;
			};
			var margins = {
				top: remToPixelMargin(1), //default value for small size
				left: remToPixelMargin(1) //default value for small size
			};

			if (iWindowWidth > screenSizes.small && iWindowWidth < screenSizes.large) {
				//medium size
				margins = {
					top: remToPixelMargin(2),
					left: remToPixelMargin(2)
				};
			} else if (iWindowWidth >= screenSizes.large) {
				margins = {
					top: remToPixelMargin(4),
					left: remToPixelMargin(4)
				};
			}

			return margins;
		};

		/**
		 *
		 * @private
		 */
		Dialog.prototype._setDimensions = function () {
			var iWindowWidth = this._$Window.width(),
				iWindowHeight = (Dialog._bIOS7Tablet && sap.ui.Device.orientation.landscape && window.innerHeight) ? window.innerHeight : this._$Window.height(),
				$this = this.$(),
				bStretch = this.getStretch(),
				bStretchOnPhone = this.getStretchOnPhone(),
				bMessageType = this._bMessageType,
				iHPaddingToScreen = this._getDialogOffset(iWindowWidth).left,
				iVPaddingToScreen = this._getDialogOffset(iWindowWidth).top,
				iContentOffset = parseInt($this.css('padding-top'), 10) + parseInt($this.css('padding-bottom'), 10),
				iMaxWidth = iWindowWidth - iHPaddingToScreen,
				iMaxHeight = iWindowHeight - iVPaddingToScreen - iContentOffset,
				oStyles = {};

			//the initial size is set in the renderer when the dom is created

			if (!bStretch) {
				//set the size to the content
				if (!this._oManuallySetSize) {
					oStyles.width = this.getContentWidth() || undefined;
					oStyles.height = this.getContentHeight() || undefined;
				}

				//set max height and width smaller that the screen
				oStyles["max-width"] = bMessageType && !jQuery.device.is.iphone ? '480px' : iMaxWidth + 'px';
				oStyles["max-height"] = iMaxHeight + 'px';

				//set the max-height so contents with defined height and width can be displayed with scroller when the height/width is smaller than the content
				this.$('cont').css({'max-height': iMaxHeight + "px"});
			}

			if ((bStretch && !bMessageType) || (bStretchOnPhone && jQuery.device.is.iphone)) {
				oStyles.right = oStyles.bottom = oStyles.top = oStyles.left = 0;
				oStyles.height = oStyles.width = 'auto';
			}

			$this.css(oStyles);

			//In Chrome when the dialog is stretched the footer is not rendered in the right position;
			if (window.navigator.userAgent.toLowerCase().indexOf("chrome") !== -1 && this.getStretch()) {
				//forcing repaint
				$this.find('> footer').css({bottom: '0.001px'});
			}
		};

		/**
		 *
		 * @private
		 */
		Dialog.prototype._adjustScrollingPane = function () {
			var $scrollArea = this._$scrollPane;

			//In Android version less than 4.1, the scrollEnablement needs to set position: absolute to $scrollArea.
			//Thus the width 100% has to be set in order to make the scrollArea as big as the contentArea
			if ($scrollArea.css("position") === "absolute") {
				$scrollArea.css("width", "100%");
			}

			if (this._oScroller) {
				this._oScroller.refresh();
			}
		};

		/**
		 *
		 * @private
		 */
		Dialog.prototype._reposition = function () {
			if (this._bDisableRepositioning) {
				//on window resize recalculate the max dimensions, to the resizing is not limited by the old max-width and height
				this._setDimensions();
				return;
			}

			// this method is called within a 0 timeout, and in between the dialog can be already destroyed
			if (this.bIsDestroyed) {
				return;
			}

			var ePopupState = this.oPopup.getOpenState();

			if (ePopupState !== sap.ui.core.OpenState.OPEN && ePopupState !== sap.ui.core.OpenState.OPENING) {
				return;
			}

			this._fnRepositionAfterOpen();
		};

		/**
		 *
		 * @private
		 */
		Dialog.prototype._repositionAfterOpen = function () {
			//The dialog might have been destroyed while the timeout was set
			if (!this.oPopup) {
				return;
			}

			var eState = this.oPopup.getOpenState();
			//if resize event occurs while the opening animation, the position change has to be done after the opening animation.
			if (eState === sap.ui.core.OpenState.OPENING) {
				window.setTimeout(this._fnRepositionAfterOpen, 50);
			} else {
				this._reapplyPosition();
			}
		};

		/**\
		 *
		 * @private
		 */
		Dialog.prototype._reapplyPosition = function () {
			this.oPopup && this.oPopup._applyPosition(this.oPopup._oLastPosition, true);
		};

		/**
		 *
		 * @private
		 */
		Dialog.prototype._onResize = function () {
			if (!this.getDomRef()) {
				return;
			}

			if (this._sResizeTimer) {
				window.clearTimeout(this._sResizeTimer);
			}

			var that = this,
				oResizeDomRef = this.getDomRef("scroll");

			this._sResizeTimer = window.setTimeout(function () {
				var iNewWidth = oResizeDomRef.offsetWidth,
					iNewHeight = oResizeDomRef.offsetHeight;
				if (that._iResizeDomWidth !== iNewWidth || that._iResizeDomHeight !== iNewHeight) {
					that._fnOrientationChange();
				}
				that._sResizeTimer = null;
				//reposition only if the resize is not caused by manually resizing the dialog
				if (!that._oManuallySetSize) {
					that._reapplyPosition();
				}
			}, 0);
		};

		/**
		 *
		 * @private
		 */
		Dialog.prototype._createHeader = function () {
			if (!this._header) {
				// set parent of header to detect changes on title
				this._header = new Bar(this.getId() + "-header").addStyleClass("sapMDialogTitle");
				this.setAggregation("_header", this._header, false);
			}
		};

		/**
		 * If a scrollable control (sap.m.NavContainer, sap.m.ScrollContainer, sap.m.Page) is added to dialog's content aggregation as a single child or through one or more sap.ui.mvc.View instances,
		 * the scrolling inside dialog will be disabled in order to avoid wrapped scrolling areas.
		 *
		 * If more than one scrollable control is added to dialog, the scrolling needs to be disabled manually.
		 * @private
		 */
		Dialog.prototype._hasSingleScrollableContent = function () {
			var aContent = this.getContent(), i;

			while (aContent.length === 1 && aContent[0] instanceof sap.ui.core.mvc.View) {
				aContent = aContent[0].getContent();
			}

			if (aContent.length === 1) {
				for (i = 0; i < this._scrollContentList.length; i++) {
					if (aContent[0] instanceof sap.m[this._scrollContentList[i]]) {
						return true;
					}
				}
			}

			return false;
		};

		/**
		 *
		 * @private
		 */
		Dialog.prototype._initBlockLayerAnimation = function () {
			this.oPopup._hideBlockLayer = function () {
				var $blockLayer = jQuery("#sap-ui-blocklayer-popup");
				$blockLayer.removeClass("sapMDialogTransparentBlk");
				Popup.prototype._hideBlockLayer.call(this);
			};
		};

		/**
		 *
		 * @private
		 */
		Dialog.prototype._clearBlockLayerAnimation = function () {
			if (jQuery.device.is.iphone && !this._bMessageType) {
				delete this.oPopup._showBlockLayer;
				this.oPopup._hideBlockLayer = function () {
					var $blockLayer = jQuery("#sap-ui-blocklayer-popup");
					$blockLayer.removeClass("sapMDialogTransparentBlk");
					Popup.prototype._hideBlockLayer.call(this);
				};
			}
		};

		/**
		 *
		 * @private
		 */
		Dialog.prototype._getFocusId = function () {
			// Left or Right button can be visible false and therefore not rendered.
			// In such a case, focus should be set somewhere else.
			return this.getInitialFocus()
				|| this._getFirstFocusableContentSubHeader()
				|| this._getFirstFocusableContentElementId()
				|| this._getFirstVisibleButtonId()
				|| this.getId();
		};

		/**
		 *
		 * @returns {string}
		 * @private
		 */
		Dialog.prototype._getFirstVisibleButtonId = function () {
			var oBeginButton = this.getBeginButton(),
				oEndButton = this.getEndButton(),
				aButtons = this.getButtons(),
				sButtonId = "";

			if (oBeginButton && oBeginButton.getVisible()) {
				sButtonId = oBeginButton.getId();
			} else if (oEndButton && oEndButton.getVisible()) {
				sButtonId = oEndButton.getId();
			} else if (aButtons && aButtons.length > 0) {
				for (var i = 0; i < aButtons.length; i++) {
					if (aButtons[i].getVisible()) {
						sButtonId = aButtons[i].getId();
						break;
					}
				}
			}

			return sButtonId;
		};

		/**
		 *
		 * @returns {string}
		 * @private
		 */
		Dialog.prototype._getFirstFocusableContentSubHeader = function () {
			var $subHeader = this.$().find('.sapMDialogSubHeader');
			var sResult;

			var oFirstFocusableDomRef = $subHeader.firstFocusableDomRef();

			if (oFirstFocusableDomRef) {
				sResult = oFirstFocusableDomRef.id;
			}
			return sResult;
		};

		/**
		 *
		 * @returns {string}
		 * @private
		 */
		Dialog.prototype._getFirstFocusableContentElementId = function () {
			var sResult = "";
			var $dialogContent = this.$("cont");
			var oFirstFocusableDomRef = $dialogContent.firstFocusableDomRef();

			if (oFirstFocusableDomRef) {
				sResult = oFirstFocusableDomRef.id;
			}
			return sResult;
		};

		// The control that needs to be focused after dialog is open is calculated in following sequence:
		// initialFocus, first focusable element in content area, beginButton, endButton
		// dialog is always modal so the focus doen't need to be on the dialog when there's
		// no initialFocus, beginButton and endButton available, but to keep the consistency,
		// the focus will in the end fall back to dialog itself.
		/**
		 *
		 * @private
		 */
		Dialog.prototype._setInitialFocus = function () {

			var sFocusId = this._getFocusId();
			var oControl = sap.ui.getCore().byId(sFocusId);
			var oFocusDomRef;

			if (oControl) {
				oFocusDomRef = oControl.getFocusDomRef();
			}

			oFocusDomRef = oFocusDomRef || jQuery.sap.domById(sFocusId);

			//if there is no set initial focus, set the default one to the initialFocus association
			if (!this.getInitialFocus()) {
				this.setAssociation('initialFocus', oFocusDomRef ? oFocusDomRef.id : this.getId(), true);
			}

			// Setting focus to DOM Element which can open the on screen keyboard on mobile device doesn't work
			// consistently across devices. Therefore setting focus to those elements are disabled on mobile devices
			// and the keyboard should be opened by the User explicitly
			if (sap.ui.Device.system.desktop || (oFocusDomRef && !/input|textarea|select/i.test(oFocusDomRef.tagName))) {
				jQuery.sap.focus(oFocusDomRef);
			} else {
				// Set the focus to the popup itself in order to keep the tab chain
				this.focus();
			}
		};

		/**
		 * Returns the sap.ui.core.ScrollEnablement delegate which is used with this control.
		 *
		 * @private
		 */
		Dialog.prototype.getScrollDelegate = function () {
			return this._oScroller;
		};

		/**
		 *
		 * @param {string} sPos
		 * @returns {string}
		 * @private
		 */
		Dialog.prototype._composeAggreNameInHeader = function (sPos) {
			var sHeaderAggregationName;

			if (sPos === "Begin") {
				sHeaderAggregationName = "contentLeft";
			} else if (sPos === "End") {
				sHeaderAggregationName = "contentRight";
			} else {
				sHeaderAggregationName = "content" + sPos;
			}

			return sHeaderAggregationName;
		};

		/**
		 *
		 * @param {Object} oButton
		 * @private
		 */
		Dialog.prototype._processButton = function (oButton) {
			var that = this;

			if (!this._oButtonDelegate) {
				this._oButtonDelegate = {
					ontap: function () {
						that._oCloseTrigger = this;
					}
				};
			}

			if (oButton) {
				oButton.addDelegate(this._oButtonDelegate, true, oButton);

				if (!(oButton.getType() === sap.m.ButtonType.Accept || oButton.getType() === sap.m.ButtonType.Reject)) {
					oButton.setType(sap.m.ButtonType.Transparent);
				}
			}
		};

		/**
		 *
		 * @returns {boolean}
		 * @private
		 */
		Dialog.prototype._isToolbarEmpty = function () {
			// no ToolbarSpacer
			var filteredContent = this._oToolbar.getContent().filter(function (content) {
				return content.getMetadata().getName() !== 'sap.m.ToolbarSpacer';
			});

			return filteredContent.length === 0;
		};

		/**
		 *
		 * @param {Object} oButton
		 * @param {string} sPos
		 * @param {boolean} bSkipFlag
		 * @returns {Dialog}
		 * @private
		 */
		Dialog.prototype._setButton = function (oButton, sPos, bSkipFlag) {
			var sPosModified = this._firstLetterUpperCase(sPos),
				sGetterName = "get" + sPosModified + "Button",
				sAggregationName = sPos.toLowerCase() + "Button",
				sOldButtonName = "_o" + this._firstLetterUpperCase(sPos) + "Button",
				sOtherButtonSetter = "set" + (sPosModified === "Begin" ? "End" : "Begin") + "Button",
				oOldButton = sap.ui.Device.system.phone ? this[sGetterName]() : this[sOldButtonName];

			if (oOldButton && !(oOldButton instanceof sap.m.Button)) {
				oOldButton = sap.ui.getCore().byId(oOldButton);
			}

			if (oButton && oOldButton === oButton) {
				return this;
			}

			this._processButton(oButton);

			if (oOldButton) {
				oOldButton.removeDelegate(this._oButtonDelegate);
			}

			if (sap.ui.Device.system.phone) {
				this.setAggregation(sAggregationName, oButton, false, /*avoid infinite loop*/true);
			} else {
				var oToolbar = this._getToolbar();
				var isToolbarEmptyBeforeAction = this._isToolbarEmpty();

				if (oOldButton && !this._aButtons.length) {
					oToolbar.removeContent(oOldButton);
				}

				// if the same button which is already added to begin/endButton aggregation is now being added
				// to end/beginButton aggregation again. The button should be removed from the former aggregation first.
				if (oToolbar.indexOfContent(oButton) !== -1) {
					this[sOtherButtonSetter](null);
				}

				this[sOldButtonName] = oButton;
				// if buttons aggregation isn't set, add the button to toolbar
				if (!this._aButtons.length) {
					oToolbar.insertContent(oButton, sPos === "begin" ? 1 : 2);
				}

				// invalidate and render if the toolbar is not empty
				if (!this._isToolbarEmpty() && isToolbarEmptyBeforeAction) {
					this.invalidate();
				}
			}

			return this;
		};

		/**
		 *
		 * @param {string} sPos
		 * @private
		 */
		Dialog.prototype._getButton = function (sPos) {
			var sAggregationName = sPos.toLowerCase() + "Button",
				sButtonName = "_o" + this._firstLetterUpperCase(sPos) + "Button";

			if (sap.ui.Device.system.phone) {
				return this.getAggregation(sAggregationName, null, /*avoid infinite loop*/true);
			} else {
				return this[sButtonName];
			}
		};

		/**
		 *
		 * @param {string} sPos
		 * @private
		 */
		Dialog.prototype._getButtonFromHeader = function (sPos) {
			if (this._header) {
				var sHeaderAggregationName = this._composeAggreNameInHeader(this._firstLetterUpperCase(sPos)),
					aContent = this._header.getAggregation(sHeaderAggregationName);
				return aContent && aContent[0];
			} else {
				return null;
			}
		};

		/**
		 *
		 * @param {string} sValue
		 * @returns {string}
		 * @private
		 */
		Dialog.prototype._firstLetterUpperCase = function (sValue) {
			return sValue.charAt(0).toUpperCase() + sValue.slice(1);
		};


		/**
		 * Returns the custom header instance when the customHeader aggregation is set. Otherwise it returns the internal managed
		 * header instance. This method can be called within composite controls which use sap.m.Dialog inside.
		 *
		 * @protected
		 */
		Dialog.prototype._getAnyHeader = function () {
			var oCustomHeader = this.getCustomHeader();

			if (oCustomHeader) {
				return oCustomHeader;
			} else {
				var bShowHeader = this.getShowHeader();

				// if showHeader is set to false and not for standard dialog in iOS in theme sap_mvi, no header.
				if (!bShowHeader) {
					return null;
				}

				this._createHeader();
				return this._header;
			}
		};

		/**
		 *
		 * @private
		 */
		Dialog.prototype._deregisterResizeHandler = function () {
			if (this._sResizeListenerId) {
				sap.ui.core.ResizeHandler.deregister(this._sResizeListenerId);
				this._sResizeListenerId = null;
			}
		};

		/**
		 *
		 * @private
		 */
		Dialog.prototype._registerResizeHandler = function () {
			if (!this._sResizeListenerId && this.getDomRef()) {
				var oResizeDomRef = this.getDomRef("scroll");
				this._iResizeDomWidth = oResizeDomRef.offsetWidth;
				this._iResizeDomHeight = oResizeDomRef.offsetHeight;
				this._sResizeListenerId = sap.ui.core.ResizeHandler.register(oResizeDomRef, this._fnContentResize);
			}
		};

		/*
		 *
		 * @returns {*|sap.m.IBar|null}
		 * @private
		 */
		Dialog.prototype._getToolbar = function () {
			if (!this._oToolbar) {
				var that = this;
				this._oToolbar = new OverflowToolbar(this.getId() + "-footer", {
					content: [
						new ToolbarSpacer()
					]
				}).addStyleClass("sapMTBNoBorders")
					.applyTagAndContextClassFor("footer");
				// Buttons are now added to the Toolbar and Toolbar is the parent of the button
				// There's already code written on button:
				// oButton.getParent().close()
				// which worked before because dialog was the parent of the button. But now because button's parent is toolbar
				// and in order not to bread the existing code, the close method on the parent is created in which the close method
				// is forwarded to the dialog.
				this._oToolbar.close = function () {
					jQuery.sap.log.warning("Function 'close' is called on the internal Toolbar instance instead of the Dialog instance with id '" + that.getId() + "'. Although the function call is forwarded to the Dialog instance, the 'close' function should be called on the Dialog instance directly.");
					that.close();
				};
				this.setAggregation("_toolbar", this._oToolbar);
			}

			return this._oToolbar;
		};

		/**
		 *
		 * @private
		 */
		Dialog.prototype._restoreBeginAndEndButtons = function () {
			// _oBeginButton or _oEndButton are set when runs on tablet or desktop so device api doesn't need to be checked here
			// add beginButton and endButton to toolbar when all buttons in buttons aggregation is removed.
			// this function is called in removeAggregation, removeAllAggregation and destroyAggregation
			if ((this._oBeginButton || this._oEndButton) && !this._aButtons.length) {
				var oToolbar = this._getToolbar();
				oToolbar.addContent(this._oBeginButton).
					addContent(this._oEndButton);
			}
		};

		/**
		 *
		 * @private
		 */
		Dialog.prototype._removeBeginAndEndButtons = function () {
			// if this is the first button added to buttons aggregation
			// remove the already set beginButton and endButton
			if (!this._aButtons.length) {
				var oToolbar = this._getToolbar();
				oToolbar.removeContent(this._oBeginButton);
				oToolbar.removeContent(this._oEndButton);
			}
		};
		/* =========================================================== */
		/*                      end: private functions                 */
		/* =========================================================== */

		/* =========================================================== */
		/*                         begin: setters                      */
		/* =========================================================== */

		//Manage "sapMDialogWithSubHeader" class depending on the visibility of the subHeader
		//This is because the dialog has content height and width and the box-sizing have to be content-box in
		//order to not recalculate the size with js
		Dialog.prototype.setSubHeader = function(oControl) {
			this.setAggregation("subHeader", oControl);

			oControl.setVisible = function(isVisible) {
				this.$().toggleClass('sapMDialogWithSubHeader', isVisible);
				oControl.setProperty("visible", isVisible);
			}.bind(this);

			return oControl;
		};

		//The public setters and getters should not be documented via JSDoc because they will appear in the explored app

		Dialog.prototype.setBeginButton = function (oButton) {
			return this._setButton(oButton, "begin");
		};

		Dialog.prototype.setEndButton = function (oButton) {
			return this._setButton(oButton, "end");
		};

		Dialog.prototype.setLeftButton = function (vButton) {
			if (!(vButton instanceof sap.m.Button)) {
				vButton = sap.ui.getCore().byId(vButton);
			}

			//setting leftButton will also set the beginButton with the same button instance.
			//as this instance is aggregated by the beginButton, the hidden aggregation isn't needed.
			this.setBeginButton(vButton);
			return this.setAssociation("leftButton", vButton);
		};

		Dialog.prototype.setRightButton = function (vButton) {
			if (!(vButton instanceof sap.m.Button)) {
				vButton = sap.ui.getCore().byId(vButton);
			}

			//setting rightButton will also set the endButton with the same button instance.
			//as this instance is aggregated by the endButton, the hidden aggregation isn't needed.
			this.setEndButton(vButton);
			return this.setAssociation("rightButton", vButton);
		};

		Dialog.prototype.getLeftButton = function () {
			var oBeginButton = this.getBeginButton();
			return oBeginButton ? oBeginButton.getId() : null;
		};

		Dialog.prototype.getRightButton = function () {
			var oEndButton = this.getEndButton();
			return oEndButton ? oEndButton.getId() : null;
		};

		Dialog.prototype.setTitle = function (sTitle) {
			this.setProperty("title", sTitle, true);

			if (this._headerTitle) {
				this._headerTitle.setText(sTitle);
			} else {
				this._headerTitle = new sap.m.Title(this.getId() + "-title", {
					text: sTitle,
					level: "H1"
				}).addStyleClass("sapMDialogTitle");

				this._createHeader();
				this._header.addContentMiddle(this._headerTitle);
			}
			return this;
		};

		Dialog.prototype.setCustomHeader = function (oCustomHeader) {
			if (oCustomHeader) {
				oCustomHeader.addStyleClass("sapMDialogTitle");
			}
			this.setAggregation("customHeader", oCustomHeader);
		};

		Dialog.prototype.setState = function (sState) {
			var mFlags = {},
				$this = this.$(),
				sName;
			mFlags[sState] = true;

			this.setProperty("state", sState, true);

			for (sName in Dialog._mStateClasses) {
				$this.toggleClass(Dialog._mStateClasses[sName], !!mFlags[sName]);
			}
			this.setIcon(Dialog._mIcons[sState], true);
		};

		Dialog.prototype.setIcon = function (sIcon, bInternal) {
			if (!bInternal) {
				this._externalIcon = sIcon;
			} else {
				if (this._externalIcon) {
					sIcon = this._externalIcon;
				}
			}

			if (sIcon) {
				if (sIcon !== this.getIcon()) {
					if (this._iconImage) {
						this._iconImage.setSrc(sIcon);
					} else {
						this._iconImage = IconPool.createControlByURI({
							id: this.getId() + "-icon",
							src: sIcon,
							useIconTooltip: false
						}, sap.m.Image).addStyleClass("sapMDialogIcon");

						this._createHeader();
						this._header.insertAggregation("contentMiddle", this._iconImage, 0);
					}
				}
			} else {
				var sDialogState = this.getState();
				if (!bInternal && sDialogState !== ValueState.None) {
					if (this._iconImage) {
						this._iconImage.setSrc(Dialog._mIcons[sDialogState]);
					}
				} else {
					if (this._iconImage) {
						this._iconImage.destroy();
						this._iconImage = null;
					}
				}
			}

			this.setProperty("icon", sIcon, true);
			return this;
		};

		Dialog.prototype.setType = function (sType) {
			var sOldType = this.getType();
			if (sOldType === sType) {
				return this;
			}
			this._bMessageType = (sType === sap.m.DialogType.Message);
			return this.setProperty("type", sType, false);
		};

		Dialog.prototype.setStretch = function (bStretch) {
			this._bStretchSet = true;
			return this.setProperty("stretch", bStretch);
		};

		Dialog.prototype.setStretchOnPhone = function (bStretchOnPhone) {
			if (this._bStretchSet) {
				jQuery.sap.log.warning("sap.m.Dialog: stretchOnPhone property is deprecated. Setting stretchOnPhone property is ignored when there's already stretch property set.");
				return this;
			}
			this.setProperty("stretchOnPhone", bStretchOnPhone);
			return this.setProperty("stretch", bStretchOnPhone && sap.ui.Device.system.phone);
		};

		Dialog.prototype.setVerticalScrolling = function (bValue) {
			var oldValue = this.getVerticalScrolling();
			if (oldValue === bValue) {
				return this;
			}

			this.$().toggleClass("sapMDialogVerScrollDisabled", !bValue);
			this.setProperty("verticalScrolling", bValue);

			if (this._oScroller) {
				this._oScroller.setVertical(bValue);
			}

			return this;
		};

		Dialog.prototype.setHorizontalScrolling = function (bValue) {
			var oldValue = this.getHorizontalScrolling();
			if (oldValue === bValue) {
				return this;
			}

			this.$().toggleClass("sapMDialogHorScrollDisabled", !bValue);
			this.setProperty("horizontalScrolling", bValue);

			if (this._oScroller) {
				this._oScroller.setHorizontal(bValue);
			}

			return this;
		};

		Dialog.prototype.setInitialFocus = function (sInitialFocus) {
			// Skip the invalidation when sets the initial focus
			//
			// The initial focus takes effect after the next open of the dialog, when it's set
			// after the dialog is open, the current focus won't be changed
			// SelectDialog depends on this. If this has to be changed later, please make sure to
			// check the SelectDialog as well where setIntialFocus is called.
			return this.setAssociation("initialFocus", sInitialFocus, true);
		};
		/* =========================================================== */
		/*                           end: setters                      */
		/* =========================================================== */

		// Pass the setter of beginButton and endButton from dialog to internal header
		// Both of them are singular aggregation, only the following three methods need
		// to be overwritten
		Dialog.prototype.setAggregation = function (sAggregationName, oObject, bSuppressInvalidate, bPassBy) {
			if (!bPassBy && (sAggregationName === "beginButton" || sAggregationName === "endButton")) {
				return this._setButton(oObject, sAggregationName.substring(0, sAggregationName.indexOf("Button")));
			} else {
				return Control.prototype.setAggregation.apply(this, Array.prototype.slice.call(arguments, 0, 3));
			}
		};

		Dialog.prototype.getAggregation = function (sAggregationName, oDefaultForCreation, bPassBy) {
			if (!bPassBy && (sAggregationName === "beginButton" || sAggregationName === "endButton")) {
				return this._getButton(sAggregationName.substring(0, sAggregationName.indexOf("Button"))) || oDefaultForCreation || null;
			} else if (sAggregationName === "buttons") {
				return this._oToolbar ? this._oToolbar.getContent().slice(1) : [];
			} else {
				return Control.prototype.getAggregation.apply(this, Array.prototype.slice.call(arguments, 0, 2));
			}
		};

		Dialog.prototype.destroyAggregation = function (sAggregationName, bSuppressInvalidate) {
			if ((sAggregationName === "beginButton" || sAggregationName === "endButton")) {
				var sPos = sAggregationName.substring(0, sAggregationName.indexOf("Button")),
					sPos = this._firstLetterUpperCase(sPos),
					sButtonName;
				if (!sap.ui.Device.system.phone) {
					sButtonName = "_o" + sPos + "Button";
					if (this[sButtonName]) {
						this[sButtonName].destroy();
						this[sButtonName] = null;

						// invalidate and render if the toolbar is empty and should be not visible
						if (this._isToolbarEmpty()) {
							this.invalidate();
						}
					}
				} else {
					Control.prototype.destroyAggregation.apply(this, arguments);
				}
				return this;
			} else if (sAggregationName === "buttons") {
				var oToolbar = this._getToolbar();
				oToolbar.destroyContent();
				oToolbar.addContent(new ToolbarSpacer());
				this._restoreBeginAndEndButtons();
				return this;
			} else {
				return Control.prototype.destroyAggregation.apply(this, arguments);
			}
		};

		Dialog.prototype.addAggregation = function (sAggregationName, oObject, bSuppressInvalidate) {
			if (sAggregationName === "buttons") {
				var oToolbar = this._getToolbar();
				this._removeBeginAndEndButtons();
				if (this._aButtons.indexOf(oObject) === -1) {
					this._aButtons.push(oObject);
				}
				oToolbar.addContent(oObject);
				return this;
			} else {
				return Control.prototype.addAggregation.apply(this, arguments);
			}
		};

		Dialog.prototype.indexOfAggregation = function (sAggregationName, oObject) {
			if (sAggregationName === "buttons") {
				var oToolbar = this._getToolbar();
				var iIndex = oToolbar.indexOfContent(oObject);
				if (iIndex !== -1) {
					iIndex = iIndex - 1;
				}
				return iIndex;
			} else {
				return Control.prototype.indexOfAggregation.apply(this, arguments);
			}
		};

		Dialog.prototype.insertAggregation = function (sAggregationName, oObject, iIndex, bSuppressInvalidate) {
			if (sAggregationName === "buttons") {
				this._removeBeginAndEndButtons();
				if (this._aButtons.indexOf(oObject) === -1) {
					this._aButtons.push(oObject);
				}
				var oToolbar = this._getToolbar();
				oToolbar.insertContent(oObject, iIndex + 1);
				return this;
			} else {
				return Control.prototype.insertAggregation.apply(this, arguments);
			}
		};

		Dialog.prototype.removeAggregation = function (sAggregationName, vObject, bSuppressInvalidate) {
			if (sAggregationName === "buttons") {
				var oToolbar = this._getToolbar(),
					oButton;
				if (typeof (vObject) == "number") {
					this._aButtons.splice(vObject, 1);
					oButton = oToolbar.getContent(vObject + 1);
				} else {
					var iIndex = this._aButtons.indexOf(vObject);
					if (iIndex !== -1) {
						this._aButtons.splice(iIndex, 1);
					}
					oButton = vObject;
				}
				oButton = oToolbar.removeContent(oButton);
				this._restoreBeginAndEndButtons();

				return oButton;
			} else {
				return Control.prototype.removeAggregation.apply(this, arguments);
			}
		};

		Dialog.prototype.removeAllAggregation = function (sAggregationName, bSuppressInvalidate) {
			if (sAggregationName === "buttons") {
				this._aButtons = [];

				var oToolbar = this._getToolbar();
				var aChildren = oToolbar.removeAllContent();
				oToolbar.addContent(new ToolbarSpacer());
				this._restoreBeginAndEndButtons();

				return aChildren.splice(0, 1);
			} else {
				return Control.prototype.removeAllAggregation.apply(this, arguments);
			}
		};

		Dialog.prototype.forceInvalidate = Control.prototype.invalidate;

		// stop propagating the invalidate to static UIArea before dialog is opened.
		// otherwise the open animation can't be seen
		// dialog will be rendered directly to static ui area when the open method is called.
		Dialog.prototype.invalidate = function (oOrigin) {
			if (this.isOpen()) {
				this.forceInvalidate(oOrigin);
			}
		};

		/* =========================================================== */
		/*                     Resize & Drag logic                     */
		/* =========================================================== */
		/**
		 *
		 * @param {Object} eventTarget
		 * @returns {boolean}
		 */
		function isHeaderClicked(eventTarget) {
			var $target = jQuery(eventTarget);
			var oControl = $target.control(0);
			if (!oControl || oControl.getMetadata().getInterfaces().indexOf("sap.m.IBar") > -1) {
				return true;
			}

			return $target.hasClass('sapMDialogTitle');
		}

		if (sap.ui.Device.system.desktop) {
			/**
			 *
			 * @param {Object} e
			 */
			Dialog.prototype.ondblclick = function (e) {
				if (isHeaderClicked(e.target)) {
					this._bDisableRepositioning = false;
					this._reposition();
				}
			};

			/**
			 *
			 * @param {Object} e
			 */
			Dialog.prototype.onmousedown = function (e) {
				if (e.which === 3) {
					return; // on right click don't reposition the dialog
				}
				if (this.getStretch() || (!this.getDraggable() && !this.getResizable())) {
					return;
				}

				var timeout;
				var that = this;
				var $w = jQuery(document);
				var $target = jQuery(e.target);
				var bResize = $target.hasClass('sapMDialogResizeHandler') && this.getResizable();
				var fnMouseMoveHandler = function (action) {
					timeout = timeout ? clearTimeout(timeout) : setTimeout(function () {
						action();
					}, 0);
				};
				var initial = {
					x: e.pageX,
					y: e.pageY,
					width: that._$dialog.width(),
					height: that._$dialog.height(),
					offset: {
						//use e.originalEvent.layerX/Y for Firefox
						x: e.offsetX ? e.offsetX : e.originalEvent.layerX,
						y: e.offsetY ? e.offsetY : e.originalEvent.layerY
					},
					position: {
						x: that._$dialog.offset().left,
						y: that._$dialog.offset().top
					}
				};

				if (isHeaderClicked(e.target) && this.getDraggable()) {
					$w.on("mousemove.sapMDialog", function (e) {
						fnMouseMoveHandler(function () {
							that._bDisableRepositioning = true;

							that._$dialog.css({
								left: e.pageX - initial.offset.x,
								top: e.pageY - initial.offset.y
							});
						});
					});
				} else if (bResize) {
					that._$dialog.addClass('sapMDialogResizing');
					var isInRTLMode = sap.ui.getCore().getConfiguration().getRTL();
					var styles = {};
					var minWidth = parseInt(that._$dialog.css('min-width'), 10);
					var maxLeftOffset = initial.x + initial.width - minWidth;

					$w.on("mousemove.sapMDialog", function (e) {
						fnMouseMoveHandler(function () {
							that._bDisableRepositioning = true;

							that._oManuallySetSize = {
								width: initial.width + e.pageX - initial.x,
								height: initial.height + e.pageY - initial.y
							};

							if (isInRTLMode) {
								styles.left = Math.min(Math.max(e.pageX, 0), maxLeftOffset);
								that._oManuallySetSize.width = initial.width + initial.x - Math.max(e.pageX, 0);
							}

							styles.width = that._oManuallySetSize.width;
							styles.height = that._oManuallySetSize.height;

							that._$dialog.css(styles);
						});
					});
				} else {
					return;
				}

				$w.on("mouseup.sapMDialog", function () {
					$w.off("mouseup.sapMDialog, mousemove.sapMDialog");

					if (bResize) {
						that._$dialog.removeClass('sapMDialogResizing');
					}
				});

				e.preventDefault();
				e.stopPropagation();
			};
		}

		return Dialog;

	}, /* bExport= */ true);
