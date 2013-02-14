/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('text-accentfold', function (Y, NAME) {

/**
 * Text utilities.
 *
 * @module text
 * @since 3.3.0
 */

/**
 * Provides a basic accent folding implementation that converts common accented
 * letters (like "á") to their non-accented forms (like "a").
 *
 * @module text
 * @submodule text-accentfold
 */

/**
 * <p>
 * Provides a basic accent folding implementation that converts common accented
 * letters (like "á") to their non-accented forms (like "a").
 * </p>
 *
 * <p>
 * This implementation is not comprehensive, and should only be used as a last
 * resort when accent folding can't be done on the server. A comprehensive
 * accent folding implementation would require much more character data to be
 * sent to the browser, resulting in a significant performance penalty. This
 * implementation strives for a compromise between usefulness and performance.
 * </p>
 *
 * <p>
 * Accent folding is a destructive operation that can't be reversed, and may
 * change or destroy the actual meaning of the text depending on the language.
 * It should not be used on strings that will later be displayed to a user,
 * unless this is done with the understanding that linguistic meaning may be
 * lost and that you may in fact confuse or insult the user by doing so.
 * </p>
 *
 * <p>
 * When used for matching, accent folding is likely to produce erroneous matches
 * for languages in which characters with diacritics are considered different
 * from their base characters, or where correct folding would map to other
 * character sequences than just stripped characters. For example, in German
 * "ü" is a character that's clearly different from "u" and should match "ue"
 * instead. The word "betrügen" means "to defraud", while "betrugen" is the past
 * tense of "to behave". The name "Müller" is expected to match "Mueller", but
 * not "Muller". On the other hand, accent folding falls short for languages
 * where different base characters are expected to match. In Japanese, for
 * example, hiragana and katakana characters with the same pronunciation ("あ"
 * and "ア") are commonly treated as equivalent for lookups, but accent folding
 * treats them as different.
 * </p>
 *
 * @class Text.AccentFold
 * @static
 */

var YArray   = Y.Array,
    Text     = Y.Text,
    FoldData = Text.Data.AccentFold,

AccentFold = {
    // -- Public Static Methods ------------------------------------------------

    /**
     * Returns <code>true</code> if the specified string contains one or more
     * characters that can be folded, <code>false</code> otherwise.
     *
     * @method canFold
     * @param {String} string String to test.
     * @return {Boolean}
     * @static
     */
    canFold: function (string) {
        var letter;

        for (letter in FoldData) {
            if (FoldData.hasOwnProperty(letter) &&
                    string.search(FoldData[letter]) !== -1) {
                return true;
            }
        }

        return false;
    },

    /**
     * Compares the accent-folded versions of two strings and returns
     * <code>true</code> if they're the same, <code>false</code> otherwise. If
     * a custom comparison function is supplied, the accent-folded strings will
     * be passed to that function for comparison.
     *
     * @method compare
     * @param {String} a First string to compare.
     * @param {String} b Second string to compare.
     * @param {Function} func (optional) Custom comparison function. Should
     *   return a truthy or falsy value.
     * @return {Boolean} Results of the comparison.
     * @static
     */
    compare: function (a, b, func) {
        var aFolded = AccentFold.fold(a),
            bFolded = AccentFold.fold(b);

        return func ? !!func(aFolded, bFolded) : aFolded === bFolded;
    },

    /**
     * <p>
     * Returns a copy of <em>haystack</em> containing only the strings for which
     * the supplied function returns <code>true</code>.
     * </p>
     *
     * <p>
     * While comparisons will be made using accent-folded strings, the returned
     * array of matches will contain the original strings that were passed in.
     * </p>
     *
     * @method filter
     * @param {Array} haystack Array of strings to filter.
     * @param {Function} func Comparison function. Will receive an accent-folded
     *   haystack string as an argument, and should return a truthy or falsy
     *   value.
     * @return {Array} Filtered copy of <em>haystack</em>.
     * @static
     */
    filter: function (haystack, func) {
        return YArray.filter(haystack, function (item) {
            return func(AccentFold.fold(item));
        });
    },

    /**
     * Accent-folds the specified string or array of strings and returns a copy
     * in which common accented letters have been converted to their closest
     * non-accented, lowercase forms.
     *
     * @method fold
     * @param {String|Array} input String or array of strings to be folded.
     * @return {String|Array} Folded string or array of strings.
     * @static
     */
    fold: function (input) {
        if (Y.Lang.isArray(input)) {
            return YArray.map(input, AccentFold.fold);
        }

        input = input.toLowerCase();

        Y.Object.each(FoldData, function (regex, letter) {
            input = input.replace(regex, letter);
        });

        return input;
    }
};

Text.AccentFold = AccentFold;


}, '3.7.3', {"requires": ["array-extras", "text-data-accentfold"]});
