/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('querystring-parse-simple', function (Y, NAME) {

// @TODO this looks like we are requiring the user to extract the querystring
// portion of the url, which isn't good.  The majority use case will be to
// extract querystring from the document configured for this YUI instance.
// This should be the default if qs is not supplied.

/*global Y */
/**
 * <p>Provides Y.QueryString.stringify method for converting objects to Query Strings.
 * This is a simpler implementation than the full querystring-stringify.</p>
 * <p>Because some things may require basic query string escaping functionality,
 * this module provides the bare minimum functionality (decoding a hash of simple values),
 * without the additional support for arrays, objects, and so on.</p>
 * <p>This provides a friendly way to deserialize basic query strings, without necessitating
 * a lot of code for simple use-cases.</p>
 *
 * @module querystring
 * @submodule querystring-parse-simple
 * @for QueryString
 * @static
 */

var QueryString = Y.namespace("QueryString");

/**
 * Provides Y.QueryString.parse method to accept Query Strings and return native
 * JavaScript objects.
 *
 * @module querystring
 * @submodule querystring-parse
 * @for QueryString
 * @method parse
 * @param qs {String} Querystring to be parsed into an object.
 * @param sep {String} (optional) Character that should join param k=v pairs together. Default: "&"
 * @param eq  {String} (optional) Character that should join keys to their values. Default: "="
 * @public
 * @static
 */
QueryString.parse = function (qs, sep, eq) {
    sep = sep || "&";
    eq = eq || "=";
    for (
        var obj = {},
            i = 0,
            pieces = qs.split(sep),
            l = pieces.length,
            tuple;
        i < l;
        i ++
    ) {
        tuple = pieces[i].split(eq);
        if (tuple.length > 0) {
            obj[QueryString.unescape(tuple.shift())] = QueryString.unescape(tuple.join(eq));
        }
    }
    return obj;
};

/**
 * Provides Y.QueryString.unescape method to be able to override default decoding
 * method.  This is important in cases where non-standard delimiters are used, if
 * the delimiters would not normally be handled properly by the builtin
 * (en|de)codeURIComponent functions.
 * Default: replace "+" with " ", and then decodeURIComponent behavior.
 * @module querystring
 * @submodule querystring-parse
 * @for QueryString
 * @method unescape
 * @param s {String} String to be decoded.
 * @public
 * @static
 **/
QueryString.unescape = function (s) {
    return decodeURIComponent(s.replace(/\+/g, ' '));
};


}, '3.7.3', {"requires": ["yui-base"]});
