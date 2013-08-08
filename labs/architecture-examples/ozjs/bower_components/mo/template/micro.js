/**
 * using AMD (Asynchronous Module Definition) API with OzJS
 * see http://ozjs.org for details
 *
 * Copyright (C) 2010-2012, Dexter.Yy, MIT License
 * vim: et:ts=4:sw=4:sts=4
 */
define("mo/template/micro", [
    "../lang",
    "./string"
], function(_, stpl, require, exports){

    var document = this.document;

    exports.tplSettings = {
        _cache: {},
        evaluate: /\{%([\s\S]+?)%\}/g,
        interpolate: /\{%=([\s\S]+?)%\}/g
    };
    exports.tplHelpers = {
        mix: _.mix,
        escapeHTML: stpl.escapeHTML,
        substr: stpl.substr,
        include: convertTpl,
        _has: function(obj){
            return function(name){
                return _.ns(name, undefined, obj);
            };
        }
    };

    function convertTpl(str, data, namespace){
        var func, c  = exports.tplSettings, suffix = namespace ? '#' + namespace : '';
        if (!/[\t\r\n% ]/.test(str)) {
            func = c._cache[str + suffix];
            if (!func) {
                var tplbox = document.getElementById(str);
                if (tplbox) {
                    func = c._cache[str + suffix] = convertTpl(tplbox.innerHTML, false, namespace);
                }
            }
        } else {
            func = new Function(namespace || 'obj', 'api', 'var __p=[];' 
                + (namespace ? '' : 'with(obj){')
                    + 'var mix=api.mix,escapeHTML=api.escapeHTML,substr=api.substr,include=api.include,has=api._has(' + (namespace || 'obj') + ');'
                    + '__p.push(\'' +
                    str.replace(/\\/g, '\\\\')
                        .replace(/'/g, "\\'")
                        .replace(c.interpolate, function(match, code) {
                            return "'," + code.replace(/\\'/g, "'") + ",'";
                        })
                        .replace(c.evaluate || null, function(match, code) {
                            return "');" + code.replace(/\\'/g, "'")
                                                .replace(/[\r\n\t]/g, ' ') + "__p.push('";
                        })
                        .replace(/\r/g, '\\r')
                        .replace(/\n/g, '\\n')
                        .replace(/\t/g, '\\t')
                    + "');" 
                + (namespace ? "" : "}")
                + "return __p.join('');");
        }
        return !func ? '' : (data ? func(data, exports.tplHelpers) : func);
    }

    exports.convertTpl = convertTpl;
    exports.reloadTpl = function(str){
        delete exports.tplSettings._cache[str];
    };

});

