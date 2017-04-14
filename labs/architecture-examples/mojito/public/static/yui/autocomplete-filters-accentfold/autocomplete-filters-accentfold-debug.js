/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
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

var AccentFold = Y.Text.AccentFold,
    WordBreak  = Y.Text.WordBreak,
    YArray     = Y.Array,
    YObject    = Y.Object;

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
        if (!query) { return results; }

        var queryChars = YArray.unique(AccentFold.fold(query).split(''));

        return YArray.filter(results, function (result) {
            var text = AccentFold.fold(result.text);

            return YArray.every(queryChars, function (chr) {
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
        if (!query) { return results; }

        query = AccentFold.fold(query);

        return YArray.filter(results, function (result) {
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
        if (!query) { return results; }

        query = AccentFold.fold(query);

        return YArray.filter(results, function (result) {
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
        if (!query) { return results; }

        var queryWords = WordBreak.getUniqueWords(AccentFold.fold(query));

        return YArray.filter(results, function (result) {
            var resultText = AccentFold.fold(result.text);

            return YArray.every(queryWords, function (queryWord) {
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
        if (!query) { return results; }

        var queryWords = WordBreak.getUniqueWords(AccentFold.fold(query));

        return YArray.filter(results, function (result) {
            // Convert resultWords array to a hash for fast lookup.
            var resultWords = YArray.hash(WordBreak.getUniqueWords(
                    AccentFold.fold(result.text)));

            return YArray.every(queryWords, function (word) {
                return YObject.owns(resultWords, word);
            });
        });
    }
});


}, '3.7.3', {"requires": ["array-extras", "text-accentfold", "text-wordbreak"]});
