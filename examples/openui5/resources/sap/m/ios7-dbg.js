/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
/*global window, document *///declare unusual global vars for JSLint/SAPUI5 validation

sap.ui.define(['jquery.sap.global'],
	function(jQuery) {
	"use strict";


	
		sap.ui.base.EventProvider.extend("sap.m._Ios7", {
			/**
			 * IOS 7 behaves strange if the keyboard is open and you do an orientation change:
			 * There will be a black space below the page and it will scroll away from the top in this case.
			 * Thats why we scroll to the top on orientation change.
			 * We also need to catch blur since if you do orientation change with keyboard open, close the Keyboard, Open it on another input, 
			 * the black box will appear again. Since closing the keyboard will fire blur, we attach on this one.
			 * @private
			 */
			constructor : function() {
				var bIsIOS7Safari = sap.ui.Device.os.ios && sap.ui.Device.os.version >= 7 && sap.ui.Device.os.version < 8 && sap.ui.Device.browser.name === "sf";
	
				//call the base to properly init the event registry
				sap.ui.base.EventProvider.apply(this);
	
				if (!bIsIOS7Safari) {
					return;
				}
	
				this._bIntervallAttached = false;
				this._bInputIsOpen = false;
				this._bNavigationBarEventFired = false;
	
				var bIsLandscape = window.orientation === 90 || window.orientation === -90;
				if (bIsLandscape) {
					this._attachNavigationBarPolling();
				}
	
				sap.ui.Device.orientation.attachHandler(this._onOrientationChange, this);
	
				this._onFocusin =  jQuery.proxy(this._onFocusin, this);
				document.addEventListener("focusin", this._onFocusin , true);
	
				this._onFocusout = jQuery.proxy(this._onFocusout, this);
				//attach this event in the capturing phase, so noone can stop propagation
				document.addEventListener("focusout", this._onFocusout, true);
			}
		});
	
		/*****************************
		internals
		*****************************/
		/**
		 * gets the height of the navigation bar in px. Only returns a number < 0 in landscape mode - will return 0 for portrait mode or if no navigation bar is shown.
		 * @internal
		 * @returns {int} the height of the navigation bar
		 */
		sap.m._Ios7.prototype.getNavigationBarHeight = function () {
			if (!this._bNavigationBarEventFired) {
				return 0;
			}
			return this._iNavigationBarHeight;
		};
	
		/*****************************
		privates
		*****************************/
	
		sap.m._Ios7.prototype._attachNavigationBarPolling = function () {
			if (!sap.ui.Device.system.phone || this._bIntervallAttached) {
				return;
			}
	
			sap.ui.getCore().attachIntervalTimer(this._detectNavigationBar, this);
			this._bIntervallAttached = true;
		};
	
		sap.m._Ios7.prototype._detachNavigationBarPolling = function () {
			if (!sap.ui.Device.system.phone || !this._bIntervallAttached) {
				return;
			}
	
			sap.ui.getCore().detachIntervalTimer(this._detectNavigationBar, this);
			this._bIntervallAttached = false;
		};
	
		//We cannot turn this off in landscape mode, since the inner and outer height might be different when the soft-keyboard pops up.
		//So we need to do a lot of unnecessary scrolls, since keyboard and navigation bar cannot be distinguished.
		sap.m._Ios7.prototype._detectNavigationBar = function () {
			var iHeightDifference = window.outerHeight - window.innerHeight;
	
			if (iHeightDifference === 0 || this._bInputIsOpen || this._bNavigationBarEventFired) {
				this._iPreviousHeight = null;
				return;
			}
	
			if (this._iPreviousHeight === window.innerHeight) {
				window.scrollTo(0,0);
				var iNewWindowHeightDifference = window.outerHeight - window.innerHeight;
				if (iHeightDifference !== iNewWindowHeightDifference) {
					return;
				}
	
				this._iNavigationBarHeight = iHeightDifference;
				this._bNavigationBarEventFired = true;
				this.fireEvent("navigationBarShownInLandscape", { barHeight : iHeightDifference });
				this._detachNavigationBarPolling();
				this._iPreviousHeight = null;
			} else {
				this._iPreviousHeight = window.innerHeight;
			}
		};
	
		sap.m._Ios7.prototype.destroy = function() {
			sap.ui.base.EventProvider.prototype.destroy.apply(this, arguments);
	
			document.removeEventListener("focusin", this._onFocusin , true);
			document.removeEventListener("focusout", this._onFocusout, true);
		};
		/*****************************
		window / document event handling
		*****************************/
	
		/**
		 * @param oEvent the native focusin event
		 * @private
		 */
		sap.m._Ios7.prototype._onFocusin = function (oEvent) {
			var sTagName = oEvent.target.tagName;
	
			if (!sap.m._Ios7._rTagRegex.test(sTagName)) {
				return;
			}
	
			//we have to disable polling while the keyboard is open since scrollTop(0,0) will scroll the input out of the users view
			this._inputTarget = oEvent.target;
			this._detachNavigationBarPolling();
			this._bInputIsOpen = true;
			this.fireEvent("inputOpened");
		};
	
		sap.m._Ios7._rTagRegex = /INPUT|TEXTAREA|SELECT/;
	
		/**
		 * @param oEvent the native focusout event
		 * @private
		 */
		sap.m._Ios7.prototype._onFocusout = function (oEvent) {
			var sTagName = oEvent.srcElement.tagName,
				oRelated = oEvent.relatedTarget,
				sRelatedTag = (oRelated && (oRelated.getAttribute("readonly") === null) && (oRelated.getAttribute("disabled") === null)) ? oRelated.tagName : "";
	
			//only handle the focusout for elements that can bring up a soft-keyboard
			//there are a lot of input types that might not bring up the soft-keyboard - checking for them might be a bit too much
			if (sap.m._Ios7._rTagRegex.test(sTagName) && !sap.m._Ios7._rTagRegex.test(sRelatedTag)) {
				window.scrollTo(0,0);
	
				//Attach the polling again, since it was disabled in the focus in. But only do it in landscape.
				if (window.orientation === 90 || window.orientation === -90) {
					this._attachNavigationBarPolling();
				}
	
				this._bInputIsOpen = false;
				this.fireEvent("inputClosed");
			}
		};
	
		/**
		 * handles the orientation change
		 * @private
		 */
		sap.m._Ios7.prototype._onOrientationChange = function (oEvent) {
			var bIsLandscape = oEvent.landscape;
	
			window.scrollTo(0,0);
	
			this._bNavigationBarEventFired = false;
	
			//The page gets messed up if the softkeyboard is opened
			if (this._bInputIsOpen && this._inputTarget && this._inputTarget.blur) {
				this._inputTarget.blur();
			} else if (bIsLandscape) {
				this._attachNavigationBarPolling();
				//in landscape mode the navigation bar is visible anyways - disable the polling
			} else if (!bIsLandscape) {
				this._detachNavigationBarPolling();
			}
		};
	
		//expose the singleton
		var ios7 = new sap.m._Ios7();
	

	return ios7;

}, /* bExport= */ true);
