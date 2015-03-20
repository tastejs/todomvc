define(['./functions', '../function/bind', '../array/forEach'], function (functions, bind, forEach) {

    /**
     * Binds methods of the object to be run in it's own context.
     */
    function bindAll(obj, rest_methodNames){
        var keys = arguments.length > 1?
                    Array.prototype.slice.call(arguments, 1) : functions(obj);
        forEach(keys, function(key){
            obj[key] = bind(obj[key], obj);
        });
    }

    return bindAll;

});
