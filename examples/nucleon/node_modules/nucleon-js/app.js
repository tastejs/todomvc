/**
 * =============================
 *      Nucleon JS Framework
 * =============================
 *
 * The MIT License
 *
 * Copyright (c) 2015-2016 Kévin Marcachi (git:@moduleon)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 *
 * @preserve
 */
(function(root, factory) {

    'use strict';

    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof exports !== 'undefined') {
        module.exports = factory();
    } else {
        root.app = factory();
    }

}(this, function() {

    'use strict';

    var version = '1.1.5';
    var authors = ['Kevin Marcachi'];

    // ==================================
    // Utility functions
    // ==================================

    /**
     * Build an url regarding method, url and parameters given.
     *
     * @param  {string} method
     * @param  {string} url
     * @param  {object} param
     * @return {string}
     */
    function buildUrl(method, url, param) {
        if (method === 'GET' && param) {
            var qs = '';
            for (var key in param) {
                if (param.hasOwnProperty(key)) {
                    var value = param[key];
                    qs += encodeURIComponent(key) + '=' + encodeURIComponent(value) + '&';
                }
            }
            if (qs.length > 0) {
                qs = qs.substring(0, qs.length - 1);
                url += (url.indexOf('?') !== -1 ? '&' : '?') + qs;
            }
        }
        return url;
    }

    /**
     * Upper first letter of a string.
     */
    function capitalize(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    /**
     * Create a css transition.
     *
     * @param  {HTMLElement} el
     * @param  {string}      prop is the name of the property bound to the transition
     * @param  {string|int}  startValue is the value of the property before the transition
     * @param  {string|int}  endValue is the vakue of the property at the end of the transition
     * @param  {int}         duration is the duration of the transition in milliseconds
     * @param  {string}      curveType is the type of the curve used to run the transition (ease, linear, etc).
     * @param  {int}         delay is the delay in milliseconds to wait before running the transition
     * @param  {function}    preTransition is a function to run before running the transition.
     * @param  {function}    postTransition is a function to run after running the transition.
     */
    function createTransition(el, prop, startValue, endValue, duration, curveType, delay, preTransition, postTransition) {

        function transitionEndName() {
            var el = document.createElement('div');
            var transitionEndEventNames = {
                'WebkitTransition' : 'webkitTransitionEnd',
                'MozTransition'    : 'transitionend',
                'OTransition'      : 'oTransitionEnd otransitionend',
                'transition'       : 'transitionend'
            };
            for (var name in transitionEndEventNames) {
                if (el.style[name] !== undefined) {
                    return transitionEndEventNames[name];
                }
            }
            return false;
        }

        function transitionName() {
            var el = document.createElement('div');
            var transitions = ['-webkit-transition', '-o-transition', 'transition'];
            for(var i = 0, len = transitions.length, transition; i < len; i++) {
                transition = transitions[i];
                if (el.style[transition] !== undefined) {
                    return transition;
                }
            }
            return false;
        }

        function onTransitionEnd(el, callback, duration) {
            var transitionEnd = transitionEndName();
            if (transitionEnd) {
                var func = function() {
                    app.events.removeListener(transitionEnd, el, func);
                    if (callback) {
                        callback();
                    }
                };
                app.events.addListener(transitionEnd, el, func);
            } else {
                setTimeout(function() { callback(); }, duration);
            }
        }

        if (isInDOM(el) === false) {
            return;
        }

        var witness = 'calledAt';
        if ( (el[witness] === undefined || ((new Date()).getTime() - el[witness]) > duration) && el.style[prop] !== undefined) {

            el[witness] = (new Date()).getTime();

            el.style.display = '';

            if (preTransition) {
                preTransition();
            }

            el.style[prop] = startValue;

            var transition = transitionName();
            var callback = function(){
                el.style[transition] = '';
                delete el[witness];
                if (postTransition) {
                    postTransition();
                }
            };
            onTransitionEnd(el, callback, duration);

            el.style[transition] = (prop+' '+ (duration / 1000) +'s '+curveType+ ' '+(delay / 1000) +'s ');
            setTimeout(function(){
                el.style[prop] = endValue;
            }, 20);
        }
    }

    /**
     * Make an HTMLElement collapse.
     *
     * @param  {HTMLElement}   el
     * @param  {int}           duration is the duration of the transition in milliseconds
     * @param  {Function}      callback is the function to launch after the transition
     */
    function collapse(el, duration, callback) {
        duration = duration || 350;
        el.style.display = 'block';
        var originalHeight = el.offsetHeight;
        var preTrans = function(){
            el.style.overflow = 'hidden';
        };
        var postTrans = function() {
            el.style.display = 'none';
            el.style.height = '';
            el.style.overflow = '';
            if (callback) {
                callback();
            }
        };
        createTransition(el, 'height', originalHeight+'px', '0px', duration, 'ease', 0, preTrans, postTrans);
    }

    /**
     * Run function through each iterable prop of a value.
     *
     * @param  {mixed}    target
     * @param  {function} func
     */
    function each(target, func) {
        if (!target) {
            return;
        }
        // Target to iterate is an object
        if (getTypeOf(target) === 'object') {
            var prop;
            for(prop in target) {
                if(func(prop, target[prop]) !== undefined){
                    break;
                }
            }
        // target is something else (array, node list)
        } else {
            var i, len;
            for(i = 0, len = target.length; i < len; i++){
                if(func(i, target[i], len) !== undefined){
                    break;
                }
            }
        }
    }

    /**
     * Run function through each iterable prop of a value in the reverse order.
     *
     * @param  {mixed}    target can be an array, a node list or event a string, but not an object.
     * @param  {function} func
     */
    function eachReverse(target, func) {
        // Target to iterate is an object
        if (getTypeOf(target) === 'object') {
            throw 'eachReverse can not be used on an object.'
        // target is something else (array, node list)
        } else {
            for(var i = target.length - 1; i >= 0; i--){
                if(func(i, target[i]) !== undefined){
                    break;
                }
            }
        }
    }

    /**
     * Create or upgrade a HTMLElement with overriden methods.
     *
     * @param  {string|HTMLElement} el
     * @return {HTMLElement}
     */
    function el(el) {
        el = !isHTMLElement(el) ? parseHtml(el) : el;
        return up(el);
    }

    /**
     * Escape css selector to avoid error in browsers.
     *
     * @param  {string} selector
     * @return {string}
     */
    function escapeSelector(selector) {
        return selector
            .replace(/#([0-9])/g, '#\\3$1 ')               // for browsers generating error when id start with a number
            .replace(/:+((?!not)[^: ]*)/g, '[type="$1"]'); // for browsers generating error when using ':' as element type selector
    }

    /**
     * Make an HTMLElement uncollapse.
     *
     * @param  {HTMLElement}   el
     * @param  {int}           duration is the duration of the transition in milliseconds
     * @param  {Function}      callback is the function to launch after the transition
     */
    function expand(el, duration, callback) {
        duration = duration || 350;
        el.style.display = '';
        el.offsetHeight;
        var originalHeight = el.offsetHeight;
        var preTrans = function(){
            el.style.overflow = 'hidden';
        };
        var postTrans = function() {
            el.style.overflow = '';
            el.style.height = '';
            if (callback) {
                callback();
            }
        };
        createTransition(el, 'height', '0px', originalHeight+'px', duration, 'ease', 0, preTrans, postTrans);
    }

    /**
     * Make an HTMLElement fade in.
     *
     * @param  {HTMLElement}   el
     * @param  {int}           duration is the duration of the transition in milliseconds
     * @param  {Function}      callback is the function to launch after the transition
     */
    function fadeIn(el, duration, callback) {
        duration = duration || 150;
        var postTrans = function() {
            el.style.opacity = '';
            if (callback) {
                callback();
            }
        };
        createTransition(el, 'opacity', 0, 1, duration, 'linear', 0, null, postTrans);
    }

    /**
     * Make an HTMLElement fade out.
     *
     * @param  {HTMLElement}   el
     * @param  {int}           duration is the duration of the transition in milliseconds
     * @param  {Function}      callback is the function to launch after the transition
     */
    function fadeOut(el, duration, callback) {
        duration = duration || 150;
        var postTrans = function() {
            el.style.opacity = '';
            el.style.display = 'none';
            if (callback) {
                callback();
            }
        };
        createTransition(el, 'opacity', 1, 0, duration, 'linear', 0, null, postTrans);
    }

    /**
     * Find elements with css selector.
     *
     * @param  {string}            selector is a css selector
     * @param  {HTMLElement}       el       is an element where to look in
     * @return {HTMLElement|array}          depends if result as multiple
     */
    function find(selector, el) {

        function nodelistToArray(list) {
            var array = [];
            each(list, function(i, item){
                array.push(item);
            });
            return array;
        }

        var query = selector.indexOf('#') !== -1 && selector.indexOf(' ') === -1 ? 'querySelector' : 'querySelectorAll';
        var result = [];

        el = (el && typeof el[query] !== 'undefined') ? el : document.documentElement;

        try {
            result = el[query](selector);
        } catch (e) {
            selector = escapeSelector(selector);
            try {
                result = el[query](selector);
            } catch (e) {
                result = [];
            }
        }

        return query === 'querySelector' ? result : nodelistToArray(result);
    }

    /**
     * Get the first HTMLElement corresponding to a css selector.
     *
     * @param  {string}      selector is a css selector
     * @param  {HTMLElement} el       is an element where to look in
     * @return {HTMLElement}
     */
    function first(selector, el) {
        var result = find(selector, el);
        return getTypeOf(result) === 'array' ? result[0] : result;
    }

    /**
     * Turn form into an object.
     *
     * @param  {form}  form
     * @return {object}
     */
    function formToObject(form) {
        var values = {};
        up(form).find('[name]').forEach(function(child) {
            if (child.value && !child.disabled) {
                values[child.name] = child.value;
            }
        });
        return values;
    }

    /**
     * Get type of a value.
     * @return {string}
     */
    function getTypeOf(value) {
        return Object.prototype.toString.call(value).replace('[object ', '').replace(']','').toLowerCase();
    }

    /**
     * Guess the value of a string expression for a given context.
     *
     * @param  {string} string  is the expression to guess
     * @param  {object} context is an object containing properties we can use to guess the value
     * @return {mixed}
     */
    function guessValueOf(string, context) {

        string = ('' + string).trim();
        if (!string) {
            return '';
        }

        if(context && getTypeOf(context) !== 'object') {
            throw 'Context must be an object';
        }

        // Utility functions

        /**
         * Get to a property in an attribute, a method or a function
         * In the given context, or in the global one.
         * @param  {string}          path   is the path to get to the prop (dot.separated)
         * @param  {mixed|array}     params is the arguments to give to the prop (if it's a function)
         * @return {mixed|undefined}        will be what the property is (undefined if not found)
         */
        function accessProperty(path, params) {

            path = path.split('.');

            var target = context ? context[path[0]] : null;

            if (context && context[path[0]]) {
                target = context;
            } else if (window[path[0]]) {
                target = window;
            } else {
                return;
            }

            var owner = target;

            each(path, function(key, prop){
                if(target[prop] !== undefined){
                    if (target !== owner) {
                        owner = target;
                    }
                    target = target[prop];
                } else {
                    target = undefined;
                    return false;
                }
            });

            if (getTypeOf(target) === 'function'){
                target = target.apply(owner, params);
            }

            return target;
        }

        /**
         * Store result
         * @param {mixed} result
         */
        var treated = {};
        function saveResult(result) {
            treated['' + result] = result;
        }

        /**
         * Wrap string between double quotes, and escape those in it
         * @param  {string} str
         * @return {string}
         */
        function wrapAndEscape(str) {
            return '"'+ (str.replace(/"/g, '\\"').replace(/'/g, "\\'")) +'"';
        }

        // Constants accurate to any functions

        var ARRAY_START  = '[';
        var ARRAY_END    = ']';
        var DOUBLE_QUOTE = '"';
        var ESCAPER      = '\\';
        var OBJECT_START = '{';
        var OBJECT_END   = '}';
        var SEPARATOR    = ',';
        var SINGLE_QUOTE = "'";
        var SPACE        = ' ';

        // Treatment functions

        /**
         * Find parenthesis in the expression and replace them by their values.
         * Once launched, this function modify directly string value.
         */
        function treatParenthesis() {

            // Pattern to find the deepest nested parenthesis
            var PARENTHESIS = /(?:(?!(?:[a-zA-Z0-9\.\_'"])).|^)(\([^\(\)]*\))/;
            var search;
            var result;

            while (search = string.match(PARENTHESIS)) {
                result = guessValueOf(search[1].substr(1, search[1].length - 2), context);
                saveResult(result);
                string = string.replace(search[1], result);
            }

            return string;
        }

        /**
         * Find functions in the expression and replace them by their values.
         * Once launched, this function modify directly string value.
         */
        function treatFunctions() {

            /**
             * Extracts parameters from string (and define their value)
             * @param  {string} string
             * @return {array}
             */
            function extractParams(string) {

                if (!string) return [];

                var params      = [''];
                var index       = 0;
                var openObjects = 0;
                var openArrays  = 0;

                each(string, function(i, k) {
                    switch (k) {
                        case ARRAY_START:  openArrays++;  break;
                        case ARRAY_END:    openArrays--;  break;
                        case OBJECT_START: openObjects++; break;
                        case OBJECT_END:   openObjects--; break;
                        case SEPARATOR:
                            if (!openArrays && !openObjects) {
                                index++;
                                params[index] = k = '';
                            }
                    }

                    if (params[index] !== '' || k !== ' ') {
                        params[index] += k;
                    }
                });

                params = params.map(function(param){
                    return guessValueOf(param, context);
                });

                return params;
            }

            // Pattern to find the deepest nested function
            var FUNCTIONS =/[a-zA-Z0-9\.\_]+\(+((?![a-zA-Z0-9\.\_]+\(\)).)*?\)+/;
            var PARAMS = /\((.*)?\)/;
            var search;
            var result;
            var fn;
            var params;

            var BLACKLIST = ['eval', 'alert', 'console.log', 'setTimeout'];

            // Replace all functions in the expression
            // Starting by the deepest nested, until there is none left.
            while (search = string.match(FUNCTIONS)) {
                params = search[0].match(PARAMS);
                fn = search[0].substr(0, (search[0].length - params[0].length));
                if (BLACKLIST.indexOf(fn) !== -1) {
                    throw 'Nice try. '+ fn +' can not be run with guessValueOf.';
                }
                params = params ? extractParams(params[1]) : [];
                result = accessProperty(fn, params);
                saveResult(result);
                if (getTypeOf(result) === 'string') {
                    result = wrapAndEscape(result);
                }
                string = string.replace(search[0], result);
            }

            return string || '';
        }

        /**
         * Treat components in the expression to eventually replace them all by a value.
         * Once launched, this function modify directly string value.
         */
        function treatComponents() {

            /**
             * Transform a string into a value, according to the current context
             * @param  {string} str
             * @return {minxed}
             */
            function stringToValue(str) {

                /**
                 * Transform a string into an object or an array, according to the current context
                 * @param  {string} str
                 * @return {object|array}
                 */
                function stringToObject(str) {

                    var components    = [''];
                    var index         = 0;
                    var inDoubleQuote = false;
                    var inSingleQuote = false;

                    function addRowIfNeeded(i, value) {
                        value = value || '';
                        if (components[index] !== '') {
                            //
                            if(components[index] !== '}' && components[index] !== ']'){
                                if (value === ',' || value === '}' || value === ']') {
                                    components[index] = stringToValue(components[index]);
                                    var type = getTypeOf(components[index]);
                                    if (type === 'string') {
                                        components[index] = wrapAndEscape(components[index]);
                                    } else if (type === 'array' || type === 'object') {
                                        components[index] = JSON.stringify(components[index]);
                                    }
                                }
                            }
                            index++;
                        }
                        components[index] = value;
                    }

                    each(str, function(i, k){

                        switch (k) {
                            case ARRAY_START:
                            case ARRAY_END:
                            case OBJECT_START:
                            case OBJECT_END:
                            case SEPARATOR:
                            case ':':
                                if (inSingleQuote === false && inDoubleQuote === false) {
                                    addRowIfNeeded(i, k);
                                    addRowIfNeeded(i);
                                    k = '';
                                }
                                break;
                            case DOUBLE_QUOTE:
                                if (inSingleQuote === false) {
                                    inDoubleQuote = (inDoubleQuote === false) ? true : false;
                                }
                                break;
                            case SINGLE_QUOTE:
                                if (inDoubleQuote === false) {
                                    inSingleQuote = (inSingleQuote === false) ? true : false;
                                }
                                break;
                            case SPACE:
                                if (inSingleQuote === false && inDoubleQuote === false) {
                                    k = '';
                                }
                                break;
                        }

                        if (k) {
                            components[index] += k;
                        }
                    });

                    if (components[index] === '') {
                        components.splice(index, 1);
                    }

                    return JSON.parse(components.join(''));
                }

                if (getTypeOf(str) === 'string') {

                    // if already treated, return the result stored
                    if (treated[str]) {
                        return treated[str];

                    // if string is surrounded by quotes, it's considered as a string. Just return it without quotes
                    } else if ((str[0] === '"' && str[str.length - 1] === '"') || (str[0] === "'" && str[str.length - 1] === "'")) {
                        return str.substr(1, (str.length - 2));

                    // Elsewise, try to find what it is
                    } else {

                        switch (str) {

                            // If it's a reserved word
                            case 'undefined': return undefined;
                            case 'null' :     return null;
                            case 'false':     return false;
                            case 'true' :     return true;

                            // Otherwise...
                            default:
                                var value;
                                // Starts like an object or an array
                                if (str[0] === OBJECT_START || str[0] === ARRAY_START) {
                                    try {
                                        value = stringToObject(str);
                                    } catch (e) {
                                        value = str;
                                    }
                                // Starts like something else
                                } else {
                                    // Try to convert it into a number
                                    value = parseFloat(str);
                                    if (isNaN(value)) {
                                        // Or try to get a prop value
                                        if (!SYMBOLS[str]) {
                                            value = accessProperty(str);
                                        } else {
                                            value = str;
                                        }
                                    }

                                }
                                return value;
                        }
                    }
                }

                return string;
            }

            // All symbols that could be found in the expression, in the order of a logical treatment
            var SYMBOLS = {
                // ===== Operations ==================================================================
                '*' : function(index) { return components[index - 1] * components[index + 1] },
                '/' : function(index) { return components[index - 1] / components[index + 1] },
                '%' : function(index) { return components[index - 1] % components[index + 1] },
                '-' : function(index) { return (components[index - 1] || 0) - components[index + 1] },
                '+' : function(index) { return (components[index - 1] || 0) + components[index + 1] },
                // ===== Comparisons =================================================================
                '!' : {}, // This symbol is only there because is a part of '!='
                '!=': function(index) { return components[index - 1] !== components[index + 1] },
                '=' : {}, // This symbol is only there because is a part of '=='
                '==': function(index) { return components[index - 1] === components[index + 1] },
                '>' : function(index) { return components[index - 1] >   components[index + 1] },
                '>=': function(index) { return components[index - 1] >=  components[index + 1] },
                '<' : function(index) { return components[index - 1] <   components[index + 1] },
                '<=': function(index) { return components[index - 1] <=  components[index + 1] },
                // ===== Boolean operators ===========================================================
                '&' : {}, // This symbol is only there because is a part of '&&'
                '&&': function(index) { return components[index - 1] && components[index + 1] },
                '|' : {}, // This symbol is only there because is a part of '||'
                '||': function(index) { return components[index - 1] || components[index + 1] }
            }

            var components    = [''];
            var index         = 0;
            var inEscaper     = false;
            var inDoubleQuote = false;
            var inSingleQuote = false;
            var inSymbol      = false;
            var openArrays    = 0;
            var openObjects   = 0;

            function addRowIfNeeded(value) {
                value = value || '';
                if (components[index]) {
                    components[index] = stringToValue(components[index]);
                    index++;
                }
                components[index] = value;
            }

            // Separate and evaluate each component (except for symbols)
            each(string, function(i, k){

                switch (k) {
                    case DOUBLE_QUOTE:
                        if (inSingleQuote === false && inEscaper === false && openObjects === 0 && openArrays === 0) {
                            inDoubleQuote = (inDoubleQuote === false) ? true : false;
                        }
                        break;
                    case SINGLE_QUOTE:
                        if (inDoubleQuote === false && inEscaper === false && openObjects === 0 && openArrays === 0) {
                            inSingleQuote = (inSingleQuote === false) ? true : false;
                        }
                        break;
                    case SPACE:
                        if (inSingleQuote === false && inDoubleQuote === false && openObjects === 0 && openArrays === 0) {
                            k = '';
                        }
                        break;
                    case ESCAPER:
                        inEscaper = (inEscaper === false) ? true : false;
                        if (inEscaper) {
                            k = '';
                        }
                        break;
                    case ARRAY_START:  openArrays++;  break;
                    case ARRAY_END:    openArrays--;  break;
                    case OBJECT_START: openObjects++; break;
                    case OBJECT_END:   openObjects--; break;
                }

                if (k) {
                    if (SYMBOLS[k] && inSingleQuote === false && inDoubleQuote === false && openObjects === 0 && openArrays === 0) {
                        if (inSymbol) {
                            components[index] += k;
                        } else {
                            addRowIfNeeded(k);
                            inSymbol = true;
                        }
                    } else {
                        if (inSymbol) {
                            addRowIfNeeded(k);
                            inSymbol = false;
                        } else {
                            components[index] += k;
                        }

                    }

                    inEscaper = false;
                }
            });

            if (components[index] !== '') {
                components[index] = stringToValue(components[index]);
            } else {
                components.splice(index, 1);
            }

            // Search for symbols, and replace rows they mess with by the value
            // Until there is only one row in the component array.
            var from, range, value;
            each(SYMBOLS, function(symbol, func){
                while ((index = components.indexOf(symbol)) > -1) {
                    from  = (index - 1) >= 0 ? (index - 1) : index;
                    range = (index === from) ? 2 : 3;
                    value = func(index);
                    components.splice(from, range, value);
                }
            });

            components = components.length > 1 ? components.join(' ') : components[0];

            string = components;
        }

        // Process in logical order

        treatParenthesis();
        treatFunctions();
        treatComponents();

        return string;
    }

    /**
     * Hydrate object properties from another object.
     * This function will look for a setter first before assigning a value the old fashion way.
     *
     * @param  {object}  obj   is the object to hydrate
     * @param  {object}  args  is the object to take new values from
     * @param  {boolean} force defines if we create a prop if it's not defined in the object
     * @return {object}        is the object hydrated
     */
    function hydrate(obj, args, force) {

        if (getTypeOf(obj) === 'object' && getTypeOf(args) === 'object') {

            each(args, function(prop, value){

                if (typeof obj[prop] !== 'undefined' || force) {

                    // If setter is defined, call it
                    var setter = 'set'+capitalize(prop);
                    if (getTypeOf(obj[setter]) === 'function') {
                        obj[setter](value);

                    } else {
                        // If both properties are object, run hydrate through them
                        if(getTypeOf(obj[prop]) === 'object' && getTypeOf(value) === 'object'){
                            hydrate(obj[prop], value);
                        // Otherwise, just replace the value
                        } else {
                            obj[prop] = value;
                        }
                    }
                }
            });
        }

        return obj;
    }

    /**
     * Check if an element is an HTMLElement.
     *
     * @param  {mixed}  el
     * @return {Boolean}
     */
    function isHTMLElement(el) {
        try {
            //Using W3 DOM2 (works for FF, Opera and Chrom)
            return el instanceof HTMLElement || el.nodeType === 3;
        } catch (e) {
            //Browsers not supporting W3 DOM2 don't have HTMLElement and
            //an exception is thrown and we end up here. Testing some
            //properties that all elements have. (works on IE7)
            return (typeof el === "object") &&
                (el.nodeType === 1 || el.nodeType === 3) && (typeof el.style === "object") &&
                (typeof el.ownerDocument === "object");
        }
    }

    /**
     * Check if element is in DOM.
     *
     * @param  {HTMLElement}  el
     * @return {Boolean}
     */
    function isInDOM(element) {
        return element.parentNode !== null && element.parentNode.innerHTML !== null && up(element).ancestor('html') !== false;
    }

    /**
     * Override method from array messing with items.
     *
     * @param  {array}    ary
     * @param  {function} callback
     */
    function overrideArrayItemsMethod(ary, callback) {
        var methods = ['pop', 'push', 'shift', 'splice', 'unshift'];
        each(methods, function(key, method){
            // Closure avoids collision
            (function(ary, method, callback){
                ary[method] = function() {
                    Array.prototype[method].apply(ary, arguments);
                    if (callback) {
                        callback();
                    }
                }
            }(ary, method, callback));
        });
    }

    /**
     * Turn string into an html element.
     *
     * @param  {string} string
     * @return {HTMLElement}
     */
    function parseHtml(string) {

        function escapeNestedQuotes(string) {

            var escaped = '';
            var inTag   = false;
            var inQuote = false;

            each(string, function(i, k){
                if ((k === '<' || k === '>') && !inQuote) {
                    inTag = inTag ? false : true;
                }
                if (inTag) {
                    if (k === '"') {
                        if (inQuote) {
                            if (string[i + 1] === ' ' || string[i + 1] === '>') {
                                inQuote = false;
                            } else {
                                k = '&quot;';
                            }
                        } else {
                            inQuote = true;
                        }
                    }
                }
                escaped += k;
            });

            return escaped;
        }

        /**
         * Escape text in <code> tags
         */
        function escapeCodesTag(str) {
            var ALL_TAGS_PATTERN = /<code[ a-z\"\'\-\_\=|]*>(?:(?!<code).|[\r\n])*<\/code>/gi;
            var codes = str.match(ALL_TAGS_PATTERN);
            if (codes) {
                var INNER_TAG_PATTERN  = /<code[ a-z\"\'\-\_\=|]*>((?:(?!<code).|[\r\n])*)<\/code>/i;
                each(codes, function(key, code) {
                    var inner = code.match(INNER_TAG_PATTERN)[1];
                    var escaped = code.replace(inner, inner.replace(/\</g, '&lt;').replace(/\>/g,'&gt;').replace(/\"/g,'&quot;'));
                    str = str.replace(code, escaped);
                });
            }

            return str;
        }

        string = escapeCodesTag(string);
        var COMMENTS = /<!--[^>]*-->/g;
        string = string.replace(COMMENTS, '');
        string = string.trim();
        string = escapeNestedQuotes(string);

        var temp = document.createElement('div');
        temp.innerHTML = string;
        var el = temp.firstChild.cloneNode(true);
        temp = null;

        return el;
    }

    /**
     * Redirect to a controller with an url.
     * @param  {string}  url
     * @param  {boolean} inHistory defines if this redirection needs to be stored in browser history.
     */
    function redirect(url, inHistory) {
        var btn = parseHtml('<a href="'+url+'">moduleon</a>');
        var e = {
            preventDefault: function(){},
            target: btn
        }
        return controllers.delegate(e, inHistory);
    }

    /**
     * Perform an ajax request.
     *
     * @param  {object} params
     */
    function request(params) {

        if (!params['url']) {
            throw 'No url given.';
        }

        // Retrieve and check the method
        function getMethod(method) {
            if (!method) {
                return 'GET';
            }
            var authorized = ['GET', 'POST', 'PUT', 'DELETE'];
            if (authorized.indexOf(method) === -1) {
                throw 'Unauthorized method.';
            }
            return method;
        }

        // Retrieve data according to method used
        function getData(method, data) {
            if (data && (method === 'POST' || method === 'PUT')) {
                return data;
            }
            return null;
        }

        // Retrieve format for response
        function getFormat(format) {
            if (!format) {
                return null;
            }
            var authorized = ['JSON'];
            if (authorized.indexOf(format) === -1) {
                throw 'Unauthorized requested format.';
            }
            return format;
        }

        // Handle requested format for response (only json for now)
        function handleFormat(format, response) {

            if (format && format === 'JSON') {
                response = JSON.parse(response);
            }

            return response;
        }

        // Preparing vars for request
        var that     = this,
            method   = getMethod(params['method']),
            url      = buildUrl(method, params['url'], params['data']),
            data     = getData(method, params['data']),
            headers  = params['headers'] || {},
            format   = getFormat(params['format']),
            cors     = params['cors']  || false,
            async    = params['async'] === false ? params['async'] : true,
            store    = params['store'] || false,
            // Retrieving callbacks
            success  = params['success'] || function() {},
            error    = params['error']   || function() {};

        // Try to retrieve response from passed requests in case of GET request
        if (method === 'GET') {
            var response = pager.getResponse(url);
            if (response) {
                response = handleFormat(format, response);
                return success ? success(response, 200) : response;
            }
        }

        // Request
        var request = new(XMLHttpRequest || ActiveXObject)('MSXML2.XMLHTTP.3.0');

        // Cross-sites request handling
        if (cors === true) {
            if ('withCredentials' in request) {
                // Do nothing
            } else {
                if (typeof XDomainRequest !== 'undefined') {
                    request = new XDomainRequest();
                } else {
                    throw 'Your browser does not support all ajax features needed for CORS.';
                }
            }
        }

        request.open(method, url, async);

        // Headers
        if (request.setRequestHeader) {
            // Set default headers
            request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            if (method === 'POST' || method === 'PUT') {
                request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
            }
            // Include those given in arguments
            for (var key in headers) {
                request.setRequestHeader(key, headers[key]);
            }
        }

        if (async === false) {
            request.send(null);
            if (request.status >= 200 && request.status < 400) {
                var response = handleFormat(format, request.responseText);
                return success ? success(response, 200) : response;
            } else {
                if (error) {
                    return error(handleFormat(format, request.responseText), request.status);
                } else {
                    throw 'Server returned an error.';
                }
            }
        }

        // On progress event
        if (request.onprogress) {
            request.onprogress = function() {};
        }

        // On timeout event
        if (request.ontimeout) {
            request.ontimeout = function() {};
        }

        // On load event
        request.onreadystatechange = function() {
            // Request finished
            if (request.readyState > 3) {
                // Successfull response
                if (request.status >= 200 && request.status < 400) {
                    // Response storage
                    if (store && method === 'GET') {
                        that.pager.addResponse(url, request.responseText);
                    }
                    // Handling requested format for response
                    var response = handleFormat(format, request.responseText);
                    // Returning response
                    return success ? success(response, 200) : response;
                    // Error response
                } else {
                    if (error) {
                        error(handleFormat(format, request.responseText), request.status);
                    } else {
                        throw 'Server returned an error.';
                    }
                }
            }
        };

        // On error event
        request.onerror = function() {
            if (error) {
                error(handleFormat(format, request.responseText), request.status);
            } else {
                throw 'Server returned an error.';
            }
        };

        setTimeout(function() {
            request.send(data);
        }, 0);
    }

    /**
     * Check if a HTMLElement matches a css selctor.
     *
     * @param  {HTMLElement} el
     * @param  {string}      selector
     * @return {boolean}
     */
    function selectorMatches(el, selector) {
        var result = false;
        if (isHTMLElement(el)) {
            var match = HTMLElement.prototype.matches || HTMLElement.prototype.matchesSelector || HTMLElement.prototype.msMatchesSelector || HTMLElement.prototype.mozMatchesSelector || HTMLElement.prototype.webkitMatchesSelector || HTMLElement.prototype.oMatchesSelector || null;
            if (match) {
                try {
                    result = match.call(el, selector);
                } catch (e) {
                    selector = escapeSelector(selector);
                    try {
                        result = match.call(el, selector);
                    } catch (e) {
                        result = false;
                    }
                }
            }
        }
        return result;
    }

    /**
     * Watch for object changes.
     *
     * @param  {object}      obj     is the object to watch
     * @param  {function}    handler is the callback function waiting for changes.
     *                               Can take 3 arguments:
     *                                  - path:     where changed property is stored in the object (dot.separated)
     *                                  - oldValue: the old value of the property
     *                                  - newValue: the new value of the property
     * @param  {string|void} path    is the path where current object is contained (dot.separated)
     * @return {object}              is the object given in argument
     */
    function watchObject(obj, handler, path) {

        /**
         * Redefine a property in an object.
         *
         * @param  {object}    obj    is the object where to redefine a prop
         * @param  {string}    prop   is the name of the prop to redefine
         * @param  {function}  getter is a function which return the value
         * @param  {function}  setter is a function which set the value
         * @return {object}           is the object given in argument.
         */
        function redefineProperty(obj, prop, getter, setter) {
            if (typeof Object.prototype.defineProperty === 'function') { // ECMAScript 5
                Object.defineProperty(obj, prop, {
                    configurable: true,
                    enumerable: true,
                    get: getter,
                    set: setter
                });
            } else if (Object.prototype.__defineGetter__ && Object.prototype.__defineSetter__) { // legacy
                Object.prototype.__defineGetter__.call(obj, prop, getter);
                Object.prototype.__defineSetter__.call(obj, prop, setter);
            }
        }

        /**
         * Watch for changes in a object prop.
         *
         * @param {object}   obj     is the object to observe
         * @param {string}   prop    is the name of the property to observe
         * @param {function} handler is the function to run in case of a change
         * @return {void}
         *
         * See: http://stackoverflow.com/questions/1269633/watch-for-object-properties-changes-in-javascript
         */
        function watchProperty(obj, prop, handler) {
            var value = obj[prop];
            var oldValue = value;
            if (delete obj[prop]) {
                if (getTypeOf(value) === 'array') {
                    watchArray(value, function(){
                        handler.call(obj, prop, oldValue, value);
                    });
                }
                var getter = function() {
                    return value;
                };
                var setter = function(newValue) {
                    oldValue = value;
                    value = newValue;
                    // If it's an array, listen to changes in its content
                    // Otherwise, we'll only get notification when array is replaced by another one.
                    if(oldValue !== newValue){
                        if (getTypeOf(newValue) === 'array') {
                            watchArray(value, function(){
                                handler.call(obj, prop, oldValue, newValue);
                            });
                        }
                        handler.call(obj, prop, oldValue, newValue);
                    }
                };
                redefineProperty(obj, prop, getter, setter);
            }
        }

        /**
         * Run a callback function when changes in array.
         *
         * @param  {array}    ary     is the array to observe
         * @param  {function} handler is the handler to call in case of a change
         * @return {void}
         */
        function watchArray(ary, callback) {
            overrideArrayItemsMethod(ary, callback);
        }

        /**
         * Handle what to do if object prop is an array or an object.
         *
         * @param  {object}      obj       is the object containing an object or an array
         * @param  {string}      handler   is the name of the prop where it's stored in the object
         * @param  {string}      path      is the path where object or array is contained (dot.separated)
         * @param  {mixed}       value     is the object or array
         * @param  {string|void} valueType is the type of the value
         * @return {object}                is the object given in argument
         */
        function handleObjectOrArray(obj, handler, path, value, valueType) {
            valueType = valueType || getTypeOf(value);
            switch (valueType) {
                // If it's an array, build model for each of its item
                case 'array':
                    each(value, function(key){
                        watchObject(value[key], handler, path +'.'+ key);
                    });
                    break;
                // If it's an object, build model inside
                case 'object':
                    watchObject(value, handler, path);
                    break;
            }
            return obj;
        }

        if (getTypeOf(obj) === 'object') {
            var actualPath = '';
            var valueType;
            // Walk through each prop
            each(obj, function(prop, value){
                valueType = getTypeOf(value);
                // Do nothing if it's a function
                if (valueType !== 'function') {
                    actualPath = (path ? path + '.' : '') + prop;
                    // To build the attributes and methods, it is necessary to use a closure
                    (function(obj, prop, actualPath, value, valueType, handler){
                        // Rebuild property to watch for changes
                        watchProperty(obj, prop, function(prop, oldValue, newValue){
                            // If property has a new value, rebuild it to watch for changes
                            // But only if it's an object or an array
                            if (valueType === 'object' || valueType === 'array') {
                                handleObjectOrArray(obj, handler, actualPath, newValue);
                            }
                            // Anyway, call the handler
                            handler(actualPath, oldValue, newValue);
                        });
                        // If it's an object or an array, walk through it
                        if (valueType === 'object' || valueType === 'array') {
                            handleObjectOrArray(obj, handler, actualPath, value, valueType);
                        }
                    }(obj, prop, actualPath, value, valueType, handler));
                }
            });
        }

        return obj;
    }

    /**
     * Disable callback on property changes.
     *
     * @param  {object} obj
     * @return {object}
     */
    function unwatchObject(obj) {

        function unwatchProperty(obj, prop) {
            switch(getTypeOf(obj[prop])){
                case 'object':
                    unwatchObject(obj[prop]);
                    break;
                case 'array':
                    unwatchArray(obj[prop]);
                    break;
                default:
                    var value = obj[prop];
                    delete obj[prop];
                    obj[prop] = value;
            }
        }

        function unwatchArray(ary) {
            overrideArrayItemsMethod(ary);
            each(ary, function(key, item){
                unwatchObject(item);
            });
        }

        each(obj, function(prop){
            unwatchProperty(obj, prop);
        });

        return obj;
    }

    /**
     * Upgrade HTMLElement methods.
     *
     * @param  {HTMLElement} el
     * @return {HTMLElement}
     */
    function up(el) {

        if(el.upped === undefined) {

            if (isHTMLElement(el)) {

                // el.hasClass : check if class exists
                if (typeof el.hasClass !== 'function') {
                    el.hasClass = function(className) {
                        return !this.className ? false : new RegExp("(^|\\s)" + className + "(\\s|$)").test(this.className);
                    };
                }

                // el.addClass : Add a class
                if (typeof el.addClass !== 'function') {
                    el.addClass = function(className) {
                        this.className = this.className + (this.hasClass(className) === false ? ((this.className ? " " : "") + className) : "");
                        return this;
                    }
                }

                // el.removeClass : Remove a class from an element
                if (typeof el.removeClass !== 'function') {
                    el.removeClass = function(remove) {
                        var classNames = this.className.split(" ");
                        this.className = '';
                        for (var i = 0, len = classNames.length; i < len; i++) {
                            if (classNames[i] !== remove) {
                                this.className += (this.className ? ' ' : '') + classNames[i];
                            }
                        }
                        return this;
                    }
                }

                // el.css : add or remove style properties in an element
                if (typeof el.css !== 'function') {
                    el.css = function (attributes) {
                        if(attributes) {
                            var name;
                            for (name in attributes) {
                                if (typeof this.style[name] !== 'undefined') {
                                    this.style[name] = attributes[name];
                                }
                            }
                        }
                        if (!el.getAttribute('style')) {
                            el.removeAttribute('style');
                        }
                        return this;
                    }
                }

                // el.hide : Hide the element
                if (typeof el.hide !== 'function') {
                    el.hide = function() {
                        return this.css({'display':'none'});
                    }
                }

                // el.show : Show the element
                if (typeof el.show !== 'function') {
                    el.show = function() {
                        return this.css({'display':''});
                    }
                }

                // el.fadeIn : smooth show of the element
                if (typeof el.fadeIn !== 'function') {
                    el.fadeIn = function(duration, callback){
                        fadeIn(el, duration, callback);
                    };
                }

                // el.fadeOut : smooth hiding of the element
                if (typeof el.fadeOut !== 'function') {
                    el.fadeOut = function(duration, callback){
                        fadeOut(el, duration, callback);
                    };
                }

                // el.fadeIn : smooth show of the element
                if (typeof el.collapse !== 'function') {
                    el.collapse = function(duration, callback){
                        collapse(el, duration, callback);
                    };
                }

                // el.fadeIn : smooth show of the element
                if (typeof el.expand !== 'function') {
                    el.expand = function(duration, callback){
                        expand(el, duration, callback);
                    };
                }

                // el.html : define innerHTML of an element
                if (typeof el.html !== 'function') {
                    el.html = function(element) {
                        // this.innerHTML = ''; Delete childs for good in IE
                        while (el.firstChild) {
                            el.removeChild(el.firstChild);
                        }
                        if (element = !isHTMLElement(element) ? parseHtml(element) : element) {
                            this.appendChild(element);
                        }
                        return this;
                    }
                }

                // el.before : insert something before element
                if (typeof el.before !== 'function') {
                    el.before = function(element) {
                        if (element = !isHTMLElement(element) ? parseHtml(element) : element) {
                            this.parentNode.insertBefore(element, this);
                        }
                        return this;
                    }
                }

                // el.after : insert something after the element
                if (typeof el.after !== 'function') {
                    el.after = function(element) {
                        if (element = !isHTMLElement(element) ? parseHtml(element) : element) {
                            this.nextSibling ? this.parentNode.insertBefore(element, this.nextSibling) : this.parentNode.appendChild(element);
                        }
                        return this;
                    }
                }

                // el.prepend : insert something in the top of the element
                if (typeof el.prepend !== 'function') {
                    el.prepend = function(element) {
                        if (element = !isHTMLElement(element) ? parseHtml(element) : element) {
                            this.insertBefore(element, this.firstChild);
                        }
                        return this;
                    }
                }

                // el.append : insert something at the end of the element
                if (typeof el.append !== 'function') {
                    el.append = function(element) {
                        if (element = !isHTMLElement(element) ? parseHtml(element) : element) {
                            this.appendChild(element);
                        }
                        return this;
                    }
                }

                // el.replaceWith : replace the element with something
                if (typeof el.replaceWith !== 'function') {
                    el.replaceWith = function(element) {
                        if (element = !isHTMLElement(element) ? parseHtml(element) : element) {
                            this.parentNode.replaceChild(element, this);
                        }
                        return element;
                    }
                }

                // el.remove : remove the element
                if (typeof el.remove !== 'function') {
                    el.remove = function() {
                        this.parentNode.removeChild(this);
                    }
                }

                // el.find : find element(s) in the element
                if (typeof el.find !== 'function') {
                    el.find = function(selector) {
                        return find(selector, this);
                    }
                }

                // el.matches : check if an element matches with a css selector
                if (typeof el.matches !== 'function') {
                    el.matches = function() {
                        return selectorMatches(this, selector);
                    }
                }

                // el.ancestor : find a parent of the element matching with a selector
                if (typeof el.ancestor !== 'function') {
                    el.ancestor = function(selector) {
                        var parent = this.parentNode;
                        while (parent) {
                            if (selectorMatches(parent, selector)) {
                                return parent;
                            }
                            parent = parent.parentNode;
                        }
                        return false;
                    }
                }

                // el.toObject: transform a form int an object
                if (typeof el.toObject !== 'function') {
                    el.toObject = function() {
                        if (this.tagName === 'FORM') {
                            return formToObject(this);
                        }
                    }
                }

                el.upped = true;
            }
        }

        return el;
    }

    // ========================
    // Constructors
    // ========================

    /**
     * Controller's action. It's an object with a method to run if its route match with a given url.
     *
     * @param {string} name
     * @param {object} args is an object containing configuration elements.
     */
    var Action = function(name, args) {

        this.name = name;

        // A Route instance
        this.route = null;

        // Boolean representing if an action must be added to the history or not
        this.history = true;

        // A function to run
        this.fn = null;

        // Set the route attached to action
        this.setRoute = function(args) {
            if (typeof args === 'object') {
                this.route = new Route(args);
                return this;
            }
            throw 'Valid object has to be given for the route attached to the action.';
        };

        // Set history
        this.setHistory = function(bool) {
            if (typeof bool === 'boolean') {
                this.history = bool;
                return this;
            }
            throw 'History must be a boolean.';
        };

        // Set the function to run
        this.setFn = function(fn) {
            if (typeof fn === 'function') {
                this.fn = fn;
                return this;
            }
            throw 'Invalid function.';
        };

        // Run the function
        this.run = function(e, url, method) {

            // If action url must be added to browser history
            if (this.history === true) {
                var that = this;
                // We check if the method used was POST.
                // In that case the url to push in history must be re-built, according to form values, to match with a GET alike link.
                var params = method === 'POST' ? formToObject(e.target) : null;
                historic.addEntry(buildUrl('GET', url, params), function() {
                    that.fn.call(that, e, that.route.extractParamsFromUrl(url));
                });
            }

            if (this.fn.call(this, e, this.route.extractParamsFromUrl(url)) === false) {
                return false;
            }
        };

        // Hydrate method with args
        return hydrate(this, args);
    };

    /**
     * Controller is an object containing actions for differents url.
     * App call each of them in case of a click on a button or on submission of a form.
     *
     * @param {string} name
     */
    var Controller = function(name) {

        this.name = name;

        // Collection of actions
        var actions = {};

        // Add an action to the controller
        this.addAction = function(name, args) {

            if (getTypeOf(args) !== 'object') {
                throw 'Arguments to add an action must be a JSON.';
            }

            if (!name) {
                throw 'Action must have a name';
            } else if(actions[name]) {
                throw 'Action with name '+ name +' has already been registered in controller '+ this.name;
            }

            var action = new Action(name, args);

            if (this.hasMatchingAction(action.route.regexUrl, action.route.method)) {
                throw 'An action with the same url and mode has already been defined for this controller.';
            }

            actions[name] = action;

            return this;
        };

        // Check if controller already have a method for a given url and method
        this.hasMatchingAction = function(url, method) {
            if (actions) {
                for (var name in actions) {
                    if (actions[name].route.match(url, method)) {
                        return actions[name];
                    }
                }
            }
            return false;
        };

        return this;
    };

    /**
     * Model is an object having all its attributes observed.
     *
     * @param {object} model is the original object containing all properties.
     */
    var Model = function(model) {

        var publish       = true;
        var pubsub        = new PubSub();
        var subscriptions = [];
        var that          = this;

        // Start by building inner properties
        hydrate(this, model, true);

        // Utility functions

        /**
         * Subscribe to changes, and run an handler.
         */
        function subscribeToOuterChanges(obj, handler, path) {
            var actualPath = '';
            var valueType;
            each(obj, function(prop, value){
                valueType = getTypeOf(value);
                if (valueType !== 'function') {
                    actualPath = (path ? path + '.' : '') + prop;
                    (function(value, actualPath, handler){
                        switch (valueType) {
                            case 'array':
                                var itemType;
                                each(value, function(i, item){
                                    itemType = getTypeOf(item);
                                    if (itemType === 'array' || itemType === 'object') {
                                        subscribeToOuterChanges(item, handler, actualPath +'.'+ i);
                                    }
                                });
                                break;
                            case 'object':
                                subscribeToOuterChanges(value, handler, actualPath);
                                break;
                            default:
                                var message = actualPath + ':change';
                                if (subscriptions.indexOf(message) === -1) {
                                    pubsub.subscribe(message, function(msg, oldValue, newValue){
                                        handler(actualPath, oldValue, newValue);
                                    });
                                    subscriptions.push(message);
                                }
                        }
                    }(value, actualPath, handler));
                }
            });
        }

        /**
         * Set value of a model property.
         */
        function setPropertyValue(path, value) {
            var target = that;
            each(path.split('.'), function(i, prop, len){
                if (getTypeOf(target[prop]) !== 'undefined') {
                    if (i + 1 < len){
                        target = target[prop];
                    } else {
                        target[prop] = value;
                    }
                }
            });
        };

        // Watch for changes, and publish (or not) message through pubsub
        watchObject(this, function(path, oldValue, newValue){

            // If new value is an object or an array
            // Dynamically add subscription for changes
            var valueType = getTypeOf(newValue);
            if(valueType === 'array' || valueType === 'object'){
                subscribeToOuterChanges(newValue, function(path, oldValue, newValue){
                    publish = false;
                    setPropertyValue(path, newValue);
                }, path);
            }

            // Publish a message if we should
            if(publish){
                pubsub.publish(path+':change', oldValue, newValue);
            }

            publish = true;
        });

        // Wait for messages from pubsub, and update model
        subscribeToOuterChanges(this, function(path, oldValue, newValue){
            publish = false;
            setPropertyValue(path, newValue);
        });

        // Hydrate model with another object
        this.hydrate = function(args) {
            hydrate(this, args);
        };

        // Public api to get pubsub
        this.getPubsub = function() {
            return pubsub;
        };

        // Public api to know if model has a given prop
        this.hasProperty = function(path) {
            var target = this;
            var result = true;
            each(path.split('.'), function(i, prop){
                if (target[prop] !== undefined) {
                    target = target[prop];
                } else {
                    return result = false;
                }
            });
            return result;
        }

        return this;
    };

    /**
     * Generic pub/sub constructor.
     */
    var PubSub = function() {

        // Callbacks storage
        var callbacks = {};

        // Subscribe a callback for a change events
        this.subscribe = function(msg, callback) {
            callbacks[msg] = callbacks[msg] || [];
            if (callbacks[msg].indexOf(callback) === -1) {
                callbacks[msg].push(callback);
            }
        };

        // Unsusbscribe to a change event
        this.unsubscribe = function(msg, callback) {
            callbacks[msg] = callbacks[msg] || [];
            var index = callbacks[msg].indexOf(callback);
            if (index !== -1) {
                callbacks[msg].splice(index, 1);
            }
        };

        // Publish a change event, and trigger bound callbacks
        this.publish = function(msg) {
            callbacks[msg] = callbacks[msg] || [];
            for (var i = 0, len = callbacks[msg].length; i < len; i++) {
                callbacks[msg][i].apply(this, arguments);
            }
        };
    };

    /**
     * Route is an object checking if a url match with a certain pattern and method.
     *
     * @param {object} args is an object containing configuration elements.
     */
    var Route = function(args) {

        // Route url
        this.url = null;

        // Route url as a regex
        this.regexUrl = null;

        // Parameters to retrieve from any given url
        this.params = {};

        // Route http method. GET by default.
        this.method = 'GET';

        // Set the url
        this.setUrl = function(url) {
            if (typeof url === 'string') {
                this.url = url;
                return this;
            }
            throw 'Invalid url.';
        };

        // Set url as a regular expression
        this.setRegexUrl = function() {
            if (this.regexUrl = this.url) {
                var key,
                    marker;
                if (this.regexUrl.indexOf(window.location.host) === -1) {
                    this.regexUrl = window.location.host + this.regexUrl;
                }
                this.regexUrl = this.handleOptional(this.regexUrl);
                for (key in this.params) {
                    marker = '{' + key + '}';
                    if (this.regexUrl.indexOf(marker) === -1) {
                        throw 'Invalid number of params for url ' + this.url;
                    }
                    this.regexUrl = this.regexUrl.replace(marker, this.params[key]);
                }
                this.regexUrl += '$';
                return this;
            }
        };

        // Set url params
        this.setParams = function(params) {
            var shortcuts = {
                'number': '[0-9]*',
                'word': '[a-zA-Z0-9%]*'
            };
            if (typeof params === 'object') {
                each(params, function(prop, value){
                    if (shortcuts[value]) {
                        params[prop] = shortcuts[value];
                    }
                });
                this.params = params;
                return this;
            }
            throw 'Params must be an object.';
        };

        // Handle optional query parameters
        this.handleOptional = function(url) {
            url = url.replace(/\?/g, '\\\?');
            url = url.replace(/\(([^\(\)]*)\)/g, '(?:$1)?');
            return url;
        };

        // Extract parameters from an url according to expected parameters
        this.extractParamsFromUrl = function(url) {

            var params = {},
                that = this,
                regexUrl = this.handleOptional(this.url),
                tempUrl,
                prop,
                value,
                props = [];

            for (prop in this.params) {
                props.push(prop);
            }

            for (prop in this.params) {

                tempUrl = regexUrl;

                // Replace each component of the tempUrl by it's regex, and put it between parenthesis if it's the current prop
                for (var i = 0, len = props.length; i < len; i++) {
                    tempUrl = tempUrl.replace('{' + props[i] + '}', (props[i] === prop ? '(' + that.params[props[i]] + ')' : that.params[props[i]]));
                }

                if (value = new RegExp(tempUrl).exec(url)[1]) {
                    params[prop] = value;
                }
            }

            return params;
        };

        // Set the method
        this.setMethod = function(method) {
            if (method === 'GET' || method === 'POST' || method === 'GET|POST' || method === 'POST|GET') {
                this.method = method;
                return this;
            }
            throw 'Invalid method';
        };

        // Check if the route matches with a given url and method
        this.match = function(url, method) {
            return (new RegExp(this.regexUrl).test(url) || url === this.regexUrl) && new RegExp(this.method).test(method);
        };

        // Hydrate method with args
        hydrate(this, args);
        this.setRegexUrl();

        return this;
    };

    /**
     * View constructor.
     *
     * @param {object}      params  is containing all properties to build the view.
     * @param {Model|array} context is an object containing app model.
     */
    var View = function(params) {

        var context = params.context || modelStorage;

        // Utility functions

        function createTemplate(string) {
            return el(escapeSrc(string));
        }

        function escapeSrc(str) {
            return str.replace(/src="/g, 'src="#');
        }

        function unescapeSrc(str) {
            return str.replace(/^#/, '');
        }

        function bindContext(element, references, subscriptions) {

            if (!element) {
                return;
            }

            references    = references || {};
            subscriptions = subscriptions || [];

            function extractMarkers(string) {
                if (string) {
                    var MARKERS = /\{\{((?!\{\{|\}\}).)*\}\}/g;
                    var DELIMITERS = /\{\{|\}\}/g;
                    var markers = string.match(MARKERS);
                    if (markers && markers.length > 0) {
                        markers = markers.map(function(marker) {
                            return {
                                outer: marker,
                                inner: marker.replace(DELIMITERS, '').trim()
                            };
                        });
                        return markers.length > 0 ? markers : [];
                    }
                }
                return [];
            }

            function extractModelProps(string) {
                string = ('' + string).trim();

                var PROPERTY = /[a-zA-Z0-9\._]*/g;
                var props = string.match(PROPERTY);

                props = props.map(function(prop) {
                    if (prop) {
                        prop = replaceReferences(prop);
                        prop = findModelFromProp(prop) ? prop : '';
                        prop = prop.replace('.length', '').trim();
                    }
                    return prop;
                });

                var returned = {};

                return props.filter(function(prop){
                    if (prop) {
                        if(!returned[prop]){
                            returned[prop] = 1;
                        } else {
                            returned[prop]++;
                        }
                        if(returned[prop] === 1){
                            return true;
                        }
                    }
                    return false;
                });
            }

            function getValueOf(expr) {
                if (references) {
                    expr = replaceReferences(expr);
                }
                var result = guessValueOf(expr, context);

                return result === undefined ? '' : result;
            }

            function findModelFromProp(prop) {
                prop = prop.split('.');

                return context[prop[0]];
            }

            function replaceReferences(prop) {
                if (references) {
                    each(references, function(reference, realProp){
                        if (reference === prop) {
                            prop = realProp;
                            return false;
                        } else {
                            var pattern = '([\.\(|])*('+ reference +')([\.\)|])';
                            prop = prop.replace(new RegExp(pattern, 'g'), function(match,$1,$2,$3){
                                return ($1 ? $1 : '') + realProp + ($3 ? $3 : '');
                            });
                        }
                    });
                }
                return prop;
            }

            function initAndHandleChanges(prop, initFunc) {
                initFunc(getValueOf(prop));
                subscribeToChanges(prop, initFunc);
            }

            function getMsgFromProp(prop) {
                return prop.replace(/^[a-zA-Z0-9]+\.+/, '')+':change';
            }

            function subscribeToChanges(prop, func) {

                var model = findModelFromProp(prop);
                if (model) {
                    var msg = getMsgFromProp(prop);
                    var callback = function(msg, oldValue, newValue){
                        func(newValue);
                    };
                    // Subscribe to changes
                    model.getPubsub().subscribe(msg, callback);
                    // If references is defined, we are in a loop.
                    // We save subscriptions in case we have to unsubscribe
                    if (references) {
                        subscriptions.push({msg: msg, callback: callback, model: model});
                    }
                }
            }

            function unsubscribeToChanges(subscription) {
                subscription.model.getPubsub().unsubscribe(subscription.msg, subscription.callback);
            }

            function unsubscribeItem(itemSubscriptions) {
                each(itemSubscriptions, function(i, subscription) {
                    if (getTypeOf(subscription) === 'object') {
                        unsubscribeToChanges(subscription);
                    } else {
                        unsubscribeItem(subscription);
                    }
                });
            }

            var ELEMENT_NODE = 1;
            var TEXT_NODE    = 3;

            switch (element.nodeType) {

                case ELEMENT_NODE:

                    var attr;

                    if (attr = element.getAttribute('data-no-bind')) {
                        element.removeAttribute('data-no-bind');
                        return;
                    }

                    if (attr = element.getAttribute('data-loop')) {

                        var LOOP_REF    = / in .*/g;
                        var LOOP_OUTPUT = /.* in /g;

                        var from;
                        var insertMethod;
                        if (from = element.nextSibling) {
                            insertMethod = 'before';
                        } else if (from = element.previousSibling) {
                            insertMethod = 'after';
                        } else if (from = element.parentNode) {
                            insertMethod = 'append';
                        }
                        up(from);

                        element.removeAttribute('data-loop');
                        element.parentNode.removeChild(element);

                        var prop       = replaceReferences(attr.replace(LOOP_OUTPUT, ''));
                        var output     = attr.replace(LOOP_REF, '');
                        var loopMethod = insertMethod === 'after' ? eachReverse : each;

                        // Storages
                        var loopElements       = []; // For saving html elements generated
                        var loopItems          = []; // For saving objects to these elements
                        var itemsSubscriptions = []; // For saving subscriptions taken for each elements rendering

                        initAndHandleChanges(prop, function (items) {

                            // If no items, just remove all.
                            if (items.length === 0) {
                                each(loopElements, function (i, child) {
                                    // Handle effects if there are
                                    stage.handleLeaving(child, function () {
                                        child.parentNode.removeChild(child);
                                    });
                                });
                                loopElements = [];
                                loopItems    = [];
                                unsubscribeItem(itemsSubscriptions);
                                itemsSubscriptions = [];
                                return;
                            }

                            // Define where array comes to change.
                            var index = loopItems.length;
                            each(loopItems, function (i, loopItem) {
                                if (items.indexOf(loopItem) === -1) {
                                    index = i;
                                    return false;
                                }
                            });

                            // From the end, remove all items below the change
                            var temporaryRemoved = [];
                            eachReverse(loopItems, function (i, item) {
                                if (i >= index) {
                                    if (items.indexOf(item) === -1){
                                        var itemElement = loopElements[i]
                                        stage.handleLeaving(itemElement, function () {
                                            itemElement.parentNode.removeChild(itemElement);
                                        });
                                    } else {
                                        loopElements[i].parentNode.removeChild(loopElements[i]);
                                        temporaryRemoved.push(loopItems[i]);
                                    }
                                    unsubscribeItem(itemsSubscriptions[i]);
                                    loopElements.splice(i, 1);
                                    loopItems.splice(i, 1);
                                }
                            });

                            // Then add all item missing
                            loopMethod(items, function(i, item){
                                if (loopItems.indexOf(item) === -1) {
                                    // Reference is an object. We clone before processing to avoid collisions.
                                    if (references[output]) {
                                        references = JSON.parse(JSON.stringify(references));
                                    }
                                    references[output] = prop +'.'+ i;

                                    var itemSubscriptions = [];
                                    itemsSubscriptions.push(itemSubscriptions);

                                    var child = bindContext(element.cloneNode(true), references, itemSubscriptions);
                                    from[insertMethod](child);

                                    // Handle effects if there are, and item is new
                                    if (temporaryRemoved.indexOf(item) === -1) {
                                        stage.handleEntering(child);
                                    }

                                    loopElements.push(child);
                                    loopItems.push(item);
                                }
                            });
                        });

                        return;
                    }

                    if (attr = element.getAttribute('data-bind')) {

                        var tag   = element.tagName.toLowerCase();
                        var prop  = replaceReferences(attr);
                        var model = findModelFromProp(prop);

                        // Bind inputs to publish changes
                        if (tag === 'input' || tag === 'textarea' || tag === 'select') {

                            var msg = getMsgFromProp(prop);

                            // If it's a select input, a checkbox, a button or a file input, we listen to "change" event
                            if (tag === 'select' || (tag === 'input' && (element.type === 'radio' || element.type === 'checkbox'))) {
                                // Get function to run on click on the element, if there is
                                var clickEvent = element.getAttribute('data-click');
                                events.addListener('change', element, function(e) {
                                    var target = e.target || e.srcElement;
                                    var value = target.value;
                                    // If element is a checkbox and has no value assigned
                                    // By default it will be "on", but we will send true or false instead
                                    // Depending if it's checked or not
                                    if (target.type === 'checkbox' && value === 'on') {
                                        value = target.checked ? true : false;
                                    }
                                    var actualValue = value;
                                    // If there is a function to run on click on the element
                                    // Run it, and update actual value of target element
                                    if (clickEvent) {
                                        getValueOf(clickEvent);
                                        actualValue = target.value;
                                        if (target.type === 'checkbox' && value === 'on') {
                                            actualValue = target.checked ? true : false;
                                        }
                                    }
                                    // Publish change if needed
                                    // Which is not the case if actual value is not the same as before
                                    // Because it means that an update was already published
                                    if (value === actualValue) {
                                        model.getPubsub().publish(msg, null, value);
                                    }
                                });
                                if (clickEvent) {
                                    element.removeAttribute('data-click');
                                }
                            // If it's another input, we listen to input change a different way
                            } else {
                                var enterEvent = element.getAttribute('data-enter');
                                (function (enterEvent) {
                                    // New way (IE9+)
                                    if ("oninput" in element) {
                                        // Listen to key press on enter to run a function if provided
                                        if (enterEvent) {
                                            events.addListener('keypress', element, function (e) {
                                                if (e.which === 13) {
                                                    e.preventDefault();
                                                    var target = e.target || e.srcElement;
                                                    if (target.value) {
                                                        target.value = target.value + ' ';
                                                        model.getPubsub().publish(msg, null, target.value);
                                                    }
                                                    getValueOf(enterEvent);
                                                }
                                            });
                                        }
                                        // Keyup, keydown, keypress, paste ...
                                        events.addListener('input', element, function (e) {
                                            var target = e.target || e.srcElement;
                                            model.getPubsub().publish(msg, null, target.value);
                                        });
                                    // Old fashion way (IE8-)
                                    } else {
                                        events.addListener('keyup, keypress', element, function (e) {
                                            var target = e.target || e.srcElement;
                                            // Listen to key press on enter to run a function if provided
                                            if (enterEvent && e.which === 13) {
                                                e.preventDefault();
                                                if (target.value) {
                                                    target.value = target.value + ' ';
                                                    model.getPubsub().publish(msg, null, target.value);
                                                }
                                                getValueOf(enterEvent);
                                                return;
                                            }
                                            model.getPubsub().publish(msg, null, target.value);
                                        });
                                    }
                                }(enterEvent));
                            }
                        }

                        initAndHandleChanges(prop, function(value){
                            // If element is an user input
                            if (tag === 'input' || tag === 'textarea' || tag === 'select') {
                                // If it's a checkbox or a radio, turn on checked attr if its value is identical to the one retrieved
                                if (element.type === 'radio' || element.type === 'checkbox') {
                                    if (value === true || value === element.value) {
                                        element.checked = 'checked';
                                    } else {
                                        element.checked = '';
                                    }
                                // For others input, just replace the value
                                } else {
                                    element.value = value;
                                }
                            // If element is not an input, replace its innerHTML by the value
                            } else {
                                element.innerHTML = value;
                            }
                        });

                        element.removeAttribute('data-bind');
                    }

                    if (attr = element.getAttribute('data-show')) {
                        each(extractModelProps(attr), function(i, prop){
                            var expr = attr;
                            initAndHandleChanges(prop, function(){
                                up(element);
                                if (getValueOf(expr) === true) {
                                    element.show();
                                    stage.handleEntering(element);
                                } else {
                                    element.hide();
                                    stage.handleLeaving(element);
                                }
                            });
                        });
                        element.removeAttribute('data-show');
                    }

                    if (attr = element.getAttribute('data-click')) {
                        (function(attr) {
                            events.addListener('click', element, function(e) {
                                getValueOf(attr);
                            });
                        }(attr));
                        element.removeAttribute('data-click');
                    }

                    if (attr = element.getAttribute('data-double-click')) {
                        (function(attr) {
                            events.addListener('dblclick', element, function(e) {
                                getValueOf(attr);
                            });
                        }(attr));
                        element.removeAttribute('data-double-click');
                    }

                    if (attr = element.getAttribute('data-submit')) {
                        (function(attr) {
                            events.addListener('submit', element, function(e) {
                                getValueOf(attr);
                            });
                        }(attr));
                        element.removeAttribute('data-submit');
                    }

                    if (attr = element.getAttribute('data-effect-in')) {
                        stage.effectIn(element, attr);
                        element.removeAttribute('data-effect-in');
                    }

                    if (attr = element.getAttribute('data-effect-out')) {
                        stage.effectOut(element, attr);
                        element.removeAttribute('data-effect-out');
                    }

                    if (element.attributes) {
                        each(element.attributes, function(i, attr){
                            var content = attr.value;
                            if (content) {
                                // Look for moustache markers
                                var markers = extractMarkers(content);
                                if (markers.length > 0) {
                                    var updateAttr = function(){
                                        attr.value = content;
                                        each(markers, function(i, marker){
                                            attr.value = attr.value.replace(marker.outer, getValueOf(marker.inner));
                                            if (attr.name === 'src') {
                                                attr.value = unescapeSrc(attr.value);
                                            }
                                        });
                                    };
                                    // Initialize value
                                    updateAttr();
                                    // Wait for a changes for any reference
                                    each(extractModelProps(content), function(i, prop){
                                        subscribeToChanges(prop, updateAttr);
                                    });
                                } else {
                                    if (attr.name === 'src') {
                                        attr.value = unescapeSrc(attr.value);
                                    }
                                }
                            }
                        });
                    }

                    break;

                case TEXT_NODE:
                    // Save locally the content of the textnode
                    var textContent = element.textContent ? 'textContent' : 'nodeValue'; // IE8 polyfill
                    var content = element[textContent];
                    if (content) {
                        // Look for moustache markers
                        var markers = extractMarkers(content);
                        if (markers.length > 0) {
                            var updateContent = function(){
                                element[textContent] = content;
                                each(markers, function(i, marker){
                                    element[textContent] = element[textContent].replace(marker.outer, getValueOf(marker.inner));
                                });
                            };
                            // Initialize the value
                            updateContent();
                            // If marker contains references to model properties
                            each(extractModelProps(content), function(i, prop){
                                // Wait for a changes for any reference
                                subscribeToChanges(prop, updateContent);
                            });
                        }
                    }
                    break;
            }

            // Recursive binding
            if (element.childNodes && element.childNodes.length > 0) {
                each(element.childNodes, function(i, child){
                    bindContext(child, references, subscriptions);
                });
            }

            return element;
        }

        // Define local vars we need

        var parentView;
        var root;
        var template;
        var templateUrl;

        function getRoot() {
            root = getTypeOf(root) === 'string' ? first(root) : root;
            return up(root);
        }

        each(params, function(prop, value){
            switch (prop) {
                case 'root':
                    root = value;
                    break;
                case 'template':
                    template = createTemplate(data);
                    break;
                case 'templateUrl':
                    templateUrl = getTypeOf(value) === 'string' ? value : undefined;
                    break;
            };
        });

        /**
         * [extends description]
         * @param  {[type]} parentView [description]
         * @return {[type]}            [description]
         */
        this.childOf = function(viewInstance) {
            if (viewInstance instanceof View === false) {
                throw 'A view can only extend another view.';
            } else if (viewInstance === this) {
                throw 'A view can not extend itself.';
            }
            parentView = viewInstance;
            return this;
        };

        this.isRendered = function() {
            return template !== undefined && isInDOM(template);
        }

        /**
         * Render view in DOM.
         *
         * @param  {Function} callback
         */
        this.render = function(preTransition, postTransition) {

            function tryIntegrate() {
                // If root could be found and template is not the one to replace
                root = getRoot();
                if (root) {
                    if (root.firstChild !== template) {
                        // Remove the current element in root, and insert template when transition is complete
                        stage.handleLeaving(root.firstChild, function(){
                            root.html(template.show());
                            if (preTransition) {
                                setTimeout(function () {
                                    preTransition();
                                }, 0);
                            }
                            stage.handleEntering(template, postTransition);
                        });

                    } else {
                        if (preTransition){
                            setTimeout(function () {
                                preTransition();
                            }, 0);
                        }
                        if (postTransition) {
                            setTimeout(function () {
                                postTransition();
                            }, 0);
                        }
                    }
                } else {
                    throw 'Root was not found.';
                }
            }

            // If view has a template
            if (template) {
                // If template is not in document, we include it
                if (isInDOM(template) === false) {
                    // If view extends another view, render it first
                    if (parentView && parentView.isRendered() === false) {
                        // But include element in preTransition
                        parentView.render(function(){
                            tryIntegrate();
                        });
                    } else {
                        tryIntegrate();
                    }
                } else {
                    tryIntegrate();
                }

            // If view does not have a template
            } else {
                // If a template url has been given
                if (templateUrl) {
                    var that = this;
                    // Get it from the server
                    request({
                        method: 'GET',
                        url: templateUrl,
                        data: { t_ref: new Date().getTime() },
                        async: false,
                        success: function(data) {
                            // Build a template with the response
                            template = createTemplate(data);
                            bindContext(template);
                            // Re-call render to display it
                            that.render(preTransition, postTransition);
                        },
                        error: function() {
                            throw 'Template ' + templateUrl + ' could not be loaded.';
                        }
                    });

                    return;
                }

                throw 'No template or templateUrl has been given for the view.';
            }
        };
    };

    // ================
    // Services
    // ================

    // Storage for init functions to run before returning the app.
    var initStorage = [];

    /**
     * General pub/sub of the app.
     */
    var channel = new PubSub();

    /**
     * Dom events service.
     */
    var events = new function() {

        var dom       = document;
        var listeners = {};
        var that      = this;

        // Check if dom has an event stored in this.listeners
        function hasListener(evt) {
            return typeof listeners[evt] !== 'undefined';
        }

        // Transform comma separated event into an array
        function extractEvents(evt) {
            return evt.split(',').map(function(a) {
                return a.trim();
            });
        }

        // Create a custom event
        function createEvent(type) {
            var event;
            if (document.createEvent) {
                event = document.createEvent("HTMLEvents");
                event.initEvent(type, true, true);
            } else {
                event = document.createEventObject();
                event.eventType = type;
            }
            event.eventName = type;
            return event;
        }

        // Dispatch event
        function dispatchEvent(event, element) {
            if (document.createEvent) {
                element.dispatchEvent(event);
            } else {
                element.fireEvent("on" + event.eventType, event);
            }
        }

        // Duplicate an event
        function duplicateEvent(e) {

            // With the delegate method, the event target can be a textnode or even an empty node.
            // In those cases, it's the parent which has our interest
            function findRealElement(el) {
                if (el.nodeType !== 1 || (el.tagName !== 'INPUT' && el.tagName !== 'TEXTAREA' && el.tagName !== 'SELECT' && !el.innerHTML)) {
                    while (el.nodeType !== 1 || (el.tagName !== 'INPUT' && el.tagName !== 'TEXTAREA' && el.tagName !== 'SELECT' && !el.innerHTML)) {
                        el = el.parentNode;
                    }
                } else {
                    if (el.parentNode.tagName === 'A' || el.parentNode.tagName === 'BUTTON') {
                        el = el.parentNode;
                    }
                }
                return el;
            }

            var copy = {};
            for(var prop in e){
                copy[prop] = e[prop];
            }
            // Unify preventDefault and return value
            copy.returnValue = null;
            copy.preventDefault = function(){
                e.preventDefault ? e.preventDefault() : e.returnValue = false;
                this.returnValue = false;
            }
            copy.target = copy.srcElement = findRealElement(e.target || e.srcElement);

            return copy;
        }

        // Check if event already has a target for a given selector and function
        function hasTarget(evt, selector, fn) {
            for (var i = 0, len = listeners[evt].length; i < len; i++) {
                if (selector === listeners[evt][i].selector && fn === listeners[evt][i].fn) {
                    return listeners[evt][i];
                }
            }
            return false;
        }

        // Build an object with selector and fn attributes
        function buildTarget(selector, fn) {
            return {
                selector: selector,
                fn: fn
            }
        }

        // Get all targets for a given event and selector
        function getAllTargets(evt, selector) {
            var targets = [];
            each(listeners[evt], function(i, target){
                if (target.selector === selector){
                    targets.push(target);
                }
            });
            return targets;
        }

        // Find a target corresponding to event target, and run its function
        function delegate(e) {
            if (listeners[e.type] !== undefined) {
                var event = duplicateEvent(e);
                each(listeners[e.type], function(i, target){
                    if (selectorMatches(event.target, target.selector)) {
                        target.fn.call(event.target, event);
                        if (event.returnValue === false) {
                            return false;
                        }
                    }
                });
            }
        }

        /**
         * Add a cross-browser event listener to an element
         *
         * @param {string}      evt
         * @param {HTMLElement} el
         * @param {Function}    fn
         */
        this.addListener = function(evt, el, fn) {
            each(extractEvents(evt), function(i, e){
                if (el.addEventListener) {
                    el.addEventListener(e, fn, false);
                } else if (el.attachEvent) {
                    el.attachEvent("on" + e, function() {
                        return (fn.call(window.event.srcElement, window.event));
                    });
                } else {
                    throw 'Given element can not have a listener.';
                }
            });
        };

        /**
         * Remove an event listener from an element
         *
         * @param {string}      evt
         * @param {HTMLElement} el
         * @param {Function}    fn
         */
        this.removeListener = function(evt, el, fn) {
            each(extractEvents(evt), function(i, e){
                if (el.removeEventListener) {
                    el.removeEventListener(e, fn, false);
                } else if (el.detachEvent) {
                    el.detachEvent("on" + e, function() {
                        return (fn.call(window.event.srcElement, window.event));
                    });
                }
            });
        };

        /**
         * Add an event listener to dom elements matching with a given css selector
         *
         * @param  {string}   evt      can be a comma separated events
         * @param  {string}   selector is a css selector
         * @param  {Function} fn
         */
        this.on = function(evt, selector, fn) {
            each(extractEvents(evt), function(i, e){
                // It's a non registered event on dom
                if (!hasListener(e)) {
                    // Add event listener to the dom directly
                    that.addListener(e, dom, delegate);
                    // Store the listener, and create an empty array to save targets
                    listeners[e] = [];
                }
                // If selector has not been stored for this target, we store it
                if (!hasTarget(e, selector)) {
                    listeners[e].push(buildTarget(selector, fn));
                }
            });
        };

        /**
         * Remove an event listener to dom elements matching with a given css selector
         *
         * @param  {string}   evt      can be a comma separated events
         * @param  {string}   selector is a css selector
         * @param  {Function} fn
         */
        this.off = function(evt, selector, fn) {
            each(extractEvents(evt), function(i, e){
                // If a listener is processing on dom for a given event
                if (hasListener(e)) {
                    var target = hasTarget(e, selector, fn);
                    if (target) {
                        listeners[e].splice(listeners[e].indexOf(target), 1);
                        // If the listener no longer have targets, remove it from the dom
                        if (listeners[e].length === 0) {
                            that.removeListener(e, dom, delegate);
                            delete listeners[e];
                        }
                    }
                }
            });
        };

        /**
         * Add an event to dom elements matching with a given css selector
         *
         * @param  {string}   evt      can be a comma separated events
         * @param  {string}   selector is a css selector
         * @param  {Function} fn
         */
        this.trigger = function(evt, selector) {

            if (isHTMLElement(selector) === true || selector === window || selector === document) {
                each(extractEvents(evt), function(i, e){
                    dispatchEvent(createEvent(e), selector);
                });
                return;
            }

            var elements = find(selector);
            if (getTypeOf(elements) !== 'array') {
                elements = [elements];
            }
            if (elements.length > 0){
                var shared = {};
                each(extractEvents(evt), function(i, e){
                    if (listeners[e] !== undefined) {
                        each(getAllTargets(e, selector), function(i, target){
                            each(elements, function(i, element){
                                var event = createEvent(e);
                                event.preventDefault = function(){
                                    shared.returnValue = false;
                                }
                                target.fn.call(element, event);
                                return shared.returnValue;
                            });
                            return shared.returnValue;
                        });
                    }
                });
            }
        };

        /**
         * Remove all listeners attached to css selector
         */
        this.clear = function() {
            for (var evt in listeners) {
                this.removeListener(evt, dom, delegate);
            }
            listeners = {};
            // Relaunch the controller initialization, based on event
            controllers.init();
        };
    };

    /**
     * Controllers handler service.
     */
    var controllers = new function() {

        var storage = {};
        var that = this;

        function hasController(name) {
            return storage[name] !== undefined ? true : false;
        }

        this.add = function(name) {
            if (hasController(name) === true) {
                throw 'A controller with the name '+ name +' has already been registered.';
            }
            storage[name] = new Controller(name);
            return storage[name];
        };

        this.delegate = function(e, inHistory) {

            var target = e.target;

            // In some cases, a click on a link must not activate a controller action, but just call a regular url.
            // In those cases, just add an attribute no-follow="true" in the <a> tag.
            if (!target.getAttribute('no-follow')) {

                var url = target.tagName === 'FORM' ? target.action : target.href;
                var method = target.tagName === 'FORM' ? target.method.toUpperCase() : 'GET';
                var action;
                var response;

                // If url end with a '#', it's a fake link. We prevent default behavior (to avoid url update and popstate);
                if (/#$/.test(url)) {
                    e.preventDefault();
                    return;
                }

                // Make a loop through each controller and ask if they have an action matching for the given url.
                each(storage, function(i, ctrl){
                    if (action = ctrl.hasMatchingAction(url, method)) {
                        e.preventDefault();
                        var actionHistory = action.history;
                        action.history = inHistory !== undefined ? inHistory : actionHistory;
                        action.run.call(action, e, url, method);
                        action.history = actionHistory;
                        response = false;
                    }
                });

                return response;
            }
        };

        this.init = function() {
            // Add an event on each element with an href attribute
            events.on('click', '[href]', that.delegate);
            // Add an event on each form
            events.on('submit', 'form', that.delegate);
        };

        initStorage.push(this.init);
    };

    /**
     * Simple js and css files inclusion service.
     */
    var files = new function() {

        // Container for files in process
        var processing = {};

        /**
         * Include a js or css file, and provide a callback
         *
         * @param  {string]}  url        is the url where file is stored
         * @param  {Function} callback   is the function to run when file is included
         * @param  {string}   forcedType is the forced type of the file to include ('css' or 'js')
         */
        this.include = function(url, callback, forcedType) {

            if (!url) {
                throw 'No url given for file inclusion.';
            }

            // Get file type: js or css
            function getFileType(url) {
                var TYPES = {
                    'js': /\.js$/,
                    'css': /\.css$/
                };

                if(forcedType && TYPES[forcedType]){
                    return forcedType;
                }

                for (var t in TYPES) {
                    if (TYPES[t].test(url)) {
                        return t;
                    }
                }

                throw 'files.include allows you to include css or js files only';
            }

            // Check if file is already included in head
            function isIncluded(url, type) {
                var tag  = type === 'js' ? 'script' : 'link';
                var attr = type === 'js' ? 'src' : 'href';

                return typeof find(tag + '[' + attr + '*="' + url + '"]')[0] !== 'undefined';
            }

            // Create a new file
            function createFile(url, type) {

                var tagName = type === 'js' ? 'script' : 'link';
                var tagAttr = type === 'js' ? 'src' : 'href';
                var tagType = type === 'js' ? 'text/javascript' : 'text/css';
                var tagRel  = type === 'js' ? null : 'stylesheet';

                var file      = document.createElement(tagName);
                file.type     = tagType;
                file[tagAttr] = url;
                file.rel      = tagRel;

                processing[url] = file;

                return file;
            }

            // Check if a file is processing
            function isProcessing(url) {
                return typeof processing[url] !== 'undefined';
            }

            // Add a callback on the waiting list
            function addWaitingCallback(url, callback) {

                var processingFile = processing[url];
                if (processingFile) {
                    // When file is loaded, remove it from processing object
                    // Then, run the callback if provided
                    events.addListener('load', processingFile, function() {
                        if (processing[url]) {
                            delete processing[url];
                        }
                        if (callback) {
                            callback();
                        }
                    });
                }
            }

            var file;
            var type = getFileType(url);

            // If file is not processing, create it.
            // Otherwise, retrieve it from processing object.
            if (isProcessing(url) === false && isIncluded(url, type) === false) {
                file = createFile(url, type);
            } else {
                file = processing[url];
            }

            // If file is processing
            // Insert it in the head tag if it's not already done
            // Add a callback waiting for the file to be loaded
            if (isProcessing(url)) {
                if (isIncluded(url, type) === false) {
                    first('head').appendChild(file);
                }
                if (callback) {
                    addWaitingCallback(url, callback);
                }

            // If file is already loaded
            // Run the callback if provided
            } else {
                if (callback) {
                    callback();
                }
            }
        };
    };

    /**
     * Browser history handler service.
     */
    var historic = new function(){

        var callbacks = [];
        var index     = -1;

        // Update the url
        function updateUrl(url) {
            window.history.pushState({ index: index }, '', url);
        }

        // Load an entry
        function loadEntry(index) {
            if (callbacks[index]) {
                callbacks[index]();
                return true;
            }
            return false;
        }

        // Add an entry
        this.addEntry = function(url, callback) {
            if (window.history.pushState !== undefined) {
                index++;
                if (callbacks.length - 1 > index) {
                    callbacks.splice(index, callbacks.length - index);
                }
                callbacks[index] = callback;
                updateUrl(url);
            }
        };

        // Initialize by setting up a listener waiting for popstate storing or loading function
        this.init = function() {
            events.addListener('load', window, function(){
                // We wrap the listener in a setTimeout because of webkit browsers which emit a popstate when page load (safari).
                // Without it, the listener catches it, and the page reload indefinitely.
                setTimeout(function() {
                    events.addListener('popstate', window, function(e) {

                        // Try to load callback if stored
                        if (window.history.state) {
                            index = window.history.state.index;
                            if (loadEntry(index)) {
                                return false;
                            }
                        }

                        // Try to find a controller
                        if (redirect(window.location.href, false) !== undefined) {
                            return false;
                        }

                        // In last case, reload
                        window.location.replace(window.location.href);
                    });
                }, 1);
            });
        };

        initStorage.push(this.init);
    };

    /**
     * Simple local storage service.
     * Do not affect values already stored in memory.
     */
    var memory = new function() {

        var storage  = localStorage || globalStorage || {};
        var rootName = 'app_memory';
        var root     = storage[rootName] ? JSON.parse(storage[rootName]) : {};

        /**
         * Set a value in memory.
         *
         * @param {string} path  is the path to the property (dot.separated)
         * @param {mixed}  value is the value to save in this property
         */
        this.set = function(path, value) {
            var ref = root;
            each(path.split('.'), function(i, prop, len){
                if (i < (len - 1)) {
                    if (ref[prop] === undefined) {
                        ref[prop] = {};
                    }
                    ref = ref[prop];
                } else {
                    ref[prop] = value;
                }
            });
            storage[rootName] = JSON.stringify(root);
        };

        /**
         * Add an item in a collection in memory.
         *
         * @param {string} path is the path to the property (dot.separated)
         * @param {mixed}  item is the item to add in the collection
         */
        this.add = function(path, item) {
            var collection = guessValueOf(path, root);
            if (getTypeOf(collection) !== 'array') {
                throw path +' is not an array.';
            }
            collection.push(item);
            storage[rootName] = JSON.stringify(root);
        };

        /**
         * Get a value in memory.
         *
         * @param {string} path is the path to the property (dot.separated)
         * @return {mixed}
         */
        this.get = function(path) {
            return guessValueOf(path, root);
        };

        /**
         * Remove a value from memory.
         *
         * @param {string} path is the path to the property (dot.separated)
         */
        this.remove = function(path) {
            var ref = root;
            each(path.split('.'), function(i, prop, len){
                if (i < (len - 1)) {
                    if (ref[prop] !== undefined) {
                        ref = ref[prop];
                    }
                } else {
                    delete ref[prop];
                }
            });
            storage[rootName] = JSON.stringify(root);
        };

        /**
         * Delete all values from memory.
         */
        this.clear = function() {
            root = {};
            delete storage[rootName];
        };
    };

    /**
     * Model handler service.
     * Save and return models.
     */
    var modelStorage = {};
    var models = new function() {

        // Add a model
        this.add = function(name, model) {
            if (modelStorage[name]) {
                throw 'Model with name "'+ name +'" is already registered.';
            } else if (getTypeOf(model) !== 'object') {
                throw 'Model must be an JSON.';
            }

            modelStorage[name] = new Model(model);

            return modelStorage[name];
        }

        // Get a model
        this.get = function(name) {
            if (!modelStorage[name]) {
                throw 'Model with name "'+ name +'" is not registered.';
            }
            return modelStorage[name];
        }
    };

    /**
     * Overrides handler service.
     */
    var overrides = new function() {

        var init = function() {

            // HTMLElements
            // ------------

            // Overrive each HTMLElement to give it an up() function,
            // Allowing them to be overriden at any time to retrieve jQuery like methods (before, after, prepend, etc...).
            // It is unecessary to call it if element has been created with app.el() method.
            if (typeof HTMLElement.prototype.up !== 'function') {
                HTMLElement.prototype.up = function() {
                    return up(this);
                }
            } else {
                throw 'HTMLElement already have an up() method.';
            }
        };

        initStorage.push(init);
    };

    /**
     * GET response handler service.
     * Store and retrieve server response for a given url.
     */
    var pager = new function() {

        // Server responses storage
        var responses = {};

        // Check if response already stored
        this.hasResponse = function(url) {
            return typeof responses[url] !== 'undefined';
        };

        // Add a new response
        this.addResponse = function(url, response) {
            if (!this.hasResponse(url)) {
                responses[url] = response;
            }
        };

        // Retrieve a response
        this.getResponse = function(url) {
            if (this.hasResponse(url)) {
                return responses[url];
            }
            return null;
        };

        // Remove a response
        this.removeResponse = function(url) {
            if (this.hasResponse(url)) {
                delete responses[url];
            }
        };

        // Remove all responses
        this.clear = function() {
            responses = {};
        };
    };

    /**
     * Services container.
     */
    var services = new function() {

        var container = {};

        // Check if a service with an identical alias has already been registered
        function hasService(name) {
            return container[name] !== undefined;
        }

        /**
         * Add a service in container
         *
         * @param {string} name
         * @param {object} obj
         */
        this.add = function(name, obj) {
            if (hasService(name)) {
                throw 'A service with name "' + name + '" has already been registered.';
            }
            container[name] = obj;
            return this;
        };

        /**
         * Get a service from the container.
         *
         * @param  {string} name
         * @return {object}
         */
        this.get = function(name) {
            if (hasService(name) === false) {
                throw 'Service "' + name + '" was not found.';
            }
            return container[name];
        }
    };

    /**
     * Handle effects on element entering and leaving the dom.
     */
    var stage = new function() {

        var effectsIn   = [];
        var effectsOut  = [];
        var elementsIn  = [];
        var elementsOut = [];

        this.effectIn = function(element, effect) {
            if (element && effect) {
                if (elementsIn.indexOf(element) === -1) {
                    elementsIn.push(element);
                    effectsIn.push(effect);
                }
            }
        };

        this.effectOut = function(element, effect) {
            if (element && effect) {
                if (elementsOut.indexOf(element) === -1) {
                    elementsOut.push(element);
                    effectsOut.push(effect);
                }
            }
        };

        this.handleEntering = function(element, callback) {
            var index = elementsIn.indexOf(element);
            if (index !== -1 && isInDOM(element)) {
                element.up()[effectsIn[index]](null, callback);
            } else {
                if (callback) {
                    callback();
                }
            }
        };

        this.handleLeaving = function(element, callback) {
            var index = elementsOut.indexOf(element);
            if (index !== -1 && isInDOM(element)) {
                element.up()[effectsOut[index]](null, callback);
            } else {
                if (callback) {
                    callback();
                }
            }
        };
    };

    /**
     * Views handler service.
     * Save and return views.
     */
    var views = new function() {

        var storage = {};

        // Add a view
        this.add = function(name, params, context) {

            if (storage[name]) {
                throw 'View with name "'+name+'" is already registered.';
            } else if (getTypeOf(params) !== 'object') {
                throw 'View params must be a JSON.';
            } else if (context && getTypeOf(context) !== 'object' && getTypeOf(context) !== 'array'){
                throw 'View context must be JSON or an array of JSON';
            }

            storage[name] = new View(params, context);

            return storage[name];
        }

        // Get a view
        this.get = function(name) {
            if (!storage[name]) {
                throw 'View with name "'+name+'" is not registered.';
            }
            return storage[name];
        }
    };

    // ====================
    // Initialization
    // ====================

    // Launch all needed init functions before returning the app.
    each(initStorage, function(i, initFunc) {
        initFunc();
    });

    // Try to redirect to the good controller when window is fully loaded
    events.addListener('load', window, function(){
        redirect(window.location.href, false);
    });

    // ====================
    // Public API
    // ====================

    return {

        // Infos
        authors: authors,
        version: version,

        // Services
        channel: channel,
        controllers: controllers,
        events: events,
        files: files,
        models: models,
        views: views,
        memory: memory,
        services: services,

        // Utility methods
        el: el,
        find: find,
        first: first,
        redirect: redirect,
        request: request
    };
}));
