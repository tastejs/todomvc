/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('querystring-stringify-simple', function (Y, NAME) {

/*global Y */
/**
 * <p>Provides Y.QueryString.stringify method for converting objects to Query Strings.
 * This is a subset implementation of the full querystring-stringify.</p>
 * <p>This module provides the bare minimum functionality (encoding a hash of simple values),
 * without the additional support for nested data structures.  Every key-value pair is
 * encoded by encodeURIComponent.</p>
 * <p>This module provides a minimalistic way for io to handle  single-level objects
 * as transaction data.</p>
 *
 * @module querystring
 * @submodule querystring-stringify-simple
 * @for QueryString
 * @static
 */

var QueryString = Y.namespace("QueryString"),
    EUC = encodeURIComponent;

/**
 * <p>Converts a simple object to a Query String representation.</p>
 * <p>Nested objects, Arrays, and so on, are not supported.</p>
 *
 * @method stringify
 * @for QueryString
 * @public
 * @submodule querystring-stringify-simple
 * @param obj {Object} A single-level object to convert to a querystring.
 * @param cfg {Object} (optional) Configuration object.  In the simple
 *                                module, only the arrayKey setting is
 *                                supported.  When set to true, the key of an
 *                                array will have the '[]' notation appended
 *                                to the key;.
 * @static
 */
QueryString.stringify = function (obj, c) {
    var qs = [],
        // Default behavior is false; standard key notation.
        s = c && c.arrayKey ? true : false,
        key, i, l;

    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            if (Y.Lang.isArray(obj[key])) {
                for (i = 0, l = obj[key].length; i < l; i++) {
                    qs.push(EUC(s ? key + '[]' : key) + '=' + EUC(obj[key][i]));
                }
            }
            else {
                qs.push(EUC(key) + '=' + EUC(obj[key]));
            }
        }
    }

    return qs.join('&');
};


}, '3.7.3', {"requires": ["yui-base"]});
