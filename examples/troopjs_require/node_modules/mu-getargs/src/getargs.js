(function() {
    'use strict';

    /* istanbul ignore next */
    if (typeof define === 'function' && define.amd) {
        define([], getargsFactory);
    } else if (typeof exports === 'object') {
        module.exports = getargsFactory();
    } else {
        throw Error("no module loader found");
    }

    function getargsFactory() {

        /**
         * @class mu-lib.getargs
         * @mixin Function
         * @static
         */

        var UNDEFINED,
            STR_SUBSTRING = String.prototype.substring,
            STR_SLICE = String.prototype.slice,
            RE_STRING = /^(["']).*\1$/,
            RE_BOOLEAN = /^(?:false|true)$/i,
            RE_BOOLEAN_TRUE = /^true$/i,
            RE_DIGIT = /^\d+$/;

        /**
         * Function that calls on a String, to parses it as function parameters delimited by commas.
         *
         *    " 1  , '2' , 3  ,false,5 "
         *
         * results in
         *
         *    [ 1, "2", 3, false, 5]
         *
         *
         * and
         *
         *    "'1, 2 ',  3,\"4\", 5 "
         *
         * results in
         *
         *    [ "1, 2 ", 3, "4", 5 ]
         *
         * Also handles named parameters.
         *
         *    "1, two=2, 3, 'key.four'=4, 5"
         *
         * results in
         *
         *    result = [1, 2, 3, 4, 5]
         *    result["two"] === result[1]
         *    result["key.four"] === result[3]
         *
         * @method constructor
         * @return {Array} the array of parsed params.
         */
        return function getargs(str) {

            str = str || this;

            if (!(typeof str == 'string' || str instanceof String))
                throw Error("First argument must be a string");

            var values = [];
            var from;
            var to;
            var index;
            var length;
            var quote = false;
            var key;
            var c;

            // Try to extract value from the specified string range.
            function extract(from, to) {
                // Nothing captured.
                if (from === to)
                    return;

                var value = STR_SUBSTRING.call(str, from, to);
                if (RE_STRING.test(value)) {
                    value = STR_SLICE.call(value, 1, -1);
                }
                else if (RE_BOOLEAN.test(value)) {
                    value = RE_BOOLEAN_TRUE.test(value);
                }
                else if (RE_DIGIT.test(value)) {
                    value = +value;
                }

                // Store value by index.
                values.push(value);

                // Store value with key or just index
                if (key !== UNDEFINED) {
                    values[key] = value;
                    // Reset key
                    key = UNDEFINED;
                }
            }

            // Iterate string
            for (index = from = to = 0, length = str.length; index < length; index++) {

                // Get char
                c = str.charAt(index);

                switch (c) {
                    case "\"" :
                    /* falls through */
                    case "'" :
                        // If we are currently quoted...
                        if (quote === c) {
                            // Stop quote
                            quote = false;

                            // Update to
                            to = index + 1;
                        }
                        // Otherwise
                        else if (quote === false) {
                            // Start quote
                            quote = c;

                            // Update from/to
                            from = to = index;
                        }
                        break;

                    case " " :
                    /* falls through */
                    case "\t" :
                        // Continue if we're quoted
                        if (quote) {
                            to = index + 1;
                            break;
                        }

                        // Update from/to
                        if (from === to) {
                            from = to = index + 1;
                        }
                        break;

                    case "=":
                        // Continue if we're quoted
                        if (quote) {
                            to = index + 1;
                            break;
                        }

                        // If we captured something...
                        if (from !== to) {
                            // Extract substring
                            key = STR_SUBSTRING.call(str, from, to);

                            if (RE_STRING.test(key)) {
                                key = STR_SLICE.call(key, 1, -1);
                            }
                        }

                        from = index + 1;
                        break;

                    case "," :
                        // Continue if we're quoted
                        if (quote) {
                            to = index + 1;
                            break;
                        }

                        // If we captured something...
                        extract(from, to);

                        // Update from/to
                        from = to = index + 1;
                        break;

                    default :
                        // Update to
                        to = index + 1;
                }
            }

            // If we captured something...
            extract(from, to);

            return values;
        };
    }

}());
