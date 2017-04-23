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
YUI.add('mojito-resource-store-adapter', function(Y, NAME) {

    var APP_ROOT_PATH = '',
        logger;


    Y.namespace('mojito').ResourceStoreAdapter = {

        ENV: '',


        init: function(env, resourceStore, globalLogger) {

            // must be passed the Mojito logger and use it for consistent
            // logging because the Y.log within this scope has not been mutated
            // yet
            logger = globalLogger;

            logger.log('resource store adapter init', 'mojito', NAME);

            APP_ROOT_PATH = resourceStore._root;

            this.ENV = env;
            this.store = resourceStore;

            this._root = resourceStore._root;
            this._staticURLs = resourceStore._staticURLs;

            return this;
        },


        expandInstance: function(instance, ctx, cb) {
            //logger.log('expandInstance', 'mojito', NAME);
            return this.expandInstanceForEnv(this.ENV, instance, ctx, cb);
        },


        expandInstanceForEnv: function(env, instance, context, callback) {
            var base = {},
                source = {},
                my = this;

            if (!instance.instanceId) {
                instance.instanceId = Y.guid();
                //DEBUGGING:  instance.instanceId += '-instance-common-' +
                //    [instance.base||'', instance.type||''].join('-');
            }
            // DEPRECATED, but kept in case a user is using.
            instance.guid = instance.instanceId;

            // What are being asked to expand?
            if (instance.base) {
                source.name = instance.base;
                source.func = this.getSpec;
            } else if (instance.type) {
                source.name = instance.type;
                source.func = this.getType;
            } else {
                // We don't have any inputs so fail
                throw new Error('There was no info in the "instance" object');
            }

            // This contains the app "definition" and app config
            my.getApp(env, context, function(app) {

                // Here we get either the a spec or a type
                source.func(env, source.name, context, function(err, data) {
                    if (err) {
                        callback(err, {});
                        return;
                    }

                    // Merge the inputs from right to left (right most values
                    // win)
                    base = my.merge(app, data, instance);

                    // Ensure the "instance" has been properly resolved. If
                    // there are no specs in the application.json file, there is
                    // an error below because the instance is invalid. We should
                    // check here for a valid instance object and throw an error
                    // if it is not. This happens because someone could create a
                    // routes.json file with routes that don't route to mojit
                    // instances, and the URI router creates invalid commands,
                    // which are passed into the dispatch.
                    if (!my.validate(base)) {
                        callback({
                            message: 'Instance was not valid.',
                            stack: Y.JSON.stringify(base, null, 4)
                        }, {});
                        return;
                    }

                    // Add the final "base" to the cache
                    my.cache(env, instance, context, base);

                    callback(null, base);
                }, my);
            });
        },


        getApp: function(env, context, callback) {
            var obj = {};

            callback(obj);
        },


        getAppPath: function() {
            return APP_ROOT_PATH;
        },


        getAppConfig: function(context, name) {
            return this.store.getAppConfig(context, name);
        },


        getSpec: function(env, id, context, callback, scope) {

            if (!scope) {
                scope = this;
            }

            scope.store.getSpec(env, id, context, callback);
        },


        getType: function(env, type, context, callback, scope) {

            if (!scope) {
                scope = this;
            }

            scope.store.getType(env, type, context, callback);
        },


        merge: function() {
            var obj = {},
                i;

            for (i = 0; i < arguments.length; i += 1) {
                obj = Y.mojito.util.mergeRecursive(obj, arguments[i]);
            }

            return obj;
        },


        validate: function(base) {

            if (!base.type || !base.yui) {
                return false;
            }
            return true;
        },


        isCached: function(env, instance, context) {
            return false;
        },


        getCached: function(env, instance, context) {
            return {};
        },


        cache: function(env, instance, context, obj) {
            return false;
        },


        getYuiConfigAllMojits: function(env, ctx) {
            //logger.log('getYuiConfigAllMojits', 'warn', NAME);
            return this.store.getYuiConfigAllMojits(env, ctx);
        },


        getYuiConfigApp: function(env, ctx) {
            //logger.log('getYuiConfigApp', 'warn', NAME);
            return this.store.getYuiConfigApp(env, ctx);
        },


        getYuiConfigFw: function(env, ctx) {
            //logger.log('getYuiConfigFw', 'warn', NAME);
            return this.store.getYuiConfigFw(env, ctx);
        },


        serializeClientStore: function(ctx, instances) {
            //logger.log('serializeClientStore', 'warn', NAME);
            return this.store.serializeClientStore(ctx, instances);
        },


        getMojitTypeDetails: function(env, ctx, mojitType, dest) {
            //logger.log('getMojitTypeDetails', 'warn', NAME);
            return this.store.getMojitTypeDetails(env, ctx, mojitType, dest);
        },


        fileFromStaticHandlerURL: function(url) {
            //logger.log('fileFromStaticHandlerURL', 'warn', NAME);
            return this.store.fileFromStaticHandlerURL(url);
        },


        getRoutes: function(ctx) {
            //logger.log('getRoutes', 'warn', NAME);
            return this.store.getRoutes(ctx);
        }
    };

}, '0.1.0', {requires: [
    'mojito-util'
]});
