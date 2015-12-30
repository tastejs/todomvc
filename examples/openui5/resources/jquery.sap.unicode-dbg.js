/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

/**
 * Provides Unicode related functionalities. This module is not public, as the feature may only be temporarily and
 * could removed as soon as the thirdparty lib unorm offers a quickcheck for normalization forms.
 *
 * <strong>Note</strong>: This module does not support mobile browsers
 */
sap.ui.define(['jquery.sap.global', 'sap/ui/Device'],
	function(jQuery, Device) {
	'use strict';

	var bNativeSupport = !!String.prototype.normalize;

	// only load unorm and apply polyfill if needed and when not in a mobile browser
	/*global UNorm *///declare unusual global vars for JSLint/SAPUI5 validation
	if (!bNativeSupport && !Device.browser.mobile) {
		jQuery.sap.require("sap.ui.thirdparty.unorm");
		jQuery.sap.require("sap.ui.thirdparty.unormdata");

		/*eslint-disable no-extend-native */
		String.prototype.normalize = function(str) {
		/*eslint-enable no-extend-native */
			switch (str) {
				case 'NFC':
					return jQuery.sap.isStringNFC(this) ? this : UNorm.nfc(this);
				case 'NFD':
					return UNorm.nfd(this);
				case 'NFKC':
					return UNorm.nfkc(this);
				case 'NFKD':
					return UNorm.nfkd(this);
				default:
					return jQuery.sap.isStringNFC(this) ? this : UNorm.nfc(this);
			}
		};
	}

	// build a map for quick access
	var mData = {};
	(function() {
		// derived from http://www.unicode.org/Public/8.0.0/ucd/DerivedNormalizationProps.txt
		var NFC_QC =  [
			[0x0340, 0x0341], [0x0343, 0x0344], 0x374, 0x037E, 0x387, [0x0958, 0x095F], [0x09DC, 0x09DD], 0x09DF, 0x0A33,
			0x0A36, [0x0A59, 0x0A5B], 0x0A5E, [0x0B5C, 0x0B5D], 0x0F43, 0x0F4D, 0x0F52, 0x0F57, 0x0F5C, 0x0F69,0x0F73,
			[0x0F75, 0x0F76], 0x0F78, 0x0F81, 0x0F93, 0x0F9D, 0x0FA2, 0x0FA7, 0x0FAC, 0x0FB9, 0x1F71, 0x1F73, 0x1F75, 0x1F77,
			0x1F79, 0x1F7B, 0x1F7D, 0x1FBB, 0x1FBE, 0x1FC9, 0x1FCB, 0x1FD3, 0x1FDB, 0x1FE3, 0x1FEB, [0x1FEE, 0x1FEF], 0x1FF9,
			0x1FFB, 0x1FFD, [0x2000, 0x2001], 0x2126, [0x212A, 0x212B], 0x2329, 0x232A, 0x2ADC, [0xF900, 0xFA0D], 0xFA10,
			0xFA12, [0xFA15, 0xFA1E], 0xFA20, 0xFA22, [0xFA25, 0xFA26], [0xFA2A, 0xFA6D], [0xFA70, 0xFAD9], 0xFB1D, 0xFB1F,
			[0xFB2A, 0xFB36], [0xFB38, 0xFB3C], 0xFB3E, [0xFB40, 0xFB41], [0xFB43, 0xFB44], [0xFB46, 0xFB4E], [0x1D15E,
			0x1D164], [0x1D1BB, 0x1D1C0], [0x2F800, 0x2FA1D], [0x0300, 0x0304], [0x0306, 0x030C], 0x030F, 0x311, [0x0313,
			0x0314], 0x031B, [0x0323, 0x0328], [0x032D, 0x032E], [0x0330, 0x0331], 0x338, 0x342, 0x345, [0x0653, 0x0655],
			0x093C, 0x09BE, 0x09D7, 0x0B3E, 0x0B56, 0x0B57, 0x0BBE, 0x0BD7, 0x0C56, 0x0CC2, [0x0CD5, 0x0CD6], 0x0D3E, 0x0D57,
			0x0DCA, 0x0DCF, 0x0DDF, 0x102E, [0x1161, 0x1175], [0x11A8, 0x11C2], 0x1B35, [0x3099, 0x309A], 0x110BA, 0x11127,
			0x1133E, 0x11357, 0x114B0, 0x114BA, 0x114BD, 0x115AF
		];

		for (var i = 0; i < NFC_QC.length; i++) {
			if (typeof NFC_QC[i] == "number") {
				mData[NFC_QC[i]] = true;
			} else {
				var a = NFC_QC[i][0];
				var b = NFC_QC[i][1];
				while (a <= b) {
					mData[a++] = true;
				}
			}
		}
	}());

	// *** auxiliary functions ***
	function isHighSurrogate(cp) {
		// first part of a supplmementary character
		return cp >= 0xD800 && cp <= 0xDBFF;
	}
	function isLowSurrogate(cp) {
		// second part of a supplmementary character
		return cp >= 0xDC00 && cp <= 0xDFFF;
	}
	function getCanonicalClass(cp) {
		var dunit, hash;
		// access the unormdata
		hash = cp & 0xFF00;
		dunit = UNorm.UChar.udata[hash];
		if (dunit === undefined) {
			dunit = UNorm.UChar.udata[hash] = {};
		} else if (typeof dunit === "string") {
			// evil eval like unorm.js does it, as JSON.parse does not work for the unormdata
			/*eslint-disable no-eval */
			dunit = UNorm.UChar.udata[hash] = eval("(" + dunit + ")");
			/*eslint-enable no-eval */
		}
		// check for existence and validity of canonical class
		return dunit[cp] && !!dunit[cp][1] ? (dunit[cp][1] & 0xff) : 0;
	}
	function isNotAllowed(cp) {
		// check against the reference data
		return mData[cp];
	}

	// quickcheck implementations
	function nfcQuickCheck(s) {
		var lastCanonicalClass = 0;
		for (var i = 0; i < s.length; ++i) {
			var cp = s.charCodeAt(i);
			// check for supplementary characters, complex, as charCodeAt returns only charcodes smaller than 0xFFFF,
			// which is the Basic Multilingual Plane (BMP), but for normalizations also characters of the Supplementary
			// Multilingual Plane (SMP) have to be considered
			if (isHighSurrogate(cp)) {
				// check the next character
				var ncp = s.charCodeAt(i + 1);
				if (isLowSurrogate(ncp)) {
					// calculate the according char code in SMP and skip further tests for the next character (ncp)
					cp = (cp - 0xD800) * 0x400 + (ncp - 0xDC00) + 0x10000;
					++i;
				}
			}
			var canonicalClass = getCanonicalClass(cp);
			// check canonical class or reference list
			if (lastCanonicalClass > canonicalClass && canonicalClass !== 0 || isNotAllowed(cp)) {
				return false;
			}
			lastCanonicalClass = canonicalClass;
		}
		// nothing has been found
		return true;
	}

	// make use of native funcionality or polyfill, if applied
	function nfcNativeCheck(s) {
		return s.normalize("NFC") === s;
	}

	/**
	 * Checks wether a string should be normalized or not. It evaluates NO and MAYBE entries of the exclusion table
	 * NFC_QC to false. This means it is not a definitive statement, but an indicator for normalization.
	 *
	 * So please be aware that the result may differ in different browsers.
	 *
	 * @param s the string to be checked
	 * @return {boolean} indicating wether s is or maybe NFC
	 * @private
	 * @static
	 */
	jQuery.sap.isStringNFC = (bNativeSupport ? nfcNativeCheck : nfcQuickCheck);

	return jQuery;

});
