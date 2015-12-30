/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// A static class to show a busy indicator
sap.ui.define(['jquery.sap.global', 'sap/ui/Device', '../base/EventProvider', './Popup', './Core', './BusyIndicatorUtils'],
	function(jQuery, Device, EventProvider, Popup, Core, BusyIndicatorUtils) {
	"use strict";

	/**
	 * Provides methods to show or hide a waiting animation covering the whole page and blocking user interaction.
	 * @namespace
	 * @version 1.32.9
	 * @public
	 * @alias sap.ui.core.BusyIndicator
	 */
	var BusyIndicator = jQuery.extend(jQuery.sap.newObject(EventProvider.prototype), {
		oPopup: null,
		oDomRef: null,
		bOpenRequested: false,
		iDEFAULT_DELAY_MS: 1000,
		sDOM_ID: "sapUiBusyIndicator"
	});

	EventProvider.apply(BusyIndicator);

	/**
	 * Map of event names and ids, that are provided by this class
	 * @private
	 * @name sap.ui.core.BusyIndicator.M_EVENTS
	 */
	BusyIndicator.M_EVENTS = {Open: "Open", Close: "Close"};


	/**
	 * Sets up the BusyIndicator HTML and the Popup instance.
	 *
	 * @private
	 * @name sap.ui.core.BusyIndicator._init
	 * @function
	 */
	BusyIndicator._init = function() {
		// Create the graphics element
		// inserts 2 divs:
		// 1. an empty one which will contain the old indicator (used in goldreflection)
		// 2. a div containing the new standard busy indicator (used in bluecrystal)
		var $root = jQuery("<div style='bottom: 0; right: 0;'>" + "<div></div>" + BusyIndicatorUtils.getHTML("Big") + "</div>");
		var oRootDomRef = $root[0];
		oRootDomRef.id = this.sDOM_ID;

		this._oResBundle = sap.ui.getCore().getLibraryResourceBundle("sap.ui.core");
		var sTitle = this._oResBundle.getText("BUSY_TEXT");
		delete this._oResBundle;

		// Render into invisible area, so the size settings from CSS are applied
		var oInvisible = sap.ui.getCore().getStaticAreaRef();
		oInvisible.appendChild($root[0]);
		
		jQuery($root.children()[0]).addClass("sapUiBusy").attr("tabindex", 0).attr("role", "progressbar").attr("alt", "").attr("title", sTitle);
		jQuery($root.children()[1]).addClass("sapUiLocalBusyIndicatorSizeBig").attr("title", sTitle);
		
		this.oDomRef = oRootDomRef;

		this.oPopup = new Popup(oRootDomRef);
		this.oPopup.setModal(true, "sapUiBlyBusy");
		this.oPopup.setShadow(false);

		// since IE <9 isn't able to use CSS animations a JS-animation is needed
		if (Device.browser.msie &&  Device.browser.version <= 9) {
			this._iBusyPageWidth = jQuery(document.body).width();
			this._iBusyLeft = 0;
			this._iBusyDelta = 60;
			this._iBusyTimeStep = 50;
			this._iBusyWidth = 500;

			this.attachOpen(function () {
				BusyIndicatorUtils.animateIE9.start(jQuery($root.children()[1]));
				this._IEAnimation(jQuery($root.children()[0]));
			}, this);
		}
	};

	/**
	 * Animates the BusyIndicator for InternetExplorer <=9
	 *
	 * @private
	 * @name sap.ui.core.BusyIndicator._IEAnimation
	 * @function
	 */
	BusyIndicator._IEAnimation = function($BusyIndicator) {
		if (!this._$BusyIndicator && $BusyIndicator) {
			// save the DOM-Ref when function is called for the first time to save
			// the expensive DOM-calls during animation
			this._$BusyIndicator = $BusyIndicator;
		}
		jQuery.sap.clearDelayedCall(this._iAnimationTimeout);

		this._iBusyLeft += this._iBusyDelta;
		if (this._iBusyLeft > this._iBusyPageWidth) {
			this._iBusyLeft = -this._iBusyWidth;
		}
		if (!this._$BusyIndicator) {
			// DOM-Ref is removed when the BusyIndicator was hidden -> stop the animation and delayed calls
			jQuery.sap.clearDelayedCall(this._iAnimationTimeout);
		} else {
			this._$BusyIndicator.css("background-position", this._iBusyLeft + "px 0px");
			this._iAnimationTimeout = jQuery.sap.delayedCall(this._iBusyTimeStep, this, this._IEAnimation);
		}
	};

	/**
	 * Displays the BusyIndicator and starts blocking all user input.
	 * This only happens after some delay and if after that delay the BusyIndicator.hide() has not yet been called in the meantime.
	 * There is a certain default value for the delay, but that one can be overridden.
	 *
	 * @public
	 * @param {int} [iDelay] The delay in milliseconds before opening the BusyIndicator. It is not opened if hide() is called before end of the delay. If no delay (or no valid delay) is given, the default value is used.
	 * @name sap.ui.core.BusyIndicator.show
	 * @function
	 */
	BusyIndicator.show = function(iDelay) {
		jQuery.sap.log.debug("sap.ui.core.BusyIndicator.show (delay: " + iDelay + ") at " + new Date().getTime());

		jQuery.sap.assert(iDelay === undefined || (typeof iDelay == "number" && (iDelay % 1 == 0)), "iDelay must be empty or an integer");

		if ((iDelay === undefined)
				|| ((iDelay != 0) && (parseInt(iDelay, 10) == 0))
				|| (parseInt(iDelay, 10) < 0)) {
			iDelay = this.iDEFAULT_DELAY_MS;
		}

		this.bOpenRequested = true;
		if (iDelay === 0) { // avoid async call when there is no delay
			this._showNowIfRequested();
		} else {
			jQuery.sap.delayedCall(iDelay, this, "_showNowIfRequested");
		}
	};


	/**
	 * Immediately displays the BusyIndicator if the application has not called hide() yet.
	 *
	 * @private
	 * @name sap.ui.core.BusyIndicator._showNowIfRequested
	 * @function
	 */
	BusyIndicator._showNowIfRequested = function() {
		jQuery.sap.log.debug("sap.ui.core.BusyIndicator._showNowIfRequested (bOpenRequested: " + this.bOpenRequested + ") at " + new Date().getTime());

		// Do not open if the request has been canceled in the meantime
		if (!this.bOpenRequested) {
			return;
		}

		// If body/Core are not available yet, give them some more time and open later if still required
		if (!document.body || !sap.ui.getCore().isInitialized()) {
			jQuery.sap.delayedCall(100, this, "_showNowIfRequested");
			return;
		}

		this.bOpenRequested = false; // opening request is handled

		// Initialize/create the BusyIndicator if this has not been done yet
		if (!this.oDomRef) {
			this._init();
		}

		var that = this;
		var fnOpened = function() {
			that.oPopup.detachOpened(fnOpened);
			// allow an event handler to do something with the indicator
			that.fireOpen({
				$Busy: that.oPopup._$()
			});

			// Grab the focus once opened
			var oDomRef = jQuery.sap.domById(BusyIndicator.sDOM_ID);
			jQuery.sap.focus(oDomRef);

			jQuery("body").attr("aria-busy", true);
		};

		// Actually open the popup
		this.oPopup.attachOpened(fnOpened);
		this.oPopup.open(0, Popup.Dock.LeftTop, Popup.Dock.LeftTop, document);
	};

	/**
	 * Removes the BusyIndicator from the screen
	 *
	 * @public
	 * @name sap.ui.core.BusyIndicator.hide
	 * @function
	 */
	BusyIndicator.hide = function() {
		jQuery.sap.log.debug("sap.ui.core.BusyIndicator.hide at " + new Date().getTime());

		var bi = BusyIndicator; // Restore scope in case we are called with setTimeout or so...

		bi.bOpenRequested = false;

		if (bi.oDomRef) { // only if the BusyIndicator was shown before!
			jQuery("body").removeAttr("aria-busy");

			// allow an event handler to do something with the indicator
			this.fireClose({$Busy: this.oPopup._$()});

			bi.oPopup.close(0);
		}

		delete this._$BusyIndicator;
	};


	/*  EVENT HANDLING */

	/**
	 * Registers a handler for the "open" event.
	 *
	 * @param {function}
	 *            fnFunction The function to call, when the event occurs. This function will be called on the
	 *            oListener-instance (if present) or in a 'static way'.
	 * @param {object}
	 *            [oListener] Object on which to call the given function.
	 * @return {sap.ui.core.BusyIndicator} <code>this</code> to allow method chaining
	 * @public
	 * @name sap.ui.core.BusyIndicator.attachOpen
	 * @function
	 */
	BusyIndicator.attachOpen = function(fnFunction, oListener) {
		this.attachEvent(BusyIndicator.M_EVENTS.Open, fnFunction, oListener);
		return this;
	};

	/**
	 * Unregisters a handler for the "open" event
	 * @param {function}
	 *            fnFunction The callback function to unregister
	 * @param {object}
	 *            oListener Object on which the given function had to be called.
	 * @return {sap.ui.core.BusyIndicator} <code>this</code> to allow method chaining
	 * @public
	 * @name sap.ui.core.BusyIndicator.detachOpen
	 * @function
	 */
	BusyIndicator.detachOpen = function(fnFunction, oListener) {
		this.detachEvent(BusyIndicator.M_EVENTS.Open, fnFunction, oListener);
		return this;
	};

	/**
	 * Registers a handler for the "close" event
	 *
	 * @param {function}
	 *            fnFunction The function to call, when the event occurs. This function will be called on the
	 *            oListener-instance (if present) or in a 'static way'.
	 * @param {object}
	 *            [oListener] Object on which to call the given function.
	 * @return {sap.ui.core.BusyIndicator} <code>this</code> to allow method chaining
	 * @public
	 * @name sap.ui.core.BusyIndicator.attachClose
	 * @function
	 */
	BusyIndicator.attachClose = function(fnFunction, oListener) {
		this.attachEvent(BusyIndicator.M_EVENTS.Close, fnFunction, oListener);
		return this;
	};

	/**
	 * Unregisters a handler for the "close" event
	 *
	 * @param {function}
	 *            fnFunction The callback function to unregister
	 * @param {object}
	 *            oListener Object on which the given function had to be called.
	 * @return {sap.ui.core.BusyIndicator} <code>this</code> to allow method chaining
	 * @public
	 * @name sap.ui.core.BusyIndicator.detachClose
	 * @function
	 */
	BusyIndicator.detachClose = function(fnFunction, oListener) {
		this.detachEvent(BusyIndicator.M_EVENTS.Close, fnFunction, oListener);
		return this;
	};

	BusyIndicator.fireOpen = function(mParameters) {
		this.fireEvent(BusyIndicator.M_EVENTS.Open, mParameters);
	};

	BusyIndicator.fireClose = function(mParameters) {
		this.fireEvent(BusyIndicator.M_EVENTS.Close, mParameters);
	};

	return BusyIndicator;

}, /* bExport= */ true);
