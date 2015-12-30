/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

/*
 * Provides constants for key codes. Useful in the implementation of keypress/keydown event handlers.
 */
sap.ui.define(['jquery.sap.global'],
	function(jQuery) {
	"use strict";


	/**
	 * Enumeration of key codes.
	 *
	 * @namespace
	 * @public
	 * @since 0.9.0
	 */
	jQuery.sap.KeyCodes = {
	
		/**
		 * @type number
		 * @public
		 */
		BACKSPACE : 8,
	
		/**
		 * @type number
		 * @public
		 */
		TAB : 9,
	
		/**
		 * @type number
		 * @public
		 */
		ENTER : 13,
	
		/**
		 * @type number
		 * @public
		 */
		SHIFT : 16,
	
		/**
		 * @type number
		 * @public
		 */
		CONTROL : 17,
	
		/**
		 * @type number
		 * @public
		 */
		ALT : 18,
	
		/**
		 * @type number
		 * @public
		 */
		BREAK : 19,
	
		/**
		 * @type number
		 * @public
		 */
		CAPS_LOCK : 20,
	
		/**
		 * @type number
		 * @public
		 */
		ESCAPE : 27,
	
		/**
		 * @type number
		 * @public
		 */
		SPACE : 32,
	
		/**
		 * @type number
		 * @public
		 */
		PAGE_UP : 33,
	
		/**
		 * @type number
		 * @public
		 */
		PAGE_DOWN : 34,
	
		/**
		 * @type number
		 * @public
		 */
		END : 35,
	
		/**
		 * @type number
		 * @public
		 */
		HOME : 36,
	
		/**
		 * @type number
		 * @public
		 */
		ARROW_LEFT : 37,
	
		/**
		 * @type number
		 * @public
		 */
		ARROW_UP : 38,
	
		/**
		 * @type number
		 * @public
		 */
		ARROW_RIGHT : 39,
	
		/**
		 * @type number
		 * @public
		 */
		ARROW_DOWN : 40,
	
		/**
		 * @type number
		 * @public
		 */
		PRINT : 44,
	
		/**
		 * @type number
		 * @public
		 */
		INSERT : 45,
	
		/**
		 * @type number
		 * @public
		 */
		DELETE : 46,
	
		/**
		 * @type number
		 * @public
		 */
		DIGIT_0 : 48,
	
		/**
		 * @type number
		 * @public
		 */
		DIGIT_1 : 49,
	
		/**
		 * @type number
		 * @public
		 */
		DIGIT_2 : 50,
	
		/**
		 * @type number
		 * @public
		 */
		DIGIT_3 : 51,
	
		/**
		 * @type number
		 * @public
		 */
		DIGIT_4 : 52,
	
		/**
		 * @type number
		 * @public
		 */
		DIGIT_5 : 53,
	
		/**
		 * @type number
		 * @public
		 */
		DIGIT_6 : 54,
	
		/**
		 * @type number
		 * @public
		 */
		DIGIT_7 : 55,
	
		/**
		 * @type number
		 * @public
		 */
		DIGIT_8 : 56,
	
		/**
		 * @type number
		 * @public
		 */
		DIGIT_9 : 57,
	
		/**
		 * @type number
		 * @public
		 */
		A : 65,
	
		/**
		 * @type number
		 * @public
		 */
		B : 66,
	
		/**
		 * @type number
		 * @public
		 */
		C : 67,
	
		/**
		 * @type number
		 * @public
		 */
		D : 68,
	
		/**
		 * @type number
		 * @public
		 */
		E : 69,
	
		/**
		 * @type number
		 * @public
		 */
		F : 70,
	
		/**
		 * @type number
		 * @public
		 */
		G : 71,
	
		/**
		 * @type number
		 * @public
		 */
		H : 72,
	
		/**
		 * @type number
		 * @public
		 */
		I : 73,
	
		/**
		 * @type number
		 * @public
		 */
		J : 74,
	
		/**
		 * @type number
		 * @public
		 */
		K : 75,
	
		/**
		 * @type number
		 * @public
		 */
		L : 76,
	
		/**
		 * @type number
		 * @public
		 */
		M : 77,
	
		/**
		 * @type number
		 * @public
		 */
		N : 78,
	
		/**
		 * @type number
		 * @public
		 */
		O : 79,
	
		/**
		 * @type number
		 * @public
		 */
		P : 80,
	
		/**
		 * @type number
		 * @public
		 */
		Q : 81,
	
		/**
		 * @type number
		 * @public
		 */
		R : 82,
	
		/**
		 * @type number
		 * @public
		 */
		S : 83,
	
		/**
		 * @type number
		 * @public
		 */
		T : 84,
	
		/**
		 * @type number
		 * @public
		 */
		U : 85,
	
		/**
		 * @type number
		 * @public
		 */
		V : 86,
	
		/**
		 * @type number
		 * @public
		 */
		W : 87,
	
		/**
		 * @type number
		 * @public
		 */
		X : 88,
	
		/**
		 * @type number
		 * @public
		 */
		Y : 89,
	
		/**
		 * @type number
		 * @public
		 */
		Z : 90,
	
		/**
		 * @type number
		 * @public
		 */
		WINDOWS : 91,
	
		/**
		 * @type number
		 * @public
		 */
		CONTEXT_MENU : 93,
	
		/**
		 * @type number
		 * @public
		 */
		TURN_OFF : 94,
	
		/**
		 * @type number
		 * @public
		 */
		SLEEP : 95,
	
		/**
		 * @type number
		 * @public
		 */
		NUMPAD_0 : 96,
	
		/**
		 * @type number
		 * @public
		 */
		NUMPAD_1 : 97,
	
		/**
		 * @type number
		 * @public
		 */
		NUMPAD_2 : 98,
	
		/**
		 * @type number
		 * @public
		 */
		NUMPAD_3 : 99,
	
		/**
		 * @type number
		 * @public
		 */
		NUMPAD_4 : 100,
	
		/**
		 * @type number
		 * @public
		 */
		NUMPAD_5 : 101,
	
		/**
		 * @type number
		 * @public
		 */
		NUMPAD_6 : 102,
	
		/**
		 * @type number
		 * @public
		 */
		NUMPAD_7 : 103,
	
		/**
		 * @type number
		 * @public
		 */
		NUMPAD_8 : 104,
	
		/**
		 * @type number
		 * @public
		 */
		NUMPAD_9 : 105,
	
		/**
		 * @type number
		 * @public
		 */
		NUMPAD_ASTERISK : 106,
	
		/**
		 * @type number
		 * @public
		 */
		NUMPAD_PLUS : 107,
	
		/**
		 * @type number
		 * @public
		 */
		NUMPAD_MINUS : 109,
	
		/**
		 * @type number
		 * @public
		 */
		NUMPAD_COMMA : 110,
	
		/**
		 * @type number
		 * @public
		 */
		NUMPAD_SLASH : 111,
	
		/**
		 * @type number
		 * @public
		 */
		F1 : 112,
	
		/**
		 * @type number
		 * @public
		 */
		F2 : 113,
	
		/**
		 * @type number
		 * @public
		 */
		F3 : 114,
	
		/**
		 * @type number
		 * @public
		 */
		F4 : 115,
	
		/**
		 * @type number
		 * @public
		 */
		F5 : 116,
	
		/**
		 * @type number
		 * @public
		 */
		F6 : 117,
	
		/**
		 * @type number
		 * @public
		 */
		F7 : 118,
	
		/**
		 * @type number
		 * @public
		 */
		F8 : 119,
	
		/**
		 * @type number
		 * @public
		 */
		F9 : 120,
	
		/**
		 * @type number
		 * @public
		 */
		F10 : 121,
	
		/**
		 * @type number
		 * @public
		 */
		F11 : 122,
	
		/**
		 * @type number
		 * @public
		 */
		F12 : 123,
	
		/**
		 * @type number
		 * @public
		 */
		NUM_LOCK : 144,
	
		/**
		 * @type number
		 * @public
		 */
		SCROLL_LOCK : 145,
	
		/**
		 * @type number
		 * @public
		 */
		OPEN_BRACKET : 186,
	
		/**
		 * @type number
		 * @public
		 */
		PLUS : 187,
	
		/**
		 * @type number
		 * @public
		 */
		COMMA : 188,
	
		/**
		 * @type number
		 * @public
		 */
		SLASH : 189,
	
		/**
		 * @type number
		 * @public
		 */
		DOT : 190,
	
		/**
		 * @type number
		 * @public
		 */
		PIPE : 191,
	
		/**
		 * @type number
		 * @public
		 */
		SEMICOLON : 192,
	
		/**
		 * @type number
		 * @public
		 */
		MINUS : 219,
	
		/**
		 * @type number
		 * @public
		 */
		GREAT_ACCENT : 220,
	
		/**
		 * @type number
		 * @public
		 */
		EQUALS : 221,
	
		/**
		 * @type number
		 * @public
		 */
		SINGLE_QUOTE : 222,
	
		/**
		 * @type number
		 * @public
		 */
		BACKSLASH : 226
	};

	return jQuery;

});
