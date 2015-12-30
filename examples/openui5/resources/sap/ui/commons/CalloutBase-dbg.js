/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.commons.CalloutBase.
sap.ui.define(['jquery.sap.global', './library', 'sap/ui/core/TooltipBase'],
	function(jQuery, library, TooltipBase) {
	"use strict";



	/**
	 * Constructor for a new CalloutBase.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * CalloutBase is a building block for Callout. Do not use it directly. Use the Callout control instead
	 * @extends sap.ui.core.TooltipBase
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @alias sap.ui.commons.CalloutBase
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var CalloutBase = TooltipBase.extend("sap.ui.commons.CalloutBase", /** @lends sap.ui.commons.CalloutBase.prototype */ { metadata : {

		library : "sap.ui.commons",
		events : {

			/**
			 * The event is fired when the popup is opened.
			 */
			open : {
				parameters : {

					/**
					 * Parent control that has this Callout as a tooltip
					 */
					parent : {type : "sap.ui.core.Control"}
				}
			},

			/**
			 * Event is fired when the Callout window is closed.
			 */
			close : {},

			/**
			 * Event is fired before a Callout is displayed. Call the preventDefault method of the event object to postpone opening. Application may use this event to start asynchronous Ajax call to load the Callout content
			 */
			beforeOpen : {allowPreventDefault : true,
				parameters : {

					/**
					 * Parent control that has this Callout as a tooltip
					 */
					parent : {type : "sap.ui.core.Control"}
				}
			},

			/**
			 * Is fired when the Callout has been opened
			 * @since 1.11.0
			 */
			opened : {}
		}
	}});


	/**
	 * Initializes a new callout base.
	 * Overrides default popup placement and offset of the TooltipBase control
	 *
	 * @private
	 */
	CalloutBase.prototype.init = function() {
		this.oPopup = new sap.ui.core.Popup();
		this.oPopup.setShadow(true);

		// resource bundle
		this.oRb = sap.ui.getCore().getLibraryResourceBundle("sap.ui.commons");

		// override the default position and offset of TooltipBase:
		this.setPosition(sap.ui.core.Popup.Dock.BeginBottom, sap.ui.core.Popup.Dock.BeginTop);

		// listen to global events outside of the callout to close it when needed
		this.fAnyEventHandlerProxy = jQuery.proxy(this.onAnyEvent, this);

		// make this.oPopup call this.setTip each time after its position is changed
		var that = this;
		this.oPopup._applyPosition = function(oPosition){
			sap.ui.core.Popup.prototype._applyPosition.call(this, oPosition);
			that.setTip();
		};

		// close the Callout if its opener moves away (due to scrolling e.g.)
		this.oPopup.setFollowOf(sap.ui.core.Popup.CLOSE_ON_SCROLL);
	};

	/**
	 * Destroys this instance of the callout, called by Element#destroy()
	 * @private
	 */
	CalloutBase.prototype.exit = function() {
		this.oPopup.close();
		this.oPopup.detachEvent("opened", this.handleOpened, this);
		this.oPopup.detachEvent("closed", this.handleClosed, this);
		this.oPopup.destroy();
		delete this.oPopup;
		delete this.oRb;
		jQuery.sap.unbindAnyEvent(this.fAnyEventHandlerProxy);
	};

	/**
	 * Return the popup to use. Each callout has own popup.
	 * (Allow multiple call-outs taking into account pin-up functionality in the next version).
	 * Overrides {@link sap.ui.core.TooltipBase} that has a single common popup for all instances.
	 * @type sap.ui.core.Popup
	 * @return The popup to use
	 * @private
	 */
	CalloutBase.prototype._getPopup = function(){
		return this.oPopup;
	};

	/**
	 * Check if the given DOM reference is child of this control
	 * @param {oDOMNode}
	 * DOM node reference
	 * @private
	 */
	CalloutBase.prototype.hasChild = function(oDOMNode) {
		return oDOMNode && !!(jQuery(oDOMNode).closest(this.getDomRef()).length);
	};

	/**
	 * Check if the given DOM reference is part of a SAPUI5 popup
	 * @param {oDOMNode}
	 * DOM node reference
	 * @private
	 */
	CalloutBase.prototype.isPopupElement = function(oDOMNode) {
		if (!oDOMNode) { return false; }
		if (this.hasChild(oDOMNode)) { return true; }

		var oStatic = sap.ui.getCore().getStaticAreaRef();
		// if oDOMNode belongs to a static area child, get z-index of this child:
		var thatZ = parseInt(jQuery(oDOMNode).closest(jQuery(oStatic).children()).css("z-index"), 10);
		// z-index of this:
		var thisZ = parseInt(this.$().css("z-index"), 10);

		// true if the element has the z-index inside of static area that is higher as the z-index of my control
		return thatZ && thisZ && thatZ >= thisZ;
	};

	/**
	 * Set tip arrow below or above the callout window depending on the popup placement
	 * @private
	 */
	CalloutBase.prototype.setTip = function() {

		if (!this.oPopup || !this.oPopup.isOpen()) {
			return;
		}

		var $parent = this._currentControl.$(),
			$this = this.$(),
			$arrow = this.$("arrow"),
			$offset = $this.offset(),
			$pOffset = $parent.offset(),
			bShow = true,
			dock = {},
			tRect = {
				l:$offset.left,
				r:$offset.left + $this.outerWidth(),
				w:$this.outerWidth(),
				t:$offset.top,
				b:$offset.top + $this.outerHeight(),
				h:$this.outerHeight()
			},
			pRect = {
				l:$pOffset.left,
				r:$pOffset.left + $parent.outerWidth(),
				w:$parent.outerWidth(),
				t:$pOffset.top,
				b:$pOffset.top + $parent.outerHeight(),
				h:$parent.outerHeight()
			},
			borderWidth = ($this.outerWidth() - $this.innerWidth()) / 2,
			arrowWidth = $arrow.outerWidth() * 1.4,
			aw = $arrow.outerWidth() / 5, // (width*sqrt(2)-width)/2
			tipOffset = aw - borderWidth - 8, // offset of the tip to the border should be 8px
			myPosition = this.getMyPosition();

		// right-left pointer
		if ( tRect.r < pRect.l - tipOffset ) {
			dock.x = "right";
		} else if (tRect.l - tipOffset > pRect.r ) {
			dock.x = "left";
		}

		// top-bottom pointer
		if ( tRect.t > pRect.b - tipOffset ) {
			dock.y = "top";
		} else if ( tRect.b < pRect.t + tipOffset ) {
			dock.y = "bottom";
		}

		if (dock.x) { // pointer on the left or right side

			var vPos = 0;
			// Set the vertical position of the pointer, relative to callout:
			//   dock top: top, dock bottom: bottom, dock center: center
			if (myPosition.indexOf("top") > -1) {
				vPos = 20;
			} else if (myPosition.indexOf("bottom") > -1) {
				vPos = tRect.h - 20 - arrowWidth;
			} else { // center
				vPos = (tRect.h - arrowWidth) / 2;
			}

			// adjust if it points outside of the parent or the parent is too small
			// - put it into the middle of intersection
			var tipY = tRect.t + vPos + arrowWidth / 2 + borderWidth;
			if ( (tipY < pRect.t) || (tipY > pRect.b) || (pRect.t > tRect.t && pRect.b < tRect.b)) {
				vPos = (Math.max(tRect.t, pRect.t) + Math.min(tRect.b, pRect.b)) / 2 - tRect.t -  arrowWidth / 2;
			}

			if (!!sap.ui.Device.browser.internet_explorer && sap.ui.Device.browser.version == 8 && dock.x == "left") {
				tipOffset = tipOffset - 8;
			}
			$arrow.css(dock.x, tipOffset + "px");
			$arrow.css("top", vPos);

			// do not show pointer if it cannot be placed inside
			if ( vPos < 0 || vPos > tRect.h - arrowWidth) {
				bShow = false;
			}
		}

		if (dock.y) { // pointer on the top or bottom border
			// switch right to left in case of RTL for the relevant docking (begin & end):
			var bRtl = sap.ui.getCore().getConfiguration().getRTL();
			if (bRtl) { myPosition.replace("begin", "right").replace("end", "left"); }
			var hPos = 0;

			// Set horizontal position of the pointer, relative to callout:
			//   dock left: left, dock right: right, dock center: center
			if ((myPosition.indexOf("begin") > -1) || (myPosition.indexOf("left") > -1)) {
				hPos = 20;
			} else if ((myPosition.indexOf("right") > -1) || (myPosition.indexOf("end") > -1)) {
				hPos = tRect.w - 20 - arrowWidth;
			} else { // center
				hPos = (tRect.w - arrowWidth) / 2;
			}

			// adjust if it points outside of the parent - put it into the middle of intersection
			var tipX = tRect.l + hPos + arrowWidth / 2 + borderWidth;
			if ( (tipX < pRect.l) || (tipX > pRect.r)) {
				hPos = (Math.max(tRect.l, pRect.l) + Math.min(tRect.r, pRect.r)) / 2 - tRect.l - arrowWidth / 2;
			}

			if (!!sap.ui.Device.browser.internet_explorer && sap.ui.Device.browser.version == 8 && dock.y == "top") {
				tipOffset = tipOffset - 8;
			}
			$arrow.css(dock.y, tipOffset + "px");
			$arrow.css("left", hPos + "px");

			// do not show pointer if it cannot be placed inside
			if ( hPos < 0 || hPos > tRect.w - arrowWidth) {
				bShow = false;
			}
		}

		if (dock.x && dock.y || !dock.x && !dock.y) { bShow = false; }

		// hide if the pointer cannot be shown
		$arrow.toggle(bShow);
	};


	/**
	 * Adjust position of the already opened Callout window.
	 * Call this method each time when the size of the opened
	 * Callout window may be changed due to new or changed
	 * contents.
	 *
	 * @type void
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	CalloutBase.prototype.adjustPosition = function() {

		function _adjust(){
			// adjust popup position
			if (this.oPopup) {
				var oParentDomRef = this._currentControl.getDomRef();
				this.oPopup.setPosition(this.getMyPosition(), this.getAtPosition(), oParentDomRef, this.getOffset(), this.getCollision());
			}
		}

		setTimeout( jQuery.proxy( _adjust, this ), 0 );
	};

	/**
	 * @see sap.ui.core.Element.prototype.focus As the callout itself is just a
	 *      frame, focus the first focusable content
	 * @private
	 */
	CalloutBase.prototype.focus = function() {
		if (this.oPopup && this.oPopup.isOpen()) {
			// Focus the first focusable child. If the callout is empty, focus the content container div.
			// Empty callout should be focused too because the contents may appear at a later time point
			// and we need input focus to react to the ESC key.
			var $Content = this.$("cont");
			jQuery.sap.focus($Content.firstFocusableDomRef() || $Content.get(0));
		}
	};

	/**
	 * Open the callout window.
	 *
	 * @param {sap.ui.core.Control}
	 *       parent control that contains the callout
	 * @private
	 */
	CalloutBase.prototype.openPopup = function(oSC) {

		if (!this.oPopup || this.oPopup.isOpen()) {
			return;
		}

		if (TooltipBase.sOpenTimeout) {
			jQuery.sap.clearDelayedCall(TooltipBase.sOpenTimeout);
			TooltipBase.sOpenTimeout = undefined;
		}

		// TODO this._parentControl member not defined! Can't we use oSC instead?
		// fire the "beforeOpen" event and delay display of the Callout if the application requests this
		if (!this.fireEvent("beforeOpen", {parent:this._currentControl}, true, false)) {
			if (!this.sCloseNowTimeout) {
				// postpone opening for 200ms
				TooltipBase.sOpenTimeout = jQuery.sap.delayedCall(200, this, "openPopup", [this._currentControl]);
			}
			return;
		}

		// save parent focus info to be restored after close
		this.oParentFocusInfo = oSC.getFocusInfo();

		this.oPopup.attachEvent("opened", this.handleOpened, this);

		// use TooltipBase to open the pop-up
		TooltipBase.prototype.openPopup.call(this, oSC);

		this.adjustPosition();

		this.fireOpen({ parent : this._currentControl });
	};

	/**
	 * Closes Callout
	 *
	 * @type void
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	CalloutBase.prototype.close = function() {
		if (this.oPopup && this.oPopup.isOpen() && !this.sCloseNowTimeout) {
			if (TooltipBase.sOpenTimeout) {
				jQuery.sap.clearDelayedCall(TooltipBase.sOpenTimeout);
				TooltipBase.sOpenTimeout = undefined;
			}
			this.closePopup();
		}
	};

	/**
	 * Close CalloutBase. Fire the close event.
	 *
	 * @private
	 */
	CalloutBase.prototype.closePopup = function() {
		var bWasOpen = this.oPopup !== undefined && this.oPopup.isOpen();

		if (this.fAnyEventHandlerProxy) {
			jQuery.sap.unbindAnyEvent(this.onAnyEvent);
		}

		// This also attaches the handleClosed function to the closed-event
		TooltipBase.prototype.closePopup.call(this);

		// Set focus to the parent control.
		// Accessibility requirement: a focused Callout should set focus to its parent after close,
		// and not to a control where it could be found originally (In the scenario when a Callout
		// is opened on hover and a control inside it was clicked on with the mouse. This would
		// implicitly mean that a user has moved focus to the parent control intentionally)
		if (bWasOpen && this._currentControl && this.bFocused) {
			this._currentControl.applyFocusInfo(this.oParentFocusInfo);
			this.bFocused = false;
		}

		// inform the application
		this.fireClose();
	};

	/**
	 * Attaches the Callout to the Popup's closed-event and forwards it accordingly to the attached listeners
	 * @private
	 */
	CalloutBase.prototype.handleClosed = function(){
		if (this.oPopup) {
			this.oPopup.detachEvent("closed", this.handleClosed, this);
			this.fireClosed();
		}
	};

	/**
	 * Handle the key down event for ESCAPE and Ctrl-I.
	 *
	 * @param {jQuery.Event}
	 *            oEvent - the event that occurred on the Parent of the Callout.
	 * @private
	 */
	CalloutBase.prototype.onkeydown = function(oEvent) {

		var bCtrlI = oEvent.ctrlKey && oEvent.which == jQuery.sap.KeyCodes.I;
		var bEsc = oEvent.which == jQuery.sap.KeyCodes.ESCAPE;

		if (!bCtrlI && !bEsc) {
			if (jQuery(oEvent.target).control(0) === this._currentControl) {
				// Close callout by any key press on the parent control except for Ctrl-I
				this.close();
			}
			return;
		}

		// do not try to open the same callout twice
		if (bCtrlI) {
			if (this.oPopup && this.oPopup.isOpen()) {
				return; // this is already opened
			}
			this.bDoFocus = true; // accessibility: request focus
		}

		// let the TooltipBase remove/set standard tooltips and open/close the popup
		TooltipBase.prototype.onkeydown.call(this, oEvent);
	};

	/**
	 * If the callout has been opened with a keyboard command, the mouse
	 * pointer is most probably outside: the callout does not receive any
	 * mouseover and mouseout events. Arrange a global mousemove listener
	 * temporarily.
	 * Use case: accessibility testing; advanced users that prefer to work with
	 * keyboard instead of mouse.
	 *
	 * @private
	 */
	CalloutBase.prototype.handleOpened = function() {
		this.oPopup.detachEvent("opened", this.handleOpened, this);

		// The following is needed only of the callout was opened with the keyboard:
		// - request focus (accessibility requirement)
		if (this.bDoFocus) {
			this.focus();
			this.bDoFocus = false;
			this.bFocused = true; // Remember to set focus to parent on close
		}

		this.$().css("display:", "");
		this.fireOpened();

		// - listen to mouse over events outside
		//   do always because the Callout can lose focus to child popup controls
		jQuery.sap.bindAnyEvent(this.fAnyEventHandlerProxy);
	};

	/**
	 * Event handler for the focusin event.
	 * Organize a local tab chain inside of a callout.
	 * If it occurs on the focus handler elements at the beginning of the callout,
	 * the focus is set to the end, and vice versa.
	 * @param {jQuery.EventObject} oEvent The event object
	 * @private
	 */
	CalloutBase.prototype.onfocusin = function(oEvent){

		// Some element has been focused inside of the popup.
		// Focus will be set to the parent after popup close.
		this.bFocused = true;

		var oSourceDomRef = oEvent.target;

		// The same logic as in the Dialog.control:
		if (oSourceDomRef.id === this.getId() + "-fhfe") {
			// the FocusHandlingFirstElement was focused and thus the focus should move to the last element.
			jQuery.sap.focus(this.$("cont").lastFocusableDomRef());
		} else if (oSourceDomRef.id === this.getId() + "-fhee") {
			// the FocusHandlingEndElement was focused and thus the focus should move to the first element.
			jQuery.sap.focus(this.$("cont").firstFocusableDomRef());
		}
	};

	/**
	 * When a control that has a Callout looses the focus to the Callout contents,
	 * do not close it. Override the onfocusout event handler of TooltipBalse.
	 * @param {jQuery.EventObject} the event indication that the focus is lost
	 * @private
	 */
	CalloutBase.prototype.onfocusout = function(oEvent) {
		return;
	};

	/**
	* Handle the mouseover event: do not close if a child control has a simple tooltip
	* @param {jQuery.EventObject} oEvent The event that occurred in the callout
	* @private
	 */
	CalloutBase.prototype.onmouseover = function(oEvent) {
		// do not close my pop-up if it was opened already
		if (this.oPopup && (this.oPopup.isOpen() && this.oPopup.getContent() == this)) {
			if (this.sCloseNowTimeout) {
				jQuery.sap.clearDelayedCall(this.sCloseNowTimeout);
				this.sCloseNowTimeout = null;
			}
			return;
		} else {
			TooltipBase.prototype.onmouseover.call(this, oEvent);
		}
	};

	/**
	 * Handle the mouseout event of a Callout. Override the default TooltipBase behavior when
	 * the mouse pointer is over some other popup on the screen
	 * @param {jQuery.EventObject} oEvent mouseout Event.
	 * @private
	 */
	CalloutBase.prototype.onmouseout = function(oEvent) {
		// Do not close callout when the mouse goes to a popup (like menu)
		if (this.oPopup && (this.oPopup.isOpen() && this.isPopupElement(oEvent.relatedTarget))) {
			return;
		}
		TooltipBase.prototype.onmouseout.call(this, oEvent);
	};

	/**
	 * Always close Callout when the user clicks on the parent control.
	 * @param {jQuery.EventObject} the event
	 * @private
	 */
	CalloutBase.prototype.onmousedown = function(oEvent) {
		if (jQuery(oEvent.target).control(0) === this._currentControl) {
			this.close();
		}
	};

	/**
	 * Handles the outer event of the popup.
	 * @param {sap.ui.core.Event} oControlEvent The event
	 * @private
	 */
	CalloutBase.prototype.onAnyEvent = function(oEvent){

		if ((this.oPopup && !this.oPopup.isOpen()) || oEvent.type != "mouseover" || this.hasChild(oEvent.target)) {
			return;
		}

		// do not close if the hovered element is a top level popup or it is the parent of the callout
		var bDoNotClose = this.isPopupElement(oEvent.target) || jQuery(oEvent.target).control(0) === this._currentControl;
		if (!bDoNotClose && !this.sCloseNowTimeout && !TooltipBase.sOpenTimeout) {
			// schedule close if mouse moved outside of the Popup
			this.sCloseNowTimeout = jQuery.sap.delayedCall(400, this, "closePopup");
		}
		if (bDoNotClose && this.sCloseNowTimeout) {
			// do not close when inside
			jQuery.sap.clearDelayedCall(this.sCloseNowTimeout);
			this.sCloseNowTimeout = null;
		}
	};

	/**
	 * Set position of the Callout window relative to the parent control.
	 * This function automatically calculates and sets the correct offset,
	 * use it instead of <code>setMyPosition/setAtPosition</code>.
	 * @param {sap.ui.core.Dock} myPosition docking position of the Callout
	 * @param {sap.ui.core.Dock} atPosition docking position of the parent control
	 * @return {sap.ui.commons.CalloutBase} <code>this</code> to allow method chaining
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	CalloutBase.prototype.setPosition = function(myPosition, atPosition){

		var myPos = myPosition || sap.ui.core.Popup.Dock.BeginBottom;
		var atPos = atPosition || sap.ui.core.Popup.Dock.BeginTop;

		var myX = 0, myY = 0, atX = 0, atY = 0, gap = 5;

		if ((myPos.indexOf("begin") > -1) || (myPos.indexOf("left") > -1)) {
			myX = -1;
		} else if ((myPos.indexOf("right") > -1) || (myPos.indexOf("end") > -1)) {
			myX = 1;
		}

		if ((atPos.indexOf("begin") > -1) || (atPos.indexOf("left") > -1)) {
			atX = -1;
		} else if ((atPos.indexOf("right") > -1) || (atPos.indexOf("end") > -1)) {
			atX = 1;
		}

		if (myPos.indexOf("top") > -1) {
			myY = -1;
		} else if (myPos.indexOf("bottom") > -1) {
			myY = 1;
		}

		if (atPos.indexOf("top") > -1) {
			atY = -1;
		} else if (atPos.indexOf("bottom") > -1) {
			atY = 1;
		}

		var offset = ((myX - atX) * myX * atX * gap) + " " + ((myY - atY) * myY * atY * gap);

		this.setMyPosition(myPos);
		this.setAtPosition(atPos);
		this.setOffset(offset);

		return this;
	};

	return CalloutBase;

}, /* bExport= */ true);
