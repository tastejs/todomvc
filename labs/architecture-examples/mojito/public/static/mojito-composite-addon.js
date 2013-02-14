/*
 * Copyright (c) 2011-2013, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */


/*jslint anon:true, sloppy:true, nomen:true*/
/*global YUI*/


/**
 * @module ActionContextAddon
 */
YUI.add('mojito-composite-addon', function(Y, NAME) {

    function AdapterBuffer(buffer, id, callback) {
        this.buffer = buffer;
        this.id = id;
        this.callback = callback;
        this.__meta = [];
    }


    AdapterBuffer.prototype = {

        done: function(data, meta) {
            // HookSystem::StartBlock
            Y.mojito.hooks.hook('adapterBuffer', this.hook, 'end', this);
            // HookSystem::EndBlock
            this.buffer[this.id].meta = meta;
            this.buffer[this.id].data += data;
            this.buffer.__counter__ -= 1;
            if (this.buffer.__counter__ === 0) {
                // TODO: Check why this can be called more than once.
                this.callback();
            }
        },


        flush: function(data, meta) {
            this.buffer[this.id].meta = meta;
            this.buffer[this.id].data += data;
        },


        error: function(err) {
            Y.log("Error executing child mojit at '" + this.id + "':", 'error',
                    NAME);
            if (err.message) {
                Y.log(err.message, 'error', NAME);
            } else {
                Y.log(err, 'error', NAME);
            }
            if (err.stack) {
                Y.log(err.stack, 'error', NAME);
            }
            // Pass back some empty data so we don't fail the composite
            this.done('');
        }
    };


    /**
    * <strong>Access point:</strong> <em>ac.composite.*</em>
    * Provides methods for working with many Mojits.
    * @class Composite.common
    */
    function Addon(command, adapter, ac) {
        this.command = command;
        this.dispatch = ac._dispatch;
        this.ac = ac;
        this.adapter = adapter;
    }


    Addon.prototype = {

        namespace: 'composite',

        /**
         * Automatically dispatches all the children of this mojit and collects
         * their executed values into the view template, keyed by the child's
         * name within the mojit's configuration. For example, given the mojit
         * spec:
         *
         *
<pre>
"specs": {
    "parent": {
        "type": "MyCompositeMojit",
         "config": {
             "children": {
                 "foo": {
                     "type": "FooMojit"
                 },
                 "bar": {
                     "type": "BarMojit"
                 }
             }
         }
    }
        }
</pre>
         * And given the view template:
<pre>
&lt;div id=&quot;{{mojit_view_id}}&quot;&gt;
&lt;h1&gt;{{title}}&lt;/h1&gt;
&lt;div class=&quot;fooslot&quot;&gt;
    {{{foo}}}
&lt;/div&gt;
&lt;div class=&quot;barslot&quot;&gt;
    {{{bar}}}
&lt;/div&gt;
&lt;/div&gt;
</pre>
         * And the controller:
<pre>
Y.mojito.controller = {
    index: function(ac) {
        ac.composite.done({
            title: 'Hello there'
        });
    }
};
</pre>
         * This will execute the child intances of the "FooMojit" and
         * "BarMojit", returning their rendered values into the parent's view
         * template, thus rendering the full parent view including the children.
         * The API of this method is equivalent to ac.done().
         * @method done
         * @param {object} templateData The data you want return by the request.
         * @param {object} parentMeta Any meta-data required to service the request.
         */
        done: function(templateData, parentMeta) {
            var ac = this.ac,
                cfg = this.command.instance.config,
                children = cfg.children;

            templateData = templateData || {};
            parentMeta   = parentMeta || {};

            // Backward Compatibility block
            if (templateData.template) {
                Y.log('ac.composite.done({template:{title: "..."}}) is a legacy API, ' +
                        'use ac.composite.done({title: "..."}) instead.', 'warn', NAME);
                templateData = templateData.template;
            }

            if (!children || Y.Object.size(children) === 0) {
                throw new Error('Cannot run composite mojit children because' +
                                ' there are no children defined in the' +
                                ' composite mojit spec.');
            }

            this.execute(cfg, function(data, meta) {
                parentMeta.assets = Y.mojito.util.metaMerge(
                    parentMeta.assets || {},
                    meta.assets || {}
                );
                // 1. templateData and data are normally exclusive, in which case
                // the prority is not relevent. In which case we set D
                // 2. parentMeta and meta should be merged to preserve the children
                // binders map, assets, etc. but giving parentMeta the priority in case
                // a custom configuration in the parent should overrule something coming
                // from the chindren merged meta
                ac.done(Y.merge(data, templateData), Y.mojito.util.metaMerge(parentMeta, meta));
            }, this);
        },


        /**
         * This method requires an explicit config object and returns
         * a RMP compliant object via a callback.
         *
<pre>
cfg = {
    children: {
        slot-1: {
            type: "default",
            action: "index"
        },
        slot-2: {
            type: "default",
            action: "index",
            params: {
                route: {},
                url: {},
                body: {},
                file: {}
            }
        }
    },
    assets: {}
        }
</pre>
         *
         * The "callback" is an object containg the child slots with its
         * rendered data.
         *
<pre>
callback({
    slot-1: <string>,
    slot-2: <string>
        },
        {
   http: {}
   assets: {}
        })
</pre>
         * @method execute
         * @param {object} cfg The configuration object to be used.
         * @param {function} cb The callback that will be called.
         */
        execute: function(cfg, cb) {

            var ac = this.ac,
                buffer = {},
                content = {},
                my = this,
                meta = {};

            cfg.children = cfg.children || {};

            // check to ensure children is an Object, not an array
            if (Y.Lang.isArray(cfg.children)) {
                throw new Error('Cannot process children in the format of an' +
                                ' array. \'children\' must be an object.');
            }

            // HookSystem::StartBlock
            Y.mojito.hooks.hook('addon', this.adapter.hook, 'start', my, cfg);
            // HookSystem::EndBlock

            meta.children = cfg.children;

            buffer.__counter__ = Y.Object.size(cfg.children);

            this._dispatchChildren(cfg.children, this.command, buffer,
                function() {
                    var name;
                    // Reference the data we want from the "buffer" into our
                    // "content" obj Also merge the meta we collected.
                    for (name in buffer) {
                        if (buffer.hasOwnProperty(name) &&
                                name !== '__counter__') {
                            content[name] = buffer[name].data || '';

                            if (buffer[name].meta) {
                                meta = Y.mojito.util.metaMerge(meta,
                                        buffer[name].meta);
                            }
                        }
                    }

                    // Mix in the assets given via the config
                    if (cfg.assets) {
                        if (!meta.assets) {
                            meta.assets = {};
                        }
                        ac.assets.mixAssets(meta.assets, cfg.assets);
                    }

                    // HookSystem::StartBlock
                    Y.mojito.hooks.hook('addon', my.adapter.hook, 'end', my);
                    // HookSystem::EndBlock

                    cb(content, meta);
                });
        },


        _dispatchChildren: function(children, command, buffer, callback) {
            //Y.log('_dispatchChildren()', 'debug', NAME);

            var childName,
                child,
                childAdapter,
                newCommand,
                name;

            // Process deferred children before dispatching
            for (name in children) {
                if (children.hasOwnProperty(name)) {
                    child = children[name];

                    // check to ensure children doesn't have a null child
                    // in which case it will be automatically skipped to
                    // facilitate disabling children based on the context.
                    if (!child) {
                        continue;
                    }

                    // first off, check to see if this child's execution should be
                    // deferred
                    if (child.defer) {
                        // it doesn't make sense to have a deferred child with a
                        // proxy, because the defer means to proxy it
                        // through the LazyLoad mojit
                        if (Y.Lang.isObject(child.proxy)) {
                            throw new Error('Cannot specify a child mojit spec' +
                                            ' with both \'defer\' and \'proxy\'' +
                                            ' configurations, because \'defer\'' +
                                            ' assumes a \'proxy\' to the LazyLoad' +
                                            ' mojit.');
                        }
                        // aha! that means we will give it a proxy to the LazyLoad
                        // mojit, which will handle lazy execution on the client.
                        child.proxy = {
                            type: 'LazyLoad'
                        };
                    }
                    if (Y.Lang.isObject(child.proxy)) {
                        // found a proxy, replace the child with the proxy and shove
                        // the child to proxy into it
                        children[name] = child.proxy;
                        if (!children[name].config) {
                            children[name].config = {};
                        }
                        // remove any defer or proxy flags so it doesn't reload
                        // infinitely
                        child.proxy = undefined;
                        child.defer = false;
                        children[name].config.proxied = child;
                    }
                }
            }

            for (childName in children) {
                if (children.hasOwnProperty(childName)) {
                    child = children[childName];

                    // check to ensure children doesn't have a null child
                    // in which case it will be automatically skipped to
                    // facilitate disabling children based on the context.
                    if (!child) {
                        buffer.__counter__ -= 1;
                        continue;
                    }

                    // Create a buffer for the child
                    buffer[childName] = {name: childName, data: '', meta: {}};

                    // Make a new "command" that works in the context of this
                    // composite
                    newCommand = {
                        instance: child,
                        // use action in child spec or default to index
                        action: child.action || 'index',
                        context: command.context,
                        params: child.params || command.params
                    };

                    childAdapter = new AdapterBuffer(buffer, childName,
                            callback);

                    // HookSystem::StartBlock
                    // piping the hook handler into the child mojits
                    childAdapter.hook = this.adapter.hook;
                    // HookSystem::EndBlock

                    // HookSystem::StartBlock
                    Y.mojito.hooks.hook('adapterBuffer', this.adapter.hook, 'start', childAdapter);
                    // HookSystem::EndBlock
                    childAdapter = Y.mix(childAdapter, this.adapter);

                    this.dispatch(newCommand, childAdapter);
                }
            }
        }
    };

    Y.namespace('mojito.addons.ac').composite = Addon;

}, '0.1.0', {requires: [
    'mojito',
    'mojito-util',
    'mojito-hooks',
    'mojito-assets-addon',
    'mojito-params-addon'
]});
