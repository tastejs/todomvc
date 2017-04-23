/*
 * Copyright (c) 2011-2012, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */


/*jslint anon:true, sloppy:true, nomen:true*/
/*global YUI*/


/**
 * This object is responsible for running mojits.
 * @class MojitoDispatcher
 * @constructor
 * @param {ServerStore} resourceStore the store to use.
 * @private
 */
YUI.add('mojito-dispatcher', function(Y, NAME) {

    var loader,
        logger,
        store,
        CACHE = {
            YUI: {},
            controllerContexts: {}
        },
        // TODO: [Issue 112] remove client detection logic
        cacheControllerContext = (typeof window !== 'undefined'),
        coreYuiModules = [],
        usePrecomputed,
        useOnDemand,
        appShareYUIInstance;


    /**
     * Modifies the YUI modules in the instance to point to the correct
     * language.
     *
     * @method fixupInstanceLang
     * @param {string} lang target language.
     * @param {Object} instance mojit instance (results of expandInstance()).
     * @private
     */
    function fixupInstanceLang(type, lang, instance) {
        var fixedSorted = [],
            fixedSortedPaths = {},
            bestLang = Y.Intl.lookupBestLang(lang,
                Y.Object.keys(instance.yui.langs)),
            suffix = (bestLang) ? '_' + bestLang : '',
            OK = {},
            fixedMod,
            fixedPath;

        // hard fallbacks if no "root" bundle
        if (!bestLang && !instance.yui.langs['']) {
            if (instance.yui.langs.en) {
                bestLang = 'en';
                suffix = '_en';
            }
            if (!bestLang && instance.yui.langs['en-US']) {
                bestLang = 'en-US';
                suffix = '_en-US';
            }
        }

        OK['lang/' + type + suffix] = true;
        if (suffix) {
            OK['lang/datatype-date-format' + suffix] = true;
        } else {
            // The "root" (no lang) version doesn't contain aggregates like %x.
            OK['lang/datatype-date-format_en'] = true;
        }

        Y.Array.each(instance.yui.sorted, function(mod) {
            if ('lang/' === mod.substring(0, 5)) {
                if (OK[mod]) {
                    fixedSorted.push(mod);
                }
            } else {
                fixedSorted.push(mod);
            }
        });
        Y.Object.each(instance.yui.sortedPaths, function(path, mod) {
            if ('lang/' === mod.substring(0, 5)) {
                if (OK[mod]) {
                    fixedSortedPaths[mod] = path;
                }
            } else {
                fixedSortedPaths[mod] = path;
            }
        });

        instance.yui.sorted = fixedSorted;
        instance.yui.sortedPaths = fixedSortedPaths;
    }


    /* Optimization methods:

    ============ 1). YUI({bootstrap:false}).use('*')

    You'll get optimal performance by adding the js files (in order) to the
    page, and using YUI({bootstrap:false}).use('*') instead of
    Y.use(moduleList).

    This will stop loader from calculating dependencies and assume everything
    which is required is already on the page.
    Additionally adding the scripts in order will mean there's less re-sorting
    which needs to be done as each module gets attached.

    POTENTIAL ISSUE:
    For mojito, since you have multiple Y instances, Y.use('*') may be a
    concern - since it's saying use everything currently on the page, so all
    your mojit instances will have all your modules attached.
    However, you could still use this for the global mojito framework Y
    instance, or for the shared modules (modules common to all mojits) and then
    use Y.use(additionalModules) for the rest.

    ============ 2). YUI({bootstrap:false}).use(sortedModuleList)
    The next step down in terms of performance would be to use
    YUI({bootstrap:false}).use(sortedModuleList) instead of Y.use('*'), so you
    still have instances with separate modules, but there's less (re)sorting
    required while attaching.

    ============ 3).
    You could also set the sorted list of shared modules (modules common to all
    mojits) as the core modules required for *ALL* your Y instances, using the
    core config property:

    http://developer.yahoo.com/yui/3/api/config.html#property_core

    It seems like 3 would be the easiest first optimization step to get in
    place to see if it provides benefits.
    */

    /* See docs for the dispatch function in action-context.common.js */
    function dispatch(command, adapter) {
        logger.log('dispatching command for ' +
            (command.instance.base || '@' + command.instance.type) + '.' +
            command.action, 'mojito', 'qeperf');
        var instance = command.instance,
            cc = cacheControllerContext ?
                    CACHE.controllerContexts[instance.instanceId] :
                    null;

        if (cc) {
            logger.log('using cached controller context: ' +
                instance.instanceId, 'info', NAME);
            cc.invoke(command, adapter);
            return;
        }

        logger.log('expanding partial mojit instance', 'mojito', 'qeperf');

        // Convert the command partial instance to a full instance. Note
        // instance here means dictionary that's either fully populated or
        // not. When it's expanded it contains all the data from the resource
        // store which is needed to ensure it can be invoked/dispatched.
        store.expandInstance(command.instance, command.context,
            function(err, instance) {

                // if there is no action, make 'index' the default
                if (!command.action) {
                    // use instance config for default action or 'index'
                    command.action = instance.action || 'index';
                }

                var instanceYuiCacheKey,
                    instanceYuiCacheObj,
                    ctxKey;

                if (err) {
                    if (adapter.error) {
                        adapter.error(err);
                    } else {
                        logger.log('WARNING!! Uncaught error from dispatch' +
                            ' on instance \'' + (command.instance.id || '@' +
                            command.instance.type) + '\'', 'error', NAME);
                        logger.log(err.message, 'error', NAME);
                        logger.log(err.stack, 'error', NAME);
                        // TODO: [Issue 67] adapter.done() so the
                        // request doesn't hang open.
                    }
                    return;
                }

                logger.log('mojit instance expansion complete: ' +
                    instance.instanceId, 'mojito', 'qeperf');

                // We replace the given instance with the expanded instance
                command.instance = instance;

                if (appShareYUIInstance && instance.shareYUIInstance) {
                    instanceYuiCacheKey = 'singleton';
                } else {
                    // Generate a cache key
                    // TODO: [Issue 68] Can we create this key
                    // faster? from the request contextualizer?
                    instanceYuiCacheKey = [];
                    for (ctxKey in command.context) {
                        if (command.context.hasOwnProperty(ctxKey) &&
                                command.context[ctxKey]) {
                            instanceYuiCacheKey.push(ctxKey + '=' +
                                command.context[ctxKey]);
                        }
                    }
                    instanceYuiCacheKey = instance.type + '?' +
                        instanceYuiCacheKey.join('&');
                }


                function runMojit() {
                    var moduleList,
                        mojitYuiModules;

                    fixupInstanceLang(command.instance.type, command.context.lang, instance);

                    moduleList = (usePrecomputed ?
                            instance.yui.sorted :
                            instance.yui.requires);
                    // gotta copy this or else it pollutes the client runtime
                    mojitYuiModules = Y.mojito.util.copy(moduleList);

                    // We are set so log our final list and use() it
                    logger.log('Dispatching an instance of \'' +
                        (instance.id || '@' + instance.type) + '/' +
                        command.action + '\' with the modules: [' +
                        mojitYuiModules.join(', ') + ']', 'info', NAME);

                    logger.log('dispatching instance of \'' +
                        instance.instanceId + '/' + command.action + '\'',
                        'mojito',
                        'qeperf'
                        );

                    // Create the function that will be called in YUI().use()
                    // pushing the runner function onto the tail of the YUI
                    // module listing
                    mojitYuiModules.push(function(MOJIT_Y) {
                        logger.log('YUI used: ' + instance.instanceId,
                            'mojito',
                            'qeperf');

                        logger.log('Creating controller context', 'info',
                            NAME);
                        cc = new Y.mojito.ControllerContext({
                            instance: instance,
                            Y: MOJIT_Y,
                            store: store,
                            appShareYUIInstance: appShareYUIInstance,
                            dispatch: dispatch
                        });
                        logger.log('caching controller context: ' +
                            instance.instanceId, 'info', NAME);
                        if (cacheControllerContext) {
                            CACHE.controllerContexts[instance.instanceId] = cc;
                        }

                        cc.invoke(command, adapter);

                    });

                    // Time marker
                    Y.mojito.perf.mark('mojito', 'core_dispatch_start[' +
                        (instance.id || '@' + instance.type) + ':' +
                        command.action + ']', 'Dispatching an instance of \'' +
                        (instance.id || '@' + instance.type) + '/' +
                        command.action + '\'');

                    // Now we call YUI use() with our modules array
                    // This is the same as doing; YUI().use(arrayOfModules,
                    // function(Y){});

                    // Although Y.use should be asynch, it is not entirely
                    // asynch. The files are read asynch, but the loader
                    // calculations are not.

                    // Putting this use statement within setTimeout apparently
                    // prevents it from blocking the event loop, but it can
                    // also execute the runner function against a different
                    // request.

                    logger.log('YUI use: ' + instance.instanceId, 'mojito',
                        'qeperf');

                    instanceYuiCacheObj.use.apply(instanceYuiCacheObj,
                        mojitYuiModules);
                }


                function modulesLoaded(cb) {

                    var groups = {},
                        groupKey = 'mojit-' + instance.type,
                        instanceYuiConfig;

                    // TODO: [Issue 69] Replace the mojit groups
                    // defined in index.js's configureYUI() function with
                    // this?

                    //logger.log('YUI instance creation: ' +
                    //    instance.instanceId, mojito', 'qeperf');

                    instanceYuiCacheObj = CACHE.YUI[instanceYuiCacheKey];

                    if (!instanceYuiCacheObj) {

                        instanceYuiConfig = {
                            //debug: true,
                            //filter: 'debug',
                            bootstrap: useOnDemand,
                            // This is a list of preferred langs
                            lang: command.context.langs,
                            core: coreYuiModules
                        };

                        instanceYuiCacheObj = CACHE.YUI[instanceYuiCacheKey] =
                            YUI(instanceYuiConfig);

                        logger.log('YUI instance created: ' +
                            instance.instanceId,
                            'mojito',
                            'qeperf'
                            );
                        logger.log('Cached a YUI instance with key: \'' +
                            instanceYuiCacheKey + '\'', 'mojito', NAME);
                    } else {
                        logger.log('Using cached YUI instance from key:' +
                            instanceYuiCacheKey, 'mojito', 'qeperf');
                    }

                    // To handle both shared and new instance instead of having
                    // if/elses.
                    groups[groupKey] = instance.yui.config;
                    instanceYuiCacheObj.applyConfig({groups: groups});

                    cb();
                }

                // Get the cached YUI instance (if there is one)
                if (!(appShareYUIInstance && instance.shareYUIInstance)) {
                    instanceYuiCacheObj = CACHE.YUI[instanceYuiCacheKey];
                }

                /*
                 * We cache a YUI instance for each Mojit type requested.
                 * Doing this gives a huge performance benefit at the
                 * cost of a larger memory foot print.
                 */
                if (instanceYuiCacheObj) {
                    runMojit();
                } else if (!usePrecomputed) {
                    modulesLoaded(runMojit);
                } else {

                    logger.log('loading YUI modules for YUI instantiation: ' +
                        instance.instanceId, 'mojito', 'qeperf');

                    loader.load(instance.yui.sortedPaths, function(err) {
                        if (err) {
                            logger.log(err.message, 'error', NAME);
                            adapter.error(err);
                            return;
                        }
                        modulesLoaded(runMojit);
                    });
                }
            });
    }


    /*
     * the dispatcher must receive the global logger up front, because it is
     * loaded within a Y instance that has the original Y.log function, so in
     * order to have consistent logging, the Mojito logger is passed in and we
     * use it.
     */
    Y.namespace('mojito').Dispatcher = {

        init: function(resourceStore, coreMojitoYuiModules, globalLogger,
                globalLoader) {
            var appConfigStatic;

            if (!resourceStore) {
                throw new Error(
                    'Mojito cannot instantiate without a resource store'
                );
            }

            store = resourceStore;
            coreYuiModules = coreMojitoYuiModules || [];
            logger = globalLogger;
            loader = globalLoader;

            logger.log('Dispatcher created', 'debug', NAME);

            appConfigStatic = store.getAppConfig({}, 'application');

            appShareYUIInstance = (false !== appConfigStatic.shareYUIInstance);
            usePrecomputed = appConfigStatic.yui && (-1 !==
                appConfigStatic.yui.dependencyCalculations.indexOf('precomputed'));
            useOnDemand = appConfigStatic.yui && (-1 !==
                appConfigStatic.yui.dependencyCalculations.indexOf('ondemand'));
            if (!usePrecomputed) {
                useOnDemand = true;
            }

            if (useOnDemand) {
                coreYuiModules.push('loader');
            }

            return this;
        },


        // Assign outer function here.
        dispatch: dispatch
    };

}, '0.1.0', {requires: [
    'mojito-controller-context',
    'mojito-util',
    'mojito-resource-store-adapter',
    'intl'
]});
