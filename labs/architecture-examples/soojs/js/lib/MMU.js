/**
 * MMU.js
 *
 * A common set of utilities to simplify some tasks in Javascript
 *
 * Created: 12/13/2012		Matt Maher
 */


(function() {
	MMU = {

		/* ---++---     ---++---     ---++---     ---++---     ---++---
		 *	 U T I L I T Y
		 *	 F U N C T I O N S
		 */

		isNullOrEmpty			: function (object) {
			if (typeof object === 'undefined') {
				return true;
			}

			// immediate
			if (object === null) {
				return true;
			}

			// STRING
			return MMU.getStringValue(object) === "";
		},

		isNoE					: function (object) {
			return MMU.isNullOrEmpty(object);
		},

		getStringValue			: function (object) {

			// null or empty
			if (typeof object === 'undefined' || object === null) {
				return "";
			}

			try {
				return object.toString();
			} catch (e) {
				return "";
			}
		},

		getBooleanValue			: function (object) {
			var stringValue				= MMU.getStringValue(object).toLowerCase();
			switch (stringValue) {
				case "true":
					return true;
					break;
				case "t":
					return true;
					break;
				case "1":
					return true;
					break;
				case "yes":
					return true;
					break;
				case "y":
					return true;
					break;
				case "checked":
					return true;
					break;
				case "selected":
					return true;
					break;
				case "on":
					return true;
					break;

				default:
					return false;
					break;
			}
		},

		getIntValue				: function (value) {
			if (value === null || value < 0) return 0;
			else return Math.floor(value);
		},

		random					: function (max, min) {
			max 			= parseInt(max);
			min 			= parseInt(min);

			if (isNaN(max)) max = 10;
			if (isNaN(min)) min = 0;

			if (min > max) {
				var t = min;
				min = max;
				max = t;
			}

			var randomNum	= Math.floor(Math.random() * ((max+1) - min)) + min;
			return randomNum;
		},

		flipIsHeads				: function () {
			var r = MMU.random(1);
			return r == 1;
		},

		toType					: function (object) {
			return ({}).toString.call(object).match(/\s([a-z|A-Z]+)/)[1].toLowerCase();
		},

		merge					: function (root) {

			// GO THROUGH EACH OBJECT SENT TO US
			// starting at 1 to skip "root"
			for ( var i = 1; i < arguments.length; i++ ) {

				var objectToTakeFrom	= arguments[i];

				// GET THE PROPERTIES FROM THIS OBJECT
				for ( var key in objectToTakeFrom ) {

					// IF THIS PROPERTY IS OWNED BY THIS OBJECT
					if ( objectToTakeFrom.hasOwnProperty(key)) {

						var propertyToMerge	= objectToTakeFrom[key];
						var propertyOnRoot	= root[key] || null;

						// ROOT DOES NOT HAVE THIS OBJECT -- OR NOT AN OBJECT
						// move it over entirely
						if ( propertyOnRoot === null || typeof propertyToMerge !== 'object') {
							root[key] = propertyToMerge;
						}

						// ROOT ALREADY HAS A PROPERTY WITH THIS NAME
						// deep merge to maintain as much data as possible
						else {
							root[key] = MMU.merge(propertyOnRoot, propertyToMerge);
						}
					}
				}
			}
			return root;
		},

		combineIntoNewObject	: function () {
			var newObject		= {};
			var argsArray 		= [].slice.apply(arguments);
			var newArgs			= [newObject];

			// CREATE AN ARRAY OF BRAND NEW OBJECTS
			// as our merge is destructive
			for ( var i = 0; i < argsArray.length; i++ ) {
				newArgs.push(JSON.parse(JSON.stringify(argsArray[i])));
			}

			return MMU.merge.apply(this, newArgs);

		},

		toJSONWithFuncs 		: function (object) {
			Object.prototype.toJSON 	= function() {
				var sobj 				= {}, i;
				for (i in this)
					if (this.hasOwnProperty(i))
						sobj[i] = typeof this[i] == 'function' ?
							this[i].toString() : this[i];

				return sobj;
			};

			var str = JSON.stringify(object);

			delete Object.prototype.toJSON;

			return str;
		},

		setRepeat				: function (callback, interval, repetitions, immediate) {
			function repeater(repetitions) {
				if (repetitions >= 0) {
					callback.call(this);
					setTimeout(function () {
						repeater(--repetitions)
					}, interval)
				}
			}
			repetitions 		= repetitions || 1;
			interval 			= interval || 1000;

			if (immediate) {
				repeater(--repetitions)
			} else {
				setTimeout(function () {
					repeater(--repetitions)
				}, interval)
			}
		},

		queryUrlParam			: function (name)	{
			name				= name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
			var regexS			= "[\\?&]"+name+"=([^&#]*)";
			var regex			= new RegExp( regexS );
			var results			= regex.exec(window.location.href);
			return (results === null) ? "" : results[1];
		},

		assertLog				: function (isTrue, message, failMessageOptional) {
			if ( ! isTrue) {
				if ( ! MMU.isNoE(failMessageOptional)) {
					console.error("FAIL: " + failMessageOptional);
				}

				else {
					console.error("FAIL: " + message);
				}

			}

			else {
				log("PASS: " + message);
			}
		},


		/* ---++---     ---++---     ---++---     ---++---     ---++---
		 *	 S T R I N G
		 *	 F U N C T I O N S
		 */
		trim					: function (string) {
			return string.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
		},

		stripNonNumeric			: function (string, allowDecimals) {
			var myregexp 	= /[^0-9a-zA-Z]/g;
			if(allowDecimals) {
				myregexp 	= /[^0-9a-zA-Z\.]/g;
			}
			return string.replace(myregexp, '');
		},

		stripNonAlphaNumeric	: function (string, allowSpace, allowDecimals) {
			var myregexp 	= /[^0-9a-zA-Z]/g;
			if(allowSpace) {
				myregexp 	= /[^0-9a-zA-Z ]/g;
			}
			else if(allowSpace && allowDecimals) {
				myregexp 	= /[^0-9a-zA-Z \.]/g;
			}
			else if(allowDecimals) {
				myregexp 	= /[^0-9a-zA-Z\.]/g;
			}
			return string.replace(myregexp, '');
		},

		fLeft					: function (string, delim) {
			if( MMU.isNoE(string) || MMU.isNoE(delim)) {
				return "";
			}

			string						= MMU.getStringValue(string);
			delim						= MMU.getStringValue(delim);

			var theSpot					= string.indexOf(delim);
			if (theSpot > -1) {
				return string.substring(0, theSpot);
			}
			return "";
		},

		fLeftBack				: function (string, delim) {
			if( MMU.isNoE(string) || MMU.isNoE(delim)) {
				return "";
			}

			string						= MMU.getStringValue(string);
			delim						= MMU.getStringValue(delim);

			var theSpot					= string.lastIndexOf(delim);
			if (theSpot > -1) {
				return string.substring(0, theSpot);
			}
			return "";
		},

		fRight					: function (string, delim) {
			if( MMU.isNoE(string) || MMU.isNoE(delim)) {
				return "";
			}

			string						= MMU.getStringValue(string);
			delim						= MMU.getStringValue(delim);

			var theSpot					= string.indexOf(delim);
			if (theSpot > -1) {
				return string.substring(theSpot + delim.length, string.length);
			}

			return "";
		},

		fRightBack				: function (string, delim) {

			if( MMU.isNoE(string) || MMU.isNoE(delim)) {
				return "";
			}

			string						= MMU.getStringValue(string);
			delim						= MMU.getStringValue(delim);

			var theSpot					= string.lastIndexOf(delim);
			if (theSpot > -1) {
				return string.substring(theSpot + delim.length, string.length);
			}

			return "";
		},

		fBetween				: function (string, delimLeft, delimRight) {
			return MMU.fLeft(MMU.fRight(string, delimLeft), delimRight);
		},

		fBetweenOuter			: function (string, delimLeft, delimRight) {
			return MMU.fLeftBack(MMU.fRight(string, delimLeft), delimRight);
		},

		replaceFor				: function (string, lookFor, replaceWith) {

			if(MMU.isNoE(string)) {
				return "";
			}

			if (MMU.isNoE(lookFor)) {
				return string;
			}

			if (MMU.isNoE(replaceWith)) {
				replaceWith			= "";
			}

			var regex				= new RegExp(lookFor, "g");
			return string.replace(regex, replaceWith);
		},

		padRight				: function (string, length, padString) {
			if(MMU.isNoE(padString)) {
				return string;
			}

			string 			= MMU.getStringValue(string);
			while (string.length < length) {
				string		+= padString;
			}
			return string;
		},

		padLeft					: function (string, length, padString) {
			if(MMU.isNoE(padString)) {
				return string;
			}

			string 			= MMU.getStringValue(string);
			while (string.length < length) {
				string		= padString + string;
			}
			return string;
		},

		occurrences				: function (string, substr, allowOverlapping) {
			string			+= "";
			substr		+= "";

			if (substr.length <= 0) {
				return string.length + 1;
			}

			if (string.length <= 0) {
				return 0;
			}

			var n			= 0;
			var pos			= 0;
			var step		= (allowOverlapping) ? (1) : (substr.length);

			while(true) {
				pos			= string.indexOf(substr,pos);
				if(pos>=0) {
					n++;
					pos+=step;
				}

				else {
					break;
				}
			}
			return(n);
		},

		contains				: function (string, substr, caseInsensitive) {
			if (MMU.isNoE(substr)) {
				return false;
			}

			if (typeof string == "string") {
				if (caseInsensitive) {
					return string.toLowerCase().indexOf(substr.toLowerCase()) > -1;
				}

				else {
					return string.indexOf(substr) > -1;
				}

			}

			return false;
		},



		/* ---++---     ---++---     ---++---     ---++---     ---++---
		 *	 D A T E
		 *	 F U N C T I O N S
		 */

		dateFromYMD							: function (ymdString) {

			var year									= MMU.fLeft(ymdString, "-");
			var month									= MMU.fBetween(ymdString, "-", "-");
			var day										= MMU.fRightBack(ymdString, "-");

			// bail
			if (year == "" || month == "" || day == "") {
				return null;
			}

			return new Date(year, month - 1, day);//fix for the defect#237178,month issue
		},

		isDateBeforeDate					: function (thisDate, thatDate) {
			if (MMU.isNoE(thisDate) || MMU.isNoE(thatDate)) {
				return false;
			}
			return thisDate.getTime() < thatDate.getTime();
		},

		isDateAfterDate						: function (thisDate, thatDate) {
			if (MMU.isNoE(thisDate) || MMU.isNoE(thatDate)) {
				return false;
			}
			return thisDate.getTime() > thatDate.getTime();
		},

		ymdFromDate							: function (date) {
			if (MMU.isNoE(date)) {
				return null;
			}
			return dateFormat(date, "yyyy-mm-dd");
		},

		ymdDaysAgo							: function (days, dateOrNull) {
			if (MMU.isNoE(dateOrNull)) {
				dateOrNull		= new Date();
			}
			days			= Math.max(days, 0);
			var then 		= MMU.getDateBySubtractingDaysFromDate(dateOrNull, days);
			return MMU.ymdFromDate(then);
		},

		ymdDaysFuture						: function (days, dateOrNull) {
			if (MMU.isNoE(dateOrNull)) {
				dateOrNull		= new Date();
			}
			days			= Math.max(days, 0);
			var then 		= MMU.getDateByAddingDaysToDate(dateOrNull, days);
			return MMU.ymdFromDate(then);
		},

		/*
		 ___   _ _____ ___   __  __   _ _____ _  _
		 |   \ /_\_   _| __| |  \/  | /_\_   _| || |
		 | |) / _ \| | | _|  | |\/| |/ _ \| | | __ |
		 |___/_/ \_\_| |___| |_|  |_/_/ \_\_| |_||_|
		 */
		getDateByAddingDaysToDate			: function (date, daysToAdd) {
			if( MMU.isNoE(date)) {
				return null;
			}
			var newDate 	= new Date(date);
			newDate.setDate(newDate.getDate() + daysToAdd);
			return newDate;
		},

		getDateBySubtractingDaysFromDate	: function (date, daysToAdd) {
			return MMU.getDateByAddingDaysToDate(date, (daysToAdd * -1));
		},

		getDateByAddingMonthsToDate			: function (date, monthsToAdd) {
			if( MMU.isNoE(date)) {
				return null;
			}
			/*
			 * does not deal well with the end dates of months
			 * at this time. so moving ahead a month from
			 * 		2012-08-31
			 * gives you
			 * 		2012-10-01
			 * because the 31st doesn't exist in September
			 * so it rolls over the leftover "days" into
			 * the next month.
			 */
			var newDate 	= new Date(date);
			newDate.setMonth(newDate.getMonth() + monthsToAdd);
			return newDate;
		},

		getDateByAddingYearsToDate			: function (date, yearToAdd) {
			if( MMU.isNoE(date)) {
				return null;
			}
			/*
			 * Leap Year issues
			 *
			 * given a leap date this will move to the next
			 * date (though still in the next year)
			 *
			 */
			var newDate 	= new Date(date);
			newDate.setFullYear(newDate.getFullYear() + yearToAdd);
			return newDate;
		},

		getMondayOfWeekForDate				: function (date) {
			return MMU.getDateForDayOfWeekForDate(date, 1);
		},

		getDateForDayOfWeekForDate			: function (date, dayOfWeekDesired0IsSunday) {
			if( MMU.isNoE(date)) {
				return null;
			}
			var newDate 	= new Date(date);
			var dayNum		= newDate.getDay();		//  (0 - 6) Returns the day of the week. The week begins with Sunday

			// already the right day
			if(dayNum == dayOfWeekDesired0IsSunday) {
				return newDate;
			}

			// must move to previous week
			else if(dayNum < dayOfWeekDesired0IsSunday) {
				// (6 + 1) gets us to the previous saturday, then
				// (6 - dayOfWeekDesired0IsSunday) goes back to the day needed
				return MMU.getDateBySubtractingDaysFromDate(newDate, (dayNum + 1) + (6 - dayOfWeekDesired0IsSunday) );
			}

			// earlier in this week
			else {
				return MMU.getDateBySubtractingDaysFromDate(newDate, (dayNum - dayOfWeekDesired0IsSunday));
			}
		},

		getDateFromFirstOfMonthOfDate		: function (date) {
			if( MMU.isNoE(date)) {
				return null;
			}
			var newDate 	= new Date(date);
			newDate.setDate(1);
			return newDate;
		},

		getDateFromFirstOfYearOfDate		: function (date) {
			if( MMU.isNoE(date)) {
				return null;
			}
			var newDate 	= new Date(date);
			newDate.setDate(1);
			newDate.setMonth(0);
			return newDate;
		},

		numberOfDaysBetweenDatesABSInt		: function (thisDate, thatDate) {
			if( MMU.isNoE(thisDate) || MMU.isNoE(thatDate)) {
				return null;
			}

			var firstDate		= MMU.getABSDateFromDate(thisDate);
			var lastDate		= MMU.getABSDateFromDate(thatDate);

			var oneDay 			= 24*60*60*1000; // hours*minutes*seconds*milliseconds
			var diffDays 		= Math.abs((firstDate.getTime() - lastDate.getTime()) / (oneDay));
			return parseInt(diffDays, 10);
		},

		getABSDateFromDate					: function (date) {
			if( MMU.isNoE(date)) {
				return null;
			}

			var newDate			= new Date(date);
			newDate.setHours(0, 0, 0, 0);
			return newDate;
		}

	};
})();










/* ---++---     ---++---     ---++---     ---++---     ---++---
 *	 L O G
 */
(function() {
	var method;
	var noop = function noop() {};
	var methods = [
		'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
		'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
		'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
		'timeStamp', 'trace', 'warn'
	];
	var length = methods.length;
	var console = (window.console = window.console || {});

	if (console) {
		log = Function.prototype.bind.call(console.log, console);

		logIf = function(flag) {
			if (flag) {
				var args = Array.prototype.slice.call(arguments);
				args.shift();
				log.apply(this, args);
			}
		};
	}

	while (length--) {
		method = methods[length];

		// Only stub undefined methods.
		if ( ! console[method]) {
			console[method] = noop;
		}
	}
})();





/* ---++---     ---++---     ---++---     ---++---     ---++---
 *	 D A T E
 *	 F O R M A T T E R
 *
 *			Date Format 1.2.3
 * 			(c) 2007-2009 Steven Levithan <stevenlevithan.com>
 * 			MIT license
 *
 *			Includes enhancements by Scott Trenda <scott.trenda.net>
 *			and Kris Kowal <cixar.com/~kris.kowal/>
 *
 *			Accepts a date, a mask, or a date and a mask.
 *			Returns a formatted version of the given date.
 *			The date defaults to the current date/time.
 *			The mask defaults to dateFormat.masks.default.
 *
 *					dateFormat(now, "dddd, mmmm dS, yyyy, h:MM:ss TT");
 *						-> Saturday, June 9th, 2007, 5:46:21 PM
 *					dateFormat(now, "dddd, mmmm dS, yyyy, h:MM:ss TT");
 *						-> Saturday, June 9th, 2007, 5:46:21 PM
 *			http://blog.stevenlevithan.com/archives/date-time-format
 */
(function() {
	dateFormat=function(){var a=/d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,b=/\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,c=/[^-+\dA-Z]/g,d=function(a,b){a=String(a);b=b||2;while(a.length<b)a="0"+a;return a};return function(e,f,g){var h=dateFormat;if(arguments.length==1&&Object.prototype.toString.call(e)=="[object String]"&&!/\d/.test(e)){f=e;e=undefined}e=e?new Date(e):new Date;if(isNaN(e))throw SyntaxError("invalid date");f=String(h.masks[f]||f||h.masks["default"]);if(f.slice(0,4)=="UTC:"){f=f.slice(4);g=true}var i=g?"getUTC":"get",j=e[i+"Date"](),k=e[i+"Day"](),l=e[i+"Month"](),m=e[i+"FullYear"](),n=e[i+"Hours"](),o=e[i+"Minutes"](),p=e[i+"Seconds"](),q=e[i+"Milliseconds"](),r=g?0:e.getTimezoneOffset(),s={d:j,dd:d(j),ddd:h.i18n.dayNames[k],dddd:h.i18n.dayNames[k+7],m:l+1,mm:d(l+1),mmm:h.i18n.monthNames[l],mmmm:h.i18n.monthNames[l+12],yy:String(m).slice(2),yyyy:m,h:n%12||12,hh:d(n%12||12),H:n,HH:d(n),M:o,MM:d(o),s:p,ss:d(p),l:d(q,3),L:d(q>99?Math.round(q/10):q),t:n<12?"a":"p",tt:n<12?"am":"pm",T:n<12?"A":"P",TT:n<12?"AM":"PM",Z:g?"UTC":(String(e).match(b)||[""]).pop().replace(c,""),o:(r>0?"-":"+")+d(Math.floor(Math.abs(r)/60)*100+Math.abs(r)%60,4),S:["th","st","nd","rd"][j%10>3?0:(j%100-j%10!=10)*j%10]};return f.replace(a,function(a){return a in s?s[a]:a.slice(1,a.length-1)})}}();dateFormat.masks={"default":"ddd mmm dd yyyy HH:MM:ss",shortDate:"m/d/yy",mediumDate:"mmm d, yyyy",longDate:"mmmm d, yyyy",fullDate:"dddd, mmmm d, yyyy",shortTime:"h:MM TT",mediumTime:"h:MM:ss TT",longTime:"h:MM:ss TT Z",isoDate:"yyyy-mm-dd",isoTime:"HH:MM:ss",isoDateTime:"yyyy-mm-dd'T'HH:MM:ss",isoUtcDateTime:"UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"};dateFormat.i18n={dayNames:["Sun","Mon","Tue","Wed","Thu","Fri","Sat","Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],monthNames:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec","January","February","March","April","May","June","July","August","September","October","November","December"]};Date.prototype.format=function(a,b){return dateFormat(this,a,b)}
})();





/* ---++---     ---++---     ---++---     ---++---     ---++---
 *	 A R R A Y
 *	 P R O T O T Y P E S
 */
(function() {
	Array.prototype.popFirstElement = function popFirstElement() {
		this.splice(0,1);
	};

	Array.prototype.popLastElement = function popLastElement() {
		this.pop();
	};

	if( ! Array.prototype.indexOf ) {
		Array.prototype.indexOf = function(needle) {
			for(var i = 0; i < this.length; i++) {
				if(this[i] === needle) {
					return i;
				}
			}
			return -1;
		};
	}

	Array.prototype.contains = function(needle) {
		return this.indexOf(needle) > -1;
	}
})();