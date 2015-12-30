/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides functionality related to eventing.
sap.ui.define(['jquery.sap.global', 'sap/ui/Device', 'jquery.sap.keycodes'],
	function(jQuery, Device/* , jQuerySap1 */) {
	"use strict";

	var onTouchStart,
		onTouchMove,
		onTouchEnd,
		onTouchCancel,
		onMouseEvent,
		aMouseEvents,
		bIsSimulatingTouchToMouseEvent = false;

	if (Device.browser.webkit && /Mobile/.test(navigator.userAgent) && Device.support.touch) {

		bIsSimulatingTouchToMouseEvent = true;

		(function() {
			var document = window.document,
				bHandleEvent = false,
				oTarget = null,
				bIsMoved = false,
				iStartX,
				iStartY,
				i = 0;

			aMouseEvents = ["mousedown", "mouseover", "mouseup", "mouseout", "click"];

			/**
			 * Fires a synthetic mouse event for a given type and native touch event.
			 * @param {String} sType the type of the synthetic event to fire, e.g. "mousedown"
			 * @param {jQuery.Event} oEvent the event object
			 * @private
			 */
			var fireMouseEvent = function(sType, oEvent) {

				if (!bHandleEvent) {
					return;
				}

				// we need mapping of the different event types to get the correct target
				var oMappedEvent = oEvent.type == "touchend" ? oEvent.changedTouches[0] : oEvent.touches[0];

				// create the synthetic event
				var newEvent = document.createEvent('MouseEvent');  // trying to create an actual TouchEvent will create an error
				newEvent.initMouseEvent(sType, true, true, window, oEvent.detail,
						oMappedEvent.screenX, oMappedEvent.screenY, oMappedEvent.clientX, oMappedEvent.clientY,
						oEvent.ctrlKey, oEvent.shiftKey, oEvent.altKey, oEvent.metaKey,
						oEvent.button, oEvent.relatedTarget);

				newEvent.isSynthetic = true;

				// Timeout needed. Do not interrupt the native event handling.
				window.setTimeout(function() {
						oTarget.dispatchEvent(newEvent);
				}, 0);
			};

			/**
			 * Checks if the target of the event is an input field.
			 * @param {jQuery.Event} oEvent the event object
			 * @return {Boolean} whether the target of the event is an input field.
			 */
			var isInputField = function(oEvent) {
				return oEvent.target.tagName.match(/input|textarea|select/i);
			};

			/**
			 * Mouse event handler. Prevents propagation for native events. 
			 * @param {jQuery.Event} oEvent the event object
			 * @private
			 */
			onMouseEvent = function(oEvent) {
				if (!oEvent.isSynthetic && !isInputField(oEvent)) {
					oEvent.stopPropagation();
					oEvent.preventDefault();
				}
			};

			/**
			 * Touch start event handler. Called whenever a finger is added to the surface. Fires mouse start event.
			 * @param {jQuery.Event} oEvent the event object
			 * @private
			 */
			onTouchStart = function(oEvent) {
				var oTouches = oEvent.touches,
					oTouch;

				bHandleEvent = (oTouches.length == 1 && !isInputField(oEvent));

				bIsMoved = false;
				if (bHandleEvent) {
					oTouch = oTouches[0];

					// As we are only interested in the first touch target, we remember it
					oTarget = oTouch.target;
					if (oTarget.nodeType === 3) {

						// no text node
						oTarget = oTarget.parentNode;
					}

					// Remember the start position of the first touch to determine if a click was performed or not.
					iStartX = oTouch.clientX;
					iStartY = oTouch.clientY;
					fireMouseEvent("mousedown", oEvent);
				}
			};

			/**
			 * Touch move event handler. Fires mouse move event.
			 * @param {jQuery.Event} oEvent the event object
			 * @private
			 */
			onTouchMove = function(oEvent) {
				var oTouch;

				if (bHandleEvent) {
					oTouch = oEvent.touches[0];

					// Check if the finger is moved. When the finger was moved, no "click" event is fired.
					if (Math.abs(oTouch.clientX - iStartX) > 10 || Math.abs(oTouch.clientY - iStartY) > 10) {
						bIsMoved = true;
					}

					if (bIsMoved) {

						// Fire "mousemove" event only when the finger was moved. This is to prevent unwanted movements. 
						fireMouseEvent("mousemove", oEvent);
					}
				}
			};

			/**
			 * Touch end event handler. Fires mouse up and click event.
			 * @param {jQuery.Event} oEvent the event object
			 * @private
			 */
			onTouchEnd = function(oEvent) {
				fireMouseEvent("mouseup", oEvent);
				if (!bIsMoved) {
					fireMouseEvent("click", oEvent);
				}
			};

			/**
			 * Touch cancel event handler. Fires mouse up event.
			 * @param {jQuery.Event} oEvent the event object
			 * @private
			 */
			onTouchCancel = function(oEvent) {
				fireMouseEvent("mouseup", oEvent);
			};

			// Bind mouse events
			for (; i < aMouseEvents.length; i++) {

				// Add click on capturing phase to prevent propagation if necessary
				document.addEventListener(aMouseEvents[i], onMouseEvent, true);
			}

			// Bind touch events
			document.addEventListener('touchstart', onTouchStart, true);
			document.addEventListener('touchmove', onTouchMove, true);
			document.addEventListener('touchend', onTouchEnd, true);
			document.addEventListener('touchcancel', onTouchCancel, true);
			
			/**
			 * Disable touch to mouse handling
			 *
			 * @public
			 */
			jQuery.sap.disableTouchToMouseHandling = function() {
				var i = 0;

				if (!bIsSimulatingTouchToMouseEvent) {
					return;
				}

				// unbind touch events
				document.removeEventListener('touchstart', onTouchStart, true);
				document.removeEventListener('touchmove', onTouchMove, true);
				document.removeEventListener('touchend', onTouchEnd, true);
				document.removeEventListener('touchcancel', onTouchCancel, true);

				// unbind mouse events
				for (; i < aMouseEvents.length; i++) {
					document.removeEventListener(aMouseEvents[i], onMouseEvent, true);
				}
			};
			
		}());
	}
	
	if (!jQuery.sap.disableTouchToMouseHandling) {
		jQuery.sap.disableTouchToMouseHandling = function() {};
	}

	/**
	 * List of DOM events that a UIArea automatically takes care of.
	 *
	 * A control/element doesn't have to bind listeners for these events.
	 * It instead can implement an <code>on<i>event</i>(oEvent)</code> method
	 * for any of the following events that it wants to be notified about:
	 * 
	 * click, dblclick, contextmenu, focusin, focusout, keydown, keypress, keyup, mousedown, mouseout, mouseover, 
	 * mouseup, select, selectstart, dragstart, dragenter, dragover, dragleave, dragend, drop, paste, cut, input
	 * 
	 * In case touch events are natively supported the following events are available in addition:
	 * touchstart, touchend, touchmove, touchcancel
	 *
	 * @public
	 */
	jQuery.sap.ControlEvents = [  // IMPORTANT: update the public documentation when extending this list
		"click",
		"dblclick",
		"contextmenu",
		"focusin",
		"focusout",
		"keydown",
		"keypress",
		"keyup",
		"mousedown",
		"mouseout",
		"mouseover",
		"mouseup",
		"select",
		"selectstart",
		"dragstart",
		"dragenter",
		"dragover",
		"dragleave",
		"dragend",
		"drop",
		"paste",
		"cut",
		
		/* input event is fired synchronously on IE9+ when the value of an <input> or <textarea> element is changed */
		/* for more details please see : https://developer.mozilla.org/en-US/docs/Web/Reference/Events/input */
		"input"
	];

	// touch events natively supported
	if (Device.support.touch) {

		// Define additional native events to be added to the event list.
		// TODO: maybe add "gesturestart", "gesturechange", "gestureend" later?
		jQuery.sap.ControlEvents.push("touchstart", "touchend", "touchmove", "touchcancel");
	}

	/**
	 * Enumeration of all so called "pseudo events", a useful classification
	 * of standard browser events as implied by SAP product standards.
	 *
	 * Whenever a browser event is recognized as one or more pseudo events, then this
	 * classification is attached to the original {@link jQuery.Event} object and thereby
	 * delivered to any jQuery-style listeners registered for that browser event.
	 *
	 * Pure JavaScript listeners can evaluate the classification information using
	 * the {@link jQuery.Event#isPseudoType} method.
	 *
	 * Instead of using the procedure as described above, the SAPUI5 controls and elements
	 * should simply implement an <code>on<i>pseudo-event</i>(oEvent)</code> method. It will
	 * be invoked only when that specific pseudo event has been recognized. This simplifies event
	 * dispatching even further.
	 *
	 * @namespace
	 * @public
	 */
	jQuery.sap.PseudoEvents = { // IMPORTANT: update the public documentation when extending this list

		/* Pseudo keyboard events */

		/**
		 * Pseudo event for keyboard arrow down without modifiers (Ctrl, Alt or Shift)
		 * @public
		 */
		sapdown: {sName: "sapdown", aTypes: ["keydown"], fnCheck: function (oEvent) {
			return oEvent.keyCode == jQuery.sap.KeyCodes.ARROW_DOWN && !hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for keyboard arrow down with modifiers (Ctrl, Alt or Shift)
		 * @public
		 */
		sapdownmodifiers: {sName: "sapdownmodifiers", aTypes: ["keydown"], fnCheck: function(oEvent) {
			return oEvent.keyCode == jQuery.sap.KeyCodes.ARROW_DOWN && hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for pseudo 'show' event (F4, Alt + down-Arrow)
		 * @public
		 */
		sapshow: {sName: "sapshow", aTypes: ["keydown"], fnCheck: function(oEvent) {
			return (oEvent.keyCode == jQuery.sap.KeyCodes.F4 && !hasModifierKeys(oEvent)) ||
				(oEvent.keyCode == jQuery.sap.KeyCodes.ARROW_DOWN && checkModifierKeys(oEvent, /*Ctrl*/false, /*Alt*/true, /*Shift*/false));
		}},

		/**
		 * Pseudo event for keyboard arrow up without modifiers (Ctrl, Alt or Shift)
		 * @public
		 */
		sapup: {sName: "sapup", aTypes: ["keydown"], fnCheck: function(oEvent) {
			return oEvent.keyCode == jQuery.sap.KeyCodes.ARROW_UP && !hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for keyboard arrow up with modifiers (Ctrl, Alt or Shift)
		 * @public
		 */
		sapupmodifiers: {sName: "sapupmodifiers", aTypes: ["keydown"], fnCheck: function(oEvent) {
			return oEvent.keyCode == jQuery.sap.KeyCodes.ARROW_UP && hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for pseudo 'hide' event (Alt + up-Arrow)
		 * @public
		 */
		saphide: {sName: "saphide", aTypes: ["keydown"], fnCheck: function(oEvent) {
			return oEvent.keyCode == jQuery.sap.KeyCodes.ARROW_UP && checkModifierKeys(oEvent, /*Ctrl*/false, /*Alt*/true, /*Shift*/false);
		}},

		/**
		 * Pseudo event for keyboard arrow left without modifiers (Ctrl, Alt or Shift)
		 * @public
		 */
		sapleft: {sName: "sapleft", aTypes: ["keydown"], fnCheck: function(oEvent) {
			return oEvent.keyCode == jQuery.sap.KeyCodes.ARROW_LEFT && !hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for keyboard arrow left with modifiers (Ctrl, Alt or Shift)
		 * @public
		 */
		sapleftmodifiers: {sName: "sapleftmodifiers", aTypes: ["keydown"], fnCheck: function(oEvent) {
			return oEvent.keyCode == jQuery.sap.KeyCodes.ARROW_LEFT && hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for keyboard arrow right without modifiers (Ctrl, Alt or Shift)
		 * @public
		 */
		sapright: {sName: "sapright", aTypes: ["keydown"], fnCheck: function(oEvent) {
			return oEvent.keyCode == jQuery.sap.KeyCodes.ARROW_RIGHT && !hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for keyboard arrow right with modifiers (Ctrl, Alt or Shift)
		 * @public
		 */
		saprightmodifiers: {sName: "saprightmodifiers", aTypes: ["keydown"], fnCheck: function(oEvent) {
			return oEvent.keyCode == jQuery.sap.KeyCodes.ARROW_RIGHT && hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for keyboard Home/Pos1 with modifiers (Ctrl, Alt or Shift)
		 * @public
		 */
		saphome: {sName: "saphome", aTypes: ["keydown"], fnCheck: function(oEvent) {
			return oEvent.keyCode == jQuery.sap.KeyCodes.HOME && !hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for keyboard Home/Pos1 without modifiers (Ctrl, Alt or Shift)
		 * @public
		 */
		saphomemodifiers: {sName: "saphomemodifiers", aTypes: ["keydown"], fnCheck: function(oEvent) {
			return oEvent.keyCode == jQuery.sap.KeyCodes.HOME && hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for  pseudo top event
		 * @public
		 */
		saptop: {sName: "saptop", aTypes: ["keydown"], fnCheck: function(oEvent) {
			return oEvent.keyCode == jQuery.sap.KeyCodes.HOME && checkModifierKeys(oEvent, /*Ctrl*/true, /*Alt*/false, /*Shift*/false);
		}},

		/**
		 * Pseudo event for keyboard End without modifiers (Ctrl, Alt or Shift)
		 * @public
		 */
		sapend: {sName: "sapend", aTypes: ["keydown"], fnCheck: function(oEvent) {
			return oEvent.keyCode == jQuery.sap.KeyCodes.END && !hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for keyboard End with modifiers (Ctrl, Alt or Shift)
		 * @public
		 */
		sapendmodifiers: {sName: "sapendmodifiers", aTypes: ["keydown"], fnCheck: function(oEvent) {
			return oEvent.keyCode == jQuery.sap.KeyCodes.END && hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for pseudo bottom event
		 * @public
		 */
		sapbottom: {sName: "sapbottom", aTypes: ["keydown"], fnCheck: function(oEvent) {
			return oEvent.keyCode == jQuery.sap.KeyCodes.END && checkModifierKeys(oEvent, /*Ctrl*/true, /*Alt*/false, /*Shift*/false);
		}},

		/**
		 * Pseudo event for keyboard page up without modifiers (Ctrl, Alt or Shift)
		 * @public
		 */
		sappageup: {sName: "sappageup", aTypes: ["keydown"], fnCheck: function(oEvent) {
			return oEvent.keyCode == jQuery.sap.KeyCodes.PAGE_UP && !hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for keyboard page up with modifiers (Ctrl, Alt or Shift)
		 * @public
		 */
		sappageupmodifiers: {sName: "sappageupmodifiers", aTypes: ["keydown"], fnCheck: function(oEvent) {
			return oEvent.keyCode == jQuery.sap.KeyCodes.PAGE_UP && hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for keyboard page down without modifiers (Ctrl, Alt or Shift)
		 * @public
		 */
		sappagedown: {sName: "sappagedown", aTypes: ["keydown"], fnCheck: function(oEvent) {
			return oEvent.keyCode == jQuery.sap.KeyCodes.PAGE_DOWN && !hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for keyboard page down with modifiers (Ctrl, Alt or Shift)
		 * @public
		 */
		sappagedownmodifiers: {sName: "sappagedownmodifiers", aTypes: ["keydown"], fnCheck: function(oEvent) {
			return oEvent.keyCode == jQuery.sap.KeyCodes.PAGE_DOWN && hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for pseudo 'select' event... space, enter, ... without modifiers (Ctrl, Alt or Shift)
		 * @public
		 */
		sapselect: {sName: "sapselect", aTypes: ["keydown"], fnCheck: function(oEvent) {
			return (oEvent.keyCode == jQuery.sap.KeyCodes.ENTER || oEvent.keyCode == jQuery.sap.KeyCodes.SPACE) && !hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for pseudo 'select' event... space, enter, ... with modifiers (Ctrl, Alt or Shift)
		 * @public
		 */
		sapselectmodifiers: {sName: "sapselectmodifiers", aTypes: ["keydown"], fnCheck: function(oEvent) {
			return (oEvent.keyCode == jQuery.sap.KeyCodes.ENTER || oEvent.keyCode == jQuery.sap.KeyCodes.SPACE) && hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for keyboard space without modifiers (Ctrl, Alt or Shift)
		 * @public
		 */
		sapspace: {sName: "sapspace", aTypes: ["keydown"], fnCheck: function(oEvent) {
			return oEvent.keyCode == jQuery.sap.KeyCodes.SPACE && !hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for keyboard space with modifiers (Ctrl, Alt or Shift)
		 * @public
		 */
		sapspacemodifiers: {sName: "sapspacemodifiers", aTypes: ["keydown"], fnCheck: function(oEvent) {
			return oEvent.keyCode == jQuery.sap.KeyCodes.SPACE && hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for keyboard enter without modifiers (Ctrl, Alt or Shift)
		 * @public
		 */
		sapenter: {sName: "sapenter", aTypes: ["keydown"], fnCheck: function(oEvent) {
			return oEvent.keyCode == jQuery.sap.KeyCodes.ENTER && !hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for keyboard enter with modifiers (Ctrl, Alt or Shift)
		 * @public
		 */
		sapentermodifiers: {sName: "sapentermodifiers", aTypes: ["keydown"], fnCheck: function(oEvent) {
			return oEvent.keyCode == jQuery.sap.KeyCodes.ENTER && hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for keyboard backspace without modifiers (Ctrl, Alt or Shift)
		 * @public
		 */
		sapbackspace: {sName: "sapbackspace", aTypes: ["keydown"], fnCheck: function(oEvent) {
			return oEvent.keyCode == jQuery.sap.KeyCodes.BACKSPACE && !hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for keyboard backspace with modifiers (Ctrl, Alt or Shift)
		 * @public
		 */
		sapbackspacemodifiers: {sName: "sapbackspacemodifiers", aTypes: ["keydown"], fnCheck: function(oEvent) {
			return oEvent.keyCode == jQuery.sap.KeyCodes.BACKSPACE && hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for keyboard delete without modifiers (Ctrl, Alt or Shift)
		 * @public
		 */
		sapdelete: {sName: "sapdelete", aTypes: ["keydown"], fnCheck: function(oEvent) {
			return oEvent.keyCode == jQuery.sap.KeyCodes.DELETE && !hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for keyboard delete with modifiers (Ctrl, Alt or Shift)
		 * @public
		 */
		sapdeletemodifiers: {sName: "sapdeletemodifiers", aTypes: ["keydown"], fnCheck: function(oEvent) {
			return oEvent.keyCode == jQuery.sap.KeyCodes.DELETE && hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for pseudo expand event (keyboard numpad +) without modifiers (Ctrl, Alt or Shift)
		 * @public
		 */
		sapexpand: {sName: "sapexpand", aTypes: ["keydown"], fnCheck: function(oEvent) {
			return oEvent.keyCode == jQuery.sap.KeyCodes.NUMPAD_PLUS && !hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for pseudo expand event (keyboard numpad +) with modifiers (Ctrl, Alt or Shift)
		 * @public
		 */
		sapexpandmodifiers: {sName: "sapexpandmodifiers", aTypes: ["keydown"], fnCheck: function(oEvent) {
			return oEvent.keyCode == jQuery.sap.KeyCodes.NUMPAD_PLUS && hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for pseudo collapse event (keyboard numpad -) without modifiers (Ctrl, Alt or Shift)
		 * @public
		 */
		sapcollapse: {sName: "sapcollapse", aTypes: ["keydown"], fnCheck: function(oEvent) {
			return oEvent.keyCode == jQuery.sap.KeyCodes.NUMPAD_MINUS && !hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for pseudo collapse event (keyboard numpad -) with modifiers (Ctrl, Alt or Shift)
		 * @public
		 */
		sapcollapsemodifiers: {sName: "sapcollapsemodifiers", aTypes: ["keydown"], fnCheck: function(oEvent) {
			return oEvent.keyCode == jQuery.sap.KeyCodes.NUMPAD_MINUS && hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for pseudo collapse event (keyboard numpad *)
		 * @public
		 */
		sapcollapseall: {sName: "sapcollapseall", aTypes: ["keydown"], fnCheck: function(oEvent) {
			return oEvent.keyCode == jQuery.sap.KeyCodes.NUMPAD_ASTERISK && !hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for keyboard escape
		 * @public
		 */
		sapescape: {sName: "sapescape", aTypes: ["keydown"], fnCheck: function(oEvent) {
			return oEvent.keyCode == jQuery.sap.KeyCodes.ESCAPE && !hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for keyboard tab (TAB + no modifier)
		 * @public
		 */
		saptabnext: {sName: "saptabnext", aTypes: ["keydown"], fnCheck: function(oEvent) {
			return oEvent.keyCode == jQuery.sap.KeyCodes.TAB && !hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for keyboard tab (TAB + shift modifier)
		 * @public
		 */
		saptabprevious: {sName: "saptabprevious", aTypes: ["keydown"], fnCheck: function(oEvent) {
			return oEvent.keyCode == jQuery.sap.KeyCodes.TAB && checkModifierKeys(oEvent, /*Ctrl*/false, /*Alt*/false, /*Shift*/true);
		}},

		/**
		 * Pseudo event for pseudo skip forward (F6 + no modifier)
		 * @public
		 */
		sapskipforward: {sName: "sapskipforward", aTypes: ["keydown"], fnCheck: function(oEvent) {
			return oEvent.keyCode == jQuery.sap.KeyCodes.F6 && !hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for pseudo skip back (F6 + shift modifier)
		 * @public
		 */
		sapskipback: {sName: "sapskipback", aTypes: ["keydown"], fnCheck: function(oEvent) {
			return oEvent.keyCode == jQuery.sap.KeyCodes.F6 && checkModifierKeys(oEvent, /*Ctrl*/false, /*Alt*/false, /*Shift*/true);
		}},

		//// contextmenu Shift-F10 hack
		//{sName: "sapcontextmenu", aTypes: ["keydown"], fnCheck: function(oEvent) {
		//	return oEvent.keyCode == jQuery.sap.KeyCodes.F10 && checkModifierKeys(oEvent, /*Ctrl*/false, /*Alt*/false, /*Shift*/true);
		//}},

		/**
		 * Pseudo event for pseudo 'decrease' event without modifiers (Ctrl, Alt or Shift)
		 * @public
		 */
		sapdecrease: {sName: "sapdecrease", aTypes: ["keydown"], fnCheck: function(oEvent) {
			var bRtl = sap.ui.getCore().getConfiguration().getRTL();
			var iPreviousKey = bRtl ? jQuery.sap.KeyCodes.ARROW_RIGHT : jQuery.sap.KeyCodes.ARROW_LEFT;
			return (oEvent.keyCode == iPreviousKey || oEvent.keyCode == jQuery.sap.KeyCodes.ARROW_DOWN) && !hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for pressing the '-' (minus) sign.
		 * @since 1.25.0
		 * @experimental Since 1.25.0 Implementation details can be changed in future.
		 * @public
		 */
		sapminus: {sName: "sapminus", aTypes: ["keypress"], fnCheck: function(oEvent) {
			var sCharCode = String.fromCharCode(oEvent.which);
			return sCharCode == '-';
		}},

		/**
		 * Pseudo event for pseudo 'decrease' event with modifiers (Ctrl, Alt or Shift)
		 * @public
		 */
		sapdecreasemodifiers: {sName: "sapdecreasemodifiers", aTypes: ["keydown"], fnCheck: function(oEvent) {
			var bRtl = sap.ui.getCore().getConfiguration().getRTL();
			var iPreviousKey = bRtl ? jQuery.sap.KeyCodes.ARROW_RIGHT : jQuery.sap.KeyCodes.ARROW_LEFT;
			return (oEvent.keyCode == iPreviousKey || oEvent.keyCode == jQuery.sap.KeyCodes.ARROW_DOWN) && hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for pseudo 'increase' event without modifiers (Ctrl, Alt or Shift)
		 * @public
		 */
		sapincrease: {sName: "sapincrease", aTypes: ["keydown"], fnCheck: function(oEvent) {
			var bRtl = sap.ui.getCore().getConfiguration().getRTL();
			var iNextKey = bRtl ? jQuery.sap.KeyCodes.ARROW_LEFT : jQuery.sap.KeyCodes.ARROW_RIGHT;
			return (oEvent.keyCode == iNextKey || oEvent.keyCode == jQuery.sap.KeyCodes.ARROW_UP) && !hasModifierKeys(oEvent);
		}},
		
		/**
		 * Pseudo event for pressing the '+' (plus) sign.
		 * @since 1.25.0
		 * @experimental Since 1.25.0 Implementation details can be changed in future.
		 * @public
		 */
		sapplus: {sName: "sapplus", aTypes: ["keypress"], fnCheck: function(oEvent) {
			var sCharCode = String.fromCharCode(oEvent.which);
			return sCharCode == '+';
		}},

		/**
		 * Pseudo event for pseudo 'increase' event with modifiers (Ctrl, Alt or Shift)
		 * @public
		 */
		sapincreasemodifiers: {sName: "sapincreasemodifiers", aTypes: ["keydown"], fnCheck: function(oEvent) {
			var bRtl = sap.ui.getCore().getConfiguration().getRTL();
			var iNextKey = bRtl ? jQuery.sap.KeyCodes.ARROW_LEFT : jQuery.sap.KeyCodes.ARROW_RIGHT;
			return (oEvent.keyCode == iNextKey || oEvent.keyCode == jQuery.sap.KeyCodes.ARROW_UP) && hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for pseudo 'previous' event without modifiers (Ctrl, Alt or Shift)
		 * @public
		 */
		sapprevious: {sName: "sapprevious", aTypes: ["keydown"], fnCheck: function(oEvent) {
			var bRtl = sap.ui.getCore().getConfiguration().getRTL();
			var iPreviousKey = bRtl ? jQuery.sap.KeyCodes.ARROW_RIGHT : jQuery.sap.KeyCodes.ARROW_LEFT;
			return (oEvent.keyCode == iPreviousKey || oEvent.keyCode == jQuery.sap.KeyCodes.ARROW_UP) && !hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for pseudo 'previous' event with modifiers (Ctrl, Alt or Shift)
		 * @public
		 */
		sappreviousmodifiers: {sName: "sappreviousmodifiers", aTypes: ["keydown"], fnCheck: function(oEvent) {
			var bRtl = sap.ui.getCore().getConfiguration().getRTL();
			var iPreviousKey = bRtl ? jQuery.sap.KeyCodes.ARROW_RIGHT : jQuery.sap.KeyCodes.ARROW_LEFT;
			return (oEvent.keyCode == iPreviousKey || oEvent.keyCode == jQuery.sap.KeyCodes.ARROW_UP) && hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for pseudo 'next' event without modifiers (Ctrl, Alt or Shift)
		 * @public
		 */
		sapnext: {sName: "sapnext", aTypes: ["keydown"], fnCheck: function(oEvent) {
			var bRtl = sap.ui.getCore().getConfiguration().getRTL();
			var iNextKey = bRtl ? jQuery.sap.KeyCodes.ARROW_LEFT : jQuery.sap.KeyCodes.ARROW_RIGHT;
			return (oEvent.keyCode == iNextKey || oEvent.keyCode == jQuery.sap.KeyCodes.ARROW_DOWN) && !hasModifierKeys(oEvent);
		}},

		/**
		 * Pseudo event for pseudo 'next' event with modifiers (Ctrl, Alt or Shift)
		 * @public
		 */
		sapnextmodifiers: {sName: "sapnextmodifiers", aTypes: ["keydown"], fnCheck: function(oEvent) {
			var bRtl = sap.ui.getCore().getConfiguration().getRTL();
			var iNextKey = bRtl ? jQuery.sap.KeyCodes.ARROW_LEFT : jQuery.sap.KeyCodes.ARROW_RIGHT;
			return (oEvent.keyCode == iNextKey || oEvent.keyCode == jQuery.sap.KeyCodes.ARROW_DOWN) && hasModifierKeys(oEvent);
		}},

		//// pseudo hotkey event
		//{sName: "saphotkey", aTypes: ["keydown"], fnCheck: function(oEvent) {
		//  return false;
		//}},
		/* TODO: hotkeys: all other events could be hotkeys
		if(UCF_KeyboardHelper.bIsValidHotkey(iKey, bCtrl, bAlt, bShift)) {

			if (iKey == jQuery.sap.KeyCodes.F1 && bNoModifiers) {
				//special handling for FF - in IE the help is handeled by onHelp
				if (UCF_System.sDevice == "ff1") {
					this.fireSapEvent(this.E_SAP_EVENTS.hotkey, oEvent);
				}
			}
			else if (bCtrlOnly && iKey == jQuery.sap.KeyCodes.C && document.selection) {
				//handle ctrl+c centrally if text is selected to allow to copy it instead of firing the hotkey
				var oTextRange = document.selection.createRange();
				if (!oTextRange || oTextRange.text.length <= 0) {
					this.fireSapEvent(this.E_SAP_EVENTS.hotkey, oEvent);
				}
			}
			else {
				this.fireSapEvent(this.E_SAP_EVENTS.hotkey, oEvent);
			}
		}
		*/

		/*
		 * Other pseudo events
		 * @public
		 */

		/**
		 * Pseudo event indicating delayed double click (e.g. for inline edit)
		 * @public
		 */
		sapdelayeddoubleclick: {sName: "sapdelayeddoubleclick", aTypes: ["click"], fnCheck: function(oEvent) {
			var element = jQuery(oEvent.target);
			var currentTimestamp = oEvent.timeStamp;
			var data = element.data("sapdelayeddoubleclick_lastClickTimestamp");
			var lastTimestamp = data || 0;
			element.data("sapdelayeddoubleclick_lastClickTimestamp", currentTimestamp);
			var diff = currentTimestamp - lastTimestamp;
			return (diff >= 300 && diff <= 1300);
		}}
	};

	/**
	 * Ordered array of the {@link jQuery.sap.PseudoEvents}.
	 *
	 * Order is significant as some check methods rely on the fact that they are tested before other methods.
	 * The array is processed during event analysis (when classifying browser events as pseudo events).
	 * @private
	 */
	var PSEUDO_EVENTS = ["sapdown", "sapdownmodifiers", "sapshow", "sapup", "sapupmodifiers", "saphide", "sapleft", "sapleftmodifiers", "sapright", "saprightmodifiers", "saphome", "saphomemodifiers", "saptop", "sapend", "sapendmodifiers", "sapbottom", "sappageup", "sappageupmodifiers", "sappagedown", "sappagedownmodifiers", "sapselect", "sapselectmodifiers", "sapspace", "sapspacemodifiers", "sapenter", "sapentermodifiers", "sapexpand", "sapbackspace", "sapbackspacemodifiers", "sapdelete", "sapdeletemodifiers", "sapexpandmodifiers", "sapcollapse", "sapcollapsemodifiers", "sapcollapseall", "sapescape", "saptabnext", "saptabprevious", "sapskipforward", "sapskipback", "sapprevious", "sappreviousmodifiers", "sapnext", "sapnextmodifiers", "sapdecrease", "sapminus", "sapdecreasemodifiers", "sapincrease", "sapplus", "sapincreasemodifiers", "sapdelayeddoubleclick"];

	//Add mobile touch events if touch is supported
	(function initTouchEventSupport() {
		jQuery.sap.touchEventMode = "SIM";

		var aAdditionalControlEvents = [];
		var aAdditionalPseudoEvents = [];

		if (Device.support.touch) { // touch events natively supported
			jQuery.sap.touchEventMode = "ON";

			// ensure that "oEvent.touches", ... works (and not only "oEvent.originalEvent.touches", ...)
			jQuery.event.props.push("touches", "targetTouches", "changedTouches");
		}

		/**
		 * This function adds the simulated event prefixed with string "sap" to jQuery.sap.ControlEvents.
		 * 
		 * When UIArea binds to the simulated event with prefix, it internally binds to the original events with the given handler and 
		 * also provides the additional configuration data in the follwing format:
		 * 
		 * {
		 * 	domRef: // the dom reference of the UIArea
		 * 	eventName: // the simulated event name
		 * 	sapEventName: // the simulated event name with sap prefix
		 * 	eventHandle: // the handler that should be registered to simulated event with sap prefix
		 * }
		 * 
		 * @param {string} sSimEventName The name of the simulated event
		 * @param {array} aOrigEvents The array of original events that should be simulated from
		 * @param {function} fnHandler The function which is bound to the original events
		 * 
		 * @private
		 */
		var createSimulatedEvent = function(sSimEventName, aOrigEvents, fnHandler) {
			var sHandlerKey = "__" + sSimEventName + "Handler";
			var sSapSimEventName = "sap" + sSimEventName;
			aAdditionalControlEvents.push(sSapSimEventName);
			aAdditionalPseudoEvents.push({sName: sSimEventName, aTypes: [sSapSimEventName], fnCheck: function (oEvent) {
				return true;
			}});

			jQuery.event.special[sSapSimEventName] = {
				// When binding to the simulated event with prefix is done through jQuery, this function is called and redirect the registration
				// to the original events. Doing in this way we can simulate the event from listening to the original events.
				add: function(oHandle) {
					var that = this,
						$this = jQuery(this),
						oAdditionalConfig = {
							domRef: that,
							eventName: sSimEventName,
							sapEventName: sSapSimEventName,
							eventHandle: oHandle
						};

					var fnHandlerWrapper = function(oEvent){
						fnHandler(oEvent, oAdditionalConfig);
					};

					oHandle.__sapSimulatedEventHandler = fnHandlerWrapper;
					for (var i = 0; i < aOrigEvents.length; i++) {
						$this.on(aOrigEvents[i], fnHandlerWrapper);
					}
				},

				// When unbinding to the simulated event with prefix is done through jQuery, this function is called and redirect the deregistration
				// to the original events.
				remove: function(oHandle) {
					var $this = jQuery(this);
					var fnHandler = oHandle.__sapSimulatedEventHandler;
					$this.removeData(sHandlerKey + oHandle.guid);
					for (var i = 0; i < aOrigEvents.length; i++) {
						jQuery.event.remove(this, aOrigEvents[i], fnHandler);
					}
				}
			};
		};

		/**
		 * This function simulates the corresponding touch event by listening to mouse event.
		 * 
		 * The simulated event will be dispatch through UI5 event delegation which means that the on"EventName" function is called
		 * on control's prototype.
		 * 
		 * @param {jQuery.Event} oEvent The original event object
		 * @param {object} oConfig Additional configuration passed from createSimulatedEvent function
		 * @private
		 */
		var fnMouseToTouchHandler = function(oEvent, oConfig) {
			var $DomRef = jQuery(oConfig.domRef);
			// Suppress the delayed mouse events simulated on touch enabled device
			// the mark is done within jquery-mobile-custom.js
			if (oEvent.isMarked("delayedMouseEvent")) {
				return;
			}

			// Checks if the mouseout event should be handled, the mouseout of the inner dom shouldn't be handled when the mouse cursor
			// is still inside the control's root dom node
			if (!(oEvent.type != "mouseout" || (oEvent.type === "mouseout" && jQuery.sap.checkMouseEnterOrLeave(oEvent, oConfig.domRef)))) {
				var bSkip = true;
				var sControlId = $DomRef.data("__touchstart_control");
				if (sControlId) {
					var oCtrlDom = jQuery.sap.domById(sControlId);
					if (oCtrlDom && jQuery.sap.checkMouseEnterOrLeave(oEvent, oCtrlDom)) {
						bSkip = false;
					}
				}
				if (bSkip) {
					return;
				}
			}

			var oNewEvent = jQuery.event.fix(oEvent.originalEvent || oEvent);
			oNewEvent.type = oConfig.sapEventName;

			//reset the _sapui_handledByUIArea flag
			if (oNewEvent.isMarked("firstUIArea")) {
				oNewEvent.setMark("handledByUIArea", false);
			}

			var aTouches = [{
				identifier: 1,
				pageX: oNewEvent.pageX,
				pageY: oNewEvent.pageY,
				clientX: oNewEvent.clientX,
				clientY: oNewEvent.clientY,
				screenX: oNewEvent.screenX,
				screenY: oNewEvent.screenY,
				target: oNewEvent.target,
				radiusX: 1,
				radiusY: 1,
				rotationAngle: 0
			}];

			switch (oConfig.eventName) {
				case "touchstart":
				case "touchmove":
					oNewEvent.touches = oNewEvent.changedTouches = oNewEvent.targetTouches = aTouches;
					break;

				case "touchend":
					oNewEvent.changedTouches = aTouches;
					oNewEvent.touches = oNewEvent.targetTouches = [];
					break;
				// no default
			}

			if (oConfig.eventName === "touchstart" || $DomRef.data("__touch_in_progress")) {
				$DomRef.data("__touch_in_progress", "X");
				var oControl = jQuery.fn.control ? jQuery(oEvent.target).control(0) : null;
				if (oControl) {
					$DomRef.data("__touchstart_control", oControl.getId());
				}

				// When saptouchend event is generated from mouseout event, it has to be marked for being correctly handled inside UIArea.
				// for example, when sap.m.Image control is used inside sap.m.Button control, the following situation can happen:
				// 	1. Mousedown on image.
				// 	2. Keep mousedown and move mouse out of image.
				// 	3. ontouchend function will be called on image control and bubbled up to button control
				// 	4. However, the ontouchend function shouldn't be called on button.
				//
				// With this parameter, UIArea can check if the touchend is generated from mouseout event and check if the target is still
				// inside the current target. Executing the corresponding logic only when the target is out of the current target.
				if (oEvent.type === "mouseout") {
					oNewEvent.setMarked("fromMouseout");
				}
				oConfig.eventHandle.handler.call(oConfig.domRef, oNewEvent);
				// here the fromMouseout flag is checked, terminate the touch progress only when touchend event is not marked with fromMouseout.
				if (oConfig.eventName === "touchend" && !oNewEvent.isMarked("fromMouseout")) {
					$DomRef.removeData("__touch_in_progress");
					$DomRef.removeData("__touchstart_control");
				}
			}
		};
		if (!(Device.support.pointer && Device.support.touch)) {
			createSimulatedEvent("touchstart", ["mousedown"], fnMouseToTouchHandler);
			createSimulatedEvent("touchend", ["mouseup", "mouseout"], fnMouseToTouchHandler);
			createSimulatedEvent("touchmove", ["mousemove"], fnMouseToTouchHandler);
		}

		/**
		 * This methods decides when extra events are needed. Extra events are: tap, swipe and the new touch to mouse event simulation.
		 * 
		 * The old touch to mouse simulation is done in a way that a real mouse event is fired when there's a corresponding touch event. But this will mess up
		 * the mouse to touch event simulation and is not consistent with the mouse to touch event simulation. That's why when certain condition is met, the old
		 * touch to mouse event simluation will be replaced with the new touch to mouse event simulation.
		 * 
		 * The new one can't completely replace the old one because the desktop controls which bind to events using jQuery or browser API directly have to be change.
		 * Then the new one can replace the old one completely not under certain condition anymore.
		 * 
		 * @private
		 */
		function needsExtraEventSupport(){
			var oCfgData = window["sap-ui-config"] || {},
				sLibs = oCfgData.libs || "";

			// TODO: should be replaced by some function in jQuery.sap.global (e.g. jQuery.sap.config(sKey))
			function hasConfig(sKey) {
				return document.location.search.indexOf("sap-ui-" + sKey) > -1 || // URL 
					!!oCfgData[sKey.toLowerCase()]; // currently, properties of oCfgData are converted to lower case (DOM attributes)
			}

			return Device.support.touch || // tap, swipe, etc. events are needed when touch is supported
				hasConfig("xx-test-mobile") || // see sap.ui.core.Configuration -> M_SETTINGS
				// also simulate touch events when sap-ui-xx-fakeOS is set (independently of the value and the current browser)
				hasConfig("xx-fakeOS") ||
				// always simulate touch events when the mobile lib is involved (FIXME: hack for Kelley, this does currently not work with dynamic library loading)
				sLibs.match(/sap.m\b/);
		}

		// If extra event support is needed, jQuery mobile event plugin is loaded to support tap, swipe and scrollstart/stop events.
		// The old touch to mouse event simulation ((see line 25 in this file)) will be deregistered and the new one will be active.
		if (needsExtraEventSupport()) {
			jQuery.sap.require("sap.ui.thirdparty.jquery-mobile-custom");

			// Simulate mouse events on touch devices
			// Except for Windows Phone with touch events support.
			if (Device.support.touch && !Device.support.pointer) {
				var bFingerIsMoved = false,
					iMoveThreshold = jQuery.vmouse.moveDistanceThreshold,
					iStartX, iStartY,
					iOffsetX, iOffsetY,
					iLastTouchMoveTime;
				
				var fnCreateNewEvent = function(oEvent, oConfig, oMappedEvent) {
					var oNewEvent = jQuery.event.fix(oEvent.originalEvent || oEvent);
					oNewEvent.type = oConfig.sapEventName;

					delete oNewEvent.touches;
					delete oNewEvent.changedTouches;
					delete oNewEvent.targetTouches;
					
					//TODO: add other properties that should be copied to the new event
					oNewEvent.screenX = oMappedEvent.screenX;
					oNewEvent.screenY = oMappedEvent.screenY;
					oNewEvent.clientX = oMappedEvent.clientX;
					oNewEvent.clientY = oMappedEvent.clientY;
					oNewEvent.ctrlKey = oMappedEvent.ctrlKey;
					oNewEvent.altKey = oMappedEvent.altKey;
					oNewEvent.shiftKey = oMappedEvent.shiftKey;
					// The simulated mouse event should always be clicked by the left key of the mouse
					oNewEvent.button = (Device.browser.msie && Device.browser.version <= 8 ? 1 : 0);
					
					return oNewEvent;
				};
				
				/**
				 * This function simulates the corresponding mouse event by listening to touch event (touchmove).
				 * 
				 * The simulated event will be dispatch through UI5 event delegation which means that the on"EventName" function is called
				 * on control's prototype.
				 * 
				 * @param {jQuery.Event} oEvent The original event object
				 * @param {object} oConfig Additional configuration passed from createSimulatedEvent function
				 */
				var fnTouchMoveToMouseHandler = function(oEvent, oConfig) {
					if (oEvent.isMarked("handledByTouchToMouse")) {
						return;
					}
					oEvent.setMarked("handledByTouchToMouse");
					
					if (!bFingerIsMoved) {
						var oTouch = oEvent.originalEvent.touches[0];
						bFingerIsMoved = (Math.abs(oTouch.pageX - iStartX) > iMoveThreshold ||
												Math.abs(oTouch.pageY - iStartY) > iMoveThreshold);
					}

					if (Device.os.blackberry) {
						//Blackberry sends many touchmoves -> create a simulated mousemove every 50ms
						if (iLastTouchMoveTime && oEvent.timeStamp - iLastTouchMoveTime < 50) {
							return;
						}
						iLastTouchMoveTime = oEvent.timeStamp;
					}

					var oNewEvent = fnCreateNewEvent(oEvent, oConfig, oEvent.touches[0]);
					jQuery.sap.delayedCall(0, this, function(){
						oNewEvent.setMark("handledByUIArea", false);
						oConfig.eventHandle.handler.call(oConfig.domRef, oNewEvent);
					});
				};

				/**
				 * This function simulates the corresponding mouse event by listening to touch event (touchstart, touchend, touchcancel).
				 * 
				 * The simulated event will be dispatch through UI5 event delegation which means that the on"EventName" function is called
				 * on control's prototype.
				 * 
				 * @param {jQuery.Event} oEvent The original event object
				 * @param {object} oConfig Additional configuration passed from createSimulatedEvent function
				 */
				var fnTouchToMouseHandler = function(oEvent, oConfig) {
					if (oEvent.isMarked("handledByTouchToMouse")) {
						return;
					}
					oEvent.setMarked("handledByTouchToMouse");

					var oNewStartEvent, oNewEndEvent, bSimulateClick;

					function createNewEvent() {
						return fnCreateNewEvent(oEvent, oConfig, oConfig.eventName === "mouseup" ? oEvent.changedTouches[0] : oEvent.touches[0]);
					}

					if (oEvent.type === "touchstart") {

						var oTouch = oEvent.originalEvent.touches[0];
						bFingerIsMoved = false;
						iLastTouchMoveTime = 0;
						iStartX = oTouch.pageX;
						iStartY = oTouch.pageY;
						iOffsetX = Math.round(oTouch.pageX - jQuery(oEvent.target).offset().left);
						iOffsetY = Math.round(oTouch.pageY - jQuery(oEvent.target).offset().top);

						oNewStartEvent = createNewEvent();
						jQuery.sap.delayedCall(0, this, function(){
							oNewStartEvent.setMark("handledByUIArea", false);
							oConfig.eventHandle.handler.call(oConfig.domRef, oNewStartEvent);
						});
					} else if (oEvent.type === "touchend") {

						oNewEndEvent = createNewEvent();
						bSimulateClick = !bFingerIsMoved;

						jQuery.sap.delayedCall(0, this, function(){
							oNewEndEvent.setMark("handledByUIArea", false);
							oConfig.eventHandle.handler.call(oConfig.domRef, oNewEndEvent);
							if (bSimulateClick) {
								// also call the onclick event handler when touchend event is received and the movement is within threshold
								oNewEndEvent.type = "click";
								oNewEndEvent.getPseudoTypes = jQuery.Event.prototype.getPseudoTypes; //Reset the pseudo types due to type change
								oNewEndEvent.setMark("handledByUIArea", false);
								oNewEndEvent.offsetX = iOffsetX; // use offset from touchstart
								oNewEndEvent.offsetY = iOffsetY; // use offset from touchstart
								oConfig.eventHandle.handler.call(oConfig.domRef, oNewEndEvent);
							}
						});
					}
				};

				// Deregister the previous touch to mouse event simulation (see line 25 in this file)
				jQuery.sap.disableTouchToMouseHandling();

				createSimulatedEvent("mousedown", ["touchstart"], fnTouchToMouseHandler);
				createSimulatedEvent("mousemove", ["touchmove"], fnTouchMoveToMouseHandler);
				createSimulatedEvent("mouseup", ["touchend", "touchcancel"], fnTouchToMouseHandler);
			}

			// Define additional jQuery Mobile events to be added to the event list
			// TODO taphold cannot be used (does not bubble / has no target property) -> Maybe provide own solution
			// IMPORTANT: update the public documentation when extending this list
			aAdditionalControlEvents.push("swipe", "tap", "swipeleft", "swiperight", "scrollstart", "scrollstop");

			//Define additional pseudo events to be added to the event list
			aAdditionalPseudoEvents.push({sName: "swipebegin", aTypes: ["swipeleft", "swiperight"], fnCheck: function (oEvent) {
				var bRtl = sap.ui.getCore().getConfiguration().getRTL();
				return (bRtl && oEvent.type === "swiperight") || (!bRtl && oEvent.type === "swipeleft");
			}});
			aAdditionalPseudoEvents.push({sName: "swipeend", aTypes: ["swipeleft", "swiperight"], fnCheck: function (oEvent) {
				var bRtl = sap.ui.getCore().getConfiguration().getRTL();
				return (!bRtl && oEvent.type === "swiperight") || (bRtl && oEvent.type === "swipeleft");
			}});
		}

		// Add all defined events to the event infrastructure
		//
		// jQuery has inversed the order of event registration when multiple events are passed into jQuery.on method from version 1.9.1.
		//
		// UIArea binds to both touchstart and saptouchstart event and saptouchstart internally also binds to touchstart event. Before
		// jQuery version 1.9.1, the touchstart event handler is called before the saptouchstart event handler and our flags (e.g. _sapui_handledByUIArea)
		// still work. However since the order of event registration is inversed from jQuery version 1.9.1, the saptouchstart event hanlder is called
		// before the touchstart one, our flags don't work anymore.
		//
		// Therefore jQuery version needs to be checked in order to decide the event order in jQuery.sap.ControlEvents.
		if (jQuery.sap.Version(jQuery.fn.jquery).compareTo("1.9.1") < 0) {
			jQuery.sap.ControlEvents = jQuery.sap.ControlEvents.concat(aAdditionalControlEvents);
		} else {
			jQuery.sap.ControlEvents = aAdditionalControlEvents.concat(jQuery.sap.ControlEvents);
		}

		for (var i = 0; i < aAdditionalPseudoEvents.length; i++) {
			jQuery.sap.PseudoEvents[aAdditionalPseudoEvents[i].sName] = aAdditionalPseudoEvents[i];
			PSEUDO_EVENTS.push(aAdditionalPseudoEvents[i].sName);
		}
	}());

	/**
	 * Function for initialization of an Array containing all basic event types of the available pseudo events.
	 * @private
	 */
	function initPseudoEventBasicTypes(){
		var mEvents = jQuery.sap.PseudoEvents,
			aResult = [];

		for (var sName in mEvents) {
			if (mEvents[sName].aTypes) {
				for (var j = 0, js = mEvents[sName].aTypes.length; j < js; j++) {
					var sType = mEvents[sName].aTypes[j];
					if (jQuery.inArray(sType, aResult) == -1) {
						aResult.push(sType);
					}
				}
			}
		}

		return aResult;
	}

	/**
	 * Array containing all basic event types of the available pseudo events.
	 * @private
	 */
	var PSEUDO_EVENTS_BASIC_TYPES = initPseudoEventBasicTypes();

	/**
	 * Convenience method to check an event for a certain combination of modifier keys
	 *
	 * @private
	 */
	function checkModifierKeys(oEvent, bCtrlKey, bAltKey, bShiftKey) {
		return oEvent.shiftKey == bShiftKey && oEvent.altKey == bAltKey && getCtrlKey(oEvent) == bCtrlKey;
	}

	/**
	 * Convenience method to check an event for any modifier key
	 *
	 * @private
	 */
	function hasModifierKeys(oEvent) {
		return oEvent.shiftKey || oEvent.altKey || getCtrlKey(oEvent);
	}

	/**
	 * Convenience method for handling of Ctrl key, meta key etc.
	 *
	 * @private
	 */
	function getCtrlKey(oEvent) {
		return !!(oEvent.metaKey || oEvent.ctrlKey); // double negation doesn't have effect on boolean but ensures null and undefined are equivalent to false.
	}

	/**
	 * Returns an array of names (as strings) identifying {@link jQuery.sap.PseudoEvents} that are fulfilled by this very Event instance.
	 *
	 * @returns {String[]} Array of names identifying {@link jQuery.sap.PseudoEvents} that are fulfilled by this very Event instance.
	 * @public
	 */
	jQuery.Event.prototype.getPseudoTypes = function() {
		var aPseudoTypes = [];

		if (jQuery.inArray(this.type, PSEUDO_EVENTS_BASIC_TYPES) != -1) {
			var aPseudoEvents = PSEUDO_EVENTS;
			var ilength = aPseudoEvents.length;
			var oPseudo = null;

			for (var i = 0; i < ilength; i++) {
				oPseudo = jQuery.sap.PseudoEvents[aPseudoEvents[i]];
				if (oPseudo.aTypes
						&& jQuery.inArray(this.type, oPseudo.aTypes) > -1
						&& oPseudo.fnCheck
						&& oPseudo.fnCheck(this)) {
					aPseudoTypes.push(oPseudo.sName);
				}
			}
		}

		this.getPseudoTypes = function(){
			return aPseudoTypes.slice();
		};

		return aPseudoTypes.slice();
	};

	/**
	 * Checks whether this instance of {@link jQuery.Event} is of the given <code>sType</code> pseudo type.
	 *
	 * @param {string} sType The name of the pseudo type this event should be checked for.
	 * @returns {boolean} <code>true</code> if this instance of jQuery.Event is of the given sType, <code>false</code> otherwise.
	 * @public
	 */
	jQuery.Event.prototype.isPseudoType = function(sType) {
		var aPseudoTypes = this.getPseudoTypes();

		if (sType) {
			return jQuery.inArray(sType, aPseudoTypes) > -1;
		} else {
			return aPseudoTypes.length > 0;
		}
	};

	/**
	 * Binds all events for listening with the given callback function.
	 *
	 * @param {function} fnCallback Callback function
	 * @public
	 */
	jQuery.sap.bindAnyEvent = function bindAnyEvent(fnCallback) {
		if (fnCallback) {
			jQuery(document).bind(jQuery.sap.ControlEvents.join(" "), fnCallback);
		}
	};

	/**
	 * Unbinds all events for listening with the given callback function.
	 *
	 * @param {function} fnCallback Callback function
	 * @public
	 */
	jQuery.sap.unbindAnyEvent = function unbindAnyEvent(fnCallback) {
		if (fnCallback) {
			jQuery(document).unbind(jQuery.sap.ControlEvents.join(" "), fnCallback);
		}
	};

	/**
	 * Checks a given mouseover or mouseout event whether it is
	 * equivalent to a mouseenter or mousleave event regarding the given DOM reference.
	 *
	 * @param {jQuery.Event} oEvent
	 * @param {element} oDomRef
	 * @public
	 */
	jQuery.sap.checkMouseEnterOrLeave = function checkMouseEnterOrLeave(oEvent, oDomRef) {
		if (oEvent.type != "mouseover" && oEvent.type != "mouseout") {
			return false;
		}

		var isMouseEnterLeave = false;
		var element = oDomRef;
		var parent = oEvent.relatedTarget;

		try {
			while ( parent && parent !== element ) {
				parent = parent.parentNode;
			}

			if ( parent !== element ) {
				isMouseEnterLeave = true;
			}
		} catch (e) {
			//escape eslint check for empty block
		}

		return isMouseEnterLeave;
	};

	/*
	 * Detect whether the pressed key is:
	 * SHIFT, CONTROL, ALT, BREAK, CAPS_LOCK,
	 * PAGE_UP, PAGE_DOWN, END, HOME, ARROW_LEFT, ARROW_UP, ARROW_RIGHT, ARROW_DOWN,
	 * PRINT, INSERT, DELETE, F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12,
	 * BACKSPACE, TAB, ENTER, ESCAPE
	 *
	 * @param {jQuery.Event} oEvent The event object of the <code>keydown</code>, <code>keyup</code> or <code>keypress</code> events.
	 * @static
	 * @returns {boolean}
	 * @protected
	 * @since 1.24.0
	 * @experimental Since 1.24.0 Implementation might change.
	 */
	jQuery.sap.isSpecialKey = function(oEvent) {
		var mKeyCodes = jQuery.sap.KeyCodes,
			iKeyCode = oEvent.which,	// jQuery oEvent.which normalizes oEvent.keyCode and oEvent.charCode
			bSpecialKey = 	isModifierKey(oEvent) ||
							isArrowKey(oEvent) ||
							(iKeyCode >= 33 && iKeyCode <= 36) ||	// PAGE_UP, PAGE_DOWN, END, HOME
							(iKeyCode >= 44 && iKeyCode <= 46) ||	// PRINT, INSERT, DELETE
							(iKeyCode >= 112 && iKeyCode <= 123) ||	// F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12
							(iKeyCode === mKeyCodes.BREAK) ||
							(iKeyCode === mKeyCodes.BACKSPACE) ||
							(iKeyCode === mKeyCodes.TAB) ||
							(iKeyCode === mKeyCodes.ENTER) ||
							(iKeyCode === mKeyCodes.ESCAPE) ||
							(iKeyCode === mKeyCodes.SCROLL_LOCK);

		switch (oEvent.type) {
			case "keydown":
			case "keyup":
				return bSpecialKey;

			// note: the keypress event should be fired only when a character key is pressed,
			// unfortunately some browsers fire the keypress event for other keys. e.g.:
			//
			// Firefox fire it for:
			// BREAK, ARROW_LEFT, ARROW_RIGHT, INSERT, DELETE,
			// F1, F2, F3, F5, F6, F7, F8, F9, F10, F11, F12
			// BACKSPACE, ESCAPE
			//
			// Internet Explorer fire it for:
			// ESCAPE
			case "keypress":

				// note: in Firefox, almost all noncharacter keys that fire the keypress event have a key code of 0,
				// with the exception of BACKSPACE (key code of 8).
				// note: in IE the ESCAPE key is also fired for the the keypress event
				return (iKeyCode === 0 ||	// in Firefox, almost all noncharacter keys that fire the keypress event have a key code of 0, with the exception of BACKSPACE (key code of 8)
						iKeyCode === mKeyCodes.BACKSPACE ||
						iKeyCode === mKeyCodes.ESCAPE ||
						iKeyCode === mKeyCodes.ENTER /* all browsers */) || false;

			default:
				return false;
		}
	};

	/**
	 * Detect whether the pressed key is a modifier.
	 *
	 * Modifier keys are considered:
	 * SHIFT, CONTROL, ALT, CAPS_LOCK, NUM_LOCK
	 * These keys don't send characters, but modify the characters sent by other keys.
	 *
	 * @param {jQuery.Event} oEvent The event object of the <code>keydown</code>, <code>keyup</code> or <code>keypress</code> events.
	 * @static
	 * @returns {boolean}
	 * @since 1.24.0
	 */
	function isModifierKey(oEvent) {
		var mKeyCodes = jQuery.sap.KeyCodes,
			iKeyCode = oEvent.which;	// jQuery oEvent.which normalizes oEvent.keyCode and oEvent.charCode

		return (iKeyCode === mKeyCodes.SHIFT) ||
				(iKeyCode === mKeyCodes.CONTROL) ||
				(iKeyCode === mKeyCodes.ALT) ||
				(iKeyCode === mKeyCodes.CAPS_LOCK) ||
				(iKeyCode === mKeyCodes.NUM_LOCK);
	}

	/**
	 * Detect whether the pressed key is a navigation key.
	 *
	 * Navigation keys are considered:
	 * ARROW_LEFT, ARROW_UP, ARROW_RIGHT, ARROW_DOWN
	 *
	 * @param {jQuery.Event} oEvent The event object of the <code>keydown</code>, <code>keyup</code> or <code>keypress</code> events.
	 * @static
	 * @returns {boolean}
	 * @since 1.24.0
	 */
	function isArrowKey(oEvent) {
		var iKeyCode = oEvent.which,	// jQuery oEvent.which normalizes oEvent.keyCode and oEvent.charCode
			bArrowKey = (iKeyCode >= 37 && iKeyCode <= 40);	// ARROW_LEFT, ARROW_UP, ARROW_RIGHT, ARROW_DOWN

		switch (oEvent.type) {
			case "keydown":
			case "keyup":
				return bArrowKey;

			// note: the keypress event should be fired only when a character key is pressed,
			// unfortunately some browsers fire the keypress event for other keys. e.g.:
			//
			// Firefox fire it for:
			// ARROW_LEFT, ARROW_RIGHT
			case "keypress":

				// in Firefox, almost all noncharacter keys that fire the keypress event have a key code of 0
				return iKeyCode === 0;

			default:
				return false;
		}
	}

	/**
	 * Constructor for a jQuery.Event object.<br/>
	 * @see "http://www.jquery.com" and "http://api.jquery.com/category/events/event-object/".
	 *
	 * @class Check the jQuery.Event class documentation available under "http://www.jquery.com"<br/>
	 * and "http://api.jquery.com/category/events/event-object/" for details.
	 *
	 * @name jQuery.Event
	 * @public
	 */

	/**
	 * Returns OffsetX of Event. In jQuery there is a bug. In IE the value is in offsetX, in FF in layerX
	 *
	 * @returns {int} offsetX
	 * @public
	 */
	jQuery.Event.prototype.getOffsetX = function() {

		if (this.type == 'click') {
			if (this.offsetX) {
				return this.offsetX;
			}
			if (this.layerX) {
				return this.layerX;
			}
			if (this.originalEvent.layerX) {
				return this.originalEvent.layerX;
			}
		}
		// nothing defined -> offset = 0
		return 0;
	};

	/**
	 * Returns OffsetY of Event. In jQuery there is a bug. in IE the value is in offsetY, in FF in layerY.
	 *
	 * @returns {int} offsetY
	 * @public
	 */
	jQuery.Event.prototype.getOffsetY = function() {

		if (this.type == 'click') {
			if (this.offsetY) {
				return this.offsetY;
			}
			if (this.layerY) {
				return this.layerY;
			}
			if (this.originalEvent.layerY) {
				return this.originalEvent.layerY;
			}
		}
		// nothing defined -> offset = 0
		return 0;
	};

	// we still call the original stopImmediatePropagation
	var fnStopImmediatePropagation = jQuery.Event.prototype.stopImmediatePropagation;
	
	/**
	 * PRIVATE EXTENSION: allows to immediately stop the propagation of events in
	 * the event handler execution - means that "before" delegates can stop the
	 * propagation of the event to other delegates or the element and so on.
	 *
	 * @see sap.ui.core.Element.prototype._callEventHandles
	 * @param {boolean} bStopDelegate
	 */
	jQuery.Event.prototype.stopImmediatePropagation = function(bStopHandlers) {

		// execute the original function
		fnStopImmediatePropagation.apply(this, arguments);

		// only set the stop handlers flag if it is wished...
		if (bStopHandlers) {
			this._bIsStopHandlers = true;
		}
	};

	/**
	 * PRIVATE EXTENSION: check if the handler propagation has been stopped.
	 *
	 * @see sap.ui.core.Element.prototype._callEventHandles
	 */
	jQuery.Event.prototype.isImmediateHandlerPropagationStopped = function() {
		return !!this._bIsStopHandlers;
	};

	/**
	 * Mark the event object for components that needs to know if the event was handled by a child component.
	 * PRIVATE EXTENSION
	 *
	 * @param {string} [sKey="handledByControl"]
	 * @param {string} [vValue=true]
	 */
	jQuery.Event.prototype.setMark = function(sKey, vValue) {
		sKey = sKey || "handledByControl";
		vValue = arguments.length < 2 ? true : vValue;
		(this.originalEvent || this)["_sapui_" + sKey] = vValue;
	};

	/**
	 * Mark the event object for components that needs to know if the event was handled by a child component.
	 * PRIVATE EXTENSION
	 *
	 * @see jQuery.Event.prototype.setMark
	 * @param {string} [sKey="handledByControl"]
	 */
	jQuery.Event.prototype.setMarked = jQuery.Event.prototype.setMark;

	/**
	 * Check whether the event object is marked by the child component or not.
	 * PRIVATE EXTENSION
	 *
	 * @param {string} [sKey="handledByControl"]
	 * @returns {boolean}
	 */
	jQuery.Event.prototype.isMarked = function(sKey) {
		sKey = sKey || "handledByControl";
		return !!(this.originalEvent || this)["_sapui_" + sKey];
	};

	
	/* ************** F6 Fast Navigation ************** */
	
	// CustomData attribute name for fast navigation groups (in DOM additional prefix "data-" is needed)
	jQuery.sap._FASTNAVIGATIONKEY = "sap-ui-fastnavgroup";
	
	// Returns the nearest parent DomRef of the given DomRef with attribute data-sap-ui-customfastnavgroup="true". 
	function findClosestCustomGroup(oRef) {
		var $Group = jQuery(oRef).closest('[data-sap-ui-customfastnavgroup="true"]');
		return $Group[0];
	}
	
	// Returns the nearest parent DomRef of the given DomRef with attribute data-sap-ui-fastnavgroup="true" or
	// (if available) the nearest parent with attribute data-sap-ui-customfastnavgroup="true". 
	function findClosestGroup(oRef) {
		var oGroup = findClosestCustomGroup(oRef);
		if (oGroup) {
			return oGroup;
		}
		
		var $Group = jQuery(oRef).closest('[data-' + jQuery.sap._FASTNAVIGATIONKEY + '="true"]');
		return $Group[0];
	}
	
	// Returns a jQuery object which contains all next/previous (bNext) tabbable DOM elements of the given starting point (oRef) within the given scopes (DOMRefs)
	function findTabbables(oRef, aScopes, bNext) {
		var $Ref = jQuery(oRef),
			$All, $Tabbables;
		
		if (bNext) {
			$All = jQuery.merge($Ref.find("*"), jQuery.merge($Ref.nextAll(), $Ref.parents().nextAll()));
			$Tabbables = $All.find(':sapTabbable').addBack(':sapTabbable');
		} else {
			$All = jQuery.merge($Ref.prevAll(), $Ref.parents().prevAll());
			$Tabbables = jQuery.merge($Ref.parents(':sapTabbable'), $All.find(':sapTabbable').addBack(':sapTabbable'));
		} 

		var $Tabbables = jQuery.unique($Tabbables);
		return $Tabbables.filter(function(){
			return isContained(aScopes, this);
		});
	}
	
	// Filters all elements in the given jQuery object which are in the static UIArea and which are not in the given scopes.
	function filterStaticAreaContent($Refs, aScopes){
		var oStaticArea = jQuery.sap.domById("sap-ui-static");
		if (!oStaticArea) {
			return $Refs;
		}
		
		var aScopesInStaticArea = [];
		for (var i = 0; i < aScopes.length; i++) {
			if (jQuery.contains(oStaticArea, aScopes[i])) {
				aScopesInStaticArea.push(aScopes[i]);
			}
		}
		
		return $Refs.filter(function(){
			if (aScopesInStaticArea.length && isContained(aScopesInStaticArea, this)) {
				return true;
			}
			return !jQuery.contains(oStaticArea, this);
		});
	}
	
	// Checks whether the given DomRef is contained or equals (in) one of the given container
	function isContained(aContainers, oRef) {
		for (var i = 0; i < aContainers.length; i++) {
			if (aContainers[i] === oRef || jQuery.contains(aContainers[i], oRef)) {
				return true;
			}
		}
		return false;
	}
	
	//see navigate() (bForward = false)
	function findFirstTabbableOfPreviousGroup($FirstTabbableInScope, $Tabbables, oSouceGroup, bFindPreviousGroup) {
		var oGroup, $Target;
		
		for (var i = $Tabbables.length - 1; i >= 0; i--) {
			oGroup = findClosestGroup($Tabbables[i]);
			if (oGroup != oSouceGroup) {
				if (bFindPreviousGroup) {
					//First find last tabbable of previous group and remember this new group (named "X" in the following comments)
					oSouceGroup = oGroup;
					bFindPreviousGroup = false;
				} else {
					//Then starting from group X and try to find again the last tabbable of previous group (named "Y")
					//-> Jump one tabbable back to get the first tabbable of X
					$Target = jQuery($Tabbables[i + 1]);
					break;
				}
			}
		}
		
		if (!$Target && !bFindPreviousGroup) {
			//Group X found but not group Y -> X is the first group -> Focus the first tabbable scope (e.g. page) element
			$Target = $FirstTabbableInScope;
		}
		
		return $Target;
	}
	
	// Finds the next/previous (bForward) element in the F6 chain starting from the given source element within the given scopes and focus it
	function navigate(oSource, aScopes, bForward) {
		if (!aScopes || aScopes.length == 0) {
			aScopes = [document];
		}
		
		if (!isContained(aScopes, oSource)) {
			return;
		}
		
		var oSouceGroup = findClosestGroup(oSource),
			$AllTabbables = filterStaticAreaContent(jQuery(aScopes).find(':sapTabbable').addBack(':sapTabbable'), aScopes),
			$FirstTabbableInScope = $AllTabbables.first(),
			$Tabbables = filterStaticAreaContent(findTabbables(oSource, aScopes, bForward), aScopes),
			oGroup, $Target;
		
		if (bForward) {
			//Find the first next tabbable within another group
			for (var i = 0; i < $Tabbables.length; i++) {
				oGroup = findClosestGroup($Tabbables[i]);
				if (oGroup != oSouceGroup) {
					$Target = jQuery($Tabbables[i]);
					break;
				}
			}

			//If not found, end of scope (e.g. page) is reached -> Focus the first tabbable scope (e.g. page) element
			if (!$Target || !$Target.length) {
				$Target = $FirstTabbableInScope;
			}
		} else {
			$Target = findFirstTabbableOfPreviousGroup($FirstTabbableInScope, $Tabbables, oSouceGroup, true);
			
			if (!$Target || !$Target.length) {
				//No other group found before -> find first element of last group in the scope (e.g. page)
				
				if ($AllTabbables.length == 1) {
					//Only one tabbable element -> use it
					$Target = jQuery($AllTabbables[0]);
				} else if ($AllTabbables.length > 1) {
					oSouceGroup = findClosestGroup($AllTabbables.eq(-1));
					oGroup = findClosestGroup($AllTabbables.eq(-2));
					if (oSouceGroup != oGroup) {
						//Last tabbable scope (e.g. page) element and the previous tabbable scope (e.g. page) element have different groups -> last tabbable scope (e.g. page) element is first tabbable element of its group
						$Target = $AllTabbables.eq(-1);
					} else {
						//Take last tabbable scope (e.g. page) element as reference and start search for first tabbable of the same group
						$Target = findFirstTabbableOfPreviousGroup($FirstTabbableInScope, $AllTabbables, oSouceGroup, false);
					}
				}
			}
		}
		
		if ($Target && $Target.length) {
			var oTarget = $Target[0],
				oEvent = null,
				oCustomGroup = findClosestCustomGroup(oTarget);
			
			if (oCustomGroup && oCustomGroup.id) {
				var oControl = sap.ui.getCore().byId(oCustomGroup.id);
				if (oControl) {
					oEvent = jQuery.Event("BeforeFastNavigationFocus");
					oEvent.target = oTarget;
					oEvent.source = oSource;
					oEvent.forward = bForward;
					oControl._handleEvent(oEvent);
				}
			}
			
			if (!oEvent || !oEvent.isDefaultPrevented()) {
				jQuery.sap.focus(oTarget);
			}
		}
	}
	
	/**
	 * Central handler for F6 key event. Based on the current target and the given event the next element in the F6 chain is focused.
	 * 
	 * This handler might be also called manually. In this case the central handler is deactivated for the given event.
	 * 
	 * If the event is not a keydown event, it does not represent the F6 key, the default behavior is prevented,
	 * the handling is explicitly skipped (<code>oSettings.skip</code>) or the target (<code>oSettings.target</code>) is not contained
	 * in the used scopes (<code>oSettings.scope</code>), the event is skipped.
	 *
	 * @param {jQuery.Event} oEvent a <code>keydown</code> event object.
	 * @param {object} [oSettings] further options in case the handler is called manually.
	 * @param {boolean} [oSettings.skip=false] whether the event should be ignored by the central handler (see above)
	 * @param {Element} [oSettings.target=document.activeElement] the DOMNode which should be used as starting point to find the next DOMNode in the F6 chain.
	 * @param {Element[]} [oSettings.scope=[document]] the DOMNodes(s) which are used for the F6 chain search
	 * @static
	 * @private
	 * @since 1.25.0
	 */
	jQuery.sap.handleF6GroupNavigation = function(oEvent, oSettings) {
		if (oEvent.type != "keydown" 
				|| oEvent.keyCode != jQuery.sap.KeyCodes.F6 
				|| oEvent.isMarked("sapui5_handledF6GroupNavigation")
				|| oEvent.isMarked()
				|| oEvent.isDefaultPrevented()) {
			return;
		}
		
		oEvent.setMark("sapui5_handledF6GroupNavigation");
		oEvent.setMarked();
		oEvent.preventDefault();
		
		if (oSettings && oSettings.skip) {
			return;
		}
		
		var oTarget = oSettings && oSettings.target ? oSettings.target : document.activeElement,
			aScopes = null;
		
		if (oSettings && oSettings.scope) {
			aScopes = jQuery.isArray(oSettings.scope) ? oSettings.scope : [oSettings.scope];
		}
		
		navigate(oTarget, aScopes, !oEvent.shiftKey);
	};
	
	jQuery(function() {
		jQuery(document).on("keydown", function(oEvent) {
			jQuery.sap.handleF6GroupNavigation(oEvent, null);
		});
	});

	/**
	 * Whether the current browser fires mouse events after touch events with long delay (~300ms)
	 *
	 * Mobile browsers fire mouse events after touch events with a delay (~300ms)
	 * Some modern mobile browsers already removed the delay under some condition. Those browsers are:
	 *  1. iOS Safari in iOS 8.
	 *  2. Chrome on Android from version 32 (exclude the Samsung stock browser which also uses Chrome kernel)
	 *
	 * @private
	 * @since 1.30.0
	 */
	jQuery.sap.isMouseEventDelayed =
		(Device.browser.mobile
			&& !(
				(Device.os.ios && Device.os.version >= 8 && Device.browser.safari)
				|| (Device.browser.chrome && !/SAMSUNG/.test(navigator.userAgent) && Device.browser.version >= 32)
			)
		);


	/* ************************************************ */


	return jQuery;

});
