(function() {
    'use strict';

    if (typeof define === 'function' && define.amd) {
        define(['./src/getargs'], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(
            require('./src/getargs')
        );
    } else {
        throw Error("no module loader found");
    }

    function factory(getargs) {
        return getargs;
    }

})();
