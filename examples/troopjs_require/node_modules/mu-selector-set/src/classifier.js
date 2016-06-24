(function() {
    'use strict';

    /* istanbul ignore next */
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        throw Error("no module loader found");
    }

    function factory() {

        /**
         * See:
         * https://github.com/jquery/sizzle/blob/709e1db5bcb42e9d761dd4a8467899dd36ce63bc/src/sizzle.js#L81
         * http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
         */
        var identifier = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+";

        // regular expressions
        var re = {

            /**
             * End of line whitespace
             */
            ws: /(\s+)$/,

            /**
             * End of line garbage is one of:
             * - anything that starts with a colon
             * - anything inside square brackets
             */
            garbage: /(\:.+?|\[.*?\])$/,

            /**
             * CSS ID selector
             */
            id: new RegExp("^#" + identifier),

            /**
             * CSS class selector
             */
            cls: new RegExp("^\\." + identifier),

            /**
             * A candidate is either:
             * - ID
             * - Class
             * - Tag
             * Look for candidates from the end of the line.
             */
            candidate: new RegExp("([#\\.]{0,1}" + identifier + "?)$")
        };

        /**
         * Get the most significant part of a CSS selector.
         * The "significant" part is defined as any leading id, class name or
         * tag name component (in that order of precedence) of the last
         * (right most) selector.
         *
         * See test/classifier.js for examples
         *
         * @private
         * @static
         * @param {String} selector CSS selector
         * @return {String} the most significant part of the selector
         */
        function classifier(selector) {
            var i, m, c, candidates = [];
            selector = selector
                .replace(re.ws, "")
                .replace(re.garbage, "");
            while (m = selector.match(re.candidate)) {
                selector = selector
                    .replace(re.candidate, "")
                    .replace(re.garbage, "");
                candidates.push(m[0]);
            }
            c = candidates.length;
            // if no candidates, return the universal selector
            if (!c)
                return '*';
            // return the ID part of the selector:
            for (i = 0; i < c; i++)
                if (re.id.test(candidates[i]))
                    return candidates[i];
            // if no ID, return the class
            for (i = 0; i < c; i++)
                if (re.cls.test(candidates[i]))
                    return candidates[i];
            // if no class, return the tag
            return candidates[0];
        }

        return classifier;
    }
}());
