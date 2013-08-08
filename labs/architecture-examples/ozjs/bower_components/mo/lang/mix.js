/**
 * using AMD (Asynchronous Module Definition) API with OzJS
 * see http://ozjs.org for details
 *
 * Copyright (C) 2010-2012, Dexter.Yy, MIT License
 * vim: et:ts=4:sw=4:sts=4
 */
define("mo/lang/mix", [
    "./es5",
    "./type"
], function(_0, _, require, exports){

    var type = _.type;

    function mix(origin) {
        var objs = arguments, ol = objs.length, 
            VALTYPE = { 'number': 1, 'boolean': 2, 'string': 3 },
            obj, lvl, i, l;
        if (typeof objs[ol - 1] !== 'object') {
            lvl = objs[ol - 1] || 0;
            ol--;
        } else {
            lvl = 0;
        }
        for (var n = 1; n < ol; n++) {
            obj = objs[n];
            if (Array.isArray(obj)) {
                origin = !VALTYPE[typeof origin] && origin || [];
                l = obj.length;
                for (i = 0; i < l; i++) {
                    if (lvl >= 1 && obj[i] && typeof obj[i] === 'object') {
                        origin[i] = mix(origin[i], obj[i], lvl - 1);
                    } else {
                        origin[i] = obj[i];
                    }
                }
            } else {
                origin = !VALTYPE[typeof origin] && origin || {};
                for (i in obj) {
                    if (lvl >= 1 && obj[i] && typeof obj[i] === 'object') {
                        origin[i] = mix(origin[i], obj[i], lvl - 1);
                    } else {
                        origin[i] = obj[i];
                    }
                }
            }
        }
        return origin;
    }

    function merge(origin) {
        var objs = arguments, ol = objs.length, 
            ITERTYPE = { 'object': 1, 'array': 2 },
            obj, lvl, i, k, lib, marked, mark;
        if (typeof objs[ol - 1] !== 'object') {
            lvl = objs[ol - 1] || 0;
            ol--;
        } else {
            lvl = 0;
        }
        for (var n = 1; n < ol; n++) {
            obj = objs[n];
            if (Array.isArray(origin)) {
                origin = origin || [];
                lib = {};
                marked = [];
                mark = '__oz_uniqmark_' + (+new Date() + Math.random());
                obj = obj.concat(origin);
                origin.length = 0;
                obj.forEach(function(i){
                    if (i && typeof i === 'object') {
                        if (!i[mark]) {
                            if (lvl >= 1 && Array.isArray(i)) {
                                origin.push(merge(i, [], lvl - 1));
                            } else {
                                origin.push(i);
                            }
                            i[mark] = 1;
                            marked.push(i);
                        }
                    } else {
                        k = (typeof i) + '_' + i;
                        if (!this[k]) {
                            origin.push(i);
                            this[k] = 1;
                        }
                    }
                }, lib);
                marked.forEach(function(i){
                    delete i[mark];
                });
            } else {
                origin = origin || {};
                for (i in obj) {
                    if (!origin.hasOwnProperty(i)) {
                        origin[i] = obj[i];
                    } else if (lvl >= 1 && i 
                            // avoid undefined === undefined
                            && ITERTYPE[type(origin[i])] + 0 === ITERTYPE[type(obj[i])] + 0) {
                        origin[i] = merge(origin[i], obj[i], lvl - 1);
                    }
                }
            }
        }
        return origin;
    }

    function interset(origin) {
        var objs = arguments, ol = objs.length, 
            ITERTYPE = { 'object': 1, 'array': 2 },
            obj, lvl, i, k, lib, marked, mark;
        if (typeof objs[ol - 1] !== 'object') {
            lvl = objs[ol - 1] || 0;
            ol--;
        } else {
            lvl = 0;
        }
        for (var n = 1; n < ol; n++) {
            obj = objs[n];
            if (Array.isArray(origin)) {
                origin = origin || [];
                lib = {};
                marked = [];
                mark = '__oz_uniqmark_' + (+new Date() + Math.random());
                origin.forEach(function(i){
                    if (i && typeof i === 'object' && !i[mark]) {
                        i[mark] = 1;
                        marked.push(i);
                    } else {
                        k = (typeof i) + '_' + i;
                        this[k] = 1;
                    }
                }, lib);
                origin.length = 0;
                obj.forEach(function(i){
                    if (i && typeof i === 'object') {
                        if (i[mark] === 1) {
                            origin.push(i);
                            i[mark] = 2;
                        }
                    } else {
                        k = (typeof i) + '_' + i;
                        if (this[k] === 1) {
                            origin.push(i);
                            this[k] = 2;
                        }
                    }
                }, lib);
                marked.forEach(function(i){
                    delete i[mark];
                });
            } else {
                origin = origin || {};
                for (i in origin) {
                    if (!obj.hasOwnProperty(i)) {
                        delete origin[i];
                    } else if (lvl >= 1 && i 
                            && ITERTYPE[type(origin[i])] + 0 === ITERTYPE[type(obj[i])] + 0) {
                        origin[i] = interset(origin[i], obj[i], lvl - 1);
                    }
                }
            }
        }
        return origin;
    }

    exports.mix = mix;
    exports.merge = merge;
    exports.interset = interset;

    exports.copy = function(obj, lvl) {
        return mix(null, obj, lvl);
    };

    exports.occupy = function(origin, obj, lvl) {
        return mix(interset(origin, obj, lvl), obj, lvl);
    };

    exports.defaults = merge;

    exports.config = function(cfg, opt, default_cfg, lvl){
        return mix(merge(cfg, default_cfg, lvl), interset(mix(null, opt, lvl), default_cfg, lvl), lvl);
    };

    exports.unique = function(origin, lvl) {
        return merge(origin, [], lvl);
    };

});

