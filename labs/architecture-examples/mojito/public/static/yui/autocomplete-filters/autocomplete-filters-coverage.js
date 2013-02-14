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
_yuitest_coverage["build/autocomplete-filters/autocomplete-filters.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/autocomplete-filters/autocomplete-filters.js",
    code: []
};
_yuitest_coverage["build/autocomplete-filters/autocomplete-filters.js"].code=["YUI.add('autocomplete-filters', function (Y, NAME) {","","/**","Provides pre-built result matching filters for AutoComplete.","","@module autocomplete","@submodule autocomplete-filters","@class AutoCompleteFilters","@static","**/","","var YArray     = Y.Array,","    YObject    = Y.Object,","    WordBreak  = Y.Text.WordBreak,","","Filters = Y.mix(Y.namespace('AutoCompleteFilters'), {","    // -- Public Methods -------------------------------------------------------","","    /**","    Returns an array of results that contain all of the characters in the query,","    in any order (not necessarily consecutive). Case-insensitive.","","    @method charMatch","    @param {String} query Query to match","    @param {Array} results Results to filter","    @return {Array} Filtered results","    @static","    **/","    charMatch: function (query, results, caseSensitive) {","        // The caseSensitive parameter is only intended for use by","        // charMatchCase(). It's intentionally undocumented.","","        if (!query) { return results; }","","        var queryChars = YArray.unique((caseSensitive ? query :","                query.toLowerCase()).split(''));","","        return YArray.filter(results, function (result) {","            result = result.text;","","            if (!caseSensitive) {","                result = result.toLowerCase();","            }","","            return YArray.every(queryChars, function (chr) {","                return result.indexOf(chr) !== -1;","            });","        });","    },","","    /**","    Case-sensitive version of `charMatch()`.","","    @method charMatchCase","    @param {String} query Query to match","    @param {Array} results Results to filter","    @return {Array} Filtered results","    @static","    **/","    charMatchCase: function (query, results) {","        return Filters.charMatch(query, results, true);","    },","","    /**","    Returns an array of results that contain the complete query as a phrase.","    Case-insensitive.","","    @method phraseMatch","    @param {String} query Query to match","    @param {Array} results Results to filter","    @return {Array} Filtered results","    @static","    **/","    phraseMatch: function (query, results, caseSensitive) {","        // The caseSensitive parameter is only intended for use by","        // phraseMatchCase(). It's intentionally undocumented.","","        if (!query) { return results; }","","        if (!caseSensitive) {","            query = query.toLowerCase();","        }","","        return YArray.filter(results, function (result) {","            return (caseSensitive ? result.text : result.text.toLowerCase()).indexOf(query) !== -1;","        });","    },","","    /**","    Case-sensitive version of `phraseMatch()`.","","    @method phraseMatchCase","    @param {String} query Query to match","    @param {Array} results Results to filter","    @return {Array} Filtered results","    @static","    **/","    phraseMatchCase: function (query, results) {","        return Filters.phraseMatch(query, results, true);","    },","","    /**","    Returns an array of results that start with the complete query as a phrase.","    Case-insensitive.","","    @method startsWith","    @param {String} query Query to match","    @param {Array} results Results to filter","    @return {Array} Filtered results","    @static","    **/","    startsWith: function (query, results, caseSensitive) {","        // The caseSensitive parameter is only intended for use by","        // startsWithCase(). It's intentionally undocumented.","","        if (!query) { return results; }","","        if (!caseSensitive) {","            query = query.toLowerCase();","        }","","        return YArray.filter(results, function (result) {","            return (caseSensitive ? result.text : result.text.toLowerCase()).indexOf(query) === 0;","        });","    },","","    /**","    Case-sensitive version of `startsWith()`.","","    @method startsWithCase","    @param {String} query Query to match","    @param {Array} results Results to filter","    @return {Array} Filtered results","    @static","    **/","    startsWithCase: function (query, results) {","        return Filters.startsWith(query, results, true);","    },","","    /**","    Returns an array of results in which all the words of the query match either","    whole words or parts of words in the result. Non-word characters like","    whitespace and certain punctuation are ignored. Case-insensitive.","","    This is basically a combination of `wordMatch()` (by ignoring whitespace and","    word order) and `phraseMatch()` (by allowing partial matching instead of","    requiring the entire word to match).","","    Example use case: Trying to find personal names independently of name order","    (Western or Eastern order) and supporting immediate feedback by allowing","    partial occurences. So queries like \"J. Doe\", \"Doe, John\", and \"J. D.\" would","    all match \"John Doe\".","","    @method subWordMatch","    @param {String} query Query to match","    @param {Array} results Results to filter","    @return {Array} Filtered results","    @static","    **/","    subWordMatch: function (query, results, caseSensitive) {","        // The caseSensitive parameter is only intended for use by","        // subWordMatchCase(). It's intentionally undocumented.","","        if (!query) { return results; }","","        var queryWords = WordBreak.getUniqueWords(query, {","            ignoreCase: !caseSensitive","        });","","        return YArray.filter(results, function (result) {","            var resultText = caseSensitive ? result.text :","                    result.text.toLowerCase();","","            return YArray.every(queryWords, function (queryWord) {","                return resultText.indexOf(queryWord) !== -1;","            });","        });","    },","","    /**","    Case-sensitive version of `subWordMatch()`.","","    @method subWordMatchCase","    @param {String} query Query to match","    @param {Array} results Results to filter","    @return {Array} Filtered results","    @static","    **/","    subWordMatchCase: function (query, results) {","        return Filters.subWordMatch(query, results, true);","    },","","    /**","    Returns an array of results that contain all of the words in the query, in","    any order. Non-word characters like whitespace and certain punctuation are","    ignored. Case-insensitive.","","    @method wordMatch","    @param {String} query Query to match","    @param {Array} results Results to filter","    @return {Array} Filtered results","    @static","    **/","    wordMatch: function (query, results, caseSensitive) {","        // The caseSensitive parameter is only intended for use by","        // wordMatchCase(). It's intentionally undocumented.","","        if (!query) { return results; }","","        var options    = {ignoreCase: !caseSensitive},","            queryWords = WordBreak.getUniqueWords(query, options);","","        return YArray.filter(results, function (result) {","            // Convert resultWords array to a hash for fast lookup.","            var resultWords = YArray.hash(WordBreak.getUniqueWords(result.text,","                                options));","","            return YArray.every(queryWords, function (word) {","                return YObject.owns(resultWords, word);","            });","        });","    },","","    /**","    Case-sensitive version of `wordMatch()`.","","    @method wordMatchCase","    @param {String} query Query to match","    @param {Array} results Results to filter","    @return {Array} Filtered results","    @static","    **/","    wordMatchCase: function (query, results) {","        return Filters.wordMatch(query, results, true);","    }","});","","","}, '3.7.3', {\"requires\": [\"array-extras\", \"text-wordbreak\"]});"];
_yuitest_coverage["build/autocomplete-filters/autocomplete-filters.js"].lines = {"1":0,"12":0,"33":0,"35":0,"38":0,"39":0,"41":0,"42":0,"45":0,"46":0,"61":0,"78":0,"80":0,"81":0,"84":0,"85":0,"99":0,"116":0,"118":0,"119":0,"122":0,"123":0,"137":0,"164":0,"166":0,"170":0,"171":0,"174":0,"175":0,"190":0,"208":0,"210":0,"213":0,"215":0,"218":0,"219":0,"234":0};
_yuitest_coverage["build/autocomplete-filters/autocomplete-filters.js"].functions = {"(anonymous 3):45":0,"(anonymous 2):38":0,"charMatch:29":0,"charMatchCase:60":0,"(anonymous 4):84":0,"phraseMatch:74":0,"phraseMatchCase:98":0,"(anonymous 5):122":0,"startsWith:112":0,"startsWithCase:136":0,"(anonymous 7):174":0,"(anonymous 6):170":0,"subWordMatch:160":0,"subWordMatchCase:189":0,"(anonymous 9):218":0,"(anonymous 8):213":0,"wordMatch:204":0,"wordMatchCase:233":0,"(anonymous 1):1":0};
_yuitest_coverage["build/autocomplete-filters/autocomplete-filters.js"].coveredLines = 37;
_yuitest_coverage["build/autocomplete-filters/autocomplete-filters.js"].coveredFunctions = 19;
_yuitest_coverline("build/autocomplete-filters/autocomplete-filters.js", 1);
YUI.add('autocomplete-filters', function (Y, NAME) {

/**
Provides pre-built result matching filters for AutoComplete.

@module autocomplete
@submodule autocomplete-filters
@class AutoCompleteFilters
@static
**/

_yuitest_coverfunc("build/autocomplete-filters/autocomplete-filters.js", "(anonymous 1)", 1);
_yuitest_coverline("build/autocomplete-filters/autocomplete-filters.js", 12);
var YArray     = Y.Array,
    YObject    = Y.Object,
    WordBreak  = Y.Text.WordBreak,

Filters = Y.mix(Y.namespace('AutoCompleteFilters'), {
    // -- Public Methods -------------------------------------------------------

    /**
    Returns an array of results that contain all of the characters in the query,
    in any order (not necessarily consecutive). Case-insensitive.

    @method charMatch
    @param {String} query Query to match
    @param {Array} results Results to filter
    @return {Array} Filtered results
    @static
    **/
    charMatch: function (query, results, caseSensitive) {
        // The caseSensitive parameter is only intended for use by
        // charMatchCase(). It's intentionally undocumented.

        _yuitest_coverfunc("build/autocomplete-filters/autocomplete-filters.js", "charMatch", 29);
_yuitest_coverline("build/autocomplete-filters/autocomplete-filters.js", 33);
if (!query) { return results; }

        _yuitest_coverline("build/autocomplete-filters/autocomplete-filters.js", 35);
var queryChars = YArray.unique((caseSensitive ? query :
                query.toLowerCase()).split(''));

        _yuitest_coverline("build/autocomplete-filters/autocomplete-filters.js", 38);
return YArray.filter(results, function (result) {
            _yuitest_coverfunc("build/autocomplete-filters/autocomplete-filters.js", "(anonymous 2)", 38);
_yuitest_coverline("build/autocomplete-filters/autocomplete-filters.js", 39);
result = result.text;

            _yuitest_coverline("build/autocomplete-filters/autocomplete-filters.js", 41);
if (!caseSensitive) {
                _yuitest_coverline("build/autocomplete-filters/autocomplete-filters.js", 42);
result = result.toLowerCase();
            }

            _yuitest_coverline("build/autocomplete-filters/autocomplete-filters.js", 45);
return YArray.every(queryChars, function (chr) {
                _yuitest_coverfunc("build/autocomplete-filters/autocomplete-filters.js", "(anonymous 3)", 45);
_yuitest_coverline("build/autocomplete-filters/autocomplete-filters.js", 46);
return result.indexOf(chr) !== -1;
            });
        });
    },

    /**
    Case-sensitive version of `charMatch()`.

    @method charMatchCase
    @param {String} query Query to match
    @param {Array} results Results to filter
    @return {Array} Filtered results
    @static
    **/
    charMatchCase: function (query, results) {
        _yuitest_coverfunc("build/autocomplete-filters/autocomplete-filters.js", "charMatchCase", 60);
_yuitest_coverline("build/autocomplete-filters/autocomplete-filters.js", 61);
return Filters.charMatch(query, results, true);
    },

    /**
    Returns an array of results that contain the complete query as a phrase.
    Case-insensitive.

    @method phraseMatch
    @param {String} query Query to match
    @param {Array} results Results to filter
    @return {Array} Filtered results
    @static
    **/
    phraseMatch: function (query, results, caseSensitive) {
        // The caseSensitive parameter is only intended for use by
        // phraseMatchCase(). It's intentionally undocumented.

        _yuitest_coverfunc("build/autocomplete-filters/autocomplete-filters.js", "phraseMatch", 74);
_yuitest_coverline("build/autocomplete-filters/autocomplete-filters.js", 78);
if (!query) { return results; }

        _yuitest_coverline("build/autocomplete-filters/autocomplete-filters.js", 80);
if (!caseSensitive) {
            _yuitest_coverline("build/autocomplete-filters/autocomplete-filters.js", 81);
query = query.toLowerCase();
        }

        _yuitest_coverline("build/autocomplete-filters/autocomplete-filters.js", 84);
return YArray.filter(results, function (result) {
            _yuitest_coverfunc("build/autocomplete-filters/autocomplete-filters.js", "(anonymous 4)", 84);
_yuitest_coverline("build/autocomplete-filters/autocomplete-filters.js", 85);
return (caseSensitive ? result.text : result.text.toLowerCase()).indexOf(query) !== -1;
        });
    },

    /**
    Case-sensitive version of `phraseMatch()`.

    @method phraseMatchCase
    @param {String} query Query to match
    @param {Array} results Results to filter
    @return {Array} Filtered results
    @static
    **/
    phraseMatchCase: function (query, results) {
        _yuitest_coverfunc("build/autocomplete-filters/autocomplete-filters.js", "phraseMatchCase", 98);
_yuitest_coverline("build/autocomplete-filters/autocomplete-filters.js", 99);
return Filters.phraseMatch(query, results, true);
    },

    /**
    Returns an array of results that start with the complete query as a phrase.
    Case-insensitive.

    @method startsWith
    @param {String} query Query to match
    @param {Array} results Results to filter
    @return {Array} Filtered results
    @static
    **/
    startsWith: function (query, results, caseSensitive) {
        // The caseSensitive parameter is only intended for use by
        // startsWithCase(). It's intentionally undocumented.

        _yuitest_coverfunc("build/autocomplete-filters/autocomplete-filters.js", "startsWith", 112);
_yuitest_coverline("build/autocomplete-filters/autocomplete-filters.js", 116);
if (!query) { return results; }

        _yuitest_coverline("build/autocomplete-filters/autocomplete-filters.js", 118);
if (!caseSensitive) {
            _yuitest_coverline("build/autocomplete-filters/autocomplete-filters.js", 119);
query = query.toLowerCase();
        }

        _yuitest_coverline("build/autocomplete-filters/autocomplete-filters.js", 122);
return YArray.filter(results, function (result) {
            _yuitest_coverfunc("build/autocomplete-filters/autocomplete-filters.js", "(anonymous 5)", 122);
_yuitest_coverline("build/autocomplete-filters/autocomplete-filters.js", 123);
return (caseSensitive ? result.text : result.text.toLowerCase()).indexOf(query) === 0;
        });
    },

    /**
    Case-sensitive version of `startsWith()`.

    @method startsWithCase
    @param {String} query Query to match
    @param {Array} results Results to filter
    @return {Array} Filtered results
    @static
    **/
    startsWithCase: function (query, results) {
        _yuitest_coverfunc("build/autocomplete-filters/autocomplete-filters.js", "startsWithCase", 136);
_yuitest_coverline("build/autocomplete-filters/autocomplete-filters.js", 137);
return Filters.startsWith(query, results, true);
    },

    /**
    Returns an array of results in which all the words of the query match either
    whole words or parts of words in the result. Non-word characters like
    whitespace and certain punctuation are ignored. Case-insensitive.

    This is basically a combination of `wordMatch()` (by ignoring whitespace and
    word order) and `phraseMatch()` (by allowing partial matching instead of
    requiring the entire word to match).

    Example use case: Trying to find personal names independently of name order
    (Western or Eastern order) and supporting immediate feedback by allowing
    partial occurences. So queries like "J. Doe", "Doe, John", and "J. D." would
    all match "John Doe".

    @method subWordMatch
    @param {String} query Query to match
    @param {Array} results Results to filter
    @return {Array} Filtered results
    @static
    **/
    subWordMatch: function (query, results, caseSensitive) {
        // The caseSensitive parameter is only intended for use by
        // subWordMatchCase(). It's intentionally undocumented.

        _yuitest_coverfunc("build/autocomplete-filters/autocomplete-filters.js", "subWordMatch", 160);
_yuitest_coverline("build/autocomplete-filters/autocomplete-filters.js", 164);
if (!query) { return results; }

        _yuitest_coverline("build/autocomplete-filters/autocomplete-filters.js", 166);
var queryWords = WordBreak.getUniqueWords(query, {
            ignoreCase: !caseSensitive
        });

        _yuitest_coverline("build/autocomplete-filters/autocomplete-filters.js", 170);
return YArray.filter(results, function (result) {
            _yuitest_coverfunc("build/autocomplete-filters/autocomplete-filters.js", "(anonymous 6)", 170);
_yuitest_coverline("build/autocomplete-filters/autocomplete-filters.js", 171);
var resultText = caseSensitive ? result.text :
                    result.text.toLowerCase();

            _yuitest_coverline("build/autocomplete-filters/autocomplete-filters.js", 174);
return YArray.every(queryWords, function (queryWord) {
                _yuitest_coverfunc("build/autocomplete-filters/autocomplete-filters.js", "(anonymous 7)", 174);
_yuitest_coverline("build/autocomplete-filters/autocomplete-filters.js", 175);
return resultText.indexOf(queryWord) !== -1;
            });
        });
    },

    /**
    Case-sensitive version of `subWordMatch()`.

    @method subWordMatchCase
    @param {String} query Query to match
    @param {Array} results Results to filter
    @return {Array} Filtered results
    @static
    **/
    subWordMatchCase: function (query, results) {
        _yuitest_coverfunc("build/autocomplete-filters/autocomplete-filters.js", "subWordMatchCase", 189);
_yuitest_coverline("build/autocomplete-filters/autocomplete-filters.js", 190);
return Filters.subWordMatch(query, results, true);
    },

    /**
    Returns an array of results that contain all of the words in the query, in
    any order. Non-word characters like whitespace and certain punctuation are
    ignored. Case-insensitive.

    @method wordMatch
    @param {String} query Query to match
    @param {Array} results Results to filter
    @return {Array} Filtered results
    @static
    **/
    wordMatch: function (query, results, caseSensitive) {
        // The caseSensitive parameter is only intended for use by
        // wordMatchCase(). It's intentionally undocumented.

        _yuitest_coverfunc("build/autocomplete-filters/autocomplete-filters.js", "wordMatch", 204);
_yuitest_coverline("build/autocomplete-filters/autocomplete-filters.js", 208);
if (!query) { return results; }

        _yuitest_coverline("build/autocomplete-filters/autocomplete-filters.js", 210);
var options    = {ignoreCase: !caseSensitive},
            queryWords = WordBreak.getUniqueWords(query, options);

        _yuitest_coverline("build/autocomplete-filters/autocomplete-filters.js", 213);
return YArray.filter(results, function (result) {
            // Convert resultWords array to a hash for fast lookup.
            _yuitest_coverfunc("build/autocomplete-filters/autocomplete-filters.js", "(anonymous 8)", 213);
_yuitest_coverline("build/autocomplete-filters/autocomplete-filters.js", 215);
var resultWords = YArray.hash(WordBreak.getUniqueWords(result.text,
                                options));

            _yuitest_coverline("build/autocomplete-filters/autocomplete-filters.js", 218);
return YArray.every(queryWords, function (word) {
                _yuitest_coverfunc("build/autocomplete-filters/autocomplete-filters.js", "(anonymous 9)", 218);
_yuitest_coverline("build/autocomplete-filters/autocomplete-filters.js", 219);
return YObject.owns(resultWords, word);
            });
        });
    },

    /**
    Case-sensitive version of `wordMatch()`.

    @method wordMatchCase
    @param {String} query Query to match
    @param {Array} results Results to filter
    @return {Array} Filtered results
    @static
    **/
    wordMatchCase: function (query, results) {
        _yuitest_coverfunc("build/autocomplete-filters/autocomplete-filters.js", "wordMatchCase", 233);
_yuitest_coverline("build/autocomplete-filters/autocomplete-filters.js", 234);
return Filters.wordMatch(query, results, true);
    }
});


}, '3.7.3', {"requires": ["array-extras", "text-wordbreak"]});
