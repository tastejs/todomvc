/**
 * ignore coverage measurements for this module,
 * because this is just an adapter for native browser functions.
 */

/* istanbul ignore next */
(function() {
    'use strict';

    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        throw Error("no module loader found");
    }

    function factory() {
        var docElem = window.document.documentElement,
            matchesSelector = docElem.matches ||
                docElem.matchesSelector ||
                docElem.webkitMatchesSelector ||
                docElem.mozMatchesSelector ||
                docElem.oMatchesSelector ||
                docElem.msMatchesSelector ||
                matchesSelectorPoly;

        /**
         * https://developer.mozilla.org/en-US/docs/Web/API/Element.matches#Polyfill
         */
        function matchesSelectorPoly(selector) {
            var element = this,
                doc = element.document || element.ownerDocument,
                matches = doc.querySelectorAll(selector),
                i = 0;
            while (matches[i] && matches[i] !== element) i++;
            return matches[i] ? true : false;
        }

        /**
         * A service function which takes an element and a selector and returns
         * `true` if the element matches the selector, or `false` otherwise.
         * This function tries to use native browser *matchesSelector functions,
         * and falls back to a simple polyfill.
         */
        return function(element, selector) {
            return matchesSelector.call(element, selector);
        }
    }
}());
