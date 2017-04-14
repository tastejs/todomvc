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
_yuitest_coverage["build/escape/escape.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/escape/escape.js",
    code: []
};
_yuitest_coverage["build/escape/escape.js"].code=["YUI.add('escape', function (Y, NAME) {","","/**","Provides utility methods for escaping strings.","","@module escape","@class Escape","@static","@since 3.3.0","**/","","var HTML_CHARS = {","        '&': '&amp;',","        '<': '&lt;',","        '>': '&gt;',","        '\"': '&quot;',","        \"'\": '&#x27;',","        '/': '&#x2F;',","        '`': '&#x60;'","    },","","Escape = {","    // -- Public Static Methods ------------------------------------------------","","    /**","    Returns a copy of the specified string with special HTML characters","    escaped. The following characters will be converted to their","    corresponding character entities:","","        & < > \" ' / `","","    This implementation is based on the [OWASP HTML escaping","    recommendations][1]. In addition to the characters in the OWASP","    recommendations, we also escape the <code>&#x60;</code> character, since IE","    interprets it as an attribute delimiter.","","    If _string_ is not already a string, it will be coerced to a string.","","    [1]: http://www.owasp.org/index.php/XSS_(Cross_Site_Scripting)_Prevention_Cheat_Sheet","","    @method html","    @param {String} string String to escape.","    @return {String} Escaped string.","    @static","    **/","    html: function (string) {","        return (string + '').replace(/[&<>\"'\\/`]/g, Escape._htmlReplacer);","    },","","    /**","    Returns a copy of the specified string with special regular expression","    characters escaped, allowing the string to be used safely inside a regex.","    The following characters, and all whitespace characters, are escaped:","","        - $ ^ * ( ) + [ ] { } | \\ , . ?","","    If _string_ is not already a string, it will be coerced to a string.","","    @method regex","    @param {String} string String to escape.","    @return {String} Escaped string.","    @static","    **/","    regex: function (string) {","        // There's no need to escape !, =, and : since they only have meaning","        // when they follow a parenthesized ?, as in (?:...), and we already","        // escape parens and question marks.","        return (string + '').replace(/[\\-$\\^*()+\\[\\]{}|\\\\,.?\\s]/g, '\\\\$&');","    },","","    // -- Protected Static Methods ---------------------------------------------","","    /**","     * Regex replacer for HTML escaping.","     *","     * @method _htmlReplacer","     * @param {String} match Matched character (must exist in HTML_CHARS).","     * @returns {String} HTML entity.","     * @static","     * @protected","     */","    _htmlReplacer: function (match) {","        return HTML_CHARS[match];","    }","};","","Escape.regexp = Escape.regex;","","Y.Escape = Escape;","","","}, '3.7.3', {\"requires\": [\"yui-base\"]});"];
_yuitest_coverage["build/escape/escape.js"].lines = {"1":0,"12":0,"47":0,"68":0,"83":0,"87":0,"89":0};
_yuitest_coverage["build/escape/escape.js"].functions = {"html:46":0,"regex:64":0,"_htmlReplacer:82":0,"(anonymous 1):1":0};
_yuitest_coverage["build/escape/escape.js"].coveredLines = 7;
_yuitest_coverage["build/escape/escape.js"].coveredFunctions = 4;
_yuitest_coverline("build/escape/escape.js", 1);
YUI.add('escape', function (Y, NAME) {

/**
Provides utility methods for escaping strings.

@module escape
@class Escape
@static
@since 3.3.0
**/

_yuitest_coverfunc("build/escape/escape.js", "(anonymous 1)", 1);
_yuitest_coverline("build/escape/escape.js", 12);
var HTML_CHARS = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '/': '&#x2F;',
        '`': '&#x60;'
    },

Escape = {
    // -- Public Static Methods ------------------------------------------------

    /**
    Returns a copy of the specified string with special HTML characters
    escaped. The following characters will be converted to their
    corresponding character entities:

        & < > " ' / `

    This implementation is based on the [OWASP HTML escaping
    recommendations][1]. In addition to the characters in the OWASP
    recommendations, we also escape the <code>&#x60;</code> character, since IE
    interprets it as an attribute delimiter.

    If _string_ is not already a string, it will be coerced to a string.

    [1]: http://www.owasp.org/index.php/XSS_(Cross_Site_Scripting)_Prevention_Cheat_Sheet

    @method html
    @param {String} string String to escape.
    @return {String} Escaped string.
    @static
    **/
    html: function (string) {
        _yuitest_coverfunc("build/escape/escape.js", "html", 46);
_yuitest_coverline("build/escape/escape.js", 47);
return (string + '').replace(/[&<>"'\/`]/g, Escape._htmlReplacer);
    },

    /**
    Returns a copy of the specified string with special regular expression
    characters escaped, allowing the string to be used safely inside a regex.
    The following characters, and all whitespace characters, are escaped:

        - $ ^ * ( ) + [ ] { } | \ , . ?

    If _string_ is not already a string, it will be coerced to a string.

    @method regex
    @param {String} string String to escape.
    @return {String} Escaped string.
    @static
    **/
    regex: function (string) {
        // There's no need to escape !, =, and : since they only have meaning
        // when they follow a parenthesized ?, as in (?:...), and we already
        // escape parens and question marks.
        _yuitest_coverfunc("build/escape/escape.js", "regex", 64);
_yuitest_coverline("build/escape/escape.js", 68);
return (string + '').replace(/[\-$\^*()+\[\]{}|\\,.?\s]/g, '\\$&');
    },

    // -- Protected Static Methods ---------------------------------------------

    /**
     * Regex replacer for HTML escaping.
     *
     * @method _htmlReplacer
     * @param {String} match Matched character (must exist in HTML_CHARS).
     * @returns {String} HTML entity.
     * @static
     * @protected
     */
    _htmlReplacer: function (match) {
        _yuitest_coverfunc("build/escape/escape.js", "_htmlReplacer", 82);
_yuitest_coverline("build/escape/escape.js", 83);
return HTML_CHARS[match];
    }
};

_yuitest_coverline("build/escape/escape.js", 87);
Escape.regexp = Escape.regex;

_yuitest_coverline("build/escape/escape.js", 89);
Y.Escape = Escape;


}, '3.7.3', {"requires": ["yui-base"]});
