/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('datatype-date-math', function (Y, NAME) {

/**
 * Date Math submodule.
 *
 * @module datatype-date
 * @submodule datatype-date-math
 * @for Date
 */
var LANG = Y.Lang;

Y.mix(Y.namespace("Date"), {

	/**
	 * Checks whether a native JavaScript Date contains a valid value.
	 * @for Date
	 * @method isValidDate
	 * @param oDate {Date} Date in the month for which the number of days is desired.
	 * @return {Boolean} True if the date argument contains a valid value.
	 */
	 isValidDate : function (oDate) {
		if(LANG.isDate(oDate) && (isFinite(oDate)) && (oDate != "Invalid Date") && !isNaN(oDate) && (oDate != null)) {
            return true;
        }
        else {
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
		var newYear = oDate.getFullYear();
		var newMonth = oDate.getMonth() + numMonths;		
		
		newYear  = Math.floor(newYear + newMonth / 12);
		newMonth = (newMonth % 12 + 12) % 12;
		
		var newDate = new Date (oDate.getTime());
		newDate.setFullYear(newYear);
		newDate.setMonth(newMonth);
		
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
		var newYear = oDate.getFullYear() + numYears;
		var newDate = new Date(oDate.getTime());
		
		newDate.setFullYear(newYear);
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
       if (!this.isValidDate(oDate)) {
       	 return [];
       }

       var daysInMonth = this.daysInMonth(oDate),
           year        = oDate.getFullYear(),
           month       = oDate.getMonth(),
           output      = [];

       for (var day = 1; day <= daysInMonth; day++) {
       	   output.push(new Date(year, month, day, 12, 0, 0));
       }

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
		if (!this.isValidDate(oDate)) {
			return 0;
		}
		
		var mon = oDate.getMonth();
		var lengths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

		if (mon != 1) {
			return lengths[mon];
		}
		else {

			var year = oDate.getFullYear();
			if (year%400 === 0) {
			       return 29;
			}	
			else if (year%100 === 0) {
				   return 28;
			}
			else if (year%4 === 0) {
			       return 29;
			}
			else {
			       return 28;
		    }
	   } 
	}

});

Y.namespace("DataType");
Y.DataType.Date = Y.Date;


}, '3.7.3', {"requires": ["yui-base"]});
