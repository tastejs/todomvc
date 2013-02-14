/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
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

var Highlight = Y.Highlight,
    YArray    = Y.Array;

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
        var queryChars = YArray.unique(query.split(''));

        return YArray.map(results, function (result) {
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
        return YArray.map(results, function (result) {
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
        return YArray.map(results, function (result) {
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
        var queryWords = Y.Text.WordBreak.getUniqueWords(query);

        return YArray.map(results, function (result) {
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
        return YArray.map(results, function (result) {
            return Highlight.wordsFold(result.text, query);
        });
    }
});


}, '3.7.3', {"requires": ["array-extras", "highlight-accentfold"]});
