/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('querystring-stringify', function (Y, NAME) {

/**
 * Provides Y.QueryString.stringify method for converting objects to Query Strings.
 *
 * @module querystring
 * @submodule querystring-stringify
 * @for QueryString
 * @static
 */

var QueryString = Y.namespace("QueryString"),
    stack = [],
    L = Y.Lang;

/**
 * Provides Y.QueryString.escape method to be able to override default encoding
 * method.  This is important in cases where non-standard delimiters are used, if
 * the delimiters would not normally be handled properly by the builtin
 * (en|de)codeURIComponent functions.
 * Default: encodeURIComponent
 * @module querystring
 * @submodule querystring-stringify
 * @for QueryString
 * @static
 **/
QueryString.escape = encodeURIComponent;

/**
 * <p>Converts an arbitrary value to a Query String representation.</p>
 *
 * <p>Objects with cyclical references will trigger an exception.</p>
 *
 * @method stringify
 * @public
 * @param obj {Variant} any arbitrary value to convert to query string
 * @param cfg {Object} (optional) Configuration object.  The three
 * supported configurations are:
 * <ul><li>sep: When defined, the value will be used as the key-value
 * separator.  The default value is "&".</li>
 * <li>eq: When defined, the value will be used to join the key to
 * the value.  The default value is "=".</li>
 * <li>arrayKey: When set to true, the key of an array will have the
 * '[]' notation appended to the key.  The default value is false.
 * </li></ul>
 * @param name {String} (optional) Name of the current key, for handling children recursively.
 * @static
 */
QueryString.stringify = function (obj, c, name) {
    var begin, end, i, l, n, s,
        sep = c && c.sep ? c.sep : "&",
        eq = c && c.eq ? c.eq : "=",
        aK = c && c.arrayKey ? c.arrayKey : false;

    if (L.isNull(obj) || L.isUndefined(obj) || L.isFunction(obj)) {
        return name ? QueryString.escape(name) + eq : '';
    }

    if (L.isBoolean(obj) || Object.prototype.toString.call(obj) === '[object Boolean]') {
        obj =+ obj;
    }

    if (L.isNumber(obj) || L.isString(obj)) {
        // Y.log("Number or string: "+obj);
        return QueryString.escape(name) + eq + QueryString.escape(obj);
    }

    if (L.isArray(obj)) {
        s = [];
        name = aK ? name + '[]' : name;
        l = obj.length;
        for (i = 0; i < l; i++) {
            s.push( QueryString.stringify(obj[i], c, name) );
        }

        return s.join(sep);
    }
    // now we know it's an object.
    // Y.log(
    //     typeof obj + (typeof obj === 'object' ? " ok" : "ONOES!")+
    //     Object.prototype.toString.call(obj)
    // );

    // Check for cyclical references in nested objects
    for (i = stack.length - 1; i >= 0; --i) {
        if (stack[i] === obj) {
            throw new Error("QueryString.stringify. Cyclical reference");
        }
    }

    stack.push(obj);
    s = [];
    begin = name ? name + '[' : '';
    end = name ? ']' : '';
    for (i in obj) {
        if (obj.hasOwnProperty(i)) {
            n = begin + i + end;
            s.push(QueryString.stringify(obj[i], c, n));
        }
    }

    stack.pop();
    s = s.join(sep);
    if (!s && name) {
        return name + "=";
    }

    return s;
};


}, '3.7.3', {"requires": ["yui-base"]});
