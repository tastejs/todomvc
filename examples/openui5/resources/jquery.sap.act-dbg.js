/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides functionality for activity detection
sap.ui.define(['jquery.sap.global'],
	function(jQuery) {
	"use strict";

	if (typeof window.jQuery.sap.act === "object" || typeof window.jQuery.sap.act === "function" ) {
		return jQuery;
	}

	/**
	 * @public
	 * @name jQuery.sap.act
	 * @namespace
	 * @static
	 */

	var _act = {},
		_active = true,
		_deactivatetimer = null,
		_I_MAX_IDLE_TIME = 10000, //max. idle time in ms
		_deactivateSupported = !!window.addEventListener, //Just skip IE8
		_aActivateListeners = [],
		_activityDetected = false,
		_domChangeObserver = null;

	function _onDeactivate(){
		_deactivatetimer = null;
		
		if (_activityDetected) {
			_onActivate();
			return;
		}
		
		_active = false;
		//_triggerEvent(_aDeactivateListeners); //Maybe provide later
		_domChangeObserver.observe(document.documentElement, {childList: true, attributes: true, subtree: true, characterData: true});
	}

	function _onActivate(){
		// Never activate when document is not visible to the user
		if (document.hidden === true) {
			// In case of IE<10 document.visible is undefined, else it is either true or false
			return;
		}

		if (!_active) {
			_active = true;
			_triggerEvent(_aActivateListeners);
			_domChangeObserver.disconnect();
		}
		if (_deactivatetimer) {
			_activityDetected = true;
		} else {
			_deactivatetimer = setTimeout(_onDeactivate, _I_MAX_IDLE_TIME);
			_activityDetected = false;
		}
	}

	function _triggerEvent(aListeners){
		if (aListeners.length == 0) {
			return;
		}
		var aEventListeners = aListeners.slice();
		setTimeout(function(){
			var oInfo;
			for (var i = 0, iL = aEventListeners.length; i < iL; i++) {
				oInfo = aEventListeners[i];
				oInfo.fFunction.call(oInfo.oListener || window);
			}
		}, 0);
	}


	/**
	 * Registers the given handler to the activity event, which is fired when an activity was detected after a certain period of inactivity.
	 * 
	 * The Event is not fired for Internet Explorer 8.
	 * 
	 * @param {Function} fnFunction The function to call, when an activity event occurs.
	 * @param {Object} [oListener] The 'this' context of the handler function.
	 * @protected
	 * 
	 * @function
	 * @name jQuery.sap.act#attachActivate
	 */
	_act.attachActivate = function(fnFunction, oListener){
		_aActivateListeners.push({oListener: oListener, fFunction:fnFunction});
	};

	/**
	 * Deregisters a previously registered handler from the activity event.
	 * 
	 * @param {Function} fnFunction The function to call, when an activity event occurs.
	 * @param {Object} [oListener] The 'this' context of the handler function.
	 * @protected
	 * 
	 * @function
	 * @name jQuery.sap.act#detachActivate
	 */
	_act.detachActivate = function(fnFunction, oListener){
		for (var i = 0, iL = _aActivateListeners.length; i < iL; i++) {
			if (_aActivateListeners[i].fFunction === fnFunction && _aActivateListeners[i].oListener === oListener) {
				_aActivateListeners.splice(i,1);
				break;
			}
		}
	};

	/**
	 * Checks whether recently an activity was detected.
	 * 
	 * Not supported for Internet Explorer 8.
	 * 
	 * @return true if recently an activity was detected, false otherwise
	 * @protected
	 * 
	 * @function
	 * @name jQuery.sap.act#isActive
	 */
	_act.isActive = !_deactivateSupported ? function(){ return true; } : function(){ return _active; };

	/**
	 * Reports an activity.
	 * 
	 * @public
	 * 
	 * @function
	 * @name jQuery.sap.act#refresh
	 */
	_act.refresh = !_deactivateSupported ? function(){} : _onActivate;


	// Setup and registering handlers

	if (_deactivateSupported) {
		var aEvents = ["resize", "orientationchange", "mousemove", "mousedown", "mouseup", //"mouseout", "mouseover",
					   "paste", "cut", "keydown", "keyup", "DOMMouseScroll", "mousewheel"];
		
		if (!!('ontouchstart' in window)) { //touch events supported
			aEvents.push("touchstart", "touchmove", "touchend", "touchcancel");
		}
		
		for (var i = 0; i < aEvents.length; i++) {
			window.addEventListener(aEvents[i], _act.refresh, true);
		}

		if (window.MutationObserver) {
			_domChangeObserver = new window.MutationObserver(_act.refresh);
			} else if (window.WebKitMutationObserver) {
				_domChangeObserver = new window.WebKitMutationObserver(_act.refresh);
			} else {
				_domChangeObserver = {
					observe : function(){
						document.documentElement.addEventListener("DOMSubtreeModified", _act.refresh);
					},
					disconnect : function(){
						document.documentElement.removeEventListener("DOMSubtreeModified", _act.refresh);
					}
				};
			}

		if (typeof (document.hidden) === "boolean") {
			document.addEventListener("visibilitychange", function() {
				// Only trigger refresh if document has changed to visible
				if (document.hidden !== true) {
					_act.refresh();
				}
			}, false);
		}

		_onActivate();
	}

	jQuery.sap.act = _act;

	return jQuery;

});
