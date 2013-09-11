/*
	poly/date

	ES5-ish Date shims for older browsers.

	(c) copyright 2011-2013 Brian Cavalier and John Hann

	This module is part of the cujo.js family of libraries (http://cujojs.com/).

	Licensed under the MIT License at:
		http://www.opensource.org/licenses/mit-license.php
*/
(function (origDate) {
define(['./lib/_base'], function (base) {

	var origProto,
		origParse,
		featureMap,
		maxDate,
		invalidDate,
		isoCompat,
		isoParseRx,
		ownProp,
		undef;

	origProto = origDate.prototype;
	origParse = origDate.parse;

	ownProp = Object.prototype.hasOwnProperty;

	maxDate = 8.64e15;
	invalidDate = NaN;
	// borrowed this from https://github.com/kriskowal/es5-shim
	isoCompat = function () { return origDate.parse('+275760-09-13T00:00:00.000Z') == maxDate; };
	// can't even have spaces in iso date strings
	// in Chrome and FF, the colon in the timezone is optional, but IE, Opera, and Safari need it
	isoParseRx = /^([+\-]\d{6}|\d{4})(?:-(\d{2}))?(?:-(\d{2}))?(?:T(\d{2}):(\d{2})(?::(\d{2})(?:.(\d{1,3}))?)?(?:Z|([+\-])(\d{2})(?::(\d{2}))?)?)?$/;

	featureMap = {
		'date-now': 'now',
		'date-tojson': 'toJSON',
		'date-toisostring': 'toISOString'
	};

	function has (feature) {
		var prop = featureMap[feature];
		return prop in origDate || prop in origProto;
	}

	if (!has('date-now')) {
		origDate.now = function () { return +(new Date); };
	}

	function isInvalidDate (date) {
		return !isFinite(date);
	}

	function fix2 (number) {
		// ensures number is formatted to at least two digits
		return (number < 10 ? '0' : '') + number;
	}

	function isoParse (str) {
		// parses simplified iso8601 dates, such as
		// yyyy-mm-ddThh:mm:ssZ
		// +yyyyyy-mm-ddThh:mm:ss-06:30
		var result;

		// prepare for the worst
		result = invalidDate;

		// fast parse
		str.replace(isoParseRx, function (a, y, m, d, h, n, s, ms, tzs, tzh, tzm) {
			var adjust = 0;

			// Date.UTC handles years between 0 and 100 as 2-digit years, but
			// that's not what we want with iso dates. If we move forward
			// 400 years -- a full cycle in the Gregorian calendar -- then
			// subtract the 400 years (as milliseconds) afterwards, we can avoid
			// this problem. (learned of this trick from kriskowal/es5-shim.)
			if (y >= 0 && y < 100) {
				y = +y + 400; // convert to number
				adjust = -126227808e5; // 400 years
			}

			result = Date.UTC(y, (m || 1) - 1, d || 1, h || 0, n || 0, s || 0, ms || 0) + adjust;

			tzh = +(tzs + tzh); // convert to signed number
			tzm = +(tzs + tzm); // convert to signed number

			if (tzh || tzm) {
				result -= (tzh + tzm / 60) * 36e5;
				// check if time zone is out of bounds
				if (tzh > 23 || tzh < -23 || tzm > 59) result = invalidDate;
				// check if time zone pushed us over maximum date value
				if (result > maxDate) result = invalidDate;
			}

			return ''; // reduces memory used
		});

		return result;
	}

	if (!has('date-toisostring')) {

		origProto.toISOString = function toIsoString () {
			if (isInvalidDate(this)) {
				throw new RangeError("toISOString called on invalid value");
			}
			return [
				this.getUTCFullYear(), '-',
				fix2(this.getUTCMonth() + 1), '-',
				fix2(this.getUTCDate()), 'T',
				fix2(this.getUTCHours()), ':',
				fix2(this.getUTCMinutes()), ':',
				fix2(this.getUTCSeconds()), '.',
				(this.getUTCMilliseconds()/1000).toFixed(3).slice(2), 'Z'
			].join('');
		};

	}

	if (!has('date-tojson')) {

		origProto.toJSON = function toJSON (key) {
			// key arg is ignored by Date objects, but since this function
			// is generic, other Date-like objects could use the key arg.
			// spec says to throw a TypeError if toISOString is not callable
			// but that's what happens anyways, so no need for extra code.
			return this.toISOString();
		};
	}

	function checkIsoCompat () {
		// fix Date constructor

		var newDate = (function () {
			// Replacement Date constructor
			return function Date (y, m, d, h, mn, s, ms) {
				var len, result;

				// Date called as function, not constructor
				if (!(this instanceof newDate)) return origDate.apply(this, arguments);

				len = arguments.length;

				if (len === 0) {
					result = new origDate();
				}
				else if (len === 1) {
					result = new origDate(base.isString(y) ? newDate.parse(y) : y);
				}
				else {
					result = new origDate(y, m, d == undef ? 1 : d, h || 0, mn || 0, s || 0, ms || 0);
				}

				result.constructor = newDate;

				return result;
			};
		}());

		if (!isoCompat()) {

			newDate.now = origDate.now;
			newDate.UTC = origDate.UTC;
			newDate.prototype = origProto;
			newDate.prototype.constructor = newDate;

			newDate.parse = function parse (str) {
				var result;

				// check for iso date
				result = isoParse('' + str);

				if (isInvalidDate(result)) {
					// try original parse()
					result = origParse(str);
				}

				return result;
			};

			// Unfortunate. See cujojs/poly#11
			// Copy any owned props that may have been previously added to
			// the Date constructor by 3rd party libs.
			copyPropsSafely(newDate, origDate);

			Date = newDate;
		}
		else if (Date != origDate) {
			Date = origDate;
		}

	}

	function copyPropsSafely(dst, src) {
		for (var p in src) {
			if (ownProp.call(src, p) && !ownProp.call(dst, p)) {
				dst[p] = src[p];
			}
		}
	}

	checkIsoCompat();

	return {
		setIsoCompatTest: function (testFunc) {
			isoCompat = testFunc;
			checkIsoCompat();
		}
	};

});
}(Date));
