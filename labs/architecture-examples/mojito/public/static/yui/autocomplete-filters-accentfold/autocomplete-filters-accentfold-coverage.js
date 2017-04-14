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
_yuitest_coverage["build/autocomplete-filters-accentfold/autocomplete-filters-accentfold.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/autocomplete-filters-accentfold/autocomplete-filters-accentfold.js",
    code: []
};
_yuitest_coverage["build/autocomplete-filters-accentfold/autocomplete-filters-accentfold.js"].code=["YUI.add('autocomplete-filters-accentfold', function (Y, NAME) {","","/**","Provides pre-built accent-folding result matching filters for AutoComplete.","","These filters are similar to the ones provided by the `autocomplete-filters`","module, but use accent-aware comparisons. For example, \"resume\" and \"résumé\"","will be considered equal when using the accent-folding filters.","","@module autocomplete","@submodule autocomplete-filters-accentfold","**/","","/**","@class AutoCompleteFilters","@static","**/","","var AccentFold = Y.Text.AccentFold,","    WordBreak  = Y.Text.WordBreak,","    YArray     = Y.Array,","    YObject    = Y.Object;","","Y.mix(Y.namespace('AutoCompleteFilters'), {","    /**","    Accent folding version of `charMatch()`.","","    @method charMatchFold","    @param {String} query Query to match","    @param {Array} results Results to filter","    @return {Array} Filtered results","    @static","    **/","    charMatchFold: function (query, results) {","        if (!query) { return results; }","","        var queryChars = YArray.unique(AccentFold.fold(query).split(''));","","        return YArray.filter(results, function (result) {","            var text = AccentFold.fold(result.text);","","            return YArray.every(queryChars, function (chr) {","                return text.indexOf(chr) !== -1;","            });","        });","    },","","    /**","    Accent folding version of `phraseMatch()`.","","    @method phraseMatchFold","    @param {String} query Query to match","    @param {Array} results Results to filter","    @return {Array} Filtered results","    @static","    **/","    phraseMatchFold: function (query, results) {","        if (!query) { return results; }","","        query = AccentFold.fold(query);","","        return YArray.filter(results, function (result) {","            return AccentFold.fold(result.text).indexOf(query) !== -1;","        });","    },","","    /**","    Accent folding version of `startsWith()`.","","    @method startsWithFold","    @param {String} query Query to match","    @param {Array} results Results to filter","    @return {Array} Filtered results","    @static","    **/","    startsWithFold: function (query, results) {","        if (!query) { return results; }","","        query = AccentFold.fold(query);","","        return YArray.filter(results, function (result) {","            return AccentFold.fold(result.text).indexOf(query) === 0;","        });","    },","","    /**","    Accent folding version of `subWordMatch()`.","","    @method subWordMatchFold","    @param {String} query Query to match","    @param {Array} results Results to filter","    @return {Array} Filtered results","    @static","    **/","    subWordMatchFold: function (query, results) {","        if (!query) { return results; }","","        var queryWords = WordBreak.getUniqueWords(AccentFold.fold(query));","","        return YArray.filter(results, function (result) {","            var resultText = AccentFold.fold(result.text);","","            return YArray.every(queryWords, function (queryWord) {","                return resultText.indexOf(queryWord) !== -1;","            });","        });","    },","","    /**","    Accent folding version of `wordMatch()`.","","    @method wordMatchFold","    @param {String} query Query to match","    @param {Array} results Results to filter","    @return {Array} Filtered results","    @static","    **/","    wordMatchFold: function (query, results) {","        if (!query) { return results; }","","        var queryWords = WordBreak.getUniqueWords(AccentFold.fold(query));","","        return YArray.filter(results, function (result) {","            // Convert resultWords array to a hash for fast lookup.","            var resultWords = YArray.hash(WordBreak.getUniqueWords(","                    AccentFold.fold(result.text)));","","            return YArray.every(queryWords, function (word) {","                return YObject.owns(resultWords, word);","            });","        });","    }","});","","","}, '3.7.3', {\"requires\": [\"array-extras\", \"text-accentfold\", \"text-wordbreak\"]});"];
_yuitest_coverage["build/autocomplete-filters-accentfold/autocomplete-filters-accentfold.js"].lines = {"1":0,"19":0,"24":0,"35":0,"37":0,"39":0,"40":0,"42":0,"43":0,"58":0,"60":0,"62":0,"63":0,"77":0,"79":0,"81":0,"82":0,"96":0,"98":0,"100":0,"101":0,"103":0,"104":0,"119":0,"121":0,"123":0,"125":0,"128":0,"129":0};
_yuitest_coverage["build/autocomplete-filters-accentfold/autocomplete-filters-accentfold.js"].functions = {"(anonymous 3):42":0,"(anonymous 2):39":0,"charMatchFold:34":0,"(anonymous 4):62":0,"phraseMatchFold:57":0,"(anonymous 5):81":0,"startsWithFold:76":0,"(anonymous 7):103":0,"(anonymous 6):100":0,"subWordMatchFold:95":0,"(anonymous 9):128":0,"(anonymous 8):123":0,"wordMatchFold:118":0,"(anonymous 1):1":0};
_yuitest_coverage["build/autocomplete-filters-accentfold/autocomplete-filters-accentfold.js"].coveredLines = 29;
_yuitest_coverage["build/autocomplete-filters-accentfold/autocomplete-filters-accentfold.js"].coveredFunctions = 14;
_yuitest_coverline("build/autocomplete-filters-accentfold/autocomplete-filters-accentfold.js", 1);
YUI.add('autocomplete-filters-accentfold', function (Y, NAME) {

/**
Provides pre-built accent-folding result matching filters for AutoComplete.

These filters are similar to the ones provided by the `autocomplete-filters`
module, but use accent-aware comparisons. For example, "resume" and "résumé"
will be considered equal when using the accent-folding filters.

@module autocomplete
@submodule autocomplete-filters-accentfold
**/

/**
@class AutoCompleteFilters
@static
**/

_yuitest_coverfunc("build/autocomplete-filters-accentfold/autocomplete-filters-accentfold.js", "(anonymous 1)", 1);
_yuitest_coverline("build/autocomplete-filters-accentfold/autocomplete-filters-accentfold.js", 19);
var AccentFold = Y.Text.AccentFold,
    WordBreak  = Y.Text.WordBreak,
    YArray     = Y.Array,
    YObject    = Y.Object;

_yuitest_coverline("build/autocomplete-filters-accentfold/autocomplete-filters-accentfold.js", 24);
Y.mix(Y.namespace('AutoCompleteFilters'), {
    /**
    Accent folding version of `charMatch()`.

    @method charMatchFold
    @param {String} query Query to match
    @param {Array} results Results to filter
    @return {Array} Filtered results
    @static
    **/
    charMatchFold: function (query, results) {
        _yuitest_coverfunc("build/autocomplete-filters-accentfold/autocomplete-filters-accentfold.js", "charMatchFold", 34);
_yuitest_coverline("build/autocomplete-filters-accentfold/autocomplete-filters-accentfold.js", 35);
if (!query) { return results; }

        _yuitest_coverline("build/autocomplete-filters-accentfold/autocomplete-filters-accentfold.js", 37);
var queryChars = YArray.unique(AccentFold.fold(query).split(''));

        _yuitest_coverline("build/autocomplete-filters-accentfold/autocomplete-filters-accentfold.js", 39);
return YArray.filter(results, function (result) {
            _yuitest_coverfunc("build/autocomplete-filters-accentfold/autocomplete-filters-accentfold.js", "(anonymous 2)", 39);
_yuitest_coverline("build/autocomplete-filters-accentfold/autocomplete-filters-accentfold.js", 40);
var text = AccentFold.fold(result.text);

            _yuitest_coverline("build/autocomplete-filters-accentfold/autocomplete-filters-accentfold.js", 42);
return YArray.every(queryChars, function (chr) {
                _yuitest_coverfunc("build/autocomplete-filters-accentfold/autocomplete-filters-accentfold.js", "(anonymous 3)", 42);
_yuitest_coverline("build/autocomplete-filters-accentfold/autocomplete-filters-accentfold.js", 43);
return text.indexOf(chr) !== -1;
            });
        });
    },

    /**
    Accent folding version of `phraseMatch()`.

    @method phraseMatchFold
    @param {String} query Query to match
    @param {Array} results Results to filter
    @return {Array} Filtered results
    @static
    **/
    phraseMatchFold: function (query, results) {
        _yuitest_coverfunc("build/autocomplete-filters-accentfold/autocomplete-filters-accentfold.js", "phraseMatchFold", 57);
_yuitest_coverline("build/autocomplete-filters-accentfold/autocomplete-filters-accentfold.js", 58);
if (!query) { return results; }

        _yuitest_coverline("build/autocomplete-filters-accentfold/autocomplete-filters-accentfold.js", 60);
query = AccentFold.fold(query);

        _yuitest_coverline("build/autocomplete-filters-accentfold/autocomplete-filters-accentfold.js", 62);
return YArray.filter(results, function (result) {
            _yuitest_coverfunc("build/autocomplete-filters-accentfold/autocomplete-filters-accentfold.js", "(anonymous 4)", 62);
_yuitest_coverline("build/autocomplete-filters-accentfold/autocomplete-filters-accentfold.js", 63);
return AccentFold.fold(result.text).indexOf(query) !== -1;
        });
    },

    /**
    Accent folding version of `startsWith()`.

    @method startsWithFold
    @param {String} query Query to match
    @param {Array} results Results to filter
    @return {Array} Filtered results
    @static
    **/
    startsWithFold: function (query, results) {
        _yuitest_coverfunc("build/autocomplete-filters-accentfold/autocomplete-filters-accentfold.js", "startsWithFold", 76);
_yuitest_coverline("build/autocomplete-filters-accentfold/autocomplete-filters-accentfold.js", 77);
if (!query) { return results; }

        _yuitest_coverline("build/autocomplete-filters-accentfold/autocomplete-filters-accentfold.js", 79);
query = AccentFold.fold(query);

        _yuitest_coverline("build/autocomplete-filters-accentfold/autocomplete-filters-accentfold.js", 81);
return YArray.filter(results, function (result) {
            _yuitest_coverfunc("build/autocomplete-filters-accentfold/autocomplete-filters-accentfold.js", "(anonymous 5)", 81);
_yuitest_coverline("build/autocomplete-filters-accentfold/autocomplete-filters-accentfold.js", 82);
return AccentFold.fold(result.text).indexOf(query) === 0;
        });
    },

    /**
    Accent folding version of `subWordMatch()`.

    @method subWordMatchFold
    @param {String} query Query to match
    @param {Array} results Results to filter
    @return {Array} Filtered results
    @static
    **/
    subWordMatchFold: function (query, results) {
        _yuitest_coverfunc("build/autocomplete-filters-accentfold/autocomplete-filters-accentfold.js", "subWordMatchFold", 95);
_yuitest_coverline("build/autocomplete-filters-accentfold/autocomplete-filters-accentfold.js", 96);
if (!query) { return results; }

        _yuitest_coverline("build/autocomplete-filters-accentfold/autocomplete-filters-accentfold.js", 98);
var queryWords = WordBreak.getUniqueWords(AccentFold.fold(query));

        _yuitest_coverline("build/autocomplete-filters-accentfold/autocomplete-filters-accentfold.js", 100);
return YArray.filter(results, function (result) {
            _yuitest_coverfunc("build/autocomplete-filters-accentfold/autocomplete-filters-accentfold.js", "(anonymous 6)", 100);
_yuitest_coverline("build/autocomplete-filters-accentfold/autocomplete-filters-accentfold.js", 101);
var resultText = AccentFold.fold(result.text);

            _yuitest_coverline("build/autocomplete-filters-accentfold/autocomplete-filters-accentfold.js", 103);
return YArray.every(queryWords, function (queryWord) {
                _yuitest_coverfunc("build/autocomplete-filters-accentfold/autocomplete-filters-accentfold.js", "(anonymous 7)", 103);
_yuitest_coverline("build/autocomplete-filters-accentfold/autocomplete-filters-accentfold.js", 104);
return resultText.indexOf(queryWord) !== -1;
            });
        });
    },

    /**
    Accent folding version of `wordMatch()`.

    @method wordMatchFold
    @param {String} query Query to match
    @param {Array} results Results to filter
    @return {Array} Filtered results
    @static
    **/
    wordMatchFold: function (query, results) {
        _yuitest_coverfunc("build/autocomplete-filters-accentfold/autocomplete-filters-accentfold.js", "wordMatchFold", 118);
_yuitest_coverline("build/autocomplete-filters-accentfold/autocomplete-filters-accentfold.js", 119);
if (!query) { return results; }

        _yuitest_coverline("build/autocomplete-filters-accentfold/autocomplete-filters-accentfold.js", 121);
var queryWords = WordBreak.getUniqueWords(AccentFold.fold(query));

        _yuitest_coverline("build/autocomplete-filters-accentfold/autocomplete-filters-accentfold.js", 123);
return YArray.filter(results, function (result) {
            // Convert resultWords array to a hash for fast lookup.
            _yuitest_coverfunc("build/autocomplete-filters-accentfold/autocomplete-filters-accentfold.js", "(anonymous 8)", 123);
_yuitest_coverline("build/autocomplete-filters-accentfold/autocomplete-filters-accentfold.js", 125);
var resultWords = YArray.hash(WordBreak.getUniqueWords(
                    AccentFold.fold(result.text)));

            _yuitest_coverline("build/autocomplete-filters-accentfold/autocomplete-filters-accentfold.js", 128);
return YArray.every(queryWords, function (word) {
                _yuitest_coverfunc("build/autocomplete-filters-accentfold/autocomplete-filters-accentfold.js", "(anonymous 9)", 128);
_yuitest_coverline("build/autocomplete-filters-accentfold/autocomplete-filters-accentfold.js", 129);
return YObject.owns(resultWords, word);
            });
        });
    }
});


}, '3.7.3', {"requires": ["array-extras", "text-accentfold", "text-wordbreak"]});
