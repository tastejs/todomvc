/**
 * using AMD (Asynchronous Module Definition) API with OzJS
 * see http://ozjs.org for details
 *
 * Copyright (C) 2010-2012, Dexter.Yy, MIT License
 * vim: et:ts=4:sw=4:sts=4
 */
define("mo/lang/struct", [
    "./es5",
    "./mix"
], function(_0, _, require, exports){

    var mix = _.mix;

    exports.index = function(list, key) {
        var obj = {}, item;
        for (var i = 0, l = list.length; i < l; i++) {
            item = list[i];
            if (key && typeof item === 'object') {
                obj[item[key]] = item;
            } else {
                obj[item] = true;
            }
        }
        return obj;
    };

    exports.fnQueue = function(){
        var queue = [], dup = false;
        function getCallMethod(type){
            return function(){
                var re, fn;
                dup = this.slice().reverse();
                while (fn = dup.pop()) {
                    re = fn[type].apply(fn, arguments);
                }
                dup = false;
                return re;
            };
        }
        mix(queue, {
            call: getCallMethod('call'),
            apply: getCallMethod('apply'),
            clear: function(func){
                if (!func) {
                    this.length = 0;
                } else {
                    var size = this.length,
                        popsize = size - dup.length;
                    for (var i = this.length - 1; i >= 0; i--) {
                        if (this[i] === func) {
                            this.splice(i, 1);
                            if (dup && i >= popsize)
                                dup.splice(size - i - 1, 1);
                        }
                    }
                    if (i < 0)
                        return false;
                }
                return true;
            }
        });
        return queue;
    };

});

