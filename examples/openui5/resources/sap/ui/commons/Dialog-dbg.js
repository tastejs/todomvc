/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.commons.Dialog.
sap.ui.define(['jquery.sap.global', './library', 'sap/ui/core/Control', 'sap/ui/core/Popup'],
	function (jQuery, library, Control, Popup) {
		"use strict";


		/**
		 * Constructor for a new Dialog.
		 *
		 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
		 * @param {object} [mSettings] Initial settings for the new control
		 *
		 * @class
		 * An interactive window appearing on request displaying information to the user. The API supports features such as popups with fixed sizes, popups with unlimited width, scrolling bars for large windows, and control nesting (for example, a drop-down list can be included in the window).
		 * @extends sap.ui.core.Control
		 * @implements sap.ui.core.PopupInterface
		 *
		 * @namespace
		 * @author SAP SE
		 * @version 1.32.9
		 *
		 * @constructor
		 * @public
		 * @alias sap.ui.commons.Dialog
		 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
		 */
		var Dialog = Control.extend("sap.ui.commons.Dialog", /** @lends sap.ui.commons.Dialog.prototype */ {
			metadata: {

				interfaces: [
					"sap.ui.core.PopupInterface"
				],
				library: "sap.ui.commons",
				properties: {

					/**
					 * Outer width of dialog window. When not set and not constrained by one of the width parameters (minWidth/maxWidth), the window size is automatically adapted to the content.
					 */
					width: {
						type: "sap.ui.core.CSSSize",
						group: "Dimension",
						defaultValue: null
					},

					/**
					 * Outer height of dialog window. When not set and not constrained by one of the height parameters (minHeight/maxHeight), the window size is automatically adapted to the content.
					 */
					height: {
						type: "sap.ui.core.CSSSize",
						group: "Dimension",
						defaultValue: null
					},

					/**
					 * Scroll position from left to right. "0" means leftmost position.
					 */
					scrollLeft: {
						type: "int",
						group: "Behavior",
						defaultValue: 0
					},

					/**
					 * Scroll position from top to bottom. "0" means topmost position.
					 */
					scrollTop: {
						type: "int",
						group: "Behavior",
						defaultValue: 0
					},

					/**
					 * Dialog title displayed in the header.
					 */
					title: {
						type: "string",
						group: "Misc",
						defaultValue: ''
					},

					/**
					 * Padding is theme-dependent. When set to "false", the content extends to the dialog borders.
					 */
					applyContentPadding: {
						type: "boolean",
						group: "Appearance",
						defaultValue: true
					},

					/**
					 * Displays a close button in the title bar.
					 */
					showCloseButton: {
						type: "boolean",
						group: "Behavior",
						defaultValue: true
					},

					/**
					 * Specifies whether the dialog window can be resized by the user. The dialog frame contains the visual symbol.
					 */
					resizable: {
						type: "boolean",
						group: "Behavior",
						defaultValue: true
					},

					/**
					 * Minimum outer width of the dialog window. When set, neither the user nor some layout settings can make the window smaller.
					 */
					minWidth: {
						type: "sap.ui.core.CSSSize",
						group: "Dimension",
						defaultValue: null
					},

					/**
					 * Minimum outer height of the dialog window. When set, neither the user nor some layout settings can make the window smaller.
					 */
					minHeight: {
						type: "sap.ui.core.CSSSize",
						group: "Dimension",
						defaultValue: null
					},

					/**
					 * Maximum outer width of the dialog window. If set, neither the user nor some layout settings can make the window larger.
					 */
					maxWidth: {
						type: "sap.ui.core.CSSSize",
						group: "Dimension",
						defaultValue: null
					},

					/**
					 * Maximum outer height of the dialog window. If set, neither the user nor some layout settings can make the window larger.
					 */
					maxHeight: {
						type: "sap.ui.core.CSSSize",
						group: "Dimension",
						defaultValue: null
					},

					/**
					 * Specifies the border design. Border design is theme dependent.
					 */
					contentBorderDesign: {
						type: "sap.ui.commons.enums.BorderDesign",
						group: "Appearance",
						defaultValue: sap.ui.commons.enums.BorderDesign.None
					},

					/**
					 * Specifies whether the dialog should be modal, or not. In case of <code>true</code> the focus is kept inside the dialog.
					 */
					modal: {
						type: "boolean",
						group: "Misc",
						defaultValue: false
					},

					/**
					 * The ARIA role for the control. E.g. for alert-style Dialogs this can be set to "AlertDialog".
					 */
					accessibleRole: {
						type: "sap.ui.core.AccessibleRole",
						group: "Accessibility",
						defaultValue: sap.ui.core.AccessibleRole.Dialog
					},

					/**
					 * Specifies whether Dialog movement should be restricted to the visible area of the window. This only affects drag&drop movements by the user. This doesn't affect modal dialogs -> modal dialogs always stay in the window.
					 * @since 1.9.0
					 */
					keepInWindow: {
						type: "boolean",
						group: "Behavior",
						defaultValue: false
					},

					/**
					 * If this property is set to true the Dialog will close if the Dialog loses its focus
					 * @since 1.10
					 */
					autoClose: {
						type: "boolean",
						group: "Misc",
						defaultValue: false
					}
				},
				defaultAggregation: "content",
				aggregations: {

					/**
					 * Aggregation of the buttons to display at the bottom of the dialog, for example OK and Cancel. Association defaultButton can be used for one of the defined buttons.
					 */
					buttons: {
						type: "sap.ui.core.Control",
						multiple: true,
						singularName: "button"
					},

					/**
					 * Aggregation of the content of the dialog (one or more controls).
					 *
					 * Warning: when content is added with width given as a percentage, the Dialog itself should have a width set.
					 */
					content: {
						type: "sap.ui.core.Control",
						multiple: true,
						singularName: "content"
					}
				},
				associations: {

					/**
					 * Defines one of the buttons that have been provided via button aggregation to be the default button. This default button is initially selected, if no control is set via the initialFocus association explicitly. The default button is activated when Enter is pressed in the context of the dialog and when the currently selected element does not handle the Enter event itself.
					 */
					defaultButton: {
						type: "sap.ui.commons.Button",
						multiple: false
					},

					/**
					 * Defines the control that shall get the focus when the dialog is opened.
					 */
					initialFocus: {
						type: "sap.ui.core.Control",
						multiple: false
					}
				},
				events: {

					/**
					 * Event is fired when the dialog has been closed (after closing-animation etc.). Event parameters provide information about last position and last size.
					 */
					closed: {
						parameters: {

							/**
							 * The width of the dialog when closed
							 */
							width: {
								type: "int"
							},

							/**
							 * The height of the dialog when closed
							 */
							height: {
								type: "int"
							},

							/**
							 * The top position of the dialog when closed
							 */
							top: {
								type: "int"
							},

							/**
							 * The left position of the dialog when closed
							 */
							left: {
								type: "int"
							}
						}
					}
				}
			}
		});


		/**
		 * Initialization hook for the dialog.
		 * It creates the instance of the Popup helper service and does some basic configuration for it.
		 *
		 * @private
		 */
		Dialog.prototype.init = function () {
			// do something for initialization...
			this.oPopup = new Popup(this, true, true);
			var eDock = Popup.Dock;
			this.oPopup.setPosition(eDock.CenterCenter, eDock.CenterCenter, window);

			this._minWidth = 64; // the technical minWidth, not the one set via API; will be calculated after rendering
			this._minHeight = 48; // the technical minHeight, not the one set via API; will be calculated after rendering

			this.allowTextSelection(false);

			this._mParameters = {};
			this._mParameters.that = this;
			this._mParameters.firstFocusable = this.getId() + "-fhfe";
			this._mParameters.lastFocusable = this.getId() + "-fhee";
		};

		Dialog.prototype.setInitialFocus = function (sId) {
			if (sId != null && typeof sId != "string") {
				sId = sId.getId();
			}
			this.oPopup.setInitialFocusId(sId);
			this.setAssociation("initialFocus", sId, /* suppress invalidate */ true);
		};

		/**
		 * Required adaptations after rendering.
		 *
		 * @private
		 */
		Dialog.prototype.onAfterRendering = function () {
			var $content = this.$("cont");

			// if content has 100% width, but Dialog has no width, set content width to auto
			if (!Dialog._isSizeSet(this.getWidth()) && !Dialog._isSizeSet(this.getMaxWidth())) {
				$content.children().each(function (index, element) {
					if (jQuery.trim(this.style.width) == "100%") {
						this.style.width = "auto";
					}
				});
			}

			// IE9+10 fix where subpixel font rendering may lead to rounding errors in RTL mode when the content has a width of "xyz.5px"
			if (!!sap.ui.Device.browser.internet_explorer && (sap.ui.Device.browser.version == 9 || sap.ui.Device.browser
					.version == 10) && ($content.length > 0)) {
				var elm = $content[0];
				if (sap.ui.getCore().getConfiguration().getRTL() && !Dialog._isSizeSet(this.getWidth())) {
					if (elm.ownerDocument && elm.ownerDocument.defaultView && elm.ownerDocument.defaultView.getComputedStyle) {
						var width = elm.ownerDocument.defaultView.getComputedStyle(elm).getPropertyValue("width");
						if (width) {
							var fWidth = parseFloat(width, 10);
							if (fWidth % 1 == 0.5) {
								$content[0].style.width = (fWidth + 0.01) + "px"; // if aaaalll these conditions are fulfilled, the Dialog must be a LITTLE bit wider to avoid rounding errors
							}
						}
					}
				}
			}

			// if height is not set, but min-height is set, the Dialog is in a mixed mode between fixed height and flexible height
			// (denoted by sapUiDlgFlexHeight), where sometimes the content pushes the height (when it is tall enough) and sometimes
			// the Dialog needs to take care to push the button row to the bottom (when there is less content than what would fit into a Dialog
			// with min-height size).
			// Therefore we need to check which one of both cases is currently active.
			if (!Dialog._isSizeSet(this.getHeight()) && Dialog._isSizeSet(this.getMinHeight())) {
				// height is not set, so the content height should push the height - denoted by the CSS class "sapUiDlgFlexHeight" which applies a simple layout
				// where header, content, and footer are stacked on top of each other

				// however, when there is a minHeight set which is larger than the natural height, the footer would be not at the bottom, so let's check whether the Dialog
				// is now smaller than the min-height:
				var footer = this.getDomRef("footer");
				var footerBottom = footer.offsetTop + footer.offsetHeight;
				var dialogBottom = this.getDomRef().offsetHeight;
				if (footerBottom < dialogBottom) {
					this.$().removeClass("sapUiDlgFlexHeight");
				} // else normal case: Dialog content pushes its height to or beyond its minimum height - this works fine with "sapUiDlgFlexHeight"
			}

			// Calculate min size and we need to do a delayedCall here because we do not have the size of the header and footer of the Dialog
			if (!this._sDelayedCall) {
				this._sDelayedCall = jQuery.sap.delayedCall(0, this, function () {
					var _minSize = this.getMinSize();
					this._minWidth = _minSize.width;
					this._minHeight = _minSize.height;
					this._sDelayedCall = null;
				});
			} else {
				jQuery.sap.clearDelayedCall(this._sDelayedCall);
			}
		};

		/**
		 * Handle the click event happening on the dialog instance.
		 *
		 * @param {jQuery.EventObject} oEvent The event object
		 * @private
		 */
		Dialog.prototype.onclick = function (oEvent) {
			var sCloseBtnId = this.getId() + "-close";
			if (oEvent.target.id === sCloseBtnId) {
				this.close();
				oEvent.preventDefault(); // avoid onbeforeunload event which happens at least in IE9 because of the javascript:void(0); link target
			}
			return false;
		};

		/**
		 * Opens the dialog control instance.
		 *
		 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
		 * @public
		 */
		Dialog.prototype.open = function () {
			if (!this.oPopup) {
				jQuery.sap.log.fatal("This dialog instance has been destroyed already");
			} else if (!this._bOpen) {
				// Save current focused element to restore the focus after closing the dialog
				this._oPreviousFocus = Popup.getCurrentFocusInfo();

				this.oPopup.attachEvent("opened", this.handleOpened, this);
				this.oPopup.attachEvent("closed", this.handleClosed, this);
				this.oPopup.setModal(this.getModal());
				this.oPopup.setAutoClose(this.getAutoClose());
				this.oPopup.open(400);
				this._bOpen = true;
			}
		};

		/**
		 * Re-renders the control when the theme is changed.
		 */
		Dialog.prototype.onThemeChanged = function () {
			this.invalidate();
		};

		/**
		 * Makes sure the dialog is shown and the focus is properly set.
		 *
		 * @private
		 */
		Dialog.prototype._handleOpened = function () {
			// Make sure the dom content is shown (in the static area)
			this.$().show();

			var sInitFocus = this.getInitialFocus(),
				oFocusCtrl;
			if (sInitFocus && (oFocusCtrl = sap.ui.getCore().byId(sInitFocus))) { // an additional previous check was  oFocusCtrl.getParent() === this  which prevented nested children from being focused
				oFocusCtrl.focus();
				this._bInitialFocusSet = true;
			} else {
				sInitFocus = this.getDefaultButton();
				if (sInitFocus && (oFocusCtrl = sap.ui.getCore().byId(sInitFocus)) && oFocusCtrl.getParent() === this) {
					oFocusCtrl.focus();
					this._bInitialFocusSet = true;
				} else if (this.getButtons().length > 0) {
					this.getButtons()[0].focus();
					this._bInitialFocusSet = true;
				} else if (this.getContent().length > 0) {
					// let's at least focus something in the Dialog that is TABBABLE
					var aTabbables = jQuery(":sapTabbable", this.$("cont"));
					if (aTabbables.length) {
						aTabbables[0].focus();
						this._bInitialFocusSet = true;
					} else {
						// if there is something in the content but isn't tabbable then
						// use the first fake element to focus
						var oFakeDomRef = jQuery.sap.domById(this._mParameters.firstFocusable);
						jQuery.sap.focus(oFakeDomRef);
						this._bInitialFocusSet = true;
					}
				}
			}
		};

		/**
		 * Handles the opening procedure for the dialog considering the underlying Popup.
		 *
		 * @private
		 */
		Dialog.prototype.handleOpened = function () {
			this.oPopup.detachEvent("opened", this.handleOpened, this);

			if (sap.ui.Device.browser.internet_explorer && sap.ui.Device.browser.version === 11) {
				// a delayed call is needed for IE11. Since it fires the opened event before all stuff
				// is visible. All stuff is added to the DOM though and all operations can be done
				// but a focus seems to work (there is no error) but the focus can't be set to something
				// that isn't really visible
				jQuery.sap.clearDelayedCall(this._delayedCallId);
				this._delayedCallId = jQuery.sap.delayedCall(0, this, this._handleOpened);
			} else {
				this._handleOpened();
			}
		};

		/**
		 * Closes the dialog control instance.
		 *
		 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
		 * @public
		 */
		Dialog.prototype.close = function () {

			if (!this._bOpen) {
				return;
			}

			var oRect = this.$().rect();

			this._bOpen = false;
			this._bInitialFocusSet = false;
			if (this.oPopup.isOpen()) {
				this.oPopup.close(400);
			}

			// do this delayed or it possibly won't work because of popup closing animations
			jQuery.sap.delayedCall(400, this, "restorePreviousFocus");

			jQuery.each(oRect, function (key, val) {
				oRect[key] = parseInt(val, 10);
			});

			this._oRect = oRect;
		};

		/**
		 * Handles the closing procedure for the dialog.
		 *
		 * @private
		 */
		Dialog.prototype.handleClosed = function () {
			this.oPopup.detachEvent("closed", this.handleClosed, this);

			this.fireClosed(this._oRect);
			this.close();

			// Make sure the dom content is not shown any more (in the static area)

			// This used to be this.$().hide() which keeps the current DOM in the static UIArea. This led to the
			// problem that control DOM with the same ID exists in two places if the control is added to a different
			// aggregation without the dialog being destroyed. In this special case the RichTextEditor renders a
			// textarea-element and afterwards tells the TinyMCE component which ID to use for rendering; since there
			// are two elements with the same ID at that point, it does not work.
			// As the Dialog can only contain other controls, we can safely discard the DOM - we cannot do this inside
			// the Popup, since it supports displaying arbitrary HTML content.
			this.$().remove();
		};

		/**
		 * Restore the focus when the dialog was closed to the control which opened the dialog.
		 * This is independent of the dialogs modal state. The popup also restores focus when using modal popups/dialogs.
		 *
		 * @private
		 */
		Dialog.prototype.restorePreviousFocus = function () {
			Popup.applyFocusInfo(this._oPreviousFocus);
		};


		Dialog.prototype.setTitle = function (sText) {
			this.setProperty("title", sText, true); // last parameter avoids invalidation
			this.$("lbl").text(sText);
			return this;
		};

		/**
		 * Destroys this instance of dialog, called by Element#destroy().
		 *
		 * @private
		 */
		Dialog.prototype.exit = function () {
			// only fire the closed event if the dialog was open
			var bWasOpen = this.isOpen();
			this.close();

			// just to ensure that any attached event is being detached
			this.oPopup.detachEvent("opened", this.handleOpened, this);
			this.oPopup.detachEvent("closed", this.handleClosed, this);

			this.oPopup.destroy();
			if (bWasOpen) {
				this.fireClosed(this._oRect);
			}

			this.oPopup = null;
			jQuery.sap.clearDelayedCall(this._sDelayedCall);
			this._sDelayedCall = null;
			delete this._mParameters;
		};

		/**
		 * Checks whether the given sCssSize is an explicit value, or not (e.g. auto, inherit).
		 *
		 * @param {string} sCssSize The CSS string to check for being explicit value.
		 * @returns {boolean} whether The given sCssSize is an explicit value, or not (e.g. auto, inherit).
		 * @private
		 */
		Dialog._isSizeSet = function (sCssSize) {
			return (sCssSize && !(sCssSize == "auto") && !(sCssSize == "inherit"));
		};

		/**
		 * Handles the sapescape event, triggers closing of the window.
		 *
		 * @param {jQuery.EventObject} oEvent The event object
		 * @private
		 */
		Dialog.prototype.onsapescape = function (oEvent) {
			this.close();

			oEvent.preventDefault();
			oEvent.stopPropagation();
		};

		/**
		 * Handles the sapenter event, triggers the default button of the dialog.
		 *
		 * @param {jQuery.EventObject} oEvent The event object
		 * @private
		 */
		Dialog.prototype.onsapenter = function (oEvent) {
			// See open-method
			var oFocusCtrl,
				sInitFocus = this.getDefaultButton();

			if (sInitFocus && (oFocusCtrl = sap.ui.getCore().byId(sInitFocus)) && jQuery.contains(this.getDomRef(),
					// trigger the default button if it exists and is inside the Dialog
					oFocusCtrl.getDomRef())) {
				// Okay, we have the control
				if (oFocusCtrl instanceof sap.ui.commons.Button) {
					oFocusCtrl.onclick(oEvent);
				}
			}

			oEvent.preventDefault();
			oEvent.stopPropagation();
		};

		/**
		 * Event handler for the focusin event.
		 *
		 * If it occurs on the focus handler elements at the beginning of the dialog, the focus is set to the end, and vice versa.
		 * @param {jQuery.EventObject} oEvent The event object
		 * @private
		 */
		Dialog.prototype.onfocusin = function (oEvent) {
			this.sLastRelevantNavigation = null;

			if (!this._bInitialFocusSet) {
				// since IE9 calls first "onfocusin" it has to be checked if the initial focus was set already
				return;
			}

			this._mParameters.event = oEvent;
			this._mParameters.$FocusablesContent = jQuery(":sapTabbable", this.$("cont"));
			this._mParameters.$FocusablesFooter = jQuery(":sapTabbable", this.$("footer"));

			this.oPopup.focusTabChain(this._mParameters);
		};

		/**
		 * Restores the focus to the dialog after it has been moved or resized.
		 *
		 * @param {jQuery.EventObject} oEvent The event object
		 * @private
		 */
		Dialog.prototype.restoreFocus = function () {
			if (this.oRestoreFocusInfo && this.oPopup.bOpen) { // do not restore the focus if Dialog is no longer open
				var oCtrl = sap.ui.getCore().byId(this.oRestoreFocusInfo.sFocusId);
				if (oCtrl) {
					oCtrl.applyFocusInfo(this.oRestoreFocusInfo.oFocusInfo);
				}
			}
		};

		/**
		 * Handles or cancels the selectstart event when occuring in parts of the dialog.
		 *
		 * @param {jQuery.EventObject} oEvent The event object
		 * @private
		 */
		Dialog.prototype.onselectstart = function (oEvent) {
			if (!jQuery.sap.containsOrEquals(this.getDomRef("cont"), oEvent.target)) {
				oEvent.preventDefault();
				oEvent.stopPropagation();
			}
		};

		/**
		 * Get minimal reasonable size of the dialog given its inner elements. Call is recommended after rendering.
		 *
		 * @returns {Object} An object with inner structure {width:{int}, height:{int}}
		 * @private
		 */
		Dialog.prototype.getMinSize = function () {

			var oDialog = jQuery.sap.domById(this.sId),
				oTitle = jQuery.sap.domById(this.sId + "-hdr"),
				oFooter = jQuery.sap.domById(this.sId + "-footer"),
				heightTitle = 0,
				widthFooter = 0,
				heightFooter = 0;

			var oFooterBtns = jQuery(oFooter).children("DIV").get(0);
			widthFooter = oFooterBtns.offsetWidth;

			var addValue = 0;
			// add border and padding of footer...not margin
			addValue += jQuery(oFooter).outerWidth(false) - jQuery(oFooter).width();
			// add border and padding of footer...not margin
			addValue += jQuery(oDialog).outerWidth(false) - jQuery(oDialog).width();

			// if there is a too small specific border value add +20 for certainty to avoid wrapping
			if (addValue <= 20) {
				addValue = 20;
			}

			widthFooter += addValue;

			if (isNaN(widthFooter) || widthFooter < 100) {
				widthFooter = 100;
			}

			heightTitle = oTitle.offsetHeight;
			heightFooter = oFooter.offsetHeight;
			return {
				width: widthFooter,
				height: heightTitle + heightFooter + 36 /* min. height content */
			};
		};

		// store the original invalidate function
		Dialog.prototype.forceInvalidate = Control.prototype.invalidate;

		// stop propagating the invalidate to static UIArea before dialog is opened.
		// otherwise the open animation can't be seen
		// dialog will be rendered directly to static ui area when the open method is called.
		Dialog.prototype.invalidate = function (oOrigin) {
			if (this.oPopup && (this.oPopup.eOpenState !== "CLOSING" || this.isOpen())) {
				this.forceInvalidate(oOrigin);
			}
		};

		// Implementation of API method isOpen

		/**
		 * Indicates whether the Dialog is open (this includes opening and closing animations).
		 * For more detailed information about the current state check Dialog.getOpenState().
		 *
		 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
		 * @returns {boolean}
		 * @public
		 */
		Dialog.prototype.isOpen = function () {
			return this.oPopup.isOpen();
		};

		// Implementation of API method isOpen

		/**
		 * Indicates whether the Dialog is currently open, closed, or transitioning between these states.
		 *
		 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
		 * @returns {sap.ui.core.OpenState}
		 * @public
		 */
		Dialog.prototype.getOpenState = function () {
			return this.oPopup.getOpenState();
		};

		/**
		 * Determines whether the dialog is currently enabled or not.
		 *
		 * Applications can't control the enabled state via a property. A dialog is implicitly
		 * enabled depending on its <code>openState</code>. Descendant controls that honor the
		 * enabled state of their ancestors will appear disabled after the dialog is closed.
		 *
		 * @experimental Whether a dialog is regarded as "enabled" during the state transitions
		 * (OPENING, CLOSING) is not fully decided. Currently, it is enabled during the OPENING phase
		 * and disabled during the CLOSING phase. The only potential change would be to treat the
		 * OPENING phase as disabled as well. Applications should be prepared to receive events from
		 * "enabled" controls after they called open() on the dialog until close() is called on it.
		 * If the mentioned potential change should happen, the dialog will become enabled only
		 * after the transition to OPEN. Events from "enabled" children then can still only arrive
		 * between open() and close(), so applications that obey the previous rule should continue
		 * to work. Only end users or code  that explicitly triggers pseudo user events will notice
		 * a difference. <br>
		 * A second aspect that might change is the visual behavior of the content: during the CLOSING
		 * phase it 'looks' enabled but in fact it is already disabled. This avoids unnecessary redraws
		 * for content that becomes hidden soon. Should this show to be confusing for end users, it might
		 * be changed.
		 *
		 * @returns {boolean} indicates whether the dialog is currently enabled or not.
		 * @public
		 */
		Dialog.prototype.getEnabled = function () {
			var eState = this.getOpenState();
			// TODO the check for state OPENING is a compromise. Without that, the content of the dialog will render
			// in disabled state but will be enabled. As an alternative, the dialog could render again after OPEN is reached
			// and after switching to CLOSING (to properly reflect the changed enabled state in the descendants)
			return eState === sap.ui.core.OpenState.OPENING || eState === sap.ui.core.OpenState.OPEN;
		};

		// **************************************************
		// 'Legacy' Resize and Move handling including jQuery-UI parts for that would bring in 70k (uncompressed)
		// **************************************************

		/**
		 * Handles the dragstart event.
		 * In case of resize currently ongoing, this cancels the dragstart.
		 *
		 * @param {sap.ui.core.BrowserEvent} oEvent The forwarded browser event
		 * @private
		 */
		Dialog.prototype.ondragstart = function (oEvent) {
			if (this.sDragMode == "resize" || this.sDragMode == "move") {
				oEvent.preventDefault();
				oEvent.stopPropagation();
			}
		};

		/**
		 * Initializes drag and move capabilities.
		 *
		 * @param {jQuery.EventObject} oEvent The event object
		 * @private
		 */
		Dialog.prototype.onmousedown = function (oEvent) {

			var oSource = oEvent.target,
				sId = this.getId();

			this._bRtlMode = sap.ui.getCore().getConfiguration().getRTL(); // remember the RTL mode for the starting resize operation

			if (jQuery.sap.containsOrEquals(this.getDomRef("hdr"), oSource)) {
				if (oSource.id != (sId + "-close")) {
					this.sDragMode = "move";
					this._RootWidth = this.getDomRef().offsetWidth;
					this._RootHeight = this.getDomRef().offsetHeight;
				}
			} else if (oSource.id == sId + "-grip") {
				this.sDragMode = "resize";

				// Now the dialog is fixed-width and fixed-height; write them to the element and adapt its classes to switch positioning
				var oDomRef = this.getDomRef();
				var sWidth = oDomRef.offsetWidth + "px";
				oDomRef.style.width = sWidth;
				var sHeight = oDomRef.offsetHeight + "px";
				oDomRef.style.height = sHeight;
				jQuery(oDomRef).removeClass("sapUiDlgFlexHeight sapUiDlgFlexWidth");
				// ...also remember the dimensions for the future (e.g. for after rerendering) - but do not cause rerendering now
				this.setProperty("width", sWidth, true);
				this.setProperty("height", sHeight, true);
			}

			if (this.sDragMode == null) {
				return;
			}

			// save current focused control for restoring later in restore focus
			var oActElement = document.activeElement;
			if (oActElement && oActElement.id) {
				var oCtrl = jQuery.sap.byId(oActElement.id).control(0);
				if (oCtrl) {
					this.oRestoreFocusInfo = {
						sFocusId: oCtrl.getId(),
						oFocusInfo: oCtrl.getFocusInfo()
					};
				}
			}

			// Calculate event X,Y coordinates
			this.startDragX = oEvent.screenX;
			this.startDragY = oEvent.screenY;

			this.originalRectangle = this.$().rect();

			jQuery(window.document).bind("selectstart", jQuery.proxy(this.ondragstart, this));
			jQuery(window.document).bind("mousemove", jQuery.proxy(this.handleMove, this));
			jQuery(window.document).bind("mouseup", jQuery.proxy(this.handleMouseUp, this));

			var outerDoc = Dialog._findSameDomainParentWinDoc();
			if (outerDoc) {
				jQuery(outerDoc).bind("selectstart", jQuery.proxy(this.ondragstart, this));
				jQuery(outerDoc).bind("mousemove", jQuery.proxy(this.handleMove, this));
				jQuery(outerDoc).bind("mouseup", jQuery.proxy(this.handleMouseUp, this));
			}

		};


		/**
		 * Returns the document of the parent window which is highest up in the hierarchy of parent windows but still belongs
		 * to the same domain (so its document is accessible).
		 *
		 * @returns {Object} outerDoc
		 * @private
		 */
		Dialog._findSameDomainParentWinDoc = function () {
			var outerDoc = null;
			try {
				var win = window;
				while (win.parent && (win.parent != win)) {
					if (win.parent.document) {
						outerDoc = win.parent.document;
						win = win.parent;
					}
				}
			} catch (e) {
				// parent is in a different domain, so we cannot listen to mouse events there
				// outerWindow is now either null or the highest possible parent window (!= the document's window) in the same domain
			}
			return outerDoc;
		};


		/**
		 * Handles the move event taking the current dragMode into account.
		 * Also stops propagation of the event.
		 *
		 * @param {DOMEvent} event The event raised by the browser.
		 * @returns {boolean}
		 * @private
		 */
		Dialog.prototype.handleMove = function (event) {

			if (!this.sDragMode) {
				return;
			}

			event = event || window.event;

			if (this.sDragMode == "resize") {

				var deltaX = event.screenX - this.startDragX;
				var deltaY = event.screenY - this.startDragY;

				var w = (this._bRtlMode ? this.originalRectangle.width - deltaX : this.originalRectangle.width + deltaX);
				var h = this.originalRectangle.height + deltaY;

				w = Math.max(w, this._minWidth);
				h = Math.max(h, this._minHeight);

				// The dimension constraints set via API could be in any CSS unit, so just set the size and do checks
				// (min/max override what was set here)
				var oDomRef = this.getDomRef();
				oDomRef.style.width = w + "px";
				oDomRef.style.height = h + "px";

				// Now use the actual size of the dialog, which might have been constrained by min-*/max-* for resizing the popup and the shadow
				w = this.getDomRef().offsetWidth;
				h = this.getDomRef().offsetHeight;

				// In IE8, style.width/height will still have the old values - possibly outside this Dialog's size constraints.
				// The Dialog box itself will stay correctly constrained, but its child elements will be positioned as if the style.width/height
				// values were the actual size, so for this browser - and to be cleaner - explicitly set these sizes. This is an IE8 bug.
				oDomRef.style.width = w + "px";
				oDomRef.style.height = h + "px";

				// Also remember the dimensions for the future (e.g. for after rerendering) - but do not cause rerendering now
				this.setProperty("width", w + "px", true);
				this.setProperty("height", h + "px", true);

			} else if (this.sDragMode == "move") {

				var iLeft = this.originalRectangle.left + event.screenX - this.startDragX;
				var iTop = this.originalRectangle.top + event.screenY - this.startDragY;

				iTop = Math.max(iTop, window.pageYOffset); // should not move the Dialog beyond the top border - otherwise it cannot be moved back
				if (this._bRtlMode || this._keepInWindow()) {
					iLeft = Math.min(iLeft, document.documentElement.clientWidth + window.pageXOffset - this._RootWidth); // in RTL mode, do not move beyond the right window border
				}
				if (!this._bRtlMode || this._keepInWindow()) {
					iLeft = Math.max(iLeft, 0); // in LTR mode do not move the Dialog beyond the left border
				}
				if (this._keepInWindow()) {
					iTop = Math.min(iTop, document.documentElement.clientHeight + window.pageYOffset - this._RootHeight);
				}

				this.oPopup.setPosition(Popup.Dock.LeftTop, {
					left: iLeft,
					top: iTop
				});
			}

			event.cancelBubble = true;
			return false;
		};

		/**
		 * Indicates whether the "keepInWindow" property is set or if the Dialog is modal.
		 * Modal Dialogs mustn't not leave the window also.
		 *
		 * @returns {boolean} if the Dialog must leave the window area
		 * @private
		 */
		Dialog.prototype._keepInWindow = function () {
			return this.getKeepInWindow() || this.getModal();
		};


		/**
		 * Handle mouseup event.
		 * This does the cleanup after drag and move handling.
		 * @param {jQuery.EventObject} oEvent The event object
		 * @private
		 */
		Dialog.prototype.handleMouseUp = function (oEvent) {

			if (this.sDragMode == null) {
				return;
			}

			jQuery(window.document).unbind("selectstart", this.ondragstart);
			jQuery(window.document).unbind("mousemove", this.handleMove);
			jQuery(window.document).unbind("mouseup", this.handleMouseUp);

			var outerDoc = Dialog._findSameDomainParentWinDoc();
			if (outerDoc) {
				jQuery(outerDoc).unbind("selectstart", this.ondragstart);
				jQuery(outerDoc).unbind("mousemove", this.handleMove);
				jQuery(outerDoc).unbind("mouseup", this.handleMouseUp);
			}

			if (!!sap.ui.Device.browser.webkit) {
				//Force Webkit Browsers to do a repaint
				sap.ui.core.RenderManager.forceRepaint(this.getId());
			}

			// Set back focus to previously focused element
			this.restoreFocus();
			this.sDragMode = null;

		};

		Dialog.setAutoClose = function (bAutoclose) {
			this.oPopup.setAutoClose(bAutoclose);
		};
		Dialog.getAutoClose = function () {
			this.oPopup.getAutoClose();
		};


		return Dialog;

	}, /* bExport= */ true);
