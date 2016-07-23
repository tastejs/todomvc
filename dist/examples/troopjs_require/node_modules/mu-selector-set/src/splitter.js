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

    function factory(){

        var IGNORE_BOUNDARIES = ['\'', '"'],
            SELECTORS_DELIMITER = ',';

        function splitter(selector){
            var res, len = 0, flag = false, tot = selector.length;
            if (!tot) return [];
            while (
                selector[len] &&
                (flag || selector[len] !== SELECTORS_DELIMITER)
            ) {
                if (selector[len] === flag){
                    flag = false;
                } else if (
                    flag === false &&
                    IGNORE_BOUNDARIES.indexOf(selector[len]) !== -1
                ){
                    flag = selector[len];
                }
                len++;
            }
            res = splitter(selector.substr(len + 1));
            res.push(selector.substr(0, len));
            return res;
        }

        return splitter;

    }
}());
