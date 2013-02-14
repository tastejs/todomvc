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
_yuitest_coverage["build/highlight-base/highlight-base.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/highlight-base/highlight-base.js",
    code: []
};
_yuitest_coverage["build/highlight-base/highlight-base.js"].code=["YUI.add('highlight-base', function (Y, NAME) {","","/**","Provides methods for highlighting strings within other strings by wrapping","them in HTML.","","@module highlight","@submodule highlight-base","@main","@since 3.3.0","**/","","/**","Provides methods for highlighting strings within other strings by wrapping","them in HTML.","","The highlight methods first escape any special HTML characters in the input","strings and then highlight the appropriate substrings by wrapping them in a","`<b class=\"yui3-highlight\"></b>` element. The `<b>` element is used rather than","`<strong>` in accordance with HTML5's definition of `<b>` as being purely","presentational, which is exactly what highlighting is.","","@class Highlight","@static","**/","","var YArray    = Y.Array,","    Escape    = Y.Escape,","    WordBreak = Y.Text.WordBreak,","","    isArray = Y.Lang.isArray,","","    EMPTY_OBJECT = {},","","    // Regex string that captures zero or one unclosed HTML entities. Used in","    // the static regex template properties below. The entity matching is","    // intentionally loose here, since there's a world of complexity involved in","    // doing strict matching for this use case.","    UNCLOSED_ENTITY = '(&[^;\\\\s]*)?',","","Highlight = {","    // -- Protected Static Properties ------------------------------------------","","    /**","    Regular expression template for highlighting a match that occurs anywhere","    in a string. The placeholder `%needles` will be replaced with a list of","    needles to match, joined by `|` characters.","","    This regex should have two capturing subpatterns:","","      1. Zero or one unclosed HTML entity (e.g. \"&amp\" without a \";\" at the","         end).","      2. The `%needles` placeholder.","","    The first subpattern match is used to emulate a negative lookbehind","    assertion in order to prevent highlighting inside HTML entities.","","    @property _REGEX","    @type String","    @protected","    @static","    @final","    **/","    _REGEX: UNCLOSED_ENTITY + '(%needles)',","","    /**","    Regex replacer function or string for normal matches.","","    @property _REPLACER","    @type Function|String","    @protected","    @static","    @final","    **/","    _REPLACER: function (match, p1, p2) {","         // Mimicking a negative lookbehind assertion to prevent matches inside","         // HTML entities. Hat tip to Steven Levithan for the technique:","         // http://blog.stevenlevithan.com/archives/mimic-lookbehind-javascript","         return p1 && !(/\\s/).test(p2) ? match :","                    Highlight._TEMPLATE.replace(/\\{s\\}/g, p2);","     },","","    /**","    Regular expression template for highlighting start-of-string matches","    (i.e., only matches that occur at the beginning of a string). The","    placeholder `%needles` will be replaced with a list of needles to match,","    joined by `|` characters.","","    See `_REGEX` for a description of the capturing subpatterns this regex","    string should contain.","","    @property _START_REGEX","    @type String","    @protected","    @static","    @final","     */","    _START_REGEX: '^' + UNCLOSED_ENTITY + '(%needles)',","","    /**","    Highlight template which will be used as a replacement for matched","    substrings. The placeholder `{s}` will be replaced with the matched","    substring.","","    @property _TEMPLATE","    @type String","    @default '<b class=\"yui3-highlight\">{s}</b>'","    @protected","    @static","    @final","    **/","    _TEMPLATE: '<b class=\"' + Y.ClassNameManager.getClassName('highlight') + '\">{s}</b>',","","    // -- Public Static Methods ------------------------------------------------","","    /**","    Highlights all occurrences in the _haystack_ string of the items in the","    _needles_ array, regardless of where they occur. The returned string will","    have all HTML characters escaped except for the highlighting markup.","","    @method all","    @param {String} haystack String to apply highlighting to.","    @param {String|String[]} needles String or array of strings that should be","        highlighted.","    @param {Object} [options] Options object.","    @param {Boolean} [options.caseSensitive=false] If `true`, matching will","        be case-sensitive.","    @param {Boolean} [options.startsWith=false] If `true`, matches must be","        anchored to the beginning of the string.","    @return {String} Escaped and highlighted copy of _haystack_.","    @static","    **/","    all: function (haystack, needles, options) {","        var validNeedles = [],","            esc, i, len, needle, regex, replacer;","","        if (!options) {","            options = EMPTY_OBJECT;","        }","","        // TODO: document options.replacer","        esc      = options.escapeHTML !== false;","        regex    = options.startsWith ? Highlight._START_REGEX : Highlight._REGEX;","        replacer = options.replacer || Highlight._REPLACER;","        needles  = isArray(needles) ? needles : [needles];","","        // Escape HTML characters and special regular expression characters in","        // the needles so they can be used in a regex and matched against the","        // escaped haystack.","        for (i = 0, len = needles.length; i < len; ++i) {","            needle = needles[i];","","            if (needle) {","                validNeedles.push(Escape.regex(esc ? Escape.html(needle) : needle));","            }","        }","","        // Escape HTML characters in the haystack to prevent HTML injection.","        if (esc) {","            haystack = Escape.html(haystack);","        }","","        // No point continuing if there are no needles.","        if (!validNeedles.length) {","            return haystack;","        }","","        return haystack.replace(","            new RegExp(","                regex.replace('%needles', validNeedles.join('|')),","                options.caseSensitive ? 'g' : 'gi'","            ),","            replacer","        );","    },","","    /**","    Same as `all()`, but case-sensitive by default.","","    @method allCase","    @param {String} haystack String to apply highlighting to.","    @param {String|String[]} needles String or array of strings that should be","      highlighted.","    @param {Object} [options] Options object. See `all()` for details.","    @return {String} Escaped and highlighted copy of _haystack_.","    @static","    **/","    allCase: function (haystack, needles, options) {","        return Highlight.all(haystack, needles,","                Y.merge(options || EMPTY_OBJECT, {caseSensitive: true}));","    },","","    /**","    Highlights _needles_ that occur at the start of _haystack_. The returned","    string will have all HTML characters escaped except for the highlighting","    markup.","","    @method start","    @param {String} haystack String to apply highlighting to.","    @param {String|String[]} needles String or array of strings that should be","      highlighted.","    @param {Object} [options] Options object.","    @param {Boolean} [options.caseSensitive=false] If `true`, matching will","        be case-sensitive.","    @return {String} Escaped and highlighted copy of _haystack_.","    @static","    **/","    start: function (haystack, needles, options) {","        return Highlight.all(haystack, needles,","                Y.merge(options || EMPTY_OBJECT, {startsWith: true}));","    },","","    /**","    Same as `start()`, but case-sensitive by default.","","    @method startCase","    @param {String} haystack String to apply highlighting to.","    @param {String|String[]} needles String or array of strings that should be","      highlighted.","    @return {String} Escaped and highlighted copy of _haystack_.","    @static","    **/","    startCase: function (haystack, needles) {","        // No options passthru for now, since it would be redundant. If start()","        // ever supports more options than caseSensitive, then we'll start","        // passing the options through.","        return Highlight.start(haystack, needles, {caseSensitive: true});","    },","","    /**","    Highlights complete words in the _haystack_ string that are also in the","    _needles_ array. The returned string will have all HTML characters escaped","    except for the highlighting markup.","","    @method words","    @param {String} haystack String to apply highlighting to.","    @param {String|String[]} needles String or array of strings containing words","      that should be highlighted. If a string is passed, it will be split","      into words; if an array is passed, it is assumed to have already been","      split.","    @param {Object} [options] Options object.","    @param {Boolean} [options.caseSensitive=false] If `true`, matching will","        be case-sensitive.","    @return {String} Escaped and highlighted copy of _haystack_.","    @static","    **/","    words: function (haystack, needles, options) {","        var caseSensitive,","            mapper,","            template = Highlight._TEMPLATE,","            words;","","        if (!options) {","            options = EMPTY_OBJECT;","        }","","        caseSensitive = !!options.caseSensitive;","","        // Convert needles to a hash for faster lookups.","        needles = YArray.hash(","            isArray(needles) ? needles : WordBreak.getUniqueWords(needles, {","                ignoreCase: !caseSensitive","            })","        );","","        // The default word mapping function can be overridden with a custom","        // one. This is used to implement accent-folded highlighting in the","        // highlight-accentfold module.","        mapper = options.mapper || function (word, needles) {","            if (needles.hasOwnProperty(caseSensitive ? word : word.toLowerCase())) {","                return template.replace(/\\{s\\}/g, Escape.html(word));","            }","","            return Escape.html(word);","        };","","        // Split the haystack into an array of words, including punctuation and","        // whitespace so we can rebuild the string later.","        words = WordBreak.getWords(haystack, {","            includePunctuation: true,","            includeWhitespace : true","        });","","        return YArray.map(words, function (word) {","            return mapper(word, needles);","        }).join('');","    },","","    /**","    Same as `words()`, but case-sensitive by default.","","    @method wordsCase","    @param {String} haystack String to apply highlighting to.","    @param {String|String[]} needles String or array of strings containing words","      that should be highlighted. If a string is passed, it will be split","      into words; if an array is passed, it is assumed to have already been","      split.","    @return {String} Escaped and highlighted copy of _haystack_.","    @static","    **/","    wordsCase: function (haystack, needles) {","        // No options passthru for now, since it would be redundant. If words()","        // ever supports more options than caseSensitive, then we'll start","        // passing the options through.","        return Highlight.words(haystack, needles, {caseSensitive: true});","    }","};","","Y.Highlight = Highlight;","","","}, '3.7.3', {\"requires\": [\"array-extras\", \"classnamemanager\", \"escape\", \"text-wordbreak\"]});"];
_yuitest_coverage["build/highlight-base/highlight-base.js"].lines = {"1":0,"27":0,"79":0,"134":0,"137":0,"138":0,"142":0,"143":0,"144":0,"145":0,"150":0,"151":0,"153":0,"154":0,"159":0,"160":0,"164":0,"165":0,"168":0,"189":0,"209":0,"227":0,"248":0,"253":0,"254":0,"257":0,"260":0,"269":0,"270":0,"271":0,"274":0,"279":0,"284":0,"285":0,"305":0,"309":0};
_yuitest_coverage["build/highlight-base/highlight-base.js"].functions = {"_REPLACER:75":0,"all:133":0,"allCase:188":0,"start:208":0,"startCase:223":0,"(anonymous 2):269":0,"(anonymous 3):284":0,"words:247":0,"wordsCase:301":0,"(anonymous 1):1":0};
_yuitest_coverage["build/highlight-base/highlight-base.js"].coveredLines = 36;
_yuitest_coverage["build/highlight-base/highlight-base.js"].coveredFunctions = 10;
_yuitest_coverline("build/highlight-base/highlight-base.js", 1);
YUI.add('highlight-base', function (Y, NAME) {

/**
Provides methods for highlighting strings within other strings by wrapping
them in HTML.

@module highlight
@submodule highlight-base
@main
@since 3.3.0
**/

/**
Provides methods for highlighting strings within other strings by wrapping
them in HTML.

The highlight methods first escape any special HTML characters in the input
strings and then highlight the appropriate substrings by wrapping them in a
`<b class="yui3-highlight"></b>` element. The `<b>` element is used rather than
`<strong>` in accordance with HTML5's definition of `<b>` as being purely
presentational, which is exactly what highlighting is.

@class Highlight
@static
**/

_yuitest_coverfunc("build/highlight-base/highlight-base.js", "(anonymous 1)", 1);
_yuitest_coverline("build/highlight-base/highlight-base.js", 27);
var YArray    = Y.Array,
    Escape    = Y.Escape,
    WordBreak = Y.Text.WordBreak,

    isArray = Y.Lang.isArray,

    EMPTY_OBJECT = {},

    // Regex string that captures zero or one unclosed HTML entities. Used in
    // the static regex template properties below. The entity matching is
    // intentionally loose here, since there's a world of complexity involved in
    // doing strict matching for this use case.
    UNCLOSED_ENTITY = '(&[^;\\s]*)?',

Highlight = {
    // -- Protected Static Properties ------------------------------------------

    /**
    Regular expression template for highlighting a match that occurs anywhere
    in a string. The placeholder `%needles` will be replaced with a list of
    needles to match, joined by `|` characters.

    This regex should have two capturing subpatterns:

      1. Zero or one unclosed HTML entity (e.g. "&amp" without a ";" at the
         end).
      2. The `%needles` placeholder.

    The first subpattern match is used to emulate a negative lookbehind
    assertion in order to prevent highlighting inside HTML entities.

    @property _REGEX
    @type String
    @protected
    @static
    @final
    **/
    _REGEX: UNCLOSED_ENTITY + '(%needles)',

    /**
    Regex replacer function or string for normal matches.

    @property _REPLACER
    @type Function|String
    @protected
    @static
    @final
    **/
    _REPLACER: function (match, p1, p2) {
         // Mimicking a negative lookbehind assertion to prevent matches inside
         // HTML entities. Hat tip to Steven Levithan for the technique:
         // http://blog.stevenlevithan.com/archives/mimic-lookbehind-javascript
         _yuitest_coverfunc("build/highlight-base/highlight-base.js", "_REPLACER", 75);
_yuitest_coverline("build/highlight-base/highlight-base.js", 79);
return p1 && !(/\s/).test(p2) ? match :
                    Highlight._TEMPLATE.replace(/\{s\}/g, p2);
     },

    /**
    Regular expression template for highlighting start-of-string matches
    (i.e., only matches that occur at the beginning of a string). The
    placeholder `%needles` will be replaced with a list of needles to match,
    joined by `|` characters.

    See `_REGEX` for a description of the capturing subpatterns this regex
    string should contain.

    @property _START_REGEX
    @type String
    @protected
    @static
    @final
     */
    _START_REGEX: '^' + UNCLOSED_ENTITY + '(%needles)',

    /**
    Highlight template which will be used as a replacement for matched
    substrings. The placeholder `{s}` will be replaced with the matched
    substring.

    @property _TEMPLATE
    @type String
    @default '<b class="yui3-highlight">{s}</b>'
    @protected
    @static
    @final
    **/
    _TEMPLATE: '<b class="' + Y.ClassNameManager.getClassName('highlight') + '">{s}</b>',

    // -- Public Static Methods ------------------------------------------------

    /**
    Highlights all occurrences in the _haystack_ string of the items in the
    _needles_ array, regardless of where they occur. The returned string will
    have all HTML characters escaped except for the highlighting markup.

    @method all
    @param {String} haystack String to apply highlighting to.
    @param {String|String[]} needles String or array of strings that should be
        highlighted.
    @param {Object} [options] Options object.
    @param {Boolean} [options.caseSensitive=false] If `true`, matching will
        be case-sensitive.
    @param {Boolean} [options.startsWith=false] If `true`, matches must be
        anchored to the beginning of the string.
    @return {String} Escaped and highlighted copy of _haystack_.
    @static
    **/
    all: function (haystack, needles, options) {
        _yuitest_coverfunc("build/highlight-base/highlight-base.js", "all", 133);
_yuitest_coverline("build/highlight-base/highlight-base.js", 134);
var validNeedles = [],
            esc, i, len, needle, regex, replacer;

        _yuitest_coverline("build/highlight-base/highlight-base.js", 137);
if (!options) {
            _yuitest_coverline("build/highlight-base/highlight-base.js", 138);
options = EMPTY_OBJECT;
        }

        // TODO: document options.replacer
        _yuitest_coverline("build/highlight-base/highlight-base.js", 142);
esc      = options.escapeHTML !== false;
        _yuitest_coverline("build/highlight-base/highlight-base.js", 143);
regex    = options.startsWith ? Highlight._START_REGEX : Highlight._REGEX;
        _yuitest_coverline("build/highlight-base/highlight-base.js", 144);
replacer = options.replacer || Highlight._REPLACER;
        _yuitest_coverline("build/highlight-base/highlight-base.js", 145);
needles  = isArray(needles) ? needles : [needles];

        // Escape HTML characters and special regular expression characters in
        // the needles so they can be used in a regex and matched against the
        // escaped haystack.
        _yuitest_coverline("build/highlight-base/highlight-base.js", 150);
for (i = 0, len = needles.length; i < len; ++i) {
            _yuitest_coverline("build/highlight-base/highlight-base.js", 151);
needle = needles[i];

            _yuitest_coverline("build/highlight-base/highlight-base.js", 153);
if (needle) {
                _yuitest_coverline("build/highlight-base/highlight-base.js", 154);
validNeedles.push(Escape.regex(esc ? Escape.html(needle) : needle));
            }
        }

        // Escape HTML characters in the haystack to prevent HTML injection.
        _yuitest_coverline("build/highlight-base/highlight-base.js", 159);
if (esc) {
            _yuitest_coverline("build/highlight-base/highlight-base.js", 160);
haystack = Escape.html(haystack);
        }

        // No point continuing if there are no needles.
        _yuitest_coverline("build/highlight-base/highlight-base.js", 164);
if (!validNeedles.length) {
            _yuitest_coverline("build/highlight-base/highlight-base.js", 165);
return haystack;
        }

        _yuitest_coverline("build/highlight-base/highlight-base.js", 168);
return haystack.replace(
            new RegExp(
                regex.replace('%needles', validNeedles.join('|')),
                options.caseSensitive ? 'g' : 'gi'
            ),
            replacer
        );
    },

    /**
    Same as `all()`, but case-sensitive by default.

    @method allCase
    @param {String} haystack String to apply highlighting to.
    @param {String|String[]} needles String or array of strings that should be
      highlighted.
    @param {Object} [options] Options object. See `all()` for details.
    @return {String} Escaped and highlighted copy of _haystack_.
    @static
    **/
    allCase: function (haystack, needles, options) {
        _yuitest_coverfunc("build/highlight-base/highlight-base.js", "allCase", 188);
_yuitest_coverline("build/highlight-base/highlight-base.js", 189);
return Highlight.all(haystack, needles,
                Y.merge(options || EMPTY_OBJECT, {caseSensitive: true}));
    },

    /**
    Highlights _needles_ that occur at the start of _haystack_. The returned
    string will have all HTML characters escaped except for the highlighting
    markup.

    @method start
    @param {String} haystack String to apply highlighting to.
    @param {String|String[]} needles String or array of strings that should be
      highlighted.
    @param {Object} [options] Options object.
    @param {Boolean} [options.caseSensitive=false] If `true`, matching will
        be case-sensitive.
    @return {String} Escaped and highlighted copy of _haystack_.
    @static
    **/
    start: function (haystack, needles, options) {
        _yuitest_coverfunc("build/highlight-base/highlight-base.js", "start", 208);
_yuitest_coverline("build/highlight-base/highlight-base.js", 209);
return Highlight.all(haystack, needles,
                Y.merge(options || EMPTY_OBJECT, {startsWith: true}));
    },

    /**
    Same as `start()`, but case-sensitive by default.

    @method startCase
    @param {String} haystack String to apply highlighting to.
    @param {String|String[]} needles String or array of strings that should be
      highlighted.
    @return {String} Escaped and highlighted copy of _haystack_.
    @static
    **/
    startCase: function (haystack, needles) {
        // No options passthru for now, since it would be redundant. If start()
        // ever supports more options than caseSensitive, then we'll start
        // passing the options through.
        _yuitest_coverfunc("build/highlight-base/highlight-base.js", "startCase", 223);
_yuitest_coverline("build/highlight-base/highlight-base.js", 227);
return Highlight.start(haystack, needles, {caseSensitive: true});
    },

    /**
    Highlights complete words in the _haystack_ string that are also in the
    _needles_ array. The returned string will have all HTML characters escaped
    except for the highlighting markup.

    @method words
    @param {String} haystack String to apply highlighting to.
    @param {String|String[]} needles String or array of strings containing words
      that should be highlighted. If a string is passed, it will be split
      into words; if an array is passed, it is assumed to have already been
      split.
    @param {Object} [options] Options object.
    @param {Boolean} [options.caseSensitive=false] If `true`, matching will
        be case-sensitive.
    @return {String} Escaped and highlighted copy of _haystack_.
    @static
    **/
    words: function (haystack, needles, options) {
        _yuitest_coverfunc("build/highlight-base/highlight-base.js", "words", 247);
_yuitest_coverline("build/highlight-base/highlight-base.js", 248);
var caseSensitive,
            mapper,
            template = Highlight._TEMPLATE,
            words;

        _yuitest_coverline("build/highlight-base/highlight-base.js", 253);
if (!options) {
            _yuitest_coverline("build/highlight-base/highlight-base.js", 254);
options = EMPTY_OBJECT;
        }

        _yuitest_coverline("build/highlight-base/highlight-base.js", 257);
caseSensitive = !!options.caseSensitive;

        // Convert needles to a hash for faster lookups.
        _yuitest_coverline("build/highlight-base/highlight-base.js", 260);
needles = YArray.hash(
            isArray(needles) ? needles : WordBreak.getUniqueWords(needles, {
                ignoreCase: !caseSensitive
            })
        );

        // The default word mapping function can be overridden with a custom
        // one. This is used to implement accent-folded highlighting in the
        // highlight-accentfold module.
        _yuitest_coverline("build/highlight-base/highlight-base.js", 269);
mapper = options.mapper || function (word, needles) {
            _yuitest_coverfunc("build/highlight-base/highlight-base.js", "(anonymous 2)", 269);
_yuitest_coverline("build/highlight-base/highlight-base.js", 270);
if (needles.hasOwnProperty(caseSensitive ? word : word.toLowerCase())) {
                _yuitest_coverline("build/highlight-base/highlight-base.js", 271);
return template.replace(/\{s\}/g, Escape.html(word));
            }

            _yuitest_coverline("build/highlight-base/highlight-base.js", 274);
return Escape.html(word);
        };

        // Split the haystack into an array of words, including punctuation and
        // whitespace so we can rebuild the string later.
        _yuitest_coverline("build/highlight-base/highlight-base.js", 279);
words = WordBreak.getWords(haystack, {
            includePunctuation: true,
            includeWhitespace : true
        });

        _yuitest_coverline("build/highlight-base/highlight-base.js", 284);
return YArray.map(words, function (word) {
            _yuitest_coverfunc("build/highlight-base/highlight-base.js", "(anonymous 3)", 284);
_yuitest_coverline("build/highlight-base/highlight-base.js", 285);
return mapper(word, needles);
        }).join('');
    },

    /**
    Same as `words()`, but case-sensitive by default.

    @method wordsCase
    @param {String} haystack String to apply highlighting to.
    @param {String|String[]} needles String or array of strings containing words
      that should be highlighted. If a string is passed, it will be split
      into words; if an array is passed, it is assumed to have already been
      split.
    @return {String} Escaped and highlighted copy of _haystack_.
    @static
    **/
    wordsCase: function (haystack, needles) {
        // No options passthru for now, since it would be redundant. If words()
        // ever supports more options than caseSensitive, then we'll start
        // passing the options through.
        _yuitest_coverfunc("build/highlight-base/highlight-base.js", "wordsCase", 301);
_yuitest_coverline("build/highlight-base/highlight-base.js", 305);
return Highlight.words(haystack, needles, {caseSensitive: true});
    }
};

_yuitest_coverline("build/highlight-base/highlight-base.js", 309);
Y.Highlight = Highlight;


}, '3.7.3', {"requires": ["array-extras", "classnamemanager", "escape", "text-wordbreak"]});
