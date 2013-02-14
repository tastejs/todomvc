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
_yuitest_coverage["build/highlight-accentfold/highlight-accentfold.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/highlight-accentfold/highlight-accentfold.js",
    code: []
};
_yuitest_coverage["build/highlight-accentfold/highlight-accentfold.js"].code=["YUI.add('highlight-accentfold', function (Y, NAME) {","","/**","Adds accent-folding highlighters to `Y.Highlight`.","","@module highlight","@submodule highlight-accentfold","**/","","/**","@class Highlight","@static","**/","","var AccentFold = Y.Text.AccentFold,","    Escape     = Y.Escape,","","    EMPTY_OBJECT = {},","","Highlight = Y.mix(Y.Highlight, {","    // -- Public Static Methods ------------------------------------------------","","    /**","    Accent-folding version of `all()`.","","    @method allFold","    @param {String} haystack String to apply highlighting to.","    @param {String|String[]} needles String or array of strings that should be","      highlighted.","    @param {Object} [options] Options object.","    @param {Boolean} [options.startsWith=false] If `true`, matches must be","        anchored to the beginning of the string.","    @return {String} Escaped and highlighted copy of _haystack_.","    @static","    **/","    allFold: function (haystack, needles, options) {","        var template = Highlight._TEMPLATE,","            results  = [],","            startPos = 0,","            chunk, i, len, match, result;","","        options = Y.merge({","            // This tells Highlight.all() not to escape HTML, in order to ensure","            // usable match offsets. The output of all() is discarded, and we","            // perform our own escaping before returning the highlighted string.","            escapeHTML: false,","","            // While the highlight regex operates on the accent-folded strings,","            // this replacer will highlight the matched positions in the","            // original string.","            //","            // Note: this implementation doesn't handle multi-character folds,","            // like \"æ\" -> \"ae\". Doing so correctly would be prohibitively","            // expensive both in terms of code size and runtime performance, so","            // I've chosen to take the pragmatic route and just not do it at","            // all. This is one of many reasons why accent folding is best done","            // on the server.","            replacer: function (match, p1, foldedNeedle, pos) {","                var len;","","                // Ignore matches inside HTML entities.","                if (p1 && !(/\\s/).test(foldedNeedle)) {","                    return match;","                }","","                len = foldedNeedle.length;","","                results.push([","                    haystack.substring(startPos, pos), // substring between previous match and this match","                    haystack.substr(pos, len)          // match to be highlighted","                ]);","","                startPos = pos + len;","            }","        }, options || EMPTY_OBJECT);","","        // Run the highlighter on the folded strings. We don't care about the","        // output; our replacer function will build the canonical highlighted","        // string, with original accented characters.","        Highlight.all(AccentFold.fold(haystack), AccentFold.fold(needles), options);","","        // Tack on the remainder of the haystack that wasn't highlighted, if","        // any.","        if (startPos < haystack.length) {","            results.push([haystack.substr(startPos)]);","        }","","        // Highlight and escape the string.","        for (i = 0, len = results.length; i < len; ++i) {","            chunk = Escape.html(results[i][0]);","","            if ((match = results[i][1])) {","                chunk += template.replace(/\\{s\\}/g, Escape.html(match));","            }","","            results[i] = chunk;","        }","","        return results.join('');","    },","","    /**","    Accent-folding version of `start()`.","","    @method startFold","    @param {String} haystack String to apply highlighting to.","    @param {String|String[]} needles String or array of strings that should be","      highlighted.","    @return {String} Escaped and highlighted copy of _haystack_.","    @static","    **/","    startFold: function (haystack, needles) {","        return Highlight.allFold(haystack, needles, {startsWith: true});","    },","","    /**","    Accent-folding version of `words()`.","","    @method wordsFold","    @param {String} haystack String to apply highlighting to.","    @param {String|String[]} needles String or array of strings containing words","      that should be highlighted. If a string is passed, it will be split","      into words; if an array is passed, it is assumed to have already been","      split.","    @return {String} Escaped and highlighted copy of _haystack_.","    @static","    **/","    wordsFold: function (haystack, needles) {","        var template = Highlight._TEMPLATE;","","        return Highlight.words(haystack, AccentFold.fold(needles), {","            mapper: function (word, needles) {","                if (needles.hasOwnProperty(AccentFold.fold(word))) {","                    return template.replace(/\\{s\\}/g, Escape.html(word));","                }","","                return Escape.html(word);","            }","        });","    }","});","","","}, '3.7.3', {\"requires\": [\"highlight-base\", \"text-accentfold\"]});"];
_yuitest_coverage["build/highlight-accentfold/highlight-accentfold.js"].lines = {"1":0,"15":0,"37":0,"42":0,"59":0,"62":0,"63":0,"66":0,"68":0,"73":0,"80":0,"84":0,"85":0,"89":0,"90":0,"92":0,"93":0,"96":0,"99":0,"113":0,"129":0,"131":0,"133":0,"134":0,"137":0};
_yuitest_coverage["build/highlight-accentfold/highlight-accentfold.js"].functions = {"replacer:58":0,"allFold:36":0,"startFold:112":0,"mapper:132":0,"wordsFold:128":0,"(anonymous 1):1":0};
_yuitest_coverage["build/highlight-accentfold/highlight-accentfold.js"].coveredLines = 25;
_yuitest_coverage["build/highlight-accentfold/highlight-accentfold.js"].coveredFunctions = 6;
_yuitest_coverline("build/highlight-accentfold/highlight-accentfold.js", 1);
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

_yuitest_coverfunc("build/highlight-accentfold/highlight-accentfold.js", "(anonymous 1)", 1);
_yuitest_coverline("build/highlight-accentfold/highlight-accentfold.js", 15);
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
        _yuitest_coverfunc("build/highlight-accentfold/highlight-accentfold.js", "allFold", 36);
_yuitest_coverline("build/highlight-accentfold/highlight-accentfold.js", 37);
var template = Highlight._TEMPLATE,
            results  = [],
            startPos = 0,
            chunk, i, len, match, result;

        _yuitest_coverline("build/highlight-accentfold/highlight-accentfold.js", 42);
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
                _yuitest_coverfunc("build/highlight-accentfold/highlight-accentfold.js", "replacer", 58);
_yuitest_coverline("build/highlight-accentfold/highlight-accentfold.js", 59);
var len;

                // Ignore matches inside HTML entities.
                _yuitest_coverline("build/highlight-accentfold/highlight-accentfold.js", 62);
if (p1 && !(/\s/).test(foldedNeedle)) {
                    _yuitest_coverline("build/highlight-accentfold/highlight-accentfold.js", 63);
return match;
                }

                _yuitest_coverline("build/highlight-accentfold/highlight-accentfold.js", 66);
len = foldedNeedle.length;

                _yuitest_coverline("build/highlight-accentfold/highlight-accentfold.js", 68);
results.push([
                    haystack.substring(startPos, pos), // substring between previous match and this match
                    haystack.substr(pos, len)          // match to be highlighted
                ]);

                _yuitest_coverline("build/highlight-accentfold/highlight-accentfold.js", 73);
startPos = pos + len;
            }
        }, options || EMPTY_OBJECT);

        // Run the highlighter on the folded strings. We don't care about the
        // output; our replacer function will build the canonical highlighted
        // string, with original accented characters.
        _yuitest_coverline("build/highlight-accentfold/highlight-accentfold.js", 80);
Highlight.all(AccentFold.fold(haystack), AccentFold.fold(needles), options);

        // Tack on the remainder of the haystack that wasn't highlighted, if
        // any.
        _yuitest_coverline("build/highlight-accentfold/highlight-accentfold.js", 84);
if (startPos < haystack.length) {
            _yuitest_coverline("build/highlight-accentfold/highlight-accentfold.js", 85);
results.push([haystack.substr(startPos)]);
        }

        // Highlight and escape the string.
        _yuitest_coverline("build/highlight-accentfold/highlight-accentfold.js", 89);
for (i = 0, len = results.length; i < len; ++i) {
            _yuitest_coverline("build/highlight-accentfold/highlight-accentfold.js", 90);
chunk = Escape.html(results[i][0]);

            _yuitest_coverline("build/highlight-accentfold/highlight-accentfold.js", 92);
if ((match = results[i][1])) {
                _yuitest_coverline("build/highlight-accentfold/highlight-accentfold.js", 93);
chunk += template.replace(/\{s\}/g, Escape.html(match));
            }

            _yuitest_coverline("build/highlight-accentfold/highlight-accentfold.js", 96);
results[i] = chunk;
        }

        _yuitest_coverline("build/highlight-accentfold/highlight-accentfold.js", 99);
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
        _yuitest_coverfunc("build/highlight-accentfold/highlight-accentfold.js", "startFold", 112);
_yuitest_coverline("build/highlight-accentfold/highlight-accentfold.js", 113);
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
        _yuitest_coverfunc("build/highlight-accentfold/highlight-accentfold.js", "wordsFold", 128);
_yuitest_coverline("build/highlight-accentfold/highlight-accentfold.js", 129);
var template = Highlight._TEMPLATE;

        _yuitest_coverline("build/highlight-accentfold/highlight-accentfold.js", 131);
return Highlight.words(haystack, AccentFold.fold(needles), {
            mapper: function (word, needles) {
                _yuitest_coverfunc("build/highlight-accentfold/highlight-accentfold.js", "mapper", 132);
_yuitest_coverline("build/highlight-accentfold/highlight-accentfold.js", 133);
if (needles.hasOwnProperty(AccentFold.fold(word))) {
                    _yuitest_coverline("build/highlight-accentfold/highlight-accentfold.js", 134);
return template.replace(/\{s\}/g, Escape.html(word));
                }

                _yuitest_coverline("build/highlight-accentfold/highlight-accentfold.js", 137);
return Escape.html(word);
            }
        });
    }
});


}, '3.7.3', {"requires": ["highlight-base", "text-accentfold"]});
