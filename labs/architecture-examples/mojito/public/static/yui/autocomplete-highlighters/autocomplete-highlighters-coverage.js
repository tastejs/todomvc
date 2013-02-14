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
_yuitest_coverage["build/autocomplete-highlighters/autocomplete-highlighters.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/autocomplete-highlighters/autocomplete-highlighters.js",
    code: []
};
_yuitest_coverage["build/autocomplete-highlighters/autocomplete-highlighters.js"].code=["YUI.add('autocomplete-highlighters', function (Y, NAME) {","","/**","Provides pre-built result highlighters for AutoComplete.","","@module autocomplete","@submodule autocomplete-highlighters","@class AutoCompleteHighlighters","@static","**/","","var YArray    = Y.Array,","    Highlight = Y.Highlight,","","Highlighters = Y.mix(Y.namespace('AutoCompleteHighlighters'), {","    // -- Public Methods -------------------------------------------------------","","    /**","    Highlights any individual query character that occurs anywhere in a result.","    Case-insensitive.","","    @method charMatch","    @param {String} query Query to match","    @param {Array} results Results to highlight","    @return {Array} Highlighted results","    @static","    **/","    charMatch: function (query, results, caseSensitive) {","        // The caseSensitive parameter is only intended for use by","        // charMatchCase(). It's intentionally undocumented.","","        var queryChars = YArray.unique((caseSensitive ? query :","                query.toLowerCase()).split(''));","","        return YArray.map(results, function (result) {","            return Highlight.all(result.text, queryChars, {","                caseSensitive: caseSensitive","            });","        });","    },","","    /**","    Case-sensitive version of `charMatch()`.","","    @method charMatchCase","    @param {String} query Query to match","    @param {Array} results Results to highlight","    @return {Array} Highlighted results","    @static","    **/","    charMatchCase: function (query, results) {","        return Highlighters.charMatch(query, results, true);","    },","","    /**","    Highlights the complete query as a phrase anywhere within a result. Case-","    insensitive.","","    @method phraseMatch","    @param {String} query Query to match","    @param {Array} results Results to highlight","    @return {Array} Highlighted results","    @static","    **/","    phraseMatch: function (query, results, caseSensitive) {","        // The caseSensitive parameter is only intended for use by","        // phraseMatchCase(). It's intentionally undocumented.","","        return YArray.map(results, function (result) {","            return Highlight.all(result.text, [query], {","                caseSensitive: caseSensitive","            });","        });","    },","","    /**","    Case-sensitive version of `phraseMatch()`.","","    @method phraseMatchCase","    @param {String} query Query to match","    @param {Array} results Results to highlight","    @return {Array} Highlighted results","    @static","    **/","    phraseMatchCase: function (query, results) {","        return Highlighters.phraseMatch(query, results, true);","    },","","    /**","    Highlights the complete query as a phrase at the beginning of a result.","    Case-insensitive.","","    @method startsWith","    @param {String} query Query to match","    @param {Array} results Results to highlight","    @return {Array} Highlighted results","    @static","    **/","    startsWith: function (query, results, caseSensitive) {","        // The caseSensitive parameter is only intended for use by","        // startsWithCase(). It's intentionally undocumented.","","        return YArray.map(results, function (result) {","            return Highlight.all(result.text, [query], {","                caseSensitive: caseSensitive,","                startsWith   : true","            });","        });","    },","","    /**","    Case-sensitive version of `startsWith()`.","","    @method startsWithCase","    @param {String} query Query to match","    @param {Array} results Results to highlight","    @return {Array} Highlighted results","    @static","    **/","    startsWithCase: function (query, results) {","        return Highlighters.startsWith(query, results, true);","    },","","    /**","    Highlights portions of results in which words from the query match either","    whole words or parts of words in the result. Non-word characters like","    whitespace and certain punctuation are ignored. Case-insensitive.","","    @method subWordMatch","    @param {String} query Query to match","    @param {Array} results Results to highlight","    @return {Array} Highlighted results","    @static","    **/","    subWordMatch: function (query, results, caseSensitive) {","        // The caseSensitive parameter is only intended for use by","        // subWordMatchCase(). It's intentionally undocumented.","","        var queryWords = Y.Text.WordBreak.getUniqueWords(query, {","            ignoreCase: !caseSensitive","        });","","        return YArray.map(results, function (result) {","            return Highlight.all(result.text, queryWords, {","                caseSensitive: caseSensitive","            });","        });","    },","","    /**","    Case-sensitive version of `subWordMatch()`.","","    @method subWordMatchCase","    @param {String} query Query to match","    @param {Array} results Results to highlight","    @return {Array} Highlighted results","    @static","    **/","    subWordMatchCase: function (query, results) {","        return Highlighters.subWordMatch(query, results, true);","    },","","    /**","    Highlights individual words in results that are also in the query. Non-word","    characters like punctuation are ignored. Case-insensitive.","","    @method wordMatch","    @param {String} query Query to match","    @param {Array} results Results to highlight","    @return {Array} Highlighted results","    @static","    **/","    wordMatch: function (query, results, caseSensitive) {","        // The caseSensitive parameter is only intended for use by","        // wordMatchCase(). It's intentionally undocumented.","","        return YArray.map(results, function (result) {","            return Highlight.words(result.text, query, {","                caseSensitive: caseSensitive","            });","        });","    },","","    /**","    Case-sensitive version of `wordMatch()`.","","    @method wordMatchCase","    @param {String} query Query to match","    @param {Array} results Results to highlight","    @return {Array} Highlighted results","    @static","    **/","    wordMatchCase: function (query, results) {","        return Highlighters.wordMatch(query, results, true);","    }","});","","","}, '3.7.3', {\"requires\": [\"array-extras\", \"highlight-base\"]});"];
_yuitest_coverage["build/autocomplete-highlighters/autocomplete-highlighters.js"].lines = {"1":0,"12":0,"32":0,"35":0,"36":0,"52":0,"69":0,"70":0,"86":0,"103":0,"104":0,"121":0,"139":0,"143":0,"144":0,"160":0,"177":0,"178":0,"194":0};
_yuitest_coverage["build/autocomplete-highlighters/autocomplete-highlighters.js"].functions = {"(anonymous 2):35":0,"charMatch:28":0,"charMatchCase:51":0,"(anonymous 3):69":0,"phraseMatch:65":0,"phraseMatchCase:85":0,"(anonymous 4):103":0,"startsWith:99":0,"startsWithCase:120":0,"(anonymous 5):143":0,"subWordMatch:135":0,"subWordMatchCase:159":0,"(anonymous 6):177":0,"wordMatch:173":0,"wordMatchCase:193":0,"(anonymous 1):1":0};
_yuitest_coverage["build/autocomplete-highlighters/autocomplete-highlighters.js"].coveredLines = 19;
_yuitest_coverage["build/autocomplete-highlighters/autocomplete-highlighters.js"].coveredFunctions = 16;
_yuitest_coverline("build/autocomplete-highlighters/autocomplete-highlighters.js", 1);
YUI.add('autocomplete-highlighters', function (Y, NAME) {

/**
Provides pre-built result highlighters for AutoComplete.

@module autocomplete
@submodule autocomplete-highlighters
@class AutoCompleteHighlighters
@static
**/

_yuitest_coverfunc("build/autocomplete-highlighters/autocomplete-highlighters.js", "(anonymous 1)", 1);
_yuitest_coverline("build/autocomplete-highlighters/autocomplete-highlighters.js", 12);
var YArray    = Y.Array,
    Highlight = Y.Highlight,

Highlighters = Y.mix(Y.namespace('AutoCompleteHighlighters'), {
    // -- Public Methods -------------------------------------------------------

    /**
    Highlights any individual query character that occurs anywhere in a result.
    Case-insensitive.

    @method charMatch
    @param {String} query Query to match
    @param {Array} results Results to highlight
    @return {Array} Highlighted results
    @static
    **/
    charMatch: function (query, results, caseSensitive) {
        // The caseSensitive parameter is only intended for use by
        // charMatchCase(). It's intentionally undocumented.

        _yuitest_coverfunc("build/autocomplete-highlighters/autocomplete-highlighters.js", "charMatch", 28);
_yuitest_coverline("build/autocomplete-highlighters/autocomplete-highlighters.js", 32);
var queryChars = YArray.unique((caseSensitive ? query :
                query.toLowerCase()).split(''));

        _yuitest_coverline("build/autocomplete-highlighters/autocomplete-highlighters.js", 35);
return YArray.map(results, function (result) {
            _yuitest_coverfunc("build/autocomplete-highlighters/autocomplete-highlighters.js", "(anonymous 2)", 35);
_yuitest_coverline("build/autocomplete-highlighters/autocomplete-highlighters.js", 36);
return Highlight.all(result.text, queryChars, {
                caseSensitive: caseSensitive
            });
        });
    },

    /**
    Case-sensitive version of `charMatch()`.

    @method charMatchCase
    @param {String} query Query to match
    @param {Array} results Results to highlight
    @return {Array} Highlighted results
    @static
    **/
    charMatchCase: function (query, results) {
        _yuitest_coverfunc("build/autocomplete-highlighters/autocomplete-highlighters.js", "charMatchCase", 51);
_yuitest_coverline("build/autocomplete-highlighters/autocomplete-highlighters.js", 52);
return Highlighters.charMatch(query, results, true);
    },

    /**
    Highlights the complete query as a phrase anywhere within a result. Case-
    insensitive.

    @method phraseMatch
    @param {String} query Query to match
    @param {Array} results Results to highlight
    @return {Array} Highlighted results
    @static
    **/
    phraseMatch: function (query, results, caseSensitive) {
        // The caseSensitive parameter is only intended for use by
        // phraseMatchCase(). It's intentionally undocumented.

        _yuitest_coverfunc("build/autocomplete-highlighters/autocomplete-highlighters.js", "phraseMatch", 65);
_yuitest_coverline("build/autocomplete-highlighters/autocomplete-highlighters.js", 69);
return YArray.map(results, function (result) {
            _yuitest_coverfunc("build/autocomplete-highlighters/autocomplete-highlighters.js", "(anonymous 3)", 69);
_yuitest_coverline("build/autocomplete-highlighters/autocomplete-highlighters.js", 70);
return Highlight.all(result.text, [query], {
                caseSensitive: caseSensitive
            });
        });
    },

    /**
    Case-sensitive version of `phraseMatch()`.

    @method phraseMatchCase
    @param {String} query Query to match
    @param {Array} results Results to highlight
    @return {Array} Highlighted results
    @static
    **/
    phraseMatchCase: function (query, results) {
        _yuitest_coverfunc("build/autocomplete-highlighters/autocomplete-highlighters.js", "phraseMatchCase", 85);
_yuitest_coverline("build/autocomplete-highlighters/autocomplete-highlighters.js", 86);
return Highlighters.phraseMatch(query, results, true);
    },

    /**
    Highlights the complete query as a phrase at the beginning of a result.
    Case-insensitive.

    @method startsWith
    @param {String} query Query to match
    @param {Array} results Results to highlight
    @return {Array} Highlighted results
    @static
    **/
    startsWith: function (query, results, caseSensitive) {
        // The caseSensitive parameter is only intended for use by
        // startsWithCase(). It's intentionally undocumented.

        _yuitest_coverfunc("build/autocomplete-highlighters/autocomplete-highlighters.js", "startsWith", 99);
_yuitest_coverline("build/autocomplete-highlighters/autocomplete-highlighters.js", 103);
return YArray.map(results, function (result) {
            _yuitest_coverfunc("build/autocomplete-highlighters/autocomplete-highlighters.js", "(anonymous 4)", 103);
_yuitest_coverline("build/autocomplete-highlighters/autocomplete-highlighters.js", 104);
return Highlight.all(result.text, [query], {
                caseSensitive: caseSensitive,
                startsWith   : true
            });
        });
    },

    /**
    Case-sensitive version of `startsWith()`.

    @method startsWithCase
    @param {String} query Query to match
    @param {Array} results Results to highlight
    @return {Array} Highlighted results
    @static
    **/
    startsWithCase: function (query, results) {
        _yuitest_coverfunc("build/autocomplete-highlighters/autocomplete-highlighters.js", "startsWithCase", 120);
_yuitest_coverline("build/autocomplete-highlighters/autocomplete-highlighters.js", 121);
return Highlighters.startsWith(query, results, true);
    },

    /**
    Highlights portions of results in which words from the query match either
    whole words or parts of words in the result. Non-word characters like
    whitespace and certain punctuation are ignored. Case-insensitive.

    @method subWordMatch
    @param {String} query Query to match
    @param {Array} results Results to highlight
    @return {Array} Highlighted results
    @static
    **/
    subWordMatch: function (query, results, caseSensitive) {
        // The caseSensitive parameter is only intended for use by
        // subWordMatchCase(). It's intentionally undocumented.

        _yuitest_coverfunc("build/autocomplete-highlighters/autocomplete-highlighters.js", "subWordMatch", 135);
_yuitest_coverline("build/autocomplete-highlighters/autocomplete-highlighters.js", 139);
var queryWords = Y.Text.WordBreak.getUniqueWords(query, {
            ignoreCase: !caseSensitive
        });

        _yuitest_coverline("build/autocomplete-highlighters/autocomplete-highlighters.js", 143);
return YArray.map(results, function (result) {
            _yuitest_coverfunc("build/autocomplete-highlighters/autocomplete-highlighters.js", "(anonymous 5)", 143);
_yuitest_coverline("build/autocomplete-highlighters/autocomplete-highlighters.js", 144);
return Highlight.all(result.text, queryWords, {
                caseSensitive: caseSensitive
            });
        });
    },

    /**
    Case-sensitive version of `subWordMatch()`.

    @method subWordMatchCase
    @param {String} query Query to match
    @param {Array} results Results to highlight
    @return {Array} Highlighted results
    @static
    **/
    subWordMatchCase: function (query, results) {
        _yuitest_coverfunc("build/autocomplete-highlighters/autocomplete-highlighters.js", "subWordMatchCase", 159);
_yuitest_coverline("build/autocomplete-highlighters/autocomplete-highlighters.js", 160);
return Highlighters.subWordMatch(query, results, true);
    },

    /**
    Highlights individual words in results that are also in the query. Non-word
    characters like punctuation are ignored. Case-insensitive.

    @method wordMatch
    @param {String} query Query to match
    @param {Array} results Results to highlight
    @return {Array} Highlighted results
    @static
    **/
    wordMatch: function (query, results, caseSensitive) {
        // The caseSensitive parameter is only intended for use by
        // wordMatchCase(). It's intentionally undocumented.

        _yuitest_coverfunc("build/autocomplete-highlighters/autocomplete-highlighters.js", "wordMatch", 173);
_yuitest_coverline("build/autocomplete-highlighters/autocomplete-highlighters.js", 177);
return YArray.map(results, function (result) {
            _yuitest_coverfunc("build/autocomplete-highlighters/autocomplete-highlighters.js", "(anonymous 6)", 177);
_yuitest_coverline("build/autocomplete-highlighters/autocomplete-highlighters.js", 178);
return Highlight.words(result.text, query, {
                caseSensitive: caseSensitive
            });
        });
    },

    /**
    Case-sensitive version of `wordMatch()`.

    @method wordMatchCase
    @param {String} query Query to match
    @param {Array} results Results to highlight
    @return {Array} Highlighted results
    @static
    **/
    wordMatchCase: function (query, results) {
        _yuitest_coverfunc("build/autocomplete-highlighters/autocomplete-highlighters.js", "wordMatchCase", 193);
_yuitest_coverline("build/autocomplete-highlighters/autocomplete-highlighters.js", 194);
return Highlighters.wordMatch(query, results, true);
    }
});


}, '3.7.3', {"requires": ["array-extras", "highlight-base"]});
