/*
 * Copyright (c) 2011-2012, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */


/*jslint anon:true, sloppy:true, nomen:true*/
/*global YUI*/

YUI.add('mojito-loader', function(Y, NAME) {

    // IE has a limit of 2048-character long URLs.
    var MAX_URL_LENGTH = 2000;

    function Loader(appConfig, prefix) {
        // Y.log('ctor()', 'mojito', NAME);
        this.appConfig = appConfig;
        this.prefix = prefix || ''; // optional
    }


    Loader.prototype = {

        load: function(paths, cb) {
            var self = this,
                mod,
                script,
                scriptsToLoad = {},
                loaded = 0;

            paths = paths || {};
            if (!Y.Object.size(paths)) {
                cb();
                return;
            }

            for (mod in paths) {
                if (paths.hasOwnProperty(mod)) {
                    if (!YUI.Env.mods[mod]) {
                        script = paths[mod];
                        if (/\.js$/i.test(script)) {
                            if ('/' === script.charAt(0)) {
                                script = this.prefix + script;
                            }
                            scriptsToLoad[script] = true;
                        }
                    }
                }
            }
            scriptsToLoad = Y.Object.keys(scriptsToLoad);
            if (!scriptsToLoad.length) {
                return cb();
            }

            Y.log('loading ' + scriptsToLoad.join(', '), 'mojito', NAME);

            Y.Get.script(scriptsToLoad, {
                async: true,

                onSuccess: function() {
                    Y.log('SUCCESS', 'mojito', NAME);
                    cb();
                },

                onFailure: function() {
                    Y.log('FAILURE', 'warn', NAME);
                    var err = new Error('Failed to load URLs:  ' +
                            scriptsToLoad.join(', '));
                    cb(err);
                }
            });
        },


        _createURLlist: function(base, list) {
            var url, urls = [],
                newPart, newLength;
            if (!list.length) {
                return [];
            }
            url = base + list.shift();
            while (list.length) {
                newPart = list.shift();
                newLength = url.length + 1 + newPart.length;
                if (newLength > MAX_URL_LENGTH) {
                    urls.push(url);
                    url = base + newPart;
                } else {
                    url += '&' + newPart;
                }
            }
            urls.push(url);
            return urls;
        },



        // this also pulls in dependencies
        createYuiLibComboUrl: function(modules, filter) {
            var required = {},
                comboJsParts = [],
                comboCssParts = [],
                loader,
                filterDef,
                filterDefSearchExp,
                i,
                name,
                info,
                filteredPath,
                combo = { js: [], css: [] };

            filter = filter || 'min';

            loader = new Y.Loader({});
            for (i = 0; i < modules.length; i += 1) {
                name = modules[i];
                required[name] = true;
            }
            loader.ignoreRegistered = true;
            loader.calculate({required: required});

            // workaround for a bug fixed in yui-3.5.0
            Object.keys(loader.moduleInfo).forEach(function(module) {
                var m = loader.moduleInfo[module];
                YUI.Env._renderedMods[module] = m;
            });

            filterDef = loader.FILTER_DEFS[filter.toUpperCase()];
            if (filterDef) {
                filterDefSearchExp = new RegExp(filterDef.searchExp);
            }

            for (i = 0; i < loader.sorted.length; i += 1) {
                name = loader.sorted[i];
                if (('parallel' !== name) && (name.indexOf('nodejs') === -1)) {
                    info = loader.moduleInfo[name];
                    if (info) {
                        filteredPath = (filterDef) ?
                                info.path.replace(filterDefSearchExp,
                                    filterDef.replaceStr) :
                                info.path;

                        if ('lang/datatype-date' === name) {
                            // this one is messed up
                            filteredPath = 'datatype/lang/datatype-date.js';
                        }

                        if ('js' === info.type) {
                            comboJsParts.push(loader.root + filteredPath);
                        } else if ('css' === info.type) {
                            comboCssParts.push(loader.root + filteredPath);
                        }
                    }
                }
            }
            combo.js = this._createURLlist(loader.comboBase, comboJsParts);
            combo.css = this._createURLlist(loader.comboBase, comboCssParts);
            return combo;
        }
    };

    Y.namespace('mojito').Loader = Loader;

}, '0.1.0', {requires: [
    'get',
    'mojito'
]});
