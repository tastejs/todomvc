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
_yuitest_coverage["build/yui-nodejs/yui-nodejs.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/yui-nodejs/yui-nodejs.js",
    code: []
};
_yuitest_coverage["build/yui-nodejs/yui-nodejs.js"].code=["/**"," * The YUI module contains the components required for building the YUI seed"," * file.  This includes the script loading mechanism, a simple queue, and"," * the core utilities for the library."," * @module yui"," * @main yui"," * @submodule yui-base"," */","","if (typeof YUI != 'undefined') {","    YUI._YUI = YUI;","}","","/**","The YUI global namespace object.  If YUI is already defined, the","existing YUI object will not be overwritten so that defined","namespaces are preserved.  It is the constructor for the object","the end user interacts with.  As indicated below, each instance","has full custom event support, but only if the event system","is available.  This is a self-instantiable factory function.  You","can invoke it directly like this:","","     YUI().use('*', function(Y) {","         // ready","     });","","But it also works like this:","","     var Y = YUI();","","Configuring the YUI object:","","    YUI({","        debug: true,","        combine: false","    }).use('node', function(Y) {","        //Node is ready to use","    });","","See the API docs for the <a href=\"config.html\">Config</a> class","for the complete list of supported configuration properties accepted","by the YUI constuctor.","","@class YUI","@constructor","@global","@uses EventTarget","@param [o]* {Object} 0..n optional configuration objects.  these values","are store in Y.config.  See <a href=\"config.html\">Config</a> for the list of supported","properties.","*/","    /*global YUI*/","    /*global YUI_config*/","    var YUI = function() {","        var i = 0,","            Y = this,","            args = arguments,","            l = args.length,","            instanceOf = function(o, type) {","                return (o && o.hasOwnProperty && (o instanceof type));","            },","            gconf = (typeof YUI_config !== 'undefined') && YUI_config;","","        if (!(instanceOf(Y, YUI))) {","            Y = new YUI();","        } else {","            // set up the core environment","            Y._init();","","            /**","                YUI.GlobalConfig is a master configuration that might span","                multiple contexts in a non-browser environment.  It is applied","                first to all instances in all contexts.","                @property GlobalConfig","                @type {Object}","                @global","                @static","                @example","","","                    YUI.GlobalConfig = {","                        filter: 'debug'","                    };","","                    YUI().use('node', function(Y) {","                        //debug files used here","                    });","","                    YUI({","                        filter: 'min'","                    }).use('node', function(Y) {","                        //min files used here","                    });","","            */","            if (YUI.GlobalConfig) {","                Y.applyConfig(YUI.GlobalConfig);","            }","","            /**","                YUI_config is a page-level config.  It is applied to all","                instances created on the page.  This is applied after","                YUI.GlobalConfig, and before the instance level configuration","                objects.","                @global","                @property YUI_config","                @type {Object}","                @example","","","                    //Single global var to include before YUI seed file","                    YUI_config = {","                        filter: 'debug'","                    };","","                    YUI().use('node', function(Y) {","                        //debug files used here","                    });","","                    YUI({","                        filter: 'min'","                    }).use('node', function(Y) {","                        //min files used here","                    });","            */","            if (gconf) {","                Y.applyConfig(gconf);","            }","","            // bind the specified additional modules for this instance","            if (!l) {","                Y._setup();","            }","        }","","        if (l) {","            // Each instance can accept one or more configuration objects.","            // These are applied after YUI.GlobalConfig and YUI_Config,","            // overriding values set in those config files if there is a '","            // matching property.","            for (; i < l; i++) {","                Y.applyConfig(args[i]);","            }","","            Y._setup();","        }","","        Y.instanceOf = instanceOf;","","        return Y;","    };","","(function() {","","    var proto, prop,","        VERSION = '3.7.3',","        PERIOD = '.',","        BASE = 'http://yui.yahooapis.com/',","        /*","            These CSS class names can't be generated by","            getClassName since it is not available at the","            time they are being used.","        */","        DOC_LABEL = 'yui3-js-enabled',","        CSS_STAMP_EL = 'yui3-css-stamp',","        NOOP = function() {},","        SLICE = Array.prototype.slice,","        APPLY_TO_AUTH = { 'io.xdrReady': 1,   // the functions applyTo","                          'io.xdrResponse': 1,   // can call. this should","                          'SWF.eventHandler': 1 }, // be done at build time","        hasWin = (typeof window != 'undefined'),","        win = (hasWin) ? window : null,","        doc = (hasWin) ? win.document : null,","        docEl = doc && doc.documentElement,","        docClass = docEl && docEl.className,","        instances = {},","        time = new Date().getTime(),","        add = function(el, type, fn, capture) {","            if (el && el.addEventListener) {","                el.addEventListener(type, fn, capture);","            } else if (el && el.attachEvent) {","                el.attachEvent('on' + type, fn);","            }","        },","        remove = function(el, type, fn, capture) {","            if (el && el.removeEventListener) {","                // this can throw an uncaught exception in FF","                try {","                    el.removeEventListener(type, fn, capture);","                } catch (ex) {}","            } else if (el && el.detachEvent) {","                el.detachEvent('on' + type, fn);","            }","        },","        handleLoad = function() {","            YUI.Env.windowLoaded = true;","            YUI.Env.DOMReady = true;","            if (hasWin) {","                remove(window, 'load', handleLoad);","            }","        },","        getLoader = function(Y, o) {","            var loader = Y.Env._loader,","                lCore = [ 'loader-base' ],","                G_ENV = YUI.Env,","                mods = G_ENV.mods;","","            if (loader) {","                //loader._config(Y.config);","                loader.ignoreRegistered = false;","                loader.onEnd = null;","                loader.data = null;","                loader.required = [];","                loader.loadType = null;","            } else {","                loader = new Y.Loader(Y.config);","                Y.Env._loader = loader;","            }","            if (mods && mods.loader) {","                lCore = [].concat(lCore, YUI.Env.loaderExtras);","            }","            YUI.Env.core = Y.Array.dedupe([].concat(YUI.Env.core, lCore));","","            return loader;","        },","","        clobber = function(r, s) {","            for (var i in s) {","                if (s.hasOwnProperty(i)) {","                    r[i] = s[i];","                }","            }","        },","","        ALREADY_DONE = { success: true };","","//  Stamp the documentElement (HTML) with a class of \"yui-loaded\" to","//  enable styles that need to key off of JS being enabled.","if (docEl && docClass.indexOf(DOC_LABEL) == -1) {","    if (docClass) {","        docClass += ' ';","    }","    docClass += DOC_LABEL;","    docEl.className = docClass;","}","","if (VERSION.indexOf('@') > -1) {","    VERSION = '3.5.0'; // dev time hack for cdn test","}","","proto = {","    /**","     * Applies a new configuration object to the YUI instance config.","     * This will merge new group/module definitions, and will also","     * update the loader cache if necessary.  Updating Y.config directly","     * will not update the cache.","     * @method applyConfig","     * @param {Object} o the configuration object.","     * @since 3.2.0","     */","    applyConfig: function(o) {","","        o = o || NOOP;","","        var attr,","            name,","            // detail,","            config = this.config,","            mods = config.modules,","            groups = config.groups,","            aliases = config.aliases,","            loader = this.Env._loader;","","        for (name in o) {","            if (o.hasOwnProperty(name)) {","                attr = o[name];","                if (mods && name == 'modules') {","                    clobber(mods, attr);","                } else if (aliases && name == 'aliases') {","                    clobber(aliases, attr);","                } else if (groups && name == 'groups') {","                    clobber(groups, attr);","                } else if (name == 'win') {","                    config[name] = (attr && attr.contentWindow) || attr;","                    config.doc = config[name] ? config[name].document : null;","                } else if (name == '_yuid') {","                    // preserve the guid","                } else {","                    config[name] = attr;","                }","            }","        }","","        if (loader) {","            loader._config(o);","        }","","    },","    /**","    * Old way to apply a config to the instance (calls `applyConfig` under the hood)","    * @private","    * @method _config","    * @param {Object} o The config to apply","    */","    _config: function(o) {","        this.applyConfig(o);","    },","","    /**","     * Initialize this YUI instance","     * @private","     * @method _init","     */","    _init: function() {","        var filter, el,","            Y = this,","            G_ENV = YUI.Env,","            Env = Y.Env,","            prop;","","        /**","         * The version number of the YUI instance.","         * @property version","         * @type string","         */","        Y.version = VERSION;","","        if (!Env) {","            Y.Env = {","                core: ['get', 'features', 'intl-base', 'yui-log', 'yui-log-nodejs', 'yui-later', 'loader-base', 'loader-rollup', 'loader-yui3'],","                loaderExtras: ['loader-rollup', 'loader-yui3'],","                mods: {}, // flat module map","                versions: {}, // version module map","                base: BASE,","                cdn: BASE + VERSION + '/build/',","                // bootstrapped: false,","                _idx: 0,","                _used: {},","                _attached: {},","                _missed: [],","                _yidx: 0,","                _uidx: 0,","                _guidp: 'y',","                _loaded: {},","                // serviced: {},","                // Regex in English:","                // I'll start at the \\b(simpleyui).","                // 1. Look in the test string for \"simpleyui\" or \"yui\" or","                //    \"yui-base\" or \"yui-davglass\" or \"yui-foobar\" that comes after a word break.  That is, it","                //    can't match \"foyui\" or \"i_heart_simpleyui\". This can be anywhere in the string.","                // 2. After #1 must come a forward slash followed by the string matched in #1, so","                //    \"yui-base/yui-base\" or \"simpleyui/simpleyui\" or \"yui-pants/yui-pants\".","                // 3. The second occurence of the #1 token can optionally be followed by \"-debug\" or \"-min\",","                //    so \"yui/yui-min\", \"yui/yui-debug\", \"yui-base/yui-base-debug\". NOT \"yui/yui-tshirt\".","                // 4. This is followed by \".js\", so \"yui/yui.js\", \"simpleyui/simpleyui-min.js\"","                // 0. Going back to the beginning, now. If all that stuff in 1-4 comes after a \"?\" in the string,","                //    then capture the junk between the LAST \"&\" and the string in 1-4.  So","                //    \"blah?foo/yui/yui.js\" will capture \"foo/\" and \"blah?some/thing.js&3.3.0/build/yui-davglass/yui-davglass.js\"","                //    will capture \"3.3.0/build/\"","                //","                // Regex Exploded:","                // (?:\\?             Find a ?","                //   (?:[^&]*&)      followed by 0..n characters followed by an &","                //   *               in fact, find as many sets of characters followed by a & as you can","                //   ([^&]*)         capture the stuff after the last & in \\1","                // )?                but it's ok if all this ?junk&more_junk stuff isn't even there","                // \\b(simpleyui|     after a word break find either the string \"simpleyui\" or","                //    yui(?:-\\w+)?   the string \"yui\" optionally followed by a -, then more characters","                // )                 and store the simpleyui or yui-* string in \\2","                // \\/\\2              then comes a / followed by the simpleyui or yui-* string in \\2","                // (?:-(min|debug))? optionally followed by \"-min\" or \"-debug\"","                // .js               and ending in \".js\"","                _BASE_RE: /(?:\\?(?:[^&]*&)*([^&]*))?\\b(simpleyui|yui(?:-\\w+)?)\\/\\2(?:-(min|debug))?\\.js/,","                parseBasePath: function(src, pattern) {","                    var match = src.match(pattern),","                        path, filter;","","                    if (match) {","                        path = RegExp.leftContext || src.slice(0, src.indexOf(match[0]));","","                        // this is to set up the path to the loader.  The file","                        // filter for loader should match the yui include.","                        filter = match[3];","","                        // extract correct path for mixed combo urls","                        // http://yuilibrary.com/projects/yui3/ticket/2528423","                        if (match[1]) {","                            path += '?' + match[1];","                        }","                        path = {","                            filter: filter,","                            path: path","                        };","                    }","                    return path;","                },","                getBase: G_ENV && G_ENV.getBase ||","                        function(pattern) {","                            var nodes = (doc && doc.getElementsByTagName('script')) || [],","                                path = Env.cdn, parsed,","                                i, len, src;","","                            for (i = 0, len = nodes.length; i < len; ++i) {","                                src = nodes[i].src;","                                if (src) {","                                    parsed = Y.Env.parseBasePath(src, pattern);","                                    if (parsed) {","                                        filter = parsed.filter;","                                        path = parsed.path;","                                        break;","                                    }","                                }","                            }","","                            // use CDN default","                            return path;","                        }","","            };","","            Env = Y.Env;","","            Env._loaded[VERSION] = {};","","            if (G_ENV && Y !== YUI) {","                Env._yidx = ++G_ENV._yidx;","                Env._guidp = ('yui_' + VERSION + '_' +","                             Env._yidx + '_' + time).replace(/\\./g, '_').replace(/-/g, '_');","            } else if (YUI._YUI) {","","                G_ENV = YUI._YUI.Env;","                Env._yidx += G_ENV._yidx;","                Env._uidx += G_ENV._uidx;","","                for (prop in G_ENV) {","                    if (!(prop in Env)) {","                        Env[prop] = G_ENV[prop];","                    }","                }","","                delete YUI._YUI;","            }","","            Y.id = Y.stamp(Y);","            instances[Y.id] = Y;","","        }","","        Y.constructor = YUI;","","        // configuration defaults","        Y.config = Y.config || {","            bootstrap: true,","            cacheUse: true,","            debug: true,","            doc: doc,","            fetchCSS: true,","            throwFail: true,","            useBrowserConsole: true,","            useNativeES5: true,","            win: win","        };","","        //Register the CSS stamp element","        if (doc && !doc.getElementById(CSS_STAMP_EL)) {","            el = doc.createElement('div');","            el.innerHTML = '<div id=\"' + CSS_STAMP_EL + '\" style=\"position: absolute !important; visibility: hidden !important\"></div>';","            YUI.Env.cssStampEl = el.firstChild;","            if (doc.body) {","                doc.body.appendChild(YUI.Env.cssStampEl);","            } else {","                docEl.insertBefore(YUI.Env.cssStampEl, docEl.firstChild);","            }","        }","","        Y.config.lang = Y.config.lang || 'en-US';","","        Y.config.base = YUI.config.base || Y.Env.getBase(Y.Env._BASE_RE);","","        if (!filter || (!('mindebug').indexOf(filter))) {","            filter = 'min';","        }","        filter = (filter) ? '-' + filter : filter;","        Y.config.loaderPath = YUI.config.loaderPath || 'loader/loader' + filter + '.js';","","    },","","    /**","     * Finishes the instance setup. Attaches whatever modules were defined","     * when the yui modules was registered.","     * @method _setup","     * @private","     */","    _setup: function(o) {","        var i, Y = this,","            core = [],","            mods = YUI.Env.mods,","            extras = Y.config.core || [].concat(YUI.Env.core); //Clone it..","","        for (i = 0; i < extras.length; i++) {","            if (mods[extras[i]]) {","                core.push(extras[i]);","            }","        }","","        Y._attach(['yui-base']);","        Y._attach(core);","","        if (Y.Loader) {","            getLoader(Y);","        }","","    },","","    /**","     * Executes a method on a YUI instance with","     * the specified id if the specified method is whitelisted.","     * @method applyTo","     * @param id {String} the YUI instance id.","     * @param method {String} the name of the method to exectute.","     * Ex: 'Object.keys'.","     * @param args {Array} the arguments to apply to the method.","     * @return {Object} the return value from the applied method or null.","     */","    applyTo: function(id, method, args) {","        if (!(method in APPLY_TO_AUTH)) {","            this.log(method + ': applyTo not allowed', 'warn', 'yui');","            return null;","        }","","        var instance = instances[id], nest, m, i;","        if (instance) {","            nest = method.split('.');","            m = instance;","            for (i = 0; i < nest.length; i = i + 1) {","                m = m[nest[i]];","                if (!m) {","                    this.log('applyTo not found: ' + method, 'warn', 'yui');","                }","            }","            return m && m.apply(instance, args);","        }","","        return null;","    },","","/**","Registers a module with the YUI global.  The easiest way to create a","first-class YUI module is to use the YUI component ","build tool <a href=\"http://yui.github.com/shifter/\">Shifter</a>.","","The build system will produce the `YUI.add` wrapper for your module, along","with any configuration info required for the module.","","@method add","@param name {String} module name.","@param fn {Function} entry point into the module that is used to bind module to the YUI instance.","@param {YUI} fn.Y The YUI instance this module is executed in.","@param {String} fn.name The name of the module","@param version {String} version string.","@param details {Object} optional config data:","@param details.requires {Array} features that must be present before this module can be attached.","@param details.optional {Array} optional features that should be present if loadOptional"," is defined.  Note: modules are not often loaded this way in YUI 3,"," but this field is still useful to inform the user that certain"," features in the component will require additional dependencies.","@param details.use {Array} features that are included within this module which need to"," be attached automatically when this module is attached.  This"," supports the YUI 3 rollup system -- a module with submodules"," defined will need to have the submodules listed in the 'use'"," config.  The YUI component build tool does this for you.","@return {YUI} the YUI instance.","@example","","    YUI.add('davglass', function(Y, name) {","        Y.davglass = function() {","            alert('Dav was here!');","        };","    }, '3.4.0', { requires: ['yui-base', 'harley-davidson', 'mt-dew'] });","","*/","    add: function(name, fn, version, details) {","        details = details || {};","        var env = YUI.Env,","            mod = {","                name: name,","                fn: fn,","                version: version,","                details: details","            },","            //Instance hash so we don't apply it to the same instance twice","            applied = {},","            loader, inst,","            i, versions = env.versions;","","        env.mods[name] = mod;","        versions[version] = versions[version] || {};","        versions[version][name] = mod;","","        for (i in instances) {","            if (instances.hasOwnProperty(i)) {","                inst = instances[i];","                if (!applied[inst.id]) {","                    applied[inst.id] = true;","                    loader = inst.Env._loader;","                    if (loader) {","                        if (!loader.moduleInfo[name] || loader.moduleInfo[name].temp) {","                            loader.addModule(details, name);","                        }","                    }","                }","            }","        }","","        return this;","    },","","    /**","     * Executes the function associated with each required","     * module, binding the module to the YUI instance.","     * @param {Array} r The array of modules to attach","     * @param {Boolean} [moot=false] Don't throw a warning if the module is not attached","     * @method _attach","     * @private","     */","    _attach: function(r, moot) {","        var i, name, mod, details, req, use, after,","            mods = YUI.Env.mods,","            aliases = YUI.Env.aliases,","            Y = this, j,","            cache = YUI.Env._renderedMods,","            loader = Y.Env._loader,","            done = Y.Env._attached,","            len = r.length, loader, def, go,","            c = [];","","        //Check for conditional modules (in a second+ instance) and add their requirements","        //TODO I hate this entire method, it needs to be fixed ASAP (3.5.0) ^davglass","        for (i = 0; i < len; i++) {","            name = r[i];","            mod = mods[name];","            c.push(name);","            if (loader && loader.conditions[name]) {","                for (j in loader.conditions[name]) {","                    if (loader.conditions[name].hasOwnProperty(j)) {","                        def = loader.conditions[name][j];","                        go = def && ((def.ua && Y.UA[def.ua]) || (def.test && def.test(Y)));","                        if (go) {","                            c.push(def.name);","                        }","                    }","                }","            }","        }","        r = c;","        len = r.length;","","        for (i = 0; i < len; i++) {","            if (!done[r[i]]) {","                name = r[i];","                mod = mods[name];","","                if (aliases && aliases[name] && !mod) {","                    Y._attach(aliases[name]);","                    continue;","                }","                if (!mod) {","                    if (loader && loader.moduleInfo[name]) {","                        mod = loader.moduleInfo[name];","                        moot = true;","                    }","","","                    //if (!loader || !loader.moduleInfo[name]) {","                    //if ((!loader || !loader.moduleInfo[name]) && !moot) {","                    if (!moot && name) {","                        if ((name.indexOf('skin-') === -1) && (name.indexOf('css') === -1)) {","                            Y.Env._missed.push(name);","                            Y.Env._missed = Y.Array.dedupe(Y.Env._missed);","                            Y.message('NOT loaded: ' + name, 'warn', 'yui');","                        }","                    }","                } else {","                    done[name] = true;","                    //Don't like this, but in case a mod was asked for once, then we fetch it","                    //We need to remove it from the missed list ^davglass","                    for (j = 0; j < Y.Env._missed.length; j++) {","                        if (Y.Env._missed[j] === name) {","                            Y.message('Found: ' + name + ' (was reported as missing earlier)', 'warn', 'yui');","                            Y.Env._missed.splice(j, 1);","                        }","                    }","                    /*","                        If it's a temp module, we need to redo it's requirements if it's already loaded","                        since it may have been loaded by another instance and it's dependencies might","                        have been redefined inside the fetched file.","                    */","                    if (loader && cache && cache[name] && cache[name].temp) {","                        loader.getRequires(cache[name]);","                        req = [];","                        for (j in loader.moduleInfo[name].expanded_map) {","                            if (loader.moduleInfo[name].expanded_map.hasOwnProperty(j)) {","                                req.push(j);","                            }","                        }","                        Y._attach(req);","                    }","                    ","                    details = mod.details;","                    req = details.requires;","                    use = details.use;","                    after = details.after;","                    //Force Intl load if there is a language (Loader logic) @todo fix this shit","                    if (details.lang) {","                        req = req || [];","                        req.unshift('intl');","                    }","","                    if (req) {","                        for (j = 0; j < req.length; j++) {","                            if (!done[req[j]]) {","                                if (!Y._attach(req)) {","                                    return false;","                                }","                                break;","                            }","                        }","                    }","","                    if (after) {","                        for (j = 0; j < after.length; j++) {","                            if (!done[after[j]]) {","                                if (!Y._attach(after, true)) {","                                    return false;","                                }","                                break;","                            }","                        }","                    }","","                    if (mod.fn) {","                            if (Y.config.throwFail) {","                                mod.fn(Y, name);","                            } else {","                                try {","                                    mod.fn(Y, name);","                                } catch (e) {","                                    Y.error('Attach error: ' + name, e, name);","                                return false;","                            }","                        }","                    }","","                    if (use) {","                        for (j = 0; j < use.length; j++) {","                            if (!done[use[j]]) {","                                if (!Y._attach(use)) {","                                    return false;","                                }","                                break;","                            }","                        }","                    }","","","","                }","            }","        }","","        return true;","    },","    /**","    * Delays the `use` callback until another event has taken place. Like: window.onload, domready, contentready, available.","    * @private","    * @method _delayCallback","    * @param {Callback} cb The original `use` callback","    * @param {String|Object} until Either an event (load, domready) or an Object containing event/args keys for contentready/available","    */","    _delayCallback: function(cb, until) {","","        var Y = this,","            mod = ['event-base'];","","        until = (Y.Lang.isObject(until) ? until : { event: until });","","        if (until.event === 'load') {","            mod.push('event-synthetic');","        }","","        return function() {","            var args = arguments;","            Y._use(mod, function() {","                Y.on(until.event, function() {","                    args[1].delayUntil = until.event;","                    cb.apply(Y, args);","                }, until.args);","            });","        };","    },","","    /**","     * Attaches one or more modules to the YUI instance.  When this","     * is executed, the requirements are analyzed, and one of","     * several things can happen:","     *","     *  * All requirements are available on the page --  The modules","     *   are attached to the instance.  If supplied, the use callback","     *   is executed synchronously.","     *","     *  * Modules are missing, the Get utility is not available OR","     *   the 'bootstrap' config is false -- A warning is issued about","     *   the missing modules and all available modules are attached.","     *","     *  * Modules are missing, the Loader is not available but the Get","     *   utility is and boostrap is not false -- The loader is bootstrapped","     *   before doing the following....","     *","     *  * Modules are missing and the Loader is available -- The loader","     *   expands the dependency tree and fetches missing modules.  When","     *   the loader is finshed the callback supplied to use is executed","     *   asynchronously.","     *","     * @method use","     * @param modules* {String|Array} 1-n modules to bind (uses arguments array).","     * @param [callback] {Function} callback function executed when","     * the instance has the required functionality.  If included, it","     * must be the last parameter.","     * @param callback.Y {YUI} The `YUI` instance created for this sandbox","     * @param callback.status {Object} Object containing `success`, `msg` and `data` properties","     *","     * @example","     *      // loads and attaches dd and its dependencies","     *      YUI().use('dd', function(Y) {});","     *","     *      // loads and attaches dd and node as well as all of their dependencies (since 3.4.0)","     *      YUI().use(['dd', 'node'], function(Y) {});","     *","     *      // attaches all modules that are available on the page","     *      YUI().use('*', function(Y) {});","     *","     *      // intrinsic YUI gallery support (since 3.1.0)","     *      YUI().use('gallery-yql', function(Y) {});","     *","     *      // intrinsic YUI 2in3 support (since 3.1.0)","     *      YUI().use('yui2-datatable', function(Y) {});","     *","     * @return {YUI} the YUI instance.","     */","    use: function() {","        var args = SLICE.call(arguments, 0),","            callback = args[args.length - 1],","            Y = this,","            i = 0,","            a = [],","            name,","            Env = Y.Env,","            provisioned = true;","","        // The last argument supplied to use can be a load complete callback","        if (Y.Lang.isFunction(callback)) {","            args.pop();","            if (Y.config.delayUntil) {","                callback = Y._delayCallback(callback, Y.config.delayUntil);","            }","        } else {","            callback = null;","        }","        if (Y.Lang.isArray(args[0])) {","            args = args[0];","        }","","        if (Y.config.cacheUse) {","            while ((name = args[i++])) {","                if (!Env._attached[name]) {","                    provisioned = false;","                    break;","                }","            }","","            if (provisioned) {","                if (args.length) {","                }","                Y._notify(callback, ALREADY_DONE, args);","                return Y;","            }","        }","","        if (Y._loading) {","            Y._useQueue = Y._useQueue || new Y.Queue();","            Y._useQueue.add([args, callback]);","        } else {","            Y._use(args, function(Y, response) {","                Y._notify(callback, response, args);","            });","        }","","        return Y;","    },","    /**","    * Notify handler from Loader for attachment/load errors","    * @method _notify","    * @param callback {Function} The callback to pass to the `Y.config.loadErrorFn`","    * @param response {Object} The response returned from Loader","    * @param args {Array} The aruments passed from Loader","    * @private","    */","    _notify: function(callback, response, args) {","        if (!response.success && this.config.loadErrorFn) {","            this.config.loadErrorFn.call(this, this, callback, response, args);","        } else if (callback) {","            if (this.Env._missed && this.Env._missed.length) {","                response.msg = 'Missing modules: ' + this.Env._missed.join();","                response.success = false;","            }","            if (this.config.throwFail) {","                callback(this, response);","            } else {","                try {","                    callback(this, response);","                } catch (e) {","                    this.error('use callback error', e, args);","                }","            }","        }","    },","","    /**","    * This private method is called from the `use` method queue. To ensure that only one set of loading","    * logic is performed at a time.","    * @method _use","    * @private","    * @param args* {String} 1-n modules to bind (uses arguments array).","    * @param *callback {Function} callback function executed when","    * the instance has the required functionality.  If included, it","    * must be the last parameter.","    */","    _use: function(args, callback) {","","        if (!this.Array) {","            this._attach(['yui-base']);","        }","","        var len, loader, handleBoot, handleRLS,","            Y = this,","            G_ENV = YUI.Env,","            mods = G_ENV.mods,","            Env = Y.Env,","            used = Env._used,","            aliases = G_ENV.aliases,","            queue = G_ENV._loaderQueue,","            firstArg = args[0],","            YArray = Y.Array,","            config = Y.config,","            boot = config.bootstrap,","            missing = [],","            i,","            r = [],","            ret = true,","            fetchCSS = config.fetchCSS,","            process = function(names, skip) {","","                var i = 0, a = [], name, len, m, req, use;","","                if (!names.length) {","                    return;","                }","","                if (aliases) {","                    len = names.length;","                    for (i = 0; i < len; i++) {","                        if (aliases[names[i]] && !mods[names[i]]) {","                            a = [].concat(a, aliases[names[i]]);","                        } else {","                            a.push(names[i]);","                        }","                    }","                    names = a;","                }","                ","                len = names.length;","                ","                for (i = 0; i < len; i++) {","                    name = names[i];","                    if (!skip) {","                        r.push(name);","                    }","","                    // only attach a module once","                    if (used[name]) {","                        continue;","                    }","                    ","                    m = mods[name];","                    req = null;","                    use = null;","","                    if (m) {","                        used[name] = true;","                        req = m.details.requires;","                        use = m.details.use;","                    } else {","                        // CSS files don't register themselves, see if it has","                        // been loaded","                        if (!G_ENV._loaded[VERSION][name]) {","                            missing.push(name);","                        } else {","                            used[name] = true; // probably css","                        }","                    }","","                    // make sure requirements are attached","                    if (req && req.length) {","                        process(req);","                    }","","                    // make sure we grab the submodule dependencies too","                    if (use && use.length) {","                        process(use, 1);","                    }","                }","","            },","","            handleLoader = function(fromLoader) {","                var response = fromLoader || {","                        success: true,","                        msg: 'not dynamic'","                    },","                    redo, origMissing,","                    ret = true,","                    data = response.data;","","                Y._loading = false;","","                if (data) {","                    origMissing = missing;","                    missing = [];","                    r = [];","                    process(data);","                    redo = missing.length;","                    if (redo) {","                        if ([].concat(missing).sort().join() ==","                                origMissing.sort().join()) {","                            redo = false;","                        }","                    }","                }","","                if (redo && data) {","                    Y._loading = true;","                    Y._use(missing, function() {","                        if (Y._attach(data)) {","                            Y._notify(callback, response, data);","                        }","                    });","                } else {","                    if (data) {","                        ret = Y._attach(data);","                    }","                    if (ret) {","                        Y._notify(callback, response, args);","                    }","                }","","                if (Y._useQueue && Y._useQueue.size() && !Y._loading) {","                    Y._use.apply(Y, Y._useQueue.next());","                }","","            };","","","        // YUI().use('*'); // bind everything available","        if (firstArg === '*') {","            args = [];","            for (i in mods) {","                if (mods.hasOwnProperty(i)) {","                    args.push(i);","                }","            }","            ret = Y._attach(args);","            if (ret) {","                handleLoader();","            }","            return Y;","        }","","        if ((mods.loader || mods['loader-base']) && !Y.Loader) {","            Y._attach(['loader' + ((!mods.loader) ? '-base' : '')]);","        }","","","        // use loader to expand dependencies and sort the","        // requirements if it is available.","        if (boot && Y.Loader && args.length) {","            loader = getLoader(Y);","            loader.require(args);","            loader.ignoreRegistered = true;","            loader._boot = true;","            loader.calculate(null, (fetchCSS) ? null : 'js');","            args = loader.sorted;","            loader._boot = false;","        }","        ","        process(args);","","        len = missing.length;","","","        if (len) {","            missing = YArray.dedupe(missing);","            len = missing.length;","        }","","","        // dynamic load","        if (boot && len && Y.Loader) {","            Y._loading = true;","            loader = getLoader(Y);","            loader.onEnd = handleLoader;","            loader.context = Y;","            loader.data = args;","            loader.ignoreRegistered = false;","            loader.require(args);","            loader.insert(null, (fetchCSS) ? null : 'js');","","        } else if (boot && len && Y.Get && !Env.bootstrapped) {","","            Y._loading = true;","","            handleBoot = function() {","                Y._loading = false;","                queue.running = false;","                Env.bootstrapped = true;","                G_ENV._bootstrapping = false;","                if (Y._attach(['loader'])) {","                    Y._use(args, callback);","                }","            };","","            if (G_ENV._bootstrapping) {","                queue.add(handleBoot);","            } else {","                G_ENV._bootstrapping = true;","                Y.Get.script(config.base + config.loaderPath, {","                    onEnd: handleBoot","                });","            }","","        } else {","            ret = Y._attach(args);","            if (ret) {","                handleLoader();","            }","        }","","        return Y;","    },","","","    /**","    Adds a namespace object onto the YUI global if called statically.","","        // creates YUI.your.namespace.here as nested objects","        YUI.namespace(\"your.namespace.here\");","","    If called as a method on a YUI <em>instance</em>, it creates the","    namespace on the instance.","","         // creates Y.property.package","         Y.namespace(\"property.package\");","","    Dots in the input string cause `namespace` to create nested objects for","    each token. If any part of the requested namespace already exists, the","    current object will be left in place.  This allows multiple calls to","    `namespace` to preserve existing namespaced properties.","","    If the first token in the namespace string is \"YAHOO\", the token is","    discarded.","","    Be careful with namespace tokens. Reserved words may work in some browsers","    and not others. For instance, the following will fail in some browsers","    because the supported version of JavaScript reserves the word \"long\":","","         Y.namespace(\"really.long.nested.namespace\");","","    <em>Note: If you pass multiple arguments to create multiple namespaces, only","    the last one created is returned from this function.</em>","","    @method namespace","    @param  {String} namespace* namespaces to create.","    @return {Object}  A reference to the last namespace object created.","    **/","    namespace: function() {","        var a = arguments, o, i = 0, j, d, arg;","","        for (; i < a.length; i++) {","            o = this; //Reset base object per argument or it will get reused from the last","            arg = a[i];","            if (arg.indexOf(PERIOD) > -1) { //Skip this if no \".\" is present","                d = arg.split(PERIOD);","                for (j = (d[0] == 'YAHOO') ? 1 : 0; j < d.length; j++) {","                    o[d[j]] = o[d[j]] || {};","                    o = o[d[j]];","                }","            } else {","                o[arg] = o[arg] || {};","                o = o[arg]; //Reset base object to the new object so it's returned","            }","        }","        return o;","    },","","    // this is replaced if the log module is included","    log: NOOP,","    message: NOOP,","    // this is replaced if the dump module is included","    dump: function (o) { return ''+o; },","","    /**","     * Report an error.  The reporting mechanism is controlled by","     * the `throwFail` configuration attribute.  If throwFail is","     * not specified, the message is written to the Logger, otherwise","     * a JS error is thrown. If an `errorFn` is specified in the config","     * it must return `true` to keep the error from being thrown.","     * @method error","     * @param msg {String} the error message.","     * @param e {Error|String} Optional JS error that was caught, or an error string.","     * @param src Optional additional info (passed to `Y.config.errorFn` and `Y.message`)","     * and `throwFail` is specified, this error will be re-thrown.","     * @return {YUI} this YUI instance.","     */","    error: function(msg, e, src) {","        //TODO Add check for window.onerror here","","        var Y = this, ret;","","        if (Y.config.errorFn) {","            ret = Y.config.errorFn.apply(Y, arguments);","        }","","        if (!ret) {","            throw (e || new Error(msg));","        } else {","            Y.message(msg, 'error', ''+src); // don't scrub this one","        }","","        return Y;","    },","","    /**","     * Generate an id that is unique among all YUI instances","     * @method guid","     * @param pre {String} optional guid prefix.","     * @return {String} the guid.","     */","    guid: function(pre) {","        var id = this.Env._guidp + '_' + (++this.Env._uidx);","        return (pre) ? (pre + id) : id;","    },","","    /**","     * Returns a `guid` associated with an object.  If the object","     * does not have one, a new one is created unless `readOnly`","     * is specified.","     * @method stamp","     * @param o {Object} The object to stamp.","     * @param readOnly {Boolean} if `true`, a valid guid will only","     * be returned if the object has one assigned to it.","     * @return {String} The object's guid or null.","     */","    stamp: function(o, readOnly) {","        var uid;","        if (!o) {","            return o;","        }","","        // IE generates its own unique ID for dom nodes","        // The uniqueID property of a document node returns a new ID","        if (o.uniqueID && o.nodeType && o.nodeType !== 9) {","            uid = o.uniqueID;","        } else {","            uid = (typeof o === 'string') ? o : o._yuid;","        }","","        if (!uid) {","            uid = this.guid();","            if (!readOnly) {","                try {","                    o._yuid = uid;","                } catch (e) {","                    uid = null;","                }","            }","        }","        return uid;","    },","","    /**","     * Destroys the YUI instance","     * @method destroy","     * @since 3.3.0","     */","    destroy: function() {","        var Y = this;","        if (Y.Event) {","            Y.Event._unload();","        }","        delete instances[Y.id];","        delete Y.Env;","        delete Y.config;","    }","","    /**","     * instanceof check for objects that works around","     * memory leak in IE when the item tested is","     * window/document","     * @method instanceOf","     * @param o {Object} The object to check.","     * @param type {Object} The class to check against.","     * @since 3.3.0","     */","};","","    YUI.prototype = proto;","","    // inheritance utilities are not available yet","    for (prop in proto) {","        if (proto.hasOwnProperty(prop)) {","            YUI[prop] = proto[prop];","        }","    }","","    /**","Static method on the Global YUI object to apply a config to all YUI instances.","It's main use case is \"mashups\" where several third party scripts are trying to write to","a global YUI config at the same time. This way they can all call `YUI.applyConfig({})` instead of","overwriting other scripts configs.","@static","@since 3.5.0","@method applyConfig","@param {Object} o the configuration object.","@example","","    YUI.applyConfig({","        modules: {","            davglass: {","                fullpath: './davglass.js'","            }","        }","    });","","    YUI.applyConfig({","        modules: {","            foo: {","                fullpath: './foo.js'","            }","        }","    });","","    YUI().use('davglass', function(Y) {","        //Module davglass will be available here..","    });","","    */","    YUI.applyConfig = function(o) {","        if (!o) {","            return;","        }","        //If there is a GlobalConfig, apply it first to set the defaults","        if (YUI.GlobalConfig) {","            this.prototype.applyConfig.call(this, YUI.GlobalConfig);","        }","        //Apply this config to it","        this.prototype.applyConfig.call(this, o);","        //Reset GlobalConfig to the combined config","        YUI.GlobalConfig = this.config;","    };","","    // set up the environment","    YUI._init();","","    if (hasWin) {","        // add a window load event at load time so we can capture","        // the case where it fires before dynamic loading is","        // complete.","        add(window, 'load', handleLoad);","    } else {","        handleLoad();","    }","","    YUI.Env.add = add;","    YUI.Env.remove = remove;","","    /*global exports*/","    // Support the CommonJS method for exporting our single global","    if (typeof exports == 'object') {","        exports.YUI = YUI;","    }","","}());","","","/**"," * The config object contains all of the configuration options for"," * the `YUI` instance.  This object is supplied by the implementer"," * when instantiating a `YUI` instance.  Some properties have default"," * values if they are not supplied by the implementer.  This should"," * not be updated directly because some values are cached.  Use"," * `applyConfig()` to update the config object on a YUI instance that"," * has already been configured."," *"," * @class config"," * @static"," */","","/**"," * Allows the YUI seed file to fetch the loader component and library"," * metadata to dynamically load additional dependencies."," *"," * @property bootstrap"," * @type boolean"," * @default true"," */","","/**"," * Turns on writing Ylog messages to the browser console."," *"," * @property debug"," * @type boolean"," * @default true"," */","","/**"," * Log to the browser console if debug is on and the browser has a"," * supported console."," *"," * @property useBrowserConsole"," * @type boolean"," * @default true"," */","","/**"," * A hash of log sources that should be logged.  If specified, only"," * log messages from these sources will be logged."," *"," * @property logInclude"," * @type object"," */","","/**"," * A hash of log sources that should be not be logged.  If specified,"," * all sources are logged if not on this list."," *"," * @property logExclude"," * @type object"," */","","/**"," * Set to true if the yui seed file was dynamically loaded in"," * order to bootstrap components relying on the window load event"," * and the `domready` custom event."," *"," * @property injected"," * @type boolean"," * @default false"," */","","/**"," * If `throwFail` is set, `Y.error` will generate or re-throw a JS Error."," * Otherwise the failure is logged."," *"," * @property throwFail"," * @type boolean"," * @default true"," */","","/**"," * The window/frame that this instance should operate in."," *"," * @property win"," * @type Window"," * @default the window hosting YUI"," */","","/**"," * The document associated with the 'win' configuration."," *"," * @property doc"," * @type Document"," * @default the document hosting YUI"," */","","/**"," * A list of modules that defines the YUI core (overrides the default list)."," *"," * @property core"," * @type Array"," * @default [ get,features,intl-base,yui-log,yui-later,loader-base, loader-rollup, loader-yui3 ]"," */","","/**"," * A list of languages in order of preference. This list is matched against"," * the list of available languages in modules that the YUI instance uses to"," * determine the best possible localization of language sensitive modules."," * Languages are represented using BCP 47 language tags, such as \"en-GB\" for"," * English as used in the United Kingdom, or \"zh-Hans-CN\" for simplified"," * Chinese as used in China. The list can be provided as a comma-separated"," * list or as an array."," *"," * @property lang"," * @type string|string[]"," */","","/**"," * The default date format"," * @property dateFormat"," * @type string"," * @deprecated use configuration in `DataType.Date.format()` instead."," */","","/**"," * The default locale"," * @property locale"," * @type string"," * @deprecated use `config.lang` instead."," */","","/**"," * The default interval when polling in milliseconds."," * @property pollInterval"," * @type int"," * @default 20"," */","","/**"," * The number of dynamic nodes to insert by default before"," * automatically removing them.  This applies to script nodes"," * because removing the node will not make the evaluated script"," * unavailable.  Dynamic CSS is not auto purged, because removing"," * a linked style sheet will also remove the style definitions."," * @property purgethreshold"," * @type int"," * @default 20"," */","","/**"," * The default interval when polling in milliseconds."," * @property windowResizeDelay"," * @type int"," * @default 40"," */","","/**"," * Base directory for dynamic loading"," * @property base"," * @type string"," */","","/*"," * The secure base dir (not implemented)"," * For dynamic loading."," * @property secureBase"," * @type string"," */","","/**"," * The YUI combo service base dir. Ex: `http://yui.yahooapis.com/combo?`"," * For dynamic loading."," * @property comboBase"," * @type string"," */","","/**"," * The root path to prepend to module path for the combo service."," * Ex: 3.0.0b1/build/"," * For dynamic loading."," * @property root"," * @type string"," */","","/**"," * A filter to apply to result urls.  This filter will modify the default"," * path for all modules.  The default path for the YUI library is the"," * minified version of the files (e.g., event-min.js).  The filter property"," * can be a predefined filter or a custom filter.  The valid predefined"," * filters are:"," * <dl>"," *  <dt>DEBUG</dt>"," *  <dd>Selects the debug versions of the library (e.g., event-debug.js)."," *      This option will automatically include the Logger widget</dd>"," *  <dt>RAW</dt>"," *  <dd>Selects the non-minified version of the library (e.g., event.js).</dd>"," * </dl>"," * You can also define a custom filter, which must be an object literal"," * containing a search expression and a replace string:"," *"," *      myFilter: {"," *          'searchExp': \"-min\\\\.js\","," *          'replaceStr': \"-debug.js\""," *      }"," *"," * For dynamic loading."," *"," * @property filter"," * @type string|object"," */","","/**"," * The `skin` config let's you configure application level skin"," * customizations.  It contains the following attributes which"," * can be specified to override the defaults:"," *"," *      // The default skin, which is automatically applied if not"," *      // overriden by a component-specific skin definition."," *      // Change this in to apply a different skin globally"," *      defaultSkin: 'sam',"," *"," *      // This is combined with the loader base property to get"," *      // the default root directory for a skin."," *      base: 'assets/skins/',"," *"," *      // Any component-specific overrides can be specified here,"," *      // making it possible to load different skins for different"," *      // components.  It is possible to load more than one skin"," *      // for a given component as well."," *      overrides: {"," *          slider: ['capsule', 'round']"," *      }"," *"," * For dynamic loading."," *"," *  @property skin"," */","","/**"," * Hash of per-component filter specification.  If specified for a given"," * component, this overrides the filter config."," *"," * For dynamic loading."," *"," * @property filters"," */","","/**"," * Use the YUI combo service to reduce the number of http connections"," * required to load your dependencies.  Turning this off will"," * disable combo handling for YUI and all module groups configured"," * with a combo service."," *"," * For dynamic loading."," *"," * @property combine"," * @type boolean"," * @default true if 'base' is not supplied, false if it is."," */","","/**"," * A list of modules that should never be dynamically loaded"," *"," * @property ignore"," * @type string[]"," */","","/**"," * A list of modules that should always be loaded when required, even if already"," * present on the page."," *"," * @property force"," * @type string[]"," */","","/**"," * Node or id for a node that should be used as the insertion point for new"," * nodes.  For dynamic loading."," *"," * @property insertBefore"," * @type string"," */","","/**"," * Object literal containing attributes to add to dynamically loaded script"," * nodes."," * @property jsAttributes"," * @type string"," */","","/**"," * Object literal containing attributes to add to dynamically loaded link"," * nodes."," * @property cssAttributes"," * @type string"," */","","/**"," * Number of milliseconds before a timeout occurs when dynamically"," * loading nodes. If not set, there is no timeout."," * @property timeout"," * @type int"," */","","/**"," * Callback for the 'CSSComplete' event.  When dynamically loading YUI"," * components with CSS, this property fires when the CSS is finished"," * loading but script loading is still ongoing.  This provides an"," * opportunity to enhance the presentation of a loading page a little"," * bit before the entire loading process is done."," *"," * @property onCSS"," * @type function"," */","","/**"," * A hash of module definitions to add to the list of YUI components."," * These components can then be dynamically loaded side by side with"," * YUI via the `use()` method. This is a hash, the key is the module"," * name, and the value is an object literal specifying the metdata"," * for the module.  See `Loader.addModule` for the supported module"," * metadata fields.  Also see groups, which provides a way to"," * configure the base and combo spec for a set of modules."," *"," *      modules: {"," *          mymod1: {"," *              requires: ['node'],"," *              fullpath: '/mymod1/mymod1.js'"," *          },"," *          mymod2: {"," *              requires: ['mymod1'],"," *              fullpath: '/mymod2/mymod2.js'"," *          },"," *          mymod3: '/js/mymod3.js',"," *          mycssmod: '/css/mycssmod.css'"," *      }"," *"," *"," * @property modules"," * @type object"," */","","/**"," * Aliases are dynamic groups of modules that can be used as"," * shortcuts."," *"," *      YUI({"," *          aliases: {"," *              davglass: [ 'node', 'yql', 'dd' ],"," *              mine: [ 'davglass', 'autocomplete']"," *          }"," *      }).use('mine', function(Y) {"," *          //Node, YQL, DD &amp; AutoComplete available here.."," *      });"," *"," * @property aliases"," * @type object"," */","","/**"," * A hash of module group definitions.  It for each group you"," * can specify a list of modules and the base path and"," * combo spec to use when dynamically loading the modules."," *"," *      groups: {"," *          yui2: {"," *              // specify whether or not this group has a combo service"," *              combine: true,"," *"," *              // The comboSeperator to use with this group's combo handler"," *              comboSep: ';',"," *"," *              // The maxURLLength for this server"," *              maxURLLength: 500,"," *"," *              // the base path for non-combo paths"," *              base: 'http://yui.yahooapis.com/2.8.0r4/build/',"," *"," *              // the path to the combo service"," *              comboBase: 'http://yui.yahooapis.com/combo?',"," *"," *              // a fragment to prepend to the path attribute when"," *              // when building combo urls"," *              root: '2.8.0r4/build/',"," *"," *              // the module definitions"," *              modules:  {"," *                  yui2_yde: {"," *                      path: \"yahoo-dom-event/yahoo-dom-event.js\""," *                  },"," *                  yui2_anim: {"," *                      path: \"animation/animation.js\","," *                      requires: ['yui2_yde']"," *                  }"," *              }"," *          }"," *      }"," *"," * @property groups"," * @type object"," */","","/**"," * The loader 'path' attribute to the loader itself.  This is combined"," * with the 'base' attribute to dynamically load the loader component"," * when boostrapping with the get utility alone."," *"," * @property loaderPath"," * @type string"," * @default loader/loader-min.js"," */","","/**"," * Specifies whether or not YUI().use(...) will attempt to load CSS"," * resources at all.  Any truthy value will cause CSS dependencies"," * to load when fetching script.  The special value 'force' will"," * cause CSS dependencies to be loaded even if no script is needed."," *"," * @property fetchCSS"," * @type boolean|string"," * @default true"," */","","/**"," * The default gallery version to build gallery module urls"," * @property gallery"," * @type string"," * @since 3.1.0"," */","","/**"," * The default YUI 2 version to build yui2 module urls.  This is for"," * intrinsic YUI 2 support via the 2in3 project.  Also see the '2in3'"," * config for pulling different revisions of the wrapped YUI 2"," * modules."," * @since 3.1.0"," * @property yui2"," * @type string"," * @default 2.9.0"," */","","/**"," * The 2in3 project is a deployment of the various versions of YUI 2"," * deployed as first-class YUI 3 modules.  Eventually, the wrapper"," * for the modules will change (but the underlying YUI 2 code will"," * be the same), and you can select a particular version of"," * the wrapper modules via this config."," * @since 3.1.0"," * @property 2in3"," * @type string"," * @default 4"," */","","/**"," * Alternative console log function for use in environments without"," * a supported native console.  The function is executed in the"," * YUI instance context."," * @since 3.1.0"," * @property logFn"," * @type Function"," */","","/**"," * A callback to execute when Y.error is called.  It receives the"," * error message and an javascript error object if Y.error was"," * executed because a javascript error was caught.  The function"," * is executed in the YUI instance context. Returning `true` from this"," * function will stop the Error from being thrown."," *"," * @since 3.2.0"," * @property errorFn"," * @type Function"," */","","/**"," * A callback to execute when the loader fails to load one or"," * more resource.  This could be because of a script load"," * failure.  It can also fail if a javascript module fails"," * to register itself, but only when the 'requireRegistration'"," * is true.  If this function is defined, the use() callback will"," * only be called when the loader succeeds, otherwise it always"," * executes unless there was a javascript error when attaching"," * a module."," *"," * @since 3.3.0"," * @property loadErrorFn"," * @type Function"," */","","/**"," * When set to true, the YUI loader will expect that all modules"," * it is responsible for loading will be first-class YUI modules"," * that register themselves with the YUI global.  If this is"," * set to true, loader will fail if the module registration fails"," * to happen after the script is loaded."," *"," * @since 3.3.0"," * @property requireRegistration"," * @type boolean"," * @default false"," */","","/**"," * Cache serviced use() requests."," * @since 3.3.0"," * @property cacheUse"," * @type boolean"," * @default true"," * @deprecated no longer used"," */","","/**"," * Whether or not YUI should use native ES5 functionality when available for"," * features like `Y.Array.each()`, `Y.Object()`, etc. When `false`, YUI will"," * always use its own fallback implementations instead of relying on ES5"," * functionality, even when it's available."," *"," * @property useNativeES5"," * @type Boolean"," * @default true"," * @since 3.5.0"," */","","/**","Delay the `use` callback until a specific event has passed (`load`, `domready`, `contentready` or `available`)","@property delayUntil","@type String|Object","@since 3.6.0","@example","","You can use `load` or `domready` strings by default:","","    YUI({","        delayUntil: 'domready'","    }, function(Y) {","        //This will not fire until 'domeready'","    });","","Or you can delay until a node is available (with `available` or `contentready`):","","    YUI({","        delayUntil: {","            event: 'available',","            args: '#foo'","        }","    }, function(Y) {","        //This will not fire until '#foo' is ","        // available in the DOM","    });","    ","","*/","YUI.add('yui-base', function (Y, NAME) {","","/*"," * YUI stub"," * @module yui"," * @submodule yui-base"," */","/**"," * The YUI module contains the components required for building the YUI"," * seed file.  This includes the script loading mechanism, a simple queue,"," * and the core utilities for the library."," * @module yui"," * @submodule yui-base"," */","","/**"," * Provides core language utilites and extensions used throughout YUI."," *"," * @class Lang"," * @static"," */","","var L = Y.Lang || (Y.Lang = {}),","","STRING_PROTO = String.prototype,","TOSTRING     = Object.prototype.toString,","","TYPES = {","    'undefined'        : 'undefined',","    'number'           : 'number',","    'boolean'          : 'boolean',","    'string'           : 'string',","    '[object Function]': 'function',","    '[object RegExp]'  : 'regexp',","    '[object Array]'   : 'array',","    '[object Date]'    : 'date',","    '[object Error]'   : 'error'","},","","SUBREGEX        = /\\{\\s*([^|}]+?)\\s*(?:\\|([^}]*))?\\s*\\}/g,","TRIMREGEX       = /^\\s+|\\s+$/g,","NATIVE_FN_REGEX = /\\{\\s*\\[(?:native code|function)\\]\\s*\\}/i;","","// -- Protected Methods --------------------------------------------------------","","/**","Returns `true` if the given function appears to be implemented in native code,","`false` otherwise. Will always return `false` -- even in ES5-capable browsers --","if the `useNativeES5` YUI config option is set to `false`.","","This isn't guaranteed to be 100% accurate and won't work for anything other than","functions, but it can be useful for determining whether a function like","`Array.prototype.forEach` is native or a JS shim provided by another library.","","There's a great article by @kangax discussing certain flaws with this technique:","<http://perfectionkills.com/detecting-built-in-host-methods/>","","While his points are valid, it's still possible to benefit from this function","as long as it's used carefully and sparingly, and in such a way that false","negatives have minimal consequences. It's used internally to avoid using","potentially broken non-native ES5 shims that have been added to the page by","other libraries.","","@method _isNative","@param {Function} fn Function to test.","@return {Boolean} `true` if _fn_ appears to be native, `false` otherwise.","@static","@protected","@since 3.5.0","**/","L._isNative = function (fn) {","    return !!(Y.config.useNativeES5 && fn && NATIVE_FN_REGEX.test(fn));","};","","// -- Public Methods -----------------------------------------------------------","","/**"," * Determines whether or not the provided item is an array."," *"," * Returns `false` for array-like collections such as the function `arguments`"," * collection or `HTMLElement` collections. Use `Y.Array.test()` if you want to"," * test for an array-like collection."," *"," * @method isArray"," * @param o The object to test."," * @return {boolean} true if o is an array."," * @static"," */","L.isArray = L._isNative(Array.isArray) ? Array.isArray : function (o) {","    return L.type(o) === 'array';","};","","/**"," * Determines whether or not the provided item is a boolean."," * @method isBoolean"," * @static"," * @param o The object to test."," * @return {boolean} true if o is a boolean."," */","L.isBoolean = function(o) {","    return typeof o === 'boolean';","};","","/**"," * Determines whether or not the supplied item is a date instance."," * @method isDate"," * @static"," * @param o The object to test."," * @return {boolean} true if o is a date."," */","L.isDate = function(o) {","    return L.type(o) === 'date' && o.toString() !== 'Invalid Date' && !isNaN(o);","};","","/**"," * <p>"," * Determines whether or not the provided item is a function."," * Note: Internet Explorer thinks certain functions are objects:"," * </p>"," *"," * <pre>"," * var obj = document.createElement(\"object\");"," * Y.Lang.isFunction(obj.getAttribute) // reports false in IE"," * &nbsp;"," * var input = document.createElement(\"input\"); // append to body"," * Y.Lang.isFunction(input.focus) // reports false in IE"," * </pre>"," *"," * <p>"," * You will have to implement additional tests if these functions"," * matter to you."," * </p>"," *"," * @method isFunction"," * @static"," * @param o The object to test."," * @return {boolean} true if o is a function."," */","L.isFunction = function(o) {","    return L.type(o) === 'function';","};","","/**"," * Determines whether or not the provided item is null."," * @method isNull"," * @static"," * @param o The object to test."," * @return {boolean} true if o is null."," */","L.isNull = function(o) {","    return o === null;","};","","/**"," * Determines whether or not the provided item is a legal number."," * @method isNumber"," * @static"," * @param o The object to test."," * @return {boolean} true if o is a number."," */","L.isNumber = function(o) {","    return typeof o === 'number' && isFinite(o);","};","","/**"," * Determines whether or not the provided item is of type object"," * or function. Note that arrays are also objects, so"," * <code>Y.Lang.isObject([]) === true</code>."," * @method isObject"," * @static"," * @param o The object to test."," * @param failfn {boolean} fail if the input is a function."," * @return {boolean} true if o is an object."," * @see isPlainObject"," */","L.isObject = function(o, failfn) {","    var t = typeof o;","    return (o && (t === 'object' ||","        (!failfn && (t === 'function' || L.isFunction(o))))) || false;","};","","/**"," * Determines whether or not the provided item is a string."," * @method isString"," * @static"," * @param o The object to test."," * @return {boolean} true if o is a string."," */","L.isString = function(o) {","    return typeof o === 'string';","};","","/**"," * Determines whether or not the provided item is undefined."," * @method isUndefined"," * @static"," * @param o The object to test."," * @return {boolean} true if o is undefined."," */","L.isUndefined = function(o) {","    return typeof o === 'undefined';","};","","/**"," * A convenience method for detecting a legitimate non-null value."," * Returns false for null/undefined/NaN, true for other values,"," * including 0/false/''"," * @method isValue"," * @static"," * @param o The item to test."," * @return {boolean} true if it is not null/undefined/NaN || false."," */","L.isValue = function(o) {","    var t = L.type(o);","","    switch (t) {","        case 'number':","            return isFinite(o);","","        case 'null': // fallthru","        case 'undefined':","            return false;","","        default:","            return !!t;","    }","};","","/**"," * Returns the current time in milliseconds."," *"," * @method now"," * @return {Number} Current time in milliseconds."," * @static"," * @since 3.3.0"," */","L.now = Date.now || function () {","    return new Date().getTime();","};","","/**"," * Lightweight version of <code>Y.substitute</code>. Uses the same template"," * structure as <code>Y.substitute</code>, but doesn't support recursion,"," * auto-object coersion, or formats."," * @method sub"," * @param {string} s String to be modified."," * @param {object} o Object containing replacement values."," * @return {string} the substitute result."," * @static"," * @since 3.2.0"," */","L.sub = function(s, o) {","    return s.replace ? s.replace(SUBREGEX, function (match, key) {","        return L.isUndefined(o[key]) ? match : o[key];","    }) : s;","};","","/**"," * Returns a string without any leading or trailing whitespace.  If"," * the input is not a string, the input will be returned untouched."," * @method trim"," * @static"," * @param s {string} the string to trim."," * @return {string} the trimmed string."," */","L.trim = STRING_PROTO.trim ? function(s) {","    return s && s.trim ? s.trim() : s;","} : function (s) {","    try {","        return s.replace(TRIMREGEX, '');","    } catch (e) {","        return s;","    }","};","","/**"," * Returns a string without any leading whitespace."," * @method trimLeft"," * @static"," * @param s {string} the string to trim."," * @return {string} the trimmed string."," */","L.trimLeft = STRING_PROTO.trimLeft ? function (s) {","    return s.trimLeft();","} : function (s) {","    return s.replace(/^\\s+/, '');","};","","/**"," * Returns a string without any trailing whitespace."," * @method trimRight"," * @static"," * @param s {string} the string to trim."," * @return {string} the trimmed string."," */","L.trimRight = STRING_PROTO.trimRight ? function (s) {","    return s.trimRight();","} : function (s) {","    return s.replace(/\\s+$/, '');","};","","/**","Returns one of the following strings, representing the type of the item passed","in:",""," * \"array\""," * \"boolean\""," * \"date\""," * \"error\""," * \"function\""," * \"null\""," * \"number\""," * \"object\""," * \"regexp\""," * \"string\""," * \"undefined\"","","Known issues:",""," * `typeof HTMLElementCollection` returns function in Safari, but","    `Y.Lang.type()` reports \"object\", which could be a good thing --","    but it actually caused the logic in <code>Y.Lang.isObject</code> to fail.","","@method type","@param o the item to test.","@return {string} the detected type.","@static","**/","L.type = function(o) {","    return TYPES[typeof o] || TYPES[TOSTRING.call(o)] || (o ? 'object' : 'null');","};","/**","@module yui","@submodule yui-base","*/","","var Lang   = Y.Lang,","    Native = Array.prototype,","","    hasOwn = Object.prototype.hasOwnProperty;","","/**","Provides utility methods for working with arrays. Additional array helpers can","be found in the `collection` and `array-extras` modules.","","`Y.Array(thing)` returns a native array created from _thing_. Depending on","_thing_'s type, one of the following will happen:","","  * Arrays are returned unmodified unless a non-zero _startIndex_ is","    specified.","  * Array-like collections (see `Array.test()`) are converted to arrays.","  * For everything else, a new array is created with _thing_ as the sole","    item.","","Note: elements that are also collections, such as `<form>` and `<select>`","elements, are not automatically converted to arrays. To force a conversion,","pass `true` as the value of the _force_ parameter.","","@class Array","@constructor","@param {Any} thing The thing to arrayify.","@param {Number} [startIndex=0] If non-zero and _thing_ is an array or array-like","  collection, a subset of items starting at the specified index will be","  returned.","@param {Boolean} [force=false] If `true`, _thing_ will be treated as an","  array-like collection no matter what.","@return {Array} A native array created from _thing_, according to the rules","  described above.","**/","function YArray(thing, startIndex, force) {","    var len, result;","","    startIndex || (startIndex = 0);","","    if (force || YArray.test(thing)) {","        // IE throws when trying to slice HTMLElement collections.","        try {","            return Native.slice.call(thing, startIndex);","        } catch (ex) {","            result = [];","","            for (len = thing.length; startIndex < len; ++startIndex) {","                result.push(thing[startIndex]);","            }","","            return result;","        }","    }","","    return [thing];","}","","Y.Array = YArray;","","/**","Dedupes an array of strings, returning an array that's guaranteed to contain","only one copy of a given string.","","This method differs from `Array.unique()` in that it's optimized for use only","with strings, whereas `unique` may be used with other types (but is slower).","Using `dedupe()` with non-string values may result in unexpected behavior.","","@method dedupe","@param {String[]} array Array of strings to dedupe.","@return {Array} Deduped copy of _array_.","@static","@since 3.4.0","**/","YArray.dedupe = function (array) {","    var hash    = {},","        results = [],","        i, item, len;","","    for (i = 0, len = array.length; i < len; ++i) {","        item = array[i];","","        if (!hasOwn.call(hash, item)) {","            hash[item] = 1;","            results.push(item);","        }","    }","","    return results;","};","","/**","Executes the supplied function on each item in the array. This method wraps","the native ES5 `Array.forEach()` method if available.","","@method each","@param {Array} array Array to iterate.","@param {Function} fn Function to execute on each item in the array. The function","  will receive the following arguments:","    @param {Any} fn.item Current array item.","    @param {Number} fn.index Current array index.","    @param {Array} fn.array Array being iterated.","@param {Object} [thisObj] `this` object to use when calling _fn_.","@return {YUI} The YUI instance.","@static","**/","YArray.each = YArray.forEach = Lang._isNative(Native.forEach) ? function (array, fn, thisObj) {","    Native.forEach.call(array || [], fn, thisObj || Y);","    return Y;","} : function (array, fn, thisObj) {","    for (var i = 0, len = (array && array.length) || 0; i < len; ++i) {","        if (i in array) {","            fn.call(thisObj || Y, array[i], i, array);","        }","    }","","    return Y;","};","","/**","Alias for `each()`.","","@method forEach","@static","**/","","/**","Returns an object using the first array as keys and the second as values. If","the second array is not provided, or if it doesn't contain the same number of","values as the first array, then `true` will be used in place of the missing","values.","","@example","","    Y.Array.hash(['a', 'b', 'c'], ['foo', 'bar']);","    // => {a: 'foo', b: 'bar', c: true}","","@method hash","@param {String[]} keys Array of strings to use as keys.","@param {Array} [values] Array to use as values.","@return {Object} Hash using the first array as keys and the second as values.","@static","**/","YArray.hash = function (keys, values) {","    var hash = {},","        vlen = (values && values.length) || 0,","        i, len;","","    for (i = 0, len = keys.length; i < len; ++i) {","        if (i in keys) {","            hash[keys[i]] = vlen > i && i in values ? values[i] : true;","        }","    }","","    return hash;","};","","/**","Returns the index of the first item in the array that's equal (using a strict","equality check) to the specified _value_, or `-1` if the value isn't found.","","This method wraps the native ES5 `Array.indexOf()` method if available.","","@method indexOf","@param {Array} array Array to search.","@param {Any} value Value to search for.","@param {Number} [from=0] The index at which to begin the search.","@return {Number} Index of the item strictly equal to _value_, or `-1` if not","    found.","@static","**/","YArray.indexOf = Lang._isNative(Native.indexOf) ? function (array, value, from) {","    return Native.indexOf.call(array, value, from);","} : function (array, value, from) {","    // http://es5.github.com/#x15.4.4.14","    var len = array.length;","","    from = +from || 0;","    from = (from > 0 || -1) * Math.floor(Math.abs(from));","","    if (from < 0) {","        from += len;","","        if (from < 0) {","            from = 0;","        }","    }","","    for (; from < len; ++from) {","        if (from in array && array[from] === value) {","            return from;","        }","    }","","    return -1;","};","","/**","Numeric sort convenience function.","","The native `Array.prototype.sort()` function converts values to strings and","sorts them in lexicographic order, which is unsuitable for sorting numeric","values. Provide `Array.numericSort` as a custom sort function when you want","to sort values in numeric order.","","@example","","    [42, 23, 8, 16, 4, 15].sort(Y.Array.numericSort);","    // => [4, 8, 15, 16, 23, 42]","","@method numericSort","@param {Number} a First value to compare.","@param {Number} b Second value to compare.","@return {Number} Difference between _a_ and _b_.","@static","**/","YArray.numericSort = function (a, b) {","    return a - b;","};","","/**","Executes the supplied function on each item in the array. Returning a truthy","value from the function will stop the processing of remaining items.","","@method some","@param {Array} array Array to iterate over.","@param {Function} fn Function to execute on each item. The function will receive","  the following arguments:","    @param {Any} fn.value Current array item.","    @param {Number} fn.index Current array index.","    @param {Array} fn.array Array being iterated over.","@param {Object} [thisObj] `this` object to use when calling _fn_.","@return {Boolean} `true` if the function returns a truthy value on any of the","  items in the array; `false` otherwise.","@static","**/","YArray.some = Lang._isNative(Native.some) ? function (array, fn, thisObj) {","    return Native.some.call(array, fn, thisObj);","} : function (array, fn, thisObj) {","    for (var i = 0, len = array.length; i < len; ++i) {","        if (i in array && fn.call(thisObj, array[i], i, array)) {","            return true;","        }","    }","","    return false;","};","","/**","Evaluates _obj_ to determine if it's an array, an array-like collection, or","something else. This is useful when working with the function `arguments`","collection and `HTMLElement` collections.","","Note: This implementation doesn't consider elements that are also","collections, such as `<form>` and `<select>`, to be array-like.","","@method test","@param {Object} obj Object to test.","@return {Number} A number indicating the results of the test:","","  * 0: Neither an array nor an array-like collection.","  * 1: Real array.","  * 2: Array-like collection.","","@static","**/","YArray.test = function (obj) {","    var result = 0;","","    if (Lang.isArray(obj)) {","        result = 1;","    } else if (Lang.isObject(obj)) {","        try {","            // indexed, but no tagName (element) or scrollTo/document (window. From DOM.isWindow test which we can't use here),","            // or functions without apply/call (Safari","            // HTMLElementCollection bug).","            if ('length' in obj && !obj.tagName && !(obj.scrollTo && obj.document) && !obj.apply) {","                result = 2;","            }","        } catch (ex) {}","    }","","    return result;","};","/**"," * The YUI module contains the components required for building the YUI"," * seed file.  This includes the script loading mechanism, a simple queue,"," * and the core utilities for the library."," * @module yui"," * @submodule yui-base"," */","","/**"," * A simple FIFO queue.  Items are added to the Queue with add(1..n items) and"," * removed using next()."," *"," * @class Queue"," * @constructor"," * @param {MIXED} item* 0..n items to seed the queue."," */","function Queue() {","    this._init();","    this.add.apply(this, arguments);","}","","Queue.prototype = {","    /**","     * Initialize the queue","     *","     * @method _init","     * @protected","     */","    _init: function() {","        /**","         * The collection of enqueued items","         *","         * @property _q","         * @type Array","         * @protected","         */","        this._q = [];","    },","","    /**","     * Get the next item in the queue. FIFO support","     *","     * @method next","     * @return {MIXED} the next item in the queue.","     */","    next: function() {","        return this._q.shift();","    },","","    /**","     * Get the last in the queue. LIFO support.","     *","     * @method last","     * @return {MIXED} the last item in the queue.","     */","    last: function() {","        return this._q.pop();","    },","","    /**","     * Add 0..n items to the end of the queue.","     *","     * @method add","     * @param {MIXED} item* 0..n items.","     * @return {object} this queue.","     */","    add: function() {","        this._q.push.apply(this._q, arguments);","","        return this;","    },","","    /**","     * Returns the current number of queued items.","     *","     * @method size","     * @return {Number} The size.","     */","    size: function() {","        return this._q.length;","    }","};","","Y.Queue = Queue;","","YUI.Env._loaderQueue = YUI.Env._loaderQueue || new Queue();","","/**","The YUI module contains the components required for building the YUI seed file.","This includes the script loading mechanism, a simple queue, and the core","utilities for the library.","","@module yui","@submodule yui-base","**/","","var CACHED_DELIMITER = '__',","","    hasOwn   = Object.prototype.hasOwnProperty,","    isObject = Y.Lang.isObject;","","/**","Returns a wrapper for a function which caches the return value of that function,","keyed off of the combined string representation of the argument values provided","when the wrapper is called.","","Calling this function again with the same arguments will return the cached value","rather than executing the wrapped function.","","Note that since the cache is keyed off of the string representation of arguments","passed to the wrapper function, arguments that aren't strings and don't provide","a meaningful `toString()` method may result in unexpected caching behavior. For","example, the objects `{}` and `{foo: 'bar'}` would both be converted to the","string `[object Object]` when used as a cache key.","","@method cached","@param {Function} source The function to memoize.","@param {Object} [cache={}] Object in which to store cached values. You may seed","  this object with pre-existing cached values if desired.","@param {any} [refetch] If supplied, this value is compared with the cached value","  using a `==` comparison. If the values are equal, the wrapped function is","  executed again even though a cached value exists.","@return {Function} Wrapped function.","@for YUI","**/","Y.cached = function (source, cache, refetch) {","    cache || (cache = {});","","    return function (arg) {","        var key = arguments.length > 1 ?","                Array.prototype.join.call(arguments, CACHED_DELIMITER) :","                String(arg);","","        if (!(key in cache) || (refetch && cache[key] == refetch)) {","            cache[key] = source.apply(source, arguments);","        }","","        return cache[key];","    };","};","","/**","Returns the `location` object from the window/frame in which this YUI instance","operates, or `undefined` when executing in a non-browser environment","(e.g. Node.js).","","It is _not_ recommended to hold references to the `window.location` object","outside of the scope of a function in which its properties are being accessed or","its methods are being called. This is because of a nasty bug/issue that exists","in both Safari and MobileSafari browsers:","[WebKit Bug 34679](https://bugs.webkit.org/show_bug.cgi?id=34679).","","@method getLocation","@return {location} The `location` object from the window/frame in which this YUI","    instance operates.","@since 3.5.0","**/","Y.getLocation = function () {","    // It is safer to look this up every time because yui-base is attached to a","    // YUI instance before a user's config is applied; i.e. `Y.config.win` does","    // not point the correct window object when this file is loaded.","    var win = Y.config.win;","","    // It is not safe to hold a reference to the `location` object outside the","    // scope in which it is being used. The WebKit engine used in Safari and","    // MobileSafari will \"disconnect\" the `location` object from the `window`","    // when a page is restored from back/forward history cache.","    return win && win.location;","};","","/**","Returns a new object containing all of the properties of all the supplied","objects. The properties from later objects will overwrite those in earlier","objects.","","Passing in a single object will create a shallow copy of it. For a deep copy,","use `clone()`.","","@method merge","@param {Object} objects* One or more objects to merge.","@return {Object} A new merged object.","**/","Y.merge = function () {","    var i      = 0,","        len    = arguments.length,","        result = {},","        key,","        obj;","","    for (; i < len; ++i) {","        obj = arguments[i];","","        for (key in obj) {","            if (hasOwn.call(obj, key)) {","                result[key] = obj[key];","            }","        }","    }","","    return result;","};","","/**","Mixes _supplier_'s properties into _receiver_.","","Properties on _receiver_ or _receiver_'s prototype will not be overwritten or","shadowed unless the _overwrite_ parameter is `true`, and will not be merged","unless the _merge_ parameter is `true`.","","In the default mode (0), only properties the supplier owns are copied (prototype","properties are not copied). The following copying modes are available:","","  * `0`: _Default_. Object to object.","  * `1`: Prototype to prototype.","  * `2`: Prototype to prototype and object to object.","  * `3`: Prototype to object.","  * `4`: Object to prototype.","","@method mix","@param {Function|Object} receiver The object or function to receive the mixed","  properties.","@param {Function|Object} supplier The object or function supplying the","  properties to be mixed.","@param {Boolean} [overwrite=false] If `true`, properties that already exist","  on the receiver will be overwritten with properties from the supplier.","@param {String[]} [whitelist] An array of property names to copy. If","  specified, only the whitelisted properties will be copied, and all others","  will be ignored.","@param {Number} [mode=0] Mix mode to use. See above for available modes.","@param {Boolean} [merge=false] If `true`, objects and arrays that already","  exist on the receiver will have the corresponding object/array from the","  supplier merged into them, rather than being skipped or overwritten. When","  both _overwrite_ and _merge_ are `true`, _merge_ takes precedence.","@return {Function|Object|YUI} The receiver, or the YUI instance if the","  specified receiver is falsy.","**/","Y.mix = function(receiver, supplier, overwrite, whitelist, mode, merge) {","    var alwaysOverwrite, exists, from, i, key, len, to;","","    // If no supplier is given, we return the receiver. If no receiver is given,","    // we return Y. Returning Y doesn't make much sense to me, but it's","    // grandfathered in for backcompat reasons.","    if (!receiver || !supplier) {","        return receiver || Y;","    }","","    if (mode) {","        // In mode 2 (prototype to prototype and object to object), we recurse","        // once to do the proto to proto mix. The object to object mix will be","        // handled later on.","        if (mode === 2) {","            Y.mix(receiver.prototype, supplier.prototype, overwrite,","                    whitelist, 0, merge);","        }","","        // Depending on which mode is specified, we may be copying from or to","        // the prototypes of the supplier and receiver.","        from = mode === 1 || mode === 3 ? supplier.prototype : supplier;","        to   = mode === 1 || mode === 4 ? receiver.prototype : receiver;","","        // If either the supplier or receiver doesn't actually have a","        // prototype property, then we could end up with an undefined `from`","        // or `to`. If that happens, we abort and return the receiver.","        if (!from || !to) {","            return receiver;","        }","    } else {","        from = supplier;","        to   = receiver;","    }","","    // If `overwrite` is truthy and `merge` is falsy, then we can skip a","    // property existence check on each iteration and save some time.","    alwaysOverwrite = overwrite && !merge;","","    if (whitelist) {","        for (i = 0, len = whitelist.length; i < len; ++i) {","            key = whitelist[i];","","            // We call `Object.prototype.hasOwnProperty` instead of calling","            // `hasOwnProperty` on the object itself, since the object's","            // `hasOwnProperty` method may have been overridden or removed.","            // Also, some native objects don't implement a `hasOwnProperty`","            // method.","            if (!hasOwn.call(from, key)) {","                continue;","            }","","            // The `key in to` check here is (sadly) intentional for backwards","            // compatibility reasons. It prevents undesired shadowing of","            // prototype members on `to`.","            exists = alwaysOverwrite ? false : key in to;","","            if (merge && exists && isObject(to[key], true)","                    && isObject(from[key], true)) {","                // If we're in merge mode, and the key is present on both","                // objects, and the value on both objects is either an object or","                // an array (but not a function), then we recurse to merge the","                // `from` value into the `to` value instead of overwriting it.","                //","                // Note: It's intentional that the whitelist isn't passed to the","                // recursive call here. This is legacy behavior that lots of","                // code still depends on.","                Y.mix(to[key], from[key], overwrite, null, 0, merge);","            } else if (overwrite || !exists) {","                // We're not in merge mode, so we'll only copy the `from` value","                // to the `to` value if we're in overwrite mode or if the","                // current key doesn't exist on the `to` object.","                to[key] = from[key];","            }","        }","    } else {","        for (key in from) {","            // The code duplication here is for runtime performance reasons.","            // Combining whitelist and non-whitelist operations into a single","            // loop or breaking the shared logic out into a function both result","            // in worse performance, and Y.mix is critical enough that the byte","            // tradeoff is worth it.","            if (!hasOwn.call(from, key)) {","                continue;","            }","","            // The `key in to` check here is (sadly) intentional for backwards","            // compatibility reasons. It prevents undesired shadowing of","            // prototype members on `to`.","            exists = alwaysOverwrite ? false : key in to;","","            if (merge && exists && isObject(to[key], true)","                    && isObject(from[key], true)) {","                Y.mix(to[key], from[key], overwrite, null, 0, merge);","            } else if (overwrite || !exists) {","                to[key] = from[key];","            }","        }","","        // If this is an IE browser with the JScript enumeration bug, force","        // enumeration of the buggy properties by making a recursive call with","        // the buggy properties as the whitelist.","        if (Y.Object._hasEnumBug) {","            Y.mix(to, from, overwrite, Y.Object._forceEnum, mode, merge);","        }","    }","","    return receiver;","};","/**"," * The YUI module contains the components required for building the YUI"," * seed file.  This includes the script loading mechanism, a simple queue,"," * and the core utilities for the library."," * @module yui"," * @submodule yui-base"," */","","/**"," * Adds utilities to the YUI instance for working with objects."," *"," * @class Object"," */","","var Lang   = Y.Lang,","    hasOwn = Object.prototype.hasOwnProperty,","","    UNDEFINED, // <-- Note the comma. We're still declaring vars.","","/**"," * Returns a new object that uses _obj_ as its prototype. This method wraps the"," * native ES5 `Object.create()` method if available, but doesn't currently"," * pass through `Object.create()`'s second argument (properties) in order to"," * ensure compatibility with older browsers."," *"," * @method ()"," * @param {Object} obj Prototype object."," * @return {Object} New object using _obj_ as its prototype."," * @static"," */","O = Y.Object = Lang._isNative(Object.create) ? function (obj) {","    // We currently wrap the native Object.create instead of simply aliasing it","    // to ensure consistency with our fallback shim, which currently doesn't","    // support Object.create()'s second argument (properties). Once we have a","    // safe fallback for the properties arg, we can stop wrapping","    // Object.create().","    return Object.create(obj);","} : (function () {","    // Reusable constructor function for the Object.create() shim.","    function F() {}","","    // The actual shim.","    return function (obj) {","        F.prototype = obj;","        return new F();","    };","}()),","","/**"," * Property names that IE doesn't enumerate in for..in loops, even when they"," * should be enumerable. When `_hasEnumBug` is `true`, it's necessary to"," * manually enumerate these properties."," *"," * @property _forceEnum"," * @type String[]"," * @protected"," * @static"," */","forceEnum = O._forceEnum = [","    'hasOwnProperty',","    'isPrototypeOf',","    'propertyIsEnumerable',","    'toString',","    'toLocaleString',","    'valueOf'","],","","/**"," * `true` if this browser has the JScript enumeration bug that prevents"," * enumeration of the properties named in the `_forceEnum` array, `false`"," * otherwise."," *"," * See:"," *   - <https://developer.mozilla.org/en/ECMAScript_DontEnum_attribute#JScript_DontEnum_Bug>"," *   - <http://whattheheadsaid.com/2010/10/a-safer-object-keys-compatibility-implementation>"," *"," * @property _hasEnumBug"," * @type Boolean"," * @protected"," * @static"," */","hasEnumBug = O._hasEnumBug = !{valueOf: 0}.propertyIsEnumerable('valueOf'),","","/**"," * `true` if this browser incorrectly considers the `prototype` property of"," * functions to be enumerable. Currently known to affect Opera 11.50."," *"," * @property _hasProtoEnumBug"," * @type Boolean"," * @protected"," * @static"," */","hasProtoEnumBug = O._hasProtoEnumBug = (function () {}).propertyIsEnumerable('prototype'),","","/**"," * Returns `true` if _key_ exists on _obj_, `false` if _key_ doesn't exist or"," * exists only on _obj_'s prototype. This is essentially a safer version of"," * `obj.hasOwnProperty()`."," *"," * @method owns"," * @param {Object} obj Object to test."," * @param {String} key Property name to look for."," * @return {Boolean} `true` if _key_ exists on _obj_, `false` otherwise."," * @static"," */","owns = O.owns = function (obj, key) {","    return !!obj && hasOwn.call(obj, key);","}; // <-- End of var declarations.","","/**"," * Alias for `owns()`."," *"," * @method hasKey"," * @param {Object} obj Object to test."," * @param {String} key Property name to look for."," * @return {Boolean} `true` if _key_ exists on _obj_, `false` otherwise."," * @static"," */","O.hasKey = owns;","","/**"," * Returns an array containing the object's enumerable keys. Does not include"," * prototype keys or non-enumerable keys."," *"," * Note that keys are returned in enumeration order (that is, in the same order"," * that they would be enumerated by a `for-in` loop), which may not be the same"," * as the order in which they were defined."," *"," * This method is an alias for the native ES5 `Object.keys()` method if"," * available."," *"," * @example"," *"," *     Y.Object.keys({a: 'foo', b: 'bar', c: 'baz'});"," *     // => ['a', 'b', 'c']"," *"," * @method keys"," * @param {Object} obj An object."," * @return {String[]} Array of keys."," * @static"," */","O.keys = Lang._isNative(Object.keys) ? Object.keys : function (obj) {","    if (!Lang.isObject(obj)) {","        throw new TypeError('Object.keys called on a non-object');","    }","","    var keys = [],","        i, key, len;","","    if (hasProtoEnumBug && typeof obj === 'function') {","        for (key in obj) {","            if (owns(obj, key) && key !== 'prototype') {","                keys.push(key);","            }","        }","    } else {","        for (key in obj) {","            if (owns(obj, key)) {","                keys.push(key);","            }","        }","    }","","    if (hasEnumBug) {","        for (i = 0, len = forceEnum.length; i < len; ++i) {","            key = forceEnum[i];","","            if (owns(obj, key)) {","                keys.push(key);","            }","        }","    }","","    return keys;","};","","/**"," * Returns an array containing the values of the object's enumerable keys."," *"," * Note that values are returned in enumeration order (that is, in the same"," * order that they would be enumerated by a `for-in` loop), which may not be the"," * same as the order in which they were defined."," *"," * @example"," *"," *     Y.Object.values({a: 'foo', b: 'bar', c: 'baz'});"," *     // => ['foo', 'bar', 'baz']"," *"," * @method values"," * @param {Object} obj An object."," * @return {Array} Array of values."," * @static"," */","O.values = function (obj) {","    var keys   = O.keys(obj),","        i      = 0,","        len    = keys.length,","        values = [];","","    for (; i < len; ++i) {","        values.push(obj[keys[i]]);","    }","","    return values;","};","","/**"," * Returns the number of enumerable keys owned by an object."," *"," * @method size"," * @param {Object} obj An object."," * @return {Number} The object's size."," * @static"," */","O.size = function (obj) {","    try {","        return O.keys(obj).length;","    } catch (ex) {","        return 0; // Legacy behavior for non-objects.","    }","};","","/**"," * Returns `true` if the object owns an enumerable property with the specified"," * value."," *"," * @method hasValue"," * @param {Object} obj An object."," * @param {any} value The value to search for."," * @return {Boolean} `true` if _obj_ contains _value_, `false` otherwise."," * @static"," */","O.hasValue = function (obj, value) {","    return Y.Array.indexOf(O.values(obj), value) > -1;","};","","/**"," * Executes a function on each enumerable property in _obj_. The function"," * receives the value, the key, and the object itself as parameters (in that"," * order)."," *"," * By default, only properties owned by _obj_ are enumerated. To include"," * prototype properties, set the _proto_ parameter to `true`."," *"," * @method each"," * @param {Object} obj Object to enumerate."," * @param {Function} fn Function to execute on each enumerable property."," *   @param {mixed} fn.value Value of the current property."," *   @param {String} fn.key Key of the current property."," *   @param {Object} fn.obj Object being enumerated."," * @param {Object} [thisObj] `this` object to use when calling _fn_."," * @param {Boolean} [proto=false] Include prototype properties."," * @return {YUI} the YUI instance."," * @chainable"," * @static"," */","O.each = function (obj, fn, thisObj, proto) {","    var key;","","    for (key in obj) {","        if (proto || owns(obj, key)) {","            fn.call(thisObj || Y, obj[key], key, obj);","        }","    }","","    return Y;","};","","/**"," * Executes a function on each enumerable property in _obj_, but halts if the"," * function returns a truthy value. The function receives the value, the key,"," * and the object itself as paramters (in that order)."," *"," * By default, only properties owned by _obj_ are enumerated. To include"," * prototype properties, set the _proto_ parameter to `true`."," *"," * @method some"," * @param {Object} obj Object to enumerate."," * @param {Function} fn Function to execute on each enumerable property."," *   @param {mixed} fn.value Value of the current property."," *   @param {String} fn.key Key of the current property."," *   @param {Object} fn.obj Object being enumerated."," * @param {Object} [thisObj] `this` object to use when calling _fn_."," * @param {Boolean} [proto=false] Include prototype properties."," * @return {Boolean} `true` if any execution of _fn_ returns a truthy value,"," *   `false` otherwise."," * @static"," */","O.some = function (obj, fn, thisObj, proto) {","    var key;","","    for (key in obj) {","        if (proto || owns(obj, key)) {","            if (fn.call(thisObj || Y, obj[key], key, obj)) {","                return true;","            }","        }","    }","","    return false;","};","","/**"," * Retrieves the sub value at the provided path,"," * from the value object provided."," *"," * @method getValue"," * @static"," * @param o The object from which to extract the property value."," * @param path {Array} A path array, specifying the object traversal path"," * from which to obtain the sub value."," * @return {Any} The value stored in the path, undefined if not found,"," * undefined if the source is not an object.  Returns the source object"," * if an empty path is provided."," */","O.getValue = function(o, path) {","    if (!Lang.isObject(o)) {","        return UNDEFINED;","    }","","    var i,","        p = Y.Array(path),","        l = p.length;","","    for (i = 0; o !== UNDEFINED && i < l; i++) {","        o = o[p[i]];","    }","","    return o;","};","","/**"," * Sets the sub-attribute value at the provided path on the"," * value object.  Returns the modified value object, or"," * undefined if the path is invalid."," *"," * @method setValue"," * @static"," * @param o             The object on which to set the sub value."," * @param path {Array}  A path array, specifying the object traversal path"," *                      at which to set the sub value."," * @param val {Any}     The new value for the sub-attribute."," * @return {Object}     The modified object, with the new sub value set, or"," *                      undefined, if the path was invalid."," */","O.setValue = function(o, path, val) {","    var i,","        p = Y.Array(path),","        leafIdx = p.length - 1,","        ref = o;","","    if (leafIdx >= 0) {","        for (i = 0; ref !== UNDEFINED && i < leafIdx; i++) {","            ref = ref[p[i]];","        }","","        if (ref !== UNDEFINED) {","            ref[p[i]] = val;","        } else {","            return UNDEFINED;","        }","    }","","    return o;","};","","/**"," * Returns `true` if the object has no enumerable properties of its own."," *"," * @method isEmpty"," * @param {Object} obj An object."," * @return {Boolean} `true` if the object is empty."," * @static"," * @since 3.2.0"," */","O.isEmpty = function (obj) {","    return !O.keys(Object(obj)).length;","};","/**"," * The YUI module contains the components required for building the YUI seed"," * file.  This includes the script loading mechanism, a simple queue, and the"," * core utilities for the library."," * @module yui"," * @submodule yui-base"," */","","/**"," * YUI user agent detection."," * Do not fork for a browser if it can be avoided.  Use feature detection when"," * you can.  Use the user agent as a last resort.  For all fields listed"," * as @type float, UA stores a version number for the browser engine,"," * 0 otherwise.  This value may or may not map to the version number of"," * the browser using the engine.  The value is presented as a float so"," * that it can easily be used for boolean evaluation as well as for"," * looking for a particular range of versions.  Because of this,"," * some of the granularity of the version info may be lost.  The fields that"," * are @type string default to null.  The API docs list the values that"," * these fields can have."," * @class UA"," * @static"," */","","/**","* Static method on `YUI.Env` for parsing a UA string.  Called at instantiation","* to populate `Y.UA`.","*","* @static","* @method parseUA","* @param {String} [subUA=navigator.userAgent] UA string to parse","* @return {Object} The Y.UA object","*/","YUI.Env.parseUA = function(subUA) {","","    var numberify = function(s) {","            var c = 0;","            return parseFloat(s.replace(/\\./g, function() {","                return (c++ === 1) ? '' : '.';","            }));","        },","","        win = Y.config.win,","","        nav = win && win.navigator,","","        o = {","","        /**","         * Internet Explorer version number or 0.  Example: 6","         * @property ie","         * @type float","         * @static","         */","        ie: 0,","","        /**","         * Opera version number or 0.  Example: 9.2","         * @property opera","         * @type float","         * @static","         */","        opera: 0,","","        /**","         * Gecko engine revision number.  Will evaluate to 1 if Gecko","         * is detected but the revision could not be found. Other browsers","         * will be 0.  Example: 1.8","         * <pre>","         * Firefox 1.0.0.4: 1.7.8   <-- Reports 1.7","         * Firefox 1.5.0.9: 1.8.0.9 <-- 1.8","         * Firefox 2.0.0.3: 1.8.1.3 <-- 1.81","         * Firefox 3.0   <-- 1.9","         * Firefox 3.5   <-- 1.91","         * </pre>","         * @property gecko","         * @type float","         * @static","         */","        gecko: 0,","","        /**","         * AppleWebKit version.  KHTML browsers that are not WebKit browsers","         * will evaluate to 1, other browsers 0.  Example: 418.9","         * <pre>","         * Safari 1.3.2 (312.6): 312.8.1 <-- Reports 312.8 -- currently the","         *                                   latest available for Mac OSX 10.3.","         * Safari 2.0.2:         416     <-- hasOwnProperty introduced","         * Safari 2.0.4:         418     <-- preventDefault fixed","         * Safari 2.0.4 (419.3): 418.9.1 <-- One version of Safari may run","         *                                   different versions of webkit","         * Safari 2.0.4 (419.3): 419     <-- Tiger installations that have been","         *                                   updated, but not updated","         *                                   to the latest patch.","         * Webkit 212 nightly:   522+    <-- Safari 3.0 precursor (with native","         * SVG and many major issues fixed).","         * Safari 3.0.4 (523.12) 523.12  <-- First Tiger release - automatic","         * update from 2.x via the 10.4.11 OS patch.","         * Webkit nightly 1/2008:525+    <-- Supports DOMContentLoaded event.","         *                                   yahoo.com user agent hack removed.","         * </pre>","         * http://en.wikipedia.org/wiki/Safari_version_history","         * @property webkit","         * @type float","         * @static","         */","        webkit: 0,","","        /**","         * Safari will be detected as webkit, but this property will also","         * be populated with the Safari version number","         * @property safari","         * @type float","         * @static","         */","        safari: 0,","","        /**","         * Chrome will be detected as webkit, but this property will also","         * be populated with the Chrome version number","         * @property chrome","         * @type float","         * @static","         */","        chrome: 0,","","        /**","         * The mobile property will be set to a string containing any relevant","         * user agent information when a modern mobile browser is detected.","         * Currently limited to Safari on the iPhone/iPod Touch, Nokia N-series","         * devices with the WebKit-based browser, and Opera Mini.","         * @property mobile","         * @type string","         * @default null","         * @static","         */","        mobile: null,","","        /**","         * Adobe AIR version number or 0.  Only populated if webkit is detected.","         * Example: 1.0","         * @property air","         * @type float","         */","        air: 0,","        /**","         * PhantomJS version number or 0.  Only populated if webkit is detected.","         * Example: 1.0","         * @property phantomjs","         * @type float","         */","        phantomjs: 0,","        /**","         * Detects Apple iPad's OS version","         * @property ipad","         * @type float","         * @static","         */","        ipad: 0,","        /**","         * Detects Apple iPhone's OS version","         * @property iphone","         * @type float","         * @static","         */","        iphone: 0,","        /**","         * Detects Apples iPod's OS version","         * @property ipod","         * @type float","         * @static","         */","        ipod: 0,","        /**","         * General truthy check for iPad, iPhone or iPod","         * @property ios","         * @type Boolean","         * @default null","         * @static","         */","        ios: null,","        /**","         * Detects Googles Android OS version","         * @property android","         * @type float","         * @static","         */","        android: 0,","        /**","         * Detects Kindle Silk","         * @property silk","         * @type float","         * @static","         */","        silk: 0,","        /**","         * Detects Kindle Silk Acceleration","         * @property accel","         * @type Boolean","         * @static","         */","        accel: false,","        /**","         * Detects Palms WebOS version","         * @property webos","         * @type float","         * @static","         */","        webos: 0,","","        /**","         * Google Caja version number or 0.","         * @property caja","         * @type float","         */","        caja: nav && nav.cajaVersion,","","        /**","         * Set to true if the page appears to be in SSL","         * @property secure","         * @type boolean","         * @static","         */","        secure: false,","","        /**","         * The operating system.  Currently only detecting windows or macintosh","         * @property os","         * @type string","         * @default null","         * @static","         */","        os: null,","","        /**","         * The Nodejs Version","         * @property nodejs","         * @type float","         * @default 0","         * @static","         */","        nodejs: 0,","        /*","        * Window8/IE10 Application host environment","        * @property winjs","        * @type Boolean","        * @static","        */","        winjs: !!((typeof Windows !== \"undefined\") && Windows.System),","        /**","        * Are touch/msPointer events available on this device","        * @property touchEnabled","        * @type Boolean","        * @static","        */","        touchEnabled: false","    },","","    ua = subUA || nav && nav.userAgent,","","    loc = win && win.location,","","    href = loc && loc.href,","","    m;","","    /**","    * The User Agent string that was parsed","    * @property userAgent","    * @type String","    * @static","    */","    o.userAgent = ua;","","","    o.secure = href && (href.toLowerCase().indexOf('https') === 0);","","    if (ua) {","","        if ((/windows|win32/i).test(ua)) {","            o.os = 'windows';","        } else if ((/macintosh|mac_powerpc/i).test(ua)) {","            o.os = 'macintosh';","        } else if ((/android/i).test(ua)) {","            o.os = 'android';","        } else if ((/symbos/i).test(ua)) {","            o.os = 'symbos';","        } else if ((/linux/i).test(ua)) {","            o.os = 'linux';","        } else if ((/rhino/i).test(ua)) {","            o.os = 'rhino';","        }","","        // Modern KHTML browsers should qualify as Safari X-Grade","        if ((/KHTML/).test(ua)) {","            o.webkit = 1;","        }","        if ((/IEMobile|XBLWP7/).test(ua)) {","            o.mobile = 'windows';","        }","        if ((/Fennec/).test(ua)) {","            o.mobile = 'gecko';","        }","        // Modern WebKit browsers are at least X-Grade","        m = ua.match(/AppleWebKit\\/([^\\s]*)/);","        if (m && m[1]) {","            o.webkit = numberify(m[1]);","            o.safari = o.webkit;","","            if (/PhantomJS/.test(ua)) {","                m = ua.match(/PhantomJS\\/([^\\s]*)/);","                if (m && m[1]) {","                    o.phantomjs = numberify(m[1]);","                }","            }","","            // Mobile browser check","            if (/ Mobile\\//.test(ua) || (/iPad|iPod|iPhone/).test(ua)) {","                o.mobile = 'Apple'; // iPhone or iPod Touch","","                m = ua.match(/OS ([^\\s]*)/);","                if (m && m[1]) {","                    m = numberify(m[1].replace('_', '.'));","                }","                o.ios = m;","                o.os = 'ios';","                o.ipad = o.ipod = o.iphone = 0;","","                m = ua.match(/iPad|iPod|iPhone/);","                if (m && m[0]) {","                    o[m[0].toLowerCase()] = o.ios;","                }","            } else {","                m = ua.match(/NokiaN[^\\/]*|webOS\\/\\d\\.\\d/);","                if (m) {","                    // Nokia N-series, webOS, ex: NokiaN95","                    o.mobile = m[0];","                }","                if (/webOS/.test(ua)) {","                    o.mobile = 'WebOS';","                    m = ua.match(/webOS\\/([^\\s]*);/);","                    if (m && m[1]) {","                        o.webos = numberify(m[1]);","                    }","                }","                if (/ Android/.test(ua)) {","                    if (/Mobile/.test(ua)) {","                        o.mobile = 'Android';","                    }","                    m = ua.match(/Android ([^\\s]*);/);","                    if (m && m[1]) {","                        o.android = numberify(m[1]);","                    }","","                }","                if (/Silk/.test(ua)) {","                    m = ua.match(/Silk\\/([^\\s]*)\\)/);","                    if (m && m[1]) {","                        o.silk = numberify(m[1]);","                    }","                    if (!o.android) {","                        o.android = 2.34; //Hack for desktop mode in Kindle","                        o.os = 'Android';","                    }","                    if (/Accelerated=true/.test(ua)) {","                        o.accel = true;","                    }","                }","            }","","            m = ua.match(/(Chrome|CrMo|CriOS)\\/([^\\s]*)/);","            if (m && m[1] && m[2]) {","                o.chrome = numberify(m[2]); // Chrome","                o.safari = 0; //Reset safari back to 0","                if (m[1] === 'CrMo') {","                    o.mobile = 'chrome';","                }","            } else {","                m = ua.match(/AdobeAIR\\/([^\\s]*)/);","                if (m) {","                    o.air = m[0]; // Adobe AIR 1.0 or better","                }","            }","        }","","        if (!o.webkit) { // not webkit","// @todo check Opera/8.01 (J2ME/MIDP; Opera Mini/2.0.4509/1316; fi; U; ssr)","            if (/Opera/.test(ua)) {","                m = ua.match(/Opera[\\s\\/]([^\\s]*)/);","                if (m && m[1]) {","                    o.opera = numberify(m[1]);","                }","                m = ua.match(/Version\\/([^\\s]*)/);","                if (m && m[1]) {","                    o.opera = numberify(m[1]); // opera 10+","                }","","                if (/Opera Mobi/.test(ua)) {","                    o.mobile = 'opera';","                    m = ua.replace('Opera Mobi', '').match(/Opera ([^\\s]*)/);","                    if (m && m[1]) {","                        o.opera = numberify(m[1]);","                    }","                }","                m = ua.match(/Opera Mini[^;]*/);","","                if (m) {","                    o.mobile = m[0]; // ex: Opera Mini/2.0.4509/1316","                }","            } else { // not opera or webkit","                m = ua.match(/MSIE\\s([^;]*)/);","                if (m && m[1]) {","                    o.ie = numberify(m[1]);","                } else { // not opera, webkit, or ie","                    m = ua.match(/Gecko\\/([^\\s]*)/);","                    if (m) {","                        o.gecko = 1; // Gecko detected, look for revision","                        m = ua.match(/rv:([^\\s\\)]*)/);","                        if (m && m[1]) {","                            o.gecko = numberify(m[1]);","                        }","                    }","                }","            }","        }","    }","","    //Check for known properties to tell if touch events are enabled on this device or if","    //the number of MSPointer touchpoints on this device is greater than 0.","    if (win && nav && !(o.chrome && o.chrome < 6)) {","        o.touchEnabled = ((\"ontouchstart\" in win) || ((\"msMaxTouchPoints\" in nav) && (nav.msMaxTouchPoints > 0)));","    }","","    //It was a parsed UA, do not assign the global value.","    if (!subUA) {","","        if (typeof process === 'object') {","","            if (process.versions && process.versions.node) {","                //NodeJS","                o.os = process.platform;","                o.nodejs = numberify(process.versions.node);","            }","        }","","        YUI.Env.UA = o;","","    }","","    return o;","};","","","Y.UA = YUI.Env.UA || YUI.Env.parseUA();","","/**","Performs a simple comparison between two version numbers, accounting for","standard versioning logic such as the fact that \"535.8\" is a lower version than","\"535.24\", even though a simple numerical comparison would indicate that it's","greater. Also accounts for cases such as \"1.1\" vs. \"1.1.0\", which are","considered equivalent.","","Returns -1 if version _a_ is lower than version _b_, 0 if they're equivalent,","1 if _a_ is higher than _b_.","","Versions may be numbers or strings containing numbers and dots. For example,","both `535` and `\"535.8.10\"` are acceptable. A version string containing","non-numeric characters, like `\"535.8.beta\"`, may produce unexpected results.","","@method compareVersions","@param {Number|String} a First version number to compare.","@param {Number|String} b Second version number to compare.","@return -1 if _a_ is lower than _b_, 0 if they're equivalent, 1 if _a_ is","    higher than _b_.","**/","Y.UA.compareVersions = function (a, b) {","    var aPart, aParts, bPart, bParts, i, len;","","    if (a === b) {","        return 0;","    }","","    aParts = (a + '').split('.');","    bParts = (b + '').split('.');","","    for (i = 0, len = Math.max(aParts.length, bParts.length); i < len; ++i) {","        aPart = parseInt(aParts[i], 10);","        bPart = parseInt(bParts[i], 10);","","        isNaN(aPart) && (aPart = 0);","        isNaN(bPart) && (bPart = 0);","","        if (aPart < bPart) {","            return -1;","        }","","        if (aPart > bPart) {","            return 1;","        }","    }","","    return 0;","};","YUI.Env.aliases = {","    \"anim\": [\"anim-base\",\"anim-color\",\"anim-curve\",\"anim-easing\",\"anim-node-plugin\",\"anim-scroll\",\"anim-xy\"],","    \"anim-shape-transform\": [\"anim-shape\"],","    \"app\": [\"app-base\",\"app-content\",\"app-transitions\",\"lazy-model-list\",\"model\",\"model-list\",\"model-sync-rest\",\"router\",\"view\",\"view-node-map\"],","    \"attribute\": [\"attribute-base\",\"attribute-complex\"],","    \"autocomplete\": [\"autocomplete-base\",\"autocomplete-sources\",\"autocomplete-list\",\"autocomplete-plugin\"],","    \"base\": [\"base-base\",\"base-pluginhost\",\"base-build\"],","    \"cache\": [\"cache-base\",\"cache-offline\",\"cache-plugin\"],","    \"collection\": [\"array-extras\",\"arraylist\",\"arraylist-add\",\"arraylist-filter\",\"array-invoke\"],","    \"controller\": [\"router\"],","    \"dataschema\": [\"dataschema-base\",\"dataschema-json\",\"dataschema-xml\",\"dataschema-array\",\"dataschema-text\"],","    \"datasource\": [\"datasource-local\",\"datasource-io\",\"datasource-get\",\"datasource-function\",\"datasource-cache\",\"datasource-jsonschema\",\"datasource-xmlschema\",\"datasource-arrayschema\",\"datasource-textschema\",\"datasource-polling\"],","    \"datatable\": [\"datatable-core\",\"datatable-table\",\"datatable-head\",\"datatable-body\",\"datatable-base\",\"datatable-column-widths\",\"datatable-message\",\"datatable-mutable\",\"datatable-sort\",\"datatable-datasource\"],","    \"datatable-deprecated\": [\"datatable-base-deprecated\",\"datatable-datasource-deprecated\",\"datatable-sort-deprecated\",\"datatable-scroll-deprecated\"],","    \"datatype\": [\"datatype-date\",\"datatype-number\",\"datatype-xml\"],","    \"datatype-date\": [\"datatype-date-parse\",\"datatype-date-format\",\"datatype-date-math\"],","    \"datatype-number\": [\"datatype-number-parse\",\"datatype-number-format\"],","    \"datatype-xml\": [\"datatype-xml-parse\",\"datatype-xml-format\"],","    \"dd\": [\"dd-ddm-base\",\"dd-ddm\",\"dd-ddm-drop\",\"dd-drag\",\"dd-proxy\",\"dd-constrain\",\"dd-drop\",\"dd-scroll\",\"dd-delegate\"],","    \"dom\": [\"dom-base\",\"dom-screen\",\"dom-style\",\"selector-native\",\"selector\"],","    \"editor\": [\"frame\",\"editor-selection\",\"exec-command\",\"editor-base\",\"editor-para\",\"editor-br\",\"editor-bidi\",\"editor-tab\",\"createlink-base\"],","    \"event\": [\"event-base\",\"event-delegate\",\"event-synthetic\",\"event-mousewheel\",\"event-mouseenter\",\"event-key\",\"event-focus\",\"event-resize\",\"event-hover\",\"event-outside\",\"event-touch\",\"event-move\",\"event-flick\",\"event-valuechange\",\"event-tap\"],","    \"event-custom\": [\"event-custom-base\",\"event-custom-complex\"],","    \"event-gestures\": [\"event-flick\",\"event-move\"],","    \"handlebars\": [\"handlebars-compiler\"],","    \"highlight\": [\"highlight-base\",\"highlight-accentfold\"],","    \"history\": [\"history-base\",\"history-hash\",\"history-hash-ie\",\"history-html5\"],","    \"io\": [\"io-base\",\"io-xdr\",\"io-form\",\"io-upload-iframe\",\"io-queue\"],","    \"json\": [\"json-parse\",\"json-stringify\"],","    \"loader\": [\"loader-base\",\"loader-rollup\",\"loader-yui3\"],","    \"node\": [\"node-base\",\"node-event-delegate\",\"node-pluginhost\",\"node-screen\",\"node-style\"],","    \"pluginhost\": [\"pluginhost-base\",\"pluginhost-config\"],","    \"querystring\": [\"querystring-parse\",\"querystring-stringify\"],","    \"recordset\": [\"recordset-base\",\"recordset-sort\",\"recordset-filter\",\"recordset-indexer\"],","    \"resize\": [\"resize-base\",\"resize-proxy\",\"resize-constrain\"],","    \"slider\": [\"slider-base\",\"slider-value-range\",\"clickable-rail\",\"range-slider\"],","    \"text\": [\"text-accentfold\",\"text-wordbreak\"],","    \"widget\": [\"widget-base\",\"widget-htmlparser\",\"widget-skin\",\"widget-uievents\"]","};","","","}, '3.7.3', {\"use\": [\"yui-base\", \"get\", \"features\", \"intl-base\", \"yui-log\", \"yui-log-nodejs\", \"yui-later\", \"loader-base\", \"loader-rollup\", \"loader-yui3\"]});"];
/**
 * The YUI module contains the components required for building the YUI seed
 * file.  This includes the script loading mechanism, a simple queue, and
 * the core utilities for the library.
 * @module yui
 * @main yui
 * @submodule yui-base
 */

_yuitest_coverage["build/yui-nodejs/yui-nodejs.js"].lines = {"10":0,"11":0,"54":0,"55":0,"60":0,"64":0,"65":0,"68":0,"96":0,"97":0,"126":0,"127":0,"131":0,"132":0,"136":0,"141":0,"142":0,"145":0,"148":0,"150":0,"153":0,"155":0,"179":0,"180":0,"181":0,"182":0,"186":0,"188":0,"189":0,"191":0,"192":0,"196":0,"197":0,"198":0,"199":0,"203":0,"208":0,"210":0,"211":0,"212":0,"213":0,"214":0,"216":0,"217":0,"219":0,"220":0,"222":0,"224":0,"228":0,"229":0,"230":0,"239":0,"240":0,"241":0,"243":0,"244":0,"247":0,"248":0,"251":0,"263":0,"265":0,"274":0,"275":0,"276":0,"277":0,"278":0,"279":0,"280":0,"281":0,"282":0,"283":0,"284":0,"285":0,"286":0,"289":0,"294":0,"295":0,"306":0,"315":0,"326":0,"328":0,"329":0,"375":0,"378":0,"379":0,"383":0,"387":0,"388":0,"390":0,"395":0,"399":0,"403":0,"404":0,"405":0,"406":0,"407":0,"408":0,"409":0,"410":0,"416":0,"421":0,"423":0,"425":0,"426":0,"427":0,"429":0,"431":0,"432":0,"433":0,"435":0,"436":0,"437":0,"441":0,"444":0,"445":0,"449":0,"452":0,"465":0,"466":0,"467":0,"468":0,"469":0,"470":0,"472":0,"476":0,"478":0,"480":0,"481":0,"483":0,"484":0,"495":0,"500":0,"501":0,"502":0,"506":0,"507":0,"509":0,"510":0,"526":0,"527":0,"528":0,"531":0,"532":0,"533":0,"534":0,"535":0,"536":0,"537":0,"538":0,"541":0,"544":0,"583":0,"584":0,"596":0,"597":0,"598":0,"600":0,"601":0,"602":0,"603":0,"604":0,"605":0,"606":0,"607":0,"608":0,"615":0,"627":0,"639":0,"640":0,"641":0,"642":0,"643":0,"644":0,"645":0,"646":0,"647":0,"648":0,"649":0,"655":0,"656":0,"658":0,"659":0,"660":0,"661":0,"663":0,"664":0,"665":0,"667":0,"668":0,"669":0,"670":0,"676":0,"677":0,"678":0,"679":0,"680":0,"684":0,"687":0,"688":0,"689":0,"690":0,"698":0,"699":0,"700":0,"701":0,"702":0,"703":0,"706":0,"709":0,"710":0,"711":0,"712":0,"714":0,"715":0,"716":0,"719":0,"720":0,"721":0,"722":0,"723":0,"725":0,"730":0,"731":0,"732":0,"733":0,"734":0,"736":0,"741":0,"742":0,"743":0,"745":0,"746":0,"748":0,"749":0,"754":0,"755":0,"756":0,"757":0,"758":0,"760":0,"771":0,"782":0,"785":0,"787":0,"788":0,"791":0,"792":0,"793":0,"794":0,"795":0,"796":0,"851":0,"861":0,"862":0,"863":0,"864":0,"867":0,"869":0,"870":0,"873":0,"874":0,"875":0,"876":0,"877":0,"881":0,"882":0,"884":0,"885":0,"889":0,"890":0,"891":0,"893":0,"894":0,"898":0,"909":0,"910":0,"911":0,"912":0,"913":0,"914":0,"916":0,"917":0,"919":0,"920":0,"922":0,"940":0,"941":0,"944":0,"963":0,"965":0,"966":0,"969":0,"970":0,"971":0,"972":0,"973":0,"975":0,"978":0,"981":0,"983":0,"984":0,"985":0,"986":0,"990":0,"991":0,"994":0,"995":0,"996":0,"998":0,"999":0,"1000":0,"1001":0,"1005":0,"1006":0,"1008":0,"1013":0,"1014":0,"1018":0,"1019":0,"1026":0,"1034":0,"1036":0,"1037":0,"1038":0,"1039":0,"1040":0,"1041":0,"1042":0,"1043":0,"1045":0,"1050":0,"1051":0,"1052":0,"1053":0,"1054":0,"1058":0,"1059":0,"1061":0,"1062":0,"1066":0,"1067":0,"1074":0,"1075":0,"1076":0,"1077":0,"1078":0,"1081":0,"1082":0,"1083":0,"1085":0,"1088":0,"1089":0,"1095":0,"1096":0,"1097":0,"1098":0,"1099":0,"1100":0,"1101":0,"1102":0,"1105":0,"1107":0,"1110":0,"1111":0,"1112":0,"1117":0,"1118":0,"1119":0,"1120":0,"1121":0,"1122":0,"1123":0,"1124":0,"1125":0,"1127":0,"1129":0,"1131":0,"1132":0,"1133":0,"1134":0,"1135":0,"1136":0,"1137":0,"1141":0,"1142":0,"1144":0,"1145":0,"1151":0,"1152":0,"1153":0,"1157":0,"1195":0,"1197":0,"1198":0,"1199":0,"1200":0,"1201":0,"1202":0,"1203":0,"1204":0,"1207":0,"1208":0,"1211":0,"1218":0,"1236":0,"1238":0,"1239":0,"1242":0,"1243":0,"1245":0,"1248":0,"1258":0,"1259":0,"1273":0,"1274":0,"1275":0,"1280":0,"1281":0,"1283":0,"1286":0,"1287":0,"1288":0,"1289":0,"1290":0,"1292":0,"1296":0,"1305":0,"1306":0,"1307":0,"1309":0,"1310":0,"1311":0,"1325":0,"1328":0,"1329":0,"1330":0,"1366":0,"1367":0,"1368":0,"1371":0,"1372":0,"1375":0,"1377":0,"1381":0,"1383":0,"1387":0,"1389":0,"1392":0,"1393":0,"1397":0,"1398":0,"1950":0,"1972":0,"2020":0,"2021":0,"2038":0,"2039":0,"2049":0,"2050":0,"2060":0,"2061":0,"2088":0,"2089":0,"2099":0,"2100":0,"2110":0,"2111":0,"2125":0,"2126":0,"2127":0,"2138":0,"2139":0,"2149":0,"2150":0,"2162":0,"2163":0,"2165":0,"2167":0,"2171":0,"2174":0,"2186":0,"2187":0,"2201":0,"2202":0,"2203":0,"2215":0,"2216":0,"2218":0,"2219":0,"2221":0,"2232":0,"2233":0,"2235":0,"2245":0,"2246":0,"2248":0,"2278":0,"2279":0,"2286":0,"2319":0,"2320":0,"2322":0,"2324":0,"2326":0,"2327":0,"2329":0,"2331":0,"2332":0,"2335":0,"2339":0,"2342":0,"2358":0,"2359":0,"2363":0,"2364":0,"2366":0,"2367":0,"2368":0,"2372":0,"2390":0,"2391":0,"2392":0,"2394":0,"2395":0,"2396":0,"2400":0,"2427":0,"2428":0,"2432":0,"2433":0,"2434":0,"2438":0,"2455":0,"2456":0,"2459":0,"2461":0,"2462":0,"2464":0,"2465":0,"2467":0,"2468":0,"2472":0,"2473":0,"2474":0,"2478":0,"2500":0,"2501":0,"2520":0,"2521":0,"2523":0,"2524":0,"2525":0,"2529":0,"2550":0,"2551":0,"2553":0,"2554":0,"2555":0,"2556":0,"2560":0,"2561":0,"2566":0,"2584":0,"2585":0,"2586":0,"2589":0,"2604":0,"2614":0,"2624":0,"2635":0,"2637":0,"2647":0,"2651":0,"2653":0,"2664":0,"2693":0,"2694":0,"2696":0,"2697":0,"2701":0,"2702":0,"2705":0,"2725":0,"2729":0,"2735":0,"2750":0,"2751":0,"2757":0,"2758":0,"2760":0,"2761":0,"2762":0,"2767":0,"2804":0,"2805":0,"2810":0,"2811":0,"2814":0,"2818":0,"2819":0,"2825":0,"2826":0,"2831":0,"2832":0,"2835":0,"2836":0,"2841":0,"2843":0,"2844":0,"2845":0,"2852":0,"2853":0,"2859":0,"2861":0,"2871":0,"2872":0,"2876":0,"2880":0,"2886":0,"2887":0,"2893":0,"2895":0,"2897":0,"2898":0,"2899":0,"2906":0,"2907":0,"2911":0,"2927":0,"2949":0,"2952":0,"2955":0,"2956":0,"2957":0,"3019":0,"3031":0,"3054":0,"3055":0,"3056":0,"3059":0,"3062":0,"3063":0,"3064":0,"3065":0,"3069":0,"3070":0,"3071":0,"3076":0,"3077":0,"3078":0,"3080":0,"3081":0,"3086":0,"3106":0,"3107":0,"3112":0,"3113":0,"3116":0,"3127":0,"3128":0,"3129":0,"3131":0,"3145":0,"3146":0,"3169":0,"3170":0,"3172":0,"3173":0,"3174":0,"3178":0,"3201":0,"3202":0,"3204":0,"3205":0,"3206":0,"3207":0,"3212":0,"3228":0,"3229":0,"3230":0,"3233":0,"3237":0,"3238":0,"3241":0,"3258":0,"3259":0,"3264":0,"3265":0,"3266":0,"3269":0,"3270":0,"3272":0,"3276":0,"3288":0,"3289":0,"3324":0,"3326":0,"3327":0,"3328":0,"3329":0,"3563":0,"3566":0,"3568":0,"3570":0,"3571":0,"3572":0,"3573":0,"3574":0,"3575":0,"3576":0,"3577":0,"3578":0,"3579":0,"3580":0,"3581":0,"3585":0,"3586":0,"3588":0,"3589":0,"3591":0,"3592":0,"3595":0,"3596":0,"3597":0,"3598":0,"3600":0,"3601":0,"3602":0,"3603":0,"3608":0,"3609":0,"3611":0,"3612":0,"3613":0,"3615":0,"3616":0,"3617":0,"3619":0,"3620":0,"3621":0,"3624":0,"3625":0,"3627":0,"3629":0,"3630":0,"3631":0,"3632":0,"3633":0,"3636":0,"3637":0,"3638":0,"3640":0,"3641":0,"3642":0,"3646":0,"3647":0,"3648":0,"3649":0,"3651":0,"3652":0,"3653":0,"3655":0,"3656":0,"3661":0,"3662":0,"3663":0,"3664":0,"3665":0,"3666":0,"3669":0,"3670":0,"3671":0,"3676":0,"3678":0,"3679":0,"3680":0,"3681":0,"3683":0,"3684":0,"3685":0,"3688":0,"3689":0,"3690":0,"3691":0,"3692":0,"3695":0,"3697":0,"3698":0,"3701":0,"3702":0,"3703":0,"3705":0,"3706":0,"3707":0,"3708":0,"3709":0,"3710":0,"3720":0,"3721":0,"3725":0,"3727":0,"3729":0,"3731":0,"3732":0,"3736":0,"3740":0,"3744":0,"3766":0,"3767":0,"3769":0,"3770":0,"3773":0,"3774":0,"3776":0,"3777":0,"3778":0,"3780":0,"3781":0,"3783":0,"3784":0,"3787":0,"3788":0,"3792":0,"3794":0};
_yuitest_coverage["build/yui-nodejs/yui-nodejs.js"].functions = {"instanceOf:59":0,"YUI:54":0,"add:178":0,"remove:185":0,"handleLoad:195":0,"getLoader:202":0,"clobber:227":0,"applyConfig:261":0,"_config:305":0,"parseBasePath:374":0,"(anonymous 2):398":0,"_init:314":0,"_setup:494":0,"applyTo:525":0,"add:582":0,"_attach:626":0,"(anonymous 5):794":0,"(anonymous 4):793":0,"(anonymous 3):791":0,"_delayCallback:780":0,"(anonymous 6):893":0,"use:850":0,"_notify:908":0,"process:961":0,"(anonymous 7):1052":0,"handleLoader:1025":0,"handleBoot:1131":0,"_use:938":0,"namespace:1194":0,"dump:1218":0,"error:1233":0,"guid:1257":0,"stamp:1272":0,"destroy:1304":0,"applyConfig:1366":0,"(anonymous 1):153":0,"_isNative:2020":0,"isArray:2038":0,"isBoolean:2049":0,"isDate:2060":0,"isFunction:2088":0,"isNull:2099":0,"isNumber:2110":0,"isObject:2125":0,"isString:2138":0,"isUndefined:2149":0,"isValue:2162":0,"(anonymous 9):2186":0,"(anonymous 10):2202":0,"sub:2201":0,"(anonymous 11):2215":0,"}:2217":0,"(anonymous 12):2232":0,"}:2234":0,"(anonymous 13):2245":0,"}:2247":0,"type:2278":0,"YArray:2319":0,"dedupe:2358":0,"(anonymous 14):2390":0,"}:2393":0,"hash:2427":0,"(anonymous 15):2455":0,"}:2457":0,"numericSort:2500":0,"(anonymous 16):2520":0,"}:2522":0,"test:2550":0,"Queue:2584":0,"_init:2596":0,"next:2613":0,"last:2623":0,"add:2634":0,"size:2646":0,"(anonymous 17):2696":0,"cached:2693":0,"getLocation:2725":0,"merge:2750":0,"mix:2804":0,"(anonymous 18):2943":0,"F:2952":0,"(anonymous 20):2955":0,"(anonymous 19):2950":0,"owns:3018":0,"keys:3054":0,"values:3106":0,"size:3127":0,"hasValue:3145":0,"each:3169":0,"some:3201":0,"getValue:3228":0,"setValue:3258":0,"isEmpty:3288":0,"(anonymous 22):3328":0,"numberify:3326":0,"parseUA:3324":0,"compareVersions:3766":0,"(anonymous 8):1950":0};
_yuitest_coverage["build/yui-nodejs/yui-nodejs.js"].coveredLines = 824;
_yuitest_coverage["build/yui-nodejs/yui-nodejs.js"].coveredFunctions = 98;
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 10);
if (typeof YUI != 'undefined') {
    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 11);
YUI._YUI = YUI;
}

/**
The YUI global namespace object.  If YUI is already defined, the
existing YUI object will not be overwritten so that defined
namespaces are preserved.  It is the constructor for the object
the end user interacts with.  As indicated below, each instance
has full custom event support, but only if the event system
is available.  This is a self-instantiable factory function.  You
can invoke it directly like this:

     YUI().use('*', function(Y) {
         // ready
     });

But it also works like this:

     var Y = YUI();

Configuring the YUI object:

    YUI({
        debug: true,
        combine: false
    }).use('node', function(Y) {
        //Node is ready to use
    });

See the API docs for the <a href="config.html">Config</a> class
for the complete list of supported configuration properties accepted
by the YUI constuctor.

@class YUI
@constructor
@global
@uses EventTarget
@param [o]* {Object} 0..n optional configuration objects.  these values
are store in Y.config.  See <a href="config.html">Config</a> for the list of supported
properties.
*/
    /*global YUI*/
    /*global YUI_config*/
    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 54);
var YUI = function() {
        _yuitest_coverfunc("build/yui-nodejs/yui-nodejs.js", "YUI", 54);
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 55);
var i = 0,
            Y = this,
            args = arguments,
            l = args.length,
            instanceOf = function(o, type) {
                _yuitest_coverfunc("build/yui-nodejs/yui-nodejs.js", "instanceOf", 59);
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 60);
return (o && o.hasOwnProperty && (o instanceof type));
            },
            gconf = (typeof YUI_config !== 'undefined') && YUI_config;

        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 64);
if (!(instanceOf(Y, YUI))) {
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 65);
Y = new YUI();
        } else {
            // set up the core environment
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 68);
Y._init();

            /**
                YUI.GlobalConfig is a master configuration that might span
                multiple contexts in a non-browser environment.  It is applied
                first to all instances in all contexts.
                @property GlobalConfig
                @type {Object}
                @global
                @static
                @example


                    YUI.GlobalConfig = {
                        filter: 'debug'
                    };

                    YUI().use('node', function(Y) {
                        //debug files used here
                    });

                    YUI({
                        filter: 'min'
                    }).use('node', function(Y) {
                        //min files used here
                    });

            */
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 96);
if (YUI.GlobalConfig) {
                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 97);
Y.applyConfig(YUI.GlobalConfig);
            }

            /**
                YUI_config is a page-level config.  It is applied to all
                instances created on the page.  This is applied after
                YUI.GlobalConfig, and before the instance level configuration
                objects.
                @global
                @property YUI_config
                @type {Object}
                @example


                    //Single global var to include before YUI seed file
                    YUI_config = {
                        filter: 'debug'
                    };

                    YUI().use('node', function(Y) {
                        //debug files used here
                    });

                    YUI({
                        filter: 'min'
                    }).use('node', function(Y) {
                        //min files used here
                    });
            */
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 126);
if (gconf) {
                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 127);
Y.applyConfig(gconf);
            }

            // bind the specified additional modules for this instance
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 131);
if (!l) {
                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 132);
Y._setup();
            }
        }

        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 136);
if (l) {
            // Each instance can accept one or more configuration objects.
            // These are applied after YUI.GlobalConfig and YUI_Config,
            // overriding values set in those config files if there is a '
            // matching property.
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 141);
for (; i < l; i++) {
                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 142);
Y.applyConfig(args[i]);
            }

            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 145);
Y._setup();
        }

        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 148);
Y.instanceOf = instanceOf;

        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 150);
return Y;
    };

_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 153);
(function() {

    _yuitest_coverfunc("build/yui-nodejs/yui-nodejs.js", "(anonymous 1)", 153);
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 155);
var proto, prop,
        VERSION = '3.7.3',
        PERIOD = '.',
        BASE = 'http://yui.yahooapis.com/',
        /*
            These CSS class names can't be generated by
            getClassName since it is not available at the
            time they are being used.
        */
        DOC_LABEL = 'yui3-js-enabled',
        CSS_STAMP_EL = 'yui3-css-stamp',
        NOOP = function() {},
        SLICE = Array.prototype.slice,
        APPLY_TO_AUTH = { 'io.xdrReady': 1,   // the functions applyTo
                          'io.xdrResponse': 1,   // can call. this should
                          'SWF.eventHandler': 1 }, // be done at build time
        hasWin = (typeof window != 'undefined'),
        win = (hasWin) ? window : null,
        doc = (hasWin) ? win.document : null,
        docEl = doc && doc.documentElement,
        docClass = docEl && docEl.className,
        instances = {},
        time = new Date().getTime(),
        add = function(el, type, fn, capture) {
            _yuitest_coverfunc("build/yui-nodejs/yui-nodejs.js", "add", 178);
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 179);
if (el && el.addEventListener) {
                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 180);
el.addEventListener(type, fn, capture);
            } else {_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 181);
if (el && el.attachEvent) {
                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 182);
el.attachEvent('on' + type, fn);
            }}
        },
        remove = function(el, type, fn, capture) {
            _yuitest_coverfunc("build/yui-nodejs/yui-nodejs.js", "remove", 185);
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 186);
if (el && el.removeEventListener) {
                // this can throw an uncaught exception in FF
                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 188);
try {
                    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 189);
el.removeEventListener(type, fn, capture);
                } catch (ex) {}
            } else {_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 191);
if (el && el.detachEvent) {
                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 192);
el.detachEvent('on' + type, fn);
            }}
        },
        handleLoad = function() {
            _yuitest_coverfunc("build/yui-nodejs/yui-nodejs.js", "handleLoad", 195);
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 196);
YUI.Env.windowLoaded = true;
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 197);
YUI.Env.DOMReady = true;
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 198);
if (hasWin) {
                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 199);
remove(window, 'load', handleLoad);
            }
        },
        getLoader = function(Y, o) {
            _yuitest_coverfunc("build/yui-nodejs/yui-nodejs.js", "getLoader", 202);
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 203);
var loader = Y.Env._loader,
                lCore = [ 'loader-base' ],
                G_ENV = YUI.Env,
                mods = G_ENV.mods;

            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 208);
if (loader) {
                //loader._config(Y.config);
                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 210);
loader.ignoreRegistered = false;
                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 211);
loader.onEnd = null;
                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 212);
loader.data = null;
                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 213);
loader.required = [];
                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 214);
loader.loadType = null;
            } else {
                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 216);
loader = new Y.Loader(Y.config);
                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 217);
Y.Env._loader = loader;
            }
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 219);
if (mods && mods.loader) {
                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 220);
lCore = [].concat(lCore, YUI.Env.loaderExtras);
            }
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 222);
YUI.Env.core = Y.Array.dedupe([].concat(YUI.Env.core, lCore));

            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 224);
return loader;
        },

        clobber = function(r, s) {
            _yuitest_coverfunc("build/yui-nodejs/yui-nodejs.js", "clobber", 227);
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 228);
for (var i in s) {
                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 229);
if (s.hasOwnProperty(i)) {
                    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 230);
r[i] = s[i];
                }
            }
        },

        ALREADY_DONE = { success: true };

//  Stamp the documentElement (HTML) with a class of "yui-loaded" to
//  enable styles that need to key off of JS being enabled.
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 239);
if (docEl && docClass.indexOf(DOC_LABEL) == -1) {
    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 240);
if (docClass) {
        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 241);
docClass += ' ';
    }
    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 243);
docClass += DOC_LABEL;
    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 244);
docEl.className = docClass;
}

_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 247);
if (VERSION.indexOf('@') > -1) {
    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 248);
VERSION = '3.5.0'; // dev time hack for cdn test
}

_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 251);
proto = {
    /**
     * Applies a new configuration object to the YUI instance config.
     * This will merge new group/module definitions, and will also
     * update the loader cache if necessary.  Updating Y.config directly
     * will not update the cache.
     * @method applyConfig
     * @param {Object} o the configuration object.
     * @since 3.2.0
     */
    applyConfig: function(o) {

        _yuitest_coverfunc("build/yui-nodejs/yui-nodejs.js", "applyConfig", 261);
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 263);
o = o || NOOP;

        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 265);
var attr,
            name,
            // detail,
            config = this.config,
            mods = config.modules,
            groups = config.groups,
            aliases = config.aliases,
            loader = this.Env._loader;

        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 274);
for (name in o) {
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 275);
if (o.hasOwnProperty(name)) {
                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 276);
attr = o[name];
                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 277);
if (mods && name == 'modules') {
                    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 278);
clobber(mods, attr);
                } else {_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 279);
if (aliases && name == 'aliases') {
                    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 280);
clobber(aliases, attr);
                } else {_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 281);
if (groups && name == 'groups') {
                    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 282);
clobber(groups, attr);
                } else {_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 283);
if (name == 'win') {
                    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 284);
config[name] = (attr && attr.contentWindow) || attr;
                    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 285);
config.doc = config[name] ? config[name].document : null;
                } else {_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 286);
if (name == '_yuid') {
                    // preserve the guid
                } else {
                    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 289);
config[name] = attr;
                }}}}}
            }
        }

        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 294);
if (loader) {
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 295);
loader._config(o);
        }

    },
    /**
    * Old way to apply a config to the instance (calls `applyConfig` under the hood)
    * @private
    * @method _config
    * @param {Object} o The config to apply
    */
    _config: function(o) {
        _yuitest_coverfunc("build/yui-nodejs/yui-nodejs.js", "_config", 305);
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 306);
this.applyConfig(o);
    },

    /**
     * Initialize this YUI instance
     * @private
     * @method _init
     */
    _init: function() {
        _yuitest_coverfunc("build/yui-nodejs/yui-nodejs.js", "_init", 314);
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 315);
var filter, el,
            Y = this,
            G_ENV = YUI.Env,
            Env = Y.Env,
            prop;

        /**
         * The version number of the YUI instance.
         * @property version
         * @type string
         */
        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 326);
Y.version = VERSION;

        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 328);
if (!Env) {
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 329);
Y.Env = {
                core: ['get', 'features', 'intl-base', 'yui-log', 'yui-log-nodejs', 'yui-later', 'loader-base', 'loader-rollup', 'loader-yui3'],
                loaderExtras: ['loader-rollup', 'loader-yui3'],
                mods: {}, // flat module map
                versions: {}, // version module map
                base: BASE,
                cdn: BASE + VERSION + '/build/',
                // bootstrapped: false,
                _idx: 0,
                _used: {},
                _attached: {},
                _missed: [],
                _yidx: 0,
                _uidx: 0,
                _guidp: 'y',
                _loaded: {},
                // serviced: {},
                // Regex in English:
                // I'll start at the \b(simpleyui).
                // 1. Look in the test string for "simpleyui" or "yui" or
                //    "yui-base" or "yui-davglass" or "yui-foobar" that comes after a word break.  That is, it
                //    can't match "foyui" or "i_heart_simpleyui". This can be anywhere in the string.
                // 2. After #1 must come a forward slash followed by the string matched in #1, so
                //    "yui-base/yui-base" or "simpleyui/simpleyui" or "yui-pants/yui-pants".
                // 3. The second occurence of the #1 token can optionally be followed by "-debug" or "-min",
                //    so "yui/yui-min", "yui/yui-debug", "yui-base/yui-base-debug". NOT "yui/yui-tshirt".
                // 4. This is followed by ".js", so "yui/yui.js", "simpleyui/simpleyui-min.js"
                // 0. Going back to the beginning, now. If all that stuff in 1-4 comes after a "?" in the string,
                //    then capture the junk between the LAST "&" and the string in 1-4.  So
                //    "blah?foo/yui/yui.js" will capture "foo/" and "blah?some/thing.js&3.3.0/build/yui-davglass/yui-davglass.js"
                //    will capture "3.3.0/build/"
                //
                // Regex Exploded:
                // (?:\?             Find a ?
                //   (?:[^&]*&)      followed by 0..n characters followed by an &
                //   *               in fact, find as many sets of characters followed by a & as you can
                //   ([^&]*)         capture the stuff after the last & in \1
                // )?                but it's ok if all this ?junk&more_junk stuff isn't even there
                // \b(simpleyui|     after a word break find either the string "simpleyui" or
                //    yui(?:-\w+)?   the string "yui" optionally followed by a -, then more characters
                // )                 and store the simpleyui or yui-* string in \2
                // \/\2              then comes a / followed by the simpleyui or yui-* string in \2
                // (?:-(min|debug))? optionally followed by "-min" or "-debug"
                // .js               and ending in ".js"
                _BASE_RE: /(?:\?(?:[^&]*&)*([^&]*))?\b(simpleyui|yui(?:-\w+)?)\/\2(?:-(min|debug))?\.js/,
                parseBasePath: function(src, pattern) {
                    _yuitest_coverfunc("build/yui-nodejs/yui-nodejs.js", "parseBasePath", 374);
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 375);
var match = src.match(pattern),
                        path, filter;

                    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 378);
if (match) {
                        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 379);
path = RegExp.leftContext || src.slice(0, src.indexOf(match[0]));

                        // this is to set up the path to the loader.  The file
                        // filter for loader should match the yui include.
                        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 383);
filter = match[3];

                        // extract correct path for mixed combo urls
                        // http://yuilibrary.com/projects/yui3/ticket/2528423
                        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 387);
if (match[1]) {
                            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 388);
path += '?' + match[1];
                        }
                        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 390);
path = {
                            filter: filter,
                            path: path
                        };
                    }
                    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 395);
return path;
                },
                getBase: G_ENV && G_ENV.getBase ||
                        function(pattern) {
                            _yuitest_coverfunc("build/yui-nodejs/yui-nodejs.js", "(anonymous 2)", 398);
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 399);
var nodes = (doc && doc.getElementsByTagName('script')) || [],
                                path = Env.cdn, parsed,
                                i, len, src;

                            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 403);
for (i = 0, len = nodes.length; i < len; ++i) {
                                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 404);
src = nodes[i].src;
                                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 405);
if (src) {
                                    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 406);
parsed = Y.Env.parseBasePath(src, pattern);
                                    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 407);
if (parsed) {
                                        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 408);
filter = parsed.filter;
                                        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 409);
path = parsed.path;
                                        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 410);
break;
                                    }
                                }
                            }

                            // use CDN default
                            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 416);
return path;
                        }

            };

            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 421);
Env = Y.Env;

            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 423);
Env._loaded[VERSION] = {};

            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 425);
if (G_ENV && Y !== YUI) {
                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 426);
Env._yidx = ++G_ENV._yidx;
                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 427);
Env._guidp = ('yui_' + VERSION + '_' +
                             Env._yidx + '_' + time).replace(/\./g, '_').replace(/-/g, '_');
            } else {_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 429);
if (YUI._YUI) {

                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 431);
G_ENV = YUI._YUI.Env;
                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 432);
Env._yidx += G_ENV._yidx;
                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 433);
Env._uidx += G_ENV._uidx;

                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 435);
for (prop in G_ENV) {
                    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 436);
if (!(prop in Env)) {
                        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 437);
Env[prop] = G_ENV[prop];
                    }
                }

                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 441);
delete YUI._YUI;
            }}

            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 444);
Y.id = Y.stamp(Y);
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 445);
instances[Y.id] = Y;

        }

        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 449);
Y.constructor = YUI;

        // configuration defaults
        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 452);
Y.config = Y.config || {
            bootstrap: true,
            cacheUse: true,
            debug: true,
            doc: doc,
            fetchCSS: true,
            throwFail: true,
            useBrowserConsole: true,
            useNativeES5: true,
            win: win
        };

        //Register the CSS stamp element
        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 465);
if (doc && !doc.getElementById(CSS_STAMP_EL)) {
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 466);
el = doc.createElement('div');
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 467);
el.innerHTML = '<div id="' + CSS_STAMP_EL + '" style="position: absolute !important; visibility: hidden !important"></div>';
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 468);
YUI.Env.cssStampEl = el.firstChild;
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 469);
if (doc.body) {
                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 470);
doc.body.appendChild(YUI.Env.cssStampEl);
            } else {
                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 472);
docEl.insertBefore(YUI.Env.cssStampEl, docEl.firstChild);
            }
        }

        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 476);
Y.config.lang = Y.config.lang || 'en-US';

        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 478);
Y.config.base = YUI.config.base || Y.Env.getBase(Y.Env._BASE_RE);

        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 480);
if (!filter || (!('mindebug').indexOf(filter))) {
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 481);
filter = 'min';
        }
        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 483);
filter = (filter) ? '-' + filter : filter;
        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 484);
Y.config.loaderPath = YUI.config.loaderPath || 'loader/loader' + filter + '.js';

    },

    /**
     * Finishes the instance setup. Attaches whatever modules were defined
     * when the yui modules was registered.
     * @method _setup
     * @private
     */
    _setup: function(o) {
        _yuitest_coverfunc("build/yui-nodejs/yui-nodejs.js", "_setup", 494);
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 495);
var i, Y = this,
            core = [],
            mods = YUI.Env.mods,
            extras = Y.config.core || [].concat(YUI.Env.core); //Clone it..

        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 500);
for (i = 0; i < extras.length; i++) {
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 501);
if (mods[extras[i]]) {
                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 502);
core.push(extras[i]);
            }
        }

        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 506);
Y._attach(['yui-base']);
        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 507);
Y._attach(core);

        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 509);
if (Y.Loader) {
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 510);
getLoader(Y);
        }

    },

    /**
     * Executes a method on a YUI instance with
     * the specified id if the specified method is whitelisted.
     * @method applyTo
     * @param id {String} the YUI instance id.
     * @param method {String} the name of the method to exectute.
     * Ex: 'Object.keys'.
     * @param args {Array} the arguments to apply to the method.
     * @return {Object} the return value from the applied method or null.
     */
    applyTo: function(id, method, args) {
        _yuitest_coverfunc("build/yui-nodejs/yui-nodejs.js", "applyTo", 525);
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 526);
if (!(method in APPLY_TO_AUTH)) {
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 527);
this.log(method + ': applyTo not allowed', 'warn', 'yui');
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 528);
return null;
        }

        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 531);
var instance = instances[id], nest, m, i;
        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 532);
if (instance) {
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 533);
nest = method.split('.');
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 534);
m = instance;
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 535);
for (i = 0; i < nest.length; i = i + 1) {
                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 536);
m = m[nest[i]];
                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 537);
if (!m) {
                    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 538);
this.log('applyTo not found: ' + method, 'warn', 'yui');
                }
            }
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 541);
return m && m.apply(instance, args);
        }

        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 544);
return null;
    },

/**
Registers a module with the YUI global.  The easiest way to create a
first-class YUI module is to use the YUI component 
build tool <a href="http://yui.github.com/shifter/">Shifter</a>.

The build system will produce the `YUI.add` wrapper for your module, along
with any configuration info required for the module.

@method add
@param name {String} module name.
@param fn {Function} entry point into the module that is used to bind module to the YUI instance.
@param {YUI} fn.Y The YUI instance this module is executed in.
@param {String} fn.name The name of the module
@param version {String} version string.
@param details {Object} optional config data:
@param details.requires {Array} features that must be present before this module can be attached.
@param details.optional {Array} optional features that should be present if loadOptional
 is defined.  Note: modules are not often loaded this way in YUI 3,
 but this field is still useful to inform the user that certain
 features in the component will require additional dependencies.
@param details.use {Array} features that are included within this module which need to
 be attached automatically when this module is attached.  This
 supports the YUI 3 rollup system -- a module with submodules
 defined will need to have the submodules listed in the 'use'
 config.  The YUI component build tool does this for you.
@return {YUI} the YUI instance.
@example

    YUI.add('davglass', function(Y, name) {
        Y.davglass = function() {
            alert('Dav was here!');
        };
    }, '3.4.0', { requires: ['yui-base', 'harley-davidson', 'mt-dew'] });

*/
    add: function(name, fn, version, details) {
        _yuitest_coverfunc("build/yui-nodejs/yui-nodejs.js", "add", 582);
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 583);
details = details || {};
        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 584);
var env = YUI.Env,
            mod = {
                name: name,
                fn: fn,
                version: version,
                details: details
            },
            //Instance hash so we don't apply it to the same instance twice
            applied = {},
            loader, inst,
            i, versions = env.versions;

        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 596);
env.mods[name] = mod;
        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 597);
versions[version] = versions[version] || {};
        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 598);
versions[version][name] = mod;

        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 600);
for (i in instances) {
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 601);
if (instances.hasOwnProperty(i)) {
                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 602);
inst = instances[i];
                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 603);
if (!applied[inst.id]) {
                    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 604);
applied[inst.id] = true;
                    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 605);
loader = inst.Env._loader;
                    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 606);
if (loader) {
                        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 607);
if (!loader.moduleInfo[name] || loader.moduleInfo[name].temp) {
                            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 608);
loader.addModule(details, name);
                        }
                    }
                }
            }
        }

        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 615);
return this;
    },

    /**
     * Executes the function associated with each required
     * module, binding the module to the YUI instance.
     * @param {Array} r The array of modules to attach
     * @param {Boolean} [moot=false] Don't throw a warning if the module is not attached
     * @method _attach
     * @private
     */
    _attach: function(r, moot) {
        _yuitest_coverfunc("build/yui-nodejs/yui-nodejs.js", "_attach", 626);
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 627);
var i, name, mod, details, req, use, after,
            mods = YUI.Env.mods,
            aliases = YUI.Env.aliases,
            Y = this, j,
            cache = YUI.Env._renderedMods,
            loader = Y.Env._loader,
            done = Y.Env._attached,
            len = r.length, loader, def, go,
            c = [];

        //Check for conditional modules (in a second+ instance) and add their requirements
        //TODO I hate this entire method, it needs to be fixed ASAP (3.5.0) ^davglass
        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 639);
for (i = 0; i < len; i++) {
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 640);
name = r[i];
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 641);
mod = mods[name];
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 642);
c.push(name);
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 643);
if (loader && loader.conditions[name]) {
                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 644);
for (j in loader.conditions[name]) {
                    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 645);
if (loader.conditions[name].hasOwnProperty(j)) {
                        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 646);
def = loader.conditions[name][j];
                        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 647);
go = def && ((def.ua && Y.UA[def.ua]) || (def.test && def.test(Y)));
                        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 648);
if (go) {
                            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 649);
c.push(def.name);
                        }
                    }
                }
            }
        }
        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 655);
r = c;
        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 656);
len = r.length;

        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 658);
for (i = 0; i < len; i++) {
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 659);
if (!done[r[i]]) {
                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 660);
name = r[i];
                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 661);
mod = mods[name];

                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 663);
if (aliases && aliases[name] && !mod) {
                    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 664);
Y._attach(aliases[name]);
                    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 665);
continue;
                }
                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 667);
if (!mod) {
                    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 668);
if (loader && loader.moduleInfo[name]) {
                        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 669);
mod = loader.moduleInfo[name];
                        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 670);
moot = true;
                    }


                    //if (!loader || !loader.moduleInfo[name]) {
                    //if ((!loader || !loader.moduleInfo[name]) && !moot) {
                    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 676);
if (!moot && name) {
                        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 677);
if ((name.indexOf('skin-') === -1) && (name.indexOf('css') === -1)) {
                            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 678);
Y.Env._missed.push(name);
                            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 679);
Y.Env._missed = Y.Array.dedupe(Y.Env._missed);
                            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 680);
Y.message('NOT loaded: ' + name, 'warn', 'yui');
                        }
                    }
                } else {
                    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 684);
done[name] = true;
                    //Don't like this, but in case a mod was asked for once, then we fetch it
                    //We need to remove it from the missed list ^davglass
                    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 687);
for (j = 0; j < Y.Env._missed.length; j++) {
                        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 688);
if (Y.Env._missed[j] === name) {
                            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 689);
Y.message('Found: ' + name + ' (was reported as missing earlier)', 'warn', 'yui');
                            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 690);
Y.Env._missed.splice(j, 1);
                        }
                    }
                    /*
                        If it's a temp module, we need to redo it's requirements if it's already loaded
                        since it may have been loaded by another instance and it's dependencies might
                        have been redefined inside the fetched file.
                    */
                    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 698);
if (loader && cache && cache[name] && cache[name].temp) {
                        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 699);
loader.getRequires(cache[name]);
                        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 700);
req = [];
                        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 701);
for (j in loader.moduleInfo[name].expanded_map) {
                            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 702);
if (loader.moduleInfo[name].expanded_map.hasOwnProperty(j)) {
                                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 703);
req.push(j);
                            }
                        }
                        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 706);
Y._attach(req);
                    }
                    
                    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 709);
details = mod.details;
                    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 710);
req = details.requires;
                    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 711);
use = details.use;
                    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 712);
after = details.after;
                    //Force Intl load if there is a language (Loader logic) @todo fix this shit
                    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 714);
if (details.lang) {
                        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 715);
req = req || [];
                        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 716);
req.unshift('intl');
                    }

                    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 719);
if (req) {
                        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 720);
for (j = 0; j < req.length; j++) {
                            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 721);
if (!done[req[j]]) {
                                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 722);
if (!Y._attach(req)) {
                                    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 723);
return false;
                                }
                                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 725);
break;
                            }
                        }
                    }

                    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 730);
if (after) {
                        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 731);
for (j = 0; j < after.length; j++) {
                            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 732);
if (!done[after[j]]) {
                                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 733);
if (!Y._attach(after, true)) {
                                    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 734);
return false;
                                }
                                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 736);
break;
                            }
                        }
                    }

                    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 741);
if (mod.fn) {
                            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 742);
if (Y.config.throwFail) {
                                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 743);
mod.fn(Y, name);
                            } else {
                                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 745);
try {
                                    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 746);
mod.fn(Y, name);
                                } catch (e) {
                                    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 748);
Y.error('Attach error: ' + name, e, name);
                                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 749);
return false;
                            }
                        }
                    }

                    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 754);
if (use) {
                        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 755);
for (j = 0; j < use.length; j++) {
                            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 756);
if (!done[use[j]]) {
                                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 757);
if (!Y._attach(use)) {
                                    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 758);
return false;
                                }
                                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 760);
break;
                            }
                        }
                    }



                }
            }
        }

        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 771);
return true;
    },
    /**
    * Delays the `use` callback until another event has taken place. Like: window.onload, domready, contentready, available.
    * @private
    * @method _delayCallback
    * @param {Callback} cb The original `use` callback
    * @param {String|Object} until Either an event (load, domready) or an Object containing event/args keys for contentready/available
    */
    _delayCallback: function(cb, until) {

        _yuitest_coverfunc("build/yui-nodejs/yui-nodejs.js", "_delayCallback", 780);
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 782);
var Y = this,
            mod = ['event-base'];

        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 785);
until = (Y.Lang.isObject(until) ? until : { event: until });

        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 787);
if (until.event === 'load') {
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 788);
mod.push('event-synthetic');
        }

        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 791);
return function() {
            _yuitest_coverfunc("build/yui-nodejs/yui-nodejs.js", "(anonymous 3)", 791);
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 792);
var args = arguments;
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 793);
Y._use(mod, function() {
                _yuitest_coverfunc("build/yui-nodejs/yui-nodejs.js", "(anonymous 4)", 793);
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 794);
Y.on(until.event, function() {
                    _yuitest_coverfunc("build/yui-nodejs/yui-nodejs.js", "(anonymous 5)", 794);
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 795);
args[1].delayUntil = until.event;
                    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 796);
cb.apply(Y, args);
                }, until.args);
            });
        };
    },

    /**
     * Attaches one or more modules to the YUI instance.  When this
     * is executed, the requirements are analyzed, and one of
     * several things can happen:
     *
     *  * All requirements are available on the page --  The modules
     *   are attached to the instance.  If supplied, the use callback
     *   is executed synchronously.
     *
     *  * Modules are missing, the Get utility is not available OR
     *   the 'bootstrap' config is false -- A warning is issued about
     *   the missing modules and all available modules are attached.
     *
     *  * Modules are missing, the Loader is not available but the Get
     *   utility is and boostrap is not false -- The loader is bootstrapped
     *   before doing the following....
     *
     *  * Modules are missing and the Loader is available -- The loader
     *   expands the dependency tree and fetches missing modules.  When
     *   the loader is finshed the callback supplied to use is executed
     *   asynchronously.
     *
     * @method use
     * @param modules* {String|Array} 1-n modules to bind (uses arguments array).
     * @param [callback] {Function} callback function executed when
     * the instance has the required functionality.  If included, it
     * must be the last parameter.
     * @param callback.Y {YUI} The `YUI` instance created for this sandbox
     * @param callback.status {Object} Object containing `success`, `msg` and `data` properties
     *
     * @example
     *      // loads and attaches dd and its dependencies
     *      YUI().use('dd', function(Y) {});
     *
     *      // loads and attaches dd and node as well as all of their dependencies (since 3.4.0)
     *      YUI().use(['dd', 'node'], function(Y) {});
     *
     *      // attaches all modules that are available on the page
     *      YUI().use('*', function(Y) {});
     *
     *      // intrinsic YUI gallery support (since 3.1.0)
     *      YUI().use('gallery-yql', function(Y) {});
     *
     *      // intrinsic YUI 2in3 support (since 3.1.0)
     *      YUI().use('yui2-datatable', function(Y) {});
     *
     * @return {YUI} the YUI instance.
     */
    use: function() {
        _yuitest_coverfunc("build/yui-nodejs/yui-nodejs.js", "use", 850);
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 851);
var args = SLICE.call(arguments, 0),
            callback = args[args.length - 1],
            Y = this,
            i = 0,
            a = [],
            name,
            Env = Y.Env,
            provisioned = true;

        // The last argument supplied to use can be a load complete callback
        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 861);
if (Y.Lang.isFunction(callback)) {
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 862);
args.pop();
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 863);
if (Y.config.delayUntil) {
                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 864);
callback = Y._delayCallback(callback, Y.config.delayUntil);
            }
        } else {
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 867);
callback = null;
        }
        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 869);
if (Y.Lang.isArray(args[0])) {
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 870);
args = args[0];
        }

        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 873);
if (Y.config.cacheUse) {
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 874);
while ((name = args[i++])) {
                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 875);
if (!Env._attached[name]) {
                    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 876);
provisioned = false;
                    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 877);
break;
                }
            }

            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 881);
if (provisioned) {
                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 882);
if (args.length) {
                }
                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 884);
Y._notify(callback, ALREADY_DONE, args);
                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 885);
return Y;
            }
        }

        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 889);
if (Y._loading) {
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 890);
Y._useQueue = Y._useQueue || new Y.Queue();
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 891);
Y._useQueue.add([args, callback]);
        } else {
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 893);
Y._use(args, function(Y, response) {
                _yuitest_coverfunc("build/yui-nodejs/yui-nodejs.js", "(anonymous 6)", 893);
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 894);
Y._notify(callback, response, args);
            });
        }

        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 898);
return Y;
    },
    /**
    * Notify handler from Loader for attachment/load errors
    * @method _notify
    * @param callback {Function} The callback to pass to the `Y.config.loadErrorFn`
    * @param response {Object} The response returned from Loader
    * @param args {Array} The aruments passed from Loader
    * @private
    */
    _notify: function(callback, response, args) {
        _yuitest_coverfunc("build/yui-nodejs/yui-nodejs.js", "_notify", 908);
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 909);
if (!response.success && this.config.loadErrorFn) {
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 910);
this.config.loadErrorFn.call(this, this, callback, response, args);
        } else {_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 911);
if (callback) {
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 912);
if (this.Env._missed && this.Env._missed.length) {
                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 913);
response.msg = 'Missing modules: ' + this.Env._missed.join();
                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 914);
response.success = false;
            }
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 916);
if (this.config.throwFail) {
                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 917);
callback(this, response);
            } else {
                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 919);
try {
                    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 920);
callback(this, response);
                } catch (e) {
                    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 922);
this.error('use callback error', e, args);
                }
            }
        }}
    },

    /**
    * This private method is called from the `use` method queue. To ensure that only one set of loading
    * logic is performed at a time.
    * @method _use
    * @private
    * @param args* {String} 1-n modules to bind (uses arguments array).
    * @param *callback {Function} callback function executed when
    * the instance has the required functionality.  If included, it
    * must be the last parameter.
    */
    _use: function(args, callback) {

        _yuitest_coverfunc("build/yui-nodejs/yui-nodejs.js", "_use", 938);
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 940);
if (!this.Array) {
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 941);
this._attach(['yui-base']);
        }

        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 944);
var len, loader, handleBoot, handleRLS,
            Y = this,
            G_ENV = YUI.Env,
            mods = G_ENV.mods,
            Env = Y.Env,
            used = Env._used,
            aliases = G_ENV.aliases,
            queue = G_ENV._loaderQueue,
            firstArg = args[0],
            YArray = Y.Array,
            config = Y.config,
            boot = config.bootstrap,
            missing = [],
            i,
            r = [],
            ret = true,
            fetchCSS = config.fetchCSS,
            process = function(names, skip) {

                _yuitest_coverfunc("build/yui-nodejs/yui-nodejs.js", "process", 961);
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 963);
var i = 0, a = [], name, len, m, req, use;

                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 965);
if (!names.length) {
                    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 966);
return;
                }

                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 969);
if (aliases) {
                    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 970);
len = names.length;
                    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 971);
for (i = 0; i < len; i++) {
                        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 972);
if (aliases[names[i]] && !mods[names[i]]) {
                            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 973);
a = [].concat(a, aliases[names[i]]);
                        } else {
                            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 975);
a.push(names[i]);
                        }
                    }
                    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 978);
names = a;
                }
                
                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 981);
len = names.length;
                
                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 983);
for (i = 0; i < len; i++) {
                    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 984);
name = names[i];
                    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 985);
if (!skip) {
                        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 986);
r.push(name);
                    }

                    // only attach a module once
                    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 990);
if (used[name]) {
                        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 991);
continue;
                    }
                    
                    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 994);
m = mods[name];
                    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 995);
req = null;
                    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 996);
use = null;

                    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 998);
if (m) {
                        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 999);
used[name] = true;
                        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1000);
req = m.details.requires;
                        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1001);
use = m.details.use;
                    } else {
                        // CSS files don't register themselves, see if it has
                        // been loaded
                        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1005);
if (!G_ENV._loaded[VERSION][name]) {
                            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1006);
missing.push(name);
                        } else {
                            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1008);
used[name] = true; // probably css
                        }
                    }

                    // make sure requirements are attached
                    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1013);
if (req && req.length) {
                        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1014);
process(req);
                    }

                    // make sure we grab the submodule dependencies too
                    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1018);
if (use && use.length) {
                        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1019);
process(use, 1);
                    }
                }

            },

            handleLoader = function(fromLoader) {
                _yuitest_coverfunc("build/yui-nodejs/yui-nodejs.js", "handleLoader", 1025);
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1026);
var response = fromLoader || {
                        success: true,
                        msg: 'not dynamic'
                    },
                    redo, origMissing,
                    ret = true,
                    data = response.data;

                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1034);
Y._loading = false;

                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1036);
if (data) {
                    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1037);
origMissing = missing;
                    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1038);
missing = [];
                    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1039);
r = [];
                    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1040);
process(data);
                    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1041);
redo = missing.length;
                    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1042);
if (redo) {
                        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1043);
if ([].concat(missing).sort().join() ==
                                origMissing.sort().join()) {
                            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1045);
redo = false;
                        }
                    }
                }

                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1050);
if (redo && data) {
                    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1051);
Y._loading = true;
                    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1052);
Y._use(missing, function() {
                        _yuitest_coverfunc("build/yui-nodejs/yui-nodejs.js", "(anonymous 7)", 1052);
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1053);
if (Y._attach(data)) {
                            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1054);
Y._notify(callback, response, data);
                        }
                    });
                } else {
                    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1058);
if (data) {
                        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1059);
ret = Y._attach(data);
                    }
                    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1061);
if (ret) {
                        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1062);
Y._notify(callback, response, args);
                    }
                }

                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1066);
if (Y._useQueue && Y._useQueue.size() && !Y._loading) {
                    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1067);
Y._use.apply(Y, Y._useQueue.next());
                }

            };


        // YUI().use('*'); // bind everything available
        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1074);
if (firstArg === '*') {
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1075);
args = [];
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1076);
for (i in mods) {
                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1077);
if (mods.hasOwnProperty(i)) {
                    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1078);
args.push(i);
                }
            }
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1081);
ret = Y._attach(args);
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1082);
if (ret) {
                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1083);
handleLoader();
            }
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1085);
return Y;
        }

        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1088);
if ((mods.loader || mods['loader-base']) && !Y.Loader) {
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1089);
Y._attach(['loader' + ((!mods.loader) ? '-base' : '')]);
        }


        // use loader to expand dependencies and sort the
        // requirements if it is available.
        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1095);
if (boot && Y.Loader && args.length) {
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1096);
loader = getLoader(Y);
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1097);
loader.require(args);
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1098);
loader.ignoreRegistered = true;
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1099);
loader._boot = true;
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1100);
loader.calculate(null, (fetchCSS) ? null : 'js');
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1101);
args = loader.sorted;
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1102);
loader._boot = false;
        }
        
        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1105);
process(args);

        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1107);
len = missing.length;


        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1110);
if (len) {
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1111);
missing = YArray.dedupe(missing);
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1112);
len = missing.length;
        }


        // dynamic load
        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1117);
if (boot && len && Y.Loader) {
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1118);
Y._loading = true;
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1119);
loader = getLoader(Y);
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1120);
loader.onEnd = handleLoader;
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1121);
loader.context = Y;
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1122);
loader.data = args;
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1123);
loader.ignoreRegistered = false;
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1124);
loader.require(args);
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1125);
loader.insert(null, (fetchCSS) ? null : 'js');

        } else {_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1127);
if (boot && len && Y.Get && !Env.bootstrapped) {

            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1129);
Y._loading = true;

            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1131);
handleBoot = function() {
                _yuitest_coverfunc("build/yui-nodejs/yui-nodejs.js", "handleBoot", 1131);
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1132);
Y._loading = false;
                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1133);
queue.running = false;
                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1134);
Env.bootstrapped = true;
                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1135);
G_ENV._bootstrapping = false;
                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1136);
if (Y._attach(['loader'])) {
                    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1137);
Y._use(args, callback);
                }
            };

            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1141);
if (G_ENV._bootstrapping) {
                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1142);
queue.add(handleBoot);
            } else {
                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1144);
G_ENV._bootstrapping = true;
                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1145);
Y.Get.script(config.base + config.loaderPath, {
                    onEnd: handleBoot
                });
            }

        } else {
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1151);
ret = Y._attach(args);
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1152);
if (ret) {
                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1153);
handleLoader();
            }
        }}

        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1157);
return Y;
    },


    /**
    Adds a namespace object onto the YUI global if called statically.

        // creates YUI.your.namespace.here as nested objects
        YUI.namespace("your.namespace.here");

    If called as a method on a YUI <em>instance</em>, it creates the
    namespace on the instance.

         // creates Y.property.package
         Y.namespace("property.package");

    Dots in the input string cause `namespace` to create nested objects for
    each token. If any part of the requested namespace already exists, the
    current object will be left in place.  This allows multiple calls to
    `namespace` to preserve existing namespaced properties.

    If the first token in the namespace string is "YAHOO", the token is
    discarded.

    Be careful with namespace tokens. Reserved words may work in some browsers
    and not others. For instance, the following will fail in some browsers
    because the supported version of JavaScript reserves the word "long":

         Y.namespace("really.long.nested.namespace");

    <em>Note: If you pass multiple arguments to create multiple namespaces, only
    the last one created is returned from this function.</em>

    @method namespace
    @param  {String} namespace* namespaces to create.
    @return {Object}  A reference to the last namespace object created.
    **/
    namespace: function() {
        _yuitest_coverfunc("build/yui-nodejs/yui-nodejs.js", "namespace", 1194);
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1195);
var a = arguments, o, i = 0, j, d, arg;

        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1197);
for (; i < a.length; i++) {
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1198);
o = this; //Reset base object per argument or it will get reused from the last
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1199);
arg = a[i];
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1200);
if (arg.indexOf(PERIOD) > -1) { //Skip this if no "." is present
                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1201);
d = arg.split(PERIOD);
                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1202);
for (j = (d[0] == 'YAHOO') ? 1 : 0; j < d.length; j++) {
                    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1203);
o[d[j]] = o[d[j]] || {};
                    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1204);
o = o[d[j]];
                }
            } else {
                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1207);
o[arg] = o[arg] || {};
                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1208);
o = o[arg]; //Reset base object to the new object so it's returned
            }
        }
        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1211);
return o;
    },

    // this is replaced if the log module is included
    log: NOOP,
    message: NOOP,
    // this is replaced if the dump module is included
    dump: function (o) { _yuitest_coverfunc("build/yui-nodejs/yui-nodejs.js", "dump", 1218);
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1218);
return ''+o; },

    /**
     * Report an error.  The reporting mechanism is controlled by
     * the `throwFail` configuration attribute.  If throwFail is
     * not specified, the message is written to the Logger, otherwise
     * a JS error is thrown. If an `errorFn` is specified in the config
     * it must return `true` to keep the error from being thrown.
     * @method error
     * @param msg {String} the error message.
     * @param e {Error|String} Optional JS error that was caught, or an error string.
     * @param src Optional additional info (passed to `Y.config.errorFn` and `Y.message`)
     * and `throwFail` is specified, this error will be re-thrown.
     * @return {YUI} this YUI instance.
     */
    error: function(msg, e, src) {
        //TODO Add check for window.onerror here

        _yuitest_coverfunc("build/yui-nodejs/yui-nodejs.js", "error", 1233);
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1236);
var Y = this, ret;

        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1238);
if (Y.config.errorFn) {
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1239);
ret = Y.config.errorFn.apply(Y, arguments);
        }

        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1242);
if (!ret) {
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1243);
throw (e || new Error(msg));
        } else {
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1245);
Y.message(msg, 'error', ''+src); // don't scrub this one
        }

        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1248);
return Y;
    },

    /**
     * Generate an id that is unique among all YUI instances
     * @method guid
     * @param pre {String} optional guid prefix.
     * @return {String} the guid.
     */
    guid: function(pre) {
        _yuitest_coverfunc("build/yui-nodejs/yui-nodejs.js", "guid", 1257);
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1258);
var id = this.Env._guidp + '_' + (++this.Env._uidx);
        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1259);
return (pre) ? (pre + id) : id;
    },

    /**
     * Returns a `guid` associated with an object.  If the object
     * does not have one, a new one is created unless `readOnly`
     * is specified.
     * @method stamp
     * @param o {Object} The object to stamp.
     * @param readOnly {Boolean} if `true`, a valid guid will only
     * be returned if the object has one assigned to it.
     * @return {String} The object's guid or null.
     */
    stamp: function(o, readOnly) {
        _yuitest_coverfunc("build/yui-nodejs/yui-nodejs.js", "stamp", 1272);
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1273);
var uid;
        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1274);
if (!o) {
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1275);
return o;
        }

        // IE generates its own unique ID for dom nodes
        // The uniqueID property of a document node returns a new ID
        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1280);
if (o.uniqueID && o.nodeType && o.nodeType !== 9) {
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1281);
uid = o.uniqueID;
        } else {
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1283);
uid = (typeof o === 'string') ? o : o._yuid;
        }

        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1286);
if (!uid) {
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1287);
uid = this.guid();
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1288);
if (!readOnly) {
                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1289);
try {
                    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1290);
o._yuid = uid;
                } catch (e) {
                    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1292);
uid = null;
                }
            }
        }
        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1296);
return uid;
    },

    /**
     * Destroys the YUI instance
     * @method destroy
     * @since 3.3.0
     */
    destroy: function() {
        _yuitest_coverfunc("build/yui-nodejs/yui-nodejs.js", "destroy", 1304);
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1305);
var Y = this;
        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1306);
if (Y.Event) {
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1307);
Y.Event._unload();
        }
        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1309);
delete instances[Y.id];
        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1310);
delete Y.Env;
        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1311);
delete Y.config;
    }

    /**
     * instanceof check for objects that works around
     * memory leak in IE when the item tested is
     * window/document
     * @method instanceOf
     * @param o {Object} The object to check.
     * @param type {Object} The class to check against.
     * @since 3.3.0
     */
};

    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1325);
YUI.prototype = proto;

    // inheritance utilities are not available yet
    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1328);
for (prop in proto) {
        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1329);
if (proto.hasOwnProperty(prop)) {
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1330);
YUI[prop] = proto[prop];
        }
    }

    /**
Static method on the Global YUI object to apply a config to all YUI instances.
It's main use case is "mashups" where several third party scripts are trying to write to
a global YUI config at the same time. This way they can all call `YUI.applyConfig({})` instead of
overwriting other scripts configs.
@static
@since 3.5.0
@method applyConfig
@param {Object} o the configuration object.
@example

    YUI.applyConfig({
        modules: {
            davglass: {
                fullpath: './davglass.js'
            }
        }
    });

    YUI.applyConfig({
        modules: {
            foo: {
                fullpath: './foo.js'
            }
        }
    });

    YUI().use('davglass', function(Y) {
        //Module davglass will be available here..
    });

    */
    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1366);
YUI.applyConfig = function(o) {
        _yuitest_coverfunc("build/yui-nodejs/yui-nodejs.js", "applyConfig", 1366);
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1367);
if (!o) {
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1368);
return;
        }
        //If there is a GlobalConfig, apply it first to set the defaults
        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1371);
if (YUI.GlobalConfig) {
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1372);
this.prototype.applyConfig.call(this, YUI.GlobalConfig);
        }
        //Apply this config to it
        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1375);
this.prototype.applyConfig.call(this, o);
        //Reset GlobalConfig to the combined config
        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1377);
YUI.GlobalConfig = this.config;
    };

    // set up the environment
    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1381);
YUI._init();

    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1383);
if (hasWin) {
        // add a window load event at load time so we can capture
        // the case where it fires before dynamic loading is
        // complete.
        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1387);
add(window, 'load', handleLoad);
    } else {
        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1389);
handleLoad();
    }

    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1392);
YUI.Env.add = add;
    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1393);
YUI.Env.remove = remove;

    /*global exports*/
    // Support the CommonJS method for exporting our single global
    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1397);
if (typeof exports == 'object') {
        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1398);
exports.YUI = YUI;
    }

}());


/**
 * The config object contains all of the configuration options for
 * the `YUI` instance.  This object is supplied by the implementer
 * when instantiating a `YUI` instance.  Some properties have default
 * values if they are not supplied by the implementer.  This should
 * not be updated directly because some values are cached.  Use
 * `applyConfig()` to update the config object on a YUI instance that
 * has already been configured.
 *
 * @class config
 * @static
 */

/**
 * Allows the YUI seed file to fetch the loader component and library
 * metadata to dynamically load additional dependencies.
 *
 * @property bootstrap
 * @type boolean
 * @default true
 */

/**
 * Turns on writing Ylog messages to the browser console.
 *
 * @property debug
 * @type boolean
 * @default true
 */

/**
 * Log to the browser console if debug is on and the browser has a
 * supported console.
 *
 * @property useBrowserConsole
 * @type boolean
 * @default true
 */

/**
 * A hash of log sources that should be logged.  If specified, only
 * log messages from these sources will be logged.
 *
 * @property logInclude
 * @type object
 */

/**
 * A hash of log sources that should be not be logged.  If specified,
 * all sources are logged if not on this list.
 *
 * @property logExclude
 * @type object
 */

/**
 * Set to true if the yui seed file was dynamically loaded in
 * order to bootstrap components relying on the window load event
 * and the `domready` custom event.
 *
 * @property injected
 * @type boolean
 * @default false
 */

/**
 * If `throwFail` is set, `Y.error` will generate or re-throw a JS Error.
 * Otherwise the failure is logged.
 *
 * @property throwFail
 * @type boolean
 * @default true
 */

/**
 * The window/frame that this instance should operate in.
 *
 * @property win
 * @type Window
 * @default the window hosting YUI
 */

/**
 * The document associated with the 'win' configuration.
 *
 * @property doc
 * @type Document
 * @default the document hosting YUI
 */

/**
 * A list of modules that defines the YUI core (overrides the default list).
 *
 * @property core
 * @type Array
 * @default [ get,features,intl-base,yui-log,yui-later,loader-base, loader-rollup, loader-yui3 ]
 */

/**
 * A list of languages in order of preference. This list is matched against
 * the list of available languages in modules that the YUI instance uses to
 * determine the best possible localization of language sensitive modules.
 * Languages are represented using BCP 47 language tags, such as "en-GB" for
 * English as used in the United Kingdom, or "zh-Hans-CN" for simplified
 * Chinese as used in China. The list can be provided as a comma-separated
 * list or as an array.
 *
 * @property lang
 * @type string|string[]
 */

/**
 * The default date format
 * @property dateFormat
 * @type string
 * @deprecated use configuration in `DataType.Date.format()` instead.
 */

/**
 * The default locale
 * @property locale
 * @type string
 * @deprecated use `config.lang` instead.
 */

/**
 * The default interval when polling in milliseconds.
 * @property pollInterval
 * @type int
 * @default 20
 */

/**
 * The number of dynamic nodes to insert by default before
 * automatically removing them.  This applies to script nodes
 * because removing the node will not make the evaluated script
 * unavailable.  Dynamic CSS is not auto purged, because removing
 * a linked style sheet will also remove the style definitions.
 * @property purgethreshold
 * @type int
 * @default 20
 */

/**
 * The default interval when polling in milliseconds.
 * @property windowResizeDelay
 * @type int
 * @default 40
 */

/**
 * Base directory for dynamic loading
 * @property base
 * @type string
 */

/*
 * The secure base dir (not implemented)
 * For dynamic loading.
 * @property secureBase
 * @type string
 */

/**
 * The YUI combo service base dir. Ex: `http://yui.yahooapis.com/combo?`
 * For dynamic loading.
 * @property comboBase
 * @type string
 */

/**
 * The root path to prepend to module path for the combo service.
 * Ex: 3.0.0b1/build/
 * For dynamic loading.
 * @property root
 * @type string
 */

/**
 * A filter to apply to result urls.  This filter will modify the default
 * path for all modules.  The default path for the YUI library is the
 * minified version of the files (e.g., event-min.js).  The filter property
 * can be a predefined filter or a custom filter.  The valid predefined
 * filters are:
 * <dl>
 *  <dt>DEBUG</dt>
 *  <dd>Selects the debug versions of the library (e.g., event-debug.js).
 *      This option will automatically include the Logger widget</dd>
 *  <dt>RAW</dt>
 *  <dd>Selects the non-minified version of the library (e.g., event.js).</dd>
 * </dl>
 * You can also define a custom filter, which must be an object literal
 * containing a search expression and a replace string:
 *
 *      myFilter: {
 *          'searchExp': "-min\\.js",
 *          'replaceStr': "-debug.js"
 *      }
 *
 * For dynamic loading.
 *
 * @property filter
 * @type string|object
 */

/**
 * The `skin` config let's you configure application level skin
 * customizations.  It contains the following attributes which
 * can be specified to override the defaults:
 *
 *      // The default skin, which is automatically applied if not
 *      // overriden by a component-specific skin definition.
 *      // Change this in to apply a different skin globally
 *      defaultSkin: 'sam',
 *
 *      // This is combined with the loader base property to get
 *      // the default root directory for a skin.
 *      base: 'assets/skins/',
 *
 *      // Any component-specific overrides can be specified here,
 *      // making it possible to load different skins for different
 *      // components.  It is possible to load more than one skin
 *      // for a given component as well.
 *      overrides: {
 *          slider: ['capsule', 'round']
 *      }
 *
 * For dynamic loading.
 *
 *  @property skin
 */

/**
 * Hash of per-component filter specification.  If specified for a given
 * component, this overrides the filter config.
 *
 * For dynamic loading.
 *
 * @property filters
 */

/**
 * Use the YUI combo service to reduce the number of http connections
 * required to load your dependencies.  Turning this off will
 * disable combo handling for YUI and all module groups configured
 * with a combo service.
 *
 * For dynamic loading.
 *
 * @property combine
 * @type boolean
 * @default true if 'base' is not supplied, false if it is.
 */

/**
 * A list of modules that should never be dynamically loaded
 *
 * @property ignore
 * @type string[]
 */

/**
 * A list of modules that should always be loaded when required, even if already
 * present on the page.
 *
 * @property force
 * @type string[]
 */

/**
 * Node or id for a node that should be used as the insertion point for new
 * nodes.  For dynamic loading.
 *
 * @property insertBefore
 * @type string
 */

/**
 * Object literal containing attributes to add to dynamically loaded script
 * nodes.
 * @property jsAttributes
 * @type string
 */

/**
 * Object literal containing attributes to add to dynamically loaded link
 * nodes.
 * @property cssAttributes
 * @type string
 */

/**
 * Number of milliseconds before a timeout occurs when dynamically
 * loading nodes. If not set, there is no timeout.
 * @property timeout
 * @type int
 */

/**
 * Callback for the 'CSSComplete' event.  When dynamically loading YUI
 * components with CSS, this property fires when the CSS is finished
 * loading but script loading is still ongoing.  This provides an
 * opportunity to enhance the presentation of a loading page a little
 * bit before the entire loading process is done.
 *
 * @property onCSS
 * @type function
 */

/**
 * A hash of module definitions to add to the list of YUI components.
 * These components can then be dynamically loaded side by side with
 * YUI via the `use()` method. This is a hash, the key is the module
 * name, and the value is an object literal specifying the metdata
 * for the module.  See `Loader.addModule` for the supported module
 * metadata fields.  Also see groups, which provides a way to
 * configure the base and combo spec for a set of modules.
 *
 *      modules: {
 *          mymod1: {
 *              requires: ['node'],
 *              fullpath: '/mymod1/mymod1.js'
 *          },
 *          mymod2: {
 *              requires: ['mymod1'],
 *              fullpath: '/mymod2/mymod2.js'
 *          },
 *          mymod3: '/js/mymod3.js',
 *          mycssmod: '/css/mycssmod.css'
 *      }
 *
 *
 * @property modules
 * @type object
 */

/**
 * Aliases are dynamic groups of modules that can be used as
 * shortcuts.
 *
 *      YUI({
 *          aliases: {
 *              davglass: [ 'node', 'yql', 'dd' ],
 *              mine: [ 'davglass', 'autocomplete']
 *          }
 *      }).use('mine', function(Y) {
 *          //Node, YQL, DD &amp; AutoComplete available here..
 *      });
 *
 * @property aliases
 * @type object
 */

/**
 * A hash of module group definitions.  It for each group you
 * can specify a list of modules and the base path and
 * combo spec to use when dynamically loading the modules.
 *
 *      groups: {
 *          yui2: {
 *              // specify whether or not this group has a combo service
 *              combine: true,
 *
 *              // The comboSeperator to use with this group's combo handler
 *              comboSep: ';',
 *
 *              // The maxURLLength for this server
 *              maxURLLength: 500,
 *
 *              // the base path for non-combo paths
 *              base: 'http://yui.yahooapis.com/2.8.0r4/build/',
 *
 *              // the path to the combo service
 *              comboBase: 'http://yui.yahooapis.com/combo?',
 *
 *              // a fragment to prepend to the path attribute when
 *              // when building combo urls
 *              root: '2.8.0r4/build/',
 *
 *              // the module definitions
 *              modules:  {
 *                  yui2_yde: {
 *                      path: "yahoo-dom-event/yahoo-dom-event.js"
 *                  },
 *                  yui2_anim: {
 *                      path: "animation/animation.js",
 *                      requires: ['yui2_yde']
 *                  }
 *              }
 *          }
 *      }
 *
 * @property groups
 * @type object
 */

/**
 * The loader 'path' attribute to the loader itself.  This is combined
 * with the 'base' attribute to dynamically load the loader component
 * when boostrapping with the get utility alone.
 *
 * @property loaderPath
 * @type string
 * @default loader/loader-min.js
 */

/**
 * Specifies whether or not YUI().use(...) will attempt to load CSS
 * resources at all.  Any truthy value will cause CSS dependencies
 * to load when fetching script.  The special value 'force' will
 * cause CSS dependencies to be loaded even if no script is needed.
 *
 * @property fetchCSS
 * @type boolean|string
 * @default true
 */

/**
 * The default gallery version to build gallery module urls
 * @property gallery
 * @type string
 * @since 3.1.0
 */

/**
 * The default YUI 2 version to build yui2 module urls.  This is for
 * intrinsic YUI 2 support via the 2in3 project.  Also see the '2in3'
 * config for pulling different revisions of the wrapped YUI 2
 * modules.
 * @since 3.1.0
 * @property yui2
 * @type string
 * @default 2.9.0
 */

/**
 * The 2in3 project is a deployment of the various versions of YUI 2
 * deployed as first-class YUI 3 modules.  Eventually, the wrapper
 * for the modules will change (but the underlying YUI 2 code will
 * be the same), and you can select a particular version of
 * the wrapper modules via this config.
 * @since 3.1.0
 * @property 2in3
 * @type string
 * @default 4
 */

/**
 * Alternative console log function for use in environments without
 * a supported native console.  The function is executed in the
 * YUI instance context.
 * @since 3.1.0
 * @property logFn
 * @type Function
 */

/**
 * A callback to execute when Y.error is called.  It receives the
 * error message and an javascript error object if Y.error was
 * executed because a javascript error was caught.  The function
 * is executed in the YUI instance context. Returning `true` from this
 * function will stop the Error from being thrown.
 *
 * @since 3.2.0
 * @property errorFn
 * @type Function
 */

/**
 * A callback to execute when the loader fails to load one or
 * more resource.  This could be because of a script load
 * failure.  It can also fail if a javascript module fails
 * to register itself, but only when the 'requireRegistration'
 * is true.  If this function is defined, the use() callback will
 * only be called when the loader succeeds, otherwise it always
 * executes unless there was a javascript error when attaching
 * a module.
 *
 * @since 3.3.0
 * @property loadErrorFn
 * @type Function
 */

/**
 * When set to true, the YUI loader will expect that all modules
 * it is responsible for loading will be first-class YUI modules
 * that register themselves with the YUI global.  If this is
 * set to true, loader will fail if the module registration fails
 * to happen after the script is loaded.
 *
 * @since 3.3.0
 * @property requireRegistration
 * @type boolean
 * @default false
 */

/**
 * Cache serviced use() requests.
 * @since 3.3.0
 * @property cacheUse
 * @type boolean
 * @default true
 * @deprecated no longer used
 */

/**
 * Whether or not YUI should use native ES5 functionality when available for
 * features like `Y.Array.each()`, `Y.Object()`, etc. When `false`, YUI will
 * always use its own fallback implementations instead of relying on ES5
 * functionality, even when it's available.
 *
 * @property useNativeES5
 * @type Boolean
 * @default true
 * @since 3.5.0
 */

/**
Delay the `use` callback until a specific event has passed (`load`, `domready`, `contentready` or `available`)
@property delayUntil
@type String|Object
@since 3.6.0
@example

You can use `load` or `domready` strings by default:

    YUI({
        delayUntil: 'domready'
    }, function(Y) {
        //This will not fire until 'domeready'
    });

Or you can delay until a node is available (with `available` or `contentready`):

    YUI({
        delayUntil: {
            event: 'available',
            args: '#foo'
        }
    }, function(Y) {
        //This will not fire until '#foo' is 
        // available in the DOM
    });
    

*/
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1950);
YUI.add('yui-base', function (Y, NAME) {

/*
 * YUI stub
 * @module yui
 * @submodule yui-base
 */
/**
 * The YUI module contains the components required for building the YUI
 * seed file.  This includes the script loading mechanism, a simple queue,
 * and the core utilities for the library.
 * @module yui
 * @submodule yui-base
 */

/**
 * Provides core language utilites and extensions used throughout YUI.
 *
 * @class Lang
 * @static
 */

_yuitest_coverfunc("build/yui-nodejs/yui-nodejs.js", "(anonymous 8)", 1950);
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 1972);
var L = Y.Lang || (Y.Lang = {}),

STRING_PROTO = String.prototype,
TOSTRING     = Object.prototype.toString,

TYPES = {
    'undefined'        : 'undefined',
    'number'           : 'number',
    'boolean'          : 'boolean',
    'string'           : 'string',
    '[object Function]': 'function',
    '[object RegExp]'  : 'regexp',
    '[object Array]'   : 'array',
    '[object Date]'    : 'date',
    '[object Error]'   : 'error'
},

SUBREGEX        = /\{\s*([^|}]+?)\s*(?:\|([^}]*))?\s*\}/g,
TRIMREGEX       = /^\s+|\s+$/g,
NATIVE_FN_REGEX = /\{\s*\[(?:native code|function)\]\s*\}/i;

// -- Protected Methods --------------------------------------------------------

/**
Returns `true` if the given function appears to be implemented in native code,
`false` otherwise. Will always return `false` -- even in ES5-capable browsers --
if the `useNativeES5` YUI config option is set to `false`.

This isn't guaranteed to be 100% accurate and won't work for anything other than
functions, but it can be useful for determining whether a function like
`Array.prototype.forEach` is native or a JS shim provided by another library.

There's a great article by @kangax discussing certain flaws with this technique:
<http://perfectionkills.com/detecting-built-in-host-methods/>

While his points are valid, it's still possible to benefit from this function
as long as it's used carefully and sparingly, and in such a way that false
negatives have minimal consequences. It's used internally to avoid using
potentially broken non-native ES5 shims that have been added to the page by
other libraries.

@method _isNative
@param {Function} fn Function to test.
@return {Boolean} `true` if _fn_ appears to be native, `false` otherwise.
@static
@protected
@since 3.5.0
**/
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2020);
L._isNative = function (fn) {
    _yuitest_coverfunc("build/yui-nodejs/yui-nodejs.js", "_isNative", 2020);
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2021);
return !!(Y.config.useNativeES5 && fn && NATIVE_FN_REGEX.test(fn));
};

// -- Public Methods -----------------------------------------------------------

/**
 * Determines whether or not the provided item is an array.
 *
 * Returns `false` for array-like collections such as the function `arguments`
 * collection or `HTMLElement` collections. Use `Y.Array.test()` if you want to
 * test for an array-like collection.
 *
 * @method isArray
 * @param o The object to test.
 * @return {boolean} true if o is an array.
 * @static
 */
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2038);
L.isArray = L._isNative(Array.isArray) ? Array.isArray : function (o) {
    _yuitest_coverfunc("build/yui-nodejs/yui-nodejs.js", "isArray", 2038);
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2039);
return L.type(o) === 'array';
};

/**
 * Determines whether or not the provided item is a boolean.
 * @method isBoolean
 * @static
 * @param o The object to test.
 * @return {boolean} true if o is a boolean.
 */
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2049);
L.isBoolean = function(o) {
    _yuitest_coverfunc("build/yui-nodejs/yui-nodejs.js", "isBoolean", 2049);
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2050);
return typeof o === 'boolean';
};

/**
 * Determines whether or not the supplied item is a date instance.
 * @method isDate
 * @static
 * @param o The object to test.
 * @return {boolean} true if o is a date.
 */
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2060);
L.isDate = function(o) {
    _yuitest_coverfunc("build/yui-nodejs/yui-nodejs.js", "isDate", 2060);
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2061);
return L.type(o) === 'date' && o.toString() !== 'Invalid Date' && !isNaN(o);
};

/**
 * <p>
 * Determines whether or not the provided item is a function.
 * Note: Internet Explorer thinks certain functions are objects:
 * </p>
 *
 * <pre>
 * var obj = document.createElement("object");
 * Y.Lang.isFunction(obj.getAttribute) // reports false in IE
 * &nbsp;
 * var input = document.createElement("input"); // append to body
 * Y.Lang.isFunction(input.focus) // reports false in IE
 * </pre>
 *
 * <p>
 * You will have to implement additional tests if these functions
 * matter to you.
 * </p>
 *
 * @method isFunction
 * @static
 * @param o The object to test.
 * @return {boolean} true if o is a function.
 */
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2088);
L.isFunction = function(o) {
    _yuitest_coverfunc("build/yui-nodejs/yui-nodejs.js", "isFunction", 2088);
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2089);
return L.type(o) === 'function';
};

/**
 * Determines whether or not the provided item is null.
 * @method isNull
 * @static
 * @param o The object to test.
 * @return {boolean} true if o is null.
 */
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2099);
L.isNull = function(o) {
    _yuitest_coverfunc("build/yui-nodejs/yui-nodejs.js", "isNull", 2099);
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2100);
return o === null;
};

/**
 * Determines whether or not the provided item is a legal number.
 * @method isNumber
 * @static
 * @param o The object to test.
 * @return {boolean} true if o is a number.
 */
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2110);
L.isNumber = function(o) {
    _yuitest_coverfunc("build/yui-nodejs/yui-nodejs.js", "isNumber", 2110);
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2111);
return typeof o === 'number' && isFinite(o);
};

/**
 * Determines whether or not the provided item is of type object
 * or function. Note that arrays are also objects, so
 * <code>Y.Lang.isObject([]) === true</code>.
 * @method isObject
 * @static
 * @param o The object to test.
 * @param failfn {boolean} fail if the input is a function.
 * @return {boolean} true if o is an object.
 * @see isPlainObject
 */
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2125);
L.isObject = function(o, failfn) {
    _yuitest_coverfunc("build/yui-nodejs/yui-nodejs.js", "isObject", 2125);
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2126);
var t = typeof o;
    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2127);
return (o && (t === 'object' ||
        (!failfn && (t === 'function' || L.isFunction(o))))) || false;
};

/**
 * Determines whether or not the provided item is a string.
 * @method isString
 * @static
 * @param o The object to test.
 * @return {boolean} true if o is a string.
 */
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2138);
L.isString = function(o) {
    _yuitest_coverfunc("build/yui-nodejs/yui-nodejs.js", "isString", 2138);
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2139);
return typeof o === 'string';
};

/**
 * Determines whether or not the provided item is undefined.
 * @method isUndefined
 * @static
 * @param o The object to test.
 * @return {boolean} true if o is undefined.
 */
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2149);
L.isUndefined = function(o) {
    _yuitest_coverfunc("build/yui-nodejs/yui-nodejs.js", "isUndefined", 2149);
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2150);
return typeof o === 'undefined';
};

/**
 * A convenience method for detecting a legitimate non-null value.
 * Returns false for null/undefined/NaN, true for other values,
 * including 0/false/''
 * @method isValue
 * @static
 * @param o The item to test.
 * @return {boolean} true if it is not null/undefined/NaN || false.
 */
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2162);
L.isValue = function(o) {
    _yuitest_coverfunc("build/yui-nodejs/yui-nodejs.js", "isValue", 2162);
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2163);
var t = L.type(o);

    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2165);
switch (t) {
        case 'number':
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2167);
return isFinite(o);

        case 'null': // fallthru
        case 'undefined':
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2171);
return false;

        default:
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2174);
return !!t;
    }
};

/**
 * Returns the current time in milliseconds.
 *
 * @method now
 * @return {Number} Current time in milliseconds.
 * @static
 * @since 3.3.0
 */
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2186);
L.now = Date.now || function () {
    _yuitest_coverfunc("build/yui-nodejs/yui-nodejs.js", "(anonymous 9)", 2186);
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2187);
return new Date().getTime();
};

/**
 * Lightweight version of <code>Y.substitute</code>. Uses the same template
 * structure as <code>Y.substitute</code>, but doesn't support recursion,
 * auto-object coersion, or formats.
 * @method sub
 * @param {string} s String to be modified.
 * @param {object} o Object containing replacement values.
 * @return {string} the substitute result.
 * @static
 * @since 3.2.0
 */
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2201);
L.sub = function(s, o) {
    _yuitest_coverfunc("build/yui-nodejs/yui-nodejs.js", "sub", 2201);
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2202);
return s.replace ? s.replace(SUBREGEX, function (match, key) {
        _yuitest_coverfunc("build/yui-nodejs/yui-nodejs.js", "(anonymous 10)", 2202);
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2203);
return L.isUndefined(o[key]) ? match : o[key];
    }) : s;
};

/**
 * Returns a string without any leading or trailing whitespace.  If
 * the input is not a string, the input will be returned untouched.
 * @method trim
 * @static
 * @param s {string} the string to trim.
 * @return {string} the trimmed string.
 */
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2215);
L.trim = STRING_PROTO.trim ? function(s) {
    _yuitest_coverfunc("build/yui-nodejs/yui-nodejs.js", "(anonymous 11)", 2215);
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2216);
return s && s.trim ? s.trim() : s;
} : function (s) {
    _yuitest_coverfunc("build/yui-nodejs/yui-nodejs.js", "}", 2217);
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2218);
try {
        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2219);
return s.replace(TRIMREGEX, '');
    } catch (e) {
        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2221);
return s;
    }
};

/**
 * Returns a string without any leading whitespace.
 * @method trimLeft
 * @static
 * @param s {string} the string to trim.
 * @return {string} the trimmed string.
 */
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2232);
L.trimLeft = STRING_PROTO.trimLeft ? function (s) {
    _yuitest_coverfunc("build/yui-nodejs/yui-nodejs.js", "(anonymous 12)", 2232);
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2233);
return s.trimLeft();
} : function (s) {
    _yuitest_coverfunc("build/yui-nodejs/yui-nodejs.js", "}", 2234);
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2235);
return s.replace(/^\s+/, '');
};

/**
 * Returns a string without any trailing whitespace.
 * @method trimRight
 * @static
 * @param s {string} the string to trim.
 * @return {string} the trimmed string.
 */
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2245);
L.trimRight = STRING_PROTO.trimRight ? function (s) {
    _yuitest_coverfunc("build/yui-nodejs/yui-nodejs.js", "(anonymous 13)", 2245);
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2246);
return s.trimRight();
} : function (s) {
    _yuitest_coverfunc("build/yui-nodejs/yui-nodejs.js", "}", 2247);
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2248);
return s.replace(/\s+$/, '');
};

/**
Returns one of the following strings, representing the type of the item passed
in:

 * "array"
 * "boolean"
 * "date"
 * "error"
 * "function"
 * "null"
 * "number"
 * "object"
 * "regexp"
 * "string"
 * "undefined"

Known issues:

 * `typeof HTMLElementCollection` returns function in Safari, but
    `Y.Lang.type()` reports "object", which could be a good thing --
    but it actually caused the logic in <code>Y.Lang.isObject</code> to fail.

@method type
@param o the item to test.
@return {string} the detected type.
@static
**/
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2278);
L.type = function(o) {
    _yuitest_coverfunc("build/yui-nodejs/yui-nodejs.js", "type", 2278);
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2279);
return TYPES[typeof o] || TYPES[TOSTRING.call(o)] || (o ? 'object' : 'null');
};
/**
@module yui
@submodule yui-base
*/

_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2286);
var Lang   = Y.Lang,
    Native = Array.prototype,

    hasOwn = Object.prototype.hasOwnProperty;

/**
Provides utility methods for working with arrays. Additional array helpers can
be found in the `collection` and `array-extras` modules.

`Y.Array(thing)` returns a native array created from _thing_. Depending on
_thing_'s type, one of the following will happen:

  * Arrays are returned unmodified unless a non-zero _startIndex_ is
    specified.
  * Array-like collections (see `Array.test()`) are converted to arrays.
  * For everything else, a new array is created with _thing_ as the sole
    item.

Note: elements that are also collections, such as `<form>` and `<select>`
elements, are not automatically converted to arrays. To force a conversion,
pass `true` as the value of the _force_ parameter.

@class Array
@constructor
@param {Any} thing The thing to arrayify.
@param {Number} [startIndex=0] If non-zero and _thing_ is an array or array-like
  collection, a subset of items starting at the specified index will be
  returned.
@param {Boolean} [force=false] If `true`, _thing_ will be treated as an
  array-like collection no matter what.
@return {Array} A native array created from _thing_, according to the rules
  described above.
**/
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2319);
function YArray(thing, startIndex, force) {
    _yuitest_coverfunc("build/yui-nodejs/yui-nodejs.js", "YArray", 2319);
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2320);
var len, result;

    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2322);
startIndex || (startIndex = 0);

    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2324);
if (force || YArray.test(thing)) {
        // IE throws when trying to slice HTMLElement collections.
        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2326);
try {
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2327);
return Native.slice.call(thing, startIndex);
        } catch (ex) {
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2329);
result = [];

            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2331);
for (len = thing.length; startIndex < len; ++startIndex) {
                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2332);
result.push(thing[startIndex]);
            }

            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2335);
return result;
        }
    }

    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2339);
return [thing];
}

_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2342);
Y.Array = YArray;

/**
Dedupes an array of strings, returning an array that's guaranteed to contain
only one copy of a given string.

This method differs from `Array.unique()` in that it's optimized for use only
with strings, whereas `unique` may be used with other types (but is slower).
Using `dedupe()` with non-string values may result in unexpected behavior.

@method dedupe
@param {String[]} array Array of strings to dedupe.
@return {Array} Deduped copy of _array_.
@static
@since 3.4.0
**/
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2358);
YArray.dedupe = function (array) {
    _yuitest_coverfunc("build/yui-nodejs/yui-nodejs.js", "dedupe", 2358);
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2359);
var hash    = {},
        results = [],
        i, item, len;

    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2363);
for (i = 0, len = array.length; i < len; ++i) {
        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2364);
item = array[i];

        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2366);
if (!hasOwn.call(hash, item)) {
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2367);
hash[item] = 1;
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2368);
results.push(item);
        }
    }

    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2372);
return results;
};

/**
Executes the supplied function on each item in the array. This method wraps
the native ES5 `Array.forEach()` method if available.

@method each
@param {Array} array Array to iterate.
@param {Function} fn Function to execute on each item in the array. The function
  will receive the following arguments:
    @param {Any} fn.item Current array item.
    @param {Number} fn.index Current array index.
    @param {Array} fn.array Array being iterated.
@param {Object} [thisObj] `this` object to use when calling _fn_.
@return {YUI} The YUI instance.
@static
**/
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2390);
YArray.each = YArray.forEach = Lang._isNative(Native.forEach) ? function (array, fn, thisObj) {
    _yuitest_coverfunc("build/yui-nodejs/yui-nodejs.js", "(anonymous 14)", 2390);
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2391);
Native.forEach.call(array || [], fn, thisObj || Y);
    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2392);
return Y;
} : function (array, fn, thisObj) {
    _yuitest_coverfunc("build/yui-nodejs/yui-nodejs.js", "}", 2393);
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2394);
for (var i = 0, len = (array && array.length) || 0; i < len; ++i) {
        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2395);
if (i in array) {
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2396);
fn.call(thisObj || Y, array[i], i, array);
        }
    }

    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2400);
return Y;
};

/**
Alias for `each()`.

@method forEach
@static
**/

/**
Returns an object using the first array as keys and the second as values. If
the second array is not provided, or if it doesn't contain the same number of
values as the first array, then `true` will be used in place of the missing
values.

@example

    Y.Array.hash(['a', 'b', 'c'], ['foo', 'bar']);
    // => {a: 'foo', b: 'bar', c: true}

@method hash
@param {String[]} keys Array of strings to use as keys.
@param {Array} [values] Array to use as values.
@return {Object} Hash using the first array as keys and the second as values.
@static
**/
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2427);
YArray.hash = function (keys, values) {
    _yuitest_coverfunc("build/yui-nodejs/yui-nodejs.js", "hash", 2427);
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2428);
var hash = {},
        vlen = (values && values.length) || 0,
        i, len;

    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2432);
for (i = 0, len = keys.length; i < len; ++i) {
        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2433);
if (i in keys) {
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2434);
hash[keys[i]] = vlen > i && i in values ? values[i] : true;
        }
    }

    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2438);
return hash;
};

/**
Returns the index of the first item in the array that's equal (using a strict
equality check) to the specified _value_, or `-1` if the value isn't found.

This method wraps the native ES5 `Array.indexOf()` method if available.

@method indexOf
@param {Array} array Array to search.
@param {Any} value Value to search for.
@param {Number} [from=0] The index at which to begin the search.
@return {Number} Index of the item strictly equal to _value_, or `-1` if not
    found.
@static
**/
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2455);
YArray.indexOf = Lang._isNative(Native.indexOf) ? function (array, value, from) {
    _yuitest_coverfunc("build/yui-nodejs/yui-nodejs.js", "(anonymous 15)", 2455);
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2456);
return Native.indexOf.call(array, value, from);
} : function (array, value, from) {
    // http://es5.github.com/#x15.4.4.14
    _yuitest_coverfunc("build/yui-nodejs/yui-nodejs.js", "}", 2457);
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2459);
var len = array.length;

    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2461);
from = +from || 0;
    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2462);
from = (from > 0 || -1) * Math.floor(Math.abs(from));

    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2464);
if (from < 0) {
        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2465);
from += len;

        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2467);
if (from < 0) {
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2468);
from = 0;
        }
    }

    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2472);
for (; from < len; ++from) {
        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2473);
if (from in array && array[from] === value) {
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2474);
return from;
        }
    }

    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2478);
return -1;
};

/**
Numeric sort convenience function.

The native `Array.prototype.sort()` function converts values to strings and
sorts them in lexicographic order, which is unsuitable for sorting numeric
values. Provide `Array.numericSort` as a custom sort function when you want
to sort values in numeric order.

@example

    [42, 23, 8, 16, 4, 15].sort(Y.Array.numericSort);
    // => [4, 8, 15, 16, 23, 42]

@method numericSort
@param {Number} a First value to compare.
@param {Number} b Second value to compare.
@return {Number} Difference between _a_ and _b_.
@static
**/
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2500);
YArray.numericSort = function (a, b) {
    _yuitest_coverfunc("build/yui-nodejs/yui-nodejs.js", "numericSort", 2500);
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2501);
return a - b;
};

/**
Executes the supplied function on each item in the array. Returning a truthy
value from the function will stop the processing of remaining items.

@method some
@param {Array} array Array to iterate over.
@param {Function} fn Function to execute on each item. The function will receive
  the following arguments:
    @param {Any} fn.value Current array item.
    @param {Number} fn.index Current array index.
    @param {Array} fn.array Array being iterated over.
@param {Object} [thisObj] `this` object to use when calling _fn_.
@return {Boolean} `true` if the function returns a truthy value on any of the
  items in the array; `false` otherwise.
@static
**/
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2520);
YArray.some = Lang._isNative(Native.some) ? function (array, fn, thisObj) {
    _yuitest_coverfunc("build/yui-nodejs/yui-nodejs.js", "(anonymous 16)", 2520);
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2521);
return Native.some.call(array, fn, thisObj);
} : function (array, fn, thisObj) {
    _yuitest_coverfunc("build/yui-nodejs/yui-nodejs.js", "}", 2522);
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2523);
for (var i = 0, len = array.length; i < len; ++i) {
        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2524);
if (i in array && fn.call(thisObj, array[i], i, array)) {
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2525);
return true;
        }
    }

    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2529);
return false;
};

/**
Evaluates _obj_ to determine if it's an array, an array-like collection, or
something else. This is useful when working with the function `arguments`
collection and `HTMLElement` collections.

Note: This implementation doesn't consider elements that are also
collections, such as `<form>` and `<select>`, to be array-like.

@method test
@param {Object} obj Object to test.
@return {Number} A number indicating the results of the test:

  * 0: Neither an array nor an array-like collection.
  * 1: Real array.
  * 2: Array-like collection.

@static
**/
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2550);
YArray.test = function (obj) {
    _yuitest_coverfunc("build/yui-nodejs/yui-nodejs.js", "test", 2550);
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2551);
var result = 0;

    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2553);
if (Lang.isArray(obj)) {
        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2554);
result = 1;
    } else {_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2555);
if (Lang.isObject(obj)) {
        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2556);
try {
            // indexed, but no tagName (element) or scrollTo/document (window. From DOM.isWindow test which we can't use here),
            // or functions without apply/call (Safari
            // HTMLElementCollection bug).
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2560);
if ('length' in obj && !obj.tagName && !(obj.scrollTo && obj.document) && !obj.apply) {
                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2561);
result = 2;
            }
        } catch (ex) {}
    }}

    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2566);
return result;
};
/**
 * The YUI module contains the components required for building the YUI
 * seed file.  This includes the script loading mechanism, a simple queue,
 * and the core utilities for the library.
 * @module yui
 * @submodule yui-base
 */

/**
 * A simple FIFO queue.  Items are added to the Queue with add(1..n items) and
 * removed using next().
 *
 * @class Queue
 * @constructor
 * @param {MIXED} item* 0..n items to seed the queue.
 */
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2584);
function Queue() {
    _yuitest_coverfunc("build/yui-nodejs/yui-nodejs.js", "Queue", 2584);
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2585);
this._init();
    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2586);
this.add.apply(this, arguments);
}

_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2589);
Queue.prototype = {
    /**
     * Initialize the queue
     *
     * @method _init
     * @protected
     */
    _init: function() {
        /**
         * The collection of enqueued items
         *
         * @property _q
         * @type Array
         * @protected
         */
        _yuitest_coverfunc("build/yui-nodejs/yui-nodejs.js", "_init", 2596);
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2604);
this._q = [];
    },

    /**
     * Get the next item in the queue. FIFO support
     *
     * @method next
     * @return {MIXED} the next item in the queue.
     */
    next: function() {
        _yuitest_coverfunc("build/yui-nodejs/yui-nodejs.js", "next", 2613);
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2614);
return this._q.shift();
    },

    /**
     * Get the last in the queue. LIFO support.
     *
     * @method last
     * @return {MIXED} the last item in the queue.
     */
    last: function() {
        _yuitest_coverfunc("build/yui-nodejs/yui-nodejs.js", "last", 2623);
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2624);
return this._q.pop();
    },

    /**
     * Add 0..n items to the end of the queue.
     *
     * @method add
     * @param {MIXED} item* 0..n items.
     * @return {object} this queue.
     */
    add: function() {
        _yuitest_coverfunc("build/yui-nodejs/yui-nodejs.js", "add", 2634);
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2635);
this._q.push.apply(this._q, arguments);

        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2637);
return this;
    },

    /**
     * Returns the current number of queued items.
     *
     * @method size
     * @return {Number} The size.
     */
    size: function() {
        _yuitest_coverfunc("build/yui-nodejs/yui-nodejs.js", "size", 2646);
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2647);
return this._q.length;
    }
};

_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2651);
Y.Queue = Queue;

_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2653);
YUI.Env._loaderQueue = YUI.Env._loaderQueue || new Queue();

/**
The YUI module contains the components required for building the YUI seed file.
This includes the script loading mechanism, a simple queue, and the core
utilities for the library.

@module yui
@submodule yui-base
**/

_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2664);
var CACHED_DELIMITER = '__',

    hasOwn   = Object.prototype.hasOwnProperty,
    isObject = Y.Lang.isObject;

/**
Returns a wrapper for a function which caches the return value of that function,
keyed off of the combined string representation of the argument values provided
when the wrapper is called.

Calling this function again with the same arguments will return the cached value
rather than executing the wrapped function.

Note that since the cache is keyed off of the string representation of arguments
passed to the wrapper function, arguments that aren't strings and don't provide
a meaningful `toString()` method may result in unexpected caching behavior. For
example, the objects `{}` and `{foo: 'bar'}` would both be converted to the
string `[object Object]` when used as a cache key.

@method cached
@param {Function} source The function to memoize.
@param {Object} [cache={}] Object in which to store cached values. You may seed
  this object with pre-existing cached values if desired.
@param {any} [refetch] If supplied, this value is compared with the cached value
  using a `==` comparison. If the values are equal, the wrapped function is
  executed again even though a cached value exists.
@return {Function} Wrapped function.
@for YUI
**/
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2693);
Y.cached = function (source, cache, refetch) {
    _yuitest_coverfunc("build/yui-nodejs/yui-nodejs.js", "cached", 2693);
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2694);
cache || (cache = {});

    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2696);
return function (arg) {
        _yuitest_coverfunc("build/yui-nodejs/yui-nodejs.js", "(anonymous 17)", 2696);
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2697);
var key = arguments.length > 1 ?
                Array.prototype.join.call(arguments, CACHED_DELIMITER) :
                String(arg);

        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2701);
if (!(key in cache) || (refetch && cache[key] == refetch)) {
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2702);
cache[key] = source.apply(source, arguments);
        }

        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2705);
return cache[key];
    };
};

/**
Returns the `location` object from the window/frame in which this YUI instance
operates, or `undefined` when executing in a non-browser environment
(e.g. Node.js).

It is _not_ recommended to hold references to the `window.location` object
outside of the scope of a function in which its properties are being accessed or
its methods are being called. This is because of a nasty bug/issue that exists
in both Safari and MobileSafari browsers:
[WebKit Bug 34679](https://bugs.webkit.org/show_bug.cgi?id=34679).

@method getLocation
@return {location} The `location` object from the window/frame in which this YUI
    instance operates.
@since 3.5.0
**/
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2725);
Y.getLocation = function () {
    // It is safer to look this up every time because yui-base is attached to a
    // YUI instance before a user's config is applied; i.e. `Y.config.win` does
    // not point the correct window object when this file is loaded.
    _yuitest_coverfunc("build/yui-nodejs/yui-nodejs.js", "getLocation", 2725);
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2729);
var win = Y.config.win;

    // It is not safe to hold a reference to the `location` object outside the
    // scope in which it is being used. The WebKit engine used in Safari and
    // MobileSafari will "disconnect" the `location` object from the `window`
    // when a page is restored from back/forward history cache.
    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2735);
return win && win.location;
};

/**
Returns a new object containing all of the properties of all the supplied
objects. The properties from later objects will overwrite those in earlier
objects.

Passing in a single object will create a shallow copy of it. For a deep copy,
use `clone()`.

@method merge
@param {Object} objects* One or more objects to merge.
@return {Object} A new merged object.
**/
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2750);
Y.merge = function () {
    _yuitest_coverfunc("build/yui-nodejs/yui-nodejs.js", "merge", 2750);
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2751);
var i      = 0,
        len    = arguments.length,
        result = {},
        key,
        obj;

    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2757);
for (; i < len; ++i) {
        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2758);
obj = arguments[i];

        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2760);
for (key in obj) {
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2761);
if (hasOwn.call(obj, key)) {
                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2762);
result[key] = obj[key];
            }
        }
    }

    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2767);
return result;
};

/**
Mixes _supplier_'s properties into _receiver_.

Properties on _receiver_ or _receiver_'s prototype will not be overwritten or
shadowed unless the _overwrite_ parameter is `true`, and will not be merged
unless the _merge_ parameter is `true`.

In the default mode (0), only properties the supplier owns are copied (prototype
properties are not copied). The following copying modes are available:

  * `0`: _Default_. Object to object.
  * `1`: Prototype to prototype.
  * `2`: Prototype to prototype and object to object.
  * `3`: Prototype to object.
  * `4`: Object to prototype.

@method mix
@param {Function|Object} receiver The object or function to receive the mixed
  properties.
@param {Function|Object} supplier The object or function supplying the
  properties to be mixed.
@param {Boolean} [overwrite=false] If `true`, properties that already exist
  on the receiver will be overwritten with properties from the supplier.
@param {String[]} [whitelist] An array of property names to copy. If
  specified, only the whitelisted properties will be copied, and all others
  will be ignored.
@param {Number} [mode=0] Mix mode to use. See above for available modes.
@param {Boolean} [merge=false] If `true`, objects and arrays that already
  exist on the receiver will have the corresponding object/array from the
  supplier merged into them, rather than being skipped or overwritten. When
  both _overwrite_ and _merge_ are `true`, _merge_ takes precedence.
@return {Function|Object|YUI} The receiver, or the YUI instance if the
  specified receiver is falsy.
**/
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2804);
Y.mix = function(receiver, supplier, overwrite, whitelist, mode, merge) {
    _yuitest_coverfunc("build/yui-nodejs/yui-nodejs.js", "mix", 2804);
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2805);
var alwaysOverwrite, exists, from, i, key, len, to;

    // If no supplier is given, we return the receiver. If no receiver is given,
    // we return Y. Returning Y doesn't make much sense to me, but it's
    // grandfathered in for backcompat reasons.
    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2810);
if (!receiver || !supplier) {
        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2811);
return receiver || Y;
    }

    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2814);
if (mode) {
        // In mode 2 (prototype to prototype and object to object), we recurse
        // once to do the proto to proto mix. The object to object mix will be
        // handled later on.
        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2818);
if (mode === 2) {
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2819);
Y.mix(receiver.prototype, supplier.prototype, overwrite,
                    whitelist, 0, merge);
        }

        // Depending on which mode is specified, we may be copying from or to
        // the prototypes of the supplier and receiver.
        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2825);
from = mode === 1 || mode === 3 ? supplier.prototype : supplier;
        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2826);
to   = mode === 1 || mode === 4 ? receiver.prototype : receiver;

        // If either the supplier or receiver doesn't actually have a
        // prototype property, then we could end up with an undefined `from`
        // or `to`. If that happens, we abort and return the receiver.
        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2831);
if (!from || !to) {
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2832);
return receiver;
        }
    } else {
        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2835);
from = supplier;
        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2836);
to   = receiver;
    }

    // If `overwrite` is truthy and `merge` is falsy, then we can skip a
    // property existence check on each iteration and save some time.
    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2841);
alwaysOverwrite = overwrite && !merge;

    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2843);
if (whitelist) {
        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2844);
for (i = 0, len = whitelist.length; i < len; ++i) {
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2845);
key = whitelist[i];

            // We call `Object.prototype.hasOwnProperty` instead of calling
            // `hasOwnProperty` on the object itself, since the object's
            // `hasOwnProperty` method may have been overridden or removed.
            // Also, some native objects don't implement a `hasOwnProperty`
            // method.
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2852);
if (!hasOwn.call(from, key)) {
                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2853);
continue;
            }

            // The `key in to` check here is (sadly) intentional for backwards
            // compatibility reasons. It prevents undesired shadowing of
            // prototype members on `to`.
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2859);
exists = alwaysOverwrite ? false : key in to;

            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2861);
if (merge && exists && isObject(to[key], true)
                    && isObject(from[key], true)) {
                // If we're in merge mode, and the key is present on both
                // objects, and the value on both objects is either an object or
                // an array (but not a function), then we recurse to merge the
                // `from` value into the `to` value instead of overwriting it.
                //
                // Note: It's intentional that the whitelist isn't passed to the
                // recursive call here. This is legacy behavior that lots of
                // code still depends on.
                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2871);
Y.mix(to[key], from[key], overwrite, null, 0, merge);
            } else {_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2872);
if (overwrite || !exists) {
                // We're not in merge mode, so we'll only copy the `from` value
                // to the `to` value if we're in overwrite mode or if the
                // current key doesn't exist on the `to` object.
                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2876);
to[key] = from[key];
            }}
        }
    } else {
        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2880);
for (key in from) {
            // The code duplication here is for runtime performance reasons.
            // Combining whitelist and non-whitelist operations into a single
            // loop or breaking the shared logic out into a function both result
            // in worse performance, and Y.mix is critical enough that the byte
            // tradeoff is worth it.
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2886);
if (!hasOwn.call(from, key)) {
                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2887);
continue;
            }

            // The `key in to` check here is (sadly) intentional for backwards
            // compatibility reasons. It prevents undesired shadowing of
            // prototype members on `to`.
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2893);
exists = alwaysOverwrite ? false : key in to;

            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2895);
if (merge && exists && isObject(to[key], true)
                    && isObject(from[key], true)) {
                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2897);
Y.mix(to[key], from[key], overwrite, null, 0, merge);
            } else {_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2898);
if (overwrite || !exists) {
                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2899);
to[key] = from[key];
            }}
        }

        // If this is an IE browser with the JScript enumeration bug, force
        // enumeration of the buggy properties by making a recursive call with
        // the buggy properties as the whitelist.
        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2906);
if (Y.Object._hasEnumBug) {
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2907);
Y.mix(to, from, overwrite, Y.Object._forceEnum, mode, merge);
        }
    }

    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2911);
return receiver;
};
/**
 * The YUI module contains the components required for building the YUI
 * seed file.  This includes the script loading mechanism, a simple queue,
 * and the core utilities for the library.
 * @module yui
 * @submodule yui-base
 */

/**
 * Adds utilities to the YUI instance for working with objects.
 *
 * @class Object
 */

_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2927);
var Lang   = Y.Lang,
    hasOwn = Object.prototype.hasOwnProperty,

    UNDEFINED, // <-- Note the comma. We're still declaring vars.

/**
 * Returns a new object that uses _obj_ as its prototype. This method wraps the
 * native ES5 `Object.create()` method if available, but doesn't currently
 * pass through `Object.create()`'s second argument (properties) in order to
 * ensure compatibility with older browsers.
 *
 * @method ()
 * @param {Object} obj Prototype object.
 * @return {Object} New object using _obj_ as its prototype.
 * @static
 */
O = Y.Object = Lang._isNative(Object.create) ? function (obj) {
    // We currently wrap the native Object.create instead of simply aliasing it
    // to ensure consistency with our fallback shim, which currently doesn't
    // support Object.create()'s second argument (properties). Once we have a
    // safe fallback for the properties arg, we can stop wrapping
    // Object.create().
    _yuitest_coverfunc("build/yui-nodejs/yui-nodejs.js", "(anonymous 18)", 2943);
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2949);
return Object.create(obj);
} : (function () {
    // Reusable constructor function for the Object.create() shim.
    _yuitest_coverfunc("build/yui-nodejs/yui-nodejs.js", "(anonymous 19)", 2950);
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2952);
function F() {}

    // The actual shim.
    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2955);
return function (obj) {
        _yuitest_coverfunc("build/yui-nodejs/yui-nodejs.js", "(anonymous 20)", 2955);
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2956);
F.prototype = obj;
        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 2957);
return new F();
    };
}()),

/**
 * Property names that IE doesn't enumerate in for..in loops, even when they
 * should be enumerable. When `_hasEnumBug` is `true`, it's necessary to
 * manually enumerate these properties.
 *
 * @property _forceEnum
 * @type String[]
 * @protected
 * @static
 */
forceEnum = O._forceEnum = [
    'hasOwnProperty',
    'isPrototypeOf',
    'propertyIsEnumerable',
    'toString',
    'toLocaleString',
    'valueOf'
],

/**
 * `true` if this browser has the JScript enumeration bug that prevents
 * enumeration of the properties named in the `_forceEnum` array, `false`
 * otherwise.
 *
 * See:
 *   - <https://developer.mozilla.org/en/ECMAScript_DontEnum_attribute#JScript_DontEnum_Bug>
 *   - <http://whattheheadsaid.com/2010/10/a-safer-object-keys-compatibility-implementation>
 *
 * @property _hasEnumBug
 * @type Boolean
 * @protected
 * @static
 */
hasEnumBug = O._hasEnumBug = !{valueOf: 0}.propertyIsEnumerable('valueOf'),

/**
 * `true` if this browser incorrectly considers the `prototype` property of
 * functions to be enumerable. Currently known to affect Opera 11.50.
 *
 * @property _hasProtoEnumBug
 * @type Boolean
 * @protected
 * @static
 */
hasProtoEnumBug = O._hasProtoEnumBug = (function () {}).propertyIsEnumerable('prototype'),

/**
 * Returns `true` if _key_ exists on _obj_, `false` if _key_ doesn't exist or
 * exists only on _obj_'s prototype. This is essentially a safer version of
 * `obj.hasOwnProperty()`.
 *
 * @method owns
 * @param {Object} obj Object to test.
 * @param {String} key Property name to look for.
 * @return {Boolean} `true` if _key_ exists on _obj_, `false` otherwise.
 * @static
 */
owns = O.owns = function (obj, key) {
    _yuitest_coverfunc("build/yui-nodejs/yui-nodejs.js", "owns", 3018);
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3019);
return !!obj && hasOwn.call(obj, key);
}; // <-- End of var declarations.

/**
 * Alias for `owns()`.
 *
 * @method hasKey
 * @param {Object} obj Object to test.
 * @param {String} key Property name to look for.
 * @return {Boolean} `true` if _key_ exists on _obj_, `false` otherwise.
 * @static
 */
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3031);
O.hasKey = owns;

/**
 * Returns an array containing the object's enumerable keys. Does not include
 * prototype keys or non-enumerable keys.
 *
 * Note that keys are returned in enumeration order (that is, in the same order
 * that they would be enumerated by a `for-in` loop), which may not be the same
 * as the order in which they were defined.
 *
 * This method is an alias for the native ES5 `Object.keys()` method if
 * available.
 *
 * @example
 *
 *     Y.Object.keys({a: 'foo', b: 'bar', c: 'baz'});
 *     // => ['a', 'b', 'c']
 *
 * @method keys
 * @param {Object} obj An object.
 * @return {String[]} Array of keys.
 * @static
 */
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3054);
O.keys = Lang._isNative(Object.keys) ? Object.keys : function (obj) {
    _yuitest_coverfunc("build/yui-nodejs/yui-nodejs.js", "keys", 3054);
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3055);
if (!Lang.isObject(obj)) {
        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3056);
throw new TypeError('Object.keys called on a non-object');
    }

    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3059);
var keys = [],
        i, key, len;

    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3062);
if (hasProtoEnumBug && typeof obj === 'function') {
        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3063);
for (key in obj) {
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3064);
if (owns(obj, key) && key !== 'prototype') {
                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3065);
keys.push(key);
            }
        }
    } else {
        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3069);
for (key in obj) {
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3070);
if (owns(obj, key)) {
                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3071);
keys.push(key);
            }
        }
    }

    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3076);
if (hasEnumBug) {
        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3077);
for (i = 0, len = forceEnum.length; i < len; ++i) {
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3078);
key = forceEnum[i];

            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3080);
if (owns(obj, key)) {
                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3081);
keys.push(key);
            }
        }
    }

    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3086);
return keys;
};

/**
 * Returns an array containing the values of the object's enumerable keys.
 *
 * Note that values are returned in enumeration order (that is, in the same
 * order that they would be enumerated by a `for-in` loop), which may not be the
 * same as the order in which they were defined.
 *
 * @example
 *
 *     Y.Object.values({a: 'foo', b: 'bar', c: 'baz'});
 *     // => ['foo', 'bar', 'baz']
 *
 * @method values
 * @param {Object} obj An object.
 * @return {Array} Array of values.
 * @static
 */
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3106);
O.values = function (obj) {
    _yuitest_coverfunc("build/yui-nodejs/yui-nodejs.js", "values", 3106);
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3107);
var keys   = O.keys(obj),
        i      = 0,
        len    = keys.length,
        values = [];

    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3112);
for (; i < len; ++i) {
        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3113);
values.push(obj[keys[i]]);
    }

    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3116);
return values;
};

/**
 * Returns the number of enumerable keys owned by an object.
 *
 * @method size
 * @param {Object} obj An object.
 * @return {Number} The object's size.
 * @static
 */
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3127);
O.size = function (obj) {
    _yuitest_coverfunc("build/yui-nodejs/yui-nodejs.js", "size", 3127);
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3128);
try {
        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3129);
return O.keys(obj).length;
    } catch (ex) {
        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3131);
return 0; // Legacy behavior for non-objects.
    }
};

/**
 * Returns `true` if the object owns an enumerable property with the specified
 * value.
 *
 * @method hasValue
 * @param {Object} obj An object.
 * @param {any} value The value to search for.
 * @return {Boolean} `true` if _obj_ contains _value_, `false` otherwise.
 * @static
 */
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3145);
O.hasValue = function (obj, value) {
    _yuitest_coverfunc("build/yui-nodejs/yui-nodejs.js", "hasValue", 3145);
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3146);
return Y.Array.indexOf(O.values(obj), value) > -1;
};

/**
 * Executes a function on each enumerable property in _obj_. The function
 * receives the value, the key, and the object itself as parameters (in that
 * order).
 *
 * By default, only properties owned by _obj_ are enumerated. To include
 * prototype properties, set the _proto_ parameter to `true`.
 *
 * @method each
 * @param {Object} obj Object to enumerate.
 * @param {Function} fn Function to execute on each enumerable property.
 *   @param {mixed} fn.value Value of the current property.
 *   @param {String} fn.key Key of the current property.
 *   @param {Object} fn.obj Object being enumerated.
 * @param {Object} [thisObj] `this` object to use when calling _fn_.
 * @param {Boolean} [proto=false] Include prototype properties.
 * @return {YUI} the YUI instance.
 * @chainable
 * @static
 */
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3169);
O.each = function (obj, fn, thisObj, proto) {
    _yuitest_coverfunc("build/yui-nodejs/yui-nodejs.js", "each", 3169);
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3170);
var key;

    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3172);
for (key in obj) {
        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3173);
if (proto || owns(obj, key)) {
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3174);
fn.call(thisObj || Y, obj[key], key, obj);
        }
    }

    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3178);
return Y;
};

/**
 * Executes a function on each enumerable property in _obj_, but halts if the
 * function returns a truthy value. The function receives the value, the key,
 * and the object itself as paramters (in that order).
 *
 * By default, only properties owned by _obj_ are enumerated. To include
 * prototype properties, set the _proto_ parameter to `true`.
 *
 * @method some
 * @param {Object} obj Object to enumerate.
 * @param {Function} fn Function to execute on each enumerable property.
 *   @param {mixed} fn.value Value of the current property.
 *   @param {String} fn.key Key of the current property.
 *   @param {Object} fn.obj Object being enumerated.
 * @param {Object} [thisObj] `this` object to use when calling _fn_.
 * @param {Boolean} [proto=false] Include prototype properties.
 * @return {Boolean} `true` if any execution of _fn_ returns a truthy value,
 *   `false` otherwise.
 * @static
 */
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3201);
O.some = function (obj, fn, thisObj, proto) {
    _yuitest_coverfunc("build/yui-nodejs/yui-nodejs.js", "some", 3201);
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3202);
var key;

    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3204);
for (key in obj) {
        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3205);
if (proto || owns(obj, key)) {
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3206);
if (fn.call(thisObj || Y, obj[key], key, obj)) {
                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3207);
return true;
            }
        }
    }

    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3212);
return false;
};

/**
 * Retrieves the sub value at the provided path,
 * from the value object provided.
 *
 * @method getValue
 * @static
 * @param o The object from which to extract the property value.
 * @param path {Array} A path array, specifying the object traversal path
 * from which to obtain the sub value.
 * @return {Any} The value stored in the path, undefined if not found,
 * undefined if the source is not an object.  Returns the source object
 * if an empty path is provided.
 */
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3228);
O.getValue = function(o, path) {
    _yuitest_coverfunc("build/yui-nodejs/yui-nodejs.js", "getValue", 3228);
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3229);
if (!Lang.isObject(o)) {
        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3230);
return UNDEFINED;
    }

    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3233);
var i,
        p = Y.Array(path),
        l = p.length;

    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3237);
for (i = 0; o !== UNDEFINED && i < l; i++) {
        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3238);
o = o[p[i]];
    }

    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3241);
return o;
};

/**
 * Sets the sub-attribute value at the provided path on the
 * value object.  Returns the modified value object, or
 * undefined if the path is invalid.
 *
 * @method setValue
 * @static
 * @param o             The object on which to set the sub value.
 * @param path {Array}  A path array, specifying the object traversal path
 *                      at which to set the sub value.
 * @param val {Any}     The new value for the sub-attribute.
 * @return {Object}     The modified object, with the new sub value set, or
 *                      undefined, if the path was invalid.
 */
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3258);
O.setValue = function(o, path, val) {
    _yuitest_coverfunc("build/yui-nodejs/yui-nodejs.js", "setValue", 3258);
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3259);
var i,
        p = Y.Array(path),
        leafIdx = p.length - 1,
        ref = o;

    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3264);
if (leafIdx >= 0) {
        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3265);
for (i = 0; ref !== UNDEFINED && i < leafIdx; i++) {
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3266);
ref = ref[p[i]];
        }

        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3269);
if (ref !== UNDEFINED) {
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3270);
ref[p[i]] = val;
        } else {
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3272);
return UNDEFINED;
        }
    }

    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3276);
return o;
};

/**
 * Returns `true` if the object has no enumerable properties of its own.
 *
 * @method isEmpty
 * @param {Object} obj An object.
 * @return {Boolean} `true` if the object is empty.
 * @static
 * @since 3.2.0
 */
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3288);
O.isEmpty = function (obj) {
    _yuitest_coverfunc("build/yui-nodejs/yui-nodejs.js", "isEmpty", 3288);
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3289);
return !O.keys(Object(obj)).length;
};
/**
 * The YUI module contains the components required for building the YUI seed
 * file.  This includes the script loading mechanism, a simple queue, and the
 * core utilities for the library.
 * @module yui
 * @submodule yui-base
 */

/**
 * YUI user agent detection.
 * Do not fork for a browser if it can be avoided.  Use feature detection when
 * you can.  Use the user agent as a last resort.  For all fields listed
 * as @type float, UA stores a version number for the browser engine,
 * 0 otherwise.  This value may or may not map to the version number of
 * the browser using the engine.  The value is presented as a float so
 * that it can easily be used for boolean evaluation as well as for
 * looking for a particular range of versions.  Because of this,
 * some of the granularity of the version info may be lost.  The fields that
 * are @type string default to null.  The API docs list the values that
 * these fields can have.
 * @class UA
 * @static
 */

/**
* Static method on `YUI.Env` for parsing a UA string.  Called at instantiation
* to populate `Y.UA`.
*
* @static
* @method parseUA
* @param {String} [subUA=navigator.userAgent] UA string to parse
* @return {Object} The Y.UA object
*/
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3324);
YUI.Env.parseUA = function(subUA) {

    _yuitest_coverfunc("build/yui-nodejs/yui-nodejs.js", "parseUA", 3324);
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3326);
var numberify = function(s) {
            _yuitest_coverfunc("build/yui-nodejs/yui-nodejs.js", "numberify", 3326);
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3327);
var c = 0;
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3328);
return parseFloat(s.replace(/\./g, function() {
                _yuitest_coverfunc("build/yui-nodejs/yui-nodejs.js", "(anonymous 22)", 3328);
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3329);
return (c++ === 1) ? '' : '.';
            }));
        },

        win = Y.config.win,

        nav = win && win.navigator,

        o = {

        /**
         * Internet Explorer version number or 0.  Example: 6
         * @property ie
         * @type float
         * @static
         */
        ie: 0,

        /**
         * Opera version number or 0.  Example: 9.2
         * @property opera
         * @type float
         * @static
         */
        opera: 0,

        /**
         * Gecko engine revision number.  Will evaluate to 1 if Gecko
         * is detected but the revision could not be found. Other browsers
         * will be 0.  Example: 1.8
         * <pre>
         * Firefox 1.0.0.4: 1.7.8   <-- Reports 1.7
         * Firefox 1.5.0.9: 1.8.0.9 <-- 1.8
         * Firefox 2.0.0.3: 1.8.1.3 <-- 1.81
         * Firefox 3.0   <-- 1.9
         * Firefox 3.5   <-- 1.91
         * </pre>
         * @property gecko
         * @type float
         * @static
         */
        gecko: 0,

        /**
         * AppleWebKit version.  KHTML browsers that are not WebKit browsers
         * will evaluate to 1, other browsers 0.  Example: 418.9
         * <pre>
         * Safari 1.3.2 (312.6): 312.8.1 <-- Reports 312.8 -- currently the
         *                                   latest available for Mac OSX 10.3.
         * Safari 2.0.2:         416     <-- hasOwnProperty introduced
         * Safari 2.0.4:         418     <-- preventDefault fixed
         * Safari 2.0.4 (419.3): 418.9.1 <-- One version of Safari may run
         *                                   different versions of webkit
         * Safari 2.0.4 (419.3): 419     <-- Tiger installations that have been
         *                                   updated, but not updated
         *                                   to the latest patch.
         * Webkit 212 nightly:   522+    <-- Safari 3.0 precursor (with native
         * SVG and many major issues fixed).
         * Safari 3.0.4 (523.12) 523.12  <-- First Tiger release - automatic
         * update from 2.x via the 10.4.11 OS patch.
         * Webkit nightly 1/2008:525+    <-- Supports DOMContentLoaded event.
         *                                   yahoo.com user agent hack removed.
         * </pre>
         * http://en.wikipedia.org/wiki/Safari_version_history
         * @property webkit
         * @type float
         * @static
         */
        webkit: 0,

        /**
         * Safari will be detected as webkit, but this property will also
         * be populated with the Safari version number
         * @property safari
         * @type float
         * @static
         */
        safari: 0,

        /**
         * Chrome will be detected as webkit, but this property will also
         * be populated with the Chrome version number
         * @property chrome
         * @type float
         * @static
         */
        chrome: 0,

        /**
         * The mobile property will be set to a string containing any relevant
         * user agent information when a modern mobile browser is detected.
         * Currently limited to Safari on the iPhone/iPod Touch, Nokia N-series
         * devices with the WebKit-based browser, and Opera Mini.
         * @property mobile
         * @type string
         * @default null
         * @static
         */
        mobile: null,

        /**
         * Adobe AIR version number or 0.  Only populated if webkit is detected.
         * Example: 1.0
         * @property air
         * @type float
         */
        air: 0,
        /**
         * PhantomJS version number or 0.  Only populated if webkit is detected.
         * Example: 1.0
         * @property phantomjs
         * @type float
         */
        phantomjs: 0,
        /**
         * Detects Apple iPad's OS version
         * @property ipad
         * @type float
         * @static
         */
        ipad: 0,
        /**
         * Detects Apple iPhone's OS version
         * @property iphone
         * @type float
         * @static
         */
        iphone: 0,
        /**
         * Detects Apples iPod's OS version
         * @property ipod
         * @type float
         * @static
         */
        ipod: 0,
        /**
         * General truthy check for iPad, iPhone or iPod
         * @property ios
         * @type Boolean
         * @default null
         * @static
         */
        ios: null,
        /**
         * Detects Googles Android OS version
         * @property android
         * @type float
         * @static
         */
        android: 0,
        /**
         * Detects Kindle Silk
         * @property silk
         * @type float
         * @static
         */
        silk: 0,
        /**
         * Detects Kindle Silk Acceleration
         * @property accel
         * @type Boolean
         * @static
         */
        accel: false,
        /**
         * Detects Palms WebOS version
         * @property webos
         * @type float
         * @static
         */
        webos: 0,

        /**
         * Google Caja version number or 0.
         * @property caja
         * @type float
         */
        caja: nav && nav.cajaVersion,

        /**
         * Set to true if the page appears to be in SSL
         * @property secure
         * @type boolean
         * @static
         */
        secure: false,

        /**
         * The operating system.  Currently only detecting windows or macintosh
         * @property os
         * @type string
         * @default null
         * @static
         */
        os: null,

        /**
         * The Nodejs Version
         * @property nodejs
         * @type float
         * @default 0
         * @static
         */
        nodejs: 0,
        /*
        * Window8/IE10 Application host environment
        * @property winjs
        * @type Boolean
        * @static
        */
        winjs: !!((typeof Windows !== "undefined") && Windows.System),
        /**
        * Are touch/msPointer events available on this device
        * @property touchEnabled
        * @type Boolean
        * @static
        */
        touchEnabled: false
    },

    ua = subUA || nav && nav.userAgent,

    loc = win && win.location,

    href = loc && loc.href,

    m;

    /**
    * The User Agent string that was parsed
    * @property userAgent
    * @type String
    * @static
    */
    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3563);
o.userAgent = ua;


    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3566);
o.secure = href && (href.toLowerCase().indexOf('https') === 0);

    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3568);
if (ua) {

        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3570);
if ((/windows|win32/i).test(ua)) {
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3571);
o.os = 'windows';
        } else {_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3572);
if ((/macintosh|mac_powerpc/i).test(ua)) {
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3573);
o.os = 'macintosh';
        } else {_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3574);
if ((/android/i).test(ua)) {
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3575);
o.os = 'android';
        } else {_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3576);
if ((/symbos/i).test(ua)) {
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3577);
o.os = 'symbos';
        } else {_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3578);
if ((/linux/i).test(ua)) {
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3579);
o.os = 'linux';
        } else {_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3580);
if ((/rhino/i).test(ua)) {
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3581);
o.os = 'rhino';
        }}}}}}

        // Modern KHTML browsers should qualify as Safari X-Grade
        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3585);
if ((/KHTML/).test(ua)) {
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3586);
o.webkit = 1;
        }
        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3588);
if ((/IEMobile|XBLWP7/).test(ua)) {
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3589);
o.mobile = 'windows';
        }
        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3591);
if ((/Fennec/).test(ua)) {
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3592);
o.mobile = 'gecko';
        }
        // Modern WebKit browsers are at least X-Grade
        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3595);
m = ua.match(/AppleWebKit\/([^\s]*)/);
        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3596);
if (m && m[1]) {
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3597);
o.webkit = numberify(m[1]);
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3598);
o.safari = o.webkit;

            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3600);
if (/PhantomJS/.test(ua)) {
                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3601);
m = ua.match(/PhantomJS\/([^\s]*)/);
                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3602);
if (m && m[1]) {
                    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3603);
o.phantomjs = numberify(m[1]);
                }
            }

            // Mobile browser check
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3608);
if (/ Mobile\//.test(ua) || (/iPad|iPod|iPhone/).test(ua)) {
                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3609);
o.mobile = 'Apple'; // iPhone or iPod Touch

                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3611);
m = ua.match(/OS ([^\s]*)/);
                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3612);
if (m && m[1]) {
                    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3613);
m = numberify(m[1].replace('_', '.'));
                }
                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3615);
o.ios = m;
                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3616);
o.os = 'ios';
                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3617);
o.ipad = o.ipod = o.iphone = 0;

                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3619);
m = ua.match(/iPad|iPod|iPhone/);
                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3620);
if (m && m[0]) {
                    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3621);
o[m[0].toLowerCase()] = o.ios;
                }
            } else {
                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3624);
m = ua.match(/NokiaN[^\/]*|webOS\/\d\.\d/);
                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3625);
if (m) {
                    // Nokia N-series, webOS, ex: NokiaN95
                    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3627);
o.mobile = m[0];
                }
                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3629);
if (/webOS/.test(ua)) {
                    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3630);
o.mobile = 'WebOS';
                    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3631);
m = ua.match(/webOS\/([^\s]*);/);
                    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3632);
if (m && m[1]) {
                        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3633);
o.webos = numberify(m[1]);
                    }
                }
                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3636);
if (/ Android/.test(ua)) {
                    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3637);
if (/Mobile/.test(ua)) {
                        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3638);
o.mobile = 'Android';
                    }
                    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3640);
m = ua.match(/Android ([^\s]*);/);
                    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3641);
if (m && m[1]) {
                        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3642);
o.android = numberify(m[1]);
                    }

                }
                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3646);
if (/Silk/.test(ua)) {
                    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3647);
m = ua.match(/Silk\/([^\s]*)\)/);
                    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3648);
if (m && m[1]) {
                        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3649);
o.silk = numberify(m[1]);
                    }
                    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3651);
if (!o.android) {
                        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3652);
o.android = 2.34; //Hack for desktop mode in Kindle
                        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3653);
o.os = 'Android';
                    }
                    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3655);
if (/Accelerated=true/.test(ua)) {
                        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3656);
o.accel = true;
                    }
                }
            }

            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3661);
m = ua.match(/(Chrome|CrMo|CriOS)\/([^\s]*)/);
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3662);
if (m && m[1] && m[2]) {
                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3663);
o.chrome = numberify(m[2]); // Chrome
                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3664);
o.safari = 0; //Reset safari back to 0
                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3665);
if (m[1] === 'CrMo') {
                    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3666);
o.mobile = 'chrome';
                }
            } else {
                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3669);
m = ua.match(/AdobeAIR\/([^\s]*)/);
                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3670);
if (m) {
                    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3671);
o.air = m[0]; // Adobe AIR 1.0 or better
                }
            }
        }

        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3676);
if (!o.webkit) { // not webkit
// @todo check Opera/8.01 (J2ME/MIDP; Opera Mini/2.0.4509/1316; fi; U; ssr)
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3678);
if (/Opera/.test(ua)) {
                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3679);
m = ua.match(/Opera[\s\/]([^\s]*)/);
                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3680);
if (m && m[1]) {
                    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3681);
o.opera = numberify(m[1]);
                }
                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3683);
m = ua.match(/Version\/([^\s]*)/);
                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3684);
if (m && m[1]) {
                    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3685);
o.opera = numberify(m[1]); // opera 10+
                }

                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3688);
if (/Opera Mobi/.test(ua)) {
                    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3689);
o.mobile = 'opera';
                    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3690);
m = ua.replace('Opera Mobi', '').match(/Opera ([^\s]*)/);
                    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3691);
if (m && m[1]) {
                        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3692);
o.opera = numberify(m[1]);
                    }
                }
                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3695);
m = ua.match(/Opera Mini[^;]*/);

                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3697);
if (m) {
                    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3698);
o.mobile = m[0]; // ex: Opera Mini/2.0.4509/1316
                }
            } else { // not opera or webkit
                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3701);
m = ua.match(/MSIE\s([^;]*)/);
                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3702);
if (m && m[1]) {
                    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3703);
o.ie = numberify(m[1]);
                } else { // not opera, webkit, or ie
                    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3705);
m = ua.match(/Gecko\/([^\s]*)/);
                    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3706);
if (m) {
                        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3707);
o.gecko = 1; // Gecko detected, look for revision
                        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3708);
m = ua.match(/rv:([^\s\)]*)/);
                        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3709);
if (m && m[1]) {
                            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3710);
o.gecko = numberify(m[1]);
                        }
                    }
                }
            }
        }
    }

    //Check for known properties to tell if touch events are enabled on this device or if
    //the number of MSPointer touchpoints on this device is greater than 0.
    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3720);
if (win && nav && !(o.chrome && o.chrome < 6)) {
        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3721);
o.touchEnabled = (("ontouchstart" in win) || (("msMaxTouchPoints" in nav) && (nav.msMaxTouchPoints > 0)));
    }

    //It was a parsed UA, do not assign the global value.
    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3725);
if (!subUA) {

        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3727);
if (typeof process === 'object') {

            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3729);
if (process.versions && process.versions.node) {
                //NodeJS
                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3731);
o.os = process.platform;
                _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3732);
o.nodejs = numberify(process.versions.node);
            }
        }

        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3736);
YUI.Env.UA = o;

    }

    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3740);
return o;
};


_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3744);
Y.UA = YUI.Env.UA || YUI.Env.parseUA();

/**
Performs a simple comparison between two version numbers, accounting for
standard versioning logic such as the fact that "535.8" is a lower version than
"535.24", even though a simple numerical comparison would indicate that it's
greater. Also accounts for cases such as "1.1" vs. "1.1.0", which are
considered equivalent.

Returns -1 if version _a_ is lower than version _b_, 0 if they're equivalent,
1 if _a_ is higher than _b_.

Versions may be numbers or strings containing numbers and dots. For example,
both `535` and `"535.8.10"` are acceptable. A version string containing
non-numeric characters, like `"535.8.beta"`, may produce unexpected results.

@method compareVersions
@param {Number|String} a First version number to compare.
@param {Number|String} b Second version number to compare.
@return -1 if _a_ is lower than _b_, 0 if they're equivalent, 1 if _a_ is
    higher than _b_.
**/
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3766);
Y.UA.compareVersions = function (a, b) {
    _yuitest_coverfunc("build/yui-nodejs/yui-nodejs.js", "compareVersions", 3766);
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3767);
var aPart, aParts, bPart, bParts, i, len;

    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3769);
if (a === b) {
        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3770);
return 0;
    }

    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3773);
aParts = (a + '').split('.');
    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3774);
bParts = (b + '').split('.');

    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3776);
for (i = 0, len = Math.max(aParts.length, bParts.length); i < len; ++i) {
        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3777);
aPart = parseInt(aParts[i], 10);
        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3778);
bPart = parseInt(bParts[i], 10);

        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3780);
isNaN(aPart) && (aPart = 0);
        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3781);
isNaN(bPart) && (bPart = 0);

        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3783);
if (aPart < bPart) {
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3784);
return -1;
        }

        _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3787);
if (aPart > bPart) {
            _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3788);
return 1;
        }
    }

    _yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3792);
return 0;
};
_yuitest_coverline("build/yui-nodejs/yui-nodejs.js", 3794);
YUI.Env.aliases = {
    "anim": ["anim-base","anim-color","anim-curve","anim-easing","anim-node-plugin","anim-scroll","anim-xy"],
    "anim-shape-transform": ["anim-shape"],
    "app": ["app-base","app-content","app-transitions","lazy-model-list","model","model-list","model-sync-rest","router","view","view-node-map"],
    "attribute": ["attribute-base","attribute-complex"],
    "autocomplete": ["autocomplete-base","autocomplete-sources","autocomplete-list","autocomplete-plugin"],
    "base": ["base-base","base-pluginhost","base-build"],
    "cache": ["cache-base","cache-offline","cache-plugin"],
    "collection": ["array-extras","arraylist","arraylist-add","arraylist-filter","array-invoke"],
    "controller": ["router"],
    "dataschema": ["dataschema-base","dataschema-json","dataschema-xml","dataschema-array","dataschema-text"],
    "datasource": ["datasource-local","datasource-io","datasource-get","datasource-function","datasource-cache","datasource-jsonschema","datasource-xmlschema","datasource-arrayschema","datasource-textschema","datasource-polling"],
    "datatable": ["datatable-core","datatable-table","datatable-head","datatable-body","datatable-base","datatable-column-widths","datatable-message","datatable-mutable","datatable-sort","datatable-datasource"],
    "datatable-deprecated": ["datatable-base-deprecated","datatable-datasource-deprecated","datatable-sort-deprecated","datatable-scroll-deprecated"],
    "datatype": ["datatype-date","datatype-number","datatype-xml"],
    "datatype-date": ["datatype-date-parse","datatype-date-format","datatype-date-math"],
    "datatype-number": ["datatype-number-parse","datatype-number-format"],
    "datatype-xml": ["datatype-xml-parse","datatype-xml-format"],
    "dd": ["dd-ddm-base","dd-ddm","dd-ddm-drop","dd-drag","dd-proxy","dd-constrain","dd-drop","dd-scroll","dd-delegate"],
    "dom": ["dom-base","dom-screen","dom-style","selector-native","selector"],
    "editor": ["frame","editor-selection","exec-command","editor-base","editor-para","editor-br","editor-bidi","editor-tab","createlink-base"],
    "event": ["event-base","event-delegate","event-synthetic","event-mousewheel","event-mouseenter","event-key","event-focus","event-resize","event-hover","event-outside","event-touch","event-move","event-flick","event-valuechange","event-tap"],
    "event-custom": ["event-custom-base","event-custom-complex"],
    "event-gestures": ["event-flick","event-move"],
    "handlebars": ["handlebars-compiler"],
    "highlight": ["highlight-base","highlight-accentfold"],
    "history": ["history-base","history-hash","history-hash-ie","history-html5"],
    "io": ["io-base","io-xdr","io-form","io-upload-iframe","io-queue"],
    "json": ["json-parse","json-stringify"],
    "loader": ["loader-base","loader-rollup","loader-yui3"],
    "node": ["node-base","node-event-delegate","node-pluginhost","node-screen","node-style"],
    "pluginhost": ["pluginhost-base","pluginhost-config"],
    "querystring": ["querystring-parse","querystring-stringify"],
    "recordset": ["recordset-base","recordset-sort","recordset-filter","recordset-indexer"],
    "resize": ["resize-base","resize-proxy","resize-constrain"],
    "slider": ["slider-base","slider-value-range","clickable-rail","range-slider"],
    "text": ["text-accentfold","text-wordbreak"],
    "widget": ["widget-base","widget-htmlparser","widget-skin","widget-uievents"]
};


}, '3.7.3', {"use": ["yui-base", "get", "features", "intl-base", "yui-log", "yui-log-nodejs", "yui-later", "loader-base", "loader-rollup", "loader-yui3"]});
