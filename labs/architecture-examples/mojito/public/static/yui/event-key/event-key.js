/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('event-key', function (Y, NAME) {

/**
 * Functionality to listen for one or more specific key combinations.
 * @module event
 * @submodule event-key
 */

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

            if (bits) {
                bits = bits.split(',');

                config.keys = {};

                // FIXME: need to support '65,esc' => keypress, keydown
                for (i = bits.length - 1; i >= 0; --i) {
                    chr = trim(bits[i]);

                    // catch sloppy filters, trailing commas, etc 'a,,'
                    if (!chr) {
                        continue;
                    }

                    // non-numerics are single characters or key names
                    if (+chr == chr) {
                        config.keys[chr] = mods;
                    } else {
                        lc = chr.toLowerCase();

                        if (this.KEY_MAP[lc]) {
                            config.keys[this.KEY_MAP[lc]] = mods;
                            // FIXME: '65,enter' defaults keydown for both
                            if (!config.type) {
                                config.type = "down"; // safest
                            }
                        } else {
                            // FIXME: Character mapping only works for keypress
                            // events. Otherwise, it uses String.fromCharCode()
                            // from the keyCode, which is wrong.
                            chr = chr.charAt(0);
                            uc  = chr.toUpperCase();

                            if (mods["+shift"]) {
                                chr = uc;
                            }

                            // FIXME: stupid assumption that
                            // the keycode of the lower case == the
                            // charCode of the upper case
                            // a (key:65,char:97), A (key:65,char:65)
                            config.keys[chr.charCodeAt(0)] =
                                (chr === uc) ?
                                    // upper case chars get +shift free
                                    Y.merge(mods, { "+shift": true }) :
                                    mods;
                        }
                    }
                }
            }

            if (!config.type) {
                config.type = "press";
            }

            return config;
        },

        on: function (node, sub, notifier, filter) {
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
            sub._detach = node[method](type, function (e) {
                var key = keys ? keys[e.which] : spec.mods;

                if (key &&
                    (!key[ALT]   || (key[ALT]   && e.altKey)) &&
                    (!key[CTRL]  || (key[CTRL]  && e.ctrlKey)) &&
                    (!key[META]  || (key[META]  && e.metaKey)) &&
                    (!key[SHIFT] || (key[SHIFT] && e.shiftKey)))
                {
                    notifier.fire(e);
                }
            }, filter);
        },

        detach: function (node, sub, notifier) {
            sub._detach.detach();
        }
    };

eventDef.delegate = eventDef.on;
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
Y.Event.define('key', eventDef, true);


}, '3.7.3', {"requires": ["event-synthetic"]});
