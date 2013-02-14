/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('text-wordbreak', function (Y, NAME) {

/**
 * Provides utility methods for splitting strings on word breaks and determining
 * whether a character index represents a word boundary.
 *
 * @module text
 * @submodule text-wordbreak
 */

/**
 * <p>
 * Provides utility methods for splitting strings on word breaks and determining
 * whether a character index represents a word boundary, using the generic word
 * breaking algorithm defined in the Unicode Text Segmentation guidelines
 * (<a href="http://unicode.org/reports/tr29/#Word_Boundaries">Unicode Standard
 * Annex #29</a>).
 * </p>
 *
 * <p>
 * This algorithm provides a reasonable default for many languages. However, it
 * does not cover language or context specific requirements, and it does not
 * provide meaningful results at all for languages that don't use spaces between
 * words, such as Chinese, Japanese, Thai, Lao, Khmer, and others. Server-based
 * word breaking services usually provide significantly better results with
 * better performance.
 * </p>
 *
 * @class Text.WordBreak
 * @static
 */

var Text   = Y.Text,
    WBData = Text.Data.WordBreak,

// Constants representing code point classifications.
ALETTER      = 0,
MIDNUMLET    = 1,
MIDLETTER    = 2,
MIDNUM       = 3,
NUMERIC      = 4,
CR           = 5,
LF           = 6,
NEWLINE      = 7,
EXTEND       = 8,
FORMAT       = 9,
KATAKANA     = 10,
EXTENDNUMLET = 11,
OTHER        = 12,

// RegExp objects generated from code point data. Each regex matches a single
// character against a set of Unicode code points. The index of each item in
// this array must match its corresponding code point constant value defined
// above.
SETS = [
    new RegExp(WBData.aletter),
    new RegExp(WBData.midnumlet),
    new RegExp(WBData.midletter),
    new RegExp(WBData.midnum),
    new RegExp(WBData.numeric),
    new RegExp(WBData.cr),
    new RegExp(WBData.lf),
    new RegExp(WBData.newline),
    new RegExp(WBData.extend),
    new RegExp(WBData.format),
    new RegExp(WBData.katakana),
    new RegExp(WBData.extendnumlet)
],

EMPTY_STRING = '',
PUNCTUATION  = new RegExp('^' + WBData.punctuation + '$'),
WHITESPACE   = /\s/,

WordBreak = {
    // -- Public Static Methods ------------------------------------------------

    /**
     * Splits the specified string into an array of individual words.
     *
     * @method getWords
     * @param {String} string String to split.
     * @param {Object} options (optional) Options object containing zero or more
     *   of the following properties:
     *
     * <dl>
     *   <dt>ignoreCase (Boolean)</dt>
     *   <dd>
     *     If <code>true</code>, the string will be converted to lowercase
     *     before being split. Default is <code>false</code>.
     *   </dd>
     *
     *   <dt>includePunctuation (Boolean)</dt>
     *   <dd>
     *     If <code>true</code>, the returned array will include punctuation
     *     characters. Default is <code>false</code>.
     *   </dd>
     *
     *   <dt>includeWhitespace (Boolean)</dt>
     *   <dd>
     *     If <code>true</code>, the returned array will include whitespace
     *     characters. Default is <code>false</code>.
     *   </dd>
     * </dl>
     * @return {Array} Array of words.
     * @static
     */
    getWords: function (string, options) {
        var i     = 0,
            map   = WordBreak._classify(string),
            len   = map.length,
            word  = [],
            words = [],
            chr,
            includePunctuation,
            includeWhitespace;

        if (!options) {
            options = {};
        }

        if (options.ignoreCase) {
            string = string.toLowerCase();
        }

        includePunctuation = options.includePunctuation;
        includeWhitespace  = options.includeWhitespace;

        // Loop through each character in the classification map and determine
        // whether it precedes a word boundary, building an array of distinct
        // words as we go.
        for (; i < len; ++i) {
            chr = string.charAt(i);

            // Append this character to the current word.
            word.push(chr);

            // If there's a word boundary between the current character and the
            // next character, append the current word to the words array and
            // start building a new word. 
            if (WordBreak._isWordBoundary(map, i)) {
                word = word.join(EMPTY_STRING);

                if (word &&
                        (includeWhitespace  || !WHITESPACE.test(word)) &&
                        (includePunctuation || !PUNCTUATION.test(word))) {
                    words.push(word);
                }

                word = [];
            }
        }

        return words;
    },

    /**
     * Returns an array containing only unique words from the specified string.
     * For example, the string <code>'foo bar baz foo'</code> would result in
     * the array <code>['foo', 'bar', 'baz']</code>.
     *
     * @method getUniqueWords
     * @param {String} string String to split.
     * @param {Object} options (optional) Options (see <code>getWords()</code>
     *   for details).
     * @return {Array} Array of unique words.
     * @static
     */
    getUniqueWords: function (string, options) {
        return Y.Array.unique(WordBreak.getWords(string, options));
    },

    /**
     * <p>
     * Returns <code>true</code> if there is a word boundary between the
     * specified character index and the next character index (or the end of the
     * string).
     * </p>
     *
     * <p>
     * Note that there are always word breaks at the beginning and end of a
     * string, so <code>isWordBoundary('', 0)</code> and
     * <code>isWordBoundary('a', 0)</code> will both return <code>true</code>.
     * </p>
     *
     * @method isWordBoundary
     * @param {String} string String to test.
     * @param {Number} index Character index to test within the string.
     * @return {Boolean} <code>true</code> for a word boundary,
     *   <code>false</code> otherwise.
     * @static
     */
    isWordBoundary: function (string, index) {
        return WordBreak._isWordBoundary(WordBreak._classify(string), index);
    },

    // -- Protected Static Methods ---------------------------------------------

    /**
     * Returns a character classification map for the specified string.
     *
     * @method _classify
     * @param {String} string String to classify.
     * @return {Array} Classification map.
     * @protected
     * @static
     */
    _classify: function (string) {
        var chr,
            map          = [],
            i            = 0,
            j,
            set,
            stringLength = string.length,
            setsLength   = SETS.length,
            type;

        for (; i < stringLength; ++i) {
            chr  = string.charAt(i);
            type = OTHER;

            for (j = 0; j < setsLength; ++j) {
                set = SETS[j];

                if (set && set.test(chr)) {
                    type = j;
                    break;
                }
            }

            map.push(type);
        }

        return map;
    },

    /**
     * <p>
     * Returns <code>true</code> if there is a word boundary between the
     * specified character index and the next character index (or the end of the
     * string).
     * </p>
     *
     * <p>
     * Note that there are always word breaks at the beginning and end of a
     * string, so <code>_isWordBoundary('', 0)</code> and
     * <code>_isWordBoundary('a', 0)</code> will both return <code>true</code>.
     * </p>
     *
     * @method _isWordBoundary
     * @param {Array} map Character classification map generated by
     *   <code>_classify</code>.
     * @param {Number} index Character index to test.
     * @return {Boolean}
     * @protected
     * @static
     */
    _isWordBoundary: function (map, index) {
        var prevType,
            type     = map[index],
            nextType = map[index + 1],
            nextNextType;

        if (index < 0 || (index > map.length - 1 && index !== 0)) {
            return false;
        }

        // WB5. Don't break between most letters.
        if (type === ALETTER && nextType === ALETTER) {
            return false;
        }

        nextNextType = map[index + 2];

        // WB6. Don't break letters across certain punctuation.
        if (type === ALETTER &&
                (nextType === MIDLETTER || nextType === MIDNUMLET) &&
                nextNextType === ALETTER) {
            return false;
        }

        prevType = map[index - 1];

        // WB7. Don't break letters across certain punctuation.
        if ((type === MIDLETTER || type === MIDNUMLET) &&
                nextType === ALETTER &&
                prevType === ALETTER) {
            return false;
        }

        // WB8/WB9/WB10. Don't break inside sequences of digits or digits
        // adjacent to letters.
        if ((type === NUMERIC || type === ALETTER) &&
                (nextType === NUMERIC || nextType === ALETTER)) {
            return false;
        }

        // WB11. Don't break inside numeric sequences like "3.2" or
        // "3,456.789".
        if ((type === MIDNUM || type === MIDNUMLET) &&
                nextType === NUMERIC &&
                prevType === NUMERIC) {
            return false;
        }

        // WB12. Don't break inside numeric sequences like "3.2" or
        // "3,456.789".
        if (type === NUMERIC &&
                (nextType === MIDNUM || nextType === MIDNUMLET) &&
                nextNextType === NUMERIC) {
            return false;
        }

        // WB4. Ignore format and extend characters.
        if (type === EXTEND || type === FORMAT ||
                prevType === EXTEND || prevType === FORMAT ||
                nextType === EXTEND || nextType === FORMAT) {
            return false;
        }

        // WB3. Don't break inside CRLF.
        if (type === CR && nextType === LF) {
            return false;
        }

        // WB3a. Break before newlines (including CR and LF).
        if (type === NEWLINE || type === CR || type === LF) {
            return true;
        }

        // WB3b. Break after newlines (including CR and LF).
        if (nextType === NEWLINE || nextType === CR || nextType === LF) {
            return true;
        }

        // WB13. Don't break between Katakana characters.
        if (type === KATAKANA && nextType === KATAKANA) {
            return false;
        }

        // WB13a. Don't break from extenders.
        if (nextType === EXTENDNUMLET &&
                (type === ALETTER || type === NUMERIC || type === KATAKANA ||
                type === EXTENDNUMLET)) {
            return false;
        }

        // WB13b. Don't break from extenders.
        if (type === EXTENDNUMLET &&
                (nextType === ALETTER || nextType === NUMERIC ||
                nextType === KATAKANA)) {
            return false;
        }

        // Break after any character not covered by the rules above.
        return true;
    }
};

Text.WordBreak = WordBreak;


}, '3.7.3', {"requires": ["array-extras", "text-data-wordbreak"]});
