(function() {
    'use strict';

    if (typeof define === 'function' && define.amd) {
        define(['./src/SelectorSet'], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(
            require('./src/SelectorSet')
        );
    } else {
        throw Error("no module loader found");
    }

    function factory(SelectorSet) {
        return SelectorSet;
    }

})();
