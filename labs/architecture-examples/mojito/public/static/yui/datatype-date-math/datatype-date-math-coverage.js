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
_yuitest_coverage["build/datatype-date-math/datatype-date-math.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/datatype-date-math/datatype-date-math.js",
    code: []
};
_yuitest_coverage["build/datatype-date-math/datatype-date-math.js"].code=["YUI.add('datatype-date-math', function (Y, NAME) {","","/**"," * Date Math submodule."," *"," * @module datatype-date"," * @submodule datatype-date-math"," * @for Date"," */","var LANG = Y.Lang;","","Y.mix(Y.namespace(\"Date\"), {","","	/**","	 * Checks whether a native JavaScript Date contains a valid value.","	 * @for Date","	 * @method isValidDate","	 * @param oDate {Date} Date in the month for which the number of days is desired.","	 * @return {Boolean} True if the date argument contains a valid value.","	 */","	 isValidDate : function (oDate) {","		if(LANG.isDate(oDate) && (isFinite(oDate)) && (oDate != \"Invalid Date\") && !isNaN(oDate) && (oDate != null)) {","            return true;","        }","        else {","            return false;","        }","	},","","	/**","	 * Checks whether two dates correspond to the same date and time.","	 * @for Date","	 * @method areEqual","	 * @param aDate {Date} The first date to compare.","	 * @param bDate {Date} The second date to compare.","	 * @return {Boolean} True if the two dates correspond to the same","	 * date and time.","	 */	","	areEqual : function (aDate, bDate) {","		return (this.isValidDate(aDate) && this.isValidDate(bDate) && (aDate.getTime() == bDate.getTime()));	","	},","","	/**","	 * Checks whether the first date comes later than the second.","	 * @for Date","	 * @method isGreater","	 * @param aDate {Date} The first date to compare.","	 * @param bDate {Date} The second date to compare.","	 * @return {Boolean} True if the first date is later than the second.","	 */	","    isGreater : function (aDate, bDate) {","    	return (this.isValidDate(aDate) && this.isValidDate(bDate) && (aDate.getTime() > bDate.getTime()));","    },","","	/**","	 * Checks whether the first date comes later than or is the same as","	 * the second.","	 * @for Date","	 * @method isGreaterOrEqual","	 * @param aDate {Date} The first date to compare.","	 * @param bDate {Date} The second date to compare.","	 * @return {Boolean} True if the first date is later than or ","	 * the same as the second.","	 */	","    isGreaterOrEqual : function (aDate, bDate) {","    	return (this.isValidDate(aDate) && this.isValidDate(bDate) && (aDate.getTime() >= bDate.getTime()));","    },","","","    /**","	 * Checks whether the date is between two other given dates.","	 * @for Date","	 * @method isInRange","	 * @param aDate {Date} The date to check","	 * @param bDate {Date} Lower bound of the range.","	 * @param cDate {Date} Higher bound of the range.","	 * @return {Boolean} True if the date is between the two other given dates.","	 */	","    isInRange : function (aDate, bDate, cDate) {","    	return (this.isGreaterOrEqual(aDate, bDate) && this.isGreaterOrEqual(cDate, aDate));","    },","","	/**","	 * Adds a specified number of days to the given date.","	 * @for Date","	 * @method addDays","	 * @param oDate {Date} The date to add days to.","	 * @param numMonths {Number} The number of days to add (can be negative)","	 * @return {Date} A new Date with the specified number of days","	 * added to the original date.","	 */	","	addDays : function (oDate, numDays) {","		return new Date(oDate.getTime() + 86400000*numDays);","	},","","","	/**","	 * Adds a specified number of months to the given date.","	 * @for Date","	 * @method addMonths","	 * @param oDate {Date} The date to add months to.","	 * @param numMonths {Number} The number of months to add (can be negative)","	 * @return {Date} A new Date with the specified number of months","	 * added to the original date.","	 */	","	addMonths : function (oDate, numMonths) {","		var newYear = oDate.getFullYear();","		var newMonth = oDate.getMonth() + numMonths;		","		","		newYear  = Math.floor(newYear + newMonth / 12);","		newMonth = (newMonth % 12 + 12) % 12;","		","		var newDate = new Date (oDate.getTime());","		newDate.setFullYear(newYear);","		newDate.setMonth(newMonth);","		","		return newDate;","	},","","	/**","	 * Adds a specified number of years to the given date.","	 * @for Date","	 * @method addYears","	 * @param oDate {Date} The date to add years to.","	 * @param numYears {Number} The number of years to add (can be negative)","	 * @return {Date} A new Date with the specified number of years","	 * added to the original date.","	 */	","	addYears : function (oDate, numYears) {","		var newYear = oDate.getFullYear() + numYears;","		var newDate = new Date(oDate.getTime());","		","		newDate.setFullYear(newYear);","		return newDate;","	},","","	/**","	 * Lists all dates in a given month.","	 * @for Date","	 * @method listOfDatesInMonth","	 * @param oDate {Date} The date corresponding to the month for","	 * which a list of dates is required.","	 * @return {Array} An `Array` of `Date`s from a given month.","	 */	","    listOfDatesInMonth : function (oDate) {","       if (!this.isValidDate(oDate)) {","       	 return [];","       }","","       var daysInMonth = this.daysInMonth(oDate),","           year        = oDate.getFullYear(),","           month       = oDate.getMonth(),","           output      = [];","","       for (var day = 1; day <= daysInMonth; day++) {","       	   output.push(new Date(year, month, day, 12, 0, 0));","       }","","       return output;","    },","","	/**","	 * Takes a native JavaScript Date and returns the number of days","	 * in the month that the given date belongs to.","	 * @for Date","	 * @method daysInMonth","	 * @param oDate {Date} Date in the month for which the number ","	 * of days is desired.","	 * @return {Number} A number (either 28, 29, 30 or 31) of days ","	 * in the given month.","	 */","	 daysInMonth : function (oDate) {","		if (!this.isValidDate(oDate)) {","			return 0;","		}","		","		var mon = oDate.getMonth();","		var lengths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];","","		if (mon != 1) {","			return lengths[mon];","		}","		else {","","			var year = oDate.getFullYear();","			if (year%400 === 0) {","			       return 29;","			}	","			else if (year%100 === 0) {","				   return 28;","			}","			else if (year%4 === 0) {","			       return 29;","			}","			else {","			       return 28;","		    }","	   } ","	}","","});","","Y.namespace(\"DataType\");","Y.DataType.Date = Y.Date;","","","}, '3.7.3', {\"requires\": [\"yui-base\"]});"];
_yuitest_coverage["build/datatype-date-math/datatype-date-math.js"].lines = {"1":0,"10":0,"12":0,"22":0,"23":0,"26":0,"40":0,"52":0,"66":0,"80":0,"93":0,"107":0,"108":0,"110":0,"111":0,"113":0,"114":0,"115":0,"117":0,"130":0,"131":0,"133":0,"134":0,"146":0,"147":0,"150":0,"155":0,"156":0,"159":0,"173":0,"174":0,"177":0,"178":0,"180":0,"181":0,"185":0,"186":0,"187":0,"189":0,"190":0,"192":0,"193":0,"196":0,"203":0,"204":0};
_yuitest_coverage["build/datatype-date-math/datatype-date-math.js"].functions = {"isValidDate:21":0,"areEqual:39":0,"isGreater:51":0,"isGreaterOrEqual:65":0,"isInRange:79":0,"addDays:92":0,"addMonths:106":0,"addYears:129":0,"listOfDatesInMonth:145":0,"daysInMonth:172":0,"(anonymous 1):1":0};
_yuitest_coverage["build/datatype-date-math/datatype-date-math.js"].coveredLines = 45;
_yuitest_coverage["build/datatype-date-math/datatype-date-math.js"].coveredFunctions = 11;
_yuitest_coverline("build/datatype-date-math/datatype-date-math.js", 1);
YUI.add('datatype-date-math', function (Y, NAME) {

/**
 * Date Math submodule.
 *
 * @module datatype-date
 * @submodule datatype-date-math
 * @for Date
 */
_yuitest_coverfunc("build/datatype-date-math/datatype-date-math.js", "(anonymous 1)", 1);
_yuitest_coverline("build/datatype-date-math/datatype-date-math.js", 10);
var LANG = Y.Lang;

_yuitest_coverline("build/datatype-date-math/datatype-date-math.js", 12);
Y.mix(Y.namespace("Date"), {

	/**
	 * Checks whether a native JavaScript Date contains a valid value.
	 * @for Date
	 * @method isValidDate
	 * @param oDate {Date} Date in the month for which the number of days is desired.
	 * @return {Boolean} True if the date argument contains a valid value.
	 */
	 isValidDate : function (oDate) {
		_yuitest_coverfunc("build/datatype-date-math/datatype-date-math.js", "isValidDate", 21);
_yuitest_coverline("build/datatype-date-math/datatype-date-math.js", 22);
if(LANG.isDate(oDate) && (isFinite(oDate)) && (oDate != "Invalid Date") && !isNaN(oDate) && (oDate != null)) {
            _yuitest_coverline("build/datatype-date-math/datatype-date-math.js", 23);
return true;
        }
        else {
            _yuitest_coverline("build/datatype-date-math/datatype-date-math.js", 26);
return false;
        }
	},

	/**
	 * Checks whether two dates correspond to the same date and time.
	 * @for Date
	 * @method areEqual
	 * @param aDate {Date} The first date to compare.
	 * @param bDate {Date} The second date to compare.
	 * @return {Boolean} True if the two dates correspond to the same
	 * date and time.
	 */	
	areEqual : function (aDate, bDate) {
		_yuitest_coverfunc("build/datatype-date-math/datatype-date-math.js", "areEqual", 39);
_yuitest_coverline("build/datatype-date-math/datatype-date-math.js", 40);
return (this.isValidDate(aDate) && this.isValidDate(bDate) && (aDate.getTime() == bDate.getTime()));	
	},

	/**
	 * Checks whether the first date comes later than the second.
	 * @for Date
	 * @method isGreater
	 * @param aDate {Date} The first date to compare.
	 * @param bDate {Date} The second date to compare.
	 * @return {Boolean} True if the first date is later than the second.
	 */	
    isGreater : function (aDate, bDate) {
    	_yuitest_coverfunc("build/datatype-date-math/datatype-date-math.js", "isGreater", 51);
_yuitest_coverline("build/datatype-date-math/datatype-date-math.js", 52);
return (this.isValidDate(aDate) && this.isValidDate(bDate) && (aDate.getTime() > bDate.getTime()));
    },

	/**
	 * Checks whether the first date comes later than or is the same as
	 * the second.
	 * @for Date
	 * @method isGreaterOrEqual
	 * @param aDate {Date} The first date to compare.
	 * @param bDate {Date} The second date to compare.
	 * @return {Boolean} True if the first date is later than or 
	 * the same as the second.
	 */	
    isGreaterOrEqual : function (aDate, bDate) {
    	_yuitest_coverfunc("build/datatype-date-math/datatype-date-math.js", "isGreaterOrEqual", 65);
_yuitest_coverline("build/datatype-date-math/datatype-date-math.js", 66);
return (this.isValidDate(aDate) && this.isValidDate(bDate) && (aDate.getTime() >= bDate.getTime()));
    },


    /**
	 * Checks whether the date is between two other given dates.
	 * @for Date
	 * @method isInRange
	 * @param aDate {Date} The date to check
	 * @param bDate {Date} Lower bound of the range.
	 * @param cDate {Date} Higher bound of the range.
	 * @return {Boolean} True if the date is between the two other given dates.
	 */	
    isInRange : function (aDate, bDate, cDate) {
    	_yuitest_coverfunc("build/datatype-date-math/datatype-date-math.js", "isInRange", 79);
_yuitest_coverline("build/datatype-date-math/datatype-date-math.js", 80);
return (this.isGreaterOrEqual(aDate, bDate) && this.isGreaterOrEqual(cDate, aDate));
    },

	/**
	 * Adds a specified number of days to the given date.
	 * @for Date
	 * @method addDays
	 * @param oDate {Date} The date to add days to.
	 * @param numMonths {Number} The number of days to add (can be negative)
	 * @return {Date} A new Date with the specified number of days
	 * added to the original date.
	 */	
	addDays : function (oDate, numDays) {
		_yuitest_coverfunc("build/datatype-date-math/datatype-date-math.js", "addDays", 92);
_yuitest_coverline("build/datatype-date-math/datatype-date-math.js", 93);
return new Date(oDate.getTime() + 86400000*numDays);
	},


	/**
	 * Adds a specified number of months to the given date.
	 * @for Date
	 * @method addMonths
	 * @param oDate {Date} The date to add months to.
	 * @param numMonths {Number} The number of months to add (can be negative)
	 * @return {Date} A new Date with the specified number of months
	 * added to the original date.
	 */	
	addMonths : function (oDate, numMonths) {
		_yuitest_coverfunc("build/datatype-date-math/datatype-date-math.js", "addMonths", 106);
_yuitest_coverline("build/datatype-date-math/datatype-date-math.js", 107);
var newYear = oDate.getFullYear();
		_yuitest_coverline("build/datatype-date-math/datatype-date-math.js", 108);
var newMonth = oDate.getMonth() + numMonths;		
		
		_yuitest_coverline("build/datatype-date-math/datatype-date-math.js", 110);
newYear  = Math.floor(newYear + newMonth / 12);
		_yuitest_coverline("build/datatype-date-math/datatype-date-math.js", 111);
newMonth = (newMonth % 12 + 12) % 12;
		
		_yuitest_coverline("build/datatype-date-math/datatype-date-math.js", 113);
var newDate = new Date (oDate.getTime());
		_yuitest_coverline("build/datatype-date-math/datatype-date-math.js", 114);
newDate.setFullYear(newYear);
		_yuitest_coverline("build/datatype-date-math/datatype-date-math.js", 115);
newDate.setMonth(newMonth);
		
		_yuitest_coverline("build/datatype-date-math/datatype-date-math.js", 117);
return newDate;
	},

	/**
	 * Adds a specified number of years to the given date.
	 * @for Date
	 * @method addYears
	 * @param oDate {Date} The date to add years to.
	 * @param numYears {Number} The number of years to add (can be negative)
	 * @return {Date} A new Date with the specified number of years
	 * added to the original date.
	 */	
	addYears : function (oDate, numYears) {
		_yuitest_coverfunc("build/datatype-date-math/datatype-date-math.js", "addYears", 129);
_yuitest_coverline("build/datatype-date-math/datatype-date-math.js", 130);
var newYear = oDate.getFullYear() + numYears;
		_yuitest_coverline("build/datatype-date-math/datatype-date-math.js", 131);
var newDate = new Date(oDate.getTime());
		
		_yuitest_coverline("build/datatype-date-math/datatype-date-math.js", 133);
newDate.setFullYear(newYear);
		_yuitest_coverline("build/datatype-date-math/datatype-date-math.js", 134);
return newDate;
	},

	/**
	 * Lists all dates in a given month.
	 * @for Date
	 * @method listOfDatesInMonth
	 * @param oDate {Date} The date corresponding to the month for
	 * which a list of dates is required.
	 * @return {Array} An `Array` of `Date`s from a given month.
	 */	
    listOfDatesInMonth : function (oDate) {
       _yuitest_coverfunc("build/datatype-date-math/datatype-date-math.js", "listOfDatesInMonth", 145);
_yuitest_coverline("build/datatype-date-math/datatype-date-math.js", 146);
if (!this.isValidDate(oDate)) {
       	 _yuitest_coverline("build/datatype-date-math/datatype-date-math.js", 147);
return [];
       }

       _yuitest_coverline("build/datatype-date-math/datatype-date-math.js", 150);
var daysInMonth = this.daysInMonth(oDate),
           year        = oDate.getFullYear(),
           month       = oDate.getMonth(),
           output      = [];

       _yuitest_coverline("build/datatype-date-math/datatype-date-math.js", 155);
for (var day = 1; day <= daysInMonth; day++) {
       	   _yuitest_coverline("build/datatype-date-math/datatype-date-math.js", 156);
output.push(new Date(year, month, day, 12, 0, 0));
       }

       _yuitest_coverline("build/datatype-date-math/datatype-date-math.js", 159);
return output;
    },

	/**
	 * Takes a native JavaScript Date and returns the number of days
	 * in the month that the given date belongs to.
	 * @for Date
	 * @method daysInMonth
	 * @param oDate {Date} Date in the month for which the number 
	 * of days is desired.
	 * @return {Number} A number (either 28, 29, 30 or 31) of days 
	 * in the given month.
	 */
	 daysInMonth : function (oDate) {
		_yuitest_coverfunc("build/datatype-date-math/datatype-date-math.js", "daysInMonth", 172);
_yuitest_coverline("build/datatype-date-math/datatype-date-math.js", 173);
if (!this.isValidDate(oDate)) {
			_yuitest_coverline("build/datatype-date-math/datatype-date-math.js", 174);
return 0;
		}
		
		_yuitest_coverline("build/datatype-date-math/datatype-date-math.js", 177);
var mon = oDate.getMonth();
		_yuitest_coverline("build/datatype-date-math/datatype-date-math.js", 178);
var lengths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

		_yuitest_coverline("build/datatype-date-math/datatype-date-math.js", 180);
if (mon != 1) {
			_yuitest_coverline("build/datatype-date-math/datatype-date-math.js", 181);
return lengths[mon];
		}
		else {

			_yuitest_coverline("build/datatype-date-math/datatype-date-math.js", 185);
var year = oDate.getFullYear();
			_yuitest_coverline("build/datatype-date-math/datatype-date-math.js", 186);
if (year%400 === 0) {
			       _yuitest_coverline("build/datatype-date-math/datatype-date-math.js", 187);
return 29;
			}	
			else {_yuitest_coverline("build/datatype-date-math/datatype-date-math.js", 189);
if (year%100 === 0) {
				   _yuitest_coverline("build/datatype-date-math/datatype-date-math.js", 190);
return 28;
			}
			else {_yuitest_coverline("build/datatype-date-math/datatype-date-math.js", 192);
if (year%4 === 0) {
			       _yuitest_coverline("build/datatype-date-math/datatype-date-math.js", 193);
return 29;
			}
			else {
			       _yuitest_coverline("build/datatype-date-math/datatype-date-math.js", 196);
return 28;
		    }}}
	   } 
	}

});

_yuitest_coverline("build/datatype-date-math/datatype-date-math.js", 203);
Y.namespace("DataType");
_yuitest_coverline("build/datatype-date-math/datatype-date-math.js", 204);
Y.DataType.Date = Y.Date;


}, '3.7.3', {"requires": ["yui-base"]});
