//    XMPP plugins for Strophe v0.2

//    (c) 2012 Yiorgis Gozadinos.
//    strophe.plugins is distributed under the MIT license.
//    http://github.com/ggozad/strophe.plugins


// A Pub-Sub plugin partially implementing
// [XEP-0060 Publish-Subscribe](http://xmpp.org/extensions/xep-0060.html)

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery', 'underscore', 'backbone', 'strophe'], function ($, _, Backbone, Strophe) {
            // Also create a global in case some scripts
            // that are loaded still are looking for
            // a global even when an AMD loader is in use.
            return factory($, _, Backbone, Strophe);
        });
    } else {
        // Browser globals
        factory(root.$, root._, root.Backbone, root.Strophe);
    }
}(this,function ($, _, Backbone, Strophe) {

    // Add the **PubSub** plugin to Strophe
    Strophe.addConnectionPlugin('PubSub', {

        _connection: null,
        service: null,
        events: {},

        // **init** adds the various namespaces we use and extends the component
        // from **Backbone.Events**.
        init: function (connection) {
            this._connection = connection;
            Strophe.addNamespace('PUBSUB', 'http://jabber.org/protocol/pubsub');
            Strophe.addNamespace('PUBSUB_EVENT', Strophe.NS.PUBSUB + '#event');
            Strophe.addNamespace('PUBSUB_OWNER', Strophe.NS.PUBSUB + '#owner');
            Strophe.addNamespace('PUBSUB_NODE_CONFIG', Strophe.NS.PUBSUB + '#node_config');
            Strophe.addNamespace('ATOM', 'http://www.w3.org/2005/Atom');
            Strophe.addNamespace('DELAY', 'urn:xmpp:delay');
            Strophe.addNamespace('RSM', 'http://jabber.org/protocol/rsm');
            _.extend(this, Backbone.Events);
        },

        // Register to PEP events when connected
        statusChanged: function (status, condition) {
            if (status === Strophe.Status.CONNECTED || status === Strophe.Status.ATTACHED) {
                this.service =  'pubsub.' + Strophe.getDomainFromJid(this._connection.jid);
                this._connection.addHandler(this._onReceivePEPEvent.bind(this), null, 'message', null, null, this.service);
            }
        },

        // Handle PEP events and trigger own events.
        _onReceivePEPEvent: function (ev) {
            var self = this,
                delay = $('delay[xmlns="' + Strophe.NS.DELAY + '"]', ev).attr('stamp');
            $('item', ev).each(function (idx, item) {
                var node = $(item).parent().attr('node'),
                    id = $(item).attr('id'),
                    entry = $('entry', item).filter(':first');
                if (entry.length) {
                    entry = entry[0];
                } else {
                    entry = null;
                }

                if (delay) {
                    // PEP event for the last-published item on a node.
                    self.trigger('xmpp:pubsub:last-published-item', {
                        node: node,
                        id: id,
                        entry: entry,
                        timestamp: delay
                    });
                    self.trigger('xmpp:pubsub:last-published-item:' + node, {
                        id: id,
                        entry: entry,
                        timestamp: delay
                    });
                } else {
                    // PEP event for an item newly published on a node.
                    self.trigger('xmpp:pubsub:item-published', {
                        node: node,
                        id: id,
                        entry: entry
                    });
                    self.trigger('xmpp:pubsub:item-published:' + node, {
                        id: id,
                        entry: entry
                    });
                }
            });

            // PEP event for the item deleted from a node.
            $('retract', ev).each(function (idx, item) {
                var node = $(item).parent().attr('node'),
                    id = $(item).attr('id');
                self.trigger('xmpp:pubsub:item-deleted', {node: node, id: id});
                self.trigger('xmpp:pubsub:item-deleted:' + node, {id: id});
            });

            return true;
        },

        // **createNode** creates a PubSub node with id `node` with configuration options defined by `options`.
        // See [http://xmpp.org/extensions/xep-0060.html#owner-create](http://xmpp.org/extensions/xep-0060.html#owner-create)
        createNode: function (node, options) {
            var d = $.Deferred(),
                iq = $iq({to: this.service, type: 'set', id: this._connection.getUniqueId('pubsub')})
                    .c('pubsub', {xmlns: Strophe.NS.PUBSUB})
                    .c('create', {node: node}),
                fields = [],
                option,
                form;

            if (options) {
                fields.push(new Strophe.x.Field({'var': 'FORM_TYPE', type: 'hidden', value: Strophe.NS.PUBSUB_NODE_CONFIG}));
                _.each(options, function (value, option) {
                    fields.push(new Strophe.x.Field({'var': option, value: value}));
                });
                form = new Strophe.x.Form({type: 'submit', fields: fields});
                iq.up().c('configure').cnode(form.toXML());
            }
            this._connection.sendIQ(iq, d.resolve, d.reject);
            return d.promise();
        },

        // **deleteNode** deletes the PubSub node with id `node`.
        // See [http://xmpp.org/extensions/xep-0060.html#owner-delete](http://xmpp.org/extensions/xep-0060.html#owner-delete)
        deleteNode: function (node) {
            var d = $.Deferred(),
                iq = $iq({to: this.service, type: 'set', id: this._connection.getUniqueId('pubsub')})
                .c('pubsub', {xmlns: Strophe.NS.PUBSUB_OWNER})
                .c('delete', {node: node});

            this._connection.sendIQ(iq, d.resolve, d.reject);
            return d.promise();
        },

        // **getNodeConfig** returns the node's with id `node` configuration options in JSON format.
        // See [http://xmpp.org/extensions/xep-0060.html#owner-configure](http://xmpp.org/extensions/xep-0060.html#owner-configure)
        getNodeConfig: function (node) {
            var d = $.Deferred(),
                iq = $iq({to: this.service, type: 'get', id: this._connection.getUniqueId('pubsub')})
                    .c('pubsub', {xmlns: Strophe.NS.PUBSUB_OWNER})
                    .c('configure', {node: node}),
                form;
            this._connection.sendIQ(iq, function (result) {
                form = Strophe.x.Form.fromXML($('x', result));
                d.resolve(form.toJSON().fields);
            }, d.reject);
            return d.promise();
        },

        // **discoverNodes** returns the nodes of a *Collection* node with id `node`.
        // If `node` is not passed, the nodes of the root node on the service are returned instead.
        // See [http://xmpp.org/extensions/xep-0060.html#entity-nodes](http://xmpp.org/extensions/xep-0060.html#entity-nodes)
        discoverNodes: function (node) {
            var d = $.Deferred(),
                iq = $iq({to: this.service, type: 'get', id: this._connection.getUniqueId('pubsub')});

            if (node) {
                iq.c('query', {xmlns: Strophe.NS.DISCO_ITEMS, node: node});
            } else {
                iq.c('query', {xmlns: Strophe.NS.DISCO_ITEMS});
            }
            this._connection.sendIQ(iq,
                function (result) {
                    d.resolve($.map($('item', result), function (item, idx) { return $(item).attr('node'); }));
                }, d.reject);
            return d.promise();
        },

        // **publish** publishes `item`, an XML tree typically built with **$build** to the node specific by `node`.
        // Optionally, takes `item_id` as the desired id of the item.
        // Resolves on success to the id of the item on the node.
        // See [http://xmpp.org/extensions/xep-0060.html#publisher-publish](http://xmpp.org/extensions/xep-0060.html#publisher-publish)
        publish: function (node, item, item_id) {
            var d = $.Deferred(),
                iq = $iq({to: this.service, type: 'set', id: this._connection.getUniqueId('pubsub')})
                    .c('pubsub', {xmlns: Strophe.NS.PUBSUB})
                    .c('publish', {node: node})
                    .c('item', item_id ? {id: item_id} : {})
                    .cnode(item);
            this._connection.sendIQ(iq.tree(),
                function (result) {
                    d.resolve($('item', result).attr('id'));
                }, d.reject);
            return d.promise();
        },

        // **publishAtom** publishes a JSON object as an ATOM entry.
        publishAtom: function (node, json, item_id) {
            json.updated = json.updated || (this._ISODateString(new Date()));
            return this.publish(node, this._JsonToAtom(json), item_id);
        },

        // **deleteItem** deletes the item with id `item_id` from the node with id `node`.
        // `notify` specifies whether the service should notify all subscribers with a PEP event.
        // See [http://xmpp.org/extensions/xep-0060.html#publisher-delete](http://xmpp.org/extensions/xep-0060.html#publisher-delete)
        deleteItem: function(node, item_id, notify) {
            notify = notify || true;
            var d = $.Deferred(),
                iq = $iq({to: this.service, type: 'set', id: this._connection.getUniqueId('pubsub')})
                .c('pubsub', {xmlns: Strophe.NS.PUBSUB })
                .c('retract', notify ? {node: node, notify: "true"} : {node: node})
                .c('item', {id: item_id});
            this._connection.sendIQ(iq.tree(), d.resolve, d.reject);
            return d.promise();
        },

        // **items** retrieves the items from the node with id `node`.
        // Optionally, you can specify `max_items` to retrieve a maximum number of items,
        // or a list of item ids with `item_ids` in `options` parameters.
        // See [http://xmpp.org/extensions/xep-0060.html#subscriber-retrieve](http://xmpp.org/extensions/xep-0060.html#subscriber-retrieve)
        // Resolves with an array of items.
        // Also if your server supports [Result Set Management](http://xmpp.org/extensions/xep-0059.html)
        // on PubSub nodes, you can pass in options an `rsm` object literal with `before`, `after`, `max` parameters.
        // You cannot specify both `rsm` and `max_items` or `items_ids`.
        // Requesting with `rsm` will resolve with an object literal with `items` providing a list of the items retrieved,
        //and `rsm` with `last`, `first`, `count` properties.

        items: function (node, options) {
            var d = $.Deferred(),
                iq = $iq({to: this.service, type: 'get'})
                .c('pubsub', {xmlns: Strophe.NS.PUBSUB })
                .c('items', {node: node});

            options = options || {};

            if (options.rsm) {
                var rsm = $build('set', {xmlns: Strophe.NS.RSM});
                _.each(options.rsm, function (val, key) { rsm.c(key, {}, val); });
                iq.up();
                iq.cnode(rsm.tree());
            } else if (options.max_items) {
                iq.attrs({max_items: options.max_items});
            } else if (options.item_ids) {
                _.each(options.item_ids, function (id) {
                    iq.c('item', {id: id}).up();
                });
            }

            this._connection.sendIQ(iq.tree(),
                function (res) {
                    var items = _.map($('item', res), function (item) {
                            return item.cloneNode(true);
                        });

                    if (options.rsm && $('set', res).length) {
                        d.resolve({
                            items: items,
                            rsm: {
                                count: parseInt($('set > count', res).text(), 10),
                                first: $('set >first', res).text(),
                                last: $('set > last', res).text()
                            }
                        });
                    } else {
                        d.resolve(items);
                    }

                }, d.reject);
            return d.promise();
        },

        // **subscribe** subscribes the user's bare JID to the node with id `node`.
        // See [http://xmpp.org/extensions/xep-0060.html#subscriber-subscribe](http://xmpp.org/extensions/xep-0060.html#subscriber-subscribe)
        subscribe: function (node) {
            var d = $.Deferred();
            var iq = $iq({to: this.service, type: 'set', id: this._connection.getUniqueId('pubsub')})
                .c('pubsub', {xmlns: Strophe.NS.PUBSUB })
                .c('subscribe', {node: node, jid: Strophe.getBareJidFromJid(this._connection.jid)});
            this._connection.sendIQ(iq, d.resolve, d.reject);
            return d.promise();
        },

        // **unsubscribe** unsubscribes the user's bare JID from the node with id `node`. If managing multiple
        // subscriptions it is possible to optionally specify the `subid`.
        // See [http://xmpp.org/extensions/xep-0060.html#subscriber-unsubscribe](http://xmpp.org/extensions/xep-0060.html#subscriber-unsubscribe)
        unsubscribe: function (node, subid) {
            var d = $.Deferred();
            var iq = $iq({to: this.service, type: 'set', id: this._connection.getUniqueId('pubsub')})
                .c('pubsub', {xmlns: Strophe.NS.PUBSUB })
                .c('unsubscribe', {node: node, jid: Strophe.getBareJidFromJid(this._connection.jid)});
            if (subid) iq.attrs({subid: subid});
            this._connection.sendIQ(iq, d.resolve, d.reject);
            return d.promise();
        },

        // **getSubscriptions** retrieves the subscriptions of the user's bare JID to the service.
        // See [http://xmpp.org/extensions/xep-0060.html#entity-subscriptions](http://xmpp.org/extensions/xep-0060.html#entity-subscriptions)
        getSubscriptions: function () {
            var d = $.Deferred();
            var iq = $iq({to: this.service, type: 'get', id: this._connection.getUniqueId('pubsub')})
                .c('pubsub', {xmlns: Strophe.NS.PUBSUB})
                .c('subscriptions'),
                $item;

            this._connection.sendIQ(iq.tree(),
                function (res) {
                    d.resolve(_.map($('subscription', res), function (item) {
                        $item = $(item);
                        return {
                            node: $item.attr('node'),
                            jid: $item.attr('jid'),
                            subid: $item.attr('subid'),
                            subscription: $item.attr('subscription')
                        };
                    }));
                }, d.reject);
            return d.promise();
        },

        // Private utility functions

        // **_ISODateString** converts a date to an ISO-formatted string.
        _ISODateString: function (d) {
            function pad(n) {
                return n < 10 ? '0' + n : n;
            }
            return d.getUTCFullYear() + '-' +
                pad(d.getUTCMonth() + 1) + '-' +
                pad(d.getUTCDate()) + 'T' +
                pad(d.getUTCHours()) + ':' +
                pad(d.getUTCMinutes()) + ':' +
                pad(d.getUTCSeconds()) + 'Z';
        },

        // **_JsonToAtom** produces an atom-format XML tree from a JSON object.
        _JsonToAtom: function (obj, tag) {
            var builder;

            if (!tag) {
                builder = $build('entry', {xmlns: Strophe.NS.ATOM});
            } else {
                builder = $build(tag);
            }
            _.each(obj, function (value, key) {
                if (typeof value === 'string') {
                    builder.c(key, {}, value);
                } else if (typeof value === 'number') {
                    builder.c(key, {}, value.toString());
                } else if (typeof value === 'boolean') {
                    builder.c(key, {}, value.toString());
                } else if (typeof value === 'object' && 'toUTCString' in value) {
                    builder.c(key, {}, this._ISODateString(value));
                } else if (typeof value === 'object') {
                    builder.cnode(this._JsonToAtom(value, key)).up();
                } else {
                    this.c(key).up();
                }
            }, this);
            return builder.tree();
        },

        // **_AtomToJson** produces a JSON object from an atom-formatted XML tree.
        _AtomToJson: function (xml) {
            var json = {},
                self = this,
                jqEl,
                val;

            $(xml).children().each(function (idx, el) {
                jqEl = $(el);
                if (jqEl.children().length === 0) {
                    val = jqEl.text();
                    if ($.isNumeric(val)) {
                        val = Number(val);
                    }
                    json[el.nodeName.toLowerCase()] = val;
                } else {
                    json[el.nodeName.toLowerCase()] = self._AtomToJson(el);
                }
            });
            return json;
        }

    });
}));
