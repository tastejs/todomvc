/*
 * Copyright (c) 2011-2012, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */


/*jslint anon:true, sloppy:true, nomen:true*/
/*global YUI*/


/**
 * @module ActionContextAddon
 */
YUI.add('mojito-deploy-addon', function(Y, NAME) {

    var fs = require('fs'),
        yuiFilter = 'min',
        minify;


    if (YUI._mojito && YUI._mojito.DEBUG) {
        yuiFilter = 'debug';
    }


    // TODO: [Issue 64] improve this, it's a poor man's minify.
    // a. build minification into static handler?
    // b. build minification into prod-build script ?
    // c. build minification into server-start?
    minify = function(str) {
        // Remove comment blocks /* ... */ and
        // remove white space at the start of lines
        return str.replace(/\/\*[\s\S]*?\*\//g, '').
            replace(/^[ \t\r\n]+/gm, '');
    };


    /**
     * <strong>Access point:</strong> <em>ac.deploy.*</em>
     * Provides ability to create client runtime deployment HTML
     * @class Deploy.server
     */
    function Addon(command, adapter, ac) {
        this.instance = command.instance;
        this.scripts = {};
        this.ac = ac;
    }


    Addon.prototype = {

        namespace: 'deploy',

        /**
         * Declaration of store requirement.
         * @method setStore
         * @private
         * @param {ResourceStore} rs The resource store instance.
         */
        setStore: function(rs) {
            this.rs = rs;
            if (rs) {
                Y.log('Initialized and activated with Resource Store', 'info',
                        NAME);
            }
        },

        /**
         * Builds up the browser Mojito runtime.
         * @method constructMojitoClientRuntime
         * @param {AssetHandler} assetHandler asset handler used to add scripts
         *     to the DOM under construction.
         * @param {object} binderMap information about the binders that will be
         *     deployed to the client.
         */
        constructMojitoClientRuntime: function(assetHandler, binderMap) {

            //Y.log('Constructing Mojito client runtime', 'debug', NAME);

            var store = this.rs,
                contextServer = this.ac.context,
                appConfigServer = store.getAppConfig(contextServer,
                    'application'),
                contextClient,
                appConfigClient,
                yuiConfig = {},
                yuiConfigEscaped,
                yuiConfigStr,
                yuiModules,
                loader,
                yuiCombo,
                yuiJsUrls = [],
                yuiCssUrls = [],
                yuiJsUrlContains = {},
                viewId,
                binder,
                i,
                id,
                instances = {},
                clientConfig = {},
                clientConfigEscaped,
                clientConfigStr,
                usePrecomputed,
                useOnDemand,
                initialModuleList,
                initializer, // script for YUI initialization
                routeMaker,
                type,
                module,
                path,
                pathToRoot;

            contextClient = Y.mojito.util.copy(contextServer);
            contextClient.runtime = 'client';
            appConfigClient = store.getAppConfig(contextClient, 'application');
            clientConfig.context = contextClient;

            if (appConfigClient.yui && appConfigClient.yui.config) {
                yuiConfig = appConfigClient.yui.config;
            }
            yuiConfig.lang = contextServer.lang; // same as contextClient.lang
            yuiConfig.core = yuiConfig.core || [];
            yuiConfig.core = yuiConfig.core.concat(
                ['get', 'features', 'intl-base', 'yui-log', 'mojito',
                    'yui-later']
            );

            // If we have a "base" for YUI use it
            if (appConfigClient.yui && appConfigClient.yui.base) {
                yuiConfig.base = appConfigClient.yui.base;
                yuiConfig.combine = false;
            }

            // If we know where yui "Loader" is tell YUI
            if (appConfigClient.yui && appConfigClient.yui.loader) {
                yuiConfig.loaderPath = appConfigClient.yui.loader;
            }

            clientConfig.store = store.serializeClientStore(contextClient,
                instances);

            usePrecomputed = appConfigServer.yui &&
                appConfigServer.yui.dependencyCalculations && (-1 !==
                appConfigServer.yui.dependencyCalculations.indexOf(
                        'precomputed'
                    ));
            useOnDemand = appConfigServer.yui &&
                appConfigServer.yui.dependencyCalculations && (-1 !==
                appConfigServer.yui.dependencyCalculations.indexOf(
                        'ondemand'
                    ));
            if (!usePrecomputed) {
                useOnDemand = true;
            }

            // Set the YUI URL to use on the client (This has to be done
            // before any other scripts are added)
            if (appConfigClient.yui && appConfigClient.yui.url) {
                yuiJsUrls.push(appConfigClient.yui.url);
                // Since the user has given their own rollup of YUI library
                // modules, we need some way of knowing which YUI library
                // modules went into that rollup.
                if (Y.Lang.isArray(appConfigClient.yui.urlContains)) {
                    for (i = 0; i < appConfigClient.yui.urlContains.length;
                            i += 1) {
                        yuiJsUrlContains[appConfigClient.yui.urlContains[i]] =
                            true;
                    }
                }
            } else {
                // YUI 3.4.1 doesn't have actual rollup files, so we need to
                // specify all the parts directly.
                yuiModules = ['yui-base'];
                yuiJsUrlContains['yui-base'] = true;
                yuiModules = ['yui'];
                yuiJsUrlContains.yui = true;
                if (useOnDemand) {
                    yuiModules.push('get');
                    yuiJsUrlContains.get = true;
                    yuiModules.push('loader-base');
                    yuiJsUrlContains['loader-base'] = true;
                    yuiModules.push('loader-rollup');
                    yuiJsUrlContains['loader-rollup'] = true;
                    yuiModules.push('loader-yui3');
                    yuiJsUrlContains['loader-yui3'] = true;
                    for (i = 0; i < store.store._fwConfig.
                            ondemandBaseYuiModules.length; i += 1) {
                        module =
                            store.store._fwConfig.ondemandBaseYuiModules[i];
                        yuiModules.push(module);
                        yuiJsUrlContains[module] = true;
                    }
                }
                if (appConfigClient.yui && appConfigClient.yui.extraModules) {
                    for (i = 0; i < appConfigClient.yui.extraModules.length;
                            i += 1) {
                        yuiModules.push(appConfigClient.yui.extraModules[i]);
                        yuiJsUrlContains[
                            appConfigClient.yui.extraModules[i]
                        ] = true;
                    }
                }
                for (viewId in binderMap) {
                    if (binderMap.hasOwnProperty(viewId)) {
                        binder = binderMap[viewId];
                        for (module in binder.needs) {
                            if (binder.needs.hasOwnProperty(module)) {
                                path = binder.needs[module];
                                // Anything we don't know about we'll assume is
                                // a YUI library module.
                                if (!store.fileFromStaticHandlerURL(path)) {
                                    yuiModules.push(module);
                                    yuiJsUrlContains[module] = true;
                                }
                            }
                        }
                    }
                }

                loader = new Y.mojito.Loader(appConfigClient);
                yuiCombo = loader.createYuiLibComboUrl(yuiModules, yuiFilter);
                yuiJsUrls = yuiCombo.js;
                yuiCssUrls = yuiCombo.css;
            }
            for (i = 0; i < yuiJsUrls.length; i += 1) {
                this.addScript('top', yuiJsUrls[i]);
            }
            // defaults to true if missing
            if (!yuiConfig.hasOwnProperty('fetchCSS') || yuiConfig.fetchCSS) {
                for (i = 0; i < yuiCssUrls.length; i += 1) {
                    assetHandler.addCss(yuiCssUrls[i], 'top');
                }
            }

            // add mojito bootstrap
            // With "precomputed" the scripts are listed as binder dependencies
            // and thus loaded that way.  However, with "ondemand" we'll use
            // the YUI loader which we haven't (yet) taught where to find the
            // fw & app scripts.
            if (useOnDemand) {
                // add all framework-level and app-level code
                this.addScripts('bottom', store.getYuiConfigFw('client',
                    contextClient).modules);
                this.addScripts('bottom', store.getYuiConfigApp('client',
                    contextClient).modules);
            }

            // add binders' dependencies
            for (viewId in binderMap) {
                if (binderMap.hasOwnProperty(viewId)) {
                    binder = binderMap[viewId];
                    for (module in binder.needs) {
                        if (binder.needs.hasOwnProperty(module)) {
                            if (!yuiJsUrlContains[module]) {
                                this.addScript('bottom', binder.needs[module]);
                            }
                        }
                    }
                }
            }

            clientConfig.binderMap = binderMap;

            // TODO: [Issue 65] Split the app config in to server client
            // sections.
            // we need the app config on the client for log levels (at least)
            clientConfig.appConfig = clientConfig.store.appConfig;

            // this is mainly used by html5app
            pathToRoot = this.ac.http.getHeader('x-mojito-build-path-to-root');
            if (pathToRoot) {
                clientConfig.pathToRoot = pathToRoot;
            }

            // TODO -- decide if this is necessary, since
            // clientConfig.store.mojits is currently unpopulated
            /*
            for (type in clientConfig.store.mojits) {
                for (i in clientConfig.store.mojits[type].yui.sorted) {
                    module = clientConfig.store.mojits[type].yui.sorted[i];
                    path = clientConfig.store.mojits[type].yui.sortedPaths[
                        module];
                    this.scripts[path] = 'bottom';
                }
            }
            */

            routeMaker = new Y.mojito.RouteMaker(clientConfig.store.routes);
            clientConfig.routes = routeMaker.getComputedRoutes();
            delete clientConfig.store;

            initialModuleList = "'*'";
            if (useOnDemand) {
                initialModuleList = "'mojito-client'";
            }

            // Unicode escape the various strings in the config data to help
            // fight against possible script injection attacks.
            yuiConfigEscaped = Y.mojito.util.cleanse(yuiConfig);
            yuiConfigStr = Y.JSON.stringify(yuiConfigEscaped);
            clientConfigEscaped = Y.mojito.util.cleanse(clientConfig);
            clientConfigStr = Y.JSON.stringify(clientConfigEscaped);

            initializer = '<script type="text/javascript">\n' +
                '    YUI_config = ' + yuiConfigStr + ';\n' +
                '    YUI().use(' + initialModuleList + ', function(Y) {\n' +
                '    window.YMojito = { client: new Y.mojito.Client(' +
                clientConfigStr + ') };\n' +
                '        });\n' +
                '</script>\n';

            // Add all the scripts we have collected
            assetHandler.addAssets(
                this.getScripts(appConfigServer.embedJsFilesInHtmlFrame)
            );
            // Add the boot script
            assetHandler.addAsset('blob', 'bottom', initializer);
        },


        addScript: function(position, path) {
            this.scripts[path] = position;
        },


        addScripts: function(position, modules) {
            var i;
            for (i in modules) {
                if (modules.hasOwnProperty(i)) {
                    this.scripts[modules[i].fullpath] = position;
                }
            }
        },


        /**
         * TODO: [Issue 66] This can be made faster with a single for
         * loop and caching.
         *
         * Note: A single SCRIPT tag containing all the JS on the pages is
         * slower than many SCRIPT tags (checked on iPad only).
         * @method getScripts
         * @private
         * @param {bool} embed Should returned scripts be embedded in script
         *     tags.
         * @return {object} An object containing script descriptors.
         */
        getScripts: function(embed) {
            var i,
                x,
                assets = {},
                blob = {
                    type: 'blob',
                    position: 'bottom',
                    content: ''
                };

            // Walk over the scripts and check what we can do
            for (i in this.scripts) {
                if (this.scripts.hasOwnProperty(i)) {
                    if (embed && this.rs._staticURLs[i]) {
                        //blob.content+= fs.readFileSync(this.rs._staticURLs[i],
                        //      'utf8');
                        //delete this.scripts[i];
                        this.scripts[i] = {
                            type: 'blob',
                            position: 'bottom',
                            content: '<script type="text/javascript">' +
                                minify(fs.readFileSync(this.rs._staticURLs[i],
                                    'utf8')) + '</script>'
                        };
                    } else {
                        this.scripts[i] = {
                            type: 'js',
                            position: this.scripts[i],
                            content: i
                        };
                    }
                }
            }


            // Convert the scripts to the Assets format
            for (x in this.scripts) {
                if (this.scripts.hasOwnProperty(x)) {
                    if (!assets[this.scripts[x].position]) {
                        assets[this.scripts[x].position] = {};
                    }
                    if (!assets[this.scripts[x].position][this.scripts[x].
                            type]) {
                        assets[this.scripts[x].position][this.scripts[x].
                                type] = [];
                    }
                    assets[this.scripts[x].position][this.scripts[x].type].push(
                        this.scripts[x].content
                    );
                }
            }

            return assets;
        }
    };

    Y.namespace('mojito.addons.ac').deploy = Addon;

}, '0.1.0', {requires: [
    'mojito-loader',
    'mojito-util',
    'mojito-http-addon'
]});
