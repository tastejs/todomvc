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
_yuitest_coverage["build/text-wordbreak/text-wordbreak.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/text-wordbreak/text-wordbreak.js",
    code: []
};
_yuitest_coverage["build/text-wordbreak/text-wordbreak.js"].code=["YUI.add('text-wordbreak', function (Y, NAME) {","","/**"," * Provides utility methods for splitting strings on word breaks and determining"," * whether a character index represents a word boundary."," *"," * @module text"," * @submodule text-wordbreak"," */","","/**"," * <p>"," * Provides utility methods for splitting strings on word breaks and determining"," * whether a character index represents a word boundary, using the generic word"," * breaking algorithm defined in the Unicode Text Segmentation guidelines"," * (<a href=\"http://unicode.org/reports/tr29/#Word_Boundaries\">Unicode Standard"," * Annex #29</a>)."," * </p>"," *"," * <p>"," * This algorithm provides a reasonable default for many languages. However, it"," * does not cover language or context specific requirements, and it does not"," * provide meaningful results at all for languages that don't use spaces between"," * words, such as Chinese, Japanese, Thai, Lao, Khmer, and others. Server-based"," * word breaking services usually provide significantly better results with"," * better performance."," * </p>"," *"," * @class Text.WordBreak"," * @static"," */","","var Text   = Y.Text,","    WBData = Text.Data.WordBreak,","","// Constants representing code point classifications.","ALETTER      = 0,","MIDNUMLET    = 1,","MIDLETTER    = 2,","MIDNUM       = 3,","NUMERIC      = 4,","CR           = 5,","LF           = 6,","NEWLINE      = 7,","EXTEND       = 8,","FORMAT       = 9,","KATAKANA     = 10,","EXTENDNUMLET = 11,","OTHER        = 12,","","// RegExp objects generated from code point data. Each regex matches a single","// character against a set of Unicode code points. The index of each item in","// this array must match its corresponding code point constant value defined","// above.","SETS = [","    new RegExp(WBData.aletter),","    new RegExp(WBData.midnumlet),","    new RegExp(WBData.midletter),","    new RegExp(WBData.midnum),","    new RegExp(WBData.numeric),","    new RegExp(WBData.cr),","    new RegExp(WBData.lf),","    new RegExp(WBData.newline),","    new RegExp(WBData.extend),","    new RegExp(WBData.format),","    new RegExp(WBData.katakana),","    new RegExp(WBData.extendnumlet)","],","","EMPTY_STRING = '',","PUNCTUATION  = new RegExp('^' + WBData.punctuation + '$'),","WHITESPACE   = /\\s/,","","WordBreak = {","    // -- Public Static Methods ------------------------------------------------","","    /**","     * Splits the specified string into an array of individual words.","     *","     * @method getWords","     * @param {String} string String to split.","     * @param {Object} options (optional) Options object containing zero or more","     *   of the following properties:","     *","     * <dl>","     *   <dt>ignoreCase (Boolean)</dt>","     *   <dd>","     *     If <code>true</code>, the string will be converted to lowercase","     *     before being split. Default is <code>false</code>.","     *   </dd>","     *","     *   <dt>includePunctuation (Boolean)</dt>","     *   <dd>","     *     If <code>true</code>, the returned array will include punctuation","     *     characters. Default is <code>false</code>.","     *   </dd>","     *","     *   <dt>includeWhitespace (Boolean)</dt>","     *   <dd>","     *     If <code>true</code>, the returned array will include whitespace","     *     characters. Default is <code>false</code>.","     *   </dd>","     * </dl>","     * @return {Array} Array of words.","     * @static","     */","    getWords: function (string, options) {","        var i     = 0,","            map   = WordBreak._classify(string),","            len   = map.length,","            word  = [],","            words = [],","            chr,","            includePunctuation,","            includeWhitespace;","","        if (!options) {","            options = {};","        }","","        if (options.ignoreCase) {","            string = string.toLowerCase();","        }","","        includePunctuation = options.includePunctuation;","        includeWhitespace  = options.includeWhitespace;","","        // Loop through each character in the classification map and determine","        // whether it precedes a word boundary, building an array of distinct","        // words as we go.","        for (; i < len; ++i) {","            chr = string.charAt(i);","","            // Append this character to the current word.","            word.push(chr);","","            // If there's a word boundary between the current character and the","            // next character, append the current word to the words array and","            // start building a new word. ","            if (WordBreak._isWordBoundary(map, i)) {","                word = word.join(EMPTY_STRING);","","                if (word &&","                        (includeWhitespace  || !WHITESPACE.test(word)) &&","                        (includePunctuation || !PUNCTUATION.test(word))) {","                    words.push(word);","                }","","                word = [];","            }","        }","","        return words;","    },","","    /**","     * Returns an array containing only unique words from the specified string.","     * For example, the string <code>'foo bar baz foo'</code> would result in","     * the array <code>['foo', 'bar', 'baz']</code>.","     *","     * @method getUniqueWords","     * @param {String} string String to split.","     * @param {Object} options (optional) Options (see <code>getWords()</code>","     *   for details).","     * @return {Array} Array of unique words.","     * @static","     */","    getUniqueWords: function (string, options) {","        return Y.Array.unique(WordBreak.getWords(string, options));","    },","","    /**","     * <p>","     * Returns <code>true</code> if there is a word boundary between the","     * specified character index and the next character index (or the end of the","     * string).","     * </p>","     *","     * <p>","     * Note that there are always word breaks at the beginning and end of a","     * string, so <code>isWordBoundary('', 0)</code> and","     * <code>isWordBoundary('a', 0)</code> will both return <code>true</code>.","     * </p>","     *","     * @method isWordBoundary","     * @param {String} string String to test.","     * @param {Number} index Character index to test within the string.","     * @return {Boolean} <code>true</code> for a word boundary,","     *   <code>false</code> otherwise.","     * @static","     */","    isWordBoundary: function (string, index) {","        return WordBreak._isWordBoundary(WordBreak._classify(string), index);","    },","","    // -- Protected Static Methods ---------------------------------------------","","    /**","     * Returns a character classification map for the specified string.","     *","     * @method _classify","     * @param {String} string String to classify.","     * @return {Array} Classification map.","     * @protected","     * @static","     */","    _classify: function (string) {","        var chr,","            map          = [],","            i            = 0,","            j,","            set,","            stringLength = string.length,","            setsLength   = SETS.length,","            type;","","        for (; i < stringLength; ++i) {","            chr  = string.charAt(i);","            type = OTHER;","","            for (j = 0; j < setsLength; ++j) {","                set = SETS[j];","","                if (set && set.test(chr)) {","                    type = j;","                    break;","                }","            }","","            map.push(type);","        }","","        return map;","    },","","    /**","     * <p>","     * Returns <code>true</code> if there is a word boundary between the","     * specified character index and the next character index (or the end of the","     * string).","     * </p>","     *","     * <p>","     * Note that there are always word breaks at the beginning and end of a","     * string, so <code>_isWordBoundary('', 0)</code> and","     * <code>_isWordBoundary('a', 0)</code> will both return <code>true</code>.","     * </p>","     *","     * @method _isWordBoundary","     * @param {Array} map Character classification map generated by","     *   <code>_classify</code>.","     * @param {Number} index Character index to test.","     * @return {Boolean}","     * @protected","     * @static","     */","    _isWordBoundary: function (map, index) {","        var prevType,","            type     = map[index],","            nextType = map[index + 1],","            nextNextType;","","        if (index < 0 || (index > map.length - 1 && index !== 0)) {","            return false;","        }","","        // WB5. Don't break between most letters.","        if (type === ALETTER && nextType === ALETTER) {","            return false;","        }","","        nextNextType = map[index + 2];","","        // WB6. Don't break letters across certain punctuation.","        if (type === ALETTER &&","                (nextType === MIDLETTER || nextType === MIDNUMLET) &&","                nextNextType === ALETTER) {","            return false;","        }","","        prevType = map[index - 1];","","        // WB7. Don't break letters across certain punctuation.","        if ((type === MIDLETTER || type === MIDNUMLET) &&","                nextType === ALETTER &&","                prevType === ALETTER) {","            return false;","        }","","        // WB8/WB9/WB10. Don't break inside sequences of digits or digits","        // adjacent to letters.","        if ((type === NUMERIC || type === ALETTER) &&","                (nextType === NUMERIC || nextType === ALETTER)) {","            return false;","        }","","        // WB11. Don't break inside numeric sequences like \"3.2\" or","        // \"3,456.789\".","        if ((type === MIDNUM || type === MIDNUMLET) &&","                nextType === NUMERIC &&","                prevType === NUMERIC) {","            return false;","        }","","        // WB12. Don't break inside numeric sequences like \"3.2\" or","        // \"3,456.789\".","        if (type === NUMERIC &&","                (nextType === MIDNUM || nextType === MIDNUMLET) &&","                nextNextType === NUMERIC) {","            return false;","        }","","        // WB4. Ignore format and extend characters.","        if (type === EXTEND || type === FORMAT ||","                prevType === EXTEND || prevType === FORMAT ||","                nextType === EXTEND || nextType === FORMAT) {","            return false;","        }","","        // WB3. Don't break inside CRLF.","        if (type === CR && nextType === LF) {","            return false;","        }","","        // WB3a. Break before newlines (including CR and LF).","        if (type === NEWLINE || type === CR || type === LF) {","            return true;","        }","","        // WB3b. Break after newlines (including CR and LF).","        if (nextType === NEWLINE || nextType === CR || nextType === LF) {","            return true;","        }","","        // WB13. Don't break between Katakana characters.","        if (type === KATAKANA && nextType === KATAKANA) {","            return false;","        }","","        // WB13a. Don't break from extenders.","        if (nextType === EXTENDNUMLET &&","                (type === ALETTER || type === NUMERIC || type === KATAKANA ||","                type === EXTENDNUMLET)) {","            return false;","        }","","        // WB13b. Don't break from extenders.","        if (type === EXTENDNUMLET &&","                (nextType === ALETTER || nextType === NUMERIC ||","                nextType === KATAKANA)) {","            return false;","        }","","        // Break after any character not covered by the rules above.","        return true;","    }","};","","Text.WordBreak = WordBreak;","","","}, '3.7.3', {\"requires\": [\"array-extras\", \"text-data-wordbreak\"]});"];
_yuitest_coverage["build/text-wordbreak/text-wordbreak.js"].lines = {"1":0,"33":0,"108":0,"117":0,"118":0,"121":0,"122":0,"125":0,"126":0,"131":0,"132":0,"135":0,"140":0,"141":0,"143":0,"146":0,"149":0,"153":0,"169":0,"193":0,"208":0,"217":0,"218":0,"219":0,"221":0,"222":0,"224":0,"225":0,"226":0,"230":0,"233":0,"258":0,"263":0,"264":0,"268":0,"269":0,"272":0,"275":0,"278":0,"281":0,"284":0,"287":0,"292":0,"294":0,"299":0,"302":0,"307":0,"310":0,"314":0,"317":0,"321":0,"322":0,"326":0,"327":0,"331":0,"332":0,"336":0,"337":0,"341":0,"344":0,"348":0,"351":0,"355":0,"359":0};
_yuitest_coverage["build/text-wordbreak/text-wordbreak.js"].functions = {"getWords:107":0,"getUniqueWords:168":0,"isWordBoundary:192":0,"_classify:207":0,"_isWordBoundary:257":0,"(anonymous 1):1":0};
_yuitest_coverage["build/text-wordbreak/text-wordbreak.js"].coveredLines = 64;
_yuitest_coverage["build/text-wordbreak/text-wordbreak.js"].coveredFunctions = 6;
_yuitest_coverline("build/text-wordbreak/text-wordbreak.js", 1);
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

_yuitest_coverfunc("build/text-wordbreak/text-wordbreak.js", "(anonymous 1)", 1);
_yuitest_coverline("build/text-wordbreak/text-wordbreak.js", 33);
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
        _yuitest_coverfunc("build/text-wordbreak/text-wordbreak.js", "getWords", 107);
_yuitest_coverline("build/text-wordbreak/text-wordbreak.js", 108);
var i     = 0,
            map   = WordBreak._classify(string),
            len   = map.length,
            word  = [],
            words = [],
            chr,
            includePunctuation,
            includeWhitespace;

        _yuitest_coverline("build/text-wordbreak/text-wordbreak.js", 117);
if (!options) {
            _yuitest_coverline("build/text-wordbreak/text-wordbreak.js", 118);
options = {};
        }

        _yuitest_coverline("build/text-wordbreak/text-wordbreak.js", 121);
if (options.ignoreCase) {
            _yuitest_coverline("build/text-wordbreak/text-wordbreak.js", 122);
string = string.toLowerCase();
        }

        _yuitest_coverline("build/text-wordbreak/text-wordbreak.js", 125);
includePunctuation = options.includePunctuation;
        _yuitest_coverline("build/text-wordbreak/text-wordbreak.js", 126);
includeWhitespace  = options.includeWhitespace;

        // Loop through each character in the classification map and determine
        // whether it precedes a word boundary, building an array of distinct
        // words as we go.
        _yuitest_coverline("build/text-wordbreak/text-wordbreak.js", 131);
for (; i < len; ++i) {
            _yuitest_coverline("build/text-wordbreak/text-wordbreak.js", 132);
chr = string.charAt(i);

            // Append this character to the current word.
            _yuitest_coverline("build/text-wordbreak/text-wordbreak.js", 135);
word.push(chr);

            // If there's a word boundary between the current character and the
            // next character, append the current word to the words array and
            // start building a new word. 
            _yuitest_coverline("build/text-wordbreak/text-wordbreak.js", 140);
if (WordBreak._isWordBoundary(map, i)) {
                _yuitest_coverline("build/text-wordbreak/text-wordbreak.js", 141);
word = word.join(EMPTY_STRING);

                _yuitest_coverline("build/text-wordbreak/text-wordbreak.js", 143);
if (word &&
                        (includeWhitespace  || !WHITESPACE.test(word)) &&
                        (includePunctuation || !PUNCTUATION.test(word))) {
                    _yuitest_coverline("build/text-wordbreak/text-wordbreak.js", 146);
words.push(word);
                }

                _yuitest_coverline("build/text-wordbreak/text-wordbreak.js", 149);
word = [];
            }
        }

        _yuitest_coverline("build/text-wordbreak/text-wordbreak.js", 153);
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
        _yuitest_coverfunc("build/text-wordbreak/text-wordbreak.js", "getUniqueWords", 168);
_yuitest_coverline("build/text-wordbreak/text-wordbreak.js", 169);
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
        _yuitest_coverfunc("build/text-wordbreak/text-wordbreak.js", "isWordBoundary", 192);
_yuitest_coverline("build/text-wordbreak/text-wordbreak.js", 193);
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
        _yuitest_coverfunc("build/text-wordbreak/text-wordbreak.js", "_classify", 207);
_yuitest_coverline("build/text-wordbreak/text-wordbreak.js", 208);
var chr,
            map          = [],
            i            = 0,
            j,
            set,
            stringLength = string.length,
            setsLength   = SETS.length,
            type;

        _yuitest_coverline("build/text-wordbreak/text-wordbreak.js", 217);
for (; i < stringLength; ++i) {
            _yuitest_coverline("build/text-wordbreak/text-wordbreak.js", 218);
chr  = string.charAt(i);
            _yuitest_coverline("build/text-wordbreak/text-wordbreak.js", 219);
type = OTHER;

            _yuitest_coverline("build/text-wordbreak/text-wordbreak.js", 221);
for (j = 0; j < setsLength; ++j) {
                _yuitest_coverline("build/text-wordbreak/text-wordbreak.js", 222);
set = SETS[j];

                _yuitest_coverline("build/text-wordbreak/text-wordbreak.js", 224);
if (set && set.test(chr)) {
                    _yuitest_coverline("build/text-wordbreak/text-wordbreak.js", 225);
type = j;
                    _yuitest_coverline("build/text-wordbreak/text-wordbreak.js", 226);
break;
                }
            }

            _yuitest_coverline("build/text-wordbreak/text-wordbreak.js", 230);
map.push(type);
        }

        _yuitest_coverline("build/text-wordbreak/text-wordbreak.js", 233);
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
        _yuitest_coverfunc("build/text-wordbreak/text-wordbreak.js", "_isWordBoundary", 257);
_yuitest_coverline("build/text-wordbreak/text-wordbreak.js", 258);
var prevType,
            type     = map[index],
            nextType = map[index + 1],
            nextNextType;

        _yuitest_coverline("build/text-wordbreak/text-wordbreak.js", 263);
if (index < 0 || (index > map.length - 1 && index !== 0)) {
            _yuitest_coverline("build/text-wordbreak/text-wordbreak.js", 264);
return false;
        }

        // WB5. Don't break between most letters.
        _yuitest_coverline("build/text-wordbreak/text-wordbreak.js", 268);
if (type === ALETTER && nextType === ALETTER) {
            _yuitest_coverline("build/text-wordbreak/text-wordbreak.js", 269);
return false;
        }

        _yuitest_coverline("build/text-wordbreak/text-wordbreak.js", 272);
nextNextType = map[index + 2];

        // WB6. Don't break letters across certain punctuation.
        _yuitest_coverline("build/text-wordbreak/text-wordbreak.js", 275);
if (type === ALETTER &&
                (nextType === MIDLETTER || nextType === MIDNUMLET) &&
                nextNextType === ALETTER) {
            _yuitest_coverline("build/text-wordbreak/text-wordbreak.js", 278);
return false;
        }

        _yuitest_coverline("build/text-wordbreak/text-wordbreak.js", 281);
prevType = map[index - 1];

        // WB7. Don't break letters across certain punctuation.
        _yuitest_coverline("build/text-wordbreak/text-wordbreak.js", 284);
if ((type === MIDLETTER || type === MIDNUMLET) &&
                nextType === ALETTER &&
                prevType === ALETTER) {
            _yuitest_coverline("build/text-wordbreak/text-wordbreak.js", 287);
return false;
        }

        // WB8/WB9/WB10. Don't break inside sequences of digits or digits
        // adjacent to letters.
        _yuitest_coverline("build/text-wordbreak/text-wordbreak.js", 292);
if ((type === NUMERIC || type === ALETTER) &&
                (nextType === NUMERIC || nextType === ALETTER)) {
            _yuitest_coverline("build/text-wordbreak/text-wordbreak.js", 294);
return false;
        }

        // WB11. Don't break inside numeric sequences like "3.2" or
        // "3,456.789".
        _yuitest_coverline("build/text-wordbreak/text-wordbreak.js", 299);
if ((type === MIDNUM || type === MIDNUMLET) &&
                nextType === NUMERIC &&
                prevType === NUMERIC) {
            _yuitest_coverline("build/text-wordbreak/text-wordbreak.js", 302);
return false;
        }

        // WB12. Don't break inside numeric sequences like "3.2" or
        // "3,456.789".
        _yuitest_coverline("build/text-wordbreak/text-wordbreak.js", 307);
if (type === NUMERIC &&
                (nextType === MIDNUM || nextType === MIDNUMLET) &&
                nextNextType === NUMERIC) {
            _yuitest_coverline("build/text-wordbreak/text-wordbreak.js", 310);
return false;
        }

        // WB4. Ignore format and extend characters.
        _yuitest_coverline("build/text-wordbreak/text-wordbreak.js", 314);
if (type === EXTEND || type === FORMAT ||
                prevType === EXTEND || prevType === FORMAT ||
                nextType === EXTEND || nextType === FORMAT) {
            _yuitest_coverline("build/text-wordbreak/text-wordbreak.js", 317);
return false;
        }

        // WB3. Don't break inside CRLF.
        _yuitest_coverline("build/text-wordbreak/text-wordbreak.js", 321);
if (type === CR && nextType === LF) {
            _yuitest_coverline("build/text-wordbreak/text-wordbreak.js", 322);
return false;
        }

        // WB3a. Break before newlines (including CR and LF).
        _yuitest_coverline("build/text-wordbreak/text-wordbreak.js", 326);
if (type === NEWLINE || type === CR || type === LF) {
            _yuitest_coverline("build/text-wordbreak/text-wordbreak.js", 327);
return true;
        }

        // WB3b. Break after newlines (including CR and LF).
        _yuitest_coverline("build/text-wordbreak/text-wordbreak.js", 331);
if (nextType === NEWLINE || nextType === CR || nextType === LF) {
            _yuitest_coverline("build/text-wordbreak/text-wordbreak.js", 332);
return true;
        }

        // WB13. Don't break between Katakana characters.
        _yuitest_coverline("build/text-wordbreak/text-wordbreak.js", 336);
if (type === KATAKANA && nextType === KATAKANA) {
            _yuitest_coverline("build/text-wordbreak/text-wordbreak.js", 337);
return false;
        }

        // WB13a. Don't break from extenders.
        _yuitest_coverline("build/text-wordbreak/text-wordbreak.js", 341);
if (nextType === EXTENDNUMLET &&
                (type === ALETTER || type === NUMERIC || type === KATAKANA ||
                type === EXTENDNUMLET)) {
            _yuitest_coverline("build/text-wordbreak/text-wordbreak.js", 344);
return false;
        }

        // WB13b. Don't break from extenders.
        _yuitest_coverline("build/text-wordbreak/text-wordbreak.js", 348);
if (type === EXTENDNUMLET &&
                (nextType === ALETTER || nextType === NUMERIC ||
                nextType === KATAKANA)) {
            _yuitest_coverline("build/text-wordbreak/text-wordbreak.js", 351);
return false;
        }

        // Break after any character not covered by the rules above.
        _yuitest_coverline("build/text-wordbreak/text-wordbreak.js", 355);
return true;
    }
};

_yuitest_coverline("build/text-wordbreak/text-wordbreak.js", 359);
Text.WordBreak = WordBreak;


}, '3.7.3', {"requires": ["array-extras", "text-data-wordbreak"]});
