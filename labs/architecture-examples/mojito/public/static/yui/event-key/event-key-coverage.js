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
_yuitest_coverage["build/event-key/event-key.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/event-key/event-key.js",
    code: []
};
_yuitest_coverage["build/event-key/event-key.js"].code=["YUI.add('event-key', function (Y, NAME) {","","/**"," * Functionality to listen for one or more specific key combinations."," * @module event"," * @submodule event-key"," */","","var ALT      = \"+alt\",","    CTRL     = \"+ctrl\",","    META     = \"+meta\",","    SHIFT    = \"+shift\",","","    trim     = Y.Lang.trim,","","    eventDef = {","        KEY_MAP: {","            enter    : 13,","            esc      : 27,","            backspace: 8,","            tab      : 9,","            pageup   : 33,","            pagedown : 34","        },","","        _typeRE: /^(up|down|press):/,","        _keysRE: /^(?:up|down|press):|\\+(alt|ctrl|meta|shift)/g,","","        processArgs: function (args) {","            var spec = args.splice(3,1)[0],","                mods = Y.Array.hash(spec.match(/\\+(?:alt|ctrl|meta|shift)\\b/g) || []),","                config = {","                    type: this._typeRE.test(spec) ? RegExp.$1 : null,","                    mods: mods,","                    keys: null","                },","                // strip type and modifiers from spec, leaving only keyCodes","                bits = spec.replace(this._keysRE, ''),","                chr, uc, lc, i;","","            if (bits) {","                bits = bits.split(',');","","                config.keys = {};","","                // FIXME: need to support '65,esc' => keypress, keydown","                for (i = bits.length - 1; i >= 0; --i) {","                    chr = trim(bits[i]);","","                    // catch sloppy filters, trailing commas, etc 'a,,'","                    if (!chr) {","                        continue;","                    }","","                    // non-numerics are single characters or key names","                    if (+chr == chr) {","                        config.keys[chr] = mods;","                    } else {","                        lc = chr.toLowerCase();","","                        if (this.KEY_MAP[lc]) {","                            config.keys[this.KEY_MAP[lc]] = mods;","                            // FIXME: '65,enter' defaults keydown for both","                            if (!config.type) {","                                config.type = \"down\"; // safest","                            }","                        } else {","                            // FIXME: Character mapping only works for keypress","                            // events. Otherwise, it uses String.fromCharCode()","                            // from the keyCode, which is wrong.","                            chr = chr.charAt(0);","                            uc  = chr.toUpperCase();","","                            if (mods[\"+shift\"]) {","                                chr = uc;","                            }","","                            // FIXME: stupid assumption that","                            // the keycode of the lower case == the","                            // charCode of the upper case","                            // a (key:65,char:97), A (key:65,char:65)","                            config.keys[chr.charCodeAt(0)] =","                                (chr === uc) ?","                                    // upper case chars get +shift free","                                    Y.merge(mods, { \"+shift\": true }) :","                                    mods;","                        }","                    }","                }","            }","","            if (!config.type) {","                config.type = \"press\";","            }","","            return config;","        },","","        on: function (node, sub, notifier, filter) {","            var spec   = sub._extra,","                type   = \"key\" + spec.type,","                keys   = spec.keys,","                method = (filter) ? \"delegate\" : \"on\";","","            // Note: without specifying any keyCodes, this becomes a","            // horribly inefficient alias for 'keydown' (et al), but I","            // can't abort this subscription for a simple","            // Y.on('keypress', ...);","            // Please use keyCodes or just subscribe directly to keydown,","            // keyup, or keypress","            sub._detach = node[method](type, function (e) {","                var key = keys ? keys[e.which] : spec.mods;","","                if (key &&","                    (!key[ALT]   || (key[ALT]   && e.altKey)) &&","                    (!key[CTRL]  || (key[CTRL]  && e.ctrlKey)) &&","                    (!key[META]  || (key[META]  && e.metaKey)) &&","                    (!key[SHIFT] || (key[SHIFT] && e.shiftKey)))","                {","                    notifier.fire(e);","                }","            }, filter);","        },","","        detach: function (node, sub, notifier) {","            sub._detach.detach();","        }","    };","","eventDef.delegate = eventDef.on;","eventDef.detachDelegate = eventDef.detach;","","/**"," * <p>Add a key listener.  The listener will only be notified if the"," * keystroke detected meets the supplied specification.  The"," * specification is a string that is defined as:</p>"," * "," * <dl>"," *   <dt>spec</dt>"," *   <dd><code>[{type}:]{code}[,{code}]*</code></dd>"," *   <dt>type</dt>"," *   <dd><code>\"down\", \"up\", or \"press\"</code></dd>"," *   <dt>code</dt>"," *   <dd><code>{keyCode|character|keyName}[+{modifier}]*</code></dd>"," *   <dt>modifier</dt>"," *   <dd><code>\"shift\", \"ctrl\", \"alt\", or \"meta\"</code></dd>"," *   <dt>keyName</dt>"," *   <dd><code>\"enter\", \"backspace\", \"esc\", \"tab\", \"pageup\", or \"pagedown\"</code></dd>"," * </dl>"," *"," * <p>Examples:</p>"," * <ul>"," *   <li><code>Y.on(\"key\", callback, \"press:12,65+shift+ctrl\", \"#my-input\");</code></li>"," *   <li><code>Y.delegate(\"key\", preventSubmit, \"enter\", \"#forms\", \"input[type=text]\");</code></li>"," *   <li><code>Y.one(\"doc\").on(\"key\", viNav, \"j,k,l,;\");</code></li>"," * </ul>"," *   "," * @event key"," * @for YUI"," * @param type {string} 'key'"," * @param fn {function} the function to execute"," * @param id {string|HTMLElement|collection} the element(s) to bind"," * @param spec {string} the keyCode and modifier specification"," * @param o optional context object"," * @param args 0..n additional arguments to provide to the listener."," * @return {Event.Handle} the detach handle"," */","Y.Event.define('key', eventDef, true);","","","}, '3.7.3', {\"requires\": [\"event-synthetic\"]});"];
_yuitest_coverage["build/event-key/event-key.js"].lines = {"1":0,"9":0,"30":0,"41":0,"42":0,"44":0,"47":0,"48":0,"51":0,"52":0,"56":0,"57":0,"59":0,"61":0,"62":0,"64":0,"65":0,"71":0,"72":0,"74":0,"75":0,"82":0,"92":0,"93":0,"96":0,"100":0,"111":0,"112":0,"114":0,"120":0,"126":0,"130":0,"131":0,"168":0};
_yuitest_coverage["build/event-key/event-key.js"].functions = {"processArgs:29":0,"(anonymous 2):111":0,"on:99":0,"detach:125":0,"(anonymous 1):1":0};
_yuitest_coverage["build/event-key/event-key.js"].coveredLines = 34;
_yuitest_coverage["build/event-key/event-key.js"].coveredFunctions = 5;
_yuitest_coverline("build/event-key/event-key.js", 1);
YUI.add('event-key', function (Y, NAME) {

/**
 * Functionality to listen for one or more specific key combinations.
 * @module event
 * @submodule event-key
 */

_yuitest_coverfunc("build/event-key/event-key.js", "(anonymous 1)", 1);
_yuitest_coverline("build/event-key/event-key.js", 9);
var ALT      = "+alt",
    CTRL     = "+ctrl",
    META     = "+meta",
    SHIFT    = "+shift",

    trim     = Y.Lang.trim,

    eventDef = {
        KEY_MAP: {
            enter    : 13,
            esc      : 27,
            backspace: 8,
            tab      : 9,
            pageup   : 33,
            pagedown : 34
        },

        _typeRE: /^(up|down|press):/,
        _keysRE: /^(?:up|down|press):|\+(alt|ctrl|meta|shift)/g,

        processArgs: function (args) {
            _yuitest_coverfunc("build/event-key/event-key.js", "processArgs", 29);
_yuitest_coverline("build/event-key/event-key.js", 30);
var spec = args.splice(3,1)[0],
                mods = Y.Array.hash(spec.match(/\+(?:alt|ctrl|meta|shift)\b/g) || []),
                config = {
                    type: this._typeRE.test(spec) ? RegExp.$1 : null,
                    mods: mods,
                    keys: null
                },
                // strip type and modifiers from spec, leaving only keyCodes
                bits = spec.replace(this._keysRE, ''),
                chr, uc, lc, i;

            _yuitest_coverline("build/event-key/event-key.js", 41);
if (bits) {
                _yuitest_coverline("build/event-key/event-key.js", 42);
bits = bits.split(',');

                _yuitest_coverline("build/event-key/event-key.js", 44);
config.keys = {};

                // FIXME: need to support '65,esc' => keypress, keydown
                _yuitest_coverline("build/event-key/event-key.js", 47);
for (i = bits.length - 1; i >= 0; --i) {
                    _yuitest_coverline("build/event-key/event-key.js", 48);
chr = trim(bits[i]);

                    // catch sloppy filters, trailing commas, etc 'a,,'
                    _yuitest_coverline("build/event-key/event-key.js", 51);
if (!chr) {
                        _yuitest_coverline("build/event-key/event-key.js", 52);
continue;
                    }

                    // non-numerics are single characters or key names
                    _yuitest_coverline("build/event-key/event-key.js", 56);
if (+chr == chr) {
                        _yuitest_coverline("build/event-key/event-key.js", 57);
config.keys[chr] = mods;
                    } else {
                        _yuitest_coverline("build/event-key/event-key.js", 59);
lc = chr.toLowerCase();

                        _yuitest_coverline("build/event-key/event-key.js", 61);
if (this.KEY_MAP[lc]) {
                            _yuitest_coverline("build/event-key/event-key.js", 62);
config.keys[this.KEY_MAP[lc]] = mods;
                            // FIXME: '65,enter' defaults keydown for both
                            _yuitest_coverline("build/event-key/event-key.js", 64);
if (!config.type) {
                                _yuitest_coverline("build/event-key/event-key.js", 65);
config.type = "down"; // safest
                            }
                        } else {
                            // FIXME: Character mapping only works for keypress
                            // events. Otherwise, it uses String.fromCharCode()
                            // from the keyCode, which is wrong.
                            _yuitest_coverline("build/event-key/event-key.js", 71);
chr = chr.charAt(0);
                            _yuitest_coverline("build/event-key/event-key.js", 72);
uc  = chr.toUpperCase();

                            _yuitest_coverline("build/event-key/event-key.js", 74);
if (mods["+shift"]) {
                                _yuitest_coverline("build/event-key/event-key.js", 75);
chr = uc;
                            }

                            // FIXME: stupid assumption that
                            // the keycode of the lower case == the
                            // charCode of the upper case
                            // a (key:65,char:97), A (key:65,char:65)
                            _yuitest_coverline("build/event-key/event-key.js", 82);
config.keys[chr.charCodeAt(0)] =
                                (chr === uc) ?
                                    // upper case chars get +shift free
                                    Y.merge(mods, { "+shift": true }) :
                                    mods;
                        }
                    }
                }
            }

            _yuitest_coverline("build/event-key/event-key.js", 92);
if (!config.type) {
                _yuitest_coverline("build/event-key/event-key.js", 93);
config.type = "press";
            }

            _yuitest_coverline("build/event-key/event-key.js", 96);
return config;
        },

        on: function (node, sub, notifier, filter) {
            _yuitest_coverfunc("build/event-key/event-key.js", "on", 99);
_yuitest_coverline("build/event-key/event-key.js", 100);
var spec   = sub._extra,
                type   = "key" + spec.type,
                keys   = spec.keys,
                method = (filter) ? "delegate" : "on";

            // Note: without specifying any keyCodes, this becomes a
            // horribly inefficient alias for 'keydown' (et al), but I
            // can't abort this subscription for a simple
            // Y.on('keypress', ...);
            // Please use keyCodes or just subscribe directly to keydown,
            // keyup, or keypress
            _yuitest_coverline("build/event-key/event-key.js", 111);
sub._detach = node[method](type, function (e) {
                _yuitest_coverfunc("build/event-key/event-key.js", "(anonymous 2)", 111);
_yuitest_coverline("build/event-key/event-key.js", 112);
var key = keys ? keys[e.which] : spec.mods;

                _yuitest_coverline("build/event-key/event-key.js", 114);
if (key &&
                    (!key[ALT]   || (key[ALT]   && e.altKey)) &&
                    (!key[CTRL]  || (key[CTRL]  && e.ctrlKey)) &&
                    (!key[META]  || (key[META]  && e.metaKey)) &&
                    (!key[SHIFT] || (key[SHIFT] && e.shiftKey)))
                {
                    _yuitest_coverline("build/event-key/event-key.js", 120);
notifier.fire(e);
                }
            }, filter);
        },

        detach: function (node, sub, notifier) {
            _yuitest_coverfunc("build/event-key/event-key.js", "detach", 125);
_yuitest_coverline("build/event-key/event-key.js", 126);
sub._detach.detach();
        }
    };

_yuitest_coverline("build/event-key/event-key.js", 130);
eventDef.delegate = eventDef.on;
_yuitest_coverline("build/event-key/event-key.js", 131);
eventDef.detachDelegate = eventDef.detach;

/**
 * <p>Add a key listener.  The listener will only be notified if the
 * keystroke detected meets the supplied specification.  The
 * specification is a string that is defined as:</p>
 * 
 * <dl>
 *   <dt>spec</dt>
 *   <dd><code>[{type}:]{code}[,{code}]*</code></dd>
 *   <dt>type</dt>
 *   <dd><code>"down", "up", or "press"</code></dd>
 *   <dt>code</dt>
 *   <dd><code>{keyCode|character|keyName}[+{modifier}]*</code></dd>
 *   <dt>modifier</dt>
 *   <dd><code>"shift", "ctrl", "alt", or "meta"</code></dd>
 *   <dt>keyName</dt>
 *   <dd><code>"enter", "backspace", "esc", "tab", "pageup", or "pagedown"</code></dd>
 * </dl>
 *
 * <p>Examples:</p>
 * <ul>
 *   <li><code>Y.on("key", callback, "press:12,65+shift+ctrl", "#my-input");</code></li>
 *   <li><code>Y.delegate("key", preventSubmit, "enter", "#forms", "input[type=text]");</code></li>
 *   <li><code>Y.one("doc").on("key", viNav, "j,k,l,;");</code></li>
 * </ul>
 *   
 * @event key
 * @for YUI
 * @param type {string} 'key'
 * @param fn {function} the function to execute
 * @param id {string|HTMLElement|collection} the element(s) to bind
 * @param spec {string} the keyCode and modifier specification
 * @param o optional context object
 * @param args 0..n additional arguments to provide to the listener.
 * @return {Event.Handle} the detach handle
 */
_yuitest_coverline("build/event-key/event-key.js", 168);
Y.Event.define('key', eventDef, true);


}, '3.7.3', {"requires": ["event-synthetic"]});
