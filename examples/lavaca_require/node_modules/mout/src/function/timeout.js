define(function () {

    function slice(arr, offset){
        return Array.prototype.slice.call(arr, offset || 0);
    }

    /**
     * Delays the call of a function within a given context.
     */
    function timeout(fn, millis, context){

        var args = slice(arguments, 3);

        return setTimeout(function() {
            fn.apply(context, args);
        }, millis);
    }

    return timeout;

});
