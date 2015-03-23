(function() {
    'use strict';

    /* istanbul ignore next */
    if (typeof define === 'function' && define.amd) {
        define(['./MappedLists'], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(require('./MappedLists'));
    } else {
        throw Error("no module loader found");
    }

    function factory(MappedLists) {

        /**
         * A "Subset" object encapsulates all the functionalities required to
         * manage a certain type (subset) of selectors.
         * @param re The regular expression to test if a selector is of the type
         * corresponding to this subset.
         * @param extractor {Function} A function which takes a DOM element and
         * returns a string of keys of this elements that match this subset.
         * For example, in the IDs subset this method will return an array with
         * at most one value - the element's id.
         * @param ci {Boolean} Is this subset case insensitive?
         * @constructor
         * @private
         */
        function Subset(re, extractor, ci) {
            var mappedLists = new MappedLists();
            this.isOfType = function(selector) {
                return re.test(selector);
            };
            this.extractElementKeys = extractor;
            this.add = function(key, data) {
                mappedLists.add(ci ? key.toLowerCase() : key, data);
                return this;
            };
            this.remove = function(key, data, comp) {
                mappedLists.remove(ci ? key.toLowerCase() : key, data, comp);
                return this;
            };
            this.get = function(key) {
                return mappedLists.get(ci ? key.toLowerCase() : key);
            };
        }

        return function() {

            var subsets = [];

            // Note: The order of subsets in this array matters!
            // It determined the priority of checking elements against
            // subsets.

            // ID selectors subset
            subsets.push(
                new Subset(
                    /^#.+$/,
                    function(el) {
                        return el.id ? ["#" + el.id] : [];
                    }
                )
            );

            // CLASS selectors subset
            subsets.push(
                new Subset(
                    /^\..+$/,
                    function(el) {
                        var res = [], classes = el.className;
                        if (typeof classes === 'string')
                            res = classes.split(/\s+/);
                        // for SVG elements:
                        else if (typeof classes === 'object' && 'baseVal' in classes)
                            res = classes.baseVal.split(/\s+/);
                        return res.map(function(r) {
                            return "." + r;
                        });
                    }
                )
            );

            // TAG selectors subset
            subsets.push(
                new Subset(
                    /^[^\*\.#].*$/,
                    function(el) {
                        return el.nodeName ? [el.nodeName] : [];
                    },
                    true // case insensitive
                )
            );

            // other selectors subset
            subsets.push(
                new Subset(
                    /^\*$/,
                    function(el) {
                        return ['*'];
                    }
                )
            );

            return subsets;

        };

    }
}());
