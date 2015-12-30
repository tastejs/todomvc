/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.ux3.ToolPopup.
sap.ui.define(['jquery.sap.global', 'sap/ui/core/Control', 'sap/ui/core/IconPool', 'sap/ui/core/Popup', 'sap/ui/core/theming/Parameters', './library'],
	function (jQuery, Control, IconPool, Popup, Parameters, library) {
		"use strict";


		/**
		 * Constructor for a new ToolPopup.
		 *
		 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
		 * @param {object} [mSettings] Initial settings for the new control
		 *
		 * @class
		 * A popup which the user can open from the Shell's tool pane. Generally, the starting point would be an icon.
		 * For this pop up, buttons can be defined with any text; therefore, it has the same purpose
		 * and similar look like any common dialog box.
		 * A ToolPopup can have any content. Depending on the application type and design, the structure
		 * of the texts and input fields can be for example form-like.
		 * @extends sap.ui.core.Control
		 * @implements sap.ui.core.PopupInterface
		 *
		 * @namespace
		 * @author SAP SE
		 * @version 1.32.9
		 *
		 * @constructor
		 * @public
		 * @alias sap.ui.ux3.ToolPopup
		 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
		 */
		var ToolPopup = Control.extend("sap.ui.ux3.ToolPopup", /** @lends sap.ui.ux3.ToolPopup.prototype */ {
			metadata: {

				interfaces: [
					"sap.ui.core.PopupInterface"
				],
				library: "sap.ui.ux3",
				properties: {

					/**
					 * Determines the title displayed in the pop up window
					 */
					title: {type: "string", group: "Misc", defaultValue: null},

					/**
					 * This property is relevant for Shell use:
					 * The URL to the icon displayed in the tool area which is used to open the ToolPopup.
					 * The recommended size is 32x32px, including some transparent border. Therefore,
					 * the content will cover about 20x20px.
					 */
					icon: {type: "sap.ui.core.URI", group: "Misc", defaultValue: null},

					/**
					 * This property is relevant for Shell use:
					 * The URL to the icon in hover state, displayed in the tool area which is used to open the popup.
					 */
					iconHover: {type: "sap.ui.core.URI", group: "Misc", defaultValue: null},

					/**
					 * This property is relevant for Shell use:
					 * The URL to the icon in selected state displayed in the tool area which is used to open the popup.
					 * If no selected icon is given, the hover icon is used.
					 */
					iconSelected: {type: "sap.ui.core.URI", group: "Misc", defaultValue: null},

					/**
					 * Specifies whether the popup is modal and blocks any user-interaction with controls in the background.
					 * Changing this property while the ToolPopup is open will not have any effect.
					 * Please don't use "modal" and "autoclose" at the same time. In this case a warning will
					 * be prompted to the console and "autoclose" won't be used.
					 */
					modal: {type: "boolean", group: "Behavior", defaultValue: false},

					/**
					 * Specifies whether the ToolPopup has a dark or bright background. If set to true
					 * the background and borders will be dark. If false they will be bright.
					 * This property only has an effect for the GoldReflection-theme.
					 * @since 1.11.1
					 */
					inverted: {type: "boolean", group: "Misc", defaultValue: true},

					/**
					 * Determines whether the ToolPopup will auto close when it loses focus.
					 * If the user e.g. clicks outside of the ToolPopup it will be closed.
					 * Please don't use "modal" and "autoclose" at the same time.
					 * In this case a warning will be prompted to the console and "autoclose" won't be used.
					 * @since 1.13.2
					 */
					autoClose: {type: "boolean", group: "Misc", defaultValue: false},

					/**
					 * Forces a maximum height of the ToolPopup in pixels. If the ToolPopup content
					 * is higher than the ToolPopup, the content will be scrollable.
					 * @since 1.13.2
					 */
					maxHeight: {type: "sap.ui.core.CSSSize", group: "Misc", defaultValue: null},

					/**
					 * Forces a maximum width of the ToolPopup in pixels.
					 * @since 1.15.0
					 */
					maxWidth: {type: "sap.ui.core.CSSSize", group: "Misc", defaultValue: null},

					/**
					 * Time in milliseconds for the open animation.
					 * @since 1.19.0
					 */
					openDuration: {type: "int", group: "Misc", defaultValue: 400},

					/**
					 * Time in milliseconds for the close animation.
					 * @since 1.19.0
					 */
					closeDuration: {type: "int", group: "Misc", defaultValue: 400}
				},
				defaultAggregation: "content",
				aggregations: {

					/**
					 * Defines the buttons to appear in the popup
					 */
					buttons: {type: "sap.ui.core.Control", multiple: true, singularName: "button"},

					/**
					 * Defines the content of the popup
					 */
					content: {type: "sap.ui.core.Control", multiple: true, singularName: "content"}
				},
				associations: {

					/**
					 * Defines the control that will get the focus when the ToolPopup is opened.
					 */
					initialFocus: {type: "sap.ui.core.Control", multiple: false},

					/**
					 * This property is relevant for stand-alone use:
					 * This association needs to be set if the ToolPopup should not be opened by/with
					 * the Shell. This association contains the instance of the control that
					 * assigns the ToolPopup's position.
					 */
					opener: {type: "sap.ui.core.Control", multiple: false},

					/**
					 * Defines one of the buttons that have been provided via button aggregation to be
					 * the default button. This default button is initially selected, if no control
					 * is set via the initialFocus association explicitly. The default button is activated
					 * when Enter is pressed in the context of the dialog and when the currently selected element
					 * does not handle the Enter event itself.
					 * @since 1.20.1
					 */
					defaultButton: {type: "sap.ui.core.Control", multiple: false}
				},
				events: {

					/**
					 * Event is fired when the popup opens
					 */
					open: {},

					/**
					 * Event is fired when the popup closes because the user pressed Escape or the ToolPopup
					 * Button in the Shell. This is called before the closing animation.
					 */
					close: {allowPreventDefault: true},

					/**
					 * Event is fired whenever the user clicks the Enter or the Enter key inside the pop up
					 */
					enter: {
						parameters: {

							/**
							 * The onsapenter event, received by the pop up
							 */
							originalEvent: {type: "object"},

							/**
							 * The control that was focused when the user pressed the Enter key (may be null)
							 */
							originalSrcControl: {type: "sap.ui.core.Control"}
						}
					},

					/**
					 * Event is fired when one of the icon properties is modified (Note: The icon is not
					 * rendered by the ToolPopup).
					 * To be used by other controls which want to update the icon in their UI.
					 */
					iconChanged: {},

					/**
					 * This event is fired after the ToolPopup has finished its closing animation.
					 * It is called for EVERY close, regardless of whether the user has triggered the
					 * close or whether the ToolPopup was closed via API call.
					 */
					closed: {},

					/**
					 * Event is being fired after the ToolPopup has been opened.
					 * @since 1.19.0
					 */
					opened: {}
				}
			}
		});

		// regex rules for arrows corresponding to the given 'my' and 'at' parameters
		// these regexes also consider the new offset style of jQueryUI-position from version 1.10.x
		// from version 1.10.x the offset is used right within the 'my' parameter
		ToolPopup.ARROW_LEFT = new RegExp(/my:(left|begin)([-+]\d*\%?)?\|[a-z]+([-+]\d*\%?)? at:(right|end)\|[a-z]+/);
		ToolPopup.ARROW_RIGHT = new RegExp(/my:(right|end)([-+]\d*\%?)?\|[a-z]+([-+]\d*\%?)? at:(left|begin)\|[a-z]+/);
		ToolPopup.ARROW_UP = new RegExp(/my:[a-z]+([-+]\d*\%?)?\|top([-+]\d*\%?)? at:[a-z]+\|bottom/);
		ToolPopup.ARROW_DOWN = new RegExp(/my:[a-z]+([-+]\d*\%?)?\|bottom([-+]\d*\%?)? at:[a-z]+\|top/);

		(function () {
			ToolPopup.prototype.init = function () {
				this.oPopup = null;
				this._bPositionSet = false;

				this._mParameters = {};
				this._mParameters.that = this;
				this._mParameters.firstFocusable = this.getId() + "-firstFocusable";
				this._mParameters.lastFocusable = this.getId() + "-lastFocusable";

				this._bFocusSet = false;
				this._proxyOpened = jQuery.proxy(fnPopupOpened, this);
				this._proxyClosed = jQuery.proxy(fnOnClosed, this);
				this._proxyFixSize = jQuery.proxy(fnFixSize, this);
				this._proxyOnResize = jQuery.proxy(fnOnResize, this);

				fnSetArrowDimensions(this);
			};
			ToolPopup.prototype.exit = function () {
				if (this.oPopup) {
					this.oPopup.detachOpened(this._proxyOpened);
					this.oPopup.detachClosed(this._proxyClosed);
					this.oPopup.destroy();
					delete this.oPopup;
				}
				delete this._bPositionSet;

				delete this._mParameters;

				delete this._bFocusSet;
				delete this._bPreventRestoreFocus;
				delete this._proxyOpened;
				delete this._proxyClosed;

				delete this._bRTL;
				delete this._sArrowDir;
				delete this._oArrowIcon;
				delete this._bThemeInverted;

				delete this._sInitialFocusId;
			};

			/**
			 * Checks if the ToolPopup already has a tabbable element.
			 * If not, it's checked whether the fake-element should be used or if there is an element that could be focused instead.
			 *
			 * @param {sap.ui.ux3.ToolPopup} that to get/set instance values
			 * @returns {string} _sInitialFocusId that has been determined here
			 * @private
			 */
			var _fnGetInitialFocus = function (that) {
				jQuery.sap.assert(!!that, "No ToolPopup instance given for _fnGetInitialFocus");

				// if there is an initial focus it was already set to the Popup onBeforeRendering
				if (!that._bFocusSet) {
					_fnGetNewFocusElement(that);
				} else {
					that._sInitialFocusId = that.oPopup._sInitialFocusId;
				}

				return that._sInitialFocusId;
			};

			/**
			 * Determines the new element which will gain the focus.
			 *
			 * @param {sap.ui.ux3.ToolPopup} that to get/set instance values
			 * @private
             */
			var _fnGetNewFocusElement = function(that) {
				var oElement;
                var oFocusControl;
				var defaultFocusableElements = [that._mParameters.firstFocusable, that._mParameters.lastFocusable];
                var aTabbables = jQuery(":sapTabbable", that.$()).get();

				// search the first tabbable element
				for (var i = 0; i < aTabbables.length; i++) {
					if (defaultFocusableElements.indexOf(aTabbables[i].id) === -1) {
						oElement = aTabbables[i];
						break;
					}
				}

				// If a tabbable element is part of a control, focus the control instead
				oFocusControl = jQuery(oElement).control();
				if (oFocusControl[0]) {
					var oFocusDomRef = oFocusControl[0].getFocusDomRef();
					oElement = oFocusDomRef || oElement;
				} else {
					// if there is no tabbable element in the content use the first fake
					// element to set the focus to the toolpopup
					oElement = jQuery.sap.domById(defaultFocusableElements[0]);
				}

				// oElement might not be available if this function is called during destroy
				if (oElement) {
					jQuery.sap.focus(oElement);
					that._sInitialFocusId = oElement.id;
				}
			};

			/**
			 * Returns a DOM element by its Id.
			 *
			 * @param {Number} id
			 * @returns {Element|sap.ui.core.Element|Object|sap.ui.core.tmpl.Template}
             * @private
             */
			function _fnGetFocusElementById(id) {
				var domElement = sap.ui.getCore().byId(id);
				return domElement;
			}

			/**
			 * Determines the focus DOM reference.
			 *
			 * @returns {string}
			 * @private
			 */
			ToolPopup.prototype.getFocusDomRef = function () {
				var domRefId;
				var focusElement = _fnGetFocusElementById(this._sInitialFocusId);

				// always determine the best initial focus stuff because content might
				// have changed in the mean time

				if (!focusElement){
					this._bFocusSet = false;
					domRefId = _fnGetInitialFocus(this);
					focusElement = _fnGetFocusElementById(domRefId);
				}

				return focusElement ? focusElement.getDomRef() : this.getDomRef();
			};

			/**
			 * Handler for focus, adapted for this control,
			 * @param {jQuery.EventObject} oEvent
			 *
			 * @private
			 */
			ToolPopup.prototype.onfocusin = function (oEvent) {
				this._mParameters.event = oEvent;
				this._mParameters.$FocusablesContent = jQuery(":sapTabbable", this.$("content"));
				this._mParameters.$FocusablesFooter = jQuery(":sapTabbable", this.$("buttons"));

				this.oPopup.focusTabChain(this._mParameters);
			};

			/**
			 * This function fixes the height of the ToolPopup if the content is too large.
			 * So the height will be set to the possible maximum and a scrollbar is provided.
			 * Additionally the width of the ToolPopup is fixed as well since the scrollbar reduces
			 * the possible space for the content.
			 *
			 * @private
			 */
			var fnFixSize = function () {
				var $This = this.$();
				var iValue = 0;

				var sMaxHeight = this.getMaxHeight();
				var iMaxHeight = sMaxHeight ? parseInt(sMaxHeight, 10) : 0;

				/*
				 * Fix the width (if necessary)
				 */
				var sMaxWidth = this.getMaxWidth();
				if (sMaxWidth) {
					var iMaxWidth = parseInt(sMaxWidth, 10);

					var sBorderLeft = $This.css("border-left-width");
					var iBorderLeft = parseInt(sBorderLeft, 10);
					var sBorderRight = $This.css("border-right-width");
					var iBorderRight = parseInt(sBorderRight, 10);

					var sPaddingLeft = $This.css("padding-left");
					var iPaddingLeft = parseInt(sPaddingLeft, 10);
					var sPaddingRight = $This.css("padding-right");
					var iPaddingRight = parseInt(sPaddingRight, 10);

					iMaxWidth -= iBorderLeft + iPaddingLeft + iPaddingRight + iBorderRight;
					$This.css("max-width", iMaxWidth + "px");
				} else {
					$This.css("max-width", "");
				}

				/*
				 * Fix the height
				 */
				// get all paddings
				var sPaddingTop = $This.css("padding-top");
				var iPaddingTop = parseInt(sPaddingTop, 10);
				var sPaddingBottom = $This.css("padding-bottom");
				var iPaddingBottom = parseInt(sPaddingBottom, 10);

				// get all border widths
				var sBorderTop = $This.css("border-top-width");
				var iBorderTop = parseInt(sBorderTop, 10);
				var sBorderBottom = $This.css("border-bottom-width");
				var iBorderBottom = parseInt(sBorderBottom, 10);

				var iPaddings = iPaddingTop + iPaddingBottom + iBorderTop + iBorderBottom;

				// determine the corresponding scrollTop to calculate the proper bottom end of the ToolPopup
				var iScrollTop = jQuery(document).scrollTop();
				var oThisRect = $This.rect();
				var iBottomEnd = oThisRect.top - iScrollTop + $This.outerHeight(true);

				// only use this mechanism when there is NO maxHeight set
				var iWinHeight = jQuery(window).height();
				var bTooHigh = (iBottomEnd > iWinHeight) && (iMaxHeight === 0);
				var iYOffset = 0;

				// check if an offset forces the ToolPopup out of the window
				// and below the opener
				if (bTooHigh) {
					var $Opener = jQuery.sap.byId(this.getOpener());
					var oOpenerRect = $Opener.rect();
					var iOpenerBottom = oOpenerRect.top - iScrollTop + $Opener.outerHeight(true);

					// if bottom of the ToolPopup is below the opener and there is a possible offset
					var aOffset = this.oPopup._getPositionOffset();
					if (iBottomEnd > iOpenerBottom && aOffset.length > 0) {
						// check if the offset is responsible for pushing the ToolPopup below the opener
						// and therefore out of the window
						iYOffset = Math.abs(parseInt(aOffset[1], 10));

						// this check inverts the variable to prevent any resize of the ToolPopup since it
						// is pushed out of the window because of the offset
						if ((iBottomEnd - iYOffset) < iWinHeight) {
							bTooHigh = false;
							var sMessage = "Offset of " + iYOffset + " pushes ToolPopup out of the window";
							jQuery.sap.log.warning(sMessage, "", "sap.ui.ux3.ToolPopup");
						}
					}

					iMaxHeight = iMaxHeight ? iMaxHeight : iWinHeight - oThisRect.top;
				}

				$This.toggleClass("sapUiUx3TPLargeContent", bTooHigh);

				if (iMaxHeight || bTooHigh) {
					$This.css("max-height", iMaxHeight + "px");

					var $Title = this.$("title");
					var $TitleSep = this.$("title-separator");

					var $Buttons = this.$("buttons");
					var $ButtonsSep = this.$("buttons-separator");

					// Calculate the correct start value. Either simply take the set maxHeight
					// or calculate the value between Popup.top and window end (incl. padding and offset)
					iValue = iMaxHeight > 0 ? iMaxHeight : iWinHeight - oThisRect.top - iPaddingBottom - iYOffset;

					// subtract all paddings and border-widths
					iValue -= iPaddings;

					// subtracting all corresponding values from top to down
					iValue -= $Title.outerHeight(true);
					iValue -= $TitleSep.outerHeight(true); // including margin

					// height of content needn't to be subtracted

					iValue -= $ButtonsSep.outerHeight(true); // including margin
					iValue -= $Buttons.length > 0 ? $Buttons.outerHeight(true) : 0;

					// if the height has to be corrected
					iValue = parseInt(iValue, 10);

					var $Content = this.$("content");
					$Content.css("max-height", iValue + "px");

					$Content.toggleClass("sapUiUx3TPLargeContent", true);
				}

				fnSetArrow(this);
			};

			/**
			 * Function is called via 'jQuery.proxy()' when the ToolPopup has been opened
			 * including the fade-in-animation of the Popup
			 *
			 * @private
			 */
			var fnPopupOpened = function () {
				this._proxyFixSize();

				if (!this._sInitialFocusId) {
					var sInitFocusId = _fnGetInitialFocus(this);

					// Compare the initial focus id with the current focus that is
					// stored in the FocusHandler in the core.
					// If the initial focus was set properly already by the Popup
					// don't focus twice. Because Internet Explorer will be confused with
					// two focusin and focusout events
					if (sInitFocusId !== sap.ui.getCore().getCurrentFocusedControlId()) {
						var oControl = jQuery.sap.byId(sInitFocusId);
						oControl.focus();
					}
				}

				if (!this._sResizeID) {
					// register the ResizeHandler for the content of the toolPopup and not the whole toolPopup itself.
					// In this way when resized the toolPopup does not change its height indefinitely.
					this._sResizeID = sap.ui.core.ResizeHandler.register(this.$('content')[0], this._proxyOnResize);
				}

				// forward the Popup's opened event accordingly
				// was added in "1.19.0" as a fix for a CSN and was downported to "1.18.2" and "1.16.6"
				this.fireOpened();
			};


			/**
			 * Indicates whether the pop up is currently open
			 *
			 * @returns {boolean}
			 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
			 * @public
			 */
			ToolPopup.prototype.isOpen = function () {
				return this.oPopup && (this.oPopup.getOpenState() == "OPENING" || this.oPopup.getOpenState() == "OPEN");
			};

			/**
			 * Indicates whether the control will be closed
			 *
			 * @returns {boolean}
			 * @private
			 */
			ToolPopup.prototype.willBeClosed = function () {
				var eState = this.oPopup && this.oPopup.getOpenState();
				return eState !== sap.ui.core.OpenState.OPENING && eState !== sap.ui.core.OpenState.OPEN;
			};

			// first variant of the documentation: to be parsed by the metamodel derivation
			/**
			 * Opens the ToolPopup.
			 * It is checked which control wants to open the ToolPopup. The Shell was previously
			 * set as parent so the corresponding parent element is used to set the correct position of the ToolPopup.
			 * If another control (i.e. a button) opens the ToolPopup, the control must be previously
			 * set as <code>opener</code> via <code>setOpener</code> to the ToolPopup.
			 * Corresponding to this opener the position of the ToolPopup will be set.
			 * It's also possible to set the position above, below or left from the opener.
			 * This can be done via the possible parameters <code>my</code> and <code>at</code>.
			 * These parameters refers to work the same way as they do of sap.ui.core.Popup.open.
			 *
			 * @param {sap.ui.core.Popup.Dock} [my=sap.ui.core.Popup.Dock.CenterCenter] The ToolPopup's content
			 * reference position for docking
			 * @param {sap.ui.core.Popup.Dock} [at=sap.ui.core.Popup.Dock.CenterCenter] The "of" element's
			 * reference point for docking to
			 * @returns {sap.ui.ux3.ToolPopup}
			 * @public
			 */
			ToolPopup.prototype.open = function (my, at) {
				this._my = my;
				this._at = at;
				this._sArrowDir = fnGetArrowDirection(this);
				var $OpenerRef = null;
				this.sOffset = "";
				fnUpdateThemeInverted(this);

				// if the popup position has not been (re-)initialized since the last time this was opened,
				// try to apply the default position
				if (!this._bPositionSet) {
					var iOffsetX = 0;
					var iOffsetY = 0;

					// any further validation of the values is done within the Popup
					if (!this._my) {
						this._my = Popup.Dock.BeginTop;
					}
					if (!this._at) {
						this._at = Popup.Dock.EndTop;
					}

					$OpenerRef = jQuery.sap.domById(this.getOpener());
					if ($OpenerRef) {
						switch (this._sArrowDir) {
							case "Up":
								iOffsetX = 0;
								iOffsetY = this.iArrowWidth;
								break;

							case "Down":
								iOffsetX = 0;
								iOffsetY = -this.iArrowWidth;
								break;

							case "Right":
								iOffsetX = -this.iArrowWidth;
								break;

							default:
							case "Left":
								iOffsetX = this.iArrowWidth;
								break;
						}

						iOffsetX = parseInt(iOffsetX, 10);
						iOffsetY = parseInt(iOffsetY, 10);
						this.sOffset = "" + iOffsetX + " " + iOffsetY;
						// my, at, of, offset, collision /*none*/
						this.setPosition(this._my, this._at, $OpenerRef, this.sOffset, "none");
					} else {
						this.setPosition(Popup.Dock.BeginTop, Popup.Dock.BeginTop, window, "0 0", "fit");
						jQuery.sap.log.warning("No opener set. Using a default position for Popup", "", "sap.ui.ux3.ToolPopup");
					}
					/* value is set in 'setPosition'. This value shows if the position was previously set manually =>
					 * in this case it was definitely not set manually
					 */
					this._bPositionSet = false;
				}
				// create popup if required
				this._ensurePopup();

				var bAutoClose = this.getAutoClose();
				var bModal = this.getModal();
				if (bAutoClose && bModal) {
					jQuery.sap.log.warning("A modal & autoclose ToolPopup will not work properly. Therefore 'autoclose' will be deactived!");
					bAutoClose = false;
				}
				this.oPopup.setAutoClose(bAutoClose);
				this.oPopup.setModal(bModal);

				// Save current focused element to restore the focus after closing the dialog
				this._oPreviousFocus = Popup.getCurrentFocusInfo();
				// open popup
				this.fireOpen();

				// the opener is needed for the intelligent arrow positioning
				fnCheckOpener(this);

				// function(iDuration, my, at, of, offset, collision /*empty to avoid any override*/, followOf /*true*/)
				this.oPopup.open(this.getOpenDuration(), this._my, this._at, $OpenerRef, this.sOffset, "", true);
				fnSetArrow(this);

				return this;
			};

			/**
			 * Checks if an opener was set. If not, this functions tries to get the opener from the Popup.
			 *
			 * @private
			 */
			var fnCheckOpener = function (oThis) {
				if (!oThis.getOpener()) {
					var sId = "";
					if (oThis.oPopup) {
						if (oThis.oPopup._oPosition.of instanceof sap.ui.core.Element) {
							sId = oThis.oPopup._oPosition.of.getId();
						} else {
							if (oThis.oPopup._oPosition.of.length > 0) {
								sId = oThis.oPopup._oPosition.of[0].id;
							} else {
								sId = oThis.oPopup._oPosition.of.id;
							}
						}
					}

					if (sId !== "") {
						oThis.setAssociation("opener", sId, true);
					} else {
						jQuery.sap.log.error("Neither an opener was set properly nor a corresponding one can be distinguished", "", "sap.ui.ux3.ToolPopup");
					}
				}
			};

			/**
			 * Sets the arrow dimensions.
			 *
			 * @param {sap.ui.ux3.ToolPopup} oThis The Toolpopup instnace
			 * @private
			 */
			var fnSetArrowDimensions = function (oThis) {
				var sParam = "sapUiUx3ToolPopupArrowWidth";
				oThis.sArrowWidth = Parameters.get(sParam);
				oThis.iArrowWidth = parseInt(oThis.sArrowWidth, 10);

				sParam = "sapUiUx3ToolPopupArrowHeight";
				oThis.sArrowHeight = Parameters.get(sParam);
				oThis.iArrowHeight = parseInt(oThis.sArrowHeight, 10);

				sParam = "sapUiUx3ToolPopupArrowRightMarginCorrection";
				oThis.sArrowPadding = Parameters.get(sParam);
				oThis.iArrowPadding = parseInt(oThis.sArrowPadding, 10);

				sParam = "sapUiUx3ToolPopupArrowRightMarginCorrectionInverted";
				oThis.sArrowPaddingInverted = Parameters.get(sParam);
				oThis.iArrowPaddingInverted = parseInt(oThis.sArrowPaddingInverted, 10);
			};

			/**
			 * Calculates the desired arrow direction related to the set docking.
			 * This only works when "my" and "at" both use the jQuery-based docking which means they are strings like "begin top".
			 *
			 * @param {sap.ui.ux3.ToolPopup} oThis the instance of the ToolPopup
			 * @returns {string} with arrow's direction
			 * @private
			 */
			var fnGetArrowDirection = function (oThis) {

				// do not mirror the arrow direction here in RTL mode, because otherwise the offset is calculated wrong
				// (Because the offset mirroring happens inside popup)
				// the arrow is later mirrored at the output...

				// this is the default case if no match was found
				var sDirection = "Left";

				// if 'my' is not set check if it was previously set via 'setPosition'
				var my = oThis._my;
				var at = oThis._at;
				if (!my && oThis.oPopup) {
					my = oThis.oPopup._oPosition.my;
				}
				if (!at && oThis.oPopup) {
					at = oThis.oPopup._oPosition.at;
				}

				oThis._bHorizontalArrow = false;

				if (my && at) {
					var aMy = my.split(" ");
					var aAt = at.split(" ");
					// create a rule like "my:top|left at:left|top"
					var sRule = "my:" + aMy[0] + "|" + aMy[1];
					sRule += " at:" + aAt[0] + "|" + aAt[1];

					if (ToolPopup.ARROW_LEFT.exec(sRule)) {
						oThis._bHorizontalArrow = true;
						sDirection = "Left";
					} else if (ToolPopup.ARROW_RIGHT.exec(sRule)) {
						oThis._bHorizontalArrow = true;
						sDirection = "Right";
					} else if (ToolPopup.ARROW_UP.exec(sRule)) {
						sDirection = "Up";
					} else if (ToolPopup.ARROW_DOWN.exec(sRule)) {
						sDirection = "Down";
					}

					if (oThis.getDomRef() && oThis.isOpen()) {
						var $This = oThis.$();
						var oPopRect = $This.rect();
						var $Opener = jQuery.sap.byId(oThis.getOpener());
						var oOpenerRect = $Opener.rect();

						if (oOpenerRect) {
							// check if the ToolPopup was positioned at another side relative to the opener due to any collision.
							if (oThis._bHorizontalArrow) {
								// left/right arrow
								var iPopRight = oPopRect.left + $This.outerWidth(true) + oThis.iArrowWidth;
								var iOpenerRight = oOpenerRect.left + $Opener.outerWidth(true);

								if (iPopRight <= iOpenerRight) {
									sDirection = "Right";

								} else {
									sDirection = "Left";
								}
							} else {
								// up/down arrow
								var iPopBottom = oPopRect.top + $This.outerHeight(true) + oThis.iArrowWidth;
								var iOpenerBottom = oOpenerRect.top + $Opener.outerHeight(true);

								if (iPopBottom <= iOpenerBottom) {
									sDirection = "Down";
								} else {
									sDirection = "Up";
								}
							}
						}
					}
				}

				return sDirection;
			};

			/**
			 * Calculates the desired arrow position related to the set docking and to the size of the popup.
			 * This only works when "my" and "at" both use the jQuery-based docking which means they
			 * are strings like "begin top".
			 * If there is no opener set properly an error is logged into the console and there will
			 * be no arrow for the ToolPopup.
			 *
			 * @param {sap.ui.ux3.ToolPopup} oThis
			 * @private
			 */
			var fnSetArrow = function (oThis) {
				if (!oThis.getDomRef()) {
					return;
				}

				var sKey = "";
				var iVal = 0;
				var iZero = 0; // this is the 0 of the  relative position between ToolPopup and Opener
				var iHalfArrow = oThis.iArrowHeight / 2;

				oThis._sArrowDir = fnGetArrowDirection(oThis);
				var sArrowDir = oThis._sArrowDir;
				if (oThis._bRTL) {
					// in RTL mode arrow must be mirrowed here
					if (oThis._sArrowDir === "Right") {
						sArrowDir = "Left";
					} else if (oThis._sArrowDir === "Left") {
						sArrowDir = "Right";
					}
				}

				var oPopRect = oThis.$().rect();
				var oOpenerRect = jQuery.sap.byId(oThis.getOpener()).rect();
				if (!oOpenerRect) {
					// if a proper opener isn't available
					jQuery.sap.log.warning("Opener wasn't set properly. Therefore arrow will be at a default position", "", "sap.ui.ux3.ToolPopup");
				}
				var $Arrow = oThis.$("arrow");

				// get the corresponding my-property
				if (!oThis._my && oThis.oPopup) {
					oThis._my = oThis.oPopup._oPosition.my;
				}

				// calculate the horizontal/vertical value of the arrow
				if (oThis._bHorizontalArrow) {
					// left or right arrow
					sKey = "top";

					if (oOpenerRect) {
						iZero = oOpenerRect.top - oPopRect.top;

						iVal = Math.round(iZero + oOpenerRect.height / 2);

						// if the position would exceed the ToolPopup's height
						iVal = iVal + iHalfArrow > oPopRect.height ? iVal - oThis.iArrowHeight : iVal;
					}
				} else {
					// up/down arrow
					sKey = "left";

					if (oOpenerRect) {
						iZero = oOpenerRect.left - oPopRect.left;
						if (iZero < 0) {
							iZero = oPopRect.width - oThis.iArrowHeight;
						}

						iVal = Math.round(iZero + oOpenerRect.width / 2);
						// if the position would exceed the ToolPopup's width
						iVal = iVal + iHalfArrow > oPopRect.width ? iVal - oThis.iArrowHeight : iVal;
					}
				}

				if (oOpenerRect) {
					iVal -= iHalfArrow;
				} else {
					iVal = oThis.iArrowHeight;
				}


				// set the corresponding classes
				var sClassAttr = "";
				if ($Arrow.hasClass("sapUiUx3TPNewArrow")) {
					sClassAttr = "sapUiUx3TPNewArrow sapUiUx3TPNewArrow";
				} else {
					sClassAttr = oThis.isInverted() ? "sapUiUx3TPArrow sapUiTPInverted sapUiUx3TPArrow" : "sapUiUx3TPArrow sapUiUx3TPArrow";
				}
				$Arrow.attr("class", sClassAttr + sArrowDir);

				if (sArrowDir === "Right") {
					var iWidth = oPopRect.width;
					// if the ToolPopup is invertable and it is being inverted use another
					// value since in such a case the padding is different for the arrow
					if (oThis.isInverted()) {
						iWidth += oThis.iArrowPaddingInverted;
					} else {
						iWidth += oThis.iArrowPadding;
					}

					oThis._bRTL = sap.ui.getCore().getConfiguration().getRTL();
					if (oThis._bRTL) {
						$Arrow.css("right", iWidth + "px");
					} else {
						$Arrow.css("left", iWidth + "px");
					}
				} else {
					$Arrow.css({
						"left": "",
						"right": ""
					});
				}

				iVal = parseInt(iVal, 10);
				iVal = iVal < 0 ? 0 : iVal;
				if (iVal > 0) {
					iVal -= 2; // due to some padding
					// only correct corresponding position if there is something to correct
					// otherwise the default position is used (via styling)
					$Arrow.css(sKey, iVal + "px");
				}
			};
			/**
			 * Handles the sapescape event, triggers closing of the ToolPopup.
			 *
			 * @private
			 */
			ToolPopup.prototype.onsapescape = function () {
				if (this.fireClose()) {
					this.close();
				}
			};

			/**
			 * This function is called when the Popup has been closed.
			 * It does not matter if it is closed through the "close"-function or through the autoClose-mechanism.
			 * Additionally it is necessary to restore the focus as if the ToolPopup was closed via "close()".
			 * If the corresponding suppress-parameter was given to "close" no focus will be restored.
			 *
			 * @param {jQuery.EventObject} oEvent
			 * @private
			 */
			var fnOnClosed = function (oEvent) {
				if (!this._bPreventRestoreFocus) {
					Popup.applyFocusInfo(this._oPreviousFocus);
				}

				// Not removing the content DOM leads to the  problem that control DOM with the same ID exists in two places if
				// the control is added to a different aggregation without the dialog being destroyed. In this special case the
				// RichTextEditor (as an example) renders a textarea-element and afterwards tells the TinyMCE component which ID
				// to use for rendering; since there are two elements with the same ID at that point, it does not work.
				// As the Dialog can only contain other controls, we can safely discard the DOM - we cannot do this inside
				// the Popup, since it supports displaying arbitrary HTML content.
				this.$().remove();

				this.fireClosed();
			};


			/**
			 * Closes the pop up.
			 * Can be called by the Shell when the pop up's button is clicked again; or by the application
			 * when the interaction in the pop up has been completed or canceled.
			 *
			 * @param {boolean} bPreventRestoreFocus
			 *         If set, the focus is NOT restored to the element that had the focus before the ToolPopup was opened.
			 *         This makes sense when the ToolPopup is closed programmatically from a different area of the application
			 *         (outside the ToolPopup) and the focus should not move aways from that place.
			 * @returns {sap.ui.ux3.ToolPopup}
			 * @public
			 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
			 */
			ToolPopup.prototype.close = function (bPreventRestoreFocus) {
				if (this.oPopup && this.oPopup.isOpen()) {
					if (this._sResizeID) {
						sap.ui.core.ResizeHandler.deregister(this._sResizeID);
						delete this._sResizeID;
					}

					this.oPopup.close(this.getCloseDuration());
					this._bPreventRestoreFocus = bPreventRestoreFocus;

				}
				return this;
			};

			/**
			 * Indicates whether the ToolPopup is currently enabled or not.
			 *
			 * Applications can't control the enabled state via a property. A ToolPopup is implicitly
			 * enabled depending on its <code>openState</code>. Descendant controls that honor the
			 * enabled state of their ancestors will appear disabled after the ToolPopup is closed.
			 *
			 * Since 1.13.1. Whether a dialog is regarded as "enabled" during the state transitions
			 * (OPENING, CLOSING) is not fully decided. Currently, it is enabled during the OPENING phase
			 * and disabled during the CLOSING phase. The only potential change would be to treat the
			 * OPENING phase as disabled as well. Applications should be prepared to receive events from
			 * "enabled" controls after they called open() on the dialog until close() is called on it.
			 * If the mentioned potential change should happen, the dialog will become enabled only
			 * after the transition to OPEN. Events from "enabled" children then can still only arrive
			 * between open() and close(), so applications that obey the previous rule should continue
			 * to work. Only end users or code that explicitly triggers pseudo user events would notice
			 * a difference. <br>
			 * A second aspect that might change is the visual behavior of the content: during the CLOSING
			 * phase it 'looks' enabled but in fact it is already disabled. This avoids unnecessary redraws
			 * for content that becomes hidden soon. Should this show to be confusing for end users, it might
			 * be changed.
			 *
			 * @since 1.13.1
			 * @returns {boolean}
			 * @public
			 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
			 */
			ToolPopup.prototype.getEnabled = function () {
				// assuming that a ToolPopup without a Popup can’t be open
				var eState = this.oPopup ? this.oPopup.getOpenState() : sap.ui.core.OpenState.CLOSED;

				//TODO the check for state OPENING is a compromise. Without that, the content of the dialog will render
				// in disabled state but will be enabled. As an alternative, the dialog could render again after OPEN is reached
				// and after switching to CLOSING (to properly reflect the changed enabled state in the descendants)
				return eState === sap.ui.core.OpenState.OPENING || eState === sap.ui.core.OpenState.OPEN;
			};

			ToolPopup.prototype.onsapenter = function (oEvent) {
				// See open-method
				var sInitFocus = this.getDefaultButton();
				var oFocusCtrl = sap.ui.getCore().byId(sInitFocus);

				// trigger the default button if it exists and is inside the Dialog
				if (sInitFocus && oFocusCtrl && jQuery.contains(this.getDomRef(), oFocusCtrl.getDomRef())) {
					// Okay, we have the control
					if (oFocusCtrl instanceof sap.ui.commons.Button) {
						var $FocusCtrl = oFocusCtrl.$();
						$FocusCtrl.click();
						$FocusCtrl.focus();
					}
				}

				oEvent.preventDefault();
				oEvent.stopPropagation();
			};

			ToolPopup.prototype.onBeforeRendering = function () {
				var sInitialFocusId = this.getInitialFocus() || this._sInitialFocusId;
				var sDefaultButtontId = this.getDefaultButton();
				this._bFocusSet = true;

				if (sInitialFocusId) {
					this.oPopup.setInitialFocusId(sInitialFocusId);
				} else if (sDefaultButtontId) {
					this.oPopup.setInitialFocusId(sDefaultButtontId);
				} else {
					this._bFocusSet = false;
				}

				this._bRTL = sap.ui.getCore().getConfiguration().getRTL();
			};

			ToolPopup.prototype._ensurePopup = function () {
				if (!this.oPopup) {
					this.oPopup = new Popup(this, false, true, false);
					this.oPopup.attachOpened(this._proxyOpened);
					this.oPopup.attachClosed(this._proxyClosed);

					var that = this;
					this.oPopup._applyPosition = function () {
						Popup.prototype._applyPosition.apply(that.oPopup, arguments);

						var of = that.oPopup._oLastPosition.of;
						if (!of) {
							// In case setPosition is called from the outside and the opener has
							// been removed, this leads to closing the ToolPopup instead of causing
							// an error
							that.oPopup.close();
						} else {
							var $of = jQuery.sap.byId(of.id);
							// only after an open popup the corresponding arrow can be determined
							// if the position was set manually
							if (that._bPositionSet) {
								// shell stuff should still use the left arrow
								if (!$of.hasClass("sapUiUx3ShellTool")) {
									that._my = that.oPopup._oLastPosition.my;
									that._at = that.oPopup._oLastPosition.at;
								}
							}
							fnSetArrow(that);
						}
					};
				}
				return this.oPopup;
			};

			var fnOnResize = function () {
				if (this.getContent().length) {
					// This fixes the height of the ToolPopup if the height exceeds the window height.
					// Maybe there is a Layout as content that changed its aggregation
					this._proxyFixSize();

					// If the height/width changed the Popup's position has to be fixed as well.
					// Setting the arrow isn't needed after that because it happens inside "_applyPosition"
					this.oPopup._applyPosition(this.oPopup._oLastPosition);
				}
			};

			/**
			 * Sets the position of the pop up, the same parameters as for sap.ui.core.Popup can be used.
			 *
			 * @public
			 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
			 */
			ToolPopup.prototype.setPosition = function () {
				this._ensurePopup();
				this.oPopup.setPosition.apply(this.oPopup, arguments);
				this._bPositionSet = true;

				fnCheckOpener(this);

				return this;
			};

			var fnChangeContent = function (that, sType) {
				if (sType === "content") {
					fnRenderContent(that);
				} else if (sType === "buttons") {
					fnRenderButtons(that);
				}

				// this fixes the height of the ToolPopup if the height exceeds the window height
				that._proxyFixSize();
				// If the height/width changed the Popup's position has to be fixed as well
				// Setting the arrow isn't needed after that because it happens inside "_applyPosition"
				that.oPopup._applyPosition(that.oPopup._oLastPosition);
			};

			var fnRenderContent = function (oThis) {
				var oContentDomRef = oThis.getDomRef("content");
				oContentDomRef.innerHTML = "";

				var aContent = oThis.getContent();
				var rm = sap.ui.getCore().createRenderManager();

				for (var i = 0; i < aContent.length; i++) {
					rm.renderControl(aContent[i]);
				}

				rm.flush(oContentDomRef, true);
				rm.destroy();
			};
			var fnRenderButtons = function (oThis) {
				var oButtons = oThis.getDomRef("buttons");
				var oSeparator = oThis.getDomRef("buttons-separator");
				var aButtons = oThis.getButtons();

				if (aButtons.length === 0) {
					jQuery(oButtons).addClass("sapUiUx3TPButtonRowHidden");
					jQuery(oSeparator).addClass("sapUiUx3TPButtonRowHidden");
				} else {
					jQuery(oButtons).removeClass("sapUiUx3TPButtonRowHidden");
					jQuery(oSeparator).removeClass("sapUiUx3TPButtonRowHidden");
					oButtons.innerHTML = "";
					var rm = sap.ui.getCore().createRenderManager();

					for (var i = 0; i < aButtons.length; i++) {
						rm.renderControl(aButtons[i]);
					}

					rm.flush(oButtons, true);
					rm.destroy();
				}
			};

			ToolPopup.prototype.addContent = function (oContent) {
				this.addAggregation("content", oContent, /* suppressInvalidate */true);

				if (this.isOpen()) {
					fnChangeContent(this, "content");
				}

				return this;
			};
			ToolPopup.prototype.insertContent = function (oContent, index) {
				this.insertAggregation("content", oContent, index, /* suppressInvalidate */true);

				if (this.isOpen()) {
					fnChangeContent(this, "content");
				}

				return this;
			};
			ToolPopup.prototype.removeContent = function (oContent) {
				this.removeAggregation("content", oContent, /* suppressInvalidate */true);

				if (this.isOpen()) {
					fnChangeContent(this, "content");
				}

				return this;
			};
			ToolPopup.prototype.addButton = function (oButton) {
				this.addAggregation("buttons", oButton, /* suppressInvalidate */true);

				if (this.isOpen()) {
					fnChangeContent(this, "buttons");
				}

				return this;
			};
			ToolPopup.prototype.insertButton = function (oButton, index) {
				this.insertAggregation("buttons", oButton, index, /* suppressInvalidate */true);

				if (this.isOpen()) {
					fnChangeContent(this, "buttons");
				}

				return this;
			};
			ToolPopup.prototype.removeButton = function (oButton) {
				this.removeAggregation("button", oButton, /* suppressInvalidate */true);

				if (this.isOpen()) {
					fnChangeContent(this, "buttons");
				}

				return this;
			};

			/**
			 * This updates the instance's parameter if the ToolPopup is inverted per default
			 *
			 * @private
			 */
			var fnUpdateThemeInverted = function (oThis) {
				var sParam = "sapUiUx3ToolPopupInverted";

				sParam = Parameters.get(sParam);
				oThis._bThemeInverted = sParam === "true";
			};

			/**
			 * @private
			 */
			ToolPopup.prototype.onThemeChanged = function () {
				fnUpdateThemeInverted(this);
			};

			/**
			 * This checks if the ToolPopup is inverted. This depends on the parameter
			 * 'inverted' and the LESS-parameter 'sapUiUx3ToolPopupInverted' in the current
			 * theme.
			 *
			 * @returns {boolean} Whether the ToolPopup is inverted
			 * @private
			 */
			ToolPopup.prototype.isInverted = function () {
				fnUpdateThemeInverted(this);
				return this.getInverted() && this._bThemeInverted;
			};

			/**
			 * This is just a forward to the Popup's function (sap.ui.core.Popup.setAutoCloseAreas)
			 * with the same functionality.
			 *
			 * @param {Element[]} aAutoCloseAreas
			 * @public
			 * @since 1.19.0
			 */
			ToolPopup.prototype.setAutoCloseAreas = function (aAutoCloseAreas) {
				this._ensurePopup();
				return this.oPopup.setAutoCloseAreas(aAutoCloseAreas);
			};

			/**
			 * Adds an ID to the Popup that should be focusable as well when using <code>autoclose</code>.
			 * Chaining is only possible if a valid type (string) is given.
			 *
			 * @param {sap.ui.core.string} [sID] ID of the corresponding element that should be focusable as well
			 * @since 1.19.0
			 * @public
			 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
			 */
			ToolPopup.prototype.addFocusableArea = function (sID) {
				this._ensurePopup();

				if (typeof (sID) === "string") {
					// channelId & eventId are mandatory dummy values
					this.oPopup._addFocusableArea("channelId", "eventId", {
						id: sID
					});
					return this;
				} else {
					jQuery.sap.log.error("Wrong type of focusable area ID - string expected", "", "sap.ui.ux3.ToolPopup");
				}
			};

			/**
			 * Removes an ID to the Popup that should be focusable as well when using <code>autoclose</code>.
			 * Chaining is only possible if a valid type (string) is given.
			 *
			 * @param {sap.ui.core.string} [sID] ID of the corresponding element
			 * @since 1.19.0
			 * @public
			 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
			 */
			ToolPopup.prototype.removeFocusableArea = function (sID) {
				this._ensurePopup();

				if (typeof (sID) === "string") {
					// channelId & eventId are mandatory dummy values
					this.oPopup._removeFocusableArea("channelId", "eventId", {
						id: sID
					});
					return this;
				} else {
					jQuery.sap.log.error("Wrong type of focusable area ID - string expected", "", "sap.ui.ux3.ToolPopup");
				}
			};
		}());

		/**
		 * Overriden setter for the Icon.
		 *
		 * @param {string} sIcon
		 * @returns {sap.ui.ux3.ToolPopup}
		 */
		ToolPopup.prototype.setIcon = function (sIcon) {
			this.setProperty("icon", sIcon, true); // rerendering makes no sense, as this icon is not rendered by the ToolPopup
			this.fireIconChanged(); // tell other interested parties to update the icon
			return this;
		};

		/**
		 * Overriden setter for the icon hover.
		 *
		 * @param {string} sIconHover
		 * @returns {sap.ui.ux3.ToolPopup}
		 */
		ToolPopup.prototype.setIconHover = function (sIconHover) {
			this.setProperty("iconHover", sIconHover, true); // rerendering makes no sense, as this icon is not rendered by the ToolPopup
			this.fireIconChanged(); // tell other interested parties to update the icon
			return this;
		};

		/**
		 * Overriden setter for the selected icon.
		 * @param {string} sIconSelected
		 * @returns {sap.ui.ux3.ToolPopup}
		 */
		ToolPopup.prototype.setIconSelected = function (sIconSelected) {
			this.setProperty("iconSelected", sIconSelected, true); // rerendering makes no sense, as this icon is not rendered by the ToolPopup
			this.fireIconChanged(); // tell other interested parties to update the icon
			return this;
		};

		/**
		 * Gets the selected icon or icon hover.
		 *
		 * @returns {object}
		 */
		ToolPopup.prototype.getIconSelected = function () {
			return this.getProperty("iconSelected") || this.getProperty("iconHover"); // implement the documented fallback
		};

		/**
		 * Overriden setter for the max width internally.
		 *
		 * @param sMaxWidth
		 */
		ToolPopup.prototype.setMaxWidth = function (sMaxWidth) {
			var pattern = /[0-9]+px/;

			if (pattern.test(sMaxWidth)) {
				this.setProperty("maxWidth", sMaxWidth);
			} else {
				jQuery.sap.log.error("Only values in pixels are possible", "", "sap.ui.ux3.ToolPopup");
			}
		};

		return ToolPopup;

	}, /* bExport= */ true);
