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
YUI.add('mojito-output-adapter-addon', function(Y, NAME) {

    var CHARSET = 'charset=utf-8',
        // the functions this core addon is going to attach to the
        // ActionContext
        flush,
        done,
        error,

        // serializer container
        serializer,
        // private functions
        serialize_xml,
        serialize_json,
        sanitizeConfigCopy,
        sanitizeChildren,
        attachChildViewIdsToMetaChildren;


    /* see action-context.common.js for docs */
    flush = function(data, meta) {
        // NOTE: 'this' is the ActionContext instance
        return this.done(data, meta, true);
    };


    /* see action-context.common.js for docs */
    done = function(data, meta, more) {
        // NOTE: 'this' is the ActionContext instance
        var callbackFunc = more ? 'flush' : 'done',
            instance = this.command.instance,
            adapter = this._adapter,
            action = this.command.action,
            mojitView,
            renderer = null,
            contentType,
            contentPath;

        if (Y.Lang.isString(meta)) {
            // If the meta string is a serializer set it
            if (serializer[meta]) {
                meta = {
                    serialize: meta
                };
            } else {// Otherwise we think it is a template name
                meta = {
                    view: {name: meta}
                };
            }
        }

        meta = meta || {};
        meta.assets = meta.assets || {};
        meta.assets.bottom = meta.assets.bottom || {};
        meta.assets.bottom.js = meta.assets.bottom.js || [];
        meta.http = meta.http || {};
        meta.http.code = meta.http.code || 200;
        meta.http.headers = meta.http.headers || {};
        meta.view = meta.view || {};

        // Cache all tempates by default
        meta.view.cacheTemplates = true;

        if (this.app && this.app.config && this.app.config.cacheViewTemplates) {
            meta.view.cacheTemplates = this.app.config.cacheViewTemplates ||
                false;
        }

        // Check to see we need to serialize the data
        if (meta.serialize && serializer[meta.serialize]) {
            // Warning: this metod can change the "meta" object
            data = serializer[meta.serialize].apply(this, [data, meta]);
            // Once we are done remove the "serialize" option so others don't
            // use it by mistake
            delete meta.serialize;
        }

        // We want to know the view name, id, and binder used later so make sure
        // "meta" is up-to-date
        meta.view.name = meta.view.name || action;
        // TODO: Use a different binder
        meta.view.binder = meta.view.binder || meta.view.name;
        mojitView = instance.views[meta.view.name];
        if (!meta.view.id) {
            meta.view.id = Y.guid();
            //DEBUGGING:  meta.view.id += '-viewId-' +
            //  this.command.instance.type + '-' + this.command.action;
        }

        // If we are given "meta.view['content-path']" use it over what we got
        // from "instance.views"
        if (mojitView && meta.view['content-path']) {
            mojitView['content-path'] = meta.view['content-path'];
        }

        // If we are given "meta.view['engine']" use it over what we got from
        // "instance.views"
        if (mojitView && meta.view.engine) {
            mojitView.engine = meta.view.engine;
        }

        // Here we ask each "thing" attached to the AC if it wants to add view
        // "meta"
        Y.Object.each(this, function(item) {
            if (item && Y.Lang.isFunction(item.mergeMetaInto)) {
                item.mergeMetaInto(meta);
            }
        });

        contentType = meta.http.headers['content-type'];

        attachChildViewIdsToMetaChildren(meta.children, meta.binders);

        if (!meta.binders) {
            meta.binders = {};
        }

        // Don't clobber an existing meta.binders[meta.view.id] entry
        if (!meta.binders[meta.view.id]) {
            meta.binders[meta.view.id] = {
                base: instance.base,
                action: action,
                config: sanitizeConfigCopy(instance.config),
                type: instance.type,
                viewId: meta.view.id,
                guid: instance.instanceId, // DEPRECATED, use instanceId
                instanceId: instance.instanceId,
                // We don't use the actual config's children object, because
                // that might not have been what was actually dispatched. We get
                // the actual children config that was dispatched through the
                // meta object.
                children: sanitizeChildren(meta.children)
            };
        }

        /*
         * Here we provide an easy way to return a string
         * data == 'a string of chars'
         */
        if (Y.Lang.isString(data)) {
            // if the user didn't provided a content type, we'll make it plain
            // text
            if (!contentType) {
                meta.http.headers['content-type'] = ['text/plain; ' + CHARSET];
            }
            //Y.log('pushing to native adapter', 'info', NAME);
            adapter[callbackFunc](data, meta);
            Y.log('dispatch complete for ' + instance.instanceId, 'mojito',
                  'qeperf');
            return;
        }

        // there may not be a view if this is running on the client
        if (mojitView) {

            data = data || {}; // default null data to empty view template

            // Get the YUI Module name of the Binder if we can.
            if (meta.binders[meta.view.id]) {
                meta.binders[meta.view.id].name = mojitView['binder-module'];
                meta.binders[meta.view.id].needs =
                    mojitView['binder-yui-sorted'];
            }

            if (!contentType) {
                meta.http.headers['content-type'] = ['text/html; ' + CHARSET];
            }

            data.mojit_guid = instance.instanceId;
            data.mojit_view_id = meta.view.id;
            data.mojit_assets = this.command.instance.assetsRoot;

            // Use engine to compile template view
            Y.log('Rendering "' + meta.view.name + '" view for "' +
                (instance.id || '@' + instance.type) + '"', 'info', NAME);

            contentPath = mojitView['content-path'];
            // this is mainly used by html5app
            if (this.app.config.pathToRoot) {
                contentPath = this.app.config.pathToRoot + contentPath;
            }


            renderer = new Y.mojito.ViewRenderer(
                mojitView.engine,
                meta.view.id
            );
            renderer.render(data, instance.type, contentPath, adapter,
                meta, more);
        } else {

            if (Y.Lang.isObject(data)) {
                throw new Error("Missing view template: '" + meta.view.name +
                    "'");
            }
            adapter[callbackFunc](data, meta);
        }

        // Time marker
        Y.mojito.perf.mark('mojito', 'core_action_end[' + instance.type +
                ':' + action + ']', 'ac.done() completed for Mojit "' +
                instance.type + '" with action "' + action + '"');
    };


    /* see action-context.common.js for docs */
    error = function(err) {
        // NOTE: 'this' is the ActionContext instance
        this._adapter.error(err);
    };


    sanitizeConfigCopy = function(cfg) {
        var copy;
        if (!Y.Lang.isObject(cfg)) {
            return cfg;
        }
        copy = Y.mojito.util.copy(cfg);
        copy.children = sanitizeChildren(copy.children);
        return copy;
    };


    sanitizeChildren = function(children) {
        if (!Y.Lang.isObject(children)) {
            return children;
        }
        Y.Object.each(children, function(v, k) {
            // We don't want child params to be included within a mojit's
            // configuration, because it can leak implemenation details out to
            // other execution environments. For example, the client runtime
            // does not need to have the parameters of the mojits that were used
            // to construct the initial client DOM.
            delete children[k].params;
        });
        return children;
    };


    attachChildViewIdsToMetaChildren = function(children, binders) {
        if (!children) {
            return;
        }
        Y.Object.each(binders, function(binderData, viewId) {
            Y.Object.each(children, function(childData) {
                if (binderData.instanceId === childData.instanceId) {
                    childData.viewId = viewId;
                }
            });
        });
    };


    /*
     * @method serialize_json
     * @private
     * @param {object} data
     * @param {object} meta
     * @return {string}
     */
    serialize_json = function(data, meta) {
        meta.http.headers['content-type'] = ['application/json; ' + CHARSET];

        try {
            return Y.JSON.stringify(data);
        } catch (err) {
            throw new Error('Expected JSON data, but there was a parse error' +
                    ' on the string: \"' + data);
        }

    };


    /*
     * @method serialize_xml
     * @private
     * @param {object} data
     * @param {object} meta
     * @return {string}
     */
    serialize_xml = function(data, meta) {
        // A dirty XML function I found on the interwebs
        function simpleXml(js, wraptag) {
            if (js instanceof Object) {
                return simpleXml(Object.keys(js).map(function(key) {
                    return simpleXml(js[key], key);
                }).join('\n'), wraptag);
            } else {
                return ((wraptag) ? '<' + wraptag + '>' : '') + js +
                    ((wraptag) ? '</' + wraptag + '>' : ''
                    );
            }
        }

        meta.http.headers['content-type'] = ['application/xml; ' + CHARSET];
        if (Y.Lang.isObject) {
            try {
                return simpleXml(data, 'xml');
            } catch (err) {
                throw new Error('Expected XML data, but there was a parse' +
                        ' error on the string: \"' + data);
            }
        }

        return '';
    };


    serializer = {
        json: serialize_json,
        xml: serialize_xml
    };


    /**
     * <strong>Access point:</strong> <em>ac.*</em>
     * The main API point for developers in a Controller. This addon provides
     * the core functions
     * of the ActionContext: <em>flush</em>, <em>done</em>, and <em>error</em>.
     * @class OutputAdapter.common
     * @private
     */
    function Addon(command, adapter, ac) {
        /*
         * This plugin doesn't act the same way as the others. It attaches its
         * functions directly onto the ActionContext. Each functions is assumed
         * that 'this' will be the actual instance of ActionContext, not the
         * object this constructor is creating.
         */
        ac.flush = flush;
        ac.done = done;
        ac.error = error;
    }

    Y.namespace('mojito.addons.ac').core = Addon;

}, '0.1.0', {requires: [
    'json-stringify',
    'event-custom-base',
    'mojito-view-renderer',
    'mojito-util'
]});
