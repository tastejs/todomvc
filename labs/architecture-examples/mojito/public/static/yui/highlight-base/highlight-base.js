/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
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
        var validNeedles = [],
            esc, i, len, needle, regex, replacer;

        if (!options) {
            options = EMPTY_OBJECT;
        }

        // TODO: document options.replacer
        esc      = options.escapeHTML !== false;
        regex    = options.startsWith ? Highlight._START_REGEX : Highlight._REGEX;
        replacer = options.replacer || Highlight._REPLACER;
        needles  = isArray(needles) ? needles : [needles];

        // Escape HTML characters and special regular expression characters in
        // the needles so they can be used in a regex and matched against the
        // escaped haystack.
        for (i = 0, len = needles.length; i < len; ++i) {
            needle = needles[i];

            if (needle) {
                validNeedles.push(Escape.regex(esc ? Escape.html(needle) : needle));
            }
        }

        // Escape HTML characters in the haystack to prevent HTML injection.
        if (esc) {
            haystack = Escape.html(haystack);
        }

        // No point continuing if there are no needles.
        if (!validNeedles.length) {
            return haystack;
        }

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
        var caseSensitive,
            mapper,
            template = Highlight._TEMPLATE,
            words;

        if (!options) {
            options = EMPTY_OBJECT;
        }

        caseSensitive = !!options.caseSensitive;

        // Convert needles to a hash for faster lookups.
        needles = YArray.hash(
            isArray(needles) ? needles : WordBreak.getUniqueWords(needles, {
                ignoreCase: !caseSensitive
            })
        );

        // The default word mapping function can be overridden with a custom
        // one. This is used to implement accent-folded highlighting in the
        // highlight-accentfold module.
        mapper = options.mapper || function (word, needles) {
            if (needles.hasOwnProperty(caseSensitive ? word : word.toLowerCase())) {
                return template.replace(/\{s\}/g, Escape.html(word));
            }

            return Escape.html(word);
        };

        // Split the haystack into an array of words, including punctuation and
        // whitespace so we can rebuild the string later.
        words = WordBreak.getWords(haystack, {
            includePunctuation: true,
            includeWhitespace : true
        });

        return YArray.map(words, function (word) {
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
        return Highlight.words(haystack, needles, {caseSensitive: true});
    }
};

Y.Highlight = Highlight;


}, '3.7.3', {"requires": ["array-extras", "classnamemanager", "escape", "text-wordbreak"]});
