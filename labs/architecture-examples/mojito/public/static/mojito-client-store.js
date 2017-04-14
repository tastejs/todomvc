/*
 * Copyright (c) 2011-2013, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */


/*jslint anon:true, sloppy:true, nomen:true*/
/*global YUI*/


YUI.add('mojito-client-store', function(Y, NAME) {

    var CACHE,
        QUEUED = {},
        queue,
        flushQueue,
        retrieveFile,
        isCompiled,
        trimSlash;

    // TODO: use YUI.namespace()?  use generic caching instead?
    if (!YUI._mojito) {
        YUI._mojito = {};
    }

    if (!YUI._mojito._cache) {
        YUI._mojito._cache = {};
    }

    if (!YUI._mojito._cache.store) {
        YUI._mojito._cache.store = {};
    }

    CACHE = YUI._mojito._cache.store;


    queue = function(url, cb) {
        if (!QUEUED[url]) {
            QUEUED[url] = [];
        }
        QUEUED[url].push(cb);
    };


    flushQueue = function(url, err, data) {
        var i,
            q;

        if (QUEUED[url]) {
            // Copy cb array out into local var to prevent further flushes from
            // looping over it again.  (User-provided callbacks can take a long
            // time to run, and while they are more callbacks can get queued.)
            q = QUEUED[url].splice(0, QUEUED[url].length);
            QUEUED[url] = undefined;
            for (i = 0; i < q.length; i += 1) {
                // We need to give each receiver a separate copy, since the
                // returned data is an -object-, and changes in one will bleed
                // into the others.
                q[i](err, Y.mojito.util.copy(data));
            }
        }
    };


    retrieveFile = function(url, cb) {
        // iOS has a bug that returns "failure" on "success".
        var onComplete = function(id, obj) {
            CACHE[url] = {};
            try {
                CACHE[url] = Y.JSON.parse(obj.responseText);
            } catch (err) {
                flushQueue(url, err);
                return;
            }
            flushQueue(url, null, CACHE[url]);
        };

        // use the cache first
        if (CACHE[url]) {
            // We need to give the receiver a separate copy, since the data is
            // an -object-, and otherwise changes made by receiver will bleed
            // into the cache.
            cb(null, Y.mojito.util.copy(CACHE[url]));
            return;
        }

        if (!QUEUED[url]) {
            Y.io(url, {
                headers: {
                    'x-mojito-header': 'tunnel'
                },
                on: {
                    complete: onComplete
                }
            });
        }
        queue(url, cb);
    };


    isCompiled = function(ns, specName) {
        return YUI._mojito._cache.compiled &&
            YUI._mojito._cache.compiled[ns] &&
            YUI._mojito._cache.compiled[ns].specs &&
            YUI._mojito._cache.compiled[ns].specs[specName];
    };


    trimSlash = function(str) {
        if ('/' === str.charAt(str.length - 1)) {
            return str.substring(0, str.length - 1);
        }
        return str;
    };


    function ClientStore(config) {
        this.appConfig = config.appConfig;
        this.routes = config.routes;
        this.staticContext = config.context;
        this.appConfig.pathToRoot = config.pathToRoot;

        // This value could be an empty string so we have to do a real check.
        this.staticPrefix = '/static';
        if (this.appConfig && this.appConfig.staticHandling &&
                this.appConfig.staticHandling.hasOwnProperty('prefix')) {
            this.staticPrefix = (this.appConfig.staticHandling.prefix ? '/' +
                this.appConfig.staticHandling.prefix : '');
        }

        // Now we do some bad stuff for iOS
        if (typeof window !== 'undefined') {
            this.staticPrefix = Y.mojito.util.iOSUrl(this.staticPrefix) + '/';
        }

        this.staticPrefix = trimSlash(this.staticPrefix);
    }

    ClientStore.prototype = {

        /**
         * This just calls `expandInstanceForEnv()` with `env` set to `client`.
         *
         * @async
         * @method expandInstance
         * @param {map} instance partial instance to expand
         * @param {object} ctx the context
         * @param {function(err,instance)} cb callback used to return the results (or error)
         */
        expandInstance: function(instance, ctx, cb) {
            return this.expandInstanceForEnv('client', instance, ctx, cb);
        },


        /**
         * Expands the instance into all details necessary to dispatch the mojit.
         *
         * @async
         * @method expandInstanceForEnv
         * @param {string} env the runtime environment (either `client` or `server`)
         * @param {map} instance partial instance to expand
         * @param {object} ctx the context
         * @param {function(err,instance)} cb callback used to return the results (or error)
         */
        expandInstanceForEnv: function(env, instance, ctx, cb) {
            var base = {},
                source = {},
                my = this;

            if (!instance.instanceId) {
                instance.instanceId = Y.guid();
                //DEBUGGING:  instance.instanceId += '-instance-common-' +
                //    [instance.base||'', instance.type||''].join('-');
            }

            // What are being asked to expand?
            if (instance.base) {
                source.name = instance.base;
                source.func = this._getSpec;
            } else if (instance.type) {
                source.name = instance.type;
                source.func = this._getType;
            } else {
                // We don't have any inputs so fail
                throw new Error('There was no info in the "instance" object');
            }

            // Here we get either the a spec or a type
            source.func.call(this, env, source.name, ctx, function(err, data) {
                if (err) {
                    cb(err, {});
                    return;
                }

                base = Y.mojito.util.mergeRecursive(data, instance);

                // Ensure the "instance" has been properly resolved. If
                // there are no specs in the application.json file, there is
                // an error below because the instance is invalid. We should
                // check here for a valid instance object and throw an error
                // if it is not. This happens because someone could create a
                // routes.json file with routes that don't route to mojit
                // instances, and the URI router creates invalid commands,
                // which are passed into the dispatch.
                if (!my._validateInstance(base)) {
                    cb(new Error('Instance was not valid. ' + Y.JSON.stringify(base)), {});
                    return;
                }

                cb(null, base);
            });

        },


        /**
         * Returns a contextualized application configuration.
         * @method getAppConfig
         * @param {object} ctx the context
         * @return {object} the application configuration contextualized by the "ctx" argument.
         */
        getAppConfig: function(ctx) {
            return this.appConfig;
        },


        /**
         * Returns the static context used to boot the application.
         * @method getStaticContext
         * @return {object} the static context.
         */
        getStaticContext: function() {
            return this.staticContext;
        },


        /**
         * Returns the static (non-runtime-sensitive) version of the application.json.
         * @method getStaticAppConfig
         * @return {object} the configuration from applications.json
         */
        getStaticAppConfig: function(ctx) {
            return this.appConfig;
        },


        /**
         * Returns the routes configured in the application.
         * @method getRoutes
         * @param {object} ctx the context
         * @return {object} routes
         */
        getRoutes: function(ctx) {
            return this.routes;
        },


        /**
         * Validates the context, and throws an exception if it isn't.
         * @method validateContext
         * @param {object} ctx the context
         * @return {nothing} if this method returns at all then the context is valid
         */
        validateContext: function(ctx) {
            // This is OK since per-context caching (which is the main reason to
            // make sure that the context matches the YCB dimensions) on the
            // client is less sensitive to pollution by application code.
            return true;
        },


        /**
         * Returns, via callback, the fully expanded mojit instance specification.
         *
         * @private
         * @async
         * @method _getSpec
         * @param {string} env the runtime environment (either `client` or `server`)
         * @param {string} id the ID of the spec to return
         * @param {object} ctx the runtime context for the spec
         * @param {function} cb callback used to return the results (or error)
         * @param {Error} cb.err error encountered, or a falsy value if no error
         * @param {object} cb.spec the expanded mojit instance
         */
        _getSpec: function(env, id, context, cb) {
            var parts = id.split(':'),
                typeName = parts[0],
                specName = parts[1] || 'default',
                ns = typeName.replace(/\./g, '_'),
                url;

            // This should really have the tunnelPrefix.  However, that
            // complicates offline apps (from `mojito build html5app`).
            // The mojito-handler-tunnel will be able to handle this URL
            // just fine.
            url = this.staticPrefix + '/' + typeName + '/specs/' + specName +
                '.json';

            url = this._buildUrl(url, context);

            // use the compiled version if there was one built
            if (isCompiled(ns, specName)) {
                CACHE[url] = YUI._mojito._cache.compiled[ns].specs[specName];
                cb(null, CACHE[url]);
                return;
            }

            retrieveFile(url, cb);
        },


        /**
         * Returns, via callback, the details of the mojit type.
         *
         * @private
         * @async
         * @method _getType
         * @param {string} env the runtime environment (either `client` or `server`)
         * @param {string} type the mojit type
         * @param {object} ctx the runtime context for the type
         * @param {function} cb callback used to return the results (or error)
         * @param {Error} cb.err error encountered, or a falsy value if no error
         * @param {object} cb.spec the mojit type details
         */
        _getType: function(env, type, context, cb) {
            // This should really have the tunnelPrefix.  However, that
            // complicates offline apps (from `mojito build html5app`).
            // The mojito-handler-tunnel will be able to handle this URL
            // just fine.
            var url = this.staticPrefix + '/' + type + '/definition.json';

            url = this._buildUrl(url, context);

            retrieveFile(url, cb);
        },


        /**
         * Checks the given URL and adds a context query string.
         * @param url {String} the relative url
         * @param context {Object} the runtime context
         * @return {String}
         */
        _buildUrl: function (url, context) {

            if ('/' !== url.charAt(0)) {
                url = '/' + url;
            }

            // this is mainly used by html5app
            if (this.appConfig.pathToRoot) {
                url = this.appConfig.pathToRoot + url;
            }

            if (context) {
                url += '?' + Y.QueryString.stringify(context);
            }

            return url;
        },


        _validateInstance: function(base) {
            if (!base.type) {
                return false;
            }
            return true;
        }
    };

    Y.namespace('mojito').ResourceStore = ClientStore;

}, '0.1.0', {requires: [
    'mojito-util',
    'querystring-stringify-simple'
]});
