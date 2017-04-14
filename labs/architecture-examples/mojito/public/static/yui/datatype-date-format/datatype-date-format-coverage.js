/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
if (typeof _yuitest_coverage == "undefined"){
    _yuitest_coverage = {};
    _yuitest_coverline = function(src, line){
        var coverage = _yuitest_coverage[src];
        if (!coverage.lines[line]){
            coverage.calledLines++;
        }
        coverage.lines[line]++;
    };
    _yuitest_coverfunc = function(src, name, line){
        var coverage = _yuitest_coverage[src],
            funcId = name + ":" + line;
        if (!coverage.functions[funcId]){
            coverage.calledFunctions++;
        }
        coverage.functions[funcId]++;
    };
}
_yuitest_coverage["build/datatype-date-format/datatype-date-format.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/datatype-date-format/datatype-date-format.js",
    code: []
};
_yuitest_coverage["build/datatype-date-format/datatype-date-format.js"].code=["YUI.add('datatype-date-format', function (Y, NAME) {","","/**"," * The `datatype` module is an alias for three utilities, Y.Date, "," * Y.Number and Y.XML, that provide type-conversion and string-formatting"," * convenience methods for various JavaScript object types."," *"," * @module datatype"," * @main datatype"," */","","/**"," * The Date Utility provides type-conversion and string-formatting"," * convenience methods for Dates."," *"," * @module datatype-date"," * @main datatype-date"," */","","/**"," * Date module."," *"," * @module datatype-date"," */","","/**"," * Format date module implements strftime formatters for javascript based on the"," * Open Group specification defined at"," * http://www.opengroup.org/onlinepubs/007908799/xsh/strftime.html"," * This implementation does not include modified conversion specifiers (i.e., Ex and Ox)"," *"," * @module datatype-date"," * @submodule datatype-date-format"," */","","/**"," * Date provides a set of utility functions to operate against Date objects."," *"," * @class Date"," * @static"," */","","/**"," * Pad a number with leading spaces, zeroes or something else"," * @method xPad"," * @param x {Number}	The number to be padded"," * @param pad {String}  The character to pad the number with"," * @param r {Number}	(optional) The base of the pad, eg, 10 implies to two digits, 100 implies to 3 digits."," * @private"," */","var xPad=function (x, pad, r)","{","	if(typeof r === \"undefined\")","	{","		r=10;","	}","	pad = pad + \"\"; ","	for( ; parseInt(x, 10)<r && r>1; r/=10) {","		x = pad + x;","	}","	return x.toString();","};","","var Dt = {","	formats: {","		a: function (d, l) { return l.a[d.getDay()]; },","		A: function (d, l) { return l.A[d.getDay()]; },","		b: function (d, l) { return l.b[d.getMonth()]; },","		B: function (d, l) { return l.B[d.getMonth()]; },","		C: function (d) { return xPad(parseInt(d.getFullYear()/100, 10), 0); },","		d: [\"getDate\", \"0\"],","		e: [\"getDate\", \" \"],","		g: function (d) { return xPad(parseInt(Dt.formats.G(d)%100, 10), 0); },","		G: function (d) {","				var y = d.getFullYear();","				var V = parseInt(Dt.formats.V(d), 10);","				var W = parseInt(Dt.formats.W(d), 10);","	","				if(W > V) {","					y++;","				} else if(W===0 && V>=52) {","					y--;","				}","	","				return y;","			},","		H: [\"getHours\", \"0\"],","		I: function (d) { var I=d.getHours()%12; return xPad(I===0?12:I, 0); },","		j: function (d) {","				var gmd_1 = new Date(\"\" + d.getFullYear() + \"/1/1 GMT\");","				var gmdate = new Date(\"\" + d.getFullYear() + \"/\" + (d.getMonth()+1) + \"/\" + d.getDate() + \" GMT\");","				var ms = gmdate - gmd_1;","				var doy = parseInt(ms/60000/60/24, 10)+1;","				return xPad(doy, 0, 100);","			},","		k: [\"getHours\", \" \"],","		l: function (d) { var I=d.getHours()%12; return xPad(I===0?12:I, \" \"); },","		m: function (d) { return xPad(d.getMonth()+1, 0); },","		M: [\"getMinutes\", \"0\"],","		p: function (d, l) { return l.p[d.getHours() >= 12 ? 1 : 0 ]; },","		P: function (d, l) { return l.P[d.getHours() >= 12 ? 1 : 0 ]; },","		s: function (d, l) { return parseInt(d.getTime()/1000, 10); },","		S: [\"getSeconds\", \"0\"],","		u: function (d) { var dow = d.getDay(); return dow===0?7:dow; },","		U: function (d) {","				var doy = parseInt(Dt.formats.j(d), 10);","				var rdow = 6-d.getDay();","				var woy = parseInt((doy+rdow)/7, 10);","				return xPad(woy, 0);","			},","		V: function (d) {","				var woy = parseInt(Dt.formats.W(d), 10);","				var dow1_1 = (new Date(\"\" + d.getFullYear() + \"/1/1\")).getDay();","				// First week is 01 and not 00 as in the case of %U and %W,","				// so we add 1 to the final result except if day 1 of the year","				// is a Monday (then %W returns 01).","				// We also need to subtract 1 if the day 1 of the year is ","				// Friday-Sunday, so the resulting equation becomes:","				var idow = woy + (dow1_1 > 4 || dow1_1 <= 1 ? 0 : 1);","				if(idow === 53 && (new Date(\"\" + d.getFullYear() + \"/12/31\")).getDay() < 4)","				{","					idow = 1;","				}","				else if(idow === 0)","				{","					idow = Dt.formats.V(new Date(\"\" + (d.getFullYear()-1) + \"/12/31\"));","				}","	","				return xPad(idow, 0);","			},","		w: \"getDay\",","		W: function (d) {","				var doy = parseInt(Dt.formats.j(d), 10);","				var rdow = 7-Dt.formats.u(d);","				var woy = parseInt((doy+rdow)/7, 10);","				return xPad(woy, 0, 10);","			},","		y: function (d) { return xPad(d.getFullYear()%100, 0); },","		Y: \"getFullYear\",","		z: function (d) {","				var o = d.getTimezoneOffset();","				var H = xPad(parseInt(Math.abs(o/60), 10), 0);","				var M = xPad(Math.abs(o%60), 0);","				return (o>0?\"-\":\"+\") + H + M;","			},","		Z: function (d) {","			var tz = d.toString().replace(/^.*:\\d\\d( GMT[+-]\\d+)? \\(?([A-Za-z ]+)\\)?\\d*$/, \"$2\").replace(/[a-z ]/g, \"\");","			if(tz.length > 4) {","				tz = Dt.formats.z(d);","			}","			return tz;","		},","		\"%\": function (d) { return \"%\"; }","	},","","	aggregates: {","		c: \"locale\",","		D: \"%m/%d/%y\",","		F: \"%Y-%m-%d\",","		h: \"%b\",","		n: \"\\n\",","		r: \"%I:%M:%S %p\",","		R: \"%H:%M\",","		t: \"\\t\",","		T: \"%H:%M:%S\",","		x: \"locale\",","		X: \"locale\"","		//\"+\": \"%a %b %e %T %Z %Y\"","	},","","	 /**","	 * Takes a native JavaScript Date and formats it as a string for display to user.","	 *","	 * @for Date","	 * @method format","	 * @param oDate {Date} Date.","	 * @param oConfig {Object} (Optional) Object literal of configuration values:","	 *  <dl>","	 *   <dt>format {HTML} (Optional)</dt>","	 *   <dd>","	 *   <p>","	 *   Any strftime string is supported, such as \"%I:%M:%S %p\". strftime has several format specifiers defined by the Open group at ","	 *   <a href=\"http://www.opengroup.org/onlinepubs/007908799/xsh/strftime.html\">http://www.opengroup.org/onlinepubs/007908799/xsh/strftime.html</a>","	 *   PHP added a few of its own, defined at <a href=\"http://www.php.net/strftime\">http://www.php.net/strftime</a>","	 *   </p>","	 *   <p>","	 *   This javascript implementation supports all the PHP specifiers and a few more.  The full list is below.","	 *   </p>","	 *   <p>","	 *   If not specified, it defaults to the ISO 8601 standard date format: %Y-%m-%d.","	 *   </p>","	 *   <dl>","	 *	<dt>%a</dt> <dd>abbreviated weekday name according to the current locale</dd>","	 *	<dt>%A</dt> <dd>full weekday name according to the current locale</dd>","	 *	<dt>%b</dt> <dd>abbreviated month name according to the current locale</dd>","	 *	<dt>%B</dt> <dd>full month name according to the current locale</dd>","	 *	<dt>%c</dt> <dd>preferred date and time representation for the current locale</dd>","	 *	<dt>%C</dt> <dd>century number (the year divided by 100 and truncated to an integer, range 00 to 99)</dd>","	 *	<dt>%d</dt> <dd>day of the month as a decimal number (range 01 to 31)</dd>","	 *	<dt>%D</dt> <dd>same as %m/%d/%y</dd>","	 *	<dt>%e</dt> <dd>day of the month as a decimal number, a single digit is preceded by a space (range \" 1\" to \"31\")</dd>","	 *	<dt>%F</dt> <dd>same as %Y-%m-%d (ISO 8601 date format)</dd>","	 *	<dt>%g</dt> <dd>like %G, but without the century</dd>","	 *	<dt>%G</dt> <dd>The 4-digit year corresponding to the ISO week number</dd>","	 *	<dt>%h</dt> <dd>same as %b</dd>","	 *	<dt>%H</dt> <dd>hour as a decimal number using a 24-hour clock (range 00 to 23)</dd>","	 *	<dt>%I</dt> <dd>hour as a decimal number using a 12-hour clock (range 01 to 12)</dd>","	 *	<dt>%j</dt> <dd>day of the year as a decimal number (range 001 to 366)</dd>","	 *	<dt>%k</dt> <dd>hour as a decimal number using a 24-hour clock (range 0 to 23); single digits are preceded by a blank. (See also %H.)</dd>","	 *	<dt>%l</dt> <dd>hour as a decimal number using a 12-hour clock (range 1 to 12); single digits are preceded by a blank. (See also %I.) </dd>","	 *	<dt>%m</dt> <dd>month as a decimal number (range 01 to 12)</dd>","	 *	<dt>%M</dt> <dd>minute as a decimal number</dd>","	 *	<dt>%n</dt> <dd>newline character</dd>","	 *	<dt>%p</dt> <dd>either \"AM\" or \"PM\" according to the given time value, or the corresponding strings for the current locale</dd>","	 *	<dt>%P</dt> <dd>like %p, but lower case</dd>","	 *	<dt>%r</dt> <dd>time in a.m. and p.m. notation equal to %I:%M:%S %p</dd>","	 *	<dt>%R</dt> <dd>time in 24 hour notation equal to %H:%M</dd>","	 *	<dt>%s</dt> <dd>number of seconds since the Epoch, ie, since 1970-01-01 00:00:00 UTC</dd>","	 *	<dt>%S</dt> <dd>second as a decimal number</dd>","	 *	<dt>%t</dt> <dd>tab character</dd>","	 *	<dt>%T</dt> <dd>current time, equal to %H:%M:%S</dd>","	 *	<dt>%u</dt> <dd>weekday as a decimal number [1,7], with 1 representing Monday</dd>","	 *	<dt>%U</dt> <dd>week number of the current year as a decimal number, starting with the","	 *			first Sunday as the first day of the first week</dd>","	 *	<dt>%V</dt> <dd>The ISO 8601:1988 week number of the current year as a decimal number,","	 *			range 01 to 53, where week 1 is the first week that has at least 4 days","	 *			in the current year, and with Monday as the first day of the week.</dd>","	 *	<dt>%w</dt> <dd>day of the week as a decimal, Sunday being 0</dd>","	 *	<dt>%W</dt> <dd>week number of the current year as a decimal number, starting with the","	 *			first Monday as the first day of the first week</dd>","	 *	<dt>%x</dt> <dd>preferred date representation for the current locale without the time</dd>","	 *	<dt>%X</dt> <dd>preferred time representation for the current locale without the date</dd>","	 *	<dt>%y</dt> <dd>year as a decimal number without a century (range 00 to 99)</dd>","	 *	<dt>%Y</dt> <dd>year as a decimal number including the century</dd>","	 *	<dt>%z</dt> <dd>numerical time zone representation</dd>","	 *	<dt>%Z</dt> <dd>time zone name or abbreviation</dd>","	 *	<dt>%%</dt> <dd>a literal \"%\" character</dd>","	 *   </dl>","	 *  </dd>","	 * </dl>","	 * @return {HTML} Formatted date for display.","	 */","	format : function (oDate, oConfig) {","		oConfig = oConfig || {};","		","		if(!Y.Lang.isDate(oDate)) {","			return Y.Lang.isValue(oDate) ? oDate : \"\";","		}","","		var format, resources, compatMode, sLocale, LOCALE;","","        format = oConfig.format || \"%Y-%m-%d\";","","        resources = Y.Intl.get('datatype-date-format');","","		var replace_aggs = function (m0, m1) {","			if (compatMode && m1 === \"r\") {","			    return resources[m1];","			}","			var f = Dt.aggregates[m1];","			return (f === \"locale\" ? resources[m1] : f);","		};","","		var replace_formats = function (m0, m1) {","			var f = Dt.formats[m1];","			switch(Y.Lang.type(f)) {","				case \"string\":					// string => built in date function","					return oDate[f]();","				case \"function\":				// function => our own function","					return f.call(oDate, oDate, resources);","				case \"array\":					// built in function with padding","					if(Y.Lang.type(f[0]) === \"string\") {","						return xPad(oDate[f[0]](), f[1]);","					} // no break; (fall through to default:)","				default:","					return m1;","			}","		};","","		// First replace aggregates (run in a loop because an agg may be made up of other aggs)","		while(format.match(/%[cDFhnrRtTxX]/)) {","			format = format.replace(/%([cDFhnrRtTxX])/g, replace_aggs);","		}","","		// Now replace formats (do not run in a loop otherwise %%a will be replace with the value of %a)","		var str = format.replace(/%([aAbBCdegGHIjklmMpPsSuUVwWyYzZ%])/g, replace_formats);","","		replace_aggs = replace_formats = undefined;","","		return str;","	}","};","","Y.mix(Y.namespace(\"Date\"), Dt);","","","Y.namespace(\"DataType\");","Y.DataType.Date = Y.Date;","","","}, '3.7.3', {\"lang\": [\"ar\", \"ar-JO\", \"ca\", \"ca-ES\", \"da\", \"da-DK\", \"de\", \"de-AT\", \"de-DE\", \"el\", \"el-GR\", \"en\", \"en-AU\", \"en-CA\", \"en-GB\", \"en-IE\", \"en-IN\", \"en-JO\", \"en-MY\", \"en-NZ\", \"en-PH\", \"en-SG\", \"en-US\", \"es\", \"es-AR\", \"es-BO\", \"es-CL\", \"es-CO\", \"es-EC\", \"es-ES\", \"es-MX\", \"es-PE\", \"es-PY\", \"es-US\", \"es-UY\", \"es-VE\", \"fi\", \"fi-FI\", \"fr\", \"fr-BE\", \"fr-CA\", \"fr-FR\", \"hi\", \"hi-IN\", \"id\", \"id-ID\", \"it\", \"it-IT\", \"ja\", \"ja-JP\", \"ko\", \"ko-KR\", \"ms\", \"ms-MY\", \"nb\", \"nb-NO\", \"nl\", \"nl-BE\", \"nl-NL\", \"pl\", \"pl-PL\", \"pt\", \"pt-BR\", \"ro\", \"ro-RO\", \"ru\", \"ru-RU\", \"sv\", \"sv-SE\", \"th\", \"th-TH\", \"tr\", \"tr-TR\", \"vi\", \"vi-VN\", \"zh-Hans\", \"zh-Hans-CN\", \"zh-Hant\", \"zh-Hant-HK\", \"zh-Hant-TW\"]});"];
_yuitest_coverage["build/datatype-date-format/datatype-date-format.js"].lines = {"1":0,"51":0,"53":0,"55":0,"57":0,"58":0,"59":0,"61":0,"64":0,"66":0,"67":0,"68":0,"69":0,"70":0,"73":0,"75":0,"76":0,"77":0,"79":0,"80":0,"81":0,"82":0,"85":0,"88":0,"90":0,"91":0,"92":0,"93":0,"94":0,"97":0,"98":0,"100":0,"101":0,"102":0,"104":0,"106":0,"107":0,"108":0,"109":0,"112":0,"113":0,"119":0,"120":0,"122":0,"124":0,"126":0,"129":0,"133":0,"134":0,"135":0,"136":0,"138":0,"141":0,"142":0,"143":0,"144":0,"147":0,"148":0,"149":0,"151":0,"153":0,"244":0,"246":0,"247":0,"250":0,"252":0,"254":0,"256":0,"257":0,"258":0,"260":0,"261":0,"264":0,"265":0,"266":0,"268":0,"270":0,"272":0,"273":0,"276":0,"281":0,"282":0,"286":0,"288":0,"290":0,"294":0,"297":0,"298":0};
_yuitest_coverage["build/datatype-date-format/datatype-date-format.js"].functions = {"xPad:51":0,"a:66":0,"A:67":0,"b:68":0,"B:69":0,"C:70":0,"g:73":0,"G:74":0,"I:88":0,"j:89":0,"l:97":0,"m:98":0,"p:100":0,"P:101":0,"s:102":0,"u:104":0,"U:105":0,"V:111":0,"W:132":0,"y:138":0,"z:140":0,"Z:146":0,"\"%\":153":0,"replace_aggs:256":0,"replace_formats:264":0,"format:243":0,"(anonymous 1):1":0};
_yuitest_coverage["build/datatype-date-format/datatype-date-format.js"].coveredLines = 88;
_yuitest_coverage["build/datatype-date-format/datatype-date-format.js"].coveredFunctions = 27;
_yuitest_coverline("build/datatype-date-format/datatype-date-format.js", 1);
YUI.add('datatype-date-format', function (Y, NAME) {

/**
 * The `datatype` module is an alias for three utilities, Y.Date, 
 * Y.Number and Y.XML, that provide type-conversion and string-formatting
 * convenience methods for various JavaScript object types.
 *
 * @module datatype
 * @main datatype
 */

/**
 * The Date Utility provides type-conversion and string-formatting
 * convenience methods for Dates.
 *
 * @module datatype-date
 * @main datatype-date
 */

/**
 * Date module.
 *
 * @module datatype-date
 */

/**
 * Format date module implements strftime formatters for javascript based on the
 * Open Group specification defined at
 * http://www.opengroup.org/onlinepubs/007908799/xsh/strftime.html
 * This implementation does not include modified conversion specifiers (i.e., Ex and Ox)
 *
 * @module datatype-date
 * @submodule datatype-date-format
 */

/**
 * Date provides a set of utility functions to operate against Date objects.
 *
 * @class Date
 * @static
 */

/**
 * Pad a number with leading spaces, zeroes or something else
 * @method xPad
 * @param x {Number}	The number to be padded
 * @param pad {String}  The character to pad the number with
 * @param r {Number}	(optional) The base of the pad, eg, 10 implies to two digits, 100 implies to 3 digits.
 * @private
 */
_yuitest_coverfunc("build/datatype-date-format/datatype-date-format.js", "(anonymous 1)", 1);
_yuitest_coverline("build/datatype-date-format/datatype-date-format.js", 51);
var xPad=function (x, pad, r)
{
	_yuitest_coverfunc("build/datatype-date-format/datatype-date-format.js", "xPad", 51);
_yuitest_coverline("build/datatype-date-format/datatype-date-format.js", 53);
if(typeof r === "undefined")
	{
		_yuitest_coverline("build/datatype-date-format/datatype-date-format.js", 55);
r=10;
	}
	_yuitest_coverline("build/datatype-date-format/datatype-date-format.js", 57);
pad = pad + ""; 
	_yuitest_coverline("build/datatype-date-format/datatype-date-format.js", 58);
for( ; parseInt(x, 10)<r && r>1; r/=10) {
		_yuitest_coverline("build/datatype-date-format/datatype-date-format.js", 59);
x = pad + x;
	}
	_yuitest_coverline("build/datatype-date-format/datatype-date-format.js", 61);
return x.toString();
};

_yuitest_coverline("build/datatype-date-format/datatype-date-format.js", 64);
var Dt = {
	formats: {
		a: function (d, l) { _yuitest_coverfunc("build/datatype-date-format/datatype-date-format.js", "a", 66);
_yuitest_coverline("build/datatype-date-format/datatype-date-format.js", 66);
return l.a[d.getDay()]; },
		A: function (d, l) { _yuitest_coverfunc("build/datatype-date-format/datatype-date-format.js", "A", 67);
_yuitest_coverline("build/datatype-date-format/datatype-date-format.js", 67);
return l.A[d.getDay()]; },
		b: function (d, l) { _yuitest_coverfunc("build/datatype-date-format/datatype-date-format.js", "b", 68);
_yuitest_coverline("build/datatype-date-format/datatype-date-format.js", 68);
return l.b[d.getMonth()]; },
		B: function (d, l) { _yuitest_coverfunc("build/datatype-date-format/datatype-date-format.js", "B", 69);
_yuitest_coverline("build/datatype-date-format/datatype-date-format.js", 69);
return l.B[d.getMonth()]; },
		C: function (d) { _yuitest_coverfunc("build/datatype-date-format/datatype-date-format.js", "C", 70);
_yuitest_coverline("build/datatype-date-format/datatype-date-format.js", 70);
return xPad(parseInt(d.getFullYear()/100, 10), 0); },
		d: ["getDate", "0"],
		e: ["getDate", " "],
		g: function (d) { _yuitest_coverfunc("build/datatype-date-format/datatype-date-format.js", "g", 73);
_yuitest_coverline("build/datatype-date-format/datatype-date-format.js", 73);
return xPad(parseInt(Dt.formats.G(d)%100, 10), 0); },
		G: function (d) {
				_yuitest_coverfunc("build/datatype-date-format/datatype-date-format.js", "G", 74);
_yuitest_coverline("build/datatype-date-format/datatype-date-format.js", 75);
var y = d.getFullYear();
				_yuitest_coverline("build/datatype-date-format/datatype-date-format.js", 76);
var V = parseInt(Dt.formats.V(d), 10);
				_yuitest_coverline("build/datatype-date-format/datatype-date-format.js", 77);
var W = parseInt(Dt.formats.W(d), 10);
	
				_yuitest_coverline("build/datatype-date-format/datatype-date-format.js", 79);
if(W > V) {
					_yuitest_coverline("build/datatype-date-format/datatype-date-format.js", 80);
y++;
				} else {_yuitest_coverline("build/datatype-date-format/datatype-date-format.js", 81);
if(W===0 && V>=52) {
					_yuitest_coverline("build/datatype-date-format/datatype-date-format.js", 82);
y--;
				}}
	
				_yuitest_coverline("build/datatype-date-format/datatype-date-format.js", 85);
return y;
			},
		H: ["getHours", "0"],
		I: function (d) { _yuitest_coverfunc("build/datatype-date-format/datatype-date-format.js", "I", 88);
_yuitest_coverline("build/datatype-date-format/datatype-date-format.js", 88);
var I=d.getHours()%12; return xPad(I===0?12:I, 0); },
		j: function (d) {
				_yuitest_coverfunc("build/datatype-date-format/datatype-date-format.js", "j", 89);
_yuitest_coverline("build/datatype-date-format/datatype-date-format.js", 90);
var gmd_1 = new Date("" + d.getFullYear() + "/1/1 GMT");
				_yuitest_coverline("build/datatype-date-format/datatype-date-format.js", 91);
var gmdate = new Date("" + d.getFullYear() + "/" + (d.getMonth()+1) + "/" + d.getDate() + " GMT");
				_yuitest_coverline("build/datatype-date-format/datatype-date-format.js", 92);
var ms = gmdate - gmd_1;
				_yuitest_coverline("build/datatype-date-format/datatype-date-format.js", 93);
var doy = parseInt(ms/60000/60/24, 10)+1;
				_yuitest_coverline("build/datatype-date-format/datatype-date-format.js", 94);
return xPad(doy, 0, 100);
			},
		k: ["getHours", " "],
		l: function (d) { _yuitest_coverfunc("build/datatype-date-format/datatype-date-format.js", "l", 97);
_yuitest_coverline("build/datatype-date-format/datatype-date-format.js", 97);
var I=d.getHours()%12; return xPad(I===0?12:I, " "); },
		m: function (d) { _yuitest_coverfunc("build/datatype-date-format/datatype-date-format.js", "m", 98);
_yuitest_coverline("build/datatype-date-format/datatype-date-format.js", 98);
return xPad(d.getMonth()+1, 0); },
		M: ["getMinutes", "0"],
		p: function (d, l) { _yuitest_coverfunc("build/datatype-date-format/datatype-date-format.js", "p", 100);
_yuitest_coverline("build/datatype-date-format/datatype-date-format.js", 100);
return l.p[d.getHours() >= 12 ? 1 : 0 ]; },
		P: function (d, l) { _yuitest_coverfunc("build/datatype-date-format/datatype-date-format.js", "P", 101);
_yuitest_coverline("build/datatype-date-format/datatype-date-format.js", 101);
return l.P[d.getHours() >= 12 ? 1 : 0 ]; },
		s: function (d, l) { _yuitest_coverfunc("build/datatype-date-format/datatype-date-format.js", "s", 102);
_yuitest_coverline("build/datatype-date-format/datatype-date-format.js", 102);
return parseInt(d.getTime()/1000, 10); },
		S: ["getSeconds", "0"],
		u: function (d) { _yuitest_coverfunc("build/datatype-date-format/datatype-date-format.js", "u", 104);
_yuitest_coverline("build/datatype-date-format/datatype-date-format.js", 104);
var dow = d.getDay(); return dow===0?7:dow; },
		U: function (d) {
				_yuitest_coverfunc("build/datatype-date-format/datatype-date-format.js", "U", 105);
_yuitest_coverline("build/datatype-date-format/datatype-date-format.js", 106);
var doy = parseInt(Dt.formats.j(d), 10);
				_yuitest_coverline("build/datatype-date-format/datatype-date-format.js", 107);
var rdow = 6-d.getDay();
				_yuitest_coverline("build/datatype-date-format/datatype-date-format.js", 108);
var woy = parseInt((doy+rdow)/7, 10);
				_yuitest_coverline("build/datatype-date-format/datatype-date-format.js", 109);
return xPad(woy, 0);
			},
		V: function (d) {
				_yuitest_coverfunc("build/datatype-date-format/datatype-date-format.js", "V", 111);
_yuitest_coverline("build/datatype-date-format/datatype-date-format.js", 112);
var woy = parseInt(Dt.formats.W(d), 10);
				_yuitest_coverline("build/datatype-date-format/datatype-date-format.js", 113);
var dow1_1 = (new Date("" + d.getFullYear() + "/1/1")).getDay();
				// First week is 01 and not 00 as in the case of %U and %W,
				// so we add 1 to the final result except if day 1 of the year
				// is a Monday (then %W returns 01).
				// We also need to subtract 1 if the day 1 of the year is 
				// Friday-Sunday, so the resulting equation becomes:
				_yuitest_coverline("build/datatype-date-format/datatype-date-format.js", 119);
var idow = woy + (dow1_1 > 4 || dow1_1 <= 1 ? 0 : 1);
				_yuitest_coverline("build/datatype-date-format/datatype-date-format.js", 120);
if(idow === 53 && (new Date("" + d.getFullYear() + "/12/31")).getDay() < 4)
				{
					_yuitest_coverline("build/datatype-date-format/datatype-date-format.js", 122);
idow = 1;
				}
				else {_yuitest_coverline("build/datatype-date-format/datatype-date-format.js", 124);
if(idow === 0)
				{
					_yuitest_coverline("build/datatype-date-format/datatype-date-format.js", 126);
idow = Dt.formats.V(new Date("" + (d.getFullYear()-1) + "/12/31"));
				}}
	
				_yuitest_coverline("build/datatype-date-format/datatype-date-format.js", 129);
return xPad(idow, 0);
			},
		w: "getDay",
		W: function (d) {
				_yuitest_coverfunc("build/datatype-date-format/datatype-date-format.js", "W", 132);
_yuitest_coverline("build/datatype-date-format/datatype-date-format.js", 133);
var doy = parseInt(Dt.formats.j(d), 10);
				_yuitest_coverline("build/datatype-date-format/datatype-date-format.js", 134);
var rdow = 7-Dt.formats.u(d);
				_yuitest_coverline("build/datatype-date-format/datatype-date-format.js", 135);
var woy = parseInt((doy+rdow)/7, 10);
				_yuitest_coverline("build/datatype-date-format/datatype-date-format.js", 136);
return xPad(woy, 0, 10);
			},
		y: function (d) { _yuitest_coverfunc("build/datatype-date-format/datatype-date-format.js", "y", 138);
_yuitest_coverline("build/datatype-date-format/datatype-date-format.js", 138);
return xPad(d.getFullYear()%100, 0); },
		Y: "getFullYear",
		z: function (d) {
				_yuitest_coverfunc("build/datatype-date-format/datatype-date-format.js", "z", 140);
_yuitest_coverline("build/datatype-date-format/datatype-date-format.js", 141);
var o = d.getTimezoneOffset();
				_yuitest_coverline("build/datatype-date-format/datatype-date-format.js", 142);
var H = xPad(parseInt(Math.abs(o/60), 10), 0);
				_yuitest_coverline("build/datatype-date-format/datatype-date-format.js", 143);
var M = xPad(Math.abs(o%60), 0);
				_yuitest_coverline("build/datatype-date-format/datatype-date-format.js", 144);
return (o>0?"-":"+") + H + M;
			},
		Z: function (d) {
			_yuitest_coverfunc("build/datatype-date-format/datatype-date-format.js", "Z", 146);
_yuitest_coverline("build/datatype-date-format/datatype-date-format.js", 147);
var tz = d.toString().replace(/^.*:\d\d( GMT[+-]\d+)? \(?([A-Za-z ]+)\)?\d*$/, "$2").replace(/[a-z ]/g, "");
			_yuitest_coverline("build/datatype-date-format/datatype-date-format.js", 148);
if(tz.length > 4) {
				_yuitest_coverline("build/datatype-date-format/datatype-date-format.js", 149);
tz = Dt.formats.z(d);
			}
			_yuitest_coverline("build/datatype-date-format/datatype-date-format.js", 151);
return tz;
		},
		"%": function (d) { _yuitest_coverfunc("build/datatype-date-format/datatype-date-format.js", "\"%\"", 153);
_yuitest_coverline("build/datatype-date-format/datatype-date-format.js", 153);
return "%"; }
	},

	aggregates: {
		c: "locale",
		D: "%m/%d/%y",
		F: "%Y-%m-%d",
		h: "%b",
		n: "\n",
		r: "%I:%M:%S %p",
		R: "%H:%M",
		t: "\t",
		T: "%H:%M:%S",
		x: "locale",
		X: "locale"
		//"+": "%a %b %e %T %Z %Y"
	},

	 /**
	 * Takes a native JavaScript Date and formats it as a string for display to user.
	 *
	 * @for Date
	 * @method format
	 * @param oDate {Date} Date.
	 * @param oConfig {Object} (Optional) Object literal of configuration values:
	 *  <dl>
	 *   <dt>format {HTML} (Optional)</dt>
	 *   <dd>
	 *   <p>
	 *   Any strftime string is supported, such as "%I:%M:%S %p". strftime has several format specifiers defined by the Open group at 
	 *   <a href="http://www.opengroup.org/onlinepubs/007908799/xsh/strftime.html">http://www.opengroup.org/onlinepubs/007908799/xsh/strftime.html</a>
	 *   PHP added a few of its own, defined at <a href="http://www.php.net/strftime">http://www.php.net/strftime</a>
	 *   </p>
	 *   <p>
	 *   This javascript implementation supports all the PHP specifiers and a few more.  The full list is below.
	 *   </p>
	 *   <p>
	 *   If not specified, it defaults to the ISO 8601 standard date format: %Y-%m-%d.
	 *   </p>
	 *   <dl>
	 *	<dt>%a</dt> <dd>abbreviated weekday name according to the current locale</dd>
	 *	<dt>%A</dt> <dd>full weekday name according to the current locale</dd>
	 *	<dt>%b</dt> <dd>abbreviated month name according to the current locale</dd>
	 *	<dt>%B</dt> <dd>full month name according to the current locale</dd>
	 *	<dt>%c</dt> <dd>preferred date and time representation for the current locale</dd>
	 *	<dt>%C</dt> <dd>century number (the year divided by 100 and truncated to an integer, range 00 to 99)</dd>
	 *	<dt>%d</dt> <dd>day of the month as a decimal number (range 01 to 31)</dd>
	 *	<dt>%D</dt> <dd>same as %m/%d/%y</dd>
	 *	<dt>%e</dt> <dd>day of the month as a decimal number, a single digit is preceded by a space (range " 1" to "31")</dd>
	 *	<dt>%F</dt> <dd>same as %Y-%m-%d (ISO 8601 date format)</dd>
	 *	<dt>%g</dt> <dd>like %G, but without the century</dd>
	 *	<dt>%G</dt> <dd>The 4-digit year corresponding to the ISO week number</dd>
	 *	<dt>%h</dt> <dd>same as %b</dd>
	 *	<dt>%H</dt> <dd>hour as a decimal number using a 24-hour clock (range 00 to 23)</dd>
	 *	<dt>%I</dt> <dd>hour as a decimal number using a 12-hour clock (range 01 to 12)</dd>
	 *	<dt>%j</dt> <dd>day of the year as a decimal number (range 001 to 366)</dd>
	 *	<dt>%k</dt> <dd>hour as a decimal number using a 24-hour clock (range 0 to 23); single digits are preceded by a blank. (See also %H.)</dd>
	 *	<dt>%l</dt> <dd>hour as a decimal number using a 12-hour clock (range 1 to 12); single digits are preceded by a blank. (See also %I.) </dd>
	 *	<dt>%m</dt> <dd>month as a decimal number (range 01 to 12)</dd>
	 *	<dt>%M</dt> <dd>minute as a decimal number</dd>
	 *	<dt>%n</dt> <dd>newline character</dd>
	 *	<dt>%p</dt> <dd>either "AM" or "PM" according to the given time value, or the corresponding strings for the current locale</dd>
	 *	<dt>%P</dt> <dd>like %p, but lower case</dd>
	 *	<dt>%r</dt> <dd>time in a.m. and p.m. notation equal to %I:%M:%S %p</dd>
	 *	<dt>%R</dt> <dd>time in 24 hour notation equal to %H:%M</dd>
	 *	<dt>%s</dt> <dd>number of seconds since the Epoch, ie, since 1970-01-01 00:00:00 UTC</dd>
	 *	<dt>%S</dt> <dd>second as a decimal number</dd>
	 *	<dt>%t</dt> <dd>tab character</dd>
	 *	<dt>%T</dt> <dd>current time, equal to %H:%M:%S</dd>
	 *	<dt>%u</dt> <dd>weekday as a decimal number [1,7], with 1 representing Monday</dd>
	 *	<dt>%U</dt> <dd>week number of the current year as a decimal number, starting with the
	 *			first Sunday as the first day of the first week</dd>
	 *	<dt>%V</dt> <dd>The ISO 8601:1988 week number of the current year as a decimal number,
	 *			range 01 to 53, where week 1 is the first week that has at least 4 days
	 *			in the current year, and with Monday as the first day of the week.</dd>
	 *	<dt>%w</dt> <dd>day of the week as a decimal, Sunday being 0</dd>
	 *	<dt>%W</dt> <dd>week number of the current year as a decimal number, starting with the
	 *			first Monday as the first day of the first week</dd>
	 *	<dt>%x</dt> <dd>preferred date representation for the current locale without the time</dd>
	 *	<dt>%X</dt> <dd>preferred time representation for the current locale without the date</dd>
	 *	<dt>%y</dt> <dd>year as a decimal number without a century (range 00 to 99)</dd>
	 *	<dt>%Y</dt> <dd>year as a decimal number including the century</dd>
	 *	<dt>%z</dt> <dd>numerical time zone representation</dd>
	 *	<dt>%Z</dt> <dd>time zone name or abbreviation</dd>
	 *	<dt>%%</dt> <dd>a literal "%" character</dd>
	 *   </dl>
	 *  </dd>
	 * </dl>
	 * @return {HTML} Formatted date for display.
	 */
	format : function (oDate, oConfig) {
		_yuitest_coverfunc("build/datatype-date-format/datatype-date-format.js", "format", 243);
_yuitest_coverline("build/datatype-date-format/datatype-date-format.js", 244);
oConfig = oConfig || {};
		
		_yuitest_coverline("build/datatype-date-format/datatype-date-format.js", 246);
if(!Y.Lang.isDate(oDate)) {
			_yuitest_coverline("build/datatype-date-format/datatype-date-format.js", 247);
return Y.Lang.isValue(oDate) ? oDate : "";
		}

		_yuitest_coverline("build/datatype-date-format/datatype-date-format.js", 250);
var format, resources, compatMode, sLocale, LOCALE;

        _yuitest_coverline("build/datatype-date-format/datatype-date-format.js", 252);
format = oConfig.format || "%Y-%m-%d";

        _yuitest_coverline("build/datatype-date-format/datatype-date-format.js", 254);
resources = Y.Intl.get('datatype-date-format');

		_yuitest_coverline("build/datatype-date-format/datatype-date-format.js", 256);
var replace_aggs = function (m0, m1) {
			_yuitest_coverfunc("build/datatype-date-format/datatype-date-format.js", "replace_aggs", 256);
_yuitest_coverline("build/datatype-date-format/datatype-date-format.js", 257);
if (compatMode && m1 === "r") {
			    _yuitest_coverline("build/datatype-date-format/datatype-date-format.js", 258);
return resources[m1];
			}
			_yuitest_coverline("build/datatype-date-format/datatype-date-format.js", 260);
var f = Dt.aggregates[m1];
			_yuitest_coverline("build/datatype-date-format/datatype-date-format.js", 261);
return (f === "locale" ? resources[m1] : f);
		};

		_yuitest_coverline("build/datatype-date-format/datatype-date-format.js", 264);
var replace_formats = function (m0, m1) {
			_yuitest_coverfunc("build/datatype-date-format/datatype-date-format.js", "replace_formats", 264);
_yuitest_coverline("build/datatype-date-format/datatype-date-format.js", 265);
var f = Dt.formats[m1];
			_yuitest_coverline("build/datatype-date-format/datatype-date-format.js", 266);
switch(Y.Lang.type(f)) {
				case "string":					// string => built in date function
					_yuitest_coverline("build/datatype-date-format/datatype-date-format.js", 268);
return oDate[f]();
				case "function":				// function => our own function
					_yuitest_coverline("build/datatype-date-format/datatype-date-format.js", 270);
return f.call(oDate, oDate, resources);
				case "array":					// built in function with padding
					_yuitest_coverline("build/datatype-date-format/datatype-date-format.js", 272);
if(Y.Lang.type(f[0]) === "string") {
						_yuitest_coverline("build/datatype-date-format/datatype-date-format.js", 273);
return xPad(oDate[f[0]](), f[1]);
					} // no break; (fall through to default:)
				default:
					_yuitest_coverline("build/datatype-date-format/datatype-date-format.js", 276);
return m1;
			}
		};

		// First replace aggregates (run in a loop because an agg may be made up of other aggs)
		_yuitest_coverline("build/datatype-date-format/datatype-date-format.js", 281);
while(format.match(/%[cDFhnrRtTxX]/)) {
			_yuitest_coverline("build/datatype-date-format/datatype-date-format.js", 282);
format = format.replace(/%([cDFhnrRtTxX])/g, replace_aggs);
		}

		// Now replace formats (do not run in a loop otherwise %%a will be replace with the value of %a)
		_yuitest_coverline("build/datatype-date-format/datatype-date-format.js", 286);
var str = format.replace(/%([aAbBCdegGHIjklmMpPsSuUVwWyYzZ%])/g, replace_formats);

		_yuitest_coverline("build/datatype-date-format/datatype-date-format.js", 288);
replace_aggs = replace_formats = undefined;

		_yuitest_coverline("build/datatype-date-format/datatype-date-format.js", 290);
return str;
	}
};

_yuitest_coverline("build/datatype-date-format/datatype-date-format.js", 294);
Y.mix(Y.namespace("Date"), Dt);


_yuitest_coverline("build/datatype-date-format/datatype-date-format.js", 297);
Y.namespace("DataType");
_yuitest_coverline("build/datatype-date-format/datatype-date-format.js", 298);
Y.DataType.Date = Y.Date;


}, '3.7.3', {"lang": ["ar", "ar-JO", "ca", "ca-ES", "da", "da-DK", "de", "de-AT", "de-DE", "el", "el-GR", "en", "en-AU", "en-CA", "en-GB", "en-IE", "en-IN", "en-JO", "en-MY", "en-NZ", "en-PH", "en-SG", "en-US", "es", "es-AR", "es-BO", "es-CL", "es-CO", "es-EC", "es-ES", "es-MX", "es-PE", "es-PY", "es-US", "es-UY", "es-VE", "fi", "fi-FI", "fr", "fr-BE", "fr-CA", "fr-FR", "hi", "hi-IN", "id", "id-ID", "it", "it-IT", "ja", "ja-JP", "ko", "ko-KR", "ms", "ms-MY", "nb", "nb-NO", "nl", "nl-BE", "nl-NL", "pl", "pl-PL", "pt", "pt-BR", "ro", "ro-RO", "ru", "ru-RU", "sv", "sv-SE", "th", "th-TH", "tr", "tr-TR", "vi", "vi-VN", "zh-Hans", "zh-Hans-CN", "zh-Hant", "zh-Hant-HK", "zh-Hant-TW"]});
