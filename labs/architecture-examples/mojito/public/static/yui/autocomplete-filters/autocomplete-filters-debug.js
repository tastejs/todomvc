/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('autocomplete-filters', function (Y, NAME) {

/**
Provides pre-built result matching filters for AutoComplete.

@module autocomplete
@submodule autocomplete-filters
@class AutoCompleteFilters
@static
**/

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

        if (!query) { return results; }

        var queryChars = YArray.unique((caseSensitive ? query :
                query.toLowerCase()).split(''));

        return YArray.filter(results, function (result) {
            result = result.text;

            if (!caseSensitive) {
                result = result.toLowerCase();
            }

            return YArray.every(queryChars, function (chr) {
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

        if (!query) { return results; }

        if (!caseSensitive) {
            query = query.toLowerCase();
        }

        return YArray.filter(results, function (result) {
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

        if (!query) { return results; }

        if (!caseSensitive) {
            query = query.toLowerCase();
        }

        return YArray.filter(results, function (result) {
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

        if (!query) { return results; }

        var queryWords = WordBreak.getUniqueWords(query, {
            ignoreCase: !caseSensitive
        });

        return YArray.filter(results, function (result) {
            var resultText = caseSensitive ? result.text :
                    result.text.toLowerCase();

            return YArray.every(queryWords, function (queryWord) {
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

        if (!query) { return results; }

        var options    = {ignoreCase: !caseSensitive},
            queryWords = WordBreak.getUniqueWords(query, options);

        return YArray.filter(results, function (result) {
            // Convert resultWords array to a hash for fast lookup.
            var resultWords = YArray.hash(WordBreak.getUniqueWords(result.text,
                                options));

            return YArray.every(queryWords, function (word) {
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
        return Filters.wordMatch(query, results, true);
    }
});


}, '3.7.3', {"requires": ["array-extras", "text-wordbreak"]});
