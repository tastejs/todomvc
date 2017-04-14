/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
if (typeof _yuitest_coverage == "undefined"){
    _yuitest_coverage = {};
    _yuitest_coverline = function(src, line){
        var coverage = _yuitest_coverage[src];
        if (!coverage.lines[line]){
            coverage.calledLines++;
        }
        coverage.lines[line]++;
    };
    _yuitest_coverfunc = function(src, name, line){
        var coverage = _yuitest_coverage[src],
            funcId = name + ":" + line;
        if (!coverage.functions[funcId]){
            coverage.calledFunctions++;
        }
        coverage.functions[funcId]++;
    };
}
_yuitest_coverage["build/io-form/io-form.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/io-form/io-form.js",
    code: []
};
_yuitest_coverage["build/io-form/io-form.js"].code=["YUI.add('io-form', function (Y, NAME) {","","/**","* Extends IO to enable HTML form data serialization, when specified","* in the transaction's configuration object.","* @module io","* @submodule io-form","* @for IO","*/","","var eUC = encodeURIComponent;","","Y.mix(Y.IO.prototype, {","   /**","    * Method to enumerate through an HTML form's elements collection","    * and return a string comprised of key-value pairs.","    *","    * @method _serialize","    * @private","    * @static","    * @param {Object} c - YUI form node or HTML form id.","    * @param {String} s - Key-value data defined in the configuration object.","    * @return {String}","    */","    _serialize: function(c, s) {","        var data = [],","            df = c.useDisabled || false,","            item = 0,","            id = (typeof c.id === 'string') ? c.id : c.id.getAttribute('id'),","            e, f, n, v, d, i, il, j, jl, o;","","            if (!id) {","                id = Y.guid('io:');","                c.id.setAttribute('id', id);","            }","","            f = Y.config.doc.getElementById(id);","","        // Iterate over the form elements collection to construct the","        // label-value pairs.","        for (i = 0, il = f.elements.length; i < il; ++i) {","            e = f.elements[i];","            d = e.disabled;","            n = e.name;","","            if (df ? n : n && !d) {","                n = eUC(n) + '=';","                v = eUC(e.value);","","                switch (e.type) {","                    // Safari, Opera, FF all default options.value from .text if","                    // value attribute not specified in markup","                    case 'select-one':","                        if (e.selectedIndex > -1) {","                            o = e.options[e.selectedIndex];","                            data[item++] = n + eUC(o.attributes.value && o.attributes.value.specified ? o.value : o.text);","                        }","                        break;","                    case 'select-multiple':","                        if (e.selectedIndex > -1) {","                            for (j = e.selectedIndex, jl = e.options.length; j < jl; ++j) {","                                o = e.options[j];","                                if (o.selected) {","                                  data[item++] = n + eUC(o.attributes.value && o.attributes.value.specified ? o.value : o.text);","                                }","                            }","                        }","                        break;","                    case 'radio':","                    case 'checkbox':","                        if (e.checked) {","                            data[item++] = n + v;","                        }","                        break;","                    case 'file':","                        // stub case as XMLHttpRequest will only send the file path as a string.","                    case undefined:","                        // stub case for fieldset element which returns undefined.","                    case 'reset':","                        // stub case for input type reset button.","                    case 'button':","                        // stub case for input type button elements.","                        break;","                    case 'submit':","                    default:","                        data[item++] = n + v;","                }","            }","        }","        return s ? data.join('&') + \"&\" + s : data.join('&');","    }","}, true);","","","}, '3.7.3', {\"requires\": [\"io-base\", \"node-base\"]});"];
_yuitest_coverage["build/io-form/io-form.js"].lines = {"1":0,"11":0,"13":0,"26":0,"32":0,"33":0,"34":0,"37":0,"41":0,"42":0,"43":0,"44":0,"46":0,"47":0,"48":0,"50":0,"54":0,"55":0,"56":0,"58":0,"60":0,"61":0,"62":0,"63":0,"64":0,"68":0,"71":0,"72":0,"74":0,"83":0,"86":0,"90":0};
_yuitest_coverage["build/io-form/io-form.js"].functions = {"_serialize:25":0,"(anonymous 1):1":0};
_yuitest_coverage["build/io-form/io-form.js"].coveredLines = 32;
_yuitest_coverage["build/io-form/io-form.js"].coveredFunctions = 2;
_yuitest_coverline("build/io-form/io-form.js", 1);
YUI.add('io-form', function (Y, NAME) {

/**
* Extends IO to enable HTML form data serialization, when specified
* in the transaction's configuration object.
* @module io
* @submodule io-form
* @for IO
*/

_yuitest_coverfunc("build/io-form/io-form.js", "(anonymous 1)", 1);
_yuitest_coverline("build/io-form/io-form.js", 11);
var eUC = encodeURIComponent;

_yuitest_coverline("build/io-form/io-form.js", 13);
Y.mix(Y.IO.prototype, {
   /**
    * Method to enumerate through an HTML form's elements collection
    * and return a string comprised of key-value pairs.
    *
    * @method _serialize
    * @private
    * @static
    * @param {Object} c - YUI form node or HTML form id.
    * @param {String} s - Key-value data defined in the configuration object.
    * @return {String}
    */
    _serialize: function(c, s) {
        _yuitest_coverfunc("build/io-form/io-form.js", "_serialize", 25);
_yuitest_coverline("build/io-form/io-form.js", 26);
var data = [],
            df = c.useDisabled || false,
            item = 0,
            id = (typeof c.id === 'string') ? c.id : c.id.getAttribute('id'),
            e, f, n, v, d, i, il, j, jl, o;

            _yuitest_coverline("build/io-form/io-form.js", 32);
if (!id) {
                _yuitest_coverline("build/io-form/io-form.js", 33);
id = Y.guid('io:');
                _yuitest_coverline("build/io-form/io-form.js", 34);
c.id.setAttribute('id', id);
            }

            _yuitest_coverline("build/io-form/io-form.js", 37);
f = Y.config.doc.getElementById(id);

        // Iterate over the form elements collection to construct the
        // label-value pairs.
        _yuitest_coverline("build/io-form/io-form.js", 41);
for (i = 0, il = f.elements.length; i < il; ++i) {
            _yuitest_coverline("build/io-form/io-form.js", 42);
e = f.elements[i];
            _yuitest_coverline("build/io-form/io-form.js", 43);
d = e.disabled;
            _yuitest_coverline("build/io-form/io-form.js", 44);
n = e.name;

            _yuitest_coverline("build/io-form/io-form.js", 46);
if (df ? n : n && !d) {
                _yuitest_coverline("build/io-form/io-form.js", 47);
n = eUC(n) + '=';
                _yuitest_coverline("build/io-form/io-form.js", 48);
v = eUC(e.value);

                _yuitest_coverline("build/io-form/io-form.js", 50);
switch (e.type) {
                    // Safari, Opera, FF all default options.value from .text if
                    // value attribute not specified in markup
                    case 'select-one':
                        _yuitest_coverline("build/io-form/io-form.js", 54);
if (e.selectedIndex > -1) {
                            _yuitest_coverline("build/io-form/io-form.js", 55);
o = e.options[e.selectedIndex];
                            _yuitest_coverline("build/io-form/io-form.js", 56);
data[item++] = n + eUC(o.attributes.value && o.attributes.value.specified ? o.value : o.text);
                        }
                        _yuitest_coverline("build/io-form/io-form.js", 58);
break;
                    case 'select-multiple':
                        _yuitest_coverline("build/io-form/io-form.js", 60);
if (e.selectedIndex > -1) {
                            _yuitest_coverline("build/io-form/io-form.js", 61);
for (j = e.selectedIndex, jl = e.options.length; j < jl; ++j) {
                                _yuitest_coverline("build/io-form/io-form.js", 62);
o = e.options[j];
                                _yuitest_coverline("build/io-form/io-form.js", 63);
if (o.selected) {
                                  _yuitest_coverline("build/io-form/io-form.js", 64);
data[item++] = n + eUC(o.attributes.value && o.attributes.value.specified ? o.value : o.text);
                                }
                            }
                        }
                        _yuitest_coverline("build/io-form/io-form.js", 68);
break;
                    case 'radio':
                    case 'checkbox':
                        _yuitest_coverline("build/io-form/io-form.js", 71);
if (e.checked) {
                            _yuitest_coverline("build/io-form/io-form.js", 72);
data[item++] = n + v;
                        }
                        _yuitest_coverline("build/io-form/io-form.js", 74);
break;
                    case 'file':
                        // stub case as XMLHttpRequest will only send the file path as a string.
                    case undefined:
                        // stub case for fieldset element which returns undefined.
                    case 'reset':
                        // stub case for input type reset button.
                    case 'button':
                        // stub case for input type button elements.
                        _yuitest_coverline("build/io-form/io-form.js", 83);
break;
                    case 'submit':
                    default:
                        _yuitest_coverline("build/io-form/io-form.js", 86);
data[item++] = n + v;
                }
            }
        }
        _yuitest_coverline("build/io-form/io-form.js", 90);
return s ? data.join('&') + "&" + s : data.join('&');
    }
}, true);


}, '3.7.3', {"requires": ["io-base", "node-base"]});
