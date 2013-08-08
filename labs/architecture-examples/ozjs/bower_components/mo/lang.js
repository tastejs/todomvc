/**
 * ES5/6 shim and minimum utilities for language enhancement
 *
 * using AMD (Asynchronous Module Definition) API with OzJS
 * see http://ozjs.org for details
 *
 * Copyright (C) 2010-2012, Dexter.Yy, MIT License
 * vim: et:ts=4:sw=4:sts=4
 */
define("mo/lang", [
    "./lang/es5",
    "./lang/type",
    "./lang/mix",
    "./lang/struct",
    "./lang/oop"
], function(es5, detect, _, struct, oo, require, exports){

    var host = this,
        window = host.window;

    _.mix(exports, detect, _, struct, oo);

    exports.ns = function(namespace, v, parent){
        var i, p = parent || window, n = namespace.split(".").reverse();
        while ((i = n.pop()) && n.length > 0) {
            if (typeof p[i] === 'undefined') {
                p[i] = {};
            } else if (typeof p[i] !== "object") {
                return false;
            }
            p = p[i];
        }
        if (typeof v !== 'undefined')
            p[i] = v;
        return p[i];
    };

});
