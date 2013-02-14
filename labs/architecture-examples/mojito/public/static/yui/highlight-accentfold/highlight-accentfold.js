/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('highlight-accentfold', function (Y, NAME) {

/**
Adds accent-folding highlighters to `Y.Highlight`.

@module highlight
@submodule highlight-accentfold
**/

/**
@class Highlight
@static
**/

var AccentFold = Y.Text.AccentFold,
    Escape     = Y.Escape,

    EMPTY_OBJECT = {},

Highlight = Y.mix(Y.Highlight, {
    // -- Public Static Methods ------------------------------------------------

    /**
    Accent-folding version of `all()`.

    @method allFold
    @param {String} haystack String to apply highlighting to.
    @param {String|String[]} needles String or array of strings that should be
      highlighted.
    @param {Object} [options] Options object.
    @param {Boolean} [options.startsWith=false] If `true`, matches must be
        anchored to the beginning of the string.
    @return {String} Escaped and highlighted copy of _haystack_.
    @static
    **/
    allFold: function (haystack, needles, options) {
        var template = Highlight._TEMPLATE,
            results  = [],
            startPos = 0,
            chunk, i, len, match, result;

        options = Y.merge({
            // This tells Highlight.all() not to escape HTML, in order to ensure
            // usable match offsets. The output of all() is discarded, and we
            // perform our own escaping before returning the highlighted string.
            escapeHTML: false,

            // While the highlight regex operates on the accent-folded strings,
            // this replacer will highlight the matched positions in the
            // original string.
            //
            // Note: this implementation doesn't handle multi-character folds,
            // like "æ" -> "ae". Doing so correctly would be prohibitively
            // expensive both in terms of code size and runtime performance, so
            // I've chosen to take the pragmatic route and just not do it at
            // all. This is one of many reasons why accent folding is best done
            // on the server.
            replacer: function (match, p1, foldedNeedle, pos) {
                var len;

                // Ignore matches inside HTML entities.
                if (p1 && !(/\s/).test(foldedNeedle)) {
                    return match;
                }

                len = foldedNeedle.length;

                results.push([
                    haystack.substring(startPos, pos), // substring between previous match and this match
                    haystack.substr(pos, len)          // match to be highlighted
                ]);

                startPos = pos + len;
            }
        }, options || EMPTY_OBJECT);

        // Run the highlighter on the folded strings. We don't care about the
        // output; our replacer function will build the canonical highlighted
        // string, with original accented characters.
        Highlight.all(AccentFold.fold(haystack), AccentFold.fold(needles), options);

        // Tack on the remainder of the haystack that wasn't highlighted, if
        // any.
        if (startPos < haystack.length) {
            results.push([haystack.substr(startPos)]);
        }

        // Highlight and escape the string.
        for (i = 0, len = results.length; i < len; ++i) {
            chunk = Escape.html(results[i][0]);

            if ((match = results[i][1])) {
                chunk += template.replace(/\{s\}/g, Escape.html(match));
            }

            results[i] = chunk;
        }

        return results.join('');
    },

    /**
    Accent-folding version of `start()`.

    @method startFold
    @param {String} haystack String to apply highlighting to.
    @param {String|String[]} needles String or array of strings that should be
      highlighted.
    @return {String} Escaped and highlighted copy of _haystack_.
    @static
    **/
    startFold: function (haystack, needles) {
        return Highlight.allFold(haystack, needles, {startsWith: true});
    },

    /**
    Accent-folding version of `words()`.

    @method wordsFold
    @param {String} haystack String to apply highlighting to.
    @param {String|String[]} needles String or array of strings containing words
      that should be highlighted. If a string is passed, it will be split
      into words; if an array is passed, it is assumed to have already been
      split.
    @return {String} Escaped and highlighted copy of _haystack_.
    @static
    **/
    wordsFold: function (haystack, needles) {
        var template = Highlight._TEMPLATE;

        return Highlight.words(haystack, AccentFold.fold(needles), {
            mapper: function (word, needles) {
                if (needles.hasOwnProperty(AccentFold.fold(word))) {
                    return template.replace(/\{s\}/g, Escape.html(word));
                }

                return Escape.html(word);
            }
        });
    }
});


}, '3.7.3', {"requires": ["highlight-base", "text-accentfold"]});
