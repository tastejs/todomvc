define(['./prop', '../object/deepMatches'], function(prop, deepMatches) {

    /**
     * Converts argument into a valid iterator.
     * Used internally on most array/object/collection methods that receives a
     * callback/iterator providing a shortcut syntax.
     */
    function makeIterator(src, thisObj){
        switch(typeof src) {
            case 'function':
                // function is the first to improve perf (most common case)
                return (typeof thisObj !== 'undefined')? function(val, i, arr){
                    return src.call(thisObj, val, i, arr);
                } : src;
            case 'object':
                // typeof null == "object"
                return (src != null)? function(val){
                    return deepMatches(val, src);
                } : src;
            case 'string':
            case 'number':
                return prop(src);
            default:
                return src;
        }
    }

    return makeIterator;

});
