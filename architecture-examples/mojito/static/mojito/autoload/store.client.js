/*
 * Copyright (c) 2011-2012, Yahoo! Inc.  All rights reserved.
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
            delete QUEUED[url];
            for (i = 0; i < q.length; i += 1) {
                q[i](err, data);
            }
        }
    };


    retrieveFile = function(url, callback) {
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
            callback(null, CACHE[url]);
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
        queue(url, callback);
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

        /*
         * TODO: REVIEW RE [Issue 76].
         */
        getSpec: function(env, id, context, callback) {

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
            url += '?' + Y.QueryString.stringify(context);

            // this is mainly used by html5app
            if (this.appConfig.pathToRoot) {
                url = this.appConfig.pathToRoot + url;
            }

            // use the compiled version if there was one built
            if (isCompiled(ns, specName)) {
                CACHE[url] = YUI._mojito._cache.compiled[ns].specs[specName];
                callback(null, CACHE[url]);
                return;
            }

            retrieveFile(url, callback);
        },


        /*
         * TODO: REVIEW RE [Issue 77]
         */
        getType: function(env, type, context, callback) {

            // This should really have the tunnelPrefix.  However, that
            // complicates offline apps (from `mojito build html5app`).
            // The mojito-handler-tunnel will be able to handle this URL
            // just fine.
            var url = this.staticPrefix + '/' + type + '/definition.json';
            url += '?' + Y.QueryString.stringify(context);

            // this is mainly used by html5app
            if (this.appConfig.pathToRoot) {
                url = this.appConfig.pathToRoot + url;
            }

            retrieveFile(url, callback);
        },


        /*
         * TODO: REVIEW RE [Issue 78]
         */
        getAppConfig: function(context, name) {
            return this.appConfig;
        },


        /*
         * TODO: REVIEW RE [Issue 78]
         */
        getRoutes: function() {
            return this.routes;
        }
    };

    Y.namespace('mojito').ResourceStore = ClientStore;

}, '0.1.0', {requires: [
    'mojito-util',
    'querystring-stringify-simple'
]});
