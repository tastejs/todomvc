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
_yuitest_coverage["build/autocomplete-highlighters-accentfold/autocomplete-highlighters-accentfold.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/autocomplete-highlighters-accentfold/autocomplete-highlighters-accentfold.js",
    code: []
};
_yuitest_coverage["build/autocomplete-highlighters-accentfold/autocomplete-highlighters-accentfold.js"].code=["YUI.add('autocomplete-highlighters-accentfold', function (Y, NAME) {","","/**","Provides pre-built accent-folding result highlighters for AutoComplete.","","These highlighters are similar to the ones provided by the `autocomplete-","highlighters` module, but use accent-aware comparisons. For example, \"resume\"","and \"résumé\" will be considered equal when using the accent-folding","highlighters.","","@module autocomplete","@submodule autocomplete-highlighters-accentfold","**/","","/**","@class AutoCompleteHighlighters","@static","**/","","var Highlight = Y.Highlight,","    YArray    = Y.Array;","","Y.mix(Y.namespace('AutoCompleteHighlighters'), {","    /**","    Accent-folding version of `charMatch()`.","","    @method charMatchFold","    @param {String} query Query to match","    @param {Array} results Results to highlight","    @return {Array} Highlighted results","    @static","    **/","    charMatchFold: function (query, results) {","        var queryChars = YArray.unique(query.split(''));","","        return YArray.map(results, function (result) {","            return Highlight.allFold(result.text, queryChars);","        });","    },","","    /**","    Accent-folding version of `phraseMatch()`.","","    @method phraseMatchFold","    @param {String} query Query to match","    @param {Array} results Results to highlight","    @return {Array} Highlighted results","    @static","    **/","    phraseMatchFold: function (query, results) {","        return YArray.map(results, function (result) {","            return Highlight.allFold(result.text, [query]);","        });","    },","","    /**","    Accent-folding version of `startsWith()`.","","    @method startsWithFold","    @param {String} query Query to match","    @param {Array} results Results to highlight","    @return {Array} Highlighted results","    @static","    **/","    startsWithFold: function (query, results) {","        return YArray.map(results, function (result) {","            return Highlight.allFold(result.text, [query], {","                startsWith: true","            });","        });","    },","","    /**","    Accent-folding version of `subWordMatch()`.","","    @method subWordMatchFold","    @param {String} query Query to match","    @param {Array} results Results to highlight","    @return {Array} Highlighted results","    @static","    **/","    subWordMatchFold: function (query, results) {","        var queryWords = Y.Text.WordBreak.getUniqueWords(query);","","        return YArray.map(results, function (result) {","            return Highlight.allFold(result.text, queryWords);","        });","    },","","    /**","    Accent-folding version of `wordMatch()`.","","    @method wordMatchFold","    @param {String} query Query to match","    @param {Array} results Results to highlight","    @return {Array} Highlighted results","    @static","    **/","    wordMatchFold: function (query, results) {","        return YArray.map(results, function (result) {","            return Highlight.wordsFold(result.text, query);","        });","    }","});","","","}, '3.7.3', {\"requires\": [\"array-extras\", \"highlight-accentfold\"]});"];
_yuitest_coverage["build/autocomplete-highlighters-accentfold/autocomplete-highlighters-accentfold.js"].lines = {"1":0,"20":0,"23":0,"34":0,"36":0,"37":0,"51":0,"52":0,"66":0,"67":0,"83":0,"85":0,"86":0,"100":0,"101":0};
_yuitest_coverage["build/autocomplete-highlighters-accentfold/autocomplete-highlighters-accentfold.js"].functions = {"(anonymous 2):36":0,"charMatchFold:33":0,"(anonymous 3):51":0,"phraseMatchFold:50":0,"(anonymous 4):66":0,"startsWithFold:65":0,"(anonymous 5):85":0,"subWordMatchFold:82":0,"(anonymous 6):100":0,"wordMatchFold:99":0,"(anonymous 1):1":0};
_yuitest_coverage["build/autocomplete-highlighters-accentfold/autocomplete-highlighters-accentfold.js"].coveredLines = 15;
_yuitest_coverage["build/autocomplete-highlighters-accentfold/autocomplete-highlighters-accentfold.js"].coveredFunctions = 11;
_yuitest_coverline("build/autocomplete-highlighters-accentfold/autocomplete-highlighters-accentfold.js", 1);
YUI.add('autocomplete-highlighters-accentfold', function (Y, NAME) {

/**
Provides pre-built accent-folding result highlighters for AutoComplete.

These highlighters are similar to the ones provided by the `autocomplete-
highlighters` module, but use accent-aware comparisons. For example, "resume"
and "résumé" will be considered equal when using the accent-folding
highlighters.

@module autocomplete
@submodule autocomplete-highlighters-accentfold
**/

/**
@class AutoCompleteHighlighters
@static
**/

_yuitest_coverfunc("build/autocomplete-highlighters-accentfold/autocomplete-highlighters-accentfold.js", "(anonymous 1)", 1);
_yuitest_coverline("build/autocomplete-highlighters-accentfold/autocomplete-highlighters-accentfold.js", 20);
var Highlight = Y.Highlight,
    YArray    = Y.Array;

_yuitest_coverline("build/autocomplete-highlighters-accentfold/autocomplete-highlighters-accentfold.js", 23);
Y.mix(Y.namespace('AutoCompleteHighlighters'), {
    /**
    Accent-folding version of `charMatch()`.

    @method charMatchFold
    @param {String} query Query to match
    @param {Array} results Results to highlight
    @return {Array} Highlighted results
    @static
    **/
    charMatchFold: function (query, results) {
        _yuitest_coverfunc("build/autocomplete-highlighters-accentfold/autocomplete-highlighters-accentfold.js", "charMatchFold", 33);
_yuitest_coverline("build/autocomplete-highlighters-accentfold/autocomplete-highlighters-accentfold.js", 34);
var queryChars = YArray.unique(query.split(''));

        _yuitest_coverline("build/autocomplete-highlighters-accentfold/autocomplete-highlighters-accentfold.js", 36);
return YArray.map(results, function (result) {
            _yuitest_coverfunc("build/autocomplete-highlighters-accentfold/autocomplete-highlighters-accentfold.js", "(anonymous 2)", 36);
_yuitest_coverline("build/autocomplete-highlighters-accentfold/autocomplete-highlighters-accentfold.js", 37);
return Highlight.allFold(result.text, queryChars);
        });
    },

    /**
    Accent-folding version of `phraseMatch()`.

    @method phraseMatchFold
    @param {String} query Query to match
    @param {Array} results Results to highlight
    @return {Array} Highlighted results
    @static
    **/
    phraseMatchFold: function (query, results) {
        _yuitest_coverfunc("build/autocomplete-highlighters-accentfold/autocomplete-highlighters-accentfold.js", "phraseMatchFold", 50);
_yuitest_coverline("build/autocomplete-highlighters-accentfold/autocomplete-highlighters-accentfold.js", 51);
return YArray.map(results, function (result) {
            _yuitest_coverfunc("build/autocomplete-highlighters-accentfold/autocomplete-highlighters-accentfold.js", "(anonymous 3)", 51);
_yuitest_coverline("build/autocomplete-highlighters-accentfold/autocomplete-highlighters-accentfold.js", 52);
return Highlight.allFold(result.text, [query]);
        });
    },

    /**
    Accent-folding version of `startsWith()`.

    @method startsWithFold
    @param {String} query Query to match
    @param {Array} results Results to highlight
    @return {Array} Highlighted results
    @static
    **/
    startsWithFold: function (query, results) {
        _yuitest_coverfunc("build/autocomplete-highlighters-accentfold/autocomplete-highlighters-accentfold.js", "startsWithFold", 65);
_yuitest_coverline("build/autocomplete-highlighters-accentfold/autocomplete-highlighters-accentfold.js", 66);
return YArray.map(results, function (result) {
            _yuitest_coverfunc("build/autocomplete-highlighters-accentfold/autocomplete-highlighters-accentfold.js", "(anonymous 4)", 66);
_yuitest_coverline("build/autocomplete-highlighters-accentfold/autocomplete-highlighters-accentfold.js", 67);
return Highlight.allFold(result.text, [query], {
                startsWith: true
            });
        });
    },

    /**
    Accent-folding version of `subWordMatch()`.

    @method subWordMatchFold
    @param {String} query Query to match
    @param {Array} results Results to highlight
    @return {Array} Highlighted results
    @static
    **/
    subWordMatchFold: function (query, results) {
        _yuitest_coverfunc("build/autocomplete-highlighters-accentfold/autocomplete-highlighters-accentfold.js", "subWordMatchFold", 82);
_yuitest_coverline("build/autocomplete-highlighters-accentfold/autocomplete-highlighters-accentfold.js", 83);
var queryWords = Y.Text.WordBreak.getUniqueWords(query);

        _yuitest_coverline("build/autocomplete-highlighters-accentfold/autocomplete-highlighters-accentfold.js", 85);
return YArray.map(results, function (result) {
            _yuitest_coverfunc("build/autocomplete-highlighters-accentfold/autocomplete-highlighters-accentfold.js", "(anonymous 5)", 85);
_yuitest_coverline("build/autocomplete-highlighters-accentfold/autocomplete-highlighters-accentfold.js", 86);
return Highlight.allFold(result.text, queryWords);
        });
    },

    /**
    Accent-folding version of `wordMatch()`.

    @method wordMatchFold
    @param {String} query Query to match
    @param {Array} results Results to highlight
    @return {Array} Highlighted results
    @static
    **/
    wordMatchFold: function (query, results) {
        _yuitest_coverfunc("build/autocomplete-highlighters-accentfold/autocomplete-highlighters-accentfold.js", "wordMatchFold", 99);
_yuitest_coverline("build/autocomplete-highlighters-accentfold/autocomplete-highlighters-accentfold.js", 100);
return YArray.map(results, function (result) {
            _yuitest_coverfunc("build/autocomplete-highlighters-accentfold/autocomplete-highlighters-accentfold.js", "(anonymous 6)", 100);
_yuitest_coverline("build/autocomplete-highlighters-accentfold/autocomplete-highlighters-accentfold.js", 101);
return Highlight.wordsFold(result.text, query);
        });
    }
});


}, '3.7.3', {"requires": ["array-extras", "highlight-accentfold"]});
