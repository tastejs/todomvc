/*
Aristocrat version 1.0.1
Copyright (c) 2012, Peter Michaux
All rights reserved.
Licensed under the Simplified BSD License.
https://github.com/petermichaux/aristocrat/blob/master/LICENSE
*/
var aristocrat = {};

(function() {

    var regExpCache = {};

    function getRegExp(className) {
        return Object.prototype.hasOwnProperty.call(regExpCache, className) ?
                   regExpCache[className] :
                   (regExpCache[className] = new RegExp('(?:^|\\s+)' + className + '(?:\\s+|$)'));
    }

/**

@property aristocrat.hasClass

@parameter element {Element} The DOM element to test.

@parameter className {string} The class name to test for on element.

@returns {boolean}

@description

Tests if element has className in the element.className property.

aristocrat.hasClass(document.body, 'king');

*/
    var hasClass = aristocrat.hasClass = function(el, className) {
        return getRegExp(className).test(el.className);
    };

/**

@property aristocrat.addClass

@parameter element {Element} The DOM element to test.

@parameter className {string} The class name to add to element.

@description

Add className to element.className if className is not already in element.className.

aristocrat.addClass(document.body, 'king');

*/
    var addClass = aristocrat.addClass = function(el, className) {
        if (!hasClass(el, className)) {
            el.className = el.className + ' ' + className;
        }
    };

/**

@property aristocrat.removeClass

@parameter element {Element} The DOM element to test.

@parameter className {string} The class name to remove from element.

@description

Removes all occurrences of className in element.className.

aristocrat.removeClass(document.body, 'king');

*/
    var removeClass = aristocrat.removeClass = function(el, className) {
        var re = getRegExp(className);
        while (re.test(el.className)) { // in case multiple occurrences
            el.className = el.className.replace(re, ' ');
        } 
    };

/**

@property aristocrat.toggleClass

@parameter element {Element} The DOM element to test.

@parameter className {string} The class name to toggle on element.

@description

If element.className has className then className is removed. Otherwise
className is added.

aristocrat.toggleClass(document.body, 'king');

*/
    aristocrat.toggleClass = function(el, className) {
        if (hasClass(el, className)) {
            removeClass(el, className);
        }
        else {
            addClass(el, className);
        }
    };

}());
