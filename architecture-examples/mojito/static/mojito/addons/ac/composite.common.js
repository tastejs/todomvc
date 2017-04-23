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
YUI.add('mojito-composite-addon', function(Y, NAME) {

    function AdapterBuffer(buffer, id, callback) {
        this.buffer = buffer;
        this.id = id;
        this.callback = callback;
        this.__meta = [];
    }


    AdapterBuffer.prototype = {

        done: function(data, meta) {
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
            template: { title: 'Hello there' } // for the view only
        });
    }
        };
</pre>
         * This will execute the child intances of the "FooMojit" and
         * "BarMojit", returning their rendered values into the parent's view
         * template, thus rendering the full parent view including the children.
         * All the parent parameters are passed along to children.
         * @method done
         * @param {object} opts The configuration object to be used.
         *     <em>template<em> can be used to provide additional
         * view template values.
         */
        done: function(opts) {
            var template,
                ac = this.ac,
                cfg = this.command.instance.config,
                children = cfg.children;

            opts = opts || {};

            template = opts.template || {};

            if (!children || Y.Object.size(children) === 0) {
                throw new Error('Cannot run composite mojit children because' +
                                ' there are no children defined in the' +
                                ' composite mojit spec.');
            }

            this.execute(cfg, function(data, meta) {
                var merged = Y.merge(template, data);
                ac.done(merged, meta);

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
                meta = {};

            cfg.children = cfg.children || {};

            // check to ensure children is an Object, not an array
            if (Y.Lang.isArray(cfg.children)) {
                throw new Error('Cannot process children in the format of an' +
                                ' array. \'children\' must be an object.');
            }

            // check to ensure children doesn't have a null child
            // in which case it will be automatically discarded to
            // facilitate disabling childs based on the context.
            Y.Object.each(cfg.children, function(child, name) {
                if (!child) {
                    delete cfg.children[name];
                }
            });

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

                    cb(content, meta);
                });
        },


        _dispatchChildren: function(children, command, buffer, callback) {
            //Y.log('_dispatchChildren()', 'debug', NAME);

            var childName,
                child,
                childAdapter,
                newCommand;

            // Process deferred children before dispatching
            Y.Object.each(children, function(child, name) {
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
                    delete child.proxy;
                    if (!children[name].config) {
                        children[name].config = {};
                    }
                    // remove any defer or proxy flags so it doesn't reload
                    // infinitely
                    child.proxy = undefined;
                    child.defer = false;
                    children[name].config.proxied = child;
                }
            });

            for (childName in children) {
                if (children.hasOwnProperty(childName)) {
                    child = children[childName];
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
                    childAdapter = Y.mix(childAdapter, this.adapter);

                    this.dispatch(newCommand, childAdapter);
                }
            }
        }
    };

    Y.namespace('mojito.addons.ac').composite = Addon;

}, '0.1.0', {requires: [
    'mojito-util',
    'mojito-params-addon'
]});
