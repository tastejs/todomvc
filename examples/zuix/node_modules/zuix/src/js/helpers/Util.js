/*
 * Copyright 2015-2017 G-Labs. All Rights Reserved.
 *         https://genielabs.github.io/zuix
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*
 *
 *  This file is part of
 *  zUIx, Javascript library for component-based development.
 *        https://genielabs.github.io/zuix
 *
 * @author Generoso Martello <generoso@martello.com>
 */

'use strict';

// Generic utility class
module.exports = {

    isIE: function() {
        return (window.navigator.userAgent.indexOf('Trident') > 0);
    },

    isNoU: function(obj) {
        return (typeof obj === 'undefined' || obj === null);
    },

    isFunction: function(f) {
        return typeof f === 'function';
    },

    objectEquals: function(x, y) {
        if (x === null || x === undefined || y === null || y === undefined) {
            return x === y;
        }
        // after this just checking type of one would be enough
        if (x.constructor !== y.constructor) {
            return false;
        }
        // if they are functions, they should exactly refer to same one (because of closures)
        if (x instanceof Function) {
            return x === y;
        }
        // if they are regexps, they should exactly refer to same one (it is hard to better equality check on current ES)
        if (x instanceof RegExp) {
            return x === y;
        }
        if (x === y || x.valueOf() === y.valueOf()) {
            return true;
        }
        if (Array.isArray(x) && x.length !== y.length) {
            return false;
        }

        // if they are dates, they must had equal valueOf
        if (x instanceof Date) {
            return false;
        }

        // if they are strictly equal, they both need to be object at least
        if (!(x instanceof Object)) {
            return false;
        }
        if (!(y instanceof Object)) {
            return false;
        }

        // recursive object equality check
        const p = Object.keys(x);
        return Object.keys(y).every(function(i) {
                return p.indexOf(i) !== -1;
            }) &&
            p.every(function(i) {
                return util.objectEquals(x[i], y[i]);
            });
    },

    propertyFromPath: function(o, s) {
        if (typeof s !== 'string') {
            return;
        }
        s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
        s = s.replace(/^\./, ''); // strip a leading dot
        const a = s.split('.');
        let ref = o;
        for (let i = 0; i < a.length; ++i) {
            const k = a[i];
            if (typeof ref[k] !== 'undefined') {
                ref = ref[k];
            } else {
                return;
            }
        }
        return ref;
    },

    cloneObject: function cloneObject(obj) {
        if (obj === null || typeof obj !== 'object') {
            return obj;
        }
        // Give temp the original obj's constructor
        // var temp = obj.constructor();
        // for (var key in obj)
        //    temp[key] = cloneObject(obj[key]);
        let temp = obj;
        try {
            temp = obj.constructor();
            for (let key in obj) {
                if (obj.hasOwnProperty(key)) {
                    temp[key] = cloneObject(obj[key]);
                }
            }
        } catch (e) {
            // TODO: should warn when clone is not possible
        }
        return temp;
    },

    hasPassiveEvents: function hasPassiveEvents() {
        let supportsPassive = false;
        try {
            const opts = Object.defineProperty({}, 'passive', {
                get: function() {
                    supportsPassive = true;
                }
            });
            window.addEventListener('testPassive', null, opts);
            window.removeEventListener('testPassive', null, opts);
        } catch (e) {}
        return supportsPassive;
    }

};
