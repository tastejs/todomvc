//    Backbone XMPP PubSub Storage v0.3

//    (c) 2012 Yiorgis Gozadinos.
//    Backbone.xmpp is distributed under the MIT license.
//    http://github.com/ggozad/Backbone.xmpp


// A simple module to replace **Backbone.sync** with *XMPP PubSub*-based
// persistence.

(function ($, _, Backbone, Strophe) {

    // A PubSub node acting as storage.
    // Create it with the `id` the node has on the XMPP server,
    // and a Strophe `connection`.
    var PubSubStorage = function(id, connection, payloadFormat) {
        this.id = id;
        this.connection = connection;
        this.payloadFormat = payloadFormat || 'json';
    };

    // Attach methods to **PubSubStorage**.
    _.extend(PubSubStorage.prototype, {

        // **create** publishes to the node the model in JSON format.
        //Resolves by setting the `id` on the item and returning it.
        create: function(model) {
            var d = $.Deferred(), res = {};
            this._publish(this.id, model)
                .done(function (id) {
                    res[model.idAttribute] = id;
                    d.resolve(res);
                })
                .fail(d.reject);
            return d.promise();
        },

        // **update** a model by re-publishing it on the node.
        // Resolves with no result as under no circumstances the server will change any attributes.
        update: function(model) {
            var d = $.Deferred();
            this._publish(this.id, model, model.id)
                .done(function () { d.resolve(); })
                .fail(d.reject);
            return d.promise();
        },

        // **getItem** retrieves a model from the node by `id`.
        // Resolves by returning the attributes of the model that are different and their values.
        getItem: function(model) {
            var d = $.Deferred(), that = this;
            this.connection.PubSub.items(this.id, {item_ids: [model.id]})
                .done(function (item) {
                    var updated = {},
                        attrs = that.parseItem(item);
                    _.each(attrs, function (value, key) {
                        if (model.get(key) !== value) updated[key] = value;
                    });
                    d.resolve(updated);
                })
                .fail(d.reject);
            return d.promise();
        },

        // **getItems** retrieves all models from the node.
        // Resolves by returning a list of all its models in JSON format.
        getItems: function(options) {
            var d = $.Deferred(), that = this;
            this.connection.PubSub.items(this.id, options)
                .done(function (data) {
                    var attrs,
                        items = data.rsm ? data.items : data;
                    d.resolve(_.map(items, function (item) {
                        attrs = that.parseItem($('entry', item));
                        attrs.id = $(item).attr('id');
                        return attrs;
                    }), data.rsm);
                })
                .fail(d.reject);
            return d.promise();
        },

        // **destroy** deletes the item correcsponding to the `model` from the node.
        // Resolves by returning the `iq` response.
        destroy: function(model) {
            return this.connection.PubSub.deleteItem(this.id, model.id);
        },

        // Publish in particular format
        _publish: function(node, model, item_id) {
            if (this.payloadFormat === 'atom') {
                return this.connection.PubSub.publishAtom(node, model.toJSON(), item_id);
            }
            else {
                var entry = $build('entry').t(JSON.stringify(model.toJSON())).tree();
                return this.connection.PubSub.publish(node, entry, item_id);
            }
        },

        parseItem: function(item) {
            if (this.payloadFormat === 'atom') {
                return this.connection.PubSub._AtomToJson(item);
            }
            else {
                return JSON.parse($(item).text());
            }
        }

    });

    // **xmppAsync** is the replacement for **sync**. It delegates sync operations
    // to the model or collection's `node` property, which should be an instance
    // of **PubSubStorage**.
    Backbone.xmppSync = function(method, model, options) {

        var p,
            node = model.node || (model.collection && model.collection.node);

        options = options || {};

        // If there is no node, fail directly, somebody did not read the docs.
        if (!node) return $.Deferred().reject().promise();

        switch (method) {
            case "read":    p = typeof model.id !== 'undefined' ? node.getItem(model) : node.getItems(options); break;
            case "create":  p = node.create(model); break;
            case "update":  p = node.update(model); break;
            case "delete":  p = node.destroy(model); break;
        }

        // Fallback for old-style callbacks.
        if (options.success) p.done(options.success);
        if (options.error) p.fail(options.error);

        return p;
    };

    this.PubSubStorage = PubSubStorage;

})(this.jQuery, this._, this.Backbone, this.Strophe);
