/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('datatype-date-parse', function (Y, NAME) {

/**
 * Parse number submodule.
 *
 * @module datatype-date
 * @submodule datatype-date-parse
 * @for Date
 */
var LANG = Y.Lang;

Y.mix(Y.namespace("Date"), {
    /**
     * Converts data to type Date.
     *
     * @method parse
     * @param data {String | Number} Data to convert. Values supported by the Date constructor are supported.
     * @return {Date} A Date, or null.
     */
    parse: function(data) {
        var date = null;

        //Convert to date
        if(!(LANG.isDate(data))) {
            date = new Date(data);
        }
        else {
            return date;
        }

        // Validate
        if(LANG.isDate(date) && (date != "Invalid Date") && !isNaN(date)) { // Workaround for bug 2527965
            return date;
        }
        else {
            Y.log("Could not convert data to type Date", "warn", "date");
            return null;
        }
    }
});

// Add Parsers shortcut
Y.namespace("Parsers").date = Y.Date.parse;

Y.namespace("DataType");
Y.DataType.Date = Y.Date;


}, '3.7.3');
